exports.SerialiserQCM_PN = void 0;
const Serialiser_QCM_1 = require("Serialiser_QCM");
class SerialiserQCM_PN extends Serialiser_QCM_1.Serialiser_QCM {
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
exports.SerialiserQCM_PN = SerialiserQCM_PN;
