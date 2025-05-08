exports.TypeModaliteDEvaluationMilieuProfessionnelUtil =
  exports.TypeAnnexePedagogiqueUtil =
  exports.TypeModaliteDEvaluationMilieuProfessionnel =
  exports.TypeAnnexePedagogique =
    void 0;
var TypeAnnexePedagogique;
(function (TypeAnnexePedagogique) {
  TypeAnnexePedagogique["TAP_SujetDetaille"] = "TAP_SujetDetaille";
  TypeAnnexePedagogique["TAP_ActivitesDejaRealisees"] =
    "TAP_ActivitesDejaRealisees";
  TypeAnnexePedagogique["TAP_CompetencesMobilisees"] =
    "TAP_CompetencesMobilisees";
  TypeAnnexePedagogique["TAP_Objectifs"] = "TAP_Objectifs";
  TypeAnnexePedagogique["TAP_ActivitesPrevues"] = "TAP_ActivitesPrevues";
  TypeAnnexePedagogique["TAP_MoyensMobilises"] = "TAP_MoyensMobilises";
  TypeAnnexePedagogique["TAP_CompetencesVisees"] = "TAP_CompetencesVisees";
  TypeAnnexePedagogique["TAP_TravauxAuxMineurs"] = "TAP_TravauxAuxMineurs";
  TypeAnnexePedagogique["TAP_ModalitesDeConcertation"] =
    "TAP_ModalitesDeConcertation";
  TypeAnnexePedagogique["TAP_ModalitesDEvaluation"] =
    "TAP_ModalitesDEvaluation";
})(
  TypeAnnexePedagogique ||
    (exports.TypeAnnexePedagogique = TypeAnnexePedagogique = {}),
);
var TypeModaliteDEvaluationMilieuProfessionnel;
(function (TypeModaliteDEvaluationMilieuProfessionnel) {
  TypeModaliteDEvaluationMilieuProfessionnel[
    (TypeModaliteDEvaluationMilieuProfessionnel["TMEMP_Aucune"] = 0)
  ] = "TMEMP_Aucune";
  TypeModaliteDEvaluationMilieuProfessionnel[
    (TypeModaliteDEvaluationMilieuProfessionnel["TMEMP_Formative"] = 1)
  ] = "TMEMP_Formative";
  TypeModaliteDEvaluationMilieuProfessionnel[
    (TypeModaliteDEvaluationMilieuProfessionnel["TMEMP_Certificative"] = 2)
  ] = "TMEMP_Certificative";
})(
  TypeModaliteDEvaluationMilieuProfessionnel ||
    (exports.TypeModaliteDEvaluationMilieuProfessionnel =
      TypeModaliteDEvaluationMilieuProfessionnel =
        {}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
exports.TypeAnnexePedagogiqueUtil = {
  getLabel(aTypeAnnexePedagogique) {
    switch (aTypeAnnexePedagogique) {
      case TypeAnnexePedagogique.TAP_SujetDetaille:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.sujetDetaille",
        );
      case TypeAnnexePedagogique.TAP_ActivitesDejaRealisees:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.activitesDejaRealisees",
        );
      case TypeAnnexePedagogique.TAP_CompetencesMobilisees:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.competencesMobilisees",
        );
      case TypeAnnexePedagogique.TAP_Objectifs:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.objectifsAssignes",
        );
      case TypeAnnexePedagogique.TAP_ActivitesPrevues:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.activitesPrevues",
        );
      case TypeAnnexePedagogique.TAP_MoyensMobilises:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.moyensMobilises",
        );
      case TypeAnnexePedagogique.TAP_CompetencesVisees:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.competencesVisees",
        );
      case TypeAnnexePedagogique.TAP_TravauxAuxMineurs:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.travauxAuxMineurs",
        );
      case TypeAnnexePedagogique.TAP_ModalitesDeConcertation:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.modalitesDEncadrement",
        );
      case TypeAnnexePedagogique.TAP_ModalitesDEvaluation:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.annexe.modalitesDEvaluation",
        );
      default:
        return "";
    }
  },
  getLongueurMax() {
    return 5000;
  },
};
exports.TypeModaliteDEvaluationMilieuProfessionnelUtil = {
  getLibelle(aTypeModaliteDEvaluationMilieuProfessionnel) {
    switch (aTypeModaliteDEvaluationMilieuProfessionnel) {
      case TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Aucune:
        return ObjetTraduction_1.GTraductions.getValeur("Aucune");
      case TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Formative:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.typeDEvaluation.formative",
        );
      case TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Certificative:
        return ObjetTraduction_1.GTraductions.getValeur(
          "FicheStage.typeDEvaluation.certificative",
        );
    }
  },
  getListe() {
    return new ObjetListeElements_1.ObjetListeElements().add([
      new ObjetElement_1.ObjetElement(
        this.getLibelle(
          TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Aucune,
        ),
        null,
        TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Aucune,
      ),
      new ObjetElement_1.ObjetElement(
        this.getLibelle(
          TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Formative,
        ),
        null,
        TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Formative,
      ),
      new ObjetElement_1.ObjetElement(
        this.getLibelle(
          TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Certificative,
        ),
        null,
        TypeModaliteDEvaluationMilieuProfessionnel.TMEMP_Certificative,
      ),
    ]);
  },
};
