exports.ObjetFenetre_ListeProgramme = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
class ObjetFenetre_ListeProgramme extends ObjetFenetre_1.ObjetFenetre {
  constructor() {
    super(...arguments);
    this.idCycle = this.Nom + "_cycle";
    this.etatUtilisateur = GApplication.getEtatUtilisateur();
  }
  construireInstances() {
    this.identCombo = this.add(
      ObjetSaisiePN_1.ObjetSaisiePN,
      this.evenementSurCombo,
      _initialiserCombo,
    );
    this.identComboFiliere = this.add(
      ObjetSaisiePN_1.ObjetSaisiePN,
      this.evenementSurComboFiliere,
      _initialiserCombo,
    );
    this.identListe = this.add(
      ObjetListe_1.ObjetListe,
      this.evenementSurListeProgrammes.bind(this),
      _initialiserListeProgrammes,
    );
  }
  setDonnees(aNiveauProgression) {
    this.afficher();
    const lIndice =
      this.etatUtilisateur.listeProgrammesParNiveau.getIndiceParNumeroEtGenre(
        aNiveauProgression.getNumero(),
      ) || 0;
    this._niveauCourant =
      this.etatUtilisateur.listeProgrammesParNiveau.get(lIndice);
    this.surFixerTaille();
    this.getInstance(this.identCombo).setDonnees(
      this.etatUtilisateur.listeProgrammesParNiveau,
      lIndice,
    );
  }
  composeContenu() {
    const lHtml = [];
    lHtml.push('<div class="full-height flex-contain cols">');
    lHtml.push('<div class="PetitEspaceBas fix-bloc">');
    lHtml.push(
      '<div class="Texte10 PetitEspaceDroit InlineBlock AlignementMilieuVertical">',
      ObjetTraduction_1.GTraductions.getValeur("progression.DES_COMBONIVEAUX"),
      "</div>",
    );
    lHtml.push(
      '<div class="InlineBlock AlignementMilieuVertical" id="' +
        this.getNomInstance(this.identCombo) +
        '"></div>',
    );
    lHtml.push(
      '<div class="InlineBlock AlignementMilieuVertical EspaceGauche" id="' +
        this.getNomInstance(this.identComboFiliere) +
        '" style="display:none"></div>',
    );
    lHtml.push(
      '<div id="',
      this.idCycle,
      '" class="InlineBlock AlignementMilieuVertical EspaceGauche"></div>',
    );
    lHtml.push("</div>");
    lHtml.push(
      '<div id="' +
        this.getNomInstance(this.identListe) +
        '" class="fluid-bloc"></div>',
    );
    lHtml.push("</div>");
    return lHtml.join("");
  }
  _actualiserListe(
    aListeProgrammes,
    aSurFiliere,
    aFiltreFiliere,
    aFiltreNouveau,
  ) {
    this.setBoutonActif(1, false);
    this.getInstance(this.identListe).setDonnees(
      new DonneesListe_SelectionProgramme(
        aListeProgrammes,
        aSurFiliere,
        aFiltreFiliere,
        aFiltreNouveau,
      ),
    );
  }
  evenementSurCombo(aParams) {
    if (
      aParams.genreEvenement ===
      Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
    ) {
      this._niveauCourant = aParams.element;
      ObjetHtml_1.GHtml.setHtml(
        this.idCycle,
        aParams.element.ancienNouveau && aParams.element.cycle
          ? aParams.element.cycle || ""
          : "",
      );
      const lListeFilieres = new ObjetListeElements_1.ObjetListeElements(),
        lHashFiliere = {};
      this._niveauCourant.listeProgrammes.parcourir((aElement) => {
        if (aElement && aElement.filieres) {
          for (let i in aElement.filieres) {
            let lFiliere = aElement.filieres[i];
            if (!lHashFiliere[lFiliere]) {
              lHashFiliere[lFiliere] = true;
              lListeFilieres.addElement(
                new ObjetElement_1.ObjetElement(lFiliere),
              );
            }
          }
        }
      });
      lListeFilieres.trier();
      const lComboVisibleFiliere = lListeFilieres.count() > 0;
      ObjetHtml_1.GHtml.setDisplay(
        this.getNomInstance(this.identComboFiliere),
        lComboVisibleFiliere,
      );
      let lElement;
      if (lComboVisibleFiliere) {
        lElement = new ObjetElement_1.ObjetElement(
          ObjetTraduction_1.GTraductions.getValeur(
            "progression.TOUTESFILIERES",
          ),
        );
        lElement.tous = true;
        lListeFilieres.insererElement(lElement, 0);
        this.getInstance(this.identComboFiliere).setDonnees(lListeFilieres, 0);
      } else {
        this._actualiserListe(this._niveauCourant.listeProgrammes, true);
      }
    }
  }
  evenementSurComboFiliere(aParams) {
    if (
      aParams.genreEvenement ===
      Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
    ) {
      const lFiltreFiliere = aParams.element.tous
        ? null
        : aParams.element.getLibelle();
      this._actualiserListe(
        this._niveauCourant.listeProgrammes,
        true,
        lFiltreFiliere,
      );
    }
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(
      aNumeroBouton,
      this._ProgrammeSelectionne,
      this._niveauCourant,
    );
  }
  evenementSurListeProgrammes(aParametres) {
    switch (aParametres.genreEvenement) {
      case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
        this._ProgrammeSelectionne = aParametres.article;
        this.setBoutonActif(1, !!this._ProgrammeSelectionne);
        break;
    }
  }
}
exports.ObjetFenetre_ListeProgramme = ObjetFenetre_ListeProgramme;
function _initialiserCombo(aInstance) {
  aInstance.setOptionsObjetSaisie({
    forcerBoutonDeploiement: false,
    avecTriListeElements: false,
  });
}
function _initialiserListeProgrammes(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: Colonnes.matiere,
    titre: ObjetTraduction_1.GTraductions.getValeur("progression.Matiere"),
    taille: 275,
  });
  lColonnes.push({
    id: Colonnes.titre,
    titre: ObjetTraduction_1.GTraductions.getValeur("progression.Programme"),
    taille: "100%",
  });
  aInstance.setOptionsListe({ colonnes: lColonnes });
}
class DonneesListe_SelectionProgramme extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aDonnees, aSurFiliere, aFiltreFiliere, aFiltreNouveau) {
    super(aDonnees);
    this.surFiliere = aSurFiliere;
    this.filtreFiliere = aFiltreFiliere;
    this.filtreNouveau = aFiltreNouveau;
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecEvnt_Selection: true,
    });
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case Colonnes.matiere: {
        const lMatiere = [];
        lMatiere.push(
          '<span style="float: left;">',
          aParams.article.getLibelle(),
          "</span>",
        );
        if (!!aParams.article.filiere) {
          lMatiere.push(
            '<span style="float: right">',
            aParams.article.filiere,
            "</span>",
          );
        }
        return lMatiere.join("");
      }
      case Colonnes.titre:
        return aParams.article.titreProgramme || "";
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case Colonnes.matiere:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
  }
  getVisible(aArticle) {
    if (this.surFiliere) {
      if (!this.filtreFiliere) {
        return true;
      } else {
        return (
          aArticle &&
          this.filtreFiliere &&
          (!aArticle.filiere || aArticle.filieres.includes(this.filtreFiliere))
        );
      }
    }
    return aArticle && aArticle.nouveau === this.filtreNouveau;
  }
}
var Colonnes;
(function (Colonnes) {
  Colonnes["matiere"] = "DL_SelectionProgramme_matiere";
  Colonnes["titre"] = "DL_SelectionProgramme_titre";
})(Colonnes || (Colonnes = {}));
