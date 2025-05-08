const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GChaine } = require("ObjetChaine.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { tag } = require("tag.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_Trombi extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecSelection: true,
      avecSuppression: false,
      avecEvnt_ApresEdition: false,
      avecEvnt_SelectionClick: true,
      avecTri: false,
      avecBoutonActionLigne: false,
      flatDesignMinimal: false,
    });
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getZoneGauche(aParams) {
    const H = [];
    H.push(this.composePhoto(aParams.article));
    return H.join("");
  }
  composePhoto(aEleve) {
    const lHtml = [];
    let lAvecPhoto =
      !!aEleve &&
      GApplication.droits.get(TypeDroits.eleves.consulterPhotosEleves);
    lHtml.push(
      tag(
        "figure",
        { class: "identite-vignette" },
        tag("img", {
          "ie-load-src": lAvecPhoto
            ? GChaine.creerUrlBruteLienExterne(aEleve, { libelle: "photo.jpg" })
            : false,
          "ie-imgviewer": true,
          class: "img-portrait",
          "aria-hidden": "true",
        }),
      ),
    );
    return lHtml.join("");
  }
  getTotal(aEstHeader) {
    if (aEstHeader) {
      const lNbLignes = this.Donnees.count();
      let lTitre = GTraductions.getValeur("Eleve");
      if (lNbLignes) {
        lTitre =
          lNbLignes +
          " " +
          GTraductions.getValeur(
            lNbLignes > 1 ? "Etudiants" : "Etudiant",
          ).toLowerCase();
      }
      return { html: lTitre, avecEtiquette: false };
    }
  }
}
module.exports = { DonneesListe_Trombi };
