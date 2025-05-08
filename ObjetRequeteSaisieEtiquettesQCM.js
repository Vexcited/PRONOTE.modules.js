exports.ObjetRequeteSaisieEtiquettesQCM = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieEtiquettesQCM extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aNomCommande, aEtiquetteQCM) {
		this.JSON = { commande: aNomCommande };
		if (!!aEtiquetteQCM) {
			this.JSON.etiquette = aEtiquetteQCM.toJSON();
			this.JSON.etiquette.couleur = aEtiquetteQCM.couleur;
			this.JSON.etiquette.abr = aEtiquetteQCM.abr;
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieEtiquettesQCM = ObjetRequeteSaisieEtiquettesQCM;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieEtiquettesQCM",
	ObjetRequeteSaisieEtiquettesQCM,
);
(function (ObjetRequeteSaisieEtiquettesQCM) {
	let CommandeRequete;
	(function (CommandeRequete) {
		CommandeRequete["CreerEtiquette"] = "creerEtiquette";
		CommandeRequete["ModifierEtiquette"] = "modifierEtiquette";
		CommandeRequete["SupprimerEtiquette"] = "supprimerEtiquette";
	})(
		(CommandeRequete =
			ObjetRequeteSaisieEtiquettesQCM.CommandeRequete ||
			(ObjetRequeteSaisieEtiquettesQCM.CommandeRequete = {})),
	);
})(
	ObjetRequeteSaisieEtiquettesQCM ||
		(exports.ObjetRequeteSaisieEtiquettesQCM = ObjetRequeteSaisieEtiquettesQCM =
			{}),
);
