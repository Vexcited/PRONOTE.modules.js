const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
class ObjetRequeteSaisieListeThemes extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres) {
		$.extend(this.JSON, aParametres);
		if (this.JSON.ListeThemes) {
			this.JSON.ListeThemes.setSerialisateurJSON({
				methodeSerialisation: function (aElement, aJSON) {
					aJSON.matiere = aElement.matiere;
				},
			});
		}
		return this.appelAsynchrone();
	}
}
Requetes.inscrire("SaisieListeThemes", ObjetRequeteSaisieListeThemes);
module.exports = ObjetRequeteSaisieListeThemes;
