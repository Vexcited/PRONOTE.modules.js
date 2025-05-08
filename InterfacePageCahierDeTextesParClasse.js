const {
  _InterfacePageCahierDeTexte,
} = require("_InterfacePageCahierDeTexte.js");
const { ObjetTimeline } = require("ObjetTimeline.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EEvent } = require("Enumere_Event.js");
const { GUID } = require("GUID.js");
const { InterfacePage } = require("InterfacePage.js");
class InterfacePageCahierDeTextesParClasse extends _InterfacePageCahierDeTexte {
  constructor(...aParams) {
    super(...aParams);
    this.idComboFiltre = GUID.getId();
    this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
  }
  surPostResize() {
    this.actualiser();
  }
  construireInstances() {
    super.construireInstances();
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this.evenementSurDernierMenuDeroulant,
      this.initialiserTripleCombo,
    );
    if (
      this.identTripleCombo !== null &&
      this.identTripleCombo !== undefined &&
      this.getInstance(this.identTripleCombo) !== null
    ) {
      this.IdPremierElement = this.getInstance(
        this.identTripleCombo,
      ).getPremierElement();
    }
  }
  setParametresGeneraux() {
    this.AddSurZone = [this.identTripleCombo];
    this.AddSurZone.push({
      html: ObjetTimeline.composeChoix(
        this.idZoneChxModeAff,
        this.modeTimeLine,
      ),
    });
    this.AddSurZone.push(this.identCelluleSemaine);
    this.AddSurZone.push({
      html:
        '<div class="EspaceGauche ' +
        this.classLabelDepuis +
        '">' +
        GTraductions.getValeur("Depuis") +
        "</div>",
    });
    this.AddSurZone.push(this.identCelluleDate);
    this.AddSurZone.push({
      html: `<ie-combo data-id="${this.idComboFiltre}" ie-model="comboFiltreTheme"></ie-combo>`,
    });
  }
  setVisibilite() {
    super.setVisibilite();
    if (!this.getInstance(this.identTripleCombo).estUneClasse) {
      this.getInstance(this.identCelluleSemaine).setVisible(false);
      this.getInstance(this.identCelluleDate).setVisible(false);
      $(
        `#${this.getInstance(this.identListeMatieres).getNom().escapeJQ()}`,
      ).hide();
      $(
        "#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
      ).get(0).style.maxWidth = "100%";
    }
    if (this.estHebdomadaire()) {
      $("[data-id=" + this.idComboFiltre.escapeJQ() + "]").hide();
      this.filtreThemes = null;
    } else {
      $("[data-id=" + this.idComboFiltre.escapeJQ() + "]").show();
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      comboFiltreTheme: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            longueur: 170,
            hauteur: 16,
            hauteurLigneDefault: 16,
            labelWAICellule: GTraductions.getValeur(
              "CahierDeTexte.filtrerParThemes",
            ),
          });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            if (aInstance.listeThemes) {
              aInstance.listeThemes.parcourir((aTheme) => {
                if (aTheme.Matiere) {
                  aTheme.setLibelle(
                    '<div class="Gras">' +
                      aTheme.getLibelle() +
                      "</div><div>" +
                      aTheme.Matiere.getLibelle() +
                      "</div>",
                  );
                }
              });
              return aInstance.listeThemes;
            }
          }
        },
        getIndiceSelection: function () {
          let lIndice = 0;
          if (
            !!aInstance.filtreThemes &&
            !!aInstance.listeThemes &&
            aInstance.listeThemes.count() > 0
          ) {
            for (; lIndice < aInstance.listeThemes.count(); lIndice++) {
              if (
                aInstance.listeThemes.get(lIndice).getNumero() ===
                aInstance.filtreThemes.getNumero()
              ) {
                break;
              }
            }
          }
          return lIndice;
        },
        event: function (aParametres) {
          if (!!aParametres.element && aParametres.estSelectionManuelle) {
            aInstance.filtreThemes =
              aParametres.element.getNumero() !== null
                ? aParametres.element
                : null;
            aInstance.actualiser();
          }
        },
      },
    });
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres([EGenreRessource.Classe]);
  }
  recupererDonnees() {
    this.presetDates();
    this.actualiser();
  }
  evenementSurDernierMenuDeroulant() {
    this.afficherBandeau(true);
    if (this.estHebdomadaire()) {
      this.getInstance(this.identCelluleSemaine).setVisible(true);
    } else {
      this.getInstance(this.identCelluleDate).setVisible(true);
    }
    this.finRecupererDonnees();
    this.surResizeInterface();
  }
  evenementAfficherMessage(aGenreMessage) {
    InterfacePage.prototype._evenementAfficherMessage.call(this, aGenreMessage);
  }
}
module.exports = { InterfacePageCahierDeTextesParClasse };
