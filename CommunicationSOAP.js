exports.CommunicationSOAP = exports.EGenreEvenementCommunicationSOAP = void 0;
const Callback_1 = require("Callback");
const Invocateur_1 = require("Invocateur");
const NoeudSOAPTerminal_1 = require("NoeudSOAPTerminal");
const RequeteAjax_1 = require("RequeteAjax");
var EGenreEvenementCommunicationSOAP;
(function (EGenreEvenementCommunicationSOAP) {
	EGenreEvenementCommunicationSOAP[
		(EGenreEvenementCommunicationSOAP["SurEmissionRequeteSOAP"] = 1)
	] = "SurEmissionRequeteSOAP";
	EGenreEvenementCommunicationSOAP[
		(EGenreEvenementCommunicationSOAP["SurReponseRequeteSOAP"] = 2)
	] = "SurReponseRequeteSOAP";
	EGenreEvenementCommunicationSOAP[
		(EGenreEvenementCommunicationSOAP["SurEmissionUploadFichier"] = 3)
	] = "SurEmissionUploadFichier";
	EGenreEvenementCommunicationSOAP[
		(EGenreEvenementCommunicationSOAP["SurReponseUploadFichier"] = 4)
	] = "SurReponseUploadFichier";
})(
	EGenreEvenementCommunicationSOAP ||
		(exports.EGenreEvenementCommunicationSOAP =
			EGenreEvenementCommunicationSOAP =
				{}),
);
class CommunicationSOAP {
	constructor(aPere, aEvenement) {
		this.numeroRequete = 0;
		this.numeroRequeteCourante = 0;
		this.nombreRequetes = 50;
		this.bufferRequetes = new Array(this.nombreRequetes);
		this.Pere = aPere;
		this.Evenement = aEvenement;
		this.Nom = "";
	}
	getNom() {
		return this.Nom;
	}
	setNom(aNom) {
		this.Nom = aNom;
	}
	getNumeroRequeteSuivant(aNumeroRequete) {
		return (aNumeroRequete + 1) % this.nombreRequetes;
	}
	envoieRequeteSuivante() {
		this.envoieRequete(
			this.getNumeroRequeteSuivant(this.numeroRequeteCourante),
		);
	}
	activerSOAP(aWebServices) {
		this.webServices = aWebServices;
	}
	appelSOAP(aAppelDistant, aCallback, aMessage) {
		try {
			const lNumeroRequete = this.numeroRequete;
			this.numeroRequete = this.getNumeroRequeteSuivant(this.numeroRequete);
			this.bufferRequetes[this.numeroRequete] = null;
			this.bufferRequetes[lNumeroRequete] = new RequeteSOAP(
				aAppelDistant,
				new Callback_1.Callback(this, this.callbackSOAP, lNumeroRequete),
				aCallback,
			);
			this.envoieRequete(lNumeroRequete, aMessage);
		} catch (e) {
			if (aAppelDistant.getExceptionsNonJournalisables()) {
				e.nonJournalisable = true;
			}
			throw e;
		}
	}
	callbackSOAP(aNumeroRequete, aDonneesReponse) {
		this.Evenement.call(
			this.Pere,
			EGenreEvenementCommunicationSOAP.SurReponseRequeteSOAP,
		);
		this.bufferRequetes[aNumeroRequete].declencherCallback(aDonneesReponse);
		this.envoieRequeteSuivante();
	}
	envoieRequete(aNumeroRequete, aMessage) {
		if (
			this.bufferRequetes[aNumeroRequete] &&
			(this.bufferRequetes[this.numeroRequeteCourante] === null ||
				this.bufferRequetes[this.numeroRequeteCourante] === undefined ||
				!this.bufferRequetes[this.numeroRequeteCourante].estEnAttente())
		) {
			this.Evenement.call(
				this.Pere,
				EGenreEvenementCommunicationSOAP.SurEmissionRequeteSOAP,
				aMessage,
			);
			this.numeroRequeteCourante = aNumeroRequete;
			this.bufferRequetes[aNumeroRequete].envoieRequete();
		}
	}
}
exports.CommunicationSOAP = CommunicationSOAP;
class RequeteSOAP {
	constructor(aDescriptionRequete, aCallbackCommunication, aCallbackMetier) {
		this.callbackCommunication = aCallbackCommunication;
		this.callbackMetier = aCallbackMetier;
		this.terminalSOAP = new NoeudSOAPTerminal_1.NoeudSOAPTerminal(
			"http://localhost",
			aDescriptionRequete,
			this.callbackCommunication,
		);
		const lMessageSOAPAEmettre =
			this.terminalSOAP.traiterMessage(aDescriptionRequete);
		this.requeteAjax = new RequeteAjax_1.RequeteAjax(
			true,
			true,
			true,
			RequeteAjax_1.EGenreRequete.SOAP,
			aDescriptionRequete,
			aDescriptionRequete.getUrl(),
			new Callback_1.Callback(
				this.terminalSOAP,
				this.terminalSOAP.methodeCallback,
			),
			lMessageSOAPAEmettre,
		);
	}
	estEnAttente() {
		return this.enAttente;
	}
	envoieRequete() {
		this.enAttente = true;
		this.requeteAjax.envoyerRequete();
	}
	declencherCallback(aDonneesReponse) {
		this.callbackMetier.appel(aDonneesReponse);
		this.enAttente = false;
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.refreshIEHtml,
		);
	}
}
