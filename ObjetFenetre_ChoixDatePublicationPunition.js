const { ObjetFenetre } = require("ObjetFenetre.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
class ObjetFenetre_ChoixDatePublicationPunition extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("punition.fenetreDatePub.Titre"),
			largeur: 300,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.datePublication = null;
		this.TypePublication = {
			NonPubliee: 0,
			PublierImmediatement: 1,
			PublierDemain: 2,
			PublierLe: 3,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioChoixDate: {
				getValue(aTypePublication) {
					switch (aTypePublication) {
						case aInstance.TypePublication.NonPubliee:
							return aInstance.datePublication === null;
						case aInstance.TypePublication.PublierImmediatement:
							return (
								aInstance.datePublication &&
								GDate.estAvantJour(
									GDate.getJour(aInstance.datePublication),
									GDate.getJour(GDate.demain),
								)
							);
						case aInstance.TypePublication.PublierDemain:
							return GDate.estJourEgal(aInstance.datePublication, GDate.demain);
						case aInstance.TypePublication.PublierLe:
							return aInstance.correspondAuChoixPublieLe(
								aInstance.datePublication,
							);
					}
					return false;
				},
				setValue(aTypePublication) {
					if (this.controleur._instanceSelecteurDate) {
						this.controleur._instanceSelecteurDate.setActif(false);
						this.controleur._instanceSelecteurDate.setDonnees(null);
					}
					switch (aTypePublication) {
						case aInstance.TypePublication.NonPubliee:
							aInstance.datePublication = null;
							break;
						case aInstance.TypePublication.PublierImmediatement:
							aInstance.datePublication = GDate.getDateCourante(false);
							break;
						case aInstance.TypePublication.PublierDemain:
							aInstance.datePublication = GDate.demain;
							break;
						case aInstance.TypePublication.PublierLe:
							aInstance.datePublication = GDate.getJourSuivant(GDate.demain);
							if (this.controleur._instanceSelecteurDate) {
								this.controleur._instanceSelecteurDate.setActif(true);
								this.controleur._instanceSelecteurDate.setDonnees(
									aInstance.datePublication,
								);
							}
							break;
					}
				},
			},
			_instanceSelecteurDate: null,
			identiteSelecteurDate() {
				const lControleur = this.controleur;
				return {
					class: ObjetCelluleDate,
					pere: aInstance,
					init(aCelluleDate) {
						lControleur._instanceSelecteurDate = aCelluleDate;
						aCelluleDate.setActif(false);
						aCelluleDate.setOptionsObjetCelluleDate({
							formatDate: "%JJ/%MM/%AAAA",
						});
					},
					evenement(aDate) {
						aInstance.datePublication = aDate;
					},
				};
			},
		});
	}
	correspondAuChoixPublieLe(aDate) {
		return aDate && GDate.estAvantJour(GDate.demain, aDate);
	}
	composeContenu() {
		const lNameGroupRadio = "groupRadiosPubPunition";
		const lPaddingPourMobile = IE.estMobile ? "p-bottom-xxl" : "p-bottom-l";
		const H = [];
		H.push("<div>");
		H.push(
			'<div class="',
			lPaddingPourMobile,
			'">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-textright="true" ie-model="radioChoixDate(',
			this.TypePublication.NonPubliee,
			')">',
			GTraductions.getValeur("punition.fenetreDatePub.NonPubliee"),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="',
			lPaddingPourMobile,
			'">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-textright="true" ie-model="radioChoixDate(',
			this.TypePublication.PublierImmediatement,
			')">',
			GTraductions.getValeur("punition.fenetreDatePub.PublierImmediatement"),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="',
			lPaddingPourMobile,
			'">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-textright="true" ie-model="radioChoixDate(',
			this.TypePublication.PublierDemain,
			')">',
			GTraductions.getValeur("punition.fenetreDatePub.PublierDemain"),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="flex-contain">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-textright="true" ie-model="radioChoixDate(',
			this.TypePublication.PublierLe,
			')">',
			GTraductions.getValeur("punition.fenetreDatePub.PublierLe"),
			"</ie-radio>",
			'<div class="m-left" ie-identite="identiteSelecteurDate"></div>',
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aDateSelectionnee) {
		this.datePublication = aDateSelectionnee;
		if (this.controleur._instanceSelecteurDate) {
			this.controleur._instanceSelecteurDate.setDonnees(this.datePublication);
			if (this.correspondAuChoixPublieLe(this.datePublication)) {
				this.controleur._instanceSelecteurDate.setActif(!!this.datePublication);
			}
		}
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		if (aNumeroBouton === 1) {
			this.callback.appel(aNumeroBouton, this.datePublication);
		}
	}
}
module.exports = { ObjetFenetre_ChoixDatePublicationPunition };
