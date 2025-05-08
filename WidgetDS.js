exports.WidgetDS = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetDS extends ObjetWidget_1.Widget.ObjetWidget {
  constructor(...aParams) {
    super(...aParams);
    this.etatUtilisateurPN = GEtatUtilisateur;
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    if (this.donnees.listeDS) {
      this.donnees.listeDS.setTri([ObjetTri_1.ObjetTri.init("dateDebut")]);
      this.donnees.listeDS.trier();
    }
    const lWidget = {
      html: this.composeWidgetDS(Enumere_LienDS_1.EGenreLienDS.tGL_Devoir),
      nbrElements: this.donnees.listeDS.count(),
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      surDS(i) {
        $(this.node).eventValidation(() => {
          aInstance.surDS(i);
        });
      },
    });
  }
  composeWidgetDS(aGenreLienDS) {
    const H = [];
    this.donnees.listeDS = this.donnees.listeDS
      ? this.donnees.listeDS
      : this.donneesSurveille
        ? this.donneesSurveille.listeDS
        : null;
    if (this.donnees.listeDS) {
      H.push('<ul class="liste-clickable">');
      for (let i = 0; i < this.donnees.listeDS.count(); i++) {
        const lDS = this.donnees.listeDS.get(i);
        if (lDS.getGenre() === aGenreLienDS) {
          const lStrDate =
            ObjetDate_1.GDate.formatDate(
              lDS.dateDebut,
              "[" +
                ObjetTraduction_1.GTraductions.getValeur("Le") +
                " " +
                "%JJJJ %J %MMM" +
                "]" +
                " " +
                ObjetTraduction_1.GTraductions.getValeur("De") +
                " " +
                "%hh%sh%mm",
            ) +
            ObjetDate_1.GDate.formatDate(
              lDS.dateFin,
              " " +
                ObjetTraduction_1.GTraductions.getValeur("A") +
                " " +
                "%hh%sh%mm",
            );
          H.push(
            IE.jsx.str(
              "li",
              null,
              IE.jsx.str(
                "a",
                {
                  tabindex: "0",
                  class: "wrapper-link",
                  "aria-haspopup": !IE.estMobile && "dialog",
                  "ie-node": "surDS(" + i + ")",
                },
                IE.jsx.str(
                  "div",
                  { class: "wrap flex-contain flex-start full-width" },
                  IE.jsx.str(
                    "div",
                    { class: "bloc-date-conteneur" },
                    ObjetDate_1.GDate.formatDate(
                      lDS.dateDebut,
                      "<div>%JJ</div><div>%MMM</div>",
                    ),
                  ),
                  IE.jsx.str(
                    "div",
                    { class: "infos-ds-conteneur" },
                    IE.jsx.str("h3", null, lDS.matiere.getLibelle()),
                    IE.jsx.str("h4", { class: "as-libelle" }, lDS.getLibelle()),
                    IE.jsx.str("span", { class: "date" }, lStrDate.ucfirst()),
                    lDS.listeSalles
                      ? IE.jsx.str(
                          "span",
                          null,
                          " - ",
                          (lDS.listeSalles.count()
                            ? ObjetTraduction_1.GTraductions.getValeur("Salle")
                            : ObjetTraduction_1.GTraductions.getValeur(
                                "Salles",
                              )) +
                            " " +
                            lDS.listeSalles.getTableauLibelles().join(", "),
                          " ",
                        )
                      : "",
                  ),
                ),
              ),
            ),
          );
        }
      }
      H.push("</ul>");
    }
    return H.join("");
  }
  surDS(i) {
    const lDS = this.donnees.listeDS
      ? this.donnees.listeDS.get(i)
      : this.donneesSurveille.listeDS.get(i);
    if (IE.estMobile) {
      this.etatUtilisateurPN.setNavigationDate(lDS.dateDebut);
      const lPageDestination = {
        genreOngletDest: Enumere_Onglet_1.EGenreOnglet.CDT_Contenu,
      };
      this.callback.appel(
        this.donnees.genre,
        Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
        lPageDestination,
      );
    } else {
      const lParamsRequeteFicheCDT = { pourCDT: true, contenu: lDS };
      this.callback.appel(
        this.donnees.genre,
        Enumere_EvenementWidget_1.EGenreEvenementWidget.EvenementPersonnalise,
        lParamsRequeteFicheCDT,
      );
    }
  }
}
exports.WidgetDS = WidgetDS;
