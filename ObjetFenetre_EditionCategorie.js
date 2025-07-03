exports.ObjetFenetre_EditionCategorie = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_SelecteurCouleur_1 = require("ObjetFenetre_SelecteurCouleur");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetIndexsUnique_1 = require("ObjetIndexsUnique");
const GUID_1 = require("GUID");
class ObjetFenetre_EditionCategorie extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.enCreation = false;
		this.listeCategoriesExistantes = null;
		this.setOptionsFenetre({
			largeur: 300,
			hauteur: null,
			avecTailleSelonContenu: true,
		});
		this._indexsUnique = new ObjetIndexsUnique_1.ObjetIndexsUnique();
		this._indexsUnique.ajouterIndex(["Libelle"]);
	}
	setListeCategoriesExistantes(aListeCategories) {
		this.listeCategoriesExistantes = aListeCategories;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			LibelleCategorie: {
				getValue: function () {
					aInstance.setBoutonActif(
						1,
						!!(!!aInstance.categorie && !!aInstance.categorie.getLibelle()),
					);
					return aInstance.categorie ? aInstance.categorie.getLibelle() : "";
				},
				setValue: function (aValue) {
					if (aInstance.categorie) {
						aInstance.categorie.setLibelle(aValue);
						aInstance.enModification = true;
					}
				},
			},
			getCouleur: {
				getLibelle: function () {
					let lHtmlCouleur = "";
					if (!!aInstance.categorie && !!aInstance.categorie.couleur) {
						lHtmlCouleur = [
							'<div class="square-color" style="',
							ObjetStyle_1.GStyle.composeCouleurFond(
								aInstance.categorie.couleur,
							),
							'">',
							"</div>",
						].join("");
					}
					return lHtmlCouleur || "&nbsp;";
				},
			},
			Couleur: {
				nodeInputTexte: function () {
					$(this.node).eventValidation(() => {
						aInstance.surBoutonChoixCouleur();
					});
				},
			},
		});
	}
	composeContenu() {
		const lIdCouleur = GUID_1.GUID.getId();
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						{ id: lIdCouleur, class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreCategorieEvaluation.couleur",
						),
					),
					IE.jsx.str("ie-btnselecteur", {
						"ie-model": "getCouleur",
						"ie-node": "Couleur.nodeInputTexte",
						"aria-labelledby": lIdCouleur,
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"label",
						{ class: "ie-titre-petit" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreCategorieEvaluation.TitreLibelle",
						),
					),
					IE.jsx.str("input", {
						type: "text",
						"ie-model": "LibelleCategorie",
						class: "full-width",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.LibelleCategorie",
						),
						placeholder: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.LibelleCategorie",
						),
					}),
				),
			),
		);
		return T.join("");
	}
	setDonnees(aCategorie) {
		this.categorie = aCategorie
			? MethodesObjet_1.MethodesObjet.dupliquer(aCategorie)
			: new ObjetElement_1.ObjetElement();
		if (!aCategorie) {
			this.enCreation = true;
			this.categorie.couleur = "#FFFFFF";
		}
		this.enModification = false;
		this.afficher();
		this.positionnerFenetre();
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			let lTestLibelleExisteDeja = false;
			if (this.listeCategoriesExistantes) {
				const lElement = this.categorie;
				this.listeCategoriesExistantes.parcourir((aCategorieExistante) => {
					if (aCategorieExistante.getNumero() !== lElement.getNumero()) {
						if (this._indexsUnique.estDoublon(aCategorieExistante, lElement)) {
							lTestLibelleExisteDeja = true;
							return false;
						}
					}
				});
			}
			if (lTestLibelleExisteDeja) {
				const lMessageDoublon = ObjetTraduction_1.GTraductions.getValeur(
					"liste.doublonNom",
					[this.categorie.getLibelle()],
				);
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: lMessageDoublon,
				});
				return;
			}
			this.fermer();
			if (this.enCreation) {
				this.categorie.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else if (
				this.enModification &&
				this.categorie.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation
			) {
				this.categorie.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
			this.callback.appel(this.categorie);
		} else {
			this.fermer();
		}
	}
	surBoutonChoixCouleur() {
		const lThis = this;
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelecteurCouleur_1.ObjetFenetre_SelecteurCouleur,
			{
				pere: this,
				evenement: function (aGenreBouton, aCouleur) {
					if (aGenreBouton === 1) {
						if (lThis.categorie.couleur !== aCouleur) {
							lThis.categorie.couleur = aCouleur;
							lThis.categorie.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				},
			},
		).setDonnees(lThis.categorie.couleur);
	}
}
exports.ObjetFenetre_EditionCategorie = ObjetFenetre_EditionCategorie;
