const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  EGenreNiveauDAcquisition,
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_BilanParDomaine extends ObjetDonneesListe {
  constructor(aDonnees, aParametres) {
    super(aDonnees);
    this.parametres = Object.assign(
      { callbackInitMenuContextuel: null },
      aParametres,
    );
    this.setOptions({
      avecSuppression: false,
      avecDeploiement: true,
      avecTri: false,
      avecEvnt_KeyUpListe: true,
      editionApresSelection: false,
      avecSelectionSurNavigationClavier: true,
    });
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BilanParDomaine.colonnes.items:
        return (
          aParams.article.getLibelle() +
          (!!aParams.article.libelleCorrige
            ? " - ( " +
              GChaine.composerUrlLienExterne({
                libelle: aParams.article.libelleCorrige,
                documentJoint: aParams.article,
                title: GTraductions.getValeur("AfficherCorrige"),
              }) +
              " )"
            : "")
        );
      case DonneesListe_BilanParDomaine.colonnes.coefficient:
        return !!aParams.article.coeff || aParams.article.coeff === 0
          ? aParams.article.coeff
          : "";
      case DonneesListe_BilanParDomaine.colonnes.niveau: {
        const lHtml = [];
        if (
          !!aParams.article.niveauDAcquisition &&
          aParams.article.niveauDAcquisition.getGenre() ===
            EGenreNiveauDAcquisition.Multiple
        ) {
          lHtml.push(GTraductions.getValeur("Multiple"));
        } else if (!!aParams.article.niveauDAcquisition) {
          const lNiveauDAcquisition =
            GParametres.listeNiveauxDAcquisitions.getElementParNumero(
              aParams.article.niveauDAcquisition.getNumero(),
            );
          lHtml.push(
            EGenreNiveauDAcquisitionUtil.getImage(lNiveauDAcquisition, {
              avecTitle: false,
            }),
          );
        }
        if (aParams.article.observation) {
          lHtml.push(
            '<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment"></i>',
          );
        } else if (aParams.article.avecVerrou) {
          lHtml.push(
            '<div class="Image_VerrouNoirPetit" style="position:absolute; right:0; bottom:-1px;"></div>',
          );
        }
        return lHtml.join("");
      }
      case DonneesListe_BilanParDomaine.colonnes.valider:
        return !!aParams.article.estUneDateValidationMultiple
          ? GTraductions.getValeur("Multiple")
          : avecAffichageDeLaDate(aParams.article) &&
              !!aParams.article.dateValidation
            ? GDate.formatDate(aParams.article.dateValidation, "%JJ/%MM/%AAAA")
            : "";
    }
    return "";
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BilanParDomaine.colonnes.items:
        return aParams.article.libelleLong ? aParams.article.libelleLong : "";
      case DonneesListe_BilanParDomaine.colonnes.valider:
        return avecAffichageDeLaDate(aParams.article) &&
          !!aParams.article.dateValidation &&
          !!aParams.article.strIndividuValidation
          ? GChaine.format("%s %s\n%s", [
              GTraductions.getValeur("competences.ValidePar"),
              aParams.article.strIndividuValidation,
              GDate.formatDate(aParams.article.dateValidation, "%JJ/%MM/%AAAA"),
            ])
          : "";
    }
  }
  getHintHtmlForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BilanParDomaine.colonnes.niveau: {
        const lHintNiveauAcquisition = [];
        if (
          !!aParams.article.niveauDAcquisition &&
          aParams.article.niveauDAcquisition.getGenre() !==
            EGenreNiveauDAcquisition.Multiple
        ) {
          lHintNiveauAcquisition.push(
            EGenreNiveauDAcquisitionUtil.getLibelle(
              aParams.article.niveauDAcquisition,
            ),
          );
          if (!!aParams.article.observation) {
            const lObs = aParams.article.observation.replace(/\n/g, "<br/>");
            lHintNiveauAcquisition.push("<br>", lObs);
            if (!!aParams.article.observationPubliee) {
              lHintNiveauAcquisition.push(
                " (",
                GTraductions.getValeur("competences.PublieSurEspaceParent"),
                ")",
              );
            }
          }
        }
        return lHintNiveauAcquisition.join("");
      }
      case DonneesListe_BilanParDomaine.colonnes.coefficient:
        return aParams.article.hintCoeff || "";
    }
    return null;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BilanParDomaine.colonnes.items:
      case DonneesListe_BilanParDomaine.colonnes.niveau:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BilanParDomaine.colonnes.niveau:
        return !!aParams.article.niveauEstEditable;
      case DonneesListe_BilanParDomaine.colonnes.valider: {
        let estDateEditable = false;
        if (!!aParams.article.dateEstEditable) {
          const lNiveauAcqui = aParams.article.niveauDAcquisition;
          if (!!lNiveauAcqui) {
            estDateEditable =
              TUtilitaireCompetences.estNiveauAcqui(lNiveauAcqui);
          }
        }
        return estDateEditable;
      }
    }
    return false;
  }
  avecEvenementEdition(aParams) {
    return this.avecEdition(aParams);
  }
  getClass(aParams) {
    const lClass = [];
    if (aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.niveau) {
      lClass.push("AlignementMilieu");
    } else if (
      aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.coefficient
    ) {
      lClass.push("AlignementDroit");
    }
    if (aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items) {
      if (
        aParams.article.getGenre() === EGenreRessource.ElementPilier ||
        aParams.article.getGenre() === EGenreRessource.MetaMatiere
      ) {
        lClass.push("Gras");
      }
      if (aParams.article.estUnDeploiement) {
        lClass.push("AvecMain");
      }
    }
    if (
      aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items ||
      aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.valider
    ) {
      if (aParams.article.getGenre() === EGenreRessource.EvaluationHistorique) {
        lClass.push("Italique");
      }
    }
    return lClass.join(" ");
  }
  avecImageSurColonneDeploiement(aParams) {
    return (
      aParams.article.estUnDeploiement &&
      aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items
    );
  }
  avecDeploiementSurColonne(aParams) {
    return aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items;
  }
  getCouleurCellule(aParams) {
    if (this.avecEdition(aParams)) {
      return ObjetDonneesListe.ECouleurCellule.Blanc;
    }
    if (!!aParams.article) {
      switch (aParams.article.getGenre()) {
        case EGenreRessource.MetaMatiere:
          return GCouleur.liste.cumul[0];
        case EGenreRessource.ElementPilier:
          return GCouleur.liste.cumul[1];
        case EGenreRessource.Competence:
        case EGenreRessource.SousItem:
          return GCouleur.liste.cumul[2];
        case EGenreRessource.Evaluation:
        case EGenreRessource.EvaluationHistorique:
          return GCouleur.liste.cumul[3];
      }
    }
    return GCouleur.liste.colonneFixe;
  }
  getIndentationCellule(aParams) {
    if (aParams.idColonne === DonneesListe_BilanParDomaine.colonnes.items) {
      return this.getIndentationCelluleSelonParente(aParams);
    }
    return 0;
  }
  avecMenuContextuel(aParams) {
    return !!aParams.article && !!this.parametres.callbackInitMenuContextuel;
  }
  remplirMenuContextuel(aParametres) {
    this.parametres.callbackInitMenuContextuel(aParametres);
  }
}
DonneesListe_BilanParDomaine.colonnes = {
  items: "DCR_items",
  coefficient: "DCR_coefficient",
  niveau: "DCR_niveau",
  valider: "DCR_valider",
};
function avecAffichageDeLaDate(aArticle) {
  const result = false;
  if (
    !!aArticle &&
    !!aArticle.niveauDAcquisition &&
    TUtilitaireCompetences.estNiveauAcqui(aArticle.niveauDAcquisition)
  ) {
    return (
      aArticle.getGenre() === EGenreRessource.ElementPilier ||
      aArticle.getGenre() === EGenreRessource.Competence ||
      aArticle.getGenre() === EGenreRessource.SousItem
    );
  }
  return result;
}
module.exports = { DonneesListe_BilanParDomaine };
