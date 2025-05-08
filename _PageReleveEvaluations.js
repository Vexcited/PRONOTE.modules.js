const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const {
  ObjetRequeteAssistantSaisie,
} = require("ObjetRequeteAssistantSaisie.js");
const ObjetRequeteSaisieReleveDEvaluations = require("ObjetRequeteSaisieReleveDEvaluations.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { MethodesTableau } = require("MethodesTableau.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_SaisieMessage } = require("ObjetFenetre_SaisieMessage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const {
  DonneesListe_ReleveDEvaluations,
} = require("DonneesListe_ReleveDEvaluations.js");
const { EGenreNiveauDAcquisition } = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
  ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const {
  EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const {
  ObjetRequeteReleveDEvaluations,
} = require("ObjetRequeteReleveDEvaluations.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypeModeValidationAuto } = require("TypeModeValidationAuto.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
  ObjetFenetre_ParametresReleveDEvaluations,
} = require("ObjetFenetre_ParametresReleveDEvaluations.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const {
  ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
const {
  ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
class _PageReleveEvaluations extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    const lPrefixeIds = "releveDEvaluations_";
    this.typeAffichage = undefined;
    this.constantes = {
      AffichageParService: 0,
      AffichageParClasse: 1,
      TypesTri: {
        ParEvaluation: 0,
        ParDate: 1,
        ParCompetence: 2,
        ParMatiere: 3,
      },
      TypesEvolution: { Aucun: 0, TauxReussite: 1, Score: 2 },
      TypesContexteReleveEvaluations: { Releve: 0, EltsCompNivAcq: 1 },
    };
    this.parametres = {
      affichage: {
        afficheJaugeChronologique: false,
        modeCompact: false,
        modeMultiLigne: true,
        parOrdreChronologique: true,
        ordreColonnes: this.constantes.TypesTri.ParDate,
        avecSynthese: true,
        avecPourcentageAcqui: true,
        avecPositionnementLSUNiveau: true,
        avecPositionnementPrecedents: false,
        avecPositionnementLSUNote: true,
        avecNiveauMaitriseDomaine: true,
        avecAppreciations: true,
        avecSimuCalculPositionnement: false,
        avecRegroupementParDomaine: !GEtatUtilisateur.pourPrimaire(),
        avecEvaluationsCoeffNul: true,
        avecEvaluationsHistoriques: false,
        avecProjetsAccompagnement: false,
        typeEvolution: this.constantes.TypesEvolution.Aucun,
        toleranceEvolution: 0,
        typeContexteReleveEvaluations:
          this.constantes.TypesContexteReleveEvaluations.Releve,
      },
      droits: {
        tailleMaxAppreciationEleve:
          GParametres.getTailleMaxAppreciationParEnumere(
            TypeGenreAppreciation.GA_Bulletin_Professeur,
          ),
        tailleMaxAppreciationClasse:
          GParametres.getTailleMaxAppreciationParEnumere(
            TypeGenreAppreciation.GA_Bulletin_Generale,
          ),
      },
      hauteurs: { piedDePage: 150 },
      id: {
        page: lPrefixeIds + "page",
        piedPage: lPrefixeIds + "pied",
        labelAppreciationClasse: lPrefixeIds + "appreciationClasse",
      },
    };
    this.donnees = {
      nbLignesDEntete: 1,
      avecColonne: {
        appreciation: true,
        posLSUNiveau: false,
        posLSUNote: false,
        nivAcquiPilier: false,
        pourcentageAcqui: true,
        evolution: false,
      },
      avecBoutonPosLSUParNiveau: false,
      avecBoutonPosLSUParNote: false,
      avecBoutonNivAcquiPilier: false,
      listeColonnesLSL: new ObjetListeElements(),
      listeColonnesPosPrecedents: new ObjetListeElements(),
      listeColonnesSimulations: new ObjetListeElements(),
      listeColonnesDEvaluations: new ObjetListeElements(),
      listeColonnesAppreciations: new ObjetListeElements(),
      listeColonnesRESIAffichables: new ObjetListeElements(),
      hintColonnePourcentageAcquis: "",
      appreciationClasse: undefined,
      listeElementsProgramme: undefined,
      elementsProgrammeEditable: false,
      elementsProgrammeCloture: false,
      listeEleves: new ObjetListeElements(),
      listeTypeAppreciations: new ObjetListeElements(),
      dateDebut: null,
      dateFin: null,
      listeTypeContextesDispos: null,
    };
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this._evenementSurDernierMenuDeroulant,
      _initialiserMenuDeroulant,
    );
    this.identListe = this.add(
      ObjetListe,
      _evenementSurListe.bind(this),
      _initialiserListe.bind(this),
    );
    this.identFenetreParametres = this.addFenetre(
      ObjetFenetre_ParametresReleveDEvaluations,
      _evenementFenetreParametres.bind(this),
      _initFenetreParametres,
    );
    this.identFenetreAssistantSaisie = this.add(
      ObjetFenetre_AssistantSaisie,
      this._evenementFenetreAssistantSaisie,
      this._initialiserFenetreAssistantSaisie,
    );
    this.construireFicheEleveEtFichePhoto();
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
    this.AddSurZone = [this.identTripleCombo];
    if (!!this.identDateDebut && !!this.identDateFin) {
      this.AddSurZone.push(
        { html: GTraductions.getValeur("Du") },
        this.identDateDebut,
        { html: GTraductions.getValeur("Au") },
        this.identDateFin,
      );
    }
    if ([this.constantes.AffichageParService].includes(this.typeAffichage)) {
      this.AddSurZone.push({
        html: '<span ie-html = "getInfoCloture"></span>',
      });
    }
    if (GEtatUtilisateur.pourPrimaire()) {
      this.AddSurZone.push({
        html:
          '<ie-bouton ie-model="btnCalculerTousLesPositionnements" ie-display="btnCalculerTousLesPositionnements.estVisible" class="' +
          TypeThemeBouton.primaire +
          ' MargeGauche small-bt">' +
          GTraductions.getValeur(
            "competences.CalculerLesPositionnementsDeMaClasse",
          ) +
          "</ie-bouton>",
      });
    }
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone.push({
      html: '<ie-combo ie-controlesaisie ie-model="comboTypeContexteAffichage" ie-display="comboTypeContexteAffichage.estVisible" class="MargeDroit"></ie-combo>',
    });
    if (this.avecOptionCompacterLignes()) {
      this.AddSurZone.push({
        html: UtilitaireBoutonBandeau.getHtmlBtnCompacterLignes(
          "btnAffichageModeMultiLigne",
        ),
      });
    }
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnCompacterColonnes(
        "btnAffichageModeCompact",
      ),
    });
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnTriOrdreChronologique(
        "btnTriEvaluations",
      ),
    });
    this.addSurZonePhotoEleve();
    if (this.avecAssistantSaisie()) {
      this.AddSurZone.push({
        html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
          "btnAssistantSaisie",
        ),
      });
    }
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnParametrer("btnOptionsAffichage"),
    });
    this.AddSurZone.push({ blocDroit: true });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getInfoCloture: function () {
        return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
      },
      btnCalculerTousLesPositionnements: {
        event() {
          const lParamsCalculAuto = {
            instance: aInstance,
            modeValidationAuto:
              TypeModeValidationAuto.tmva_PosSansNoteSelonEvaluation,
            avecChoixCalcul: true,
            messageRestrictionsSurCalculAuto: null,
            titre: GTraductions.getValeur(
              "competences.fenetreValidationAutoPositionnement.titreTousLesPositionnements",
            ),
            calculMultiServices: true,
          };
          TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
            lParamsCalculAuto,
          );
        },
        estVisible() {
          return !!aInstance.donnees.avecBtnCalculPositionnementClasse;
        },
      },
      comboTypeContexteAffichage: {
        init(aCombo) {
          aCombo.setOptionsObjetSaisie({
            labelWAICellule: GTraductions.getValeur(
              "competences.wai.selectionnezAffichage",
            ),
          });
        },
        getDonnees() {
          return aInstance.donnees.listeTypeContextesDispos;
        },
        getIndiceSelection() {
          let lIndice = 0;
          if (aInstance.donnees.listeTypeContextesDispos) {
            lIndice =
              aInstance.donnees.listeTypeContextesDispos.getIndiceElementParFiltre(
                (D) => {
                  return (
                    D.getGenre() ===
                    aInstance.parametres.affichage.typeContexteReleveEvaluations
                  );
                },
              );
          }
          return Math.max(lIndice, 0);
        },
        event(aParametres) {
          if (aParametres.estSelectionManuelle && aParametres.element) {
            aInstance.parametres.affichage.typeContexteReleveEvaluations =
              aParametres.element.getGenre();
            aInstance.afficherPage();
          }
        },
        estVisible: function () {
          return (
            aInstance.donnees.listeTypeContextesDispos &&
            aInstance.donnees.listeTypeContextesDispos.count() > 1
          );
        },
      },
      btnAffichageModeMultiLigne: {
        event() {
          aInstance.parametres.affichage.modeMultiLigne =
            !aInstance.parametres.affichage.modeMultiLigne;
          _actualiserListe.call(aInstance);
        },
        getTitle() {
          if (aInstance.parametres.affichage.modeMultiLigne) {
            return GTraductions.getValeur(
              "releve_evaluations.parametres.AffichageModeSimpleLigne",
            );
          }
          return GTraductions.getValeur(
            "releve_evaluations.parametres.AffichageModeMultiLigne",
          );
        },
        getSelection() {
          return !aInstance.parametres.affichage.modeMultiLigne;
        },
      },
      btnAffichageModeCompact: {
        event() {
          aInstance.parametres.affichage.modeCompact =
            !aInstance.parametres.affichage.modeCompact;
          _actualiserListe.call(aInstance);
        },
        getTitle() {
          if (aInstance.parametres.affichage.modeCompact) {
            return GTraductions.getValeur(
              "releve_evaluations.parametres.AffichageModeNormal",
            );
          }
          return GTraductions.getValeur(
            "releve_evaluations.parametres.AffichageModeCompact",
          );
        },
        getSelection() {
          return aInstance.parametres.affichage.modeCompact;
        },
      },
      btnTriEvaluations: {
        event() {
          aInstance.parametres.affichage.parOrdreChronologique =
            !aInstance.parametres.affichage.parOrdreChronologique;
          if (aInstance.getEtatSaisie() === true) {
            ControleSaisieEvenement(aInstance.afficherPage);
          } else {
            aInstance.afficherPage();
          }
        },
        getTitle() {
          if (aInstance.parametres.affichage.parOrdreChronologique) {
            return GTraductions.getValeur(
              "releve_evaluations.parametres.ParOrdreChronologiqueInverse",
            );
          }
          return GTraductions.getValeur(
            "releve_evaluations.parametres.ParOrdreChronologique",
          );
        },
        getSelection() {
          return aInstance.parametres.affichage.parOrdreChronologique;
        },
      },
      btnAssistantSaisie: {
        event() {
          aInstance.moteurAssSaisie.evntBtnAssistant({
            instanceListe: aInstance.getInstance(aInstance.identListe),
            instancePied: null,
          });
        },
        getTitle() {
          return aInstance.moteurAssSaisie.getTitleBoutonAssistantSaisie();
        },
        getSelection() {
          return GEtatUtilisateur.assistantSaisieActif;
        },
      },
      btnOptionsAffichage: {
        event() {
          const lFenetreParametres = aInstance.getInstance(
            aInstance.identFenetreParametres,
          );
          lFenetreParametres.setOptionsAffichage({
            avecSynthese: aInstance.parametres.affichage.avecSynthese,
            avecPourcentageAcqui:
              aInstance.parametres.affichage.avecPourcentageAcqui,
            avecPositionnementLSUNiveau:
              aInstance.parametres.affichage.avecPositionnementLSUNiveau,
            avecPositionnementPrecedents:
              aInstance.parametres.affichage.avecPositionnementPrecedents,
            avecPositionnementLSUNote:
              aInstance.parametres.affichage.avecPositionnementLSUNote,
            avecNiveauMaitriseDomaine:
              aInstance.parametres.affichage.avecNiveauMaitriseDomaine,
            avecAppreciations: aInstance.parametres.affichage.avecAppreciations,
            avecSimuCalculPositionnement:
              aInstance.parametres.affichage.avecSimuCalculPositionnement,
            avecRegroupementParDomaine:
              aInstance.parametres.affichage.avecRegroupementParDomaine,
            avecEvaluationsCoeffNul:
              aInstance.parametres.affichage.avecEvaluationsCoeffNul,
            avecEvaluationsHistoriques:
              aInstance.parametres.affichage.avecEvaluationsHistoriques,
            avecProjetsAccompagnement:
              aInstance.parametres.affichage.avecProjetsAccompagnement,
            ordreColonnes: aInstance.parametres.affichage.ordreColonnes,
            typeEvolution: aInstance.parametres.affichage.typeEvolution,
            toleranceEvolution:
              aInstance.parametres.affichage.toleranceEvolution,
          });
          lFenetreParametres.actualiser();
          lFenetreParametres.afficher();
        },
        getTitle() {
          return GTraductions.getValeur(
            "releve_evaluations.parametres.ParametresDAffichage",
          );
        },
        getSelection() {
          return aInstance
            .getInstance(aInstance.identFenetreParametres)
            .estAffiche();
        },
      },
    });
  }
  estPilierLVESelectionne() {
    const lPilierConcerne = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Pilier,
    );
    return !!lPilierConcerne && !!lPilierConcerne.estPilierLVE;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      '<div id="',
      this.parametres.id.page,
      '" class="EspaceDroit EspaceGauche" style="',
      GStyle.composeHeight(100, "%"),
      '">',
    );
    H.push(
      '  <div id="',
      this.getInstance(this.identListe).getNom(),
      '" class="p-top" style="',
      GNavigateur.isLayoutTactile
        ? ""
        : GStyle.composeHeightCalc(this.parametres.hauteurs.piedDePage),
      '"></div>',
    );
    H.push(
      '  <div id="',
      this.parametres.id.piedPage,
      '" style="',
      GStyle.composeHeight(this.parametres.hauteurs.piedDePage),
      ' display: none;">',
      this._composePiedDePage(),
      "</div>",
    );
    H.push("</div>");
    return H.join("");
  }
  _composePiedDePage() {
    return [].join("");
  }
  estPiedDePageVisible() {
    return false;
  }
  actualiserDonneesPiedDePage() {}
  evenementAfficherMessage(aGenreMessage) {
    if (this.parametres.id.piedPage) {
      GHtml.setDisplay(this.parametres.id.piedPage, false);
    }
    this._evenementAfficherMessage(aGenreMessage);
  }
  _getParametresSupplementairesRequetes() {}
  avecOptionCompacterLignes() {
    return false;
  }
  afficherPage() {
    this.setEtatSaisie(false);
    const lParametresRequete = Object.assign(
      {
        typeReleveEvaluations: this.typeAffichage,
        typeContexteReleveEvaluations:
          this.parametres.affichage.typeContexteReleveEvaluations,
        ressource: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Classe,
        ),
        periode: GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Periode,
        ),
        parOrdreChrono: this.parametres.affichage.parOrdreChronologique,
        avecRegroupementParDomaine:
          this.parametres.affichage.avecRegroupementParDomaine,
        avecEvaluationsCoeffNul:
          this.parametres.affichage.avecEvaluationsCoeffNul,
        avecEvaluationsHistoriques:
          this.parametres.affichage.avecEvaluationsHistoriques,
        avecProjetsAccompagnement:
          this.parametres.affichage.avecProjetsAccompagnement,
        ordreColonnes: this.parametres.affichage.ordreColonnes,
        typeEvolution: this.parametres.affichage.typeEvolution,
        toleranceEvolution: this.parametres.affichage.toleranceEvolution,
      },
      this._getParametresSupplementairesRequetes(),
    );
    new ObjetRequeteReleveDEvaluations(
      this,
      _surRecupererDonnees.bind(this),
    ).lancerRequete(lParametresRequete);
  }
  _getListeParametresMenuDeroulant() {}
  _evenementSurDernierMenuDeroulant() {
    this.afficherPage();
  }
  _modifierNotePositionnement(aNote) {
    _appliquerModificationSelectionCourante.call(this, aNote, (aSelection) => {
      if (
        aSelection.idColonne ===
        DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note
      ) {
        aSelection.article.posLSUNote = aNote;
        return true;
      }
    });
  }
  _modifierNiveauPositionnement(aNiveau) {
    _appliquerModificationSelectionCourante.call(
      this,
      aNiveau,
      (aSelection) => {
        if (
          aSelection.idColonne ===
          DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau
        ) {
          aSelection.article.posLSUNiveau = aNiveau;
          aSelection.article.posLSUNiveau.setEtat(EGenreEtat.Modification);
          return true;
        }
      },
    );
  }
  _modifierNiveauAcquiDomaine(aNiveau) {
    _appliquerModificationSelectionCourante.call(
      this,
      aNiveau,
      (aSelection) => {
        let lObservation;
        if (!!aSelection.article.nivAcquiPilier) {
          lObservation = aSelection.article.nivAcquiPilier.observation;
        }
        aSelection.article.nivAcquiPilier = MethodesObjet.dupliquer(aNiveau);
        if (!!lObservation) {
          aSelection.article.nivAcquiPilier.observation = lObservation;
        }
        aSelection.article.nivAcquiPilier.setEtat(EGenreEtat.Modification);
        return true;
      },
    );
  }
  _getBoutonsListe() {}
  _ajouteCommandesSupplementairesMenuContextuel() {}
  avecAssistantSaisie() {
    return false;
  }
  requeteDonneesAssistantSaisie(aCallback) {
    new ObjetRequeteAssistantSaisie(
      this,
      this.actionSurRequeteDonneesAssistantSaisie.bind(this, aCallback),
    ).lancerRequete();
  }
  actionSurRequeteDonneesAssistantSaisie(aCallback, aListeTypesAppreciations) {
    this.donnees.listeTypeAppreciations =
      aListeTypesAppreciations || new ObjetListeElements();
    aCallback();
  }
  ouvrirFenetreAssistantSaisie(aSelectionMultiple, aRangAppreciation) {
    const lInstanceFenetre = this.getInstance(this.identFenetreAssistantSaisie);
    lInstanceFenetre.setParametres({
      avecCheckBoxNePasUtiliserAssistant: GEtatUtilisateur.assistantSaisieActif,
      avecBoutonPasserEnSaisie: !aSelectionMultiple,
      rangAppreciations: aRangAppreciation,
    });
    const lListeAppreciationsParRang =
      this.donnees.listeTypeAppreciations.getListeElements((D) => {
        return D.getGenre() === aRangAppreciation - 1;
      });
    lInstanceFenetre.setDonnees(lListeAppreciationsParRang);
  }
  _initialiserFenetreAssistantSaisie(aInstance) {
    aInstance.setParametres({
      tailleMaxAppreciation: this.parametres.droits.tailleMaxAppreciationEleve,
    });
    aInstance.setOptionsFenetre({ largeur: 700, hauteur: 300 });
  }
  _evenementFenetreAssistantSaisie(aNumeroBouton) {
    const lParam = {
      instanceFenetreAssistantSaisie: this.getInstance(
        this.identFenetreAssistantSaisie,
      ),
      eventChangementUtiliserAssSaisie: function () {
        this.getInstance(this.identListe).actualiser(true);
      }.bind(this),
      evntClbck: _surEvntAssSaisie.bind(this),
    };
    this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
  }
  valider() {
    const lDonneesSaisies = Object.assign(
      {
        listeEleves: this.donnees.listeEleves,
        listeTypeAppreciations: this.donnees.listeTypeAppreciations,
      },
      this._getParametresSupplementairesRequetes(true),
    );
    if (!!this.donnees.appreciationClasse) {
      lDonneesSaisies.appreciationClasse = this.donnees.appreciationClasse;
    }
    new ObjetRequeteSaisieReleveDEvaluations(
      this,
      this.actionSurValidation,
    ).lancerRequete(lDonneesSaisies);
  }
}
function _surEvntAssSaisie(aParam) {
  let lClbck;
  switch (aParam.cmd) {
    case EBoutonFenetreAssistantSaisie.Valider:
      lClbck = function () {
        _surValidationAssistantSaisie.call(
          this,
          aParam.eltSelectionne,
          aParam.rangAppr,
        );
      }.bind(this);
      break;
    case EBoutonFenetreAssistantSaisie.PasserEnSaisie: {
      lClbck = function () {
        this.moteurAssSaisie.passerEnSaisie({
          instanceListe: this.getInstance(this.identListe),
          idColonne:
            DonneesListe_ReleveDEvaluations.colonnes.prefixe_appreciations +
            aParam.rangAppr,
        });
      }.bind(this);
      break;
    }
    case EBoutonFenetreAssistantSaisie.Fermer:
      break;
  }
  this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
    estAssistantModifie: false,
    pere: this,
    clbck: lClbck,
  });
}
function _surRecupererDonnees(aParams) {
  this.strInfoCloture = aParams.strInfoCloture || "";
  this.donnees.listeTypeContextesDispos = aParams.listeTypeContextesDispos;
  this.donnees.nbLignesDEntete = aParams.nbLignesDEntete;
  this.donnees.avecColonne.pourcentageAcqui = aParams.avecColonnePercentAcqui;
  this.donnees.avecColonne.posLSUNiveau = aParams.avecColonnePosLSUNiveau;
  this.donnees.avecColonne.posLSUNote = aParams.avecColonnePosLSUNote;
  this.donnees.avecColonne.nivAcquiPilier = aParams.avecColonneNivAcquiPilier;
  this.donnees.avecColonne.evolution = aParams.avecColonneEvolution;
  this.donnees.avecBtnCalculPositionnementClasse =
    aParams.avecBtnCalculPositionnementClasse;
  this.donnees.avecBoutonPosLSUParNiveau = aParams.avecBoutonPosLSUNiveau;
  this.donnees.avecBoutonPosLSUParNote = aParams.avecBoutonPosLSUNote;
  this.donnees.avecBoutonNivAcquiPilier = aParams.avecBoutonNivAcquiPilier;
  this.donnees.listeColonnesLSL = aParams.listeColonnesLSL;
  this.donnees.listeColonnesPosPrecedents = aParams.listeColonnesPosPrecedents;
  this.donnees.listeColonnesSimulations = aParams.listeColonnesSimulations;
  this.donnees.listeColonnesDEvaluations = aParams.listeColonnesEvaluations;
  this.donnees.listeColonnesAppreciations = aParams.listeColonnesAppreciations;
  this.donnees.listeColonnesRESIAffichables =
    aParams.listeColonnesRESIAffichables;
  this.donnees.hintColonnePourcentageAcquis =
    aParams.hintColonnePourcentageAcquis;
  if (!!aParams.piedPage) {
    this.donnees.appreciationClasse = aParams.piedPage.appreciationClasse;
    this.donnees.listeElementsProgramme =
      aParams.piedPage.listeElementsProgramme;
    this.donnees.elementsProgrammeEditable =
      aParams.piedPage.elementsProgrammeEditable;
    this.donnees.elementsProgrammeCloture =
      aParams.piedPage.elementsProgrammeCloture;
  }
  this.donnees.listeEleves = aParams.listeEleves;
  if (!!aParams.constantes) {
    if (!!aParams.constantes.TypeTri) {
      this.constantes.TypesTri.ParEvaluation =
        aParams.constantes.TypeTri.parEvaluation;
      this.constantes.TypesTri.ParDate = aParams.constantes.TypeTri.parDate;
      this.constantes.TypesTri.ParCompetence =
        aParams.constantes.TypeTri.parCompetence;
      this.constantes.TypesTri.ParMatiere =
        aParams.constantes.TypeTri.parMatiere;
    }
    if (!!aParams.constantes.TypeEvolution) {
      this.constantes.TypesEvolution.Aucun =
        aParams.constantes.TypeEvolution.aucun;
      this.constantes.TypesEvolution.TauxReussite =
        aParams.constantes.TypeEvolution.tauxReussite;
      this.constantes.TypesEvolution.Score =
        aParams.constantes.TypeEvolution.score;
    }
    if (!!aParams.constantes.TypeContexteReleveEvaluations) {
      this.constantes.TypesContexteReleveEvaluations.Releve =
        aParams.constantes.TypeContexteReleveEvaluations.releve;
      this.constantes.TypesContexteReleveEvaluations.EltsCompNivAcq =
        aParams.constantes.TypeContexteReleveEvaluations.eltsCompNivAcq;
    }
  }
  if (
    this.parametres.affichage.ordreColonnes !==
      this.constantes.TypesTri.ParEvaluation &&
    this.parametres.affichage.ordreColonnes !==
      this.constantes.TypesTri.ParCompetence &&
    this.parametres.affichage.ordreColonnes !==
      this.constantes.TypesTri.ParMatiere
  ) {
    this.parametres.affichage.ordreColonnes = this.constantes.TypesTri.ParDate;
  }
  _structurerDonnees(
    this.donnees.listeEleves,
    this.donnees.listeColonnesDEvaluations,
  );
  GHtml.setDisplay(this.parametres.id.piedPage, this.estPiedDePageVisible());
  if (this.estPiedDePageVisible()) {
    this.actualiserDonneesPiedDePage();
  }
  if (this.avecAssistantSaisie()) {
    this.requeteDonneesAssistantSaisie(_actualiserListe.bind(this));
  } else {
    _actualiserListe.call(this);
  }
}
function _structurerDonnees(aListeEleves, aListeColonnesEvaluations) {
  const lListeCompetenceEvaluation = [];
  const lCacheColonnesJumelles = {};
  let lKey;
  if (aListeColonnesEvaluations) {
    aListeColonnesEvaluations.parcourir((D, aIndex) => {
      lListeCompetenceEvaluation.push({
        numeroRESI: D.getNumero(),
        posChronologique: D.posChronologique,
      });
      lKey = D.getNumero();
      if (!lCacheColonnesJumelles[lKey]) {
        lCacheColonnesJumelles[lKey] = [];
      }
      lCacheColonnesJumelles[lKey].push(aIndex);
    });
    lListeCompetenceEvaluation.forEach((D, aIndex) => {
      const lKey = D.numeroRESI;
      const lArrayFromCache = lCacheColonnesJumelles[lKey].slice(0);
      if (lArrayFromCache.length > 1) {
        MethodesTableau.remove(lArrayFromCache, aIndex);
        D.colonnesJumelles = lArrayFromCache;
      }
    });
  }
  if (aListeEleves) {
    aListeEleves.parcourir((aEleve) => {
      if (aEleve.listeNiveauxDAcquisitions) {
        aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau, aIndex) => {
          aNiveau.posChronologique =
            lListeCompetenceEvaluation[aIndex].posChronologique;
          aNiveau.numeroRESI = lListeCompetenceEvaluation[aIndex].numeroRESI;
          aNiveau.colonnesJumelles =
            lListeCompetenceEvaluation[aIndex].colonnesJumelles;
        });
        _composeListeNiveauxSynthese(aEleve);
      }
      if (aEleve.listeValeursColonnesLSL) {
        aEleve.listeValeursColonnesLSL.parcourir((aValeurColonneLSL) => {
          if (aValeurColonneLSL.listeNiveauxDAcquisitions) {
            aValeurColonneLSL.listeNiveauxDAcquisitions =
              TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
                aValeurColonneLSL.listeNiveauxDAcquisitions,
              );
            aValeurColonneLSL.hintNiveauxDAcquisitions =
              TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
                aValeurColonneLSL.listeNiveauxDAcquisitions,
              );
          }
        });
      }
    });
  }
}
function _composeListeNiveauxSynthese(aEleve) {
  aEleve.listeNiveauxSyntheseChrono = new ObjetListeElements();
  aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
    if (aNiveau.getGenre() >= EGenreNiveauDAcquisition.Expert) {
      aEleve.listeNiveauxSyntheseChrono.addElement(
        MethodesObjet.dupliquer(aNiveau),
      );
    }
  });
  aEleve.listeNiveauxSyntheseParNiveau =
    TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
      aEleve.listeNiveauxDAcquisitions,
    );
  let lColonnesJumellesTraitees = [];
  aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau, aIndex) => {
    if (!!aNiveau.colonnesJumelles && aNiveau.colonnesJumelles.length > 0) {
      if (lColonnesJumellesTraitees.includes(aIndex)) {
        if (aNiveau.getGenre() >= EGenreNiveauDAcquisition.Expert) {
          const lIndex =
            aEleve.listeNiveauxSyntheseChrono.getIndiceElementParFiltre((D) => {
              return (
                D.getNumero() === aNiveau.getNumero() &&
                D.posChronologique === aNiveau.posChronologique
              );
            });
          if (
            lIndex > -1 &&
            lIndex < aEleve.listeNiveauxSyntheseChrono.count()
          ) {
            aEleve.listeNiveauxSyntheseChrono.remove(lIndex);
          }
        }
      }
      if (!lColonnesJumellesTraitees.includes(aIndex)) {
        if (aNiveau.getGenre() >= EGenreNiveauDAcquisition.Expert) {
          const lSynthese =
            aEleve.listeNiveauxSyntheseParNiveau.getElementParGenre(
              aNiveau.getGenre(),
            );
          if (lSynthese) {
            const lValeurNiveau =
              aNiveau.coeff !== undefined && aNiveau.coeff !== null
                ? aNiveau.coeff
                : 1;
            lSynthese.nbr -= aNiveau.colonnesJumelles.length * lValeurNiveau;
          }
        }
      }
      if (!lColonnesJumellesTraitees.includes(aIndex)) {
        lColonnesJumellesTraitees.push(aIndex);
        aNiveau.colonnesJumelles.forEach((aIndexJumelle) => {
          lColonnesJumellesTraitees.push(aIndexJumelle);
        });
      }
    }
  });
  aEleve.listeNiveauxSyntheseChrono.setTri([ObjetTri.init("posChronologique")]);
  aEleve.listeNiveauxSyntheseChrono.trier();
  aEleve.hintSyntheseChrono =
    TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
      aEleve.listeNiveauxSyntheseChrono,
    );
  aEleve.hintSyntheseParNiveau =
    TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
      aEleve.listeNiveauxSyntheseParNiveau,
    );
  aEleve.moyenneSynthese =
    TUtilitaireCompetences.getMoyenneBarreNiveauDAcquisition(
      aEleve.listeNiveauxSyntheseParNiveau,
    );
  let lNbNiveauxAcquis = 0,
    lNbEvaluationsNotees = 0;
  lColonnesJumellesTraitees = [];
  aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau, aIndex) => {
    let lTraitementNiveau = true;
    if (
      !!aNiveau.colonnesJumelles &&
      aNiveau.colonnesJumelles.length > 0 &&
      lColonnesJumellesTraitees.includes(aIndex)
    ) {
      lTraitementNiveau = false;
    }
    if (lTraitementNiveau) {
      if (TUtilitaireCompetences.estNotantPourTxReussiteEvaluation(aNiveau)) {
        let lValeurNiveau = 1;
        if (aNiveau.coeff === 0) {
          lValeurNiveau = 0;
        }
        lNbEvaluationsNotees += lValeurNiveau;
        if (TUtilitaireCompetences.estNiveauAcqui(aNiveau)) {
          lNbNiveauxAcquis += lValeurNiveau;
        }
      }
      if (!!aNiveau.colonnesJumelles) {
        lColonnesJumellesTraitees.push(aIndex);
        aNiveau.colonnesJumelles.forEach((aIndexJumelle) => {
          lColonnesJumellesTraitees.push(aIndexJumelle);
        });
      }
    }
  });
  let lPercentAcquisition = null;
  if (!!aEleve.estEvaluable) {
    lPercentAcquisition = "0";
    if (lNbNiveauxAcquis > 0) {
      lPercentAcquisition = (
        Math.round(((lNbNiveauxAcquis * 100) / lNbEvaluationsNotees) * 10) / 10
      )
        .toString()
        .replace(".", ",");
    }
  }
  aEleve.percentAcqui = lPercentAcquisition;
}
function _initialiserMenuDeroulant(aInstance) {
  aInstance.setParametres(this._getListeParametresMenuDeroulant());
}
function _completeSelectionsAvecColonnesJumelles(aSelections) {
  const result = [];
  if (!!aSelections && aSelections.length > 0) {
    aSelections.forEach((aSelection) => {
      const lIndex =
        DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
          aSelection.idColonne,
        );
      if (lIndex > -1) {
        if (!result.includes(aSelection)) {
          result.push(aSelection);
        }
        const lNiveauDAcquisition =
          aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
        if (
          !!lNiveauDAcquisition.colonnesJumelles &&
          lNiveauDAcquisition.colonnesJumelles.length > 0
        ) {
          lNiveauDAcquisition.colonnesJumelles.forEach(
            (aIndexColonneJumelle) => {
              result.push({
                article: aSelection.article,
                idColonne:
                  DonneesListe_ReleveDEvaluations.colonnes.prefixe_evaluation +
                  aIndexColonneJumelle,
                ligne: lNiveauDAcquisition.ligne,
              });
            },
          );
        }
      }
    });
  }
  return result;
}
function _editionSelectionsCellulesListe(aSelections, aMethodeEdition) {
  if (!aSelections || aSelections.length === 0) {
    return;
  }
  let lAvecModif = false;
  aSelections.forEach((aSelection) => {
    if (aMethodeEdition.call(this, aSelection)) {
      _composeListeNiveauxSynthese(aSelection.article);
      aSelection.article.setEtat(EGenreEtat.Modification);
      lAvecModif = true;
    }
  });
  if (lAvecModif) {
    this.setEtatSaisie(true);
    this.getInstance(this.identListe).actualiser(true);
  }
  return lAvecModif;
}
function _editionCommentaireAcquisitions(aSelections) {
  let lCommentaireCommun = null;
  let lEstPublieeCommun = null;
  let lCommentaireEstIdentique = true;
  let lPublicationEstIdentique = true;
  aSelections.every((aSelection) => {
    const lIndex = DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
      aSelection.idColonne,
    );
    const lNiveauDAcquisition =
      aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
    if (lNiveauDAcquisition) {
      if (lCommentaireCommun === null) {
        lCommentaireCommun = lNiveauDAcquisition.observation || "";
      } else if (
        lCommentaireEstIdentique &&
        lCommentaireCommun !== lNiveauDAcquisition.observation
      ) {
        lCommentaireCommun = null;
        lCommentaireEstIdentique = false;
      }
      if (lEstPublieeCommun === null) {
        lEstPublieeCommun = !!lNiveauDAcquisition.observationPubliee;
      } else if (
        lPublicationEstIdentique &&
        lEstPublieeCommun !== lNiveauDAcquisition.observationPubliee
      ) {
        lEstPublieeCommun = null;
        lPublicationEstIdentique = false;
      }
      if (!lCommentaireEstIdentique && !lPublicationEstIdentique) {
        return false;
      }
    }
    return true;
  });
  const lFenetreEditionObservation = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_SaisieMessage,
    {
      pere: this,
      evenement: function (aNumeroBouton, aDonnees) {
        if (aNumeroBouton === 1) {
          const lObservationSaisie = aDonnees.message;
          const lEstPublieeSaisie = aDonnees.estPublie;
          if (
            lObservationSaisie !== undefined ||
            lEstPublieeSaisie !== undefined
          ) {
            const lSelectionsAvecColonnesJumelles =
              _completeSelectionsAvecColonnesJumelles(aSelections);
            _editionSelectionsCellulesListe.call(
              this,
              lSelectionsAvecColonnesJumelles,
              (aSelection) => {
                const lIndex =
                  DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
                    aSelection.idColonne,
                  );
                const lNiveauDAcquisition =
                  aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
                if (!!lNiveauDAcquisition) {
                  let lCompetenceModifiee = false;
                  if (
                    lObservationSaisie !== undefined &&
                    lNiveauDAcquisition.observation !== lObservationSaisie
                  ) {
                    lNiveauDAcquisition.observation = lObservationSaisie;
                    lCompetenceModifiee = true;
                  }
                  if (
                    lEstPublieeSaisie !== undefined &&
                    lNiveauDAcquisition.observationPubliee !== lEstPublieeSaisie
                  ) {
                    lNiveauDAcquisition.observationPubliee = lEstPublieeSaisie;
                    lCompetenceModifiee = true;
                  }
                  if (!!lCompetenceModifiee) {
                    lNiveauDAcquisition.setEtat(EGenreEtat.Modification);
                    return true;
                  }
                }
              },
            );
          }
        }
      },
      initialiser: function (aInstance) {
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur("competences.AjouterCommentaire"),
        });
        aInstance.setParametresFenetreSaisieMessage({
          maxLengthSaisie: 1000,
          avecControlePublication: true,
        });
      },
    },
  );
  lFenetreEditionObservation.setDonnees(lCommentaireCommun, lEstPublieeCommun);
}
function _appliquerModificationSelectionCourante(
  aValeurPositionnement,
  aMethodeModification,
) {
  if (!aValeurPositionnement) {
    return;
  }
  const lListe = this.getInstance(this.identListe),
    lSelections = lListe.getTableauCellulesSelection();
  if (lSelections.length === 0) {
    return;
  }
  let lModif = false;
  lSelections.forEach((aSelection) => {
    if (aMethodeModification(aSelection)) {
      aSelection.article.setEtat(EGenreEtat.Modification);
      lModif = true;
    }
  });
  if (lModif) {
    this.setEtatSaisie(true);
    this.getInstance(this.identListe).actualiser(true);
  }
}
function _modifierNiveauDeSelectionCourante(aNiveau) {
  if (!aNiveau) {
    return;
  }
  const lListe = this.getInstance(this.identListe),
    lSelections = _completeSelectionsAvecColonnesJumelles(
      lListe.getTableauCellulesSelection(),
    );
  if (lSelections.length === 0) {
    return;
  }
  const lSaisieEffective = _editionSelectionsCellulesListe.call(
    this,
    lSelections,
    (aSelection) => {
      const lIndex =
        DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
          aSelection.idColonne,
        );
      if (lIndex > -1) {
        const lNiveauDAcquisitionActuel =
          aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
        if (lNiveauDAcquisitionActuel) {
          const lNiveau = MethodesObjet.dupliquer(aNiveau);
          lNiveau.posChronologique = lNiveauDAcquisitionActuel.posChronologique;
          lNiveau.numeroRESI = lNiveauDAcquisitionActuel.numeroRESI;
          lNiveau.estEditable = lNiveauDAcquisitionActuel.estEditable;
          lNiveau.coeff = lNiveauDAcquisitionActuel.coeff;
          lNiveau.colonnesJumelles = lNiveauDAcquisitionActuel.colonnesJumelles;
          lNiveau.setEtat(EGenreEtat.Modification);
          aSelection.article.listeNiveauxDAcquisitions.remove(lIndex);
          aSelection.article.listeNiveauxDAcquisitions.insererElement(
            lNiveau,
            lIndex,
          );
          aSelection.article.simulations = null;
        }
        return true;
      }
      return false;
    },
  );
  if (lSaisieEffective) {
    if (lSelections.length === 1) {
      lListe.selectionnerCelluleSuivante({ orientationVerticale: true });
    }
  }
}
function _modifierNiveauDeColonneLSL(aNiveau) {
  if (!aNiveau) {
    return;
  }
  const lListe = this.getInstance(this.identListe);
  const lSelections = lListe.getTableauCellulesSelection();
  if (lSelections.length === 0) {
    return;
  }
  let lAvecModif = false;
  lSelections.forEach((aSelection) => {
    const lValeurColonneLSL =
      DonneesListe_ReleveDEvaluations.getValeurColonneLSL(
        aSelection.idColonne,
        aSelection.article,
      );
    if (lValeurColonneLSL) {
      lValeurColonneLSL.niveau = aNiveau;
      lValeurColonneLSL.niveau.estEditable = true;
      lValeurColonneLSL.setEtat(EGenreEtat.Modification);
      aSelection.article.setEtat(EGenreEtat.Modification);
      lAvecModif = true;
    }
  });
  if (lAvecModif) {
    this.setEtatSaisie(true);
    this.getInstance(this.identListe).actualiser(true);
  }
}
function _surKeyUpListe(aEvent) {
  const lNiveaux =
    GParametres.listeNiveauxDAcquisitions &&
    GParametres.listeNiveauxDAcquisitions.getListeElements((D) => {
      return D.actifPour.contains(
        TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
      );
    });
  const lNiveau = TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
    aEvent,
    lNiveaux,
  );
  if (lNiveau) {
    _modifierNiveauDeSelectionCourante.call(this, lNiveau);
  }
}
function _initialiserListe(aInstance) {
  aInstance.setOptionsListe({
    hauteurAdapteContenu: true,
    alternanceCouleurLigneContenu: true,
    boutons: this._getBoutonsListe(),
  });
}
function _evenementSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection: {
      let lEleve = null;
      const lSelections = aParametres.instance.getTableauCellulesSelection();
      lSelections.every((aSelection) => {
        if (lEleve === null) {
          lEleve = aSelection.article;
        } else if (lEleve.getNumero() !== aSelection.article.getNumero()) {
          lEleve = null;
          return false;
        }
        return true;
      });
      const lEleveEtatUtilisateur = GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Eleve,
      );
      if (
        (lEleve === null &&
          !!lEleveEtatUtilisateur &&
          lEleveEtatUtilisateur.existeNumero()) ||
        (!!lEleve &&
          lEleve.existeNumero() &&
          (!lEleveEtatUtilisateur || !lEleveEtatUtilisateur.existeNumero())) ||
        (!!lEleve &&
          !!lEleveEtatUtilisateur &&
          lEleve.getNumero() !== lEleveEtatUtilisateur.getNumero())
      ) {
        GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Eleve, lEleve);
        this.surSelectionEleve();
      }
      break;
    }
    case EGenreEvenementListe.Edition:
      if (
        DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
          aParametres.idColonne,
        )
      ) {
        const lRangAppreciation =
          DonneesListe_ReleveDEvaluations.getRangAppreciation(
            aParametres.idColonne,
          );
        this.ouvrirFenetreAssistantSaisie(false, lRangAppreciation);
      } else if (
        DonneesListe_ReleveDEvaluations.estUneColonneLSLNiveau(
          aParametres.idColonne,
        )
      ) {
        _ouvrirMenuContextuelChoixNiveauDAcquisition.call(
          this,
          TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          _modifierNiveauDeColonneLSL,
          false,
          true,
        );
      } else if (
        aParametres.idColonne ===
        DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau
      ) {
        _ouvrirMenuContextuelChoixNiveauDAcquisition.call(
          this,
          TypeGenreValidationCompetence.tGVC_Competence,
          this._modifierNiveauPositionnement,
          false,
          true,
          aParametres.article.genrePositionnementSansNote,
        );
      } else if (
        aParametres.idColonne ===
        DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine
      ) {
        _ouvrirMenuContextuelChoixNiveauDAcquisition.call(
          this,
          TypeGenreValidationCompetence.tGVC_Competence,
          this._modifierNiveauAcquiDomaine,
          false,
          this.estPilierLVESelectionne(),
        );
      } else {
        _ouvrirMenuContextuelChoixNiveauDAcquisition.call(
          this,
          TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          _modifierNiveauDeSelectionCourante,
          true,
          true,
        );
      }
      break;
    case EGenreEvenementListe.KeyUpListe:
      return _surKeyUpListe.call(this, aParametres.event);
  }
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
          aMethodeModification.call(lThis, aNiveau);
        },
      });
    },
  });
}
function _initMenuContextuelListe(aParametres) {
  const lSelections = this.getInstance(
    this.identListe,
  ).getTableauCellulesSelection();
  if (!lSelections || lSelections.length === 0) {
    return;
  }
  let lEvaluationEditable = false;
  let lObservationEditable = false;
  let lColonneLSLEditable = false;
  lSelections.forEach((aSelection) => {
    if (
      DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
        aSelection.idColonne,
      )
    ) {
      const lIndex =
        DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
          aSelection.idColonne,
        );
      const lNiveauDAcquisitionActuel =
        aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
      if (
        lNiveauDAcquisitionActuel &&
        lNiveauDAcquisitionActuel.estEditable === true
      ) {
        lEvaluationEditable = true;
        if (lNiveauDAcquisitionActuel.getNumero()) {
          lObservationEditable = true;
        }
      }
    } else if (
      DonneesListe_ReleveDEvaluations.estUneColonneLSLNiveau(
        aSelection.idColonne,
      )
    ) {
      lColonneLSLEditable = true;
      lObservationEditable = false;
    }
  });
  this._ajouteCommandesSupplementairesMenuContextuel(
    lSelections,
    aParametres.menuContextuel,
  );
  aParametres.menuContextuel.avecSeparateurSurSuivant();
  TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
    instance: this,
    menuContextuel: aParametres.menuContextuel,
    avecLibelleRaccourci: true,
    avecSousMenu: true,
    genreChoixValidationCompetence:
      TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
    evaluationsEditables: lEvaluationEditable || lColonneLSLEditable,
    estObservationEditable: lObservationEditable,
    callbackNiveau: lColonneLSLEditable
      ? _modifierNiveauDeColonneLSL.bind(this)
      : _modifierNiveauDeSelectionCourante.bind(this),
    callbackCommentaire: _editionCommentaireAcquisitions.bind(
      this,
      lSelections,
    ),
  });
}
function _getParametresValidationAutoPositionnement(aModeValidation) {
  let lMessageRestrictions;
  if (!!this.donnees.listeColonnesRESIAffichables) {
    const lNbCptTotal = this.donnees.listeColonnesRESIAffichables.count();
    let lNbCptMasquees = 0;
    this.donnees.listeColonnesRESIAffichables.parcourir((D) => {
      if (!D.estAffiche) {
        lNbCptMasquees++;
      }
    });
    if (lNbCptMasquees > 0) {
      const lNbCptComptabilisees = lNbCptTotal - lNbCptMasquees;
      if (lNbCptComptabilisees === 1) {
        lMessageRestrictions = GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.restrictions.uneCompetencePriseEnCompte",
          [lNbCptTotal],
        );
      } else {
        lMessageRestrictions = GTraductions.getValeur(
          "competences.fenetreValidationAutoPositionnement.restrictions.XCompetencesPrisesEnCompte",
          [lNbCptComptabilisees, lNbCptTotal],
        );
      }
    }
  }
  const result = {
    instance: this,
    modeValidationAuto: aModeValidation,
    avecChoixCalcul: true,
    messageRestrictionsSurCalculAuto: lMessageRestrictions,
  };
  if (!!this.identDateDebut) {
    const lBornesDatePeriode = this.getInstance(
      this.identDateDebut,
    ).getBorneDates();
    if (
      !lBornesDatePeriode ||
      !GDate.estJourEgal(
        lBornesDatePeriode.dateDebut,
        this.donnees.dateDebut,
      ) ||
      !GDate.estJourEgal(lBornesDatePeriode.dateFin, this.donnees.dateFin)
    ) {
      result.borneDateDebut = this.donnees.dateDebut;
      result.borneDateFin = this.donnees.dateFin;
    }
  }
  return result;
}
function _actualiserListe() {
  const lThis = this;
  const lListeInstance = this.getInstance(this.identListe);
  const lEstAvecColonnesLSL =
    this.donnees.listeColonnesLSL && this.donnees.listeColonnesLSL.count() > 0;
  let firstIdColonneScrollable = DonneesListe_ReleveDEvaluations.colonnes.eleve;
  let lastIdColonneScrollable = null;
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_ReleveDEvaluations.colonnes.eleve,
    taille: 180,
    titre:
      (!!this.donnees.listeEleves
        ? this.donnees.listeEleves.count() + " "
        : "") + GTraductions.getValeur("Eleves"),
  });
  if (this.parametres.affichage.avecSynthese && !lEstAvecColonnesLSL) {
    lListeInstance.controleur.btnBasculeJauge = {
      event: function () {
        lThis.parametres.affichage.afficheJaugeChronologique =
          !lThis.parametres.affichage.afficheJaugeChronologique;
        _actualiserListe.call(lThis);
        return false;
      },
      getTitle: function () {
        return lThis.parametres.affichage.afficheJaugeChronologique
          ? GTraductions.getValeur(
              "releve_evaluations.colonne.hint.btnAfficheJaugeParNiveau",
            )
          : GTraductions.getValeur(
              "releve_evaluations.colonne.hint.btnAfficheJaugeChronologique",
            );
      },
      getSelection: function () {
        return lThis.parametres.affichage.afficheJaugeChronologique;
      },
    };
    const lTitreColonneSynthese = [];
    lTitreColonneSynthese.push(
      `<div class="flex-contain flex-center justify-center">`,
    );
    lTitreColonneSynthese.push(
      `<ie-btnimage ie-model="btnBasculeJauge" class="Image_BasculeJauge TitreListeSansTri" style="width: 18px;"></ie-btnimage>`,
    );
    lTitreColonneSynthese.push(
      `<span>${GTraductions.getValeur("releve_evaluations.colonne.titre.synthese")}</span>`,
    );
    lTitreColonneSynthese.push(`</div>`);
    lColonnes.push({
      id: DonneesListe_ReleveDEvaluations.colonnes.synthese,
      taille: 280,
      titre: {
        libelle: GTraductions.getValeur(
          "releve_evaluations.colonne.titre.synthese",
        ),
        libelleHtml: lTitreColonneSynthese.join(""),
      },
    });
  }
  if (
    this.donnees.avecColonne.evolution &&
    this.parametres.affichage.typeEvolution !==
      this.constantes.TypesEvolution.Aucun &&
    !lEstAvecColonnesLSL
  ) {
    lColonnes.push({
      id: DonneesListe_ReleveDEvaluations.colonnes.evolution,
      taille: 50,
      titre: {
        libelle: GTraductions.getValeur(
          "releve_evaluations.colonne.titre.evolution",
        ),
        titleHtml: GTraductions.getValeur(
          "releve_evaluations.colonne.hint.evolution",
        ),
      },
    });
  }
  if (
    this.donnees.avecColonne.pourcentageAcqui &&
    this.parametres.affichage.avecPourcentageAcqui &&
    !lEstAvecColonnesLSL
  ) {
    lColonnes.push({
      id: DonneesListe_ReleveDEvaluations.colonnes.percent_acquisition,
      taille: 50,
      titre: {
        libelle: GTraductions.getValeur(
          "releve_evaluations.colonne.titre.pourcentage_acqui",
        ),
        titleHtml: this.donnees.hintColonnePourcentageAcquis || "",
      },
    });
  }
  if (
    !!this.donnees.listeColonnesPosPrecedents &&
    this.parametres.affichage.avecPositionnementPrecedents &&
    !lEstAvecColonnesLSL
  ) {
    this.donnees.listeColonnesPosPrecedents.parcourir((D, aIndex) => {
      lColonnes.push({
        id:
          DonneesListe_ReleveDEvaluations.colonnes.prefixe_posPrecedent +
          aIndex,
        taille: 50,
        titre: [
          {
            libelleCSV: GTraductions.getValeur(
              "releve_evaluations.colonne.titre.pos_lsu_precedents",
            ),
            libelle:
              aIndex === 0
                ? GTraductions.getValeur(
                    "releve_evaluations.colonne.titre.pos_lsu_precedents",
                  )
                : TypeFusionTitreListe.FusionGauche,
          },
          {
            libelleCSV: D.getLibelle(),
            libelleHtml: D.getLibelle(),
            titleHtml: D.hint,
          },
        ],
      });
    });
  }
  const lAvecAuMoinsUneColonnePositionnementPossible =
    (!!this.donnees.avecColonne.posLSUNiveau ||
      !!this.donnees.avecColonne.posLSUNote ||
      !!this.donnees.avecColonne.nivAcquiPilier) &&
    !lEstAvecColonnesLSL;
  if (
    !!this.donnees.listeColonnesSimulations &&
    this.parametres.affichage.avecSimuCalculPositionnement &&
    lAvecAuMoinsUneColonnePositionnementPossible
  ) {
    this.donnees.listeColonnesSimulations.parcourir((D, aIndex) => {
      lColonnes.push({
        id:
          DonneesListe_ReleveDEvaluations.colonnes.prefixe_simulation + aIndex,
        taille: 50,
        titre: [
          {
            libelle:
              aIndex === 0
                ? GTraductions.getValeur(
                    "releve_evaluations.colonne.titre.simulations",
                  )
                : TypeFusionTitreListe.FusionGauche,
          },
          { libelle: D.getLibelle(), titleHtml: D.hint },
        ],
        affichagePastillesDePositionnenment:
          lThis.typeAffichage === lThis.constantes.AffichageParService,
      });
    });
  }
  const lAvecColonnePosLSUNiveau =
    this.donnees.avecColonne.posLSUNiveau &&
    this.parametres.affichage.avecPositionnementLSUNiveau &&
    !lEstAvecColonnesLSL;
  if (lAvecColonnePosLSUNiveau) {
    lListeInstance.controleur.btnPreferencesCalculPositionnement = {
      event() {
        const lEstContexteParService =
          lThis.typeAffichage === lThis.constantes.AffichageParService;
        TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
          lEstContexteParService,
          { callbackSurChangement: lThis.afficherPage.bind(lThis) },
        );
      },
      getTitle() {
        return GTraductions.getValeur(
          "FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
        );
      },
      getClass() {
        return "TitreListeSansTri";
      },
    };
    lListeInstance.controleur.btnValidationAutoPosLSUParNiveau = {
      event() {
        const lParamValidationAuto =
          _getParametresValidationAutoPositionnement.call(
            lThis,
            TypeModeValidationAuto.tmva_PosSansNoteSelonEvaluation,
          );
        TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
          lParamValidationAuto,
        );
      },
      getTitle() {
        return GTraductions.getValeur(
          "releve_evaluations.colonne.hint.btnValidationAutoPosLSUParNiveau",
        );
      },
      getDisabled() {
        return !lThis.donnees.avecBoutonPosLSUParNiveau;
      },
      getClass() {
        return this.controleur.btnValidationAutoPosLSUParNiveau.getDisabled.call(
          this,
        )
          ? ""
          : "TitreListeSansTri";
      },
    };
    const lTitreColonnePosLSUNiveau = [];
    lTitreColonnePosLSUNiveau.push(
      '<div style="position:absolute; top:4px; right: 4px;">',
      '<ie-btnicon ie-model="btnPreferencesCalculPositionnement" ie-class="getClass" class="icon_cog"></ie-btnicon>',
      "</div>",
    );
    lTitreColonnePosLSUNiveau.push(
      '<ie-btnicon ie-model="btnValidationAutoPosLSUParNiveau" ie-class="getClass" class="icon_sigma color-neutre"></ie-btnicon>',
    );
    lTitreColonnePosLSUNiveau.push(
      '<span class="m-left" ie-hint="',
      GTraductions.getValeur("releve_evaluations.colonne.hint.pos_lsu_niveau"),
      '">',
      GTraductions.getValeur("releve_evaluations.colonne.titre.pos_lsu_niveau"),
      "</span>",
    );
    lColonnes.push({
      id: DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau,
      taille: 50,
      titre: {
        libelleCSV: GTraductions.getValeur(
          "releve_evaluations.colonne.titre.pos_lsu_niveau",
        ),
        libelleHtml: lTitreColonnePosLSUNiveau.join(""),
      },
    });
  }
  const lAvecColonnePosLSUNote =
    this.donnees.avecColonne.posLSUNote &&
    this.parametres.affichage.avecPositionnementLSUNote &&
    !lEstAvecColonnesLSL;
  if (lAvecColonnePosLSUNote) {
    lListeInstance.controleur.btnValidationAutoPosLSUParNote = {
      event() {
        const lParamValidationAuto =
          _getParametresValidationAutoPositionnement.call(
            lThis,
            TypeModeValidationAuto.tmva_PosAvecNoteSelonEvaluation,
          );
        TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
          lParamValidationAuto,
        );
      },
      getTitle() {
        return GTraductions.getValeur(
          "releve_evaluations.colonne.hint.btnValidationAutoPosLSUParNote",
        );
      },
      getDisabled() {
        return !lThis.donnees.avecBoutonPosLSUParNote;
      },
      getClass() {
        return this.controleur.btnValidationAutoPosLSUParNote.getDisabled.call(
          this,
        )
          ? ""
          : "TitreListeSansTri";
      },
    };
    const lTitreColonnePosLSUNote = [];
    lTitreColonnePosLSUNote.push(
      '<div class="display-flex flex-center justify-center">',
    );
    lTitreColonnePosLSUNote.push('<div class="display-flex flex-center">');
    lTitreColonnePosLSUNote.push(
      '<ie-btnicon ie-model="btnValidationAutoPosLSUParNote" ie-class="getClass" class="icon_pencil fix-bloc m-right-l" style="font-size:1.4rem;"></ie-btnicon>',
    );
    lTitreColonnePosLSUNote.push(
      '<span ie-hint="',
      GTraductions.getValeur("releve_evaluations.colonne.hint.pos_lsu_note"),
      '">',
      GTraductions.getValeur("releve_evaluations.colonne.titre.pos_lsu_note"),
      "</span>",
    );
    lTitreColonnePosLSUNote.push("</div>");
    lTitreColonnePosLSUNote.push("</div>");
    lColonnes.push({
      id: DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note,
      taille: 50,
      titre: {
        libelleCSV: GTraductions.getValeur(
          "releve_evaluations.colonne.titre.pos_lsu_note",
        ),
        libelleHtml: lTitreColonnePosLSUNote.join(""),
      },
    });
  }
  const lAvecColonneNiveauAcquiPilier =
    this.donnees.avecColonne.nivAcquiPilier &&
    this.parametres.affichage.avecNiveauMaitriseDomaine &&
    !lEstAvecColonnesLSL;
  if (lAvecColonneNiveauAcquiPilier) {
    lListeInstance.controleur.btnValidationAutoNivAcquiDomaine = {
      event() {
        TUtilitaireCompetences.surBoutonValidationAuto({
          instance: lThis,
          avecChoixCalcul: true,
          periode: GEtatUtilisateur.Navigation.getRessource(
            EGenreRessource.Periode,
          ),
          listeEleves: lThis.donnees.listeEleves,
        });
      },
      getTitle() {
        return GTraductions.getValeur(
          "releve_evaluations.colonne.hint.btnValidationAutoNivAcquiDomaine",
        );
      },
      getDisabled() {
        return !lThis.donnees.avecBoutonNivAcquiPilier;
      },
      getClass() {
        return this.controleur.btnValidationAutoNivAcquiDomaine.getDisabled.call(
          this,
        )
          ? ""
          : "TitreListeSansTri";
      },
    };
    const lTitreColonneNivAcquiDomaine = [];
    lTitreColonneNivAcquiDomaine.push(
      '<div class="flex-contain flex-center justify-center">',
    );
    lTitreColonneNivAcquiDomaine.push(
      '<ie-btnicon ie-model="btnValidationAutoNivAcquiDomaine" ie-class="getClass" class="icon_sigma color-neutre"></ie-btnicon>',
    );
    lTitreColonneNivAcquiDomaine.push(
      "<span>",
      GTraductions.getValeur(
        "releve_evaluations.colonne.titre.niv_acqui_domaine",
      ),
      "</span>",
    );
    lTitreColonneNivAcquiDomaine.push("</div>");
    lColonnes.push({
      id: DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine,
      taille: 100,
      titre: { libelleHtml: lTitreColonneNivAcquiDomaine.join("") },
    });
  }
  const lEstEnModeCompact = this.parametres.affichage.modeCompact;
  if (
    this.donnees.listeColonnesDEvaluations &&
    this.donnees.listeColonnesDEvaluations.count() > 0
  ) {
    let lListeTitres;
    const lNbLignesDEntete = this.donnees.nbLignesDEntete;
    this.donnees.listeColonnesDEvaluations.parcourir((D, aIndex) => {
      lListeTitres = [];
      for (let i = 0; i < lNbLignesDEntete; i++) {
        lListeTitres.push({
          libelle:
            D.lignes[i].titre === ""
              ? TypeFusionTitreListe.FusionGauche
              : D.lignes[i].titre,
          titleHtml: D.lignes[i].hint,
        });
      }
      lColonnes.push({
        id:
          DonneesListe_ReleveDEvaluations.colonnes.prefixe_evaluation + aIndex,
        taille: lEstEnModeCompact ? 30 : 60,
        titre: lListeTitres,
      });
    });
    if (this.donnees.listeColonnesDEvaluations.count() >= 2) {
      firstIdColonneScrollable =
        DonneesListe_ReleveDEvaluations.colonnes.prefixe_evaluation + "0";
      lastIdColonneScrollable =
        DonneesListe_ReleveDEvaluations.colonnes.prefixe_evaluation +
        (this.donnees.listeColonnesDEvaluations.count() - 1);
    }
  }
  if (lEstAvecColonnesLSL) {
    lListeInstance.controleur.btnValidationAutoColonneLSL = {
      event(aIdColonne, aAvecBtnCalculAutoEnabled) {
        if (aAvecBtnCalculAutoEnabled) {
          if (lThis.donnees) {
            _surCalculAutoColonneLSL.call(
              lThis,
              lThis.donnees.listeEleves,
              aIdColonne,
            );
          }
        }
      },
      getTitle() {
        return GTraductions.getValeur(
          "releve_evaluations.colonne.hint.btnValidationAutoNivAcqRefDisciplinaire",
        );
      },
      getDisabled(aIdColonne, aAvecBtnCalculAutoEnabled) {
        return !aAvecBtnCalculAutoEnabled;
      },
      getClass(aAvecBtnCalculAutoEnabled) {
        return this.controleur.btnValidationAutoColonneLSL.getDisabled.call(
          this,
          null,
          aAvecBtnCalculAutoEnabled,
        )
          ? ""
          : "TitreListeSansTri";
      },
    };
    this.donnees.listeColonnesLSL.parcourir((D, aIndex) => {
      const lElementCptConcerne = D.elementConcerne;
      const lColonneJaugeId =
        DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_jauge +
        (lElementCptConcerne ? lElementCptConcerne.getNumero() : aIndex);
      const lLibelleColonne = [];
      lLibelleColonne.push(
        "<ie-btnicon ie-model=\"btnValidationAutoColonneLSL('",
        lColonneJaugeId,
        "', ",
        !!D.avecBtnCalculAutoEnabled,
        ')" ie-class="getClass(',
        !!D.avecBtnCalculAutoEnabled,
        ')" class="icon_sigma color-neutre m-right-l"></ie-btnicon>',
      );
      lLibelleColonne.push("<span>", D.getLibelle(), "</span>");
      lColonnes.push({
        id: lColonneJaugeId,
        taille: lEstEnModeCompact ? 60 : 120,
        titre: lLibelleColonne.join(""),
        hint: D.hint || "",
      });
      lColonnes.push({
        id:
          DonneesListe_ReleveDEvaluations.colonnes.prefixe_LSL_niveau +
          (lElementCptConcerne ? lElementCptConcerne.getNumero() : aIndex),
        taille: lEstEnModeCompact ? 30 : 60,
        titre: TypeFusionTitreListe.FusionGauche,
      });
    });
  }
  if (
    this.donnees.listeColonnesAppreciations &&
    this.donnees.listeColonnesAppreciations.count() > 0 &&
    this.parametres.affichage.avecAppreciations
  ) {
    const lThis = this;
    lListeInstance.controleur.btnAssistantSaisieListe = {
      event(aRangAppreciation) {
        const lSelections = this.instance.getTableauCellulesSelection();
        lThis.ouvrirFenetreAssistantSaisie(
          !!lSelections && lSelections.length > 1,
          aRangAppreciation,
        );
      },
      getTitle() {
        return GTraductions.getValeur(
          "releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
        );
      },
      getDisabled(aRangAppreciation) {
        let lResult = true;
        const lSelections = this.instance.getTableauCellulesSelection();
        if (!!lSelections && lSelections.length > 0) {
          lResult = !lSelections.some((aSelection) => {
            if (
              DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
                aSelection.idColonne,
              )
            ) {
              const lRangAppSelection =
                DonneesListe_ReleveDEvaluations.getRangAppreciation(
                  aSelection.idColonne,
                );
              if (
                lRangAppSelection === aRangAppreciation &&
                DonneesListe_ReleveDEvaluations.lAppreciationEstEditable(
                  aSelection.idColonne,
                  aSelection.article,
                )
              ) {
                return true;
              }
            }
            return false;
          });
        }
        return lResult;
      },
      getClass(aRangAppreciation) {
        return this.controleur.btnAssistantSaisieListe.getDisabled.call(
          this,
          aRangAppreciation,
        )
          ? ""
          : "TitreListeSansTri";
      },
    };
    this.donnees.listeColonnesAppreciations.parcourir((D) => {
      const lTitreColonneAppreciation = [];
      lTitreColonneAppreciation.push(
        '<div class="display-flex flex-center justify-center">',
      );
      lTitreColonneAppreciation.push('<div class="display-flex flex-center">');
      if (lThis.avecAssistantSaisie()) {
        lTitreColonneAppreciation.push(
          '<ie-btnicon ie-model="btnAssistantSaisieListe(',
          D.getGenre(),
          ')" ie-class="getClass"',
          ' class="icon_pencil fix-bloc m-right-l"',
          ' style="font-size: 1.4rem;"',
          GObjetWAI.composeAttribut({
            genre: EGenreAttribut.label,
            valeur: GTraductions.getValeur(
              "releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
            ),
          }),
          "></ie-btnicon>",
        );
      }
      lTitreColonneAppreciation.push("<span>", D.getLibelle(), "</span>");
      lTitreColonneAppreciation.push("</div>");
      lTitreColonneAppreciation.push("</div>");
      lColonnes.push({
        id:
          DonneesListe_ReleveDEvaluations.colonnes.prefixe_appreciations +
          D.getGenre(),
        taille: 220,
        titre: {
          libelleCSV: D.getLibelle(),
          libelleHtml: lTitreColonneAppreciation.join(""),
        },
      });
    });
  }
  lListeInstance.setOptionsListe({
    colonnes: lColonnes,
    scrollHorizontal: {
      debut: firstIdColonneScrollable,
      fin: lastIdColonneScrollable,
    },
  });
  GEtatUtilisateur.setTriListe({
    liste: lListeInstance,
    tri: DonneesListe_ReleveDEvaluations.colonnes.eleve,
  });
  lListeInstance.setDonnees(
    new DonneesListe_ReleveDEvaluations(this.donnees.listeEleves, {
      affichageProjetsAccompagnement:
        this.parametres.affichage.avecProjetsAccompagnement,
      affichageJaugeChronologique:
        this.parametres.affichage.afficheJaugeChronologique,
      affichageModeMultiLigne: this.parametres.affichage.modeMultiLigne,
      tailleMaxAppreciation: this.parametres.droits.tailleMaxAppreciationEleve,
      initMenuContextuel: _initMenuContextuelListe.bind(this),
      avecAssistantSaisie: this.avecAssistantSaisie(),
      callbackClicJauge: _surClicJaugeColonneLSL.bind(this),
    }),
  );
  this.afficherBandeau(true);
}
function _surCalculAutoColonneLSL(aListeEleves, aIdColonneConcernee) {
  const lThis = this;
  let lAvecRemplacementValeurs = false;
  const lFunctionExecutionCalculAuto = function () {
    let lAvecChangement = false;
    aListeEleves.parcourir((D) => {
      const lValeurColonneLSL =
        DonneesListe_ReleveDEvaluations.getValeurColonneLSL(
          aIdColonneConcernee,
          D,
        );
      if (
        lValeurColonneLSL.niveau &&
        lValeurColonneLSL.niveau.estEditable &&
        lValeurColonneLSL.niveauMoyenne
      ) {
        if (
          lAvecRemplacementValeurs ||
          lValeurColonneLSL.niveau.getGenre() < EGenreNiveauDAcquisition.Expert
        ) {
          lValeurColonneLSL.niveau = Object.assign(
            lValeurColonneLSL.niveau,
            lValeurColonneLSL.niveauMoyenne,
          );
          lValeurColonneLSL.setEtat(EGenreEtat.Modification);
          D.setEtat(EGenreEtat.Modification);
          lAvecChangement = true;
        }
      }
    });
    if (lAvecChangement) {
      lThis.setEtatSaisie(true);
      lThis.getInstance(lThis.identListe).actualiser(true);
    }
  };
  const lMessage = [];
  lMessage.push(
    GTraductions.getValeur("releve_evaluations.calculAutoColonneLSL.message"),
  );
  lMessage.push("<br/>", "<br/>");
  lMessage.push(
    '<ie-checkbox ie-model="surCheckbox">',
    GTraductions.getValeur(
      "releve_evaluations.calculAutoColonneLSL.remplacerExistants",
    ),
    "</ie-checkbox>",
  );
  GApplication.getMessage().afficher({
    type: EGenreBoiteMessage.Confirmation,
    titre: GTraductions.getValeur(
      "releve_evaluations.calculAutoColonneLSL.titre",
    ),
    message: lMessage.join(""),
    callback: function (aGenreAction) {
      if (aGenreAction === EGenreAction.Valider) {
        lFunctionExecutionCalculAuto.call(this);
      }
    },
    controleur: {
      surCheckbox: {
        getValue: function () {
          return lAvecRemplacementValeurs;
        },
        setValue: function (aValue) {
          lAvecRemplacementValeurs = aValue;
        },
      },
    },
  });
}
function _surClicJaugeColonneLSL(aEleve, aValeurColonneLSL) {
  if (
    aEleve &&
    aValeurColonneLSL &&
    aValeurColonneLSL.relationsESI &&
    aValeurColonneLSL.relationsESI.length
  ) {
    new ObjetRequeteDetailEvaluationsCompetences(
      this,
      _reponseRequeteDetailEvaluations.bind(this, aEleve, aValeurColonneLSL),
    ).lancerRequete({
      eleve: aEleve,
      pilier: null,
      periode: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Periode,
      ),
      numRelESI: aValeurColonneLSL.relationsESI,
    });
  }
}
function _reponseRequeteDetailEvaluations(aEleve, aValeurColonneLSL, aJSON) {
  const lFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_DetailEvaluationsCompetences,
    {
      pere: this,
      evenement: null,
      initialiser: function (aInstance) {
        aInstance.setOptionsFenetre({
          titre: "",
          largeur: 700,
          hauteur: 500,
          listeBoutons: [GTraductions.getValeur("Fermer")],
        });
      },
    },
  );
  const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
    aEleve,
    aValeurColonneLSL,
  );
  lFenetre.setDonnees(aValeurColonneLSL, aJSON, {
    titreFenetre: lTitreParDefaut,
  });
}
function _surValidationAssistantSaisie(
  aAppreciationSelectionnee,
  aRangAppreciation,
) {
  const lSelections = this.getInstance(
    this.identListe,
  ).getTableauCellulesSelection();
  let lModif = false;
  lSelections.forEach((aSelection) => {
    if (
      DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
        aSelection.idColonne,
      )
    ) {
      const lObjetAppreciation =
        DonneesListe_ReleveDEvaluations.getObjetAppreciation(
          aSelection.idColonne,
          aSelection.article,
        );
      if (
        !!lObjetAppreciation &&
        lObjetAppreciation.getGenre() === aRangAppreciation &&
        lObjetAppreciation.estEditable
      ) {
        lObjetAppreciation.valeur = aAppreciationSelectionnee.getLibelle();
        lObjetAppreciation.setEtat(EGenreEtat.Modification);
        aSelection.article.setEtat(EGenreEtat.Modification);
        lModif = true;
      }
    }
  });
  if (lModif) {
    this.setEtatSaisie(true);
    this.getInstance(this.identListe).actualiser(true);
  }
}
function _initFenetreParametres(aInstance) {
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur(
      "releve_evaluations.parametres.ParametresDAffichage",
    ),
    largeur: 500,
    hauteur: 200,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
  aInstance.setParametres(this.typeAffichage, this.constantes);
}
function _evenementFenetreParametres(
  aDonnees,
  aAvecChangementDonneesCalculSimu,
) {
  this.parametres.affichage.avecSynthese = aDonnees.avecSynthese;
  this.parametres.affichage.avecPourcentageAcqui =
    aDonnees.avecPourcentageAcqui;
  this.parametres.affichage.avecPositionnementLSUNiveau =
    aDonnees.avecPositionnementLSUNiveau;
  this.parametres.affichage.avecPositionnementPrecedents =
    aDonnees.avecPositionnementPrecedents;
  this.parametres.affichage.avecPositionnementLSUNote =
    aDonnees.avecPositionnementLSUNote;
  this.parametres.affichage.avecNiveauMaitriseDomaine =
    aDonnees.avecNiveauMaitriseDomaine;
  this.parametres.affichage.avecSimuCalculPositionnement =
    aDonnees.avecSimuCalculPositionnement;
  let lRequeteNecessaire = !!aAvecChangementDonneesCalculSimu;
  if (
    this.parametres.affichage.avecAppreciations !== aDonnees.avecAppreciations
  ) {
    this.parametres.affichage.avecAppreciations = aDonnees.avecAppreciations;
    GHtml.setDisplay(this.parametres.id.piedPage, this.estPiedDePageVisible());
    if (this.estPiedDePageVisible()) {
      this.actualiserDonneesPiedDePage();
    }
  }
  if (
    this.parametres.affichage.avecRegroupementParDomaine !==
    aDonnees.avecRegroupementParDomaine
  ) {
    this.parametres.affichage.avecRegroupementParDomaine =
      aDonnees.avecRegroupementParDomaine;
    lRequeteNecessaire = true;
  }
  if (
    this.parametres.affichage.avecEvaluationsCoeffNul !==
    aDonnees.avecEvaluationsCoeffNul
  ) {
    this.parametres.affichage.avecEvaluationsCoeffNul =
      aDonnees.avecEvaluationsCoeffNul;
    lRequeteNecessaire = true;
  }
  if (
    this.parametres.affichage.avecEvaluationsHistoriques !==
    aDonnees.avecEvaluationsHistoriques
  ) {
    this.parametres.affichage.avecEvaluationsHistoriques =
      aDonnees.avecEvaluationsHistoriques;
    lRequeteNecessaire = true;
  }
  if (
    this.parametres.affichage.avecProjetsAccompagnement !==
    aDonnees.avecProjetsAccompagnement
  ) {
    this.parametres.affichage.avecProjetsAccompagnement =
      aDonnees.avecProjetsAccompagnement;
    lRequeteNecessaire = true;
  }
  if (this.parametres.affichage.ordreColonnes !== aDonnees.ordreColonnes) {
    this.parametres.affichage.ordreColonnes = aDonnees.ordreColonnes;
    lRequeteNecessaire = true;
  }
  if (this.parametres.affichage.typeEvolution !== aDonnees.typeEvolution) {
    this.parametres.affichage.typeEvolution = aDonnees.typeEvolution;
    lRequeteNecessaire = true;
  }
  if (
    this.parametres.affichage.toleranceEvolution !== aDonnees.toleranceEvolution
  ) {
    this.parametres.affichage.toleranceEvolution = aDonnees.toleranceEvolution;
    lRequeteNecessaire = true;
  }
  if (lRequeteNecessaire) {
    if (this.getEtatSaisie() === true) {
      ControleSaisieEvenement(this.afficherPage.bind(this));
    } else {
      this.afficherPage();
    }
  } else {
    _actualiserListe.call(this);
  }
}
module.exports = { _PageReleveEvaluations };
