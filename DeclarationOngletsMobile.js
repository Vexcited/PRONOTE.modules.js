exports.DeclarationOngletsMobile = DeclarationOngletsMobile;
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const MultiInterfacePageAccueilMobile = require("InterfacePageAccueilMobile");
const InterfacePageMenuOnglets = require("InterfacePageMenuOnglets");
const InterfacePageEmploiDuTemps_Journalier_1 = require("InterfacePageEmploiDuTemps_Journalier");
const MultiInterfacePageCahierDeTextePP_Mobile = require("InterfacePageCahierDeTextePP_Mobile");
const InterfacePageCahierDeTexte_Mobile_1 = require("InterfacePageCahierDeTexte_Mobile");
const MultiInterfaceManuelsNumeriques_Mobile = require("InterfaceManuelsNumeriques_Mobile");
const InterfacePageBulletin = require("InterfacePageBulletin");
const MultiInterfacePageEquipePedagogique_Mobile = require("InterfacePageEquipePedagogique_Mobile");
const MultiInterfacePageReleveDeNotes = require("InterfacePageReleveDeNotes");
const InterfacePageMenus_Mobile = require("InterfacePageMenus_Mobile");
const MultiInterfaceFeuilleAppel = require("InterfaceFeuilleAppel");
const MultipleInterfaceIntendanceDemandesTravaux = require("InterfaceIntendanceDemandesTravaux_Mobile.js");
const MultiInterfacePageQCM = require("InterfacePageQCM");
const MultipleInterfacePageInfoSondagePN = require("InterfacePageInfoSondagePN");
const MultipleInterfaceCasier = require("InterfaceCasier");
const InterfacePageMessagerie_Mobile_1 = require("InterfacePageMessagerie_Mobile");
const MultiInterfaceTrombi_Mobile = require("InterfaceTrombi_Mobile");
const InterfacePageParametres_1 = require("InterfacePageParametres");
const InterfacePageCompteEnfants_1 = require("InterfacePageCompteEnfants");
const InterfacePageCompte_1 = require("InterfacePageCompte");
const MultipleInterfacePageAgendaMobile = require("InterfacePageAgendaMobile");
const MultiInterfacePageRencontres = require("InterfacePageRencontres");
const MultiInterfacePageDernieresNotes = require("InterfacePageDernieresNotes");
const MultiInterfacePageDernieresEvaluations_Mobile = require("InterfacePageDernieresEvaluations_Mobile");
const MultipleInterfaceRecapitulatifVS_Mobile = require("InterfaceRecapitulatifVS_Mobile");
const MultipleInterfacePageBulletinCompetences = require("InterfacePageBulletinCompetences");
const MultipleInterfaceBulletinBIA = require("InterfaceBulletinBIA");
const MultipleInterfaceDocumentsATelecharger = require("InterfaceDocumentsATelecharger");
const MultiInterfacePageIncidents_Mobile = require("InterfacePageIncidents_Mobile");
const MultipleInterfaceTableauDeBordMobile = require("InterfaceTableauDeBordMobile");
const MultiInterfacePageNotesMobile = require("InterfacePageNotesMobile");
const MultiInterfacePageOrientation = require("InterfaceOrientation");
const MultipleInterfacePageSaisieCahierDeTextesMobile = require("InterfacePageSaisieCahierDeTextesMobile");
const InterfaceBlogFilActu_1 = require("InterfaceBlogFilActu");
const MultipleInterfaceBlog_Mediatheque = require("InterfaceBlog_Mediatheque");
const MultipleInterfaceSaisieTAF = require("InterfaceSaisieTAF");
const MultipleInterfaceInscriptionsPeriscolaires = require("InterfaceInscriptionsPeriscolaires");
const MultipleInterfaceCarnetDeSuivi = require("InterfaceCarnetDeSuivi");
const InterfaceFicheStage_Mobile_1 = require("InterfaceFicheStage_Mobile");
const MultipleInterfaceSaisieAppelPeriscolaire = require("InterfaceSaisieAppelPeriscolaire");
const MultipleInterfaceListeEntreprises = require("InterfaceListeEntreprise");
const InterfacePageParametresEnfants_1 = require("InterfacePageParametresEnfants");
const InterfaceForumPedagogique_Mobile_1 = require("InterfaceForumPedagogique_Mobile");
const MultipleInterfaceRessourcePedagogiquePP_Mobile = require("InterfaceRessourcePedagogiquePP_Mobile");
const MultipleInterfaceListeDiffusion = require("InterfaceListeDiffusion");
const MultipleInterfacePageRemplacements_Mobile = require("InterfacePageRemplacements_Mobile");
const MultipleInterfaceRDV = require("InterfaceRDV");
const MultipleInterfaceRemplacementsEnseignants = require("InterfaceRemplacementsEnseignants");
const MultipleInterfaceSaisieAppelInternat = require("InterfaceSaisieAppelInternat");
const MultipleInterfaceRechercheDeStage = require("InterfaceRechercheDeStage");
const MultipleInterfacePageEntreprise = require("InterfacePageEntreprise");
const MultiplePageSaisieOffresStagesPN = require("PageSaisieOffresStagesPN");
function DeclarationOngletsMobile() {}
DeclarationOngletsMobile.creerOnglet = function (
	aGenreOnglet,
	aParamsConstructeur,
) {
	switch (aGenreOnglet) {
		case Enumere_Onglet_1.EGenreOnglet.Accueil:
			return new MultiInterfacePageAccueilMobile.InterfacePageAccueilMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.MenuOnglets:
			return new InterfacePageMenuOnglets(aParamsConstructeur);
		case Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps:
		case Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsEleve:
		case Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse:
			return new InterfacePageEmploiDuTemps_Journalier_1.ObjetAffichagePageEmploiDuTemps_Journalier(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.CDT_TAF:
			return GEtatUtilisateur.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Mobile_PrimEleve ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_PrimParent ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant
				? new MultiInterfacePageCahierDeTextePP_Mobile.InterfacePageCahierDeTextePP_Mobile(
						aParamsConstructeur,
					)
				: new InterfacePageCahierDeTexte_Mobile_1.InterfacePageCahierDeTexte_Mobile(
						aParamsConstructeur,
					);
		case Enumere_Onglet_1.EGenreOnglet.CDT_Contenu:
			return new InterfacePageCahierDeTexte_Mobile_1.InterfacePageCahierDeTexte_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ManuelsNumeriques:
			return new MultiInterfaceManuelsNumeriques_Mobile.InterfaceManuelsNumeriques_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse:
		case Enumere_Onglet_1.EGenreOnglet.Bulletins:
			return new InterfacePageBulletin(aParamsConstructeur);
		case Enumere_Onglet_1.EGenreOnglet.EquipePedagogique:
			return new MultiInterfacePageEquipePedagogique_Mobile.InterfacePageEquipePedagogique_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Releve:
			return new MultiInterfacePageReleveDeNotes.InterfacePageReleveDeNotes(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Menus:
			return new InterfacePageMenus_Mobile.ObjetAffichagePageMenus_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi:
			return new MultiInterfaceFeuilleAppel.InterfaceFeuilleAppel(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.QCM_Reponse:
			return new MultiInterfacePageQCM.InterfacePageQCM(aParamsConstructeur);
		case Enumere_Onglet_1.EGenreOnglet.Informations:
			return new MultipleInterfacePageInfoSondagePN.InterfacePageInfoSondagePN(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.RDV:
			return new MultipleInterfaceRDV.InterfaceRDV(aParamsConstructeur);
		case Enumere_Onglet_1.EGenreOnglet.Casier_MonCasier:
			return new MultipleInterfaceCasier.InterfaceCasier(aParamsConstructeur);
		case Enumere_Onglet_1.EGenreOnglet.Messagerie:
			return new InterfacePageMessagerie_Mobile_1.InterfacePageMessagerie_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ListeEleves:
			return new MultiInterfaceTrombi_Mobile.ObjetAffichagePageTrombi_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ParametresUtilisateur:
			return new InterfacePageParametres_1.ObjetAffichagePageParametres_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.InfosEnfant_Prim:
			return new InterfacePageCompteEnfants_1.InterfacePageCompteEnfantsMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.InfosPerso:
			return new InterfacePageCompte_1.InterfacePageCompteMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Agenda:
			return new MultipleInterfacePageAgendaMobile.InterfacePageAgendaMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Rencontre:
			return new MultiInterfacePageRencontres.InterfacePageRencontres(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.DernieresNotes:
			return new MultiInterfacePageDernieresNotes.InterfacePageDernieresNotes(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.DernieresEvaluations:
			return new MultiInterfacePageDernieresEvaluations_Mobile.InterfacePageDernieresEvaluations_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif:
			return new MultipleInterfaceRecapitulatifVS_Mobile.InterfaceRecapitulatifVS_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences:
		case Enumere_Onglet_1.EGenreOnglet.BulletinCompetences:
			return new MultipleInterfacePageBulletinCompetences.InterfacePageBulletinCompetences(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Note:
		case Enumere_Onglet_1.EGenreOnglet.BulletinAnneesPrec_Competence:
			return new MultipleInterfaceBulletinBIA.InterfaceBulletinBIA(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.DocumentsATelecharger:
			return new MultipleInterfaceDocumentsATelecharger.InterfaceDocumentsATelecharger(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Incidents:
			return new MultiInterfacePageIncidents_Mobile.InterfacePageIncidents_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.TableauDeBord:
			return new MultipleInterfaceTableauDeBordMobile.InterfaceTableauDeBordMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieNotes:
			return new MultiInterfacePageNotesMobile.InterfacePageNotesMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieOrientation:
			return new MultiInterfacePageOrientation.InterfaceOrientation(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes:
			return new MultipleInterfacePageSaisieCahierDeTextesMobile.ObjetAffichagePageSaisieCahierDeTextes(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Blog_FilActu:
			return new InterfaceBlogFilActu_1.InterfaceBlogFilActu(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Blog_Mediatheque:
			return new MultipleInterfaceBlog_Mediatheque.InterfaceBlog_Mediatheque(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieTravailAFaire:
			return new MultipleInterfaceSaisieTAF.InterfaceSaisieTAF(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Inscriptions:
			return new MultipleInterfaceInscriptionsPeriscolaires.InterfaceInscriptionsPeriscolaires(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.CarnetDeSuivi:
			return new MultipleInterfaceCarnetDeSuivi.InterfaceCarnetDeSuivi(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationDeFinDeStage:
			return new InterfaceFicheStage_Mobile_1.InterfaceFicheStage_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppelPeriScolaire:
			return new MultipleInterfaceSaisieAppelPeriscolaire.InterfaceSaisieAppelPeriscolaire(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.OffresStage:
			return new MultipleInterfaceListeEntreprises.InterfaceListeEntreprises(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.CompteEleve:
			return new InterfacePageParametresEnfants_1.InterfacePageParametresEnfantsMobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ForumPedagogique:
			return new InterfaceForumPedagogique_Mobile_1.InterfaceForumPedagogique_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.RessourcePedagogique:
			return new MultipleInterfaceRessourcePedagogiquePP_Mobile.InterfaceRessourcePedagogiquePP_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.ListeDiffusion:
			return new MultipleInterfaceListeDiffusion.InterfaceListeDiffusion(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Remplacements_Grille:
			return new MultipleInterfacePageRemplacements_Mobile.InterfacePageRemplacements_Mobile(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesTravaux:
		case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieSecretariat:
		case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieDemandesInformatique:
		case Enumere_Onglet_1.EGenreOnglet.Intendance_SaisieCommandes:
			return new MultipleInterfaceIntendanceDemandesTravaux.InterfaceIntendanceDemandesTravaux(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.RemplacementsEnseignants:
			return new MultipleInterfaceRemplacementsEnseignants.InterfaceRemplacementsEnseignants(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppelInternat:
			return new MultipleInterfaceSaisieAppelInternat.InterfaceSaisieAppelInternat(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.RechercheDeStage:
			return new MultipleInterfaceRechercheDeStage.InterfaceRechercheDeStage(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.Entreprise:
			return new MultipleInterfacePageEntreprise.InterfacePageEntreprise(
				aParamsConstructeur,
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieOffresStage:
			return new MultiplePageSaisieOffresStagesPN.PageSaisieOffresStagesPN(
				aParamsConstructeur,
			);
		default:
			return null;
	}
};
