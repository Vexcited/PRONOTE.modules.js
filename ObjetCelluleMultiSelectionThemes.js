exports.ObjetCelluleMultiSelectionThemes = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ListeThemes_1 = require("ObjetFenetre_ListeThemes");
const ObjetCelluleMultiSelection_1 = require("ObjetCelluleMultiSelection");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Event_1 = require("Enumere_Event");
const ObjetRequeteListeTousLesThemes_1 = require("ObjetRequeteListeTousLesThemes");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetCelluleMultiSelectionThemes extends ObjetCelluleMultiSelection_1.ObjetCelluleMultiSelection {
  constructor(...aParams) {
    super(...aParams);
    this.options.largeurBouton = IE.estMobile ? 150 : 400;
    this.options.labelWAI = ObjetTraduction_1.GTraductions.getValeur("Themes");
  }
  setOptions(aOptions) {
    super.setOptions(aOptions);
    this.options.largeurBouton = this.options.fullWidth
      ? "100%"
      : this.options.largeurBouton;
    return this;
  }
  construireAffichage() {
    const H = [];
    H.push(
      '<div id="',
      this.cellule.getNom(),
      '" class="input-wrapper" style="width:100%;" ie-class="getClassesDynamiques"></div>',
    );
    return H.join("");
  }
  setDonnees(aListeSelectionne, aMatiereContexte, aLibelleCB) {
    this.matiereContexte =
      aMatiereContexte instanceof ObjetElement_1.ObjetElement
        ? aMatiereContexte
        : null;
    this.donneesSelection = aListeSelectionne;
    this.libelleCB = aLibelleCB;
    if (this.donneesSelection) {
      this._actualiserCellule();
    }
  }
  surCellule(aGenreEvent, aEvent) {
    if (!this.getActif()) {
      return;
    }
    switch (aGenreEvent) {
      case Enumere_Event_1.EEvent.SurClick: {
        new ObjetRequeteListeTousLesThemes_1.ObjetRequeteListeTousLesThemes(
          this,
          this._ouvrirFenetre,
        ).lancerRequete();
        break;
      }
      case Enumere_Event_1.EEvent.SurKeyUp: {
        if (
          aEvent.which === ToucheClavier_1.ToucheClavier.RetourChariot ||
          aEvent.which === ToucheClavier_1.ToucheClavier.FlecheBas
        ) {
          new ObjetRequeteListeTousLesThemes_1.ObjetRequeteListeTousLesThemes(
            this,
            this._ouvrirFenetre,
          ).lancerRequete();
        }
      }
    }
  }
  _actualiserCellule() {
    this.cellule.setLibelle(
      this.donneesSelection.getTableauLibelles().join(", "),
    );
  }
  _ouvrirFenetre(aJSON) {
    if (this.fenetre) {
      this._fermerFenetre();
    }
    this.donnees = this._initDonnees(
      this.donneesSelection,
      aJSON.listeTousLesThemes,
    );
    this.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_ListeThemes_1.ObjetFenetre_ListeThemes,
      { pere: this, evenement: this.surFenetre },
    );
    this.fenetre.setDonnees({
      listeThemes: this.donnees,
      matiereContexte: this.matiereContexte || aJSON.matiereNonDesignee,
      listeMatieres: aJSON.listeMatieres,
      tailleLibelleTheme: aJSON.tailleLibelleTheme,
      libelleCB: this.libelleCB,
      matiereNonDesignee: aJSON.matiereNonDesignee,
    });
  }
  surFenetre(aGenreBouton, aChangementListe) {
    this.genreBouton = aGenreBouton;
    this._actualiserCellule();
    this._fermerFenetre();
    if (this.genreBouton === 1) {
      const lListeActif = aChangementListe.getListeElements((aElement) => {
        return aElement.cmsActif;
      });
      (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
        this.callback.appel(this.genreBouton, lListeActif);
      }, !this.ControleNavigation);
      this.donneesSelection = lListeActif;
      this._actualiserCellule();
    }
  }
}
exports.ObjetCelluleMultiSelectionThemes = ObjetCelluleMultiSelectionThemes;
