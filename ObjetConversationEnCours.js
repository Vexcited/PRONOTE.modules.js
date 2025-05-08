exports.ObjetConversationEnCours = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const MoteurMessagerie_1 = require("MoteurMessagerie");
const ObjetIdentite_1 = require("ObjetIdentite");
const UtilitaireMessagerie_1 = require("UtilitaireMessagerie");
class ObjetConversationEnCours extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      message: null,
      surFermer: null,
      surMessage: null,
      surQuitter: null,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnFerme: {
        event: function (aEvent) {
          aEvent.stopPropagation();
          aInstance.options.surFermer();
        },
      },
      getNodeConteneur: function () {
        $(this.node).eventValidation(() => {
          if (aInstance.options.surMessage) {
            aInstance.options.surMessage();
          }
        });
      },
      getNodeQuitter: function () {
        $(this.node).eventValidation((aEvent) => {
          aEvent.stopPropagation();
          MoteurMessagerie_1.MoteurMessagerie.saisieSortirConversation(
            aInstance,
            aInstance.options.message,
          );
          if (aInstance.options.surQuitter) {
            aInstance.options.surQuitter();
          }
        });
      },
    });
  }
  construireAffichage() {
    const lMessage = this.options.message;
    if (!lMessage || $("#" + this.Nom.escapeJQ()).length === 0) {
      return "";
    }
    const H = [];
    $("#" + this.Nom.escapeJQ()).addClass("ObjetConversationEnCours");
    if (this.options.surFermer) {
      H.push(
        '<ie-btnimage ie-model="btnFerme" class="btnImageIcon icon_remove"></ie-btnimage>',
      );
    }
    H.push('<div class="cec_conteneur" ie-node="getNodeConteneur">');
    H.push(
      '<div class="cec_titre">',
      lMessage.libelleDate,
      "&nbsp;-&nbsp;",
      UtilitaireMessagerie_1.UtilitaireMessagerie.getLibelleParticipants(
        lMessage,
        false,
      ),
      "</div>",
    );
    if (lMessage.contenu) {
      H.push("<div>", lMessage.contenu, "</div>");
    }
    H.push('<div class="cec_lignefin">');
    if (lMessage.nbNonLus > 0) {
      H.push(
        "<label>",
        lMessage.nbNonLus < 2
          ? ObjetTraduction_1.GTraductions.getValeur(
              "Messagerie.UnNouveauMessage",
            )
          : ObjetTraduction_1.GTraductions.getValeur(
              "Messagerie.NNouveauxMessages",
              [lMessage.nbNonLus],
            ),
        "</label>",
      );
    }
    H.push(
      '<a ie-node="getNodeQuitter" class="AvecMain">',
      ObjetTraduction_1.GTraductions.getValeur(
        "Messagerie.QuitterModeInstantane",
      ),
      "</a>",
    );
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
}
exports.ObjetConversationEnCours = ObjetConversationEnCours;
