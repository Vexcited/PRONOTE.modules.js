const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetMoteurInfirmerie } = require("ObjetMoteurInfirmerie.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_Infirmerie extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.moteurInfirmerie = new ObjetMoteurInfirmerie(this);
	}
	setDonnees(aListeEleves, aObjet) {
		this.moteurInfirmerie.init($.extend(aObjet, { listeEleves: aListeEleves }));
		this.setOptionsFenetre({
			listeBoutons: this.moteurInfirmerie.listeBoutons,
		});
		this.Instances[this.IdentComboEleves].setDonnees(
			this.moteurInfirmerie.listeEleves,
			this.moteurInfirmerie.indiceAccompagnateur,
		);
		this.Instances[this.IdentComboEleves].setActif(
			!this.moteurInfirmerie.disabled,
		);
		this.afficher();
	}
	surValidation(ANumeroBouton) {
		if (this.moteurInfirmerie.surValidation(ANumeroBouton)) {
			this.callback.appel(
				ANumeroBouton,
				this.moteurInfirmerie.eleve ? this.moteurInfirmerie.eleve.Numero : null,
				this.moteurInfirmerie.enCreation ? this.moteurInfirmerie.absence : null,
			);
		}
		this.fermer();
	}
	construireInstances() {
		this.IdentComboEleves = this.add(
			ObjetSaisiePN,
			this.evenementSurComboEleves,
			this.initialiserComboEleves,
		);
	}
	composeContenu() {
		const T = [];
		T.push(`<div class="flex-contain cols">`);
		const lIdHeureDebut = GUID.getId();
		T.push(
			`<div class="field-contain cols-on-mobile">\n              <label for="${lIdHeureDebut}" class="fix-bloc ie-titre-petit" style="width: 11.5rem;">${GTraductions.getValeur("Absence.HeureDepart")} : </label>\n              <input id="${lIdHeureDebut}" type="time" ie-model="input(true)" class="round-style"/>\n            </div>`,
		);
		const lIdHeureFin = GUID.getId();
		T.push(
			`<div class="field-contain cols-on-mobile">\n              <label for="${lIdHeureFin}" class="fix-bloc ie-titre-petit" style="width: 11.5rem;">${GTraductions.getValeur("Absence.HeureRetour")} : </label>\n              <input id="${lIdHeureFin}" type="time" ie-model="input(false)" class="round-style" />\n            </div>`,
		);
		T.push(
			`<div class="field-contain cols-on-mobile">\n              <label class="fix-bloc ie-titre-petit" style="width: 11.5rem;">${GTraductions.getValeur("Absence.AccompagnePar")} : </label>\n              <div class="on-mobile" id="${this.getNomInstance(this.IdentComboEleves)}"></div>\n           </div>`,
		);
		T.push(`<div class="field-contain f-wrap" ie-display="avecCommentaire">`);
		const lIdCommentaire = GUID.getId();
		if (!IE.estMobile) {
			T.push(
				`<label for="${lIdCommentaire}" class="ie-titre-petit m-bottom-l" style="width:100%;">${GTraductions.getValeur("Absence.Commentaire")} : </label>`,
			);
		}
		T.push(
			`<ie-textareamax class="full-size" id="${lIdCommentaire}" ie-compteur ie-compteurmax="1000" maxlength="1000" ie-model="commentaire" placeholder="${GTraductions.getValeur("AbsenceVS.saisissezUnCommentaire")}"></ie-textareamax>`,
		);
		T.push(`</div>`);
		T.push(
			`<div class="public-team" ie-display="avecEditionPublicationWeb">\n      <span class="icon-contain only-mobile"><i class="icon_info_sondage_publier i-medium i-as-deco"></i></span>\n      <ie-checkbox ie-model="publicationWeb">${GTraductions.getValeur("AbsenceVS.PublierParents")}</ie-checkbox>\n    </div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	initialiserComboEleves(AInstance) {
		AInstance.setOptionsObjetSaisie({
			labelWAICellule: GTraductions.getValeur(
				"AbsenceVS.comboEleveAccInfirmerie",
			),
			longueur: 150,
			celluleAvecTexteHtml: true,
		});
	}
	evenementSurComboEleves(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.moteurInfirmerie.absence.Accompagnateur.Numero =
				aParams.element.getNumero();
		}
	}
}
module.exports = { ObjetFenetre_Infirmerie };
