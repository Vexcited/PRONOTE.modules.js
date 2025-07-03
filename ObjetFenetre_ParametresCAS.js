exports.ObjetFenetre_ParametresCAS = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSGestionCAS_1 = require("WSGestionCAS");
const WSGestionCAS_2 = require("WSGestionCAS");
const WSGestionCAS_3 = require("WSGestionCAS");
const WSGestionCAS_4 = require("WSGestionCAS");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
var GenreChoixIdentifiantCommunCAS;
(function (GenreChoixIdentifiantCommunCAS) {
	GenreChoixIdentifiantCommunCAS[
		(GenreChoixIdentifiantCommunCAS["subject"] = 0)
	] = "subject";
	GenreChoixIdentifiantCommunCAS[
		(GenreChoixIdentifiantCommunCAS["login"] = 1)
	] = "login";
})(GenreChoixIdentifiantCommunCAS || (GenreChoixIdentifiantCommunCAS = {}));
class ObjetFenetre_ParametresCAS extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idSaisieAttributCAS = this.Nom + "_AttributCAS_";
		this.idSaisieCategories = this.Nom + "_inputSaisieCategories_";
		this.idComboMethodeIdentification =
			this.Nom + "_comboMethodeIdentification";
		this.idComboTypeDestinataire = this.Nom + "_comboTypeDestinataire";
		this.idEcran = this.Nom + "_EcranMI_";
		this.donneesRecues = false;
		const lTitreFenetre = [];
		lTitreFenetre.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center full-width" },
				IE.jsx.str(
					"div",
					{ class: "fluid-bloc" },
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametrageCAS.titreFenetreParametresCAS",
					),
				),
				IE.jsx.str("ie-btnimage", {
					class: "icon_question btnImageIcon mrfiche",
					"ie-model": this.jsxModeleBoutonMrFiche.bind(this),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"fenetreParametresCAS.titreMrFiche",
					),
				}),
			),
		);
		this.setOptionsFenetre({
			titre: lTitreFenetre.join(""),
			largeur: 750,
			avecScroll: true,
			hauteurMaxContenu: 380,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("pageParametrageCAS.annuler"),
				ObjetTraduction_1.GTraductions.getValeur("pageParametrageCAS.valider"),
			],
		});
		this.donneesFenetre = {
			hauteurContenuCAS: 360,
			ordreModePremiereConnexionCasSvcW: [
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
					.MPC_ChercherParIdentite,
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
					.MPC_ChercherParIdProduit,
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth,
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_RefuserAcces,
			],
			attributsCASOrdonnees: [
				WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_Nom,
				WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_Prenom,
				WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_DateNaissance,
				WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_CodePostal,
				WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_Categories,
			],
			avecParametresInactifs: () => {
				return false;
			},
			avec_ChercherIdParProduit: false,
			avecCorrespondances: true,
			avecAuthIdEtDouble: true,
			interdireModeDoubleAuthentification: false,
			messageInterdireModeDoubleAuthentification: "",
		};
	}
	jsxModeleBoutonMrFiche() {
		return {
			event: () => {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.MrFiche,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreParametresCAS.titreMrFiche",
						),
						message: ObjetTraduction_1.GTraductions.getValeur(
							"fenetreParametresCAS.msgMrFiche",
						),
					});
			},
		};
	}
	jsxModeleRadioIdentifiantCommun(aGenreIdentifiantCommun) {
		return {
			getValue: () => {
				let lEstChecked = false;
				if (aGenreIdentifiantCommun === GenreChoixIdentifiantCommunCAS.login) {
					lEstChecked = !!this.utiliserAttributLogin;
				} else {
					lEstChecked = !this.utiliserAttributLogin;
				}
				return lEstChecked;
			},
			setValue: (aValue) => {
				if (aGenreIdentifiantCommun === GenreChoixIdentifiantCommunCAS.login) {
					this.utiliserAttributLogin = aValue;
				} else {
					this.utiliserAttributLogin = !aValue;
				}
				const lAttributCAS = this.getAttributCASParGenre(
					WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_Login,
				);
				const lId = this._getIdSaisieAttributsCAS(lAttributCAS.genre);
				ObjetHtml_1.GHtml.setDisabled(
					lId,
					aGenreIdentifiantCommun !== GenreChoixIdentifiantCommunCAS.login,
				);
			},
			getName: () => {
				return `${this.Nom}_IdentifiantCommun`;
			},
			getDisabled: () => {
				return this.estParametresInactifs();
			},
		};
	}
	estParametresInactifs(aInactif = false) {
		return (
			this.estServeurActif() ||
			this.donneesFenetre.avecParametresInactifs() ||
			(aInactif !== null && aInactif !== undefined ? aInactif : false)
		);
	}
	getParametresSelonInactif(aInactif = false) {
		const lParamsInactifs = this.estParametresInactifs(aInactif);
		return {
			actif: lParamsInactifs ? "disabled" : "",
			curseur: lParamsInactifs ? "SansMain" : "AvecMain",
		};
	}
	setDonneesFenetreParametresCAS(aDonneesFenetre) {
		Object.assign(this.donneesFenetre, aDonneesFenetre);
	}
	surEntreeAffichage(aDonnees, aFonctionServeurActif) {
		this.utiliserAttributLogin = aDonnees.utiliserAttributLogin;
		this.modePremiereConnexion = aDonnees.modePremiereConnexion;
		this.attributsCAS = aDonnees.attributsCAS;
		this.correspEspaceCategories = aDonnees.correspEspaceCategories;
		this.donneesRecues = true;
		this.estServeurActif = aFonctionServeurActif;
		this.setBoutonActif(
			ObjetFenetre_ParametresCAS.TypeEvenementsFenetreParametresCAS.valider,
			!this.estServeurActif(),
		);
		this.afficher();
		this.actualiser();
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "MargeDroit" },
					this.composeChoixIdentifiantCommun(),
				),
				IE.jsx.str(
					"div",
					{ class: "MargeDroit" },
					this.composeGroupBox1ereConnexion(),
				),
			),
		);
		return H.join("");
	}
	composeChoixIdentifiantCommun() {
		const H = [];
		if (this.donneesRecues) {
			H.push(
				'<fieldset class="Espace AlignementGauche" style="border:1px solid ',
				(0, AccessApp_1.getApp)().getCouleur().intermediaire,
				';">',
			);
			H.push(
				IE.jsx.str(
					"legend",
					{
						class: "Gras Espace",
						style: { color: (0, AccessApp_1.getApp)().getCouleur().texte },
					},
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreParametresCAS.lblGroupBoxIdCommun",
						),
					),
				),
			);
			const lAttributCAS = this.getAttributCASParGenre(
				WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_Login,
			);
			const lIdRadioIdentifiantLogin = "radioIdentifiantCommunLogin";
			H.push(
				IE.jsx.str(
					"table",
					{ class: "Espace" },
					IE.jsx.str(
						"tr",
						null,
						IE.jsx.str(
							"td",
							{ style: "width:270px;" },
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioIdentifiantCommun.bind(
										this,
										GenreChoixIdentifiantCommunCAS.subject,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"fenetreParametresCAS.idSubject",
								),
							),
						),
						IE.jsx.str(
							"td",
							null,
							IE.jsx.str(
								"ie-radio",
								{
									id: "lIdRadioIdentifiantLogin",
									"ie-model": this.jsxModeleRadioIdentifiantCommun.bind(
										this,
										GenreChoixIdentifiantCommunCAS.login,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"fenetreParametresCAS.idAttribut",
								),
							),
						),
						IE.jsx.str(
							"td",
							{ class: "Espace" },
							this.composeZoneSaisieAttributCAS(
								lAttributCAS,
								lIdRadioIdentifiantLogin,
								!this.utiliserAttributLogin,
							),
						),
					),
				),
			);
			H.push("</fieldset>");
		}
		return H.join("");
	}
	composeGroupBox1ereConnexion() {
		const H = [];
		if (this.donneesRecues) {
			H.push(
				IE.jsx.str(
					"fieldset",
					{
						class: "Espace AlignementGauche",
						style: {
							height: "100%",
							border:
								"1px solid " +
								(0, AccessApp_1.getApp)().getCouleur().intermediaire,
						},
					},
					IE.jsx.str(
						"legend",
						{
							class: "Gras Espace",
							style: { color: (0, AccessApp_1.getApp)().getCouleur().texte },
						},
						IE.jsx.str(
							"label",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"fenetreParametresCAS.lblGroupBoxPremiereConnexion",
							),
						),
					),
					this.composeComboMethodeIdentification(),
					this.composeEcransMethodeIdentification(),
				),
			);
		}
		return H.join("");
	}
	composeComboMethodeIdentification() {
		const H = [];
		const p = this.getParametresSelonInactif();
		H.push(
			'<select style="width:450px;" class="Texte10 Gras ' +
				p.curseur +
				'" id="' +
				this.idComboMethodeIdentification +
				'" onchange="',
			this.Nom,
			'.surOnChangeComboMethodeIdentification()" ' + p.actif + ">",
		);
		H.push(this._remplirSelectMethideIdentification());
		H.push("</select>");
		return H.join("");
	}
	surOnChangeComboMethodeIdentification() {
		for (
			let i = 0;
			i < this.donneesFenetre.ordreModePremiereConnexionCasSvcW.length;
			i++
		) {
			const lVisible =
				ObjetHtml_1.GHtml.getElement(this.idComboMethodeIdentification)
					.selectedIndex === i;
			ObjetStyle_1.GStyle.setDisplay(
				this.idEcran +
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW[
						this.donneesFenetre.ordreModePremiereConnexionCasSvcW[i]
					],
				lVisible,
			);
		}
	}
	composeIdentificationChercherIdParProduit() {
		const lIdLabelAttributCas = "attributcas_" + GUID_1.GUID.getId();
		const H = [];
		H.push(
			'<div id="' +
				this.idEcran +
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
					.MPC_ChercherParIdProduit +
				'" style="' +
				(this.modePremiereConnexion ===
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
					.MPC_ChercherParIdProduit
					? ""
					: "display:none") +
				'">',
		);
		H.push("<table>");
		H.push("<tr>");
		H.push(
			'<td id="',
			lIdLabelAttributCas,
			'">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreParametresCAS.attributCAS." +
						WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_IdProduit,
				) +
				"</td>",
		);
		H.push(
			'<td class="Espace">' +
				this.composeZoneSaisieAttributCAS(
					this.getAttributCASParGenre(
						WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_IdProduit,
					),
					lIdLabelAttributCas,
				) +
				"</td>",
		);
		H.push("</tr>");
		H.push("</table>");
		H.push("</div>");
		return H.join("");
	}
	composeEcransMethodeIdentification() {
		const H = [];
		H.push('<div class="Espace">');
		H.push(
			'<div id="' +
				this.idEcran +
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
					.MPC_ChercherParIdentite +
				'" style="' +
				(this.modePremiereConnexion ===
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_ChercherParIdentite
					? ""
					: "display:none") +
				'">' +
				this.composeEcranIdentiteUtilisateur() +
				"</div>",
		);
		if (this.donneesFenetre.avec_ChercherIdParProduit) {
			H.push(this.composeIdentificationChercherIdParProduit());
		}
		H.push(
			'<div id="' +
				this.idEcran +
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth +
				'" style="' +
				(this.modePremiereConnexion ===
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth
					? ""
					: "display:none") +
				'">' +
				this.composeEcranViaPageConnexion() +
				"</div>",
		);
		H.push(
			'<div id="' +
				this.idEcran +
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_RefuserAcces +
				'" style="' +
				(this.modePremiereConnexion ===
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_RefuserAcces
					? ""
					: "display:none") +
				'">' +
				this.composeEcranRefuserSelonIdentifiantCAS() +
				"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	composeEcranIdentiteUtilisateur() {
		const H = [];
		H.push('<div class="Texte10">', this.composeAttributsCAS(), "</div>");
		if (this.donneesFenetre.avecCorrespondances) {
			H.push('<div class="Texte10">', this.composeCorrespondances(), "</div>");
		}
		return H.join("");
	}
	composeCorrespondances() {
		const H = [];
		if (this.donneesRecues) {
			H.push(
				'<fieldset class="Espace AlignementGauche Texte10" style="border:1px solid ',
				(0, AccessApp_1.getApp)().getCouleur().intermediaire,
				';">',
			);
			H.push(
				'<legend class="Gras Espace" style="color:',
				(0, AccessApp_1.getApp)().getCouleur().texte,
				';">',
			);
			H.push(
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreParametresCAS.titreCorrespondances",
					[
						this.getAttributCASParGenre(
							WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW.AUC_Categories,
						).nom,
					],
				),
				"</label>",
			);
			H.push("</legend>");
			H.push('<table class="Texte10 full-width">');
			const lNbr = this.correspEspaceCategories.length;
			for (let i = 0; i < lNbr; i++) {
				const lIdLabel = "idLblCorrespondanceEsp_" + i;
				const lCorresp = this.correspEspaceCategories[i];
				H.push("<tr>");
				H.push(
					'<td style="width:200px;" class="EspaceDroit AlignementDroit">',
					'<label id="',
					lIdLabel,
					'">',
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreParametresCAS.espace." + lCorresp.espace,
					),
					"</label>",
					"</td>",
				);
				H.push(
					'<td class="EspaceGauche PetitEspaceBas GrandEspaceDroit">',
					this.composeZoneSaisie(
						this._getIdSaisieCategories(lCorresp.espace),
						lCorresp.categories,
						lIdLabel,
					),
					"</td>",
				);
				H.push("</tr>");
			}
			H.push("</table>");
			H.push("</fieldset>");
		}
		return H.join("");
	}
	_getIdSaisieCategories(aEspace) {
		return this.idSaisieCategories + aEspace;
	}
	composeEcranViaPageConnexion() {
		return "";
	}
	composeEcranRefuserSelonIdentifiantCAS() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"fenetreParametresCAS.lblRefuser",
		);
	}
	composeAttributsCAS() {
		const H = [];
		if (this.donneesRecues) {
			H.push(
				'<fieldset class="Espace AlignementGauche Texte10" style="border:1px solid ',
				(0, AccessApp_1.getApp)().getCouleur().intermediaire,
				';">',
			);
			H.push(
				'<legend class="Gras Espace" style="color:',
				(0, AccessApp_1.getApp)().getCouleur().texte,
				';">',
			);
			H.push(
				"<label>",
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreParametresCAS.titreAttributsCAS",
				),
				"</label>",
			);
			H.push("</legend>");
			H.push('<table class="Texte10">');
			const T = this.donneesFenetre.attributsCASOrdonnees;
			for (let i = 0; i < T.length; i++) {
				if (i % 2 === 0) {
					H.push("<tr>");
				}
				const lIdLabelAttributCas = GUID_1.GUID.getId();
				H.push(
					'<td style="width:10px;" class="EspaceGauche" id="',
					lIdLabelAttributCas,
					'">',
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetreParametresCAS.attributCAS",
						)[T[i]],
					),
					"</td>",
				);
				H.push(
					'<td style="width:120px;" class="GrandEspaceDroit PetitEspaceBas EspaceGauche">',
					this.composeZoneSaisieAttributCAS(
						this.getAttributCASParGenre(T[i]),
						lIdLabelAttributCas,
					),
					"</td>",
				);
				if (i % 2 === 1 || i === T.length - 1) {
					H.push("</tr>");
				}
			}
			H.push("</table>");
			H.push("</fieldset>");
		}
		return H.join("");
	}
	composeZoneSaisieAttributCAS(aAttributCAS, aIdLabelledBy, aInactif = false) {
		return this.composeZoneSaisie(
			this._getIdSaisieAttributsCAS(aAttributCAS.genre),
			aAttributCAS.nom,
			aIdLabelledBy,
			aInactif,
		);
	}
	_getIdSaisieAttributsCAS(aGenreAttribut) {
		return this.idSaisieAttributCAS + aGenreAttribut;
	}
	getAttributCASParGenre(aGenre) {
		for (let i = 0; i < this.attributsCAS.length; i++) {
			const lAttributCAS = this.attributsCAS[i];
			if (lAttributCAS.genre === aGenre) {
				return lAttributCAS;
			}
		}
		return null;
	}
	composeZoneSaisie(aId, aContenu, aIdLabelledBy, aInactif = false) {
		const H = [];
		const p = this.getParametresSelonInactif(aInactif);
		H.push(
			'<input id="' +
				aId +
				'" aria-labelledby="' +
				aIdLabelledBy +
				'" onkeyup="' +
				this.Nom +
				'.surEvenementKeyUp()" class="Texte10 EspaceGauche ' +
				p.curseur +
				'" style="width:100%; ',
			ObjetStyle_1.GStyle.composeCouleurBordure(
				(0, AccessApp_1.getApp)().getCouleur().noir,
			),
			'" type="text" value="' + aContenu + '" ' + p.actif + "></input>",
		);
		return H.join("");
	}
	surEvenementKeyUp() {
		if (ObjetNavigateur_1.Navigateur.isToucheRetourChariot()) {
			this.setBoutonFocus(0);
		}
	}
	verifierSaisieCorrecte(aDonnees) {
		const lResult = { estCorrect: true, msgErreur: "" };
		if (
			this.donneesFenetre.interdireModeDoubleAuthentification &&
			aDonnees.modePremiereConnexion ===
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth
		) {
			lResult.estCorrect = false;
			lResult.msgErreur =
				this.donneesFenetre.messageInterdireModeDoubleAuthentification;
		}
		return lResult;
	}
	surValidation(aNumeroBouton) {
		let lFermer = true;
		switch (aNumeroBouton) {
			case ObjetFenetre_ParametresCAS.TypeEvenementsFenetreParametresCAS
				.valider: {
				const lDonnees = this.initDonnees();
				const lVerif = this.verifierSaisieCorrecte(lDonnees);
				if (lVerif.estCorrect) {
					this.callback.appel(aNumeroBouton, lDonnees);
				} else {
					(0, AccessApp_1.getApp)()
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: lVerif.msgErreur,
						});
					lFermer = false;
				}
				break;
			}
			case ObjetFenetre_ParametresCAS.TypeEvenementsFenetreParametresCAS
				.annuler:
			case ObjetFenetre_ParametresCAS.TypeEvenementsFenetreParametresCAS.fermer:
				this.callback.appel(aNumeroBouton);
				break;
			default:
				break;
		}
		if (lFermer !== false) {
			this.fermer();
		}
	}
	initDonnees() {
		const lTabAttributs = [];
		for (let i in WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW) {
			const lGenreAttribut = WSGestionCAS_1.ETypeAttributUtilisateurCASSvcW[i];
			const lHtmlInputElement = ObjetHtml_1.GHtml.getElement(
				this._getIdSaisieAttributsCAS(lGenreAttribut),
			);
			lTabAttributs.push(
				new WSGestionCAS_4.TAttributCAS(
					lGenreAttribut,
					lHtmlInputElement ? lHtmlInputElement.value : "",
				),
			);
		}
		const lTabCorrespEspaceCategories = [];
		const lNbr = this.correspEspaceCategories.length;
		for (let i = 0; i < lNbr; i++) {
			const lCorresp = this.correspEspaceCategories[i];
			const lHtmlInputElement = ObjetHtml_1.GHtml.getElement(
				this._getIdSaisieCategories(lCorresp.espace),
			);
			lTabCorrespEspaceCategories.push(
				new WSGestionCAS_3.TCorrespEspaceCategories(
					lCorresp.espace,
					lHtmlInputElement.value,
				),
			);
		}
		const lHtmlComboElem = ObjetHtml_1.GHtml.getElement(
			this.idComboMethodeIdentification,
		);
		return {
			utiliserAttributLogin: this.utiliserAttributLogin,
			modePremiereConnexion:
				this.donneesFenetre.ordreModePremiereConnexionCasSvcW[
					lHtmlComboElem.selectedIndex
				],
			attributsCAS: lTabAttributs,
			correspEspaceCategories: lTabCorrespEspaceCategories,
		};
	}
	_remplirSelectMethideIdentification() {
		const H = [];
		if (
			this.donneesFenetre.ordreModePremiereConnexionCasSvcW.includes(
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
					.MPC_ChercherParIdentite,
			)
		) {
			H.push(
				'<option value="' +
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
						.MPC_ChercherParIdentite +
					'" ' +
					(this.modePremiereConnexion ===
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
						.MPC_ChercherParIdentite
						? "selected"
						: "") +
					">",
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreParametresCAS.combo1ereConnexion0",
				),
				"</option>",
			);
		}
		if (this.donneesFenetre.avecAuthIdEtDouble) {
			if (
				this.donneesFenetre.ordreModePremiereConnexionCasSvcW.includes(
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
						.MPC_ChercherParIdProduit,
				)
			) {
				H.push(
					'<option value="' +
						WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
							.MPC_ChercherParIdProduit +
						'" ' +
						(this.modePremiereConnexion ===
						WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW
							.MPC_ChercherParIdProduit
							? "selected"
							: "") +
						">",
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreParametresCAS.combo1ereConnexion1",
					),
					"</option>",
				);
			}
			if (
				this.donneesFenetre.ordreModePremiereConnexionCasSvcW.includes(
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth,
				)
			) {
				H.push(
					'<option value="' +
						WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth +
						'" ' +
						(this.modePremiereConnexion ===
						WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_DoubleAuth
							? "selected"
							: "") +
						">",
					ObjetTraduction_1.GTraductions.getValeur(
						"fenetreParametresCAS.combo1ereConnexion2",
					),
					"</option>",
				);
			}
		}
		if (
			this.donneesFenetre.ordreModePremiereConnexionCasSvcW.includes(
				WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_RefuserAcces,
			)
		) {
			H.push(
				'<option value="' +
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_RefuserAcces +
					'" ' +
					(this.modePremiereConnexion ===
					WSGestionCAS_2.ETypeModePremiereConnexionCasSvcW.MPC_RefuserAcces
						? "selected"
						: "") +
					">",
				ObjetTraduction_1.GTraductions.getValeur(
					"fenetreParametresCAS.combo1ereConnexion3",
				),
				"</option>",
			);
		}
		return H.join("");
	}
}
exports.ObjetFenetre_ParametresCAS = ObjetFenetre_ParametresCAS;
(function (ObjetFenetre_ParametresCAS) {
	let TypeEvenementsFenetreParametresCAS;
	(function (TypeEvenementsFenetreParametresCAS) {
		TypeEvenementsFenetreParametresCAS[
			(TypeEvenementsFenetreParametresCAS["annuler"] = 0)
		] = "annuler";
		TypeEvenementsFenetreParametresCAS[
			(TypeEvenementsFenetreParametresCAS["valider"] = 1)
		] = "valider";
		TypeEvenementsFenetreParametresCAS[
			(TypeEvenementsFenetreParametresCAS["fermer"] = -1)
		] = "fermer";
	})(
		(TypeEvenementsFenetreParametresCAS =
			ObjetFenetre_ParametresCAS.TypeEvenementsFenetreParametresCAS ||
			(ObjetFenetre_ParametresCAS.TypeEvenementsFenetreParametresCAS = {})),
	);
})(
	ObjetFenetre_ParametresCAS ||
		(exports.ObjetFenetre_ParametresCAS = ObjetFenetre_ParametresCAS = {}),
);
