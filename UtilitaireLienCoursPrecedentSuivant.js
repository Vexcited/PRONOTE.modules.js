exports.UtilitaireLienCoursPrecedentSuivant = void 0;
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
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
			this.options.idRef = GUID_1.GUID.getId();
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
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CoursPrecedent"),
			"</span>",
			'<span id="',
			this.ids.btnSuiv,
			'" tabindex="0" class="Souligne fluid-bloc" role="button">',
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CoursSuivant"),
			"</span>",
			"</div>",
		);
		return T.join("");
	}
	actualiser(aAvecCoursSelectionne, aCoursPrecedent, aCoursSuivant) {
		ObjetStyle_1.GStyle.setCouleurTexte(
			this.ids.btnPrec,
			aCoursPrecedent ? GCouleur.noir : GCouleur.grisClair,
		);
		ObjetStyle_1.GStyle.setCouleurTexte(
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
					{ callback: this._evenement.bind(this) },
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
				lTitle = ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.DernierCours",
					),
					[ObjetDate_1.GDate.formatDate(aCoursPrecedent.date, "%JJ/%MM/%AAAA")],
				);
			} else {
				lTitle = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.PlusCoursPrecedent",
				);
			}
		}
		ObjetHtml_1.GHtml.setTitle(this.ids.btnPrec, lTitle);
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
					{ callback: this._evenement.bind(this) },
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
				lTitle = ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ProchainCours",
					),
					[ObjetDate_1.GDate.formatDate(aCoursSuivant.date, "%JJ/%MM/%AAAA")],
				);
			} else {
				lTitle = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.PlusCoursSuivant",
				);
			}
		}
		ObjetHtml_1.GHtml.setTitle(this.ids.btnSuiv, lTitle);
		$(`#${this.ids.btnSuiv.escapeJQ()}`).attr("aria-label", lTitle || null);
	}
	_evenement(aPrecedent) {
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			if (this.options.callback) {
				this.options.callback(aPrecedent);
			}
		}, !this.options.controleNavigation);
	}
}
exports.UtilitaireLienCoursPrecedentSuivant =
	UtilitaireLienCoursPrecedentSuivant;
