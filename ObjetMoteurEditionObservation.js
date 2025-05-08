const { GChaine } = require("ObjetChaine.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
class ObjetMoteurEditionObservation {
  constructor(aParent) {
    const lSelf = this;
    $.extend(true, aParent.controleur, this.getControleur());
    aParent.getMoteur = function () {
      return lSelf;
    };
    this.observation = null;
    this.commentaireOrigine = null;
    this.checkPublieOrigine = null;
    this.dateOrigine = null;
    this.avecDate = true;
    this.disabled = false;
    this.existeDateVisu = false;
    this.estEnConsultationUniquement = false;
    this.avecBoutonSuppression = false;
    this.numBoutonSupprimer = null;
    this.numBoutonAnnuler = 0;
    this.numBoutonValider = 1;
    this.listeBoutons = [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ];
  }
  init(aParam) {
    this.observation = aParam.observation;
    this.commentaireOrigine = aParam.observation.commentaire;
    this.checkPublieOrigine = aParam.observation.estPubliee;
    this.dateOrigine = aParam.observation.date;
    this.numeroObservation = aParam.numeroObservation;
    this.genreEtat = aParam.genreEtat;
    this.typeObservation = aParam.typeObservation;
    this.avecDate = aParam.avecDate;
    this.publiable = aParam.publiable;
    this.disabled =
      aParam.actif === undefined || aParam.actif === null
        ? false
        : !aParam.actif;
    if (this.disabled) {
      this.listeBoutons = [GTraductions.getValeur("Fermer")];
    }
    this.existeDateVisu = !!(
      this.observation.dateVisu !== false &&
      this.observation.dateVisu !== undefined
    );
    this.estEnConsultationUniquement =
      (aParam.observation.avecARObservation && this.existeDateVisu) ||
      this.disabled;
    this.avecBoutonSuppression =
      !this.disabled &&
      this.genreEtat === EGenreEtat.Suppression &&
      this.observation.dateVisu === false;
    if (this.avecBoutonSuppression) {
      this.listeBoutons.unshift(GTraductions.getValeur("Supprimer"));
      this.numBoutonSupprimer = 0;
      this.numBoutonAnnuler = 1;
      this.numBoutonValider = 2;
    }
  }
  getTitre() {
    if (this.typeObservation === TypeGenreObservationVS.OVS_ObservationParent) {
      return GTraductions.getValeur("Observations.ObservationsParents");
    } else if (
      this.typeObservation === TypeGenreObservationVS.OVS_Encouragement
    ) {
      return GTraductions.getValeur("Observations.Encouragements");
    } else if (
      (this.typeObservation === TypeGenreObservationVS.OVS_Autres ||
        this.typeObservation === TypeGenreObservationVS.OVS_DefautCarnet) &&
      this.observation &&
      this.observation.observation &&
      this.observation.observation.getLibelle()
    ) {
      return this.observation.observation.getLibelle();
    } else if (this.observation.getGenre() === EGenreRessource.Dispense) {
      return this.disabled
        ? GTraductions.getValeur(
            "Observations.ObservationsDispenseNE",
          ).ucfirst()
        : GTraductions.getValeur("Observations.ObservationsDispense");
    } else {
      return this.observation && this.observation.estPubliee
        ? GTraductions.getValeur("Observations.ObservationsPublie")
        : GTraductions.getValeur("Observations.ObservationsNonPublie");
    }
  }
  getControleur() {
    return {
      commentaire: {
        getValue: function () {
          return this.instance.getMoteur().observation &&
            this.instance.getMoteur().observation.commentaire
            ? this.instance.getMoteur().observation.commentaire
            : "";
        },
        setValue: function (aValue) {
          this.instance.getMoteur().observation.commentaire = aValue;
        },
        getDisabled: function () {
          if (this.instance.getMoteur().disabled) {
            const lAttr = this.node.attributes["placeholder"];
            lAttr.nodeValue = "";
          }
          return (
            this.instance.getMoteur().existeDateVisu ||
            this.instance.getMoteur().disabled
          );
        },
      },
      checkPublie: {
        getValue: function () {
          return (
            this.instance.getMoteur().observation &&
            this.instance.getMoteur().observation.estPubliee === true
          );
        },
        setValue: function (aValue) {
          this.instance.getMoteur().observation.estPubliee = aValue;
        },
        getLibelle: function () {
          const lHtml = [];
          lHtml.push(GTraductions.getValeur("AbsenceVS.PublierParentsEleves"));
          return lHtml.join("");
        },
        getDisabled: function () {
          return (
            this.instance.getMoteur().existeDateVisu ||
            this.instance.getMoteur().disabled
          );
        },
      },
      iconePublie: function () {
        const lObservation = this.instance.getMoteur().observation;
        return lObservation && lObservation.estPubliee
          ? ""
          : " mix-icon_remove ";
      },
      visibilitePubliable: function () {
        return this.instance.getMoteur().publiable
          ? { display: "" }
          : { display: "none" };
      },
      visibiliteMessageVisu: function () {
        return this.instance.getMoteur().existeDateVisu
          ? { display: "" }
          : { display: "none" };
      },
      messageVisu: function () {
        return this.instance.getMoteur().existeDateVisu
          ? GChaine.format(
              GTraductions.getValeur("AbsenceVS.ObservationLueWebLe"),
              [
                GDate.formatDate(
                  this.instance.getMoteur().observation.dateVisu,
                  "%JJ/%MM/%AAAA",
                ),
              ],
            )
          : "";
      },
    };
  }
  validationActif(aCommentaire) {
    return (
      (this.typeObservation !== TypeGenreObservationVS.OVS_ObservationParent &&
        this.typeObservation !== TypeGenreObservationVS.OVS_Encouragement) ||
      aCommentaire.trim() !== ""
    );
  }
  surValidation(aNumeroBouton) {
    let lResult = false;
    if (aNumeroBouton === this.numBoutonSupprimer) {
      this.observation.setEtat(EGenreEtat.Suppression);
      lResult = true;
    } else if (
      (aNumeroBouton === this.numBoutonAnnuler || aNumeroBouton === -1) &&
      !this.estEnConsultationUniquement
    ) {
      this.observation.commentaire = this.commentaireOrigine;
      this.observation.estPubliee = this.checkPublieOrigine;
      this.observation.date = this.dateOrigine;
      if (this.genreEtat === EGenreEtat.Creation) {
        this.observation.setEtat(EGenreEtat.Suppression);
      }
      lResult = true;
    } else if (aNumeroBouton === this.numBoutonValider) {
      this.observation.setEtat(EGenreEtat.Modification);
      lResult = true;
    }
    return lResult;
  }
}
module.exports = { ObjetMoteurEditionObservation };
