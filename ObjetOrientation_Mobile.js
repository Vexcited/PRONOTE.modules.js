const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GUID } = require("GUID.js");
const { GDate } = require("ObjetDate.js");
const { TypeAvisConseil } = require("TypeAvisConseil.js");
const { TypeRubriqueOrientation } = require("TypeRubriqueOrientation.js");
const {
  TUtilitaireOrientation,
  EModeAffichage,
  EGenreEvnt,
} = require("UtilitaireOrientation.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class ObjetOrientation_Mobile extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.idOrientation = GUID.getId();
    this.idSpecialite = GUID.getId();
    this.idOption = GUID.getId();
    this.donnees = new ObjetElement();
    this.initDonneeVierge();
  }
  initDonneeVierge() {
    this.donnees.orientation = new ObjetElement();
    this.donnees.specialites = new ObjetListeElements();
    this.donnees.options = new ObjetListeElements();
    this.donnees.commentaire = "";
  }
  estEditable() {
    return (
      this.donnees.orientation &&
      (this.donnees.orientation.getLibelle() || this.donnees.commentaire)
    );
  }
  getControleur() {
    return $.extend(
      true,
      super.getControleur(this),
      TUtilitaireOrientation.getControleur(this),
    );
  }
  construireAffichage() {
    let lHtml;
    if (
      this.rubrique &&
      !this.rubrique.estPublie &&
      this.rubrique.dateMsgPublication
    ) {
      lHtml = this.composeMessage();
    } else {
      switch (this.modeSaisie) {
        case EModeAffichage.saisie:
          lHtml = this.composeOrientationSaisie();
          break;
        case EModeAffichage.consultation:
          lHtml = this.composeOrientationConsultation();
          break;
        case EModeAffichage.simplifie:
          lHtml = this.composeOrientationSimplifie();
      }
    }
    return lHtml;
  }
  setDonnees(aParam) {
    if (aParam.voeux) {
      this.donnees = aParam.voeux;
      this.donnees.Genre = aParam.genre;
    }
    this.modeSaisie = aParam.modeSaisie;
    this.maquette = aParam.maquette;
    this.rubrique = aParam.rubrique;
    this.editable = aParam.editable;
    this.message = aParam.message;
    this.setGenre(aParam.genre);
  }
  getHtmlVignette(aGenre, aLibelle, aIndex) {
    const H = [];
    if (aLibelle) {
      H.push(
        '<ie-chips ie-model="chipsOrientation(',
        aGenre,
        ",",
        aIndex,
        ')">',
        aLibelle,
        "</ie-chips>",
      );
    }
    return H.join("");
  }
  composeOrientationSimplifie() {
    let lHtml = [];
    if (
      (this.donnees.orientation &&
        this.donnees.orientation.getLibelle() !== undefined) ||
      this.message !== ""
    ) {
      lHtml.push(
        '<div class="GrandEspaceHaut GrandEspaceBas GrandEspaceGauche">',
      );
      let lTitre = "";
      switch (this.Genre) {
        case TypeRubriqueOrientation.RO_AutreRecommandationConseil:
          lTitre = !!this.message
            ? GTraductions.getValeur(
                "Orientation.Ressources.MsgAvisProvisoireCC",
                [this.message],
              )
            : GTraductions.getValeur(
                "Orientation.Ressources.RecommandationSurVoieNonDemandee",
              );
          break;
        case TypeRubriqueOrientation.RO_AutrePropositionConseil:
          lTitre = !!this.message
            ? GTraductions.getValeur(
                "Orientation.Ressources.MsgPropositionCC",
                [this.message],
              )
            : GTraductions.getValeur(
                "Orientation.Ressources.PropositionSurVoieNonDemandee",
              );
          break;
        case TypeRubriqueOrientation.RO_DecisionRetenue:
          lTitre = GTraductions.getValeur(
            "Orientation.Ressources.DecisionRetenue",
          );
          break;
        default:
      }
      if (lTitre) {
        lHtml.push('<div class="Espace Gras" >', lTitre, "</div>");
      }
      if (!this.message) {
        lHtml.push('<div class="row" style="width:100%;">');
        lHtml.push(
          '  <div class="col s12 m9 Gras" >',
          this.donnees.orientation.getLibelle(),
          "</div>",
        );
        if (this.donnees.orientation.avecStageFamille) {
          lHtml.push(
            '<div class="col s12 Italique GrandEspaceGauche">',
            GTraductions.getValeur(
              "Orientation.Ressources.DemandeStagePasserelle",
            ),
            "</div>",
          );
        }
        if (
          this.donnees.orientation &&
          this.donnees.orientation.avecStageConseil
        ) {
          lHtml.push(
            '<div class="col s12 Italique">',
            GTraductions.getValeur(
              "Orientation.Ressources.StagePasserellePropose",
            ),
            "</div>",
          );
        }
        if (this.donnees.specialites) {
          lHtml.push('  <div class="col s12">', "<ul>");
          this.donnees.specialites.parcourir((element) => {
            lHtml.push(
              '  <li class="GrandEspaceGauche">',
              element.getLibelle(),
              "</li>",
            );
          });
          lHtml.push("  </ul></div>");
        }
        if (this.donnees.options) {
          lHtml.push('  <div class="col s12">');
          lHtml.push(this.donnees.options.getTableauLibelles().join("; "));
          lHtml.push("  </div>");
        }
        lHtml.push("</div>");
        lHtml.push("</div>");
      }
      if (!this.message) {
        lHtml.push('<div class="divider"></div>');
      }
      lHtml.push("</div></div>");
    }
    return lHtml.join("");
  }
  composeOrientationConsultation() {
    const lHtml = [];
    if (!this.estEditable()) {
      return "";
    }
    const lClassRang =
      this.donnees.avis && this.message === ""
        ? " TypeAvis_" + this.donnees.avis.getGenre()
        : "";
    if (this.donnees.rang === 1) {
      lHtml.push('<div class="divider"></div>');
    }
    lHtml.push('<div class="flex-contain EspaceHaut" >');
    lHtml.push(
      '<div class="valign-wrapper Gras" style="min-width:20px; padding-left: 6px"><span class="center-align">',
      this.donnees.rang,
      "</span></div>",
    );
    lHtml.push(
      '<div class="IPO_Divider" style="padding-left: 1px; margin-left: 3px;" ></div>',
    );
    lHtml.push('<div class="row" style="width:100%;">');
    lHtml.push(
      '  <div class="col s7 m9 Gras" >',
      this.donnees.orientation.getLibelle(),
      "</div>",
    );
    if (this.donnees.orientation.avecStageFamille) {
      lHtml.push(
        '<div class="col s12 Italique GrandEspaceGauche">',
        GTraductions.getValeur("Orientation.Ressources.DemandeStagePasserelle"),
        "</div>",
      );
    }
    if (this.donnees.specialites) {
      lHtml.push('  <div class="col s12">', "<ul>");
      this.donnees.specialites.parcourir((element) => {
        lHtml.push(
          '  <li class="GrandEspaceGauche">',
          element.getLibelle(),
          "</li>",
        );
      });
      lHtml.push("  </ul></div>");
    }
    if (this.donnees.options) {
      lHtml.push('  <div class="col s12">');
      lHtml.push(this.donnees.options.getTableauLibelles().join("; "));
      lHtml.push("  </div>");
    }
    if (this.donnees.commentaire) {
      lHtml.push('<div class="col s12">', this.donnees.commentaire, "</div>");
    }
    if (
      this.donnees.avis &&
      this.donnees.avis.getGenre() !== TypeAvisConseil.taco_Aucun
    ) {
      const lTitre =
        this.Genre === TypeRubriqueOrientation.RO_IntentionFamille
          ? GTraductions.getValeur("Orientation.Ressources.AvisProvisoireCC")
          : GTraductions.getValeur("Orientation.Ressources.PropositionCC");
      lHtml.push(
        '<div class="col s12 GrandEspaceHaut">',
        '<div class="col s12 offset-s3"><div class="divider IPO_Bloc50"></div></div>',
        "<div>",
        '<em class="Gras Italique">',
        lTitre,
        " : </em>",
        "</div>",
        "<div>",
        '<span class="Gras Bloc_TypeAvisConseil',
        lClassRang,
        '" style="font-size:11px;">',
        this.donnees.avis.getLibelle(),
        "</span>",
        "</div>",
        "<div>",
        "<span>",
        this.donnees.avis.motivation,
        "</span>",
        "</div>",
        "</div>",
      );
    }
    if (this.Genre === TypeRubriqueOrientation.RO_DecisionRetenue) {
      let lStrCommentaire =
        this.donnees.avis && this.donnees.avis.motivation
          ? `${GTraductions.getValeur("Orientation.Commentaire")} : ${this.donnees.avis.motivation}`
          : "";
      if (
        [EGenreEspace.Mobile_Professeur].includes(
          GEtatUtilisateur.GenreEspace,
        ) &&
        this.donnees.avis.publicationParent
      ) {
        lStrCommentaire += ` (${GTraductions.getValeur("Orientation.PublieSurEspaceParent")})`;
      }
      lHtml.push('<div class="col s12">', lStrCommentaire, "</div>");
    }
    if (this.donnees.orientation && this.donnees.orientation.avecStageConseil) {
      lHtml.push(
        '<div class="col s12 Italique">',
        GTraductions.getValeur("Orientation.Ressources.StagePasserellePropose"),
        "</div>",
      );
    }
    lHtml.push("</div>");
    lHtml.push("</div>");
    lHtml.push('<div class="divider"></div>');
    return lHtml.join("");
  }
  composeOrientationSaisie() {
    const lHtml = [];
    if (this.donnees.rang === 1) {
      lHtml.push('<div class="divider"></div>');
    }
    lHtml.push('<div><div class="flex-contain EspaceHaut" >');
    lHtml.push(
      '<div class="valign-wrapper Gras" style="min-width:20px;"><span class="center-align" ie-html="getRang"></span></div>',
    );
    lHtml.push(
      '<div class="IPO_Divider" style="padding-left: 1px; margin-left: 3px;" ></div>',
    );
    lHtml.push('<div class="row" style="width:100%; margin-left:10px">');
    const lIdOrientation = GUID.getId();
    lHtml.push(
      '<div class="row">',
      '<div for="',
      lIdOrientation,
      '">',
      GTraductions.getValeur("Orientation.Orientation"),
      " :</div>",
      '<div class="IPO_InputMobile AvecPlaceHolder" data-placeholder="',
      GTraductions.getValeur("Orientation.ClicChoixOrientation"),
      '" ie-node="orientation.node" ie-html="orientation.getVignette" id="',
      lIdOrientation,
      '"></div>',
      "</div>",
    );
    lHtml.push(
      '<div class="row" ie-display="stagePasserelle.getDisplay">',
      "<label>",
      '<input type="checkbox" ie-model="stagePasserelle" class="EspaceGauche" /><span>',
      GTraductions.getValeur("Orientation.Ressources.DemandeStagePasserelle"),
      "</span>",
      "</label>",
      "</div>",
    );
    if (this.maquette.nombreSpecialites > 0) {
      lHtml.push(
        '<div ie-display="specialite.getDisplay">',
        "<div>",
        GTraductions.getValeur("Orientation.SpecialitesOrdre"),
        " :</div>",
      );
      let lIdSpecialite = GUID.getId();
      for (let I = 0; I < this.maquette.nombreSpecialites; I++) {
        const lPlaceHolder = GTraductions.getValeur(
          "Orientation.Specialites.ClicChoixSpecialite",
        );
        lIdSpecialite = lIdSpecialite + "_" + I;
        lHtml.push(
          '<div style="display:flex; padding-bottom: 10px;" >',
          '<div style="align-self:end;" class="col s1 right-align">',
          I + 1,
          ".</div>",
          '<div ie-class="specialite.getClassMobile(',
          I,
          ')" class="col s11 IPO_InputMobile" data-placeholder="',
          lPlaceHolder,
          '"ie-node="specialite.node(',
          I,
          ')" ie-html="specialite.getVignette(',
          I,
          ')" id="',
          lIdSpecialite,
          '"></div>',
          "</div>",
        );
      }
      lHtml.push("</div>");
    }
    if (this.maquette.nombreOptions > 0) {
      const lIdOption = GUID.getId();
      lHtml.push(
        '<div class="EspaceHaut row" ie-display="option.getDisplay">',
        '<div class="col s6" for="',
        lIdOption,
        '">',
        GTraductions.getValeur("Orientation.Option"),
        " :</div>",
        '<div class="col s6 right-align" ie-model="option" ie-event="click->surClickItem()"><i class="btnImageIcon icon_plus IPO_AjouterOption"></i><a class="IPO_AjouterOption">',
        GTraductions.getValeur("Orientation.Options.Ajouter"),
        "</a></div>",
        '<div id="',
        this.idOption,
        '" ie-node="option.node" class="IPO_InputMobile AvecPlaceHolder" ie-html="option.getVignette" style="border-bottom:1px solid #bababa;" data-placeholder="',
        GTraductions.getValeur("Orientation.Options.ClicChoixOption"),
        '"></div>',
        "</div>",
      );
    }
    if (this.maquette.avecCommentaireFamille) {
      const lIdCommentaire = GUID.getId();
      lHtml.push(
        '<div class="row"',
        '<div class="input-field col 12">',
        '<div  for="',
        lIdCommentaire,
        '">',
        GTraductions.getValeur("Orientation.Ressources.Commentaire"),
        " :</div>",
        '<ie-textareamax maxlength="255" id="',
        lIdCommentaire,
        '" ie-model="commentaire" ie-autoresize></textarea>',
        "</div>",
        "</div>",
      );
    }
    lHtml.push("</div>");
    lHtml.push('</div><div class="divider"></div>');
    return lHtml.join("");
  }
  composeMessage() {
    const lMessage = GTraductions.getValeur(
      "Orientation.Ressources.MessageSaisieIndisponible",
      [GDate.formatDate(this.rubrique.dateMsgPublication, "%JJ/%MM/%AAAA")],
    );
    return this.composeAucuneDonnee(lMessage);
  }
  actualiser(aActualiserInterface) {
    this.$refreshSelf();
    if (aActualiserInterface) {
      this.surEvent(EGenreEvnt.actualiser, this.donnees.rang);
    }
  }
  surEvent(aEvent, aIndex) {
    const lParam = {
      genreEvent: aEvent,
      orientation: this.donnees.orientation,
      index: aIndex,
    };
    this.callback.appel(this, lParam);
  }
  setEditable(aEditable) {
    this.editable = aEditable;
    this.actualiser(true);
  }
}
module.exports = { ObjetOrientation_Mobile };
