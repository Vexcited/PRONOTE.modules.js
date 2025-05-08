exports.EGenreRessourcePedagogiqueUtil = exports.EGenreRessourcePedagogique =
  void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const MethodesObjet_1 = require("MethodesObjet");
var EGenreRessourcePedagogique;
(function (EGenreRessourcePedagogique) {
  EGenreRessourcePedagogique[
    (EGenreRessourcePedagogique["documentJoint"] = 0)
  ] = "documentJoint";
  EGenreRessourcePedagogique[(EGenreRessourcePedagogique["site"] = 1)] = "site";
  EGenreRessourcePedagogique[(EGenreRessourcePedagogique["QCM"] = 2)] = "QCM";
  EGenreRessourcePedagogique[(EGenreRessourcePedagogique["sujet"] = 3)] =
    "sujet";
  EGenreRessourcePedagogique[(EGenreRessourcePedagogique["corrige"] = 4)] =
    "corrige";
  EGenreRessourcePedagogique[(EGenreRessourcePedagogique["travailRendu"] = 5)] =
    "travailRendu";
  EGenreRessourcePedagogique[(EGenreRessourcePedagogique["kiosque"] = 6)] =
    "kiosque";
  EGenreRessourcePedagogique[
    (EGenreRessourcePedagogique["documentCloud"] = 7)
  ] = "documentCloud";
})(
  EGenreRessourcePedagogique ||
    (exports.EGenreRessourcePedagogique = EGenreRessourcePedagogique = {}),
);
const EGenreRessourcePedagogiqueUtil = {
  getLibelleDeGenreEtNombre(aGenreRessource, aNombre) {
    let lChaine = "";
    switch (aGenreRessource) {
      case EGenreRessourcePedagogique.documentJoint:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.DocJoint_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.DocJoint",
              );
        break;
      case EGenreRessourcePedagogique.site:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.SitesWeb_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.SitesWeb",
              );
        break;
      case EGenreRessourcePedagogique.QCM:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.IDevoirs_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.IDevoirs",
              );
        break;
      case EGenreRessourcePedagogique.sujet:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.Sujets_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.Sujets",
              );
        break;
      case EGenreRessourcePedagogique.corrige:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.Corriges_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.Corriges",
              );
        break;
      case EGenreRessourcePedagogique.travailRendu:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.TravauxRendus_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.TravauxRendus",
              );
        break;
      case EGenreRessourcePedagogique.kiosque:
        lChaine =
          aNombre === 1 || aNombre === undefined
            ? ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.Kiosque_S",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "RessourcePedagogique.Kiosque",
              );
        break;
    }
    return lChaine;
  },
  composerURL(
    aGenreRessourcePedagogique,
    aRessource,
    aLibelleEcran,
    aEstUrlBruteSouhaitee,
    aMaxWidth = 0,
  ) {
    let lGenreRessource =
      TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun;
    const lRessource = MethodesObjet_1.MethodesObjet.dupliquer(aRessource);
    let lLibelle;
    switch (aGenreRessourcePedagogique) {
      case EGenreRessourcePedagogique.sujet:
        if (
          lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Devoir
        ) {
          lGenreRessource =
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet;
        }
        if (
          lRessource.getGenre() ===
          Enumere_Ressource_1.EGenreRessource.Evaluation
        ) {
          lGenreRessource =
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
              .EvaluationSujet;
        }
        break;
      case EGenreRessourcePedagogique.corrige:
        if (
          lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Devoir
        ) {
          lGenreRessource =
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige;
        }
        if (
          lRessource.getGenre() ===
          Enumere_Ressource_1.EGenreRessource.Evaluation
        ) {
          lGenreRessource =
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
              .EvaluationCorrige;
        }
        if (
          lRessource.getGenre() ===
          Enumere_Ressource_1.EGenreRessource.RelationTravailAFaireEleve
        ) {
          lGenreRessource =
            TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco
              .TAFCorrigeRenduEleve;
        }
        break;
      case EGenreRessourcePedagogique.site:
        aLibelleEcran = lRessource.getLibelle();
        lRessource.Genre = Enumere_DocumentJoint_1.EGenreDocumentJoint.Url;
        break;
      case EGenreRessourcePedagogique.kiosque:
      case EGenreRessourcePedagogique.documentJoint:
      case EGenreRessourcePedagogique.documentCloud:
        break;
      case EGenreRessourcePedagogique.travailRendu:
        lGenreRessource =
          TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.TAFRenduEleve;
        break;
      default:
        break;
    }
    let lUrlResult = "";
    if (aEstUrlBruteSouhaitee) {
      lUrlResult = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lRessource, {
        genreRessource: lGenreRessource,
        libelle: lLibelle,
      });
    } else {
      lUrlResult = ObjetChaine_1.GChaine.composerUrlLienExterne({
        documentJoint: lRessource,
        genreRessource: lGenreRessource,
        libelleEcran: aLibelleEcran,
        libelle: lLibelle,
        maxWidth: aMaxWidth ? aMaxWidth : 0,
      });
    }
    return lUrlResult;
  },
  getIcone(aGenreRessource) {
    return [
      "icon_file_text_alt",
      "icon_globe",
      "icon_qcm",
      "icon_sujet",
      "icon_check",
      "icon_devoir_rendre",
      "icon_book",
      "icon_cloud",
    ][aGenreRessource];
  },
};
exports.EGenreRessourcePedagogiqueUtil = EGenreRessourcePedagogiqueUtil;
