exports.ObjetRequeteSaisieDeconnexion = void 0;
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequeteSaisieDeconnexion extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      messageDetail: ObjetTraduction_1.GTraductions.getValeur(
        "connexion.DeconnexionEnCours",
      ),
      avecControleModeExclusif: false,
      estRequeteDeconnexion: true,
    });
  }
}
exports.ObjetRequeteSaisieDeconnexion = ObjetRequeteSaisieDeconnexion;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieDeconnexion",
  ObjetRequeteSaisieDeconnexion,
);
