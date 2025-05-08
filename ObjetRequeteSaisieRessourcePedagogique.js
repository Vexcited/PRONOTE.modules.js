const {
  ObjetRequeteSaisie,
  EGenreReponseSaisie,
} = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetRequeteSaisieRessourcePedagogique extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParams) {
    $.extend(this.JSON, aParams);
    if (this.JSON.depot) {
      this.JSON.depot.setSerialisateurJSON({
        methodeSerialisation: function (aElement, aJSON) {
          if (aElement.estUnDeploiement) {
            return false;
          }
          aJSON.ressource = aElement.ressource;
          aJSON.url = aElement.url;
          aJSON.commentaire = aElement.commentaire;
          aJSON.matiere = aElement.matiere;
          if (aElement.ListeThemes) {
            aJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
              ignorerEtatsElements: true,
            });
          }
          aJSON.listePublics = aElement.listePublics;
          aJSON.listeNiveaux = aElement.listeNiveaux;
          aJSON.estModifiableParAutrui = aElement.estModifiableParAutrui;
          if (aElement.fichier) {
            aJSON.fichier = aElement.fichier.toJSON();
            aJSON.fichier.idFichier = aElement.fichier.idFichier;
          }
        },
      });
    }
    return this.appelAsynchrone();
  }
  traiterReponseSaisieMessage(aMessagesErreurRapportSaisie) {
    if (this.JSONReponse.import) {
      let lDetails = "";
      if (aMessagesErreurRapportSaisie && aMessagesErreurRapportSaisie.join) {
        lDetails = aMessagesErreurRapportSaisie.join("\n");
      }
      GApplication.getMessage().afficher({
        titre: GTraductions.getValeur("RessourcePedagogique.LectureImpossible"),
        message: lDetails,
      });
    } else {
      return super.traiterReponseSaisieMessage(aMessagesErreurRapportSaisie);
    }
  }
  actionApresRequete(aGenreReponse, aJSONRapport) {
    this.callbackReussite.appel(
      aGenreReponse === EGenreReponseSaisie.succes,
      aJSONRapport,
      this.JSONReponse,
    );
  }
}
Requetes.inscrire(
  "SaisieRessourcePedagogique",
  ObjetRequeteSaisieRessourcePedagogique,
);
module.exports = { ObjetRequeteSaisieRessourcePedagogique };
