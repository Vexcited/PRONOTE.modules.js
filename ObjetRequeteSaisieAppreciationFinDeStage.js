exports.ObjetRequeteSaisieAppreciationFinDeStage = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
class ObjetRequeteSaisieAppreciationFinDeStage extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParam) {
		this.JSON.eleve = new ObjetElement_1.ObjetElement("", aParam.numEleve);
		aParam.stage.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.JSON.stage = aParam.stage.toJSON();
		this.serialiserAnnexe(aParam.stage, this.JSON.stage);
		aParam.listePJ.setSerialisateurJSON({
			methodeSerialisation: this.serialiserDocumentsJoints.bind(this),
		});
		this.JSON.listeFichiers = aParam.listePJ;
		return this.appelAsynchrone();
	}
	serialiserAnnexe(aStage, aJSON) {
		aJSON.sujet = aStage.sujet.toJSON();
		aJSON.sujetDetaille = aStage.sujetDetaille;
		aJSON.activitesDejaRealisees = aStage.activitesDejaRealisees;
		aJSON.competencesMobilisees = aStage.competencesMobilisees;
		aJSON.objectifs = aStage.objectifs;
		aJSON.activitesPrevues = aStage.activitesPrevues;
		aJSON.moyensMobilises = aStage.moyensMobilises;
		aJSON.competencesVisees = aStage.competencesVisees;
		aJSON.travauxAuxMineurs = aStage.travauxAuxMineurs;
		aJSON.modalitesConcertation = aStage.modalitesConcertation;
		aJSON.typeModalitesEvaluation = aStage.typeModalitesEvaluation.toJSON();
		aJSON.modalitesEvaluation = aStage.modalitesEvaluation;
		aStage.suiviStage.setSerialisateurJSON({
			methodeSerialisation: this.serialiserSuiviStage.bind(this),
		});
		aJSON.suiviStage = aStage.suiviStage;
		aStage.appreciations.setSerialisateurJSON({
			methodeSerialisation: this.serialiserAppreciations.bind(this),
		});
		aJSON.appreciations = aStage.appreciations;
		aStage.listePJ.setSerialisateurJSON({
			methodeSerialisation: this.serialiserDocumentsJoints.bind(this),
		});
		aJSON.listePJ = aStage.listePJ;
	}
	serialiserSuiviStage(aElement, aJSON) {
		$.extend(aJSON, aElement.copieToJSON());
		if (aElement.listePJ) {
			aElement.listePJ.setSerialisateurJSON({
				methodeSerialisation: this.serialiserDocumentsJoints.bind(this),
			});
			aJSON.listePJ = aElement.listePJ;
		}
	}
	serialiserDocumentsJoints(aDocument, aJSON) {
		$.extend(aJSON, aDocument.copieToJSON());
	}
	serialiserAppreciations(aElement, aJSON) {
		$.extend(aJSON, aElement.copieToJSON());
	}
}
exports.ObjetRequeteSaisieAppreciationFinDeStage =
	ObjetRequeteSaisieAppreciationFinDeStage;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAppreciationFinDeStage",
	ObjetRequeteSaisieAppreciationFinDeStage,
);
