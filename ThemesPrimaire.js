exports.GThemesPrimaire = void 0;
const AccessApp_1 = require("AccessApp");
class ObjetThemesPrimaire {
	setTheme() {
		const lThemeCourant = this.getTheme();
		$("#" + (0, AccessApp_1.getApp)().getIdConteneur().escapeJQ()).addClass(
			lThemeCourant,
		);
	}
	getTheme() {
		const lGenreTheme = this.getGenreTheme();
		let lClass = "";
		switch (lGenreTheme) {
			case "0":
				lClass = "ThemeButterfly";
				break;
			case "1":
				lClass = "ThemeNotebook";
				break;
			case "2":
				lClass = "ThemeSchool";
				break;
		}
		return "AvecThemeFond " + (lClass || "ThemeSchool");
	}
	getGenreTheme() {
		const T = new RegExp("[?&]" + "theme" + "=([^&#]*)").exec(
			window.location.href,
		);
		return T ? T[1] : "2";
	}
}
exports.GThemesPrimaire = new ObjetThemesPrimaire();
