exports.ObjetFichePopupConversation = void 0;
const ObjetFiche_1 = require("ObjetFiche");
const ObjetConversationEnCours_1 = require("ObjetConversationEnCours");
class ObjetFichePopupConversation extends ObjetFiche_1.ObjetFiche {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			avecAbonnementFermetureFenetreGenerale: false,
			largeur: 330,
		});
		this.avecBandeau = false;
	}
	construireInstances() {
		this.identAff = this.add(
			ObjetConversationEnCours_1.ObjetConversationEnCours,
			null,
			function (aInstance) {
				aInstance.setOptions({
					message: this.optionsFenetre.message,
					surFermer: null,
					surMessage: () => {
						this.optionsFenetre.clickSurMessage();
						this.fermer();
					},
					surQuitter: () => {
						this.fermer();
					},
				});
			},
		);
	}
	composeContenu() {
		const H = [];
		H.push(
			'<div id="',
			this.getInstance(this.identAff).getNom(),
			'" tabindex="0">',
		);
		return H.join("");
	}
	surAfficher() {
		if (super.surAfficher) {
			super.surAfficher();
		}
		this.getInstance(this.identAff).initialiser();
	}
}
exports.ObjetFichePopupConversation = ObjetFichePopupConversation;
