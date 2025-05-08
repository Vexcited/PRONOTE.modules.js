const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetRequetePageStageGeneral extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aNumeroEleve) {
    this.JSON.Eleve = new ObjetElement("", aNumeroEleve);
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lListeStages = this.JSONReponse.Stages;
    const lListeEvenements = this.JSONReponse.Evenements;
    lListeEvenements.parcourir((D) => {
      if (!D.couleur) {
        D.couleur = GCouleur.blanc;
      }
      D.libelleHtml = `<span class="colored-square-libelle" style="--colour-square : ${D.couleur}">${D.getLibelle()}</span>`;
    });
    const lListeLieux = this.JSONReponse.Lieux;
    lListeLieux.addElement(new ObjetElement("", 0));
    lListeLieux.trier();
    const lListeSujets = this.JSONReponse.Sujets;
    if (lListeSujets) {
      lListeSujets.trier();
      lListeSujets.insererElement(
        new ObjetElement(GTraductions.getValeur("Aucun"), 0),
        0,
      );
    }
    this.callbackReussite.appel(
      lListeStages,
      lListeEvenements,
      lListeLieux,
      lListeSujets,
      this.JSONReponse.dateFinSaisieSuivi,
    );
  }
}
Requetes.inscrire("PageStage.General", ObjetRequetePageStageGeneral);
module.exports = { ObjetRequetePageStageGeneral };
