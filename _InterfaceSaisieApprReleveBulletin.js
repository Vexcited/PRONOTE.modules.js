const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetRequeteApprBulletin } = require("ObjetRequeteApprBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { DonneesListe_ApprBulletin } = require("DonneesListe_ApprBulletin.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const {
  ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const {
  EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { ObjetElement } = require("ObjetElement.js");
const { Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetInvocateur } = require("Invocateur.js");
const {
  DonneesListe_BarreNiveauxDAcquisitionsDePilier,
} = require("DonneesListe_BarreNiveauxDAcquisitionsDePilier.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
class _InterfaceSaisieApprReleveBulletin extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.param = { modeChronologique: false };
    this.moteur = new ObjetMoteurReleveBulletin();
    this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
    this.moteurGrille = new ObjetMoteurGrilleSaisie();
    this.estOrientationVerticale = true;
    this.avecComboPeriode = true;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getInfoCloture: function () {
        return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
      },
      avecBoutonOrientationSaisie() {
        return !!aInstance.avecBoutonOrientationSaisie;
      },
      btnOrientationSaisie: {
        event() {
          aInstance.estOrientationVerticale =
            !aInstance.estOrientationVerticale;
        },
        getSelection() {
          return !!aInstance.estOrientationVerticale;
        },
        getTitle() {
          if (!!aInstance.estOrientationVerticale) {
            return GTraductions.getValeur("competences.SensDeSaisieHorizontal");
          }
          return GTraductions.getValeur("competences.SensDeSaisieVertical");
        },
        getClassesMixIcon() {
          return UtilitaireBoutonBandeau.getClassesMixIconSaisieHorizontalVertical(
            aInstance.estOrientationVerticale,
          );
        },
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
  instancierCombos() {
    return this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _evntSurDernierMenuDeroulant.bind(this),
      _initTripleCombo.bind(this),
    );
  }
  getService() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service);
  }
  getClasse() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
  }
  getPeriode() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
  }
  envoyerRequete(aParam) {
    new ObjetRequeteApprBulletin(
      this,
      _actionSurRecupererDonnees.bind(this),
    ).lancerRequete(aParam);
  }
  instancierBulletin() {
    return this.add(ObjetListe, _evntSurListe.bind(this));
  }
  getListeTypesAppreciations() {
    this.moteurAssSaisie.getListeTypesAppreciations({
      typeReleveBulletin: this.typeReleveBulletin,
      clbck: function (aListeTypesAppreciations) {
        this.listeTypesAppreciations = aListeTypesAppreciations;
      }.bind(this),
    });
  }
  clbckSaisieApprClasse(aParamSucces) {
    if (
      !this.moteur.controleCtxAppSaisie(
        { service: this.getService(), periode: this.getPeriode() },
        aParamSucces,
      )
    ) {
      return;
    }
    this.moteur.updateAppClasseSurRetourSaisie(
      this.donnees.appreciationClasse,
      aParamSucces,
    );
    _afficherPiedPage.call(this, this.donnees);
  }
  saisieAppreciation(aParam, aParamRequete) {
    const lParam = {
      instanceListe: aParam.instanceListe,
      paramRequete: aParamRequete,
      paramCellSuivante:
        aParam.suivante !== null && aParam.suivante !== undefined
          ? aParam.suivante
          : { orientationVerticale: this.estOrientationVerticale },
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
          this.moteur.updateAppClasseSurRetourSaisie(
            this.donnees.appreciationClasse,
            aParamSucces,
          );
          _afficherPiedPage.call(this, this.donnees);
        }.bind(this),
      });
    } else {
      $.extend(lParam, {
        clbckSucces: function (aParamSucces) {
          const lDonneesListe = this.getInstance(
            this.identListe,
          ).getListeArticles();
          const lLignes = lDonneesListe.getListeElements((aLigne) => {
            return (
              aLigne.eleve.getNumero() === aParamSucces.numeroEleve &&
              aLigne.service.getNumero() === aParamSucces.numeroService
            );
          });
          const lLigne = lLignes.get(0);
          let lApp;
          if (
            this.typeReleveBulletin ===
            TypeReleveBulletin.AppreciationsBulletinProfesseur
          ) {
            if (
              lLigne.appA &&
              lLigne.appA.getGenre() === aParamSucces.rangAppr
            ) {
              lApp = lLigne.appA;
            } else if (
              lLigne.appB &&
              lLigne.appB.getGenre() === aParamSucces.rangAppr
            ) {
              lApp = lLigne.appB;
            } else if (
              lLigne.appC &&
              lLigne.appC.getGenre() === aParamSucces.rangAppr
            ) {
              lApp = lLigne.appC;
            }
          } else {
            if (
              lLigne.appReleve &&
              lLigne.appReleve.getGenre() === aParamSucces.rangAppr
            ) {
              lApp = lLigne.appReleve;
            }
          }
          if (lApp) {
            lApp.setNumero(aParamSucces.apprSaisie.getNumero());
            lApp.setLibelle(aParamSucces.apprSaisie.getLibelle());
            lApp.setEtat(EGenreEtat.Aucun);
          }
        }.bind(this),
      });
    }
    this.moteur.saisieAppreciation(lParam);
  }
  getListeAnnotationsPourAvisReligion() {
    if (this.listeAnnotations === null || this.listeAnnotations === undefined) {
      this.listeAnnotations = new ObjetListeElements();
    }
    const lEltAucun = new ObjetElement("", 0, null, 0);
    lEltAucun.description = GTraductions.getValeur("Aucun");
    this.listeAnnotations.insererElement(lEltAucun, 0);
  }
  construireInstances() {
    this.identTripleCombo = this.instancierCombos();
    if (
      this.identTripleCombo !== null &&
      this.identTripleCombo !== undefined &&
      this.getInstance(this.identTripleCombo) !== null
    ) {
      this.IdPremierElement = this.getInstance(
        this.identTripleCombo,
      ).getPremierElement();
    }
    this.identListe = this.instancierBulletin();
    this.fenetreDetailJauges = this.addFenetre(
      ObjetFenetre_Liste,
      () => {
        GEtatUtilisateur.Navigation.fenetre_BarreNiveauxDAcquisitions_estAffiche = false;
      },
      (aInstance) => {
        const lColonnes = [];
        lColonnes.push({
          id: DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.domaine,
          titre: GTraductions.getValeur(
            "Fenetre_BarreNiveauxDacquisitions.Titre.DomaineDeFormation",
          ),
          taille: 300,
        });
        lColonnes.push({
          id: DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.jauge,
          titre: GTraductions.getValeur(
            "Fenetre_BarreNiveauxDacquisitions.Titre.EtatAcquisition",
          ),
          taille: "100%",
        });
        const lParamsListe = { optionsListe: { colonnes: lColonnes } };
        aInstance.setOptionsFenetre({
          modale: false,
          titre: "",
          largeur: 600,
          hauteur: 300,
          listeBoutons: [GTraductions.getValeur("Fermer")],
        });
        aInstance.paramsListe = lParamsListe;
      },
    );
    this.identPiedPage = this.instancierPiedBulletin();
    this.instancierAssistantSaisie();
    this.construireFicheEleveEtFichePhoto();
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div style="height:100%">');
    H.push('<div style="height:100%">');
    H.push(
      '<div class="Espace" id="',
      this.getInstance(this.identListe).getNom(),
      '"></div>',
    );
    if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
      H.push(
        '<div class="Espace AlignementBas" id="',
        this.getInstance(this.identPiedPage).getNom(),
        '"></div>',
      );
    }
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.IdentZoneAlClient = this.identListe;
    this.avecBandeau = true;
    this.AddSurZone = [this.identTripleCombo];
    if (
      [
        TypeReleveBulletin.AppreciationsReleveProfesseur,
        TypeReleveBulletin.AppreciationsBulletinProfesseur,
      ].includes(this.typeReleveBulletin)
    ) {
      this.AddSurZone.push({
        html: '<span ie-html = "getInfoCloture"></span>',
      });
    }
    this.AddSurZone.push({ separateur: true });
    this.addSurZoneOrientationSaisie();
    this.addSurZoneAssistantSaisie();
    this.addSurZoneFichesEleve();
    this.addSurZoneMrFiche();
  }
  evenementAfficherMessage(aMessage) {
    _masquerVisibilitePiedPage.call(this, true);
    this._evenementAfficherMessage(aMessage);
  }
  desactiverImpression() {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
  }
  actualiserListe() {
    this.getInstance(this.identListe).setDonnees(
      this.donneesListe_ApprBulletin,
    );
    this.selectionneEleveAutoDansPage();
  }
  selectionneEleveAutoDansPage() {
    const lTrouve = this.selectionnerEleveCourant();
    this.activerFichesEleve(lTrouve);
  }
  selectionnerEleveCourant() {
    let lTrouve = false;
    const lEleve = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Eleve,
    );
    if (lEleve && !lEleve.multiSelection) {
      const lDonneesListe = this.getInstance(
        this.identListe,
      ).getListeArticles();
      for (let i = 0, lNbr = lDonneesListe.count(); i < lNbr; i++) {
        if (!lTrouve) {
          const lElement = lDonneesListe.get(i);
          if (lElement.eleve.getNumero() === lEleve.getNumero()) {
            lTrouve = true;
            this.getInstance(this.identListe).selectionnerLigne({
              ligne: i,
              avecScroll: true,
            });
            break;
          }
        }
      }
    }
    return lTrouve;
  }
  addSurZoneOrientationSaisie() {
    this.AddSurZone.push({
      html: UtilitaireBoutonBandeau.getHtmlBtnSaisieHorizontalVertical(
        "btnOrientationSaisie",
      ),
      getDisplay: "avecBoutonOrientationSaisie",
    });
  }
  avecAssistantSaisie() {
    return this.moteurAssSaisie.avecAssistantSaisie({
      typeReleveBulletin: this.typeReleveBulletin,
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
  instancierPiedBulletin() {}
  afficherPiedPage(aParam) {
    _afficherPiedPage.call(this, aParam);
  }
  addSurZoneFichesEleve() {
    this.addSurZoneFicheEleve();
  }
  addSurZoneMrFiche() {}
  estColonnePositionnementEstVisible() {
    return false;
  }
  _getInfoClasse() {
    const lClasse = this.getClasse();
    if (
      lClasse !== null &&
      lClasse !== undefined &&
      lClasse.getNumero() !== -1 &&
      lClasse.getGenre() !== EGenreRessource.Aucune
    ) {
      return lClasse;
    } else {
      let lService = this.getService();
      if (lService !== null && lService !== undefined) {
        let lClasseDuService = lService.classe;
        let lGpeDuService = lService.groupe;
        if (lGpeDuService && lGpeDuService.existeNumero()) {
          lGpeDuService.Genre = EGenreRessource.Groupe;
          return lGpeDuService;
        } else {
          if (lClasseDuService && lClasseDuService.existeNumero()) {
            lClasseDuService.Genre = EGenreRessource.Classe;
            return lClasseDuService;
          } else {
          }
        }
      }
    }
  }
}
function _initTripleCombo(aInstance) {
  const lCombos = [EGenreRessource.Classe];
  if (this.avecComboPeriode === true) {
    lCombos.push(EGenreRessource.Periode);
  }
  lCombos.push(EGenreRessource.Service);
  aInstance.setParametres(lCombos, true);
}
function _evntSurDernierMenuDeroulant() {
  if (
    GEtatUtilisateur.Navigation.fenetre_BarreNiveauxDAcquisitions_estAffiche
  ) {
    GEtatUtilisateur.Navigation.fenetre_BarreNiveauxDAcquisitions_estAffiche = false;
    this.getInstance(this.fenetreDetailJauges).fermer();
  }
  _actualiserDonnees.call(this);
}
function _actualiserDonnees() {
  this.getListeTypesAppreciations();
  const lParam = {
    ressource: this.getClasse(),
    periode: this.avecComboPeriode ? this.getPeriode() : null,
    service: this.getService(),
  };
  this.envoyerRequete(lParam);
}
function _evntSurListe(aParametres) {
  const lIdCol = aParametres.idColonne;
  const lLigne = aParametres.article;
  const lClasse = _getInfoClasseEleve.call(this, lLigne);
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.Selection:
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Eleve,
        aParametres.article.eleve,
      );
      this.surSelectionEleve();
      switch (lIdCol) {
        case DonneesListe_ApprBulletin.colonnes.jaugeEval:
          _ouvrirFenetreDetailJauges.call(this, lLigne);
          break;
      }
      break;
    case EGenreEvenementListe.Edition:
      switch (lIdCol) {
        case DonneesListe_ApprBulletin.colonnes.evolution:
          this.moteur.ouvrirMenuEvolution({
            id: this.getInstance(this.identListe).getIdCellule(
              aParametres.colonne,
              aParametres.ligne,
            ),
            instance: this,
            clbackMenuEvolution: function (aEvolution) {
              if (aEvolution && lLigne.evolution !== aEvolution.getGenre()) {
                this.moteur.saisieEvolution({
                  paramRequete: {
                    evolution: aEvolution.getGenre(),
                    classe: lClasse,
                    periode: this.getPeriode(),
                    eleve: lLigne.eleve,
                    service: lLigne.service,
                  },
                  instanceListe: this.getInstance(this.identListe),
                  clbckSucces: function (aParamSucces) {
                    const lDonneesListe = this.getInstance(
                      this.identListe,
                    ).getListeArticles();
                    const lLignes = lDonneesListe.getListeElements((aLigne) => {
                      return (
                        aLigne.eleve.getNumero() === aParamSucces.numeroEleve &&
                        aLigne.service.getNumero() ===
                          aParamSucces.numeroService
                      );
                    });
                    const lLigne = lLignes.get(0);
                    lLigne.listePeriodesPrec.parcourir((aEltPeriodePrec) => {
                      aEltPeriodePrec.evolution = aParamSucces.evolutionSaisie;
                    });
                  }.bind(this),
                  paramCellSuivante: {
                    orientationVerticale: this.estOrientationVerticale,
                  },
                  clbckEchec: function (aPromiseMsg) {
                    _actualiserSurErreurSaisie.call(this, {
                      liste: this.getInstance(this.identListe),
                      promiseMsg: aPromiseMsg,
                    });
                  }.bind(this),
                });
              }
            }.bind(this),
          });
          break;
        case DonneesListe_ApprBulletin.colonnes.niveauAcqu: {
          const lThis = this;
          aParametres.ouvrirMenuContextuel({
            genreChoixValidationCompetence:
              TypeGenreValidationCompetence.tGVC_Competence,
            genrePositionnement:
              TypePositionnementUtil.getGenrePositionnementParDefaut(
                lLigne.typePositionnementClasse,
              ),
            avecLibelleRaccourci: true,
            clbackMenuPositionnement(aNiveauDAcquisition) {
              _saisiePositionnementSurLigneEleve.call(
                lThis,
                lLigne,
                aNiveauDAcquisition,
              );
            },
          });
          break;
        }
        case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
        case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee: {
          const lAvisReligion =
            lIdCol === DonneesListe_ApprBulletin.colonnes.avisReligionPropose
              ? lLigne.avisReligionPropose
              : lLigne.avisReligionDelibere;
          this.moteur.surEditionAvisReligion({
            article: lLigne,
            idColonne: lIdCol,
            avisReligion: lAvisReligion,
            listeAvis: this.listeAnnotations,
            surValiderEditionDonnee: function (aParam) {
              const lArticle = aParam.article;
              switch (aParam.idColonne) {
                case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
                  lArticle.avisReligionPropose = aParam.selection;
                  lArticle.avisReligionPropose.setEtat(EGenreEtat.Modification);
                  break;
                case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
                  lArticle.avisReligionDelibere = aParam.selection;
                  lArticle.avisReligionDelibere.setEtat(
                    EGenreEtat.Modification,
                  );
                  break;
              }
              lArticle.setEtat(EGenreEtat.Modification);
              _envoyerSaisiePropDelib.call(this, {
                article: lArticle,
                idCol: lIdCol,
              });
            }.bind(this),
          });
          break;
        }
        case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
          if (lLigne.estMoyNREditable) {
            if (!lLigne.estMoyNR) {
              GApplication.getMessage().afficher({
                type: EGenreBoiteMessage.Confirmation,
                titre: GTraductions.getValeur("Notes.TitreConfirmationMoyNR"),
                message: GTraductions.getValeur("Notes.ConfirmationMoyNR"),
                callback: function (aGenreAction) {
                  if (aGenreAction === EGenreAction.Valider) {
                    _basculerMoyNRDEleve.call(this, lLigne);
                  }
                }.bind(this),
              });
            } else {
              _basculerMoyNRDEleve.call(this, lLigne);
            }
          }
          break;
        case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
        case DonneesListe_ApprBulletin.colonnes.appreciationA:
        case DonneesListe_ApprBulletin.colonnes.appreciationB:
        case DonneesListe_ApprBulletin.colonnes.appreciationC: {
          const lAppreciation =
            DonneesListe_ApprBulletin.getAppreciationDeColonne(aParametres);
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
            tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
              estCtxPied: false,
              eleve: lLigne.eleve,
              typeReleveBulletin: this.typeReleveBulletin,
            }),
            avecEtatSaisie: false,
          });
          this.objCelluleAppreciation = $.extend(
            {
              article: lLigne,
              appreciation: lAppreciation,
              idColonne: aParametres.idColonne,
            },
            { ctxPiedBulletin: false },
          );
          break;
        }
        default:
          break;
      }
      break;
    case EGenreEvenementListe.ApresEdition:
      switch (lIdCol) {
        case DonneesListe_ApprBulletin.colonnes.ects: {
          const lValeur = lLigne.ectsModifie;
          if (
            lValeur !== null &&
            lValeur !== undefined &&
            lValeur !== lLigne.ECTS
          ) {
            this.moteur.saisieECTS({
              paramRequete: {
                estCalculAuto: false,
                classe: lClasse,
                periode: this.getPeriode(),
                eleve: lLigne.eleve,
                service: this.getService(),
                ECTS: lValeur,
              },
              instanceListe: this.getInstance(this.identListe),
              clbckSucces: function (aParamSucces) {
                const lDonneesListe = this.getInstance(
                  this.identListe,
                ).getListeArticles();
                const lLignes = lDonneesListe.getListeElements((aLigne) => {
                  return aLigne.eleve.getNumero() === aParamSucces.numeroEleve;
                });
                const lLigne = lLignes.get(0);
                lLigne.ECTS = aParamSucces.ECTSSaisie;
              }.bind(this),
              paramCellSuivante: {
                orientationVerticale: this.estOrientationVerticale,
              },
              clbckEchec: function (aPromiseMsg) {
                _actualiserSurErreurSaisie.call(this, {
                  liste: this.getInstance(this.identListe),
                  promiseMsg: aPromiseMsg,
                });
              }.bind(this),
            });
          } else {
            this.moteurGrille.selectionCelluleSuivante({
              instanceListe: this.getInstance(this.identListe),
              suivante: { orientationVerticale: this.estOrientationVerticale },
            });
          }
          break;
        }
        case DonneesListe_ApprBulletin.colonnes.moyProposee:
          if (
            lLigne.moyProposeeModifie.getNote() !==
            lLigne.moyenneProposee.getNote()
          ) {
            lLigne.moyenneProposee = lLigne.moyProposeeModifie;
            _envoyerSaisiePropDelib.call(this, {
              article: lLigne,
              idCol: lIdCol,
            });
          }
          break;
        case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
          if (
            lLigne.moyDelibereeModifie.getNote() !==
            lLigne.moyenneDeliberee.getNote()
          ) {
            lLigne.moyenneDeliberee = lLigne.moyDelibereeModifie;
            _envoyerSaisiePropDelib.call(this, {
              article: lLigne,
              idCol: lIdCol,
            });
          }
          break;
        case DonneesListe_ApprBulletin.colonnes.noteLSU:
          if (lLigne.noteLSUModifie.getNote() !== lLigne.noteLSU.getNote()) {
            this.moteur.saisieNoteLSU({
              paramRequete: {
                classe: lClasse,
                periode: this.getPeriode(),
                eleve: lLigne.eleve,
                service: this.getService(),
                posLSUNote: lLigne.noteLSUModifie,
              },
              instanceListe: this.getInstance(this.identListe),
              clbckSucces: function (aParamSucces) {
                const lDonneesListe = this.getInstance(
                  this.identListe,
                ).getListeArticles();
                const lLignes = lDonneesListe.getListeElements((aLigne) => {
                  return aLigne.eleve.getNumero() === aParamSucces.numeroEleve;
                });
                const lLigne = lLignes.get(0);
                lLigne.noteLSU = aParamSucces.noteLSUSaisie;
              }.bind(this),
              paramCellSuivante: {
                orientationVerticale: this.estOrientationVerticale,
              },
              clbckEchec: function (aPromiseMsg) {
                _actualiserSurErreurSaisie.call(this, {
                  liste: this.getInstance(this.identListe),
                  promiseMsg: aPromiseMsg,
                });
              }.bind(this),
            });
          }
          break;
        case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
          this.moteur.saisieAvisProfesseur({
            paramRequete: {
              classe: lClasse,
              periode: this.getPeriode(),
              eleve: lLigne.eleve,
              service: this.getService(),
              avisProfesseur: lLigne.appAvisProfesseur,
            },
            instanceListe: this.getInstance(this.identListe),
            clbckSucces: function (aParamSucces) {
              const lDonneesListe = this.getInstance(
                this.identListe,
              ).getListeArticles();
              const lLignes = lDonneesListe.getListeElements((aLigne) => {
                return aLigne.eleve.getNumero() === aParamSucces.numeroEleve;
              });
              const lLigne = lLignes.get(0);
              lLigne.appAvisProfesseur = aParamSucces.appAvisProfesseur;
            }.bind(this),
            paramCellSuivante: {
              orientationVerticale: this.estOrientationVerticale,
            },
            clbckEchec: function (aPromiseMsg) {
              _actualiserSurErreurSaisie.call(this, {
                liste: this.getInstance(this.identListe),
                promiseMsg: aPromiseMsg,
              });
            }.bind(this),
          });
          break;
        case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
          this.moteur.saisieAvisProfesseurParcoursup({
            paramRequete: {
              eleve: lLigne.eleve,
              service: lLigne.service,
              appAvisProfParcoursup: lLigne.appAvisProfParcoursup,
            },
            instanceListe: this.getInstance(this.identListe),
            clbckSucces: function (aParamSucces) {
              const lDonneesListe = this.getInstance(
                this.identListe,
              ).getListeArticles();
              const lLignes = lDonneesListe.getListeElements((aLigne) => {
                return aLigne.eleve.getNumero() === aParamSucces.numeroEleve;
              });
              const lLigne = lLignes.get(0);
              lLigne.appAvisProfParcoursup = aParamSucces.appAvisProfParcoursup;
            }.bind(this),
            paramCellSuivante: {
              orientationVerticale: this.estOrientationVerticale,
            },
            clbckEchec: function (aPromiseMsg) {
              _actualiserSurErreurSaisie.call(this, {
                liste: this.getInstance(this.identListe),
                promiseMsg: aPromiseMsg,
              });
            }.bind(this),
          });
          break;
        case DonneesListe_ApprBulletin.colonnes.appreciationA:
          _saisirAppreciation.call(this, {
            appr: lLigne.appA,
            eleve: lLigne.eleve,
            service: lLigne.service,
            classe: lClasse,
          });
          break;
        case DonneesListe_ApprBulletin.colonnes.appreciationB:
          _saisirAppreciation.call(this, {
            appr: lLigne.appB,
            eleve: lLigne.eleve,
            service: lLigne.service,
            classe: lClasse,
          });
          break;
        case DonneesListe_ApprBulletin.colonnes.appreciationC:
          _saisirAppreciation.call(this, {
            appr: lLigne.appC,
            eleve: lLigne.eleve,
            service: lLigne.service,
            classe: lClasse,
          });
          break;
        case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
          _saisirAppreciation.call(this, {
            appr: lLigne.appReleve,
            eleve: lLigne.eleve,
            service: lLigne.service,
            classe: lClasse,
          });
          break;
        default:
          break;
      }
      break;
    case EGenreEvenementListe.KeyUpListe:
      if (this.estColonnePositionnementEstVisible()) {
        _surKeyUpListe.call(this, aParametres.event);
      }
      return true;
  }
}
function _surKeyUpListe(aEvent) {
  const lNiveaux =
    GParametres.listeNiveauxDAcquisitions &&
    GParametres.listeNiveauxDAcquisitions.getListeElements((D) => {
      return D.actifPour.contains(
        TypeGenreValidationCompetence.tGVC_Competence,
      );
    });
  const lNiveau = TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
    aEvent,
    lNiveaux,
    true,
  );
  if (lNiveau) {
    _modifierNiveauDeSelectionCourante.call(this, lNiveau);
  }
}
function _modifierNiveauDeSelectionCourante(aNiveau) {
  if (!aNiveau) {
    return;
  }
  const lListe = this.getInstance(this.identListe);
  const lListeElementsSelectionnes = lListe.getListeElementsSelection();
  if (lListeElementsSelectionnes.count() === 0) {
    return;
  }
  const lLigneEleve = lListeElementsSelectionnes.get(0);
  _saisiePositionnementSurLigneEleve.call(this, lLigneEleve, aNiveau);
}
function _saisiePositionnementSurLigneEleve(
  aLigneEleve,
  aNiveauDAcquisition,
  aAvecPassageLigneSuivante = true,
) {
  if (aNiveauDAcquisition && aLigneEleve.niveauAcquEditable) {
    let lAvecChangement = false;
    const lListe = this.getInstance(this.identListe);
    const lParamsCallSuivante = {
      orientationVerticale: this.estOrientationVerticale,
    };
    if (!aLigneEleve.niveauAcqu && aNiveauDAcquisition.getNumero() !== 0) {
      lAvecChangement = true;
    } else if (
      aLigneEleve.niveauAcqu &&
      aLigneEleve.niveauAcqu.getNumero() !== aNiveauDAcquisition.getNumero()
    ) {
      lAvecChangement = true;
    }
    if (lAvecChangement) {
      const lClasse = _getInfoClasseEleve.call(this, aLigneEleve);
      const lParamsMoteurSaisie = {
        paramRequete: {
          estPourElementCompetence: false,
          positionnement: aNiveauDAcquisition,
          classe: lClasse,
          periode: this.getPeriode(),
          eleve: aLigneEleve.eleve,
          service: this.getService(),
        },
        instanceListe: lListe,
        clbckSucces: function (aParamSucces) {
          const lDonneesListe = this.getInstance(
            this.identListe,
          ).getListeArticles();
          const lLignes = lDonneesListe.getListeElements((aLigne) => {
            return (
              aLigne.estPere &&
              aLigne.eleve.getNumero() === aParamSucces.numeroEleve
            );
          });
          const lLigne = lLignes.get(0);
          lLigne.niveauAcqu = aParamSucces.niveauAcquSaisi;
        }.bind(this),
        clbckEchec: function (aPromiseMsg) {
          _actualiserSurErreurSaisie.call(this, {
            liste: this.getInstance(this.identListe),
            promiseMsg: aPromiseMsg,
          });
        }.bind(this),
      };
      if (aAvecPassageLigneSuivante) {
        lParamsMoteurSaisie.paramCellSuivante = lParamsCallSuivante;
      }
      this.moteur.saisiePositionnement(lParamsMoteurSaisie);
    } else if (aAvecPassageLigneSuivante) {
      this.moteurGrille.selectionCelluleSuivante({
        instanceListe: lListe,
        suivante: lParamsCallSuivante,
      });
    }
  }
}
function _basculerMoyNRDEleve(aLigneEleve) {
  this.moteur.saisieMoyNR({
    paramRequete: {
      estMoyNR: !aLigneEleve.estMoyNR,
      periode: this.getPeriode(),
      eleve: aLigneEleve.eleve,
      service: this.getService(),
    },
    instanceListe: this.getInstance(this.identListe),
    clbckSucces: function (aParamSucces) {
      const lDonneesListe = this.getInstance(
        this.identListe,
      ).getListeArticles();
      const lLignes = lDonneesListe.getListeElements((aLigne) => {
        return aLigne && aLigne.eleve
          ? aLigne.eleve.getNumero() === aParamSucces.numeroEleve
          : false;
      });
      const lLigne = lLignes.get(0);
      lLigne.estMoyNR = aParamSucces.estMoyNRSaisie;
      if (
        aParamSucces.estMoyAnnuelleNR !== null &&
        aParamSucces.estMoyAnnuelleNR !== undefined
      ) {
        lLigne.estMoyAnnuelleNR = aParamSucces.estMoyAnnuelleNR;
      }
      this.getInstance(this.identListe)
        .getDonneesListe()
        .actualiserTotalMoyNR();
    }.bind(this),
    paramCellSuivante: null,
    clbckEchec: function () {}.bind(this),
  });
}
function _getInfoClasseEleve(aLigne) {
  if (aLigne && aLigne.classe) {
    return aLigne.classe;
  } else {
    return this._getInfoClasse();
  }
}
function _actualiserSurErreurSaisie(aParam) {
  const lSelection = aParam.liste.getSelectionCellule();
  _actualiserDonnees.call(this);
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
function _saisirAppreciation(aParam) {
  this.saisieAppreciation(
    {
      instanceListe: this.getInstance(this.identListe),
      estCtxPied: false,
      suivante: { orientationVerticale: this.estOrientationVerticale },
    },
    {
      classe: aParam.classe,
      periode: this.getPeriode(),
      eleve: aParam.eleve,
      service: aParam.service,
      appreciation: aParam.appr,
      typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
        estCtxPied: false,
        eleve: aParam.eleve,
        typeReleveBulletin: this.typeReleveBulletin,
        appreciation: aParam.appr,
      }),
    },
  );
}
function _ouvrirFenetreDetailJauges(aLigne) {
  this.moteur.ouvrirFenetreDetailBarreNiveauxDAcquisition({
    instance: this.getInstance(this.fenetreDetailJauges),
    modeChronologique: this.param.modeChronologique,
    listePiliers: aLigne.listePiliers,
    eleve: aLigne.eleve,
    nbEvals: aLigne.nbEvals,
  });
}
function _masquerVisibilitePiedPage(aMasquer) {
  if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
    $("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
      "display",
      aMasquer ? "none" : "",
    );
  }
}
function _afficherPiedPage(aParam) {
  if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
    const lDataPied = this.getDataPiedPage(aParam);
    this.getInstance(this.identPiedPage).setDonnees(lDataPied);
  }
}
function _actionSurRecupererDonnees(aParam) {
  this.desactiverImpression();
  if (aParam.message !== null && aParam.message !== undefined) {
    this.evenementAfficherMessage(aParam.message);
  } else {
    this.donnees = aParam;
    _masquerVisibilitePiedPage.call(this, false);
    _afficherBulletin.call(this, aParam);
    _afficherPiedPage.call(this, aParam);
    _activerImpression.call(this);
  }
  this.afficherBandeau(true);
}
function _activerImpression() {
  const lGenreImpression = this.moteur.getGenreImpression({
    typeReleveBulletin: this.typeReleveBulletin,
  });
  Invocateur.evenement(
    ObjetInvocateur.events.activationImpression,
    lGenreImpression,
    this,
    lGenreImpression === EGenreImpression.GenerationPDF
      ? getParametresPDF.bind(this)
      : null,
  );
}
function getParametresPDF() {
  const lClasse = this._getInfoClasse();
  const lParam = {
    genreGenerationPDF: this.moteur.getGenreGenerationPdf({
      typeReleveBulletin: this.typeReleveBulletin,
    }),
    periode: this.getPeriode(),
    ressource: lClasse,
    service: this.getService(),
    modeChronologique: this.param.modeChronologique,
    avecAbreviationsNivAcquisition:
      GParametres.afficherAbbreviationNiveauDAcquisition ||
      GEtatUtilisateur.estAvecCodeCompetences(),
  };
  const lDonneesListe = this.getInstance(this.identListe).getDonneesListe();
  if (lDonneesListe.param.avecSelectionPeriodePrec === true) {
    $.extend(lParam, { periodePrec: lDonneesListe.param.periodePrecCourante });
  } else if (
    lDonneesListe.param.listePeriodesPrec &&
    lDonneesListe.param.listePeriodesPrec.count() > 0
  ) {
    $.extend(lParam, {
      periodePrec: lDonneesListe.param.listePeriodesPrec.get(0),
    });
  }
  return lParam;
}
function _getModeValidationAuto(aListeCols, aCol) {
  const lInfosCol = this.moteur.getInfosCol(aListeCols, aCol);
  switch (aCol) {
    case DonneesListe_ApprBulletin.colonnes.noteLSU:
      return lInfosCol.modeValidSigmaLSU;
    case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
      return lInfosCol.modeValidSigmaPos;
  }
  return null;
}
function _getListeElevesPourValidationAuto(aDonnees, aCol) {
  const lListeEleves = new ObjetListeElements();
  aDonnees.parcourir((aLigne) => {
    switch (aCol) {
      case DonneesListe_ApprBulletin.colonnes.noteLSU:
        if (aLigne.noteLSUEditable) {
          lListeEleves.addElement(aLigne.eleve);
        }
        break;
      case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
        if (aLigne.niveauAcquEditable) {
          lListeEleves.addElement(aLigne.eleve);
        }
        break;
      case DonneesListe_ApprBulletin.colonnes.ects:
        if (aLigne.estPere && aLigne.ECTSEditable === true) {
          const lElt = aLigne.eleve;
          lElt.classe = _getInfoClasseEleve.call(this, aLigne);
          lElt.service = aLigne.service;
          lListeEleves.addElement(lElt);
        }
        break;
    }
  });
  return lListeEleves;
}
function _surClbckCalculAutoLSU() {
  _actualiserDonnees.call(this);
}
function _afficherBulletin(aParam) {
  const lDonneesListe = aParam.listeLignes;
  this.strInfoCloture = aParam.strInfoCloture || "";
  this.avecBoutonOrientationSaisie = !!aParam.avecBtnOrientationSaisie;
  let lFusionner = false;
  lDonneesListe.parcourir((aLigne) => {
    if (!!aLigne.listePiliers) {
      aLigne.listePiliers.parcourir((aPilierEleve) => {
        aPilierEleve.listeNiveaux =
          TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
            aPilierEleve.listeNiveauxChronologiques,
          );
      });
    }
    if (aLigne.estService && aLigne.estPere) {
      lFusionner =
        aLigne.fusionAppr !== null && aLigne.fusionAppr !== undefined
          ? aLigne.fusionAppr
          : false;
    } else {
      if (!aLigne.estService && !aLigne.estPere) {
        aLigne.fusionAppr = lFusionner;
      }
    }
  });
  const lParamDonneesListe = {
    instanceListe: this.getInstance(this.identListe),
    listeColVisibles: aParam.listeColonnes,
    total: aParam.ligneTotal,
    typeReleveBulletin: this.typeReleveBulletin,
  };
  $.extend(lParamDonneesListe, {
    tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
      estCtxPied: false,
      typeReleveBulletin: this.typeReleveBulletin,
    }),
  });
  $.extend(lParamDonneesListe, {
    modeChronologique: this.param.modeChronologique,
    clbckJauge: function () {
      this.param.modeChronologique = !this.param.modeChronologique;
      this.getInstance(
        this.identListe,
      ).getDonneesListe().param.modeChronologique =
        this.param.modeChronologique;
      this.getInstance(this.identListe).actualiser(true);
      if (
        GEtatUtilisateur.Navigation.fenetre_BarreNiveauxDAcquisitions_estAffiche
      ) {
        const lEleve = GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Eleve,
        );
        const lLignes = lDonneesListe.getListeElements((aLigne) => {
          return (
            aLigne.eleve.getNumero() === lEleve.getNumero() && aLigne.estService
          );
        });
        if (lLignes.count() > 0) {
          const lLigne = lLignes.get(0);
          _ouvrirFenetreDetailJauges.call(this, lLigne);
        }
      }
    }.bind(this),
  });
  $.extend(lParamDonneesListe, {
    clbckSigmaECTS: function () {
      this.moteur.surBoutonCalculAutoECTS(
        _getParamBtnCalculAuto.call(this, {
          donneesListe: lDonneesListe,
          col: DonneesListe_ApprBulletin.colonnes.ects,
          listeColonnes: aParam.listeColonnes,
        }),
      );
    }.bind(this),
  });
  $.extend(lParamDonneesListe, {
    clbckSigmaLSU: function () {
      this.moteur.surBoutonCalculAuto(
        _getParamBtnCalculAuto.call(this, {
          donneesListe: lDonneesListe,
          col: DonneesListe_ApprBulletin.colonnes.noteLSU,
          listeColonnes: aParam.listeColonnes,
        }),
      );
    }.bind(this),
  });
  $.extend(lParamDonneesListe, {
    clbckSigmaPos: function () {
      this.moteur.surBoutonCalculAuto(
        _getParamBtnCalculAuto.call(this, {
          donneesListe: lDonneesListe,
          col: DonneesListe_ApprBulletin.colonnes.niveauAcqu,
          listeColonnes: aParam.listeColonnes,
        }),
      );
    }.bind(this),
  });
  const lInfosCol = this.moteur.getInfosCol(
    aParam.listeColonnes,
    DonneesListe_ApprBulletin.colonnes.periodePrec,
  );
  if (lInfosCol !== null) {
    const lAvecComboSelectionPeriode =
      aParam.listePeriodesPrec !== null &&
      aParam.listePeriodesPrec !== undefined &&
      aParam.listePeriodesPrec.count() > 1;
    $.extend(lParamDonneesListe, {
      avecSelectionPeriodePrec: lAvecComboSelectionPeriode,
      listePeriodesPrec: aParam.listePeriodesPrec,
      clbckSelectionPeriode: function () {
        this.getInstance(this.identListe).actualiser(true);
      }.bind(this),
    });
  }
  $.extend(lParamDonneesListe, {
    baremeNotationNiveau:
      aParam.NoteBareme !== null && aParam.NoteBareme !== undefined
        ? aParam.NoteBareme
        : GParametres.baremeNotation,
  });
  this.listeAnnotations = aParam.listeAnnotations;
  this.getListeAnnotationsPourAvisReligion();
  this.donneesListe_ApprBulletin = new DonneesListe_ApprBulletin(
    lDonneesListe,
    lParamDonneesListe,
  );
  this.actualiserListe();
}
function _getParamBtnCalculAuto(aParam) {
  const lCol = aParam.col;
  const lListeEleves = _getListeElevesPourValidationAuto.call(
    this,
    aParam.donneesListe,
    lCol,
  );
  const lInfosCol = this.moteur.getInfosCol(aParam.listeColonnes, lCol);
  switch (lCol) {
    case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
    case DonneesListe_ApprBulletin.colonnes.noteLSU:
      return {
        listeEleves: lListeEleves,
        modeCalculAuto: _getModeValidationAuto.call(
          this,
          aParam.listeColonnes,
          lCol,
        ),
        instance: this,
        clbckCalculAuto: _surClbckCalculAutoLSU.bind(this),
        messageValidationAutoPositionnementSelonDevoir:
          lInfosCol.messageValidationAutoPositionnementSelonDevoir,
      };
    case DonneesListe_ApprBulletin.colonnes.ects:
      return {
        seuilECTS: lInfosCol.seuilECTS,
        nbrECTSService: lInfosCol.nbECTSService,
        listeEleves: lListeEleves,
        periode: this.getPeriode(),
        instanceListe: this.getInstance(this.identListe),
        instance: this,
        clbckCalculAuto: _surClbckCalculAutoLSU.bind(this),
      };
    default:
      return {};
  }
}
function _evntSurAssistant() {
  this.moteurAssSaisie.evntBtnAssistant({
    instanceListe: this.getInstance(this.identListe),
    instancePied: null,
  });
}
function _evntSurFenetreAssistantSaisie(aNumeroBouton) {
  const lThis = this;
  const lParam = {
    instanceFenetreAssistantSaisie: this.getInstance(
      this.identFenetreAssistantSaisie,
    ),
    eventcall: function () {
      lThis.getInstance(lThis.identListe).actualiser(true);
    },
    evntClbck: surEvntAssSaisie.bind(this),
  };
  this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
}
function _validerAppreciation(aParam, aParamSaisie) {
  const lContexte = aParamSaisie.contexte;
  if (
    this.moteurAssSaisie.avecAssistantSaisieActif({
      typeReleveBulletin: this.typeReleveBulletin,
    })
  ) {
    this.moteurAssSaisie.validerDonneesSurValider({
      article: lContexte.article,
      appreciation: lContexte.appreciation,
      eltSelectionne: aParam.eltSelectionne,
    });
  }
  _saisirAppreciation.call(this, {
    eleve: lContexte.article.eleve,
    service: lContexte.article.service,
    classe: _getInfoClasseEleve.call(this, lContexte.article),
    appr: lContexte.appreciation,
  });
}
function surEvntAssSaisie(aParam) {
  const lContexte = this.objCelluleAppreciation;
  const lListe = this.getInstance(this.identListe);
  if (lListe !== null && lListe !== undefined) {
    let lClbck;
    switch (aParam.cmd) {
      case EBoutonFenetreAssistantSaisie.Valider:
        lClbck = function () {
          _validerAppreciation.call(this, aParam, { contexte: lContexte });
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
function _envoyerSaisiePropDelib(aParam) {
  const lArticle = aParam.article;
  const lEstAvisReligion =
    aParam.idCol === DonneesListe_ApprBulletin.colonnes.avisReligionPropose ||
    aParam.idCol === DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee;
  const lEstProposee =
    aParam.idCol === DonneesListe_ApprBulletin.colonnes.avisReligionPropose ||
    aParam.idCol === DonneesListe_ApprBulletin.colonnes.moyProposee;
  const lParamRequete = {
    classe: this.getClasse(),
    periode: this.getPeriode(),
    eleve: lArticle.eleve,
    service: lArticle.service,
    estAvisReligion: lEstAvisReligion,
    estProposee: lEstProposee,
  };
  if (lEstProposee) {
    if (lEstAvisReligion) {
      $.extend(lParamRequete, {
        avisReligionPropose: lArticle.avisReligionPropose,
      });
    } else {
      $.extend(lParamRequete, { moyenneProposee: lArticle.moyenneProposee });
    }
  } else {
    if (lEstAvisReligion) {
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
    instanceListe: this.getInstance(this.identListe),
    clbckSucces: function (aParamSucces) {
      const lDonneesListe = this.getInstance(
        this.identListe,
      ).getListeArticles();
      const lLignes = lDonneesListe.getListeElements((aLigne) => {
        return (
          aLigne.eleve.getNumero() === aParamSucces.numeroEleve &&
          aLigne.service.getNumero() === aParamSucces.numeroService
        );
      });
      const lLigne = lLignes.get(0);
      if (lEstProposee) {
        if (lEstAvisReligion) {
          lLigne.avisReligionPropose = aParamSucces.avisReligionPropose;
        } else {
          lLigne.moyenneProposee = aParamSucces.moyenneProposee;
        }
      } else {
        if (lEstAvisReligion) {
          lLigne.avisReligionDelibere = aParamSucces.avisReligionDelibere;
        } else {
          lLigne.moyenneDeliberee = aParamSucces.moyenneDeliberee;
        }
      }
    }.bind(this),
    paramCellSuivante: { orientationVerticale: this.estOrientationVerticale },
    clbckEchec: function (aPromiseMsg) {
      _actualiserSurErreurSaisie.call(this, {
        liste: this.getInstance(this.identListe),
        promiseMsg: aPromiseMsg,
      });
    }.bind(this),
  });
}
module.exports = { _InterfaceSaisieApprReleveBulletin };
