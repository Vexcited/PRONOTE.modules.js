const { GTraductions } = require("ObjetTraduction.js");
const { Identite } = require("ObjetIdentite.js");
const {
  TypeComparaisonRessourcesCoursCDT,
} = require("TypeComparaisonRessourcesCoursCDT.js");
const { TypeOptionPublicationCDT } = require("TypeOptionPublicationCDT.js");
const {
  ObjetRequeteSaisieParametresUtilisateurBase,
} = require("ObjetRequeteSaisieParametresUtilisateurBase.js");
class ObjetPreferenceCahierDeTexte extends Identite {
  constructor(...aParams) {
    super(...aParams);
  }
  getControleur() {
    return $.extend(true, super.getControleur(this), {
      ifElementProgramme: function () {
        return GApplication.parametresUtilisateur.get(
          "CDT.ElementProgramme.AutorisationFonctionnelleElementProgramme",
        );
      },
      ifParcoursEducatif: function () {
        return GApplication.parametresUtilisateur.get(
          "CDT.ParcoursEducatifs.AutorisationFonctionnelleParcoursEducatifs",
        );
      },
      cbElementProgrammeSaisie: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ElementProgramme.ActiverSaisie",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ElementProgramme.ActiverSaisie",
            aValue,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
      cbMatiereIdentique: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.Navigation.MatiereIdentique",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.Navigation.MatiereIdentique",
            aValue,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
      rbType: {
        getValue: function (aGenre) {
          return (
            aGenre ===
            GApplication.parametresUtilisateur.get("CDT.Navigation.TypeCours")
          );
        },
        setValue: function (aGenre) {
          GApplication.parametresUtilisateur.set(
            "CDT.Navigation.TypeCours",
            aGenre,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
      cbPartagePJAutorisee: {
        getValue: function () {
          return GApplication.parametresUtilisateurBase.partagePJAutorisee;
        },
        setValue: function (aPartagePJAutorisee) {
          GApplication.parametresUtilisateurBase.partagePJAutorisee =
            aPartagePJAutorisee;
          new ObjetRequeteSaisieParametresUtilisateurBase(this).lancerRequete(
            GApplication.parametresUtilisateurBase,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
      rbOptionPublication: {
        getValue: function (aGenre) {
          return (
            aGenre ===
            GApplication.parametresUtilisateurBase.optionPublicationCDT
          );
        },
        setValue: function (aGenre) {
          GApplication.parametresUtilisateurBase.optionPublicationCDT = aGenre;
          new ObjetRequeteSaisieParametresUtilisateurBase(this).lancerRequete(
            GApplication.parametresUtilisateurBase,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
      cbActiverParcoursEducatifs: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.ParcoursEducatifs.ActiverSaisie",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.ParcoursEducatifs.ActiverSaisie",
            aValue,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
      cbActiverCommentaireSurSeance: {
        getValue: function () {
          return GApplication.parametresUtilisateur.get(
            "CDT.Commentaire.ActiverSaisie",
          );
        },
        setValue: function (aValue) {
          GApplication.parametresUtilisateur.set(
            "CDT.Commentaire.ActiverSaisie",
            aValue,
          );
        },
        getDisabled: function () {
          return GApplication.getModeExclusif();
        },
      },
    });
  }
  construireAffichage() {
    const H = [];
    H.push(
      `<h2 ie-if="ifElementProgramme">${GTraductions.getValeur("infosperso.ElementProgramme")}</h2>`,
    );
    H.push(
      `<div ie-if="ifElementProgramme" class="inner-item-contain">\n            <ie-checkbox ie-model="cbElementProgrammeSaisie">${GTraductions.getValeur("infosperso.ElementProgrammeSaisie")}</ie-checkbox>\n          </div>`,
    );
    const lLibelleNavigatonCoursCDT =
      GTraductions.getValeur("infosperso.NavigationCoursCDT") + " : ";
    H.push(
      `<fieldset class="inner-item-contain flex-contain cols">\n            <legend class="sr-only">${lLibelleNavigatonCoursCDT}</legend>\n            <h2>${lLibelleNavigatonCoursCDT}</h2>\n\n              <ie-checkbox ie-model="cbMatiereIdentique">${GTraductions.getValeur("infosperso.CoursMatiereIdentique")}</ie-checkbox>\n\n              <ie-radio ie-model="rbType(${TypeComparaisonRessourcesCoursCDT.RessourcesIdentiques})">${GTraductions.getValeur("infosperso.CoursRessourceIdentique")}</ie-radio>\n\n              <ie-radio ie-model="rbType(${TypeComparaisonRessourcesCoursCDT.RessourcesCommunes})">${GTraductions.getValeur("infosperso.CoursRessourceCommune")}</ie-radio>\n\n              <ie-radio ie-model="rbType(${TypeComparaisonRessourcesCoursCDT.AuMoins1EleveEnCommun})">${GTraductions.getValeur("infosperso.CoursEleveCommun")}</ie-radio>\n          </fieldset>`,
    );
    H.push(
      `<h2>${GTraductions.getValeur("infosperso.OptionsDePartage")} : </h2>`,
    );
    H.push(
      `<div class="inner-item-contain">\n              <ie-checkbox ie-model="cbPartagePJAutorisee">${GTraductions.getValeur("infosperso.AutoriserConsultationPJAutresProfesseurs")}</ie-checkbox>\n          </div>`,
    );
    const lLibelleOptionsPublicationAutoCDT =
      GTraductions.getValeur("infosperso.OptionsPublicationAutoCDT") + " : ";
    H.push(
      `<fieldset class="inner-item-contain flex-contain cols">\n              <legend class="sr-only">${lLibelleOptionsPublicationAutoCDT}</legend>\n              <h2>${lLibelleOptionsPublicationAutoCDT}</h2>\n              <ie-radio ie-model="rbOptionPublication(${TypeOptionPublicationCDT.OPT_PublicationDebutCours})">${GTraductions.getValeur("infosperso.DesDebutCours")}</ie-radio>\n              <ie-radio ie-model="rbOptionPublication(${TypeOptionPublicationCDT.OPT_PublicationFinCours})">${GTraductions.getValeur("infosperso.ALaFinDuCours")}</ie-radio>\n          </fieldset>`,
    );
    H.push(
      '<h2 ie-if="ifParcoursEducatif">',
      GTraductions.getValeur("infosperso.ParcoursEducatifs"),
      "</h2>",
    );
    H.push(
      '<div ie-if="ifParcoursEducatif" class="inner-item-contain">',
      '<ie-checkbox ie-model="cbActiverParcoursEducatifs">',
      GTraductions.getValeur("infosperso.ActiverParcoursEducatifs"),
      "</ie-checkbox>",
      "</div>",
    );
    H.push(
      "<h2>",
      GTraductions.getValeur("infosperso.SaisieCommentaireSurSeance"),
      "</h2>",
    );
    H.push(
      '<div class="inner-item-contain">',
      '<ie-checkbox ie-model="cbActiverCommentaireSurSeance">',
      GTraductions.getValeur("infosperso.ActiverSaisieCommentaireSurSeance"),
      "</ie-checkbox>",
      "</div>",
    );
    return H.join("");
  }
}
module.exports = { ObjetPreferenceCahierDeTexte };
