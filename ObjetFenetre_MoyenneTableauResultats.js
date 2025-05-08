const { GChaine } = require("ObjetChaine.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_MoyenneTableauResultats extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
	}
	composeTitreFormule() {
		if (this.titreFenetre) {
			this.setOptionsFenetre({ titre: this.titreFenetre + "&nbsp;" });
		}
		if (this.titreFormule) {
			return this.titreFormule;
		}
		const lTitre = this.moyenneNette
			? GTraductions.getValeur("BulletinEtReleve.FenetreCalculMoyenneNette")
			: GTraductions.getValeur("BulletinEtReleve.FenetreCalculMoyenneBrute");
		return GChaine.format(lTitre, [this.libelleEleve, ""]);
	}
	composeContenu() {
		const T = [];
		if (this.donneesRecues) {
			T.push(
				'<div class="Texte10 Espace Gras" style="margin-bottom: 5px;">',
				this.composeTitreFormule(),
				"</div>",
			);
			T.push(
				'<div class="Texte10 Espace FondBlanc MethodeCalculMoyenne">' +
					this.formuleHTML +
					"</div>",
			);
		}
		return T.join("");
	}
	setDonnees(aParametres) {
		const lHtml = aParametres.html;
		this.formuleHTML = GChaine.replaceRCToHTML(lHtml);
		this.titreFormule = aParametres.titreFenetre;
		this.titreFenetre = aParametres.titreFenetre;
		this.moyenneNette = aParametres.moyenneNette;
		this.libelleEleve = aParametres.libelleEleve;
		this.donneesRecues = true;
		this.actualiser();
		this.afficher();
	}
}
module.exports = { ObjetFenetre_MoyenneTableauResultats };
