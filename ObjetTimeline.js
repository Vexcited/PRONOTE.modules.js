const { GHtml } = require("ObjetHtml.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EModeAffichageTimeline } = require("Enumere_ModeAffichageTimeline.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { GPosition } = require("ObjetPosition.js");
const { GUID } = require("GUID.js");
const { EEvent } = require("Enumere_Event.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GDate } = require("ObjetDate.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { GStyle } = require("ObjetStyle.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { UtilitaireHtml } = require("UtilitaireHtml.js");
const { GChaine } = require("ObjetChaine.js");
const EModePliage = { blocEntier: 1, contenu: 2, aucun: 3 };
class ObjetTimeline extends ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    this.idBlocDate = GUID.getId();
    this.modePliage = EModePliage.contenu;
    this.avecBoutonsFixes = false;
    this.avecModeCompact = false;
    this.avecBlocDates = true;
    this.modeAffichage = EModeAffichageTimeline.classique;
    this._formatDate = "[%JJJ %JJ %MMM]";
    this._formatDateJourNum = "%JJ";
    this._formatDateMois = "%MMM";
    this._formatDateGrille =
      '<div class="Texte20 InlineBlock AlignementMilieuVertical EspaceDroit">%JJ</div><div class="InlineBlock AlignementMilieuVertical" style="height:22px;width:1px;' +
      GStyle.composeCouleurBordure(
        GCouleur.themeNeutre.moyen2,
        1,
        EGenreBordure.gauche,
      ) +
      '"></div><div class="Texte20 InlineBlock AlignementMilieuVertical EspaceGauche"><div class="Texte12 Gras">%Jjj</div><div class="Texte10 affichageMois">%Mmm</div></div>';
    this._formatDatePourId = "%JJ%MM%AAAA";
    this.hauteurDisponible = GPosition.getHeight(this.Pere.Nom);
    this.hauteurMinimaleCellule = 250;
    this.ajouterEvenementGlobal(EEvent.SurPreResize, this.surPreResize);
    this.ajouterEvenementGlobal(EEvent.SurPostResize, this.surPostResize);
  }
  static composeChoix(aGroupeRadioId, aSelectedModeAffichage) {
    const lListeRadios = [];
    lListeRadios.push({
      libelle: GTraductions.getValeur("VueChronologique"),
      value: this.avecModeCompact
        ? EModeAffichageTimeline.compact
        : EModeAffichageTimeline.classique,
    });
    lListeRadios.push({
      libelle: GTraductions.getValeur("VueHebdomadaire"),
      value: EModeAffichageTimeline.grille,
    });
    return UtilitaireHtml.composeGroupeRadiosBoutons({
      id: aGroupeRadioId,
      listeRadios: lListeRadios,
      selectedValue: aSelectedModeAffichage,
    });
  }
  construireInstances() {}
  setOptions(aParam) {
    if (aParam.modeAffichage !== null && aParam.modeAffichage !== undefined) {
      this.modeAffichage = aParam.modeAffichage;
    }
    if (aParam.avecBlocDates !== null && aParam.avecBlocDates !== undefined) {
      this.avecBlocDates = aParam.avecBlocDates;
    }
    if (
      aParam.creationEvenement !== null &&
      aParam.creationEvenement !== undefined
    ) {
      this.eventCreation = aParam.creationEvenement;
    }
    if (aParam.listeBoutons !== null && aParam.listeBoutons !== undefined) {
      this.listeBoutons = aParam.listeBoutons;
    }
    if (
      aParam.avecBoutonsFixes !== null &&
      aParam.avecBoutonsFixes !== undefined
    ) {
      this.avecBoutonsFixes = aParam.avecBoutonsFixes;
    }
    if (aParam.bloquerPliage !== null && aParam.bloquerPliage !== undefined) {
      this.modePliage = EModePliage.aucun;
    }
    this.griseJoursPasses = aParam.griseJoursPasses || true;
    this.avecMessageAucun = aParam.avecMessageAucun;
    this.msgAucun =
      aParam.msgAucun !== null && aParam.msgAucun !== undefined
        ? aParam.msgAucun
        : GTraductions.getValeur("timeline.aucun");
    this.hauteurOccupee = aParam.hauteurOccupee;
    this.avecJoursOuvres = aParam.avecJoursOuvres
      ? aParam.avecJoursOuvres
      : false;
    this.joursAffiches = aParam.joursAffiches
      ? aParam.joursAffiches
      : new TypeEnsembleNombre().add([0, 1, 2, 3, 4, 5, 6]);
    this.debutGrille = aParam.debutGrille
      ? aParam.debutGrille
      : GDate.PremierLundi;
    this.finGrille = aParam.finGrille ? aParam.finGrille : GDate.derniereDate;
    if (aParam.formatDate) {
      this._formatDate = aParam.formatDate;
    }
    if (aParam.formatDateGrille) {
      this._formatDateGrille = aParam.formatDateGrille;
    }
  }
  setDonnees(aParametres) {
    this.donneesRecues = true;
    const lParametres = {
      liste: new ObjetListeElements(),
      gestionnairesBlocs: [],
      dateCourante: GDate.aujourdhui,
    };
    $.extend(lParametres, aParametres);
    const lInstance = this;
    lParametres.gestionnairesBlocs.forEach((aGest) => {
      aGest._options.modeAffichage = lInstance.modeAffichage;
    });
    const hauteurPere = this.calculerTailleDisponible({
      hauteurZoneADeduire: aParametres.hauteurZoneADeduire,
    });
    let hauteurFreres = calculerHauteurFreres.call(
      this,
      $(("#" + this.Nom).escapeJQ()),
    );
    if (hauteurFreres === hauteurPere || !this.avecBoutonsFixes) {
      hauteurFreres = 0;
    }
    this.hauteurInterface =
      hauteurPere - (hauteurFreres === undefined ? 0 : hauteurFreres) - 5;
    let lTris = [];
    if (lParametres.tris !== null && lParametres.tris !== undefined) {
      if (Array.isArray(lParametres.tris)) {
        lTris = lParametres.tris;
      } else {
        lTris.push(lParametres.tris);
      }
    }
    const lListeSansDateManquante = new ObjetListeElements();
    lParametres.liste.parcourir((aElt) => {
      if (aElt.DateDebut !== undefined) {
        lListeSansDateManquante.addElement(aElt);
      }
    });
    this.listeEvenements = lListeSansDateManquante;
    this.listeEvenements.setTri(lTris);
    this.listeEvenements.trier();
    this.gestionnairesBlocs = lParametres.gestionnairesBlocs;
    this.reinitGestionnaires();
    this.afficher();
    this.remplirTimeline();
    for (let i = 0, lNbr = this.gestionnairesBlocs.length; i < lNbr; i++) {
      if (this.gestionnairesBlocs[i]) {
        this.gestionnairesBlocs[i].refresh();
      }
    }
    let taille = this.calculerTailleDisponible({
      hauteurZoneADeduire: aParametres.hauteurZoneADeduire,
    });
    taille -= 10;
    switch (this.modeAffichage) {
      case EModeAffichageTimeline.grille:
        $("#conteneur-page").height(this.hauteurInterface);
        break;
      case EModeAffichageTimeline.liste:
        if (!IE.estMobile) {
          $("#scroll-panel").height(taille);
          $("aside").height(taille);
          $("aside").addClass("overflow-auto");
          if (this.listeEvenements.count() > 0) {
            $("section").addClass("avecShadow");
          } else {
            $("section").removeClass("avecShadow");
          }
        }
        break;
      default:
        $("#scroll-panel").height(this.hauteurInterface);
    }
    if (
      this.modeAffichage !== EModeAffichageTimeline.grille &&
      this.modeAffichage !== EModeAffichageTimeline.compact
    ) {
      this.positionnerScroll(lParametres.dateCourante);
    }
  }
  calculerTailleDisponible(aParam) {
    Invocateur.evenement(ObjetInvocateur.events.refreshIEHtml);
    if (this.Pere.getHauteurDisponibleTimeLine) {
      return this.Pere.getHauteurDisponibleTimeLine();
    }
    let offset = 25;
    if (
      aParam.hauteurZoneADeduire !== null &&
      aParam.hauteurZoneADeduire !== undefined
    ) {
      offset += aParam.hauteurZoneADeduire;
    } else {
      const boutonsCommuns = $("#scroll-panel").parent().siblings();
      const avecBoutons = boutonsCommuns.length > 0;
      if (
        GEtatUtilisateur.espacesAvecBoutonsTimeLine() &&
        avecBoutons &&
        boutonsCommuns.css("display") !== "none"
      ) {
        offset += boutonsCommuns.height();
      }
    }
    return this.hauteurDisponible - offset;
  }
  reinitGestionnaires() {
    for (let i = 0, lNbr = this.gestionnairesBlocs.length; i < lNbr; i++) {
      const lGestionnaire = this.gestionnairesBlocs[i];
      lGestionnaire.reinit();
    }
  }
  positionnerScroll(aDate) {
    const panel = $("#scroll-panel");
    const lDateLaPlusProche = getDateLaPlusProche.call(this, aDate);
    if (!!lDateLaPlusProche) {
      const lNode = GHtml.getElement(
        this.idBlocDate +
          "_" +
          GDate.formatDate(lDateLaPlusProche, this._formatDatePourId),
      );
      if (panel.length === 1) {
        const lElementPanel = panel.get(0);
        GPosition.scrollToElement(lNode, lElementPanel);
        lElementPanel.scrollTop = lElementPanel.scrollTop + 2;
      }
    }
  }
  construireAffichageListe() {
    const H = [];
    H.push('<div class="Timeline">');
    H.push(
      '<div tabindex="-1" id="scroll-panel" class="ObjetTimeline_Container overflow-auto">',
    );
    if (this.donneesRecues) {
      const nbElements = this.listeEvenements.count();
      let dateCourante = new Date(0);
      if (nbElements > 0) {
        for (let i = 0; i < nbElements; i++) {
          const Element = this.listeEvenements.get(i);
          if (
            GDate.getNbrJoursEntreDeuxDates(Element.DateDebut, dateCourante) !==
            0
          ) {
            dateCourante = Element.DateDebut;
            H.push(this.composeBlocTimeline(dateCourante, false));
          }
        }
      } else {
        if (this.avecMessageAucun === true) {
          H.push(this.composeMsgAucun());
        }
      }
    }
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  construireAffichageClassique() {
    const H = [];
    H.push('<div class="Timeline">');
    H.push(
      '<div tabindex="-1" id="scroll-panel" class="ObjetTimeline_Container overflow-auto" >',
    );
    if (this.donneesRecues) {
      const nbElements = this.listeEvenements.count();
      let dateCourante = new Date(0);
      if (nbElements > 0) {
        for (let i = 0; i < nbElements; i++) {
          const Element = this.listeEvenements.get(i);
          if (
            GDate.getNbrJoursEntreDeuxDates(Element.DateDebut, dateCourante) !==
            0
          ) {
            dateCourante = Element.DateDebut;
            H.push(this.composeBlocTimeline(dateCourante, false));
          }
        }
      } else {
        if (this.avecMessageAucun === true) {
          H.push(this.composeMsgAucun());
        }
      }
    }
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  construireAffichageGrille() {
    let dateCourante = new Date(0);
    const H = [];
    let Element, i;
    const nbJoursParLigne = this.avecJoursOuvres
      ? IE.Cycles.nombreJoursOuvresParCycle()
      : this.joursAffiches.count();
    H.push(
      '<div tabindex="-1" id="conteneur-page" class="Timeline MargeGauche overflow-auto">',
    );
    if (this.donneesRecues) {
      const nbElements = this.listeEvenements.count();
      i = 0;
      const lLargeurObjet =
        GPosition.getWidth(this.Nom) -
        GNavigateur.getLargeurBarreDeScroll() -
        10;
      const lLargeurColonne =
        Math.floor(lLargeurObjet / nbJoursParLigne) + "px";
      const lNombreDeJours =
        GDate.getNbrJoursEntreDeuxDates(this.debutGrille, this.finGrille) + 1;
      const lNbSemaines =
        Math.floor(lNombreDeJours / 7) + (lNombreDeJours % 7 === 0 ? 0 : 1);
      const lTailleDisponible = this.hauteurInterface - 34 * lNbSemaines - 5;
      let lHauteurCellule = Math.floor(lTailleDisponible / lNbSemaines);
      lHauteurCellule =
        lHauteurCellule < this.hauteurMinimaleCellule
          ? this.hauteurMinimaleCellule
          : lHauteurCellule;
      let lEstUnJourFerie;
      let lEstGrisePassee;
      let lEstAujourdHui;
      let indiceSemaine = 0;
      let indiceCourant = nbElements > 0 ? nbElements - 1 : 0;
      for (
        dateCourante = this.debutGrille;
        dateCourante <= this.finGrille;
        dateCourante = GDate.getJourSuivant(dateCourante, 1)
      ) {
        const jour = GDate.getJourDeSemaine(dateCourante);
        const afficher = this.avecJoursOuvres
          ? GDate.estUnJourOuvre(dateCourante)
          : this.joursAffiches.contains(jour);
        while (
          indiceCourant > 0 &&
          this.listeEvenements.get(indiceCourant).DateDebut < this.debutGrille
        ) {
          indiceCourant--;
        }
        Element = this.listeEvenements.get(indiceCourant);
        if (!afficher) {
          if (
            Element &&
            GDate.getNbrJoursEntreDeuxDates(Element.DateDebut, dateCourante) ===
              0
          ) {
            while (
              indiceCourant > 0 &&
              GDate.getNbrJoursEntreDeuxDates(
                Element.DateDebut,
                this.listeEvenements.get(indiceCourant - 1).DateDebut,
              ) === 0
            ) {
              Element = this.listeEvenements.get(--indiceCourant);
            }
            indiceCourant--;
          }
          continue;
        }
        if (i % nbJoursParLigne === 0) {
          H.push('<div style="display:flex;">');
          indiceSemaine++;
        }
        let aTitreSeul = false;
        const lEstFinDeSemaine = i % nbJoursParLigne === nbJoursParLigne - 1;
        const lEstDerniereSemaine = indiceSemaine === lNbSemaines;
        lEstUnJourFerie = GParametres.JoursFeries.getValeur(
          GDate.getNbrJoursEntreDeuxDates(
            IE.Cycles.dateDebutPremierCycle(),
            dateCourante,
          ) + 1,
        );
        lEstGrisePassee =
          this.griseJoursPasses && GDate.estAvantJourCourant(dateCourante);
        lEstAujourdHui = GDate.estJourCourant(dateCourante);
        if (this.modeAffichage === EModeAffichageTimeline.grille) {
          const lClass = lEstAujourdHui ? "couleurClaireDuTheme " : "";
          const lLibelleJour = GDate.formatDate(
            dateCourante,
            this._formatDateGrille,
          );
          const lNbJour = GDate.getNbrJoursDepuisPremiereLundi(dateCourante);
          const ajouterCreation =
            this.eventCreation && !lEstGrisePassee && !lEstUnJourFerie
              ? ' onclick="' +
                this.eventCreation.interfacePere +
                "." +
                this.eventCreation.callback +
                "(" +
                lNbJour +
                ')"'
              : "";
          let lCouleurFond = "background-color : white;";
          if (lEstUnJourFerie) {
            lCouleurFond =
              "background-color : " + GCouleur.themeNeutre.legere + ";";
          } else if (lEstGrisePassee) {
            lCouleurFond =
              "background-color : " + GCouleur.themeNeutre.light + ";";
          }
          let lCouleurDate;
          if (lEstAujourdHui) {
            lCouleurDate = "color:var(--theme-moyen1);";
          } else {
            lCouleurDate = "color : " + GCouleur.themeNeutre.foncee + ";";
          }
          H.push(
            '<div class="',
            this.eventCreation && !lEstGrisePassee && !lEstUnJourFerie
              ? "AvecMain"
              : "",
            '" style="',
            lCouleurFond,
            '" ',
            ajouterCreation,
            ' role="group" aria-label="',
            GDate.formatDate(dateCourante, "%JJJJ %MMMM %AAAA").toAttrValue(),
            '">',
          );
          H.push(
            '  <div class="PetitEspaceHaut" style="' +
              GStyle.composeCouleurBordure(
                GCouleur.bordure,
                1,
                EGenreBordure.gauche +
                  EGenreBordure.haut +
                  (lEstFinDeSemaine ? EGenreBordure.droite : 0),
              ) +
              '">',
          );
          H.push('<div class="conteneurBandeauGrille">');
          H.push(
            '    <div style="' +
              lCouleurDate +
              '" class="fluid-bloc ' +
              lClass +
              '">' +
              lLibelleJour +
              "</div>",
          );
          H.push('    <div class="fix-bloc flex-contain flex-gap">');
          const lInstance = this;
          if (!!this.listeBoutons) {
            this.listeBoutons.parcourir((aBouton) => {
              const lAfficherBouton = !!aBouton.getActif
                ? aBouton.getActif(lNbJour)
                : true;
              if (lAfficherBouton) {
                const lId = GUID.getId();
                const lTheme = !!aBouton.theme
                  ? aBouton.theme
                  : "themeBoutonNeutre";
                const lHint = !!aBouton.hint
                  ? GChaine.toTitle(aBouton.hint)
                  : "";
                H.push(
                  '<ie-btnicon ie-model="',
                  lId,
                  "(",
                  lNbJour,
                  ')" class="',
                  lTheme,
                  " bt-activable bt-large ",
                  aBouton.icon,
                  '" title="',
                  lHint,
                  '" aria-label="',
                  lHint,
                  '"></ie-btnicon>',
                );
                lInstance.controleur[lId] = {
                  event: function (aNb) {
                    aBouton.callback(aNb);
                  },
                  node: function () {
                    $(this.node).on({
                      click: function (event) {
                        event.stopPropagation();
                      },
                    });
                  },
                };
              }
            });
          }
          H.push("</div>");
          H.push("</div>");
          H.push("  </div>");
        }
        H.push(
          '<div style="width:',
          lLargeurColonne,
          ";height:",
          lHauteurCellule,
          "px;",
          GStyle.composeCouleurBordure(
            GCouleur.bordure,
            1,
            EGenreBordure.gauche +
              (lEstDerniereSemaine ? EGenreBordure.bas : 0) +
              (lEstFinDeSemaine ? EGenreBordure.droite : 0),
          ),
          ';min-height:0; overflow : auto; position:relative;" class="ObjetTimeline_classScrollPanel">',
        );
        if (
          Element &&
          GDate.getNbrJoursEntreDeuxDates(Element.DateDebut, dateCourante) === 0
        ) {
          while (
            indiceCourant > 0 &&
            GDate.getNbrJoursEntreDeuxDates(
              Element.DateDebut,
              this.listeEvenements.get(indiceCourant - 1).DateDebut,
            ) === 0
          ) {
            Element = this.listeEvenements.get(--indiceCourant);
          }
          if (indiceCourant > 0) {
            indiceCourant--;
          }
        } else {
          aTitreSeul = true;
        }
        H.push(this.composeBlocTimeline(dateCourante, aTitreSeul));
        H.push("</div>");
        H.push("</div>");
        if (lEstFinDeSemaine) {
          H.push("</div>");
        }
        i++;
      }
    }
    H.push("</div>");
    return H.join("");
  }
  construireAffichageCompact() {
    const H = [];
    H.push('<div class="Timeline">');
    H.push('<div tabindex="-1" id="scroll-panel" class="overflow-auto">');
    if (this.donneesRecues) {
      const nbElements = this.listeEvenements.count();
      let dateCourante = new Date(0);
      H.push(
        '<div class="ObjetTimeline_BlocCompact Espace ArrondisBloc z-depth-1">',
      );
      if (nbElements > 0) {
        for (let i = 0; i < nbElements; i++) {
          const Element = this.listeEvenements.get(i);
          if (
            GDate.getNbrJoursEntreDeuxDates(Element.DateDebut, dateCourante) !==
            0
          ) {
            dateCourante = Element.DateDebut;
            H.push(
              this.composeBlocTimelineCompact(
                dateCourante,
                false,
                i === nbElements - 1,
              ),
            );
          }
        }
      } else {
        if (this.avecMessageAucun === true) {
          H.push(this.composeMsgAucun());
        }
      }
      H.push("</div>");
    }
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  construireAffichage() {
    const H = [];
    switch (this.modeAffichage) {
      case EModeAffichageTimeline.grille:
        H.push(this.construireAffichageGrille());
        break;
      case EModeAffichageTimeline.compact:
        H.push(this.construireAffichageCompact());
        break;
      case EModeAffichageTimeline.liste:
        H.push(this.construireAffichageListe());
        break;
      default:
        H.push(this.construireAffichageClassique());
    }
    return H.join("");
  }
  composeBlocTimelineCompact(aDate, aTitreSeul, aDernierElement) {
    if (aTitreSeul === undefined) {
      aTitreSeul = false;
    }
    const H = [];
    const idDate = GDate.formatDate(aDate, this._formatDatePourId).toString();
    const lCouleurBloc = GDate.estAvantJourCourant(aDate)
      ? GCouleur.themeNeutre.foncee
      : GCouleur.themeCouleur.foncee;
    const idBloc = this.idBlocDate + "_" + idDate;
    const displayBlocDate = "display:none;";
    const classeConteneur = "ObjetTimeline_section";
    const classeItem = "ObjetTimeline_column";
    const classeEtiquette = "blocTimeline-etiquette";
    const styleSpan =
      GStyle.composeCouleurTexte(GCouleur.blanc) + "margin:5px;";
    H.push('<div id="' + idBloc + '" class="', classeConteneur, '">');
    H.push(
      '  <div id="' + idBloc + '_date" style="',
      displayBlocDate,
      '" class="AvecMain ',
      classeItem,
      ' blocTimeline" onclick="' + this.Nom + ".toggleBloc('",
      idDate,
      "');\">",
    );
    H.push(
      '    <div class="',
      classeEtiquette,
      ' Espace AlignementMilieu" style="' +
        GStyle.composeCouleurFond(lCouleurBloc) +
        '">',
    );
    H.push(
      '        <span style="' + styleSpan + '">',
      GDate.formatDate(aDate, this._formatDate),
      "</span>",
    );
    H.push("    </div>");
    H.push(
      '<div class="traitVertical" style="border-right : dotted 0.3rem ',
      lCouleurBloc,
      '">&nbsp;</div>',
    );
    H.push("  </div>");
    H.push(
      '  <div id="' + idBloc + '_events" class="',
      classeItem,
      '" onclick="' + this.Nom + '.toggleElement(event);">',
    );
    H.push("  </div>");
    H.push("</div>");
    if (!aDernierElement) {
      H.push(
        '<div class="',
        classeItem,
        '" style="border-bottom: solid 2px ',
        GCouleur.themeNeutre.moyen2,
        '"></div>',
      );
    }
    return H.join("");
  }
  remplirTimeline() {
    const nbElements = this.listeEvenements.count();
    for (let i = 0; i < nbElements; i++) {
      const aElement = this.listeEvenements.get(i);
      this.ajouterElementAuBloc(
        this.idBlocDate +
          "_" +
          GDate.formatDate(aElement.DateDebut, this._formatDatePourId) +
          "_events",
        aElement,
      );
    }
  }
  ajouterElementAuBloc(aIdBloc, aElement) {
    const lEltBloc = this.composeElementTimeline(aElement);
    const lIdEltBloc = aIdBloc + GUID.getId();
    aElement.idBloc = lIdEltBloc;
    let lStyle;
    switch (this.modeAffichage) {
      case EModeAffichageTimeline.grille:
        lStyle = ' style="margin-bottom: 5px;"';
        break;
      case EModeAffichageTimeline.compact:
        lStyle = "";
        break;
      default:
        lStyle = "";
    }
    const lElementAvecMarge =
      "<div" + lStyle + ' id="' + lIdEltBloc + '">' + lEltBloc.html + "</div>";
    GHtml.addHtml(aIdBloc, lElementAvecMarge, {
      controleur: lEltBloc.controleur,
    });
  }
  composeMsgAucun() {
    const H = [];
    H.push('<div class="GrandEspaceGauche">');
    H.push(this.composeMessage(this.msgAucun));
    H.push("</div>");
    return H.join("");
  }
  composeBlocTimeline(aDate, aTitreSeul) {
    if (aTitreSeul === undefined) {
      aTitreSeul = false;
    }
    const H = [];
    const idDate = GDate.formatDate(aDate, this._formatDatePourId).toString();
    const lCouleurBloc = GDate.estAvantJourCourant(aDate)
      ? GCouleur.themeNeutre.legere2
      : GCouleur.themeCouleur.claire;
    const idBloc = this.idBlocDate + "_" + idDate;
    let classeConteneur = "";
    let classeItem = "";
    let classeEtiquette = "";
    let styleSpan = "";
    let displayBlocDate = "display:none;";
    switch (this.modeAffichage) {
      case EModeAffichageTimeline.classique: {
        classeConteneur = "ObjetTimeline_section";
        classeItem = "ObjetTimeline_column";
        classeEtiquette = "blocTimeline-etiquette";
        displayBlocDate = this.avecBlocDates ? "" : "display:none;";
        const lCouleurTexte = GDate.estAvantJourCourant(aDate)
          ? GCouleur.themeNeutre.sombre
          : GCouleur.themeCouleur.foncee;
        styleSpan = GStyle.composeCouleurTexte(lCouleurTexte);
        break;
      }
      case EModeAffichageTimeline.liste:
        classeConteneur = "ObjetTimeline_section";
        classeItem = "ObjetTimeline_columnListe";
        classeEtiquette = "blocTimeline-etiquette";
        styleSpan = GStyle.composeCouleurTexte(GCouleur.blanc);
        break;
      case EModeAffichageTimeline.grille:
        styleSpan = GStyle.composeCouleurTexte(GCouleur.blanc);
        break;
      case EModeAffichageTimeline.compact:
        classeConteneur = "ObjetTimeline_section";
        classeItem = "ObjetTimeline_column";
        classeEtiquette = "blocTimeline-etiquette";
        styleSpan = GStyle.composeCouleurTexte(GCouleur.blanc) + "margin:5px;";
        break;
    }
    H.push(
      '<div id="' + idBloc + '" class="',
      classeConteneur,
      '" style="position:relative;z-index:1;top:0.2rem;">',
    );
    H.push(
      '  <div id="' + idBloc + '_date" style="',
      displayBlocDate,
      '" class="AvecMain ',
      classeItem,
      ' blocTimeline" onclick="' + this.Nom + ".toggleBloc('",
      idDate,
      "');\">",
    );
    H.push(
      '    <div class="',
      classeEtiquette,
      ' Espace AlignementMilieu" style="' +
        GStyle.composeCouleurFond(lCouleurBloc) +
        '">',
    );
    H.push(
      '        <span style="' + styleSpan + '">',
      GDate.formatDate(aDate, this._formatDate),
      "</span>",
    );
    H.push("    </div>");
    H.push(
      '<div class="traitVertical" style="border-right : dotted 0.3rem ',
      lCouleurBloc,
      '">&nbsp;</div>',
    );
    H.push("  </div>");
    if (!aTitreSeul) {
      H.push(
        '  <div id="' + idBloc + '_events" class="',
        classeItem,
        '" onclick="' + this.Nom + '.toggleElement(event);">',
      );
      H.push("  </div>");
    }
    H.push("</div>");
    return H.join("");
  }
  surResizeInterface() {
    super.surResizeInterface();
    this.hauteurDisponible = GPosition.getHeight(this.Pere.Nom);
  }
  surPreResize() {
    GHtml.setHtml(this.Nom, "&nbsp;");
  }
  surPostResize() {
    customResize.call(this);
  }
  toggleBloc(aDate) {
    if (this.modePliage === EModePliage.aucun) {
      return;
    }
    let selecteur = "";
    let vitesse = "";
    switch (this.modePliage) {
      case EModePliage.blocEntier:
        selecteur = this.idBlocDate + "_" + aDate + "_events";
        vitesse = "slow";
        break;
      case EModePliage.contenu:
        selecteur = this.idBlocDate + "_" + aDate + "_events .elementPliable";
        vitesse = "fast";
        break;
    }
    let fermes = 0;
    let ouverts = 0;
    $("#" + selecteur).each(function () {
      if ($(this).css("display") === "none") {
        fermes++;
      } else {
        ouverts++;
      }
    });
    const contexte = this;
    if (ouverts <= fermes) {
      $("#" + selecteur).slideDown(vitesse, "linear", () => {
        customResize.call(contexte);
      });
    } else {
      $("#" + selecteur).slideUp(vitesse, "linear", () => {
        customResize.call(contexte);
      });
    }
  }
  toggleElement(aEvent) {
    aEvent.stopImmediatePropagation();
    let selecteur = "";
    let vitesse = "";
    const elt = aEvent.target.closest("div.DivBloc");
    if (elt) {
      const eltId = elt.id;
      switch (this.modePliage) {
        case EModePliage.blocEntier:
          selecteur = eltId;
          vitesse = "slow";
          break;
        case EModePliage.contenu:
          selecteur = eltId + " .elementPliable";
          vitesse = "fast";
          break;
      }
      elt.setAttribute("tabindex", elt.tabIndex === 0 ? -1 : 0);
      const contexte = this;
      $("#" + selecteur).slideToggle(vitesse, "linear", () => {
        customResize.call(contexte);
      });
    }
  }
  getGestionnaireDElement(aElement) {
    for (let i = 0, lNbr = this.gestionnairesBlocs.length; i < lNbr; i++) {
      if (
        this.gestionnairesBlocs[i] &&
        this.gestionnairesBlocs[i].saisGererBloc(aElement)
      ) {
        return this.gestionnairesBlocs[i];
      }
    }
    return null;
  }
  composeElementTimeline(aElement) {
    const lGestionnaire = this.getGestionnaireDElement(aElement);
    if (lGestionnaire !== null) {
      return lGestionnaire.composeBlocComplet(aElement);
    }
  }
}
function calculerHauteurFreres(aDiv) {
  let hauteurFreres = 0;
  const freres = aDiv.siblings();
  let lAuMoinsUnVisible = false;
  freres.each(function (i) {
    if ($(this).css("display") !== "none" || lAuMoinsUnVisible) {
      lAuMoinsUnVisible = true;
    }
    hauteurFreres +=
      ($(this).css("display") !== "inline-block" || i === 0) &&
      $(this).css("display") !== "none"
        ? $(this).height()
        : 0;
  });
  hauteurFreres = hauteurFreres * (lAuMoinsUnVisible ? 1 : 0);
  return hauteurFreres;
}
function getDateLaPlusProche(aDate) {
  let lIndiceEvenement = -1;
  if (!!this.listeEvenements && this.listeEvenements.count() > 0) {
    let min = 365;
    for (let i = 0; i < this.listeEvenements.count(); i++) {
      if (
        Math.abs(
          GDate.getNbrJoursEntreDeuxDates(
            this.listeEvenements.get(i).DateDebut,
            aDate,
          ),
        ) <= min
      ) {
        min = Math.abs(
          GDate.getNbrJoursEntreDeuxDates(
            this.listeEvenements.get(i).DateDebut,
            aDate,
          ),
        );
        lIndiceEvenement = i;
        if (min === 0) {
          break;
        }
      }
    }
  }
  return lIndiceEvenement >= 0
    ? this.listeEvenements.get(lIndiceEvenement).DateDebut
    : null;
}
function customResize() {}
module.exports = { ObjetTimeline };
