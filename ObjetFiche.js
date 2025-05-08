exports.ObjetFiche = void 0;
const ObjetFiche_DesktopMobile_1 = require("ObjetFiche_DesktopMobile");
class ObjetFiche extends ObjetFiche_DesktopMobile_1.ObjetFiche_DesktopMobile {}
exports.ObjetFiche = ObjetFiche;
if (!IE.estMobile) {
  exports.ObjetFiche = ObjetFiche =
    require("ObjetFiche_Espace.js").ObjetFiche_Espace;
} else {
  exports.ObjetFiche = ObjetFiche =
    require("ObjetFiche_DesktopMobile.js").ObjetFiche_DesktopMobile;
}
