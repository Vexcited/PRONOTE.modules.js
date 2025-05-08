exports.WidgetAide = void 0;
const ObjetPosition_1 = require("ObjetPosition");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetAide extends ObjetWidget_1.Widget.ObjetWidget {
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			html: this.composeWidgetAide(),
			nbrElements: null,
			afficherMessage: false,
		};
		$.extend(true, aParams.donnees, lWidget);
		aParams.construireWidget(aParams.donnees);
	}
	composeWidgetAide() {
		const H = [];
		H.push(
			'<div style="',
			ObjetPosition_1.GPosition.getWidth(this.donnees.id) - 8,
			'px; height: 90%;">',
		);
		H.push("</iframe>");
		H.push("</div>");
		return H.join("");
	}
}
exports.WidgetAide = WidgetAide;
