const { ObjetEditionOffreStage } = require("ObjetEditionOffreStage.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
class ObjetFenetre_EditionOffreStage extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this._parametres = {
      avecPeriode: false,
      avecSujetObjetSaisie: false,
      avecGestionPJ: false,
      tailleMaxPieceJointe: 0,
      avecEditionDocumentsJoints: false,
      genreRessourcePJ: 0,
    };
  }
  construireInstances() {
    this.identEditOffre = this.add(
      ObjetEditionOffreStage,
      null,
      _initEditOffre.bind(this),
    );
  }
  setDonnees(aParam) {
    this.paramOrigine = aParam;
    this.paramModifie = MethodesObjet.dupliquer(aParam);
    this.listePJ = aParam.listePJ;
    this.getInstance(this.identEditOffre).setDonnees({
      offreStage: this.paramModifie.offre,
      sujetsStage: this.paramModifie.sujetsStage,
      listePJ: this.listePJ,
    });
    this.afficher();
  }
  composeContenu() {
    return (
      '<div class="edition-offre" id="' +
      this.getInstance(this.identEditOffre).getNom() +
      '" ></div>'
    );
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(
      aNumeroBouton,
      aNumeroBouton > 0 ? this.paramModifie : this.paramOrigine,
    );
  }
  setParametresEditionOffreStage(aParam) {
    $.extend(this._parametres, aParam);
  }
}
function _initEditOffre(aInstance) {
  const lParams = { maxWidth: this.optionsFenetre.largeur - 22 };
  $.extend(lParams, this._parametres);
  aInstance.setParametres(lParams);
  aInstance.classSelecteurPJ = this.classSelecteurPJ;
}
module.exports = { ObjetFenetre_EditionOffreStage };
