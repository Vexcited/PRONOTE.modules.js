exports.InterfaceParametrageSaml = void 0;
require("IEHtml.MrFiche.js");
const AppelSOAP_1 = require("AppelSOAP");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionSaml_1 = require("WSGestionSaml");
const ObjetFenetre_ParametrageSaml_1 = require("ObjetFenetre_ParametrageSaml");
const AccessApp_1 = require("AccessApp");
class InterfaceParametrageSaml extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
		this.messagesEvenements =
			this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
				"InterfaceParametrageSaml.js",
			);
		this.optionsSaml = {
			avecEspaceInterface: true,
			avecAccesDirectEspaces: true,
			avecAccesInvite: true,
			avecURLPointNet: true,
			avecUrlPubliqueServeur: false,
			avecAuthentificationServeur: false,
			avecMrFicheURLServeur: true,
			avecDownloadConfig: false,
			bloquerSaisieUrl: false,
			largeurLibelleFenetre: 120,
		};
		this.donneesRecues = false;
	}
	init(aParametresSaml, aInfosDelegation) {
		this.parametresSaml = aParametresSaml;
		this.infosDelegation = aInfosDelegation;
		this.recupererParametres();
	}
	estConnecterAuServeur() {
		return false;
	}
	setFenetre(aInstanceFenetre) {
		this.fenetre = aInstanceFenetre;
	}
	estEnService() {
		return false;
	}
	free() {
		super.free();
		clearTimeout(this.timeoutEtatEnCours);
	}
	jsxModelInputNomDelegation() {
		return {
			getValue: () => {
				return this.infosDelegation.nom;
			},
			setValue: (aValue) => {
				this.infosDelegation.nom = aValue;
			},
			getDisabled: () => {
				return this.avecParametresInactifs();
			},
		};
	}
	jsxModelBoutonParametres() {
		return {
			event: () => {
				const lFenetreParametrageSaml =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_ParametrageSaml_1.ObjetFenetre_ParametrageSaml,
						{
							pere: this,
							evenement: (aNumeroBouton, aParametres) => {
								this.evenementSurFenetreParametrage(aParametres);
							},
							initialiser(aInstanceFenetre) {
								aInstanceFenetre.setOptionsFenetresParametragSaml({
									largeurLibelle: this.optionsSaml.largeurLibelleFenetre,
								});
							},
						},
					);
				lFenetreParametrageSaml.setDonnees(this.parametresSaml);
			},
			getDisabled: () => {
				return (
					this.estEnService() ||
					!this.parametresSaml.urlMetadataServeur ||
					this.statutContactServeurSvcW !==
						WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte
				);
			},
		};
	}
	jsxGetStyleTexte() {
		return {
			color: this.avecParametresInactifs()
				? (0, AccessApp_1.getApp)().getCouleur().nonEditable.texte
				: "black",
		};
	}
	jsxModelInputUrl() {
		return {
			getValue: () => {
				return this.parametresSaml.urlMetadataServeur;
			},
			setValue: (aValue) => {
				this.parametresSaml.urlMetadataServeur = aValue;
			},
			exitChange: (aValue) => {
				this.parametresSaml.urlMetadataServeur = aValue;
				if (this.parametresSaml.urlMetadataServeur !== "") {
					this.fenetre.setBoutonActif(1, false);
					return this.soapVerifierAdresseMetadata(0);
				}
			},
			getDisabled: () => {
				return (
					this.avecParametresInactifs() || this.optionsSaml.bloquerSaisieUrl
				);
			},
		};
	}
	jsxHtmlEtatLogin() {
		return this.getEtatLogin();
	}
	jsxGetUrlPubliqueMetaData() {
		return this.urlFederationMetataClient || "";
	}
	jsxModelCheckboxAcces(aNomProp) {
		return {
			getValue: () => {
				return this.parametresSaml[aNomProp];
			},
			setValue: (aValue) => {
				this.parametresSaml[aNomProp] = aValue;
			},
			getDisabled: () => {
				return this.avecParametresInactifs();
			},
		};
	}
	jsxHtmlLienAcces(aNomPropUrl, aNomPropCB) {
		if (!this.parametresSaml[aNomPropUrl]) {
			return "";
		}
		const lAvecClic =
			this.parametresSaml[aNomPropCB] &&
			this.avecParametresInactifs() &&
			this.estEnService();
		return !lAvecClic
			? '<span class="EspaceGauche Texte10 AvecSelectionTexte Gras">' +
					this.parametresSaml[aNomPropUrl] +
					"</span>"
			: '<a href="' +
					this.parametresSaml[aNomPropUrl] +
					'" class="EspaceGauche Texte10 AvecSelectionTexte LienConsole" target="_blank">' +
					this.parametresSaml[aNomPropUrl] +
					"</a>";
	}
	jsxGetHtmlURLPublique() {
		return this.parametresSaml.urlPublique;
	}
	jsxGetDownloadConfig() {
		if (!this.avecParametresInactifs()) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"saml.TelechargerMetadata",
			);
		}
		return (
			'<a href="download/configurationSaml.xml" target="_blank">' +
			ObjetTraduction_1.GTraductions.getValeur("saml.TelechargerMetadata") +
			"</a>"
		);
	}
	jsxModelCheckboxAccesDirectAuxEspaces() {
		return {
			getValue: () => {
				return this.parametresSaml.accesDirectAuxEspaces;
			},
			setValue: (aValue) => {
				this.parametresSaml.accesDirectAuxEspaces = aValue;
			},
			getDisabled: () => {
				return this.avecParametresInactifs();
			},
		};
	}
	jsxModelRadioTypeAccesDirect(aEstToutLeTemp) {
		return {
			getValue: () => {
				return this.parametresSaml.accesDirectToutLeTemps === aEstToutLeTemp;
			},
			setValue: (aValue) => {
				this.parametresSaml.accesDirectToutLeTemps = aValue;
				this.parametresSaml.accesDirectPasDeReponse = !aValue;
			},
			getName: () => {
				return `${this.Nom}_TypeAccesDirect`;
			},
			getDisabled: () => {
				return (
					!this.parametresSaml.accesDirectAuxEspaces ||
					this.avecParametresInactifs()
				);
			},
		};
	}
	construireStructureAffichage() {
		const H = [];
		if (this.estConnecterAuServeur()) {
			H.push(
				'<div class="full-width ',
				(this.optionsSaml.avecEspaceInterface ? "Espace " : "") + 'BorderBox">',
			);
			const llabelExplicatif = this.estEnService()
				? ObjetTraduction_1.GTraductions.getValeur(
						"pageParametrageCAS.labelArreterPublicationPourModifierParametres",
					)
				: "";
			H.push(
				'<div class="Texte10 full-width">',
				llabelExplicatif
					? '<div class="Gras EspaceBas AlignementMilieu">' +
							llabelExplicatif +
							"</div>"
					: "",
				"<div>",
				this.composePage(),
				"</div>",
			);
			H.push("</div>");
		} else {
			H.push(
				'<div class="Texte10 Espace GrandEspaceHaut Gras">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"pageConsoleAdministration.msgPasDeModifSiAucuneBase",
					) +
					"</div>",
			);
		}
		return H.join("");
	}
	recupererParametres() {
		if (this.estConnecterAuServeur()) {
			return this.soapGetUrlFederationMetataClient();
		}
	}
	avecParametresInactifs() {
		return this.estEnService();
	}
	evenementSurFenetreParametrage(aParametres) {
		if (aParametres) {
			this.parametresSaml.identifiantUnique = aParametres.identifiantUnique;
		}
	}
	getEtatLogin() {
		const H = [];
		if (!this.donneesRecues || this.parametresSaml.urlMetadataServeur === "") {
			return "";
		}
		switch (this.statutContactServeurSvcW) {
			case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte:
				break;
			case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_EnCours:
				H.push(
					'<div class="Gras" style="',
					ObjetStyle_1.GStyle.composeCouleurTexte("red"),
					'">',
					ObjetTraduction_1.GTraductions.getValeur(
						"saml.ContactServeurEnCours",
					),
					"</div>",
				);
				break;
			case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Inconnu:
			case WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Erreur:
				H.push(
					'<div class="Gras" style="',
					ObjetStyle_1.GStyle.composeCouleurTexte("red"),
					'">',
					ObjetTraduction_1.GTraductions.getValeur("saml.ErreurContactServeur"),
					"</div>",
				);
				break;
			default:
		}
		return H.join("");
	}
	composePage() {
		const lZoneURLPointNet = [];
		if (this.optionsSaml.avecURLPointNet) {
			lZoneURLPointNet.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px;" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("saml.UrlPublique"),
					),
					IE.jsx.str("div", {
						class: "EspaceGauche PetitEspaceHaut Gras AvecSelectionTexte",
						"ie-html": this.jsxGetUrlPubliqueMetaData.bind(this),
					}),
				),
			);
		}
		const lZoneAccesDirectEspace = [];
		if (this.optionsSaml.avecAccesDirectEspaces) {
			lZoneAccesDirectEspace.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px;" },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxAcces.bind(
									this,
									"accesDirectAuxEspaces",
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("saml.LoginDirect"),
						),
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxHtmlLienAcces.bind(
							this,
							"urlAccesDirect",
							"accesDirectAuxEspaces",
						),
					}),
				),
			);
		}
		const lZoneAccesInvite = [];
		if (this.optionsSaml.avecAccesInvite) {
			lZoneAccesInvite.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px;" },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxAcces.bind(
									this,
									"accesInviteSansSaml",
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("saml.EspaceInvite"),
						),
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxHtmlLienAcces.bind(
							this,
							"urlAccesInviteSansSaml",
							"accesInviteSansSaml",
						),
					}),
				),
			);
		}
		const lZoneUrlPubliqueServeur = [];
		if (this.optionsSaml.avecUrlPubliqueServeur) {
			lZoneUrlPubliqueServeur.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ style: "padding-top:10px; display:flex; align-items:center;" },
						IE.jsx.str(
							"div",
							null,
							ObjetTraduction_1.GTraductions.getValeur("saml.UrlPublique"),
						),
					),
					IE.jsx.str("div", {
						style: "padding-top:5px; padding-left:10px;",
						class: "Gras AvecSelectionTexte",
						"ie-html": this.jsxGetHtmlURLPublique.bind(this),
					}),
				),
			);
		}
		const lZoneDownloadConfig = [];
		if (this.optionsSaml.avecDownloadConfig) {
			lZoneDownloadConfig.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px; display:flex; align-items:center;" },
					IE.jsx.str("div", {
						"ie-html": this.jsxGetDownloadConfig.bind(this),
					}),
					IE.jsx.str("div", {
						"ie-mrfiche": "saml.MFicheTelechargerMetadataSaml",
						class: "PetitEspaceGauche",
					}),
				),
			);
		}
		const lZoneAuthentificationServeur = [];
		if (this.optionsSaml.avecAuthentificationServeur) {
			lZoneAuthentificationServeur.push(
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					IE.jsx.str(
						"div",
						{ style: "padding-top:10px;" },
						IE.jsx.str(
							"div",
							{ style: "display:flex; align-items:center;" },
							IE.jsx.str(
								"ie-checkbox",
								{
									"ie-model":
										this.jsxModelCheckboxAccesDirectAuxEspaces.bind(this),
								},
								ObjetTraduction_1.GTraductions.getValeur("saml.LoginDirect"),
							),
							IE.jsx.str("div", {
								"ie-mrfiche": "saml.MFicheLoginDirect",
								class: "PetitEspaceGauche",
							}),
						),
					),
					IE.jsx.str(
						"div",
						{ style: "padding-top:5px; padding-left:15px;" },
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModelRadioTypeAccesDirect.bind(
										this,
										true,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"saml.DirectToutLeTemps",
								),
							),
						),
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModelRadioTypeAccesDirect.bind(
										this,
										false,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"saml.DirectPasDeReponse",
								),
							),
						),
					),
				),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center" },
					IE.jsx.str(
						"div",
						{ class: "fluid-bloc" },
						IE.jsx.str(
							"span",
							{ class: "p-left" },
							ObjetTraduction_1.GTraductions.getValeur(
								"pageParametresDeleguerLAuthentification.NomDeLaDelegation",
							),
							" :",
						),
						IE.jsx.str("input", {
							"ie-model": this.jsxModelInputNomDelegation.bind(this),
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"pageParametresDeleguerLAuthentification.NomDeLaDelegation",
							),
							style: "width:450px;",
						}),
					),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": this.jsxModelBoutonParametres.bind(this),
							style: "min-width:300px;",
							class: "small-bt",
						},
						ObjetTraduction_1.GTraductions.getValeur("saml.Parametres"),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "Espace" },
					IE.jsx.str(
						"div",
						{
							"ie-style": this.jsxGetStyleTexte.bind(this),
							class: "AvecSelectionTexte",
						},
						IE.jsx.str(
							"div",
							{ style: "display:flex; align-items:center;" },
							IE.jsx.str(
								"div",
								null,
								ObjetTraduction_1.GTraductions.getValeur("saml.UrlServeurSaml"),
							),
							this.optionsSaml.avecMrFicheURLServeur
								? '<div ie-mrfiche="saml.MFicheUrlServeurSaml" class="PetitEspaceGauche"></div>'
								: "",
						),
						IE.jsx.str(
							"div",
							{ style: "padding-top:5px; padding-left:10px;" },
							IE.jsx.str("input", {
								type: "text",
								"ie-model": this.jsxModelInputUrl.bind(this),
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"saml.UrlServeurSaml",
								),
								"ie-selecttextfocus": true,
								"ie-trim": true,
								class: "Gras",
								style:
									"width:100%; height:20px;" +
									ObjetStyle_1.GStyle.composeCouleurBordure(
										(0, AccessApp_1.getApp)().getCouleur().noir,
									),
							}),
						),
						IE.jsx.str("div", {
							class: "PetitEspaceHaut",
							"ie-html": this.jsxHtmlEtatLogin.bind(this),
						}),
						lZoneURLPointNet.join(""),
						lZoneAccesDirectEspace.join(""),
						lZoneAccesInvite.join(""),
						lZoneUrlPubliqueServeur.join(""),
						lZoneDownloadConfig.join(""),
						lZoneAuthentificationServeur.join(""),
					),
				),
			),
		);
		return H.join("");
	}
	soapVerifierAdresseMetadata(aCompteur) {
		const lCompteur = aCompteur || 1;
		clearTimeout(this.timeoutEtatEnCours);
		return AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortGestionSaml",
			methode: "VerifierAdresseMetadataSaml",
			serialisation: (aTabParametres) => {
				aTabParametres
					.getElement("AAdresseMetadata")
					.setValeur(this.parametresSaml.urlMetadataServeur);
				aTabParametres
					.getElement("AIdParametres")
					.setValeur(this.infosDelegation.idParametres);
			},
		})
			.then((aDonnees) => {
				const lResultatInterrogationMetadata = aDonnees
					.getElement("return")
					.getValeur();
				this.statutContactServeurSvcW =
					lResultatInterrogationMetadata.statutContactServeur;
				const lParametresSamlVerifie =
					lResultatInterrogationMetadata.parametres;
				this.parametresSaml.revendicationsDisponibles =
					lParametresSamlVerifie.revendicationsDisponibles;
				this.fenetre.setBoutonActif(
					1,
					this.statutContactServeurSvcW ===
						WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte,
				);
			})
			.then(() => {
				if (
					this.statutContactServeurSvcW ===
						WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_EnCours &&
					lCompteur < 60
				) {
					return new Promise((aResolve) => {
						this.timeoutEtatEnCours = setTimeout(aResolve, 1000);
					}).then(() => {
						return this.soapVerifierAdresseMetadata(lCompteur + 1);
					});
				}
			});
	}
	soapGetUrlFederationMetataClient() {
		return AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortGestionSaml",
			methode: "GetUrlFederationMetataClientSaml",
			serialisation: (aTabParametres) => {
				aTabParametres
					.getElement("AIdParametres")
					.setValeur(this.infosDelegation.idParametres);
			},
		}).then((aDonnees) => {
			this.urlFederationMetataClient = aDonnees
				.getElement("return")
				.getValeur();
			this.donneesRecues = true;
			this.statutContactServeurSvcW =
				this.parametresSaml.urlMetadataServeur !== ""
					? WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte
					: WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Inconnu;
			this.$refreshSelf();
			this.fenetre.setBoutonActif(
				1,
				this.statutContactServeurSvcW ===
					WSGestionSaml_1.ETypeStatutContactServeurSamlSvcW.Scs_Contacte,
			);
		});
	}
}
exports.InterfaceParametrageSaml = InterfaceParametrageSaml;
