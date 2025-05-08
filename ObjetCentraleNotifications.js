exports.ObjetCentraleNotifications = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Invocateur_1 = require("Invocateur");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDate_1 = require("ObjetDate");
const TypeCentraleNotifications_1 = require("TypeCentraleNotifications");
const ObjetDonneesCentraleNotifications_1 = require("ObjetDonneesCentraleNotifications");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const jsx_1 = require("jsx");
CollectionRequetes_1.Requetes.inscrire(
  "CentraleNotifications",
  ObjetRequeteJSON_1.ObjetRequeteConsultation,
);
class ObjetCentraleNotifications extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.idContenu = this.Nom + "_contenu";
    this.donneesCentraleNotifications =
      GApplication.donneesCentraleNotifications;
    this.idsDescrTitre = [];
    Invocateur_1.Invocateur.abonner(
      ObjetDonneesCentraleNotifications_1.ObjetDonneesCentraleNotifications
        .typeNotif.surModification,
      (aParams) => {
        if (!aParams.masquerNbNotifs) {
          this._requete();
        }
      },
      this,
    );
    this.setOptions({ actionneur: null, timerOuverture: null });
  }
  free() {
    super.free();
    $("#" + this.Nom.escapeJQ()).remove();
  }
  recupererDonnees() {
    this._requete(true);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeRacine: function () {
        $(this.node).on({
          keyup: function (aEvent) {
            if (aEvent.which === ToucheClavier_1.ToucheClavier.Echap) {
              aInstance.fermer();
            }
          },
        });
      },
      btnFermer: {
        event: function () {
          aInstance.fermer();
        },
      },
      avecCompteurGeneral: function () {
        return aInstance.donneesCentraleNotifications.nbNotifs > 0;
      },
      getAttrHeader() {
        return {
          "aria-label": ObjetCentraleNotifications.getMessageNotifications(
            aInstance.donneesCentraleNotifications,
          ),
          "aria-describedby": aInstance.idsDescrTitre.join(" "),
        };
      },
      getHtmlNbNotifs: function () {
        return aInstance.donneesCentraleNotifications.nbNotifs > 99
          ? "99+"
          : aInstance.donneesCentraleNotifications.nbNotifs;
      },
      btnSectionLu: {
        event: function (aIndexSection) {
          const lSection = aInstance.donnees.liste.get(aIndexSection);
          if (lSection) {
            aInstance._afficherSectionLue(lSection);
          }
        },
      },
      getNodeNotif: function (aIndexSection, aIndexNotif) {
        const lNotif = aInstance._getNotifDIndexs(aIndexSection, aIndexNotif);
        if (lNotif) {
          $(this.node).eventValidation(() => {
            aInstance._navigation(lNotif);
          });
        }
      },
      btnNotifCoin: {
        event: function (aIndexSection, aIndexNotif) {
          const lNotif = aInstance._getNotifDIndexs(aIndexSection, aIndexNotif);
          if (lNotif && lNotif.onBtnClick) {
            aInstance._onBtnCoinClick(lNotif);
          }
        },
      },
      getNodeMessage: function () {
        $(this.node)
          .find("*")
          .each(function () {
            if (this.style && this.style.fontWeight === "bold") {
              this.style.fontWeight = "";
              $(this).addClass("sc_article_contenu_bold");
            }
          });
      },
      afficherAucuneNotif: function () {
        return aInstance.donneesCentraleNotifications.nbNotifs === 0;
      },
      afficherPapillion: function () {
        return aInstance.donneesCentraleNotifications.nbNotifs > 0;
      },
    });
  }
  fermer() {
    $("#" + this.Nom.escapeJQ() + " .cn_scroll").addClass("cn_scroll_inactif");
    this.callback.appel();
  }
  static getMessageNotifications(aDonnees) {
    if (!aDonnees) {
      return "";
    }
    return this.getMessagNbNotifications(aDonnees.nbNotifs);
  }
  static getMessagNbNotifications(aNbs) {
    return aNbs === 0
      ? ObjetTraduction_1.GTraductions.getValeur(
          "CentraleNotifications.AucuneNotification",
        )
      : aNbs > 1
        ? ObjetTraduction_1.GTraductions.getValeur(
            "CentraleNotifications.Notifications_S",
            [aNbs],
          )
        : ObjetTraduction_1.GTraductions.getValeur(
            "CentraleNotifications.Notification_S",
            [aNbs],
          );
  }
  construireAffichage() {
    this.idsDescrTitre = [];
    return IE.jsx.str(
      "div",
      {
        "ie-node": "getNodeRacine",
        class: "ObjetCentraleNotifications disable-dark-mode",
      },
      IE.jsx.str(
        "div",
        { class: "cn-header" },
        IE.jsx.str(
          "h1",
          {
            tabindex: "0",
            "ie-attr": "getAttrHeader",
            class: "cn_titre_notif",
          },
          ObjetTraduction_1.GTraductions.getValeur(
            "CentraleNotifications.TitreNotifications",
          ),
        ),
        IE.jsx.str(
          "div",
          {
            class: "cn_compteurTotal",
            "ie-if": "avecCompteurGeneral",
            "aria-hidden": "true",
          },
          IE.jsx.str(
            "div",
            null,
            IE.jsx.str("label", { "ie-html": "getHtmlNbNotifs" }),
          ),
        ),
        IE.jsx.str(
          "div",
          { class: "cn_fermeture" },
          IE.jsx.str("ie-btnimage", {
            "ie-model": "btnFermer",
            class: "icon_fermeture_widget btnImageIcon",
            title: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
          }),
        ),
      ),
      IE.jsx.str("i", {
        "ie-if": "afficherPapillion",
        class: "image_centrale_notification",
        role: "presentation",
      }),
      IE.jsx.str(
        "div",
        { "ie-if": "afficherAucuneNotif", class: "cn_imgAucuneNouvelleNotif" },
        IE.jsx.str("div", null),
        ObjetTraduction_1.GTraductions.getValeur(
          "CentraleNotifications.AucuneNouvelleNotification",
        ),
      ),
      IE.jsx.str("div", { class: "cn_liste_notifs", id: this.idContenu }),
    );
  }
  _navigation(aNotification) {
    Promise.resolve()
      .then(() => {
        if (aNotification.onNotifClick) {
          return this._notificationSaisieClick(aNotification);
        }
      })
      .then(() => {
        this.options.actionneur.actionNotification(aNotification);
        if (
          aNotification.action ===
          TypeCentraleNotifications_1.TypeActionBoutonNotif.abnLien
        ) {
          this.fermer();
        } else if (aNotification.onNotifClick) {
          this._actualiser();
        }
      });
  }
  _onBtnCoinClick(aNotification) {
    return this._notificationSaisie(aNotification, { onBtnClick: true }).then(
      () => {
        this._actualiser();
      },
    );
  }
  _notificationSaisieClick(aNotification) {
    return this._notificationSaisie(aNotification, { onNotifClick: true });
  }
  _notificationSaisie(aNotification, aParams) {
    const lParams = Object.assign(aParams, {
      estSaisie: true,
      idNotif: aNotification.id,
    });
    return (0, CollectionRequetes_1.Requetes)("CentraleNotifications", this)
      .lancerRequete(lParams)
      .then((aDonnees) => {
        if (aDonnees.ok) {
          const lAvecDecrementNotif = !aNotification.modalites.contains(
            TypeCentraleNotifications_1.TypeModaliteAffichage.affHistorique,
          );
          if (lParams.onBtnClick) {
            switch (aNotification.action) {
              case TypeCentraleNotifications_1.TypeActionBoutonNotif.abnLu:
                aNotification.modalites.add(
                  TypeCentraleNotifications_1.TypeModaliteAffichage
                    .affHistorique,
                );
                break;
              case TypeCentraleNotifications_1.TypeActionBoutonNotif.abnFermer:
                this.donnees.liste.parcourir((aSection) => {
                  aSection.liste = aSection.liste.getListeElements((aNotif) => {
                    return aNotif.id !== aNotification.id;
                  });
                });
                break;
            }
          }
          if (lAvecDecrementNotif) {
            Invocateur_1.Invocateur.evenement(
              ObjetDonneesCentraleNotifications_1
                .ObjetDonneesCentraleNotifications.typeNotif.masquerNbNotifs,
              1,
            );
          }
        }
      });
  }
  _getNotifDIndexs(aIndexSection, aIndexNotif) {
    const lSection = this.donnees.liste.get(aIndexSection);
    if (lSection) {
      return lSection.liste.get(aIndexNotif);
    }
  }
  _requete(aSurDemarrage) {
    if (this._requeteEnCours) {
      return;
    }
    this._requeteEnCours = true;
    const lDemarrageAnimation =
      aSurDemarrage && this.options.timerOuverture > 0;
    const lPromises = [
      (0, CollectionRequetes_1.Requetes)("CentraleNotifications", this)
        .lancerRequete()
        .then(async (aDonnees) => {
          this.donnees = aDonnees;
          if (this.donnees && this.donnees.liste) {
            this.donnees.liste.parcourir((aSection) => {
              if (aSection.avecTri && aSection.liste) {
                aSection.liste
                  .setTri([
                    ObjetTri_1.ObjetTri.init("type"),
                    ObjetTri_1.ObjetTri.init(
                      "date",
                      Enumere_TriElement_1.EGenreTriElement.Decroissant,
                    ),
                    ObjetTri_1.ObjetTri.init("id"),
                    ObjetTri_1.ObjetTri.init("titre"),
                  ])
                  .trier();
              }
            });
          }
          if (!this._estDetruite) {
            this._actualiser(aSurDemarrage);
            await this.$refreshSelf();
            $(
              "#" +
                this.Nom.escapeJQ() +
                " .ObjetCentraleNotifications .cn_titre_notif",
            ).trigger("focus");
          }
        }),
    ];
    if (lDemarrageAnimation) {
      lPromises.push(
        new Promise((aResolve) => {
          setTimeout(() => {
            aResolve();
          }, this.options.timerOuverture);
        }),
      );
    }
    Promise.all(lPromises)
      .then(() => {
        $("#" + this.Nom.escapeJQ() + " .cn_scroll").removeClass(
          "cn_scroll_inactif",
        );
      })
      .finally(() => {
        this._requeteEnCours = false;
      });
  }
  async _afficherSectionLue(aSection) {
    aSection._afficherhistorique = !aSection._afficherhistorique;
    this._actualiser();
    await this.$refreshSelf();
    $(
      `#${this.getIdSection(aSection.ident).escapeJQ()} .cn_section_btnLu .btnImageIcon`,
    ).trigger("focus");
  }
  _construireListeNotifications(aSection, aIndexSection, aAfficherHistorique) {
    const H = [];
    aSection.liste.parcourir((aNotification, aIndexNotif) => {
      const lEstHistorique = aNotification.modalites.contains(
        TypeCentraleNotifications_1.TypeModaliteAffichage.affHistorique,
      );
      if (
        (aAfficherHistorique && !lEstHistorique) ||
        (!aAfficherHistorique && lEstHistorique)
      ) {
        return;
      }
      const lIdArticle = `${this.Nom}_art_s${aIndexSection}_n${aIndexNotif}`;
      let lBoutonCoin = "";
      let lAvecActionArticle = false;
      switch (aNotification.action) {
        case TypeCentraleNotifications_1.TypeActionBoutonNotif.abnLien:
          lBoutonCoin = IE.jsx.str("i", {
            class: "sc_btnCoin icon_affichage_widget",
            role: "presentation",
          });
          lAvecActionArticle = true;
          break;
        case TypeCentraleNotifications_1.TypeActionBoutonNotif.abnLu:
          if (!aAfficherHistorique) {
            lBoutonCoin = IE.jsx.str("ie-btnimage", {
              class: "sc_btnCoin btnImageIcon icon_eye_close",
              title: ObjetTraduction_1.GTraductions.getValeur(
                "CentraleNotifications.MarquerLu",
              ),
              "ie-model": (0, jsx_1.jsxFuncAttr)("btnNotifCoin", [
                aIndexSection,
                aIndexNotif,
              ]),
              "aria-describedby": lIdArticle,
            });
          }
          break;
        case TypeCentraleNotifications_1.TypeActionBoutonNotif.abnFermer:
          lBoutonCoin = IE.jsx.str("ie-btnimage", {
            class: "sc_btnCoin btnImageIcon icon_fermeture_widget",
            title: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
            "ie-model": (0, jsx_1.jsxFuncAttr)("btnNotifCoin", [
              aIndexSection,
              aIndexNotif,
            ]),
            "aria-describedby": lIdArticle,
          });
          break;
      }
      const lClasses = ["sc_article"];
      if (lAvecActionArticle) {
        lClasses.push("sc_article_action", "ie-ripple");
      }
      if (aAfficherHistorique) {
        lClasses.push("sc_article_histo");
      }
      H.push(
        IE.jsx.str(
          "article",
          { class: lClasses.join(" ") },
          IE.jsx.str(
            "div",
            {
              id: lIdArticle,
              tabindex: lAvecActionArticle ? "0" : false,
              role: lAvecActionArticle ? "link" : false,
              "ie-node": lAvecActionArticle
                ? (0, jsx_1.jsxFuncAttr)("getNodeNotif", [
                    aIndexSection,
                    aIndexNotif,
                    aNotification.id,
                  ])
                : false,
            },
            lBoutonCoin,
            IE.jsx.str(
              "div",
              { class: "sc_article_gauche" },
              _contruireEtiquetteArticle(aNotification),
            ),
            IE.jsx.str(
              "div",
              { class: "sc_article_contenu" },
              aNotification.titre
                ? '<div class="sc_article_contenu_titre' +
                    (lBoutonCoin ? " sc_article_contenu_titre_avecBtn" : "") +
                    '">' +
                    aNotification.titre +
                    "</div>"
                : "",
              IE.jsx.str(
                "div",
                { "ie-node": "getNodeMessage" },
                aNotification.message,
              ),
              aNotification.dateLue ? _construireDateLue(aNotification) : "",
              aNotification.dateExpiration && lEstHistorique
                ? _construireDateExpiration(aNotification)
                : "",
            ),
            lAvecActionArticle
              ? IE.jsx.str(
                  "p",
                  { class: "sr-only" },
                  ObjetTraduction_1.GTraductions.getValeur(
                    "accueil.hint.toutVoir",
                  ),
                )
              : "",
          ),
        ),
      );
    });
    return H.join("");
  }
  getIdSection(aIdent) {
    return `${this.Nom}_ti_sec_${aIdent}`;
  }
  _actualiser(aSurDemarrage) {
    this.idsDescrTitre = [];
    const H = [];
    let lScrollTop = 0;
    if (!aSurDemarrage) {
      const lElement = $("#" + this.idContenu.escapeJQ() + " .cn_scroll").get(
        0,
      );
      if (lElement && lElement.scrollTop > 0) {
        lScrollTop = lElement.scrollTop;
      }
    }
    H.push(
      '<div class="cn_scroll',
      aSurDemarrage ? " cn_scroll_inactif" : "",
      '">',
    );
    H.push('<div class="cb_contenu_scroll">');
    this.donnees.liste.parcourir((aSection, aIndexSection) => {
      if (aSection.liste.count() === 0) {
        return;
      }
      let lNbLus = 0;
      let lNbNonLus = 0;
      aSection.liste.parcourir((aNotification) => {
        if (
          aNotification.modalites.contains(
            TypeCentraleNotifications_1.TypeModaliteAffichage.affHistorique,
          )
        ) {
          lNbLus += aNotification.compteur;
        } else if (
          aNotification.modalites.contains(
            TypeCentraleNotifications_1.TypeModaliteAffichage.affZone,
          )
        ) {
          lNbNonLus += aNotification.compteur;
        }
      });
      let lLabelTitre = `${aSection.getLibelle()} - ${ObjetCentraleNotifications.getMessagNbNotifications(lNbNonLus)}`;
      if (lNbLus > 0) {
        lLabelTitre += ` - ${ObjetTraduction_1.GTraductions.getValeur("CentraleNotifications.Lues_S", [ObjetCentraleNotifications.getMessagNbNotifications(lNbLus)])}`;
      }
      const lId = this.getIdSection(aSection.ident);
      this.idsDescrTitre.push(lId);
      H.push(
        IE.jsx.str(
          "div",
          {
            class: "cn_section cn_section_" + aSection.ident,
            role: "group",
            "aria-label": lLabelTitre,
            id: lId,
          },
          IE.jsx.str(
            "div",
            { class: "cn-header" },
            IE.jsx.str(
              "div",
              { class: "cn_section_titre" },
              IE.jsx.str("i", { role: "presentation" }),
              IE.jsx.str(
                "h2",
                { class: "cn-header-texte" },
                aSection.getLibelle(),
              ),
              lNbNonLus > 0
                ? IE.jsx.str("div", { class: "cn_section_lu" }, lNbNonLus)
                : "",
            ),
            lNbLus > 0
              ? IE.jsx.str(
                  "div",
                  { class: "cn_section_btnLu" },
                  IE.jsx.str("ie-btnimage", {
                    class: "icon_eye_open btnImageIcon",
                    title: ObjetTraduction_1.GTraductions.getValeur(
                      "CentraleNotifications.HistoSectionTitre",
                      [aSection.getLibelle()],
                    ),
                    "ie-model": (0, jsx_1.jsxFuncAttr)(
                      "btnSectionLu",
                      aIndexSection,
                    ),
                  }),
                  IE.jsx.str("label", { class: "cn-header-texte" }, lNbLus),
                )
              : "",
          ),
          this._construireListeNotifications(aSection, aIndexSection),
          aSection._afficherhistorique
            ? this._construireListeNotifications(aSection, aIndexSection, true)
            : "",
        ),
      );
    });
    H.push("</div>");
    H.push("</div>");
    ObjetHtml_1.GHtml.setHtml(this.idContenu, H.join(""), { instance: this });
    if (lScrollTop > 0) {
      let lElement = $("#" + this.idContenu.escapeJQ() + " .cn_scroll").get(0);
      if (lElement) {
        lElement.scrollTop = lScrollTop;
      }
    }
  }
}
exports.ObjetCentraleNotifications = ObjetCentraleNotifications;
function _contruireEtiquetteArticle(aNotification) {
  const H = [];
  switch (aNotification.type) {
    case TypeCentraleNotifications_1.TypeNotification.nCompteur:
      H.push("<div>" + aNotification.compteur + "</div>");
      break;
    default: {
      let lJour = "";
      let lEllipsis = false;
      const lDateCourante = new Date();
      if (ObjetDate_1.GDate.estJourEgal(lDateCourante, aNotification.date)) {
        lJour = IE.jsx.str("i", {
          class: "icon_calendrier_aujourdhui",
          role: "presentation",
        });
      } else if (
        ObjetDate_1.GDate.estJourEgal(
          ObjetDate_1.GDate.getJourSuivant(lDateCourante, -1),
          aNotification.date,
        )
      ) {
        lJour = ObjetTraduction_1.GTraductions.getValeur("Hier");
        lEllipsis = true;
      } else {
        lJour = ObjetDate_1.GDate.formatDate(aNotification.date, "%JJ/%MM");
      }
      H.push(
        '<div class="cn_etiquette_jour"',
        lEllipsis ? " ie-ellipsis" : "",
        ">",
        lJour,
        "</div>",
        '<div class="cn_etiquette_sep"></div>',
        "<div>",
        ObjetDate_1.GDate.formatDate(aNotification.date, "%hh%sh%mm"),
        "</div>",
      );
    }
  }
  return H.join("");
}
function _construireDateLue(aNotification) {
  return [
    '<div class="sc_datePied">',
    '<i class="icon_eye_open,"></i>',
    ObjetTraduction_1.GTraductions.getValeur(
      "CentraleNotifications.HistoNotifLueLe",
      [ObjetDate_1.GDate.formatDate(aNotification.dateLue, "%JJ/%MM/%AAAA")],
    ),
    "</div>",
  ].join("");
}
function _construireDateExpiration(aNotification) {
  return [
    '<div class="sc_datePied">',
    '<i class="icon_time"></i>',
    ObjetTraduction_1.GTraductions.getValeur(
      "CentraleNotifications.HistoNotifSuppr",
      [
        ObjetDate_1.GDate.formatDate(
          aNotification.dateExpiration,
          "%JJ/%MM/%AAAA",
        ),
      ],
    ),
    "</div>",
  ].join("");
}
