const { GDate } = require("ObjetDate.js");
const {
	ObjetUtilitaireDevoirEvaluation,
} = require("ObjetUtilitaireDevoirEvaluation.js");
const ObjetUtilitaireDevoir = {
	getDatePublicationDevoirParDefaut(aDateDevoir) {
		return GDate.getDateBornee(
			ObjetUtilitaireDevoirEvaluation.getProchaineDateOuvreePourPublication(
				aDateDevoir,
			),
		);
	},
};
module.exports = { ObjetUtilitaireDevoir };
