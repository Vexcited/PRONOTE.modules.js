exports.MoteurForumPedagogique = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeChaineHtml_1 = require("TypeChaineHtml");
const ObjetElement_1 = require("ObjetElement");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TypesForumPedagogique_1 = require("TypesForumPedagogique");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const UtilitaireFenetreSelectionPublic_1 = require("UtilitaireFenetreSelectionPublic");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const tag_1 = require("tag");
const Invocateur_1 = require("Invocateur");
const Enumere_Espace_1 = require("Enumere_Espace");
var TypeCommandeSujet;
(function (TypeCommandeSujet) {
	TypeCommandeSujet["modifier"] = "modifier";
	TypeCommandeSujet["dupliquer"] = "dupliquer";
	TypeCommandeSujet["verrouiller"] = "verrouiller";
	TypeCommandeSujet["deverrouiller"] = "deverrouiller";
	TypeCommandeSujet["nettoyer"] = "nettoyer";
	TypeCommandeSujet["supprimer"] = "supprimer";
	TypeCommandeSujet["modifierExclus"] = "modifierExclus";
})(TypeCommandeSujet || (TypeCommandeSujet = {}));
class MoteurForumPedagogique {
	constructor(aParams) {
		this.indicePostLuEnCours = -1;
		this.applicationSco = GApplication;
		this.options = Object.assign(
			{
				pere: null,
				ouvrirEditionSujetPromise: null,
				callbackActualisationSujets: null,
				callbackSaisiePost: null,
			},
			aParams,
		);
		if (this.options.pere) {
			Invocateur_1.Invocateur.abonner(
				ObjetRequeteJSON_1.utils.getIdentNotification(
					"actualisation_postForum",
				),
				() => {
					if (
						this.options.callbackActualisationSujets &&
						!this._callbackActualisationSujets_enCours
					) {
						this.options.callbackActualisationSujets();
					}
				},
				this.options.pere,
			);
		}
	}
	getOptions() {
		return this.options;
	}
	setOptions(aOptions) {
		Object.assign(this.options, aOptions);
		return this;
	}
	avecGestionThemes() {
		if (this.applicationSco.estPrimaire) {
			return false;
		}
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			return this.applicationSco.parametresUtilisateur.get(
				"avecGestionDesThemes",
			);
		}
		return true;
	}
	setIndicePostLu(aIndice) {
		if (aIndice >= 0) {
			this.indicePostLuEnCours = Math.max(aIndice, this.indicePostLuEnCours);
		} else {
			this.indicePostLuEnCours = aIndice;
		}
	}
	async requetePostsLu(aParams) {
		const lParams = Object.assign(
			{
				ancienSujet: null,
				listePosts: null,
				nouveauSujet: null,
				sansActualisation: false,
			},
			aParams,
		);
		const lIndicePost = this.indicePostLuEnCours;
		this.setIndicePostLu(-1);
		const lPost =
			lIndicePost >= 0 && lParams.listePosts
				? lParams.listePosts.get(lIndicePost)
				: null;
		if (
			lPost &&
			lParams.ancienSujet &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			await new ObjetRequeteSaisieForumPedagogique(
				this.options.pere,
			).lancerRequete({
				type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
					.fpcs_Post_ModifierLu,
				post: lPost,
				sujet: lParams.ancienSujet,
			});
			if (!lParams.sansActualisation) {
				await this._callbackActualisationSujets({
					sujetSelection: lParams.nouveauSujet || lParams.ancienSujet,
				});
			}
			return true;
		}
		return false;
	}
	async requeteListeSujets() {
		const lReponse = await new ObjetRequeteForumPedagogique(
			this.options.pere,
		).lancerRequete({
			type: TypesForumPedagogique_1.TypeForumPedaCommandeRequete.fpcr_Sujets,
		});
		return lReponse.listeSujets;
	}
	requeteListePosts(aParams) {
		const lParams = Object.assign(
			{ sujet: null, avecSujet: true, modeVisuMembre: false },
			aParams,
		);
		if (!lParams.sujet) {
			return Promise.resolve();
		}
		return new ObjetRequeteForumPedagogique(this.options.pere)
			.lancerRequete(
				Object.assign(
					{
						type: TypesForumPedagogique_1.TypeForumPedaCommandeRequete
							.fpcr_Posts,
					},
					lParams,
				),
			)
			.then(
				(aJSON) => {
					return aJSON;
				},
				() => {
					return this._callbackActualisationSujets().then(() => false);
				},
			);
	}
	async requeteConsigneVisible(aSujet, aConsigneVisible) {
		if (
			aSujet &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			) &&
			!(
				aSujet.roles.count() === 1 &&
				aSujet.roles.contains(
					TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Visiteur,
				)
			)
		) {
			return await new ObjetRequeteSaisieForumPedagogique(
				this.options.pere,
			).lancerRequete({
				type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
					.fpcs_ModifierConsigneVisibleSujet,
				sujet: aSujet,
				consigneVisible: !!aConsigneVisible,
			});
		}
		return false;
	}
	async editerSujet(aSujetEdition) {
		const lSurCreationSujet = !aSujetEdition;
		if (!this.options.callbackActualisationSujets) {
			throw new Error();
		}
		let lSujet;
		try {
			const lReponse = await new ObjetRequeteForumPedagogique(
				this.options.pere,
			).lancerRequete({
				type: TypesForumPedagogique_1.TypeForumPedaCommandeRequete
					.fpcr_DetailSujet,
				sujet: aSujetEdition,
				surCreationSujet: lSurCreationSujet,
			});
			if (lSurCreationSujet) {
				lSujet = Object.assign(this._getSujetParDefaut(), lReponse.sujet);
			} else {
				lSujet = lReponse.sujet;
			}
		} catch (e) {
			await this._callbackActualisationSujets();
			throw new Error();
		}
		const lResultEdition = await this.options.ouvrirEditionSujetPromise(
			lSujet,
			lSurCreationSujet,
		);
		if (lResultEdition && lResultEdition.sujet) {
			const lParams = {
				type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
					.fpcs_CreerModifierSujet,
				sujet: lResultEdition.sujet,
				estEdition: !lSurCreationSujet,
			};
			const lListeFichiers =
				lResultEdition.sujet.listeFichiers ||
				new ObjetListeElements_1.ObjetListeElements();
			try {
				const lResultSaisie = await new ObjetRequeteSaisieForumPedagogique(
					this.options.pere,
				)
					.addUpload({
						listeFichiers: lListeFichiers,
						listeDJCloud: lListeFichiers,
					})
					.lancerRequete(lParams);
				let lSujetASelectioner = null;
				if (lSurCreationSujet && lResultSaisie.JSONRapportSaisie) {
					lSujetASelectioner = lResultSaisie.JSONRapportSaisie.sujet;
				}
				await this._callbackActualisationSujets({
					sujetSelection: lSujetASelectioner,
				});
			} catch (e) {}
		}
	}
	getCommandesMenuContextuelSujet(aSujet) {
		if (!aSujet) {
			return [];
		}
		const lEstModerateur = aSujet.roles.contains(
			TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Moderateur,
		);
		const lResult = [];
		if (lEstModerateur) {
			lResult.push(TypeCommandeSujet.modifier);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.forum.avecCreationSujetForum,
			)
		) {
			lResult.push(TypeCommandeSujet.dupliquer);
		}
		if (lEstModerateur) {
			lResult.push(TypeCommandeSujet.modifierExclus);
		}
		if (
			lEstModerateur &&
			[
				TypesForumPedagogique_1.TypeEtatPub.EP_Ouvert,
				TypesForumPedagogique_1.TypeEtatPub.EP_Suspendu,
			].includes(aSujet.etatPub)
		) {
			lResult.push(TypeCommandeSujet.verrouiller);
		}
		if (
			lEstModerateur &&
			[
				TypesForumPedagogique_1.TypeEtatPub.EP_Verrou,
				TypesForumPedagogique_1.TypeEtatPub.EP_Suspendu,
			].includes(aSujet.etatPub)
		) {
			lResult.push(TypeCommandeSujet.deverrouiller);
		}
		if (
			aSujet.roles.contains(
				TypesForumPedagogique_1.TypeRoleIndividuSujet.RIS_Auteur,
			)
		) {
			lResult.push(TypeCommandeSujet.nettoyer);
			lResult.push(TypeCommandeSujet.supprimer);
		}
		return lResult;
	}
	addCommandesMenuContextuelSujet(aParametresListe) {
		const lSujet = aParametresListe.article;
		const lCommandes = this.getCommandesMenuContextuelSujet(lSujet);
		if (lCommandes.includes(TypeCommandeSujet.modifier)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Menu_Modifier"),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					return this.editerSujet(lSujet);
				},
				{ icon: "icon_pencil" },
			);
		}
		if (lCommandes.includes(TypeCommandeSujet.dupliquer)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Menu_Dupliquer"),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					new ObjetRequeteSaisieForumPedagogique(this.options.pere)
						.lancerRequete({
							type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
								.fpcs_DupliquerSujet,
							sujet: lSujet,
						})
						.then((aParamsRequete) => {
							let lSujetASelectioner = aParamsRequete.JSONRapportSaisie
								? aParamsRequete.JSONRapportSaisie.sujet
								: null;
							this._callbackActualisationSujets({
								sujetSelection: lSujetASelectioner,
							});
						});
				},
				{ icon: "icon_dupliquer" },
			);
		}
		if (lCommandes.includes(TypeCommandeSujet.modifierExclus)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"ForumPeda.Menu_ModifierBannis",
				),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					this._modifierExclusSujet(lSujet);
				},
				{ icon: "icon_user mix-icon_ne_pas_deranger i-red" },
			);
		}
		if (lCommandes.includes(TypeCommandeSujet.verrouiller)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Menu_Verrouiller"),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					new ObjetRequeteSaisieForumPedagogique(this.options.pere)
						.lancerRequete({
							type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
								.fpcs_ModifierEtatSujet,
							sujet: lSujet,
							verrouiller: true,
						})
						.then(() => {
							this._callbackActualisationSujets();
						});
				},
				{ icon: "icon_lock" },
			);
		}
		if (lCommandes.includes(TypeCommandeSujet.deverrouiller)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"ForumPeda.Menu_Deverrouiller",
				),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					if (
						lSujet.etatPub === TypesForumPedagogique_1.TypeEtatPub.EP_Suspendu
					) {
						this._confirmDeverrouillerSuspensionSujet(lSujet).then(
							(aResult) => {
								if (aResult !== false) {
									this._callbackActualisationSujets();
								}
							},
						);
					} else {
						new ObjetRequeteSaisieForumPedagogique(this.options.pere)
							.lancerRequete({
								type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
									.fpcs_ModifierEtatSujet,
								sujet: lSujet,
								verrouiller: false,
							})
							.then(() => {
								this._callbackActualisationSujets();
							});
					}
				},
				{ icon: "icon_unlock_alt" },
			);
		}
		if (lCommandes.includes(TypeCommandeSujet.nettoyer)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Menu_Nettoyer"),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					this.applicationSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.ConfirmationNettoyer",
							),
						})
						.then((aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								new ObjetRequeteSaisieForumPedagogique(this.options.pere)
									.lancerRequete({
										type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
											.fpcs_NettoyerSujet,
										sujet: lSujet,
									})
									.then(() => {
										this._callbackActualisationSujets({
											sujetSelection: lSujet,
										});
									});
							}
						});
				},
				{ icon: "icon_purger_messages" },
			);
		}
		if (lCommandes.includes(TypeCommandeSujet.supprimer)) {
			aParametresListe.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"ForumPeda.Menu_SupprimerSelection",
				),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					this.applicationSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"ForumPeda.ConfirmationSuppression",
							),
						})
						.then((aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								new ObjetRequeteSaisieForumPedagogique(this.options.pere)
									.lancerRequete({
										type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
											.fpcs_SupprimerSujet,
										sujet: lSujet,
									})
									.then(() => {
										this._callbackActualisationSujets();
									});
							}
						});
				},
				{ icon: "icon_trash" },
			);
		}
	}
	async saisieCommandePost(aParams, aSujetSelection) {
		const lParams = Object.assign({ type: null }, aParams);
		let lMessageConfirmation = "";
		let lControleur = null;
		if (
			lParams.type ===
			TypesForumPedagogique_1.TypeForumPedaCommandeSaisie.fpcs_Post_Action
		) {
			switch (lParams.action) {
				case TypesForumPedagogique_1.TypeActionPost.AP_SignalerModeration: {
					lMessageConfirmation = ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ConfirmationSignalementModeration",
					);
					break;
				}
				case TypesForumPedagogique_1.TypeActionPost.AP_SignalerSPR: {
					lMessageConfirmation = ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ConfirmationSignalementSPR",
					);
					break;
				}
				case TypesForumPedagogique_1.TypeActionPost
					.AP_SupprimerDefinitivement: {
					lMessageConfirmation = ObjetTraduction_1.GTraductions.getValeur(
						"ForumPeda.ConfirmationSuppressionPost",
					);
					break;
				}
				case TypesForumPedagogique_1.TypeActionPost.AP_ExclureAuteur: {
					lParams.typeBlocage =
						TypesForumPedagogique_1.TypeGenreActionSurPostForum.APF_Aucune;
					lControleur = {
						rb: {
							getValue(aType) {
								return lParams.typeBlocage === aType;
							},
							setValue(aType) {
								lParams.typeBlocage = aType;
							},
						},
					};
					lMessageConfirmation = [
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ConfirmationExclureEleve1",
							[lParams.post.strAuteur],
						),
						(0, tag_1.tag)("br"),
						ObjetTraduction_1.GTraductions.getValeur(
							"ForumPeda.ConfirmationExclureEleve2",
						),
						(0, tag_1.tag)("br"),
						(0, tag_1.tag)(
							"div",
							{ class: "p-top p-left large" },
							(0, tag_1.tag)(
								"ie-radio",
								{
									"ie-model": tag_1.tag.funcAttr(
										"rb",
										TypesForumPedagogique_1.TypeGenreActionSurPostForum
											.APF_Aucune,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"ForumPeda.ConfirmationAucunPost",
								),
							),
							(0, tag_1.tag)("br"),
							(0, tag_1.tag)(
								"ie-radio",
								{
									"ie-model": tag_1.tag.funcAttr(
										"rb",
										TypesForumPedagogique_1.TypeGenreActionSurPostForum
											.APF_RefuserLePost,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"ForumPeda.ConfirmationCePost",
								),
							),
							(0, tag_1.tag)("br"),
							(0, tag_1.tag)(
								"ie-radio",
								{
									"ie-model": tag_1.tag.funcAttr(
										"rb",
										TypesForumPedagogique_1.TypeGenreActionSurPostForum
											.APF_RefuserTousLesPosts,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"ForumPeda.ConfirmationTousLesPosts",
								),
							),
						),
					].join("");
				}
			}
		}
		if (lMessageConfirmation) {
			const lResult = await this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: lMessageConfirmation,
					controleur: lControleur,
				});
			if (lResult !== Enumere_Action_1.EGenreAction.Valider) {
				return;
			}
		}
		const lReponse = await new ObjetRequeteSaisieForumPedagogique(
			this.options.pere,
		).lancerRequete(lParams);
		if (
			lReponse.JSONRapportSaisie &&
			lReponse.JSONRapportSaisie.confirmDebloquerSuspension &&
			lReponse.JSONRapportSaisie.sujet
		) {
			await this._confirmDeverrouillerSuspensionSujet(
				lReponse.JSONRapportSaisie.sujet,
			);
		}
		return await this._callbackActualisationSujets({
			sujetSelection: aSujetSelection,
			typeSaisiePost: lParams.type,
		});
	}
	getStrNbParticipantsSujet(aSujet) {
		return aSujet.nbMembres > 1
			? ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Participants_D", [
					aSujet.nbMembres,
				])
			: ObjetTraduction_1.GTraductions.getValeur("ForumPeda.Participant_D", [
					aSujet.nbMembres,
				]);
	}
	getStrMessageParticipationFermee(aSujet) {
		if (
			aSujet.etatPub === TypesForumPedagogique_1.TypeEtatPub.EP_Ferme &&
			aSujet.heureAvant &&
			aSujet.heureApres
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"ForumPeda.ParticipationPossibleDeA_SS",
				[
					ObjetDate_1.GDate.formatDate(aSujet.heureApres, "%hh%sh%mm"),
					ObjetDate_1.GDate.formatDate(aSujet.heureAvant, "%hh%sh%mm"),
				],
			);
		}
		return "";
	}
	_getSujetParDefaut() {
		const lUtilisateur = GEtatUtilisateur.getUtilisateur();
		return ObjetElement_1.ObjetElement.create({
			titre: "",
			matiere: null,
			listeThemes: new ObjetListeElements_1.ObjetListeElements(),
			htmlPost: "",
			listeFichiers: new ObjetListeElements_1.ObjetListeElements(),
			listeMembres: new ObjetListeElements_1.ObjetListeElements(),
			listeModerateurs: new ObjetListeElements_1.ObjetListeElements().add(
				ObjetElement_1.ObjetElement.create({
					Numero: lUtilisateur.getNumero(),
					Genre: lUtilisateur.getGenre(),
					nonModifiable: true,
				}),
			),
			genreModeration:
				TypesForumPedagogique_1.TypeGenreModerationForum.GMF_APriori,
			visiteurs: new TypeEnsembleNombre_1.TypeEnsembleNombre([
				TypesForumPedagogique_1.TypeGenreVisiteurForum.GVF_SPR,
			]),
			avecHoraires: false,
			heureApres: new Date(0, 0, 0, 6, 0, 0, 0),
			heureAvant: new Date(0, 0, 0, 22, 0, 0, 0),
		});
	}
	async _confirmDeverrouillerSuspensionSujet(aSujet) {
		const lResult = await this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"ForumPeda.ConfirmationEnleverSuspensionSujet",
				),
			});
		if (lResult === Enumere_Action_1.EGenreAction.Valider) {
			return await new ObjetRequeteSaisieForumPedagogique(
				this.options.pere,
			).lancerRequete({
				type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
					.fpcs_ModifierEtatSujet,
				sujet: aSujet,
				verrouiller: false,
			});
		}
		return false;
	}
	async _modifierExclusSujet(aSujet) {
		const lReponse = await new ObjetRequeteForumPedagogique(
			this.options.pere,
		).lancerRequete({
			type: TypesForumPedagogique_1.TypeForumPedaCommandeRequete
				.fpcr_ExclusSujet,
			sujet: aSujet,
		});
		const lListeRessources = lReponse.listeMembres;
		const lListeSelec = lReponse.listeExclus;
		const lGenreRessource = Enumere_Ressource_1.EGenreRessource.Eleve;
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
			{
				pere: this.options.pere,
				evenement: (aGenre, aListe, aNumeroBouton) => {
					if (aNumeroBouton === 1) {
						return new ObjetRequeteSaisieForumPedagogique(this.options.pere)
							.lancerRequete({
								type: TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
									.fpcs_ModifierExclusSujet,
								sujet: aSujet,
								listeExclus: lListeSelec.setSerialisateurJSON({
									ignorerEtatsElements: true,
								}),
							})
							.then(() => {
								return this.options.callbackActualisationSujets();
							});
					}
				},
			},
		);
		lFenetre.setOptionsFenetre({ masquerListeSiVide: false });
		lFenetre.setOptionsFenetreSelectionRessource({ avecCocheRessources: true });
		lFenetre.setOptions({ estDeploye: true });
		const lGenreCumul = (0,
		UtilitaireFenetreSelectionPublic_1.getCumulPourFenetrePublic)(
			lGenreRessource,
			false,
			lListeRessources.count(),
		);
		if (lGenreCumul) {
			const lListeCumuls = new ObjetListeElements_1.ObjetListeElements();
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Classe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
					0,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("actualites.Cumul.Groupe"),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.groupe,
					1,
				),
			);
			lListeCumuls.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Cumul.Alphabetique",
					),
					0,
					ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.initial,
					2,
				),
			);
			lFenetre.setListeCumuls(lListeCumuls);
			lFenetre.setGenreCumulActif(lGenreCumul);
		}
		lFenetre.setSelectionObligatoire(false);
		lFenetre.setDonnees({
			listeRessources: lListeRessources,
			listeRessourcesSelectionnees: lListeSelec,
			genreRessource: lGenreRessource,
			avecIndicationDiscussionInterdit: false,
			titre:
				Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
					lGenreRessource,
				),
		});
	}
	_callbackActualisationSujets(aParams) {
		if (this.options.callbackActualisationSujets) {
			this._callbackActualisationSujets_enCours = true;
			return this.options.callbackActualisationSujets(aParams).finally(() => {
				this._callbackActualisationSujets_enCours = false;
			});
		}
		return Promise.reject();
	}
}
exports.MoteurForumPedagogique = MoteurForumPedagogique;
class ObjetRequeteForumPedagogique extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"ForumPedagogique",
	ObjetRequeteForumPedagogique,
);
class ObjetRequeteSaisieForumPedagogique extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		Object.assign(this.JSON, aParametres);
		switch (this.JSON.type) {
			case TypesForumPedagogique_1.TypeForumPedaCommandeSaisie
				.fpcs_CreerModifierSujet: {
				this.JSON.sujet = aParametres.sujet.toJSONAll();
				const lSujetJSON = this.JSON.sujet;
				lSujetJSON.htmlPost = new TypeChaineHtml_1.TypeChaineHtml(
					aParametres.sujet.htmlPost,
				);
				["listeThemes", "listeMembres", "listeModerateurs"].forEach((aProp) => {
					if (lSujetJSON[aProp]) {
						lSujetJSON[aProp].setSerialisateurJSON({
							ignorerEtatsElements: true,
						});
					}
				});
				if (lSujetJSON.listeFichiers) {
					lSujetJSON.listeFichiers =
						lSujetJSON.listeFichiers.setSerialisateurJSON({
							methodeSerialisation: (aElement, aJSON) => {
								const lIdFichier =
									aElement.idFichier !== undefined
										? aElement.idFichier
										: aElement.Fichier !== undefined
											? aElement.Fichier.idFichier
											: null;
								if (lIdFichier !== null) {
									aJSON.idFichier = "" + lIdFichier;
								}
								aJSON.nomFichier = aElement.nomFichier;
								aJSON.url = aElement.url;
							},
						});
				}
				break;
			}
		}
		return this.appelAsynchrone();
	}
}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieForumPedagogique",
	ObjetRequeteSaisieForumPedagogique,
);
