const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetPageCompte } = require("ObjetPageCompte.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetPageCompte_Parent extends ObjetPageCompte {
  constructor(...aParams) {
    super(...aParams);
    this.listeEleves = null;
    $.extend(this.parametres, {
      largeurEleve: 150,
      largeurColonneGauche: 130,
      hauteurTitre: 40,
      hauteurEleve: 60,
    });
  }
  construireAutorisationsSupp() {
    const lHtml = [];
    if (this.donnees.Autorisations.listeEleves.count() > 0) {
      lHtml.push(
        '<div class="Gras EspaceHaut" style="clear:both;">',
        GTraductions.getValeur("infosperso.titreRecevoir"),
        "</div>",
      );
    }
    return lHtml.join("");
  }
  getStructurePourValidation(aStructure) {
    const lResult = super.getStructurePourValidation(aStructure);
    if (!lResult) {
      return lResult;
    }
    if (
      GApplication.droits.get(
        TypeDroits.compte.avecSaisieInfosPersoAutorisations,
      )
    ) {
      if (this.donnees.Autorisations.estDestinataireInfosGenerales !== null) {
        aStructure.autorisations.estDestinataireInfosGenerales =
          this.donnees.Autorisations.estDestinataireInfosGenerales;
      }
      aStructure.autorisations.listeEleves = [];
      for (let i = 0; i < this.donnees.Autorisations.listeEleves.count(); i++) {
        let lEleve = this.donnees.Autorisations.listeEleves.get(i);
        let lJSONEleve = lEleve.toJSON();
        aStructure.autorisations.listeEleves.push(lJSONEleve);
        lJSONEleve.estDestinataireBulletin = lEleve.estDestinataireBulletin;
        lJSONEleve.estDestinataireInfosEleve = lEleve.estDestinataireInfosEleve;
        lJSONEleve.estDestinataireInfosProfesseur =
          lEleve.estDestinataireInfosProfesseur;
      }
    }
    return true;
  }
}
module.exports = ObjetPageCompte_Parent;
