const { TypeDroits } = require("ObjetDroitsPN.js");
const { GUID } = require("GUID.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetListeArborescente } = require("ObjetListeArborescente.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { PiedBulletin_Appreciations } = require("PiedBulletin_Appreciations.js");
const {
  PiedBulletin_AppreciationsAnnuelles,
} = require("PiedBulletin_AppreciationsAnnuelles.js");
const { PiedBulletin_Certificats } = require("PiedBulletin_Certificats.js");
const { PiedBulletin_Competences } = require("PiedBulletin_Competences.js");
const { PiedBulletin_Orientations } = require("PiedBulletin_Orientations.js");
const { PiedBulletin_VieScolaire } = require("PiedBulletin_ModulesDivers.js");
const { PiedBulletin_Stages } = require("PiedBulletin_ModulesDivers.js");
const { PiedBulletin_Mentions } = require("PiedBulletin_ModulesDivers.js");
const { PiedBulletin_Legende } = require("PiedBulletin_ModulesDivers.js");
const { PiedBulletin_Projets } = require("PiedBulletin_ModulesDivers.js");
const { PiedBulletin_Credits } = require("PiedBulletin_ModulesDivers.js");
const { PiedBulletin_Engagements } = require("PiedBulletin_ModulesDivers.js");
const {
  PiedBulletin_ParcoursEducatif,
} = require("PiedBulletin_ParcoursEducatif.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const {
  TypeModeAffichagePiedBulletin,
} = require("TypeModeAffichagePiedBulletin.js");
const {
  TypeModuleFonctionnelPiedBulletin,
  TypeModuleFonctionnelPiedBulletinUtil,
} = require("TypeModuleFonctionnelPiedBulletin.js");
class InterfacePiedBulletin extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.initParams();
    this.hauteurTabOnglets = 20;
    this.hauteurContenuTabOnglets = 200;
    const lBaseId = GUID.getId() + "_";
    this.idPiedBulletin = lBaseId + "PiedBull";
    this.idContenu = lBaseId + "Contenu";
  }
  setOptions(aOptions) {
    if (aOptions && aOptions.hauteurContenu) {
      this.hauteurContenuTabOnglets = aOptions.hauteurContenu;
    }
  }
  initParams() {
    this.params = {
      modeAffichage: TypeModeAffichagePiedBulletin.MAPB_Onglets,
      modulesParDefaut: [TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations],
      typeReleveBulletin: null,
      modeSaisie: false,
      contexte: TypeContexteBulletin.CB_Eleve,
      avecContenuVide: false,
      avecValidationAuto: false,
      clbckValidationAutoSurEdition: null,
    };
    this.horsOnglets = [];
    this.onglets = [];
  }
  estModeAffichage(aMode) {
    return this.params.modeAffichage === aMode;
  }
  resetIdentInstances() {
    this.identOnglets = null;
    this.identVieScolaire = null;
    this.identCertificats = null;
    this.identOrientations = null;
    this.identAppreciations = null;
    this.identAppreciationsGeneralesAnnuelles = null;
    this.identAppreciationsAnnuelles = null;
    this.identParcoursEducatif = null;
    this.identStages = null;
    this.identCompetences = null;
    this.identMentions = null;
    this.identLegende = null;
    this.identProjets = null;
    this.identCredits = null;
    this.identEngagements = null;
  }
  construireInstances() {
    this.resetIdentInstances();
    if (this.estModeAffichage(TypeModeAffichagePiedBulletin.MAPB_Onglets)) {
      this.identOnglets = this.add(
        ObjetTabOnglets,
        _evntSurTabOnglets.bind(this),
        _initTabOnglets.bind(this),
      );
    }
    const lModules =
      TypeModuleFonctionnelPiedBulletinUtil.getTabTousLesModules();
    const lNbr = lModules.length;
    for (let i = 0; i < lNbr; i++) {
      const lModule = lModules[i];
      if (_avecMFPB.call(this, lModule)) {
        _instancierMFPB.call(this, lModule);
      }
    }
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = false;
  }
  construireStructureAffichageAutre() {
    const T = [];
    T.push('<div id="', this.idPiedBulletin, '" style="display:none;">');
    T.push(
      this._construireContenuModules({
        tabModules: this.horsOnglets,
        style: "EspaceBas",
      }),
    );
    switch (this.params.modeAffichage) {
      case TypeModeAffichagePiedBulletin.MAPB_Onglets:
        T.push(this._construireModeTabOnglets());
        break;
      case TypeModeAffichagePiedBulletin.MAPB_Lineaire:
        T.push(this._construireModeLineaire());
        break;
      case TypeModeAffichagePiedBulletin.MAPB_Accessible:
        T.push(this._construireModeAccessible());
        break;
      default:
        break;
    }
    T.push("</div>");
    return T.join("");
  }
  setDonnees(aParam) {
    $.extend(true, this.params, aParam);
    this.donneesRecues = true;
    this._setDonneesModulesFonctionnels(aParam);
    if (
      [
        TypeModeAffichagePiedBulletin.MAPB_Onglets,
        TypeModeAffichagePiedBulletin.MAPB_Lineaire,
      ].includes(this.params.modeAffichage)
    ) {
      if (this.idPiedBulletin) {
        $("#" + this.idPiedBulletin.escapeJQ()).css({ display: "block" });
      }
      this.construireAffichage();
      this._afficherModules({ tabModules: this.horsOnglets });
      if (this.estModeAffichage(TypeModeAffichagePiedBulletin.MAPB_Onglets)) {
        const lNbr = this.listeOnglets.count();
        for (let i = 0; i < lNbr; i++) {
          const lElt = this.listeOnglets.get(i);
          const lGenreModule = lElt.Genre;
          const lIdent = _getIdentDeMFPB.call(this, lGenreModule);
          if (lIdent !== null && lIdent !== undefined) {
            const lInstance = this.getInstance(lIdent);
            lElt.invisible = !lInstance.estAffiche();
          }
        }
        let lExisteOngletVisible = false;
        this.params.modulesParDefaut.every((aModuleGenre) => {
          for (let i = 0; i < lNbr; i++) {
            const lElt = this.listeOnglets.get(i);
            if (!lElt.invisible) {
              lExisteOngletVisible = true;
              if (lElt.getGenre() === aModuleGenre) {
                this.ongletSelectionne = i;
                return false;
              }
            }
          }
          return true;
        });
        if (!lExisteOngletVisible) {
          this.ongletSelectionne = 0;
        }
        this.getInstance(this.identOnglets).setDonnees(this.listeOnglets);
        if (lExisteOngletVisible) {
          $("#" + this.getInstance(this.identOnglets).getNom().escapeJQ()).css({
            display: "block",
          });
          $("#" + this.idContenu.escapeJQ()).css({ display: "block" });
          this._afficherModules({ tabModules: this.onglets });
          this.getInstance(this.identOnglets).selectOnglet(
            this.ongletSelectionne,
          );
        } else {
          $("#" + this.getInstance(this.identOnglets).getNom().escapeJQ()).css({
            display: "none",
          });
          $("#" + this.idContenu.escapeJQ()).css({ display: "none" });
        }
      } else {
        this._afficherModules({ tabModules: this.onglets });
      }
    } else {
      return this._getListeArborescente({
        tabModules: this.horsOnglets.concat(this.onglets),
      });
    }
  }
  construireAffichage() {
    if (this.donneesRecues) {
      if (
        [
          TypeModeAffichagePiedBulletin.MAPB_Onglets,
          TypeModeAffichagePiedBulletin.MAPB_Lineaire,
        ].includes(this.params.modeAffichage)
      ) {
        const lModules = [
          TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
          TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
          TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
          TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
          TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles,
          TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles,
        ];
        const lNbr = lModules.length;
        for (let i = 0; i < lNbr; i++) {
          const lInstance = _getInstanceDeMFPB.call(this, lModules[i]);
          if (lInstance !== null) {
            lInstance.reinitialiser();
          }
        }
      }
      super.construireAffichage();
    }
  }
  _setDonneesModulesFonctionnels(aParam) {
    const lModules =
      TypeModuleFonctionnelPiedBulletinUtil.getTabTousLesModules();
    const lNbr = lModules.length;
    for (let i = 0; i < lNbr; i++) {
      const lModule = lModules[i];
      const lInstance = _getInstanceDeMFPB.call(this, lModule);
      if (lInstance !== null) {
        lInstance.setDonnees(_setDonneesDeMFPB.call(this, lModule, aParam));
      }
    }
  }
  _construireContenuModules(aParam) {
    const T = [];
    const lNbr = aParam.tabModules.length;
    for (let i = 0; i < lNbr; i++) {
      const lInstance = _getInstanceDeMFPB.call(this, aParam.tabModules[i]);
      if (lInstance !== null) {
        const lClass = aParam.style ? 'class="' + aParam.style + '"' : "";
        T.push(
          "<div ",
          lClass,
          ' id="',
          lInstance.getNom(),
          '" style="height:100%; overflow:auto">',
          "</div>",
        );
      }
    }
    return T.join("");
  }
  _afficherModules(aParam) {
    const lNbr = aParam.tabModules.length;
    for (let i = 0; i < lNbr; i++) {
      const lInstance = _getInstanceDeMFPB.call(this, aParam.tabModules[i]);
      if (lInstance !== null) {
        if (lInstance.estAffiche()) {
          lInstance.afficher({ modeAffichage: this.params.modeAffichage });
        } else {
          $("#" + lInstance.getNom().escapeJQ()).css({ display: "none" });
        }
      }
    }
  }
  _surSelectionModule(aParam) {
    const lInstance = _getInstanceDeMFPB.call(this, aParam.module);
    if (lInstance !== null) {
      $("#" + lInstance.getNom().escapeJQ())
        .show()
        .siblings()
        .hide();
      if (lInstance.surResizeInterface) {
        lInstance.surResizeInterface();
      }
      if (lInstance.actualiserSurChangementTabOnglet) {
        lInstance.actualiserSurChangementTabOnglet();
      }
    }
  }
  _getListeArborescente(aParam) {
    const lListeArb = new ObjetListeArborescente(
      this.Nom + "_Liste",
      0,
      this,
      null,
    );
    const lRacine = lListeArb.construireRacine();
    lListeArb.setParametres(false);
    const lParam = { listeArb: lListeArb, racine: lRacine };
    const lNbr = aParam.tabModules.length;
    for (let i = 0; i < lNbr; i++) {
      const lInstance = _getInstanceDeMFPB.call(this, aParam.tabModules[i]);
      if (lInstance !== null) {
        if (
          lInstance &&
          lInstance.getListeArborescente &&
          lInstance.estAffiche()
        ) {
          lInstance.getListeArborescente(lParam);
        }
      }
    }
    return lRacine;
  }
  setParametres(aParam) {
    this.initParams();
    $.extend(true, this.params, aParam);
    this.horsOnglets = this.params.modulesHorsOnglets;
    this.onglets = this.params.modulesOnglets;
  }
  getDonneesSaisie() {
    if (
      [
        TypeModeAffichagePiedBulletin.MAPB_Onglets,
        TypeModeAffichagePiedBulletin.MAPB_Lineaire,
      ].includes(this.params.modeAffichage)
    ) {
      const lResult = {};
      const lModules = [
        TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
        TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles,
        TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles,
        TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
        TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
        TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
      ];
      const lNbr = lModules.length;
      for (let i = 0; i < lNbr; i++) {
        const lModule = lModules[i];
        const lInstance = _getInstanceDeMFPB.call(this, lModule);
        if (lInstance !== null) {
          $.extend(lResult, _getDonneesSaisieDeMFPB(lModule, lInstance));
        }
      }
      return lResult;
    }
  }
  evenementSurAssistant() {
    const lInstance = _getInstanceDeMFPB.call(
      this,
      TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations,
    );
    if (lInstance !== null) {
      lInstance.evenementSurAssistant();
    }
  }
  _construireModeTabOnglets() {
    const T = [];
    T.push(
      `<div class="conteneur-tabs" id="${this.getInstance(this.identOnglets).getNom()}"></div>`,
    );
    T.push(
      '<div id="',
      this.idContenu,
      '" class="tabs-contenu" style="height:',
      this.hauteurContenuTabOnglets,
      'px;">',
    );
    T.push(this._construireContenuModules({ tabModules: this.onglets }));
    T.push("</div>");
    return T.join("");
  }
  _construireModeLineaire() {
    const T = [];
    T.push(
      this._construireContenuModules({
        tabModules: this.onglets,
        style: "EspaceBas",
      }),
    );
    return T.join("");
  }
  _construireModeAccessible() {
    const T = [];
    return T.join("");
  }
}
function _instancierMFPB(aModule) {
  switch (aModule) {
    case TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire:
      this.identVieScolaire = this.add(PiedBulletin_VieScolaire);
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
      this.identCertificats = this.add(
        PiedBulletin_Certificats,
        null,
        _initPB_Certificats.bind(this),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
      this.identAppreciations = this.add(
        PiedBulletin_Appreciations,
        _evntPB_Appr.bind(this),
        _initPB_Appr.bind(this),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles:
      this.identAppreciationsGeneralesAnnuelles = this.add(
        PiedBulletin_AppreciationsAnnuelles,
        _evntPB_Appr.bind(this),
        _initPB_AppreciationsAnnuelles.bind(this, true),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles:
      this.identAppreciationsAnnuelles = this.add(
        PiedBulletin_AppreciationsAnnuelles,
        _evntPB_Appr.bind(this),
        _initPB_AppreciationsAnnuelles.bind(this, false),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
      this.identParcoursEducatif = this.add(
        PiedBulletin_ParcoursEducatif,
        null,
        _initPB_ParcoursEduc.bind(this),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
      this.identCompetences = this.add(
        PiedBulletin_Competences,
        null,
        _initPB_Competences.bind(this),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Stages:
      this.identStages = this.add(PiedBulletin_Stages);
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Orientations:
      this.identOrientations = this.add(
        PiedBulletin_Orientations,
        null,
        _initPB_Orientations.bind(this),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Mentions:
      this.identMentions = this.add(
        PiedBulletin_Mentions,
        null,
        _initPB_Mentions.bind(this),
      );
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Legende:
      this.identLegende = this.add(PiedBulletin_Legende);
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Projets:
      this.identProjets = this.add(PiedBulletin_Projets);
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Credits:
      this.identCredits = this.add(PiedBulletin_Credits);
      break;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Engagements:
      this.identEngagements = this.add(PiedBulletin_Engagements);
      break;
  }
}
function _avecMFPB(aModule) {
  return this.horsOnglets.includes(aModule) || this.onglets.includes(aModule);
}
function _getIdentDeMFPB(aModule) {
  switch (aModule) {
    case TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire:
      return this.identVieScolaire;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Projets:
      return this.identProjets;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
      return this.identCertificats;
    case TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
      return this.identParcoursEducatif;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Stages:
      return this.identStages;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
      return this.identCompetences;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Orientations:
      return this.identOrientations;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
      return this.identAppreciations;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles:
      return this.identAppreciationsAnnuelles;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles:
      return this.identAppreciationsGeneralesAnnuelles;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Mentions:
      return this.identMentions;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Legende:
      return this.identLegende;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Credits:
      return this.identCredits;
    case TypeModuleFonctionnelPiedBulletin.MFPB_Engagements:
      return this.identEngagements;
    default:
      break;
  }
}
function _getInstanceDeMFPB(aModule) {
  const lIdent = _getIdentDeMFPB.call(this, aModule);
  if (
    lIdent !== null &&
    lIdent !== undefined &&
    this.getInstance(lIdent) !== null &&
    this.getInstance(lIdent) !== undefined
  ) {
    return this.getInstance(lIdent);
  }
  return null;
}
function _setDonneesDeMFPB(aModule, aParam) {
  const lPiedDePage = aParam.donnees;
  switch (aModule) {
    case TypeModuleFonctionnelPiedBulletin.MFPB_VieScolaire:
      return { absences: aParam.absences };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
      return {
        listeAttestations: lPiedDePage.ListeAttestations,
        listeAttestationsEleve: lPiedDePage.ListeAttestationsEleve,
        eleve: lPiedDePage.eleve,
      };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
      return {
        appreciations: lPiedDePage.ListeAppreciations,
        mentions: lPiedDePage.listeMentions,
        avecSaisieAG: lPiedDePage.avecSaisieAG,
      };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles:
      return {
        colonnes: lPiedDePage.ListeAppreciations.appreciationAnnuelle,
        periodes: lPiedDePage.ListeAppreciations.periodes,
        mentions: lPiedDePage.listeMentions,
        options: aParam.options,
      };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles:
      return {
        colonnes: lPiedDePage.ListeAppreciations.generalAnnuelle,
        periodes: lPiedDePage.ListeAppreciations.periodes,
        mentions: lPiedDePage.listeMentions,
      };
    case TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
      return {
        contexte: this.params.contexte,
        libelleUtilisateur: lPiedDePage.libelleUtilisateur,
        listeGenreParcours: lPiedDePage.listeGenreParcours,
        listeEvntsParcoursPeda: lPiedDePage.listeEvntsParcoursPeda,
        periodeCloture: lPiedDePage.periodeCloture,
        droits: {
          avecSaisie:
            this.params.modeSaisie &&
            GApplication.droits.get(
              TypeDroits.eleves.avecSaisieParcoursPedagogique,
            ),
        },
      };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
      return {
        listePiliers: lPiedDePage.listePiliers,
        avecValidationAuto: lPiedDePage.avecValidationAuto,
      };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Stages:
      return { listeStages: lPiedDePage.listeStages };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Orientations:
      return { objetOrientation: lPiedDePage.Orientation };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Mentions:
      return { listeMentionsClasse: lPiedDePage.ListeMentionsClasse };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Legende:
      return { legende: lPiedDePage.legende };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Projets:
      return { listeProjets: lPiedDePage.ListeProjets };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Credits:
      return { listeCredits: lPiedDePage.listeCredits };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Engagements:
      return { listeEngagements: lPiedDePage.listeEngagements };
  }
}
function _getDonneesSaisieDeMFPB(aModule, aInstance) {
  switch (aModule) {
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
      return { appreciations: aInstance.getDonneesSaisie() };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles:
      return { appreciations: aInstance.getDonneesSaisie() };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles:
      return { appreciationsGenerales: aInstance.getDonneesSaisie() };
    case TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
      return { parcoursEducatif: aInstance.getDonneesSaisie() };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
      return { certificats: aInstance.getDonneesSaisie() };
    case TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
      return { competences: aInstance.getDonneesSaisie() };
  }
}
function _initPB_Appr(aInstance) {
  aInstance.setParametres({
    modeAffichage: this.params.modeAffichage,
    modeSaisie: this.params.modeSaisie,
    avecContenuVide: this.params.avecContenuVide,
    contexte: this.params.contexte,
    typeReleveBulletin: this.params.typeReleveBulletin,
    avecValidationAuto: this.params.avecValidationAuto,
    clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
  });
}
function _initPB_AppreciationsAnnuelles(aGlobal, aInstance) {
  aInstance.setParametres({
    modeAffichage: this.params.modeAffichage,
    modeSaisie: this.params.modeSaisie,
    avecContenuVide: this.params.avecContenuVide,
    contexte: this.params.contexte,
    typeReleveBulletin: this.params.typeReleveBulletin,
    global: aGlobal,
    avecValidationAuto: this.params.avecValidationAuto,
    clbckValidationAutoSurEdition: this.params.clbckValidationAutoSurEdition,
  });
}
function _evntPB_Appr(aParam) {
  if (this.callback !== null && this.callback !== undefined) {
    this.callback.appel(aParam);
  }
}
function _initPB_Orientations(aInstance) {
  aInstance.setParametres({
    contexte: this.params.contexte,
    modeAffichage: this.params.modeAffichage,
    avecContenuVide: this.params.avecContenuVide,
  });
}
function _initPB_ParcoursEduc(aInstance) {
  aInstance.setParametres({
    avecContenuVide: this.params.avecContenuVide,
    avecTitreModule: this.horsOnglets.includes(
      TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif,
    ),
  });
}
function _initPB_Certificats(aInstance) {
  aInstance.setParametres({
    avecContenuVide: this.params.avecContenuVide,
    avecTitreModule: this.horsOnglets.includes(
      TypeModuleFonctionnelPiedBulletin.MFPB_Certificats,
    ),
  });
}
function _initPB_Competences(aInstance) {
  aInstance.setParametres({
    avecTitreModule: this.horsOnglets.includes(
      TypeModuleFonctionnelPiedBulletin.MFPB_Competences,
    ),
  });
}
function _initPB_Mentions(aInstance) {
  aInstance.setParametres({ modeAffichage: this.params.modeAffichage });
}
function _getListeTabOnglets() {
  const lListeOnglets = new ObjetListeElements();
  const lNbr = this.onglets.length;
  for (let i = 0; i < lNbr; i++) {
    const lGenre = this.onglets[i];
    lListeOnglets.addElement(
      new ObjetElement(
        TypeModuleFonctionnelPiedBulletinUtil.getLibelle(lGenre),
        0,
        lGenre,
      ),
    );
  }
  return lListeOnglets;
}
function _initTabOnglets(aInstance) {
  this.listeOnglets = _getListeTabOnglets.call(this);
  aInstance.setParametres(this.listeOnglets);
  aInstance.setOptions({ hauteur: this.hauteurTabOnglets });
  this.ongletSelectionne = 0;
  aInstance.ongletSelectionne = this.ongletSelectionne;
}
function _evntSurTabOnglets(aElement) {
  this.ongletSelectionne = aElement.Numero;
  this._surSelectionModule({ module: aElement.Genre });
}
module.exports = { InterfacePiedBulletin };
