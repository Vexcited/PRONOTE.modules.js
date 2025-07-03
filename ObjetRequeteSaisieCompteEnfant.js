exports.ObjetRequeteSaisieCompteEnfant = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteSaisieCompteEnfant extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
	lancerRequete(aParams) {
		$.extend(this.JSON, aParams);
		if (!!aParams.informationsMedicales) {
			this.JSON.informationsMedicales =
				aParams.informationsMedicales.toJSONAll();
		}
		if (!!aParams.allergies && !!aParams.allergies.listeAllergenes) {
			this.JSON.listeAllergenes = aParams.allergies.listeAllergenes;
			aParams.allergies.listeAllergenes.setSerialisateurJSON({
				methodeSerialisation: _ajouterActif,
				ignorerEtatsElements: true,
			});
			this.JSON.autoriseConsultationAllergies =
				aParams.allergies.autoriseConsultationAllergies;
		}
		if (!!aParams.restrictionsAlimentaires) {
			this.JSON.restrictionsAlimentaires.setSerialisateurJSON({
				methodeSerialisation: _ajouterActif,
			});
		}
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteSaisieCompteEnfant = ObjetRequeteSaisieCompteEnfant;
CollectionRequetes_1.Requetes.inscrire(
	"SaisieCompteEnfant",
	ObjetRequeteSaisieCompteEnfant,
);
function _ajouterActif(aElement, aJSON) {
	aJSON.Actif = aElement.Actif;
}
