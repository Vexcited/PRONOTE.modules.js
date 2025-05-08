exports.InterfacePageAccueil = void 0;
const ObjetRequetePageAccueil_1 = require("ObjetRequetePageAccueil");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetIdentite_1 = require("ObjetIdentite");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetListeArborescente_1 = require("ObjetListeArborescente");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_PossessionRessource_1 = require("Enumere_PossessionRessource");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const InterfacePage_1 = require("InterfacePage");
const ObjetFenetre_ParametresWidgets_1 = require("ObjetFenetre_ParametresWidgets");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
const Enumere_Widget_1 = require("Enumere_Widget");
const UtilitaireQCM_1 = require("UtilitaireQCM");
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
const UtilitaireListeCoursAccessible_1 = require("UtilitaireListeCoursAccessible");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const ObjetMoteurAccueilPN_1 = require("ObjetMoteurAccueilPN");
const TypeEtatPublication_1 = require("TypeEtatPublication");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const TypeDemiJournee_1 = require("TypeDemiJournee");
const CommunicationProduit_1 = require("CommunicationProduit");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const WidgetMenu_1 = require("WidgetMenu");
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
const MultipleObjetRequeteSaisieAccueil = require("ObjetRequeteSaisieAccueil");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
CollectionRequetes_1.Requetes.inscrire(
	"donneesContenusCDT",
	ObjetRequeteJSON_1.ObjetRequeteConsultation,
);
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
		this.listeFiches = [];
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
		this.listeFiches = [];
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
				if (GNavigateur.isTactile) {
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
				getIcone() {
					return '<i class="icon_cog"></i>';
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
				Enumere_Widget_1.EGenreWidget.Intendance_Execute,
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
				Enumere_Widget_1.EGenreWidget.tachesSecretariat_Execute,
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
				Enumere_Widget_1.EGenreWidget.blog_filActu,
			),
			commandeExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.commande_Execute,
			),
			modificationsEDT: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.modificationEDT,
			),
			remplacementsenseignants: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants,
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
				Enumere_Widget_1.EGenreWidget.Intendance_Execute,
			),
			maintenanceInfoExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
			),
			commandeExecute: this.moteur.getDeclarationWidget(
				Enumere_Widget_1.EGenreWidget.commande_Execute,
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
				Enumere_Widget_1.EGenreWidget.blog_filActu,
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
			case Enumere_Widget_1.EGenreWidget.Intendance_Execute:
				return this.donnees.intendanceExecute;
			case Enumere_Widget_1.EGenreWidget.tachesSecretariat_Execute:
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
			case Enumere_Widget_1.EGenreWidget.enseignementADistance:
				return this.donnees.enseignementADistance;
			case Enumere_Widget_1.EGenreWidget.blog_filActu:
				return this.donnees.blogFilActu;
			case Enumere_Widget_1.EGenreWidget.TAFEtActivites:
				return this.donnees.TAFEtActivites;
			case Enumere_Widget_1.EGenreWidget.commande_Execute:
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
				" div.objetBandeauEntete_fullsize .precedenteConnexion",
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
							lLignes[j].themeCategorie,
							" ",
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
	addFiche(aFiche) {
		this.listeFiches.push(aFiche);
	}
	fermerFiches() {
		for (let i = 0; i < this.listeFiches.length; i++) {
			if (this.listeFiches[i]) {
				this.listeFiches[i].fermer();
			}
		}
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
	avecLienKiosque(aKiosque) {
		let lRessource;
		if (aKiosque && aKiosque.listeRessources) {
			for (let i = 0; i < aKiosque.listeRessources.count(); i++) {
				lRessource = aKiosque.listeRessources.get(i);
				if (lRessource.avecLien) {
					return true;
				}
			}
		}
		return false;
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
				this.donnees.planning.listeRessourcesPlanning = [];
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
			if (
				this.donneesRequete.widgets.includes(
					Enumere_Widget_1.EGenreWidget.kiosque,
				)
			) {
				this.applicationEspace
					.getCommunication()
					.setDureeTimerPresence(
						CommunicationProduit_1.CommunicationProduit.cDureeTimerPresence,
					);
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
		if (this.etatUtilisateurSco.estModeAccessible()) {
			this.afficherListeAccessible();
		} else {
			this.actualiserAffichage();
			this.surResizeInterface();
		}
	}
	actualiserAffichage() {
		if (!this.DonneesRecues) {
			return;
		}
		this.actualiserColonnes();
		for (let i in this.donnees) {
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
					" > div:first .selected",
			)
				.removeClass("objetmenuprincipal_elementavecclic")
				.append('<div id="dummyNode"></div>')
				.find("#dummyNode")
				.ieHtml(
					'<ie-btnselecteur id="' +
						this.idBoutonParametres +
						'" ie-model="evtSurBtnParametresWidgets()" aria-label="' +
						ObjetTraduction_1.GTraductions.getValeur(
							"Accueil.ParametresWidgets",
						) +
						'" title="' +
						ObjetTraduction_1.GTraductions.getValeur(
							"Accueil.ParametresWidgets",
						) +
						'" class="choix-widgets"></ie-btnselecteur>',
					{ controleur: this.controleur },
				)
				.children()
				.unwrap("#dummyNode");
			$("#" + this.applicationEspace.idBreadcrumb).attr(
				"aria-owns",
				this.idBoutonParametres,
			);
		} else {
			$(
				"#" +
					this.interfaceEspace
						.getInstance(this.interfaceEspace.IdentBandeauEntete)
						.idSecondMenu.escapeJQ() +
					" > div:first .selected",
			).removeClass("objetmenuprincipal_elementavecclic");
		}
		if (this.etatUtilisateurSco.derniereConnexion) {
			const lIdMenu =
				"#" +
				this.interfaceEspace
					.getInstance(this.interfaceEspace.IdentBandeauEntete)
					.idSecondMenu.escapeJQ() +
				" div.objetBandeauEntete_fullsize";
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
						const lObjetWidget = new ObjetElement_1.ObjetElement();
						lObjetWidget.widget = this.getWidget(aGenreWidget);
						lObjetWidget.positionColonne = lColonne.position;
						lObjetWidget.position = aIndice;
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
		for (const i in this.genreColonne) {
			const lColonne = this.genreColonne[i];
			lColonne.visible =
				lColonne.liste.filter((aGenreWidget) => {
					if (aGenreWidget !== null) {
						return (
							this.etatUtilisateurSco.widgets[aGenreWidget] &&
							this.etatUtilisateurSco.widgets[aGenreWidget].visible
						);
					}
				}).length > 0;
			const lColVisibility = $(
				"#" + (this.idColonne + lColonne.genre).escapeJQ(),
			);
			const lGlobalContainer = lColVisibility.parent(
				".widgets-global-container",
			);
			lColonne.visible
				? ""
				: lGlobalContainer.addClass("no-" + lColVisibility.attr("class"));
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
		if (this.etatUtilisateurSco.estModeAccessible()) {
			this.afficherListeAccessible();
		}
		if (GNavigateur.isMacOs && GNavigateur.isSafari) {
			for (const i in this.genreColonne) {
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
			{ evenementSurBlocCDT: this.evenementSurBlocCDT.bind(this, aCtx) },
		);
	}
	evenementSurBlocCDT(aCtx, aObjet, aElement, aGenreEvnt, aParam) {
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
				(0, CollectionRequetes_1.Requetes)(
					"donneesContenusCDT",
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
	afficherListeAccessible() {
		if (!this.DonneesRecues) {
			return;
		}
		let lGenre, i, j, I, J, lDS, lMatiere, lRessource, lNoeudMatiere;
		this.utilitaireAbsence =
			new ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence();
		const lIdListe = this.Nom + "_Liste";
		this._objetListeArborescente =
			new ObjetListeArborescente_1.ObjetListeArborescente(
				lIdListe,
				0,
				this,
				null,
			);
		const lRacine = this._objetListeArborescente.construireRacine();
		this._objetListeArborescente.setParametres(false);
		let lPremierElement = true;
		let lTitre = "";
		I = 0;
		let lElement;
		let lNoeudListeElements;
		let lNoeudElement,
			lDate,
			lCours,
			lClasse,
			lAppelNonFait,
			H,
			lDateFormatee,
			lCoursNonAssure,
			lPersonnelsAbsents,
			lNbr,
			lNbr2,
			lElt,
			lNoeudElt,
			lDatas,
			lValeur;
		if (
			!!this.donnees.EDT &&
			!!this.donnees.EDT.existeWidget &&
			this.donnees.EDT.existeWidget.call(this)
		) {
			lTitre =
				ObjetTraduction_1.GTraductions.getValeur("EDT.Cours") +
				" " +
				ObjetTraduction_1.GTraductions.getValeur("Du") +
				" ";
			UtilitaireListeCoursAccessible_1.UtilitaireListeCoursAccessible.remplir({
				listeArborescente: this._objetListeArborescente,
				nodeParent: lRacine,
				listeCours: this.donnees.EDT.listeCours,
				avecCoursAnnule: this.etatUtilisateurSco.getAvecCoursAnnule(),
				avecCoursAnnulesSuperposes: !GEtatUtilisateur.estEspacePourEleve(),
				jourDeploye: true,
				getTitreJour: function (aJour) {
					return (
						lTitre + ObjetDate_1.GDate.formatDate(aJour, "%JJJJ %JJ %MMMM")
					);
				},
			});
		}
		if (
			!!this.donnees.devoirSurveille &&
			!!this.donnees.devoirSurveille.existeWidget &&
			this.donnees.devoirSurveille.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.DS.titre");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDS",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			for (i = 0; i < this.donnees.devoirSurveille.listeDS.count(); i++) {
				lDS = this.donnees.devoirSurveille.listeDS.get(i);
				if (lDS.getGenre() === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir) {
					lTitre =
						ObjetDate_1.GDate.formatDate(
							lDS.dateDebut,
							"[" +
								ObjetTraduction_1.GTraductions.getValeur("Le") +
								" " +
								"%JJJJ %J %MMM" +
								"]" +
								" " +
								ObjetTraduction_1.GTraductions.getValeur("De") +
								" " +
								"%hh%sh%mm",
						) +
						ObjetDate_1.GDate.formatDate(
							lDS.dateFin,
							" " +
								ObjetTraduction_1.GTraductions.getValeur("A") +
								" " +
								"%hh%sh%mm",
						);
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudElement,
						"",
						lDS.matiere.getLibelle(),
					);
				}
			}
		}
		if (
			!!this.donnees.devoirSurveilleEvaluation &&
			!!this.donnees.devoirSurveilleEvaluation.existeWidget &&
			this.donnees.devoirSurveilleEvaluation.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.DSEvaluation.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeEva",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			for (i = 0; i < this.donnees.devoirSurveille.listeDS.count(); i++) {
				lDS = this.donnees.devoirSurveille.listeDS.get(i);
				if (lDS.getGenre() === Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation) {
					lTitre =
						ObjetDate_1.GDate.formatDate(
							lDS.dateDebut,
							"[" +
								ObjetTraduction_1.GTraductions.getValeur("Le") +
								" " +
								"%JJJJ %J %MMM" +
								"]" +
								" " +
								ObjetTraduction_1.GTraductions.getValeur("De") +
								" " +
								"%hh%sh%mm",
						) +
						ObjetDate_1.GDate.formatDate(
							lDS.dateFin,
							" " +
								ObjetTraduction_1.GTraductions.getValeur("A") +
								" " +
								"%hh%sh%mm",
						);
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudElement,
						"",
						lDS.matiere.getLibelle(),
					);
				}
			}
		}
		if (
			!!this.donnees.travailAFaire &&
			!!this.donnees.travailAFaire.existeWidget &&
			this.donnees.travailAFaire.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.travailAFaire.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeTAF",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.travailAFaire.listeTAF.count() > 0) {
				let lTaf;
				const T = [];
				for (let I = 0; I < this.donnees.travailAFaire.listeTAF.count(); I++) {
					lTaf = this.donnees.travailAFaire.listeTAF.get(I);
					lTaf.indice = I;
					if (!T[lTaf.pourLe]) {
						T[lTaf.pourLe] = [];
					}
					T[lTaf.pourLe].push(lTaf);
				}
				for (lDate in T) {
					lMatiere = null;
					const lDateLibelle = new Date(lDate);
					lTitre =
						(ObjetDate_1.GDate.estDateParticulier(lDateLibelle)
							? ObjetTraduction_1.GTraductions.getValeur(
									"accueil.pour",
								).ucfirst()
							: ObjetTraduction_1.GTraductions.getValeur(
									"accueil.pourle",
								).ucfirst()) +
						" " +
						ObjetDate_1.GDate.formatDate(
							lDateLibelle,
							"[" + "%JJJJ %J %MMM" + "]",
						);
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					for (J in T[lDate]) {
						lTaf = T[lDate][J];
						if (
							!lMatiere ||
							lMatiere.getNumero() !== lTaf.matiere.getNumero()
						) {
							lTitre = lTaf.matiere.getLibelle();
							lNoeudMatiere =
								this._objetListeArborescente.ajouterUnNoeudAuNoeud(
									lNoeudElement,
									"",
									lTitre,
								);
						}
						if (lNoeudMatiere) {
							this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
								lNoeudMatiere,
								"",
								lTaf.descriptif,
							);
							if (
								lTaf.listeDocumentJoint &&
								lTaf.listeDocumentJoint.count() > 0
							) {
								for (I = 0; I < lTaf.listeDocumentJoint.count(); I++) {
									const lPieceJointe = lTaf.listeDocumentJoint.get(I);
									lTitre = ObjetChaine_1.GChaine.composerUrlLienExterne({
										documentJoint: lPieceJointe,
										libelleEcran: lPieceJointe.getLibelle(),
									});
									this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
										lNoeudMatiere,
										"",
										lTitre,
									);
								}
							}
						}
						lMatiere = lTaf.matiere;
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.aucunTAF"),
				);
			}
		}
		if (
			!!this.donnees.ressourcePedagogique &&
			!!this.donnees.ressourcePedagogique.existeWidget &&
			this.donnees.ressourcePedagogique.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.ressourcePedagogique.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeResPeda",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.ressourcePedagogique.listeRessources.count() > 0) {
				for (
					i = 0;
					i < this.donnees.ressourcePedagogique.listeRessources.count();
					i++
				) {
					lRessource = this.donnees.ressourcePedagogique.listeRessources.get(i);
					lMatiere =
						this.donnees.ressourcePedagogique.listeMatieres.getElementParNumero(
							lRessource.matiere.getNumero(),
						);
					if (lMatiere && (!lMatiere.date || lRessource.date > lMatiere.date)) {
						lMatiere.date = lRessource.date;
					}
				}
				this.donnees.ressourcePedagogique.listeMatieres.setTri([
					ObjetTri_1.ObjetTri.init(
						"date",
						Enumere_TriElement_1.EGenreTriElement.Decroissant,
					),
				]);
				this.donnees.ressourcePedagogique.listeMatieres.trier();
				this.donnees.ressourcePedagogique.listeRessources.setTri([
					ObjetTri_1.ObjetTri.init(
						"date",
						Enumere_TriElement_1.EGenreTriElement.Decroissant,
					),
				]);
				this.donnees.ressourcePedagogique.listeRessources.trier();
				for (
					i = 0;
					i < this.donnees.ressourcePedagogique.listeRessources.count();
					i++
				) {
					lRessource = this.donnees.ressourcePedagogique.listeRessources.get(i);
					lMatiere =
						this.donnees.ressourcePedagogique.listeMatieres.getElementParNumero(
							lRessource.matiere.getNumero(),
						);
					lGenre = lRessource.getGenre();
					if (
						lGenre ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM &&
						UtilitaireQCM_1.UtilitaireQCM.estCorrige(lRessource.ressource)
					) {
						lGenre =
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.corrige;
					}
					lTitre =
						(lMatiere ? lMatiere.getLibelle() + " - " : "") +
						Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.getLibelleDeGenreEtNombre(
							lGenre,
						);
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					switch (lRessource.getGenre()) {
						case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
							.kiosque:
							lTitre = lRessource.ressource.getLibelle();
							break;
						case Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM:
							lTitre =
								lRessource.ressource.QCM.getLibelle() +
								"&nbsp;" +
								ObjetChaine_1.GChaine.format(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.ressourcePedagogique.deposeLe",
									),
									[ObjetDate_1.GDate.formatDate(lRessource.date, "%JJ/%MM")],
								);
							break;
						default:
							lTitre =
								Enumere_RessourcePedagogique_1.EGenreRessourcePedagogiqueUtil.composerURL(
									lRessource.getGenre(),
									lRessource.ressource,
								) +
								"&nbsp;" +
								ObjetChaine_1.GChaine.format(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.ressourcePedagogique.deposeLe",
									),
									[ObjetDate_1.GDate.formatDate(lRessource.date, "%JJ/%MM")],
								);
							break;
					}
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudElement,
						"",
						lTitre,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ressourcePedagogique.aucuneRessourcePedagogique",
					),
				);
			}
		}
		if (
			!!this.donnees.vieScolaire &&
			!!this.donnees.vieScolaire.existeWidget &&
			this.donnees.vieScolaire.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.vieScolaire");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeVieScolaire",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.vieScolaire.listeAbsences.count() > 0) {
				for (I = 0; I < this.donnees.vieScolaire.listeAbsences.count(); I++) {
					lElement = this.donnees.vieScolaire.listeAbsences.get(I);
					lTitre =
						this.utilitaireAbsence
							.getChaineTraductionGenreAbsence({
								genre: lElement.getGenre(),
								singulier: true,
								estUneCreationParent:
									lElement.estUneCreationParent || !!lElement.auteur,
								justifie: lElement.justifie,
							})
							.ucfirst() +
						" " +
						this.utilitaireAbsence.getDate(lElement, true);
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					lTitre = this._getLigne2AbsenceAccessible(lElement);
					if (lTitre) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
					lTitre = this.utilitaireAbsence.getInfoAbsenceAccessible(lElement);
					if (lTitre) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.aucuneAbsence"),
				);
			}
		}
		let lEstBaremeParDefaut;
		if (
			!!this.donnees.notes &&
			!!this.donnees.notes.existeWidget &&
			this.donnees.notes.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.dernieresNotes",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDevoirs",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.notes.listeDevoirs.count() > 0) {
				for (I = 0; I < this.donnees.notes.listeDevoirs.count(); I++) {
					lElement = this.donnees.notes.listeDevoirs.get(I);
					lEstBaremeParDefaut =
						lElement.bareme.getValeur() ===
						lElement.baremeParDefaut.getValeur();
					lTitre =
						lElement.service.getLibelle() +
						" : " +
						lElement.note.getNote() +
						(lEstBaremeParDefaut || !lElement.note.estUneValeur()
							? ""
							: lElement.bareme.getBaremeEntier());
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudElement,
						"",
						ObjetDate_1.GDate.formatDate(
							lElement.date,
							"[" +
								ObjetTraduction_1.GTraductions.getValeur("Le") +
								" %J %MMMM" +
								"]",
						),
					);
					if (lElement.moyenne) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil." +
									(lElement.estEnGroupe ? "moyenneGroupe" : "moyenneClasse"),
							) +
								"&nbsp;:&nbsp;" +
								lElement.moyenne.getNote() +
								(lEstBaremeParDefaut() || !lElement.moyenne.estUneValeur()
									? ""
									: lElement.bareme.getBaremeEntier()),
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.aucuneNote"),
				);
			}
		}
		if (
			!!this.donnees.agenda &&
			!!this.donnees.agenda.existeWidget &&
			this.donnees.agenda.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.agenda.titre");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeAgenda",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.agenda.listeEvenements.count() > 0) {
				for (I = 0; I < this.donnees.agenda.listeEvenements.count(); I++) {
					lElement = this.donnees.agenda.listeEvenements.get(I);
					lTitre = lElement.getLibelle();
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					if (lElement.listeEleves && lElement.listeEleves.length > 0) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lElement.listeEleves.join(", "),
						);
					}
					lTitre = this.donnees.agenda.listeEvenements
						._getLibelleEvenement({ evenement: lElement })
						.join("<br>");
					if (lTitre) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
					lTitre =
						lElement.listeDocJoints && lElement.listeDocJoints.count() > 0
							? _composeDocumentsAccessible.call(this, lElement.listeDocJoints)
							: "";
					if (lTitre) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.aucuneAgenda"),
				);
			}
		}
		if (
			!!this.donnees.actualites &&
			!!this.donnees.actualites.existeWidget &&
			this.donnees.actualites.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.actualites");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeActualites",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (
				this.donnees.actualites.listeModesAff[
					TypeEtatPublication_1.TypeModeAff.MA_Reception
				].listeActualites.count() > 0
			) {
				for (
					I = 0;
					I <
					this.donnees.actualites.listeModesAff[
						TypeEtatPublication_1.TypeModeAff.MA_Reception
					].listeActualites.count();
					I++
				) {
					lElement =
						this.donnees.actualites.listeModesAff[
							TypeEtatPublication_1.TypeModeAff.MA_Reception
						].listeActualites.get(I);
					lTitre =
						lElement.categorie && lElement.categorie.existeNumero()
							? lElement.categorie.getLibelle().toUpperCase() + " "
							: "";
					lTitre += lElement.getLibelle();
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					lTitre = _composeDetailActualiteAccessible.call(this, lElement);
					if (lTitre) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.aucuneActualite"),
				);
			}
		}
		if (
			!!this.donnees.elections &&
			!!this.donnees.elections.existeWidget &&
			this.donnees.elections.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.elections.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeElections",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.elections.listeElections.count() > 0) {
				for (I = 0; I < this.donnees.elections.listeElections.count(); I++) {
					lElement = this.donnees.elections.listeElections.get(I);
					lTitre = lElement.getLibelle().toUpperCase();
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
				}
			}
		}
		if (
			!!this.donnees.discussions &&
			!!this.donnees.discussions.existeWidget &&
			this.donnees.discussions.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.discussions.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDiscussions",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.discussions.listeMessagerie.count() > 0) {
				for (I = 0; I < this.donnees.discussions.listeMessagerie.count(); I++) {
					lElement = this.donnees.discussions.listeMessagerie.get(I);
					lTitre =
						UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleDiscussionAccessible(
							lElement,
						);
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					lTitre =
						UtilitaireMessagerie_1.UtilitaireMessagerie.getDetailDiscussionAccessible(
							lElement,
						);
					if (lTitre) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.aucuneActualite"),
				);
			}
		}
		if (
			!!this.donnees.casier &&
			!!this.donnees.casier.existeWidget &&
			this.donnees.casier.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.casier.titre");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDocuments",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.casier.listeDocuments.count() > 0) {
				for (I = 0; I < this.donnees.casier.listeDocuments.count(); I++) {
					lElement = this.donnees.casier.listeDocuments.get(I);
					lTitre =
						'<span onclick="' +
						this.Nom +
						"._surDocumentCasier(" +
						I +
						')">' +
						lElement.getLibelle() +
						"</span>";
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					lTitre =
						ObjetTraduction_1.GTraductions.getValeur(
							"accueil.casier.deposePar",
							[lElement.infoDepositaire],
						) +
						" - " +
						ObjetDate_1.GDate.formatDate(
							lElement.date,
							"[" + " %JJ %MMM" + "]",
						);
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudElement,
						"",
						lTitre,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.casier.message"),
				);
			}
		}
		if (
			!!this.donnees.CDTNonSaisi &&
			!!this.donnees.CDTNonSaisi.existeWidget &&
			this.donnees.CDTNonSaisi.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.CDTNonSaisi.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDocuments",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.CDTNonSaisi.listeCours.count() > 0) {
				this.donnees.CDTNonSaisi.listeCours.setTri([
					ObjetTri_1.ObjetTri.init("dateDebut"),
				]);
				this.donnees.CDTNonSaisi.listeCours.trier(
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				);
				lDate = {};
				for (i = 0; i < this.donnees.CDTNonSaisi.listeCours.count(); i++) {
					lCours = this.donnees.CDTNonSaisi.listeCours.get(i);
					lDateFormatee = ObjetDate_1.GDate.formatDate(
						lCours.dateDebut,
						"%JJJJ %JJ %MMM",
					).ucfirst();
					if (!lDate[lDateFormatee]) {
						lDate[lDateFormatee] = [];
					}
					lDate[lDateFormatee].push(lCours);
				}
				for (const lNomDate in lDate) {
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lNomDate,
						"Gras",
					);
					for (I = 0; I < lDate[lNomDate].length; I++) {
						lCours = lDate[lNomDate][I];
						lTitre =
							lCours.strMatiere +
							" - " +
							lCours.strClasse +
							" - " +
							lCours.strHeure;
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDTNonSaisi.message",
					),
				);
			}
		}
		if (
			!!this.donnees.appelNonFait &&
			!!this.donnees.appelNonFait.existeWidget &&
			this.donnees.appelNonFait.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.appelNonFait.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_Listeappel",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.appelNonFait.listeAppelNonFait.count() > 0) {
				this.donnees.appelNonFait.listeAppelNonFait.setTri([
					ObjetTri_1.ObjetTri.init("dateDebut"),
				]);
				this.donnees.appelNonFait.listeAppelNonFait.trier(
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				);
				H = {};
				for (
					I = 0;
					I < this.donnees.appelNonFait.listeAppelNonFait.count();
					I++
				) {
					lAppelNonFait = this.donnees.appelNonFait.listeAppelNonFait.get(I);
					lDate = ObjetDate_1.GDate.formatDate(
						lAppelNonFait.dateDebut,
						"%JJJJ %JJ %MMM",
					).ucfirst();
					if (!H[lDate]) {
						H[lDate] = [];
					}
					H[lDate].push(lAppelNonFait);
				}
				for (lDate in H) {
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lDate,
						"Gras",
					);
					for (I = 0; I < H[lDate].length; I++) {
						lAppelNonFait = H[lDate][I];
						lTitre =
							lAppelNonFait.strMatiere +
							" - " +
							lAppelNonFait.strClasse +
							" - " +
							lAppelNonFait.strHeure;
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTitre,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.appelNonFait.message",
					),
				);
			}
		}
		if (
			!!this.donnees.coursNonAssures &&
			!!this.donnees.coursNonAssures.existeWidget &&
			this.donnees.coursNonAssures.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.coursNonAssures.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeCours",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.coursNonAssures.listeCoursNonAssures.count() > 0) {
				this.donnees.coursNonAssures.listeCoursNonAssures.setTri([
					ObjetTri_1.ObjetTri.init("strProf"),
					ObjetTri_1.ObjetTri.init("dateDuCours"),
					ObjetTri_1.ObjetTri.init("placeDebut"),
				]);
				this.donnees.coursNonAssures.listeCoursNonAssures.trier();
				H = {};
				let lStrProfAccueil;
				for (
					let i = 0;
					i < this.donnees.coursNonAssures.listeCoursNonAssures.count();
					i++
				) {
					lCoursNonAssure =
						this.donnees.coursNonAssures.listeCoursNonAssures.get(i);
					if (!H[lCoursNonAssure.strProfAccueil]) {
						H[lCoursNonAssure.strProfAccueil] = {};
					}
					lDateFormatee = ObjetDate_1.GDate.formatDate(
						lCoursNonAssure.dateDuCours,
						"%JJJJ %JJ %MMM",
					).ucfirst();
					if (!H[lCoursNonAssure.strProfAccueil][lDateFormatee]) {
						H[lCoursNonAssure.strProfAccueil][lDateFormatee] = [];
					}
					H[lCoursNonAssure.strProfAccueil][lDateFormatee].push(
						lCoursNonAssure,
					);
				}
				for (lStrProfAccueil in H) {
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lStrProfAccueil,
						"Gras",
					);
					for (lDateFormatee in H[lStrProfAccueil]) {
						lElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
							lNoeudElement,
							"",
							lDateFormatee,
							"Gras",
						);
						for (let j = 0; j < H[lStrProfAccueil][lDateFormatee].length; j++) {
							lCoursNonAssure = H[lStrProfAccueil][lDateFormatee][j];
							lTitre =
								lCoursNonAssure.strDebut +
								" - " +
								lCoursNonAssure.strClasse +
								(lCoursNonAssure.strSalle
									? " - " + lCoursNonAssure.strSalle
									: "") +
								(lCoursNonAssure.strRemplacement
									? " (" + lCoursNonAssure.strRemplacement + ")"
									: "");
							this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
								lElement,
								"",
								lTitre,
							);
						}
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.coursNonAssures.message",
					),
				);
			}
		}
		if (
			!!this.donnees.personnelsAbsents &&
			!!this.donnees.personnelsAbsents.existeWidget &&
			this.donnees.personnelsAbsents.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.personnelsAbsents.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListePersonnelsAbsents",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.personnelsAbsents.listePersonnelsAbsents.count() > 0) {
				H = {};
				for (
					i = 0;
					i < this.donnees.personnelsAbsents.listePersonnelsAbsents.count();
					i++
				) {
					lPersonnelsAbsents =
						this.donnees.personnelsAbsents.listePersonnelsAbsents.get(i);
					if (!H[lPersonnelsAbsents.nom]) {
						H[lPersonnelsAbsents.nom] = {};
					}
					for (j = 0; j < lPersonnelsAbsents.absences.count(); j++) {
						const lDetailAbsence =
							lPersonnelsAbsents.absences.get(j).detailAbsence;
						if (!H[lPersonnelsAbsents.nom][lDetailAbsence]) {
							H[lPersonnelsAbsents.nom][lDetailAbsence] = [];
						}
						H[lPersonnelsAbsents.nom][lDetailAbsence].push(lDetailAbsence);
					}
				}
				for (const lStrPersonnel in H) {
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lStrPersonnel,
						"Gras",
					);
					for (const lDetailAbsence in H[lStrPersonnel]) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lDetailAbsence,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.personnelsAbsents.message",
					),
				);
			}
		}
		if (
			!!this.donnees.carnetDeCorrespondance &&
			!!this.donnees.carnetDeCorrespondance.existeWidget &&
			this.donnees.carnetDeCorrespondance.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.carnetDeCorrespondance.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeObservations",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.carnetDeCorrespondance.listeObservations.count() > 0) {
				for (
					i = 0;
					i < this.donnees.carnetDeCorrespondance.listeObservations.count();
					i++
				) {
					const lObservation =
						this.donnees.carnetDeCorrespondance.listeObservations.get(i);
					const aRessource = null;
					if (
						_estEleveDeRessourceAccessible.call(this, lObservation, aRessource)
					) {
						lTitre =
							'<span onclick="' +
							this.Nom +
							"._surObservation(" +
							i +
							')">' +
							lObservation.eleve.getLibelle() +
							" - " +
							lObservation.classe.getLibelle() +
							"</span>";
						lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
							lNoeudListeElements,
							"",
							lTitre,
							"Gras",
						);
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lObservation.strDate,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.carnetDeCorrespondance.message",
					),
				);
			}
		}
		if (
			!!this.donnees.TAFARendre &&
			!!this.donnees.TAFARendre.existeWidget &&
			this.donnees.TAFARendre.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.TAFARendre.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeTaf",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.TAFARendre.listeTAF.count() > 0) {
				lClasse = "";
				for (i = 0; i < this.donnees.TAFARendre.listeTAF.count(); i++) {
					const lTAF = this.donnees.TAFARendre.listeTAF.get(i);
					if (lClasse !== lTAF.classe) {
						lClasse =
							lTAF.classe + " : " + lTAF.nbrRendus + "/" + lTAF.nbrEleves;
						lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
							lNoeudListeElements,
							"",
							lClasse,
							"Gras",
						);
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							lTAF.descriptif,
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("Aucun"),
				);
			}
		}
		if (
			!!this.donnees.penseBete &&
			!!this.donnees.penseBete.existeWidget &&
			this.donnees.penseBete.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.penseBete.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListePenseBete",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.penseBete.libelle) {
				lNoeudElement = this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					this.donnees.penseBete.libelle,
				);
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("Aucune"),
				);
			}
		}
		if (
			!!this.donnees.lienUtile &&
			!!this.donnees.lienUtile.existeWidget &&
			this.donnees.lienUtile.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.lienUtile.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListelienUtile",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.lienUtile.listeLiens.count() > 0) {
				for (i = 0; i < this.donnees.lienUtile.listeLiens.count(); i++) {
					const lLien = this.donnees.lienUtile.listeLiens.get(i);
					lNoeudElement = this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudListeElements,
						"",
						lLien.url,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.lienUtile.message"),
				);
			}
		}
		if (
			!!this.donnees.ressources &&
			!!this.donnees.ressources.existeWidget &&
			this.donnees.ressources.existeWidget.call(this)
		) {
			lTitre = GEtatUtilisateur.existeGenreOnglet(
				Enumere_Onglet_1.EGenreOnglet.ProgrammesBO,
			)
				? ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ressources.titreAvecBO",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ressources.titreSansBO",
					);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeRessources",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.ressources.listeMatieres.count() > 0) {
				this.donnees.ressources.listeMatieres.setTri([
					ObjetTri_1.ObjetTri.init("Libelle"),
				]);
				this.donnees.ressources.listeMatieres.trier();
				H = {};
				let lLibelleMatiere;
				for (j = 0; j < this.donnees.ressources.listeMatieres.count(); j++) {
					lMatiere = this.donnees.ressources.listeMatieres.get(j);
					lLibelleMatiere = lMatiere.getLibelle();
					if (!H[lLibelleMatiere]) {
						H[lLibelleMatiere] = {};
					}
					if (
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.mesQCM
						] > 0
					) {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesQCM",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesQCM",
							) +
							" : " +
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.mesQCM
							];
					} else {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesQCM",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesQCM",
							) +
							" : " +
							ObjetTraduction_1.GTraductions.getValeur("Aucun");
					}
					if (
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.etabQCM
						] +
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource
									.nathanQCM
							] >
						0
					) {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.QCMPartages",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.QCMPartages",
							) +
							" : " +
							(lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.etabQCM
							] +
								lMatiere.nbrRessources[
									Enumere_PossessionRessource_1.EGenrePossessionRessource
										.nathanQCM
								]);
					} else {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.QCMPartages",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.QCMPartages",
							) +
							" : " +
							ObjetTraduction_1.GTraductions.getValeur("Aucun");
					}
					if (
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
						] > 0
					) {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesProgressions",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesProgressions",
							) +
							" : " +
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.mesProg
							];
					} else {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesProgressions",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.MesProgressions",
							) +
							" : " +
							ObjetTraduction_1.GTraductions.getValeur("Aucun");
					}
					if (
						lMatiere.nbrRessources[
							Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
						] > 0
					) {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.ProgressionsPartagees",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.ProgressionsPartagees",
							) +
							" : " +
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.etabProg
							];
					} else {
						H[lLibelleMatiere][
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.ProgressionsPartagees",
							)
						] =
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.hint.ProgressionsPartagees",
							) +
							" : " +
							ObjetTraduction_1.GTraductions.getValeur("Aucun");
					}
					if (
						GEtatUtilisateur.existeGenreOnglet(
							Enumere_Onglet_1.EGenreOnglet.ProgrammesBO,
						)
					) {
						if (
							lMatiere.nbrRessources[
								Enumere_PossessionRessource_1.EGenrePossessionRessource.BOProg
							] > 0
						) {
							H[lLibelleMatiere][
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.ressources.hint.ProgrammesBO",
								)
							] =
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.ressources.hint.ProgrammesBO",
								) +
								" : " +
								lMatiere.nbrRessources[
									Enumere_PossessionRessource_1.EGenrePossessionRessource.BOProg
								];
						} else {
							H[lLibelleMatiere][
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.ressources.hint.ProgrammesBO",
								)
							] =
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.ressources.hint.ProgrammesBO",
								) +
								" : " +
								ObjetTraduction_1.GTraductions.getValeur("Aucun");
						}
					}
				}
				for (lLibelleMatiere in H) {
					lTitre = lLibelleMatiere;
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
					for (const prog in H[lLibelleMatiere]) {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudElement,
							"",
							H[lLibelleMatiere][prog],
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("Aucun"),
				);
			}
		}
		if (
			!!this.donnees.QCM &&
			!!this.donnees.QCM.existeWidget &&
			this.donnees.QCM.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.executionsQCM",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeQCM",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.QCM.listeExecutionsQCM.count() > 0) {
				for (I = 0; I < this.donnees.QCM.listeExecutionsQCM.count(); I++) {
					const lExecutionsQCM = this.donnees.QCM.listeExecutionsQCM.get(I);
					lDate = ObjetDate_1.GDate.strDates(
						lExecutionsQCM.dateDebutPublication,
						lExecutionsQCM.dateFinPublication,
					).ucfirst();
					lTitre = lDate + " : " + lExecutionsQCM.service.getLibelle();
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
						"Gras",
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"accueil.AucuneExecutionsQCM",
					),
				);
			}
		}
		if (
			!!this.donnees.conseilDeClasse &&
			!!this.donnees.conseilDeClasse.existeWidget &&
			this.donnees.conseilDeClasse.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.CDC.titre");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeCDC",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.conseilDeClasse.listeClasses.count() > 0) {
				this.donnees.conseilDeClasse.listeClasses.setTri([
					ObjetTri_1.ObjetTri.init("Libelle"),
				]);
				this.donnees.conseilDeClasse.listeClasses.trier();
				H = {};
				let aPeriode;
				const lListePeriodes = new ObjetListeElements_1.ObjetListeElements();
				for (
					i = 0;
					i < this.donnees.conseilDeClasse.listeClasses.count();
					i++
				) {
					lClasse = this.donnees.conseilDeClasse.listeClasses.get(i);
					if (!lListePeriodes.getElementParElement(lClasse.periode)) {
						lListePeriodes.addElement(lClasse.periode);
					}
					aPeriode = lClasse.periode;
					const lLibellePeriode = aPeriode.getLibelle();
					if (lClasse.periode.getNumero() === aPeriode.getNumero()) {
						if (!H[lLibellePeriode]) {
							H[lLibellePeriode] = {};
						}
						if (!H[lLibellePeriode][lClasse.getLibelle()]) {
							H[lLibellePeriode][lClasse.getLibelle()] = [];
						}
						if (!lClasse.UniquementServicesSansNote) {
							if (lClasse.notationEstCloturee) {
								H[lLibellePeriode][lClasse.getLibelle()].push(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.colonne.hint.devoirs",
									) +
										" : " +
										lClasse.nbDevoirs +
										"  -  " +
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDC.hint.Cloturee",
										),
								);
							} else if (!!lClasse.dateClotureNotation) {
								H[lLibellePeriode][lClasse.getLibelle()].push(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.colonne.hint.devoirs",
									) +
										" : " +
										lClasse.nbDevoirs +
										"  -  " +
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDC.hint.ClotureDepuisLe",
											[
												ObjetDate_1.GDate.formatDate(
													lClasse.dateClotureNotation,
													"%JJ %MMMM",
												),
											],
										),
								);
							} else {
								H[lLibellePeriode][lClasse.getLibelle()].push(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.colonne.hint.devoirs",
									) +
										" : " +
										lClasse.nbDevoirs,
								);
							}
						}
						H[lLibellePeriode][lClasse.getLibelle()].push(
							ObjetTraduction_1.GTraductions.getValeur(
								"accueil.CDC.colonne.hint.evaluations",
							) +
								" : " +
								lClasse.nbEvaluations,
						);
						if (lClasse.auMoinsUnEleveDsServicesAppr) {
							const lStrNbAppSaisiesSurTotal =
								lClasse.nbAppreciationsSaisies +
								" / " +
								lClasse.nbAppreciationsTotales;
							if (lClasse.appEstCloturee) {
								H[lLibellePeriode][lClasse.getLibelle()].push(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.colonne.hint.apprSaisies",
									) +
										" : " +
										lStrNbAppSaisiesSurTotal +
										"  -  " +
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDC.hint.Cloturee",
										),
								);
							} else if (!!lClasse.dateClotureApp) {
								H[lLibellePeriode][lClasse.getLibelle()].push(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.colonne.hint.apprSaisies",
									) +
										" : " +
										lStrNbAppSaisiesSurTotal +
										"  -  " +
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDC.hint.ClotureDepuisLe",
											[
												ObjetDate_1.GDate.formatDate(
													lClasse.dateClotureApp,
													"%JJ %MMMM",
												),
											],
										),
								);
							} else {
								H[lLibellePeriode][lClasse.getLibelle()].push(
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.colonne.hint.apprSaisies",
									) +
										" : " +
										lStrNbAppSaisiesSurTotal,
								);
							}
						}
						if (lClasse.dateConseil) {
							H[lLibellePeriode][lClasse.getLibelle()].push(
								ObjetTraduction_1.GTraductions.getValeur(
									"accueil.CDC.colonne.hint.dateConseilDeClasse",
								) +
									" : " +
									[
										ObjetDate_1.GDate.formatDate(
											lClasse.dateConseil,
											"%JJ %MMMM",
										),
									],
							);
						}
					}
				}
				for (aPeriode in H) {
					lNoeudElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						aPeriode,
						"Gras",
					);
					for (lClasse in H[aPeriode]) {
						if ($.isArray(H[aPeriode][lClasse])) {
							lElement = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
								lNoeudElement,
								"",
								lClasse,
								"Gras",
							);
							for (i = 0; i < H[aPeriode][lClasse].length; i++) {
								this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
									lElement,
									"",
									H[aPeriode][lClasse][i],
								);
							}
						}
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("aucun"),
				);
			}
		}
		if (
			!!this.donnees.intendanceExecute &&
			!!this.donnees.intendanceExecute.existeWidget &&
			this.donnees.intendanceExecute.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.Widget.Maintenance.Titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_Listeligne",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.intendanceExecute.listeLignes.count() > 0) {
				for (
					i = 0, lNbr = this.donnees.intendanceExecute.listeLignes.count();
					i < lNbr;
					i++
				) {
					const lDonnee = this.donnees.intendanceExecute.listeLignes.get(i);
					lTitre =
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.Widget.DemandeParLe",
							[
								lDonnee.demandeur.getLibelle(),
								ObjetDate_1.GDate.formatDate(lDonnee.dateCreation, "%JJ %MMM"),
							],
						) + (lDonnee.detail ? " : " + lDonnee.detail : "");
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Widget.Maintenance.MsgAucun",
					),
				);
			}
		}
		if (
			!!this.donnees.tachesSecretariatExecute &&
			!!this.donnees.tachesSecretariatExecute.existeWidget &&
			this.donnees.tachesSecretariatExecute.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.Widget.Secretariat.Titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_Listeligne",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.tachesSecretariatExecute.listeLignes.count() > 0) {
				for (
					i = 0,
						lNbr = this.donnees.tachesSecretariatExecute.listeLignes.count();
					i < lNbr;
					i++
				) {
					const lDonneeTacheSecExecute =
						this.donnees.tachesSecretariatExecute.listeLignes.get(i);
					lTitre =
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.Widget.DemandeParLe",
							[
								lDonneeTacheSecExecute.demandeur.getLibelle(),
								ObjetDate_1.GDate.formatDate(
									lDonneeTacheSecExecute.dateCreation,
									"%JJ %MMM",
								),
							],
						) +
						(lDonneeTacheSecExecute.detail
							? " : " + lDonneeTacheSecExecute.detail
							: "");
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Widget.Secretariat.MsgAucun",
					),
				);
			}
		}
		if (
			!!this.donnees.maintenanceInfoExecute &&
			!!this.donnees.maintenanceInfoExecute.existeWidget &&
			this.donnees.maintenanceInfoExecute.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.Widget.Secretariat.Titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_Listeligne",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.maintenanceInfoExecute.listeLignes.count() > 0) {
				for (
					i = 0, lNbr = this.donnees.maintenanceInfoExecute.listeLignes.count();
					i < lNbr;
					i++
				) {
					const lDonneeTacheInfoExecute =
						this.donnees.maintenanceInfoExecute.listeLignes.get(i);
					lTitre =
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.Widget.DemandeParLe",
							[
								lDonneeTacheInfoExecute.demandeur.getLibelle(),
								ObjetDate_1.GDate.formatDate(
									lDonneeTacheInfoExecute.dateCreation,
									"%JJ %MMM",
								),
							],
						) +
						(lDonneeTacheInfoExecute.detail
							? " : " + lDonneeTacheInfoExecute.detail
							: "");
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Widget.Secretariat.MsgAucun",
					),
				);
			}
		}
		if (
			!!this.donnees.maintenanceInfoExecute &&
			!!this.donnees.maintenanceInfoExecute.existeWidget &&
			this.donnees.maintenanceInfoExecute.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.Widget.Secretariat.Titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_Listeligne",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.maintenanceInfoExecute.listeLignes.count() > 0) {
				for (
					i = 0, lNbr = this.donnees.maintenanceInfoExecute.listeLignes.count();
					i < lNbr;
					i++
				) {
					const lDonneeTacheInfoExecute =
						this.donnees.maintenanceInfoExecute.listeLignes.get(i);
					lTitre =
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.Widget.DemandeParLe",
							[
								lDonneeTacheInfoExecute.demandeur.getLibelle(),
								ObjetDate_1.GDate.formatDate(
									lDonneeTacheInfoExecute.dateCreation,
									"%JJ %MMM",
								),
							],
						) +
						(lDonneeTacheInfoExecute.detail
							? " : " + lDonneeTacheInfoExecute.detail
							: "");
					this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
						lNoeudListeElements,
						"",
						lTitre,
					);
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Widget.Secretariat.MsgAucun",
					),
				);
			}
		}
		if (
			!!this.donnees.menuDeLaCantine &&
			!!this.donnees.menuDeLaCantine.existeWidget &&
			this.donnees.menuDeLaCantine.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur("accueil.menu");
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeMenu",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.menuDeLaCantine.listeRepas.count() > 0) {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					WidgetMenu_1.WidgetMenu.composeWidgetMenuAccessible(
						this.donnees.menuDeLaCantine,
					),
				);
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.pasDeMenu"),
				);
			}
		}
		if (
			!!this.donnees.incidents &&
			!!this.donnees.incidents.existeWidget &&
			this.donnees.incidents.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.incident.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeCours",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			if (this.donnees.incidents.listeIncidents.count() > 0) {
				for (
					i = 0, lNbr = this.donnees.incidents.listeIncidents.count();
					i < lNbr;
					i++
				) {
					lElt = this.donnees.incidents.listeIncidents.get(i);
					const lNoeudIncident =
						this._objetListeArborescente.ajouterUnNoeudAuNoeud(
							lNoeudListeElements,
							"",
							lElt.strDate + " " + lElt.strSignale,
							"Gras Texte11",
						);
					const lDatasIncident = [
						[
							ObjetTraduction_1.GTraductions.getValeur("fiche.incident.motifs"),
							lElt.strMotifs,
						],
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"fiche.incident.gravite",
							),
							lElt.strGravite,
						],
						[
							ObjetTraduction_1.GTraductions.getValeur("fiche.incident.auteur"),
							lElt.strAuteur,
						],
						[
							ObjetTraduction_1.GTraductions.getValeur(
								"fiche.incident.victime",
							),
							lElt.strVictime,
						],
						[
							ObjetTraduction_1.GTraductions.getValeur("fiche.incident.temoin"),
							lElt.strTemoin,
						],
					];
					for (j = 0, lNbr2 = lDatasIncident.length; j < lNbr2; j++) {
						lValeur = lDatasIncident[j][1];
						if (lValeur !== undefined && lValeur !== null && lValeur !== "") {
							this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
								lNoeudIncident,
								"",
								lDatasIncident[j][0] + " : " + lValeur,
								"Texte11",
							);
						}
					}
					const lDetail = lElt.getLibelle();
					if (lDetail !== "") {
						this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
							lNoeudIncident,
							"",
							lDetail,
							"Texte11",
						);
					}
				}
			} else {
				this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
					lNoeudListeElements,
					"",
					ObjetTraduction_1.GTraductions.getValeur("accueil.incident.msgAucun"),
				);
			}
		}
		if (
			!!this.donnees.donneesVS &&
			!!this.donnees.donneesVS.existeWidget &&
			this.donnees.donneesVS.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.donneesVS.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDonneesVS",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			lNbr = this.donnees.donneesVS.listeDonneesVS.count();
			if (lNbr > 0) {
				for (i = 0; i < lNbr; i++) {
					lElt = this.donnees.donneesVS.listeDonneesVS.get(i);
					lNoeudElt = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lElt.strDate,
						"Gras Texte11",
					);
					lNbr2 = this.donnees.donneesVS.strTypeDonnee.length;
					lDatas = [];
					for (j = 0; j < lNbr2; j++) {
						lDatas.push([
							this.donnees.donneesVS.strTypeDonnee[j],
							lElt.listeDonnees[j].strValeur,
						]);
					}
					for (j = 0, lNbr2 = lDatas.length; j < lNbr2; j++) {
						lValeur = lDatas[j][1];
						if (lValeur !== undefined && lValeur !== null && lValeur !== "") {
							this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
								lNoeudElt,
								"",
								lDatas[j][0] + " : " + lValeur,
								"Texte11",
							);
						}
					}
				}
			}
		}
		if (
			!!this.donnees.donneesProfs &&
			!!this.donnees.donneesProfs.existeWidget &&
			this.donnees.donneesProfs.existeWidget.call(this)
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"accueil.donneesProfs.titre",
			);
			lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
				lRacine,
				lIdListe + "_ListeDonneesProfs",
				lTitre,
				"Gras",
				true,
				lPremierElement,
			);
			lPremierElement = false;
			lNbr = this.donnees.donneesProfs.listeDonneesProfs.count();
			if (lNbr > 0) {
				for (i = 0; i < lNbr; i++) {
					lElt = this.donnees.donneesProfs.listeDonneesProfs.get(i);
					lNoeudElt = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
						lNoeudListeElements,
						"",
						lElt.strDate,
						"Gras Texte11",
					);
					lNbr2 = this.donnees.donneesProfs.strTypeDonnee.length;
					lDatas = [];
					for (j = 0; j < lNbr2; j++) {
						lDatas.push([
							this.donnees.donneesProfs.strTypeDonnee[j],
							lElt.listeDonnees[j].strValeur,
						]);
					}
					for (j = 0, lNbr2 = lDatas.length; j < lNbr2; j++) {
						lValeur = lDatas[j][1];
						if (lValeur !== undefined && lValeur !== null && lValeur !== "") {
							this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
								lNoeudElt,
								"",
								lDatas[j][0] + " : " + lValeur,
								"Texte11",
							);
						}
					}
				}
			}
		}
		$("#" + this.Nom.escapeJQ()).addClass("AlignementHaut");
		ObjetHtml_1.GHtml.setHtml(
			this.Nom,
			this._objetListeArborescente.construireAffichage(),
		);
		this._objetListeArborescente.setDonnees(lRacine);
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
		const lWindowWidth = GNavigateur.clientL;
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
function _composeDetailActualiteAccessible(aActualite) {
	const H = [];
	for (
		let I = 0;
		aActualite.listeQuestions && I < aActualite.listeQuestions.count();
		I++
	) {
		const lQuestion = aActualite.listeQuestions.get(I);
		if (aActualite.estSondage) {
			H.push('<div class="Souligne">', lQuestion.getLibelle(), "</div>");
		}
		H.push("<div>", lQuestion.texte, "</div>");
		for (
			let J = 0;
			lQuestion.listePiecesJointes && J < lQuestion.listePiecesJointes.count();
			J++
		) {
			const lDocumentJoint = lQuestion.listePiecesJointes.get(J);
			const lURL = ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJoint,
				libelleEcran: lDocumentJoint.getLibelle(),
				genreRessource:
					Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			});
			H.push(lURL);
		}
	}
	if (aActualite.signataire) {
		H.push("<div>", aActualite.signataire, "</div>");
	}
	return H.join("");
}
function _composeDocumentsAccessible(aListeDocumentsJoints) {
	const lHtml = [];
	for (let I = 0; I < aListeDocumentsJoints.count(); I++) {
		const lDocumentJoint = aListeDocumentsJoints.get(I);
		lHtml.push(
			ObjetChaine_1.GChaine.composerUrlLienExterne({
				documentJoint: lDocumentJoint,
				genreRessource:
					Enumere_Ressource_1.EGenreRessource.DocJointEtablissement,
			}),
		);
	}
	return lHtml.join(", ");
}
function _estEleveDeRessourceAccessible(aObservation, aRessource) {
	if (!aRessource) {
		return true;
	}
	if (!aRessource.existeNumero()) {
		return true;
	}
	if (aRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe) {
		return aRessource.getNumero() === aObservation.classe.getNumero();
	}
	if (aRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe) {
		for (let i = 0; i < aObservation.listeGroupes.count(); i++) {
			if (aRessource.getNumero() === aObservation.listeGroupes.getNumero(i)) {
				return true;
			}
		}
	}
	return false;
}
