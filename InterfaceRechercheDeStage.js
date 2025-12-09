exports.TypeOrigineCreationEtatAvancementRechercheStage =
	exports.InterfaceRechercheDeStage = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteRechercheDeStage_1 = require("ObjetRequeteRechercheDeStage");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_MenuCtxModeMixte_1 = require("Enumere_MenuCtxModeMixte");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_2 = require("ObjetTraduction");
const ObjetRequeteEtapesDemarcheRechercheDeStage_1 = require("ObjetRequeteEtapesDemarcheRechercheDeStage");
const GUID_1 = require("GUID");
const ObjetRequeteSaisieRechercheDeStage_1 = require("ObjetRequeteSaisieRechercheDeStage");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetRequeteRechercheEntreprise_1 = require("ObjetRequeteRechercheEntreprise");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const InterfaceListeMessagerie_1 = require("InterfaceListeMessagerie");
const ObjetDiscussion_Mobile_1 = require("ObjetDiscussion_Mobile");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireEmail_1 = require("UtilitaireEmail");
const GlossaireAdresse_1 = require("GlossaireAdresse");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetTri_1 = require("ObjetTri");
class InterfaceRechercheDeStage extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateur = GEtatUtilisateur;
		this.estEspaceReferents = [
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Personnel,
		].includes(this.etatUtilisateur.getUtilisateur().getGenre());
		this.estEspaceEleve = this.etatUtilisateur.estEspaceEleve();
		this.idEtatRecherche = this.Nom + "_EtatRecherche";
		this.idAction = this.Nom + "_Action";
		this.moteurMessagerie =
			new MoteurMessagerie_1.MoteurMessagerie().setOptions({ instance: this });
		this.tailleMaxCommentaire = 500;
		this.referent = null;
		this.existeStageTrouve = false;
		this.existeStageEnBase = false;
		this.avecCocheDeclarerStageTrouve = false;
		this.estPremiereRequete = false;
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				InterfaceRechercheDeStage.genreEcran.listeDemarchesDeRecherche,
				InterfaceRechercheDeStage.genreEcran.detailsRecherche,
			],
		});
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [
			{
				html: IE.jsx.str("ie-combo", {
					"ie-if": this.jsxIfComboModelSessionStage.bind(this),
					"aria-label": TradInterfaceRechercheDeStage.labelComboSession,
					"ie-model": this.jsxComboModelSessionStage.bind(this),
				}),
			},
		];
	}
	jsxIfComboModelSessionStage() {
		var _a;
		return (
			((_a = this.listeSessions) === null || _a === void 0
				? void 0
				: _a.count()) > 0
		);
	}
	jsxComboModelSessionStage() {
		return {
			getDonnees: () => {
				if (this.listeSessions) {
					return this.listeSessions;
				}
			},
			getIndiceSelection: () => {
				var _a;
				let lIndice = 0;
				if (
					!!this.session &&
					((_a = this.listeSessions) === null || _a === void 0
						? void 0
						: _a.count()) > 0
				) {
					lIndice = this.listeSessions.getIndiceParNumeroEtGenre(
						this.session.getNumero(),
					);
				}
				return Math.max(lIndice, 0);
			},
			event: (aParams) => {
				if (
					!this.session ||
					this.estPremiereRequete ||
					(aParams.element &&
						this.session.getNumero() !== aParams.element.getNumero())
				) {
					this.session = aParams.element;
					this.etatUtilisateur.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.SessionDeStage,
						this.session,
					);
					this.estPremiereRequete = false;
					this.session.listeNaturesDemarche.parcourir((aNature) => {
						if (
							aNature.getGenre() ===
							TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve
						) {
							this.avecCocheDeclarerStageTrouve = true;
							return false;
						}
					});
					this.requeteRechercheDeStage();
				}
			},
		};
	}
	construireInstances() {
		this.identListeDemarches = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				var _a;
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
						this.setCtxSelection({
							niveauEcran: 0,
							dataEcran: aParametres.article,
						});
						this.basculerEcran(
							{ niveauEcran: 0, dataEcran: aParametres.article },
							{
								niveauEcran: 1,
								genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
							},
						);
						break;
					}
					case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
						if (this.estEspaceEleve && this.existeStageEnBase) {
							if (
								(_a = this.referent) === null || _a === void 0
									? void 0
									: _a.avecDiscussion
							) {
								this.creerDiscussion({ destinataire: this.referent });
							}
						} else {
							ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
								pere: this,
								initCommandes: (aInstanceMenu) => {
									this.initMenuContextuelNaturesDemarche(aInstanceMenu);
								},
							});
						}
						break;
					}
					case Enumere_EvenementListe_1.EGenreEvenementListe
						.ModificationSelection: {
						const lSelection = aParametres.instance.getElementSelection();
						if (!lSelection) {
							this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
							ObjetHtml_1.GHtml.setDisplay(
								this.getIdDeNiveau({ niveauEcran: 1 }),
							);
						}
						break;
					}
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					avecOmbreDroite: true,
					titreCreation: TradInterfaceRechercheDeStage.nouvelleDemarche,
					boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher }],
					messageContenuVide: TradInterfaceRechercheDeStage.aucuneDemarche,
					ariaLabel: () => {
						var _a;
						return `${this.etatUtilisateur.getLibelleLongOnglet()} ${((_a = this.session) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`.trim();
					},
				});
			},
		);
		this.identListeEtapes = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				var _a;
				switch (aParametres.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
						const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_DemarcheRechercheStage,
							{
								pere: this,
								initialiser(aFenetre) {
									aFenetre.setOptionsFenetre({ titre: lDemarche.getLibelle() });
									aFenetre.tailleMaxCommentaire = this.tailleMaxCommentaire;
								},
								async evenement(aDemarche, aAvecActionDeclarerStageTrouve) {
									var _a, _b;
									const lEvenement = aDemarche;
									lEvenement.setNumero(lDemarche.getNumero());
									const lReponseSaisie =
										await this.requeteSaisieDemarcheRechercheDeStage({
											action: lEvenement,
											eleve:
												(_a = lDemarche.pere) === null || _a === void 0
													? void 0
													: _a.eleve,
										});
									if (
										aAvecActionDeclarerStageTrouve &&
										lReponseSaisie ===
											ObjetRequeteJSON_1.EGenreReponseSaisie.succes
									) {
										this.declarerStageTrouve(
											(_b = lDemarche.pere) === null || _b === void 0
												? void 0
												: _b.eleve,
										);
									}
								},
							},
						).setDonnees({
							natureDemarche: ObjetElement_1.ObjetElement.create({
								listeStatutsEtape: this.listeStatutsEtape,
							}),
							avecSaisieEntreprise: false,
							entreprise: this.entreprise,
							avecCocheDeclarerStagetrouve:
								this.avecCocheDeclarerStageTrouve &&
								((this.estEspaceEleve && !this.existeStageTrouve) ||
									(this.estEspaceReferents &&
										!((_a = lDemarche.pere) === null || _a === void 0
											? void 0
											: _a.eleve.existeStageTrouve))),
						});
					}
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					titreCreation: TradInterfaceRechercheDeStage.ajouterUneEtape,
					ariaLabel: () => {
						var _a, _b, _c;
						const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
						return `${this.etatUtilisateur.getLibelleLongOnglet()} ${((_a = this.session) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} - ${((_c = (_b = lDemarche === null || lDemarche === void 0 ? void 0 : lDemarche.pere) === null || _b === void 0 ? void 0 : _b.eleve) === null || _c === void 0 ? void 0 : _c.getLibelle()) || ""} ${(lDemarche === null || lDemarche === void 0 ? void 0 : lDemarche.getLibelle()) || ""}`.trim();
					},
				});
			},
		);
		if (IE.estMobile) {
			this.pageDiscussionMobile =
				new ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile({
					pere: this,
					moteurMessagerie: this.moteurMessagerie,
				});
			this.pageDiscussionMobile.setOptions({
				avecEntete: false,
				avecMenuActions: false,
				activerBoutonsBrouillon: true,
				callbackEnvoyer: () => {
					this.recupererMessagerieMobile();
				},
			});
		} else {
			this.identMessagerie = this.add(
				InterfaceListeMessagerie_1.InterfaceListeMessagerie,
				null,
				(aInstance) => {
					aInstance.setOptions({
						forcerBandeau: true,
						avecMenuActions: false,
						avecListeDiscussions: false,
						avecBoutonCreation: false,
						discussionSelectionneeUniquementVisible: true,
					});
					aInstance.avecRecupereDonnees = false;
				},
			);
		}
	}
	async construireEcran(aParams) {
		switch (aParams.genreEcran) {
			case InterfaceRechercheDeStage.genreEcran.listeDemarchesDeRecherche:
				if (this.optionsEcrans.avecBascule) {
					this.initialiser(true);
					this.requeteRechercheDeStage();
				}
				break;
			case InterfaceRechercheDeStage.genreEcran.detailsRecherche: {
				const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
				ObjetHtml_1.GHtml.setDisplay(
					this.getIdDeNiveau({ niveauEcran: 1 }),
					true,
				);
				if (this.optionsEcrans.avecBascule) {
					this.setHtmlStructureAffichageBandeau(
						this.construireBandeauEcran(
							IE.jsx.str(
								"div",
								{ class: "titres-contain" },
								IE.jsx.str(
									"h3",
									{ class: "text-center m-right-xxl" },
									lDemarche.getLibelle(),
								),
							),
						),
					);
				}
				if (lDemarche.estUneDiscussion) {
					ObjetHtml_1.GHtml.setDisplay(this.idAction, false);
					ObjetHtml_1.GHtml.setDisplay(
						IE.estMobile
							? this.pageDiscussionMobile.getNom()
							: this.getNomInstance(this.identMessagerie),
						true,
					);
					if (IE.estMobile) {
						await this.recupererMessagerieMobile();
					} else {
						const lMessagerie = this.getInstance(this.identMessagerie);
						lMessagerie.setOptions({
							possessionMessageDiscussionUnique:
								lDemarche.listePossessionsMessages.getDernierElement(),
						});
						lMessagerie.setDonnees({ message: lDemarche });
					}
				} else {
					new ObjetRequeteEtapesDemarcheRechercheDeStage_1.ObjetEtapesDemarcheRequeteRechercheDeStage(
						this,
						(aJSON) => {
							ObjetHtml_1.GHtml.setDisplay(this.idAction, true);
							ObjetHtml_1.GHtml.setDisplay(
								IE.estMobile
									? this.pageDiscussionMobile.getNom()
									: this.getNomInstance(this.identMessagerie),
								false,
							);
							this.listeStatutsEtape = aJSON.listeStatutsEtape;
							this.entreprise = aJSON.entreprise;
							this.getInstance(this.identListeEtapes)
								.setOptionsListe({
									avecLigneCreation:
										this.session.avecSaisie &&
										lDemarche.avecSaisie &&
										this.listeStatutsEtape.count() > 0,
									forcerOmbreScrollTop: true,
								})
								.setDonnees(
									new DonneesListe_EtapesDemarcheRechercheDeStage(
										aJSON.listeEtapes,
										lDemarche,
										this.requeteSaisieDemarcheRechercheDeStage.bind(this),
										this.callFenetreModificationEtape.bind(this),
									),
								);
						},
					).lancerRequete({ action: lDemarche, session: this.session });
				}
				break;
			}
		}
	}
	async recupererMessagerieMobile() {
		const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
		const lReponseMessagerie =
			await this.moteurMessagerie.requeteListeMessagerie({
				possessionMessageDiscussionUnique:
					lDemarche.listePossessionsMessages.getDernierElement(),
				avecMessage: true,
				avecLu: true,
			});
		const lMessage = lReponseMessagerie.listeMessagerie.get(0);
		const lReponseMessage = await this.moteurMessagerie.requeteMessagesVisu({
			message: lMessage,
			marquerCommeLu: true,
			nbMessagesVus:
				UtilitaireMessagerie_1.UtilitaireMessagerie.palierNbMessages,
		});
		this.pageDiscussionMobile.setDonnees({
			message: lMessage,
			brouillon: lReponseMessage.brouillon,
			messagePourReponse: lReponseMessage.messagePourReponse,
			listeBoutons: lReponseMessage.listeBoutons,
			listeMessages: lReponseMessage.listeMessages,
			destinataires: lReponseMessage.destinataires,
			nbPossessionsMessageListe: lReponseMessage.nbPossessionsMessage,
		});
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{
					class:
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.InterfaceRechercheDeStage,
				},
				IE.jsx.str(
					"section",
					{
						id: this.getIdDeNiveau({ niveauEcran: 0 }),
						class:
							InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
								.listeDemarches,
					},
					IE.jsx.str(
						"div",
						{
							class:
								InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
									.conteneurDemarches,
						},
						IE.jsx.str("p", {
							"ie-if": this.jsxAvecInfoQueDiscussion.bind(this),
							"ie-texte": this.jsxGetTexteInfoQueDiscussion.bind(this),
							class: ["ie-texte p-top-l p-left-xl fix-bloc", "p-bottom-l"],
						}),
						IE.jsx.str("div", {
							id: this.getNomInstance(this.identListeDemarches),
							class: ["fluid-bloc"],
						}),
					),
				),
				IE.jsx.str(
					"section",
					{
						id: this.getIdDeNiveau({ niveauEcran: 1 }),
						class:
							InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
								.listeEtapes,
						style: { display: "none" },
					},
					IE.jsx.str(
						"div",
						{
							id: this.idAction,
							class:
								InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
									.conteneurAction,
						},
						IE.jsx.str("div", {
							"ie-if": this.jsxAvecInfosEntreprise.bind(this),
							"ie-html": this.jsxGetHtmlEntreprise.bind(this),
							class: ["ie-texte p-top-l p-left-xl fix-bloc", "p-bottom-l"],
						}),
						IE.jsx.str("div", {
							id: this.getNomInstance(this.identListeEtapes),
							class: ["fluid-bloc"],
						}),
					),
					IE.jsx.str("div", {
						id: IE.estMobile
							? this.pageDiscussionMobile.getNom()
							: this.getNomInstance(this.identMessagerie),
						class: ["fluid-bloc", "full-height"],
						style: "display: none;",
					}),
				),
			),
		);
	}
	recupererDonnees() {
		new ObjetRequeteRechercheDeStage_1.ObjetRequeteRechercheDeStage(
			this,
			(aJSON) => {
				this.listeSessions = aJSON.listeSessionsStages;
				this.listeEtatsAvancement = aJSON.listeEtatsAvancement;
				if (this.listeSessions.count() === 0) {
					ObjetHtml_1.GHtml.setHtml(
						this.getIdDeNiveau({ niveauEcran: 0 }),
						this.composeMessage(TradInterfaceRechercheDeStage.aucuneSession),
					);
				} else {
					this.session = this.etatUtilisateur.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.SessionDeStage,
					);
					this.estPremiereRequete = true;
				}
			},
		).lancerRequete({});
	}
	async requeteRechercheDeStage() {
		await new ObjetRequeteRechercheDeStage_1.ObjetRequeteRechercheDeStage(
			this,
			(aJSON) => {
				var _a;
				this.listeDemarches = aJSON.listeDemarches;
				this.tailleMaxCommentaire = aJSON.tailleMaxCommentaire;
				this.existeStageTrouve = aJSON.existeStageTrouve;
				this.existeStageEnBase = aJSON.existeStageEnBase;
				this.listeEntreprisesSaisie = aJSON.listeEntreprisesSaisie;
				this.referent = aJSON.referent;
				this.getInstance(this.identListeDemarches).setOptionsListe({
					avecLigneCreation:
						this.estEspaceEleve && this.initMenuContextuelNaturesDemarche(),
					titreCreation:
						this.estEspaceEleve && this.existeStageEnBase
							? TradInterfaceRechercheDeStage.demarrerDiscussion
							: TradInterfaceRechercheDeStage.nouvelleDemarche,
					messageContenuVide:
						this.estEspaceEleve &&
						this.existeStageEnBase &&
						((_a = this.referent) === null || _a === void 0
							? void 0
							: _a.avecDiscussion)
							? TradInterfaceRechercheDeStage.aucuneDiscussion
							: TradInterfaceRechercheDeStage.aucuneDemarche,
					ariaDescribedBy: this.idEtatRecherche,
					boutons: [
						{
							getHtml: () => {
								var _a;
								return IE.jsx.str(
									"div",
									{ id: this.idEtatRecherche },
									!this.existeStageEnBase &&
										IE.jsx.str(
											"p",
											{ class: "ie-titre" },
											(_a = aJSON.etatRecherche) === null || _a === void 0
												? void 0
												: _a.getLibelle(),
										),
									this.referent &&
										IE.jsx.str(
											"p",
											null,
											TradInterfaceRechercheDeStage.suiviPar.format(
												this.referent.getLibelle(),
											),
										),
								);
							},
						},
						this.estEspaceReferents
							? { genre: ObjetListe_1.ObjetListe.typeBouton.filtrer }
							: null,
						this.estEspaceReferents
							? { genre: ObjetListe_1.ObjetListe.typeBouton.deployer }
							: null,
						{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
					],
				});
				this.getInstance(this.identListeDemarches).setDonnees(
					new DonneesListe_DemarchesRechercheDeStage(this.listeDemarches, {
						estEspaceReferents: this.estEspaceReferents,
						initMenuCtxNaturesDemarche:
							this.initMenuContextuelNaturesDemarche.bind(this),
						requeteSaisieDemarcheRechercheDeStage:
							this.requeteSaisieDemarcheRechercheDeStage.bind(this),
						totalEleve: this.getStrTotalDemarcheEleve(),
						totalEntrepriseSaisie: this.getStrTotalEntrepriseSaisie(),
						donneesFiltre: {
							filtreListeEtatsAvancement: this.listeEtatsAvancement,
						},
					}),
				);
				ObjetHtml_1.GHtml.setDisplay(
					this.getIdDeNiveau({ niveauEcran: 1 }),
					false,
				);
			},
		).lancerRequete({ session: this.session });
	}
	async requeteSaisieDemarcheRechercheDeStage(aParams) {
		var _a, _b, _c;
		function _addPJPourUpload(aListe) {
			return aListe.removeFilter((aPieceJointe) => {
				return ![
					Enumere_Etat_1.EGenreEtat.Creation,
					Enumere_Etat_1.EGenreEtat.Suppression,
				].includes(aPieceJointe.getEtat());
			});
		}
		let lListePj = new ObjetListeElements_1.ObjetListeElements();
		if ((_a = aParams.action) === null || _a === void 0 ? void 0 : _a.listePJ) {
			lListePj.add(_addPJPourUpload(aParams.action.listePJ));
		}
		if (
			(_b = aParams.evenement) === null || _b === void 0 ? void 0 : _b.listePJ
		) {
			lListePj.add(_addPJPourUpload(aParams.evenement.listePJ));
		}
		if (
			(_c = aParams.recherche) === null || _c === void 0 ? void 0 : _c.listePJ
		) {
			lListePj.add(_addPJPourUpload(aParams.recherche.listePJ));
		}
		const lReponseSaisie =
			await new ObjetRequeteSaisieRechercheDeStage_1.ObjetRequeteSaisieRechercheDeStage(
				this,
				async (aJSON) => {
					await this.requeteRechercheDeStage();
					let lLigne = -1;
					if (aJSON.JSONRapportSaisie.demarche) {
						lLigne = this.listeDemarches.getIndiceParNumeroEtGenre(
							aJSON.JSONRapportSaisie.demarche.getNumero(),
						);
					} else {
						lLigne = this.listeDemarches.getIndiceParElement(
							this.getCtxSelection({ niveauEcran: 0 }),
						);
					}
					if (lLigne >= 0) {
						this.getInstance(this.identListeDemarches).selectionnerLigne({
							ligne: lLigne,
							avecEvenement: true,
							avecScroll: true,
						});
					} else {
						this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
						this.basculerEcran(
							{ niveauEcran: 1 },
							{
								niveauEcran: 0,
								genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
							},
						);
						ObjetHtml_1.GHtml.setDisplay(
							this.getIdDeNiveau({ niveauEcran: 1 }),
						);
					}
				},
			)
				.addUpload({ listeFichiers: lListePj })
				.lancerRequete(Object.assign(aParams, { session: this.session }));
		return lReponseSaisie.genreReponse;
	}
	initMenuContextuelNaturesDemarche(aInstanceMenu, aEleve) {
		var _a;
		let lAvecAction = false;
		const lExisteDejaStageTrouve =
			(this.estEspaceEleve && this.existeStageTrouve) ||
			(this.estEspaceReferents && aEleve.existeStageTrouve);
		const lExisteStageEnBase =
			(this.estEspaceEleve && this.existeStageEnBase) ||
			(this.estEspaceReferents && aEleve.existeStageEnBase);
		if (!lExisteStageEnBase) {
			this.session.listeNaturesDemarche.parcourir((aNature) => {
				lAvecAction = true;
				if (aInstanceMenu) {
					aInstanceMenu.add(aNature.getLibelle(), true, () => {
						if (
							aNature.getGenre() ===
								TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve &&
							lExisteDejaStageTrouve
						) {
							GApplication.getMessage().afficher({
								message: TradInterfaceRechercheDeStage.existeDejaUnStageTrouve,
							});
						} else {
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_DemarcheRechercheStage,
								{
									pere: this,
									initialiser(aFenetre) {
										aFenetre.setOptionsFenetre({ titre: aNature.getLibelle() });
										aFenetre.tailleMaxCommentaire = this.tailleMaxCommentaire;
									},
									async evenement(aDemarche, aAvecActionDeclarerStageTrouve) {
										const lReponseSaisie =
											await this.requeteSaisieDemarcheRechercheDeStage({
												recherche: aDemarche,
												eleve: aEleve,
											});
										this.entreprise = aDemarche.entreprise;
										if (
											aAvecActionDeclarerStageTrouve &&
											lReponseSaisie ===
												ObjetRequeteJSON_1.EGenreReponseSaisie.succes
										) {
											this.declarerStageTrouve(aEleve);
										}
									},
								},
							).setDonnees({
								natureDemarche: aNature,
								avecSaisieEntreprise: [
									TypeOrigineCreationEtatAvancementRechercheStage.ocearsRechercheEnCours,
									TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve,
								].includes(aNature.getGenre()),
								avecCocheDeclarerStagetrouve:
									this.avecCocheDeclarerStageTrouve && !lExisteDejaStageTrouve,
							});
						}
					});
				}
			});
		}
		if (
			(this.estEspaceReferents &&
				(aEleve === null || aEleve === void 0
					? void 0
					: aEleve.avecDiscussion)) ||
			((_a = this.referent) === null || _a === void 0
				? void 0
				: _a.avecDiscussion)
		) {
			lAvecAction = true;
			if (aInstanceMenu) {
				aInstanceMenu.add(
					TradInterfaceRechercheDeStage.demarrerDiscussion,
					true,
					() => {
						this.creerDiscussion({
							destinataire: aEleve || this.referent,
							elevePourRequete: aEleve,
						});
					},
				);
			}
		}
		return lAvecAction;
	}
	callFenetreModificationEtape(aEvenement) {
		const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
		aEvenement.nature.listeStatutsEtape = this.listeStatutsEtape;
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DemarcheRechercheStage,
			{
				pere: this,
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre({ titre: lDemarche.getLibelle() });
					aFenetre.tailleMaxCommentaire = this.tailleMaxCommentaire;
				},
				evenement(aEvenementSaisie) {
					var _a;
					this.requeteSaisieDemarcheRechercheDeStage({
						action: lDemarche,
						evenement: aEvenementSaisie,
						eleve:
							(_a = lDemarche.pere) === null || _a === void 0
								? void 0
								: _a.eleve,
					});
				},
			},
		).setDonnees({
			natureDemarche: aEvenement.nature,
			avecSaisieEntreprise: false,
			evenement: aEvenement,
			entreprise: this.entreprise,
		});
	}
	jsxAvecInfoQueDiscussion() {
		var _a;
		return (
			this.estEspaceEleve &&
			this.existeStageEnBase &&
			((_a = this.referent) === null || _a === void 0
				? void 0
				: _a.avecDiscussion)
		);
	}
	jsxGetTexteInfoQueDiscussion() {
		return (
			this.referent &&
			TradInterfaceRechercheDeStage.infoQueDiscussion.format(
				this.referent.getLibelle(),
			)
		);
	}
	jsxAvecInfosEntreprise() {
		return !!this.entreprise;
	}
	jsxGetHtmlEntreprise() {
		if (this.entreprise) {
			return IE.jsx.str(
				"div",
				{ class: "flex-contain justify-between" },
				IE.jsx.str(
					"div",
					{
						class:
							InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
								.conteneurEntreprise,
					},
					this.entreprise.strRaisonSociale &&
						IE.jsx.str(
							"p",
							null,
							IE.jsx.str(
								"span",
								{ class: "Gras" },
								TradInterfaceRechercheDeStage.entreprise,
								" :",
							),
							" ",
							this.entreprise.strRaisonSociale,
						),
					this.entreprise.SIRET &&
						IE.jsx.str(
							"p",
							null,
							IE.jsx.str(
								"span",
								{ class: "Gras" },
								TradInterfaceRechercheDeStage.numSiret,
								" :",
							),
							" ",
							this.entreprise.SIRET,
						),
					IE.jsx.str(
						"div",
						{ class: "m-y" },
						this.entreprise.strAdresse1 &&
							IE.jsx.str("p", null, this.entreprise.strAdresse1),
						this.entreprise.strAdresse2 &&
							IE.jsx.str("p", null, this.entreprise.strAdresse2),
						this.entreprise.strAdresse3 &&
							IE.jsx.str("p", null, this.entreprise.strAdresse3),
						this.entreprise.strAdresse4 &&
							IE.jsx.str("p", null, this.entreprise.strAdresse4),
						(this.entreprise.strCP ||
							this.entreprise.strVille ||
							this.entreprise.strPays) &&
							IE.jsx.str("p", null, _composeCPVillePays(this.entreprise)),
					),
					this.entreprise.strEmail &&
						IE.jsx.str(
							"p",
							null,
							IE.jsx.str("i", { role: "presentation", class: "icon_arobase" }),
							this.entreprise.strEmail,
						),
					this.entreprise.strTelephone &&
						IE.jsx.str(
							"p",
							null,
							IE.jsx.str("i", { role: "presentation", class: "icon_phone" }),
							this.entreprise.strIndTelephone
								? "(+" + this.entreprise.strIndTelephone + ") "
								: "",
							ObjetChaine_1.GChaine.getStrTelephoneAvecEspaces(
								this.entreprise.strTelephone,
							),
						),
				),
				IE.jsx.str(
					"div",
					{ "ie-if": this.jsxAvecModifInfosEntreprise.bind(this) },
					IE.jsx.str("ie-btnicon", {
						class: "icon_pencil avecFond m-right-l",
						"ie-model": this.jsxModelBtnModifierEntreprise.bind(this),
						title: ObjetTraduction_1.GTraductions.getValeur("Modifier"),
					}),
				),
			);
		}
	}
	jsxAvecModifInfosEntreprise() {
		const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
		return (
			(this.estEspaceEleve || this.estEspaceReferents) &&
			this.session.avecSaisie &&
			(lDemarche === null || lDemarche === void 0
				? void 0
				: lDemarche.avecSaisie)
		);
	}
	jsxModelBtnModifierEntreprise() {
		return {
			event: () => {
				const lDemarche = this.getCtxSelection({ niveauEcran: 0 });
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_EditionEntreprise,
					{
						pere: this,
						evenement: function (aNumeroBouton, aEntreprise) {
							var _a;
							if (aNumeroBouton === 1) {
								this.entreprise = aEntreprise;
								this.requeteSaisieDemarcheRechercheDeStage({
									action: lDemarche,
									entreprise: this.entreprise,
									eleve:
										(_a = lDemarche.pere) === null || _a === void 0
											? void 0
											: _a.eleve,
								});
							}
						},
					},
				).setDonnees(
					this.entreprise,
					lDemarche.etatsAvancement
						.getTableauGenres()
						.includes(
							TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve,
						),
				);
			},
		};
	}
	declarerStageTrouve(aEleve) {
		if (this.avecCocheDeclarerStageTrouve) {
			this.session.listeNaturesDemarche.parcourir((aNature) => {
				if (
					aNature.getGenre() ===
					TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve
				) {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_DemarcheRechercheStage,
						{
							pere: this,
							initialiser(aFenetre) {
								aFenetre.setOptionsFenetre({ titre: aNature.getLibelle() });
								aFenetre.tailleMaxCommentaire = this.tailleMaxCommentaire;
							},
							async evenement(aDemarche) {
								await this.requeteSaisieDemarcheRechercheDeStage({
									recherche: aDemarche,
									eleve: aEleve,
								});
							},
						},
					).setDonnees({
						natureDemarche: aNature,
						avecSaisieEntreprise: true,
						entreprise: this.entreprise,
					});
					return false;
				}
			});
		}
	}
	creerDiscussion(aParams) {
		const lDestinataire = MethodesObjet_1.MethodesObjet.dupliquer(
			aParams.destinataire,
		);
		lDestinataire.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		const lObjetPreRempli = TradInterfaceRechercheDeStage.objetDiscussion;
		if (IE.estMobile) {
			const lFenetre = new ObjetDiscussion_Mobile_1.ObjetDiscussion_Mobile({
				pere: this,
				moteurMessagerie: this.moteurMessagerie,
			});
			lFenetre
				.setOptions({
					estDiscussionEnFenetre: true,
					genreRessource: lDestinataire.getGenre(),
					avecDestinatairesListeDiffusion: false,
					avecChoixDestinataires: false,
					callbackEnvoyer: () => {
						lFenetre.masquer();
						this.requeteRechercheDeStage();
					},
					callbackFermeture: () => {
						lFenetre.free();
					},
				})
				.setDonnees({
					message: ObjetElement_1.ObjetElement.create({
						objet: lObjetPreRempli,
					}),
					creationDiscussion: true,
					estCreationRechercheDeStage: true,
					rechercheDeStage: {
						eleve: aParams.elevePourRequete,
						session: this.session,
					},
					destinataires: {
						listeDestinataires: new ObjetListeElements_1.ObjetListeElements(
							lDestinataire,
						),
					},
				});
		} else {
			ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
				this,
				{
					genreRessource: lDestinataire.getGenre(),
					listeSelectionnee: new ObjetListeElements_1.ObjetListeElements(
						lDestinataire,
					),
					ListeRessources: new ObjetListeElements_1.ObjetListeElements(
						lDestinataire,
					),
				},
				{
					objet: lObjetPreRempli,
					avecChoixDestinataires: false,
					estCreationRechercheDeStage: true,
					rechercheDeStage: {
						eleve: aParams.elevePourRequete,
						session: this.session,
					},
					eventApresDiscussion: (aNumeroBouton) => {
						if (aNumeroBouton === 1) {
							this.requeteRechercheDeStage();
							this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
							this.basculerEcran(
								{ niveauEcran: 1 },
								{
									niveauEcran: 0,
									genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
								},
							);
							ObjetHtml_1.GHtml.setDisplay(
								this.getIdDeNiveau({ niveauEcran: 1 }),
							);
						}
					},
				},
			);
		}
	}
	getStrTotalDemarcheEleve() {
		let lNbTotal = 0;
		let lNbRechercheNonDebutee = 0;
		let lNbRecherche = 0;
		let lNbStageTrouve = 0;
		this.listeDemarches.parcourir((aDemarche) => {
			if (aDemarche.estCumul) {
				lNbTotal++;
				const lTabGenresEtatsAvancement =
					aDemarche.etatsAvancement.getTableauGenres();
				if (
					lTabGenresEtatsAvancement.includes(
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageExistant,
					) ||
					lTabGenresEtatsAvancement.includes(
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageCree,
					)
				) {
					lNbStageTrouve++;
				} else if (
					lTabGenresEtatsAvancement.includes(
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsEnPreparation,
					)
				) {
					lNbRechercheNonDebutee++;
				} else if (
					lTabGenresEtatsAvancement.includes(
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsRechercheEnCours,
					)
				) {
					lNbRecherche++;
				} else if (
					lTabGenresEtatsAvancement.includes(
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve,
					)
				) {
					lNbStageTrouve++;
				} else if (
					lTabGenresEtatsAvancement.includes(
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsUtilisateur,
					) ||
					lTabGenresEtatsAvancement.length === 0
				) {
					lNbRechercheNonDebutee++;
				}
			}
		});
		return IE.jsx.str(
			"p",
			null,
			IE.jsx.str(
				"span",
				{ class: "Gras" },
				TradInterfaceRechercheDeStage.totalTitre,
			),
			" ",
			IE.jsx.str("br", null),
			TradInterfaceRechercheDeStage.totalRechercheNonDebutee.format([
				lNbRechercheNonDebutee,
				lNbTotal,
			]),
			" ",
			IE.jsx.str("br", null),
			TradInterfaceRechercheDeStage.totalRechercheEnCours.format([
				lNbRecherche,
				lNbTotal,
			]),
			" ",
			IE.jsx.str("br", null),
			TradInterfaceRechercheDeStage.totalStageTrouve.format([
				lNbStageTrouve,
				lNbTotal,
			]),
			" ",
			IE.jsx.str("br", null),
		);
	}
	getStrTotalEntrepriseSaisie() {
		var _a;
		if (
			!this.estEspaceReferents &&
			((_a = this.listeEntreprisesSaisie) === null || _a === void 0
				? void 0
				: _a.count()) > 0
		) {
			const lNbrEntreprise = this.listeEntreprisesSaisie.count();
			if (lNbrEntreprise > 1) {
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"p",
						{ class: "Gras" },
						TradInterfaceRechercheDeStage.multiStagesExistantPourEleve.format([
							lNbrEntreprise,
						]),
					),
					IE.jsx.str("ul", null, (aLI) => {
						this.listeEntreprisesSaisie.parcourir((aEntreprise) => {
							aLI.push(
								IE.jsx.str(
									"li",
									{ class: "m-top" },
									aEntreprise.strInfo1,
									" ",
									IE.jsx.str("br", null),
									aEntreprise.strInfo2,
									" ",
									aEntreprise.strInfo3,
								),
							);
						});
					}),
				);
			} else {
				const lEntrepriseUnique = this.listeEntreprisesSaisie.get(0);
				return IE.jsx.str(
					"p",
					null,
					IE.jsx.str(
						"span",
						{ class: "Gras" },
						TradInterfaceRechercheDeStage.entrepriseSaisieFicheDeStage,
					),
					" ",
					IE.jsx.str("br", null),
					lEntrepriseUnique.strInfo1,
					" ",
					IE.jsx.str("br", null),
					lEntrepriseUnique.strInfo2,
					" ",
					lEntrepriseUnique.strInfo3,
				);
			}
		}
	}
}
exports.InterfaceRechercheDeStage = InterfaceRechercheDeStage;
(function (InterfaceRechercheDeStage) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["listeDemarchesDeRecherche"] = "listeDemarchesDeRecherche";
		genreEcran["detailsRecherche"] = "detailsRecherche";
	})(
		(genreEcran =
			InterfaceRechercheDeStage.genreEcran ||
			(InterfaceRechercheDeStage.genreEcran = {})),
	);
})(
	InterfaceRechercheDeStage ||
		(exports.InterfaceRechercheDeStage = InterfaceRechercheDeStage = {}),
);
class DonneesListe_DemarchesRechercheDeStage extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeDonnees, aParametresListeDemarches) {
		super(aListeDonnees);
		this.estEspaceReferents = aParametresListeDemarches.estEspaceReferents;
		this.initMenuCtxNaturesDemarche =
			aParametresListeDemarches.initMenuCtxNaturesDemarche;
		this.requeteSaisieDemarcheRechercheDeStage =
			aParametresListeDemarches.requeteSaisieDemarcheRechercheDeStage;
		this.totalEleve = aParametresListeDemarches.totalEleve;
		this.totalEntrepriseSaisie =
			aParametresListeDemarches.totalEntrepriseSaisie;
		if (this.estEspaceReferents) {
			this.donneesFiltre = aParametresListeDemarches.donneesFiltre;
			if (
				!this.donneesFiltre.filtreListeEtatsAvancement.getElementParNumero(-1)
			) {
				this.donneesFiltre.filtreListeEtatsAvancement.insererElement(
					new ObjetElement_1.ObjetElement(
						TradInterfaceRechercheDeStage.aucuneDemarche,
						-1,
					),
					0,
				);
			}
			this.etatsAvancement = MethodesObjet_1.MethodesObjet.dupliquer(
				this.donneesFiltre.filtreListeEtatsAvancement,
			);
		}
		this.setOptions({
			avecTri: false,
			avecDeploiement: this.estEspaceReferents,
			avecEvnt_ModificationSelection: true,
		});
	}
	getTotal(aEstHeader) {
		if (aEstHeader) {
			if (this.estEspaceReferents) {
				return {
					getHtml: () => {
						return this.totalEleve;
					},
				};
			} else if (this.totalEntrepriseSaisie) {
				return {
					getHtml: () => {
						return this.totalEntrepriseSaisie;
					},
				};
			}
		}
	}
	avecSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecEvenementSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecBoutonActionLigne(aParams) {
		return (
			(aParams.article.estUnDeploiement &&
				this.initMenuCtxNaturesDemarche(null, aParams.article.eleve)) ||
			(aParams.article.avecSaisie && !aParams.article.estUneDiscussion)
		);
	}
	avecMenuContextuel(aParams) {
		return (
			(aParams.article.estUnDeploiement &&
				this.initMenuCtxNaturesDemarche(null, aParams.article.eleve)) ||
			(aParams.article.avecSaisie && !aParams.article.estUneDiscussion)
		);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.article.estUnDeploiement) {
			this.initMenuCtxNaturesDemarche(
				aParametres.menuContextuel,
				aParametres.article.eleve,
			);
		}
		if (
			aParametres.article.avecSaisie &&
			!aParametres.article.estUneDiscussion
		) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				true,
				async () => {
					var _a;
					const lAction = await GApplication.getMessage().afficher({
						message:
							TradInterfaceRechercheDeStage.confirmationSuppressionDemarche,
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					});
					if (lAction === Enumere_Action_1.EGenreAction.Valider) {
						aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						this.requeteSaisieDemarcheRechercheDeStage({
							action: aParametres.article,
							eleve:
								(_a = aParametres.article.pere) === null || _a === void 0
									? void 0
									: _a.eleve,
						});
					}
				},
				{
					icon: "icon_trash i-small",
					typeAffEnModeMixte:
						Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
				},
			);
		}
		aParametres.menuContextuel.setDonnees();
	}
	getZoneComplementaire(aParams) {
		return aParams.article.estCumul &&
			aParams.article.etatsAvancement.getTableauGenres().length > 0
			? IE.jsx.str(
					"div",
					{ class: "icones-conteneur" },
					IE.jsx.str("i", {
						role: "presentation",
						class: [
							"icon",
							UtilCreationEtatAvancementRechercheStage.getPicto(
								aParams.article.etatsAvancement.getPremierElement().getGenre(),
							),
						],
					}),
				)
			: "";
	}
	getTitreZonePrincipale(aParams) {
		return (
			aParams.article.getLibelle() +
			(aParams.article.libelleEvenement
				? " - " + aParams.article.libelleEvenement
				: "")
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		return !aParams.article.estCumul
			? IE.jsx.str(
					"div",
					null,
					aParams.article.estUneDiscussion
						? aParams.article.commentaire
						: aParams.article.infosEntreprise,
				)
			: aParams.article.eleve.existeStageEnBase
				? IE.jsx.str(
						"div",
						null,
						aParams.article.etatsAvancement
							.getTableauGenres()
							.includes(
								TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageCree,
							)
							? TradInterfaceRechercheDeStage.stageCree
							: "(" + TradInterfaceRechercheDeStage.stageExistant + ")",
					)
				: "";
	}
	getZoneMessage(aParams) {
		var _a;
		if (aParams.article.estCumul) {
			const lNbrEntreprise =
				(_a = aParams.article.eleve.listeEntreprisesSaisie) === null ||
				_a === void 0
					? void 0
					: _a.count();
			if (lNbrEntreprise > 1) {
				return TradInterfaceRechercheDeStage.multiStagesExistant.format(
					lNbrEntreprise,
				);
			} else if (lNbrEntreprise === 1) {
				const lEntrepriseUnique =
					aParams.article.eleve.listeEntreprisesSaisie.get(0);
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					lEntrepriseUnique.strInfo1,
					" ",
					lEntrepriseUnique.strInfo2,
					" ",
					lEntrepriseUnique.strInfo3,
				);
			}
		} else {
			return (
				aParams.article.auteur &&
				TradInterfaceRechercheDeStage.ParX.format(
					aParams.article.auteur.getLibelle(),
				)
			);
		}
	}
	construireFiltres() {
		if (!this.donneesFiltre) {
			return "";
		}
		return IE.jsx.str("ie-combo", {
			"ie-model": this.jsxComboModelFiltreNatures.bind(this),
		});
	}
	reinitFiltres() {
		this.etatsAvancement = this.donneesFiltre.filtreListeEtatsAvancement;
		this.actualiserListe();
	}
	estFiltresParDefaut() {
		if (!this.donneesFiltre) {
			return true;
		}
		return (
			this.etatsAvancement.count() ===
			this.donneesFiltre.filtreListeEtatsAvancement.count()
		);
	}
	jsxComboModelFiltreNatures() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					estLargeurAuto: true,
					libelleHaut:
						TradInterfaceRechercheDeStage.filtreEtatAvancementRechercheStage,
					avecDesignMobile: true,
					multiSelection: true,
					avecElementObligatoire: true,
					getLibelleCelluleMultiSelection: (aListeSelections) => {
						return (aListeSelections === null || aListeSelections === void 0
							? void 0
							: aListeSelections.count()) !==
							this.donneesFiltre.filtreListeEtatsAvancement.count()
							? aListeSelections.getTableauLibelles().join(", ")
							: TradInterfaceRechercheDeStage.tousLesEtatsAvancements;
					},
				});
			},
			getDonnees: () => {
				return this.donneesFiltre.filtreListeEtatsAvancement;
			},
			getIndiceSelection: () => {
				return this.etatsAvancement;
			},
			event: (aParams) => {
				if (
					aParams.listeSelections !== null &&
					aParams.interactionUtilisateur
				) {
					this.etatsAvancement = aParams.listeSelections;
					this.actualiserListe();
				}
			},
		};
	}
	getVisible(aDonnee) {
		var _a;
		return (
			!this.estEspaceReferents ||
			(!!this.etatsAvancement.getElementParNumero(-1) &&
				((aDonnee.etatsAvancement &&
					(aDonnee.etatsAvancement.count() === 0 ||
						aDonnee.etatsAvancement.getTableauGenres().includes(0))) ||
					(((_a = aDonnee.pere) === null || _a === void 0
						? void 0
						: _a.etatsAvancement) &&
						(aDonnee.pere.etatsAvancement.count() === 0 ||
							aDonnee.pere.etatsAvancement.getTableauGenres().includes(0))))) ||
			this.etatsAvancement.getTableauGenres().some((aEtatAvancement) => {
				var _a, _b, _c;
				return (
					((_a = aDonnee.etatsAvancement) === null || _a === void 0
						? void 0
						: _a.getTableauGenres().includes(aEtatAvancement)) ||
					((_c =
						(_b = aDonnee.pere) === null || _b === void 0
							? void 0
							: _b.etatsAvancement) === null || _c === void 0
						? void 0
						: _c.getTableauGenres().includes(aEtatAvancement))
				);
			})
		);
	}
}
class DonneesListe_EtapesDemarcheRechercheDeStage extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(
		aListeDonnees,
		aAction,
		aRequeteSaisieDemarcheRechercheDeStage,
		aCallFenetreModificationEtape,
	) {
		super(aListeDonnees);
		this.demarche = aAction;
		this.requeteSaisieDemarcheRechercheDeStage =
			aRequeteSaisieDemarcheRechercheDeStage;
		this.callFenetreModificationEtape = aCallFenetreModificationEtape;
		this.setOptions({
			avecBoutonActionLigne: false,
			avecSelection: false,
			avecEllipsis: false,
		});
	}
	avecBoutonActionLigne(aParams) {
		return aParams.article.avecSaisie;
	}
	remplirMenuContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		if (aParametres.article && aParametres.article.avecSaisie) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				true,
				() => {
					this.callFenetreModificationEtape(aParametres.article);
				},
				{
					icon: "icon_pencil i-small",
					typeAffEnModeMixte:
						Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
				},
			);
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				true,
				async () => {
					var _a;
					const lAction = await GApplication.getMessage().afficher({
						message: TradInterfaceRechercheDeStage.confirmationSuppressionEtape,
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					});
					if (lAction === Enumere_Action_1.EGenreAction.Valider) {
						aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						this.requeteSaisieDemarcheRechercheDeStage({
							action: this.demarche,
							evenement: aParametres.article,
							eleve:
								(_a = this.demarche.pere) === null || _a === void 0
									? void 0
									: _a.eleve,
						});
					}
				},
				{
					icon: "icon_trash i-small",
					typeAffEnModeMixte:
						Enumere_MenuCtxModeMixte_1.ETypeAffEnModeMixte.icon,
				},
			);
		}
	}
	getZoneGauche(aParams) {
		return IE.jsx.str(
			"time",
			{
				class: "date-contain",
				datetime: ObjetDate_1.GDate.formatDate(aParams.article.date, "%MM-%JJ"),
			},
			ObjetDate_1.GDate.formatDate(aParams.article.date, "%JJ %MMM"),
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		return IE.jsx.str("div", null, aParams.article.auteur);
	}
	getZoneMessageLarge(aParams) {
		var _a;
		return IE.jsx.str(
			"div",
			null,
			ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.commentaire),
			((_a = aParams.article.listePJ) === null || _a === void 0
				? void 0
				: _a.count()) > 0 &&
				IE.jsx.str(
					"div",
					{ class: "m-top" },
					UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
						aParams.article.listePJ,
					),
				),
		);
	}
	getTri() {
		return [ObjetTri_1.ObjetTri.init("date")];
	}
}
class ObjetFenetre_DemarcheRechercheStage extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idLabelDate = this.Nom + "_labelDate";
		this.demarche = ObjetElement_1.ObjetElement.create({
			date: ObjetDate_1.GDate.aujourdhui,
			etape: null,
			nature: null,
			entreprise: null,
			commentaire: "",
			listePJ: new ObjetListeElements_1.ObjetListeElements(),
		});
		this.tailleMaxCommentaire = 500;
		this.avecActionDeclarerStageTrouve = false;
		this.UtilitaireSaisieEntreprise = new UtilitaireSaisieEntreprise();
		this.demarche.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		this.setOptionsFenetre({
			hauteur: 300,
			largeur: 500,
			avecScroll: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.idDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			(aDate) => {
				this.demarche.date = aDate;
			},
			(aInstance) => {
				aInstance.setOptionsObjetCelluleDate({
					ariaLabelledBy: this.idLabelDate,
				});
				aInstance.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
				);
			},
		);
	}
	composeContenu() {
		const lIdCombo = GUID_1.GUID.getId();
		const lIdCommentaire = GUID_1.GUID.getId();
		return IE.jsx.str(
			"div",
			{
				class:
					InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
						.ObjetFenetreRechercheDeStage,
			},
			IE.jsx.str(
				"label",
				{ id: this.idLabelDate },
				TradInterfaceRechercheDeStage.date,
			),
			IE.jsx.str("div", { id: this.getNomInstance(this.idDate) }),
			IE.jsx.str(
				"div",
				{ class: "m-y-xl", "ie-if": this.jsxIfStatut.bind(this) },
				IE.jsx.str(
					"label",
					{ id: lIdCombo },
					TradInterfaceRechercheDeStage.etape,
				),
				IE.jsx.str("ie-combo", {
					"aria-labelledby": lIdCombo,
					"ie-model": this.jsxComboModelEtapePreparation.bind(this),
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "m-y-xl", "ie-if": this.jsxIfSaisieEntreprise.bind(this) },
				IE.jsx.str(
					"div",
					{
						"ie-if": this.jsxIfChampEntreprise.bind(
							this,
							TypeOrigineCreationEtatAvancementRechercheStage.ocearsRechercheEnCours,
						),
					},
					this.UtilitaireSaisieEntreprise.composeEntrepriseConcernee(),
				),
				IE.jsx.str(
					"fieldset",
					{
						class: "Bordure",
						"ie-if": this.jsxIfChampEntreprise.bind(
							this,
							TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve,
						),
					},
					IE.jsx.str(
						"legend",
						null,
						TradInterfaceRechercheDeStage.informationsEntreprise,
					),
					this.UtilitaireSaisieEntreprise.composeFormulaireEntreprise(),
				),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": this.jsxIfCocheDeclarerStageTrouve.bind(this),
					class: "m-top-l",
				},
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": this.jsxModelCheckboxDeclarerStageTrouve.bind(this) },
					TradInterfaceRechercheDeStage.cocheDeclarerleStageTrouve,
				),
			),
			IE.jsx.str(
				"div",
				{ class: "m-y-xl" },
				IE.jsx.str(
					"label",
					{ id: lIdCommentaire },
					TradInterfaceRechercheDeStage.commentaire,
				),
				IE.jsx.str("ie-textareamax", {
					"aria-labelledby": lIdCommentaire,
					"ie-model": this.jsxModeleCommentaire.bind(this),
					"ie-autoresize": true,
					maxlength: this.tailleMaxCommentaire,
				}),
			),
			IE.jsx.str("ie-btnselecteur", {
				"ie-model": this.jsxModelBtnSelecteurAjoutPJ.bind(this),
				"ie-selecfile": true,
				class: "pj",
				role: "button",
			}),
			IE.jsx.str("div", {
				class: "m-top",
				"ie-if": this.jsxIfListePiecesJointes.bind(this),
				"ie-html": this.jsxGetHtmlListePiecesJointes.bind(this),
			}),
		);
	}
	jsxIfStatut() {
		var _a, _b;
		return (
			((_b =
				(_a = this.natureDemarche) === null || _a === void 0
					? void 0
					: _a.listeStatutsEtape) === null || _b === void 0
				? void 0
				: _b.count()) > 0
		);
	}
	jsxComboModelEtapePreparation() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					estLargeurAuto: true,
					largeurAutoMin: 170,
				});
			},
			getDonnees: (aListe) => {
				var _a;
				if (!aListe) {
					return (_a = this.natureDemarche) === null || _a === void 0
						? void 0
						: _a.listeStatutsEtape;
				}
			},
			getIndiceSelection: () => {
				var _a, _b;
				return (_b =
					(_a = this.natureDemarche) === null || _a === void 0
						? void 0
						: _a.listeStatutsEtape) === null || _b === void 0
					? void 0
					: _b.getIndiceParElement(this.demarche.etape);
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle) {
					this.demarche.etape = aParams.element;
				}
			},
		};
	}
	jsxIfSaisieEntreprise() {
		var _a;
		return (
			this.avecSaisieEntreprise &&
			[
				TypeOrigineCreationEtatAvancementRechercheStage.ocearsRechercheEnCours,
				TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve,
			].includes(
				(_a = this.natureDemarche) === null || _a === void 0
					? void 0
					: _a.getGenre(),
			)
		);
	}
	jsxIfChampEntreprise(aTypeOrigineCreationEtatAvancementRechercheStage) {
		var _a;
		return (
			aTypeOrigineCreationEtatAvancementRechercheStage ===
			((_a = this.natureDemarche) === null || _a === void 0
				? void 0
				: _a.getGenre())
		);
	}
	jsxIfCocheDeclarerStageTrouve() {
		var _a;
		return (
			this.avecCocheDeclarerStageTrouve &&
			((_a = this.demarche.etape) === null || _a === void 0
				? void 0
				: _a.avecCocheDeclarerStageTrouve)
		);
	}
	jsxModelCheckboxDeclarerStageTrouve() {
		return {
			getValue: () => {
				return this.avecActionDeclarerStageTrouve;
			},
			setValue: (aValue) => {
				this.avecActionDeclarerStageTrouve = aValue;
			},
		};
	}
	jsxModeleCommentaire() {
		return {
			getValue: () => {
				return this.demarche.commentaire;
			},
			setValue: (aValue) => {
				this.demarche.commentaire = aValue;
			},
		};
	}
	jsxModelBtnSelecteurAjoutPJ() {
		return {
			getOptionsSelecFile: () => {
				return {
					maxSize: (0, AccessApp_1.getApp)().droits.get(
						ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
					),
				};
			},
			addFiles: (aParams) => {
				this.demarche.listePJ.add(aParams.eltFichier);
			},
			getLibelle: () => {
				return TradInterfaceRechercheDeStage.ajouterPieceJointe;
			},
			getIcone: () => {
				return "icon_piece_jointe";
			},
		};
	}
	jsxIfListePiecesJointes() {
		return this.demarche.listePJ.count() > 0;
	}
	jsxGetHtmlListePiecesJointes() {
		return this.demarche.listePJ.count()
			? UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.demarche.listePJ,
					{ IEModelChips: "SupprPieceJointe" },
				)
			: "";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			SupprPieceJointe: {
				eventBtn: function (aIndice) {
					const lFichierASupp = aInstance.demarche.listePJ.get(aIndice);
					if (!!lFichierASupp) {
						lFichierASupp.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				},
			},
		});
	}
	setDonnees(aDonnees) {
		var _a;
		var _b;
		this.natureDemarche = aDonnees.natureDemarche;
		this.avecSaisieEntreprise = aDonnees.avecSaisieEntreprise;
		if (aDonnees.evenement) {
			this.demarche = MethodesObjet_1.MethodesObjet.dupliquer(
				aDonnees.evenement,
			);
			this.demarche.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		this.demarche.nature = this.natureDemarche;
		(_a = (_b = this.demarche).etape) !== null && _a !== void 0
			? _a
			: (_b.etape = this.natureDemarche.listeStatutsEtape.getElementParFiltre(
					(aStatut) => {
						return aStatut.estParDefaut;
					},
				));
		this.getInstance(this.idDate).setDonnees(this.demarche.date);
		this.avecCocheDeclarerStageTrouve = aDonnees.avecCocheDeclarerStagetrouve;
		this.infosEntreprise =
			aDonnees.entreprise ||
			ObjetElement_1.ObjetElement.create({
				strRaisonSociale: "",
				SIRET: "",
				strAdresse1: "",
				strAdresse2: "",
				strAdresse3: "",
				strAdresse4: "",
				strVille: "",
				strCP: "",
				strPays: "",
				strEmail: "",
				strIndTelephone: "",
				strTelephone: "",
			});
		this.UtilitaireSaisieEntreprise.setDonnees(
			this.infosEntreprise,
			this.avecSaisieEntreprise &&
				this.demarche.nature.getGenre() ===
					TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve,
			(aInfosEntreprise) => {
				this.infosEntreprise = aInfosEntreprise;
			},
		);
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		var _a;
		if (aNumeroBouton === 1) {
			if (this.avecSaisieEntreprise) {
				if (
					this.demarche.nature.getGenre() ===
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsRechercheEnCours &&
					((_a = this.infosEntreprise.strRaisonSociale) === null ||
					_a === void 0
						? void 0
						: _a.trim().length) > 0
				) {
					this.demarche.entreprise = this.infosEntreprise;
				} else if (
					this.demarche.nature.getGenre() ===
						TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve &&
					this.UtilitaireSaisieEntreprise.estValidationPossible()
				) {
					this.demarche.entreprise = this.infosEntreprise;
				} else {
					GApplication.getMessage().afficher({
						message:
							TradInterfaceRechercheDeStage.erreurChampsObligatoiresNonSaisis,
					});
					return;
				}
			}
			this.callback.appel(
				this.demarche,
				this.jsxIfCocheDeclarerStageTrouve() &&
					this.avecActionDeclarerStageTrouve,
			);
		}
		this.fermer();
	}
}
class ObjetFenetre_SelectionEntreprise extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			hauteur: 500,
			largeur: 400,
			titre: TradInterfaceRechercheDeStage.titreResultatRecherche,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Annuler")],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				if (
					aParametres.genreEvenement ===
					Enumere_EvenementListe_1.EGenreEvenementListe.Selection
				) {
					this.callback.appel(1, aParametres.article);
					this.fermer();
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					forcerOmbreScrollTop: true,
				});
			},
		);
	}
	composeContenu() {
		return IE.jsx.str(
			"div",
			{ class: "flex-contain flex-cols full-height" },
			IE.jsx.str(
				"p",
				{ class: "m-bottom-l" },
				TradInterfaceRechercheDeStage.selectionnezEntrepriseVoulue,
			),
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				class: ["fluid-bloc"],
			}),
		);
	}
	setDonnees(aListeEntreprises) {
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionEntreprise(aListeEntreprises),
		);
	}
}
class DonneesListe_SelectionEntreprise extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeDonnees) {
		super(aListeDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.strRaisonSociale;
	}
	getInfosSuppZonePrincipale(aParams) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			aParams.article.strAdresse1,
			" ",
			aParams.article.strAdresse2,
		);
	}
	getZoneMessage(aParams) {
		return _composeCPVillePays(aParams.article);
	}
}
class ObjetFenetre_EditionEntreprise extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecInfosComplet = false;
		this.UtilitaireSaisieEntreprise = new UtilitaireSaisieEntreprise();
		this.setOptionsFenetre({
			titre: TradInterfaceRechercheDeStage.saisieInfomationsEntreprise,
			largeur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	composeContenu() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ "ie-if": this.jsxIfAvecInfosComplet.bind(this, true) },
				this.UtilitaireSaisieEntreprise.composeFormulaireEntreprise(),
			),
			IE.jsx.str(
				"div",
				{ "ie-if": this.jsxIfAvecInfosComplet.bind(this, false) },
				this.UtilitaireSaisieEntreprise.composeEntrepriseConcernee(),
			),
		);
	}
	jsxIfAvecInfosComplet(aAvecInfosComplet) {
		return this.avecInfosComplet === aAvecInfosComplet;
	}
	setDonnees(aEntreprise, aAvecInfosComplet) {
		this.infosEntreprise = MethodesObjet_1.MethodesObjet.dupliquer(aEntreprise);
		this.avecInfosComplet = aAvecInfosComplet;
		this.UtilitaireSaisieEntreprise.setDonnees(
			this.infosEntreprise,
			this.avecInfosComplet,
			(aInfosEntreprise) => {
				this.infosEntreprise = aInfosEntreprise;
			},
			true,
		);
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		var _a;
		if (aNumeroBouton === 1) {
			if (
				this.avecInfosComplet &&
				!this.UtilitaireSaisieEntreprise.estValidationPossible()
			) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						message:
							TradInterfaceRechercheDeStage.erreurChampsObligatoiresNonSaisis,
					});
			} else if (
				!this.avecInfosComplet &&
				!(
					((_a = this.infosEntreprise.strRaisonSociale) === null ||
					_a === void 0
						? void 0
						: _a.trim().length) > 0
				)
			) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						message:
							TradInterfaceRechercheDeStage.erreurChampObligatoireNonSaisi,
					});
			} else {
				this.fermer();
				this.callback.appel(aNumeroBouton, this.infosEntreprise);
			}
		} else {
			this.fermer();
		}
	}
}
class UtilitaireSaisieEntreprise {
	constructor() {
		this.infosEntreprise = ObjetElement_1.ObjetElement.create({
			strRaisonSociale: "",
			SIRET: "",
			strAdresse1: "",
			strAdresse2: "",
			strAdresse3: "",
			strAdresse4: "",
			strVille: "",
			strCP: "",
			strPays: "",
			strEmail: "",
			strIndTelephone: "",
			strTelephone: "",
		});
		this.SIRET = "";
		this.estSIRETConnu = true;
		this.estEntrepriseEnFrance = true;
		this.idCodePostal = GUID_1.GUID.getId();
		this.idLabelCodePostal = GUID_1.GUID.getId();
		this.marqueurChampsObligatoire = IE.jsx.str(
			"span",
			{ "aria-hidden": "true", class: "Inline" },
			"*",
		);
	}
	setDonnees(
		aInfosEntreprise,
		aAvecModificationPays,
		aCallbackEntreprise,
		aEstFenetreEdition,
	) {
		if (aInfosEntreprise) {
			this.infosEntreprise = aInfosEntreprise;
			this.SIRET = this.infosEntreprise.SIRET;
			if (aEstFenetreEdition && this.SIRET === "") {
				this.estSIRETConnu = false;
			}
			if (
				this.infosEntreprise.strPays !== "" &&
				this.infosEntreprise.strPays !== TradInterfaceRechercheDeStage.france
			) {
				this.estEntrepriseEnFrance = false;
			}
			if (
				aAvecModificationPays &&
				this.estEntrepriseEnFrance &&
				this.infosEntreprise.strPays === ""
			) {
				this.infosEntreprise.strPays = TradInterfaceRechercheDeStage.france;
			}
		}
		this.callbackEntreprise = aCallbackEntreprise;
	}
	estValidationPossible() {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j;
		return (
			this.infosEntreprise &&
			((this.infosEntreprise.getNumero() !== undefined &&
				this.infosEntreprise.getNumero() !== 0) ||
				(((_a = this.infosEntreprise.strRaisonSociale) === null || _a === void 0
					? void 0
					: _a.trim().length) > 0 &&
					(((_b = this.infosEntreprise.strAdresse1) === null || _b === void 0
						? void 0
						: _b.trim().length) > 0 ||
						((_c = this.infosEntreprise.strAdresse2) === null || _c === void 0
							? void 0
							: _c.trim().length) > 0 ||
						((_d = this.infosEntreprise.strAdresse3) === null || _d === void 0
							? void 0
							: _d.trim().length) > 0 ||
						((_e = this.infosEntreprise.strAdresse4) === null || _e === void 0
							? void 0
							: _e.trim().length) > 0) &&
					((_f = this.infosEntreprise.strVille) === null || _f === void 0
						? void 0
						: _f.trim().length) > 0 &&
					(!this.estEntrepriseEnFrance ||
						((_g = this.infosEntreprise.strCP) === null || _g === void 0
							? void 0
							: _g.trim().length) > 0) &&
					((_h = this.infosEntreprise.strEmail) === null || _h === void 0
						? void 0
						: _h.trim().length) > 0 &&
					UtilitaireEmail_1.TUtilitaireEmail.estValide(
						this.infosEntreprise.strEmail,
					) &&
					((_j = this.infosEntreprise.strTelephone) === null || _j === void 0
						? void 0
						: _j.trim().length) > 0))
		);
	}
	composeEntrepriseConcernee() {
		const lIdInputInfoEntreprise = GUID_1.GUID.getId();
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"p",
				{
					"aria-hidden": "true",
					class: [
						Divers_css_1.StylesDivers.italic,
						Divers_css_1.StylesDivers.mBottomL,
					],
				},
				this.marqueurChampsObligatoire,
				" ",
				TradInterfaceRechercheDeStage.champsObligatoires,
			),
			IE.jsx.str(
				"label",
				{ for: lIdInputInfoEntreprise },
				TradInterfaceRechercheDeStage.entrepriseConcernee,
				" ",
				this.marqueurChampsObligatoire,
			),
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str("input", {
					id: lIdInputInfoEntreprise,
					type: "text",
					"ie-model": this.jsxModelTextEntreprise.bind(this),
					required: true,
					style: { width: "100%" },
				}),
			),
		);
	}
	composeFormulaireEntreprise() {
		const lIdInputSiret = GUID_1.GUID.getId();
		const lIdRaisonSociale = GUID_1.GUID.getId();
		const lIdAdresse = GUID_1.GUID.getId();
		const lIdVille = GUID_1.GUID.getId();
		const lIdPays = GUID_1.GUID.getId();
		const lIdEmail = GUID_1.GUID.getId();
		const lIdTelephone = GUID_1.GUID.getId();
		return IE.jsx.str(
			"div",
			{
				class:
					InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
						.SaisieInfosEntreprise,
			},
			IE.jsx.str(
				"p",
				{
					"aria-hidden": "true",
					class: [
						Divers_css_1.StylesDivers.italic,
						Divers_css_1.StylesDivers.mBottomL,
					],
				},
				this.marqueurChampsObligatoire,
				" ",
				TradInterfaceRechercheDeStage.champsObligatoires,
			),
			IE.jsx.str(
				"ie-switch",
				{ "ie-model": this.jsxModelEntrepriseEnFrance.bind(this) },
				TradInterfaceRechercheDeStage.entrepriseEnFrance,
			),
			IE.jsx.str(
				"div",
				{ "ie-if": this.jsxIfEntrepriseEnFrance.bind(this) },
				IE.jsx.str(
					"div",
					{ class: "m-top-xl" },
					IE.jsx.str(
						"ie-radio",
						{ "ie-model": this.jsxModelRadioConnaisSiret.bind(this, true) },
						TradInterfaceRechercheDeStage.connaisSiret,
					),
					IE.jsx.str("ie-btntooltip", {
						class: "m-left-l",
						"ie-model": this.jsxModelBtnTooltipSiret.bind(this),
					}),
				),
				IE.jsx.str(
					"label",
					{ for: lIdInputSiret, class: "m-left-l m-top-l m-bottom-l" },
					TradInterfaceRechercheDeStage.preremplirGraceSiret,
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain align-center m-left-l" },
					IE.jsx.str("input", {
						id: lIdInputSiret,
						type: "text",
						class: [
							"real-size",
							InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
								.inputSiret,
						],
						"ie-model": this.jsxModelTextSiret.bind(this),
						maxlength: ObjetChaine_1.GChaine.getLongueurMaximaleSIRET(),
						"ie-mask": "/[^0-9]/i",
						title: TradInterfaceRechercheDeStage.titleSiret,
						placeholder: TradInterfaceRechercheDeStage.numSiret,
					}),
					IE.jsx.str(
						"ie-bouton",
						{
							class: "small-bt m-left-l",
							"ie-model": this.jsxModelBtnRechercherEntreprise.bind(this),
						},
						TradInterfaceRechercheDeStage.rechercher,
					),
				),
				IE.jsx.str(
					"ie-radio",
					{
						class: "m-top-xl",
						"ie-model": this.jsxModelRadioConnaisSiret.bind(this, false),
						"aria-describedby": lIdInputSiret,
					},
					TradInterfaceRechercheDeStage.neConnaisPasSiret,
				),
			),
			IE.jsx.str(
				"div",
				{
					class:
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.champsForm,
				},
				IE.jsx.str(
					"label",
					{ for: lIdRaisonSociale },
					TradInterfaceRechercheDeStage.raisonSociale,
					" ",
					this.marqueurChampsObligatoire,
				),
				IE.jsx.str("input", {
					id: lIdRaisonSociale,
					type: "text",
					"ie-model": this.jsxModelText.bind(
						this,
						InformationsEntreprise.raisonSociale,
					),
					required: true,
				}),
			),
			IE.jsx.str(
				"div",
				{
					role: "group",
					"aria-labelledby": lIdAdresse,
					class:
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.champsForm,
				},
				IE.jsx.str(
					"label",
					{ id: lIdAdresse },
					TradInterfaceRechercheDeStage.adresse,
					" ",
					this.marqueurChampsObligatoire,
				),
				IE.jsx.str("input", {
					type: "text",
					"ie-model": this.jsxModelText.bind(
						this,
						InformationsEntreprise.adresse1,
					),
					placeholder:
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse1,
					"aria-label":
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse1,
					required: true,
				}),
				IE.jsx.str("input", {
					type: "text",
					"ie-model": this.jsxModelText.bind(
						this,
						InformationsEntreprise.adresse2,
					),
					placeholder:
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse2,
					"aria-label":
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse2,
					required: true,
					class: "m-top",
				}),
				IE.jsx.str("input", {
					type: "text",
					"ie-model": this.jsxModelText.bind(
						this,
						InformationsEntreprise.adresse3,
					),
					placeholder:
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse3,
					"aria-label":
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse3,
					required: true,
					class: "m-top",
				}),
				IE.jsx.str("input", {
					type: "text",
					"ie-model": this.jsxModelText.bind(
						this,
						InformationsEntreprise.adresse4,
					),
					placeholder:
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse4,
					"aria-label":
						GlossaireAdresse_1.TradGlossaireAdresse.PlaceholderAdresse4,
					required: true,
					class: "m-top",
				}),
			),
			IE.jsx.str(
				"div",
				{
					class: [
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.champsForm,
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.CPVille,
					],
				},
				IE.jsx.str(
					"div",
					{
						class:
							InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
								.codePostal,
					},
					IE.jsx.str(
						"label",
						{ for: this.idCodePostal, id: this.idLabelCodePostal },
						TradInterfaceRechercheDeStage.codePostal,
						" ",
						this.marqueurChampsObligatoire,
					),
					IE.jsx.str("input", {
						class: "real-size",
						id: this.idCodePostal,
						type: "text",
						"ie-model": this.jsxModelText.bind(
							this,
							InformationsEntreprise.codePostal,
						),
						required: true,
					}),
				),
				IE.jsx.str(
					"div",
					{
						class:
							InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
								.ville,
					},
					IE.jsx.str(
						"label",
						{ for: lIdVille },
						TradInterfaceRechercheDeStage.ville,
						" ",
						this.marqueurChampsObligatoire,
					),
					IE.jsx.str("input", {
						id: lIdVille,
						type: "text",
						"ie-model": this.jsxModelText.bind(
							this,
							InformationsEntreprise.ville,
						),
						required: true,
					}),
				),
			),
			IE.jsx.str(
				"div",
				{
					class:
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.champsForm,
				},
				IE.jsx.str(
					"label",
					{ for: lIdPays },
					TradInterfaceRechercheDeStage.pays,
				),
				IE.jsx.str("input", {
					id: lIdPays,
					type: "text",
					"ie-model": this.jsxModelText.bind(this, InformationsEntreprise.pays),
				}),
			),
			IE.jsx.str(
				"div",
				{
					class:
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.champsForm,
				},
				IE.jsx.str(
					"label",
					{ for: lIdEmail },
					TradInterfaceRechercheDeStage.email,
					" ",
					this.marqueurChampsObligatoire,
				),
				IE.jsx.str("input", {
					id: lIdEmail,
					type: "email",
					"ie-model": this.jsxModelText.bind(
						this,
						InformationsEntreprise.email,
					),
					"ie-style": this.jsxGetStyleInput.bind(
						this,
						InformationsEntreprise.email,
					),
					required: true,
				}),
			),
			IE.jsx.str(
				"div",
				{
					class:
						InterfaceRechercheDeStage_css_1.StylesInterfaceRechercheDeStage
							.champsForm,
				},
				IE.jsx.str(
					"label",
					{ for: lIdTelephone },
					TradInterfaceRechercheDeStage.telephone,
					" ",
					this.marqueurChampsObligatoire,
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str("input", {
						type: "text",
						"ie-model": this.jsxModelText.bind(
							this,
							InformationsEntreprise.indTelephone,
						),
						"aria-label": TradInterfaceRechercheDeStage.indTelephone,
						"ie-indicatiftel": true,
					}),
					IE.jsx.str("input", {
						id: lIdTelephone,
						type: "text",
						"ie-model": this.jsxModelText.bind(
							this,
							InformationsEntreprise.telephone,
						),
						"ie-telephone": true,
						required: true,
					}),
				),
			),
		);
	}
	jsxModelTextEntreprise() {
		return {
			getValue: () => {
				var _a;
				return (_a = this.infosEntreprise) === null || _a === void 0
					? void 0
					: _a.strRaisonSociale;
			},
			setValue: (aValue) => {
				this.infosEntreprise.strRaisonSociale = aValue;
			},
		};
	}
	jsxModelEntrepriseEnFrance() {
		return {
			getValue: () => {
				return this.estEntrepriseEnFrance;
			},
			setValue: (aValue) => {
				this.estEntrepriseEnFrance = aValue;
				const lInputCP = ObjetHtml_1.GHtml.getElement(this.idCodePostal);
				if (!this.estEntrepriseEnFrance) {
					this.infosEntreprise.SIRET = "";
					this.SIRET = "";
					this.infosEntreprise.setNumero(0);
					lInputCP.toggleAttribute("required", false);
					ObjetHtml_1.GHtml.setHtml(
						this.idLabelCodePostal,
						TradInterfaceRechercheDeStage.codePostal,
					);
					this.infosEntreprise.strPays =
						this.infosEntreprise.strPays ===
						TradInterfaceRechercheDeStage.france
							? ""
							: this.infosEntreprise.strPays;
				} else {
					lInputCP.toggleAttribute("required", true);
					ObjetHtml_1.GHtml.setHtml(
						this.idLabelCodePostal,
						TradInterfaceRechercheDeStage.codePostal +
							" " +
							this.marqueurChampsObligatoire,
					);
					this.infosEntreprise.strPays = TradInterfaceRechercheDeStage.france;
				}
			},
		};
	}
	jsxIfEntrepriseEnFrance() {
		return this.estEntrepriseEnFrance;
	}
	jsxModelRadioConnaisSiret(aConnais) {
		return {
			getValue: () => {
				return this.estSIRETConnu === aConnais;
			},
			setValue: () => {
				this.estSIRETConnu = aConnais;
				if (!this.estSIRETConnu) {
					this.infosEntreprise.SIRET = "";
					this.SIRET = "";
					this.infosEntreprise.setNumero(0);
				}
			},
			getName: () => {
				return `UtilRecherStage_ConnaisSiret`;
			},
		};
	}
	jsxModelTextSiret() {
		return {
			getValue: () => {
				return this.SIRET;
			},
			setValue: (aValue) => {
				this.SIRET = aValue;
			},
			toDisplay: () => {
				return ObjetChaine_1.GChaine.formaterChaineEnSIRET(this.SIRET);
			},
			fromDisplay: (aValue) => {
				return aValue.replaceAll(" ", "");
			},
			getDisabled: () => {
				return !this.estSIRETConnu;
			},
		};
	}
	jsxModelBtnRechercherEntreprise() {
		return {
			event: () => {
				this.lancerRechercheEntreprise();
			},
			getDisabled: () => {
				const lChaineFormatee = ObjetChaine_1.GChaine.formaterChaineEnSIRET(
					this.SIRET,
				);
				return (
					!this.estSIRETConnu ||
					lChaineFormatee.length !==
						ObjetChaine_1.GChaine.getLongueurMaximaleSIRET()
				);
			},
		};
	}
	lancerRechercheEntreprise() {
		new ObjetRequeteRechercheEntreprise_1.ObjetRequeteRechercheEntreprise(
			this,
			(aJSON) => {
				var _a;
				const lNombreEntreprise =
					(_a = aJSON.listeEntreprises) === null || _a === void 0
						? void 0
						: _a.count();
				if (lNombreEntreprise > 0) {
					if (lNombreEntreprise > 1) {
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionEntreprise,
							{
								pere: this,
								evenement(aNumber, aEntreprise) {
									if (aNumber === 1 && aEntreprise) {
										this.infosEntreprise = aEntreprise;
										this.callbackEntreprise(this.infosEntreprise);
									}
								},
							},
						).setDonnees(aJSON.listeEntreprises);
						return;
					} else {
						const lEntrepriseTrouvee = aJSON.listeEntreprises.get(0);
						this.infosEntreprise.setNumero(lEntrepriseTrouvee.getNumero());
						this.infosEntreprise.strRaisonSociale =
							lEntrepriseTrouvee.strRaisonSociale;
						this.infosEntreprise.SIRET = lEntrepriseTrouvee.SIRET;
						this.infosEntreprise.strAdresse1 = lEntrepriseTrouvee.strAdresse1;
						this.infosEntreprise.strAdresse2 = lEntrepriseTrouvee.strAdresse2;
						this.infosEntreprise.strAdresse3 = lEntrepriseTrouvee.strAdresse3;
						this.infosEntreprise.strAdresse4 = lEntrepriseTrouvee.strAdresse4;
						this.infosEntreprise.strVille = lEntrepriseTrouvee.strVille;
						this.infosEntreprise.strCP = lEntrepriseTrouvee.strCP;
						this.infosEntreprise.strPays =
							lEntrepriseTrouvee.strPays || this.infosEntreprise.strPays;
						this.infosEntreprise.strEmail =
							lEntrepriseTrouvee.strEmail || this.infosEntreprise.strEmail;
						this.infosEntreprise.strIndTelephone =
							lEntrepriseTrouvee.strIndTelephone ||
							this.infosEntreprise.strIndTelephone;
						this.infosEntreprise.strTelephone =
							lEntrepriseTrouvee.strTelephone ||
							this.infosEntreprise.strTelephone;
						this.callbackEntreprise(this.infosEntreprise);
					}
				} else {
					GApplication.getMessage().afficher({ message: aJSON.message });
				}
			},
		).lancerRequete({
			siretPourBDD: ObjetChaine_1.GChaine.formaterChaineEnSIRET(this.SIRET),
			siretPourAPI: this.SIRET,
		});
	}
	jsxModelBtnTooltipSiret() {
		return {
			getTooltip() {
				return TradInterfaceRechercheDeStage.tooltipSiret;
			},
		};
	}
	jsxModelText(aChamp) {
		return {
			getValue: () => {
				var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
				switch (aChamp) {
					case InformationsEntreprise.raisonSociale:
						return (_a = this.infosEntreprise) === null || _a === void 0
							? void 0
							: _a.strRaisonSociale;
					case InformationsEntreprise.adresse1:
						return (_b = this.infosEntreprise) === null || _b === void 0
							? void 0
							: _b.strAdresse1;
					case InformationsEntreprise.adresse2:
						return (_c = this.infosEntreprise) === null || _c === void 0
							? void 0
							: _c.strAdresse2;
					case InformationsEntreprise.adresse3:
						return (_d = this.infosEntreprise) === null || _d === void 0
							? void 0
							: _d.strAdresse3;
					case InformationsEntreprise.adresse4:
						return (_e = this.infosEntreprise) === null || _e === void 0
							? void 0
							: _e.strAdresse4;
					case InformationsEntreprise.codePostal:
						return (_f = this.infosEntreprise) === null || _f === void 0
							? void 0
							: _f.strCP;
					case InformationsEntreprise.ville:
						return (_g = this.infosEntreprise) === null || _g === void 0
							? void 0
							: _g.strVille;
					case InformationsEntreprise.pays:
						return (_h = this.infosEntreprise) === null || _h === void 0
							? void 0
							: _h.strPays;
					case InformationsEntreprise.email:
						return (_j = this.infosEntreprise) === null || _j === void 0
							? void 0
							: _j.strEmail;
					case InformationsEntreprise.indTelephone:
						return (_k = this.infosEntreprise) === null || _k === void 0
							? void 0
							: _k.strIndTelephone;
					case InformationsEntreprise.telephone:
						return (_l = this.infosEntreprise) === null || _l === void 0
							? void 0
							: _l.strTelephone;
				}
			},
			setValue: (aValue) => {
				switch (aChamp) {
					case InformationsEntreprise.raisonSociale:
						this.infosEntreprise.strRaisonSociale = aValue;
						break;
					case InformationsEntreprise.adresse1:
						this.infosEntreprise.strAdresse1 = aValue;
						break;
					case InformationsEntreprise.adresse2:
						this.infosEntreprise.strAdresse2 = aValue;
						break;
					case InformationsEntreprise.adresse3:
						this.infosEntreprise.strAdresse3 = aValue;
						break;
					case InformationsEntreprise.adresse4:
						this.infosEntreprise.strAdresse4 = aValue;
						break;
					case InformationsEntreprise.codePostal:
						this.infosEntreprise.strCP = aValue;
						break;
					case InformationsEntreprise.ville:
						this.infosEntreprise.strVille = aValue;
						break;
					case InformationsEntreprise.pays:
						this.infosEntreprise.strPays = aValue;
						break;
					case InformationsEntreprise.email:
						this.infosEntreprise.strEmail = aValue;
						break;
					case InformationsEntreprise.indTelephone:
						this.infosEntreprise.strIndTelephone = aValue;
						break;
					case InformationsEntreprise.telephone:
						this.infosEntreprise.strTelephone = aValue;
						break;
				}
			},
			getDisabled: () => {
				switch (aChamp) {
					case InformationsEntreprise.raisonSociale:
					case InformationsEntreprise.adresse1:
					case InformationsEntreprise.adresse2:
					case InformationsEntreprise.adresse3:
					case InformationsEntreprise.adresse4:
					case InformationsEntreprise.codePostal:
					case InformationsEntreprise.ville:
						return this.estEntrepriseEnFrance && this.estSIRETConnu;
					case InformationsEntreprise.pays:
						return this.estEntrepriseEnFrance;
					case InformationsEntreprise.email:
					case InformationsEntreprise.indTelephone:
					case InformationsEntreprise.telephone:
						return (
							this.infosEntreprise.getNumero() !== undefined &&
							this.infosEntreprise.getNumero() !== 0
						);
				}
			},
		};
	}
	jsxGetStyleInput(aChamp) {
		switch (aChamp) {
			case InformationsEntreprise.email:
				return {
					color:
						!!this.infosEntreprise.strEmail &&
						!UtilitaireEmail_1.TUtilitaireEmail.estValide(
							this.infosEntreprise.strEmail,
						)
							? "var(--color-red-moyen)"
							: "",
				};
		}
	}
}
function _composeCPVillePays(aEntreprise) {
	return IE.jsx.str(
		IE.jsx.fragment,
		null,
		aEntreprise.strCP,
		aEntreprise.strCP && (aEntreprise.strVille || aEntreprise.strPays) && " - ",
		aEntreprise.strVille,
		aEntreprise.strVille && aEntreprise.strPays && " - ",
		aEntreprise.strPays,
	);
}
var InformationsEntreprise;
(function (InformationsEntreprise) {
	InformationsEntreprise[(InformationsEntreprise["raisonSociale"] = 0)] =
		"raisonSociale";
	InformationsEntreprise[(InformationsEntreprise["adresse1"] = 1)] = "adresse1";
	InformationsEntreprise[(InformationsEntreprise["adresse2"] = 2)] = "adresse2";
	InformationsEntreprise[(InformationsEntreprise["adresse3"] = 3)] = "adresse3";
	InformationsEntreprise[(InformationsEntreprise["adresse4"] = 4)] = "adresse4";
	InformationsEntreprise[(InformationsEntreprise["codePostal"] = 5)] =
		"codePostal";
	InformationsEntreprise[(InformationsEntreprise["ville"] = 6)] = "ville";
	InformationsEntreprise[(InformationsEntreprise["pays"] = 7)] = "pays";
	InformationsEntreprise[(InformationsEntreprise["email"] = 8)] = "email";
	InformationsEntreprise[(InformationsEntreprise["indTelephone"] = 9)] =
		"indTelephone";
	InformationsEntreprise[(InformationsEntreprise["telephone"] = 10)] =
		"telephone";
})(InformationsEntreprise || (InformationsEntreprise = {}));
const TradInterfaceRechercheDeStage =
	ObjetTraduction_2.TraductionsModule.getModule("InterfaceRechercheDeStage", {
		aucuneSession: "",
		labelComboSession: "",
		demarrerDiscussion: "",
		nouvelleDemarche: "",
		aucuneDemarche: "",
		aucuneDiscussion: "",
		suiviPar: "",
		ajouterUneEtape: "",
		date: "",
		etape: "",
		commentaire: "",
		ajouterPieceJointe: "",
		rechercher: "",
		titleSiret: "",
		confirmationSuppressionDemarche: "",
		confirmationSuppressionEtape: "",
		numSiret: "",
		france: "",
		entreprise: "",
		titreResultatRecherche: "",
		informationsEntreprise: "",
		selectionnezEntrepriseVoulue: "",
		saisieInfomationsEntreprise: "",
		champsObligatoires: "",
		erreurChampsObligatoiresNonSaisis: "",
		erreurChampObligatoireNonSaisi: "",
		entrepriseConcernee: "",
		raisonSociale: "",
		adresse: "",
		ville: "",
		codePostal: "",
		pays: "",
		email: "",
		indTelephone: "",
		telephone: "",
		entrepriseEnFrance: "",
		ParX: "",
		filtreEtatAvancementRechercheStage: "",
		tousLesEtatsAvancements: "",
		tooltipSiret: "",
		connaisSiret: "",
		neConnaisPasSiret: "",
		preremplirGraceSiret: "",
		objetDiscussion: "",
		totalTitre: "",
		totalRechercheNonDebutee: "",
		totalRechercheEnCours: "",
		totalStageTrouve: "",
		cocheDeclarerleStageTrouve: "",
		existeDejaUnStageTrouve: "",
		stageExistant: "",
		stageCree: "",
		infoQueDiscussion: "",
		entrepriseSaisieFicheDeStage: "",
		multiStagesExistant: "",
		multiStagesExistantPourEleve: "",
	});
var TypeOrigineCreationEtatAvancementRechercheStage;
(function (TypeOrigineCreationEtatAvancementRechercheStage) {
	TypeOrigineCreationEtatAvancementRechercheStage[
		(TypeOrigineCreationEtatAvancementRechercheStage["ocearsUtilisateur"] = 0)
	] = "ocearsUtilisateur";
	TypeOrigineCreationEtatAvancementRechercheStage[
		(TypeOrigineCreationEtatAvancementRechercheStage["ocearsEnPreparation"] = 1)
	] = "ocearsEnPreparation";
	TypeOrigineCreationEtatAvancementRechercheStage[
		(TypeOrigineCreationEtatAvancementRechercheStage["ocearsRechercheEnCours"] =
			2)
	] = "ocearsRechercheEnCours";
	TypeOrigineCreationEtatAvancementRechercheStage[
		(TypeOrigineCreationEtatAvancementRechercheStage["ocearsStageTrouve"] = 3)
	] = "ocearsStageTrouve";
	TypeOrigineCreationEtatAvancementRechercheStage[
		(TypeOrigineCreationEtatAvancementRechercheStage["ocearsStageExistant"] = 4)
	] = "ocearsStageExistant";
	TypeOrigineCreationEtatAvancementRechercheStage[
		(TypeOrigineCreationEtatAvancementRechercheStage["ocearsStageCree"] = 5)
	] = "ocearsStageCree";
})(
	TypeOrigineCreationEtatAvancementRechercheStage ||
		(exports.TypeOrigineCreationEtatAvancementRechercheStage =
			TypeOrigineCreationEtatAvancementRechercheStage =
				{}),
);
const UtilCreationEtatAvancementRechercheStage = {
	getPicto: (aTypeOrigineCreationEtatAvancementRechercheStage) => {
		switch (aTypeOrigineCreationEtatAvancementRechercheStage) {
			case TypeOrigineCreationEtatAvancementRechercheStage.ocearsUtilisateur:
				return "";
			case TypeOrigineCreationEtatAvancementRechercheStage.ocearsEnPreparation:
				return "icon_plume";
			case TypeOrigineCreationEtatAvancementRechercheStage.ocearsRechercheEnCours:
				return "icon_edt_permanence";
			case TypeOrigineCreationEtatAvancementRechercheStage.ocearsStageTrouve:
				return "icon_doc_certifie";
		}
	},
};
