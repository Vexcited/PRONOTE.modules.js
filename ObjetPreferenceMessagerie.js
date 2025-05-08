exports.ObjetPreferenceMessagerie = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const jsx_1 = require("jsx");
class ObjetRequetePreferenceMessagerie extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
  "PreferenceMessagerie",
  ObjetRequetePreferenceMessagerie,
);
class ObjetRequeteSaisiePreferenceMessagerie extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
  "SaisiePreferenceMessagerie",
  ObjetRequeteSaisiePreferenceMessagerie,
);
class ObjetPreferenceMessagerie extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.listeHeures = new ObjetListeElements_1.ObjetListeElements();
    for (let i = 1; i <= 23; i++) {
      this.listeHeures.add(
        new ObjetElement_1.ObjetElement(
          ObjetDate_1.GDate.formatDureeEnMillisecondes(
            i * 60 * 60 * 1000,
            "%hh%sh%mm",
          ),
          i,
        ),
      );
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      rbUniquementParentEleve: {
        getValue: function (aUniquementParentEleve) {
          return (
            aInstance.donnees.uniquementParentEleve === aUniquementParentEleve
          );
        },
        setValue: function (aUniquementParentEleve) {
          aInstance.donnees.uniquementParentEleve = aUniquementParentEleve;
          aInstance._saisie("uniquementParentEleve", aUniquementParentEleve);
        },
        getDisabled: aInstance._estConsult,
      },
      cbJoursNonOuvres: {
        getValue: function () {
          return aInstance.donnees.nonOuvres;
        },
        setValue: function (aValue) {
          aInstance.donnees.nonOuvres = aValue;
          aInstance._saisie("nonOuvres", aValue);
        },
        getDisabled: aInstance._estConsult,
      },
      cbJoursOuvres: {
        getValue: function () {
          return aInstance.donnees.ouvres;
        },
        setValue: function (aValue) {
          aInstance.donnees.ouvres = aValue;
          aInstance._saisie("ouvres", aValue);
        },
        getDisabled: aInstance._estConsult,
      },
      cbJoursOuvresAvantApres: {
        getValue: function (aCle) {
          return aInstance.donnees[aCle];
        },
        setValue: function (aCle, aValue) {
          aInstance.donnees[aCle] = aValue;
          aInstance._saisie(aCle, aValue);
        },
        getDisabled: function () {
          return !aInstance.donnees.ouvres || aInstance._estConsult();
        },
      },
      comboOuvres: {
        init: function (aHeureAvant, aInstanceCombo) {
          aInstanceCombo.setOptionsObjetSaisie({
            longueur: 40,
            iconeGauche: "icon_time",
            avecBouton: !IE.estMobile,
            labelWAICellule: aHeureAvant
              ? ObjetTraduction_1.GTraductions.getValeur("PrefMess.Avant")
              : ObjetTraduction_1.GTraductions.getValeur("PrefMess.Apres"),
          });
        },
        getDonnees: function (aHeureAvant, aDonnees) {
          if (!aDonnees) {
            return aInstance.listeHeures;
          }
        },
        getIndiceSelection: function (aHeureAvant) {
          const lHeure = aHeureAvant
            ? aInstance.donnees.heureAvant
            : aInstance.donnees.heureApres;
          return aInstance.listeHeures.getIndiceParNumeroEtGenre(lHeure) || 0;
        },
        event: function (aHeureAvant, aParametres, aCombo) {
          if (
            aParametres.genreEvenement ===
              Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
                .selection &&
            aParametres.element &&
            aCombo.estUneInteractionUtilisateur()
          ) {
            const lHeure = aParametres.element.getNumero();
            const lAccesseur = aHeureAvant ? "heureAvant" : "heureApres";
            if (aInstance.donnees[lAccesseur] !== lHeure) {
              aInstance.donnees[lAccesseur] = lHeure;
              aInstance._saisie(lAccesseur, lHeure);
            }
          }
        },
        getDisabled: function () {
          return !aInstance.donnees.ouvres || aInstance._estConsult();
        },
      },
      cbJours: {
        getValue: function (aIndexJour) {
          const lJour = aInstance.donnees.listeJours[aIndexJour];
          return lJour.actif;
        },
        setValue: function (aIndexJour, aValue) {
          const lJour = aInstance.donnees.listeJours[aIndexJour];
          lJour.actif = aValue;
          aInstance._saisie("jour", { jour: lJour.jour, actif: aValue });
        },
        getDisabled: function () {
          return !aInstance.donnees.ouvres || aInstance._estConsult();
        },
      },
      cbActiverRetour: {
        getValue: function () {
          return aInstance.donnees.activerMessageAuto;
        },
        setValue: function (aValue) {
          aInstance.donnees.activerMessageAuto = aValue;
          aInstance._saisie(
            "messageAuto",
            aValue ? aInstance.donnees.messageAuto : "",
          );
        },
        getDisabled: aInstance._estConsult,
      },
      textarea: {
        getValue: function () {
          return aInstance.donnees.messageAuto;
        },
        setValue: function (aValue) {
          aInstance.donnees.messageAuto = aValue;
        },
        exitChange: function () {
          if (aInstance.donnees.activerMessageAuto) {
            aInstance._saisie("messageAuto", aInstance.donnees.messageAuto);
          }
        },
        getDisabled: function () {
          return (
            !aInstance.donnees.activerMessageAuto || aInstance._estConsult()
          );
        },
      },
    });
  }
  recupererDonnees() {
    this._requeteDonnees();
  }
  construireAffichage() {
    if (!this.donnees) {
      return "";
    }
    const H = [];
    $("#" + this.Nom.escapeJQ()).addClass(
      "ObjetPreferenceMessagerie droit-deconnexion-contain",
    );
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "fieldset",
          null,
          IE.jsx.str(
            "legend",
            null,
            ObjetTraduction_1.GTraductions.getValeur(
              "PrefMess.DesactivationReception",
            ),
          ),
          IE.jsx.str(
            "div",
            { class: "droit-deconnexion-bloc" },
            IE.jsx.str(
              "div",
              { class: "choice-contain" },
              IE.jsx.str(
                "ie-radio",
                {
                  "ie-model": (0, jsx_1.jsxFuncAttr)(
                    "rbUniquementParentEleve",
                    false,
                  ),
                },
                ObjetTraduction_1.GTraductions.getValeur(
                  "PrefMess.TousLesMessages",
                ),
              ),
            ),
            IE.jsx.str(
              "div",
              { class: "choice-contain" },
              IE.jsx.str(
                "ie-radio",
                {
                  "ie-model": (0, jsx_1.jsxFuncAttr)(
                    "rbUniquementParentEleve",
                    true,
                  ),
                },
                ObjetTraduction_1.GTraductions.getValeur(
                  "PrefMess.UniquementLesMessagesDesParentsEtEleves",
                ),
              ),
            ),
          ),
        ),
        IE.jsx.str(
          "div",
          { class: "droit-deconnexion-bloc mobile-line" },
          IE.jsx.str(
            "div",
            { class: "choice-contain" },
            IE.jsx.str(
              "ie-checkbox",
              { "ie-model": "cbJoursNonOuvres" },
              ObjetTraduction_1.GTraductions.getValeur(
                "PrefMess.PendantNonOuvres",
              ),
            ),
          ),
          IE.jsx.str(
            "div",
            { class: "choice-contain" },
            IE.jsx.str(
              "ie-checkbox",
              { "ie-model": "cbJoursOuvres" },
              ObjetTraduction_1.GTraductions.getValeur(
                "PrefMess.PendantOuvres",
              ),
            ),
          ),
          IE.jsx.str("div", { class: "liste-choice" }, (aTabJours) => {
            this.donnees.listeJours.forEach((aJour, aIndex) => {
              aTabJours.push(
                IE.jsx.str(
                  "ie-checkbox",
                  {
                    class: "as-chips",
                    "ie-model": (0, jsx_1.jsxFuncAttr)("cbJours", aIndex),
                  },
                  !IE.estMobile
                    ? ObjetTraduction_1.GTraductions.getValeur("Jours")[
                        aJour.jour - 1
                      ]
                    : ObjetTraduction_1.GTraductions.getValeur("JoursCourt")[
                        aJour.jour - 1
                      ],
                ),
              );
            });
          }),
          IE.jsx.str(
            "div",
            { class: "choice-contain duree" },
            IE.jsx.str(
              "ie-checkbox",
              {
                "ie-model": (0, jsx_1.jsxFuncAttr)(
                  "cbJoursOuvresAvantApres",
                  "plageAvant",
                ),
              },
              ObjetTraduction_1.GTraductions.getValeur("PrefMess.Avant"),
            ),
            IE.jsx.str("ie-combo", {
              "ie-model": (0, jsx_1.jsxFuncAttr)("comboOuvres", true),
              class: "combo-mobile",
            }),
          ),
          IE.jsx.str(
            "div",
            { class: "choice-contain duree" },
            IE.jsx.str(
              "ie-checkbox",
              {
                "ie-model": (0, jsx_1.jsxFuncAttr)(
                  "cbJoursOuvresAvantApres",
                  "plageApres",
                ),
              },
              ObjetTraduction_1.GTraductions.getValeur("PrefMess.Apres"),
            ),
            IE.jsx.str("ie-combo", {
              "ie-model": (0, jsx_1.jsxFuncAttr)("comboOuvres", false),
              class: "combo-mobile",
            }),
          ),
        ),
        IE.jsx.str(
          "div",
          { class: "droit-deconnexion-bloc" },
          IE.jsx.str(
            "div",
            { class: "choice-contain" },
            IE.jsx.str(
              "ie-switch",
              { "ie-model": "cbActiverRetour" },
              ObjetTraduction_1.GTraductions.getValeur(
                "PrefMess.ActiverMessageAutoCourt",
              ),
            ),
          ),
          IE.jsx.str("ie-textareamax", {
            "ie-model": "textarea",
            maxlength: "500",
            "aria-label": ObjetTraduction_1.GTraductions.getValeur(
              "PrefMess.ActiverMessageAutoCourt",
            ),
          }),
        ),
      ),
    );
    return H.join("");
  }
  _estConsult() {
    return GApplication.droits.get(
      ObjetDroitsPN_1.TypeDroits.estEnConsultation,
    );
  }
  _requeteDonnees() {
    return new ObjetRequetePreferenceMessagerie(this)
      .lancerRequete()
      .then((aDonnees) => {
        this.donnees = aDonnees;
        this.donnees.activerMessageAuto = !!this.donnees.messageAuto;
        if (!this.donnees.messageAuto) {
          this.donnees.messageAuto = ObjetTraduction_1.GTraductions.getValeur(
            "PrefMess.MessageAutoDefaut",
          );
        }
        this.afficher();
      });
  }
  _saisie(aGenre, aVal) {
    return new ObjetRequeteSaisiePreferenceMessagerie(this).lancerRequete({
      genre: aGenre,
      val: aVal,
    });
  }
}
exports.ObjetPreferenceMessagerie = ObjetPreferenceMessagerie;
