const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { UtilitaireSelecFile } = require("UtilitaireSelecFile.js");
const { UtilitaireAudio } = require("UtilitaireAudio.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const vmsg = require("vmsg.es5.min.js");
const EEtatChargementComposant = {
  nonInitialise: 0,
  enCoursDInitialisation: 1,
  initialise: 2,
  arrete: 3,
};
class ObjetFenetre_EnregistrementAudio extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      modale: true,
      titre: GTraductions.getValeur("EnregistrementAudio.titre"),
      largeur: 400,
      hauteurMin: 100,
      listeBoutons: [
        {
          libelle: GTraductions.getValeur("EnregistrementAudio.recommencer"),
          recommencer: true,
          theme: TypeThemeBouton.secondaire,
        },
        {
          libelle: GTraductions.getValeur("EnregistrementAudio.upload"),
          valider: true,
          theme: TypeThemeBouton.primaire,
        },
      ],
      addParametresValidation: (aParametres) => {
        if (
          aParametres.bouton &&
          aParametres.bouton.valider &&
          this.listeFichiers
        ) {
          aParametres.listeFichiers = this.listeFichiers;
        }
      },
    });
    this.optionsEnregistrementAudio = {
      contexte: "",
      maxLengthAudio: this.getDureeMaxEnregistrementAudio(),
    };
    this.donnees = { genreRessourcePJ: null };
    this.listeFichiers = null;
    this.error = null;
    this.idTime = GUID.getId();
    this.audio = {
      enregistrementEnCours: false,
      chargementComposant: EEtatChargementComposant.nonInitialise,
      blob: null,
      fichier: null,
    };
    initEnregistrement.call(this, false);
  }
  getDureeMaxEnregistrementAudio() {
    let lTailleMax = 30;
    if (
      GParametres &&
      GParametres.general &&
      GParametres.general.tailleMaxEnregistrementAudioRenduTAF
    ) {
      lTailleMax =
        GParametres.general.tailleMaxEnregistrementAudioRenduTAF * 60;
    }
    return lTailleMax;
  }
  setOptions(aOptions) {
    $.extend(this.optionsEnregistrementAudio, aOptions);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      fenetreBtn: {
        getDisabled: function (aBoutonRepeat) {
          if (aInstance.audio.enregistrementEnCours) {
            return true;
          }
          if (aBoutonRepeat.element.valider) {
            return aInstance.audio.fichier === null;
          }
          if (aBoutonRepeat.element.recommencer) {
            return aInstance.audio.fichier === null;
          }
          return false;
        },
        event: function (aBoutonRepeat) {
          if (aBoutonRepeat.element.valider) {
            aInstance.listeFichiers = new ObjetListeElements();
            UtilitaireSelecFile.addFileDansListe(
              aInstance.audio.blob,
              aInstance.listeFichiers,
              aInstance.donnees.genreRessourcePJ,
            );
            aInstance.surValidation(aBoutonRepeat.element.index);
          } else if (
            aBoutonRepeat.element.recommencer &&
            !!aInstance.audio.fichier
          ) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "EnregistrementAudio.suppressionExistant",
              ),
              callback: function (aGenreAction) {
                if (aGenreAction === EGenreAction.Valider) {
                  if (aInstance.audio.fichier) {
                    URL.revokeObjectURL(aInstance.audio.fichier);
                  }
                  $.extend(aInstance.audio, { blob: null, fichier: null });
                  setTime.call(aInstance, 0);
                  aInstance.listeFichiers = null;
                }
              },
            });
          }
        },
      },
      iconvisible: function () {
        return aInstance.audio.enregistrementEnCours;
      },
      boutonAudio: {
        title: function () {
          if (aInstance.audio.enregistrementEnCours) {
            return GTraductions.getValeur("EnregistrementAudio.encours");
          } else {
            return GTraductions.getValeur("EnregistrementAudio.record");
          }
        },
        visible: function () {
          return true;
        },
        getDisabled: function () {
          return (
            [
              EEtatChargementComposant.nonInitialise,
              EEtatChargementComposant.enCoursDInitialisation,
            ].includes(aInstance.audio.chargementComposant) ||
            aInstance.audio.enregistrementEnCours ||
            !!aInstance.audio.fichier
          );
        },
        event: function () {
          if (
            [
              EEtatChargementComposant.initialise,
              EEtatChargementComposant.arrete,
            ].includes(aInstance.audio.chargementComposant)
          ) {
            if (!!aInstance.audio.fichier) {
              GApplication.getMessage().afficher({
                type: EGenreBoiteMessage.Confirmation,
                message: GTraductions.getValeur(
                  "EnregistrementAudio.suppressionExistant",
                ),
                callback: function (aGenreAction) {
                  if (aGenreAction === EGenreAction.Valider) {
                    if (aInstance.audio.fichier) {
                      URL.revokeObjectURL(aInstance.audio.fichier);
                    }
                    $.extend(aInstance.audio, { blob: null, fichier: null });
                    enregistrer.call(aInstance);
                  }
                },
              });
            } else {
              enregistrer.call(aInstance);
            }
          }
        },
      },
      boutonAudioStop: {
        event: function () {
          if (
            aInstance.audio.chargementComposant ===
              EEtatChargementComposant.initialise &&
            aInstance.audio.enregistrementEnCours
          ) {
            stopEnregistrement.call(aInstance);
          }
        },
        getDisabled: function () {
          return (
            aInstance.audio.chargementComposant !==
              EEtatChargementComposant.initialise ||
            !aInstance.audio.enregistrementEnCours
          );
        },
      },
      boutonRefresh: {
        event: function () {
          if (
            aInstance.audio.chargementComposant ===
            EEtatChargementComposant.nonInitialise
          ) {
            aInstance.error.reset = true;
            initEnregistrement.call(aInstance, false);
            aInstance.$refreshSelf();
          }
        },
      },
      enregistrement: {
        visible: function () {
          return true;
        },
      },
      getEnregistrement: function () {
        if (
          !!aInstance.error &&
          aInstance.error.name === "NotAllowedError" &&
          !aInstance.error.reset
        ) {
          return `<div>${GTraductions.getValeur("EnregistrementAudio.msgErreur").replaceRCToHTML()}</div><ie-btnicon ie-model="boutonRefresh" class="bt-activable bt-large icon_refresh"></ie-btnicon>`;
        }
        if (
          aInstance.audio.chargementComposant ===
          EEtatChargementComposant.enCoursDInitialisation
        ) {
          return GTraductions.getValeur(
            "EnregistrementAudio.msgAutoriser",
          ).replaceRCToHTML();
        }
        if (
          aInstance.audio.chargementComposant ===
            EEtatChargementComposant.initialise &&
          aInstance.audio.enregistrementEnCours
        ) {
          return GTraductions.getValeur("EnregistrementAudio.encours");
        }
        return "";
      },
      getAudio: function () {
        if (!!aInstance.audio.fichier && !!aInstance.audio.blob) {
          return UtilitaireAudio.construitChipsAudio({
            libelle: GTraductions.getValeur(
              "EnregistrementAudio.monEnregistrement",
            ),
            url: aInstance.audio.fichier,
            ieModel: "chipsAudio",
            argsIEModel: [aInstance.audio.blob.lastModified],
            idAudio: aInstance.audio.blob.lastModified,
            classes: ["no-underline"],
          });
        }
        return "";
      },
      chipsAudio: {
        event: function () {
          UtilitaireAudio.executeClicChipsParDefaut(this.node);
        },
        eventBtn: function () {
          if (!!aInstance.audio.fichier) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "EnregistrementAudio.suppression",
              ),
              callback: function (aGenreAction) {
                if (aGenreAction === EGenreAction.Valider) {
                  if (aInstance.audio.fichier) {
                    URL.revokeObjectURL(aInstance.audio.fichier);
                  }
                  $.extend(aInstance.audio, {
                    enregistrementEnCours: false,
                    blob: null,
                    fichier: null,
                  });
                  setTime.call(aInstance, 0);
                  aInstance.listeFichiers = null;
                }
              },
            });
          }
        },
        node: function () {
          const $chips = $(this.node);
          const $audio = $chips.find("audio");
          $audio.on("play", () => {
            $chips
              .removeClass(UtilitaireAudio.IconeLecture)
              .addClass(UtilitaireAudio.IconeStop);
          });
          $audio.on("pause", () => {
            $chips
              .removeClass(UtilitaireAudio.IconeStop)
              .addClass(UtilitaireAudio.IconeLecture);
          });
        },
        getOptions: function (aAvecBtnSuppr) {
          return { avecBtn: aAvecBtnSuppr };
        },
      },
    });
  }
  fermer() {
    if (
      !!this.recorder &&
      this.audio.chargementComposant === EEtatChargementComposant.initialise
    ) {
      try {
        this.recorder.close();
      } catch (aError) {
        IE.log.addLog(aError);
      }
    }
    super.fermer();
  }
  setDonnees(aGenreRessourcePieceJointe, aOptionsFenetre) {
    this.donnees.genreRessourcePJ = aGenreRessourcePieceJointe;
    if (!!aOptionsFenetre) {
      Object.assign(this.optionsEnregistrementAudio, aOptionsFenetre);
    }
  }
  afficher() {
    const lContenuFenetre = composeContenuFenetre.call(this);
    super.afficher(lContenuFenetre);
  }
}
function enregistrer() {
  if (this.audio.chargementComposant === EEtatChargementComposant.arrete) {
    initEnregistrement.call(this, true);
  } else {
    _enregistrer.call(this);
  }
}
function _enregistrer() {
  this.recorder.startRecording();
  this.debut = Date.now();
  this.audio.enregistrementEnCours = true;
  updateTime.call(this);
  this.$refreshSelf();
}
function stopEnregistrement() {
  this.recorder
    .stopRecording()
    .then((ablob) => {
      this.audio.chargementComposant = EEtatChargementComposant.arrete;
      ablob.lastModifiedDate = new Date();
      ablob.lastModified = ablob.lastModifiedDate.getTime();
      ablob.name = ablob.lastModified + ".mp3";
      $.extend(this.audio, {
        enregistrementEnCours: false,
        blob: ablob,
        fichier: URL.createObjectURL(ablob),
      });
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.$refreshSelf();
    })
    .catch((aError) => {
      this.audio.chargementComposant = EEtatChargementComposant.arrete;
      IE.log.addLog(aError);
      if (this.audio.fichier) {
        URL.revokeObjectURL(this.audio.fichier);
      }
      $.extend(this.audio, {
        enregistrementEnCours: false,
        blob: null,
        fichier: null,
      });
    });
}
function updateTime() {
  const lThis = this;
  const lTime = Math.round((Date.now() - this.debut) / 1000);
  setTime.call(this, lTime);
  if (lTime > this.optionsEnregistrementAudio.maxLengthAudio) {
    setTime.call(this, this.optionsEnregistrementAudio.maxLengthAudio);
    stopEnregistrement.call(this);
  } else {
    setTime.call(this, lTime);
    this.timer = setTimeout(() => {
      return updateTime.call(lThis);
    }, 300);
  }
}
function setTime(aTime) {
  const lText = serialiserTime(aTime / 60) + ":" + serialiserTime(aTime % 60);
  GHtml.setHtml(this.idTime, lText);
}
function initEnregistrement(aAvecDemarrerEnregistrement) {
  this.recorder = new vmsg.Recorder({ wasmURL: "vmsg.wasm" });
  this.audio.chargementComposant =
    EEtatChargementComposant.enCoursDInitialisation;
  this.recorder
    .init()
    .then(() => {
      this.error = null;
      this.audio.chargementComposant = EEtatChargementComposant.initialise;
      if (aAvecDemarrerEnregistrement) {
        _enregistrer.call(this);
      }
      this.$refreshSelf();
    })
    .catch((aError) => {
      IE.log.addLog(aError);
      this.error = aError;
      this.audio.chargementComposant = EEtatChargementComposant.nonInitialise;
      this.$refreshSelf();
    });
}
function serialiserTime(n) {
  n |= 0;
  return n < 10 ? "0".concat(n) : "".concat(Math.min(n, 99));
}
function composeContenuFenetre() {
  const H = [];
  H.push('<div class="fenetreEnregistrementAudio">');
  const lText =
    serialiserTime(this.optionsEnregistrementAudio.maxLengthAudio / 60) +
    ":" +
    serialiserTime(this.optionsEnregistrementAudio.maxLengthAudio % 60);
  H.push(
    '<div class="flex-contain cols flex-center">',
    '<div ie-html="getEnregistrement" class="audio-enregistrement"></div>',
    '<div class="m-top-xl flex-contain cols flex-center">',
    `<div class="flex-contain flex-center"><div class="container-icon fix-bloc"><i class="icon_pastille_evaluation" ie-display="iconvisible"></i></div><div class="container-count fix-bloc" id ="${this.idTime}">00:00</div> / <div class="m-right-xl">${lText}</div></div>`,
    '<div class="m-top-xl">',
    `<ie-btnicon ie-model="boutonAudio" ie-title="boutonAudio.title" class="bt-activable bt-big icon_microphone"></ie-btnicon>`,
    `<ie-btnicon ie-model="boutonAudioStop" title="${GTraductions.getValeur("EnregistrementAudio.stop")}" class="m-left-xl bt-activable bt-big icon_case_inactive"></ie-btnicon>`,
    "</div>",
    "</div>",
    '<div ie-html="getAudio" class="m-all-xl audio-fichier"></div>',
    "</div>",
  );
  H.push("</div>");
  return H.join("");
}
module.exports = { ObjetFenetre_EnregistrementAudio };
