const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const ObjetIncidents = require("PageIncidents.js");
const { Requetes } = require("CollectionRequetes.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
Requetes.inscrire("Incidents", ObjetRequeteConsultation);
class InterfacePageIncidents_Mobile extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.donnees = { listeIncidents: new ObjetListeElements() };
  }
  construireInstances() {
    this.identPage = this.add(ObjetIncidents, this.evenementPage);
  }
  recupererDonnees() {
    this.recupererDonneesIncidents();
  }
  recupererDonneesIncidents() {
    Requetes("Incidents", this, _actionApresRequeteIncidents).lancerRequete();
  }
  evenementPage() {}
}
function _actionApresRequeteIncidents(aJSON) {
  this.incidents = aJSON.incidents;
  this.incidents.setTri([
    ObjetTri.init("dateheure", EGenreTriElement.Decroissant),
  ]);
  this.incidents.trier();
  this.getInstance(this.identPage).setDonnees({
    listeIncidents: this.incidents,
  });
}
module.exports = InterfacePageIncidents_Mobile;
