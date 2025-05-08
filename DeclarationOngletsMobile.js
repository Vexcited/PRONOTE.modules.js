exports.DeclarationOngletsMobile = DeclarationOngletsMobile;
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const InterfacePageAccueilMobile = require("InterfacePageAccueilMobile");
const InterfacePageMenuOnglets = require("InterfacePageMenuOnglets");
const InterfacePageEmploiDuTemps_Journalier_1 = require("InterfacePageEmploiDuTemps_Journalier");
const InterfacePageCahierDeTextePP_Mobile = require("InterfacePageCahierDeTextePP_Mobile");
const InterfacePageCahierDeTexte_Mobile_1 = require("InterfacePageCahierDeTexte_Mobile");
const InterfaceManuelsNumeriques_Mobile = require("InterfaceManuelsNumeriques_Mobile");
const InterfacePageBulletin = require("InterfacePageBulletin");
const InterfacePageEquipePedagogique_Mobile = require("InterfacePageEquipePedagogique_Mobile");
const InterfacePageReleveDeNotes = require("InterfacePageReleveDeNotes");
const InterfacePageMenus_Mobile = require("InterfacePageMenus_Mobile");
const InterfaceFeuilleAppel = require("InterfaceFeuilleAppel");
const MultipleInterfaceIntendanceDemandesTravaux = require("InterfaceIntendanceDemandesTravaux_Mobile.js");
const InterfacePageQCM = require("InterfacePageQCM");
const MultipleInterfacePageInfoSondagePN = require("InterfacePageInfoSondagePN");
const MultipleInterfaceCasier = require("InterfaceCasier");
const InterfacePageMessagerie_Mobile_1 = require("InterfacePageMessagerie_Mobile");
const InterfaceTrombi_Mobile = require("InterfaceTrombi_Mobile");
const InterfacePageParametres_1 = require("InterfacePageParametres");
const InterfacePageCompteEnfants_1 = require("InterfacePageCompteEnfants");
const InterfacePageCompte_1 = require("InterfacePageCompte");
const InterfacePageAgendaMobile = require("InterfacePageAgendaMobile");
const InterfacePageVacancesMobile = require("InterfacePageVacancesMobile");
const InterfacePageRencontres = require("InterfacePageRencontres");
const InterfacePageDernieresNotes = require("InterfacePageDernieresNotes");
const InterfacePageDernieresEvaluations_Mobile = require("InterfacePageDernieresEvaluations_Mobile");
const MultipleInterfaceRecapitulatifVS_Mobile = require("InterfaceRecapitulatifVS_Mobile");
const InterfacePageBulletinCompetences = require("InterfacePageBulletinCompetences");
const MultipleInterfaceBulletinBIA = require("InterfaceBulletinBIA");
const MultipleInterfaceDocumentsATelecharger = require("InterfaceDocumentsATelecharger");
const InterfacePageIncidents_Mobile = require("InterfacePageIncidents_Mobile");
const InterfaceTableauDeBordMobile = require("InterfaceTableauDeBordMobile");
const InterfacePageNotesMobile = require("InterfacePageNotesMobile");
const InterfacePageOrientation = require("InterfacePageOrientation");
const InterfacePageSaisieCahierDeTextesMobile = require("InterfacePageSaisieCahierDeTextesMobile");
const InterfaceBlogFilActu_1 = require("InterfaceBlogFilActu");
const MultipleInterfaceBlog_Mediatheque = require("InterfaceBlog_Mediatheque");
const MultipleInterfaceSaisieTAF = require("InterfaceSaisieTAF");
const MultipleInterfaceInscriptionsPeriscolaires = require("InterfaceInscriptionsPeriscolaires");
const MultipleInterfaceCarnetDeSuivi = require("InterfaceCarnetDeSuivi");
const InterfaceFicheStage_Mobile = require("InterfaceFicheStage_Mobile");
const MultipleInterfaceSaisieAppelPeriscolaire = require("InterfaceSaisieAppelPeriscolaire");
const MultipleInterfaceListeEntreprises = require("InterfaceListeEntreprise");
const InterfacePageParametresEnfants_1 = require("InterfacePageParametresEnfants");
const InterfaceForumPedagogique_Mobile_1 = require("InterfaceForumPedagogique_Mobile");
const MultipleInterfaceRessourcePedagogiquePP_Mobile = require("InterfaceRessourcePedagogiquePP_Mobile");
const MultipleInterfaceListeDiffusion = require("InterfaceListeDiffusion");
const InterfacePageRemplacements_Mobile = require("InterfacePageRemplacements_Mobile");
const MultipleInterfaceRDV = require("InterfaceRDV");
const MultipleInterfaceRemplacementsEnseignants = require("InterfaceRemplacementsEnseignants");
const MultipleInterfaceSaisieAppelInternat = require("InterfaceSaisieAppelInternat");
function DeclarationOngletsMobile() {}
DeclarationOngletsMobile.creerOnglet = function (
  aGenreOnglet,
  aParamsConstructeur,
) {
  switch (aGenreOnglet) {
    case Enumere_Onglet_1.EGenreOnglet.Accueil:
      return new InterfacePageAccueilMobile(aParamsConstructeur);
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
        ? new InterfacePageCahierDeTextePP_Mobile(aParamsConstructeur)
        : new InterfacePageCahierDeTexte_Mobile_1.InterfacePageCahierDeTexte_Mobile(
            aParamsConstructeur,
          );
    case Enumere_Onglet_1.EGenreOnglet.CDT_Contenu:
      return new InterfacePageCahierDeTexte_Mobile_1.InterfacePageCahierDeTexte_Mobile(
        aParamsConstructeur,
      );
    case Enumere_Onglet_1.EGenreOnglet.ManuelsNumeriques:
      return new InterfaceManuelsNumeriques_Mobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse:
    case Enumere_Onglet_1.EGenreOnglet.Bulletins:
      return new InterfacePageBulletin(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.EquipePedagogique:
      return new InterfacePageEquipePedagogique_Mobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.Releve:
      return new InterfacePageReleveDeNotes(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.Menus:
      return new InterfacePageMenus_Mobile.ObjetAffichagePageMenus_Mobile(
        aParamsConstructeur,
      );
    case Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_AppelEtSuivi:
      return new InterfaceFeuilleAppel(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.QCM_Reponse:
      return new InterfacePageQCM(aParamsConstructeur);
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
      return new InterfaceTrombi_Mobile(aParamsConstructeur);
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
      return new InterfacePageAgendaMobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.Vacances:
      return new InterfacePageVacancesMobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.Rencontre:
      return new InterfacePageRencontres(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.DernieresNotes:
      return new InterfacePageDernieresNotes(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.DernieresEvaluations:
      return new InterfacePageDernieresEvaluations_Mobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.VieScolaire_Recapitulatif:
      return new MultipleInterfaceRecapitulatifVS_Mobile.InterfaceRecapitulatifVS_Mobile(
        aParamsConstructeur,
      );
    case Enumere_Onglet_1.EGenreOnglet.ReleveDeCompetences:
    case Enumere_Onglet_1.EGenreOnglet.BulletinCompetences:
      return new InterfacePageBulletinCompetences(aParamsConstructeur);
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
      return new InterfacePageIncidents_Mobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.TableauDeBord:
      return new InterfaceTableauDeBordMobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.SaisieNotes:
      return new InterfacePageNotesMobile(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.SaisieOrientation:
      return new InterfacePageOrientation(aParamsConstructeur);
    case Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes:
      return new InterfacePageSaisieCahierDeTextesMobile(aParamsConstructeur);
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
      return new InterfaceFicheStage_Mobile(aParamsConstructeur);
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
      return new InterfacePageRemplacements_Mobile(aParamsConstructeur);
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
    default:
      return null;
  }
};
