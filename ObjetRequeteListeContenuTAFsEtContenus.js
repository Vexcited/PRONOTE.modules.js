const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
class ObjetRequeteListeContenuTAFsEtContenus extends ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aListeElements) {
		this.JSON.liste = aListeElements;
		this.JSON.liste.setSerialisateurJSON({
			ignorerEtatsElements: true,
			nePasTrierPourValidation: true,
		});
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lObjetDeserialiser = new ObjetDeserialiser();
		const lListeTAFs = new ObjetListeElements();
		if (!!this.JSONReponse.listeTravauxAFaire) {
			lListeTAFs.add(this.JSONReponse.listeTravauxAFaire);
			lListeTAFs.parcourir((aTaf) => {
				lObjetDeserialiser.deserialiserTAF(aTaf);
			});
			lListeTAFs.setTri([ObjetTri.init("DonneLe"), ObjetTri.init("Genre")]);
			lListeTAFs.trier();
		}
		const lListeContenus = new ObjetListeElements();
		if (!!this.JSONReponse.listeContenus) {
			lListeContenus.add(this.JSONReponse.listeContenus);
			lListeContenus.parcourir((aContenuCours) => {
				lObjetDeserialiser.deserialiserContenuDeCours(aContenuCours);
			});
		}
		this.callbackReussite.appel(lListeTAFs, lListeContenus);
	}
}
Requetes.inscrire(
	"ListeContenuTAFsEtContenus",
	ObjetRequeteListeContenuTAFsEtContenus,
);
module.exports = ObjetRequeteListeContenuTAFsEtContenus;
