exports.ObjetRequeteAuthentificationPN = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequeteAuthentificationPN extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      messageDetail:
        ObjetTraduction_1.GTraductions.getValeur("Authentification"),
    });
  }
  lancerRequete(aParam) {
    this.JSON.connexion = aParam.genreConnexion;
    this.JSON.challenge = aParam.challenge;
    this.JSON.espace = GEtatUtilisateur.GenreEspace;
    return this.appelAsynchrone();
  }
}
exports.ObjetRequeteAuthentificationPN = ObjetRequeteAuthentificationPN;
CollectionRequetes_1.Requetes.inscrire(
  "Authentification",
  ObjetRequeteAuthentificationPN,
);
