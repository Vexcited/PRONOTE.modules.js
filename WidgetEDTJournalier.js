exports.WidgetEDTJournalier = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const tag_1 = require("tag");
const UtilitaireEDTJournalier_1 = require("UtilitaireEDTJournalier");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetEDTJournalier extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.optionsFenetre = {};
    this.parametres = {
      avecCoursAnnule: true,
      avecCoursAnnulesSuperposes: !GEtatUtilisateur.estEspacePourEleve(),
      avecNomProfesseur: GEtatUtilisateur.estEspacePourEleve(),
    };
    this.afficherProchainJour = false;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeCours: function (aIndex) {
        $(this.node).on("click", () => {
          if (aInstance.listeCoursFormate) {
            const lCours = aInstance.listeCoursFormate.get(aIndex);
            if (lCours.listeCours) {
              UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.popupCoursMultiple(
                aInstance,
                lCours,
                { indexCours: aIndex, forcerClickCours: false },
              );
            }
          }
        });
      },
      getNodeVisioCours: function (aNumeroCours, aIndexCours) {
        $(this.node).on("click", () => {
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
  formatListeCours(aListeCours, aDate) {
    let lListeCours = new ObjetListeElements_1.ObjetListeElements();
    lListeCours = aListeCours.getListeElements((aElement) => {
      return ObjetDate_1.GDate.estJourEgal(aDate, aElement.DateDuCours);
    });
    return lListeCours;
  }
  construire(aParams) {
    this.donnees = aParams.instance.donnees;
    this.donneesRequete = aParams.instance.donneesRequete;
    this.donnees.EDT.jourSelectionne =
      this.donneesRequete.EDT.date || this.donnees.EDT.dateSelection;
    this.listeCours = this.formatListeCours(
      aParams.donnees.listeCours,
      this.donnees.EDT.jourSelectionne,
    );
    this._creerObjetsEDT();
    const lWidget = {
      html: this._composeWidgetEDTJournalier(),
      titre: [
        Enumere_Espace_1.EGenreEspace.Accompagnant,
        Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
      ].includes(GEtatUtilisateur.GenreEspace)
        ? ObjetTraduction_1.GTraductions.getValeur("accueil.monEmploiDuTemps")
        : "",
      hint: ObjetTraduction_1.GTraductions.getValeur("accueil.emploiDuTemps"),
      nbrElements: null,
      afficherMessage: false,
      listeElementsGraphiques: [
        { id: this.dateEDT ? this.dateEDT.getNom() : null },
      ],
    };
    $.extend(true, this.donnees.EDT, lWidget);
    aParams.construireWidget(this.donnees.EDT);
    this._initialiserObjetsEDT();
  }
  _initialiserDateEDT(aInstance) {
    aInstance.setOptionsObjetCelluleDate({
      formatDate: "[%JJJ %JJ %MMM]",
      avecBoutonsPrecedentSuivant: true,
      classeCSSTexte: "Maigre",
      largeurComposant: 100,
    });
    aInstance.setParametresFenetre(
      GParametres.PremierLundi,
      GParametres.PremiereDate,
      GParametres.DerniereDate,
      GParametres.JoursOuvres,
      this.applicationSco.droits.get(
        ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
      ),
    );
  }
  _evenementDateEDT(aDate) {
    const lNumeroSemaine = IE.Cycles.cycleDeLaDate(aDate);
    this.donneesRequete.EDT.date = aDate;
    this.donneesRequete.EDT.numeroSemaine = lNumeroSemaine;
    this.donnees.EDT.jourSelectionne = aDate;
    this.donnees.EDT.numeroSemaine = lNumeroSemaine;
    this.callback.appel(
      this.donnees.EDT.genre,
      Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
    );
  }
  evenementProchaineDate() {
    if (this.donnees && this.donnees.EDT && this.donnees.EDT.prochaineDate) {
      this.donnees.EDT.jourSelectionne = this.donnees.EDT.prochaineDate;
      this.donneesRequete.EDT.date = this.donnees.EDT.prochaineDate;
      this.donneesRequete.EDT.numeroSemaine = IE.Cycles.cycleDeLaDate(
        this.donnees.EDT.prochaineDate,
      );
      this.listeCours = this.formatListeCours(
        this.donnees.EDT.listeCours,
        this.donnees.EDT.prochaineDate,
      );
      this.donnees.EDT.prochaineDate = null;
      this.afficherProchainJour = true;
      this.actualiserWidgetEDT();
    }
  }
  actualiserWidgetEDT() {
    const lWidget = {
      html: this._composeWidgetEDTJournalier(),
      titre: [
        Enumere_Espace_1.EGenreEspace.Accompagnant,
        Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
      ].includes(GEtatUtilisateur.GenreEspace)
        ? ObjetTraduction_1.GTraductions.getValeur("accueil.monEmploiDuTemps")
        : "",
      hint: ObjetTraduction_1.GTraductions.getValeur("accueil.emploiDuTemps"),
      nbrElements: null,
      afficherMessage: false,
      listeElementsGraphiques: [
        { id: this.dateEDT ? this.dateEDT.getNom() : null },
      ],
    };
    $.extend(true, this.donnees.EDT, lWidget);
    UtilitaireWidget_1.UtilitaireWidget.actualiserWidget(this);
  }
  _composeWidgetEDTJournalier() {
    const lParams = {
      listeCours: this.listeCours,
      date: this.donneesRequete.EDT.date || this.donnees.EDT.dateSelection,
      exclusions:
        this.donnees.EDT.absences && this.donnees.EDT.absences.joursCycle,
      joursStage: this.donnees.EDT.joursStage,
      disponibilites: this.donnees.EDT.disponibilites,
      avecTrouEDT: true,
      avecIconeAppel: true,
      debutDemiPensionHebdo: this.donnees.EDT.debutDemiPensionHebdo,
      finDemiPensionHebdo: this.donnees.EDT.finDemiPensionHebdo,
      premierePlaceHebdoDuJour: this.donnees.EDT.premierePlaceHebdoDuJour,
      jourCycleSelectionne: 0,
    };
    if (this.donnees.EDT.prochaineDate) {
      const lEstJourCourant = ObjetDate_1.GDate.estJourCourant(lParams.date);
      const lPlaceCourante = ObjetDate_1.GDate.dateEnPlaceHebdomadaire(
        new Date(),
      );
      if (this.listeCours.count() === 0) {
        this.evenementProchaineDate();
        return;
      } else {
        const lDernierCours = this.listeCours.get(this.listeCours.count() - 1);
        if (lDernierCours) {
          const lEstEnCours =
            lEstJourCourant &&
            lPlaceCourante >= lDernierCours.Debut &&
            lPlaceCourante <= lDernierCours.Fin;
          if (
            lEstJourCourant &&
            lDernierCours.numeroSemaine &&
            lPlaceCourante > lDernierCours.place &&
            !lEstEnCours
          ) {
            this.evenementProchaineDate();
            return;
          }
        }
      }
    }
    lParams.jourCycleSelectionne = this.afficherProchainJour
      ? this.donnees.EDT.prochainJourCycle
      : this.donnees.EDT.jourCycleSelectionne;
    const lDonnees =
      UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.formaterDonnees(
        lParams,
      );
    this.listeCoursFormate = lDonnees.listeDonnees;
    const lNumeroSemaine =
      this.donneesRequete.EDT && this.donneesRequete.EDT.numeroSemaine
        ? this.donneesRequete.EDT.numeroSemaine
        : this.numeroSemaineParDefaut;
    const H = [];
    H.push(
      (0, tag_1.tag)(
        "h2",
        {
          class: "text-center ie-titre-couleur-lowercase m-top m-bottom",
          tabindex: 0,
        },
        UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.getTitreSemaine(
          lNumeroSemaine,
        ),
      ),
    );
    if (this.listeCoursFormate && this.listeCoursFormate.count() > 0) {
      H.push(
        lDonnees.soustitre
          ? (0, tag_1.tag)(
              "h3",
              { class: ["text-center ie-sous-titre", lDonnees.soustitre.type] },
              lDonnees.soustitre.libelle,
            )
          : "",
      );
      H.push('<ul class="liste-cours m-top-l" role="list">');
      this.listeCoursFormate.parcourir((aCours, aIndex) => {
        H.push(
          UtilitaireEDTJournalier_1.UtilitaireEDTJournalier.composeCours(
            aCours,
            { indexCours: aIndex },
          ),
        );
      });
      H.push("</ul>");
    } else {
    }
    return H.join("");
  }
  _creerObjetsEDT() {
    this.dateEDT = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleDate_1.ObjetCelluleDate,
      { pere: this, evenement: this._evenementDateEDT },
    );
    this._initialiserDateEDT(this.dateEDT);
  }
  _initialiserObjetsEDT() {
    if (this.dateEDT) {
      const lDate =
        this.donneesRequete.EDT.date || this.donnees.EDT.dateSelection;
      this.dateEDT.initialiser();
      this.dateEDT.setDonnees(lDate);
      this.donnees.EDT.numeroSemaine = IE.Cycles.cycleDeLaDate(lDate);
    }
  }
}
exports.WidgetEDTJournalier = WidgetEDTJournalier;
