exports.ObjetRequeteAppreciationsBulletinParEleve = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteAppreciationsBulletinParEleve extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	lancerRequete(aParam) {
		Object.assign(this.JSON, {}, aParam);
		this.JSON.listePeriodes.setSerialisateurJSON({
			methodeSerialisation: function (aElement, aJSON) {
				if (aElement.visible) {
					aJSON.periode = aElement.periode;
				}
			},
			ignorerEtatsElements: true,
		});
		this.JSON.listeCategories.setSerialisateurJSON({
			methodeSerialisation: function (aElement, aJSON) {
				aJSON = aElement;
				aJSON.coche = aElement.coche;
			},
		});
		return this.appelAsynchrone();
	}
}
exports.ObjetRequeteAppreciationsBulletinParEleve =
	ObjetRequeteAppreciationsBulletinParEleve;
CollectionRequetes_1.Requetes.inscrire(
	"PageAppreciationsBulletinParEleve",
	ObjetRequeteAppreciationsBulletinParEleve,
);
