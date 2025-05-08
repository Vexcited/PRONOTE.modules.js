exports.ObjetFenetre_ParamRecapDevoirRendu = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ParamRecapDevoirRendu extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this._optionsAffichage = {
      aucunRendu: true,
      avecRendu: true,
      avecDepot: true,
      qcm: true,
    };
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      checkAfficherAucunRendu: {
        getValue() {
          return aInstance._optionsAffichage.aucunRendu;
        },
        setValue(aData) {
          aInstance._optionsAffichage.aucunRendu = aData;
        },
      },
      checkAfficherAvecRendu: {
        getValue() {
          return aInstance._optionsAffichage.avecRendu;
        },
        setValue(aData) {
          aInstance._optionsAffichage.avecRendu = aData;
        },
      },
      checkAfficherAvecDepot: {
        getValue() {
          return aInstance._optionsAffichage.avecDepot;
        },
        setValue(aData) {
          aInstance._optionsAffichage.avecDepot = aData;
        },
      },
      checkAfficherQCM: {
        getValue() {
          return aInstance._optionsAffichage.qcm;
        },
        setValue(aData) {
          aInstance._optionsAffichage.qcm = aData;
        },
      },
    });
  }
  composeContenu() {
    const T = [];
    T.push('<div class="Espace">');
    T.push(
      '<div class="EspaceBas">',
      ObjetTraduction_1.GTraductions.getValeur(
        "RecapDevoirRendu.fenetreOptions.libelleConsigne",
      ),
      "</div>",
    );
    T.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { class: "EspaceHaut" },
          IE.jsx.str(
            "ie-checkbox",
            {
              class: "AlignementMilieuVertical",
              "ie-model": "checkAfficherQCM",
            },
            ObjetTraduction_1.GTraductions.getValeur(
              "RecapDevoirRendu.fenetreOptions.avecQCM",
            ),
          ),
        ),
      ),
    );
    T.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { class: "EspaceHaut" },
          IE.jsx.str(
            "ie-checkbox",
            {
              class: "AlignementMilieuVertical",
              "ie-model": "checkAfficherAvecDepot",
            },
            ObjetTraduction_1.GTraductions.getValeur(
              "RecapDevoirRendu.fenetreOptions.avecDepot",
            ),
          ),
        ),
      ),
    );
    T.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { class: "EspaceHaut" },
          IE.jsx.str(
            "ie-checkbox",
            {
              class: "AlignementMilieuVertical",
              "ie-model": "checkAfficherAvecRendu",
            },
            ObjetTraduction_1.GTraductions.getValeur(
              "RecapDevoirRendu.fenetreOptions.avecRendu",
            ),
          ),
        ),
      ),
    );
    T.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { class: "EspaceHaut" },
          IE.jsx.str(
            "ie-checkbox",
            {
              class: "AlignementMilieuVertical",
              "ie-model": "checkAfficherAucunRendu",
            },
            ObjetTraduction_1.GTraductions.getValeur(
              "RecapDevoirRendu.fenetreOptions.avecSansRendu",
            ),
          ),
        ),
      ),
    );
    T.push("</div>");
    return T.join("");
  }
  setDonnees(aDonnees) {
    this._optionsAffichage = Object.assign({}, aDonnees);
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton, this._optionsAffichage);
  }
}
exports.ObjetFenetre_ParamRecapDevoirRendu = ObjetFenetre_ParamRecapDevoirRendu;
