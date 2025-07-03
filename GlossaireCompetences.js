exports.TradGlossaireCompetences = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const TradGlossaireCompetences = ObjetTraduction_1.TraductionsModule.getModule(
	"GlossaireCompetences",
	{
		ServiceNonImprimable: "",
		OuvrirDetailEval: "",
		MoyenneGenerale: "",
		validationAuto: {
			hintBouton: "",
			hintBoutonCN: "",
			hintBoutonDomaines: "",
		},
	},
);
exports.TradGlossaireCompetences = TradGlossaireCompetences;
