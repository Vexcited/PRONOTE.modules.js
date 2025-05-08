exports.ObjetSelecteurTypeRessourceAbsence = void 0;
const ObjetFenetre_SelectionTypeRessourceAbsence_1 = require("ObjetFenetre_SelectionTypeRessourceAbsence");
const _ObjetSelecteur_1 = require("_ObjetSelecteur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetSelecteurTypeRessourceAbsence extends _ObjetSelecteur_1._ObjetSelecteur {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      titreLibelle: ObjetTraduction_1.GTraductions.getValeur("TypeDeDonnees"),
    });
  }
  construireInstanceFenetreSelection() {
    this.identFenetreSelection = this.addFenetre(
      ObjetFenetre_SelectionTypeRessourceAbsence_1.ObjetFenetre_SelectionTypeRessourceAbsence,
      this.evntFenetreSelection,
    );
  }
  evntBtnSelection() {
    this.getInstance(this.identFenetreSelection).setDonnees({
      listeRessources: this.listeTotale,
      listeRessourcesSelectionnees: MethodesObjet_1.MethodesObjet.dupliquer(
        this.listeSelection,
      ),
    });
  }
}
exports.ObjetSelecteurTypeRessourceAbsence = ObjetSelecteurTypeRessourceAbsence;
