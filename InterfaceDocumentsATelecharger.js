const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetDocumentsATelecharger } = require("ObjetDocumentsATelecharger.js");
const { EGenreEventDocument } = require("InterfaceConsultDocument.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
  ObjetRequeteDocumentsATelecharger,
} = require("ObjetRequeteDocumentsATelecharger.js");
const {
  UtilitaireDocumentATelecharger,
} = require("UtilitaireDocumentATelecharger.js");
const { _InterfaceDocuments } = require("_InterfaceDocuments.js");
const {
  ObjetRequeteSaisieDocumentsATelecharger,
} = require("ObjetRequeteSaisieDocumentsATelecharger.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetRequeteSaisieCasier } = require("ObjetRequeteSaisieCasier.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
  TypeConsultationDocumentCasier,
} = require("TypeConsultationDocumentCasier.js");
const { EGenreDocTelechargement } = require("Enumere_DocTelechargement.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetTri } = require("ObjetTri.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { DocumentsATelecharger } = require("DocumentsATelecharger.js");
class InterfaceDocumentsATelecharger extends _InterfaceDocuments {
  constructor(...aParams) {
    super(...aParams);
    this.estEspaceParent = [EGenreRessource.Responsable].includes(
      GEtatUtilisateur.getUtilisateur().getGenre(),
    );
    this.documentAffecteParAction = null;
    this.genreRubriqueSelectionne = this.getRubriqueParDefaut().getGenre();
    this.etatUtilisateurPN = GApplication.getEtatUtilisateur();
  }
  construireInstances() {
    this.identDocuments = this.add(
      ObjetDocumentsATelecharger,
      this.eventDocuments,
      this.initDocuments,
    );
    super.construireInstances();
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    const lOnglet = this.etatUtilisateurPN.listeOnglets.getElementParGenre(
      GEtatUtilisateur.getGenreOnglet(),
    );
    if (lOnglet) {
      const lGenreRubrique = this.etatUtilisateurPN.getInfosSupp(
        lOnglet.getLibelle(),
      ).genreRubrique;
      if (MethodesObjet.isNumeric(lGenreRubrique)) {
        this.genreRubriqueSelectionne = lGenreRubrique;
      }
    }
  }
  requeteConsultation() {
    return new ObjetRequeteDocumentsATelecharger(this)
      .lancerRequete({
        avecNotes: [
          EGenreOnglet.BulletinAnneesPrec_Note,
          EGenreOnglet.DocumentsATelecharger,
        ].includes(GEtatUtilisateur.getGenreOnglet()),
        avecCompetences: [
          EGenreOnglet.BulletinAnneesPrec_Competence,
          EGenreOnglet.DocumentsATelecharger,
        ].includes(GEtatUtilisateur.getGenreOnglet()),
      })
      .then((aJSON) => {
        this.listeCategories = aJSON.listeCategories;
        this.listeDocuments = aJSON.listeDocuments;
        this.listeDocumentsAFournir = aJSON.listeDocumentsAFournir;
        this.listebulletins = aJSON.listebulletins;
        this.listeBilansPeriodiques = aJSON.listeBilansPeriodiques;
        this.diplome = aJSON.diplome;
        this.listeRubrique = this.getlisteRubrique();
        this.initAff();
      })
      .catch((e) => {});
  }
  afficherEcranCentrale() {
    let lListe, lOptions, lOptionsListe;
    switch (this.genreRubriqueSelectionne) {
      case DocumentsATelecharger.GenreRubriqueDAT.bulletins: {
        const lListeBulletinPlusDiplome = MethodesObjet.dupliquer(
          this.listebulletins,
        );
        if (this.diplome) {
          lListeBulletinPlusDiplome.add(this.diplome);
        }
        lListeBulletinPlusDiplome.setTri([ObjetTri.init("Libelle")]).trier();
        lListe = lListeBulletinPlusDiplome;
        lOptions = { avecIntertitreAnnee: true, avecIconeDocument: true };
        lOptionsListe = {
          boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
          messageContenuVide: GTraductions.getValeur(
            "DocumentsATelecharger.Aucun",
          ),
        };
        break;
      }
      case DocumentsATelecharger.GenreRubriqueDAT.documents:
        lListe =
          UtilitaireDocumentATelecharger.construireListeCumulParCategorie(
            this.listeDocuments,
          );
        lOptions = {
          avecCouleurCategorie: true,
          avecIconeDocument: true,
          avecBtnEllipsis: true,
          avecFiltreNonLus: true,
          avecCompteurSurDeploiement: true,
          avecLigneOff: true,
        };
        lOptionsListe = {
          boutons: [{ genre: ObjetListe.typeBouton.filtrer }],
          messageContenuVide: GTraductions.getValeur(
            "DocumentsATelecharger.Aucun",
          ),
        };
        break;
      case DocumentsATelecharger.GenreRubriqueDAT.documentsAFournir:
        lListe = this.listeDocumentsAFournir;
        lOptionsListe = {
          boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
          messageContenuVide: GTraductions.getValeur(
            "documentsATelecharger.aucunDocumentAdeposer",
          ),
        };
        break;
    }
    const lInstanceDoc = this.getInstance(this.identDocuments);
    this.initDocuments(lInstanceDoc);
    if (lOptionsListe) {
      lInstanceDoc.setOptionsListe(
        Object.assign(lOptionsListe, { avecFiltresVisibles: false }),
      );
    }
    if (lOptions) {
      lInstanceDoc.setOptions(lOptions);
    }
    lInstanceDoc.setDonnees({
      listeDocs: lListe ? lListe : new ObjetListeElements(),
      listeCategories: this.listeCategories || new ObjetListeElements(),
    });
  }
  eventDocuments(aParams) {
    switch (aParams.genreEvenement) {
      case ObjetDocumentsATelecharger.genreEventDocumentATelecharger
        .evenementListe: {
        switch (aParams.genreEvenementListe) {
          case EGenreEvenementListe.Selection: {
            this.surSelectionDocument(aParams.article);
            break;
          }
        }
        break;
      }
      case ObjetDocumentsATelecharger.genreEventDocumentATelecharger
        .evenementMenuCtx: {
        this.documentAffecteParAction = aParams.article;
        this.eventMenuCtx(aParams);
        break;
      }
      case ObjetDocumentsATelecharger.genreEventDocumentATelecharger
        .SuppressionPJ: {
        this.saisieFichier({ document: aParams.article });
        break;
      }
      default:
        break;
    }
  }
  eventMenuCtx(aParam) {
    switch (aParam.genreEvenementMenuCtx) {
      case EGenreEventDocument.btnRetour:
        this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
        this.basculerEcran({ src: 1, dest: 0 });
        break;
      case EGenreEventDocument.deposerLeFichier:
        UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.deposerLeFichier,
          aParam.article,
          this.surDepotFichier.bind(this),
        ).event.call(this);
        break;
      case EGenreEventDocument.supprimerFichierDepose:
        this.saisieFichier({ document: aParam.article });
        break;
      case EGenreEventDocument.telecharger:
        UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.telecharger,
          aParam.article,
        ).event();
        break;
      case EGenreEventDocument.genererLePdf:
        UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.genererLePdf,
          aParam.article,
        ).event();
        break;
      case EGenreEventDocument.archiverSurMonCloud:
        UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.archiverSurMonCloud,
          aParam.article,
        ).event();
        break;
      case EGenreEventDocument.ouvrirfenetrePdfEtCloud:
        UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.ouvrirPDFEtCloud,
          aParam.article,
        ).event();
        break;
      case EGenreEventDocument.ouvrirfenetreTelechargerEtClourd:
        UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.ouvrirTelechargerEtCloud,
          aParam.article,
          this.surFermetureFenetreTelechargerEtClourd.bind(this),
        ).event();
        break;
      case EGenreEventDocument.marquerLu:
        this.surMarquerLu(aParam.article);
        break;
      case EGenreEventDocument.marquerNonLu:
        this.surMarquerNonLu(aParam.article);
        break;
      case EGenreEventDocument.supprimer:
        this.suppressionDocument(aParam.article);
        break;
    }
  }
  surFermetureFenetreTelechargerEtClourd(aMarquerLuLeDocument, aDocument) {
    if (aMarquerLuLeDocument && aDocument.estNonLu) {
      this.surMarquerLu(aDocument);
    }
  }
  surDepotFichier(aParams) {
    const lDocSelectionne = this.documentAffecteParAction
      ? this.documentAffecteParAction
      : this.getCtxSelection({ niveauEcran: 1 });
    if (lDocSelectionne) {
      if (lDocSelectionne.listePJ && lDocSelectionne.listePJ.count() === 1) {
        const lPJ = lDocSelectionne.listePJ.get(0);
        if (lPJ) {
          lPJ.setEtat(EGenreEtat.Suppression);
        }
      }
      lDocSelectionne.listePJ.add(aParams.listeFichiers);
      lDocSelectionne.setEtat(EGenreEtat.Modification);
      const lListeFichier = aParams.listeFichiers;
      const lListeDocument = new ObjetListeElements().add(lDocSelectionne);
      this.saisieFichier({
        listeDocument: lListeDocument,
        listePieceJointe: lListeFichier,
      });
    }
  }
  surSelectionDocument(aDocument) {
    if (!aDocument.estUnDeploiement) {
      this.setCtxSelection({ niveauEcran: 1, dataEcran: aDocument });
      let lCallback = () => {};
      const lOuvrirPDFEtCloud = UtilitaireDocumentATelecharger.getAction(
        UtilitaireDocumentATelecharger.genreAction.ouvrirPDFEtCloud,
        aDocument,
      );
      switch (aDocument.typeDocument) {
        case EGenreDocTelechargement.documents:
        case EGenreDocTelechargement.documentMembre:
        case EGenreDocTelechargement.projetAcc:
        case EGenreDocTelechargement.bulletinBIA:
        case EGenreDocTelechargement.bulletin:
        case EGenreDocTelechargement.diplome:
        case EGenreDocTelechargement.bulletinDeCompetences:
          lCallback = lOuvrirPDFEtCloud.event;
          break;
        case EGenreDocTelechargement.documentAFournir: {
          if (aDocument.docEditable) {
            const lCallbackDepotFichier =
              this && this.surDepotFichier
                ? this.surDepotFichier.bind(this)
                : () => {};
            const lDeposerLeFichier = UtilitaireDocumentATelecharger.getAction(
              UtilitaireDocumentATelecharger.genreAction.deposerLeFichier,
              aDocument,
              lCallbackDepotFichier,
              { id: this.getInstance(this.identDocuments).getNom() },
            );
            lCallback = lDeposerLeFichier.event.bind(this);
          } else {
            const lOuvrirFenetreInfo = UtilitaireDocumentATelecharger.getAction(
              UtilitaireDocumentATelecharger.genreAction.ouvrirFenetreInfo,
              aDocument,
            );
            lCallback = lOuvrirFenetreInfo.event;
          }
          break;
        }
        case EGenreDocTelechargement.documentCasier: {
          const lOuvrirTelechargerEtCloud =
            UtilitaireDocumentATelecharger.getAction(
              UtilitaireDocumentATelecharger.genreAction
                .ouvrirTelechargerEtCloud,
              aDocument,
              this.surFermetureFenetreTelechargerEtClourd.bind(this),
            );
          const lTelecharger = UtilitaireDocumentATelecharger.getAction(
            UtilitaireDocumentATelecharger.genreAction.telecharger,
            aDocument,
          );
          const lEstDocCloud =
            aDocument.getGenre() === EGenreDocumentJoint.Cloud;
          if (lEstDocCloud) {
            lCallback = lTelecharger.event;
          } else {
            lCallback = lOuvrirTelechargerEtCloud.event;
          }
          break;
        }
        default:
          break;
      }
      lCallback();
    }
  }
  saisieFichier(aParams) {
    let lListeFichier, lListeDocument;
    if (aParams.listeDocument) {
      lListeDocument = aParams.listeDocument;
    } else if (aParams.document) {
      lListeDocument = new ObjetListeElements().add(aParams.document);
    }
    if (aParams.listePieceJointe) {
      lListeFichier = aParams.listePieceJointe;
    } else if (aParams.pieceJointe) {
      lListeFichier = new ObjetListeElements().add(aParams.pieceJointe);
    }
    if (lListeDocument) {
      const lRequete = new ObjetRequeteSaisieDocumentsATelecharger(
        this,
        this.recupererDonnees,
      );
      if (lListeFichier) {
        lRequete.addUpload({ listeFichiers: lListeFichier });
      }
      lRequete.lancerRequete({ listeNaturesDocumentsAFournir: lListeDocument });
    }
  }
  surMarquerLu(aDocument) {
    this.saisieMarquerLectureDocument(aDocument, true);
  }
  surMarquerNonLu(aDocument) {
    this.saisieMarquerLectureDocument(aDocument, false);
  }
  saisieMarquerLectureDocument(aDocument, aMarquerLu) {
    if (aDocument.typeDocument === EGenreDocTelechargement.documentCasier) {
      this.requeteSaisieCasier({
        genreSaisie:
          ObjetRequeteSaisieCasier.genreSaisie[
            aMarquerLu ? "marquerLus" : "marquerNonLus"
          ],
        documents: new ObjetListeElements().add(aDocument),
      });
    }
  }
  suppressionDocument(aDocument) {
    GApplication.getMessage()
      .afficher({
        type: EGenreBoiteMessage.Confirmation,
        message: GTraductions.getValeur(
          "documentsATelecharger.ConfirmSupprDocCasier",
          [aDocument.getLibelle()],
        ),
      })
      .then((aAccepte) => {
        if (aAccepte !== EGenreAction.Valider) {
          return;
        }
        aDocument.setEtat(EGenreEtat.Suppression);
        this.requeteSaisieCasier({
          genreSaisie: ObjetRequeteSaisieCasier.genreSaisie.saisieCasier,
          listeLignes: new ObjetListeElements().add(aDocument),
        });
      });
  }
  requeteSaisieCasier(aParam) {
    new ObjetRequeteSaisieCasier(this, this.recupererDonnees).lancerRequete(
      Object.assign(
        { typeConsultation: TypeConsultationDocumentCasier.CoDC_Destinataire },
        aParam,
      ),
    );
  }
  initDocuments(aInstance) {
    aInstance.setOptions({
      avecFiltreNonLus: false,
      avecEvent: true,
      avecIntertitreAnnee: false,
      avecCouleurCategorie: false,
      avecIconeDocument: false,
      avecBtnEllipsis: false,
      avecLigneOff: false,
      avecCompteurSurDeploiement: false,
    });
  }
  initVisuDocATelecharger(aInstance) {
    aInstance.setOptions({ avecBtnRetour: this.optionsEcrans.avecBascule });
  }
  afficherVisuDocATelecharger() {
    const lDoc = this.getCtxSelection({ niveauEcran: 0 });
    this.getInstance(this.identVisuDocATelecharger).setDonnees({
      article: lDoc,
    });
  }
  getlisteRubrique() {
    const getCompteur = (aListe, aProp) =>
      aListe
        ? aListe
            .getListeElements((aElem) => (aProp ? !!aElem[aProp] : true))
            .count()
        : 0;
    const lArr = [
      {
        Libelle: GTraductions.getValeur("documentsATelecharger.aTelecharger"),
        icon: "icon_download_alt",
        Genre: DocumentsATelecharger.GenreRubriqueDAT.documents,
        compteur: getCompteur(this.listeDocuments, "estNonLu"),
      },
    ];
    if (this.estEspaceParent) {
      lArr.push({
        Libelle: GTraductions.getValeur("documentsATelecharger.docAFournir"),
        icon: "icon_inbox",
        Genre: DocumentsATelecharger.GenreRubriqueDAT.documentsAFournir,
        compteur: getCompteur(this.listeDocumentsAFournir, "estDocADeposer"),
      });
    }
    lArr.push({
      Libelle: GTraductions.getValeur("documentsATelecharger.bulletins"),
      icon: "icon_filigrane_bulletins",
      Genre: DocumentsATelecharger.GenreRubriqueDAT.bulletins,
      compteur: getCompteur(this.listebulletins) + (this.diplome ? 1 : 0),
    });
    const lListe = new ObjetListeElements();
    lArr.map((aObjet) => lListe.add(new ObjetElement(aObjet)));
    return lListe;
  }
  getRubriqueParDefaut() {
    return this.getlisteRubrique().get(0);
  }
}
module.exports = { InterfaceDocumentsATelecharger };
