exports.TradGlossaireSuiviResultatsCompetences = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const TradGlossaireSuiviResultatsCompetences =
	ObjetTraduction_1.TraductionsModule.getModule(
		"GlossaireSuiviResultatsCompetences",
		{
			ListeCompetencesNonMaitrisees: "",
			ListeCompetencesMaitrisees: "",
			Colonnes: {
				Items: "",
				Jauge: "",
				Eleves: "",
				NbCompetencesSucces: "",
				NbCompetencesEchecs: "",
			},
			HintColonnes: { NbCompetencesSucces: "", NbCompetencesEchecs: "" },
			FenetreOptionsAff: {
				Titre: "",
				CompetencesNonMaitrisees: "",
				CompetencesMaitrisees: "",
				EchecCompetenceSi: "",
				SuccesCompetenceSi: "",
				AuMoins: "",
				PourcentageEvalsCompEvaluees: "",
				wai: { SelectionPourcentage: "" },
				ElementsUtilisesDansCalcul: "",
				CalculParElementsSignifiants: "",
				CalculParCompetences: "",
			},
		},
	);
exports.TradGlossaireSuiviResultatsCompetences =
	TradGlossaireSuiviResultatsCompetences;
