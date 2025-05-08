exports.ValidationMotDePasse = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const TypeOptionGenerationMotDePasse_1 = require("TypeOptionGenerationMotDePasse");
exports.ValidationMotDePasse = {
  leMotDePasseRespecteReglesSecurite(aMDP, aReglesSaisieMotDePasse) {
    if (
      !aMDP ||
      !aReglesSaisieMotDePasse ||
      !aReglesSaisieMotDePasse.regles ||
      !aReglesSaisieMotDePasse.regles.contains ||
      !MethodesObjet_1.MethodesObjet.isString(aMDP)
    ) {
      return false;
    }
    if (
      aMDP.length < aReglesSaisieMotDePasse.min ||
      (aReglesSaisieMotDePasse.max > 0 &&
        aMDP.length > aReglesSaisieMotDePasse.max)
    ) {
      return false;
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecAuMoinsUneLettre,
      )
    ) {
      if (!aMDP.match(/[a-z]/gi)) {
        return false;
      }
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecAuMoinsUnChiffre,
      )
    ) {
      if (!aMDP.match(/[0-9]/g)) {
        return false;
      }
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecMelangeMinusculeMajuscule,
      )
    ) {
      if (!(aMDP.match(/[a-z]/g) && aMDP.match(/[A-Z]/g))) {
        return false;
      }
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecAuMoinsUnCaractereSpecial,
      )
    ) {
      if (aMDP.replace(/[a-z0-9]/gi, "").length === 0) {
        return false;
      }
    }
    return true;
  },
  construire(aReglesSaisieMotDePasse, aErreursMDP, aOptions) {
    const H = [];
    let lErreursMDP;
    const lOptions = {
      avecEspace: true,
      avecMdpDifferent: false,
      avecMDPDifferentLogin: true,
    };
    $.extend(lOptions, aOptions);
    if (aErreursMDP) {
      lErreursMDP = {
        erreurTailleMDP: false,
        reglesNonRespectes: new TypeEnsembleNombre_1.TypeEnsembleNombre(),
      };
      $.extend(lErreursMDP, aErreursMDP);
    }
    H.push("<ul>");
    H.push(
      '<li class="',
      lOptions.avecEspace ? "m-bottom" : "",
      ' Gras">',
      ObjetTraduction_1.GTraductions.getValeur("validationMDP.titre") + " :",
      "</li>",
    );
    H.push(
      _construireLigneValidateur(
        lErreursMDP ? lErreursMDP.erreurTailleMDP : undefined,
        MethodesObjet_1.MethodesObjet.isNumber(aReglesSaisieMotDePasse.max)
          ? ObjetChaine_1.GChaine.format(
              ObjetTraduction_1.GTraductions.getValeur(
                "validationMDP.longueurMDPMinMax",
              ),
              [aReglesSaisieMotDePasse.min, aReglesSaisieMotDePasse.max],
            )
          : ObjetChaine_1.GChaine.format(
              ObjetTraduction_1.GTraductions.getValeur(
                "validationMDP.longueurMDPMin",
              ),
              [aReglesSaisieMotDePasse.min],
            ),
        lOptions,
      ),
    );
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecAuMoinsUnChiffre,
      )
    ) {
      H.push(
        _construireLigneValidateur(
          lErreursMDP
            ? lErreursMDP.reglesNonRespectes.contains(
                TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
                  .OGMDP_AvecAuMoinsUnChiffre,
              )
            : undefined,
          ObjetTraduction_1.GTraductions.getValeur("validationMDP.chiffre"),
          lOptions,
        ),
      );
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecAuMoinsUneLettre,
      )
    ) {
      H.push(
        _construireLigneValidateur(
          lErreursMDP
            ? lErreursMDP.reglesNonRespectes.contains(
                TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
                  .OGMDP_AvecAuMoinsUneLettre,
              )
            : undefined,
          ObjetTraduction_1.GTraductions.getValeur("validationMDP.lettre"),
          lOptions,
        ),
      );
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecAuMoinsUnCaractereSpecial,
      )
    ) {
      H.push(
        _construireLigneValidateur(
          lErreursMDP
            ? lErreursMDP.reglesNonRespectes.contains(
                TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
                  .OGMDP_AvecAuMoinsUnCaractereSpecial,
              )
            : undefined,
          ObjetTraduction_1.GTraductions.getValeur("validationMDP.special"),
          lOptions,
        ),
      );
    }
    if (
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecMelangeMinusculeMajuscule,
      )
    ) {
      H.push(
        _construireLigneValidateur(
          lErreursMDP
            ? lErreursMDP.reglesNonRespectes.contains(
                TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
                  .OGMDP_AvecMelangeMinusculeMajuscule,
              )
            : undefined,
          ObjetTraduction_1.GTraductions.getValeur("validationMDP.MajMin"),
          lOptions,
        ),
      );
    }
    if (
      lOptions.avecMDPDifferentLogin ||
      aReglesSaisieMotDePasse.regles.contains(
        TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
          .OGMDP_AvecControleIdentifiantDifferent,
      )
    ) {
      H.push(
        _construireLigneValidateur(
          lErreursMDP
            ? lErreursMDP.reglesNonRespectes.contains(
                TypeOptionGenerationMotDePasse_1.TypeOptionGenerationMotDePasse
                  .OGMDP_AvecControleIdentifiantDifferent,
              )
            : undefined,
          ObjetTraduction_1.GTraductions.getValeur("validationMDP.login"),
          lOptions,
        ),
      );
    }
    if (lOptions.avecMdpDifferent) {
      H.push(
        _construireLigneValidateur(
          lErreursMDP ? !!lErreursMDP.MDPIdentique : undefined,
          ObjetTraduction_1.GTraductions.getValeur(
            "validationMDP.mdpDifferent",
          ),
          lOptions,
        ),
      );
    }
    H.push("</ul>");
    return H.join("");
  },
};
function _construireLigneValidateur(aEchec, aTraduction, aOptions) {
  return IE.jsx.str(
    "li",
    {
      class: [
        "flex-contain flex-center flex-gap p-bottom",
        aEchec === undefined ? " p-left-xl" : "",
      ],
    },
    aEchec !== undefined
      ? IE.jsx.str("i", {
          role: "img",
          class: [
            "m-top-s ",
            !aEchec ? "icon_ok ico-green" : "icon_remove ico-red",
          ],
          "aria-label": aEchec
            ? ObjetTraduction_1.GTraductions.getValeur(
                "validationMDP.RegleInvalide",
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "validationMDP.RegleValide",
              ),
        })
      : "",
    IE.jsx.str("p", null, aTraduction),
  );
}
