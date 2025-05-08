exports.WidgetModificationEDT = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetRequeteFicheCours_1 = require("ObjetRequeteFicheCours");
const FicheCours_1 = require("FicheCours");
const ObjetFenetre_1 = require("ObjetFenetre");
class WidgetModificationEDT extends ObjetWidget_1.Widget.ObjetWidget {
  construire(aParams) {
    this.donnees = aParams.donnees;
    this.creerObjetsWidgetModificationEDT();
    const lNbElementsModificationsEDT = this.donnees.listeModificationsEDT
      ? this.donnees.listeModificationsEDT.count()
      : 0;
    const lWidget = {
      html: this.composeWidget(),
      nbrElements: lNbElementsModificationsEDT,
      afficherMessage: lNbElementsModificationsEDT === 0,
      listeElementsGraphiques: [
        { id: this.selecteurDateModificationEDT.getNom() },
      ],
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
    this.initialiserObjetsWidgetModificationEDT();
  }
  creerObjetsWidgetModificationEDT() {
    this.selecteurDateModificationEDT = ObjetIdentite_1.Identite.creerInstance(
      ObjetCelluleDate_1.ObjetCelluleDate,
      { pere: this, evenement: this._evenementSelecteurDate },
    );
    if (this.avecAffichageFicheCours() && !this.ficheCours) {
      this.ficheCours = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
        FicheCours_1.FicheCours,
        { pere: this, evenement: function () {}, initialiser: false },
      );
      this.ficheCours.destructionSurFermeture = false;
    }
  }
  initialiserObjetsWidgetModificationEDT() {
    this.selecteurDateModificationEDT.setOptionsObjetCelluleDate({
      formatDate: "[%JJJ %JJ %MMM]",
      avecBoutonsPrecedentSuivant: true,
      classeCSSTexte: "Maigre",
      largeurComposant: 100,
      ariaDescription: ObjetTraduction_1.GTraductions.getValeur("Date"),
    });
    this.selecteurDateModificationEDT.setParametresFenetre(
      GParametres.PremierLundi,
      GParametres.PremiereDate,
      GParametres.DerniereDate,
    );
    this.selecteurDateModificationEDT.initialiser();
    this.selecteurDateModificationEDT.setDonnees(
      this.donneesRequete.modificationsEDT.date,
    );
    if (!!this.ficheCours) {
      this.ficheCours.initialiser();
    }
  }
  avecAffichageFicheCours() {
    return !IE.estMobile;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      nodeModificationEDT(aNumeroCoursConcerne) {
        $(this.node).eventValidation((e) => {
          aInstance.afficherFicheCours(aNumeroCoursConcerne);
        });
      },
      titleVoirFicheCours() {
        return ObjetTraduction_1.GTraductions.getValeur(
          "accueil.modificationsEDT.voirFicheCours",
        );
      },
    });
  }
  getModificationEDT(aNumeroCoursRecherche) {
    let lModificationConcerne = null;
    if (this.donnees.listeModificationsEDT) {
      for (const lModificationEDT of this.donnees.listeModificationsEDT) {
        if (
          lModificationEDT.cours &&
          lModificationEDT.cours.getNumero() === aNumeroCoursRecherche
        ) {
          lModificationConcerne = lModificationEDT;
          break;
        }
      }
    }
    return lModificationConcerne;
  }
  async afficherFicheCours(aNumeroCoursConcerne) {
    if (!!this.ficheCours) {
      this.ficheCours.fermer();
      const lModificationEDTConcernee =
        this.getModificationEDT(aNumeroCoursConcerne);
      if (lModificationEDTConcernee) {
        let lReponse;
        try {
          lReponse = await new ObjetRequeteFicheCours_1.ObjetRequeteFicheCours(
            this,
          ).lancerRequete({
            cours: lModificationEDTConcernee.cours,
            numeroSemaine: lModificationEDTConcernee.numeroCycle,
          });
        } catch (aMessage) {
          const lMessage =
            aMessage && aMessage.length > 0
              ? aMessage
              : ObjetTraduction_1.GTraductions.getValeur("requete.erreur");
          GApplication.getMessage().afficher({ message: lMessage });
          return;
        }
        const lIdAncrageFiche = this.donnees.id;
        const lDonneesFiche = {
          id: lIdAncrageFiche,
          listeCours: lReponse.listeCours,
          coursSelectionne: lModificationEDTConcernee.cours,
          numeroSemaine: lModificationEDTConcernee.numeroCycle,
        };
        this.ficheCours.setDonneesFicheCours(lDonneesFiche);
      }
    }
  }
  composeWidget() {
    const H = [];
    if (this.donnees.listeModificationsEDT.count() > 0) {
      H.push('<ul class="liste-clickable">');
      for (const lModificationEDT of this.donnees.listeModificationsEDT) {
        H.push(this._composeLigneModificationEDT(lModificationEDT));
      }
      H.push("</ul>");
    }
    return H.join("");
  }
  _composeLigneModificationEDT(aModificationEDT) {
    let lStyleColor = "color: blue;";
    if (aModificationEDT.estAnnulationCours) {
      lStyleColor = "color: red;";
    }
    const lIENode =
      "nodeModificationEDT('" + aModificationEDT.cours.getNumero() + "')";
    const H = [];
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "li",
          null,
          IE.jsx.str(
            "a",
            {
              class: "wrapper-link",
              tabindex: "0",
              "ie-node": lIENode,
              "ie-title": "titleVoirFicheCours",
            },
            IE.jsx.str(
              "div",
              { class: "wrap" },
              IE.jsx.str("h3", null, aModificationEDT.getLibelle()),
              IE.jsx.str(
                "div",
                { class: "infos-conteneur" },
                IE.jsx.str(
                  "span",
                  { style: lStyleColor },
                  aModificationEDT.strAmenagement,
                ),
              ),
            ),
            IE.jsx.str(
              "div",
              { class: "as-info fixed" },
              aModificationEDT.strPublic,
            ),
          ),
        ),
      ),
    );
    return H.join("");
  }
  _evenementSelecteurDate(aDate) {
    if (this.donneesRequete.modificationsEDT.date !== aDate) {
      this.donneesRequete.modificationsEDT.date = aDate;
      this.callback.appel(
        this.donnees.genre,
        Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget,
      );
    }
  }
}
exports.WidgetModificationEDT = WidgetModificationEDT;
