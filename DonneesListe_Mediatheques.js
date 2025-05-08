exports.DonneesListe_Mediatheques = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class DonneesListe_Mediatheques extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParametresCallback) {
    super(aDonnees);
    this.setOptions({
      flatDesignMinimal: true,
      avecEvnt_Selection: true,
      avecTri: false,
      avecLigneDroppable: true,
      dragNDropLigneInsertion: false,
      avecHtmlDetailsDraggableOver: false,
    });
    if (aParametresCallback) {
      this.callbackAjouterDossier = aParametresCallback.callbackAjouterDossier;
      this.callbackRenommerDossier =
        aParametresCallback.callbackRenommerDossier;
      this.callbackSupprimerDossier =
        aParametresCallback.callbackSupprimerDossier;
      this.callbackDropDocument = aParametresCallback.callbackDropDocument;
    }
  }
  estElementToutesLesMediatheques(aArticle) {
    return aArticle && !aArticle.existeNumero();
  }
  getTitreZonePrincipale(aParams) {
    return aParams.article.getLibelle();
  }
  getZoneComplementaire(aParams) {
    let lCompteurDocs = 0;
    switch (aParams.article.getGenre()) {
      case Enumere_Ressource_1.EGenreRessource.Mediatheque: {
        const lMediatheque = aParams.article;
        if (lMediatheque.listeDocuments) {
          lCompteurDocs = lMediatheque.listeDocuments.count();
        }
        break;
      }
      case Enumere_Ressource_1.EGenreRessource.DossierMediatheque: {
        const lDossierMediatheque = aParams.article;
        const lMediathequeParente = lDossierMediatheque.mediatheque;
        if (lMediathequeParente && lMediathequeParente.listeDocuments) {
          lCompteurDocs = lMediathequeParente.listeDocuments
            .getListeElements((aDoc) => {
              return (
                aDoc.dossierMediatheque &&
                aDoc.dossierMediatheque.getNumero() ===
                  aParams.article.getNumero()
              );
            })
            .count();
        }
        break;
      }
    }
    return lCompteurDocs ? lCompteurDocs.toString() : "";
  }
  avecBoutonActionLigne(aParams) {
    const lAvecAuMoinsUneCommandeCallback =
      !!this.callbackAjouterDossier ||
      !!this.callbackRenommerDossier ||
      !!this.callbackSupprimerDossier;
    return (
      !this.estElementToutesLesMediatheques(aParams.article) &&
      lAvecAuMoinsUneCommandeCallback
    );
  }
  remplirMenuContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (
      aParametres.article.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.Mediatheque
    ) {
      const lAvecCommandeAjouterDossier = !!this.callbackAjouterDossier;
      aParametres.menuContextuel.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "blog.mediatheque.ajouterDossier",
        ),
        lAvecCommandeAjouterDossier,
        () => {
          this.callbackAjouterDossier(aParametres.article);
        },
      );
    }
    if (
      aParametres.article.getGenre() ===
      Enumere_Ressource_1.EGenreRessource.DossierMediatheque
    ) {
      const lAvecCommandeRenommer = !!this.callbackRenommerDossier;
      aParametres.menuContextuel.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "blog.mediatheque.renommerDossier",
        ),
        lAvecCommandeRenommer,
        () => {
          this.callbackRenommerDossier(aParametres.article);
        },
      );
      const lAvecCommandeSupprimer = !!this.callbackSupprimerDossier;
      aParametres.menuContextuel.add(
        ObjetTraduction_1.GTraductions.getValeur(
          "blog.mediatheque.supprimerDossier",
        ),
        lAvecCommandeSupprimer,
        () => {
          this.callbackSupprimerDossier(aParametres.article);
        },
      );
    }
  }
  avecLigneDroppable(aParams) {
    return (
      !!this.callbackDropDocument &&
      !this.estElementToutesLesMediatheques(aParams.article)
    );
  }
  autoriserDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
    var _a;
    let lAutoriseDeplacement = this.avecLigneDroppable(aParamsLigneDestination);
    if (lAutoriseDeplacement && aParamsLigneDestination.article) {
      const lDocumentDeplace = aParamsSource.documentMediatheque;
      const lMediathequeOuDossierDestination = aParamsLigneDestination.article;
      if (
        lMediathequeOuDossierDestination.getGenre() ===
        Enumere_Ressource_1.EGenreRessource.DossierMediatheque
      ) {
        if (
          lDocumentDeplace.dossierMediatheque &&
          lDocumentDeplace.dossierMediatheque.getNumero() ===
            lMediathequeOuDossierDestination.getNumero()
        ) {
          lAutoriseDeplacement = false;
        }
      } else {
        let lDocumentEstContenuDansLaMediathequeDeDestination = !!((_a =
          lMediathequeOuDossierDestination.listeDocuments) === null ||
        _a === void 0
          ? void 0
          : _a.getElementParNumero(lDocumentDeplace.getNumero()));
        if (lDocumentEstContenuDansLaMediathequeDeDestination) {
          if (!lDocumentDeplace.dossierMediatheque) {
            lAutoriseDeplacement = false;
          }
        }
      }
    }
    return lAutoriseDeplacement;
  }
  surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
    const lDocumentDeplace = aParamsSource.documentMediatheque;
    const lMediathequeOuDossierDestination = aParamsLigneDestination.article;
    this.callbackDropDocument(
      lDocumentDeplace,
      lMediathequeOuDossierDestination,
    );
  }
}
exports.DonneesListe_Mediatheques = DonneesListe_Mediatheques;
