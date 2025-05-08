exports.TypePastillePersonnalisee = exports.UtilitaireNiveauAcquisition =
  void 0;
const ObjetChaine_1 = require("ObjetChaine");
var TypePastillePersonnalisee;
(function (TypePastillePersonnalisee) {
  TypePastillePersonnalisee["ParDefaut"] = "";
  TypePastillePersonnalisee["Etoile"] = "icon_star";
})(
  TypePastillePersonnalisee ||
    (exports.TypePastillePersonnalisee = TypePastillePersonnalisee = {}),
);
const UtilitaireNiveauAcquisition = {
  getImage(aNiveauAcquisition, aParams = {}) {
    const H = [];
    if (!!aNiveauAcquisition && aNiveauAcquisition.existeNumero()) {
      const lLibelleNiveau = aNiveauAcquisition.getLibelle();
      const lValeurTitle =
        !aParams ||
        aParams.avecTitle ||
        aParams.avecTitle === null ||
        aParams.avecTitle === undefined
          ? aNiveauAcquisition.getLibelle()
          : null;
      let lAfficherAbreviation =
        GParametres.afficherAbbreviationNiveauDAcquisition;
      if (lAfficherAbreviation) {
        const lAbreviation = aNiveauAcquisition.abreviation;
        H.push("<span");
        if (lValeurTitle) {
          H.push(` title="${ObjetChaine_1.GChaine.toTitle(lValeurTitle)}"`);
        }
        if (lLibelleNiveau) {
          H.push(
            ` aria-label="${ObjetChaine_1.GChaine.toTitle(lLibelleNiveau)}"`,
          );
        }
        H.push(">");
        H.push(lAbreviation);
        H.push("</span>");
      } else {
        const lCouleurIcon = getCouleur(aNiveauAcquisition);
        let lNomIcone = "";
        if (aParams.typePastille) {
          lNomIcone = aParams.typePastille;
        }
        let lContenuPastille;
        H.push(
          UtilitaireNiveauAcquisition.getHtmlPastille({
            title: lValeurTitle,
            nomIcone: lNomIcone,
            couleurIcone: lCouleurIcon,
            contenu: lContenuPastille,
          }),
        );
      }
    }
    return H.join("");
  },
  getHtmlPastille(aParams) {
    const H = [];
    const lClassesNiveauAcquisition = ["NiveauAcquisition"];
    if (!!aParams.nomIcone) {
      lClassesNiveauAcquisition.push("NiveauAcquisition_IconePersonnalisee");
    } else {
      lClassesNiveauAcquisition.push("NiveauAcquisition_Pastille");
    }
    if (aParams.estAnnotation) {
      lClassesNiveauAcquisition.push("NiveauAcquisition_Annotation");
    }
    if (aParams.estPastillePositionnement) {
      lClassesNiveauAcquisition.push("NiveauAcquisition_Positionnement");
    }
    const lAttributTitle = !!aParams.title
      ? ' title="' + aParams.title + '"'
      : "";
    const lAriaLabel = aParams.libelleImage
      ? ` aria-label="${ObjetChaine_1.GChaine.toTitle(aParams.libelleImage)}"`
      : "";
    let lCouleurPastille = "white";
    if (!!aParams.couleurIcone) {
      lCouleurPastille = aParams.couleurIcone;
    }
    if (!!aParams.nomIcone) {
      H.push(
        '<span role="img" class="',
        lClassesNiveauAcquisition.join(" "),
        '"',
        lAttributTitle || "",
        lAriaLabel || "",
        ">",
        '<i class="',
        aParams.nomIcone,
        '" style="color:',
        lCouleurPastille,
        ';"></i>',
        "</span>",
      );
    } else {
      let lContenu = "&nbsp;";
      let lCouleurContenu = "";
      if (!!aParams.contenu) {
        lContenu = aParams.contenu.valeur;
        lCouleurContenu = aParams.contenu.couleur;
      }
      const lStyles = [];
      lStyles.push("background-color:", lCouleurPastille, ";");
      if (!!lCouleurContenu) {
        lStyles.push("color: ", lCouleurContenu, ";");
      }
      H.push(
        '<span role="img" class="',
        lClassesNiveauAcquisition.join(" "),
        '" style="',
        lStyles.join(""),
        '"',
        lAttributTitle || "",
        lAriaLabel || "",
        ">",
        lContenu,
        "</span>",
      );
    }
    return H.join("");
  },
  getNiveauAcqusitionDEventClavier(
    aEvent,
    aListeNiveaux,
    aPourPositionnement = false,
  ) {
    if (!aListeNiveaux || !aEvent) {
      return null;
    }
    if (aEvent.ctrlKey || aEvent.altKey) {
      return null;
    }
    const lEventKey =
      !!aEvent.key && !!aEvent.key.toLowerCase ? aEvent.key.toLowerCase() : "";
    let lNiveauRetrouve = null;
    if (!!lEventKey) {
      aListeNiveaux.parcourir((D) => {
        const lBonRaccourci = aPourPositionnement
          ? D.raccourciPositionnement
          : D.raccourci;
        const lBonRaccourciLowerCase =
          lBonRaccourci && lBonRaccourci.toLowerCase
            ? lBonRaccourci.toLowerCase()
            : "";
        if (lBonRaccourciLowerCase === lEventKey) {
          lNiveauRetrouve = D;
          return false;
        }
      });
    }
    return lNiveauRetrouve;
  },
};
exports.UtilitaireNiveauAcquisition = UtilitaireNiveauAcquisition;
function getCouleur(aNiveauDAcquisition) {
  return !!aNiveauDAcquisition ? aNiveauDAcquisition.couleur : "white";
}
