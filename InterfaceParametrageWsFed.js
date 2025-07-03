exports.InterfaceParametrageWsFed = void 0;
require("IEHtml.MrFiche.js");
const AppelSOAP_1 = require("AppelSOAP");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionWsFed_1 = require("WSGestionWsFed");
const WSGestionWsFed_2 = require("WSGestionWsFed");
const ObjetFenetre_ParametrageWsFed_1 = require("ObjetFenetre_ParametrageWsFed");
const AccessApp_1 = require("AccessApp");
class InterfaceParametrageWsFed extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
		this.messagesEvenements =
			this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
				"InterfaceParametrageWsFed.js",
			);
		this.optionsWsFed = {
			avecEspaceInterface: true,
			avecAccesDirectEspaces: true,
			avecAccesInvite: true,
			avecURLPointNet: true,
			avecUrlPubliqueServeur: false,
			avecAuthentificationServeur: false,
			avecMrFicheURLServeur: true,
			avecDownloadConfig: false,
			bloquerSaisieUrl: false,
			groupesUtilisateur: [
				WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Professeurs,
				WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Eleves,
				WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_Parents,
				WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_PersonnelsAdministratifs,
				WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_PersonnelsTechniques,
				WSGestionWsFed_2.ETypeProfilUtilisateurSvcW.Pu_MaitresDeStage,
			],
			largeurLibelleFenetre: 120,
		};
		this.donneesRecues = false;
	}
	init(aParametresWsFed, aInfosDelegation) {
		this.parametresWsFed = aParametresWsFed;
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
				const lFenetreParametrageWsFed =
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_ParametrageWsFed_1.ObjetFenetre_ParametrageWsFed,
						{
							pere: this,
							evenement: (aNumeroBouton, aParametres) => {
								this.evenementSurFenetreParametrage(aParametres);
							},
							initialiser(aInstanceFenetre) {
								aInstanceFenetre.setOptionsFenetresParametrageWSFed({
									largeurLibelle: this.optionsWsFed.largeurLibelleFenetre,
									groupesUtilisateur: this.optionsWsFed.groupesUtilisateur,
								});
							},
						},
					);
				lFenetreParametrageWsFed.setDonnees(this.parametresWsFed);
			},
			getDisabled: () => {
				return (
					this.estEnService() ||
					!this.parametresWsFed.urlMetadataServeur ||
					this.statutContactServeurSvcW !==
						WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Contacte
				);
			},
		};
	}
	jsxModelInputURL() {
		return {
			getValue: () => {
				return this.parametresWsFed.urlMetadataServeur;
			},
			setValue: (aValue) => {
				this.parametresWsFed.urlMetadataServeur = aValue;
			},
			exitChange: (aValue) => {
				this.parametresWsFed.urlMetadataServeur = aValue;
				if (this.parametresWsFed.urlMetadataServeur !== "") {
					this.fenetre.setBoutonActif(1, false);
					return this.soapVerifierAdresseMetadata(0);
				}
			},
			getDisabled: () => {
				return (
					this.avecParametresInactifs() || this.optionsWsFed.bloquerSaisieUrl
				);
			},
		};
	}
	jsxGetEtatLogin() {
		return this.getEtatLogin();
	}
	jsxGetUrlPubliqueMetadata() {
		return this.urlFederationMetataClient || "";
	}
	jsxCheckboxAcces(aNomPropriete) {
		return {
			getValue: () => {
				return this.parametresWsFed[aNomPropriete];
			},
			setValue: (aValue) => {
				this.parametresWsFed[aNomPropriete] = aValue;
			},
			getDisabled: () => {
				return this.avecParametresInactifs();
			},
		};
	}
	jsxGetLienAcces(aNomPropUrl, aNomPropCB) {
		if (!this.parametresWsFed[aNomPropUrl]) {
			return "";
		}
		const lAvecClic =
			this.parametresWsFed[aNomPropCB] &&
			this.avecParametresInactifs() &&
			this.estEnService();
		return !lAvecClic
			? '<span class="EspaceGauche Texte10 AvecSelectionTexte Gras">' +
					this.parametresWsFed[aNomPropUrl] +
					"</span>"
			: '<a href="' +
					this.parametresWsFed[aNomPropUrl] +
					'" class="EspaceGauche Texte10 AvecSelectionTexte LienConsole" target="_blank">' +
					this.parametresWsFed[aNomPropUrl] +
					"</a>";
	}
	jsxGetHtmlURLPublique() {
		return this.parametresWsFed.urlPublique;
	}
	jsxGetDownloadConfig() {
		if (!this.avecParametresInactifs()) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"wsfed.TelechargerMetadata",
			);
		}
		return (
			'<a href="download/configurationWsFed.xml" target="_blank">' +
			ObjetTraduction_1.GTraductions.getValeur("wsfed.TelechargerMetadata") +
			"</a>"
		);
	}
	jsxCheckboxAvecAccesDirect() {
		return {
			getValue: () => {
				return this.parametresWsFed.accesDirectAuxEspaces;
			},
			setValue: (aValue) => {
				this.parametresWsFed.accesDirectAuxEspaces = aValue;
			},
			getDisabled: () => {
				return this.avecParametresInactifs();
			},
		};
	}
	jsxRadioTypeAccesDirect(aEstToutLeTemp) {
		return {
			getValue: () => {
				return this.parametresWsFed.accesDirectToutLeTemps === aEstToutLeTemp;
			},
			setValue: (aValue) => {
				this.parametresWsFed.accesDirectToutLeTemps = aValue;
				this.parametresWsFed.accesDirectPasDeReponse = !aValue;
			},
			getName: () => {
				return `${this.Nom}_TypeAccesDirect`;
			},
			getDisabled: () => {
				return (
					!this.parametresWsFed.accesDirectAuxEspaces ||
					this.avecParametresInactifs()
				);
			},
		};
	}
	jsxGetStyleEntete() {
		return {
			color: this.avecParametresInactifs()
				? (0, AccessApp_1.getApp)().getCouleur().nonEditable.texte
				: "black",
		};
	}
	construireStructureAffichage() {
		const H = [];
		if (this.estConnecterAuServeur()) {
			H.push(
				'<div style="width:100%" class="',
				(this.optionsWsFed.avecEspaceInterface ? "Espace " : "") +
					'BorderBox">',
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
			this.parametresWsFed.correspondancesRevendications =
				aParametres.correspondancesRevendications;
			this.parametresWsFed.correspondancesProfilsUtilisateurGroupes =
				aParametres.correspondancesProfilsUtilisateurGroupes;
			this.parametresWsFed.rechercheParIdentite =
				aParametres.rechercheParIdentite;
		}
	}
	getEtatLogin() {
		const H = [];
		if (!this.donneesRecues || this.parametresWsFed.urlMetadataServeur === "") {
			return "";
		}
		switch (this.statutContactServeurSvcW) {
			case WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Contacte:
				break;
			case WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_EnCours:
				H.push(
					'<div class="Gras" style="',
					ObjetStyle_1.GStyle.composeCouleurTexte("red"),
					'">',
					ObjetTraduction_1.GTraductions.getValeur(
						"wsfed.ContactServeurEnCours",
					),
					"</div>",
				);
				break;
			case WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Inconnu:
			case WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Erreur:
				H.push(
					'<div class="Gras" style="',
					ObjetStyle_1.GStyle.composeCouleurTexte("red"),
					'">',
					ObjetTraduction_1.GTraductions.getValeur(
						"wsfed.ErreurContactServeur",
					),
					"</div>",
				);
				break;
			default:
		}
		return H.join("");
	}
	composePage() {
		const lZoneURLPointNet = [];
		if (this.optionsWsFed.avecURLPointNet) {
			lZoneURLPointNet.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px;" },
					IE.jsx.str(
						"div",
						null,
						ObjetTraduction_1.GTraductions.getValeur("wsfed.UrlPublique"),
					),
					IE.jsx.str("div", {
						class: "EspaceGauche PetitEspaceHaut Gras AvecSelectionTexte",
						"ie-html": this.jsxGetUrlPubliqueMetadata.bind(this),
					}),
				),
			);
		}
		const lZoneAccesDirectEspaces = [];
		if (this.optionsWsFed.avecAccesDirectEspaces) {
			lZoneAccesDirectEspaces.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px;" },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxCheckboxAcces.bind(
									this,
									"accesDirectAuxEspaces",
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("wsfed.LoginDirect"),
						),
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxGetLienAcces.bind(
							this,
							"urlAccesDirect",
							"accesDirectAuxEspaces",
						),
					}),
				),
			);
		}
		const lZoneAccesInvite = [];
		if (this.optionsWsFed.avecAccesInvite) {
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
								"ie-model": this.jsxCheckboxAcces.bind(
									this,
									"accesInviteSansWsFed",
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("wsfed.EspaceInvite"),
						),
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxGetLienAcces.bind(
							this,
							"urlAccesInviteSansWsFed",
							"accesInviteSansWsFed",
						),
					}),
				),
			);
		}
		const lZoneUrlPubliqueServeur = [];
		if (this.optionsWsFed.avecUrlPubliqueServeur) {
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
							ObjetTraduction_1.GTraductions.getValeur(
								"wsfed.WsFed_UrlPublique",
							),
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
		if (this.optionsWsFed.avecDownloadConfig) {
			lZoneDownloadConfig.push(
				IE.jsx.str(
					"div",
					{ style: "padding-top:10px; display:flex; align-items:center;" },
					IE.jsx.str("div", {
						"ie-html": this.jsxGetDownloadConfig.bind(this),
					}),
					IE.jsx.str("div", {
						"ie-mrfiche": "wsfed.MFicheTelechargerMetadataWsFed",
						class: "PetitEspaceGauche",
					}),
				),
			);
		}
		const lZoneAuthentificationServeur = [];
		if (this.optionsWsFed.avecAuthentificationServeur) {
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
								{ "ie-model": this.jsxCheckboxAvecAccesDirect.bind(this) },
								ObjetTraduction_1.GTraductions.getValeur(
									"wsfed.LoginDirectWsFed",
								),
							),
							IE.jsx.str("div", {
								"ie-mrfiche": "wsfed.MFicheAuthentificationWsFed",
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
								{ "ie-model": this.jsxRadioTypeAccesDirect.bind(this, true) },
								ObjetTraduction_1.GTraductions.getValeur(
									"wsfed.DirectToutLeTemps",
								),
							),
						),
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str(
								"ie-radio",
								{ "ie-model": this.jsxRadioTypeAccesDirect.bind(this, false) },
								ObjetTraduction_1.GTraductions.getValeur(
									"wsfed.DirectPasDeReponse",
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
					{ style: "display:flex; align-items: center;" },
					IE.jsx.str(
						"div",
						{ style: "flex: 1 1 auto;" },
						IE.jsx.str(
							"span",
							{ style: "padding-left:0.5rem;" },
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
						ObjetTraduction_1.GTraductions.getValeur("wsfed.Parametres"),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "Espace" },
					IE.jsx.str(
						"div",
						{
							"ie-style": this.jsxGetStyleEntete.bind(this),
							class: "AvecSelectionTexte",
						},
						IE.jsx.str(
							"div",
							{ style: "display:flex; align-items:center;" },
							IE.jsx.str(
								"div",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"wsfed.UrlServeurWsFed",
								),
							),
							this.optionsWsFed.avecMrFicheURLServeur
								? '<div ie-mrfiche="wsfed.MFicheUrlServeurWsFed" class="PetitEspaceGauche"></div>'
								: "",
						),
						IE.jsx.str(
							"div",
							{ style: "padding-top:5px; padding-left:10px;" },
							IE.jsx.str("input", {
								type: "text",
								"ie-model": this.jsxModelInputURL.bind(this),
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"wsfed.UrlServeurWsFed",
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
							"ie-html": this.jsxGetEtatLogin.bind(this),
						}),
						lZoneURLPointNet.join(""),
						lZoneAccesDirectEspaces.join(""),
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
			port: "PortGestionWsFed",
			methode: "VerifierAdresseMetadata",
			serialisation: (aTabParametres) => {
				aTabParametres
					.getElement("AAdresseMetadata")
					.setValeur(this.parametresWsFed.urlMetadataServeur);
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
				const lParametresWsFedVerifie =
					lResultatInterrogationMetadata.parametres;
				this.parametresWsFed.correspondancesRevendications =
					lParametresWsFedVerifie.correspondancesRevendications;
				this.parametresWsFed.revendicationsDisponibles =
					lParametresWsFedVerifie.revendicationsDisponibles;
				this.fenetre.setBoutonActif(
					1,
					this.statutContactServeurSvcW ===
						WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Contacte,
				);
			})
			.then(() => {
				if (
					this.statutContactServeurSvcW ===
						WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_EnCours &&
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
			port: "PortGestionWsFed",
			methode: "GetUrlFederationMetataClient",
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
				this.parametresWsFed.urlMetadataServeur !== ""
					? WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Contacte
					: WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Inconnu;
			this.$refreshSelf();
			this.fenetre.setBoutonActif(
				1,
				this.statutContactServeurSvcW ===
					WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Contacte,
			);
		});
	}
}
exports.InterfaceParametrageWsFed = InterfaceParametrageWsFed;
