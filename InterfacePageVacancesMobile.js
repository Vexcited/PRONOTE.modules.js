const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetCalendrierPeriode } = require("ObjetCalendrierPeriode.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreRole, EGenreAttribut } = require("ObjetWAI.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { ObjetBoutonFlottant } = require("ObjetBoutonFlottant.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
class InterfacePageVacancesMobile extends InterfacePage_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.idLegende = this.Nom + "_legende";
  }
  construireInstances() {
    this.IdentVacances = this.add(ObjetCalendrierPeriode);
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.IdentVacances;
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="CalendrierPeriode">');
    H.push(
      '<div id="' + this.Instances[this.IdentVacances].getNom() + '"></div>',
    );
    H.push('<div class="bt-contain" ie-identite="getIdentiteBouton"></div>');
    H.push("</div>");
    return H.join("");
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getIdentiteBouton: function () {
        return {
          class: ObjetBoutonFlottant,
          pere: this,
          init: function (aBtn) {
            aInstance.btnFlottant = aBtn;
            const lParam = {
              listeBoutons: [
                {
                  icone: "icon_diffuser_information",
                  callback: _afficherLegende.bind(aInstance),
                },
              ],
            };
            aBtn.setOptionsBouton(lParam);
          },
        };
      },
    });
  }
  composeLegende() {
    const T = [];
    T.push(
      this.getInstance(this.IdentVacances).composeLegende({
        donnees: GParametres.listeJoursFeries,
      }),
    );
    T.push(
      '<div id="' +
        this.Nom +
        '_WAI" tabindex="0" class="Texte10 Espace" style="position:sticky;top:8.5rem;" ',
      GObjetWAI.composeRole(EGenreRole.List),
      " ",
      GObjetWAI.composeAttribut({
        genre: EGenreAttribut.label,
        valeur: GTraductions.getValeur("Onglet.Libelle")[EGenreOnglet.Vacances],
      }),
      ">",
      this.composeListeLibelles(),
      "</div>",
    );
    return T.join("");
  }
  composeListeLibelles() {
    const lHtml = [];
    for (let i = 0; i < GParametres.listeJoursFeries.count(); i++) {
      const lElement = GParametres.listeJoursFeries.get(i);
      if (lElement.getLibelle()) {
        const LPeriode = GDate.estDateEgale(
          lElement.dateDebut,
          lElement.dateFin,
        )
          ? GTraductions.getValeur("Le") +
            " " +
            GDate.formatDate(lElement.dateDebut, "%JJ %MMMM")
          : GTraductions.getValeur("Du") +
            " " +
            GDate.formatDate(lElement.dateDebut, "%JJ %MMMM") +
            " " +
            GTraductions.getValeur("Au") +
            " " +
            GDate.formatDate(lElement.dateFin, "%JJ %MMMM");
        lHtml.push(
          '<div tabindex="0" ',
          GObjetWAI.composeAttribut({
            genre: EGenreAttribut.label,
            valeur: lElement.getLibelle() + ":" + LPeriode,
          }),
          " ",
          GObjetWAI.composeAttribut({
            genre: EGenreAttribut.readonly,
            valeur: "true",
          }),
          " ",
          GObjetWAI.composeRole(EGenreRole.Listitem),
          ' class="EspaceBas GrasSurFocus">',
          lElement.getLibelle(),
          " : ",
        );
        lHtml.push('<div class="Gras">', LPeriode, "</div></div>");
      }
    }
    return lHtml.join("");
  }
  recupererDonnees() {
    this.Instances[this.IdentVacances].setDonnees({
      feries: GParametres.listeJoursFeries,
    });
  }
}
function _afficherLegende() {
  const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
    pere: this,
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur("Legende"),
        avecScroll: true,
      });
    },
  });
  lFenetre.afficher(
    '<div class="CalendrierPeriode" id="' +
      this.idLegende +
      '">' +
      this.composeLegende() +
      "</div>",
  );
}
module.exports = InterfacePageVacancesMobile;
