exports.ObjetFiche_SaisieAbsence = void 0;
const ObjetFiche_1 = require("ObjetFiche");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetVS_SaisieAbsencePN_1 = require("ObjetVS_SaisieAbsencePN");
const AccessApp_1 = require("AccessApp");
class ObjetFiche_SaisieAbsence extends ObjetFiche_1.ObjetFiche {
	constructor(...aParams) {
		super(...aParams);
		this.objetDetailVS = new ObjetVS_SaisieAbsencePN_1.ObjetVS_SaisieAbsencePN(
			this.Nom + ".objetDetailVS",
			null,
			this,
			this.evntDetailVS,
		);
		this.objetDetailVS.setOptions({
			callbackRetour: () => {
				this.fermer();
			},
		});
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.PrevenirAbsenceParent",
			),
			largeur: 350,
			hauteur: null,
			avecTailleSelonContenu: true,
			modale: true,
			positionnerFenetreSurAfficher: true,
		});
	}
	evntDetailVS(aGenre, aParams) {
		this.callback.appel(aGenre, aParams);
	}
	setDonnees(aAbsence, aCommentaireAbsenceObligatoire) {
		this.element = aAbsence;
		this.afficherFiche({
			positionSurSouris: true,
			positionSurSourisSiAffiche: true,
		});
		this.objetDetailVS.initialiser();
		this.objetDetailVS.setDonnees(this.element, {
			id: this.objetDetailVS.getNom(),
			estConteneur: true,
			listeMotifsAbsences: (0, AccessApp_1.getApp)().getEtatUtilisateur()
				.listeMotifsAbsences,
			commentaireAbsenceObligatoire: !!aCommentaireAbsenceObligatoire,
		});
	}
	composeContenu() {
		const H = [];
		H.push('<div class="ifc_RecapVS theme-cat-viescolaire">');
		H.push(
			'<div id="',
			this.objetDetailVS.getNom(),
			'" class="ifc_RecapVS_EcranElement_Content VSFiche"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	surPreAffichage() {
		this.objetDetailVS.initialiser();
	}
}
exports.ObjetFiche_SaisieAbsence = ObjetFiche_SaisieAbsence;
