exports.ObjetFenetre_URLKiosque = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetImage_1 = require("ObjetImage");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_URLKiosque extends ObjetFenetre_1.ObjetFenetre {
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
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
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.kiosque.fenetre.titreSelect",
						),
					});
					aInstance.setAvecParametrage();
					aInstance.actualiser();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
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
		this.listeRessourcesEdit = MethodesObjet_1.MethodesObjet.dupliquer(
			this.listeRessources,
		);
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
					ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
						aElement.editeur,
						10,
						false,
					),
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
					ObjetFenetre_URLKiosque.composeLienRessource(
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
			this.optionsFenetre.callback(aNumeroBouton, null);
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
		const lMaxWidth = !!aLargeur ? lWidth : 0;
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
								ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.avecLien",
								) +
								'"'
							: "") +
						">" +
						ObjetImage_1.GImage.composeImage(aRessource.logo, aMinWidth) +
						"</div>"
				: '<div class="NoWrap" style="margin-right: 5px;' +
						lMinWidth +
						'">' +
						aRessource.editeur +
						"</div>",
			ObjetChaine_1.GChaine.composerUrlLienExterne({
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
exports.ObjetFenetre_URLKiosque = ObjetFenetre_URLKiosque;
