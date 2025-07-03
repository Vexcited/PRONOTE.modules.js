exports.InterfaceParametrageCAS = void 0;
const AppelSOAP_1 = require("AppelSOAP");
const GUID_1 = require("GUID");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionCAS_1 = require("WSGestionCAS");
const ObjetFenetre_ParametresCAS_1 = require("ObjetFenetre_ParametresCAS");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const GenreURLServeurCas = { serveurCas: 0, login: 1, validation: 2 };
class InterfaceParametrageCAS extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
		this.messagesEvenements =
			this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
				"InterfaceParametrageCAS.js",
			);
		this.idParametresAvecCAS = this.Nom + "_AvecCAS";
		this.idSaisieURL = this.Nom + "_inputSaisieURL";
		this.idSaisieURLServeurCAS = this.idSaisieURL + "ServeurCAS";
		this.idSaisieURLLogin = this.idSaisieURL + "Login";
		this.idSaisieURLValid = this.idSaisieURL + "Valid";
		this.idNext = this.Nom + "_nextPourFocus";
		this.idComboModelesConfigENT = GUID_1.GUID.getId();
		this.parametreLargeurCol1 = 150;
		this.donneesRecues = false;
		this.optionsCAS = {
			avecModeles: false,
			accesDirectPourServeurHttp: true,
			avecMrFicheAccesDirect: true,
		};
	}
	init(aGestionCAS, aInfosDelegation) {
		this.gestionCAS = aGestionCAS;
		this.infosDelegation = aInfosDelegation;
		this.recupererDonneesPage();
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
			btnModele: {
				event() {
					aInstance.evntBtnAppliquerModele();
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
			btnParametres: {
				event() {
					if (aInstance.donneesRecues) {
						const lFenetreParametresCAS =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_ParametresCAS_1.ObjetFenetre_ParametresCAS,
								{
									pere: aInstance,
									evenement: aInstance.evenementFenetreParametres,
									initialiser: aInstance.initialiserFenetreParametres,
								},
							);
						lFenetreParametresCAS.surEntreeAffichage(
							aInstance.getDonneesFenetreParametre(),
							aInstance.estServeurActif.bind(aInstance),
						);
					}
				},
			},
			btnActualiserModeles: {
				event() {
					aInstance.evntBtnActualiserModeles();
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
			radioAuthentification: {
				getValue(aAccesDirectToutLeTemps) {
					if (
						!aInstance.gestionCAS.accesDirectToutLeTemps &&
						!aInstance.gestionCAS.accesDirectPasDeReponse
					) {
						aInstance.gestionCAS.accesDirectToutLeTemps = true;
					}
					return aAccesDirectToutLeTemps
						? aInstance.gestionCAS.accesDirectToutLeTemps
						: aInstance.gestionCAS.accesDirectPasDeReponse;
				},
				setValue(aAccesDirectToutLeTemps) {
					aInstance.gestionCAS.setAccesDirectToutLeTemps(
						aAccesDirectToutLeTemps,
					);
					aInstance.gestionCAS.setAccesDirectPasDeReponse(
						!aAccesDirectToutLeTemps,
					);
				},
				getDisabled() {
					return (
						aInstance.avecParametresInactifs() ||
						!aInstance.gestionCAS.accesDirectAuxEspaces
					);
				},
			},
			getNodeLienCliquable(aAccepte, aUrl) {
				$(this.node).on("click", () => {
					if (aAccepte && aInstance.avecParametresInactifs()) {
						window.open(aUrl);
					}
				});
			},
			cbDeuxAdresses: {
				getValue() {
					return !aInstance.gestionCAS.configStandard;
				},
				setValue(aValeur) {
					const lStandard = !aValeur;
					if (lStandard !== aInstance.gestionCAS.configStandard) {
						aInstance.gestionCAS.configStandard = lStandard;
						aInstance.verifierSelonModele();
						aInstance.initialiser(true);
					}
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
			getNodeSelect() {
				if (aInstance.optionsCAS.avecModeles) {
					$(this.node).on("change", function () {
						const i = parseInt($(this).val().toString());
						aInstance.surSelectionModeleConfigENT(
							aInstance.tabModeles[i].idModeleConfig,
						);
					});
				}
			},
			cbAutoriserAccesDirect: {
				getValue() {
					return aInstance.gestionCAS.accesDirectAuxEspaces;
				},
				setValue(aValeur) {
					aInstance.gestionCAS.accesDirectAuxEspaces = aValeur;
					aInstance.$refreshSelf();
				},
				getDisabled() {
					return aInstance.avecParametresInactifs();
				},
			},
		});
	}
	estServeurActif() {
		return (
			this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true
		);
	}
	avecParametresInactifs() {
		return this.estServeurActif() || !this.gestionCAS;
	}
	verifierSelonModele() {
		let lTest = true;
		if (this.gestionCAS.idModeleConfig !== 0) {
			lTest =
				this.gestionCAS.configStandard ===
				this.gestionCASdeModele.getConfigStandard();
			if (lTest) {
				if (this.gestionCASdeModele.configStandard) {
					lTest =
						this.gestionCAS.urlServeurCAS ===
						this.gestionCASdeModele.getUrlServeurCAS();
				} else {
					lTest =
						this.gestionCAS.urlLoginPerso ===
							this.gestionCASdeModele.getUrlLoginPerso() &&
						this.gestionCAS.urlValidPerso ===
							this.gestionCASdeModele.getUrlValidPerso();
				}
			}
			if (lTest) {
				lTest =
					this.gestionCAS.modePremiereConnexion ===
					this.gestionCASdeModele.getModePremiereConnexion();
			}
			if (lTest) {
				lTest =
					this.gestionCAS.utiliserAttributLogin ===
					this.gestionCASdeModele.getUtiliserAttributLogin();
			}
			if (lTest) {
				for (let i = 0; i < this.gestionCAS.attributsCAS.length && lTest; i++) {
					const lAttribut = this.gestionCAS.attributsCAS[i];
					const lAttributModele = this.gestionCASdeModele.attributsCAS[i];
					lTest = lAttribut.nom === lAttributModele.nom;
				}
			}
			if (lTest) {
				for (
					let j = 0;
					j < this.gestionCAS.correspondancesEspacesCategories.length && lTest;
					j++
				) {
					const lCorresp = this.gestionCAS.correspondancesEspacesCategories[j];
					const lCorrespModele =
						this.gestionCASdeModele.correspondancesEspacesCategories[j];
					lTest = lCorresp.categories === lCorrespModele.categories;
				}
			}
		}
		this.gestionCAS.modelePersonnalise = !lTest;
	}
	demanderInfosGestionCAS() {
		return this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur();
	}
	recupererDonneesPage() {
		if (this.demanderInfosGestionCAS()) {
			if (this.optionsCAS.avecModeles) {
				this.soapGetModelesConfigENT()
					.then(() => {
						return this.soapGetModeleConfigCAS(this.gestionCAS.idModeleConfig);
					})
					.then(() => {
						this.donneesRecues = true;
						this.initialiser(true);
					});
			} else {
				this.donneesRecues = true;
				this.initialiser(true);
			}
		}
	}
	construireStructureAffichage() {
		const H = [];
		const llabelExplicatif = this.estServeurActif()
			? ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.labelArreterPublicationPourModifierParametres",
				)
			: "";
		if (this.donneesRecues) {
			H.push(
				'<table class="Texte10 full-width">',
				llabelExplicatif
					? '<tr><td class="Gras EspaceBas AlignementMilieu">' +
							llabelExplicatif +
							"</td></tr>"
					: "",
				"<tr><td>",
				'<div class="flex-contain flex-center">',
				'<div class="fluid-bloc">',
				'<span class="p-left">',
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresDeleguerLAuthentification.NomDeLaDelegation",
				) + " :",
				"</span>",
				IE.jsx.str("input", {
					"ie-model": "inputNomDelegation",
					style: "width:450px;",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresDeleguerLAuthentification.NomDeLaDelegation",
					),
				}),
				"</div>",
				'<ie-bouton ie-model="btnParametres" title="',
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.hintBtnParametres",
				),
				'" style="min-width:300px;" class="small-bt">',
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.btnParametres",
				),
				"</ie-bouton>",
				"</div>",
				"</td></tr>",
				"<tr><td>",
				this.composeAvecCAS(),
				"</td></tr>",
				"</table>",
			);
		}
		return H.join("");
	}
	composeAvecCAS() {
		let lDivModelesConfiguration = "";
		if (this.optionsCAS.avecModeles) {
			lDivModelesConfiguration = this.composeModelesConfiguration();
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"table",
				{
					id: this.idParametresAvecCAS,
					class: "Texte10 AvecSelectionTexte full-width",
				},
				lDivModelesConfiguration,
				IE.jsx.str(
					"tr",
					null,
					IE.jsx.str("td", { class: "Espace" }, this.composeURLsServeurCAS()),
				),
				IE.jsx.str(
					"tr",
					null,
					IE.jsx.str("td", { class: "Espace" }, this.composeURLClientCAS()),
				),
				IE.jsx.str(
					"tr",
					null,
					IE.jsx.str(
						"td",
						{ class: "Espace" },
						this.composeCheckBoxAutoriserAccesDirect(),
					),
				),
			),
		);
		return H.join("");
	}
	_urlCASNonRenseigne() {
		let lInfos;
		let lEstUrlVide;
		if (this.gestionCAS.configStandard) {
			lInfos = this.getInfosServeurCASSelonTypeURL(
				GenreURLServeurCas.serveurCas,
			);
			lEstUrlVide = lInfos.estUrlVide;
		} else {
			lInfos = this.getInfosServeurCASSelonTypeURL(GenreURLServeurCas.login);
			lEstUrlVide = lInfos.estUrlVide;
			lInfos = this.getInfosServeurCASSelonTypeURL(
				GenreURLServeurCas.validation,
			);
			lEstUrlVide = lEstUrlVide && lInfos.estUrlVide;
		}
		return lEstUrlVide;
	}
	initialiserFenetreParametres(aInstanceFenetreParametres) {}
	surEvenementKeyUp() {
		if (ObjetNavigateur_1.Navigateur.isToucheRetourChariot()) {
			ObjetHtml_1.GHtml.setFocus(this.idNext);
		}
	}
	composeURLsServeurCAS() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center" },
				IE.jsx.str(
					"span",
					{
						class: "Gras",
						style: "width:" + this.parametreLargeurCol1 + "px;",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametrageCAS.urlServeurCAS",
					),
				),
				this.composeCBChoixConfig(),
			),
		);
		if (this.gestionCAS.modelePersonnalise) {
			H.push(this.composeWarningParametresNonConformesAuModele());
		}
		if (this.gestionCAS.configStandard) {
			H.push(this.composeURLsServeurCASStd());
		} else {
			H.push(this.composeURLsServeurCASPerso());
		}
		return H.join("");
	}
	composeURLsServeurCASPerso() {
		const H = [];
		H.push('<table class="Texte10 full-width">');
		H.push("<tr>");
		H.push(
			'<td class="AlignementDroit" style="width:' +
				this.parametreLargeurCol1 +
				'px;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.urlAuthServeurCAS",
			),
			"</td>",
		);
		H.push(
			'<td class="Espace">',
			this.composeZoneSaisieURLServeurCAS(
				GenreURLServeurCas.login,
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.urlAuthServeurCAS",
				),
			),
			"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td class="AlignementDroit" style="width:' +
				this.parametreLargeurCol1 +
				'px;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.lienComplet",
			),
			"</td>",
		);
		H.push(
			'<td class="Espace Gras">',
			this.gestionCAS.urlAuthentificationCAS,
			"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td class="AlignementDroit" style="width:' +
				this.parametreLargeurCol1 +
				'px;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.urlValidationServeurCAS",
			),
			"</td>",
		);
		H.push(
			'<td class="Espace">',
			this.composeZoneSaisieURLServeurCAS(
				GenreURLServeurCas.validation,
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.urlValidationServeurCAS",
				),
			),
			"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td id="' +
				this.idNext +
				'" class="AlignementDroit" style="width:' +
				this.parametreLargeurCol1 +
				'px;">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.lienComplet",
			),
			"</td>",
		);
		H.push(
			'<td class="Espace Gras">',
			this.gestionCAS.urlValidationCAS,
			"</td>",
		);
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
	composeURLsServeurCASStd() {
		const H = [];
		H.push('<table class="Texte10 full-width">');
		H.push("<tr>");
		H.push(
			'<td colspan="2" class="Espace GrandEspaceGauche">',
			this.composeZoneSaisieURLServeurCAS(
				GenreURLServeurCas.serveurCas,
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.urlServeurCAS",
				),
			),
			"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td id="' +
				this.idNext +
				'" style="width:' +
				this.parametreLargeurCol1 +
				'px;" class="Espace GrandEspaceGauche AlignementDroit">',
			ObjetTraduction_1.GTraductions.getValeur("pageParametrageCAS.lienAuth"),
			"</td>",
		);
		H.push(
			'<td class="Gras">',
			this.gestionCAS.urlAuthentificationCAS || "&nbsp;",
			"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td style="width:' +
				this.parametreLargeurCol1 +
				'px;" class="Espace GrandEspaceGauche AlignementDroit">',
			ObjetTraduction_1.GTraductions.getValeur("pageParametrageCAS.lienValid"),
			"</td>",
		);
		H.push(
			'<td class="Gras">',
			this.gestionCAS.urlValidationCAS || "&nbsp;",
			"</td>",
		);
		H.push("</tr>");
		H.push("</table>");
		return H.join("");
	}
	composeCBChoixConfig() {
		const H = [];
		H.push(
			IE.jsx.str(
				"ie-checkbox",
				{ "ie-model": "cbDeuxAdresses", style: "margin-left:15px;" },
				ObjetTraduction_1.GTraductions.getValeur(
					"pageParametrageCAS.adressesDifferentes",
				),
			),
		);
		return H.join("");
	}
	getInfosServeurCASSelonTypeURL(aGenreUrl) {
		switch (aGenreUrl) {
			case GenreURLServeurCas.serveurCas: {
				return {
					contenu: this.gestionCAS.urlServeurCAS,
					idSaisie: this.idSaisieURLServeurCAS,
					estUrlVide: this.gestionCAS.urlServeurCAS === "",
				};
			}
			case GenreURLServeurCas.login: {
				return {
					contenu:
						this.gestionCAS.urlLoginPerso !== ""
							? this.gestionCAS.urlLoginPerso
							: "/login",
					idSaisie: this.idSaisieURLLogin,
					estUrlVide: this.gestionCAS.urlLoginPerso === "",
				};
			}
			case GenreURLServeurCas.validation: {
				return {
					contenu:
						this.gestionCAS.urlValidPerso !== ""
							? this.gestionCAS.urlValidPerso
							: "/samlValidate",
					idSaisie: this.idSaisieURLValid,
					estUrlVide: this.gestionCAS.urlValidPerso === "",
				};
			}
		}
	}
	composeZoneSaisieURLServeurCAS(aGenreUrl, aLabel) {
		const H = [];
		const lInfos = this.getInfosServeurCASSelonTypeURL(aGenreUrl);
		const lParametresInactifs = this.avecParametresInactifs();
		const lActif = lParametresInactifs ? "disabled" : "";
		const lCurseur = lParametresInactifs ? "SansMain" : "AvecMain";
		H.push(
			'<input class="Texte10 Gras" id="' +
				lInfos.idSaisie +
				'" onChange="' +
				this.Nom +
				".surEvntInputSaisieURLServeurCAS(",
			aGenreUrl,
			')" onkeyup="' +
				this.Nom +
				'.surEvenementKeyUp()" class="Texte10 EspaceGauche ' +
				lCurseur +
				'" style="width:100%; ',
			ObjetStyle_1.GStyle.composeCouleurBordure(
				(0, AccessApp_1.getApp)().getCouleur().noir,
			),
			'" type="text" value="' +
				lInfos.contenu +
				'" ' +
				lActif +
				' aria-label="',
			aLabel,
			'"/>',
		);
		return H.join("");
	}
	composeURLClientCAS() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "EspaceHaut" },
				IE.jsx.str(
					"span",
					null,
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur(
							"pageParametrageCAS.urlClientCAS",
						),
					),
				),
				IE.jsx.str(
					"span",
					{ class: "Gras m-left-s" },
					this.gestionCAS.urlClientCAS,
				),
			),
		);
		return H.join("");
	}
	_composeAdresseCliquable(aAutoriserClic, aUrl) {
		const lAvecClic =
				aAutoriserClic &&
				this.avecParametresInactifs() &&
				this.estServeurActif(),
			lClassLien = lAvecClic ? " LienConsole " : "Gras";
		return (
			'<span class="EspaceGauche Texte10 AvecSelectionTexte ' +
			lClassLien +
			'" ' +
			ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodeLienCliquable", [
				lAvecClic,
				aUrl,
			]) +
			">" +
			aUrl +
			"</span>"
		);
	}
	composeCheckBoxAutoriserAccesDirect() {
		const lAdresseDirectCliquable = [];
		if (this.optionsCAS.accesDirectPourServeurHttp) {
			lAdresseDirectCliquable.push(
				'<div class="GrandEspaceGauche EspaceHaut">',
				this._composeAdresseCliquable(
					this.gestionCAS.accesDirectAuxEspaces,
					this.gestionCAS.urlAccesDirect,
				),
				"</div>",
			);
		}
		const lMrFicheAccesDirect = [];
		if (
			!this.optionsCAS.accesDirectPourServeurHttp &&
			this.optionsCAS.avecMrFicheAccesDirect
		) {
			lMrFicheAccesDirect.push(
				IE.jsx.str("div", {
					"ie-mrfiche": "pageParametrageCAS.mFicheAuthentification",
					class: "InlineBlock p-left-l AlignementMilieuVertical",
				}),
			);
		}
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "EspaceHaut" },
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "cbAutoriserAccesDirect" },
						ObjetTraduction_1.GTraductions.getValeur(
							"pageParametrageCAS.autoriserAccesDirect",
						),
					),
					lMrFicheAccesDirect.join(""),
				),
				lAdresseDirectCliquable.join(""),
			),
		);
		if (!this.optionsCAS.accesDirectPourServeurHttp) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche EspaceHaut" },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": "radioAuthentification(true)",
								name: "authDirectCAS",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"pageParametrageCAS.DirectToutLeTemps",
							),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": "radioAuthentification(false)",
								name: "authDirectCAS",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"pageParametrageCAS.DirectPasDeReponse",
							),
						),
					),
				),
			);
		}
		return H.join("");
	}
	evenementFenetreParametres(aNumeroBouton, aParam1) {
		switch (aNumeroBouton) {
			case ObjetFenetre_ParametresCAS_1.ObjetFenetre_ParametresCAS
				.TypeEvenementsFenetreParametresCAS.valider:
				this.gestionCAS.utiliserAttributLogin = aParam1.utiliserAttributLogin;
				this.gestionCAS.modePremiereConnexion = aParam1.modePremiereConnexion;
				this.gestionCAS.attributsCAS = aParam1.attributsCAS;
				this.gestionCAS.correspondancesEspacesCategories =
					aParam1.correspEspaceCategories;
				this.verifierSelonModele();
				this.initialiser(true);
				break;
			case ObjetFenetre_ParametresCAS_1.ObjetFenetre_ParametresCAS
				.TypeEvenementsFenetreParametresCAS.annuler:
			case ObjetFenetre_ParametresCAS_1.ObjetFenetre_ParametresCAS
				.TypeEvenementsFenetreParametresCAS.fermer:
				break;
		}
	}
	callbackSurSaisie() {
		this.recupererDonneesPage();
	}
	surEvntInputSaisieURLServeurCAS(aGenreUrl) {
		this.saisieSurEvntInputSaisieURLServeurCAS(aGenreUrl);
	}
	saisieSurEvntInputSaisieURLServeurCAS(aGenreUrl) {
		switch (aGenreUrl) {
			case GenreURLServeurCas.serveurCas: {
				this.gestionCAS.urlServeurCAS = ObjetHtml_1.GHtml.getElement(
					this.idSaisieURLServeurCAS,
				).value;
				break;
			}
			case GenreURLServeurCas.login: {
				this.gestionCAS.urlLoginPerso = ObjetHtml_1.GHtml.getElement(
					this.idSaisieURLLogin,
				).value;
				break;
			}
			case GenreURLServeurCas.validation: {
				this.gestionCAS.urlValidPerso = ObjetHtml_1.GHtml.getElement(
					this.idSaisieURLValid,
				).value;
				break;
			}
		}
		this.verifierSelonModele();
		this.initialiser(true);
	}
	getDonneesFenetreParametre() {
		return {
			utiliserAttributLogin: this.gestionCAS.utiliserAttributLogin,
			modePremiereConnexion: this.gestionCAS.modePremiereConnexion,
			attributsCAS: this.gestionCAS.attributsCAS,
			correspEspaceCategories: this.gestionCAS.correspondancesEspacesCategories,
		};
	}
	getIndiceDuModele(aIdModele) {
		let lModele;
		for (let i = 0, lNbr = this.tabModeles.length; i < lNbr; i++) {
			lModele = this.tabModeles[i];
			if (aIdModele === lModele.idModeleConfig) {
				return i;
			}
		}
		return 0;
	}
	appliquerModeleConfigENT(aIdModele, aAccepte) {
		if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
			this.soapGetModeleConfigCAS(aIdModele).then(() => {
				if (this.gestionCASdeModele || aIdModele === 0) {
					this.gestionCAS.idModeleConfig = aIdModele;
					if (aIdModele !== 0) {
						this.gestionCAS.configStandard =
							this.gestionCASdeModele.configStandard;
						if (this.gestionCASdeModele.configStandard) {
							this.gestionCAS.urlServeurCAS =
								this.gestionCASdeModele.urlServeurCAS;
						} else {
							this.gestionCAS.urlLoginPerso =
								this.gestionCASdeModele.getUrlLoginPerso();
							this.gestionCAS.urlValidPerso =
								this.gestionCASdeModele.getUrlValidPerso();
						}
						this.gestionCAS.modePremiereConnexion =
							this.gestionCASdeModele.modePremiereConnexion;
						this.gestionCAS.utiliserAttributLogin =
							this.gestionCASdeModele.utiliserAttributLogin;
						this.gestionCAS.attributsCAS = this.gestionCASdeModele.attributsCAS;
						this.gestionCAS.correspondancesEspacesCategories =
							this.gestionCASdeModele.correspondancesEspacesCategories;
						this.gestionCAS.urlAuthentificationCAS =
							this.gestionCASdeModele.urlAuthentificationCAS;
						this.gestionCAS.urlValidationCAS =
							this.gestionCASdeModele.urlValidationCAS;
						this.gestionCAS.urlClientCAS = this.gestionCASdeModele.urlClientCAS;
						this.gestionCAS.activerEmail = this.gestionCASdeModele.activerEmail;
						this.gestionCAS.adresseEmail = this.gestionCASdeModele.adresseEmail;
					}
					this.gestionCAS.modelePersonnalise = false;
					this.initialiser(true);
				}
			});
		} else {
			const lInd = this.getIndiceDuModele(this.gestionCAS.idModeleConfig);
			$("#" + this.idComboModelesConfigENT.escapeJQ() + " option")
				.eq(lInd)
				.prop("selected", true);
		}
	}
	evntBtnAppliquerModele() {
		this.appliquerModeleConfigENT(
			this.gestionCAS.idModeleConfig,
			Enumere_Action_1.EGenreAction.Valider,
		);
	}
	evntBtnActualiserModeles() {
		AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortGestionCAS",
			methode: "MAJModelesConfigENT",
		}).then(() => {
			this.callbackSurSaisie();
		});
	}
	soapGetModelesConfigENT() {
		return AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortGestionCAS",
			methode: "GetModelesConfigENT",
			serialisation: (aTabParametres) => {
				aTabParametres
					.getElement("AIdParametres")
					.setValeur(this.infosDelegation.idParametres);
			},
		}).then((aDonnees) => {
			this.callbackSurGetModelesConfigENT(aDonnees);
		});
	}
	soapGetModeleConfigCAS(aIdModele) {
		this.gestionCASdeModele = null;
		return AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortGestionCAS",
			methode: "GetModeleConfigCAS",
			serialisation: (aTabParametres) => {
				aTabParametres
					.getElement("AIdParametres")
					.setValeur(this.infosDelegation.idParametres);
				aTabParametres.getElement("AIdModele").setValeur(aIdModele);
			},
		}).then((aDonnees) => {
			this.gestionCASdeModele = aDonnees.getElement("return").getValeur();
		});
	}
	callbackSurGetModelesConfigENT(aDonnees) {
		const lTabModeles = aDonnees.getElement("return").getValeur();
		this.tabModeles = [];
		const lDefault = new WSGestionCAS_1.TModeleConfigENT(
			0,
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.cmbAucunModele",
			),
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.informationCAS",
			),
			"",
		);
		this.tabModeles.push(lDefault);
		let lModele;
		for (let i = 0, lNbr = lTabModeles.length; i < lNbr; i++) {
			lModele = lTabModeles[i];
			this.tabModeles.push(lModele);
		}
		this.tabModeles.sort((a, b) => {
			if (a.idModeleConfig === 0) {
				return -1;
			}
			if (b.idModeleConfig === 0) {
				return 1;
			}
			return a.libelle.toLowerCase() > b.libelle.toLowerCase() ? 1 : -1;
		});
	}
	composeModelesConfiguration() {
		const lActif = this.avecParametresInactifs() ? "disabled" : "";
		const H = [];
		H.push('<tr><td class="Espace">');
		H.push("<div>");
		H.push(
			'<div class="InlineBlock Espace AlignementMilieuVertical ">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.labelCmbModeles",
			),
			"</div>",
		);
		H.push(
			'<select ie-node="getNodeSelect" style="width:450px;" class="Texte10 Gras InlineBlock AlignementMilieuVertical" id="' +
				this.idComboModelesConfigENT +
				'" ',
			lActif,
			">",
		);
		let lModele, lModeleSelected;
		for (let i = 0, lNbr = this.tabModeles.length; i < lNbr; i++) {
			lModele = this.tabModeles[i];
			if (this.gestionCAS.idModeleConfig === lModele.idModeleConfig) {
				lModeleSelected = lModele;
			}
			H.push(
				'<option value="' +
					i +
					'" ' +
					(this.gestionCAS.idModeleConfig === lModele.idModeleConfig
						? "selected"
						: "") +
					">",
				lModele.libelle,
				"</option>",
			);
		}
		if (lModeleSelected === undefined || lModeleSelected === null) {
			lModeleSelected = this.tabModeles[0];
		}
		H.push("</select>");
		H.push(
			IE.jsx.str(
				"div",
				{ class: "InlineBlock AlignementMilieuVertical p-left-l" },
				IE.jsx.str("ie-btnicon", {
					"ie-model": "btnActualiserModeles",
					class: "bt-activable icon_refresh",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"pageParametrageCAS.hintActualiserModeles",
					),
				}),
			),
		);
		H.push("</div>");
		H.push(
			'<div class="Texte10 Espace">',
			lModeleSelected.description,
			"</div>",
		);
		if (lModeleSelected.urlDocumentation) {
			H.push(
				'<a class="Texte10 Espace" href="',
				lModeleSelected.urlDocumentation,
				'" target="_blank">',
				ObjetTraduction_1.GTraductions.getValeur("pageParametrageCAS.lienDoc"),
				"</a>",
			);
		}
		H.push("</td></tr>");
		return H.join("");
	}
	composeWarningParametresNonConformesAuModele() {
		const H = [];
		H.push(
			'<div class="Espace Gras AlignementMilieu" style="background-color:#E7E7E7">',
		);
		H.push(
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.msgWarnParametresPerso",
			),
			"</div>",
		);
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical">',
			'<ie-bouton ie-model="btnModele" title="',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.ActualiserListeENT",
			),
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"pageParametrageCAS.btnAppliquerModele",
			),
			"</ie-bouton>",
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	surSelectionModeleConfigENT(aIdModele) {
		if (aIdModele !== this.gestionCAS.idModeleConfig) {
			if (aIdModele === 0 || this._urlCASNonRenseigne()) {
				this.appliquerModeleConfigENT(
					aIdModele,
					Enumere_Action_1.EGenreAction.Valider,
				);
			} else {
				const lModele = this.tabModeles[this.getIndiceDuModele(aIdModele)];
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"pageParametrageCAS.confirmModifModele",
							[lModele.libelle],
						),
						callback: this.appliquerModeleConfigENT.bind(this, aIdModele),
					});
			}
		}
	}
}
exports.InterfaceParametrageCAS = InterfaceParametrageCAS;
