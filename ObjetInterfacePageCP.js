exports.InterfacePageCP = void 0;
const _InterfacePageProduit_1 = require("_InterfacePageProduit");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const _InterfacePage_1 = require("_InterfacePage");
class InterfacePageCP extends _InterfacePageProduit_1._InterfacePageProduit {}
exports.InterfacePageCP = InterfacePageCP;
if (IE.estMobile) {
	exports.InterfacePageCP = InterfacePageCP =
		InterfacePage_Mobile_1.InterfacePage_Mobile;
} else {
	exports.InterfacePageCP = InterfacePageCP = _InterfacePage_1._InterfacePage;
}
