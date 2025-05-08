exports.DonneesListe_RecapFeuilleAppel = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_RecapFeuilleAppel extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees, aLigneCumul) {
    super(aDonnees);
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEtatSaisie: false,
      avecTri: false,
    });
    this.ligneCumul = aLigneCumul;
  }
  estUneColonneRubriqueObs(aIdColonne) {
    return (
      aIdColonne.indexOf(
        DonneesListe_RecapFeuilleAppel.colonnes.prefixe_dyn,
      ) === 0
    );
  }
  getIndiceRubriqueObsDeColonne(aIdColonne) {
    return parseInt(
      aIdColonne.substring(
        DonneesListe_RecapFeuilleAppel.colonnes.prefixe_dyn.length,
      ),
    );
  }
  avecMenuContextuel() {
    return false;
  }
  getClass(aParams) {
    const lClasses = [];
    if (this.estUneColonneRubriqueObs(aParams.idColonne)) {
      lClasses.push("AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  getClassTotal(aParams) {
    const lClasses = ["Gras"];
    if (
      ![
        DonneesListe_RecapFeuilleAppel.colonnes.eleves,
        DonneesListe_RecapFeuilleAppel.colonnes.classes,
      ].includes(aParams.idColonne)
    ) {
      lClasses.push("AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  avecEvenementEdition(aParams) {
    if (this.estUneColonneRubriqueObs(aParams.idColonne)) {
      const lIndiceRubObs = this.getIndiceRubriqueObsDeColonne(
        aParams.idColonne,
      );
      const lElt =
        aParams.article.listeRubriquesObservations.get(lIndiceRubObs);
      return !!lElt && lElt.nbObs > 0;
    }
    return false;
  }
  getValeur(aParams) {
    if (this.estUneColonneRubriqueObs(aParams.idColonne)) {
      const lIndiceRubObs = this.getIndiceRubriqueObsDeColonne(
        aParams.idColonne,
      );
      const lElt =
        aParams.article.listeRubriquesObservations.get(lIndiceRubObs);
      return !!lElt && lElt.nbObs > 0 ? lElt.nbObs.toString() : "-";
    } else {
      switch (aParams.idColonne) {
        case DonneesListe_RecapFeuilleAppel.colonnes.eleves:
          return aParams.article.eleve.getLibelle();
        case DonneesListe_RecapFeuilleAppel.colonnes.classes:
          return aParams.article.classe.getLibelle();
        case DonneesListe_RecapFeuilleAppel.colonnes.regimes:
          return aParams.article.regime.getLibelle();
      }
    }
    return "";
  }
  getContenuTotal(aParams) {
    if (this.ligneCumul) {
      if (this.estUneColonneRubriqueObs(aParams.idColonne)) {
        const lIndiceRubObs = this.getIndiceRubriqueObsDeColonne(
          aParams.idColonne,
        );
        const lElt =
          this.ligneCumul.listeRubriquesObservations.get(lIndiceRubObs);
        return !!lElt && lElt.nbObs > 0 ? lElt.nbObs : "-";
      } else {
        switch (aParams.idColonne) {
          case DonneesListe_RecapFeuilleAppel.colonnes.eleves:
            return ObjetChaine_1.GChaine.format(
              ObjetTraduction_1.GTraductions.getValeur("RecapAbs.NbEleves"),
              [this.ligneCumul.nbEleves],
            );
          case DonneesListe_RecapFeuilleAppel.colonnes.classes:
            return ObjetChaine_1.GChaine.format(
              ObjetTraduction_1.GTraductions.getValeur("RecapAbs.NbClasses"),
              [this.ligneCumul.nbClasses],
            );
        }
      }
    }
    return "";
  }
}
exports.DonneesListe_RecapFeuilleAppel = DonneesListe_RecapFeuilleAppel;
DonneesListe_RecapFeuilleAppel.colonnes = {
  eleves: "eleves",
  classes: "classes",
  regimes: "regimes",
  prefixe_dyn: "dyn",
};
