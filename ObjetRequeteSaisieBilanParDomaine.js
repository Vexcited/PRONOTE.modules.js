exports.ObjetRequeteSaisieBilanParDomaine = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteSaisieBilanParDomaine extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		this.JSON.Pilier = aParams.Pilier;
		this.JSON.Palier = aParams.Palier;
		this.JSON.Service = aParams.Service;
		this.JSON.ListeEleves = aParams.ListeEleves;
		if (!!aParams.niveauDAcquisition) {
			this.JSON.niveauDAcquisition = aParams.niveauDAcquisition;
		}
		if (
			!!aParams.date &&
			!!aParams.niveauDAcquisition &&
			UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
				aParams.niveauDAcquisition,
			)
		) {
			this.JSON.date = aParams.date;
		}
		if (!!aParams.observation) {
			this.JSON.observation = aParams.observation;
		}
		if (!!aParams.listeElementsCompetences) {
			aParams.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: this._serialiseElementCompetence.bind(this),
			});
			this.JSON.listeElementsCompetences = aParams.listeElementsCompetences;
		}
		if (!!aParams.listeServicesLVE) {
			aParams.listeServicesLVE.setSerialisateurJSON({
				methodeSerialisation: this._serialiseServiceLVE.bind(this),
			});
			this.JSON.listeServicesLVE = aParams.listeServicesLVE;
		}
		return this.appelAsynchrone();
	}
	_serialiseElementCompetence(aElementCompetence, aJSON) {
		aJSON.niveauDAcquisition = aElementCompetence.niveauDAcquisition;
		aJSON.observation = aElementCompetence.observation;
		aJSON.observationPubliee = aElementCompetence.observationPubliee;
		aJSON.dateValidation = aElementCompetence.dateValidation;
		if (
			aElementCompetence.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Evaluation
		) {
			aJSON.relationESI = aElementCompetence.relationESI;
		}
		if (!!aElementCompetence.listeInfosServices) {
			aElementCompetence.listeInfosServices.setSerialisateurJSON({
				methodeSerialisation: this._serialiseInfosService.bind(this),
			});
			aJSON.listeInfosServices = aElementCompetence.listeInfosServices;
		}
	}
	_serialiseInfosService(aInfosService, aJSON) {
		aJSON.niveauAcquisition = aInfosService.niveauAcquisition;
		aJSON.niveauEquivCE = aInfosService.niveauEquivCE;
	}
	_serialiseServiceLVE(aServiceLVE, aJSON) {
		aJSON.niveauAcquiDomaine = aServiceLVE.niveauAcquiDomaine;
	}
}
exports.ObjetRequeteSaisieBilanParDomaine = ObjetRequeteSaisieBilanParDomaine;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieBilanParDomaine",
	ObjetRequeteSaisieBilanParDomaine,
);
