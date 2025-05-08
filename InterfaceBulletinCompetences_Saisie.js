const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  _InterfaceBulletinCompetences,
} = require("_InterfaceBulletinCompetences.js");
const {
  DonneesListe_BulletinCompetences,
} = require("DonneesListe_BulletinCompetences.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
  ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const {
  EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const {
  ObjetFenetre_ElementsProgramme,
} = require("ObjetFenetre_ElementsProgramme.js");
const { ObjetFenetre_Mention } = require("ObjetFenetre_Mention.js");
const {
  ObjetRequeteSaisieBulletinCompetences,
} = require("ObjetRequeteSaisieBulletinCompetences.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { TypeGenreAppreciation } = require("TypeGenreAppreciation.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const ObjetRequeteSaisieDetailEvaluationsCompetences = require("ObjetRequeteSaisieDetailEvalCompetences.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { TypeModeValidationAuto } = require("TypeModeValidationAuto.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { UtilitaireBulletin } = require("UtilitaireBulletin.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
class InterfaceBulletinCompetences_Saisie extends _InterfaceBulletinCompetences {
  constructor(...aParams) {
    super(...aParams);
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurGrille = new ObjetMoteurGrilleSaisie();
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
    this.palierElementTravailleSelectionne = null;
  }
  construireInstances() {
    super.construireInstances();
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this._evenementTripleCombo,
      this._initialiserTripleCombo,
    );
    this.identFenetreMentions = this.add(
      ObjetFenetre_Mention,
      _evenementMentions.bind(this),
      _initialiserMentions,
    );
    this.identFenetreAssistantSaisie = this.add(
      ObjetFenetre_AssistantSaisie,
      _evntSurFenetreAssistantSaisie.bind(this),
      this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
    );
    this.identPiedPage = this.add(
      InterfacePiedBulletin,
      _evntSurPied.bind(this),
      this.initPied.bind(this),
    );
    this.construireFicheEleveEtFichePhoto();
  }
  initPied(aInstance) {
    aInstance.setOptions({ hauteurContenu: 300 });
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    this.AddSurZone = [
      this.identTripleCombo,
      { html: '<span ie-html="getInformationDatePublication"></span>' },
    ];
    if (GEtatUtilisateur.pourPrimaire()) {
      this.AddSurZone.push({
        html: '<span ie-html="getStrAccusesReception" ie-hint="getHintAccusesReception" class="MargeGauche"></span>',
      });
    }
    this.AddSurZone.push({
      html:
        '<span ie-if="btnCalculerTousLesPositionnements.estVisible">' +
        '<ie-bouton ie-model="btnCalculerTousLesPositionnements" class="' +
        TypeThemeBouton.primaire +
        ' MargeGauche small-bt">' +
        GTraductions.getValeur(
          "competences.CalculerLesPositionnementsDeMaClasse",
        ) +
        "</ie-bouton>" +
        "</span>",
    });
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
    this.addSurZonePhotoEleve();
    if (this.avecAssistantSaisie()) {
      this.AddSurZone.push({
        html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
          "btnAssistantSaisie",
        ),
      });
    }
    this.AddSurZone.push({ blocDroit: true });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getInformationDatePublication: function () {
        return aInstance.donnees.strInfoDatePublication || "";
      },
      btnAssistantSaisie: {
        event() {
          _evntSurAssistant.call(aInstance);
        },
        getTitle() {
          return aInstance.moteurAssSaisie.getTitleBoutonAssistantSaisie();
        },
        getSelection() {
          return GEtatUtilisateur.assistantSaisieActif;
        },
      },
      getHintAccusesReception: function () {
        let lStrHint = "";
        if (
          !!aInstance.donnees.listeAccusesReception &&
          aInstance.donnees.listeAccusesReception.count() > 1
        ) {
          const lArrHint = [];
          aInstance.donnees.listeAccusesReception.parcourir((aResponsable) => {
            if (!!aResponsable && aResponsable.aPrisConnaissance) {
              lArrHint.push(" - " + aResponsable.getLibelle());
            }
          });
          lStrHint = lArrHint.join("<br/>");
        }
        return lStrHint;
      },
      getStrAccusesReception: function () {
        const lStrAccusesReception = [];
        if (!aInstance.estPourClasse()) {
          const lInfosAR =
            UtilitaireBulletin.getInfosTypeAccuseReceptionBulletinEleve(
              aInstance.donnees.listeAccusesReception,
            );
          lStrAccusesReception.push(
            '<i style="color: ',
            lInfosAR.couleurIcone,
            ';" class="',
            lInfosAR.nomIcone,
            ' AlignementMilieuVertical"></i><span class="AlignementMilieuVertical EspaceGauche">',
            lInfosAR.libelle,
            "</span>",
          );
        }
        return lStrAccusesReception.join("");
      },
      btnCalculerTousLesPositionnements: {
        event: function () {
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
            avecChoixPreferencesCalcul: true,
          };
          TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
            lParamsCalculAuto,
          );
        },
        estVisible: function () {
          return (
            aInstance.estPourClasse() &&
            !!aInstance.donnees.avecBtnCalculPositionnementClasse
          );
        },
      },
    });
  }
  estPourClasse() {
    const lEleve = this.getEleve();
    return !lEleve || !lEleve.existeNumero();
  }
  _getParametresPDF() {
    return {
      genreGenerationPDF: TypeHttpGenerationPDFSco.BulletinDeCompetences,
      classe: this.getClasse(),
      periode: this.getPeriode(),
      eleve: this.getEleve(),
      avecChoixGraphe: true,
      avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
    };
  }
  estJaugeCliquable() {
    const lEleve = this.getEleve();
    return !!lEleve && lEleve.existeNumero();
  }
  surApresEditionListe(aParametres) {
    const lArticle = aParametres.article;
    switch (aParametres.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.note:
        if (
          lArticle.posLSUNoteModif.getNote() !== lArticle.posLSUNote.getNote()
        ) {
          this.moteur.saisieNoteLSU({
            paramRequete: {
              classe: this.getClasse(),
              periode: this.getPeriode(),
              eleve: this.getEleve(),
              service: lArticle,
              posLSUNote: lArticle.posLSUNoteModif,
            },
            instanceListe: this.getInstance(this.identListe),
            clbckSucces: function (aParamSucces) {
              const lDonneesListe = this.getInstance(
                this.identListe,
              ).getListeArticles();
              const lLignes = lDonneesListe.getListeElements((aLigne) => {
                return aLigne.getNumero() === aParamSucces.numeroService;
              });
              const lLigne = lLignes.get(0);
              lLigne.posLSUNote = aParamSucces.noteLSUSaisie;
            }.bind(this),
            paramCellSuivante: { orientationVerticale: true },
            clbckEchec: function (aPromiseMsg) {
              _actualiserSurErreurSaisie.call(this, {
                liste: this.getInstance(this.identListe),
                promiseMsg: aPromiseMsg,
              });
            }.bind(this),
          });
        }
        break;
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      case DonneesListe_BulletinCompetences.colonnes.appreciationC:
        _surEvntSaisieAppreciation.call(this, {
          estCtxPiedBulletin: false,
          article: lArticle,
          idColonne: aParametres.idColonne,
          instanceListe: this.getInstance(this.identListe),
          suivante: { suivante: { orientationVerticale: true } },
        });
        break;
    }
  }
  surEditionListe(aParametres) {
    switch (aParametres.idColonne) {
      case DonneesListe_BulletinCompetences.colonnes.niveauAcqComp: {
        const lLigne = aParametres.article;
        const lInstanceListe = this.getInstance(this.identListe);
        this.moteur.ouvrirMenuPositionnement({
          id: lInstanceListe.getIdCellule(
            aParametres.colonne,
            aParametres.ligne,
          ),
          instance: this,
          genreChoixValidationCompetence:
            TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          clbackMenuPositionnement: function (aNiveauDAcquisition) {
            if (
              aNiveauDAcquisition &&
              (!lLigne.niveauAcqComp ||
                lLigne.niveauAcqComp.getNumero() !==
                  aNiveauDAcquisition.getNumero())
            ) {
              this.moteur.saisiePositionnement({
                paramRequete: {
                  estPourElementCompetence: true,
                  eltCompetence: lLigne.elementCompetence,
                  positionnement: aNiveauDAcquisition,
                  classe: this.getClasse(),
                  periode: this.getPeriode(),
                  eleve: this.getEleve(),
                  service: lLigne,
                },
                instanceListe: lInstanceListe,
                clbckSucces: function () {
                  lLigne.niveauAcqComp = aNiveauDAcquisition;
                },
                clbckEchec: function (aPromiseMsg) {
                  _actualiserSurErreurSaisie.call(this, {
                    liste: lInstanceListe,
                    promiseMsg: aPromiseMsg,
                  });
                }.bind(this),
              });
            }
          }.bind(this),
        });
        break;
      }
      case DonneesListe_BulletinCompetences.colonnes.posLSU: {
        const lLigne = aParametres.article;
        const lInstanceListe = this.getInstance(this.identListe);
        this.moteur.ouvrirMenuPositionnement({
          id: lInstanceListe.getIdCellule(
            aParametres.colonne,
            aParametres.ligne,
          ),
          instance: this,
          genreChoixValidationCompetence:
            TypeGenreValidationCompetence.tGVC_Competence,
          genrePositionnement: this.donnees.typePositionnementSansNote,
          clbackMenuPositionnement: function (aNiveauDAcquisition) {
            if (
              aNiveauDAcquisition &&
              (!lLigne.posLSUNiveau ||
                lLigne.posLSUNiveau.getNumero() !==
                  aNiveauDAcquisition.getNumero())
            ) {
              this.moteur.saisiePositionnement({
                paramRequete: {
                  estPourElementCompetence: false,
                  positionnement: aNiveauDAcquisition,
                  classe: this.getClasse(),
                  periode: this.getPeriode(),
                  eleve: this.getEleve(),
                  service: lLigne,
                },
                instanceListe: lInstanceListe,
                clbckSucces: function (aParamSucces) {
                  lLigne.posLSUNiveau = aParamSucces.niveauAcquSaisi;
                  if (!!lLigne.posLSUNiveau) {
                    const posLSUNiveauGlobal =
                      GParametres.listeNiveauxDAcquisitions.getElementParGenre(
                        lLigne.posLSUNiveau.getGenre(),
                      );
                    Object.assign(lLigne.posLSUNiveau, posLSUNiveauGlobal);
                  }
                }.bind(this),
                paramCellSuivante: { orientationVerticale: true },
                clbckEchec: function (aPromiseMsg) {
                  _actualiserSurErreurSaisie.call(this, {
                    liste: lInstanceListe,
                    promiseMsg: aPromiseMsg,
                  });
                }.bind(this),
              });
            }
          }.bind(this),
        });
        break;
      }
      case DonneesListe_BulletinCompetences.colonnes.elementsProgramme:
        surEditionElementsProgramme.call(this, aParametres.article);
        break;
      case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      case DonneesListe_BulletinCompetences.colonnes.appreciationC: {
        const lRang = this.estPourClasse()
          ? this.donnees.rangAppreciation.appA
          : _getRangDIdColonne.call(this, aParametres.idColonne);
        this.objCelluleAppreciation = $.extend(
          {
            article: aParametres.article,
            genreAppr: lRang,
            idColonne: aParametres.idColonne,
          },
          { ctxPiedBulletin: false },
        );
        let lTabTypeAppreciation;
        let lRangAppreciationSaisie;
        if (this.estPourClasse()) {
          lTabTypeAppreciation = ETypeAppreciationUtil.getTypeAppreciation(
            GEtatUtilisateur.getGenreOnglet(),
            null,
            false,
          );
          lRangAppreciationSaisie = lRang;
        } else {
          lTabTypeAppreciation = [lRang - 1];
          lRangAppreciationSaisie = lRang;
        }
        _ouvreFenetreAssistantSaisie.call(this, {
          tabTypeAppreciation: lTabTypeAppreciation,
          rangAppreciationSaisie: lRangAppreciationSaisie,
          tailleMaxAppreciation: this.getTailleMaxAppreciationBulletin(),
        });
        break;
      }
      default:
        if (
          DonneesListe_BulletinCompetences.estUneColonneTransversale(
            aParametres.idColonne,
          )
        ) {
          const lObjElementColonne =
            DonneesListe_BulletinCompetences.getObjetElementColonneTransversale(
              aParametres.article,
              aParametres,
            );
          surEditionColonneTransversale.call(this, {
            service: aParametres.article,
            eltCol: lObjElementColonne,
            col: aParametres.colonne,
            ligne: aParametres.ligne,
          });
        }
        break;
    }
  }
  getParametresPiedPageEleve() {
    return {
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
      typeContexteBulletin: TypeContexteBulletin.CB_Eleve,
      avecSaisie: true,
      avecValidationAuto: true,
      clbckValidationAutoSurEdition: _clbckValidationAutoSurEdition.bind(this),
    };
  }
  getEleve() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
  }
  getClasse() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
  }
  getPeriode() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
  }
  saisieAppreciation(aParam, aParamRequete) {
    const lParam = {
      instanceListe: aParam.instanceListe,
      paramRequete: aParamRequete,
      paramCellSuivante:
        aParam.suivante !== null && aParam.suivante !== undefined
          ? aParam.suivante
          : { orientationVerticale: true },
      clbckEchec: function (aPromiseMsg) {
        _actualiserSurErreurSaisie.call(this, {
          liste: aParam.instanceListe,
          promiseMsg: aPromiseMsg,
        });
      }.bind(this),
    };
    if (aParam.estCtxPied) {
      $.extend(lParam, {
        clbckSucces: function (aParamSucces) {
          this.moteurPdB.majAppreciationPdB(
            $.extend(aParamSucces, { instanceListe: lParam.instanceListe }),
          );
        }.bind(this),
      });
    } else {
      $.extend(lParam, {
        clbckSucces: function (aParamSucces) {
          const lService = this.donnees.listeLignes.getElementParNumero(
            aParamSucces.numeroService,
          );
          const lCol = _getIdColonneDeRang.call(this, aParamSucces.rangAppr);
          _setStrApprDeCol.call(
            this,
            lService,
            lCol,
            aParamSucces.apprSaisie.getLibelle(),
          );
        }.bind(this),
      });
    }
    this.moteur.saisieAppreciation(lParam);
  }
  getParametresPiedPageClasse() {
    return {
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
      typeContexteBulletin: TypeContexteBulletin.CB_Classe,
      avecSaisie: true,
      avecValidationAuto: true,
      clbckValidationAutoSurEdition: _clbckValidationAutoSurEdition.bind(this),
    };
  }
  validerSaisieBulletin(aCallbackSurValidation) {
    const lPiedPage = this.getInstance(this.identPiedPage).getDonneesSaisie();
    if (!aCallbackSurValidation) {
      aCallbackSurValidation = this.actionSurValidation;
    }
    const lParamsSaisie = {
      listeServices: this.donnees.listeLignes,
      rangAppreciation: this.donnees.rangAppreciation,
      listeAppreciationsAssistSaisie: this.listeTypesAppreciations,
    };
    if (!!lPiedPage) {
      lParamsSaisie.listeConseils =
        lPiedPage.appreciations.listeConseilDeClasse;
      lParamsSaisie.listeCommentaires =
        lPiedPage.appreciations.listeCommentaires;
      lParamsSaisie.listeCpe = lPiedPage.appreciations.listeCPE;
      lParamsSaisie.parcoursEducatif = lPiedPage.parcoursEducatif;
      lParamsSaisie.competences = lPiedPage.competences;
      lParamsSaisie.listeAttestations = lPiedPage.certificats
        ? lPiedPage.certificats.listeAttestationsEleve
        : null;
    }
    new ObjetRequeteSaisieBulletinCompetences(
      this,
      aCallbackSurValidation,
    ).lancerRequete(lParamsSaisie);
  }
  avecAssistantSaisie() {
    return this.moteurAssSaisie.avecAssistantSaisie({
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
    });
  }
  getTailleMaxAppreciationBulletin() {
    let typeGenreAppreciation;
    if (this.estPourClasse()) {
      typeGenreAppreciation = TypeGenreAppreciation.GA_Bulletin_Professeur;
    } else {
      typeGenreAppreciation = TypeGenreAppreciation.GA_Bulletin_Professeur;
    }
    return GParametres.getTailleMaxAppreciationParEnumere(
      typeGenreAppreciation,
    );
  }
  evenementFenetreDetailEvaluations(
    aNumeroBouton,
    aElementsCompetenceModifies,
  ) {
    if (
      !!aElementsCompetenceModifies &&
      aElementsCompetenceModifies.count() > 0
    ) {
      const lThis = this;
      const lParamsRequetes = {
        eleve: this.getEleve(),
        listeElementsCompetences: aElementsCompetenceModifies,
      };
      new ObjetRequeteSaisieDetailEvaluationsCompetences(this, () => {
        if (lThis.getEtatSaisie()) {
          lThis.validerSaisieBulletin();
        } else {
          lThis.actionSurValidation();
        }
      }).lancerRequete(lParamsRequetes);
    }
  }
  _initialiserTripleCombo(aInstance) {
    aInstance.setParametres(
      [EGenreRessource.Classe, EGenreRessource.Periode, EGenreRessource.Eleve],
      false,
    );
  }
  _evenementTripleCombo() {
    this._evenementDernierMenuDeroulant();
    this.surSelectionEleve();
  }
  _evenementDernierMenuDeroulant() {
    super._evenementDernierMenuDeroulant();
  }
  getListeTypesAppreciations() {
    this.moteurAssSaisie.getListeTypesAppreciations({
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
      clbck: function (aListeTypesAppreciations) {
        this.listeTypesAppreciations = aListeTypesAppreciations;
      }.bind(this),
    });
  }
  afficherPage() {
    this._evenementDernierMenuDeroulant();
  }
  valider() {
    this.validerSaisieBulletin();
  }
}
function _clbckValidationAutoSurEdition(aParam) {
  _surEvntSaisieAppreciation.call(this, {
    estCtxPiedBulletin: true,
    appreciation: aParam.appreciation,
    instanceListe: aParam.instanceListe,
  });
}
function surEditionElementsProgramme(aService) {
  const lThis = this;
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ElementsProgramme, {
    pere: this,
    evenement: function (aValider, aDonnees) {
      this.palierElementTravailleSelectionne = aDonnees.palierActif;
      if (aValider) {
        _evenementFenetreElementsProgramme.call(
          lThis,
          aService,
          aDonnees.listeElementsProgramme,
        );
      }
    },
  }).setDonnees({
    service: aService,
    periode: this.getPeriode(),
    listeElementsProgramme:
      aService.listeEltProgramme || new ObjetListeElements(),
    palier: this.palierElementTravailleSelectionne,
  });
}
function _evenementFenetreElementsProgramme(aService, aListeSelection) {
  aService.listeEltProgramme = aListeSelection;
  aService.listeEltProgramme.trier();
  this.moteur.saisieEltsPgme({
    paramRequete: {
      classeGroupe: this.getClasse(),
      periode: this.getPeriode(),
      service: aService,
      listeEltsPgme: aService.listeEltProgramme,
    },
    instanceListe: this.getInstance(this.identListe),
    clbckSucces: function (aParamSucces) {
      const lDonneesListe = this.getInstance(
        this.identListe,
      ).getListeArticles();
      const lLignes = lDonneesListe.getListeElements((aLigne) => {
        return aLigne.getNumero() === aParamSucces.numeroService;
      });
      const lService = lLignes.get(0);
      if (lService !== null) {
        lService.listeEltProgramme = aParamSucces.listeEltsPgme;
      }
      majStrEltPgme.call(this, { service: lService });
    }.bind(this),
    paramCellSuivante: { orientationVerticale: true },
    clbckEchec: function (aPromiseMsg) {
      _actualiserSurErreurSaisie.call(this, {
        liste: this.getInstance(this.identListe),
        promiseMsg: aPromiseMsg,
      });
    }.bind(this),
  });
}
function majStrEltPgme(aParam) {
  const lService = aParam.service;
  lService.strEltProg = "";
  const lHintEltProgramme = [];
  if (lService.listeEltProgramme.count() > 0) {
    lHintEltProgramme.push("<ul>");
    lService.listeEltProgramme.parcourir((D) => {
      lHintEltProgramme.push("<li>", D.getLibelle(), "</li>");
    });
    lHintEltProgramme.push("</ul>");
  }
  lService.hintEltProg = lHintEltProgramme.join("");
  let lStrEltProgramme = "";
  if (lService.listeEltProgramme.count() > 2) {
    lStrEltProgramme =
      '<div style="padding-left:8px;">' +
      GTraductions.getValeur("BulletinEtReleve.ElementsProgramme", [
        lService.listeEltProgramme.count(),
      ]) +
      "</div>";
  } else {
    lStrEltProgramme = lService.hintEltProg;
  }
  lService.strEltProg = lStrEltProgramme;
}
function surEditionColonneTransversale(aParam) {
  const lInstanceListe = this.getInstance(this.identListe);
  this.moteur.ouvrirMenuPositionnement({
    id: lInstanceListe.getIdCellule(aParam.col, aParam.ligne),
    instance: this,
    genreChoixValidationCompetence:
      TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
    avecSelecteurNiveauCalcule: true,
    clbackMenuPositionnement: function (aNiveauDAcquisition) {
      if (aNiveauDAcquisition) {
        const lEstCasNiveauCalcule =
          aNiveauDAcquisition.getGenre() === undefined;
        aParam.eltCol.niveauAcqui = lEstCasNiveauCalcule
          ? undefined
          : aNiveauDAcquisition;
        this.moteur.saisiePositionnement({
          paramRequete: {
            estPourElementCompetence: true,
            eltCompetence: aParam.eltCol,
            estCalcule: lEstCasNiveauCalcule,
            positionnement: aParam.eltCol.niveauAcqui,
            classe: this.getClasse(),
            periode: this.getPeriode(),
            eleve: this.getEleve(),
            service: aParam.service,
          },
          instanceListe: lInstanceListe,
          clbckSucces: function (aParamSucces) {
            const lDonneesListe = lInstanceListe.getListeArticles();
            const lLignes = lDonneesListe.getListeElements((aLigne) => {
              return aLigne.getNumero() === aParamSucces.numeroService;
            });
            const lLigne = lLignes.get(0);
            const lElt = lLigne.listeColonnesTransv.getElementParNumero(
              aParamSucces.numeroEltCompetence,
            );
            lElt.niveauAcqui = aParamSucces.niveauAcquSaisi;
            if (lElt.niveauAcqui !== null && lElt.niveauAcqui !== undefined) {
              const posLSUNiveauGlobal =
                GParametres.listeNiveauxDAcquisitions.getElementParGenre(
                  lElt.niveauAcqui.getGenre(),
                );
              Object.assign(lElt.niveauAcqui, posLSUNiveauGlobal);
            }
            calculerPourcentageAcquis.call(this, { service: lLigne });
          }.bind(this),
          paramCellSuivante: { orientationVerticale: false },
          clbckEchec: function (aPromiseMsg) {
            _actualiserSurErreurSaisie.call(this, {
              liste: lInstanceListe,
              promiseMsg: aPromiseMsg,
            });
          }.bind(this),
        });
      }
    }.bind(this),
  });
}
function calculerPourcentageAcquis(aParam) {
  const lService = aParam.service;
  let lNbNiveauxAcquis = 0,
    lNbNiveauxTotal = 0;
  lService.listeColonnesTransv.parcourir((D) => {
    let lNiveauATester;
    if (!!D.niveauAcqui) {
      lNiveauATester = D.niveauAcqui;
    } else if (!!D.niveauAcquiCalc) {
      lNiveauATester = D.niveauAcquiCalc;
    }
    if (
      !!lNiveauATester &&
      TUtilitaireCompetences.estNotantPourTxReussiteEvaluation(lNiveauATester)
    ) {
      lNbNiveauxTotal++;
      if (TUtilitaireCompetences.estNiveauAcqui(lNiveauATester)) {
        lNbNiveauxAcquis++;
      }
    }
  });
  lService.pourcentage =
    lNbNiveauxTotal === 0
      ? ""
      : (Math.round(((lNbNiveauxAcquis * 100) / lNbNiveauxTotal) * 10) / 10)
          .toString()
          .replace(".", ",");
}
function _initialiserMentions(aInstance) {
  aInstance.setParametresMention(
    GTraductions.getValeur("Appreciations.Mentions"),
  );
  aInstance.setOptionsFenetre({
    titre: GTraductions.getValeur("Appreciations.SaisieMentions"),
    largeur: 300,
    hauteur: 300,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
}
function _evenementMentions(aGenreBouton) {
  if (!!this.donnees.objCelluleAppreciation) {
    if (
      aGenreBouton === 1 &&
      !!this.donnees.objCelluleAppreciation.appreciation
    ) {
      const lObjElementMention = this.getInstance(
        this.identFenetreMentions,
      ).getMentionSelectionnee();
      if (!!lObjElementMention) {
        if (lObjElementMention.existeNumero()) {
          this.donnees.objCelluleAppreciation.appreciation.setEtat(
            EGenreEtat.Modification,
          );
          this.donnees.objCelluleAppreciation.appreciation.Libelle =
            lObjElementMention.getLibelle();
        } else {
          this.donnees.objCelluleAppreciation.appreciation.setEtat(
            EGenreEtat.Suppression,
          );
          this.donnees.objCelluleAppreciation.appreciation.Libelle = "";
        }
        this.donnees.objCelluleAppreciation.appreciation.setNumero(
          lObjElementMention.getNumero(),
        );
        this.donnees.objCelluleAppreciation.instance.setLibelleCellule({
          coordCell: this.donnees.objCelluleAppreciation.coordCellule,
          libelle:
            this.donnees.objCelluleAppreciation.appreciation.getLibelle(),
        });
        this.setEtatSaisie(true);
      }
    }
    this.donnees.objCelluleAppreciation.instance.deselectionnerLigne();
    this.donnees.objCelluleAppreciation = undefined;
  }
}
function _ouvreFenetreAssistantSaisie(aParametres) {
  this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
    instanceFenetreAssistantSaisie: this.getInstance(
      this.identFenetreAssistantSaisie,
    ),
    listeTypesAppreciations: this.listeTypesAppreciations,
    tabTypeAppreciation: aParametres.tabTypeAppreciation,
    tailleMaxAppreciation: aParametres.tailleMaxAppreciation,
    rangAppreciations: aParametres.rangAppreciationSaisie,
    avecEtatSaisie: false,
  });
}
function _evntSurAssistant() {
  this.moteurAssSaisie.evntBtnAssistant({
    instanceListe: this.getInstance(this.identListe),
    instancePied: this.getInstance(this.identPiedPage),
  });
}
function _evntSurFenetreAssistantSaisie(aNumeroBouton) {
  const lThis = this;
  const lParam = {
    instanceFenetreAssistantSaisie: this.getInstance(
      this.identFenetreAssistantSaisie,
    ),
    eventChangementUtiliserAssSaisie: function () {
      lThis.getInstance(lThis.identListe).actualiser(true);
      const lInstancePied = lThis.getInstance(lThis.identPiedPage);
      if (lInstancePied && lInstancePied.evenementSurAssistant) {
        lInstancePied.evenementSurAssistant();
      }
    },
    evntClbck: surEvntAssSaisie.bind(this),
  };
  this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
}
function _validerAppreciation(aParam, aParamSaisie) {
  const lContexte = aParamSaisie.contexte;
  const lEstCtxPiedBulletin = aParamSaisie.estCtxPiedBulletin;
  const lListe = aParamSaisie.liste;
  const lParamSuivante = { orientationVerticale: true };
  const lArticle = lContexte.article;
  if (aParam.eltSelectionne && aParam.eltSelectionne.existeNumero()) {
    if (lEstCtxPiedBulletin) {
      this.moteurAssSaisie.validerDonneesSurValider({
        article: lArticle,
        appreciation: lContexte.appreciation,
        eltSelectionne: aParam.eltSelectionne,
      });
    } else {
      _setStrApprDeCol.call(
        this,
        lArticle,
        lContexte.idColonne,
        aParam.eltSelectionne.getLibelle(),
      );
    }
  }
  const lParamSaisie = {
    estCtxPiedBulletin: lEstCtxPiedBulletin,
    instanceListe: lListe,
    suivante: lParamSuivante,
  };
  if (lEstCtxPiedBulletin) {
    $.extend(lParamSaisie, { appreciation: lContexte.appreciation });
  } else {
    $.extend(lParamSaisie, {
      article: lArticle,
      idColonne: lContexte.idColonne,
    });
  }
  _surEvntSaisieAppreciation.call(this, lParamSaisie);
}
function surEvntAssSaisie(aParam) {
  const lContexte = this.objCelluleAppreciation;
  const lEstCtxPiedBulletin =
    lContexte !== null && lContexte !== undefined && lContexte.ctxPiedBulletin;
  const lListe = lEstCtxPiedBulletin
    ? lContexte.instanceListe
    : this.getInstance(this.identListe);
  if (lListe !== null && lListe !== undefined) {
    let lClbck;
    switch (aParam.cmd) {
      case EBoutonFenetreAssistantSaisie.Valider:
        lClbck = function () {
          _validerAppreciation.call(this, aParam, {
            contexte: lContexte,
            estCtxPiedBulletin: lEstCtxPiedBulletin,
            liste: lListe,
          });
        }.bind(this);
        break;
      case EBoutonFenetreAssistantSaisie.PasserEnSaisie: {
        lClbck = function () {
          const lParam = {
            instanceListe: lListe,
            idColonne: lContexte.idColonne,
          };
          this.moteurAssSaisie.passerEnSaisie(lParam);
        }.bind(this);
        break;
      }
      case EBoutonFenetreAssistantSaisie.Fermer:
        lClbck = null;
        break;
      default:
    }
    this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
      estAssistantModifie: aParam.estAssistantModifie,
      pere: this,
      clbck: lClbck,
    });
  }
}
function _surEvntSaisieAppreciation(aParam) {
  const lEstCtxPiedBulletin = aParam.estCtxPiedBulletin;
  const lArticle = aParam.article;
  const lService = lEstCtxPiedBulletin ? null : lArticle;
  const lParamSaisie = {
    classe: this.getClasse(),
    periode: this.getPeriode(),
    eleve: this.getEleve(),
    service: lService,
    saisieSurRegroupement: this.donnees.avecAppreciationsSurRegroupement,
  };
  if (lEstCtxPiedBulletin) {
    const lAppr = aParam.appreciation;
    $.extend(lParamSaisie, {
      appreciation: lAppr,
      typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
        estCtxPied: lEstCtxPiedBulletin,
        eleve: this.getEleve(),
        typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
        appreciation: lAppr,
      }),
    });
  } else {
    const lStrAppr = _getStrApprDeCol.call(this, lArticle, aParam.idColonne);
    const lRangAppr = _getRangDIdColonne.call(this, aParam.idColonne);
    $.extend(lParamSaisie, {
      genreAppr: lRangAppr,
      strAppr: lStrAppr,
      typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
        estCtxPied: lEstCtxPiedBulletin,
        eleve: this.getEleve(),
        typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
        genreAppr: lRangAppr,
      }),
    });
  }
  this.saisieAppreciation(
    {
      instanceListe: aParam.instanceListe,
      estCtxPied: lEstCtxPiedBulletin,
      suivante: aParam.suivante,
    },
    lParamSaisie,
  );
}
function _getStrApprDeCol(D, aCol) {
  switch (aCol) {
    case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      return D.appreciationA;
    case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      return D.appreciationB;
    case DonneesListe_BulletinCompetences.colonnes.appreciationC:
      return D.appreciationC;
  }
  return null;
}
function _setStrApprDeCol(D, aCol, aStr) {
  switch (aCol) {
    case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      D.appreciationA = aStr;
      break;
    case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      D.appreciationB = aStr;
      break;
    case DonneesListe_BulletinCompetences.colonnes.appreciationC:
      D.appreciationC = aStr;
      break;
  }
}
function _getRangDIdColonne(aIdCol) {
  switch (aIdCol) {
    case DonneesListe_BulletinCompetences.colonnes.appreciationA:
      return this.donnees.rangAppreciation.appA;
    case DonneesListe_BulletinCompetences.colonnes.appreciationB:
      return this.donnees.rangAppreciation.appB;
    case DonneesListe_BulletinCompetences.colonnes.appreciationC:
      return this.donnees.rangAppreciation.appC;
    default:
      return null;
  }
}
function _getIdColonneDeRang(aRangAppreciation) {
  if (aRangAppreciation === this.donnees.rangAppreciation.appA) {
    return DonneesListe_BulletinCompetences.colonnes.appreciationA;
  } else if (aRangAppreciation === this.donnees.rangAppreciation.appB) {
    return DonneesListe_BulletinCompetences.colonnes.appreciationB;
  } else if (aRangAppreciation === this.donnees.rangAppreciation.appC) {
    return DonneesListe_BulletinCompetences.colonnes.appreciationC;
  }
  return null;
}
function _evntSurPied(aParam) {
  this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
  _ouvreFenetreAssistantSaisie.call(this, {
    tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
      GEtatUtilisateur.getGenreOnglet(),
      aParam.appreciation,
      true,
    ),
    tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
      estCtxPied: true,
      appreciation: aParam.appreciation,
      typeReleveBulletin: TypeReleveBulletin.BulletinCompetences,
    }),
  });
}
function _actualiserSurErreurSaisie(aParam) {
  const lSelection = aParam.liste.getSelectionCellule();
  this.afficherPage();
  if (aParam.promiseMsg !== null && aParam.promiseMsg !== undefined) {
    aParam.promiseMsg.then(() => {
      if (lSelection !== null && lSelection !== undefined) {
        aParam.liste.selectionnerCellule({
          ligne: lSelection.ligne,
          colonne: lSelection.colonne,
          avecScroll: true,
        });
      }
    });
  }
}
module.exports = InterfaceBulletinCompetences_Saisie;
