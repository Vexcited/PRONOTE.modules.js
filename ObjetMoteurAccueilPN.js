exports.ObjetMoteurAccueil = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const GUID_1 = require("GUID");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Widget_1 = require("Enumere_Widget");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const ObjetTraduction_1 = require("ObjetTraduction");
const MultipleWidgetAbsencesJustifieesParents = require("WidgetAbsencesJustifieesParents");
const WidgetActualites_1 = require("WidgetActualites");
const WidgetAgenda_1 = require("WidgetAgenda");
const MultipleWidgetAide = require("WidgetAide");
const MultipleWidgetAppelNonFait = require("WidgetAppelNonFait");
const MultipleWidgetBlog_FilActu = require("WidgetBlog_FilActu");
const MultipleWidgetCarnetDeCorrespondance = require("WidgetCarnetDeCorrespondance");
const MultipleWidgetCasier = require("WidgetCasier");
const MultipleWidgetCDC = require("WidgetCDC");
const MultipleWidgetInfosParcoursupLSL = require("WidgetInfosParcoursupLSL");
const MultipleWidgetCDTNonSaisi = require("WidgetCDTNonSaisi");
const MultipleWidgetCompetences = require("WidgetCompetences");
const MultipleWidgetConnexionsEnCours = require("WidgetConnexionsEnCours");
const MultipleWidgetCoursNonAssures = require("WidgetCoursNonAssures");
const MultipleWidgetDiscussions = require("WidgetDiscussions");
const MultipleWidgetDonneesProfs = require("WidgetDonneesProfs");
const MultipleWidgetDonneesVS = require("WidgetDonneesVS");
const MultipleWidgetRegistreAppel = require("WidgetRegistreAppel");
const MultipleWidgetPrevisionnelAbsServiceAnnexe = require("WidgetPrevisionnelAbsServiceAnnexe");
const MultipleWidgetDS = require("WidgetDS");
const MultipleWidgetDSEvaluation = require("WidgetDSEvaluations");
const MultipleWidgetEDT = require("WidgetEDT");
const WidgetEDTJournalier_1 = require("WidgetEDTJournalier");
const WidgetElections_1 = require("WidgetElections");
const MultipleWidgetEnseignementADistance = require("WidgetEnseignementADistance");
const MultipleWidgetIncidents = require("WidgetIncidents");
const MultipleWidgetExclusions = require("WidgetExclusions");
const MultipleWidgetIntendance_Execute = require("WidgetIntendance_Execute");
const MultipleWidgetKiosque = require("WidgetKiosque");
const MultipleWidgetLienUtile = require("WidgetLienUtile");
const MultipleWidgetMenu = require("WidgetMenu");
const MultipleWidgetNotes = require("WidgetNotes");
const MultipleWidgetPartenaireAgate = require("WidgetPartenaireAgate");
const MultipleWidgetPartenaireARD = require("WidgetPartenaireArd");
const MultipleWidgetPartenaireApplicam = require("WidgetPartenaireApplicam");
const MultipleWidgetPartenaireCDI = require("WidgetPartenaireCDI");
const MultipleWidgetPartenaireFAST = require("WidgetPartenaireFAST");
const MultipleWidgetPenseBete = require("WidgetPenseBete");
const MultipleWidgetPersonnelsAbsents = require("WidgetPersonnelsAbsents");
const WidgetPlanningMultiple = require("WidgetPlanning");
const MultipleWidgetQCM = require("WidgetQCM");
const MultipleWidgetRessources = require("WidgetRessources");
const MultipleWidgetRessourcePedagogique = require("WidgetRessourcePedagogique");
const WidgetRetourEspace_1 = require("WidgetRetourEspace");
const MultipleWidgetTableauDeBord = require("WidgetTableauDeBord");
const MultipleWidgetTAF = require("WidgetTAF");
const MultipleWidgetTAFPrimaire = require("WidgetTAFPrimaire");
const MultipleWidgetTAFARendre = require("WidgetTAFARendre");
const MultipleWidgetTAFEtActivites = require("WidgetTAFEtActivites");
const MultipleWidgetVieScolaire = require("WidgetVieScolaire");
const MultipleWidgetEvenementRappel = require("WidgetEvenementRappel");
const MultipleWidgetModificationEDT = require("WidgetModificationEDT");
const MultipleWidgetRemplacementsEnseignants = require("WidgetRemplacementsEnseignants");
const MultipleWidgetVoteElecMembreBureau = require("WidgetVoteElecMembreBureau");
const MultipleWidgetVoteElecElecteur = require("WidgetVoteElecElecteur");
const MultipleWidgetDocumentsASigner = require("WidgetDocumentsASigner");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const TypeEtatPublication_1 = require("TypeEtatPublication");
class ObjetMoteurAccueil {
	constructor() {
		this.etatUtilisateurSco = GEtatUtilisateur;
		this.parametresSco = GParametres;
		this.applicationSco = GApplication;
		this.moteurBlog = new ObjetMoteurBlog_1.ObjetMoteurBlog();
		const lAvecWidgetDocumentsASignerDansColonne4 =
			[Enumere_Espace_1.EGenreEspace.Etablissement].includes(
				GEtatUtilisateur.GenreEspace,
			) || this.etatUtilisateurSco.pourPrimaire();
		this.genreColonne = {
			agendaEtInformations: {
				genre: 0,
				position: 5,
				actif: false,
				visible: true,
				liste: [
					lAvecWidgetDocumentsASignerDansColonne4
						? null
						: Enumere_Widget_1.EGenreWidget.documentsASigner,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? null
						: Enumere_Widget_1.EGenreWidget.partenaireCDI,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.partenaireAgate,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? null
						: Enumere_Widget_1.EGenreWidget.partenaireARD,
					Enumere_Widget_1.EGenreWidget.partenaireApplicam,
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.blogFilActu,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.lienUtile,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? null
						: Enumere_Widget_1.EGenreWidget.elections,
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.voteElecElecteur,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.agenda,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.actualites,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.discussions,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.casier,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? null
						: Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
					Enumere_Widget_1.EGenreWidget.partenaireFAST,
				],
			},
			notes: {
				genre: 1,
				position: 3,
				actif: false,
				visible: true,
				liste: [
					Enumere_Widget_1.EGenreWidget.enseignementADistance,
					Enumere_Widget_1.EGenreWidget.vieScolaire,
					Enumere_Widget_1.EGenreWidget.notes,
					Enumere_Widget_1.EGenreWidget.competences,
				],
			},
			CDT: {
				genre: 2,
				position: 2,
				minWidth: 360,
				maxWidth: 500,
				actif: false,
				visible: true,
				liste: [
					Enumere_Widget_1.EGenreWidget.DS,
					Enumere_Widget_1.EGenreWidget.DSEvaluation,
					Enumere_Widget_1.EGenreWidget.TAFEtActivites,
					Enumere_Widget_1.EGenreWidget.QCM,
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.blogFilActu
						: null,
					Enumere_Widget_1.EGenreWidget.travailAFaire,
					Enumere_Widget_1.EGenreWidget.ressourcePedagogique,
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.casier
						: null,
					[
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Professeur,
					].includes(GEtatUtilisateur.GenreEspace)
						? null
						: Enumere_Widget_1.EGenreWidget.kiosque,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) ||
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace) &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estDirecteur,
						))
						? Enumere_Widget_1.EGenreWidget.IntendanceExecute
						: null,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) ||
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace) &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estDirecteur,
						))
						? Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute
						: null,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) ||
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace) &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estDirecteur,
						))
						? Enumere_Widget_1.EGenreWidget.commandeExecute
						: null,
				],
			},
			emploiDuTemps: {
				genre: 3,
				position: 0,
				maximise:
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur,
				actif: false,
				visible: true,
				liste: [
					Enumere_Widget_1.EGenreWidget.Planning,
					Enumere_Widget_1.EGenreWidget.EDT,
					Enumere_Widget_1.EGenreWidget.conseilDeClasse,
					Enumere_Widget_1.EGenreWidget.InfosParcoursupLSL,
					Enumere_Widget_1.EGenreWidget.ressources,
				],
			},
			absencesProf: {
				genre: 4,
				position: 4,
				actif: false,
				visible: true,
				liste: [
					Enumere_Widget_1.EGenreWidget.penseBete,
					lAvecWidgetDocumentsASignerDansColonne4
						? Enumere_Widget_1.EGenreWidget.documentsASigner
						: null,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? Enumere_Widget_1.EGenreWidget.partenaireCDI
						: null,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.partenaireAgate
						: null,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? Enumere_Widget_1.EGenreWidget.partenaireARD
						: null,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.lienUtile
						: null,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? Enumere_Widget_1.EGenreWidget.elections
						: null,
					Enumere_Widget_1.EGenreWidget.appelNonFait,
					Enumere_Widget_1.EGenreWidget.CDTNonSaisi,
					Enumere_Widget_1.EGenreWidget.carnetDeCorrespondance,
					Enumere_Widget_1.EGenreWidget.TAFARendre,
					Enumere_Widget_1.EGenreWidget.modificationEDT,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) ||
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace) &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estDirecteur,
						))
						? null
						: Enumere_Widget_1.EGenreWidget.IntendanceExecute,
					Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute,
					Enumere_Widget_1.EGenreWidget.absRetardsJustifiesParents,
					Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants,
					Enumere_Widget_1.EGenreWidget.coursNonAssures,
					Enumere_Widget_1.EGenreWidget.personnelsAbsents,
					Enumere_Widget_1.EGenreWidget.incidents,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Professeur
						? Enumere_Widget_1.EGenreWidget.kiosque
						: null,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace)
						? null
						: Enumere_Widget_1.EGenreWidget.donneesVS,
					Enumere_Widget_1.EGenreWidget.exclusions,
					Enumere_Widget_1.EGenreWidget.donneesProfs,
					Enumere_Widget_1.EGenreWidget.connexionsEnCours,
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.voteElecMembreBureau
						: null,
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.voteElecElecteur
						: null,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.agenda
						: null,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.actualites
						: null,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.discussions
						: null,
					GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
						? Enumere_Widget_1.EGenreWidget.casier
						: null,
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Etablissement ||
					this.etatUtilisateurSco.pourPrimaire()
						? Enumere_Widget_1.EGenreWidget.menuDeLaCantine
						: null,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) ||
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace) &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estDirecteur,
						))
						? null
						: Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace) ||
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace) &&
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estDirecteur,
						))
						? null
						: Enumere_Widget_1.EGenreWidget.commandeExecute,
				],
			},
			aide: {
				genre: 5,
				position: 6,
				actif: false,
				visible: true,
				liste: [Enumere_Widget_1.EGenreWidget.aide],
			},
			tableauDeBord: {
				genre: 6,
				position: 1,
				minWidth: 360,
				maxWidth: 500,
				actif: false,
				visible: true,
				liste: [
					Enumere_Widget_1.EGenreWidget.tableauDeBord,
					[
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
					].includes(GEtatUtilisateur.GenreEspace)
						? Enumere_Widget_1.EGenreWidget.kiosque
						: null,
					[
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
					].includes(GEtatUtilisateur.GenreEspace)
						? Enumere_Widget_1.EGenreWidget.donneesVS
						: null,
					Enumere_Widget_1.EGenreWidget.registreAppel,
					Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe,
				],
			},
		};
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
	}
	setDateParDefaut(aDate) {
		this.dateParDefaut = aDate;
	}
	setSemaineSelectionnee(aSemaineSelectionnee) {
		this.semaineSelectionnee = aSemaineSelectionnee;
	}
	existeDS(aGenreLienDS) {
		if (this.donnees.devoirSurveille.listeDS) {
			for (let i = 0; i < this.donnees.devoirSurveille.listeDS.count(); i++) {
				if (this.donnees.devoirSurveille.listeDS.getGenre(i) === aGenreLienDS) {
					return true;
				}
			}
		}
		return false;
	}
	getDeclarationWidget(aGenreWidget) {
		var _a, _b, _c, _d;
		switch (aGenreWidget) {
			case Enumere_Widget_1.EGenreWidget.activite:
				return {
					nomDonnees: "activite",
					genre: Enumere_Widget_1.EGenreWidget.activite,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetTAFPrimaire
						? MultipleWidgetTAFPrimaire.WidgetTAFPrimaire
						: null,
					existeWidget: () => {
						return (
							!!this.donnees.activite &&
							!!this.donnees.activite.listeActivite &&
							!!this.donnees.activite.listeActivite.count()
						);
					},
					isCollapsible: false,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ActiviteDuJour",
					),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.CDT_TAF },
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.actualites:
				return {
					nomDonnees: "actualites",
					genre: Enumere_Widget_1.EGenreWidget.actualites,
					classWidget: WidgetActualites_1.WidgetActualites,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Informations },
					titre:
						this.etatUtilisateurSco.pourPrimaire() &&
						![
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
							Enumere_Espace_1.EGenreEspace.PrimPeriscolaire,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire,
							Enumere_Espace_1.EGenreEspace.PrimMairie,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
						].includes(GEtatUtilisateur.GenreEspace)
							? ObjetTraduction_1.GTraductions.getValeur(
									"accueil.actualitesPrimaire",
								)
							: ObjetTraduction_1.GTraductions.getValeur("accueil.actualites"),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.info.actualites",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.aucuneActualite",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(
								this.donnees.actualites &&
								this.donnees.actualites.listeModesAff &&
								this.donnees.actualites.listeModesAff[
									TypeEtatPublication_1.TypeModeAff.MA_Reception
								].listeActualites
							)
						);
					},
					isCollapsible: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.agenda:
				return {
					nomDonnees: "agenda",
					genre: Enumere_Widget_1.EGenreWidget.agenda,
					classWidget: WidgetAgenda_1.WidgetAgenda,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Agenda },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.agenda.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur("accueil.info.agenda"),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.aucuneAgenda",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.agenda.listeEvenements;
					},
					isCollapsible: true,
					semaineSelectionnee: this.numeroSemaineParDefaut,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.aide:
				return {
					nomDonnees: "aide",
					genre: Enumere_Widget_1.EGenreWidget.aide,
					classWidget: MultipleWidgetAide
						? MultipleWidgetAide.WidgetAide
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur("accueil.aide.titre"),
					existeWidget: () => {
						return false;
					},
					isCollapsible: false,
					maximise: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.appelNonFait:
				return {
					nomDonnees: "appelNonFait",
					genre: Enumere_Widget_1.EGenreWidget.appelNonFait,
					classWidget: MultipleWidgetAppelNonFait
						? MultipleWidgetAppelNonFait.WidgetAppelNonFait
						: null,
					id: GUID_1.GUID.getId(),
					page: {
						Onglet: GEtatUtilisateur.existeGenreOnglet(
							Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi,
						)
							? Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi
							: Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel,
					},
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.appelNonFait.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.appelNonFait.message",
					),
					existeWidget: () => {
						return !!(
							!this.donnees || this.donnees.appelNonFait.listeAppelNonFait
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 3,
					jourSelectionne: this.dateParDefaut,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.blogFilActu:
				return {
					nomDonnees: "blogFilActu",
					genre: Enumere_Widget_1.EGenreWidget.blogFilActu,
					classWidget: MultipleWidgetBlog_FilActu
						? MultipleWidgetBlog_FilActu.WidgetBlog_FilActu
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Blog_FilActu },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.blog.derniersBilletsPublies",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.blog.filActuBlog",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.blog.aucunBilletPublie",
					),
					existeWidget: () => {
						if (
							this.moteurBlog.estEspaceAvecBlog(GEtatUtilisateur.GenreEspace)
						) {
							if (
								[
									Enumere_Espace_1.EGenreEspace.PrimProfesseur,
									Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
									Enumere_Espace_1.EGenreEspace.PrimDirection,
									Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
								].includes(GEtatUtilisateur.GenreEspace)
							) {
								return true;
							}
							const lExisteBillets =
								!!this.donnees.blogFilActu &&
								this.donnees.blogFilActu.listeBillets &&
								this.donnees.blogFilActu.listeBillets.count() > 0;
							return lExisteBillets;
						}
						return false;
					},
					isCollapsible: true,
					nbrItemsVisible: 3,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.casier:
				return {
					nomDonnees: "casier",
					genre: Enumere_Widget_1.EGenreWidget.casier,
					classWidget: MultipleWidgetCasier
						? MultipleWidgetCasier.WidgetCasier
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.casier.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.casier.titre",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.casier.message",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.casier.listeDocuments;
					},
					isCollapsible: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.carnetDeCorrespondance:
				return {
					nomDonnees: "carnetDeCorrespondance",
					genre: Enumere_Widget_1.EGenreWidget.carnetDeCorrespondance,
					classWidget: MultipleWidgetCarnetDeCorrespondance
						? MultipleWidgetCarnetDeCorrespondance.WidgetCarnetDeCorrespondance
						: null,
					id: GUID_1.GUID.getId(),
					page: {
						Onglet: Enumere_Onglet_1.EGenreOnglet.Saisie_CarnetCorrespondance,
					},
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.carnetDeCorrespondance.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.carnetDeCorrespondance.hint",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.carnetDeCorrespondance.message",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!this.donnees.carnetDeCorrespondance.listeObservations
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					semaineSelectionnee: IE.Cycles.cycleDeLaDate(
						GApplication.getDateDemo()
							? GApplication.getDateDemo()
							: new Date(),
					),
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.conseilDeClasse:
				return {
					nomDonnees: "conseilDeClasse",
					genre: Enumere_Widget_1.EGenreWidget.conseilDeClasse,
					classWidget: MultipleWidgetCDC ? MultipleWidgetCDC.WidgetCDC : null,
					id: GUID_1.GUID.getId(),
					page: null,
					titre: ObjetTraduction_1.GTraductions.getValeur("accueil.CDC.titre"),
					hint: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							(this.donnees.conseilDeClasse.listeClasses &&
								this.donnees.conseilDeClasse.listeClasses.count() > 0)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-resultat",
				};
			case Enumere_Widget_1.EGenreWidget.InfosParcoursupLSL:
				return {
					nomDonnees: "infosParcoursupLSL",
					genre: Enumere_Widget_1.EGenreWidget.InfosParcoursupLSL,
					classWidget: MultipleWidgetInfosParcoursupLSL
						? MultipleWidgetInfosParcoursupLSL.WidgetInfosParcoursupLSL
						: null,
					id: GUID_1.GUID.getId(),
					page: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.infosParcoursupLSL.titre",
					),
					hint: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							(this.donnees.infosParcoursupLSL &&
								this.donnees.infosParcoursupLSL.listeServices &&
								this.donnees.infosParcoursupLSL.listeServices.count() > 0)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-resultat",
				};
			case Enumere_Widget_1.EGenreWidget.CDTNonSaisi:
				return {
					nomDonnees: "CDTNonSaisi",
					genre: Enumere_Widget_1.EGenreWidget.CDTNonSaisi,
					classWidget: MultipleWidgetCDTNonSaisi
						? MultipleWidgetCDTNonSaisi.WidgetCDTNonSaisi
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDTNonSaisi.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDTNonSaisi.message",
					),
					existeWidget: () => {
						return !!(!this.donnees || this.donnees.CDTNonSaisi.listeCours);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					jourSelectionne: GApplication.getDateDemo()
						? GApplication.getDateDemo()
						: this.parametresSco.JourOuvre,
					semaineSelectionnee: this.semaineSelectionnee,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.competences:
				return {
					nomDonnees: "competences",
					genre: aGenreWidget,
					classWidget: MultipleWidgetCompetences
						? MultipleWidgetCompetences.WidgetCompetences
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.DernieresEvaluations },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.competences.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.competences.hint",
					),
					message: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(
								this.donnees.competences.listeEvaluations &&
								this.donnees.competences.listeEvaluations.count()
							)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-resultat",
				};
			case Enumere_Widget_1.EGenreWidget.connexionsEnCours:
				return {
					nomDonnees: "connexionsEnCours",
					genre: Enumere_Widget_1.EGenreWidget.connexionsEnCours,
					classWidget: MultipleWidgetConnexionsEnCours
						? MultipleWidgetConnexionsEnCours.WidgetConnexionsEnCours
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.connexionsEnCours.titre",
					),
					message: "",
					existeWidget: () => {
						return (
							[
								Enumere_Espace_1.EGenreEspace.Administrateur,
								Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
								Enumere_Espace_1.EGenreEspace.PrimProfesseur,
								Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
								Enumere_Espace_1.EGenreEspace.PrimDirection,
								Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
							].includes(GEtatUtilisateur.GenreEspace) &&
							!this.applicationSco.estEDT &&
							(!this.donnees || !!this.donnees.connexionsEnCours)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.coursNonAssures:
				return {
					nomDonnees: "coursNonAssures",
					genre: Enumere_Widget_1.EGenreWidget.coursNonAssures,
					classWidget: MultipleWidgetCoursNonAssures
						? MultipleWidgetCoursNonAssures.WidgetCoursNonAssures
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.CoursNonAssures },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.coursNonAssures.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.coursNonAssures.message",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!this.donnees.coursNonAssures.listeCoursNonAssures
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.discussions:
				return {
					nomDonnees: "discussions",
					genre: aGenreWidget,
					classWidget: MultipleWidgetDiscussions
						? MultipleWidgetDiscussions.WidgetDiscussions
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Messagerie },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.discussions.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.info.discussions",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.aucunMessage",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.discussions.listeMessagerie;
					},
					isCollapsible: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.donneesProfs:
				return {
					nomDonnees: "donneesProfs",
					genre: aGenreWidget,
					classWidget: MultipleWidgetDonneesProfs
						? MultipleWidgetDonneesProfs.WidgetDonneesProfs
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.donneesProfs.titre",
					),
					message: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(
								this.donnees.donneesProfs.listeDonneesProfs &&
								this.donnees.donneesProfs.listeDonneesProfs.count()
							)
						);
					},
					isCollapsible: false,
					semaineSelectionnee: this.semaineSelectionnee,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.donneesVS:
				return {
					nomDonnees: "donneesVS",
					genre: aGenreWidget,
					classWidget: MultipleWidgetDonneesVS
						? MultipleWidgetDonneesVS.WidgetDonneesVS
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.donneesVS.titre",
					),
					message: "",
					existeWidget: () => {
						return !this.donnees || !!this.donnees.donneesVS.listeDonneesVS;
					},
					isCollapsible: false,
					semaineSelectionnee: this.semaineSelectionnee,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.registreAppel:
				return {
					nomDonnees: "registreAppel",
					genre: aGenreWidget,
					classWidget: MultipleWidgetRegistreAppel
						? MultipleWidgetRegistreAppel.WidgetRegistreAppel
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.registreAppel.titre",
					),
					message: "",
					existeWidget: () => {
						return !this.donnees || !!this.donnees.registreAppel.liste;
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.previsionnelAbsServiceAnnexe:
				return {
					nomDonnees: "previsionnelAbsServiceAnnexe",
					genre: aGenreWidget,
					classWidget: MultipleWidgetPrevisionnelAbsServiceAnnexe
						? MultipleWidgetPrevisionnelAbsServiceAnnexe.WidgetPrevisionnelAbsServiceAnnexe
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.previsionnelAbsSP.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.previsionnelAbsSP.hint",
					),
					message: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							!!this.donnees.previsionnelAbsServiceAnnexe.services
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.DS:
				return {
					nomDonnees: "devoirSurveille",
					genre: Enumere_Widget_1.EGenreWidget.DS,
					classWidget: MultipleWidgetDS ? MultipleWidgetDS.WidgetDS : null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur("accueil.DS.titre"),
					hint: ObjetTraduction_1.GTraductions.getValeur("accueil.DS.hint"),
					existeWidget: () => {
						return (
							!this.donnees ||
							this.existeDS(Enumere_LienDS_1.EGenreLienDS.tGL_Devoir)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-resultat",
				};
			case Enumere_Widget_1.EGenreWidget.DSEvaluation:
				return {
					nomDonnees: "devoirSurveilleEvaluation",
					genre: Enumere_Widget_1.EGenreWidget.DSEvaluation,
					classWidget: MultipleWidgetDSEvaluation
						? MultipleWidgetDSEvaluation.WidgetDSEvaluation
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.DSEvaluation.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.DSEvaluation.hint",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							this.existeDS(Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-resultat",
				};
			case Enumere_Widget_1.EGenreWidget.EDT:
				return {
					nomDonnees: "EDT",
					genre: Enumere_Widget_1.EGenreWidget.EDT,
					classWidget: [
						Enumere_Espace_1.EGenreEspace.Parent,
						Enumere_Espace_1.EGenreEspace.Eleve,
						Enumere_Espace_1.EGenreEspace.Accompagnant,
						Enumere_Espace_1.EGenreEspace.Mobile_Parent,
						Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
						Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
						Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
					].includes(GEtatUtilisateur.GenreEspace)
						? WidgetEDTJournalier_1.WidgetEDTJournalier
						: MultipleWidgetEDT
							? MultipleWidgetEDT.WidgetEDT
							: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps },
					titreDansParametrage: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.emploiDuTemps",
					),
					existeWidget: () => {
						return !this.donnees || this.donnees.EDT.listeCours;
					},
					isCollapsible: false,
					maximise: true,
					semaineSelectionnee: this.numeroSemaineParDefaut,
					jourSelectionne: this.dateParDefaut,
					themeCategorie: "ThemeCat-edt",
				};
			case Enumere_Widget_1.EGenreWidget.elections:
				return {
					nomDonnees: "elections",
					genre: Enumere_Widget_1.EGenreWidget.elections,
					classWidget: WidgetElections_1.WidgetElections,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.elections.titre",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							(this.donnees.elections.listeElections &&
								this.donnees.elections.listeElections.count() > 0)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.voteElecMembreBureau:
				return {
					nomDonnees: "voteElecMembreBureau",
					genre: Enumere_Widget_1.EGenreWidget.voteElecMembreBureau,
					classWidget: MultipleWidgetVoteElecMembreBureau
						? MultipleWidgetVoteElecMembreBureau.WidgetVoteElecMembreBureau
						: null,
					id: GUID_1.GUID.getId(),
					titre: MultipleWidgetVoteElecMembreBureau
						? ObjetTraduction_1.GTraductions.getValeur(
								"WidgetVoteElecMembreBureau.titre",
							)
						: "",
					existeWidget: () => {
						return (
							!!this.donnees &&
							!!this.donnees.voteElecMembreBureau &&
							this.donnees.voteElecMembreBureau.listeOperationsEP &&
							this.donnees.voteElecMembreBureau.listeOperationsEP.count() > 0
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.voteElecElecteur:
				return {
					nomDonnees: "voteElecElecteur",
					genre: Enumere_Widget_1.EGenreWidget.voteElecElecteur,
					classWidget: MultipleWidgetVoteElecElecteur
						? MultipleWidgetVoteElecElecteur.WidgetVoteElecElecteur
						: null,
					id: GUID_1.GUID.getId(),
					titre: MultipleWidgetVoteElecElecteur
						? ObjetTraduction_1.GTraductions.getValeur(
								"WidgetVoteElecElecteur.titre",
							)
						: "",
					existeWidget: () => {
						return (
							!!this.donnees &&
							!!this.donnees.voteElecElecteur &&
							this.donnees.voteElecElecteur.listeOperationsEP &&
							this.donnees.voteElecElecteur.listeOperationsEP.count() > 0
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.enseignementADistance:
				return {
					nomDonnees: "enseignementADistance",
					genre: Enumere_Widget_1.EGenreWidget.enseignementADistance,
					classWidget: MultipleWidgetEnseignementADistance
						? MultipleWidgetEnseignementADistance.WidgetEnseignementADistance
						: null,
					id: GUID_1.GUID.getId(),
					titre: GEtatUtilisateur.estEspaceEleve()
						? ObjetTraduction_1.GTraductions.getValeur(
								"accueil.enseignementADistance.titre",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.enseignementADistance.titreParent",
							),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.enseignementADistance.info",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.enseignementADistance.actif;
					},
					isCollapsible: true,
					nbrItemsVisible: 3,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.exclusions:
				return {
					nomDonnees: "exclusions",
					genre: Enumere_Widget_1.EGenreWidget.exclusions,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetExclusions
						? MultipleWidgetExclusions.WidgetExclusions
						: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.exclusion.titre",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.exclusion.hint",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.exclusion.msgAucun",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.exclusions.listeExclusions;
					},
					isCollapsible: true,
					semaineSelectionnee: this.numeroSemaineParDefaut,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.incidents:
				return {
					nomDonnees: "incidents",
					genre: Enumere_Widget_1.EGenreWidget.incidents,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetIncidents
						? MultipleWidgetIncidents.WidgetIncidents
						: null,
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Incidents },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.incident.titre",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.incident.msgAucun",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.incidents.listeIncidents;
					},
					isCollapsible: false,
					semaineSelectionnee: this.numeroSemaineParDefaut,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.IntendanceExecute:
				return {
					nomDonnees: "intendanceExecute",
					genre: Enumere_Widget_1.EGenreWidget.IntendanceExecute,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetIntendance_Execute
						? MultipleWidgetIntendance_Execute.WidgetIntendanceExecute
						: null,
					titre:
						[
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Maintenance.TitreToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Maintenance.Titre",
								),
					hint: "",
					message:
						[
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Maintenance.MsgAucunToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Maintenance.MsgAucun",
								),
					existeWidget: () => {
						return (
							!this.donnees || !!this.donnees.intendanceExecute.listeLignes
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					page: {
						Onglet:
							Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesTravaux,
					},
					themeCategorie: "ThemeCat-edt",
				};
			case Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute:
				return {
					nomDonnees: "tachesSecretariatExecute",
					genre: Enumere_Widget_1.EGenreWidget.tachesSecretariatExecute,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetIntendance_Execute
						? MultipleWidgetIntendance_Execute.WidgetIntendanceExecute
						: null,
					titre:
						[
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Secretariat.TitreToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Secretariat.Titre",
								),
					hint: "",
					message:
						[
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Secretariat.MsgAucunToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.Secretariat.MsgAucun",
								),
					existeWidget: () => {
						return (
							(!this.donnees ||
								this.donnees.tachesSecretariatExecute.listeLignes) &&
							GEtatUtilisateur.GenreEspace !==
								Enumere_Espace_1.EGenreEspace.Professeur &&
							GEtatUtilisateur.GenreEspace !==
								Enumere_Espace_1.EGenreEspace.Mobile_Professeur
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					page: {
						Onglet: Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieSecretariat,
					},
					themeCategorie: "ThemeCat-edt",
				};
			case Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute:
				return {
					nomDonnees: "maintenanceInfoExecute",
					genre: Enumere_Widget_1.EGenreWidget.maintenanceInfoExecute,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetIntendance_Execute
						? MultipleWidgetIntendance_Execute.WidgetIntendanceExecute
						: null,
					titre:
						[
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.MaintenanceInfo.TitreToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.MaintenanceInfo.Titre",
								),
					hint: "",
					message:
						[
							Enumere_Espace_1.EGenreEspace.Administrateur,
							Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.MaintenanceInfo.MsgAucunToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.MaintenanceInfo.MsgAucun",
								),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(
								this.donnees.maintenanceInfoExecute &&
								this.donnees.maintenanceInfoExecute.listeLignes
							)
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					page: {
						Onglet:
							Enumere_Onglet_1.EGenreOnglet
								.Intendance_SaisieDemandesInformatique,
					},
					themeCategorie: "ThemeCat-edt",
				};
			case Enumere_Widget_1.EGenreWidget.kiosque:
				return {
					nomDonnees: "kiosque",
					genre: aGenreWidget,
					classWidget: MultipleWidgetKiosque
						? MultipleWidgetKiosque.WidgetKiosque
						: null,
					id: GUID_1.GUID.getId(),
					page: IE.estMobile
						? { Onglet: Enumere_Onglet_1.EGenreOnglet.ManuelsNumeriques }
						: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.kiosque.titre",
					),
					hint: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							(!!this.donnees.kiosque.listeRessources &&
								this.donnees.kiosque.listeRessources.count() > 0)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.lienUtile:
				return {
					nomDonnees: "lienUtile",
					genre: Enumere_Widget_1.EGenreWidget.lienUtile,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetLienUtile
						? MultipleWidgetLienUtile.WidgetLienUtile
						: null,
					titre:
						((_b =
							(_a = this.donnees) === null || _a === void 0
								? void 0
								: _a.lienUtile) === null || _b === void 0
							? void 0
							: _b.titre) || "",
					hint:
						((_d =
							(_c = this.donnees) === null || _c === void 0
								? void 0
								: _c.lienUtile) === null || _d === void 0
							? void 0
							: _d.titre) || "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.lienUtile.message",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							(this.donnees.lienUtile.listeLiens &&
								this.donnees.lienUtile.listeLiens.count() > 0)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.menuDeLaCantine:
				return {
					nomDonnees: "menuDeLaCantine",
					genre: Enumere_Widget_1.EGenreWidget.menuDeLaCantine,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetMenu
						? MultipleWidgetMenu.WidgetMenu
						: null,
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.Menus },
					titre: ObjetTraduction_1.GTraductions.getValeur("accueil.menu"),
					hint: ObjetTraduction_1.GTraductions.getValeur("accueil.info.menu"),
					message:
						ObjetTraduction_1.GTraductions.getValeur("accueil.pasDeMenu"),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.menuDeLaCantine.listeRepas;
					},
					isCollapsible: false,
					semaineSelectionnee: this.numeroSemaineParDefaut,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.notes:
				return {
					nomDonnees: "notes",
					genre: aGenreWidget,
					classWidget: MultipleWidgetNotes
						? MultipleWidgetNotes.WidgetNotes
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.DernieresNotes },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.dernieresNotes",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur("accueil.info.notes"),
					message:
						ObjetTraduction_1.GTraductions.getValeur("accueil.aucuneNote"),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.notes.listeDevoirs;
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-resultat",
				};
			case Enumere_Widget_1.EGenreWidget.partenaireAgate:
				return {
					nomDonnees: "partenaireAgate",
					genre: aGenreWidget,
					classWidget: MultipleWidgetPartenaireAgate
						? MultipleWidgetPartenaireAgate.WidgetPartenaireAgate
						: null,
					id: GUID_1.GUID.getId(),
					titreDansParametrage: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.agate.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.agate.msgAucun",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.partenaireAgate.listePrix;
					},
					isCollapsible: false,
					avecActualisation: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.partenaireARD:
				return {
					nomDonnees: "partenaireArd",
					genre: aGenreWidget,
					classWidget: MultipleWidgetPartenaireARD
						? MultipleWidgetPartenaireARD.WidgetPartenaireARD
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur("accueil.ard.titre"),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ard.msgAucun",
					),
					existeWidget: () => {
						return (
							this.donnees &&
							this.donnees.partenaireArd &&
							!!this.donnees.partenaireArd.porteMonnaie
						);
					},
					isCollapsible: false,
					avecActualisation: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.partenaireApplicam:
				return {
					nomDonnees: "partenaireApplicam",
					genre: aGenreWidget,
					classWidget: MultipleWidgetPartenaireApplicam
						? MultipleWidgetPartenaireApplicam.WidgetPartenaireApplicam
						: null,
					id: GUID_1.GUID.getId(),
					existeWidget: () => {
						return (
							this.donnees &&
							this.donnees.partenaireApplicam &&
							!!this.donnees.partenaireApplicam.libellePartenaire
						);
					},
					isCollapsible: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.partenaireCDI:
				return {
					nomDonnees: "partenaireCDI",
					genre: aGenreWidget,
					classWidget: MultipleWidgetPartenaireCDI
						? MultipleWidgetPartenaireCDI.WidgetPartenaireCDI
						: null,
					id: GUID_1.GUID.getId(),
					titreDansParametrage:
						ObjetTraduction_1.GTraductions.getValeur("accueil.CDI.titre"),
					hint: "",
					message: "",
					existeWidget: () => {
						return (
							!this.donnees ||
							(this.donnees.partenaireCDI.listeCDI &&
								this.donnees.partenaireCDI.listeCDI.count() > 0)
						);
					},
					isCollapsible: false,
					avecActualisation: true,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.penseBete:
				return {
					nomDonnees: "penseBete",
					genre: Enumere_Widget_1.EGenreWidget.penseBete,
					classWidget: MultipleWidgetPenseBete
						? MultipleWidgetPenseBete.WidgetPenseBete
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.penseBete.titre",
					),
					hint: "",
					message: "",
					themeCategorie: "ThemeCat-pense-bete",
				};
			case Enumere_Widget_1.EGenreWidget.personnelsAbsents:
				return {
					nomDonnees: "personnelsAbsents",
					genre: aGenreWidget,
					classWidget: MultipleWidgetPersonnelsAbsents
						? MultipleWidgetPersonnelsAbsents.WidgetPersonnelsAbsents
						: null,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.personnelsAbsents.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.personnelsAbsents.message",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!this.donnees.personnelsAbsents.listePersonnelsAbsents
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.Planning:
				return {
					genre: Enumere_Widget_1.EGenreWidget.Planning,
					classWidget: WidgetPlanningMultiple
						? WidgetPlanningMultiple.WidgetPlanning
						: null,
					id: GUID_1.GUID.getId(),
					titreDansParametrage:
						ObjetTraduction_1.GTraductions.getValeur("accueil.planning"),
					existeWidget: () => {
						return (
							this.donnees &&
							this.donnees.planning &&
							this.donnees.planning.listeRessourcesPlanning &&
							this.donnees.planning.listeRessourcesPlanning.count() > 0
						);
					},
					isCollapsible: false,
					maximise: true,
					themeCategorie: "ThemeCat-edt",
				};
			case Enumere_Widget_1.EGenreWidget.QCM:
				return {
					nomDonnees: "QCM",
					genre: Enumere_Widget_1.EGenreWidget.QCM,
					classWidget: MultipleWidgetQCM ? MultipleWidgetQCM.WidgetQCM : null,
					id: GUID_1.GUID.getId(),
					page: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.executionsQCM",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.info.executionsQCM",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.AucuneExecutionsQCM",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(
								this.donnees.QCM.listeExecutionsQCM &&
								this.donnees.QCM.listeExecutionsQCM.count()
							)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.ressources:
				return {
					nomDonnees: "ressources",
					genre: Enumere_Widget_1.EGenreWidget.ressources,
					id: GUID_1.GUID.getId(),
					page: null,
					titre: GEtatUtilisateur.existeGenreOnglet(
						Enumere_Onglet_1.EGenreOnglet.ProgrammesBO,
					)
						? ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.titreAvecBO",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"accueil.ressources.titreSansBO",
							),
					hint: "",
					existeWidget: () => {
						return (
							this.donnees &&
							this.donnees.ressources &&
							this.donnees.ressources.listeMatieres &&
							this.donnees.ressources.listeMatieres.count() > 0
						);
					},
					classWidget: MultipleWidgetRessources
						? MultipleWidgetRessources.WidgetRessources
						: null,
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.ressourcePedagogique:
				return {
					nomDonnees: "ressourcePedagogique",
					genre: aGenreWidget,
					classWidget: MultipleWidgetRessourcePedagogique
						? MultipleWidgetRessourcePedagogique.WidgetRessourcePedagogique
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.CDT_Contenu },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ressourcePedagogique.titre",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ressourcePedagogique.aucuneRessourcePedagogique",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.ressourcePedagogique.info",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!this.donnees.ressourcePedagogique.listeRessources
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.RetourEspace:
				return {
					nomDonnees: "retourEspace",
					genre: Enumere_Widget_1.EGenreWidget.RetourEspace,
					classWidget: WidgetRetourEspace_1.WidgetRetourEspace,
					id: GUID_1.GUID.getId(),
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"mobile.redirigeVersionMobile",
					),
					existeWidget: () => {
						return (
							window.location.search.search("redirect=1") > 0 &&
							(this.applicationSco.acces.estConnexionCAS() ||
								this.applicationSco.acces.estConnexionCookie()) &&
							!this.parametresSco.estAfficheDansENT &&
							GParametres.URLEspace &&
							GEtatUtilisateur.premierChargement
						);
					},
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.tableauDeBord:
				return {
					nomDonnees: "tableauDeBord",
					genre: Enumere_Widget_1.EGenreWidget.tableauDeBord,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.TableauDeBord },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.tableauDeBord.titre",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.tableauDeBord.aucunEleveAbsent",
					),
					classWidget: MultipleWidgetTableauDeBord
						? MultipleWidgetTableauDeBord.WidgetTableauDeBord
						: null,
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(this.donnees.tableauDeBord && this.donnees.tableauDeBord.date)
						);
					},
					maximise: true,
					isCollapsible: true,
					nbrItemsVisible: 3,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.travailAFaire:
				return {
					nomDonnees: "travailAFaire",
					genre: aGenreWidget,
					classWidget: MultipleWidgetTAF ? MultipleWidgetTAF.WidgetTAF : null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.CDT_TAF },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.TAFProchainsJours",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.info.travailAFaire",
					),
					message: ObjetTraduction_1.GTraductions.getValeur("accueil.aucunTAF"),
					existeWidget: () => {
						return (
							!this.etatUtilisateurSco.pourPrimaire() &&
							!!(!this.donnees || this.donnees.travailAFaire.listeTAF)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.TAFPrimaire:
				return {
					nomDonnees: "travailAFairePrimaire",
					genre: Enumere_Widget_1.EGenreWidget.TAFPrimaire,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.CDT_TAF },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.TAFProchainsJours",
					),
					message: ObjetTraduction_1.GTraductions.getValeur("accueil.aucunTAF"),
					classWidget: MultipleWidgetTAFPrimaire
						? MultipleWidgetTAFPrimaire.WidgetTAFPrimaire
						: null,
					existeWidget: () => {
						return (
							this.etatUtilisateurSco.pourPrimaire() &&
							!!this.donnees.travailAFaire &&
								!!this.donnees.travailAFaire.listeTAF &&
							!!this.donnees.travailAFaire.listeTAF.count()
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.TAFARendre:
				return {
					nomDonnees: "TAFARendre",
					genre: Enumere_Widget_1.EGenreWidget.TAFARendre,
					classWidget: MultipleWidgetTAFARendre
						? MultipleWidgetTAFARendre.WidgetTAFARendre
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.TAFARendre.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.TAFARendre.msgAucun",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.TAFARendre.listeTAF;
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.TAFEtActivites:
				return {
					nomDonnees: "TAFEtActivites",
					genre: Enumere_Widget_1.EGenreWidget.TAFEtActivites,
					classWidget: MultipleWidgetTAFEtActivites
						? MultipleWidgetTAFEtActivites.WidgetTAFEtActivites
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.SaisieTravailAFaire },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.TAFEtActivites.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.TAFEtActivites.msgAucun",
					),
					existeWidget: () => {
						return (
							!this.donnees ||
							(!!this.donnees.TAFEtActivites &&
								!!this.donnees.TAFEtActivites.listeTAFEtActivites)
						);
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-pedagogie",
				};
			case Enumere_Widget_1.EGenreWidget.vieScolaire:
				return {
					nomDonnees: "vieScolaire",
					genre: Enumere_Widget_1.EGenreWidget.vieScolaire,
					classWidget: MultipleWidgetVieScolaire
						? MultipleWidgetVieScolaire.WidgetVieScolaire
						: null,
					id: GUID_1.GUID.getId(),
					page: {
						Onglet: Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif,
					},
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.vieScolaire",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.info.viescolaire",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.aucuneAbsence",
					),
					existeWidget: () => {
						return !this.donnees || !!this.donnees.vieScolaire.listeAbsences;
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.absRetardsJustifiesParents:
				return {
					nomDonnees: "suiviJustifsARegler",
					genre: Enumere_Widget_1.EGenreWidget.absRetardsJustifiesParents,
					classWidget: MultipleWidgetAbsencesJustifieesParents
						? MultipleWidgetAbsencesJustifieesParents.WidgetAbsencesJustifieesParents
						: null,
					id: GUID_1.GUID.getId(),
					page: {
						Onglet:
							Enumere_Onglet_1.EGenreOnglet.SuiviJustificationsAbsencesRetards,
					},
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.absRetJustifieesParents.titre",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.absRetJustifieesParents.aucuneAbsRet",
					),
					existeWidget: () => {
						return true;
					},
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.evenementRappel:
				return {
					nomDonnees: "evenementsRappel",
					genre: Enumere_Widget_1.EGenreWidget.evenementRappel,
					classWidget: MultipleWidgetEvenementRappel
						? MultipleWidgetEvenementRappel.WidgetEvenementRappel
						: null,
					id: GUID_1.GUID.getId(),
					page: { Onglet: Enumere_Onglet_1.EGenreOnglet.CDT_TAF },
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.evenementRappel.titre",
					),
					existeWidget: () => {
						return (
							!!this.donnees &&
							!!this.donnees.evenementsRappel &&
							!!this.donnees.evenementsRappel.listeEvent &&
							this.donnees.evenementsRappel.listeEvent.count() > 0
						);
					},
					themeCategorie: "ThemeCat-pense-bete",
				};
			case Enumere_Widget_1.EGenreWidget.commandeExecute:
				return {
					nomDonnees: "commandeExecute",
					genre: Enumere_Widget_1.EGenreWidget.commandeExecute,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetIntendance_Execute
						? MultipleWidgetIntendance_Execute.WidgetIntendanceExecute
						: null,
					titre:
						[
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.commandeExecute.TitreToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.commandeExecute.Titre",
								),
					hint: "",
					message:
						[
							Enumere_Espace_1.EGenreEspace.PrimDirection,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						].includes(GEtatUtilisateur.GenreEspace) ||
						([
							Enumere_Espace_1.EGenreEspace.PrimProfesseur,
							Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						].includes(GEtatUtilisateur.GenreEspace) &&
							this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.estDirecteur,
							))
							? ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.commandeExecute.MsgAucunToutesDemandes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"TvxIntendance.Widget.commandeExecute.MsgAucun",
								),
					existeWidget: () => {
						return (
							!this.donnees ||
							!!(
								this.donnees.commandeExecute &&
								this.donnees.commandeExecute.listeLignes
							)
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 5,
					page: {
						Onglet: Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieCommandes,
					},
					themeCategorie: "theme-cat-edt",
				};
			case Enumere_Widget_1.EGenreWidget.partenaireFAST:
				return {
					nomDonnees: "partenaireFAST",
					genre: Enumere_Widget_1.EGenreWidget.partenaireFAST,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetPartenaireFAST
						? MultipleWidgetPartenaireFAST.WidgetPartenaireFAST
						: null,
					titre: ObjetTraduction_1.GTraductions.getValeur("accueil.FAST.titre"),
					hint: "",
					existeWidget: () => {
						const lDonneesWidget = this.donnees
							? this.donnees.partenaireFAST
							: null;
						if (lDonneesWidget) {
							const lAvecInscriptionsPeriscolaire =
								!!lDonneesWidget.avecInscriptionsPeriscolaire;
							const lAvecInscriptionsExtrascolaire =
								!!lDonneesWidget.avecInscriptionsExtrascolaire;
							const lAvecGestionServices = !!lDonneesWidget.avecGestionServices;
							const lAvecAccesFactures = !!lDonneesWidget.avecAccesFactures;
							return (
								lAvecInscriptionsPeriscolaire ||
								lAvecInscriptionsExtrascolaire ||
								lAvecGestionServices ||
								lAvecAccesFactures
							);
						}
						return false;
					},
					isCollapsible: false,
					themeCategorie: "ThemeCat-communication",
				};
			case Enumere_Widget_1.EGenreWidget.modificationEDT:
				return {
					nomDonnees: "modificationsEDT",
					genre: Enumere_Widget_1.EGenreWidget.modificationEDT,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetModificationEDT
						? MultipleWidgetModificationEDT.WidgetModificationEDT
						: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.modificationsEDT.titre",
					),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.modificationsEDT.messageAucuneDonnee",
					),
					existeWidget: () => {
						return true;
					},
					isCollapsible: true,
					nbrItemsVisible: 3,
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants:
				return {
					nomDonnees: "remplacementsenseignants",
					genre: Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetRemplacementsEnseignants
						? MultipleWidgetRemplacementsEnseignants.WidgetRemplacementsEnseignants
						: null,
					titre:
						TypeAffichageRemplacements_1.TypeAffichageRemplacementsUtil.getLibelle(
							TypeAffichageRemplacements_1.TypeAffichageRemplacements
								.tarPropositions,
						),
					hint: "",
					message: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.remplacementsenseignants.messageAucuneDonnee",
					),
					existeWidget: () => {
						return (
							this.donnees &&
							this.donnees.remplacementsenseignants &&
							!!this.donnees.remplacementsenseignants.listeRemplacements
						);
					},
					isCollapsible: true,
					nbrItemsVisible: 3,
					page: {
						Onglet: Enumere_Onglet_1.EGenreOnglet.RemplacementsEnseignants,
					},
					themeCategorie: "ThemeCat-viescolaire",
				};
			case Enumere_Widget_1.EGenreWidget.documentsASigner:
				return {
					nomDonnees: "documentsASigner",
					genre: Enumere_Widget_1.EGenreWidget.documentsASigner,
					id: GUID_1.GUID.getId(),
					classWidget: MultipleWidgetDocumentsASigner
						? MultipleWidgetDocumentsASigner.WidgetDocumentsASigner
						: null,
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.documentsASigner.titre",
					),
					titreDansParametrage: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.documentsASigner.titre",
					),
					existeWidget: () => {
						var _a, _b;
						return !!((_b =
							(_a = this.donnees) === null || _a === void 0
								? void 0
								: _a.documentsASigner) === null || _b === void 0
							? void 0
							: _b.nombreDocumentsDocumentsSignatures);
					},
				};
			default:
				break;
		}
	}
}
exports.ObjetMoteurAccueil = ObjetMoteurAccueil;
