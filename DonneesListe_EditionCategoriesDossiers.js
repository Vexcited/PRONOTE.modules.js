const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
	TypeOrigineCreationCategorieDossier,
} = require("TypeOrigineCreationCategorieDossier.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_SelecteurCouleur,
} = require("ObjetFenetre_SelecteurCouleur.js");
class DonneesListe_EditionCategoriesDossiers extends ObjetDonneesListe {
	constructor(aDonnees, aCallback) {
		super(aDonnees);
		this.callbackSurSelection = aCallback;
		this.creerIndexUnique("Libelle");
		this.setOptions({ avecEvnt_Creation: true, avecEvnt_Selection: true });
	}
	avecSuppression(aParams) {
		return (
			aParams.article.Genre ===
				TypeOrigineCreationCategorieDossier.OCCD_Utilisateur &&
			!aParams.article.estUtilise
		);
	}
	getVisible(D) {
		return D.Libelle.length > 0;
	}
	surCreation(D, V) {
		const H = [];
		D.Libelle = V[0];
		D.Genre = TypeOrigineCreationCategorieDossier.OCCD_Utilisateur;
		D.couleur = "#000000";
		H.push(
			"<div>",
			'<div class="InlineBlock AlignementMilieuVertical" style="width: 8px; height: 10px;',
			GStyle.composeCouleurBordure("darkgray"),
			GStyle.composeCouleurFond(D.couleur),
			'"></div>',
			'<div class="PetitEspaceGauche InlineBlock AlignementMilieuVertical">',
			D.getLibelle(),
			"</div>",
			"</div>",
		);
		D.libelleHtml = H.join("");
	}
	avecEdition(aParams) {
		return (
			aParams.article.Genre ===
				TypeOrigineCreationCategorieDossier.OCCD_Utilisateur &&
			aParams.colonne === 1
		);
	}
	surEdition(aParams, V) {
		aParams.article.setLibelle(V);
		aParams.article.setEtat(EGenreEtat.Modification);
	}
	surSuppression(aArticle) {
		aArticle.setEtat(EGenreEtat.Suppression);
		if (!!aArticle.listeMotif) {
			aArticle.listeMotif.parcourir((aMotif) => {
				aMotif.setEtat(EGenreEtat.Suppression);
			});
		}
	}
	surSelection(aColonne, D, aLigne) {
		if (aColonne === 0) {
			ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SelecteurCouleur, {
				pere: this,
				evenement: function (aGenreBouton, aCouleur) {
					if (aGenreBouton === 1) {
						if (D.couleur !== aCouleur) {
							D.couleur = aCouleur;
							D.setEtat(EGenreEtat.Modification);
							this.callbackSurSelection();
						}
					}
				},
			}).setDonnees(D.couleur);
		}
		if (aLigne > 0) {
			const H = [];
			H.push(
				"<div>",
				'<div class="InlineBlock AlignementMilieuVertical" style="width: 8px; height: 10px;',
				GStyle.composeCouleurBordure("darkgray"),
				GStyle.composeCouleurFond(D.couleur),
				'"></div>',
				'<div class="PetitEspaceGauche InlineBlock AlignementMilieuVertical">',
				D.getLibelle(),
				"</div>",
				"</div>",
			);
			D.libelleHtml = H.join("");
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EditionCategoriesDossiers.colonnes.couleur:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_EditionCategoriesDossiers.colonnes.couleur:
				return (
					'<div style="background :' +
					aParams.article.couleur +
					';width : 2.5rem; height:1rem;">&nbsp;</div>'
				);
			case DonneesListe_EditionCategoriesDossiers.colonnes.libelle:
				return aParams.article.getLibelle();
			default:
				break;
		}
	}
}
DonneesListe_EditionCategoriesDossiers.colonnes = {
	couleur: "couleur",
	libelle: "libelle",
};
module.exports = { DonneesListe_EditionCategoriesDossiers };
