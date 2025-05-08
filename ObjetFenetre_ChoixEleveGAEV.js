const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const DonneesListe_ElevesGAEV = require("DonneesListe_ElevesGAEV.js");
const ObjetRequeteListeElevesGAEV = require("ObjetRequeteListeElevesGAEV.js");
class ObjetFenetre_ChoixEleveGAEV extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.genreTri = { ordreAlphabetique: 0, classe: 1 };
  }
  construireInstances() {
    this.identListeEleves = this.add(
      ObjetListe,
      this.evenementListeEleves,
      this.initialiserListeEleves,
    );
    this.identComboTri = this.add(
      ObjetSaisie,
      this.evenementComboTri,
      this.initialiserComboTri,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      checkDansLeGroupe: {
        getValue: function () {
          return ObjetFenetre_ChoixEleveGAEV.filtres.dansLeGroupe;
        },
        setValue: function (aValeur) {
          ObjetFenetre_ChoixEleveGAEV.filtres.dansLeGroupe = aValeur;
          aInstance.getInstance(aInstance.identListeEleves).actualiser();
        },
      },
      checkAutresGroupes: {
        getValue: function () {
          return ObjetFenetre_ChoixEleveGAEV.filtres.dansAutreGroupe;
        },
        setValue: function (aValeur) {
          ObjetFenetre_ChoixEleveGAEV.filtres.dansAutreGroupe = aValeur;
          aInstance.getInstance(aInstance.identListeEleves).actualiser();
        },
      },
      checkAucunGroupe: {
        getValue: function () {
          return ObjetFenetre_ChoixEleveGAEV.filtres.aucunGroupe;
        },
        setValue: function (aValeur) {
          ObjetFenetre_ChoixEleveGAEV.filtres.aucunGroupe = aValeur;
          aInstance.getInstance(aInstance.identListeEleves).actualiser();
        },
      },
      checkUniquementPresents: {
        getValue: function () {
          return ObjetFenetre_ChoixEleveGAEV.filtres.presents;
        },
        setValue: function (aValeur) {
          ObjetFenetre_ChoixEleveGAEV.filtres.presents = aValeur;
          aInstance.getInstance(aInstance.identListeEleves).actualiser();
        },
      },
    });
  }
  setDonnees(aCours, aGroupe, aDomaine) {
    this.domaine = aDomaine;
    new ObjetRequeteListeElevesGAEV(
      this,
      this._actionSurRequeteListeElevesGAEV,
      this._surEchecListeElevesGAEV,
    ).lancerRequete({ cours: aCours, groupe: aGroupe, domaine: this.domaine });
  }
  _actionSurRequeteListeElevesGAEV(aJSON) {
    function getListeElevesSelectionnes(aElement) {
      return aElement.estTotalementDesGroupes;
    }
    this.listeEleves = aJSON.listeElevesGAEV;
    this.listeClasses = new ObjetListeElements();
    let lElmClasse;
    this.trierListeSelonGenre(this.genreTri.classe);
    let lClasse = "";
    for (let I = 0; I < this.listeEleves.count(); I++) {
      const lEleve = this.listeEleves.get(I);
      lEleve.pere = null;
      lEleve.estUneClasse = false;
      lEleve.estUnDeploiement = false;
      lEleve.estDeploye = true;
      lEleve.estVisible = null;
      lEleve.visible = true;
      lEleve.initial = {
        estTotalementDesGroupes: lEleve.estTotalementDesGroupes,
        estPartiellementDesGroupes: lEleve.estPartiellementDesGroupes,
      };
      if (!lEleve.estUneClasse && lClasse !== lEleve.classe) {
        lElmClasse = new ObjetElement(lEleve.classe);
        lElmClasse.pere = null;
        lElmClasse.classe = lEleve.classe;
        lElmClasse.estUneClasse = true;
        lElmClasse.visible = false;
        lElmClasse.estUnDeploiement = true;
        lElmClasse.estDeploye = true;
        lElmClasse.estVisible = null;
        this.listeClasses.addElement(lElmClasse);
      }
      lClasse = lEleve.classe;
    }
    for (let I = 0; I < this.listeClasses.count(); I++) {
      lElmClasse = this.listeClasses.get(I);
      lClasse = lElmClasse.classe;
      const lListeEleves = this.listeEleves.getListeElements((aEleve) => {
        return aEleve.classe === lClasse;
      });
      const lListeElevesSelectionne = lListeEleves.getListeElements(
        getListeElevesSelectionnes,
      );
      lElmClasse.estTotalementDesGroupes =
        lListeElevesSelectionne.count() > 0
          ? lListeEleves.count() === lListeElevesSelectionne.count()
            ? true
            : null
          : "";
    }
    this.listeEleves.add(this.listeClasses);
    this.getInstance(this.identComboTri).setDonnees(this.listeTri);
    this.triCourant = this.genreTri.ordreAlphabetique;
    this.getInstance(this.identComboTri).initSelection(this.triCourant);
    this.trierListeSelonGenre(this.triCourant);
    this.afficher();
    this.getInstance(this.identListeEleves).setDonnees(
      new DonneesListe_ElevesGAEV(
        this.listeEleves,
        ObjetFenetre_ChoixEleveGAEV.filtres,
        this.triCourant,
      ),
    );
    this.setBoutonActif(1, false);
  }
  _surEchecListeElevesGAEV() {}
  composeContenu() {
    const lHeightListe =
      this.optionsFenetre.hauteur - 23 - 30 - 5 - 4 * 20 - 20 - 15;
    const T = [];
    T.push(
      '<div class="flex-contain flex-center m-bottom">',
      '<ie-checkbox ie-model="checkDansLeGroupe" class="EspaceDroit">',
      GTraductions.getValeur("ChoixEleveGAEV.coche.presentDansGroupe"),
      "</ie-checkbox>",
      '<i class="Image_CocheVerte as-icon self-start m-bottom-l"></i>',
      "</div>",
    );
    T.push(
      '<div class="flex-contain flex-center m-bottom">',
      '<ie-checkbox ie-model="checkAutresGroupes" class="EspaceDroit">',
      GTraductions.getValeur("ChoixEleveGAEV.coche.affectesAutresGroupes"),
      "</ie-checkbox>",
      '<i class="Image_DiagAffEleTGris as-icon self-start"></i>',
      "</div>",
    );
    T.push(
      "<div>",
      '<ie-checkbox ie-model="checkAucunGroupe">',
      GTraductions.getValeur("ChoixEleveGAEV.coche.affectesAucunGroupe"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      '<hr style="text-align:left; margin-left:2rem; margin-bottom:.4rem; width: 200px;" />',
    );
    T.push(
      '<div class="EspaceBas">',
      '<ie-checkbox ie-model="checkUniquementPresents">',
      GTraductions.getValeur("ChoixEleveGAEV.coche.uniquementsPresents"),
      "</ie-checkbox>",
      "</div>",
    );
    T.push(
      '<div id="',
      this.getNomInstance(this.identComboTri),
      '" class="EspaceBas"></div>',
    );
    T.push(
      '<div id="',
      this.getNomInstance(this.identListeEleves),
      '" style="width:100%; height:',
      lHeightListe,
      'px;"></div>',
    );
    return T.join("");
  }
  initialiserComboTri(aInstance) {
    aInstance.setOptionsObjetSaisie({ longueur: 150 });
    aInstance.setOptionsObjetSaisie({
      texteEdit: GTraductions.getValeur("ChoixEleveGAEV.classerPar") + " ",
    });
    this.listeTri = new ObjetListeElements();
    this.listeTri.addElement(
      new ObjetElement(
        GTraductions.getValeur("ChoixEleveGAEV.ordreAlphabetique"),
        null,
        this.genreTri.ordreAlphabetique,
      ),
    );
    this.listeTri.addElement(
      new ObjetElement(
        GTraductions.getValeur("ChoixEleveGAEV.colonne.classe"),
        null,
        this.genreTri.classe,
      ),
    );
  }
  initialiserListeEleves(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_ElevesGAEV.colonnes.coche,
      titre: { title: "", estCoche: true },
      taille: 20,
    });
    lColonnes.push({
      id: DonneesListe_ElevesGAEV.colonnes.nom,
      titre: GTraductions.getValeur("ChoixEleveGAEV.colonne.nom"),
      taille: 150,
    });
    lColonnes.push({
      id: DonneesListe_ElevesGAEV.colonnes.diagnostic,
      titre: GTraductions.getValeur("ChoixEleveGAEV.colonne.diagnostic"),
      taille: 40,
    });
    lColonnes.push({
      id: DonneesListe_ElevesGAEV.colonnes.classe,
      titre: GTraductions.getValeur("ChoixEleveGAEV.colonne.classe"),
      taille: 50,
    });
    lColonnes.push({
      id: DonneesListe_ElevesGAEV.colonnes.options,
      titre: GTraductions.getValeur("ChoixEleveGAEV.colonne.options"),
      taille: "100%",
    });
    aInstance.setOptionsListe({ colonnes: lColonnes });
  }
  evenementComboTri(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      this.triCourant = aParams.element.getGenre();
      if (this.listeEleves) {
        this.trierListeSelonGenre(this.triCourant);
        this.getInstance(this.identListeEleves).setDonnees(
          new DonneesListe_ElevesGAEV(
            this.listeEleves,
            ObjetFenetre_ChoixEleveGAEV.filtres,
            this.triCourant,
          ),
        );
      }
    }
  }
  trierListeSelonGenre(aGenreTri) {
    if (aGenreTri === this.genreTri.ordreAlphabetique) {
      this.listeEleves.setTri([
        ObjetTri.init("Libelle"),
        ObjetTri.init("classe"),
      ]);
      this.listeEleves.trier();
      for (let I = 0; I < this.listeEleves.count(); I++) {
        const lEleve = this.listeEleves.get(I);
        if (lEleve.estUneClasse) {
          lEleve.visible = false;
        } else {
          lEleve.pere = null;
        }
      }
    } else {
      this.listeEleves.setTri([
        ObjetTri.init("classe"),
        ObjetTri.init("estUneClasse", EGenreTriElement.Decroissant),
        ObjetTri.init("Libelle"),
      ]);
      this.listeEleves.trier();
      let lElmPere = null;
      for (let I = 0; I < this.listeEleves.count(); I++) {
        const lEleve = this.listeEleves.get(I);
        if (lEleve.estUneClasse) {
          lElmPere = lEleve;
          lEleve.visible = true;
        } else {
          lEleve.pere = lElmPere;
        }
      }
    }
  }
  evenementListeEleves(aParametres) {
    if (aParametres.genreEvenement === EGenreEvenementListe.ApresEdition) {
      this.setBoutonActif(1, this.estListeElevesModifie());
    }
  }
  estListeElevesModifie() {
    for (let I = 0; I < this.listeEleves.count(); I++) {
      const lEleve = this.listeEleves.get(I);
      if (_estEleveModifie(lEleve)) {
        return true;
      }
    }
    return false;
  }
  surValidation(aGenreBouton) {
    this.fermer();
    let lListeEleves;
    if (aGenreBouton === 1) {
      lListeEleves = this.listeEleves.getListeElements((aElement) => {
        return !aElement.estUneClasse;
      });
      for (let I = 0; I < lListeEleves.count(); I++) {
        const lEleve = lListeEleves.get(I);
        if (_estEleveModifie(lEleve)) {
          lEleve.setEtat(
            lEleve.estTotalementDesGroupes
              ? EGenreEtat.Modification
              : EGenreEtat.Suppression,
          );
        }
      }
    }
    this.callback.appel(aGenreBouton, lListeEleves);
  }
}
ObjetFenetre_ChoixEleveGAEV.filtres = {
  dansLeGroupe: true,
  dansAutreGroupe: true,
  aucunGroupe: true,
  presents: true,
};
function _estEleveModifie(aEleve) {
  return (
    aEleve &&
    !aEleve.estUneClasse &&
    (aEleve.initial.estTotalementDesGroupes !==
      aEleve.estTotalementDesGroupes ||
      aEleve.initial.estPartiellementDesGroupes !==
        aEleve.estPartiellementDesGroupes)
  );
}
module.exports = ObjetFenetre_ChoixEleveGAEV;
