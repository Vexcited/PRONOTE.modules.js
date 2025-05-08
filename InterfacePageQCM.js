const { ObjetVisuEleve } = require("ObjetVisuEleveQCM.js");
const { ObjetRequeteQCMQuestions } = require("ObjetRequeteQCMQuestions.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const {
	TypeEtatExecutionQCMPourRepondant,
} = require("TypeEtatExecutionQCMPourRepondant.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const {
	ObjetRequeteSaisieQCMReponses,
} = require("ObjetRequeteSaisieQCMReponses.js");
const { TypeCallbackVisuEleveQCM } = require("ObjetVisuEleveQCM.js");
class ObjetAffichagePageQCM extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.idBandeau = this.Nom + ".bandeau";
		this.idTitreQCM = this.Nom + ".titreQCM";
		this.idBoutonsQCM = this.Nom + ".boutonsQCM";
		this.idBoutonBack = this.Nom + ".boutonBack";
		this.idVisuEleve = this.Nom + ".objetVisuEleve";
		this.objetVisuEleve = new ObjetVisuEleve(
			this.idVisuEleve,
			this.evenementQCM.bind(this),
		);
		this.objetVisuEleve.setParametres({
			idContenu: this.idVisuEleve.escapeJQ(),
		});
		this.ongletPrec = null;
		this.couleurThemeQCMFonce = "#428ca5";
	}
	construireInstances() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const lHtml = [];
		lHtml.push('<div class="Fenetre_QCM">');
		lHtml.push('  <div id="' + this.idBandeau + '" class="header-conteneur">');
		lHtml.push('     <ul class="icon-contain">');
		lHtml.push(
			'      <li><a class="iconic icon_retour_mobile" id="' +
				this.idBoutonBack +
				'" onclick="',
			this.Nom,
			'.fermer();"></a></li>',
		);
		lHtml.push("     </ul>");
		lHtml.push(
			'     <div class="titres-contain" id="' + this.idTitreQCM + '"></div>',
		);
		lHtml.push("   </div>");
		lHtml.push(
			' <div id="' + this.idVisuEleve + '" class="main-conteneur"></div>',
		);
		lHtml.push("</div>");
		return lHtml.join("");
	}
	setDonnees(aObjet, aOngletPrec) {
		$(
			"#" +
				GInterface.getInstance(GInterface.identEnteteMobile)
					.getNom()
					.escapeJQ(),
		).hide();
		$("#" + GApplication.idLigneBandeau.escapeJQ()).hide();
		this.objetVisuEleve.setParametres({
			idContenu: this.idVisuEleve.escapeJQ(),
			modeProf:
				GApplication.getDemo() ||
				((GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Parent ||
					GEtatUtilisateur.GenreEspace === EGenreEspace.Mobile_Accompagnant) &&
					(aObjet.executionQCM.etatCloture === undefined ||
						aObjet.executionQCM.etatCloture ===
							TypeEtatExecutionQCMPourRepondant.EQR_EnCours)),
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
				GInterface.getInstance(GInterface.identEnteteMobile)
					.getNom()
					.escapeJQ(),
		).show();
		$("#" + GApplication.idLigneBandeau.escapeJQ()).show();
	}
	fermer() {
		this.restaurerMenu();
		GInterface.evenementSurOnglet(this.ongletPrec);
	}
	evenementQCM(aParam) {
		if (aParam === undefined) {
			return;
		}
		this.param = aParam;
		if (this.param.action === TypeCallbackVisuEleveQCM.get) {
			if (
				GEtatUtilisateur.estEspaceExecutionQCM() &&
				aParam.pourInitialisation
			) {
				new ObjetRequeteSaisieQCMReponses(
					this,
					this.actionSurQCMInitialisation.bind(this, true),
				).lancerRequete(this.param);
			} else {
				this.actionSurQCMInitialisation();
			}
		} else if (this.param.action === TypeCallbackVisuEleveQCM.set) {
			new ObjetRequeteSaisieQCMReponses(
				this,
				this.actionSurSaisieReponses,
			).lancerRequete(this.param);
		} else if (this.param.action === TypeCallbackVisuEleveQCM.close) {
			if (this.param.pourCloture && GEtatUtilisateur.estEspaceExecutionQCM()) {
				new ObjetRequeteSaisieQCMReponses(
					this,
					this.actionSurSaisieReponses,
				).lancerRequete(this.param);
				this.callback.appel({
					genreOnglet: EGenreOnglet.QCM_Reponse,
					genreOngletPrec: this.ongletPrec,
				});
			}
			this.fermer();
		}
	}
	actionSurQCMInitialisation() {
		new ObjetRequeteQCMQuestions(
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
module.exports = ObjetAffichagePageQCM;
