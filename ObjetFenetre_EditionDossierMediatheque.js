exports.ObjetFenetre_EditionDossierMediatheque = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetFenetre_EditionDossierMediatheque extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 300,
			hauteur: null,
			avecTailleSelonContenu: true,
		});
	}
	jsxModeleDossierMediatheque() {
		return {
			getValue: () => {
				return this.dossierMediatheque
					? this.dossierMediatheque.getLibelle()
					: "";
			},
			setValue: (aValue) => {
				if (this.dossierMediatheque) {
					this.dossierMediatheque.setLibelle(aValue);
					this.dossierMediatheque.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
			},
		};
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str("input", {
				type: "text",
				"ie-model": this.jsxModeleDossierMediatheque.bind(this),
				class: "EspaceInput full-width",
				title: ObjetTraduction_1.GTraductions.getValeur("Libelle"),
				placeholder: ObjetTraduction_1.GTraductions.getValeur("Libelle"),
			}),
		);
		return H.join("");
	}
	setDonnees(aDossierMediatheque) {
		this.dossierMediatheque =
			MethodesObjet_1.MethodesObjet.dupliquer(aDossierMediatheque);
		this.afficher();
		this.positionnerFenetre();
	}
	getParametresValidation(aNumeroBouton) {
		const lParametresValidation = {
			dossierMediatheque: this.dossierMediatheque,
		};
		return lParametresValidation;
	}
}
exports.ObjetFenetre_EditionDossierMediatheque =
	ObjetFenetre_EditionDossierMediatheque;
