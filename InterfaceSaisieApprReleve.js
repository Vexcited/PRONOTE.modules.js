const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
  _InterfaceSaisieApprReleveBulletin,
} = require("_InterfaceSaisieApprReleveBulletin.js");
const { DonneesListe_ApprBulletin } = require("DonneesListe_ApprBulletin.js");
class InterfaceSaisieApprReleve extends _InterfaceSaisieApprReleveBulletin {
  constructor(...aParams) {
    super(...aParams);
    this.typeReleveBulletin = TypeReleveBulletin.AppreciationsReleveProfesseur;
  }
  estColonnePositionnementEstVisible() {
    const lNumColonne = this.getInstance(
      this.identListe,
    ).getNumeroColonneDIdColonne(DonneesListe_ApprBulletin.colonnes.niveauAcqu);
    return lNumColonne !== -1;
  }
}
module.exports = InterfaceSaisieApprReleve;
