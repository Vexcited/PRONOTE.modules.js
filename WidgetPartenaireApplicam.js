exports.WidgetPartenaireApplicam = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitairePartenaire_1 = require("UtilitairePartenaire");
const ObjetFenetre_Consentement_1 = require("ObjetFenetre_Consentement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequeteSaisieConsentement = require("ObjetRequeteSaisieConsentement");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
class WidgetPartenaireApplicam extends ObjetWidget_1.Widget.ObjetWidget {
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      surPartenaireApplicam() {
        $(this.node).eventValidation((aEvent) => {
          aEvent.stopImmediatePropagation();
          aInstance.surPartenaireApplicam();
        });
      },
      btnConsentement: {
        event() {
          const lRequete = new ObjetRequeteSaisieConsentement(aInstance);
          const lLibellePartenaire =
            !!aInstance.donnees && aInstance.donnees.libellePartenaire
              ? aInstance.donnees.libellePartenaire
              : "";
          const lDonneesTransmises =
            !!aInstance.donnees && aInstance.donnees.donneesTransmises
              ? aInstance.donnees.donneesTransmises
              : {};
          const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre_Consentement_1.ObjetFenetre_Consentement,
            {
              pere: this,
              evenement: function (aGenreBouton, aParam) {
                switch (aParam.bouton.action) {
                  case ObjetFenetre_Consentement_1.EGenreActionConsentement
                    .Fermer:
                    lFenetre.fermer();
                    break;
                  case ObjetFenetre_Consentement_1.EGenreActionConsentement
                    .Valider:
                    lRequete.lancerRequete();
                    lFenetre.fermer();
                    aInstance.callback.appel(
                      aInstance.donnees.genre,
                      Enumere_EvenementWidget_1.EGenreEvenementWidget
                        .ActualiserWidget,
                    );
                    break;
                }
              },
            },
          );
          lFenetre.setDonnees(lLibellePartenaire, lDonneesTransmises);
          lFenetre.afficher();
        },
        getDisabled() {
          return !(aInstance.donnees && aInstance.donnees.afficherConsentement);
        },
      },
    });
  }
  construire(aParams) {
    this.donnees = aParams.donnees;
    const lWidget = {
      html: this.composeWidgetPartenaireApplicam(),
      nbrElements: null,
      titre: ObjetTraduction_1.GTraductions.getValeur("accueil.culture.titre"),
      avecActualisation: !!this.donnees.avecActualisation,
    };
    $.extend(true, this.donnees, lWidget);
    aParams.construireWidget(this.donnees);
  }
  composeWidgetPartenaireApplicam() {
    const H = [];
    if (this.donnees && this.donnees.afficherConsentement) {
      H.push('<div class="AlignementMilieu">');
      H.push('<div class="Espace"');
      H.push(
        ObjetTraduction_1.GTraductions.getValeur("accueil.applicam.message"),
      );
      H.push("</div>");
      H.push('<div class="GrandEspace">');
      H.push(
        '<ie-bouton ie-model="btnConsentement" class="themeBoutonSecondaire">',
        ObjetTraduction_1.GTraductions.getValeur(
          "accueil.applicam.btnConsentement",
          [this.donnees.libellePartenaire],
        ),
        "</ie-bouton>",
      );
      H.push("</div>");
      H.push("</div>");
    } else {
      if (this.donnees.SSO && this.donnees.SSO.intituleLien) {
        H.push('<ul class="liste-clickable one-line">');
        H.push('<li class="has-sso">');
        H.push(
          '<a class="wrapper-link" tabindex="0" ie-node="surPartenaireApplicam()">',
        );
        H.push('<div  class="wrap">');
        H.push("<div>", this.donnees.SSO.intituleLien, "</div>");
        H.push("<p>", this.donnees.SSO.description, "</p>");
        H.push("</div>");
        H.push("</a>");
        H.push("</li></ul>");
      }
    }
    return H.join("");
  }
  surPartenaireApplicam() {
    UtilitairePartenaire_1.TUtilitairePartenaire.ouvrirURLPartenaire(
      this.donnees,
    );
  }
}
exports.WidgetPartenaireApplicam = WidgetPartenaireApplicam;
