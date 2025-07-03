exports.ObjetRequeteFicheEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
class ObjetRequeteFicheEleve extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	actionApresRequete() {
		if (
			this.JSONReponse.Scolarite &&
			this.JSONReponse.Scolarite.listeAttestations
		) {
			this.JSONReponse.Scolarite.listeAttestations.setTri([
				ObjetTri_1.ObjetTri.init("abbreviation"),
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
				: new ObjetListeElements_1.ObjetListeElements(),
			this.JSONReponse.listeMemosEleves,
		);
	}
}
exports.ObjetRequeteFicheEleve = ObjetRequeteFicheEleve;
CollectionRequetes_1.Requetes.inscrire("FicheEleve", ObjetRequeteFicheEleve);
