exports.ObjetRequeteCalculCompetencesLivretScolaire = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteCalculCompetencesLivretScolaire extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aObjet) {
		this.JSON = {
			classe: aObjet.classe,
			nePasRemplacer:
				aObjet.nePasRemplacer === undefined ? true : aObjet.nePasRemplacer,
		};
		if (!!aObjet.discipline) {
			this.JSON.discipline = aObjet.discipline.toJSON();
			if (!!aObjet.discipline.service) {
				this.JSON.discipline.service = aObjet.discipline.service;
			}
			if (!!aObjet.discipline.typeEnseignement) {
				this.JSON.discipline.typeEnseignement =
					aObjet.discipline.typeEnseignement;
			}
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteCalculCompetencesLivretScolaire =
	ObjetRequeteCalculCompetencesLivretScolaire;
CollectionRequetes_1.Requetes.inscrire(
	"CalculCompetencesLivretScolaire",
	ObjetRequeteCalculCompetencesLivretScolaire,
);
