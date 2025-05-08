exports.DonneesListe_RecapAbs = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_RecapAbs extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees, aLigneCumul) {
    super(aDonnees);
    this.ligneCumul = aLigneCumul;
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEtatSaisie: false,
      avecTri: false,
    });
  }
  avecMenuContextuel() {
    return false;
  }
  getClass(aParams) {
    const lClasses = [];
    const lColonnesAlignesGauche = [
      DonneesListe_RecapAbs.colonnes.eleves,
      DonneesListe_RecapAbs.colonnes.classes,
      DonneesListe_RecapAbs.colonnes.dateNaissance,
      DonneesListe_RecapAbs.colonnes.regimes,
      DonneesListe_RecapAbs.colonnes.bourses,
    ];
    if (!lColonnesAlignesGauche.includes(aParams.idColonne)) {
      lClasses.push("AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  getClassTotal(aParams) {
    const lClasses = ["Gras"];
    const lColonnesAlignesGauche = [
      DonneesListe_RecapAbs.colonnes.eleves,
      DonneesListe_RecapAbs.colonnes.classes,
    ];
    if (!lColonnesAlignesGauche.includes(aParams.idColonne)) {
      lClasses.push("AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  avecEvenementEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RecapAbs.colonnes.nbAbsences:
        return aParams.article.nbAbs > 0;
      case DonneesListe_RecapAbs.colonnes.nbAbsRepas:
        return aParams.article.nbAbsRepas > 0;
      case DonneesListe_RecapAbs.colonnes.nbAbsInternat:
        return aParams.article.nbAbsInternat > 0;
      case DonneesListe_RecapAbs.colonnes.nbRetards:
        return aParams.article.nbRetards > 0;
      case DonneesListe_RecapAbs.colonnes.nbInfirmerie:
        return aParams.article.nbInfirmerie > 0;
    }
    return false;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_RecapAbs.colonnes.eleves:
        return aParams.article.eleve.getLibelle();
      case DonneesListe_RecapAbs.colonnes.classes:
        return aParams.article.classe.getLibelle();
      case DonneesListe_RecapAbs.colonnes.dateNaissance:
        return !!aParams.article.DateNaissance
          ? ObjetDate_1.GDate.formatDate(
              aParams.article.DateNaissance,
              "%JJ/%MM/%AAAA",
            )
          : "";
      case DonneesListe_RecapAbs.colonnes.regimes:
        return aParams.article.regime.getLibelle();
      case DonneesListe_RecapAbs.colonnes.bourses:
        return aParams.article.bourse;
      case DonneesListe_RecapAbs.colonnes.nbAbsences:
        return aParams.article.nbAbs > 0
          ? aParams.article.nbAbs.toString()
          : "-";
      case DonneesListe_RecapAbs.colonnes.totalAbsences:
        return aParams.article.totalAbs.toString();
      case DonneesListe_RecapAbs.colonnes.justifies:
        return aParams.article.nbJustifie.toString();
      case DonneesListe_RecapAbs.colonnes.injustifiees:
        return aParams.article.nbInjustifie.toString();
      case DonneesListe_RecapAbs.colonnes.nbAbsRepas:
        return aParams.article.nbAbsRepas > 0
          ? aParams.article.nbAbsRepas.toString()
          : "-";
      case DonneesListe_RecapAbs.colonnes.nbAbsInternat:
        return aParams.article.nbAbsInternat > 0
          ? aParams.article.nbAbsInternat.toString()
          : "-";
      case DonneesListe_RecapAbs.colonnes.nbRetards:
        return aParams.article.nbRetards > 0
          ? aParams.article.nbRetards.toString()
          : "-";
      case DonneesListe_RecapAbs.colonnes.nbInfirmerie:
        return aParams.article.nbInfirmerie > 0
          ? aParams.article.nbInfirmerie.toString()
          : "-";
      case DonneesListe_RecapAbs.colonnes.tauxAbsenteisme:
        return (
          ("" + Math.round(aParams.article.tauxAbs * 100) / 100).replace(
            ".",
            ",",
          ) + " %"
        );
      case DonneesListe_RecapAbs.colonnes.minutesRetard:
        return (
          aParams.article.minutesRetard +
          " " +
          ObjetTraduction_1.GTraductions.getValeur("RecapAbs.minutesCourt")
        );
    }
    return "";
  }
  getContenuTotal(aParams) {
    if (this.ligneCumul) {
      switch (aParams.idColonne) {
        case DonneesListe_RecapAbs.colonnes.eleves:
          return ObjetChaine_1.GChaine.format(
            ObjetTraduction_1.GTraductions.getValeur("RecapAbs.NbEleves"),
            [this.ligneCumul.nbEleves],
          );
        case DonneesListe_RecapAbs.colonnes.classes:
          return ObjetChaine_1.GChaine.format(
            ObjetTraduction_1.GTraductions.getValeur("RecapAbs.NbClasses"),
            [this.ligneCumul.nbClasses],
          );
        case DonneesListe_RecapAbs.colonnes.nbAbsences:
          return this.ligneCumul.nbAbsences || "-";
        case DonneesListe_RecapAbs.colonnes.totalAbsences:
          return this.ligneCumul.dureeTotale || "-";
        case DonneesListe_RecapAbs.colonnes.justifies:
          return this.ligneCumul.motifRecevableOui || "-";
        case DonneesListe_RecapAbs.colonnes.injustifiees:
          return this.ligneCumul.motifRecevableNon || "-";
        case DonneesListe_RecapAbs.colonnes.nbAbsRepas:
          return this.ligneCumul.nbAbsRepas || "-";
        case DonneesListe_RecapAbs.colonnes.nbAbsInternat:
          return this.ligneCumul.nbAbsInternat || "-";
        case DonneesListe_RecapAbs.colonnes.nbRetards:
          return this.ligneCumul.nbRetards || "-";
        case DonneesListe_RecapAbs.colonnes.nbInfirmerie:
          return this.ligneCumul.nbInfirmerie || "-";
        case DonneesListe_RecapAbs.colonnes.tauxAbsenteisme:
          return (
            (
              "" +
              Math.round(this.ligneCumul.tauxAbsenteismeTotal * 100) / 100
            ).replace(".", ",") + " %"
          );
        case DonneesListe_RecapAbs.colonnes.minutesRetard:
          return (
            this.ligneCumul.minutesRetardTotal +
            " " +
            ObjetTraduction_1.GTraductions.getValeur("RecapAbs.minutesCourt")
          );
      }
    }
    return "";
  }
}
exports.DonneesListe_RecapAbs = DonneesListe_RecapAbs;
DonneesListe_RecapAbs.colonnes = {
  eleves: "DL_RecapAbs_eleves",
  classes: "DL_RecapAbs_classes",
  dateNaissance: "DL_RecapAbs_dateNaiss",
  regimes: "DL_RecapAbs_regimes",
  bourses: "DL_RecapAbs_bourses",
  nbAbsences: "DL_RecapAbs_nbAbs",
  totalAbsences: "DL_RecapAbs_totalAbs",
  justifies: "DL_RecapAbs_just",
  injustifiees: "DL_RecapAbs_injust",
  tauxAbsenteisme: "DL_RecapAbs_txAbs",
  nbAbsRepas: "DL_RecapAbs_nbAbsRepas",
  nbAbsInternat: "DL_RecapAbs_nbAbsInt",
  nbRetards: "DL_RecapAbs_nbRet",
  minutesRetard: "DL_RecapAbs_minutesRet",
  nbInfirmerie: "DL_RecapAbs_nbInfirmerie",
};
