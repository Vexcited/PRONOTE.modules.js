const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GStyle } = require("ObjetStyle.js");
const {
	ObjetFenetre_SelecteurCouleur,
} = require("ObjetFenetre_SelecteurCouleur.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetIndexsUnique } = require("ObjetIndexsUnique.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_EditionCategorie extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 300,
			hauteur: null,
			avecTailleSelonContenu: true,
		});
		this.enCreation = false;
		this.listeCategoriesExistantes = null;
		this._indexsUnique = new ObjetIndexsUnique();
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
							GStyle.composeCouleurFond(aInstance.categorie.couleur),
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
		const T = [];
		const lIdCouleur = GUID.getId();
		T.push(
			'<div class="field-contain">',
			'<label id="',
			lIdCouleur,
			'" class="ie-titre-petit">',
			GTraductions.getValeur("FenetreCategorieEvaluation.couleur"),
			"</label>",
			'<ie-btnselecteur ie-model="getCouleur" ie-node="Couleur.nodeInputTexte" aria-labelledby="',
			lIdCouleur,
			'"></ie-btnselecteur>',
			"</div>",
		);
		T.push(
			tag(
				"div",
				{ class: "field-contain" },
				tag(
					"label",
					{ class: "ie-titre-petit" },
					GTraductions.getValeur("FenetreCategorieEvaluation.TitreLibelle"),
				),
				tag("input", {
					type: "text",
					"ie-model": "LibelleCategorie",
					class: "round-style full-width",
					title: GTraductions.getValeur("FenetreDevoir.LibelleCategorie"),
					placeholder: GTraductions.getValeur("FenetreDevoir.LibelleCategorie"),
				}),
			),
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aCategorie) {
		this.categorie = aCategorie
			? MethodesObjet.dupliquer(aCategorie)
			: new ObjetElement();
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
				const lMessageDoublon = GTraductions.getValeur("liste.doublonNom", [
					this.categorie.getLibelle(),
				]);
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: lMessageDoublon,
				});
				return;
			}
			this.fermer();
			if (this.enCreation) {
				this.categorie.setEtat(EGenreEtat.Creation);
			} else if (
				this.enModification &&
				this.categorie.getEtat() !== EGenreEtat.Creation
			) {
				this.categorie.setEtat(EGenreEtat.Modification);
			}
			this.callback.appel(this.categorie);
		} else {
			this.fermer();
		}
	}
	surBoutonChoixCouleur() {
		const lThis = this;
		ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SelecteurCouleur, {
			pere: this,
			evenement: function (aGenreBouton, aCouleur) {
				if (aGenreBouton === 1) {
					if (lThis.categorie.couleur !== aCouleur) {
						lThis.categorie.couleur = aCouleur;
						lThis.categorie.setEtat(EGenreEtat.Modification);
					}
				}
			},
		}).setDonnees(lThis.categorie.couleur);
	}
}
module.exports = { ObjetFenetre_EditionCategorie };
