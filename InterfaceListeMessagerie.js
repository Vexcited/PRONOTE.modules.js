exports.InterfaceListeMessagerie = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const TinyInit_1 = require("TinyInit");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const DonneesListe_Messagerie_1 = require("DonneesListe_Messagerie");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetSelecteurPJ_1 = require("ObjetSelecteurPJ");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const TypeHttpReponseMessage_1 = require("TypeHttpReponseMessage");
const TypeOrigineCreationEtiquetteMessage_1 = require("TypeOrigineCreationEtiquetteMessage");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const DonneesListe_SelectEtiquettes_1 = require("DonneesListe_SelectEtiquettes");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const UtilitaireCarnetLiaison_1 = require("UtilitaireCarnetLiaison");
const TypeBoutonCreationMessagerie_1 = require("TypeBoutonCreationMessagerie");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const TypeGenreDiscussion_1 = require("TypeGenreDiscussion");
const TypeCommandeMessagerie_1 = require("TypeCommandeMessagerie");
const tag_1 = require("tag");
const UtilitaireTiny_1 = require("UtilitaireTiny");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const ObjetDestinatairesMessagerie_1 = require("ObjetDestinatairesMessagerie");
const ToucheClavier_1 = require("ToucheClavier");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const IEHtml_1 = require("IEHtml");
class InterfaceListeMessagerie extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.idReponse = GUID_1.GUID.getId();
		this.idReponseSaisie = this.idReponse + "_pere";
		this.idMessagerieDesactiveeHoraire = this.idReponse + "_mess_desact";
		this.idDiscussion = GUID_1.GUID.getId();
		this.idSectionListe = GUID_1.GUID.getId();
		this.idBandeauGauche = this.applicationSco.idBreadcrumbPerso;
		this.idBrouillonNonEnvoye = GUID_1.GUID.getId();
		this.idVisuTransfert = GUID_1.GUID.getId();
		this.idLibellePJ = GUID_1.GUID.getId();
		this.idLibelleCloud = GUID_1.GUID.getId();
		this.sansDiscussions = false;
		this.avecDirecteurAjouteALaDiscussion = false;
		this.avecInclureParentsEleves = false;
		this._options = {
			avecListeDiffusion:
				UtilitaireMessagerie_1.UtilitaireMessagerie.avecListeDiffusionSelonEspace(),
			avecListeDiscussions: true,
			avecBoutonCreation: true,
			typeBoutonCreation:
				TypeBoutonCreationMessagerie_1.TypeBoutonCreationMessagerie.Discussion,
			enFenetre: false,
			estDiscussionCommune: false,
			hauteurTiny: null,
			heightDiscussionFixe: true,
			maxHeightDiscussion: null,
			avecSousDiscussions: true,
			discussionSelectionneeUniquementVisible: false,
			forcerBandeau: false,
			avecMenuActions: true,
			estChat: false,
			genreDiscussion: TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Discussion,
			activerBoutonsBrouillon: true,
			masquerAvertissements: false,
			utilitaireContactVS: null,
			possessionMessageDiscussionUnique: null,
		};
		const lListeDestProfs =
			UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestProfsDiscussionPrimEleveFormat();
		this.avecDiscussionProf =
			!UtilitaireMessagerie_1.UtilitaireMessagerie.avecListeDestinatairesProfsStatique() ||
			(lListeDestProfs && lListeDestProfs.count() > 0);
		this._initBrouillon();
		this.avecEditeurRiche =
			UtilitaireMessagerie_1.UtilitaireMessagerie.avecEditeurTiny();
		Invocateur_1.Invocateur.abonner(
			"notification_actualisationMessage",
			this._notificationCommunication,
			this,
		);
		Invocateur_1.Invocateur.abonner(
			"requeteSaisieMessage",
			this._notificationRequeteSaisieMessage,
			this,
		);
		this.moteurMessagerie =
			new MoteurMessagerie_1.MoteurMessagerie().setOptions({
				instance: this,
				avecTiny: this.avecEditeurRiche,
				callbackBrouillonAvantSaisie: () => {
					return this._sauvegardeBrouillonAvecConfirmationPromise();
				},
				callbackAvantSaisie: () => {
					this._conserverBrouillonChat = false;
					this._initBrouillon();
					if (this.param && this.param.listeMessagerie) {
						this.param.listeMessagerie = null;
					}
				},
				callbackApresSaisie: (aGenre) => {
					switch (aGenre) {
						case MoteurMessagerie_1.MoteurMessagerie.TypeApresSaisieMessage
							.vider:
							return this._viderDiscussion();
					}
				},
			});
	}
	setOptions(aOptions) {
		Object.assign(this._options, aOptions);
		this.moteurMessagerie.setOptions({
			estChat: this._options.estChat,
			discussionSelectionneeUniquementVisible:
				this._options.discussionSelectionneeUniquementVisible,
			estDiscussionCommune: this._options.estDiscussionCommune,
			avecFiltreNonLues: this._avecFiltreNonLues(),
		});
		return this;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
			this._initialiserListe,
		);
		if (this._options.avecListeDiscussions && !this._options.enFenetre) {
			this.identListeEtiquette = this.add(
				ObjetListe_1.ObjetListe,
				this._evenementSurListeEtiquette,
			);
		}
		if (this.moteurMessagerie.autoriserAjoutPJ()) {
			if (this.etatUtilisateurSco.avecCloudDisponibles()) {
				this.setOptions({ avecPJCloud: true });
			}
			this.identSelecteurPJ = this.add(
				ObjetSelecteurPJ_1.ObjetSelecteurPJ,
				this._evntSelecteurPJ.bind(this),
				this._initSelecteurPJ.bind(this),
			);
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
			)
		) {
			this.identDestinataire = this.add(
				ObjetDestinatairesMessagerie_1.ObjetDestinatairesMessagerie,
				this._evenementSurDestinataire,
			);
		}
		if (this.identListeEtiquette !== undefined) {
			this.idPremierObjet = this.getInstance(
				this.identListeEtiquette,
			).IdPremierElement;
		} else {
			this.idPremierObjet = this.getNomInstance(this.identListe);
		}
		if (this._options.estChat) {
			Invocateur_1.Invocateur.desabonner("traiter_notifications_chatVS", this);
			Invocateur_1.Invocateur.abonner(
				"traiter_notifications_chatVS",
				this._actualisationSurNotificationChat.bind(this),
				this,
			);
		}
	}
	jsxModeleBoutonEnvoi(aGenreEnvoi) {
		return {
			event: () => {
				this._evenementSurBoutonRepondre(aGenreEnvoi);
			},
			getDisabled: () => {
				return this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				);
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			zoneNavListeEtiquette() {
				return {
					retourNavigationDefaut() {
						aInstance
							.getInstance(aInstance.identListeEtiquette)
							.focusSurPremierElement();
					},
				};
			},
			zoneNavListeMess() {
				return {
					retourNavigationDefaut() {
						aInstance
							.getInstance(aInstance.identListe)
							.focusSurPremierElement();
					},
				};
			},
			afficherPJs: function () {
				return (
					!aInstance._options.estChat && !aInstance._estMessageCourantChat()
				);
			},
			btnSignature: {
				event() {
					if (!aInstance.etatUtilisateurSco.messagerieSignature) {
						return;
					}
					const lVal =
						(!!aInstance.brouillon ? aInstance.brouillon.contenu || "" : "") +
						aInstance.etatUtilisateurSco.messagerieSignature.signature;
					aInstance._setValeurMessage(lVal);
					aInstance._actualiserContenuSaisie();
				},
				getDisplaySignature() {
					return (
						aInstance.etatUtilisateurSco.messagerieSignature &&
						aInstance.etatUtilisateurSco.messagerieSignature.signature &&
						aInstance.message &&
						!UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageNonEditable(
							aInstance.message,
						)
					);
				},
			},
			getHtmlBandeauDroite: function () {
				if (!aInstance.message) {
					return "";
				}
				return aInstance.moteurMessagerie.composeTitreBandeauDeMessageVisu(
					aInstance.message,
					{
						avecMenuActions:
							aInstance._options.avecMenuActions &&
							aInstance.message.estUneDiscussion &&
							!aInstance.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
							),
						callbackMenu: aInstance._execCommand.bind(aInstance),
					},
				);
			},
			avecMessageSelectionne: function () {
				return !!aInstance.message;
			},
			getHtmlMessageInfo: function () {
				const H = [];
				if (
					aInstance.message &&
					aInstance.messagePourReponse &&
					aInstance.messagePourReponse.messageInfo
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "info" },
							ObjetChaine_1.GChaine.replaceRCToHTML(
								aInstance.messagePourReponse.messageInfo,
							),
						),
					);
				}
				if (
					aInstance.message &&
					aInstance.messagePourReponse &&
					aInstance.messagePourReponse.messageDestinataires
				) {
					H.push(
						IE.jsx.str(
							"div",
							null,
							ObjetChaine_1.GChaine.replaceRCToHTML(
								aInstance.messagePourReponse.messageDestinataires,
							),
						),
					);
				}
				if (
					aInstance.message &&
					aInstance.messagePourReponse &&
					aInstance.messagePourReponse.estCarnetLiaison &&
					aInstance.etatUtilisateurSco.pourPrimaire()
				) {
					H.push(
						IE.jsx.str(
							"div",
							{ class: "ie-titre-petit" },
							ObjetChaine_1.GChaine.replaceRCToHTML(
								ObjetTraduction_1.GTraductions.getValeur(
									"MessagerieCarnetLiaison.AvertissementMessagesPublics",
								),
							),
						),
					);
				}
				return H.join("");
			},
			getNodeTextarea: function () {
				$(this.node).on("keyup change", function () {
					aInstance._setValeurMessage($(this).val());
				});
			},
			brouillon: {
				inputObjet: {
					getValue: function () {
						return aInstance.brouillon && aInstance.brouillon.objet
							? aInstance.brouillon.objet || ""
							: "";
					},
					setValue: function (aValue) {
						aInstance.brouillon.objet = aValue;
						aInstance.brouillon.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					},
				},
			},
			cbInclureParentEleve: {
				getValue: function (aHorsLimiteParentsEleves) {
					return (
						aInstance.avecInclureParentsEleves && !aHorsLimiteParentsEleves
					);
				},
				setValue: function (aHorsLimiteParentsEleves, aValue) {
					aInstance.avecInclureParentsEleves = aValue;
				},
				getDisabled: function (aHorsLimiteParentsEleves) {
					return aHorsLimiteParentsEleves;
				},
			},
			getHtmlBoutonsEnvoi: function () {
				const H = [];
				if (
					aInstance._options.estChat &&
					aInstance.param &&
					!aInstance.param.message
				) {
					H.push(
						IE.jsx.str(
							"ie-bouton",
							{
								"ie-model": aInstance.jsxModeleBoutonEnvoi.bind(
									aInstance,
									TypeHttpReponseMessage_1.TypeHttpReponseMessage.rm_Relance,
								),
								class: Type_ThemeBouton_1.TypeThemeBouton.primaire,
							},
							ObjetTraduction_1.GTraductions.getValeur("Messagerie.BtnEnvoyer"),
						),
					);
				} else if (
					aInstance.listeBoutonsReponse &&
					aInstance.listeBoutonsReponse.parcourir
				) {
					aInstance.listeBoutonsReponse.parcourir((aBouton) => {
						const lGenre = aBouton.getGenre();
						if (
							(lGenre ===
								TypeHttpReponseMessage_1.TypeHttpReponseMessage
									.rm_EnvoiATousSaufParentEleve ||
								lGenre ===
									TypeHttpReponseMessage_1.TypeHttpReponseMessage
										.rm_RelanceATousSaufParentEleve) &&
							!UtilitaireMessagerie_1.UtilitaireMessagerie.interdireReponseParentEleve()
						) {
							if (aBouton.horsLimiteParentsEleves) {
								aInstance.avecInclureParentsEleves = false;
							}
							H.push(
								"<ie-checkbox",
								ObjetHtml_1.GHtml.composeAttr(
									"ie-model",
									"cbInclureParentEleve",
									!!aBouton.horsLimiteParentsEleves,
								),
								aBouton.horsLimiteParentsEleves
									? ObjetHtml_1.GHtml.composeAttr(
											"title",
											ObjetTraduction_1.GTraductions.getValeur(
												"Messagerie.HintInclureParentsElevesDisabled",
											),
										)
									: "",
								">",
								ObjetTraduction_1.GTraductions.getValeur(
									"Messagerie.InclureParentsEleves",
								),
								"</ie-checkbox>",
							);
						}
						H.push(
							IE.jsx.str(
								"ie-bouton",
								{
									"ie-model": aInstance.jsxModeleBoutonEnvoi.bind(
										aInstance,
										lGenre,
									),
									class: Type_ThemeBouton_1.TypeThemeBouton.primaire,
									"ie-ellipsis": true,
								},
								aBouton.getLibelle(),
							),
						);
					});
				}
				return H.join("");
			},
			getHtmlZoneDestinataires: function () {
				const result = [];
				if (
					!!aInstance.messagePourReponse &&
					aInstance.messagePourReponse.estCarnetLiaison &&
					aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
					)
				) {
					result.push(
						UtilitaireMessagerie_1.UtilitaireMessagerie.composeMettreEnCopie({
							avecDirection: true,
						}),
					);
				} else if (
					aInstance.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
					)
				) {
					result.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str("span", {
								"ie-html": "destinataires.nb",
								"ie-hint": "destinataires.hint",
								style: "vertical-align: middle;",
							}),
							IE.jsx.str(
								"div",
								{
									style:
										"margin-left: 5px; display:inline-block;vertical-align: middle;",
									"ie-display": "destinataires.avecBtnAjouter",
								},
								IE.jsx.str("ie-btnicon", {
									"ie-model": "destinataires.btnAjouter",
									class: "icon_plus_cercle",
								}),
							),
						),
					);
				}
				return result.join("");
			},
			cbDestinataireDirecteur: {
				getValue: function () {
					return aInstance.avecDirecteurAjouteALaDiscussion;
				},
				setValue: function (aValue) {
					aInstance.avecDirecteurAjouteALaDiscussion = aValue;
				},
				getDisabled: function () {
					return UtilitaireMessagerie_1.UtilitaireMessagerie.unMessageContientLeDirecteur(
						aInstance.listeMessages,
					);
				},
			},
			destinataires: {
				avecBtnAjouter: function () {
					return (
						aInstance.paramDestinataires &&
						aInstance.messagePourReponse &&
						!aInstance.messagePourReponse.estChat &&
						aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
						)
					);
				},
				btnAjouter: {
					event: function () {
						const lMessagePourReponse = aInstance.messagePourReponse;
						ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
							pere: aInstance,
							initCommandes: function (aInstanceMenu) {
								function _getNb(aGenre) {
									return lMessagePourReponse &&
										lMessagePourReponse.listeDestinataires
										? lMessagePourReponse.listeDestinataires
												.getListeElements((D) => {
													return D.getGenre() === aGenre;
												})
												.count()
										: 0;
								}
								const lNbProfs = _getNb(
										Enumere_Ressource_1.EGenreRessource.Enseignant,
									),
									lNbPerso = _getNb(
										Enumere_Ressource_1.EGenreRessource.Personnel,
									),
									lNbEleve = _getNb(Enumere_Ressource_1.EGenreRessource.Eleve),
									lNbRespon = _getNb(
										Enumere_Ressource_1.EGenreRessource.Responsable,
									);
								if (
									UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
										Enumere_Ressource_1.EGenreRessource.Enseignant,
									)
								) {
									aInstanceMenu.add(
										ObjetTraduction_1.GTraductions.getValeur("Professeurs") +
											(lNbProfs > 0 ? " (+ " + lNbProfs + ")" : ""),
										true,
										() => {
											aInstance._commandeAjoutDest(
												Enumere_Ressource_1.EGenreRessource.Enseignant,
											);
										},
									);
								}
								if (
									UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
										Enumere_Ressource_1.EGenreRessource.Personnel,
									)
								) {
									aInstanceMenu.add(
										ObjetTraduction_1.GTraductions.getValeur("Personnels") +
											(lNbPerso > 0 ? " (+ " + lNbPerso + ")" : ""),
										true,
										() => {
											aInstance._commandeAjoutDest(
												Enumere_Ressource_1.EGenreRessource.Personnel,
											);
										},
									);
								}
								if (
									UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
										Enumere_Ressource_1.EGenreRessource.Eleve,
									)
								) {
									aInstanceMenu.add(
										ObjetTraduction_1.GTraductions.getValeur("Eleves") +
											(lNbEleve > 0 ? " (+ " + lNbEleve + ")" : ""),
										true,
										() => {
											aInstance._commandeAjoutDest(
												Enumere_Ressource_1.EGenreRessource.Eleve,
											);
										},
									);
								}
								if (
									UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
										Enumere_Ressource_1.EGenreRessource.Responsable,
									)
								) {
									aInstanceMenu.add(
										ObjetTraduction_1.GTraductions.getValeur("Responsables") +
											(lNbRespon > 0 ? " (+ " + lNbRespon + ")" : ""),
										true,
										() => {
											aInstance._commandeAjoutDest(
												Enumere_Ressource_1.EGenreRessource.Responsable,
											);
										},
									);
								}
							},
						});
					},
					getTitle: function () {
						return ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.HintAjouterDest",
						);
					},
					getDisabled: function () {
						return aInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estEnConsultation,
						);
					},
				},
				nb: function () {
					let lNb = aInstance._getListeDestinatairesMessageCourant().count();
					if (
						lNb === 0 &&
						aInstance.messagePourReponse &&
						aInstance.messagePourReponse.nbDestinataires
					) {
						lNb = aInstance.messagePourReponse.nbDestinataires;
					}
					return lNb > 0
						? lNb === 1
							? ObjetTraduction_1.GTraductions.getValeur(
									"Messagerie.NDestinataire",
									[lNb],
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"Messagerie.NDestinataires",
									[lNb],
								)
						: "";
				},
				hint: function () {
					const lDestinataires =
						aInstance._getListeDestinatairesMessageCourant();
					if (
						lDestinataires.count() === 0 &&
						aInstance.messagePourReponse &&
						aInstance.messagePourReponse.nbDestinataires
					) {
						return UtilitaireMessagerie_1.UtilitaireMessagerie.getStrHintPublicMessagePromise(
							aInstance,
							aInstance.messagePourReponse.getNumero(),
							false,
							true,
						);
					}
					const lLignes = [];
					lDestinataires
						.setTri([
							ObjetTri_1.ObjetTri.init("Genre"),
							ObjetTri_1.ObjetTri.init("Position"),
						])
						.trier()
						.parcourir((aDest) => {
							let lLibelles =
								aDest.getLibelle() +
								UtilitaireMessagerie_1.UtilitaireMessagerie.getStrHintDetailDePublic(
									aDest,
								);
							lLignes.push(lLibelles);
						});
					return lLignes.join("<br>");
				},
			},
			btnActionsBrouillon: {
				event: function () {
					aInstance._menuContextuelBtnActionsBrouillon(this.node);
				},
			},
			visuMessage: {
				btnDest: {
					event(aNumeroMessage, aGauche) {
						UtilitaireMessagerie_1.UtilitaireMessagerie.afficherFenetreDestinatairesDeMessage(
							aNumeroMessage,
							aGauche,
							false,
						);
					},
					hintPublic(aNumeroMessage, aGauche) {
						return UtilitaireMessagerie_1.UtilitaireMessagerie.getStrHintPublicMessagePromise(
							aInstance,
							aNumeroMessage,
							aGauche,
							false,
							this.node,
						);
					},
				},
			},
			chipsFichierCloud: {
				eventBtn: function (aIndice) {
					const lElement = aInstance.brouillon.listeFichiers.get(aIndice);
					if (lElement) {
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						aInstance._actualiserSelecteurPJ();
						aInstance.actualiserListeCloud();
						aInstance.brouillon.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					}
				},
			},
			afficherMessageAlerteExercice: function () {
				return !!(
					aInstance.message &&
					aInstance.message.estAlerte &&
					aInstance.message.exercice
				);
			},
			afficherChoixCreationAlerte: function () {
				return (
					!aInstance.message &&
					aInstance._options.genreDiscussion ===
						TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte
				);
			},
			comboAlerte: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: 120,
						texteEdit: ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.ModeleAlerte",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					return MethodesObjet_1.MethodesObjet.get(
						aInstance,
						"param.creationAlerte.listeModelesAlerte",
					);
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (aInstance.param && aInstance.param.creationAlerte) {
						if (aInstance.param.creationAlerte.modeleAlerte) {
							lIndice =
								aInstance.param.creationAlerte.listeModelesAlerte.getIndiceParElement(
									aInstance.param.creationAlerte.modeleAlerte,
								) || 0;
						} else {
							aInstance.param.creationAlerte.modeleAlerte =
								aInstance.param.creationAlerte.listeModelesAlerte.get(lIndice);
						}
					}
					return lIndice;
				},
				event: function (aParametres, aInstanceCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstanceCombo.estUneInteractionUtilisateur()
					) {
						aInstance.param.creationAlerte.modeleAlerte = aParametres.element;
						aInstance._initBrouillon();
						aInstance._actualiserContenuSaisie();
					}
				},
			},
			cbExerciceAlerte: {
				getValue: function () {
					return aInstance.param && aInstance.param.creationAlerte
						? aInstance.param.creationAlerte.estExercice
						: false;
				},
				setValue: function (aValue) {
					aInstance.param.creationAlerte.estExercice = aValue;
				},
			},
			getDisplayZoneReponse: function () {
				return !(
					aInstance.message &&
					aInstance.message.estAlerte &&
					aInstance.message.cloture
				);
			},
			getHtmlMessagerieDesactivee() {
				return aInstance.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication
						.messageDiscussionDesactiveeSelonHoraire,
				);
			},
		});
	}
	_notificationCommunication() {
		if (this._options.estChat) {
			return;
		}
		this.setDonnees({ conserverBrouillon: true });
	}
	_notificationRequeteSaisieMessage(
		aEstReponseRequete,
		aInstanceEmetteur,
		aJSONRapportSaisie,
	) {
		if (aEstReponseRequete) {
			Invocateur_1.Invocateur.abonner(
				"notification_actualisationMessage",
				this._notificationCommunication,
				this,
			);
		} else {
			Invocateur_1.Invocateur.desabonner(
				"notification_actualisationMessage",
				this,
			);
		}
		if (this._options.estChat) {
			return;
		}
		if (aEstReponseRequete) {
			const lEstEmetteur =
				aInstanceEmetteur === this || aInstanceEmetteur.Pere === this;
			if (
				lEstEmetteur &&
				aJSONRapportSaisie &&
				aJSONRapportSaisie.estCreationDiscussion
			) {
				this.__selectionneeDiscussionRecente = true;
			}
			this.setDonnees(lEstEmetteur ? this.param : { conserverBrouillon: true });
		}
	}
	_initBrouillon(aContenu, aSurModifMessage) {
		let lContenu = aContenu || "";
		if (
			!aSurModifMessage &&
			this._options.genreDiscussion ===
				TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte &&
			this.param &&
			this.param.creationAlerte &&
			this.param.creationAlerte.modeleAlerte &&
			this.param.creationAlerte.modeleAlerte.contenu
		) {
			lContenu = this.param.creationAlerte.modeleAlerte.contenu;
		}
		this.brouillon =
			UtilitaireMessagerie_1.UtilitaireMessagerie.getBrouillonDefaut();
		this.brouillon.contenu = lContenu;
		this._actualiserContenuSaisie();
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lAvecListeEtiquette = !!this.getInstance(this.identListeEtiquette);
		H.push('<div class="InterfaceListeMessagerie">');
		if (lAvecListeEtiquette) {
			H.push(
				(0, tag_1.tag)(
					"div",
					{ class: "ilm_gauche" },
					(0, tag_1.tag)(
						"div",
						{ class: "ilm_gauche_entete" },
						this.etatUtilisateurSco.pourThemePrimaire()
							? ""
							: (0, tag_1.tag)("h1", {
									id: this.idBandeauGauche,
									tabindex: "0",
									"ie-ellipsis": true,
									class: "titre-onglet",
								}),
					),
					(0, tag_1.tag)("div", {
						class: "ilm_gauche_liste",
						id: this.getNomInstance(this.identListeEtiquette),
						"ie-zonenavigation": "zoneNavListeEtiquette",
					}),
				),
			);
		}
		H.push(
			'<div id="',
			this.idSectionListe,
			'" class="ilm_etiqu_disc',
			this._options.enFenetre ? " fenetre" : "",
			'">',
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "ilm_cont_disc" },
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListe),
					class: "AlignementHaut listeMessagesDiscussion",
					"ie-zonenavigation": "zoneNavListeMess",
				}),
			),
		);
		H.push("</div>");
		H.push(
			IE.jsx.str(
				"div",
				{ class: "ilm_droite", "ie-zonenavigation": true },
				this._composeZoneReponse(),
			),
		);
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aParam) {
		if (this._options.callbackActualisation) {
			this._options.callbackActualisation();
		}
		if (!!aParam && aParam.etiquetteSelectionnee !== undefined) {
			this.setEtiquetteSelectionnee(aParam.etiquetteSelectionnee, false);
		}
		const lListeMessages_prec = this.listeMessagerie;
		this.param = aParam;
		if (aParam && aParam.message) {
			this.message = aParam.message;
			if (!this._options.estChat) {
				this.etatUtilisateurSco.message = this.message;
			}
		}
		if (aParam && aParam.listeMessagerie) {
			this.listeMessagerie = aParam.listeMessagerie;
		}
		if (
			aParam &&
			aParam.listeRessources &&
			aParam.listeRessources.count() > 0
		) {
			this.listeRessourcesFiltreDiscussions = aParam.listeRessources;
		}
		if (aParam && aParam.messagesCommunsEntreLesRessources !== undefined) {
			this.messagesCommunsEntreLesRessources =
				aParam.messagesCommunsEntreLesRessources;
		}
		if (aParam && aParam.avecSelectionPremiereDiscussion) {
			this.avecSelectionPremiereDiscussion =
				aParam.avecSelectionPremiereDiscussion;
		}
		if (aParam && aParam.eleveCarnetLiaison) {
			this.eleveCarnetLiaison = aParam.eleveCarnetLiaison;
		}
		Promise.resolve()
			.then(() => {
				if (!aParam || !aParam.conserverBrouillon) {
					return this._sauvegardeBrouillonAvecConfirmationPromise().then(() => {
						this._initBrouillon(aParam ? aParam.contenuInitial || "" : "");
						if (this.avecEditeurRiche && TinyInit_1.TinyInit) {
							this._initTiny();
						} else {
							ObjetHtml_1.GHtml.setValue(
								this.idReponse,
								this.brouillon.contenu,
							);
						}
						this._actualiserSelecteurPJ();
						this.actualiserListeCloud();
						this.$refreshSelf();
					});
				}
			})
			.then(() => {
				if (this.moteurMessagerie.avecSauvegardeBrouillonAutorise()) {
					ControleSaisieEvenement_1.ControleSaisieEvenement.addSaisieEnCours({
						instance: this,
						actif: () => {
							return this._avecBrouillonASauvegarder();
						},
						saisie: (aCallback) => {
							return this.applicationSco
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"Messagerie.ConfirmationEnregistrerBrouillon",
									),
								})
								.then((aGenreBouton) => {
									if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
										return this.moteurMessagerie.saisieBrouillon(
											MethodesObjet_1.MethodesObjet.dupliquer(this.brouillon),
											MethodesObjet_1.MethodesObjet.dupliquer(
												this.messagePourReponse,
											),
										);
									} else if (aCallback) {
										aCallback();
									}
								});
						},
					});
				}
				ObjetHtml_1.GHtml.setDisplay(
					this.idSectionListe,
					this._options.avecListeDiscussions,
				);
				if (this.etatUtilisateurSco.message && !this._options.estChat) {
					this.listeMessagerie = null;
					this.message = this.etatUtilisateurSco.message;
				}
				this.listeBoutonsReponse = null;
				if (this._options.estChat && !aParam.message) {
				} else if (
					this._options.avecListeDiscussions ||
					!this.listeMessagerie ||
					this._options.possessionMessageDiscussionUnique
				) {
					if (!this.message) {
						ObjetHtml_1.GHtml.setDisplay(this.idReponseSaisie, false);
						ObjetHtml_1.GHtml.setDisplay(
							this.idMessagerieDesactiveeHoraire,
							false,
						);
						ObjetHtml_1.GHtml.setDisplay(this.idReponse + "_vide", true);
						$("#" + this.idDiscussion.escapeJQ()).html("");
					}
					this.moteurMessagerie
						.requeteListeMessagerie({
							avecMessage: true,
							avecLu: true,
							listeRessources: this.listeRessourcesFiltreDiscussions,
							uniquementMessagesCommuns: this.messagesCommunsEntreLesRessources,
							eleveCarnetLiaison: this.eleveCarnetLiaison,
							possessionMessageDiscussionUnique:
								this._options.possessionMessageDiscussionUnique,
						})
						.then((aParams) => {
							this._reponseRequeteListeMessagerie(aParams, lListeMessages_prec);
						})
						.then(() => {
							if (this.param && this.param.conserverBrouillon) {
								this.param.conserverBrouillon = false;
							}
							if (this.param && this.param.callBackApresDonneesMessagerie) {
								this.param.callBackApresDonneesMessagerie(this.sansDiscussions);
							}
						});
				} else if (!this._options.avecListeDiscussions && this.message) {
					this.avecSelectionPremiereDiscussion = true;
					this._requeteListeMessages({ marquerLu: true });
				}
			});
	}
	async setEtiquetteSelectionnee(
		aEtiquette,
		aAvecRefreshGraphique = false,
		aAvecFocusSuivant,
	) {
		this.etiquette = aEtiquette;
		if (aAvecRefreshGraphique) {
			await this._sauvegardeBrouillonAvecConfirmationPromise();
			this._verifierEtatVisibilite();
			this._initialiserListe(this.getInstance(this.identListe));
			this.getInstance(this.identListe).actualiser();
			this._viderDiscussion();
		}
		if (aAvecFocusSuivant) {
			this.getInstance(this.identListe).focusSurPremierElement();
		}
	}
	recupererDonnees() {
		if (this.avecRecupereDonnees !== false) {
			this.setDonnees();
		}
	}
	actualiserListeCloud() {
		if (this._options.avecPJCloud) {
			ObjetHtml_1.GHtml.setHtml(
				this.idLibelleCloud,
				UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
					this.brouillon.listeFichiers,
					{
						genreFiltre: Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
						separateur: " ",
						IEModelChips: "chipsFichierCloud",
					},
				),
				{ controleur: this.controleur },
			);
		}
	}
	_ouvrirFenetreListeCategoriesDiscussion(aListeMessages) {
		this.moteurMessagerie.ouvrirFenetreListeCategoriesDiscussion(
			aListeMessages,
			this.listeEtiquettes,
			() => {
				this.setDonnees({ conserverBrouillon: true });
			},
		);
	}
	_surCreationDiscussion() {
		const lEstPrimParentSurEtiquetteCL =
			this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.PrimParent &&
			!!this.etiquette &&
			this.etiquette.getGenre() ===
				TypeOrigineCreationEtiquetteMessage_1
					.TypeOrigineCreationEtiquetteMessage.OCEM_Pre_CarnetLiaison;
		if (
			this._options.typeBoutonCreation ===
				TypeBoutonCreationMessagerie_1.TypeBoutonCreationMessagerie
					.CarnetLiaison ||
			lEstPrimParentSurEtiquetteCL
		) {
			this._evenementSurBoutonNouveauCarnetLiaison();
		} else {
			this._evenementSurBoutonNouveau();
		}
	}
	_menuContextuelBtnActionsBrouillon(aNode) {
		const lInstance = this;
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: lInstance,
			id: aNode,
			initCommandes: function (aInstanceMenu) {
				if (lInstance.avecEditeurRiche) {
					aInstanceMenu.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.miseEnForme",
						),
						true,
						() => {
							UtilitaireTiny_1.UtilitaireTiny.ouvrirFenetreHtml({
								instance: lInstance,
								descriptif: lInstance.brouillon.contenu || "",
								readonly: lInstance.applicationSco.getModeExclusif(),
								modeMail: true,
								callback: function (aParams) {
									if (aParams.valider) {
										lInstance._setValeurMessage(aParams.descriptif);
										lInstance._actualiserContenuSaisie();
									}
									if (lInstance.avecEditeurRiche) {
										const lEditor = TinyInit_1.TinyInit.get(
											lInstance.idReponse,
										);
										if (lEditor) {
											lEditor.focus();
										}
									}
								},
							});
						},
						{ icon: "icon_font" },
					);
				}
				if (lInstance._avecCommandesBrouillonsMessageCourant()) {
					let lEstActif =
						lInstance.messagePourReponse &&
						lInstance.brouillon.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun &&
						!lInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estEnConsultation,
						);
					aInstanceMenu.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.HintEnregistrerBrouillon",
						),
						!!lEstActif,
						() => {
							lInstance.moteurMessagerie.saisieBrouillon(
								lInstance.brouillon,
								lInstance.messagePourReponse,
							);
						},
						{ icon: "icon_save" },
					);
					lEstActif =
						lInstance.brouillon.existeNumero() &&
						lInstance.brouillon.getEtat() !==
							Enumere_Etat_1.EGenreEtat.Creation &&
						!lInstance.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estEnConsultation,
						);
					aInstanceMenu.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"Messagerie.HintSupprimerBrouillon",
						),
						!!lEstActif,
						() => {
							lInstance.moteurMessagerie
								.supprimerBrouillonConfirmationPromise(lInstance.brouillon)
								.then((aResult) => {
									if (aResult && aResult.saisieMessageOK === true) {
										lInstance._initBrouillon();
									}
								});
						},
						{ icon: "icon_trash" },
					);
				}
			},
		});
	}
	_requeteListeMessages(aParams) {
		const lParams = Object.assign(
			{ marquerLu: false, MAJNbMessages: false, nbMessagesVus: undefined },
			aParams,
		);
		const lNbMessagesVus =
			lParams.nbMessagesVus < 0
				? undefined
				: lParams.nbMessagesVus ||
					UtilitaireMessagerie_1.UtilitaireMessagerie.palierNbMessages;
		return this.moteurMessagerie
			.requeteMessagesVisu({
				message: this.message,
				marquerCommeLu: lParams.marquerLu,
				nbMessagesVus: lNbMessagesVus,
			})
			.then((aDonnees) => {
				this._reponseListeMessages(lParams, aDonnees);
			});
	}
	_composerZoneSaisie() {
		const lPlaceholderTextArea =
			this.etatUtilisateurSco.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.PrimEleve
				? ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.PlaceholderMessageReponseEnseignant",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.PlaceholderMessage",
					);
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ id: this.idReponseSaisie, class: "ilm_zone_saisie" },
				() => {
					return [
						IE.jsx.str(
							"div",
							{ id: this.idBrouillonNonEnvoye, style: "display:none;" },
							IE.jsx.str("div", { id: this.idBrouillonNonEnvoye + "_td" }),
						),
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str("textarea", {
								id: this.idReponse,
								class: [
									"",
									this.avecEditeurRiche
										? IEHtml_1.default.Styles.debugWAIInputIgnoreAssert
										: "",
								],
								maxlength: this.avecEditeurRiche ? 0 : 10000,
								"ie-node": this.avecEditeurRiche ? false : "getNodeTextarea",
								placeholder: lPlaceholderTextArea,
								"aria-label": lPlaceholderTextArea,
								"ie-autoresize": !this.avecEditeurRiche,
							}),
						),
						IE.jsx.str(
							"div",
							{ class: "ilm_selec_pjs", "ie-display": "afficherPJs" },
							this.moteurMessagerie.autoriserAjoutPJ()
								? IE.jsx.str("div", {
										id: this.getNomInstance(this.identSelecteurPJ),
									})
								: "",
							IE.jsx.str("ie-btnicon", {
								"ie-model": "btnSignature",
								"ie-display": "getDisplaySignature",
								class: "icon_signature bt-activable bt-large",
								title: ObjetTraduction_1.GTraductions.getValeur(
									"Messagerie.HintAjouterSignature",
								),
							}),
							IE.jsx.str(
								"div",
								{ class: "ilm_liste_pjs" },
								this.moteurMessagerie.autoriserAjoutPJ()
									? IE.jsx.str("div", { id: this.idLibellePJ })
									: "",
								this._options.avecPJCloud
									? IE.jsx.str("div", { id: this.idLibelleCloud })
									: "",
							),
						),
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
						)
							? IE.jsx.str(
									"div",
									{
										id: this.idVisuTransfert,
										style: "display:none;",
										class: "ilm_brouillon_transfert",
									},
									IE.jsx.str("div", { id: this.idVisuTransfert + "_td" }),
								)
							: "",
						(0, tag_1.tag)(
							"div",
							{ class: "ilm_saisie_pied" },
							this._options.genreDiscussion ===
								TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte &&
								this._options.estChat
								? (0, tag_1.tag)(
										"div",
										{
											class: "m-right-l",
											"ie-if": "afficherChoixCreationAlerte",
											"ie-display": "afficherComboEtab",
										},
										(0, tag_1.tag)("ie-combo", {
											"ie-model": "comboEtablissement",
										}),
									)
								: "",
							(0, tag_1.tag)(
								"div",
								{ class: "ilm_pied_dest" },
								(0, tag_1.tag)("div", {
									"ie-html": "getHtmlZoneDestinataires",
								}),
								this._options.getHtmlDestinataires
									? this._options.getHtmlDestinataires(this)
									: "",
							),
							(0, tag_1.tag)(
								"div",
								{ class: "ilm_pied_droite" },
								this.avecEditeurRiche ||
									this._avecCommandesBrouillonsMessageCourant()
									? (0, tag_1.tag)("ie-btnicon", {
											class: "icon_ellipsis_vertical",
											"ie-model": "btnActionsBrouillon",
											title:
												ObjetTraduction_1.GTraductions.getValeur(
													"liste.BtnAction",
												),
										})
									: "",
								IE.jsx.str("div", {
									"ie-html": "getHtmlBoutonsEnvoi",
									class: "ilm_pied_btns",
								}),
							),
						),
					].join("");
				},
			),
			IE.jsx.str("div", {
				id: this.idMessagerieDesactiveeHoraire,
				class: "p-all",
				"ie-html": "getHtmlMessagerieDesactivee",
			}),
		);
	}
	_composeZoneReponse() {
		const H = [];
		H.push('<div class="ilm_zoneReponse">');
		if (
			(this._options.avecListeDiscussions &&
				!this._options.estChat &&
				!this._options.enFenetre) ||
			this._options.forcerBandeau
		) {
			H.push(
				IE.jsx.str("div", {
					class: "messagerie-titre-bandeau-message",
					"ie-html": "getHtmlBandeauDroite",
					"ie-if": "avecMessageSelectionne",
					tabindex: "-1",
				}),
			);
		}
		if (this._options.estChat) {
			H.push(
				IE.jsx.str(
					"div",
					{
						"ie-if": "afficherMessageAlerteExercice",
						style: ObjetStyle_1.GStyle.composeCouleurTexte("red"),
						class: "PetitEspaceBas",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.AlerteEstUnExercice",
					),
				),
			);
		}
		if (
			this._options.genreDiscussion ===
				TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte &&
			this._options.estChat
		) {
			H.push(
				(0, tag_1.tag)(
					"div",
					{ "ie-if": "afficherChoixCreationAlerte", class: "PetitEspaceBas" },
					(0, tag_1.tag)(
						"div",
						{ class: "PetitEspaceBas" },
						ObjetTraduction_1.GTraductions.getValeur("Messagerie.InfosAlerte"),
					),
					(0, tag_1.tag)(
						"div",
						{ class: "PetitEspaceBas" },
						(0, tag_1.tag)("ie-combo", { "ie-model": "comboAlerte" }),
					),
					(0, tag_1.tag)(
						"div",
						(0, tag_1.tag)(
							"ie-checkbox",
							{ "ie-model": "cbExerciceAlerte" },
							ObjetTraduction_1.GTraductions.getValeur(
								"Messagerie.IndiquerExercice",
							),
						),
					),
				),
			);
		}
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.idReponse + "_vide",
					style: "display : none;",
					class: "message-vide",
				},
				IE.jsx.str(
					"div",
					{ class: "message" },
					ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.AucuneDiscussionSelectionnee",
					),
				),
				IE.jsx.str("div", { class: ["Image_No_Data"], "aria-hidden": "true" }),
			),
		);
		H.push(
			(0, tag_1.tag)(
				"div",
				{
					class:
						"utilMess_conteneur_visu_messages" +
						(this._options.maxHeightDiscussion > 0 ? " avecMaxHeight" : ""),
					"ie-if": "avecMessageSelectionne",
				},
				(0, tag_1.tag)("div", {
					id: this.idDiscussion,
					style:
						this._options.maxHeightDiscussion > 0
							? "max-height:" + this._options.maxHeightDiscussion + "px;"
							: "",
				}),
			),
		);
		H.push(
			IE.jsx.str("div", {
				"ie-html": "getHtmlMessageInfo",
				class: "ilm_messageInfo",
			}),
		);
		if (
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
			)
		) {
			H.push(
				'<div ie-display="getDisplayZoneReponse" style="margin-bottom : 3px;">',
			);
			H.push(this._composerZoneSaisie());
			H.push("</div>");
		}
		H.push("</div>");
		return H.join("");
	}
	_initTiny() {
		ObjetHtml_1.GHtml.setValue(this.idReponse, "");
		if (!this.avecEditeurRiche) {
			return;
		}
		this._actualiserContenuSaisie();
		this._initOptionsTiny();
		this.$refreshSelf();
	}
	_initOptionsTiny() {
		if (!this.avecEditeurRiche) {
			return;
		}
		const lInstance = this;
		TinyInit_1.TinyInit.init({
			id: this.idReponse,
			autoresize_bottom_margin: 0,
			autoresize_on_init: true,
			min_height: 22,
			max_height: this._options.hauteurTiny || 75,
			height: "",
			plugins: ["autoresize"],
			ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
				"Messagerie.labelWAIMessage",
			),
			toolbar: false,
			setup: function (editor) {
				editor.on("keyup", function (aEvent) {
					if (
						aEvent.keyCode ===
						ToucheClavier_1.ToucheClavierUtil.ToucheRetourNavigation
					) {
						$(`#${lInstance.idReponse.escapeJQ()}`).trigger(
							Object.assign($.Event("keyup"), {
								which: ToucheClavier_1.ToucheClavierUtil.ToucheRetourNavigation,
							}),
						);
						return;
					}
					lInstance._setValeurMessage(this.getContent());
				});
				editor.on("Change", function (aEvent) {
					if (!this._enCoursDestruction) {
						lInstance._setValeurMessage(this.getContent());
					}
				});
			},
		});
	}
	_avecFiltreNonLues() {
		return !this._options.enFenetre && !!this._options.avecListeDiscussions;
	}
	_initialiserListe(aInstance) {
		const lInstance = this;
		const lListeBoutons = [];
		if (!this._options.enFenetre) {
			if (this._avecFiltreNonLues()) {
				const lJSXModelCBNonLu = () => {
					return {
						getValue() {
							return lInstance.applicationSco.parametresUtilisateur.get(
								"Communication.DiscussionNonLues",
							);
						},
						setValue(aValue) {
							lInstance._evenementSurCBLue(aValue);
						},
					};
				};
				lListeBoutons.push({
					getHtml: () =>
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": lJSXModelCBNonLu, "ie-textleft": true },
							ObjetTraduction_1.GTraductions.getValeur("Messagerie.NonLues"),
						),
				});
			}
			if (this.moteurMessagerie.avecIconeAvertissementListeMessagerie()) {
				lListeBoutons.push({
					class: "icon_warning_sign",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.TitreFenetreAvertissement",
					),
					event: () => {
						this.moteurMessagerie.ouvrirFenetreAvertissement(false);
					},
				});
			}
			if (
				this.etiquette &&
				this.etiquette.getGenre() ===
					TypeOrigineCreationEtiquetteMessage_1
						.TypeOrigineCreationEtiquetteMessage.OCEM_Pre_Poubelle &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
				)
			) {
				lListeBoutons.push({
					class: "icon_trash",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.Menu_ViderCorbeille",
					),
					event: () => {
						const lNb =
							this.moteurMessagerie.getNbMessagesSupprimablesPoubelle();
						this.moteurMessagerie.saisieViderCorbeille(lNb);
					},
					getDisabled: () => {
						return (
							this.moteurMessagerie.getNbMessagesSupprimablesPoubelle() === 0
						);
					},
				});
			}
			lListeBoutons.push({
				genre: ObjetListe_1.ObjetListe.typeBouton.rechercher,
			});
		}
		this.moteurMessagerie.ouvrirFenetreAvertissement(true);
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			avecLigneCreation:
				this._options.avecBoutonCreation &&
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
				) &&
				this.avecDiscussionProf,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"Messagerie.Action_Nouveau",
			),
			iconeTitreCreation: "icon_nouvelle_discussion",
			boutons: lListeBoutons,
			nonEditableSurModeExclusif: true,
			messageContenuVide: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
			)
				? ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.AucuneDiscussion",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.DiscussionsDesactivees",
					),
			ariaLabel: () => {
				let lLabel = ObjetTraduction_1.GTraductions.getValeur(
					"Messagerie.Titre.MesDiscussions",
				);
				if (this.existeInstance(this.identListeEtiquette) && this.etiquette) {
					lLabel += " - " + this.etiquette.getLibelle();
				}
				return lLabel;
			},
		});
	}
	_initSelecteurPJ(aInstance) {
		aInstance.setOptions({
			genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
			genreRessourcePJ:
				Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			avecMenuContextuel: false,
			title: ObjetTraduction_1.GTraductions.getValeur("Messagerie.HintPJ"),
			maxFiles: 0,
			maxSize: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
			ouvrirFenetreChoixTypesAjout: true,
			optionsCloud: {
				avecCloud: this._options.avecPJCloud,
				callbackChoixFichierParFichier: this.surAjoutUnFichierCloud.bind(this),
				callbackChoixFichierFinal: this.surAjoutFinalFichiersClouds.bind(this),
			},
			idLibellePJ: this.idLibellePJ,
			avecAjoutExistante: true,
			avecEtatSaisie: false,
			avecBoutonSupp: true,
		});
	}
	surAjoutUnFichierCloud(aNouvelElement) {
		this.brouillon.listeFichiers.addElement(aNouvelElement);
		this.listePJ.addElement(aNouvelElement);
	}
	surAjoutFinalFichiersClouds() {
		this.actualiserListeCloud();
		this.brouillon.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	_actualiserListeEtiquettes() {
		const lListe = this.getInstance(this.identListeEtiquette);
		if (lListe) {
			lListe
				.setOptionsListe({
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.MesDossiersDiscussions",
					),
				})
				.setDonnees(
					new DonneesListe_SelectEtiquettes_1.DonneesListe_SelectEtiquettes(
						this.listeEtiquettes,
						{
							listeMessages: this.listeMessagerie,
							moteurMessagerie: this.moteurMessagerie,
						},
					),
				);
			if (this.etiquette) {
				lListe.setListeElementsSelection(
					new ObjetListeElements_1.ObjetListeElements().addElement(
						this.etiquette,
					),
				);
			}
		}
	}
	_initSelectionEtiquette(aMessageSelectionne) {
		this.etiquette =
			UtilitaireMessagerie_1.UtilitaireMessagerie.getEtiquetteInitSelonMessage(
				this.listeEtiquettes,
				this.etiquette,
				!!this.getInstance(this.identListeEtiquette),
				aMessageSelectionne,
			);
	}
	_reponseRequeteListeMessagerie(aParam, aListeMessages_prec) {
		this.listeEtiquettes = aParam.listeEtiquettes;
		this.listeDestinatairesCarnetLiaison = aParam.destinatairesCarnetLiaison;
		this.listeMessagerie = aParam.listeMessagerie;
		this.listePJ =
			this.moteurMessagerie.autoriserAjoutPJ() &&
			this.etatUtilisateurSco.listeDonnees &&
			this.etatUtilisateurSco.listeDonnees[
				TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
					.THND_ListeDocJointEtablissement
			]
				? MethodesObjet_1.MethodesObjet.dupliquer(
						this.etatUtilisateurSco.listeDonnees[
							TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
								.THND_ListeDocJointEtablissement
						],
					)
				: new ObjetListeElements_1.ObjetListeElements();
		this.sansDiscussions = this.listeMessagerie.count() === 0;
		if (aListeMessages_prec && aListeMessages_prec.parcourir) {
			aListeMessages_prec.parcourir((aMessage) => {
				if (!aMessage.estUneDiscussion || !aMessage.estDeploye) {
					return;
				}
				const lIndiceSelection =
					UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
						this.listeMessagerie,
						aMessage,
					);
				if (lIndiceSelection !== null && lIndiceSelection >= 0) {
					this.listeMessagerie.get(lIndiceSelection).estDeploye = true;
				}
			});
		}
		let lIndiceSelection =
			UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
				this.listeMessagerie,
				this.message,
			);
		let lSelection = this.listeMessagerie.get(lIndiceSelection);
		if (lSelection) {
			if (lSelection.estUneDiscussion) {
				lSelection.estDeploye = !!this.message.estDeploye;
			}
			lSelection = this.listeMessagerie.get(lSelection.indicePere);
			while (lSelection && lSelection.estUneDiscussion) {
				lSelection.estDeploye = true;
				lSelection = this.listeMessagerie.get(lSelection.indicePere);
			}
		}
		let lViderDiscussion = false;
		if (this.__selectionneeDiscussionRecente) {
			if (lIndiceSelection !== 0) {
				lIndiceSelection = 0;
				lViderDiscussion = true;
			}
			delete this.__selectionneeDiscussionRecente;
		}
		if (
			this.avecSelectionPremiereDiscussion &&
			this.listeMessagerie.count() > 0 &&
			(!this.message ||
				UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
					this.listeMessagerie,
					this.message,
				) === null ||
				UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
					this.listeMessagerie,
					this.message,
				) === undefined)
		) {
			if (lIndiceSelection !== 0) {
				lIndiceSelection = 0;
				lViderDiscussion = true;
			}
		}
		if (this._options.avecListeDiscussions) {
			this._verifierEtatVisibilite();
		}
		lSelection = this.listeMessagerie.get(lIndiceSelection);
		if (!lSelection || lSelection.visible === false) {
			this._viderDiscussion();
			lIndiceSelection = undefined;
		} else if (lViderDiscussion) {
			this._viderDiscussion();
		}
		if (this._options.avecListeDiscussions) {
			this._initSelectionEtiquette(this.listeMessagerie.get(lIndiceSelection));
		}
		this._actualiserListeEtiquettes();
		const lInstanceListeMessagerie = this.getInstance(this.identListe);
		this._initialiserListe(lInstanceListeMessagerie);
		lInstanceListeMessagerie.setDonnees(
			new DonneesListe_Messagerie_1.DonneesListe_Messagerie(
				this.listeMessagerie,
			).setOptions({
				avecDeploiement: this._options.avecSousDiscussions,
				avecImagePurge:
					this._options.avecListeDiscussions && !this._options.enFenetre,
				getEtiquette: () => {
					return this.etiquette;
				},
				avecToutesIconesGauche: !!this.getInstance(this.identListeEtiquette),
				addCommandesMenuContextuel: (aParametres) => {
					this._addCommandesMenuContextuelDiscussion({
						message: aParametres.article,
						menuContextuel: aParametres.menuContextuel,
					});
				},
			}),
			lIndiceSelection,
			{ avecSelectionSurLigneInvisible: true, conserverPositionScroll: true },
		);
		const lPage = IE.estMobile
			? this.etatUtilisateurSco.getPage()
			: this.etatUtilisateurSco.Navigation.OptionsOnglet;
		if (lPage && lPage.avecActionSaisie) {
			this._evenementSurBoutonNouveau();
		}
	}
	_addCommandesMenuContextuelDiscussion(aParametres) {
		return this.moteurMessagerie.addCommandesMenuContextuelDiscussion(
			Object.assign(
				{
					callback: (aParams) => {
						this._execCommand(aParams);
					},
				},
				aParametres,
			),
		);
	}
	_setValeurMessage(aHtml) {
		let lDescriptif = aHtml;
		if (this.avecEditeurRiche && TinyInit_1.TinyInit) {
			lDescriptif = TinyInit_1.TinyInit.estContenuVide(lDescriptif)
				? ""
				: lDescriptif;
		}
		const lOldContenu = this.brouillon.contenu || "";
		this.brouillon.contenu = lDescriptif;
		if (
			this.brouillon.contenu === "" &&
			this.brouillon.listeFichiers.count() === 0 &&
			this.brouillon.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			this._initBrouillon("", true);
		} else {
			if (lOldContenu !== lDescriptif) {
				this.brouillon.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		}
		this.$refreshSelf();
	}
	_viderDiscussion() {
		this.message = null;
		this.messagePourReponse = null;
		this._messageVisuSelectionne = null;
		this.etatUtilisateurSco.message = null;
		this._initBrouillon();
		ObjetHtml_1.GHtml.setDisplay(this.idReponse + "_vide", true);
		ObjetHtml_1.GHtml.setDisplay(this.idReponseSaisie, false);
		ObjetHtml_1.GHtml.setDisplay(this.idMessagerieDesactiveeHoraire, false);
		$("#" + this.idDiscussion.escapeJQ()).html("");
		this.$refreshSelf();
	}
	_ouvrirFenetreTransfert(aMessage, aListeMessagesTransfert) {
		let lListeMessagesTransfert = aListeMessagesTransfert;
		Promise.resolve()
			.then(() => {
				if (!lListeMessagesTransfert) {
					return this.moteurMessagerie
						.requeteMessagesVisu({
							message: aMessage,
							marquerCommeLu: false,
							nbMessagesVus: undefined,
						})
						.then((aParams) => {
							lListeMessagesTransfert = aParams.listeMessages;
						});
				}
			})
			.then(() => {
				const lMessage = this._getMessageTransfert(lListeMessagesTransfert);
				const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_Message_1.ObjetFenetre_Message,
					{ pere: this },
					{
						avecChoixDestinataires: true,
						transfertMessage: true,
						avecSauvegardeBrouillon:
							this.moteurMessagerie.avecSauvegardeBrouillonAutorise(),
						titre:
							lMessage.nbTransfert > 1
								? ObjetTraduction_1.GTraductions.getValeur(
										"Messagerie.TransfererLesMessages",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"Messagerie.TransfererLeMessage",
									),
					},
				);
				const lListeMessages = new ObjetListeElements_1.ObjetListeElements();
				lListeMessages.addElement(lMessage);
				let lObjetTransfert = "";
				let lMessageTrouve = aMessage;
				while (!lObjetTransfert && lMessageTrouve) {
					lObjetTransfert = lMessageTrouve.objet;
					lMessageTrouve = lMessageTrouve.pere;
				}
				lFenetre.setDonnees(
					$.extend(
						{
							transfert: {
								objet:
									ObjetTraduction_1.GTraductions.getValeur(
										"Messagerie.AbreviationTransfert",
									) +
									" :" +
									(lObjetTransfert || ""),
								listeMessages: lListeMessages,
							},
							avecIndicationDiscussionInterdit: true,
							message: {
								commande: "transfert",
								listeMessagesTransfert: lMessage.listeMessagesPourSaisie,
							},
						},
						this._donneesFenetreEditionDiscussion(),
					),
				);
			});
	}
	_execCommand(aParams) {
		switch (aParams.genre) {
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.archiver:
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.desarchiver:
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.supprimer:
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.restaurer:
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.corbeille:
				return this._viderDiscussion();
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.modifierCategories:
				return this.setDonnees({ conserverBrouillon: true });
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.discussionEnFenetre:
				return this._discussionEnFenetre(aParams.message);
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.transferer:
				return this._ouvrirFenetreTransfert(
					aParams.message,
					aParams.listeMessages,
				);
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.repondreMessage:
				this.message = aParams.message;
				this._repondreVisuMessage(aParams.indiceListeMessagerie);
				return;
			case TypeCommandeMessagerie_1.TypeCommandeMessagerie.afficherDiscussion:
				this.message = aParams.message;
				this._afficherDiscussion(aParams.message);
				return;
		}
	}
	_discussionEnFenetre(aArticle) {
		if (!aArticle.messageFenetre || !this._options.utilitaireContactVS) {
			return;
		}
		const lGenreMessage = aArticle.messageFenetre.getGenre();
		const lEstConversation =
			lGenreMessage ===
			TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Conversation;
		const lEstChat =
			lEstConversation ||
			lGenreMessage === TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte ||
			lGenreMessage === TypeGenreDiscussion_1.TypeGenreDiscussion.GD_ContactVS;
		Promise.resolve()
			.then(() => {
				return this._sauvegardeBrouillonAvecConfirmationPromise();
			})
			.then(() => {
				if (lEstConversation && aArticle.messageFenetre.estSortiConversation) {
					return this._requeteSaisieMessage({
						commande: "entrerSortirConversation",
						entrer: true,
						possessionMessage: aArticle.dernierPossessionMessage,
					});
				}
			})
			.then(() => {
				const lUtilVS = this._options.utilitaireContactVS;
				lUtilVS.afficherFenetreMessage({
					message: aArticle,
					possessionMessageDiscussionUnique: lEstChat
						? null
						: aArticle.dernierPossessionMessage,
					estConversation: lEstConversation,
					optionsFenetre: {
						listeBoutons: lEstConversation
							? []
							: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					},
					optionsDiscusssion: { estChat: lEstChat },
				});
				this.getInstance(this.identListe).selectionnerLigne({
					deselectionnerTout: true,
				});
				this._viderDiscussion();
			});
	}
	_getMessageTransfert(aListeMessages) {
		const lListe = new ObjetListeElements_1.ObjetListeElements(),
			lMessage = new ObjetElement_1.ObjetElement("", 0);
		lListe.addElement(lMessage);
		lMessage.contenu = "";
		lMessage.listeMessagesPourContexte =
			new ObjetListeElements_1.ObjetListeElements();
		lMessage.listeMessagesPourSaisie =
			new ObjetListeElements_1.ObjetListeElements();
		lMessage.estMessageTransferant = true;
		lMessage.nbTransfert = 0;
		if (aListeMessages) {
			aListeMessages.parcourir((aMessage) => {
				if (aMessage.brouillon) {
					return;
				}
				if (
					lMessage.listeMessagesPourContexte.getElementParNumero(
						aMessage.getNumero(),
					)
				) {
					return;
				}
				lMessage.listeMessagesPourContexte.addElement(
					MethodesObjet_1.MethodesObjet.dupliquer(aMessage),
				);
				lMessage.listeMessagesPourSaisie.addElement(
					new ObjetElement_1.ObjetElement("", aMessage.getNumero()),
				);
				lMessage.nbTransfert += 1;
				if (aMessage.listeMessagesPourContexte) {
					aMessage.listeMessagesPourContexte.parcourir(
						(aMessagePourContexte) => {
							lMessage.listeMessagesPourContexte.addElement(
								MethodesObjet_1.MethodesObjet.dupliquer(aMessagePourContexte),
							);
						},
					);
				}
			});
		}
		return lMessage;
	}
	_evenementSurCBLue(aValue) {
		this.applicationSco.parametresUtilisateur.set(
			"Communication.DiscussionNonLues",
			!!aValue,
		);
		this._sauvegardeBrouillonAvecConfirmationPromise().then(() => {
			this._verifierEtatVisibilite();
			const lSelection = true;
			this.getInstance(this.identListe).actualiser(lSelection, false);
		});
	}
	_verifierEtatVisibilite() {
		this._initSelectionEtiquette();
		this.moteurMessagerie.modifierVisibiliteListeMessagerie(this.message);
	}
	_requeteSaisieMessage(aCommandeSaisie, aAvecSauvegardeBrouillon) {
		return this.moteurMessagerie.requeteSaisieMessage(
			aCommandeSaisie,
			aAvecSauvegardeBrouillon,
		);
	}
	_tousLesFilsSontLus(aIndiceMessagePere) {
		let lMessage;
		const lNb = this.listeMessagerie.count();
		for (let I = 0; I < lNb; I++) {
			lMessage = this.listeMessagerie.get(I);
			if (aIndiceMessagePere === lMessage.indicePere) {
				if (!lMessage.lu) {
					if (lMessage.estUneDiscussion) {
						if (this._tousLesFilsSontLus(lMessage.indice)) {
							lMessage.lu = true;
						} else {
							return false;
						}
					} else {
						return false;
					}
				}
			}
		}
		return true;
	}
	_mettreAJourLuPereSelonFils() {
		for (let I = 0; I < this.listeMessagerie.count(); I++) {
			const lMessage = this.listeMessagerie.get(I);
			if (
				lMessage.estUneDiscussion &&
				!lMessage.lu &&
				this._tousLesFilsSontLus(lMessage.indice)
			) {
				lMessage.lu = true;
			}
		}
	}
	_passerMessageEnLu(aMessage) {
		let lMessage;
		const lListeMessagesLus = new ObjetListeElements_1.ObjetListeElements();
		if (!aMessage.lu) {
			if (aMessage.estUneDiscussion) {
				for (let I = 0; I < this.listeMessagerie.count(); I++) {
					lMessage = this.listeMessagerie.get(I);
					if (!aMessage.lu && aMessage.indice === lMessage.indicePere) {
						lListeMessagesLus.add(this._passerMessageEnLu(lMessage));
					}
				}
			} else {
				lListeMessagesLus.addElement(aMessage);
			}
		}
		aMessage.lu = true;
		return lListeMessagesLus;
	}
	_donneesFenetreEditionDiscussion() {
		return {
			genresRessources:
				ObjetFenetre_Message_1.ObjetFenetre_Message.getRessourcesDefaut(),
			avecIndicationDiscussionInterdit: true,
			avecListeDiffusion: this._options.avecListeDiffusion,
		};
	}
	_evenementSurBoutonNouveau() {
		let lDonneesFenetreNouveauDiscussion =
			this._donneesFenetreEditionDiscussion();
		ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
			this,
			lDonneesFenetreNouveauDiscussion,
			{
				avecSauvegardeBrouillon:
					this.moteurMessagerie.avecSauvegardeBrouillonAutorise(),
				avecChoixDestinataires: true,
			},
		);
		this.etatUtilisateurSco.resetPage();
		this.etatUtilisateurSco.Navigation.OptionsOnglet = null;
	}
	_evenementSurBoutonNouveauCarnetLiaison() {
		const lGenreDestinataire =
			this.etatUtilisateurSco.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.PrimParent
				? Enumere_Ressource_1.EGenreRessource.Enseignant
				: Enumere_Ressource_1.EGenreRessource.Responsable;
		let lEleveConcerne = null;
		let lListeDestinataires = null;
		if (
			[
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			lEleveConcerne = this.eleveCarnetLiaison;
		}
		if (
			this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.PrimParent &&
			this.etiquette &&
			this.etiquette.contexte &&
			this.etiquette.contexte.getNumero()
		) {
			lEleveConcerne = this.etiquette.contexte;
			if (this.etatUtilisateurSco.Identification.ListeRessources) {
				lEleveConcerne =
					this.etatUtilisateurSco.Identification.ListeRessources.getElementParNumero(
						this.etiquette.contexte.getNumero(),
					) || this.etiquette.contexte;
			}
			lListeDestinataires =
				UtilitaireMessagerie_1.UtilitaireMessagerie.getListeDestCarnetLiaisonDElevePrimParent(
					lEleveConcerne.getNumero(),
				);
		}
		if (!lListeDestinataires) {
			lListeDestinataires = this.listeDestinatairesCarnetLiaison;
		}
		UtilitaireCarnetLiaison_1.UtilitaireCarnetLiaison.creerDiscussion(
			lListeDestinataires,
			lGenreDestinataire,
			lEleveConcerne,
			null,
			true,
		);
	}
	_evenementSurListeEtiquette(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
				if (aParametres.article.categories) {
					this._ouvrirFenetreListeCategoriesDiscussion();
				} else {
					this.setEtiquetteSelectionnee(
						aParametres.article,
						true,
						aParametres.surClavier,
					);
				}
				break;
		}
	}
	_evenementSurListe(aParametres, aGenreEvenementListe, aColonne, aLigne) {
		switch (aGenreEvenementListe) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._surCreationDiscussion();
				return;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lMessage = this.listeMessagerie.get(aLigne);
				UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
				this.message = lMessage;
				if (!this._conserverMessageVisuSelectionne) {
					this._messageVisuSelectionne = null;
				}
				let lMarquerLu =
					aParametres.surInteractionUtilisateur ||
					!this._options.avecListeDiscussions;
				if (
					!lMarquerLu &&
					this.etatUtilisateurSco.message &&
					this.etatUtilisateurSco.message.__marquerLu__ &&
					UtilitaireMessagerie_1.UtilitaireMessagerie.avecPossessionPartageeEntreMessages(
						this.message,
						this.etatUtilisateurSco.message,
					)
				) {
					lMarquerLu = true;
					delete this.etatUtilisateurSco.message.__marquerLu__;
				}
				if (aParametres.surInteractionUtilisateur) {
					this.avecInclureParentsEleves = false;
				}
				Promise.resolve()
					.then(() => {
						this.message = lMessage;
						if (!this.param || !this.param.conserverBrouillon) {
							return this._sauvegardeBrouillonAvecConfirmationPromise().then(
								() => {
									this._initBrouillon();
									this._actualiserContenuSaisie();
									this._actualiserSelecteurPJ();
									this.actualiserListeCloud();
								},
							);
						}
					})
					.then(() => {
						ObjetHtml_1.GHtml.setDisplay(this.idReponse + "_vide", false);
						let lListeMessagesLus =
							new ObjetListeElements_1.ObjetListeElements();
						if (
							lMarquerLu &&
							!this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estEnConsultation,
							) &&
							this.message.estUneDiscussion
						) {
							if (
								!UtilitaireMessagerie_1.UtilitaireMessagerie.estEgal(
									this.etatUtilisateurSco.message,
									this.message,
								)
							) {
								lListeMessagesLus = this._passerMessageEnLu(this.message);
								if (lListeMessagesLus.count() > 0) {
									this._mettreAJourLuPereSelonFils();
								}
								if (this._options.avecListeDiscussions) {
									this.getInstance(this.identListe).actualiser(true, false);
								}
							}
						}
						this.etatUtilisateurSco.message = this.message;
						this._requeteListeMessages({ marquerLu: lMarquerLu }).then(() => {
							if (aParametres.surClavier) {
								this._focusListeMessages();
							}
						});
					});
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe
				.ModificationSelection: {
				const lSelection = aParametres.instance.getElementSelection();
				if (!lSelection) {
					this._viderDiscussion();
				}
				break;
			}
			default:
				break;
		}
	}
	_focusListeMessages() {
		if (ObjetHtml_1.GHtml.elementExiste(this.idReponse)) {
			if (this.avecEditeurRiche) {
				TinyInit_1.TinyInit.onLoadEnd(this.idReponse).then((aParams) => {
					if (aParams.tiny) {
						aParams.tiny.focus();
					}
				});
			} else {
				ObjetHtml_1.GHtml.setFocus(this.idReponse);
			}
		} else {
			$(`#${this.Nom.escapeJQ()} .messagerie-titre-bandeau-message`).focus();
		}
	}
	_avecBrouillonASauvegarder() {
		return (
			this.moteurMessagerie.avecSauvegardeBrouillonAutorise() &&
			this.brouillon &&
			this.brouillon.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun &&
			this.messagePourReponse &&
			!(this.param && this.param.conserverBrouillon) &&
			this._avecCommandesBrouillonsMessageCourant()
		);
	}
	_avecCommandesBrouillonsMessageCourant() {
		return (
			this._options.activerBoutonsBrouillon &&
			!this._options.estChat &&
			!this._estMessageCourantChat()
		);
	}
	_estMessageCourantChat() {
		return UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageVisuChat(
			this.messagePourReponse,
		);
	}
	_sauvegardeBrouillonAvecConfirmationPromise() {
		const lAvecSauvegarde = this._avecBrouillonASauvegarder();
		if (lAvecSauvegarde) {
			return Promise.resolve()
				.then(() => {
					if (!this.brouillonExistant) {
						return this.applicationSco
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"Messagerie.ConfirmationEnregistrerBrouillon",
								),
							})
							.then((aAccepte) => {
								if (aAccepte !== Enumere_Action_1.EGenreAction.Valider) {
									this.listePJ.removeFilter((aElement) => {
										return (
											aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
										);
									});
									return Promise.reject();
								}
							});
					}
				})
				.then(
					() => {
						if (lAvecSauvegarde) {
							const lMessageCourant_bak = this.message;
							const lBrouillon = MethodesObjet_1.MethodesObjet.dupliquer(
									this.brouillon,
								),
								lMessagePourReponse = MethodesObjet_1.MethodesObjet.dupliquer(
									this.messagePourReponse,
								);
							this._brouillonEnCoursSauvegarde = true;
							return Promise.resolve()
								.then(() => {
									if (!this.brouillonExistant) {
										delete this._brouillonEnCoursSauvegarde;
									}
									return this.moteurMessagerie.saisieBrouillon(
										lBrouillon,
										lMessagePourReponse,
									);
								})
								.catch((aError) => {})
								.then(() => {
									this.message = lMessageCourant_bak;
								});
						}
					},
					() => {},
				)
				.finally(() => {
					delete this._brouillonEnCoursSauvegarde;
					this._actualiserSelecteurPJ();
					this.actualiserListeCloud();
				});
		}
		return Promise.resolve();
	}
	_actualiserContenuSaisie() {
		const lMessageSaisi = !!this.brouillon ? this.brouillon.contenu || "" : "";
		if (this.avecEditeurRiche) {
			TinyInit_1.TinyInit.onLoadEnd(this.idReponse).then((aParams) => {
				if (aParams.tiny) {
					aParams.tiny.setContent(lMessageSaisi);
				}
			});
		} else {
			ObjetHtml_1.GHtml.setValue(this.idReponse, lMessageSaisi);
		}
	}
	_evenementSurBoutonRepondre(aGenre) {
		const lGenre = UtilitaireMessagerie_1.UtilitaireMessagerie.getGenreReponse(
			aGenre,
			this.avecInclureParentsEleves,
		);
		let lControleContenuNonVide =
			lGenre !==
			TypeHttpReponseMessage_1.TypeHttpReponseMessage.rm_ClotureAlerte;
		const lMessageEnEnvoi = {
			messagePourReponse: this.messagePourReponse,
			brouillon: this.brouillon,
			bouton: new ObjetElement_1.ObjetElement("", 0, lGenre),
			contenu: this.brouillon.contenu,
			listeFichiers: this.brouillon.listeFichiers,
			estChat: this._options.estChat,
			genreDiscussion: this._options.genreDiscussion,
		};
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
			)
		) {
			if (this._options.estChat && !this.message) {
				this._creationChatAvecSaisieMessage = true;
				lMessageEnEnvoi.objet = this.param.objet;
				lMessageEnEnvoi.listeDestinataires = this.param
					.getListeDestinatairesChat
					? this.param.getListeDestinatairesChat()
					: null;
				if (
					!lMessageEnEnvoi.listeDestinataires ||
					lMessageEnEnvoi.listeDestinataires.count() === 0
				) {
					this.applicationSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"Messagerie.MsgAucunDestinataire",
							),
						});
					return;
				}
				if (
					this._options.genreDiscussion ===
					TypeGenreDiscussion_1.TypeGenreDiscussion.GD_Alerte
				) {
					if (!this.param.creationAlerte) {
						return;
					}
					lMessageEnEnvoi.modeleAlerte = this.param.creationAlerte.modeleAlerte;
					lMessageEnEnvoi.estExercice = this.param.creationAlerte.estExercice;
				}
			} else if (this.brouillon && !this.messagePourReponse.existeNumero()) {
				lControleContenuNonVide = false;
				lMessageEnEnvoi.objet = this.brouillon.objet;
				lMessageEnEnvoi.listeDestinataires = this.brouillon.listeDestinataires;
				if (
					!lMessageEnEnvoi.listeDestinataires ||
					lMessageEnEnvoi.listeDestinataires.count() === 0
				) {
					this.applicationSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"Messagerie.MsgAucunDestinataire",
							),
						});
					return;
				}
			} else if (
				this.messagePourReponse &&
				this.messagePourReponse.listeDestinataires
			) {
				lMessageEnEnvoi.listeDestinataires =
					this.messagePourReponse.listeDestinataires;
			} else if (
				this.messagePourReponse &&
				this.messagePourReponse.estCarnetLiaison
			) {
				if (
					!UtilitaireMessagerie_1.UtilitaireMessagerie.unMessageContientLeDirecteur(
						this.listeMessages,
					) &&
					this.avecDirecteurAjouteALaDiscussion
				) {
					if (!lMessageEnEnvoi.listeDestinataires) {
						lMessageEnEnvoi.listeDestinataires =
							new ObjetListeElements_1.ObjetListeElements();
					}
					const lObjElementDirecteur = new ObjetElement_1.ObjetElement(
						"",
						0,
						Enumere_Ressource_1.EGenreRessource.Personnel,
					);
					lObjElementDirecteur.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lMessageEnEnvoi.listeDestinataires.addElement(lObjElementDirecteur);
				}
			}
		}
		if (lControleContenuNonVide && !this.brouillon.contenu) {
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.MsgAucunContenu",
					),
				});
			return;
		}
		if (this.message && this.listeMessagerie) {
			let lMessage = this.listeMessagerie.get(
				UtilitaireMessagerie_1.UtilitaireMessagerie.getIndiceDiscussion(
					this.listeMessagerie,
					this.message,
				),
			);
			if (
				lMessage &&
				!lMessage.estUneDiscussion &&
				MethodesObjet_1.MethodesObjet.isNumber(lMessage.indicePere)
			) {
				lMessage = this.listeMessagerie.get(lMessage.indicePere);
			}
			if (lMessage && !this._options.estChat) {
				this.etatUtilisateurSco.message = lMessage;
			}
		}
		return this._requeteSaisieMessage(lMessageEnEnvoi).then((aResult) => {
			if (aResult === true) {
				this._initBrouillon();
			}
		});
	}
	_evenementSurDestinataire(
		aGenreRessource,
		aListeModifiee,
		aListeDestinataires,
	) {
		this.brouillon.listeDestinataires = aListeDestinataires;
		this.brouillon.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.$refreshSelf();
	}
	_construireBrouillonNonEnvoye(aBrouillon) {
		const H = [];
		const lId = `${this.Nom}_inp_objet`;
		H.push(
			'<div id="',
			this.getNomInstance(this.identDestinataire),
			'"></div>',
		);
		H.push('<div style="position:relative;" class="PetitEspaceBas">');
		if (!aBrouillon.estMessageTransferant) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"label",
						{ for: lId, style: "position:absolute; top:5px;" },
						ObjetTraduction_1.GTraductions.getValeur("Messagerie.ObjetMsg"),
					),
					IE.jsx.str(
						"div",
						{ style: "margin-left:40px;" },
						IE.jsx.str("input", {
							id: lId,
							"ie-model": "brouillon.inputObjet",
							maxlength:
								UtilitaireMessagerie_1.UtilitaireMessagerie
									.C_TailleObjetMessage,
							type: "text",
							style: "width:100%;",
						}),
					),
				),
			);
		} else {
			H.push(
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur("Messagerie.ObjetMsg"),
				"&nbsp;&nbsp;",
				aBrouillon.objet,
				"</label>",
			);
		}
		H.push("</div>");
		ObjetHtml_1.GHtml.setHtml(this.idBrouillonNonEnvoye + "_td", H.join(""), {
			controleur: this.controleur,
		});
		this.getInstance(this.identDestinataire).initialiser();
		const lListes = {};
		aBrouillon.listeDestinataires.parcourir((D) => {
			if (!lListes[D.getGenre()]) {
				lListes[D.getGenre()] = new ObjetListeElements_1.ObjetListeElements();
			}
			lListes[D.getGenre()].addElement(D);
			D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		});
		for (const i in lListes) {
			if (lListes[i]) {
				lListes[i].trier();
			}
		}
		const lDonnees = [];
		[
			Enumere_Ressource_1.EGenreRessource.Eleve,
			Enumere_Ressource_1.EGenreRessource.Responsable,
			Enumere_Ressource_1.EGenreRessource.Enseignant,
			Enumere_Ressource_1.EGenreRessource.Personnel,
		].forEach((aGenre) => {
			lDonnees.push({
				genre: aGenre,
				getDisabled() {
					return !UtilitaireMessagerie_1.UtilitaireMessagerie.estGenreDestinataireAutorise(
						aGenre,
					);
				},
				listeDestinataires: lListes[aGenre],
			});
		});
		this.getInstance(this.identDestinataire).setDonnees(lDonnees);
	}
	_construireVisuTransfert(aBrouillon) {
		const lListeMessages = new ObjetListeElements_1.ObjetListeElements(),
			lMessage = new ObjetElement_1.ObjetElement("", 0);
		lListeMessages.addElement(lMessage);
		lMessage.contenu = "";
		lMessage.estMessageTransferant = true;
		lMessage.listeMessagesPourContexte = aBrouillon.listeMessagesPourContexte;
		lMessage.nbTransfert = aBrouillon.listeMessagesPourContexte.count();
		ObjetHtml_1.GHtml.setHtml(
			this.idVisuTransfert + "_td",
			UtilitaireMessagerie_1.UtilitaireMessagerie.getDiscussion({
				listeMessages: lListeMessages,
				pere: this,
				btnModel: "visuMessage.btnDest",
			}),
			{ controleur: this.controleur },
		);
	}
	_reponseListeMessages(aParamsBindRequete, aParam) {
		if (aParam.messageErreurActualisation) {
			this.applicationSco
				.getMessage()
				.afficher({ message: aParam.messageErreurActualisation });
		}
		if (this._options.callbackActualisation) {
			if (this._options.callbackActualisation(aParam) === "interrupt") {
				return;
			}
		}
		if (aParam.messageErreurActualisation) {
			return this.setDonnees({});
		}
		let lScrollTop = 0;
		if (aParamsBindRequete.MAJNbMessages) {
			const lElementScroll = ObjetHtml_1.GHtml.getElement(this.idDiscussion);
			lScrollTop = lElementScroll.scrollHeight - lElementScroll.scrollTop;
		}
		this.listeMessages = aParam.listeMessages;
		this.messagePourReponse = aParam.messagePourReponse;
		this.paramDestinataires = aParam.destinataires;
		this.brouillonExistant = aParam.brouillon;
		this.nbPossessionsMessageListe = aParam.nbPossessionsMessage;
		this.listeBoutonsReponse = aParam.listeBoutons;
		const lEstChatCloture =
			this._options.estChat &&
			this.messagePourReponse &&
			!this.messagePourReponse.estChat;
		let lDisplayReponsePere = true;
		if (
			aParam.listeBoutons.count() === 0 ||
			lEstChatCloture ||
			UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageNonEditable(
				this.message,
			) ||
			UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageNonEditable(
				this.messagePourReponse,
			)
		) {
			lDisplayReponsePere = false;
			if (
				UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageNonEditable(
					this.message,
				) ||
				UtilitaireMessagerie_1.UtilitaireMessagerie.estMessageNonEditable(
					this.messagePourReponse,
				)
			) {
				ObjetHtml_1.GHtml.setDisplay(this.idReponse + "_vide", false);
			}
		}
		if (!this.brouillonExistant) {
			if (!this.messagePourReponse || !this.messagePourReponse.existeNumero()) {
				lDisplayReponsePere = false;
			} else if (
				this.messagePourReponse.estCarnetLiaison &&
				this.message &&
				this.message.existeNumero()
			) {
				lDisplayReponsePere = false;
			}
		}
		const lMessagerieDesactiveHoraire = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.communication.discussionDesactiveeSelonHoraire,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.idReponseSaisie,
			lDisplayReponsePere && !lMessagerieDesactiveHoraire,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.idMessagerieDesactiveeHoraire,
			lDisplayReponsePere && lMessagerieDesactiveHoraire,
		);
		if (aParam.brouillon && aParam.brouillon.estMessageTransferant) {
			ObjetHtml_1.GHtml.setDisplay(this.idVisuTransfert, true);
			this._construireVisuTransfert(aParam.brouillon);
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.idVisuTransfert, false);
			ObjetHtml_1.GHtml.setHtml(this.idVisuTransfert + "_td", "");
		}
		this.avecDirecteurAjouteALaDiscussion = false;
		if (
			lDisplayReponsePere &&
			!!this.messagePourReponse &&
			this.messagePourReponse.estCarnetLiaison &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication.avecDiscussionAvancee,
			)
		) {
			this.avecDirecteurAjouteALaDiscussion =
				UtilitaireMessagerie_1.UtilitaireMessagerie.unMessageContientLeDirecteur(
					this.listeMessages,
				);
		}
		if (
			aParam.brouillon &&
			aParam.brouillon.listeDestinataires &&
			this.listeMessages &&
			this.listeMessages.count() === 0
		) {
			ObjetHtml_1.GHtml.setDisplay(this.idBrouillonNonEnvoye, true);
			this._construireBrouillonNonEnvoye(aParam.brouillon);
		} else {
			ObjetHtml_1.GHtml.setDisplay(this.idBrouillonNonEnvoye, false);
			ObjetHtml_1.GHtml.setHtml(this.idBrouillonNonEnvoye + "_td", "");
		}
		if (aParam.brouillon) {
			this._initBrouillon();
			this.brouillon = aParam.brouillon;
			this._actualiserContenuSaisie();
			if (aParam.brouillon.listeDocumentsJoints) {
				this.brouillon.listeFichiers = aParam.brouillon.listeDocumentsJoints;
			} else if (!this.brouillon.listeFichiers) {
				this.brouillon.listeFichiers =
					new ObjetListeElements_1.ObjetListeElements();
			}
			this._actualiserSelecteurPJ();
			this.actualiserListeCloud();
		}
		this.moteurMessagerie.actualiserMenuCtxMixteBandeauDroite();
		const lJqDiscu = $("#" + this.idDiscussion.escapeJQ());
		this.surResizeInterface();
		lJqDiscu.ieHtml(
			UtilitaireMessagerie_1.UtilitaireMessagerie.getDiscussion({
				listeMessages: this.listeMessages,
				controleur: this.controleur,
				pere: this,
				nbMessagesTotal: this.nbPossessionsMessageListe,
				callbackAfficherSuivants: (aNbMessagesVus) => {
					this._requeteListeMessages({
						MAJNbMessages: true,
						nbMessagesVus: aNbMessagesVus,
					});
				},
				callbackBtnSignalantPourSupp: (aCommande) => {
					return this._requeteSaisieMessage(aCommande);
				},
				callbackCommandesMessage: !this._options.estChat
					? (aParams) => {
							this._menuContextuelVisuMessage(
								aParams.messageVisu,
								aParams.elementCibleCopie,
							);
						}
					: null,
				btnModel: "visuMessage.btnDest",
			}),
			{ controleur: this.controleur },
		);
		const lElementDiscussion = ObjetHtml_1.GHtml.getElement(this.idDiscussion);
		let lFuncScrollMax = null;
		if (lElementDiscussion) {
			if (lScrollTop > 0) {
				lElementDiscussion.scrollTop =
					lElementDiscussion.scrollHeight - lScrollTop;
			} else {
				lFuncScrollMax = function () {
					lElementDiscussion.scrollTop = lElementDiscussion.scrollHeight;
				};
				lFuncScrollMax();
			}
		}
		if (this._options.callbackActualisation) {
			this._options.callbackActualisation({ apresListeMessages: true });
		}
		if (lFuncScrollMax) {
			this.controleur.$refreshSelf().then(() => {
				lFuncScrollMax();
			});
		}
	}
	_actualiserSelecteurPJ() {
		if (
			!this.moteurMessagerie.autoriserAjoutPJ() ||
			this._estMessageCourantChat()
		) {
			return;
		}
		const lInstance = this.getInstance(this.identSelecteurPJ);
		lInstance.setDonnees({
			listePJ: this.brouillon.listeFichiers,
			listeTotale: this.listePJ,
			idContextFocus: this.Nom,
		});
	}
	_evntSelecteurPJ() {
		if (
			this.brouillon.contenu !== "" ||
			this.brouillon.listeFichiers.count() > 0
		) {
			this.brouillon.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		this.$refreshSelf();
	}
	_commandeAjoutDest(aGenreRessource) {
		if (!this.messagePourReponse) {
			return;
		}
		if (!this.messagePourReponse.listeDestinataires) {
			this.messagePourReponse.listeDestinataires =
				new ObjetListeElements_1.ObjetListeElements();
		}
		return UtilitaireMessagerie_1.UtilitaireMessagerie.selectionnerListePublics(
			{
				instance: this,
				genreRessource: aGenreRessource,
				uniquementAjouterDest: true,
				listeRessourcesInvisibles:
					this.paramDestinataires.listeDestinataires.getListeElements(
						(aRess) => aRess.getGenre() === aGenreRessource,
					),
				listeRessourcesSelectionnees:
					this.messagePourReponse.listeDestinataires.getListeElements(
						(aRess) => aRess.getGenre() === aGenreRessource,
					),
			},
		).then((aListe) => {
			if (aListe) {
				this.messagePourReponse.listeDestinataires =
					this.messagePourReponse.listeDestinataires.getListeElements((D) => {
						return D.getGenre() !== aGenreRessource;
					});
				aListe.parcourir((aRess) => {
					const lElement = MethodesObjet_1.MethodesObjet.dupliquer(aRess);
					lElement.Genre = aGenreRessource;
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.messagePourReponse.listeDestinataires.addElement(lElement);
				});
			}
		});
	}
	_repondreVisuMessage(aIndiceListeMessagerie) {
		const lIndiceMessage = aIndiceListeMessagerie;
		if (lIndiceMessage >= 0) {
			this._conserverMessageVisuSelectionne = true;
			try {
				this.getInstance(this.identListe).selectionnerLigne({
					ligne: lIndiceMessage,
					avecEvenement: true,
				});
			} finally {
				delete this._conserverMessageVisuSelectionne;
			}
		}
	}
	_afficherDiscussion(aMessageListe) {
		const lListe = this.getInstance(this.identListe);
		const lDiscussion =
			UtilitaireMessagerie_1.UtilitaireMessagerie.getDiscussionRacine(
				aMessageListe,
			);
		const lIndicePere = this.listeMessagerie
			.getTabListeElements()
			.indexOf(lDiscussion);
		const lIndiceMessage = this.listeMessagerie
			.getTabListeElements()
			.indexOf(aMessageListe);
		if (lIndicePere >= 0) {
			this._conserverMessageVisuSelectionne = true;
			try {
				lListe.selectionnerLigne({ ligne: lIndicePere, avecEvenement: true });
			} finally {
				delete this._conserverMessageVisuSelectionne;
			}
			if (lIndiceMessage >= 0) {
				lListe.selectionnerLigne({
					ligne: lIndiceMessage,
					deselectionnerTout: null,
				});
			}
		}
	}
	_menuContextuelVisuMessage(aMessageVisu, aElementCibleCopie) {
		this._messageVisuSelectionne = aMessageVisu;
		if (!this.message || !this._messageVisuSelectionne) {
			return;
		}
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: (aInstance) => {
				this.moteurMessagerie.addCommandesMenuContextuelVisuMessage({
					messageListeSelection: this.message,
					messageVisu: this._messageVisuSelectionne,
					menuContextuel: aInstance,
					elementCibleCopie: aElementCibleCopie,
					callback: (aParams) => {
						this._execCommand(aParams);
					},
				});
			},
		});
	}
	_getListeDestinatairesMessageCourant() {
		const lDestinataires = new ObjetListeElements_1.ObjetListeElements();
		if (this.paramDestinataires && this.messagePourReponse) {
			if (this.paramDestinataires.listeDestinataires) {
				lDestinataires.add(this.paramDestinataires.listeDestinataires);
			}
			if (this.messagePourReponse.listeDestinataires) {
				lDestinataires.add(this.messagePourReponse.listeDestinataires);
			}
		}
		return lDestinataires;
	}
	_actualisationSurNotificationChat(aListeDiscussions) {
		if (!aListeDiscussions) {
			return;
		}
		let lMessageActualisation = null;
		aListeDiscussions.parcourir((aMessage) => {
			if (aMessage.listePossessionsMessages) {
				if (
					!this.message &&
					this._creationChatAvecSaisieMessage &&
					aMessage.perso &&
					aMessage.listePossessionsMessages.count() === 1
				) {
					lMessageActualisation = aMessage;
				} else if (this.message && this.message.listePossessionsMessages) {
					aMessage.listePossessionsMessages.parcourir((aPossessionMessage) => {
						if (
							this.message.listePossessionsMessages.getElementParElement(
								aPossessionMessage,
							)
						) {
							lMessageActualisation = aMessage;
							return false;
						}
					});
				}
				if (lMessageActualisation) {
					lMessageActualisation.messageDejaTraite = true;
					return false;
				}
			}
		});
		if (lMessageActualisation) {
			lMessageActualisation = MethodesObjet_1.MethodesObjet.dupliquer(
				lMessageActualisation,
			);
			const lListeMessages = new ObjetListeElements_1.ObjetListeElements();
			lListeMessages.addElement(lMessageActualisation);
			this._conserverBrouillonChat = this._conserverBrouillonChat !== false;
			this.setDonnees({
				message: lMessageActualisation,
				listeMessagerie: lListeMessages,
				conserverBrouillon: this._conserverBrouillonChat,
			});
			delete this._conserverBrouillonChat;
		}
	}
}
exports.InterfaceListeMessagerie = InterfaceListeMessagerie;
