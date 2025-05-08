exports.ModeleDetailProgrammationPunition = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
exports.ModeleDetailProgrammationPunition = {
	getHtml: (aParams) => {
		return IE.jsx.str(
			"table",
			{ class: "cellspacing-3" },
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{
						class: "AlignementDroit AlignementHaut Insecable",
						style: "width:1px;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Demande",
					),
					" :",
				),
				IE.jsx.str("td", { class: "Gras" }, aParams.details.demande),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{ class: "AlignementDroit AlignementHaut Insecable" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Motifs",
					),
					" :",
				),
				IE.jsx.str("td", { class: "Gras" }, aParams.details.motifs),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{
						class: "AlignementDroit AlignementHaut Insecable",
						style: "padding-top:10px;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Circonstances",
					),
					" :",
				),
				IE.jsx.str(
					"td",
					{ class: "Gras", style: "padding-top:10px;" },
					IE.jsx.str(
						"div",
						{ style: `overflow:auto;${aParams.styleMaxTaille}` },
						aParams.circonstances,
					),
				),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{
						class: "AlignementDroit AlignementHaut Insecable",
						style: "padding-top:10px;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Duree",
					),
					" :",
				),
				IE.jsx.str(
					"td",
					{ class: "Gras", style: "padding-top:10px;" },
					aParams.details.duree,
				),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{ class: "AlignementDroit AlignementHaut Insecable" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Etat",
					),
					" :",
				),
				IE.jsx.str("td", { class: "Gras" }, aParams.details.realise),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{ class: "AlignementDroit AlignementHaut Insecable" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Surveillant",
					),
					" :",
				),
				IE.jsx.str("td", { class: "Gras" }, aParams.details.surveillant),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{ class: "AlignementDroit AlignementHaut Insecable" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.SalleOuLieu",
					),
					" :",
				),
				IE.jsx.str("td", { class: "Gras" }, aParams.details.salle),
			),
			IE.jsx.str(
				"tr",
				null,
				IE.jsx.str(
					"td",
					{ class: "AlignementDroit AlignementHaut Insecable" },
					ObjetTraduction_1.GTraductions.getValeur(
						"ObjetFenetre_ProgrammationPunition.Tache",
					),
					" :",
				),
				IE.jsx.str(
					"td",
					{ class: "Gras" },
					IE.jsx.str(
						"div",
						{ style: `overflow:auto;${aParams.styleMaxTaille}` },
						aParams.commentaire,
					),
				),
			),
		);
	},
};
