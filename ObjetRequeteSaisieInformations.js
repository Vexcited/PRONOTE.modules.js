const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { GCache } = require("Cache.js");
class ObjetRequeteSaisieInformations extends ObjetRequeteSaisie {
	constructor(...aParams) {
		super(...aParams);
	}
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
		if (GCache && GCache.general) {
			GCache.general._jetonViderCacheMessagerie = true;
		}
		return this.appelAsynchrone();
	}
	actionApresRequete(aParams) {
		if (this.JSONRapportSaisie && this.JSONRapportSaisie.messagerieSignature) {
			GEtatUtilisateur.messagerieSignature =
				this.JSONRapportSaisie.messagerieSignature;
		}
		super.actionApresRequete(...aParams);
	}
}
Requetes.inscrire("SaisieInformations", ObjetRequeteSaisieInformations);
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
module.exports = ObjetRequeteSaisieInformations;
