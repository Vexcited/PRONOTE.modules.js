const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetFenetre_ICal } = require("ObjetFenetre_ICal.js");
const { ObjetRequetePageAgenda } = require("ObjetRequetePageAgenda.js");
const MultipleObjetRequeteSaisieAgenda = require("ObjetRequeteSaisieAgenda.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { TypeGenreICal } = require("TypeGenreICal.js");
const { ObjetCycles } = require("ObjetCycles.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetListeArborescente } = require("ObjetListeArborescente.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { EGenreElementCDT } = require("Enumere_ElementCDT.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const ObjetFenetre_PieceJointe = require("ObjetFenetre_PieceJointe.js");
const { TypeHttpNotificationDonnes } = require("TypeHttpNotificationDonnes.js");
const { EEvent } = require("Enumere_Event.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const { GUID } = require("GUID.js");
const { TypeDomaine } = require("TypeDomaine.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEvtAgenda } = require("EGenreEvtAgenda.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { DonneesListe_Agenda } = require("DonneesListe_Agenda.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetTimeline } = require("ObjetTimeline.js");
const { UtilitaireHtml } = require("UtilitaireHtml.js");
const { ObjetCelluleSemaine } = require("ObjetCelluleSemaine.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { GestionnaireBlocAgenda } = require("GestionnaireBlocAgenda.js");
const { EGenreBloc, EGenreBlocUtil } = require("Enumere_Bloc.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetFenetre_SaisieAgenda } = require("ObjetFenetre_SaisieAgenda.js");
class InterfacePageAgenda extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.donnees = {
      NumeroSemaine: 0,
      libelleImpression: "",
      listeEvenements: null,
      listeFamilles: new ObjetListeElements(),
      domaineGrille: GEtatUtilisateur.getDomaineSelectionne(),
      iCal: {},
    };
    this._objGestionFocus_apresFenetreSaisieAgenda = {};
    const lJoursOuvres = new TypeEnsembleNombre().add([0, 1, 2, 3, 4, 5, 6]);
    this.ajouterEvenementGlobal(EEvent.SurPreResize, this.surPreResize);
    this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
    this.idZoneChxModeAff = GUID.getId();
    this.idBoutonAjoutElement = GUID.getId();
    this.avecToggleGrilleTimeline = true;
    this.cycles = new ObjetCycles().init({
      premiereDate: GParametres.PremiereDate,
      derniereDate: GParametres.DerniereDate,
      dateDebutPremierCycle: GParametres.dateDebutPremierCycle,
      joursOuvresParCycle: lJoursOuvres.count(),
      premierJourSemaine: GParametres.premierJourSemaine,
      joursOuvres: lJoursOuvres,
      joursFeries: GParametres.ensembleJoursFeries,
    });
  }
  surPreResize() {}
  surPostResize() {
    _actualiserAgenda.call(this, this.estHebdomadaire());
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecBtnAfficherICal() {
        return aInstance.donnees.iCal && aInstance.donnees.iCal.avecExport;
      },
      btnAfficherICal: {
        event() {
          GApplication.getMessage().afficher({
            titre: GTraductions.getValeur("infosperso.iCal.Titre"),
            type: EGenreBoiteMessage.Information,
            message: GTraductions.getValeur("infosperso.iCal.MessageBouton"),
          });
        },
        getTitle() {
          return GTraductions.getValeur("iCal.hint")[TypeGenreICal.ICal_Agenda];
        },
        getSelection() {
          return aInstance.getInstance(aInstance.IdentFenetreICal).estAffiche();
        },
      },
    });
  }
  construireInstances() {
    this.identListeAgenda = this.add(
      ObjetListe,
      _evenementSurListeAgenda.bind(this),
      _initialiserListeAgenda,
    );
    this.identAgenda = this.add(
      ObjetTimeline,
      null,
      _initialiserTimeline.bind(this),
    );
    this.identGestionnaireBlocAgenda = this.add(
      GestionnaireBlocAgenda,
      _evenementSurListeAgenda.bind(this),
      null,
    );
    this.identCelluleSemaine = this.add(
      ObjetCelluleSemaine,
      _evenementCelluleSemaine.bind(this),
      _initialiserCelluleSemaine.bind(this),
    );
    this.IdentFenetreICal = this.addFenetre(
      ObjetFenetre_ICal,
      null,
      this.initialiserFenetreICal,
    );
    if (!!GApplication.droits.get(TypeDroits.agenda.avecSaisieAgenda)) {
      this.identFenetreSaisieAgenda = this.addFenetre(
        ObjetFenetre_SaisieAgenda,
        _evenementFenetreSaisieAgenda.bind(this),
        _initialiserFenetreSaisieAgenda,
      );
      if (ObjetFenetre_PieceJointe) {
        this.identEditionPieceJointe = this.add(
          ObjetFenetre_PieceJointe,
          _evenementEditionDocumentJoint.bind(this),
        );
      }
    }
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push(
      `<div style="height:100%"><div style="height:100%;max-width:130rem" id="${this.getInstance(this.identListeAgenda).getNom()}"></div>`,
    );
    H.push(
      `<div id="${this.getInstance(this.identAgenda).getNom()}"></div></div>`,
    );
    return H.join("");
  }
  estHebdomadaire() {
    return this.modeAffichage === EModeAffichageTimeline.grille;
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identAgenda;
    const lListeRadios = [];
    lListeRadios.push({
      libelle: GTraductions.getValeur("VueChronologique"),
      value: EModeAffichageTimeline.classique,
    });
    lListeRadios.push({
      libelle: GTraductions.getValeur("VueHebdomadaire"),
      value: EModeAffichageTimeline.grille,
    });
    this.AddSurZone.push({
      html: UtilitaireHtml.composeGroupeRadiosBoutons({
        id: this.idZoneChxModeAff,
        listeRadios: lListeRadios,
        selectedValue: this.modeAffichage,
      }),
    });
    if (this.avecToggleGrilleTimeline) {
      this.AddSurZone.push(this.identCelluleSemaine);
    }
    if (
      [
        EGenreEspace.Professeur,
        EGenreEspace.Eleve,
        EGenreEspace.Parent,
        EGenreEspace.Etablissement,
        EGenreEspace.Administrateur,
        EGenreEspace.PrimParent,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.PrimDirection,
        EGenreEspace.PrimMairie,
      ].includes(GEtatUtilisateur.GenreEspace)
    ) {
      this.AddSurZone.push({ separateur: true });
      this.AddSurZone.push({
        html: UtilitaireBoutonBandeau.getHtmlBtnICal("btnAfficherICal"),
        getDisplay: "avecBtnAfficherICal",
      });
    }
  }
  actifBtnCreerElementAgenda(aNbJoursEcoules) {
    let lDate;
    if (aNbJoursEcoules === undefined) {
      lDate = GDate.aujourdhui;
    } else {
      lDate = GDate.getJour(GDate.PremierLundi, aNbJoursEcoules);
    }
    return !GDate.estAvantJour(lDate, this.donnees.dateDebutPrevisionnel);
  }
  evntDupliquerElementAgenda(aParams) {
    const lArticle = aParams;
    this.copieAgenda = MethodesObjet.dupliquer(lArticle);
    const lListe = (this.copieAgenda.listeDocJoints = new ObjetListeElements());
    lArticle.listeDocJoints.parcourir((D) => {
      if (D.getEtat() !== EGenreEtat.Suppression) {
        const lElement = MethodesObjet.dupliquer(D);
        if (lElement.getEtat() === EGenreEtat.Aucun) {
          lElement.setEtat(EGenreEtat.Creation);
        }
        lListe.addElement(lElement);
      }
    });
    const lAgenda = MethodesObjet.dupliquer(this.copieAgenda);
    lAgenda.avecModificationPublic = true;
    lAgenda.Etat = EGenreEtat.Aucun;
    lAgenda.Numero = null;
    lAgenda.setEtat(EGenreEtat.Creation);
    const lDateDebutOrigine = lAgenda.DateDebut,
      lDateFinOrigine = lAgenda.DateFin,
      lEcartJour = GDate.getNbrJoursEntreDeuxDates(
        lAgenda.DateDebut,
        lAgenda.DateFin,
      );
    const aJour = GDate.getNbrJoursDepuisPremiereLundi(GDate.aujourdhui) % 7;
    lAgenda.DateDebut = new Date(
      this.cycles.jourCycleEnDate(
        aJour,
        this.cycles.cycleDeLaDate(GDate.aujourdhui),
      ),
    );
    lAgenda.DateFin = GDate.getDateBornee(
      GDate.getJourSuivant(lAgenda.DateDebut, lEcartJour),
    );
    lAgenda.DateDebut.setHours(lDateDebutOrigine.getHours());
    lAgenda.DateDebut.setMinutes(lDateDebutOrigine.getMinutes());
    lAgenda.DateFin.setHours(lDateFinOrigine.getHours());
    lAgenda.DateFin.setMinutes(lDateFinOrigine.getMinutes());
    this.getInstance(this.identFenetreSaisieAgenda).setDonnees({
      agenda: lAgenda,
      listeClassesGroupes: this.donnees.listeClassesGroupes,
      etat: EGenreEtat.Creation,
      avecSaisie: true,
      listePJ: this.listePiecesJointes,
      listeFamilles: this.donnees.listeFamilles,
      listeJourDansMois: this.donnees.listeJourDansMois,
      genreEvt: lAgenda.estPeriodique
        ? EGenreEvtAgenda.surEvtUniquement
        : EGenreEvtAgenda.nonPeriodique,
      dateDebutAgenda: this.donnees.dateDebutPrevisionnel,
      dateFinAgenda: this.donnees.dateFinPrevisionnel,
    });
  }
  evntBtnCreerElementAgenda(aNbJoursEcoules) {
    let lJourDeSemaine;
    let lDate;
    if (aNbJoursEcoules === undefined) {
      lJourDeSemaine =
        GDate.getNbrJoursDepuisPremiereLundi(GDate.aujourdhui) % 7;
      lDate = GDate.aujourdhui;
    } else {
      lJourDeSemaine = aNbJoursEcoules % 7;
      lDate = GDate.getJour(GDate.PremierLundi, aNbJoursEcoules);
    }
    const lAgendaVierge = _getEvenementParDefaut.bind(this)(
      lJourDeSemaine,
      lDate,
    );
    this.getInstance(this.identFenetreSaisieAgenda).setDonnees({
      agenda: lAgendaVierge,
      listeClassesGroupes: this.donnees.listeClassesGroupes,
      etat: EGenreEtat.Creation,
      avecSaisie: true,
      listePJ: this.listePiecesJointes,
      listeFamilles: this.donnees.listeFamilles,
      listeJourDansMois: this.donnees.listeJourDansMois,
      genreEvt: EGenreEvtAgenda.nonPeriodique,
      dateDebutAgenda: this.donnees.dateDebutPrevisionnel,
      dateFinAgenda: this.donnees.dateFinPrevisionnel,
    });
  }
  initialiserFenetreICal(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("iCal.fenetre.titre"),
      largeur: 425,
      hauteur: 265,
      listeBoutons: [GTraductions.getValeur("Fermer")],
    });
    aInstance.setGenreICal(TypeGenreICal.ICal_Agenda);
  }
  recupererDonnees() {
    this.afficherPage();
  }
  afficherPage() {
    this.setEtatSaisie(false);
    this.selection = null;
    new ObjetRequetePageAgenda(
      this,
      this.surReponseRequetePageAgenda,
    ).lancerRequete(this.donnees.NumeroSemaine);
  }
  getPageImpression() {
    if (GEtatUtilisateur.estModeAccessible()) {
      return this._objetListeArborescente.getListeArborescente().outerHTML;
    } else {
      return {
        titre1: this.estHebdomadaire() ? this.donnees.libelleImpression : "",
        contenu: this.composePageImpression(),
      };
    }
  }
  composePageImpression() {
    const T = [];
    const lFormatDate = "%JJJ %JJ %MMM";
    let dateCourante = this.donnees.dateDebutPrevisionnel;
    let dateDebut = this.donnees.dateDebutPrevisionnel;
    let dateFin = this.donnees.dateFinPrevisionnel;
    if (this.estHebdomadaire()) {
      dateDebut = this.cycles.dateDebutCycle(
        GEtatUtilisateur.getDomaineSelectionne().getPremierePosition(),
      );
      dateFin = this.cycles.dateFinCycle(
        GEtatUtilisateur.getDomaineSelectionne().getPremierePosition(),
      );
    }
    T.push(
      '<div style="height:100%;width:calc(100% - 13px);overflow:hidden;">',
    );
    for (let i = 0; i < this.donnees.listeEvenements.count(); i++) {
      const elt = this.donnees.listeEvenements.get(i);
      const lParams = { sansHoraire: elt.sansHoraire, sansCrochet: true };
      const strDate = GDate.strDates(elt.DateDebut, elt.DateFin, lParams);
      if (GDate.dateEntreLesDates(elt.DateDebut, dateDebut, dateFin)) {
        const lArrondiTop = "border-top-left-radius: 20px 30px;";
        const lArrondiBottom = "border-bottom-left-radius: 20px 30px;";
        const lCouleurBloc = GCouleur.themeNeutre.legere2;
        if (
          GDate.getNbrJoursEntreDeuxDates(elt.DateDebut, dateCourante) !== 0
        ) {
          T.push(
            '<div style="width:100%;padding:10px 0 10px 5px;',
            GStyle.composeCouleurFond(lCouleurBloc),
            '">',
          );
          T.push(GDate.formatDate(elt.DateDebut, lFormatDate));
          T.push("</div>");
          dateCourante = elt.DateDebut;
        }
        T.push('<div style="width:100%;margin:0 5px 0 5px;" class="Espace">');
        T.push('<div style="display:inline-flex">');
        T.push(
          '<div class="celluleMarqueur" style="width: 8px; background-color:',
          elt.CouleurCellule,
          "; ",
          lArrondiTop,
          " ",
          lArrondiBottom,
          ' ">&nbsp;</div>',
        );
        T.push(
          '<div style="background-color : #ffffff; color : black; width: calc(100% - 6px);"><div class="Espace"><div class="Bloc_Titre">',
        );
        T.push(elt.getLibelle());
        T.push("</div>");
        T.push('<div class="Bloc_SSTitre">');
        T.push(strDate);
        T.push("</div></div></div></div>");
        T.push("</div>");
        T.push('<div style="width:100%" class="Espace">');
        T.push(
          elt.Commentaire
            ? GChaine.replaceRCToHTML(elt.Commentaire)
            : GTraductions.getValeur("Agenda.EvenementVide"),
        );
        T.push("</div>");
      }
    }
    T.push("</div>");
    return T.join("");
  }
  initDomaineChronologique(aDate) {
    const lResult = new TypeDomaine();
    const lSemaine = this.cycles.cycleDeLaDate(aDate);
    lResult.vider();
    lResult.setValeur(true, lSemaine, lSemaine);
    return lResult;
  }
  setLibelleImpression(aNumeroSemaine) {
    this.donnees.libelleImpression = this.Pere.getLibelleSousOnglet(
      GDate.strSemaineSelonCycle(
        this.cycles,
        aNumeroSemaine,
        "%JJ/%MM/%AA",
        "%JJ/%MM/%AA",
        GTraductions.getValeur("Agenda.SemaineDu") + " ",
        " " + GTraductions.getValeur("Au") + " ",
      ),
      true,
      true,
      true,
    );
  }
  surReponseRequetePageAgenda(aParam) {
    this.donnees.listeEvenements = aParam.listeEvenements;
    this.donnees.listeEvenements.setTri([
      ObjetTri.init((D) => {
        if (!D.DateDebut) {
          return false;
        }
        return (
          new Date(
            D.DateDebut.getFullYear(),
            D.DateDebut.getMonth(),
            D.DateDebut.getDate(),
          ),
          EGenreTriElement.Decroissant
        );
      }),
      ObjetTri.init((D) => {
        if (!D.DateDebut) {
          return false;
        }
        return (
          !D.sansHoraire && D.DateDebut.getTime(), EGenreTriElement.Croissant
        );
      }),
    ]);
    this.donnees.listeEvenements.trier();
    this.donnees.listeFamilles = aParam.listeFamilles;
    this.donnees.listeJourDansMois = aParam.listeJourDansMois;
    this.donnees.listeClassesGroupes = MethodesObjet.dupliquer(
      aParam.listeClassesGroupes,
    );
    this.donnees.dateDebutPrevisionnel = aParam.dateDebutPrevisionnel;
    this.donnees.dateFinPrevisionnel = aParam.dateFinPrevisionnel;
    this.setEtatSaisie(false);
    if (
      GEtatUtilisateur.listeDonnees &&
      GEtatUtilisateur.listeDonnees[
        TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
      ]
    ) {
      this.listePiecesJointes = MethodesObjet.dupliquer(
        GEtatUtilisateur.listeDonnees[
          TypeHttpNotificationDonnes.THND_ListeDocJointEtablissement
        ],
      );
    }
    this.donnees.iCal = {
      avecExport: !!aParam.avecExportICal,
      parametresExport: aParam.parametreExportICal,
    };
    const lJoursOuvres = new TypeEnsembleNombre().add([0, 1, 2, 3, 4, 5, 6]);
    this.cycles = new ObjetCycles().init({
      premiereDate: this.donnees.dateDebutPrevisionnel,
      derniereDate: this.donnees.dateFinPrevisionnel,
      dateDebutPremierCycle: GParametres.dateDebutPremierCycle,
      joursOuvresParCycle: lJoursOuvres.count(),
      premierJourSemaine: GParametres.premierJourSemaine,
      joursOuvres: lJoursOuvres,
      joursFeries: GParametres.ensembleJoursFeries,
    });
    _afficherCacher.call(this, false);
    this.getInstance(this.identCelluleSemaine).setParametresObjetCelluleSemaine(
      1,
      this.cycles,
    );
    this.getInstance(
      this.identCelluleSemaine,
    ).setParametresDateDebutPersonnalise(this.donnees.dateDebutPrevisionnel);
    this.getInstance(this.identCelluleSemaine).setParametresDateFinPersonnalise(
      this.donnees.dateFinPrevisionnel,
    );
    _initialiserTimeline.call(
      this,
      this.getInstance(this.identAgenda),
      this.donnees.dateFinPrevisionnel,
    );
    EGenreBlocUtil.associerGenreBlocAListeElements(
      EGenreBloc.Agenda,
      this.donnees.listeEvenements,
    );
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Normale,
      this,
    );
    _actualiserAgenda.bind(this)(this.estHebdomadaire());
    const lDate = this.dateCourante || GDate.aujourdhui;
    this.getInstance(this.identCelluleSemaine).setVisible(
      this.estHebdomadaire() && !GEtatUtilisateur.estModeAccessible(),
    );
    const lDomaine = this.initDomaineChronologique(lDate);
    GEtatUtilisateur.setDomaineSelectionne(lDomaine);
    this.getInstance(this.identCelluleSemaine).setDonnees(lDate);
    this.donnees.domaineGrille = lDomaine;
    this.setLibelleImpression(this.cycles.cycleDeLaDate(lDate));
    $("#" + this.idZoneChxModeAff.escapeJQ() + " > input")
      .off("change")
      .on("change", _evenementChxModeAff.bind(this));
  }
  valider() {
    const lInstancePJ = this.getInstance(this.identEditionPieceJointe);
    if (MultipleObjetRequeteSaisieAgenda) {
      new MultipleObjetRequeteSaisieAgenda.ObjetRequeteSaisieAgenda(
        this,
        this.actionSurValidation,
      )
        .addUpload({
          listeFichiers: lInstancePJ.ListeFichiers,
          listeDJCloud: this.listePiecesJointes,
          callback: function () {
            lInstancePJ.reset();
          },
        })
        .lancerRequete({
          listeEvenements: this.donnees.listeEvenements,
          listePiecesJointes: this.listePiecesJointes,
        });
    }
  }
  _gestionFocusApresFenetreSaisieAgenda(aParams) {
    if (aParams.numeroBouton !== 1 || this.estHebdomadaire()) {
      return;
    }
    if (aParams.evenement) {
      this._objGestionFocus_apresFenetreSaisieAgenda.element =
        aParams.evenement;
    }
    if (aParams.numeroEvenementSaisie) {
      this._objGestionFocus_apresFenetreSaisieAgenda.numero =
        aParams.numeroEvenementSaisie;
    }
  }
  scrollToListeAgenda(aIndice) {
    this.getInstance(this.identListeAgenda).scrollTo({ ligne: aIndice });
  }
  getIndiceParElement(aArticle) {
    if (!aArticle || !aArticle.getNumero || !aArticle.getGenre) {
      return null;
    }
    const lObjetListe = this.getInstance(this.identListeAgenda);
    const lListe = lObjetListe.getDonneesListe().Donnees;
    const lIndice = lListe.getIndiceParNumeroEtGenre(
      aArticle.getNumero(),
      aArticle.getGenre(),
      true,
    );
    return lIndice;
  }
  afficherListeAccessible(aNom) {
    this._objetListeArborescente = new ObjetListeArborescente(
      this.Nom + "_Liste",
      0,
      this,
      null,
    );
    const lRacine = this._objetListeArborescente.construireRacine();
    this._objetListeArborescente.setParametres(false);
    const lTitre = GDate.strDates(
      this.donnees.dateDebutPrevisionnel,
      this.donnees.dateFinPrevisionnel,
      { formatDate: "%JJJJ %JJ %MMMM" },
    );
    const lNoeud = this._objetListeArborescente.ajouterUnNoeudAuNoeud(
      lRacine,
      "",
      lTitre,
      "Gras",
      true,
      true,
    );
    if (
      !!this.donnees.listeEvenements &&
      this.donnees.listeEvenements.count() > 0
    ) {
      for (let I = 0; I < this.donnees.listeEvenements.count(); I++) {
        const lElement = this.donnees.listeEvenements.get(I);
        const lNoeudElement =
          this._objetListeArborescente.ajouterUnNoeudAuNoeud(
            lNoeud,
            "",
            lElement.getLibelle(),
            "Gras",
          );
        if (lElement.listeEleves && lElement.listeEleves.length > 0) {
          this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
            lNoeudElement,
            "",
            lElement.listeEleves.join(", "),
          );
        }
        this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudElement,
          "",
          this.donnees.listeEvenements
            ._getLibelleEvenement({ evenement: lElement })
            .join("<br>"),
        );
        this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
          lNoeudElement,
          "",
          lElement.listeDocJoints && lElement.listeDocJoints.count() > 0
            ? _composeDocumentAccessible(lElement.listeDocJoints)
            : "",
        );
      }
    } else {
      this._objetListeArborescente.ajouterUneFeuilleAuNoeud(
        lRacine,
        "",
        GTraductions.getValeur("Agenda.AucunEvenement"),
      );
    }
    GHtml.setHtml(aNom, this._objetListeArborescente.construireAffichage());
    this._objetListeArborescente.setDonnees(lRacine);
  }
  mettreAJourGrille(aDomaine) {
    if (aDomaine && this.modeAffichage === EModeAffichageTimeline.grille) {
      const lDateDebut = this.cycles.dateDebutCycle(
        aDomaine.getPremierePosition(),
      );
      let lDateFin = this.cycles.dateFinCycle(aDomaine.getPremierePosition());
      lDateFin = GDate.estAvantJour(lDateFin, this.donnees.dateFinPrevisionnel)
        ? lDateFin
        : this.donnees.dateFinPrevisionnel;
      const lParams = {
        debutGrille: lDateDebut,
        finGrille: lDateFin,
        modeAffichage: EModeAffichageTimeline.grille,
        avecBoutonsFixes: true,
      };
      if (GApplication.droits.get(TypeDroits.agenda.avecSaisieAgenda)) {
        const lListeBoutons = new ObjetListeElements();
        const lBouton = new ObjetElement();
        lBouton.libelleHTML = this.libelleTravailOuActivite;
        lBouton.libelleAujourdHui =
          '<span class="EspaceGauche Texte12 AlignementMilieuVertical">' +
          GTraductions.getValeur(
            "CahierDeTexte.AjoutActiviteAujourdhui",
          ).replaceRCToHTML() +
          "</span>";
        lBouton.icon = "icon_plus_fin";
        lBouton.hint = GTraductions.getValeur(
          "Fenetre_SaisieAgenda.NouvelEvenement",
        );
        lBouton.callback = this.evntBtnCreerElementAgenda.bind(this);
        lBouton.getActif = this.actifBtnCreerElementAgenda.bind(this);
        lBouton.theme = TypeThemeBouton.primaire;
        lListeBoutons.addElement(lBouton);
        lParams.listeBoutons = lListeBoutons;
        lParams.creationEvenement = {
          interfacePere: this.Nom,
          callback: "evntBtnCreerElementAgenda",
        };
      }
      this.getInstance(this.identAgenda).setOptions(lParams);
      this.getInstance(this.identAgenda).setDonnees({
        liste: this.donnees.listeEvenements,
        gestionnairesBlocs: [
          this.getInstance(this.identGestionnaireBlocAgenda),
        ],
        dateCourante: GDate.aujourdhui,
      });
    }
  }
}
function _initialiserListeAgenda(aInstance) {
  aInstance.setOptionsListe({
    skin: ObjetListe.skin.flatDesign,
    avecLigneCreation: !!GApplication.droits.get(
      TypeDroits.agenda.avecSaisieAgenda,
    ),
    titreCreation: GTraductions.getValeur("Agenda.CreerEvenement"),
    messageContenuVide: GTraductions.getValeur("Agenda.AucunEvenementPublie"),
  });
}
function _composeDocumentAccessible(aListeDocumentsJoints) {
  const lHtml = [];
  for (let I = 0; I < aListeDocumentsJoints.count(); I++) {
    const lDocumentJoint = aListeDocumentsJoints.get(I);
    lHtml.push(
      GChaine.composerUrlLienExterne({
        documentJoint: lDocumentJoint,
        genreRessource: EGenreRessource.DocJointEtablissement,
      }),
    );
  }
  return lHtml.join(", ");
}
function _evenementSurListeAgenda(aParams) {
  const lArticle = aParams.article;
  let lGenreEvt;
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.Creation:
      if (aParams.estDuplication) {
        this.evntDupliquerElementAgenda(lArticle);
        return;
      }
      this.evntBtnCreerElementAgenda();
      break;
    case EGenreEvenementListe.Edition:
      if (lArticle.estPeriodique) {
        lGenreEvt = EGenreEvtAgenda.surEvtUniquement;
        GApplication.getMessage().afficher({
          type: EGenreBoiteMessage.Confirmation,
          message: _composeMessage(true),
          controleur: {
            RDEvenement: {
              getValue: function (aIndice) {
                return lGenreEvt === aIndice;
              },
              setValue: function (aIndice) {
                lGenreEvt = aIndice;
              },
            },
          },
          callback: function (aGenreAction) {
            if (aGenreAction === EGenreAction.Valider) {
              _callbackFenetreSaisieAgenda.bind(this)(lArticle, lGenreEvt);
            }
          }.bind(this),
        });
      } else {
        _callbackFenetreSaisieAgenda.bind(this)(
          lArticle,
          EGenreEvtAgenda.nonPeriodique,
        );
      }
      break;
    case EGenreEvenementListe.Suppression:
      if (lArticle.proprietaire) {
        if (lArticle.estPeriodique) {
          lGenreEvt = EGenreEvtAgenda.surEvtUniquement;
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: _composeMessage(false),
            controleur: {
              RDEvenement: {
                getValue: function (aIndice) {
                  return lGenreEvt === aIndice;
                },
                setValue: function (aIndice) {
                  lGenreEvt = aIndice;
                },
              },
            },
            callback: function (aGenreAction) {
              if (aGenreAction === EGenreAction.Valider) {
                _callbackSupprimerAgenda.bind(this)(lArticle, lGenreEvt);
              }
            }.bind(this),
          });
        } else {
          lGenreEvt = EGenreEvtAgenda.nonPeriodique;
          const H = [];
          H.push(
            '<div class="Gras">',
            GTraductions.getValeur("Agenda.AgendaSuppressionEvt"),
            "</div>",
          );
          H.push(
            '<div class="GrandEspaceHaut">',
            GTraductions.getValeur("Agenda.AgendaConfirmerSupp"),
            "</div>",
          );
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: H.join(""),
            callback: function (aGenreAction) {
              if (aGenreAction === EGenreAction.Valider) {
                _callbackSupprimerAgenda.bind(this)(lArticle, lGenreEvt);
              }
            }.bind(this),
          });
        }
      }
      break;
  }
}
function _composeMessage(aEstModif) {
  const H = [];
  H.push(
    '<div class="Gras">',
    GTraductions.getValeur("Agenda.AgendaAttentionEvtPeriodique"),
    "</div>",
  );
  H.push(
    '<div class="GrandEspaceHaut">',
    aEstModif
      ? GTraductions.getValeur("Agenda.AgendaEvtPeriodiqueConfirmerModif")
      : GTraductions.getValeur("Agenda.AgendaEvtPeriodiqueConfirmerSupp"),
    "</div>",
  );
  H.push('<div class="EspaceHaut EspaceGauche">');
  H.push(
    '<div><ie-radio ie-model="RDEvenement(',
    EGenreEvtAgenda.surEvtUniquement,
    ')" class="EspaceHaut">',
    GTraductions.getValeur("Agenda.AgendaSupprimerEvtUniquementOpt1"),
    "</ie-radio></div>",
  );
  H.push(
    '<div><ie-radio ie-model="RDEvenement(',
    EGenreEvtAgenda.surTouteLaSerie,
    ')" class="EspaceHaut">',
    GTraductions.getValeur("Agenda.AgendaSupprimerTousEvtsDeLaSerieOpt2"),
    "</ie-radio></div>",
  );
  H.push("</div>");
  return H.join("");
}
function _callbackFenetreSaisieAgenda(aElement, aGenreEvt) {
  this.getInstance(this.identFenetreSaisieAgenda).setDonnees({
    agenda: aElement,
    listeClassesGroupes: this.donnees.listeClassesGroupes,
    etat: EGenreEtat.Modification,
    avecSaisie: true,
    listePJ: this.listePiecesJointes,
    listeFamilles: this.donnees.listeFamilles,
    listeJourDansMois: this.donnees.listeJourDansMois,
    genreEvt: aGenreEvt,
    dateDebutAgenda: this.donnees.dateDebutPrevisionnel,
    dateFinAgenda: this.donnees.dateFinPrevisionnel,
  });
}
function _callbackSupprimerAgenda(aElementAgenda, aGenreEvt) {
  if (MultipleObjetRequeteSaisieAgenda) {
    aElementAgenda.setEtat(EGenreEtat.Suppression);
    if (aGenreEvt !== EGenreEvtAgenda.nonPeriodique) {
      aElementAgenda.periodicite.estEvtPerso =
        aGenreEvt === EGenreEvtAgenda.surEvtUniquement;
    }
    this.dateCourante = aElementAgenda.DateDebut;
    new MultipleObjetRequeteSaisieAgenda.ObjetRequeteSaisieAgenda(
      this,
      this.actionSurValidation,
    ).lancerRequete({
      listeEvenements: this.donnees.listeEvenements,
      listePiecesJointes: this.listePiecesJointes,
    });
  }
}
function _getEvenementParDefaut(aJourDeSemaine, aDate) {
  const lEvenement = new ObjetElement("");
  lEvenement.setEtat(EGenreEtat.Creation);
  lEvenement.DateDebut = new Date(aDate);
  lEvenement.DateFin = new Date(aDate);
  lEvenement.DateDebut.setHours(9);
  lEvenement.DateFin.setHours(17);
  lEvenement.DateDebut.setMinutes(0);
  lEvenement.DateFin.setMinutes(0);
  lEvenement.sansHoraire = true;
  lEvenement.publie = true;
  lEvenement.proprietaire = true;
  lEvenement.Commentaire = "";
  const lFamille = this.donnees.listeFamilles.get(0);
  lEvenement.famille = lFamille;
  lEvenement.CouleurCellule = lFamille ? lFamille.couleur : "#FFFF00";
  lEvenement.genresPublicEntite = new TypeEnsembleNombre();
  lEvenement.avecElevesRattaches = false;
  lEvenement.listePublicEntite = new ObjetListeElements();
  lEvenement.listePublicIndividu = new ObjetListeElements();
  if (GEtatUtilisateur.pourPrimaire()) {
    lEvenement.avecDirecteur = true;
  }
  lEvenement.Public = {
    listeClassesGroupes: new ObjetListeElements(),
    listeProfs: new ObjetListeElements(),
  };
  lEvenement.listeDocJoints = new ObjetListeElements();
  return lEvenement;
}
function _initialiserFenetreSaisieAgenda(aInstance) {
  aInstance.setOptionsFenetre({
    largeur: 360,
    avecTailleSelonContenu: true,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
}
function _initialiserCelluleSemaine(aInstance) {
  aInstance.setParametresObjetCelluleSemaine(1);
  aInstance.setVisible(false);
}
function _initialiserTimeline(aInstance, aDateFin) {
  const lDateFin = !!aDateFin ? aDateFin : GParametres.DerniereDate;
  this.modeAffichage = GEtatUtilisateur.ChoixAffichageAgenda
    ? GEtatUtilisateur.ChoixAffichageAgenda
    : EModeAffichageTimeline.classique;
  const lParams = {
    modeAffichage: this.modeAffichage,
    avecBoutonsFixes: true,
    finGrille: lDateFin,
  };
  if (GApplication.droits.get(TypeDroits.agenda.avecSaisieAgenda)) {
    lParams.creationEvenement = {
      interfacePere: this.Nom,
      callback: "evntBtnCreerElementAgenda",
    };
  }
  aInstance.setOptions(lParams);
}
function _evenementCelluleSemaine(aDomaine) {
  if (this.estHebdomadaire() && aDomaine) {
    GEtatUtilisateur.setDomaineSelectionne(aDomaine);
    this.donnees.domaineGrille = aDomaine;
    this.setLibelleImpression(GEtatUtilisateur.getSemaineSelectionnee());
  }
  if (!GEtatUtilisateur.estModeAccessible()) {
    this.mettreAJourGrille(this.donnees.domaineGrille);
  }
}
function _evenementChxModeAff(aObjet) {
  const lModeAffichageSelectionne = parseInt($(aObjet.target).val());
  this.modeAffichage = lModeAffichageSelectionne;
  this.getInstance(this.identCelluleSemaine).setVisible(
    this.estHebdomadaire() && !GEtatUtilisateur.estModeAccessible(),
  );
  if (!GEtatUtilisateur.estModeAccessible()) {
    this.mettreAJourGrille(this.donnees.domaineGrille);
  }
  ControleSaisieEvenement(
    _retourSurNavigation.bind(this, lModeAffichageSelectionne),
  );
}
function _retourSurNavigation(aGenreAff) {
  GEtatUtilisateur.ChoixAffichageAgenda = aGenreAff;
  if (!GEtatUtilisateur.estModeAccessible()) {
    if (this.estHebdomadaire()) {
      _afficherCacher.call(this, true);
      this.mettreAJourGrille(this.donnees.domaineGrille);
    } else {
      _afficherCacher.call(this, false);
      _actualiserAgenda.call(this, this.estHebdomadaire());
    }
  }
}
function _evenementFenetreSaisieAgenda(aParametres) {
  if (aParametres.numeroBouton === 1) {
    if (aParametres.evenement) {
      this.dateCourante = aParametres.evenement.DateDebut;
    }
    new ObjetRequetePageAgenda(
      this,
      this.surReponseRequetePageAgenda,
    ).lancerRequete(this.donnees.NumeroSemaine);
  }
  this._gestionFocusApresFenetreSaisieAgenda(aParametres);
}
function _actualiserAgenda(aEstGrille) {
  if (GEtatUtilisateur.estModeAccessible()) {
    this.afficherListeAccessible(this.getNomInstance(this.identListeAgenda));
  } else if (!!aEstGrille) {
    _afficherCacher.call(this, aEstGrille);
    const positionnerSurDate = this.dateCourante
      ? this.dateCourante
      : GDate.aujourdhui;
    this.getInstance(this.identAgenda).setDonnees({
      liste: this.donnees.listeEvenements,
      gestionnairesBlocs: [this.getInstance(this.identGestionnaireBlocAgenda)],
      dateCourante: positionnerSurDate,
    });
  } else {
    this.getInstance(this.identListeAgenda).setDonnees(
      new DonneesListe_Agenda(this.donnees.listeEvenements, {
        eventDupliquer: this.evntDupliquerElementAgenda.bind(this),
      }),
    );
    if (
      this._objGestionFocus_apresFenetreSaisieAgenda &&
      this._objGestionFocus_apresFenetreSaisieAgenda.element
    ) {
      let lIndice;
      if (this._objGestionFocus_apresFenetreSaisieAgenda.numero) {
        lIndice = this.getInstance(this.identListeAgenda)
          .getDonneesListe()
          .Donnees.getIndiceParNumeroEtGenre(
            this._objGestionFocus_apresFenetreSaisieAgenda.numero,
          );
      } else {
        lIndice = this.getIndiceParElement(
          this._objGestionFocus_apresFenetreSaisieAgenda.element,
        );
      }
      if (lIndice) {
        this.scrollToListeAgenda(lIndice);
        this._objGestionFocus_apresFenetreSaisieAgenda = {};
        return;
      }
    }
    const lEvenementLePlusProche = _getJourLePlusProche(
      this.donnees.listeEvenements,
      GDate.aujourdhui,
    );
    if (
      lEvenementLePlusProche &&
      lEvenementLePlusProche.element &&
      MethodesObjet.isNumeric(lEvenementLePlusProche.indice)
    ) {
      this.scrollToListeAgenda(lEvenementLePlusProche.indice);
    }
  }
}
function _getJourLePlusProche(aListeElements, aDateCible) {
  let lElementLePlusProche = null;
  let lIndiceElementLePlusProche = null;
  let lEcrartEntreElementEtDateCiblelePlusProche = Infinity;
  const lDateCibleSansHeure = new Date(
    aDateCible.getFullYear(),
    aDateCible.getMonth(),
    aDateCible.getDate(),
  );
  if (aListeElements && aListeElements.parcourir) {
    aListeElements.parcourir((aElement, aIndex) => {
      if (!aElement.DateDebut) {
        return;
      }
      const lDateSansHeure = new Date(
        aElement.DateDebut.getFullYear(),
        aElement.DateDebut.getMonth(),
        aElement.DateDebut.getDate(),
      );
      const lEcrartEntreElementEtDateCible =
        lDateSansHeure - lDateCibleSansHeure;
      if (
        lEcrartEntreElementEtDateCible >= 0 &&
        lEcrartEntreElementEtDateCible <=
          lEcrartEntreElementEtDateCiblelePlusProche
      ) {
        lEcrartEntreElementEtDateCiblelePlusProche =
          lEcrartEntreElementEtDateCible;
        lElementLePlusProche = aElement;
        lIndiceElementLePlusProche = aIndex;
      }
    });
  }
  return { element: lElementLePlusProche, indice: lIndiceElementLePlusProche };
}
function _afficherCacher(aEstGrille) {
  if (aEstGrille) {
    $(_getIdInstance.call(this, this.identListeAgenda)).hide();
    $(_getIdInstance.call(this, this.identAgenda)).show();
  } else {
    $(_getIdInstance.call(this, this.identAgenda)).hide();
    $(_getIdInstance.call(this, this.identListeAgenda)).show();
  }
}
function _getIdInstance(aInstance) {
  return "#" + this.getInstance(aInstance).getNom().escapeJQ();
}
function _evenementEditionDocumentJoint(aNumeroBouton) {
  if (aNumeroBouton === 1) {
  } else {
    this.getInstance(this.identFenetreSaisieAgenda).majPiecesJointes(
      this.listePiecesJointes,
    );
  }
  for (let I = 0; I < this.listeDocumentsJoints.count(); I++) {
    let lDocumentJoint = this.listeDocumentsJointsActive.getElementParNumero(
      this.listeDocumentsJoints.getNumero(I),
    );
    const lActif =
      this.listeDocumentsJoints.get(I).Actif &&
      this.listeDocumentsJoints.existe(I);
    if (lDocumentJoint) {
      if (!lActif) {
        lDocumentJoint.setEtat(EGenreEtat.Suppression);
        if (this.genreElementSelectionne === EGenreElementCDT.Contenu) {
          if (this.contenuCourant.Numero === null) {
            this.contenuCourant.setEtat(EGenreEtat.Creation);
          } else {
            this.contenuCourant.setEtat(EGenreEtat.Modification);
          }
        } else {
          if (this.tafCourant.Numero === null) {
            this.tafCourant.setEtat(EGenreEtat.Creation);
          } else {
            this.tafCourant.setEtat(EGenreEtat.Modification);
          }
        }
      }
    } else {
      if (lActif) {
        lDocumentJoint = new ObjetElement(this.listeDocumentsJoints.get(I));
        lDocumentJoint.url = this.listeDocumentsJoints.get(I).url;
        lDocumentJoint.setEtat(EGenreEtat.Creation);
        if (this.genreElementSelectionne === EGenreElementCDT.Contenu) {
          if (this.contenuCourant.Numero === null) {
            this.contenuCourant.setEtat(EGenreEtat.Creation);
          } else {
            this.contenuCourant.setEtat(EGenreEtat.Modification);
          }
        } else {
          if (this.tafCourant.Numero === null) {
            this.tafCourant.setEtat(EGenreEtat.Creation);
          } else {
            this.tafCourant.setEtat(EGenreEtat.Modification);
          }
        }
        this.listeDocumentsJointsActive.addElement(lDocumentJoint);
      }
    }
  }
  this.listeDocumentsJointsActive.trier();
  if (this.genreElementSelectionne === EGenreElementCDT.Contenu) {
    this.getInstance(
      this.identContenus[this.indiceElementSelectionne],
    ).actualiserContenu(
      this.contenuCourant,
      false,
      this.avecDocumentJoint,
      false,
    );
  } else {
    this.getInstance(
      this.identContenus[this.indiceElementSelectionne],
    ).actualiserTAF(this.tafCourant, false, this.avecDocumentJoint, false);
  }
}
module.exports = { InterfacePageAgenda };
