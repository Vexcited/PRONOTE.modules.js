const ObjetApplicationConsoleServeurHttpSco_1 = require("ObjetApplicationConsoleServeurHttpSco");
require("DeclarationImageEspacesHebergementPN.js");
const AccessApp_1 = require("AccessApp");
const InterfacePagePublication_1 = require("InterfacePagePublication");
const GlossaireEspacesConsoleServeurHttpPN_1 = require("GlossaireEspacesConsoleServeurHttpPN");
class ObjetApplicationConsoleServeurHTTPPN extends ObjetApplicationConsoleServeurHttpSco_1.ObjetApplicationConsoleServeurHttpSco {
	constructor() {
		super();
		this.avecEduConnect = true;
		InterfacePagePublication_1.TraductionsNomsEspaceConsoleHttpCP.setTraductions(
			GlossaireEspacesConsoleServeurHttpPN_1.TradGlossaireEspacesConsoleServeurHttpPN,
		);
	}
	getParametresDescriptionWS() {
		return {
			nom: "SvcAdminServeurHttp",
			espaceNommage:
				"http://www.indexeducation.com/frahtm/SvcAdminServeurHttp.html",
			prefixeSoapAction: "urn:SvcAdminServeurHttp",
		};
	}
}
global.Main = function (aParam) {
	(0, AccessApp_1.setApp)(new ObjetApplicationConsoleServeurHTTPPN());
	(0, AccessApp_1.getApp)().start(aParam);
};
