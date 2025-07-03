exports.ObjetRequeteSaisieListeThemes = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieListeThemes extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
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
exports.ObjetRequeteSaisieListeThemes = ObjetRequeteSaisieListeThemes;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieListeThemes",
	ObjetRequeteSaisieListeThemes,
);
