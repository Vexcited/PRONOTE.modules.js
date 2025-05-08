exports.UtilitaireDocument = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ActionContextuelle_1 = require("ObjetFenetre_ActionContextuelle");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_AjoutImagesMultiple_1 = require("ObjetFenetre_AjoutImagesMultiple");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const UtilitaireTraitementImage_1 = require("UtilitaireTraitementImage");
const UtilitaireDocumentCP_1 = require("UtilitaireDocumentCP");
class UtilitaireDocument extends UtilitaireDocumentCP_1.UtilitaireDocumentCP {
  static getOptionsSelecFile() {
    return {
      maxSize: UtilitaireDocument.GApplication.droits.get(
        ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
      ),
      multiple: false,
    };
  }
  static ouvrirFenetreChoixTypeDeFichierADeposer(
    aCallbackDepotFichier,
    aParams = {},
  ) {
    aParams = Object.assign(
      {
        avecFichierDepuisDocument: true,
        avecFichierDepuisCloud: false,
        avecPrendrePhoto: false,
        avecPrendrePlusieursImages: false,
        optionsSelecFile: {},
      },
      aParams,
    );
    const lAvecGestionAppareilPhoto =
      GEtatUtilisateur.avecGestionAppareilPhoto();
    const lThis = this;
    const lTabActions = [];
    let lOptionsSelecFileParDefault;
    if (!!aParams.avecFichierDepuisDocument) {
      lOptionsSelecFileParDefault = Object.assign(
        UtilitaireDocument.getOptionsSelecFile(),
        {},
      );
      lTabActions.push({
        libelle: IE.estMobile
          ? ObjetTraduction_1.GTraductions.getValeur(
              "fenetre_ActionContextuelle.depuisMesDocuments",
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "fenetre_ActionContextuelle.depuisMonPoste",
            ),
        icon: "icon_folder_open",
        selecFile: true,
        optionsSelecFile: aParams.optionsSelecFile.fichierDepuisDocument
          ? aParams.optionsSelecFile.fichierDepuisDocument
          : lOptionsSelecFileParDefault,
        event(aParamsInput) {
          if (aParamsInput) {
            if (aParams.callbackFichierDepuisDocument) {
              return aParams.callbackFichierDepuisDocument(aParamsInput);
            }
            if (aCallbackDepotFichier) {
              aCallbackDepotFichier(aParamsInput);
            }
          }
        },
        class: "bg-util-marron-claire",
      });
    }
    if (!!aParams.avecPrendrePhoto && lAvecGestionAppareilPhoto) {
      lOptionsSelecFileParDefault = Object.assign(
        UtilitaireDocument.getOptionsSelecFile(),
        {
          title: "",
          maxFiles: 0,
          genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
          acceptDragDrop: false,
          capture: "environment",
          accept: "image/*",
        },
      );
      lTabActions.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "fenetre_ActionContextuelle.prendrePhoto",
        ),
        icon: "icon_camera",
        event(aParamsInput) {
          if (aParamsInput) {
            if (aParams.callbackFichierDepuisDocument) {
              return aParams.callbackPrendrePhoto(aParamsInput);
            }
            if (aCallbackDepotFichier) {
              aCallbackDepotFichier(aParamsInput);
            }
          }
        },
        optionsSelecFile: aParams.optionsSelecFile.prendrePhoto
          ? aParams.optionsSelecFile.prendrePhoto
          : lOptionsSelecFileParDefault,
        selecFile: true,
        class: "bg-util-marron-claire",
      });
    }
    if (
      aParams.avecFichierDepuisCloud &&
      GEtatUtilisateur.avecCloudDisponibles()
    ) {
      lTabActions.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "fenetre_ActionContextuelle.depuisMonCloud",
        ),
        icon: "icon_cloud",
        event() {
          const lCallback = aParams.callbackFichierDepuisDocument
            ? aParams.callbackFichierDepuisDocument
            : aCallbackDepotFichier;
          UtilitaireDocument.ouvrirFenetreChoixFichierCloud.call(
            lThis,
            lCallback,
            aParams.fenetreFichierCloud,
          );
        },
        class: "bg-util-marron-claire",
      });
    }
    if (aParams.avecPrendrePlusieursImages && lAvecGestionAppareilPhoto) {
      lOptionsSelecFileParDefault = Object.assign(
        UtilitaireDocument.getOptionsSelecFile(),
        {
          avecResizeImage: true,
          multiple: false,
          avecTransformationFlux: false,
          accept:
            UtilitaireTraitementImage_1.UtilitaireTraitementImage.getTabMimePDFImage().join(
              ", ",
            ),
          tailleMaxUploadFichier: UtilitaireDocument.GApplication.droits.get(
            ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
          ),
        },
      );
      lTabActions.push({
        libelle: ObjetTraduction_1.GTraductions.getValeur(
          "fenetre_ActionContextuelle.prendrePlusieursImages",
        ).ucfirst(),
        icon: "icon_camera",
        event(aParamsInput) {
          if (aParamsInput) {
            const lCallback = aParams.callbackPrendrePlusieursImages
              ? aParams.callbackPrendrePlusieursImages
              : aCallbackDepotFichier;
            const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_AjoutImagesMultiple_1.ObjetFenetre_AjoutImagesMultiple,
              {
                pere: this,
                evenement(aNumeroBouton, aListe) {
                  if (aNumeroBouton === 0) {
                    lCallback({ listeFichiers: aListe });
                  }
                },
              },
            );
            const lDonnees = {
              liste:
                aParamsInput.listeFichiers ||
                new ObjetListeElements_1.ObjetListeElements(),
              utilitaire: UtilitaireDocument,
            };
            const lEstPasFichierValidePourPDF =
              aParamsInput.listeFichiers &&
              aParamsInput.listeFichiers.count() > 0 &&
              !UtilitaireDocument.estFichierValidePourPDF(
                aParamsInput.listeFichiers.get(0),
              );
            if (lEstPasFichierValidePourPDF) {
              UtilitaireDocument.GApplication.getMessage()
                .afficher({
                  message: ObjetChaine_1.GChaine.format(
                    ObjetTraduction_1.GTraductions.getValeur(
                      "inputFile.echecImagePDF_S",
                    ),
                    [aParamsInput.listeFichiers.get(0).getLibelle() || ""],
                  ),
                })
                .then(() =>
                  lFenetre.setDonnees(
                    Object.assign(lDonnees, {
                      liste: new ObjetListeElements_1.ObjetListeElements(),
                    }),
                  ),
                );
            } else {
              lFenetre.setDonnees(lDonnees);
            }
          }
        },
        optionsSelecFile: aParams.optionsSelecFile.prendrePlusieursImages
          ? aParams.optionsSelecFile.prendrePlusieursImages
          : lOptionsSelecFileParDefault,
        selecFile: true,
        class: "bg-util-marron-claire",
      });
    }
    if (lTabActions.length === 1 && !aParams.idCtn) {
    }
    const lParams = {};
    if (lTabActions.length > 1) {
      lParams.optionsFenetre = { positionSurSouris: true };
      lParams.pere = this;
    }
    ObjetFenetre_ActionContextuelle_1.ObjetFenetre_ActionContextuelle.ouvrir(
      lTabActions,
      lParams,
    );
  }
  static ouvrirFenetreChoixFichierCloud(aCallbackDepotFichier, aParams = {}) {
    UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
      {
        callbaskEvenement: (aLigne) => {
          if (aLigne >= 0) {
            const lService = GEtatUtilisateur.listeCloud.get(aLigne);
            const lFenetreChoixFichierDepuisCloud =
              ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
                ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
                {
                  pere: this,
                  evenement(aParam) {
                    const lParams = { params: aParam };
                    if (
                      aParam &&
                      aParam.listeNouveauxDocs &&
                      aParam.listeNouveauxDocs.count() > 0
                    ) {
                      return aCallbackDepotFichier(
                        Object.assign(lParams, {
                          eltFichier: aParam.listeNouveauxDocs.get(0),
                          listeFichiers: aParam.listeNouveauxDocs,
                        }),
                      );
                    }
                    aCallbackDepotFichier(lParams);
                  },
                  initialiser(aFenetre) {
                    aFenetre.setOptionsFenetre({
                      estMonoSelection: !!aParams.avecMonoSelection,
                    });
                  },
                },
              );
            lFenetreChoixFichierDepuisCloud.setDonnees({
              service: lService.Genre,
            });
          }
        },
        modeGestion:
          UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
            .Cloud,
      },
    );
  }
  static getNomPdfGenere() {
    let lNomPDF;
    lNomPDF =
      GEtatUtilisateur.getMembre().getLibelle() +
      "_" +
      ObjetDate_1.GDate.formatDate(
        ObjetDate_1.GDate.getDateHeureCourante(),
        "%JJ%MM%AAAA_%hh%mm%ss",
      ) +
      ".pdf";
    if (!!lNomPDF) {
      lNomPDF = lNomPDF.replace(/ /g, "");
    }
    if (!lNomPDF) {
      lNomPDF =
        ObjetDate_1.GDate.formatDate(
          ObjetDate_1.GDate.getDateHeureCourante(),
          "%JJ%MM%AAAA_%hh%mm%ss",
        ) + ".pdf";
    }
    return lNomPDF;
  }
  static estFichierValidePourPDF(aFichier) {
    return (
      aFichier &&
      aFichier.file &&
      aFichier.file.type &&
      UtilitaireTraitementImage_1.UtilitaireTraitementImage.getTabMimePDFImage().includes(
        aFichier.file.type,
      )
    );
  }
}
exports.UtilitaireDocument = UtilitaireDocument;
UtilitaireDocument.GApplication = GApplication;
