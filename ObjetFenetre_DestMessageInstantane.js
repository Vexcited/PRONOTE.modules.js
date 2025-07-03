exports.ObjetFenetre_DestMessageInstantane = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const InterfaceDestMessageInstantane_1 = require("InterfaceDestMessageInstantane");
class ObjetFenetre_DestMessageInstantane extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Messagerie.EnvoiMessageInstantane",
			),
			modale: true,
			largeur: 350,
			fermerFenetreSurClicHorsFenetre: IE.estMobile,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				{
					estValider: true,
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Messagerie.LancerConversation",
					),
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
				},
			],
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.estValider) {
						return (
							aInstance
								.getInstance(aInstance.identAff)
								.getListeSelectionsUtils()
								.count() === 0
						);
					}
					return false;
				},
				event: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.estValider) {
						aInstance.getInstance(aInstance.identAff).lancerConversation();
					}
					aInstance.fermer();
				},
			},
		});
	}
	construireInstances() {
		this.identAff = this.add(
			InterfaceDestMessageInstantane_1.InterfaceDestMessageInstantane,
			function () {
				this.fermer();
			},
			(aInstance) => {
				if (this.optionsFenetre.options) {
					aInstance.setOptions(
						Object.assign(
							{ fermerFenetre: this.fermer.bind(this) },
							this.optionsFenetre.options,
						),
					);
				}
			},
		);
	}
	setDonnees(aParams) {
		this.afficher();
		this.getInstance(this.identAff).setDonnees(
			Object.assign(
				{
					fermer: () => {
						this.fermer();
					},
				},
				aParams,
			),
		);
		this.positionnerFenetre();
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", { id: this.getNomInstance(this.identAff) }),
			),
		);
		return T.join("");
	}
}
exports.ObjetFenetre_DestMessageInstantane = ObjetFenetre_DestMessageInstantane;
