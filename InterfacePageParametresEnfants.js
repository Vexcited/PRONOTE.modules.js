const { PageParametresEnfants } = require("PageParametresEnfants.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { PageInformationsMedicales } = require("PageInformationsMedicales.js");
const {
  ObjetRequeteSaisieCompteEnfant,
} = require("ObjetRequeteSaisieCompteEnfant.js");
const {
  InterfaceAutorisationSortie,
} = require("InterfaceAutorisationSortie.js");
class InterfacePageParametresEnfantsMobile extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identPage = this.add(PageParametresEnfants);
    this.identInformationsMedicales = this.add(
      PageInformationsMedicales,
      this._evenementInformationsMedicales,
    );
    this.identAutorisationSortie = this.add(
      InterfaceAutorisationSortie,
      _evenementAutorisationSortie,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="ObjetCompte">');
    H.push(
      '<div class="compte-contain" id="',
      this.getInstance(this.identPage).getNom(),
      '"></div>',
    );
    H.push("</div>");
    return H.join("");
  }
  _evenementInformationsMedicales() {
    this.valider();
  }
  actionSurValidation() {
    super.actionSurValidation();
    this.getInstance(this.identPage).recupererDonnees();
  }
  valider() {
    const lStructure = {};
    if (
      this.getInstance(this.identPage).getStructurePourValidation(lStructure)
    ) {
      this.setEtatSaisie(false);
      new ObjetRequeteSaisieCompteEnfant(
        this,
        this.actionSurValidation,
      ).lancerRequete(lStructure);
    }
  }
}
function _evenementAutorisationSortie() {
  this.valider();
}
module.exports = { InterfacePageParametresEnfantsMobile };
