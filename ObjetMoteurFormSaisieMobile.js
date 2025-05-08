exports.EGenreEvntForm = exports.ObjetMoteurFormSaisieMobile = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetFenetre_SelectionPublic_1 = require("ObjetFenetre_SelectionPublic");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetCelluleBouton_2 = require("ObjetCelluleBouton");
const tag_1 = require("tag");
const ObjetFenetre_PieceJointe = require("ObjetFenetre_PieceJointe");
const EGenreEvntForm = {
  annuler: "annuler",
  valider: "valider",
  supprimer: "supprimer",
};
exports.EGenreEvntForm = EGenreEvntForm;
class ObjetMoteurFormSaisieMobile {
  constructor() {
    this.charObligatoire = "champ-requis";
  }
  composeFormContenuEditable(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push(
      IE.jsx.str("div", {
        contenteditable: "true",
        role: "textbox",
        id: aParam.id,
        "ie-model": aParam.model,
        class: "contenteditable_index",
        "aria-label": aParam.label,
      }),
    );
    H.push("</div>");
    return H.join("");
  }
  composeFormTextArea(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push(
      `<ie-textareamax id="${aParam.id}" ie-model="${aParam.model}" ${aParam.styleArea ? `ie-style="${aParam.styleArea}"` : ""} ${aParam.placeholder ? `placeholder="${aParam.placeholder}"` : ""} ${aParam.maxLength ? `maxlength="${aParam.maxLength}"` : ""}></ie-textareamax>`,
    );
    H.push("</div>");
    return H.join("");
  }
  composeFormText(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push(
      '<input ie-ellipsis class="round-style full-size" type="text" id="',
      aParam.id,
      '" ie-model="',
      aParam.model,
      '" />',
    );
    H.push("</div>");
    return H.join("");
  }
  composeFormTexteSimple(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push('<div id="', aParam.id, '">', aParam.texteSimple, "</div>");
    H.push("</div>");
    return H.join("");
  }
  composeFormInputNote(aParam) {
    const H = [];
    H.push(
      '<div class="field-contain bareme-conteneur">',
      "<label>",
      aParam.label,
      "</label>",
      '<ie-inputnote class="input-note" ie-model="',
      aParam.model,
      '" id="',
      aParam.id,
      '" maxlength="',
      aParam.maxLength,
      '"></ie-inputnote>',
      "</div>",
    );
    return H.join("");
  }
  composeDate(aParam) {
    const H = [];
    H.push(
      '<div class="field-contain dates-contain ',
      aParam.labelUp ? "label-up" : "",
      '">',
    );
    H.push(this._composeLabel(aParam));
    H.push('<div class="date-wrapper" id="', aParam.id, '"></div>');
    H.push("</div>");
    return H.join("");
  }
  instancierCalendrier(aEvnt, aPere, aOptions) {
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleDate_1.ObjetCelluleDate,
      { pere: aPere, evenement: aEvnt.bind(aPere) },
    );
    lInstance.setOptionsObjetCelluleDate(aOptions);
    return lInstance;
  }
  composeSelecteur(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push('<div id="', aParam.id, '"></div>');
    H.push("</div>");
    return H.join("");
  }
  instancierSelecteur(aEvnt, aPere, aParam) {
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetSelection_1.ObjetSelection,
      { pere: aPere, evenement: aEvnt.bind(aPere) },
    );
    lInstance.setParametres(aParam);
    return lInstance;
  }
  updateSelecteur(aParam) {
    if (aParam.liste) {
      let lIndiceParDefaut = 0;
      const lDonnee = aParam.donnee;
      if (lDonnee !== null && lDonnee !== undefined) {
        lIndiceParDefaut = aParam.liste.getIndiceElementParFiltre((aElt) => {
          if (aParam.comparerGenre === true) {
            return aElt.getGenre() === lDonnee.getGenre();
          } else {
            return aElt.getNumero() === lDonnee.getNumero();
          }
        });
      }
      aParam.instanceSelect.setDonnees(aParam.liste, lIndiceParDefaut);
    }
  }
  composeSelecteurDuree(aParam) {
    const H = [];
    H.push('<div class="field-contain duree">');
    H.push(this._composeLabel(aParam));
    H.push(
      '<div class="selectDuree" style=" ',
      aParam.alignementDroit ? " margin-left:auto; " : "",
      '" id="',
      aParam.id,
      '"></div>',
    );
    H.push("</div>");
    return H.join("");
  }
  composeFormGestionRessources(aParam) {
    const H = [];
    if (
      aParam.avecSaisie === true ||
      (aParam.listeRessources !== null &&
        aParam.listeRessources !== undefined &&
        aParam.listeRessources.count() > 0)
    ) {
      H.push(
        `<div class="pj-global-conteneur p-all-l p-bottom-xl m-bottom-l">`,
      );
      if (aParam.avecSaisie) {
        H.push(
          `<div class="select-file ${aParam.icon}" id="${aParam.id}" ie-node="${aParam.nodeGestion}()" role="button">${aParam.label}</div>`,
        );
      } else {
        H.push(`<div class="select-file">${aParam.label}</div>`);
      }
      H.push(
        `<div id="${aParam.idListeRessources}" class="docs-joints">${this.composeHtmlListeRessources(aParam)}</div>`,
      );
      H.push(`</div>`);
    }
    return H.join("");
  }
  composeHtmlListeRessources(aParam) {
    const H = [];
    if (
      aParam.listeRessources !== null &&
      aParam.listeRessources !== undefined &&
      aParam.listeRessources.getNbrElementsExistes() > 0
    ) {
      aParam.listeRessources.parcourir((aRessource) => {
        if (aRessource.existe()) {
          H.push(
            `<ie-chips ${aParam.avecSaisie && aRessource.avecSaisie ? `ie-model="btnSupprChips(${aRessource.getGenre()}, '${aRessource.getNumero()}')" class="avec-event" ` : ""} tabindex=0 style="max-width:240px">${aRessource.getLibelle() || aRessource.url}</ie-chips>`,
          );
        }
      });
    }
    return H.join("");
  }
  updateHtmlListeRessources(aParam) {
    const lHtml = this.composeHtmlListeRessources({
      listeRessources: aParam.listeRessources,
      avecSaisie: aParam.avecSaisie,
    });
    ObjetHtml_1.GHtml.setHtml(aParam.id, lHtml, {
      controleur: aParam.controleur,
    });
  }
  openModaleSelectRessource(aParam) {
    let lAvecSaisie = false;
    const lModaleSelect = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_PieceJointe,
      {
        pere: aParam.instance,
        evenement: function (aNumeroBouton, aParamsFenetre) {
          const lListeFichiers = aParamsFenetre.instance.ListeFichiers;
          aParam.listePiecesJointes.parcourir((aDocument) => {
            if (aDocument.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun) {
              lAvecSaisie = true;
            }
            let lDocumentJoint = aParam.listePJContexte.getElementParNumero(
              aDocument.getNumero(),
            );
            const lActif = aDocument.Actif && aDocument.existe();
            if (lDocumentJoint) {
              if (
                aDocument.existe() &&
                aDocument.getEtat() === Enumere_Etat_1.EGenreEtat.Modification
              ) {
                lDocumentJoint.setLibelle(aDocument.getLibelle());
              }
              if (!lActif) {
                lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
                aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                lAvecSaisie = true;
              }
            } else {
              if (lActif) {
                lDocumentJoint = new ObjetElement_1.ObjetElement(
                  aDocument.getLibelle(),
                  aDocument.getNumero(),
                  aDocument.getGenre(),
                );
                lDocumentJoint.url = aDocument.url;
                lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
                aParam.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
                aParam.listePJContexte.addElement(lDocumentJoint);
                lAvecSaisie = true;
              }
            }
          });
          aParam.listePiecesJointes.trier();
          aParam.validation(aParamsFenetre, lListeFichiers, lAvecSaisie);
        },
        initialiser: function (aInstance) {
          aInstance.setEtatSaisie = function (aEtatSaisie) {
            if (aEtatSaisie) {
              lAvecSaisie = true;
            }
          };
          aInstance.setGenre(aParam.genre);
        },
      },
    );
    lModaleSelect.afficherFenetrePJ({
      listePJTot: aParam.listePiecesJointes,
      listePJContexte: aParam.listePJContexte,
      genreFenetrePJ: aParam.genreFenetrePJ.CahierDeTextes,
      genrePJ: aParam.genre,
      genreRessourcePJ: aParam.genreRessourceDocJoint,
      avecFiltre: { date: true, classeMatiere: true },
      listePeriodes: aParam.listePeriodes,
      dateCours: aParam.dateCoursDeb,
      optionsSelecFile: {
        maxSize: GApplication.droits.get(
          ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
        ),
      },
      modeLien: false,
      surValiderAvantFermer: null,
      validationAuto: null,
    });
  }
  composeBtnSelect(aParam) {
    const H = [];
    H.push(
      (0, tag_1.tag)(
        "div",
        {
          class:
            aParam.classConteneur !== null &&
            aParam.classConteneur !== undefined
              ? aParam.classConteneur
              : ["field-contain", aParam.labelUp ? "label-up" : ""],
        },
        this._composeLabel(aParam),
        (0, tag_1.tag)("ie-btnselecteur", {
          "ie-model": aParam.strControle,
          placeholder: aParam.placeHolder ? aParam.placeHolder : "",
          "aria-label": aParam.label,
        }),
      ),
    );
    return H.join("");
  }
  openModaleSelectPublic(aParam) {
    const lModaleSelect = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre_SelectionPublic_1.ObjetFenetre_SelectionPublic,
      {
        pere: aParam.instance,
        evenement: function (aGenre, aListe, aNumeroBouton) {
          aParam.evntClbck({
            validerSelection: aNumeroBouton === 1,
            listeRessourcesSelectionnees: aListe,
          });
        },
      },
      {
        titre: ObjetTraduction_1.GTraductions.getValeur(
          "CahierDeTexte.titreFenetreTAFEleves",
        ),
      },
    );
    lModaleSelect.setGenreCumulActif(
      ObjetFenetre_SelectionPublic_1.TypeGenreCumulSelectionPublic.classe,
    );
    lModaleSelect.setOptions({
      avecCocheRessources: true,
      selectionObligatoire: true,
      avecBarreTitre: false,
      estDeploye: true,
    });
    lModaleSelect.setDonnees({
      listeRessources: aParam.listeRessources,
      listeRessourcesSelectionnees: aParam.listeRessourcesSelectionnees,
      genreRessource: aParam.genreRessource,
      titre: aParam.titre,
    });
  }
  composeMultiSelecteurTheme(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push('<div class="on-mobile" id="', aParam.id, '"></div>');
    H.push("</div>");
    return H.join("");
  }
  instancierMultiSelecteurTheme(aEvnt, aPere) {
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
      {
        pere: aPere,
        evenement: aEvnt.bind(aPere),
        options: {
          fullWidth: true,
          placeHolder: ObjetTraduction_1.GTraductions.getValeur(
            "infosperso.ChoisirTheme",
          ),
        },
      },
    );
    return lInstance;
  }
  updateMultiSelectTheme(aParams) {
    aParams.instanceSelect.setDonnees(
      aParams.liste,
      aParams.matiere,
      aParams.libelleCB,
    );
  }
  composeCategorie(aParam) {
    const H = [];
    H.push('<div class="field-contain">');
    H.push(this._composeLabel(aParam));
    H.push('<div class="on-mobile" id="', aParam.id, '"></div>');
    H.push("</div>");
    return H.join("");
  }
  instancierSelecteurCategorie(aPere, aEvnt) {
    const lInstance = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleBouton_1.ObjetCelluleBouton,
      { pere: aPere, evenement: aEvnt.bind(aPere), options: {} },
    );
    lInstance.setOptionsObjetCelluleBouton({
      genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Points,
      estSaisissable: false,
      avecZoneSaisie: false,
      placeHolder: ObjetTraduction_1.GTraductions.getValeur(
        "FenetreCategorieEvaluation.SelectionUneCategorie",
      ),
    });
    return lInstance;
  }
  _composeLabel(aParam) {
    const H = [];
    H.push(`<label ${aParam.id ? `for="${aParam.id}"` : ""}
    ${aParam.classLabel ? `ie-class="${aParam.classLabel}"` : `class="m-bottom active ie-titre-petit ${aParam.estObligatoire === true ? this.charObligatoire : ""}"`}>${aParam.label}</label>`);
    return H.join("");
  }
}
exports.ObjetMoteurFormSaisieMobile = ObjetMoteurFormSaisieMobile;
