const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFiche_Espace_1 = require("ObjetFiche_Espace");
class ObjetFichePhotos extends ObjetFiche_Espace_1.ObjetFiche_Espace {
	constructor(...aParams) {
		super(...aParams);
		this.largeurPhoto = 78;
		this.hauteurPhoto = 100;
		this.altImage = "";
		this.avecDeplacementSurBandeau = false;
		this.avecDeplacementSurFiche = true;
		this.avecBandeau = false;
		this.idImage = this.Nom + "_Image";
		this.idCommentaire = this.Nom + "_Commentaire";
		this.setOptionsFenetre({ titre: "&nbsp;" });
	}
	setDonnees(
		aId,
		aURL,
		aCallback,
		aBloquerFocus,
		aCommentaire,
		aAltImage = "",
	) {
		this.url = aURL;
		this.setOptionsFenetre({ bloquerFocus: !!aBloquerFocus });
		this.commentaire = aCommentaire || "";
		this.altImage = aAltImage || "";
		this.afficherFiche({ id: aId, positionSurSouris: true });
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCroixFermeture: {
				event() {
					aInstance.fermer();
				},
			},
		});
	}
	surAfficher() {
		if (super.surAfficher) {
			super.surAfficher();
		}
		if (this.url) {
			const lHtml = IE.jsx.str("img", {
				alt: this.altImage || false,
				style: "width: " + this.largeurPhoto + "px;",
				"ie-load-src": this.url,
				class: "img-portrait",
				"ie-imgviewer": true,
			});
			ObjetHtml_1.GHtml.setHtml(this.idImage, lHtml, {
				controleur: this.controleur,
			});
		}
		if (this.commentaire) {
			ObjetStyle_1.GStyle.setDisplay(this.idCommentaire, true);
			ObjetHtml_1.GHtml.setHtml(this.idCommentaire, this.commentaire);
		} else {
			ObjetStyle_1.GStyle.setDisplay(this.idCommentaire, false);
		}
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			'<table class="Table" >',
			'<tr><td class="Espace">',
			'<div id="',
			this.idImage,
			'" style="width:',
			this.largeurPhoto,
			"px; height: ",
			this.hauteurPhoto,
			'px; overflow: hidden;">',
			'<img class="img-portrait" style="width: ' +
				this.largeurPhoto +
				'px;" aria-hidden="true" />',
			"</div>",
			"</td></tr>",
			"<tr><td>",
			'<div id="',
			this.idCommentaire,
			'" ie-ellipsis class="FondBlanc Espace" style="position: absolute; overflow-y: auto; white-space: normal; right: 0; left: 0; top: ',
			this.hauteurPhoto + 20,
			'px;"></div>',
			"</td></tr>",
			"</table>",
		);
		return lHtml.join("");
	}
}
module.exports = ObjetFichePhotos;
