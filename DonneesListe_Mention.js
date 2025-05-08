const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_Mention extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
    });
  }
  fusionCelluleAvecColonnePrecedente(aParams) {
    if (
      aParams.idColonne === DonneesListe_Mention.colonnes.imprimee &&
      !aParams.article.existeNumero()
    ) {
      return true;
    }
    return false;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Mention.colonnes.libelle: {
        let lLibelle = "";
        if (!!aParams.article) {
          lLibelle = aParams.article.Libelle;
          if (!!aParams.article.strCode) {
            lLibelle += " (" + aParams.article.strCode + ")";
          }
        }
        return lLibelle;
      }
      case DonneesListe_Mention.colonnes.imprimee:
        return aParams.article.imprimee;
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Mention.colonnes.imprimee:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getHintForce(aParams) {
    if (aParams.idColonne === DonneesListe_Mention.colonnes.imprimee) {
      if (!aParams.article.existeNumero()) {
        return GTraductions.getValeur("Appreciations.HintAucuneMention");
      } else if (aParams.article.imprimee) {
        return GTraductions.getValeur(
          "Appreciations.HintImprimeeDansLesDocuments",
        );
      } else {
        return GTraductions.getValeur(
          "Appreciations.HintNonImprimeeDansLesDocuments",
        );
      }
    }
    return "";
  }
}
DonneesListe_Mention.colonnes = {
  libelle: "Mention_libelle",
  imprimee: "Mention_imprimee",
};
module.exports = { DonneesListe_Mention };
