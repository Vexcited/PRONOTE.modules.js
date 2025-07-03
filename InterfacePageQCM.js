exports.InterfacePageQCM = void 0;
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
const ObjetRequeteQCMQuestions_1 = require("ObjetRequeteQCMQuestions");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetRequeteSaisieQCMReponses_1 = require("ObjetRequeteSaisieQCMReponses");
const ObjetVisuEleveQCM_2 = require("ObjetVisuEleveQCM");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
class InterfacePageQCM extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.idBandeau = this.Nom + ".bandeau";
		this.idTitreQCM = this.Nom + ".titreQCM";
		this.idBoutonsQCM = this.Nom + ".boutonsQCM";
		this.idVisuEleve = this.Nom + ".objetVisuEleve";
		this.appScoMobile = (0, AccessApp_1.getApp)();
		this.interfaceMobile = this.appScoMobile.getInterfaceMobile();
		this.objetVisuEleve = new ObjetVisuEleveQCM_1.ObjetVisuEleve(
			this.idVisuEleve,
			this.evenementQCM.bind(this),
		);
		this.objetVisuEleve.setParametres({
			idContenu: this.idVisuEleve.escapeJQ(),
		});
		this.ongletPrec = null;
	}
	construireInstances() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ class: "Fenetre_QCM" },
			IE.jsx.str(
				"div",
				{ id: this.idBandeau, class: "header-conteneur" },
				IE.jsx.str(
					"div",
					{ class: "icon-contain" },
					IE.jsx.str("ie-btnicon", {
						class: "iconic icon_retour_mobile",
						"ie-model": this.jsxModelBouton.bind(this),
						"aria-label": ObjetTraduction_1.GTraductions.getValeur("Precedent"),
					}),
				),
				IE.jsx.str("div", { class: "titres-contain", id: this.idTitreQCM }),
			),
			IE.jsx.str("div", { id: this.idVisuEleve, class: "main-conteneur" }),
		);
	}
	jsxModelBouton() {
		return {
			event: () => {
				this.fermer();
			},
		};
	}
	setDonnees(aObjet, aOngletPrec) {
		$(
			"#" +
				this.interfaceMobile
					.getNomInstance(this.interfaceMobile.identEnteteMobile)
					.escapeJQ(),
		).hide();
		$("#" + this.appScoMobile.idLigneBandeau.escapeJQ()).hide();
		this.objetVisuEleve.setParametres({
			idContenu: this.idVisuEleve.escapeJQ(),
			modeProf:
				this.appScoMobile.getDemo() ||
				((GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_Parent ||
					GEtatUtilisateur.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant) &&
					(aObjet.executionQCM.etatCloture === undefined ||
						aObjet.executionQCM.etatCloture ===
							TypeEtatExecutionQCMPourRepondant_1
								.TypeEtatExecutionQCMPourRepondant.EQR_EnCours)),
		});
		this.objetVisuEleve.setDonnees(aObjet.executionQCM);
		$("#" + this.idTitreQCM.escapeJQ()).html(
			this.objetVisuEleve.composeTitre(),
		);
		this.ongletPrec = aOngletPrec;
	}
	free() {
		super.free();
		this.restaurerMenu();
	}
	restaurerMenu() {
		$(
			"#" +
				this.interfaceMobile
					.getNomInstance(this.interfaceMobile.identEnteteMobile)
					.escapeJQ(),
		).show();
		$("#" + this.appScoMobile.idLigneBandeau.escapeJQ()).show();
	}
	fermer() {
		this.restaurerMenu();
		this.interfaceMobile.evenementSurOnglet(this.ongletPrec);
	}
	evenementQCM(aParam) {
		if (aParam === undefined) {
			return;
		}
		this.param = aParam;
		if (
			this.param.action === ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.get
		) {
			if (
				GEtatUtilisateur.estEspaceExecutionQCM() &&
				aParam.pourInitialisation
			) {
				new ObjetRequeteSaisieQCMReponses_1.ObjetRequeteSaisieQCMReponses(
					this,
					this.actionSurQCMInitialisation.bind(this),
				).lancerRequete(this.param);
			} else {
				this.actionSurQCMInitialisation();
			}
		} else if (
			this.param.action === ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.set
		) {
			new ObjetRequeteSaisieQCMReponses_1.ObjetRequeteSaisieQCMReponses(
				this,
				this.actionSurSaisieReponses,
			).lancerRequete(this.param);
		} else if (
			this.param.action === ObjetVisuEleveQCM_2.TypeCallbackVisuEleveQCM.close
		) {
			if (this.param.pourCloture && GEtatUtilisateur.estEspaceExecutionQCM()) {
				new ObjetRequeteSaisieQCMReponses_1.ObjetRequeteSaisieQCMReponses(
					this,
					this.actionSurSaisieReponses,
				).lancerRequete(this.param);
				this.callback.appel({
					genreOnglet: Enumere_Onglet_1.EGenreOnglet.QCM_Reponse,
					genreOngletPrec: this.ongletPrec,
				});
			}
			this.fermer();
		}
	}
	actionSurQCMInitialisation() {
		new ObjetRequeteQCMQuestions_1.ObjetRequeteQCMQuestions(
			this,
			this.actionSurSaisieQCMQuestions,
		).lancerRequete(this.param);
	}
	actionSurSaisieQCMQuestions(aParam) {
		this.objetVisuEleve.setDonnees(aParam);
	}
	actionSurSaisieReponses(aParam) {
		this.objetVisuEleve.setDonneesReponse(aParam);
	}
}
exports.InterfacePageQCM = InterfacePageQCM;
