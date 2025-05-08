const { Identite } = require("ObjetIdentite.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const EGenreEvntBlocCard = { edition: "edition" };
class BlocCard extends Identite {
  constructor(...aParams) {
    super(...aParams);
    this.ids = { card: GUID.getId() };
    this.default = { avecEtendre: false };
    this.donneesRecues = false;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeCard: function () {
        if (aInstance.donnees.editable) {
          const lMap = {
            click: function (aEvent) {
              if (
                $(aEvent.originalEvent.target)
                  .parentsUntil(aEvent.currentTarget)
                  .addBack()
                  .filter("a").length === 1
              ) {
                return;
              }
              aInstance.declencherCallback({
                genreEvnt: EGenreEvntBlocCard.edition,
              });
            }.bind(aInstance),
          };
          $(this.node).on(lMap);
        }
      },
    });
  }
  declencherCallback(aParam) {
    if (this.Pere && this.Evenement) {
      this.callback.appel(this.donnees.data, aParam.genreEvnt, aParam.param);
    }
  }
  setParam(aParam) {
    this.param = $.extend(this.default, aParam);
  }
  setDonnees(aParam) {
    this.donneesRecues = true;
    this.donnees = aParam;
  }
  afficher() {
    const H = [];
    if (this.donneesRecues) {
      const lEditable = this.donnees.editable;
      H.push(
        '<article id="',
        this.ids.card,
        '" ',
        GHtml.composeAttr("ie-node", "getNodeCard"),
        ' class=" ',
        "BlocCard ",
        lEditable ? "Editable" : "",
        '" tabindex="0">',
      );
      H.push('<section class="Main">');
      H.push(
        '<div class="info-principale">',
        this.donnees.htmlInfoPrincipale,
        "</div>",
      );
      if (this.param.avecEtendre && this.donnees.htmlInfoSecondaire !== "") {
        H.push('<i class="icon_chevron_down IconDeployer"></i>');
      }
      H.push("</section>");
      H.push('<section class="Secondary">');
      H.push(this.donnees.htmlInfoSecondaire);
      H.push("</section>");
      H.push("</article>");
    }
    return H.join("");
  }
  composeHtmlMsg(aMsg) {
    const H = [];
    H.push('<article class="BlocCard" tabindex="0">');
    H.push('<section class="MsgInfo">');
    H.push(
      '<i class="MainText IconInfo icon_diffuser_info" style="padding-right:0.5em;"></i>',
    );
    H.push('<div class="MsgLibelle">', aMsg, "</div>");
    H.push("</section>");
    H.push("</article>");
    return H.join("");
  }
  composeHtmlZoneInfo(aParam) {
    const lContent = aParam.html;
    const lAvecSeparateur = aParam.avecSeparateur === true;
    const lEstDernier = aParam.estDernier === true;
    const H = [];
    H.push(
      '<div class="ZoneInfo ',
      lAvecSeparateur ? " Separateur " : "",
      lEstDernier ? " Last " : "",
      '">',
    );
    H.push(lContent);
    H.push("</div>");
    return H.join("");
  }
  composeHtmlInfoPrincipale(aParam) {
    const H = [];
    H.push('<div class="MainText">');
    H.push(aParam.html);
    H.push("</div>");
    return H.join("");
  }
  composeHtmlInfoSecondaire(aParam) {
    const H = [];
    H.push('<div class="SecondaryText-container">');
    if (aParam.icon) {
      H.push('<i class="SecondaryText ', aParam.icon, '"></i>');
    } else if (aParam.htmlIconInfo) {
      H.push(
        '<div class="SecondaryText iconic">',
        aParam.htmlIconInfo,
        "</div>",
      );
    }
    H.push('<span class="SecondaryText">', aParam.libelleInfo, "</span>");
    H.push("</div>");
    return H.join("");
  }
  composeHtmlPJ(aListePJ) {
    const lHtmlPJ = [];
    if (!!aListePJ) {
      lHtmlPJ.push(UtilitaireUrl.construireListeUrls(aListePJ));
    }
    return lHtmlPJ.join("");
  }
}
module.exports = { BlocCard, EGenreEvntBlocCard };
