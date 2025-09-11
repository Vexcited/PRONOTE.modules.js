exports.InterfacePageAccueil = void 0;
const ObjetRequetePageAccueil_1 = require("ObjetRequetePageAccueil");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetIdentite_1 = require("ObjetIdentite");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetFenetre_ParametresWidgets_1 = require("ObjetFenetre_ParametresWidgets");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const Enumere_Widget_1 = require("Enumere_Widget");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const GestionnaireBlocCDT_2 = require("GestionnaireBlocCDT");
const GestionnaireBlocCDC_1 = require("GestionnaireBlocCDC");
const GestionnaireBlocCDC_2 = require("GestionnaireBlocCDC");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Bloc_1 = require("ObjetFenetre_Bloc");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_ListeTAFFaits_2 = require("ObjetFenetre_ListeTAFFaits");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const ObjetMoteurAccueilPN_1 = require("ObjetMoteurAccueilPN");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const TypeDemiJournee_1 = require("TypeDemiJournee");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
const MultipleObjetRequeteSaisieAccueil = require("ObjetRequeteSaisieAccueil");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ObjetRequeteDonneesContenusCDT_1 = require("ObjetRequeteDonneesContenusCDT");
class InterfacePageAccueil extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.moteur = new ObjetMoteurAccueilPN_1.ObjetMoteurAccueil();
		this.etatUtilisateurSco = GEtatUtilisateur;
		this.parametresSco = GParametres;
		this.interfaceEspace = GInterface;
		this.applicationEspace = GApplication;
		this.idWrapper = this.Nom + "_defaut_";
		this.idColonne = this.Nom + "_colonne_";
		this.idBoutonParametres = this.Nom + "_idBoutonParametres";
		this.suffixIdWrapper = "_suffWrap";
		this._classActualiteSaisieDirect = GUID_1.GUID.getClassCss();
		this.genreColonne = this.moteur.genreColonne;
		this.tailleImages = 17;
		this.etatUtilisateurSco.widgets =
			this.applicationSco.parametresUtilisateur.get("widgets") || [];
		UtilitaireWidget_1.UtilitaireWidget.setParametres({
			avecFermer: [
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecToutVoir: ![
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
			avecCompteur: [
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace),
		});
		this.dateParDefaut = GApplication.getDateDemo()
			? GApplication.getDateDemo()
			: this.parametresSco.JourOuvre;
		if (
			!GApplication.getDateDemo() &&
			([
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) ||
				([Enumere_Espace_1.EGenreEspace.PrimProfesseur].includes(
					GEtatUtilisateur.GenreEspace,
				) &&
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.estDirecteur,
					)))
		) {
			this.dateParDefaut = ObjetDate_1.GDate.getDateCourante();
			const lHeureMidi = ObjetDate_1.GDate.placeParJourEnDate(
				this.parametresSco.PlaceDemiJournee,
			);
			const lHeure = ObjetDate_1.GDate.getDateHeureCourante();
			this.demiJournee = ObjetDate_1.GDate.estAvantJour(lHeure, lHeureMidi)
				? TypeDemiJournee_1.TypeDemiJournee.Matin
				: TypeDemiJournee_1.TypeDemiJournee.ApresMidi;
		}
		this.numeroSemaineParDefaut = IE.Cycles.cycleDeLaDate(this.dateParDefaut);
		this.moteur.setDateParDefaut(this.dateParDefaut);
		this.moteur.setSemaineSelectionnee(this.numeroSemaineParDefaut);
		this.donneesRequete = {
			dateGrille: this.dateParDefaut,
			numeroSemaine: this.numeroSemaineParDefaut,
			coursNonAssures: { numeroSemaine: this.numeroSemaineParDefaut },
			personnelsAbsents: { numeroSemaine: this.numeroSemaineParDefaut },
			incidents: { numeroSemaine: this.numeroSemaineParDefaut },
			exclusions: { numeroSemaine: this.numeroSemaineParDefaut },
			donneesVS: { numeroSemaine: this.numeroSemaineParDefaut },
			registreAppel: { date: this.dateParDefaut, dj: this.demiJournee },
			previsionnelAbsServiceAnnexe: { date: this.dateParDefaut },
			donneesProfs: { numeroSemaine: this.numeroSemaineParDefaut },
			EDT: { numeroSemaine: this.numeroSemaineParDefaut },
			menuDeLaCantine: { date: this.dateParDefaut },
			TAFARendre: { date: this.dateParDefaut },
			TAFEtActivites: { date: this.dateParDefaut },
			partenaireCDI: { CDI: new ObjetElement_1.ObjetElement() },
			tableauDeBord: { date: this.dateParDefaut },
			modificationsEDT: { date: this.dateParDefaut },
		};
		this._classActualiteSaisieDirect = GUID_1.GUID.getClassCss();
		this.tailleImages = 17;
		this.instancesWidgets = {};
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.modeExclusif,
			this._setModeExclusif,
			this,
		);
		$(window).on("load.intpageaccueil resize.intpageaccueil", () => {
			if (!this.DonneesRecues || this.isDestroyed()) {
				return;
			}
			if (
				GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Parent ||
				GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Eleve ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Accompagnant ||
				GEtatUtilisateur.GenreEspace === Enumere_Espace_1.EGenreEspace.Tuteur ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur
			) {
				this._changerColWrapper();
				if (ObjetNavigateur_1.Navigateur.isTactile) {
					this._forEachWidget((aWidget) => {
						if (aWidget.resize) {
							aWidget.resize();
						}
					});
				}
			}
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			evtSurBtnParametresWidgets: {
				event(aEvent) {
					aInstance.evtSurBtnParametresWidgets();
					aEvent.preventDefault();
					aEvent.stopImmediatePropagation();
				},
			},
		});
	}
	free() {
		super.free();
		$(window).off("load.intpageaccueil resize.intpageaccueil");
	}
	declarerWidgets() {
		this.donnees = {
			actualites: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.actualites,
			),
			agenda: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.agenda,
			),
			aide: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.aide,
			),
			appelNonFait: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.appelNonFait,
			),
			carnetDeCorrespondance: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.carnetDeCorrespondance,
			),
			casier: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.casier,
			),
			CDTNonSaisi: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.CDTNonSaisi,
			),
			conseilDeClasse: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.conseilDeClasse,
			),
			infosParcoursupLSL: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.InfosParcoursupLSL,
			),
			competences: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.competences,
			),
			connexionsEnCours: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.connexionsEnCours,
			),
			coursNonAssures: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.coursNonAssures,
			),
			devoirSurveille: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.DS,
			),
			devoirSurveilleEvaluation: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.DSEvaluation,
			),
			discussions: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.discussions,
			),
			donneesProfs: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.donneesProfs,
			),
			donneesVS: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.donneesVS,
			),
			EDT: this.moteur.getDeclarationWidget(Enumere_Widget_1.EGenreWidget.EDT),
			elections: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.elections,
			),
			voteElecMembreBureau: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
			),
			voteElecElecteur: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.voteElecElecteur,
			),
			enseignementADistance: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.enseignementADistance,
			),
			exclusions: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.exclusions,
			),
			incidents: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.incidents,
			),
			intendanceExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.IntendanceExecute,
			),
			kiosque: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.kiosque,
			),
			lienUtile: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.lienUtile,
			),
			menuDeLaCantine: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
			),
			notes: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.notes,
			),
			partenaireAgate: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.partenaireAgate,
			),
			partenaireArd: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.partenaireARD,
			),
			partenaireApplicam: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.partenaireApplicam,
			),
			partenaireCDI: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.partenaireCDI,
			),
			penseBete: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.penseBete,
			),
			personnelsAbsents: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.personnelsAbsents,
			),
			planning: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.Planning,
			),
			QCM: this.moteur.getDeclarationWidget(Enumere_Widget_1.EGenreWidget.QCM),
			ressources: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.ressources,
			),
			ressourcePedagogique: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.ressourcePedagogique,
			),
			tachesSecretariatExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute,
			),
			maintenanceInfoExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
			),
			travailAFaire: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.travailAFaire,
			),
			TAFARendre: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.TAFARendre,
			),
			vieScolaire: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.vieScolaire,
			),
			suiviAbsRetardsARegler: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.absRetardsJustifiesParents,
			),
			blogFilActu: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.blogFilActu,
			),
			commandeExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.commandeExecute,
			),
			modificationsEDT: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.modificationEDT,
			),
			remplacementsenseignants: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants,
			),
			documentsASigner: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.documentsASigner,
			),
		};
	}
	declarerWidgetsPourPrimaire() {
		this.donnees = {
			vieScolaire: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.vieScolaire,
			),
			agenda: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.agenda,
			),
			actualites: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.actualites,
			),
			discussions: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.discussions,
			),
			casier: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.casier,
			),
			EDT: this.moteur.getDeclarationWidget(Enumere_Widget_1.EGenreWidget.EDT),
			penseBete: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.penseBete,
			),
			tableauDeBord: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.tableauDeBord,
			),
			donneesVS: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.donneesVS,
			),
			registreAppel: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.registreAppel,
			),
			previsionnelAbsServiceAnnexe: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe,
			),
			incidents: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.incidents,
			),
			intendanceExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.IntendanceExecute,
			),
			maintenanceInfoExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
			),
			commandeExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.commandeExecute,
			),
			QCM: this.moteur.getDeclarationWidget(Enumere_Widget_1.EGenreWidget.QCM),
			travailAFaire: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.travailAFaire,
			),
			competences: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.competences,
			),
			ressourcePedagogique: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.ressourcePedagogique,
			),
			kiosque: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.kiosque,
			),
			lienUtile: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.lienUtile,
			),
			partenaireAgate: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.partenaireAgate,
			),
			blogFilActu: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.blogFilActu,
			),
			TAFEtActivites: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.TAFEtActivites,
			),
			menuDeLaCantine: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
			),
			suiviAbsRetardsARegler: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.absRetardsJustifiesParents,
			),
			partenaireFAST: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.partenaireFAST,
			),
			voteElecMembreBureau: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
			),
			voteElecElecteur: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.voteElecElecteur,
			),
			documentsASigner: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.documentsASigner,
			),
		};
	}
	getWidget(aGenre) {
		switch (aGenre) {
			case Enumere_Widget_1.EGenreWidget.discussions:
				return this.donnees.discussions;
			case Enumere_Widget_1.EGenreWidget.casier:
				return this.donnees.casier;
			case Enumere_Widget_1.EGenreWidget.appelNonFait:
				return this.donnees.appelNonFait;
			case Enumere_Widget_1.EGenreWidget.CDTNonSaisi:
				return this.donnees.CDTNonSaisi;
			case Enumere_Widget_1.EGenreWidget.conseilDeClasse:
				return this.donnees.conseilDeClasse;
			case Enumere_Widget_1.EGenreWidget.InfosParcoursupLSL:
				return this.donnees.infosParcoursupLSL;
			case Enumere_Widget_1.EGenreWidget.menuDeLaCantine:
				return this.donnees.menuDeLaCantine;
			case Enumere_Widget_1.EGenreWidget.vieScolaire:
				return this.donnees.vieScolaire;
			case Enumere_Widget_1.EGenreWidget.absRetardsJustifiesParents:
				return this.donnees.suiviAbsRetardsARegler;
			case Enumere_Widget_1.EGenreWidget.travailAFaire:
				return this.donnees.travailAFaire;
			case Enumere_Widget_1.EGenreWidget.agenda:
				return this.donnees.agenda;
			case Enumere_Widget_1.EGenreWidget.actualites:
				return this.donnees.actualites;
			case Enumere_Widget_1.EGenreWidget.notes:
				return this.donnees.notes;
			case Enumere_Widget_1.EGenreWidget.QCM:
				return this.donnees.QCM;
			case Enumere_Widget_1.EGenreWidget.EDT:
				return this.donnees.EDT;
			case Enumere_Widget_1.EGenreWidget.Planning:
				return this.donnees.planning;
			case Enumere_Widget_1.EGenreWidget.ressources:
				return this.donnees.ressources;
			case Enumere_Widget_1.EGenreWidget.kiosque:
				return this.donnees.kiosque;
			case Enumere_Widget_1.EGenreWidget.ressourcePedagogique:
				return this.donnees.ressourcePedagogique;
			case Enumere_Widget_1.EGenreWidget.DS:
				return this.donnees.devoirSurveille;
			case Enumere_Widget_1.EGenreWidget.aide:
				return this.donnees.aide;
			case Enumere_Widget_1.EGenreWidget.competences:
				return this.donnees.competences;
			case Enumere_Widget_1.EGenreWidget.coursNonAssures:
				return this.donnees.coursNonAssures;
			case Enumere_Widget_1.EGenreWidget.personnelsAbsents:
				return this.donnees.personnelsAbsents;
			case Enumere_Widget_1.EGenreWidget.penseBete:
				return this.donnees.penseBete;
			case Enumere_Widget_1.EGenreWidget.DSEvaluation:
				return this.donnees.devoirSurveilleEvaluation;
			case Enumere_Widget_1.EGenreWidget.carnetDeCorrespondance:
				return this.donnees.carnetDeCorrespondance;
			case Enumere_Widget_1.EGenreWidget.TAFARendre:
				return this.donnees.TAFARendre;
			case Enumere_Widget_1.EGenreWidget.IntendanceExecute:
				return this.donnees.intendanceExecute;
			case Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute:
				return this.donnees.tachesSecretariatExecute;
			case Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute:
				return this.donnees.maintenanceInfoExecute;
			case Enumere_Widget_1.EGenreWidget.lienUtile:
				return this.donnees.lienUtile;
			case Enumere_Widget_1.EGenreWidget.partenaireCDI:
				return this.donnees.partenaireCDI;
			case Enumere_Widget_1.EGenreWidget.partenaireAgate:
				return this.donnees.partenaireAgate;
			case Enumere_Widget_1.EGenreWidget.partenaireARD:
				return this.donnees.partenaireArd;
			case Enumere_Widget_1.EGenreWidget.partenaireApplicam:
				return this.donnees.partenaireApplicam;
			case Enumere_Widget_1.EGenreWidget.exclusions:
				return this.donnees.exclusions;
			case Enumere_Widget_1.EGenreWidget.incidents:
				return this.donnees.incidents;
			case Enumere_Widget_1.EGenreWidget.donneesVS:
				return this.donnees.donneesVS;
			case Enumere_Widget_1.EGenreWidget.donneesProfs:
				return this.donnees.donneesProfs;
			case Enumere_Widget_1.EGenreWidget.tableauDeBord:
				return this.donnees.tableauDeBord;
			case Enumere_Widget_1.EGenreWidget.connexionsEnCours:
				return this.donnees.connexionsEnCours;
			case Enumere_Widget_1.EGenreWidget.elections:
				return this.donnees.elections;
			case Enumere_Widget_1.EGenreWidget.voteElecMembreBureau:
				return this.donnees.voteElecMembreBureau;
			case Enumere_Widget_1.EGenreWidget.voteElecElecteur:
				return this.donnees.voteElecElecteur;
			case Enumere_Widget_1.EGenreWidget.enseignementADistance:
				return this.donnees.enseignementADistance;
			case Enumere_Widget_1.EGenreWidget.blogFilActu:
				return this.donnees.blogFilActu;
			case Enumere_Widget_1.EGenreWidget.TAFEtActivites:
				return this.donnees.TAFEtActivites;
			case Enumere_Widget_1.EGenreWidget.commandeExecute:
				return this.donnees.commandeExecute;
			case Enumere_Widget_1.EGenreWidget.registreAppel:
				return this.donnees.registreAppel;
			case Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe:
				return this.donnees.previsionnelAbsServiceAnnexe;
			case Enumere_Widget_1.EGenreWidget.partenaireFAST:
				return this.donnees.partenaireFAST;
			case Enumere_Widget_1.EGenreWidget.modificationEDT:
				return this.donnees.modificationsEDT;
			case Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants:
				return this.donnees.remplacementsenseignants;
			case Enumere_Widget_1.EGenreWidget.documentsASigner:
				return this.donnees.documentsASigner;
		}
	}
	construireInstances() {
		if (this.etatUtilisateurSco.pourPrimaire()) {
			this.declarerWidgetsPourPrimaire();
		} else {
			this.declarerWidgets();
		}
		this._forEachWidget((aWidget) => {
			if (aWidget.classWidget !== undefined) {
				aWidget.construire = this._construireInstanceWidget.bind(this);
				const lFonctionExisteWidget = aWidget.existeWidget;
				aWidget.existeWidget = () => {
					return (
						!!aWidget.classWidget &&
						(!lFonctionExisteWidget || lFonctionExisteWidget.call(this))
					);
				};
			}
		});
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			this.evenementSurVisuEleve,
		);
		if (this.etatUtilisateurSco.avecParametrageWidget()) {
			this.identFenetreParametresWidgets = this.add(
				ObjetFenetre_ParametresWidgets_1.ObjetFenetre_ParametresWidgets,
				this.surEvenementsFenetreParametresWidgets,
				_initialiserFenetreParametresWidgets,
			);
		}
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this.surPostResize,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	detruireInstances() {
		clearTimeout(this._timeoutActualiserScroll);
		Invocateur_1.Invocateur.desabonner("notification_Kiosque", this);
		$(
			"#" +
				GInterface.getInstance(
					this.interfaceEspace.IdentBandeauEntete,
				).idSecondMenu.escapeJQ() +
				" .objetBandeauEntete_fullsize .precedenteConnexion",
		).remove();
	}
	surEvenementsFenetreParametresWidgets() {
		this.applicationSco.parametresUtilisateur.set(
			"widgets",
			this.etatUtilisateurSco.widgets,
		);
		this.actionSurRequeteSaisie();
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lNomEspace = MethodesObjet_1.MethodesObjet.nomProprieteDeValeur(
			Enumere_Espace_1.EGenreEspace,
			GEtatUtilisateur.GenreEspace,
		).toLowerCase();
		H.push(
			'<div tabindex="-1" id="',
			this.idWrapper,
			'" class="AffichagePageAccueil',
			this.applicationEspace.estEDT
				? " is-edt"
				: this.etatUtilisateurSco.pourPrimaire()
					? " primaire"
					: "",
			" dotty ",
			lNomEspace,
			'">',
		);
		H.push("</div>");
		return H.join("");
	}
	actualiserColonnes() {
		const H = [],
			lColonnes = [];
		let lLignes = [];
		for (let i in this.genreColonne) {
			if (this.genreColonne[i].actif) {
				lColonnes[this.genreColonne[i].position] = i;
			}
		}
		H.push('<div class="widgets-global-container">');
		for (let i = 0; i < lColonnes.length; i++) {
			if (lColonnes[i]) {
				lLignes = [];
				const lColonne = this.genreColonne[lColonnes[i]];
				lColonne.liste.forEach((aGenreWidget) => {
					if (aGenreWidget !== null) {
						const lWidget = this.getWidget(aGenreWidget);
						if (
							lWidget &&
							lWidget.construire &&
							lWidget.existeWidget.call(this)
						) {
							lLignes.push(lWidget);
						}
					}
				});
				const lGenresCols = Object.keys(this.genreColonne);
				H.push(
					'<div data-name="cols-widgets-conteneur" id="',
					this.idColonne,
					lColonne.genre,
					'" class="' +
						lGenresCols[lColonne.genre].toLowerCase() +
						' wrapper-cols ">',
				);
				let lNbMax = 0;
				for (let j = 0; j < lLignes.length; j++) {
					if (
						lLignes[j] &&
						lLignes[j].maximise &&
						(!this.etatUtilisateurSco.widgets[lLignes[j].genre] ||
							this.etatUtilisateurSco.widgets[lLignes[j].genre].visible)
					) {
						lNbMax += 1;
					}
				}
				const lPourcent = Math.floor(100 / lNbMax);
				for (let j = 0; j < lLignes.length; j++) {
					if (lLignes[j]) {
						const lNomClasseWidget =
							Enumere_Widget_1.EGenreWidgetUtil.getNomClasseWidget(
								lLignes[j].genre,
							);
						const lWidgetCollapse = lLignes[j].isCollapsible;
						H.push(
							'<section tabindex="-1"',
							!lLignes[j].titre
								? ' aria-labelledby="' + lLignes[j].id + '_TitreText"'
								: "",
							' id="',
							lLignes[j].id +
								UtilitaireWidget_1.UtilitaireWidget.suffixIdWidget,
							'" class="widget ',
							lNomClasseWidget,
							!!lWidgetCollapse || lWidgetCollapse === undefined
								? " collapsible"
								: "",
							'" style="height:',
							lNbMax > 0 ? lPourcent + '%;"' : 'auto;"',
							"></section>",
						);
					}
				}
				H.push("</div>");
			}
		}
		H.push("</div>");
		this.actualiserVisibiliteColonnes();
		$("#" + this.idWrapper.escapeJQ()).ieHtml(H.join(""), {
			controleur: this.controleur,
		});
	}
	fermerFiches() {
		if (this.fenetreCDT) {
			this.fenetreCDT.fermer();
		}
		this._forEachWidget((aWidget) => {
			if (aWidget.fermerFiches) {
				aWidget.fermerFiches();
			}
		});
	}
	recupererDonnees(aWidgets, aEviterFermeture) {
		if (aWidgets) {
			if (this.fenetreCDT && !aEviterFermeture) {
				this.fenetreCDT.fermer();
			}
			this.donneesRequete.widgets = aWidgets;
			this.eviterFermeture = aEviterFermeture;
			new ObjetRequetePageAccueil_1.ObjetRequetePageAccueil(
				this,
				this.actionSurRecupererDonneesDeWidget,
			).lancerRequete(this.donneesRequete);
		} else {
			if (GInterface.getInstance(this.interfaceEspace.IdentBandeauEntete)) {
				const lIFCBandeau = GInterface.getInstance(
					this.interfaceEspace.IdentBandeauEntete,
				);
				lIFCBandeau.getInstance(lIFCBandeau.identMenuOnglets)._fermer();
			}
			this.setEtatSaisie(false);
			new ObjetRequetePageAccueil_1.ObjetRequetePageAccueil(
				this,
				this.actionSurRecupererDonnees,
			).lancerRequete(this.donneesRequete);
		}
		$(`#${this.applicationEspace.idLigneBandeau.escapeJQ()}`)
			.show()
			.addClass("sr-only");
	}
	evenementSurVisuEleve(aParam) {
		if (aParam.action === ObjetVisuEleveQCM_1.TypeCallbackVisuEleveQCM.close) {
			this.fermerFiches();
			this.recupererDonnees();
		}
	}
	actionSurRecupererDonnees(aObjet, aAutorisationKiosque) {
		this.etatUtilisateurSco.kiosque = aObjet.kiosque;
		this.etatUtilisateurSco.autorisationKiosque = aAutorisationKiosque;
		if (GEtatUtilisateur.avecPageAccueil()) {
			this.traiterDonnees(aObjet);
		}
		GEtatUtilisateur.premierChargement = false;
		this.fermerFiches();
		this.setContenuPourSecondMenu();
	}
	actionSurRecupererDonneesDeWidget(aObjet) {
		if (GEtatUtilisateur.avecPageAccueil()) {
			if (aObjet.message) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: aObjet.message,
				});
				return;
			}
			if (aObjet.EDT && this.donnees.EDT) {
				this.donnees.EDT.listeCours = null;
				this.donnees.EDT.listeAbsRessources = null;
				this.donnees.EDT.joursStage = null;
				this.donnees.EDT.disponibilites = null;
				this.donnees.EDT.prefsGrille = null;
				this.donnees.EDT.absences = null;
			}
			if (aObjet.planning && this.donnees.planning) {
				this.donnees.planning.listeRessourcesPlanning =
					new ObjetListeElements_1.ObjetListeElements();
			}
			$.extend(true, this.donnees, aObjet);
			for (const i in aObjet) {
				if (aObjet[i]) {
					if (
						this.donnees[i] &&
						this.donnees[i].construire &&
						this.donnees[i].existeWidget.call(this)
					) {
						this.donnees[i].construire.call(this, this.donnees[i]);
					} else if (!this.donnees[i].existeWidget.call(this)) {
						$(
							"#" +
								(
									this.donnees[i].id +
									UtilitaireWidget_1.UtilitaireWidget.suffixIdWidget
								).escapeJQ(),
						).remove();
					}
				}
			}
			this.actualiserVisibiliteColonnes();
			if (!this.eviterFermeture) {
				this._positionScrollY = ObjetHtml_1.GHtml.getElement(
					this.Nom,
				).scrollTop;
				$(window).trigger("resize");
			} else {
				this.eviterFermeture = undefined;
			}
		}
	}
	traiterDonnees(aObjet) {
		const lThis = this;
		function _estDonneeVisibleDeColonne(aColonne) {
			return (
				aColonne.liste.filter((aGenreWidget) => {
					if (aGenreWidget !== null) {
						const lWidget = lThis.getWidget(aGenreWidget);
						return (
							lWidget && lWidget.construire && lWidget.existeWidget.call(lThis)
						);
					}
				}).length > 0
			);
		}
		$.extend(true, this.donnees, aObjet);
		this.moteur.setDonnees(this.donnees);
		this.DonneesRecues = true;
		for (let i in this.genreColonne) {
			const lAvecColonneVisible = _estDonneeVisibleDeColonne(
				this.genreColonne[i],
			);
			this.genreColonne[i].actif = lAvecColonneVisible;
			this.genreColonne[i].visible = lAvecColonneVisible;
		}
		this.actualiserAffichage();
		this.surResizeInterface();
	}
	actualiserAffichage() {
		if (!this.DonneesRecues) {
			return;
		}
		this.actualiserColonnes();
		let i;
		for (i in this.donnees) {
			if (
				this.donnees[i] &&
				this.donnees[i].construire &&
				this.donnees[i].existeWidget.call(this)
			) {
				this.donnees[i].construire.call(this, this.donnees[i]);
			}
		}
		if (GApplication.getModeExclusif()) {
			this._setModeExclusif(true);
		}
		$(window).trigger("resize");
	}
	_setModeExclusif(aModeExclusif) {
		$(
			'input:checkbox[id^="' + (this.Nom + "_inputVS_").escapeJQ() + '"] ',
		).inputDisabled(aModeExclusif);
	}
	setContenuPourSecondMenu() {
		if (
			this.getInstance(this.identFenetreParametresWidgets) &&
			$("#" + this.idBoutonParametres.escapeJQ()).length === 0
		) {
			$(
				"#" +
					this.interfaceEspace
						.getInstance(this.interfaceEspace.IdentBandeauEntete)
						.idSecondMenu.escapeJQ() +
					" > div:first",
			).ieHtmlAppend(
				IE.jsx.str("ie-btnicon", {
					id: this.idBoutonParametres,
					"ie-model": "evtSurBtnParametresWidgets",
					class: "icon_cog bt-activable",
					"aria-haspopup": "dialog",
					"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
						"Accueil.ParametresWidgets",
					),
				}),
				{ controleur: this.controleur },
			);
		}
		if (
			this.etatUtilisateurSco.derniereConnexion &&
			!this.parametresSco.estAfficheDansENT
		) {
			const lIdMenu =
				"#" +
				this.interfaceEspace
					.getInstance(this.interfaceEspace.IdentBandeauEntete)
					.idSecondMenu.escapeJQ() +
				" .objetBandeauEntete_fullsize";
			$(lIdMenu + " .precedenteConnexion").remove();
			$(lIdMenu).append(
				[
					'<span class="precedenteConnexion">',
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.PrecedenteConnection",
						[
							ObjetDate_1.GDate.formatDate(
								this.etatUtilisateurSco.derniereConnexion,
								"%JJJJ %JJ %MMMM",
							),
							ObjetDate_1.GDate.formatDate(
								this.etatUtilisateurSco.derniereConnexion,
								"%hh%sh%mm",
							),
						],
					),
					"</span>",
				].join(""),
			);
		}
	}
	evtSurBtnParametresWidgets() {
		const lFenetreParametrageWidgets = this.getInstance(
			this.identFenetreParametresWidgets,
		);
		if (!!lFenetreParametrageWidgets) {
			const lListe = this.getListeWidgets();
			lFenetreParametrageWidgets.setDonnees(lListe);
		}
	}
	getListeWidgets() {
		const lListeWidgets = new ObjetListeElements_1.ObjetListeElements();
		for (const i in this.genreColonne) {
			const lColonne = this.genreColonne[i];
			lColonne.liste.forEach((aGenreWidget, aIndice) => {
				if (aGenreWidget !== null) {
					const lWidget = this.getWidget(aGenreWidget);
					if (
						lWidget &&
						lWidget.construire &&
						lWidget.existeWidget.call(this)
					) {
						const lObjetWidget = ObjetElement_1.ObjetElement.create({
							widget: this.getWidget(aGenreWidget),
							positionColonne: lColonne.position,
							position: aIndice,
						});
						lListeWidgets.addElement(lObjetWidget);
					}
				}
			});
		}
		lListeWidgets.setTri([
			ObjetTri_1.ObjetTri.init("positionColonne"),
			ObjetTri_1.ObjetTri.init("position"),
		]);
		lListeWidgets.trier();
		return lListeWidgets;
	}
	construireWidget(aWidget) {
		if (!this.etatUtilisateurSco.widgets[aWidget.genre]) {
			this.etatUtilisateurSco.widgets[aWidget.genre] = { visible: true };
		}
		const lThis = this;
		const lInstanceWidget = this.instancesWidgets[aWidget.genre];
		lInstanceWidget.controleur.boutons = {
			surToutVoir(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surToutVoir(aGenreWidget);
				});
			},
			surLienExterne(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surLienExterne(aGenreWidget);
				});
			},
			surFermer(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surFermer(aGenreWidget);
				});
			},
			surActualiser(aGenreWidget) {
				$(this.node).eventValidation(() => {
					lThis.surActualiser(aGenreWidget);
				});
			},
		};
		ObjetHtml_1.GHtml.setHtml(
			aWidget.id + UtilitaireWidget_1.UtilitaireWidget.suffixIdWidget,
			UtilitaireWidget_1.UtilitaireWidget.composeWidget(aWidget),
			{ instance: lInstanceWidget || this },
		);
		UtilitaireWidget_1.UtilitaireWidget.actualiserFooter(aWidget);
		UtilitaireWidget_1.UtilitaireWidget.afficherMasquerListe(aWidget);
		this._surVisibiliteWidget(aWidget);
	}
	surToutVoir(aGenreWidget) {
		const lWidget = this.getWidget(aGenreWidget);
		if (lWidget && lWidget.semaineSelectionnee) {
			this.etatUtilisateurSco.setSemaineSelectionnee(
				lWidget.semaineSelectionnee,
			);
		} else if (lWidget && lWidget.jourSelectionne) {
			this.etatUtilisateurSco.setNavigationDate(lWidget.jourSelectionne);
		}
		if (lWidget && lWidget.coursSelectionne) {
			this.etatUtilisateurSco.setNavigationCours(lWidget.coursSelectionne);
		}
		if (lWidget && lWidget.listeClasseSelectionnees) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
				lWidget.listeClasseSelectionnees,
			);
		}
		if (lWidget && lWidget.avecGenresRessourcePedagogiqueSelectionnes) {
			this.etatUtilisateurSco.Navigation.avecGenresRessourcePedagogique =
				lWidget.avecGenresRessourcePedagogiqueSelectionnes;
		}
		this.surEvenementWidget(
			aGenreWidget,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
			lWidget.getPage ? lWidget.getPage() : lWidget.page,
		);
	}
	surLienExterne(aGenreWidget) {
		const lWidget = this.getWidget(aGenreWidget);
		const lInfos = lWidget.infosURLExterne();
		if (lInfos !== undefined) {
			lInfos.callbackLien();
		}
	}
	surEvenementWidget(aGenreWidgetSource, aGenreEvenement, aDonnees, aListePJs) {
		switch (aGenreEvenement) {
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage:
				if (aDonnees.message) {
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: aDonnees.message,
					});
				} else {
					this.etatUtilisateurSco.setPage(aDonnees);
					this.etatUtilisateurSco.Navigation.OptionsOnglet = aDonnees;
					if (GEtatUtilisateur.getGenreOnglet()) {
						switch (aDonnees.Onglet) {
							case Enumere_Onglet_1.EGenreOnglet.CDT_TAF: {
								this.etatUtilisateurSco.setModeAffichageTimeLine(
									Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline
										.classique,
								);
								const lDate = new Date();
								lDate.setDate(lDate.getDate() - 30);
								this.etatUtilisateurSco.setDateDebutTimeLineCDT(lDate);
								if (aDonnees.taf) {
									this.etatUtilisateurSco.setNavigationDate(
										aDonnees.taf.pourLe,
									);
								}
								break;
							}
							case Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps: {
								const lWidget = this.getWidget(aGenreWidgetSource);
								if (
									MethodesObjet_1.MethodesObjet.isNumeric(lWidget.numeroSemaine)
								) {
									this.etatUtilisateurSco.setSemaineSelectionnee(
										lWidget.numeroSemaine,
									);
								}
								break;
							}
							case Enumere_Onglet_1.EGenreOnglet.RemplacementsEnseignants: {
								if (
									aGenreWidgetSource ===
									Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants
								) {
									this.etatUtilisateurSco.setContexteRemplacementsEnseignant({
										genreAffichage:
											TypeAffichageRemplacements_1.TypeAffichageRemplacements
												.tarPropositions,
									});
								}
								break;
							}
							default:
								break;
						}
						this.interfaceEspace.changementManuelOnglet(
							GEtatUtilisateur.getGenreOnglet(),
						);
					}
				}
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.SaisieWidget: {
				if (MultipleObjetRequeteSaisieAccueil) {
					const lRequete =
						new MultipleObjetRequeteSaisieAccueil.ObjetRequeteSaisieAccueil(
							this,
							this.actionSurRequeteSaisie,
						);
					if (aListePJs && aListePJs.count()) {
						lRequete.addUpload({ listeFichiers: aListePJs });
					}
					lRequete.lancerRequete(aDonnees);
				}
				break;
			}
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM:
				this.afficherExecutionQCM(aDonnees);
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget: {
				let lTabGenresWidgetsAActualiser = [aGenreWidgetSource];
				if (aDonnees && aDonnees.genresWidgetsSupplemetaires) {
					lTabGenresWidgetsAActualiser = lTabGenresWidgetsAActualiser.concat(
						aDonnees.genresWidgetsSupplemetaires,
					);
				}
				this.recupererDonnees(lTabGenresWidgetsAActualiser);
				break;
			}
			case Enumere_EvenementWidget_1.EGenreEvenementWidget
				.EvenementPersonnalise:
				switch (aGenreWidgetSource) {
					case Enumere_Widget_1.EGenreWidget.EDT:
					case Enumere_Widget_1.EGenreWidget.DS:
					case Enumere_Widget_1.EGenreWidget.DSEvaluation:
						new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
							this,
							this._actionSurRequeteFicheCDT.bind(this),
						).lancerRequete(aDonnees);
						break;
				}
				break;
		}
	}
	surFermer(aGenreWidget) {
		if (!this.etatUtilisateurSco.widgets[aGenreWidget]) {
			this.etatUtilisateurSco.widgets[aGenreWidget] = {};
		}
		this.etatUtilisateurSco.widgets[aGenreWidget].visible = false;
		this.applicationEspace.parametresUtilisateur.set(
			"widgets",
			this.etatUtilisateurSco.widgets,
		);
		this.recupererDonnees();
	}
	_surVisibiliteWidget(aWidget) {
		ObjetStyle_1.GStyle.setDisplay(
			aWidget.id + UtilitaireWidget_1.UtilitaireWidget.suffixIdWidget,
			!!this.etatUtilisateurSco.widgets[aWidget.genre] &&
				!!this.etatUtilisateurSco.widgets[aWidget.genre].visible
				? this.etatUtilisateurSco.widgets[aWidget.genre].visible
				: false,
		);
	}
	actualiserVisibiliteColonnes() {
		for (const aGenreColonne in this.genreColonne) {
			const lColonne = this.genreColonne[aGenreColonne];
			lColonne.visible =
				lColonne.liste.filter((aGenreWidget) => {
					if (aGenreWidget !== null) {
						return (
							this.etatUtilisateurSco.widgets[aGenreWidget] &&
							this.etatUtilisateurSco.widgets[aGenreWidget].visible
						);
					}
				}).length > 0;
			lColonne.actif =
				lColonne.liste.filter((aGenreWidget) => {
					if (aGenreWidget !== null) {
						return (
							this.etatUtilisateurSco.widgets[aGenreWidget] &&
							this.etatUtilisateurSco.widgets[aGenreWidget].actif
						);
					}
				}).length > 0;
			const lGlobalContainer = $(".widgets-global-container");
			lColonne.visible
				? ""
				: !lColonne.actif
					? lGlobalContainer.addClass("no-" + aGenreColonne.toLowerCase())
					: "";
		}
		clearTimeout(this._timeoutActualiserScroll);
		this._timeoutActualiserScroll = setTimeout(
			this.actualiserScroll.bind(this),
			50,
		);
	}
	surActualiser(aGenreWidget) {
		this.surEvenementWidget(
			aGenreWidget,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
		);
	}
	actualiserScroll() {
		this._forEachWidget((aWidget) => {
			if (aWidget.resize) {
				aWidget.resize();
			}
		});
	}
	actionSurRequeteSaisie() {
		this.recupererDonnees();
	}
	surPostResize() {
		if (this._positionScrollY > 0) {
			ObjetHtml_1.GHtml.getElement(this.Nom).scrollTop = this._positionScrollY;
			delete this._positionScrollY;
		}
	}
	surResizeInterface() {
		super.surResizeInterface();
		if (
			ObjetNavigateur_1.Navigateur.isMacOs &&
			ObjetNavigateur_1.Navigateur.isSafari
		) {
			let i;
			for (i in this.genreColonne) {
				if (
					this.genreColonne[i].actif &&
					$(
						"#" + (this.idColonne + this.genreColonne[i].genre).escapeJQ(),
					).children("div").length === 1
				) {
					$("#" + (this.idColonne + this.genreColonne[i].genre).escapeJQ())
						.children("div")
						.height(function () {
							return $(this).parent().height() - 5;
						});
				}
			}
		}
		this.actualiserVisibiliteColonnes();
	}
	_actionSurRequeteFicheCDT(aGenreAffichageCDT, aCahierDeTextes, aCtx) {
		UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
			this,
			{
				cahiersDeTextes: aCahierDeTextes,
				genreAffichage: aGenreAffichageCDT,
				gestionnaire: GestionnaireBlocCDT_2.GestionnaireBlocCDT,
			},
			{ evenementSurBlocCDT: this.evenementSurBlocCDTAccueil.bind(this, aCtx) },
		);
	}
	evenementSurBlocCDTAccueil(aCtx, aObjet, aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM: {
				const lExecQCM =
					aParam && !!aParam.estQCM ? aElement : aElement.executionQCM;
				this.afficherExecutionQCM(lExecQCM);
				break;
			}
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{
						pere: this,
						evenement: this._evenementFenetreTAFARendreEDT.bind(this, aCtx),
					},
					aElement,
				);
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirContenu:
				new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
					this,
					this._actionApresRequeteDonneesContenusCDT,
				).lancerRequete({ cahierDeTextes: aElement.cahierDeTextes });
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.documentRendu:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.supprimer:
				this.recupererDonnees([this.donnees.travailAFaire.genre], true);
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					this._actionSurRequeteFicheCDT.bind(this),
				).lancerRequete({
					pourTAF: true,
					matiere: aElement.Matiere,
					date: aElement.PourLe,
				});
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.tafFait:
				this.recupererDonnees([this.donnees.travailAFaire.genre], true);
				break;
			default:
				break;
		}
	}
	_evenementFenetreTAFARendreEDT(aCtxBind, aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_2.TypeBoutonFenetreTAFFaits.Fermer
		) {
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._actionSurRequeteFicheCDT.bind(this),
			).lancerRequete(aCtxBind);
		}
	}
	afficherExecutionQCM(aExecutionQCM) {
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.identFenetreVisuQCM),
			aExecutionQCM,
		);
	}
	_construireInstanceWidget(aDonneesWidget) {
		if (this.instancesWidgets[aDonneesWidget.genre]) {
			this.instancesWidgets[aDonneesWidget.genre].free();
		}
		try {
			this.instancesWidgets[aDonneesWidget.genre] =
				ObjetIdentite_1.Identite.creerInstance(aDonneesWidget.classWidget, {
					pere: this,
					evenement: this.surEvenementWidget,
				});
		} catch (e) {
			this.instancesWidgets[aDonneesWidget.genre] = null;
			console.error(e);
			return "";
		}
		Object.assign(this.instancesWidgets[aDonneesWidget.genre], {
			donneesRequete: this.donneesRequete,
			numeroSemaineParDefaut: this.numeroSemaineParDefaut,
		});
		try {
			this.instancesWidgets[aDonneesWidget.genre].construire({
				instance: this,
				donnees: aDonneesWidget,
				construireWidget: this.construireWidget.bind(this),
			});
		} catch (e) {
			console.error(e);
		}
		return "";
	}
	_forEachWidget(aFunc) {
		Object.keys(this.donnees).forEach((aKey) => {
			const lWidget = this.donnees[aKey];
			if (lWidget) {
				aFunc.call(this, lWidget);
			}
		});
	}
	_actionApresRequeteDonneesContenusCDT(aJSON) {
		const lDonnee =
			aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
				? aJSON.ListeCahierDeTextes.getPremierElement()
				: null;
		if (lDonnee) {
			new ObjetDeserialiser_1.ObjetDeserialiser().deserialiserCahierDeTexte(
				lDonnee,
			);
			this._afficheFenetreDetail(lDonnee);
		} else {
		}
	}
	_afficheFenetreDetail(aDonnee, aParams) {
		let lGestionnaireBloc;
		let lCoordonnees;
		if (this.fenetreContenu) {
			lCoordonnees = this.fenetreContenu.coordonnees;
			this.fenetreContenu.fermer();
		}
		const lParams = { fenetre: true };
		if (aParams) {
			$.extend(lParams, aParams);
		}
		lGestionnaireBloc = ObjetIdentite_1.Identite.creerInstance(
			GestionnaireBlocCDC_1.GestionnaireBlocCDC,
			{
				pere: this,
				evenement: function (aParams, aGenreEvnt) {
					switch (aGenreEvnt) {
						case GestionnaireBlocCDC_2.EGenreBtnActionBlocCDC.executionQCM: {
							const lExecQCM = aParams;
							this.afficherExecutionQCM(lExecQCM);
							break;
						}
					}
				},
			},
		);
		lGestionnaireBloc.setOptions({
			avecPastille: false,
			modeAffichage:
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique,
			avecZoneAction: false,
			avecBordure: false,
			avecOmbre: false,
			formatDate: "%JJJ %JJ %MMM",
			initPlie: false,
			cacherBoutonTAF: true,
			callBackTitre: undefined,
		});
		const lObjDonnees = {
			gestionnaireBloc: lGestionnaireBloc,
			element: aDonnee,
			coordonnees: null,
		};
		if (
			lCoordonnees &&
			lCoordonnees.left !== null &&
			lCoordonnees.top !== null
		) {
			lObjDonnees.coordonnees = lCoordonnees;
		}
		this.fenetreContenu = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Bloc_1.ObjetFenetre_Bloc,
			{ pere: this, initialiser: false },
		);
		this.fenetreContenu.setOptionsFenetre({ modale: false });
		this.fenetreContenu.initialiser();
		this.fenetreContenu.setDonnees(lObjDonnees);
	}
	_getLigne2AbsenceAccessible(aAbsence) {
		let lResult = "";
		switch (aAbsence.Genre) {
			case Enumere_Ressource_1.EGenreRessource.ObservationProfesseurEleve:
				lResult += this.utilitaireAbsence.getDemandeurDecideur(aAbsence);
				break;
			case Enumere_Ressource_1.EGenreRessource.Absence:
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lResult += this.utilitaireAbsence.getMotifAbsence({
					donnee: aAbsence,
					enListe: false,
				});
				break;
			case Enumere_Ressource_1.EGenreRessource.AbsenceRepas:
			case Enumere_Ressource_1.EGenreRessource.AbsenceInternat:
				lResult +=
					aAbsence.Motif && aAbsence.Motif.existeNumero()
						? aAbsence.Motif.getLibelle()
						: "";
				break;
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				break;
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
			case Enumere_Ressource_1.EGenreRessource.Punition:
			case Enumere_Ressource_1.EGenreRessource.Sanction:
				lResult +=
					this.utilitaireAbsence.getModalitesPunitionSanction(aAbsence);
				break;
			default:
				break;
		}
		return lResult.ucfirst();
	}
	_changerColWrapper() {
		const lWindowWidth = ObjetNavigateur_1.Navigateur.clientL;
		const lColsWarp1 = $(".cols-wrap1");
		const lColsWarp2 = $(".cols-wrap2");
		if (!this.applicationEspace.estEDT) {
			if (lWindowWidth > 1182 && lWindowWidth < 1560) {
				lColsWarp1.length
					? lColsWarp1
							.find('[data-name="cols-widgets-conteneur"]')
							.unwrap()
							.end()
							.remove()
					: "";
				lColsWarp2.length
					? lColsWarp2
							.find('[data-name="cols-widgets-conteneur"]')
							.unwrap()
							.end()
							.remove()
					: "";
				$(".wrapper-cols.emploidutemps, .wrapper-cols.cdt")
					.wrapAll("<div/>")
					.unwrap()
					.end()
					.remove();
				$(".wrapper-cols.notes, .wrapper-cols.cdt").wrapAll(
					'<div class="cols-wrap1" />',
				);
			} else if (lWindowWidth <= 1182 && lWindowWidth > 750) {
				lColsWarp1.length
					? lColsWarp1
							.find('[data-name="cols-widgets-conteneur"]')
							.unwrap()
							.end()
							.remove()
					: "";
				if (
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur
				) {
					!lColsWarp2.length
						? $(
								".wrapper-cols.cdt, .wrapper-cols.absencesprof, .wrapper-cols.agendaetinformations",
							).wrapAll('<div class="cols-wrap2" />')
						: "";
				} else {
					!lColsWarp2.length
						? $(
								".wrapper-cols.cdt, .wrapper-cols.agendaetinformations",
							).wrapAll('<div class="cols-wrap2" />')
						: "";
					$(".wrapper-cols.emploidutemps, .wrapper-cols.notes").wrapAll(
						'<div class="cols-wrap1" />',
					);
				}
			} else {
				lColsWarp1.length
					? lColsWarp1
							.find('[data-name="cols-widgets-conteneur"]')
							.unwrap()
							.end()
							.remove()
					: "";
				lColsWarp2.length
					? lColsWarp2
							.find('[data-name="cols-widgets-conteneur"]')
							.unwrap()
							.end()
							.remove()
					: "";
				$(".wrapper-cols.emploidutemps, .wrapper-cols.cdt")
					.wrapAll("<div/>")
					.unwrap()
					.end()
					.remove();
			}
		}
	}
}
exports.InterfacePageAccueil = InterfacePageAccueil;
function _initialiserFenetreParametresWidgets(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		titre: ObjetTraduction_1.GTraductions.getValeur(
			"accueil.titreSelecWidgets",
		),
		largeur: 430,
		hauteur: 550,
		listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
	});
}
