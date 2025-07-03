exports.ObjetRequeteSaisieSuivisAbsenceRetard = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
class ObjetRequeteSaisieSuivisAbsenceRetard extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(
		aEleve,
		aListeSuivisAbsenceRetard,
		aListeMedias,
		aListeFichiers,
	) {
		this.JSON.eleve = aEleve;
		if (!!aListeFichiers) {
			aListeFichiers.setSerialisateurJSON({
				methodeSerialisation: serialiserProjets.bind(this),
				ignorerEtatsElements: true,
			});
			this.JSON.certificats = aListeFichiers;
		}
		this.JSON.listeMedias = aListeMedias;
		if (this.JSON.listeMedias) {
			this.JSON.listeMedias.setSerialisateurJSON({
				methodeSerialisation: function (aElement, aJSON) {
					aJSON.code = aElement.code;
					aJSON.envoi = aElement.envoi;
				},
			});
		}
		this.JSON.liste = aListeSuivisAbsenceRetard;
		if (this.JSON.liste) {
			this.JSON.liste.setSerialisateurJSON({
				methodeSerialisation: this._surValidationSuivi,
			});
		}
		return this.appelAsynchrone();
	}
	_surValidationSuivi(aElement, aJSON) {
		if (aElement.estPere) {
			if (
				aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression ||
				aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
			) {
				return false;
			}
			aJSON.regle = !!aElement.regle;
			if (aElement.motif) {
				aJSON.motif = aElement.motif;
			}
		} else {
			if (!aElement.pourValidation()) {
				return false;
			}
			if (aElement.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression) {
				return true;
			}
			aJSON.pere = aElement.pere;
			if (aElement.date) {
				aJSON.date = aElement.date;
			}
			if (aElement.media) {
				aJSON.media = aElement.media;
			}
			if (aElement.personnel) {
				aJSON.personnel = aElement.personnel;
			}
			aJSON.respEleve = aElement.respEleve;
			aJSON.commentaire = aElement.commentaire;
		}
	}
}
exports.ObjetRequeteSaisieSuivisAbsenceRetard =
	ObjetRequeteSaisieSuivisAbsenceRetard;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieSuivisAbsenceRetard",
	ObjetRequeteSaisieSuivisAbsenceRetard,
);
function serialiserProjets(aProjet, aJSON) {
	$.extend(aJSON, aProjet.copieToJSON());
}
