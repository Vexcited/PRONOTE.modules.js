const { PageBilanFinDeCycle } = require("PageBilanFinDeCycle.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const {
  TypeModuleFonctionnelPiedBulletin,
  TypeModuleFonctionnelPiedBulletinUtil,
} = require("TypeModuleFonctionnelPiedBulletin.js");
class PiedBulletin_Competences extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets,
      avecTitreModule: false,
      periodeCloture: false,
      droits: { avecSaisie: false },
    };
  }
  construireInstances() {
    this.identBilanFinDeCycle = this.add(
      PageBilanFinDeCycle,
      _evenementInterfaceBilanFinDeCycle.bind(this),
      _initInterfaceBilanFinDeCycle,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identBilanFinDeCycle;
    this.avecBandeau = this.params.avecTitreModule;
    this.AvecCadre = false;
  }
  construireStructureAffichageBandeau() {
    const T = [];
    T.push('<div class="EspaceBas EspaceHaut Gras">');
    T.push(
      TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
        TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
      ),
    );
    T.push("</div>");
    return T.join("");
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
    this.params.listePiliers = aParam.listePiliers;
  }
  setParametres(aParam) {
    $.extend(true, this.params, aParam);
  }
  estAffiche() {
    const lPeriode = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Periode,
    );
    let lEstPeriodeValable = true;
    if (lPeriode && lPeriode.getNumero() === 0) {
      lEstPeriodeValable = false;
    }
    const lListeEleves = GEtatUtilisateur.Navigation.getRessources(
      EGenreRessource.Eleve,
    );
    let lPourClasse = false;
    if (
      !!lListeEleves &&
      lListeEleves.count() === 1 &&
      !lListeEleves.existeNumero(0)
    ) {
      lPourClasse = true;
    }
    let lNombrePiliers = 0;
    if (!!this.params.listePiliers) {
      lNombrePiliers = this.params.listePiliers.count();
    }
    return lEstPeriodeValable && !lPourClasse && lNombrePiliers > 0;
  }
  afficher(aParam) {
    $.extend(true, this.params, aParam);
    switch (aParam.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        this.getInstance(this.identBilanFinDeCycle).setDonnees({
          pourDecompte: false,
          avecValidationAuto: false,
          listePiliers: this.params.listePiliers,
          listeElevesDeClasse: null,
        });
        break;
    }
  }
  getDonneesSaisie() {
    if (
      [
        TypeModeAffichagePiedBulletin.MAPB_Onglets,
        TypeModeAffichagePiedBulletin.MAPB_Lineaire,
      ].includes(this.params.modeAffichage)
    ) {
      return {
        listePiliers: this.getInstance(
          this.identBilanFinDeCycle,
        ).getListePiliers(),
      };
    }
  }
}
function _initInterfaceBilanFinDeCycle(aInstance) {
  aInstance.avecEventResizeNavigateur = function () {
    return false;
  };
}
function _evenementInterfaceBilanFinDeCycle() {
  this.afficher();
}
module.exports = { PiedBulletin_Competences };
