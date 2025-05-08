const { ZoneFenetre } = require("IEZoneFenetre.js");
const { Support } = require("ObjetSupport.js");
const Notification = {
	settings: {
		permissionRequested: false,
		idFenetreNotif: "fenetreNotif",
		fenetreCree: false,
		autoClose: 30,
	},
	afficher: function (aParam) {
		let lAutoClose;
		if (!GApplication.notificationActive) {
			return;
		}
		if (
			Support.supportNotification === Support.permissionNotification.defaut &&
			this.settings.permissionRequested === false
		) {
			this.requestPermission(this.afficher.bind(this, aParam));
		} else {
			if (
				Support.supportNotification === Support.permissionNotification.granted
			) {
				lAutoClose = aParam.autoClose || this.settings.autoClose;
				const notification = this.getNotification(aParam.title || "", {
					icon: aParam.icon || "",
					body: aParam.msg || "",
					tag: new Date().getTime(),
				});
				if (aParam.autoClose !== false) {
					notification.addEventListener("show", () => {
						window.setTimeout(() => {
							notification.close();
						}, lAutoClose * 1000);
					});
				}
				if (aParam.onclick) {
					notification.addEventListener("click", aParam.onclick);
				}
			} else {
				if (this.settings.fenetreCree === false) {
					this.settings.fenetreCree = true;
					ZoneFenetre.ajouterFenetre(this.settings.idFenetreNotif, 999999);
					$("#" + this.settings.idFenetreNotif.escapeJQ())
						.css({ position: "absolute", bottom: "2px", right: "2px" })
						.show();
				}
				const lIdNotif =
					this.settings.idFenetreNotif + "_" + new Date().getTime();
				const lNotif =
					'<div id="' +
					lIdNotif +
					'" style="position:relative;background-color:' +
					GCouleur.grisTresClair.fond +
					";color:" +
					GCouleur.texte +
					";border:" +
					GCouleur.texte +
					' 2px solid;width:330px;height:50px;padding:10px;overflow:hidden;">' +
					'<div class="AvecMain WidgetFermer" style="position:absolute;top:0;right:0;" onclick="$(this).parent().remove();event.stopImmediatePropagation();">&nbsp;</div>' +
					(aParam.icon
						? '<div class="InlineBlock" style="width:50px;height:50px;"><div class="InlineBlock AlignementMilieuVertical" style="height:100%;"></div><i class="' +
							aParam.icon +
							'" style="font-size: 1.6rem;"></i></div>'
						: "") +
					'<div class="InlineBlock">' +
					(aParam.title ? '<div class="Gras">' + aParam.title + "</div>" : "") +
					(aParam.msg ? "<div>" + aParam.msg + "</div>" : "") +
					"</div>" +
					"</div>";
				lAutoClose = aParam.autoClose || this.settings.autoClose;
				$("#" + this.settings.idFenetreNotif.escapeJQ()).append(lNotif);
				if (aParam.autoClose !== false) {
					setTimeout(() => {
						$("#" + lIdNotif.escapeJQ())
							.fadeOut()
							.queue(function () {
								$(this).remove().dequeue();
							});
					}, lAutoClose * 1000);
				}
				if (aParam.onclick) {
					$("#" + lIdNotif.escapeJQ()).on("click", aParam.onclick);
				}
			}
		}
	},
	getNotification: function (title, options) {
		let notification;
		if (window.Notification) {
			try {
				notification = new window.Notification(title, {
					icon: options.icon,
					body: options.body || "",
					tag: options.tag || "",
				});
			} catch (e) {}
		}
		if (!notification) {
			if (window.webkitNotifications) {
				notification = window.webkitNotifications.createNotification(
					options.icon,
					title,
					options.body,
				);
				notification.show();
			} else if (navigator.mozNotification) {
				notification = navigator.mozNotification.createNotification(
					title,
					options.body,
					options.icon,
				);
				notification.show();
			}
		}
		return notification;
	},
	requestPermission: function (callback) {
		this.settings.permissionRequested = true;
		if (Support.supportNotification === false) {
			return;
		}
		if (
			window.webkitNotifications &&
			window.webkitNotifications.checkPermission
		) {
			window.webkitNotifications.requestPermission(() => {
				Support.refreshNotification();
				if (callback) {
					callback();
				}
			});
		} else if (window.Notification && window.Notification.requestPermission) {
			window.Notification.requestPermission(() => {
				Support.refreshNotification();
				if (callback) {
					callback();
				}
			});
		}
	},
};
module.exports = { Notification };
