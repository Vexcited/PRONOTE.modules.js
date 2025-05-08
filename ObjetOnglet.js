exports.ObjetOnglet = void 0;
const ParametresAffichageOnglet_1 = require("ParametresAffichageOnglet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Divers_1 = require("Enumere_Divers");
const ObjetIdentite_1 = require("ObjetIdentite");
class ObjetOnglet extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.NomTable = this.Nom + "_idTable";
		this.NomCellule = this.Nom + "_idTd";
	}
	setParametres(aLibelle, aImages, aGenre, aPosition, aHint, aVisible, aActif) {
		this.libelle = aLibelle !== null && aLibelle !== undefined ? aLibelle : "";
		this.images = aImages;
		this.genre = aGenre !== null && aGenre !== undefined ? aGenre : 0;
		this.position =
			aPosition !== null && aPosition !== undefined ? aPosition : this.genre;
		this.hint = aHint !== null && aHint !== undefined ? aHint : "";
		this.visible =
			aVisible !== null && aVisible !== undefined ? aVisible : true;
		this.actif = aActif !== null && aActif !== undefined ? aActif : true;
		this.selectionne = false;
		this.survol = false;
		this.tailleImage = 25;
	}
	setParametresAffichage(aPAActif, aPAInactif) {
		this.parametresAffichageActif =
			aPAActif !== null && aPAActif !== undefined
				? aPAActif
				: new ParametresAffichageOnglet_1.ParametresAffichageOnglet();
		this.parametresAffichageInactif =
			aPAInactif !== null && aPAInactif !== undefined
				? aPAInactif
				: new ParametresAffichageOnglet_1.ParametresAffichageOnglet();
	}
	setVisible(aVisible) {
		this.visible = aVisible;
	}
	estVisible() {
		return this.visible;
	}
	setSelection(aSelectionne) {
		this.selectionne = aSelectionne;
		this.afficher();
	}
	afficher() {
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage());
	}
	construireAffichage() {
		const H = [];
		if (!this.visible) {
		} else {
			H.push(this.afficherOnglet(this.getParametresAffichageCourant()));
		}
		return H.join("");
	}
	afficherOnglet(aParametresAffichage) {
		const H = [];
		H.push(
			'<table id="' +
				this.NomTable +
				'" style="height:' +
				aParametresAffichage.getHauteur(this.selectionne, this.survol) +
				"px;",
		);
		H.push(
			"background-color : " +
				aParametresAffichage.getCouleur(
					this.selectionne,
					this.survol && !this.selectionne,
				) +
				";",
		);
		H.push(
			"border-top : " +
				aParametresAffichage.getEpaisseurBordureCoinSuperieurGauche(
					this.selectionne,
					this.survol,
				) +
				"px solid " +
				(aParametresAffichage.getAvecBordure(this.selectionne, this.survol)
					? aParametresAffichage.getCouleurBordureCoinSuperieurGauche(
							this.selectionne,
							this.survol,
						)
					: aParametresAffichage.getCouleur(this.selectionne, this.survol)) +
				";",
		);
		H.push(
			"border-left : " +
				aParametresAffichage.getEpaisseurBordureCoinSuperieurGauche(
					this.selectionne,
					this.survol,
				) +
				"px solid " +
				(aParametresAffichage.getAvecBordure(this.selectionne, this.survol)
					? aParametresAffichage.getCouleurBordureCoinSuperieurGauche(
							this.selectionne,
							this.survol,
						)
					: aParametresAffichage.getCouleur(this.selectionne, this.survol)) +
				";",
		);
		H.push(
			"border-right : " +
				aParametresAffichage.getEpaisseurBordureCoinInferieurDroit(
					this.selectionne,
					this.survol,
				) +
				"px solid " +
				(aParametresAffichage.getAvecBordure(this.selectionne, this.survol)
					? aParametresAffichage.getCouleurBordureCoinInferieurDroit(
							this.selectionne,
							this.survol,
						)
					: aParametresAffichage.getCouleur(this.selectionne, this.survol)) +
				';">',
		);
		H.push("<tr>");
		H.push('<td id="' + this.NomCellule + '" tabindex="0"');
		H.push(
			' style="color : ' +
				aParametresAffichage.getCouleurTexte(this.selectionne, this.survol) +
				';" ',
		);
		H.push('class="AvecMain EspaceGauche ');
		H.push(
			this.getClassTexteDepuisTaillePolice(
				aParametresAffichage.getTailleTexte(this.selectionne, this.survol),
			) + " ",
		);
		if (aParametresAffichage.getTexteGras(this.selectionne, this.survol)) {
			H.push("Gras ");
		}
		if (aParametresAffichage.getTexteSouligne(this.selectionne, this.survol)) {
			H.push("Souligne ");
		}
		switch (
			aParametresAffichage.getTexteAlignement(this.selectionne, this.survol)
		) {
			case Enumere_Divers_1.EAlignementHorizontal.gauche:
				H.push("AlignementGauche ");
				break;
			case Enumere_Divers_1.EAlignementHorizontal.droit:
				H.push("AlignementDroit ");
				break;
			case Enumere_Divers_1.EAlignementHorizontal.centre:
				H.push("AlignementMilieu ");
				break;
		}
		H.push('" ');
		H.push('title="' + this.hint + '" ');
		H.push('onclick="' + this.Nom + '.surOnclick();" ');
		H.push('onmouseover="' + this.Nom + '.surMouseOver();" ');
		H.push('onmouseout="' + this.Nom + '.surMouseOut();" ');
		H.push(">");
		H.push('<div class="flex-contain flex-center">');
		if (this.images) {
			H.push(
				'<div id="',
				this.Nom,
				'_image_0" style="flex:none; ',
				ObjetStyle_1.GStyle.composeHeight(this.tailleImage),
				ObjetStyle_1.GStyle.composeWidth(this.tailleImage),
				this.selectionne ? "" : "display: none;",
				'" class="m-right ',
				this.images[0],
				'">&nbsp;</div>',
			);
			H.push(
				'<div id="',
				this.Nom,
				'_image_1" style="flex:none; ',
				ObjetStyle_1.GStyle.composeHeight(this.tailleImage),
				ObjetStyle_1.GStyle.composeWidth(this.tailleImage),
				this.selectionne ? "display: none;" : "",
				'" class="m-right ',
				this.images[1],
				'">&nbsp;</div>',
			);
		}
		H.push(
			'<div style="position:relative;">',
			'<div style="position:relative; visibility:hidden;" class="Insecable p-right-l Gras">',
			this.libelle,
			"</div>",
			'<div style="position:absolute;top:0;left:0;">',
			this.libelle,
			"</div>",
			"</div>",
		);
		H.push("</div>");
		H.push("</td>");
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
	surOnclick() {
		this.callback.appel({ genre: this.genre, position: this.position });
	}
	surMouseOver() {
		this.surEvenementSurvol(true);
	}
	surMouseOut() {
		this.surEvenementSurvol(false);
	}
	surEvenementSurvol(aSurvol) {
		const lParametresAffichage = this.getParametresAffichageCourant();
		ObjetHtml_1.GHtml.delClass(
			this.NomCellule,
			this.getClassTexteDepuisTaillePolice(
				lParametresAffichage.getTailleTexte(this.selectionne, !aSurvol),
			),
		);
		ObjetHtml_1.GHtml.addClass(
			this.NomCellule,
			this.getClassTexteDepuisTaillePolice(
				lParametresAffichage.getTailleTexte(this.selectionne, aSurvol),
			),
		);
		ObjetStyle_1.GStyle.setGras(
			this.NomCellule,
			lParametresAffichage.getTexteGras(this.selectionne, aSurvol),
		);
		ObjetStyle_1.GStyle.setCouleurFond(
			this.NomCellule,
			lParametresAffichage.getCouleur(
				this.selectionne,
				aSurvol && !this.selectionne,
			),
		);
		ObjetStyle_1.GStyle.setDisplay(
			this.Nom + "_image_0",
			aSurvol || this.selectionne,
		);
		ObjetStyle_1.GStyle.setDisplay(
			this.Nom + "_image_1",
			!(aSurvol || this.selectionne),
		);
	}
	getParametresAffichageCourant() {
		if (this.actif) {
			return this.parametresAffichageActif;
		} else {
			return this.parametresAffichageInactif;
		}
	}
	getClassTexteDepuisTaillePolice(aTaillePolice) {
		return "Texte" + aTaillePolice;
	}
}
exports.ObjetOnglet = ObjetOnglet;
