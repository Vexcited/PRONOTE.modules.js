const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEvnt } = require("UtilitaireOrientation.js");
class DonneesListe_RessourceOrientation extends ObjetDonneesListeFlatDesign {
  constructor(aParam) {
    super(aParam.listeRessources);
    this.genreRessource = aParam.genre;
    this.estNiveauPremiere = aParam.estNiveauPremiere;
    this.avecFiltreNiveau = aParam.avecFiltreNiveau;
    this.estMultiNiveau = aParam.estMultiNiveau;
    this.afficherPicto = aParam.afficherPicto;
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
      avecDeploiement: true,
      avecTri: false,
      avecBoutonActionLigne: false,
      flatDesignMinimal: true,
      avecEllipsis: false,
    });
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getSousTitre(aParams) {
    if (
      this.estMultiNiveau &&
      !!aParams.article.niveau &&
      !!aParams.article.niveau.getLibelle()
    ) {
      return aParams.article.niveau.getLibelle();
    }
  }
  getZoneGauche(aParams) {
    return aParams.article.estUnDeploiement || !this.afficherPicto
      ? ""
      : this.getPictoEtablissement(aParams);
  }
  getCouleurCellule(aParams) {
    return aParams.article.getGenre() === undefined &&
      this.genreRessource === EGenreEvnt.orientation
      ? ObjetDonneesListe.ECouleurCellule.Fixe
      : ObjetDonneesListe.ECouleurCellule.Blanc;
  }
  avecEdition() {
    return false;
  }
  avecSelection() {
    return false;
  }
  avecEvenementEdition() {
    return false;
  }
  avecEvenementSelection(aParams) {
    return (
      aParams.article.getGenre() !== undefined ||
      this.genreRessource !== EGenreEvnt.orientation
    );
  }
  avecDeploiementSurColonne(aParams) {
    return aParams.article.estUnDeploiement;
  }
  getVisible(D) {
    if (
      !this.estNiveauPremiere ||
      this.genreRessource !== EGenreEvnt.specialite
    ) {
      return true;
    }
    let lVisible = true;
    if (this.avecFiltreNiveau && !D.estSpecialiteAnneePrecedente) {
      lVisible = false;
    }
    return lVisible;
  }
  getPictoEtablissement(aParams) {
    const lHtml = [];
    const lLettre = aParams.article.horsEtablissement
      ? GTraductions.getValeur("Orientation.Ressources.LettreHorsEtablissement")
      : GTraductions.getValeur("Orientation.Ressources.LettreEtablissement");
    const lTitle = aParams.article.horsEtablissement
      ? GTraductions.getValeur("Orientation.Ressources.DispoHorsEtablissement")
      : GTraductions.getValeur("Orientation.Ressources.DispoEtablissement");
    const lClass = aParams.article.horsEtablissement
      ? "IPO_LettreHorsEtablissement"
      : "IPO_LettreEtablissement";
    lHtml.push(
      `<div class="Gras IPO_Lettre ${lClass}" title="${lTitle}"><span>${lLettre}</span></div>`,
    );
    return lHtml.join(" ");
  }
  setFiltreNiveau(aAvecFiltre) {
    return (this.avecFiltreNiveau = aAvecFiltre);
  }
}
DonneesListe_RessourceOrientation.colonnes = { libelle: "libellle" };
module.exports = { DonneesListe_RessourceOrientation };
