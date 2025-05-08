exports.InterfaceParametrageWsFed = void 0;
require("IEHtml.MrFiche.js");
const AppelSOAP_1 = require("AppelSOAP");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionWsFed_1 = require("WSGestionWsFed");
const WSGestionWsFed_2 = require("WSGestionWsFed");
const ObjetFenetre_ParametrageWsFed_1 = require("ObjetFenetre_ParametrageWsFed");
class InterfaceParametrageWsFed extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = GApplication;
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
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			inputNomDelegation: {
				getValue() {
					return aInstance.infosDelegation.nom;
				},
				setValue(aValue) {
					aInstance.infosDelegation.nom = aValue;
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
			btnParametres: {
				event() {
					const lFenetreParametrageWsFed =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_ParametrageWsFed_1.ObjetFenetre_ParametrageWsFed,
							{
								pere: aInstance,
								evenement: aInstance.evenementSurFenetreParametrage,
								initialiser(aInstanceFenetre) {
									aInstanceFenetre.setOptionsFenetresParametrageWSFed({
										largeurLibelle:
											aInstance.optionsWsFed.largeurLibelleFenetre,
										groupesUtilisateur:
											aInstance.optionsWsFed.groupesUtilisateur,
									});
								},
							},
						);
					lFenetreParametrageWsFed.setDonnees(aInstance.parametresWsFed);
				},
				getDisabled() {
					return (
						aInstance.estEnService() ||
						!aInstance.parametresWsFed.urlMetadataServeur ||
						aInstance.statutContactServeurSvcW !==
							WSGestionWsFed_1.ETypeStatutContactServeurSvcW.Scs_Contacte
					);
				},
			},
			getStyleTexte() {
				return {
					color: aInstance.avecParametresInactifs()
						? GCouleur.nonEditable.texte
						: "black",
				};
			},
			inputURL: {
				getValue() {
					return aInstance.parametresWsFed.urlMetadataServeur;
				},
				setValue(aValue) {
					aInstance.parametresWsFed.urlMetadataServeur = aValue;
				},
				exitChange(aValue) {
					aInstance.parametresWsFed.urlMetadataServeur = aValue;
					if (aInstance.parametresWsFed.urlMetadataServeur !== "") {
						aInstance.fenetre.setBoutonActif(1, false);
						return aInstance.soapVerifierAdresseMetadata(0);
					}
				},
				getDisabled() {
					return (
						aInstance.avecParametresInactifs() ||
						aInstance.optionsWsFed.bloquerSaisieUrl
					);
				},
			},
			getEtatLogin() {
				return aInstance.getEtatLogin();
			},
			getUrlPubliqueMetaData() {
				return aInstance.urlFederationMetataClient || "";
			},
			cbAcces: {
				getValue(aNomProp) {
					return aInstance.parametresWsFed[aNomProp];
				},
				setValue(aNomProp, aNomMethode, aValue) {
					aInstance.parametresWsFed[aNomProp] = aValue;
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
			lienAcces(aNomPropUrl, aNomPropCB) {
				if (!aInstance.parametresWsFed[aNomPropUrl]) {
					return "";
				}
				const lAvecClic =
					aInstance.parametresWsFed[aNomPropCB] &&
					aInstance.avecParametresInactifs() &&
					aInstance.estEnService();
				return !lAvecClic
					? '<span class="EspaceGauche Texte10 AvecSelectionTexte Gras">' +
							aInstance.parametresWsFed[aNomPropUrl] +
							"</span>"
					: '<a href="' +
							aInstance.parametresWsFed[aNomPropUrl] +
							'" class="EspaceGauche Texte10 AvecSelectionTexte LienConsole" target="_blank">' +
							aInstance.parametresWsFed[aNomPropUrl] +
							"</a>";
			},
			getHtmlURLPublique() {
				return aInstance.parametresWsFed.urlPublique;
			},
			getDownloadConfig() {
				if (!aInstance.avecParametresInactifs()) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"wsfed.TelechargerMetadata",
					);
				}
				return (
					'<a href="download/configurationWsFed.xml" target="_blank">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"wsfed.TelechargerMetadata",
					) +
					"</a>"
				);
			},
			cbAuthControleur: {
				getValue() {
					return aInstance.parametresWsFed.accesDirectAuxEspaces;
				},
				setValue(aValue) {
					aInstance.parametresWsFed.accesDirectAuxEspaces = aValue;
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
			rbAuthControleur: {
				getValue(aEstToutLeTemp) {
					return (
						aInstance.parametresWsFed.accesDirectToutLeTemps === aEstToutLeTemp
					);
				},
				setValue(aValue) {
					aInstance.parametresWsFed.accesDirectToutLeTemps = aValue;
					aInstance.parametresWsFed.accesDirectPasDeReponse = !aValue;
				},
				getDisabled() {
					return (
						!aInstance.parametresWsFed.accesDirectAuxEspaces ||
						aInstance.avecParametresInactifs()
					);
				},
			},
		});
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
		const H = [];
		H.push(
			'<div style="display:flex; align-items: center;">',
			'<div style="flex: 1 1 auto;">',
			'<span style="padding-left:0.5rem;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametresDeleguerLAuthentification.NomDeLaDelegation",
			) + " :",
			"</span>",
			'<input ie-model="inputNomDelegation" style="width:450px;" />',
			"</div>",
			'<ie-bouton ie-model="btnParametres" style="min-width:300px;" class="small-bt">',
			ObjetTraduction_1.GTraductions.getValeur("wsfed.Parametres"),
			"</ie-bouton>",
			"</div>",
		);
		H.push('<div class="Espace">');
		H.push('<div ie-style="getStyleTexte" class="AvecSelectionTexte">');
		H.push(
			'<div style="display:flex; align-items:center;">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur("wsfed.UrlServeurWsFed"),
			"</div>",
			this.optionsWsFed.avecMrFicheURLServeur
				? '<div ie-mrfiche="wsfed.MFicheUrlServeurWsFed" class="PetitEspaceGauche"></div>'
				: "",
			"</div>",
		);
		H.push(
			'<div style="padding-top:5px; padding-left:10px;">',
			'<input type="text" ie-model="inputURL" ie-selecttextfocus ie-trim class="Gras" style="width:100%; height:20px;',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.noir),
			'" />',
			"</div>",
		);
		H.push('<div class="PetitEspaceHaut" ie-html="getEtatLogin"></div>');
		if (this.optionsWsFed.avecURLPointNet) {
			H.push('<div style="padding-top:10px;">');
			H.push(
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.UrlPublique"),
				"</div>",
			);
			H.push(
				'<div class="EspaceGauche PetitEspaceHaut Gras AvecSelectionTexte" ie-html="getUrlPubliqueMetaData"></div>',
			);
			H.push("</div>");
		}
		if (this.optionsWsFed.avecAccesDirectEspaces) {
			H.push('<div style="padding-top:10px;">');
			H.push(
				"<div>",
				"<ie-checkbox ",
				ObjetHtml_1.GHtml.composeAttr("ie-model", "cbAcces", [
					"accesDirectAuxEspaces",
					"SetAccesDirectAuxEspacesWsFed",
				]),
				">",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.LoginDirect"),
				"</ie-checkbox>",
				"</div>",
			);
			H.push(
				"<div ",
				ObjetHtml_1.GHtml.composeAttr("ie-html", "lienAcces", [
					"urlAccesDirect",
					"accesDirectAuxEspaces",
				]),
				'"></div>',
			);
			H.push("</div>");
		}
		if (this.optionsWsFed.avecAccesInvite) {
			H.push('<div style="padding-top:10px;">');
			H.push(
				"<div>",
				"<ie-checkbox ",
				ObjetHtml_1.GHtml.composeAttr("ie-model", "cbAcces", [
					"accesInviteSansCAS",
					"SetAccesInviteSansWsFed",
				]),
				">",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.EspaceInvite"),
				"</ie-checkbox>",
				"</div>",
			);
			H.push(
				"<div ",
				ObjetHtml_1.GHtml.composeAttr("ie-html", "lienAcces", [
					"urlAccesInviteSansCAS",
					"accesInviteSansCAS",
				]),
				'"></div>',
			);
			H.push("</div>");
		}
		if (this.optionsWsFed.avecUrlPubliqueServeur) {
			H.push(
				'<div style="padding-top:10px; display:flex; align-items:center;">',
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.WsFed_UrlPublique"),
				"</div>",
				"</div>",
			);
			H.push(
				'<div style="padding-top:5px; padding-left:10px;" class="Gras AvecSelectionTexte" ie-html="getHtmlURLPublique">',
				"</div>",
			);
		}
		if (this.optionsWsFed.avecDownloadConfig) {
			H.push(
				'<div style="padding-top:10px; display:flex; align-items:center;">',
				'<div ie-html="getDownloadConfig"></div>',
				'<div ie-mrfiche="wsfed.MFicheTelechargerMetadataWsFed" class="PetitEspaceGauche"></div>',
				"</div>",
			);
		}
		if (this.optionsWsFed.avecAuthentificationServeur) {
			H.push('<div style="padding-top:10px;">');
			H.push(
				'<div style="display:flex; align-items:center;">',
				"<ie-checkbox ",
				ObjetHtml_1.GHtml.composeAttr("ie-model", "cbAuthControleur"),
				">",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.LoginDirectWsFed"),
				"</ie-checkbox>",
				'<div ie-mrfiche="wsfed.MFicheAuthentificationWsFed" class="PetitEspaceGauche"></div>',
				"</div>",
			);
			H.push("</div>");
			H.push('<div style="padding-top:5px; padding-left:15px;">');
			H.push(
				"<div>",
				"<ie-radio ",
				ObjetHtml_1.GHtml.composeAttr("ie-model", "rbAuthControleur", [true]),
				">",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.DirectToutLeTemps"),
				"</ie-radio>",
				"</div>",
			);
			H.push(
				"<div>",
				"<ie-radio ",
				ObjetHtml_1.GHtml.composeAttr("ie-model", "rbAuthControleur", [false]),
				">",
				ObjetTraduction_1.GTraductions.getValeur("wsfed.DirectPasDeReponse"),
				"</ie-radio>",
				"</div>",
			);
			H.push("</div>");
		}
		H.push("</div>");
		H.push("</div>");
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
				const lResultatInterrogationMetadata =
					aDonnees.getElement("return").valeur;
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
			this.urlFederationMetataClient = aDonnees.getElement("return").valeur;
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
