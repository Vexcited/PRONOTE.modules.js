exports.ObjetListeArborescente = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetTraduction_1 = require("ObjetTraduction");
const AltImagePlus = ". Noeud fermé. ";
const AltImageMoins = ". Noeud ouvert. ";
class ObjetListeArborescente extends ObjetIdentite_1.Identite {
  constructor(...aParams) {
    super(...aParams);
    this.noeudsOuverts = true;
    this.avecValidation = false;
    this.idPremierObjet = this.Nom + "_idPremierObjet";
  }
  getClassTexte() {
    return "Texte14";
  }
  getLineHeightTexte() {
    return "line-height:18px;";
  }
  construireAffichage(aHeight) {
    const H = [];
    H.push(
      '<div id="' +
        this.Nom +
        '" class="' +
        this.getClassTexte() +
        ' ObjetListeArborescente" style="' +
        this.getLineHeightTexte() +
        "height:" +
        (aHeight ? aHeight + "px" : "100%") +
        ';overflow:auto;"></div>',
    );
    return H.join("");
  }
  setDonnees(aNoeudListe) {
    let lNoeudListe = null;
    ObjetHtml_1.GHtml.setTabIndex(this.Nom, -1);
    if (arguments.length > 1) {
      lNoeudListe = Array.prototype.shift.call(arguments);
      for (const x in arguments) {
        if (x !== "length") {
          this._ajouterDesFreresAuNoeud(arguments[x], lNoeudListe);
        }
      }
    } else {
      lNoeudListe = aNoeudListe;
    }
    if (lNoeudListe) {
      const DivRacine = ObjetHtml_1.GHtml.getElement(this.Nom);
      this._ajouterUnFilsAuNoeud(lNoeudListe, DivRacine);
      $("#" + this.Nom.escapeJQ())
        .find("li")
        .filter(function () {
          return $(this).attr("aria-expanded") === "false";
        })
        .each(function () {
          const myChild = $(this).children("ul");
          $(this).data("myChild", myChild.get(0));
          myChild.detach();
        });
      $("#" + this.Nom.escapeJQ())
        .find("li:first")
        .attr("id", this.idPremierObjet)
        .attr("tabindex", "0");
      this.ajouterEvenements();
    }
  }
  setFocus() {
    $("#" + this.Nom.escapeJQ())
      .find("li:first")
      .focus();
  }
  ajouterEvenements() {
    $("#" + this.Nom.escapeJQ())
      .on("focus", "li", { aObjet: this }, this.focusSurLi)
      .on("blur", "li", { aObjet: this }, this.blurSurLi)
      .on("click", "li[aria-expanded]", { aObjet: this }, this.ouvrirFermerLi)
      .on("keyup", "li", { aObjet: this }, this.seDeplacer);
  }
  setParametres(aOuvert, aAvecValidation) {
    this.noeudsOuverts =
      aOuvert !== null && aOuvert !== undefined ? aOuvert : true;
    this.avecValidation = aAvecValidation;
  }
  getListeArborescente() {
    const lDomNode = $("#" + this.Nom.escapeJQ()).clone();
    this.ajouterEvenements();
    lDomNode.attr("id", "").css({ height: "", overflow: "" });
    return lDomNode.get(0);
  }
  setTitreImpression(ATitre) {
    this.TitreImpression = ATitre;
  }
  getTitreImpression() {
    return this.TitreImpression;
  }
  construireRacine() {
    const lJqRacine = $("<ul></ul>");
    lJqRacine.attr({ role: "tree", "aria-multiselectable": "false" });
    return lJqRacine.get(0);
  }
  _construireNoeud(AId, ALibelle, AClass, ADeroule, APremierElement, ALevel) {
    const LClass = AClass ? AClass : "" + this.getClassTexte();
    const LClassWai = "sr-only";
    const lJqNoeud = $("<li></li>");
    lJqNoeud
      .attr({
        tabindex: "-1",
        role: "treeitem",
        "aria-selected": "false",
        "aria-checked": "false",
        "aria-level": ALevel ? ALevel : "",
        "aria-expanded":
          ADeroule !== null && ADeroule !== undefined
            ? ADeroule
              ? "true"
              : "false"
            : this.noeudsOuverts
              ? "true"
              : "false",
        class: this.getClassTexte() + " AvecMain",
      })
      .data({ avecValidation: this.avecValidation, callback: this.callback });
    const lJqImg = $("<span>&nbsp;</span>");
    lJqImg.attr({
      role: "presentation",
      class:
        (ADeroule !== null && ADeroule !== undefined
          ? ADeroule
            ? "Image_FermetureDeploiement"
            : "Image_Deploiement"
          : this.noeudsOuverts
            ? "Image_FermetureDeploiement"
            : "Image_Deploiement") + " InlineBlock",
      alt: "",
      title: ObjetTraduction_1.GTraductions.getValeur("liste.ClicListeArbo"),
    });
    const lJqSpan = $("<span></span>");
    lJqSpan.addClass(LClass).html(ALibelle.ucfirst());
    const lJqSpanWai = $("<span></span>");
    lJqSpanWai
      .addClass(LClassWai)
      .html(
        ADeroule !== null && ADeroule !== undefined
          ? ADeroule
            ? AltImageMoins
            : AltImagePlus
          : this.noeudsOuverts
            ? AltImageMoins
            : AltImagePlus,
      );
    lJqNoeud.append(lJqImg, lJqSpan, lJqSpanWai);
    const LNoeud = lJqNoeud.get(0);
    return LNoeud;
  }
  _construireNoeudGroupe(AId, ADeroule) {
    const lJqNoeud = $("<ul></ul>");
    lJqNoeud.attr({
      role: "tree",
      "aria-setsize": "0",
      style:
        "display:" +
        (ADeroule !== null && ADeroule !== undefined
          ? ADeroule
            ? "block"
            : "none"
          : this.noeudsOuverts
            ? "block"
            : "none") +
        ";visibility:" +
        (ADeroule !== null && ADeroule !== undefined
          ? ADeroule
            ? "visible"
            : "hidden"
          : this.noeudsOuverts
            ? "visible"
            : "hidden") +
        ";",
      class: this.getClassTexte() + " SansMain",
    });
    return $(lJqNoeud).get(0);
  }
  construireFeuille(AId, ALibelle, AClass, ALevel) {
    const LClass = AClass ? AClass : this.getClassTexte() + " SansMain";
    const lJqFeuille = $("<li></li>");
    lJqFeuille
      .attr({
        tabindex: "-1",
        role: "treeitem",
        "aria-selected": "false",
        "aria-checked": "false",
        "aria-level": ALevel,
        class: LClass,
      })
      .html(ALibelle.ucfirst() + '<span class="sr-only">.</span>')
      .data({ isFeuille: true });
    const LFeuille = lJqFeuille.get(0);
    return LFeuille;
  }
  focusSurLi() {
    $(this).attr({ "aria-selected": "true", "aria-checked": "true" });
  }
  blurSurLi() {
    $(this).attr({ "aria-selected": "false", "aria-checked": "false" });
  }
  ouvrirFermerLi(event) {
    event.stopImmediatePropagation();
    if ($(this).attr("aria-expanded") === "true") {
      $(this)
        .children("span:first-child")
        .removeClass("Image_FermetureDeploiement")
        .addClass("Image_Deploiement")
        .end()
        .children("span.sr-only")
        .html(AltImagePlus)
        .end()
        .children("ul")
        .css({ display: "none", visibility: "hidden" })
        .end()
        .attr("aria-expanded", "false");
      const myChild = $(this).children("ul");
      $(this).data("myChild", myChild.get(0));
      myChild.detach();
      $(this).blur().focus();
    } else {
      $(this).append($(this).data("myChild"));
      $(this).data("myChild", undefined);
      $(this)
        .children("span:first-child")
        .removeClass("Image_Deploiement")
        .addClass("Image_FermetureDeploiement")
        .end()
        .children("span.sr-only")
        .html(AltImageMoins)
        .end()
        .children("ul")
        .css({ display: "block", visibility: "visible" })
        .end()
        .attr("aria-expanded", "true");
      $(this).blur().focus();
    }
    if ($(this).parent().attr("role") !== "tree") {
      $(this).parent().focus();
    }
  }
  seDeplacer(event) {
    event.stopImmediatePropagation();
    if (GNavigateur.isToucheFlecheGauche()) {
      if ($(this).attr("aria-expanded") === "true") {
        $(this).click();
      } else {
        $(this).parent("ul").parent("li").focus();
      }
    } else if (GNavigateur.isToucheFlecheDroite()) {
      if ($(this).attr("aria-expanded")) {
        if ($(this).attr("aria-expanded") === "false") {
          $(this).click();
        } else {
          $(this).children("ul").children("li:first-child").focus();
        }
      }
    } else if (GNavigateur.isToucheFlecheBas()) {
      if (
        $(this).attr("aria-expanded") === "true" &&
        $(this).children("ul").children("li:first-child").length > 0
      ) {
        $(this).children("ul").children("li:first-child").focus();
      } else if ($(this).next().length === 1) {
        $(this).next().focus();
      } else {
        _focusProchainNoeud($(this));
      }
    } else if (GNavigateur.isToucheFlecheHaut()) {
      if (
        $(this).prev().attr("aria-expanded") === "true" &&
        $(this).prev().children("ul").children("li:last-child").length > 0
      ) {
        $(this).prev().children("ul").children("li:last-child").focus();
      } else if ($(this).prev().length === 1) {
        $(this).prev().focus();
      } else {
        $(this).parent("ul").parent("li").focus();
      }
    } else if (GNavigateur.isToucheSelection()) {
      if ($(this).attr("aria-expanded")) {
        $(this).click();
      }
    }
  }
  _ajouterUnFilsAuNoeud(AFils, ANoeud) {
    $(ANoeud).append(AFils);
  }
  _ajouterDesFreresAuNoeud(aGroupeFrere, aNoeud) {
    $(aGroupeFrere)
      .children()
      .each(function () {
        $(aNoeud).append(this);
      });
  }
  ajouterUneFeuilleAuNoeud(ANoeud, AId, ALibelle, AClass) {
    const LLevel = this._getLevelParent(ANoeud) + 1;
    const LSize = this._getSizeParent(ANoeud) + 1 + "";
    const LFeuille = this.construireFeuille(
      AId,
      ALibelle ? ALibelle : "",
      AClass,
      LLevel,
    );
    this._ajouterUnFilsAuNoeud(LFeuille, ANoeud);
    if (ANoeud.getAttribute("role") === "tree") {
      ANoeud.setAttribute("aria-setsize", LSize);
      for (let I = 0; I < ANoeud.childNodes.length; I++) {
        const lNode = ANoeud.childNodes[I];
        if (lNode.getAttribute("role") === "treeitem") {
          lNode.setAttribute("aria-setsize", LSize);
        }
      }
    }
    return LFeuille;
  }
  ajouterUnNoeudAuNoeud(
    aNoeud,
    aId,
    aLibelle,
    aClass,
    aDeroule,
    aPremierElement,
  ) {
    const lLevel = this._getLevelParent(aNoeud) + 1;
    const lSize = this._getSizeParent(aNoeud) + 1 + "";
    const lNoeudFils = this._construireNoeud(
      aId,
      aLibelle ? aLibelle : "",
      aClass,
      aDeroule,
      aPremierElement,
      lLevel,
    );
    const lGroupeNoeudFils = this._construireNoeudGroupe(
      aId + "_groupe",
      aDeroule,
    );
    this._ajouterUnFilsAuNoeud(lNoeudFils, aNoeud);
    this._ajouterUnFilsAuNoeud(lGroupeNoeudFils, lNoeudFils);
    if (aNoeud.getAttribute("role") === "treegroup") {
      aNoeud.setAttribute("aria-setsize", lSize);
      for (let I = 0; I < aNoeud.childNodes.length; I++) {
        const lNode = aNoeud.childNodes[I];
        if (lNode.getAttribute("role") === "treeitem") {
          lNode.setAttribute("aria-setsize", lSize);
        }
      }
    }
    return lGroupeNoeudFils;
  }
  construireUnNoeudPourNoeud(
    aNoeud,
    aId,
    aLibelle,
    aClass,
    aDeroule,
    aPremierElement,
  ) {
    const lLevel = this._getLevelParent(aNoeud) + 1;
    const lNoeudFils = this._construireNoeud(
      aId,
      aLibelle ? aLibelle : "",
      aClass,
      aDeroule,
      aPremierElement,
      lLevel,
    );
    const lGroupeNoeudFils = this._construireNoeudGroupe(
      aId + "_groupe",
      aDeroule,
    );
    this._ajouterUnFilsAuNoeud(lGroupeNoeudFils, lNoeudFils);
    return { noeud: lNoeudFils, container: lGroupeNoeudFils };
  }
  ajouterArbreNoeudAuNoeud(aNoeud, aNoeudFils) {
    const lSize = this._getSizeParent(aNoeud) + 1 + "";
    this._ajouterUnFilsAuNoeud(aNoeudFils, aNoeud);
    if (aNoeud.getAttribute("role") === "tree") {
      aNoeud.setAttribute("aria-setsize", lSize);
      for (let I = 0; I < aNoeud.childNodes.length; I++) {
        if (aNoeud.childNodes[I].getAttribute("role") === "treeitem") {
          aNoeud.childNodes[I].setAttribute("aria-setsize", lSize);
        }
      }
    }
  }
  _getLevelParent(AElement) {
    return AElement.getAttribute("role") === "tree" &&
      AElement.previousSibling &&
      AElement.previousSibling.getAttribute("aria-level")
      ? parseInt(AElement.previousSibling.getAttribute("aria-level"))
      : 0;
  }
  _getSizeParent(AElement) {
    return AElement.getAttribute("role") === "tree" &&
      AElement.getAttribute("aria-setsize")
      ? parseInt(AElement.getAttribute("aria-setsize"))
      : 0;
  }
}
exports.ObjetListeArborescente = ObjetListeArborescente;
function _focusProchainNoeud(aNoeud) {
  const lParentLI = aNoeud.parent("ul").parent("li");
  if (lParentLI.length > 0) {
    const lFrereParentLI = lParentLI.next();
    if (lFrereParentLI.length > 0) {
      lFrereParentLI.focus();
    } else {
      _focusProchainNoeud(lParentLI);
    }
  }
}
