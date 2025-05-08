exports.WidgetCDTNonSaisi = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetCDTNonSaisi extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    if (this.donnees.listeCours) {
      this.donnees.listeCours.setTri([ObjetTri_1.ObjetTri.init("dateDebut")]);
      this.donnees.listeCours.trier(
        Enumere_TriElement_1.EGenreTriElement.Decroissant,
      );
    }
    const lWidget = {
      html: this._composeWidgetCDTNonSaisi(),
      nbrElements: this.donnees.listeCours
        ? this.donnees.listeCours.count()
        : 0,
      afficherMessage: this.donnees.listeCours
        ? this.donnees.listeCours.count() === 0
        : true,
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      _surCDTNonSaisi(aIndice) {
        $(this.node).eventValidation(() => {
          const lCours = aInstance.donnees.listeCours.get(aIndice);
          aInstance.etatUtilisateurSco.setNavigationCours(lCours);
          aInstance.etatUtilisateurSco.setNavigationDate(lCours.dateDebut);
          let lPageDestination;
          if (aInstance.etatUtilisateurSco.estEspaceMobile()) {
            lPageDestination = {
              genreOngletDest: aInstance.donnees.page.Onglet,
            };
          } else {
            aInstance.etatUtilisateurSco.setSemaineSelectionnee(lCours.cycle);
            lPageDestination = aInstance.donnees.page;
          }
          aInstance.callback.appel(
            aInstance.donnees.genre,
            Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
            lPageDestination,
          );
        });
      },
    });
  }
  _composeWidgetCDTNonSaisi() {
    const H = [];
    H.push('<ul class="liste-clickable">');
    if (this.donnees.listeCours) {
      for (let i = 0; i < this.donnees.listeCours.count(); i++) {
        const lCours = this.donnees.listeCours.get(i);
        H.push(
          "<li>",
          '<a tabindex="0" class="wrapper-link" ',
          ObjetHtml_1.GHtml.composeAttr("ie-node", "_surCDTNonSaisi", i),
          ">",
          '<div class="wrap">',
          '<h3 title="',
          ObjetTraduction_1.GTraductions.getValeur(
            "accueil.CDTNonSaisi.hintLien",
          ),
          '">',
          ObjetDate_1.GDate.formatDate(lCours.dateDebut, "[%JJJ %JJ]"),
          " - ",
          lCours.strHeure,
          "</h3>",
          '<span class="info">',
          lCours.strMatiere,
          "</span>",
          "</div>",
          lCours.strClasse || lCours.strClasse !== ""
            ? '<div class="as-info fixed">' + lCours.strClasse + "</div>"
            : "",
        );
        H.push("</a>");
        H.push("</li>");
      }
    }
    H.push("</ul>");
    return H.join("");
  }
}
exports.WidgetCDTNonSaisi = WidgetCDTNonSaisi;
