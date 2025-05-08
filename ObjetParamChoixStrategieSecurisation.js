exports.ObjetParamChoixStrategieSecurisation = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeSecurisationCompte_1 = require("TypeSecurisationCompte");
const ObjetRequeteSecurisationCompte_1 = require("ObjetRequeteSecurisationCompte");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetSaisieCodePIN_1 = require("ObjetSaisieCodePIN");
const ObjetChoixStrategieSecurisation_1 = require("ObjetChoixStrategieSecurisation");
class ObjetParamChoixStrategieSecurisation extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.instanceChoix = ObjetIdentite_1.Identite.creerInstance(
      ObjetChoixStrategieSecurisation_1.ObjetChoixStrategieSecurisation,
      { pere: this },
    );
  }
  static avecParametrageVisible(aDonnees) {
    return (
      aDonnees &&
      aDonnees.modesPossibles &&
      !(
        aDonnees.modesPossibles.count() === 1 &&
        aDonnees.modesPossibles.contains(
          TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
            .MGDA_Inactive,
        ) &&
        aDonnees.mode ===
          TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
            .MGDA_Inactive &&
        aDonnees.listeSourcesConnexions &&
        aDonnees.listeSourcesConnexions.count() === 0
      )
    );
  }
  setDonnees(aDonnees, aFuncDisabled) {
    this.donnees = aDonnees;
    this.afficher('<div id="' + this.instanceChoix.getNom() + '"></div>');
    this.instanceChoix
      .setOptions({
        modeAffichage:
          ObjetChoixStrategieSecurisation_1.ObjetChoixStrategieSecurisation
            .typeAffichage.prefUtilisateur,
        modesPossibles: aDonnees.modesPossibles,
        modeSecurisationParDefaut: GEtatUtilisateur.modeSecurisationParDefaut,
        callbackChoix: (aGenre, aSurBtnModifer) => {
          this._affecterChoix(aGenre, aSurBtnModifer);
        },
        getDisabled: aFuncDisabled,
      })
      .setDonnees(aDonnees);
  }
  _ouvrirFenetrePINAsync(aMode) {
    return new Promise((aResolve, aReject) => {
      const lOptionsPIN = {
        classeRequete:
          ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationComptePreference,
        modePIN: aMode,
        estAffCompte: true,
      };
      ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        _ObjetFenetre_SaisieCodePIN,
        {
          pere: this,
          evenement: function () {
            aReject();
          },
        },
        {
          titre:
            aMode ===
            ObjetSaisieCodePIN_1.ObjetSaisieCodePIN.ModeSaisieValiderPIN
              .ControlePIN
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "DoubleAuth.RenforcerSecuTitre",
                )
              : ObjetTraduction_1.GTraductions.getValeur(
                  "DoubleAuth.TitreFiche",
                ),
          callbackPIN: function (aResult) {
            aResolve(aResult);
          },
        },
      ).setDonnees(lOptionsPIN, {
        mode: TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
          .MGDA_SaisieCodePIN,
      });
    });
  }
  async _affecterChoix(aGenreChoix, aSurBtnModifer) {
    const lParamsRequete = {};
    let lOk = true;
    try {
      if (aSurBtnModifer) {
        const lResultPIN = await this._ouvrirFenetrePINAsync(
          ObjetSaisieCodePIN_1.ObjetSaisieCodePIN.ModeSaisieValiderPIN
            .ControlerModifierPIN,
        );
        Object.assign(lParamsRequete, {
          action:
            TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
              .csch_AffecterCodePIN,
          codePin: lResultPIN.codePIN,
          ancienCodePin: lResultPIN.controleCodePINAvantModif,
        });
      } else if (
        aGenreChoix ===
        TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
          .MGDA_SaisieCodePIN
      ) {
        const lResultPIN = await this._ouvrirFenetrePINAsync(
          ObjetSaisieCodePIN_1.ObjetSaisieCodePIN.ModeSaisieValiderPIN
            .DefinirPIN,
        );
        Object.assign(lParamsRequete, {
          action:
            TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
              .csch_AffecterCodePIN,
          codePin: lResultPIN.codePIN,
        });
      } else {
        if (
          this.donnees &&
          this.donnees.mode ===
            TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
              .MGDA_SaisieCodePIN
        ) {
          const lResultPIN = await this._ouvrirFenetrePINAsync(
            ObjetSaisieCodePIN_1.ObjetSaisieCodePIN.ModeSaisieValiderPIN
              .ControlePIN,
          );
          lParamsRequete.ancienCodePin = lResultPIN.codePIN;
        }
        Object.assign(lParamsRequete, {
          action:
            TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
              .csch_AffecterModeDoubleAuthentification,
          mode: aGenreChoix,
        });
      }
      await new ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationComptePreference(
        this,
      ).lancerRequete(lParamsRequete);
    } catch (e) {
      lOk = false;
    }
    if (lOk) {
      this.callback.appel({ actualiser: true });
    }
  }
}
exports.ObjetParamChoixStrategieSecurisation =
  ObjetParamChoixStrategieSecurisation;
class _ObjetFenetre_SaisieCodePIN extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.ancienCodePIN = "";
    this.setOptionsFenetre({
      avecTailleSelonContenu: true,
      listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Annuler")],
    });
  }
  construireInstances() {
    this.identPIN = this.add(
      ObjetSaisieCodePIN_1.ObjetSaisieCodePIN,
      (aParams) => {
        if (aParams && aParams.codePINVerifReinit) {
          this.ancienCodePIN = aParams.codePINVerifReinit;
        } else if (aParams && aParams.codePin) {
          this.optionsFenetre.callbackPIN({
            codePIN: aParams.codePin,
            controleCodePINAvantModif: this.ancienCodePIN,
          });
          this.fermer();
        }
      },
    );
  }
  composeContenu() {
    return IE.jsx.str("div", { id: this.getInstance(this.identPIN).getNom() });
  }
  setDonnees(aOptions, aDonnees) {
    this.afficher();
    this.getInstance(this.identPIN).setOptions(aOptions).setDonnees(aDonnees);
  }
}
