const { Identite } = require("ObjetIdentite.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GUID } = require("GUID.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const {
  EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const { EGenreBtnActionBlocTAF } = require("GestionnaireBlocTAF.js");
const { EGenreBtnActionBlocCDC } = require("GestionnaireBlocCDC.js");
const { ObjetListeArborescente } = require("ObjetListeArborescente.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GestionnaireBlocTAF } = require("GestionnaireBlocTAF.js");
const { GestionnaireBlocCDC } = require("GestionnaireBlocCDC.js");
const {
  ObjetRequetePageCahierDeTexte,
} = require("ObjetRequetePageCahierDeTexte.js");
const {
  ObjetUtilitaireCahierDeTexte,
} = require("ObjetUtilitaireCahierDeTexte.js");
const { EGenreTriCDT } = require("EGenreTriCDT.js");
const { TypeDomaine } = require("TypeDomaine.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetFenetre_ListeTAFFaits } = require("ObjetFenetre_ListeTAFFaits.js");
const { ObjetFenetre_Bloc } = require("ObjetFenetre_Bloc.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { PageCahierDeTexte } = require("PageCahierDeTexte.js");
const {
  EGenreRessourcePedagogique,
  EGenreRessourcePedagogiqueUtil,
} = require("Enumere_RessourcePedagogique.js");
const { PageCahierDeTexteEleve } = require("PageCahierDeTexteEleve.js");
const {
  ObjetRequeteSaisieTAFFaitEleve,
} = require("ObjetRequeteSaisieTAFFaitEleve.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreMessage } = require("Enumere_Message.js");
const {
  ObjetInterfacePageCahierDeTexteCP,
} = require("InterfacePageCahierDeTexteCP.js");
const { ObjetCelluleSemaine } = require("ObjetCelluleSemaine.js");
const {
  EGenreTypeRessourcesPedagogiques,
} = require("Enumere_TypeRessourcesPedagogiques.js");
const { UtilitaireQCMPN } = require("UtilitaireQCMPN.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
const { ObjetGalerieCarrousel } = require("ObjetGalerieCarrousel.js");
const { TypeGenreMiniature } = require("TypeGenreMiniature.js");
const { TypeCallbackVisuEleveQCM } = require("ObjetVisuEleveQCM.js");
Requetes.inscrire("donneesContenusCDT", ObjetRequeteConsultation);
class _InterfacePageCahierDeTexte extends ObjetInterfacePageCahierDeTexteCP {
  constructor(...aParams) {
    super(...aParams);
    this.date = GEtatUtilisateur.getNavigationDate() || GDate.aujourdhui;
    this.idBlocRessourcesNumeriques = GUID.getId();
    this.listeRessourcesNumeriques = null;
    this.idZoneBlocsRessourcesPedagogiques = GUID.getId();
    this.ListeCahierDeTextes = new ObjetListeElements();
    this.ListeTravailAFaire = new ObjetListeElements();
    this.modeTimeLine = GEtatUtilisateur.getModeAffichageTimeLine();
    if (!this.modeTimeLine) {
      this.modeTimeLine = EModeAffichageTimeline.classique;
      GEtatUtilisateur.setModeAffichageTimeLine(this.modeTimeLine);
    }
    this.peuFaireTAF = [EGenreEspace.Eleve].includes(
      GEtatUtilisateur.GenreEspace,
    );
    this.ModeAffichage =
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_TAF
        ? EGenreAffichageCahierDeTextes.TravailAFaire
        : EGenreAffichageCahierDeTextes.ContenuDeCours;
    this.utilitaireCDT = new ObjetUtilitaireCahierDeTexte(
      this.Nom + "_utilitaireCDT",
      this,
    );
    this.inclureTAFFait = true;
    this.inclureTAFAFaire = true;
    this.infoRessourceDeploye = {
      ressourcesNumeriques: false,
      sujetsCorriges: false,
      travauxRendu: false,
      QCM: false,
      ressourcesGranulaires: false,
      documentsAutres: false,
      forumPedagogique: false,
    };
    this.avecBandeau = true;
    this.optionsBloc = {};
  }
  construireInstances() {
    super.construireInstances();
    this.IdentCahierDeTexte = this.add(
      PageCahierDeTexteEleve,
      this.surEvenementPage,
    );
    this.gestionnaireTAF = Identite.creerInstance(GestionnaireBlocTAF, {
      pere: this,
      evenement: this.evenementSurBlocTAF.bind(this, { fenetre: false }),
    });
    this.gestionnaireCDC = Identite.creerInstance(GestionnaireBlocCDC, {
      pere: this,
      evenement: this.evenementSurBlocCDC,
    });
    this.identCelluleSemaine = this.add(
      ObjetCelluleSemaine,
      this._evntCelluleSemaine,
      this._initCelluleSemaine,
    );
    this.identFenetreVisuQCM = this.addFenetre(
      ObjetFenetreVisuEleveQCM,
      this.evenementSurVisuEleve,
    );
    this.identDetailCDT = this.addFenetre(
      ObjetFenetre_Bloc,
      null,
      _initDetailCDT,
    );
    this.identImpression = this.add(
      PageCahierDeTexte,
      null,
      _initialiserCDTpourImpression,
    );
    this.idTitreRessourcesPeda = GUID.getId();
    this.idBlocSujetsCorriges = GUID.getId();
    this.idBlocTravauxRendus = GUID.getId();
    this.idBlocQCM = GUID.getId();
    this.idBlocRessourcesGranulaires = GUID.getId();
    this.idBlocForumPedagogique = GUID.getId();
    this.idBlocDocumentsAutres = GUID.getId();
  }
  construireStructureListeADroite() {
    return [
      '<div id="',
      this.idZoneBlocsRessourcesPedagogiques,
      '" class="conteneur-ressourcePeda">',
      '<div style="max-width: 450px;">',
      '<div id="',
      this.idTitreRessourcesPeda,
      '" ></div>',
      '<div id="',
      this.idBlocRessourcesNumeriques,
      '" class="m-top-xl"></div>',
      '<div id="',
      this.idBlocSujetsCorriges,
      '" class="m-top-xl"></div>',
      '<div id="',
      this.idBlocTravauxRendus,
      '" class="m-top-xl"></div>',
      '<div id="',
      this.idBlocQCM,
      '" class="m-top-xl"></div>',
      '<div id="',
      this.idBlocRessourcesGranulaires,
      '" class="m-top-xl"></div>',
      '<div id="',
      this.idBlocForumPedagogique,
      '" class="m-top-xl"></div>',
      '<div id="',
      this.idBlocDocumentsAutres,
      '" class="m-top-xl"></div>',
      "</div>",
      "</div>",
    ].join("");
  }
  setOptionsBloc(aOptionsBloc) {
    Object.assign(this.optionsBloc, aOptionsBloc);
    return this;
  }
  setModeTimeline(aModeTimeline) {
    this.modeTimeLine = aModeTimeline;
    if (this.getInstance(this.identDetailCDT)) {
      this.getInstance(this.identDetailCDT).fermer();
    }
    GEtatUtilisateur.setModeAffichageTimeLine(this.modeTimeLine);
  }
  evenementSurPage() {
    this.recupererDonnees();
  }
  recupererDonnees() {
    this.presetDates();
    this.finRecupererDonnees();
  }
  presetDates() {
    this.gestionnaireBloc =
      this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
        ? this.gestionnaireTAF
        : this.gestionnaireCDC;
    this.initialiserBloc(this.gestionnaireBloc);
    this.gestionnaireBloc.initialiser();
    this.domaine = GEtatUtilisateur.getDomaineSelectionne();
    this.dateDepuis = GEtatUtilisateur.getDateDebutTimeLineCDT();
    this.estNavigationTAF = GEtatUtilisateur.getPage();
    if (this.estNavigationTAF && this.estNavigationTAF.date) {
      const lDomaine = new TypeDomaine();
      const lSemaine = IE.Cycles.cycleDeLaDate(this.estNavigationTAF.date);
      lDomaine.vider();
      lDomaine.setValeur(true, lSemaine);
      this.domaine = lDomaine;
    }
    GEtatUtilisateur.resetPage();
    this.domaineChronologique = initDomaineChronologique(this.dateDepuis);
    this.dateDepuis = GDate.getDateBornee(
      IE.Cycles.dateDebutCycle(
        this.domaineChronologique.getPremierePosition(true),
      ),
    );
    $("#" + this.idZoneChxModeAff.escapeJQ() + " > input")
      .off("change")
      .on("change", this._evenementChxModeAff.bind(this));
    this.setVisibilite();
  }
  finRecupererDonnees() {
    this.getInstance(this.identCelluleSemaine).setDonnees(
      IE.Cycles.dateDebutCycle(this.domaine.getPremierePosition(true)),
    );
    this.getInstance(this.identCelluleDate).setDonnees(this.dateDepuis);
    if (this.estChronologique()) {
      this.evenementSurCalendrier(this.domaineChronologique);
    }
  }
  _evntCelluleSemaine(aDomaine) {
    if (aDomaine && this.estHebdomadaire()) {
      this.modifierDomaine(aDomaine);
    }
  }
  _eventCelluleDate(aDate) {
    if (aDate && this.estChronologique()) {
      this.modifierDate(aDate);
      this.getInstance(this.identCelluleDate).setDonnees(aDate);
    }
  }
  getDomaineSelonAffichage() {
    let lDomaine;
    if (this.estChronologique()) {
      lDomaine = this.domaineChronologique;
    } else {
      lDomaine = this.domaine;
    }
    return lDomaine;
  }
  evenementSurBlocTAF(aObjet, aTAF, aGenreEvnt, aParam) {
    switch (aGenreEvnt) {
      case EGenreBtnActionBlocTAF.documentRendu:
        if (aObjet && aObjet.fenetre && aObjet.contexte) {
          Requetes(
            "donneesContenusCDT",
            this,
            _actionApresRequeteDonneesTAFCDT.bind(this, {
              contexte: aObjet.contexte,
            }),
          ).lancerRequete({
            cahierDeTextes: new ObjetElement("", aObjet.contexte.getNumero()),
            pourTAF: true,
          });
        } else {
          this.evenementSurCalendrier(this.getDomaineSelonAffichage());
        }
        break;
      case EGenreBtnActionBlocTAF.executionQCM:
        this.surExecutionQCM(aParam.event, aTAF.getNumero(), aObjet);
        break;
      case EGenreBtnActionBlocTAF.voirQCM:
        this.surExecutionQCM(aParam.event, aTAF.getNumero(), aObjet);
        break;
      case EGenreBtnActionBlocTAF.voirContenu:
        Requetes(
          "donneesContenusCDT",
          this,
          _actionApresRequeteDonneesContenusCDT,
        ).lancerRequete({ cahierDeTextes: aTAF.cahierDeTextes });
        break;
      case EGenreBtnActionBlocTAF.detailTAF:
        this.surDetailRendu(aParam.event, aTAF.getNumero(), aObjet);
        break;
      case EGenreBtnActionBlocTAF.tafFait: {
        const lTAF = this.ListeTravailAFaire.getElementParNumero(
          aTAF.getNumero(),
        );
        if (!!lTAF) {
          lTAF.TAFFait = aTAF.TAFFait;
          this.actualiser();
        }
        break;
      }
      case EGenreBtnActionBlocTAF.executionKiosque:
        window.open(GChaine.creerUrlBruteLienExterne(aTAF));
        break;
      default:
        break;
    }
  }
  evenementSurBlocCDC(aElement, aGenreEvnt, aParam) {
    switch (aGenreEvnt) {
      case EGenreBtnActionBlocCDC.executionQCM:
        this.surExecutionQCMContenu(aParam.event, aElement);
        break;
      case EGenreBtnActionBlocCDC.navigationTAF:
        Requetes(
          "donneesContenusCDT",
          this,
          _actionApresRequeteDonneesTAFCDT.bind(this, {
            contexte: aElement,
            pourLe: true,
          }),
        ).lancerRequete({
          cahierDeTextes: new ObjetElement("", aElement.getNumero()),
          pourTAF: true,
        });
        break;
      default:
        break;
    }
  }
  initialiserBloc(aInstance, aEstAffContenuDesCours) {
    let lEvent = null;
    if (this.estHebdomadaire()) {
      lEvent = _afficheFenetreDetail.bind(
        this,
        this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire,
      );
    }
    aInstance.setOptions(
      Object.assign(
        {
          avecPastille: false,
          modeAffichage: this.modeTimeLine,
          formatDate:
            this.modeTimeLine === EModeAffichageTimeline.compact
              ? "%Jjj %JJ %Mmm"
              : null,
          avecZoneAction: !this.estHebdomadaire() && !aEstAffContenuDesCours,
          avecBordure: this.estHebdomadaire(),
          initPlie: this.estHebdomadaire(),
          callBackTitre: lEvent,
          pourLe: this.modeTimeLine === EModeAffichageTimeline.compact,
          avecPourLeEtDonneeLe: true,
        },
        this.optionsBloc,
      ),
    );
  }
  modifierDomaine(aDomaine) {
    const lDomaine = new TypeDomaine();
    const lSemaine = aDomaine.getPremierePosition(true);
    lDomaine.vider();
    lDomaine.setValeur(true, lSemaine, lSemaine);
    this.domaine = lDomaine;
    this.evenementSurCalendrier(this.domaine);
  }
  modifierDate(aDate) {
    this.domaineChronologique = initDomaineChronologique(aDate);
    this.dateDepuis = GDate.getDateBornee(
      IE.Cycles.dateDebutCycle(
        this.domaineChronologique.getPremierePosition(true),
      ),
    );
    GEtatUtilisateur.setDateDebutTimeLineCDT(this.dateDepuis);
    this.evenementSurCalendrier(this.domaineChronologique);
  }
  evenementSurCalendrier(aDomaine) {
    if (this.estHebdomadaire()) {
      GEtatUtilisateur.setDomaineSelectionne(aDomaine);
    }
    if (this.getInstance(this.identDetailCDT)) {
      this.getInstance(this.identDetailCDT).fermer();
    }
    const lParams = { domaine: aDomaine };
    if (
      [
        EGenreEspace.Academie,
        EGenreEspace.Etablissement,
        EGenreEspace.Professeur,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.PrimDirection,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      lParams.ressource = GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Classe,
      );
      if (
        !!lParams.ressource &&
        lParams.ressource.getGenre() !== EGenreRessource.Classe
      ) {
        lParams.ressource = null;
      }
    }
    new ObjetRequetePageCahierDeTexte(
      this,
      this.actionSurEvenementSurCalendrier,
    ).lancerRequete(lParams);
  }
  actualiserPage() {
    const lParamsRequete = {
      domaine: this.getDomaineSelonAffichage(),
      ressource: GEtatUtilisateur.Navigation.getRessource(
        EGenreRessource.Classe,
      ),
    };
    new ObjetRequetePageCahierDeTexte(
      this,
      this.actionSurEvenementSurCalendrier,
    ).lancerRequete(lParamsRequete);
  }
  surEvenementPage(aParams) {
    if (aParams) {
      if (aParams.cours) {
        Requetes(
          "donneesContenusCDT",
          this,
          _actionApresRequeteDonneesTAFCDT.bind(this, {
            contexte: aParams.cours,
            pourLe: true,
          }),
        ).lancerRequete({
          cahierDeTextes: new ObjetElement("", aParams.cours.getNumero()),
          pourTAF: true,
        });
      }
      if (aParams.taf) {
        switch (aParams.GenreBtnAction) {
          case EGenreBtnActionBlocTAF.voirContenu:
            Requetes(
              "donneesContenusCDT",
              this,
              _actionApresRequeteDonneesContenusCDT,
            ).lancerRequete({ cahierDeTextes: aParams.taf.cahierDeTextes });
            break;
          case EGenreBtnActionBlocTAF.detailTAF:
            this.surDetailRendu(null, aParams.taf.getNumero(), aParams.objet);
            break;
          default:
            this.evenementSurPage();
            break;
        }
      }
      if (aParams.executionQCM) {
        let i, j, k, lNbr, lElement, lContenu, lExecutionQCM;
        if (
          this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
        ) {
          if (aParams.CDT) {
            lElement = aParams.CDT;
            for (
              j = 0;
              lElement.listeContenus && j < lElement.listeContenus.count();
              j++
            ) {
              lContenu = lElement.listeContenus.get(j);
              for (
                k = 0;
                lContenu.listeExecutionQCM &&
                k < lContenu.listeExecutionQCM.count();
                k++
              ) {
                lExecutionQCM = lContenu.listeExecutionQCM.get(k);
                if (
                  lExecutionQCM &&
                  lExecutionQCM.getNumero() === aParams.executionQCM
                ) {
                  break;
                }
              }
              if (
                lExecutionQCM &&
                lExecutionQCM.getNumero() === aParams.executionQCM
              ) {
                break;
              }
            }
            this.surExecutionQCMContenu(null, lExecutionQCM, aParams);
          } else {
            for (i = 0, lNbr = this.ListeTravailAFaire.count(); i < lNbr; i++) {
              lElement = this.ListeTravailAFaire.get(i);
              if (
                lElement.executionQCM &&
                !!aParams &&
                !!aParams.executionQCM &&
                lElement.executionQCM.getNumero() === aParams.executionQCM
              ) {
                break;
              }
            }
            this.surExecutionQCM(null, lElement.getNumero());
          }
        } else {
          if (aParams.estRessource) {
            this.listeRessourcesPedagogiques.parcourir((D) => {
              if (
                D.ressource &&
                D.ressource.getNumero() === aParams.executionQCM
              ) {
                lExecutionQCM = D.ressource;
                return false;
              }
            });
            _ouvrirExecutionQCM.call(this, lExecutionQCM);
          } else if (aParams.TAFQCM) {
            lContenu = aParams.TAFQCM;
            for (
              i = 0, lNbr = lContenu.ListeTravailAFaire.count();
              i < lNbr;
              i++
            ) {
              lElement = lContenu.ListeTravailAFaire.get(i);
              if (
                lElement.executionQCM &&
                !!aParams &&
                !!aParams.executionQCM &&
                lElement.executionQCM.getNumero() === aParams.executionQCM
              ) {
                break;
              }
            }
            this.surExecutionQCM(null, lElement.getNumero(), aParams);
          } else {
            for (i = 0; i < this.ListeCahierDeTextes.count(); i++) {
              lElement = this.ListeCahierDeTextes.get(i);
              for (
                j = 0;
                lElement.listeContenus && j < lElement.listeContenus.count();
                j++
              ) {
                lContenu = lElement.listeContenus.get(j);
                for (
                  k = 0;
                  lContenu.listeExecutionQCM &&
                  k < lContenu.listeExecutionQCM.count();
                  k++
                ) {
                  lExecutionQCM = lContenu.listeExecutionQCM.get(k);
                  if (
                    lExecutionQCM &&
                    lExecutionQCM.getNumero() === aParams.executionQCM
                  ) {
                    break;
                  }
                }
                if (
                  lExecutionQCM &&
                  lExecutionQCM.getNumero() === aParams.executionQCM
                ) {
                  break;
                }
              }
              if (
                lExecutionQCM &&
                lExecutionQCM.getNumero() === aParams.executionQCM
              ) {
                break;
              }
            }
            this.surExecutionQCMContenu(null, lExecutionQCM);
          }
        }
      }
      if (aParams.nodeDeploye) {
        _setInfoRessourceDeploye.call(this, aParams.nodeDeploye);
      }
    } else {
      this.apresModificationTAF = true;
      if (this.donnee) {
        if (this.fenetre) {
          this.fenetre.fermer();
        }
        this.evenementSurPage();
      } else {
        this.evenementSurPage();
      }
    }
  }
  evenementFiche(aParam) {
    if (aParam && aParam.surTAFARendre) {
      this.recupererDonnees(true);
    } else if (aParam && aParam.executionQCM) {
      _ouvrirExecutionQCM.call(this, aParam.executionQCM);
    }
  }
  actualiser() {
    this.ModeAffichage =
      GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_TAF
        ? EGenreAffichageCahierDeTextes.TravailAFaire
        : EGenreAffichageCahierDeTextes.ContenuDeCours;
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    const lDonnees = this.formatDonnees();
    if (lDonnees && lDonnees.count()) {
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.Normale,
        this,
      );
    }
    let lCompteurRessources = 0;
    if (
      !this.estHebdomadaire() &&
      this.ModeAffichage === EGenreAffichageCahierDeTextes.ContenuDeCours &&
      !!this.listeRessourcesNumeriques &&
      this.listeRessourcesNumeriques.count() > 0
    ) {
      const lHtmlRessourcesNumerique = this.getInstance(
        this.IdentCahierDeTexte,
      ).composeManuelsNumeriques(
        this.listeRessourcesNumeriques,
        this.filtreMatiere,
        this.infoRessourceDeploye,
      );
      GHtml.setHtml(
        this.idBlocRessourcesNumeriques,
        lHtmlRessourcesNumerique,
        this.getInstance(this.IdentCahierDeTexte).controleur,
      );
      lCompteurRessources += lHtmlRessourcesNumerique.length;
      $("#" + this.idBlocRessourcesNumeriques.escapeJQ()).show();
    } else {
      $("#" + this.idBlocRessourcesNumeriques.escapeJQ()).hide();
    }
    const lRessourcesPedagogiquesParType =
      _regrouperRessourcesPedagogiquesParType.call(
        this,
        this.listeRessourcesPedagogiques,
        this.filtreMatiere,
        this.filtreThemes,
      );
    if (
      !GEtatUtilisateur.estModeAccessible() &&
      !this.estHebdomadaire() &&
      this.ModeAffichage === EGenreAffichageCahierDeTextes.ContenuDeCours &&
      ((!!this.listeRessourcesPedagogiques &&
        this.listeRessourcesPedagogiques.count() > 0) ||
        (!!this.listeRessourcesNumeriques &&
          this.listeRessourcesNumeriques.count() > 0))
    ) {
      for (const lKey of MethodesObjet.enumKeys(
        EGenreTypeRessourcesPedagogiques,
      )) {
        const lType = EGenreTypeRessourcesPedagogiques[lKey];
        let lHtmlListeRessourcesPeda = "";
        const lIdBlocRessources = _getIdBlocRessourcesPedagogiquePourType.call(
          this,
          lType,
        );
        if (
          !!lIdBlocRessources &&
          !!lRessourcesPedagogiquesParType[lType] &&
          !!this.filtreMatiere
        ) {
          lHtmlListeRessourcesPeda = this.getInstance(
            this.IdentCahierDeTexte,
          ).composeRessourcesPeda(
            lRessourcesPedagogiquesParType[lType],
            lType,
            this.infoRessourceDeploye,
          );
        }
        GHtml.setHtml(
          lIdBlocRessources,
          lHtmlListeRessourcesPeda,
          this.getInstance(this.IdentCahierDeTexte).controleur,
        );
        lCompteurRessources += lHtmlListeRessourcesPeda.length;
      }
      GHtml.setHtml(
        this.idTitreRessourcesPeda,
        lCompteurRessources > 0
          ? this.getInstance(
              this.IdentCahierDeTexte,
            ).composeTitreRessourcesPeda()
          : "",
      );
      $("#" + this.idZoneBlocsRessourcesPedagogiques.escapeJQ()).show();
      const lElementTitreRessource = $(
        "#" + this.idTitreRessourcesPeda.escapeJQ(),
      );
      if (
        lElementTitreRessource &&
        lElementTitreRessource.get(0) &&
        lElementTitreRessource.get(0).scrollIntoView
      ) {
        lElementTitreRessource.get(0).scrollIntoView();
      }
    } else {
      $("#" + this.idZoneBlocsRessourcesPedagogiques.escapeJQ()).hide();
    }
    if (GEtatUtilisateur.estModeAccessible()) {
      this.afficherListeAccessible(lDonnees, lRessourcesPedagogiquesParType);
    } else {
      const lDomaine = this.getDomaineSelonAffichage();
      const lParams = {
        modeAffichage: this.modeTimeLine,
        avecJoursOuvres: true,
        debutGrille: IE.Cycles.dateDebutCycle(
          lDomaine.getPremierePosition(true),
        ),
        finGrille: IE.Cycles.dateFinCycle(lDomaine.getDernierePosition(true)),
      };
      this.gestionnaireBloc =
        this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
          ? this.gestionnaireTAF
          : this.gestionnaireCDC;
      this.initialiserBloc(
        this.gestionnaireBloc,
        this.ModeAffichage === EGenreAffichageCahierDeTextes.ContenuDeCours,
      );
      this.getInstance(this.IdentTimeLine).setOptions(lParams);
      const lTris = [];
      if (this.modeTimeLine === EModeAffichageTimeline.grille) {
        lTris.push(
          ObjetTri.init((a) => {
            return GDate.getJour(a.DateDebut);
          }, EGenreTriElement.Decroissant),
        );
        lTris.push(ObjetTri.init("DateDebut", EGenreTriElement.Croissant));
      } else {
        lTris.push(ObjetTri.init("DateDebut", EGenreTriElement.Decroissant));
      }
      lDonnees.setTri(lTris);
      lDonnees.trier();
      if (!this.estHebdomadaire()) {
        $(
          "#" + this.getInstance(this.IdentTimeLine).getNom().escapeJQ(),
        ).hide();
        $(
          "#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
        ).show();
      } else {
        $(
          "#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
        ).hide();
        $(
          "#" + this.getInstance(this.IdentTimeLine).getNom().escapeJQ(),
        ).show();
      }
      if (lDonnees.count() > 0 || this.estHebdomadaire()) {
        const lListeFiltree =
          this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
            ? this.listeTAFFiltres
            : this.listeCDCFiltres;
        const lParamsTL = {
          liste: !this.estHebdomadaire() ? lListeFiltree : lDonnees,
          gestionnairesBlocs: [this.gestionnaireBloc],
          avecFiltrage: this.filtreMatiere !== null,
        };
        if (this.estNavigationTAF && this.estNavigationTAF.date) {
          lParamsTL.dateCourante = this.estNavigationTAF.date;
          this.estNavigationTAF = null;
        }
        if (!this.estHebdomadaire()) {
          $(
            "#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
          ).get(0).style.maxWidth = "80rem";
          this.getInstance(this.IdentCahierDeTexte).setDonnees(lParamsTL);
        } else {
          this.getInstance(this.IdentTimeLine).setDonnees(lParamsTL);
          const lJqBloc = $(
            "#" + this.getNomInstance(this.IdentTimeLine).escapeJQ(),
          );
          const lJqContenu = lJqBloc.find(".PourFenetreBloc_Contenu");
          lJqContenu.each(function () {
            $(this)
              .parents(".UtilitaireBloc_containerNormal")
              .first()
              .css({ "justify-content": "flex-start" });
          });
        }
      } else {
        let lMessage = "";
        const lClasse = GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Classe,
        );
        if (
          [
            EGenreEspace.Academie,
            EGenreEspace.Etablissement,
            EGenreEspace.Professeur,
            EGenreEspace.PrimProfesseur,
            EGenreEspace.PrimDirection,
          ].includes(GEtatUtilisateur.GenreEspace) &&
          (!lClasse || lClasse.getGenre() !== EGenreRessource.Classe)
        ) {
          lMessage =
            GTraductions.getValeur("Message")[EGenreMessage.SelectionClasse];
        } else {
          if (
            this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
          ) {
            if (this.listeMatieres && this.listeMatieres.count() > 0) {
              lMessage = GTraductions.getValeur(
                "CahierDeTexte.AucunTAFAVenirSelonCriteres",
              );
            } else {
              lMessage = GTraductions.getValeur(
                "CahierDeTexte.AucunTAFJoursAVenir",
                [GDate.formatDate(this.dateDepuis, "%JJ/%MM/%AAAA")],
              );
            }
          } else {
            lMessage = GTraductions.getValeur(
              "CahierDeTexte.AucunContenuJoursAVenir",
              [GDate.formatDate(this.dateDepuis, "%JJ/%MM/%AAAA")],
            );
          }
        }
        this.getInstance(this.IdentCahierDeTexte).afficher(
          '<div class="message-vide card card-nodata"><div class="card-content">' +
            this.composeMessage(lMessage) +
            '</div><div class="Image_No_Data" aria-hidden="true"></div></div>',
        );
      }
    }
  }
  actionSurEvenementSurCalendrier(aParametres) {
    this.ListeTravailAFaire = aParametres.listeTAF;
    this.ListeCahierDeTextes = aParametres.listeCDT;
    this.listeDS = aParametres.listeDS;
    this.listeRessourcesNumeriques = aParametres.listeRessourcesNumeriques;
    this.listeRessourcesPedagogiques = aParametres.listeRessourcesPedagogiques;
    this.gestionMatiere();
    this.listeThemes = this.getListeThemes(this);
    let lScrollTop = 0;
    const lElementScroll = GHtml.getElement(
      this.getInstance(this.IdentCahierDeTexte).getNom(),
    );
    lScrollTop = lElementScroll.scrollTop;
    this.actualiser();
    lElementScroll.scrollTop = lScrollTop;
    if (
      this.estChronologique() &&
      this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
    ) {
      this.mettreFocusSurProchainTAF(this.ListeTravailAFaire);
    }
  }
  getListeThemes() {
    let lResult = new ObjetListeElements();
    let lThemeDeLaListe;
    if (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
      this.ListeTravailAFaire.parcourir((aElement) => {
        if (
          !!aElement &&
          !!aElement.ListeThemes &&
          aElement.ListeThemes.count()
        ) {
          aElement.ListeThemes.parcourir((aTheme) => {
            lThemeDeLaListe = lResult.getElementParNumero(aTheme.getNumero());
            if (!lThemeDeLaListe) {
              lThemeDeLaListe = MethodesObjet.dupliquer(aTheme);
              lResult.addElement(lThemeDeLaListe);
            }
          });
        }
      });
    } else {
      this.ListeCahierDeTextes.parcourir((aElement) => {
        if (
          !!aElement &&
          !!aElement.listeContenus &&
          aElement.listeContenus.count()
        ) {
          aElement.listeContenus.parcourir((aContenu) => {
            if (
              !!aContenu &&
              !!aContenu.ListeThemes &&
              aContenu.ListeThemes.count()
            ) {
              aContenu.ListeThemes.parcourir((aTheme) => {
                lThemeDeLaListe = lResult.getElementParNumero(
                  aTheme.getNumero(),
                );
                if (!lThemeDeLaListe) {
                  lThemeDeLaListe = MethodesObjet.dupliquer(aTheme);
                  lResult.addElement(lThemeDeLaListe);
                }
              });
            }
          });
        }
      });
      if (!!this.listeRessourcesPedagogiques) {
        this.listeRessourcesPedagogiques.parcourir((aRessource) => {
          if (
            !!aRessource &&
            !!aRessource.ListeThemes &&
            aRessource.ListeThemes.count()
          ) {
            aRessource.ListeThemes.parcourir((aTheme) => {
              lThemeDeLaListe = lResult.getElementParNumero(aTheme.getNumero());
              if (!lThemeDeLaListe) {
                lThemeDeLaListe = MethodesObjet.dupliquer(aTheme);
                lResult.addElement(lThemeDeLaListe);
              }
            });
          }
        });
      }
    }
    lResult.setTri([ObjetTri.init("Libelle")]);
    lResult.trier();
    lResult.insererElement(
      new ObjetElement(
        GTraductions.getValeur("CahierDeTexte.tousLesThemes"),
        null,
        -1,
      ),
      0,
    );
    return lResult;
  }
  getPageImpression() {
    this.getInstance(this.identImpression).setDonnees(
      this.listeTAFFiltres,
      this.listeCDCFiltres,
    );
    this.getInstance(this.identImpression).actualiser(
      this.ModeAffichage,
      EGenreTriCDT.ParDatePourLe,
    );
    return {
      contenu: this.getInstance(this.identImpression).composePage(true),
    };
  }
  getListeMatieres() {
    const lResult = new ObjetListeElements();
    let lMatiereDeLaListe;
    if (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
      this.ListeTravailAFaire.parcourir((aElement) => {
        lMatiereDeLaListe = lResult.getElementParNumero(
          aElement.Matiere.getNumero(),
        );
        if (!lMatiereDeLaListe) {
          lMatiereDeLaListe = MethodesObjet.dupliquer(aElement.Matiere);
          lMatiereDeLaListe.nbElementsConcernes = 0;
          lMatiereDeLaListe.couleurFond = aElement.CouleurFond;
          lResult.addElement(lMatiereDeLaListe);
        }
        lMatiereDeLaListe.nbElementsConcernes++;
      });
    } else {
      this.ListeCahierDeTextes.parcourir((aElement) => {
        if (
          !!aElement &&
          !!aElement.listeContenus &&
          aElement.listeContenus.count() > 0
        ) {
          lMatiereDeLaListe = lResult.getElementParNumero(
            aElement.Matiere.getNumero(),
          );
          if (!lMatiereDeLaListe) {
            lMatiereDeLaListe = MethodesObjet.dupliquer(aElement.Matiere);
            lMatiereDeLaListe.nbElementsConcernes = 0;
            lMatiereDeLaListe.couleurFond = aElement.CouleurFond;
            lResult.addElement(lMatiereDeLaListe);
          }
          lMatiereDeLaListe.nbElementsConcernes++;
        }
      });
      if (!!this.listeRessourcesPedagogiques) {
        this.listeRessourcesPedagogiques.parcourir((aRessource) => {
          if (!!aRessource && !!aRessource.matiere) {
            lMatiereDeLaListe = lResult.getElementParNumero(
              aRessource.matiere.getNumero(),
            );
            if (!lMatiereDeLaListe) {
              lMatiereDeLaListe = MethodesObjet.dupliquer(aRessource.matiere);
              lMatiereDeLaListe.nbElementsConcernes = 0;
              lMatiereDeLaListe.couleurFond = aRessource.matiere.CouleurFond;
              lResult.addElement(lMatiereDeLaListe);
            }
            lMatiereDeLaListe.nbElementsConcernes++;
          }
        });
      }
    }
    lResult.setTri([ObjetTri.init("Libelle")]);
    lResult.trier();
    if (lResult.count() > 0) {
      lResult.insererElement(
        new ObjetElement(
          GTraductions.getValeur("TAFEtContenu.toutesLesMatieres"),
          null,
          -1,
        ),
        0,
      );
    }
    return lResult;
  }
  formatDonnees() {
    let lListeTAF = new ObjetListeElements();
    let lListeCDC = new ObjetListeElements();
    const lAvecTestFiltreMatiere = this.estChronologique();
    let llTestFiltreMatiere;
    if (this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire) {
      lListeTAF = this.ListeTravailAFaire.getListeElements((aElement) => {
        const lFait = aElement.executionQCM
          ? aElement.QCMFait
          : aElement.TAFFait;
        const lTestFiltreTAF =
          (this.inclureTAFFait && lFait) || (this.inclureTAFAFaire && !lFait);
        llTestFiltreMatiere =
          !this.filtreMatiere ||
          this.filtreMatiere.getNumero() === aElement.Matiere.getNumero();
        return (
          lTestFiltreTAF && (!lAvecTestFiltreMatiere || llTestFiltreMatiere)
        );
      });
      if (this.filtreThemes) {
        lListeTAF = lListeTAF.getListeElements((aElement) => {
          let lTestTheme = false;
          if (aElement.ListeThemes && aElement.ListeThemes.count()) {
            aElement.ListeThemes.parcourir((aTheme) => {
              if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
                lTestTheme = true;
              }
            });
          }
          return lTestTheme;
        });
      }
    } else {
      this.ListeCahierDeTextes.parcourir((aEl) => {
        lListeCDC.add(Object.assign(new ObjetElement(), aEl));
      });
      lListeCDC = lListeCDC.getListeElements((aElement) => {
        llTestFiltreMatiere =
          !this.filtreMatiere ||
          this.filtreMatiere.getNumero() === aElement.Matiere.getNumero();
        return llTestFiltreMatiere;
      });
      if (this.filtreThemes) {
        lListeCDC.parcourir((aCDT) => {
          aCDT.listeContenus = aCDT.listeContenus.getListeElements(
            (aContenu) => {
              let lTestTheme = false;
              if (aContenu.ListeThemes && aContenu.ListeThemes.count()) {
                aContenu.ListeThemes.parcourir((aTheme) => {
                  if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
                    lTestTheme = true;
                  }
                });
              }
              return lTestTheme;
            },
          );
        });
        lListeCDC = lListeCDC.getListeElements((aElement) => {
          return !!aElement.listeContenus.count();
        });
      }
    }
    this.listeTAFFiltres = lListeTAF;
    this.listeCDCFiltres = lListeCDC;
    return this.utilitaireCDT.formatDonnees({
      modeAffichage: this.ModeAffichage,
      listeCDT: lListeCDC,
      listeTAF: lListeTAF,
      listeDS: this.listeDS,
      sansRegroupementTAF: true,
      avecDS: false,
      avecTAF: true,
      nom: this.Nom,
      pere: this,
      avecDetailTAF: GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur,
      controleur: this.controleur,
    });
  }
  surDetailRendu(aEvent, aNumeroElement, aObjet) {
    if (aEvent) {
      aEvent.stopImmediatePropagation();
    }
    const lListeTAF =
      aObjet && aObjet.fenetre && aObjet.contexte
        ? this.listeTAFDeContenu
        : this.ListeTravailAFaire;
    const lElement = lListeTAF.getElementParNumero(aNumeroElement);
    ObjetFenetre_ListeTAFFaits.ouvrir(
      {
        pere: this,
        evenement: _surEvenementFenetreListeTAFFaits.bind(this, aObjet),
      },
      lElement,
    );
  }
  surExecutionQCM(aEvent, aNumeroElement, aObjet) {
    if (aEvent) {
      aEvent.stopImmediatePropagation();
    }
    let lElement;
    if (aObjet && aObjet.fenetre && aObjet.contexte) {
      lElement = this.listeTAFDeContenu.getElementParNumero(aNumeroElement);
    } else {
      lElement = this.ListeTravailAFaire.getElementParNumero(aNumeroElement);
    }
    this.evenementFiche({ executionQCM: lElement.executionQCM });
  }
  surExecutionQCMContenu(aEvent, aElement) {
    if (aEvent) {
      aEvent.stopImmediatePropagation();
    }
    this.evenementFiche({ executionQCM: aElement });
  }
  evenementSurVisuEleve(aParam) {
    if (aParam.action === TypeCallbackVisuEleveQCM.close) {
      this.evenementSurCalendrier(this.getDomaineSelonAffichage());
    }
  }
  modifierInclureTAF(aTAFFait, aValue) {
    if (aTAFFait) {
      this.inclureTAFFait = aValue;
      if (!aValue && !this.inclureTAFAFaire) {
        this.inclureTAFAFaire = true;
      }
    } else {
      this.inclureTAFAFaire = aValue;
      if (!aValue && !this.inclureTAFFait) {
        this.inclureTAFFait = true;
      }
    }
    if (this.getInstance(this.identDetailCDT)) {
      this.getInstance(this.identDetailCDT).fermer();
    }
    this.actualiser();
  }
  afficherListeAccessible(aDonnees, aListeRessourcesPedagogiques) {
    const lIdListe = this.Nom + "_Liste";
    this._objetListeArborescente = new ObjetListeArborescente(
      lIdListe,
      0,
      this,
      null,
    );
    const lRacine = this._objetListeArborescente.construireRacine();
    this._objetListeArborescente.setParametres(false);
    let I,
      lTitre,
      lNoeudListeElements,
      lNoeudElement,
      lDonnee,
      lHashDate = {},
      lStrDate;
    if (this.estChronologique()) {
      const lStrDateDepuis = !!this.dateDepuis
        ? GDate.formatDate(this.dateDepuis, "%JJJJ %JJ %MMMM")
        : "";
      lTitre = GTraductions.getValeur("CahierDeTexte.depuisLe", [
        lStrDateDepuis,
      ]);
    } else {
      const lDateDebSemaine = GDate.formatDate(
        IE.Cycles.dateDebutCycle(this.domaine.getPremierePosition(true)),
        "%JJJJ %JJ %MMMM",
      );
      const lDateFinSemaine = GDate.formatDate(
        IE.Cycles.dateDernierJourOuvreCycle(
          this.domaine.getPremierePosition(true),
        ),
        "%JJJJ %JJ %MMMM",
      );
      lTitre =
        GTraductions.getValeur("Du") +
        " " +
        lDateDebSemaine +
        " " +
        GTraductions.getValeur("Au") +
        " " +
        lDateFinSemaine;
    }
    lNoeudListeElements = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
      lRacine,
      null,
      lTitre,
      "Gras",
      true,
      true,
    );
    if (aDonnees.count() > 0) {
      for (I = 0; I < aDonnees.count(); I++) {
        lDonnee = aDonnees.get(I);
        lStrDate = GDate.formatDate(lDonnee.Date, "%JJJJ %JJ %MMMM");
        if (!lHashDate[lStrDate]) {
          lTitre = lStrDate;
          lNoeudElement = lHashDate[lStrDate] =
            this._objetListeArborescente.ajouterUnNoeudAuNoeud(
              lNoeudListeElements,
              null,
              lTitre,
              "Gras",
              true,
            );
        } else {
          lNoeudElement = lHashDate[lStrDate];
        }
        if (GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_TAF) {
          _construitAccessibiliteTAF.call(this, lNoeudElement, lDonnee);
        } else {
          _construitAccessibiliteContenu.call(this, lNoeudElement, lDonnee);
        }
      }
    }
    if (GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.CDT_Contenu) {
      if (
        this.estChronologique() &&
        !!this.listeRessourcesNumeriques &&
        this.listeRessourcesNumeriques.count()
      ) {
        _construitAccessibiliteListeManuelsNumeriques.call(
          this,
          lNoeudListeElements,
          this.listeRessourcesNumeriques,
        );
      }
      if (this.estChronologique() && !!aListeRessourcesPedagogiques) {
        _construitAccessibiliteListeRessourcesPedagogiques.call(
          this,
          lNoeudListeElements,
          aListeRessourcesPedagogiques,
        );
      }
    }
    GHtml.setHtml(
      this.getNomInstance(this.IdentCahierDeTexte),
      this._objetListeArborescente.construireAffichage(),
    );
    this._objetListeArborescente.setDonnees(lRacine);
  }
}
function _initialiserCDTpourImpression(aInstance) {
  aInstance.setParametres(true, true);
  aInstance.setVisible(false);
}
function _initDetailCDT(aInstance) {
  aInstance.setOptionsFenetre({ modale: false });
}
function initDomaineChronologique(aDate) {
  const lResult = new TypeDomaine();
  let lDate;
  if (aDate) {
    lDate = aDate;
  } else {
    lDate = new Date();
    lDate.setDate(lDate.getDate() - 30);
  }
  lDate = GDate.getDateBornee(lDate);
  const lSemaine = IE.Cycles.cycleDeLaDate(lDate);
  lResult.vider();
  lResult.setValeur(true, lSemaine, TypeDomaine.C_MaxDomaineCycle);
  return lResult;
}
function _actionApresRequeteDonneesContenusCDT(aJSON) {
  const lDonnee =
    aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
      ? aJSON.ListeCahierDeTextes.getPremierElement()
      : null;
  this.listeContenuDeTAF = aJSON.ListeCahierDeTextes;
  if (lDonnee) {
    new ObjetDeserialiser().deserialiserCahierDeTexte(lDonnee);
    _afficheFenetreDetail.call(this, false, lDonnee);
  } else {
  }
}
function _actionApresRequeteDonneesTAFCDT(aParams, aJSON) {
  const lDonnee =
    aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
      ? aJSON.ListeCahierDeTextes.getPremierElement()
      : null;
  this.listeTAFDeContenu = lDonnee.ListeTravailAFaire;
  if (lDonnee) {
    _afficheFenetreDetail.call(this, true, lDonnee);
  } else {
  }
}
function _afficheFenetreDetail(aEstTAF, aDonnee) {
  const lRessource =
    aDonnee.ressources && aDonnee.ressources.getPremierElement()
      ? aDonnee.ressources.getPremierElement()
      : null;
  const lDonnee = lRessource ? lRessource.elementOriginal : aDonnee;
  this.donnee = lDonnee;
  if (this.fenetre) {
    this.fenetre.fermer();
  }
  this.fenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
    pere: this,
    evenement: function (aGenreBouton) {
      if (aGenreBouton !== 1) {
        this.donnee = null;
      }
    },
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({
        titre: aEstTAF
          ? GTraductions.getValeur("CahierDeTexte.TravailAFaire")
          : GTraductions.getValeur("CahierDeTexte.ContenuDuCours"),
        largeur: 600,
        hauteurMaxContenu: 600,
        avecScroll: true,
        listeBoutons: [GTraductions.getValeur("Fermer")],
      });
    },
  });
  $.extend(this.fenetre.controleur, {
    appelQCM: {
      event: function (aDonnee, aNumeroQCM) {
        if (aEstTAF) {
          this.surEvenementPage({
            TAFQCM: aDonnee,
            executionQCM: aNumeroQCM,
            fenetre: this.fenetre,
            contexte: true,
          });
        } else {
          this.surEvenementPage({
            CDT: aDonnee,
            executionQCM: aNumeroQCM,
            fenetre: this.fenetre,
            contexte: true,
          });
        }
      }.bind(this, lDonnee),
    },
    evenementTafFait: {
      getValue: function (aNumeroTaf) {
        const lElement = lDonnee.ListeTravailAFaire
          ? lDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTaf)
          : lDonnee;
        return lElement.TAFFait;
      },
      setValue: function (aNumeroTaf) {
        const lElement = lDonnee.ListeTravailAFaire
          ? lDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTaf)
          : lDonnee;
        if (!!lElement.TAFFait) {
          lElement.TAFFait = false;
        } else {
          lElement.TAFFait = true;
        }
        lElement.setEtat(EGenreEtat.Modification);
        new ObjetRequeteSaisieTAFFaitEleve(this)
          .lancerRequete({
            listeTAF: lDonnee.ListeTravailAFaire
              ? lDonnee.ListeTravailAFaire
              : new ObjetListeElements().add(lDonnee),
          })
          .then(() => {
            if (
              this.estHebdomadaire() &&
              this.ModeAffichage === EGenreAffichageCahierDeTextes.TravailAFaire
            ) {
              this.callback.appel();
            }
            this.fenetre.actualiser();
            let lHtml;
            lHtml = this.getInstance(this.IdentCahierDeTexte).composeTAF(
              lDonnee,
              this.fenetre.controleur,
              this.estChronologique(),
            );
            GHtml.setHtml(this.fenetre.IdContenu, lHtml, {
              controleur: this.fenetre.controleur,
            });
          });
      }.bind(this),
    },
    appelDetailTAF: {
      event: function (aNumero) {
        let lTAF = this.ListeTravailAFaire.getElementParNumero(aNumero);
        if (!lTAF) {
          lTAF = this.listeTAFDeContenu.getElementParNumero(aNumero);
          this.surEvenementPage({
            GenreBtnAction: EGenreBtnActionBlocTAF.detailTAF,
            taf: lTAF,
            objet: { fenetre: this.fenetre, contexte: lTAF },
          });
        } else {
          this.surEvenementPage({
            GenreBtnAction: EGenreBtnActionBlocTAF.detailTAF,
            taf: lTAF,
          });
        }
      }.bind(this),
    },
    appelCours: {
      event: function (aNumero) {
        let lTAF = this.ListeTravailAFaire.getElementParNumero(aNumero);
        if (!lTAF) {
          lTAF = this.listeTAFDeContenu.getElementParNumero(aNumero);
        }
        Requetes(
          "donneesContenusCDT",
          this,
          _actionApresRequeteDonneesContenusCDT,
        ).lancerRequete({ cahierDeTextes: lTAF.cahierDeTextes });
      }.bind(this),
    },
    appelTAF: {
      event: function (aNumero) {
        let lCours = this.ListeCahierDeTextes.getElementParNumero(aNumero);
        if (!lCours) {
          lCours = this.listeContenuDeTAF.getElementParNumero(aNumero);
        }
        Requetes(
          "donneesContenusCDT",
          this,
          _actionApresRequeteDonneesTAFCDT.bind(this, {
            contexte: lCours,
            pourLe: true,
          }),
        ).lancerRequete({
          cahierDeTextes: new ObjetElement("", lCours.getNumero()),
          pourTAF: true,
        });
      }.bind(this),
    },
    getCarrouselTAF(aNumeroTAF) {
      return {
        class: ObjetGalerieCarrousel,
        pere: this,
        init: (aCarrousel) => {
          aCarrousel.setOptions({
            dimensionPhoto: 250,
            nbMaxDiaposEnZoneVisible: 10,
            justifieAGauche: true,
            sansBlocLibelle: true,
            altImage: GTraductions.getValeur("CahierDeTexte.altImage.TAF"),
          });
          aCarrousel.initialiser();
        },
        start: (aCarrousel) => {
          let lTAF = lDonnee.ListeTravailAFaire
            ? lDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTAF)
            : lDonnee;
          const lListeDiapos = new ObjetListeElements();
          if (lTAF && lTAF.ListePieceJointe) {
            lTAF.ListePieceJointe.parcourir((aPJ) => {
              if (aPJ.avecMiniaturePossible) {
                let lDiapo = new ObjetElement();
                lDiapo.setLibelle(aPJ.getLibelle());
                aPJ.miniature = TypeGenreMiniature.GM_500;
                lDiapo.documentCasier = aPJ;
                lListeDiapos.add(lDiapo);
              }
            });
          }
          aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
        },
      };
    },
    getCarrouselCDC(aNumeroContenu) {
      return {
        class: ObjetGalerieCarrousel,
        pere: this,
        init: (aCarrousel) => {
          aCarrousel.setOptions({
            dimensionPhoto: 250,
            nbMaxDiaposEnZoneVisible: 10,
            justifieAGauche: true,
            sansBlocLibelle: true,
            altImage: GTraductions.getValeur("CahierDeTexte.altImage.CDC"),
          });
          aCarrousel.initialiser();
        },
        start: (aCarrousel) => {
          let lContenu;
          if (!!lDonnee.listeContenus) {
            lDonnee.listeContenus.parcourir((aCDC) => {
              if (aCDC.getNumero() === aNumeroContenu) {
                lContenu = aCDC;
              }
            });
          }
          const lListeDiapos = new ObjetListeElements();
          if (lContenu && lContenu.ListePieceJointe) {
            lContenu.ListePieceJointe.parcourir((aPJ) => {
              if (aPJ.avecMiniaturePossible) {
                let lDiapo = new ObjetElement();
                lDiapo.setLibelle(aPJ.getLibelle());
                aPJ.miniature = TypeGenreMiniature.GM_500;
                lDiapo.documentCasier = aPJ;
                lListeDiapos.add(lDiapo);
              }
            });
          }
          aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
        },
      };
    },
  });
  if (aEstTAF) {
    this.fenetre.afficher(
      this.getInstance(this.IdentCahierDeTexte).composeTAF(
        lDonnee,
        this.fenetre.controleur,
        this.estChronologique(),
      ),
    );
  } else {
    this.fenetre.afficher(
      this.getInstance(this.IdentCahierDeTexte).composeCours(
        lDonnee,
        this.estChronologique(),
      ),
    );
  }
}
function _ouvrirExecutionQCM(aExecutionQCM) {
  UtilitaireQCMPN.executerQCM(
    this.getInstance(this.identFenetreVisuQCM),
    aExecutionQCM,
  );
}
function _regrouperRessourcesPedagogiquesParType(
  aListeRessources,
  aMatiereFiltrante,
  aFiltreTheme,
) {
  const lRessourcesPedagogiquesParType = {};
  if (!!aListeRessources) {
    aListeRessources.parcourir((D) => {
      if (
        !D.matiere ||
        !aMatiereFiltrante ||
        D.matiere.getNumero() === aMatiereFiltrante.getNumero()
      ) {
        let lEstRessourceFiltree = true;
        if (aFiltreTheme) {
          lEstRessourceFiltree = false;
          if (D.ListeThemes && D.ListeThemes.count()) {
            D.ListeThemes.parcourir((aTheme) => {
              if (aTheme.getNumero() === aFiltreTheme.getNumero()) {
                lEstRessourceFiltree = true;
              }
            });
          }
        }
        if (lEstRessourceFiltree) {
          let lTypeListe;
          if (
            D.getGenre() === EGenreRessourcePedagogique.sujet ||
            D.getGenre() === EGenreRessourcePedagogique.corrige
          ) {
            lTypeListe = EGenreTypeRessourcesPedagogiques.SujetOuCorrige;
          } else if (D.getGenre() === EGenreRessourcePedagogique.travailRendu) {
            lTypeListe = EGenreTypeRessourcesPedagogiques.TravailRendu;
          } else if (D.getGenre() === EGenreRessourcePedagogique.QCM) {
            lTypeListe = EGenreTypeRessourcesPedagogiques.QCM;
          } else if (D.estForumPeda) {
            lTypeListe = EGenreTypeRessourcesPedagogiques.ForumPedagogique;
          } else if (D.getGenre() === EGenreRessourcePedagogique.kiosque) {
            lTypeListe = EGenreTypeRessourcesPedagogiques.RessourcesGranulaires;
          } else {
            lTypeListe = EGenreTypeRessourcesPedagogiques.Autre;
          }
          if (!lRessourcesPedagogiquesParType[lTypeListe]) {
            lRessourcesPedagogiquesParType[lTypeListe] =
              new ObjetListeElements();
          }
          lRessourcesPedagogiquesParType[lTypeListe].addElement(D);
        }
      }
    });
  }
  return lRessourcesPedagogiquesParType;
}
function _getIdBlocRessourcesPedagogiquePourType(aType) {
  let lIdBloc = null;
  switch (aType) {
    case EGenreTypeRessourcesPedagogiques.SujetOuCorrige:
      lIdBloc = this.idBlocSujetsCorriges;
      break;
    case EGenreTypeRessourcesPedagogiques.TravailRendu:
      lIdBloc = this.idBlocTravauxRendus;
      break;
    case EGenreTypeRessourcesPedagogiques.QCM:
      lIdBloc = this.idBlocQCM;
      break;
    case EGenreTypeRessourcesPedagogiques.ForumPedagogique:
      lIdBloc = this.idBlocForumPedagogique;
      break;
    case EGenreTypeRessourcesPedagogiques.RessourcesGranulaires:
      lIdBloc = this.idBlocRessourcesGranulaires;
      break;
    case EGenreTypeRessourcesPedagogiques.Autre:
      lIdBloc = this.idBlocDocumentsAutres;
      break;
    default:
      break;
  }
  return lIdBloc;
}
function _setInfoRessourceDeploye(aNode) {
  const lIdBloc = aNode.parent().get(0).id;
  switch (lIdBloc) {
    case this.idBlocRessourcesNumeriques:
      this.infoRessourceDeploye.ressourcesNumeriques =
        !this.infoRessourceDeploye.ressourcesNumeriques;
      break;
    case this.idBlocSujetsCorriges:
      this.infoRessourceDeploye.sujetsCorriges =
        !this.infoRessourceDeploye.sujetsCorriges;
      break;
    case this.idBlocTravauxRendus:
      this.infoRessourceDeploye.travauxRendu =
        !this.infoRessourceDeploye.travauxRendu;
      break;
    case this.idBlocQCM:
      this.infoRessourceDeploye.QCM = !this.infoRessourceDeploye.QCM;
      break;
    case this.idBlocRessourcesGranulaires:
      this.infoRessourceDeploye.ressourcesGranulaires =
        !this.infoRessourceDeploye.ressourcesGranulaires;
      break;
    case this.idBlocForumPedagogique:
      this.infoRessourceDeploye.forumPedagogique =
        !this.infoRessourceDeploye.forumPedagogique;
      break;
    case this.idBlocDocumentsAutres:
      this.infoRessourceDeploye.documentsAutres =
        !this.infoRessourceDeploye.documentsAutres;
      break;
    default:
      break;
  }
}
function _surEvenementFenetreListeTAFFaits() {
  this.actualiserPage();
}
function _construitAccessibiliteTAF(aNoeudElement, aDonnee) {
  let J,
    lIPJ,
    lTitre,
    lNoeudDonneLe,
    lNoeudMatiere,
    lNoeudPJ,
    lNbrElements,
    lPieceJointe,
    lTAF,
    lHashDateDonneLe;
  lNoeudMatiere = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
    aNoeudElement,
    null,
    aDonnee.getLibelle(),
    "",
    true,
  );
  lHashDateDonneLe = {};
  lNbrElements = aDonnee.ressources
    ? aDonnee.ressources.count()
    : this.ListeTravailAFaire.count();
  for (J = 0; J < lNbrElements; J++) {
    lTAF = aDonnee.ressources
      ? this.ListeTravailAFaire.getElementParNumero(
          aDonnee.ressources.get(J).getNumero(),
        )
      : this.ListeTravailAFaire.get(J);
    if (!lHashDateDonneLe[lTAF.DonneLe.toString()]) {
      const lNbJours = GDate.getDifferenceJours(lTAF.PourLe, lTAF.DonneLe);
      const lStrJours = (
        lNbJours > 1
          ? GTraductions.getValeur("TAFEtContenu.jours")
          : GTraductions.getValeur("TAFEtContenu.jour")
      ).toLowerCase();
      lTitre =
        GTraductions.getValeur("TAFEtContenu.donneLe") +
        GDate.formatDate(lTAF.DonneLe, " %JJ %MMMM %AAAA") +
        " [" +
        lNbJours +
        " " +
        lStrJours +
        "]";
      lNoeudDonneLe = lHashDateDonneLe[lTAF.DonneLe.toString()] =
        this._objetListeArborescente.ajouterUnNoeudAuNoeud(
          lNoeudMatiere,
          null,
          lTitre,
          "",
          false,
        );
    } else {
      lNoeudDonneLe = lHashDateDonneLe[lTAF.DonneLe.toString()];
    }
    this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
      lNoeudDonneLe,
      "",
      lTAF.descriptif,
    );
    if (lTAF.ListePieceJointe.count() > 0) {
      lNoeudPJ = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
        lNoeudDonneLe,
        null,
        GTraductions.getValeur("CahierDeTexte.documentsAConsulter"),
        "",
        false,
      );
      for (lIPJ = 0; lIPJ < lTAF.ListePieceJointe.count(); lIPJ++) {
        lPieceJointe = lTAF.ListePieceJointe.get(lIPJ);
        this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudPJ,
          "",
          GChaine.composerUrlLienExterne({ documentJoint: lPieceJointe }),
        );
      }
    }
  }
}
function _construitAccessibiliteContenu(aNoeudElement, aDonnee) {
  let i,
    lIPJ,
    lTitre,
    lNoeudContenu,
    lNoeudMatiere,
    lNoeudPJ,
    lPieceJointe,
    lElement,
    lContenu;
  lTitre =
    aDonnee.getLibelle() +
    " " +
    GTraductions.getValeur("CahierDeTexte.le") +
    GDate.formatDate(
      aDonnee.Date,
      " %JJ %MMMM %AAAA " +
        GTraductions.getValeur("CahierDeTexte.a") +
        " %hh%sh%mm",
    );
  lNoeudMatiere = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
    aNoeudElement,
    null,
    lTitre,
    "",
    true,
  );
  lElement = this.ListeCahierDeTextes.getElementParNumero(
    aDonnee.ressources.getNumero(0),
  );
  for (i = 0; i < lElement.listeContenus.count(); i++) {
    lContenu = lElement.listeContenus.get(i);
    lTitre =
      (lContenu.categorie.Libelle ? lContenu.categorie.Libelle + " - " : "") +
      lContenu.Libelle;
    lNoeudContenu = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
      lNoeudMatiere,
      null,
      lTitre,
      "",
      false,
    );
    if (lContenu.descriptif.length > 0) {
      this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
        lNoeudContenu,
        "",
        lContenu.descriptif,
      );
    }
    if (lContenu.ListePieceJointe.count() > 0) {
      lNoeudPJ = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
        lNoeudContenu,
        null,
        GTraductions.getValeur("CahierDeTexte.documentsAConsulter"),
        "",
        false,
      );
      for (lIPJ = 0; lIPJ < lContenu.ListePieceJointe.count(); lIPJ++) {
        lPieceJointe = lContenu.ListePieceJointe.get(lIPJ);
        this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudPJ,
          null,
          GChaine.composerUrlLienExterne({ documentJoint: lPieceJointe }),
        );
      }
    }
  }
}
function _construitAccessibiliteListeManuelsNumeriques(
  aNoeudElement,
  aListeManuelsNumeriques,
) {
  const lThis = this;
  const lNoeudManuelsNumeriques =
    this._objetListeArborescente.ajouterUnNoeudAuNoeud(
      aNoeudElement,
      null,
      GTraductions.getValeur(
        "CahierDeTexte.ContenuCours.RessourcesPedagogiques.RessourcesGranulaires",
      ),
      "Gras",
      true,
    );
  aListeManuelsNumeriques.parcourir((D) => {
    let lAccepteRessNum = false;
    if (
      !lThis.filtreMatiere &&
      (!D.listeMatieres || D.listeMatieres.count() === 0)
    ) {
      lAccepteRessNum = true;
    } else if (
      !!lThis.filtreMatiere &&
      !!D.listeMatieres.getElementParNumero(lThis.filtreMatiere.getNumero())
    ) {
      lAccepteRessNum = true;
    }
    if (lAccepteRessNum) {
      lThis._objetListeArborescente.ajouterUneFeuilleAuNoeud(
        lNoeudManuelsNumeriques,
        null,
        GChaine.composerUrlLienExterne({
          documentJoint: D,
          title: D.description,
          libelleEcran: D.titre,
          libelle: D.titre,
        }),
      );
    }
  });
}
function _construitAccessibiliteListeRessourcesPedagogiques(
  aNoeudElement,
  aListeRessourcesPedagogiques,
) {
  const lThis = this;
  const lNoeudRessourcesPedagogiques =
    this._objetListeArborescente.ajouterUnNoeudAuNoeud(
      aNoeudElement,
      null,
      GTraductions.getValeur(
        "CahierDeTexte.ContenuCours.RessourcesPedagogiques.ListeDesRessourcesPedagogiques",
      ),
      "Gras",
      true,
    );
  if (
    !!aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.SujetOuCorrige
    ]
  ) {
    aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.SujetOuCorrige
    ].parcourir((D) => {
      if (!!D.ressource) {
        const lStrDevoirEvaluation = [];
        if (!lThis.filtreMatiere && !!D.matiere) {
          lStrDevoirEvaluation.push(D.matiere.getLibelle(), " - ");
        }
        if (D.ressource.getGenre() === EGenreRessource.Devoir) {
          lStrDevoirEvaluation.push(
            GTraductions.getValeur(
              "CahierDeTexte.ContenuCours.RessourcesPedagogiques.DevoirDu",
              [GDate.formatDate(D.date, "%JJ/%MM/%AAAA")],
            ),
          );
        } else {
          lStrDevoirEvaluation.push(
            GTraductions.getValeur(
              "CahierDeTexte.ContenuCours.RessourcesPedagogiques.EvaluationDu",
              [GDate.formatDate(D.date, "%JJ/%MM/%AAAA")],
            ),
          );
        }
        if (!!D.ressource.commentaire) {
          lStrDevoirEvaluation.push(" - ", D.ressource.commentaire);
        }
        const lNoeudDevoirEvaluation =
          lThis._objetListeArborescente.ajouterUnNoeudAuNoeud(
            lNoeudRessourcesPedagogiques,
            null,
            lStrDevoirEvaluation.join(""),
            "Gras",
            false,
          );
        const lStrNoeudRessourcePeda =
          EGenreRessourcePedagogiqueUtil.getLibelleDeGenreEtNombre(
            D.getGenre(),
          ) +
          " : " +
          GChaine.composerUrlLienExterne({
            documentJoint: D.ressource,
            genreRessource: D.ressource.getGenre(),
            libelle: D.ressource.getLibelle(),
          });
        lThis._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudDevoirEvaluation,
          null,
          lStrNoeudRessourcePeda,
        );
      }
    });
  }
  if (
    !!aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.TravailRendu
    ]
  ) {
    aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.TravailRendu
    ].parcourir((D) => {
      if (!!D.ressource) {
        const lStrTravailARendre = [];
        if (!lThis.filtreMatiere && !!D.matiere) {
          lStrTravailARendre.push(D.matiere.getLibelle(), " - ");
        }
        lStrTravailARendre.push(
          GTraductions.getValeur(
            "CahierDeTexte.ContenuCours.RessourcesPedagogiques.TravailARendrePourLe",
            [
              !!D.ressource.pourLe
                ? GDate.formatDate(D.ressource.pourLe, "%JJ/%MM/%AAAA")
                : "",
            ],
          ),
        );
        const lNoeudTravailARendre =
          lThis._objetListeArborescente.ajouterUnNoeudAuNoeud(
            lNoeudRessourcesPedagogiques,
            null,
            lStrTravailARendre.join(""),
            "Gras",
            false,
          );
        lThis._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudTravailARendre,
          null,
          GChaine.composerUrlLienExterne({
            documentJoint: D.ressource,
            genreRessource: D.ressource.getGenre(),
            libelle: D.ressource.getLibelle(),
          }),
        );
      }
    });
  }
  if (!!aListeRessourcesPedagogiques[EGenreTypeRessourcesPedagogiques.QCM]) {
    aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.QCM
    ].parcourir((D) => {
      if (!!D.ressource && !!D.ressource.QCM) {
        const lStrQCM = [];
        if (!lThis.filtreMatiere && !!D.matiere) {
          lStrQCM.push(D.matiere.getLibelle(), " - ");
        }
        lStrQCM.push(
          GTraductions.getValeur(
            "CahierDeTexte.ContenuCours.RessourcesPedagogiques.QCMDu",
            [GDate.formatDate(D.date, "%JJ/%MM/%AAAA")],
          ),
        );
        const lNoeudQCM = lThis._objetListeArborescente.ajouterUnNoeudAuNoeud(
          lNoeudRessourcesPedagogiques,
          null,
          lStrQCM.join(""),
          "Gras",
          false,
        );
        lThis._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudQCM,
          null,
          D.ressource.QCM.getLibelle(),
        );
      }
    });
  }
  if (
    !!aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.ForumPedagogique
    ]
  ) {
    aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.ForumPedagogique
    ].parcourir((D) => {
      if (!!D.ressource) {
        const lTab = [];
        if (!this.filtreMatiere && !!D.matiere) {
          lTab.push(D.matiere.getLibelle());
        }
        lTab.push(GTraductions.getValeur("ForumPeda.TitreListeSujet"));
        if (D.date) {
          lTab.push(
            GTraductions.getValeur("ForumPeda.DernierPost") +
              " : " +
              GDate.formatDate(D.date, "[%JJJ %JJ %MMM]"),
          );
        }
        const lNoeud = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
          lNoeudRessourcesPedagogiques,
          null,
          lTab.join(" - "),
          "Gras",
          false,
        );
        lThis._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeud,
          null,
          D.ressource.getLibelle(),
        );
      }
    });
  }
  if (!!aListeRessourcesPedagogiques[EGenreTypeRessourcesPedagogiques.Autre]) {
    aListeRessourcesPedagogiques[
      EGenreTypeRessourcesPedagogiques.Autre
    ].parcourir((D) => {
      if (!!D.ressource) {
        const lStrDocumentDeposeLe = [];
        if (!lThis.filtreMatiere && !!D.matiere) {
          lStrDocumentDeposeLe.push(D.matiere.getLibelle(), " - ");
        }
        lStrDocumentDeposeLe.push(
          GTraductions.getValeur(
            "CahierDeTexte.ContenuCours.RessourcesPedagogiques.DocumentDeposeLe",
            [GDate.formatDate(D.date, "%JJ/%MM/%AAAA")],
          ),
        );
        const lNoeudDocumentAutre =
          lThis._objetListeArborescente.ajouterUnNoeudAuNoeud(
            lNoeudRessourcesPedagogiques,
            null,
            lStrDocumentDeposeLe.join(""),
            "Gras",
            false,
          );
        lThis._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudDocumentAutre,
          null,
          GChaine.composerUrlLienExterne({
            documentJoint: D.ressource,
            genreRessource: D.ressource.getGenre(),
            libelle: D.ressource.getLibelle(),
          }),
        );
      }
    });
  }
}
module.exports = { _InterfacePageCahierDeTexte };
