exports.ObjetRequeteSaisieOffresStages = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieOffresStages extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		const lParam = { listeOffres: null };
		$.extend(lParam, aParam);
		if (lParam.listeOffres) {
			lParam.listeOffres.setSerialisateurJSON({
				methodeSerialisation: this._serialisation.bind(this),
			});
			this.JSON.listeOffres = lParam.listeOffres;
		}
		return this.appelAsynchrone();
	}
	_serialisation(aElement, aJSON) {
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
}
exports.ObjetRequeteSaisieOffresStages = ObjetRequeteSaisieOffresStages;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieOffresStages",
	ObjetRequeteSaisieOffresStages,
);
function _serialisationPeriode(aElement, aJSON) {
	$.extend(aJSON, aElement.copieToJSON());
}
