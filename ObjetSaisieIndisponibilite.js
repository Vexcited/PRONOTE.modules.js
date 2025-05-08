const { Identite } = require("ObjetIdentite.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const ObjetFenetre_SaisieDisposRencontre = require("ObjetFenetre_SaisieDisposRencontre.js");
const ObjetRequeteSaisieRencontreIndisponibilites = require("ObjetRequeteSaisieRencontreIndisponibilites.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { tag } = require("tag.js");
const { GDate } = require("ObjetDate.js");
const { TUtilitaireRencontre } = require("UtilitaireRencontres.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
class ObjetSaisieIndisponibilite extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.donneesRecues = false;
  }
  setDonnees(aDonnees) {
    this.donneesRecues = true;
    this.session = aDonnees.session;
    this.indisponibilites = aDonnees.indisponibilites;
    this.placeFinSession =
      this.indisponibilites.placeDebutSession +
      this.indisponibilites.dureeSession;
    this.pas = 5;
    this.placesDisponibilites =
      TUtilitaireRencontre.calculePlacesDisponibilites(
        this.indisponibilites.placeDebutSession,
        this.placeFinSession,
        this.pas,
        this.indisponibilites.placesIndisponibilitesPersonnelles,
      );
    this.placesDisponibilites.parcourir((aPlage) => {
      aPlage.dateDebut = TUtilitaireRencontre.getPlaceEnDate(aPlage.placeDebut);
      aPlage.dateFin = TUtilitaireRencontre.getPlaceEnDate(aPlage.placeFin);
    });
    this.actualiser();
  }
  actualiser() {
    GHtml.setHtml(this.Nom, this.construireAffichage(), {
      controleur: this.controleur,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      btnModifier: {
        event: function () {
          _ouvrirFenetreModifierDispo.call(aInstance);
        },
      },
    });
  }
  construireAffichage() {
    if (this.donneesRecues) {
      return _composeDisponibilites.call(this);
    }
    return "";
  }
}
function _ouvrirFenetreModifierDispo() {
  const lParam = {
    heureDebutSession: TUtilitaireRencontre.getPlaceEnDate(
      this.indisponibilites.placeDebutSession,
    ),
    heureFinSession: TUtilitaireRencontre.getPlaceEnDate(this.placeFinSession),
    listePlagesDispos: this.placesDisponibilites,
  };
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_SaisieDisposRencontre, {
    pere: this,
    evenement: function (aNumeroBouton, aListeDispos) {
      if (aNumeroBouton === 1) {
        this.placesDisponibilites = aListeDispos;
        this.actualiser();
        const lPlacesIndisponibilitesPersonnelles =
          _calculePlacesIndisponibles.call(this, aListeDispos);
        new ObjetRequeteSaisieRencontreIndisponibilites(
          this,
          this.Evenement,
        ).lancerRequete({
          session: this.session,
          indisponibilites: lPlacesIndisponibilitesPersonnelles,
        });
      }
    },
  }).setDonnees(lParam);
}
function _composeDisponibilites() {
  const H = [];
  const lDispos = [];
  if (this.placesDisponibilites) {
    this.placesDisponibilites.parcourir((aPlage) => {
      if (aPlage.dateDebut && aPlage.dateFin) {
        lDispos.push(
          `<li>${GTraductions.getValeur("Rencontres.DeA", [GDate.formatDate(aPlage.dateDebut, "%hh:%mm"), GDate.formatDate(aPlage.dateFin, "%hh:%mm")])}</li>`,
        );
      }
    });
  }
  H.push(
    tag(
      "div",
      { class: ["zone-indisponiblites"] },
      tag("span", GTraductions.getValeur("Rencontres.disponiblePourLaSession")),
      tag("ul", { class: ["liste-disponibilites"] }, lDispos.join("")),
      tag(
        "div",
        { class: ["flex-contain", "self-end", "m-right-l", "m-bottom-xl"] },
        tag(
          "ie-bouton",
          { "ie-model": "btnModifier", class: ["themeBoutonNeutre"] },
          GTraductions.getValeur("Modifier"),
        ),
      ),
    ),
  );
  return H.join("");
}
function _calculePlacesIndisponibles(aListeDisponibilites) {
  const lPlaceDebutHeurePleine =
    TUtilitaireRencontre.getPlaceHeurePleinePrecedente(
      this.indisponibilites.placeDebutSession,
      this.pas,
    );
  const lFuncPlaceEstContenueDans = function (aPlace, aListeDisponibilites) {
    let lEstContenue = false;
    const lDatePourPlace = TUtilitaireRencontre.getPlaceEnDate(aPlace);
    let lBorneDebut = null;
    let lBorneFin = null;
    aListeDisponibilites.parcourir((aPlage) => {
      lBorneDebut = aPlage.dateDebut;
      lBorneFin = aPlage.dateFin;
      if (
        (!lBorneDebut || lDatePourPlace >= lBorneDebut) &&
        (!lBorneFin || lDatePourPlace < lBorneFin)
      ) {
        lEstContenue = true;
        return;
      }
    });
    return lEstContenue;
  };
  const lPlacesDisponibilitesPersonnelles = new TypeEnsembleNombre();
  const lPlacesIndisponibilitesPersonnelles = new TypeEnsembleNombre();
  for (
    let i = this.indisponibilites.placeDebutSession;
    i < this.placeFinSession;
    i += this.pas
  ) {
    if (lFuncPlaceEstContenueDans(i, aListeDisponibilites)) {
      lPlacesDisponibilitesPersonnelles.add(
        (i - lPlaceDebutHeurePleine) / this.pas,
      );
    } else {
      lPlacesIndisponibilitesPersonnelles.add(
        (i - lPlaceDebutHeurePleine) / this.pas,
      );
    }
  }
  return lPlacesIndisponibilitesPersonnelles;
}
module.exports = ObjetSaisieIndisponibilite;
