const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
function _getContexteColonnes(aNbrColonnesPeriodes) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_DevoirPeriode.colonnes.classe,
    genreColonne: this.genreColonne.Classe,
    titre: GTraductions.getValeur("FenetreDevoir.ElevesDe"),
    taille: "50%",
  });
  for (let i = 0; i < aNbrColonnesPeriodes; i++) {
    lColonnes.push({
      id: DonneesListe_DevoirPeriode.colonnes.periode + "_" + i,
      genreColonne: this.genreColonne.Periode,
      rangColonne: i,
      titre: this.param.regrouperPeriodes
        ? GTraductions.getValeur("FenetreDevoir.PeriodeNotation")
        : GTraductions.getValeur("FenetreDevoir.PeriodeNotation")[i],
      taille: aNbrColonnesPeriodes > 1 ? "25%" : "50%",
    });
  }
  return lColonnes;
}
class DonneesListe_DevoirPeriode extends ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.param = $.extend(
      { instance: null, nbrColonnesPeriodes: null, regrouperPeriodes: false },
      aParams,
    );
    this.genreColonne = { Classe: -1, Periode: -2 };
    this.setOptions({
      avecEtatSaisie: false,
      avecSuppression: false,
      avecSelection: false,
      avecEvnt_Selection: true,
      avecEdition: false,
    });
    this.param.instance.setOptionsListe({
      colonnes: _getContexteColonnes.call(this, this.param.nbrColonnesPeriodes),
      hauteurAdapteContenu: true,
      hauteurMaxAdapteContenu: 121,
    });
  }
  getValeur(aParams) {
    if (this.param.regrouperPeriodes) {
      return aParams.declarationColonne.genreColonne ===
        this.genreColonne.Periode
        ? aParams.article.listePeriodes
            .getTableauLibelles(null, false, true)
            .join(", ")
        : aParams.article.getLibelle();
    } else {
      return aParams.declarationColonne.genreColonne ===
        this.genreColonne.Periode
        ? aParams.article.listePeriodes
            .get(aParams.declarationColonne.rangColonne)
            .getLibelle()
        : aParams.article.getLibelle();
    }
  }
  getClass() {
    return "AvecMain";
  }
  getCouleurCellule(aParams) {
    let lCouleurCellule = ObjetDonneesListe.ECouleurCellule.Fixe;
    if (aParams.declarationColonne.genreColonne === this.genreColonne.Periode) {
      lCouleurCellule = ObjetDonneesListe.ECouleurCellule.Blanc;
    }
    return lCouleurCellule;
  }
}
DonneesListe_DevoirPeriode.colonnes = {
  classe: "DevoirPeriode_classe",
  periode: "DevoirPeriode_periode",
};
module.exports = { DonneesListe_DevoirPeriode };
