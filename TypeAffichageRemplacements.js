exports.TypeAffichageRemplacementsUtil = exports.TypeAffichageRemplacements =
  void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
var TypeAffichageRemplacements;
(function (TypeAffichageRemplacements) {
  TypeAffichageRemplacements[
    (TypeAffichageRemplacements["tarPropositions"] = 0)
  ] = "tarPropositions";
  TypeAffichageRemplacements[
    (TypeAffichageRemplacements["tarVolontaire"] = 1)
  ] = "tarVolontaire";
  TypeAffichageRemplacements[
    (TypeAffichageRemplacements["tarMesRemplacementsAVenir"] = 2)
  ] = "tarMesRemplacementsAVenir";
  TypeAffichageRemplacements[
    (TypeAffichageRemplacements["tarMesRemplacementsPasses"] = 3)
  ] = "tarMesRemplacementsPasses";
  TypeAffichageRemplacements[
    (TypeAffichageRemplacements["tarAutresRemplacements"] = 4)
  ] = "tarAutresRemplacements";
})(
  TypeAffichageRemplacements ||
    (exports.TypeAffichageRemplacements = TypeAffichageRemplacements = {}),
);
exports.TypeAffichageRemplacementsUtil = {
  getLibelle(aType) {
    let lLibelle;
    switch (aType) {
      case TypeAffichageRemplacements.tarPropositions:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.Propositions",
        );
        break;
      case TypeAffichageRemplacements.tarVolontaire:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.APourvoir",
        );
        break;
      case TypeAffichageRemplacements.tarMesRemplacementsAVenir:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.MesRemplacementsAVenir",
        );
        break;
      case TypeAffichageRemplacements.tarMesRemplacementsPasses:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.MesRemplacementsPasses",
        );
        break;
      case TypeAffichageRemplacements.tarAutresRemplacements:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.AutresRemplacements",
        );
        break;
      default:
        lLibelle = "";
        break;
    }
    return lLibelle;
  },
  getClassIcone(aType) {
    let lLibelle;
    switch (aType) {
      case TypeAffichageRemplacements.tarPropositions:
        lLibelle = "icon_question";
        break;
      case TypeAffichageRemplacements.tarVolontaire:
        lLibelle = "icon_edt_permanence";
        break;
      case TypeAffichageRemplacements.tarMesRemplacementsAVenir:
        lLibelle = "icon_calendrier_aujourdhui";
        break;
      case TypeAffichageRemplacements.tarMesRemplacementsPasses:
        lLibelle = "icon_retour_arriere";
        break;
      case TypeAffichageRemplacements.tarAutresRemplacements:
        lLibelle = "icon_lock";
        break;
      default:
        lLibelle = "";
        break;
    }
    return lLibelle;
  },
  getLibelleListeVide(aType) {
    let lLibelle;
    switch (aType) {
      case TypeAffichageRemplacements.tarPropositions:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.AucuneProposition",
        );
        break;
      case TypeAffichageRemplacements.tarVolontaire:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.AucunAPourvoir",
        );
        break;
      case TypeAffichageRemplacements.tarMesRemplacementsAVenir:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.AucunAVenir",
        );
        break;
      case TypeAffichageRemplacements.tarMesRemplacementsPasses:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.AucunPasse",
        );
        break;
      case TypeAffichageRemplacements.tarAutresRemplacements:
        lLibelle = ObjetTraduction_1.GTraductions.getValeur(
          "TypeAffichageRemplacements.AucunAutre",
        );
        break;
      default:
        lLibelle = "";
        break;
    }
    return lLibelle;
  },
};
