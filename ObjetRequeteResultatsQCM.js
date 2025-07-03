exports.ObjetRequeteResultatsQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequeteResultatsQCM extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		this.JSON = { element: aParam.element };
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		const lParam = {};
		if (this.JSONReponse.message) {
			lParam.message = this.JSONReponse.message;
		} else {
			lParam.listeEleves =
				new ObjetListeElements_1.ObjetListeElements().fromJSON(
					this.JSONReponse.listeEleves,
					this._ajouterEleve.bind(this),
				);
			lParam.listeEleves.trier();
			lParam.listeQuestions =
				new ObjetListeElements_1.ObjetListeElements().fromJSON(
					this.JSONReponse.listeQuestions,
					_ajouterQuestion,
				);
			lParam.moyennes = {
				noteQCM: this.JSONReponse.MoyenneNoteQCM,
				tpsReponse: this.JSONReponse.MoyenneTpsDeReponseQCM,
				ressenti: this.JSONReponse.MoyenneRessentiQCM,
			};
			lParam.avecAffichage = {
				classe: this.JSONReponse.afficherColClasse,
				noteQCM: this.JSONReponse.afficherColNoteQCM,
				note2QCM: this.JSONReponse.afficherColNote2QCM,
				ressenti: this.JSONReponse.afficherColRessenti,
				tentatives: this.JSONReponse.afficherColNbTentative,
			};
			lParam.valeurs = {
				nbTotalPts: this.JSONReponse.NombrePtsExeQCM,
				nbEleves: this.JSONReponse.NombreDEleves,
				dureeMax: this.JSONReponse.DureeMaxQCM,
			};
		}
		this.callbackReussite.appel(lParam);
	}
	_ajouterEleve(aJSON, aElement) {
		aElement.copieJSON(aJSON);
		aElement.classe = new ObjetElement_1.ObjetElement().fromJSON(aJSON.classe);
		aElement.listeReponses =
			new ObjetListeElements_1.ObjetListeElements().fromJSON(
				aJSON.listeReponses,
				_ajouterReponse,
			);
		aElement.execution = new ObjetElement_1.ObjetElement().fromJSON(
			aJSON.execution,
		);
		new ObjetDeserialiser_1.ObjetDeserialiser()._ajouterQCM(
			aJSON.execution,
			aElement.execution,
		);
		if (!!aJSON.executionCachee) {
			aElement.executionCachee = new ObjetElement_1.ObjetElement().fromJSON(
				aJSON.executionCachee,
			);
			new ObjetDeserialiser_1.ObjetDeserialiser()._ajouterQCM(
				aJSON.executionCachee,
				aElement.executionCachee,
			);
		}
	}
}
exports.ObjetRequeteResultatsQCM = ObjetRequeteResultatsQCM;
CollectionRequetes_1.Requetes.inscrire(
	"ResultatsQCM",
	ObjetRequeteResultatsQCM,
);
function _ajouterReponse(aJSON, aElement) {
	aElement.copieJSON(aJSON);
}
function _ajouterQuestion(aJSON, aElement) {
	aElement.copieJSON(aJSON);
}
