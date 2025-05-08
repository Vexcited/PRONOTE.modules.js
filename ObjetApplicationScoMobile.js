exports.ObjetApplicationScoMobile = void 0;
require("NamespaceIE.js");
require("DeclarationJQuery.js");
require("DeclarationGeogebra.js");
require("DeclarationCurseurPN.js");
require("ObjetNavigateur.js");
const ObjetApplicationSco_1 = require("ObjetApplicationSco");
require("Parametres.js");
const ObjetEtatUtilisateur_Mobile_1 = require("ObjetEtatUtilisateur_Mobile");
const InterfaceConnexion_Mobile_1 = require("InterfaceConnexion_Mobile");
require("ObjetRequetePresence.js");
const ObjetSmartAppBanner_1 = require("ObjetSmartAppBanner");
const DeferLoadingScript_1 = require("DeferLoadingScript");
const CommunicationProduit_1 = require("CommunicationProduit");
const UtilitaireFinSession_Mobile_1 = require("UtilitaireFinSession_Mobile");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireDeconnexion_1 = require("UtilitaireDeconnexion");
const ObjetRequeteSaisieTokenPush_1 = require("ObjetRequeteSaisieTokenPush");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetTraduction_1 = require("ObjetTraduction");
require("DeclarationTinyInitEspacesDefer.js");
const TypeThemeCouleur_1 = require("TypeThemeCouleur");
global.GInterface = null;
class ObjetApplicationScoMobile extends ObjetApplicationSco_1.ObjetApplicationSco {
	constructor() {
		super();
		this.utilitaireFinSession =
			new UtilitaireFinSession_Mobile_1.UtilitaireFinSession_Mobile();
		this.estAppliMobile = false;
		this.infoAppliMobile = {};
	}
	getEtatUtilisateur() {
		return GEtatUtilisateur;
	}
	getInterfaceMobile() {
		return GInterface;
	}
	static beforeCreateAppPromise(aNomApp) {
		if (navigator.userAgent.search(aNomApp) > -1) {
			return new Promise((aResolve) => {
				setTimeout(() => {
					aResolve();
				}, 100);
			});
		}
		return Promise.resolve();
	}
	initialisation(aParametres) {
		GEtatUtilisateur =
			new ObjetEtatUtilisateur_Mobile_1.ObjetEtatUtilisateur_Mobile(
				aParametres.genreEspace,
			);
		GEtatUtilisateur.premierChargement = true;
		this.setCommunication(
			new CommunicationProduit_1.CommunicationProduit(
				aParametres.genreEspace,
				aParametres.numeroSession,
			),
		);
	}
	async initialisationApresParametres(aParametres) {
		super.initialisationApresParametres(aParametres);
		$("head").append('<meta name="theme-color" content="#21874a">');
		$("head").append(
			'<meta name="msapplication-navbutton-color" content="#21874a">',
		);
		$("head").append(
			'<meta name="apple-mobile-web-app-status-bar-style" content="#21874a">',
		);
		if (!this.estAppliMobile) {
			this.smartAppBanner = new ObjetSmartAppBanner_1.ObjetSmartAppBanner(
				"GApplication.smartAppBanner",
			);
		}
		const lInterface = (GInterface =
			new InterfaceConnexion_Mobile_1.InterfaceConnexion_Mobile(
				"GInterface",
				null,
				null,
				null,
			));
		lInterface.initialiser();
		if (this.acces.estConnexionCAS() || this.acces.estConnexionCookie()) {
			lInterface.traiterEvenementValidation(
				this.acces.utilisateur.identifiant,
				this.acces.utilisateur.password,
				true,
			);
		} else if (
			!this.getDemo() &&
			GEtatUtilisateur.GenreEspace !== Enumere_Espace_1.EGenreEspace.Commun &&
			this.optionsDebug &&
			this.optionsDebug.identificationAuto &&
			this.optionsDebug.getLogin() &&
			this.optionsDebug.getMdp()
		) {
			lInterface.traiterEvenementValidation(
				this.optionsDebug.getLogin(),
				this.optionsDebug.getMdp(),
			);
		}
		await DeferLoadingScript_1.deferLoadingScript.loadAsync(["defer"], {
			eventIO: false,
		});
		this._finLoadingScript();
	}
	afficherEspaceApresAuthentification(aParametres) {
		if (this._scriptsCharges) {
			this._afficherEspaceApresAuthentification(aParametres);
		} else {
			this._authentification = aParametres;
			if (!DeferLoadingScript_1.deferLoadingScript.afficherPatience()) {
				this._afficherEspaceApresAuthentification(aParametres);
			}
		}
	}
	construireEnTetePageFinSession() {
		return this.utilitaireFinSession._construireEnTetePageFinSession({
			nomEspace: GParametres.getNomEspace(),
			nomEtablissement: "",
		});
	}
	construirePageFinSession(aParametres) {
		this.utilitaireFinSession._construirePageFinSession.call(this, aParametres);
	}
	postToken(aPlatform, aUuid, aToken, aSuppr) {
		const lSuppr = aSuppr || false;
		new ObjetRequeteSaisieTokenPush_1.ObjetRequeteSaisieTokenPush(
			this,
		).lancerRequete({
			platform: aPlatform,
			uuid: aUuid,
			token: aToken,
			suppr: lSuppr,
		});
	}
	initApp(aParams) {
		this.estAppliMobile = aParams.estAppliMobile;
		this.profilsApp = aParams.profils;
		this.infoAppliMobile = { avecExitApp: aParams.avecExitApp };
		if (this.smartAppBanner) {
			$("#" + this.smartAppBanner.id.escapeJQ()).remove();
		}
		if (aParams.darkMode) {
			const lModeSombreActive =
				aParams.darkMode === "sombre" ||
				(aParams.darkMode === "systeme" && aParams.darkModeSysteme === true);
			this.getOptionsEspaceLocal().setChoixDarkMode(
				lModeSombreActive
					? TypeThemeCouleur_1.ChoixDarkMode.sombre
					: TypeThemeCouleur_1.ChoixDarkMode.clair,
			);
		}
		GInterface.traiterEvenementValidation(
			aParams.login,
			aParams.mdp,
			null,
			aParams.uuid,
		);
	}
	async _afficherEspaceApresAuthentification(aParametres) {
		try {
			if (GInterface && GInterface.free) {
				GInterface.free();
			}
			const { ObjetInterfaceMobile } = await Promise.resolve().then(() =>
				require("InterfaceMobile"),
			);
			GInterface = new ObjetInterfaceMobile("GInterface", null, null, null);
			this.getInterfaceMobile().initialiser();
			this.getInterfaceMobile().setDonnees();
			this.getCommunication().activerPresence();
			if (this.avecGestionModeExclusif()) {
				if (this.getModeExclusif()) {
					this.entreeModeExclusif();
				}
			}
			if (
				!this.estAppliMobile &&
				(this.acces.estConnexionCAS() || this.acces.estConnexionCookie()) &&
				this.smartAppBanner
			) {
				this.smartAppBanner.show();
			}
		} catch (e) {
			if (window.messageErreur) {
				window.messageErreur("apresAuthentification/" + e);
			}
			UtilitaireDeconnexion_1.UtilitaireDeconnexion.deconnexionEchecChargement();
		}
		if (aParametres.message) {
			this.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: aParametres.message,
			});
		}
	}
	_finLoadingScript() {
		this._scriptsCharges = true;
		if (this._authentification) {
			this._afficherEspaceApresAuthentification(this._authentification);
		}
		if (global._finLoadingScriptAppliMobile) {
			if (!global.GTraductions) {
				global.GTraductions = ObjetTraduction_1.GTraductions;
			}
			global._finLoadingScriptAppliMobile();
		}
	}
}
exports.ObjetApplicationScoMobile = ObjetApplicationScoMobile;
