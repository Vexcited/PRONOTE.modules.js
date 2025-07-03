exports.ObjetFenetre_SelectionModeleInfoSond = void 0;
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_SelectionModeleInfoSond extends ObjetFenetre_Liste_1.ObjetFenetre_Liste {
	constructor(...aParams) {
		super(...aParams);
		this.options = {
			uniquementMesModeles: false,
			categorie: null,
			listeBruteCategories: null,
			listeCategories: null,
		};
		this.setOptionsFenetre({
			modale: true,
			largeur: 600,
			hauteur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			modeActivationBtnValider: this.modeActivationBtnValider.toujoursActifs,
		});
		this.paramsListe = {
			optionsListe: {
				colonnes: [{ taille: "100%" }],
				boutons: [
					{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
					{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				],
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			},
		};
	}
	setOptions(aOptions) {
		if (aOptions.listeBruteCategories) {
			let lListeCategoriesAvecToutes = MethodesObjet_1.MethodesObjet.dupliquer(
				aOptions.listeBruteCategories,
			);
			const lCategorieToutes = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("actualites.ToutesCategories"),
				0,
			);
			lCategorieToutes.toutesLesCategories = true;
			lListeCategoriesAvecToutes.addElement(lCategorieToutes);
			lListeCategoriesAvecToutes.setTri([
				ObjetTri_1.ObjetTri.init((D) => {
					return !D.toutesLesCategories;
				}),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			lListeCategoriesAvecToutes.trier();
			$.extend(aOptions, { listeCategories: lListeCategoriesAvecToutes });
		}
		super.setOptions(aOptions);
		return this;
	}
	jsxModelCheckboxUniquementmesModeles() {
		return {
			getValue: () => {
				return this.options.uniquementMesModeles;
			},
			setValue: (aValue) => {
				const lValueCB = !!aValue;
				this.options.uniquementMesModeles = lValueCB;
				this._filtrerListe();
			},
		};
	}
	jsxCombo() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					longueur: 200,
					hauteur: 16,
					hauteurLigneDefault: 16,
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"WAI.ListeSelectionCategorie",
					),
				});
			},
			getDonnees: (aListe) => {
				if (
					this.options.listeCategories !== null &&
					this.options.listeCategories !== undefined
				) {
					return this.options.listeCategories;
				}
			},
			getIndiceSelection: () => {
				return this.options.categorie !== null
					? this.options.listeCategories.getIndiceParElement(
							this.options.categorie,
						)
					: 0;
			},
			event: (aParametres, aCombo) => {
				if (
					aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParametres.element &&
					aCombo.estUneInteractionUtilisateur()
				) {
					this.options.categorie = aParametres.element;
					this._filtrerListe();
				}
			},
		};
	}
	composeZoneFiltres() {
		const T = [];
		T.push(
			IE.jsx.str(
				"ie-checkbox",
				{ "ie-model": this.jsxModelCheckboxUniquementmesModeles.bind(this) },
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.uniquementMesModeles",
				),
			),
		);
		T.push(IE.jsx.str("ie-combo", { "ie-model": this.jsxCombo.bind(this) }));
		return T.join("");
	}
	composeContenu() {
		const T = [];
		T.push('<div class="flex-contain cols full-size flex-gap-l">');
		T.push(
			'<div class="p-x-l fix-bloc flex-contain flex-wrap justify-between flex-gap">',
		);
		T.push(this.composeZoneFiltres());
		T.push("</div>");
		T.push(
			'<div class="fluid-bloc" id="' +
				this.getNomInstance(this.identListe) +
				'"></div>',
		);
		T.push("</div>");
		return T.join("");
	}
	_filtrerListe() {
		const lDonnees = this.getInstance(this.identListe).getListeArticles();
		const lUniquementLesMiens = this.options.uniquementMesModeles;
		const lCategorie = this.options.categorie;
		lDonnees.parcourir((aLigne) => {
			const lEstVisibleSelonFiltreMiens =
				lUniquementLesMiens !== true ||
				(aLigne.estModele === true && aLigne.estAuteur === true) ||
				(aLigne.estModele !== true &&
					aLigne.pere &&
					aLigne.pere.estAuteur === true);
			const lEstVisibleSelonCategorie =
				lCategorie === null ||
				lCategorie === undefined ||
				!lCategorie.existeNumero() ||
				(aLigne.estModele === true &&
					aLigne.categorie.getNumero() === lCategorie.getNumero()) ||
				(aLigne.estModele !== true &&
					aLigne.pere &&
					aLigne.pere.categorie.getNumero() === lCategorie.getNumero());
			aLigne.visible = lEstVisibleSelonFiltreMiens && lEstVisibleSelonCategorie;
		});
		this.actualiserListe();
	}
}
exports.ObjetFenetre_SelectionModeleInfoSond =
	ObjetFenetre_SelectionModeleInfoSond;
