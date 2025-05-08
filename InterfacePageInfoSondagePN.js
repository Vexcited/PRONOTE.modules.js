const { MethodesObjet } = require("MethodesObjet.js");
const { InterfacePageInfoSondage } = require("InterfacePageInfoSondage.js");
const { ObjetRequetePageActualites } = require("ObjetRequetePageActualites.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetMoteurActus } = require("ObjetMoteurActus.js");
const { EGenreEvntActu, EGenreEvntActuUtil } = require("EGenreEvntActu.js");
const {
  ObjetRequeteSaisieActualites,
} = require("ObjetRequeteSaisieActualites.js");
const {
  ObjetRequeteSaisieActualitesNotification,
} = require("ObjetRequeteSaisieActualitesNotification.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  TypeBoutonFenetreResultatActualite,
} = require("ObjetFenetre_ResultatsActualite.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  ObjetFenetre_EditionActualite,
} = require("ObjetFenetre_EditionActualite.js");
const {
  ObjetRequeteGenererFichiersResultatsSondage,
} = require("ObjetRequeteGenererFichiersResultatsSondage.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const {
  MoteurInfoSondage,
  EGenreEvntMenuCtxBlocInfoSondage,
} = require("MoteurInfoSondage.js");
const { UtilitaireGenreRessource } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreEspace } = require("GestionnaireBlocPN.js");
const { UtilitaireGenreReponse } = require("GestionnaireBlocPN.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
  ObjetRequeteSaisieFichierResultatsSondage,
} = require("ObjetRequeteSaisieFichierResultatsSondage.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetFenetre_Message } = require("ObjetFenetre_Message.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GDate } = require("ObjetDate.js");
const {
  FicheEditionInfoSond_Mobile,
} = require("FicheEditionInfoSond_Mobile.js");
const { MoteurDestinatairesPN } = require("MoteurDestinatairesPN.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { MoteurGestionPJPN } = require("MoteurGestionPJPN.js");
const {
  TypeItemEnum,
  TypeItemEnumUtil,
  TypeModeAff,
} = require("TypeEtatPublication.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const ObjetRequeteSaisieExportFichierProf = require("ObjetRequeteSaisieExportFichierProf.js");
const { TypeGenreEchangeDonnees } = require("TypeGenreEchangeDonnees.js");
const { GChaine } = require("ObjetChaine.js");
const ObjetFenetre_ImportFichierProf = require("ObjetFenetre_ImportFichierProf.js");
const { GCache } = require("Cache.js");
const { ObjetRequeteListeDiffusion } = require("ObjetRequeteListeDiffusion.js");
const {
  ObjetFenetre_SelectionListeDiffusion,
} = require("ObjetFenetre_SelectionListeDiffusion.js");
const {
  DonneesListe_SelectionDiffusion,
} = require("DonneesListe_SelectionDiffusion.js");
const {
  ObjetFenetre_ResultatsActualite_PN,
} = require("ObjetFenetre_ResultatsActualite_PN.js");
class InterfacePageInfoSondagePN extends InterfacePageInfoSondage {
  constructor(...aParams) {
    super(...aParams);
    this.utilitaires = {
      genreRessource: new UtilitaireGenreRessource(),
      genreEspace: new UtilitaireGenreEspace(),
      genreReponse: new UtilitaireGenreReponse(),
      moteurDestinataires: new MoteurDestinatairesPN(),
      moteurGestionPJ: new MoteurGestionPJPN(),
    };
    this.moteur = new ObjetMoteurActus(this.utilitaires);
    this.moteurCP = new MoteurInfoSondage(this.utilitaires);
    this.diffusionResultatsSondageEnCours = false;
    this.listePJ =
      this.avecAuteur && this.droitSaisie
        ? this.utilitaires.moteurGestionPJ.getListePJEtablissement()
        : null;
    this.page = IE.estMobile
      ? GEtatUtilisateur.getPage()
      : GEtatUtilisateur.Navigation.OptionsOnglet;
    if (!!this.page && this.page.avecActionSaisie) {
      this.genreAff = this.genresAffichages.saisie;
      this.filtreModeItem = TypeItemEnum.IE_Diffusion_Tout;
      this.modeAuteur = this.avecAuteur;
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {});
  }
  instancierEditionInfoSond() {
    if (IE.estMobile) {
      return this.addFenetre(
        FicheEditionInfoSond_Mobile,
        _evenementEditionActu.bind(this),
        _initFicheEditionInfoSond.bind(this),
      );
    } else {
      return this.addFenetre(
        ObjetFenetre_EditionActualite,
        _evenementEditionActu.bind(this),
        this.initFenetreEditionInfoSond,
      );
    }
  }
  actualiserDonnees() {
    const lModesAff = new TypeEnsembleNombre();
    lModesAff.add(TypeModeAff.MA_Reception);
    if (this.avecAuteur) {
      lModesAff.add(TypeModeAff.MA_Diffusion);
      lModesAff.add(TypeModeAff.MA_Brouillon);
      lModesAff.add(TypeModeAff.MA_Modele);
    }
    new ObjetRequetePageActualites(
      this,
      _actionSurRecupererDonnees.bind(this),
    ).lancerRequete({ modesAffActus: lModesAff });
  }
  estInfoSondDuTypeModeDiff(aInfoSond, aFiltreModeAff) {
    const lInfos = this.moteurCP.getInfosPublication(aInfoSond);
    switch (aFiltreModeAff) {
      case TypeItemEnum.IE_Diffusion_Tout:
        return true;
      case TypeItemEnum.IE_Diffusion_Publiee:
        return lInfos.estEnCours;
      case TypeItemEnum.IE_Diffusion_PublieeFutur:
        return lInfos.estFutur;
      case TypeItemEnum.IE_Diffusion_PublieePasse:
        return lInfos.estPassee;
      case TypeItemEnum.IE_Brouillon:
        return !lInfos.estPubliee;
      default:
        return false;
    }
  }
  estInfoSondDuTypeModeModeles(aInfoSond, aFiltreModeAff) {
    switch (aFiltreModeAff) {
      case TypeItemEnum.IE_Modele_Info:
        return aInfoSond.estInformation;
      case TypeItemEnum.IE_Modele_Sondage:
        return aInfoSond.estSondage;
      default:
        return false;
    }
  }
  getListeActualitesDeModeAff(aModeAff) {
    const lData = this.tabModeAff[aModeAff];
    if (lData !== null && lData !== undefined) {
      return lData.listeActualites;
    } else {
      return null;
    }
  }
  getCompteurDeType(aTypeItemEnum) {
    let lModeAff = TypeItemEnumUtil.getTypeModeAffDeTypeItemEnum(aTypeItemEnum);
    let lListeActus = this.getListeActualitesDeModeAff(lModeAff);
    if (lListeActus === null || lListeActus === undefined) {
      return 0;
    }
    let lListeFiltree = lListeActus.getListeElements((aElt) => {
      switch (aTypeItemEnum) {
        case TypeItemEnum.IE_Reception:
          return !aElt.lue;
        case TypeItemEnum.IE_Diffusion_Tout:
        case TypeItemEnum.IE_Diffusion_PublieePasse:
        case TypeItemEnum.IE_Diffusion_Publiee:
        case TypeItemEnum.IE_Diffusion_PublieeFutur:
        case TypeItemEnum.IE_Brouillon:
          return this.estInfoSondDuTypeModeDiff(aElt, aTypeItemEnum);
        case TypeItemEnum.IE_Modele_Sondage:
        case TypeItemEnum.IE_Modele_Info:
          return this.estInfoSondDuTypeModeModeles(aElt, aTypeItemEnum);
        default:
          return false;
      }
    });
    return lListeFiltree !== null && lListeFiltree !== undefined
      ? lListeFiltree.count()
      : 0;
  }
  getListeFiltree() {
    const lListeFiltree = this.listeActualites.getListeElements((aElement) => {
      return (
        !(this.estGenreReception() && this.uniquementNonLues && aElement.lue) &&
        (!this.estGenreDiffusion() ||
          this.estInfoSondDuTypeModeDiff(aElement, this.filtreModeItem)) &&
        (!this.estGenreModeles() ||
          this.estInfoSondDuTypeModeModeles(aElement, this.filtreModeItem)) &&
        (!this.avecFiltreCategorie ||
          (this.categorie !== null &&
            this.categorie !== undefined &&
            (!this.categorie.existeNumero() ||
              aElement.categorie.getNumero() === this.categorie.getNumero())))
      );
    });
    lListeFiltree.setTri([
      ObjetTri.init("dateDebut", EGenreTriElement.Decroissant),
      ObjetTri.init("dateCreation", EGenreTriElement.Decroissant),
      ObjetTri.init("Libelle"),
    ]);
    lListeFiltree.trier();
    return lListeFiltree;
  }
  getOptionsInfoSond() {
    return {
      avecEditionActualite: this.estGenreDiffusion() || this.estGenreModeles(),
      droitSaisie: this.droitSaisie,
      droitPublicationPageEtablissement: this.droitPublicationPageEtablissement,
      avecVisuResultats: this.estGenreDiffusion(),
      avecSuppressionActusRecues: true,
      avecDiscussion:
        this.estGenreReception() &&
        [
          EGenreEspace.Professeur,
          EGenreEspace.PrimProfesseur,
          EGenreEspace.Etablissement,
          EGenreEspace.Administrateur,
          EGenreEspace.PrimDirection,
          EGenreEspace.Eleve,
          EGenreEspace.Parent,
          EGenreEspace.PrimParent,
          EGenreEspace.Accompagnant,
          EGenreEspace.PrimAccompagnant,
          EGenreEspace.Tuteur,
        ].includes(GEtatUtilisateur.GenreEspace),
      avecModeles: this.getAvecModeles(),
      estCtxModeles: this.estGenreModeles(),
      evenementMenuContextuel: function (aInfoSond, aGenreEvnt, aParam) {
        this.evntSurValidationInfoSond(aInfoSond, aGenreEvnt, aParam);
      }.bind(this),
    };
  }
  reInitialiserSurValidation() {
    this.contexte.niveauCourant = this.getNiveauDeGenreEcran({
      genreEcran: this.avecAuteur
        ? InterfacePageInfoSondage.genreEcran.listeTypesBlocs
        : InterfacePageInfoSondage.genreEcran.listeBlocs,
    });
    this._jetonReinitScrollListeInfosSond = this.getInstance(
      this.identListeInfosSond,
    ).getPositionScrollV();
    this.initialiser(true);
  }
  evntSurValidationInfoSond(aInfoSond, aGenreEvnt, aParam) {
    if (EGenreEvntActuUtil.estEvntSaisieReponse(aGenreEvnt)) {
      aParam.modeAuteur = this.modeAuteur;
      aParam.clbckRecupDonnees = this.reInitialiserSurValidation;
      aParam.pereRecupDonnees = this;
      this.moteur.surEvntSaisieReponseActu(aInfoSond, aGenreEvnt, aParam);
    } else {
      switch (aGenreEvnt) {
        case EGenreEvntActu.SurSelectionInfoSondage:
          this.surSelectionInfoSondage({ infoSondage: aInfoSond });
          break;
        case EGenreEvntActu.SurCreationActu: {
          let lItemASelectionner;
          if (aInfoSond && !!aInfoSond.estAModeliser) {
            lItemASelectionner = aInfoSond.estInformation
              ? TypeItemEnum.IE_Modele_Info
              : TypeItemEnum.IE_Modele_Sondage;
          } else {
            lItemASelectionner = TypeItemEnum.IE_Brouillon;
          }
          this.filtreModeItem = lItemASelectionner;
          let lItemASelectionnerApresSaisie = this.getItemDeType(
            this.filtreModeItem,
          );
          this.typeSelectionne = lItemASelectionnerApresSaisie;
          this.listeActualites.addElement(aInfoSond);
          declencherSaisie.call(this);
          break;
        }
        case EGenreEvntActu.SurValidationModif:
          if (aInfoSond && aInfoSond.getEtat() === EGenreEtat.Suppression) {
            this.contexte.selectionCouranteModeDiffusion = null;
          }
          declencherSaisie.call(this);
          break;
        case EGenreEvntActu.SurMenuCtxActu:
          switch (aParam.cmd.getNumero()) {
            case EGenreEvntMenuCtxBlocInfoSondage.editerActu:
              if (this.getInstance(this.identEditionInfoSond)) {
                this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
                  titre: GTraductions.getValeur(
                    "actualites.Edition.Modification",
                  ),
                });
                this.getInstance(this.identEditionInfoSond).setDonnees(
                  this.initDataInfoSondSurEdition({
                    estCreation: false,
                    donnee: aInfoSond,
                    estModele: aInfoSond.estModele === true,
                    avecRecupModele: !aInfoSond.estModele && this.avecModeles,
                  }),
                );
              }
              break;
            case EGenreEvntMenuCtxBlocInfoSondage.recupererModele: {
              this.getInstance(this.identEditionInfoSond).setDonnees(
                this.initDataInfoSondSurEdition({
                  estCreation: true,
                  estInfo: aInfoSond.estInformation,
                  appliquerModele: aInfoSond,
                  avecRecupModele: false,
                }),
              );
              break;
            }
            case EGenreEvntMenuCtxBlocInfoSondage.exporterModele: {
              new ObjetRequeteSaisieExportFichierProf({}, (aEchec, aUrl) => {
                if (aEchec || !aUrl) {
                  return;
                }
                window.open(GChaine.encoderUrl(aUrl));
              }).lancerRequete({
                genreFichier: TypeGenreEchangeDonnees.GED_ModelesSondage,
                listeModeles: new ObjetListeElements().addElement(aInfoSond),
              });
              break;
            }
            case EGenreEvntMenuCtxBlocInfoSondage.voirResultats:
              this.evntSurAfficherResultats(aInfoSond);
              break;
            case EGenreEvntMenuCtxBlocInfoSondage.demarrerDiscussion:
              this.surDemarrerDiscussion(aInfoSond);
              break;
            case EGenreEvntMenuCtxBlocInfoSondage.relancerSelection:
              this.surRelancerSelection(aInfoSond);
              break;
          }
          break;
        case EGenreEvntActu.SurDiffusionResultats: {
          const lInstanceFenetreEdition = this.getInstance(
            this.identEditionInfoSond,
          );
          if (!!lInstanceFenetreEdition) {
            new ObjetRequeteGenererFichiersResultatsSondage(this)
              .lancerRequete({
                sondage: aInfoSond,
                nominatif: aParam.estNominatif,
              })
              .then((aJSON) => {
                if (
                  !aJSON.messageErreur &&
                  !!aJSON.listeFichiersResultatsCrees &&
                  aJSON.listeFichiersResultatsCrees.count() > 0
                ) {
                  const lNouvelleActu =
                    this.moteurCP.creerInfoDiffusionDesResultatsSondage(
                      aInfoSond,
                      this.listeCategories,
                      aJSON.listeFichiersResultatsCrees,
                    );
                  this.diffusionResultatsSondageEnCours = true;
                  lInstanceFenetreEdition.setOptionsFenetre({
                    titre: GTraductions.getValeur("actualites.creerInfo"),
                  });
                  lInstanceFenetreEdition.setDonnees({
                    donnee: lNouvelleActu,
                    creation: true,
                  });
                } else {
                  GApplication.getMessage().afficher({
                    type: EGenreBoiteMessage.Information,
                    titre: GTraductions.getValeur("SaisieImpossible"),
                    message: GTraductions.getValeur(
                      "actualites.Edition.ErreurCreationFichiersResultats",
                    ),
                  });
                }
              });
          }
          break;
        }
      }
    }
  }
  getAvecAuteur() {
    const lMasquerFonctionnalite = false;
    return (
      [
        EGenreEspace.Professeur,
        EGenreEspace.Mobile_Professeur,
        EGenreEspace.Etablissement,
        EGenreEspace.Mobile_Etablissement,
        EGenreEspace.Administrateur,
        EGenreEspace.Mobile_Administrateur,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.Mobile_PrimProfesseur,
        EGenreEspace.PrimDirection,
        EGenreEspace.Mobile_PrimDirection,
        EGenreEspace.PrimMairie,
        EGenreEspace.Mobile_PrimMairie,
        EGenreEspace.PrimPeriscolaire,
        EGenreEspace.Mobile_PrimPeriscolaire,
      ].includes(GEtatUtilisateur.GenreEspace) ||
      ([EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
        GEtatUtilisateur.GenreEspace,
      ) &&
        GEtatUtilisateur.Identification.ressource.estDelegue &&
        GParametres.ActivationMessagerieEntreParents &&
        !lMasquerFonctionnalite)
    );
  }
  getAvecDroitSaisie() {
    return (
      GApplication.droits.get(TypeDroits.actualite.avecSaisieActualite) ||
      ([EGenreEspace.Parent, EGenreEspace.Mobile_Parent].includes(
        GEtatUtilisateur.GenreEspace,
      ) &&
        GEtatUtilisateur.Identification.ressource.estDelegue &&
        GParametres.ActivationMessagerieEntreParents)
    );
  }
  getDroitPublicationPageEtablissement() {
    return GApplication.droits.get(
      TypeDroits.communication.avecPublicationPageEtablissement,
    );
  }
  getForcerAR() {
    return GApplication.droits.get(TypeDroits.fonctionnalites.forcerARInfos);
  }
  getAvecSondageAnonyme() {
    return GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionSondageAnonyme,
    );
  }
  getAvecFiltreCategorie() {
    return true;
  }
  surDemarrerDiscussion(aInfoSond) {
    ObjetFenetre_Message.creerFenetreDiscussion(
      this,
      _donneesFenetreEditionDiscussion.call(this, aInfoSond),
    );
  }
  surRelancerSelection(aInfoSond) {
    const lListe = new ObjetListeElements();
    lListe.add(aInfoSond);
    new ObjetRequeteSaisieActualitesNotification(this).lancerRequete({
      avecNotificationParticipant: true,
      listeActualite: lListe,
      saisieActualite: this.modeAuteur,
    });
  }
  initDataInfoSondSurEdition(aParam) {
    if (aParam.estCreation === true) {
      const lDefault = {
        donnee: null,
        creation: true,
        forcerAR: this.forcerAR,
        estInfo: aParam.estInfo,
        genreReponse: aParam.estInfo
          ? this.utilitaires.genreReponse.getGenreAvecAR()
          : this.utilitaires.genreReponse.getGenreChoixUnique(),
        listePJ: this.listePJ,
        maxSizePJ: GApplication.droits.get(
          TypeDroits.tailleMaxDocJointEtablissement,
        ),
        listeCategories: this.listeCategories,
        publie: !(
          this.avecAuteur && this.filtreModeItem === TypeItemEnum.IE_Brouillon
        ),
        estModele: aParam.estModele,
        appliquerModele: aParam.appliquerModele,
        avecRecupModele: aParam.avecRecupModele,
      };
      if (aParam.estInfo === false) {
        return $.extend(lDefault, {
          avecChoixAnonyme: this.avecSondageAnonyme,
        });
      }
      return lDefault;
    } else {
      return {
        donnee: aParam.donnee,
        forcerAR: this.forcerAR,
        avecChoixAnonyme: this.avecSondageAnonyme,
        creation: false,
        listePJ: this.listePJ,
        maxSizePJ: GApplication.droits.get(
          TypeDroits.tailleMaxDocJointEtablissement,
        ),
        listeCategories: this.listeCategories,
        estModele: aParam.estModele,
        avecRecupModele: aParam.avecRecupModele,
      };
    }
  }
  getTypeInfoSondParDefaut() {
    return this.page && this.page.avecActionSaisie
      ? TypeItemEnum.IE_Diffusion_Tout
      : TypeItemEnum.IE_Reception;
  }
  getListeDonneesTypesInfoSond() {
    const lDonnees = new ObjetListeElements();
    let lEltDiffTout = null;
    for (const lKey of MethodesObjet.enumKeys(TypeItemEnum)) {
      const lTypeItemEnum = TypeItemEnum[lKey];
      if (
        MethodesObjet.isNumber(lTypeItemEnum) &&
        (this.getAvecModeles() ||
          ![
            TypeItemEnum.IE_Modele_Info,
            TypeItemEnum.IE_Modele_Sondage,
          ].includes(lTypeItemEnum))
      ) {
        let lElt = new ObjetElement(
          TypeItemEnumUtil.getStr(lTypeItemEnum),
          lTypeItemEnum,
          lTypeItemEnum,
        );
        lElt.icone = TypeItemEnumUtil.getIcon(lTypeItemEnum);
        lElt.compteur = this.getCompteurDeType(lTypeItemEnum);
        lElt.estAvecSeparateurHaut = [
          TypeItemEnum.IE_Diffusion_Tout,
          TypeItemEnum.IE_Modele_Sondage,
        ].includes(lTypeItemEnum);
        if (lTypeItemEnum === TypeItemEnum.IE_Diffusion_Tout) {
          lEltDiffTout = lElt;
        } else if (
          lEltDiffTout !== null &&
          [
            TypeItemEnum.IE_Diffusion_Publiee,
            TypeItemEnum.IE_Diffusion_PublieeFutur,
            TypeItemEnum.IE_Diffusion_PublieePasse,
          ].includes(lTypeItemEnum)
        ) {
          lElt.pere = lEltDiffTout;
        }
        lDonnees.addElement(lElt);
      }
    }
    return lDonnees;
  }
  getGenreAffichageSelonTypeAcces(aGenreTypeAcces) {
    switch (aGenreTypeAcces) {
      case TypeItemEnum.IE_Reception:
        return this.genresAffichages.reception;
      case TypeItemEnum.IE_Diffusion_Tout:
      case TypeItemEnum.IE_Diffusion_PublieePasse:
      case TypeItemEnum.IE_Diffusion_Publiee:
      case TypeItemEnum.IE_Diffusion_PublieeFutur:
      case TypeItemEnum.IE_Brouillon:
        return this.genresAffichages.saisie;
      case TypeItemEnum.IE_Modele_Info:
      case TypeItemEnum.IE_Modele_Sondage:
        return this.genresAffichages.modeles;
      default:
    }
  }
  getAvecModeles() {
    return (
      this.getAvecAuteur() &&
      this.getAvecDroitSaisie() &&
      [
        EGenreEspace.Professeur,
        EGenreEspace.PrimProfesseur,
        EGenreEspace.Etablissement,
        EGenreEspace.Administrateur,
        EGenreEspace.PrimDirection,
      ].includes(GEtatUtilisateur.GenreEspace)
    );
  }
  estModeItemDeTypeInfo() {
    return this.filtreModeItem === TypeItemEnum.IE_Modele_Info;
  }
  estModeItemDeTypeSondage() {
    return this.filtreModeItem === TypeItemEnum.IE_Modele_Sondage;
  }
  evntImportModele() {
    if (GApplication.getModeExclusif()) {
      GApplication.getMessage().afficher({
        titre: GTraductions.getValeur("ModeExclusif.UsageExclusif"),
        message: GTraductions.getValeur(
          "ModeExclusif.SaisieImpossibleConsultation",
        ),
      });
    } else {
      ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ImportFichierProf, {
        pere: this,
        initialiser: function (aInstance) {
          aInstance.setOptionsFenetre({
            titre: GTraductions.getValeur("actualites.importerModeleSondage"),
          });
          aInstance.setOptions({
            genreFichier: TypeGenreEchangeDonnees.GED_ModelesSondage,
          });
        }.bind(this),
        evenement: function () {
          this.reInitialiserSurValidation();
        }.bind(this),
      }).setDonnees();
    }
  }
  evenementOuvrirMenuContextuel(aInfoSondage, aParams) {
    const lInstance = this;
    ObjetMenuContextuel.afficher({
      pere: aParams.instance,
      options: { largeurMaxLibelle: 450 },
      evenement: function (aLigne) {
        aParams.instance.fermer();
        lInstance.evntSurValidationInfoSond(
          aInfoSondage,
          EGenreEvntActu.SurDiffusionResultats,
          { estNominatif: aLigne.getNumero() === 0 },
        );
      },
      initCommandes: function (aInstance) {
        aInstance.addCommande(
          0,
          GTraductions.getValeur(
            "actualites.Edition.DiffuserResultatsNominatif",
          ),
        );
        aInstance.addCommande(
          1,
          GTraductions.getValeur("actualites.Edition.DiffuserResultatsAnonyme"),
        );
      },
    });
  }
  evntSurAfficherResultats(aInfoSond) {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_ResultatsActualite_PN,
      {
        pere: this,
        evenement(aNumeroBouton, aParams) {
          if (
            !!aParams.bouton &&
            aParams.bouton.typeBouton ===
              TypeBoutonFenetreResultatActualite.DiffuserResultats
          ) {
            if (!!aInfoSond.reponseAnonyme) {
              aParams.instance.fermer();
              this.evntSurValidationInfoSond(
                aInfoSond,
                EGenreEvntActu.SurDiffusionResultats,
                { estNominatif: false },
              );
            } else {
              this.evenementOuvrirMenuContextuel(aInfoSond, aParams);
            }
          }
        },
        initialiser(aInstance) {
          const lListeBoutons = [];
          const lEstSurEspaceProfOuPersonnel = [
            EGenreEspace.Professeur,
            EGenreEspace.Mobile_Professeur,
            EGenreEspace.PrimProfesseur,
            EGenreEspace.Mobile_PrimProfesseur,
            EGenreEspace.Etablissement,
            EGenreEspace.Mobile_Etablissement,
            EGenreEspace.Administrateur,
            EGenreEspace.Mobile_Administrateur,
            EGenreEspace.PrimDirection,
            EGenreEspace.Mobile_PrimDirection,
            EGenreEspace.PrimMairie,
            EGenreEspace.Mobile_PrimMairie,
          ].includes(GEtatUtilisateur.GenreEspace);
          if (lEstSurEspaceProfOuPersonnel && aInfoSond.estSondage) {
            lListeBoutons.push({
              libelle: GTraductions.getValeur(
                "actualites.Edition.DiffuserResultats",
              ),
              theme: TypeThemeBouton.secondaire,
              typeBouton: TypeBoutonFenetreResultatActualite.DiffuserResultats,
              sansFermeture: true,
            });
          }
          lListeBoutons.push({
            libelle: GTraductions.getValeur("Fermer"),
            theme: TypeThemeBouton.secondaire,
            typeBouton: TypeBoutonFenetreResultatActualite.Fermer,
          });
          aInstance.setOptionsFenetre({
            titre: GTraductions.getValeur("actualites.Edition.OngletResultats"),
            modale: true,
            largeur: 900,
            hauteur: 700,
            listeBoutons: lListeBoutons,
          });
          aInstance.setUtilitaires(this.utilitaires);
        },
      },
    );
    lFenetre.setActualite(aInfoSond);
  }
  formatterDataSurBasculeModeAff(aGenreAff, aFiltre) {
    this.listeActualites = _getListeActualitesDeGenreAff.call(
      this,
      aGenreAff,
      aFiltre,
    );
    this.initListeInfosSond(this.getInstance(this.identListeInfosSond));
    this.moteurCP.formatterDonnees({
      listeInfoSond: this.listeActualites,
      forcerAR: this.forcerAR,
    });
    this.moteurCP.formatterListeActusPourBlocs({
      listeActualites: this.listeActualites,
    });
  }
  declencherActionsAutoSurNavigation() {
    if (this.page && this.page.avecActionSaisie) {
      _creerInfoSondDepuisNavigation.call(this);
    }
  }
}
function _initFicheEditionInfoSond(aInstance) {
  aInstance.setUtilitaires(this.utilitaires);
  aInstance.setOptions({
    avecCBElevesRattaches: GParametres.avecElevesRattaches,
    avecGestionEleves: GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionEleves,
    ),
    avecGestionPersonnels: GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionPersonnels,
    ),
    avecGestionStages: GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionStages,
    ),
    avecGestionIPR: GApplication.droits.get(
      TypeDroits.fonctionnalites.gestionIPR,
    ),
    avecPublicationPageEtablissement: GApplication.droits.get(
      TypeDroits.communication.avecPublicationPageEtablissement,
    ),
  });
  aInstance.setOptionsFenetre({ avecFooterFlottant: false });
  aInstance.envoyerRequete = function (aParam) {
    this.moteurCP.formatterDonneesAvantSaisie({
      listeInfoSond: aParam.paramRequete.listeActualite,
    });
    return new ObjetRequeteSaisieActualites(
      this,
      aParam.clbckSurReussite.bind(aInstance, 1),
    )
      .addUpload({
        listeFichiers: aParam.listePJCree,
        listeDJCloud: IE.estMobile ? null : aParam.listePJ,
      })
      .lancerRequete(aParam.paramRequete);
  }.bind(this);
  aInstance.avecListeDiffusion = true;
  aInstance.surBtnListeDiffusion = () => {
    let lListeDiffusions = null;
    if (GCache && GCache.general.existeDonnee("listeDiffusion")) {
      lListeDiffusions = GCache.general.getDonnee("listeDiffusion");
    }
    return Promise.resolve()
      .then(() => {
        if (!lListeDiffusions) {
          return new ObjetRequeteListeDiffusion(this)
            .lancerRequete()
            .then((aJSON) => {
              if (aJSON && aJSON.liste) {
                lListeDiffusions = aJSON.liste;
                if (GCache) {
                  GCache.general.setDonnee("listeDiffusion", lListeDiffusions);
                }
              }
            });
        }
      })
      .then(() => {
        return new Promise((aResolve) => {
          if (!lListeDiffusions) {
            return null;
          }
          lListeDiffusions.parcourir((aElement) => {
            aElement.cmsActif = false;
          });
          ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_SelectionListeDiffusion,
            {
              pere: this,
              evenement: (aGenreBouton) => {
                let lListeDiffusionsSelection = new ObjetListeElements();
                if (aGenreBouton === 1) {
                  lListeDiffusionsSelection = lListeDiffusions.getListeElements(
                    (aElement) => !!aElement.cmsActif,
                  );
                }
                aResolve(lListeDiffusionsSelection);
              },
            },
          ).setDonnees(
            new DonneesListe_SelectionDiffusion(lListeDiffusions),
            false,
          );
        });
      });
  };
  aInstance.setOptionsFenetre({
    modale: true,
    listeBoutons: [
      GTraductions.getValeur("Annuler"),
      GTraductions.getValeur("Valider"),
    ],
  });
}
function _initialiserCategories(aParam) {
  this.listeCategories = aParam.listeCategories;
  if (
    GEtatUtilisateur.getCategorie() === null ||
    GEtatUtilisateur.getCategorie() === undefined
  ) {
    const lCategorieParDefaut = this.listeCategories
      .getListeElements((aElt) => {
        return aElt.toutesLesCategories === true;
      })
      .get(0);
    this.categorie = lCategorieParDefaut;
    GEtatUtilisateur.setCategorie(lCategorieParDefaut);
  }
}
function _creerInfoSondDepuisNavigation() {
  if (this.page.creerInformation) {
    this.evntBtnCreerActuInfo();
  } else {
    this.evntBtnCreerActuSondage();
  }
  this.page = null;
  GEtatUtilisateur.resetPage();
  GEtatUtilisateur.Navigation.OptionsOnglet = null;
}
function _getListeActualitesDeGenreAff(aGenreAff, aFiltreModeAff) {
  let lModeAffCourant;
  switch (aGenreAff) {
    case this.genresAffichages.reception:
      lModeAffCourant = TypeModeAff.MA_Reception;
      break;
    case this.genresAffichages.saisie:
      if (aFiltreModeAff === TypeItemEnum.IE_Brouillon) {
        lModeAffCourant = TypeModeAff.MA_Brouillon;
      } else {
        lModeAffCourant = TypeModeAff.MA_Diffusion;
      }
      break;
    case this.genresAffichages.modeles:
      lModeAffCourant = TypeModeAff.MA_Modele;
      break;
    default:
  }
  return this.getListeActualitesDeModeAff(lModeAffCourant);
}
function _actionSurRecupererDonnees(aDonnees) {
  this.tabModeAff = aDonnees.tabModeAff;
  this.formatterDataSurBasculeModeAff(this.genreAff, this.filtreModeItem);
  _initialiserCategories.call(this, {
    listeCategories: aDonnees.listeCategories,
  });
  this.initEcranTypeAccesInfoSond();
  this.afficherSelonFiltres();
}
function _evenementEditionActu(aGenreBouton, aParam) {
  const lEstCtxCreation =
    aGenreBouton === 1 &&
    aParam &&
    aParam.eltCree !== null &&
    aParam.eltCree !== undefined;
  if (lEstCtxCreation) {
    const lEstUneCreationDepuisUnModele =
      (this.filtreModeItem === TypeItemEnum.IE_Modele_Info ||
        this.filtreModeItem === TypeItemEnum.IE_Modele_Sondage) &&
      aParam.donnee &&
      !aParam.donnee.estModele;
    if (
      this.filtreModeItem === TypeItemEnum.IE_Reception ||
      lEstUneCreationDepuisUnModele
    ) {
      const lTypeItem =
        aParam.donnee && aParam.donnee.publie === false
          ? TypeItemEnum.IE_Brouillon
          : TypeItemEnum.IE_Diffusion_Tout;
      let lItemASelectionnerApresSaisie = this.getItemDeType(lTypeItem);
      this.typeSelectionne = lItemASelectionnerApresSaisie;
      this.modeAuteur = this.avecAuteur;
      this.genreAff = this.genresAffichages.saisie;
      this.filtreModeItem = lTypeItem;
    }
  }
  if (this.diffusionResultatsSondageEnCours) {
    this.diffusionResultatsSondageEnCours = false;
    if (aGenreBouton !== 1) {
      const lListePiecesJointes = this.moteurCP.getListePiecesJointesDActualite(
        aParam.donnee,
      );
      if (!!lListePiecesJointes) {
        lListePiecesJointes.parcourir((D) => {
          D.setEtat(EGenreEtat.Suppression);
        });
      }
      new ObjetRequeteSaisieFichierResultatsSondage(this).lancerRequete({
        listePJASupprimer: lListePiecesJointes,
      });
    } else {
      _reponseSaisie.call(this);
    }
  } else {
    if (aGenreBouton === 1) {
      if (aParam && aParam.eltCree !== null && aParam.eltCree !== undefined) {
        this.contexte.selectionCouranteModeDiffusion = aParam.eltCree;
      }
      _reponseSaisie.call(this);
    }
  }
}
function declencherSaisie() {
  const lObjetSaisie = {
    listeActualite: this.listeActualites,
    validationDirecte: false,
    saisieActualite: this.modeAuteur,
  };
  new ObjetRequeteSaisieActualites(
    this,
    _reponseSaisie.bind(this),
  ).lancerRequete(lObjetSaisie);
}
function _reponseSaisie(aJSONReponse, aJSONRapportSaisie) {
  if (this.modeAuteur) {
    if (
      aJSONRapportSaisie !== null &&
      aJSONRapportSaisie !== undefined &&
      aJSONRapportSaisie.infoSondCree !== null &&
      aJSONRapportSaisie.infoSondCree !== undefined
    ) {
      this.contexte.selectionCouranteModeDiffusion =
        aJSONRapportSaisie.infoSondCree;
    }
    this.recupererDonnees();
  }
}
function _donneesFenetreEditionDiscussion(aInfoSond) {
  const lDonnees = {};
  const lAuteur = aInfoSond.elmauteur;
  if (_estSurEspaceProfesseurOuPersonnel()) {
    const lListeEns = new ObjetListeElements();
    const lListePers = new ObjetListeElements();
    switch (lAuteur.getGenre()) {
      case EGenreRessource.Enseignant:
        lListeEns.addElement(lAuteur);
        break;
      case EGenreRessource.Personnel:
        lListePers.addElement(lAuteur);
        break;
      default:
        break;
    }
    const lGenresRessources = [
      { genre: EGenreRessource.Enseignant, listeDestinataires: lListeEns },
      { genre: EGenreRessource.Personnel, listeDestinataires: lListePers },
    ];
    lDonnees.genresRessources = lGenresRessources;
  } else {
    lDonnees.genreRessource = lAuteur.getGenre();
    const lListe = new ObjetListeElements();
    lListe.addElement(lAuteur);
    lDonnees.ListeRessources = lListe;
    lDonnees.listeSelectionnee = lListe;
  }
  let lStrTraduc, lParamsTraduc;
  const lEstInfo = aInfoSond.estInformation;
  if (aInfoSond.getLibelle()) {
    lStrTraduc = lEstInfo
      ? "actualites.discussion.enReponseAInformation"
      : "actualites.discussion.enReponseAuSondage";
    lParamsTraduc = [
      aInfoSond.getLibelle(),
      GDate.formatDate(aInfoSond.dateDebut, "%J/%MM/%AAAA"),
    ];
  } else {
    lStrTraduc = lEstInfo
      ? "actualites.discussion.enReponseAInformationDu"
      : "actualites.discussion.enReponseAuSondageDu";
    lParamsTraduc = [GDate.formatDate(aInfoSond.dateDebut, "%J/%MM/%AAAA")];
  }
  lDonnees.message = {
    objet: GTraductions.getValeur("actualites.discussion.reponse", [
      aInfoSond.getLibelle(),
    ]),
    contenu: GTraductions.getValeur(lStrTraduc, lParamsTraduc),
  };
  return lDonnees;
}
function _estSurEspaceProfesseurOuPersonnel() {
  return [
    EGenreEspace.Professeur,
    EGenreEspace.Mobile_Professeur,
    EGenreEspace.PrimProfesseur,
    EGenreEspace.Mobile_PrimProfesseur,
    EGenreEspace.Etablissement,
    EGenreEspace.Mobile_Etablissement,
    EGenreEspace.Administrateur,
    EGenreEspace.Mobile_Administrateur,
    EGenreEspace.PrimDirection,
    EGenreEspace.Mobile_PrimDirection,
    EGenreEspace.Accompagnant,
    EGenreEspace.Mobile_Accompagnant,
    EGenreEspace.PrimAccompagnant,
    EGenreEspace.Mobile_PrimAccompagnant,
    EGenreEspace.Tuteur,
    EGenreEspace.Mobile_Tuteur,
  ].includes(GEtatUtilisateur.GenreEspace);
}
module.exports = { InterfacePageInfoSondagePN };
