const { PageFicheStageCP_Mobile } = require("PageFicheStageCP_Mobile.js");
const { UtilitaireFicheStage } = require("UtilitaireFicheStage.js");
const { tag } = require("tag.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetListe } = require("ObjetListe.js");
const { DonneesListe_SuiviStage } = require("DonneesListe_SuiviStage.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { Identite } = require("ObjetIdentite.js");
const { EGenreAffichageFicheStage } = require("Enumere_AffichageFicheStage.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
class PageFicheStage_Mobile extends PageFicheStageCP_Mobile {
  constructor(...aParams) {
    super(...aParams);
  }
  creerInstanceListeSuivis() {
    return Identite.creerInstance(ObjetListe, {
      pere: this,
      evenement: _evenementListeSuivis.bind(this),
    });
  }
  initialiserListeSuivis() {
    this.instanceListeSuivis.initialiser();
    this.instanceListeSuivis
      .setOptionsListe({
        colonnes: [{ id: "PageFicheStageMobile_ListeSuivis", taille: "100%" }],
        skin: ObjetListe.skin.flatDesign,
        messageContenuVide: GTraductions.getValeur(
          "FicheStage.listeSuivis.AucunSuivi",
        ),
        avecOmbreDroite: true,
        hauteurZoneContenuListeMin: 200,
        avecLigneCreation: this.parametres.avecEditionSuivisDeStage,
        titreCreation: GTraductions.getValeur("FenetreSuiviStage.NouveauSuivi"),
      })
      .setDonnees(
        new DonneesListe_SuiviStage(this.donnees.suiviStage, this.parametres),
      );
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getInfoConvention: {
        event: function () {
          const T = [];
          let lIcon = "";
          let lInfoAcc = "";
          if (!!aInstance.donnees.convention) {
            aInstance.donnees.convention.roles.parcourir((aRole) => {
              if (aRole.aSignee) {
                lIcon = "icon_ok";
                lInfoAcc = GTraductions.getValeur("FicheStageCP.SigneePar");
              } else {
                lIcon = "icon_remove";
                lInfoAcc = GTraductions.getValeur("FicheStageCP.NonSigneePar");
              }
              let lLibelle = aRole.getLibelle();
              if (!aRole.signatureObligatoire) {
                lLibelle += ` (${GTraductions.getValeur("FicheStageCP.Optionnel")})`;
              }
              T.push(
                tag(
                  "div",
                  tag("i", { class: lIcon, "aria-label": lInfoAcc }),
                  lLibelle,
                ),
              );
            });
          } else {
            if (aInstance.donnees.conventionSigneeEleve) {
              lIcon = "icon_ok";
              lInfoAcc = GTraductions.getValeur("FicheStageCP.SigneePar");
            } else {
              lIcon = "icon_remove";
              lInfoAcc = GTraductions.getValeur("FicheStageCP.NonSigneePar");
            }
            T.push(
              tag(
                "div",
                tag("i", { class: lIcon, "aria-label": lInfoAcc }),
                GTraductions.getValeur("FicheStage.parEleve"),
              ),
            );
            if (aInstance.donnees.conventionSigneeEntreprise) {
              lIcon = "icon_ok";
              lInfoAcc = GTraductions.getValeur("FicheStageCP.SigneePar");
            } else {
              lIcon = "icon_remove";
              lInfoAcc = GTraductions.getValeur("FicheStageCP.NonSigneePar");
            }
            T.push(
              tag(
                "div",
                tag("i", { class: lIcon, "aria-label": lInfoAcc }),
                GTraductions.getValeur("FicheStage.parEntreprise"),
              ),
            );
            if (aInstance.donnees.conventionSigneeEtablissement) {
              lIcon = "icon_ok";
              lInfoAcc = GTraductions.getValeur("FicheStageCP.SigneePar");
            } else {
              lIcon = "icon_remove";
              lInfoAcc = GTraductions.getValeur("FicheStageCP.NonSigneePar");
            }
            T.push(
              tag(
                "div",
                tag("i", { class: lIcon, "aria-label": lInfoAcc }),
                GTraductions.getValeur("FicheStage.parEtablissement"),
              ),
            );
          }
          _getInfoConvention.call(
            aInstance,
            tag("div", { class: "hint-convention" }, T.join("")),
          );
        },
      },
    });
  }
  setDonnees(aDonnees) {
    (this.parametres.listeSujetsStage = aDonnees.listeSujetsStage),
      super.setDonnees(aDonnees);
  }
  construireAffichage() {
    const H = [];
    switch (this.selectOngletStage) {
      case EGenreAffichageFicheStage.Details:
        H.push('<div class="conteneur-FicheStage">');
        H.push(
          UtilitaireFicheStage.composeBlocDetails(this.donnees, {
            parametres: this.parametres,
            controleur: this.controleur,
          }),
        );
        H.push("</div>");
        break;
      case EGenreAffichageFicheStage.Annexe:
        H.push('<div class="conteneur-FicheStage">');
        H.push(
          UtilitaireFicheStage.composeBlocAnnexe(this.donnees, {
            parametres: this.parametres,
            controleur: this.controleur,
          }),
        );
        H.push("</div>");
        break;
      case EGenreAffichageFicheStage.Suivi: {
        let lConventionEtiquette = "";
        let lCpt = 0;
        let lNrMax = 3;
        if (!!this.donnees.convention) {
          lNrMax = this.donnees.convention.roles.count();
          this.donnees.convention.roles.parcourir((aRole) => {
            if (aRole.aSignee) {
              lCpt++;
            }
          });
        } else {
          if (this.donnees.conventionSigneeEleve) {
            lCpt++;
          }
          if (this.donnees.conventionSigneeEntreprise) {
            lCpt++;
          }
          if (this.donnees.conventionSigneeEtablissement) {
            lCpt++;
          }
        }
        if (lCpt > 0) {
          lConventionEtiquette =
            tag(
              "ie-chips",
              { class: "tag-style color-theme" },
              GTraductions.getValeur("FicheStage.conventionSignee") +
                " " +
                lCpt +
                "/" +
                lNrMax,
            ) +
            tag("ie-btnicon", {
              class: "icon_question avecFond",
              "ie-model": "getInfoConvention",
              "aria-label": GTraductions.getValeur(
                "FicheStage.detailInfoSignatureConvention",
              ),
            });
        } else {
          lConventionEtiquette = tag(
            "ie-chips",
            { class: "tag-style" },
            GTraductions.getValeur("FicheStage.conventionNonSignee"),
          );
        }
        H.push(
          tag(
            "div",
            { class: "onglet-suivi" },
            tag("div", { class: "conteneur-convention" }, lConventionEtiquette),
            tag("div", {
              class: "conteneur-liste-suivi",
              id: this.instanceListeSuivis.getNom(),
            }),
          ),
        );
        break;
      }
      case EGenreAffichageFicheStage.Appreciations:
        H.push('<div class="conteneur-FicheStage">');
        H.push(
          UtilitaireFicheStage.composeBlocAppreciations(this.donnees, {
            parametres: this.parametres,
            controleur: this.controleur,
          }),
        );
        H.push("</div>");
        break;
      default:
        break;
    }
    return H.join("");
  }
  actionSurValidation() {
    this.callback.appel();
  }
}
function _evenementListeSuivis(aParams) {
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.Creation:
      UtilitaireFicheStage.composeFenetreCreerSuivi(this);
      break;
    case EGenreEvenementListe.Selection:
      this.suivi = aParams.article;
      this.callback.appel({ suivi: this.suivi });
      break;
  }
}
function _getInfoConvention(aHtml) {
  const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre, {
    pere: this,
    initialiser: function (aInstance) {
      aInstance.setOptionsFenetre({
        titre: GTraductions.getValeur("FicheStage.conventionSignee"),
      });
    },
  });
  lFenetre.afficher(aHtml);
}
module.exports = { PageFicheStage_Mobile };
