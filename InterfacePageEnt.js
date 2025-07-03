exports.InterfacePageEnt = void 0;
const InterfaceParametrageDeleguerAuthentificationSCO_1 = require("InterfaceParametrageDeleguerAuthentificationSCO");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
const AccessApp_1 = require("AccessApp");
class InterfacePageEnt extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.objetApplicationConsoles = (0, AccessApp_1.getApp)();
	}
	construireInstances() {
		var _a, _b;
		if (
			(_b =
				(_a = this.objetApplicationConsoles) === null || _a === void 0
					? void 0
					: _a.etatServeurHttp) === null || _b === void 0
				? void 0
				: _b.getConnecteAuServeur()
		) {
			this.identZoneAvecCAS = this.add(
				InterfaceParametrageDeleguerAuthentificationSCO_1.InterfaceParametrageDeleguerAuthentificationSCO,
			);
		}
	}
	construireStructureAffichage() {
		var _a, _b;
		const H = [];
		if (
			(_b =
				(_a = this.objetApplicationConsoles) === null || _a === void 0
					? void 0
					: _a.etatServeurHttp) === null || _b === void 0
				? void 0
				: _b.getConnecteAuServeur()
		) {
			H.push(
				'<div class="Table FondBlanc" id="' +
					this.getInstance(this.identZoneAvecCAS).getNom() +
					'"></div>',
			);
		} else {
			H.push(
				'<div class="Texte10 Espace GrandEspaceHaut Gras">' +
					ObjetTraduction_1.GTraductions.getValeur(
						"pageConsoleAdministration.msgPasDeModifSiAucuneBase",
					) +
					"</div>",
			);
		}
		return H.join("");
	}
}
exports.InterfacePageEnt = InterfacePageEnt;
