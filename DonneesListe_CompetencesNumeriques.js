const { GChaine } = require("ObjetChaine.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_CompetencesNumeriques extends ObjetDonneesListe {
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
    const lHtml = [];
    switch (aParams.idColonne) {
      case DonneesListe_CompetencesNumeriques.colonnes.items:
        return (
          aParams.article.getLibelle() +
          (!!aParams.article.libelleCorrige
            ? " - ( " +
              GChaine.composerUrlLienExterne({
                documentJoint: aParams.article,
                libelle: aParams.article.libelleCorrige,
                libelleEcran: aParams.article.libelleCorrige,
                title: GTraductions.getValeur("AfficherCorrige"),
              }) +
              " )"
            : "")
        );
      case DonneesListe_CompetencesNumeriques.colonnes.evaluations:
        return TUtilitaireCompetences.composeJaugeParNiveaux({
          listeNiveaux: aParams.article.resultats,
          hint: aParams.article.hintResultats,
        });
      case DonneesListe_CompetencesNumeriques.colonnes.niveau:
        if (aParams.article.getGenre() === EGenreRessource.ElementPilier) {
          return aParams.article.niveauDEquivalenceCE
            ? aParams.article.niveauDEquivalenceCE.getLibelle()
            : "";
        }
        if (!!aParams.article.niveauDAcquisition) {
          const lNiveauDAcquisition =
            GParametres.listeNiveauxDAcquisitions.getElementParNumero(
              aParams.article.niveauDAcquisition.getNumero(),
            );
          lHtml.push(
            EGenreNiveauDAcquisitionUtil.getImage(lNiveauDAcquisition, {
              avecTitle: false,
            }),
          );
          if (!!aParams.article.observation) {
            lHtml.push(
              '<i style="position:absolute; right:0px; bottom:0px;" class=" icon_comment"></i>',
            );
          }
        }
        return lHtml.join("");
    }
    return "";
  }
  getHintHtmlForce(aParams) {
    const lHintNiveau = [];
    switch (aParams.idColonne) {
      case DonneesListe_CompetencesNumeriques.colonnes.items:
        return aParams.article.libelleLong ? aParams.article.libelleLong : "";
      case DonneesListe_CompetencesNumeriques.colonnes.niveau:
        if (aParams.article.getGenre() === EGenreRessource.ElementPilier) {
          lHintNiveau.push(
            aParams.article.niveauDEquivalenceCE
              ? aParams.article.niveauDEquivalenceCE.getLibelle()
              : "",
          );
        } else {
          const lLibelleNiveauAcqui = EGenreNiveauDAcquisitionUtil.getLibelle(
            aParams.article.niveauDAcquisition,
          );
          if (
            aParams.article.getGenre() === EGenreRessource.Evaluation ||
            aParams.article.getGenre() === EGenreRessource.EvaluationHistorique
          ) {
            if (!!aParams.article.hint) {
              lHintNiveau.push(aParams.article.hint);
              lHintNiveau.push("<br/><br/>");
            }
            lHintNiveau.push(
              "<b><u>",
              GTraductions.getValeur("competences.evaluation"),
              "</u></b> : ",
              lLibelleNiveauAcqui,
            );
            if (!!aParams.article.observation) {
              const lObs = aParams.article.observation.replace(/\n/g, "<br/>");
              lHintNiveau.push("<br/>", lObs);
              if (!!aParams.article.observationPubliee) {
                lHintNiveau.push(
                  " (",
                  GTraductions.getValeur("competences.PublieSurEspaceParent"),
                  ")",
                );
              }
            }
          } else {
            lHintNiveau.push(lLibelleNiveauAcqui);
          }
        }
        return lHintNiveau.join("");
    }
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_CompetencesNumeriques.colonnes.items:
      case DonneesListe_CompetencesNumeriques.colonnes.niveau:
      case DonneesListe_CompetencesNumeriques.colonnes.evaluations:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_CompetencesNumeriques.colonnes.niveau:
        return !!aParams.article.niveauEstEditable;
    }
    return false;
  }
  avecEvenementEdition(aParams) {
    return this.avecEdition(aParams);
  }
  getClass(aParams) {
    const lClass = [];
    if (
      aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.niveau
    ) {
      lClass.push("AlignementMilieu");
    }
    if (
      aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
    ) {
      if (
        aParams.article.getGenre() === EGenreRessource.Pilier ||
        aParams.article.getGenre() === EGenreRessource.ElementPilier
      ) {
        lClass.push("Gras");
      }
      if (aParams.article.estUnDeploiement) {
        lClass.push("AvecMain");
      }
    }
    if (
      aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
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
      aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
    );
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
    );
  }
  getCouleurCellule(aParams) {
    if (this.avecEdition(aParams)) {
      return ObjetDonneesListe.ECouleurCellule.Blanc;
    }
    if (!!aParams.article) {
      switch (aParams.article.getGenre()) {
        case EGenreRessource.Pilier:
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
    if (
      aParams.idColonne === DonneesListe_CompetencesNumeriques.colonnes.items
    ) {
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
DonneesListe_CompetencesNumeriques.colonnes = {
  items: "DCR_items",
  evaluations: "DCR_evaluations",
  niveau: "DCR_niveau",
};
module.exports = { DonneesListe_CompetencesNumeriques };
