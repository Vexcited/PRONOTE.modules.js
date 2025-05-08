const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieListeAbsenceRetard extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aListe) {
    this.JSON = {};
    if (!!aListe) {
      this.JSON.listeAbsences = aListe;
      this.JSON.listeAbsences.setSerialisateurJSON({
        methodeSerialisation: function (aAbsence, AJSON) {
          AJSON.reglee = aAbsence.reglee;
        },
      });
    }
    return this.appelAsynchrone();
  }
}
Requetes.inscrire(
  "SaisieListeAbsenceRetard",
  ObjetRequeteSaisieListeAbsenceRetard,
);
module.exports = { ObjetRequeteSaisieListeAbsenceRetard };
