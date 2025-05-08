const { MethodesObjet } = require("MethodesObjet.js");
const GImageConnexion = require("ObjetImageConnexion.js");
const imagesConnexion = require("imagesconnexion.js");
try {
	if (MethodesObjet.isFunction(imagesConnexion)) {
		imagesConnexion(GImageConnexion);
	}
} catch (e) {}
