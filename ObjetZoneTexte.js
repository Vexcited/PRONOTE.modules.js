exports.ObjetZoneTexte = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetWAI_1 = require("ObjetWAI");
class ObjetZoneTexte extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idTable = this.Nom + "_IdTable";
		this.idLibelle = this.Nom + "_IdLibelle";
		this.IdPremierElement = this.idLibelle;
		this.avecRetaillage = false;
		this.couleurTexte = GCouleur.texte;
		this._options = { largeur: null, describedby: "" };
	}
	setOptionsObjetZoneTexte(aOptions) {
		$.extend(this._options, aOptions);
	}
	setParametres(aAvecRetaillage, aCouleurTexte) {
		this.avecRetaillage = aAvecRetaillage;
		this.couleurTexte = aCouleurTexte ? aCouleurTexte : this.couleurTexte;
	}
	construireAffichage() {
		const H = [];
		H.push(
			'<div id="' + this.idTable + '" ',
			this._options.largeur
				? ' style="' +
						ObjetStyle_1.GStyle.composeWidth(this._options.largeur) +
						'"'
				: "",
			">",
		);
		H.push(
			"<span ",
			this._options.describedby
				? ObjetWAI_1.GObjetWAI.composeAttribut({
						genre: ObjetWAI_1.EGenreAttribut.describedby,
						valeur: this._options.describedby + " " + this.idLibelle,
					})
				: "",
			' id="' +
				this.idLibelle +
				'" class="Texte10 Gras Insecable" style="' +
				ObjetStyle_1.GStyle.composeCouleurTexte(this.couleurTexte) +
				'"></span>',
		);
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aLibelle) {
		if (this.avecRetaillage) {
			ObjetPosition_1.GPosition.setWidth(
				this.idTable,
				ObjetChaine_1.GChaine.getLongueurChaine(aLibelle, 10, true) + 4,
			);
		}
		const lTab = aLibelle ? aLibelle.split("\n") : [];
		this.Libelle = lTab.join("<br>");
		ObjetHtml_1.GHtml.setHtml(this.idLibelle, this.Libelle, {
			controleur: this.controleur,
		});
		const lThis = this;
		$("#" + this.idLibelle.escapeJQ())
			.on("focusin", function () {
				$(this).css("box-shadow", "0 0 5px -1px " + lThis.couleurTexte);
			})
			.on("focusout", function () {
				$(this).css("box-shadow", "none");
			});
	}
	setTabIndex(aTabIndex) {
		ObjetHtml_1.GHtml.setTabIndex(this.idLibelle, aTabIndex);
	}
}
exports.ObjetZoneTexte = ObjetZoneTexte;
