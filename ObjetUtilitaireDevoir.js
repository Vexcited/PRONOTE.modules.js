exports.ObjetUtilitaireDevoir = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetUtilitaireDevoirEvaluation_1 = require("ObjetUtilitaireDevoirEvaluation");
const ObjetUtilitaireDevoir = {
	getDatePublicationDevoirParDefaut(aDateDevoir) {
		return ObjetDate_1.GDate.getDateBornee(
			ObjetUtilitaireDevoirEvaluation_1.ObjetUtilitaireDevoirEvaluation.getProchaineDateOuvreePourPublication(
				aDateDevoir,
			),
		);
	},
};
exports.ObjetUtilitaireDevoir = ObjetUtilitaireDevoir;
