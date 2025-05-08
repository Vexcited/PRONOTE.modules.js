exports.ObjetCours = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const EGenreDirectionSlide_1 = require("EGenreDirectionSlide");
const UtilitaireEDTJournalier_1 = require("UtilitaireEDTJournalier");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetListeElements_1 = require("ObjetListeElements");
class ObjetCours extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.baseprogressionId = this.Nom + "_progression";
    this.dateActive = null;
    this.callbackPopup = null;
    this.options = {
      estCoursVisible: null,
      forcerClickCours: false,
      avecTrouEDT: true,
    };
  }
  setOptions(aOptions) {
    Object.assign(this.options, aOptions);
    return this;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeCours(aIndex, aIndexMS) {
        $(this.node).eventValidation(() => {
          let lCours = aInstance.listeCoursFormate.get(aIndex);
          if (aIndexMS >= 0 && lCours && lCours.listeCours) {
            lCours = lCours.listeCours.get(aIndexMS);
            if (aInstance.options.forcerClickCours === true) {
              UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.fermerFenetreCours.call(
                aInstance,
              );
            }
          }
          if (lCours.listeCours) {
            UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.popupCoursMultiple(
              aInstance,
              lCours,
              {
                indexCours: aIndex,
                indexCoursMultiple: aIndexMS,
                forcerClickCours: aInstance.options.forcerClickCours,
              },
            );
          } else {
            if (lCours && lCours.coursOriginal) {
              aInstance.callback.appel(lCours.coursOriginal);
            }
          }
        });
      },
      getNodeVisioCours: function (aNumeroCours, aIndexCours) {
        $(this.node).eventValidation(() => {
          const lCours = aInstance.listeCoursFormate.get(aIndexCours);
          if (lCours && lCours.coursOriginal) {
            let lCopieCours = lCours.coursOriginal;
            if (lCours.coursOriginal.coursMultiple) {
              lCopieCours =
                lCours.coursOriginal.listeCours.getElementParNumero(
                  aNumeroCours,
                );
            }
            UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.surClicVisioCours(
              lCopieCours,
            );
          }
        });
      },
    });
  }
  setDonnees(aParams) {
    if (aParams.listeCours) {
      this.listeCours = new ObjetListeElements_1.ObjetListeElements();
      aParams.listeCours.parcourir((aCours) => {
        if (
          !this.options.estCoursVisible ||
          this.options.estCoursVisible(aCours)
        ) {
          this.listeCours.add(aCours);
        }
      });
    }
    if (aParams.exclusions) {
      this.exclusions = aParams.exclusions;
    }
    if (aParams.joursStage) {
      this.joursStage = aParams.joursStage;
    }
    if (aParams.recreations) {
      this.recreations = aParams.recreations;
    }
    if (aParams.avecCoursAnnule) {
      this.avecCoursAnnule = aParams.avecCoursAnnule;
    }
    if (aParams.callbackPopup) {
      this.callbackPopup = aParams.callbackPopup;
    }
    this.jourCycleSelectionne = aParams.jourCycleSelectionne;
    this.avecIconeAppel = aParams.avecIconeAppel;
    const lSensInverse =
      !this.dateActive ||
      ObjetDate_1.GDate.estDateEgale(aParams.date, this.dateActive)
        ? EGenreDirectionSlide_1.EGenreDirectionSlide.Aucune
        : aParams.date < this.dateActive
          ? EGenreDirectionSlide_1.EGenreDirectionSlide.Droite
          : EGenreDirectionSlide_1.EGenreDirectionSlide.Gauche;
    this.absences = aParams.absences;
    this.dateActive = aParams.date;
    this.numeroSemaine = aParams.numeroSemaine;
    this.disponibilites = aParams.disponibilites;
    this.debutDemiPensionHebdo = aParams.debutDemiPensionHebdo;
    this.finDemiPensionHebdo = aParams.finDemiPensionHebdo;
    this.premierePlaceHebdoDuJour = aParams.premierePlaceHebdoDuJour;
    this.afficher(null, lSensInverse);
  }
  slideProgression(aPositionCours) {
    $("#" + (this.baseprogressionId + aPositionCours).escapeJQ()).toggleClass(
      "progDiv-open",
    );
  }
  construireAffichage() {
    if (!this.listeCours) {
      return "";
    }
    let lHtml = [];
    lHtml.push(this._composeEDTJournalier());
    if (
      this.listeCoursFormate === undefined ||
      this.listeCoursFormate.count() === 0
    ) {
      lHtml = [
        ObjetHtml_1.GHtml.composeFondAucuneDonnee(
          ObjetTraduction_1.GTraductions.getValeur("AucunCours"),
        ),
      ];
    }
    return lHtml.join("");
  }
  declencherEvenement(aNumeroCours) {
    this.callback.appel(this.listeCours.getElementParNumero(aNumeroCours));
  }
  _composeEDTJournalier() {
    const lParams = {
      listeCours: this.listeCours,
      date: this.dateActive,
      absences: this.absences,
      exclusions: this.exclusions,
      joursStage: this.joursStage,
      avecTrouEDT: this.options.avecTrouEDT,
      disponibilites: this.disponibilites,
      debutDemiPensionHebdo: this.debutDemiPensionHebdo,
      finDemiPensionHebdo: this.finDemiPensionHebdo,
      premierePlaceHebdoDuJour: this.premierePlaceHebdoDuJour,
      avecIconeAppel: this.avecIconeAppel,
      recreations: this.recreations,
      jourCycleSelectionne: this.jourCycleSelectionne,
    };
    const lDonnees =
      UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.formaterDonnees(
        lParams,
      );
    this.listeCoursFormate = lDonnees.listeDonnees;
    const H = [];
    if (this.listeCoursFormate) {
      H.push(
        IE.jsx.str(
          "h2",
          { class: "text-center ie-titre-couleur-lowercase m-top" },
          UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.getTitreSemaine(
            this.numeroSemaine,
          ),
        ),
      );
      H.push(
        lDonnees.soustitre
          ? IE.jsx.str(
              "h3",
              { class: ["text-center ie-sous-titre", lDonnees.soustitre.type] },
              lDonnees.soustitre.libelle,
            )
          : "",
      );
      H.push('<ul class="liste-cours" role="list">');
      this.listeCoursFormate.parcourir((aCours, aIndex) => {
        H.push(
          UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.composeCours.call(
            this,
            aCours,
            { indexCours: aIndex, forcerClickCours: true },
          ),
        );
      });
      H.push("</ul>");
    }
    return H.join("");
  }
}
exports.ObjetCours = ObjetCours;
