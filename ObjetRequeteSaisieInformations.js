exports.ObjetRequeteSaisieInformations = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Cache_1 = require("Cache");
const AccessApp_1 = require("AccessApp");
class ObjetRequeteSaisieInformations extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aDonnees) {
		$.extend(this.JSON, aDonnees);
		if (!!aDonnees.dossierMedical) {
			this.JSON.dossierMedical = aDonnees.dossierMedical.toJSONAll();
		}
		if (aDonnees.signature) {
			this.JSON.signature = {};
			this.JSON.signature.estSupprimee = aDonnees.signature.estSupprimee;
			this.JSON.signature.autoriser = aDonnees.signature.autoriser;
			if (aDonnees.signature.listeFichiers) {
				this.JSON.signature.listeFichiers =
					aDonnees.signature.listeFichiers.setSerialisateurJSON({
						methodeSerialisation: _serialisationFichier.bind(this),
					});
			}
		}
		if (Cache_1.GCache && Cache_1.GCache.general) {
			Cache_1.GCache.general._jetonViderCacheMessagerie = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete(aParams) {
		if (this.JSONRapportSaisie && this.JSONRapportSaisie.messagerieSignature) {
			(0, AccessApp_1.getApp)().getEtatUtilisateur().messagerieSignature =
				this.JSONRapportSaisie.messagerieSignature;
		}
		super.actionApresRequete(aParams);
	}
}
exports.ObjetRequeteSaisieInformations = ObjetRequeteSaisieInformations;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieInformations",
	ObjetRequeteSaisieInformations,
);
function _serialisationFichier(aElement, aJSON) {
	const lIdFichier =
		aElement.idFichier !== undefined
			? aElement.idFichier
			: aElement.Fichier !== undefined
				? aElement.Fichier.idFichier
				: null;
	if (lIdFichier !== null) {
		aJSON.idFichier = "" + lIdFichier;
	}
}
