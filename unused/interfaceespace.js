exports.ObjetInterfaceEspace = void 0;
require("IEHtml.TextareaMax.js");
require("IEHtml.SyntheseVocale.js");
require("IEHtml.SelecFile.js");
require("IEHtml.Scroll.js");
require("DeclarationQRCode.js");
const ObjetRequeteNavigation_1 = require("ObjetRequeteNavigation");
require("UtilitaireQCM.js");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetStyle_1 = require("ObjetStyle");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetSupport_1 = require("ObjetSupport");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetWAI_1 = require("ObjetWAI");
const UtilitaireGenerationPDF_1 = require("UtilitaireGenerationPDF");
const Enumere_Commande_1 = require("Enumere_Commande");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const UtilitaireContactVieScolaire_Espace_1 = require("UtilitaireContactVieScolaire_Espace");
const ThemesPrimaire_1 = require("ThemesPrimaire");
const InterfaceBandeauEntete_1 = require("InterfaceBandeauEntete");
const InterfaceBandeauPied_1 = require("InterfaceBandeauPied");
const DeclarationOngletsEspace_1 = require("DeclarationOngletsEspace");
const _ObjetInterfaceEspaceCP_1 = require("_ObjetInterfaceEspaceCP");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const UtilTransformationFlux = require("UtilitaireTransformationFlux");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const UtilitaireRequetesCloud_1 = require("UtilitaireRequetesCloud");
const UtilitaireDeconnexion_1 = require("UtilitaireDeconnexion");
const InterfaceVide_1 = require("InterfaceVide");
const ObjetFenetre_GenerationPdfSco_1 = require("ObjetFenetre_GenerationPdfSco");
const ObjetRequeteAccesSecurisePageProfil_1 = require("ObjetRequeteAccesSecurisePageProfil");
const OptionsPDFSco_1 = require("OptionsPDFSco");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const Cache_1 = require("Cache");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const ObjetFenetre_DepotDocument_1 = require("ObjetFenetre_DepotDocument");
const TypeCasier_1 = require("TypeCasier");
const AccessApp_1 = require("AccessApp");
const ObjetFenetre_EnvoiEMail_1 = require("ObjetFenetre_EnvoiEMail");
class ObjetInterfaceEspace extends _ObjetInterfaceEspaceCP_1._ObjetInterfaceEspaceCP {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = GParametres;
		if (ObjetSupport_1.Support.supportEventOnPopState) {
			$(window).on("popstate", { instance: this }, this._surPopState);
		}
		this._creerTransformateurFlux();
	}
	construireInstances() {
		this.IdentBandeauEntete = this.add(
			InterfaceBandeauEntete_1.ObjetAffichageBandeauEntete,
			this.evenementCommande,
		);
		this.IdentBandeauPied = this.add(
			InterfaceBandeauPied_1.ObjetAffichageBandeauPied,
			this.evenementCommande,
		);
		this.IdentPage = this.add(InterfaceVide_1.InterfaceVide);
		this.construireInstancesPDFEtImpression();
	}
	evenementSurMenuContextCloud() {
		super.surEvenementSurImpression();
	}
	construireInstancesPDFEtImpression() {
		super.construireInstancesPDFEtImpression();
		this.identFenetreGenerationPdf = this.addFenetre(
			ObjetFenetre_GenerationPdfSco_1.ObjetFenetre_GenerationPdfSco,
		);
	}
	detruireInstances() {
		super.detruireInstances();
		$(window).off("popstate");
	}
	focusAuDebut() {
		this.getInstance(this.IdentBandeauEntete).focusAuDebut();
	}
	setParametresGeneraux() {
		this.AvecCadre = false;
	}
	construireStructureAffichage() {
		const H = [];
		let lHtmlFooter = "";
		let lFooter = "no-footer";
		if (this.IdentBandeauPied > 0) {
			const lInstanceFooter = this.getInstance(this.IdentBandeauPied);
			const lClassEtatFooter = lInstanceFooter.masquerBandeauPied()
				? "closed"
				: "opened";
			lFooter = lInstanceFooter.masquerBandeauPied()
				? "no-footer"
				: "with-footer";
			lHtmlFooter =
				'<div class="footer-wrapper ' +
				lClassEtatFooter +
				'" id="' +
				lInstanceFooter.getNom() +
				'" ></div>';
		}
		H.push(
			'<div id="',
			this.Nom,
			'_T"',
			' style="position:relative;',
			this.etatUtilisateurSco.pourThemePrimaire()
				? ""
				: ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.fond),
			'"',
			' class="interface_affV',
			" ",
			lFooter,
			this.etatUtilisateurSco.pourThemePrimaire()
				? " " + ThemesPrimaire_1.GThemesPrimaire.getTheme()
				: "",
			'">',
		);
		if (this.IdentBandeauEntete >= 0) {
			H.push(
				'<div class="AvecMenuContextuel main-header" id="',
				this.getInstance(this.IdentBandeauEntete).getNom(),
				'" ></div>',
			);
		}
		if (this.IdentPage >= 0) {
			H.push(
				"<div ",
				ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Main),
				' id="',
				this.getNomInstance(this.IdentPage),
				'"',
				' class="interface_affV_client no-tactile',
				this.etatUtilisateurSco.pourThemePrimaire() ? " prim-ludique" : "",
				'">',
				"</div>",
			);
		}
		H.push(lHtmlFooter);
		H.push("</div>");
		return H.join("");
	}
	actualiser() {
		this.initialiser(true);
		this.getInstance(this.IdentBandeauEntete).setDonnees(
			this.connexion.libelle,
			this.connexion.listeEleves,
		);
		this.getInstance(this.IdentBandeauPied).setDonnees();
		Invocateur_1.Invocateur.evenement("maj_boutonImpression");
		this.surResizeInterface();
	}
	setDonnees(aLibelle, aListeEleves, aMessageConnexion) {
		this.connexion = {};
		this.connexion.libelle = aLibelle;
		this.connexion.listeEleves = aListeEleves;
		this.connexion.messageConnexion = aMessageConnexion;
		this.actualiser();
		if (
			this.etatUtilisateurSco.getGenreOnglet() &&
			this.getInstance(this.IdentBandeauEntete)
		) {
			this.getInstance(this.IdentBandeauEntete).evenementSurMenuOnglets(
				new ObjetElement_1.ObjetElement(
					"",
					0,
					this.etatUtilisateurSco.getGenreOnglet(),
				),
			);
		}
		UtilitaireContactVieScolaire_Espace_1.UtilitaireContactVieScolaire_Espace.declarer();
		this.applicationSco.donneesCentraleNotifications.initSurInterfaceDisponible();
	}
	evenementCommande(aParam) {
		switch (aParam.genreCmd) {
			case Enumere_Commande_1.EGenreCommande.Accueil: {
				this._evenementSurClickOnglet(Enumere_Onglet_1.EGenreOnglet.Accueil);
				break;
			}
			case Enumere_Commande_1.EGenreCommande.ChangerOnglet: {
				const lOnglet = aParam.onglet;
				this._evenementSurClickOnglet(
					lOnglet.getGenre(),
					aParam.ignorerHistorique,
				);
				break;
			}
			case Enumere_Commande_1.EGenreCommande.Impression: {
				this.surEvenementSurImpression();
				break;
			}
			case Enumere_Commande_1.EGenreCommande.ImpressionHTML: {
				this.surEvenementSurImpression({ impressionHTML: true });
				break;
			}
			case Enumere_Commande_1.EGenreCommande.Validation: {
				this._surValider();
				break;
			}
			case Enumere_Commande_1.EGenreCommande.Communication: {
				this.evenementSurCommunication();
				break;
			}
			case Enumere_Commande_1.EGenreCommande.Tutoriel: {
				break;
			}
			case Enumere_Commande_1.EGenreCommande.Aide: {
				this.evenementSurAide();
				break;
			}
			case Enumere_Commande_1.EGenreCommande.Profil: {
				this.evenementSurAccesProfil();
				break;
			}
			case Enumere_Commande_1.EGenreCommande.changerMembre: {
				this.evenementSurChangementMembre();
				break;
			}
			default:
				break;
		}
	}
	async surEvenementSurImpression(aParams) {
		let lModeGestion;
		let lEstImpressionHtml = !!aParams && aParams.impressionHTML;
		let lAvecParametresPDF = ![
			Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		switch (this.etatUtilisateurSco.getGenreOnglet()) {
			case Enumere_Onglet_1.EGenreOnglet.Graphique_Profil:
				lModeGestion =
					UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
						.PDF;
				break;
			default:
				lModeGestion =
					UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
						.PDFEtCloud;
		}
		let lParams = {
			avecTitreSelonOnglet: true,
			callbaskEvenement: this.surEvenementFenetre.bind(this),
			callbackParametrage: lAvecParametresPDF
				? this.evenementSurMenuContextCloud.bind(this)
				: null,
			modeGestion: lModeGestion,
			avecDepot: true,
		};
		if (lEstImpressionHtml) {
			this.evenementSurMenuContextCloud();
		} else {
			UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
				lParams,
			);
		}
	}
	evenementSurChangementMembre() {
		this.actualiser();
		this.changementManuelOnglet(this.etatUtilisateurSco.getGenreOnglet());
		if (Cache_1.GCache && Cache_1.GCache.general) {
			Cache_1.GCache.general._jetonViderCacheListePublics = true;
		}
	}
	surEvenementFenetre(aLigne, aService) {
		const lInstance = this;
		if (this.etatUtilisateurSco.EtatSaisie) {
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message:
						this.etatUtilisateurSco.impressionCourante.etat ===
						Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
							? ObjetTraduction_1.GTraductions.getValeur(
									"GenerationPDF.MessageAlerteGenerationPdf",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"fenetreImpression.MessageAlerteImpression",
								),
					callback: lInstance.evenementApresConfirmation.bind(
						lInstance,
						aService,
					),
				});
		} else {
			this.evenementApresConfirmation(
				aService,
				Enumere_Action_1.EGenreAction.Valider,
			);
		}
	}
	evenementApresConfirmation(aService, AAccepte) {
		if (AAccepte === Enumere_Action_1.EGenreAction.Valider) {
			this._genererPdf(aService);
		}
	}
	_surPopState(aEvent) {
		const lInstance = aEvent.data.instance;
		if (ObjetNavigateur_1.Navigateur.getBloquerClavier()) {
			lInstance._surForward = true;
			window.history.forward();
			return;
		}
		const lEtat = aEvent.originalEvent.state;
		if (
			!lEtat ||
			lEtat.onglet === undefined ||
			lEtat.numeroSession !==
				lInstance.applicationSco.getCommunication().NumeroDeSession
		) {
			UtilitaireDeconnexion_1.UtilitaireDeconnexion.confirmationDeconnexion(
				true,
			).then((aValider) => {
				if (aValider === false) {
					lInstance._surForward = true;
					window.history.forward();
				}
			});
		} else {
			if (lInstance._surForward) {
				delete lInstance._surForward;
				return;
			}
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
				function () {
					this.retourSurNavigation({
						ignorerHistorique: true,
						onglet: lEtat.onglet,
					});
				}.bind(lInstance),
			);
		}
	}
	getPage() {
		return this.getInstance(this.IdentPage);
	}
	setFocusPremierObjet() {
		if (
			this.etatUtilisateurSco.premierChargement &&
			this.etatUtilisateurSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.Accueil
		) {
			this.getInstance(this.IdentBandeauEntete).focusAuDebut();
		} else if (
			$("#" + this.applicationSco.idBreadcrumb.escapeJQ() + ":visible")
				.length === 1
		) {
			$("#" + this.applicationSco.idBreadcrumb.escapeJQ()).focus();
		} else if (
			$("#" + this.applicationSco.idBreadcrumbPerso.escapeJQ()).length === 1
		) {
			$("#" + this.applicationSco.idBreadcrumbPerso.escapeJQ()).focus();
		} else if (
			this.getInstance(this.IdentPage) &&
			this.getInstance(this.IdentPage).idPremierObjet &&
			$("#" + this.getInstance(this.IdentPage).idPremierObjet.escapeJQ())
				.length === 1
		) {
			$(
				"#" + this.getInstance(this.IdentPage).idPremierObjet.escapeJQ(),
			).focus();
		} else {
		}
	}
	changementManuelOnglet(aGenreOnglet) {
		const lInterfaceBandeau = this.getInstance(this.IdentBandeauEntete);
		if (
			lInterfaceBandeau &&
			lInterfaceBandeau.getInstance(lInterfaceBandeau.identMenuOnglets)
		) {
			lInterfaceBandeau
				.getInstance(lInterfaceBandeau.identMenuOnglets)
				.selectionnerSousOnglet(aGenreOnglet);
		} else if (lInterfaceBandeau) {
			lInterfaceBandeau.evenementSurMenuOnglets(
				new ObjetElement_1.ObjetElement("", 0, aGenreOnglet),
			);
		} else {
			this._evenementSurClickOnglet(aGenreOnglet);
		}
	}
	changementMembre(aMembre) {
		const lInterfaceBandeau = this.getInstance(this.IdentBandeauEntete);
		if (lInterfaceBandeau) {
			lInterfaceBandeau.changerMembre(aMembre);
		}
	}
	recupererDonnees() {
		this.surResizeInterface();
	}
	initialiserMessageAttente() {}
	initialiserEntete() {
		this.Instances[this.NombreGenreAffichage].setParametres(
			20,
			this.parametresSco.NomEspace,
			true,
			this.parametresSco.NomEtablissement,
			"right",
		);
	}
	getEtatSaisie() {
		return this.etatUtilisateurSco.EtatSaisie;
	}
	evenementSurCommunication() {
		const lFncCreationItemMenuContextuel = (aInstanceMenu) => {
			const lAvecDiscussion =
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.avecDiscussion,
				) &&
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.communication.discussionInterdit,
				);
			const lAvecInfoSondage = this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
			);
			if (lAvecDiscussion) {
				aInstanceMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreCommunication.bouton.demarrerDiscussion",
					),
					true,
					() => {
						ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
							this,
							{
								genresRessources:
									ObjetFenetre_Message_1.ObjetFenetre_Message.getRessourcesDefaut(),
								avecListeDiffusion:
									UtilitaireMessagerie_1.UtilitaireMessagerie.avecListeDiffusionSelonEspace(),
							},
							{ avecChoixDestinataires: true },
						);
					},
					{ icon: "icon_nouvelle_discussion", ariaHasPopup: "dialog" },
				);
			}
			if (lAvecInfoSondage) {
				const lFnSurClicItemInfosSondages = (aEstInformations) => {
					const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite,
						{
							pere: this,
							initialiser: function (aInstance) {
								aInstance.setOptionsFenetre({
									titre: aEstInformations
										? ObjetTraduction_1.GTraductions.getValeur(
												"actualites.creerInfo",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"actualites.creerSondage",
											),
									largeur: 750,
									hauteur: 700,
									listeBoutons: [
										ObjetTraduction_1.GTraductions.getValeur("Annuler"),
										ObjetTraduction_1.GTraductions.getValeur("Valider"),
									],
								});
							},
						},
					);
					lFenetre.setDonnees({
						donnee: null,
						creation: true,
						genreReponse: aEstInformations
							? TypeGenreReponseInternetActualite_1
									.TypeGenreReponseInternetActualite.AvecAR
							: TypeGenreReponseInternetActualite_1
									.TypeGenreReponseInternetActualite.ChoixUnique,
						forcerAR: this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.fonctionnalites.forcerARInfos,
						),
					});
				};
				aInstanceMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreCommunication.bouton.information",
					),
					true,
					() => {
						lFnSurClicItemInfosSondages(true);
					},
					{ icon: "icon_diffuser_information", ariaHasPopup: "dialog" },
				);
				aInstanceMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreCommunication.bouton.sondage",
					),
					true,
					() => {
						lFnSurClicItemInfosSondages(false);
					},
					{ icon: "icon_diffuser_sondage", ariaHasPopup: "dialog" },
				);
			}
			if (
				ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.avecDroitSaisieIntervenant()
			) {
				const lTypeConsultation =
					TypeCasier_1.TypeConsultationDocumentCasier.CoDC_Depositaire;
				aInstanceMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.horsContexte.IntervenantDiffusion",
					),
					true,
					() => {
						ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.ouvrirCreation(
							lTypeConsultation,
						);
					},
					{
						icon: ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.getIconRubriqueDepot(
							lTypeConsultation,
						),
						ariaHasPopup: "dialog",
					},
				);
			}
			if (
				ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.avecDroitSaisieResponsable()
			) {
				const lTypeConsultation =
					TypeCasier_1.TypeConsultationDocumentCasier.CoDC_DepResponsable;
				aInstanceMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"Casier.horsContexte.responsablesDiffusion",
					),
					true,
					() => {
						ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.ouvrirCreation(
							lTypeConsultation,
						);
					},
					{
						icon: ObjetFenetre_DepotDocument_1.ObjetFenetre_DepotDocument.getIconRubriqueDepot(
							lTypeConsultation,
						),
						ariaHasPopup: "dialog",
					},
				);
			}
			const lAvecRedirectionOngletEleves =
				this.etatUtilisateurSco.estOngletAutorise(
					Enumere_Onglet_1.EGenreOnglet.ListeEleves,
				);
			const lAvecRedirectionOngletResponsables =
				this.etatUtilisateurSco.estOngletAutorise(
					Enumere_Onglet_1.EGenreOnglet.ListeResponsables,
				);
			const lAvecRedirectionOngletProfs =
				this.etatUtilisateurSco.estOngletAutorise(
					Enumere_Onglet_1.EGenreOnglet.ListeProfesseurs,
				);
			const lAvecRedirectionOngletEquipePeda =
				this.etatUtilisateurSco.estOngletAutorise(
					Enumere_Onglet_1.EGenreOnglet.EquipePedagogique,
				);
			const lAvecRedirectionOngletPersonnels =
				this.etatUtilisateurSco.estOngletAutorise(
					Enumere_Onglet_1.EGenreOnglet.ListePersonnels,
				);
			const lFnSurClicItemListeRessource = (aGenreOnglet, aIcon) => {
				aInstanceMenu.add(
					this.etatUtilisateurSco.getLibelleLongOnglet(aGenreOnglet),
					this.etatUtilisateurSco.getGenreOnglet() !== aGenreOnglet,
					() => {
						this.changementManuelOnglet(aGenreOnglet);
					},
					{ icon: aIcon },
				);
			};
			if (
				lAvecRedirectionOngletEleves ||
				lAvecRedirectionOngletResponsables ||
				lAvecRedirectionOngletProfs ||
				lAvecRedirectionOngletEquipePeda ||
				lAvecRedirectionOngletPersonnels
			) {
				if (aInstanceMenu.getListeLignes().count()) {
					aInstanceMenu.addSeparateur();
				}
				if (lAvecRedirectionOngletEleves) {
					lFnSurClicItemListeRessource(
						Enumere_Onglet_1.EGenreOnglet.ListeEleves,
						"icon_liste_etudiant",
					);
				}
				if (lAvecRedirectionOngletResponsables) {
					lFnSurClicItemListeRessource(
						Enumere_Onglet_1.EGenreOnglet.ListeResponsables,
						"icon_parents",
					);
				}
				if (lAvecRedirectionOngletProfs) {
					lFnSurClicItemListeRessource(
						Enumere_Onglet_1.EGenreOnglet.ListeProfesseurs,
						"icon_enseignant_prof",
					);
				}
				if (lAvecRedirectionOngletEquipePeda) {
					lFnSurClicItemListeRessource(
						Enumere_Onglet_1.EGenreOnglet.EquipePedagogique,
						"icon_group",
					);
				}
				if (lAvecRedirectionOngletPersonnels) {
					lFnSurClicItemListeRessource(
						Enumere_Onglet_1.EGenreOnglet.ListePersonnels,
						"icon_intervenants",
					);
				}
			}
		};
		const lId = this.getInstance(this.IdentBandeauEntete).NomBtnCommunication;
		const lSetAriaExpanded = (aExpanded) => {
			var _a;
			(_a = ObjetHtml_1.GHtml.getElement(lId)) === null || _a === void 0
				? void 0
				: _a.setAttribute("aria-expanded", aExpanded ? "true" : "false");
		};
		lSetAriaExpanded(true);
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			id: lId,
			initCommandes: lFncCreationItemMenuContextuel.bind(this),
			destroy() {
				lSetAriaExpanded(false);
			},
		});
	}
	ouvrirFenetreEnvoiEmail() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EnvoiEMail_1.ObjetFenetre_EnvoiEMail,
			{ pere: this },
		);
		lFenetre.afficher();
	}
	evenementSurAide() {
		if (this.parametresSco.urlAide) {
			window.open(
				ObjetChaine_1.GChaine.format(this.parametresSco.urlAide, [
					this.etatUtilisateurSco.getGenreOnglet(),
					this.etatUtilisateurSco.getLibelleLongOnglet(),
				]),
			);
		}
	}
	evenementSurAccesProfil() {
		UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirPatience();
		if (
			ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil
		) {
			new ObjetRequeteAccesSecurisePageProfil_1.ObjetRequeteAccesSecurisePageProfil(
				this,
			)
				.lancerRequete()
				.then((aReponse) => {
					this.actionSurRequetePageProfil(
						aReponse.titre,
						aReponse.message,
						aReponse.url,
					);
				});
		}
	}
	actionSurRequetePageProfil(aTitre, aMessage, aUrl) {
		if (aMessage) {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					titre: aTitre,
					message: aMessage,
				});
		} else if (aUrl) {
			UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirUrl(aUrl);
		} else {
			UtilitairePartenaire_1.TUtilitairePartenaire.fermerPatience();
		}
	}
	raccourcisClavierSurBandeau(aNumeroRaccourci) {
		this.getInstance(this.IdentBandeauEntete).evenementRaccourcisClavier(
			aNumeroRaccourci,
		);
		return true;
	}
	actualisationF5() {
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			this.retourSurNavigation({
				ignorerHistorique: true,
				onglet: this.etatUtilisateurSco.getGenreOnglet(),
			});
		});
	}
	retourSurNavigation(aParametres) {
		if (aParametres && aParametres.ignorerHistorique) {
			this.getInstance(this.IdentBandeauEntete).evenementSurMenuOnglets(
				new ObjetElement_1.ObjetElement("", 0, aParametres.onglet),
				true,
			);
		} else if (
			!MethodesObjet_1.MethodesObjet.isUndefined(
				this.etatUtilisateurSco.getGenreOnglet(),
			)
		) {
			this.getInstance(this.IdentBandeauEntete).evenementSurMenuOnglets(
				new ObjetElement_1.ObjetElement(
					"",
					0,
					this.etatUtilisateurSco.getGenreOnglet(),
				),
			);
		}
	}
	getLibelleSousOnglet(
		aLibelle,
		aAvecNom,
		aAvecClasse,
		aAvecGroupe,
		aSansLibelleOnglet,
	) {
		return this.getInstance(this.IdentBandeauEntete).getLibelleSousOnglet(
			aLibelle,
			aAvecNom,
			aAvecClasse,
			aAvecGroupe,
			aSansLibelleOnglet,
		);
	}
	surEvenementFenetreImpression() {}
	_creerTransformateurFlux() {
		if (
			!UtilTransformationFlux ||
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites
					.avecTransformationFluxFichier,
			)
		) {
			return;
		}
		const lTransformationFlux = new UtilTransformationFlux.TransformationFlux({
			pere: this,
			getActif: () => {
				return this.applicationSco.parametresUtilisateur.get(
					"avecTransformateurFlux",
				);
			},
			setActif: (aActif) => {
				this.applicationSco.parametresUtilisateur.set(
					"avecTransformateurFlux",
					aActif,
				);
			},
			traiterFichiersClouds: async (aListeFichiers, aResultFenetreTransfo) => {
				const lResult = await new Promise((aResolve) => {
					let lElementSelec = null;
					UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
						{
							modeGestion:
								UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF
									.modeGestion.Cloud,
							callbaskEvenement: (aLigne) => {
								if (aLigne >= 0) {
									const lService =
										this.etatUtilisateurSco.listeCloud.get(aLigne);
									if (lService) {
										ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
											ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
											{
												pere: this,
												evenement(aParam) {
													if (
														aParam.listeNouveauxDocs &&
														aParam.listeNouveauxDocs.count() > 0
													) {
														lElementSelec = aParam.listeNouveauxDocs.get(0);
													}
												},
												initialiser(aFenetre) {
													aFenetre.setOptionsFenetre({
														modale: true,
														modeSelectionRepertoirePourUpload: true,
														estMonoSelection: true,
														callbackApresFermer() {
															aResolve({
																dossierSelec: lElementSelec,
																service: lService.Genre,
															});
														},
													});
												},
											},
										).setDonnees({ service: lService.Genre });
									}
								}
							},
						},
					);
				});
				if (lResult && lResult.dossierSelec) {
					try {
						await UtilitaireRequetesCloud_1.UtilitaireRequetesCloud.requeteUploadVersCloudListFichiers(
							{
								idPartageDossier: lResult.dossierSelec.idPartage,
								service: lResult.service,
								listeFichiersATraiter:
									aResultFenetreTransfo.listeFichiersUploadCloud,
								listeFichiersResultat: aListeFichiers,
							},
						);
					} catch (e) {}
				}
			},
		});
		this.applicationSco.setObject("transformationFlux", lTransformationFlux);
	}
	_genererPdf(aService) {
		let lRessource = this.etatUtilisateurSco.Identification.ressource;
		let lRessources = new ObjetListeElements_1.ObjetListeElements().addElement(
			lRessource,
		);
		let lService = !!aService ? aService.getGenre() : null;
		lRessources.setSerialisateurJSON({ ignorerEtatsElements: true });
		let lEtat = this.etatUtilisateurSco.impressionCourante.callback();
		const lFenetre = this.getInstance(this.identFenetreGenerationPdf);
		lFenetre.creerInstanceFenetrePDF(lEtat);
		lFenetre.free();
		let lOptions = !!lEtat
			? this.etatUtilisateurSco.parametresGenerationPDF[
					lEtat.genreGenerationPDF
				]
			: OptionsPDFSco_1.OptionsPDFSco.defaut;
		UtilitaireGenerationPDF_1.GenerationPDF.genererPDF({
			paramPDF: lEtat,
			optionsPDF: lOptions,
			cloudCible: lService,
		});
	}
	async _evenementSurClickOnglet(aGenreOnglet, aIgnorerHistorique) {
		UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
		if (aGenreOnglet === null || aGenreOnglet === undefined) {
			return;
		}
		const lOngletPrec = this.etatUtilisateurSco.getGenreOnglet();
		this.etatUtilisateurSco.setGenreOnglet(aGenreOnglet);
		Invocateur_1.Invocateur.evenement("surNavigationOnglet", aGenreOnglet);
		const lIFCBandeau = this.getInstance(this.IdentBandeauEntete);
		if (lIFCBandeau) {
			lIFCBandeau.actualiserLibelleOnglet();
			Invocateur_1.Invocateur.evenement("fermerAutresMenuOnglet");
		}
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.fermerFenetres,
		);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.nettoyerJSX,
		);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		if (
			this.etatUtilisateurSco.pourPrimaire() &&
			![
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace) &&
			aGenreOnglet === Enumere_Onglet_1.EGenreOnglet.Accueil
		) {
			$(".interface_affV").addClass(
				ThemesPrimaire_1.GThemesPrimaire.getTheme(),
			);
		} else {
			$(".interface_affV").removeClass(
				ThemesPrimaire_1.GThemesPrimaire.getTheme(),
			);
		}
		if (this.parametresSco.getNomEspace() === "Espace Inscriptions") {
			$(".interface_affV").addClass("e-inscriptions");
		} else {
			$(".interface_affV").removeClass("e-inscriptions");
		}
		if (aGenreOnglet !== Enumere_Onglet_1.EGenreOnglet.Accueil) {
			$(".interface_affV_client, .interface_affV").addClass("over-scroll");
		} else {
			$(".interface_affV_client, .interface_affV").removeClass("over-scroll");
		}
		if (this.Instances[this.IdentPage] && this.Instances[this.IdentPage].free) {
			this.Instances[this.IdentPage].free();
		}
		this.Instances[this.IdentPage] = null;
		if (
			!aIgnorerHistorique &&
			aGenreOnglet !== null &&
			aGenreOnglet !== undefined &&
			ObjetSupport_1.Support.supportEventOnPopState
		) {
			try {
				window.history.pushState(
					{
						onglet: aGenreOnglet,
						numeroSession:
							this.applicationSco.getCommunication().NumeroDeSession,
					},
					"",
				);
			} catch (e) {}
		}
		this.surResizeInterface();
		await new ObjetRequeteNavigation_1.ObjetRequeteNavigation(
			this,
		).lancerRequete(aGenreOnglet, lOngletPrec);
		GApplication.parametresUtilisateur.set("onglet", aGenreOnglet, true);
		this._actionSurEvenementSurClickOnglet();
	}
	_actionSurEvenementSurClickOnglet() {
		Invocateur_1.Invocateur.evenement("apresRequeteNavigation");
		const lGenreOnglet = this.etatUtilisateurSco.getGenreOnglet();
		if (IE.log.getActif()) {
			IE.log.addLog(
				`Interface Construire Onglet n° ${lGenreOnglet} - ${MethodesObjet_1.MethodesObjet.nomProprieteDeValeur(Enumere_Onglet_1.EGenreOnglet, lGenreOnglet)}`,
				"OBJETINTERFACE_LOGNOM",
			);
		}
		try {
			this.Instances[this.IdentPage] =
				DeclarationOngletsEspace_1.DeclarationOngletsEspace.creerOnglet(
					lGenreOnglet,
					{ nomComplet: this.getZoneId(this.IdentPage), pere: this },
				);
			if (this.Instances[this.IdentPage]) {
				ObjetHtml_1.GHtml.setHtml(this.Instances[this.IdentPage].getNom(), "");
			} else {
			}
		} catch (e) {}
		this.setEtatSaisie(false);
		this.etatUtilisateurSco.setPageCourante(this.Instances[this.IdentPage]);
		if (this.Instances[this.IdentPage]) {
			Invocateur_1.Invocateur.evenement("maj_boutonImpression");
		}
		const lOnglet =
			this.etatUtilisateurSco.listeOnglets &&
			this.etatUtilisateurSco.genreOnglet
				? this.etatUtilisateurSco.listeOnglets.getElementParGenre(
						this.etatUtilisateurSco.genreOnglet,
					)
				: null;
		const lLibelleOnglet = lOnglet
			? ObjetChaine_1.GChaine.toTitle(
					lOnglet.libelleLong || lOnglet.getLibelle(),
				)
			: "";
		(0, AccessApp_1.getApp)()
			.getObjetParametres()
			.setDocumentTitle(lLibelleOnglet);
		this.surResizeInterface();
		if (this.Instances[this.IdentPage]) {
			this.Instances[this.IdentPage].initialiser();
		}
		if (this.getInstance(this.IdentBandeauEntete)) {
			this.getInstance(this.IdentBandeauEntete).actualiserBreadcrumb(
				this.etatUtilisateurSco.getGenreOnglet(),
			);
			const lInstanceMenuOnglet = this.getInstance(
				this.IdentBandeauEntete,
			).getInstanceMenuOnglet();
			if (lInstanceMenuOnglet) {
				lInstanceMenuOnglet.setOngletPN(
					this.etatUtilisateurSco.getGenreOnglet(),
				);
			}
			const lInstanceOngletAccueil = this.getInstance(
				this.IdentBandeauEntete,
			).getInstanceMenuAccueil();
			if (lInstanceOngletAccueil) {
				lInstanceOngletAccueil.setOngletPN(
					this.etatUtilisateurSco.getGenreOnglet(),
				);
			}
			this.setFocusPremierObjet();
		}
		this.etatUtilisateurSco.resetPage();
		Invocateur_1.Invocateur.evenement("apresNavigationOngletDesktop");
	}
	_surValider() {
		const lInstance = this.getInstance(this.IdentPage);
		if (this.applicationSco.getDemo()) {
			alert(ObjetTraduction_1.GTraductions.getValeur("Demo.Message"));
		}
		if (lInstance.valider) {
			lInstance.valider();
		}
	}
}
exports.ObjetInterfaceEspace = ObjetInterfaceEspace;
