const {
	DonneesListe_CategorieEvaluation,
} = require("DonneesListe_CategorieEvaluation.js");
const {
	ObjetRequeteCategorieEvaluation,
} = require("ObjetRequeteCategorieEvaluation.js");
const {
	ObjetRequeteSaisieCategorieEvaluation,
} = require("ObjetRequeteSaisieCategorieEvaluation.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	ObjetFenetre_EditionCategorie,
} = require("ObjetFenetre_EditionCategorie.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
class ObjetFenetre_CategorieEvaluation extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecCreation = true;
		this.filtreMesCategories = false;
		this.avecMultiSelection = false;
		this.listeCategories = new ObjetListeElements();
		this.setOptionsFenetre({
			titre: GTraductions.getValeur(
				"FenetreCategorieEvaluation.SelectionUneCategorie",
			),
			largeur: 500,
			hauteur: 500,
			heightMax_mobile: true,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe, this.evenementSurListe);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbFiltre: {
				getValue() {
					return aInstance.filtreMesCategories;
				},
				setValue(aData) {
					aInstance.filtreMesCategories = aData;
					_actualiserListe.call(aInstance);
				},
			},
		});
	}
	evenementSurListe(aParametres, aGenreEvenementListe, I, J) {
		this.posRessource = J;
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.SelectionClick:
				this.surValidation(1);
				break;
			case EGenreEvenementListe.SelectionDblClick:
				this.surValidation(1);
				break;
			case EGenreEvenementListe.Edition:
				_ouvrirFenetreEditionCategorie.call(this, aParametres.article);
				break;
			case EGenreEvenementListe.Creation:
				_ouvrirFenetreEditionCategorie.call(this);
				break;
			case EGenreEvenementListe.Suppression:
				this.listeCategories
					.getElementParElement(aParametres.article)
					.setEtat(EGenreEtat.Suppression);
				_actualiserListe.call(this);
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
		const T = [];
		T.push('<div class="flex-contain cols" style="height:100%">');
		T.push(
			'<ie-checkbox class="Espace" ie-model="cbFiltre" >',
			GTraductions.getValeur(
				"FenetreCategorieEvaluation.UniquementMesCategories",
			),
			"</ie-checkbox>",
		);
		T.push(
			'<div class="fluid-bloc" id="',
			this.getInstance(this.identListe).getNom(),
			'"></div>',
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aParam) {
		this.afficher();
		this.avecMultiSelection = aParam.avecMultiSelection;
		this.avecCreation = aParam.avecCreation;
		this.tailleMax = aParam.tailleMax;
		if (!!aParam.listeCategories && aParam.listeCategories.count() > 0) {
			this.listeCategories = aParam.listeCategories;
			_actualiserListe.call(this);
		} else {
			new ObjetRequeteCategorieEvaluation(
				this,
				_actionSurRecupererDonnees.bind(this),
			).lancerRequete(aParam);
		}
		this.positionnerFenetre();
	}
	valider() {
		if (this.avecCreation) {
			new ObjetRequeteSaisieCategorieEvaluation(
				this,
				this.actionSurValidation,
			).lancerRequete(this.listeCategories);
		}
	}
}
function _initListe() {
	this.getInstance(this.identListe).setOptionsListe({
		colonnes: [{ taille: "100%" }],
		avecLigneCreation:
			!GApplication.droits.get(TypeDroits.estEnConsultation) &&
			this.avecCreation,
		skin: ObjetListe.skin.flatDesign,
		avecCBToutCocher: !!this.avecMultiSelection,
		forcerOmbreScrollBottom: true,
		estBoutonCreationPiedFlottant_mobile: false,
	});
}
function _actionSurRecupererDonnees(aParam) {
	this.listeCategories = aParam.listeCategories;
	this.tailleMax = aParam.tailleMax;
	if (this.avecMultiSelection) {
		this.listeCategories.parcourir((aCategorie) => {
			aCategorie.coche = true;
		});
	}
	_actualiserListe.call(this);
}
function _actualiserListe() {
	_initListe.call(this);
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
		new DonneesListe_CategorieEvaluation({
			listeCategories: this.listeCategories,
			categorieSelectionnee: this.categorieSelectionnee,
			filtreMesCategories: this.filtreMesCategories,
			tailleMax: this.tailleMax,
			avecCB: this.avecMultiSelection,
			estEditable:
				!GApplication.droits.get(TypeDroits.estEnConsultation) &&
				this.avecCreation,
		}),
	);
}
function _ouvrirFenetreEditionCategorie(aCategorie) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EditionCategorie,
		{
			pere: this,
			evenement: function (aCategorieEdit) {
				if (aCategorieEdit.getEtat() === EGenreEtat.Creation) {
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
					_actualiserListe.call(this);
				} else {
					aCategorie.setLibelle(aCategorieEdit.getLibelle());
					aCategorie.couleur = aCategorieEdit.couleur;
					aCategorie.setEtat(aCategorieEdit.Etat);
					_actualiserListe.call(this);
				}
			},
			initialiser: function (aInstance) {
				aInstance.setOptionsFenetre({
					titre: !!aCategorie
						? GTraductions.getValeur(
								"FenetreCategorieEvaluation.editionCategorie",
							)
						: GTraductions.getValeur(
								"FenetreCategorieEvaluation.nouvelleCategorie",
							),
					listeBoutons: [
						GTraductions.getValeur("Fermer"),
						{
							theme: TypeThemeBouton.primaire,
							libelle: !!aCategorie
								? GTraductions.getValeur("Modifier")
								: GTraductions.getValeur("FenetreCategorieEvaluation.creer"),
						},
					],
				});
			},
		},
	);
	lFenetre.setListeCategoriesExistantes(this.listeCategories);
	lFenetre.setDonnees(aCategorie);
}
module.exports = { ObjetFenetre_CategorieEvaluation };
