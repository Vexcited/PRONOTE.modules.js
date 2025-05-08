exports.TransformationFlux =
  exports.TypeAuditFichier =
  exports.TypeResultatAnalyseTranformationFlux =
  exports.TypeEtapeTransformationFlux =
    void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_FormatDocJoint_1 = require("Enumere_FormatDocJoint");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Invocateur_1 = require("Invocateur");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetJSON_1 = require("ObjetJSON");
const tag_1 = require("tag");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const UploadFileAjax_1 = require("UploadFileAjax");
const MethodesObjet_1 = require("MethodesObjet");
var TypeEtapeTransformationFlux;
(function (TypeEtapeTransformationFlux) {
  TypeEtapeTransformationFlux[
    (TypeEtapeTransformationFlux["ETF_AnalyseInitiale"] = 0)
  ] = "ETF_AnalyseInitiale";
  TypeEtapeTransformationFlux[
    (TypeEtapeTransformationFlux["ETF_AnalyseTransforme"] = 1)
  ] = "ETF_AnalyseTransforme";
  TypeEtapeTransformationFlux[
    (TypeEtapeTransformationFlux["ETF_DemandeJWT"] = 2)
  ] = "ETF_DemandeJWT";
})(
  TypeEtapeTransformationFlux ||
    (exports.TypeEtapeTransformationFlux = TypeEtapeTransformationFlux = {}),
);
var TypeResultatAnalyseTranformationFlux;
(function (TypeResultatAnalyseTranformationFlux) {
  TypeResultatAnalyseTranformationFlux[
    (TypeResultatAnalyseTranformationFlux["RATF_NonConcerne"] = 0)
  ] = "RATF_NonConcerne";
  TypeResultatAnalyseTranformationFlux[
    (TypeResultatAnalyseTranformationFlux["RATF_ConcerneNonApplicable"] = 1)
  ] = "RATF_ConcerneNonApplicable";
  TypeResultatAnalyseTranformationFlux[
    (TypeResultatAnalyseTranformationFlux["RATF_ConcerneApplicable"] = 2)
  ] = "RATF_ConcerneApplicable";
})(
  TypeResultatAnalyseTranformationFlux ||
    (exports.TypeResultatAnalyseTranformationFlux =
      TypeResultatAnalyseTranformationFlux =
        {}),
);
var TypeAuditFichier;
(function (TypeAuditFichier) {
  TypeAuditFichier[(TypeAuditFichier["AF_OriginalTransferable"] = 0)] =
    "AF_OriginalTransferable";
  TypeAuditFichier[(TypeAuditFichier["AF_TransformationsPossible"] = 1)] =
    "AF_TransformationsPossible";
})(TypeAuditFichier || (exports.TypeAuditFichier = TypeAuditFichier = {}));
const C_IdentifiantFluxIdentite = "TF_Identite";
const C_IdentifiantCompressionPdf = "TF_CompressionPdf";
const C_IdentifiantConversionEnPdf = "TF_ConversionEnPdf";
const C_IdentifiantConversionEnPdfCompresse = "TF_ConversionEnPdfCompresse";
var TypeDestinataireFichiers;
(function (TypeDestinataireFichiers) {
  TypeDestinataireFichiers["produit"] = "produit";
  TypeDestinataireFichiers["cloud"] = "cloud";
})(TypeDestinataireFichiers || (TypeDestinataireFichiers = {}));
class TransformationFlux {
  constructor(aOptions) {
    this.options = Object.assign(
      {
        pere: null,
        traiterFichiersClouds: null,
        getActif: null,
        setActif: null,
      },
      aOptions,
    );
  }
  async transformationFluxPromise(aListeFichiers, aOptionsSelecFile) {
    if (aListeFichiers && aListeFichiers.count() > 0) {
      const lFichiers = [];
      aListeFichiers.parcourir((aFichier) => {
        lFichiers.push({
          nom: aFichier.getLibelle(),
          taille: aFichier.file.size,
        });
      });
      return new ObjetRequeteTransformationFlux(this.options.pere)
        .lancerRequete({
          etape: TypeEtapeTransformationFlux.ETF_AnalyseInitiale,
          fichiers: lFichiers,
          tailleMax: aOptionsSelecFile.maxSize,
        })
        .then((aJSONReponse) => {
          if (aJSONReponse.fichiers && aJSONReponse.fichiers.length > 0) {
            if (!aJSONReponse.urlAPI) {
              return;
            }
            return this._ouvrirFenetreTransformationFluxPromise(
              aListeFichiers,
              aOptionsSelecFile,
              aJSONReponse,
            );
          }
        })
        .catch((aError) => {});
    }
    return Promise.resolve();
  }
  getActif() {
    if (this.options.getActif) {
      return this.options.getActif();
    }
    return false;
  }
  setActif(aActif) {
    if (this.options.setActif) {
      return this.options.setActif(aActif);
    }
  }
  async _ouvrirFenetreTransformationFluxPromise(
    aListeFichiers,
    aOptionsSelecFile,
    aJSONReponse,
  ) {
    const lListeCloudsDisponibles = GEtatUtilisateur.listeCloud;
    const lAvecCloudDisponible = !!(
      aOptionsSelecFile.avecTransformationFlux_versCloud &&
      this.options.traiterFichiersClouds &&
      lListeCloudsDisponibles &&
      lListeCloudsDisponibles.count() > 0
    );
    const lListeFichiers = new ObjetListeElements_1.ObjetListeElements().add(
      aListeFichiers,
    );
    return ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_Transformationflux,
      {
        pere: this.options.pere,
        initialiser: (aFenetre) => {
          aFenetre.init(aJSONReponse.fichiers, lListeFichiers);
          aFenetre.setOptionsFenetre({
            urlAPI: aJSONReponse.urlAPI,
            avecCloudDisponible: lAvecCloudDisponible,
            optionsTransfo: this.options,
            maxSize: aOptionsSelecFile.maxSize,
          });
        },
      },
    )
      .afficher()
      .then((aResultFenetreTransfo) => {
        aListeFichiers.vider();
        if (aResultFenetreTransfo.ok) {
          aListeFichiers.add(aResultFenetreTransfo.listeFichiers);
          if (
            lAvecCloudDisponible &&
            aResultFenetreTransfo.listeFichiersUploadCloud.count() > 0
          ) {
            return this.options.traiterFichiersClouds(
              aListeFichiers,
              aResultFenetreTransfo,
            );
          }
        }
      });
  }
}
exports.TransformationFlux = TransformationFlux;
class ObjetRequeteTransformationFlux extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
  "TransformationFlux",
  ObjetRequeteTransformationFlux,
);
class ObjetFenetre_Transformationflux extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "TransformationFlux.OptimisationPJ",
      ),
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        {
          estValider: true,
          theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
        },
      ],
      avecScroll: true,
      hauteurMaxContenu: Math.max(200, GNavigateur.clientH - 400),
    });
    this._uneTransfoFaite = false;
  }
  init(aFichiers, aListeFichiers) {
    this.fichiers = aFichiers;
    this.fichiers.forEach((aFichier, aIndex) => {
      const lFichierOrigine = aListeFichiers.get(aIndex);
      aFichier.element = lFichierOrigine;
      aFichier.file = lFichierOrigine.file;
      const lTypeDest = TypeDestinataireFichiers.produit;
      aFichier.choixDestinataire = lTypeDest;
      aFichier.backupTransformation = {};
      this._initIdentifiantTransfoFichier(aFichier);
    });
    this.listeFichiersOrigine = aListeFichiers;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      fenetreBtn: {
        getLibelle(aBoutonRepeat) {
          if (!aBoutonRepeat.element.estValider) {
            return aBoutonRepeat.element.libelle;
          }
          return aInstance._avecTransformationNecessaire() &&
            !aInstance._uneTransfoFaite
            ? ObjetTraduction_1.GTraductions.getValeur("Suivant")
            : ObjetTraduction_1.GTraductions.getValeur(
                "TransformationFlux.JoindreDocuments_S",
                [aInstance._getTabFichiersOK().length],
              );
        },
        getDisabled(aBoutonRepeat) {
          if (!aBoutonRepeat.element.estValider) {
            return false;
          }
          if (aInstance._avecTransformationNecessaire()) {
            return false;
          }
          return aInstance._getTabFichiersOK().length === 0;
        },
      },
      cbActivationTransformationFlux: {
        getValue() {
          return !aInstance.optionsFenetre.optionsTransfo.getActif();
        },
        setValue(aValue) {
          aInstance.optionsFenetre.optionsTransfo.setActif(!aValue);
        },
      },
      chipsOrigine: {
        eventBtn(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          GApplication.getMessage()
            .afficher({
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
              message: ObjetTraduction_1.GTraductions.getValeur(
                "selecteurPJ.msgConfirmPJ",
                [lFichier.nom],
              ),
            })
            .then((aAccepte) => {
              if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
                aInstance.fichiers.splice(aIndexFichier, 1);
                if (aInstance.fichiers.length === 0) {
                  aInstance.fermer();
                } else {
                  aInstance._actualiser();
                }
              }
            });
        },
        node(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          if (lFichier) {
            lFichier.urlBlob = URL.createObjectURL(lFichier.file);
            this.node.href = lFichier.urlBlob;
            $(this.node).on("destroyed", () => {
              URL.revokeObjectURL(lFichier.urlBlob);
            });
          }
        },
        getDisabled(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          return !lFichier || !!lFichier.avecTransformation;
        },
      },
      chipsErreur: {
        eventBtn(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          lFichier.avecTransformation = null;
          aInstance._initIdentifiantTransfoFichier(lFichier);
        },
      },
      chipsTransfo: {
        eventBtn(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          lFichier.avecTransformation = null;
          aInstance._initIdentifiantTransfoFichier(lFichier);
        },
        node(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          if (lFichier) {
            lFichier.urlBlobTransfo = URL.createObjectURL(
              lFichier.avecTransformation.file,
            );
            this.node.href = lFichier.urlBlobTransfo;
            $(this.node).on("destroyed", () => {
              URL.revokeObjectURL(lFichier.urlBlobTransfo);
            });
          }
        },
      },
      cbCloud: {
        getValue(aIndexFichier) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          return lFichier.choixDestinataire === TypeDestinataireFichiers.cloud;
        },
        setValue(aIndexFichier, aValue) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          lFichier.choixDestinataire = aValue
            ? TypeDestinataireFichiers.cloud
            : TypeDestinataireFichiers.produit;
          const lBackupTransformation =
            lFichier.backupTransformation[lFichier.identifiantTransfo];
          if (
            lBackupTransformation &&
            lBackupTransformation.analyseOK &&
            lBackupTransformation.file &&
            lBackupTransformation.resultatTransformation &&
            lBackupTransformation.resultatTransformation[
              lFichier.choixDestinataire
            ]
          ) {
            return;
          }
          lFichier.avecTransformation = null;
          aInstance._initIdentifiantTransfoFichier(lFichier);
        },
      },
      htmlChoixFichier(aIndexFichier) {
        return aInstance._construireChoixDeFichier(aIndexFichier);
      },
      rbChoixTransfoFichier: {
        getValue(aIndexFichier, aIndexProduit, aIdentifiant) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          return lFichier.identifiantTransfo === aIdentifiant;
        },
        setValue(aIndexFichier, aIndexProduit, aIdentifiant) {
          const lFichier = aInstance.fichiers[aIndexFichier];
          lFichier.identifiantTransfo = aIdentifiant;
          if (aInstance._uneTransfoFaite) {
            aInstance._transformationFichiers();
          }
        },
      },
    });
  }
  composeContenu() {
    return this._construireContenu();
  }
  getParametresValidation(aNumeroBouton) {
    const lParametres = super.getParametresValidation(aNumeroBouton);
    if (lParametres.bouton && lParametres.bouton.estValider) {
      if (this._avecTransformationNecessaire()) {
        lParametres.avecTransfo = true;
      } else {
        lParametres.ok = true;
        lParametres.listeFichiers =
          new ObjetListeElements_1.ObjetListeElements();
        lParametres.listeFichiersUploadCloud =
          new ObjetListeElements_1.ObjetListeElements();
        for (const lFichier of this._getTabFichiersOK()) {
          if (
            lFichier.avecTransformation &&
            lFichier.avecTransformation.analyseOK &&
            lFichier.avecTransformation.file
          ) {
            Object.assign(lFichier.element, {
              file: lFichier.avecTransformation.file,
              Libelle: lFichier.avecTransformation.libelle,
            });
          }
          if (lFichier.choixDestinataire === TypeDestinataireFichiers.cloud) {
            lParametres.listeFichiersUploadCloud.add(lFichier.element);
          } else {
            lParametres.listeFichiers.add(lFichier.element);
          }
        }
      }
    }
    return lParametres;
  }
  composeBas() {
    return (0, tag_1.tag)(
      "ie-checkbox",
      { "ie-model": "cbActivationTransformationFlux" },
      ObjetTraduction_1.GTraductions.getValeur("DesactiverCompressionAutoPDF"),
    );
  }
  surValidation(aNumeroBouton) {
    const lParams = this.getParametresValidation(aNumeroBouton);
    if (lParams.avecTransfo) {
      this._transformationFichiers();
      return;
    }
    this.promiseResolve(lParams);
    this.fermer();
  }
  _actualiser() {
    ObjetHtml_1.GHtml.setHtml(this.IdContenu, this._construireContenu(), {
      controleur: this.controleur,
    });
  }
  _construireContenu() {
    return [
      (0, tag_1.tag)("div", (aTab) => {
        aTab.push(
          (0, tag_1.tag)(
            "div",
            { class: "legende ie-titre-petit" },
            ObjetTraduction_1.GTraductions.getValeur(
              "TransformationFlux.Legende",
            ),
          ),
        );
        this.fichiers.forEach((aFichier, aIndexFichier) => {
          const lClasseIcone = this._getIconeFichier(aFichier.nom);
          aTab.push(
            (0, tag_1.tag)(
              "div",
              { class: "file" },
              (0, tag_1.tag)(
                "div",
                { class: "entete" },
                (0, tag_1.tag)(
                  "ie-chips",
                  {
                    href: "bidon",
                    target: "_blank",
                    class: lClasseIcone ? ["iconic", lClasseIcone] : false,
                    "ie-model": tag_1.tag.funcAttr(
                      "chipsOrigine",
                      aIndexFichier,
                    ),
                  },
                  aFichier.nom,
                ),
                (0, tag_1.tag)(
                  "span",
                  { class: "file-size" },
                  ObjetChaine_1.GChaine.tailleOctetsToStr(aFichier.file.size),
                ),
              ),
              (0, tag_1.tag)("div", {
                "ie-html": tag_1.tag.funcAttr(
                  "htmlChoixFichier",
                  aIndexFichier,
                ),
              }),
              this.optionsFenetre.avecCloudDisponible
                ? (0, tag_1.tag)(
                    "ie-checkbox",
                    {
                      "ie-model": tag_1.tag.funcAttr("cbCloud", aIndexFichier),
                      "ie-textleft": true,
                      class: "cb-cloud",
                    },
                    `${ObjetTraduction_1.GTraductions.getValeur("TransformationFlux.ChoixCloud")}  ${(0, tag_1.tag)("i", { class: "icon_cloud" })}`,
                  )
                : "",
            ),
          );
        });
      }),
    ].join("");
  }
  _construireChoixDeFichier(aIndexFichier) {
    const lFichier = this.fichiers[aIndexFichier];
    const H = [];
    if (lFichier.avecTransformation) {
      if (lFichier.avecTransformation.ok) {
        const lClasseIcone = this._getIconeFichier(
          lFichier.avecTransformation.libelle,
        );
        H.push(
          (0, tag_1.tag)(
            "div",
            { class: "fleche-transfo" },
            (0, tag_1.tag)("i", { class: "icon_fleche_droite" }),
          ),
          (0, tag_1.tag)(
            "div",
            { class: "transfo-chips" },
            (0, tag_1.tag)(
              "ie-chips",
              {
                href: "bidon",
                target: "_blank",
                class: lClasseIcone ? ["iconic", lClasseIcone] : false,
                "ie-model": tag_1.tag.funcAttr("chipsTransfo", aIndexFichier),
              },
              lFichier.avecTransformation.libelle,
            ),
            (0, tag_1.tag)(
              "span",
              { class: "file-size" },
              ObjetChaine_1.GChaine.tailleOctetsToStr(
                lFichier.avecTransformation.file.size,
              ),
            ),
          ),
        );
      } else {
        const lClasseIcone = this._getIconeFichier(lFichier.nom);
        H.push(
          (0, tag_1.tag)(
            "div",
            { class: "fleche-transfo" },
            (0, tag_1.tag)("i", { class: "icon_fleche_droite" }),
          ),
          (0, tag_1.tag)(
            "div",
            { class: "transfo-chips" },
            (0, tag_1.tag)(
              "ie-chips",
              {
                class: lClasseIcone ? ["iconic", lClasseIcone] : false,
                "ie-model": tag_1.tag.funcAttr("chipsErreur", aIndexFichier),
              },
              lFichier.nom,
            ),
          ),
        );
        H.push(
          (0, tag_1.tag)(
            "div",
            { class: "errors" },
            (0, tag_1.tag)("i", { class: "icon_warning_sign" }),
            (0, tag_1.tag)("ul", (aTab) => {
              if (
                lFichier.avecTransformation.errors &&
                lFichier.avecTransformation.errors.length > 0
              ) {
                lFichier.avecTransformation.errors.forEach((aElement) => {
                  aTab.push((0, tag_1.tag)("li", aElement.message));
                });
              }
            }),
          ),
        );
      }
      return H.join("");
    }
    const lApplicables =
      lFichier.transformateursApplicables[lFichier.choixDestinataire];
    if (lApplicables.length > 0) {
      return (0, tag_1.tag)("div", { class: "choix" }, (aTab) => {
        lApplicables.forEach((aProduit, aIndexProduit) => {
          aTab.push(
            (0, tag_1.tag)(
              "ie-radio",
              {
                "ie-model": tag_1.tag.funcAttr("rbChoixTransfoFichier", [
                  aIndexFichier,
                  aIndexProduit,
                  aProduit.identifiant,
                ]),
                name: `produit-${aIndexFichier}`,
              },
              (0, tag_1.tag)("span", aProduit.description),
              aProduit.suggestion
                ? (0, tag_1.tag)("br") +
                    (0, tag_1.tag)(
                      "span",
                      { class: "suggestion" },
                      aProduit.suggestion.replaceRCToHTML(),
                    )
                : "",
            ),
            (0, tag_1.tag)("br"),
          );
        });
      });
    }
    return (0, tag_1.tag)(
      "div",
      { class: "errors" },
      (0, tag_1.tag)("i", { class: "icon_warning_sign" }),
      (0, tag_1.tag)(
        "div",
        (0, tag_1.tag)("ul", (aTab) => {
          lFichier.transformateursNonApplicables[
            lFichier.choixDestinataire
          ].forEach((aElement) => {
            aTab.push((0, tag_1.tag)("li", aElement.explication));
          });
        }),
        () => {
          let lHtml = "";
          if (
            lFichier.audits &&
            lFichier.audits[lFichier.choixDestinataire] &&
            lFichier.audits[lFichier.choixDestinataire][0] ===
              TypeAuditFichier.AF_OriginalTransferable
          ) {
            lHtml = ObjetTraduction_1.GTraductions.getValeur(
              "TransformationFlux.FichierOriginalTransferable",
            );
          } else if (this.optionsFenetre.avecCloudDisponible) {
            if (
              lFichier.faisabiliteTransfertCloud &&
              lFichier.faisabiliteTransfertCloud.possible
            ) {
              lHtml = ObjetTraduction_1.GTraductions.getValeur(
                "TransformationFlux.PropositionCibleCloud_S",
                [(0, tag_1.tag)("i", { class: "icon_cloud" })],
              );
            } else if (
              lFichier.faisabiliteTransfertCloud &&
              lFichier.faisabiliteTransfertCloud.explication
            ) {
              lHtml = lFichier.faisabiliteTransfertCloud.explication;
            }
          }
          return lHtml
            ? (0, tag_1.tag)("div", { class: "rapport" }, lHtml)
            : "";
        },
      ),
    );
  }
  _getIconeFichier(aNomFichier) {
    let lClasseIcone = "";
    const lGenreFichier =
      Enumere_FormatDocJoint_1.EFormatDocJointUtil.getGenreDeFichier(
        ObjetChaine_1.GChaine.extraireExtensionFichier(aNomFichier),
      );
    if (lGenreFichier !== Enumere_FormatDocJoint_1.EFormatDocJoint.Inconnu) {
      lClasseIcone =
        Enumere_FormatDocJoint_1.EFormatDocJointUtil.getClassIconDeGenre(
          lGenreFichier,
        );
    }
    return lClasseIcone;
  }
  _initIdentifiantTransfoFichier(aFichier) {
    aFichier.identifiantTransfo = null;
    const lChoixDest = aFichier.choixDestinataire;
    if (
      aFichier.transformateursApplicables &&
      aFichier.transformateursApplicables[lChoixDest] &&
      aFichier.transformateursApplicables[lChoixDest].length > 0
    ) {
      for (const lTransfo of aFichier.transformateursApplicables[lChoixDest]) {
        if (lTransfo.identifiant === C_IdentifiantFluxIdentite) {
          aFichier.identifiantTransfo = C_IdentifiantFluxIdentite;
          return;
        }
      }
    }
  }
  _avecTransformationNecessaire() {
    return this._getFichiersAvecTransformation().length;
  }
  _getTabFichiersOK() {
    const lResult = [];
    for (const lFichier of this.fichiers) {
      if (
        lFichier.avecTransformation &&
        lFichier.avecTransformation.analyseOK &&
        lFichier.avecTransformation.file
      ) {
        lResult.push(lFichier);
      } else if (
        lFichier.transformateursApplicables[lFichier.choixDestinataire].length >
          0 &&
        lFichier.identifiantTransfo === C_IdentifiantFluxIdentite
      ) {
        lResult.push(lFichier);
      }
    }
    return lResult;
  }
  _getFichiersAvecTransformation(aAvecRestaurationTransfo) {
    const lResult = [];
    for (const lFichier of this.fichiers) {
      const lTransfo =
        lFichier.transformateursApplicables[lFichier.choixDestinataire];
      if (
        aAvecRestaurationTransfo &&
        lFichier.backupTransformation[lFichier.identifiantTransfo]
      ) {
        lFichier.avecTransformation =
          lFichier.backupTransformation[lFichier.identifiantTransfo];
      }
      if (
        lTransfo.length > 0 &&
        !lFichier.avecTransformation &&
        [
          C_IdentifiantCompressionPdf,
          C_IdentifiantConversionEnPdf,
          C_IdentifiantConversionEnPdfCompresse,
        ].includes(lFichier.identifiantTransfo)
      ) {
        lResult.push(lFichier);
      }
    }
    return lResult;
  }
  _transformationFichiers() {
    const lFichiersATransformer = this._getFichiersAvecTransformation(true);
    if (lFichiersATransformer.length === 0) {
      return;
    }
    this._uneTransfoFaite = true;
    return new ObjetRequeteTransformationFlux(this)
      .lancerRequete({ etape: TypeEtapeTransformationFlux.ETF_DemandeJWT })
      .then((aJSONReponse) => {
        return this._transformationFichierPromise({
          jeton: aJSONReponse.jwt,
          fichiers: lFichiersATransformer,
        });
      })
      .then(() => {
        const lFichiersJSON = [];
        for (const lFichier of this.fichiers) {
          if (lFichier.avecTransformation && lFichier.avecTransformation.ok) {
            lFichiersJSON.push({
              nom: lFichier.nom,
              taille: lFichier.avecTransformation.file.size,
              identifiant: lFichier.identifiantTransfo,
            });
          }
        }
        if (lFichiersJSON.length > 0) {
          return new ObjetRequeteTransformationFlux(this)
            .lancerRequete({
              etape: TypeEtapeTransformationFlux.ETF_AnalyseTransforme,
              fichiers: lFichiersJSON,
              tailleMax: this.optionsFenetre.maxSize,
            })
            .then((aJSON) => {
              let lIndex = 0;
              for (const lFichier of this.fichiers) {
                if (
                  lFichier.avecTransformation &&
                  lFichier.avecTransformation.ok
                ) {
                  const lTrouve = aJSON.fichiers[lIndex];
                  let lResultat =
                    lTrouve && lTrouve.resultatTransformation
                      ? lTrouve.resultatTransformation[
                          lFichier.choixDestinataire
                        ]
                      : null;
                  lFichier.avecTransformation.resultatTransformation = lTrouve
                    ? lTrouve.resultatTransformation
                    : null;
                  if (lResultat && lResultat.resultat) {
                    lFichier.avecTransformation.analyseOK = true;
                  } else {
                    lFichier.avecTransformation = { error: true };
                    if (lResultat && lResultat.explication) {
                      lFichier.avecTransformation.errors = [
                        { message: lResultat.explication },
                      ];
                    }
                  }
                  lFichier.backupTransformation[lFichier.identifiantTransfo] =
                    lFichier.avecTransformation;
                  lIndex += 1;
                }
              }
            });
        }
      });
  }
  async _transformationFichierPromise(aParams) {
    if (aParams.fichiers.length === 0) {
      return Promise.resolve(true);
    }
    if (!aParams.jeton) {
      throw "jeton manquant";
    }
    const lFichier = aParams.fichiers.shift();
    if (!lFichier) {
      return this._transformationFichierPromise(aParams);
    }
    lFichier.avecTransformation = null;
    this.$refreshSelf();
    let lFuncAbortRequete = null;
    Invocateur_1.Invocateur.evenement(
      Invocateur_1.ObjetInvocateur.events.eventIOAjax,
      {
        emission: true,
        upload: false,
        message: ObjetTraduction_1.GTraductions.getValeur(
          "TransformationFlux.TraitementDe_S",
          [lFichier.nom],
        ),
        params: {
          htmlPied: (0, tag_1.tag)(
            "ie-bouton",
            { "ie-model": "btnInterrupt" },
            ObjetTraduction_1.GTraductions.getValeur(
              "TransformationFlux.AnnulerTraitement",
            ),
          ),
          controleur: {
            btnInterrupt: {
              event: function () {
                if (lFuncAbortRequete) {
                  lFuncAbortRequete();
                }
              },
              getDisabled: function () {
                return !lFuncAbortRequete;
              },
            },
          },
        },
      },
    );
    let lUrl;
    let lCallbackFormData = null;
    if (lFichier.identifiantTransfo === C_IdentifiantCompressionPdf) {
      lUrl = `${this.optionsFenetre.urlAPI}/optimize`;
    } else {
      lUrl = `${this.optionsFenetre.urlAPI}/convert`;
      lCallbackFormData = (aFormData, aFile) => {
        aFormData.append("file", aFile, lFichier.file.name);
        aFormData.append(
          "optimize",
          lFichier.identifiantTransfo === C_IdentifiantConversionEnPdfCompresse
            ? "true"
            : "false",
        );
      };
    }
    return UploadFileAjax_1.UploadFileAjax.sendPromise({
      url: lUrl,
      file: lFichier.file,
      remplisseurFormData: lCallbackFormData,
      remplisseurHeaders: (aRequete) => {
        aRequete.setRequestHeader("Authorization", `Bearer ${aParams.jeton}`);
        if (lFichier.identifiantTransfo === C_IdentifiantCompressionPdf) {
          aRequete.setRequestHeader("Content-Type", `application/pdf`);
        }
        if (lFichier.identifiantTransfo === C_IdentifiantConversionEnPdf) {
          aRequete.setRequestHeader("X-INDEX-NOPDFCOMPRESSION", `true`);
        }
      },
      responseType: "blob",
      maxChunkSize: 0,
      fournisseurAbort(aAbortRequete) {
        lFuncAbortRequete = aAbortRequete;
      },
    })
      .catch((aResult) => {
        return aResult;
      })
      .then((aResult) => {
        if (aResult && aResult.done && aResult.response) {
          let lNomFichier = lFichier.nom;
          if (lFichier.identifiantTransfo !== C_IdentifiantCompressionPdf) {
            lNomFichier = `${ObjetChaine_1.GChaine.extraireNomFichier(lNomFichier)}.pdf`;
          }
          lFichier.avecTransformation = {
            ok: true,
            analyseOK: false,
            file: aResult.response,
            libelle: lNomFichier,
          };
          return;
        }
        lFichier.avecTransformation = { error: true };
        if (aResult && aResult.response && aResult.response.size > 0) {
          return _readerBlobToJSON_promise(aResult.response)
            .then((aJSON) => {
              if (aJSON) {
                Object.assign(lFichier.avecTransformation, aJSON);
              }
            })
            .catch(() => {});
        }
        lFichier.avecTransformation.errors = [
          {
            message:
              aResult && aResult.isAborted
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "TransformationFlux.InterruptionTraitement",
                  )
                : `${ObjetTraduction_1.GTraductions.getValeur("requete.erreur")} (${MethodesObjet_1.MethodesObjet.isNumber(aResult.statut) ? aResult.statut : "inconnu"})`,
          },
        ];
      })
      .finally(() => {
        Invocateur_1.Invocateur.evenement(
          Invocateur_1.ObjetInvocateur.events.eventIOAjax,
          { emission: false },
        );
        this.$refreshSelf();
        return this._transformationFichierPromise(aParams);
      });
  }
}
function _readerBlobToJSON_promise(aBlob) {
  return new Promise((aResolve) => {
    const lReader = new FileReader();
    lReader.onloadend = function (e) {
      if (e.target.readyState === FileReader.DONE) {
        const lJSON = ObjetJSON_1.ObjetJSON.parseJSON(e.target.result);
        aResolve(lJSON);
      }
    };
    lReader.onerror = function () {
      aResolve();
    };
    lReader.onabort = function () {
      aResolve();
    };
    lReader.readAsText(aBlob);
  });
}
