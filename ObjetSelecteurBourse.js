exports.ObjetSelecteurBourse = void 0;
const ObjetFenetre_SelectionBourse_1 = require("ObjetFenetre_SelectionBourse");
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetSelecteurBourse extends _ObjetSelecteur_1._ObjetSelecteur {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      titreLibelle:
        ObjetTraduction_1.GTraductions.getValeur("RecapAbs.bourses"),
    });
  }
  construireInstanceFenetreSelection() {
    this.identFenetreSelection = this.addFenetre(
      ObjetFenetre_SelectionBourse_1.ObjetFenetre_SelectionBourse,
      this.evntFenetreSelection,
    );
  }
  evntBtnSelection() {
    this.getInstance(this.identFenetreSelection).setDonnees(
      this.listeTotale,
      MethodesObjet_1.MethodesObjet.dupliquer(this.listeSelection),
    );
  }
}
exports.ObjetSelecteurBourse = ObjetSelecteurBourse;
