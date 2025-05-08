const { ObjetFiche } = require("ObjetFiche.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetVS_SaisieAbsencePN } = require("ObjetVS_SaisieAbsencePN.js");
class ObjetFiche_SaisieAbsence extends ObjetFiche {
  constructor(...aParams) {
    super(...aParams);
    this.largeurMax = 500;
    this.hauteurMax = 1250;
    this.idScroll = this.Nom + "_scroll";
    this.objetDetailVS = new ObjetVS_SaisieAbsencePN(
      this.Nom + ".objetDetailVS",
      null,
      this,
      this.evntDetailVS,
    );
    this.objetDetailVS.setOptions({
      avecValidation: false,
      callbackRetour: () => {
        this.fermer();
      },
    });
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("AbsenceVS.PrevenirAbsenceParent"),
      largeur: 350,
      hauteur: null,
      avecTailleSelonContenu: true,
      modale: true,
      positionnerFenetreSurAfficher: true,
    });
  }
  evntDetailVS(aGenre, aParams) {
    this.callback.appel(aGenre, aParams);
  }
  setOptions(aOptions) {
    $.extend(this.options, aOptions);
  }
  setDonnees(aAbsence) {
    this.element = aAbsence;
    this.afficherFiche({
      positionSurSouris: true,
      positionSurSourisSiAffiche: true,
    });
    this.objetDetailVS.initialiser();
    this.objetDetailVS.setDonnees(this.element, {
      id: this.objetDetailVS.getNom(),
      estConteneur: true,
      listeMotifsAbsences: GEtatUtilisateur.listeMotifsAbsences,
    });
  }
  composeContenu() {
    const H = [];
    H.push('<div class="ifc_RecapVS theme-cat-viescolaire">');
    H.push(
      '<div id="',
      this.objetDetailVS.getNom(),
      '" class="ifc_RecapVS_EcranElement_Content VSFiche"></div>',
    );
    H.push("</div>");
    return H.join("");
  }
  surPreAffichage() {
    this.objetDetailVS.initialiser();
  }
}
module.exports = { ObjetFiche_SaisieAbsence };
