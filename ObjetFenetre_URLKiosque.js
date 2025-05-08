const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GImage } = require("ObjetImage.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_URLKiosque extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			cbSelect: {
				getValue: function (aIndice) {
					return (
						aInstance.listeRessourcesEdit &&
						aInstance.listeRessourcesEdit.get(aIndice) &&
						aInstance.listeRessourcesEdit.get(aIndice).estRessourceDeCours
					);
				},
				setValue: function (aIndice, aValue) {
					if (
						aInstance.listeRessourcesEdit &&
						aInstance.listeRessourcesEdit.get(aIndice)
					) {
						const lRessource = aInstance.listeRessourcesEdit.get(aIndice);
						lRessource.estRessourceDeCours = aValue;
					}
				},
			},
			btnParametrage: {
				event() {
					aInstance.setOptionsFenetre({
						titre: GTraductions.getValeur(
							"CahierDeTexte.kiosque.fenetre.titreSelect",
						),
					});
					aInstance.setAvecParametrage();
					aInstance.actualiser();
				},
				getTitle() {
					return GTraductions.getValeur(
						"CahierDeTexte.kiosque.fenetre.titreSelect",
					);
				},
			},
		});
	}
	setAvecParametrage() {
		this.avecParametrage = true;
		this.setBoutonVisible(0, true);
		this.setBoutonVisible(1, true);
	}
	setDonnees(aParam) {
		this.avecParametrage = false;
		this.listeRessources = aParam.listeRessources;
		this.listeRessourcesEdit = MethodesObjet.dupliquer(this.listeRessources);
		if (!!aParam.avecParametrage) {
			this.setAvecParametrage();
		}
		this.afficher(this.composeContenu());
	}
	composeContenu() {
		if (!this.listeRessources) {
			return "";
		}
		const H = [];
		let lMinWidth = 0;
		this.listeRessources.parcourir((aElement) => {
			if (aElement.logo) {
				lMinWidth = Math.max(lMinWidth, 78);
			} else {
				const lWidth = Math.ceil(
					GChaine.getLongueurChaineDansDiv(aElement.editeur, 10, false),
				);
				lMinWidth = Math.max(lMinWidth, lWidth);
			}
		});
		H.push(
			'<div style="padding:0px 2px 2px ',
			!this.avecParametrage ? "2" : "0",
			"px;max-width:",
			this.optionsFenetre.largeur,
			'px;margin:0 auto;">',
		);
		H.push('<div style="height:12px;">');
		if (!this.avecParametrage) {
			H.push(
				'<ie-btnicon ie-model="btnParametrage" style="float:right; font-size: 2rem;" class="icon_cog"></ie-btnicon>',
			);
		}
		H.push("</div>");
		for (
			let i = 0;
			this.listeRessources && i < this.listeRessources.count();
			i++
		) {
			const lRessource = this.listeRessources.get(i);
			if (lRessource.estRessourceDeCours || this.avecParametrage) {
				H.push(
					'<div style="padding:0px 5px 5px ',
					!this.avecParametrage ? "5" : "0",
					'px;">',
					ObjetFenetre_URLKiosque.composeLienRessource.call(
						this.Pere,
						lRessource,
						i,
						lMinWidth,
						this.avecParametrage,
						this.optionsFenetre.largeur,
					),
					"</div>",
				);
			}
		}
		H.push("</div>");
		return H.join("");
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		if (this.optionsFenetre.callback) {
			this.optionsFenetre.callback(aNumeroBouton);
		}
		this.callback.appel(aNumeroBouton, this.listeRessourcesEdit);
	}
	static composeLienRessource(
		aRessource,
		aIndice,
		aMinWidth,
		aAvecParametrage,
		aLargeur,
	) {
		const H = [];
		const lMinWidth = !!aMinWidth ? " min-width: " + aMinWidth + "px;" : "";
		const lWidth = Math.max(
			(!!aLargeur ? aLargeur : 800) -
				10 -
				aMinWidth -
				5 -
				(!!aAvecParametrage ? 13 : 0),
			200,
		);
		const lMaxWidth = !!aLargeur ? "max-width: " + lWidth + "px;" : "";
		H.push(
			'<div style="display: flex; align-items:center;">',
			!!aAvecParametrage
				? '<div class="InlineBlock AlignementMilieuVertical"><ie-checkbox ie-model="cbSelect(' +
						aIndice +
						')"></ie-checkbox></div>'
				: "",
			aRessource.logo
				? '<div style="margin-right: 5px;' +
						lMinWidth +
						'" ' +
						(aRessource.avecLien
							? ' ie-hint="' +
								GTraductions.getValeur("CahierDeTexte.avecLien") +
								'"'
							: "") +
						">" +
						GImage.composeImage(aRessource.logo, aMinWidth) +
						"</div>"
				: '<div class="NoWrap" style="margin-right: 5px;' +
						lMinWidth +
						'">' +
						aRessource.editeur +
						"</div>",
			GChaine.composerUrlLienExterne({
				documentJoint: aRessource,
				title: aRessource.description,
				libelleEcran: aRessource.titre,
				maxWidth: lMaxWidth,
			}),
			"</div>",
		);
		return H.join("");
	}
}
module.exports = { ObjetFenetre_URLKiosque };
