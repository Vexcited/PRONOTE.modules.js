const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
  _InterfaceSaisieApprReleveBulletin,
} = require("_InterfaceSaisieApprReleveBulletin.js");
const { GTraductions } = require("ObjetTraduction.js");
class InterfaceSaisieAvisProfesseur extends _InterfaceSaisieApprReleveBulletin {
  constructor(...aParams) {
    super(...aParams);
    this.typeReleveBulletin = TypeReleveBulletin.AvisProfesseur;
  }
  construireStructureAffichageAutre() {
    const lConstruireInterfaceParent =
      super.construireStructureAffichageAutre();
    const H = [];
    H.push("<div>");
    H.push(
      '<div class="AlignementMilieu Gras Italique" style="line-height: 3rem;">',
      GTraductions.getValeur("Appreciations.msgSaisieAvisConfidentiels"),
      "</div>",
    );
    H.push(lConstruireInterfaceParent);
    H.push("</div>");
    return H.join("");
  }
}
module.exports = InterfaceSaisieAvisProfesseur;
