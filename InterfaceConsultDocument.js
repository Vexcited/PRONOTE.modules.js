const { ObjetInterface } = require("ObjetInterface.js");
const { GUID } = require("GUID.js");
const { ObjetMenuCtxMixte } = require("ObjetMenuCtxMixte.js");
const { ETypeAffEnModeMixte } = require("Enumere_MenuCtxModeMixte.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { tag } = require("tag.js");
const { GTraductions } = require("ObjetTraduction.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { GHtml } = require("ObjetHtml.js");
const EGenreEventDocument = {
  depotCloud: 1,
  supprimer: 2,
  marquerLu: 3,
  marquerNonLu: 4,
  btnRetour: 5,
  ouvrirfenetrePdfEtCloud: 6,
  genererLePdf: 7,
  archiverSurMonCloud: 8,
  redeposerLeFichierRempli: 9,
  deposerLeFichier: 10,
  telecharger: 11,
  supprimerFichierDepose: 12,
  ouvrirfenetreTelechargerEtClourd: 13,
};
class InterfaceConsultDocument extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.options = {
      avecBtnRetour: false,
      avecTitreHeader: IE.estMobile,
      listeBoutonsCtxMixte: [],
      listeBoutons: [],
    };
    this.idPage = GUID.getId();
    this.utilitaire = null;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecBtnRetour() {
        return (
          aInstance && aInstance.options && aInstance.options.avecBtnRetour
        );
      },
      btnRetour: {
        event: function () {
          aInstance.callback.appel({
            genreEvenement: EGenreEventDocument.btnRetour,
          });
        },
      },
      titre: {
        ifMain() {
          return !this.controleur.titre.ifHeader();
        },
        ifHeader() {
          return aInstance && aInstance.options.avecTitreHeader;
        },
        html() {
          if (
            aInstance.donnees &&
            aInstance.donnees.article &&
            aInstance.utilitaire
          ) {
            const lInfos = aInstance.utilitaire.getInfoDoc(
              aInstance.donnees.article,
            );
            if (lInfos && lInfos.titre) {
              return lInfos.titre;
            }
          }
          return "";
        },
      },
      date: {
        if() {
          return (
            !!aInstance.donnees &&
            aInstance.donnees.article &&
            ((aInstance.donnees.article.dateDebutPublication &&
              aInstance.donnees.article.dateFinPublication) ||
              aInstance.donnees.article.date)
          );
        },
        html() {
          return (
            aInstance.donnees &&
            aInstance.donnees.article &&
            aInstance.utilitaire &&
            aInstance.utilitaire.getStrPublication(aInstance.donnees.article)
          );
        },
      },
      categorie: {
        if() {
          return (
            !!aInstance.donnees &&
            aInstance.donnees.article &&
            aInstance.donnees.article.categorie
          );
        },
        html() {
          return (
            GTraductions.getValeur(
              "documentsATelecharger.categorie",
            ).ucfirst() +
            " : " +
            aInstance.donnees.article.categorie.getLibelle()
          );
        },
      },
      memo: {
        if() {
          return (
            !!aInstance.donnees &&
            aInstance.donnees.article &&
            aInstance.donnees.article.memo &&
            aInstance.donnees.article.memo.length > 0
          );
        },
        html() {
          return aInstance.donnees.article.memo;
        },
      },
      message: {
        if() {
          if (
            !!aInstance.donnees &&
            aInstance.donnees.article &&
            aInstance.utilitaire
          ) {
            const lInfos = aInstance.utilitaire.getInfoDoc(
              aInstance.donnees.article,
            );
            if (lInfos.message && lInfos.message.length > 0) {
              return true;
            }
          }
          return false;
        },
        html() {
          return aInstance.utilitaire.getInfoDoc(aInstance.donnees.article)
            .message;
        },
      },
      bouton: {
        getDisabled(aGenreEvenement, aIndex) {
          if (aInstance && aInstance.donnees && aInstance.donnees.article) {
            const lGetDisabled =
              aInstance &&
              aInstance.options &&
              aInstance.options.listeBoutons &&
              aInstance.options.listeBoutons[aIndex] &&
              aInstance.options.listeBoutons[aIndex].model &&
              aInstance.options.listeBoutons[aIndex].model.getDisabled;
            if (MethodesObjet.isFunction(lGetDisabled)) {
              return lGetDisabled(aInstance.donnees.article);
            }
          }
          return false;
        },
        if(aIndex) {
          if (aInstance && aInstance.donnees && aInstance.donnees.article) {
            const lIf =
              aInstance &&
              aInstance.options &&
              aInstance.options.listeBoutons &&
              aInstance.options.listeBoutons[aIndex] &&
              aInstance.options.listeBoutons[aIndex].model &&
              aInstance.options.listeBoutons[aIndex].model.if;
            if (MethodesObjet.isFunction(lIf)) {
              return lIf(aInstance.donnees.article);
            }
          }
          return false;
        },
        event(aGenreEvenement) {
          aInstance.callback.appel({
            genreEvenement: aGenreEvenement,
            article: aInstance.donnees.article,
          });
        },
      },
      chipsPJ: {
        if() {
          return (
            !!aInstance.donnees &&
            aInstance.donnees.article &&
            aInstance.donnees.article.listePJ &&
            aInstance.donnees.article.listePJ.count() > 0
          );
        },
        eventBtn: function () {},
      },
      chipsPieceJointe: {
        eventBtn: function (aIndice) {
          const lArticle = aInstance.donnees && aInstance.donnees.article;
          if (lArticle && lArticle.listePJ) {
            const lDocumentJointASupp = lArticle.listePJ.get(aIndice);
            if (!!lDocumentJointASupp) {
              GApplication.getMessage().afficher({
                type: EGenreBoiteMessage.Confirmation,
                message: GTraductions.getValeur(
                  "PageCompte.ConfirmationSuppression",
                ),
                callback: function (aGenreAction) {
                  if (aGenreAction === EGenreAction.Valider) {
                    lDocumentJointASupp.setEtat(EGenreEtat.Suppression);
                    lArticle.setEtat(EGenreEtat.Modification);
                    aInstance.callback.appel({
                      genreEvenement:
                        EGenreEventDocument.supprimerFichierDepose,
                      article: lArticle,
                    });
                  }
                },
              });
            }
          }
        },
      },
    });
  }
  construireInstances() {
    this.identMenuCtxMixte = this.add(
      ObjetMenuCtxMixte,
      _evntSurMenuCtxMixte.bind(this),
    );
  }
  setOptions(aOptions) {
    Object.assign(this.options, aOptions);
    return this;
  }
  setDonnees(aParams) {
    this.donnees = aParams;
    this.initialiser();
    const lMenuCtxMixte = this.getInstance(this.identMenuCtxMixte);
    const lMenu = lMenuCtxMixte.menuContextuel;
    lMenu.vider();
    if (aParams && aParams.article) {
      _initCommandesMenuCtx.call(this, lMenu, aParams.article);
      this.afficher(_getHtml.call(this, aParams.article));
      lMenuCtxMixte.initialiser();
    } else {
      GHtml.setHtml(this.idPage, _construirePageAucun.call(this), {
        controleur: this.controleur,
      });
    }
  }
}
function _initCommandesMenuCtx(aMenu) {
  if (Array.isArray(this.options.listeBoutonsCtxMixte)) {
    this.options.listeBoutonsCtxMixte.map((aBtn) => {
      const lOptions = {
        Numero: aBtn.genreEvenement,
        typeAffEnModeMixte: ETypeAffEnModeMixte.ellipsis,
      };
      if (aBtn.icon) {
        lOptions.icon = aBtn.icon;
        lOptions.typeAffEnModeMixte = ETypeAffEnModeMixte.icon;
      }
      aMenu.add(
        aBtn.libelle,
        aBtn.actif,
        () => this.callback.appel({ genreEvenement: aBtn.genreEvenement }),
        lOptions,
      );
    });
  }
}
function _getHtml() {
  const H = [];
  H.push(`<div class="InterfaceConsultDocument p-all-l" id="${this.idPage}">`);
  H.push(
    `<header class="flex-contain header">`,
    `<ie-btnicon ie-model="btnRetour" class="icon_retour_mobile retour i-large" ie-if="avecBtnRetour" ></ie-btnicon>`,
    `<h3 class="flex-contain fluid-bloc justify-center flex-center" ie-if="titre.ifHeader" ie-html="titre.html"></h3>`,
    `</header>`,
  );
  H.push(
    `<div class="m-bottom-xl" id="${this.getNomInstance(this.identMenuCtxMixte)}"></div>`,
    `<div>`,
    `<h3 ie-if="titre.ifMain" ie-html="titre.html" class="m-bottom-l"></h3>`,
    `<div class="ie-sous-titre" ie-if="date.if" ie-html="date.html"></div>`,
    `<div class="ie-sous-titre" ie-if="categorie.if" ie-html="categorie.html"></div>`,
    `<div class="ie-texte m-y-xxl memo" ie-if="memo.if" ie-html="memo.html"></div>`,
    `<div class="ie-texte m-y-xxl"  ie-if="message.if" ie-html="message.html"></div>`,
    `</div>`,
    `<div class="flex-contain cols flex-end p-all-xl">`,
    _composeListeBoutons.call(this),
    `<div ie-if="chipsPJ.if" ie-model="chipsPJ" class="m-top-xxl" href="">`,
    _composeListeChips.call(this),
    `</div>`,
    `</div>`,
  );
  H.push(`</div>`);
  return H.join("");
}
function _evntSurMenuCtxMixte() {}
function _composeListeBoutons() {
  const H = [];
  if (Array.isArray(this.options.listeBoutons)) {
    this.options.listeBoutons.map((aBtn, aIndex) => {
      H.push(
        tag(
          "ie-bouton",
          {
            class: [
              aBtn.secondaire
                ? TypeThemeBouton.secondaire
                : TypeThemeBouton.primaire,
              "btn-width",
            ],
            "ie-model": tag.funcAttr("bouton", [aBtn.genreEvenement, aIndex]),
            "ie-if": tag.funcAttr("bouton.if", [aIndex]),
          },
          aBtn.libelle,
        ),
      );
    });
  }
  return H.join();
}
function _composeListeChips() {
  const H = [];
  const lArticle = this.donnees && this.donnees.article && this.donnees.article;
  if (lArticle && lArticle.listePJ && lArticle.listePJ.count() > 0) {
    H.push(
      UtilitaireUrl.construireListeUrls(lArticle.listePJ, {
        genreRessource: EGenreRessource.DocJointEleve,
        IEModelChips: !!lArticle.avecDepotAutorise ? "chipsPieceJointe" : "",
      }),
    );
  }
  return H.join("");
}
function _construirePageAucun() {
  const H = [];
  if (this.options.avecMsgAucun) {
    H.push(
      tag(
        "div",
        { class: "message-vide" },
        tag("div", { class: "message" }, GTraductions.getValeur("vide")),
        tag("div", { class: "Image_No_Data", "aria-hidden": "true" }),
      ),
    );
  }
  return H.join("");
}
module.exports = { InterfaceConsultDocument, EGenreEventDocument };
