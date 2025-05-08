exports.ObjetFenetre_DetailElementVS = void 0;
const _ObjetFenetre_DetailElementVS_1 = require("_ObjetFenetre_DetailElementVS");
const ObjetDetailElementVS_1 = require("ObjetDetailElementVS");
const _ObjetDetailElementVS_1 = require("_ObjetDetailElementVS");
class ObjetFenetre_DetailElementVS extends _ObjetFenetre_DetailElementVS_1._ObjetFenetre_DetailElementVS {
  getClasseObjetDetailElementVS() {
    return ObjetDetailElementVS_1.ObjetDetailElementVS;
  }
  surEvenementDetailElementVS(aTypeEvenement, aDonnees) {
    this.fermer();
    if (
      aTypeEvenement !==
      _ObjetDetailElementVS_1.TypeBoutonFenetreDetailElementVS.Annuler
    ) {
      this.callback.appel(aTypeEvenement, {
        element: aDonnees.element,
        documents: aDonnees.documents,
      });
    }
  }
}
exports.ObjetFenetre_DetailElementVS = ObjetFenetre_DetailElementVS;
