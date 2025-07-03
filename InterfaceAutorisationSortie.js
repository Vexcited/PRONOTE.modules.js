exports.InterfaceAutorisationSortie = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfacePage_1 = require("InterfacePage");
class InterfaceAutorisationSortie extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
	}
	jsxModeleRadioAutorisationSortie(aAutorisationSortie) {
		return {
			getValue: () => {
				return (
					aAutorisationSortie &&
					aAutorisationSortie.getNumero() ===
						this.donnees.selectionEleve.getNumero()
				);
			},
			setValue: (aValue) => {
				if (this.donnees.avecSaisie) {
					this.donnees.selectionEleve = aAutorisationSortie;
					this.callback.appel();
				}
			},
			getName: () => {
				return `${this.Nom}_AutorisationSortie`;
			},
		};
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this.composePage();
		}
		return "";
	}
	composePage() {
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
		H.push(
			ObjetTraduction_1.GTraductions.getValeur("AutorisationSortie.intro"),
		);
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
			H.push(
				IE.jsx.str(
					"div",
					{ class: "NoWrap", style: "padding-bottom : 10px;" },
					IE.jsx.str(
						"ie-radio",
						{
							"ie-model": this.jsxModeleRadioAutorisationSortie.bind(
								this,
								lAutorisation,
							),
							class: "InlineBlock AlignementHaut",
							style: "margin-top:1px",
						},
						lDescriptif,
					),
				),
			);
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
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"p",
					{ class: "a-savoir-conteneur" },
					ObjetTraduction_1.GTraductions.getValeur("AutorisationSortie.fixee"),
				),
				IE.jsx.str("p", { class: "a-savoir-conteneur" }, lDescriptif),
			),
		);
		return H.join("");
	}
	setDonnees(aDonnees) {
		this.donneesRecues = true;
		this.donnees = aDonnees;
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
	}
	getAutorisationSortieModifiee() {
		return !!this.donnees ? this.donnees.selectionEleve : null;
	}
}
exports.InterfaceAutorisationSortie = InterfaceAutorisationSortie;
