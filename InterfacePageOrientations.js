const { _InterfaceOrientation } = require("_InterfaceOrientation.js");
const { GUID } = require("GUID.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const {
  ObjetFenetre_RessourceOrientation,
} = require("ObjetFenetre_RessourceOrientation.js");
const {
  ObjetRequetePageOrientations,
} = require("ObjetRequetePageOrientations.js");
const {
  ObjetRequeteSaisieOrientations,
} = require("ObjetRequeteSaisieOrientations.js");
const { ObjetFenetre_Orientations } = require("ObjetFenetre_Orientations.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GHtml } = require("ObjetHtml.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const { Type3Etats } = require("Type3Etats.js");
const { TUtilitaireOrientation } = require("UtilitaireOrientation.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
class InterfaceOrientationsParent extends _InterfaceOrientation {
  getControleur(aInstance) {
    return $.extend(
      true,
      super.getControleur(aInstance),
      TUtilitaireOrientation.getControleurGeneral(aInstance),
      {
        btnValider: {
          event: function () {
            aInstance.valider();
          },
          getDisabled: function () {
            return !aInstance.getEtatSaisie();
          },
          getDisplay: function () {
            return true;
          },
        },
        cbARAvisConseil: {
          getValue: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            return !!lDonnesAR
              ? lDonnesAR.estAccuse === Type3Etats.TE_Oui
              : false;
          },
          setValue: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              lDonnesAR.estAccuse = Type3Etats.TE_Oui;
              aInstance.setEtatSaisie(true);
              _saisie.call(aInstance, lDonnesAR);
            }
          },
          getDisabled: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              return (
                lDonnesAR.estAccuse === Type3Etats.TE_Oui ||
                !lDonnesAR.estEditable
              );
            }
          },
        },
        radioARStage: {
          getValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            return !!lDonnesAR
              ? lDonnesAR.reponseStagePasserelle === aChoix
              : false;
          },
          setValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              lDonnesAR.reponseStagePasserelle = aChoix;
              aInstance.setEtatSaisie(true);
              _saisie.call(aInstance, lDonnesAR);
            }
          },
          getDisabled: function () {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutreRecommandationConseil,
            );
            if (!!lDonnesAR) {
              return !lDonnesAR.estEditable;
            }
          },
        },
        radioARProposition: {
          getValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutrePropositionConseil,
            );
            return !!lDonnesAR ? lDonnesAR.estAccuse === aChoix : false;
          },
          setValue: function (aChoix) {
            const lDonnesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutrePropositionConseil,
            );
            if (!!lDonnesAR) {
              aInstance.setEtatSaisie(true);
              lDonnesAR.estAccuse = aChoix;
              _saisie.call(aInstance, lDonnesAR);
            }
          },
          getDisabled: function () {
            const lDonneesAR = aInstance.getDonnesARDeRubriqueDeGenre(
              TypeRubriqueOrientation.RO_AutrePropositionConseil,
            );
            if (!!lDonneesAR) {
              return !lDonneesAR.estEditable;
            }
          },
        },
      },
    );
  }
  construireInstances() {
    this.identFenetre = this.addFenetre(
      ObjetFenetre_Orientations,
      null,
      this.initialiserFenetre,
    );
    this.identFenetreRessource = this.addFenetre(
      ObjetFenetre_RessourceOrientation,
      super.evntFenetreRessource,
      this.initialiserFenetre,
    );
    this.idDivGenerale = GUID.getId();
    this.idMessage = GUID.getId();
    this.IdentOrientationsIntentions = [];
    this.IdentOrientationsDefinitif = [];
    this.identComboOrientationAR = this.add(
      ObjetSaisiePN,
      this.evenementSurCombo,
      this.initialiserCombo,
    );
  }
  evenementAfficherMessage(aGenreMessage) {
    $("#" + this.idDivGenerale).css("display", "none");
    const LMessage =
      typeof AGenreMessage === "number"
        ? GTraductions.getValeur("Message")[aGenreMessage]
        : aGenreMessage;
    GHtml.setHtml(this.idMessage, this.composeMessage(LMessage));
    this._evenementAfficherMessage(aGenreMessage);
  }
  recupererDonnees() {
    if (!this.Pere.EnConstruction) {
      new ObjetRequetePageOrientations(
        this,
        this.actionSurRecupererDonnees,
      ).lancerRequete();
    }
  }
  valider() {
    if (!this.getEtatSaisie()) {
      return;
    }
    _saisie.call(this);
  }
  actionSurValidation() {
    super.actionSurValidation();
    TUtilitaireOrientation.afficherMessageValidation();
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.AddSurZone = [{ html: this.creerBoutonAffichageInformation() }];
    this.IdentZoneAlClient = this.idDivGenerale;
    this.GenreStructure = EStructureAffichage.Autre;
  }
  initialiserCombo(aInstance) {
    aInstance.setOptionsObjetSaisie({ estLargeurAuto: true, hauteur: 17 });
  }
  evenementSurCombo(aParams) {
    if (
      aParams.genreEvenement === EGenreEvenementObjetSaisie.selection &&
      aParams.element
    ) {
      if (
        !this.getInstance(this.identComboOrientationAR).InteractionUtilisateur
      ) {
        return;
      }
      const lDonneesAR = this.getDonnesARDeRubriqueDeGenre(
        TypeRubriqueOrientation.RO_AutrePropositionConseil,
      );
      if (
        !!lDonneesAR &&
        !!lDonneesAR.decisionRetenue &&
        lDonneesAR.decisionRetenue.getNumero() === aParams.element.getNumero()
      ) {
        return;
      }
      lDonneesAR.decisionRetenue = aParams.element;
      if (!!lDonneesAR && lDonneesAR.estAccuse === Type3Etats.TE_Oui) {
        _saisie.call(this, lDonneesAR);
      }
    }
  }
  afficherPage() {
    this.setEtatSaisie(true);
    this.recupererDonnees();
  }
}
function _saisie(aDonneesAR) {
  let lListeOrientations = new ObjetListeElements();
  let lDonneesAR = null;
  let lRubriqueLV;
  if (!!aDonneesAR) {
    lDonneesAR = aDonneesAR;
  } else {
    lListeOrientations = this.getListeOrientationSaisie();
    lRubriqueLV = this.rubriqueLV;
  }
  new ObjetRequeteSaisieOrientations(
    this,
    this.actionSurValidation,
  ).lancerRequete({
    listeOrientations: lListeOrientations,
    donneesAR: lDonneesAR,
    rubriqueLV: lRubriqueLV,
  });
}
module.exports = InterfaceOrientationsParent;
