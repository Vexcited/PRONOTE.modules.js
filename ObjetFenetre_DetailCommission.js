const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetDetailCommission } = require("ObjetDetailCommission.js");
class ObjetFenetre_DetailCommission extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      hauteurMaxContenu: 800,
      avecScroll: true,
      largeur: 600,
      avecTailleSelonContenu: true,
      heightMax_mobile: true,
      titre: GTraductions.getValeur("AbsenceVS.commission"),
      listeBoutons: [GTraductions.getValeur("Fermer")],
    });
  }
  construireInstances() {
    this.identObjetDetailCommission = this.add(ObjetDetailCommission);
  }
  setDonnees(aDonnees) {
    this.afficher();
    this.getInstance(this.identObjetDetailCommission).setDonnees(aDonnees);
  }
  composeContenu() {
    return `<div id="${this.getInstance(this.identObjetDetailCommission).getNom()}" class="flex-contain flex-cols full-size"></div>`;
  }
}
module.exports = { ObjetFenetre_DetailCommission };
