exports.DonneesListe_EditionCategoriesDossiers = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const TypeOrigineCreationCategorieDossier_1 = require("TypeOrigineCreationCategorieDossier");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelecteurCouleur_1 = require("ObjetFenetre_SelecteurCouleur");
class DonneesListe_EditionCategoriesDossiers extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aCallback) {
		super(aDonnees);
		this.callbackSurSelection = aCallback;
		this.creerIndexUnique("Libelle");
		this.setOptions({ avecEvnt_Creation: true, avecEvnt_Selection: true });
	}
	avecSuppression(aParams) {
		return (
			aParams.article.Genre ===
				TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur &&
			!aParams.article.estUtilise
		);
	}
	getVisible(D) {
		return D.Libelle.length > 0;
	}
	surCreation(D, V) {
		const H = [];
		D.Libelle = V[0];
		D.Genre =
			TypeOrigineCreationCategorieDossier_1.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur;
		D.couleur = "#000000";
		H.push(
			"<div>",
			'<div class="InlineBlock AlignementMilieuVertical" style="width: 8px; height: 10px;',
			ObjetStyle_1.GStyle.composeCouleurBordure("darkgray"),
			ObjetStyle_1.GStyle.composeCouleurFond(D.couleur),
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
				TypeOrigineCreationCategorieDossier_1
					.TypeOrigineCreationCategorieDossier.OCCD_Utilisateur &&
			aParams.colonne === 1
		);
	}
	surEdition(aParams, V) {
		aParams.article.setLibelle(V);
		aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	}
	surSuppression(aArticle) {
		aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		if (!!aArticle.listeMotif) {
			aArticle.listeMotif.parcourir((aMotif) => {
				aMotif.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			});
		}
	}
	surSelection(aColonne, D, aLigne) {
		super.surSelection;
		if (aColonne === 0) {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelecteurCouleur_1.ObjetFenetre_SelecteurCouleur,
				{
					pere: this,
					evenement: function (aGenreBouton, aCouleur) {
						if (aGenreBouton === 1) {
							if (D.couleur !== aCouleur) {
								D.couleur = aCouleur;
								D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								this.callbackSurSelection();
							}
						}
					},
				},
			).setDonnees(D.couleur);
		}
		if (aLigne > 0) {
			const H = [];
			H.push(
				"<div>",
				'<div class="InlineBlock AlignementMilieuVertical" style="width: 8px; height: 10px;',
				ObjetStyle_1.GStyle.composeCouleurBordure("darkgray"),
				ObjetStyle_1.GStyle.composeCouleurFond(D.couleur),
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
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
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
exports.DonneesListe_EditionCategoriesDossiers =
	DonneesListe_EditionCategoriesDossiers;
(function (DonneesListe_EditionCategoriesDossiers) {
	let colonnes;
	(function (colonnes) {
		colonnes["couleur"] = "couleur";
		colonnes["libelle"] = "libelle";
	})(
		(colonnes =
			DonneesListe_EditionCategoriesDossiers.colonnes ||
			(DonneesListe_EditionCategoriesDossiers.colonnes = {})),
	);
})(
	DonneesListe_EditionCategoriesDossiers ||
		(exports.DonneesListe_EditionCategoriesDossiers =
			DonneesListe_EditionCategoriesDossiers =
				{}),
);
