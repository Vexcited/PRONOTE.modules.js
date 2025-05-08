const { _InterfaceBulletinNotes } = require("_InterfaceBulletinNotes.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_BulletinNotes } = require("DonneesListe_BulletinNotes.js");
const {
  ObjetFenetre_ElementsProgramme,
} = require("ObjetFenetre_ElementsProgramme.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { DonneesListe_Simple } = require("DonneesListe_Simple.js");
const {
  ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const {
  EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
class InterfaceBulletinNotes extends _InterfaceBulletinNotes {
  constructor(aNom, aIdent, aPere, aEvenement) {
    const lParam = {
      avecSaisie: true,
      avecInfosEleve: true,
      avecDocsATelecharger: false,
      avecGraphe: true,
    };
    super(aNom, aIdent, aPere, aEvenement, lParam);
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
    this.moteurGrille = new ObjetMoteurGrilleSaisie();
    this.palierElementTravailleSelectionne = null;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getInformationDatePublication: function () {
        return aInstance.strInfoDatePublication || "";
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
    });
  }
  addSurZoneFichesEleve() {
    this.addSurZoneFicheEleve();
    this.addSurZonePhotoEleve();
  }
  addSurZoneDatePublicationBulletin() {
    this.AddSurZone.push({
      html: '<span ie-html="getInformationDatePublication"></span>',
    });
  }
  afficherPage() {
    if (this.param.avecSaisie) {
      this.getListeTypesAppreciations();
    }
    const lEstContexteEleve = this.estCtxEleve();
    const lTypeCtxBull = this.moteurPdB.getContexteBulletin({
      estCtxEleve: lEstContexteEleve,
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
    });
    this.initPiedPage({ typeContexteBulletin: lTypeCtxBull });
    const lParam = {
      eleve: this.getEleve(),
      classe: this.getClasse(),
      periode: this.getPeriode(),
    };
    this.envoyerRequeteBulletin(lParam);
  }
  instancierCombos() {
    return this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evntSurDernierMenuDeroulant.bind(this),
      _initTripleCombo.bind(this),
    );
  }
  instancierBulletin() {
    return this.add(ObjetListe, _evntSurListe.bind(this));
  }
  getListeTypesAppreciations() {
    this.moteurAssSaisie.getListeTypesAppreciations({
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
      clbck: function (aListeTypesAppreciations) {
        this.listeTypesAppreciations = aListeTypesAppreciations;
      }.bind(this),
    });
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
          const lService = this.listeElementsLineaire.getElementParNumero(
            aParamSucces.numeroService,
          );
          this.moteur.majAppreciationService(
            $.extend(aParamSucces, { service: lService }),
          );
        }.bind(this),
      });
    }
    return this.moteur.saisieAppreciation(lParam);
  }
  avecAssistantSaisie() {
    return this.moteurAssSaisie.avecAssistantSaisie({
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
    });
  }
  instancierAssistantSaisie() {
    if (this.avecAssistantSaisie()) {
      this.identFenetreAssistantSaisie = this.add(
        ObjetFenetre_AssistantSaisie,
        _evntSurFenetreAssistantSaisie.bind(this),
        this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
      );
    }
  }
  addSurZoneAssistantSaisie() {
    if (this.avecAssistantSaisie()) {
      this.AddSurZone.push({
        html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
          "btnAssistantSaisie",
        ),
      });
    }
  }
  instancierPiedBulletin() {
    return this.add(
      InterfacePiedBulletin,
      _evntSurPied.bind(this),
      this.initPied.bind(this),
    );
  }
  initPied(aInstance) {
    aInstance.setOptions({ hauteurContenu: 300 });
  }
  getListeAnnotationsPourAvisReligion() {
    if (this.listeAnnotations === null || this.listeAnnotations === undefined) {
      this.listeAnnotations = new ObjetListeElements();
    }
    const lEltAucun = new ObjetElement("", 0, null, 0);
    lEltAucun.description = GTraductions.getValeur("Aucun");
    this.listeAnnotations.insererElement(lEltAucun, 0);
  }
}
function _initTripleCombo(aInstance) {
  aInstance.setParametres([
    EGenreRessource.Classe,
    EGenreRessource.Periode,
    EGenreRessource.Eleve,
  ]);
}
function _evntSurDernierMenuDeroulant() {
  if (this.param.avecInfosEleve) {
    this.surSelectionEleve();
  }
  this.afficherPage();
  const lExisteEleve = this.estCtxEleve();
  if (this.param.avecInfosEleve) {
    this.activerFichesEleve(lExisteEleve);
  }
}
function _evntSurListe(aParametres) {
  const lArticle = aParametres.article;
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Edition:
      if (lArticle.Cloture) {
        GApplication.getMessage().afficher({
          type: EGenreBoiteMessage.Information,
          titre: GTraductions.getValeur("SaisieImpossible"),
          message: GTraductions.getValeur("PeriodeCloturee"),
        });
        return;
      }
      switch (aParametres.idColonne) {
        case DonneesListe_BulletinNotes.colonnes.elmtPgm:
          if (lArticle.elementsCloture === true) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Information,
              titre: GTraductions.getValeur("SaisieImpossible"),
              message: GTraductions.getValeur("PeriodeCloturee"),
            });
            return;
          } else {
            surEditionElementProgramme.call(this, lArticle);
          }
          break;
        case DonneesListe_BulletinNotes.colonnes.moyProposee:
        case DonneesListe_BulletinNotes.colonnes.moyDeliberee: {
          const lAvisReligion =
            aParametres.idColonne ===
            DonneesListe_BulletinNotes.colonnes.moyProposee
              ? lArticle.avisReligionPropose
              : lArticle.avisReligionDelibere;
          surEditionAvisReligion.call(this, {
            article: lArticle,
            idColonne: aParametres.idColonne,
            avisReligion: lAvisReligion,
            listeAvis: this.listeAnnotations,
          });
          break;
        }
        default:
          if (
            this.moteurGrille.estColVariable(
              aParametres.idColonne,
              DonneesListe_BulletinNotes.colonnes.appreciation,
            )
          ) {
            const lAppreciation = lArticle.ListeAppreciations.get(
              aParametres.declarationColonne.indice,
            );
            this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
              instanceFenetreAssistantSaisie: this.getInstance(
                this.identFenetreAssistantSaisie,
              ),
              listeTypesAppreciations: this.listeTypesAppreciations,
              tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
                GEtatUtilisateur.getGenreOnglet(),
                lAppreciation,
                false,
              ),
              avecEtatSaisie: false,
              tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
                estCtxPied: false,
                eleve: this.getEleve(),
                typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
              }),
            });
            this.objCelluleAppreciation = $.extend(
              {
                article: lArticle,
                appreciation: lAppreciation,
                idColonne: aParametres.idColonne,
              },
              { ctxPiedBulletin: false },
            );
          }
          break;
      }
      break;
    case EGenreEvenementListe.ApresEdition:
      switch (aParametres.idColonne) {
        case DonneesListe_BulletinNotes.colonnes.ects: {
          const lValeur = lArticle.ectsModifie;
          if (lValeur !== null) {
            _surValiderEditionDonnee.call(this, {
              avecModification: aParametres.avecModification,
              article: lArticle,
              idColonne: aParametres.idColonne,
              selection: lValeur,
              navigation: { suivante: { orientationVerticale: true } },
            });
          }
          break;
        }
        case DonneesListe_BulletinNotes.colonnes.moyProposee:
          if (
            lArticle.moyProposeeModifie &&
            lArticle.moyProposeeModifie.getNote() !==
              lArticle.moyenneProposee.getNote()
          ) {
            _surValiderEditionDonnee.call(this, {
              article: lArticle,
              idColonne: aParametres.idColonne,
              selection: lArticle.moyProposeeModifie,
              ctxAvisReligion: false,
              navigation: { suivante: { orientationVerticale: true } },
            });
          } else {
            this.moteurGrille.selectionCelluleSuivante({
              instanceListe: this.getInstance(this.identListe),
              suivante: { orientationVerticale: true },
            });
          }
          break;
        case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
          if (
            lArticle.moyDelibereeModifie &&
            lArticle.moyDelibereeModifie.getNote() !==
              lArticle.moyenneDeliberee.getNote()
          ) {
            _surValiderEditionDonnee.call(this, {
              article: lArticle,
              idColonne: aParametres.idColonne,
              selection: lArticle.moyDelibereeModifie,
              ctxAvisReligion: false,
              navigation: { suivante: { orientationVerticale: true } },
            });
          } else {
            this.moteurGrille.selectionCelluleSuivante({
              instanceListe: this.getInstance(this.identListe),
              suivante: { orientationVerticale: true },
            });
          }
          break;
        default:
          if (
            this.moteurGrille.estColVariable(
              aParametres.idColonne,
              DonneesListe_BulletinNotes.colonnes.appreciation,
            )
          ) {
            _surValiderEditionDonnee.call(this, {
              article: lArticle,
              idColonne: aParametres.idColonne,
              selection: null,
              navigation: { suivante: { orientationVerticale: true } },
            });
          }
          break;
      }
      break;
  }
}
function _surValiderEditionDonnee(aParam) {
  const lArticle = aParam.article;
  const lListe = aParam.instanceListe
    ? aParam.instanceListe
    : this.getInstance(this.identListe);
  let lPromise = null;
  if (aParam.avecModification !== false) {
    switch (aParam.idColonne) {
      case DonneesListe_BulletinNotes.colonnes.elmtPgm:
        lArticle.ElementsProgrammeBulletin = aParam.selection;
        lArticle.ElementsProgrammeBulletin.trier();
        break;
      case DonneesListe_BulletinNotes.colonnes.moyProposee:
        if (aParam.ctxAvisReligion === true) {
          lArticle.avisReligionPropose = aParam.selection;
          lArticle.avisReligionPropose.setEtat(EGenreEtat.Modification);
        } else {
          lArticle.moyenneProposee = aParam.selection;
        }
        break;
      case DonneesListe_BulletinNotes.colonnes.moyDeliberee:
        if (aParam.ctxAvisReligion === true) {
          lArticle.avisReligionDelibere = aParam.selection;
          lArticle.avisReligionDelibere.setEtat(EGenreEtat.Modification);
        } else {
          lArticle.moyenneDeliberee = aParam.selection;
        }
        break;
      case DonneesListe_BulletinNotes.colonnes.ects:
        lArticle.ECTS = aParam.selection;
        break;
      default:
        if (
          this.moteurGrille.estColVariable(
            aParam.idColonne,
            DonneesListe_BulletinNotes.colonnes.appreciation,
          )
        ) {
          if (
            this.moteurAssSaisie.avecAssistantSaisieActif({
              typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
            })
          ) {
            this.moteurAssSaisie.validerDonneesSurValider({
              article: lArticle,
              appreciation: aParam.appreciation,
              eltSelectionne: aParam.selection,
            });
          }
        }
        break;
    }
    lArticle.setEtat(EGenreEtat.Modification);
    switch (aParam.idColonne) {
      case DonneesListe_BulletinNotes.colonnes.elmtPgm:
        this.moteur.saisieEltsPgme({
          paramRequete: {
            classeGroupe: this.getClasse(),
            periode: this.getPeriode(),
            service: lArticle,
            listeEltsPgme: lArticle.ElementsProgrammeBulletin,
          },
          instanceListe: lListe,
          clbckSucces: function (aParamSucces) {
            const lService = this.listeElementsLineaire.getElementParNumero(
              aParamSucces.numeroService,
            );
            if (lService !== null) {
              lService.ElementsProgrammeBulletin = aParamSucces.listeEltsPgme;
            }
          }.bind(this),
          paramCellSuivante: aParam.navigation.suivante,
          clbckEchec: function (aPromiseMsg) {
            _actualiserSurErreurSaisie.call(this, {
              liste: lListe,
              promiseMsg: aPromiseMsg,
            });
          }.bind(this),
        });
        break;
      case DonneesListe_BulletinNotes.colonnes.ects:
        this.moteur.saisieECTS({
          paramRequete: {
            estCalculAuto: false,
            classe: this.getClasse(),
            periode: this.getPeriode(),
            eleve: this.getEleve(),
            service: lArticle,
            ECTS: lArticle.ECTS,
          },
          instanceListe: lListe,
          clbckSucces: function (aParamSucces) {
            const lService = this.listeElementsLineaire.getElementParNumero(
              aParamSucces.numeroService,
            );
            if (lService !== null) {
              lService.ECTS = aParamSucces.ECTSSaisie;
            }
          }.bind(this),
          paramCellSuivante: aParam.navigation.suivante,
          clbckEchec: function (aPromiseMsg) {
            _actualiserSurErreurSaisie.call(this, {
              liste: lListe,
              promiseMsg: aPromiseMsg,
            });
          }.bind(this),
        });
        break;
      case DonneesListe_BulletinNotes.colonnes.moyProposee:
      case DonneesListe_BulletinNotes.colonnes.moyDeliberee: {
        const lParamRequete = {
          classe: this.getClasse(),
          periode: this.getPeriode(),
          eleve: this.getEleve(),
          service: lArticle,
          estAvisReligion: aParam.ctxAvisReligion === true,
          estProposee:
            aParam.idColonne ===
            DonneesListe_BulletinNotes.colonnes.moyProposee,
        };
        if (
          aParam.idColonne === DonneesListe_BulletinNotes.colonnes.moyProposee
        ) {
          if (aParam.ctxAvisReligion === true) {
            $.extend(lParamRequete, {
              avisReligionPropose: lArticle.avisReligionPropose,
            });
          } else {
            $.extend(lParamRequete, {
              moyenneProposee: lArticle.moyenneProposee,
            });
          }
        } else {
          if (aParam.ctxAvisReligion === true) {
            $.extend(lParamRequete, {
              avisReligionDelibere: lArticle.avisReligionDelibere,
            });
          } else {
            $.extend(lParamRequete, {
              moyenneProposee: lArticle.moyenneProposee,
              moyenneDeliberee: lArticle.moyenneDeliberee,
            });
          }
        }
        this.moteur.saisieMoyPropDelib({
          paramRequete: lParamRequete,
          instanceListe: lListe,
          clbckSucces: function (aParamSucces) {
            const lService = this.listeElementsLineaire.getElementParNumero(
              aParamSucces.numeroService,
            );
            if (lService !== null) {
              if (aParamSucces.estProposee) {
                if (aParamSucces.estAvisReligion) {
                  lService.avisReligionPropose =
                    aParamSucces.avisReligionPropose;
                } else {
                  lService.moyenneProposee = aParamSucces.moyenneProposee;
                }
              } else {
                if (aParamSucces.estAvisReligion) {
                  lService.avisReligionDelibere =
                    aParamSucces.avisReligionDelibere;
                } else {
                  lService.moyenneDeliberee = aParamSucces.moyenneDeliberee;
                }
              }
            }
          }.bind(this),
          paramCellSuivante: aParam.navigation.suivante,
          clbckEchec: function (aPromiseMsg) {
            _actualiserSurErreurSaisie.call(this, {
              liste: lListe,
              promiseMsg: aPromiseMsg,
            });
          }.bind(this),
        });
        break;
      }
      default:
        if (
          this.moteurGrille.estColVariable(
            aParam.idColonne,
            DonneesListe_BulletinNotes.colonnes.appreciation,
          )
        ) {
          const lIndCol = this.moteurGrille.getIndiceColVariable(
            aParam.idColonne,
          );
          const lAppr =
            aParam.appreciation !== null && aParam.appreciation !== undefined
              ? aParam.appreciation
              : lArticle.ListeAppreciations.get(lIndCol);
          lPromise = this.saisieAppreciation(
            {
              instanceListe: lListe,
              estCtxPied: aParam.estCtxPied === true,
              suivante: aParam.navigation.suivante,
            },
            {
              classe: this.getClasse(),
              periode: this.getPeriode(),
              eleve: this.getEleve(),
              service: lArticle,
              appreciation: lAppr,
              typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
                estCtxPied: aParam.estCtxPied === true,
                eleve: this.getEleve(),
                typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
                appreciation: lAppr,
              }),
            },
          );
        } else {
        }
        break;
    }
  }
  if (
    !this.moteurGrille.estColVariable(
      aParam.idColonne,
      DonneesListe_BulletinNotes.colonnes.appreciation,
    ) &&
    !(aParam.idColonne === DonneesListe_BulletinNotes.colonnes.ects) &&
    !(aParam.idColonne === DonneesListe_BulletinNotes.colonnes.moyProposee) &&
    !(aParam.idColonne === DonneesListe_BulletinNotes.colonnes.moyDeliberee) &&
    !(aParam.idColonne === DonneesListe_BulletinNotes.colonnes.elmtPgm)
  ) {
    if (
      aParam.navigation !== null &&
      aParam.navigation !== undefined &&
      aParam.navigation.suivante !== null &&
      aParam.navigation.suivante !== undefined
    ) {
      this.moteurGrille.selectionCelluleSuivante({
        instanceListe: lListe,
        suivante: aParam.navigation.suivante,
      });
    }
  }
  return lPromise;
}
function _actualiserSurErreurSaisie(aParam) {
  const lSelection = aParam.liste.getSelectionCellule();
  this.afficherPage();
  if (aParam.promiseMsg !== null && aParam.promiseMsg !== undefined) {
    aParam.promiseMsg.then(() => {
      aParam.liste.selectionnerCellule({
        ligne: lSelection.ligne,
        colonne: lSelection.colonne,
        avecScroll: true,
      });
    });
  }
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
          const lParamSuivante = { orientationVerticale: true };
          _surValiderEditionDonnee.call(this, {
            article: lContexte.article,
            idColonne: lContexte.idColonne,
            selection: aParam.eltSelectionne,
            appreciation: lContexte.appreciation,
            instanceListe: lListe,
            estCtxPied: lEstCtxPiedBulletin,
            navigation: { suivante: lParamSuivante },
          });
        }.bind(this);
        break;
      case EBoutonFenetreAssistantSaisie.PasserEnSaisie:
        lClbck = function () {
          this.moteurAssSaisie.passerEnSaisie({
            instanceListe: lListe,
            idColonne: lContexte.idColonne,
          });
        }.bind(this);
        break;
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
function surEditionElementProgramme(aService) {
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ElementsProgramme, {
    pere: this,
    evenement: function (aValider, aDonnees) {
      this.palierElementTravailleSelectionne = aDonnees.palierActif;
      if (aValider) {
        _surValiderEditionDonnee.call(this, {
          article: aService,
          idColonne: DonneesListe_BulletinNotes.colonnes.elmtPgm,
          selection: aDonnees.listeElementsProgramme,
          navigation: { suivante: { orientationVerticale: true } },
        });
      } else {
        this.getInstance(this.identListe).actualiser(true);
      }
    },
  }).setDonnees({
    service: aService,
    periode: GEtatUtilisateur.getPeriode(),
    listeElementsProgramme: aService.ElementsProgrammeBulletin,
    palier: this.palierElementTravailleSelectionne,
  });
}
function surEditionAvisReligion(aContexte) {
  const lDonneesListe = new DonneesListe_Simple(aContexte.listeAvis, {
    avecTri: false,
  }).setOptions({ avecEvnt_SelectionClick: true, avecEvnt_Selection: false });
  lDonneesListe.getValeur = function (aParams) {
    if (aParams.colonne === 0) {
      return aParams.article.description !== null &&
        aParams.article.description !== undefined
        ? aParams.article.getLibelle() !== ""
          ? aParams.article.getLibelle() +
            " (" +
            aParams.article.description +
            ")"
          : aParams.article.description
        : aParams.article.getLibelle();
    }
    return aParams.article.getLibelle();
  };
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
    pere: this,
    evenement: _evntFenetreAvisReligion.bind(this, aContexte),
    initialiser: this.moteur.initFenetreAvisReligion,
  }).setDonnees(lDonneesListe, true);
}
function _evntFenetreAvisReligion(aContexte, aNumeroBouton, aIndiceSelection) {
  switch (aNumeroBouton) {
    case 1: {
      const lEltSelection = aContexte.listeAvis.get(aIndiceSelection);
      if (
        lEltSelection &&
        lEltSelection.getNumero() !== aContexte.avisReligion.getNumero()
      ) {
        _surValiderEditionDonnee.call(this, {
          article: aContexte.article,
          idColonne: aContexte.idColonne,
          selection: lEltSelection,
          ctxAvisReligion: true,
          navigation: { suivante: { orientationVerticale: true } },
        });
      }
      break;
    }
  }
}
function _evntSurPied(aParam) {
  this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
  this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
    instanceFenetreAssistantSaisie: this.getInstance(
      this.identFenetreAssistantSaisie,
    ),
    listeTypesAppreciations: this.listeTypesAppreciations,
    tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
      GEtatUtilisateur.getGenreOnglet(),
      aParam.appreciation,
      true,
    ),
    tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
      estCtxPied: true,
      appreciation: aParam.appreciation,
      typeReleveBulletin: TypeReleveBulletin.BulletinNotes,
    }),
    avecEtatSaisie: false,
  });
}
module.exports = InterfaceBulletinNotes;
