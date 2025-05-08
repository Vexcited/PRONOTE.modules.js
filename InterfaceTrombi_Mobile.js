const { TypeDroits } = require("ObjetDroitsPN.js");
const ObjetTrombi = require("PageTrombi.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { ObjetRequeteTrombinoscope } = require("ObjetRequeteTrombinoscope.js");
const { MoteurSelectionContexte } = require("MoteurSelectionContexte.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetSelection } = require("ObjetSelection.js");
class ObjetAffichagePageTrombi_Mobile extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.selectionContexte = [];
    this.moteurSelectionContexte = new MoteurSelectionContexte();
  }
  construireInstances() {
    this.identPage = this.add(ObjetTrombi, _surEvenementPageTrombi.bind(this));
    this.avecPeriode = GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionPeriodeNotation,
    );
    this.identComboClasse = this.add(
      ObjetSelection,
      _evntSelecteur.bind(this, {
        genreSelecteur: EGenreRessource.Classe,
        genreSelecteurSuivant: EGenreRessource.Periode,
        estDernierSelecteur: !this.avecPeriode,
      }),
      _initSelecteur.bind(this, EGenreMessage.SelectionClasse),
    );
    this.AddSurZone = [this.identComboClasse];
    if (this.avecPeriode) {
      this.identComboPeriode = this.add(
        ObjetSelection,
        _evntSelecteur.bind(this, {
          genreSelecteur: EGenreRessource.Periode,
          estDernierSelecteur: true,
        }),
        _initSelecteur.bind(this, EGenreMessage.SelectionPeriode),
      );
      this.AddSurZone.push(this.identComboPeriode);
    }
  }
  recupererDonnees() {
    this.moteurSelectionContexte.getListeClasses({
      pere: this,
      clbck: function (aParam) {
        this.moteurSelectionContexte.remplirSelecteur(
          $.extend({}, aParam, {
            instance: this.getInstance(this.identComboClasse),
            genreRessource: EGenreRessource.Classe,
            pere: this,
            clbck: this.afficherMessage.bind(this),
          }),
        );
      }.bind(this),
    });
  }
  _actionSurRecupererPhotos(aDonnees) {
    this.getInstance(this.identPage).setDonnees(aDonnees.ListeRessources, true);
    $("#" + this.getInstance(this.identPage).getNom().escapeJQ()).css(
      "height",
      "100%",
    );
  }
}
function _surEvenementPageTrombi() {}
function _initSelecteur(aGenreMessage, aInstance) {
  aInstance.setParametres({
    avecBoutonsPrecedentSuivant: false,
    optionsCombo: {
      labelWAICellule: GTraductions.getValeur("Message")[aGenreMessage],
    },
  });
}
function _evntSelecteur(aContexte, aParam) {
  this.selectionContexte[aContexte.genreSelecteur] = aParam.element;
  if (aContexte.estDernierSelecteur === true) {
    _recupererDonnees.call(this);
  } else {
    if (aParam.element && aParam.element.getNumero() !== -1) {
      switch (aContexte.genreSelecteurSuivant) {
        case EGenreRessource.Periode:
          if (this.identComboPeriode) {
            this.moteurSelectionContexte.getListePeriodes({
              classe: this.selectionContexte[EGenreRessource.Classe],
              pere: this,
              clbck: function (aParam) {
                this.moteurSelectionContexte.remplirSelecteur(
                  $.extend({}, aParam, {
                    instance: this.getInstance(this.identComboPeriode),
                    genreRessource: aContexte.genreSelecteurSuivant,
                    pere: this,
                    clbck: this.afficherMessage.bind(this),
                  }),
                );
              }.bind(this),
            });
          }
          break;
      }
    }
  }
}
function _recupererDonnees() {
  const lClasse = this.selectionContexte[EGenreRessource.Classe];
  const lPeriode = this.selectionContexte[EGenreRessource.Periode];
  if (!!lClasse) {
    new ObjetRequeteTrombinoscope(
      this,
      this._actionSurRecupererPhotos.bind(this),
    ).lancerRequete({ classe: lClasse, periode: lPeriode });
  } else {
    this.afficherMessage(
      GTraductions.getValeur("Message")[EGenreMessage.AucuneClasseDisponible],
    );
  }
}
module.exports = ObjetAffichagePageTrombi_Mobile;
