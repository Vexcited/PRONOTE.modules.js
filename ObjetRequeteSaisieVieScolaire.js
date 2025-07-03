exports.ObjetRequeteSaisieVieScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetRequeteSaisieVieScolaire extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		if (aParams.estListeDispenses) {
			aParams.listeAbsences.setSerialisateurJSON({
				methodeSerialisation: this._serialiserDispense.bind(this),
			});
		} else {
			aParams.listeAbsences.setSerialisateurJSON({
				methodeSerialisation: this._serialiserAbsences.bind(this),
			});
		}
		this.JSON.listeAbsences = aParams.listeAbsences;
		this.JSON.estControle = aParams.estControle;
		return this.appelAsynchrone();
	}
	actionApresRequete(aGenreReponse) {
		let lAbsence;
		if (this.JSONRapportSaisie && this.JSONRapportSaisie.absence) {
			lAbsence = this.JSONRapportSaisie.absence;
		}
		const lObj = !!lAbsence
			? lAbsence
			: { genreReponse: aGenreReponse, JSONReponse: this.JSONReponse };
		if (
			this.JSONRapportSaisie &&
			this.JSONRapportSaisie.servicesPeriscolairePourAbsence
		) {
			lObj.servicesPeriscolairePourAbsence =
				this.JSONRapportSaisie.servicesPeriscolairePourAbsence;
		}
		this.callbackReussite.appel(lObj);
	}
	_serialiserDispense(aDispense, aJSON) {
		if (!!aDispense.justificatifs) {
			aDispense.justificatifs.setSerialisateurJSON({
				methodeSerialisation: this._surValidationFichier.bind(this),
			});
			aJSON.justificatifs = aDispense.justificatifs;
		}
		aJSON.commentaire = aDispense.commentaire;
		if (aDispense.cours) {
			aJSON.cours = aDispense.cours.toJSONAll();
		} else {
			aJSON.matieres = aDispense.matieres.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
			aJSON.dateDebut = aDispense.dateDebut;
			aJSON.dateFin = aDispense.dateFin;
		}
	}
	_serialiserAbsences(aAbsence, aJSON) {
		if (!!aAbsence.documents) {
			aAbsence.documents.setSerialisateurJSON({
				methodeSerialisation: this._surValidationFichier.bind(this),
			});
			aJSON.documents = aAbsence.documents;
		}
		aJSON.estLue = aAbsence.estLue;
		aJSON.justification = aAbsence.justification;
		aJSON.estUneCreationParent = aAbsence.estUneCreationParent;
		aJSON.debut = MethodesObjet_1.MethodesObjet.dupliquer(aAbsence.debut);
		if (aAbsence.debut && aAbsence.debut.heure) {
			aAbsence.debut.heure.place = aAbsence.debut.heure.getPosition();
			aJSON.debut.heure = aAbsence.debut.heure.toJSONAll();
		}
		aJSON.fin = MethodesObjet_1.MethodesObjet.dupliquer(aAbsence.fin);
		if (aAbsence.fin && aAbsence.fin.heure) {
			aAbsence.fin.heure.place = aAbsence.fin.heure.getPosition();
			aJSON.fin.heure = aAbsence.fin.heure.toJSONAll();
		}
		aJSON.motifParent = aAbsence.motifParent;
		aJSON.parentAAccuseDeReception = aAbsence.parentAAccuseDeReception;
	}
	_surValidationFichier(aElement, aJSON) {
		const lIdFichier =
			aElement.idFichier !== undefined
				? aElement.idFichier
				: aElement.Fichier !== undefined
					? aElement.Fichier.idFichier
					: null;
		if (lIdFichier !== null) {
			aJSON.idFichier = "" + lIdFichier;
		}
		if (!aElement.nomFichier) {
			aJSON.nomFichier = aElement.nomOriginal;
		} else {
			aJSON.nomFichier = aElement.nomFichier;
		}
		aJSON.url = aElement.url;
	}
}
exports.ObjetRequeteSaisieVieScolaire = ObjetRequeteSaisieVieScolaire;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieVieScolaire",
	ObjetRequeteSaisieVieScolaire,
);
