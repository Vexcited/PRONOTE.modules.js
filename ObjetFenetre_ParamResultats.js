const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
class ObjetFenetre_ParamResultats extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.avecMediane = false;
    this.avecHaute = false;
    this.avecBasse = false;
    this.avecAbsences = false;
    this.avecCompetences = true;
    this.avecSousServices = true;
    this.uniquementSousServices = false;
    this.matieresEquivalence = false;
    this.parametresBulletin = true;
    this.masquerSansNotes = false;
    this.avecCouleurMoyenne = false;
    this.avecGestionNotation = GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionNotation,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      rbParamAffichage: {
        getValue: function (aValeur) {
          return aInstance.matieresEquivalence !== aValeur;
        },
        setValue: function (aValeur) {
          aInstance.matieresEquivalence = !aValeur;
          aInstance.parametresBulletin = !!aValeur;
          if (aInstance.parametresBulletin) {
            aInstance.uniquementSousServices = false;
          }
        },
      },
      rbChoixModification: {
        getValue: function (aServices) {
          return aInstance.uniquementSousServices === aServices;
        },
        setValue: function (aServices) {
          aInstance.uniquementSousServices = aServices;
        },
        getDisabled: function () {
          return aInstance.parametresBulletin;
        },
      },
      checkGererMediane: {
        getValue: function () {
          return !!aInstance.avecMediane;
        },
        setValue: function (aData) {
          aInstance.avecMediane = aData;
          if (!aData) {
            aInstance.avecMediane = false;
          }
        },
      },
      checkGererHaute: {
        getValue: function () {
          return !!aInstance.avecHaute;
        },
        setValue: function (aData) {
          aInstance.avecHaute = aData;
          if (!aData) {
            aInstance.avecHaute = false;
          }
        },
      },
      checkGererBasse: {
        getValue: function () {
          return !!aInstance.avecBasse;
        },
        setValue: function (aData) {
          aInstance.avecBasse = aData;
          if (!aData) {
            aInstance.avecBasse = false;
          }
        },
      },
      checkGererAbsences: {
        getValue: function () {
          return !!aInstance.avecAbsences;
        },
        setValue: function (aData) {
          aInstance.avecAbsences = aData;
          if (!aData) {
            aInstance.avecAbsences = false;
          }
        },
        getDisabled: function () {
          return aInstance.uniquementSousServices;
        },
      },
      checkGererCompetences: {
        getValue: function () {
          return !!aInstance.avecCompetences;
        },
        getDisabled: function () {
          return (
            aInstance.parametresBulletin || aInstance.uniquementSousServices
          );
        },
        setValue: function (aData) {
          aInstance.avecCompetences = aData;
          if (!aData) {
            aInstance.avecCompetences = false;
          }
        },
      },
      checkGererSousServices: {
        getValue: function () {
          return !!aInstance.avecSousServices;
        },
        setValue: function (aData) {
          aInstance.avecSousServices = aData;
          if (!aData) {
            aInstance.avecSousServices = false;
          }
        },
        getDisabled: function () {
          return aInstance.uniquementSousServices;
        },
      },
      checkMasquerSansNotes: {
        getValue: function () {
          return !!aInstance.masquerSansNotes;
        },
        setValue: function (aData) {
          aInstance.masquerSansNotes = aData;
          if (!aData) {
            aInstance.masquerSansNotes = false;
          }
        },
      },
      checkAvecCouleurMoyenne: {
        getValue: function () {
          return !!aInstance.avecCouleurMoyenne;
        },
        setValue: function (aData) {
          aInstance.avecCouleurMoyenne = aData;
          if (!aData) {
            aInstance.avecCouleurMoyenne = false;
          }
        },
      },
    });
  }
  setContexte(aAvecDonneesItalie) {
    this.avecDonneesItalie = aAvecDonneesItalie;
  }
  composeLignesTotal() {
    const T = [];
    T.push('<div class="GrandEspaceBas">');
    T.push("<fieldset>");
    T.push(
      "<legend>" +
        GTraductions.getValeur("resultatsClasses.options.separateurLignes") +
        "</legend>",
    );
    T.push(
      "<div >",
      '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkGererMediane">',
      GTraductions.getValeur("resultatsClasses.options.noteMediane"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      "<div>",
      '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkGererHaute">',
      GTraductions.getValeur("resultatsClasses.options.noteHaute"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      "<div>",
      '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkGererBasse">',
      GTraductions.getValeur("resultatsClasses.options.noteBasse"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push("</fieldset>");
    T.push("</div>");
    return T.join("");
  }
  composeContenu() {
    const T = [];
    T.push('<div class="Espace">');
    if (this.avecGestionNotation) {
      T.push(this.composeLignesTotal());
    }
    T.push("<fieldset>");
    T.push(
      "<legend>" +
        GTraductions.getValeur("resultatsClasses.options.separateurServices") +
        "</legend>",
    );
    T.push(
      "<div>",
      '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkGererSousServices">',
      GTraductions.getValeur("resultatsClasses.options.sousServices"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      "<div>",
      '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkGererAbsences">',
      this.avecDonneesItalie
        ? GTraductions.getValeur("resultatsClasses.options.absences")
        : GTraductions.getValeur("resultatsClasses.options.afficherHManquees"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      "<div>",
      '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkMasquerSansNotes">',
      GTraductions.getValeur("resultatsClasses.options.MasquerSansNotes"),
      "</ie-checkbox>",
      "</div>",
    );
    if (this.avecGestionNotation) {
      const lLibelleOptionCouleur = this.avecDonneesItalie
        ? GTraductions.getValeur(
            "resultatsClasses.options.AfficherRougeInferieureTroisCinquieme",
          )
        : GTraductions.getValeur(
            "resultatsClasses.options.AfficherRougeInferieurMoyenne",
          );
      T.push(
        "<div>",
        '<ie-checkbox class="AlignementMilieuVertical" style="margin-right:.4rem; margin-bottom:.4rem;" ie-model="checkAvecCouleurMoyenne">',
        lLibelleOptionCouleur,
        "</ie-checkbox>",
        "</div>",
      );
    }
    T.push("</fieldset>");
    T.push("</div>");
    return T.join("");
  }
  setOptions(aReferentiel) {
    this.avecDonneesItalie = aReferentiel.avecDonneesItalie;
    this.avecMediane = aReferentiel.avecMediane;
    this.avecHaute = aReferentiel.avecHaute;
    this.avecBasse = aReferentiel.avecBasse;
    this.avecAbsences = aReferentiel.avecAbsences;
    this.avecCompetences = aReferentiel.avecCompetences;
    this.avecSousServices = aReferentiel.avecSousServices;
    this.uniquementSousServices = aReferentiel.uniquementSousServices;
    this.matieresEquivalence = aReferentiel.matieresEquivalence;
    this.parametresBulletin = aReferentiel.parametresBulletin;
    this.masquerSansNotes = aReferentiel.masquerSansNotes;
    this.avecCouleurMoyenne = aReferentiel.avecCouleurMoyenne;
    GEtatUtilisateur.resultatsClasse_referentiel = aReferentiel;
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, {
      avecMediane: this.avecMediane,
      avecHaute: this.avecHaute,
      avecBasse: this.avecBasse,
      avecAbsences: this.avecAbsences,
      avecCompetences: this.avecCompetences && this.matieresEquivalence,
      avecSousServices: this.avecSousServices,
      uniquementSousServices: this.uniquementSousServices,
      matieresEquivalence: false,
      parametresBulletin: true,
      masquerSansNotes: this.masquerSansNotes,
      avecCouleurMoyenne: this.avecCouleurMoyenne,
    });
  }
}
module.exports = { ObjetFenetre_ParamResultats };
