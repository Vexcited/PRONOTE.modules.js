exports.InterfacePageSecurite = void 0;
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_Statut_1 = require("Enumere_Statut");
const Evenement_1 = require("Evenement");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Onglet_Console_NET_1 = require("Enumere_Onglet_Console_NET");
require("IEHtml.BoutonHebergement.js");
const ObjetComposeHtml_1 = require("ObjetComposeHtml");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfacePageSecurite extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.appConsole = GApplication;
		this.messagesEvenements = this.appConsole.msgEvnts.getMessagesUnite(
			"InterfacePageSecurite.js",
		);
		this.choixDureeExpiration = [5];
		for (let i = 1; i < 9; i++) {
			this.choixDureeExpiration.push(15 * i);
		}
		this.donneesRecues = false;
		this.recupererDonneesPage();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnViserBlackList: {
				event() {
					aInstance.evenementBoutonViderBlackList();
				},
				getCssImage() {
					return "Image_Cmd_viderBlackList";
				},
			},
		});
	}
	recupererDonneesPage() {
		const lParam = {
			webService: this.appConsole.WS_adminServeur,
			port: "PortGestionSecurite",
			methode: "GetInfosSecurite",
		};
		const lCommunication = this.appConsole.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.appConsole.creerCallbackSOAP(this, this.callbackSurGetInfosSecurite),
		);
	}
	callbackSurGetInfosSecurite(aRetour) {
		try {
			this.setParametresSecurite(aRetour);
			this.donneesRecues = true;
			this.initialiser(true);
		} catch (e) {
			const lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.appConsole.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"callbackSurGetInfosSecurite",
					lMessage,
				),
			);
		}
	}
	setParametresSecurite(aDonnees) {
		let lMessage;
		try {
			this.gestionSecurite = aDonnees.getElement("return").valeur;
		} catch (e) {
			lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.appConsole.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"setParametresSecurite",
					lMessage,
				),
			);
		}
	}
	evenementBoutonViderBlackList() {
		const lParam = {
			webService: this.appConsole.WS_adminServeur,
			port: "PortGestionSecurite",
			methode: "EffacerBlackListSessionHttp",
		};
		const lCommunication = this.appConsole.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.appConsole.creerCallbackSOAP(this, this.callbackSurViderBlackList),
		);
	}
	callbackSurViderBlackList() {}
	construireStructureAffichage() {
		const H = [];
		const llabelExplicatif =
			this.appConsole.etatServeurHttp.getEtatActif() === true
				? ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresSecurite.labelArreterPublicationPourModifierParametres",
					)
				: "";
		if (this.donneesRecues) {
			H.push(
				'<table class="Texte10 Espace FondBlanc full-width">',
				llabelExplicatif
					? '<tr><td class="Gras EspaceBas AlignementMilieu">' +
							llabelExplicatif +
							"</td></tr>"
					: "",
				"<tr><td>",
			);
			H.push(
				"<tr><td>",
				ObjetComposeHtml_1.ObjetComposeHtml.bandeauConsole(
					ObjetTraduction_1.GTraductions.getValeur(
						"pageConsoleAdministration.onglets",
					)[Enumere_Onglet_Console_NET_1.EGenreOnglet_Console_NET.securite],
				),
				"</td></tr>",
			);
			H.push(
				'<table class="Texte10 full-width">',
				"<tr><td>",
				this.composeDureeExpirationSession(),
				"</td></tr>",
				"<tr><td>",
				this.composeSuspendreIP(),
				"</td></tr>",
				"</table>",
			);
			H.push("</td></tr>", "</table>");
		}
		return H.join("");
	}
	composeDureeExpirationSession() {
		const H = [];
		H.push(
			'<fieldset class="Espace AlignementGauche Texte10" style="border:1px solid ',
			GCouleur.intermediaire,
			';">',
		);
		H.push('<legend class="Gras Espace" style="color:', GCouleur.texte, ';">');
		H.push(
			"<label>",
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametresSecurite.deconnexionAutomatiqueTitre",
			),
			"</label>",
		);
		H.push("</legend>");
		H.push('<table class="Texte10">');
		H.push("<tr>");
		H.push(
			' <td class="Espace" style="width:10px;">',
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresSecurite.deconnexionAutomatique1",
				),
			),
			"</td>",
		);
		H.push(
			' <td style="width:10px">',
			this.composeComboDureeExpirationSession(),
			"</td>",
		);
		H.push(
			' <td class="Espace" style="width:100%;">',
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresSecurite.deconnexionAutomatique2",
				),
			),
			"</td>",
		);
		H.push("</tr>");
		H.push("</table>");
		H.push("<br>");
		H.push("</fieldset>");
		return H.join("");
	}
	composeComboDureeExpirationSession() {
		const H = [];
		const lActif =
			this.appConsole.etatServeurHttp.getEtatActif() === true ? "disabled" : "";
		H.push(
			'<select style="width:100px;" id="' +
				this.Nom +
				'_comboDureeExpirationSession" class="Texte10" onchange="',
			this.Nom,
			'.surOnChangeComboDureeExpirationSession()" ' + lActif + ">",
		);
		this.choixDureeExpiration.forEach((aVal) => {
			const lOptionSelected =
				aVal === this.gestionSecurite.dureeExpirationSession ? "selected" : "";
			H.push(
				"<option " + lOptionSelected + ">",
				aVal +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresSecurite.minutes",
					),
				"</option>",
			);
		});
		H.push("</select>");
		return H.join("");
	}
	surOnChangeComboDureeExpirationSession() {
		const lDureeExpirationSession =
			this.choixDureeExpiration[
				ObjetHtml_1.GHtml.getElement(this.Nom + "_comboDureeExpirationSession")
					.selectedIndex
			];
		const lParam = {
			webService: this.appConsole.WS_adminServeur,
			port: "PortGestionSecurite",
			methode: "SetDureeExpirationSession",
		};
		const lCommunication = this.appConsole.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lAppelDistant
			.getParametres()
			.getElement("ADureeExpirationSession")
			.setValeur(lDureeExpirationSession);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.appConsole.creerCallbackSOAP(
				this,
				this.callbackSurOnChangeDureeExpirationSession.bind(
					this,
					lDureeExpirationSession,
				),
			),
		);
	}
	callbackSurOnChangeDureeExpirationSession(aDureeExpirationSession) {
		try {
			this.gestionSecurite.dureeExpirationSession = aDureeExpirationSession;
		} catch (e) {
			const lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.appConsole.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"callbackSurOnChangeDureeExpirationSession",
					lMessage,
				),
			);
		}
	}
	composeSuspendreIP() {
		const H = [];
		H.push(
			'<fieldset class="Espace AlignementGauche Texte10" style="border:1px solid ',
			GCouleur.intermediaire,
			';">',
		);
		H.push('<legend class="Gras Espace" style="color:', GCouleur.texte, ';">');
		H.push(
			"<label>",
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametresSecurite.suspendreIP",
			),
			"</label>",
		);
		H.push("</legend>");
		H.push('<table class="Texte10">');
		H.push("<tr>");
		H.push(
			' <td class="Espace" style="width:10px;">',
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresSecurite.dureeSuspension",
				),
			),
			"</td>",
		);
		H.push(
			' <td style="width:10px;" class="EspaceDroit">',
			this.composeComboDuree(),
			"</td>",
		);
		H.push(
			' <td class="Espace" style="width:100%;">',
			this.composeViderBlacklist(),
			"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			' <td class="Espace" style="width:10px;">',
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresSecurite.messageNbrTentatives",
				),
			),
			"</td>",
		);
		H.push(
			' <td style="width:10px;" class="EspaceDroit">',
			this.composeComboTentatives(),
			"</td>",
		);
		H.push(' <td class="Espace" style="width:100%;">&nbsp;</td>');
		H.push("</tr>");
		H.push(
			'<tr><td class="Espace" colspan="3">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametresSecurite.messageSuspendreIP1",
			),
			"</td></tr>",
		);
		H.push("</table>");
		H.push("<br>");
		H.push("</fieldset>");
		return H.join("");
	}
	_indexComboToNbrTentatives(aIndice) {
		return aIndice + 2;
	}
	composeComboTentatives() {
		const H = [];
		const lActif =
			this.appConsole.etatServeurHttp.getEtatActif() === true ? "disabled" : "";
		H.push(
			'<select style="width:100px;" id="' +
				this.Nom +
				'_comboNbrTentatives" class="Texte10" onchange="',
			this.Nom,
			'.surOnChangeComboTentatives()" ' + lActif + ">",
		);
		for (let I = 0; I < 7; I++) {
			const lNbrTentatives = this._indexComboToNbrTentatives(I);
			const lOptionSelected =
				lNbrTentatives === this.gestionSecurite.nbrTentatives ? "selected" : "";
			H.push(
				"<option " + lOptionSelected + ">",
				lNbrTentatives +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresSecurite.tentatives",
					),
				"</option>",
			);
		}
		H.push("</select>");
		return H.join("");
	}
	surOnChangeComboTentatives() {
		const lNbrTentatives = this._indexComboToNbrTentatives(
			ObjetHtml_1.GHtml.getElement(this.Nom + "_comboNbrTentatives")
				.selectedIndex,
		);
		const lParam = {
			webService: this.appConsole.WS_adminServeur,
			port: "PortGestionSecurite",
			methode: "SetNbrTentativesAvantBlacklist",
		};
		const lCommunication = this.appConsole.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lAppelDistant
			.getParametres()
			.getElement("ANbrTentatives")
			.setValeur(lNbrTentatives);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.appConsole.creerCallbackSOAP(
				this,
				this.callbackSurOnChangeComboTentatives.bind(this, lNbrTentatives),
			),
		);
	}
	callbackSurOnChangeComboTentatives(aNbrTentatives) {
		try {
			this.gestionSecurite.nbrTentatives = aNbrTentatives;
		} catch (e) {
			const lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.appConsole.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"callbackSurOnChangeComboTentatives",
					lMessage,
				),
			);
		}
	}
	composeComboDuree() {
		const H = [];
		const lActif =
			this.appConsole.etatServeurHttp.getEtatActif() === true ? "disabled" : "";
		H.push(
			'<select style="width:100px;" id="' +
				this.Nom +
				'_comboDuree" class="Texte10" onchange="',
			this.Nom,
			'.surOnChangeComboDuree()" ' + lActif + ">",
		);
		for (const I in ObjetTraduction_1.GTraductions.getTabValeurs(
			"pageParametresSecurite.durees",
		)) {
			const lOptionSelected =
				parseInt(I) === this.gestionSecurite.dureeQuarantaine ? "selected" : "";
			H.push(
				"<option " + lOptionSelected + ">",
				ObjetTraduction_1.GTraductions.getTabValeurs(
					"pageParametresSecurite.durees",
				)[I],
				"</option>",
			);
		}
		H.push("</select>");
		return H.join("");
	}
	surOnChangeComboDuree() {
		const lDureeQuarantaine = ObjetHtml_1.GHtml.getElement(
			this.Nom + "_comboDuree",
		).selectedIndex;
		const lParam = {
			webService: this.appConsole.WS_adminServeur,
			port: "PortGestionSecurite",
			methode: "SetDureeQuarantaineIPSuspecte",
		};
		const lCommunication = this.appConsole.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lAppelDistant
			.getParametres()
			.getElement("ADuree")
			.setValeur(lDureeQuarantaine);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.appConsole.creerCallbackSOAP(
				this,
				this.callbackSurOnChangeComboDuree.bind(this, lDureeQuarantaine),
			),
		);
	}
	callbackSurOnChangeComboDuree(aDureeQuarantaine) {
		try {
			this.gestionSecurite.dureeQuarantaine = aDureeQuarantaine;
		} catch (e) {
			const lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.appConsole.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"callbackSurOnChangeComboDuree",
					lMessage,
				),
			);
		}
	}
	composeViderBlacklist() {
		const H = [];
		H.push('<table class="Texte10" style="width:100%;">');
		H.push("<tr>");
		H.push(
			'<ie-boutonhebergement ie-model="btnViserBlackList" style="width:230px;" title="',
			ObjetTraduction_1.GTraductions.getValeur("principal.btnDeploquerIPs"),
			'">',
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur("principal.btnDeploquerIPs"),
			),
			"</ie-boutonhebergement>",
		);
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
}
exports.InterfacePageSecurite = InterfacePageSecurite;
