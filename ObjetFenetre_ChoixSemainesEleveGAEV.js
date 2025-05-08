const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_ChoixSemainesEleveGAEV extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur(
        "ChoixSemainesEleveGAEV.ReporterElevesGroupe",
      ),
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
    this.numeroSemaine = IE.Cycles.cycleCourant();
  }
  setDonnees(aCours, aSemaine) {
    this.semaine = aSemaine;
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      semaines: {
        combo: {
          init: function (aInstance) {
            aInstance.setOptionsObjetSaisie({
              longueur: 250,
              texteEdit: GTraductions.getValeur(
                "ChoixSemainesEleveGAEV.AffecterElevesGroupeDeCycle",
              ),
              classTexteEdit: "",
            });
          },
          getDonnees: function (aDonnees) {
            if (aDonnees) {
              return;
            }
            const lListe = new ObjetListeElements();
            const lNbCycle = IE.Cycles.nombreCyclesAnneeScolaire();
            const lCycleCourant = IE.Cycles.cycleCourant();
            for (
              let lNumeroCycle = 1;
              lNumeroCycle <= lNbCycle;
              lNumeroCycle++
            ) {
              let lLibelle =
                GTraductions.getValeur("Semaine") +
                " " +
                lNumeroCycle.toString();
              if (lCycleCourant === lNumeroCycle) {
                lLibelle +=
                  " " +
                  GTraductions.getValeur("ChoixSemainesEleveGAEV.EnCours");
              }
              lLibelle += GDate.formatDate(
                IE.Cycles.dateDebutCycle(lNumeroCycle),
                " (%JJ/%MM/%AAAA",
              );
              lLibelle += GDate.formatDate(
                IE.Cycles.dateDernierJourOuvreCycle(lNumeroCycle),
                " - %JJ/%MM/%AAAA)",
              );
              lListe.addElement(new ObjetElement(lLibelle, 0, lNumeroCycle));
            }
            return lListe;
          },
          getIndiceSelection: function () {
            return this.instance.numeroSemaine - 1;
          },
          event: function (aParametres) {
            if (
              aParametres.genreEvenement ===
                EGenreEvenementObjetSaisie.selection &&
              aParametres.element
            ) {
              this.instance.numeroSemaine = aParametres.element.getGenre();
            }
          },
        },
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push('<ie-combo ie-model="semaines.combo"><ie-combo>');
    return T.join("");
  }
  surValidation(ANumeroBouton) {
    this.fermer();
    this.callback.appel(ANumeroBouton, this.numeroSemaine);
  }
}
module.exports = ObjetFenetre_ChoixSemainesEleveGAEV;
