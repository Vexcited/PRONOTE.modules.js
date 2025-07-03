exports.ObjetFenetre_ChoixDatePublicationPunition = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
var TypePublication;
(function (TypePublication) {
	TypePublication[(TypePublication["NonPubliee"] = 0)] = "NonPubliee";
	TypePublication[(TypePublication["PublierImmediatement"] = 1)] =
		"PublierImmediatement";
	TypePublication[(TypePublication["PublierDemain"] = 2)] = "PublierDemain";
	TypePublication[(TypePublication["PublierLe"] = 3)] = "PublierLe";
})(TypePublication || (TypePublication = {}));
class ObjetFenetre_ChoixDatePublicationPunition extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"punition.fenetreDatePub.Titre",
			),
			largeur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.datePublication = null;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioChoixDate: {
				getValue(aTypePublication) {
					switch (aTypePublication) {
						case TypePublication.NonPubliee:
							return aInstance.datePublication === null;
						case TypePublication.PublierImmediatement:
							return (
								aInstance.datePublication &&
								ObjetDate_1.GDate.estAvantJour(
									ObjetDate_1.GDate.getJour(aInstance.datePublication),
									ObjetDate_1.GDate.getJour(ObjetDate_1.GDate.demain),
								)
							);
						case TypePublication.PublierDemain:
							return ObjetDate_1.GDate.estJourEgal(
								aInstance.datePublication,
								ObjetDate_1.GDate.demain,
							);
						case TypePublication.PublierLe:
							return aInstance.correspondAuChoixPublieLe(
								aInstance.datePublication,
							);
					}
					return false;
				},
				setValue(aTypePublication) {
					if (aInstance._instanceSelecteurDate) {
						aInstance._instanceSelecteurDate.setActif(false);
						aInstance._instanceSelecteurDate.setDonnees(null);
					}
					switch (aTypePublication) {
						case TypePublication.NonPubliee:
							aInstance.datePublication = null;
							break;
						case TypePublication.PublierImmediatement:
							aInstance.datePublication =
								ObjetDate_1.GDate.getDateCourante(false);
							break;
						case TypePublication.PublierDemain:
							aInstance.datePublication = ObjetDate_1.GDate.demain;
							break;
						case TypePublication.PublierLe:
							aInstance.datePublication = ObjetDate_1.GDate.getJourSuivant(
								ObjetDate_1.GDate.demain,
							);
							if (aInstance._instanceSelecteurDate) {
								aInstance._instanceSelecteurDate.setActif(true);
								aInstance._instanceSelecteurDate.setDonnees(
									aInstance.datePublication,
								);
							}
							break;
					}
				},
			},
			identiteSelecteurDate() {
				return {
					class: ObjetCelluleDate_1.ObjetCelluleDate,
					pere: aInstance,
					init(aCelluleDate) {
						aInstance._instanceSelecteurDate = aCelluleDate;
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
		return (
			aDate && ObjetDate_1.GDate.estAvantJour(ObjetDate_1.GDate.demain, aDate)
		);
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
			'" ie-model="radioChoixDate(',
			TypePublication.NonPubliee,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.fenetreDatePub.NonPubliee",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="',
			lPaddingPourMobile,
			'">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-model="radioChoixDate(',
			TypePublication.PublierImmediatement,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.fenetreDatePub.PublierImmediatement",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="',
			lPaddingPourMobile,
			'">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-model="radioChoixDate(',
			TypePublication.PublierDemain,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.fenetreDatePub.PublierDemain",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="flex-contain">',
			'<ie-radio name="',
			lNameGroupRadio,
			'" ie-model="radioChoixDate(',
			TypePublication.PublierLe,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"punition.fenetreDatePub.PublierLe",
			),
			"</ie-radio>",
			'<div class="m-left" ie-identite="identiteSelecteurDate"></div>',
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aDateSelectionnee) {
		this.datePublication = aDateSelectionnee;
		if (this._instanceSelecteurDate) {
			this._instanceSelecteurDate.setDonnees(this.datePublication);
			if (this.correspondAuChoixPublieLe(this.datePublication)) {
				this._instanceSelecteurDate.setActif(!!this.datePublication);
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
exports.ObjetFenetre_ChoixDatePublicationPunition =
	ObjetFenetre_ChoixDatePublicationPunition;
