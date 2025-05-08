const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const {
	ObjetFenetre_DetailAbsences,
} = require("ObjetFenetre_DetailAbsences.js");
const {
	ObjetFenetre_ListePunitions,
} = require("ObjetFenetre_ListePunitions.js");
const {
	ObjetFenetre_SaisiePunitions,
} = require("ObjetFenetre_SaisiePunitions.js");
const { ObjetFenetre_ChargeTAF } = require("ObjetFenetre_ChargeTAF.js");
const {
	ObjetAffichagePageSaisieAbsences_Journee,
} = require("InterfacePageSaisieAbsences_Journee.js");
const {
	ObjetAffichagePageSaisieAbsences_Cours,
} = require("InterfacePageSaisieAbsences_Cours.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const {
	ObjetFenetre_ConfSaisieAbsenceCours,
} = require("ObjetFenetre_ConfSaisieAbsenceCours.js");
const {
	ObjetFenetre_EditionObservation,
} = require("ObjetFenetre_EditionObservation.js");
const {
	ObjetFenetre_ListeMemosEleves,
} = require("ObjetFenetre_ListeMemosEleves.js");
const {
	ObjetFenetre_EditionAbsencesNonReglees,
} = require("ObjetFenetre_EditionAbsencesNonReglees.js");
const { ObjetFenetre_AbsenceParPas } = require("ObjetFenetre_AbsenceParPas.js");
const {
	ObjetFenetre_SelectionElevesSansCours,
} = require("ObjetFenetre_SelectionElevesSansCours.js");
const { TDecorateurAbsencesGrille } = require("UtilitaireAbsencesGrille.js");
const {
	ObjetRequetePageSaisieAbsences_General,
} = require("ObjetRequetePageSaisieAbsences_General.js");
const {
	ObjetRequetePageSaisieAbsences,
} = require("ObjetRequetePageSaisieAbsences.js");
const { ObjetRequeteDetailAbsences } = require("ObjetRequeteDetailAbsences.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const {
	ObjetFenetre_CalendrierAnnuel,
} = require("ObjetFenetre_CalendrierAnnuel.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { GCache } = require("Cache.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetFenetre_Infirmerie } = require("ObjetFenetre_Infirmerie.js");
const {
	ObjetFenetre_SelectionMotif,
} = require("ObjetFenetre_SelectionMotif.js");
const { ObjetGrille } = require("ObjetGrille.js");
const { ObjetMoteurAbsences } = require("ObjetMoteurAbsences.js");
const {
	ObjetRequetePageEmploiDuTemps,
} = require("ObjetRequetePageEmploiDuTemps.js");
const { ObjetRequeteSaisieAbsences } = require("ObjetRequeteSaisieAbsences.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { ObjetZoneTexte } = require("ObjetZoneTexte.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
const {
	TUtilitaireGrilleImageCoursPN,
} = require("UtilitaireGrilleImageCoursPN.js");
const {
	EGenreEvenementSaisieAbsence,
} = require("Enumere_EvenementSaisieAbsences.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
const { EGenreBorne } = require("EGenreBorne.js");
const { EGenreEvenementEDT } = require("Enumere_EvenementEDT.js");
const {
	TypeHttpMarqueurContenuCours,
} = require("TypeHttpMarqueurContenuCours.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const GestionAPEleve = require("ObjetFenetre_GestionAPEleve.js");
const { InterfaceGrilleEDT } = require("InterfaceGrilleEDT.js");
const EGenreChoixPeriode = {
	MoisEnCours: 0,
	TrimestreEnCours: 1,
	SemestreEnCours: 2,
	AnneeScolaire: 3,
	Personnalise: 4,
};
class ObjetAffichagePageSaisieAbsences extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.moteur = new ObjetMoteurAbsences();
		this.largeurGrille = 166;
		this.avecGrilleEleve = false;
		this.grilleEleveEstInitialisee = false;
		this.largeurGrilleEleve = 130;
		this.avecAnciennesFeuilleDAppel = GApplication.droits.get(
			TypeDroits.absences.avecAnciennesFeuilleDAppel,
		);
		this.jourConsultUniquement = false;
		this.appelDedieEnseignant = [
			EGenreOnglet.SaisieAbsences_Appel_Professeur,
			EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur,
		].includes(GEtatUtilisateur.getGenreOnglet());
		this.estAppelEtSuivi = [
			EGenreOnglet.SaisieAbsences_AppelEtSuivi,
			EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur,
		].includes(GEtatUtilisateur.getGenreOnglet());
		if (!this.appelDedieEnseignant) {
			this.enseignantCourant = MethodesObjet.dupliquer(
				GEtatUtilisateur.getMembre(),
			);
		} else {
			this.listeEnseignants = GEtatUtilisateur.getListeProfesseurs();
			if (
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur
			) {
				this.listeEnseignants = this.listeEnseignants.getListeElements(
					(aElement) => {
						return aElement.getGenre() !== 0;
					},
				);
			}
			this.enseignantCourant = MethodesObjet.dupliquer(
				this.listeEnseignants.get(0),
			);
		}
		this.SelectionPlaceDebut = -1;
		this.SelectionPlaceFin = -1;
		this.DureeRetard = 5;
		this.largeurCmbRessources = 138;
		this.motif = 0;
		this.estEDTDesPermanences = false;
		this.recapitulatifEleve = null;
		this.setAutorisations();
		this.idGrilleEleve = this.Nom + "_grilleEleve";
		this.idDemandesDispence = this.Nom + "_demandesDispence";
		this.donneesGrille = {
			date: null,
			listeCours: null,
			avecCoursAnnule: false,
		};
		this.paramCours = {};
		const MultipleObjetModule_EDTSaisie = require("ObjetModule_EDTSaisie.js");
		if (
			MultipleObjetModule_EDTSaisie &&
			MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie
		) {
			this.moduleSaisie =
				new MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie({
					instance: this,
					contexteFeuilleAppel: true,
					getInterfaceGrille: function () {
						return this.getInstance(this.IdentGrille);
					}.bind(this),
					getObjetGrille: function () {
						return this.getInstance(this.IdentGrille).getInstanceGrille();
					}.bind(this),
					autoriserCreationCours: function () {
						return (
							GApplication.droits.get(
								TypeDroits.cours.creerCoursPermanenceFeuilleAppel,
							) &&
							!this.estEDTDesPermanences &&
							!this.appelDedieEnseignant
						);
					}.bind(this),
					surCreationCours: function (aParamsGabarit) {
						const lCours = new ObjetElement();
						lCours.setEtat(EGenreEtat.Creation);
						lCours.estCoursCDIFeuilleAppel = true;
						lCours.place = aParamsGabarit.placeHebdo;
						lCours.duree = aParamsGabarit.duree;
						lCours.numeroSemaine = IE.Cycles.cycleDeLaDate(this.Date);
						lCours.ListeContenus = new ObjetListeElements();
						this.paramCours = { cours: lCours };
						return lCours;
					}.bind(this),
					actionSurValidation: function () {
						this.recupererEmploiDuTemps();
					}.bind(this),
				});
		}
	}
	construireInstances() {
		this.IdentComboRessource = this.add(
			ObjetSaisiePN,
			this.evenementSurComboRessource,
			this.initialiserComboRessource,
		);
		if (this.appelDedieEnseignant) {
			this.IdentComboEnseignant = this.add(
				ObjetSaisiePN,
				this.evenementSurComboEnseignant,
				this.initialiserComboEnseignant,
			);
		}
		this.IdentComboDates = this.add(
			ObjetSaisiePN,
			this.evenementSurComboDates,
			this.initialiserComboDates,
		);
		this.IdPremierElement = this.getInstance(
			this.IdentComboDates,
		).getPremierElement();
		this.IdentDate = this.add(ObjetZoneTexte, null, this.initialiserDate);
		this.IdentSelectDate = this.add(
			ObjetCelluleDate,
			_evenementDateValidation.bind(this),
			_initialiserCelluleDate,
		);
		this.IdentComboPlaceDeb = this.add(
			ObjetSaisiePN,
			this.evenementSurComboPlaceDeb,
			this.initialiserComboPlace,
		);
		this.IdentComboPlaceFin = this.add(
			ObjetSaisiePN,
			this.evenementSurComboPlaceFin,
			this.initialiserComboPlace,
		);
		this.IdentGrille = this.add(
			InterfaceGrilleEDT,
			this.evenementSurCours,
			this.initialiserGrilleProfesseur,
		);
		this.IdentFenetreAbsences = this.add(
			ObjetFenetre_DetailAbsences,
			this.evenementSurFenetreAbsence,
			this.initialiserFenetreAbsences,
		);
		this.identFenetreCalendrier = this.addFenetre(
			ObjetFenetre_Date,
			this.evenementFenetreCalendrier,
			this.initialiserFenetreCalendrier,
		);
		this.identMenuContextuel = this.add(
			ObjetMenuContextuel,
			this._evenementSurMenuContextuel,
			this._initialiserMenuContextuel,
		);
		if (
			GApplication.droits.get(TypeDroits.absences.avecSaisiePunition) ||
			GApplication.droits.get(TypeDroits.absences.avecSaisieExclusion)
		) {
			if (GApplication.droits.get(TypeDroits.absences.avecSaisiePunition)) {
				this.identFenetreListePunitions = this.addFenetre(
					ObjetFenetre_ListePunitions,
					this._evenementFenetreListePunitions,
					this._initialiserFenetreListePunitions,
				);
			}
			this.identFenetreSaisiePunitions = this.addFenetre(
				ObjetFenetre_SaisiePunitions,
				this._evenementFenetreSaisiePunitions,
				this._initialiserFenetreSaisiePunitions,
			);
		}
		if (
			GApplication.droits.get(
				TypeDroits.fonctionnalites.appelSaisirMotifJustifDAbsence,
			) ||
			GApplication.droits.get(TypeDroits.absences.avecSaisieMotifRetard)
		) {
			this.idFenetreListeMotifsAbsence = this.addFenetre(
				ObjetFenetre_SelectionMotif,
			);
			this.idFenetreEditionAbsencesNonRegles = this.addFenetre(
				ObjetFenetre_EditionAbsencesNonReglees,
			);
		}
		if (
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.SaisieAbsences_Appel ||
			GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
		) {
			this.idSaisieAbsences = this.add(
				ObjetAffichagePageSaisieAbsences_Journee,
				this.evenementSurSaisie,
				this.initialiserSaisieAbsences,
			);
		} else {
			this.idSaisieAbsences = this.add(
				ObjetAffichagePageSaisieAbsences_Cours,
				this.evenementSurSaisie,
				this.initialiserSaisieAbsences,
			);
			if (
				GApplication.droits.get(TypeDroits.absences.avecSaisieObservation) &&
				GEtatUtilisateur.getGenreOnglet() !==
					EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur
			) {
				this.idFenetreConf = this.addFenetre(
					ObjetFenetre_ConfSaisieAbsenceCours,
					this.evenementConfig,
				);
			}
			this.idDateDepuis = this.add(
				ObjetSaisiePN,
				this.evenementSurDateDepuis,
				this.initialiserDateDepuis,
			);
			this.idFenetreEdition = this.addFenetre(
				ObjetFenetre_EditionObservation,
				this.evenementSurEdition,
				this.initialiserEdition,
			);
			this.idFenetreCalCDC = this.addFenetre(
				ObjetFenetre_CalendrierAnnuel,
				this._gestionFocusApresFenetreRecap,
				this.initialiserFenetreCalCDC,
			);
			this.idFenetreListeMemosEleves = this.addFenetre(
				ObjetFenetre_ListeMemosEleves,
				this.eventFenetreMemosEleves,
				this.initFenetreMemosEleves,
			);
			this.idFenetreAbsenceParPas = this.addFenetre(
				ObjetFenetre_AbsenceParPas,
				this.eventAbsenceParPas,
				this.initAbsenceParPas,
			);
		}
		this.idFenetreInfirmerie = this.addFenetre(
			ObjetFenetre_Infirmerie,
			this.evenementEditionInfirmerie,
			this.initialiserInfirmerie,
		);
		this.idFenetreSelectionElevesSansCours = this.addFenetre(
			ObjetFenetre_SelectionElevesSansCours,
			_evenementSurFenetre_SelectionElevesSansCours.bind(this),
		);
		this.IdentFenetreChargeTAF = this.addFenetre(ObjetFenetre_ChargeTAF);
		this.construireFicheEleveEtFichePhoto();
	}
	estAvecBoutonAbsence() {
		return (
			GApplication.droits.get(TypeDroits.absences.avecSaisieAppel) &&
			!GApplication.droits.get(TypeDroits.absences.avecSaisieAppelEtVS)
		);
	}
	estAvecBoutonConfigurationAutresRubriques() {
		if (
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.SaisieAbsences_Appel ||
			GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
		) {
			return false;
		}
		return (
			GApplication.droits.get(TypeDroits.absences.avecSaisieObservation) &&
			GEtatUtilisateur.getGenreOnglet() !==
				EGenreOnglet.SaisieAbsences_AppelEtSuiviProfesseur
		);
	}
	detruireInstances() {
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement) {
			GEtatUtilisateur.setListeClasses(0);
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
					return GTraductions.getValeur(
						"AbsenceVS.Choix_RubriquesFacultatives",
					);
				},
				getSelection() {
					return aInstance.getInstance(aInstance.idFenetreConf).estAffiche();
				},
				getDisabled() {
					return !aInstance.estAppelEtSuivi;
				},
			},
			btnRecapitulatifAbsences: {
				event() {
					aInstance.recapitulatifEleve = {};
					aInstance.recapitulatifEleve.genreAbsence = EGenreRessource.Absence;
					aInstance.recapitulatifEleve.numeroObservation = null;
					aInstance.recupererAbsencesCours(
						aInstance.paramCours.cours,
						EGenreRessource.Absence,
					);
				},
				getTitle() {
					return GTraductions.getValeur("AbsenceVS.RecapEleve");
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
					GEtatUtilisateur.setAvecCoursAnnule(
						!GEtatUtilisateur.getAvecCoursAnnule(),
					);
					_actualisationVisibiliteCoursAnnule.call(aInstance);
				},
				getSelection() {
					return GEtatUtilisateur.getAvecCoursAnnule();
				},
				getTitle() {
					return GEtatUtilisateur.getAvecCoursAnnule()
						? GTraductions.getValeur("EDT.MasquerCoursAnnules")
						: GTraductions.getValeur("EDT.AfficherCoursAnnules");
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
						GEtatUtilisateur.getAvecCoursAnnule(),
					);
				},
			},
			btnMrFiche: {
				event() {
					if (aInstance.estAppelEtSuivi) {
						if (aInstance.GenreRessource === EGenreRessource.Cours) {
							GApplication.getMessage().afficher({
								idRessource: "AbsenceVS.MFicheFeuilleAppelVS",
							});
						} else {
							GApplication.getMessage().afficher({
								idRessource: "AbsenceVS.MFicheFeuilleAppelVSSansCours",
							});
						}
					} else {
						GApplication.getMessage().afficher({
							idRessource: "Absence.MFicheFeuilleAppel",
						});
					}
				},
				getTitle() {
					const lHintMrFiche = aInstance.estAppelEtSuivi
						? GTraductions.getTitreMFiche("AbsenceVS.MFicheFeuilleAppelVS")
						: GTraductions.getTitreMFiche("Absence.MFicheFeuilleAppel");
					return lHintMrFiche;
				},
			},
			btnAfficherEDTEleve: {
				event() {
					aInstance.avecGrilleEleve = !aInstance.avecGrilleEleve;
					_afficherEDTEleve.call(aInstance);
				},
				getSelection() {
					return aInstance.avecGrilleEleve;
				},
				getTitle() {
					return aInstance.avecGrilleEleve
						? GTraductions.getValeur("AbsenceVS.MasquerEdTEleve")
						: GTraductions.getValeur("AbsenceVS.EdTEleve");
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
					return GTraductions.getValeur("CahierDeTexte.ChargeTAF");
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
					return GApplication.droits.get(
						TypeDroits.absences.avecSaisieAbsencesToutesPermanences,
					);
				},
				getValue: function () {
					return aInstance.estEDTDesPermanences;
				},
				setValue: function (aValue) {
					aInstance.estEDTDesPermanences = aValue;
					aInstance.Eleve = null;
					aInstance.paramCours = {};
					_afficherMessageGrilleAbsence.call(aInstance, "");
					_actualiserEDTEleve.call(aInstance);
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
						avecDemandesDispense.call(aInstance) &&
						aInstance.nombreDemandesDispense > 0
					);
				},
			},
		});
	}
	setAutorisations() {
		this.ListeDates = GApplication.droits.get(
			TypeDroits.absences.listeDatesSaisieAbsence,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		this.setBandeau(this.composeBandeau());
		const H = [],
			avecCBEDTPermanence = _avecCBEDTPermanence();
		H.push('<div class="SansMain full-size" style="position:relative;">');
		H.push(
			'<div id="' +
				this.Nom +
				'_Page_Message" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;text-align:center;padding-top:50px;">Sélectionnez votre cours</div>',
		);
		if (GNavigateur.isLayoutTactile) {
			H.push('<div class="NoWrap full-size">');
			H.push(
				'<div class="InlineBlock AlignementHaut full-height" style="',
				GStyle.composeWidth(
					this.largeurGrille + GNavigateur.getLargeurBarreDeScroll(),
				),
				'">',
			);
			if (avecCBEDTPermanence) {
				H.push(
					'<ie-checkbox ie-if="afficherCBPermanence" ie-model="cbPermanence" class="EspaceGauche">',
					GTraductions.getValeur("AbsenceVS.ToutesLesPermanences"),
					"</ie-checkbox>",
				);
			}
			H.push(
				'<div style="height:0;" id="' +
					this.Instances[this.IdentComboRessource].getNom() +
					'"></div>',
			);
			H.push(
				'<div class="full-height" id="' +
					this.Instances[this.IdentGrille].getNom() +
					'"></div>',
			);
			H.push('<div style="clear: both;"></div>');
			H.push("</div>");
			H.push('<div class="InlineBlock AlignementHaut">');
		} else {
			if (avecCBEDTPermanence) {
				H.push(
					'<ie-checkbox ie-if="afficherCBPermanence" ie-model="cbPermanence" style="position:absolute;top:4px;left:4px;">',
					GTraductions.getValeur("AbsenceVS.ToutesLesPermanences"),
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
		}
		H.push(
			'<div id="' + this.Instances[this.idSaisieAbsences].getNom() + '"></div>',
		);
		H.push(
			`<div class="m-all radius-all-s" id="${this.Nom}_Appel_Termine" style="display:none;${GStyle.composeCouleurFond(GCouleur.liste.colonneFixe.getFond())}">`,
			`<div class="flex-contain cols p-all-l">`,
			`<div class="flex-contain flex-gap-xl">`,
			avecCheckboxAppelTermine() ? this.composeCBAppelTermine() : "",
			`<p id="${this.Nom}_Nb_Eleve_Present" class="flex-contain flex-center m-left-l"></p>`,
			`<div class="flex-contain flex-center" ie-if="sortiepeda.if" ie-html="sortiepeda.html"></div>`,
			`<div id="${this.idDemandesDispence}"></div>`,
			`</div>`,
			`</div>`,
			`</div>`,
			`</div>`,
		);
		if (GNavigateur.isLayoutTactile) {
			H.push(
				'<div id="',
				this.idGrilleEleve,
				'" class="InlineBlock AlignementHaut" style="display:none; position:relative; height:100%; width: ' +
					(this.largeurGrilleEleve + GNavigateur.getLargeurBarreDeScroll()) +
					'px;"></div>',
			);
		} else {
			H.push(
				'<div id="',
				this.idGrilleEleve,
				'" style="display:none; position:absolute;overflow:hidden;top:0;right:0;width: ' +
					(this.largeurGrilleEleve + GNavigateur.getLargeurBarreDeScroll()) +
					'px;bottom:0;"></div>',
			);
		}
		H.push("</div>");
		return H.join("");
	}
	composeCBAppelTermine() {
		const H = [];
		H.push(
			'<div class="flex-contain flex-center">',
			'<ie-checkbox ie-model="cbAppelTermine" style="',
			GStyle.composeCouleurTexte(GCouleur.texte),
			'">',
			GTraductions.getValeur("AbsenceVS.AppelFait"),
			"</ie-checkbox>",
			"</div>",
		);
		return H.join("");
	}
	updateDemandesDispence() {
		GHtml.setHtml(this.idDemandesDispence, this.composeHtmlDemandesDispence(), {
			controleur: this.controleur,
		});
	}
	composeHtmlDemandesDispence() {
		const H = [];
		if (
			MethodesObjet.isNumeric(this.nombreDemandesDispense) &&
			this.nombreDemandesDispense > 0
		) {
			const lTrad =
				this.nombreDemandesDispense === 1
					? GTraductions.getValeur("AbsenceVS.demandeDispense.1DemandeATraiter")
					: GTraductions.getValeur(
							"AbsenceVS.demandeDispense.xDemandesATraiter",
							[this.nombreDemandesDispense],
						);
			H.push(
				'<div class="flex-contain flex-center flex-gap" ie-if="btnTraiterDemandesDispense.avec">',
				`<p class="text-util-rouge-foncee">${lTrad}</p>`,
				`<ie-bouton ie-model="btnTraiterDemandesDispense" class="themeBoutonPrimaire small-bt">${GTraductions.getValeur("AbsenceVS.traiter")}</ie-bouton>`,
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
				GStyle.composeCouleur(GCouleur.cumul, GCouleur.texte) +
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
				GChaine.insecable("à") +
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
					UtilitaireBoutonBandeau.getHtmlBtnParametrer(
						"btnConfigAutresRubriques",
					),
					"</div>",
				);
			}
		}
		H.push('<div class="flex-contain flex-center flex-gap-l">');
		if (this.estAvecBoutonAbsence()) {
			H.push(
				UtilitaireBoutonBandeau.getHtmlBtnRecapitulatifAbsences(
					"btnRecapitulatifAbsences",
				),
			);
		}
		H.push(
			UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnules("btnCoursAnnules"),
		);
		H.push(
			UtilitaireBoutonBandeau.getHtmlBtnAfficherEmploiDuTemps(
				"btnAfficherEDTEleve",
			),
		);
		H.push(
			'<span ie-display="getDisplayBtnAfficherChargeTravail">',
			UtilitaireBoutonBandeau.getHtmlBtnChargeDeTravail(
				"btnAfficherChargeTravail",
			),
			"</span>",
		);
		if (this.avecFicheEleve()) {
			H.push(
				UtilitaireBoutonBandeau.getHtmlBtnAfficherFicheEleve(
					"btnAfficherFicheEleve",
				),
			);
		}
		if (this.avecPhotoEleve()) {
			H.push(
				UtilitaireBoutonBandeau.getHtmlBtnAfficherPhotoEleve(
					"btnAfficherPhotoEleve",
				),
			);
		}
		H.push(UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche"));
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	initialiserSaisieAbsences(AInstance) {
		AInstance.setDonnees({
			avecSaisiePunition:
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? false
					: GApplication.droits.get(TypeDroits.absences.avecSaisiePunition),
			avecSaisieExclusion:
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieExclusion),
			avecSaisiePassageInfirmerie:
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: GApplication.droits.get(
							TypeDroits.absences.avecSaisiePassageInfirmerie,
						),
			avecSaisieRetard: GApplication.droits.get(
				TypeDroits.absences.avecSaisieRetard,
			),
		});
	}
	initialiserComboRessource(aObjet) {
		aObjet.setVisible(false);
		aObjet.setControleNavigation(true);
		aObjet.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("AbsenceVS.comboRessource"),
			longueur: this.largeurCmbRessources,
		});
	}
	initialiserComboEnseignant(aObjet) {
		aObjet.setControleNavigation(true);
		aObjet.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("AbsenceVS.comboEnseignant"),
			avecTriListeElements: true,
			longueur: 175,
		});
	}
	initialiserComboDates(AInstance) {
		AInstance.setOptionsObjetSaisie({
			texteEdit: "-&nbsp;" + GTraductions.getValeur("AbsenceVS.appelDu"),
		});
		AInstance.setVisible(false);
		AInstance.setControleNavigation(true);
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("AbsenceVS.comboDates"),
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
				tailleMINPasHoraire: GNavigateur.isLayoutTactile ? 20 : undefined,
				surLongTouchGrille: function (aParams) {
					_deselectionCours.call(this);
					if (this.moduleSaisie) {
						this.moduleSaisie.surLongTouchGrille(aParams);
					}
				}.bind(this),
			},
			evenementMouseDownPlace: function (aEstGrilleMS, aParams) {
				_deselectionCours.call(this);
				if (this.moduleSaisie) {
					this.moduleSaisie.mouseDownPlaceGrille(aEstGrilleMS, aParams);
				}
			}.bind(this),
		});
		AInstance.setControleNavigation(true);
	}
	initialiserFenetreAbsences(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: "",
			largeur: 600,
			hauteur: 350,
			listeBoutons: [GTraductions.getValeur("principal.fermer")],
		});
	}
	_initialiserFenetreListePunitions(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 700,
			hauteur: 256,
			listeBoutons: [GTraductions.getValeur("principal.fermer")],
		});
	}
	_initialiserFenetreSaisiePunitions(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 500,
			hauteur: 285,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	initialiserFenetreCalendrier(aInstance) {
		aInstance.setParametres(
			GDate.PremierLundi,
			GDate.premiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
		);
	}
	initialiserInfirmerie(aInstance) {
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur("AbsenceVS.Titre_FenetreInfirmerie"),
			largeur: 380,
			hauteur: null,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Supprimer"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	_initialiserMenuContextuel(aInstance) {
		aInstance.addCommande(
			0,
			GTraductions.getValeur("AbsenceVS.AjouterPunition"),
		);
	}
	initialiserDateDepuis(AInstance) {
		AInstance.setOptionsObjetSaisie({
			texteEdit: GTraductions.getValeur("AbsenceVS.DecompteDepuis"),
		});
		AInstance.setControleNavigation(true);
		AInstance.enInitialisation = true;
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur("AbsenceVS.comboDates"),
			longueur: 120,
			forcerBoutonDeploiement: true,
		});
	}
	initialiserEdition(aInstance) {
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur("CarnetCorrespondance.ObservationsParents"),
			largeur: 450,
			hauteur: 230,
		});
	}
	initialiserFenetreCalCDC(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: GTraductions.getValeur("CarnetCorrespondance.DefautCarnet"),
			largeur: 650,
			hauteur: null,
			listeBoutons: [GTraductions.getValeur("Fermer")],
		});
	}
	initFenetreMemosEleves(aInstance) {
		aInstance.setOptionsFenetre({ donneesListe: { avecEtatSaisie: true } });
		aInstance.setOptionsListeMemosEleve({ filtreMemoDate: true });
	}
	initAbsenceParPas(aInstance) {
		aInstance.setOptionsFenetre({
			titre: GTraductions.getValeur("AbsenceVS.dureeAbsence", [""]),
			largeur: 400,
			hauteur: 100,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
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
				if (lRes !== EGenreAction.Valider) {
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
		this.evenementSurSaisie(EGenreEvenementSaisieAbsence.AppelFait);
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
			case EGenreEvenementSaisieAbsence.SelectionEleve: {
				if (
					!this.Eleve ||
					this.Eleve.getNumero() !== aObjet.eleve.getNumero()
				) {
					this.Eleve = aObjet.eleve;
					if (this.getInstance(this.IdentFenetreAbsences).estAffiche()) {
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
							this.recupererAbsencesCours(null, EGenreRessource.Absence);
						}
					}
					GEtatUtilisateur.Navigation.setRessource(
						EGenreRessource.Eleve,
						aObjet.eleve,
					);
					this.surSelectionEleve();
					_actualiserEDTEleve.call(this);
					this.$refreshSelf();
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.AppelFait: {
				this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.moduleCours.actualiserCours();
				break;
			}
			case EGenreEvenementSaisieAbsence.FermerFenetre: {
				this.getInstance(this.IdentFenetreAbsences).fermer();
				this.getInstance(this.identFenetreSaisiePunitions).fermer();
				this.getInstance(this.identFenetreCalendrier).fermer();
				this.getInstance(this.identFenetreFicheEleve).fermer();
				this.getInstance(this.idFenetreInfirmerie).fermer();
				if (this.getInstance(this.idFenetreConf)) {
					this.getInstance(this.idFenetreConf).fermer();
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.ClicDroit: {
				if (!this.jourConsultUniquement) {
					if (
						GEtatUtilisateur.getGenreOnglet() ===
							EGenreOnglet.SaisieAbsences_Appel ||
						GEtatUtilisateur.getGenreOnglet() ===
							EGenreOnglet.SaisieAbsences_Appel_Professeur
					) {
						this.actualiserMenuContextuelJournee(aObjet);
					} else {
						this.actualiserMenuContextuel(aObjet);
					}
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.PunitionListe: {
				if (this.ListeEleves && this.ListeEleves.count() > 0) {
					this.getInstance(this.identFenetreListePunitions).setDonnees(
						this.ListeEleves,
					);
					const lStrDate = this.ListeDates.get(
						this.indiceDateSaisieAbsence,
					).getLibelle();
					const lStrEnseignant = this.enseignantCourant.getLibelle();
					const lTitreFenetre = GChaine.format(
						GTraductions.getValeur("AbsenceVS.titreFenetreListePunitions"),
						[lStrDate, lStrEnseignant],
					);
					this.getInstance(this.identFenetreListePunitions).setOptionsFenetre({
						titre: lTitreFenetre,
					});
				} else {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message: GTraductions.getValeur("AbsenceVS.aucunePunitionClasse"),
						callback: this._gestionFocusApresFenetreCellule.bind(this),
					});
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.PunitionSaisie: {
				if (!this.Eleve) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						message: GTraductions.getValeur("AbsenceVS.SelectionElevePunition"),
						callback: this._gestionFocusApresFenetreCellule.bind(this),
					});
				} else {
					this._ouvrirFenetreSaisiePunition(
						aObjet && aObjet.numeroPunition
							? this.Eleve.listePunitions.get(
									Math.ceil(aObjet.numeroPunition / 2) - 1,
								)
							: null,
						aObjet ? aObjet.genreAbsence : EGenreRessource.Punition,
					);
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.PunitionSuppression: {
				let lPunition;
				if (
					GEtatUtilisateur.getGenreOnglet() ===
						EGenreOnglet.SaisieAbsences_Appel ||
					GEtatUtilisateur.getGenreOnglet() ===
						EGenreOnglet.SaisieAbsences_Appel_Professeur
				) {
					const lNumeroPunition = Math.ceil(aObjet.numeroPunition / 2) - 1;
					lPunition = this.Eleve.listePunitions.get(lNumeroPunition);
				} else {
					lPunition = this.Eleve.listePunitions.getPremierElement();
				}
				this._evenementApresConfirmationSuppressionPunition(
					lPunition,
					0,
					EGenreRessource.Punition,
				);
				break;
			}
			case EGenreEvenementSaisieAbsence.ActionSurAbsence: {
				aObjet.genreAbsence = aObjet.typeAbsence;
				aObjet.eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				aObjet.fonctionSurOuvrirListeMotif = function (aParam) {
					const lInstance = this.getInstance(this.idFenetreListeMotifsAbsence);
					if (lInstance) {
						if (aParam.genreAbsence === EGenreRessource.Absence) {
							lInstance.Titre = GTraductions.getValeur(
								"AbsenceVS.SelectionnerUnMotifAbsence",
							);
						} else if (aParam.genreAbsence === EGenreRessource.Retard) {
							lInstance.Titre = GTraductions.getValeur(
								"AbsenceVS.SelectionnerUnMotifRetard",
							);
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
						if (aParam.genreAbsence === EGenreRessource.Absence) {
							lInstance.setDonnees(GCache.listeMotifsAbsenceEleve, true);
						} else {
							lInstance.setDonnees(GCache.listeMotifsRetards, false);
						}
					}
				}.bind(this);
				aObjet.fonctionApresPasPossible = function (aParam) {
					this.afficherNbElevePresent();
					this.getInstance(this.idSaisieAbsences).retourAbsence(
						aParam.eleve.Numero,
						aParam.genreAbsence,
						aParam.typeObservation,
					);
				}.bind(this);
				aObjet.fonctionApresModification = this._apresModificationAbsence.bind(
					this,
					aObjet.eleve,
					aObjet.genreAbsence,
					aObjet.typeObservation,
				);
				this.moteur.surEvenementSaisieAbsence(aObjet);
				break;
			}
			case EGenreEvenementSaisieAbsence.DureeRetard: {
				this.DureeRetard = aObjet.dureeRetard;
				this.moteur.setOptions({ dureeRetard: this.DureeRetard });
				break;
			}
			case EGenreEvenementSaisieAbsence.RecupererAbsence: {
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
			case EGenreEvenementSaisieAbsence.RecapitulatifEleve: {
				lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.Eleve = lEleve;
				GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Eleve, lEleve);
				delete aObjet.numeroEleve;
				this.recapitulatifEleve = aObjet;
				if (
					this.getInstance(this.IdentFenetreAbsences) &&
					this.getInstance(this.IdentFenetreAbsences).estAffiche() &&
					this.recapitulatifEleve.genreAbsence ===
						EGenreRessource.Observation &&
					this.listeColonnes.getElementParNumeroEtGenre(
						this.recapitulatifEleve.numeroObservation,
						this.recapitulatifEleve.genreAbsence,
					).genreObservation === TypeGenreObservationVS.OVS_DefautCarnet
				) {
					this.getInstance(this.IdentFenetreAbsences).fermer();
				}
				if (
					this.getInstance(this.idFenetreCalCDC) &&
					this.getInstance(this.idFenetreCalCDC).estAffiche() &&
					!(
						this.recapitulatifEleve.genreAbsence ===
							EGenreRessource.Observation &&
						this.listeColonnes.getElementParNumeroEtGenre(
							this.recapitulatifEleve.numeroObservation,
							this.recapitulatifEleve.genreAbsence,
						).genreObservation === TypeGenreObservationVS.OVS_DefautCarnet
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
				_actualiserEDTEleve.call(this);
				this.$refreshSelf();
				break;
			}
			case EGenreEvenementSaisieAbsence.ChangerEtatDevoir: {
				lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				if (lEleve.devoirARendre.programmation.Genre === 1) {
					lEleve.devoirARendre.programmation.Genre = 2;
				} else {
					lEleve.devoirARendre.programmation.Genre = 1;
				}
				lEleve.devoirARendre.programmation.setEtat(EGenreEtat.Modification);
				lEleve.devoirARendre.setEtat(EGenreEtat.Modification);
				lEleve.setEtat(EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this.getInstance(this.idSaisieAbsences).retourChangementDevoir(
					aObjet.numeroEleve,
				);
				break;
			}
			case EGenreEvenementSaisieAbsence.Infirmerie: {
				this.Eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.Place = aObjet.place;
				const LBorneMin = this.PlaceSaisieDebut;
				const LBorneMax = this.PlaceSaisieFin;
				const lAbsence = this.moteur.getAbsence(
					this.Eleve,
					EGenreRessource.Infirmerie,
					this.Place,
				);
				const lListeAccompagnants = MethodesObjet.dupliquer(this.ListeEleves);
				this.moteur._majListeElevesVisible();
				this.getInstance(this.idFenetreInfirmerie).setDonnees(
					lListeAccompagnants,
					{
						numeroEleve: this.Eleve.Numero,
						placeDebut: aObjet.placeDebut,
						placeFin: aObjet.placeFin,
						borneMin: GDate.placeAnnuelleEnDate(LBorneMin),
						borneMax: GDate.placeAnnuelleEnDate(LBorneMax, true),
						absence: lAbsence,
						publierParDefautPassageInf: this.publierParDefautPassageInf,
						avecEditionPublication: false,
					},
				);
				break;
			}
			case EGenreEvenementSaisieAbsence.DeplacementBorne: {
				const LGenreBorneDeplacee = aObjet.genreBorne;
				const LPlace = aObjet.place;
				const LEstUnCours = this.GenreRessource === EGenreRessource.Cours;
				if (!LEstUnCours) {
					if (LGenreBorneDeplacee === EGenreBorne.Superieure) {
						const LPlaceSaisieFin = 1 + (LPlace % GParametres.PlacesParJour);
						this.PlaceSaisieFin = LPlace;
						this.getInstance(
							this.IdentComboPlaceFin,
						).setSelectionParNumeroEtGenre(null, LPlaceSaisieFin);
						this.getInstance(this.idSaisieAbsences).setPlacesSaisie(
							this.PlaceSaisieDebut,
							this.PlaceSaisieFin,
						);
					} else {
						const LPlaceSaisieDebut = LPlace % GParametres.PlacesParJour;
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
						LGenreBorneDeplacee === EGenreBorne.Superieure
							? this.PlaceSaisieDebut
							: LPlace;
					this.PlaceSaisieFin =
						LGenreBorneDeplacee === EGenreBorne.Superieure
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
			case EGenreEvenementSaisieAbsence.OuvrirEditionObservation: {
				let lColonneObservation;
				if (
					!!aObjet.absence &&
					aObjet.absence.getGenre() === EGenreRessource.Dispense
				) {
					lColonneObservation = this.listeColonnes.getElementParGenre(
						EGenreRessource.Dispense,
					);
				} else {
					lColonneObservation = this.listeColonnes.getElementParNumero(
						aObjet.genreObservation,
					);
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
				});
				this.getInstance(this.idFenetreEdition).afficher();
				break;
			}
			case EGenreEvenementSaisieAbsence.RecupererInfo: {
				if (aObjet.enseignantCourant) {
					return this.enseignantCourant;
				} else if (aObjet.cours) {
					return this.paramCours.cours;
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.CalculInfoEleve: {
				this.moteur.calculerInfosEleve(aObjet.eleve);
				break;
			}
			case EGenreEvenementSaisieAbsence.MemosEleves: {
				this.Eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.getInstance(this.idFenetreListeMemosEleves).setDonnees(
					false,
					this.Eleve,
					!this.jourConsultUniquement,
				);
				break;
			}
			case EGenreEvenementSaisieAbsence.ValorisationsEleve: {
				this.Eleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
				this.getInstance(this.idFenetreListeMemosEleves).setDonnees(
					true,
					this.Eleve,
					!this.jourConsultUniquement,
				);
				break;
			}
			case EGenreEvenementSaisieAbsence.ContextMenuEleve: {
				if (!this.jourConsultUniquement) {
					lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
					const lInstance = this.getInstance(this.identMenuContextuel);
					lInstance.vider();
					if (
						GApplication.droits.get(TypeDroits.dossierVS.saisirMemos) &&
						!lEleve.avecMemo &&
						!lEleve.sortiePeda
					) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.creerMemo,
							GTraductions.getValeur("AbsenceVS.CreerUnMemo"),
							true,
						);
					}
					if (
						GApplication.droits.get(TypeDroits.dossierVS.saisirMemos) &&
						!lEleve.avecValorisation &&
						!lEleve.sortiePeda
					) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.creerValorisation,
							GTraductions.getValeur("AbsenceVS.CreerUnValorisation"),
							true,
						);
					}
					if (
						GApplication.droits.get(
							TypeDroits.eleves.avecAffectationElevesGroupesGAEV,
						)
					) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.gestionAPEleve,
							GTraductions.getValeur("AbsenceVS.ModifierGpeAP"),
							true,
						);
					}
					if (lEleve.eleveAjouteAuCours) {
						lInstance.addCommande(
							this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours,
							GTraductions.getValeur("AbsenceVS.SuppressionEleve"),
							true,
						);
					}
					if (lInstance.ListeLignes.count() > 0) {
						lInstance.afficher();
					}
				}
				break;
			}
			case EGenreEvenementSaisieAbsence.AbsencesNonReglees:
				if (
					GApplication.droits.get(
						TypeDroits.fonctionnalites.saisieEtendueAbsenceDepuisAppel,
					)
				) {
					let lTitre =
						this.Eleve.getLibelle() +
						" - " +
						this.Eleve.listeAbsencesNonReglees.count() +
						" " +
						(this.Eleve.listeAbsencesNonReglees.count() > 1
							? GTraductions.getValeur("Absence.Absences")
							: GTraductions.getValeur("Absence.Absence")) +
						" - ";
					lTitre = GChaine.format(
						GTraductions.getValeur("Absence.TitreListeEvnmts"),
						[
							lTitre,
							GDate.formatDate(
								this.dateDecompte
									? this.dateDecompte
									: GParametres.PremiereDate,
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
			case EGenreEvenementSaisieAbsence.OuvrirAbsenceParPas: {
				this.getInstance(this.idFenetreAbsenceParPas).setOptionsFenetre({
					titre: GTraductions.getValeur("AbsenceVS.dureeAbsence", [
						this.Eleve.getLibelle(),
					]),
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
			case EGenreEvenementSaisieAbsence.RecupererListeAbsences: {
				if (aObjet.numeroEleve) {
					lEleve = this.ListeEleves.getElementParNumero(aObjet.numeroEleve);
					this.Eleve = lEleve;
				}
				let lListe = "ListeAbsences";
				if (aObjet.genreAbsence === EGenreRessource.Dispense) {
					lListe = "ListeDispenses";
				}
				if (
					aObjet.genreAbsence === EGenreRessource.Observation &&
					aObjet.genreObservation !== null &&
					aObjet.genreObservation !== undefined
				) {
					aObjet.genreAbsence = EGenreRessource.ObservationProfesseurEleve;
				}
				return this.Eleve[lListe].getListeElements((aEle) => {
					return (
						aEle.getGenre() === aObjet.genreAbsence &&
						(aEle.getGenre() !== EGenreRessource.ObservationProfesseurEleve ||
							aEle.observation.getGenre() === aObjet.genreObservation)
					);
				});
			}
			case EGenreEvenementSaisieAbsence.DemandesDispenseEleve: {
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
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			GHtml.setDisplay(this.Instances[this.IdentGrille].getNom(), false);
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
				this.GenreRessource !== EGenreRessource.Cours,
			);
			if (this.GenreRessource === EGenreRessource.Cours) {
				this.recupererEmploiDuTemps();
				if (!this.avecDateDefaut) {
					GEtatUtilisateur.setNavigationCours(null);
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
			case EGenreEvenementObjetSaisie.selection:
				this.setActif(false);
				this.Date = aParams.element.Date;
				this.moteur.setOptions({ Date: this.Date });
				GEtatUtilisateur.setNavigationDate(aParams.element.Date);
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
			case EGenreEvenementObjetSaisie.deploiement:
				if (this.appelDedieEnseignant) {
					this.afficherFenetreCalendrier();
					return false;
				}
				break;
			case EGenreEvenementObjetSaisie.fermeture:
				break;
			default:
				break;
		}
	}
	evenementSurDateDepuis(aParams) {
		switch (aParams.genreEvenement) {
			case EGenreEvenementObjetSaisie.selection:
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
			case EGenreEvenementObjetSaisie.deploiement:
				break;
			default:
				break;
		}
	}
	evenementSurEdition(aSaisie, aGenreAbsence, aGenreObservation) {
		if (aSaisie) {
			this.setEtatSaisie(true);
			if (aGenreAbsence === EGenreRessource.ObservationProfesseurEleve) {
				aGenreAbsence = EGenreRessource.Observation;
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
						? EGenreEtat.Modification
						: EGenreEtat.Suppression,
				);
				lAbsence.partielle =
					$.grep(lAbsence.tabAbs, _getAbsExisteParPas).length !== 0;
				this.getInstance(this.idSaisieAbsences).retourAbsence(
					this.Eleve.Numero,
					aParamAbsParPas.absence.getGenre(),
				);
				this.setEtatSaisie(true);
				_actualiserEDTEleve.call(this);
			}
		}
	}
	evenementFenetreCalendrier(aGenreBouton, aDate) {
		if (aGenreBouton === 1 && !this.fenetreCalendrierPourDecompte) {
			let lDateCourant = aDate;
			if (!GDate.estUnJourOuvre(lDateCourant)) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message:
						GTraductions.getValeur("Le_Maj") +
						" " +
						GDate.formatDate(lDateCourant, "%JJ/%MM/%AAAA") +
						" n'est pas un jour ouvré",
				});
				do {
					lDateCourant = GDate.getJourSuivant(lDateCourant, -1);
				} while (!GDate.estUnJourOuvre(lDateCourant));
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
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			GHtml.setDisplay(this.getInstance(this.IdentGrille).Nom, false);
			this.enseignantCourant = MethodesObjet.dupliquer(aParams.element);
			GEtatUtilisateur.setListeClasses(this.enseignantCourant.getNumero());
			this.recupererDonneesEnseignant();
			this.SelectionRessource = this.enseignantCourant.existeNumero() ? 0 : 1;
		}
	}
	evenementSurComboPlaceDeb(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.SelectionPlaceDebut = aParams.indice;
			if (
				this.getInstance(this.IdentComboPlaceDeb).estUneInteractionUtilisateur()
			) {
				if (this.SelectionPlaceDebut >= GParametres.PlacesParJour) {
					this.getInstance(this.IdentComboPlaceDeb).setSelectionParIndice(
						(this.SelectionPlaceDebut = GParametres.PlacesParJour - 1),
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
				if (!GApplication.droits.get(TypeDroits.absences.avecSaisieCours)) {
					this.recupererAbsences();
				}
			}
		}
	}
	evenementSurComboPlaceFin(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
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
				if (!GApplication.droits.get(TypeDroits.absences.avecSaisieCours)) {
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
		GEtatUtilisateur.setNavigationCours(this.paramCours.cours);
		this.moteur.setOptions({ Cours: this.paramCours.cours });
		let lMessage;
		if (this.paramCours.cours) {
			lMessage = "";
			if (this.paramCours.cours.estAnnule) {
				lMessage = GTraductions.getValeur("AbsenceVS.AppelCoursAnnule");
			} else if (
				!this.paramCours.cours.utilisable &&
				!this.paramCours.cours.estSortiePedagogique
			) {
				lMessage = GTraductions.getValeur(
					"AbsenceVS.AppelCoursNonUtilisable",
				).replaceRCToHTML();
			}
			if (lMessage) {
				_afficherMessageGrilleAbsence.call(this, lMessage);
			}
		}
		if (!lMessage && this.paramCours.cours) {
			this.setSelectionRessource(
				EGenreRessource.Cours,
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
			if (aParam.genre === EGenreEvenementEDT.SurMenuContextuel) {
				this.moduleSaisie.afficherMenuContextuelDeCoursGrille(
					this.paramCours.cours,
				);
				return;
			}
			if (
				aParam.genre === EGenreEvenementEDT.SurCours &&
				this.moduleSaisie.autorisationEditionCoursAutoriseeSurContexte() &&
				!this.paramCours.cours.coursOrigine &&
				this.paramCours.cours.modifiable &&
				GApplication.droits.get(TypeDroits.cours.deplacerCours)
			) {
				this.moduleSaisie.requeteEvaluation(this.paramCours.cours, null);
				return;
			}
		}
		{
			if (!lMessage) {
				this.recupererAbsences();
			} else {
				_actualiserEDTEleve.call(this);
				this.$refreshSelf();
			}
		}
	}
	_evenementFenetreListePunitions(
		aNumeroBouton,
		aGenreEvenementListe,
		aIndiceEleve,
	) {
		if (!GApplication.droits.get(TypeDroits.absences.avecSaisiePunition)) {
			return;
		}
		if (aNumeroBouton === -2) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur("AbsenceVS.aucunePunitionClasse"),
			});
		} else if (aGenreEvenementListe === EGenreEvenementListe.Suppression) {
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
			_actualiserEDTEleve.call(this);
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
			aPunition.setEtat(EGenreEtat.Suppression);
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
				? EGenreRessource.Punition
				: aGenreRessource;
		this.moteur._majListeElevesVisible();
		this.getInstance(this.identFenetreSaisiePunitions).setDonnees({
			eleve: this.Eleve,
			listePJ: this.listePJ,
			listeEleves:
				aGenreRessource === EGenreRessource.Punition
					? null
					: MethodesObjet.dupliquer(this.ListeEleves),
			punition: aPunition,
			listeNature:
				aGenreRessource === EGenreRessource.Punition
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
			GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.SaisieAbsences_Appel ||
			GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
		) {
			switch (aElement.getNumero()) {
				case this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours:
					_supprimerEleveDuCours.call(this);
					break;
				default:
					if (
						!GApplication.droits.get(TypeDroits.absences.avecSaisiePunition)
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
							GApplication.getMessage().afficher({
								type: EGenreBoiteMessage.Confirmation,
								message: GTraductions.getValeur(
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
							this.getInstance(this.idSaisieAbsences).Nom.escapeJQ() +
							' .tableAbsenceCorps div[id*="_' +
							this.Eleve.getNumero() +
							"_" +
							lData.genreAbsenceMenuContext +
							"_abs" +
							(lData.genreAbsenceMenuContext === EGenreRessource.Observation
								? "_" + lData.numeroObsMenuContext
								: "") +
							'"]',
					)
						.parent()
						.trigger("click", [null, true]);
					break;
				case this.moteur.genreCommandeMenuContextVS.modifier: {
					let lAttribut = "ListeAbsences";
					if (lData.genreAbsenceMenuContext === EGenreRessource.Punition) {
						lAttribut = "listePunitions";
					}
					if (
						lData.genreAbsenceMenuContext === EGenreRessource.Punition ||
						lData.genreAbsenceMenuContext === EGenreRessource.Exclusion
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
						lData.genreAbsenceMenuContext === EGenreRessource.Infirmerie
					) {
						this.evenementSurSaisie(EGenreEvenementSaisieAbsence.Infirmerie, {
							numeroEleve: this.Eleve.getNumero(),
							place: this.PlaceSaisieDebut,
							placeDebut: this.PlaceSaisieDebut,
							placeFin: this.PlaceSaisieFin,
						});
					} else if (
						lData.genreAbsenceMenuContext === EGenreRessource.Retard ||
						lData.genreAbsenceMenuContext === EGenreRessource.Dispense ||
						lData.genreAbsenceMenuContext === EGenreRessource.Observation
					) {
						this.getInstance(this.idSaisieAbsences).ouvrirZoneTexte(
							this.Eleve.getNumero(),
							lData.genreAbsenceMenuContext,
							lData.numeroObsMenuContext,
							lData.genreObservation,
						);
					} else if (
						lData.genreAbsenceMenuContext === EGenreRessource.Absence
					) {
						this.getInstance(this.idSaisieAbsences).ouvrirFenetreAbsencesParPas(
							this.Eleve.getNumero(),
							lData.genreAbsenceMenuContext,
						);
					}
					break;
				}
				case this.moteur.genreCommandeMenuContextVS.modifierMotif:
					if (lData.genreAbsenceMenuContext === EGenreRessource.Retard) {
						if (
							GApplication.droits.get(TypeDroits.absences.avecSaisieMotifRetard)
						) {
							const lInstance = this.getInstance(
								this.idFenetreListeMotifsAbsence,
							);
							if (lInstance) {
								lInstance.Titre = GTraductions.getValeur(
									"AbsenceVS.SelectionnerUnMotifRetard",
								);
								lInstance.setOptionsFenetre({
									callback: function (aNumeroBouton, aMotif) {
										if (aNumeroBouton === 1) {
											if (aMotif) {
												const lRetard =
													this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
														null,
														lData.genreAbsenceMenuContext,
													);
												if (lRetard && !lRetard.listeMotifs) {
													lRetard.listeMotifs = new ObjetListeElements();
												}
												if (lRetard && lRetard.listeMotifs) {
													lRetard.listeMotifs.addElement(
														MethodesObjet.dupliquer(aMotif),
														0,
													);
												}
												this.setEtatSaisie(true);
												lRetard.setEtat(EGenreEtat.Modification);
											}
										}
									}.bind(this),
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
										GCache.listeMotifsRetards.getIndiceExisteParElement(
											lRetard.listeMotifs.get(0),
										);
								}
								lInstance.setDonnees(
									GCache.listeMotifsRetards,
									false,
									lSelection,
								);
							}
						}
					}
					if (lData.genreAbsenceMenuContext === EGenreRessource.Absence) {
						if (
							GApplication.droits.get(
								TypeDroits.fonctionnalites.appelSaisirMotifJustifDAbsence,
							)
						) {
							const lInstance = this.getInstance(
								this.idFenetreListeMotifsAbsence,
							);
							if (lInstance) {
								lInstance.Titre = GTraductions.getValeur(
									"AbsenceVS.SelectionnerUnMotifAbsence",
								);
								lInstance.setOptionsFenetre({
									callback: function (aNumeroBouton, aMotif) {
										if (aNumeroBouton === 1) {
											if (aMotif) {
												const lAbsence =
													this.Eleve.ListeAbsences.getElementParNumeroEtGenre(
														null,
														lData.genreAbsenceMenuContext,
													);
												if (lAbsence && !lAbsence.listeMotifs) {
													lAbsence.listeMotifs = new ObjetListeElements();
												}
												if (lAbsence && lAbsence.listeMotifs) {
													lAbsence.listeMotifs.addElement(
														MethodesObjet.dupliquer(aMotif),
														0,
													);
												}
												this.setEtatSaisie(true);
												lAbsence.setEtat(EGenreEtat.Modification);
											}
										}
									}.bind(this),
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
										GCache.listeMotifsAbsenceEleve.getIndiceExisteParElement(
											lAbsence.listeMotifs.get(0),
										);
								}
								lInstance.setDonnees(
									GCache.listeMotifsAbsenceEleve,
									false,
									lSelection,
								);
							}
						}
					}
					break;
				case this.moteur.genreCommandeMenuContextVS.creerMemo:
					this.evenementSurSaisie(EGenreEvenementSaisieAbsence.MemosEleves, {
						numeroEleve: this.Eleve.getNumero(),
					});
					break;
				case this.moteur.genreCommandeMenuContextVS.creerValorisation:
					this.evenementSurSaisie(
						EGenreEvenementSaisieAbsence.ValorisationsEleve,
						{ numeroEleve: this.Eleve.getNumero() },
					);
					break;
				case this.moteur.genreCommandeMenuContextVS.gestionAPEleve:
					GestionAPEleve.ouvrirFenetrePromise(this, this.Eleve, this.Date).then(
						(aResult) => {
							if (aResult && aResult.avecSaisie) {
								this.actionSurValidation();
							}
						},
					);
					break;
				case this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours:
					_supprimerEleveDuCours.call(this);
					break;
				case this.moteur.genreCommandeMenuContextVS.publierObservation: {
					this.setEtatSaisie(true);
					const lObservation = aElement.data.observation;
					lObservation.setEtat(EGenreEtat.Modification);
					lObservation.estPubliee = !lObservation.estPubliee;
					this.getInstance(this.idSaisieAbsences).retourAbsence(
						this.Eleve.getNumero(),
						EGenreRessource.Observation,
						lObservation.observation.getNumero(),
					);
					break;
				}
				case this.moteur.genreCommandeMenuContextVS.publierPunition: {
					this.setEtatSaisie(true);
					const lAbsenceOuPunition = aElement.data.punitionExclusion;
					lAbsenceOuPunition.setEtat(EGenreEtat.Modification);
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
			aObjet.genreAbsence === EGenreRessource.Observation &&
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
			? GTraductions.getValeur("AbsenceVS.Consulter")
			: GTraductions.getValeur("Modifier");
		lInstance.addCommande(
			this.moteur.genreCommandeMenuContextVS.modifier,
			lLibelle,
			lAvecModifier,
			lData,
		);
		if (
			aObjet.genreAbsence === EGenreRessource.Retard &&
			GApplication.droits.get(TypeDroits.absences.avecSaisieMotifRetard)
		) {
			lInstance.addCommande(
				this.moteur.genreCommandeMenuContextVS.modifierMotif,
				GTraductions.getValeur("AbsenceVS.ModifierMotifRetard"),
				lAvecModifier,
				lData,
			);
		}
		if (
			aObjet.genreAbsence === EGenreRessource.Absence &&
			GApplication.droits.get(
				TypeDroits.fonctionnalites.appelSaisirMotifJustifDAbsence,
			)
		) {
			lInstance.addCommande(
				this.moteur.genreCommandeMenuContextVS.modifierMotif,
				GTraductions.getValeur("AbsenceVS.ModifierMotifAbsence"),
				lAvecModifier,
				lData,
			);
		}
		lInstance.addCommande(
			this.moteur.genreCommandeMenuContextVS.supprimer,
			GTraductions.getValeur("Supprimer"),
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
							GTraductions.getValeur("dispenses.consult1Doc"),
							true,
							() => {
								window.open(
									GChaine.creerUrlBruteLienExterne(aDoc, {
										genreRessource: EGenreRessource.DocJointEleve,
									}),
								);
							},
						);
					}
				});
			} else {
				lInstance.addSousMenu(
					aObjet.dispense.documents.getNbrElementsExistes() === 1
						? GTraductions.getValeur("dispenses.consult1Doc")
						: GTraductions.getValeur("dispenses.consultLesDocs"),
					(aInstance) => {
						aObjet.dispense.documents.parcourir((aDoc) => {
							if (aDoc.existe()) {
								aInstance.add(aDoc.getLibelle(), true, () => {
									window.open(
										GChaine.creerUrlBruteLienExterne(aDoc, {
											genreRessource: EGenreRessource.DocJointEleve,
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
			aObjet.genreAbsence === EGenreRessource.Observation &&
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
					TypeGenreObservationVS.OVS_ObservationParent
						? GTraductions.getValeur("AbsenceVS.PublierParents")
						: GTraductions.getValeur("AbsenceVS.PublierParentsEleves");
				lInstance.addCommande(
					this.moteur.genreCommandeMenuContextVS.publierObservation,
					aObjet.observation.estPubliee
						? GTraductions.getValeur("AbsenceVS.Depublier")
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
				GTraductions.getValeur("AbsenceVS.AjouterPunition"),
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
							GTraductions.getValeur("AbsenceVS.ModifierPunition") +
								lStrComplementMotifs,
						);
						lInstance.addCommande(
							2 + i * 2,
							GTraductions.getValeur("AbsenceVS.SupprimerPunition") +
								lStrComplementMotifs,
						);
					}
				}
			}
		}
		if (aObjet.eleve && aObjet.eleve.eleveAjouteAuCours) {
			lInstance.addCommande(
				this.moteur.genreCommandeMenuContextVS.supprimerEleveDuCours,
				GTraductions.getValeur("AbsenceVS.SuppressionEleve"),
				true,
			);
		}
		if (lInstance.ListeLignes.count() > 0) {
			lInstance.afficher();
		}
	}
	evenementEditionInfirmerie(ANumeroBouton, aNumeroEleve, aNewAbs) {
		if (ANumeroBouton !== 0 && ANumeroBouton !== -1) {
			this.setEtatSaisie(true);
			if (aNewAbs) {
				this.ListeEleves.getElementParNumero(aNumeroEleve).setEtat(
					EGenreEtat.Modification,
				);
				this.ListeEleves.getElementParNumero(
					aNumeroEleve,
				).ListeAbsences.addElement(aNewAbs);
			}
			this.getInstance(this.idSaisieAbsences).retourAbsence(
				aNumeroEleve,
				EGenreRessource.Infirmerie,
			);
			_actualiserEDTEleve.call(this);
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
				GEtatUtilisateur.getGenreOnglet() !==
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? this.enseignantCourant
					: null,
			listeFichiers: this.listePJ,
		};
		new ObjetRequeteSaisieAbsences(this, this.actionSurValidation)
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
		new ObjetRequetePageSaisieAbsences_General(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	recupererEmploiDuTemps() {
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		this.objetRequete_PageEmploiDuTemps = new ObjetRequetePageEmploiDuTemps(
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
		new ObjetRequetePageSaisieAbsences(
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
				: GParametres.PremiereDate,
			cours: aCours,
			genreAbsence: aGenreAbsence,
			observation: new ObjetElement("", aNumeroObservation),
		};
		const lDomaine = GApplication.droits.get(
			TypeDroits.absences.domaineRecapitulatifAbsences,
		);
		if (lDomaine && !lDomaine.estVide()) {
			lParamsRequete.domaine = lDomaine;
		} else {
			lParamsRequete.dateDebut = GDate.placeAnnuelleEnDate(
				this.PlaceSaisieDebut,
			);
			lParamsRequete.dateFin = GDate.placeAnnuelleEnDate(this.PlaceSaisieFin);
		}
		new ObjetRequeteDetailAbsences(
			this,
			this.actionSurRecupererDetailAbsences,
		).lancerRequete(lParamsRequete);
	}
	setListeDates(aDate) {
		this.ListeDates = new ObjetListeElements();
		const lElement = new ObjetElement();
		lElement.Date = aDate;
		lElement.Libelle = GDate.formatDate(lElement.Date, "%JJ/%MM/%AAAA");
		this.ListeDates.addElement(lElement);
	}
	actionSurRecupererDonnees(aDonnees) {
		this.ListeRessources =
			this.appelDedieEnseignant ||
			GApplication.droits.get(TypeDroits.absences.avecSaisieHorsCours) ||
			!GApplication.droits.get(TypeDroits.absences.avecSaisieCours)
				? GEtatUtilisateur.getListeClasses({
						avecClasse: true,
						avecGroupe: true,
						uniquementClasseEnseignee: true,
					})
				: new ObjetListeElements();
		const lAvecClasse =
			this.ListeRessources.getElementParGenre(EGenreRessource.Classe) !== null;
		const lAvecGroupe =
			this.ListeRessources.getElementParGenre(EGenreRessource.Groupe) !== null;
		if (
			this.enseignantCourant.existeNumero() &&
			GApplication.droits.get(TypeDroits.absences.avecSaisieCours)
		) {
			this.ListeRessources.addElement(
				new ObjetElement(
					GTraductions.getValeur("accueil.emploiDuTemps"),
					0,
					EGenreRessource.Cours,
				),
			);
		}
		if (
			GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur ||
			!GApplication.droits.get(TypeDroits.absences.avecSaisieCours) ||
			(!GApplication.droits.get(TypeDroits.absences.avecSaisieAppelEtVS) &&
				GApplication.droits.get(TypeDroits.absences.avecSaisieHorsCours))
		) {
			$("#" + this.Instances[this.IdentComboRessource].getNom().escapeJQ()).css(
				{ height: "25px" },
			);
			$("#" + this.Instances[this.IdentGrille].getNom().escapeJQ()).css({
				top: "25px",
			});
			this.getInstance(this.IdentComboRessource).setVisible(true);
			if (GNavigateur.isLayoutTactile) {
				const lJComboRessource = $(
					"#" + this.getInstance(this.IdentComboRessource).getNom().escapeJQ(),
				);
				$("#" + this.Instances[this.IdentGrille].getNom().escapeJQ()).css(
					"height",
					lJComboRessource.parent().height() - lJComboRessource.height() + "px",
				);
			}
			if (lAvecClasse) {
				this.ListeRessources.addElement(
					new ObjetElement(
						GTraductions.getValeur("Classe"),
						0,
						EGenreRessource.Classe,
					),
				);
			}
			if (lAvecGroupe) {
				this.ListeRessources.addElement(
					new ObjetElement(
						GTraductions.getValeur("Groupe"),
						0,
						EGenreRessource.Groupe,
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
				LElement.getGenre() === EGenreRessource.Cours ||
				LElement.existeNumero() > 0;
		}
		this.ListeRessources.setTri([
			ObjetTri.init((D) => {
				return D.getGenre() === EGenreRessource.Cours ? -1 : D.getGenre();
			}),
			ObjetTri.init((D) => {
				return D.existeNumero();
			}),
			ObjetTri.init("Libelle"),
		]);
		this.ListeRessources.trier();
		this.listeMotifs = aDonnees.listeMotifs;
		this.motif = this.listeMotifs.get(0).Numero;
		this.listeNaturePunition = aDonnees.listeNaturePunition;
		this.listeNatureExclusion = aDonnees.listeNatureExclusion;
		this.setDonneesBandeau(this.ListeDates, GParametres.LibellesHeures);
	}
	actionSurRecupererEmploiDuTemps(aParam) {
		for (let I = 0; I < aParam.listeCours.count(); I++) {
			const lElementCours = aParam.listeCours.get(I);
			if (!lElementCours.estSortiePedagogique) {
				for (let J = 0; J < lElementCours.ListeContenus.count(); J++) {
					const lElementContenu = lElementCours.ListeContenus.get(J);
					const lGenre = lElementContenu.getGenre();
					if (
						lGenre === EGenreRessource.Matiere ||
						lGenre === EGenreRessource.Classe ||
						lGenre === EGenreRessource.Groupe ||
						lGenre === EGenreRessource.PartieDeClasse ||
						lGenre === EGenreRessource.Salle ||
						lGenre === EGenreRessource.Personnel ||
						lElementContenu.marqueur ===
							TypeHttpMarqueurContenuCours.hmcc_ReservePar
					) {
						lElementContenu.Visible = true;
					} else {
						lElementContenu.Visible = false;
					}
				}
			}
		}
		this.ListeCours = aParam.listeCours;
		GHtml.setDisplay(this.getInstance(this.IdentGrille).Nom, true);
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		if (!this.grilleEleveEstInitialisee) {
			this.grilleEleveEstInitialisee = true;
			_afficherEDTEleve.call(this);
		}
		Object.assign(this.donneesGrille, {
			date: GDate.getDateDemiJour(this.Date),
			listeCours: this.ListeCours,
			avecCoursAnnule: GEtatUtilisateur.getAvecCoursAnnule(),
		});
		this.getInstance(this.IdentGrille).setDonnees(this.donneesGrille);
		const lCours =
			GEtatUtilisateur._coursASelectionner ||
			GEtatUtilisateur.getNavigationCours();
		delete GEtatUtilisateur._coursASelectionner;
		const lIndiceCours = new ObjetUtilitaireAbsence().getIndiceCoursParPlace(
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
			_deselectionCours.call(this);
		}
	}
	actionSurRecupererAbsences(aParam, aData) {
		this.setEtatSaisie(false);
		this.ListeEleves = aData.listeEleves;
		this.listePJ = new ObjetListeElements();
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
					: GApplication.droits.get(TypeDroits.absences.avecSaisieAbsence),
				avecSaisieRetard: this.appelDedieEnseignant
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieRetard),
				avecSaisieDispense: this.appelDedieEnseignant
					? true
					: GApplication.droits.get(TypeDroits.dispenses.saisie),
				suppressionAbsenceDeVS: this.avecSuppressionAutreAbsence,
				suppressionRetardDeVS: this.avecModifRetardVS,
				saisieAbsenceOuverte: GApplication.droits.get(
					TypeDroits.absences.avecSaisieAbsenceOuverte,
				),
				saisieHorsCours:
					GEtatUtilisateur.getGenreOnglet() ===
					EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: GApplication.droits.get(TypeDroits.absences.avecSaisieHorsCours),
			},
		});
		this.getInstance(this.idSaisieAbsences).setDonneesBandeauAbsences(
			this.DureeRetard,
			this.listeMotifs,
		);
		this.setActif(!aData.message);
		if (this.getInstance(this.IdentFenetreAbsences)) {
			this.getInstance(this.IdentFenetreAbsences).fermer();
		}
		if (this.getInstance(this.idFenetreCalCDC)) {
			this.getInstance(this.idFenetreCalCDC).fermer();
		}
		if (this.getInstance(this.idFenetreInfirmerie)) {
			this.getInstance(this.idFenetreInfirmerie).fermer();
		}
		if (this.getInstance(this.identFenetreSaisiePunitions)) {
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
				GDate.formatDate(this.dateDecompte, "%JJ/%MM/%AAAA"),
			);
		}
		if (aData.message) {
			_afficherMessageGrilleAbsence.call(this, aData.message);
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
				saisieAbsenceOuverte: GApplication.droits.get(
					TypeDroits.absences.avecSaisieAbsenceOuverte,
				),
				saisieHorsCours:
					GEtatUtilisateur.getGenreOnglet() ===
					EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: GApplication.droits.get(TypeDroits.absences.avecSaisieHorsCours),
				suppressionAutreAbsence: this.avecSuppressionAutreAbsence,
				saisieGrille:
					GEtatUtilisateur.getGenreOnglet() ===
					EGenreOnglet.SaisieAbsences_Appel_Professeur
						? GApplication.droits.get(
								TypeDroits.absences.avecSaisieSurGrilleAppelProf,
							)
						: GApplication.droits.get(TypeDroits.absences.avecSaisieSurGrille),
				saisiePunition:
					GEtatUtilisateur.getGenreOnglet() ===
					EGenreOnglet.SaisieAbsences_Appel_Professeur
						? false
						: GApplication.droits.get(TypeDroits.absences.avecSaisiePunition),
				suppressionAbsenceDeVS: this.avecSuppressionAutreAbsence,
				suppressionRetardDeVS: this.avecModifRetardVS,
				saisieAbsence: this.appelDedieEnseignant
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieAbsence),
				saisieRetard: this.appelDedieEnseignant
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieRetard),
				saisieDefautCarnet: GApplication.droits.get(
					TypeDroits.absences.avecSaisieDefautCarnet,
				),
				ajoutEleveAutorise: this.ajoutEleveAutorise,
			},
			cours: this.paramCours.cours,
			estCours: this.GenreRessource === EGenreRessource.Cours,
			listeElevesStage: aData.listeElevesEnStage,
			message: aData.message,
			listeColonnes: this.listeColonnes,
			callbackAjoutEleve: this.ajoutEleveAutorise
				? function () {
						if (GEtatUtilisateur.EtatSaisie) {
							ControleSaisieEvenement(() => {
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
			GApplication.droits.get(TypeDroits.absences.avecSaisieCours) &&
				this.paramCours.cours &&
				(this.ajoutEleveAutorise ||
					this.ListeEleves.getListeElements((aEle) => {
						return aEle.existeNumero();
					}).count() > 0)
				? ""
				: "none",
		);
		if (!GNavigateur.isLayoutTactile) {
			$("#" + this.Nom.escapeJQ() + "_Appel_Termine").width(
				$(
					"#" +
						this.getInstance(this.idSaisieAbsences).Nom.escapeJQ() +
						" table:first",
				).width(),
			);
		}
		if (GNavigateur.isLayoutTactile) {
			$("#" + this.Nom.escapeJQ()).width(
				$(
					"#" +
						this.getInstance(this.idSaisieAbsences).Nom.escapeJQ() +
						" table:first",
				).width() +
					(this.largeurGrille + GNavigateur.getLargeurBarreDeScroll()) +
					(this.avecGrilleEleve
						? this.largeurGrilleEleve + GNavigateur.getLargeurBarreDeScroll()
						: 0),
			);
		}
		_actualiserEDTEleve.call(this);
		if (aParam && aParam.callbackFinAfficherPage) {
			aParam.callbackFinAfficherPage();
		}
	}
	getLibelleGenreAbsence(aGenreAbsence, aPluriel) {
		switch (aGenreAbsence) {
			case EGenreRessource.Absence:
				return GTraductions.getValeur(
					aPluriel ? "Absence.CoursManques" : "Absence.CoursManque",
				);
			case EGenreRessource.Retard:
				return GTraductions.getValeur(
					aPluriel ? "Absence.Retards" : "Absence.Retard",
				);
			case EGenreRessource.Exclusion:
				return GTraductions.getValeur(
					aPluriel ? "Absence.Exclusions" : "Absence.Exclusion",
				);
			case EGenreRessource.Infirmerie:
				return GTraductions.getValeur(
					aPluriel ? "Absence.Infirmeries" : "Absence.Infirmerie",
				);
			case EGenreRessource.Punition:
				return GTraductions.getValeur(
					aPluriel ? "Absence.Punitions" : "Absence.Punition",
				);
			case EGenreRessource.Dispense:
				return GTraductions.getValeur(
					aPluriel ? "Absence.DispensesCour" : "Absence.DispenseCour",
				);
			default:
				break;
		}
		return "";
	}
	getTitreFenetreAbsences(aGenreAbsence, aNumObs) {
		let lTexte = GTraductions.getValeur("Absence.Absences");
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
			GChaine.format(GTraductions.getValeur("Absence.TitreListeEvnmts"), [
				lTexte,
				GDate.formatDate(
					this.dateDecompte ? this.dateDecompte : GParametres.PremiereDate,
					"%JJ/%MM/%AAAA",
				),
			])
		);
	}
	getMessageAucunFenetreAbsences(aGenreAbsence, aNumObs) {
		let lTexte = GTraductions.getValeur("Absence.AucuneAbsence");
		switch (aGenreAbsence) {
			case EGenreRessource.Retard:
				lTexte = GTraductions.getValeur("Absence.AucunRetard");
				break;
			case EGenreRessource.Infirmerie:
				lTexte = GTraductions.getValeur("Absence.AucuneInfirmerie");
				break;
			case EGenreRessource.Punition:
				lTexte = GTraductions.getValeur("Absence.AucunePunition");
				break;
			case EGenreRessource.Exclusion:
				lTexte = GTraductions.getValeur("Absence.AucuneExclusion");
				break;
			case EGenreRessource.Dispense:
				lTexte = GTraductions.getValeur("Absence.AucuneDispense");
				break;
			case EGenreRessource.Observation: {
				const lObservation = this.listeColonnes.getElementParNumeroEtGenre(
					aNumObs,
					aGenreAbsence,
				);
				switch (lObservation.genreObservation) {
					case TypeGenreObservationVS.OVS_ObservationParent:
						lTexte = GTraductions.getValeur("Absence.AucuneObservationParents");
						break;
					case TypeGenreObservationVS.OVS_Encouragement:
						lTexte = GTraductions.getValeur("Absence.AucunEncouragement");
						break;
					case TypeGenreObservationVS.OVS_DefautCarnet:
						lTexte = GTraductions.getValeur("Absence.AucunDefautDeCarnet");
						break;
					case TypeGenreObservationVS.OVS_Autres:
						return GChaine.format(
							GTraductions.getValeur("Absence.AucuneObservationAutres"),
							[
								lObservation.Libelle,
								GDate.formatDate(
									this.dateDecompte
										? this.dateDecompte
										: GParametres.PremiereDate,
									"%JJ/%MM/%AAAA",
								),
							],
						);
				}
				break;
			}
		}
		return GChaine.format(lTexte, [
			GDate.formatDate(
				this.dateDecompte ? this.dateDecompte : GParametres.PremiereDate,
				"%JJ/%MM/%AAAA",
			),
		]);
	}
	actionSurRecupererDetailAbsences(aListeAbsences) {
		if (
			this.recapitulatifEleve &&
			this.recapitulatifEleve.genreAbsence === EGenreRessource.Observation &&
			this.listeColonnes.getElementParNumeroEtGenre(
				this.recapitulatifEleve.numeroObservation,
				this.recapitulatifEleve.genreAbsence,
			).genreObservation === TypeGenreObservationVS.OVS_DefautCarnet
		) {
			if (
				this.getInstance(this.IdentFenetreAbsences) &&
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
				lElement.date = GDate.placeAnnuelleEnDate(lElement.placeDebut);
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
					this.recapitulatifEleve.genreAbsence === EGenreRessource.Observation
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
				this.getInstance(this.idFenetreCalCDC) &&
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
				observation: new ObjetElement("", aNumeroObservation),
			};
			this.dateDecompte = aDate;
			lParamsRequete.dateDecompte = this.dateDecompte;
			const lDomaine = GApplication.droits.get(
				TypeDroits.absences.domaineRecapitulatifAbsences,
			);
			if (lDomaine && !lDomaine.estVide()) {
				lParamsRequete.domaine = lDomaine;
			} else {
				lParamsRequete.dateDebut = GDate.placeAnnuelleEnDate(
					this.PlaceSaisieDebut,
				);
				lParamsRequete.dateFin = GDate.placeAnnuelleEnDate(this.PlaceSaisieFin);
			}
			new ObjetRequeteDetailAbsences(
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
				AGenreAbsence === EGenreRessource.Retard ? this.DureeRetard : null,
				null,
				aTypeObservation,
				aListeMotifs,
			);
			LAbsence.listeMotifs = new ObjetListeElements();
			if (aMotif) {
				LAbsence.listeMotifs.addElement(MethodesObjet.dupliquer(aMotif));
			}
		}
		this._apresModificationAbsence(aEleve, AGenreAbsence, aTypeObservation);
	}
	_apresModificationAbsence(aEleve, AGenreAbsence, aTypeObservation) {
		if (AGenreAbsence === EGenreRessource.ObservationProfesseurEleve) {
			AGenreAbsence = EGenreRessource.Observation;
		}
		this.moteur.calculerInfosEleve(aEleve);
		this.setEtatSaisie(true);
		this.afficherNbElevePresent();
		this.getInstance(this.idSaisieAbsences).retourAbsence(
			aEleve.Numero,
			AGenreAbsence,
			aTypeObservation,
		);
		_actualiserEDTEleve.call(this);
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
		GHtml.setDisplay(this.Nom + "_Bandeau", this.Actif);
		if (this.Actif) {
			const LEstUnCours = this.GenreRessource === EGenreRessource.Cours;
			let lMessage = "";
			this.getInstance(this.IdentComboPlaceDeb).setVisible(!LEstUnCours);
			this.getInstance(this.IdentComboPlaceFin).setVisible(!LEstUnCours);
			GStyle.setVisible(this.Nom + "_Bandeau_MessageSuite", !LEstUnCours);
			const LPlaceSaisieDebut =
				this.PlaceSaisieDebut % GParametres.PlacesParJour;
			const LPlaceSaisieFin =
				1 + (this.PlaceSaisieFin % GParametres.PlacesParJour);
			if (LEstUnCours) {
				lMessage =
					GTraductions.getValeur("AbsenceVS.Traduction_PourLeCoursDe") +
					" " +
					GParametres.LibellesHeures.getLibelle(LPlaceSaisieDebut) +
					" " +
					GTraductions.getValeur("A") +
					" " +
					GParametres.LibellesHeures.getLibelle(LPlaceSaisieFin);
			} else {
				this.getInstance(this.IdentComboPlaceDeb).setSelectionParNumeroEtGenre(
					null,
					LPlaceSaisieDebut,
				);
				this.getInstance(this.IdentComboPlaceFin).setSelectionParNumeroEtGenre(
					null,
					LPlaceSaisieFin,
				);
				lMessage = GTraductions.getValeur(
					"AbsenceVS.Traduction_PourLeCreneauDe",
				);
			}
			GHtml.setHtml(this.Nom + "_Bandeau_Message", GChaine.insecable(lMessage));
		}
	}
	actualiserBandeauAbsences() {
		GHtml.setDisplay(this.Nom + "_BandeauAbsences", this.Actif);
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
			GEtatUtilisateur.getIndiceDateSaisieAbsence();
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
				let lDate = GEtatUtilisateur.getNavigationDate()
					? GEtatUtilisateur.getNavigationDate()
					: !!AListeDates && AListeDates.count()
						? AListeDates.get(0).Date
						: GDate.getDateCourante(true);
				lDate = GDate.getDateJour(lDate);
				this.getInstance(this.IdentSelectDate).setActif(true);
				this.getInstance(this.IdentSelectDate).setDonnees(lDate);
				_evenementDateValidation.call(this, lDate);
			} else if (this.ListeDates.count()) {
				this.getInstance(this.IdentComboDates).setVisible(false);
				this.getInstance(this.IdentSelectDate).setVisible(false);
				this.getInstance(this.IdentDate).setVisible(true);
				this.getInstance(this.IdentDate).setDonnees(
					GDate.formatDate(AListeDates.get(0).Date, "%JJ/%MM/%AAAA"),
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
						GTraductions.getValeur(
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
						? GTraductions.getValeur("AbsenceVS.VerrouAppelFaitSP")
						: GTraductions.getValeur("AbsenceVS.HintVerrouille")) +
					'"></div>',
			);
		}
		H.push(
			lObjNbEleve.nbElevesPresents > 1
				? GChaine.format(
						lEstSortiePeda
							? GTraductions.getValeur("AbsenceVS.ElevesPresentsSP")
							: GTraductions.getValeur("AbsenceVS.ElevesPresents"),
						[lObjNbEleve.nbElevesPresents],
					)
				: lObjNbEleve.nbElevesPresents === 1
					? lEstSortiePeda
						? GTraductions.getValeur("AbsenceVS.ElevePresentSP")
						: GTraductions.getValeur("AbsenceVS.ElevePresent")
					: lEstSortiePeda
						? GTraductions.getValeur("AbsenceVS.AucunElevePresentSP")
						: GTraductions.getValeur("AbsenceVS.AucunElevePresent"),
		);
		if (
			this.listeElevesStage &&
			this.listeElevesStage.count &&
			this.listeElevesStage.count() > 0
		) {
			H.push(
				'&nbsp;-&nbsp;<span title="',
				GChaine.toTitle(this.listeElevesStage.getTableauLibelles().join("\n")),
				'">',
				this.listeElevesStage.count() === 1
					? GTraductions.getValeur("Absence.EleveEnStage")
					: GChaine.format(GTraductions.getValeur("Absence.ElevesEnStage"), [
							this.listeElevesStage.count(),
						]),
				"</span>",
			);
		}
		if (this.elevesDetaches && this.elevesDetaches.str) {
			H.push(
				'&nbsp;-&nbsp;<span title="',
				GChaine.toTitle(this.elevesDetaches.hint),
				'">' + this.elevesDetaches.str + "</span>",
			);
		}
		$("#" + this.Nom.escapeJQ() + "_Nb_Eleve_Present").ieHtml(H.join(""));
	}
	_gestionFocusApresFenetreRecap() {
		if (this._gestionFocus_apresFenetreRecapId) {
			GHtml.setFocus(this._gestionFocus_apresFenetreRecapId, true, true);
		}
		delete this._gestionFocus_apresFenetreRecapId;
	}
	_gestionFocusApresFenetreCellule() {
		if (this._gestionFocus_apresFenetreCelluleId) {
			GHtml.setFocus(this._gestionFocus_apresFenetreCelluleId, true, true);
		}
		delete this._gestionFocus_apresFenetreCelluleId;
	}
}
function _initialiserCelluleDate(aInstance) {
	aInstance.setOptionsObjetCelluleDate({
		largeurComposant: 100,
		formatDate: "%JJJ %J %MMM",
		derniereDate: GDate.getDateCourante(true),
	});
}
function _evenementDateValidation(aDate) {
	this.Date = aDate;
	this.jourConsultUniquement =
		this.ListeDates.getIndiceElementParFiltre((aElement) => {
			return GDate.estJourEgal(aElement.Date, this.Date);
		}) === -1;
	this.moteur.setOptions({ Date: this.Date });
	GEtatUtilisateur.setNavigationDate(aDate);
	this.setEtatSaisie(false);
	this.Eleve = null;
	this.getInstance(this.IdentComboRessource).setDonnees(
		this.ListeRessources,
		this.SelectionRessource === null || this.SelectionRessource === undefined
			? 0
			: this.SelectionRessource,
	);
}
function avecCheckboxAppelTermine() {
	return (
		GApplication.droits.get(TypeDroits.absences.avecSaisieAbsence) ||
		GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.SaisieAbsences_Appel ||
		GEtatUtilisateur.getGenreOnglet() ===
			EGenreOnglet.SaisieAbsences_Appel_Professeur
	);
}
function avecDemandesDispense() {
	return (
		this.appelDedieEnseignant ||
		GApplication.droits.get(TypeDroits.dispenses.saisie)
	);
}
function _avecCBEDTPermanence() {
	return (
		(GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.SaisieAbsences_Appel ||
			GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_AppelEtSuivi) &&
		GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement &&
		GApplication.droits.get(TypeDroits.fonctionnalites.gestionPermanence)
	);
}
function _actualiserGrilleEleve(aEleve) {
	this.grilleEleve
		.getDecorateurAbsences()
		.setDonnees({
			absencesGrille: aEleve && aEleve.grille ? aEleve.grille.absences : null,
			listeAbsences: this.Eleve ? this.Eleve.ListeAbsences : null,
			listeDispenses: this.Eleve ? this.Eleve.ListeDispenses : null,
			cours: this.paramCours.cours,
		});
	this.grilleEleve.setDonnees({
		date: GDate.getDateDemiJour(this.Date),
		listeCours:
			aEleve && aEleve.grille
				? aEleve.grille.listeCours
				: new ObjetListeElements(),
		avecCoursAnnule: GEtatUtilisateur.getAvecCoursAnnule(),
	});
}
function _actualiserEDTEleve() {
	if (!this.grilleEleve) {
		return;
	}
	if (!this.Eleve) {
		_actualiserGrilleEleve.call(this, null);
	} else if (this.Eleve.grille && this.Eleve.grille.listeCours) {
		_actualiserGrilleEleve.call(this, this.Eleve);
	} else {
		if (this._requeteEDTEnCours) {
			return;
		}
		const lThis = this;
		this._requeteEDTEnCours = true;
		new ObjetRequetePageEmploiDuTemps(this, (aParam) => {
			delete lThis._requeteEDTEnCours;
			lThis.Eleve.grille = {
				listeCours: aParam.listeCours,
				absences: aParam.absences,
			};
			_actualiserGrilleEleve.call(lThis, lThis.Eleve);
		}).lancerRequete({
			ressource: new ObjetElement(
				"",
				this.Eleve.getNumero(),
				EGenreRessource.Eleve,
			),
			dateDebut: this.Date,
			avecAbsencesEleve: true,
			avecRetenuesEleve: true,
			avecCoursSortiePeda: true,
		});
	}
}
function _afficherEDTEleve() {
	if (this.grilleEleve) {
		this.grilleEleve.free();
	}
	this.grilleEleve = null;
	$("#" + this.idGrilleEleve.escapeJQ())
		.ieHtml("")
		.hide();
	if (this.avecGrilleEleve) {
		this.grilleEleve = Identite.creerInstance(ObjetGrille, { pere: this });
		const T = [];
		T.push(
			'<div class="Espace AlignementMilieu" ie-html="getTitreGrilleEleve" ie-ellipsis>&nbsp;</div>',
		);
		T.push(
			'<div id="' +
				this.grilleEleve.Nom +
				'" style="position:absolute;top:20px;left:0;right:0;bottom:0;"></div>',
		);
		$("#" + this.idGrilleEleve.escapeJQ())
			.show()
			.ieHtml(T.join(""), { controleur: this.controleur });
		this.grilleEleve.recupererDonnees();
		this.grilleEleve.setOptions({
			tailleMINPasHoraire: GNavigateur.isLayoutTactile ? 20 : undefined,
			avecSelectionCours: false,
			decorateurAbsences: new TDecorateurAbsencesGrille().setOptions({
				couleurAbsence: "#FFCC66",
				couleurRetard: "#4020E1",
			}),
			avecSeparationDemiJAbsence: true,
		});
		this.grilleEleve.moduleCours.setParametres({
			filtresImagesUniquement: [
				TUtilitaireGrilleImageCoursPN.type.dispense,
				TUtilitaireGrilleImageCoursPN.type.aucunEleve,
			],
			avecVoileCoursObligDispense: false,
			modeGrilleAbsence: true,
			couleurFondCours: "#E1E1E1",
		});
		_actualiserEDTEleve.call(this);
	}
	if (!GNavigateur.isLayoutTactile) {
		const lRight = this.avecGrilleEleve
			? this.largeurGrilleEleve + GNavigateur.getLargeurBarreDeScroll() + "px"
			: 0;
		$("#" + this.getInstance(this.idSaisieAbsences).getNom().escapeJQ())
			.parent()
			.css("right", lRight);
	}
	if (
		this.ListeEleves &&
		this.paramCours.cours &&
		!this.paramCours.cours.estAnnule &&
		this.paramCours.cours.utilisable
	) {
		this.getInstance(this.idSaisieAbsences).setDonneesAbsences();
	}
}
function _afficherMessageGrilleAbsence(aMessage) {
	this.getInstance(this.idSaisieAbsences).afficher(
		this.getInstance(this.idSaisieAbsences).composeMessage(aMessage),
	);
	$("#" + this.Nom.escapeJQ() + "_Appel_Termine").css("display", "none");
	this.getInstance(this.idSaisieAbsences).setEnAffichage(false);
}
function _supprimerEleveDuCours() {
	const lSelf = this;
	GApplication.getMessage().afficher({
		type: EGenreBoiteMessage.Confirmation,
		message: GChaine.format(
			GTraductions.getValeur("AbsenceVS.ConfirmationSuppressionEleve"),
			[lSelf.Eleve.getLibelle()],
		),
		callback: function (aGenreAction) {
			if (aGenreAction === EGenreAction.Valider) {
				lSelf.ListeEleves.getElementParNumero(lSelf.Eleve.getNumero()).setEtat(
					EGenreEtat.Suppression,
				);
				lSelf.valider();
			}
		},
	});
}
Requetes.inscrire("SaisieModifierPresenceEleveDansCours", ObjetRequeteSaisie);
function _evenementSurFenetre_SelectionElevesSansCours(
	aNumeroBouton,
	aParametres,
) {
	if (aNumeroBouton === 1) {
		Requetes(
			"SaisieModifierPresenceEleveDansCours",
			this,
			this.actionSurValidation,
		).lancerRequete(aParametres);
	}
}
function _actualisationVisibiliteCoursAnnule() {
	if (this.ListeCours) {
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		Object.assign(this.donneesGrille, {
			avecCoursAnnule: GEtatUtilisateur.getAvecCoursAnnule(),
		});
		this.getInstance(this.IdentGrille).setDonnees(this.donneesGrille);
	}
	const lCours = GEtatUtilisateur.getNavigationCours();
	let lAvecCoursSelectionne = false;
	if (this.ListeCours && lCours !== null && lCours !== undefined) {
		lAvecCoursSelectionne = this.getInstance(this.IdentGrille)
			.getInstanceGrille()
			.selectionnerCours(lCours, false);
	}
	if (lAvecCoursSelectionne) {
		_actualiserEDTEleve.call(this);
	} else if (
		this.GenreRessource !== EGenreRessource.Classe &&
		this.GenreRessource !== EGenreRessource.Groupe
	) {
		_deselectionCours.call(this);
	}
}
function _deselectionCours() {
	this.paramCours = {};
	delete this.Eleve;
	this.getInstance(this.idSaisieAbsences).setActif(true);
	_afficherMessageGrilleAbsence.call(
		this,
		this.GenreRessource === EGenreRessource.Cours
			? GTraductions.getValeur("AbsenceVS.selectionnerCours")
			: "",
	);
	_actualiserEDTEleve.call(this);
	this.activerFichesEleve(false);
}
module.exports = ObjetAffichagePageSaisieAbsences;
