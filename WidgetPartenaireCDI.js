exports.WidgetPartenaireCDI = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFiche_1 = require("ObjetFiche");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const TypeGenrePret_1 = require("TypeGenrePret");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetPartenaireCDI extends ObjetWidget_1.Widget.ObjetWidget {
  creerObjetstPartenaireCDI() {
    this.comboCDI = ObjetIdentite_1.Identite.creerInstance(
      ObjetSaisie_1.ObjetSaisie,
      { pere: this, evenement: this._evenementSurComboCDI },
    );
    this._initialiserComboCDI(this.comboCDI);
    this.ficheHistorique = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
      ObjetFiche_1.ObjetFiche,
      { pere: this, initialiser: false },
    );
    this.ficheHistorique.destructionSurFermeture = false;
  }
  initialiserObjetsPartenaireCDI() {
    var _a;
    this.comboCDI.initialiser();
    this.comboCDI.setDonnees(this.donnees.listeCDI, 0);
    this.comboCDI.setVisible(
      ((_a = this.donnees.listeCDI) === null || _a === void 0
        ? void 0
        : _a.count()) > 1,
    );
    this.ficheHistorique.initialiser();
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    this.creerObjetstPartenaireCDI();
    const lWidget = {
      listeElementsGraphiques: [{ id: this.comboCDI.getNom() }],
      nbrElements: null,
      afficherMessage: false,
      avecActualisation: true,
      fermerFiches: () => {
        this.ficheHistorique.fermer();
      },
    };
    $.extend(true, this.donnees, lWidget);
    this.idInputRecherche = this.Nom + "_inputSearch";
    this.avecHistorique = false;
    aParams.construireWidget(this.donnees);
    this.initialiserObjetsPartenaireCDI();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      nodePartenaireCDI() {
        $(this.node).eventValidation((e) => {
          aInstance._surPartenaireCDI();
        });
      },
      nodeVoirHistorique() {
        $(this.node).eventValidation((e) => {
          aInstance._surHistorique();
        });
      },
      nodeSurRechercheCDI() {
        $(this.node).eventValidation((e) => {
          aInstance._surRechercheCDI();
        });
      },
    });
  }
  actualiserPartenaireCDI(aCDI) {
    var _a, _b;
    this.CDI = aCDI;
    const lTitre = aCDI.avecDelegationAuth
      ? '<span class="AvecMain" ie-node="nodePartenaireCDI">' +
        (((_a = this.donnees.listeCDI) === null || _a === void 0
          ? void 0
          : _a.count()) === 1
          ? aCDI.getLibelle()
          : ObjetTraduction_1.GTraductions.getValeur("accueil.CDI.titre")) +
        "</span>"
      : '<a href="' +
        ObjetChaine_1.GChaine.verifierURLHttp(aCDI.url) +
        '" target="_blank">' +
        (((_b = this.donnees.listeCDI) === null || _b === void 0
          ? void 0
          : _b.count()) === 1
          ? aCDI.getLibelle()
          : ObjetTraduction_1.GTraductions.getValeur("accueil.CDI.titre")) +
        "</a>";
    const lWidget = {
      html: this.composeWidgetPartenaireCDI(aCDI),
      nbrElements: null,
      afficherMessage: false,
      titre: lTitre,
      avecActualisation: !!aCDI.avecActualisation,
    };
    $.extend(true, this.donnees, lWidget);
    UtilitaireWidget_1.UtilitaireWidget.actualiserWidget(this);
  }
  composeWidgetPartenaireCDI(aCDI) {
    const H = [];
    this.donneesRequete.partenaireCDI.CDI = aCDI;
    const lOnKeyPressInputRecherche = this.Nom + "._onKeyPress(event)";
    H.push(
      IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str(
          "div",
          { class: "input-wrapper fullsize" },
          IE.jsx.str(
            "div",
            { class: "as-search" },
            IE.jsx.str(
              "label",
              { class: "Italique sr-only", for: this.idInputRecherche },
              ObjetTraduction_1.GTraductions.getValeur("accueil.CDI.recherche"),
            ),
            IE.jsx.str("input", {
              id: this.idInputRecherche,
              type: "text",
              placeholder: ObjetTraduction_1.GTraductions.getValeur(
                "accueil.CDI.recherche",
              ),
              onkeypress: lOnKeyPressInputRecherche,
            }),
            IE.jsx.str("span", { "ie-node": "nodeSurRechercheCDI" }),
          ),
        ),
      ),
    );
    if (!!aCDI.listePrets && aCDI.listePrets.count()) {
      H.push(this.composeListePrets(aCDI, false));
      if (this.avecHistorique) {
        H.push(
          IE.jsx.str(
            IE.jsx.fragment,
            null,
            IE.jsx.str(
              "div",
              {
                class: "LienAccueil PetitEspace",
                style: "float: right",
                "ie-node": "nodeVoirHistorique",
              },
              ObjetTraduction_1.GTraductions.getValeur(
                "accueil.CDI.voirHistorique",
              ),
            ),
          ),
        );
      }
    }
    return H.join("");
  }
  composeListePrets(aCDI, aPourHistorique) {
    const H = [];
    if (!!aCDI.listePrets && aCDI.listePrets.count()) {
      H.push('<table class="is-clickable">');
      H.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "thead",
            null,
            IE.jsx.str(
              "tr",
              null,
              IE.jsx.str(
                "th",
                { scope: "col" },
                ObjetTraduction_1.GTraductions.getValeur(
                  "accueil.CDI.ressourcesEmpruntees",
                ),
              ),
              IE.jsx.str(
                "th",
                { scope: "col" },
                ObjetTraduction_1.GTraductions.getValeur(
                  "accueil.CDI.emprunteLe",
                ),
              ),
              IE.jsx.str(
                "th",
                { scope: "col" },
                aPourHistorique
                  ? ObjetTraduction_1.GTraductions.getValeur(
                      "accueil.CDI.renduLe",
                    )
                  : ObjetTraduction_1.GTraductions.getValeur(
                      "accueil.CDI.aRendreLe",
                    ),
              ),
            ),
          ),
        ),
      );
      for (let i = 0; i < aCDI.listePrets.count(); i++) {
        const lPret = aCDI.listePrets.get(i);
        const lAfficher = aPourHistorique
          ? lPret.getGenre() === TypeGenrePret_1.TypeGenrePret.GP_Historique
          : lPret.getGenre() === TypeGenrePret_1.TypeGenrePret.GP_EnCours ||
            lPret.getGenre() === TypeGenrePret_1.TypeGenrePret.GP_EnRetard;
        if (lPret.getGenre() === TypeGenrePret_1.TypeGenrePret.GP_Historique) {
          this.avecHistorique = true;
        }
        if (lAfficher) {
          H.push(
            "<tr>",
            "<td>",
            '<a href="',
            ObjetChaine_1.GChaine.verifierURLHttp(lPret.url),
            '" target="_blank" class=LienAccueil"',
            lPret.commentaire ? ' ie-hint="' + lPret.commentaire + '"' : "",
            ">",
            lPret.titre,
            "</a>",
            "</td>",
            "<td>",
            ObjetDate_1.GDate.formatDate(lPret.dateEmprunt, "[%JJ/%MM/%AA]"),
            "</td>",
            "<td",
            lPret.getGenre() === TypeGenrePret_1.TypeGenrePret.GP_EnRetard
              ? ' class="date-alert" ie-hint="' +
                  ObjetTraduction_1.GTraductions.getValeur(
                    "accueil.CDI.dateRenduDepassee",
                  ) +
                  '"'
              : "",
            ">",
            ObjetDate_1.GDate.formatDate(
              aPourHistorique
                ? lPret.dateRetourEffectif
                : lPret.dateRetourPrevue,
              "[%JJ/%MM/%AA]",
            ),
            "</td>",
            "</tr>",
          );
        }
      }
      H.push("</table>");
    }
    return H.join("");
  }
  _surHistorique() {
    this.ficheHistorique.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur("accueil.CDI.historique"),
      htmlContenu: this.composeListePrets(
        this.donneesRequete.partenaireCDI.CDI,
        true,
      ),
    });
    this.ficheHistorique.afficher();
  }
  _onKeyPress(aEvent) {
    if (aEvent.keyCode === ToucheClavier_1.ToucheClavier.RetourChariot) {
      this._surRechercheCDI();
    }
  }
  _surRechercheCDI() {
    let lValeurRecherchee = $("#" + this.idInputRecherche.escapeJQ())
      .val()
      .toString();
    if (!!lValeurRecherchee) {
      lValeurRecherchee = lValeurRecherchee.trim();
    }
    if (!!lValeurRecherchee && lValeurRecherchee.length > 0) {
      UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirURLPartenaireRecherche(
        this.donneesRequete.partenaireCDI.CDI,
        lValeurRecherchee,
      );
    }
  }
  _initialiserComboCDI(aObjet) {
    aObjet.setOptionsObjetSaisie({
      longueur: 80,
      avecBoutonsPrecSuiv: false,
      avecBoutonsPrecSuivVisiblesInactifs: false,
      labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
        "WAI.SelectionPortail",
      ),
    });
  }
  _evenementSurComboCDI(aParams) {
    if (
      aParams.genreEvenement ===
      Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
    ) {
      this.actualiserPartenaireCDI(aParams.element);
    }
  }
  _surPartenaireCDI() {
    UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirURLPartenaireCDI(
      this.CDI,
    );
  }
}
exports.WidgetPartenaireCDI = WidgetPartenaireCDI;
