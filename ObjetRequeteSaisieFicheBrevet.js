exports.ObjetRequeteSaisieFicheBrevet = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieFicheBrevet extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON = {};
		this.JSON.classe = aParam.classe;
		this.JSON.eleve = aParam.eleve;
		this.JSON.palier = aParam.palier;
		this.JSON.recu = aParam.recu;
		this.JSON.mention = aParam.mention;
		aParam.listePiliers.setSerialisateurJSON({
			methodeSerialisation: _serialisationPiliers.bind(this),
		});
		this.JSON.listePiliers = aParam.listePiliers;
		this.JSON.complements = aParam.complements;
		this.JSON.appGenerale = aParam.appGenerale;
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieFicheBrevet = ObjetRequeteSaisieFicheBrevet;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieFicheBrevet",
	ObjetRequeteSaisieFicheBrevet,
);
function _serialisationPiliers(aPilier, aJSON) {
	$.extend(aJSON, aPilier.copieToJSON());
}
