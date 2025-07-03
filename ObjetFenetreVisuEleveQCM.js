exports.ObjetFenetreVisuEleveQCM = void 0;
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetVisuEleveQCM_2 = require("ObjetVisuEleveQCM");
const ObjetRequeteQCMQuestions_1 = require("ObjetRequeteQCMQuestions");
const ObjetRequeteSaisieQCMReponses_1 = require("ObjetRequeteSaisieQCMReponses");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class ObjetFenetreVisuEleveQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.eleve = null;
		this.afficherCopieCachee = false;
		this.idVisuEleve = this.Nom + "_VisuEleve";
		this.objetVisuEleve = new ObjetVisuEleveQCM_1.ObjetVisuEleve(
			this.Nom + ".objetVisuEleve",
			this.evenementVisuEleve.bind(this),
		);
		this.setOptionsFenetre({
			modale: true,
			largeur: ObjetNavigateur_1.Navigateur.clientL - 76,
			hauteur: ObjetNavigateur_1.Navigateur.clientH - 80,
			hauteurMaxContenu: ObjetNavigateur_1.Navigateur.clientH - 160 - 10,
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
			case ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.get:
				if (
					GEtatUtilisateur.estEspaceExecutionQCM() &&
					aParam.pourInitialisation
				) {
					new ObjetRequeteSaisieQCMReponses_1.ObjetRequeteSaisieQCMReponses(
						this,
						this._actionSurQCMInitialisation.bind(this, aParam),
					).lancerRequete(aParam);
				} else {
					this._actionSurQCMInitialisation(aParam);
				}
				break;
			case ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.set:
				new ObjetRequeteSaisieQCMReponses_1.ObjetRequeteSaisieQCMReponses(
					this,
					this._actionSurSaisieReponses,
				).lancerRequete(aParam);
				break;
			case ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.close:
				if (aParam.pourCloture && GEtatUtilisateur.estEspaceExecutionQCM()) {
					new ObjetRequeteSaisieQCMReponses_1.ObjetRequeteSaisieQCMReponses(
						this,
						this._actionSurSaisieReponses,
					).lancerRequete(aParam);
					this.callback.appel(aParam);
				}
				if (this.estAffiche()) {
					this.fermer();
				}
				break;
			case ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.croixFermeture:
				this.callback.appel({
					action: ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.close,
				});
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
		new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
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
	async fermer(aSurInteractionUtilisateur) {
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
				action: ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.croixFermeture,
			});
		}
	}
}
exports.ObjetFenetreVisuEleveQCM = ObjetFenetreVisuEleveQCM;
