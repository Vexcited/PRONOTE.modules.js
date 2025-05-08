const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GStyle } = require("ObjetStyle.js");
class DonneesListe_ServicesEvaluationsPrim extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      hauteurMinCellule: 37,
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
      avecTri: false,
      avecDeselectionSurNonSelectionnable: false,
    });
  }
  getTypeValeur() {
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ServicesEvaluationsPrim.colonnes.libelle: {
        const lLibelle = [];
        if (aParams.article.couleur) {
          const lBorder =
            aParams.article.cumul > 1
              ? "border-radius:6px;"
              : "border-radius:6px 0 0 6px;";
          const lHeight = aParams.article.cumul > 1 ? 6 : 25;
          lLibelle.push(
            '<div style="display:flex; align-items:center;">',
            '<div style="',
            GStyle.composeHeight(lHeight),
            "min-width:6px; margin-right: 3px; " +
              GStyle.composeCouleurFond(aParams.article.couleur),
            lBorder,
            '"></div>',
            "<div >",
            aParams.article.getLibelle(),
            "</div>",
            "</div>",
          );
        } else {
          lLibelle.push(aParams.article.getLibelle());
        }
        return lLibelle.join("");
      }
      case DonneesListe_ServicesEvaluationsPrim.colonnes.classeGroupe: {
        const H = [];
        if (aParams.article.groupe && aParams.article.groupe.getLibelle()) {
          H.push(aParams.article.groupe.getLibelle());
        } else if (aParams.article.classe) {
          H.push(aParams.article.classe.getLibelle());
        }
        return H.join("");
      }
    }
    return "";
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    if (this.avecSelection(aParams)) {
      lClasses.push("AvecMain");
    }
    return lClasses.join(" ");
  }
  getIndentationCellule(aParams) {
    return (
      ((aParams.article.cumul || 1) - 1) * this.options.indentationCelluleEnfant
    );
  }
  avecAlternanceCouleurLigne(aParamsCellule) {
    return aParamsCellule.article.cumul === 1;
  }
}
DonneesListe_ServicesEvaluationsPrim.colonnes = {
  libelle: "libelle",
  classeGroupe: "classeGroupe",
};
module.exports = { DonneesListe_ServicesEvaluationsPrim };
