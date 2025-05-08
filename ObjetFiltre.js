exports.ObjetFiltre = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFiltre extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.IdNomConteneurFiltre = this.Nom + "_ConteneurFiltre";
		this.IdPremierElement = this.IdNomConteneurFiltre;
		this.avecBtnReinit = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			objetFiltreBtnFiltre: {
				getClass() {
					return aInstance.estFiltresParDefaut()
						? "icon_filtre avecFond"
						: "icon_filtre avecFond mix-icon_rond i-orange";
				},
				event() {
					aInstance.EstAffiche = !aInstance.EstAffiche;
					ObjetStyle_1.GStyle.setDisplay(
						aInstance.Nom,
						aInstance.EstAffiche,
						200,
					);
					if (aInstance.EstAffiche) {
						ObjetHtml_1.GHtml.getParentScrollable(aInstance.Nom).scrollTop = 0;
					}
				},
				getSelection() {
					return aInstance.EstAffiche;
				},
			},
			objetFiltreBtnReinitFiltres: {
				event() {
					aInstance.reinitFiltres();
				},
			},
		});
	}
	construireAffichage(aHtml) {
		if (!aHtml) {
			return "";
		}
		const H = [];
		H.push(
			'<section id="' + this.IdNomConteneurFiltre + '"',
			' role="group"',
			' aria-label="',
			ObjetTraduction_1.GTraductions.getValeur("liste.Filtrer"),
			'"',
			' class="zone-filtres objet-filtre">',
		);
		H.push(aHtml);
		if (this.avecBtnReinit) {
			H.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"article",
						{ class: "filtre-footer" },
						IE.jsx.str(
							"ie-bouton",
							{ "ie-model": "objetFiltreBtnReinitFiltres", class: "small-bt" },
							ObjetTraduction_1.GTraductions.getValeur(
								"liste.ReinitialiserFiltre",
							),
						),
					),
				),
			);
		}
		H.push("</section>");
		return H.join("");
	}
	getBtnPourAddSurZone() {
		return { html: this._getHtmlBtnFiltre(), controleur: this.controleur };
	}
	setHtmlBoutonFiltre(aId) {
		ObjetHtml_1.GHtml.setHtml(aId, this._getHtmlBtnFiltre(), {
			controleur: this.controleur,
		});
	}
	setDonnees(aHtml, aParametres) {
		if (aHtml && aParametres) {
			if (aParametres.estFiltresParDefaut) {
				this.estFiltresParDefaut = aParametres.estFiltresParDefaut;
			}
			if (aParametres.reinitFiltres) {
				this.avecBtnReinit = true;
				this.reinitFiltres = aParametres.reinitFiltres;
			}
			this.afficher(aHtml, aParametres);
		}
	}
	afficher(aHtml, aParametres) {
		Object.assign(aParametres.controleur, this.controleur);
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(aHtml), {
			controleur: aParametres.controleur,
		});
		ObjetStyle_1.GStyle.setDisplay(this.Nom, !!aParametres.avecAffichageDirect);
		this.EstAffiche = !!aParametres.avecAffichageDirect;
	}
	reinitFiltres() {}
	estFiltresParDefaut() {
		return true;
	}
	_getHtmlBtnFiltre() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "m-all-l text-end" },
				IE.jsx.str("ie-btnicon", {
					"ie-class": "objetFiltreBtnFiltre.getClass",
					"ie-model": "objetFiltreBtnFiltre",
					title: ObjetTraduction_1.GTraductions.getValeur("liste.Filtrer"),
				}),
			),
		);
	}
}
exports.ObjetFiltre = ObjetFiltre;
