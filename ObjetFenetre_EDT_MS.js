exports.ObjetFenetre_EDT_MS = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_AffichageGrilleDate_1 = require("Enumere_AffichageGrilleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetGrille_1 = require("ObjetGrille");
const UtilitaireConvertisseurPositionGrille_1 = require("UtilitaireConvertisseurPositionGrille");
class TUtilitaireConvertisseurPosition_Grille_MS extends UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille {
  constructor(aCoursMultiple) {
    super();
    this.coursMultiple = aCoursMultiple;
  }
  getPlaceDebutCours(aCours) {
    return (
      (aCours.Debut % this.options.optionsGrille.blocHoraires.nbHoraires()) +
      aCours.numeroCouloir *
        this.options.optionsGrille.blocHoraires.nbHoraires()
    );
  }
  getNumeroJourDeTrancheHoraire() {
    return Math.floor(
      this.coursMultiple.Debut /
        this.options.optionsGrille.blocHoraires.nbHoraires(),
    );
  }
  getDateDeTrancheHoraire() {
    return this.options.parametresGrille.numeroSemaine
      ? IE.Cycles.jourCycleEnDate(
          this.getNumeroJourDeTrancheHoraire(),
          this.options.parametresGrille.numeroSemaine,
        )
      : null;
  }
  remplirColonnesVisibles() {
    this.options.optionsGrille.tranches.init();
    for (let i = 0; i < this.coursMultiple.nombreCouloirs; i++) {
      this.options.optionsGrille.tranches.add();
    }
  }
}
class ObjetFenetre_EDT_MS extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      modale: false,
      avecRetaillage: true,
      largeur: 340,
      hauteur: 340,
      largeurMin: 190,
      hauteurMin: 150,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
    });
  }
  construireInstances() {
    this.identGrille = this.add(ObjetGrille_1.ObjetGrille, function (aParam) {
      if (this._parametres.callbackGrille) {
        this._parametres.callbackGrille(aParam);
      }
    });
  }
  getInstanceGrille() {
    return this.getInstance(this.identGrille);
  }
  setDonnees(aParametres) {
    const lInstanceGrille = this.getInstance(this.identGrille);
    this._parametres = {
      coursMultiple: null,
      numeroSemaine: GEtatUtilisateur.getSemaineSelectionnee(),
      coursSelectionne: null,
      callbackGrille: null,
      hauteurCelluleGrille: lInstanceGrille.getOptions().tailleMINPasHoraire,
    };
    $.extend(this._parametres, aParametres);
    this.setOptionsFenetre({
      titre: this._getTitre(
        this._parametres.coursMultiple,
        this._parametres.numeroSemaine,
      ),
    });
    if (!this._parametres.coursMultiple.estCalcule) {
      this._calculerPositionnementCoursMS(this._parametres.coursMultiple);
    }
    const lConvertisseur = new TUtilitaireConvertisseurPosition_Grille_MS(
      this._parametres.coursMultiple,
    );
    lInstanceGrille.setOptions(
      $.extend(
        {
          convertisseurPosition: lConvertisseur,
          tailleMAXPasHoraire: 0,
          genreAffichageDate:
            Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.SansDate,
          couleurLibellesLignes: GCouleur.fenetre.texte,
          couleurLibellesColonnes: GCouleur.fenetre.texte,
          afficherDebutSelonCours: true,
          afficherFinSelonCours: true,
          getLibelleBlocHoraire: function () {
            return UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille.getLibelleJourCycle(
              Math.floor(
                aParametres.coursMultiple.Debut / GParametres.PlacesParJour,
              ),
            );
          },
          getLibelleTranche: function (aParam) {
            const T = [];
            T.push(
              '<div class="AlignementMilieu" style="',
              ObjetStyle_1.GStyle.composeWidth(aParam.width),
              ObjetStyle_1.GStyle.composeCouleurTexte(GCouleur.fenetre.texte),
              '">',
              aParam.numeroTranche + 1,
              "</div>",
            );
            return T.join("");
          },
          getTailleLibelleTranche: function (aNumeroTranche) {
            return Math.max(
              15,
              ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
                aNumeroTranche + 1 + "",
                10,
              ),
            );
          },
        },
        this._parametres.optionsGrille,
      ),
    );
    this.afficher();
    this._resizeGrille();
    lInstanceGrille.setDonnees({
      listeCours: this._parametres.coursMultiple.listeCours,
      numeroSemaine: this._parametres.numeroSemaine,
      ignorerCalculCoursMultiple: false,
    });
    if (this._parametres.coursSelectionne) {
      lInstanceGrille.selectionnerCours(
        this._parametres.coursSelectionne,
        false,
        true,
      );
    }
    if (this.existeCoordonnees()) {
      ObjetPosition_1.GPosition.setPosition(
        this.NomFenetre,
        this.coordonnees.left,
        this.coordonnees.top,
        true,
      );
    } else {
      ObjetPosition_1.GPosition.centrer(this.NomFenetre);
    }
  }
  composeContenu() {
    return IE.jsx.str("div", {
      id: this.getInstance(this.identGrille).getNom(),
      style: "position:relative;",
    });
  }
  debutRetaillage() {
    super.debutRetaillage();
    ObjetPosition_1.GPosition.setHeight(
      this.getInstance(this.identGrille).getNom(),
      0,
    );
    this.getInstance(this.identGrille).surPreResize();
  }
  finRetaillage() {
    super.finRetaillage();
    this._resizeGrille();
  }
  _resizeGrille() {
    const lJGrille = $(
      "#" + this.getInstance(this.identGrille).getNom().escapeJQ(),
    );
    lJGrille.height(lJGrille.parent().innerHeight());
    this.getInstance(this.identGrille).surPostResize();
  }
  _getTitre(aCoursMultiple, aNumeroSemaine) {
    const LDebut = aCoursMultiple.Debut;
    const LFin = aCoursMultiple.Fin;
    const lDateDebut = ObjetDate_1.GDate.placeEnDate(aNumeroSemaine, LDebut);
    const lDateFin = aCoursMultiple.DateDuCoursFin
      ? aCoursMultiple.DateDuCoursFin
      : ObjetDate_1.GDate.placeEnDate(aNumeroSemaine, LFin, true);
    return ObjetChaine_1.GChaine.format(
      ObjetTraduction_1.GTraductions.getValeur("EDT.coursMultipleDuDeA"),
      [
        aCoursMultiple.listeCours.count(),
        ObjetDate_1.GDate.formatDate(lDateDebut, "%JJJJ"),
        ObjetDate_1.GDate.formatDate(lDateDebut, "%xh%sh%mm"),
        ObjetDate_1.GDate.formatDate(lDateFin, "%xh%sh%mm"),
      ],
    );
  }
  _calculerPositionnementCoursMS(aCoursMultiple) {
    function _unePlaceEstOccupee(aPlacesCours, aPlacesCouloir) {
      for (const I in aPlacesCours) {
        if (aPlacesCouloir[I]) {
          return true;
        }
      }
      return false;
    }
    const lCouloirs = [],
      lNbCours = aCoursMultiple.listeCours.count();
    for (let I = 0; I < lNbCours; I++) {
      lCouloirs[I] = [];
    }
    let lNombreColonnes = 1;
    for (let I = 0; I < lNbCours; I++) {
      const lTabOccupation = [];
      const lCours = aCoursMultiple.listeCours.get(I);
      for (let lPlace = lCours.Debut; lPlace <= lCours.Fin; lPlace++) {
        lTabOccupation[lPlace] = true;
      }
      let lCouloir = 0;
      while (_unePlaceEstOccupee(lTabOccupation, lCouloirs[lCouloir])) {
        lCouloir++;
        lNombreColonnes = Math.max(lNombreColonnes, lCouloir + 1);
      }
      for (const J in lTabOccupation) {
        if (lTabOccupation[J]) {
          lCouloirs[lCouloir][J] = true;
        }
      }
      lCours.numeroCouloir = lCouloir;
    }
    aCoursMultiple.nombreCouloirs = lNombreColonnes;
    aCoursMultiple.estCalcule = true;
  }
}
exports.ObjetFenetre_EDT_MS = ObjetFenetre_EDT_MS;
