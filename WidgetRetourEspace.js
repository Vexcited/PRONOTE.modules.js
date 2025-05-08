exports.WidgetRetourEspace = void 0;
const ObjetWidget_1 = require("ObjetWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireRedirection_1 = require("UtilitaireRedirection");
class WidgetRetourEspace extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = { html: this.composeWidgetRetourEspace() };
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeMessageConteneur() {
				$(this.node).eventValidation((e) => {
					aInstance.retourEspaceBureau();
				});
			},
		});
	}
	composeWidgetRetourEspace() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "message-conteneur", "ie-node": "nodeMessageConteneur()" },
					IE.jsx.str("span", { class: "IconeRetourEspace" }, "&nbsp"),
					ObjetTraduction_1.GTraductions.getValeur(
						"mobile.accederVersionClassique",
					),
				),
			),
		);
		return H.join("");
	}
	retourEspaceBureau() {
		window.location.assign(
			GParametres.URLEspace +
				new UtilitaireRedirection_1.UtilitaireRedirection().getParametresUrl({
					parametres: [{ parametre: "fd", valeur: "1" }],
					parametresASupprimer: ["redirect"],
				}),
		);
	}
}
exports.WidgetRetourEspace = WidgetRetourEspace;
