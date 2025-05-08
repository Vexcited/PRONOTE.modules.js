exports.ObjetFenetre_DetailAbsences = void 0;
const DonneesListe_DetailAbsences_1 = require("DonneesListe_DetailAbsences");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetFenetre_DetailAbsences extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.messageAucun = "";
  }
  construireInstances() {
    this.IdentListe = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListe,
      this.initialiserListe,
    );
  }
  initialiserListe(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      titre: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
      taille: 125,
    });
    lColonnes.push({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "ficheScolaire.titreColPeriode",
      ),
      taille: 200,
    });
    lColonnes.push({
      titre: ObjetTraduction_1.GTraductions.getValeur("fenetrePunition.motif"),
      taille: "100%",
    });
    lColonnes.push({
      titre: ObjetTraduction_1.GTraductions.getValeur("RegleAdminAbr"),
      taille: 25,
    });
    aInstance.setOptionsListe({ colonnes: lColonnes });
  }
  setDonnees(
    aListeDates,
    aDate,
    aCours,
    aEleve,
    aDonnees,
    aGenreRessource,
    aAvecARObservation = false,
  ) {
    let lEstSurCours = !!aCours;
    let lGenreRessource = aGenreRessource;
    if (
      (aCours === null || aCours === undefined) &&
      aGenreRessource === Enumere_Ressource_1.EGenreRessource.Absence
    ) {
      lGenreRessource = null;
    } else if (
      (aCours === null || aCours === undefined) &&
      lGenreRessource !== null &&
      lGenreRessource !== undefined
    ) {
      lEstSurCours = true;
    }
    this.afficher();
    switch (lGenreRessource) {
      case Enumere_Ressource_1.EGenreRessource.Absence:
      case Enumere_Ressource_1.EGenreRessource.Retard:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            { taille: 12, titre: "" },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
            },
            {
              taille: 75,
              titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
            },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.motif",
              ),
            },
            {
              taille: 25,
              titre: ObjetTraduction_1.GTraductions.getValeur("RegleAdminAbr"),
            },
          ],
        });
        break;
      case Enumere_Ressource_1.EGenreRessource.Infirmerie:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            { taille: 12, titre: "" },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
            },
            {
              taille: 100,
              titre:
                ObjetTraduction_1.GTraductions.getValeur("Heure") +
                " " +
                ObjetTraduction_1.GTraductions.getValeur("Absence.Depart"),
            },
            {
              taille: 100,
              titre:
                ObjetTraduction_1.GTraductions.getValeur("Heure") +
                " " +
                ObjetTraduction_1.GTraductions.getValeur("Absence.Retour"),
            },
          ],
        });
        break;
      case Enumere_Ressource_1.EGenreRessource.Punition:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            { taille: 12, titre: "" },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
            },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur("Absence.Nature"),
            },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.demandeur",
              ),
            },
          ],
        });
        break;
      case Enumere_Ressource_1.EGenreRessource.Exclusion:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            { taille: 12, titre: "" },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
            },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.motif",
              ),
            },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.demandeur",
              ),
            },
          ],
        });
        break;
      case Enumere_Ressource_1.EGenreRessource.Observation:
        if (aAvecARObservation) {
          this.getInstance(this.IdentListe).setOptionsListe({
            colonnes: [
              { taille: 12, titre: "" },
              {
                taille: 125,
                titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
              },
              {
                taille: "100%",
                titre: ObjetTraduction_1.GTraductions.getValeur("Commentaire"),
              },
              {
                taille: 75,
                titre: ObjetTraduction_1.GTraductions.getValeur(
                  "CarnetCorrespondance.LueLe",
                ),
              },
            ],
          });
        } else {
          this.getInstance(this.IdentListe).setOptionsListe({
            colonnes: [
              { taille: 12, titre: "" },
              {
                taille: 125,
                titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
              },
              {
                taille: "100%",
                titre: ObjetTraduction_1.GTraductions.getValeur("Commentaire"),
              },
            ],
          });
        }
        break;
      case Enumere_Ressource_1.EGenreRessource.Dispense:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            { taille: 12, titre: "" },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
            },
            {
              taille: 75,
              titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
            },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur("Commentaire"),
            },
          ],
        });
        break;
      case Enumere_Ressource_1.EGenreRessource.Sanction:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            { taille: 12, titre: "" },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
            },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.motif",
              ),
            },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.demandeur",
              ),
            },
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Duree"),
            },
          ],
        });
        break;
      default:
        this.getInstance(this.IdentListe).setOptionsListe({
          colonnes: [
            {
              taille: 125,
              titre: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
            },
            {
              taille: 200,
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "ficheScolaire.titreColPeriode",
              ),
            },
            {
              taille: "100%",
              titre: ObjetTraduction_1.GTraductions.getValeur(
                "fenetrePunition.motif",
              ),
            },
            {
              taille: 25,
              titre: ObjetTraduction_1.GTraductions.getValeur("RegleAdminAbr"),
            },
          ],
        });
        break;
    }
    if (aDonnees.listeAbsences.count()) {
      ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ContenuListe", true);
      ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ContenuMessage", false);
      this.getInstance(this.IdentListe).setDonnees(
        new DonneesListe_DetailAbsences_1.DonneesListe_DetailAbsences(
          lEstSurCours,
          aEleve,
          aDonnees.listeAbsences,
          lGenreRessource,
          aAvecARObservation,
        ),
      );
    } else {
      ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ContenuListe", false);
      ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ContenuMessage", true);
    }
    let lNbAbs = aDonnees.totalCoursManques;
    if (lNbAbs === 0) {
      $("#" + this.Nom.escapeJQ() + "_Message")
        .removeClass("FondBlanc Fenetre_Bordure")
        .addClass("AlignementMilieu")
        .html(this.messageAucun);
      $("#" + this.Nom.escapeJQ() + "_Total").hide();
    } else {
      $("#" + this.Nom.escapeJQ() + "_Message")
        .removeClass("AlignementMilieu")
        .addClass("FondBlanc Fenetre_Bordure");
      $("#" + this.Nom.escapeJQ() + "_Total").show();
    }
    if (lEstSurCours) {
      let lCleTraduction;
      let lEstAuPluriel = lNbAbs > 1;
      if (aGenreRessource === Enumere_Ressource_1.EGenreRessource.Absence) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.CoursManques"
          : "Absence.CoursManque";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Retard
      ) {
        lCleTraduction = lEstAuPluriel ? "Absence.Retards" : "Absence.Retard";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Infirmerie
      ) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.Infirmeries"
          : "Absence.Infirmerie";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Punition
      ) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.Punitions"
          : "Absence.Punition";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Exclusion
      ) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.Exclusions"
          : "Absence.Exclusion";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Dispense
      ) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.DispensesCour"
          : "Absence.DispenseCour";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Observation
      ) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.Observations"
          : "Absence.Observation";
      } else if (
        aGenreRessource === Enumere_Ressource_1.EGenreRessource.Sanction
      ) {
        lCleTraduction = lEstAuPluriel
          ? "Absence.Sanctions"
          : "Absence.Sanction";
      }
      if (lCleTraduction) {
        lNbAbs +=
          " " +
          ObjetTraduction_1.GTraductions.getValeur(
            lCleTraduction,
          ).toLowerCase();
      }
    }
    $("#" + this.Nom.escapeJQ() + "_Total").text(lNbAbs);
  }
  setDateDepuis(aDate) {}
  setMessageAucun(aMessage) {
    this.messageAucun = aMessage;
  }
  composeContenu() {
    const T = [];
    T.push(`<div class="flex-contain cols full-size flex-gap-s">`);
    T.push(
      `<div class="fluid-bloc flex-contain cols" id="${this.Nom}_ContenuListe">\n    <div class="fluid-bloc full-width" id="${this.getNomInstance(this.IdentListe)}"></div>\n    </div>`,
    );
    T.push(
      `<div class="fluid-bloc flex-contain flex-center justify-center" id="${this.Nom}_ContenuMessage" tabindex="0">\n    <div class="semi-bold" id="${this.Nom}_Message"></div>\n    </div>`,
    );
    T.push(
      `<div class="p-y p-x-l m-right-l semi-bold" id="${this.Nom}_Total" style="color:${GCouleur.blanc};background-color:${GCouleur.fenetre.cumul};"></div>`,
    );
    T.push(`</div>`);
    return T.join("");
  }
  evenementSurListe(aParametres) {
    this.setBoutonActif(
      1,
      aParametres.genreEvenement ===
        Enumere_EvenementListe_1.EGenreEvenementListe.Selection,
    );
  }
}
exports.ObjetFenetre_DetailAbsences = ObjetFenetre_DetailAbsences;
