exports.ObjetParametresAffichageMenuOnglets = void 0;
const ParametresAffichage_1 = require("ParametresAffichage");
const ParametresAffichageDivers_1 = require("ParametresAffichageDivers");
const ParametresAffichageOnglet_1 = require("ParametresAffichageOnglet");
const Enumere_Divers_1 = require("Enumere_Divers");
class ObjetParametresAffichageMenuOnglets extends ParametresAffichage_1.ObjetParametresAffichage {
  constructor(
    aNom,
    aHauteur,
    aCouleur,
    aAlignement,
    aOrientation,
    aSeparateur,
    aPAActif,
    aPAInactif,
  ) {
    super(aNom);
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "hauteur",
        aHauteur !== null && aHauteur !== undefined ? aHauteur : 20,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "couleur",
        aCouleur !== null && aCouleur !== undefined ? aCouleur : "black",
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "alignement",
        aAlignement !== null && aAlignement !== undefined
          ? aAlignement
          : Enumere_Divers_1.EAlignementHorizontal.gauche,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "orientation",
        aOrientation !== null && aOrientation !== undefined
          ? aOrientation
          : Enumere_Divers_1.EOrientation.horizontal,
      ),
    );
    this.addParametre(
      aSeparateur !== null && aSeparateur !== undefined
        ? aSeparateur
        : new ParametresAffichageDivers_1.ParametresAffichageSeparateur(
            "separateur",
          ),
    );
    this.addParametre(
      aPAActif !== null && aPAActif !== undefined
        ? aPAActif
        : new ParametresAffichageOnglet_1.ParametresAffichageOnglet(
            "parametresAffichageActif",
          ),
    );
    this.addParametre(
      aPAInactif !== null && aPAInactif !== undefined
        ? aPAInactif
        : new ParametresAffichageOnglet_1.ParametresAffichageOnglet(
            "parametresAffichageInactif",
          ),
    );
  }
  getHauteur() {
    return this.getParametre("hauteur").getValeur();
  }
  getCouleur() {
    return this.getParametre("couleur").getValeur();
  }
  getAlignement() {
    return this.getParametre("alignement").getValeur();
  }
  getOrientation() {
    return this.getParametre("orientation").getValeur();
  }
  getAvecSeparateur() {
    return this.getParametre("separateur").getParametre("avec").getValeur();
  }
  getCouleurSeparateur() {
    return this.getParametre("separateur").getParametre("couleur").getValeur();
  }
  getEpaisseurSeparateur() {
    return this.getParametre("separateur")
      .getParametre("epaisseur")
      .getValeur();
  }
  getAlignementHorizontalSeparateur() {
    return this.getParametre("separateur")
      .getParametre("alignementHorizontal")
      .getValeur();
  }
  getParametresAffichageActif() {
    return this.getParametre("parametresAffichageActif");
  }
  getParametresAffichageInactif() {
    return this.getParametre("parametresAffichageInactif");
  }
}
exports.ObjetParametresAffichageMenuOnglets =
  ObjetParametresAffichageMenuOnglets;
