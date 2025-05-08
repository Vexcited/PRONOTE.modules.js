const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
class ObjetRequetePageRemplacements extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aGenreOnglet, aNumeroSemaine, aDomaine) {
    this.JSON = {};
    if (aGenreOnglet === EGenreOnglet.Remplacements_Grille) {
      this.JSON.numeroSemaine = aNumeroSemaine;
    } else {
      this.JSON.domaine = aDomaine;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lDureeNonAssuree = this.JSONReponse.dureeNonAssuree;
    const lDureeRemplacee = this.JSONReponse.dureeRemplacee;
    let lListeCours = new ObjetListeElements();
    if (!!this.JSONReponse.listeCours) {
      lListeCours = this.JSONReponse.listeCours;
      lListeCours
        .setTri([ObjetTri.init("Matiere.Libelle"), ObjetTri.init("Date")])
        .trier();
    }
    this.callbackReussite.appel(lDureeNonAssuree, lDureeRemplacee, lListeCours);
  }
}
Requetes.inscrire("PageRemplacements", ObjetRequetePageRemplacements);
module.exports = ObjetRequetePageRemplacements;
