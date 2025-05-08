exports.WidgetPartenaireARD = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetPartenaireARD extends ObjetWidget_1.Widget.ObjetWidget {
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nodeLienWidgetArd() {
        $(this.node).eventValidation((e) => {
          aInstance.surPartenaireArd();
        });
      },
    });
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    const lWidget = {
      html: this.composeWidgetPartenaireArd(),
      nbrElements: null,
      titre: ObjetTraduction_1.GTraductions.getValeur("accueil.ard.titre"),
      avecActualisation: !!this.donnees.avecActualisation,
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
  }
  composeWidgetPartenaireArd() {
    var _a;
    const H = [];
    if (
      !this.donnees ||
      ((_a = this.donnees.porteMonnaie) === null || _a === void 0
        ? void 0
        : _a.count()) > 0
    ) {
      H.push("<table>");
      H.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "thead",
            null,
            IE.jsx.str(
              "tr",
              null,
              IE.jsx.str(
                "th",
                { scope: "col" },
                ObjetTraduction_1.GTraductions.getValeur(
                  "accueil.ard.porteMonnaie",
                ),
              ),
              IE.jsx.str(
                "th",
                { scope: "col" },
                ObjetTraduction_1.GTraductions.getValeur(
                  "accueil.ard.dernierSolde",
                ),
              ),
            ),
          ),
        ),
      );
      for (let i = 0; i < this.donnees.porteMonnaie.count(); i++) {
        const lPrix = this.donnees.porteMonnaie.get(i);
        const lClass = lPrix.avecWarning ? 'class="date-alert"' : "";
        const lSolde = lPrix.avecWarning
          ? ObjetTraduction_1.GTraductions.getValeur(
              "accueil.ard.attentionSolde",
            ) +
            ": " +
            lPrix.hintSolde
          : lPrix.hintSolde;
        H.push(
          "<tr>",
          '<td title="',
          lPrix.hintPorteMonnaie,
          '">',
          lPrix.libellePorteMonnaie,
          "</td>",
          "<td ",
          lClass,
          ' title="',
          lSolde,
          '">',
          '<span class="info-montant">',
          lPrix.valeurSolde,
          "</span></td>",
          "</tr>",
        );
      }
      H.push("</table>");
    } else {
      H.push(
        '<div class="no-events"><p>',
        ObjetTraduction_1.GTraductions.getValeur("accueil.ard.msgAucun"),
        "</p></div>",
      );
    }
    if (this.donnees.SSO && this.donnees.SSO.intituleLien) {
      H.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "div",
            { class: "link-contain", "ie-node": "nodeLienWidgetArd" },
            IE.jsx.str("label", null, this.donnees.SSO.intituleLien),
            IE.jsx.str("p", null, this.donnees.SSO.description),
          ),
        ),
      );
    }
    return H.join("");
  }
  surPartenaireArd() {
    UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirURLPartenaire(
      this.donnees,
    );
  }
}
exports.WidgetPartenaireARD = WidgetPartenaireARD;
