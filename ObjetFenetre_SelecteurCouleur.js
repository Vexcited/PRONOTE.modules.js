exports.ObjetFenetre_SelecteurCouleur = void 0;
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
const const_tailleImageCouleur = 150;
const lTabCouleurs = [
  "#000000",
  "#400000",
  "#800000",
  "#804040",
  "#FF0000",
  "#FF8080",
  "#808000",
  "#804000",
  "#FF8000",
  "#FF8040",
  "#FFFF00",
  "#FFFF80",
  "#808040",
  "#004000",
  "#008000",
  "#00FF00",
  "#80FF00",
  "#80FF80",
  "#808080",
  "#004040",
  "#008040",
  "#008080",
  "#00FF40",
  "#00FF80",
  "#408080",
  "#000080",
  "#0000FF",
  "#004080",
  "#00FFFF",
  "#80FFFF",
  "#C0C0C0",
  "#000040",
  "#0000A0",
  "#8080FF",
  "#0080C0",
  "#0080FF",
  "#400040",
  "#80424F",
  "#800080",
  "#800040",
  "#8080C0",
  "#FF80C0",
  "#FFFFFF",
  "#400080",
  "#8000FF",
  "#FF0080",
  "#FF00FF",
  "#FF80FF",
];
var GenreCouleur;
(function (GenreCouleur) {
  GenreCouleur[(GenreCouleur["RGB_R"] = 0)] = "RGB_R";
  GenreCouleur[(GenreCouleur["RGB_G"] = 1)] = "RGB_G";
  GenreCouleur[(GenreCouleur["RGB_B"] = 2)] = "RGB_B";
  GenreCouleur[(GenreCouleur["HSL_H"] = 3)] = "HSL_H";
  GenreCouleur[(GenreCouleur["HSL_S"] = 4)] = "HSL_S";
  GenreCouleur[(GenreCouleur["HSL_L"] = 5)] = "HSL_L";
})(GenreCouleur || (GenreCouleur = {}));
class ObjetFenetre_SelecteurCouleur extends ObjetFenetre_1.ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.idZoneC = this.IdContenu + "_zoneC";
    this.idCouleurPredef = this.IdContenu + "_CPreDef_";
    this.parametres = {
      marges: 15,
      largeurPickColor: 20,
      hauteurPickColor: 20,
      tailleCouleurSelectionne: { width: 70, height: 70 },
      largeurLibelleEdit: 18,
      hauteurConteneurEditCouleur: 25,
      largeurEditCouleurEtLibelle: 60,
      tailleInputCouleur: { width: 30, height: 18 },
    };
    this.setOptionsFenetre({
      titre: ObjetTraduction_1.GTraductions.getValeur(
        "Fenetre_SelecteurCouleur.Titre",
      ),
      listeBoutons: [
        ObjetTraduction_1.GTraductions.getValeur("Annuler"),
        ObjetTraduction_1.GTraductions.getValeur("Valider"),
      ],
      avecTailleSelonContenu: true,
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getNodeColor(aIndice) {
        $(this.node).eventValidation(() => {
          aInstance._actualiser({ couleur: lTabCouleurs[aIndice] });
        });
      },
      getNodeColorPicker() {
        $(this.node).on("pointerdown", function (aEvent) {
          const lData = {
            instance: aInstance,
            positionRef: ObjetPosition_1.GPosition.getClientRect(this),
          };
          const lHSL = aInstance._getHSLSelonEvent(lData, aEvent);
          aInstance._actualiser({ HSL: lHSL });
        });
      },
      dragColorPicker() {
        return {
          containment: this.node,
          drag(aParamsDrag, aEvent) {
            const lData = {
              instance: aInstance,
              positionRef: aParamsDrag.rectContrainte,
            };
            const lHSL = aInstance._getHSLSelonEvent(lData, aEvent);
            aInstance._actualiser({ HSL: lHSL });
          },
        };
      },
      getNodeSlider() {
        $(this.node).on("pointerdown", function (aEvent) {
          const lData = {
            instance: aInstance,
            positionRef: ObjetPosition_1.GPosition.getClientRect(this),
            pourSlider: true,
          };
          const lHSL = aInstance._getHSLSelonEvent(lData, aEvent);
          aInstance._actualiser({ HSL: lHSL });
        });
      },
      dragSlider() {
        return {
          containment: this.node,
          drag(aParamsDrag, aEvent) {
            const lData = {
              instance: aInstance,
              positionRef: aParamsDrag.rectContrainte,
              pourSlider: true,
            };
            const lHSL = aInstance._getHSLSelonEvent(lData, aEvent);
            aInstance._actualiser({ HSL: lHSL });
          },
        };
      },
    });
  }
  setDonnees(aCouleur) {
    this.afficher();
    ObjetPosition_1.GPosition.centrer(this.Nom);
    this._actualiser({ couleur: aCouleur });
    this._ajouterEvents();
  }
  surValidation(aGenreBouton) {
    this.fermer();
    this.callback.appel(aGenreBouton, this.couleur.couleur);
  }
  composeContenu() {
    const T = [];
    T.push('<div class="conteneur">');
    T.push('<div class="FSC_ConteneurPickColor">');
    for (let i = 0; i < lTabCouleurs.length; i++) {
      T.push(
        '<div id="',
        this.idCouleurPredef + i,
        '" class="FSC_PickColor AvecMain" ie-node="getNodeColor(' +
          i +
          ')" tabindex="0" style="' +
          ObjetStyle_1.GStyle.composeCouleurFond(lTabCouleurs[i]) +
          '"></div>',
      );
    }
    T.push("</div>");
    T.push('<div class="conteneur_droit">');
    T.push(this._composeZoneChoix());
    T.push(
      '<div class="FSC_CouleurSelection" style="margin-left:' +
        this.parametres.marges +
        "px;",
      "margin-top:",
      this.parametres.marges,
      "px;",
      ObjetStyle_1.GStyle.composeWidth(
        this.parametres.tailleCouleurSelectionne.width,
      ),
      ObjetStyle_1.GStyle.composeHeight(
        this.parametres.tailleCouleurSelectionne.height,
      ),
      '">',
      "</div>",
    );
    T.push(
      '<div style="position:absolute; left:' +
        (2 * this.parametres.marges +
          this.parametres.tailleCouleurSelectionne.width) +
        "px;",
      "top:",
      const_tailleImageCouleur + this.parametres.marges,
      "px;",
      '">',
    );
    T.push(this._composeBlocSaisieCouleur());
    T.push("</div>");
    T.push("</div>");
    T.push("</div>");
    return T.join("");
  }
  _actualiser(aCouleurObjet) {
    if (aCouleurObjet.couleur) {
      this.couleur = {
        couleur: aCouleurObjet.couleur,
        RGB: GCouleur.couleurToRGB(aCouleurObjet.couleur),
        HSL: GCouleur.couleurToHSV(aCouleurObjet.couleur),
      };
    } else if (aCouleurObjet.RGB) {
      this.couleur = {
        couleur: GCouleur.rgbToCouleur(aCouleurObjet.RGB),
        RGB: aCouleurObjet.RGB,
        HSL: GCouleur.rgbToHSV(aCouleurObjet.RGB),
      };
    } else if (aCouleurObjet.HSL) {
      this.couleur = {
        couleur: GCouleur.hsvToCouleur(aCouleurObjet.HSL),
        RGB: GCouleur.hsvToRGB(aCouleurObjet.HSL),
        HSL: aCouleurObjet.HSL,
      };
    } else {
      return;
    }
    ObjetHtml_1.GHtml.setValue(
      this._getIdEditCouleur(GenreCouleur.RGB_R),
      Math.round(this.couleur.RGB.r),
    );
    ObjetHtml_1.GHtml.setValue(
      this._getIdEditCouleur(GenreCouleur.RGB_G),
      Math.round(this.couleur.RGB.g),
    );
    ObjetHtml_1.GHtml.setValue(
      this._getIdEditCouleur(GenreCouleur.RGB_B),
      Math.round(this.couleur.RGB.b),
    );
    ObjetHtml_1.GHtml.setValue(
      this._getIdEditCouleur(GenreCouleur.HSL_H),
      Math.round(this.couleur.HSL.h),
    );
    ObjetHtml_1.GHtml.setValue(
      this._getIdEditCouleur(GenreCouleur.HSL_S),
      Math.round(this.couleur.HSL.s),
    );
    ObjetHtml_1.GHtml.setValue(
      this._getIdEditCouleur(GenreCouleur.HSL_L),
      Math.round(this.couleur.HSL.l),
    );
    const lHSLCarreCouleur = { h: this.couleur.HSL.h, s: 100, l: 100 };
    $(".Image_ColorPicker").css(
      "background-color",
      GCouleur.hsvToCouleur(lHSLCarreCouleur),
    );
    const lPosition = {
      left: Math.floor(
        Math.max(
          0,
          Math.min(
            const_tailleImageCouleur,
            (this.couleur.HSL.s * const_tailleImageCouleur) / 100,
          ),
        ),
      ),
      top: Math.floor(
        const_tailleImageCouleur -
          Math.max(
            0,
            Math.min(
              const_tailleImageCouleur,
              (this.couleur.HSL.l * const_tailleImageCouleur) / 100,
            ),
          ),
      ),
    };
    $(".Image_CouleurSelection").css({
      left: lPosition.left + "px",
      top: lPosition.top + "px",
    });
    const lTop = Math.floor(
      const_tailleImageCouleur -
        Math.max(
          0,
          Math.min(
            const_tailleImageCouleur,
            (this.couleur.HSL.h * const_tailleImageCouleur) / 360,
          ),
        ),
    );
    $(".Image_CouleurIndicateur").css("top", lTop + "px");
    $(".FSC_CouleurSelection").css("background-color", this.couleur.couleur);
  }
  _composeZoneChoix() {
    const T = [];
    T.push('<div class="FSC_ZoneChoix">');
    T.push('<div style="margin-left:' + this.parametres.marges + 'px;">');
    T.push(
      '<div class="Image_ColorPicker AvecMain" ie-node="getNodeColorPicker" ie-draggable="dragColorPicker">',
    );
    T.push(
      '<div class="Image_CouleurSelection" style="position:absolute"></div>',
    );
    T.push("</div>");
    T.push("</div>");
    T.push(
      '<div class="FondBlanc" style="margin:0 ' +
        this.parametres.marges +
        'px;">',
    );
    T.push(
      '<div class="Image_SliderCouleur AvecMain" ie-node="getNodeSlider" ie-draggable="dragSlider">',
    );
    T.push(
      '<div class="Image_CouleurIndicateur" style="position:absolute;left:-9px; margin-top:-4px;"></div>',
    );
    T.push("</div>");
    T.push("</div>");
    T.push("</div>");
    return T.join("");
  }
  _composeBlocSaisieCouleur() {
    const T = [];
    const lStyleDefault =
      "position:absolute;" +
      ObjetStyle_1.GStyle.composeWidth(
        this.parametres.largeurEditCouleurEtLibelle,
      );
    T.push('<div style="', lStyleDefault, '">');
    T.push(this._composeSaisieCouleur(GenreCouleur.RGB_R));
    T.push("</div>");
    T.push(
      '<div style="',
      lStyleDefault,
      "top:",
      this.parametres.hauteurConteneurEditCouleur,
      'px">',
    );
    T.push(this._composeSaisieCouleur(GenreCouleur.RGB_G));
    T.push("</div>");
    T.push(
      '<div style="',
      lStyleDefault,
      "top:",
      this.parametres.hauteurConteneurEditCouleur * 2,
      'px">',
    );
    T.push(this._composeSaisieCouleur(GenreCouleur.RGB_B));
    T.push("</div>");
    T.push(
      '<div style="',
      lStyleDefault,
      "left:",
      this.parametres.largeurEditCouleurEtLibelle,
      'px;">',
    );
    T.push(this._composeSaisieCouleur(GenreCouleur.HSL_H));
    T.push("</div>");
    T.push(
      '<div style="',
      lStyleDefault,
      "left:",
      this.parametres.largeurEditCouleurEtLibelle,
      "px; top:",
      this.parametres.hauteurConteneurEditCouleur,
      'px">',
    );
    T.push(this._composeSaisieCouleur(GenreCouleur.HSL_S));
    T.push("</div>");
    T.push(
      '<div style="',
      lStyleDefault,
      "left:",
      this.parametres.largeurEditCouleurEtLibelle,
      "px; top:",
      this.parametres.hauteurConteneurEditCouleur * 2,
      'px">',
    );
    T.push(this._composeSaisieCouleur(GenreCouleur.HSL_L));
    T.push("</div>");
    return T.join("");
  }
  _getIdEditCouleur(aGenre) {
    return this.Nom + "_editC_" + aGenre;
  }
  _composeSaisieCouleur(aGenreCouleur) {
    const T = [];
    let lLibelle;
    switch (aGenreCouleur) {
      case GenreCouleur.RGB_R:
        lLibelle = "R";
        break;
      case GenreCouleur.RGB_G:
        lLibelle = "G";
        break;
      case GenreCouleur.RGB_B:
        lLibelle = "B";
        break;
      case GenreCouleur.HSL_H:
        lLibelle = "H";
        break;
      case GenreCouleur.HSL_S:
        lLibelle = "S";
        break;
      case GenreCouleur.HSL_L:
        lLibelle = "L";
        break;
    }
    T.push(
      '<div class="InlineBlock" style="',
      ObjetStyle_1.GStyle.composeWidth(this.parametres.largeurLibelleEdit),
      "padding-top:",
      2,
      'px;">',
      lLibelle + " :",
      "</div>",
    );
    T.push('<div class="InlineBlock">');
    const lStyle =
      ObjetStyle_1.GStyle.composeHeight(
        this.parametres.tailleInputCouleur.height,
      ) +
      ObjetStyle_1.GStyle.composeWidth(
        this.parametres.tailleInputCouleur.width,
      );
    T.push(
      '<input id="',
      this._getIdEditCouleur(aGenreCouleur),
      '" class="round-style AlignementDroit" type="text" ',
      'style="',
      lStyle,
      '" ',
      'maxlength="3" ',
      "/>",
    );
    T.push("</div>");
    return T.join("");
  }
  _ajouterEvents() {
    let lData, lEventMap;
    lEventMap = {
      change: this._onEditCouleur,
      keyup: this._onEditCouleur,
      focusout: this._onSortieCouleur,
    };
    for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(GenreCouleur)) {
      lData = { instance: this, genre: GenreCouleur[lKey] };
      $("#" + this._getIdEditCouleur(lData.genre).escapeJQ()).on(
        lEventMap,
        lData,
      );
    }
  }
  _onEditCouleur(event) {
    const lGenreEdit = event.data.genre;
    const lValue = this.value;
    const lRegex = /[^0-9 ]+/g;
    let lChaine = lValue.replace(lRegex, "");
    if (lChaine !== "") {
      lChaine = parseInt(lChaine);
      switch (lGenreEdit) {
        case GenreCouleur.RGB_B:
        case GenreCouleur.RGB_G:
        case GenreCouleur.RGB_R:
          lChaine = Math.max(Math.min(lChaine, 255), 0);
          break;
        case GenreCouleur.HSL_H:
          lChaine = Math.max(Math.min(lChaine, 360), 0);
          break;
        default:
          lChaine = Math.max(Math.min(lChaine, 100), 0);
          break;
      }
    }
    if (!lChaine) {
      lChaine = "0";
    }
    if (lValue !== lChaine) {
      ObjetHtml_1.GHtml.setValue(this, lChaine);
    }
  }
  _onSortieCouleur(event) {
    const lGenreEdit = event.data.genre;
    const lThis = event.data.instance;
    if (
      lGenreEdit === GenreCouleur.RGB_R ||
      lGenreEdit === GenreCouleur.RGB_G ||
      lGenreEdit === GenreCouleur.RGB_B
    ) {
      const lRGB = {
        r: parseInt(
          ObjetHtml_1.GHtml.getValue(
            lThis._getIdEditCouleur(GenreCouleur.RGB_R),
          ),
        ),
        g: parseInt(
          ObjetHtml_1.GHtml.getValue(
            lThis._getIdEditCouleur(GenreCouleur.RGB_G),
          ),
        ),
        b: parseInt(
          ObjetHtml_1.GHtml.getValue(
            lThis._getIdEditCouleur(GenreCouleur.RGB_B),
          ),
        ),
      };
      lThis._actualiser({ RGB: lRGB });
    } else {
      const lHSL = {
        h: parseInt(
          ObjetHtml_1.GHtml.getValue(
            lThis._getIdEditCouleur(GenreCouleur.HSL_H),
          ),
        ),
        s: parseInt(
          ObjetHtml_1.GHtml.getValue(
            lThis._getIdEditCouleur(GenreCouleur.HSL_S),
          ),
        ),
        l: parseInt(
          ObjetHtml_1.GHtml.getValue(
            lThis._getIdEditCouleur(GenreCouleur.HSL_L),
          ),
        ),
      };
      lThis._actualiser({ HSL: lHSL });
    }
  }
  _getHSLSelonEvent(aParametres, event) {
    const lPosEvent = ObjetPosition_1.GPosition.getPositionEventJQuery(event);
    let lHSL;
    if (aParametres.pourSlider) {
      lHSL = {
        h: Math.floor(
          (360 *
            (const_tailleImageCouleur -
              Math.max(
                0,
                Math.min(
                  const_tailleImageCouleur,
                  lPosEvent.y - aParametres.positionRef.top,
                ),
              ))) /
            const_tailleImageCouleur,
        ),
        s: aParametres.instance.couleur.HSL.s,
        l: aParametres.instance.couleur.HSL.l,
      };
    } else {
      lHSL = {
        h: aParametres.instance.couleur.HSL.h,
        s: Math.floor(
          (100 *
            Math.max(
              0,
              Math.min(
                const_tailleImageCouleur,
                lPosEvent.x - aParametres.positionRef.left,
              ),
            )) /
            const_tailleImageCouleur,
        ),
        l: Math.floor(
          (100 *
            (const_tailleImageCouleur -
              Math.max(
                0,
                Math.min(
                  const_tailleImageCouleur,
                  lPosEvent.y - aParametres.positionRef.top,
                ),
              ))) /
            const_tailleImageCouleur,
        ),
      };
    }
    return lHSL;
  }
}
exports.ObjetFenetre_SelecteurCouleur = ObjetFenetre_SelecteurCouleur;
