const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteCalculCompetencesLivretScolaire extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
Requetes.inscrire(
	"CalculCompetencesLivretScolaire",
	ObjetRequeteCalculCompetencesLivretScolaire,
);
module.exports = { ObjetRequeteCalculCompetencesLivretScolaire };
