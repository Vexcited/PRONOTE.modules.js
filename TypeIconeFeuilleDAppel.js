exports.TypeIconeFeuilleDAppelUtil = exports.TypeIconeFeuilleDAppel = void 0;
var TypeIconeFeuilleDAppel;
(function (TypeIconeFeuilleDAppel) {
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["delegue"] = 0)] = "delegue";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["accompagnant"] = 1)] =
    "accompagnant";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["projetAccompagnement"] = 2)] =
    "projetAccompagnement";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["gap"] = 3)] = "gap";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["anniversaire"] = 4)] =
    "anniversaire";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["valorisation"] = 5)] =
    "valorisation";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["devoir"] = 6)] = "devoir";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["memo"] = 7)] = "memo";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["convocationVS"] = 8)] =
    "convocationVS";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["absencePrecedent"] = 9)] =
    "absencePrecedent";
  TypeIconeFeuilleDAppel[
    (TypeIconeFeuilleDAppel["absenceConvocationAuto"] = 10)
  ] = "absenceConvocationAuto";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["enseignementMaison"] = 11)] =
    "enseignementMaison";
  TypeIconeFeuilleDAppel[
    (TypeIconeFeuilleDAppel["absentCoursPrecedentDuProf"] = 12)
  ] = "absentCoursPrecedentDuProf";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["usagerBusScolaire"] = 13)] =
    "usagerBusScolaire";
  TypeIconeFeuilleDAppel[(TypeIconeFeuilleDAppel["autoriseASortirSeul"] = 14)] =
    "autoriseASortirSeul";
})(
  TypeIconeFeuilleDAppel ||
    (exports.TypeIconeFeuilleDAppel = TypeIconeFeuilleDAppel = {}),
);
const TypeIconeFeuilleDAppelUtil = {
  getClassIconeDeType(aType, aParams) {
    switch (aType) {
      case TypeIconeFeuilleDAppel.delegue: {
        const lClassesIcone = ["icon_engagement"];
        const lEstDelegueClasse = !!aParams && !!aParams.estDelegueClasse;
        const lEstDelegueEco = !!aParams && !!aParams.estDelegueEco;
        const lEstDelegueAutre = !!aParams && !!aParams.estDelegueAutre;
        const lEstPlusieursCategories =
          (lEstDelegueClasse && (lEstDelegueEco || lEstDelegueAutre)) ||
          (lEstDelegueEco && lEstDelegueAutre);
        if (lEstPlusieursCategories) {
          lClassesIcone.push("mix-icon_plus");
        } else if (lEstDelegueClasse) {
          lClassesIcone.push("mix-icon_rond i-orange");
        } else if (lEstDelegueEco) {
          lClassesIcone.push("mix-icon_rond  i-green");
        }
        return lClassesIcone.join(" ");
      }
      case TypeIconeFeuilleDAppel.accompagnant:
        return "icon_accompagnant";
      case TypeIconeFeuilleDAppel.projetAccompagnement: {
        const lClassesIcone = ["icon_projet_accompagnement"];
        const lPlusieursProjets = !!aParams && !!aParams.sontPlusieursPA;
        const lEstMedical =
          !!aParams && !!aParams.estPAmedical && !aParams.sontPlusieursPA;
        if (lEstMedical) {
          lClassesIcone.push("mix-icon_rond i-green");
        } else if (lPlusieursProjets) {
          lClassesIcone.push("mix-icon_plus");
        }
        return lClassesIcone.join(" ");
      }
      case TypeIconeFeuilleDAppel.gap:
        return "icon_groupes_accompagnement_personnalise";
      case TypeIconeFeuilleDAppel.anniversaire:
        return "icon_anniversaire";
      case TypeIconeFeuilleDAppel.valorisation:
        return "icon_valorisation";
      case TypeIconeFeuilleDAppel.devoir:
        if (aParams && aParams.rendu) {
          return "icon_filigrane_idevoir_rendu";
        }
        return "icon_nouveau_document";
      case TypeIconeFeuilleDAppel.memo:
        return "icon_post_it_rempli";
      case TypeIconeFeuilleDAppel.convocationVS:
        return "icon_convocation mix-icon_vs i-red i-small";
      case TypeIconeFeuilleDAppel.absencePrecedent:
        return "icon_reply";
      case TypeIconeFeuilleDAppel.absenceConvocationAuto:
        return "icon_remove";
      case TypeIconeFeuilleDAppel.enseignementMaison:
        return "icon_home";
      case TypeIconeFeuilleDAppel.absentCoursPrecedentDuProf:
        return "icon_fiche_T mix-icon_reply";
      case TypeIconeFeuilleDAppel.usagerBusScolaire:
        return "icon_bus";
      case TypeIconeFeuilleDAppel.autoriseASortirSeul:
        return ["icon_user", "mix-icon_ok", "i-top"].join(" ");
    }
    return "";
  },
  getOrdreDeType(aType) {
    switch (aType) {
      case TypeIconeFeuilleDAppel.delegue:
        return 1;
      case TypeIconeFeuilleDAppel.accompagnant:
        return 2;
      case TypeIconeFeuilleDAppel.projetAccompagnement:
        return 3;
      case TypeIconeFeuilleDAppel.gap:
        return 12;
      case TypeIconeFeuilleDAppel.anniversaire:
        return 4;
      case TypeIconeFeuilleDAppel.valorisation:
        return 5;
      case TypeIconeFeuilleDAppel.devoir:
        return 6;
      case TypeIconeFeuilleDAppel.memo:
        return 7;
      case TypeIconeFeuilleDAppel.convocationVS:
        return 8;
      case TypeIconeFeuilleDAppel.absencePrecedent:
        return 9;
      case TypeIconeFeuilleDAppel.absenceConvocationAuto:
        return 10;
      case TypeIconeFeuilleDAppel.enseignementMaison:
        return 11;
      case TypeIconeFeuilleDAppel.absentCoursPrecedentDuProf:
        return 0;
      case TypeIconeFeuilleDAppel.usagerBusScolaire:
        return 12;
      case TypeIconeFeuilleDAppel.autoriseASortirSeul:
        return 13;
    }
    return -1;
  },
};
exports.TypeIconeFeuilleDAppelUtil = TypeIconeFeuilleDAppelUtil;
