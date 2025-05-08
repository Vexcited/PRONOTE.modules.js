const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const ObjetFenetre_EditionTheme = require("ObjetFenetre_EditionTheme.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const ObjetRequeteSaisieListeThemes = require("ObjetRequeteSaisieListeThemes.js");
const { MethodesObjet } = require("MethodesObjet.js");
class DonneesListe_Themes extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aListeMatieres, aTailleLibelleTheme) {
		super(aDonnees);
		this.listeMatieres = aListeMatieres;
		this.tailleLibelleTheme = aTailleLibelleTheme;
		this.creerIndexUnique(["Libelle", "matiere.Numero"]);
		this.setOptions({
			avecCB: true,
			avecCocheCBSurLigne: true,
			flatDesignMinimal: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	getInfosSuppZonePrincipale(aParams) {
		return `${GTraductions.getValeur("Theme.auteur.creePar")} ${(!!aParams.article.auteur ? aParams.article.auteur.getLibelle() : GTraductions.getValeur("Theme.auteur.moi")) + (!!aParams.article.matiere ? ", " + aParams.article.matiere.getLibelle() : "")}`;
	}
	avecBoutonActionLigne(aParams) {
		return !!aParams.article && aParams.article.modificationAutorisee;
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && aParams.article.modificationAutorisee;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.add(
			GTraductions.getValeur("Modifier"),
			true,
			function () {
				_ouvrirFenetreEdition.call(this, aParametres);
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			!aParametres.article.cmsActif
				? GTraductions.getValeur("Theme.btn.selectionner")
				: GTraductions.getValeur("Theme.btn.deselectionner"),
			true,
			function () {
				aParametres.article.cmsActif = !aParametres.article.cmsActif;
				this.actualiser();
			},
			{
				icon: !aParametres.article.cmsActif
					? "icon_ok"
					: "icon_fermeture_widget",
			},
		);
		aParametres.menuContextuel.add(
			GTraductions.getValeur("Supprimer"),
			true,
			function () {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: aParametres.article.estUtiliseParAuteur
						? GTraductions.getValeur(
								"Theme.msg.confSupprThemeUtiliseAuteur",
								aParametres.article.getLibelle(),
							)
						: GTraductions.getValeur("Theme.msg.confSupprTheme"),
					callback: function (aGenreAction) {
						if (aGenreAction === EGenreAction.Valider) {
							aParametres.article.setEtat(EGenreEtat.Suppression);
							aParametres.article.cmsActif = false;
							new ObjetRequeteSaisieListeThemes(this, () => {
								this.actualiser();
							}).lancerRequete({
								ListeThemes: new ObjetListeElements().add(aParametres.article),
							});
						}
					}.bind(this),
				});
			},
			{ icon: "icon_trash" },
		);
		aParametres.menuContextuel.setDonnees();
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.cmsActif : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.cmsActif = aValue;
	}
}
function _ouvrirFenetreEdition(aParams) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EditionTheme,
		{
			pere: this,
			evenement: function (aTheme) {
				const lTheme = aParams.article;
				const lCopie = MethodesObjet.dupliquer(lTheme);
				lTheme.setLibelle(aTheme.getLibelle());
				lTheme.matiere = aTheme.matiere;
				lTheme.setEtat(aTheme.Etat);
				lTheme.cmsActif = aTheme.cmsActif;
				new ObjetRequeteSaisieListeThemes(this, (aJSON) => {
					if (
						!!aJSON.JSONRapportSaisie &&
						!!aJSON.JSONRapportSaisie._messagesErreur_
					) {
						lTheme.setLibelle(lCopie.getLibelle());
						lTheme.matiere = lCopie.matiere;
						lTheme.cmsActif = lCopie.cmsActif;
						lTheme.setEtat(lCopie.Etat);
						this.actualiser();
					} else {
						this.actualiser();
					}
				}).lancerRequete({ ListeThemes: new ObjetListeElements().add(aTheme) });
			},
		},
	);
	lFenetre.setDonnees(aParams, {
		listeMatieres: this.Donnees.listeMatieres,
		tailleLibelleTheme: this.Donnees.tailleLibelleTheme,
		listeThemes: this.Donnees.Donnees,
	});
}
module.exports = DonneesListe_Themes;
