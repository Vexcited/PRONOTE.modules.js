const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
class ObjetRequeteDonneesInscriptionEtablissement extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParametres) {
    const lParametres = $.extend({}, aParametres);
    $.extend(this.JSON, lParametres);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lParam = {
      inscription: this.JSONReponse.inscription,
      resumeInscription: this.JSONReponse.resumeInscription,
      responsables: this.JSONReponse.responsables,
      fratrie: this.JSONReponse.fratrie,
      identite: this.JSONReponse.identite,
      scolarite: this.JSONReponse.scolarite,
      scolariteActuelle: this.JSONReponse.scolariteActuelle,
    };
    if (this.JSONReponse.responsables) {
      this.JSONReponse.responsables.parcourir((aResponsable) => {
        const lAdresse = [];
        lAdresse[1] = aResponsable.adresse1;
        lAdresse[2] = aResponsable.adresse2;
        lAdresse[3] = aResponsable.adresse3;
        lAdresse[4] = aResponsable.adresse4;
        aResponsable.adresse = lAdresse;
      });
    }
    if (this.JSONReponse.identite) {
      const lAdresse = [];
      lAdresse[1] = this.JSONReponse.identite.adresse1;
      lAdresse[2] = this.JSONReponse.identite.adresse2;
      lAdresse[3] = this.JSONReponse.identite.adresse3;
      lAdresse[4] = this.JSONReponse.identite.adresse4;
      this.JSONReponse.identite.adresse = lAdresse;
    }
    if (
      this.JSONReponse.scolariteActuelle &&
      this.JSONReponse.scolariteActuelle.options
    ) {
      lParam.scolariteActuelle.optionsChoisies = {
        obligatoires: new ObjetListeElements(),
        facultatives: new ObjetListeElements(),
        lv1: new ObjetListeElements(),
        lv2: new ObjetListeElements(),
      };
      this.JSONReponse.scolariteActuelle.options.parcourir((aOption) => {
        if (aOption.rangOption === 1) {
          lParam.scolariteActuelle.optionsChoisies.lv1.add(aOption);
        } else if (aOption.rangOption === 2) {
          lParam.scolariteActuelle.optionsChoisies.lv2.add(aOption);
        } else if (aOption.rangOption >= 3 && aOption.rangOption <= 5) {
          lParam.scolariteActuelle.optionsChoisies.obligatoires.add(aOption);
        } else if (aOption.rangOption >= 6) {
          lParam.scolariteActuelle.optionsChoisies.facultatives.add(aOption);
        }
      });
    }
    this.callbackReussite.appel(lParam);
  }
}
Requetes.inscrire(
  "DonneesInscriptionEtablissement",
  ObjetRequeteDonneesInscriptionEtablissement,
);
module.exports = { ObjetRequeteDonneesInscriptionEtablissement };
