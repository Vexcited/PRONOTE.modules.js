exports.TradGlossaireWAI = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const TradGlossaireWAI = ObjetTraduction_1.TraductionsModule.getModule(
	"GlossaireWAI",
	{
		wai: { Aide: "" },
		heures: "",
		colonne: "",
		ligne: "",
		Coche: "",
		Decoche: "",
		CochePartiel: "",
		PeriodeCloturee: "",
		ContenusExcluRGAA: "",
	},
);
exports.TradGlossaireWAI = TradGlossaireWAI;
