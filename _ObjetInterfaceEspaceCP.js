exports._ObjetInterfaceEspaceCP = void 0;
require("DeclarationJQuery");
const Invocateur_1 = require("Invocateur");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetFenetre_Impression_1 = require("ObjetFenetre_Impression");
const ObjetFenetre_LienPdf_1 = require("ObjetFenetre_LienPdf");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const GestionnaireModale_1 = require("GestionnaireModale");
const ToucheClavier_1 = require("ToucheClavier");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class _ObjetInterfaceEspaceCP extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		$(document).on("keydown.interfaceespaceCP", this.controleTouche.bind(this));
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.autorisationRechargementPage,
			this.confirmationDeconnexion,
			this,
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.navigationOnglet,
			(aOnglet, aParams) => {
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
					this.changementManuelOnglet(aOnglet, aParams);
				});
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.changerMembre,
			(aMembre) => {
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
					this.changementMembre(aMembre);
				});
			},
			this,
		);
		Invocateur_1.Invocateur.abonner(
			"controleTouche",
			(aEvent) => {
				this.controleTouche(aEvent);
			},
			this,
		);
	}
	detruireInstances() {
		Invocateur_1.Invocateur.desabonner(
			Invocateur_1.ObjetInvocateur.events.autorisationRechargementPage,
		);
		$(document).off("keydown.interfaceespaceCP");
	}
	construireInstancesPDFEtImpression() {
		this.IdentFenetreImpression = this.addFenetre(
			ObjetFenetre_Impression_1.ObjetFenetre_Impression,
			this.surEvenementFenetreImpression,
		);
		this.identFenetreLienPDF = this.addFenetre(
			ObjetFenetre_LienPdf_1.ObjetFenetre_LienPdf,
		);
		Invocateur_1.Invocateur.abonner(
			"OuvrirFenetreLienPDF",
			this._ouvrirFenetreLienPDF,
			this,
		);
	}
	async surEvenementSurImpression() {
		if (!GEtatUtilisateur.impressionCourante) {
			return;
		}
		let lGenreAction = Enumere_Action_1.EGenreAction.Valider;
		if (GEtatUtilisateur.EtatSaisie) {
			lGenreAction = await (0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message:
						GEtatUtilisateur.impressionCourante.etat ===
						Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
							? ObjetTraduction_1.GTraductions.getValeur(
									"GenerationPDF.MessageAlerteGenerationPdf",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"fenetreImpression.MessageAlerteImpression",
								),
				});
		}
		if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
			if (
				GEtatUtilisateur.impressionCourante.etat ===
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
			) {
				this.getInstance(this.identFenetreGenerationPdf).afficher(
					GEtatUtilisateur.impressionCourante.callback(),
				);
			} else {
				this.getInstance(this.IdentFenetreImpression).imprimer(
					GEtatUtilisateur.impressionCourante,
				);
			}
		} else {
			this.surEvenementFenetreImpression();
		}
	}
	estPageIdentification() {
		return false;
	}
	confirmationDeconnexion(aData) {
		if (
			!(0, AccessApp_1.getApp)().getDemo() &&
			ObjetNavigateur_1.Navigateur.interactionUtilisateur &&
			window.GEtatUtilisateur &&
			GEtatUtilisateur.EtatSaisie
		) {
			aData.message = ObjetTraduction_1.GTraductions.getValeur(
				"connexion.DeconnexionSaisieNonValidee",
			);
		}
	}
	actualisationF5() {
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			this.retourSurNavigation();
		});
	}
	controleTouche(aEvent) {
		if (aEvent.which === 116 && !aEvent.shiftKey && !aEvent.altKey) {
			if (this.estPageIdentification()) {
				return true;
			}
			ObjetNavigateur_1.Navigateur.bloquerValeurEvenement(aEvent.originalEvent);
			if (ObjetNavigateur_1.Navigateur.getBloquerClavier()) {
				return true;
			}
			if (this.__blocageDelaiF5__) {
				return true;
			}
			this.__blocageDelaiF5__ = true;
			setTimeout(() => {
				delete this.__blocageDelaiF5__;
			}, 1000);
			const lParametres = {};
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.actualisationAffichage,
				lParametres,
			);
			if (lParametres.interruptionActualisation !== true) {
				this.actualisationF5();
			}
		}
		if (
			aEvent.which === 112 &&
			!aEvent.shiftKey &&
			!aEvent.altKey &&
			!aEvent.ctrlKey
		) {
			if (this.estPageIdentification()) {
				return true;
			}
			ObjetNavigateur_1.Navigateur.bloquerValeurEvenement(aEvent.originalEvent);
			this.evenementSurAide();
			return true;
		}
		if (
			!GestionnaireModale_1.GestionnaireModale.estInterfaceBloque() &&
			aEvent.originalEvent.altKey &&
			!aEvent.originalEvent.ctrlKey
		) {
			switch (aEvent.which) {
				case ToucheClavier_1.ToucheClavier._0:
					Invocateur_1.Invocateur.evenement("focus.menu_navigation");
					return true;
				case ToucheClavier_1.ToucheClavier._1:
					this.setFocusPremierObjet();
					return true;
				case ToucheClavier_1.ToucheClavier._9:
					if (this.raccourcisClavierSurBandeau(9)) {
						return true;
					}
					break;
			}
		}
	}
	raccourcisClavierSurBandeau(aNumeroRaccourci) {
		return false;
	}
	changementManuelOnglet(aOnglet, aParams) {}
	changementMembre(aMembre) {}
	surEvenementFenetreImpression() {}
	retourSurNavigation(aParametres) {}
	evenementSurAide() {}
	setFocusPremierObjet() {}
	_ouvrirFenetreLienPDF(aUrl) {
		this.getInstance(this.identFenetreLienPDF).setDonneesLienPDF(aUrl);
	}
}
exports._ObjetInterfaceEspaceCP = _ObjetInterfaceEspaceCP;
