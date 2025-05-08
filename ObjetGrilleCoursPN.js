exports.ObjetGrilleCoursPN = void 0;
const MethodesTableau_1 = require("MethodesTableau");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetGrilleCours_1 = require("ObjetGrilleCours");
const ObjetImage_1 = require("ObjetImage");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeStatutCours_1 = require("TypeStatutCours");
const UtilitaireGrilleImageCoursPN_1 = require("UtilitaireGrilleImageCoursPN");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitairePlaces_1 = require("UtilitairePlaces");
const UtilitaireEDTSortiePedagogique_1 = require("UtilitaireEDTSortiePedagogique");
const TypeHttpMarqueurContenuCours_1 = require("TypeHttpMarqueurContenuCours");
const ObjetDate_1 = require("ObjetDate");
const ObjetRequeteSortiePedaDeCours_1 = require("ObjetRequeteSortiePedaDeCours");
let uLargeurSeparateurContenuCours = null;
const uSeparateurContenu = ", ";
class ObjetGrilleCoursPN extends ObjetGrilleCours_1.ObjetGrilleCours {
  constructor(aGrille) {
    super(aGrille);
    Object.assign(this.params, {
      titleBoutonCoursMS: ObjetTraduction_1.GTraductions.getValeur("EDT.Cours"),
      prefixeImageCours: "Image_",
      contenuEnGras: false,
      filtresImagesUniquement: null,
      avecVoileCoursObligDispense: true,
      couleurFondCours: null,
      modeGrilleAbsence: false,
    });
  }
  getPlaceCoursHorsGrille(aCours, aDebutCours) {
    if (aCours.estSortiePedagogique) {
      let lPlaceCycle;
      if (aDebutCours) {
        lPlaceCycle =
          UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
            aCours.placeReelle,
          );
        if (
          lPlaceCycle.cycle < aCours.numeroSemaine ||
          (lPlaceCycle.cycle === aCours.numeroSemaine &&
            aCours.place > lPlaceCycle.place)
        ) {
          return true;
        }
      } else {
        lPlaceCycle =
          UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
            aCours.placeReelle + aCours.dureeReelle - 1,
          );
        if (
          lPlaceCycle.cycle > aCours.numeroSemaine ||
          (lPlaceCycle.cycle === aCours.numeroSemaine &&
            aCours.place + aCours.duree - 1 < lPlaceCycle.place)
        ) {
          return true;
        }
      }
    }
    return super.getPlaceCoursHorsGrille(aCours, aDebutCours);
  }
  getNumeroTrancheDeCours(aCours) {
    return this.grille
      .getOptions()
      .convertisseurPosition.getNumeroTrancheDeCours(aCours);
  }
  estCoursVisible(aCours) {
    const lEstVisible =
      aCours.Visible !== false &&
      this.grille.getOptions().convertisseurPosition.estCoursDansGrille(aCours);
    if (aCours.horsHoraire) {
      return lEstVisible && !!this.params.idPiedTranche;
    }
    if (lEstVisible) {
      const lPlaceDebut = this.getPlaceDebutCours(aCours);
      const lPlaceFin = this.getPlaceFinCours(aCours);
      if (lPlaceDebut < 0 || lPlaceFin < 0 || lPlaceFin - lPlaceDebut < 0) {
        return false;
      }
    }
    return (
      lEstVisible &&
      !!this.grille
        .getOptions()
        .tranches.get(
          Math.floor(
            this.getPlaceDebutCours(aCours) /
              this.grille.getOptions().blocHoraires.nbHoraires(),
          ),
        )
    );
  }
  getCadreCours(aCours) {
    if (this.params.modeGrilleAbsence && aCours.estRetenue) {
      return {
        left: 2,
        top: 0,
        right: 0,
        bottom: 0,
        couleurFond: this.params.couleurFondCours || "red",
        couleurBordure: aCours.CouleurFond,
      };
    }
    if (this.params.modeGrilleAbsence && aCours.estSortiePedagogique) {
      return {
        left: 2,
        top: 0,
        right: 0,
        bottom: 0,
        couleurFond: this.params.couleurFondCours || "#FFF",
        couleurBordure: aCours.CouleurFond,
      };
    }
    if (this.params.couleurFondCours) {
      return {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        couleurFond: this.params.couleurFondCours,
      };
    }
    const lCouleurBordure = aCours.CouleurFond;
    const lCouleurFond = aCours.coursMultiple
      ? aCours.CouleurFond
      : aCours.couleurFondHorsBordure ||
        GCouleur.getCouleurTransformationCours(lCouleurBordure);
    return {
      left: 5,
      top: 1,
      right: 1,
      bottom: 1,
      couleurFond: lCouleurFond,
      couleurBordure: lCouleurBordure,
    };
  }
  actualiserContenuCours(aParams) {
    const lParams = Object.assign(
      { indiceCours: -1, width: 0, height: 0 },
      aParams,
    );
    const LCours = this.params.listeCours.get(lParams.indiceCours);
    if (uLargeurSeparateurContenuCours === null) {
      uLargeurSeparateurContenuCours =
        ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
          uSeparateurContenu + "W",
          10,
          this.params.contenuEnGras,
        );
    }
    lParams.width -= 1;
    let lHeightLine = ObjetChaine_1.GChaine.getHauteurPolice(10);
    const lHtml = [];
    let lHtmlAbsence = [];
    let lAvecContenuAbsence = false,
      LInfosAbsence = null;
    if (this.grille.getOptions().decorateurAbsences) {
      LInfosAbsence = this.grille
        .getOptions()
        .decorateurAbsences.ajouterAbsencesDansCours(
          this.grille,
          LCours,
          lHtmlAbsence,
        );
      lAvecContenuAbsence = lHtmlAbsence.length > 0;
    }
    const lEstConseilDeClasse =
      LCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse;
    if (!LCours.estRetenue) {
      lHtml.push(
        IE.jsx.str(
          "span",
          { class: "sr-only" },
          ObjetChaine_1.GChaine.format(
            ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.CoursDuDeA_SSS"),
            [
              ObjetDate_1.GDate.formatDate(LCours.DateDuCours, `%J %MMMM`),
              ObjetDate_1.GDate.formatDate(
                LCours.DateDuCours,
                `%xh ${ObjetTraduction_1.GTraductions.getValeur("WAI.heures").toLowerCase()} %mm`,
              ),
              ObjetDate_1.GDate.formatDate(
                ObjetDate_1.GDate.placeEnDateHeure(LCours.Fin, true),
                ` %xh ${ObjetTraduction_1.GTraductions.getValeur("WAI.heures").toLowerCase()} %mm`,
              ),
            ],
          ),
        ),
      );
    }
    if (LCours.Statut) {
      const H = [];
      if (lAvecContenuAbsence) {
        H.push(lHtmlAbsence.join(""));
        lHtmlAbsence = [];
      }
      const lWidthImageConseil = 12;
      const lAvecImagePresenceConseil =
        lEstConseilDeClasse &&
        [
          Enumere_Espace_1.EGenreEspace.Professeur,
          Enumere_Espace_1.EGenreEspace.Administrateur,
          Enumere_Espace_1.EGenreEspace.Etablissement,
        ].includes(GEtatUtilisateur.GenreEspace);
      H.push(
        '<div class="NoWrap" ie-ellipsis style="margin:0px 1px; position:relative;',
        lAvecContenuAbsence
          ? ObjetStyle_1.GStyle.composeCouleur(
              TypeStatutCours_1.TypeStatutCoursUtil.getCouleurFond(LCours),
              TypeStatutCours_1.TypeStatutCoursUtil.getCouleur(LCours),
            )
          : "",
        ObjetStyle_1.GStyle.composeWidth(
          lParams.width -
            1 -
            (lAvecImagePresenceConseil ? lWidthImageConseil : 0),
        ),
        lAvecImagePresenceConseil
          ? "padding-left:" + lWidthImageConseil + "px;"
          : "",
        '">',
        LCours.Statut,
        lAvecImagePresenceConseil
          ? '<div style="position:absolute; top:0px; left:0px;" class="' +
              (LCours.presenceObligatoireConseil
                ? "Image_PointBleuEnRelief"
                : "Image_PointGrisEnRelief") +
              '"' +
              (LCours.presenceObligatoireConseil
                ? ' title="' +
                  ObjetTraduction_1.GTraductions.getValeur(
                    "EDT.ParticipantIndispensable",
                  ) +
                  '"'
                : "") +
              "></div>"
          : "",
        "</div>",
      );
      ObjetHtml_1.GHtml.setHtml(
        this._getIdStatut(lParams.indiceCours),
        H.join(""),
        { controleur: this.grille.controleur, ignorerScroll: true },
      );
      ObjetPosition_1.GPosition.setHeight(
        this._getIdStatut(lParams.indiceCours),
        lHeightLine,
      );
      if (lParams.height - lHeightLine - 2 <= 0) {
        LCours.existeContenuMasque = true;
        return;
      }
      lParams.height -= lHeightLine + 2;
    } else if (lAvecContenuAbsence) {
      lHtml.push(lHtmlAbsence.join(""));
    }
    let lWidth,
      lHeight = 0,
      lNbContenusHorsCadre = 0,
      lNbLignesVisibles = 0,
      lLigneContenu;
    LCours.existeContenuMasque = false;
    const lLignesContenus = [];
    LCours.ListeContenus.parcourir((aContenu, aIndex) => {
      let lLibelle = aContenu.getLibelle();
      if (
        lLibelle.length &&
        aContenu.Visible !== false &&
        aContenu.getGenre() !== Enumere_Ressource_1.EGenreRessource.Service
      ) {
        aContenu.Longueur = ObjetChaine_1.GChaine.getLongueurChaine(
          lLibelle,
          10,
          aContenu.Gras,
        );
        const lDescriptionImage = this._getImageDeContenu(aContenu, LCours);
        lWidth =
          lDescriptionImage && lDescriptionImage.width
            ? lParams.width - lDescriptionImage.width
            : lParams.width;
        if (aContenu.Longueur > lWidth) {
          LCours.existeContenuMasque = true;
        }
        lLigneContenu = {
          contenu: aContenu,
          tabContenus: [aContenu],
          getLibelle: function () {
            const lLibelles = [];
            this.tabContenus.forEach((aContenu) => {
              let lLibelle = aContenu.getLibelle();
              if (aContenu.estAccompagnant) {
                lLibelle += IE.jsx.str(
                  IE.jsx.fragment,
                  null,
                  " ",
                  IE.jsx.str("i", {
                    class: "icon_accompagnant",
                    role: "img",
                    "aria-label": ObjetTraduction_1.GTraductions.getValeur(
                      "PersonnelAccompagnant",
                    ),
                  }),
                );
              }
              lLibelles.push(lLibelle);
            });
            return lLibelles.join(uSeparateurContenu);
          },
          index: aIndex,
          width: lWidth,
          Class: aContenu.Class,
          Gras: aContenu.Gras,
          heightLigne: lHeightLine,
        };
        lLignesContenus.push(lLigneContenu);
        if (lHeight + lHeightLine >= lParams.height) {
          if (lLignesContenus.length > 1) {
            lNbContenusHorsCadre += 1;
            return;
          }
          lHeightLine = lParams.height - lHeight;
          if (lHeightLine < 3) {
            lNbContenusHorsCadre += 1;
            LCours.existeContenuMasque = true;
            return;
          }
        }
        lLigneContenu.heightLigne = lHeightLine;
        lNbLignesVisibles += 1;
        lHeight += lHeightLine;
      }
    });
    lNbContenusHorsCadre = this._regrouperContenus(
      lLignesContenus,
      lNbContenusHorsCadre,
      false,
      LCours,
    );
    if (lNbContenusHorsCadre > 0) {
      lNbContenusHorsCadre = this._regrouperContenus(
        lLignesContenus,
        lNbContenusHorsCadre,
        true,
        LCours,
      );
    }
    let lEstContenuMasque = false;
    let lNbLignesAjoute = 0;
    for (const aLigneContenu of lLignesContenus) {
      lNbLignesAjoute += 1;
      if (lNbLignesAjoute > lNbLignesVisibles) {
        LCours.existeContenuMasque = true;
        lEstContenuMasque = true;
      }
      let LClass = "";
      let LStyle = "";
      if (lEstContenuMasque) {
        LClass = "sr-only";
      } else {
        LClass = aLigneContenu.Class
          ? aLigneContenu.Class
          : "AlignementMilieu" + (aLigneContenu.Gras ? " Gras" : "");
        let lCouleurTexte = this.params.couleurFondCours
          ? GCouleur.getCouleurCorrespondance(this.params.couleurFondCours)
          : "#000";
        if (LCours.estRetenue && aLigneContenu.contenu.estHoraire) {
          if (this.params.modeGrilleAbsence) {
            LClass += " Souligne Gras";
          } else {
            lCouleurTexte = LCours.CouleurFond;
          }
        } else if (aLigneContenu.contenu.marqueur === "titreSortie") {
          if (this.params.modeGrilleAbsence) {
            if (aLigneContenu.contenu.estLibelleTitreSortie) {
              LClass += " Souligne Gras";
            }
          } else {
            const lCadre = this.getCadreCours(LCours);
            lCouleurTexte = GCouleur.getCouleurContrastee(
              LCours.CouleurFond,
              lCadre.couleurFond,
            );
          }
        } else if (
          aLigneContenu.contenu.marqueur ===
          TypeHttpMarqueurContenuCours_1.TypeHttpMarqueurContenuCours
            .hmcc_PartiesCours
        ) {
          LClass += " Souligne Texte7 Gras";
        }
        LStyle =
          ObjetStyle_1.GStyle.composeCouleurTexte(lCouleurTexte) +
          (LInfosAbsence &&
          LInfosAbsence.avecAbsence &&
          LInfosAbsence.couleur &&
          lCouleurTexte !==
            GCouleur.getCouleurCorrespondance(LInfosAbsence.couleur)
            ? "text-shadow: " +
              GCouleur.getCouleurCorrespondance(lCouleurTexte) +
              " 1px 1px;"
            : "") +
          ObjetStyle_1.GStyle.composeHeight(aLigneContenu.heightLigne) +
          "line-height:" +
          aLigneContenu.heightLigne +
          "px; overflow:hidden;" +
          ObjetStyle_1.GStyle.composeWidth(lParams.width) +
          (lParams.width > 30 ? "text-overflow:ellipsis;" : "");
        if (lAvecContenuAbsence) {
          LStyle += "position:relative;";
        }
      }
      lHtml.push('<div class="NoWrap ' + LClass + '" style="' + LStyle + '">');
      const lDescriptionImage = this._getImageDeContenu(
        aLigneContenu.contenu,
        LCours,
      );
      if (lDescriptionImage && lDescriptionImage.estTAF) {
        lHtml.push(
          '<div class="AvecMain InlineBlock" ',
          ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodeContenu", [
            lParams.indiceCours,
            aLigneContenu.index,
          ]),
          ">",
        );
        lHtml.push(
          '<div style="float: left;',
          ObjetStyle_1.GStyle.composeWidth(lDescriptionImage.width),
          '">' +
            ObjetImage_1.GImage.compose("Image_IconeTravailAFaire") +
            "</div>",
        );
        const lLibelle = ObjetChaine_1.GChaine.getChaine(
          aLigneContenu.getLibelle(),
          10,
          this.params.contenuEnGras,
          aLigneContenu.width,
        );
        lHtml.push(
          '<div style="float: left;" class="' +
            LClass +
            '">' +
            lLibelle +
            "</div>",
        );
        lHtml.push("</div>");
      } else if (lDescriptionImage && lDescriptionImage.estRemplacant) {
        lHtml.push(
          '<div class="InlineBlock" style="background-color:white;padding:1px; margin-right:1px; font-size:8px;">',
          ObjetTraduction_1.GTraductions.getValeur(
            "EDT.RSurImageRemplacantDeBlocUnSeulCar",
          ),
          "</div>",
          '<div class="InlineBlock NoWrap ' + LClass + '">',
          aLigneContenu.getLibelle(),
          "</div>",
        );
      } else {
        lHtml.push(aLigneContenu.getLibelle());
      }
      lHtml.push("</div>");
    }
    ObjetHtml_1.GHtml.setHtml(
      this.getIdContenu(lParams.indiceCours),
      lHtml.join(""),
      { instance: this.grille, ignorerScroll: true },
    );
  }
  composeEnteteCours(I, aCours) {
    const H = [];
    if (aCours.Statut) {
      H.push(
        '<tr><td style="height:10px;">' +
          '<div id="' +
          this._getIdStatut(I) +
          '" style="' +
          ObjetStyle_1.GStyle.composeCouleur(
            TypeStatutCours_1.TypeStatutCoursUtil.getCouleurFond(aCours),
            TypeStatutCours_1.TypeStatutCoursUtil.getCouleur(aCours),
          ) +
          ';" ' +
          'class="EtiquetteCours">' +
          "</div></td></tr>",
      );
    }
    return H.join("");
  }
  getListeImagesCoin(aParams) {
    return UtilitaireGrilleImageCoursPN_1.TUtilitaireGrilleImageCoursPN.getListeImagesCours(
      aParams.cours,
      aParams.indiceCours,
      this.params.filtresImagesUniquement,
    );
  }
  construireDecorateurCours(aCours) {
    if (
      aCours.dispenseEleve &&
      !aCours.dispenseEleve.obligatoire &&
      !aCours.dispenseEleve.maison &&
      this.params.avecVoileCoursObligDispense
    ) {
      return '<div class="VoileCoursNonObligDispenseEleve"></div>';
    }
    return "";
  }
  getHintCours(aCours) {
    if (!aCours) {
      return "";
    }
    const H = [];
    if (aCours.listeSortiesPeda && aCours.listeSortiesPeda.count() > 0) {
      if (aCours.elementHintSortiePedagogique) {
        return aCours.elementHintSortiePedagogique;
      }
      return new ObjetRequeteSortiePedaDeCours_1.ObjetRequeteSortiesPedaDeCours(
        this,
      )
        .lancerRequete({
          cours: aCours,
          numeroSemaine: aCours.numeroSemaine,
          liste: aCours.listeSortiesPeda.setSerialisateurJSON({
            ignorerEtatsElements: true,
          }),
        })
        .then((aJSON) => {
          aCours.elementHintSortiePedagogique = this._getHintSortiePedagogique(
            aCours,
            aJSON.liste,
          );
          return aCours.elementHintSortiePedagogique;
        });
    }
    if (aCours.existeContenuMasque) {
      const N = aCours.ListeContenus.count();
      for (let J = 0; J < N; J++) {
        let LContenu = aCours.ListeContenus.get(J);
        if (
          LContenu.getLibelle().length &&
          LContenu.Visible !== false &&
          LContenu.getGenre() !== Enumere_Ressource_1.EGenreRessource.Service
        ) {
          H.push(LContenu.getLibelle());
        }
      }
      return H.join("<br/>");
    }
    return "";
  }
  _getIdStatut(I) {
    return this.params.id + "_statut_" + I;
  }
  _regrouperContenus(
    aLignesContenus,
    aNbContenusHorsCadre,
    aForcerRegroupements,
    aCours,
  ) {
    let lIndex = aLignesContenus.length - 1;
    while (lIndex > 0 && aNbContenusHorsCadre > 0) {
      const lContenuVisible = aLignesContenus[lIndex],
        lContenuVisiblePrecedent = aLignesContenus[lIndex - 1];
      if (
        lContenuVisible &&
        lContenuVisiblePrecedent &&
        lContenuVisible.contenu.getGenre() ===
          lContenuVisiblePrecedent.contenu.getGenre() &&
        lContenuVisible.contenu.marqueur ===
          lContenuVisiblePrecedent.contenu.marqueur &&
        lContenuVisible.contenu.Longueur + uLargeurSeparateurContenuCours <
          lContenuVisible.width &&
        lContenuVisiblePrecedent.contenu.Longueur +
          uLargeurSeparateurContenuCours <
          lContenuVisiblePrecedent.width &&
        !this._getImageDeContenu(lContenuVisible.contenu, aCours) &&
        !this._getImageDeContenu(lContenuVisiblePrecedent.contenu, aCours) &&
        lContenuVisible.Class === lContenuVisiblePrecedent.Class &&
        lContenuVisible.Gras === lContenuVisiblePrecedent.Gras
      ) {
        if (
          ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
            lContenuVisiblePrecedent.getLibelle() +
              uSeparateurContenu +
              lContenuVisible.getLibelle(),
            10,
            this.params.contenuEnGras,
          ) > lContenuVisiblePrecedent.width
        ) {
          if (aForcerRegroupements) {
            aCours.existeContenuMasque = true;
          } else {
            lIndex -= 1;
            continue;
          }
        }
        lContenuVisiblePrecedent.tabContenus =
          lContenuVisiblePrecedent.tabContenus.concat(
            lContenuVisible.tabContenus,
          );
        MethodesTableau_1.MethodesTableau.supprimerElement(
          aLignesContenus,
          lIndex,
        );
        aNbContenusHorsCadre -= 1;
      }
      lIndex -= 1;
    }
    return aNbContenusHorsCadre;
  }
  _getImageDeContenu(aContenu, aCours) {
    if (!aContenu || !aCours) {
      return false;
    }
    if (
      aContenu.getGenre() === Enumere_Ressource_1.EGenreRessource.Matiere &&
      aCours.avecTafPublie
    ) {
      return { width: 16, estTAF: true };
    } else if (
      aContenu.marqueur ===
      TypeHttpMarqueurContenuCours_1.TypeHttpMarqueurContenuCours
        .hmcc_Remplacant
    ) {
      return { width: 14, estRemplacant: true };
    }
    return false;
  }
  _getHintSortiePedagogique(aCours, aListeSorties) {
    const H = [];
    H.push('<div class="hintCoursSortiePedagogique">');
    aListeSorties.parcourir((aSortie, aIndex) => {
      if (!aSortie.DateDuCours) {
        aSortie.DateDuCours = aCours.DateDuCours;
      }
      if (aIndex > 0) {
        H.push('<div class="hcsp_separateur"></div>');
      }
      H.push(
        '<div class="hcsp_titre">',
        ObjetTraduction_1.GTraductions.getValeur(
          "EDT.AbsRess.SortiePedagogique",
        ) +
          " " +
          UtilitaireEDTSortiePedagogique_1.UtilitaireEDTSortiePedagogique.strDate(
            aSortie,
          ),
        "</div>",
      );
      H.push(
        "<div>",
        "<label>" + aSortie.strGenreRess + " :",
        "</label>",
        '<label class="hcsp_contenu">' + aSortie.strRess,
        "</label>",
        "<label> - </label>",
        "<label>" +
          ObjetTraduction_1.GTraductions.getValeur("EDT.AbsRess.Motif") +
          " : ",
        "</label>",
        '<label class="hcsp_contenu">' + aSortie.motif,
        "</label>",
        "</div>",
      );
      H.push(
        "<div>",
        "<label>" +
          ObjetTraduction_1.GTraductions.getValeur(
            "EDT.AbsRess.Accompagnateurs",
          ) +
          " : ",
        "</label>",
        '<label class="hcsp_contenu">' + aSortie.accompagnateurs.join(", "),
        "</label>",
        "</div>",
      );
      if (aSortie.memo) {
        H.push(
          '<div class="hcsp_titreMemo">',
          ObjetTraduction_1.GTraductions.getValeur(
            "EDT.AbsRess.TitreMemoAbsence",
          ),
          "</div>",
          '<div class="hcsp_memo">',
          ObjetChaine_1.GChaine.replaceRCToHTML(aSortie.memo),
          "</div>",
        );
      }
    });
    H.push("</div>");
    return H.join("");
  }
}
exports.ObjetGrilleCoursPN = ObjetGrilleCoursPN;
