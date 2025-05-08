const { GTraductions } = require("ObjetTraduction.js");
const {
  ObjetRequeteDocumentsATelecharger,
} = require("ObjetRequeteDocumentsATelecharger.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListe } = require("ObjetListe.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { UtilitaireDocument } = require("UtilitaireDocument.js");
const {
  UtilitaireDocumentATelecharger,
} = require("UtilitaireDocumentATelecharger.js");
const { tag } = require("tag.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreDocTelechargement } = require("Enumere_DocTelechargement.js");
const {
  EFormatDocJoint,
  EFormatDocJointUtil,
} = require("Enumere_FormatDocJoint.js");
const { GDate } = require("ObjetDate.js");
class ObjetDocumentsATelecharger extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.parametresRequete = null;
    this.options = {
      avecScroll: true,
      avecEvent: false,
      avecCouleurCategorie: false,
      avecIconeDocument: false,
      avecBtnEllipsis: false,
      avecFiltreNonLus: false,
      avecIntertitreAnnee: true,
      avecLigneOff: false,
      avecCompteurSurDeploiement: false,
    };
    this.id = { bandeauGauche: GApplication.idBreadcrumbPerso };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeDoc: function (aIndex) {
        const lDoc = aInstance.listeDocs.get(aIndex);
        if (lDoc && lDoc.event) {
          $(this.node).eventValidation(() => {
            lDoc.event();
          });
        }
      },
    });
  }
  construireInstances() {
    this.identListe = this.add(
      ObjetListe,
      _eventListe.bind(this),
      _intiListe.bind(this),
    );
  }
  construireAffichage() {
    if (this.listeDocs) {
      const H = [];
      H.push(
        `<div class="ObjetDocumentsATelecharger" id="${this.getNomInstance(this.identListe)}" style="height:100%; width:100%" ></div>`,
      );
      return H.join("");
    }
    return "";
  }
  callbackChipsSuppresion(aArticle) {
    this.callback.appel({
      genreEvenement:
        ObjetDocumentsATelecharger.genreEventDocumentATelecharger.SuppressionPJ,
      article: aArticle,
    });
  }
  setOptions(aOptions) {
    Object.assign(this.options, aOptions);
    return this;
  }
  setDonnees(aParams) {
    this.listeDocs = null;
    if (aParams.listeCategories) {
      this.listeCategories = aParams.listeCategories;
    }
    this.afficher();
    return Promise.resolve()
      .then(() => {
        if (aParams && aParams.listeDocs) {
          this.listeDocs = aParams.listeDocs;
          return;
        }
        return new ObjetRequeteDocumentsATelecharger(this)
          .lancerRequete(aParams)
          .then((aJSON) => {
            this.listeDocs = aJSON.liste;
          })
          .catch((e) => {});
      })
      .then(() => {
        this.afficher();
        _afficherListeDocs.call(this);
        if (this.listeDocs && this.Pere && this.Pere.surResizeInterface) {
          this.Pere.surResizeInterface();
        }
        return { listeDocs: this.listeDocs };
      });
  }
  setSelectionListe(aSelection) {
    const lListe = this.getInstance(this.identListe);
    if (lListe) {
      const lIndice = lListe
        .getDonneesListe()
        .Donnees.getIndiceElementParFiltre(
          (aElem) => aElem.getNumero() === aSelection.getNumero(),
        );
      if (lIndice) {
        lListe.selectionnerLigne({
          ligne: lIndice,
          avecScroll: true,
          avecEvenement: true,
        });
      }
    }
  }
  setOptionsListe(aOptions) {
    const lListe = this.getInstance(this.identListe);
    if (lListe && aOptions) {
      lListe.setOptionsListe(aOptions);
    }
  }
  callbackMenuCtxListe(aParams) {
    if (this.options.avecEvent) {
      if (
        aParams &&
        aParams.data &&
        MethodesObjet.isNumeric(aParams.data.genreEvenement) &&
        aParams.data.article
      ) {
        this.callback.appel({
          genreEvenement:
            ObjetDocumentsATelecharger.genreEventDocumentATelecharger
              .evenementMenuCtx,
          genreEvenementMenuCtx: aParams.data.genreEvenement,
          article: aParams.data.article,
        });
      }
    }
  }
}
function _intiListe(aInstance) {
  aInstance.setOptionsListe({
    skin: ObjetListe.skin.flatDesign,
    messageContenuVide: GTraductions.getValeur("DocumentsATelecharger.Aucun"),
    avecOmbreDroite: true,
    boutons: [{ genre: ObjetListe.typeBouton.rechercher }],
  });
}
function _eventListe(aParams) {
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.SelectionClick:
      if (this.options.avecEvent) {
        this.callback.appel({
          genreEvenement:
            ObjetDocumentsATelecharger.genreEventDocumentATelecharger
              .evenementListe,
          genreEvenementListe: EGenreEvenementListe.Selection,
          article: aParams.article,
        });
      } else if (
        aParams &&
        aParams.article &&
        aParams.article.typeDocument === EGenreDocTelechargement.bulletinBIA
      ) {
        const lOuvrirPDFEtCloud = UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.ouvrirPDFEtCloud,
          aParams.article,
        );
        if (lOuvrirPDFEtCloud.event) {
          lOuvrirPDFEtCloud.event();
        }
      }
      break;
    default:
      break;
  }
}
function _formatDonnees(aListe) {
  if (this.options.avecIntertitreAnnee) {
    const lCountListe = aListe.count();
    if (aListe && lCountListe > 0) {
      const lListe = new ObjetListeElements();
      let lAnneePrecedente = 0;
      let lIndex = 0;
      aListe.parcourir((aElem) => {
        if (
          MethodesObjet.isNumeric(aElem.annee) &&
          aElem.annee !== lAnneePrecedente
        ) {
          lAnneePrecedente = aElem.annee;
          const lNombreFils = aListe
            .getListeElements((aElement) => aElement.annee === lAnneePrecedente)
            .count();
          lListe.addElement(
            Object.assign(
              new ObjetElement(
                GTraductions.getValeur("DocumentsATelecharger.Annee") +
                  " " +
                  lAnneePrecedente +
                  "/" +
                  (lAnneePrecedente + 1),
              ),
              {
                nbFils: lNombreFils,
                estUnDeploiement: true,
                estDeploye: true,
                annee: lAnneePrecedente,
              },
            ),
            lIndex,
          );
          lIndex++;
        }
        const lPere = lListe.getListeElements(
          (aElement) =>
            aElement.annee === lAnneePrecedente && aElement.estUnDeploiement,
        );
        const lParam = {};
        if (lPere.count() === 1) {
          lParam.pere = lPere.get(0);
        }
        lListe.addElement(Object.assign(aElem, lParam), lIndex);
        lIndex++;
      });
      return lListe;
    }
  }
  return aListe;
}
function _afficherListeDocs() {
  const lInstanceliste = this.getInstance(this.identListe);
  lInstanceliste.setDonnees(
    new DonneesListe_DocumentATelecharger(
      _formatDonnees.call(this, this.listeDocs),
      {
        listeCategories: this.listeCategories || new ObjetListeElements(),
        callbackMenuCtx: this.callbackMenuCtxListe.bind(this),
        callbackChipsSuppresion: this.callbackChipsSuppresion.bind(this),
        avecCouleurCategorie: this.options.avecCouleurCategorie,
        avecIconeDocument: this.options.avecIconeDocument,
        avecBtnEllipsis: this.options.avecBtnEllipsis,
        avecFiltreNonLus: this.options.avecFiltreNonLus,
        avecLigneOff: this.options.avecLigneOff,
        avecCompteurSurDeploiement: this.options.avecCompteurSurDeploiement,
        avecMessagePourPrevenirEvent: !this.options.avecEvent,
      },
    ).setOptions({ avecTri: false }),
  );
}
ObjetDocumentsATelecharger.genreEventDocumentATelecharger = {
  evenementListe: 1,
  evenementMenuCtx: 2,
  SuppressionPJ: 3,
};
class DonneesListe_DocumentATelecharger extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.callbackMenuCtx = aParams.callbackMenuCtx;
    this.avecMessagePourPrevenirEvent = aParams.avecMessagePourPrevenirEvent;
    this.avecCouleurCategorie = aParams.avecCouleurCategorie;
    this.callbackChipsSuppresion = aParams.callbackChipsSuppresion;
    this.listeCategories = MethodesObjet.dupliquer(aParams.listeCategories);
    this.avecIconeDocument = aParams.avecIconeDocument;
    this.avecFiltreNonLus = aParams.avecFiltreNonLus;
    this.avecBtnEllipsis = aParams.avecBtnEllipsis;
    this.avecLigneOff = aParams.avecLigneOff;
    this.avecCompteurSurDeploiement = aParams.avecCompteurSurDeploiement;
    if (this.listeCategories.count() > 0) {
      this.listeCategories.insererElement(
        new ObjetElement({
          estTotal: true,
          Libelle: GTraductions.getValeur(
            "documentsATelecharger.toutesLesNatures",
          ),
        }),
        0,
      );
    }
    this.setOptions({
      avecIndentationSousInterTitre: true,
      avecSelection: true,
      avecEvnt_Selection: true,
    });
    this.filtre = { cbNonLu: false, indiceCategorie: 0 };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      chipsPieceJointe: {
        eventBtn(aIndice, aNumero) {
          const lElement = aInstance.Donnees.getElementParNumero(aNumero);
          if (lElement) {
            const lPJ = lElement.listePJ.get(aIndice);
            if (lPJ) {
              GApplication.getMessage().afficher({
                type: EGenreBoiteMessage.Confirmation,
                message: GTraductions.getValeur(
                  "documentsATelecharger.messageSuppression",
                ),
                callback: function (aGenreAction) {
                  if (aGenreAction === EGenreAction.Valider) {
                    lElement.setEtat(EGenreEtat.Modification);
                    lPJ.setEtat(EGenreEtat.Suppression);
                    aInstance.callbackChipsSuppresion(lElement);
                  }
                },
              });
            }
          }
        },
      },
    });
  }
  getTitreZonePrincipale(aParams) {
    let lParam = {};
    if (aParams.article.estUnDeploiement && this.avecCompteurSurDeploiement) {
      const lListeEnfantsAvecLaMemeCategorie = this.Donnees.getListeElements(
        (aI) => {
          let lValue = false;
          if (
            aI.categorie &&
            aParams.article.categorie &&
            aI.categorie.getNumero() ===
              aParams.article.categorie.getNumero() &&
            !aI.estUnDeploiement
          ) {
            lValue = true;
            if (this.avecFiltreNonLus && this.filtre.cbNonLu && !aI.estNonLu) {
              lValue = false;
            }
          }
          return lValue;
        },
      );
      lParam = { compteur: lListeEnfantsAvecLaMemeCategorie.count() };
    }
    return UtilitaireDocumentATelecharger.getInfoDoc(aParams.article, lParam)
      .html;
  }
  getAriaLabelZoneCellule(aParams, aZone) {
    if (aZone === ObjetDonneesListeFlatDesign.ZoneCelluleFlatDesign.titre) {
      return UtilitaireDocumentATelecharger.getInfoDoc(aParams.article, {
        avecMessagePourPrevenirEvent: this.avecMessagePourPrevenirEvent,
      }).wai;
    } else if (
      aZone === ObjetDonneesListeFlatDesign.ZoneCelluleFlatDesign.message
    ) {
      return _avecMessageAdeposer(aParams.article)
        ? GTraductions.getValeur("documentsATelecharger.documentADeposer")
        : "";
    }
  }
  avecEvenementSelection(aParams) {
    return !(aParams.article.estInterTitre || aParams.article.estUnDeploiement);
  }
  avecEvenementSelectionClick(aParams) {
    return !(aParams.article.estInterTitre || aParams.article.estUnDeploiement);
  }
  getClass(aParams) {
    let lClass = "";
    if (aParams.article.estInterTitre) {
      lClass = "theme_color_moyen1";
    }
    return lClass;
  }
  getZoneMessage(aParams) {
    const H = [];
    if (!aParams.article.estUnDeploiement) {
      const strPublication = UtilitaireDocumentATelecharger.getStrPublication(
        aParams.article,
      );
      H.push(`<div>`);
      if (strPublication.length > 0) {
        H.push(`<div>${strPublication}</div>`);
      }
      if (aParams.article.LibelleDepositaire) {
        if (
          aParams.article.dateDebutPublication &&
          aParams.article.dateFinPublication
        ) {
          H.push(
            `<div>${GTraductions.getValeur("documentsATelecharger.diffusePar", [aParams.article.LibelleDepositaire])}</div>`,
          );
        } else {
          H.push(
            `<div>${GTraductions.getValeur("documentsATelecharger.diffuseParLe", [aParams.article.LibelleDepositaire, GDate.formatDate(aParams.article.date, "%J %MMM")])}</div>`,
          );
        }
      }
      if (aParams.article.listePJ && aParams.article.listePJ.count() === 1) {
        H.push(_composeListeChips.call(this, aParams.article));
      }
      H.push(`</div>`);
    }
    if (_avecMessageAdeposer(aParams.article)) {
      H.push('<span class="like-link">');
      H.push(GTraductions.getValeur("DocumentsATelecharger.ADeposer"));
      H.push('<i class="icon_justifier"></i>');
      H.push("</span>");
    }
    const lAvecMessageDepot =
      aParams.article.listePJ && aParams.article.listePJ.count() === 1;
    if (lAvecMessageDepot) {
      let lCleTrad;
      if (aParams.article.estDeposeParEtablissement) {
        lCleTrad = GTraductions.getValeur(
          "documentsATelecharger.deposeparEtablissement",
          [GDate.formatDate(aParams.article.dateDepotDoc, "%J %MMM")],
        );
      } else if (aParams.article.estLeProprietaire) {
        lCleTrad = GTraductions.getValeur(
          "documentsATelecharger.deposeParMoi",
          [GDate.formatDate(aParams.article.dateDepotDoc, "%J %MMM")],
        );
      } else if (aParams.article.estDeposeParUnAutreResponsable) {
        lCleTrad = GTraductions.getValeur(
          "documentsATelecharger.deposeParUnResponsable",
          [GDate.formatDate(aParams.article.dateDepotDoc, "%J %MMM")],
        );
      }
      H.push(
        '<div class="flex-contain justify-end flex-center p-right m-top">',
      );
      H.push(lCleTrad);
      H.push("</div>");
    }
    return H.join("");
  }
  initialisationObjetContextuel(aParams) {
    const lActions = new ObjetListeElements();
    switch (aParams.article.typeDocument) {
      case EGenreDocTelechargement.documentCasier: {
        const lSupprimer = UtilitaireDocumentATelecharger.getAction(
          UtilitaireDocumentATelecharger.genreAction.supprimer,
          aParams.article,
        );
        if (aParams.article.estNonLu) {
          const lMarquerLu = UtilitaireDocumentATelecharger.getAction(
            UtilitaireDocumentATelecharger.genreAction.marquerLu,
            aParams.article,
          );
          lActions.add(lMarquerLu.actionMenuCtx);
        } else if (aParams.article.estNonLu === false) {
          const lMarquerNonLu = UtilitaireDocumentATelecharger.getAction(
            UtilitaireDocumentATelecharger.genreAction.marquerNonLu,
            aParams.article,
          );
          lActions.add(lMarquerNonLu.actionMenuCtx);
        }
        lActions.add(lSupprimer.actionMenuCtx);
        break;
      }
      default:
        break;
    }
    if (lActions && lActions.count() > 0) {
      lActions.parcourir((aAction) => {
        const lExtend = {};
        if (aAction.icon) {
          lExtend.icon = aAction.icon;
        }
        if (aAction.genreEvenement) {
          lExtend.data = {
            genreEvenement: aAction.genreEvenement
              ? aAction.genreEvenement
              : undefined,
            article: aParams.article,
          };
        }
        aParams.menuContextuel.add(
          aAction.getLibelle(),
          aAction.actif,
          this.callbackMenuCtx,
          lExtend,
        );
      });
    }
    aParams.menuContextuel.setDonnees();
  }
  getZoneGauche(aParams) {
    let lIcone = "";
    if (this.avecIconeDocument && !aParams.article.estUnDeploiement) {
      let lClass = EFormatDocJointUtil.getClassIconDeGenre(EFormatDocJoint.Pdf);
      if (
        EGenreDocTelechargement.documentCasier === aParams.article.typeDocument
      ) {
        lClass = UtilitaireDocument.getIconFromFileName(
          aParams.article.getLibelle(),
        );
      }
      lIcone = tag("i", { class: [lClass, "i-medium"] });
    }
    if (this.avecCouleurCategorie && aParams.article.estUnDeploiement) {
      lIcone = UtilitaireDocumentATelecharger.getIconListeRubrique(
        aParams.article,
        { height: "2.5rem" },
      );
    }
    return lIcone;
  }
  getZoneComplementaire(aParams) {
    if (aParams.article.memo && aParams.article.memo.length > 0) {
      return tag("i", {
        class: "icon_post_it_rempli theme_color_moyen1 i-medium",
        title: GTraductions.getValeur("documentsATelecharger.hintMemo"),
      });
    }
    return "";
  }
  estLigneOff(aParams) {
    if (this.avecLigneOff) {
      return !aParams.article.estNonLu && !aParams.article.estUnDeploiement;
    }
    return super.estLigneOff(aParams);
  }
  construireFiltres() {
    return tag(
      "div",
      { class: ["flex-contain", "cols"] },
      this.avecFiltreNonLus
        ? tag(
            "ie-checkbox",
            { "ie-model": "cbNonLu" },
            GTraductions.getValeur("documentsATelecharger.nonLus"),
          )
        : "",
      this.avecFiltreNonLus
        ? tag("div", { class: ["DAT_separateur", "m-y-l"] }, "")
        : "",
      tag("ie-combo", {
        "ie-model": "comboCategories",
        class: "combo-sans-fleche",
      }),
    );
  }
  reinitFiltres() {
    (this.filtre.cbNonLu = false), (this.filtre.indiceCategorie = 0);
    this.paramsListe.actualiserListe();
  }
  estFiltresParDefaut() {
    return !this.filtre.cbNonLu && this.filtre.indiceCategorie === 0;
  }
  getControleurFiltres() {
    return {
      cbNonLu: {
        getValue: () => {
          return this.filtre.cbNonLu;
        },
        setValue: (aValue) => {
          this.filtre.cbNonLu = !!aValue;
          this.paramsListe.actualiserListe();
        },
      },
      comboCategories: {
        init(aCombo) {
          aCombo.setDonneesObjetSaisie({ options: { estLargeurAuto: true } });
        },
        getDonnees: () => {
          if (this.listeCategories) {
            return this.listeCategories;
          }
        },
        event: (aParam) => {
          if (
            aParam.genreEvenement === EGenreEvenementObjetSaisie.selection &&
            aParam.element
          ) {
            this.filtre.indiceCategorie =
              this.listeCategories.getIndiceElementParFiltre(
                (aCat) => aCat === aParam.element,
              );
            this.paramsListe.actualiserListe();
          }
        },
        getIndiceSelection: () => {
          return MethodesObjet.isNumeric(this.filtre.indiceCategorie)
            ? this.filtre.indiceCategorie
            : -1;
        },
      },
    };
  }
  getVisible(aArticle) {
    let lVisible = true;
    const lFiltre = this.listeCategories.get(this.filtre.indiceCategorie);
    if (lFiltre && !lFiltre.estTotal) {
      lVisible =
        aArticle.categorie &&
        aArticle.categorie.getNumero() === lFiltre.getNumero();
    }
    if (this.avecFiltreNonLus && this.filtre.cbNonLu) {
      if (aArticle.estUnDeploiement) {
        let lAvecEnfantNonLu =
          this.Donnees.getListeElements(
            (aElement) =>
              !aElement.estUnDeploiement &&
              aElement.pere.categorie &&
              aArticle.categorie &&
              aElement.pere.categorie.getNumero() ===
                aArticle.categorie.getNumero() &&
              aElement.estNonLu,
          ).count() > 0;
        lVisible = lVisible && lAvecEnfantNonLu;
      } else {
        lVisible = lVisible && aArticle.estNonLu;
      }
    }
    return !!lVisible;
  }
  avecBoutonActionLigne(aParams) {
    const avecBtnEllipsis = [EGenreDocTelechargement.documentCasier].includes(
      aParams.article.typeDocument,
    );
    return (
      super.avecBoutonActionLigne(aParams) &&
      !aParams.article.estUnDeploiement &&
      this.avecBtnEllipsis &&
      avecBtnEllipsis
    );
  }
}
function _composeListeChips(aArticle) {
  const H = [];
  const lArticle = aArticle;
  if (
    lArticle &&
    lArticle.listePJ &&
    lArticle.listePJ.count() > 0 &&
    lArticle.docConsultable
  ) {
    let lClass = EFormatDocJointUtil.getClassIconDeGenre(EFormatDocJoint.Pdf);
    if (EGenreDocTelechargement.documentCasier === aArticle.typeDocument) {
      lClass = UtilitaireDocument.getIconFromFileName(aArticle.getLibelle());
    }
    H.push(
      UtilitaireUrl.construireListeUrls(lArticle.listePJ, {
        genreRessource: EGenreRessource.DocJointEleve,
        IEModelChips:
          !!lArticle.docEditable && !!lArticle.docDeposableALaDate
            ? "chipsPieceJointe"
            : "",
        argsIEModelChips: [lArticle.getNumero()],
        class: lClass,
      }),
    );
  }
  return H.join("");
}
function _avecMessageAdeposer(aArticle) {
  return (
    aArticle &&
    aArticle.docEditable &&
    aArticle.docConsultable &&
    aArticle.listePJ &&
    aArticle.listePJ.count() === 0
  );
}
module.exports = { ObjetDocumentsATelecharger };
