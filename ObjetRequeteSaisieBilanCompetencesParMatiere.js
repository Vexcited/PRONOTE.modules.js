exports.ObjetRequeteSaisieBilanCompetencesParMatiere = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieBilanCompetencesParMatiere extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		if (
			this.JSON.listeElementsCompetences &&
			this.JSON.listeElementsCompetences.existeElementPourValidation()
		) {
			this.JSON.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: this._serialiserElementCompetence.bind(this),
			});
		}
		return this.appelAsynchrone();
	}
	_serialiserElementCompetence(aElement, aJSON) {
		if (
			aElement.listeColonnesServices &&
			aElement.listeColonnesServices.existeElementPourValidation()
		) {
			aElement.listeColonnesServices.setSerialisateurJSON({
				methodeSerialisation: this._serialiserColonneService,
			});
			aJSON.listeColonnesServices = aElement.listeColonnesServices;
		}
	}
	_serialiserColonneService(aElement, aJSON) {
		aJSON.niveau = aElement.niveauAcqui;
	}
}
exports.ObjetRequeteSaisieBilanCompetencesParMatiere =
	ObjetRequeteSaisieBilanCompetencesParMatiere;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieBilanCompetencesParMatiere",
	ObjetRequeteSaisieBilanCompetencesParMatiere,
);
