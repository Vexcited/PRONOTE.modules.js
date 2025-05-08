exports.ObjetApplicationConsoleServeurHttpSco = void 0;
require("NamespaceIE.js");
const ObjetApplicationConsoles_1 = require("ObjetApplicationConsoles");
const MessagesEvenements_ConsoleServeurHTTP_1 = require("MessagesEvenements_ConsoleServeurHTTP");
const GestionnaireEvenements_ConsoleAdminServeurHTTP_1 = require("GestionnaireEvenements_ConsoleAdminServeurHTTP");
const EtatServeurHttp_1 = require("EtatServeurHttp");
const Callback_ConsoleAdministration_1 = require("Callback_ConsoleAdministration");
const Enumere_Onglet_Console_NET_1 = require("Enumere_Onglet_Console_NET");
const InterfaceConsoleAdministrationServeurHttp_1 = require("InterfaceConsoleAdministrationServeurHttp");
const Description_ServicesWeb_ServeurHttpPN_1 = require("Description_ServicesWeb_ServeurHttpPN");
const InterfacePagePublication_1 = require("InterfacePagePublication");
const InterfacePageEnt_1 = require("InterfacePageEnt");
const InterfaceParametrageWsFedSco_1 = require("InterfaceParametrageWsFedSco");
const InterfacePageSecurite_1 = require("InterfacePageSecurite");
class ObjetApplicationConsoleServeurHttpSco extends ObjetApplicationConsoles_1.ObjetApplicationConsoles {
	constructor() {
		super();
	}
	start(aParams) {
		this.msgEvnts =
			new MessagesEvenements_ConsoleServeurHTTP_1.MessagesEvenements_ConsoleAdministration_ServeurHTTP();
		this.gestionEvnts =
			new GestionnaireEvenements_ConsoleAdminServeurHTTP_1.GestionnaireEvenements_ConsoleAdmin_ServeurHTTP();
		this.etatServeurHttp = new EtatServeurHttp_1.EtatServeurHttp();
		this.descriptionWS =
			new Description_ServicesWeb_ServeurHttpPN_1.Description_ServicesWeb_ServeurHttpPN(
				this.getParametresDescriptionWS(),
			);
		const lPositionDeGenreOnglet = [0, 1, 2, 3];
		this.etatConsole = {
			selectionCourante: {
				genre:
					Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication,
				position:
					lPositionDeGenreOnglet[
						Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication
					],
			},
		};
		this.IHM =
			new InterfaceConsoleAdministrationServeurHttp_1.InterfaceConsoleAdministrationServeurHttp(
				"GApplication.IHM",
			);
		super.start(aParams);
		GApplication.IHM.setDonnees();
	}
	initialiserObjetsGraphique() {}
	initialiserObjetsPage() {
		this.ajouterObjetGraphique(
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.publication,
			InterfacePagePublication_1.InterfacePagePublication,
		);
		this.ajouterObjetGraphique(
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.ent,
			InterfacePageEnt_1.InterfacePageEnt,
		);
		this.ajouterObjetGraphique(
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET
				.authentificationWsFed,
			InterfaceParametrageWsFedSco_1.InterfaceParametrageWsFedSco,
		);
		this.ajouterObjetGraphique(
			Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.securite,
			InterfacePageSecurite_1.InterfacePageSecurite,
		);
	}
	creerCallbackSOAP(aPere, aEvenement, aEvenementSurException, aIdentifiant) {
		return new Callback_ConsoleAdministration_1.Callback_ConsoleAdministration(
			aPere,
			aEvenement,
			aEvenementSurException,
			aIdentifiant,
		);
	}
}
exports.ObjetApplicationConsoleServeurHttpSco =
	ObjetApplicationConsoleServeurHttpSco;
