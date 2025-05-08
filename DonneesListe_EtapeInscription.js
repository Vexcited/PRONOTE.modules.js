const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { tag } = require("tag.js");
class DonneesListe_EtapeInscription extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aOptions) {
    super(aDonnees);
    const lOptionsParDefaut = {
      avecSelection: true,
      avecBoutonActionLigne: false,
      avecTri: false,
      avecEvnt_Selection: true,
    };
    this.setOptions($.extend(lOptionsParDefaut, aOptions));
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getZoneGauche(aParams) {
    return aParams.article.Position > 0
      ? tag(
          "span",
          {
            class: ["pastille-etape", aParams.article.Actif ? "" : "etape-off"],
          },
          aParams.article.Position,
        )
      : tag("span", { class: "m-x-l" }, "&nbsp;");
  }
  avecSelection(aParams) {
    return aParams.article.Actif;
  }
  estLigneOff(aParams) {
    return !aParams.article.Actif;
  }
}
module.exports = { DonneesListe_EtapeInscription };
