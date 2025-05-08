exports.InterfaceDetailRDV = void 0;
const MoteurRDV_1 = require("MoteurRDV");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetMenuCtxMixte_1 = require("ObjetMenuCtxMixte");
const UtilitaireUrl_1 = require("UtilitaireUrl");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypesRDV_1 = require("TypesRDV");
const ObjetChaine_1 = require("ObjetChaine");
class InterfaceDetailRDV extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.moteurRDV = new MoteurRDV_1.MoteurRDV();
    this.idPage = GUID_1.GUID.getId();
  }
  setParam(aParam) {
    this.clbckMenuCtx = aParam.clbckMenuCtx;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getDisplayMenuCtxMixte: function () {
        let lMoteurRdv = aInstance.moteurRDV;
        return lMoteurRdv.avecCmdMenuCtx(aInstance.donnee);
      },
      getMenuCtxMixte() {
        return {
          class: ObjetMenuCtxMixte_1.ObjetMenuCtxMixte,
          pere: aInstance,
          init(aMenuCtxMixte) {
            let lMoteurRdv = aInstance.moteurRDV;
            if (lMoteurRdv.avecCmdMenuCtx(aInstance.donnee)) {
              aMenuCtxMixte.setOptions({
                avecBoutonEllipsis: false,
                callbackAddCommandes: function (aMenu) {
                  aInstance.moteurRDV.initCmdMenuCtx(
                    aMenu,
                    aInstance.donnee,
                    aInstance.clbckMenuCtx,
                  );
                },
              });
            }
          },
        };
      },
      chipsHeureCreneauRDV: {
        getDisabled() {
          return false;
        },
        getLibelle() {
          return ObjetDate_1.GDate.formatDate(
            aInstance.donnee.creneau.debut,
            "%hh%sh%mm",
          );
        },
      },
    });
  }
  construireInstances() {}
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    return IE.jsx.str("div", {
      class: ["InterfaceDetailRDV"],
      id: this.idPage,
    });
  }
  setDonnees(aRDV) {
    this.donnee = aRDV;
    if (this.donnee !== null && this.donnee !== undefined) {
      this.telephoneInit = this.donnee.telephone;
      this.indTelInit = this.donnee.indTelephone;
      ObjetHtml_1.GHtml.setHtml(this.idPage, this._construirePage(), {
        controleur: this.controleur,
      });
    } else {
      ObjetHtml_1.GHtml.setHtml(this.idPage, this._construirePageAucun(), {
        controleur: this.controleur,
      });
    }
  }
  _construirePage() {
    let lEstRefus = this.moteurRDV.estRdvRefuse(this.donnee);
    let lEstCtxPresenceDemandee = this.moteurRDV.estCtxPresenceDemandeeAuRdv(
      this.donnee,
    );
    let lEstCtxRdvEnSerie = this.moteurRDV.estUnRdvEnSerie(this.donnee);
    let lBtnAction = IE.jsx.str("div", {
      "ie-identite": "getMenuCtxMixte",
      "ie-display": "getDisplayMenuCtxMixte",
      class: "btn-wrapper",
    });
    let lAvecPJSession =
      (this.donnee.estRdvSessionSerie || lEstCtxRdvEnSerie) &&
      this.donnee.session.listePJ &&
      this.donnee.session.listePJ.count() > 0;
    let lAvecPJRdv = this.donnee.listePJ && this.donnee.listePJ.count() > 0;
    let lEstProposition = this.moteurRDV.estProposition(this.donnee);
    let lAvecLegendeTel = false;
    let lAvecLegendeOccupe = false;
    if (lEstProposition) {
      lAvecLegendeOccupe =
        !this.moteurRDV.estAvecChoixCreneau(this.donnee) &&
        this.moteurRDV.existeCreneauOccupeOuPasse(
          this.donnee.session.listeCreneauxProposes,
        );
      lAvecLegendeTel = this.moteurRDV.existeCreneauTelephonique(
        this.donnee.session.listeCreneauxProposes,
      );
    }
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      !this.moteurRDV.estDemande(this.donnee) ? lBtnAction : "",
      IE.estMobile ? "" : this.moteurRDV.getHtmlResumeRDV(this.donnee),
      IE.jsx.str(
        "div",
        { class: ["rdv-content"] },
        this.moteurRDV.existeCreneauPourRdv(this.donnee)
          ? this._getHtmlSectionCreneau()
          : "",
        this.donnee.session.avecPresenceEleve
          ? IE.jsx.str(
              "div",
              { class: "section" },
              lEstCtxPresenceDemandee
                ? ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.presenceDemandee",
                  )
                : ObjetTraduction_1.GTraductions.getValeur(
                    "RDV.presenceEleveDemandee",
                  ),
            )
          : "",
        this._avecSectionTelephone()
          ? this.moteurRDV.composeSectionTelephone(
              this.controleur,
              this.donnee,
              true,
              "",
              [IE.estMobile ? "p-y-xl" : "field-contain label-up", ""],
              ["ie-titre-petit", "m-bottom"],
            )
          : "",
        IE.jsx.str("div", { class: "sep border-b p-y m-bottom-xl" }),
        IE.jsx.str(
          "div",
          { class: "section sujet" },
          this.donnee.session.sujet,
        ),
        IE.jsx.str(
          "div",
          { class: ["p-y-l", lAvecPJSession || lAvecPJRdv ? "" : "section"] },
          this.donnee.session.description,
        ),
        lAvecPJSession
          ? IE.jsx.str(
              "div",
              { class: ["section"] },
              UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
                this.donnee.session.listePJ,
                { maxWidth: MoteurRDV_1.MoteurRDV.C_WidthMaxChipsPJ },
              ),
            )
          : "",
        lAvecPJRdv
          ? IE.jsx.str(
              "div",
              { class: ["section"] },
              UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(
                this.donnee.listePJ,
                { maxWidth: MoteurRDV_1.MoteurRDV.C_WidthMaxChipsPJ },
              ),
            )
          : "",
        this.moteurRDV.estRdvAnnule(this.donnee) || lEstRefus
          ? this._getHtmlSectionRefusAnnulation(lEstRefus)
          : "",
        lEstProposition ? this._getHtmlSectionCreneauxProposes() : "",
      ),
      this.moteurRDV.estDemande(this.donnee) ? lBtnAction : "",
      lEstProposition
        ? this.moteurRDV.composeLegendeRdv({
            avecCreneauxOccupes: lAvecLegendeOccupe,
            avecCreneauTel: lAvecLegendeTel,
            avecChampsObl: false,
          })
        : "",
    );
  }
  _avecSectionTelephone() {
    let lEstCtxPresenceDemandee = this.moteurRDV.estCtxPresenceDemandeeAuRdv(
      this.donnee,
    );
    let lAvecSectionTelephone =
      !(this.donnee.estRdvSessionSerie || lEstCtxPresenceDemandee) &&
      !this.moteurRDV.estProposition(this.donnee);
    if (lAvecSectionTelephone) {
      if (
        this.donnee.etat === TypesRDV_1.TypeEtatRDV.terdv_RDVValide &&
        !this.moteurRDV.respRdvPeutVoirTelParticipant(this.donnee)
      ) {
        return false;
      }
    }
    return lAvecSectionTelephone;
  }
  _getHtmlSectionRefusAnnulation(aEstCtxRefus) {
    let lStrIntituleAuteur = aEstCtxRefus
      ? ObjetTraduction_1.GTraductions.getValeur("RDV.refusePar", [
          this.donnee.auteurRefusAnnulation.getLibelle(),
        ])
      : ObjetTraduction_1.GTraductions.getValeur("RDV.annulePar", [
          this.donnee.auteurRefusAnnulation.getLibelle(),
        ]);
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str("div", { class: "m-top-xl" }, lStrIntituleAuteur),
      this._getHtmlSectionMotifRefusAnnulation(aEstCtxRefus),
    );
  }
  _getHtmlSectionMotifRefusAnnulation(aEstCtxRefus) {
    let lStrLabel =
      aEstCtxRefus === true
        ? ObjetTraduction_1.GTraductions.getValeur("RDV.motifRefusRdv")
        : ObjetTraduction_1.GTraductions.getValeur("RDV.motifAnnulationRdv");
    return IE.jsx.str(
      "div",
      { class: "field-contain label-up" },
      IE.jsx.str("label", { class: "ie-titre-petit m-top-xl" }, lStrLabel),
      IE.jsx.str(
        "div",
        null,
        this.donnee.motifRefusAnnulation
          ? ObjetChaine_1.GChaine.replaceRCToHTML(
              this.donnee.motifRefusAnnulation,
            )
          : ObjetTraduction_1.GTraductions.getValeur("RDV.nonRenseigne"),
      ),
    );
  }
  _getHtmlSectionCreneauxProposes() {
    let lAvecChoixCrenau = this.moteurRDV.estAvecChoixCreneau(this.donnee);
    return IE.jsx.str(
      "div",
      { class: "field-contain label-up" },
      IE.jsx.str(
        "label",
        { class: "ie-titre-couleur-petit m-top-xl" },
        lAvecChoixCrenau
          ? ObjetTraduction_1.GTraductions.getValeur("RDV.choixCreneau")
          : ObjetTraduction_1.GTraductions.getValeur("RDV.creneauxProposes"),
      ),
      this.moteurRDV.composeCreneauxProposes(
        this,
        this.donnee,
        this.donnee.session.listeCreneauxProposes,
        {
          avecChoixCreneau: lAvecChoixCrenau,
          avecSuppressionCreneau: false,
          clbckSurValider: () => {
            if (!lAvecChoixCrenau) {
              return;
            }
            let lRdv = this.donnee;
            if (lRdv.getEtat() === Enumere_Etat_1.EGenreEtat.Modification) {
              this.callback.appel(
                lRdv,
                lRdv.telephone !== this.telephoneInit ||
                  lRdv.indTelephone !== this.indTelInit,
              );
            }
          },
          clbckSurAnnuler: () => {
            if (!lAvecChoixCrenau) {
              return;
            }
            let lRdv = this.donnee;
            if (lRdv.getEtat() === Enumere_Etat_1.EGenreEtat.Modification) {
              lRdv.creneau = null;
              if (!this.moteurRDV.estCtxResponsableDeRDV()) {
                lRdv.telephone = this.telephoneInit;
                lRdv.indTelephone = this.indTelInit;
              }
              lRdv.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
            }
          },
        },
      ),
    );
  }
  _getHtmlSectionCreneau() {
    let lStrDateDeb = this.moteurRDV.getHtmlDateCreneau(this.donnee);
    let lStrHeureDeb = IE.jsx.str("ie-chips", {
      "ie-model": "chipsHeureCreneauRDV",
      class: ["iconic", "icon_time", "m-left"],
    });
    let lEstAnnulation = this.moteurRDV.estRdvAnnule(this.donnee);
    let lStrRdv = lEstAnnulation
      ? ObjetTraduction_1.GTraductions.getValeur("RDV.rdvAnnuleLeA", [
          lStrDateDeb,
          lStrHeureDeb,
        ])
      : ObjetTraduction_1.GTraductions.getValeur("RDV.rdvLeA", [
          lStrDateDeb,
          lStrHeureDeb,
        ]);
    let lExisteLieu = this.moteurRDV.existeLieuPourRdv(this.donnee);
    return IE.jsx.str(
      "div",
      { class: ["section", "creneau"] },
      lStrRdv,
      lEstAnnulation || lExisteLieu
        ? ""
        : IE.jsx.str(
            IE.jsx.fragment,
            null,
            this.moteurRDV.getHtmlModaliteCreneau(this.donnee),
          ),
      lEstAnnulation ? "" : this.moteurRDV.getHtmlLieuCreneau(this.donnee),
    );
  }
  _construirePageAucun() {
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "div",
        { class: ["message-vide"] },
        IE.jsx.str(
          "div",
          { class: ["message"] },
          ObjetTraduction_1.GTraductions.getValeur("RDV.selectionnerRDV"),
        ),
        IE.jsx.str("div", { class: ["Image_No_Data"], "aria-hidden": "true" }),
      ),
    );
  }
}
exports.InterfaceDetailRDV = InterfaceDetailRDV;
