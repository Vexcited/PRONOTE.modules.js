const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { InterfacePage } = require("InterfacePage.js");
class InterfaceAutorisationSortie extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			rbAutorisationSortie: {
				getValue: function (aIndice) {
					return (
						aInstance.donnees.listeAutorisationsSortie
							.get(aIndice)
							.getNumero() === aInstance.donnees.selectionEleve.getNumero()
					);
				},
				setValue: function (aIndice) {
					if (aInstance.donnees.avecSaisie) {
						aInstance.donnees.selectionEleve =
							aInstance.donnees.listeAutorisationsSortie.get(aIndice);
						aInstance.callback.appel();
					}
				},
			},
		});
	}
	construireInstances() {}
	construireAffichage() {
		if (this.donneesRecues) {
			return this.composePage();
		} else {
			return "";
		}
	}
	composePage() {
		const H = [];
		H.push(this.composeContenuPage());
		return H.join("");
	}
	composeContenuPage() {
		const H = [];
		if (this.donnees.avecSaisie) {
			H.push(this.composeContenuPageEdit());
		} else {
			H.push(this.composeContenuPageFinal());
		}
		return H.join("");
	}
	composeContenuPageEdit() {
		const H = [];
		H.push("<div>");
		H.push(GTraductions.getValeur("AutorisationSortie.intro"));
		H.push("</div>");
		H.push('<div class="GrandEspaceHaut">');
		for (
			let i = 0, lNbr = this.donnees.listeAutorisationsSortie.count();
			i < lNbr;
			i++
		) {
			const lAutorisation = this.donnees.listeAutorisationsSortie.get(i);
			let lDescriptif = lAutorisation.descriptif
				? lAutorisation.descriptif
				: lAutorisation.getLibelle();
			if (lAutorisation.listeDetailHoraires.length > 0) {
				lDescriptif += "<br>" + lAutorisation.listeDetailHoraires.join(" / ");
			}
			H.push('<div class="NoWrap" style="padding-bottom : 10px;">');
			H.push(
				'<ie-radio ie-model="rbAutorisationSortie(',
				i,
				')" class="InlineBlock AlignementHaut" style="margin-top:1px" >',
				lDescriptif,
				"</ie-radio>",
			);
			H.push("</div>");
		}
		H.push("</div>");
		return H.join("");
	}
	composeContenuPageFinal() {
		const lAutorisation =
			this.donnees.listeAutorisationsSortie.getElementParNumeroEtGenre(
				this.donnees.selectionEleve.getNumero(),
			);
		let lDescriptif = lAutorisation.descriptif
			? lAutorisation.descriptif
			: lAutorisation.getLibelle();
		if (lAutorisation.listeDetailHoraires.length > 0) {
			lDescriptif += "<br />" + lAutorisation.listeDetailHoraires.join(" / ");
		}
		const H = [];
		H.push(`<p>${GTraductions.getValeur("AutorisationSortie.fixee")}</p>`);
		H.push(`<p>${lDescriptif}</p>`);
		return H.join("");
	}
	setDonnees(aDonnees) {
		this.donneesRecues = true;
		this.donnees = aDonnees;
		GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
	}
	getAutorisationSortieModifiee() {
		return !!this.donnees ? this.donnees.selectionEleve : null;
	}
}
module.exports = { InterfaceAutorisationSortie };
