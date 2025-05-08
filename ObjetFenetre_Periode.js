const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetFenetre_Periode extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 400,
      hauteur: 500,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
    this.avecMultiSelection = false;
    this.avecTri = true;
  }
  construireInstances() {
    this.identListePeriodes = this.add(
      ObjetListe,
      this.evenementSurListe,
      _initialiserListe,
    );
  }
  setDonnees(aListePeriodes, aAvesSansPeriode, aAvecMultiSelection, aSansTri) {
    this.listePeriodes = aListePeriodes;
    this.avecMultiSelection = !!aAvecMultiSelection;
    this.avecTri = !aSansTri;
    this.afficher();
    this.setBoutonActif(1, false);
    this.getInstance(this.identListePeriodes).setDonnees(
      new DonneesListe_ListePeriodes(
        aListePeriodes,
        aAvesSansPeriode,
        this.avecMultiSelection,
        this.avecTri,
      ),
    );
  }
  composeContenu() {
    const T = [];
    T.push(
      '<div id="',
      this.getNomInstance(this.identListePeriodes),
      '" style="height:100%;width:100%;"></div>',
    );
    return T.join("");
  }
  evenementSurListe(aParametres) {
    if (this.avecMultiSelection) {
      this.periode = this.listePeriodes.getListeElements((aPeriode) => {
        return !!aPeriode.enSelection;
      });
      this.setBoutonActif(1, this.periode.count() > 0);
    } else {
      this.periode = this.listePeriodes.get(
        this.getInstance(this.identListePeriodes).getSelection(),
      );
      this.setBoutonActif(
        1,
        !this.periode.existeNumero() || this.periode.getActif(),
      );
    }
    if (
      !this.avecMultiSelection &&
      aParametres.genreEvenement === EGenreEvenementListe.Edition
    ) {
      this.surValidation(1);
    }
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, this.periode);
  }
}
function _initialiserListe(aInstance) {
  aInstance.setOptionsListe({ skin: ObjetListe.skin.flatDesign });
}
class DonneesListe_ListePeriodes extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aAvecSansPeriode, aAvecMultiSelection, aAvecTri) {
    super(aDonnees);
    this.avecSansPeriode = aAvecSansPeriode;
    this.setOptions({
      avecCB: aAvecMultiSelection,
      avecCocheCBSurLigne: true,
      avecBoutonActionLigne: false,
      avecEvnt_Selection: !aAvecMultiSelection,
      avecTri: aAvecTri,
    });
  }
  getValueCB(aParams) {
    return aParams.article ? !!aParams.article.enSelection : false;
  }
  setValueCB(aParams, aValue) {
    aParams.article.enSelection = aValue;
  }
  getDisabledCB(aParams) {
    return !!aParams.article.estCloture || !aParams.article.estActif;
  }
  getZoneComplementaire(aParams) {
    const lZoneCompl = [];
    if (aParams.article) {
      let lPeriodeActive = true;
      if (this.options.avecCB) {
        lPeriodeActive =
          (aParams.article.estCloture === undefined ||
            aParams.article.estCloture === false) &&
          (aParams.article.estActif === undefined ||
            aParams.article.estActif === true);
      } else {
        lPeriodeActive =
          !aParams.article.existeNumero() || aParams.article.getActif();
      }
      if (!lPeriodeActive) {
        lZoneCompl.push('<i class="icon_lock" style="font-size:1.4rem;"></i>');
      }
    }
    return lZoneCompl.join("");
  }
  getTri() {
    const lTris = [];
    lTris.push(ObjetTri.init("Genre"), ObjetTri.init("Libelle"));
    return lTris;
  }
  getVisible(D) {
    return this.avecSansPeriode || D.existeNumero();
  }
}
module.exports = { ObjetFenetre_Periode };
