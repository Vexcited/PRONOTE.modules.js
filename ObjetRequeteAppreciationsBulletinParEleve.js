const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const {
  UtilitaireDeserialiserPiedBulletin,
} = require("UtilitaireDeserialiserPiedBulletin.js");
class ObjetRequeteAppreciationsBulletinParEleve extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    const lParam = {
      classe: new ObjetElement(),
      eleve: new ObjetElement(),
      service: new ObjetElement(),
      ordre: new ObjetElement(),
      modeVertical: new ObjetElement(),
      coefficientZero: new ObjetElement(),
    };
    $.extend(lParam, aParam);
    this.JSON = {
      classe: lParam.classe,
      eleve: lParam.eleve,
      service: lParam.service,
      ordre: lParam.ordre,
      modeVertical: lParam.modeVertical,
      coefficientZero: lParam.coefficientZero,
      listePeriodes: lParam.periodes,
      avecCategories: lParam.avecCategories,
      listeCategories: lParam.listeCategoriesSelectionnees,
    };
    this.JSON.listePeriodes.setSerialisateurJSON({
      methodeSerialisation: function (aElement, aJSON) {
        if (aElement.visible) {
          aJSON.periode = aElement.periode;
        }
      },
      ignorerEtatsElements: true,
    });
    this.JSON.listeCategories.setSerialisateurJSON({
      methodeSerialisation: function (aElement, aJSON) {
        aJSON = aElement;
        aJSON.coche = aElement.coche;
      },
    });
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    this.callbackReussite.appel(
      this.JSONReponse,
      new UtilitaireDeserialiserPiedBulletin().creerPiedDePage(
        this.JSONReponse,
      ),
    );
  }
}
Requetes.inscrire(
  "PageAppreciationsBulletinParEleve",
  ObjetRequeteAppreciationsBulletinParEleve,
);
module.exports = { ObjetRequeteAppreciationsBulletinParEleve };
