const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const EGenreActionConsentement = { Fermer: 0, Valider: 1 };
class ObjetFenetre_Consentement extends ObjetFenetre {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptionsFenetre({
			largeur: 500,
			hauteur: 150,
			listeBoutons: [
				{
					libelle: GTraductions.getValeur("accueil.applicam.valider"),
					theme: TypeThemeBouton.primaire,
					action: EGenreActionConsentement.Valider,
				},
				{
					libelle: GTraductions.getValeur("Fermer"),
					theme: TypeThemeBouton.secondaire,
					action: EGenreActionConsentement.Fermer,
				},
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			htmlTexteFenetre() {
				return GTraductions.getValeur("accueil.applicam.texteFenetre", [
					aInstance.libellePartenaire,
				]);
			},
			htmlNomEleve() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.nomEleve
					: "";
			},
			htmlDateNaissance() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.dateNaissance
					: "";
			},
			htmlAdresse1() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.adresse1
					: "";
			},
			htmlCodePostal() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.codePostal
					: "";
			},
			htmlVille() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.ville
					: "";
			},
			htmlPays() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.pays
					: "";
			},
			htmlNomResp() {
				return aInstance.donneesTransmises
					? aInstance.donneesTransmises.nomResp
					: "";
			},
		});
	}
	setDonnees(aLibellePartenaire, aDonneesTransmise) {
		this.libellePartenaire = aLibellePartenaire;
		this.donneesTransmises = aDonneesTransmise;
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("accueil.applicam.titre", [
				this.libellePartenaire,
			]),
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div ie-html="htmlTexteFenetre"></div><br/>');
		T.push(this.composeDonneesTransmises());
		T.push(
			"<div>",
			GTraductions.getValeur("accueil.applicam.sousTexte"),
			"</div>",
		);
		return T.join("");
	}
	composeDonneesTransmises() {
		const T = [];
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur("accueil.applicam.donneesTransmises.nom"),
			"</div>",
		);
		T.push('<div ie-html="htmlNomEleve"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.dateNaissance",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlDateNaissance"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur("accueil.applicam.donneesTransmises.adresse"),
			"</div>",
		);
		T.push('<div ie-html="htmlAdresse1"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur("accueil.applicam.donneesTransmises.codePostal"),
			"</div>",
		);
		T.push('<div ie-html="htmlCodePostal"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur("accueil.applicam.donneesTransmises.ville"),
			"</div>",
		);
		T.push('<div ie-html="htmlVille"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur("accueil.applicam.donneesTransmises.pays"),
			"</div>",
		);
		T.push('<div ie-html="htmlPays"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			GTraductions.getValeur("accueil.applicam.donneesTransmises.responsable"),
			"</div>",
		);
		T.push('<div ie-html="htmlNomResp"></div>');
		T.push("</div><br/>");
		return T.join("");
	}
}
module.exports = { ObjetFenetre_Consentement, EGenreActionConsentement };
