exports.InterfacePageCompteEnfantsMobile = void 0;
const InterfaceCompteInfosEnfantPrim_1 = require("InterfaceCompteInfosEnfantPrim");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
class InterfacePageCompteEnfantsMobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	construireInstances() {
		this.identPage = this.add(
			InterfaceCompteInfosEnfantPrim_1.InterfaceCompteInfosEnfantPrim,
			null,
			null,
		);
	}
	valider() {
		const lInstance = this.getInstance(this.identPage);
		lInstance.valider();
	}
}
exports.InterfacePageCompteEnfantsMobile = InterfacePageCompteEnfantsMobile;
