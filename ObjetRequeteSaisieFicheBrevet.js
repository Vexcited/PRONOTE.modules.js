const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieFicheBrevet extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
Requetes.inscrire("SaisieFicheBrevet", ObjetRequeteSaisieFicheBrevet);
function _serialisationPiliers(aPilier, aJSON) {
	$.extend(aJSON, aPilier.copieToJSON());
}
module.exports = { ObjetRequeteSaisieFicheBrevet };
