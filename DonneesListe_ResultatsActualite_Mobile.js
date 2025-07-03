exports.DonneesListe_ResultatsActualite_Mobile = exports.ETypeFiltreRepondus =
	void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
var ETypeFiltreRepondus;
(function (ETypeFiltreRepondus) {
	ETypeFiltreRepondus[(ETypeFiltreRepondus["tous"] = 0)] = "tous";
	ETypeFiltreRepondus[(ETypeFiltreRepondus["repondus"] = 1)] = "repondus";
	ETypeFiltreRepondus[(ETypeFiltreRepondus["nonRepondus"] = 2)] = "nonRepondus";
})(
	ETypeFiltreRepondus ||
		(exports.ETypeFiltreRepondus = ETypeFiltreRepondus = {}),
);
class DonneesListe_ResultatsActualite_Mobile extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeDonnees) {
		super(aListeDonnees);
		this.setOptions({ avecEllipsis: false, avecBoutonActionLigne: false });
	}
	getTitreZonePrincipale(aParams) {
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str("span", null, aParams.article.getLibelle(), " "),
			IE.jsx.str("span", null, aParams.article.prenom),
		);
	}
	getInfosSuppZonePrincipale(aParams) {
		const lLibelle = [];
		if (aParams.article.estCumul) {
			let lNbRepondues = aParams.article.nbRecue;
			let lNbTotal = aParams.article.nbAttendue;
			lLibelle.push(
				ObjetTraduction_1.GTraductions.getValeur(
					lNbRepondues < 2
						? "infoSond.reponseSurNbTotal"
						: "infoSond.reponsesSurNbTotal",
					[lNbRepondues, lNbTotal],
				),
			);
		}
		return lLibelle.join("");
		return;
	}
	getZoneComplementaire(aParams) {
		if (aParams.article.estCumul && aParams.article.pourcentageRecue) {
			return IE.jsx.str(
				"div",
				null,
				IE.jsx.str("span", null, aParams.article.pourcentageRecue, " %"),
			);
		}
		if (aParams.article.estCumul && !aParams.article.pourcentageRecue) {
			return IE.jsx.str("div", null, IE.jsx.str("span", null, "0 %"));
		}
		if (!aParams.article.estCumul && aParams.article.repondu === true) {
			return IE.jsx.str(
				"div",
				null,
				IE.jsx.str("i", {
					class: "icon_ok color-green-foncee",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.ColonneRepondu",
					),
					role: "img",
				}),
			);
		}
	}
}
exports.DonneesListe_ResultatsActualite_Mobile =
	DonneesListe_ResultatsActualite_Mobile;
