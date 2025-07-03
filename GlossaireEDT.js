exports.TradGlossaireEDT = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const TradGlossaireEDT = ObjetTraduction_1.TraductionsModule.getModule(
	"GlossaireEDT",
	{ Ferie: "", Stage: "", ListeElevesSasnCours: "", ListeElevesDe_S: "" },
);
exports.TradGlossaireEDT = TradGlossaireEDT;
