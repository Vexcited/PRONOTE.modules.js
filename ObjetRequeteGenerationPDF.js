exports.ObjetRequeteGenerationPDF = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
class ObjetRequeteGenerationPDF extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
	constructor(...aParams) {
		super(...aParams);
	}
	lancerRequete(aParametres, aOptionsPDF, aOptionsCloudCible) {
		this.JSON = { options: {} };
		$.extend(this.JSON, aParametres);
		$.extend(this.JSON, { cloudcible: aOptionsCloudCible });
		$.extend(this.JSON.options, aOptionsPDF);
		return this.appelAsynchrone();
	}
	actionApresRequete() {
		if (this.JSONReponse.OAuth2) {
			this.callbackEchec.appel(this.JSONReponse);
		} else {
			this.callbackReussite.appel(this.JSONReponse);
		}
	}
}
exports.ObjetRequeteGenerationPDF = ObjetRequeteGenerationPDF;
CollectionRequetes_1.Requetes.inscrire(
	"GenerationPDF",
	ObjetRequeteGenerationPDF,
);
