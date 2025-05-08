const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetIndexsUnique } = require("ObjetIndexsUnique.js");
const { EGenreEtat } = require("Enumere_Etat.js");
class ObjetFenetre_EditionListeDiffusion extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._indexsUnique = new ObjetIndexsUnique();
		this._indexsUnique.ajouterIndex(["Libelle", "libelleAuteur"]);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("listeDiffusion.creation"),
			largeur: 360,
			avecTailleSelonContenu: true,
			listeBoutons: [
				{
					libelle: GTraductions.getValeur("Annuler"),
					theme: TypeThemeBouton.secondaire,
					valider: false,
				},
				{
					libelle: GTraductions.getValeur("Valider"),
					theme: TypeThemeBouton.primaire,
					valider: true,
				},
			],
			avecCroixFermeture: false,
			addParametresValidation: (aParametres) => {
				if (aParametres.bouton && aParametres.bouton.valider && this.donnees) {
					aParametres.element = this.donnees.element;
				}
			},
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputTitre: {
				getValue: function () {
					return aInstance.donnees && aInstance.donnees.element
						? aInstance.donnees.element.getLibelle()
						: "";
				},
				setValue: function (aValue) {
					aInstance.donnees.element.setLibelle(aValue);
				},
			},
		});
	}
	setDonnees(aDonnees) {
		this.donnees = MethodesObjet.dupliquer(aDonnees);
		this.afficher();
	}
	composeContenu() {
		const T = [];
		T.push(
			tag("input", {
				"ie-model": "inputTitre",
				class: ["ofeld_libelle", "round-style"],
			}),
		);
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		const lBouton = this.getBoutonNumero(aNumeroBouton);
		if (lBouton && lBouton.valider) {
			if (!this.donnees.element.getLibelle()) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur("CategoriesQCM.LibelleObligatoire"),
				});
				return;
			}
			let lTestLibelleExisteDeja = false;
			if (this.donnees.liste) {
				const lElement = this.donnees.element;
				this.donnees.liste.parcourir((aElement) => {
					if (
						!aElement.egalParNumeroEtGenre(
							lElement.getNumero(),
							lElement.getGenre(),
						) &&
						aElement.Etat !== EGenreEtat.Suppression
					) {
						if (this._indexsUnique.estDoublon(lElement, aElement)) {
							lTestLibelleExisteDeja = true;
							return false;
						}
					}
				});
			}
			if (lTestLibelleExisteDeja) {
				const lMessageDoublon = GTraductions.getValeur("liste.doublonNom", [
					this.donnees.element.getLibelle(),
				]);
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: lMessageDoublon,
				});
				return;
			}
			super.surValidation(aNumeroBouton);
		} else {
			super.surValidation(aNumeroBouton);
		}
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionListeDiffusion,
			{ pere: aParams.instance, evenement: aParams.evenement },
		);
		if (aParams.titre) {
			lFenetre.setOptionsFenetre({ titre: aParams.titre });
		}
		lFenetre.setDonnees(aParams.donnees);
	}
}
module.exports = { ObjetFenetre_EditionListeDiffusion };
