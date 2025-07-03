exports.ObjetFenetre_LegendeIconesMenu = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeOrigineCreationLabelAlimentaire_1 = require("TypeOrigineCreationLabelAlimentaire");
const TypeOrigineCreationAllergeneAlimentaire_1 = require("TypeOrigineCreationAllergeneAlimentaire");
class ObjetFenetre_LegendeIconesMenu extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 600,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	setDonnees(aParams) {
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("menus.TitreFenetre"),
		});
		this.listeAllergenes = aParams.listeAllergenes;
		this.listelabels = aParams.listelabels;
		this.afficher(this.composeContenu());
	}
	composeLabel() {
		const H = [];
		if (this.listelabels) {
			this.listelabels.parcourir((aLabel) => {
				H.push(`<div class="label">`);
				if (
					aLabel.getGenre() ===
						TypeOrigineCreationLabelAlimentaire_1
							.TypeOrigineCreationLabelAlimentaire.OCLA_Utilisateur &&
					!!aLabel.icone
				) {
					H.push(
						`<img  class="img" src="data:image/png;base64,${aLabel.icone}" alt="${aLabel.getLibelle()}" onerror="$(this).parent().remove();" title="${aLabel.getLibelle()}" title="${aLabel.getLibelle()}"><span aria-hidden="true">${aLabel.getLibelle()}</span>`,
					);
				} else {
					const lStyle =
						aLabel && aLabel.couleur ? `style="color:${aLabel.couleur}"` : "";
					H.push(
						`<i class="${TypeOrigineCreationLabelAlimentaire_1.TypeOrigineCreationLabelAlimentaireUtil.getClassIcone(aLabel.getGenre())} i-medium" ${lStyle} role="presentation"></i>`,
						`<span>${aLabel.getLibelle()}</span>`,
					);
				}
				H.push(`</div>`);
			});
		}
		return H.join("");
	}
	composeAllergenes() {
		const H = [];
		if (this.listeAllergenes) {
			this.listeAllergenes.parcourir((aAllergene) => {
				H.push(`<div class="allergene">`);
				if (
					aAllergene.getGenre() ===
						TypeOrigineCreationAllergeneAlimentaire_1
							.TypeOrigineCreationAllergeneAlimentaire.OCAA_Utilisateur &&
					"icone" in aAllergene
				) {
					H.push(
						`<img class="img" src="data:image/png;base64,${aAllergene.icone}" alt="${aAllergene.getLibelle()}" onerror="$(this).parent().remove();" title="${aAllergene.getLibelle()}" /><span aria-hidden="true">${aAllergene.getLibelle()}</span>`,
					);
				} else {
					const lCouleur =
						aAllergene && aAllergene.couleur ? aAllergene.couleur : "";
					H.push(
						`<i class="${TypeOrigineCreationAllergeneAlimentaire_1.TypeOrigineCreationAllergeneAlimentaireUtil.getClassIcone(aAllergene.getGenre())} i-medium" style="color:${lCouleur}" role="presentation"></i><span>${aAllergene.getLibelle()}</span>`,
					);
				}
				H.push(`</div>`);
			});
		}
		return H.join("");
	}
	composeContenu() {
		const H = [];
		H.push(
			`<div class="flex-contain cols">`,
			`<div class="ctn ctn-labels">${this.composeLabel()}</div>`,
			`<div class="ie-sous-titre">${ObjetTraduction_1.GTraductions.getValeur("menus.Allergene")} :</div>`,
			`<div class="ctn ctn-allergenes">${this.composeAllergenes()}</div>`,
			`</div>`,
		);
		return H.join("");
	}
}
exports.ObjetFenetre_LegendeIconesMenu = ObjetFenetre_LegendeIconesMenu;
