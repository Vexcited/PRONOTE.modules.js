exports.ObjetRequeteListeContenuTAFsEtContenus = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequeteListeContenuTAFsEtContenus extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aListeElements) {
		this.JSON.liste = aListeElements;
		this.JSON.liste.setSerialisateurJSON({
			ignorerEtatsElements: true,
			nePasTrierPourValidation: true,
		});
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lObjetDeserialiser = new ObjetDeserialiser_1.ObjetDeserialiser();
		const lListeTAFs = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeTravauxAFaire) {
			lListeTAFs.add(this.JSONReponse.listeTravauxAFaire);
			lListeTAFs.parcourir((aTaf) => {
				lObjetDeserialiser.deserialiserTAF(aTaf);
			});
			lListeTAFs.setTri([
				ObjetTri_1.ObjetTri.init("DonneLe"),
				ObjetTri_1.ObjetTri.init("Genre"),
			]);
			lListeTAFs.trier();
		}
		const lListeContenus = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.JSONReponse.listeContenus) {
			lListeContenus.add(this.JSONReponse.listeContenus);
			lListeContenus.parcourir((aContenuCours) => {
				lObjetDeserialiser.deserialiserContenuDeCours(aContenuCours);
			});
		}
		this.callbackReussite.appel(lListeTAFs, lListeContenus);
	}
}
exports.ObjetRequeteListeContenuTAFsEtContenus =
	ObjetRequeteListeContenuTAFsEtContenus;
CollectionRequetes_1.Requetes.inscrire(
	"ListeContenuTAFsEtContenus",
	ObjetRequeteListeContenuTAFsEtContenus,
);
