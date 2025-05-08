const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const {
  TypeEtatSatisfaction,
  TypeEtatSatisfactionUtil,
} = require("TypeEtatSatisfaction.js");
class DonneesListe_EvaluationAccueilStage extends ObjetDonneesListe {
  constructor(aDonnees, aEditable) {
    super(aDonnees);
    this.editable = aEditable;
    this.setOptions({
      avecSuppression: false,
      hauteurMinCellule: 30,
      avecSelection: false,
    });
  }
  avecEdition(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_EvaluationAccueilStage.colonnes.intitule
    ) {
      return false;
    }
    return this.editable;
  }
  avecEvenementEdition(aParams) {
    return this.avecEdition(aParams);
  }
  avecMenuContextuel() {
    return false;
  }
  avecBordureDroite() {
    return false;
  }
  avecBordureBas() {
    return false;
  }
  getClass(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_EvaluationAccueilStage.colonnes.intitule
    ) {
      return "";
    } else {
      return "AlignementMilieu";
    }
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationAccueilStage.colonnes.intitule:
        return aParams.article.getLibelle();
      case DonneesListe_EvaluationAccueilStage.colonnes.tresInsatisfait:
        return TypeEtatSatisfactionUtil.getIcon(
          TypeEtatSatisfaction.Tes_TresInsatisfait,
          {
            class: "Texte14",
            actif:
              aParams.article.typeSatisfaction ===
              TypeEtatSatisfaction.Tes_TresInsatisfait,
            nonEditable: !this.editable,
          },
        );
      case DonneesListe_EvaluationAccueilStage.colonnes.insatisfait:
        return TypeEtatSatisfactionUtil.getIcon(
          TypeEtatSatisfaction.Tes_Insatisfait,
          {
            class: "Texte14",
            actif:
              aParams.article.typeSatisfaction ===
              TypeEtatSatisfaction.Tes_Insatisfait,
            nonEditable: !this.editable,
          },
        );
      case DonneesListe_EvaluationAccueilStage.colonnes.satisfait:
        return TypeEtatSatisfactionUtil.getIcon(
          TypeEtatSatisfaction.Tes_Satisfait,
          {
            class: "Texte14",
            actif:
              aParams.article.typeSatisfaction ===
              TypeEtatSatisfaction.Tes_Satisfait,
            nonEditable: !this.editable,
          },
        );
      case DonneesListe_EvaluationAccueilStage.colonnes.tresSatisfait:
        return TypeEtatSatisfactionUtil.getIcon(
          TypeEtatSatisfaction.Tes_TresSatisfait,
          {
            class: "Texte14",
            actif:
              aParams.article.typeSatisfaction ===
              TypeEtatSatisfaction.Tes_TresSatisfait,
            nonEditable: !this.editable,
          },
        );
    }
    return "";
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationAccueilStage.colonnes.tresInsatisfait:
        return TypeEtatSatisfactionUtil.getLibelle(
          TypeEtatSatisfaction.Tes_TresInsatisfait,
        );
      case DonneesListe_EvaluationAccueilStage.colonnes.insatisfait:
        return TypeEtatSatisfactionUtil.getLibelle(
          TypeEtatSatisfaction.Tes_Insatisfait,
        );
      case DonneesListe_EvaluationAccueilStage.colonnes.satisfait:
        return TypeEtatSatisfactionUtil.getLibelle(
          TypeEtatSatisfaction.Tes_Satisfait,
        );
      case DonneesListe_EvaluationAccueilStage.colonnes.tresSatisfait:
        return TypeEtatSatisfactionUtil.getLibelle(
          TypeEtatSatisfaction.Tes_TresSatisfait,
        );
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_EvaluationAccueilStage.colonnes.intitule:
        return ObjetDonneesListe.ETypeCellule.Texte;
    }
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  static init(aInstance) {
    const lColonnes = [];
    const lLargeur = 38;
    lColonnes.push({
      id: DonneesListe_EvaluationAccueilStage.colonnes.intitule,
      taille: 600,
    });
    lColonnes.push({
      id: DonneesListe_EvaluationAccueilStage.colonnes.tresSatisfait,
      taille: lLargeur,
    });
    lColonnes.push({
      id: DonneesListe_EvaluationAccueilStage.colonnes.satisfait,
      taille: lLargeur,
    });
    lColonnes.push({
      id: DonneesListe_EvaluationAccueilStage.colonnes.insatisfait,
      taille: lLargeur,
    });
    lColonnes.push({
      id: DonneesListe_EvaluationAccueilStage.colonnes.tresInsatisfait,
      taille: lLargeur,
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: true,
      hauteurMaxAdapteContenu: 500,
      scrollHorizontal: false,
      colonnesCachees: [],
      alternanceCouleurLigneContenu: true,
    });
  }
}
DonneesListe_EvaluationAccueilStage.colonnes = {
  intitule: "listeEvaluationAccueilStageIntitule",
  tresInsatisfait: "listeEvaluationAccueilStageTresInsatisfait",
  insatisfait: "listeEvaluationAccueilStageInsatisfait",
  satisfait: "listeEvaluationAccueilStageSatisfait",
  tresSatisfait: "listeEvaluationAccueilStageTresSatisfait",
};
module.exports = { DonneesListe_EvaluationAccueilStage };
