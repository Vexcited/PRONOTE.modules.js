const {
  UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { GenerationPDF } = require("UtilitaireGenerationPDF.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { EGenreDocTelechargement } = require("Enumere_DocTelechargement.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEventDocument } = require("InterfaceConsultDocument.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const { OptionsPDFSco } = require("OptionsPDFSco.js");
const { GDate } = require("ObjetDate.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { UtilitaireTraitementImage } = require("UtilitaireTraitementImage.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { tag } = require("tag.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  ObjetFenetre_GenerationPdfSco,
} = require("ObjetFenetre_GenerationPdfSco.js");
const cFormatDate = "%J %MMM";
const UtilitaireDocumentATelecharger = {
  genreAction: {
    genererLePdf: 1,
    archiverSurMonCloud: 2,
    redeposerLeFichierRempli: 3,
    marquerNonLu: 4,
    supprimer: 5,
    deposerLeFichier: 6,
    telecharger: 7,
    ouvrirPDFEtCloud: 8,
    ouvrirTelechargerEtCloud: 9,
    ouvrirFenetreInfo: 10,
    marquerLu: 11,
  },
  genererPDF(aParams) {
    GenerationPDF.genererPDF(
      Object.assign(
        { paramPDF: { avecDepot: true }, cloudCible: false },
        aParams,
      ),
    );
  },
  creeFenetreGestion(aParams) {
    const lParams = Object.assign(
      {
        modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.PDFEtCloud,
        avecDepot: true,
        avecMessage: false,
        message: null,
        avecBtnTelecharger: false,
        callbackTelechargement: null,
      },
      aParams,
    );
    let lTitre = "";
    switch (lParams.pdf.paramPDF.genreGenerationPDF) {
      case TypeHttpGenerationPDFSco.Bulletin:
      case TypeHttpGenerationPDFSco.BulletinDeCompetences:
        lTitre = lParams.pdf.paramPDF.nomFichier || "";
        break;
      case TypeHttpGenerationPDFSco.BulletinBIA:
        lTitre = lParams.pdf.paramPDF.nomFichier
          ? lParams.pdf.paramPDF.nomFichier
          : "";
        break;
      case TypeHttpGenerationPDFSco.ProjetAccompagnementPerso:
        lTitre = lParams.pdf.paramPDF.projet
          ? lParams.pdf.paramPDF.projet.getLibelle()
          : "";
        break;
      case TypeHttpGenerationPDFSco.FichierExterneTelechargeable:
      case TypeHttpGenerationPDFSco.DocumentTelechargeableMembre:
      case TypeHttpGenerationPDFSco.DocumentTelechargeable:
        lTitre =
          lParams.pdf.paramPDF.document && lParams.pdf.paramPDF.document.Libelle
            ? lParams.pdf.paramPDF.document.Libelle
            : "";
        break;
      case TypeHttpGenerationPDFSco.FicheBrevet:
        break;
      default:
        break;
    }
    const lOptions = {
      callbaskEvenement: function (aLigne) {
        const lService = GEtatUtilisateur.listeCloudDepotServeur.get(aLigne);
        const lCloud = !!lService ? lService.getGenre() : null;
        UtilitaireDocumentATelecharger.genererPDF(
          Object.assign(lParams.pdf, { cloudCible: lCloud }),
        );
      },
      titre: lTitre,
      modeGestion: lParams.modeGestion,
      avecDepot: lParams.avecDepot,
      avecMessage: lParams.avecMessage,
      message: lParams.message,
      avecBtnTelecharger: lParams.avecBtnTelecharger,
    };
    if (lParams.callbackTelechargement) {
      lOptions.callbackTelechargement = lParams.callbackTelechargement;
    }
    if (lParams.callbackFermeture) {
      lOptions.callbackFermeture = lParams.callbackFermeture;
    }
    if (lParams.callbackParametrage) {
      lOptions.callbackParametrage = lParams.callbackParametrage;
    }
    UtilitaireGestionCloudEtPDF.creerFenetreGestion(lOptions);
  },
  getParamPDF(aElement) {
    const lParamPDF = { avecDepot: true };
    switch (aElement.typeDocument) {
      case EGenreDocTelechargement.documents:
        (lParamPDF.genreGenerationPDF =
          TypeHttpGenerationPDFSco.DocumentTelechargeable),
          (lParamPDF.document = aElement.document);
        if (aElement.document.contexte) {
          lParamPDF.contexte = aElement.document.contexte;
        }
        break;
      case EGenreDocTelechargement.documentMembre:
        (lParamPDF.genreGenerationPDF =
          TypeHttpGenerationPDFSco.DocumentTelechargeableMembre),
          (lParamPDF.document = aElement.document);
        if (aElement.document.contexte) {
          lParamPDF.contexte = aElement.document.contexte;
        }
        break;
      case EGenreDocTelechargement.projetAcc:
        (lParamPDF.genreGenerationPDF =
          TypeHttpGenerationPDFSco.ProjetAccompagnementPerso),
          (lParamPDF.projet = aElement.projet);
        break;
      case EGenreDocTelechargement.bulletinBIA:
        (lParamPDF.genreGenerationPDF = TypeHttpGenerationPDFSco.BulletinBIA),
          (lParamPDF.nomFichier = aElement.bulletin.nomFichier);
        lParamPDF.ident = aElement.bulletin.ident;
        lParamPDF.libellePeriodeNotation =
          aElement.bulletin.libellePeriodeNotation;
        lParamPDF.libelleAnnee = aElement.bulletin.libelleAnnee;
        break;
      case EGenreDocTelechargement.bulletin:
        lParamPDF.nomFichier =
          aElement.getLibelle() +
          (aElement.periode ? " - " + aElement.periode.getLibelle() : "") +
          (aElement.classe ? " - " + aElement.classe.getLibelle() : "");
        (lParamPDF.genreGenerationPDF = TypeHttpGenerationPDFSco.Bulletin),
          (lParamPDF.periode = aElement.periode);
        lParamPDF.avecCodeCompetences =
          GEtatUtilisateur.estAvecCodeCompetences();
        delete lParamPDF.avecDepot;
        break;
      case EGenreDocTelechargement.documentCasier:
        lParamPDF.genreGenerationPDF =
          TypeHttpGenerationPDFSco.FichierExterneTelechargeable;
        lParamPDF.document = new ObjetElement({
          Numero: aElement.getNumero(),
          Genre: aElement.getGenre(),
          Libelle: aElement.getLibelle(),
        });
        break;
      case EGenreDocTelechargement.bulletinDeCompetences:
        lParamPDF.nomFichier =
          aElement.getLibelle() +
          (aElement.periode ? " - " + aElement.periode.getLibelle() : "") +
          (aElement.classe ? " - " + aElement.classe.getLibelle() : "");
        (lParamPDF.genreGenerationPDF =
          TypeHttpGenerationPDFSco.BulletinDeCompetences),
          (lParamPDF.periode = aElement.periode);
        lParamPDF.avecChoixGraphe = true;
        lParamPDF.avecCodeCompetences =
          GEtatUtilisateur.estAvecCodeCompetences();
        delete lParamPDF.avecDepot;
        break;
      case EGenreDocTelechargement.diplome:
        (lParamPDF.genreGenerationPDF = TypeHttpGenerationPDFSco.FicheBrevet),
          (lParamPDF.eleve = GEtatUtilisateur.getMembre());
        break;
      default:
        (lParamPDF.genreGenerationPDF =
          TypeHttpGenerationPDFSco.DocumentTelechargeable),
          (lParamPDF.document = aElement);
        break;
    }
    return lParamPDF;
  },
  getInfoDoc(aArticle, aParams = {}) {
    const lInfo = { wai: "", html: "", titre: "", message: "" };
    const lArticle = aArticle;
    if (lArticle.estUnDeploiement) {
      lInfo.wai = `${lArticle.Libelle} ${MethodesObjet.isNumeric(aParams.compteur) ? `(${aParams.compteur})` : ""}`;
      lInfo.html = lInfo.wai;
      lInfo.titre = lInfo.html;
    } else {
      switch (lArticle.typeDocument) {
        case EGenreDocTelechargement.documentAFournir: {
          lInfo.wai = lArticle.Libelle;
          lInfo.html = lInfo.wai;
          lInfo.titre = lInfo.html;
          const lEstJourDeposable =
            lArticle.dateLimiteDepot &&
            (GDate.estDateJourAvant(
              GDate.aujourdhui,
              lArticle.dateLimiteDepot,
            ) ||
              GDate.estJourEgal(GDate.aujourdhui, lArticle.dateLimiteDepot));
          if (lArticle.avecDepotAutorise && lEstJourDeposable) {
            const lDateFormat = GDate.formatDate(
              lArticle.dateLimiteDepot,
              cFormatDate,
            );
            lInfo.message = GTraductions.getValeur(
              "documentsATelecharger.aJoindreJusquau",
              [lDateFormat],
            ).ucfirst();
          }
          if (!lArticle.avecDepotAutorise && !lEstJourDeposable) {
            lInfo.message = GTraductions.getValeur(
              "documentsATelecharger.dateLimiteDepassee",
            );
          }
          break;
        }
        case EGenreDocTelechargement.documents:
        case EGenreDocTelechargement.documentCasier:
        case EGenreDocTelechargement.documentMembre:
          lInfo.wai = lArticle.Libelle;
          lInfo.html = lInfo.wai;
          lInfo.titre = lInfo.html;
          break;
        case EGenreDocTelechargement.bulletinBIA:
          lInfo.wai = aParams.avecMessagePourPrevenirEvent
            ? GTraductions.getValeur("documentsATelecharger.genererLePdf")
            : "" +
              `${lArticle.bulletin.libelle} - ${lArticle.bulletin.libellePeriodeNotation} - ${lArticle.bulletin.libelleClasse}`;
          lInfo.html = lInfo.wai;
          lInfo.titre = lInfo.html;
          break;
        case EGenreDocTelechargement.bulletin:
        case EGenreDocTelechargement.bulletinDeCompetences:
          lInfo.wai = `${lArticle.getLibelle()} - ${lArticle.periode.getLibelle()} - ${lArticle.classe.getLibelle()}`;
          lInfo.html = lInfo.wai;
          lInfo.titre = lInfo.html;
          break;
        case EGenreDocTelechargement.projetAcc:
          lInfo.wai = `${lArticle.getLibelle()} - ${GTraductions.getValeur("PageCompte.AmenagementsProjet")}`;
          lInfo.html = lInfo.wai;
          lInfo.titre = lArticle.getLibelle();
          break;
        case EGenreDocTelechargement.diplome:
          lInfo.wai = lArticle.getLibelle();
          lInfo.html = lInfo.wai;
          lInfo.titre = lInfo.wai;
          break;
        default:
          break;
      }
    }
    return lInfo;
  },
  getAction(aGenre, aDocument, aCallback, aParams) {
    const lAction = {
      libelle: "",
      icon: "",
      actif: true,
      callback: () => {},
      actionMenuCtx: new ObjetElement(),
      genreEvenement: -1,
    };
    const getParamCallback = () => {
      const lParamPDF = UtilitaireDocumentATelecharger.getParamPDF(aDocument);
      const lParamGenegerPDF = { paramPDF: lParamPDF };
      const lParametreFenetreGestion = {};
      const lOuvrirFenetreParametrage = (aGenreGenerationPDF) => {
        const lFenetre = ObjetFenetre.creerInstanceFenetre(
          ObjetFenetre_GenerationPdfSco,
          {
            pere: this,
            evenement(aNumeroBouton, aParametresAffichage, aOptionsPDF) {
              if (aNumeroBouton === 1) {
                lParamGenegerPDF.optionsPDF = aOptionsPDF;
              }
            },
          },
        );
        lFenetre.afficher({ genreGenerationPDF: aGenreGenerationPDF });
      };
      switch (aDocument.typeDocument) {
        case EGenreDocTelechargement.projetAcc:
          lParamGenegerPDF.optionsPDF = OptionsPDFSco.defaut;
          break;
        case EGenreDocTelechargement.bulletin:
          lParamGenegerPDF.optionsPDF = OptionsPDFSco.Bulletin;
          lParametreFenetreGestion.callbackParametrage = () =>
            lOuvrirFenetreParametrage(TypeHttpGenerationPDFSco.Bulletin);
          break;
        case EGenreDocTelechargement.bulletinDeCompetences:
          lParamGenegerPDF.optionsPDF = OptionsPDFSco.BulletinDeCompetences;
          lParametreFenetreGestion.callbackParametrage = () =>
            lOuvrirFenetreParametrage(
              TypeHttpGenerationPDFSco.BulletinDeCompetences,
            );
          break;
        case EGenreDocTelechargement.diplome:
          lParamGenegerPDF.optionsPDF = OptionsPDFSco.defaut;
          lParametreFenetreGestion.callbackParametrage = () =>
            lOuvrirFenetreParametrage(TypeHttpGenerationPDFSco.FicheBrevet);
          break;
      }
      lParametreFenetreGestion.pdf = lParamGenegerPDF;
      if (aDocument.memo && aDocument.memo.length > 0) {
        lParametreFenetreGestion.avecMessage = true;
        lParametreFenetreGestion.message = aDocument.memo;
      }
      switch (aGenre) {
        case UtilitaireDocumentATelecharger.genreAction.genererLePdf:
          return lParamGenegerPDF;
        case UtilitaireDocumentATelecharger.genreAction.archiverSurMonCloud:
          return Object.assign(lParametreFenetreGestion, {
            modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
          });
        case UtilitaireDocumentATelecharger.genreAction.ouvrirPDFEtCloud:
          return lParametreFenetreGestion;
        case UtilitaireDocumentATelecharger.genreAction
          .ouvrirTelechargerEtCloud:
          return Object.assign(lParametreFenetreGestion, {
            modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
            avecBtnTelecharger: true,
            callbackTelechargement: () =>
              UtilitaireDocument.ouvrirUrl(
                aDocument.documentCasier ? aDocument.documentCasier : aDocument,
              ),
            callbackFermeture: (aParam) =>
              aCallback ? aCallback(aParam, aDocument) : null,
          });
      }
    };
    switch (aGenre) {
      case UtilitaireDocumentATelecharger.genreAction.genererLePdf:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.genererLePdf",
        );
        lAction.icon = "icon_pdf";
        lAction.genreEvenement = EGenreEventDocument.genererLePdf;
        lAction.callback = () =>
          UtilitaireDocumentATelecharger.genererPDF(getParamCallback());
        break;
      case UtilitaireDocumentATelecharger.genreAction.ouvrirPDFEtCloud:
        lAction.icon = "icon_pdf";
        lAction.genreEvenement = EGenreEventDocument.ouvrirfenetrePdfEtClourd;
        lAction.callback = () =>
          UtilitaireDocumentATelecharger.creeFenetreGestion(getParamCallback());
        break;
      case UtilitaireDocumentATelecharger.genreAction.archiverSurMonCloud:
        lAction.secondaire = true;
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.archiverSurMonCloud",
        );
        lAction.icon = "icon_cloud";
        lAction.genreEvenement = EGenreEventDocument.archiverSurMonCloud;
        lAction.callback = () =>
          UtilitaireDocumentATelecharger.creeFenetreGestion(getParamCallback());
        break;
      case UtilitaireDocumentATelecharger.genreAction.redeposerLeFichierRempli:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.redeposerLeFichierRempli",
        );
        lAction.icon = "";
        lAction.genreEvenement = EGenreEventDocument.redeposerLeFichierRempli;
        lAction.callback = () => {};
        break;
      case UtilitaireDocumentATelecharger.genreAction.marquerNonLu:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.marquerNonLu",
        );
        lAction.icon = "icon_eye_close";
        lAction.genreEvenement = EGenreEventDocument.marquerNonLu;
        break;
      case UtilitaireDocumentATelecharger.genreAction.marquerLu:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.marquerLu",
        );
        lAction.icon = "icon_eye_open";
        lAction.genreEvenement = EGenreEventDocument.marquerLu;
        break;
      case UtilitaireDocumentATelecharger.genreAction.supprimer:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.supprimerDuCasier",
        );
        lAction.icon = "icon_trash";
        lAction.genreEvenement = EGenreEventDocument.supprimer;
        lAction.callback = () => {};
        break;
      case UtilitaireDocumentATelecharger.genreAction.deposerLeFichier:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.deposerLeFichier",
        );
        lAction.icon = "icon_download_alt";
        lAction.genreEvenement = EGenreEventDocument.deposerLeFichier;
        lAction.callback = function () {
          UtilitaireDocument.ouvrirFenetreChoixTypeDeFichierADeposer.call(
            this,
            aCallback,
            {
              optionsSelecFile: {
                prendrePlusieursImages: {
                  avecResizeImage: true,
                  multiple: false,
                  avecTransformationFlux: false,
                  accept:
                    UtilitaireTraitementImage.getTabMimePDFImage().join(", "),
                  maxSize: GApplication.droits.get(
                    TypeDroits.tailleMaxDocJointEtablissement,
                  ),
                },
                prendrePhoto: {
                  genererPDFImages: true,
                  nomPDFaGenerer: UtilitaireDocument.getNomPdfGenere(),
                  avecResizeImage: true,
                  multiple: false,
                  maxSize: GApplication.droits.get(
                    TypeDroits.tailleMaxDocJointEtablissement,
                  ),
                },
              },
              avecPrendrePhoto: true,
              avecFichierDepuisCloud: false,
              idCtn: aParams.id,
              avecPrendrePlusieursImages: true,
            },
          );
        };
        lAction.actif = () =>
          !!aDocument.avecDepotAutorise &&
          aDocument.listePJ &&
          !(aDocument.listePJ.getNbrElementsExistes() > 0);
        break;
      case UtilitaireDocumentATelecharger.genreAction.telecharger:
        lAction.libelle = GTraductions.getValeur(
          "documentsATelecharger.telecharger",
        );
        lAction.icon = "icon_download_alt";
        lAction.genreEvenement = EGenreEventDocument.telecharger;
        lAction.callback = () =>
          UtilitaireDocument.ouvrirUrl(
            aDocument.documentCasier ? aDocument.documentCasier : aDocument,
          );
        break;
      case UtilitaireDocumentATelecharger.genreAction.ouvrirTelechargerEtCloud:
        lAction.genreEvenement =
          EGenreEventDocument.ouvrirfenetreTelechargerEtClourd;
        lAction.callback = () =>
          UtilitaireDocumentATelecharger.creeFenetreGestion(getParamCallback());
        break;
      case UtilitaireDocumentATelecharger.genreAction.ouvrirFenetreInfo:
        lAction.callback = () => {
          const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
            pere: this,
            initialiser(aFenetre) {
              aFenetre.setOptionsFenetre({
                largeur: 300,
                listeBoutons: [GTraductions.getValeur("Fermer")],
                titre: aDocument.getLibelle(),
              });
            },
          });
          lFenetre.afficher(tag("div", { class: "" }, aDocument.message || ""));
        };
        break;
      default:
        break;
    }
    return {
      actionMenuCtx: Object.assign(new ObjetElement(lAction.libelle), {
        icon: lAction.icon,
        actif: lAction.actif,
        genreEvenement: lAction.genreEvenement,
      }),
      boutonCtxMixte: {
        libelle: lAction.libelle,
        actif: lAction.actif,
        genreEvenement: lAction.genreEvenement,
        icon: lAction.icon,
      },
      event: lAction.callback,
    };
  },
  getStrPublication(aArticle) {
    switch (aArticle.typeDocument) {
      case EGenreDocTelechargement.projetAcc:
        if (aArticle.dateDebut && aArticle.dateFin) {
          return `${GTraductions.getValeur("Du").ucfirst()} ${GDate.formatDate(aArticle.dateDebut, cFormatDate)} ${GTraductions.getValeur("Au").toLowerCase()} ${GDate.formatDate(aArticle.dateFin, cFormatDate)}`;
        }
        break;
      default:
        if (aArticle.dateDebutPublication && aArticle.dateFinPublication) {
          return GTraductions.getValeur("documentsATelecharger.publieDuAu", [
            GDate.formatDate(aArticle.dateDebutPublication, cFormatDate),
            GDate.formatDate(aArticle.dateFinPublication, cFormatDate),
          ]);
        } else if (aArticle.date && !aArticle.LibelleDepositaire) {
          return GTraductions.getValeur("documentsATelecharger.publieLe", [
            GDate.formatDate(aArticle.date, cFormatDate),
          ]);
        } else if (aArticle.dateLimiteDepot) {
          return GTraductions.getValeur("documentsATelecharger.jusquAu", [
            GDate.formatDate(aArticle.dateLimiteDepot, cFormatDate),
          ]);
        }
        break;
    }
    return "";
  },
  construireListeCumulParCategorie(aListe) {
    const lListeParent = new ObjetListeElements();
    aListe.parcourir((aElem) => {
      if (aElem.categorie) {
        const lLaCategorieEstPasDansLaListeParent =
          !lListeParent.getElementParNumero(aElem.categorie.getNumero());
        if (lLaCategorieEstPasDansLaListeParent) {
          const lNombreFils = aListe
            .getListeElements(
              (aElement) =>
                aElement.categorie &&
                aElem.categorie &&
                aElement.categorie.getNumero() === aElem.categorie.getNumero(),
            )
            .count();
          lListeParent.add(
            Object.assign(aElem.categorie, {
              estUnDeploiement: true,
              estDeploye: true,
              nbFils: lNombreFils || 0,
              categorie: aElem.categorie,
            }),
          );
        }
        aElem.pere = lListeParent.getElementParNumero(
          aElem.categorie.getNumero(),
        );
      }
    });
    lListeParent.add(aListe);
    lListeParent.setTri([ObjetTri.init("categorie.Libelle")]).trier();
    return lListeParent;
  },
  getIconListeRubrique(aArticle, aParams) {
    const lAvecIconCategorie = aArticle.categorie && aArticle.categorie.icon;
    const lAvecIcon = aArticle && aArticle.icon;
    if (lAvecIconCategorie || lAvecIcon) {
      return `<i class="${lAvecIcon ? lAvecIcon : lAvecIconCategorie}"></i>`;
    } else {
      const lParams = Object.assign(
        { height: "1.5rem", width: "0.4rem" },
        aParams,
      );
      let lColor;
      if (aArticle.couleur) {
        lColor = aArticle.couleur;
      } else if (aArticle.categorie && aArticle.categorie.couleur) {
        lColor = aArticle.categorie.couleur;
      } else {
        lColor = "#c0c0c0";
      }
      lParams.color = lColor;
      const lStyle = [
        "border-radius: calc(0.4rem / 2)",
        "width : " + lParams.width,
        "height : " + lParams.height,
        "background-color: var(--color-line)",
        "--color-line:" + lParams.color,
      ];
      return `<div class="line-color" style="${lStyle.join("; ")}"></div>`;
    }
  },
};
module.exports = { UtilitaireDocumentATelecharger };
