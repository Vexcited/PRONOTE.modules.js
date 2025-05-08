const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreDomaineInformation } = require("Enumere_DomaineInformation.js");
const { ObjetRequeteSaisie } = require("ObjetRequeteJSON.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { ObjetFenetre_ChargeTAF } = require("ObjetFenetre_ChargeTAF.js");
const {
  ObjetFenetre_RattachementCDT,
} = require("ObjetFenetre_RattachementCDT.js");
const {
  ObjetRequeteSaisieRattachementCDT,
} = require("ObjetRequeteSaisieRattachementCDT.js");
const {
  ObjetRequetePageSaisieCahierDeTextes_General,
} = require("ObjetRequetePageSaisieCahierDeTextes_General.js");
const {
  ObjetRequeteListeCDTPourRattachement,
} = require("ObjetRequeteListeCDTPourRattachement.js");
const {
  ObjetFenetre_DevoirSurTable,
} = require("ObjetFenetre_DevoirSurTable.js");
const { Callback } = require("Callback.js");
const { GUID } = require("GUID.js");
const { TinyInit } = require("TinyInit.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { Requetes } = require("CollectionRequetes.js");
const { GStyle } = require("ObjetStyle.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  _InterfacePageSaisieCahierDeTextes,
} = require("_InterfacePageSaisieCahierDeTextes.js");
const {
  DonneesListe_CDTsPrecedents,
} = require("DonneesListe_CDTsPrecedents.js");
const { EGenreElementCDT } = require("Enumere_ElementCDT.js");
const { EGenreEvenementEDT } = require("Enumere_EvenementEDT.js");
const { EGenreLienDS } = require("Enumere_LienDS.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfaceListeTAFsCDT } = require("InterfaceListeTAFsCDT.js");
const { ObjetFenetre_Categorie } = require("ObjetFenetre_Categorie.js");
const {
  ObjetFenetre_ElementsProgramme,
} = require("ObjetFenetre_ElementsProgramme.js");
const { ObjetFenetre_FichiersCloud } = require("ObjetFenetre_FichiersCloud.js");
const {
  ObjetFenetre_PanierRessourceKiosque,
} = require("ObjetFenetre_PanierRessourceKiosque.js");
const {
  ObjetFenetre_ParametrageTAF,
} = require("ObjetFenetre_ParametrageTAF.js");
const ObjetFenetre_PieceJointe = require("ObjetFenetre_PieceJointe.js");
const { ObjetFenetre_URLKiosque } = require("ObjetFenetre_URLKiosque.js");
const { ObjetModule_EDTSaisie } = require("ObjetModule_EDTSaisie.js");
const { ObjetRequeteFicheCDT } = require("ObjetRequeteFicheCDT.js");
const {
  ObjetRequetePageEmploiDuTemps,
} = require("ObjetRequetePageEmploiDuTemps.js");
const {
  ObjetRequetePageSaisieCahierDeTextes,
} = require("ObjetRequetePageSaisieCahierDeTextes.js");
const {
  ObjetRequeteSaisieCahierDeTextes,
} = require("ObjetRequeteSaisieCahierDeTextes.js");
const {
  TypeOrigineCreationCategorieCahierDeTexte,
  TypeOrigineCreationCategorieCahierDeTexteUtil,
} = require("TypeOrigineCreationCategorieCahierDeTexte.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const {
  UtilitaireLienCoursPrecedentSuivant,
} = require("UtilitaireLienCoursPrecedentSuivant.js");
const {
  EGenreEvenementTAFCahierDeTextes,
} = require("InterfaceListeTAFsCDT.js");
const {
  InterfaceContenuCahierDeTextes,
} = require("InterfaceContenuCahierDeTextes.js");
const {
  EGenreEvenementContenuCahierDeTextes,
} = require("EGenreEvenementContenuCahierDeTextes.js");
const { EGenreFenetreDocumentJoint } = require("EGenreFenetreDocumentJoint.js");
const { TypeOptionPublicationCDT } = require("TypeOptionPublicationCDT.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
const { TUtilitaireCDT } = require("UtilitaireCDT.js");
const { EGenreBtnActionBlocCDT } = require("GestionnaireBlocCDT.js");
const { GestionnaireBlocCDT } = require("GestionnaireBlocCDT.js");
const {
  ObjetFenetre_ListeTAFFaits,
  TypeBoutonFenetreTAFFaits,
} = require("ObjetFenetre_ListeTAFFaits.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const {
  UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { UtilitaireSelecFile } = require("UtilitaireSelecFile.js");
const { UtilitaireQCMPN } = require("UtilitaireQCMPN.js");
const { tag } = require("tag.js");
const { ObjetFenetre_PostIt } = require("ObjetFenetre_PostIt.js");
const {
  ObjetFenetre_ChoixDossierCopieCDT,
} = require("ObjetFenetre_ChoixDossierCopieCDT.js");
const { InterfaceGrilleEDT } = require("InterfaceGrilleEDT.js");
Requetes.inscrire("SaisiePreferencesRessourcesKiosque", ObjetRequeteSaisie);
const EGenreSelectionSemaine = { Sans: 0, Avec: 1, Forcer: 2 };
const EGenreCommandeCdT = {
  CopierCdT: 0,
  CollerCdT: 1,
  SupprimerCdT: 2,
  AffecterProgressionAuCdT: 3,
  RattacherCDT: 4,
  AjouterContenuDansProgression: 5,
  saisieDS: 6,
  saisieEval: 7,
};
let uEstNoteProchaineSeanceVisible = false;
class ObjetAffichagePageSaisieCahierDeTextes extends _InterfacePageSaisieCahierDeTextes {
  constructor(...aParams) {
    super(...aParams);
    this.Actif = false;
    this.idBandeauGauche = GApplication.idBreadcrumbPerso;
    this.idPremierObjet = this.idBandeauGauche;
    this.idBandeauDroite = this.Nom + "_BandeauDroite";
    this.idPublieContenu = this.Nom + "_ImagePublieContenu";
    this.idContenu = this.Nom + "_Contenu";
    this.idNoteProcghaineSeance = this.Nom + "_NoteProchaineSeance";
    this.idElementsProgramme = this.Nom + "_ElementsProgramme";
    this.idKiosque = this.Nom + "_Kiosque";
    this.idTravailAFaire = this.Nom + "_TAF";
    this.idDescriptif = this.Nom + "_Descriptif";
    this.classDivBlocTiny = GUID.getClassCss();
    this.identContenus = [];
    this.indiceContenus = [];
    this.avecQCM = true;
    this.avecGestionNotation = GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionNotation,
    );
    if (GEtatUtilisateur.getNavigationCours()) {
      this.Cours = GEtatUtilisateur.getNavigationCours();
      GEtatUtilisateur.setNavigationCours(null);
    }
    this._cacheJoursPresenceCours = {};
    this.enAuthCloud = false;
    this.paramsListeCDTPrec = {
      deploye: false,
      nbAffiches: 3,
      nbMaxAffiches: 10,
      hauteurListe: 66,
    };
    this.listeCDTPleinEcran = false;
    this.palierElementTravailleSelectionne = null;
    this.moduleSaisieCours = new ObjetModule_EDTSaisie({ instance: this });
    Invocateur.abonner(
      ObjetInvocateur.events.etatSaisie,
      this._changementEtatSaisie,
      this,
    );
  }
  construireInstances() {
    this.IdentCalendrier = this.add(
      ObjetCalendrier,
      this.evenementSurCalendrier,
      this.initialiserCalendrier,
    );
    this.IdPremierElement = this.getInstance(
      this.IdentCalendrier,
    ).getPremierElement();
    this.identFenetreEditionCategorie = this.add(
      ObjetFenetre_Categorie,
      this.evenementEditionCategorie,
    );
    this.IdentEditionPieceJointe = this.add(
      ObjetFenetre_PieceJointe,
      this.evenementEditionDocumentJoint,
    );
    this.IdentGrille = this.add(
      InterfaceGrilleEDT,
      this.evenementSurGrille,
      this.initialiserGrille,
    );
    this.IdentFenetreChargeTAF = this.addFenetre(ObjetFenetre_ChargeTAF);
    this.identFenetreChoixDossierCopieCDT = this.addFenetre(
      ObjetFenetre_ChoixDossierCopieCDT,
    );
    this.identFenetreRattachementCDT = this.addFenetre(
      ObjetFenetre_RattachementCDT,
      this.evenementSurFenetreRattachementCDT,
      this.initialiserFenetreRattachementCDT,
    );
    if (GEtatUtilisateur.listeCloud.count() > 0) {
      this.identFenetreFichiersCloud = this.addFenetre(
        ObjetFenetre_FichiersCloud,
        this.eventFenetreFichiersCloud,
      );
    }
    this.identFenetreElementsProgramme = this.addFenetre(
      ObjetFenetre_ElementsProgramme,
      _evenementSurFenetreElementsProgramme,
    );
    this.IdentDatePublication = this.add(
      ObjetCelluleDate,
      this.evenementSurDatePublication,
      this.initialiserDatePublication,
    );
    this.identFenetreVisuQCM = this.addFenetre(
      ObjetFenetreVisuEleveQCM,
      this.evenementSurVisuEleve,
    );
    this.identListeCDTPrec = this.add(
      ObjetListe,
      null,
      _initialiserListeCDTPrec.bind(this),
    );
    this.identListeTAFs = this.add(
      InterfaceListeTAFsCDT,
      this.evenementTAFDesCours,
    );
    this.utilLienBtns = new UtilitaireLienCoursPrecedentSuivant({
      idRef: this.Nom,
      callback: this.evenementSurBoutonRechercheCours.bind(this),
      controleNavigation: true,
      pere: this,
    });
    this.identFenetreURLKiosque = this.addFenetre(
      ObjetFenetre_URLKiosque,
      this.evntSurFenetreURLKiosque,
      this.initFenetreURLKiosque,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      listeCDT: {
        btnDeploy: {
          event: function () {
            const lAvecCDTs = aInstance.listeCDTsPrecedents
              ? aInstance.listeCDTsPrecedents.count() > 0
              : false;
            aInstance.paramsListeCDTPrec.deploye =
              !aInstance.paramsListeCDTPrec.deploye && lAvecCDTs;
            GHtml.setDisplay(
              aInstance.getInstance(aInstance.identListeCDTPrec).getNom(),
              aInstance.paramsListeCDTPrec.deploye,
            );
            !!aInstance.paramsListeCDTPrec.deploye
              ? $(this.node).attr("aria-expanded", "true")
              : $(this.node).attr("aria-expanded", "false");
            aInstance.actualiser(true);
            this.node.focus();
          },
          getSelection: function () {
            return aInstance.paramsListeCDTPrec.deploye;
          },
          afficherDeploy: function () {
            return !aInstance.listeCDTPleinEcran;
          },
        },
        btnIconeMoins: {
          event: function () {
            aInstance.paramsListeCDTPrec.nbAffiches = Math.max(
              1,
              aInstance.paramsListeCDTPrec.nbAffiches - 1,
            );
            _actualiserListeCDTsPrecedents.call(aInstance);
          },
          getDisabled: function () {
            return (
              aInstance.paramsListeCDTPrec.nbAffiches < 2 ||
              !aInstance.listeCDTsPrecedents ||
              aInstance.listeCDTsPrecedents.count() === 0
            );
          },
        },
        btnIconePlus: {
          event: function () {
            aInstance.paramsListeCDTPrec.nbAffiches = Math.min(
              aInstance.listeCDTsPrecedents.count(),
              Math.min(
                aInstance.paramsListeCDTPrec.nbMaxAffiches,
                aInstance.paramsListeCDTPrec.nbAffiches + 1,
              ),
            );
            _actualiserListeCDTsPrecedents.call(aInstance);
          },
          getDisabled: function () {
            return (
              aInstance.paramsListeCDTPrec.nbAffiches >=
                aInstance.paramsListeCDTPrec.nbMaxAffiches ||
              !aInstance.listeCDTsPrecedents ||
              aInstance.paramsListeCDTPrec.nbAffiches >=
                aInstance.listeCDTsPrecedents.count()
            );
          },
        },
        htmlElementsPrecedents: function () {
          if (
            !aInstance.listeCDTsPrecedents ||
            aInstance.listeCDTsPrecedents.count() === 0
          ) {
            return (
              '<span style="' +
              GStyle.composeCouleurTexte(GCouleur.nonEditable.texte) +
              '">' +
              aInstance.paramsListeCDTPrec.nbAffiches +
              "</span>"
            );
          }
          return aInstance.paramsListeCDTPrec.nbAffiches;
        },
        htmlElementsPrecedentsWAI() {
          return (
            aInstance.paramsListeCDTPrec.nbAffiches +
            " " +
            GTraductions.getValeur("CahierDeTexte.ContenusPrecedents")
          );
        },
        afficherTraitSeparation: function () {
          return !aInstance.listeCDTPleinEcran;
        },
      },
      btnAjouterContenu: {
        event() {
          aInstance.evenementSurAjoutContenu();
        },
        getTitle() {
          return GTraductions.getValeur("CahierDeTexte.hintBoutonAjoutContenu");
        },
        getDisabled() {
          return (
            !aInstance.CahierDeTextes || !!aInstance.CahierDeTextes.verrouille
          );
        },
      },
      btnElementsProgramme: {
        event() {
          aInstance
            .getInstance(aInstance.identFenetreElementsProgramme)
            .setDonnees({
              cours: aInstance.Cours,
              numeroSemaine: aInstance.NumeroSemaine,
              listeElementsProgramme:
                aInstance.CahierDeTextes.listeElementsProgrammeCDT,
              palier: aInstance.palierElementTravailleSelectionne,
            });
        },
        getDisabled() {
          return (
            !aInstance.CahierDeTextes || !!aInstance.CahierDeTextes.verrouille
          );
        },
      },
      btnAfficherCoursAnnules: {
        event() {
          GEtatUtilisateur.setAvecCoursAnnule(
            !GEtatUtilisateur.getAvecCoursAnnule(),
          );
          _actualiserGrille.call(aInstance);
        },
        getSelection() {
          return GEtatUtilisateur.getAvecCoursAnnule();
        },
        getTitle() {
          return GEtatUtilisateur.getAvecCoursAnnule()
            ? GTraductions.getValeur("EDT.MasquerCoursAnnules")
            : GTraductions.getValeur("EDT.AfficherCoursAnnules");
        },
        getClassesMixIcon() {
          return UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
            GEtatUtilisateur.getAvecCoursAnnule(),
          );
        },
      },
      btnAfficherCDTDetaches: {
        event() {
          aInstance.avecDrag = true;
          new ObjetRequeteListeCDTPourRattachement(
            aInstance,
            aInstance.actionSurRattachementCDT,
          ).lancerRequete();
        },
        getTitle() {
          return GTraductions.getValeur("CahierDeTexte.BoutonRattachementCDT");
        },
        getDisabled() {
          return !GEtatUtilisateur.existeCDTsDetaches;
        },
      },
      btnInfosDetails: {
        event() {
          aInstance
            .getInstance(aInstance.IdentGrille)
            .getInstanceGrille()
            .ouvrirFenetreDetailsGrille();
        },
      },
      btnParametrerRessourceKiosque: {
        event() {
          aInstance._surOuvertureURLKiosque(false);
        },
        getTitle() {
          return GTraductions.getValeur(
            "CahierDeTexte.kiosque.fenetre.titreSelect",
          );
        },
      },
      contenu: {
        afficherTraitSeparation: function () {
          return !aInstance.ContenuPleinEcran;
        },
      },
      btnParametrageTAF: {
        instanceFenetreParametresTAF: null,
        event() {
          const lFenetreParametresTAF = ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_ParametrageTAF,
            { pere: aInstance },
          );
          this.controleur.btnParametrageTAF.instanceFenetreParametresTAF =
            lFenetreParametresTAF;
          lFenetreParametresTAF.afficher();
        },
        getSelection() {
          let lFenetreParametresTAF = null;
          if (this.controleur.btnParametrageTAF) {
            lFenetreParametresTAF =
              this.controleur.btnParametrageTAF.instanceFenetreParametresTAF;
          }
          return lFenetreParametresTAF && lFenetreParametresTAF.estAffiche();
        },
        getTitle() {
          return GTraductions.getValeur(
            "CahierDeTexte.paramTaf.SaisieTAFsPreferences",
          );
        },
      },
      btnAfficherChargeTravail: {
        event() {
          aInstance
            .getInstance(aInstance.IdentFenetreChargeTAF)
            .setDonnees(aInstance.Cours, aInstance.listeClasses);
        },
        getSelection() {
          return aInstance
            .getInstance(aInstance.IdentFenetreChargeTAF)
            .estAffiche();
        },
        getTitle() {
          return GTraductions.getValeur("CahierDeTexte.ChargeTAFAFaire");
        },
        getDisplay() {
          return aInstance.avecVoirChargeTravail;
        },
      },
      btnAgrandirReduireZoneListeCDT: {
        event() {
          _evenementSurZoomListeCDT.call(
            aInstance,
            !aInstance.listeCDTPleinEcran,
          );
        },
        getClassesIcon() {
          return UtilitaireBoutonBandeau.getClassesIconZoomPlusMoins(
            aInstance.listeCDTPleinEcran,
          );
        },
        getTitle() {
          if (aInstance.listeCDTPleinEcran) {
            return GTraductions.getValeur(
              "CahierDeTexte.hintBoutonPleinEcranReduire",
            );
          }
          return GTraductions.getValeur(
            "CahierDeTexte.hintBoutonPleinEcranAgrandir",
          );
        },
      },
      btnAgrandirReduireZoneContenu: {
        event() {
          aInstance.evenementSurBoutonPleinEcranContenu();
        },
        getTitle() {
          if (aInstance.ContenuPleinEcran) {
            return GTraductions.getValeur(
              "CahierDeTexte.hintBoutonPleinEcranReduire",
            );
          }
          return GTraductions.getValeur(
            "CahierDeTexte.hintBoutonPleinEcranAgrandir",
          );
        },
        getClassesIcon() {
          return UtilitaireBoutonBandeau.getClassesIconZoomPlusMoins(
            aInstance.ContenuPleinEcran,
          );
        },
      },
      btnAgrandirReduireZoneTAF: {
        event() {
          aInstance.evenementSurBoutonPleinEcranTAF();
        },
        getTitle() {
          if (aInstance.TAFPleinEcran) {
            return GTraductions.getValeur(
              "CahierDeTexte.hintBoutonPleinEcranReduire",
            );
          }
          return GTraductions.getValeur(
            "CahierDeTexte.hintBoutonPleinEcranAgrandir",
          );
        },
        getClassesIcon() {
          return UtilitaireBoutonBandeau.getClassesIconZoomPlusMoins(
            aInstance.TAFPleinEcran,
          );
        },
      },
      taf: {
        afficherTraitSeparation() {
          return (
            !aInstance.TAFPleinEcran &&
            GApplication.parametresUtilisateur.get(
              "CDT.Commentaire.ActiverSaisie",
            )
          );
        },
      },
      mrFicheElementsProg: {
        event: function () {
          const lNode = this.node;
          GApplication.getMessage().afficher({
            message: GTraductions.getValeur(
              "CahierDeTexte.AideSaisieElementsPgm",
            ),
            callback: function () {
              GHtml.setFocus(lNode);
            },
          });
        },
        getTitle() {
          return GTraductions.getValeur("CahierDeTexte.mrFicheInformation");
        },
      },
      estVisibleCbPublierCDT: function () {
        const lCDT = aInstance.CahierDeTextes;
        let lAuMoinsUnContenu = false;
        if (
          lCDT &&
          lCDT.listeContenus &&
          lCDT.listeContenus.getNbrElementsExistes() > 0
        ) {
          lCDT.listeContenus.parcourir((aContenu) => {
            if (!aContenu.estVide) {
              lAuMoinsUnContenu = true;
            }
          });
        }
        return (
          !!lCDT &&
          lCDT.getNumero() &&
          !lCDT.verrouille &&
          !aInstance._estPublieAuto() &&
          (lAuMoinsUnContenu ||
            (lCDT.ListeTravailAFaire &&
              lCDT.ListeTravailAFaire.getNbrElementsExistes() > 0))
        );
      },
      estVisibleDatePublication: function () {
        const lEstPublie =
          !!aInstance.CahierDeTextes && !!aInstance.CahierDeTextes.publie;
        return lEstPublie;
      },
      getTitlePublierCDT: function () {
        let lTitlePublication = "";
        if (
          !!aInstance.CahierDeTextes &&
          aInstance.CahierDeTextes.getNumero() &&
          !aInstance._estPublieAuto()
        ) {
          if (
            GApplication.parametresUtilisateurBase.optionPublicationCDT ===
            TypeOptionPublicationCDT.OPT_PublicationDebutCours
          ) {
            lTitlePublication = GTraductions.getValeur(
              "CahierDeTexte.hintPublie_Debut",
            );
          } else {
            lTitlePublication = GTraductions.getValeur(
              "CahierDeTexte.hintPublie",
            );
          }
        }
        return lTitlePublication;
      },
      checkPublierCDT: {
        getValue: function () {
          return (
            !!aInstance.CahierDeTextes && !!aInstance.CahierDeTextes.publie
          );
        },
        setValue: function (aValeur) {
          if (!!aInstance.CahierDeTextes) {
            aInstance.CahierDeTextes.publie = aValeur;
            const lCDTEstConsiderePublie =
              aValeur || !aInstance._estPublieAuto();
            aInstance
              .getInstance(aInstance.identListeTAFs)
              .actualiser(lCDTEstConsiderePublie);
            const lIdentDate = aInstance.getInstance(
              aInstance.IdentDatePublication,
            );
            lIdentDate.setActif(aValeur);
            aInstance.CahierDeTextes.datePublication = aValeur
              ? aInstance.CahierDeTextes.datePublication
                ? aInstance.CahierDeTextes.datePublication
                : GDate.getDateCourante()
              : null;
            lIdentDate.setDonnees(aInstance.CahierDeTextes.datePublication);
            aInstance.setEtatSaisie(true);
          }
        },
      },
      getClassImagePublication: function () {
        const lEstPublie =
          !!aInstance.CahierDeTextes && !!aInstance.CahierDeTextes.publie;
        const lAEtePublieAuto = aInstance._estPublieAuto();
        return lEstPublie || lAEtePublieAuto
          ? "Image_Publie"
          : "Image_NonPublie";
      },
      getAttrImagePublication() {
        const lEstPublie =
          !!aInstance.CahierDeTextes && !!aInstance.CahierDeTextes.publie;
        const lAEtePublieAuto = aInstance._estPublieAuto();
        const lTrad =
          lEstPublie || lAEtePublieAuto
            ? GTraductions.getValeur("CahierDeTexte.WAI.CDTPublie")
            : GTraductions.getValeur("CahierDeTexte.WAI.CDTNonPublie");
        return { title: lTrad, "aria-label": lTrad };
      },
      avecSaisieCommentaire() {
        return GApplication.parametresUtilisateur.get(
          "CDT.Commentaire.ActiverSaisie",
        );
      },
      getHtmlNoteProchaineSeance() {
        return `<header><h4 id="${aInstance.idNoteProcghaineSeance}">${GTraductions.getValeur("CahierDeTexte.postIt.seanceSuivante.titre")}</h4><ie-btnicon class="icon_fermeture_widget m-left-l" ie-model="displayNoteProchaineSeance(true)"></ie-btnicon></header><ie-textareamax aria-labelledby="${aInstance.idNoteProcghaineSeance}" ie-model="textNoteProchaineSeance" maxlength="${aInstance.CahierDeTextes && aInstance.CahierDeTextes.taillePostIt ? aInstance.CahierDeTextes.taillePostIt : 10000}" class="full-width"></ie-textareamax>`;
      },
      displayNoteProchaineSeance: {
        event() {
          uEstNoteProchaineSeanceVisible = !uEstNoteProchaineSeanceVisible;
        },
        getTitle(aEstCroixFermer) {
          if (aEstCroixFermer) {
            return GTraductions.getValeur("Fermer");
          }
          return GTraductions.getValeur(
            "CahierDeTexte.postIt.seanceSuivante.hintBtn",
          );
        },
        getSelection() {
          return uEstNoteProchaineSeanceVisible;
        },
      },
      avecNoteProchaineSeance() {
        return (
          uEstNoteProchaineSeanceVisible &&
          GApplication.parametresUtilisateur.get(
            "CDT.Commentaire.ActiverSaisie",
          )
        );
      },
      textNoteProchaineSeance: {
        getValue: function () {
          return aInstance.CahierDeTextes &&
            aInstance.CahierDeTextes.noteProchaineSeance
            ? aInstance.CahierDeTextes.noteProchaineSeance
            : "";
        },
        setValue: function (aValeur) {
          aInstance.CahierDeTextes.noteProchaineSeance = aValeur;
          aInstance.setEtatSaisie(true);
        },
      },
      afficherNoteCoursPrecedent: {
        event() {
          if (!!aInstance.fenetreNotePourSeance) {
            aInstance.fenetreNotePourSeance.fermer();
          }
          aInstance.fenetreNotePourSeance = ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre,
            {
              pere: aInstance,
              initialiser: (aInstanceFenetre) => {
                aInstanceFenetre.setOptionsFenetre({
                  largeur: 600,
                  hauteur: 400,
                  hauteurMaxContenu: 400,
                  modale: false,
                  titre: GTraductions.getValeur(
                    "CahierDeTexte.postIt.pourCetteSeance.titre",
                  ),
                });
              },
            },
          );
          aInstance.fenetreNotePourSeance.afficher(
            `<div class="conteneur-postIt ThemeCat-pense-bete full-weight p-all"><p class="AvecScrollVerticalAuto">${GChaine.replaceRCToHTML(aInstance.CoursPrecedent.noteProchaineSeance)}</p></div>`,
          );
        },
        getTitle() {
          return GChaine.enleverEntites(
            `${GTraductions.getValeur("CahierDeTexte.postIt.pourCetteSeance.titre")} :\r\n${aInstance.CoursPrecedent.noteProchaineSeance}`,
          );
        },
      },
      btnCommentairePrive: {
        event() {
          ObjetFenetre.creerInstanceFenetre(ObjetFenetre_PostIt, {
            pere: aInstance,
            initialiser: (aInstanceFenetre) => {
              aInstanceFenetre.setOptionsFenetre({
                titre: GTraductions.getValeur(
                  "CahierDeTexte.postIt.commentairePrive.titre",
                ),
                largeur: 600,
                hauteur: 400,
              });
            },
            evenement: (aCommentairePrive) => {
              aInstance.CahierDeTextes.commentairePrive = aCommentairePrive;
              aInstance.setEtatSaisie(true);
              aInstance.valider();
            },
          }).setDonnees({
            texte: aInstance.CahierDeTextes.commentairePrive,
            label:
              GTraductions.getValeur("Commentaire") +
              " (" +
              GTraductions.getValeur(
                "CahierDeTexte.postIt.commentairePrive.infoTitre",
              ) +
              ")",
            taillePostIt: aInstance.CahierDeTextes.taillePostIt,
          });
        },
        getTitle() {
          return GTraductions.getValeur(
            "CahierDeTexte.postIt.commentairePrive.hintBtn",
          );
        },
      },
    });
  }
  composeBandeauGauche() {
    const T = [];
    T.push('<div class="table-header">');
    T.push(
      '<h1 id="' +
        this.idBandeauGauche +
        '" class="titre-onglet" tabindex="0">' +
        GTraductions.getValeur("CahierDeTexte.SaisieCahierDeTextes"),
      "</h1>",
    );
    T.push(
      '<div class="bta-contain">',
      UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnules(
        "btnAfficherCoursAnnules",
      ),
      UtilitaireBoutonBandeau.getHtmlBtnAfficherCahiersDeTextesDetaches(
        "btnAfficherCDTDetaches",
      ),
      UtilitaireBoutonBandeau.getHtmlBtnInformationsGrille("btnInfosDetails"),
      "</div>",
    );
    T.push("</div>");
    return T.join("");
  }
  composeBandeauDroite() {
    const T = [];
    T.push('<div class="table-header">');
    T.push(
      '      <div role="heading" aria-level="2" id="' +
        this.idBandeauDroite +
        '" class="titre" ie-ellipsis>' +
        "</div>",
    );
    T.push(
      '      <div class="bta-contain" ie-display="estVisibleCbPublierCDT" >',
      '<ie-checkbox ie-model="checkPublierCDT" ie-title="getTitlePublierCDT" >',
      GTraductions.getValeur("CahierDeTexte.publie"),
      "</ie-checkbox>",
      '<div ie-display="estVisibleDatePublication" id="',
      this.getInstance(this.IdentDatePublication).getNom(),
      '"></div>',
      '<div id="',
      this.idPublieContenu,
      '" ie-class="getClassImagePublication" class="hide" style="width:2.4rem" role="img" ie-attr="getAttrImagePublication"></div>',
      "</div>",
    );
    T.push("</div>");
    return T.join("");
  }
  construireStructureAffichageAutre() {
    const lWidth = "450px";
    return tag(
      "div",
      { class: "full-height flex-contain cols p-all flex-gap" },
      tag(
        "div",
        {
          class: "fix-bloc Gras AlignementMilieu",
          id: this.Nom + "_Page_Message",
        },
        "Semaine fériée",
      ),
      tag("div", {
        class: "fix-bloc",
        id: this.getInstance(this.IdentCalendrier).getNom(),
      }),
      tag(
        "div",
        { id: this.Nom + "_Page", class: "fluid-bloc flex-contain" },
        tag(
          "div",
          {
            class: "fix-bloc flex-contain cols full-height",
            id: this.Nom + "_ZoneGrille",
          },
          tag("div", { class: "fix-bloc" }, this.composeBandeauGauche()),
          tag(
            "div",
            {
              class: "fluid-bloc p-top",
              id: this.getInstance(this.IdentGrille).getNom(),
              style: `width:${parseInt(lWidth) + GNavigateur.getLargeurBarreDeScroll()}px`,
            },
            this.composeBandeauGauche(),
          ),
          tag(
            "div",
            {
              class:
                "fix-bloc m-bottom flex-contain flex-center justify-center p-all",
              style: "height: 10px",
            },
            this.utilLienBtns.construire(),
          ),
        ),
        tag(
          "div",
          {
            id: this.Nom + "_ZoneDeSaisie_Message",
            class:
              "fluid-bloc full-height flex-contain cols flex-center justify-center",
            style: "height:290px;",
            tabindex: "0",
          },
          tag(
            "span",
            { class: "Gras" },
            GTraductions.getValeur(
              "CahierDeTexte.SelectionnerUnCoursPourSaisirCDT",
            ),
          ),
        ),
        tag(
          "div",
          {
            id: this.Nom + "_ZoneDeSaisie",
            class: "fluid-bloc full-height p-left flex-contain cols",
            style: `display: none; position:relative; top:0px;`,
          },
          tag("div", { class: "fix-bloc" }, this.composeBandeauDroite()),
          tag(
            "div",
            { id: this.Nom + "_P3_2", class: "fix-bloc flex-contain cols" },
            _composeListeCDTsPrecedents.call(this),
          ),
          tag(
            "div",
            { id: this.Nom + "_P3_3", class: "fluid-bloc flex-contain cols" },
            _composeLigneZoneContenu.call(this),
            _composeLigneZoneElementsProgramme.call(this),
            _composeLigneZoneTAF.call(this),
            GApplication.parametresUtilisateur.get(
              "CDT.Commentaire.ActiverSaisie",
            )
              ? _composeLigneZoneCommentairePrive.call(this)
              : "",
          ),
        ),
      ),
    );
  }
  initialiserCalendrier(aInstance) {
    UtilitaireInitCalendrier.init(aInstance);
    aInstance.setControleNavigation(true);
  }
  initialiserGrille(aInstance) {
    aInstance.setOptionsInterfaceGrilleEDT({
      avecScrollV: true,
      minHeight: 290,
      optionsGrille: {
        avecDrop: true,
        callbackAcceptDraggable: (aParamsDrop) => {
          const lData = aParamsDrop.drag.data;
          return !!(
            lData &&
            lData.estObjetListe &&
            lData.article &&
            lData.article.estRattachementCDT
          );
        },
        callbackDropCellule: this.callbackDropCellule.bind(this),
      },
      evenementMouseDownPlace: function () {
        this.Cours = null;
        if (this.fenetreCDT) {
          this.fenetreCDT.fermer();
        }
        this.setActif(false);
      }.bind(this),
    });
    aInstance.setControleNavigation(true);
  }
  callbackDropCellule(aIndiceCours, aParamsDrop) {
    const lData = aParamsDrop.drag.data;
    const lCahierDeTextes = this.listeCDT.getElementParNumero(
      lData.article.getNumero(),
    );
    const lCours = this.listeCours.get(aIndiceCours);
    const lHeure = GParametres.LibellesHeures.getLibelle(
      lCours.Debut % GParametres.PlacesParJour,
    );
    const lMessage = GTraductions.getValeur(
      "CahierDeTexte.Rattachement.Confirmation",
      [GDate.formatDate(lCours.DateDuCours, "%JJJJ %J %MMMM"), lHeure],
    );
    if (lCahierDeTextes && lCours) {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Confirmation,
        message: lMessage,
        callback: this._apresConfirmationCallbackDropCellule.bind(
          this,
          lCahierDeTextes,
          lCours,
        ),
      });
    }
  }
  _apresConfirmationCallbackDropCellule(aCahierDeTextes, aCours, aGenreBouton) {
    if (aGenreBouton === EGenreAction.Valider) {
      const lListeCDTaSupprimer = this.listeCDT.getListeElements((aElement) => {
        return !aElement.existe();
      });
      new ObjetRequeteSaisieRattachementCDT(
        this,
        this._actionSurRequeteSaisieRattachementCDT,
      ).lancerRequete({
        cahierDeTextes: aCahierDeTextes,
        cours: aCours,
        numeroSemaine: this.NumeroSemaine,
        listeCDT: lListeCDTaSupprimer.count() > 0 ? lListeCDTaSupprimer : null,
      });
      if (
        this.getInstance(this.identFenetreRattachementCDT) &&
        this.getInstance(this.identFenetreRattachementCDT).estAffiche()
      ) {
        this.getInstance(this.identFenetreRattachementCDT).fermer();
      }
    }
    this._verifierListeCDTAAffecter(this.listeCDT);
  }
  initialiserCombo(aInstance) {
    aInstance.setParametres(true, true, null, null, null, null, 19);
    aInstance.setOptionsObjetSaisie({
      labelWAICellule: GTraductions.getValeur("CahierDeTexte.comboCategorie"),
    });
  }
  initialiserFenetreRattachementCDT(aInstance) {
    aInstance.setOptionsFenetre({
      modale: false,
      titre: GTraductions.getValeur("CahierDeTexte.FenetreRattachementCDT"),
      largeur: 600,
      hauteur: 400,
      listeBoutons: [
        GTraductions.getValeur("principal.annuler"),
        GTraductions.getValeur("principal.affecter"),
      ],
    });
  }
  eventFenetreFichiersCloud(aParam) {
    if (aParam.listeNouveauxDocs && aParam.listeNouveauxDocs.count() > 0) {
      const lElementCourant =
        this.genreElementSelectionne === EGenreElementCDT.TravailAFaire
          ? this.tafCourant
          : this.contenuCourant;
      lElementCourant.ListePieceJointe.add(aParam.listeNouveauxDocs);
      lElementCourant.estVide = false;
      this.ListeDocumentsJoints.add(aParam.listeNouveauxDocs);
      this.actualiser(true);
      lElementCourant.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
    }
  }
  initialiserFenetreLienKiosque(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("CahierDeTexte.lien.kiosque"),
      largeur: 400,
      hauteur: 150,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Ajouter"),
      ],
    });
  }
  evenementSurFenetreLienKiosque(aParam) {
    if (aParam.dataLienKiosque) {
      const lElementCourant =
        this.genreElementSelectionne === EGenreElementCDT.TravailAFaire
          ? this.tafCourant
          : this.contenuCourant;
      const lLienKiosque = new ObjetElement(
        aParam.titre,
        null,
        EGenreDocumentJoint.LienKiosque,
      );
      lLienKiosque.dataLienKiosque = aParam.dataLienKiosque;
      lLienKiosque.setEtat(EGenreEtat.Creation);
      this.ListeDocumentsJoints.addElement(lLienKiosque);
      lElementCourant.ListePieceJointe.addElement(lLienKiosque);
      lElementCourant.estVide = false;
      lElementCourant.setEtat(EGenreEtat.Modification);
      this.setEtatSaisie(true);
      this.actualiser(true);
    }
  }
  initialiserDatePublication(aInstance) {
    aInstance.setVisible(false);
    aInstance.setOptionsObjetCelluleDate({
      avecBoutonsPrecedentSuivant: false,
    });
    aInstance.setParametresFenetre(
      GParametres.PremierLundi,
      GParametres.PremiereDate,
      GParametres.DerniereDate,
      GParametres.JoursOuvres,
      null,
      GParametres.JoursFeries,
      null,
    );
  }
  recupererDonnees(aAvecRequeteGenerale) {
    aAvecRequeteGenerale =
      aAvecRequeteGenerale === null || aAvecRequeteGenerale === undefined
        ? true
        : aAvecRequeteGenerale;
    const lCalendrier = this.getInstance(this.IdentCalendrier);
    lCalendrier.setFrequences(GParametres.frequences);
    lCalendrier.setDomaineInformation(
      IE.Cycles.getDomaineFerie(),
      EGenreDomaineInformation.Feriee,
    );
    lCalendrier.setPeriodeDeConsultation(
      GApplication.droits.get(TypeDroits.cours.domaineConsultationEDT),
    );
    if (this.moduleSaisieCours.afficherDomaineClotureCalendrier()) {
      lCalendrier.setDomaineInformation(
        GParametres.domaineVerrou,
        EGenreDomaineInformation.Cloturee,
      );
    }
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    if (aAvecRequeteGenerale) {
      new ObjetRequetePageSaisieCahierDeTextes_General(
        this,
        this.actionSurRecupererDonnees,
      ).lancerRequete(
        !GEtatUtilisateur.getDomainePresence(GEtatUtilisateur.getMembre()),
      );
    } else {
      new ObjetRequetePageEmploiDuTemps(
        this,
        this.actionSurCalendrier,
      ).lancerRequete({ numeroSemaine: this.NumeroSemaine });
    }
  }
  recupererCahierDeTextes() {
    const lParam = {
      cours: this.Cours,
      numeroSemaine: this.NumeroSemaine,
      avecJoursPresence: !this._cacheJoursPresenceCours[this.Cours.getNumero()],
    };
    new ObjetRequetePageSaisieCahierDeTextes(
      this,
      this.actionSurRecupererCahierDeTextes.bind(this, this.Cours),
    ).lancerRequete(lParam);
    this.setEtatIdCourant(true);
    this.setFocusIdCourant();
  }
  valider() {
    if (this.Actif) {
      this.avecRequeteGenerale =
        this.listeCategories.existeElementPourValidation() ||
        this.ListeModeles.existeElementPourValidation();
      const lInstance = this.getInstance(this.IdentEditionPieceJointe);
      new ObjetRequeteSaisieCahierDeTextes(this, this.actionSurValidation)
        .addUpload({
          listeFichiers: lInstance.ListeFichiers,
          listeDJCloud: this.ListeDocumentsJoints,
          callback: function () {
            lInstance.reset();
          },
        })
        .lancerRequete(
          this.Cours.Numero,
          this.NumeroSemaine,
          this.listeCategories,
          this.ListeDocumentsJoints,
          this.ListeModeles,
          this.ListeCahierDeTextes,
        );
    }
  }
  actionSurValidation() {
    if (this._callbackNavigation) {
      this._callbackNavigation();
      delete this._callbackNavigation;
      if (!this.isDestroyed()) {
        this.reset(true);
        this.afficherPage();
      }
    } else {
      this.setEtatSaisie(false);
      this.reset(true);
      this.afficherPage();
    }
  }
  evenementSurContenu(
    aGenreEvenement,
    aElement,
    aGenreDocJoint,
    aDonneesSupplementaires,
  ) {
    this.genreElementSelectionne = EGenreElementCDT.Contenu;
    this.contenuCourant = aElement;
    if (
      this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 1 &&
      !!this.contenuCourant &&
      !this.CahierDeTextes.listeContenus.getIndiceParElement(
        this.contenuCourant,
      ) &&
      this.CahierDeTextes.listeContenus.get(0).getEtat() === EGenreEtat.Creation
    ) {
      const lContenu = this.contenuCourant;
      this.contenuCourant = this.CahierDeTextes.listeContenus.get(0);
      this.contenuCourant.Libelle = lContenu.getLibelle();
      this.contenuCourant.descriptif = lContenu.descriptif;
      this.contenuCourant.estVide = lContenu.estVide;
    }
    this.indiceElementSelectionne =
      this.CahierDeTextes.listeContenus.getIndiceParElement(
        this.contenuCourant,
      ) !== null
        ? this.CahierDeTextes.listeContenus.getIndiceParElement(
            this.contenuCourant,
          )
        : this.CahierDeTextes.listeContenus.count() - 1;
    switch (aGenreEvenement) {
      case EGenreEvenementContenuCahierDeTextes.fenetreEditeurHTML:
        this.evenementSurBoutonHTML(this.contenuCourant.descriptif, null, {
          filePickerOpener: this.evenementSurBoutonDocumentJoint.bind(
            this,
            EGenreDocumentJoint.Fichier,
          ),
          filePickerTypes: "image",
        });
        break;
      case EGenreEvenementContenuCahierDeTextes.fenetreCategorie:
        this.evenementSurBoutonCategorie();
        break;
      case EGenreEvenementContenuCahierDeTextes.editionTitre:
        this.setEtatSaisie(true);
        break;
      case EGenreEvenementContenuCahierDeTextes.editionCategorie:
        this.setEtatSaisie(true);
        break;
      case EGenreEvenementContenuCahierDeTextes.editionParcoursEducatif:
        this.setEtatSaisie(true);
        break;
      case EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint: {
        let lListeFichiers;
        if (aGenreDocJoint === EGenreDocumentJoint.Url) {
          const lNouvelleUrl = aDonneesSupplementaires;
          lListeFichiers = new ObjetListeElements().addElement(lNouvelleUrl);
        } else {
          const lElementFichierUploade = aDonneesSupplementaires;
          lListeFichiers = lElementFichierUploade
            ? lElementFichierUploade.listeFichiers
            : null;
        }
        _ajouterListeFichiers.call(this, lListeFichiers, aGenreDocJoint);
        break;
      }
      case EGenreEvenementContenuCahierDeTextes.editionDocumentJoint: {
        const lTypeServiceCloud = aDonneesSupplementaires;
        this.evenementSurBoutonDocumentJoint(aGenreDocJoint, lTypeServiceCloud);
        break;
      }
      case EGenreEvenementContenuCahierDeTextes.editionDescriptif:
        this.setEtatSaisie(true);
        if (this.indiceElementSelectionne >= 0) {
          this.getInstanceContenu().actualiserContenu(
            this.CahierDeTextes.listeContenus.get(
              this.indiceElementSelectionne,
            ),
            this.CahierDeTextes.verrouille,
            this.avecDocumentJoint,
            this.ContenuPleinEcran,
            _getOptionsContenuMenuMagique.call(this),
          );
        }
        break;
      case EGenreEvenementContenuCahierDeTextes.supprimer:
        this.supprimerContenuCourant();
        break;
      case EGenreEvenementContenuCahierDeTextes.ajoutQCM:
        if (!this.contenuCourant) {
          return;
        }
        UtilitaireSaisieCDT.choisirQCM({
          instance: this,
          donneesSupplementaire: { contexteAppel: "contenu" },
          element: this.contenuCourant,
          pourTAF: false,
        }).then((aParams) => {
          if (aParams.valider) {
            this.setEtatSaisie(true);
            this.getInstanceContenu().actualiserContenu(
              this.contenuCourant,
              this.CahierDeTextes.verrouille,
              this.avecDocumentJoint,
              this.ContenuPleinEcran,
              _getOptionsContenuMenuMagique.call(this, this.contenuCourant),
            );
          }
        });
        break;
      case EGenreEvenementContenuCahierDeTextes.affecterProgressionAuCdT:
        _affecterProgressionAuCdT.call(this, false);
        break;
      case EGenreEvenementContenuCahierDeTextes.poursuivreCoursPrecedent: {
        const lNewContenu = UtilitaireSaisieCDT.getCopieContenuCoursPrecedent(
          this.listeCDTsPrecedents,
        );
        if (lNewContenu) {
          const lIndice = this.CahierDeTextes.listeContenus.count() - 1;
          const lElementVide = this.CahierDeTextes.listeContenus.get(lIndice);
          if (lElementVide && lElementVide.existe() && lElementVide.estVide) {
            this.CahierDeTextes.listeContenus.remove(lIndice);
          }
          this.CahierDeTextes.listeContenus.addElement(lNewContenu);
          this.genreElementSelectionne = EGenreElementCDT.Contenu;
          this.contenuCourant = this.CahierDeTextes.listeContenus.get(
            this.CahierDeTextes.listeContenus.count() - 1,
          );
          this.indiceElementSelectionne =
            this.CahierDeTextes.listeContenus.getIndiceParElement(
              this.contenuCourant,
            ) !== null
              ? this.CahierDeTextes.listeContenus.getIndiceParElement(
                  this.contenuCourant,
                )
              : this.CahierDeTextes.listeContenus.count() - 1;
          this._actualiserContenu(true);
          this.setEtatSaisie(true);
        }
        break;
      }
      case EGenreEvenementContenuCahierDeTextes.poursuivreProgression:
        UtilitaireSaisieCDT.poursuivreProgression({
          instance: this,
          cdt: this.CahierDeTextes,
          listeCDTsPrecedents: this.listeCDTsPrecedents,
          dateTAF: new Date(
            (this.dateCoursSuivantTAF || this.DateTravailAFaire).getTime(),
          ),
          listeCategories: this.listeCategories,
          callbackAffectation: _callbackAffectationProgression.bind(this),
        });
        break;
      case EGenreEvenementContenuCahierDeTextes.saisieDS:
      case EGenreEvenementContenuCahierDeTextes.saisieEval:
        _commandeCreerDevoirOuEval(
          this,
          this.contenuCourant,
          aGenreEvenement === EGenreEvenementContenuCahierDeTextes.saisieDS
            ? EGenreLienDS.tGL_Devoir
            : EGenreLienDS.tGL_Evaluation,
        );
        break;
      case EGenreEvenementContenuCahierDeTextes.suppressionDocument:
        this.setEtatSaisie(true);
        aElement.setEtat(EGenreEtat.Modification);
        this.verifierEtatContenu();
        this.getInstanceContenu().actualiserContenu(
          this.CahierDeTextes.listeContenus.get(this.indiceElementSelectionne),
          this.CahierDeTextes.verrouille,
          this.avecDocumentJoint,
          this.ContenuPleinEcran,
          _getOptionsContenuMenuMagique.call(
            this,
            this.CahierDeTextes.listeContenus.get(
              this.indiceElementSelectionne,
            ),
          ),
        );
        break;
      case EGenreEvenementContenuCahierDeTextes.ajouterLienKiosque: {
        const lFenetre = ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_PanierRessourceKiosque,
          { pere: this, evenement: _evenementSurFenetreRessourceKiosqueLiens },
        );
        lFenetre.setOptions({ avecMultiSelection: true });
        lFenetre.afficherFenetre();
        break;
      }
      case EGenreEvenementContenuCahierDeTextes.editionTheme:
        this.setEtatSaisie(true);
        break;
    }
    this.verifierEtatContenu();
  }
  supprimerContenuCourant() {
    if (
      !this.CahierDeTextes.verrouille &&
      !(
        this.CahierDeTextes.listeContenus.aUnElementVide() &&
        this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 1
      )
    ) {
      if (this.contenuCourant) {
        GApplication.getMessage().afficher({
          type: EGenreBoiteMessage.Confirmation,
          message: GTraductions.getValeur(
            "CahierDeTexte.msgConfirmationSupprimerContenu",
          ),
          callback: this.evenementSurSupprimerContenu.bind(this),
        });
      }
    }
  }
  evenementSurSupprimerContenu(aAccepte) {
    if (this.contenuCourant && aAccepte === EGenreAction.Valider) {
      this.contenuCourant.Libelle = "";
      this.contenuCourant.descriptif = "";
      this.contenuCourant.categorie = new ObjetElement("", 0);
      this.contenuCourant.categorie.setEtat(EGenreEtat.Modification);
      this.contenuCourant.estVide = true;
      for (let i = 0; i < this.contenuCourant.ListePieceJointe.count(); i++) {
        this.contenuCourant.ListePieceJointe.get(i).setEtat(
          EGenreEtat.Suppression,
        );
      }
      this.contenuCourant.setEtat(EGenreEtat.Suppression);
      this.setEtatSaisie(true);
      if (this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 0) {
        this.CahierDeTextes.listeContenus.addElement(this._initContenu());
      }
      this.genreElementSelectionne = EGenreElementCDT.Contenu;
      this.contenuCourant = this.CahierDeTextes.listeContenus.get(
        this.CahierDeTextes.listeContenus.count() - 1,
      );
      this.indiceElementSelectionne =
        this.CahierDeTextes.listeContenus.getIndiceParElement(
          this.contenuCourant,
        ) !== null
          ? this.CahierDeTextes.listeContenus.getIndiceParElement(
              this.contenuCourant,
            )
          : this.CahierDeTextes.listeContenus.count() - 1;
      this._actualiserContenu(true);
    }
  }
  evenementTAFDesCours(aGenreEvenement, aElement, aDonneesSupplementaires) {
    this.genreElementSelectionne = EGenreElementCDT.TravailAFaire;
    this.tafCourant = aElement;
    this.indiceElementSelectionne = -1;
    const lThis = this;
    switch (aGenreEvenement) {
      case EGenreEvenementTAFCahierDeTextes.fenetreEditeurHTML:
        this.evenementSurBoutonHTML(this.tafCourant.descriptif);
        break;
      case EGenreEvenementTAFCahierDeTextes.ajouterDocumentJoint: {
        const lEstUneUrl =
          aDonneesSupplementaires.getGenre &&
          aDonneesSupplementaires.getGenre() === EGenreDocumentJoint.Url;
        let lListeFichiers;
        let lGenreDocument;
        if (lEstUneUrl) {
          const lNouvelleUrl = aDonneesSupplementaires;
          lListeFichiers = new ObjetListeElements().addElement(lNouvelleUrl);
          lGenreDocument = EGenreDocumentJoint.Url;
        } else {
          const lElementFichierUploade = aDonneesSupplementaires;
          lListeFichiers = lElementFichierUploade
            ? lElementFichierUploade.listeFichiers
            : null;
          lGenreDocument = EGenreDocumentJoint.Fichier;
        }
        _ajouterListeFichiers.call(this, lListeFichiers, lGenreDocument);
        break;
      }
      case EGenreEvenementTAFCahierDeTextes.editionDocumentJoint: {
        const lGenreFichier = aDonneesSupplementaires;
        this.evenementSurBoutonDocumentJoint(lGenreFichier);
        break;
      }
      case EGenreEvenementTAFCahierDeTextes.ajouterDocumentDepuisCloud: {
        let lParams = {
          callbaskEvenement: function (aLigne) {
            if (aLigne >= 0) {
              const lService = GEtatUtilisateur.listeCloud.get(aLigne);
              lThis.evenementSurBoutonDocumentJoint(
                EGenreDocumentJoint.Cloud,
                lService,
              );
            }
          },
          modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
        };
        UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
        break;
      }
      case EGenreEvenementTAFCahierDeTextes.ajouterLienKiosque: {
        const lFenetre = ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_PanierRessourceKiosque,
          { pere: this, evenement: _evenementSurFenetreRessourceKiosqueLiens },
        );
        lFenetre.setOptions({ avecMultiSelection: true });
        lFenetre.afficherFenetre();
        break;
      }
      default:
        break;
    }
  }
  surFermetureMessage() {
    this.setFocusIdCourant();
  }
  getListeDocumentsJointsSelonContexte(aGenreElementSelectionne) {
    return aGenreElementSelectionne === EGenreElementCDT.Contenu
      ? this.contenuCourant.ListePieceJointe
      : this.tafCourant.ListePieceJointe;
  }
  evenementSurBoutonDocumentJoint(AGenre, aInfoSelection) {
    const lListeDocumentsJointsActive =
      this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
    const lGenreFentrePJ =
      this.genreElementSelectionne === EGenreElementCDT.Contenu
        ? EGenreFenetreDocumentJoint.CahierDeTextes
        : EGenreFenetreDocumentJoint.TravailAFaire;
    if (AGenre !== EGenreDocumentJoint.Cloud) {
      this.getInstance(this.IdentEditionPieceJointe).afficherFenetrePJ({
        listePJTot: this.ListeDocumentsJoints,
        listePJContexte: lListeDocumentsJointsActive,
        genreFenetrePJ: lGenreFentrePJ,
        genrePJ: aInfoSelection
          ? aInfoSelection.meta.filetype === "image"
            ? EGenreDocumentJoint.Fichier
            : EGenreDocumentJoint.Url
          : AGenre,
        genreRessourcePJ: EGenreRessource.DocumentJoint,
        avecFiltre: { date: true, classeMatiere: true },
        listePeriodes: this.ListePeriodes,
        dateCours: this.DateCoursDeb,
        contenuCourant: this.contenuCourant,
        tafCourant: this.tafCourant,
        avecThemes: GApplication.parametresUtilisateur.get(
          "avecGestionDesThemes",
        ),
        optionsSelecFile: {
          multiple: !aInfoSelection,
          maxSize: GApplication.droits.get(
            TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
          ),
        },
        modeLien: !!aInfoSelection,
        surValiderAvantFermer: !!aInfoSelection
          ? function () {
              const lURL = this.getInstance(
                this.IdentEditionPieceJointe,
              ).getLien();
              if (this.instanceFenetreHTML) {
                const lEditor = TinyInit.get(
                  this.instanceFenetreHTML.idEditeurHTML,
                );
                if (lEditor) {
                  lEditor.settings.filePickerReturn(lURL);
                }
              }
              const lEltPJDeListeTot = this.getInstance(
                this.IdentEditionPieceJointe,
              ).getEltLien();
              this.ajouterDocAuContexte(lEltPJDeListeTot, true);
            }.bind(this)
          : null,
        validationAuto: !!aInfoSelection ? this.valider.bind(this) : null,
      });
    } else {
      this.getInstance(this.identFenetreFichiersCloud).setDonnees({
        service: aInfoSelection.Genre,
      });
    }
  }
  selectionnerCours(ACours, AGenreSelectionSemaine, aAvecEvenementSelection) {
    if (ACours) {
      GEtatUtilisateur.setNavigationCours(ACours);
      this.Cours = ACours;
      const LNumeroSemaine = this.Cours.NumeroSemaine;
      if (
        AGenreSelectionSemaine === EGenreSelectionSemaine.Forcer ||
        (AGenreSelectionSemaine === EGenreSelectionSemaine.Avec &&
          LNumeroSemaine !== this.NumeroSemaine)
      ) {
        this.getInstance(this.IdentCalendrier).setSelection(LNumeroSemaine);
      } else if (
        !this.getInstance(this.IdentGrille)
          .getInstanceGrille()
          .selectionnerCours(this.Cours, aAvecEvenementSelection)
      ) {
        this.setActif(false);
      }
    } else {
      this.setActif(false);
      this.setEtatIdCourant(true);
    }
  }
  evenementSurBoutonRechercheCours(aPrecedent) {
    GNavigateur.resetCodeTouche();
    this.setEtatSaisie(false);
    if (aPrecedent && this.CoursPrecedent) {
      this.setEtatIdCourant(false);
      this.selectionnerCours(this.CoursPrecedent, EGenreSelectionSemaine.Avec);
    }
    if (!aPrecedent && this.CoursSuivant) {
      this.setEtatIdCourant(false);
      this.selectionnerCours(this.CoursSuivant, EGenreSelectionSemaine.Avec);
    }
  }
  evenementSurCalendrier(
    ANumeroSemaine,
    ABidon,
    AGenreDomaineInformation,
    aEstDansPeriodeConsultation,
    AIsToucheSelection,
  ) {
    if (AIsToucheSelection) {
      this.setIdCourant(
        this.Instances[this.IdentGrille].getInstanceGrille().IdPremierElement,
      );
      this.setFocusIdCourant();
    } else {
      this.setIdCourant(this.Instances[this.IdentCalendrier].IdPremierElement);
      this.setEtatIdCourant(false);
      GEtatUtilisateur.setSemaineSelectionnee(
        (this.NumeroSemaine = ANumeroSemaine),
      );
      if (AGenreDomaineInformation === EGenreDomaineInformation.Feriee) {
        this.setActif(false);
        GHtml.setDisplay(this.Nom + "_Page", false);
        GHtml.setDisplay(this.Nom + "_Page_Message", true);
        this.setEtatIdCourant(true);
      } else {
        GHtml.setDisplay(this.Nom + "_Page_Message", false);
        GHtml.setDisplay(this.Nom + "_Page", true);
        new ObjetRequetePageEmploiDuTemps(
          this,
          this.actionSurCalendrier,
        ).lancerRequete({ numeroSemaine: this.NumeroSemaine });
      }
    }
  }
  ajouterDocAuContexte(aEltDocDeListeTot, aDepuisModeLien) {
    if (aEltDocDeListeTot === null || aEltDocDeListeTot === undefined) {
      return;
    }
    const lListeDocJointsSelonContexte =
      this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
    let lDocumentTrouve = lListeDocJointsSelonContexte.getElementParNumero(
      aEltDocDeListeTot.getNumero(),
    );
    if (lDocumentTrouve) {
      return;
    }
    let lActif = aDepuisModeLien ? true : aEltDocDeListeTot.getActif();
    let lDocumentJoint = new ObjetElement(
      aEltDocDeListeTot.getLibelle(),
      aEltDocDeListeTot.getNumero(),
      aEltDocDeListeTot.getGenre(),
      aEltDocDeListeTot.getPosition(),
      lActif,
    );
    lDocumentJoint.url = aEltDocDeListeTot.url;
    lDocumentJoint.estUnLienInterne = aDepuisModeLien;
    lDocumentJoint.setEtat(EGenreEtat.Creation);
    const lGenreDocJointEstDeContenu =
      this.genreElementSelectionne === EGenreElementCDT.Contenu;
    if (lGenreDocJointEstDeContenu) {
      if (
        this.contenuCourant.Numero === null ||
        this.contenuCourant.Numero === undefined
      ) {
        this.contenuCourant.setEtat(EGenreEtat.Creation);
      } else {
        this.contenuCourant.setEtat(EGenreEtat.Modification);
      }
    } else {
      if (
        this.tafCourant.Numero === null ||
        this.tafCourant.Numero === undefined
      ) {
        this.tafCourant.setEtat(EGenreEtat.Creation);
      } else {
        this.tafCourant.setEtat(EGenreEtat.Modification);
      }
    }
    lListeDocJointsSelonContexte.addElement(lDocumentJoint);
  }
  evenementEditionDocumentJoint() {
    let lMAJ = false;
    const lInstance = this.getInstance(this.IdentEditionPieceJointe);
    if (lInstance.parametres.modeLien) {
      return;
    }
    const lListeDocJointsSelonContexte =
      this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
    const lGenreDocJointEstDeContenu =
      this.genreElementSelectionne === EGenreElementCDT.Contenu;
    for (let I = 0; I < this.ListeDocumentsJoints.count(); I++) {
      let lDocumentJoint = lListeDocJointsSelonContexte.getElementParNumero(
        this.ListeDocumentsJoints.getNumero(I),
      );
      const lActif =
        this.ListeDocumentsJoints.get(I).Actif &&
        this.ListeDocumentsJoints.existe(I);
      if (lDocumentJoint) {
        if (!lActif) {
          lDocumentJoint.setEtat(EGenreEtat.Suppression);
          if (lGenreDocJointEstDeContenu) {
            if (
              this.contenuCourant.Numero === null ||
              this.contenuCourant.Numero === undefined
            ) {
              this.contenuCourant.setEtat(EGenreEtat.Creation);
            } else {
              this.contenuCourant.setEtat(EGenreEtat.Modification);
            }
          } else {
            if (
              this.tafCourant.Numero === null ||
              this.tafCourant.Numero === undefined
            ) {
              this.tafCourant.setEtat(EGenreEtat.Creation);
            } else {
              this.tafCourant.setEtat(EGenreEtat.Modification);
            }
          }
        }
      } else if (this.contenuCourant || this.tafCourant) {
        if (lActif) {
          this.ajouterDocAuContexte(this.ListeDocumentsJoints.get(I), false);
        }
      }
      if (!this.ListeDocumentsJoints.existe(I)) {
        for (let x = 0; x < this.CahierDeTextes.listeContenus.count(); x++) {
          const lTempPJ = this.CahierDeTextes.listeContenus
            .get(x)
            .ListePieceJointe.getElementParNumero(
              this.ListeDocumentsJoints.getNumero(I),
            );
          if (lTempPJ) {
            lTempPJ.setEtat(EGenreEtat.Suppression);
            lMAJ = true;
          }
        }
        for (
          let x = 0;
          x < this.CahierDeTextes.ListeTravailAFaire.count();
          x++
        ) {
          const lTempPJ = this.CahierDeTextes.ListeTravailAFaire.get(
            x,
          ).ListePieceJointe.getElementParNumero(
            this.ListeDocumentsJoints.getNumero(I),
          );
          if (lTempPJ) {
            lTempPJ.setEtat(EGenreEtat.Suppression);
            lMAJ = true;
          }
        }
      }
    }
    lListeDocJointsSelonContexte.trier();
    if (lGenreDocJointEstDeContenu) {
      this.verifierEtatContenu();
      this.getInstanceContenu().actualiserContenu(
        this.CahierDeTextes.listeContenus.get(this.indiceElementSelectionne),
        this.CahierDeTextes.verrouille,
        this.avecDocumentJoint,
        this.ContenuPleinEcran,
        _getOptionsContenuMenuMagique.call(
          this,
          this.CahierDeTextes.listeContenus.get(this.indiceElementSelectionne),
        ),
      );
    } else {
      this.actualiserTAF();
    }
    if (lMAJ) {
      this.actualiser(true);
    }
  }
  actualiserTAF() {
    this.getInstance(this.identListeTAFs).actualiser();
  }
  getInstanceContenu() {
    const lContenu = this.CahierDeTextes.listeContenus.get(
      this.indiceElementSelectionne,
    );
    let lIndice =
      this.CahierDeTextes.listeContenus.getIndiceExisteParElement(lContenu);
    if (lIndice === null || lIndice === undefined) {
      lIndice = this.CahierDeTextes.listeContenus.getNbrElementsExistes() - 1;
    }
    return this.getInstance(this.identContenus[lIndice]);
  }
  evenementSurFenetreRattachementCDT(aGenreBouton, aCahierDeTextes) {
    let lListeCDTaSupprimer;
    switch (aGenreBouton) {
      case 1:
        if (this.fenetreCDT) {
          this.fenetreCDT.fermer();
        }
        lListeCDTaSupprimer = this.listeCDT.getListeElements((aElement) => {
          return !aElement.existe();
        });
        new ObjetRequeteSaisieRattachementCDT(
          this,
          this._actionSurRequeteSaisieRattachementCDT,
        ).lancerRequete({
          cahierDeTextes: aCahierDeTextes,
          cours: this.Cours,
          numeroSemaine: this.NumeroSemaine,
          listeCDT:
            lListeCDTaSupprimer.count() > 0 ? lListeCDTaSupprimer : null,
        });
        break;
      case 2:
        this.paramFicheCDT = { pourCDT: true, cahierDeTextes: aCahierDeTextes };
        new ObjetRequeteFicheCDT(
          this,
          this._actionSurRequeteFicheCDT.bind(this),
        ).lancerRequete(this.paramFicheCDT);
        break;
      default:
        lListeCDTaSupprimer = this.listeCDT.getListeElements((aElement) => {
          return !aElement.existe();
        });
        if (lListeCDTaSupprimer.count() > 0) {
          new ObjetRequeteSaisieRattachementCDT(
            this,
            this._actionSurRequeteSaisieRattachementCDT,
          ).lancerRequete({
            numeroSemaine: this.NumeroSemaine,
            listeCDT: lListeCDTaSupprimer,
          });
        }
        break;
    }
    this._verifierListeCDTAAffecter(this.listeCDT);
  }
  _actionSurRequeteSaisieRattachementCDT() {
    this.recupererDonnees(false);
  }
  _actionSurRequeteFicheCDT(aGenreAffichageEDT, aCahierDeTextes) {
    TUtilitaireCDT.afficheFenetreDetail(
      this,
      {
        cahiersDeTextes: aCahierDeTextes,
        genreAffichage: aGenreAffichageEDT,
        gestionnaire: GestionnaireBlocCDT,
      },
      { evenementSurBlocCDT: this.evenementSurBlocCDT },
    );
  }
  evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
    switch (aGenreEvnt) {
      case EGenreBtnActionBlocCDT.executionQCM:
      case EGenreBtnActionBlocCDT.voirQCM:
        this.surExecutionQCMContenu(aParam.event, aElement);
        break;
      case EGenreBtnActionBlocCDT.detailTAF:
        ObjetFenetre_ListeTAFFaits.ouvrir(
          { pere: this, evenement: this._evenementFenetreTAFARendre },
          aElement,
        );
        break;
      default:
        break;
    }
  }
  _evenementFenetreTAFARendre(aGenreBouton) {
    if (aGenreBouton === TypeBoutonFenetreTAFFaits.Fermer) {
      new ObjetRequeteFicheCDT(
        this,
        this._actionSurRequeteFicheCDT.bind(this),
      ).lancerRequete(this.paramFicheCDT);
    }
  }
  initFenetreURLKiosque(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("CahierDeTexte.kiosque.fenetre.titre"),
      largeur: 600,
      hauteur: 150,
      listeBoutons: [
        GTraductions.getValeur("CahierDeTexte.kiosque.fenetre.boutonAnnuler"),
        GTraductions.getValeur(
          "CahierDeTexte.kiosque.fenetre.boutonEnregistrer",
        ),
      ],
      listeBoutonsInvisibles: [false, true],
    });
  }
  evntSurFenetreURLKiosque(aNumeroBouton, aListeRessourcesEdit) {
    if (aNumeroBouton !== 1) {
    } else {
      aListeRessourcesEdit.setSerialisateurJSON({
        ignorerEtatsElements: true,
        methodeSerialisation: _serialisationDonnees.bind(this),
      });
      Requetes(
        "SaisiePreferencesRessourcesKiosque",
        this,
        this.actionApresSaisie,
      ).lancerRequete({
        listeRessources: aListeRessourcesEdit,
        cours: this.Cours,
        numeroSemaine: this.NumeroSemaine,
      });
    }
  }
  actionApresSaisie(aJSON) {
    this.listeRessources = aJSON.JSONReponse.listeRessources;
    this.setDonneesKiosque();
  }
  _estPublieAuto() {
    return (
      new Date() >
      (GApplication.parametresUtilisateurBase.optionPublicationCDT ===
      TypeOptionPublicationCDT.OPT_PublicationDebutCours
        ? this.DateCoursDeb
        : this.DateCoursFin)
    );
  }
  evenementSurGrille(aParam) {
    const lParam = { genre: null, id: "", cours: null, date: 0, genreImage: 0 };
    $.extend(lParam, aParam);
    switch (lParam.genre) {
      case EGenreEvenementEDT.SurImage: {
        if (aParam.genreImage === 2) {
          this.paramFicheCDT = {
            pourTAF: true,
            cours: lParam.cours,
            numeroSemaine: this.NumeroSemaine,
          };
          new ObjetRequeteFicheCDT(
            this,
            this._actionSurRequeteFicheCDT.bind(this),
          ).lancerRequete(this.paramFicheCDT);
        }
        break;
      }
      case EGenreEvenementEDT.SurMenuContextuel:
      case EGenreEvenementEDT.SurCours:
        GEtatUtilisateur.setNavigationCours(lParam.cours);
        if (
          lParam.genre === EGenreEvenementEDT.SurMenuContextuel &&
          this.Cours &&
          this.Cours.getNumero() === lParam.cours.getNumero()
        ) {
          this.moduleSaisieCours
            .remplirCoursInfoModifierMatiereCoursPromise(lParam.cours)
            .then(() => {
              const lMenuContextuel = ObjetMenuContextuel.afficher({
                pere: this,
                evenement: _evenementSurMenuContextuel,
                initCommandes: _initialiserMenuContextuel.bind(
                  this,
                  lParam.cours,
                ),
                id: lParam.id,
              });
              this.setIdCourant(lMenuContextuel.IdPremierElement);
              this.setFocusIdCourant();
            });
        }
        this.idCours = lParam.id;
        this.Cours = lParam.cours;
        this.actionSurCours(!GNavigateur.CtrlTouche && !GNavigateur.AltTouche);
        break;
    }
  }
  actionSurCours(ASurActionClavier) {
    this.setEtatSaisie(false);
    if (this.fenetreCDT) {
      this.fenetreCDT.fermer(ASurActionClavier);
    }
    if (!this.Cours.utilisable) {
      this.setActif(
        false,
        GChaine.replaceRCToHTML(
          GTraductions.getValeur(
            "CahierDeTexte.CoursNonUtilisableDansPNParCDT",
          ),
        ),
      );
      return;
    } else {
      this.recupererCahierDeTextes(ASurActionClavier);
    }
  }
  getPageImpression() {
    return {
      titre1: this.LibelleImpression1,
      titre2: this.LibelleImpression2,
      contenu: this.composeImpression(),
    };
  }
  evenementSurAjoutContenu() {
    if (
      !this.CahierDeTextes.listeContenus.aUnElementVide() &&
      !this.CahierDeTextes.verrouille
    ) {
      this.CahierDeTextes.listeContenus.addElement(this._initContenu());
      this.genreElementSelectionne = EGenreElementCDT.Contenu;
      this.contenuCourant = this.CahierDeTextes.listeContenus.get(
        this.CahierDeTextes.listeContenus.count() - 1,
      );
      this.indiceElementSelectionne =
        this.CahierDeTextes.listeContenus.getIndiceParElement(
          this.contenuCourant,
        ) !== null
          ? this.CahierDeTextes.listeContenus.getIndiceParElement(
              this.contenuCourant,
            )
          : this.CahierDeTextes.listeContenus.count() - 1;
      this._actualiserContenu(true);
    }
  }
  evenementSurDatePublication(aDate) {
    this.CahierDeTextes.datePublication = aDate;
    this.setEtatSaisie(true);
  }
  actionSurRattachementCDT(aListeCDT) {
    this.listeCDT = aListeCDT;
    this._verifierListeCDTAAffecter(this.listeCDT);
    this.getInstance(this.identFenetreRattachementCDT).setBoutonLibelle(
      0,
      this.avecDrag
        ? GTraductions.getValeur("principal.fermer")
        : GTraductions.getValeur("principal.annuler"),
    );
    this.getInstance(this.identFenetreRattachementCDT).setDonnees(
      aListeCDT,
      this.avecDrag,
      {
        callbackDragStart: this._bloquerInterfaceTiny.bind(this, true),
        callbackDragStop: this._bloquerInterfaceTiny.bind(this, false),
      },
    );
  }
  _verifierListeCDTAAffecter(aListeCDT) {
    if (aListeCDT.getNbrElementsExistes() === 0) {
      GEtatUtilisateur.existeCDTsDetaches = false;
    }
  }
  surExecutionQCMContenu(aEvent, aExecutionQCM) {
    if (aEvent) {
      aEvent.stopImmediatePropagation();
    }
    UtilitaireQCMPN.executerQCM(
      this.getInstance(this.identFenetreVisuQCM),
      aExecutionQCM,
      true,
    );
  }
  evenementSurVisuEleve() {}
  evenementSurBoutonPleinEcranTAF() {
    this.TAFPleinEcran = !this.TAFPleinEcran;
    GHtml.setDisplay(this.Nom + "_ZoneGrille", !this.TAFPleinEcran);
    GHtml.setDisplay(this.Nom + "_ZoneContenu", !this.TAFPleinEcran);
    GHtml.setDisplay(
      this.Nom + "_ZoneElementsProgramme",
      !this.TAFPleinEcran && this.avecElementsProgramme,
    );
    GHtml.setDisplay(this.Nom + "_listePrec", !this.TAFPleinEcran);
    GHtml.setDisplay(this.Nom + "_P5", !this.TAFPleinEcran);
    GHtml.setDisplay(
      this.getInstance(this.IdentCalendrier).getNom(),
      !this.TAFPleinEcran,
    );
    this.$refreshSelf();
    if (this.TAFPleinEcran) {
      this.actualiser(false);
    } else {
      _restaurationEDTEnAttente.call(this);
      this.actualiser(false);
    }
    GNavigateur.surResize();
    this.surResizeInterface();
  }
  evenementSurBoutonPleinEcranContenu() {
    this.ContenuPleinEcran = !this.ContenuPleinEcran;
    GHtml.setDisplay(this.Nom + "_ZoneGrille", !this.ContenuPleinEcran);
    GHtml.setDisplay(this.Nom + "_P4", !this.ContenuPleinEcran);
    GHtml.setDisplay(this.Nom + "_P5", !this.ContenuPleinEcran);
    GHtml.setDisplay(this.Nom + "_listePrec", !this.ContenuPleinEcran);
    GHtml.setDisplay(
      this.Nom + "_ZoneElementsProgramme",
      !this.ContenuPleinEcran && this.avecElementsProgramme,
    );
    GHtml.setDisplay(
      this.getInstance(this.IdentCalendrier).getNom(),
      !this.ContenuPleinEcran,
    );
    this.$refreshSelf();
    if (this.ContenuPleinEcran) {
      this.actualiser(false);
    } else {
      _restaurationEDTEnAttente.call(this);
      this.actualiser(false);
    }
    GNavigateur.surResize();
    this.surResizeInterface();
  }
  _actualiserVisa() {
    GHtml.setHtml(this.idContenu, this.getLibelleContenus(this.Cours));
    GHtml.setHtml(
      this.idTravailAFaire,
      GTraductions.getValeur("CahierDeTexte.travailPersoAFaire"),
    );
  }
  _actualiserVisibilitePublication() {
    const lVisible = this.CahierDeTextes.existeNumero();
    GStyle.setVisible(this.idPublieContenu, lVisible);
    this.$refreshSelf();
  }
  _changementEtatSaisie(AEtat) {
    if (AEtat) {
      if (
        this.CahierDeTextes.Numero === null ||
        this.CahierDeTextes.Numero === undefined
      ) {
        this.CahierDeTextes.setEtat(EGenreEtat.Creation);
      } else {
        this.CahierDeTextes.setEtat(EGenreEtat.Modification);
      }
    } else {
      this.indiceElementSelectionne = -1;
      this.genreElementSelectionne = null;
      this.tafCourant = null;
      this.contenuCourant = null;
    }
  }
  setEtatSaisie(AEtat) {
    Invocateur.evenement(ObjetInvocateur.events.etatSaisie, AEtat);
    if (AEtat) {
      this._actualiserVisibilitePublication();
    }
  }
  actionSurCalendrier(aParam) {
    GEtatUtilisateur.existeCDTsDetaches = aParam.existeCDTsDetaches;
    this.setEtatSaisie(false);
    this.utilLienBtns.actualiser(false);
    if (aParam.message !== null && aParam.message !== undefined) {
      this.evenementAfficherMessage(aParam.message);
      this.setEtatIdCourant(true);
    } else {
      for (let I = 0; I < aParam.listeCours.count(); I++) {
        const lElementCours = aParam.listeCours.get(I);
        for (let J = 0; J < lElementCours.ListeContenus.count(); J++) {
          const lElementContenu = lElementCours.ListeContenus.get(J);
          const lGenre = lElementContenu.getGenre();
          if (
            lGenre === EGenreRessource.Matiere ||
            lGenre === EGenreRessource.Classe ||
            lGenre === EGenreRessource.Groupe ||
            lGenre === EGenreRessource.PartieDeClasse
          ) {
            lElementContenu.Visible = lGenre !== EGenreRessource.Matiere;
          } else {
            lElementContenu.Visible = false;
          }
        }
      }
      this.listeCours = aParam.listeCours;
      if (!this.TAFPleinEcran) {
        this.getInstance(this.IdentGrille).setDonnees({
          numeroSemaine: GEtatUtilisateur.getSemaineSelectionnee(),
          listeCours: this.listeCours,
          avecCoursAnnule: GEtatUtilisateur.getAvecCoursAnnule(),
        });
      } else {
        this.actualisationEDTAttente = true;
      }
      if (GEtatUtilisateur._coursASelectionner) {
        if (this.listeCours) {
          this.Cours = this.listeCours.getElementParElement(
            GEtatUtilisateur._coursASelectionner,
          );
        }
        delete GEtatUtilisateur._coursASelectionner;
      }
      this.selectionnerCours(this.Cours, EGenreSelectionSemaine.Sans);
    }
  }
  actionSurRecupererDonnees(aParam) {
    this.avecDocumentJoint = [];
    this.avecDocumentJoint[EGenreDocumentJoint.Fichier] =
      aParam.PublierDocuments;
    this.avecDocumentJoint[EGenreDocumentJoint.Url] = aParam.PublierUrl;
    this.avecDocumentJoint[EGenreDocumentJoint.Cloud] = aParam.PublierCloud;
    this.avecDocumentJoint[EGenreDocumentJoint.LienKiosque] =
      aParam.PublierKiosque;
    this.avecRessourcesGranulaire = GEtatUtilisateur.avecRessourcesGranulaire;
    this.avecVoirChargeTravail = !!aParam.voirChargeTAF;
    this.actionSurRecupererCategories(aParam.ListeCategories);
    this.ListePeriodes = aParam.ListePeriodes;
    this.ListeModeles = aParam.ListeModeles;
    this.ListeModeles.setTri([ObjetTri.init("Libelle")]);
    this.ListeModeles.trier();
    if (aParam.Domaine) {
      GEtatUtilisateur.setDomainePresence(
        GEtatUtilisateur.getMembre(),
        aParam.Domaine,
      );
    }
    this.getInstance(this.IdentCalendrier).setDomaineInformation(
      IE.Cycles.getDomaineFerie(),
      EGenreDomaineInformation.Feriee,
    );
    this.getInstance(this.IdentCalendrier).setDomaineInformation(
      GEtatUtilisateur.getDomainePresence(GEtatUtilisateur.getMembre()),
      EGenreDomaineInformation.AvecContenu,
    );
    this.getInstance(this.IdentCalendrier).setPeriodeDeConsultation(
      GApplication.droits.get(TypeDroits.cours.domaineConsultationEDT),
    );
    this.getInstance(this.IdentCalendrier).setSelection(
      GEtatUtilisateur.getSemaineSelectionnee(),
    );
    this.surResizeInterface();
  }
  actionSurRecupererCategories(aListeCategories) {
    this.listeCategories = aListeCategories;
    const LElement = new ObjetElement("", 0);
    this.listeCategories.addElement(LElement);
    this.listeCategories.trier();
  }
  actionSurRecupererCahierDeTextes(aCours, aParam) {
    this.setActif(true);
    this.listeRessources = aParam.listeRessources;
    this.listeClasses = aParam.listeClasses;
    this.DateCoursDeb = aParam.DateCoursDeb;
    this.DateCoursFin = aParam.DateCoursFin;
    this.DateTravailAFaire = aParam.DateTravailAFaire;
    this.avecQCMDevoir = aParam.avecQCMDevoir;
    this.servicesDevoir = aParam.servicesDevoir || new ObjetListeElements();
    this.avecQCMEvaluation = aParam.avecQCMEvaluation;
    this.servicesEvaluation =
      aParam.servicesEvaluation || new ObjetListeElements();
    this.listeClassesEleves = aParam.listeClassesEleves;
    this.nombresDEleves = aParam.nombresDEleves;
    this.CoursPrecedent = aParam.CoursPrecedent;
    this.CoursSuivant = aParam.CoursSuivant;
    this.dateCoursSuivantTAF = aParam.dateCoursSuivantTAF;
    if (aParam.JoursPresenceCours) {
      this.JoursPresenceCours = aParam.JoursPresenceCours;
    } else {
      this.JoursPresenceCours =
        this._cacheJoursPresenceCours[aCours.getNumero()];
    }
    this.listeCDTsPrecedents = aParam.listeCDTsPrecedents;
    if (this.listeCDTsPrecedents) {
      if (this.listeCDTsPrecedents.count() > 0) {
        this.paramsListeCDTPrec.nbAffiches = Math.min(
          this.paramsListeCDTPrec.nbAffiches,
          this.listeCDTsPrecedents.count(),
        );
      }
    }
    this.utilLienBtns.actualiser(true, this.CoursPrecedent, this.CoursSuivant);
    this.ListeDocumentsJoints = aParam.ListeDocumentsJoints;
    this.setDonneesContenus(this.Cours);
    this.setDonneesKiosque();
    const lCahierDeTextes = aParam.CahierDeTextes;
    if (!lCahierDeTextes.listeContenus) {
      lCahierDeTextes.listeContenus = new ObjetListeElements();
    }
    if (lCahierDeTextes.listeContenus.count() === 0) {
      lCahierDeTextes.listeContenus.addElement(this._initContenu());
    }
    this.setDonneesCahierDeTextes(lCahierDeTextes);
    this.setDonneesBandeauDroite(this.Cours, lCahierDeTextes);
    this.avecElementsProgramme = aParam.avecElementsProgramme;
    GHtml.setDisplay(
      this.Nom + "_ZoneElementsProgramme",
      !this.TAFPleinEcran &&
        !this.ContenuPleinEcran &&
        this.avecElementsProgramme,
    );
    const lInstance = this.getInstance(this.IdentEditionPieceJointe);
    if (lInstance && lInstance.EnAffichage) {
      if (lInstance.parametres.contenuCourant) {
        this.evenementSurContenu(null, lInstance.parametres.contenuCourant);
      }
      if (lInstance.parametres.tafCourant) {
        this.evenementTAFDesCours(null, lInstance.parametres.tafCourant);
      }
      lInstance.actualiserDonneesListe({
        listePiecesJointes: this.ListeDocumentsJoints,
      });
      this.actualiser(false);
    } else {
      this.actualiser(true);
    }
    if (this._ouvertureAutoFenetreDS) {
      this._ouvertureAutoFenetreDS();
    }
  }
  afficherPage() {
    this.recupererDonnees(this.avecRequeteGenerale);
  }
  reset(AAvecResetCahierDeTextes) {
    if (AAvecResetCahierDeTextes) {
      this.CoursPrecedent = null;
      this.CoursSuivant = null;
      this.ListeCahierDeTextes = new ObjetListeElements();
      this.listeRessources = new ObjetListeElements();
    }
    this.setDonneesBandeauDroite(null);
    this.setDonneesContenus(null);
    this.setDonneesKiosque();
    this.setDonneesCahierDeTextes(this._initCahierDeTextes());
  }
  _initCahierDeTextes() {
    return UtilitaireSaisieCDT.initCahierDeTextes();
  }
  _initContenu() {
    return UtilitaireSaisieCDT.createContenu();
  }
  getLibelleCours(aCours, aCahierDeTexte) {
    if (!aCours) {
      return "";
    }
    const lLibellePublics = this.getLibellePublicsDeCours(aCours);
    const lMatiere = aCours.ListeContenus.getElementParNumeroEtGenre(
      null,
      EGenreRessource.Matiere,
    );
    let lChaine =
      GDate.formatDate(aCours.DateDuCours, "%JJJJ %JJ %MMM %AAAA") +
      (lLibellePublics ? " - " + lLibellePublics : "") +
      (lMatiere ? " - " + lMatiere.getLibelle() : "");
    if (aCahierDeTexte && aCahierDeTexte.verrouille) {
      lChaine +=
        " (" +
        GTraductions.getValeur("CahierDeTexte.CDTViseEtVerrouille") +
        ")";
    }
    return GChaine.insecable(lChaine);
  }
  getLibelleContenus(aCours) {
    if (!aCours) {
      return GTraductions.getValeur("CahierDeTexte.contenus");
    }
    const lChaine = GChaine.format(
      GTraductions.getValeur("CahierDeTexte.contenusDu"),
      [GDate.formatDate(aCours.DateDuCours, "%JJJJ %JJ %MMM %AAAA")],
    );
    return GChaine.insecable(lChaine);
  }
  getLibellePublicsDeCours(aCours) {
    const lPublics = [];
    if (aCours && aCours.ListeContenus) {
      aCours.ListeContenus.parcourir((aElement) => {
        if (aElement.getGenre() === EGenreRessource.Groupe) {
          lPublics.push(aElement.getLibelle());
        }
      });
      aCours.ListeContenus.parcourir((aElement) => {
        if (aElement.getGenre() === EGenreRessource.Classe) {
          lPublics.push(aElement.getLibelle());
        }
      });
      aCours.ListeContenus.parcourir((aElement) => {
        if (aElement.getGenre() === EGenreRessource.PartieDeClasse) {
          lPublics.push(aElement.getLibelle());
        }
      });
    }
    return lPublics.join(", ");
  }
  setDonneesBandeauDroite(aCours, aCahierDeTexte) {
    const lTitreBandeau = [];
    lTitreBandeau.push(this.getLibelleCours(aCours, aCahierDeTexte));
    if (
      GApplication.parametresUtilisateur.get("CDT.Commentaire.ActiverSaisie") &&
      this.CoursPrecedent &&
      !!this.CoursPrecedent.noteProchaineSeance &&
      this.CoursPrecedent.noteProchaineSeance !== ""
    ) {
      lTitreBandeau.push(
        `<ie-btnicon ie-model="afficherNoteCoursPrecedent" class="icon_comment i-medium m-left-l"></ie-btnicon>`,
      );
    }
    GHtml.setHtml(this.idBandeauDroite, lTitreBandeau.join(""), {
      controleur: this.controleur,
    });
    if (aCours && aCours.DateDuCours) {
      const lInstanceDate = this.getInstance(this.IdentDatePublication);
      lInstanceDate.setParametresFenetre(
        GParametres.PremierLundi,
        GParametres.PremiereDate,
        aCours.DateDuCours,
        GParametres.JoursOuvres,
        null,
        GParametres.JoursFeries,
        null,
      );
      lInstanceDate.setDonnees();
      lInstanceDate.setActif(aCahierDeTexte.publie);
      if (aCahierDeTexte.datePublication) {
        lInstanceDate.setDonnees(aCahierDeTexte.datePublication);
      }
    }
  }
  setDonneesContenus(aCours) {
    GHtml.setHtml(this.idContenu, this.getLibelleContenus(aCours));
  }
  setDonneesKiosque() {
    const H = [];
    H.push('<div class="GrandEspaceGauche">');
    let lListeRessourcesDeCours;
    if (this.listeRessources) {
      lListeRessourcesDeCours = this.listeRessources.getListeElements(
        (aElement) => {
          return aElement.estRessourceDeCours;
        },
      );
    }
    if (lListeRessourcesDeCours && lListeRessourcesDeCours.count() === 1) {
      const lAvecBtnParametrage =
        this.listeRessources && this.listeRessources.count() > 0;
      const lIndice = this.listeRessources.getIndiceElementParFiltre(
        (aElement) => {
          return aElement.estRessourceDeCours;
        },
      );
      if (lAvecBtnParametrage) {
        H.push(
          '<div class="NoWrap"><div class="InlineBlock AlignementMilieuVertical">',
        );
      }
      H.push(
        ObjetFenetre_URLKiosque.composeLienRessource.call(
          this,
          this.listeRessources.get(lIndice),
          lIndice,
        ),
      );
      if (lAvecBtnParametrage) {
        H.push("</div>");
        H.push(
          '<div class="InlineBlock AlignementMilieuVertical EspaceGauche"><ie-btnicon ie-model="btnParametrerRessourceKiosque" class="icon_cog" style="font-size:1.4rem;"></ie-btnicon></div>',
        );
        H.push("</div>");
      }
    } else if (this.listeRessources && this.listeRessources.count() > 0) {
      H.push(
        '<div class="LienAccueil" onclick="',
        this.Nom,
        "._surOuvertureURLKiosque (",
        lListeRessourcesDeCours && lListeRessourcesDeCours.count() === 0,
        ')">',
        GTraductions.getValeur("CahierDeTexte.xManuelsNumeriques", [
          lListeRessourcesDeCours.count(),
        ]),
        "</div>",
      );
    }
    H.push("</div>");
    GHtml.setHtml(this.idKiosque, H.join(""), { controleur: this.controleur });
  }
  _surOuvertureURLKiosque(aAvecParametrage) {
    const lParam = { listeRessources: this.listeRessources };
    if (!!aAvecParametrage) {
      lParam.avecParametrage = aAvecParametrage;
    }
    if (this.getInstance(this.identFenetreURLKiosque)) {
      this.getInstance(this.identFenetreURLKiosque).setDonnees(lParam);
    }
  }
  setDonneesCahierDeTextes(aCahierDeTextes) {
    this.CahierDeTextes = aCahierDeTextes;
    this.CahierDeTextes.publie = !!this.CahierDeTextes.datePublication;
    this.ListeCahierDeTextes.addElement(this.CahierDeTextes, 0);
    this._actualiserVisa();
    this._actualiserVisibilitePublication();
  }
  setActif(AActif, aMessage) {
    const lIdMessage = this.Nom + "_ZoneDeSaisie_Message";
    if (!AActif) {
      const lMessage = aMessage
        ? aMessage
        : GTraductions.getValeur(
            "CahierDeTexte.SelectionnerUnCoursPourSaisirCDT",
          );
      $("#" + lIdMessage.escapeJQ() + " :first").html(lMessage);
    }
    GHtml.setDisplay(lIdMessage, !AActif);
    GHtml.setDisplay(this.Nom + "_ZoneDeSaisie", AActif);
    if (this.Actif !== AActif) {
      this.reset(true);
      this.utilLienBtns.actualiser(
        AActif && !!this.Cours,
        this.CoursPrecedent,
        this.CoursSuivant,
      );
    }
    this.Actif = AActif;
    if (this.Actif) {
      GHtml.setDisplay(
        this.getInstance(this.identListeCDTPrec).getNom(),
        this.paramsListeCDTPrec.deploye,
      );
    }
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
  }
  actualiser(aReconstruire) {
    Invocateur.evenement(
      ObjetInvocateur.events.activationImpression,
      EGenreImpression.Aucune,
    );
    if (this.CahierDeTextes) {
      this._actualiserContenu(
        aReconstruire === null || aReconstruire === undefined
          ? true
          : aReconstruire,
      );
      _actualiserElementsProgramme.call(this);
      _actualiserListeCDTsPrecedents.call(this);
    }
    this.surResizeInterface();
    if (this.CahierDeTextes) {
      this._actualiserTAF(
        aReconstruire === null || aReconstruire === undefined
          ? true
          : aReconstruire,
      );
    }
  }
  _actualiserContenu(aReconstruire) {
    let i = 0;
    let j = 0;
    let lIndice = -1;
    const lParamsAffichage = {
      avecRessourcesGranulaire: this.avecRessourcesGranulaire,
    };
    if (this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 1) {
      const lHeightZoom =
        GPosition.getHeight(this.Nom) -
        200 -
        (GApplication.parametresUtilisateur.get("avecGestionDesThemes")
          ? 44
          : 0);
      const lHeightNormal =
        GPosition.getHeight(this.Nom) / 2 -
        200 -
        (GApplication.parametresUtilisateur.get("avecGestionDesThemes")
          ? 44
          : 0);
      $.extend(lParamsAffichage, {
        autoresize: false,
        height: [lHeightNormal.toString(), lHeightZoom.toString()],
        min_height: ["75", "250"],
        max_height: [lHeightNormal.toString(), lHeightZoom.toString()],
        position: [false, undefined],
      });
    } else {
      $.extend(lParamsAffichage, {
        autoresize: true,
        height: ["75", "250"],
        min_height: ["75", "250"],
        max_height: ["200", "400"],
        position: [false, false],
      });
    }
    if (aReconstruire) {
      if (this.identContenus && this.identContenus.length > 0) {
        for (i = this.identContenus.length; i > 0; i--) {
          this.getInstance(this.identContenus[i - 1]).free();
          this.Instances[this.identContenus[i - 1]] = null;
        }
      }
      this.identContenus = [];
      if (this.CahierDeTextes) {
        GHtml.setHtml(this.Nom + "_Contenus", "");
        let lHR = false;
        j = 0;
        for (i = 0; i < this.CahierDeTextes.listeContenus.count(); i++) {
          if (this.CahierDeTextes.listeContenus.get(i).existe()) {
            this.identContenus[j] = this.add(
              InterfaceContenuCahierDeTextes,
              this.evenementSurContenu,
              null,
            );
            if (lHR) {
              GHtml.addHtml(this.Nom + "_Contenus", "<hr>");
            }
            GHtml.addHtml(
              this.Nom + "_Contenus",
              '<div id="' +
                this.getInstance(this.identContenus[j]).getNom() +
                '"></div>',
            );
            this.getInstance(this.identContenus[j]).cahierDeTexteVerrouille =
              this.CahierDeTextes.verrouille;
            this.getInstance(this.identContenus[j]).cours = this.Cours;
            this.getInstance(this.identContenus[j]).numeroSemaine =
              this.NumeroSemaine;
            this.getInstance(this.identContenus[j]).setParametresAffichage(
              lParamsAffichage,
            );
            this.getInstance(this.identContenus[j]).initialiser();
            lHR = true;
            j++;
          }
        }
      }
    }
    if (this.CahierDeTextes) {
      j = 0;
      for (i = 0; i < this.CahierDeTextes.listeContenus.count(); i++) {
        if (this.CahierDeTextes.listeContenus.get(i).existe()) {
          if (
            this.genreElementSelectionne === EGenreElementCDT.Contenu &&
            this.indiceElementSelectionne === i
          ) {
            lIndice = j;
            this.contenuCourant = this.CahierDeTextes.listeContenus.get(
              this.indiceElementSelectionne,
            );
          }
          this.indiceContenus[i] = j;
          this.getInstance(this.identContenus[j]).actualiserContenu(
            this.CahierDeTextes.listeContenus.get(i),
            this.CahierDeTextes.verrouille,
            this.avecDocumentJoint,
            this.ContenuPleinEcran,
            _getOptionsContenuMenuMagique.call(this),
          );
          j++;
        }
      }
      if (
        lIndice > -1 &&
        this.genreElementSelectionne === EGenreElementCDT.Contenu
      ) {
        this.getInstance(this.identContenus[lIndice]).focusSurPremierObjet();
      }
    }
  }
  _actualiserTAF(aReconstruire) {
    const lThis = this;
    if (aReconstruire) {
      this.getInstance(this.identListeTAFs).setDonnees({
        listeTAFs: this.CahierDeTextes.ListeTravailAFaire,
        CDTPublie: !!this.CahierDeTextes.publie || this._estPublieAuto(),
        CDTVerrouille: this.CahierDeTextes.verrouille,
        avecDocumentJoint: this.avecDocumentJoint,
        avecRessourcesGranulaire: this.avecRessourcesGranulaire,
        pleinEcran: this.TAFPleinEcran,
        dateDebutCours: this.DateCoursDeb,
        joursPresenceCours: this.JoursPresenceCours,
        avecQCMDevoir: this.avecQCMDevoir,
        servicesDevoir: this.servicesDevoir,
        avecQCMEvaluation: this.avecQCMEvaluation,
        servicesEvaluation: this.servicesEvaluation,
        cours: this.Cours,
        numeroSemaine: this.NumeroSemaine,
        listeClassesEleves: this.listeClassesEleves,
        listeModeles: this.ListeModeles,
        dateCreationTAF: this.dateCoursSuivantTAF || this.DateTravailAFaire,
        dateFinCours: this.DateCoursFin,
        afficherFenetreHtml: function (aDescriptif, aCallbackValider) {
          lThis.evenementSurBoutonHTML(aDescriptif, aCallbackValider);
        },
      });
    } else {
      this.actualiserTAF();
    }
  }
  _bloquerInterfaceTiny(aBloquer) {
    if (aBloquer !== false) {
      const lElementACouvrir = $(
        "#" + (this.Nom + "_P3").escapeJQ() + " :first-child",
      ).get(0);
      const ldivBloquant = GHtml.htmlToDOM(
        '<div class="' +
          this.classDivBlocTiny +
          '" ' +
          'style="position:absolute; z-index:10;' +
          "top:0;" +
          "left:0;" +
          GStyle.composeHeight(GPosition.getHeight(lElementACouvrir) + 2) +
          GStyle.composeWidth(GPosition.getWidth(lElementACouvrir) + 2) +
          GStyle.composeOpacite(0.01) +
          GStyle.composeCouleurFond(GCouleur.blanc) +
          '">&nbsp;</div>',
      );
      GHtml.insererElementDOM(lElementACouvrir, ldivBloquant, true);
    } else {
      $("." + this.classDivBlocTiny).remove();
    }
  }
  surResizeInterface() {
    super.surResizeInterface();
    _actualiserElementsProgramme.call(this);
  }
  _estVerrouille() {
    return this.CahierDeTextes ? this.CahierDeTextes.verrouille : true;
  }
  _getContenu(aIndice) {
    return this.CahierDeTextes.listeContenus.get(aIndice);
  }
  _getTAF(aIndice) {
    return this.CahierDeTextes.ListeTravailAFaire.get(aIndice);
  }
}
function _evenementSurFenetreElementsProgramme(aValider, aDonnees) {
  this.CahierDeTextes.listeElementsProgrammeCDT =
    aDonnees.listeElementsProgramme;
  this.palierElementTravailleSelectionne = aDonnees.palierActif;
  if (!!aDonnees.servicePourComptabilisationBulletin) {
    this.CahierDeTextes.servicePourComptabilisationBulletin =
      aDonnees.servicePourComptabilisationBulletin;
  }
  if (aValider) {
    this.setEtatSaisie(true);
    this.CahierDeTextes.setEtat(EGenreEtat.Modification);
  }
  this.surResizeInterface();
}
function _actualiserListeCDTsPrecedents() {
  if (this.paramsListeCDTPrec.deploye) {
    this.getInstance(this.identListeCDTPrec).setDonnees(
      new DonneesListe_CDTsPrecedents(
        this.listeCDTsPrecedents,
        this.paramsListeCDTPrec.nbAffiches,
      ),
    );
  }
}
function _evenementSurZoomListeCDT(aSurZoom) {
  this.listeCDTPleinEcran = aSurZoom;
  GHtml.setDisplay(
    this.getInstance(this.IdentCalendrier).getNom(),
    !this.listeCDTPleinEcran,
  );
  GHtml.setDisplay(this.Nom + "_ZoneGrille", !this.listeCDTPleinEcran);
  GHtml.setDisplay(this.Nom + "_P3_3", !this.listeCDTPleinEcran);
  GHtml.setDisplay(this.Nom + "_P5", !this.listeCDTPleinEcran);
  const lJContListePrec = $(`#${this.Nom.escapeJQ()}_P3_2`);
  if (this.listeCDTPleinEcran) {
    lJContListePrec.removeClass("fix-bloc").addClass("fluid-bloc");
  } else {
    lJContListePrec.removeClass("fluid-bloc").addClass("fix-bloc");
  }
  const lInstanceListe = this.getInstance(this.identListeCDTPrec);
  if (this.listeCDTPleinEcran) {
    GHtml.setDisplay(lInstanceListe.getNom(), true);
    this.paramsListeCDTPrec.deploye = true;
  } else {
    GHtml.setDisplay(lInstanceListe.getNom(), this.paramsListeCDTPrec.deploye);
    if (!GNavigateur.isLayoutTactile) {
      GPosition.setHeight(
        lInstanceListe.getNom(),
        this.paramsListeCDTPrec.hauteurListe,
      );
    }
  }
  if (!this.listeCDTPleinEcran) {
    _restaurationEDTEnAttente.call(this);
  }
  this.actualiser(false);
  GNavigateur.surResize();
  this.surResizeInterface();
}
function _composeListeCDTsPrecedents() {
  const H = [];
  H.push(
    '<div id="',
    this.Nom + '_listePrec" class="fluid-bloc flex-contain cols">',
  );
  H.push('<div class="fix-bloc p-y p-right-xl" style="overflow:hidden">');
  H.push('<div class="NoWrap" style="float:left">');
  H.push(
    '<div class="InlineBlock AlignementMilieuVertical">',
    '<ie-btnimage class="Image_DeploiementBandeau" ie-model="listeCDT.btnDeploy" ie-display="afficherDeploy" title="',
    GTraductions.getValeur("liste.HintBoutonDeploiement"),
    '" aria-labelledby="deploy" aria-controls="',
    this.getInstance(this.identListeCDTPrec).getNom(),
    '" aria-expanded="false"></ie-btnimage>',
    "</div>",
  );
  H.push(
    '<div class="InlineBlock EspaceGauche Gras AlignementMilieuVertical" id="deploy">',
    GTraductions.getValeur("CahierDeTexte.ContenusPrecedents"),
    "</div>",
  );
  H.push(
    '<div class="InlineBlock EspaceGauche AlignementMilieuVertical">',
    '<ie-btnimage class="Image_IconeMoins" ie-model="listeCDT.btnIconeMoins" style="width:18px;" aria-label="',
    GTraductions.getValeur("CahierDeTexte.retirerContenuPrecedent"),
    '" title="',
    GTraductions.getValeur("CahierDeTexte.afficherMoinsContenuPrecedent"),
    '"></ie-btnimage>',
    "</div>",
  );
  H.push(
    '<div class="InlineBlock EspaceGauche AlignementMilieuVertical Gras" ie-html="listeCDT.htmlElementsPrecedents"></div>',
  );
  H.push(
    '<p class="sr-only" aria-live="polite" ie-html="listeCDT.htmlElementsPrecedentsWAI"></p>',
  );
  H.push(
    '<div class="InlineBlock EspaceGauche AlignementMilieuVertical">',
    '<ie-btnimage class="Image_IconePlus" ie-model="listeCDT.btnIconePlus" style="width:18px;" aria-label="',
    GTraductions.getValeur("CahierDeTexte.ajouterContenuPrecedent"),
    '" title="',
    GTraductions.getValeur("CahierDeTexte.afficherPlusContenuPrecedent"),
    '"></ie-btnimage>',
    "</div>",
  );
  H.push("</div>");
  H.push(
    '<span style="float: right;">',
    UtilitaireBoutonBandeau.getHtmlBtnZoomPlusMoins(
      "btnAgrandirReduireZoneListeCDT",
    ),
    "</span>",
  );
  H.push("</div>");
  H.push(
    '<div id="',
    this.getInstance(this.identListeCDTPrec).getNom(),
    '" class="PetitEspaceBas fluid-bloc"',
    ' style="',
    GNavigateur.isLayoutTactile
      ? ""
      : GStyle.composeHeight(this.paramsListeCDTPrec.hauteurListe),
    '"></div>',
  );
  H.push(
    '<div ie-if="listeCDT.afficherTraitSeparation" style="',
    GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.haut),
    '" class="fix-bloc"></div>',
  );
  H.push("</div>");
  return H.join("");
}
function _composeLigneZoneContenu() {
  const H = [];
  H.push(
    '<div id="',
    this.Nom,
    '_ZoneContenu" style="flex: 1 1 52%; height:0;" class="flex-contain cols p-top">',
    '<div class="fluid-bloc flex-contain cols p-bottom" style="height: 0;">',
    '<div class="fix-bloc flex-contain flex-center justify-between flex-gap" style="min-height:22px;">',
    '<ie-btnicon ie-model="btnAjouterContenu" class="fix-bloc icon_plus_fin bt-activable"></ie-btnicon>',
    '<span id="',
    this.idContenu,
    '" class="fluid-bloc semi-bold Insecable" role="heading" aria-level="3">' +
      GTraductions.getValeur("CahierDeTexte.contenus") +
      "</span>",
    '<div class="fluid-bloc" id="',
    this.idKiosque,
    '"></div>',
    '<ie-btnicon class="fix-bloc icon_comment_vide bt-activable m-right" ie-if="avecSaisieCommentaire" ie-model="displayNoteProchaineSeance(false)"></ie-btnicon>',
    '<div class="fix-bloc p-right-xl">',
    UtilitaireBoutonBandeau.getHtmlBtnZoomPlusMoins(
      "btnAgrandirReduireZoneContenu",
    ),
    "</div>",
    "</div>",
    '<div class="flex-contain AvecScrollVertical EspaceDroit full-height" style="overflow-x:hidden;">',
    '<div id="',
    this.Nom,
    '_Contenus" class="fluid-bloc m-right"></div>',
    `<div ie-if="avecNoteProchaineSeance" ie-html="getHtmlNoteProchaineSeance" class="conteneur-postIt ThemeCat-pense-bete"></div>`,
    "</div>",
    "</div>",
    '<div ie-if="contenu.afficherTraitSeparation" class="fix-bloc m-top m-bottom-l" style="',
    GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.haut),
    '"></div>',
    "</div>",
  );
  return H.join("");
}
function _composeLigneZoneElementsProgramme() {
  const H = [];
  H.push(
    '<div id="',
    this.Nom,
    '_ZoneElementsProgramme" style="display:none;" class="fix-bloc flex-contain cols">',
  );
  H.push(
    '<div class="fix-bloc flex-contain flex-center justify-between flex-gap">',
  );
  H.push(
    '<ie-btnicon ie-model="btnElementsProgramme" class="fix-bloc icon_pencil bt-activable" aria-label="',
    GTraductions.getValeur("Fenetre_ElementsProgramme.Titre"),
    '" title="',
    GTraductions.getValeur("Fenetre_ElementsProgramme.Titre"),
    '"></ie-btnicon>',
  );
  H.push(
    '<span class="semi-bold fluid-bloc">',
    GTraductions.getValeur("CahierDeTexte.ElementsProgramme"),
    "</span>",
  );
  H.push(
    '<div class="fix-bloc p-right-xl">',
    UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("mrFicheElementsProg"),
    "</div>",
  );
  H.push("</div>");
  H.push(
    '<div id="',
    this.idElementsProgramme,
    '" class="m-left p-bottom-l p-x-xl">',
    "</div>",
  );
  H.push(
    '<div style="',
    GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.haut),
    '"></div>',
  );
  H.push("</div>");
  return H.join("");
}
function _composeLigneZoneTAF() {
  const H = [];
  H.push(
    '<div id="' +
      this.Nom +
      '_P4" style="flex: 1 1 48%; height:0;" class="flex-contain cols p-top flex-gap">',
    '<div class="fix-bloc full-width flex-contain flex-center justify-between">',
    '<div id="',
    this.idTravailAFaire,
    '" class="fluid-bloc semi-bold Insecable" role="heading" aria-level="3">',
    GTraductions.getValeur("CahierDeTexte.travailPersoAFaire"),
    "</div>",
    '<div class="flex-contain flex-center flex-gap-l p-y-l p-right-xl">',
    UtilitaireBoutonBandeau.getHtmlBtnParametrer("btnParametrageTAF"),
    '<span ie-display="btnAfficherChargeTravail.getDisplay">',
    UtilitaireBoutonBandeau.getHtmlBtnChargeDeTravail(
      "btnAfficherChargeTravail",
    ),
    "</span>",
    UtilitaireBoutonBandeau.getHtmlBtnZoomPlusMoins(
      "btnAgrandirReduireZoneTAF",
    ),
    "</div>",
    "</div>",
    '<div id="',
    this.getInstance(this.identListeTAFs).getNom(),
    '" class="fluid-bloc"></div>',
    "</div>",
    '<div ie-if="taf.afficherTraitSeparation" style="',
    GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.bas),
    '" class="m-top-l"></div>',
  );
  return H.join("");
}
function _composeLigneZoneCommentairePrive() {
  const H = [];
  H.push(
    '<div id="' +
      this.Nom +
      '_P5" class="flex-contain cols flex-gap p-top-l m-bottom-l">',
    '<div class="fix-bloc flex-contain flex-center flex-gap">',
    '<ie-btnicon ie-model="btnCommentairePrive" class="p-left-s icon_post_it_rempli bt-activable"></ie-btnicon>',
    '<span class="Gras">',
    GTraductions.getValeur("CahierDeTexte.postIt.commentairePrive.titre"),
    "</span>",
    "<span> (",
    GTraductions.getValeur("CahierDeTexte.postIt.commentairePrive.infoTitre"),
    ")</span>",
    "</div>",
    "</div>",
  );
  return H.join("");
}
function _initialiserListeCDTPrec(aInstance) {
  aInstance.setOptionsListe({
    colonnes: [
      { id: DonneesListe_CDTsPrecedents.colonnes.deploiement, taille: 10 },
      { id: DonneesListe_CDTsPrecedents.colonnes.contenu, taille: "70%" },
      { id: DonneesListe_CDTsPrecedents.colonnes.taf, taille: "30%" },
    ],
    colonnesSansBordureDroit: [
      DonneesListe_CDTsPrecedents.colonnes.deploiement,
    ],
  });
}
function _commandeCreerDevoirOuEval(aInstance, aContenu, aGenreLienDS) {
  const lSaisieEnCours = GEtatUtilisateur.EtatSaisie;
  aInstance._ouvertureAutoFenetreDS = function () {
    aInstance.contenuCourant = aContenu;
    _ouvrirFenetreDevoirSurTable.call(aInstance, aGenreLienDS);
  };
  ControleSaisieEvenement(() => {
    if (lSaisieEnCours) {
      aInstance.recupererCahierDeTextes(true);
    } else {
      _ouvrirFenetreDevoirSurTable.call(aInstance, aGenreLienDS);
    }
  });
}
function _evenementSurFenetreRessourceKiosqueLiens(aParams) {
  if (
    aParams.genreBouton === 1 &&
    !!aParams.selection &&
    aParams.selection.count() > 0
  ) {
    for (let i = 0; i < aParams.selection.count(); i++) {
      const lElement = aParams.selection.get(i);
      if (!!lElement && !!lElement.ressource) {
        const lElementCourant =
          this.genreElementSelectionne === EGenreElementCDT.TravailAFaire
            ? this.tafCourant
            : this.contenuCourant;
        const lLienKiosque = new ObjetElement(
          lElement.ressource.getLibelle(),
          null,
          EGenreDocumentJoint.LienKiosque,
        );
        lLienKiosque.ressource = lElement.ressource;
        lLienKiosque.setEtat(EGenreEtat.Creation);
        if (
          !UtilitaireSaisieCDT.ressourceGranulaireKiosqueEstDejaPresentDanslesPJ(
            lLienKiosque,
            lElementCourant.ListePieceJointe,
          )
        ) {
          this.ListeDocumentsJoints.addElement(lLienKiosque);
          lElementCourant.ListePieceJointe.addElement(lLienKiosque);
          lElementCourant.estVide = false;
          lElementCourant.setEtat(EGenreEtat.Modification);
          this.setEtatSaisie(true);
          this.actualiser(true);
        }
      }
    }
  }
}
function _ouvrirFenetreDevoirSurTable(aGenreLienDS, aParamsFenetreOrigine) {
  this._ouvertureAutoFenetreDS = null;
  const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_DevoirSurTable,
    { pere: this, evenement: _evenementSurFenetreDevoirSurTable.bind(this) },
  );
  lInstanceFenetre.setDonnees({
    cours: this.Cours,
    date: this.Cours.DateDuCours,
    numeroCycle: this.NumeroSemaine,
    contenu: this.contenuCourant,
    genreLienDS: aGenreLienDS,
    callbackSaisieSalle: _callbackSaisieSalle.bind(this, lInstanceFenetre),
    paramsFenetreOrigine: aParamsFenetreOrigine,
  });
}
function _rechercheElementContenu(aContenu) {
  let lContenu =
    this.CahierDeTextes.listeContenus.getElementParElement(aContenu);
  if (!lContenu && aContenu && aContenu.estVide) {
    this.CahierDeTextes.listeContenus.parcourir((D) => {
      if (D.estVide) {
        lContenu = D;
        return false;
      }
    });
  }
  return lContenu;
}
function _callbackSaisieSalle(aInstanceFenetre, aCours, aParamFenetre) {
  this.Cours = aCours;
  const lThis = this;
  this._ouvertureAutoFenetreDS = function () {
    lThis.contenuCourant = _rechercheElementContenu.call(
      lThis,
      aInstanceFenetre.param.contenu,
    );
    aInstanceFenetre.fermer();
    _ouvrirFenetreDevoirSurTable.call(
      lThis,
      aParamFenetre.genreLienDS,
      aParamFenetre,
    );
  };
  new ObjetRequetePageEmploiDuTemps(
    this,
    this.actionSurCalendrier,
  ).lancerRequete({ numeroSemaine: this.NumeroSemaine });
}
function _evenementSurFenetreDevoirSurTable(aValider, aParametres, aAvecLien) {
  if (!aValider) {
    return;
  }
  if (!this.contenuCourant || this.contenuCourant.estVide) {
    let lCategorie = null;
    this.listeCategories.parcourir((D) => {
      if (aParametres.genreLienDS === D.genreLienDS) {
        lCategorie = D;
        return false;
      }
    });
    const lNewContenu = new ObjetElement(aParametres.contenu.getLibelle());
    lNewContenu.setEtat(EGenreEtat.Creation);
    lNewContenu.descriptif = aParametres.contenu.descriptif;
    lNewContenu.estVide = false;
    lNewContenu.categorie = MethodesObjet.dupliquer(lCategorie);
    lNewContenu.ListePieceJointe = new ObjetListeElements();
    lNewContenu.genreLienDS = aParametres.genreLienDS;
    if (aAvecLien) {
      lNewContenu.infosDS = $.extend({}, aParametres);
    }
    const lIndice = this.CahierDeTextes.listeContenus.count() - 1;
    const lElementVide = this.CahierDeTextes.listeContenus.get(lIndice);
    if (lElementVide && lElementVide.existe() && lElementVide.estVide) {
      this.CahierDeTextes.listeContenus.remove(lIndice);
    }
    this.CahierDeTextes.listeContenus.addElement(lNewContenu);
    this.CahierDeTextes.publie = true;
    this.CahierDeTextes.datePublication = GDate.getDateCourante();
    this.genreElementSelectionne = EGenreElementCDT.Contenu;
    this.contenuCourant = this.CahierDeTextes.listeContenus.get(
      this.CahierDeTextes.listeContenus.count() - 1,
    );
    this.indiceElementSelectionne =
      this.CahierDeTextes.listeContenus.getIndiceParElement(
        this.contenuCourant,
      ) !== null
        ? this.CahierDeTextes.listeContenus.getIndiceParElement(
            this.contenuCourant,
          )
        : this.CahierDeTextes.listeContenus.count() - 1;
    if (
      this.CahierDeTextes.Numero === null ||
      this.CahierDeTextes.Numero === undefined
    ) {
      this.CahierDeTextes.setEtat(EGenreEtat.Creation);
      this.CahierDeTextes.publie = true;
      this.CahierDeTextes.datePublication = GDate.getDateCourante();
    } else {
      this.CahierDeTextes.setEtat(EGenreEtat.Modification);
    }
    this.valider();
  } else {
    this.contenuCourant.setEtat(EGenreEtat.Modification);
    this.contenuCourant.Libelle = aParametres.contenu.getLibelle();
    this.contenuCourant.descriptif = aParametres.contenu.descriptif;
    this.contenuCourant.genreLienDS = aParametres.genreLienDS;
    if (aParametres.surModification_suppression) {
      this.contenuCourant.suppressionLien = true;
    } else if (aAvecLien) {
      this.contenuCourant.infosDS = $.extend({}, aParametres);
    }
    this.CahierDeTextes.setEtat(EGenreEtat.Modification);
    this.valider();
  }
}
function _serialisationDonnees(aElement) {
  if (aElement.estRessourceDeCours === false) {
    return false;
  }
}
function _collerCDT() {
  UtilitaireSaisieCDT.collerCDT(
    this.CahierDeTextes,
    this.CahierDeTextesCopie,
    this.avecElementsProgramme,
    this.dateCoursSuivantTAF || this.DateTravailAFaire,
  );
  this.ListeCahierDeTextes.addElement(this.CahierDeTextes, 0);
  this.actualiser(true);
  this.setEtatSaisie(true);
  this.setFocusIdCourant();
}
function _evenementSurMenuContextuel(ALigne) {
  this.setIdCourant(
    this.getInstance(this.IdentGrille).getNom() + "_Navigation",
  );
  if (GNavigateur.isToucheEchap()) {
    this.setFocusIdCourant();
  }
  if (ALigne && !GNavigateur.isToucheEchap()) {
    switch (ALigne.Numero) {
      case EGenreCommandeCdT.CopierCdT:
        this.CahierDeTextesCopie = this.CahierDeTextes;
        this.setFocusIdCourant();
        break;
      case EGenreCommandeCdT.CollerCdT:
        if (
          this.CahierDeTextesCopie &&
          this.CahierDeTextesCopie.getNumero() !==
            this.CahierDeTextes.getNumero()
        ) {
          if (this.Cours && this.Cours.utilisable && this.Cours.AvecCdT) {
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: GTraductions.getValeur(
                "CahierDeTexte.ConfirmerCollerCahierSurExistant",
              ),
              callback: function (aGenreAction) {
                if (aGenreAction === EGenreAction.Valider) {
                  _collerCDT.call(this);
                }
              }.bind(this),
            });
          } else {
            _collerCDT.call(this);
          }
        }
        break;
      case EGenreCommandeCdT.SupprimerCdT:
        GApplication.getMessage().afficher({
          type: EGenreBoiteMessage.Confirmation,
          message: GTraductions.getValeur(
            "CahierDeTexte.msgConfirmationSupprimerContenu",
          ),
          callback: new Callback(this, function (aAccepte) {
            if (aAccepte === EGenreAction.Valider) {
              this.CahierDeTextes.setEtat(EGenreEtat.Suppression);
              this.setEtatSaisie(true);
              this.valider();
            }
          }),
        });
        break;
      case EGenreCommandeCdT.AffecterProgressionAuCdT:
        _affecterProgressionAuCdT.call(this, true);
        break;
      case EGenreCommandeCdT.RattacherCDT:
        this.avecDrag = false;
        new ObjetRequeteListeCDTPourRattachement(
          this,
          this.actionSurRattachementCDT,
        ).lancerRequete();
        break;
      case EGenreCommandeCdT.saisieDS:
      case EGenreCommandeCdT.saisieEval:
        this.contenuCourant = this.CahierDeTextes.listeContenus.get(0);
        _commandeCreerDevoirOuEval(
          this,
          this.contenuCourant,
          ALigne.Numero === EGenreCommandeCdT.saisieDS
            ? EGenreLienDS.tGL_Devoir
            : EGenreLienDS.tGL_Evaluation,
        );
        break;
      case EGenreCommandeCdT.AjouterContenuDansProgression:
        this.getInstance(
          this.identFenetreChoixDossierCopieCDT,
        ).afficherChoixDossierCopieCDT(this.Cours, this.CahierDeTextes);
        break;
    }
  }
}
function _callbackAffectationProgression(aParams) {
  aParams.listeNewContenus.parcourir((aContenu) => {
    const lIndice = this.CahierDeTextes.listeContenus.count() - 1;
    const lElementVide = this.CahierDeTextes.listeContenus.get(lIndice);
    if (lElementVide && lElementVide.existe() && lElementVide.estVide) {
      this.CahierDeTextes.listeContenus.remove(lIndice);
    }
    this.CahierDeTextes.listeContenus.addElement(aContenu);
    this.contenuCourant = aParams.contenu;
    this.genreElementSelectionne = EGenreElementCDT.Contenu;
    this.indiceElementSelectionne =
      this.CahierDeTextes.listeContenus.getIndiceParElement(
        this.contenuCourant,
      ) !== null
        ? this.CahierDeTextes.listeContenus.getIndiceParElement(
            this.contenuCourant,
          )
        : this.CahierDeTextes.listeContenus.count() - 1;
  });
  aParams.listeNewTAFs.parcourir((aTAF) => {
    this.CahierDeTextes.ListeTravailAFaire.addElement(aTAF);
  });
  if (aParams.listeNewContenus.count() > 0) {
    this._actualiserContenu(true);
  }
  if (aParams.listeNewTAFs.count() > 0) {
    this._actualiserTAF(true);
  }
  this.setEtatSaisie(true);
}
function _affecterProgressionAuCdT(avecTAFVisible) {
  const lPublics = this.Cours.ListeContenus.getListeElements((aContenu) => {
    return [
      EGenreRessource.Classe,
      EGenreRessource.Groupe,
      EGenreRessource.PartieDeClasse,
    ].includes(aContenu.getGenre());
  });
  const lMatiere = this.Cours.ListeContenus.getElementParNumeroEtGenre(
    null,
    EGenreRessource.Matiere,
  );
  UtilitaireSaisieCDT.affecterProgressionAuCdT({
    instance: this,
    avecTAFVisible: avecTAFVisible,
    cours: this.Cours,
    numeroSemaine: this.NumeroSemaine,
    cdt: this.CahierDeTextes,
    JoursPresenceCours: this.JoursPresenceCours,
    dateTAFMin: this.DateCoursDeb,
    dateTAF: new Date(
      (this.dateCoursSuivantTAF || this.DateTravailAFaire).getTime(),
    ),
    listeCategories: this.listeCategories,
    strPublics: lPublics.getTableauLibelles().join(", "),
    strMatiere: lMatiere ? lMatiere.getLibelle() : "",
    callbackAffectation: _callbackAffectationProgression.bind(this),
  });
}
function _initialiserMenuContextuel(aCours, aInstance) {
  aInstance.addCommande(
    EGenreCommandeCdT.CopierCdT,
    GTraductions.getValeur("CahierDeTexte.CopierCDT"),
    !!(aCours.utilisable && aCours.AvecCdT),
  );
  aInstance.addCommande(
    EGenreCommandeCdT.CollerCdT,
    GTraductions.getValeur("CahierDeTexte.CollerCDT"),
    !(
      !this.CahierDeTextesCopie ||
      !aCours.utilisable ||
      (this.CahierDeTextes && this.CahierDeTextes.verrouille)
    ),
  );
  aInstance.addCommande(
    EGenreCommandeCdT.SupprimerCdT,
    GTraductions.getValeur("CahierDeTexte.SupprimerCDT"),
    !!(aCours.AvecCdT && !this.CahierDeTextes.verrouille && aCours.utilisable),
  );
  aInstance.addSeparateur();
  aInstance.addCommande(
    EGenreCommandeCdT.RattacherCDT,
    GTraductions.getValeur("CahierDeTexte.RattacherAUnCDTSansCours"),
    GEtatUtilisateur.existeCDTsDetaches,
  );
  aInstance.addSeparateur();
  const lActiverSaisieDSOuEval = !!(
    aCours.utilisable &&
    !this.CahierDeTextes.verrouille &&
    this.CahierDeTextes.listeContenus.get(0) &&
    this.CahierDeTextes.listeContenus.get(0).estVide
  );
  if (this.avecGestionNotation) {
    aInstance.addCommande(
      EGenreCommandeCdT.saisieDS,
      GTraductions.getValeur("CahierDeTexte.ProgrammerDS"),
      lActiverSaisieDSOuEval,
    ).image = TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
      TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
    );
  }
  aInstance.addCommande(
    EGenreCommandeCdT.saisieEval,
    GTraductions.getValeur("CahierDeTexte.ProgrammerEval"),
    lActiverSaisieDSOuEval,
  ).image = TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
    TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
  );
  aInstance.addSeparateur();
  aInstance.addCommande(
    EGenreCommandeCdT.AffecterProgressionAuCdT,
    GTraductions.getValeur("CahierDeTexte.AffectationEltsProgressionAUnCahier"),
    !!(aCours.utilisable && !this.CahierDeTextes.verrouille),
  );
  aInstance.addCommande(
    EGenreCommandeCdT.AjouterContenuDansProgression,
    GTraductions.getValeur("CahierDeTexte.AjouterElementsCDT"),
    aCours.utilisable &&
      this.CahierDeTextes &&
      ((this.CahierDeTextes.listeContenus &&
        this.CahierDeTextes.listeContenus.getNbrElementsExistes() > 0 &&
        !this.CahierDeTextes.listeContenus.aUnElementVide()) ||
        (this.CahierDeTextes.ListeTravailAFaire &&
          this.CahierDeTextes.ListeTravailAFaire.getNbrElementsExistes() > 0)),
  );
  aInstance.avecSeparateurSurSuivant();
  this.moduleSaisieCours.initMenuContextuelModifMatiere(aInstance, aCours);
  this.moduleSaisieCours.initMenuContextuelSupprimer(aInstance, aCours, true);
}
function _actualiserGrille() {
  this.getInstance(this.IdentGrille).setDonnees({
    numeroSemaine: GEtatUtilisateur.getSemaineSelectionnee(),
    listeCours: this.listeCours,
    avecCoursAnnule: GEtatUtilisateur.getAvecCoursAnnule(),
  });
  this.selectionnerCours(this.Cours, EGenreSelectionSemaine.Sans, false);
  delete this.actualisationEDTAttente;
}
function _restaurationEDTEnAttente() {
  if (this.actualisationEDTAttente) {
    _actualiserGrille.call(this);
  }
}
function _getOptionsContenuMenuMagique() {
  return UtilitaireSaisieCDT.getOptionsContenuMenuMagique({
    cdt: this.CahierDeTextes,
    listeCDTsPrecedents: this.listeCDTsPrecedents,
  });
}
function _actualiserElementsProgramme() {
  const H = [];
  if (
    this.avecElementsProgramme &&
    this.CahierDeTextes.listeElementsProgrammeCDT &&
    this.CahierDeTextes.listeElementsProgrammeCDT.getNbrElementsExistes()
  ) {
    this.CahierDeTextes.listeElementsProgrammeCDT.trier();
    let lElement;
    const lMaxHeight = Math.max(
      40,
      Math.floor(GPosition.getHeight(this.Nom + "_P3_2") / 4 - 20),
    );
    H.push('<div ie-scrollv style="max-height:', lMaxHeight, 'px;"><div>');
    H.push("<ul>");
    for (
      let i = 0;
      i < this.CahierDeTextes.listeElementsProgrammeCDT.count();
      i++
    ) {
      lElement = this.CahierDeTextes.listeElementsProgrammeCDT.get(i);
      if (lElement.existe()) {
        H.push("<li>", lElement.getLibelle(), "</li>");
      }
    }
    H.push("</ul>");
    H.push("</div></div>");
  }
  GHtml.setHtml(this.idElementsProgramme, H.join(""), {
    controleur: this.controleur,
  });
}
function _ajouterListeFichiers(aListeFichiers, aGenreDocJoint) {
  if (aListeFichiers && aListeFichiers.count() > 0) {
    const lPJsCloud =
      UtilitaireSelecFile.extraireListeFichiersCloudsPartage(aListeFichiers);
    if (aListeFichiers.count() > 0) {
      const lListeDocJointsSelonContexte =
        this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
      this.getInstance(
        this.IdentEditionPieceJointe,
      ).ajouterPiecesJointesAvecAppelCallback(
        aListeFichiers,
        aGenreDocJoint,
        this.ListeDocumentsJoints,
        lListeDocJointsSelonContexte,
        true,
      );
    }
    if (lPJsCloud.count() > 0) {
      const lElementCourant =
        this.genreElementSelectionne === EGenreElementCDT.TravailAFaire
          ? this.tafCourant
          : this.contenuCourant;
      lPJsCloud.parcourir((aFichier) => {
        lElementCourant.ListePieceJointe.addElement(aFichier);
        lElementCourant.estVide = false;
        this.ListeDocumentsJoints.addElement(aFichier);
      });
      lElementCourant.setEtat(EGenreEtat.Modification);
      this.actualiser(true);
    }
    this.setEtatSaisie(true);
  }
}
module.exports = ObjetAffichagePageSaisieCahierDeTextes;
