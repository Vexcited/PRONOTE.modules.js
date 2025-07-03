exports.ObjetFenetre_Consentement = exports.EGenreActionConsentement = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
var EGenreActionConsentement;
(function (EGenreActionConsentement) {
	EGenreActionConsentement[(EGenreActionConsentement["Fermer"] = 0)] = "Fermer";
	EGenreActionConsentement[(EGenreActionConsentement["Valider"] = 1)] =
		"Valider";
})(
	EGenreActionConsentement ||
		(exports.EGenreActionConsentement = EGenreActionConsentement = {}),
);
class ObjetFenetre_Consentement extends ObjetFenetre_1.ObjetFenetre {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptionsFenetre({
			largeur: 500,
			hauteur: 150,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"accueil.applicam.valider",
					),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
					action: EGenreActionConsentement.Valider,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					action: EGenreActionConsentement.Fermer,
				},
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			htmlTexteFenetre() {
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.applicam.texteFenetre",
					[aInstance.libellePartenaire],
				);
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
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.titre",
				[this.libellePartenaire],
			),
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div ie-html="htmlTexteFenetre"></div><br/>');
		T.push(this.composeDonneesTransmises());
		T.push(
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur("accueil.applicam.sousTexte"),
			"</div>",
		);
		return T.join("");
	}
	composeDonneesTransmises() {
		const T = [];
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.nom",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlNomEleve"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.dateNaissance",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlDateNaissance"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.adresse",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlAdresse1"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.codePostal",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlCodePostal"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.ville",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlVille"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.pays",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlPays"></div>');
		T.push("</div>");
		T.push('<div style="display:flex;">');
		T.push(
			'<div style="flex : 0 1 15rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"accueil.applicam.donneesTransmises.responsable",
			),
			"</div>",
		);
		T.push('<div ie-html="htmlNomResp"></div>');
		T.push("</div><br/>");
		return T.join("");
	}
}
exports.ObjetFenetre_Consentement = ObjetFenetre_Consentement;
