const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_FicheBrevetCompetence extends ObjetDonneesListe {
  constructor(aCompetences, aParam) {
    super(aCompetences.listePiliers);
    this.competences = aCompetences;
    this.callbackMenuContextuel = aParam.callBackMenuContextuel;
    this.setOptions({ avecSuppression: false, editionApresSelection: false });
  }
  avecSelection() {
    return !GEtatUtilisateur.estEspacePourEleve();
  }
  avecEdition(aParams) {
    if (
      aParams.idColonne === DonneesListe_FicheBrevetCompetence.colonnes.maitrise
    ) {
      return !!aParams.article.avecEdition;
    }
    return false;
  }
  avecEvenementEdition(aParams) {
    return (
      aParams.idColonne ===
        DonneesListe_FicheBrevetCompetence.colonnes.maitrise &&
      aParams.article.avecEdition
    );
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_FicheBrevetCompetence.colonnes.competences:
        return aParams.article.getLibelle();
      case DonneesListe_FicheBrevetCompetence.colonnes.maitrise:
        return aParams.article.niveauDAcquisition.getLibelle();
      case DonneesListe_FicheBrevetCompetence.colonnes.points:
        return aParams.article.points.getNoteEntier();
      case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
        return aParams.article.bareme.getNoteEntier();
    }
    return "";
  }
  getContenuTotal(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_FicheBrevetCompetence.colonnes.competences:
        return GTraductions.getValeur("FicheBrevet.TotalDesPoints");
      case DonneesListe_FicheBrevetCompetence.colonnes.points:
        return this.competences.totalPoints.getNoteEntier();
      case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
        return this.competences.totalBareme.getNoteEntier();
    }
    return "";
  }
  getClassTotal(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_FicheBrevetCompetence.colonnes.points:
      case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
        lClasses.push("AlignementDroit");
        break;
    }
    return lClasses.join(" ");
  }
  getClass(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_FicheBrevetCompetence.colonnes.points:
      case DonneesListe_FicheBrevetCompetence.colonnes.bareme:
        lClasses.push("AlignementDroit");
        break;
    }
    return lClasses.join(" ");
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    aParametres.menuContextuel.setOptions({
      largeurMin: 150,
      largeurColonneGauche: 30,
    });
    const lListe = TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu({
      genreChoixValidationCompetence:
        TypeGenreValidationCompetence.tGVC_Competence,
      avecDispense: aParametres.article.estPilierLVE,
    });
    if (lListe) {
      lListe.parcourir((aElement) => {
        if (aElement.existe()) {
          aParametres.menuContextuel.add(
            aElement.tableauLibelles || aElement.getLibelle(),
            aElement.actif !== false &&
              !!aParametres.article &&
              !!aParametres.article.avecEdition,
            () => {
              this.callbackMenuContextuel(aElement, aParametres.ligne);
            },
            {
              image: aElement.image,
              imageFormate: true,
              largeurImage: aElement.largeurImage,
            },
          );
        }
      });
      aParametres.menuContextuel.setDonnees();
    }
  }
}
DonneesListe_FicheBrevetCompetence.colonnes = {
  competences: "FicheBrevetCompetence",
  maitrise: "FicheBrevetCompetenceMaitrise",
  points: "FicheBrevetCompetencePoints",
  bareme: "FicheBrevetCompetenceBareme",
};
module.exports = { DonneesListe_FicheBrevetCompetence };
