exports.ObjetApplicationConsoles = void 0;
require("NamespaceIE");
require("DeclarationJQuery");
require("IELog");
require("ObjetNavigateur.js");
const ObjetApplication_1 = require("ObjetApplication");
require("IEHtml.BoutonHebergement.js");
const TypeThemeCouleur_1 = require("TypeThemeCouleur");
require("DeclarationJournauxCP.js");
require("DeclarationFontMontserrat.js");
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_Statut_1 = require("Enumere_Statut");
const Evenement_1 = require("Evenement");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const WS_Description_1 = require("WS_Description");
const CommunicationSOAP_1 = require("CommunicationSOAP");
const ObjetCouleurConsoles_1 = require("ObjetCouleurConsoles");
const ObjetTraduction_1 = require("ObjetTraduction");
const ThemesCouleurs_1 = require("ThemesCouleurs");
const UtilitaireMenuContextuelNatif_1 = require("UtilitaireMenuContextuelNatif");
let lEstModeOptimise = false;
let lProfilConnexion;
class ObjetApplicationConsoles extends ObjetApplication_1.ObjetApplication {
	constructor() {
		super();
		this.avecEduConnect = false;
		this.avecReserverLicenceSPR = false;
		this.listeObjetsGraphiques = [];
		this.estRecepteurTransfertBase = false;
		this.avecTransfererBase = false;
		this.avecPreparerAnneeSuivante = true;
	}
	evenementERREUR(aInstance, aException, aNomTrace) {}
	fournisseurCarteIdentite(aNomBase, aCallback) {
		return null;
	}
	transfererBase(aInstance, aBaseATransferer) {}
	getCommunicationSOAP() {
		return this.communicationSOAP;
	}
	setCommunicationSOAP(aComm) {
		this.communicationSOAP = aComm;
		if (this.communicationSOAP) {
			this.communicationSOAP.setNom(this.getNom() + ".getCommunication ()");
		}
	}
	getCouleur() {
		return global.GCouleur;
	}
	estPronotePrimaireServeur() {
		return false;
	}
	estEDTServeur() {
		return false;
	}
	start(aParam) {
		try {
			if (aParam) {
				if (aParam.modeOptimise) {
					this.setModeOptimise(aParam.modeOptimise);
				}
				if (aParam.profilConnexion) {
					this.setProfilConnexion(aParam.profilConnexion);
				}
				this.avecUpload = !!aParam.gestionUpload;
				this.desactiverDelegationsAuthentification =
					!!aParam.desactiverDelegationsAuthentification;
				this.desactiverCarteIdentiteBase = this.estPronotePrimaireServeur();
			}
			if (this.getModeOptimise()) {
				$("#" + this.getIdConteneur().escapeJQ()).css({
					position: "absolute",
					height: 550,
					width: 1116,
				});
			}
			UtilitaireMenuContextuelNatif_1.UtilitaireMenuContextuelNatif.desactiverSurElement(
				$(document.body),
			);
			this.messagesEvenements = this.msgEvnts.getMessagesUnite("Main.js");
			if (this.initialiserObjetsGraphique) {
				this.initialiserObjetsGraphique();
			}
			if (this.initialiserObjetsPage) {
				this.initialiserObjetsPage();
			}
			this.WS_adminServeur = this.descriptionWS
				.getWSAdministrationServeur()
				.getNom();
			const lWebServices = new WS_Description_1.WS_Description();
			lWebServices.ajouterService(
				this.descriptionWS.getWSAdministrationServeur(),
			);
			ThemesCouleurs_1.ThemesCouleurs.setTheme(this.getThemeCouleur());
			global.GCouleur = new ObjetCouleurConsoles_1.ObjetCouleurConsoles();
			this.setCommunicationSOAP(
				new CommunicationSOAP_1.CommunicationSOAP(
					this,
					this.evenementCommunication,
				),
			);
			this.getCommunicationSOAP().activerSOAP(lWebServices);
		} catch (e) {
			const lMessage = this.messagesEvenements.getMessageEchecBlocTry(e);
			this.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"start",
					lMessage,
				),
			);
		}
	}
	getThemeCouleur() {
		return TypeThemeCouleur_1.TypeThemeProduit.ProduitPN;
	}
	getModeOptimise() {
		return lEstModeOptimise;
	}
	setModeOptimise(aValeur) {
		lEstModeOptimise = aValeur;
	}
	getProfilConnexion() {
		return lProfilConnexion;
	}
	setProfilConnexion(aValeur) {
		lProfilConnexion = aValeur;
	}
	evenementCommunication(aGenreEvenement, aParam) {
		let lMessage;
		switch (aGenreEvenement) {
			case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
				.SurEmissionRequeteSOAP:
				lMessage =
					aParam && aParam.message
						? aParam.message
						: ObjetTraduction_1.GTraductions.getValeur("principal.chargement");
				break;
			case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
				.SurEmissionUploadFichier:
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"principal.transfertFichier",
				);
				break;
			default:
				break;
		}
		this._surEvenementCommunication(
			aGenreEvenement,
			$.extend(aParam, { message: lMessage }),
		);
	}
	_surEvenementCommunication(aGenreEvenement, aParam) {
		try {
			switch (aGenreEvenement) {
				case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
					.SurEmissionRequeteSOAP:
				case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
					.SurEmissionUploadFichier:
					Invocateur_1.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.eventIOAjax,
						$.extend(aParam, {
							emission: true,
							upload:
								aGenreEvenement ===
								CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
									.SurEmissionUploadFichier,
						}),
					);
					break;
				case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
					.SurReponseRequeteSOAP:
				case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
					.SurReponseUploadFichier:
					Invocateur_1.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.eventIOAjax,
						$.extend(aParam, {
							emission: false,
							upload:
								aGenreEvenement ===
								CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
									.SurReponseUploadFichier,
						}),
					);
					break;
			}
		} catch (e) {
			const lMessage =
				this._getStrGenreEvenement(aGenreEvenement) +
				" - " +
				this.messagesEvenements.getMessageEchecBlocTry(e);
			this.gestionEvnts.traiter(
				new Evenement_1.Evenement(
					Enumere_Statut_1.EStatut.erreur,
					Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
					this.messagesEvenements.getUnite(),
					"evenementCommunication",
					lMessage,
				),
			);
		}
	}
	_getStrGenreEvenement(aGenreEvenement) {
		switch (aGenreEvenement) {
			case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
				.SurEmissionRequeteSOAP: {
				return "SurEmissionRequeteSOAP";
			}
			case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
				.SurReponseRequeteSOAP: {
				return "SurReponseRequeteSOAP";
			}
			case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
				.SurEmissionUploadFichier: {
				return "SurEmissionUploadFichier";
			}
			case CommunicationSOAP_1.EGenreEvenementCommunicationSOAP
				.SurReponseUploadFichier: {
				return "SurReponseUploadFichier";
			}
			default: {
				return "";
			}
		}
	}
	ajouterObjetGraphique(aGenreOnglet, aConstructor) {
		if (MethodesObjet_1.MethodesObjet.isUndefined(aGenreOnglet)) {
		}
		if (this.listeObjetsGraphiques[aGenreOnglet]) {
		}
		this.listeObjetsGraphiques[aGenreOnglet] = aConstructor;
	}
	getObjetGraphiqueParGenre(aGenreOnglet) {
		let lResult = this.listeObjetsGraphiques[aGenreOnglet];
		return lResult || null;
	}
	formatterMessage(aMessage, aAvecCheminsComplets) {
		const lAvecCheminComplet =
			aAvecCheminsComplets !== null && aAvecCheminsComplets !== undefined
				? aAvecCheminsComplets
				: false;
		if (!lAvecCheminComplet && this.classObjetBase) {
			let lIndexDebChemin =
				aMessage.indexOf("<*") !== -1
					? aMessage.indexOf("<*")
					: aMessage.indexOf("&lt;*");
			const lLgSeparateurDeb = aMessage.indexOf("<*") !== -1 ? 2 : 5;
			while (lIndexDebChemin !== -1) {
				const lIndexFinChemin =
					aMessage.indexOf("*>") !== -1
						? aMessage.indexOf("*>")
						: aMessage.indexOf("*&gt;");
				const lDeb = aMessage.substring(0, lIndexDebChemin);
				const lFin = aMessage.substring(
					lIndexFinChemin + lLgSeparateurDeb,
					aMessage.length,
				);
				const lChemin = aMessage.substring(
					lIndexDebChemin + lLgSeparateurDeb,
					lIndexFinChemin,
				);
				const lNomFichier = new this.classObjetBase(
					lChemin,
				).recupererCheminRelatif();
				aMessage = lDeb + '"' + lNomFichier + '"' + lFin;
				lIndexDebChemin =
					aMessage.indexOf("<*") !== -1
						? aMessage.indexOf("<*")
						: aMessage.indexOf("&lt;*");
			}
		}
		return aMessage;
	}
}
exports.ObjetApplicationConsoles = ObjetApplicationConsoles;
