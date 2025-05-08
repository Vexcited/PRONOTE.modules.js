exports.ObjetListe = void 0;
const _ObjetListe_1 = require("_ObjetListe");
class _ObjetListe extends _ObjetListe_1.ObjetListe {}
exports.ObjetListe = _ObjetListe;
if (IE.estMobile) {
  exports.ObjetListe = _ObjetListe = require("ObjetListe_Mobile.js");
} else {
  exports.ObjetListe = _ObjetListe = require("ObjetListe_Espace.js");
}
