exports.WS_Administration_ServeurHttpPN = void 0;
const WS_Administration_1 = require("WS_Administration");
const WSEtatServeurHttp_1 = require("WSEtatServeurHttp");
const WSGestionDelegationsAuthentification_1 = require("WSGestionDelegationsAuthentification");
const WSGestionWsFed_1 = require("WSGestionWsFed");
const WSGestionSaml_1 = require("WSGestionSaml");
const WSGestionCAS_1 = require("WSGestionCAS");
const WSGestionEduConnect_1 = require("WSGestionEduConnect");
const WSGestionSecurite_1 = require("WSGestionSecurite");
const WSPublicationServeurHttp_1 = require("WSPublicationServeurHttp");
const WSClientsHttp_1 = require("WSClientsHttp");
class WS_Administration_ServeurHttpPN extends WS_Administration_1.WS_Administration {
	constructor(aParam) {
		super(aParam);
	}
	ajouterPorts() {
		this.ajouterPortWS(
			new WSPublicationServeurHttp_1.WS_PublicationServeurHttp().getDescription(),
		);
		this.ajouterPortWS(
			new WSEtatServeurHttp_1.WS_EtatServeurHttp().getDescription(),
		);
		this.ajouterPortWS(
			new WSGestionDelegationsAuthentification_1.WS_GestionDelegationsAuthentification().getDescription(),
		);
		this.ajouterPortWS(
			new WSGestionSecurite_1.WS_GestionSecurite().getDescription(),
		);
		this.ajouterPortWS(new WSGestionCAS_1.WS_GestionCAS().getDescription());
		this.ajouterPortWS(new WSGestionWsFed_1.WS_GestionWsFed().getDescription());
		this.ajouterPortWS(
			new WSGestionEduConnect_1.WS_GestionEduConnect().getDescription(),
		);
		this.ajouterPortWS(new WSGestionSaml_1.WS_GestionSaml().getDescription());
		this.ajouterPortWS(new WSClientsHttp_1.WS_ClientsHttp().getDescription());
	}
}
exports.WS_Administration_ServeurHttpPN = WS_Administration_ServeurHttpPN;
