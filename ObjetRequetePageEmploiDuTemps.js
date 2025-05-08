exports.ObjetRequetePageEmploiDuTemps = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequetePageEmploiDuTemps extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		this.JSON = $.extend(
			{
				ressource: undefined,
				listeRessources: undefined,
				numeroSemaine: undefined,
				dateDebut: undefined,
				dateFin: undefined,
				ignorerHeures: undefined,
				domaine: undefined,
				matiere: undefined,
				niveau: undefined,
				dossierProgression: undefined,
				elementProgression: undefined,
				avecAbsencesEleve: false,
				avecConseilDeClasse: false,
				avecRetenuesEleve: false,
				estEDTPermanence: false,
				estEDTAnnuel: undefined,
				avecAbsencesRessource: undefined,
				avecCoursSortiePeda: undefined,
				avecDisponibilites: undefined,
				avecRessourcesLibrePiedHoraire: undefined,
			},
			aParametres,
		);
		if (aParametres.ressource) {
			this.JSON.Ressource = aParametres.ressource;
		}
		if (this.JSON.listeRessources) {
			this.JSON.listeRessources.setSerialisateurJSON({
				ignorerEtatsElements: true,
			});
		}
		if (aParametres.domaine !== null && aParametres.domaine !== undefined) {
			this.JSON.Domaine = aParametres.domaine;
		} else if (
			aParametres.numeroSemaine !== null &&
			aParametres.numeroSemaine !== undefined
		) {
			this.JSON.NumeroSemaine = aParametres.numeroSemaine;
		} else if (!aParametres.estEDTAnnuel) {
			this.JSON.DateDebut = aParametres.dateDebut;
			this.JSON.ignorerHeures = aParametres.ignorerHeures;
			if (aParametres.dateFin !== null && aParametres.dateFin !== undefined) {
				this.JSON.DateFin = aParametres.dateFin;
			}
		}
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.JSONReponse.listeCours =
			new ObjetDeserialiser_1.ObjetDeserialiser().listeCours(this.JSONReponse);
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequetePageEmploiDuTemps = ObjetRequetePageEmploiDuTemps;
CollectionRequetes_1.Requetes.inscrire(
	"PageEmploiDuTemps",
	ObjetRequetePageEmploiDuTemps,
);
