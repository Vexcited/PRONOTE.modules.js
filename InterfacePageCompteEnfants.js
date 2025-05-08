const {
	InterfaceCompteInfosEnfantPrim,
} = require("InterfaceCompteInfosEnfantPrim.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
class InterfacePageCompteEnfantsMobile extends InterfacePage_Mobile {
	construireInstances() {
		this.identPage = this.add(InterfaceCompteInfosEnfantPrim, null, null);
	}
	valider() {
		const lInstance = this.getInstance(this.identPage);
		lInstance.valider();
	}
}
module.exports = { InterfacePageCompteEnfantsMobile };
