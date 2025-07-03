exports.AppelMethodeDistante = void 0;
const TableauDElements_1 = require("TableauDElements");
const WS_ParametreAppel_1 = require("WS_ParametreAppel");
class AppelMethodeDistante {
	constructor(aServices, aParam) {
		const lService = aServices.getService(aParam.webService);
		const lPort = lService ? lService.getPort(aParam.port) : null;
		this.operation = lPort ? lPort.getOperation(aParam.methode) : null;
		this.exceptionsNonJournalisables = this.operation
			? this.operation.getExceptionsNonJournalisables()
			: false;
		const lParametres = new TableauDElements_1.TableauDElements();
		if (this.operation) {
			const lNomsParamIn = this.operation.getNomsParamIn();
			for (
				let lIndice = 0, lTaille = lNomsParamIn.length;
				lIndice < lTaille;
				lIndice++
			) {
				lParametres.ajouterElement(
					new WS_ParametreAppel_1.NomEtValeur(lNomsParamIn[lIndice]),
				);
			}
		}
		this.parametres = lParametres;
	}
	getParametres() {
		return this.parametres;
	}
	getExceptionsNonJournalisables() {
		return this.exceptionsNonJournalisables;
	}
	getUrl() {
		return this.operation ? this.operation.getUrlAcces() : "";
	}
	getNomOperation() {
		return this.operation ? this.operation.getNom() : "";
	}
	getEntetesHttp() {
		return this.operation ? this.operation.getEntetesHttp() : null;
	}
	construireEnveloppeSoap() {
		return this.operation
			? this.operation.construireEnveloppeSoap(this.parametres)
			: "";
	}
	lireEnveloppeSoap(aMessageSOAP) {
		return this.operation
			? this.operation.lireEnveloppeSoap(aMessageSOAP)
			: null;
	}
}
exports.AppelMethodeDistante = AppelMethodeDistante;
