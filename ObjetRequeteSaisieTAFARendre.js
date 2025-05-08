const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const TypeSaisieTAFARendre = {
  Rendu: 0,
  CopieEleve: 1,
  Verrou: 2,
  CopieCorrigee: 3,
  CommentaireCorrige: 4,
  DateReportRendu: 5,
  annulerProlongation: 6,
};
class ObjetRequeteSaisieTAFARendre extends ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aTypeSaisie, aDonnees) {
    $.extend(this.JSON, aDonnees);
    aDonnees.listeEleves.setSerialisateurJSON({
      methodeSerialisation: function (aElement, aJSON) {
        switch (aTypeSaisie) {
          case TypeSaisieTAFARendre.Rendu:
            aJSON.estRendu = aElement.estRendu;
            break;
          case TypeSaisieTAFARendre.CopieEleve:
            if (!!aElement.copieEleve && aElement.copieEleve.pourValidation()) {
              aJSON.copieEleve = aElement.copieEleve.toJSON();
              aJSON.copieEleve.idFichier = aElement.copieEleve.idFichier;
            }
            break;
          case TypeSaisieTAFARendre.Verrou:
            aJSON.estVerrouille = aElement.estVerrouille;
            break;
          case TypeSaisieTAFARendre.CopieCorrigee:
            if (
              !!aElement.copieCorrigee &&
              aElement.copieCorrigee.pourValidation()
            ) {
              aJSON.copieCorrigee = aElement.copieCorrigee.toJSON();
              aJSON.copieCorrigee.idFichier = aElement.copieCorrigee.idFichier;
            }
            break;
          case TypeSaisieTAFARendre.CommentaireCorrige:
            aJSON.commentaireCorrige = aElement.commentaireCorrige;
            break;
          case TypeSaisieTAFARendre.DateReportRendu:
            aJSON.dateReportRendu = aElement.dateReportRendu;
            break;
          case TypeSaisieTAFARendre.annulerProlongation:
            aJSON.annulationProlongation = aElement.annulationProlongation;
            break;
          default:
            break;
        }
      },
    });
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(this.JSONReponse);
  }
}
Requetes.inscrire("SaisieTAFARendre", ObjetRequeteSaisieTAFARendre);
module.exports = { ObjetRequeteSaisieTAFARendre, TypeSaisieTAFARendre };
