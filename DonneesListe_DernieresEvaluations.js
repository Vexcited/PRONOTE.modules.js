const { EGenreTriElement } = require("Enumere_TriElement.js");
const { GDate } = require("ObjetDate.js");
const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { GChaine } = require("ObjetChaine.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { tag } = require("tag.js");
class DonneesListe_DernieresEvaluations extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParamsAffichage) {
    super(aDonnees);
    this.parametres = { avecCumulMatiere: false, callbackExecutionQCM: null };
    this.setParametres(aParamsAffichage);
    this.setOptions({ avecBoutonActionLigne: false, avecDeploiement: false });
  }
  setParametres(aParams) {
    Object.assign(this.parametres, aParams);
  }
  getControleur(aDonneesListe, aListe) {
    return $.extend(true, super.getControleur(aDonneesListe, aListe), {
      afficherCorrigerQCM: {
        event: function (aNumero, aGenre) {
          if (
            !!aDonneesListe.parametres &&
            !!aDonneesListe.parametres.callbackExecutionQCM
          ) {
            if (IE.estMobile) {
              const lDevoir = aDonneesListe.Donnees.getElementParNumeroEtGenre(
                aNumero,
                aGenre,
              );
              if (lDevoir && lDevoir.executionQCM) {
                aDonneesListe.parametres.callbackExecutionQCM(
                  lDevoir.executionQCM,
                );
              }
            } else {
              aDonneesListe.parametres.callbackExecutionQCM(aNumero, aGenre);
            }
          }
        },
      },
    });
  }
  getVisible(D) {
    return this.parametres.avecCumulMatiere || !_estUneMatiere(D);
  }
  avecSelection(aParams) {
    return !_estUneMatiere(aParams.article);
  }
  avecEvenementSelectionClick(aParams) {
    return this.avecSelection(aParams);
  }
  avecEvenementSelection(aParams) {
    return this.avecSelection(aParams);
  }
  getTitreZonePrincipale(aParams) {
    const H = [];
    if (!!aParams.article) {
      if (_estUneMatiere(aParams.article)) {
        H.push(
          tag("span", { class: "ie-titre-gros" }, aParams.article.getLibelle()),
        );
      } else {
        if (
          !this.parametres.avecCumulMatiere &&
          !!aParams.article.matiere &&
          aParams.article.matiere.getLibelle() !== ""
        ) {
          H.push(tag("span", aParams.article.matiere.getLibelle()));
        }
      }
    }
    return H.join("");
  }
  getZoneGauche(aParams) {
    const H = [];
    if (!_estUneMatiere(aParams.article)) {
      const lParams = {
        class: ["date-contain"],
        datetime: GDate.formatDate(aParams.article.date, "%MM-%JJ"),
      };
      if (!this.parametres.avecCumulMatiere) {
        lParams.class.push("ie-line-color bottom");
        lParams.style = `--color-line :${aParams.article.matiere.couleur};`;
      }
      H.push(
        tag("time", lParams, GDate.formatDate(aParams.article.date, "%J %MMM")),
      );
    } else {
      H.push(
        tag("span", {
          class: "ie-line-color static only-color var-height",
          style: `--color-line :${aParams.article.couleur};--var-height:2.2rem;`,
        }),
      );
    }
    return H.join("");
  }
  getInfosSuppZonePrincipale(aParams) {
    const H = [];
    if (!_estUneMatiere(aParams.article)) {
      if (
        GEtatUtilisateur.pourPrimaire() &&
        aParams.article.coefficient === 0
      ) {
        H.push(
          tag(
            "span",
            { class: "ie-sous-titre" },
            "(" +
              GTraductions.getValeur("evaluations.NonComptabiliseDansBilan") +
              ")",
          ),
        );
      }
      H.push(_composePieceJointeEval.call(this, aParams.article));
    }
    return H.join("");
  }
  getZoneComplementaire(aParams) {
    const H = [];
    if (!_estUneMatiere(aParams.article)) {
      H.push(
        tag(
          "div",
          { class: "eval-devoir" },
          _composeNiveauxAcquisition.call(this, aParams.article),
        ),
      );
    }
    return H.join("");
  }
  getAriaLabelZoneCellule(aParams, aZone) {
    if (
      aZone ===
      ObjetDonneesListeFlatDesign.ZoneCelluleFlatDesign.zoneComplementaire
    ) {
      if (!_estUneMatiere(aParams.article)) {
        const H = [];
        if (
          aParams.article.listeNiveauxDAcquisitions &&
          aParams.article.listeNiveauxDAcquisitions.count()
        ) {
          aParams.article.listeNiveauxDAcquisitions.parcourir(
            (aNiveauDAcquisition) => {
              const lNiveauDAcquisition =
                GParametres.listeNiveauxDAcquisitions.getElementParGenre(
                  aNiveauDAcquisition.getGenre(),
                );
              H.push(
                EGenreNiveauDAcquisitionUtil.getLibelle(lNiveauDAcquisition),
              );
            },
          );
        }
        return H.join(", ");
      }
    }
    return "";
  }
  avecSeparateurLigneHautFlatdesign(aParams) {
    return !_estUneMatiere(aParams.article);
  }
  desactiverIndentationParente() {
    return true;
  }
  getTri() {
    const lTris = [];
    if (this.parametres.avecCumulMatiere) {
      lTris.push(
        ObjetTri.init((D) => {
          return _estUneMatiere(D) ? D.ordre || -1 : D.matiere.ordre || -1;
        }, EGenreTriElement.Croissant),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return _estUneMatiere(D) ? D.getLibelle() : D.matiere.getLibelle();
        }, EGenreTriElement.Croissant),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return _estUneMatiere(D)
            ? D.serviceConcerne.getNumero()
            : D.matiere.serviceConcerne.getNumero();
        }),
      );
      lTris.push(
        ObjetTri.init((D) => {
          return !_estUneMatiere(D);
        }),
      );
    }
    lTris.push(ObjetTri.init("date", EGenreTriElement.Decroissant));
    lTris.push(ObjetTri.init("matiere.Libelle"));
    return lTris;
  }
}
function _estUneMatiere(D) {
  return D.getGenre() === EGenreRessource.Matiere;
}
function _composeNiveauxAcquisition(aEval) {
  const H = [];
  let lNiveauDAcquisition;
  if (
    aEval.listeNiveauxDAcquisitions &&
    aEval.listeNiveauxDAcquisitions.count()
  ) {
    aEval.listeNiveauxDAcquisitions.parcourir((aNiveauDAcquisition) => {
      lNiveauDAcquisition =
        GParametres.listeNiveauxDAcquisitions.getElementParGenre(
          aNiveauDAcquisition.getGenre(),
        );
      H.push(
        tag("span", EGenreNiveauDAcquisitionUtil.getImage(lNiveauDAcquisition)),
      );
    });
  }
  return H.join("");
}
function _composePieceJointeEval(aEval) {
  const H = [];
  let lDocumentJointSujet, lDocumentJointCorrige, lLienSujet, lLienCorrige;
  if (!!aEval.elmSujet) {
    lDocumentJointSujet = aEval.elmSujet;
  } else if (!!aEval.libelleSujet) {
    lDocumentJointSujet = new ObjetElement(
      aEval.libelleSujet,
      aEval.getNumero(),
      EGenreDocumentJoint.Fichier,
    );
  }
  if (lDocumentJointSujet) {
    lLienSujet = GChaine.composerUrlLienExterne({
      documentJoint: lDocumentJointSujet,
      genreRessource: TypeFichierExterneHttpSco.EvaluationSujet,
      libelleEcran: GTraductions.getValeur("AfficherSujet"),
      class: "chips-design-liste",
    });
  }
  if (!!aEval.elmCorrige) {
    lDocumentJointCorrige = aEval.elmCorrige;
  } else if (!!aEval.libelleCorrige) {
    lDocumentJointCorrige = new ObjetElement(
      aEval.libelleCorrige,
      aEval.getNumero(),
      EGenreDocumentJoint.Fichier,
    );
  }
  if (lDocumentJointCorrige) {
    lLienCorrige = GChaine.composerUrlLienExterne({
      documentJoint: lDocumentJointCorrige,
      genreRessource: TypeFichierExterneHttpSco.EvaluationCorrige,
      libelleEcran: GTraductions.getValeur("AfficherCorrige"),
      class: "chips-design-liste",
    });
  }
  if (lLienSujet || lLienCorrige) {
    H.push(
      `<div class="flex-contain flex-center flex-gap m-top m-bottom">${lLienSujet || ""} ${lLienCorrige || ""}</div>`,
    );
  }
  if (
    !!aEval.executionQCM &&
    !!aEval.executionQCM.fichierDispo &&
    !!aEval.executionQCM.publierCorrige &&
    this.parametres.callbackExecutionQCM
  ) {
    H.push(
      '<ie-bouton class="themeBoutonNeutre small-bt bg-white" ie-model="afficherCorrigerQCM(\'',
      aEval.getNumero(),
      "', ",
      aEval.getGenre(),
      ')">',
      GTraductions.getValeur(
        "ExecutionQCM.presentationCorrige.VisualiserCorrige",
      ),
      "</ie-bouton>",
    );
  }
  return H.join("");
}
module.exports = { DonneesListe_DernieresEvaluations };
