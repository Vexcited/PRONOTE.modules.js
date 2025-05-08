const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMoteurImports } = require("ObjetMoteurImports.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreImport } = require("Enumere_GenreImport.js");
class DonneesListe_Import extends ObjetDonneesListe {
  constructor(
    aDonnees,
    aParams,
    aDonneesColonnes,
    aBareme,
    aAvecVisualiser,
    aAvecFormatDateUnique,
  ) {
    super(aDonnees);
    this.setOptions({ avecContenuTronque: true, avecEtatSaisie: false });
    this.moteur = new ObjetMoteurImports();
    this.tableReference = aParams.tableReference;
    this.mappingFormatImport = aParams.mappingFormatImport;
    this.donneesColonnes = aDonneesColonnes;
    this.avecBareme = aBareme.avecBareme;
    this.baremeAvecDecimales = aBareme.baremeAvecDecimales;
    this.avecVisualiser = aAvecVisualiser;
    this.avecFormatDateUnique = aAvecFormatDateUnique;
  }
  getValeur(aParams) {
    return aParams.article.cellules.get(aParams.colonne).strValeur;
  }
  getCouleurCellule(aParams) {
    let lColor = ObjetDonneesListe.ECouleurCellule.Gris;
    if (this.tableReference !== null && this.tableReference !== undefined) {
      const lEstAssociee = this.moteur.estColAssociee({
        col: aParams.colonne,
        mapping: this.mappingFormatImport,
        table: this.tableReference,
      });
      lColor = lEstAssociee
        ? ObjetDonneesListe.ECouleurCellule.Blanc
        : ObjetDonneesListe.ECouleurCellule.Gris;
    }
    return lColor;
  }
  getStyle(aParams) {
    const lAvecChampOblManquant =
      this.moteur.estAuMoinsUnChampObligatoireManquant({
        mapping: this.mappingFormatImport,
        table: this.tableReference,
      });
    if (lAvecChampOblManquant === true) {
      return "color:" + GCouleur.rouge + ";";
    }
    const lCellule = aParams.article.cellules.get(aParams.colonne);
    const lEstCelluleValide = this.moteur.estCelluleValide(
      {
        cellule: lCellule,
        mapping: this.mappingFormatImport,
        table: this.tableReference,
      },
      aParams.colonne,
      {
        avecBareme: this.avecBareme,
        baremeAvecDecimales: this.baremeAvecDecimales,
        cell: this.donneesColonnes.get(aParams.colonne).cellules.get(0),
      },
    );
    if (!lEstCelluleValide) {
      return "color:" + GCouleur.rouge + ";";
    }
  }
  estVisible(J) {
    if (!this.avecVisualiser) {
      if (
        this.Donnees.get(J).cellules !== undefined &&
        this.Donnees.get(J).cellules !== null
      ) {
        for (
          let i = 0, lNbr = this.Donnees.get(J).cellules.count();
          i < lNbr;
          i++
        ) {
          const lEstCelluleValide = this.moteur.estCelluleValide(
            {
              cellule: this.Donnees.get(J).cellules.get(i),
              mapping: this.mappingFormatImport,
              table: this.tableReference,
            },
            i,
            {
              avecBareme: this.avecBareme,
              baremeAvecDecimales: this.baremeAvecDecimales,
              cell: this.donneesColonnes.get(i).cellules.get(0),
            },
          );
          if (!lEstCelluleValide) {
            return true;
          }
        }
      }
      return J < 6;
    } else {
      if (!this.Donnees.get(J)) {
        return false;
      } else {
        return true;
      }
    }
  }
  avecMultiSelection() {
    return true;
  }
  avecEvenementSuppression() {
    return true;
  }
  avecEvenementApresSuppression() {
    return true;
  }
  surEdition(aParams, V) {
    this.moteur.editerCellule(
      aParams,
      aParams.colonne,
      V,
      this.avecFormatDateUnique,
    );
  }
  avecEvenementEdition() {
    return false;
  }
  autoriserChaineVideSurEdition() {
    return true;
  }
  avecEvenementApresEdition() {
    return true;
  }
  getHintForce(aParams) {
    let lChamp;
    const lChampOblManquant = this.moteur.champsObligatoiresNonAssocies({
      mapping: this.mappingFormatImport,
      table: this.tableReference,
    });
    if (lChampOblManquant.length > 0) {
      lChamp = lChampOblManquant[0];
      return GTraductions.getValeur("ImportExport.HintChpOlbManquant", [
        lChamp.nomRef,
      ]);
    } else {
      const lCellule = aParams.article.cellules.get(aParams.colonne);
      const lEstCelluleValide = this.moteur.estCelluleValide(
        {
          cellule: lCellule,
          mapping: this.mappingFormatImport,
          table: this.tableReference,
        },
        aParams.colonne,
        {
          avecBareme: this.avecBareme,
          baremeAvecDecimales: this.baremeAvecDecimales,
          cell: this.donneesColonnes.get(aParams.colonne).cellules.get(0),
        },
      );
      if (!lEstCelluleValide) {
        lChamp = this.moteur.getChampAssocieCol({
          col: aParams.colonne,
          mapping: this.mappingFormatImport,
          table: this.tableReference,
        });
        if (lChamp.Genre === EGenreImport.Enumere) {
          return GTraductions.getValeur("ImportExport.HintMauvaisEnumere", [
            lChamp.Contraintes,
          ]);
        } else {
          for (let j = 0, lNbr2 = lChamp.Contraintes.length; j < lNbr2; j++) {
            const lPos = lChamp.Contraintes[j].indexOf(":");
            const lContrainte = lChamp.Contraintes[j].slice(0, lPos - 1);
            const lParam = lChamp.Contraintes[j].slice(
              -(lChamp.Contraintes[j].length - lPos - 2),
            );
            switch (lContrainte) {
              case "longueur_maximum":
                if (lCellule.nbrChar > parseInt(lParam)) {
                  return GTraductions.getValeur(
                    "ImportExport.HintLongueurMax",
                    [lCellule.strValeur, lCellule.nbrChar, parseInt(lParam)],
                  );
                }
                break;
              case "longueur_minimum":
                if (lCellule.nbrChar < parseInt(lParam)) {
                  return GTraductions.getValeur(
                    "ImportExport.HintLongueurMin",
                    [lCellule.strValeur, lCellule.nbrChar, parseInt(lParam)],
                  );
                }
                break;
              case "type":
                if (
                  lParam === "integer" &&
                  lCellule.valeur !== parseInt(lCellule.strValeur)
                ) {
                  return GTraductions.getValeur(
                    "ImportExport.HintNombreEntier",
                    [lCellule.strValeur],
                  );
                }
                if (lParam === "double") {
                  return GTraductions.getValeur(
                    "ImportExport.HintNombreDouble",
                    [lCellule.strValeur],
                  );
                }
                break;
              case "minimum":
                if (lCellule.valeur < parseInt(lParam)) {
                  return GTraductions.getValeur("ImportExport.HintValeurMin", [
                    lParam,
                  ]);
                }
                break;
              case "maximum":
                if (lCellule.valeur > parseInt(lParam)) {
                  return GTraductions.getValeur("ImportExport.HintValeurMax", [
                    lParam,
                  ]);
                }
                break;
              case "defaut":
                break;
              default:
                break;
            }
          }
          if (lChamp.Genre === EGenreImport.Date) {
            const lFormat = this.avecFormatDateUnique
              ? "ImportExport.FormatDateUnique"
              : "ImportExport.FormatDateEurope";
            return GTraductions.getValeur(
              "ImportExport.HintMauvaisFormatDate",
              [GTraductions.getValeur(lFormat)],
            );
          }
          if (lChamp.Genre === lCellule.type) {
            if (this.avecBareme) {
              const lCellBareme = this.donneesColonnes
                .get(aParams.colonne)
                .cellules.get(0);
              if (
                parseFloat(lCellule.valeur) > parseFloat(lCellBareme.valeur)
              ) {
                if (!lCellBareme.strValeur || lCellBareme.strValeur === "0") {
                  return GTraductions.getValeur("ImportExport.HintValeurMax", [
                    GParametres.baremeNotation.getValeur(),
                  ]);
                } else {
                  return GTraductions.getValeur("ImportExport.HintValeurMax", [
                    lCellBareme.strValeur,
                  ]);
                }
              }
              return GTraductions.getValeur("FenetreDevoir.ValeurComprise", [
                "1,00",
                "100,00",
              ]);
            }
          }
          return GTraductions.getValeur("ImportExport.HintMauvaisGenre", [
            lCellule.strValeur,
          ]);
        }
      }
    }
  }
}
module.exports = { DonneesListe_Import };
