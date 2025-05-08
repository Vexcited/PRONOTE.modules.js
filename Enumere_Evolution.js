exports.EGenreEvolutionUtil = exports.EGenreEvolution = void 0;
var EGenreEvolution;
(function (EGenreEvolution) {
  EGenreEvolution[(EGenreEvolution["Aucune"] = 0)] = "Aucune";
  EGenreEvolution[(EGenreEvolution["Progres"] = 1)] = "Progres";
  EGenreEvolution[(EGenreEvolution["Regularite"] = 2)] = "Regularite";
  EGenreEvolution[(EGenreEvolution["Regression"] = 3)] = "Regression";
})(EGenreEvolution || (exports.EGenreEvolution = EGenreEvolution = {}));
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetWAI_1 = require("ObjetWAI");
const EGenreEvolutionUtil = {
  getAriaLabel(aGenre) {
    switch (aGenre) {
      case EGenreEvolution.Aucune:
        return ObjetTraduction_1.GTraductions.getValeur("Aucune");
      case EGenreEvolution.Progres:
        return ObjetTraduction_1.GTraductions.getValeur(
          "BulletinEtReleve.arialabel.Progres",
        );
      case EGenreEvolution.Regularite:
        return ObjetTraduction_1.GTraductions.getValeur(
          "BulletinEtReleve.arialabel.Regulier",
        );
      case EGenreEvolution.Regression:
        return ObjetTraduction_1.GTraductions.getValeur(
          "BulletinEtReleve.arialabel.Regression",
        );
    }
  },
  getLibelle(aGenre) {
    switch (aGenre) {
      case EGenreEvolution.Aucune:
        return ObjetTraduction_1.GTraductions.getValeur("Aucune");
      case EGenreEvolution.Progres:
        return ObjetTraduction_1.GTraductions.getValeur(
          "BulletinEtReleve.Progres",
        );
      case EGenreEvolution.Regularite:
        return ObjetTraduction_1.GTraductions.getValeur(
          "BulletinEtReleve.Regulier",
        );
      case EGenreEvolution.Regression:
        return ObjetTraduction_1.GTraductions.getValeur(
          "BulletinEtReleve.Regression",
        );
    }
  },
  getImage(aGenre) {
    let lClasseCss = "";
    switch (aGenre) {
      case EGenreEvolution.Progres:
        lClasseCss = "Image_EvolutionHausse";
        break;
      case EGenreEvolution.Regularite:
        lClasseCss = "Image_EvolutionStable";
        break;
      case EGenreEvolution.Regression:
        lClasseCss = "Image_EvolutionBaisse";
        break;
    }
    const H = [];
    if (!!lClasseCss) {
      H.push(
        '<div class="InlineBlock ',
        lClasseCss,
        '" ',
        ObjetWAI_1.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Img),
        ' aria-label="',
        EGenreEvolutionUtil.getAriaLabel(aGenre),
        '"></div>',
      );
    }
    return H.join("");
  },
  getListePourMenu() {
    const lListeEvolutions = new ObjetListeElements_1.ObjetListeElements();
    const lTabGenres = [
      EGenreEvolution.Aucune,
      EGenreEvolution.Progres,
      EGenreEvolution.Regularite,
      EGenreEvolution.Regression,
    ];
    for (let i = 0, lNbr = lTabGenres.length; i < lNbr; i++) {
      let lGenre = lTabGenres[i];
      let lEvolution = new ObjetElement_1.ObjetElement(
        EGenreEvolutionUtil.getLibelle(lGenre),
        lGenre,
        lGenre,
      );
      lEvolution.image = EGenreEvolutionUtil.getImage(lGenre);
      lListeEvolutions.addElement(lEvolution);
    }
    return lListeEvolutions;
  },
};
exports.EGenreEvolutionUtil = EGenreEvolutionUtil;
