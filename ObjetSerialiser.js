exports.ObjetSerialiser = void 0;
class ObjetSerialiser {
	executionKiosque(aElement, aJSON) {
		aJSON.ressource = aElement.ressource.toJSON();
		aJSON.dateDebutPublication = aElement.dateDebutPublication;
		aJSON.dateFinPublication = aElement.dateFinPublication;
		return aElement.pourValidation();
	}
	parcoursEducatif(aElement, aJSON) {
		if (aElement.estCumulEleve || aElement.estCumulGenreParcours) {
			return false;
		}
		if (aElement.Date) {
			aJSON.Date = aElement.Date;
		}
		if (aElement.Descr) {
			aJSON.Descr = aElement.Descr;
		}
		if (aElement.ressource) {
			aJSON.ressource = aElement.ressource.toJSON();
		}
	}
	serialiseAttestation(aElement, aJSON) {
		$.extend(aJSON, aElement.copieToJSON());
	}
	serialiseTypeAppreciationAssistSaisie(aTypeAppreciation, aJSON) {
		if (!!aTypeAppreciation.listeCategories) {
			aTypeAppreciation.listeCategories.setSerialisateurJSON({
				methodeSerialisation: this._serialiseCategorieAppreciationAssistSaisie,
			});
			aJSON.listeCategories = aTypeAppreciation.listeCategories;
		}
	}
	_serialiseCategorieAppreciationAssistSaisie(aCategorie, aJSON) {
		if (!!aCategorie.listeAppreciations) {
			aJSON.listeAppreciations = aCategorie.listeAppreciations;
		}
	}
}
exports.ObjetSerialiser = ObjetSerialiser;
