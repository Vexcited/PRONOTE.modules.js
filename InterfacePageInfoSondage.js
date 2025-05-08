const { EGenreEvntActu } = require("EGenreEvntActu.js");
const {
  InterfaceConsultInfoSondage,
} = require("InterfaceConsultInfoSondage.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GPosition } = require("ObjetPosition.js");
const { GUID } = require("GUID.js");
const { DonneesListe_InfosSond } = require("DonneesListe_InfosSond.js");
const {
  DonneesListeTypesAccesInfoSond,
} = require("DonneesListeTypesAccesInfoSond.js");
const { GDate } = require("ObjetDate.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { InterfacePageCP } = require("ObjetInterfacePageCP.js");
const { EEvent } = require("Enumere_Event.js");
const { tag } = require("tag.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { SyntheseVocale } = require("UtilitaireSyntheseVocale.js");
class InterfacePageInfoSondage extends InterfacePageCP {
  constructor(...aParams) {
    super(...aParams);
    this.ajouterEvenementGlobal(EEvent.SurPostResize, this._surPostResize);
    this.genresAffichages = { reception: 0, saisie: 1, modeles: 2 };
    this.filtreModeItem = null;
    this.genreAff = this.genresAffichages.reception;
    this.uniquementNonLues = GEtatUtilisateur.getUniquementNonLues();
    this.modeAuteur = false;
    this.hauteurZoneCommandesDiffusion = IE.estMobile ? 0 : 80;
    this.setOptionsInfoSondage();
    this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
    this.contexte = $.extend(this.contexte, {
      ecran: [
        InterfacePageInfoSondage.genreEcran.listeBlocs,
        InterfacePageInfoSondage.genreEcran.visuBloc,
      ],
      avecMsgAucun: true,
      selectionCouranteModeReception: null,
      selectionCouranteModeDiffusion: null,
    });
    if (!this.avecAuteur) {
      this.contexte = $.extend(this.contexte, { niveauCourant: 0 });
    }
    if (this.avecFiltreCategorie) {
      this.categorie = GEtatUtilisateur.getCategorie();
    }
    this.ids = { msgAucun: GUID.getId() };
    this.typeSelectionne = null;
  }
  evntRetourEcranPrec() {
    switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
      case InterfacePageInfoSondage.genreEcran.visuBloc:
        this.selectionCouranteModeReception = null;
        this.selectionCouranteModeDiffusion = null;
        this.revenirSurEcranPrecedent();
        break;
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnRetourEcranPrec: {
        event: function () {
          this.evntRetourEcranPrec();
        }.bind(aInstance),
      },
      comboFiltreCategories: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            longueur: 200,
            hauteur: 16,
            hauteurLigneDefault: 16,
            labelWAICellule: GTraductions.getValeur("actualites.Categorie"),
          });
        },
        getDonnees: function () {
          if (
            aInstance.listeCategories !== null &&
            aInstance.listeCategories !== undefined
          ) {
            return aInstance.listeCategories;
          }
        },
        getIndiceSelection: function () {
          const lIndice = GEtatUtilisateur.getCategorie()
            ? aInstance.listeCategories.getIndiceParElement(
                GEtatUtilisateur.getCategorie(),
              )
            : 0;
          return lIndice;
        },
        event: function (aParametres, aInstanceCombo) {
          if (
            aParametres.genreEvenement ===
              EGenreEvenementObjetSaisie.selection &&
            aParametres.element &&
            aInstanceCombo.estUneInteractionUtilisateur()
          ) {
            _evntSurCategorie.call(
              aInstance,
              aParametres.genreEvenement,
              aParametres.element,
            );
          }
        },
      },
      estVisibleCbUniquementNonLues: function () {
        return aInstance.estGenreReception();
      },
      checkUniquementNonLues: {
        getValue: function () {
          return aInstance.uniquementNonLues;
        },
        setValue: function (aValeur) {
          aInstance.uniquementNonLues = aValeur;
          if (!aInstance.modeAuteur) {
            GEtatUtilisateur.setUniquementNonLues(aInstance.uniquementNonLues);
          }
          aInstance._jetonReinitScrollListeInfosSond = true;
          aInstance.afficherSelonFiltres();
        },
      },
      selecteurTypesAccesInfosSond: {
        event: aInstance.afficherFenetreListeTypesInfoSond.bind(aInstance),
        getLibelle() {
          let lLibelle = "";
          if (aInstance.typeSelectionne) {
            lLibelle = aInstance.typeSelectionne.getLibelle();
          }
          return lLibelle;
        },
        getIcone() {
          let lIcone = "";
          if (aInstance.typeSelectionne) {
            lIcone = tag("i", { class: aInstance.typeSelectionne.icone });
          }
          return lIcone;
        },
      },
    });
  }
  construireInstances() {
    this.identVisuInfoSondage = this.add(
      InterfaceConsultInfoSondage,
      _evntVisuInfoSond.bind(this),
      _initVisuInfoSond.bind(this),
    );
    this.identListeInfosSond = this.add(ObjetListe, this.evntSurListeInfoSond);
    if (this.avecAuteur) {
      this.identListeTypesAccesInfosSond = this.add(
        ObjetListe,
        this.evntSurListeTypeAccesInfoSond,
        this.initListeTypeAccesInfoSond,
      );
    }
    if (this.avecAuteur && this.droitSaisie) {
      this.identEditionInfoSond = this.instancierEditionInfoSond();
    }
  }
  initListeTypeAccesInfoSond(aInstance) {
    aInstance.setOptionsListe({
      labelWAI: GTraductions.getValeur("infoSond.Categories"),
      avecLigneCreation: false,
    });
  }
  declencherActionsAutoSurNavigation() {}
  getGenreAffichageSelonTypeAcces() {}
  estModeAffDiffusion(aModeAff) {
    return aModeAff === this.genresAffichages.saisie;
  }
  initEcranTypeAccesInfoSond() {
    if (!this.avecAuteur) {
      return;
    }
    const lSelectionParDefault = () => {
      let lTypeSelectionCourante;
      if (this.typeSelectionne === null || this.typeSelectionne === undefined) {
        lTypeSelectionCourante = this.getTypeInfoSondParDefaut();
      } else {
        lTypeSelectionCourante = this.typeSelectionne.getGenre();
      }
      const lDataSelection = this.getItemDeType(lTypeSelectionCourante);
      if (lDataSelection !== null && lDataSelection !== undefined) {
        this.typeSelectionne = lDataSelection;
        this.surSelectionTypeAccesInfoSond(lDataSelection);
      }
    };
    if (this.optionsEcrans.avecBascule) {
      lSelectionParDefault();
      return;
    }
    new Promise((aResolve) => {
      this.afficherListeTypesInfoSond();
      aResolve();
    }).then(lSelectionParDefault);
  }
  getItemDeType(aType) {
    if (!this.avecAuteur) {
      return;
    }
    const lDonneesDeLaListe = this.optionsEcrans.avecBascule
      ? this.getListeDonneesTypesInfoSond()
      : this.getInstance(this.identListeTypesAccesInfosSond).getListeArticles();
    return lDonneesDeLaListe.getElementParGenre(aType);
  }
  surSelectionTypeAccesInfoSond(aArticleTypeAccesInfoSond) {
    this.selectionnerTypeAccesInfoSond({
      selection: aArticleTypeAccesInfoSond,
    });
    const lGenreAff = this.getGenreAffichageSelonTypeAcces(
      aArticleTypeAccesInfoSond.getGenre(),
    );
    this.filtreModeItem = aArticleTypeAccesInfoSond.getGenre();
    new Promise((aResolve) => {
      this.genreAff = lGenreAff;
      this.modeAuteur =
        this.avecAuteur && (this.estGenreDiffusion() || this.estGenreModeles());
      this.formatterDataSurBasculeModeAff(lGenreAff, this.filtreModeItem);
      aResolve();
    }).then(() => {
      const lEcranDest = {
        niveauEcran: 0,
        genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
      };
      this.basculerEcran(null, lEcranDest);
      this.declencherActionsAutoSurNavigation();
    });
  }
  evntSurListeTypeAccesInfoSond(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.Selection:
        this._jetonReinitScrollListeInfosSond = true;
        this.surSelectionTypeAccesInfoSond(aParametres.article);
        break;
    }
  }
  getAvecBtnNouveau() {
    return this.droitSaisie;
  }
  initListeInfosSond(aInstance) {
    aInstance.setOptionsListe({
      avecLigneCreation: this.getAvecBtnNouveau(),
      nonEditableSurModeExclusif: true,
    });
  }
  evntSurListeInfoSond(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.Selection:
        this.surSelectionInfoSondage({ infoSondage: aParametres.article });
        break;
      case EGenreEvenementListe.Creation:
        if (!IE.estMobile) {
          const lPosBtn = GPosition.getClientRect(aParametres.nodeBouton);
          ObjetMenuContextuel.afficher({
            pere: this,
            id: { x: lPosBtn.left, y: lPosBtn.bottom + 10 },
            initCommandes: function (aMenu) {
              const lEstModeModele = this.estGenreModeles();
              if (!lEstModeModele) {
                aMenu.add(
                  GTraductions.getValeur("actualites.creerInfo"),
                  true,
                  () => {
                    this.evntBtnCreerActuInfo();
                  },
                  { icon: "icon_diffuser_information" },
                );
                aMenu.add(
                  GTraductions.getValeur("actualites.creerSondage"),
                  true,
                  () => {
                    this.evntBtnCreerActuSondage();
                  },
                  { icon: "icon_diffuser_sondage" },
                );
              } else {
                if (this.avecModeles) {
                  aMenu.add(
                    GTraductions.getValeur("actualites.nouveauModele"),
                    true,
                    () => {
                      this.evntBtnCreerModele({
                        estInfo: this.estModeItemDeTypeInfo(),
                      });
                    },
                    { icon: "icon_sondage_bibliotheque" },
                  );
                  if (!IE.estMobile && this.estModeItemDeTypeSondage()) {
                    aMenu.add(
                      GTraductions.getValeur(
                        "actualites.importerModeleSondage",
                      ),
                      this.droitSaisie,
                      () => {
                        this.evntImportModele();
                      },
                      { icon: "icon_download_alt" },
                    );
                  }
                }
              }
            },
          });
        } else {
          this.evntBtnCreerActuInfo();
        }
        break;
    }
  }
  instancierEditionInfoSond() {}
  estModeItemDeTypeInfo() {
    return false;
  }
  estModeItemDeTypeSondage() {
    return false;
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identPage;
    this.AddSurZone = [];
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div class="InterfacePageInfoSondage">');
    const lHauteurADeduire = 0;
    H.push(
      '<div class="ecrans ',
      this.optionsEcrans.avecBascule ? "mono" : "multi",
      '" style="height:calc(100% - ',
      lHauteurADeduire,
      'px)">',
    );
    if (this.avecAuteur && !this.optionsEcrans.avecBascule) {
      H.push('<div class="nav multi">');
      H.push(
        '<div id="',
        this.getInstance(this.identListeTypesAccesInfosSond).getNom(),
        '" style="height:100%;"></div>',
      );
      H.push("</div>");
    }
    H.push(
      '<section class="section ',
      this.optionsEcrans.avecBascule ? "mono" : "multi",
      '" style="height:100%" id="',
      this.getIdDeNiveau({ niveauEcran: 0 }),
      '">',
    );
    H.push(
      '<div id="',
      this.getInstance(this.identListeInfosSond).getNom(),
      '" style="height:100%;"></div>',
    );
    H.push("</section>");
    H.push(
      '<aside class="aside ',
      this.optionsEcrans.avecBascule ? "mono" : "multi",
      '" id="',
      this.getIdDeNiveau({ niveauEcran: 1 }),
      '">',
    );
    H.push(
      '<div class="',
      this.optionsEcrans.avecBascule ? "ecran-visu" : "",
      '" id="',
      this.getInstance(this.identVisuInfoSondage).getNom(),
      '" ></div>',
    );
    H.push("</aside>");
    H.push("</div>");
    H.push("</div>");
    return H.join("");
  }
  actualiserDonnees() {}
  recupererDonnees() {
    this.actualiserDonnees();
  }
  composeFiltreCategories() {
    return {
      html: '<ie-combo ie-model="comboFiltreCategories" class="combo-classic"></ie-combo>',
      controleur: this.controleur,
    };
  }
  composeCheckboxUniquementNonLues() {
    return {
      html:
        '<ie-checkbox ie-textleft ie-display="estVisibleCbUniquementNonLues" ie-model="checkUniquementNonLues">' +
        GTraductions.getValeur("actualites.UniquementNonLues") +
        "</ie-checkbox>",
      controleur: this.controleur,
    };
  }
  construireEcran(aEcran) {
    switch (aEcran.genreEcran) {
      case InterfacePageInfoSondage.genreEcran.listeBlocs:
        return new Promise((aResolve) => {
          if (this.optionsEcrans.avecBascule) {
            let lHtmlBandeau = "";
            if (this.avecAuteur) {
              lHtmlBandeau = this.construireBandeauEcranListeInfoSondage();
            }
            this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
          }
          this.afficherSelonFiltres();
          aResolve();
        });
      case InterfacePageInfoSondage.genreEcran.visuBloc:
        return new Promise((aResolve) => {
          if (this.optionsEcrans.avecBascule) {
            const lHtmlBandeau = this.construireBandeauEcranVisuInfoSondage();
            this.setHtmlStructureAffichageBandeau(lHtmlBandeau);
          }
          _initVisuInfoSond.call(
            this,
            this.getInstance(this.identVisuInfoSondage),
          );
          this.getInstance(this.identVisuInfoSondage).setUtilitaires(
            this.utilitaires,
          );
          this.getInstance(this.identVisuInfoSondage).setDonnees({
            actualite: this.getCtxSelection({ niveauEcran: 0 }),
            avecMsgAucun: this.contexte.avecMsgAucun,
          });
          aResolve();
        });
      default:
    }
  }
  afficherVisuInfoSondage() {
    const lEcranSrc = {
      niveauEcran: 1,
      genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
      dataEcran: this.getCtxSelection({ niveauEcran: 0 }),
    };
    const lEcranDest = {
      niveauEcran: 1,
      genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
    };
    this.basculerEcran(lEcranSrc, lEcranDest);
  }
  construireBandeauEcranListeInfoSondage() {
    const H = [];
    if (this.avecAuteur && this.optionsEcrans.avecBascule) {
      H.push(
        tag("ie-btnselecteur", {
          "ie-model": "selecteurTypesAccesInfosSond",
          "aria-label": GTraductions.getValeur("WAI.SelectionRubrique"),
        }),
      );
    }
    return H.join();
  }
  construireBandeauEcranVisuInfoSondage() {
    const lActu = this.getCtxSelection({ niveauEcran: 0 });
    const H = [];
    const lStr = lActu.estSondage
      ? GTraductions.getValeur(
          "infoSond.sondageDu",
          GDate.formatDate(lActu.dateDebut, "%JJ %MMM"),
        )
      : GTraductions.getValeur(
          "infoSond.infoDu",
          GDate.formatDate(lActu.dateDebut, "%JJ %MMM"),
        );
    H.push('<h3 class="titre">', lStr, "</h3>");
    return this.construireBandeauEcran(H.join(""), { bgWhite: true });
  }
  deselectionnerContexte() {
    const lDataSelection = this.getCtxSelection({ niveauEcran: 0 });
    if (lDataSelection !== null && lDataSelection !== undefined) {
      if (!this.optionsEcrans.avecBascule) {
        lDataSelection.estSelectionne = false;
      }
      this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
    }
  }
  afficherSelectionDansListeTypeAcces(aSelection) {
    if (!this.avecAuteur) {
      return;
    }
    const lListe = this.getInstance(this.identListeTypesAccesInfosSond);
    const lListeElts = lListe.getListeArticles();
    if (lListeElts !== null && lListeElts !== undefined) {
      const lIndice = lListeElts.getIndiceElementParFiltre((D) => {
        return D.getNumero() === aSelection.getNumero();
      });
      if (lIndice !== null && lIndice !== undefined) {
        this.getInstance(this.identListeTypesAccesInfosSond).selectionnerLigne({
          ligne: lIndice,
          avecScroll: true,
          avecEvenement: false,
        });
      }
    }
  }
  afficherSelectionDansListeInfosSond(aSelection) {
    const lListe = this.getInstance(this.identListeInfosSond);
    const lListeElts = lListe.getListeArticles();
    if (lListeElts !== null && lListeElts !== undefined) {
      const lIndice = lListeElts.getIndiceElementParFiltre((D) => {
        return (
          D.getNumero() === aSelection.getNumero() &&
          (this.modeAuteur === true ||
            (D.public !== null &&
              D.public !== undefined &&
              aSelection.public !== null &&
              aSelection !== undefined &&
              D.public.getNumero() === aSelection.public.getNumero()))
        );
      });
      if (lIndice !== null && lIndice !== undefined) {
        this.getInstance(this.identListeInfosSond).selectionnerLigne({
          ligne: lIndice,
          avecScroll: true,
          avecEvenement: false,
        });
      }
    }
  }
  selectionnerTypeAccesInfoSond(aParam) {
    this.typeSelectionne = aParam.selection;
    if (!this.optionsEcrans.avecBascule) {
      this.marquerSelectionTypeAccesInfoSond();
    }
  }
  marquerSelectionTypeAccesInfoSond() {
    const lSelection = this.typeSelectionne;
    if (lSelection !== null && lSelection !== undefined) {
      lSelection.estSelectionne = true;
      this.afficherSelectionDansListeTypeAcces(lSelection);
    }
  }
  selectionnerInfoSond(aParam) {
    this.setCtxSelection({ niveauEcran: 0, dataEcran: aParam.infoSondage });
    if (!this.optionsEcrans.avecBascule) {
      const lSelection = this.getCtxSelection({ niveauEcran: 0 });
      if (lSelection !== null && lSelection !== undefined) {
        lSelection.estSelectionne = true;
        this.afficherSelectionDansListeInfosSond(lSelection);
      }
    }
    if (this.modeAuteur) {
      this.contexte.selectionCouranteModeDiffusion = aParam.infoSondage;
    } else {
      this.contexte.selectionCouranteModeReception = aParam.infoSondage;
    }
  }
  surSelectionInfoSondage(aParam) {
    this.deselectionnerContexte();
    this.selectionnerInfoSond(aParam);
    this.afficherVisuInfoSondage();
  }
  reInitCtxSelection(aParam) {
    this.deselectionnerContexte();
    this.contexte.avecMsgAucun = aParam.avecMsgAucun;
    if (!this.optionsEcrans.avecBascule) {
      this.afficherVisuInfoSondage();
    }
  }
  revenirSurEcranPrecedent() {
    if (IE.estMobile) {
      SyntheseVocale.forcerArretLecture();
    }
    if (
      this.getCtxEcran(this.contexte.niveauCourant) ===
      InterfacePageInfoSondage.genreEcran.visuBloc
    ) {
      const lData = this.getCtxSelection({ niveauEcran: 0 });
      const lEstCtxDiffusion = this.modeAuteur === true;
      if (
        IE.estMobile &&
        !lData.lue &&
        !lEstCtxDiffusion &&
        !GApplication.getModeExclusif()
      ) {
        lData.lue = !lData.lue;
        lData.marqueLueSeulement = true;
        this.evntSurValidationInfoSond(
          lData,
          EGenreEvntActu.SurValidationDirecte,
          { avecRecupDonnees: true },
        );
        return;
      }
    }
    super.revenirSurEcranPrecedent();
  }
  setOptionsActus(aOptions) {
    this.avecAuteur = aOptions.avecAuteur;
    this.forcerAR = aOptions.forcerAR;
    this.avecSondageAnonyme = aOptions.avecSondageAnonyme;
    this.droitSaisie = aOptions.droitSaisie;
    this.droitPublicationPageEtablissement =
      aOptions.droitPublicationPageEtablissement;
    this.avecModeles = aOptions.avecModeles;
    this.avecFiltreCategorie = aOptions.avecFiltreCategorie;
  }
  setOptionsInfoSondage() {
    const lDefault = {
      avecAuteur: false,
      avecFiltreCategorie: false,
      forcerAR: false,
      avecSondageAnonyme: false,
      droitSaisie: false,
      avecModeles: false,
    };
    const lParam = {
      avecAuteur: this.getAvecAuteur(),
      droitSaisie: this.getAvecDroitSaisie(),
      droitPublicationPageEtablissement:
        this.getDroitPublicationPageEtablissement(),
      forcerAR: this.getForcerAR(),
      avecSondageAnonyme: this.getAvecSondageAnonyme(),
      avecFiltreCategorie: this.getAvecFiltreCategorie(),
      avecModeles: this.getAvecModeles(),
    };
    this.setOptionsActus($.extend(lDefault, lParam));
  }
  getDroitPublicationPageEtablissement() {
    return false;
  }
  getAvecFiltreCategorie() {
    return false;
  }
  getTypeSelectionne() {
    return this.typeSelectionne;
  }
  setTypeSelectionnne(aType) {
    this.typeSelectionne = aType;
    return this;
  }
  getAvecModeles() {
    return false;
  }
  initDataInfoSondSurEdition() {}
  evntBtnCreerActuInfo() {
    if (this.getInstance(this.identEditionInfoSond)) {
      this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
        titre: GTraductions.getValeur("actualites.creerInfo"),
      });
      this.getInstance(this.identEditionInfoSond).setDonnees(
        this.initDataInfoSondSurEdition({
          estCreation: true,
          estInfo: true,
          avecRecupModele: this.avecModeles,
        }),
      );
    }
  }
  evntBtnCreerActuSondage() {
    if (this.getInstance(this.identEditionInfoSond)) {
      this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
        titre: GTraductions.getValeur("actualites.creerSondage"),
      });
      this.getInstance(this.identEditionInfoSond).setDonnees(
        this.initDataInfoSondSurEdition({
          estCreation: true,
          estInfo: false,
          avecRecupModele: this.avecModeles,
        }),
      );
    }
  }
  evntBtnCreerModele(aParam) {
    if (this.getInstance(this.identEditionInfoSond)) {
      this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
        titre: GTraductions.getValeur("actualites.creerModele"),
      });
      this.getInstance(this.identEditionInfoSond).setDonnees(
        this.initDataInfoSondSurEdition({
          estCreation: true,
          estInfo: aParam.estInfo,
          estModele: true,
        }),
      );
    }
  }
  evntImportModele() {}
  initFenetreEditionInfoSond(aInstance) {
    aInstance.setOptionsFenetre({
      titre: "",
      largeur: 950,
      hauteur: 660,
      listeBoutons: [
        {
          libelle: GTraductions.getValeur("Annuler"),
          theme: TypeThemeBouton.secondaire,
        },
        {
          libelle: GTraductions.getValeur("Valider"),
          theme: TypeThemeBouton.primaire,
        },
      ],
    });
    aInstance.avecEtatSaisie = false;
    if (aInstance.setUtilitaires) {
      aInstance.setUtilitaires(this.utilitaires);
    }
  }
  eltSelectionPrecedenteRetrouveDansListe(aParam) {
    let lEltARetrouver;
    let lResult = null;
    const lEstCtxDiffusion = this.modeAuteur === true;
    if (lEstCtxDiffusion) {
      lEltARetrouver = this.contexte.selectionCouranteModeDiffusion;
    } else {
      lEltARetrouver = this.contexte.selectionCouranteModeReception;
    }
    if (lEltARetrouver !== null && lEltARetrouver !== undefined) {
      const lListe = aParam.liste;
      const lListeResult = lListe.getListeElements((D) => {
        return (
          D.getNumero() === lEltARetrouver.getNumero() &&
          (lEstCtxDiffusion ||
            (D.public !== null &&
              D.public !== undefined &&
              lEltARetrouver.public !== null &&
              lEltARetrouver.public !== undefined &&
              D.public.getNumero() === lEltARetrouver.public.getNumero()))
        );
      });
      if (lListeResult.count() === 1) {
        lResult = lListeResult.get(0);
      }
    }
    return lResult;
  }
  initContexteSelection(aListeFiltree) {
    const lListeNonVide = aListeFiltree.count() > 0;
    if (lListeNonVide) {
      const lEstCasRedirectionDepuisWidget =
        GEtatUtilisateur.getInfoSond !== null &&
        GEtatUtilisateur.getInfoSond !== undefined
          ? GEtatUtilisateur.getInfoSond() !== null &&
            GEtatUtilisateur.getInfoSond() !== undefined
          : false;
      const lEstCtxDiffusion = this.modeAuteur === true;
      if (lEstCasRedirectionDepuisWidget && !lEstCtxDiffusion) {
        this.contexte.selectionCouranteModeReception =
          GEtatUtilisateur.getInfoSond();
        GEtatUtilisateur.setInfoSond(null);
      }
      if (
        !this.optionsEcrans.avecBascule ||
        (lEstCasRedirectionDepuisWidget && !lEstCtxDiffusion)
      ) {
        const lEltASelectionner = this.eltSelectionPrecedenteRetrouveDansListe({
          liste: aListeFiltree,
        });
        if (lEltASelectionner !== null && lEltASelectionner !== undefined) {
          this.surSelectionInfoSondage({ infoSondage: lEltASelectionner });
        } else {
          this.reInitCtxSelection({ avecMsgAucun: lListeNonVide });
        }
      } else {
        this.reInitCtxSelection({ avecMsgAucun: lListeNonVide });
      }
    } else {
      this.reInitCtxSelection({ avecMsgAucun: lListeNonVide });
    }
  }
  getOptionsInfoSond() {
    return {};
  }
  getListeDonneesTypesInfoSond() {}
  afficherListeTypesInfoSond() {
    if (!this.avecAuteur) {
      return;
    }
    this.getInstance(this.identListeTypesAccesInfosSond).setOptionsListe({
      skin: ObjetListe.skin.flatDesign,
      avecOmbreDroite: true,
    });
    this.getInstance(this.identListeTypesAccesInfosSond).setDonnees(
      new DonneesListeTypesAccesInfoSond(
        this.getListeDonneesTypesInfoSond(),
      ).setOptions({
        avecEvnt_Selection: true,
        avecTri: false,
        flatDesignMinimal: true,
        avecBoutonActionLigne: false,
      }),
    );
  }
  afficherFenetreListeTypesInfoSond() {
    const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
      pere: this,
      evenement(aNumeroBouton, aSelection) {
        if (aNumeroBouton === 1) {
          this._jetonReinitScrollListeInfosSond = true;
          const lSelection =
            this.getListeDonneesTypesInfoSond().get(aSelection);
          this.surSelectionTypeAccesInfoSond(lSelection);
        }
      },
      initialiser(aFenetre) {
        aFenetre.setOptionsFenetre({
          titre: GTraductions.getValeur("infoSond.Categories"),
        });
        aFenetre.paramsListe = {
          optionsListe: {
            labelWAI: GTraductions.getValeur("infoSond.Categories"),
            skin: ObjetListe.skin.flatDesign,
          },
        };
      },
    });
    lFenetre.setDonnees(
      new DonneesListeTypesAccesInfoSond(
        this.getListeDonneesTypesInfoSond(),
      ).setOptions({
        avecEvnt_Selection: true,
        avecTri: false,
        flatDesignMinimal: true,
        avecBoutonActionLigne: false,
      }),
      true,
    );
  }
  afficherListeInfoSond(aListeFiltree) {
    const lFiltres = [];
    lFiltres.push(this.composeCheckboxUniquementNonLues());
    if (this.avecFiltreCategorie) {
      lFiltres.push(this.composeFiltreCategories());
    }
    lFiltres.push({ genre: ObjetListe.typeBouton.rechercher });
    const lListe = this.getInstance(this.identListeInfosSond);
    lListe.setOptionsListe({
      skin: ObjetListe.skin.flatDesign,
      avecOmbreDroite: true,
      boutons: lFiltres,
      messageContenuVide: this.composeMessage(
        this.estGenreModeles()
          ? GTraductions.getValeur("infoSond.msgAucunModele")
          : GTraductions.getValeur("infoSond.msgAucun"),
      ),
    });
    const lOptions = this.getOptionsInfoSond();
    const lConserverPositionScroll =
      this._jetonReinitScrollListeInfosSond !== true;
    lListe.setDonnees(
      new DonneesListe_InfosSond(
        aListeFiltree,
        lOptions,
        this.utilitaires,
      ).setOptions({ avecEvnt_Selection: true, avecTri: false }),
      null,
      { conserverPositionScroll: lConserverPositionScroll },
    );
    if (
      MethodesObjet.isNumber(this._jetonReinitScrollListeInfosSond) &&
      this._jetonReinitScrollListeInfosSond > 0
    ) {
      lListe.setPositionScrollV(this._jetonReinitScrollListeInfosSond);
      delete this._jetonReinitScrollListeInfosSond;
    }
  }
  afficherSelonFiltres() {
    if (!this.listeActualites) {
      return;
    }
    this.marquerSelectionTypeAccesInfoSond();
    const lListeFiltree = this.getListeFiltree();
    this.afficherListeInfoSond(lListeFiltree);
    this.initContexteSelection(lListeFiltree);
  }
  estGenreReception() {
    return this.genreAff === this.genresAffichages.reception;
  }
  estGenreDiffusion() {
    return this.genreAff === this.genresAffichages.saisie;
  }
  estGenreModeles() {
    return this.genreAff === this.genresAffichages.modeles;
  }
  _surPostResize() {
    this.afficherSelonFiltres();
  }
}
InterfacePageInfoSondage.genreEcran = {
  listeBlocs: "listeBlocs",
  visuBloc: "visuBloc",
};
function _evntSurCategorie(aGenreEvenement, aCategorie) {
  if (aGenreEvenement === EGenreEvenementObjetSaisie.selection) {
    this.categorie = aCategorie;
    GEtatUtilisateur.setCategorie(this.categorie);
    this._jetonReinitScrollListeInfosSond = true;
    this.afficherSelonFiltres();
  }
}
function _initVisuInfoSond(aInstance) {
  aInstance.setOptions(this.getOptionsInfoSond());
}
function _evntVisuInfoSond(aActu, aGenreEvnt, aParam) {
  switch (aGenreEvnt) {
    case EGenreEvntActu.SurMenuCtxActu:
      this.evntSurValidationInfoSond(aActu, aGenreEvnt, aParam);
      break;
    case EGenreEvntActu.SurAnnulationSondage:
      SyntheseVocale.forcerArretLecture();
      this.selectionCouranteModeReception = null;
      this.selectionCouranteModeDiffusion = null;
      this.revenirSurEcranPrecedent();
      this.actualiserDonnees();
      break;
    case EGenreEvntActu.SurAR:
    case EGenreEvntActu.SurValidationSondage:
      SyntheseVocale.forcerArretLecture();
      this.evntSurValidationInfoSond(aActu, aGenreEvnt, aParam);
      break;
    case EGenreEvntActu.SurVoirResultats:
      this.evntSurAfficherResultats(aActu);
      break;
    default:
      break;
  }
}
module.exports = { InterfacePageInfoSondage };
