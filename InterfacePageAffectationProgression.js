exports.InterfacePageAffectationProgression = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const Invocateur_1 = require("Invocateur");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const ObjetRequeteListeCDTProgressions_1 = require("ObjetRequeteListeCDTProgressions");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequetePageEmploiDuTemps_DomainePresence_1 = require("ObjetRequetePageEmploiDuTemps_DomainePresence");
const ObjetRequeteSaisieCahierDeTextes_1 = require("ObjetRequeteSaisieCahierDeTextes");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const Enumere_BoutonSouris_1 = require("Enumere_BoutonSouris");
const ObjetDonneesTreeViewProgression_1 = require("ObjetDonneesTreeViewProgression");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const GestionnaireBlocCDT_2 = require("GestionnaireBlocCDT");
const InterfaceSelectionPlanProgression_1 = require("InterfaceSelectionPlanProgression");
const GestionnaireModale_1 = require("GestionnaireModale");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_ListeTAFFaits_2 = require("ObjetFenetre_ListeTAFFaits");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
const _ObjetDonneesTreeView_1 = require("_ObjetDonneesTreeView");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
class InterfacePageAffectationProgression extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilisateur = this.applicationSco.getEtatUtilisateur();
		this.objetParametres = this.applicationSco.getObjetParametres();
		this.ressource = this.etatUtilisateur.getUtilisateur();
	}
	construireInstances() {
		this.identSelectionProgression = this.add(
			InterfaceSelectionPlanProgression_1.InterfaceSelectionPlanProgression,
			null,
			this._initSelectionProgression,
		);
		this.IdentCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this.evenementSurCalendrier,
			this.initialiserCalendrier,
		);
		this.IdentGrille = this.add(
			InterfaceGrilleEDT_1.InterfaceGrilleEDT,
			this.evenementSurCours,
			this.initialiserGrille,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			this.evenementSurVisuEleve,
		);
		this.IdentMenuContextuel = this.add(
			ObjetMenuContextuel_1.ObjetMenuContextuel,
			this.evenementSurMenuContextuel,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push({
			html:
				'<div class="Gras Insecable">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"progression.GlisserEtDeplacerContenus",
				) +
				"</div>",
		});
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnulesControleur(
				"btnCoursAnnules",
			),
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCoursAnnules: {
				event() {
					aInstance.etatUtilisateur.setAvecCoursAnnule(
						!aInstance.etatUtilisateur.getAvecCoursAnnule(),
					);
					aInstance._actualiserGrille();
				},
				getSelection() {
					return aInstance.etatUtilisateur.getAvecCoursAnnule();
				},
				getTitle() {
					return aInstance.etatUtilisateur.getAvecCoursAnnule()
						? ObjetTraduction_1.GTraductions.getValeur(
								"EDT.MasquerCoursAnnules",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AfficherCoursAnnules",
							);
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
						aInstance.etatUtilisateur.getAvecCoursAnnule(),
					);
				},
			},
		});
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ class: "full-height p-all flex-contain flex-gap" },
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identSelectionProgression),
				style: `min-width:400px; width:${this._getLargeurTreeView()}px`,
			}),
			IE.jsx.str(
				"div",
				{ class: "fluid-bloc full-height flex-contain cols" },
				IE.jsx.str("div", {
					class: "fix-bloc",
					id: this.getNomInstance(this.IdentCalendrier),
				}),
				IE.jsx.str("div", {
					class: "fluid-bloc",
					id: this.getInstance(this.IdentGrille).getNom(),
				}),
			),
		);
	}
	initialiserCalendrier(AInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(AInstance);
	}
	initialiserGrille(AInstance) {
		AInstance.setOptionsInterfaceGrilleEDT({
			optionsGrille: { avecMouseInOutCours: true },
			optionsGrilleMS: { avecMouseInOutCours: true },
		});
	}
	recupererDonnees() {
		this._requeteListeCDT();
		this.afficherPage();
	}
	afficherPage() {
		this.setEtatSaisie(false);
		if (!this.etatUtilisateur.getDomainePresence(this.ressource)) {
			this.requeteDomaineDePresence();
		} else {
			this.actionSurDomaineDePresence();
		}
	}
	_requeteListeCDT() {
		new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
			this,
			this._surReponseRequeteListeCDTProgression,
		).lancerRequete({ avecListeProgrammesNiveaux: false });
	}
	_surReponseRequeteListeCDTProgression(
		aListeProgressions,
		aListeNiveaux,
		aListeCategories,
		aListeDocumentsJoints,
	) {
		this.avecDocumentJoint = [];
		this.avecDocumentJoint[
			Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
		] = true;
		this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud] =
			this.etatUtilisateur.listeCloud.count() > 0;
		this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Url] =
			true;
		this.getInstance(this.identSelectionProgression).actualiser({
			listeProgressions: aListeProgressions,
			listeNiveaux: aListeNiveaux,
		});
	}
	async requeteDomaineDePresence() {
		const lReponse =
			await new ObjetRequetePageEmploiDuTemps_DomainePresence_1.ObjetRequetePageEmploiDuTemps_DomainePresence(
				this,
			).lancerRequete(this.ressource);
		this.actionSurDomaineDePresence(lReponse.Domaine);
	}
	actionSurDomaineDePresence(aDomainePresence) {
		if (aDomainePresence) {
			this.etatUtilisateur.setDomainePresence(this.ressource, aDomainePresence);
		}
		this.initialisationCalendrier(
			this.etatUtilisateur.getDomainePresence(this.ressource),
		);
	}
	initialisationCalendrier(aDomainePresence) {
		this.getInstance(this.IdentCalendrier).setFrequences(
			this.objetParametres.frequences,
			true,
		);
		this.getInstance(this.IdentCalendrier).setDomaineInformation(
			aDomainePresence,
			Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu,
		);
		this.getInstance(this.IdentCalendrier).setPeriodeDeConsultation(
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
		this.getInstance(this.IdentCalendrier).setSelection(
			this.etatUtilisateur.getSemaineSelectionnee(),
		);
	}
	async requetePageEmploiDuTemps() {
		const lReponse =
			await new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
				this,
			).lancerRequete({
				ressource: this.ressource,
				numeroSemaine: this.numeroSemaine,
			});
		this.listeCours = lReponse.listeCours;
		this._actualiserGrille();
		this.setEtatIdCourant(true);
		if (this.getInstance(this.IdentCalendrier).estUneInteractionUtilisateur()) {
			this.setFocusIdCourant();
		}
	}
	_actionSurRequeteFicheCDT(aGenreAffichageEDT, aCahierDeTextes) {
		UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
			this,
			{
				cahiersDeTextes: aCahierDeTextes,
				genreAffichage: aGenreAffichageEDT,
				gestionnaire: GestionnaireBlocCDT_2.GestionnaireBlocCDT,
			},
			{ evenementSurBlocCDT: this.evenementSurBlocCDT },
		);
	}
	evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM:
				this.surExecutionQCMContenu(aParam.event, aElement);
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{ pere: this, evenement: this._evenementFenetreTAFFaits },
					aElement,
				);
				break;
			default:
				break;
		}
	}
	surExecutionQCMContenu(aEvent, aExecutionQCM) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.identFenetreVisuQCM),
			aExecutionQCM,
			true,
		);
	}
	_evenementFenetreTAFFaits(aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_2.TypeBoutonFenetreTAFFaits.Fermer
		) {
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._actionSurRequeteFicheCDT.bind(this),
			).lancerRequete(this.paramFicheCDT);
		}
	}
	valider(aCours) {
		const lListeCahierDeTextes = new ObjetListeElements_1.ObjetListeElements();
		lListeCahierDeTextes.addElement(aCours.cahierDeTextes);
		if (
			aCours.cahierDeTextes.listeContenus &&
			!aCours.cahierDeTextes.listeContenus.verifierAvantValidation
		) {
			aCours.cahierDeTextes.listeContenus.verifierAvantValidation =
				ObjetDeserialiser_1.ObjetDeserialiser._verifierAvantValidation;
		}
		if (
			aCours.cahierDeTextes.ListeTravailAFaire &&
			!aCours.cahierDeTextes.ListeTravailAFaire.verifierAvantValidation
		) {
			aCours.cahierDeTextes.ListeTravailAFaire.verifierAvantValidation =
				ObjetDeserialiser_1.ObjetDeserialiser._verifierAvantValidation;
		}
		this.etatUtilisateur.setNavigationCours(aCours);
		new ObjetRequeteSaisieCahierDeTextes_1.ObjetRequeteSaisieCahierDeTextes(
			this,
			this.actionSurValidation,
		).lancerRequete(
			aCours.Numero,
			this.numeroSemaine,
			null,
			null,
			null,
			lListeCahierDeTextes,
		);
	}
	evenementSurVisuEleve() {}
	fermerFenetreCDT() {
		if (this.fenetreCDT) {
			this.fenetreCDT.fermer();
		}
	}
	evenementSurCalendrier(
		ASelection,
		ABidon,
		AGenreDomaineInformation,
		aEstDansPeriodeConsultation,
		AIsToucheSelection,
	) {
		this.fermerFenetreCDT();
		this.getInstance(this.IdentGrille).fermerFenetreMS();
		if (AIsToucheSelection) {
			this.setIdCourant(
				this.getInstance(this.IdentGrille).getInstanceGrille().IdPremierElement,
			);
			this.setFocusIdCourant();
		} else {
			this.setIdCourant(this.Instances[this.IdentCalendrier].IdPremierElement);
			this.setEtatIdCourant(false);
			this.etatUtilisateur.setSemaineSelectionnee(ASelection);
			this.numeroSemaine = ASelection;
			if (
				AGenreDomaineInformation ===
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			) {
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.Aucune,
				);
				this.getInstance(this.IdentGrille).afficher(
					this.composeMessage(
						ObjetTraduction_1.GTraductions.getValeur("SemaineFeriee"),
					),
				);
				this.setEtatIdCourant(true);
			} else {
				this.requetePageEmploiDuTemps();
			}
		}
	}
	getContenuDraggable(aClassImage, aTexte) {
		const H = [];
		H.push(
			'<div class="flex-contain flex-center flex-gap ' +
				aClassImage +
				' p-left-xl">',
		);
		H.push(aTexte);
		H.push("</div>");
		return H.join("");
	}
	evenementSurCours(aParam) {
		const lParam = { genre: null, id: "", cours: null, indiceCours: -1 };
		$.extend(lParam, aParam);
		switch (lParam.genre) {
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMouseEnterCours: {
				if (this.draggable) {
					if (!this._ancienContenuDrag) {
						this._ancienContenuDrag = this.draggable.contenuHtml;
					}
					this.getInstance(
						this.IdentGrille,
					).actualisationSelectionSurGrillesDeCours(null);
					if (!lParam.cours.utilisable || lParam.cours.coursMultiple) {
						this.draggable.setContenuHtml(
							this.getContenuDraggable(
								"Image_Arbre_Drag_Interdit",
								_ObjetDonneesTreeView_1.TradTreeview.interdit,
							),
						);
					} else if (lParam.cours.AvecVisa) {
						this.draggable.setContenuHtml(
							this.getContenuDraggable(
								"Image_Arbre_Drag_Interdit",
								_ObjetDonneesTreeView_1.TradTreeview.interdit +
									" : " +
									ObjetTraduction_1.GTraductions.getValeur(
										"progression.LeCahierEstVerrouille",
									),
							),
						);
					} else {
						if (!lParam.cours.coursOrigine) {
							this.getInstance(this.IdentGrille)
								.getInstanceGrille()
								.selectionnerElementParIndice(lParam.indiceCours);
						}
						this.getInstance(
							this.IdentGrille,
						).actualisationSelectionSurGrillesDeCours(lParam.cours, true);
						this.etatUtilisateur.setNavigationCours(
							lParam.cours.coursOrigine
								? lParam.cours.coursOrigine
								: lParam.cours,
						);
						this.draggable.setContenuHtml(
							this.getContenuDraggable(
								"Image_Arbre_Drag_Inclusion",
								ObjetTraduction_1.GTraductions.getValeur(
									"progression.Affecter",
								),
							),
						);
					}
				}
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMouseLeaveCours: {
				if (this.draggable) {
					this.etatUtilisateur.setNavigationCours(null);
					this.getInstance(
						this.IdentGrille,
					).actualisationSelectionSurGrillesDeCours(null);
					this.draggable.setContenuHtml(this._ancienContenuDrag);
				}
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours: {
				this.fermerFenetreCDT();
				this.etatUtilisateur.setNavigationCours(
					lParam.cours.coursOrigine ? lParam.cours.coursOrigine : lParam.cours,
				);
				if (this.draggable) {
					if (
						lParam.cours &&
						!lParam.cours.AvecVisa &&
						lParam.cours.utilisable &&
						this.draggable.source &&
						this.draggable.source.contenu
					) {
						this.getInstance(
							this.IdentGrille,
						).actualisationSelectionSurGrillesDeCours(lParam.cours);
						this._dropDuContenuSurLeCours(this.draggable.source, lParam.cours);
					} else if (
						lParam.cours &&
						(lParam.cours.AvecVisa || !lParam.cours.utilisable)
					) {
						this.etatUtilisateur.setNavigationCours(null);
						this.getInstance(
							this.IdentGrille,
						).actualisationSelectionSurGrillesDeCours(null);
					}
				} else {
					if (
						ObjetNavigateur_1.Navigateur.BoutonSouris !==
						Enumere_BoutonSouris_1.EGenreBoutonSouris.Gauche
					) {
						const lInstanceMenu = this.getInstance(this.IdentMenuContextuel);
						if (lParam.cours.coursMultiple) {
						} else {
							this.fermerFenetreCDT();
							const lAvecCDT =
								lParam.cours &&
								lParam.cours.utilisable &&
								!!lParam.cours.cahierDeTextes &&
								!!lParam.cours.cahierDeTextes.existeNumero();
							lInstanceMenu.vider();
							lInstanceMenu.addCommande(
								InterfacePageAffectationProgression.genreMenuContextuelCours
									.visualiserCDT,
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.VisualisationCahierDeTexte",
								),
								lAvecCDT,
								lParam.cours,
							);
							lInstanceMenu.addCommande(
								InterfacePageAffectationProgression.genreMenuContextuelCours
									.editerCDT,
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.NaviguationCahierTexte",
								),
								lAvecCDT,
							);
							lInstanceMenu.addCommande(
								InterfacePageAffectationProgression.genreMenuContextuelCours
									.supprimerCDT,
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.SupprimerCahierTexte",
								),
								lAvecCDT && !lParam.cours.AvecVisa,
								lParam.cours,
							);
							lInstanceMenu.addSeparateur();
							lInstanceMenu.addCommande(
								InterfacePageAffectationProgression.genreMenuContextuelCours
									.affecterCDT,
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.AffecterContenuAuCours",
								),
								lParam.cours.utilisable &&
									!!this._nodeSelectionne &&
									!lParam.cours.AvecVisa,
								lParam.cours,
							);
							lInstanceMenu.afficher();
						}
					}
					this.getInstance(
						this.IdentGrille,
					).actualisationSelectionSurGrillesDeCours(lParam.cours);
				}
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage:
				if (lParam.genreImage === 1) {
					this.paramFicheCDT = {
						pourCDT: true,
						cours: lParam.cours,
						numeroSemaine: this.etatUtilisateur.getSemaineSelectionnee(),
					};
					new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
						this,
						this._actionSurRequeteFicheCDT.bind(this),
					).lancerRequete(this.paramFicheCDT);
				} else if (lParam.genreImage === 2) {
					this.paramFicheCDT = {
						pourTAF: true,
						cours: lParam.cours,
						numeroSemaine: this.etatUtilisateur.getSemaineSelectionnee(),
					};
					new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
						this,
						this._actionSurRequeteFicheCDT.bind(this),
					).lancerRequete(this.paramFicheCDT);
				}
				break;
			default:
				break;
		}
	}
	evenementSurMenuContextuel(ALigne) {
		if (ALigne) {
			switch (ALigne.Numero) {
				case InterfacePageAffectationProgression.genreMenuContextuelCours
					.visualiserCDT:
					this.paramFicheCDT = {
						pourCDT: true,
						cours: ALigne.data,
						numeroSemaine: this.etatUtilisateur.getSemaineSelectionnee(),
					};
					new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
						this,
						this._actionSurRequeteFicheCDT.bind(this),
					).lancerRequete(this.paramFicheCDT);
					break;
				case InterfacePageAffectationProgression.genreMenuContextuelCours
					.editerCDT:
					Invocateur_1.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.navigationOnglet,
						Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes,
					);
					return;
				case InterfacePageAffectationProgression.genreMenuContextuelCours
					.supprimerCDT:
					this.applicationSco.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ConfirmerSuppressionCDT",
						),
						callback: (aNumeroBouton) => {
							if (aNumeroBouton === 0) {
								const lCours = ALigne.data;
								lCours.cahierDeTextes.setEtat(
									Enumere_Etat_1.EGenreEtat.Suppression,
								);
								this.valider(lCours);
							}
						},
					});
					break;
				case InterfacePageAffectationProgression.genreMenuContextuelCours
					.affecterCDT:
					if (
						this.etatUtilisateur.getNavigationCours() &&
						this._nodeSelectionne
					) {
						this._dropDuContenuSurLeCours(this._nodeSelectionne, ALigne.data);
					} else {
					}
					break;
			}
		}
	}
	_getLargeurTreeView() {
		return (document.body.scrollWidth * 30) / 100;
	}
	surResizeInterface() {
		super.surResizeInterface();
		this.getInstance(this.IdentCalendrier).surPostResize();
		this.fermerFenetreCDT();
	}
	_initSelectionProgression(aInstance) {
		aInstance.setOptionsSelectionProgression({
			nonEditable: true,
			cssConteneur: "isp_affectationCDT",
			selectionTreeView: (aItem, aNode) => {
				this._nodeSelectionne = aNode;
			},
			callbackDragNode: (aNode) => {
				this.draggable = aNode;
				if (this.draggable) {
					this.fermerFenetreCDT();
					this.etatUtilisateur.setNavigationCours(null);
					this.getInstance(this.IdentGrille)
						.getInstanceGrille()
						.deselectionnerElement();
				}
			},
		});
	}
	_actualiserGrille() {
		this.getInstance(this.IdentGrille).setDonnees({
			numeroSemaine: this.etatUtilisateur.getSemaineSelectionnee(),
			listeCours: this.listeCours,
			avecCoursAnnule: this.etatUtilisateur.getAvecCoursAnnule(),
		});
		if (this.etatUtilisateur.getNavigationCours()) {
			this.getInstance(this.IdentGrille)
				.getInstanceGrille()
				.selectionnerCours(this.etatUtilisateur.getNavigationCours(), false);
		}
	}
	_surFinDropDuContenuSurLeCours(
		aNode,
		aCours,
		aContenuARemplacer,
		aFuncCreationElement,
		aNumeroBouton,
	) {
		if (aNumeroBouton !== 0) {
			return;
		}
		if (aCours.cahierDeTextes && aCours.cahierDeTextes.existeNumero()) {
			aCours.cahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		} else {
			aCours.cahierDeTextes = new ObjetElement_1.ObjetElement();
			aCours.cahierDeTextes.publie = false;
			aCours.cahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		}
		let lNomListe = "";
		switch (aNode.contenu.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.ContenuDeCours:
				lNomListe = "listeContenus";
				break;
			case Enumere_Ressource_1.EGenreRessource.TravailAFaire:
				lNomListe = "ListeTravailAFaire";
				break;
			default:
		}
		aCours.cahierDeTextes[lNomListe] =
			new ObjetListeElements_1.ObjetListeElements();
		const lNouveauContenu = aFuncCreationElement();
		lNouveauContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		lNouveauContenu.referenceProgression = aNode.contenu;
		lNouveauContenu.copieReference = true;
		aCours.cahierDeTextes[lNomListe].addElement(lNouveauContenu);
		if (aContenuARemplacer) {
			aContenuARemplacer.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			aCours.cahierDeTextes[lNomListe].addElement(aContenuARemplacer);
		}
		this.valider(aCours);
	}
	async _reponseRequeteApresDropCours(aNode, aCours, aJSONReponse) {
		let lTitre;
		let H = [];
		let lControleur;
		let lFuncCreationElement = null;
		if (
			aNode.contenu.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.TravailAFaire
		) {
			let lAccepte =
				await UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.autoriserCreationTAF({
					ajoutNouveauTAFInterdit: aJSONReponse.ajoutNouveauTAFInterdit,
					messageSurNouveauTAF: aJSONReponse.messageSurNouveauTAF,
				});
			if (!lAccepte) {
				return;
			}
		}
		switch (aNode.contenu.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.ContenuDeCours: {
				lTitre = aJSONReponse.contenuRemplace
					? ObjetTraduction_1.GTraductions.getValeur(
							"progression.MsgDejaAffecteAuCours",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"progression.MsgAffecteAuCours",
						);
				let lNbChoix = 1;
				if (aNode.pere) {
					lNbChoix++;
					if (aNode.pere.pere) {
						lNbChoix++;
					}
				}
				lControleur = {
					rb: {
						getValue(aIndice) {
							return (
								InterfacePageAffectationProgression.indiceChoixTitreProgression ===
								aIndice
							);
						},
						setValue(aIndice) {
							InterfacePageAffectationProgression.indiceChoixTitreProgression =
								aIndice;
						},
					},
				};
				H = [];
				H.push(
					'<div class="EspaceBas">',
					ObjetTraduction_1.GTraductions.getValeur(
						"progression.MsgOptionsTitreElement",
					),
					"</div>",
				);
				H.push('<div class="GrandEspaceGauche">');
				for (let i = 0; i < lNbChoix; i++) {
					H.push(
						'<div class="PetitEspaceBas"><ie-radio ie-model="rb(',
						i,
						')" class="NoWrap">',
						ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
							aNode,
							i,
						),
						"</ie-radio></div>",
					);
				}
				H.push("</div>");
				lFuncCreationElement = function () {
					return new ObjetElement_1.ObjetElement(
						ObjetDonneesTreeViewProgression_1._ObjetDonneesTreeViewProgression.getLibelleSelonChoix(
							aNode,
							InterfacePageAffectationProgression.indiceChoixTitreProgression,
						),
					);
				};
				break;
			}
			case Enumere_Ressource_1.EGenreRessource.TravailAFaire: {
				lTitre = aJSONReponse.contenuRemplace
					? ObjetTraduction_1.GTraductions.getValeur(
							"progression.MsgTAFDejaAffecteAuCours",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"progression.MsgAffecteTAFAuCours",
						);
				const lThis = this;
				let lDatePourLe = aJSONReponse.dateTAF;
				lControleur = {
					celluleDate() {
						return {
							class: ObjetCelluleDate_1.ObjetCelluleDate,
							pere: lThis,
							start(aInstance) {
								aInstance.setParametresFenetre(
									lThis.objetParametres.PremierLundi,
									aCours.DateDuCours,
									lThis.objetParametres.DerniereDate,
									lThis.objetParametres.JoursOuvres,
									null,
									lThis.objetParametres.JoursFeries,
									null,
									aJSONReponse.joursPresenceCours,
								);
								aInstance.setOptionsFenetre({
									prioriteBlocageAbonnement:
										GestionnaireModale_1.GestionnaireModale
											.TypePrioriteBlocageInterface.message,
								});
								aInstance.setPremiereDateSaisissable(aCours.DateDuCours, true);
								aInstance.setDonnees(lDatePourLe);
							},
							evenement(aDate) {
								lDatePourLe = aDate;
							},
						};
					},
				};
				H.push(
					'<div class="InlineBlock AlignementMilieuVertical PetitEspaceDroit">',
					ObjetTraduction_1.GTraductions.getValeur("progression.TAFPourLe"),
					"</div>",
				);
				H.push(
					'<div class="InlineBlock AlignementMilieuVertical" ie-identite="celluleDate"></div>',
				);
				lFuncCreationElement = () => {
					const lElement = new ObjetElement_1.ObjetElement(
						aNode.contenu.getLibelle(),
					);
					lElement.PourLe = lDatePourLe;
					lElement.niveauDifficulte =
						this.applicationSco.parametresUtilisateur.get(
							"CDT.TAF.NiveauDifficulte",
						);
					lElement.duree =
						this.applicationSco.parametresUtilisateur.get("CDT.TAF.Duree");
					lElement.genreRendu =
						TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu;
					return lElement;
				};
				break;
			}
			default:
				return;
		}
		this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: lTitre,
				message: H.join(""),
				controleur: lControleur,
				callback: this._surFinDropDuContenuSurLeCours.bind(
					this,
					aNode,
					aCours,
					aJSONReponse.contenuRemplace,
					lFuncCreationElement,
				),
			});
	}
	_dropDuContenuSurLeCours(aNode, aCours) {
		new ObjetRequeteListeCDTProgressions_1.ObjetRequeteListeCDTProgressions(
			this,
			this._reponseRequeteApresDropCours.bind(this, aNode, aCours),
		).lancerRequete({
			contenuPourAffectationAuCours: aNode.contenu,
			Cours: aCours,
			NumeroCycle: this.etatUtilisateur.getSemaineSelectionnee(),
		});
	}
}
exports.InterfacePageAffectationProgression =
	InterfacePageAffectationProgression;
InterfacePageAffectationProgression.genreMenuContextuelCours = {
	visualiserCDT: 0,
	supprimerCDT: 1,
	editerCDT: 2,
	affecterCDT: 3,
};
InterfacePageAffectationProgression.indiceChoixTitreProgression = 0;
