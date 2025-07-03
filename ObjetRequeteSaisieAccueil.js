exports.ObjetRequeteSaisieAccueil = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const TypeGenreReponseInternetActualite_1 = require("TypeGenreReponseInternetActualite");
const TypeEtatPublication_1 = require("TypeEtatPublication");
class ObjetRequeteSaisieAccueil extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aDonnees) {
		if (
			aDonnees.actualites &&
			aDonnees.actualites.listeModesAff[
				TypeEtatPublication_1.TypeModeAff.MA_Reception
			].listeActualites
		) {
			const lListeActualites = aDonnees.actualites.listeModesAff[
				TypeEtatPublication_1.TypeModeAff.MA_Reception
			].listeActualites.getListeElements((aElement) => {
				return !aElement.estUnDeploiement;
			});
			lListeActualites.setSerialisateurJSON({
				methodeSerialisation: _serialiserActualite.bind(this),
			});
			this.JSON.listeActualites = lListeActualites;
		}
		if (aDonnees.vieScolaire && aDonnees.vieScolaire.listeAbsences) {
			aDonnees.vieScolaire.listeAbsences.setSerialisateurJSON({
				methodeSerialisation: _serialiserAbsences.bind(this),
			});
			this.JSON.listeAbsences = aDonnees.vieScolaire.listeAbsences;
		}
		if (aDonnees.incidents && aDonnees.incidents.listeIncidents) {
			aDonnees.incidents.listeIncidents.setSerialisateurJSON({
				methodeSerialisation: function (aElt, aJSON) {
					aJSON.estVise = aElt.estVise;
				},
			});
			this.JSON.incidents = aDonnees.incidents.listeIncidents;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieAccueil = ObjetRequeteSaisieAccueil;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieAccueil",
	ObjetRequeteSaisieAccueil,
);
function _serialiserActualite(aActualite, aJSON) {
	aJSON.genrePublic = aActualite.genrePublic;
	aJSON.public = aActualite.public;
	aJSON.lue = aActualite.lue;
	aActualite.listeQuestions.setSerialisateurJSON({
		methodeSerialisation: _serialiserListeQuestions,
	});
	aJSON.listeQuestions = aActualite.listeQuestions;
}
function _serialiserListeQuestions(aQuestion, aJSON) {
	aJSON.reponse = aQuestion.reponse.toJSONAll();
	aJSON.genreReponse = aQuestion.genreReponse;
	if (
		aQuestion.genreReponse >
			TypeGenreReponseInternetActualite_1.TypeGenreReponseInternetActualite
				.AvecAR &&
		aQuestion.reponse.avecReponse
	) {
		aJSON.reponse.valeurReponse = aQuestion.reponse.valeurReponse;
	}
	aJSON.reponse.avecReponse = aQuestion.reponse.avecReponse;
}
function _serialiserAbsences(aAbsence, aJSON) {
	aJSON.estLue = aAbsence.estLue;
	aJSON.justification = aAbsence.justification;
	if (!!aAbsence.documents) {
		aAbsence.documents.setSerialisateurJSON({
			methodeSerialisation: _surValidation_Fichier,
		});
		aJSON.documents = aAbsence.documents;
	}
	aJSON.motifParent = aAbsence.motifParent;
	aJSON.parentAAccuseDeReception = aAbsence.parentAAccuseDeReception;
}
function _surValidation_Fichier(aElement, aJSON) {
	const lIdFichier =
		aElement.idFichier !== undefined
			? aElement.idFichier
			: aElement.Fichier !== undefined
				? aElement.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = "" + lIdFichier;
	}
	aJSON.url = aElement.url;
}
