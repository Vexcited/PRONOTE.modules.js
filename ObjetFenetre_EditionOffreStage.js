exports.ObjetFenetre_EditionOffreStage = void 0;
const ObjetEditionOffreStage_1 = require("ObjetEditionOffreStage");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
class ObjetFenetre_EditionOffreStage extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._parametres = {
			avecPeriode: false,
			avecSujetObjetSaisie: true,
			avecGestionPJ: false,
			tailleMaxPieceJointe: 0,
			avecEditionDocumentsJoints: false,
			genreRessourcePJ: 0,
		};
		this.setOptionsFenetre({ largeur: 600 });
	}
	construireInstances() {
		this.identEditOffre = this.add(
			ObjetEditionOffreStage_1.ObjetEditionOffreStage,
			null,
			this._initEditOffre.bind(this),
		);
	}
	setDonnees(aParam) {
		this.paramOrigine = aParam;
		this.paramModifie = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		this.estEnCreation = aParam.estEnCreation;
		this.estEnEdition = aParam.estEnEdition;
		this.getInstance(this.identEditOffre).setDonnees({
			offreStage: this.paramModifie.offre,
			sujetsStage: this.paramModifie.sujetsStage,
		});
		this.afficher();
	}
	composeContenu() {
		return (
			'<div class="edition-offre" id="' +
			this.getInstance(this.identEditOffre).getNom() +
			'"></div>'
		);
	}
	surValidation(aNumeroBouton) {
		const lInstanceEditOffre = this.getInstance(this.identEditOffre);
		this.fermer();
		if (aNumeroBouton === 1) {
			if (this.estEnCreation) {
				const lOffre = {
					offre: lInstanceEditOffre.getOffreStage(),
					estEnCreation: true,
				};
				this.callback.appel(lOffre);
			} else if (!!this.estEnEdition) {
				this.callback.appel(this.paramModifie);
			}
		}
	}
	setParametresEditionOffreStage(aParam) {
		$.extend(this._parametres, aParam);
	}
	_initEditOffre(aInstance) {
		const lParams = { maxWidth: this.optionsFenetre.largeur - 22 };
		aInstance.setParametres($.extend(lParams, this._parametres));
	}
}
exports.ObjetFenetre_EditionOffreStage = ObjetFenetre_EditionOffreStage;
