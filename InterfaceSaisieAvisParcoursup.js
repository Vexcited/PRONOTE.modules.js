const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
  _InterfaceSaisieApprReleveBulletin,
} = require("_InterfaceSaisieApprReleveBulletin.js");
class InterfaceSaisieAvisParcoursup extends _InterfaceSaisieApprReleveBulletin {
  constructor(...aParams) {
    super(...aParams);
    this.typeReleveBulletin = TypeReleveBulletin.AvisParcoursup;
    this.avecComboPeriode = false;
  }
}
module.exports = InterfaceSaisieAvisParcoursup;
