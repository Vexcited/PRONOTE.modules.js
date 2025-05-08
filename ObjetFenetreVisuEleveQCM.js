const { ObjetVisuEleve } = require("ObjetVisuEleveQCM.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { TypeCallbackVisuEleveQCM } = require("ObjetVisuEleveQCM.js");
const { ObjetRequeteQCMQuestions } = require("ObjetRequeteQCMQuestions.js");
const {
	ObjetRequeteSaisieQCMReponses,
} = require("ObjetRequeteSaisieQCMReponses.js");
class ObjetFenetreVisuEleveQCM extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.eleve = null;
		this.afficherCopieCachee = false;
		this.idVisuEleve = this.Nom + "_VisuEleve";
		this.objetVisuEleve = new ObjetVisuEleve(
			this.Nom + ".objetVisuEleve",
			this.evenementVisuEleve.bind(this),
		);
		this.setOptionsFenetre({
			modale: true,
			largeur: GNavigateur.clientL - 76,
			hauteur: GNavigateur.clientH - 80,
			hauteurMaxContenu: GNavigateur.clientH - 160 - 10,
		});
	}
	composeContenu() {
		const H = [];
		H.push('<div id="', this.idVisuEleve, '" class="full-height"></div>');
		return H.join("");
	}
	setDonnees(aQCM) {
		this.qcm = aQCM;
		if (!this.estAffiche()) {
			this.afficher();
		}
		this.objetVisuEleve.setDonnees(this.qcm);
		this.setOptionsFenetre({ titre: this.objetVisuEleve.composeTitre() });
	}
	setDonneesReponse(aParam) {
		if (this.estAffiche()) {
			this.objetVisuEleve.setDonneesReponse(aParam);
		}
	}
	setEtatFicheVisu(aParam) {
		this.setParametres(
			aParam.numExecQCM,
			aParam.modeProf,
			aParam.eleve,
			aParam.afficherCopieCachee,
		);
		this.setDonnees(aParam.donnees);
	}
	setParametres(aNumeroExecutionQCM, aModeProf, aEleve, aAfficherCopieCachee) {
		if (aEleve) {
			this.eleve = aEleve;
		}
		this.afficherCopieCachee = !!aAfficherCopieCachee;
		this.objetVisuEleve.setParametres({
			idContenu: this.idVisuEleve.escapeJQ(),
			numeroExecution: aNumeroExecutionQCM,
			modeProf: aModeProf !== undefined ? aModeProf : false,
		});
	}
	evenementVisuEleve(aParam) {
		if (aParam === undefined) {
			return;
		}
		switch (aParam.action) {
			case TypeCallbackVisuEleveQCM.get:
				if (
					GEtatUtilisateur.estEspaceExecutionQCM() &&
					aParam.pourInitialisation
				) {
					new ObjetRequeteSaisieQCMReponses(
						this,
						this._actionSurQCMInitialisation.bind(this, aParam),
					).lancerRequete(aParam);
				} else {
					this._actionSurQCMInitialisation(aParam);
				}
				break;
			case TypeCallbackVisuEleveQCM.set:
				new ObjetRequeteSaisieQCMReponses(
					this,
					this._actionSurSaisieReponses,
				).lancerRequete(aParam);
				break;
			case TypeCallbackVisuEleveQCM.close:
				if (aParam.pourCloture && GEtatUtilisateur.estEspaceExecutionQCM()) {
					new ObjetRequeteSaisieQCMReponses(
						this,
						this._actionSurSaisieReponses,
					).lancerRequete(aParam);
					this.callback.appel(aParam);
				}
				if (this.estAffiche()) {
					this.fermer();
				}
				break;
			case TypeCallbackVisuEleveQCM.croixFermeture:
				this.callback.appel({ action: TypeCallbackVisuEleveQCM.close });
				break;
		}
	}
	_actionSurQCMInitialisation(aParamsRequeteQCMInitialisation) {
		if (this.eleve) {
			aParamsRequeteQCMInitialisation.eleve = this.eleve;
		}
		if (this.afficherCopieCachee) {
			aParamsRequeteQCMInitialisation.afficherCopieCachee =
				this.afficherCopieCachee;
		}
		new ObjetRequeteQCMQuestions(
			this,
			this._actionSurSaisieQCMQuestions,
		).lancerRequete(aParamsRequeteQCMInitialisation);
	}
	_actionSurSaisieQCMQuestions(aParam) {
		this.setDonnees(aParam);
	}
	_actionSurSaisieReponses(aParam) {
		this.setDonneesReponse(aParam);
	}
	fermer(aSurInteractionUtilisateur) {
		const lEnAffichage = this.estAffiche();
		super.fermer(aSurInteractionUtilisateur);
		this.qcm = undefined;
		this.objetVisuEleve.setParametres({
			idContenu: this.idVisuEleve.escapeJQ(),
			numeroExecution: null,
		});
		const lSurInteractionUtilisateur =
			aSurInteractionUtilisateur === null ||
			aSurInteractionUtilisateur === undefined
				? true
				: aSurInteractionUtilisateur;
		if (lEnAffichage && lSurInteractionUtilisateur) {
			this.evenementVisuEleve({
				action: TypeCallbackVisuEleveQCM.croixFermeture,
			});
		}
	}
}
module.exports = { ObjetFenetreVisuEleveQCM };
