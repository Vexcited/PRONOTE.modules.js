exports.ObjetFenetre_ListeCategorieBillet = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_BlogCategorieBillet_1 = require("DonneesListe_BlogCategorieBillet");
const ObjetMoteurBlog_1 = require("ObjetMoteurBlog");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_EditionCategorie_1 = require("ObjetFenetre_EditionCategorie");
const Enumere_Etat_1 = require("Enumere_Etat");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_Espace_1 = require("Enumere_Espace");
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCategorieBillet",
	ObjetRequeteJSON_1.ObjetRequeteSaisie,
);
class ObjetFenetre_ListeCategorieBillet extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecEditionCategorie = [
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
		].includes(GEtatUtilisateur.GenreEspace);
		this.moteur = new ObjetMoteurBlog_1.ObjetMoteurBlog();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					let lResult = false;
					if (aBoutonRepeat.element.index === 1) {
						const lSelection = aInstance.categorie;
						lResult = lSelection === null || lSelection === undefined;
					}
					return lResult;
				},
			},
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
		);
	}
	setDonnees(aParam) {
		this.listeCategories = aParam.listeCategories;
		this.categorie = aParam.categorie;
		this.setOptionsFenetre({
			titre: this.avecEditionCategorie
				? ObjetTraduction_1.GTraductions.getValeur("blog.editerCategorieBillet")
				: ObjetTraduction_1.GTraductions.getValeur(
						"blog.selectCategorieBillet",
					),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.afficher();
		this.getInstance(this.identListe).setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecLigneCreation: this.avecEditionCategorie,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"blog.creerCategorieBillet",
			),
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
		this._actualiserListe();
	}
	composeContenu() {
		return IE.jsx.str("div", {
			style: "height:100%;",
			id: this.getNomInstance(this.identListe),
		});
	}
	surValidation(aNumeroBouton) {
		this.callback.appel(aNumeroBouton, {
			listeCategories: this.listeCategories,
			selection: this.categorie,
		});
		this.fermer();
	}
	_saisie(aParametres) {
		const lListe = this.getInstance(this.identListe);
		let lSelections = lListe.getListeElementsSelection();
		return (0, CollectionRequetes_1.Requetes)("SaisieCategorieBillet", this)
			.lancerRequete(aParametres)
			.then(
				(aParams) => {
					if (
						aParams &&
						aParams.genreReponse ===
							ObjetRequeteJSON_1.EGenreReponseSaisie.succes
					) {
						if (aParams.JSONReponse && aParams.JSONReponse.listeCategories) {
							this.listeCategories = this.moteur.deserialiserListeCategories(
								aParams.JSONReponse.listeCategories,
							);
						}
						if (
							aParametres.commande === "creation" &&
							aParams.JSONRapportSaisie &&
							aParams.JSONRapportSaisie.categorieCree
						) {
							lSelections =
								new ObjetListeElements_1.ObjetListeElements().addElement(
									aParams.JSONRapportSaisie.categorieCree,
								);
						}
					}
					return aParams;
				},
				(aParams) => {
					return aParams;
				},
			)
			.then(() => {
				this._actualiserListe();
				lListe.setListeElementsSelection(lSelections);
			});
	}
	_evenementSurListe(aParams, aGenreEvenementListe, aCol, aLigne) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.categorie = this.listeCategories.get(aLigne);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				this.categorie = this.listeCategories.get(aLigne);
				this.surValidation(1);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this._ouvrirFenetreEditionCategorie(aParams.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreEditionCategorie();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this._saisie({ commande: "suppression", categorie: aParams.article });
				break;
		}
	}
	_actualiserListe() {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_BlogCategorieBillet_1.DonneesListe_BlogCategorieBillet(
				this.listeCategories,
				this.avecEditionCategorie,
			),
		);
	}
	_ouvrirFenetreEditionCategorie(aCategorie) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionCategorie_1.ObjetFenetre_EditionCategorie,
			{
				pere: this,
				evenement: (aCategorieEdit) => {
					if (aCategorieEdit.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
						aCategorieEdit.estEditable = true;
						if (
							!this.listeCategories.getElementParNumero(
								aCategorieEdit.getNumero(),
							)
						) {
							this.listeCategories.add(aCategorieEdit);
						} else {
							aCategorie.setLibelle(aCategorieEdit.getLibelle());
							aCategorie.couleur = aCategorieEdit.couleur;
						}
						this._actualiserListe();
						const lCategorie = aCategorie || aCategorieEdit;
						this.categorie = lCategorie;
						this._saisie({
							commande: "creation",
							libelle: lCategorie.getLibelle(),
							couleur: lCategorie.couleur,
						});
					} else {
						aCategorie.setLibelle(aCategorieEdit.getLibelle());
						aCategorie.couleur = aCategorieEdit.couleur;
						aCategorie.setEtat(aCategorieEdit.Etat);
						this._actualiserListe();
						this._saisie({
							commande: "edition",
							categorie: aCategorie,
							libelle: aCategorie.getLibelle(),
							couleur: aCategorie.couleur,
						});
					}
				},
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						titre: !!aCategorie
							? ObjetTraduction_1.GTraductions.getValeur(
									"FenetreCategorieEvaluation.editionCategorie",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreCategorieEvaluation.nouvelleCategorie",
								),
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							{
								theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
								libelle: !!aCategorie
									? ObjetTraduction_1.GTraductions.getValeur("Modifier")
									: ObjetTraduction_1.GTraductions.getValeur(
											"FenetreCategorieEvaluation.creer",
										),
							},
						],
					});
				},
			},
		);
		lFenetre.setListeCategoriesExistantes(this.listeCategories);
		lFenetre.setDonnees(aCategorie);
	}
}
exports.ObjetFenetre_ListeCategorieBillet = ObjetFenetre_ListeCategorieBillet;
