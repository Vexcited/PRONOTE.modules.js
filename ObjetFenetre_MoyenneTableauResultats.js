exports.ObjetFenetre_MoyenneTableauResultats =
	exports.TradObjetFenetre_MoyenneTableauResultats = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTraduction_2 = require("ObjetTraduction");
const TradObjetFenetre_MoyenneTableauResultats =
	ObjetTraduction_2.TraductionsModule.getModule(
		"ObjetFenetre_MoyenneTableauResultats",
		{ OuvrirFenetre: "" },
	);
exports.TradObjetFenetre_MoyenneTableauResultats =
	TradObjetFenetre_MoyenneTableauResultats;
class ObjetFenetre_MoyenneTableauResultats extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
	}
	composeTitreFormule() {
		if (this.titreFenetre) {
			this.setOptionsFenetre({ titre: this.titreFenetre + "&nbsp;" });
		}
		if (this.titreFormule) {
			return this.titreFormule;
		}
		const lTitre = this.moyenneNette
			? ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.FenetreCalculMoyenneNette",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.FenetreCalculMoyenneBrute",
				);
		return ObjetChaine_1.GChaine.format(lTitre, [this.libelleEleve, ""]);
	}
	composeContenu() {
		var _a, _b;
		const T = [];
		if (this.donneesRecues) {
			T.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"h2",
						{ class: "Texte10 Espace Gras", style: "margin-bottom: 5px;" },
						this.composeTitreFormule(),
					),
					IE.jsx.str(
						"div",
						{
							class: "Texte10 Espace FondBlanc MethodeCalculMoyenne",
							"aria-hidden": (
								(_a = this.formuleWAI) === null || _a === void 0
									? void 0
									: _a.length
							)
								? "true"
								: false,
						},
						this.formuleHTML,
					),
					((_b = this.formuleWAI) === null || _b === void 0
						? void 0
						: _b.length) &&
						IE.jsx.str("div", { class: "sr-only" }, this.formuleWAI),
					IE.jsx.str(
						"div",
						{ class: "Texte10 Espace FondBlanc MethodeCalculMoyenne" },
						this.formuleLegende,
					),
				),
			);
		}
		return T.join("");
	}
	setDonnees(aParametres) {
		const lHtml = aParametres.html;
		this.formuleHTML = ObjetChaine_1.GChaine.replaceRCToHTML(lHtml);
		this.formuleLegende = ObjetChaine_1.GChaine.replaceRCToHTML(
			aParametres.legende,
		);
		this.formuleWAI = ObjetChaine_1.GChaine.enleverEntites(aParametres.wai);
		this.titreFormule = aParametres.titreFenetre;
		this.titreFenetre = aParametres.titreFenetre;
		this.moyenneNette = aParametres.moyenneNette;
		this.libelleEleve = aParametres.libelleEleve;
		this.donneesRecues = true;
		this.actualiser();
		this.afficher();
	}
}
exports.ObjetFenetre_MoyenneTableauResultats =
	ObjetFenetre_MoyenneTableauResultats;
