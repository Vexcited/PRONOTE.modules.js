const { GUID } = require("GUID.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
class UtilitaireLienCoursPrecedentSuivant {
	constructor(aParametres) {
		this.options = {
			idRef: "",
			callback: null,
			controleNavigation: false,
			pere: null,
		};
		$.extend(this.options, aParametres);
		if (!this.options.idRef) {
			this.options.idRef = GUID.getId();
		}
		this.ids = {
			btnPrec: this.options.idRef + "_prec",
			btnSuiv: this.options.idRef + "_suiv",
		};
	}
	construire() {
		const T = [];
		T.push(
			'<div class="fluid-bloc flex-contain flex-gap-l">',
			'<span id="',
			this.ids.btnPrec,
			'" tabindex="0" class="Souligne fluid-bloc text-right" role="button">',
			GTraductions.getValeur("CahierDeTexte.CoursPrecedent"),
			"</span>",
			'<span id="',
			this.ids.btnSuiv,
			'" tabindex="0" class="Souligne fluid-bloc" role="button">',
			GTraductions.getValeur("CahierDeTexte.CoursSuivant"),
			"</span>",
			"</div>",
		);
		return T.join("");
	}
	actualiser(aAvecCoursSelectionne, aCoursPrecedent, aCoursSuivant) {
		GStyle.setCouleurTexte(
			this.ids.btnPrec,
			aCoursPrecedent ? GCouleur.noir : GCouleur.grisClair,
		);
		GStyle.setCouleurTexte(
			this.ids.btnSuiv,
			aCoursSuivant ? GCouleur.noir : GCouleur.grisClair,
		);
		$(`#${this.ids.btnPrec.escapeJQ()}`).attr(
			"aria-disabled",
			aCoursPrecedent ? null : "true",
		);
		$(`#${this.ids.btnSuiv.escapeJQ()}`).attr(
			"aria-disabled",
			aCoursSuivant ? null : "true",
		);
		const lClasses = "AvecMain GrasSurvol GrasFocus";
		if (aCoursPrecedent) {
			$("#" + this.ids.btnPrec.escapeJQ())
				.off()
				.on(
					{
						click: function (event) {
							event.data.callback(true);
						},
						keyup: function (event) {
							if (GNavigateur.isToucheSelection()) {
								event.data.callback(true);
							}
						},
					},
					{ callback: _evenement.bind(this) },
				)
				.addClass(lClasses);
		} else {
			$("#" + this.ids.btnPrec.escapeJQ())
				.off()
				.removeClass(lClasses);
		}
		let lTitle = "";
		if (aAvecCoursSelectionne) {
			if (aCoursPrecedent && aCoursPrecedent.date) {
				lTitle = GChaine.format(
					GTraductions.getValeur("CahierDeTexte.DernierCours"),
					[GDate.formatDate(aCoursPrecedent.date, "%JJ/%MM/%AAAA")],
				);
			} else {
				lTitle = GTraductions.getValeur("CahierDeTexte.PlusCoursPrecedent");
			}
		}
		GHtml.setTitle(this.ids.btnPrec, lTitle);
		$(`#${this.ids.btnPrec.escapeJQ()}`).attr("aria-label", lTitle || null);
		if (aCoursSuivant) {
			$("#" + this.ids.btnSuiv.escapeJQ())
				.off()
				.on(
					{
						click: function (event) {
							event.data.callback(false);
						},
						keyup: function (event) {
							if (GNavigateur.isToucheSelection()) {
								event.data.callback(false);
							}
						},
					},
					{ callback: _evenement.bind(this) },
				)
				.addClass(lClasses);
		} else {
			$("#" + this.ids.btnSuiv.escapeJQ())
				.off()
				.removeClass(lClasses);
		}
		lTitle = "";
		if (aAvecCoursSelectionne) {
			if (aCoursSuivant && aCoursSuivant.date) {
				lTitle = GChaine.format(
					GTraductions.getValeur("CahierDeTexte.ProchainCours"),
					[GDate.formatDate(aCoursSuivant.date, "%JJ/%MM/%AAAA")],
				);
			} else {
				lTitle = GTraductions.getValeur("CahierDeTexte.PlusCoursSuivant");
			}
		}
		GHtml.setTitle(this.ids.btnSuiv, lTitle);
		$(`#${this.ids.btnSuiv.escapeJQ()}`).attr("aria-label", lTitle || null);
	}
}
function _evenement(aPrecedent) {
	ControleSaisieEvenement(() => {
		if (this.options.callback) {
			this.options.callback(aPrecedent);
		}
	}, !this.options.controleNavigation);
}
module.exports = { UtilitaireLienCoursPrecedentSuivant };
