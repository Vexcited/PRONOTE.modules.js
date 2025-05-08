exports.ObjetFicheAppliMobile = void 0;
const ObjetFiche_1 = require("ObjetFiche");
const ObjetRequeteSaisieJetonAppliMobile_1 = require("ObjetRequeteSaisieJetonAppliMobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const UtilitaireQRCode_1 = require("UtilitaireQRCode");
class ObjetFicheAppliMobile extends ObjetFiche_1.ObjetFiche {
  constructor(...aParams) {
    super(...aParams);
    this.code = "";
    this.idCodeWrapper = GUID_1.GUID.getId();
    this.idLienWrapper = GUID_1.GUID.getId();
    this.idConfigWrapper = GUID_1.GUID.getId();
    this.idInputCode = GUID_1.GUID.getId();
    this.idLien = GUID_1.GUID.getId();
    this.url = "";
    this.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur("AppliMobile.titreFiche"),
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      inputCode: {
        getValue() {
          return aInstance.code;
        },
        setValue(aValue) {
          aInstance.code = aValue.substring(0, 4);
        },
      },
      btnCode: {
        event: function () {
          new ObjetRequeteSaisieJetonAppliMobile_1.ObjetRequeteSaisieJetonAppliMobile(
            aInstance,
          )
            .lancerRequete({ code: aInstance.code })
            .then(
              (aData) => {
                const lData = aData.JSONReponse;
                if (lData && lData.jeton && lData.login) {
                  lData.url = aInstance.url;
                  $("#" + aInstance.idLien.escapeJQ()).hide();
                  $("#" + aInstance.idCodeWrapper.escapeJQ()).hide();
                  $("#" + aInstance.idConfigWrapper.escapeJQ()).show();
                  $("#" + aInstance.idLienWrapper.escapeJQ())
                    .html(
                      UtilitaireQRCode_1.UtilitaireQRCode.genererImage(
                        JSON.stringify(lData),
                        {
                          taille: 320,
                          alt: ObjetTraduction_1.GTraductions.getValeur(
                            "QRCodeAppliMobile",
                          ),
                        },
                      ),
                    )
                    .show();
                } else {
                  GApplication.getMessage()
                    .afficher({
                      message: ObjetTraduction_1.GTraductions.getValeur(
                        "AppliMobile.ErreurRequete",
                      ),
                    })
                    .then(() => {
                      aInstance.fermer();
                    });
                }
              },
              () => {
                GApplication.getMessage()
                  .afficher({
                    message: ObjetTraduction_1.GTraductions.getValeur(
                      "AppliMobile.ErreurRequete",
                    ),
                  })
                  .then(() => {
                    aInstance.fermer();
                  });
              },
            );
        },
        getDisabled: function () {
          return !aInstance.code || aInstance.code.length !== 4;
        },
      },
    });
  }
  composeContenu() {
    if (this.url) {
      const H = [];
      H.push(
        '<div style="width:475px;"  class="ie-texte">',
        `<div id="${this.idCodeWrapper}" class="m-bottom-xl">`,
        `<p class="m-top-none">${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.ModeOpQrCode", [GApplication.nomProduit])}</p>`,
        `<label class="m-y-xl semi-bold" for="${this.idInputCode}">${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.CodeVerification")}`,
        `<input id="${this.idInputCode}" type="password" ie-mask="/[^0-9]/i" maxlength="4" size="2" class="m-left as-input" ie-model="inputCode" autocomplete="new-password"/></label>`,
        `<div style="text-align:right;"><ie-bouton ie-model="btnCode">${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.GenererQRCode")}</ie-bouton></div>`,
        "</div>",
        `<div id="${this.idConfigWrapper}" style="display:none;">`,
        `<ul style="list-style: decimal;"><li>${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.MethodeConfig", [GApplication.nomProduit])}</li>`,
        `<li>${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.MethodeConfigSuite")}</li>`,
        `<li>${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.MethodeConfigSuite2")}</li>`,
        `<li>${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.MethodeConfigFin")}</li></ul>`,
        "</div>",
        `<div id="${this.idLienWrapper}" class="text-center m-y-none m-x-auto" style="background-color:#fff;display:none;"></div>`,
        `<div id="${this.idLien}" class="ie-texte-small">`,
        `<p>${ObjetTraduction_1.GTraductions.getValeur("AppliMobile.AccesSiteMobile")}</p>`,
        `<a href="${this.url}" target="_blank">${this.url}</a>`,
        "</div>",
        "</div>",
      );
      return H.join("");
    }
    return "";
  }
  afficher(aUrlMobile) {
    if (aUrlMobile) {
      const lUrl = window.location.href.split("/");
      lUrl.pop();
      lUrl.push(aUrlMobile);
      this.url = lUrl.join("/");
    }
    return super.afficher();
  }
}
exports.ObjetFicheAppliMobile = ObjetFicheAppliMobile;
