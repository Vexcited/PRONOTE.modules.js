exports.InterfacePageCP = void 0;
const _InterfacePageProduit_1 = require("_InterfacePageProduit");
class InterfacePageCP extends _InterfacePageProduit_1._InterfacePageProduit {}
exports.InterfacePageCP = InterfacePageCP;
if (IE.estMobile) {
	const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
	exports.InterfacePageCP = InterfacePageCP = InterfacePage_Mobile;
} else {
	const { _InterfacePage } = require("_InterfacePage.js");
	exports.InterfacePageCP = InterfacePageCP = _InterfacePage;
}
