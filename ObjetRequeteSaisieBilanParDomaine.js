const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class ObjetRequeteSaisieBilanParDomaine extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
			TUtilitaireCompetences.estNiveauAcqui(aParams.niveauDAcquisition)
		) {
			this.JSON.date = aParams.date;
		}
		if (!!aParams.observation) {
			this.JSON.observation = aParams.observation;
		}
		if (!!aParams.listeElementsCompetences) {
			aParams.listeElementsCompetences.setSerialisateurJSON({
				methodeSerialisation: _serialiseElementCompetence,
			});
			this.JSON.listeElementsCompetences = aParams.listeElementsCompetences;
		}
		if (!!aParams.listeServicesLVE) {
			aParams.listeServicesLVE.setSerialisateurJSON({
				methodeSerialisation: _serialiseServiceLVE,
			});
			this.JSON.listeServicesLVE = aParams.listeServicesLVE;
		}
		return this.appelAsynchrone();
	}
}
Requetes.inscrire("SaisieBilanParDomaine", ObjetRequeteSaisieBilanParDomaine);
function _serialiseElementCompetence(aElementCompetence, aJSON) {
	aJSON.niveauDAcquisition = aElementCompetence.niveauDAcquisition;
	aJSON.observation = aElementCompetence.observation;
	aJSON.observationPubliee = aElementCompetence.observationPubliee;
	aJSON.dateValidation = aElementCompetence.dateValidation;
	if (aElementCompetence.getGenre() === EGenreRessource.Evaluation) {
		aJSON.relationESI = aElementCompetence.relationESI;
	}
	if (!!aElementCompetence.listeInfosServices) {
		aElementCompetence.listeInfosServices.setSerialisateurJSON({
			methodeSerialisation: _serialiseInfosService,
		});
		aJSON.listeInfosServices = aElementCompetence.listeInfosServices;
	}
}
function _serialiseInfosService(aInfosService, aJSON) {
	aJSON.niveauAcquisition = aInfosService.niveauAcquisition;
	aJSON.niveauEquivCE = aInfosService.niveauEquivCE;
}
function _serialiseServiceLVE(aServiceLVE, aJSON) {
	aJSON.niveauAcquiDomaine = aServiceLVE.niveauAcquiDomaine;
}
module.exports = { ObjetRequeteSaisieBilanParDomaine };
