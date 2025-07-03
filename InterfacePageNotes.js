exports.InterfacePageNotes = void 0;
const PanelDetailServiceNotationPN_1 = require("PanelDetailServiceNotationPN");
const ObjetFenetre_DevoirPN_1 = require("ObjetFenetre_DevoirPN");
const ObjetFenetre_Devoir_1 = require("ObjetFenetre_Devoir");
const ObjetFenetre_MethodeCalculMoyenne_1 = require("ObjetFenetre_MethodeCalculMoyenne");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EleveDansDevoir_1 = require("Enumere_EleveDansDevoir");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementNotesEtAppreciations_1 = require("Enumere_EvenementNotesEtAppreciations");
const Enumere_EvenementSaisieNotes_1 = require("Enumere_EvenementSaisieNotes");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_Periode_1 = require("ObjetFenetre_Periode");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeNote_1 = require("TypeNote");
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequetePageNotes_1 = require("ObjetRequetePageNotes");
const ObjetRequeteSaisieNotes_1 = require("ObjetRequeteSaisieNotes");
const ObjetFenetre_CompetencesParEvaluation_1 = require("ObjetFenetre_CompetencesParEvaluation");
const ObjetFenetre_ParamSaisieNotes_1 = require("ObjetFenetre_ParamSaisieNotes");
const ObjetRequeteSaisieNotesUnitaire_1 = require("ObjetRequeteSaisieNotesUnitaire");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Annotation_1 = require("Enumere_Annotation");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_PageNotes_1 = require("DonneesListe_PageNotes");
const DonneesListe_PageNotesPN_1 = require("DonneesListe_PageNotesPN");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const Enumere_Action_1 = require("Enumere_Action");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetUtilitaireDevoir_1 = require("ObjetUtilitaireDevoir");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const AccessApp_1 = require("AccessApp");
class InterfacePageNotes extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appScoEspace.getEtatUtilisateur();
		this.ordreDevoir = 100;
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.optionsAffichageListe = {
			afficherProjetsAccompagnement: false,
			afficherMoyenneBrute: false,
		};
	}
	construireInstances() {
		this.IdentTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			(aListe) => {
				aListe.setOptionsListe({
					ariaLabel: () => {
						var _a, _b, _c;
						return `${this.etatUtilSco.getLibelleLongOnglet()} ${((_a = this.etatUtilSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Classe)) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${((_b = this.etatUtilSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Periode)) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ""} ${((_c = this.etatUtilSco.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Service)) === null || _c === void 0 ? void 0 : _c.getLibelle()) || ""}`.trim();
					},
				});
			},
		);
		this.identFicheService = this.add(
			PanelDetailServiceNotationPN_1.PanelDetailServiceNotationPN,
			this.evenementSurFicheService,
			this.initialiserFicheService,
		);
		this.IdentFenetreDevoir = this.add(
			ObjetFenetre_DevoirPN_1.ObjetFenetre_DevoirPN,
			this.evenementSurFenetreDevoir,
			this.initialiserFenetreDevoir,
		);
		this.identFenetrePeriode = this.addFenetre(
			ObjetFenetre_Periode_1.ObjetFenetre_Periode,
			this.evenementSurFenetrePeriode,
			this.initialiserFenetrePeriode,
		);
		this.identFenetreParametresAffichage = this.add(
			ObjetFenetre_ParamSaisieNotes_1.ObjetFenetre_ParamSaisieNotes,
			this._evenementSurFenetreParametresAffichage,
			this._initialiserFenetreParametresAffichage,
		);
		this.identFenetreMethodeCalculMoyenne = this.add(
			ObjetFenetre_MethodeCalculMoyenne_1.ObjetFenetre_MethodeCalculMoyenne,
			this._gestionFocusApresFenetreCalculMoyenne,
			this.initialiserMethodeCalculMoyenne,
		);
		if (
			this.IdentTripleCombo !== null &&
			this.IdentTripleCombo !== undefined &&
			this.getInstance(this.IdentTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.IdentTripleCombo,
			).getPremierElement();
		}
		this.identFenetreCompetences = this.addFenetre(
			ObjetFenetre_CompetencesParEvaluation_1.ObjetFenetre_CompetencesParEvaluation,
			this._evenementFenetreCompetences.bind(this),
		);
		this.construireFicheEleveEtFichePhoto();
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.IdentTripleCombo);
		this.AddSurZone.push({ html: '<span ie-html="getInfoCloture"></span>' });
		this.AddSurZone.push({ blocGauche: true });
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnTriOrdreChronologique(
				this.jsxModeleBoutonTriDevoir.bind(this),
			),
		});
		this.AddSurZone.push({
			html: IE.jsx.str("ie-btnicon", {
				"ie-model": "btnAfficherMonsieurFiche",
				class: "bt-activable icon_legende",
				title: ObjetTraduction_1.GTraductions.getValeur("Notes.Bouton.Aide"),
				"aria-haspopup": "dialog",
			}),
		});
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				"btnOptionsAffichage",
			),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols flex-gap-l p-all-l" },
				IE.jsx.str("div", {
					id: this.getInstance(this.identListe).getNom(),
					class: "fluid-bloc",
				}),
				IE.jsx.str("div", {
					id: this.getInstance(this.identFicheService).getNom(),
					class: "fix-bloc",
				}),
			),
		);
		return H.join("");
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.identFicheService).getNom(),
			false,
		);
		this.getInstance(this.identListe).effacer();
		this._evenementAfficherMessage(aGenreMessage);
	}
	jsxModeleBoutonTriDevoir() {
		return {
			event: () => {
				this.etatUtilSco.inverserTriDevoirs();
				if (this.identFenetreMethodeCalculMoyenne) {
					const lFenetre = this.getInstance(
						this.identFenetreMethodeCalculMoyenne,
					);
					if (lFenetre.estAffiche()) {
						const l1 = { ordreChronologique: this.etatUtilSco.getTriDevoirs() };
						const l2 = $.extend({}, lFenetre.getParametresCalcul(), l1);
						lFenetre.setDonnees(l2);
					}
				}
				this.actualiser();
			},
			getTitle: () => {
				if (this.etatUtilSco.getTriDevoirs()) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Bouton.OrdreChronologiqueInverse",
					);
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"Notes.Bouton.OrdreChronologique",
				);
			},
			getSelection: () => {
				return this.etatUtilSco.getTriDevoirs();
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getInfoCloture: function () {
				return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
			},
			btnAfficherMonsieurFiche: {
				event() {
					aInstance.appScoEspace
						.getMessage()
						.afficher({
							idRessource: TypeNote_1.TypeNote.estAnnotationPermise(
								Enumere_Annotation_1.EGenreAnnotation.absentZero,
							)
								? "Notes.MFicheNotationSpecifiqueWetZ"
								: "Notes.MFicheNotationSpecifique",
						});
				},
			},
			btnOptionsAffichage: {
				event() {
					const lFenetreOptionsAffichage = aInstance.getInstance(
						aInstance.identFenetreParametresAffichage,
					);
					lFenetreOptionsAffichage.setDonnees(aInstance.optionsAffichageListe);
					lFenetreOptionsAffichage.afficher();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Notes.parametresAffichage",
					);
				},
				getSelection() {
					return aInstance
						.getInstance(aInstance.identFenetreParametresAffichage)
						.estAffiche();
				},
			},
		});
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
				Enumere_Ressource_1.EGenreRessource.Service,
			],
			true,
		);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	initialiserMethodeCalculMoyenne(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.TitreFenetreCalculMoyenne",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			largeurMin: 600,
			hauteurMin: 150,
		});
	}
	initialiserFicheService(aInstance) {
		aInstance.setVisible(false);
	}
	initialiserFenetreDevoir(aInstance) {
		aInstance.avecSelectionService = true;
	}
	initialiserFenetrePeriode(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Notes.SelectionnerPeriode",
			),
		});
	}
	getPageImpression(aProportion) {
		this.actualiser(null, true);
		let lProportion = 100;
		switch (aProportion) {
			case 0:
				lProportion = 140;
				break;
			case 1:
				lProportion = 120;
				break;
			case 2:
				lProportion = 100;
				break;
			case 3:
				lProportion = 80;
				break;
		}
		const lImpression = {
			titre1: this.etatUtilSco.getLibelleImpression(
				ObjetTraduction_1.GTraductions.getValeur("Notes.TitreImpression"),
				true,
				true,
				false,
				true,
				true,
			),
			contenu: this.getInstance(this.identListe).composeImpression(lProportion),
			legende: this.composeLegendePageImpression(this.listeDevoirs),
		};
		this.actualiser(null, false);
		return lImpression;
	}
	evenementSurDernierMenuDeroulant(
		aClasse,
		aPeriode,
		aService,
		aMatiere,
		aProfesseur,
	) {
		this.Classe = aClasse;
		this.Periode = aPeriode;
		this.Service = aService;
		this.Matiere = aMatiere;
		this.Professeur = aProfesseur;
		this.LibelleRessource = aClasse.getLibelle();
		this.NumeroRessource = aClasse.getNumero();
		this.GenreRessource = aClasse.getGenre();
		this.periode = aPeriode;
		this.LibelleService = aService.getLibelle();
		this.NumeroService = aService.getNumero();
		this.afficherPage();
	}
	evenementSurListe(aParamEvnt) {
		switch (aParamEvnt.genreEvnt) {
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
				.EditionDevoir: {
				const lFenetreDevoir = this.getInstance(this.IdentFenetreDevoir);
				const lListeBoutons = [];
				if (this.Service.getActif()) {
					lListeBoutons.push(
						ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
						"",
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						ObjetTraduction_1.GTraductions.getValeur("Valider"),
						"",
					);
				} else {
					lListeBoutons.push(
						"",
						"",
						ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
						"",
						"",
					);
				}
				lFenetreDevoir.setOptionsFenetre({ listeBoutons: lListeBoutons });
				const lCloture = this.leDevoirEstCloturePourNotation(aParamEvnt.devoir);
				lFenetreDevoir.setActif(this.Service.getActif(), lCloture, lCloture);
				lFenetreDevoir.avecSelectionService = false;
				lFenetreDevoir.setDonnees(
					aParamEvnt.devoir,
					false,
					null,
					this.baremeService,
					true,
					this.listeCategories,
				);
				break;
			}
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
				.SurDeselection:
				this.surDeselection(aParamEvnt);
				break;
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
				.CreationDevoir: {
				this._objGestionFocus_apresFenetreDevoir = {
					id: this.getInstance(this.identListe).getDonneesListe()
						.idBtnCreerDevoir,
				};
				this.getInstance(this.IdentFenetreDevoir).setOptionsFenetre({
					listeBoutons: [
						"",
						"",
						ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						"",
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur("Notes.Creer"),
							theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
						},
					],
				});
				let lListeService = null,
					lServiceDefaut = null;
				if (
					this.Service.estUnService &&
					this.Service.listeServices.count() > 0
				) {
					this.getInstance(this.IdentFenetreDevoir).avecSelectionService = true;
					lListeService = this.Service.listeServices;
					if (this.Service.estCoEnseignement) {
						const lThis = this,
							lListeServiceFiltre = lListeService.getListeElements((aEle) => {
								return lThis.Professeur
									? aEle.professeur.getNumero() === lThis.Professeur.getNumero()
									: aEle.professeur.getNumero() ===
											this.etatUtilSco.getUtilisateur().getNumero();
							});
						lServiceDefaut = lListeServiceFiltre.get(0);
					}
					if (!lServiceDefaut) {
						lServiceDefaut = lListeService.get(0);
					}
				} else {
					this.getInstance(this.IdentFenetreDevoir).avecSelectionService =
						false;
				}
				this.getInstance(this.IdentFenetreDevoir).setDonnees(
					this.creerDevoirParDefaut(lServiceDefaut),
					true,
					lListeService,
					this.baremeService,
					true,
					this.listeCategories,
				);
				break;
			}
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
				.Competences: {
				if (aParamEvnt.devoir.evaluation) {
					const lOptionsAffichage = this.getInstance(this.identListe)
						.getDonneesListe()
						.getOptionsAffichage();
					const lAvecSaisieNotes = !this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
					this.getInstance(
						this.identFenetreCompetences,
					).setEstFenetreEditionCommentaireSurNoteUniquement(false);
					this.getInstance(this.identFenetreCompetences).setDonnees(
						{
							devoir: aParamEvnt.devoir,
							classe: this.etatUtilSco.Navigation.getRessource(
								Enumere_Ressource_1.EGenreRessource.Classe,
							),
							droitSaisieNotes: lAvecSaisieNotes,
						},
						{
							afficherProjetsAccompagnement:
								lOptionsAffichage.afficherProjetsAccompagnement,
							afficherCommentaireSurNote:
								!!aParamEvnt.devoir.avecCommentaireSurNoteEleve,
						},
					);
				}
				break;
			}
			case Enumere_EvenementNotesEtAppreciations_1
				.EGenreEvenementNotesEtAppreciations.MethodeCalculMoyenne: {
				let lClasse = aParamEvnt.classe
					? aParamEvnt.classe
					: this.etatUtilSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						);
				if (
					lClasse !== null &&
					lClasse !== undefined &&
					lClasse.getNumero() === -1 &&
					lClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Aucune
				) {
					let lEleve = aParamEvnt.eleve;
					lClasse = lEleve.classe;
				}
				const lPeriode = aParamEvnt.periode
					? aParamEvnt.periode
					: this.etatUtilSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Periode,
						);
				const lService = aParamEvnt.service
					? aParamEvnt.service
					: this.etatUtilSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Service,
						);
				const lParametresCalcul = {
					libelleEleve: aParamEvnt.eleve.getLibelle(),
					numeroEleve: aParamEvnt.eleve.getNumero(),
					libelleClasse: lClasse.getLibelle(),
					numeroClasse: lClasse.getNumero(),
					libelleServiceNotation: lService.getLibelle(),
					numeroServiceNotation: lService.getNumero(),
					numeroPeriodeNotation: lPeriode.getNumero(),
					genreChoixNotation: lPeriode.getGenre(),
					moyenneTrimestrielle: true,
					pourMoyenneNette: aParamEvnt.estMoyenneNette,
					ordreChronologique: this.etatUtilSco.getTriDevoirs(),
				};
				if (this.identFenetreMethodeCalculMoyenne) {
					this.getInstance(this.identFenetreMethodeCalculMoyenne).setDonnees(
						lParametresCalcul,
					);
				}
				break;
			}
			case Enumere_EvenementNotesEtAppreciations_1
				.EGenreEvenementNotesEtAppreciations.SelectionLigne: {
				this.etatUtilSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
					aParamEvnt.eleve,
				);
				this.surSelectionEleve(true);
				break;
			}
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes.Import: {
				break;
			}
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
				.CommentaireSurNote: {
				if (aParamEvnt.devoir.avecCommentaireSurNoteEleve) {
					const lOptionsAffichage = this.getInstance(this.identListe)
						.getDonneesListe()
						.getOptionsAffichage();
					const lAvecSaisieNotes = !this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					);
					this.getInstance(
						this.identFenetreCompetences,
					).setEstFenetreEditionCommentaireSurNoteUniquement(true);
					this.getInstance(this.identFenetreCompetences).setDonnees(
						{
							devoir: aParamEvnt.devoir,
							droitSaisieNotes: lAvecSaisieNotes,
							baremeParDefaut: this.baremeParDefaut,
						},
						{
							afficherProjetsAccompagnement:
								lOptionsAffichage.afficherProjetsAccompagnement,
							afficherCommentaireSurNote:
								!!aParamEvnt.devoir.avecCommentaireSurNoteEleve,
						},
					);
				}
				break;
			}
			case Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
				.EditionCommentaireSurNote: {
				if (aParamEvnt.eleveDeDevoir) {
					this._ouvrirFenetreCommentaireSurNote(aParamEvnt);
				}
				break;
			}
			default: {
				switch (aParamEvnt.genreEvenement) {
					case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
						switch (aParamEvnt.idColonne) {
							case DonneesListe_PageNotes_1.DonneesListe_PageNotes.colonnes
								.moyNR: {
								const lEleve = aParamEvnt.article;
								if (lEleve.estMoyNREditable) {
									if (!lEleve.estMoyNR) {
										this.appScoEspace.getMessage().afficher({
											type: Enumere_BoiteMessage_1.EGenreBoiteMessage
												.Confirmation,
											titre: ObjetTraduction_1.GTraductions.getValeur(
												"Notes.TitreConfirmationMoyNR",
											),
											message: ObjetTraduction_1.GTraductions.getValeur(
												"Notes.ConfirmationMoyNR",
											),
											callback: (aGenreAction) => {
												if (
													aGenreAction === Enumere_Action_1.EGenreAction.Valider
												) {
													this._basculerMoyNRDEleve(lEleve);
												}
											},
										});
									} else {
										this._basculerMoyNRDEleve(lEleve);
									}
								}
								break;
							}
							default:
								break;
						}
						break;
					}
					default:
						break;
				}
				break;
			}
		}
	}
	surDeselection(aParamEvnt) {
		if (
			this.appScoEspace.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		) {
			this.setEtatSaisie(true);
		}
		this.surModifContexteAffichage();
		if (
			!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			aParamEvnt.periode = this.Periode;
			aParamEvnt.service = this.Service;
			new ObjetRequeteSaisieNotesUnitaire_1.ObjetRequeteSaisieNotesUnitaire(
				this,
				() => {
					if (aParamEvnt && aParamEvnt.eleve) {
						aParamEvnt.eleve.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
						if (aParamEvnt.devoir && aParamEvnt.devoir.listeEleves) {
							const lEleveDuDevoir =
								aParamEvnt.devoir.listeEleves.getElementParNumero(
									aParamEvnt.eleve.getNumero(),
								);
							if (lEleveDuDevoir) {
								lEleveDuDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
							}
						}
					}
				},
			).lancerRequete(aParamEvnt);
		}
		if (aParamEvnt.avecActualisation) {
			const lInstanceListe = this.getInstance(this.identListe);
			if (aParamEvnt.ligneSuivante) {
				lInstanceListe.selectionnerCelluleSuivante({
					orientationVerticale: true,
					avecCelluleEditable: true,
					entrerEdition: false,
					avecSelection: false,
				});
			}
			const lSelectionCellule = lInstanceListe.getSelectionCellule();
			this.actualiser();
			lInstanceListe.demarrerEditionSurCellule(
				lSelectionCellule.ligne,
				lSelectionCellule.colonne,
			);
		}
	}
	surEvntMenusDeroulants(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
				.surOuvertureCombo:
				this.surModifContexteAffichage();
				break;
			case Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
				.ressourceNonTrouve:
				this.surRessourceCouranteNonTrouveeDansCombo(aParam);
				break;
		}
	}
	surModifContexteAffichage() {
		if (this.identFenetreMethodeCalculMoyenne) {
			const lFenetre = this.getInstance(this.identFenetreMethodeCalculMoyenne);
			if (lFenetre.estAffiche) {
				lFenetre.fermer();
			}
		}
	}
	evenementSurFicheService() {
		if (
			this.appScoEspace.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		) {
			this.setEtatSaisie(true);
		}
		this.surModifContexteAffichage();
		const lScrollTop = ObjetHtml_1.GHtml.getElement(this.Nom).scrollTop;
		const lCallbackApresReussite = () => {
			ObjetHtml_1.GHtml.getElement(this.Nom).scrollTop = lScrollTop;
		};
		if (
			this.appScoEspace.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)
		) {
			this.actualiser(lCallbackApresReussite);
		} else {
			this.valider(lCallbackApresReussite);
		}
	}
	synchroniserSujetEtCorrige(aDevoir) {
		const lSujet = aDevoir.listeSujets.get(0);
		if (lSujet) {
			lSujet.setNumero(aDevoir.getNumero());
			this.listeSujets.addElement(
				lSujet,
				this.listeSujets.getIndiceParNumeroEtGenre(aDevoir.getNumero()),
			);
		}
		const lCorrige = aDevoir.listeCorriges.get(0);
		if (lCorrige) {
			lCorrige.setNumero(aDevoir.getNumero());
			this.listeCorriges.addElement(
				lCorrige,
				this.listeCorriges.getIndiceParNumeroEtGenre(aDevoir.getNumero()),
			);
		}
	}
	evenementSurFenetreDevoir(aGenreEvenement, aParam) {
		const lDevoir = aParam.devoir;
		if (
			aGenreEvenement ===
			ObjetFenetre_Devoir_1.TypeCallbackFenetreDevoir.periode
		) {
			this.selection_ClasseDevoir = aParam.classe;
			this.selection_PeriodeDevoir = aParam.periode;
			const lClasse = this.listeClasses.getElementParNumero(
				aParam.classe.getNumero(),
			);
			this.getInstance(this.identFenetrePeriode).setDonnees(
				lClasse.listePeriodes,
				aParam.avecSansPeriode,
				false,
				false,
			);
		} else if (
			aGenreEvenement ===
			ObjetFenetre_Devoir_1.TypeCallbackFenetreDevoir.validation
		) {
			switch (aParam.bouton) {
				case this.getInstance(this.IdentFenetreDevoir).genreBouton.annuler: {
					break;
				}
				case this.getInstance(this.IdentFenetreDevoir).genreBouton.supprimer: {
					this.listeDevoirs.addElement(
						lDevoir,
						this.listeDevoirs.getIndiceParElement(lDevoir),
					);
					lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					break;
				}
				case this.getInstance(this.IdentFenetreDevoir).genreBouton.valider: {
					this.listeDevoirs.addElement(
						lDevoir,
						this.listeDevoirs.getIndiceParElement(lDevoir),
					);
					this.synchroniserSujetEtCorrige(lDevoir);
					for (let i = 0; i < lDevoir.listeEleves.count(); i++) {
						const lEleve = lDevoir.listeEleves.get(i);
						if (lEleve.Note.getValeur() > lDevoir.bareme.getValeur()) {
							lEleve.Note = new TypeNote_1.TypeNote(lDevoir.bareme.getValeur());
							lEleve.setEtat(lDevoir.Modification);
						}
					}
					lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					break;
				}
				case this.getInstance(this.IdentFenetreDevoir).genreBouton.creer: {
					if (lDevoir.service && lDevoir.service.listeEleves) {
						lDevoir.listeEleves = this.creerDevoirParDefautListeEleves(
							lDevoir.service.listeEleves,
						);
					}
					lDevoir.ordre = this.ordreDevoir--;
					this.synchroniserSujetEtCorrige(lDevoir);
					this.listeDevoirs.addElement(lDevoir);
					break;
				}
			}
			if (
				MethodesObjet_1.MethodesObjet.isNumeric(aParam.bouton) &&
				aParam.bouton !== -1 &&
				aParam.bouton !==
					this.getInstance(this.IdentFenetreDevoir).genreBouton.annuler
			) {
				let lCallbackFocusApresSaisie;
				if (
					aParam.bouton ===
						this.getInstance(this.IdentFenetreDevoir).genreBouton.creer ||
					aParam.bouton ===
						this.getInstance(this.IdentFenetreDevoir).genreBouton.valider
				) {
					const lThis = this;
					const lBouton = aParam.bouton;
					let lNumeroDevoir =
						aParam.bouton ===
						this.getInstance(this.IdentFenetreDevoir).genreBouton.valider
							? aParam.devoir.getNumero()
							: 0;
					lCallbackFocusApresSaisie = function (aJSONReponseSaisie) {
						if (lNumeroDevoir === 0) {
							if (
								!!aJSONReponseSaisie &&
								!!aJSONReponseSaisie.listeDevoirsCrees &&
								aJSONReponseSaisie.listeDevoirsCrees.count() > 0
							) {
								const lDevoirCree =
									aJSONReponseSaisie.listeDevoirsCrees.getPremierElement();
								if (!!lDevoirCree) {
									lNumeroDevoir = lDevoirCree.getNumero();
								}
							} else {
							}
						}
						let lDevoirConcerne;
						if (!!lNumeroDevoir && !!lThis.listeDevoirs) {
							lDevoirConcerne =
								lThis.listeDevoirs.getElementParNumero(lNumeroDevoir);
						}
						if (!!lDevoirConcerne) {
							lThis._gestionFocusApresFenetreDevoir(lBouton, lDevoirConcerne);
						}
					};
				}
				if (
					this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					)
				) {
					this.actualiser();
					this.setEtatSaisie(true);
				}
				this.valider(lCallbackFocusApresSaisie);
			}
		} else if (
			aGenreEvenement ===
			ObjetFenetre_Devoir_1.TypeCallbackFenetreDevoir.service
		) {
			let lListeService = null;
			if (this.Service.estUnService && this.Service.listeServices.count() > 0) {
				this.getInstance(this.IdentFenetreDevoir).avecSelectionService = true;
				lListeService = this.Service.listeServices;
			} else {
				this.getInstance(this.IdentFenetreDevoir).avecSelectionService = false;
			}
			this.getInstance(this.IdentFenetreDevoir).setDonnees(
				this.creerDevoirParDefaut(aParam.service),
				true,
				lListeService,
				this.baremeService,
				true,
				this.listeCategories,
			);
		}
	}
	evenementSurFenetrePeriode(aGenreEvenement, aPeriodeDevoir) {
		switch (aGenreEvenement) {
			case 0: {
				break;
			}
			case 1: {
				if (
					this.selection_PeriodeDevoir.getNumero() !==
					aPeriodeDevoir.getNumero()
				) {
					if (
						this.selection_ClasseDevoir.listePeriodes.getElementParNumero(
							aPeriodeDevoir.getNumero(),
						) === null ||
						this.selection_ClasseDevoir.listePeriodes.getElementParNumero(
							aPeriodeDevoir.getNumero(),
						) === undefined
					) {
						this.selection_PeriodeDevoir.setNumero(aPeriodeDevoir.getNumero());
						this.selection_PeriodeDevoir.setLibelle(
							aPeriodeDevoir.existeNumero() ? aPeriodeDevoir.getLibelle() : "",
						);
						this.selection_PeriodeDevoir.setActif(true);
						this.selection_PeriodeDevoir.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						this.selection_PeriodeDevoir.estEvaluationCloturee =
							aPeriodeDevoir.estEvaluationCloturee;
					} else {
						this.appScoEspace
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"Notes.PeriodeDejaAffectee",
								),
							});
					}
				}
				this.getInstance(this.IdentFenetreDevoir).actualiser();
				break;
			}
		}
		this._gestionFocusApresFenetreSelectionPeriode();
	}
	afficherPage(aCallbackApresAffichage) {
		this.setEtatSaisie(false);
		this.afficherBandeau(true);
		const lParam = {
			numeroRessource: this.NumeroRessource,
			genreRessource: this.GenreRessource,
			numeroService: this.NumeroService,
			periode: this.periode,
		};
		new ObjetRequetePageNotes_1.ObjetRequetePageNotes(
			this,
			this.actionSurEvenementAfficherPage.bind(this, aCallbackApresAffichage),
		).lancerRequete(lParam);
	}
	actionSurEvenementAfficherPage(aCallbackApresAffichage, aParam) {
		this.afficherBandeau(true);
		this.strInfoCloture = aParam.strInfoCloture || "";
		this.serviceEntier = aParam.serviceEntier;
		this.autorisations = aParam.autorisations;
		this.Service = aParam.Service;
		this.listeClasses = aParam.listeClasses;
		this.listeEleves = aParam.listeEleves;
		this.listeDevoirs = aParam.listeDevoirs;
		this.listeSujets = aParam.listeSujets;
		this.listeCorriges = aParam.listeCorriges;
		this.listeCategories = aParam.listeCategories;
		this.baremeParDefaut = aParam.baremeParDefaut;
		this.baremeService = aParam.baremeService;
		this.avecColNR =
			aParam.avecColNR !== null && aParam.avecColNR !== undefined
				? aParam.avecColNR
				: false;
		this.actualiser(aCallbackApresAffichage);
	}
	actualiser(aCallbackApresAffichage, aPourImpression) {
		if (this.listeEleves && this.listeEleves.count()) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Format,
				this,
			);
			this.controlerElevesClotures();
			ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Bandeau", true);
			this.getInstance(this.identFicheService).setVisible(
				this.Periode.existeNumero(),
			);
			this.surResizeInterface();
			const lCloture = this.laPeriodeEstClotureePourNotation(
				this.Periode,
				this.Classe.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
					? this.Classe
					: null,
			);
			const lClotureGlobal = this.laPeriodeEstClotureePourNotation(
				this.Periode,
			);
			const lActifBoutonCreerDevoir =
				this.Service.getActif() &&
				this.periode.existeNumero() &&
				!lClotureGlobal;
			this.getInstance(this.identFicheService).setPanelDetailServiceActif(
				this.Service.getActif(),
				lCloture,
				lClotureGlobal,
			);
			this.getInstance(this.IdentFenetreDevoir).setActif(
				this.Service.getActif(),
				lCloture,
				lClotureGlobal,
			);
			this.listeDevoirs.setTri([
				ObjetTri_1.ObjetTri.init(
					"date",
					this.etatUtilSco.getTriDevoirs()
						? Enumere_TriElement_1.EGenreTriElement.Croissant
						: Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			]);
			this.listeDevoirs.trier();
			const lMatiereService = this.Service.matiere.getLibelle();
			const lAfficherMatiere =
				this.Service.estUnService &&
				this.Service.listeServices.count() > 0 &&
				this.Service.listeServices
					.getListeElements((aEle) => {
						return aEle.matiere.getLibelle() !== lMatiereService;
					})
					.count() > 0;
			this.getInstance(this.identListe).setDonnees(
				new DonneesListe_PageNotesPN_1.DonneesListe_PageNotesPN(
					{ listeEleves: this.listeEleves, listeDevoirs: this.listeDevoirs },
					{
						avecColonneClasse:
							this.Classe.getGenre() ===
								Enumere_Ressource_1.EGenreRessource.Groupe ||
							(this.Classe.getNumero() === -1 &&
								this.Classe.getGenre() ===
									Enumere_Ressource_1.EGenreRessource.Aucune &&
								!!this.Service &&
								this.Service.estUnServiceEnGroupe),
						matiere: this.Matiere,
						service: this.Service,
						periode: this.periode,
						listeClasses: this.listeClasses,
						forcerMoyenneBruteDevoir: false,
						forcerSansSousService: false,
						avecNomMatiere: lAfficherMatiere,
						avecTotal: false,
						baremeParDefaut: this.baremeService,
						avecNomProfesseur: false,
						callbackEvnt: this.evenementSurListe.bind(this),
						instance: this.getInstance(this.identListe),
						optionsAffichage: this.optionsAffichageListe,
						pourImpression: aPourImpression,
						avecImport: this.etatUtilSco.avecImports(),
						avecColNR: this.avecColNR,
					},
				),
			);
			this.getInstance(this.identListe)
				.getDonneesListe()
				.setActif(this.Service.getActif(), lActifBoutonCreerDevoir);
			this.activerFichesEleve(this.selectionnerEleveCourant());
			if (this.periode.getNumero()) {
				this.Instances[this.identFicheService].setDonnees(
					this.autorisations,
					this.Periode,
					this.Service,
				);
			}
		} else {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
			if (this.listeEleves) {
				this.evenementAfficherMessage(
					ObjetTraduction_1.GTraductions.getValeur("Notes.AucunEleve"),
				);
			}
		}
		if (
			!!aCallbackApresAffichage &&
			MethodesObjet_1.MethodesObjet.isFunction(aCallbackApresAffichage)
		) {
			aCallbackApresAffichage();
		}
	}
	valider(aCallbackApresSaisie) {
		const lListeSujetsEtCorriges =
			new ObjetListeElements_1.ObjetListeElements();
		lListeSujetsEtCorriges.add(this.listeSujets);
		lListeSujetsEtCorriges.add(this.listeCorriges);
		const lListeCloud = lListeSujetsEtCorriges.getListeElements((aElement) => {
			return (
				aElement.getGenre() ===
				Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
			);
		});
		new ObjetRequeteSaisieNotes_1.ObjetRequeteSaisieNotes(
			this,
			this._surSaisieNotes.bind(this, aCallbackApresSaisie),
		)
			.addUpload({
				listeFichiers: lListeSujetsEtCorriges,
				listeDJCloud: lListeCloud,
			})
			.lancerRequete({
				periode: this.Periode,
				service: this.Service,
				listeEleves: this.listeEleves,
				listeDevoirs: this.listeDevoirs,
				listeSujetsEtCorriges: lListeSujetsEtCorriges,
			});
	}
	creerDevoirParDefaut(aService) {
		const lDevoir = new ObjetElement_1.ObjetElement();
		lDevoir.service = aService || this.Service;
		lDevoir.estDevoirEditable = lDevoir.service.getActif();
		lDevoir.matiere = MethodesObjet_1.MethodesObjet.dupliquer(this.Matiere);
		lDevoir.date = ObjetDate_1.GDate.getDateCourante();
		lDevoir.coefficient = new TypeNote_1.TypeNote(1.0);
		lDevoir.bareme = new TypeNote_1.TypeNote(this.baremeParDefaut.getValeur());
		lDevoir.commentaire = "";
		lDevoir.datePublication =
			ObjetUtilitaireDevoir_1.ObjetUtilitaireDevoir.getDatePublicationDevoirParDefaut(
				lDevoir.date,
			);
		lDevoir.listeClasses = this.creerDevoirParDefautListeClasses();
		lDevoir.listeEleves = this.creerDevoirParDefautListeEleves();
		lDevoir.verrouille = false;
		lDevoir.commeUneNote = false;
		lDevoir.commeUnBonus = false;
		lDevoir.ramenerSur20 = false;
		lDevoir.listeSujet = "";
		lDevoir.libelleCorrige = "";
		lDevoir.listeSujets = new ObjetListeElements_1.ObjetListeElements();
		lDevoir.listeCorriges = new ObjetListeElements_1.ObjetListeElements();
		lDevoir.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
			"Theme.libelleCB.devoir",
		);
		lDevoir.avecCommentaireSurNoteEleve = false;
		lDevoir.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lDevoir;
	}
	creerDevoirParDefautListeClasses() {
		const llisteClasses = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 0, lNbr = this.listeClasses.count(); i < lNbr; i++) {
			let lClasse = this.listeClasses.get(i);
			const lClasseDevoir = MethodesObjet_1.MethodesObjet.dupliquer(lClasse);
			lClasseDevoir.service = MethodesObjet_1.MethodesObjet.dupliquer(
				lClasse.service,
			);
			let lPeriode = lClasse.listePeriodes.getElementParNumero(
				this.periode.getNumero(),
			);
			if (!lPeriode) {
				lPeriode = lClasse.periodeParDefaut;
			}
			let lPremierePeriodeDevoir = new ObjetElement_1.ObjetElement(
				lPeriode.getLibelle(),
				lPeriode.getNumero(),
				null,
				null,
				true,
			);
			lPremierePeriodeDevoir.estEvaluationCloturee =
				lPeriode.estEvaluationCloturee;
			lClasseDevoir.listePeriodes =
				new ObjetListeElements_1.ObjetListeElements();
			lClasseDevoir.listePeriodes.addElement(lPremierePeriodeDevoir);
			lClasseDevoir.listePeriodes.addElement(
				new ObjetElement_1.ObjetElement("", 0, null, null, true),
			);
			llisteClasses.addElement(lClasseDevoir);
		}
		return llisteClasses;
	}
	creerDevoirParDefautListeEleves(aListeEleves) {
		const lListeEleves = new ObjetListeElements_1.ObjetListeElements();
		if (!aListeEleves) {
			aListeEleves = this.listeEleves;
		}
		for (let I = 0; I < aListeEleves.count(); I++) {
			const lEleve = aListeEleves.get(I);
			const lEleveDevoir = new ObjetElement_1.ObjetElement(
				"",
				lEleve.getNumero(),
			);
			lEleveDevoir.Note = new TypeNote_1.TypeNote("");
			lListeEleves.addElement(lEleveDevoir);
		}
		return lListeEleves;
	}
	getPeriodesAnnee() {
		const lPeriodesAnnee = [];
		for (let I = 0; I < this.listeClasses.count(); I++) {
			const lClasse = this.listeClasses.get(I);
			for (let J = 0; J < lClasse.listePeriodes.count(); J++) {
				lPeriodesAnnee[lClasse.listePeriodes.getNumero(J)] = true;
			}
		}
		return lPeriodesAnnee;
	}
	_estEleveDansLaClasseALaDate(aEleve, aDate) {
		let lEstDansClasse =
			!aEleve.classe ||
			!aEleve.classe.datesDebut ||
			aEleve.classe.datesDebut.length === 0;
		for (let i = 0; i < aEleve.classe.datesDebut.length; i++) {
			if (
				aDate >= aEleve.classe.datesDebut[i] &&
				aDate <= aEleve.classe.datesFin[i]
			) {
				lEstDansClasse = true;
				break;
			}
		}
		return lEstDansClasse;
	}
	controlerElevesClotures() {
		for (let I = 0; I < this.listeDevoirs.count(); I++) {
			const lDevoir = this.listeDevoirs.get(I);
			for (let J = 0; J < lDevoir.listeEleves.count(); J++) {
				const lEleveDevoir = lDevoir.listeEleves.get(J);
				let lEleve = null;
				const lListeElevesPourEleveDevoir = this.listeEleves.getListeElements(
					(D) => {
						return D && D.getNumero() === lEleveDevoir.getNumero();
					},
				);
				if (lListeElevesPourEleveDevoir.count() >= 1) {
					if (lListeElevesPourEleveDevoir.count() === 1) {
						lEleve = lListeElevesPourEleveDevoir.get(0);
					} else {
						for (const lElevePourEleveDevoir of lListeElevesPourEleveDevoir) {
							if (
								this._estEleveDansLaClasseALaDate(
									lElevePourEleveDevoir,
									lDevoir.date,
								)
							) {
								lEleve = lElevePourEleveDevoir;
								break;
							}
						}
						if (!lEleve) {
							lEleve = lListeElevesPourEleveDevoir.get(0);
						}
					}
				}
				if (lEleve) {
					const lClasseDevoir = lDevoir.listeClasses.getElementParNumero(
						lEleve.classe.getNumero(),
					);
					if (lClasseDevoir) {
						lEleveDevoir.Actif = true;
						for (let K = 0; K < lClasseDevoir.listePeriodes.count(); K++) {
							if (
								this.laPeriodeEstClotureePourNotation(
									lClasseDevoir.listePeriodes.get(K),
									lClasseDevoir,
								)
							) {
								lEleveDevoir.Actif = false;
							}
						}
					} else {
						lEleveDevoir.Actif = false;
					}
				}
			}
		}
	}
	laPeriodeEstClotureePourNotation(aPeriode, aClasse) {
		if (!aPeriode.existeNumero()) {
			return false;
		}
		const N = aClasse ? 1 : this.listeClasses.count();
		for (let I = 0; I < N; I++) {
			const lClasse = aClasse
				? this.listeClasses.getElementParNumero(aClasse.getNumero())
				: this.listeClasses.get(I);
			const lPeriode = lClasse.listePeriodes.getElementParNumero(
				aPeriode.getNumero(),
			);
			if (lPeriode && !lPeriode.getActif()) {
				return true;
			}
		}
		return false;
	}
	leDevoirEstCloturePourNotation(aDevoir) {
		for (let i = 0; i < aDevoir.listeClasses.count(); i++) {
			let lClasse = aDevoir.listeClasses.get(i);
			for (let j = 0; j < lClasse.listePeriodes.count(); j++) {
				let lPeriode = lClasse.listePeriodes.get(j);
				if (this.laPeriodeEstClotureePourNotation(lPeriode, lClasse)) {
					return true;
				}
			}
		}
		return false;
	}
	selectionnerEleveCourant() {
		let lTrouve = false;
		const lEleve = this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		if (lEleve && !lEleve.multiSelection) {
			const lNbEleves = this.listeEleves.count();
			for (let I = 0; I < lNbEleves; I++) {
				const lElement = this.listeEleves.get(I);
				if (lElement.getNumero() === lEleve.getNumero()) {
					lTrouve = true;
					this.getInstance(this.identListe).selectionnerLigne({
						ligne: I,
						avecScroll: true,
					});
					break;
				}
			}
		}
		return lTrouve;
	}
	getIndexEleveSurDevoir(aDevoir) {
		if (aDevoir && aDevoir.listeEleves && aDevoir.listeEleves.count()) {
			for (let lIndex = 0; lIndex < this.listeEleves.count(); lIndex++) {
				const lEleve = this.listeEleves.get(lIndex);
				const lEleveDevoir = aDevoir.listeEleves.getElementParNumeroEtGenre(
					lEleve.getNumero(),
				);
				const lEleveDansDevoir = lEleve.dansDevoir[aDevoir.getNumero()];
				if (
					lEleveDevoir &&
					lEleveDevoir.Note &&
					lEleveDansDevoir ===
						Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Oui &&
					this.getInstance(this.identListe)
						.getDonneesListe()
						.devoirDansPeriode(aDevoir, lEleve, this.periode.getNumero())
				) {
					return lIndex;
				}
			}
		}
		return -1;
	}
	_gestionFocusApresFenetreDevoir(aGenreEvenement, aDevoir) {
		if (aGenreEvenement === null || aGenreEvenement === undefined) {
			return;
		}
		switch (aGenreEvenement) {
			case -1:
			case this.getInstance(this.IdentFenetreDevoir).genreBouton.annuler:
				break;
			case this.getInstance(this.IdentFenetreDevoir).genreBouton.supprimer:
				this._objGestionFocus_apresFenetreDevoir = {
					id: this.getInstance(this.identListe).getDonneesListe()
						.idBtnCreerDevoir,
				};
				break;
			case this.getInstance(this.IdentFenetreDevoir).genreBouton.valider:
			case this.getInstance(this.IdentFenetreDevoir).genreBouton.creer:
				if (!aDevoir.verrouille) {
					const lIndexEleve = this.getIndexEleveSurDevoir(aDevoir);
					if (lIndexEleve === -1) {
						this._objGestionFocus_apresFenetreDevoir = {
							id: this.getInstance(this.identListe).getDonneesListe()
								.idBtnCreerDevoir,
						};
					} else {
						let lIndexDevoir = this.listeDevoirs.getIndiceParElement(aDevoir);
						if (lIndexDevoir >= 0) {
							lIndexDevoir = this.getInstance(this.identListe)
								.getDonneesListe()
								.getNumeroColonneDId(
									DonneesListe_PageNotes_1.DonneesListe_PageNotes.colonnes
										.devoir +
										"_" +
										lIndexDevoir,
								);
							this.getInstance(this.identListe).demarrerEditionSurCellule(
								lIndexEleve,
								lIndexDevoir,
							);
							this.getInstance(this.identListe).selectionnerLigne({
								ligne: lIndexEleve,
							});
							return;
						}
					}
				} else {
					this._objGestionFocus_apresFenetreDevoir = {
						id: this.getInstance(this.identListe).getDonneesListe()
							.idBtnCreerDevoir,
					};
				}
				break;
			default:
				break;
		}
		let lID = this.getInstance(this.identListe).getNom();
		if (this._objGestionFocus_apresFenetreDevoir.id) {
			lID = this._objGestionFocus_apresFenetreDevoir.id;
			delete this._objGestionFocus_apresFenetreDevoir.element;
		}
		ObjetHtml_1.GHtml.setFocus(lID);
	}
	_gestionFocusApresFenetreCalculMoyenne() {}
	_gestionFocusApresFenetreSelectionPeriode() {
		if (
			this._objGestionFocus_apresFenetreSelectionPeriode &&
			this._objGestionFocus_apresFenetreSelectionPeriode.id
		) {
			ObjetHtml_1.GHtml.setFocus(
				this._objGestionFocus_apresFenetreSelectionPeriode.id,
			);
		}
		this._objGestionFocus_apresFenetreSelectionPeriode = null;
	}
	_evenementFenetreCompetences() {
		this.afficherPage();
	}
	composeLegendePageImpression(aListeDevoirs) {
		const H = [];
		if (!!aListeDevoirs && aListeDevoirs.getNbrElementsExistes() > 0) {
			aListeDevoirs.parcourir((aDevoir, aIndex) => {
				if (!!aDevoir && aDevoir.existe() && !!aDevoir.commentaire) {
					H.push("<div>(", aIndex + 1, ") ", aDevoir.commentaire, "</div>");
				}
			});
		}
		return H.join("");
	}
	_initialiserFenetreParametresAffichage(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Notes.parametresAffichage",
			),
			largeur: 350,
			hauteur: 80,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_evenementSurFenetreParametresAffichage(aNumeroBouton, aParametres) {
		if (aNumeroBouton === 1) {
			(this.optionsAffichageListe.afficherProjetsAccompagnement =
				aParametres.afficherProjetsAccompagnement),
				(this.optionsAffichageListe.afficherMoyenneBrute =
					aParametres.afficherMoyenneBrute),
				this.getInstance(this.identListe)
					.getDonneesListe()
					.setOptionsAffichage(this.optionsAffichageListe);
			this.actualiser();
		}
	}
	_surSaisieNotes(aCallbackApresSaisie, aJSONReponse) {
		let lCallbackApresSaisie;
		if (!!aCallbackApresSaisie) {
			lCallbackApresSaisie = aCallbackApresSaisie.bind(this, aJSONReponse);
		}
		this.actionSurValidation(lCallbackApresSaisie);
	}
	_basculerMoyNRDEleve(aEleve) {
		if (aEleve.estMoyNREditable) {
			this.moteur.saisieMoyNR({
				paramRequete: {
					estMoyNR: !aEleve.estMoyNR,
					periode: this.etatUtilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
					eleve: aEleve,
					service: this.etatUtilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
					),
				},
				instanceListe: this.getInstance(this.identListe),
				clbckSucces: (aParamSucces) => {
					const lDonneesListe = this.getInstance(
						this.identListe,
					).getListeArticles();
					const lLignes = lDonneesListe.getListeElements((aLigne) => {
						return aLigne.getNumero() === aParamSucces.numeroEleve;
					});
					const lLigne = lLignes.get(0);
					lLigne.estMoyNR = aParamSucces.estMoyNRSaisie;
					this.getInstance(this.identListe)
						.getDonneesListe()
						.actualiserMoyennes();
				},
				clbckEchec: function () {},
			});
		}
	}
	_ouvrirFenetreCommentaireSurNote(aParams) {
		if (!aParams.eleveDeDevoir) {
			return;
		}
		let lCommentaire = aParams.eleveDeDevoir.commentaire
			? MethodesObjet_1.MethodesObjet.dupliquer(
					aParams.eleveDeDevoir.commentaire,
				)
			: "";
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser: (aInstanceFenetre) => {
					aInstanceFenetre.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur("Notes.remarque"),
						avecTailleSelonContenu: true,
						largeur: 400,
						hauteur: 200,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
				evenement: (aGenreBouton, aParamFenetre) => {
					if (aGenreBouton === 1) {
						aParams.eleveDeDevoir.commentaire = lCommentaire;
						if (!aParams.eleveDeDevoir.note && aParams.eleveDeDevoir.Note) {
							aParams.eleveDeDevoir.note = aParams.eleveDeDevoir.Note;
						}
						this.surDeselection({
							avecActualisation: true,
							devoir: aParams.devoir,
							eleve: aParams.eleveDeDevoir,
							note: aParams.eleveDeDevoir.note,
						});
					}
				},
			},
		);
		const ljsxtextareamax = () => {
			return {
				getValue() {
					return lCommentaire;
				},
				setValue(aValue) {
					lCommentaire = aValue;
				},
			};
		};
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str("ie-textareamax", {
					"ie-model": ljsxtextareamax,
					class: "fluid-bloc",
					placeholder: "",
					maxlength: "10000",
					style: "min-height: 7rem;",
					"aria-label":
						ObjetTraduction_1.GTraductions.getValeur("Notes.remarque"),
				}),
			),
		);
		lFenetre.afficher(H.join(""));
	}
	automateDebug(aRequeteSuivante) {}
}
exports.InterfacePageNotes = InterfacePageNotes;
