exports.WS_Operation = void 0;
const XMLSoap_1 = require("XMLSoap");
class WS_Operation {
	constructor(aEspaceNommage, aPrefixeSoapAction, aUrlAcces, aVersionSoap) {
		this.nom = "";
		this.espaceNommage = aEspaceNommage;
		this.prefixeSoapAction = aPrefixeSoapAction;
		this.urlAcces = aUrlAcces;
		this.versionSoap = aVersionSoap;
		this.paramInput = null;
		this.paramOutput = null;
		this.tabPrmExceptions = [];
		this.nomsParamIn = [];
		this.exceptionsNonJournalisables = false;
	}
	getEntetesHttp() {
		const lSoapAction = this.prefixeSoapAction + this.nom;
		switch (this.versionSoap) {
			case "1.1": {
				return [
					{ nom: "Content-type", valeur: "application/xml" },
					{ nom: "SOAPAction", valeur: lSoapAction },
				];
			}
			case "1.2": {
				return [
					{
						nom: "Content-type",
						valeur: "application/soap+xml; action=" + lSoapAction,
					},
				];
			}
			default: {
				throw new Error("Version SOAP non supportée.");
			}
		}
	}
	setNom(aNom) {
		this.nom = aNom;
	}
	setParamInput(aParamInput) {
		this.paramInput = aParamInput;
	}
	setParamOutput(aParamOutput) {
		this.paramOutput = aParamOutput;
	}
	setTabPrmExceptions(aTabPrmExceptions) {
		this.tabPrmExceptions = aTabPrmExceptions;
	}
	setExceptionsNonJournalisables(aExceptionsNonJournalisables) {
		this.exceptionsNonJournalisables = aExceptionsNonJournalisables;
	}
	setNomsParamIn(aNomsParamIn) {
		this.nomsParamIn = aNomsParamIn;
	}
	getNom() {
		return this.nom;
	}
	getExceptionsNonJournalisables() {
		return this.exceptionsNonJournalisables;
	}
	getNomsParamIn() {
		return this.nomsParamIn;
	}
	getUrlAcces() {
		return this.urlAcces;
	}
	construireEnveloppeSoap(aParametres) {
		let lEspaceNommageSoap;
		switch (this.versionSoap) {
			case "1.1":
				{
					lEspaceNommageSoap = "http://schemas.xmlsoap.org/soap/envelope/";
				}
				break;
			case "1.2":
				{
					lEspaceNommageSoap = "http://www.w3.org/2003/05/soap-envelope";
				}
				break;
			default: {
				throw new Error("Version SOAP non supportée.");
			}
		}
		const lDocument = (0, XMLSoap_1.ObjetXML_Soap)(
			lEspaceNommageSoap,
			"env:Envelope",
		);
		const lEnveloppe = lDocument.documentElement;
		const lCorps = lDocument.createElement("env:Body");
		lEnveloppe.appendChild(lCorps);
		const lNoeudXml = lDocument.createElementNS(
			this.espaceNommage,
			this.paramInput.getNom(),
		);
		lCorps.appendChild(lNoeudXml);
		this.paramInput.serialiser(
			lDocument,
			lNoeudXml,
			aParametres,
			this.espaceNommage,
		);
		return new XMLSerializer().serializeToString(lDocument);
	}
	lireEnveloppeSoap(aMessageSOAP) {
		const lDocument = (0, XMLSoap_1.ObjetXML_Soap)("", "", aMessageSOAP);
		let lReponses;
		switch (this.versionSoap) {
			case "1.1":
				{
					lReponses = lDocument.evaluate(
						"/env:Envelope/env:Body/*",
						lDocument,
						{ lookupNamespaceURI: ResoluteurNsSoap11PourXPath },
						XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
						null,
					);
				}
				break;
			case "1.2":
				{
					lReponses = lDocument.evaluate(
						"/env:Envelope/env:Body/*",
						lDocument,
						{ lookupNamespaceURI: ResoluteurNsSoap12PourXPath },
						XPathResult.UNORDERED_NODE_ITERATOR_TYPE,
						null,
					);
				}
				break;
			default: {
				throw new Error("Version SOAP non supportée.");
			}
		}
		let lReponse = null;
		let lCandidat = lReponses.iterateNext();
		while (lCandidat) {
			if (lReponse !== null) {
				throw new Error(
					"Il ne doit pas y avoir plusieurs réponses dans l'enveloppe SOAP.",
				);
			}
			lReponse = lCandidat;
			lCandidat = lReponses.iterateNext();
		}
		if (lReponse === null) {
			throw new Error("Enveloppe SOAP incorrecte.");
		}
		const lNomReponse = lReponse.localName;
		if (lNomReponse === "Fault") {
			let lRaison;
			let lDetail;
			switch (this.versionSoap) {
				case "1.1":
					{
						lRaison = lDocument.evaluate(
							"faultstring/text()",
							lReponse,
							null,
							XPathResult.STRING_TYPE,
							null,
						).stringValue;
						lDetail = lDocument.evaluate(
							"detail/*",
							lReponse,
							null,
							XPathResult.FIRST_ORDERED_NODE_TYPE,
							null,
						).singleNodeValue;
					}
					break;
				case "1.2":
					{
						lRaison = lDocument.evaluate(
							"env:Reason/env:Text/text()",
							lReponse,
							{ lookupNamespaceURI: ResoluteurNsSoap12PourXPath },
							XPathResult.STRING_TYPE,
							null,
						).stringValue;
						lDetail = lDocument.evaluate(
							"env:Detail/*",
							lReponse,
							{ lookupNamespaceURI: ResoluteurNsSoap12PourXPath },
							XPathResult.FIRST_ORDERED_NODE_TYPE,
							null,
						).singleNodeValue;
					}
					break;
				default: {
					throw new Error("Version SOAP non supportée.");
				}
			}
			let lParamException = null;
			if (lDetail) {
				const lNomException = lDetail.localName;
				for (
					let lIndice = 0, lTaille = this.tabPrmExceptions.length;
					lIndice < lTaille;
					lIndice++
				) {
					const lPrmException = this.tabPrmExceptions[lIndice];
					if (lPrmException.nom === lNomException) {
						lParamException = lPrmException;
						break;
					}
				}
			}
			let lException;
			if (lParamException === null) {
				lException = new Error(lRaison);
			} else {
				lException = lParamException.deserialiser(lDocument, lDetail, lRaison);
			}
			throw lException;
		} else {
			if (lNomReponse !== this.paramOutput.getNom()) {
				throw new Error("Élément inattendu " + lNomReponse);
			}
			return this.paramOutput.deserialiser(lDocument, lReponse);
		}
	}
}
exports.WS_Operation = WS_Operation;
function ResoluteurNsSoap11PourXPath(aPrefixeNs) {
	switch (aPrefixeNs) {
		case "env": {
			return "http://schemas.xmlsoap.org/soap/envelope/";
		}
		case "": {
			return "";
		}
		default: {
			throw new Error("Préfixe d'espace de nommage inconnu.");
		}
	}
}
function ResoluteurNsSoap12PourXPath(aPrefixeNs) {
	switch (aPrefixeNs) {
		case "env": {
			return "http://www.w3.org/2003/05/soap-envelope";
		}
		case "": {
			return "";
		}
		default: {
			throw new Error("Préfixe d'espace de nommage inconnu.");
		}
	}
}
