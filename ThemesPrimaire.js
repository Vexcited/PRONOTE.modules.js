class ObjetThemesPrimaire {
  setTheme() {
    const lThemeCourant = this.getTheme();
    $("#" + GApplication.getIdConteneur().escapeJQ()).addClass(lThemeCourant);
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
const GThemesPrimaire = new ObjetThemesPrimaire();
module.exports = { GThemesPrimaire };
