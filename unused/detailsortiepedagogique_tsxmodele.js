exports.ModeleDetailSortiePedagogique = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
exports.ModeleDetailSortiePedagogique = {
	getHtml: (aParams) => {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "DetailSortiePedagogique AvecSelectionTexte" },
				IE.jsx.str(
					"table",
					{ class: "dsp_champs" },
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str("td", null, aParams.strGenreRess, " :"),
						IE.jsx.str("td", null, aParams.strRess),
					),
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str(
							"td",
							null,
							ObjetTraduction_1.GTraductions.getValeur("EDT.AbsRess.Motif"),
							" :",
						),
						IE.jsx.str("td", null, aParams.motif),
					),
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str(
							"td",
							null,
							ObjetTraduction_1.GTraductions.getValeur("EDT.AbsRess.Date"),
							" :",
						),
						IE.jsx.str("td", null, aParams.strDate),
					),
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str(
							"td",
							null,
							ObjetTraduction_1.GTraductions.getValeur("EDT.AbsRess.Duree"),
							" :",
						),
						IE.jsx.str("td", null, aParams.duree),
					),
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str(
							"td",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AbsRess.Accompagnateurs",
							),
							" :",
						),
						IE.jsx.str("td", null, aParams.accompagnateurs),
					),
				),
				aParams.avecMemoVisible &&
					IE.jsx.str(
						"div",
						{ class: "dsp_Memo" },
						IE.jsx.str(
							"div",
							{ class: "dsp_titreMemo" },
							ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AbsRess.TitreMemoAbsence",
							),
						),
						IE.jsx.str("div", null, aParams.getMemo()),
					),
			),
		);
	},
};
