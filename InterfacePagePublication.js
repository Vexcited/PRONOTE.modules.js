exports.TraductionsNomsEspaceConsoleHttpCP = exports.InterfacePagePublication =
	void 0;
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_Statut_1 = require("Enumere_Statut");
const Evenement_1 = require("Evenement");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetComposeHtml_1 = require("ObjetComposeHtml");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSPublicationServeurHttp_1 = require("WSPublicationServeurHttp");
const AppelSOAP_1 = require("AppelSOAP");
const AccessApp_1 = require("AccessApp");
const ObjetTraduction_2 = require("ObjetTraduction");
const TradInterfacePagePublication =
	ObjetTraduction_2.TraductionsModule.getModule("InterfacePagePublication", {
		publierEspace: "",
		publierMobile: "",
		parametresDePublication: "",
		utilisateursConnectes: "",
		utilisateurConnecte: "",
	});
class InterfacePagePublication extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
		this.adresse =
			this.objetApplicationConsoles.etatServeurHttp.getAdressePublique()
				? this.objetApplicationConsoles.etatServeurHttp.getAdressePublique()
				: "";
		this.idParametresPublication = this.Nom + "_ParametresPublication";
		this.messagesEvenements =
			this.objetApplicationConsoles.msgEvnts.getMessagesUnite(
				"InterfacePagePublication.js",
			);
		this.autoriserAnciennesVersionsTLS = false;
	}
	construireStructureAffichage() {
		const H = [];
		if (this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur()) {
			H.push(
				'<table class="Texte10 Espace FondBlanc full-width" role="presentation">',
			);
			if (
				this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true
			) {
				H.push(
					'<tr><td class="Gras AlignementMilieu EspaceBas">',
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametrageCAS.labelArreterPublicationPourModifierParametres",
					),
					"</td></tr>",
				);
			}
			H.push(
				IE.jsx.str(
					"tr",
					null,
					IE.jsx.str(
						"td",
						null,
						IE.jsx.str(
							"table",
							{ class: "Texte10 EspaceBas full-width", role: "presentation" },
							IE.jsx.str(
								"tr",
								null,
								IE.jsx.str(
									"td",
									null,
									ObjetComposeHtml_1.ObjetComposeHtml.bandeauConsole(
										TradInterfacePagePublication.parametresDePublication,
									),
								),
							),
							IE.jsx.str(
								"tr",
								null,
								IE.jsx.str("td", null, this.composeParametresPublication()),
							),
						),
					),
				),
			);
			H.push("</table>");
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
	jsxModelCheckboxPublierEspace(aIdentifiant, aTypeEspace) {
		return {
			getValue: () => {
				const lEspaceConcerne = this.getEspaceConcerne(aIdentifiant);
				return lEspaceConcerne ? lEspaceConcerne.getPublie() : false;
			},
			setValue: (aValeur) => {
				const lEspaceConcerne = this.getEspaceConcerne(aIdentifiant);
				if (lEspaceConcerne) {
					lEspaceConcerne.setPublie(aValeur);
					this.surChangementPublicationDEspace(
						aIdentifiant,
						aTypeEspace,
						aValeur,
					);
				}
			},
			getDisabled: () => {
				return (
					this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true
				);
			},
		};
	}
	getEspaceConcerne(aIdentifiant) {
		return this.objetApplicationConsoles.etatServeurHttp.getEspaceDIdentifiant(
			aIdentifiant,
		);
	}
	recupererDonnees() {
		AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortClientsHttp",
			methode: "GetAutoriserAnciennesVersionsTLS",
		}).then((aDonnees) => {
			this.autoriserAnciennesVersionsTLS = aDonnees
				.getElement("return")
				.getValeur();
		});
	}
	composeUrlPersonnalise(
		aEspace,
		aAvecPersonnalisation,
		aNbLignes,
		aBordureBas,
	) {
		return "";
	}
	unSeulBoutonPublie() {
		return true;
	}
	composerPublication(aTitre, aAvecSeparateur, aTableauEspaces) {
		const H = [];
		let lPersonnalisationVisible = false;
		for (let j = 0; j < aTableauEspaces.length; j++) {
			if (aTableauEspaces[j].publie) {
				lPersonnalisationVisible = true;
			}
		}
		const lUnSeulBoutonPublie = this.unSeulBoutonPublie();
		const lAvecFusionLigneBouton =
			lUnSeulBoutonPublie && aTableauEspaces.length > 1;
		let lIndexBoucle = 0;
		for (let j = 0; j < aTableauEspaces.length; j++) {
			const lEspace = aTableauEspaces[j];
			lIndexBoucle++;
			const lBordureVisible =
				"border-bottom : 1px solid " +
				(0, AccessApp_1.getApp)().getCouleur().bandeau.fond +
				";";
			const lBordureTransparente = "border-bottom : 1px solid transparent;";
			const lBordureBas =
				aAvecSeparateur && lIndexBoucle === aTableauEspaces.length
					? lBordureVisible
					: lBordureTransparente;
			const lCelluleTitreEspace = [];
			if (lIndexBoucle === 1) {
				lCelluleTitreEspace.push(
					IE.jsx.str(
						"td",
						{ style: "width:160px;", class: "Gras Texte11" },
						aTitre,
					),
				);
			} else {
				lCelluleTitreEspace.push(IE.jsx.str("td", null, "\u00A0"));
			}
			const lStyleCellulePublicationEspace = ["width: 150px;"];
			if (lAvecFusionLigneBouton && aAvecSeparateur) {
				lStyleCellulePublicationEspace.push(lBordureVisible);
			} else {
				lStyleCellulePublicationEspace.push(lBordureBas);
			}
			const lTraductionPublier =
				lEspace.genreTerminal ===
				WSPublicationServeurHttp_1.ETypeGenreTerminal.GT_StationTravail
					? TradInterfacePagePublication.publierEspace
					: TradInterfacePagePublication.publierMobile;
			const lCellulePublicationEspace = [];
			if (!lUnSeulBoutonPublie || j === 0) {
				lCellulePublicationEspace.push(
					IE.jsx.str(
						"td",
						{
							style: lStyleCellulePublicationEspace.join(""),
							rowspan: aTableauEspaces.length,
						},
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModelCheckboxPublierEspace.bind(
									this,
									lEspace.identifiant,
									lEspace.typeEspace,
								),
							},
							lTraductionPublier,
						),
					),
				);
			}
			const lStyleCelluleUrlAccesEspace = ["width:500px;", lBordureBas];
			const lClassCelluleUrlAccesEspace = ["Italique"];
			const lAdresseEspace = lEspace.getPublie()
				? this.adresse
					? ObjetChaine_1.GChaine.composeUrlRequete({
							url: this.adresse,
							nomRequete: lEspace.url,
						})
					: lEspace.url
				: "";
			const lCelluleUrlAccesEspace = [];
			lCelluleUrlAccesEspace.push(
				IE.jsx.str(
					"td",
					{
						style: lStyleCelluleUrlAccesEspace.join(""),
						class: lClassCelluleUrlAccesEspace.join(" "),
					},
					this.estUnLien(lEspace)
						? IE.jsx.str(
								"a",
								{
									href: lEspace.getPublie()
										? ObjetChaine_1.GChaine.composeUrlRequete({
												url: this.adresse,
												nomRequete: lEspace.getUrl(),
											})
										: "",
									target: "_blank",
									class: "LienConsole AvecSelectionTexte Italique",
								},
								ObjetChaine_1.GChaine.avecEspaceSiVide(lAdresseEspace),
							)
						: ObjetChaine_1.GChaine.avecEspaceSiVide(lAdresseEspace),
				),
			);
			const lNbUtilisateursConnectes =
				this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
					? lEspace.nbUtilisateursConnectes
					: 0;
			const lTraducUtilisateursConnectes = lEspace.getPublie()
				? lNbUtilisateursConnectes +
					(lNbUtilisateursConnectes > 1
						? TradInterfacePagePublication.utilisateursConnectes
						: TradInterfacePagePublication.utilisateurConnecte)
				: "&nbsp;";
			const lStyleCelluleUtilisateursConnectes = ["width:200px;", lBordureBas];
			const lCelluleUtilisateursConnectes = [];
			if (lNbUtilisateursConnectes > 0) {
				lCelluleUtilisateursConnectes.push(
					IE.jsx.str(
						"td",
						{ style: lStyleCelluleUtilisateursConnectes.join("") },
						lTraducUtilisateursConnectes,
					),
				);
			} else {
				lCelluleUtilisateursConnectes.push(
					IE.jsx.str(
						"td",
						{ style: lStyleCelluleUtilisateursConnectes.join("") },
						"\u00A0",
					),
				);
			}
			H.push(
				IE.jsx.str(
					"tr",
					{ class: "EspaceHaut PetitEspaceBas", style: "height:30px;" },
					lCelluleTitreEspace.join(""),
					lCellulePublicationEspace.join(""),
					lCelluleUrlAccesEspace.join(""),
					this.composeUrlPersonnalise(
						lEspace,
						lPersonnalisationVisible && j === 0,
						aTableauEspaces.length,
						aAvecSeparateur ? lBordureVisible : lBordureTransparente,
					),
					lCelluleUtilisateursConnectes.join(""),
				),
			);
		}
		return H.join("");
	}
	composeParametresPublication() {
		const H = [];
		H.push('<div id="', this.idParametresPublication, '">');
		H.push('<table class="m-top">');
		let lTypeEspace = "";
		let lTabEspacesRegroupes = [];
		const lTabListeEspaces =
			this.objetApplicationConsoles.etatServeurHttp.getListeEspaces();
		let lTraducEspace = "";
		for (const lObjEspace of lTabListeEspaces) {
			if (lObjEspace.typeEspace !== lTypeEspace) {
				if (lTabEspacesRegroupes.length > 0) {
					H.push(
						this.composerPublication(lTraducEspace, true, lTabEspacesRegroupes),
					);
				}
				lTypeEspace = lObjEspace.typeEspace;
				lTabEspacesRegroupes = [];
				lTraducEspace = exports.TraductionsNomsEspaceConsoleHttpCP.get(
					lObjEspace.identifiant,
				);
			}
			lTabEspacesRegroupes.push(lObjEspace);
		}
		if (lTabEspacesRegroupes.length > 0) {
			H.push(
				this.composerPublication(lTraducEspace, false, lTabEspacesRegroupes),
			);
		}
		H.push("</table>");
		H.push("</div>");
		return H.join("");
	}
	estUnLien(aEspace) {
		return (
			this.objetApplicationConsoles.etatServeurHttp.getConnecteAuServeur() &&
			aEspace.publie === true &&
			this.adresse !== "" &&
			this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
		);
	}
	surChangementPublicationDEspace(aIdentifiantEspace, aTypeEspace, aEstPublie) {
		const aEspace =
			this.objetApplicationConsoles.etatServeurHttp.getEspaceDIdentifiant(
				aIdentifiantEspace,
			);
		const aEspaces =
			this.objetApplicationConsoles.etatServeurHttp.getEspacesDeType(
				aTypeEspace,
			);
		const lIdentifiantEspaceConcerne = aEspace.identifiant;
		aEspaces.forEach((aElement) => {
			if (!!aElement) {
				aElement.publie = aEstPublie;
			}
		});
		const lParam = {
			webService: this.objetApplicationConsoles.WS_adminServeur,
			port: "PortPublicationServeurHttp",
			methode: "SetPublicationEspace",
		};
		const lCommunication = this.objetApplicationConsoles.getCommunicationSOAP();
		const lAppelDistant = new AppelMethodeDistante_1.AppelMethodeDistante(
			lCommunication.webServices,
			lParam,
		);
		lAppelDistant
			.getParametres()
			.getElement("AIdentifiantEspace")
			.setValeur(aEspace.identifiant);
		lAppelDistant
			.getParametres()
			.getElement("APublication")
			.setValeur(aEstPublie);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.objetApplicationConsoles.creerCallbackSOAP(
				this,
				this.callbackSurOnclickCBEspace.bind(
					this,
					lIdentifiantEspaceConcerne,
					aEstPublie,
				),
			),
		);
	}
	callbackSurOnclickCBEspace(
		aIdentifiantEspaceConcerne,
		aEtatCocheEspaceConcerne,
	) {
		try {
			this.objetApplicationConsoles.etatServeurHttp.setPublieEspace(
				aIdentifiantEspaceConcerne,
				aEtatCocheEspaceConcerne,
			);
			this.initialiser(true);
		} catch (e) {
			const lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.objetApplicationConsoles.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"callbackSurOnclickCBEspace",
					lMessage,
				),
			);
		}
	}
}
exports.InterfacePagePublication = InterfacePagePublication;
let uTradsEspaces = {};
exports.TraductionsNomsEspaceConsoleHttpCP = {
	get(aCle) {
		const lTrad =
			uTradsEspaces === null || uTradsEspaces === void 0
				? void 0
				: uTradsEspaces[aCle];
		return lTrad || "";
	},
	setTraductions(aTrad) {
		uTradsEspaces = aTrad;
	},
};
