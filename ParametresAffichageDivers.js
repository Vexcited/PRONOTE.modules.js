exports.ParametresAffichageSeparateur =
  exports.ParametresAffichageCoinBordure =
  exports.ParametresAffichageBordure =
  exports.ParametresAffichageTexte =
    void 0;
const ParametresAffichage_1 = require("ParametresAffichage");
const Enumere_Divers_1 = require("Enumere_Divers");
class ParametresAffichageTexte extends ParametresAffichage_1.ObjetParametresAffichage {
  constructor(
    aNom,
    aCouleur,
    aTaillePolice,
    aGras,
    aSouligne,
    aAlignementHorizontal,
  ) {
    super(aNom);
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "couleur",
        aCouleur !== null && aCouleur !== undefined ? aCouleur : "black",
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "taillePolice",
        aTaillePolice !== null && aTaillePolice !== undefined
          ? aTaillePolice
          : 10,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "gras",
        aGras !== null && aGras !== undefined ? aGras : false,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "souligne",
        aSouligne !== null && aSouligne !== undefined ? aSouligne : false,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "alignementHorizontal",
        aAlignementHorizontal !== null && aAlignementHorizontal !== undefined
          ? aAlignementHorizontal
          : Enumere_Divers_1.EAlignementHorizontal.gauche,
      ),
    );
  }
  setCouleur(aCouleur, aCouleurSelection, aCouleurSurvol) {
    this.getParametre("couleur").setValeur(
      aCouleur,
      aCouleurSelection,
      aCouleurSurvol,
    );
  }
  setTaillePolice(aTaille, aTailleSelection, aTailleSurvol) {
    this.getParametre("taillePolice").setValeur(
      aTaille,
      aTailleSelection,
      aTailleSurvol,
    );
  }
  setGras(aBase, aSelection, aSurvol) {
    this.getParametre("gras").setValeur(aBase, aSelection, aSurvol);
  }
  setSouligne(aBase, aSelection, aSurvol) {
    this.getParametre("souligne").setValeur(aBase, aSelection, aSurvol);
  }
  setAlignementHorizontal(aBase, aSelection, aSurvol) {
    this.getParametre("alignementHorizontal").setValeur(
      aBase,
      aSelection,
      aSurvol,
    );
  }
}
exports.ParametresAffichageTexte = ParametresAffichageTexte;
class ParametresAffichageCoinBordure extends ParametresAffichage_1.ObjetParametresAffichage {
  constructor(aNom, aCouleur, aEpaisseur) {
    super(aNom);
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "couleur",
        aCouleur !== null && aCouleur !== undefined ? aCouleur : "gray",
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "epaisseur",
        aEpaisseur !== null && aEpaisseur !== undefined ? aEpaisseur : 2,
      ),
    );
  }
  setCouleur(aBase, aSelection, aSurvol) {
    this.getParametre("couleur").setValeur(aBase, aSelection, aSurvol);
  }
  setEpaisseur(aBase, aSelection, aSurvol) {
    this.getParametre("epaisseur").setValeur(aBase, aSelection, aSurvol);
  }
}
exports.ParametresAffichageCoinBordure = ParametresAffichageCoinBordure;
class ParametresAffichageBordure extends ParametresAffichage_1.ObjetParametresAffichage {
  constructor(aNom, aAvec, aCoinSG, aCoinID) {
    super(aNom);
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "avec",
        aAvec !== null && aAvec !== undefined ? aAvec : false,
      ),
    );
    this.addParametre(
      aCoinSG !== null && aCoinSG !== undefined
        ? aCoinSG
        : new ParametresAffichageCoinBordure("coinSuperieurGauche"),
    );
    this.addParametre(
      aCoinID !== null && aCoinID !== undefined
        ? aCoinID
        : new ParametresAffichageCoinBordure("coinInferieurDroit"),
    );
  }
}
exports.ParametresAffichageBordure = ParametresAffichageBordure;
class ParametresAffichageSeparateur extends ParametresAffichage_1.ObjetParametresAffichage {
  constructor(aNom, aAvec, aCouleur, aEpaisseur, aAlignementH, aAlignementV) {
    super(aNom);
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "avec",
        aAvec !== null && aAvec !== undefined ? aAvec : false,
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
        "epaisseur",
        aEpaisseur !== null && aEpaisseur !== undefined ? aEpaisseur : 4,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "alignementHorizontal",
        aAlignementH !== null && aAlignementH !== undefined
          ? aAlignementH
          : Enumere_Divers_1.EAlignementHorizontal.droit,
      ),
    );
    this.addParametre(
      new ParametresAffichage_1.ParametreAffichage(
        "alignementVertical",
        aAlignementV !== null && aAlignementV !== undefined
          ? aAlignementV
          : Enumere_Divers_1.EAlignementVertical.bas,
      ),
    );
  }
}
exports.ParametresAffichageSeparateur = ParametresAffichageSeparateur;
