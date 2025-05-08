exports.ObjetMenuOnglets = void 0;
const Enumere_Divers_1 = require("Enumere_Divers");
const ObjetIdentite_1 = require("ObjetIdentite");
class ObjetMenuOnglets extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.tabOnglets = null;
		this.donneesRecues = false;
	}
	construireAffichage() {
		if (this.donneesRecues) {
			const H = [];
			H.push('<div style="width:100%; float:left;');
			H.push(
				" background-color : " + this.parametresAffichage.getCouleur() + ";",
			);
			H.push(" border-bottom : 1px solid " + GCouleur.texte + ";");
			H.push('">');
			H.push('<div style=" float:');
			if (
				this.parametresAffichage.getAlignement() ===
				Enumere_Divers_1.EAlignementHorizontal.gauche
			) {
				H.push("left");
			} else {
				H.push("right");
			}
			H.push(';"> ');
			H.push(
				'<table style="height:' +
					this.parametresAffichage.getHauteur() +
					'px;">',
			);
			if (
				this.parametresAffichage.getOrientation() ===
				Enumere_Divers_1.EOrientation.horizontal
			) {
				H.push('<tr class="AlignementBas">');
				for (let I = 0; I < this.tabOnglets.length; I++) {
					if (this.tabOnglets[I].estVisible() !== false) {
						if (
							this.parametresAffichage.getAvecSeparateur() &&
							this.parametresAffichage.getAlignementHorizontalSeparateur() ===
								Enumere_Divers_1.EAlignementHorizontal.gauche
						) {
							H.push(
								'<td style="width:' +
									this.parametresAffichage.getEpaisseurSeparateur() +
									"px;background-color : " +
									this.parametresAffichage.getCouleurSeparateur() +
									';">&nbsp;</td>',
							);
						}
						H.push("<td ");
						H.push(
							'id="' +
								this.tabOnglets[I].getNom() +
								'" style="width:10px;" >' +
								this.tabOnglets[I].construireAffichage() +
								"</td>",
						);
						if (
							this.parametresAffichage.getAvecSeparateur() &&
							this.parametresAffichage.getAlignementHorizontalSeparateur() ===
								Enumere_Divers_1.EAlignementHorizontal.droit
						) {
							H.push(
								'<td style="width:' +
									this.parametresAffichage.getEpaisseurSeparateur() +
									"px;background-color : " +
									this.parametresAffichage.getCouleurSeparateur() +
									';">&nbsp;</td>',
							);
						}
					}
				}
				H.push("</tr>");
			} else {
			}
			H.push("</table>");
			H.push("</div>");
			H.push("</div>");
			return H.join("");
		} else {
			return "&nbsp;";
		}
	}
	setParametres(aParametresAffichage) {
		this.parametresAffichage = aParametresAffichage;
	}
	setDonnees(aTabOnglets) {
		this.tabOnglets = aTabOnglets;
		this.Instances = this.tabOnglets;
		for (let I = 0; I < this.tabOnglets.length; I++) {
			this.tabOnglets[I].setParametresAffichage(
				this.parametresAffichage.getParametresAffichageActif(),
				this.parametresAffichage.getParametresAffichageInactif(),
			);
		}
		this.donneesRecues = true;
	}
	setSelection(aPositionOnglet) {
		if (
			this.selectionCourante !== null &&
			this.selectionCourante !== undefined
		) {
			this.tabOnglets[this.selectionCourante].setSelection(false);
		}
		this.selectionCourante = aPositionOnglet;
		this.tabOnglets[this.selectionCourante].setSelection(true);
	}
}
exports.ObjetMenuOnglets = ObjetMenuOnglets;
