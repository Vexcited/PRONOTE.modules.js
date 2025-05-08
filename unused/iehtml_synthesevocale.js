const IEHtml = require("IEHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
IEHtml.addAttribut(
  "ie-synthesevocale",
  async (aContexteCourant, aNodeName, aAttributValue, aOutils) => {
    if (!UtilitaireSyntheseVocale_1.SyntheseVocale.getActif()) {
      return true;
    }
    let lValue = aAttributValue || "";
    const lJNode = $(aContexteCourant.node);
    let lResult = { text: "" };
    if (["", "true"].includes(lValue)) {
      lResult.text = lJNode.text() || lJNode.val();
    } else {
      const lInfos = aOutils.getAccesParametres(lValue, aContexteCourant);
      lResult = lInfos.callback([aContexteCourant.node, aContexteCourant.data]);
      if (lResult.text === "") {
        lResult.text = lJNode.text() || lJNode.val();
      }
    }
    if (
      !UtilitaireSyntheseVocale_1.SyntheseVocale.supportee &&
      !GApplication.estAppliMobile
    ) {
      return true;
    }
    const lVoix = UtilitaireSyntheseVocale_1.SyntheseVocale.getVoix();
    if (!lVoix && !GApplication.estAppliMobile) {
      return true;
    }
    const lID = lResult.idCourant ? `id="${lResult.idCourant}"` : "";
    let lJNodeSpeaker = $(
      `<div role="presentation" class="sv_speech"><i ${lID} class="icone icon_play_sign btnImage" role="button" tabindex="0" aria-label="${ObjetTraduction_1.GTraductions.getValeur("SyntheseVocale.BoutonPlayStop")}"></i></div>`,
    );
    const lJNodePlay = $(lJNodeSpeaker).children("i").last();
    lJNodePlay.eventValidation(() => {
      UtilitaireSyntheseVocale_1.SyntheseVocale.speak(
        aContexteCourant.node,
        lJNodePlay,
        lResult,
      );
    });
    aOutils.abonnerRefresh(
      () => {
        lJNodeSpeaker.css("display", lJNode.text() || lJNode.val());
      },
      aContexteCourant.node,
      aContexteCourant,
    );
    aOutils.surInjectionHtml(aContexteCourant, () => {
      lJNode.append(lJNodeSpeaker);
    });
    aOutils.addCommentaireDebug(
      aContexteCourant.node,
      'ie-synthesevocale="' + lValue + '"',
    );
  },
);
