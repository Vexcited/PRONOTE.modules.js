exports.ObjetFenetre_LienPdf = void 0;
require("DeclarationJQuery");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_LienPdf extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._delaiFermeture = 2 * 60;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"GenerationPDF.Lien.TitreLienPDF",
			),
			largeur: 300,
			hauteur: 110,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	detruireInstances() {
		super.detruireInstances();
		clearTimeout(this._timerFermeture);
		clearTimeout(this._timerActualisation);
	}
	setDonneesLienPDF(aUrl) {
		const H = [];
		H.push(
			'<div class="Texte10 AlignementMilieu EspaceHaut">',
			'<a href="' +
				aUrl +
				'" target="_blank" onclick="' +
				this.getNom() +
				'.fermer()">',
			ObjetTraduction_1.GTraductions.getValeur("GenerationPDF.Lien.CliquerIci"),
			"</a>",
			"<br/>",
			"<br/>",
			'<label id="',
			this.Nom + "_timer",
			'"></label>',
			"</div>",
		);
		this.afficher(H.join(""));
		this._timerFermeture = setTimeout(
			this.fermer.bind(this),
			this._delaiFermeture * 1000,
		);
		this._actualiserTimer(this._delaiFermeture);
	}
	_actualiserTimer(aNombreSecondes) {
		const lNombreSecondes = aNombreSecondes - 1;
		this._timerActualisation = setTimeout(
			this._actualiserTimer.bind(this, lNombreSecondes),
			1000,
		);
		ObjetHtml_1.GHtml.setHtml(
			this.Nom + "_timer",
			ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"GenerationPDF.Lien.LienValidePendant",
				),
				[aNombreSecondes],
			),
		);
	}
}
exports.ObjetFenetre_LienPdf = ObjetFenetre_LienPdf;
