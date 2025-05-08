const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
class DonneesListeTypesAccesInfoSond extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees) {
    super(aDonnees);
  }
  getIconeGaucheContenuFormate(aParams) {
    return aParams.article.icone;
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getZoneComplementaire(aParams) {
    const lCmp = aParams.article.compteur;
    return lCmp !== null && lCmp !== undefined && lCmp > 0
      ? '<div class="compteur Gras">' + lCmp + "</div>"
      : "";
  }
  avecSeparateurLigneHautFlatdesign(aParamsCellule, aParamsCellulePrec) {
    return (
      super.avecSeparateurLigneHautFlatdesign(
        aParamsCellule,
        aParamsCellulePrec,
      ) &&
      aParamsCellule.article &&
      aParamsCellule.article.estAvecSeparateurHaut
    );
  }
}
module.exports = { DonneesListeTypesAccesInfoSond };
