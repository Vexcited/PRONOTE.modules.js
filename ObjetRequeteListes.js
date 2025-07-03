exports.ObjetRequeteListes_ListeDisciplinesLivret =
	exports.ObjetRequeteListes_ListeTousPiliersDeCompetence =
	exports.ObjetRequeteListes_ListeMateriels =
	exports.ObjetRequeteListes_ListeAppreciations =
	exports.ObjetRequeteListes_ListePersonnels =
	exports.ObjetRequeteListes_ListeProfesseurs =
	exports.ObjetRequeteListes_ListeSalles =
	exports.ObjetRequeteListes_ListePaliers =
	exports.ObjetRequeteListes_ListeMatieres =
	exports.ObjetRequeteListes_ListePeriodes =
	exports.ObjetRequeteListes_ListeEleves =
	exports.ObjetRequeteListes_ListeClassesGroupes =
	exports.ObjetRequeteListes =
		void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteListes extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aDonneesRequete) {
		if (aDonneesRequete) {
			const lEtatUtil = GApplication.getEtatUtilisateur();
			const lEleve = lEtatUtil.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			);
			if (aDonneesRequete.avecPalier) {
				this.JSON.palier = lEtatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Palier,
				);
			}
			if (aDonneesRequete.avecPilier) {
				this.JSON.pilier = lEtatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Pilier,
				);
			}
			if (aDonneesRequete.avecClasse) {
				this.JSON.ressource = lEtatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
			}
			if (
				aDonneesRequete.avecClasse &&
				lEtatUtil.Navigation.getRessources(
					Enumere_Ressource_1.EGenreRessource.Classe,
				)
			) {
				this.JSON.listeRessources = lEtatUtil.Navigation.getRessources(
					Enumere_Ressource_1.EGenreRessource.Classe,
				).setSerialisateurJSON({ ignorerEtatsElements: true });
			}
			if (aDonneesRequete.avecPeriode) {
				this.JSON.periode = lEtatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				);
			}
			if (aDonneesRequete.avecService) {
				this.JSON.service = lEtatUtil.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Service,
				);
			}
			if (aDonneesRequete.avecEleve && lEleve) {
				this.JSON.eleve = lEleve;
			}
			if (aDonneesRequete.avecEleve && lEleve) {
				this.JSON.classeDeLeleve = lEleve.classe;
			}
			if (aDonneesRequete.avecUniquementStagiaire) {
				this.JSON.avecUniquementStagiaire = true;
			}
			if (aDonneesRequete.ressource) {
				this.JSON.ressource = aDonneesRequete.ressource;
			}
			if (aDonneesRequete.listeRessources) {
				this.JSON.listeRessources = aDonneesRequete.listeRessources;
			}
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteListes = ObjetRequeteListes;
class ObjetRequeteListes_ListeClassesGroupes extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeClassesGroupes =
	ObjetRequeteListes_ListeClassesGroupes;
class ObjetRequeteListes_ListeEleves extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeEleves = ObjetRequeteListes_ListeEleves;
class ObjetRequeteListes_ListePeriodes extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListePeriodes = ObjetRequeteListes_ListePeriodes;
class ObjetRequeteListes_ListeMatieres extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeMatieres = ObjetRequeteListes_ListeMatieres;
class ObjetRequeteListes_ListePaliers extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListePaliers = ObjetRequeteListes_ListePaliers;
class ObjetRequeteListes_ListeSalles extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeSalles = ObjetRequeteListes_ListeSalles;
class ObjetRequeteListes_ListeProfesseurs extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeProfesseurs =
	ObjetRequeteListes_ListeProfesseurs;
class ObjetRequeteListes_ListePersonnels extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListePersonnels = ObjetRequeteListes_ListePersonnels;
class ObjetRequeteListes_ListeAppreciations extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeAppreciations =
	ObjetRequeteListes_ListeAppreciations;
class ObjetRequeteListes_ListeMateriels extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeMateriels = ObjetRequeteListes_ListeMateriels;
class ObjetRequeteListes_ListeTousPiliersDeCompetence extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeTousPiliersDeCompetence =
	ObjetRequeteListes_ListeTousPiliersDeCompetence;
class ObjetRequeteListes_ListeDisciplinesLivret extends ObjetRequeteListes {}
exports.ObjetRequeteListes_ListeDisciplinesLivret =
	ObjetRequeteListes_ListeDisciplinesLivret;
CollectionRequetes_1.Requetes.inscrire(
	"listeClassesGroupes",
	ObjetRequeteListes_ListeClassesGroupes,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeEleves",
	ObjetRequeteListes_ListeEleves,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListePeriodes",
	ObjetRequeteListes_ListePeriodes,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeMatieres",
	ObjetRequeteListes_ListeMatieres,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListePaliers",
	ObjetRequeteListes_ListePaliers,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeSalles",
	ObjetRequeteListes_ListeSalles,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeProfesseurs",
	ObjetRequeteListes_ListeProfesseurs,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListePersonnels",
	ObjetRequeteListes_ListePersonnels,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeAppreciations",
	ObjetRequeteListes_ListeAppreciations,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeMateriels",
	ObjetRequeteListes_ListeMateriels,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeTousPiliersDeCompetence",
	ObjetRequeteListes_ListeTousPiliersDeCompetence,
);
CollectionRequetes_1.Requetes.inscrire(
	"ListeDisciplinesLivret",
	ObjetRequeteListes_ListeDisciplinesLivret,
);
