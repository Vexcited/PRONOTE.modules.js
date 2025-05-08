exports.WS_GestionSecurite =
	exports.ParametreTInfosGestionSecurite =
	exports.TInfosGestionSecurite =
		void 0;
const WSParametreAppel = require("WS_ParametreAppel");
class TInfosGestionSecurite {
	constructor(
		aDureeExpirationSession,
		aNbrTentativesAvantBlacklist,
		aDureeQuarantaine,
		aQuarantaineIPSuspecte,
		aListeIPAdressesPrivilegiees,
	) {
		this.dureeExpirationSession = aDureeExpirationSession;
		this.nbrTentatives = aNbrTentativesAvantBlacklist;
		this.dureeQuarantaine = aDureeQuarantaine;
		this.quarantaineIPSuspecte = aQuarantaineIPSuspecte;
		this.listeIPAdressesPrivilegiees = aListeIPAdressesPrivilegiees;
	}
	getDureeExpirationSession() {
		return this.dureeExpirationSession;
	}
	setDureeExpirationSession(aDureeExpirationSession) {
		this.dureeExpirationSession = aDureeExpirationSession;
	}
	getNbrTentatives() {
		return this.nbrTentatives;
	}
	setNbrTentatives(aNbrTentatives) {
		this.nbrTentatives = aNbrTentatives;
	}
	getDureeQuarantaine() {
		return this.dureeQuarantaine;
	}
	setDureeQuarantaine(aDureeQuarantaine) {
		this.dureeQuarantaine = aDureeQuarantaine;
	}
	getQuarantaineIPSuspecte() {
		return this.quarantaineIPSuspecte;
	}
	setQuarantaineIPSuspecte(aQuarantaineIPSuspecte) {
		this.quarantaineIPSuspecte = aQuarantaineIPSuspecte;
	}
	getListeIPAdressesPrivilegiees() {
		return this.listeIPAdressesPrivilegiees;
	}
	setListeIPAdressesPrivilegiees(aListeIPAdressesPrivilegiees) {
		this.listeIPAdressesPrivilegiees = aListeIPAdressesPrivilegiees;
	}
	toString() {
		return (
			"[dureeExpirationSession]" +
			this.dureeExpirationSession.toString() +
			"\n" +
			"[nbrTentatives]" +
			this.nbrTentatives.toString() +
			"\n" +
			"[dureeQuarantaine]" +
			this.dureeQuarantaine.toString() +
			"\n" +
			"[quarantaineIPSuspecte]" +
			this.quarantaineIPSuspecte.toString() +
			"\n" +
			"[listeIPAdressesPrivilegiees]" +
			this.listeIPAdressesPrivilegiees.toString() +
			"\n"
		);
	}
}
exports.TInfosGestionSecurite = TInfosGestionSecurite;
class ParametreTInfosGestionSecurite {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
		this.parametreObject = new WSParametreAppel.ParametreObject([
			new WSParametreAppel.ParametreNumber(
				"DureeExpirationSession",
				"dureeExpirationSession",
			),
			new WSParametreAppel.ParametreNumber(
				"NbrTentativesAvantBlacklist",
				"nbrTentatives",
			),
			new WSParametreAppel.ParametreNumber(
				"DureeQuarantaine",
				"dureeQuarantaine",
			),
			new WSParametreAppel.ParametreBoolean(
				"QuarantaineIPSuspecte",
				"quarantaineIPSuspecte",
			),
			new WSParametreAppel.ParametreArray(
				"ListeIPAdressesPrivilegiees",
				new WSParametreAppel.ParametreString("item"),
				"listeIPAdressesPrivilegiees",
			),
		]);
	}
	getNom() {
		return this.nom;
	}
	getNomJs() {
		return this.nomJs;
	}
	getParametreObject() {
		return this.parametreObject;
	}
	serialiser(aDocumentXml, aNoeudXml, aValeur, aEspaceNommage) {
		this.parametreObject.serialiser(
			aDocumentXml,
			aNoeudXml,
			aValeur,
			aEspaceNommage,
		);
	}
	deserialiser(aDocumentXml, aNoeudXml) {
		const lValeur = new TInfosGestionSecurite();
		this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
		return lValeur;
	}
}
exports.ParametreTInfosGestionSecurite = ParametreTInfosGestionSecurite;
class WS_GestionSecurite {
	getDescription() {
		return {
			nom: "PortGestionSecurite",
			url: "GestionSecurite",
			operations: [
				{
					nom: "SetDureeExpirationSession",
					tabParamIN: [
						new WSParametreAppel.ParametreNumber("ADureeExpirationSession"),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "GetInfosSecurite",
					tabParamIN: [],
					tabParamOUT: [new ParametreTInfosGestionSecurite("return")],
					tabParamEXCEPT: [],
				},
				{
					nom: "SetNbrTentativesAvantBlacklist",
					tabParamIN: [new WSParametreAppel.ParametreNumber("ANbrTentatives")],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "SetDureeQuarantaineIPSuspecte",
					tabParamIN: [new WSParametreAppel.ParametreNumber("ADuree")],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "SetQuarantaineIPSuspecte",
					tabParamIN: [new WSParametreAppel.ParametreBoolean("AQuarantaine")],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "AjouterIPAdressePrivilegiee",
					tabParamIN: [new WSParametreAppel.ParametreString("AIPAdresse")],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "SupprimerIPAdressePrivilegiee",
					tabParamIN: [new WSParametreAppel.ParametreString("AIPAdresse")],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "ModifierIPAdressePrivilegiee",
					tabParamIN: [
						new WSParametreAppel.ParametreString("AIPAdresseOrg"),
						new WSParametreAppel.ParametreString("AIPAdresseModifiee"),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "EffacerBlackListSessionHttp",
					tabParamIN: [],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
			],
		};
	}
}
exports.WS_GestionSecurite = WS_GestionSecurite;
