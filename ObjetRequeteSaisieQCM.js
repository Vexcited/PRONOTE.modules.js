exports.ObjetRequeteSaisieQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const SerialiserQCM_PN_1 = require("SerialiserQCM_PN");
class ObjetRequeteSaisieQCM extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aListeQCM) {
		aListeQCM.setSerialisateurJSON({
			methodeSerialisation: _serialisation.bind(this),
			nePasTrierPourValidation: true,
		});
		this.JSON = { listeQCM: aListeQCM };
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieQCM = ObjetRequeteSaisieQCM;
CollectionRequetes_1.Requetes.inscrire("SaisieQCM", ObjetRequeteSaisieQCM);
function _serialisation(aElement, aJSON, aIndice) {
	aJSON.Ordre = aIndice + 1;
	const lJSON = aElement.toJSON();
	let lGarderQCM;
	switch (aElement.getGenre()) {
		case Enumere_Ressource_1.EGenreRessource.ExecutionQCM:
			lGarderQCM = new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
				aElement,
				lJSON,
			);
			break;
		case Enumere_Ressource_1.EGenreRessource.QCM:
			lGarderQCM = new SerialiserQCM_PN_1.SerialiserQCM_PN().qcm(
				aElement,
				lJSON,
			);
			break;
		default:
			break;
	}
	$.extend(true, aJSON, lJSON);
	return lGarderQCM;
}
