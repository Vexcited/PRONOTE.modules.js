exports.ObjetRequeteCompetencesGrilles = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteCompetencesGrilles extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParam) {
		super(...aParam);
		const lApplicationSco = GApplication;
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	lancerRequete(aParam) {
		this.JSON.palier = aParam.palier
			? aParam.palier
			: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Palier,
				);
		this.JSON.pilier = aParam.pilier;
		this.JSON.genreReferentiel = aParam.genreReferentiel;
		this.JSON.categorieCompetence = aParam.categorieCompetence;
		this.JSON.masquerElementsOfficiels = aParam.masquerElementsOfficiels;
		this.JSON.afficherSeulementEvaluables = aParam.afficherSeulementEvaluables;
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		this.callbackReussite.appel(this.JSONReponse);
	}
}
exports.ObjetRequeteCompetencesGrilles = ObjetRequeteCompetencesGrilles;
CollectionRequetes_1.Requetes.inscrire(
	"CompetencesGrilles",
	ObjetRequeteCompetencesGrilles,
);
