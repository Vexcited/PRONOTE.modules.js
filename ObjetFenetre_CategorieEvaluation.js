exports.ObjetFenetre_CategorieEvaluation = void 0;
const DonneesListe_CategorieEvaluation_1 = require("DonneesListe_CategorieEvaluation");
const ObjetRequeteCategorieEvaluation_1 = require("ObjetRequeteCategorieEvaluation");
const ObjetRequeteSaisieCategorieEvaluation_1 = require("ObjetRequeteSaisieCategorieEvaluation");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_EditionCategorie_1 = require("ObjetFenetre_EditionCategorie");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const AccessApp_1 = require("AccessApp");
const ObjetElement_1 = require("ObjetElement");
class ObjetFenetre_CategorieEvaluation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecCreation = true;
		this.filtreMesCategories = false;
		this.avecMultiSelection = false;
		this.listeCategories = new ObjetListeElements_1.ObjetListeElements();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreCategorieEvaluation.SelectionUneCategorie",
			),
			largeur: 500,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, this.evenementSurListe);
	}
	evenementSurListe(aParametres, aGenreEvenementListe, I, J) {
		this.posRessource = J;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this.surValidation(1);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				this.surValidation(1);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this._ouvrirFenetreEditionCategorie(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreEditionCategorie();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this.listeCategories
					.getElementParElement(aParametres.article)
					.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				this._actualiserListe();
				break;
		}
	}
	surValidation(ANumeroBouton) {
		if (ANumeroBouton === 1) {
			if (this.avecCreation) {
				const categorieSelectionnee = this.getRessourceSelectionnee();
				this.valider();
				this.callback.appel({ categorieSelectionnee: categorieSelectionnee });
			} else if (this.avecMultiSelection) {
				const lListe = this.getInstance(this.identListe).getListeArticles();
				const lListeSelectionnee = lListe.getListeElements((aElement) => {
					return aElement.coche;
				});
				this.callback.appel({
					listeCategoriesSelectionnees: lListe,
					nbCategorieSelectionnees: lListeSelectionnee.count(),
					nbCategorieTotal: this.listeCategories.count(),
				});
			}
		}
		this.fermer();
	}
	getRessourceSelectionnee() {
		if (!!this.listeCategories) {
			return this.listeCategories.get(this.posRessource);
		}
		return null;
	}
	composeContenu() {
		const lModelecbFiltre = () => {
			return {
				getValue: () => {
					return this.filtreMesCategories;
				},
				setValue: (aData) => {
					this.filtreMesCategories = aData;
					this._actualiserListe();
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "flex-contain cols", style: "height:100%" },
			IE.jsx.str(
				"ie-checkbox",
				{ class: "Espace", "ie-model": lModelecbFiltre },
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreCategorieEvaluation.UniquementMesCategories",
				),
			),
			IE.jsx.str("div", {
				class: "fluid-bloc",
				id: this.getInstance(this.identListe).getNom(),
			}),
		);
	}
	setDonnees(aParam) {
		this.afficher();
		this.avecMultiSelection = aParam.avecMultiSelection;
		this.avecCreation = aParam.avecCreation;
		this.tailleMax = aParam.tailleMax;
		if (!!aParam.listeCategories && aParam.listeCategories.count() > 0) {
			this.listeCategories = aParam.listeCategories;
			this._actualiserListe();
		} else {
			new ObjetRequeteCategorieEvaluation_1.ObjetRequeteCategorieEvaluation(
				this,
				this._actionSurRecupererDonnees.bind(this),
			).lancerRequete();
		}
		this.positionnerFenetre();
	}
	valider() {
		if (this.avecCreation) {
			new ObjetRequeteSaisieCategorieEvaluation_1.ObjetRequeteSaisieCategorieEvaluation(
				this,
				this.actionSurValidation,
			).lancerRequete(this.listeCategories);
		}
	}
	_initListe() {
		this.getInstance(this.identListe).setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecLigneCreation:
				!(0, AccessApp_1.getApp)().droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				) && this.avecCreation,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecCBToutCocher: !!this.avecMultiSelection,
			forcerOmbreScrollBottom: true,
			estBoutonCreationPiedFlottant_mobile: false,
		});
	}
	_actionSurRecupererDonnees(aParam) {
		this.listeCategories = aParam.listeCategories;
		this.tailleMax = aParam.tailleMax;
		if (this.avecMultiSelection) {
			this.listeCategories.parcourir((aCategorie) => {
				aCategorie.coche = true;
			});
		}
		this._actualiserListe();
	}
	_actualiserListe() {
		this._initListe();
		const lAvecCoche = this.avecMultiSelection && this.filtreMesCategories;
		this.listeCategories.parcourir((aCategorie) => {
			if (aCategorie.getPosition() !== 0) {
				aCategorie.Position = 1;
			}
			if (lAvecCoche && !aCategorie.filtreMesCategories && !!aCategorie.coche) {
				aCategorie.coche = false;
			}
		});
		this.listeCategories.trier();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_CategorieEvaluation_1.DonneesListe_CategorieEvaluation({
				listeCategories: this.listeCategories,
				filtreMesCategories: this.filtreMesCategories,
				tailleMax: this.tailleMax,
				avecCB: this.avecMultiSelection,
				estEditable:
					!(0, AccessApp_1.getApp)().droits.get(
						ObjetDroitsPN_1.TypeDroits.estEnConsultation,
					) && this.avecCreation,
			}),
		);
	}
	_ouvrirFenetreEditionCategorie(aCategorie) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionCategorie_1.ObjetFenetre_EditionCategorie,
			{
				pere: this,
				evenement: function (aCategorieEdit) {
					if (
						aCategorieEdit &&
						aCategorieEdit instanceof ObjetElement_1.ObjetElement
					) {
						if (
							aCategorieEdit.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
						) {
							aCategorieEdit.estEditable = true;
							aCategorieEdit.proprietaire =
								GEtatUtilisateur.getMembre().getLibelle();
							aCategorieEdit.filtreMesCategories = true;
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
						} else {
							aCategorie.setLibelle(aCategorieEdit.getLibelle());
							aCategorie.couleur = aCategorieEdit.couleur;
							aCategorie.setEtat(aCategorieEdit.Etat);
							this._actualiserListe();
						}
					}
				},
				initialiser: function (aInstance) {
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
exports.ObjetFenetre_CategorieEvaluation = ObjetFenetre_CategorieEvaluation;
