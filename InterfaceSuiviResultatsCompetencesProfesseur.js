const {
  _InterfaceSuiviResultatsCompetences,
} = require("_InterfaceSuiviResultatsCompetences.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
  ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const {
  ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
class InterfaceSuiviResultatsCompetencesProfesseur extends _InterfaceSuiviResultatsCompetences {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    super.construireInstances();
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evenementTripleCombo.bind(this),
      _initialiserTripleCombo,
    );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnOptionsAffichage: {
        instanceFenetre: null,
        event() {
          const lFenetre =
            (this.controleur.btnOptionsAffichage.instanceFenetre =
              ObjetFenetre.creerInstanceFenetre(
                ObjetFenetre_OptionsAffichageSuiviResultatsCpt,
                {
                  pere: aInstance,
                  evenement: function (aNumeroBouton, aDonnees) {
                    if (aNumeroBouton === 1) {
                      aInstance.optionsAffichage.seuilEchecs =
                        aDonnees.valeurSeuilEchecs;
                      aInstance.optionsAffichage.seuilSucces =
                        aDonnees.valeurSeuilSucces;
                      aInstance.optionsAffichage.niveauReference =
                        aDonnees.valeurNiveauReference;
                      aInstance.lancerRequeteRecuperationDonnees();
                    }
                  },
                },
              ));
          lFenetre.setDonneesOptionsAffichage({
            valeurSeuilEchecs: aInstance.optionsAffichage.seuilEchecs,
            valeurSeuilSucces: aInstance.optionsAffichage.seuilSucces,
            valeurNiveauReference: aInstance.optionsAffichage.niveauReference,
          });
          lFenetre.afficher();
        },
        getTitle() {
          return GTraductions.getValeur(
            "SuiviResultatsCompetences.fenetreOptionsAff.Titre",
          );
        },
        getSelection() {
          const lInstanceFenetre =
            this.controleur.btnOptionsAffichage.instanceFenetre;
          return lInstanceFenetre && lInstanceFenetre.estAffiche();
        },
        getDisabled() {
          return !aInstance.getEleveConcerne();
        },
      },
    });
  }
  getElementsAddSurZoneSelection() {
    return [this.identTripleCombo];
  }
  getElementsAddSurZoneParametrage() {
    return [
      {
        html: UtilitaireBoutonBandeau.getHtmlBtnParametrer(
          "btnOptionsAffichage",
        ),
      },
    ];
  }
  getClasseConcernee() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
  }
  getEleveConcerne() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
  }
  getPeriodeConcernee() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
  }
  estJaugeCliquable() {
    return true;
  }
  surClicJaugeEvaluations(aLigne) {
    if (aLigne.relationsESI && aLigne.relationsESI.length) {
      new ObjetRequeteDetailEvaluationsCompetences(
        this,
        this._reponseRequeteDetailEvaluations.bind(this, aLigne),
      ).lancerRequete({
        eleve: this.getEleveConcerne(),
        pilier: null,
        periode: this.getPeriodeConcernee(),
        numRelESI: aLigne.relationsESI,
      });
    }
  }
  _reponseRequeteDetailEvaluations(aLigne, aJSON) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_DetailEvaluationsCompetences,
      {
        pere: this,
        initialiser(aInstanceFenetre) {
          aInstanceFenetre.setOptionsFenetre({
            titre: "",
            largeur: 700,
            hauteur: 500,
            listeBoutons: [GTraductions.getValeur("Fermer")],
          });
        },
      },
    );
    lFenetre.setDonnees(aLigne, aJSON, {
      titreFenetre: this.getEleveConcerne().getLibelle(),
      libelleComplementaire: aLigne.getLibelle(),
    });
  }
  lancerRequeteRecuperationDonnees() {
    super.lancerRequeteRecuperationDonnees();
  }
  evenementSurListeClasse(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.SelectionClick:
        GEtatUtilisateur.Navigation.setRessource(
          EGenreRessource.Eleve,
          aParametres.article,
        );
        this.getInstance(this.identTripleCombo).recupererDonnees();
        break;
    }
  }
}
function _initialiserTripleCombo(aInstance) {
  aInstance.setParametres([
    EGenreRessource.Classe,
    EGenreRessource.Periode,
    EGenreRessource.Eleve,
  ]);
}
function _evenementTripleCombo() {
  this.afficherPage();
}
class ObjetFenetre_OptionsAffichageSuiviResultatsCpt extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: GTraductions.getValeur(
        "SuiviResultatsCompetences.fenetreOptionsAff.Titre",
      ),
      largeur: 550,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
    this.donnees = {
      valeurSeuilEchecs: 0,
      valeurSeuilSucces: 0,
      valeurNiveauReference: null,
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      comboNoteEchecsSucces: {
        init(aEstPourEchecs, aInstanceCombo) {
          aInstanceCombo.setOptionsObjetSaisie({
            longueur: 40,
            labelWAICellule: GTraductions.getValeur(
              "SuiviResultatsCompetences.fenetreOptionsAff.wai.SelectionPourcentage",
              [
                aEstPourEchecs
                  ? getStrListeNiveauxNonAcquis()
                  : getStrListeNiveauxAcquis(),
              ],
            ),
          });
        },
        getDonnees(aEstPourEchecs, aDonnees) {
          if (!aDonnees) {
            const lListe = new ObjetListeElements();
            for (let i = 5; i < 101; i += 5) {
              lListe.add(new ObjetElement("" + i, 0, i));
            }
            return lListe;
          }
        },
        getIndiceSelection(aEstPourEchecs, aInstanceCombo) {
          let lValeurSeuil;
          if (aEstPourEchecs) {
            lValeurSeuil = aInstance.donnees.valeurSeuilEchecs;
          } else {
            lValeurSeuil = aInstance.donnees.valeurSeuilSucces;
          }
          let lIndiceASelectionner = -1;
          const lListeElems = aInstanceCombo.getListeElements();
          if (lListeElems) {
            lIndiceASelectionner = lListeElems.getIndiceParNumeroEtGenre(
              0,
              lValeurSeuil,
            );
          }
          return Math.max(lIndiceASelectionner, 0);
        },
        event(aEstPourEchecs, aParametres) {
          if (aParametres.estSelectionManuelle && aParametres.element) {
            const lValeurSeuil = aParametres.element.getGenre();
            if (aEstPourEchecs) {
              aInstance.donnees.valeurSeuilEchecs = lValeurSeuil;
            } else {
              aInstance.donnees.valeurSeuilSucces = lValeurSeuil;
            }
          }
        },
      },
      radioNiveauReference: {
        getValue(aNiveauReference) {
          return aInstance.donnees.valeurNiveauReference === aNiveauReference;
        },
        setValue(aNiveauReference) {
          aInstance.donnees.valeurNiveauReference = aNiveauReference;
        },
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push('<div id="FenetreOptionsAffichageSuiviResultatsCpt">');
    T.push(
      '<div class="ContainerOption">',
      `<div class="TitreOption">${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.CompetencesNonMaitrisees")}</div>`,
      `<div>${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.EchecCompetenceSi")}</div>`,
      '<div class="m-left-xl">',
      `<span>${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.AuMoins")}</span>`,
      '<ie-combo ie-model="comboNoteEchecsSucces(true)" class="round-style m-left m-right InlineBlock"></ie-combo>',
      `<span>${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.PourcentageEvalsCompEvaluees", [getStrListeNiveauxNonAcquis()])}</span>`,
      "</div>",
      "</div>",
    );
    T.push(
      '<div class="ContainerOption">',
      `<div class="TitreOption">${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.CompetencesMaitrisees")}</div>`,
      `<div>${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.SuccesCompetenceSi")}</div>`,
      '<div class="m-left-xl">',
      `<span>${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.AuMoins")}</span>`,
      '<ie-combo ie-model="comboNoteEchecsSucces(false)" class="round-style m-left m-right InlineBlock"></ie-combo>',
      `<span>${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.PourcentageEvalsCompEvaluees", [getStrListeNiveauxAcquis()])}</span>`,
      "</div>",
      "</div>",
    );
    T.push(
      '<div class="ContainerOption">',
      `<div class="TitreOption">${GTraductions.getValeur("SuiviResultatsCompetences.fenetreOptionsAff.ElementsUtilisesDansCalcul")}</div>`,
      '<div class="m-left-xl">',
    );
    T.push(
      '<div><ie-radio ie-model="radioNiveauReference(',
      EGenreRessource.ElementPilier,
      ')">',
      GTraductions.getValeur(
        "SuiviResultatsCompetences.fenetreOptionsAff.CalculParElementsSignifiants",
      ),
      "</ie-radio></div>",
    );
    T.push(
      '<div><ie-radio ie-model="radioNiveauReference(',
      EGenreRessource.Competence,
      ')">',
      GTraductions.getValeur(
        "SuiviResultatsCompetences.fenetreOptionsAff.CalculParCompetences",
      ),
      "</ie-radio></div>",
    );
    T.push("</div>", "</div>");
    T.push("</div>");
    return T.join("");
  }
  setDonneesOptionsAffichage(aDonnees) {
    this.donnees.valeurSeuilEchecs = aDonnees.valeurSeuilEchecs;
    this.donnees.valeurSeuilSucces = aDonnees.valeurSeuilSucces;
    this.donnees.valeurNiveauReference = aDonnees.valeurNiveauReference;
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, {
      valeurSeuilEchecs: this.donnees.valeurSeuilEchecs,
      valeurSeuilSucces: this.donnees.valeurSeuilSucces,
      valeurNiveauReference: this.donnees.valeurNiveauReference,
    });
  }
}
function getStrListeNiveauxNonAcquis() {
  const lListeNiveauxNonAcquis =
    TUtilitaireCompetences.getListeNiveauxNonAcquis();
  return lListeNiveauxNonAcquis
    ? lListeNiveauxNonAcquis.getTableauLibelles().join(", ")
    : "";
}
function getStrListeNiveauxAcquis() {
  const lListeNiveauxNonAcquis = TUtilitaireCompetences.getListeNiveauxAcquis();
  return lListeNiveauxNonAcquis
    ? lListeNiveauxNonAcquis.getTableauLibelles().join(", ")
    : "";
}
module.exports = { InterfaceSuiviResultatsCompetencesProfesseur };
