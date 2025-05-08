exports.ObjetSmartAppBanner = void 0;
const ObjetSmartAppBannerCP_1 = require("ObjetSmartAppBannerCP");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetSmartAppBanner extends ObjetSmartAppBannerCP_1.ObjetSmartAppBannerCP {
  constructor(aNom) {
    super(aNom);
    $.extend(this.options, {
      urlApp: 'pronote://launch?action="setprofil"&url="' + location.href + '"',
      title: '<div class="Image_Logo_Pronote_AppliMobile">&nbsp;</div>',
      android: {
        appId: "com.IndexEducation.Pronote",
        storeLink: "market://details?id=com.IndexEducation.Pronote",
        line1: ObjetTraduction_1.GTraductions.getValeur(
          "mobile.bandeauAndroid1",
        ),
        line2: ObjetTraduction_1.GTraductions.getValeur(
          "mobile.bandeauAndroid2",
        ),
      },
      ios: {
        appId: "1138223804",
        storeLink: "itms-apps://itunes.apple.com/app/PRONOTE/id1138223804?mt=8",
        storeText: ObjetTraduction_1.GTraductions.getValeur(
          "mobile.storeTextIOS",
        ),
        line1: ObjetTraduction_1.GTraductions.getValeur("mobile.bandeauIOS1"),
        line2: ObjetTraduction_1.GTraductions.getValeur("mobile.bandeauIOS2"),
      },
    });
  }
}
exports.ObjetSmartAppBanner = ObjetSmartAppBanner;
