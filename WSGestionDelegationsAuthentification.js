exports.WS_GestionDelegationsAuthentification =
	exports.ParametreTAffectationEspace =
	exports.ParametreTAffectationModeDeLogin =
	exports.ParametreTDescriptionDelegations =
	exports.ParametreTDescriptionParametresDelegation =
	exports.TAffectationEspace =
	exports.TAffectationModeDeLogin =
	exports.TDescriptionDelegations =
	exports.TDescriptionParametresDelegation =
	exports.ETypeDelegationAuthentificationSvcW =
	exports.ETypeModeDeLoginSvcW =
		void 0;
const WSParametreAppel = require("WS_ParametreAppel");
var ETypeModeDeLoginSvcW;
(function (ETypeModeDeLoginSvcW) {
	ETypeModeDeLoginSvcW["ML_Administratif"] = "ML_Administratif";
	ETypeModeDeLoginSvcW["ML_Enseignant"] = "ML_Enseignant";
	ETypeModeDeLoginSvcW["ML_VieScolaire"] = "ML_VieScolaire";
})(
	ETypeModeDeLoginSvcW ||
		(exports.ETypeModeDeLoginSvcW = ETypeModeDeLoginSvcW = {}),
);
var ETypeDelegationAuthentificationSvcW;
(function (ETypeDelegationAuthentificationSvcW) {
	ETypeDelegationAuthentificationSvcW["DA_Aucune"] = "DA_Aucune";
	ETypeDelegationAuthentificationSvcW["DA_Cas"] = "DA_Cas";
	ETypeDelegationAuthentificationSvcW["DA_WsFed"] = "DA_WsFed";
	ETypeDelegationAuthentificationSvcW["DA_EduConnect"] = "DA_EduConnect";
	ETypeDelegationAuthentificationSvcW["DA_Saml"] = "DA_Saml";
})(
	ETypeDelegationAuthentificationSvcW ||
		(exports.ETypeDelegationAuthentificationSvcW =
			ETypeDelegationAuthentificationSvcW =
				{}),
);
class TDescriptionParametresDelegation {
	constructor(aIdParametres, aNom, aActif, aModesDeLogin, aEspaces) {
		this.idParametres = aIdParametres;
		this.nom = aNom;
		this.Actif = aActif;
		this.modesDeLogin = aModesDeLogin;
		this.espaces = aEspaces;
	}
	getIdParametres() {
		return this.idParametres;
	}
	setIdParametres(aIdParametres) {
		this.idParametres = aIdParametres;
	}
	getNom() {
		return this.nom;
	}
	setNom(aNom) {
		this.nom = aNom;
	}
	getActif() {
		return this.Actif;
	}
	setActif(aActif) {
		this.Actif = aActif;
	}
	getModesDeLogin() {
		return this.modesDeLogin;
	}
	setModesDeLogin(aModesDeLogin) {
		this.modesDeLogin = aModesDeLogin;
	}
	getEspaces() {
		return this.espaces;
	}
	setEspaces(aEspaces) {
		this.espaces = aEspaces;
	}
	toString() {
		return (
			"[idParametres]" +
			this.idParametres.toString() +
			"\n" +
			"[nom]" +
			this.nom.toString() +
			"\n" +
			"[Actif]" +
			this.Actif.toString() +
			"\n" +
			"[modesDeLogin]" +
			this.modesDeLogin.toString() +
			"\n" +
			"[espaces]" +
			this.espaces.toString() +
			"\n"
		);
	}
}
exports.TDescriptionParametresDelegation = TDescriptionParametresDelegation;
class TDescriptionDelegations {
	constructor(
		aProtocole,
		aModesDeLoginAutorises,
		aEspacesAutorises,
		aMultiInstanceAutorise,
		aParametres,
	) {
		this.protocole = aProtocole;
		this.modesDeLoginAutorises = aModesDeLoginAutorises;
		this.espacesAutorises = aEspacesAutorises;
		this.multiInstanceAutorise = aMultiInstanceAutorise;
		this.parametres = aParametres;
	}
	getProtocole() {
		return this.protocole;
	}
	setProtocole(aProtocole) {
		this.protocole = aProtocole;
	}
	getModesDeLoginAutorises() {
		return this.modesDeLoginAutorises;
	}
	setModesDeLoginAutorises(aModesDeLoginAutorises) {
		this.modesDeLoginAutorises = aModesDeLoginAutorises;
	}
	getEspacesAutorises() {
		return this.espacesAutorises;
	}
	setEspacesAutorises(aEspacesAutorises) {
		this.espacesAutorises = aEspacesAutorises;
	}
	getMultiInstanceAutorise() {
		return this.multiInstanceAutorise;
	}
	setMultiInstanceAutorise(aMultiInstanceAutorise) {
		this.multiInstanceAutorise = aMultiInstanceAutorise;
	}
	getParametres() {
		return this.parametres;
	}
	setParametres(aParametres) {
		this.parametres = aParametres;
	}
	toString() {
		return (
			"[protocole]" +
			this.protocole.toString() +
			"\n" +
			"[modesDeLoginAutorises]" +
			this.modesDeLoginAutorises.toString() +
			"\n" +
			"[espacesAutorises]" +
			this.espacesAutorises.toString() +
			"\n" +
			"[multiInstanceAutorise]" +
			this.multiInstanceAutorise.toString() +
			"\n" +
			"[parametres]" +
			this.parametres.toString() +
			"\n"
		);
	}
}
exports.TDescriptionDelegations = TDescriptionDelegations;
class TAffectationModeDeLogin {
	constructor(aDelegation, aModesDeLogin) {
		this.delegation = aDelegation;
		this.modesDeLogin = aModesDeLogin;
	}
	getDelegation() {
		return this.delegation;
	}
	setDelegation(aDelegation) {
		this.delegation = aDelegation;
	}
	getModesDeLogin() {
		return this.modesDeLogin;
	}
	setModesDeLogin(aModesDeLogin) {
		this.modesDeLogin = aModesDeLogin;
	}
	toString() {
		return (
			"[delegation]" +
			this.delegation.toString() +
			"\n" +
			"[modesDeLogin]" +
			this.modesDeLogin.toString() +
			"\n"
		);
	}
}
exports.TAffectationModeDeLogin = TAffectationModeDeLogin;
class TAffectationEspace {
	constructor(aDelegation, aEspaces) {
		this.delegation = aDelegation;
		this.espaces = aEspaces;
	}
	getDelegation() {
		return this.delegation;
	}
	setDelegation(aDelegation) {
		this.delegation = aDelegation;
	}
	getEspaces() {
		return this.espaces;
	}
	setEspaces(aEspaces) {
		this.espaces = aEspaces;
	}
	toString() {
		return (
			"[delegation]" +
			this.delegation.toString() +
			"\n" +
			"[espaces]" +
			this.espaces.toString() +
			"\n"
		);
	}
}
exports.TAffectationEspace = TAffectationEspace;
class ParametreTDescriptionParametresDelegation {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
		this.parametreObject = new WSParametreAppel.ParametreObject([
			new WSParametreAppel.ParametreString("IdParametres", "idParametres"),
			new WSParametreAppel.ParametreString("Nom", "nom"),
			new WSParametreAppel.ParametreBoolean("Actif"),
			new WSParametreAppel.ParametreArray(
				"ModesDeLogin",
				new WSParametreAppel.ParametreString("item"),
				"modesDeLogin",
			),
			new WSParametreAppel.ParametreArray(
				"Espaces",
				new WSParametreAppel.ParametreNumber("item"),
				"espaces",
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
		const lValeur = new TDescriptionParametresDelegation();
		this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
		return lValeur;
	}
}
exports.ParametreTDescriptionParametresDelegation =
	ParametreTDescriptionParametresDelegation;
class ParametreTDescriptionDelegations {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
		this.parametreObject = new WSParametreAppel.ParametreObject([
			new WSParametreAppel.ParametreString("Protocole", "protocole"),
			new WSParametreAppel.ParametreArray(
				"ModesDeLoginAutorises",
				new WSParametreAppel.ParametreString("item"),
				"modesDeLoginAutorises",
			),
			new WSParametreAppel.ParametreArray(
				"EspacesAutorises",
				new WSParametreAppel.ParametreNumber("item"),
				"espacesAutorises",
			),
			new WSParametreAppel.ParametreBoolean(
				"MultiInstanceAutorise",
				"multiInstanceAutorise",
			),
			new WSParametreAppel.ParametreArray(
				"Parametres",
				new ParametreTDescriptionParametresDelegation("item"),
				"parametres",
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
		const lValeur = new TDescriptionDelegations();
		this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
		return lValeur;
	}
}
exports.ParametreTDescriptionDelegations = ParametreTDescriptionDelegations;
class ParametreTAffectationModeDeLogin {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
		this.parametreObject = new WSParametreAppel.ParametreObject([
			new WSParametreAppel.ParametreString("Delegation", "delegation"),
			new WSParametreAppel.ParametreArray(
				"ModesDeLogin",
				new WSParametreAppel.ParametreString("item"),
				"modesDeLogin",
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
		const lValeur = new TAffectationModeDeLogin();
		this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
		return lValeur;
	}
}
exports.ParametreTAffectationModeDeLogin = ParametreTAffectationModeDeLogin;
class ParametreTAffectationEspace {
	constructor(aNom, aNomJs) {
		this.nom = aNom;
		this.nomJs = aNomJs || aNom;
		this.parametreObject = new WSParametreAppel.ParametreObject([
			new WSParametreAppel.ParametreString("Delegation", "delegation"),
			new WSParametreAppel.ParametreArray(
				"Espaces",
				new WSParametreAppel.ParametreNumber("item"),
				"espaces",
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
		const lValeur = new TAffectationEspace();
		this.parametreObject.deserialiserSurPlace(aDocumentXml, aNoeudXml, lValeur);
		return lValeur;
	}
}
exports.ParametreTAffectationEspace = ParametreTAffectationEspace;
class WS_GestionDelegationsAuthentification {
	getDescription() {
		return {
			nom: "PortGestionDelegationsAuthentification",
			url: "GestionDelegationsAuthentification",
			operations: [
				{
					nom: "SetEmpreinteSHA1",
					tabParamIN: [new WSParametreAppel.ParametreString("AEmpreinteSHA1")],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "SetUrlPubliqueModele",
					tabParamIN: [
						new WSParametreAppel.ParametreString("AProtocole"),
						new WSParametreAppel.ParametreString("AUrlPublique"),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "GetInfosListeParametresDelegation",
					tabParamIN: [],
					tabParamOUT: [
						new WSParametreAppel.ParametreArray(
							"return",
							new ParametreTDescriptionDelegations("item"),
						),
					],
					tabParamEXCEPT: [],
				},
				{
					nom: "GetModesDeLogin",
					tabParamIN: [],
					tabParamOUT: [
						new WSParametreAppel.ParametreArray(
							"return",
							new ParametreTAffectationModeDeLogin("item"),
						),
					],
					tabParamEXCEPT: [],
				},
				{
					nom: "SetModesDeLogin",
					tabParamIN: [
						new WSParametreAppel.ParametreArray(
							"AModesDeLogin",
							new ParametreTAffectationModeDeLogin("item"),
						),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "GetEspaces",
					tabParamIN: [],
					tabParamOUT: [
						new WSParametreAppel.ParametreArray(
							"return",
							new ParametreTAffectationEspace("item"),
						),
					],
					tabParamEXCEPT: [],
				},
				{
					nom: "SetEspaces",
					tabParamIN: [
						new WSParametreAppel.ParametreArray(
							"AEspaces",
							new ParametreTAffectationEspace("item"),
						),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "AffecterActif",
					tabParamIN: [
						new WSParametreAppel.ParametreString("AProtocole"),
						new WSParametreAppel.ParametreString("AIdParametres"),
						new WSParametreAppel.ParametreBoolean("AActif"),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "SupprimerParametres",
					tabParamIN: [
						new WSParametreAppel.ParametreString("AProtocole"),
						new WSParametreAppel.ParametreString("AIdParametres"),
					],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
				{
					nom: "GetGereEntityIdForce",
					tabParamIN: [],
					tabParamOUT: [new WSParametreAppel.ParametreBoolean("return")],
					tabParamEXCEPT: [],
				},
				{
					nom: "AppliquerChangementsAChaud",
					tabParamIN: [],
					tabParamOUT: [],
					tabParamEXCEPT: [],
				},
			],
		};
	}
}
exports.WS_GestionDelegationsAuthentification =
	WS_GestionDelegationsAuthentification;
