exports.ObjetFenetre_ParamExecutionQCM = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetParamExecutionQCM_1 = require("ObjetParamExecutionQCM");
class ObjetFenetre_ParamExecutionQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identParamExecQCM = this.add(
			ObjetParamExecutionQCM_1.ObjetParamExecutionQCM,
		);
	}
	setActif(aActif) {
		this.Actif = aActif;
	}
	setDonnees(aDonnees) {
		this.paramOrigine = aDonnees.executionQCM;
		this.paramModifie = MethodesObjet_1.MethodesObjet.dupliquer(
			aDonnees.executionQCM,
		);
		const lDonnees = {
			estUneExecution:
				aDonnees.estUneExecution !== undefined
					? aDonnees.estUneExecution
					: !!aDonnees.executionQCM,
			estPourExecution: !!aDonnees.estPourExecution,
			avecConsigne: !!aDonnees.avecConsigne,
			avecPersonnalisationProjetAccompagnement:
				!!aDonnees.avecPersonnalisationProjetAccompagnement,
			avecModeCorrigeALaDate: !!aDonnees.avecModeCorrigeALaDate,
			avecMultipleExecutions: !!aDonnees.avecMultipleExecutions,
			afficherDatesPublication: !!this.paramOrigine.estUnTAF,
			afficherModeQuestionnaire: aDonnees.afficherModeQuestionnaire,
			afficherEnModeForm: aDonnees.afficherEnModeForm,
			afficherRessentiEleve: aDonnees.afficherRessentiEleve,
			autoriserSansCorrige: aDonnees.autoriserSansCorrige,
			autoriserCorrigerALaDate: aDonnees.autoriserCorrigerALaDate,
			executionQCM: this.paramModifie,
			ObjetFenetre_DetailsPIEleve: aDonnees.ObjetFenetre_DetailsPIEleve,
		};
		this.getInstance(this.identParamExecQCM).setActif(this.Actif);
		this.getInstance(this.identParamExecQCM).setDonnees(lDonnees);
		this.actualiser();
		this.afficher();
		this.getInstance(this.identParamExecQCM).actualiser();
	}
	actualiser() {
		this.surFixerTaille();
		ObjetHtml_1.GHtml.setHtml(this.IdContenu, this.composeContenu(), {
			controleur: this.getInstance(this.identParamExecQCM).controleur,
		});
	}
	composeContenu() {
		return this.getInstance(this.identParamExecQCM).composeContenu();
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(
			aNumeroBouton,
			aNumeroBouton > 0 ? this.paramModifie : this.paramOrigine,
		);
	}
}
exports.ObjetFenetre_ParamExecutionQCM = ObjetFenetre_ParamExecutionQCM;
