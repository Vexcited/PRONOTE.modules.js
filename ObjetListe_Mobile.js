const _ObjetListe_1 = require("_ObjetListe");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const tag_1 = require("tag");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const jsx_1 = require("jsx");
class ObjetListe_Mobile extends _ObjetListe_1.ObjetListe {
  constructor(...aParams) {
    super(...aParams);
    Object.assign(this.optionsInterne, {
      versionMobile: true,
      getClassListe: () => {
        const lClasses = [];
        if (
          this._options.hauteurAdapteContenu &&
          !document.querySelector(`#${this.Nom.escapeJQ()} .liste_scroll`)
        ) {
          lClasses.push("hauteur-auto");
        }
        return lClasses.join(" ");
      },
      initStructureDynamique: this._initStructureDynamique.bind(this),
    });
    this.ids.zoneFils = this.idZone;
    this.IdPremierElement = this.idZone;
    this.idZoneActua = `${this.Nom}_contenu_int`;
  }
  resetOptions() {
    super.resetOptions();
    Object.assign(this._options, {
      nonEditable: true,
      forcerScrollV_mobile: null,
      avecCelluleEditableTriangle: true,
      avecCocheCheckBox: false,
      paddingCelluleLR: 0,
      paddingCelluleTB: 0,
      estBoutonCreationPiedFlottant_mobile: true,
    });
    return this;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      liste: {
        nodeTdCellule: function (aLigne, aColonne) {
          $(this.node).on({
            mousedown(aEvent) {
              aInstance._surEventDownLigne({
                event: aEvent,
                ligne: aLigne,
                colonne: aColonne,
              });
            },
            click(aEvent) {
              if (aInstance._estEventSansSelect(aEvent)) {
                return;
              }
              aInstance._editionDebSurSelection(aColonne, aLigne, aEvent);
              if (
                aInstance.Donnees &&
                aInstance.Donnees.options.avecCocheCBSurLigne
              ) {
                aInstance._modifierCBLigneFlatDesign(
                  aInstance._getParamsCellule(aColonne, aLigne),
                );
              }
            },
            focus() {
              ObjetHtml_1.GHtml.getElementsFocusablesDElement(this).forEach(
                (aNode) => {
                  aNode.setAttribute("tabindex", "0");
                },
              );
            },
            blur() {
              ObjetHtml_1.GHtml.getElementsFocusablesDElement(this).forEach(
                (aNode) => {
                  aNode.setAttribute("tabindex", "-1");
                },
              );
            },
          });
          ObjetHtml_1.GHtml.getElementsFocusablesDElement(this.node).forEach(
            (aNode) => {
              aNode.setAttribute("tabindex", "-1");
            },
          );
        },
        getClassNodeOmbre() {
          const lNode = $(`#${aInstance.Nom.escapeJQ()} .liste_scroll`).get(0);
          if (lNode && lNode.clientHeight < lNode.scrollHeight) {
            this.node.classList.remove("hide");
          } else {
            this.node.classList.add("hide");
          }
          return "";
        },
        nodeCelluleTotal: function () {
          const lEventMapCelluleTd = { click: aInstance._surClickCelluleTotal };
          const lData = { instance: aInstance };
          $(this.node).on(lEventMapCelluleTd, lData);
        },
        nodeCreation: function () {
          $(this.node).eventValidation(function () {
            aInstance._surBtnCreation(this);
          });
        },
        celluleCoche: {
          getValue: function (aNumeroLigne, aNumeroColonne, aValeur) {
            return (
              aValeur === true ||
              aValeur ===
                ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte
            );
          },
          getIndeterminate: function (aNumeroLigne, aNumeroColonne, aValeur) {
            return (
              aValeur ===
              ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise
            );
          },
          setValue: function () {},
          getDisabled: function (aNumeroLigne, aNumeroColonne) {
            if (aInstance._getNonEditable()) {
              return true;
            }
            const lParamsCellule = aInstance._getParamsCellule(
              aNumeroColonne,
              aNumeroLigne,
            );
            return !aInstance.Donnees.avecEdition(lParamsCellule);
          },
        },
        boutonListePied: {
          attr: function (aIndex) {
            const lBouton = aInstance._cache.boutons[aIndex];
            if (lBouton.getDisabled) {
              return {
                disabled: lBouton.getDisabled({
                  bouton: lBouton,
                  node: this.node,
                  liste: aInstance,
                }),
              };
            }
          },
          node: function (aIndex) {
            const lBouton = aInstance._cache.boutons[aIndex];
            if (lBouton.event) {
              $(this.node).eventValidation(function (aEvent) {
                const lParams = {
                  bouton: lBouton,
                  event: aEvent,
                  liste: aInstance,
                  node: this,
                };
                lBouton.event(lParams);
              });
            }
          },
        },
      },
    });
  }
  _construireAffichage() {
    const lHtmlEntete = this._construireBoutonsEntete();
    const lAvecEntete = !!lHtmlEntete;
    const lHtmlPiedDeListe = this._options.piedDeListe
      ? IE.jsx.str("div", { id: this.idPiedDeListe, class: "liste-pied" })
      : "";
    const lHtmlTotal_fd = this._construireTotalFD(false);
    const lAvecScrollListe =
      this._options.forcerScrollV_mobile === true ||
      (this._options.forcerScrollV_mobile !== false &&
        (lAvecEntete || lHtmlPiedDeListe || lHtmlTotal_fd));
    return IE.jsx.str(
      "div",
      {
        class: ["ObjetListe"],
        "ie-class": "liste.getClassListe",
        id: this.idZone,
      },
      lHtmlEntete,
      lAvecScrollListe || this._options.forcerOmbreScrollTop
        ? IE.jsx.str(
            "div",
            {
              class: "ombre-scroll top",
              "ie-class":
                lAvecEntete || this._options.forcerOmbreScrollTop
                  ? false
                  : "liste.getClassNodeOmbre",
            },
            IE.jsx.str("div", null),
          )
        : "",
      this._construireZoneScroll(lAvecScrollListe),
      lHtmlTotal_fd,
      lHtmlPiedDeListe + this.composeWAICommun(),
    );
  }
  _actualiserZones(aZonesActualisation, aParamsActualiser) {
    this._initCacheLignes(aParamsActualiser);
    $(`#${this.ids.cadreSelection.escapeJQ()}0`).empty();
    ObjetHtml_1.GHtml.setHtml(
      this.idZoneActua,
      this.construireZoneScrollInterne(),
      { controleur: this.controleur, ignorerScroll: true },
    );
  }
  _getTabElementsPourRsizeObserver() {
    return [ObjetHtml_1.GHtml.getElement(this.idZone)];
  }
  _getInfosZonesColonnes(aCache) {
    aCache.infosZonesColonnes = [];
    aCache.avecScrollHorizontal = false;
    aCache.avecScrollHMultiZonePrevu = false;
    if (!this.ListeTailles) {
      return;
    }
    const lInfos = {
      dernierBloc: true,
      indiceColonneDebut: 0,
      indiceColonneFin: this.ListeTailles.length - 1,
      indiceBloc: aCache.infosZonesColonnes.length,
      estBlocFixe: false,
      gabaritColonnesTitre: [],
      colonnesVisibles: [],
      largeurBloc: 0,
    };
    for (
      let lColonne = lInfos.indiceColonneDebut;
      lColonne <= lInfos.indiceColonneFin;
      lColonne++
    ) {
      if (!aCache.tableauColonnesCachees[lColonne]) {
        lInfos.colonnesVisibles.push(lColonne);
      }
    }
    if (lInfos.colonnesVisibles.length > 0) {
      lInfos.indiceColonneDebut = lInfos.colonnesVisibles[0];
      lInfos.indiceColonneFin =
        lInfos.colonnesVisibles[lInfos.colonnesVisibles.length - 1];
      if (aCache.infosZonesColonnes.length > 0) {
        aCache.infosZonesColonnes[
          aCache.infosZonesColonnes.length - 1
        ].dernierBloc = false;
      }
      aCache.infosZonesColonnes.push(lInfos);
    }
  }
  _backupScroll(aParams) {
    if (!aParams.conserverPositionScroll) {
      return { scrollTop: 0 };
    }
    let lGetterScroll = () => {
      return $("#" + this.Nom.escapeJQ() + ">.ObjetListe>div.liste_scroll").get(
        0,
      );
    };
    let lScroll = lGetterScroll();
    if (!lScroll) {
      lScroll = ObjetHtml_1.GHtml.getElement(this.Nom);
      lGetterScroll = null;
    }
    const lScrollTrouve = ObjetHtml_1.GHtml.getParentScrollable(lScroll);
    if (lScrollTrouve) {
      return {
        elementScrollV: lScrollTrouve,
        getterScroll: lScroll === lScrollTrouve ? lGetterScroll : null,
        scrollTop: lScrollTrouve.scrollTop,
      };
    }
    return null;
  }
  _setScroll(aBackupScroll, aSurResizeHeightContenu) {
    if (aBackupScroll && aBackupScroll.elementScrollV) {
      let lElement = aBackupScroll.elementScrollV;
      if (aBackupScroll.getterScroll) {
        lElement = aBackupScroll.getterScroll() || lElement;
      }
      if (lElement) {
        lElement.scrollTop = aBackupScroll.scrollTop;
      }
    }
  }
  _initStructureDynamique() {
    const lCacheRef = this._cache.refresh;
    if (lCacheRef.avecConstructionDynamiqueContenu) {
      let lNbLignesRestantes = this._cache.lignesVisibles.length;
      let lIndiceLigneDebut = 0;
      while (lNbLignesRestantes > 0) {
        const lNbLignes =
          lNbLignesRestantes < lCacheRef.nbLignes
            ? lNbLignesRestantes
            : lCacheRef.nbLignes;
        lCacheRef.structure.push({
          deb: lIndiceLigneDebut,
          fin: lIndiceLigneDebut + lNbLignes - 1,
          nbLignes: lNbLignes,
          height: -1,
        });
        lIndiceLigneDebut += lNbLignes;
        lNbLignesRestantes = Math.max(0, lNbLignesRestantes - lNbLignes);
      }
    }
  }
  _surBtnCreation(aNodeBouton) {
    if (this.avecBoutonCreationDansEntete()) {
      this.surCreationEvenement(-1, { nodeBouton: aNodeBouton });
    } else {
      this.surCreationDeb(false);
    }
  }
  _construireTitre() {
    const H = [];
    if (!this.ListeTitres) {
      return "";
    }
    this.ListeTitres.forEach((aTitre) => {
      aTitre.forEach((aLigne, aIndice) => {
        const lDescripteurTitre = aLigne;
        H.push(
          '<li class="collection-header">',
          lDescripteurTitre.libelleHtml
            ? lDescripteurTitre.libelleHtml
            : lDescripteurTitre.estCoche
              ? IE.jsx.str(
                  "div",
                  {
                    style:
                      "position:relative; left: .4rem; width:16px; overflow:hidden;",
                  },
                  IE.jsx.str("ie-checkbox", {
                    "ie-model": (0, jsx_1.jsxFuncAttr)(
                      "liste.cocheTitreClassique",
                      aIndice,
                    ),
                    "ie-attr": (0, jsx_1.jsxFuncAttr)(
                      "liste.cocheTitreClassique.getAttr",
                      aIndice,
                    ),
                  }),
                )
              : lDescripteurTitre.libelle || "",
          "</li>",
        );
      });
    });
    return H.join("");
  }
  _getClassCouleurCellule(aParamsCellule) {
    const lClassAction =
      (this._options.avecCelluleEditableTriangle &&
      this.Donnees.avecBordureDroite(aParamsCellule)
        ? "with-action"
        : "with-action-simple") + " ie-ripple";
    let lClass = "";
    if (
      !this._getNonEditable() &&
      (this.Donnees.avecEdition(aParamsCellule) ||
        this.Donnees.avecEvenementEdition(aParamsCellule))
    ) {
      lClass = lClassAction;
    }
    const LCouleurCellule = this.Donnees.getCouleurCellule(aParamsCellule);
    if (LCouleurCellule !== null && LCouleurCellule !== undefined) {
      switch (LCouleurCellule) {
        case ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc:
          return lClassAction;
        case ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris:
          return "";
        default:
          return lClass;
      }
    } else {
      return lClass;
    }
  }
  _composeCoche(aParams) {
    const lValeur = this.Donnees._getValeur(aParams);
    if (this._options.avecCocheCheckBox) {
      return [
        '<div class="liste_cellule_cb">',
        "<ie-checkbox",
        ObjetHtml_1.GHtml.composeAttr("ie-model", "liste.celluleCoche", [
          aParams.ligne,
          aParams.colonne,
          lValeur,
        ]),
        "></ie-checkbox>",
        "</div>",
      ].join("");
    }
    if (
      lValeur === true ||
      lValeur === ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte
    ) {
      return '<div class="Image_CocheVerte as-icon" style="width:18px; margin:0 auto;">&nbsp;</div>';
    }
    if (lValeur === ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise) {
      return '<div class="IconCocheGrise" style="width:18px; margin:0 auto;">&nbsp;</div>';
    }
    return "";
  }
  _composeDeploiement(aParamsCellule) {
    return [
      '<i class="',
      this.Donnees._estDeploye(aParamsCellule.ligne)
        ? "icon_fleche_num_bas"
        : "icon_fleche_num",
      '"></i>',
    ].join("");
  }
  _construireCellule(aParamsCellule, aTypeValeur, aId, aTaille) {
    let lContenuAffichage = { valeur: "" };
    let lAvecDeploiementCellule = false;
    switch (aTypeValeur) {
      case ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche:
        lContenuAffichage = { valeur: this._composeCoche(aParamsCellule) };
        break;
      case ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.CocheDeploiement:
        if (this.Donnees.estUnDeploiement(aParamsCellule)) {
          lContenuAffichage.valeur = this._composeDeploiement(aParamsCellule);
        }
        break;
      case ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image:
      case ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Icon:
        lContenuAffichage.valeur = this.composeIconEtImage(
          aParamsCellule,
          aTypeValeur ===
            ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Icon,
        );
        break;
      default:
        lContenuAffichage = this.Donnees._getContenuAffichage(aParamsCellule);
        if (
          this._deploiementSurCellule(aParamsCellule) &&
          this.Donnees.avecImageSurColonneDeploiement(aParamsCellule)
        ) {
          lAvecDeploiementCellule = true;
          const lAvecEvent =
            !this.Donnees.avecEventDeploiementSurCellule(aParamsCellule);
          lContenuAffichage.valeur = [
            "<div ",
            lAvecEvent
              ? ObjetHtml_1.GHtml.composeAttr(
                  "ie-node",
                  "liste.nodeDeploiementLigne",
                  [aParamsCellule.ligne, aParamsCellule.colonne],
                )
              : "",
            ">",
            this._composeDeploiement(aParamsCellule),
            "</div>",
            lContenuAffichage.valeur,
          ].join("");
        }
    }
    const lClassesDIV = [
      "liste_cellule_div",
      "liste_contenu_ligne",
      this.Donnees.getClass(aParamsCellule) || "",
    ];
    if (lAvecDeploiementCellule) {
      lClassesDIV.push("liste_cellule_div_depl");
    }
    let lStyleDIV = "";
    if (!aTaille.estPourcent && !aTaille.valeurRem) {
      lStyleDIV = "width:" + aTaille.px + "px;";
    }
    const lIndentation =
      this.Donnees.getIndentationCellule(aParamsCellule) || 0;
    if (lIndentation > 0) {
      lStyleDIV += "padding-left:" + lIndentation + "px;";
    }
    lStyleDIV += this.Donnees.getStyle(aParamsCellule) || "";
    return [
      '<div id="',
      aId + "_div",
      '" class="',
      lClassesDIV.join(" ").trim(),
      '"',
      lStyleDIV ? ' style="' + lStyleDIV + '"' : "",
      ">",
      lContenuAffichage.valeur,
      "</div>",
    ].join("");
  }
  _construireContenu() {
    const H = [];
    this._cache.positionsCelluleCadreSelection = {};
    const lCacheRef = this._cache.refresh;
    const lIndiceInfosColonne = 0;
    const lInfosColonnes = this._cache.infosZonesColonnes[lIndiceInfosColonne];
    const lNbColonnesVisibles = lInfosColonnes.colonnesVisibles.length;
    const lStyles = [
      tag_1.tag.styleToStr("grid-column", `1/${lNbColonnesVisibles + 1}`),
    ];
    if (lCacheRef.avecConstructionDynamiqueContenu) {
      H.push(
        (0, tag_1.tag)("div", {
          "ie-node": tag_1.tag.funcAttr("liste.nodeGabaritRefresh", [
            true,
            lIndiceInfosColonne,
          ]),
          class: "gabarit-refresh",
          style: lStyles,
        }),
      );
    }
    H.push(this._construireContenuRange(lInfosColonnes, 0));
    if (lCacheRef.avecConstructionDynamiqueContenu) {
      H.push(
        (0, tag_1.tag)("div", {
          "ie-node": tag_1.tag.funcAttr("liste.nodeGabaritRefresh", [
            false,
            lIndiceInfosColonne,
          ]),
          class: "gabarit-refresh",
          style: lStyles,
        }),
      );
    }
    return H.join("");
  }
  _construireContenuRange(aInfosColonnes, aIndiceRange) {
    const H = [];
    const lNbColonnesVisibles = aInfosColonnes.colonnesVisibles.length;
    const lClasseRange = this._cache.refresh.avecConstructionDynamiqueContenu
      ? this._getClassRange(aIndiceRange)
      : "";
    let lRangeLignes;
    if (this._cache.refresh.avecConstructionDynamiqueContenu) {
      lRangeLignes = {
        debut: this._cache.refresh.structure[aIndiceRange].deb,
        fin: this._cache.refresh.structure[aIndiceRange].fin + 1,
      };
    } else {
      lRangeLignes = { debut: 0, fin: this._cache.lignesVisibles.length };
    }
    for (
      let lIndiceLigne = lRangeLignes.debut;
      lIndiceLigne < lRangeLignes.fin;
      lIndiceLigne++
    ) {
      const lNumeroLigne = this._cache.lignesVisibles[lIndiceLigne];
      if (
        (lIndiceLigne > 0 || aIndiceRange > 0) &&
        !this.Donnees.enConstruction_cacheRechercheTexte &&
        lNbColonnesVisibles === 1 &&
        this.Donnees instanceof
          ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign &&
        this.Donnees.avecSeparateurLigneHautFlatdesign &&
        this.Donnees.avecSeparateurLigneHautFlatdesign(
          this._getParamsCellule(-1, lNumeroLigne),
          this._getParamsCellule(-1, lNumeroLigne - 1),
        )
      ) {
        H.push(
          (0, tag_1.tag)("hr", {
            class: ["liste_sepligne", lClasseRange],
            role: "presentation",
          }),
        );
      }
      aInfosColonnes.colonnesVisibles.forEach((aNumeroColonne, aIndex) => {
        const lEstDerniereColonne = aIndex + 1 >= lNbColonnesVisibles;
        const lParamsCellule = this._getParamsCellule(
          aNumeroColonne,
          lNumeroLigne,
        );
        const lTypeValeur = this.Donnees.getTypeValeur(lParamsCellule);
        const lTaille = this._cache.taillesColonne[aNumeroColonne];
        const lClasses = [];
        let lCelluleSelectionnee = false;
        if (
          !this.Donnees.enConstruction_cacheRechercheTexte &&
          this.Donnees._avecSelection(lParamsCellule)
        ) {
          lCelluleSelectionnee = this._etatSelectionCellule({
            ligne: lNumeroLigne,
            colonne: aNumeroColonne,
          });
          lClasses.push("ie-ripple");
        }
        Object.assign(lParamsCellule, {
          k: 0,
          surEdition: false,
          typeValeur: lTypeValeur,
          taille: lTaille.px,
        });
        lClasses.push(
          "collection-item",
          "liste-cellule-focusable",
          "liste_celluleGrid_" + (lIndiceLigne + 1),
          this._getClassCouleurCellule(lParamsCellule) || "",
          lCelluleSelectionnee ? "selected" : "",
          lClasseRange,
        );
        if (
          !lEstDerniereColonne &&
          !this.Donnees.avecBordureDroite(lParamsCellule)
        ) {
          lClasses.push("liste_sansBordureD");
        }
        const lId = this.getIdCellule(aNumeroColonne, lNumeroLigne);
        this._cache.collectionFuncConstructCellule[
          lParamsCellule.ligne + "_" + lParamsCellule.colonne
        ] = this._construireCellule.bind(
          this,
          lParamsCellule,
          lTypeValeur,
          lId,
          lTaille,
        );
        H.push(
          IE.jsx.str(
            "li",
            {
              id: lId,
              "ie-nodeafter": !this.Donnees.enConstruction_cacheRechercheTexte
                ? (0, jsx_1.jsxFuncAttr)("liste.nodeTdCellule", [
                    lNumeroLigne,
                    aNumeroColonne,
                  ])
                : false,
              class: lClasses,
              "ie-class": (0, jsx_1.jsxFuncAttr)("liste.getClassCellulePere", [
                lParamsCellule.ligne,
                lParamsCellule.colonne,
              ]),
            },
            this._cache.collectionFuncConstructCellule[
              lParamsCellule.ligne + "_" + lParamsCellule.colonne
            ](),
          ),
        );
      });
    }
    let lResult = H.join("");
    if (
      this._cache.refresh.avecConstructionDynamiqueContenu &&
      !this.Donnees.enConstruction_cacheRechercheTexte &&
      lRangeLignes.fin > lRangeLignes.debut
    ) {
      lResult = IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("div", {
          class: lClasseRange,
          style: "height:0; grid-column:1/" + (lNbColonnesVisibles + 1) + ";",
          "ie-nodeafter": (0, jsx_1.jsxFuncAttr)("liste.nodeObsRange", [
            true,
            aIndiceRange,
            aInfosColonnes.indiceBloc,
          ]),
        }),
        lResult,
        IE.jsx.str("div", {
          class: lClasseRange,
          style: "height:0; grid-column:1/" + (lNbColonnesVisibles + 1) + ";",
          "ie-nodeafter": (0, jsx_1.jsxFuncAttr)("liste.nodeObsRange", [
            false,
            aIndiceRange,
            aInfosColonnes.indiceBloc,
          ]),
        }),
      );
    }
    return lResult;
  }
  _construireTotal() {
    const lListeTotal = this.Donnees
      ? this.Donnees.getListeLignesTotal()
      : null;
    if (
      !this._options.avecLigneTotal &&
      (!lListeTotal || lListeTotal.count() === 0)
    ) {
      return "";
    }
    const H = [];
    const lLignes =
      (this.Donnees ? this.Donnees.getListeLignesTotal() : null) ||
      new ObjetListeElements_1.ObjetListeElements().addElement(null);
    const lInfosColonnes = this._cache.infosZonesColonnes[0];
    lLignes.parcourir((aArticle, aIndexLigne) => {
      let lFusions = null;
      if (this.Donnees) {
        lFusions = this._getFusionColonnesCellule({
          total: true,
          getParamsCellule: (aNumeroColonne) => {
            return this._getParamsCellule(aNumeroColonne, -1, {
              surTotal: true,
              ligne: aIndexLigne,
              article: aArticle,
            });
          },
          colonnesVisibles: lInfosColonnes.colonnesVisibles,
          indiceColonneDebut: lInfosColonnes.indiceColonneDebut,
          indiceColonneFin: lInfosColonnes.indiceColonneFin,
          dernierBloc: true,
        });
      }
      let lIndiceColonne = 0;
      lInfosColonnes.colonnesVisibles.forEach((aNumeroColonne) => {
        if (
          lFusions &&
          (!lFusions[aNumeroColonne] || !lFusions[aNumeroColonne].nbCol)
        ) {
          return;
        }
        lIndiceColonne += 1;
        const lParams = this._getParamsCellule(aNumeroColonne, -1, {
          surTotal: true,
        });
        if (aArticle) {
          lParams.ligne = aIndexLigne;
          lParams.article = aArticle;
        }
        let lContenu = "";
        let lClassLi = "";
        let lGridColumn = "";
        let lStyle;
        if (this.Donnees) {
          lParams.typeCellule = this.Donnees.getTypeCelluleTotal(lParams);
          const lAvecBordureTotalVisible =
            this.Donnees.avecBordureTotalVisible(lParams);
          if (lFusions[aNumeroColonne] && lFusions[aNumeroColonne].nbCol > 1) {
            lGridColumn =
              "grid-column:" +
              lIndiceColonne +
              " / " +
              (lIndiceColonne + lFusions[aNumeroColonne].nbCol) +
              ";";
          }
          lStyle = lGridColumn + (this.Donnees.getStyleTotal(lParams) || "");
          lClassLi =
            "collection-item liste_ligne_total " +
            (this.Donnees.getClassTotal(lParams) || "");
          if (!lAvecBordureTotalVisible) {
            lClassLi += " liste_sansBordureD";
          }
          lContenu = this.Donnees.getContenuTotal(lParams);
        }
        const lIdCellule = this.getIdCelluleTotal(
          lParams.colonne,
          lParams.ligne,
          false,
        );
        H.push(
          '<li id="',
          lIdCellule,
          '" ie-node="liste.nodeCelluleTotal" class="liste_cellule_total' +
            (lClassLi ? " " + lClassLi : "") +
            '" ',
          lStyle ? ' style="' + lStyle + '"' : "",
          ">",
          '<div class="liste_cellule_div">',
          lContenu,
          "</div>",
          "</li>",
        );
      });
    });
    return H.join("");
  }
  _getStyleGridColumn() {
    const H = [];
    const lNbColonnesVisibles =
      this._cache.infosZonesColonnes[0].colonnesVisibles.length;
    this._cache.infosZonesColonnes[0].colonnesVisibles.forEach(
      (aNumeroColonne, aIndex) => {
        const lTaille = this._cache.taillesColonne[aNumeroColonne];
        let lStyle = "";
        if (lTaille.estPourcent) {
          lStyle = "minmax(1rem, " + lTaille.pourcent / 100 + "fr)";
        } else {
          const lEstDerniereColonne = aIndex + 1 >= lNbColonnesVisibles;
          lStyle = lTaille.px + 8 + (lEstDerniereColonne ? 0 : 1) + "px";
        }
        H.push(lStyle);
      },
    );
    return H.length > 0 ? "grid-template-columns:" + H.join(" ") + ";" : "";
  }
  _contruireBouton(aIcon, aLibelle, aAttrs) {
    return [
      '<button class="btn-float ie-ripple ie-ripple-claire"',
      aAttrs,
      aLibelle
        ? ' ie-hint="' + aLibelle + '" aria-label="' + aLibelle + '"'
        : "",
      ">",
      '<i class="',
      aIcon,
      '"></i>',
      "</button>",
    ].join("");
  }
  _construireBoutons() {
    const H = [];
    const lHtmlBoutons = [];
    const lAvecCreation =
      this._options.estBoutonCreationPiedFlottant_mobile &&
      this._avecLigneCreationTitre();
    this._getTabBoutonsEnteteOuPiedFD(false).forEach((aInfoBouton) => {
      const lBouton = aInfoBouton.bouton;
      if (!(lBouton.masquerBouton && lBouton.masquerBouton())) {
        lHtmlBoutons.push(
          this._contruireBouton(
            lBouton.class,
            lBouton.title,
            ObjetHtml_1.GHtml.composeAttr(
              "ie-attr",
              "liste.boutonListePied.attr",
              aInfoBouton.index,
            ) +
              ObjetHtml_1.GHtml.composeAttr(
                "ie-node",
                "liste.boutonListePied.node",
                aInfoBouton.index,
              ),
          ),
        );
      }
    });
    if (lAvecCreation) {
      const lParams = this._getParamsCellule(-1, -1, { surCreation: true });
      const lAvecInputFile = this.Donnees.avecSelecFile(lParams);
      const lAttr = lAvecInputFile
        ? ObjetHtml_1.GHtml.composeAttr(
            "ie-model",
            "liste.modeleSelecFileCellule",
            [-1, -1, true],
          ) + " ie-selecfile "
        : ObjetHtml_1.GHtml.composeAttr("ie-node", "liste.nodeCreation");
      const H = this._contruireBouton(
        this._options.iconeTitreCreation || "icon_plus_fin",
        this._options.titreCreation,
        lAttr,
      );
      if (this._options.skin === _ObjetListe_1.ObjetListe.skin.flatDesign) {
        lHtmlBoutons.push(H);
      } else {
        lHtmlBoutons.splice(0, 0, H);
      }
    }
    if (lHtmlBoutons.length > 0) {
      H.push(
        (0, tag_1.tag)("div", { class: "liste_separateur_boutons" }),
        (0, tag_1.tag)(
          "section",
          { class: "liste_boutons" },
          lHtmlBoutons.join(""),
        ),
      );
    }
    return H.join("");
  }
  _construireZoneScroll(aAvecScrollListe) {
    let lResult =
      (0, tag_1.tag)("div", {
        id: this.ids.cadreSelection + "0",
        class: "liste_conteneurCadreSelection",
      }) +
      this._construireFiltres() +
      (0, tag_1.tag)(
        "ul",
        {
          id: this.idZoneActua,
          class: "collection with-header",
          style: this._getStyleGridColumn(),
        },
        this.construireZoneScrollInterne(),
      ) +
      this._construireBoutons();
    if (aAvecScrollListe) {
      lResult = (0, tag_1.tag)("div", { class: "liste_scroll" }, lResult);
    }
    if (this._options.forcerOmbreScrollBottom || aAvecScrollListe) {
      lResult += (0, tag_1.tag)(
        "div",
        {
          class: "ombre-scroll bottom",
          "ie-class": this._options.forcerOmbreScrollBottom
            ? false
            : "liste.getClassNodeOmbre",
        },
        (0, tag_1.tag)("div"),
      );
    }
    return lResult;
  }
  construireZoneScrollInterne() {
    return (
      this._construireTitre() +
      this._construireContenu() +
      this._construireTotal() +
      (this._cache.lignesVisibles.length === 0 &&
      this._options.messageContenuVide
        ? (0, tag_1.tag)(
            "li",
            { class: "liste_messageVide" },
            this._options.messageContenuVide,
            (0, tag_1.tag)("div", {
              class: "m-top-xl Image_No_Data",
              "aria-hidden": "true",
            }),
          )
        : "")
    );
  }
}
module.exports = ObjetListe_Mobile;
