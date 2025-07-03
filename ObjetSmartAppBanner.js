exports.ObjetSmartAppBanner = void 0;
const AccessApp_1 = require("AccessApp");
const ObjetSmartAppBannerCP_1 = require("ObjetSmartAppBannerCP");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetSmartAppBanner extends ObjetSmartAppBannerCP_1.ObjetSmartAppBannerCP {
	constructor(aNom) {
		super(aNom);
		this.appSco = (0, AccessApp_1.getApp)();
		this.parametresSco = this.appSco.getObjetParametres();
		if (this.appSco.estEDT) {
			this.setProduitEDT();
		} else {
			this.setProduitPronote();
		}
	}
	show() {
		if (!this.parametresSco.estAfficheDansENT) {
			super.show();
		}
	}
	setProduitPronote() {
		this.nomLogo = ObjetSmartAppBannerCP_1.ENomLogo.pronote;
		$.extend(this.options, {
			urlApp: 'pronote://launch?action="setprofil"&url="' + location.href + '"',
			title: '<div class="logo_pronote">&nbsp;</div>',
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
	setProduitEDT() {
		this.nomLogo = ObjetSmartAppBannerCP_1.ENomLogo.edt;
		$.extend(this.options, {
			urlApp: 'pronote://launch?action="setprofil"&url="' + location.href + '"',
			title: '<div class="logo_edt">&nbsp;</div>',
			android: {
				appId: "com.IndexEducation.Edt",
				storeLink: "market://details?id=com.IndexEducation.Edt",
				line1: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.bandeauAndroid1",
				),
				line2: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.bandeauAndroid2",
				),
			},
			ios: {
				appId: "1138223804",
				storeLink: "itms-apps://itunes.apple.com/app/EDT/id1138223804?mt=8",
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
