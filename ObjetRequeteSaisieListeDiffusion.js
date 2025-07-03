exports.ObjetRequeteSaisieListeDiffusion = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieListeDiffusion extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		aParam.liste.setSerialisateurJSON({
			methodeSerialisation: _serialiserListeDiffusion.bind(this),
		});
		this.JSON = { liste: aParam.liste };
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieListeDiffusion = ObjetRequeteSaisieListeDiffusion;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieListeDiffusion",
	ObjetRequeteSaisieListeDiffusion,
);
function _serialiserListeDiffusion(aElement, aJSON) {
	aJSON.estPublique = aElement.estPublique;
	aJSON.listePublicIndividu = aElement.listePublicIndividu;
	if (aJSON.listePublicIndividu) {
		aJSON.listePublicIndividu.setSerialisateurJSON({ avecLibelle: false });
	}
}
