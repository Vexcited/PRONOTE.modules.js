exports.InterfacePageSaisieAbsences = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetFenetre_DetailAbsences_1 = require("ObjetFenetre_DetailAbsences");
const ObjetFenetre_ListePunitions_1 = require("ObjetFenetre_ListePunitions");
const ObjetFenetre_SaisiePunitions_1 = require("ObjetFenetre_SaisiePunitions");
const ObjetFenetre_ChargeTAF_1 = require("ObjetFenetre_ChargeTAF");
const InterfacePageSaisieAbsences_Journee_1 = require("InterfacePageSaisieAbsences_Journee");
const InterfacePageSaisieAbsences_Cours_1 = require("InterfacePageSaisieAbsences_Cours");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_ConfSaisieAbsenceCours_1 = require("ObjetFenetre_ConfSaisieAbsenceCours");
const ObjetFenetre_EditionObservation_1 = require("ObjetFenetre_EditionObservation");
const ObjetFenetre_ListeMemosEleves_1 = require("ObjetFenetre_ListeMemosEleves");
const ObjetFenetre_EditionAbsencesNonReglees_1 = require("ObjetFenetre_EditionAbsencesNonReglees");
const ObjetFenetre_AbsenceParPas_1 = require("ObjetFenetre_AbsenceParPas");
const ObjetFenetre_SelectionElevesSansCours_1 = require("ObjetFenetre_SelectionElevesSansCours");
const UtilitaireAbsencesGrille_1 = require("UtilitaireAbsencesGrille");
const ObjetRequetePageSaisieAbsences_General_1 = require("ObjetRequetePageSaisieAbsences_General");
const ObjetRequetePageSaisieAbsences_1 = require("ObjetRequetePageSaisieAbsences");
const ObjetRequeteDetailAbsences_1 = require("ObjetRequeteDetailAbsences");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetStyle_1 = require("ObjetStyle");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_CalendrierAnnuel_1 = require("ObjetFenetre_CalendrierAnnuel");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Cache_1 = require("Cache");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetFenetre_Infirmerie_1 = require("ObjetFenetre_Infirmerie");
const ObjetFenetre_SelectionMotif_1 = require("ObjetFenetre_SelectionMotif");
const ObjetGrille_1 = require("ObjetGrille");
const ObjetMoteurAbsences_1 = require("ObjetMoteurAbsences");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequeteSaisieAbsences_1 = require("ObjetRequeteSaisieAbsences");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetZoneTexte_1 = require("ObjetZoneTexte");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const UtilitaireGrilleImageCoursPN_1 = require("UtilitaireGrilleImageCoursPN");
const Enumere_EvenementSaisieAbsences_1 = require("Enumere_EvenementSaisieAbsences");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const EGenreBorne_1 = require("EGenreBorne");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const TypeHttpMarqueurContenuCours_1 = require("TypeHttpMarqueurContenuCours");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetFenetre_GestionAPEleve_1 = require("ObjetFenetre_GestionAPEleve");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
const UtilitaireRenseignementsEleve_1 = require("UtilitaireRenseignementsEleve");
const MultipleObjetModule_EDTSaisie = require("ObjetModule_EDTSaisie");
class ObjetRequeteSaisieModifierPresenceEleveDansCours extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieModifierPresenceEleveDansCours",
	ObjetRequeteSaisieModifierPresenceEleveDansCours,
);
var EGenreChoixPeriode;
(function (EGenreChoixPeriode) {
	EGenreChoixPeriode[(EGenreChoixPeriode["MoisEnCours"] = 0)] = "MoisEnCours";
	EGenreChoixPeriode[(EGenreChoixPeriode["TrimestreEnCours"] = 1)] =
		"TrimestreEnCours";
	EGenreChoixPeriode[(EGenreChoixPeriode["SemestreEnCours"] = 2)] =
		"SemestreEnCours";
	EGenreChoixPeriode[(EGenreChoixPeriode["AnneeScolaire"] = 3)] =
		"AnneeScolaire";
	EGenreChoixPeriode[(EGenreChoixPeriode["Personnalise"] = 4)] = "Personnalise";
})(EGenreChoixPeriode || (EGenreChoixPeriode = {}));
class InterfacePageSaisieAbsences extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.moteur = new ObjetMoteurAbsences_1.ObjetMoteurAbsences();
		this.largeurGrille = 166;
		this.avecGrilleEleve = false;
		this.grilleEleveEstInitialisee = false;
		this.largeurGrilleEleve = 130;
		this.avecAnciennesFeuilleDAppel = this.appScoEspace.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.avecAnciennesFeuilleDAppel,
		);
		this.jourConsultUniquement = false;
		this.appelDedieEnseignant = [
			Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur,
			Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur,
		].includes(this.etatUtilScoEspace.getGenreOnglet());
		this.estAppelEtSuivi = [
			Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi,
			Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur,
		].includes(this.etatUtilScoEspace.getGenreOnglet());
		this.SelectionPlaceDebut = -1;
		this.SelectionPlaceFin = -1;
		this.DureeRetard = 5;
		this.largeurCmbRessources = 138;
		this.motif = 0;
		this.estEDTDesPermanences = false;
		this.idGrilleEleve = this.Nom + "_grilleEleve";
		this.idDemandesDispence = this.Nom + "_demandesDispence";
		if (!this.appelDedieEnseignant) {
			this.enseignantCourant = MethodesObjet_1.MethodesObjet.dupliquer(
				this.etatUtilScoEspace.getMembre(),
			);
		} else {
			this.listeEnseignants = this.etatUtilScoEspace.getListeProfesseurs();
			if (
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur
			) {
				this.listeEnseignants = this.listeEnseignants.getListeElements(
					(aElement) => {
						return aElement.getGenre() !== 0;
					},
				);
			}
			this.enseignantCourant = MethodesObjet_1.MethodesObjet.dupliquer(
				this.listeEnseignants.get(0),
			);
		}
		this.recapitulatifEleve = null;
		this.setAutorisations();
		this.donneesGrille = {
			date: null,
			listeCours: null,
			avecCoursAnnule: false,
		};
		this.paramCours = {};
		if (
			MultipleObjetModule_EDTSaisie &&
			MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie
		) {
			this.moduleSaisie =
				new MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie({
					instance: this,
					contexteFeuilleAppel: true,
					getInterfaceGrille: () => {
						return this.getInstance(this.IdentGrille);
					},
					getObjetGrille: () => {
						return this.getInstance(this.IdentGrille).getInstanceGrille();
					},
					autoriserCreationCours: () => {
						return (
							this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.cours
									.creerCoursPermanenceFeuilleAppel,
							) &&
							!this.estEDTDesPermanences &&
							!this.appelDedieEnseignant
						);
					},
					surCreationCours: (aParamsGabarit) => {
						const lCours = new ObjetElement_1.ObjetElement();
						lCours.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						lCours.estCoursCDIFeuilleAppel = true;
						lCours.place = aParamsGabarit.placeHebdo;
						lCours.duree = aParamsGabarit.duree;
						lCours.numeroSemaine = IE.Cycles.cycleDeLaDate(this.Date);
						lCours.ListeContenus =
							new ObjetListeElements_1.ObjetListeElements();
						this.paramCours = { cours: lCours };
						return lCours;
					},
					actionSurValidation: () => {
						this.recupererEmploiDuTemps();
					},
				});
		}
	}
	construireInstances() {
		this.IdentComboRessource = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboRessource,
			this.initialiserComboRessource,
		);
		if (this.appelDedieEnseignant) {
			this.IdentComboEnseignant = this.add(
				ObjetSaisiePN_1.ObjetSaisiePN,
				this.evenementSurComboEnseignant,
				this.initialiserComboEnseignant,
			);
		}
		this.IdentComboDates = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboDates,
			this.initialiserComboDates,
		);
		this.IdPremierElement = this.getInstance(
			this.IdentComboDates,
		).getPremierElement();
		this.IdentDate = this.add(
			ObjetZoneTexte_1.ObjetZoneTexte,
			null,
			this.initialiserDate,
		);
		this.IdentSelectDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementDateValidation.bind(this),
			this._initialiserCelluleDate,
		);
		this.IdentComboPlaceDeb = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboPlaceDeb,
			this.initialiserComboPlace,
		);
		this.IdentComboPlaceFin = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurComboPlaceFin,
			this.initialiserComboPlace,
		);
		this.IdentGrille = this.add(
			InterfaceGrilleEDT_1.InterfaceGrilleEDT,
			this.evenementSurCours,
			this.initialiserGrilleProfesseur,
		);
		this.IdentFenetreAbsences = this.add(
			ObjetFenetre_DetailAbsences_1.ObjetFenetre_DetailAbsences,
			this.evenementSurFenetreAbsence,
			this.initialiserFenetreAbsences,
		);
		this.identFenetreCalendrier = this.addFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			this.evenementFenetreCalendrier,
			this.initialiserFenetreCalendrier,
		);
		this.identMenuContextuel = this.add(
			ObjetMenuContextuel_1.ObjetMenuContextuel,
			this._evenementSurMenuContextuel,
			this._initialiserMenuContextuel,
		);
		if (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePunition,
			) ||
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieExclusion,
			)
		) {
			if (
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePunition,
				)
			) {
				this.identFenetreListePunitions = this.addFenetre(
					ObjetFenetre_ListePunitions_1.ObjetFenetre_ListePunitions,
					this._evenementFenetreListePunitions,
					this._initialiserFenetreListePunitions,
				);
			}
			this.identFenetreSaisiePunitions = this.addFenetre(
				ObjetFenetre_SaisiePunitions_1.ObjetFenetre_SaisiePunitions,
				this._evenementFenetreSaisiePunitions,
				this._initialiserFenetreSaisiePunitions,
			);
		}
		if (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites
					.appelSaisirMotifJustifDAbsence,
			) ||
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
			)
		) {
			this.idFenetreListeMotifsAbsence = this.addFenetre(
				ObjetFenetre_SelectionMotif_1.ObjetFenetre_SelectionMotif,
			);
			this.idFenetreEditionAbsencesNonRegles = this.addFenetre(
				ObjetFenetre_EditionAbsencesNonReglees_1.ObjetFenetre_EditionAbsencesNonReglees,
			);
		}
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
		) {
			this.idSaisieAbsences = this.add(
				InterfacePageSaisieAbsences_Journee_1.InterfacePageSaisieAbsences_Journee,
				this.evenementSurSaisie,
				this.initialiserSaisieAbsences,
			);
		} else {
			this.idSaisieAbsences = this.add(
				InterfacePageSaisieAbsences_Cours_1.InterfacePageSaisieAbsences_Cours,
				this.evenementSurSaisie,
				this.initialiserSaisieAbsences,
			);
			if (
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservation,
				) &&
				this.etatUtilScoEspace.getGenreOnglet() !==
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur
			) {
				this.idFenetreConf = this.addFenetre(
					ObjetFenetre_ConfSaisieAbsenceCours_1.ObjetFenetre_ConfSaisieAbsenceCours,
					this.evenementConfig,
				);
			}
			this.idDateDepuis = this.add(
				ObjetSaisiePN_1.ObjetSaisiePN,
				this.evenementSurDateDepuis,
				this.initialiserDateDepuis,
			);
			this.idFenetreEdition = this.addFenetre(
				ObjetFenetre_EditionObservation_1.ObjetFenetre_EditionObservation,
				this.evenementSurEdition,
				this.initialiserEdition,
			);
			this.idFenetreCalCDC = this.addFenetre(
				ObjetFenetre_CalendrierAnnuel_1.ObjetFenetre_CalendrierAnnuel,
				this._gestionFocusApresFenetreRecap,
				this.initialiserFenetreCalCDC,
			);
			this.idFenetreListeMemosEleves = this.addFenetre(
				ObjetFenetre_ListeMemosEleves_1.ObjetFenetre_ListeMemosEleves,
				this.eventFenetreMemosEleves,
				this.initFenetreMemosEleves,
			);
			this.idFenetreAbsenceParPas = this.addFenetre(
				ObjetFenetre_AbsenceParPas_1.ObjetFenetre_AbsenceParPas,
				this.eventAbsenceParPas,
				this.initAbsenceParPas,
			);
		}
		this.idFenetreInfirmerie = this.addFenetre(
			ObjetFenetre_Infirmerie_1.ObjetFenetre_Infirmerie,
			this.evenementEditionInfirmerie,
			this.initialiserInfirmerie,
		);
		this.idFenetreSelectionElevesSansCours = this.addFenetre(
			ObjetFenetre_SelectionElevesSansCours_1.ObjetFenetre_SelectionElevesSansCours,
			this._evenementSurFenetreSelectionElevesSansCours.bind(this),
		);
		this.IdentFenetreChargeTAF = this.addFenetre(
			ObjetFenetre_ChargeTAF_1.ObjetFenetre_ChargeTAF,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	estAvecBoutonAbsence() {
		return (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAppel,
			) &&
			!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAppelEtVS,
			)
		);
	}
	estAvecBoutonConfigurationAutresRubriques() {
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
		) {
			return false;
		}
		return (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieObservation,
			) &&
			this.etatUtilScoEspace.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur
		);
	}
	detruireInstances() {
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Etablissement
		) {
			this.etatUtilScoEspace.setListeClasses(0);
		}
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnConfigAutresRubriques: {
				event() {
					aInstance
						.getInstance(aInstance.idFenetreConf)
						.setDonnees(aInstance.listeColonnes);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.Choix_RubriquesFacultatives",
					);
				},
				getSelection() {
					return aInstance.getInstance(aInstance.idFenetreConf).estAffiche();
				},
				getDisabled() {
					return !aInstance.estAppelEtSuivi || !aInstance.listeColonnes;
				},
			},
			btnRecapitulatifAbsences: {
				event() {
					aInstance.recapitulatifEleve = {};
					aInstance.recapitulatifEleve.genreAbsence =
						Enumere_Ressource_1.EGenreRessource.Absence;
					aInstance.recapitulatifEleve.numeroObservation = null;
					aInstance.recupererAbsencesCours(
						aInstance.paramCours.cours,
						Enumere_Ressource_1.EGenreRessource.Absence,
					);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.RecapEleve",
					);
				},
				getSelection() {
					return aInstance
						.getInstance(aInstance.IdentFenetreAbsences)
						.estAffiche();
				},
				getDisabled() {
					return !aInstance.Eleve;
				},
			},
			btnCoursAnnules: {
				event() {
					aInstance.etatUtilScoEspace.setAvecCoursAnnule(
						!aInstance.etatUtilScoEspace.getAvecCoursAnnule(),
					);
					aInstance._actualisationVisibiliteCoursAnnule();
				},
				getSelection() {
					return aInstance.etatUtilScoEspace.getAvecCoursAnnule();
				},
				getTitle() {
					return aInstance.etatUtilScoEspace.getAvecCoursAnnule()
						? ObjetTraduction_1.GTraductions.getValeur(
								"EDT.MasquerCoursAnnules",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AfficherCoursAnnules",
							);
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
						aInstance.etatUtilScoEspace.getAvecCoursAnnule(),
					);
				},
			},
			btnMrFiche: {
				event() {
					if (aInstance.estAppelEtSuivi) {
						if (
							aInstance.GenreRessource ===
							Enumere_Ressource_1.EGenreRessource.Cours
						) {
							aInstance.appScoEspace
								.getMessage()
								.afficher({ idRessource: "AbsenceVS.MFicheFeuilleAppelVS" });
						} else {
							aInstance.appScoEspace
								.getMessage()
								.afficher({
									idRessource: "AbsenceVS.MFicheFeuilleAppelVSSansCours",
								});
						}
					} else {
						aInstance.appScoEspace
							.getMessage()
							.afficher({ idRessource: "Absence.MFicheFeuilleAppel" });
					}
				},
				getTitle() {
					const lHintMrFiche = aInstance.estAppelEtSuivi
						? ObjetTraduction_1.GTraductions.getTitreMFiche(
								"AbsenceVS.MFicheFeuilleAppelVS",
							)
						: ObjetTraduction_1.GTraductions.getTitreMFiche(
								"Absence.MFicheFeuilleAppel",
							);
					return lHintMrFiche;
				},
			},
			btnAfficherEDTEleve: {
				event() {
					aInstance.avecGrilleEleve = !aInstance.avecGrilleEleve;
					aInstance._afficherEDTEleve();
				},
				getSelection() {
					return aInstance.avecGrilleEleve;
				},
				getTitle() {
					return aInstance.avecGrilleEleve
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.MasquerEdTEleve",
							)
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.EdTEleve");
				},
			},
			btnAfficherChargeTravail: {
				event() {
					aInstance
						.getInstance(aInstance.IdentFenetreChargeTAF)
						.setDonnees(
							aInstance.paramCours.cours,
							aInstance.listeClasses,
							aInstance.Eleve,
						);
				},
				getSelection() {
					return aInstance
						.getInstance(aInstance.IdentFenetreChargeTAF)
						.estAffiche();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ChargeTAF",
					);
				},
				getDisabled() {
					return (
						(!aInstance.listeClasses || aInstance.listeClasses.count() === 0) &&
						!aInstance.Eleve
					);
				},
			},
			getDisplayBtnAfficherChargeTravail() {
				return !!(
					aInstance.paramCours.cours &&
					(aInstance.paramCours.cours.estPermanence ||
						(aInstance.paramCours.cours.matiere &&
							aInstance.paramCours.cours.matiere.devoirFait))
				);
			},
			getTitreGrilleEleve: function () {
				return aInstance.Eleve ? aInstance.Eleve.getLibelle() : "&nbsp;";
			},
			cbAppelTermine: {
				getValue: function () {
					return (
						aInstance.paramCours.cours && aInstance.paramCours.cours.AppelFait
					);
				},
				setValue: function (aValeur) {
					aInstance._evenementSurCBAppelTermine(aValeur);
				},
				getDisabled: function () {
					return (
						!aInstance.paramCours.cours ||
						!!aInstance.paramCours.cours.estAppelVerrouille ||
						aInstance.jourConsultUniquement
					);
				},
			},
			cbPermanence: {
				afficherCBPermanence: function () {
					return aInstance.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.absences
							.avecSaisieAbsencesToutesPermanences,
					);
				},
				getValue: function () {
					return aInstance.estEDTDesPermanences;
				},
				setValue: function (aValue) {
					aInstance.estEDTDesPermanences = aValue;
					aInstance.Eleve = null;
					aInstance.paramCours = {};
					aInstance._afficherMessageGrilleAbsence("");
					aInstance._actualiserEDTEleve();
					aInstance.recupererEmploiDuTemps();
				},
			},
			sortiepeda: {
				if: function () {
					return !!aInstance.messageSortiePeda;
				},
				html: function () {
					return aInstance.messageSortiePeda || "";
				},
			},
			btnTraiterDemandesDispense: {
				event() {
					aInstance.moteur.ouvrirFenetreDemandeDispense(
						aInstance.listeDemandesDispense,
						aInstance.callbackFenetreDemandeDispense.bind(aInstance),
					);
				},
				avec() {
					return (
						aInstance.avecDemandesDispense() &&
						aInstance.nombreDemandesDispense > 0
					);
				},
			},
			avecCheckboxAppelTermine() {
				return aInstance.avecCheckboxAppelTermine();
			},
		});
	}
	setAutorisations() {
		this.ListeDates = this.appScoEspace.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.listeDatesSaisieAbsence,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		this.setBandeau(this.composeBandeau());
		const H = [],
			avecCBEDTPermanence = this._avecCBEDTPermanence();
		H.push('<div class="SansMain full-size" style="position:relative;">');
		H.push(
			'<div id="' +
				this.Nom +
				'_Page_Message" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;text-align:center;padding-top:50px;">Sélectionnez votre cours</div>',
		);
		if (avecCBEDTPermanence) {
			H.push(
				'<ie-checkbox ie-if="afficherCBPermanence" ie-model="cbPermanence" style="position:absolute;top:4px;left:4px;">',
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.ToutesLesPermanences",
				),
				"</ie-checkbox>",
			);
		}
		H.push(
			'<div style="position:absolute;top:0;left:5px;width:' +
				(this.largeurGrille + GNavigateur.getLargeurBarreDeScroll()) +
				"px;height:" +
				(avecCBEDTPermanence ? "25" : "0") +
				'px;" id="' +
				this.Instances[this.IdentComboRessource].getNom() +
				'"></div>',
		);
		H.push(
			'<div id="' +
				this.Instances[this.IdentGrille].getNom() +
				'" style="position:absolute;overflow:hidden;top:' +
				(avecCBEDTPermanence ? "25" : "0") +
				"px;left:0;width: " +
				(this.largeurGrille + GNavigateur.getLargeurBarreDeScroll()) +
				'px;bottom:0;"></div>',
		);
		H.push(
			'<div style="position:absolute;overflow:hidden;top:0;left:' +
				(this.largeurGrille + GNavigateur.getLargeurBarreDeScroll()) +
				'px;right:0;bottom:0;">',
		);
		H.push(
			'<div id="' + this.Instances[this.idSaisieAbsences].getNom() + '"></div>',
		);
		H.push(
			`<div class="m-all radius-all-s" id="${this.Nom}_Appel_Termine" style="display:none;${ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.liste.colonneFixe.getFond())}">`,
			`<div class="flex-contain cols p-all-l">`,
			`<div class="flex-contain flex-gap-xl">`,
			this.composeCBAppelTermine(),
			`<p id="${this.Nom}_Nb_Eleve_Present" class="flex-contain flex-center m-left-l"></p>`,
			`<div class="flex-contain flex-center" ie-if="sortiepeda.if" ie-html="sortiepeda.html"></div>`,
			`<div id="${this.idDemandesDispence}"></div>`,
			`</div>`,
			`</div>`,
			`</div>`,
			`</div>`,
		);
		H.push(
			'<div id="',
			this.idGrilleEleve,
			'" style="display:none; position:absolute;overflow:hidden;top:0;right:0;width: ' +
				(this.largeurGrilleEleve + GNavigateur.getLargeurBarreDeScroll()) +
				'px;bottom:0;"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	composeCBAppelTermine() {
		const H = [];
		H.push(
			'<div class="flex-contain flex-center" ie-display="avecCheckboxAppelTermine">',
			'<ie-checkbox ie-model="cbAppelTermine" style="',
			ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.texte),
			'">',
			ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AppelFait"),
			"</ie-checkbox>",
			"</div>",
		);
		return H.join("");
	}
	updateDemandesDispence() {
		ObjetHtml_1.GHtml.setHtml(
			this.idDemandesDispence,
			this.composeHtmlDemandesDispence(),
			{ controleur: this.controleur },
		);
	}
	composeHtmlDemandesDispence() {
		const H = [];
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(this.nombreDemandesDispense) &&
			this.nombreDemandesDispense > 0
		) {
			const lTrad =
				this.nombreDemandesDispense === 1
					? ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.demandeDispense.1DemandeATraiter",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.demandeDispense.xDemandesATraiter",
							[this.nombreDemandesDispense],
						);
			H.push(
				'<div class="flex-contain flex-center flex-gap" ie-if="btnTraiterDemandesDispense.avec">',
				`<p class="color-red-foncee">${lTrad}</p>`,
				`<ie-bouton ie-model="btnTraiterDemandesDispense" class="themeBoutonPrimaire small-bt">${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.traiter")}</ie-bouton>`,
				"</div>",
			);
		}
		return H.join("");
	}
	composeBandeau() {
		const H = [];
		H.push('<div class="objetBandeauEntete_fullsize">');
		H.push(
			'<div class="flex-contain  flex-center justify-between flex-wrap flex-gap-l semi-bold">',
		);
		if (this.getInstance(this.IdentComboEnseignant)) {
			H.push(
				'  <div id="' +
					this.getInstance(this.IdentComboEnseignant).getNom() +
					'"></div>',
			);
		}
		H.push(
			'  <div id="' +
				this.Instances[this.IdentComboDates].getNom() +
				'"></div>',
		);
		H.push(
			'  <div id="' + this.Instances[this.IdentDate].getNom() + '"></div>',
		);
		H.push(
			'  <div id="' +
				this.Instances[this.IdentSelectDate].getNom() +
				'"></div>',
		);
		H.push('  <div class="fluid-bloc flex-contain self-stretch">');
		H.push(
			'    <div class="fluid-bloc flex-contain flex-center flex-gap-l p-x-l radius-all-s" id="' +
				this.Nom +
				'_Bandeau" style="display:none; ' +
				ObjetStyle_1.GStyle.composeCouleur(GCouleur.cumul, GCouleur.texte) +
				'">',
		);
		H.push('        <div id="' + this.Nom + '_Bandeau_Message"></div>');
		H.push(
			'        <div id="' +
				this.Instances[this.IdentComboPlaceDeb].getNom() +
				'"></div>',
		);
		H.push(
			'        <div id="' +
				this.Nom +
				'_Bandeau_MessageSuite">' +
				ObjetChaine_1.GChaine.insecable("à") +
				"</div>",
		);
		H.push(
			'        <div id="' +
				this.Instances[this.IdentComboPlaceFin].getNom() +
				'"></div>',
		);
		H.push("    </div>");
		H.push("  </div>");
		if (this.estAppelEtSuivi) {
			H.push(
				'<div id="' + this.Instances[this.idDateDepuis].getNom() + '"></div>',
			);
			if (this.estAvecBoutonConfigurationAutresRubriques()) {
				H.push(
					'<div class="fluid-bloc justify-end flex-contain flex-center flex-gap-l">',
				);
				H.push(
					"<div>",
					UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
						"btnConfigAutresRubriques",
					),
					"</div>",
				);
			}
		}
		H.push('<div class="flex-contain flex-center flex-gap-l">');
		if (this.estAvecBoutonAbsence()) {
			H.push(
				UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnRecapitulatifAbsences(
					"btnRecapitulatifAbsences",
				),
			);
		}
		H.push(
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnulesControleur(
				"btnCoursAnnules",
			),
		);
		H.push(
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherEmploiDuTemps(
				"btnAfficherEDTEleve",
			),
		);
		H.push(
			'<span ie-display="getDisplayBtnAfficherChargeTravail">',
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnChargeDeTravail(
				"btnAfficherChargeTravail",
			),
			"</span>",
		);
		if (this.avecFicheEleve()) {
			H.push(
				UtilitaireRenseignementsEleve_1.UtilitaireFicheEleve.getHtmlBtnAfficherFicheEleve(
					this,
				),
			);
		}
		if (this.avecPhotoEleve()) {
			H.push(
				UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.getHtmlBtnAfficherPhotoEleve(
					this,
				),
			);
		}
		H.push(
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				"btnMrFiche",
			),
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	initialiserSaisieAbsences(AInstance) {
		AInstance.setDonnees({
			avecSaisiePunition:
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
					? false
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePunition,
						),
			avecSaisieExclusion:
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisieExclusion,
						),
			avecSaisiePassageInfirmerie:
				this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePassageInfirmerie,
						),
			avecSaisieRetard: this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieRetard,
			),
		});
	}
	initialiserComboRessource(aObjet) {
		aObjet.setVisible(false);
		aObjet.setControleNavigation(true);
		aObjet.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.comboRessource",
			),
			longueur: this.largeurCmbRessources,
		});
	}
	initialiserComboEnseignant(aObjet) {
		aObjet.setControleNavigation(true);
		aObjet.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.comboEnseignant",
			),
			avecTriListeElements: true,
			longueur: 175,
		});
	}
	initialiserComboDates(AInstance) {
		AInstance.setOptionsObjetSaisie({
			texteEdit:
				"-&nbsp;" +
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.appelDu"),
		});
		AInstance.setVisible(false);
		AInstance.setControleNavigation(true);
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.comboDates",
			),
			longueur: 120,
			forcerBoutonDeploiement: true,
		});
	}
	initialiserDate(AInstance) {
		AInstance.setVisible(false);
		AInstance.setParametres(false, GCouleur.noir);
	}
	initialiserComboPlace(aInstance) {
		aInstance.setOptionsObjetSaisie({ longueur: 50 });
	}
	initialiserGrilleProfesseur(AInstance) {
		AInstance.setOptionsInterfaceGrilleEDT({
			optionsGrille: {
				tailleMINPasHoraire: undefined,
				surLongTouchGrille: (aParams) => {
					this._deselectionCours();
					if (this.moduleSaisie) {
						this.moduleSaisie.surLongTouchGrille(aParams);
					}
				},
			},
			evenementMouseDownPlace: (aEstGrilleMS, aParams) => {
				this._deselectionCours();
				if (this.moduleSaisie) {
					this.moduleSaisie.mouseDownPlaceGrille(aEstGrilleMS, aParams);
				}
			},
		});
		AInstance.setControleNavigation(true);
	}
	initialiserFenetreAbsences(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: "",
			largeur: 600,
			hauteur: 350,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
		});
	}
	_initialiserFenetreListePunitions(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 256,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
		});
	}
	_initialiserFenetreSaisiePunitions(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 500,
			hauteur: 285,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		if (aInstance.moteurPunitions) {
			aInstance.moteurPunitions.maxlengthCirconstance =
				!!this.infoMaxlength &&
				"circonstance" in this.infoMaxlength &&
				this.infoMaxlength.circonstance > 0
					? this.infoMaxlength.circonstance
					: undefined;
			aInstance.moteurPunitions.maxlengthTaf =
				!!this.infoMaxlength &&
				"taf" in this.infoMaxlength &&
				this.infoMaxlength.taf > 0
					? this.infoMaxlength.taf
					: undefined;
		}
	}
	initialiserFenetreCalendrier(aInstance) {
		aInstance.setParametres(
			ObjetDate_1.GDate.PremierLundi,
			ObjetDate_1.GDate.premiereDate,
			this.appScoEspace.getObjetParametres().DerniereDate,
			this.appScoEspace.getObjetParametres().JoursOuvres,
		);
	}
	initialiserInfirmerie(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.Titre_FenetreInfirmerie",
			),
			largeur: 380,
			hauteur: null,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_initialiserMenuContextuel(aInstance) {
		aInstance.addCommande(
			0,
			ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AjouterPunition"),
		);
	}
	initialiserDateDepuis(AInstance) {
		AInstance.setOptionsObjetSaisie({
			texteEdit: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.DecompteDepuis",
			),
		});
		AInstance.setControleNavigation(true);
		AInstance.enInitialisation = true;
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.comboDates",
			),
			longueur: 120,
			forcerBoutonDeploiement: true,
		});
	}
	initialiserEdition(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.ObservationsParents",
			),
			largeur: 480,
			hauteur: 240,
		});
	}
	initialiserFenetreCalCDC(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CarnetCorrespondance.DefautCarnet",
			),
			largeur: 650,
			hauteur: null,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	initFenetreMemosEleves(aInstance) {
		aInstance.setOptionsFenetre({ donneesListe: { avecEtatSaisie: true } });
	}
	initAbsenceParPas(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.dureeAbsence",
				[""],
			),
			largeur: 400,
			hauteur: 100,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evenementConfig() {
		if (this.getEtatSaisie()) {
			this.valider();
		}
	}
	async _evenementSurCBAppelTermine(aAppelFait) {
		if (
			this.paramCours.cours &&
			this.paramCours.cours.AppelFait !== aAppelFait
		) {
			if (
				this.moteur.avecDemandesDispenseNonTraitee(this.listeDemandesDispense)
			) {
				const lRes =
					await this.moteur.afficherMessageConfirmationAppelTermineAvecDemandeDispense();
				if (lRes !== Enumere_Action_1.EGenreAction.Valider) {
					return;
				}
			}
			this.setEtatSaisie(true);
			this.paramCours.cours.AppelFait = aAppelFait;
			if (
				this.paramCours.cours.AppelFait &&
				this.paramCours.cours.NomImageAppelFait
			) {
				this.paramCours.cours._old_NomImageAppelFait =
					this.paramCours.cours.NomImageAppelFait;
			}
			this.paramCours.cours.NomImageAppelFait = this.paramCours.cours.AppelFait
				? "AppelFait"
				: this.paramCours.cours._old_NomImageAppelFait || "";
			this._actualiserAppelFaitGrille(this.paramCours.cours);
			this.valider();
		}
	}
	_actualiserAppelFaitGrille(aCours) {
		if (!aCours) {
			return;
		}
		this.evenementSurSaisie(
			Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence.AppelFait,
		);
	}
	evenementSurSaisie(aEvent, aObjet) {
		if (aObjet && aObjet._gestionFocus_apresFenetreCelluleId) {
			this._gestionFocus_apresFenetreCelluleId =
				aObjet._gestionFocus_apresFenetreCelluleId;
		}
		if (aObjet && aObjet._gestionFocus_apresFenetreRecapId) {
			this._gestionFocus_apresFenetreRecapId =
				aObjet._gestionFocus_apresFenetreRecapId;
		}
		let lEleve, i;
		switch (aEvent) {
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.SelectionEleve: {
				if (
					!this.Eleve ||
					this.Eleve.getNumero() !== aObjet.eleve.getNumero()
				) {
					this.Eleve = aObjet.eleve;
					if (
						this.existeInstance(this.IdentFenetreAbsences) &&
						this.getInstance(this.IdentFenetreAbsences).estAffiche()
					) {
						if (
							this.recapitulatifEleve !== null &&
							this.recapitulatifEleve !== undefined
						) {
							this.recupererAbsencesCours(
								this.paramCours.cours,
								this.recapitulatifEleve.genreAbsence,
								this.recapitulatifEleve.numeroObservation,
							);
						} else {
							this.recupererAbsencesCours(
								null,
								Enumere_Ressource_1.EGenreRessource.Absence,
							);
						}
					}
					this.etatUtilScoEspace.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
						aObjet.eleve,
					);
					this.surSelectionEleve();
					this._actualiserEDTEleve();
					this.$refreshSelf();
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.AppelFait: {
				this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.moduleCours.actualiserCours();
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.FermerFenetre: {
				this.getInstance(this.IdentFenetreAbsences).fermer();
				this.getInstance(this.identFenetreSaisiePunitions).fermer();
				this.getInstance(this.identFenetreCalendrier).fermer();
				this.getInstance(this.identFenetreFicheEleve).fermer();
				this.getInstance(this.idFenetreInfirmerie).fermer();
				if (this.existeInstance(this.idFenetreConf)) {
					this.getInstance(this.idFenetreConf).fermer();
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ClicDroit: {
				if (!this.jourConsultUniquement) {
					if (
						this.etatUtilScoEspace.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
						this.etatUtilScoEspace.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
					) {
						this.actualiserMenuContextuelJournee(aObjet);
					} else {
						this.actualiserMenuContextuel(aObjet);
					}
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.PunitionListe: {
				if (this.ListeEleves && this.ListeEleves.count() > 0) {
					this.getInstance(this.identFenetreListePunitions).setDonnees(
						this.ListeEleves,
					);
					const lStrDate = this.ListeDates.get(
						this.indiceDateSaisieAbsence,
					).getLibelle();
					const lStrEnseignant = this.enseignantCourant.getLibelle();
					const lTitreFenetre = ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.titreFenetreListePunitions",
						),
						[lStrDate, lStrEnseignant],
					);
					this.getInstance(this.identFenetreListePunitions).setOptionsFenetre({
						titre: lTitreFenetre,
					});
				} else {
					this.appScoEspace
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.aucunePunitionClasse",
							),
							callback: this._gestionFocusApresFenetreCellule.bind(this),
						});
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.PunitionSaisie: {
				if (!this.Eleve) {
					this.appScoEspace
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SelectionElevePunition",
							),
							callback: this._gestionFocusApresFenetreCellule.bind(this),
						});
				} else {
					this._ouvrirFenetreSaisiePunition(
						aObjet && aObjet.numeroPunition
							? this.Eleve.listePunitions.get(
									Math.ceil(aObjet.numeroPunition / 2) - 1,
								)
							: null,
						aObjet
							? aObjet.genreAbsence
							: Enumere_Ressource_1.EGenreRessource.Punition,
					);
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.PunitionSuppression: {
				let lPunition;
				if (
					this.etatUtilScoEspace.getGenreOnglet() ===
						Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
					this.etatUtilScoEspace.getGenreOnglet() ===
						Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
				) {
					const lNumeroPunition = Math.ceil(aObjet.numeroPunition / 2) - 1;
					lPunition = this.Eleve.listePunitions.get(lNumeroPunition);
				} else {
					lPunition = this.Eleve.listePunitions.getPremierElement();
				}
				this._evenementApresConfirmationSuppressionPunition(
					lPunition,
					0,
					Enumere_Ressource_1.EGenreRessource.Punition,
				);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ActionSurAbsence: {
				aObjet.genreAbsence = aObjet.typeAbsence;
				aObjet.eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				aObjet.fonctionSurOuvrirListeMotif = (aParam) => {
					const lInstance = this.getInstance(this.idFenetreListeMotifsAbsence);
					if (lInstance) {
						if (
							aParam.genreAbsence ===
							Enumere_Ressource_1.EGenreRessource.Absence
						) {
							lInstance.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.SelectionnerUnMotifAbsence",
								),
							});
						} else if (
							aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Retard
						) {
							lInstance.setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.SelectionnerUnMotifRetard",
								),
							});
						}
						lInstance.setOptionsFenetre({
							callback: this._evenementFenetreListeMotifsAbsence.bind(
								this,
								aParam.eleve,
								aParam.genreAbsence,
								aParam.placeDebut,
								aParam.placeFin,
								aParam.typeObservation,
								aParam.listeMotifs,
							),
							genreAbsence: aParam.genreAbsence,
						});
						if (
							aParam.genreAbsence ===
							Enumere_Ressource_1.EGenreRessource.Absence
						) {
							lInstance.setDonnees(
								Cache_1.GCache.listeMotifsAbsenceEleve,
								true,
							);
						} else {
							lInstance.setDonnees(Cache_1.GCache.listeMotifsRetards, false);
						}
					}
				};
				aObjet.fonctionApresPasPossible = (aParam) => {
					this.afficherNbElevePresent();
					this.getInstance(this.idSaisieAbsences).retourAbsence(
						aParam.eleve.Numero,
						aParam.genreAbsence,
						aParam.typeObservation,
					);
				};
				aObjet.fonctionApresModification = this._apresModificationAbsence.bind(
					this,
					aObjet.eleve,
					aObjet.genreAbsence,
					aObjet.typeObservation,
				);
				this.moteur.surEvenementSaisieAbsence(aObjet);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.DureeRetard: {
				this.DureeRetard = aObjet.dureeRetard;
				this.moteur.setOptions({ dureeRetard: this.DureeRetard });
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecupererAbsence: {
				if (aObjet.numeroEleve) {
					lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
					this.Eleve = lEleve;
				}
				return this.moteur.getAbsence(
					this.Eleve,
					aObjet.genreAbsence,
					aObjet.place,
					aObjet.genreObservation,
				);
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecapitulatifEleve: {
				lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.Eleve = lEleve;
				this.etatUtilScoEspace.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Eleve,
					lEleve,
				);
				delete aObjet.numeroEleve;
				this.recapitulatifEleve = aObjet;
				if (
					this.existeInstance(this.IdentFenetreAbsences) &&
					this.getInstance(this.IdentFenetreAbsences).estAffiche() &&
					this.recapitulatifEleve.genreAbsence ===
						Enumere_Ressource_1.EGenreRessource.Observation &&
					this.listeColonnes.getElementParNumeroEtGenre(
						this.recapitulatifEleve.numeroObservation,
						this.recapitulatifEleve.genreAbsence,
					).genreObservation ===
						TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
				) {
					this.getInstance(this.IdentFenetreAbsences).fermer();
				}
				if (
					this.existeInstance(this.idFenetreCalCDC) &&
					this.getInstance(this.idFenetreCalCDC).estAffiche() &&
					!(
						this.recapitulatifEleve.genreAbsence ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
						this.listeColonnes.getElementParNumeroEtGenre(
							this.recapitulatifEleve.numeroObservation,
							this.recapitulatifEleve.genreAbsence,
						).genreObservation ===
							TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
					)
				) {
					this.getInstance(this.idFenetreCalCDC).fermer();
				}
				this.surSelectionEleve();
				this.recupererAbsencesCours(
					this.paramCours.cours,
					aObjet.genreAbsence,
					aObjet.numeroObservation,
				);
				this._actualiserEDTEleve();
				this.$refreshSelf();
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ChangerEtatDevoir: {
				const lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				if (lEleve.devoirARendre.programmation.Genre === 1) {
					lEleve.devoirARendre.programmation.Genre = 2;
				} else {
					lEleve.devoirARendre.programmation.Genre = 1;
				}
				lEleve.devoirARendre.programmation.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				lEleve.devoirARendre.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this.getInstance(this.idSaisieAbsences).retourChangementDevoir(
					aObjet.numeroEleve,
				);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.Infirmerie: {
				this.Eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.Place = aObjet.place;
				const LBorneMin = this.PlaceSaisieDebut;
				const LBorneMax = this.PlaceSaisieFin;
				const lAbsence = this.moteur.getAbsence(
					this.Eleve,
					Enumere_Ressource_1.EGenreRessource.Infirmerie,
					this.Place,
				);
				const lListeAccompagnants = MethodesObjet_1.MethodesObjet.dupliquer(
					this.ListeEleves,
				);
				this.moteur._majListeElevesVisible();
				this.getInstance(this.idFenetreInfirmerie).setDonnees(
					lListeAccompagnants,
					{
						numeroEleve: this.Eleve.Numero,
						placeDebut: aObjet.placeDebut,
						placeFin: aObjet.placeFin,
						borneMin: ObjetDate_1.GDate.placeAnnuelleEnDate(LBorneMin),
						borneMax: ObjetDate_1.GDate.placeAnnuelleEnDate(LBorneMax, true),
						absence: lAbsence,
						publierParDefautPassageInf: this.publierParDefautPassageInf,
						avecEditionPublication: false,
						maxlengthCommentaire:
							!!this.infoMaxlength &&
							"commentairePassageInfirmerie" in this.infoMaxlength &&
							this.infoMaxlength.commentairePassageInfirmerie > 0
								? this.infoMaxlength.commentairePassageInfirmerie
								: undefined,
						avecCommentaireAutorise: this.avecCommentaireAutorise,
					},
				);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.DeplacementBorne: {
				const LGenreBorneDeplacee = aObjet.genreBorne;
				const LPlace = aObjet.place;
				const LEstUnCours =
					this.GenreRessource === Enumere_Ressource_1.EGenreRessource.Cours;
				if (!LEstUnCours) {
					if (LGenreBorneDeplacee === EGenreBorne_1.EGenreBorne.Superieure) {
						const LPlaceSaisieFin =
							1 +
							(LPlace % this.appScoEspace.getObjetParametres().PlacesParJour);
						this.PlaceSaisieFin = LPlace;
						this.getInstance(
							this.IdentComboPlaceFin,
						).setSelectionParNumeroEtGenre(null, LPlaceSaisieFin);
						this.getInstance(this.idSaisieAbsences).setPlacesSaisie(
							this.PlaceSaisieDebut,
							this.PlaceSaisieFin,
						);
					} else {
						const LPlaceSaisieDebut =
							LPlace % this.appScoEspace.getObjetParametres().PlacesParJour;
						this.PlaceSaisieDebut = LPlace;
						this.getInstance(
							this.IdentComboPlaceDeb,
						).setSelectionParNumeroEtGenre(null, LPlaceSaisieDebut);
						this.getInstance(this.idSaisieAbsences).setPlacesSaisie(
							this.PlaceSaisieDebut,
							this.PlaceSaisieFin,
						);
					}
				} else {
					this.PlaceSaisieDebut =
						LGenreBorneDeplacee === EGenreBorne_1.EGenreBorne.Superieure
							? this.PlaceSaisieDebut
							: LPlace;
					this.PlaceSaisieFin =
						LGenreBorneDeplacee === EGenreBorne_1.EGenreBorne.Superieure
							? LPlace
							: this.PlaceSaisieFin;
					this.getInstance(this.idSaisieAbsences).setPlacesSaisie(
						this.PlaceSaisieDebut,
						this.PlaceSaisieFin,
					);
				}
				this.moteur.setOptions({
					placeSaisieDebut: this.PlaceSaisieDebut,
					placeSaisieFin: this.PlaceSaisieFin,
				});
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.OuvrirEditionObservation: {
				let lColonneObservation;
				let lMaxLength;
				if (
					!!aObjet.absence &&
					aObjet.absence.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Dispense
				) {
					lColonneObservation = this.listeColonnes.getElementParGenre(
						Enumere_Ressource_1.EGenreRessource.Dispense,
					);
					lMaxLength =
						!!this.infoMaxlength &&
						"commentaireDispense" in this.infoMaxlength &&
						this.infoMaxlength.commentaireDispense > 0
							? this.infoMaxlength.commentaireDispense
							: undefined;
				} else {
					lColonneObservation = this.listeColonnes.getElementParNumero(
						aObjet.genreObservation,
					);
					lMaxLength =
						!!this.infoMaxlength &&
						"commentaireObservation" in this.infoMaxlength &&
						this.infoMaxlength.commentaireObservation > 0
							? this.infoMaxlength.commentaireObservation
							: undefined;
				}
				this.getInstance(this.idFenetreEdition).setDonnees({
					observation: aObjet.absence,
					numeroObservation: aObjet.genreObservation,
					genreEtat: aObjet.genreEtat,
					typeObservation: !!lColonneObservation
						? lColonneObservation.genreObservation
						: null,
					publiable: !!lColonneObservation
						? lColonneObservation.publiable
						: false,
					avecDate: false,
					maxlengthCommentaire: lMaxLength,
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecupererInfo: {
				if (aObjet.enseignantCourant) {
					return this.enseignantCourant;
				} else if (aObjet.cours) {
					return this.paramCours.cours;
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.CalculInfoEleve: {
				this.moteur.calculerInfosEleve(aObjet.eleve);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.MemosEleves: {
				this.Eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.getInstance(this.idFenetreListeMemosEleves)
					.setParametresMemosEleves({ estValorisation: false })
					.setDonnees(this.Eleve);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ValorisationsEleve: {
				this.Eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.getInstance(this.idFenetreListeMemosEleves)
					.setParametresMemosEleves({
						estValorisation: true,
						forcerConsultation: true,
					})
					.setDonnees(this.Eleve);
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.ContextMenuEleve: {
				if (!this.jourConsultUniquement) {
					lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
					const lInstance = this.getInstance(this.identMenuContextuel);
					lInstance.vider();
					if (
						this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.dossierVS.saisirMemos,
						) &&
						!lEleve.avecMemo &&
						!lEleve.sortiePeda
					) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.creerMemo,
							ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.CreerUnMemo"),
							true,
						);
					}
					if (
						this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.eleves
								.avecAffectationElevesGroupesGAEV,
						)
					) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.gestionAPEleve,
							ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.ModifierGpeAP",
							),
							true,
						);
					}
					if (lEleve.eleveAjouteAuCours) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours,
							ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SuppressionEleve",
							),
							true,
						);
					}
					if (lInstance.getListeLignes().count() > 0) {
						lInstance.afficher();
					}
				}
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.AbsencesNonReglees:
				if (
					this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.fonctionnalites
							.saisieEtendueAbsenceDepuisAppel,
					)
				) {
					let lTitre =
						this.Eleve.getLibelle() +
						" - " +
						this.Eleve.listeAbsencesNonReglees.count() +
						" " +
						(this.Eleve.listeAbsencesNonReglees.count() > 1
							? ObjetTraduction_1.GTraductions.getValeur("Absence.Absences")
							: ObjetTraduction_1.GTraductions.getValeur("Absence.Absence")) +
						" - ";
					lTitre = ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"Absence.TitreListeEvnmts",
						),
						[
							lTitre,
							ObjetDate_1.GDate.formatDate(
								this.dateDecompte
									? this.dateDecompte
									: this.appScoEspace.getObjetParametres().PremiereDate,
								"%JJ/%MM/%AAAA",
							),
						],
					);
					this.getInstance(
						this.idFenetreEditionAbsencesNonRegles,
					).setOptionsFenetre({ titre: lTitre });
					this.getInstance(this.idFenetreEditionAbsencesNonRegles).setDonnees(
						this.Eleve.listeAbsencesNonReglees,
					);
				}
				break;
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.OuvrirAbsenceParPas: {
				this.getInstance(this.idFenetreAbsenceParPas).setOptionsFenetre({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.dureeAbsence",
						[this.Eleve.getLibelle()],
					),
				});
				if (aObjet.absence.tabAbs === undefined) {
					aObjet.absence.tabAbs = [];
					for (i = this.PlaceSaisieDebut; i <= this.PlaceSaisieFin; i++) {
						aObjet.absence.tabAbs.push({ N: "1", C: "1", place: i, raison: 0 });
					}
				}
				this.getInstance(this.idFenetreAbsenceParPas).setDonnees({
					absence: aObjet.absence,
					placeDebut: this.PlaceSaisieDebut,
					placeFin: this.PlaceSaisieFin,
				});
				break;
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.RecupererListeAbsences: {
				if (aObjet.numeroEleve) {
					lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
					this.Eleve = lEleve;
				}
				let lListe = "ListeAbsences";
				if (
					aObjet.genreAbsence === Enumere_Ressource_1.EGenreRessource.Dispense
				) {
					lListe = "ListeDispenses";
				}
				if (
					aObjet.genreAbsence ===
						Enumere_Ressource_1.EGenreRessource.Observation &&
					aObjet.genreObservation !== null &&
					aObjet.genreObservation !== undefined
				) {
					aObjet.genreAbsence =
						Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve;
				}
				return this.Eleve[lListe].getListeElements((aEle) => {
					return (
						aEle.getGenre() === aObjet.genreAbsence &&
						(aEle.getGenre() !==
							Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve ||
							aEle.observation.getGenre() === aObjet.genreObservation)
					);
				});
			}
			case Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
				.DemandesDispenseEleve: {
				if (!aObjet.numeroEleve) {
					return;
				}
				const lDemandeDispense = this.moteur.getDemandeDeDispense(
					aObjet.numeroEleve,
				);
				if (lDemandeDispense) {
					this.moteur.ouvrirFenetreDemandeDispense(
						lDemandeDispense,
						this.callbackFenetreDemandeDispense.bind(this),
					);
				}
				break;
			}
			default: {
				break;
			}
		}
	}
	callbackFenetreDemandeDispense(aParams) {
		this.setEtatSaisie(true);
		this.valider();
	}
	evenementSurComboRessource(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			ObjetHtml_1.GHtml.setDisplay(
				this.Instances[this.IdentGrille].getNom(),
				false,
			);
			this.paramCours = {};
			this.setActif(false);
			this.SelectionRessource = aParams.indice;
			this.setSelectionRessource(
				aParams.element.getGenre(),
				aParams.element.getNumero(),
			);
			this.getInstance(this.IdentFenetreAbsences).fermer();
			this.activerFichesEleve(false);
			this.getInstance(this.idSaisieAbsences).setDeplacementBornes(
				this.GenreRessource !== Enumere_Ressource_1.EGenreRessource.Cours,
			);
			if (this.GenreRessource === Enumere_Ressource_1.EGenreRessource.Cours) {
				this.recupererEmploiDuTemps();
				if (!this.avecDateDefaut) {
					this.etatUtilScoEspace.setNavigationCours(null);
				}
				this.avecDateDefaut = false;
			} else {
				this.recupererAbsences();
			}
		}
	}
	afficherFenetreCalendrier(aPourDecompte) {
		this.fenetreCalendrierPourDecompte = aPourDecompte === true;
		this.getInstance(this.identFenetreCalendrier).setDonnees(
			aPourDecompte ? this.dateDecompte : this.Date,
		);
	}
	evenementSurComboDates(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				this.setActif(false);
				this.Date = aParams.element.Date;
				this.moteur.setOptions({ Date: this.Date });
				this.etatUtilScoEspace.setNavigationDate(aParams.element.Date);
				this.setEtatSaisie(false);
				this.Eleve = null;
				this.getInstance(this.IdentComboRessource).setDonnees(
					this.ListeRessources,
					this.SelectionRessource === null ||
						this.SelectionRessource === undefined
						? 0
						: this.SelectionRessource,
				);
				break;
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
				.deploiement:
				if (this.appelDedieEnseignant) {
					this.afficherFenetreCalendrier();
					return false;
				}
				break;
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.fermeture:
				break;
			default:
				break;
		}
	}
	evenementSurDateDepuis(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection:
				if (!aParams.element) {
					break;
				}
				if (this.getInstance(this.idDateDepuis).enInitialisation) {
					this.getInstance(this.idDateDepuis).enInitialisation = false;
					break;
				}
				if (!aParams.element.valeur) {
					this.afficherFenetreCalendrier(true);
					break;
				} else {
					this.dateDecompte = aParams.element.valeur;
					this.genreDecompte = aParams.element.getGenre();
					this.getInstance(this.IdentFenetreAbsences).setDateDepuis(
						this.dateDecompte,
					);
					this.recupererAbsences();
				}
				break;
			case Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
				.deploiement:
				break;
			default:
				break;
		}
	}
	evenementSurEdition(aSaisie, aGenreAbsence, aGenreObservation) {
		if (aSaisie) {
			this.setEtatSaisie(true);
			if (
				aGenreAbsence ===
				Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
			) {
				aGenreAbsence = Enumere_Ressource_1.EGenreRessource.Observation;
			}
			this.getInstance(this.idSaisieAbsences).retourAbsence(
				this.Eleve.Numero,
				aGenreAbsence,
				aGenreObservation,
			);
		}
		this._gestionFocusApresFenetreCellule();
	}
	eventAbsenceParPas(aNumeroBouton, aParamAbsParPas) {
		function _getAbsExisteParPas(aEle) {
			return aEle.N !== "0";
		}
		if (aNumeroBouton === 1 && this.Eleve) {
			const lAbsence = this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
				aParamAbsParPas.absence.getNumero(),
				aParamAbsParPas.absence.getGenre(),
			);
			if (lAbsence) {
				lAbsence.tabAbs = aParamAbsParPas.absence.tabAbs;
				lAbsence.setEtat(
					$.grep(lAbsence.tabAbs, _getAbsExisteParPas).length
						? Enumere_Etat_1.EGenreEtat.Modification
						: Enumere_Etat_1.EGenreEtat.Suppression,
				);
				lAbsence.partielle =
					$.grep(lAbsence.tabAbs, _getAbsExisteParPas).length !== 0;
				this.getInstance(this.idSaisieAbsences).retourAbsence(
					this.Eleve.Numero,
					aParamAbsParPas.absence.getGenre(),
				);
				this.setEtatSaisie(true);
				this._actualiserEDTEleve();
			}
		}
	}
	evenementFenetreCalendrier(aGenreBouton, aDate) {
		if (aGenreBouton === 1 && !this.fenetreCalendrierPourDecompte) {
			let lDateCourant = aDate;
			if (!ObjetDate_1.GDate.estUnJourOuvre(lDateCourant)) {
				this.appScoEspace
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message:
							ObjetTraduction_1.GTraductions.getValeur("Le_Maj") +
							" " +
							ObjetDate_1.GDate.formatDate(lDateCourant, "%JJ/%MM/%AAAA") +
							" n'est pas un jour ouvré",
					});
				do {
					lDateCourant = ObjetDate_1.GDate.getJourSuivant(lDateCourant, -1);
				} while (!ObjetDate_1.GDate.estUnJourOuvre(lDateCourant));
			}
			this.PlaceSaisieDebut = null;
			this.PlaceSaisieFin = null;
			this.moteur.setOptions({
				placeSaisieDebut: this.PlaceSaisieDebut,
				placeSaisieFin: this.PlaceSaisieFin,
			});
			this.setListeDates(lDateCourant);
			this.getInstance(this.IdentComboDates).setDonnees(
				this.ListeDates,
				this.indiceDateSaisieAbsence ? this.indiceDateSaisieAbsence : 0,
			);
		} else if (aGenreBouton === 1) {
			this.dateDecompte = aDate;
			this.genreDecompte = EGenreChoixPeriode.Personnalise;
			this.recupererAbsences();
		}
	}
	evenementSurComboEnseignant(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			ObjetHtml_1.GHtml.setDisplay(
				this.getInstance(this.IdentGrille).getNom(),
				false,
			);
			this.enseignantCourant = MethodesObjet_1.MethodesObjet.dupliquer(
				aParams.element,
			);
			this.etatUtilScoEspace.setListeClasses(
				this.enseignantCourant.getNumero(),
			);
			this.recupererDonneesEnseignant();
			this.SelectionRessource = this.enseignantCourant.existeNumero() ? 0 : 1;
		}
	}
	evenementSurComboPlaceDeb(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.SelectionPlaceDebut = aParams.indice;
			if (
				this.getInstance(this.IdentComboPlaceDeb).estUneInteractionUtilisateur()
			) {
				if (
					this.SelectionPlaceDebut >=
					this.appScoEspace.getObjetParametres().PlacesParJour
				) {
					this.getInstance(this.IdentComboPlaceDeb).setSelectionParIndice(
						(this.SelectionPlaceDebut =
							this.appScoEspace.getObjetParametres().PlacesParJour - 1),
					);
				}
				if (this.SelectionPlaceDebut >= this.SelectionPlaceFin) {
					this.getInstance(this.IdentComboPlaceFin).setSelectionParIndice(
						(this.SelectionPlaceFin = this.SelectionPlaceDebut + 1),
					);
				}
				this.PlaceSaisieDebut =
					this.PlaceGrilleDebut + this.SelectionPlaceDebut;
				this.PlaceSaisieFin =
					this.PlaceGrilleDebut + this.SelectionPlaceFin - 1;
				this.moteur.setOptions({
					placeSaisieDebut: this.PlaceSaisieDebut,
					placeSaisieFin: this.PlaceSaisieFin,
				});
				this.getInstance(this.idSaisieAbsences).setPlacesSaisie(
					this.PlaceSaisieDebut,
					this.PlaceSaisieFin,
				);
				if (
					!this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.absences.avecSaisieCours,
					)
				) {
					this.recupererAbsences();
				}
			}
		}
	}
	evenementSurComboPlaceFin(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.SelectionPlaceFin = aParams.indice;
			if (
				this.getInstance(this.IdentComboPlaceFin).estUneInteractionUtilisateur()
			) {
				if (this.SelectionPlaceFin <= 0) {
					this.getInstance(this.IdentComboPlaceFin).setSelectionParIndice(
						(this.SelectionPlaceFin = 1),
					);
				}
				if (this.SelectionPlaceFin <= this.SelectionPlaceDebut) {
					this.getInstance(this.IdentComboPlaceDeb).setSelectionParIndice(
						(this.SelectionPlaceDebut = this.SelectionPlaceFin - 1),
					);
				}
				this.PlaceSaisieDebut =
					this.PlaceGrilleDebut + this.SelectionPlaceDebut;
				this.PlaceSaisieFin =
					this.PlaceGrilleDebut + this.SelectionPlaceFin - 1;
				this.moteur.setOptions({
					placeSaisieDebut: this.PlaceSaisieDebut,
					placeSaisieFin: this.PlaceSaisieFin,
				});
				this.getInstance(this.idSaisieAbsences).setPlacesSaisie(
					this.PlaceSaisieDebut,
					this.PlaceSaisieFin,
				);
				if (
					!this.appScoEspace.droits.get(
						ObjetDroitsPN_1.TypeDroits.absences.avecSaisieCours,
					)
				) {
					this.recupererAbsences();
				}
			}
		}
	}
	evenementSurCours(aParam) {
		const lAncienCoursSelectionne = this.paramCours.cours;
		this.paramCours = {};
		$.extend(this.paramCours, aParam);
		if (this.paramCours.cours && this.paramCours.cours.coursMultiple) {
			return;
		}
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		this.etatUtilScoEspace.setNavigationCours(this.paramCours.cours);
		this.moteur.setOptions({ Cours: this.paramCours.cours });
		let lMessage;
		if (this.paramCours.cours) {
			lMessage = "";
			if (this.paramCours.cours.estAnnule) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.AppelCoursAnnule",
				);
			} else if (
				!this.paramCours.cours.utilisable &&
				!this.paramCours.cours.estSortiePedagogique
			) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.AppelCoursNonUtilisable",
				).replaceRCToHTML();
			}
			if (lMessage) {
				this._afficherMessageGrilleAbsence(lMessage);
			}
		}
		if (!lMessage && this.paramCours.cours) {
			this.setSelectionRessource(
				Enumere_Ressource_1.EGenreRessource.Cours,
				this.paramCours.cours.getNumero(),
			);
		}
		delete this.Eleve;
		this.activerFichesEleve(false);
		if (
			[
				EGenreChoixPeriode.MoisEnCours,
				EGenreChoixPeriode.TrimestreEnCours,
				EGenreChoixPeriode.SemestreEnCours,
			].includes(this.genreDecompte)
		) {
			this.dateDecompte = null;
		}
		if (
			lAncienCoursSelectionne &&
			this.paramCours.cours &&
			lAncienCoursSelectionne.getNumero() ===
				this.paramCours.cours.getNumero() &&
			!this.paramCours.cours.estSortiePedagogique &&
			this.moduleSaisie
		) {
			if (
				aParam.genre ===
				Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel
			) {
				this.moduleSaisie.afficherMenuContextuelDeCoursGrille(
					this.paramCours.cours,
				);
				return;
			}
			if (
				aParam.genre === Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours &&
				this.moduleSaisie.autorisationEditionCoursAutoriseeSurContexte() &&
				!this.paramCours.cours.coursOrigine &&
				this.paramCours.cours.modifiable &&
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.deplacerCours,
				)
			) {
				this.moduleSaisie.requeteEvaluation(this.paramCours.cours, null);
				return;
			}
		}
		{
			if (!lMessage) {
				this.recupererAbsences();
			} else {
				this._actualiserEDTEleve();
				this.$refreshSelf();
			}
		}
	}
	_evenementFenetreListePunitions(
		aNumeroBouton,
		aGenreEvenementListe,
		aIndiceEleve,
	) {
		if (
			!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePunition,
			)
		) {
			return;
		}
		if (aNumeroBouton === -2) {
			this.appScoEspace
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.aucunePunitionClasse",
					),
				});
		} else if (
			aGenreEvenementListe ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Suppression
		) {
			this.afficherNbElevePresent();
			this.getInstance(this.idSaisieAbsences).actualiserPunitionsEleve(
				this.ListeEleves.get(aIndiceEleve).Numero,
			);
		}
		this._gestionFocusApresFenetreCellule();
	}
	_evenementFenetreSaisiePunitions(aNumeroBouton, aGenreRessource) {
		if (aNumeroBouton !== -1) {
			this.afficherNbElevePresent();
			this.getInstance(this.idSaisieAbsences).actualiserPunitionsEleve(
				this.Eleve.getNumero(),
				aGenreRessource,
			);
			this._actualiserEDTEleve();
			this.setEtatSaisie(true);
		}
		this._gestionFocusApresFenetreCellule();
	}
	_evenementApresConfirmationSuppressionPunition(
		aPunition,
		aNumeroBouton,
		aGenreRessource,
	) {
		if (aNumeroBouton === 0) {
			aPunition.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.afficherNbElevePresent();
			this.getInstance(this.idSaisieAbsences).actualiserPunitionsEleve(
				this.Eleve.getNumero(),
				aGenreRessource,
			);
			this.setEtatSaisie(true);
		}
		this._gestionFocusApresFenetreCellule();
	}
	_ouvrirFenetreSaisiePunition(aPunition, aGenreRessource) {
		aGenreRessource =
			aGenreRessource === null || aGenreRessource === undefined
				? Enumere_Ressource_1.EGenreRessource.Punition
				: aGenreRessource;
		this.moteur._majListeElevesVisible();
		this.getInstance(this.identFenetreSaisiePunitions).setDonnees({
			eleve: this.Eleve,
			listePJ: this.listePJ,
			listeEleves:
				aGenreRessource === Enumere_Ressource_1.EGenreRessource.Punition
					? null
					: MethodesObjet_1.MethodesObjet.dupliquer(this.ListeEleves),
			punition: aPunition,
			listeNature:
				aGenreRessource === Enumere_Ressource_1.EGenreRessource.Punition
					? this.listeNaturePunition
					: this.listeNatureExclusion,
			genreRessource: aGenreRessource,
			placeSaisieDebut: this.PlaceSaisieDebut,
			placeSaisieFin: this.PlaceSaisieFin,
			date: this.Date,
		});
		this.getInstance(this.identFenetreSaisiePunitions).afficher();
	}
	_evenementSurMenuContextuel(aElement) {
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
		) {
			switch (aElement.getNumero()) {
				case this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours:
					this._supprimerEleveDuCours();
					break;
				default:
					if (
						!this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePunition,
						)
					) {
						return;
					}
					if (aElement.existeNumero()) {
						const lNumeroPunition = Math.ceil(aElement.getNumero() / 2) - 1;
						const lPunition = this.Eleve.listePunitions.get(lNumeroPunition);
						const lEstModification = aElement.getNumero() % 2 === 1;
						if (lEstModification) {
							this._ouvrirFenetreSaisiePunition(lPunition);
						} else {
							const lThis = this;
							this.appScoEspace.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.SupprimerPunitionConfirmation",
								),
								callback: function (aGenreAction) {
									lThis._evenementApresConfirmationSuppressionPunition(
										lPunition,
										aGenreAction,
									);
								},
							});
						}
					} else {
						this._ouvrirFenetreSaisiePunition(null);
					}
			}
		} else {
			const lData = aElement.data;
			switch (aElement.getNumero()) {
				case this.moteur.genreCommandeMenuContextVS.supprimer:
					$(
						"#" +
							this.getInstance(this.idSaisieAbsences).getNom().escapeJQ() +
							' .tableAbsenceCorps div[id*="_' +
							this.Eleve.getNumero() +
							"_" +
							lData.genreAbsenceMenuContext +
							"_abs" +
							(lData.genreAbsenceMenuContext ===
							Enumere_Ressource_1.EGenreRessource.Observation
								? "_" + lData.numeroObsMenuContext
								: "") +
							'"]',
					)
						.parent()
						.trigger("click", [null, true]);
					break;
				case this.moteur.genreCommandeMenuContextVS.modifier: {
					let lAttribut = "ListeAbsences";
					if (
						lData.genreAbsenceMenuContext ===
						Enumere_Ressource_1.EGenreRessource.Punition
					) {
						lAttribut = "listePunitions";
					}
					if (
						lData.genreAbsenceMenuContext ===
							Enumere_Ressource_1.EGenreRessource.Punition ||
						lData.genreAbsenceMenuContext ===
							Enumere_Ressource_1.EGenreRessource.Exclusion
					) {
						this._ouvrirFenetreSaisiePunition(
							this.Eleve[lAttribut].getElementParNumeroEtGenre(
								null,
								lData.genreAbsenceMenuContext,
								true,
							),
							lData.genreAbsenceMenuContext,
						);
					} else if (
						lData.genreAbsenceMenuContext ===
						Enumere_Ressource_1.EGenreRessource.Infirmerie
					) {
						this.evenementSurSaisie(
							Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
								.Infirmerie,
							{
								numeroEleve: this.Eleve.getNumero(),
								place: this.PlaceSaisieDebut,
								placeDebut: this.PlaceSaisieDebut,
								placeFin: this.PlaceSaisieFin,
							},
						);
					} else if (
						lData.genreAbsenceMenuContext ===
							Enumere_Ressource_1.EGenreRessource.Retard ||
						lData.genreAbsenceMenuContext ===
							Enumere_Ressource_1.EGenreRessource.Dispense ||
						lData.genreAbsenceMenuContext ===
							Enumere_Ressource_1.EGenreRessource.Observation
					) {
						this.getInstance(this.idSaisieAbsences).ouvrirZoneTexte(
							this.Eleve.getNumero(),
							lData.genreAbsenceMenuContext,
							lData.numeroObsMenuContext,
							lData.genreObservation,
						);
					} else if (
						lData.genreAbsenceMenuContext ===
						Enumere_Ressource_1.EGenreRessource.Absence
					) {
						this.getInstance(this.idSaisieAbsences).ouvrirFenetreAbsencesParPas(
							this.Eleve.getNumero(),
							lData.genreAbsenceMenuContext,
						);
					}
					break;
				}
				case this.moteur.genreCommandeMenuContextVS.modifierMotif:
					if (
						lData.genreAbsenceMenuContext ===
						Enumere_Ressource_1.EGenreRessource.Retard
					) {
						if (
							this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
							)
						) {
							const lInstance = this.getInstance(
								this.idFenetreListeMotifsAbsence,
							);
							if (lInstance) {
								lInstance.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.SelectionnerUnMotifRetard",
									),
									callback: (aNumeroBouton, aMotif) => {
										if (aNumeroBouton === 1) {
											if (aMotif) {
												const lRetard =
													this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
														null,
														lData.genreAbsenceMenuContext,
													);
												if (lRetard && !lRetard.listeMotifs) {
													lRetard.listeMotifs =
														new ObjetListeElements_1.ObjetListeElements();
												}
												if (lRetard && lRetard.listeMotifs) {
													lRetard.listeMotifs.addElement(
														MethodesObjet_1.MethodesObjet.dupliquer(aMotif),
														0,
													);
												}
												this.setEtatSaisie(true);
												lRetard.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
											}
										}
									},
									genreAbsence: lData.genreAbsenceMenuContext,
								});
								const lRetard =
									this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
										null,
										lData.genreAbsenceMenuContext,
									);
								let lSelection = 0;
								if (
									lRetard &&
									lRetard.listeMotifs &&
									lRetard.listeMotifs.count() === 1
								) {
									lSelection =
										Cache_1.GCache.listeMotifsRetards.getIndiceExisteParElement(
											lRetard.listeMotifs.get(0),
										);
								}
								lInstance.setDonnees(
									Cache_1.GCache.listeMotifsRetards,
									false,
									lSelection,
								);
							}
						}
					}
					if (
						lData.genreAbsenceMenuContext ===
						Enumere_Ressource_1.EGenreRessource.Absence
					) {
						if (
							this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.fonctionnalites
									.appelSaisirMotifJustifDAbsence,
							)
						) {
							const lInstance = this.getInstance(
								this.idFenetreListeMotifsAbsence,
							);
							if (lInstance) {
								lInstance.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.SelectionnerUnMotifAbsence",
									),
									callback: (aNumeroBouton, aMotif) => {
										if (aNumeroBouton === 1) {
											if (aMotif) {
												const lAbsence =
													this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
														null,
														lData.genreAbsenceMenuContext,
													);
												if (lAbsence && !lAbsence.listeMotifs) {
													lAbsence.listeMotifs =
														new ObjetListeElements_1.ObjetListeElements();
												}
												if (lAbsence && lAbsence.listeMotifs) {
													lAbsence.listeMotifs.addElement(
														MethodesObjet_1.MethodesObjet.dupliquer(aMotif),
														0,
													);
												}
												this.setEtatSaisie(true);
												lAbsence.setEtat(
													Enumere_Etat_1.EGenreEtat.Modification,
												);
											}
										}
									},
									genreAbsence: lData.genreAbsenceMenuContext,
								});
								const lAbsence =
									this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
										null,
										lData.genreAbsenceMenuContext,
									);
								let lSelection = 0;
								if (
									lAbsence &&
									lAbsence.listeMotifs &&
									lAbsence.listeMotifs.count() === 1
								) {
									lSelection =
										Cache_1.GCache.listeMotifsAbsenceEleve.getIndiceExisteParElement(
											lAbsence.listeMotifs.get(0),
										);
								}
								lInstance.setDonnees(
									Cache_1.GCache.listeMotifsAbsenceEleve,
									false,
									lSelection,
								);
							}
						}
					}
					break;
				case this.moteur.genreCommandeMenuContextVS.creerMemo:
					this.evenementSurSaisie(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.MemosEleves,
						{ numeroEleve: this.Eleve.getNumero() },
					);
					break;
				case this.moteur.genreCommandeMenuContextVS.creerValorisation:
					this.evenementSurSaisie(
						Enumere_EvenementSaisieAbsences_1.EGenreEvenementSaisieAbsence
							.ValorisationsEleve,
						{ numeroEleve: this.Eleve.getNumero() },
					);
					break;
				case this.moteur.genreCommandeMenuContextVS.gestionAPEleve:
					ObjetFenetre_GestionAPEleve_1.GestionAPEleve.ouvrirFenetrePromise(
						this,
						this.Eleve,
						this.Date,
					).then((aResult) => {
						if (aResult && aResult.avecSaisie) {
							this.actionSurValidation();
						}
					});
					break;
				case this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours:
					this._supprimerEleveDuCours();
					break;
				case this.moteur.genreCommandeMenuContextVS.publierObservation: {
					this.setEtatSaisie(true);
					const lObservation = aElement.data.observation;
					lObservation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lObservation.estPubliee = !lObservation.estPubliee;
					this.getInstance(this.idSaisieAbsences).retourAbsence(
						this.Eleve.getNumero(),
						Enumere_Ressource_1.EGenreRessource.Observation,
						lObservation.observation.getNumero(),
					);
					break;
				}
				case this.moteur.genreCommandeMenuContextVS.publierPunition: {
					this.setEtatSaisie(true);
					const lAbsenceOuPunition = aElement.data.punitionExclusion;
					lAbsenceOuPunition.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lAbsenceOuPunition.estPubliee = !lAbsenceOuPunition.estPubliee;
					this.getInstance(this.idSaisieAbsences).retourAbsence(
						this.Eleve.getNumero(),
						lAbsenceOuPunition.getGenre(),
					);
					break;
				}
				default:
			}
		}
		this._gestionFocusApresFenetreCellule();
	}
	eventFenetreMemosEleves() {
		this.getInstance(this.idSaisieAbsences).setDonneesAbsences();
	}
	actualiserMenuContextuel(aObjet) {
		const lInstance = this.getInstance(this.identMenuContextuel),
			lData = {
				genreAbsenceMenuContext: aObjet.genreAbsence,
				numeroObsMenuContext: aObjet.numeroObservation,
			};
		let lAvecModifier = true;
		let lQueConsultationObs = false;
		let lAvecModifierPublication = true;
		let lAvecSupprimer = true;
		const lColonne = this.listeColonnes.getElementParNumero(
			aObjet.numeroObservation,
		);
		if (!!aObjet.dispense && aObjet.dispense.celluleInactive) {
			lAvecModifier = false;
			lAvecSupprimer = false;
		}
		if (
			aObjet.genreAbsence === Enumere_Ressource_1.EGenreRessource.Observation &&
			aObjet.observation &&
			aObjet.observation.avecARObservation &&
			aObjet.observation.dateVisu !== false &&
			aObjet.observation.dateVisu !== undefined
		) {
			lData.genreObservation = lColonne.genreObservation;
			if (aObjet.observation.dateVisu) {
				lAvecSupprimer = false;
				lQueConsultationObs = true;
			}
		}
		lInstance.vider();
		const lLibelle = lQueConsultationObs
			? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Consulter")
			: ObjetTraduction_1.GTraductions.getValeur("Modifier");
		lInstance.addCommande(
			this.moteur.genreCommandeMenuContextVS.modifier,
			lLibelle,
			lAvecModifier,
			lData,
		);
		if (
			aObjet.genreAbsence === Enumere_Ressource_1.EGenreRessource.Retard &&
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieMotifRetard,
			)
		) {
			lInstance.addCommande(
				this.moteur.genreCommandeMenuContextVS.modifierMotif,
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.ModifierMotifRetard",
				),
				lAvecModifier,
				lData,
			);
		}
		if (
			aObjet.genreAbsence === Enumere_Ressource_1.EGenreRessource.Absence &&
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites
					.appelSaisirMotifJustifDAbsence,
			)
		) {
			lInstance.addCommande(
				this.moteur.genreCommandeMenuContextVS.modifierMotif,
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.ModifierMotifAbsence",
				),
				lAvecModifier,
				lData,
			);
		}
		lInstance.addCommande(
			this.moteur.genreCommandeMenuContextVS.supprimer,
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			lAvecSupprimer,
			lData,
		);
		if (
			!!aObjet.dispense &&
			aObjet.dispense.documents &&
			aObjet.dispense.documents.getNbrElementsExistes() > 0 &&
			aObjet.dispense.publierPJFeuilleDAppel
		) {
			if (aObjet.dispense.documents.getNbrElementsExistes() === 1) {
				aObjet.dispense.documents.parcourir((aDoc) => {
					if (aDoc.existe()) {
						lInstance.add(
							ObjetTraduction_1.GTraductions.getValeur("dispenses.consult1Doc"),
							true,
							() => {
								window.open(
									ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDoc, {
										genreRessource:
											Enumere_Ressource_1.EGenreRessource.DocJointEleve,
									}),
								);
							},
						);
					}
				});
			} else {
				lInstance.addSousMenu(
					aObjet.dispense.documents.getNbrElementsExistes() === 1
						? ObjetTraduction_1.GTraductions.getValeur("dispenses.consult1Doc")
						: ObjetTraduction_1.GTraductions.getValeur(
								"dispenses.consultLesDocs",
							),
					(aInstance) => {
						aObjet.dispense.documents.parcourir((aDoc) => {
							if (aDoc.existe()) {
								aInstance.add(aDoc.getLibelle(), true, () => {
									window.open(
										ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aDoc, {
											genreRessource:
												Enumere_Ressource_1.EGenreRessource.DocJointEleve,
										}),
									);
								});
							}
						});
					},
				);
			}
		}
		if (
			aObjet.genreAbsence === Enumere_Ressource_1.EGenreRessource.Observation &&
			aObjet.observation
		) {
			lData.observation = aObjet.observation;
			if (lColonne.publiable) {
				lAvecModifierPublication =
					!aObjet.observation.avecARObservation ||
					aObjet.observation.dateVisu === false ||
					aObjet.observation.dateVisu === undefined;
				const lTradPublier =
					lColonne.genreObservation ===
					TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_ObservationParent
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.PublierParents",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.PublierParentsEleves",
							);
				lInstance.addCommande(
					this.moteur.genreCommandeMenuContextVS.publierObservation,
					aObjet.observation.estPubliee
						? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.Depublier")
						: lTradPublier,
					lAvecModifierPublication,
					lData,
				);
			}
		}
		lInstance.afficher();
	}
	actualiserMenuContextuelJournee(aObjet) {
		const lInstance = this.getInstance(this.identMenuContextuel);
		lInstance.vider();
		if (
			aObjet.avecPunition &&
			!(aObjet.eleve && (aObjet.eleve.sortiePeda || aObjet.eleve.estSorti))
		) {
			lInstance.addCommande(
				0,
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AjouterPunition"),
			);
			if (aObjet.surImage) {
				for (let i = 0; i < this.Eleve.listePunitions.count(); i++) {
					const lPunition = this.Eleve.listePunitions.get(i);
					if (lPunition.existe()) {
						let lStrComplementMotifs = "";
						if (!!lPunition.listeMotifs && lPunition.listeMotifs.count() > 0) {
							lStrComplementMotifs +=
								" - " + lPunition.listeMotifs.getTableauLibelles().join(", ");
						}
						lInstance.addCommande(
							1 + i * 2,
							ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.ModifierPunition",
							) + lStrComplementMotifs,
						);
						lInstance.addCommande(
							2 + i * 2,
							ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SupprimerPunition",
							) + lStrComplementMotifs,
						);
					}
				}
			}
		}
		if (aObjet.eleve && aObjet.eleve.eleveAjouteAuCours) {
			lInstance.addCommande(
				this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours,
				ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.SuppressionEleve"),
				true,
			);
		}
		if (lInstance.getListeLignes().count() > 0) {
			lInstance.afficher();
		}
	}
	evenementEditionInfirmerie(ANumeroBouton, aNumeroEleve, aNewAbs) {
		if (ANumeroBouton !== 0 && ANumeroBouton !== -1) {
			this.setEtatSaisie(true);
			if (aNewAbs) {
				this.ListeEleves.getElementParNumero(aNumeroEleve).setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				this.ListeEleves.getElementParNumero(
					aNumeroEleve,
				).ListeAbsences.addElement(aNewAbs);
			}
			this.getInstance(this.idSaisieAbsences).retourAbsence(
				aNumeroEleve,
				Enumere_Ressource_1.EGenreRessource.Infirmerie,
			);
			this._actualiserEDTEleve();
		}
		this.afficherNbElevePresent();
		this._gestionFocusApresFenetreCellule();
	}
	valider() {
		const lParametresSaisie = {
			cours: this.paramCours.cours,
			date: this.Date,
			listeEleves: this.ListeEleves,
			listeColonnes: this.listeColonnes,
			placeDebut: this.PlaceSaisieDebut,
			placeFin: this.PlaceSaisieFin,
			professeur:
				this.etatUtilScoEspace.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
					? this.enseignantCourant
					: null,
			listeFichiers: this.listePJ,
		};
		new ObjetRequeteSaisieAbsences_1.ObjetRequeteSaisieAbsences(
			this,
			this.actionSurValidation,
		)
			.addUpload({ listeFichiers: this.listePJ })
			.lancerRequete(lParametresSaisie);
	}
	actionSurValidation() {
		super.actionSurValidation();
		if (this.getInstance(this.idSaisieAbsences)) {
			this.getInstance(this.idSaisieAbsences).setDonneesAbsences();
		}
	}
	recupererDonnees() {
		if (this.getInstance(this.IdentComboEnseignant)) {
			this.getInstance(this.IdentComboEnseignant).setDonnees(
				this.listeEnseignants,
				0,
			);
		} else {
			this.recupererDonneesEnseignant();
		}
	}
	recupererDonneesEnseignant() {
		this.Eleve = null;
		this.paramCours = {};
		new ObjetRequetePageSaisieAbsences_General_1.ObjetRequetePageSaisieAbsences_General(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	recupererEmploiDuTemps() {
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		this.objetRequete_PageEmploiDuTemps =
			new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
				this,
				this.actionSurRecupererEmploiDuTemps,
			);
		this.objetRequete_PageEmploiDuTemps.lancerRequete({
			ressource: this.enseignantCourant,
			dateDebut: this.Date,
			estEDTPermanence: this.estEDTDesPermanences,
			avecCoursSortiePeda: true,
		});
	}
	recupererAbsences(aParam) {
		if (this.estAppelEtSuivi) {
			this.getInstance(this.idDateDepuis).enInitialisation = true;
		}
		new ObjetRequetePageSaisieAbsences_1.ObjetRequetePageSaisieAbsences(
			this,
			this.actionSurRecupererAbsences.bind(this, aParam),
		).lancerRequete({
			professeur: this.enseignantCourant,
			numeroRessource: this.NumeroRessource,
			date: this.Date,
			dateDecompte: this.dateDecompte,
			genreDecompte: this.genreDecompte,
			placeDebut: this.PlaceSaisieDebut,
			placeFin: this.PlaceSaisieFin,
			coursSortiePeda:
				this.paramCours.cours && this.paramCours.cours.estSortiePedagogique
					? this.paramCours.cours
					: null,
		});
	}
	recupererAbsencesCours(aCours, aGenreAbsence, aNumeroObservation) {
		const lParamsRequete = {
			eleve: this.Eleve,
			professeur: this.enseignantCourant,
			placeDebut: this.PlaceSaisieDebut,
			placeFin: this.PlaceSaisieFin,
			dateDecompte: this.dateDecompte
				? this.dateDecompte
				: this.appScoEspace.getObjetParametres().PremiereDate,
			cours: aCours,
			genreAbsence: aGenreAbsence,
			observation: new ObjetElement_1.ObjetElement("", aNumeroObservation),
		};
		const lDomaine = this.appScoEspace.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.domaineRecapitulatifAbsences,
		);
		if (lDomaine && !lDomaine.estVide()) {
			lParamsRequete.domaine = lDomaine;
		} else {
			lParamsRequete.dateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
				this.PlaceSaisieDebut,
			);
			lParamsRequete.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
				this.PlaceSaisieFin,
			);
		}
		new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
			this,
			this.actionSurRecupererDetailAbsences,
		).lancerRequete(lParamsRequete);
	}
	setListeDates(aDate) {
		this.ListeDates = new ObjetListeElements_1.ObjetListeElements();
		const lElement = new ObjetElement_1.ObjetElement();
		lElement.Date = aDate;
		lElement.Libelle = ObjetDate_1.GDate.formatDate(
			lElement.Date,
			"%JJ/%MM/%AAAA",
		);
		this.ListeDates.addElement(lElement);
	}
	actionSurRecupererDonnees(aDonnees) {
		this.ListeRessources =
			this.appelDedieEnseignant ||
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieHorsCours,
			) ||
			!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieCours,
			)
				? this.etatUtilScoEspace.getListeClasses({
						avecClasse: true,
						avecGroupe: true,
						uniquementClasseEnseignee: true,
					})
				: new ObjetListeElements_1.ObjetListeElements();
		const lAvecClasse =
			this.ListeRessources.getElementParGenre(
				Enumere_Ressource_1.EGenreRessource.Classe,
			) !== null;
		const lAvecGroupe =
			this.ListeRessources.getElementParGenre(
				Enumere_Ressource_1.EGenreRessource.Groupe,
			) !== null;
		if (
			this.enseignantCourant.existeNumero() &&
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieCours,
			)
		) {
			this.ListeRessources.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur("accueil.emploiDuTemps"),
					0,
					Enumere_Ressource_1.EGenreRessource.Cours,
				),
			);
		}
		if (
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur ||
			!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieCours,
			) ||
			(!this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAppelEtVS,
			) &&
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieHorsCours,
				))
		) {
			$("#" + this.Instances[this.IdentComboRessource].getNom().escapeJQ()).css(
				{ height: "25px" },
			);
			$("#" + this.Instances[this.IdentGrille].getNom().escapeJQ()).css({
				top: "25px",
			});
			this.getInstance(this.IdentComboRessource).setVisible(true);
			if (lAvecClasse) {
				this.ListeRessources.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("Classe"),
						0,
						Enumere_Ressource_1.EGenreRessource.Classe,
					),
				);
			}
			if (lAvecGroupe) {
				this.ListeRessources.addElement(
					new ObjetElement_1.ObjetElement(
						ObjetTraduction_1.GTraductions.getValeur("Groupe"),
						0,
						Enumere_Ressource_1.EGenreRessource.Groupe,
					),
				);
			}
		}
		for (let I = 0; I < this.ListeRessources.count(); I++) {
			const LElement = this.ListeRessources.get(I);
			LElement.ClassAffichage = LElement.existeNumero()
				? "PetitEspaceGauche"
				: "Gras";
			LElement.AvecSelection =
				LElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Cours ||
				LElement.existeNumero();
		}
		this.ListeRessources.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.getGenre() === Enumere_Ressource_1.EGenreRessource.Cours
					? -1
					: D.getGenre();
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.existeNumero();
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		this.ListeRessources.trier();
		this.listeMotifs = aDonnees.listeMotifs;
		this.motif = this.listeMotifs.get(0).Numero;
		this.listeNaturePunition = aDonnees.listeNaturePunition;
		this.listeNatureExclusion = aDonnees.listeNatureExclusion;
		this.avecCommentaireAutorise = aDonnees.avecCommentaireAutorise;
		this.setDonneesBandeau(
			this.ListeDates,
			this.appScoEspace.getObjetParametres().LibellesHeures,
		);
	}
	actionSurRecupererEmploiDuTemps(aParam) {
		for (let I = 0; I < aParam.listeCours.count(); I++) {
			const lElementCours = aParam.listeCours.get(I);
			if (!lElementCours.estSortiePedagogique) {
				for (let J = 0; J < lElementCours.ListeContenus.count(); J++) {
					const lElementContenu = lElementCours.ListeContenus.get(J);
					const lGenre = lElementContenu.getGenre();
					if (
						lGenre === Enumere_Ressource_1.EGenreRessource.Matiere ||
						lGenre === Enumere_Ressource_1.EGenreRessource.Classe ||
						lGenre === Enumere_Ressource_1.EGenreRessource.Groupe ||
						lGenre === Enumere_Ressource_1.EGenreRessource.PartieDeClasse ||
						lGenre === Enumere_Ressource_1.EGenreRessource.Salle ||
						lGenre === Enumere_Ressource_1.EGenreRessource.Personnel ||
						lElementContenu.marqueur ===
							TypeHttpMarqueurContenuCours_1.TypeHttpMarqueurContenuCours
								.hmcc_ReservePar
					) {
						lElementContenu.Visible = true;
					} else {
						lElementContenu.Visible = false;
					}
				}
			}
		}
		this.ListeCours = aParam.listeCours;
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentGrille).getNom(),
			true,
		);
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		if (!this.grilleEleveEstInitialisee) {
			this.grilleEleveEstInitialisee = true;
			this._afficherEDTEleve();
		}
		Object.assign(this.donneesGrille, {
			date: ObjetDate_1.GDate.getDateDemiJour(this.Date),
			listeCours: this.ListeCours,
			avecCoursAnnule: this.etatUtilScoEspace.getAvecCoursAnnule(),
		});
		this.getInstance(this.IdentGrille).setDonnees(this.donneesGrille);
		const lCours =
			this.etatUtilScoEspace._coursASelectionner ||
			this.etatUtilScoEspace.getNavigationCours();
		delete this.etatUtilScoEspace._coursASelectionner;
		const lIndiceCours =
			new ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence().getIndiceCoursParPlace(
				this.ListeCours,
				aParam.placeCourante,
				false,
			);
		let lAvecCoursSelectionne = false;
		if (lCours !== null && lCours !== undefined) {
			lAvecCoursSelectionne = this.getInstance(this.IdentGrille)
				.getInstanceGrille()
				.selectionnerCours(lCours, true);
		} else if (lIndiceCours !== null && lIndiceCours !== undefined) {
			lAvecCoursSelectionne = this.getInstance(this.IdentGrille)
				.getInstanceGrille()
				.selectionnerElementParIndice(lIndiceCours, true);
		}
		if (!lAvecCoursSelectionne) {
			this._deselectionCours();
		}
	}
	actionSurRecupererAbsences(aParam, aData) {
		this.setEtatSaisie(false);
		this.ListeEleves = aData.listeEleves;
		this.listePJ = new ObjetListeElements_1.ObjetListeElements();
		if (this.Eleve && this.Eleve.getNumero()) {
			this.Eleve = this.ListeEleves.getElementParNumero(this.Eleve.getNumero());
		}
		this.listeElevesStage = aData.listeElevesEnStage;
		this.listeClasses = aData.listeClasses;
		this.listeDates = aData.listeDates;
		this.listeColonnes = aData.listeTitreColonnes;
		this.DureeRetard = aData.dureeRetard;
		this.calculAutoDureeRetard = aData.calculAutoDureeRetard;
		this.genreRepas = aData.genreRepas;
		this.PlaceGrilleDebut = aData.placeGrilleDebut;
		this.avecSuppressionAutreAbsence = aData.avecSupprAutreAbs;
		this.avecModifRetardVS = aData.avecModifRetardVS;
		this.PlaceSaisieDebut = this.PlaceInitialeSaisieDebut = aData.placeDeb;
		this.PlaceSaisieFin = this.PlaceInitialeSaisieFin = aData.placeFin;
		this.ajoutEleveAutorise = aData.jsonReponse.ajoutEleveAutorise;
		this.publierParDefautPassageInf = aData.publierParDefautPassageInf;
		this.messageSortiePeda = aData.jsonReponse.messageSortiePeda;
		this.elevesDetaches = aData.jsonReponse.elevesDetaches;
		this.nombreDemandesDispense = aData.jsonReponse.nombreDemandesDispense;
		this.listeDemandesDispense = aData.jsonReponse.listeDemandesDispense;
		this.infoMaxlength = aData.jsonReponse.maxlength;
		this.updateDemandesDispence();
		this.moteur.setOptions({
			placeSaisieDebut: this.PlaceSaisieDebut,
			placeSaisieFin: this.PlaceSaisieFin,
			listeColonnes: this.listeColonnes,
			listeEleves: this.ListeEleves,
			dureeRetard: this.DureeRetard,
			calculAutoDureeRetard: this.calculAutoDureeRetard,
			autorisations: {
				jourConsultUniquement: this.jourConsultUniquement,
				avecSaisieAbsence: this.appelDedieEnseignant
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsence,
						),
				avecSaisieRetard: this.appelDedieEnseignant
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisieRetard,
						),
				avecSaisieDispense: this.appelDedieEnseignant
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.dispenses.saisie,
						),
				suppressionAbsenceDeVS: this.avecSuppressionAutreAbsence,
				suppressionRetardDeVS: this.avecModifRetardVS,
				saisieAbsenceOuverte: this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsenceOuverte,
				),
				saisieHorsCours:
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieHorsCours,
							),
			},
		});
		this.getInstance(this.idSaisieAbsences).setDonneesBandeauAbsences(
			this.DureeRetard,
			this.listeMotifs,
		);
		this.setActif(!aData.message);
		if (this.existeInstance(this.IdentFenetreAbsences)) {
			this.getInstance(this.IdentFenetreAbsences).fermer();
		}
		if (this.existeInstance(this.idFenetreCalCDC)) {
			this.getInstance(this.idFenetreCalCDC).fermer();
		}
		if (this.existeInstance(this.idFenetreInfirmerie)) {
			this.getInstance(this.idFenetreInfirmerie).fermer();
		}
		if (this.existeInstance(this.identFenetreSaisiePunitions)) {
			this.getInstance(this.identFenetreSaisiePunitions).fermer();
		}
		if (this.estAppelEtSuivi) {
			this.dateDecompte = this.listeDates.dateDecompte.valeur;
			this.genreDecompte = this.listeDates.dateDecompte.getGenre();
			this.getInstance(this.idDateDepuis).setDonnees(this.listeDates);
			this.getInstance(this.idDateDepuis).setSelectionParNumeroEtGenre(
				null,
				this.genreDecompte,
			);
			this.getInstance(this.idDateDepuis).setContenu(
				ObjetDate_1.GDate.formatDate(this.dateDecompte, "%JJ/%MM/%AAAA"),
			);
		}
		if (aData.message) {
			this._afficherMessageGrilleAbsence(aData.message);
			return;
		}
		const lInstance = this;
		this.getInstance(this.idSaisieAbsences).setDonneesAbsences({
			moteur: this.moteur,
			enseignantCourant: this.enseignantCourant.getNumero(),
			listeEleves: this.ListeEleves,
			placeGrilleDebut: this.PlaceGrilleDebut,
			placeSaisieDebut: this.PlaceInitialeSaisieDebut,
			placeSaisieFin: this.PlaceInitialeSaisieFin,
			dureeRetard: this.DureeRetard,
			genreRepas: this.genreRepas,
			date: this.Date,
			dateDecompte: this.dateDecompte,
			autorisations: {
				saisieAbsenceOuverte: this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsenceOuverte,
				),
				saisieHorsCours:
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieHorsCours,
							),
				suppressionAutreAbsence: this.avecSuppressionAutreAbsence,
				saisieGrille:
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences
									.avecSaisieSurGrilleAppelProf,
							)
						: this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieSurGrille,
							),
				saisiePunition:
					this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? false
						: this.appScoEspace.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisiePunition,
							),
				suppressionAbsenceDeVS: this.avecSuppressionAutreAbsence,
				suppressionRetardDeVS: this.avecModifRetardVS,
				saisieAbsence: this.appelDedieEnseignant
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsence,
						),
				saisieRetard: this.appelDedieEnseignant
					? true
					: this.appScoEspace.droits.get(
							ObjetDroitsPN_1.TypeDroits.absences.avecSaisieRetard,
						),
				saisieDefautCarnet: this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieDefautCarnet,
				),
				ajoutEleveAutorise: this.ajoutEleveAutorise,
			},
			cours: this.paramCours.cours,
			estCours:
				this.GenreRessource === Enumere_Ressource_1.EGenreRessource.Cours,
			listeElevesStage: aData.listeElevesEnStage,
			message: aData.message,
			listeColonnes: this.listeColonnes,
			callbackAjoutEleve: this.ajoutEleveAutorise
				? () => {
						if (this.etatUtilScoEspace.EtatSaisie) {
							(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
								lInstance.afficherPage({
									callbackFinAfficherPage: function () {
										lInstance
											.getInstance(lInstance.idFenetreSelectionElevesSansCours)
											.setDonnees(
												lInstance.paramCours.cours,
												lInstance.Date,
												lInstance.ListeEleves,
											);
									},
								});
							});
						} else {
							lInstance
								.getInstance(lInstance.idFenetreSelectionElevesSansCours)
								.setDonnees(
									lInstance.paramCours.cours,
									lInstance.Date,
									lInstance.ListeEleves,
								);
						}
					}
				: null,
		});
		this.afficherNbElevePresent();
		$("#" + this.Nom.escapeJQ() + "_Appel_Termine").css(
			"display",
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieCours,
			) &&
				this.paramCours.cours &&
				(this.ajoutEleveAutorise ||
					this.ListeEleves.getListeElements((aEle) => {
						return aEle.existeNumero();
					}).count() > 0)
				? ""
				: "none",
		);
		$("#" + this.Nom.escapeJQ() + "_Appel_Termine").width(
			$(
				"#" +
					this.getInstance(this.idSaisieAbsences).getNom().escapeJQ() +
					" table:first",
			).width(),
		);
		this._actualiserEDTEleve();
		if (aParam && aParam.callbackFinAfficherPage) {
			aParam.callbackFinAfficherPage();
		}
	}
	getLibelleGenreAbsence(aGenreAbsence, aPluriel) {
		switch (aGenreAbsence) {
			case Enumere_Ressource_1.EGenreRessource.Absence:
				return ObjetTraduction_1.GTraductions.getValeur(
					aPluriel ? "Absence.CoursManques" : "Absence.CoursManque",
				);
			case Enumere_Ressource_1.EGenreRessource.Retard:
				return ObjetTraduction_1.GTraductions.getValeur(
					aPluriel ? "Absence.Retards" : "Absence.Retard",
				);
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
				return ObjetTraduction_1.GTraductions.getValeur(
					aPluriel ? "Absence.Exclusions" : "Absence.Exclusion",
				);
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				return ObjetTraduction_1.GTraductions.getValeur(
					aPluriel ? "Absence.Infirmeries" : "Absence.Infirmerie",
				);
			case Enumere_Ressource_1.EGenreRessource.Punition:
				return ObjetTraduction_1.GTraductions.getValeur(
					aPluriel ? "Absence.Punitions" : "Absence.Punition",
				);
			case Enumere_Ressource_1.EGenreRessource.Dispense:
				return ObjetTraduction_1.GTraductions.getValeur(
					aPluriel ? "Absence.DispensesCour" : "Absence.DispenseCour",
				);
			default:
				break;
		}
		return "";
	}
	getTitreFenetreAbsences(aGenreAbsence, aNumObs) {
		let lTexte = ObjetTraduction_1.GTraductions.getValeur("Absence.Absences");
		if (aGenreAbsence && !aNumObs) {
			lTexte = this.getLibelleGenreAbsence(aGenreAbsence, true);
		} else if (aNumObs) {
			lTexte = this.listeColonnes.getElementParNumeroEtGenre(
				aNumObs,
				aGenreAbsence,
			).Libelle;
		}
		return (
			this.Eleve.getLibelle() +
			" - " +
			ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur("Absence.TitreListeEvnmts"),
				[
					lTexte,
					ObjetDate_1.GDate.formatDate(
						this.dateDecompte
							? this.dateDecompte
							: this.appScoEspace.getObjetParametres().PremiereDate,
						"%JJ/%MM/%AAAA",
					),
				],
			)
		);
	}
	getMessageAucunFenetreAbsences(aGenreAbsence, aNumObs) {
		let lTexte = ObjetTraduction_1.GTraductions.getValeur(
			"Absence.AucuneAbsence",
		);
		switch (aGenreAbsence) {
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lTexte = ObjetTraduction_1.GTraductions.getValeur(
					"Absence.AucunRetard",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				lTexte = ObjetTraduction_1.GTraductions.getValeur(
					"Absence.AucuneInfirmerie",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Punition:
				lTexte = ObjetTraduction_1.GTraductions.getValeur(
					"Absence.AucunePunition",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
				lTexte = ObjetTraduction_1.GTraductions.getValeur(
					"Absence.AucuneExclusion",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Dispense:
				lTexte = ObjetTraduction_1.GTraductions.getValeur(
					"Absence.AucuneDispense",
				);
				break;
			case Enumere_Ressource_1.EGenreRessource.Observation: {
				const lObservation = this.listeColonnes.getElementParNumeroEtGenre(
					aNumObs,
					aGenreAbsence,
				);
				switch (lObservation.genreObservation) {
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_ObservationParent:
						lTexte = ObjetTraduction_1.GTraductions.getValeur(
							"Absence.AucuneObservationParents",
						);
						break;
					case TypeGenreObservationVS_1.TypeGenreObservationVS
						.OVS_Encouragement:
						lTexte = ObjetTraduction_1.GTraductions.getValeur(
							"Absence.AucunEncouragement",
						);
						break;
					case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet:
						lTexte = ObjetTraduction_1.GTraductions.getValeur(
							"Absence.AucunDefautDeCarnet",
						);
						break;
					case TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres:
						return ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"Absence.AucuneObservationAutres",
							),
							[
								lObservation.Libelle,
								ObjetDate_1.GDate.formatDate(
									this.dateDecompte
										? this.dateDecompte
										: this.appScoEspace.getObjetParametres().PremiereDate,
									"%JJ/%MM/%AAAA",
								),
							],
						);
				}
				break;
			}
		}
		return ObjetChaine_1.GChaine.format(lTexte, [
			ObjetDate_1.GDate.formatDate(
				this.dateDecompte
					? this.dateDecompte
					: this.appScoEspace.getObjetParametres().PremiereDate,
				"%JJ/%MM/%AAAA",
			),
		]);
	}
	actionSurRecupererDetailAbsences(aListeAbsences) {
		if (
			this.recapitulatifEleve &&
			this.recapitulatifEleve.genreAbsence ===
				Enumere_Ressource_1.EGenreRessource.Observation &&
			this.listeColonnes.getElementParNumeroEtGenre(
				this.recapitulatifEleve.numeroObservation,
				this.recapitulatifEleve.genreAbsence,
			).genreObservation ===
				TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
		) {
			if (
				this.existeInstance(this.IdentFenetreAbsences) &&
				this.getInstance(this.IdentFenetreAbsences).estAffiche()
			) {
				this.getInstance(this.IdentFenetreAbsences).fermer();
			}
			const lListeCDC = aListeAbsences.listeAbsences.getListeElements(
				(element) => {
					return element.estUnDeploiement !== true;
				},
			);
			for (let i = 0; i < lListeCDC.count(); i++) {
				const lElement = lListeCDC.get(i);
				lElement.date = ObjetDate_1.GDate.placeAnnuelleEnDate(
					lElement.placeDebut,
				);
			}
			this.getInstance(this.idFenetreCalCDC).afficherDefautCarnet(
				{ premiereDate: this.dateDecompte, derniereDate: this.Date },
				lListeCDC,
			);
		} else {
			this.getInstance(this.IdentFenetreAbsences).setMessageAucun(
				this.getMessageAucunFenetreAbsences(
					this.recapitulatifEleve ? this.recapitulatifEleve.genreAbsence : null,
					this.recapitulatifEleve
						? this.recapitulatifEleve.numeroObservation
						: null,
				),
			);
			this.getInstance(this.IdentFenetreAbsences).setDonnees(
				this.listeDates,
				this.dateDecompte,
				this.recapitulatifEleve !== null &&
					this.recapitulatifEleve !== undefined
					? this.paramCours.cours
					: null,
				this.Eleve,
				aListeAbsences,
				this.recapitulatifEleve !== null &&
					this.recapitulatifEleve !== undefined
					? this.recapitulatifEleve.genreAbsence
					: null,
				this.recapitulatifEleve !== null &&
					this.recapitulatifEleve !== undefined &&
					this.recapitulatifEleve.genreAbsence ===
						Enumere_Ressource_1.EGenreRessource.Observation
					? this.listeColonnes.getElementParNumeroEtGenre(
							this.recapitulatifEleve.numeroObservation,
							this.recapitulatifEleve.genreAbsence,
						).avecARObservation
					: false,
			);
			let lTitreFenetre;
			if (
				this.recapitulatifEleve !== null &&
				this.recapitulatifEleve !== undefined
			) {
				lTitreFenetre = this.getTitreFenetreAbsences(
					this.recapitulatifEleve.genreAbsence,
					this.recapitulatifEleve.numeroObservation,
				);
			} else {
				lTitreFenetre = this.getTitreFenetreAbsences();
			}
			this.getInstance(this.IdentFenetreAbsences).setOptionsFenetre({
				titre: lTitreFenetre,
			});
			if (
				this.existeInstance(this.idFenetreCalCDC) &&
				this.getInstance(this.idFenetreCalCDC).estAffiche()
			) {
				this.getInstance(this.idFenetreCalCDC).fermer();
			}
			this.getInstance(this.IdentFenetreAbsences).afficher();
		}
	}
	evenementSurFenetreAbsence(aDate, aCours, aGenreAbsence, aNumeroObservation) {
		if (aDate instanceof Date) {
			const lParamsRequete = {
				eleve: this.Eleve,
				professeur: this.enseignantCourant,
				placeDebut: this.PlaceSaisieDebut,
				placeFin: this.PlaceSaisieFin,
				cours: aCours,
				genreAbsence: aGenreAbsence,
				observation: new ObjetElement_1.ObjetElement("", aNumeroObservation),
			};
			this.dateDecompte = aDate;
			lParamsRequete.dateDecompte = this.dateDecompte;
			const lDomaine = this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.domaineRecapitulatifAbsences,
			);
			if (lDomaine && !lDomaine.estVide()) {
				lParamsRequete.domaine = lDomaine;
			} else {
				lParamsRequete.dateDebut = ObjetDate_1.GDate.placeAnnuelleEnDate(
					this.PlaceSaisieDebut,
				);
				lParamsRequete.dateFin = ObjetDate_1.GDate.placeAnnuelleEnDate(
					this.PlaceSaisieFin,
				);
			}
			new ObjetRequeteDetailAbsences_1.ObjetRequeteDetailAbsences(
				this,
				this.actionSurRecupererDetailAbsences,
			).lancerRequete(lParamsRequete);
		}
		this._gestionFocusApresFenetreRecap();
	}
	afficherPage(aParam) {
		this.recupererAbsences(aParam);
	}
	_evenementFenetreListeMotifsAbsence(
		aEleve,
		AGenreAbsence,
		APlaceDebut,
		APlaceFin,
		aTypeObservation,
		aListeMotifs,
		aNumeroBouton,
		aMotif,
	) {
		if (aNumeroBouton === 1) {
			const LAbsence = this.moteur.creerAbsence(
				aEleve,
				AGenreAbsence,
				APlaceDebut,
				APlaceFin,
				AGenreAbsence === Enumere_Ressource_1.EGenreRessource.Retard
					? this.DureeRetard
					: null,
				null,
				aTypeObservation,
				aListeMotifs,
			);
			LAbsence.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
			if (aMotif) {
				LAbsence.listeMotifs.addElement(
					MethodesObjet_1.MethodesObjet.dupliquer(aMotif),
				);
			}
		}
		this._apresModificationAbsence(aEleve, AGenreAbsence, aTypeObservation);
	}
	_apresModificationAbsence(aEleve, AGenreAbsence, aTypeObservation) {
		if (
			AGenreAbsence ===
			Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve
		) {
			AGenreAbsence = Enumere_Ressource_1.EGenreRessource.Observation;
		}
		this.moteur.calculerInfosEleve(aEleve);
		this.setEtatSaisie(true);
		this.afficherNbElevePresent();
		this.getInstance(this.idSaisieAbsences).retourAbsence(
			aEleve.Numero,
			AGenreAbsence,
			aTypeObservation,
		);
		this._actualiserEDTEleve();
	}
	setActif(AActif) {
		this.Actif = AActif;
		this.actualiser();
	}
	actualiser() {
		this.actualiserBandeau();
		this.actualiserAbsences();
	}
	actualiserBandeau() {
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Bandeau", this.Actif);
		if (this.Actif) {
			const LEstUnCours =
				this.GenreRessource === Enumere_Ressource_1.EGenreRessource.Cours;
			let lMessage = "";
			this.getInstance(this.IdentComboPlaceDeb).setVisible(!LEstUnCours);
			this.getInstance(this.IdentComboPlaceFin).setVisible(!LEstUnCours);
			ObjetStyle_1.GStyle.setVisible(
				this.Nom + "_Bandeau_MessageSuite",
				!LEstUnCours,
			);
			const LPlaceSaisieDebut =
				this.PlaceSaisieDebut %
				this.appScoEspace.getObjetParametres().PlacesParJour;
			const LPlaceSaisieFin =
				1 +
				(this.PlaceSaisieFin %
					this.appScoEspace.getObjetParametres().PlacesParJour);
			if (LEstUnCours) {
				lMessage =
					ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.Traduction_PourLeCoursDe",
					) +
					" " +
					this.appScoEspace
						.getObjetParametres()
						.LibellesHeures.getLibelle(LPlaceSaisieDebut) +
					" " +
					ObjetTraduction_1.GTraductions.getValeur("A") +
					" " +
					this.appScoEspace
						.getObjetParametres()
						.LibellesHeures.getLibelle(LPlaceSaisieFin);
			} else {
				this.getInstance(this.IdentComboPlaceDeb).setSelectionParNumeroEtGenre(
					null,
					LPlaceSaisieDebut,
				);
				this.getInstance(this.IdentComboPlaceFin).setSelectionParNumeroEtGenre(
					null,
					LPlaceSaisieFin,
				);
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.Traduction_PourLeCreneauDe",
				);
			}
			ObjetHtml_1.GHtml.setHtml(
				this.Nom + "_Bandeau_Message",
				ObjetChaine_1.GChaine.insecable(lMessage),
			);
		}
	}
	actualiserBandeauAbsences() {
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_BandeauAbsences", this.Actif);
	}
	actualiserAbsences() {
		this.getInstance(this.idSaisieAbsences).setActif(this.Actif);
	}
	setSelectionRessource(AGenreRessource, ANumeroRessource) {
		this.GenreRessource = AGenreRessource;
		this.NumeroRessource = ANumeroRessource;
	}
	setDonneesBandeau(AListeDates, AListeHeures) {
		this.indiceDateSaisieAbsence =
			this.etatUtilScoEspace.getIndiceDateSaisieAbsence();
		this.avecDateDefaut = false;
		if (this.indiceDateSaisieAbsence === -1) {
			this.indiceDateSaisieAbsence = 0;
		} else {
			this.avecDateDefaut = true;
		}
		if (
			!this.avecAnciennesFeuilleDAppel &&
			(this.ListeDates.count() > 1 || this.appelDedieEnseignant)
		) {
			this.getInstance(this.IdentDate).setVisible(false);
			this.getInstance(this.IdentSelectDate).setVisible(false);
			this.getInstance(this.IdentComboDates).setVisible(true);
			this.actualiserDonneesCombos(AListeDates, AListeHeures);
		} else {
			if (this.avecAnciennesFeuilleDAppel) {
				this.getInstance(this.IdentDate).setVisible(false);
				this.getInstance(this.IdentComboDates).setVisible(false);
				this.getInstance(this.IdentSelectDate).setVisible(true);
				let lDate = this.etatUtilScoEspace.getNavigationDate()
					? this.etatUtilScoEspace.getNavigationDate()
					: !!AListeDates && AListeDates.count()
						? AListeDates.get(0).Date
						: ObjetDate_1.GDate.getDateCourante(true);
				lDate = ObjetDate_1.GDate.getDateJour(lDate);
				this.getInstance(this.IdentSelectDate).setActif(true);
				this.getInstance(this.IdentSelectDate).setDonnees(lDate, true);
			} else if (this.ListeDates.count()) {
				this.getInstance(this.IdentComboDates).setVisible(false);
				this.getInstance(this.IdentSelectDate).setVisible(false);
				this.getInstance(this.IdentDate).setVisible(true);
				this.getInstance(this.IdentDate).setDonnees(
					ObjetDate_1.GDate.formatDate(
						AListeDates.get(0).Date,
						"%JJ/%MM/%AAAA",
					),
				);
				this.actualiserDonneesCombos(AListeDates, AListeHeures);
			} else {
				this.getInstance(this.IdentComboDates).setVisible(false);
				this.getInstance(this.IdentSelectDate).setVisible(false);
				if (this.estAppelEtSuivi) {
					this.getInstance(this.idDateDepuis).setVisible(false);
				}
				this.afficher(
					this.composeMessage(
						ObjetTraduction_1.GTraductions.getValeur(
							"Absence.FeuilleDAppel_SaisieImpossibleNonOuvre",
						),
					),
				);
			}
		}
	}
	actualiserDonneesCombos(AListeDates, AListeHeures) {
		this.getInstance(this.IdentComboDates).setDonnees(
			AListeDates,
			this.indiceDateSaisieAbsence,
		);
		this.getInstance(this.IdentComboPlaceDeb).setDonnees(AListeHeures);
		this.getInstance(this.IdentComboPlaceFin).setDonnees(AListeHeures);
	}
	afficherNbElevePresent() {
		const lObjNbEleve = this.moteur.calculerNbElevePresent();
		const H = [];
		const lEstSortiePeda =
			this.paramCours.cours && this.paramCours.cours.estSortiePedagogique;
		if (this.paramCours.cours && this.paramCours.cours.estAppelVerrouille) {
			H.push(
				'<div style="margin-right:5px;" class="InlineBlock ' +
					(this.paramCours.cours.AppelFait
						? "Image_AppelVerrouFait"
						: "Image_AppelVerrouNonFait") +
					' AlignementMilieuVertical" style="width:16px;height:16px;" title="' +
					(lEstSortiePeda
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.VerrouAppelFaitSP",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.HintVerrouille",
							)) +
					'"></div>',
			);
		}
		H.push(
			lObjNbEleve.nbElevesPresents > 1
				? ObjetChaine_1.GChaine.format(
						lEstSortiePeda
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.ElevesPresentsSP",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.ElevesPresents",
								),
						[lObjNbEleve.nbElevesPresents],
					)
				: lObjNbEleve.nbElevesPresents === 1
					? lEstSortiePeda
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.ElevePresentSP",
							)
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ElevePresent")
					: lEstSortiePeda
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.AucunElevePresentSP",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.AucunElevePresent",
							),
		);
		if (
			this.listeElevesStage &&
			this.listeElevesStage.count &&
			this.listeElevesStage.count() > 0
		) {
			H.push(
				'&nbsp;-&nbsp;<span title="',
				ObjetChaine_1.GChaine.toTitle(
					this.listeElevesStage.getTableauLibelles().join("\n"),
				),
				'">',
				this.listeElevesStage.count() === 1
					? ObjetTraduction_1.GTraductions.getValeur("Absence.EleveEnStage")
					: ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur("Absence.ElevesEnStage"),
							[this.listeElevesStage.count()],
						),
				"</span>",
			);
		}
		if (this.elevesDetaches && this.elevesDetaches.str) {
			H.push(
				'&nbsp;-&nbsp;<span title="',
				ObjetChaine_1.GChaine.toTitle(this.elevesDetaches.hint),
				'">' + this.elevesDetaches.str + "</span>",
			);
		}
		$("#" + this.Nom.escapeJQ() + "_Nb_Eleve_Present").ieHtml(H.join(""));
	}
	_gestionFocusApresFenetreRecap() {
		if (this._gestionFocus_apresFenetreRecapId) {
			ObjetHtml_1.GHtml.setFocus(
				this._gestionFocus_apresFenetreRecapId,
				true,
				true,
			);
		}
		delete this._gestionFocus_apresFenetreRecapId;
	}
	_gestionFocusApresFenetreCellule() {
		if (this._gestionFocus_apresFenetreCelluleId) {
			ObjetHtml_1.GHtml.setFocus(
				this._gestionFocus_apresFenetreCelluleId,
				true,
				true,
			);
		}
		delete this._gestionFocus_apresFenetreCelluleId;
	}
	_initialiserCelluleDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			largeurComposant: 100,
			formatDate: "%JJJ %J %MMM",
			derniereDate: ObjetDate_1.GDate.getDateCourante(true),
		});
	}
	_evenementDateValidation(aDate) {
		this.Date = aDate;
		this.jourConsultUniquement =
			this.ListeDates.getIndiceElementParFiltre((aElement) => {
				return ObjetDate_1.GDate.estJourEgal(aElement.Date, this.Date);
			}) === -1;
		this.moteur.setOptions({ Date: this.Date });
		this.etatUtilScoEspace.setNavigationDate(aDate);
		this.setEtatSaisie(false);
		this.Eleve = null;
		this.getInstance(this.IdentComboRessource).setDonnees(
			this.ListeRessources,
			this.SelectionRessource === null || this.SelectionRessource === undefined
				? 0
				: this.SelectionRessource,
		);
	}
	avecCheckboxAppelTermine() {
		const lAvecAjoutAutorise = this.ajoutEleveAutorise;
		return (
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsence,
			) ||
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
			this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur ||
			lAvecAjoutAutorise
		);
	}
	avecDemandesDispense() {
		return (
			this.appelDedieEnseignant ||
			this.appScoEspace.droits.get(ObjetDroitsPN_1.TypeDroits.dispenses.saisie)
		);
	}
	_avecCBEDTPermanence() {
		return (
			(this.etatUtilScoEspace.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel ||
				this.etatUtilScoEspace.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi) &&
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement &&
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPermanence,
			)
		);
	}
	_actualiserGrilleEleve(aEleve) {
		this.grilleEleve
			.getDecorateurAbsences()
			.setDonnees({
				absencesGrille: aEleve && aEleve.grille ? aEleve.grille.absences : null,
				listeAbsences: this.Eleve ? this.Eleve.ListeAbsences : null,
				listeDispenses: this.Eleve ? this.Eleve.ListeDispenses : null,
				cours: this.paramCours.cours,
			});
		this.grilleEleve.setDonnees({
			date: ObjetDate_1.GDate.getDateDemiJour(this.Date),
			listeCours:
				aEleve && aEleve.grille
					? aEleve.grille.listeCours
					: new ObjetListeElements_1.ObjetListeElements(),
			avecCoursAnnule: this.etatUtilScoEspace.getAvecCoursAnnule(),
		});
	}
	_actualiserEDTEleve() {
		if (!this.grilleEleve) {
			return;
		}
		if (!this.Eleve) {
			this._actualiserGrilleEleve(null);
		} else if (this.Eleve.grille && this.Eleve.grille.listeCours) {
			this._actualiserGrilleEleve(this.Eleve);
		} else {
			if (this._requeteEDTEnCours) {
				return;
			}
			const lThis = this;
			this._requeteEDTEnCours = true;
			new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
				this,
				(aParam) => {
					delete lThis._requeteEDTEnCours;
					lThis.Eleve.grille = {
						listeCours: aParam.listeCours,
						absences: aParam.absences,
					};
					lThis._actualiserGrilleEleve(lThis.Eleve);
				},
			).lancerRequete({
				ressource: new ObjetElement_1.ObjetElement(
					"",
					this.Eleve.getNumero(),
					Enumere_Ressource_1.EGenreRessource.Eleve,
				),
				dateDebut: this.Date,
				avecAbsencesEleve: true,
				avecRetenuesEleve: true,
				avecCoursSortiePeda: true,
			});
		}
	}
	_afficherEDTEleve() {
		if (this.grilleEleve) {
			this.grilleEleve.free();
		}
		this.grilleEleve = null;
		$("#" + this.idGrilleEleve.escapeJQ())
			.ieHtml("")
			.hide();
		if (this.avecGrilleEleve) {
			this.grilleEleve = ObjetIdentite_1.Identite.creerInstance(
				ObjetGrille_1.ObjetGrille,
				{ pere: this },
			);
			const T = [];
			T.push(
				'<div class="Espace AlignementMilieu" ie-html="getTitreGrilleEleve" ie-ellipsis>&nbsp;</div>',
			);
			T.push(
				'<div id="' +
					this.grilleEleve.getNom() +
					'" style="position:absolute;top:20px;left:0;right:0;bottom:0;"></div>',
			);
			$("#" + this.idGrilleEleve.escapeJQ())
				.show()
				.ieHtml(T.join(""), { controleur: this.controleur });
			this.grilleEleve.recupererDonnees();
			this.grilleEleve.setOptions({
				tailleMINPasHoraire: undefined,
				avecSelectionCours: false,
				decorateurAbsences:
					new UtilitaireAbsencesGrille_1.TDecorateurAbsencesGrille().setOptions(
						{ couleurAbsence: "#FFCC66", couleurRetard: "#4020E1" },
					),
				avecSeparationDemiJAbsence: true,
			});
			this.grilleEleve.moduleCours.setParametres({
				filtresImagesUniquement: [
					UtilitaireGrilleImageCoursPN_1.TUtilitaireGrilleImageCoursPN.type
						.dispense,
					UtilitaireGrilleImageCoursPN_1.TUtilitaireGrilleImageCoursPN.type
						.aucunEleve,
				],
				avecVoileCoursObligDispense: false,
				modeGrilleAbsence: true,
				couleurFondCours: "#E1E1E1",
			});
			this._actualiserEDTEleve();
		}
		const lRight = this.avecGrilleEleve
			? this.largeurGrilleEleve + GNavigateur.getLargeurBarreDeScroll() + "px"
			: 0;
		$("#" + this.getInstance(this.idSaisieAbsences).getNom().escapeJQ())
			.parent()
			.css("right", lRight);
		if (
			this.ListeEleves &&
			this.paramCours.cours &&
			!this.paramCours.cours.estAnnule &&
			this.paramCours.cours.utilisable
		) {
			this.getInstance(this.idSaisieAbsences).setDonneesAbsences();
		}
	}
	_afficherMessageGrilleAbsence(aMessage) {
		this.getInstance(this.idSaisieAbsences).afficher(
			this.getInstance(this.idSaisieAbsences).composeMessage(aMessage),
		);
		$("#" + this.Nom.escapeJQ() + "_Appel_Termine").css("display", "none");
		this.getInstance(this.idSaisieAbsences).setEnAffichage();
	}
	_supprimerEleveDuCours() {
		const lSelf = this;
		this.appScoEspace.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.ConfirmationSuppressionEleve",
				),
				[lSelf.Eleve.getLibelle()],
			),
			callback: function (aGenreAction) {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					lSelf.ListeEleves.getElementParNumero(
						lSelf.Eleve.getNumero(),
					).setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					lSelf.valider();
				}
			},
		});
	}
	_evenementSurFenetreSelectionElevesSansCours(aNumeroBouton, aParametres) {
		if (aNumeroBouton === 1) {
			new ObjetRequeteSaisieModifierPresenceEleveDansCours(
				this,
				this.actionSurValidation,
			).lancerRequete(aParametres);
		}
	}
	_actualisationVisibiliteCoursAnnule() {
		if (this.ListeCours) {
			if (this.moduleSaisie) {
				this.moduleSaisie.sortieModeDiagnostic();
			}
			Object.assign(this.donneesGrille, {
				avecCoursAnnule: this.etatUtilScoEspace.getAvecCoursAnnule(),
			});
			this.getInstance(this.IdentGrille).setDonnees(this.donneesGrille);
		}
		const lCours = this.etatUtilScoEspace.getNavigationCours();
		let lAvecCoursSelectionne = false;
		if (this.ListeCours && lCours !== null && lCours !== undefined) {
			lAvecCoursSelectionne = this.getInstance(this.IdentGrille)
				.getInstanceGrille()
				.selectionnerCours(lCours, false);
		}
		if (lAvecCoursSelectionne) {
			this._actualiserEDTEleve();
		} else if (
			this.GenreRessource !== Enumere_Ressource_1.EGenreRessource.Classe &&
			this.GenreRessource !== Enumere_Ressource_1.EGenreRessource.Groupe
		) {
			this._deselectionCours();
		}
	}
	_deselectionCours() {
		this.paramCours = {};
		delete this.Eleve;
		this.getInstance(this.idSaisieAbsences).setActif(true);
		this._afficherMessageGrilleAbsence(
			this.GenreRessource === Enumere_Ressource_1.EGenreRessource.Cours
				? ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.selectionnerCours",
					)
				: "",
		);
		this._actualiserEDTEleve();
		this.activerFichesEleve(false);
	}
}
exports.InterfacePageSaisieAbsences = InterfacePageSaisieAbsences;
