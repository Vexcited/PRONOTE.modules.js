exports.ObjetBoutonFlottant = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const GUID_1 = require("GUID");
const jsx_1 = require("jsx");
class ObjetBoutonFlottant extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.iconeCommandeDefaut = "icon_ellipsis_vertical";
    this.positionHorizontalDefaut = "";
    this.positionVerticalDefaut = "bottom";
    this.IdBouton = GUID_1.GUID.getId();
    this.initOptionsBouton();
  }
  setOptionsBouton(aOptions) {
    $.extend(this.optionsBouton, aOptions);
  }
  getOptionsBouton() {
    return this.optionsBouton;
  }
  actualiser(aParam) {
    if (!!aParam) {
      this.setOptionsBouton(aParam);
    }
    this.afficher();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nodeBtn: function (aIndex) {
        const lBouton = aInstance.optionsBouton.listeBoutons[aIndex];
        if (!!lBouton) {
          $(this.node).eventValidation(lBouton.callback);
        }
      },
      avecAffichageBouton: function (aIndex) {
        const lBouton = aInstance.optionsBouton.listeBoutons[aIndex];
        if (lBouton && lBouton.avecPresenceBoutonDynamique) {
          return lBouton.avecPresenceBoutonDynamique();
        }
        return true;
      },
      nodeBtnCommande: function (aIndexCommande, aIndex) {
        const lBouton =
          aInstance.optionsBouton.listeBoutons[aIndexCommande].boutons[aIndex];
        if (!!lBouton) {
          $(this.node).eventValidation(lBouton.callback);
        }
      },
    });
  }
  construireAffichage() {
    return (
      this.validerListeBouton() &&
      IE.jsx.str(
        "div",
        {
          class: [
            "floating-btn-position",
            this.getClassPosition(),
            this.optionsBouton.fluide,
            this.optionsBouton.retractable && "togglable",
          ],
        },
        IE.jsx.str(
          "div",
          { class: "float-global-conteneur" },
          this.composeBoutons(),
        ),
      )
    );
  }
  composeUnSeulBouton(aBouton, aIndex) {
    if (this.validerParametreBouton(aBouton)) {
      const aIdBtn = GUID_1.GUID.getId();
      let lFuncIFAvecBouton = "";
      if (!!aBouton.avecPresenceBoutonDynamique) {
        lFuncIFAvecBouton = "avecAffichageBouton(" + aIndex + ")";
      }
      return IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("input", {
          "ie-if": lFuncIFAvecBouton,
          type: "checkbox",
          id: aIdBtn,
          class: "on-off",
        }),
        IE.jsx.str(
          "label",
          {
            "ie-if": lFuncIFAvecBouton,
            for: aIdBtn,
            id: this.IdBouton,
            "ie-node": (0, jsx_1.jsxFuncAttr)("nodeBtn", aIndex),
            class: [
              "btn-float",
              aBouton.primaire && "primary",
              aBouton.disabled && "disabled",
            ],
          },
          IE.jsx.str("i", { class: ["icon", aBouton.icone] }),
        ),
      );
    }
  }
  composeBoutonCommande(aListeBouton, aIndexBoutonCommande) {
    let lIdBtn = GUID_1.GUID.getId();
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str("input", { type: "checkbox", id: lIdBtn, class: "on-off" }),
      IE.jsx.str(
        "label",
        {
          for: lIdBtn,
          class: [
            "as-button primary command",
            aListeBouton.disabled && "disabled",
            this.optionsBouton.fluide,
          ],
        },
        IE.jsx.str("i", {
          class: ["icon", aListeBouton.icone || this.iconeCommandeDefaut],
        }),
      ),
      IE.jsx.str(
        "ul",
        { class: "sub-float-menu" },
        aListeBouton.boutons.map((aBouton, aIndex) => {
          return (
            this.validerParametreBouton(aBouton) &&
            IE.jsx.str(
              "li",
              {
                class: [aBouton.disabled && "disabled"],
                "ie-node":
                  aBouton.callback &&
                  (0, jsx_1.jsxFuncAttr)("nodeBtnCommande", [
                    aIndexBoutonCommande,
                    aIndex,
                  ]),
              },
              aBouton && IE.jsx.str("label", null, " ", aBouton.libelle, " "),
              IE.jsx.str("i", { class: ["icon", aBouton.icone] }),
            )
          );
        }),
      ),
    );
  }
  composeBoutons() {
    const lHtml = [];
    const lInstance = this;
    this.optionsBouton.listeBoutons.forEach((aBouton, aIndex) => {
      if (!!aBouton.boutons && aBouton.boutons.length > 0) {
        lHtml.push(lInstance.composeBoutonCommande(aBouton, aIndex));
      } else {
        lHtml.push(lInstance.composeUnSeulBouton(aBouton, aIndex));
      }
    });
    return lHtml.join(" ");
  }
  validerListeBouton() {
    if (this.optionsBouton.listeBoutons.length === 0) {
      return false;
    } else if (
      !!this.optionsBouton.listeBoutons &&
      !Array.isArray(this.optionsBouton.listeBoutons)
    ) {
      return false;
    }
    return true;
  }
  getClassPosition() {
    const lHtml = [];
    const lHorizontal =
      this.optionsBouton.position && this.optionsBouton.position.horizontal
        ? this.optionsBouton.position.horizontal
        : this.positionHorizontalDefaut;
    const lVertical =
      this.optionsBouton.position && this.optionsBouton.position.vertical
        ? this.optionsBouton.position.vertical
        : this.positionVerticalDefaut;
    lHtml.push(lHorizontal ? "h-" + lHorizontal : "");
    lHtml.push(lVertical ? "v-" + lVertical : "");
    return lHtml.join(" ");
  }
  validerParametreBouton(lBouton) {
    if (!!lBouton.boutons && !Array.isArray(lBouton.boutons)) {
      return false;
    }
    if (!lBouton.icone) {
      return false;
    }
    return true;
  }
  initOptionsBouton() {
    this.optionsBouton = {
      fluide: "",
      retractable: false,
      position: { vertical: "bottom", horizontal: "" },
      listeBoutons: [
        {
          primaire: false,
          icone: "icon_diffuser_information",
          libelle: "",
          disabled: false,
          boutons: [{ icone: "", libelle: "", disabled: false }],
        },
      ],
    };
  }
}
exports.ObjetBoutonFlottant = ObjetBoutonFlottant;
