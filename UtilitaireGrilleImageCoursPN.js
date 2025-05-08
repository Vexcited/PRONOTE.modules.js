exports.TUtilitaireGrilleImageCoursPN = TUtilitaireGrilleImageCoursPN;
const ObjetGrilleCours_1 = require("ObjetGrilleCours");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
function TUtilitaireGrilleImageCoursPN() {}
function _afficherGenre(aGenre, aFiltreUniquement) {
  if (aFiltreUniquement && aFiltreUniquement.indexOf) {
    return aFiltreUniquement.indexOf(aGenre) >= 0;
  }
  return true;
}
function _gethtmlImagePublieSuperposee() {
  return IE.jsx.str(
    IE.jsx.fragment,
    null,
    IE.jsx.str("div", {
      style: "position:absolute; top:0px; left:0px; pointer-events:none;",
      class: "Image_PublieGrille",
    }),
  );
}
function _imageCategorieCCDT(
  aCours,
  aListeImagesCoin,
  aOrigineCategorie,
  aGenre,
) {
  if (
    !aCours ||
    !aCours.cahierDeTextes ||
    !aCours.cahierDeTextes.originesCategorie ||
    !aCours.cahierDeTextes.originesCategorie.contains(aOrigineCategorie)
  ) {
    return;
  }
  const lCssImage =
    TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
      aOrigineCategorie,
    );
  let lTitle = "";
  switch (aOrigineCategorie) {
    case TypeOrigineCreationCategorieCahierDeTexte_1
      .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir:
      lTitle = ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.DevoirSurveille_Devoir",
      );
      break;
    case TypeOrigineCreationCategorieCahierDeTexte_1
      .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation:
      lTitle = ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.DevoirSurveille_Evaluation",
      );
      break;
  }
  if (!lCssImage) {
    return;
  }
  const lImage = new ObjetElement_1.ObjetElement(lCssImage, null, aGenre);
  lImage.width = 16;
  lImage.hint = lTitle;
  if (aCours.AvecCdTPublie) {
    lImage.getHtmlSupp = _gethtmlImagePublieSuperposee;
  }
  aListeImagesCoin.addElement(lImage);
  return true;
}
function _ajouterImagesCDT(aCours, aListeImages, aAvecEvenement) {
  let lImage;
  let lAvecImageCategorie = false;
  if (aCours.cahierDeTextes && aCours.cahierDeTextes.originesCategorie) {
    [
      TypeOrigineCreationCategorieCahierDeTexte_1
        .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
      TypeOrigineCreationCategorieCahierDeTexte_1
        .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
      TypeOrigineCreationCategorieCahierDeTexte_1
        .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_EPI,
      TypeOrigineCreationCategorieCahierDeTexte_1
        .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_AP,
    ].forEach((aGenreCategorie) => {
      if (
        _imageCategorieCCDT(
          aCours,
          aListeImages[ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG],
          aGenreCategorie,
          aAvecEvenement ? 1 : null,
        )
      ) {
        lAvecImageCategorie = true;
      }
    });
  }
  if (!lAvecImageCategorie) {
    if (aAvecEvenement && !aCours.cdtViseVide) {
      lImage = new ObjetElement_1.ObjetElement(
        aCours.AvecVisa
          ? "Image_CahierDeTexte_Verrouille6Etats"
          : "Image_CahierDeTexte6Etats",
        null,
        1,
      );
      lImage.btnImage = true;
      lImage.width = 19;
      lImage.hint = ObjetTraduction_1.GTraductions.getValeur("EDT.AfficherCDT");
      aListeImages[
        ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
      ].addElement(lImage);
    } else {
      if (aCours.AvecVisa) {
        if (!aCours.cdtViseVide) {
          lImage = new ObjetElement_1.ObjetElement(
            "Image_CahierDeTexte_Verrouille",
          );
        } else {
          lImage = new ObjetElement_1.ObjetElement("");
          lImage.html = IE.jsx.str("i", {
            class: "icon_lock",
            role: "presentation",
            style: "font-size:0.9rem; color: #ED5555; background-color: white;",
          });
        }
      } else {
        lImage = new ObjetElement_1.ObjetElement("Image_CahierDeTexte");
        lImage.hint = aCours.AvecCdTPublie
          ? ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.avecCDTpublie")
          : ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.avecCDT");
      }
      lImage.width = aCours.cdtViseVide ? 10 : 17;
      lImage.height = 16;
      if (aCours.cdtViseVide) {
        lImage.height = 10;
      }
      aListeImages[
        ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
      ].addElement(lImage);
    }
    if (aCours.AvecCdTPublie) {
      lImage.getHtmlSupp = _gethtmlImagePublieSuperposee;
    }
  }
}
TUtilitaireGrilleImageCoursPN.getListeImagesCours = function (
  aCours,
  aIndice,
  aFiltreUniquement,
) {
  var _a;
  if (!aCours) {
    return;
  }
  const lListeImages = {};
  [
    ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basD,
    ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG,
    ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautD,
    ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautG,
  ].forEach((aCoin) => {
    lListeImages[aCoin] = new ObjetListeElements_1.ObjetListeElements();
  });
  let lImage;
  const lAvecToutesImages = !aFiltreUniquement || !aFiltreUniquement.indexOf;
  const lCssIconeMemoClasse = "icon_post_it_rempli mix-icon_eleve size-inherit";
  ["memo", "memoPrive"].forEach((aPropMemo) => {
    const lMemo = aCours[aPropMemo];
    if (lMemo && lAvecToutesImages) {
      const lMemoFormat = ObjetChaine_1.GChaine.replaceRCToHTML(
        lMemo.ajouterEntites(),
      );
      const lHint = aCours.estSortiePedagogique
        ? IE.jsx.str(
            IE.jsx.fragment,
            null,
            ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAbsence"),
            " :",
            IE.jsx.str("br", null),
            lMemoFormat,
          )
        : lMemoFormat;
      const lAriaLabel = aCours.estSortiePedagogique
        ? `${ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAbsence")} : ${lMemoFormat}`
        : `${aPropMemo === "memo" ? ObjetTraduction_1.GTraductions.getValeur("EDT.MemoPublic") : ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAdministratif")} : ${lMemoFormat}`;
      const lCss =
        aCours.estSortiePedagogique && !aCours.tabMemosAcc
          ? lCssIconeMemoClasse
          : aPropMemo === "memoPrive"
            ? "icon_post_it_rempli mix-icon_pastille_evaluation size-inherit"
            : "icon_post_it_rempli";
      lListeImages[
        ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
      ].addElement(
        ObjetElement_1.ObjetElement.create({
          Libelle: "",
          hint: lHint,
          ariaLabel: lAriaLabel,
          html: IE.jsx.str("i", {
            class: lCss,
            style: "font-size:1.6rem",
            role: "presentation",
          }),
        }),
      );
    }
  });
  if (
    aCours.estSortiePedagogique &&
    ((_a = aCours.tabMemosAcc) === null || _a === void 0 ? void 0 : _a.length) >
      0 &&
    lAvecToutesImages
  ) {
    for (const lMemo of aCours.tabMemosAcc) {
      const lMemoFormat = ObjetChaine_1.GChaine.replaceRCToHTML(
        lMemo.ajouterEntites(),
      );
      lListeImages[
        ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
      ].addElement(
        ObjetElement_1.ObjetElement.create({
          hint: IE.jsx.str(
            IE.jsx.fragment,
            null,
            ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAbsenceClasse"),
            " :",
            IE.jsx.str("br", null),
            lMemoFormat,
          ),
          ariaLabel: `${ObjetTraduction_1.GTraductions.getValeur("EDT.MemoAbsenceClasse")} : ${lMemoFormat}`,
          html: IE.jsx.str("i", {
            class: lCssIconeMemoClasse,
            style: "font-size:1.6rem",
            role: "presentation",
          }),
        }),
      );
    }
  }
  if (
    !!aCours.listeVisios &&
    aCours.listeVisios.getNbrElementsExistes() > 0 &&
    lAvecToutesImages
  ) {
    lImage = new ObjetElement_1.ObjetElement(
      UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconePresenceVisios(),
      null,
      3,
    );
    lImage.hint =
      UtilitaireVisiosSco_1.UtilitaireVisios.getHintListeVisiosCours(
        aCours.listeVisios,
      );
    lImage.estImageDeFont = true;
    lImage.tailleImageFont = "1.5rem";
    lImage.btnImage = true;
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
    ].addElement(lImage);
  }
  if (aCours.estGAEV && lAvecToutesImages) {
    let lClasseIconeGAEV;
    if (aCours.estGAEVMixte) {
      lClasseIconeGAEV = "icon_gaev_mixte";
    } else {
      lClasseIconeGAEV = "icon_groupes_accompagnement_personnalise";
    }
    lImage = new ObjetElement_1.ObjetElement("");
    lImage.html = IE.jsx.str("i", {
      class: lClasseIconeGAEV,
      style: "font-size:1.6rem",
      role: "presentation",
    });
    lImage.hint = aCours.estGAEVMixte
      ? ObjetTraduction_1.GTraductions.getValeur("EDT.HintImageGAEVMixte")
      : ObjetTraduction_1.GTraductions.getValeur("EDT.HintImageGAEV");
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautG
    ].addElement(lImage);
  }
  if (aCours.estCoEnseignement && lAvecToutesImages) {
    lImage = new ObjetElement_1.ObjetElement("");
    lImage.hint = ObjetTraduction_1.GTraductions.getValeur(
      "EDT.HintImageCoEnseignement",
    );
    lImage.html = IE.jsx.str("i", {
      class: "icon_co_enseignement i-medium",
      role: "presentation",
    });
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautG
    ].addElement(lImage);
  }
  if (
    [
      Enumere_Espace_1.EGenreEspace.Professeur,
      Enumere_Espace_1.EGenreEspace.Academie,
      Enumere_Espace_1.EGenreEspace.PrimProfesseur,
      Enumere_Espace_1.EGenreEspace.PrimDirection,
    ].includes(GEtatUtilisateur.GenreEspace)
  ) {
    if (aCours.AvecCdT && lAvecToutesImages) {
      _ajouterImagesCDT(
        aCours,
        lListeImages,
        GEtatUtilisateur.getGenreOnglet() !==
          Enumere_Onglet_1.EGenreOnglet.SaisieCahierDeTextes,
      );
    }
    if (aCours.avecChargeTAF && lAvecToutesImages) {
      lImage = new ObjetElement_1.ObjetElement(
        "Image_TravailDonnePourCours",
        null,
        2,
      );
      lImage.hint = ObjetTraduction_1.GTraductions.getValeur(
        "CahierDeTexte.TravailPourCeCours",
      );
      lImage.btnImage = true;
      lImage.width = 18;
      lListeImages[
        ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
      ].addElement(lImage);
    }
  } else {
    if (lAvecToutesImages && (aCours.AvecCdTPublie || aCours.avecTafPublie)) {
      if (
        GEtatUtilisateur.getGenreOnglet() ===
        Enumere_Onglet_1.EGenreOnglet.CahierDeTextesClasse
      ) {
        lListeImages[
          ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basG
        ].addElement(new ObjetElement_1.ObjetElement("Image_Publie"));
      }
    }
    if (aCours.cahierDeTextes && lAvecToutesImages) {
      [
        TypeOrigineCreationCategorieCahierDeTexte_1
          .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
        TypeOrigineCreationCategorieCahierDeTexte_1
          .TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
      ].forEach((aGenreCategorie) => {
        _imageCategorieCCDT(
          aCours,
          lListeImages[ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basD],
          aGenreCategorie,
        );
      });
    }
  }
  if (
    aCours.NomImageAppelFait &&
    _afficherGenre(
      TUtilitaireGrilleImageCoursPN.type.appelFait,
      aFiltreUniquement,
    )
  ) {
    lImage = new ObjetElement_1.ObjetElement(aCours.NomImageAppelFait);
    lImage.width = 16;
    switch (aCours.NomImageAppelFait) {
      case "AppelFait":
        lImage.hint = ObjetTraduction_1.GTraductions.getValeur("EDT.AppelFait");
        break;
      case "AppelNonFait":
        lImage.hint =
          ObjetTraduction_1.GTraductions.getValeur("EDT.AppelNonFait");
        break;
      case "AppelVerrouNonFait":
        lImage.hint = ObjetTraduction_1.GTraductions.getValeur(
          "EDT.AppelVerrouNonFait",
        );
        break;
    }
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basD
    ].addElement(lImage);
  }
  if (
    aCours.libelleCours &&
    aCours.libelleCours.abbr &&
    aCours.libelleCours.couleur &&
    lAvecToutesImages
  ) {
    const lColor = GCouleur.getCouleurCorrespondance(
      aCours.libelleCours.couleur,
    );
    lImage = ObjetElement_1.ObjetElement.create({
      html: IE.jsx.str(
        "span",
        {
          class: "libelle-cours-icone",
          style: {
            "--color-background-edt-libellecours": aCours.libelleCours.couleur,
            "--color-text-edt-libellecours": lColor,
          },
          title: aCours.libelleCours.getLibelle(),
          "aria-label": aCours.libelleCours.getLibelle(),
        },
        aCours.libelleCours.abbr,
      ),
    });
    lListeImages[ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautD].add(
      lImage,
    );
  }
  if (aCours.verrouDeplacement && lAvecToutesImages) {
    lImage = new ObjetElement_1.ObjetElement("");
    lImage.html = IE.jsx.str("i", {
      class: "icon_lock",
      style: "font-size:0.9rem; color: #137FDB;",
      role: "presentation",
    });
    lImage.hint = ObjetTraduction_1.GTraductions.getValeur(
      "EDT.CoursVerrouille",
    );
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautD
    ].addElement(lImage);
  }
  if (
    lAvecToutesImages &&
    [
      Enumere_Espace_1.EGenreEspace.PrimProfesseur,
      Enumere_Espace_1.EGenreEspace.PrimDirection,
    ].includes(GEtatUtilisateur.GenreEspace) &&
    GEtatUtilisateur.getGenreOnglet() ===
      Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps_Annuel_Classe
  ) {
    const lLargeurTexte = ObjetChaine_1.GChaine.getLongueurChaine(
      "XXhXX",
      9,
      true,
    );
    lImage = new ObjetElement_1.ObjetElement("");
    lImage.width = lLargeurTexte + 4 + 1;
    lImage.html = [
      '<div class="etiquetteDuree_cours Texte9" style="',
      ObjetStyle_1.GStyle.composeCouleurBordure(aCours.CouleurFond),
      '"',
      ObjetHtml_1.GHtml.composeAttr("ie-class", "getClassImageCours", [
        aIndice,
      ]),
      ">",
      '<div style="',
      ObjetStyle_1.GStyle.composeWidth(lLargeurTexte),
      '">',
      ObjetDate_1.GDate.formatDureeEnMillisecondes(
        ObjetDate_1.GDate.nombrePlacesEnMillisecondes(
          aCours.Fin - aCours.Debut + 1,
        ),
      ),
      "</div>",
      "</div>",
    ].join("");
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautD
    ].addElement(lImage);
  }
  if (
    aCours.dispenseEleve &&
    _afficherGenre(
      TUtilitaireGrilleImageCoursPN.type.dispense,
      aFiltreUniquement,
    )
  ) {
    lImage = new ObjetElement_1.ObjetElement(
      aCours.dispenseEleve.maison
        ? "Image_StickerALaMaison"
        : "Image_StickerDispense",
    );
    lImage.width = 68;
    lImage.hint = aCours.dispenseEleve.getLibelle();
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basD
    ].addElement(lImage);
  }
  if (
    aCours.aucunEleve &&
    _afficherGenre(
      TUtilitaireGrilleImageCoursPN.type.aucunEleve,
      aFiltreUniquement,
    )
  ) {
    lImage = ObjetElement_1.ObjetElement.create({
      html: IE.jsx.str(
        "div",
        { class: "etiquette-aucun-eleve" },
        IE.jsx.str(
          "div",
          null,
          ObjetTraduction_1.GTraductions.getValeur("EDT.AucunEleve"),
        ),
      ),
      title: ObjetTraduction_1.GTraductions.getValeur("EDT.HintAucunEleve"),
      ariaLabel: ObjetTraduction_1.GTraductions.getValeur("EDT.HintAucunEleve"),
    });
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.basD
    ].addElement(lImage);
  }
  if (aCours.estRetenue && aCours.imgRealise) {
    lImage = new ObjetElement_1.ObjetElement("Image_" + aCours.imgRealise);
    lImage.hint = aCours.hintRealise;
    lListeImages[
      ObjetGrilleCours_1.ObjetGrilleCours.positionImage.hautD
    ].addElement(lImage);
  }
  return lListeImages;
};
(function (TUtilitaireGrilleImageCoursPN) {
  let type;
  (function (type) {
    type["appelFait"] = "appelFait";
    type["devoir"] = "devoir";
    type["evaluation"] = "evaluation";
    type["dispense"] = "dispense";
    type["aucunEleve"] = "aucunEleve";
  })(
    (type =
      TUtilitaireGrilleImageCoursPN.type ||
      (TUtilitaireGrilleImageCoursPN.type = {})),
  );
})(
  TUtilitaireGrilleImageCoursPN ||
    (exports.TUtilitaireGrilleImageCoursPN = TUtilitaireGrilleImageCoursPN =
      {}),
);
