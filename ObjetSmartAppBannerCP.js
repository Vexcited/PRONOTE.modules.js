exports.ObjetSmartAppBannerCP = exports.ENomLogo = void 0;
const AccessApp_1 = require("AccessApp");
const GUID_1 = require("GUID");
const LocalStorage_1 = require("LocalStorage");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ObjetTraduction_1 = require("ObjetTraduction");
let lTimeout = null,
	lIframe;
var ENomLogo;
(function (ENomLogo) {
	ENomLogo["pronote"] = "pronote";
	ENomLogo["hyperplanning"] = "hyperplanning";
	ENomLogo["edt"] = "edt";
})(ENomLogo || (exports.ENomLogo = ENomLogo = {}));
class ObjetSmartAppBannerCP {
	constructor(aNom) {
		this.id = GUID_1.GUID.getId();
		this.os = ObjetNavigateur_1.Navigateur.isAndroid
			? "android"
			: ObjetNavigateur_1.Navigateur.isIphone
				? "ios"
				: null;
		this.isOpen = false;
		this.IELocalStorage = "ObjetSmartAppBanner";
		this.affichages = LocalStorage_1.IELocalStorage.getItemJSON(
			this.IELocalStorage,
		);
		this.Nom = aNom;
		this.options = {
			urlApp: "",
			delai: 1000,
			delta: 500,
			autoClose: 20,
			daysHidden: 30,
			maxClose: 3,
			maxInst: 10,
			maxAff: 12,
			title: "",
			android: {
				appId: "",
				storeLink: "",
				line1: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.bandeauAndroid1",
				),
				line2: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.bandeauAndroid2",
				),
				storeText: "",
			},
			ios: {
				appId: "1138223804",
				storeLink: "",
				storeText: ObjetTraduction_1.GTraductions.getValeur(
					"mobile.storeTextIOS",
				),
				line1: ObjetTraduction_1.GTraductions.getValeur("mobile.bandeauIOS1"),
				line2: ObjetTraduction_1.GTraductions.getValeur("mobile.bandeauIOS2"),
			},
		};
		if (!this.affichages) {
			this.affichages = { nbClose: 0, dateClose: null, nbAff: 0, nbInst: 0 };
			LocalStorage_1.IELocalStorage.setItemJSON(
				this.IELocalStorage,
				this.affichages,
			);
		} else {
			if (
				this.affichages.dateClose +
					this.options.daysHidden * 24 * 60 * 60 * 1000 <
					new Date().getTime() &&
				this.affichages.nbAff < this.options.maxAff &&
				this.affichages.nbInst < this.options.maxInst
			) {
				this.affichages.nbClose = 0;
			}
			LocalStorage_1.IELocalStorage.setItemJSON(
				this.IELocalStorage,
				this.affichages,
			);
		}
		this.canBeOpen =
			!(0, AccessApp_1.getApp)().getDemo() &&
			!!this.os &&
			this.affichages.nbClose < this.options.maxClose &&
			this.affichages.nbAff < this.options.maxAff &&
			this.affichages.nbInst < this.options.maxInst;
	}
	show() {
		if (!this.canBeOpen || this.isOpen) {
			return;
		}
		const lThis = this;
		this.affichages.nbAff += 1;
		$("body").append(this.compose());
		$("#" + this.id)
			.delay(600)
			.queue(function () {
				lThis.isOpen = true;
				$(this).addClass("smartbanner-show");
				$(this).dequeue();
			})
			.on("click", (aEvent) => {
				const lCroixFermeture = aEvent.target.closest(".smartbanner-close");
				if (!lCroixFermeture) {
					this.open();
				}
			});
	}
	hide(aEvent) {
		if (!!aEvent) {
			aEvent.stopImmediatePropagation();
		}
		if (!!aEvent) {
			aEvent.preventDefault();
		}
		this.affichages.nbClose += 1;
		this.affichages.dateClose = new Date().getTime();
		LocalStorage_1.IELocalStorage.setItemJSON(
			this.IELocalStorage,
			this.affichages,
		);
		this.isOpen = false;
		$("#" + this.id)
			.addClass("smartbanner-hide")
			.removeClass("smartbanner-show")
			.delay(600)
			.queue(function () {
				$(this).remove();
				$(this).dequeue();
			});
		return false;
	}
	open() {
		if (!this.os) {
			return;
		}
		this.affichages.nbInst += 1;
		LocalStorage_1.IELocalStorage.setItemJSON(
			this.IELocalStorage,
			this.affichages,
		);
		let lUri = this.options.urlApp;
		if (ObjetNavigateur_1.Navigateur.isIphone) {
			const lWindow = window.open(lUri);
			$(lWindow.document.head).append(
				'<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width, user-scalable=no" />',
			);
			$(lWindow.document.body).append(
				'<a href="' +
					this.options[this.os].storeLink +
					'" style="font-size:25px;display:block;text-align:center;padding:15px;font-family:Arial;" onclick="setTimeout(window.close, 1000);">' +
					this.options[this.os].storeText +
					"</a>",
			);
			return true;
		} else if (ObjetNavigateur_1.Navigateur.isAndroid) {
			if (!ObjetNavigateur_1.Navigateur.IsGecko) {
				const matches = lUri.match(/([^:]+):\/\/(.+)$/i);
				lUri = "intent://" + matches[2] + "#Intent;scheme=" + matches[1];
				lUri += ";package=" + this.options.android.appId + ";end";
			}
			lIframe = document.createElement("iframe");
			lTimeout = setTimeout(
				this.openFallbackAndroid.bind(this, new Date().getTime()),
				this.options.delai,
			);
			lIframe.onload = function () {
				clearTimeout(lTimeout);
				lIframe.parentNode.removeChild(lIframe);
				window.location.href = lUri;
			};
			lIframe.src = lUri;
			lIframe.setAttribute("style", "display:none;");
			document.body.appendChild(lIframe);
			return true;
		} else if (ObjetNavigateur_1.Navigateur.isWinMob) {
			lIframe = document.createElement("iframe");
			lTimeout = setTimeout(() => {
				if (lIframe) {
					lIframe.parentNode.removeChild(lIframe);
				}
			}, this.options.delai);
			lIframe.onload = function () {
				clearTimeout(lTimeout);
				lIframe.parentNode.removeChild(lIframe);
			};
			lIframe.src = this.options[this.os].storeLink;
			lIframe.setAttribute("style", "display:none;");
			document.body.appendChild(lIframe);
		}
	}
	compose() {
		return IE.jsx.str(
			"div",
			{ id: this.id, class: "smartbanner-container" },
			IE.jsx.str("span", { class: ["smartbanner-icon", this.nomLogo] }),
			IE.jsx.str(
				"div",
				{ class: "smartbanner-info" },
				IE.jsx.str("div", { class: "smartbanner-title" }, this.options.title),
				IE.jsx.str("div", null, this.options[this.os].line1),
				IE.jsx.str("span", null, this.options[this.os].line2),
			),
			IE.jsx.str(
				"div",
				{ class: "smartbanner-close", onclick: `${this.Nom}.hide()` },
				IE.jsx.str("i", { class: "icon_fermeture_widget" }),
			),
		);
	}
	openFallbackAndroid(aTimeStamp) {
		clearTimeout(lTimeout);
		if (
			new Date().getTime() - aTimeStamp <
			this.options.delai + this.options.delta
		) {
			window.location.href = this.options[this.os].storeLink;
		}
		if (lIframe) {
			lIframe.parentNode.removeChild(lIframe);
		}
	}
}
exports.ObjetSmartAppBannerCP = ObjetSmartAppBannerCP;
