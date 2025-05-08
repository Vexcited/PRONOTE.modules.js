exports.GTableau = void 0;
const ObjetStyle_1 = require("ObjetStyle");
exports.GTableau = {
  _getCouleur() {
    return GCouleur.liste;
  },
  _styleCouleur(
    aCouleur,
    aPourImpression,
    aAvecCadre,
    aGenreBordure,
    aCouleurTexte = "",
  ) {
    aAvecCadre =
      aAvecCadre === null || aAvecCadre === undefined ? true : aAvecCadre;
    if (aCouleur) {
      const lCouleurFond = aCouleur.getFond(aPourImpression);
      const lCouleurTexte = aCouleurTexte
        ? aCouleurTexte
        : aCouleur.getTexte(aPourImpression);
      const lCouleurBordure = aCouleur.getBordure(aPourImpression);
      if (aAvecCadre) {
        if (aGenreBordure) {
          return (
            ObjetStyle_1.GStyle.composeCouleur(lCouleurFond, lCouleurTexte) +
            " " +
            ObjetStyle_1.GStyle.composeCouleurBordure(
              lCouleurBordure,
              1,
              aGenreBordure,
            )
          );
        } else {
          return (
            ObjetStyle_1.GStyle.composeCouleur(lCouleurFond, lCouleurTexte) +
            " " +
            ObjetStyle_1.GStyle.composeCouleurBordure(lCouleurBordure, 1)
          );
        }
      }
      return ObjetStyle_1.GStyle.composeCouleur(lCouleurFond, lCouleurTexte);
    } else {
      return "";
    }
  },
  styleTableau(aPourImpression, aAvecCadre, aGenreBordure = 0) {
    const lCouleurBordure = aPourImpression
      ? GCouleur.noir
      : this._getCouleur().bordure;
    if (aAvecCadre) {
      if (aGenreBordure) {
        return ObjetStyle_1.GStyle.composeCouleurBordure(
          lCouleurBordure,
          1,
          aGenreBordure,
        );
      } else {
        return ObjetStyle_1.GStyle.composeCouleurBordure(lCouleurBordure);
      }
    }
    return "";
  },
  styleTitre(aPourImpression, aAvecCadre, aGenreBordure, aCouleurTexte) {
    return this._styleCouleur(
      null,
      aPourImpression,
      aAvecCadre,
      aGenreBordure,
      aCouleurTexte,
    );
  },
  styleColonneFixe(aPourImpression, aAvecCadre, aGenreBordure, aCouleurTexte) {
    return this._styleCouleur(
      this._getCouleur().colonneFixe,
      aPourImpression,
      aAvecCadre,
      aGenreBordure,
      aCouleurTexte,
    );
  },
  getCouleurCellule(aEditable) {
    const lObjetCouleur = aEditable
      ? this._getCouleur().editable
      : this._getCouleur().nonEditable;
    return lObjetCouleur.getFond(false);
  },
  styleCellule(
    aPourImpression,
    aAvecCadre = false,
    aGenreBordure = 0,
    aEditable = false,
  ) {
    aEditable =
      aEditable === null || aEditable === undefined ? true : aEditable;
    return this._styleCouleur(
      aEditable ? this._getCouleur().editable : this._getCouleur().nonEditable,
      aPourImpression,
      aAvecCadre,
      aGenreBordure,
    );
  },
  styleMoyenne(aPourImpression, aAvecCadre, aGenreBordure, aEstMoyGenerale) {
    return this._styleCouleur(
      aEstMoyGenerale ? this._getCouleur().total : this._getCouleur().moyenne,
      aPourImpression,
      aAvecCadre,
      aGenreBordure,
    );
  },
  styleCumul(aPourImpression, aAvecCadre, aGenreBordure) {
    return this._styleCouleur(
      this._getCouleur().cumul,
      aPourImpression,
      aAvecCadre,
      aGenreBordure,
    );
  },
  styleCouleur(aPourImpression, aAvecCadre, aGenreBordure, aCouleur) {
    return this._styleCouleur(
      aCouleur,
      aPourImpression,
      aAvecCadre,
      aGenreBordure,
    );
  },
  styleTitreLeger(aPourImpression, aAvecBordureGauche) {
    const lCouleurFond = GCouleur.blanc;
    const lCouleurTexte = aPourImpression ? GCouleur.noir : GCouleur.texte;
    const lCouleurBordure = aPourImpression ? GCouleur.texte : GCouleur.texte;
    return (
      ObjetStyle_1.GStyle.composeCouleurFond(lCouleurFond) +
      " " +
      ObjetStyle_1.GStyle.composeCouleurTexte(lCouleurTexte) +
      " " +
      (aAvecBordureGauche
        ? "border-left: 1px solid " + lCouleurBordure + ";"
        : "") +
      " border-right : 1px solid " +
      lCouleurBordure +
      ";"
    );
  },
};
