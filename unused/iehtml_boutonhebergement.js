const IEHtml = require("IEHtml");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetWAI_1 = require("ObjetWAI");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetWAI_2 = require("ObjetWAI");
IEHtml.addBalise("ie-boutonhebergement", (aContexteCourant, aOutils) => {
  let lCouleurs = {
      couleurFond: GCouleur.blanc,
      couleurFondSurvol: GCouleur.fond,
      couleurTexteInactif: GCouleur.bordure,
      couleurFondInactif: GCouleur.nonEditable.fond,
      couleurBordureSup: GCouleur.grisTresClair.fond,
      couleurBordureSupSurvol: GCouleur.grisTresClair.fond,
      couleurBordureInf: GCouleur.grisTresClair.fond,
      couleurBordureInfSurvol: GCouleur.grisFonce,
    },
    lBakDisabled = false;
  let lDOMContenu;
  function _surMouseOver() {
    if (lBakDisabled) {
      return;
    }
    _actualiserBouton($(this), true);
  }
  function _surMouseOut() {
    if (lBakDisabled) {
      return;
    }
    _actualiserBouton($(this));
  }
  function _actualiserBouton(aJBouton, aSurvol) {
    if (aSurvol) {
      aJBouton.css({
        "background-color": lCouleurs.couleurFondSurvol,
        "border-bottom": "1px solid " + lCouleurs.couleurBordureInfSurvol,
        "border-right": "1px solid " + lCouleurs.couleurBordureInfSurvol,
      });
      $(lDOMContenu).addClass("Gras");
    } else {
      aJBouton.css({
        color: lBakDisabled ? lCouleurs.couleurTexteInactif : GCouleur.noir,
        "background-color": lBakDisabled
          ? lCouleurs.couleurFondInactif
          : lCouleurs.couleurFond,
        border: "1px solid " + lCouleurs.couleurBordureSup,
      });
      aJBouton
        .addClass(lBakDisabled ? "SansMain" : "AvecMain")
        .removeClass(lBakDisabled ? "AvecMain" : "SansMain");
      $(lDOMContenu).removeClass("Gras");
    }
  }
  let lInnerHtml = aContexteCourant.node.innerHTML;
  const H = [],
    lTextAlignRight = aContexteCourant.node.hasAttribute("ie-textalignRight"),
    lImageAlignRight = aContexteCourant.node.hasAttribute("ie-imagealignRight");
  H.push(
    '<div tabindex="0" ' +
      ObjetWAI_2.GObjetWAI.composeRole(ObjetWAI_1.EGenreRole.Button),
    ">",
  );
  H.push('<div style="flex:none; padding-left: 3px;"></div>');
  H.push(
    '<div class="EspaceGauche EspaceDroit Insecable" style="flex: 1 2 auto; text-align:',
    lTextAlignRight ? "right" : "left",
    ';"></div>',
  );
  H.push("</div>");
  const lBouton = ObjetHtml_1.GHtml.htmlToDOM(H.join("")),
    lDOMImage = lBouton.firstChild,
    lJBouton = $(lBouton);
  lDOMContenu = lDOMImage.nextSibling;
  let lDisabled = false;
  const lModele = aOutils.getModel(aContexteCourant);
  if (lModele && aContexteCourant.data.$modeleParsed) {
    const lInfosEvent = aOutils.getAccesParametresModel(
        "event",
        aContexteCourant,
      ),
      lInfosGetDisabled = aOutils.getAccesParametresModel(
        "getDisabled",
        aContexteCourant,
      ),
      lInfosGetCssImage = aOutils.getAccesParametresModel(
        "getCssImage",
        aContexteCourant,
      ),
      lInfosGetHtml = aOutils.getAccesParametresModel(
        "getHtml",
        aContexteCourant,
      ),
      lAvecControleSaisie = aOutils.getControleSaisieEvent(aContexteCourant);
    if (lInfosEvent.estFonction) {
      const lRefresh = aContexteCourant.contexte.refresh;
      lJBouton.on("click keyup", function (event) {
        if (lBakDisabled) {
          return;
        }
        if (
          event.type === "keyup" &&
          !(
            event.which === ToucheClavier_1.ToucheClavier.Espace ||
            event.which === ToucheClavier_1.ToucheClavier.RetourChariot
          )
        ) {
          return;
        }
        const lAction = () => {
          const lResult = lInfosEvent.callback([
            event,
            this,
            aContexteCourant.data,
          ]);
          lRefresh();
          return lResult;
        };
        if (lAvecControleSaisie) {
          (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(lAction);
        } else {
          return lAction();
        }
      });
    }
    if (lInfosGetDisabled.valide) {
      const lGetter = function () {
        return !!lInfosGetDisabled.callback([lBouton, aContexteCourant.data]);
      };
      if (lInfosGetDisabled.estFonction || !lGetter() || lGetter() === true) {
        lDisabled = !!lGetter();
        aOutils.abonnerRefresh(
          () => {
            const lDisabled = !!lGetter();
            if (lDisabled !== lBakDisabled) {
              lBakDisabled = lDisabled;
              _actualiserBouton(lJBouton);
            }
          },
          lBouton,
          aContexteCourant,
        );
      } else {
        IE.log.addLog(
          'echec getDisabled de ie-bouton, propriété incorrecte du model "' +
            lModele +
            '"',
        );
      }
    }
    if (lInfosGetCssImage.estFonction) {
      const lGetterCssImage = function () {
        let lCss = lInfosGetCssImage.callback([lDOMImage]);
        if (!MethodesObjet_1.MethodesObjet.isString(lCss)) {
          lCss = "";
        }
        return lCss;
      };
      let lCssBak = lGetterCssImage();
      if (lCssBak) {
        $(lDOMImage).addClass(lCssBak);
      }
      aOutils.abonnerRefresh(
        () => {
          const lCss = lGetterCssImage();
          if (lCss !== lCssBak) {
            $(lDOMImage).removeClass(lCssBak).addClass(lCss);
            lCssBak = lCss;
          }
        },
        lBouton,
        aContexteCourant,
      );
    }
    if (lInfosGetHtml.estFonction) {
      lInnerHtml = lInfosGetHtml.callback([lDOMContenu]) + "";
      aOutils.abonnerRefresh(
        () => {
          const lHtml = lInfosGetHtml.callback([lDOMContenu]) + "";
          if (lHtml !== lInnerHtml) {
            lInnerHtml = lHtml;
            $(lDOMContenu).ieHtml("");
            aOutils.injectHTML({
              element: lDOMContenu,
              html: lInnerHtml,
              controleur: aContexteCourant.controleur,
              ignorerScroll: true,
              contexte: aContexteCourant.contexte,
            });
          }
        },
        lBouton,
        aContexteCourant,
      );
    }
  }
  aOutils.copyAttributs(aContexteCourant.node, lBouton, (aName, aValue) => {
    if (aName === "src") {
      $(lDOMImage).attr(aName, aValue);
      return false;
    } else if (
      aName !== "ie-textalignright" &&
      aName !== "ie-imagealignright"
    ) {
      lJBouton.attr(aName, aValue);
    } else {
      return false;
    }
  });
  lJBouton.css({ flexDirection: lImageAlignRight ? "row-reverse" : "row" });
  lBakDisabled = lDisabled;
  _actualiserBouton(lJBouton);
  lJBouton
    .addClass("ie-boutonhebergement")
    .on({
      "mouseleave mouseout": _surMouseOut,
      "mousenter mouseover": _surMouseOver,
    });
  const lRacine = lJBouton.get(0);
  aOutils.replaceNode(aContexteCourant.node, lRacine);
  aContexteCourant.node = lJBouton.get(0);
  if (lInnerHtml) {
    aOutils.injectHTML({
      element: lDOMContenu,
      html: lInnerHtml,
      controleur: aContexteCourant.controleur,
      ignorerScroll: true,
      contexte: aContexteCourant.contexte,
    });
  }
  aOutils.addCommentaireDebug(
    lRacine,
    "ie-boutonhebergement" +
      (lTextAlignRight ? " ie-textalignright" : "") +
      (lImageAlignRight ? " ie-imagealignright" : ""),
  );
  return { node: aContexteCourant.node, avecCompileFils: false };
});
