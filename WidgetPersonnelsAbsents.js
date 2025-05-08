exports.WidgetPersonnelsAbsents = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDate_1 = require("ObjetDate");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
class WidgetPersonnelsAbsents extends ObjetWidget_1.Widget.ObjetWidget {
  creerObjetsPersonnelsAbsents() {
    this.ComboPersonnelsAbsents = ObjetIdentite_1.Identite.creerInstance(
      ObjetSaisie_1.ObjetSaisie,
      { pere: this, evenement: this._evenementComboPersonnelsAbsents },
    );
    if (
      !!this.donnees.listePersonnelsAbsents &&
      this.donnees.listePersonnelsAbsents.count() !== 0
    ) {
      this._initialiserComboPersonnelsAbsents(this.ComboPersonnelsAbsents);
    }
  }
  initialiserObjetsPersonnelsAbsents() {
    this.ComboPersonnelsAbsents.initialiser();
    this.ComboPersonnelsAbsents.setDonnees(this.donnees.listePersonnels, 0);
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    this.idContenu = this.Nom + "_Contenu";
    this.creerObjetsPersonnelsAbsents();
    this.ComboPersonnelsAbsents.Selection = 0;
    const lWidget = {
      html: this.composeWidgetPersonnelsAbsents(),
      nbrElements: null,
      afficherMessage:
        !this.donnees.listePersonnelsAbsents ||
        this.donnees.listePersonnelsAbsents.count() === 0,
      listeElementsGraphiques: [{ id: this.ComboPersonnelsAbsents.getNom() }],
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
    if (
      !!this.donnees.listePersonnelsAbsents &&
      this.donnees.listePersonnelsAbsents.count() !== 0
    ) {
      this.initialiserObjetsPersonnelsAbsents();
    }
  }
  composeWidgetPersonnelsAbsents() {
    const H = [];
    H.push('<div id="', this.idContenu, '">');
    H.push(this._composePersonnelsAbsents());
    H.push("</div>");
    return H.join("");
  }
  _initialiserComboPersonnelsAbsents(aObjet) {
    aObjet.setOptionsObjetSaisie({
      longueur: 100,
      avecBoutonsPrecSuiv: true,
      avecBoutonsPrecSuivVisiblesInactifs: false,
      labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
        "WAI.SelectionPersonnel",
      ),
    });
  }
  _evenementComboPersonnelsAbsents(aParams) {
    if (
      aParams.element &&
      aParams.genreEvenement ===
        Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection &&
      this.ComboPersonnelsAbsents.InteractionUtilisateur
    ) {
      ObjetHtml_1.GHtml.setHtml(
        this.idContenu,
        this._composePersonnelsAbsents(),
      );
    }
  }
  _composePersonnelsAbsents() {
    var _a;
    const H = [];
    const lPersonnel =
      (_a = this.donnees.listePersonnelsAbsents) === null || _a === void 0
        ? void 0
        : _a.get(this.ComboPersonnelsAbsents.Selection);
    if (lPersonnel !== undefined) {
      H.push('<ul class="liste-dates">');
      for (let i = 0, lNbr = lPersonnel.absences.count(); i < lNbr; i++) {
        H.push(
          '<li tabindex="0">',
          '<div class="wrap">',
          '<div class="bloc-date-conteneur">',
          ObjetDate_1.GDate.formatDate(
            lPersonnel.absences.get(i).dateDebutAbsence,
            "<div>%JJ</div><div>%MMM</div>",
          ),
          "</div>",
          '<div class="bloc-infos-conteneur">',
          lPersonnel.absences.get(i).detailAbsence,
          "</div>",
          "</div>",
          "</li>",
        );
      }
      H.push("</ul>");
    }
    return H.join("");
  }
}
exports.WidgetPersonnelsAbsents = WidgetPersonnelsAbsents;
