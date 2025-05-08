const { Serialiser_QCM } = require("Serialiser_QCM.js");
class SerialiserQCM_PN extends Serialiser_QCM {
	constructor(...aParams) {
		super(...aParams);
	}
	qcm(aElement, aJSON) {
		const lPourValidationCP = super.qcm(aElement, aJSON);
		if (!!aElement.listeContributeurs) {
			aJSON.listeContributeurs = aElement.listeContributeurs;
			aElement.listeContributeurs.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		if (aElement.ListeThemes) {
			aJSON.ListeThemes = aElement.ListeThemes.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		return lPourValidationCP || aElement.pourValidation();
	}
}
module.exports = { SerialiserQCM_PN };
