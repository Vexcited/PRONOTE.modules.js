const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieBilanCompetencesParMatiere extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		if (
			this.JSON.listeElementsCompetences &&
			this.JSON.listeElementsCompetences.existeElementPourValidation()
		) {
			this.JSON.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: _serialiserElementCompetence,
			});
		}
		return this.appelAsynchrone();
	}
}
Requetes.inscrire(
	"SaisieBilanCompetencesParMatiere",
	ObjetRequeteSaisieBilanCompetencesParMatiere,
);
function _serialiserElementCompetence(aElement, aJSON) {
	if (
		aElement.listeColonnesServices &&
		aElement.listeColonnesServices.existeElementPourValidation()
	) {
		aElement.listeColonnesServices.setSerialisateurJSON({
			methodeSerialisation: _serialiserColonneService,
		});
		aJSON.listeColonnesServices = aElement.listeColonnesServices;
	}
}
function _serialiserColonneService(aElement, aJSON) {
	aJSON.niveau = aElement.niveauAcqui;
}
module.exports = ObjetRequeteSaisieBilanCompetencesParMatiere;
