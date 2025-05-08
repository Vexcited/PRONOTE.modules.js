exports.InterfaceConsoleAdministrationServeurHttp = void 0;
const InterfacePageConsoleAdministration_1 = require("InterfacePageConsoleAdministration");
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
const ObjetStyle_1 = require("ObjetStyle");
const InterfaceEnteteConsoleAdministrationServeurHttp_1 = require("InterfaceEnteteConsoleAdministrationServeurHttp");
const ObjetInterface_1 = require("ObjetInterface");
class InterfaceConsoleAdministrationServeurHttp extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = GApplication;
	}
	construireInstances() {
		this.identEntete = this.add(
			InterfaceEnteteConsoleAdministrationServeurHttp_1.InterfaceEnteteConsoleAdministrationServeurHttp,
			this.evenementEntete,
		);
		this.identPage = this.add(
			InterfacePageConsoleAdministration_1.InterfacePageConsoleAdministration,
			this.evenementPage,
		);
	}
	setParametresGeneraux() {
		this.AvecCadre = false;
	}
	construireStructureAffichage() {
		const H = [];
		H.push(
			'<table class="Table" style="',
			ObjetStyle_1.GStyle.composeCouleurFond("white"),
			'">',
			this.identEntete >= 0
				? '<tr id="' +
						this.getIdLigne(this.identEntete) +
						'"><td id="' +
						this.getInstance(this.identEntete).getNom() +
						'" style="height:10px;" ></td></tr>'
				: "",
			this.identPage >= 0
				? '<tr id="' +
						this.getIdLigne(this.identPage) +
						'"><td id="' +
						this.getInstance(this.identPage).getNom() +
						'" style="height:100%;" ></td></tr>'
				: "",
			"</table>",
		);
		return H.join("");
	}
	getIdLigne(aIdent) {
		return this.getInstance(aIdent).getNom() + "_";
	}
	setDonnees() {
		const lParam = {
			webService: this.objetApplicationConsoles.WS_adminServeur,
			port: "PortPublicationServeurHttp",
			methode: "GetInfosPublication",
		};
		const lCommunication = this.objetApplicationConsoles.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.objetApplicationConsoles.creerCallbackSOAP(
				this,
				this.callbackSurRecupererInfosPublication,
			),
		);
	}
	callbackSurRecupererInfosPublication(aDonnees) {
		this.objetApplicationConsoles.etatServeurHttp.initialiserPublication(
			aDonnees,
		);
		const lParam = {
			webService: this.objetApplicationConsoles.WS_adminServeur,
			port: "PortEtatServeurHttp",
			methode: "GetInfosEtatServeurHttp",
		};
		const lCommunication = this.objetApplicationConsoles.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.objetApplicationConsoles.creerCallbackSOAP(
				this,
				this.callbackSurRecupererInfosEtat,
			),
		);
	}
	callbackSurRecupererInfosEtat(aDonnees) {
		this.objetApplicationConsoles.etatServeurHttp.initialiserEtat(aDonnees);
		this.initialiser(true);
	}
	evenementEntete() {
		this.setDonnees();
	}
	evenementPage() {
		this.evenementMettreEnService();
	}
	evenementMettreEnService() {
		const lParam = {
			webService: this.objetApplicationConsoles.WS_adminServeur,
			port: "PortPublicationServeurHttp",
			methode: "MettreEnService",
		};
		const lCommunication = this.objetApplicationConsoles.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.objetApplicationConsoles.creerCallbackSOAP(
				this,
				this.callbackSurMettreEnService,
			),
		);
	}
	callbackSurMettreEnService() {
		this.setDonnees();
	}
}
exports.InterfaceConsoleAdministrationServeurHttp =
	InterfaceConsoleAdministrationServeurHttp;
