const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
  ObjetFenetre_SelectionRessource,
} = require("ObjetFenetre_SelectionRessource.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetListe } = require("ObjetListe.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
class ObjetFenetre_SelectionClasseGroupe extends ObjetFenetre_SelectionRessource {
  constructor(...aParams) {
    super(...aParams);
    this.avecCumul = false;
    this.setOptionsFenetre({
      listeBoutons: [
        {
          libelle: GTraductions.getValeur("Annuler"),
          theme: TypeThemeBouton.secondaire,
        },
        {
          libelle: GTraductions.getValeur("Valider"),
          theme: TypeThemeBouton.primaire,
        },
      ],
      largeur: 320,
      hauteur: 400,
      heightMax_mobile: true,
    });
    this.setOptionsFenetreSelectionRessource({
      avecBarreTitre: true,
      optionsListe: { nonEditable: false, avecCelluleEditableTriangle: false },
    });
    this.setSelectionObligatoire(true);
    this.indexBtnValider = 1;
  }
  setAvecCumul(aAvecCumul) {
    this.avecCumul = aAvecCumul;
  }
  setDonnees(aParam) {
    this.listeRessourcesSelectionnees = aParam.listeRessourcesSelectionnees;
    this.genreRessource = EGenreRessource.Classe;
    if (this.avecCumul) {
      this._construireListeRessourceAvecCumul(
        aParam.listeRessources,
        aParam.listeRessourcesSelectionnees,
      );
    } else {
      this.construireListeRessource(
        aParam.listeRessources,
        aParam.listeRessourcesSelectionnees,
      );
    }
    if (aParam.titre) {
      this.setOptionsFenetre({ titre: aParam.titre });
    } else {
      this.setOptionsFenetre({
        titre: GTraductions.getValeur("fenetreSelectionClasseGroupe.titre"),
      });
    }
    this.afficher();
    this._actualiserListe();
    if (aParam.genreRessource) {
      this.genreRessource = aParam.genreRessource;
    }
  }
  _initialiserListe(aInstance) {
    const lColonnes = [{ id: "", taille: "100%" }];
    let lOptions = {
      colonnes: lColonnes,
      skin: ObjetListe.skin.flatDesign,
      avecCBToutCocher: !!this._options.avecCocheRessources,
      forcerOmbreScrollBottom: true,
    };
    if (this._options.optionsListe) {
      $.extend(lOptions, this._options.optionsListe);
    }
    aInstance.setOptionsListe(lOptions);
  }
  _actualiserListe() {
    this.setBoutonActif(
      this.indexBtnValider,
      !this._options.selectionObligatoire || this._nbRessourcesCochees() > 0,
    );
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_SelectionClasseGroupe(this.listeRessources),
    );
  }
  _construireListeRessourceAvecCumul(
    aListeRessources,
    aListeRessourcesSelectionnees,
  ) {
    let lCumulGroupe = new ObjetElement(
      GTraductions.getValeur("Groupes"),
      0,
      EGenreRessource.Groupe,
    );
    lCumulGroupe.estDeploye = false;
    lCumulGroupe.estUnDeploiement = true;
    lCumulGroupe.setActif(true);
    let lListeCumul = new ObjetListeElements(),
      lAvecGroupe = false;
    this.listeRessources = new ObjetListeElements();
    for (let i = 0; i < aListeRessources.count(); i++) {
      if (aListeRessources.get(i).existeNumero()) {
        let lRessource = MethodesObjet.dupliquer(aListeRessources.get(i));
        if (lRessource.getGenre() === EGenreRessource.Groupe) {
          lAvecGroupe = true;
          lRessource.pere = lCumulGroupe;
        } else {
          let lNiveau = lListeCumul.get(
            lListeCumul.getIndiceParNumeroEtGenre(
              lRessource.niveau.getNumero(),
            ),
          );
          if (!lNiveau) {
            lNiveau = new ObjetElement(
              lRessource.niveau.getLibelle(),
              lRessource.niveau.getNumero(),
              0,
            );
            lNiveau.estUnDeploiement = true;
            lNiveau.estDeploye = false;
            lListeCumul.addElement(lNiveau);
          }
          lRessource.pere = lNiveau;
        }
        const lRessourceTrouve =
          aListeRessourcesSelectionnees.getElementParElement(lRessource);
        lRessource.selectionne = !!(
          lRessourceTrouve &&
          lRessourceTrouve.getEtat() !== EGenreEtat.Suppression
        );
        this.listeRessources.addElement(lRessource);
      }
    }
    if (lAvecGroupe) {
      this.listeRessources.addElement(lCumulGroupe);
    }
    for (let i = 0; i < lListeCumul.count(); i++) {
      this.listeRessources.addElement(lListeCumul.get(i));
    }
    this.listeRessources.setTri([
      ObjetTri.init((D) => {
        return D.getGenre() === EGenreRessource.Groupe;
      }),
      ObjetTri.init((D) => {
        return D.pere ? D.pere.getLibelle() : D.getLibelle();
      }),
      ObjetTri.init((D) => {
        return !!D.pere;
      }),
      ObjetTri.init("Libelle"),
    ]);
    this.listeRessources.trier();
  }
}
class DonneesListe_SelectionClasseGroupe extends ObjetDonneesListeFlatDesign {
  constructor(ADonnees) {
    super(ADonnees);
    this.setOptions({
      avecSelection: false,
      avecSuppression: false,
      avecEtatSaisie: false,
      avecTri: false,
      avecCB: true,
      avecEvnt_CB: true,
      avecCocheCBSurLigne: true,
      avecDeploiement: true,
      avecEvnt_Deploiement: true,
      avecEventDeploiementSurCellule: true,
      avecEvnt_ApresEdition: true,
      avecBoutonActionLigne: false,
    });
  }
  getDisabledCB(aParams) {
    let D = aParams.article;
    return !!D.nonEditable;
  }
  getValueCB(aParams) {
    return aParams.article ? aParams.article.selectionne : false;
  }
  setValueCB(aParams, aValue) {
    aParams.article.selectionne = aValue;
  }
  getTitreZonePrincipale(aParams) {
    let D = aParams.article;
    return D.getLibelle();
  }
  desactiverIndentationParente() {
    return true;
  }
}
module.exports = { ObjetFenetre_SelectionClasseGroupe };
