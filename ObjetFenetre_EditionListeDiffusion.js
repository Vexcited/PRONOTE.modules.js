exports.ObjetFenetre_EditionListeDiffusion = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetIndexsUnique_1 = require("ObjetIndexsUnique");
const Enumere_Etat_1 = require("Enumere_Etat");
class ObjetFenetre_EditionListeDiffusion extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._indexsUnique = new ObjetIndexsUnique_1.ObjetIndexsUnique();
		this._indexsUnique.ajouterIndex(["Libelle", "libelleAuteur"]);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"listeDiffusion.creation",
			),
			largeur: 360,
			avecTailleSelonContenu: true,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
					valider: false,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
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
	setDonnees(aDonnees) {
		this.donnees = MethodesObjet_1.MethodesObjet.dupliquer(aDonnees);
		this.afficher();
	}
	composeContenu() {
		const linputTitre = () => {
			return {
				getValue: () => {
					return this.donnees && this.donnees.element
						? this.donnees.element.getLibelle()
						: "";
				},
				setValue: (aValue) => {
					this.donnees.element.setLibelle(aValue);
				},
			};
		};
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str("input", {
					"ie-model": linputTitre,
					class: ["ofeld_libelle"],
					"aria-labelledby": this.IdTitre,
				}),
			),
		);
	}
	surValidation(aNumeroBouton) {
		const lBouton = this.getBoutonNumero(aNumeroBouton);
		if (lBouton && lBouton.valider) {
			if (!this.donnees.element.getLibelle()) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"CategoriesQCM.LibelleObligatoire",
					),
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
						aElement.Etat !== Enumere_Etat_1.EGenreEtat.Suppression
					) {
						if (this._indexsUnique.estDoublon(lElement, aElement)) {
							lTestLibelleExisteDeja = true;
							return false;
						}
					}
				});
			}
			if (lTestLibelleExisteDeja) {
				const lMessageDoublon = ObjetTraduction_1.GTraductions.getValeur(
					"liste.doublonNom",
					[this.donnees.element.getLibelle()],
				);
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
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
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionListeDiffusion,
			{ pere: aParams.instance, evenement: aParams.evenement },
		);
		if (aParams.titre) {
			lFenetre.setOptionsFenetre({ titre: aParams.titre });
		}
		lFenetre.setDonnees(aParams.donnees);
	}
}
exports.ObjetFenetre_EditionListeDiffusion = ObjetFenetre_EditionListeDiffusion;
