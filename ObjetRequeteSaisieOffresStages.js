const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieOffresStages extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParam) {
		const lParam = { listeOffres: null };
		$.extend(lParam, aParam);
		if (lParam.listeOffres) {
			lParam.listeOffres.setSerialisateurJSON({
				methodeSerialisation: _serialisation.bind(this),
			});
			this.JSON.listeOffres = lParam.listeOffres;
		}
		return this.appelAsynchrone();
	}
}
Requetes.inscrire("SaisieOffresStages", ObjetRequeteSaisieOffresStages);
function _serialisation(aElement, aJSON) {
	aJSON.sujet = aElement.sujet;
	aJSON.sujetDetaille = aElement.sujetDetaille;
	aJSON.commentaire = aElement.commentaire;
	aJSON.dureeEnJours = aElement.dureeEnJours;
	aJSON.nbPropose = aElement.nbPropose;
	if (!!aElement.periodes) {
		aElement.periodes.setSerialisateurJSON({
			methodeSerialisation: _serialisationPeriode.bind(this),
			ignorerEtatsElements: true,
		});
		aJSON.periodes = aElement.periodes;
	}
}
function _serialisationPeriode(aElement, aJSON) {
	$.extend(aJSON, aElement.copieToJSON());
}
module.exports = { ObjetRequeteSaisieOffresStages };
