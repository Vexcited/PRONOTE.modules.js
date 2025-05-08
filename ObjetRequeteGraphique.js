exports.ObjetRequeteGraphique = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteGraphique extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParametres) {
		Object.assign(
			this.JSON,
			{
				eleve: null,
				periode: null,
				largeur: 0,
				hauteur: 0,
				accepteBase64: true,
			},
			aParametres,
		);
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteGraphique = ObjetRequeteGraphique;
CollectionRequetes_1.Requetes.inscrire("Graphique", ObjetRequeteGraphique);
