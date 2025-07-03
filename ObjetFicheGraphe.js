exports.ObjetFicheGraphe = void 0;
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFiche_1 = require("ObjetFiche");
const AccessApp_1 = require("AccessApp");
class ObjetFicheGraphe extends ObjetFiche_1.ObjetFiche {
	constructor(...aParams) {
		super(...aParams);
		this.choixGraphe = 0;
		this.idGraphe = GUID_1.GUID.getId();
		this.avecBandeau = true;
		this.avecBoutonFermer = true;
		this.avecDeplacementSurBandeau = true;
		this.avecDeplacementSurFiche = false;
		this.setOptionsFenetre({
			titre: () => {
				return this.graphe ? this.graphe.titre : "";
			},
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioTypeGraphe: {
				getValue: function (aIndiceTypeGraphe) {
					return aInstance.choixGraphe === aIndiceTypeGraphe;
				},
				setValue: function (aIndiceTypeGraphe, aValue) {
					if (aValue) {
						aInstance.choixGraphe = aIndiceTypeGraphe;
						aInstance.surAfficher();
					}
				},
			},
		});
	}
	setDonnees(aGraphe, aParam) {
		this.graphe = aGraphe;
		this.param = aParam;
		if (aParam) {
			$.extend(true, this.controleur, aParam.controleur);
		}
		this.afficherFiche({
			left: this.EnAffichage ? null : 10,
			top: this.EnAffichage ? null : 10,
			positionSurSouris: false,
		});
	}
	surAfficher() {
		if (this.choixGraphe > 0 && !this.graphe.image[this.choixGraphe]) {
			this.choixGraphe = 0;
		}
		let lHtml;
		if (this.graphe.libelle) {
			lHtml = '<div class="Espace Gras">' + this.graphe.libelle + "</div>";
			ObjetHtml_1.GHtml.setHtml(this.idGraphe, lHtml);
		} else if (this.graphe.image[this.choixGraphe]) {
			const lIdDescr = this.graphe.alt ? `${this.Nom}_descr` : "";
			lHtml = IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("img", {
					tabindex: this.graphe.alt ? "0" : "-1",
					alt: this.graphe.titre,
					"aria-describedby": lIdDescr || false,
					src: `data:image/png;base64,${this.graphe.image[this.choixGraphe]}`,
				}),
				lIdDescr
					? IE.jsx.str("p", { class: "sr-only", id: lIdDescr }, this.graphe.alt)
					: "",
			);
			ObjetHtml_1.GHtml.setHtml(this.idGraphe, lHtml);
		}
	}
	composeContenu() {
		var _a;
		const lHtml = [];
		if (this.param && this.param.filtres) {
			for (let i in this.param.filtres) {
				const lFiltre = this.param.filtres[i];
				lHtml.push(
					'<div class="EspaceHaut EspaceGauche">',
					lFiltre.html ||
						((_a = lFiltre.getHtml) === null || _a === void 0
							? void 0
							: _a.call(lFiltre)) ||
						"",
					"</div>",
				);
			}
		}
		if (this.graphe.titreChoixGraphe) {
			lHtml.push(
				'<div class="Espace">',
				'<fieldset class="Texte10" style="border:1px solid ',
				(0, AccessApp_1.getApp)().getCouleur().fenetre.intermediaire,
				';">',
				'<legend class="Espace">',
				"<label>",
				this.graphe.titreChoixGraphe,
				"</label>",
				"</legend>",
			);
			for (let I = 0; I < this.graphe.libelleChoixGraphe.length; I++) {
				lHtml.push(
					'<div class="InlineBlock GrandEspaceGauche">',
					'<ie-radio ie-model="radioTypeGraphe(',
					I,
					')">',
					this.graphe.libelleChoixGraphe[I],
					"</ie-radio>",
					"</div>",
				);
			}
			lHtml.push("</fieldset>", "</div>");
		}
		lHtml.push('<div id="', this.idGraphe, '" style="margin: 5px;"></div>');
		return lHtml.join("");
	}
}
exports.ObjetFicheGraphe = ObjetFicheGraphe;
