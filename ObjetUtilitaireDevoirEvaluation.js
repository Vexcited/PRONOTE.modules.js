exports.ObjetUtilitaireDevoirEvaluation = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const ObjetUtilitaireDevoirEvaluation = {
	getProchaineDateOuvreePourPublication(aDateDevoirOuEvaluation) {
		const lParametresSco = GParametres;
		let lDate = new Date(aDateDevoirOuEvaluation.getTime());
		let lJourDecalage =
			lParametresSco.nbJDecalageDatePublicationParDefautDevoirEval;
		if (!MethodesObjet_1.MethodesObjet.isNumber(lJourDecalage)) {
			lJourDecalage = 1;
		}
		if (lJourDecalage !== 0) {
			const lNbJoursAbsolu = Math.abs(lJourDecalage);
			lDate = ObjetDate_1.GDate.getJourSuivant(lDate, lNbJoursAbsolu);
			const lPas = lJourDecalage < 0 ? -1 : 1;
			while (
				!ObjetDate_1.GDate.estUnJourOuvre(lDate) ||
				(_estUnJourFerie(lDate) && lDate < ObjetDate_1.GDate.derniereDate)
			) {
				lDate = ObjetDate_1.GDate.getJourSuivant(lDate, lPas);
			}
		}
		return lDate;
	},
};
exports.ObjetUtilitaireDevoirEvaluation = ObjetUtilitaireDevoirEvaluation;
function _estUnJourFerie(aDate) {
	const lParametresSco = GParametres;
	let lEstJourFerie = false;
	if (lParametresSco.listeJoursFeries) {
		for (const lPeriodeFeriee of lParametresSco.listeJoursFeries) {
			if (
				lPeriodeFeriee &&
				lPeriodeFeriee.dateDebut &&
				lPeriodeFeriee.dateFin &&
				ObjetDate_1.GDate.dateEntreLesDates(
					aDate,
					lPeriodeFeriee.dateDebut,
					lPeriodeFeriee.dateFin,
				)
			) {
				lEstJourFerie = true;
				break;
			}
		}
	}
	return lEstJourFerie;
}
