const { MethodesObjet } = require("MethodesObjet.js");
const { GDate } = require("ObjetDate.js");
const ObjetUtilitaireDevoirEvaluation = {
	getProchaineDateOuvreePourPublication(aDateDevoirOuEvaluation) {
		let lDate = new Date(aDateDevoirOuEvaluation.getTime());
		let lJourDecalage =
			GParametres.nbJDecalageDatePublicationParDefautDevoirEval;
		if (!MethodesObjet.isNumber(lJourDecalage)) {
			lJourDecalage = 1;
		}
		if (lJourDecalage !== 0) {
			const lNbJoursAbsolu = Math.abs(lJourDecalage);
			lDate = GDate.getJourSuivant(lDate, lNbJoursAbsolu);
			const lPas = lJourDecalage < 0 ? -1 : 1;
			while (
				!GDate.estUnJourOuvre(lDate) ||
				(_estUnJourFerie(lDate) && lDate < GDate.derniereDate)
			) {
				lDate = GDate.getJourSuivant(lDate, lPas);
			}
		}
		return lDate;
	},
};
function _estUnJourFerie(aDate) {
	let lEstJourFerie = false;
	if (GParametres.listeJoursFeries) {
		for (const lPeriodeFeriee of GParametres.listeJoursFeries) {
			if (
				lPeriodeFeriee &&
				lPeriodeFeriee.dateDebut &&
				lPeriodeFeriee.dateFin &&
				GDate.dateEntreLesDates(
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
module.exports = { ObjetUtilitaireDevoirEvaluation };
