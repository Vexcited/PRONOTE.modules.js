exports.DonneesListe_Themes = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_EditionTheme_1 = require("ObjetFenetre_EditionTheme");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetRequeteSaisieListeThemes_1 = require("ObjetRequeteSaisieListeThemes");
const MethodesObjet_1 = require("MethodesObjet");
class DonneesListe_Themes extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aListeMatieres, aTailleLibelleTheme) {
		super(aDonnees);
		this.listeMatieres = aListeMatieres;
		this.tailleLibelleTheme = aTailleLibelleTheme;
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
		return `${ObjetTraduction_1.GTraductions.getValeur("Theme.auteur.creePar")} ${(!!aParams.article.auteur ? aParams.article.auteur.getLibelle() : ObjetTraduction_1.GTraductions.getValeur("Theme.auteur.moi")) + (!!aParams.article.matiere ? ", " + aParams.article.matiere.getLibelle() : "")}`;
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
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			true,
			() => {
				this._ouvrirFenetreEdition(aParametres);
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			!aParametres.article.cmsActif
				? ObjetTraduction_1.GTraductions.getValeur("Theme.btn.selectionner")
				: ObjetTraduction_1.GTraductions.getValeur("Theme.btn.deselectionner"),
			true,
			() => {
				aParametres.article.cmsActif = !aParametres.article.cmsActif;
				this.paramsListe.liste.actualiser();
			},
			{
				icon: !aParametres.article.cmsActif
					? "icon_ok"
					: "icon_fermeture_widget",
			},
		);
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			true,
			() => {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: aParametres.article.estUtiliseParAuteur
						? ObjetTraduction_1.GTraductions.getValeur(
								"Theme.msg.confSupprThemeUtiliseAuteur",
								aParametres.article.getLibelle(),
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Theme.msg.confSupprTheme",
							),
					callback: (aGenreAction) => {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							aParametres.article.setEtat(
								Enumere_Etat_1.EGenreEtat.Suppression,
							);
							aParametres.article.cmsActif = false;
							new ObjetRequeteSaisieListeThemes_1.ObjetRequeteSaisieListeThemes(
								this,
								() => {
									this.paramsListe.liste.actualiser();
								},
							).lancerRequete({
								ListeThemes: new ObjetListeElements_1.ObjetListeElements().add(
									aParametres.article,
								),
							});
						}
					},
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
	_ouvrirFenetreEdition(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionTheme_1.ObjetFenetre_EditionTheme,
			{
				pere: this,
				evenement: function (aTheme) {
					const lTheme = aParams.article;
					const lCopie = MethodesObjet_1.MethodesObjet.dupliquer(lTheme);
					lTheme.setLibelle(aTheme.getLibelle());
					lTheme.matiere = aTheme.matiere;
					lTheme.setEtat(aTheme.Etat);
					lTheme.cmsActif = aTheme.cmsActif;
					new ObjetRequeteSaisieListeThemes_1.ObjetRequeteSaisieListeThemes(
						this,
						(aJSON) => {
							if (
								!!aJSON.JSONRapportSaisie &&
								!!aJSON.JSONRapportSaisie._messagesErreur_
							) {
								lTheme.setLibelle(lCopie.getLibelle());
								lTheme.matiere = lCopie.matiere;
								lTheme.cmsActif = lCopie.cmsActif;
								lTheme.setEtat(lCopie.Etat);
								this.paramsListe.liste.actualiser();
							} else {
								this.paramsListe.liste.actualiser();
							}
						},
					).lancerRequete({
						ListeThemes: new ObjetListeElements_1.ObjetListeElements().add(
							aTheme,
						),
					});
				},
			},
		);
		lFenetre.setDonnees(aParams, {
			listeMatieres: this.listeMatieres,
			tailleLibelleTheme: this.tailleLibelleTheme,
			listeThemes: this.Donnees,
		});
	}
}
exports.DonneesListe_Themes = DonneesListe_Themes;
