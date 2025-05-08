const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
class ObjetRequeteFicheEleve extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete(aParam) {
    this.JSON = {
      Eleve: { N: aParam.numeroEleve },
      AvecEleve: aParam.avecEleve,
      AvecResponsables: aParam.avecResponsables,
      AvecAutresContacts: aParam.avecAutresContacts,
    };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (
      this.JSONReponse.Scolarite &&
      this.JSONReponse.Scolarite.listeAttestations
    ) {
      this.JSONReponse.Scolarite.listeAttestations.setTri([
        ObjetTri.init("abbreviation"),
      ]);
      this.JSONReponse.Scolarite.listeAttestations.trier();
    }
    this.callbackReussite.appel(
      this.JSONReponse.Identite,
      this.JSONReponse.Scolarite,
      this.JSONReponse.listeTypesProjets,
      this.JSONReponse.listeMotifsProjets,
      this.JSONReponse.listeAttestations,
      this.JSONReponse.Responsables
        ? this.JSONReponse.Responsables
        : new ObjetListeElements(),
      this.JSONReponse.listeMemosEleves,
    );
  }
}
Requetes.inscrire("FicheEleve", ObjetRequeteFicheEleve);
module.exports = { ObjetRequeteFicheEleve };
