exports.InterfacePagePublication = void 0;
const AppelMethodeDistante_1 = require("AppelMethodeDistante");
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_Statut_1 = require("Enumere_Statut");
const Evenement_1 = require("Evenement");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetComposeHtml_1 = require("ObjetComposeHtml");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const WSPublicationServeurHttp_1 = require("WSPublicationServeurHttp");
const AppelSOAP_1 = require("AppelSOAP");
class InterfacePagePublication extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = GApplication;
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
			H.push('<table class="Texte10 Espace FondBlanc full-width">');
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
				"<tr><td>",
				'<table class="Texte10 EspaceBas full-width">',
				"<tr><td>",
				ObjetComposeHtml_1.ObjetComposeHtml.bandeauConsole(
					ObjetTraduction_1.GTraductions.getValeur(
						"pageParametresPublication.parametresDePublication",
					),
				),
				"</td></tr>",
				"<tr><td>",
				this.composeParametresPublication(),
				"</td></tr>",
				"</table>",
				"</td></tr>",
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
	recupererDonnees() {
		AppelSOAP_1.AppelSOAP.lancerAppel({
			instance: this,
			port: "PortClientsHttp",
			methode: "GetAutoriserAnciennesVersionsTLS",
		}).then((aDonnees) => {
			this.autoriserAnciennesVersionsTLS = aDonnees.getElement("return").valeur;
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
		let lCmp = 0;
		const H = [];
		const lCBInactif =
			this.objetApplicationConsoles.etatServeurHttp.getEtatActif() === true;
		const lCBDisable = lCBInactif ? " disabled" : "",
			lClassCB = lCBInactif ? "" : " AvecMain",
			lStyleTexteCB = lCBInactif
				? 'style="' + ObjetStyle_1.GStyle.composeCouleurTexte("gray") + '"'
				: "";
		let lPersonnalisationVisible = false,
			lUnSeulBoutonPublie = false,
			lAvecFusionLigneBouton;
		for (let j = 0; j < aTableauEspaces.length; j++) {
			if (aTableauEspaces[j].publie) {
				lPersonnalisationVisible = true;
			}
		}
		for (let j = 0; j < aTableauEspaces.length; j++) {
			const lEspace = aTableauEspaces[j];
			lCmp++;
			if (j === 0) {
				lUnSeulBoutonPublie = this.unSeulBoutonPublie();
			}
			const lNbUtilisateursConnectes =
				this.objetApplicationConsoles.etatServeurHttp.getEtatActif()
					? lEspace.nbUtilisateursConnectes
					: 0;
			const lTraducUtilisateursConnectes =
				lEspace.publie === true
					? lNbUtilisateursConnectes +
						(lNbUtilisateursConnectes > 1
							? ObjetTraduction_1.GTraductions.getValeur(
									"pageParametresPublication.utilisateursConnectes",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"pageParametresPublication.utilisateurConnecte",
								))
					: "&nbsp;";
			const lEspaceChecked = lEspace.publie === true ? "checked" : "";
			const lAdresseEspace =
				lEspace.publie === true
					? this.adresse
						? ObjetChaine_1.GChaine.composeUrlRequete({
								url: this.adresse,
								nomRequete: lEspace.url,
							})
						: lEspace.url
					: "";
			const lClassLien = this.estUnLien(lEspace)
				? "LienConsole Italique AvecSelectionTexte"
				: "Italique";
			const lBordureVisible =
					" border-bottom : 1px solid " + GCouleur.bandeau.fond + ";",
				lBordureTransparente = "border-bottom : 1px solid transparent;",
				lBordureBas =
					aAvecSeparateur && lCmp === aTableauEspaces.length
						? lBordureVisible
						: lBordureTransparente;
			const lEspaceBas = "EspaceHaut PetitEspaceBas";
			const lTraducPublier =
				lEspace.genreTerminal ===
				WSPublicationServeurHttp_1.ETypeGenreTerminal.GT_StationTravail
					? ObjetTraduction_1.GTraductions.getValeur(
							"pageParametresPublication.publierEspace",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"pageParametresPublication.publierMobile",
						);
			const lIdent = "'" + lEspace.identifiant + "'";
			const lParamType = "'" + lEspace.typeEspace + "'";
			H.push('<tr class="' + lEspaceBas + '" style="height:30px;">');
			H.push(
				lCmp === 1
					? '<td style="width:160px;" class="Gras Texte11">' + aTitre + "</td>"
					: "<td>&nbsp;</td>",
			);
			lAvecFusionLigneBouton =
				lUnSeulBoutonPublie && aTableauEspaces.length > 1;
			if (!lUnSeulBoutonPublie || j === 0) {
				H.push(
					"<td ",
					lCBInactif
						? ""
						: ' onclick="' +
								this.Nom +
								".surOnclickCBEspace (" +
								lIdent +
								"," +
								lParamType +
								')"',
					' style="width:150px;' +
						(lAvecFusionLigneBouton && aAvecSeparateur
							? lBordureVisible
							: lBordureBas) +
						'"',
					lAvecFusionLigneBouton
						? ' rowspan="' + aTableauEspaces.length + '"'
						: "",
					">",
					'<input id="' +
						this.Nom +
						"_Espace_" +
						lEspace.identifiant +
						'" class="',
					lClassCB,
					'" type="checkbox" ' + lEspaceChecked + lCBDisable + "></input>",
					'<span class="Texte10 ',
					lClassCB,
					'" ',
					lStyleTexteCB,
					">",
					lTraducPublier,
					"</span></td>",
				);
			}
			H.push(
				'<td style="width:500px;' +
					lBordureBas +
					'" class="' +
					lClassLien +
					'" onclick="' +
					this.Nom +
					".surOnclickLienAccesEspace(" +
					lIdent +
					')">',
				ObjetChaine_1.GChaine.avecEspaceSiVide(lAdresseEspace),
				"</td>",
			);
			H.push(
				this.composeUrlPersonnalise(
					lEspace,
					lPersonnalisationVisible && j === 0,
					aTableauEspaces.length,
					aAvecSeparateur ? lBordureVisible : lBordureTransparente,
				),
			);
			H.push(
				lNbUtilisateursConnectes > 0
					? '<td style="width:200px;" style="' +
							lBordureBas +
							'">' +
							lTraducUtilisateursConnectes +
							"</td>"
					: '<td  style="width:200px;' + lBordureBas + '">&nbsp;</td>',
			);
			H.push("</tr>");
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
				lTraducEspace = ObjetTraduction_1.GTraductions.getValeur(
					"pageParametresPublication." + lObjEspace.identifiant,
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
	surOnclickLienAccesEspace(aIdentifiantEspace) {
		const aEspace =
			this.objetApplicationConsoles.etatServeurHttp.getEspaceDIdentifiant(
				aIdentifiantEspace,
			);
		if (aEspace && this.estUnLien(aEspace)) {
			const lAdresseEspace =
				aEspace.publie === true
					? ObjetChaine_1.GChaine.composeUrlRequete({
							url: this.adresse,
							nomRequete: aEspace.url,
						})
					: "";
			window.open(lAdresseEspace);
		}
	}
	surOnclickCBEspace(aIdentifiantEspace, aTypeEspace) {
		const aEspace =
			this.objetApplicationConsoles.etatServeurHttp.getEspaceDIdentifiant(
				aIdentifiantEspace,
			);
		const aEspaces =
			this.objetApplicationConsoles.etatServeurHttp.getEspacesDeType(
				aTypeEspace,
			);
		const lIdentifiantEspaceConcerne = aEspace.identifiant;
		const lEtatCocheEspaceConcerne = !aEspace.publie;
		ObjetHtml_1.GHtml.getElement(
			this.Nom + "_Espace_" + aEspace.identifiant,
		).checked = lEtatCocheEspaceConcerne;
		aEspaces.forEach((aElement) => {
			if (!!aElement) {
				aElement.publie = lEtatCocheEspaceConcerne;
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
			.setValeur(lEtatCocheEspaceConcerne);
		lCommunication.appelSOAP(
			lAppelDistant,
			this.objetApplicationConsoles.creerCallbackSOAP(
				this,
				this.callbackSurOnclickCBEspace.bind(
					this,
					lIdentifiantEspaceConcerne,
					lEtatCocheEspaceConcerne,
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
