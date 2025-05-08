exports.DonneesListe_ProgrammesBO = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeGenreCumul_1 = require("TypeGenreCumul");
class DonneesListe_ProgrammesBO extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees, aGenreCumul, aCallbackMenuContextuel) {
    super(aDonnees);
    this.callbackMenuContextuel = aCallbackMenuContextuel;
    this.genreCumul = aGenreCumul;
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecDeploiement: true,
      avecImageSurColonneDeploiement: true,
      avecEvnt_Selection: true,
    });
  }
  getIndentationCellule(aParams) {
    return this.getIndentationCelluleSelonParente(aParams);
  }
  getTypeValeur() {
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ProgrammesBO.colonnes.libelle: {
        const lLibelle = [];
        if (!!aParams.article.estUnDeploiement) {
          lLibelle.push(
            '<span class="Gras">',
            aParams.article.strCumul,
            "</span>",
          );
        } else {
          if (
            this.genreCumul === TypeGenreCumul_1.TypeGenreCumul.Cumul_Matiere
          ) {
            lLibelle.push(
              aParams.article.strNiveau,
              " ",
              aParams.article.strFilieres,
              " " + aParams.article.strTitreBO,
            );
          } else {
            lLibelle.push(
              aParams.article.strMatiere + " " + aParams.article.strTitreBO,
            );
          }
        }
        return lLibelle.join("");
      }
    }
    return "";
  }
  getCouleurCellule(aParams) {
    let lCouleurCellule = GCouleur.liste.nonEditable;
    if (!!aParams.article.estUnDeploiement) {
      lCouleurCellule = GCouleur.liste.cumul[aParams.article.profondeur];
    }
    return lCouleurCellule;
  }
  avecMenuContextuel(aParams) {
    return (
      !!aParams.article &&
      aParams.ligne >= 0 &&
      !aParams.article.estUnDeploiement
    );
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    aParametres.menuContextuel.addCommande(
      0,
      ObjetTraduction_1.GTraductions.getValeur(
        "progression.CopierProgammeDansProgression",
      ),
    );
    aParametres.menuContextuel.setDonnees();
  }
  evenementMenuContextuel() {
    this.callbackMenuContextuel();
    return true;
  }
}
exports.DonneesListe_ProgrammesBO = DonneesListe_ProgrammesBO;
(function (DonneesListe_ProgrammesBO) {
  let colonnes;
  (function (colonnes) {
    colonnes["libelle"] = "DL_ProgrammesBO_libelle";
  })(
    (colonnes =
      DonneesListe_ProgrammesBO.colonnes ||
      (DonneesListe_ProgrammesBO.colonnes = {})),
  );
})(
  DonneesListe_ProgrammesBO ||
    (exports.DonneesListe_ProgrammesBO = DonneesListe_ProgrammesBO = {}),
);
