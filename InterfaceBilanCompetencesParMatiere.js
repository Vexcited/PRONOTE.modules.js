const { InterfacePage } = require("InterfacePage.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetListe } = require("ObjetListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const ObjetRequeteBilanCompetencesParMatiere = require("ObjetRequeteBilanCompetencesParMatiere.js");
const DonneesListe_BilanCompetencesParMatiere = require("DonneesListe_BilanCompetencesParMatiere.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const {
  ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const ObjetRequeteSaisieBilanCompetencesParMatiere = require("ObjetRequeteSaisieBilanCompetencesParMatiere.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreNiveauDAcquisition } = require("Enumere_NiveauDAcquisition.js");
class InterfaceBilanCompetencesParMatiere extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.ids = { pageMessage: GUID.getId(), pageDonnees: GUID.getId() };
    this.donnees = {
      listePaliersEtMM: null,
      palierSelectionne: null,
      metaMatiereSelectionnee: null,
    };
    this.optionsAffichageListe = { afficheJaugeChronologique: false };
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evenementTripleCombo.bind(this),
      _initialiserTripleCombo,
    );
    this.identListeCompetences = this.add(
      ObjetListe,
      _evenementListe.bind(this),
      _initialiserListe,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({
      html: '<ie-combo ie-model="comboPaliers"></ie-combo>',
    });
    this.AddSurZone.push({
      html: '<ie-combo ie-model="comboMetaMatieres"></ie-combo>',
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      comboPaliers: {
        init(aInstanceCombo) {
          aInstanceCombo.setOptionsObjetSaisie({
            labelWAICellule: GTraductions.getValeur("WAI.listeSelectionPalier"),
          });
        },
        getDonnees(aDonnees) {
          if (!aDonnees) {
            return aInstance.donnees.listePaliersEtMM;
          }
        },
        getIndiceSelection() {
          let lIndicePalierSelectionne = 0;
          if (
            aInstance.donnees.listePaliersEtMM &&
            aInstance.donnees.palierSelectionne
          ) {
            lIndicePalierSelectionne =
              aInstance.donnees.listePaliersEtMM.getIndiceParElement(
                aInstance.donnees.palierSelectionne,
              );
          }
          return Math.max(lIndicePalierSelectionne, 0);
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle && aParametres.element) {
            aInstance.donnees.palierSelectionne = aParametres.element;
            if (
              aInstance.donnees.palierSelectionne.listeMM &&
              aInstance.donnees.palierSelectionne.listeMM.count() > 0
            ) {
              aInstance.donnees.metaMatiereSelectionnee =
                aInstance.donnees.palierSelectionne.listeMM.get(0);
            }
            aInstance.lancerRequeteRecuperationDonnees();
          }
        },
      },
      comboMetaMatieres: {
        init(aInstanceCombo) {
          aInstanceCombo.setOptionsObjetSaisie({
            labelWAICellule: GTraductions.getValeur(
              "WAI.ListeSelectionMatiere",
            ),
          });
        },
        getDonnees() {
          if (aInstance.donnees.palierSelectionne) {
            return aInstance.donnees.palierSelectionne.listeMM;
          }
          return new ObjetListeElements();
        },
        getIndiceSelection() {
          let lIndiceMMSelectionnee = 0;
          if (
            aInstance.donnees.palierSelectionne &&
            aInstance.donnees.palierSelectionne.listeMM &&
            aInstance.donnees.metaMatiereSelectionnee
          ) {
            lIndiceMMSelectionnee =
              aInstance.donnees.palierSelectionne.listeMM.getIndiceParElement(
                aInstance.donnees.metaMatiereSelectionnee,
              );
          }
          return Math.max(lIndiceMMSelectionnee, 0);
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle && aParametres.element) {
            aInstance.donnees.metaMatiereSelectionnee = aParametres.element;
            aInstance.lancerRequeteRecuperationDonnees();
          }
        },
      },
    });
  }
  getClasseConcernee() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
  }
  getPeriodeConcernee() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
  }
  getEleveConcerne() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
  }
  getPalierConcerne() {
    return this.donnees.palierSelectionne;
  }
  getMetaMatiereConcernee() {
    return this.donnees.metaMatiereSelectionnee;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="BilanCompetencesParMatiere interface_affV">');
    H.push('<div id="', this.ids.pageMessage, '"></div>');
    H.push(
      '<div id="',
      this.ids.pageDonnees,
      '" class="PageDonnees interface_affV_client p-all" style="display:none;">',
    );
    H.push(
      '<div id="',
      this.getInstance(this.identListeCompetences).getNom(),
      '"></div>',
    );
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  afficherPage() {
    this.setEtatSaisie(false);
    this.lancerRequeteRecuperationDonnees();
  }
  lancerRequeteRecuperationDonnees() {
    const lParamsRecuperationDonnees = {
      classe: this.getClasseConcernee(),
      periode: this.getPeriodeConcernee(),
      eleve: this.getEleveConcerne(),
      palier: this.getPalierConcerne(),
      metaMatiere: this.getMetaMatiereConcernee(),
      avecRecuperationListePaliersMM: !this.donnees.listePaliersEtMM,
    };
    new ObjetRequeteBilanCompetencesParMatiere(
      this,
      this._actionSurRequeteBilanCompetences,
    ).lancerRequete(lParamsRecuperationDonnees);
  }
  _actionSurRequeteBilanCompetences(aJSON) {
    GHtml.setDisplay(this.ids.pageMessage, false);
    GHtml.setDisplay(this.ids.pageDonnees, false);
    if (aJSON.listeCompetences) {
      this.afficherBandeau(true);
      GHtml.setDisplay(this.ids.pageDonnees, true);
      _formatterDonneesListeCompetences(aJSON.listeCompetences);
      const lInstanceListe = this.getInstance(this.identListeCompetences);
      lInstanceListe.setOptionsListe({
        colonnes: getListeColonnes.call(this, aJSON.listeColonnesServices),
      });
      const lDonneesListe = new DonneesListe_BilanCompetencesParMatiere(
        aJSON.listeCompetences,
      );
      lDonneesListe.setOptionsAffichage(this.optionsAffichageListe);
      lInstanceListe.setDonnees(lDonneesListe);
      if (!this.donnees.listePaliersEtMM) {
        this.donnees.listePaliersEtMM = aJSON.listePaliersEtMM;
        if (aJSON.listePaliersEtMM) {
          if (aJSON.palierSelectionne) {
            this.donnees.palierSelectionne =
              aJSON.listePaliersEtMM.getElementParNumero(
                aJSON.palierSelectionne.getNumero(),
              );
          }
          if (
            aJSON.metaMatiereSelectionnee &&
            this.donnees.palierSelectionne.listeMM
          ) {
            this.donnees.metaMatiereSelectionnee =
              this.donnees.palierSelectionne.listeMM.getElementParNumero(
                aJSON.metaMatiereSelectionnee.getNumero(),
              );
          }
        }
      }
      if (
        GApplication.droits.get(
          TypeDroits.autoriserImpressionBulletinReleveBrevet,
        )
      ) {
        Invocateur.evenement(
          ObjetInvocateur.events.activationImpression,
          EGenreImpression.GenerationPDF,
          this,
          _getParametresPDF.bind(this),
        );
      }
    } else if (aJSON.message) {
      this.evenementAfficherMessage(aJSON.message);
    }
  }
  evenementAfficherMessage(aGenreMessage) {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    this.afficherBandeau(false);
    GHtml.setDisplay(this.ids.pageDonnees, false);
    GHtml.setDisplay(this.ids.pageMessage, true);
    const lStrMessage =
      typeof aGenreMessage === "number"
        ? GTraductions.getValeur("Message")[aGenreMessage]
        : aGenreMessage;
    GHtml.setHtml(this.ids.pageMessage, this.composeMessage(lStrMessage));
  }
  valider() {
    const lDonneesSaisies = {
      classe: this.getClasseConcernee(),
      periode: this.getPeriodeConcernee(),
      eleve: this.getEleveConcerne(),
      listeElementsCompetences: this.getInstance(
        this.identListeCompetences,
      ).getListeArticles(),
    };
    new ObjetRequeteSaisieBilanCompetencesParMatiere(
      this,
      this.actionSurValidation,
    ).lancerRequete(lDonneesSaisies);
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
  this.donnees.listePaliersEtMM = null;
  this.afficherPage();
}
function _initialiserListe(aInstance) {
  aInstance.setOptionsListe({
    hauteurAdapteContenu: true,
    boutons: [{ genre: ObjetListe.typeBouton.deployer }],
  });
}
function getListeColonnes(aListeServices) {
  const lTitreColonneJauge = [];
  lTitreColonneJauge.push('<div class="flex-contain flex-center">');
  lTitreColonneJauge.push(
    '<ie-btnimage ie-model="btnBasculeJauge" class="Image_BasculeJauge" style="width: 18px;"></ie-btnimage>',
  );
  lTitreColonneJauge.push(
    '<span class="fluid-bloc">',
    GTraductions.getValeur("BilanCompetencesParMM.colonnes.Jauge"),
    "</span>",
  );
  lTitreColonneJauge.push("</div>");
  const lInstance = this;
  const lInstanceListe = this.getInstance(this.identListeCompetences);
  lInstanceListe.controleur.btnBasculeJauge = {
    event() {
      lInstance.optionsAffichageListe.afficheJaugeChronologique =
        !lInstance.optionsAffichageListe.afficheJaugeChronologique;
      lInstanceListe
        .getDonneesListe()
        .setOptionsAffichage(lInstance.optionsAffichageListe);
      lInstanceListe.actualiser(true);
    },
    getTitle() {
      return lInstance.optionsAffichageListe.afficheJaugeChronologique
        ? GTraductions.getValeur(
            "BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
          )
        : GTraductions.getValeur(
            "BulletinEtReleve.hintBtnAfficherJaugeChronologique",
          );
    },
    getSelection() {
      return lInstance.optionsAffichageListe.afficheJaugeChronologique;
    },
  };
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_BilanCompetencesParMatiere.colonnes.libelle,
    titre: GTraductions.getValeur("BilanCompetencesParMM.colonnes.Items"),
    taille: "100%",
  });
  lColonnes.push({
    id: DonneesListe_BilanCompetencesParMatiere.colonnes.jauge,
    titre: { libelleHtml: lTitreColonneJauge.join("") },
    taille: 300,
  });
  const lThis = this;
  lInstanceListe.controleur.btnCalculAutoNiveauService = {
    event(aNumeroService) {
      _surCalculAutoNiveauService.call(lThis, aNumeroService);
    },
    getTitle() {
      return GTraductions.getValeur(
        "BilanCompetencesParMM.CalculAutoColonneService.hint",
      );
    },
  };
  if (aListeServices) {
    aListeServices.parcourir((aService) => {
      const lSuperColonneService = {
        libelle: aService.getLibelle(),
        title: aService.hint || aService.getLibelle(),
      };
      const lLibelleColonneNiveau = [];
      lLibelleColonneNiveau.push('<div class="flex-contain flex-center">');
      if (aService.avecCalculAuto) {
        lLibelleColonneNiveau.push(
          "<ie-btnicon ie-model=\"btnCalculAutoNiveauService('",
          aService.getNumero(),
          '\')" class="icon_sigma color-neutre"></ie-btnicon>',
        );
      }
      lLibelleColonneNiveau.push(
        '<span style="flex: 1 1 auto;">',
        GTraductions.getValeur("BilanCompetencesParMM.colonnes.Niveau"),
        "</span>",
      );
      lLibelleColonneNiveau.push("</div>");
      lColonnes.push({
        id:
          DonneesListe_BilanCompetencesParMatiere.colonnes
            .prefixe_jauge_service + aService.getNumero(),
        titre: [
          lSuperColonneService,
          { libelleHtml: lTitreColonneJauge.join("") },
        ],
        taille: 300,
        serviceConcerne: aService,
      });
      lColonnes.push({
        id:
          DonneesListe_BilanCompetencesParMatiere.colonnes
            .prefixe_niveau_service + aService.getNumero(),
        titre: [
          { libelle: TypeFusionTitreListe.FusionGauche },
          { libelleHtml: lLibelleColonneNiveau.join("") },
        ],
        taille: 60,
        serviceConcerne: aService,
      });
    });
  }
  return lColonnes;
}
function _evenementListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.SelectionClick: {
      if (
        aParametres.instance
          .getDonneesListe()
          .estUneColonneNiveauDeService(aParametres.idColonne)
      ) {
        _ouvrirMenuContextuelChoixNiveauDAcquisition.call(
          this,
          TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          _modifierNiveauDeColonneService.bind(
            this,
            aParametres.declarationColonne.serviceConcerne,
          ),
          false,
          true,
        );
      } else {
        let lElementLignePourJauge;
        if (
          aParametres.idColonne ===
          DonneesListe_BilanCompetencesParMatiere.colonnes.jauge
        ) {
          lElementLignePourJauge = aParametres.article;
        } else if (
          aParametres.instance
            .getDonneesListe()
            .estUneColonneJaugeDeService(aParametres.idColonne)
        ) {
          lElementLignePourJauge =
            DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
              aParametres.article,
              aParametres.declarationColonne.serviceConcerne.getNumero(),
            );
        }
        if (lElementLignePourJauge) {
          surClicJaugeEvaluations.call(this, lElementLignePourJauge);
        }
      }
      break;
    }
  }
}
function _formatterDonneesListeCompetences(aListeCompetences) {
  if (aListeCompetences) {
    const lDerniersPeres = [];
    aListeCompetences.parcourir((D) => {
      let lNivDepl = D.niveauDeploiement;
      if (lNivDepl > 1) {
        const lPereNiveauPrecedent = lDerniersPeres[lNivDepl - 2];
        if (lPereNiveauPrecedent) {
          D.pere = lPereNiveauPrecedent;
          lPereNiveauPrecedent.estUnDeploiement = true;
          lPereNiveauPrecedent.estDeploye = true;
        }
      }
      lDerniersPeres[lNivDepl - 1] = D;
    });
  }
}
function surClicJaugeEvaluations(aLigne) {
  if (aLigne.relationsESI && aLigne.relationsESI.length) {
    new ObjetRequeteDetailEvaluationsCompetences(
      this,
      _reponseRequeteDetailEvaluations.bind(this, aLigne),
    ).lancerRequete({
      eleve: this.getEleveConcerne(),
      pilier: null,
      periode: this.getPeriodeConcernee(),
      numRelESI: aLigne.relationsESI,
    });
  }
}
function _reponseRequeteDetailEvaluations(aLigne, aJSON) {
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
function _ouvrirMenuContextuelChoixNiveauDAcquisition(
  aTypeGenreValidationCompetence,
  aMethodeModification,
  aAvecRaccourci,
  aAvecDispense,
  aTypePositionnement,
) {
  const lThis = this;
  ObjetMenuContextuel.afficher({
    pere: this,
    initCommandes: function (aInstance) {
      TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
        instance: lThis,
        menuContextuel: aInstance,
        avecLibelleRaccourci: aAvecRaccourci,
        avecDispense: aAvecDispense,
        genreChoixValidationCompetence: aTypeGenreValidationCompetence,
        genrePositionnement: aTypePositionnement,
        callbackNiveau: function (aNiveau) {
          aMethodeModification(aNiveau);
        },
      });
    },
  });
}
function _modifierNiveauDeColonneService(aServiceConcerne, aNiveau) {
  if (!aNiveau) {
    return;
  }
  const lListe = this.getInstance(this.identListeCompetences);
  const lSelections = lListe.getTableauCellulesSelection();
  if (lSelections.length === 0) {
    return;
  }
  let lAvecModif = false;
  lSelections.forEach((aSelection) => {
    const lValeurColonneService =
      DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
        aSelection.article,
        aServiceConcerne.getNumero(),
      );
    if (lValeurColonneService) {
      lValeurColonneService.niveauAcqui = aNiveau;
      lValeurColonneService.setEtat(EGenreEtat.Modification);
      aSelection.article.setEtat(EGenreEtat.Modification);
      lAvecModif = true;
    }
  });
  if (lAvecModif) {
    this.setEtatSaisie(true);
    const lElementScroll = $(".BilanCompetencesParMatiere").parents();
    const lPremierParent = lElementScroll.get(0);
    const lValeurScrollTopActuel = $(lPremierParent).scrollTop();
    lListe.actualiser(true);
    $(lPremierParent).scrollTop(lValeurScrollTopActuel);
  }
}
function _surCalculAutoNiveauService(aNumeroServiceConcerne) {
  const lThis = this;
  let lAvecRemplacementValeurs = false;
  const lListe = this.getInstance(this.identListeCompetences);
  const lListeLigneCompetences = lListe.getListeArticles();
  const lFunctionExecutionCalculAuto = function () {
    let lAvecChangement = false;
    lListeLigneCompetences.parcourir((D) => {
      const lValeurColonneService =
        DonneesListe_BilanCompetencesParMatiere.getElementServiceConcerne(
          D,
          aNumeroServiceConcerne,
        );
      if (
        lValeurColonneService &&
        lValeurColonneService.niveauAcquiEstEditable &&
        lValeurColonneService.niveauAcquiMoyenne
      ) {
        if (
          lAvecRemplacementValeurs ||
          !lValeurColonneService.niveauAcqui ||
          lValeurColonneService.niveauAcqui.getGenre() <
            EGenreNiveauDAcquisition.Expert
        ) {
          lValeurColonneService.niveauAcqui =
            lValeurColonneService.niveauAcquiMoyenne;
          lValeurColonneService.setEtat(EGenreEtat.Modification);
          D.setEtat(EGenreEtat.Modification);
          lAvecChangement = true;
        }
      }
    });
    if (lAvecChangement) {
      lThis.setEtatSaisie(true);
      lListe.actualiser(true);
    }
  };
  const lMessage = [];
  lMessage.push(
    GTraductions.getValeur(
      "BilanCompetencesParMM.CalculAutoColonneService.message",
    ),
  );
  lMessage.push("<br/>", "<br/>");
  lMessage.push(
    '<ie-checkbox ie-model="surCheckbox">',
    GTraductions.getValeur(
      "BilanCompetencesParMM.CalculAutoColonneService.remplacerExistants",
    ),
    "</ie-checkbox>",
  );
  GApplication.getMessage().afficher({
    type: EGenreBoiteMessage.Confirmation,
    titre: GTraductions.getValeur(
      "BilanCompetencesParMM.CalculAutoColonneService.titre",
    ),
    message: lMessage.join(""),
    callback: (aGenreAction) => {
      if (aGenreAction === EGenreAction.Valider) {
        lFunctionExecutionCalculAuto.call(this);
      }
    },
    controleur: {
      surCheckbox: {
        getValue() {
          return lAvecRemplacementValeurs;
        },
        setValue(aValue) {
          lAvecRemplacementValeurs = aValue;
        },
      },
    },
  });
}
function _getParametresPDF() {
  return {
    genreGenerationPDF: TypeHttpGenerationPDFSco.BilanCompetencesParMatiere,
    classe: this.getClasseConcernee(),
    periode: this.getPeriodeConcernee(),
    eleve: this.getEleveConcerne(),
    palier: this.getPalierConcerne(),
    metaMatiere: this.getMetaMatiereConcernee(),
    avecJaugeChronologique:
      !!this.optionsAffichageListe.afficheJaugeChronologique,
    avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
  };
}
module.exports = { InterfaceBilanCompetencesParMatiere };
