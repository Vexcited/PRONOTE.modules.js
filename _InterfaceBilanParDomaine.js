const { GChaine } = require("ObjetChaine.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_BilanParDomaine,
} = require("DonneesListe_BilanParDomaine.js");
const {
  DonneesListe_BilanParDomaineLVE,
} = require("DonneesListe_BilanParDomaineLVE.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { InterfacePage } = require("InterfacePage.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
  ObjetRequeteBilanParDomaine,
} = require("ObjetRequeteBilanParDomaine.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetFenetre_DetailEvaluationsCompetences,
} = require("ObjetFenetre_DetailEvaluationsCompetences.js");
const {
  ObjetRequeteDetailEvaluationsCompetences,
} = require("ObjetRequeteDetailEvaluationsCompetences.js");
class _InterfaceBilanParDomaine extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.donnees = {
      relationElevePilier: {
        libellePilierPalier: "",
        niveauDAcquisition: null,
        dateAcquisition: null,
        observations: "",
      },
      estDansLEtablissement: true,
      droitSaisie: false,
      listeCompetences: null,
      estPalierDeNiveauEcole: false,
      estPalierDeNiveauCollege: false,
      legende: {
        contientAuMoinsUnElemGrilleMM: false,
        couleurGrilleMM: "blue",
      },
    };
    this.filtresListe = {
      listeEnsembleEvaluations: null,
      ensembleEvaluationsSelectionne: null,
      uniquementElementsEvalues: false,
    };
    this.ids = {
      pageMessage: this.Nom + "_message",
      pageListe: this.Nom + "_liste",
      entete: this.Nom + "_entete",
    };
    this.parametres = { heightPied: 80 };
  }
  construireInstances() {
    this.identListeBilanDomaine = this.add(
      ObjetListe,
      this._surEvenementListeBilanDomaine,
    );
    this.identFenetreDetailEvaluations = this.addFenetre(
      ObjetFenetre_DetailEvaluationsCompetences,
      null,
      _initFenetreDetailEvaluations,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListeBilanDomaine;
    this.GenreStructure = EStructureAffichage.Autre;
    this.avecBandeau = true;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      lesFiltresDeListeSontVisibles: function () {
        const lListeEleves = aInstance.getListeEleves();
        return (
          !aInstance.estAffichageListeLVE() &&
          !!lListeEleves &&
          lListeEleves.count() === 1
        );
      },
      comboFiltreEnsembleEvaluations: {
        init: function (aCombo) {
          aCombo.setOptionsObjetSaisie({
            longueur: 170,
            hauteur: 16,
            hauteurLigneDefault: 16,
            labelWAICellule: GTraductions.getValeur(
              "WAI.listeSelectionEvaluation",
            ),
          });
        },
        getDonnees: function (aDonnees) {
          if (!aDonnees) {
            return aInstance.filtresListe.listeEnsembleEvaluations;
          }
        },
        getIndiceSelection: function () {
          let lIndice = 0;
          if (
            !!aInstance.filtresListe.ensembleEvaluationsSelectionne &&
            !!aInstance.filtresListe.listeEnsembleEvaluations &&
            aInstance.filtresListe.listeEnsembleEvaluations.count() > 0
          ) {
            lIndice =
              aInstance.filtresListe.listeEnsembleEvaluations.getIndiceElementParFiltre(
                (D) => {
                  return (
                    D.valeurFiltre ===
                    aInstance.filtresListe.ensembleEvaluationsSelectionne
                      .valeurFiltre
                  );
                },
              );
          }
          return Math.max(lIndice, 0);
        },
        event: function (aParametres) {
          if (
            aParametres.genreEvenement ===
              EGenreEvenementObjetSaisie.selection &&
            !!aParametres.element &&
            !!aInstance.filtresListe.ensembleEvaluationsSelectionne &&
            aInstance.filtresListe.ensembleEvaluationsSelectionne
              .valeurFiltre !== aParametres.element.valeurFiltre
          ) {
            aInstance.filtresListe.ensembleEvaluationsSelectionne =
              aParametres.element;
            if (aInstance.getEtatSaisie() === true) {
              ControleSaisieEvenement(aInstance.afficherPage.bind(aInstance));
            } else {
              aInstance.afficherPage();
            }
          }
        },
      },
      cbFiltreElementsEvalues: {
        getValue: function () {
          return aInstance.filtresListe.uniquementElementsEvalues;
        },
        setValue: function () {
          aInstance.filtresListe.uniquementElementsEvalues =
            !aInstance.filtresListe.uniquementElementsEvalues;
          if (aInstance.getEtatSaisie() === true) {
            ControleSaisieEvenement(aInstance.afficherPage.bind(aInstance));
          } else {
            aInstance.afficherPage();
          }
        },
      },
      getVisibiliteLegendeListe: function () {
        return aInstance._avecAffichageLegendeListe();
      },
      getHtmlLegendeListe: function () {
        const H = [];
        H.push(
          TUtilitaireCompetences.construitInfoActiviteLangagiere({
            avecLibelle: true,
          }),
        );
        if (!!aInstance.donnees.legende.contientAuMoinsUnElemGrilleMM) {
          H.push(" - ");
          H.push(
            '<i style="color: ',
            aInstance.donnees.legende.couleurGrilleMM,
            ';" class="icon_star" aria-hidden="true"></i>',
          );
          H.push(
            '<span class="m-left">',
            GTraductions.getValeur("competences.LegendeCompetenceGrilleMM"),
            "</span>",
          );
        }
        return H.join("");
      },
      getHtmlPied: function () {
        return aInstance._composePiedNonEditable();
      },
    });
  }
  estPilierLVESelectionne() {
    const lPilierConcerne = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Pilier,
    );
    return !!lPilierConcerne && !!lPilierConcerne.estPilierLVE;
  }
  estAffichageListeLVE() {
    return (
      GParametres.general.AvecGestionNiveauxCECRL &&
      this.estPilierLVESelectionne()
    );
  }
  getMrFichePourCalculAuto(aService) {
    let lMrFiche = null;
    if (this.donnees.estPalierDeNiveauCollege) {
      if (!aService || !aService.existeNumero()) {
        lMrFiche = GTraductions.getValeur(
          "competences.fenetreValidationAuto.MFicheAttributionNiveauCECRLDomaine1_2",
        );
      } else {
        lMrFiche = GTraductions.getValeur(
          "competences.fenetreValidationAuto.MFicheAttributionNiveauCERCLCycle4",
        );
      }
    } else if (this.donnees.estPalierDeNiveauEcole) {
      lMrFiche = GTraductions.getValeur(
        "competences.fenetreValidationAuto.MFicheAttributionNiveauCERCLCycle3",
      );
    } else {
    }
    return lMrFiche;
  }
  afficherPage() {
    const lListeEleves = this.getListeEleves();
    if (!lListeEleves || lListeEleves.count() === 0) {
      return;
    }
    const lParamsCommun = {
      palier: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Palier),
      pilier: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Pilier),
      service: this.getServiceConcerne(),
      listeEleves: lListeEleves,
      filtreEvaluation: this.filtresListe.ensembleEvaluationsSelectionne,
      filtreElementsSansEvaluation: this.filtresListe.uniquementElementsEvalues,
    };
    const lParamsSelonContexte =
      this.getParamsSupplementairesRequeteSelonContexte();
    const lParamsRequete = Object.assign(lParamsCommun, lParamsSelonContexte);
    new ObjetRequeteBilanParDomaine(
      this,
      this._reponseRequeteBilanParDomaine,
    ).lancerRequete(lParamsRequete);
  }
  getParamsSupplementairesRequeteSelonContexte() {
    return {};
  }
  getListeEleves() {}
  getServiceConcerne() {}
  _avecAffichageCoefficient() {
    return false;
  }
  _avecAffichageDateValidation() {
    return !GEtatUtilisateur.pourPrimaire();
  }
  _surEvenementListeBilanDomaineStandard() {}
  _getMethodeInitialisationMenuContextuelListeStandard() {
    return null;
  }
  _getMethodeInitialisationMenuContextuelListeLVE() {
    return null;
  }
  _avecAffichageLegendeListe() {
    return false;
  }
  _construitAddSurZoneCommun() {
    return [
      {
        html: '<ie-combo ie-model="comboFiltreEnsembleEvaluations" ie-display="lesFiltresDeListeSontVisibles"></ie-combo>',
      },
      {
        html:
          '<ie-checkbox ie-model="cbFiltreElementsEvalues" ie-display="lesFiltresDeListeSontVisibles">' +
          GTraductions.getValeur("competences.FiltrerElementsGrilleEvalues") +
          "</ie-checkbox>",
      },
    ];
  }
  _evenementAfficherMessage(AGenreMessage) {
    this.afficherBandeau(false);
    _afficherListe.call(this, false);
    const LMessage =
      typeof AGenreMessage === "number"
        ? GTraductions.getValeur("Message")[AGenreMessage]
        : AGenreMessage;
    GHtml.setHtml(this.ids.pageMessage, this.composeMessage(LMessage));
  }
  _composePiedNonEditable() {
    const H = [];
    if (!!this.donnees.relationElevePilier.observations) {
      H.push(
        "<div>",
        '<span class="Gras">',
        GChaine.insecable(
          GTraductions.getValeur("competences.bilanpardomaine.Observations") +
            " : ",
        ),
        "</span>",
        "<span>",
        this.donnees.relationElevePilier.observations,
        "</span>",
        "</div>",
      );
    }
    return H.join("");
  }
  getLibelleEntete() {
    return this.donnees.relationElevePilier.libellePilierPalier || "";
  }
  _afficherValidationDomaine() {
    return true;
  }
  _composerEntete() {
    const H = [];
    if (
      !!this.donnees.relationElevePilier.niveauDAcquisition &&
      this.donnees.relationElevePilier.niveauDAcquisition.existeNumero()
    ) {
      let lValidation = "";
      const lNiveauDAcquisition =
        GParametres.listeNiveauxDAcquisitions.getElementParNumero(
          this.donnees.relationElevePilier.niveauDAcquisition.getNumero(),
        );
      if (lNiveauDAcquisition) {
        lValidation =
          EGenreNiveauDAcquisitionUtil.getLibelle(lNiveauDAcquisition);
        if (
          TUtilitaireCompetences.estNiveauAcqui(lNiveauDAcquisition) &&
          !!this.donnees.relationElevePilier.dateAcquisition
        ) {
          lValidation +=
            " " +
            GTraductions.getValeur("Le") +
            " " +
            GDate.formatDate(
              this.donnees.relationElevePilier.dateAcquisition,
              "%JJ/%MM/%AAAA",
            );
        }
      }
      if (lValidation && this._afficherValidationDomaine()) {
        const lLibelleEntete = this.getLibelleEntete();
        H.push(
          '<div class="EspaceBas">',
          '<span class="Gras">',
          GChaine.insecable(lLibelleEntete + " : "),
          "</span>",
          "<span>",
          lValidation,
          "</span></div>",
        );
      }
    }
    return H.join("");
  }
  _construireEntete() {
    GHtml.setHtml(this.ids.entete, this._composerEntete(), { instance: this });
  }
  _surEvenementListeBilanDomaine(aParametres) {
    if (this.estAffichageListeLVE()) {
      this._surEvenementListeBilanDomaineLVE(aParametres);
    } else {
      this._surEvenementListeBilanDomaineStandard(aParametres);
    }
  }
  _surEvenementListeBilanDomaineLVE(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.SelectionClick: {
        const lListeEleves = this.getListeEleves();
        if (!!lListeEleves && lListeEleves.count() === 1) {
          const lInfoService = aParametres.instance
            .getDonneesListe()
            .getInfosService(
              aParametres.declarationColonne,
              aParametres.article,
            );
          if (
            !!lInfoService &&
            !!lInfoService.relationsESI &&
            lInfoService.relationsESI.length > 0
          ) {
            const lPilierConcerne = GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Pilier,
            );
            const lEleveConcerne = lListeEleves.getPremierElement();
            new ObjetRequeteDetailEvaluationsCompetences(
              this,
              _reponseRequeteDetailEvaluations.bind(
                this,
                lPilierConcerne,
                lEleveConcerne,
                aParametres.article,
              ),
            ).lancerRequete({
              eleve: lEleveConcerne,
              pilier: lPilierConcerne,
              periode: null,
              numRelESI: lInfoService.relationsESI,
            });
          } else {
            this.getInstance(this.identFenetreDetailEvaluations).fermer();
          }
        } else {
          this.getInstance(this.identFenetreDetailEvaluations).fermer();
        }
        break;
      }
    }
  }
  _reponseRequeteBilanParDomaine(aDonnees) {
    this.setEtatSaisie(false);
    this.donnees.relationElevePilier = {
      libellePilierPalier: aDonnees.strLibelleEnTete,
      niveauDAcquisition: aDonnees.niveauDAcquisition,
      dateAcquisition: aDonnees.date,
      observations: aDonnees.observations,
    };
    this.donnees.droitSaisie = aDonnees.droitSaisie;
    this.donnees.estDansLEtablissement = aDonnees.estDansLEtablissement;
    this.donnees.listeCompetences = aDonnees.listeCompetences;
    this.donnees.listeServicesLVE = null;
    _afficherListe.call(this, true);
    this._construireEntete();
    if (!GNavigateur.isLayoutTactile) {
      $(
        "#" + this.getInstance(this.identListeBilanDomaine).getNom().escapeJQ(),
      ).css(
        "height",
        "calc(100% - " +
          (this.parametres.heightPied + GPosition.getHeight(this.ids.entete)) +
          "px)",
      );
    }
    if (this.estAffichageListeLVE()) {
      this._traiterDonneesAffichageLVEAvecGestionCECRL(aDonnees);
    } else {
      this._traiterDonneesAffichageStandard(aDonnees);
    }
  }
  _traiterDonneesAffichageLVEAvecGestionCECRL(aDonnees) {
    this.donnees.listeServicesLVE = aDonnees.listeServicesLVE;
    this.donnees.estPalierDeNiveauEcole = !!aDonnees.estPalierDeNiveauEcole;
    this.donnees.estPalierDeNiveauCollege = !!aDonnees.estPalierDeNiveauCollege;
    this.donnees.legende.contientAuMoinsUnElemGrilleMM =
      !!aDonnees.auMoinsUnElmGrilleMMVisible;
    if (!!aDonnees.couleurGrilleMM) {
      this.donnees.legende.couleurGrilleMM = aDonnees.couleurGrilleMM;
    }
    const lListeEleves = this.getListeEleves();
    const lAvecColonnesEvaluations =
      !!lListeEleves && lListeEleves.count() === 1;
    const lInstanceListe = this.getInstance(this.identListeBilanDomaine);
    _initialiserListeBilanDomaineLVE.call(
      this,
      lInstanceListe,
      this.donnees.listeServicesLVE,
      lAvecColonnesEvaluations,
    );
    const lDonneesListe = new DonneesListe_BilanParDomaineLVE(
      this.donnees.listeCompetences,
      {
        callbackInitMenuContextuel:
          this._getMethodeInitialisationMenuContextuelListeLVE(),
        avecMarqueursSurCptProvenantGrilleMM: this._avecAffichageLegendeListe(),
        couleurs: { grilleMM: this.donnees.legende.couleurGrilleMM },
      },
    );
    lDonneesListe.setOptions({ avecMultiSelection: this.donnees.droitSaisie });
    lInstanceListe.setDonnees(lDonneesListe);
  }
  _traiterDonneesAffichageStandard(aDonnees) {
    this.filtresListe.listeEnsembleEvaluations =
      aDonnees.listeFiltreEvaluations;
    if (
      !this.filtresListe.ensembleEvaluationsSelectionne &&
      !!this.filtresListe.listeEnsembleEvaluations &&
      this.filtresListe.listeEnsembleEvaluations.count() > 0
    ) {
      this.filtresListe.ensembleEvaluationsSelectionne =
        this.filtresListe.listeEnsembleEvaluations.get(0);
    }
    _initialiserListeBilanDomaine.call(
      this,
      this.getInstance(this.identListeBilanDomaine),
    );
    const lDonneesListe = new DonneesListe_BilanParDomaine(
      this.donnees.listeCompetences,
      {
        callbackInitMenuContextuel:
          this._getMethodeInitialisationMenuContextuelListeStandard(),
      },
    );
    lDonneesListe.setOptions({ avecMultiSelection: this.donnees.droitSaisie });
    this.getInstance(this.identListeBilanDomaine).setDonnees(lDonneesListe);
  }
  construireStructureAffichageAutre() {
    const H = [];
    H.push('<div id="', this.ids.pageMessage, '" class="full-height"></div>');
    H.push(
      '<div id="',
      this.ids.pageListe,
      '" class="full-height p-all" style="display:none;">',
      '<div class="p-bottom" id="',
      this.ids.entete,
      '"></div>',
      '<div id="',
      this.getInstance(this.identListeBilanDomaine).getNom(),
      '" style="',
      (GNavigateur.isLayoutTactile ? "" : "height:calc(100% - ",
      this.parametres.heightPied,
      "px)"),
      '"></div>',
      '<div style="height:',
      this.parametres.heightPied,
      'px;">',
      '<div class="EspaceHaut" ie-display="getVisibiliteLegendeListe" ie-html="getHtmlLegendeListe">',
      "</div>",
      '<div ie-html="getHtmlPied" class="EspaceHaut"></div>',
      "</div>",
      "</div>",
    );
    return H.join("");
  }
}
function _afficherListe(aAfficher) {
  GHtml.setDisplay(this.ids.pageMessage, !aAfficher);
  GHtml.setDisplay(this.ids.pageListe, !!aAfficher);
  if (!aAfficher) {
    this.getInstance(this.identListeBilanDomaine).effacer("");
  }
}
function _getOptionListe(aColonnes, aOptionsSupplementaires) {
  const lOptionsParDefaut = {
    boutons: [{ genre: ObjetListe.typeBouton.deployer }],
    avecLigneTotal: false,
    scrollHorizontal: false,
  };
  const lOptionsListe = Object.assign(lOptionsParDefaut, {
    colonnes: aColonnes,
  });
  if (!!aOptionsSupplementaires) {
    for (const lOptSupp in aOptionsSupplementaires) {
      if (lOptionsParDefaut[lOptSupp] === undefined) {
      }
    }
    Object.assign(lOptionsListe, aOptionsSupplementaires);
  }
  return lOptionsListe;
}
function _initialiserListeBilanDomaine(aInstance) {
  const lThis = this;
  const lListeEleves = this.getListeEleves();
  const lAvecBoutonValidationAuto =
    this.donnees.droitSaisie && !!lListeEleves && lListeEleves.count() === 1;
  if (lAvecBoutonValidationAuto) {
    aInstance.controleur.btnValidationAuto = {
      event() {
        TUtilitaireCompetences.surBoutonValidationAuto({
          instance: lThis,
          listeEleves: lListeEleves,
          avecChoixCalcul: true,
        });
      },
      getTitle() {
        return GTraductions.getValeur("competences.validationAuto.hintBouton");
      },
    };
  }
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_BilanParDomaine.colonnes.items,
    taille: "100%",
    titre: GTraductions.getValeur("competences.bilanpardomaine.colonnes.Items"),
  });
  if (this._avecAffichageCoefficient()) {
    lColonnes.push({
      id: DonneesListe_BilanParDomaine.colonnes.coefficient,
      taille: 70,
      titre: GTraductions.getValeur(
        "competences.bilanpardomaine.colonnes.Coefficient",
      ),
      hint: GTraductions.getValeur(
        "competences.bilanpardomaine.colonnes.hintCoefficient",
      ),
    });
  }
  lColonnes.push({
    id: DonneesListe_BilanParDomaine.colonnes.niveau,
    taille: 70,
    titre: {
      libelleHtml:
        (lAvecBoutonValidationAuto
          ? '<ie-btnicon ie-model="btnValidationAuto" class="icon_sigma color-neutre MargeDroit"></ie-btnicon>'
          : "") +
        GTraductions.getValeur("competences.bilanpardomaine.colonnes.Niveau"),
    },
  });
  if (this._avecAffichageDateValidation()) {
    lColonnes.push({
      id: DonneesListe_BilanParDomaine.colonnes.valider,
      taille: 80,
      titre: GTraductions.getValeur(
        "competences.bilanpardomaine.colonnes.ValideLe",
      ),
    });
  }
  aInstance.setOptionsListe(_getOptionListe(lColonnes));
}
function _initialiserListeBilanDomaineLVE(
  aInstance,
  aListeServicesLVE,
  aAvecColonnesEvaluation,
) {
  let lIdPremiereColonneScrollH = null;
  const lNbServicesLVE = !!aListeServicesLVE ? aListeServicesLVE.count() : 0;
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_BilanParDomaineLVE.colonnes.libelle,
    titre: GTraductions.getValeur("competences.bilanpardomaine.colonnes.Items"),
    taille: lNbServicesLVE > 2 && aAvecColonnesEvaluation ? 500 : "100%",
  });
  if (lNbServicesLVE > 0) {
    const lAvecBoutonValidationAuto = this.donnees.droitSaisie;
    if (lAvecBoutonValidationAuto) {
      const lThis = this;
      const lListeEleves = this.getListeEleves();
      aInstance.controleur.estBtnValidationAutoVisible = function (
        aNumeroService,
      ) {
        const lService = aListeServicesLVE.getElementParNumero(aNumeroService);
        return !!lService && !!lService.calculAutoNiveauAcquiPossible;
      };
      aInstance.controleur.btnValidationAuto = {
        event(aNumeroService) {
          const lService =
            aListeServicesLVE.getElementParNumero(aNumeroService);
          const lParamsValidationAuto = {
            estValidationCECRLLV: true,
            instance: lThis,
            listeEleves: lListeEleves,
            service: lService,
            mrFiche: lThis.getMrFichePourCalculAuto(lService),
          };
          TUtilitaireCompetences.surBoutonValidationAuto(lParamsValidationAuto);
        },
        getTitle() {
          return GTraductions.getValeur(
            "competences.validationAuto.hintBouton",
          );
        },
      };
    }
    aListeServicesLVE.parcourir((aServiceLVE) => {
      const lSuperColonneService = {
        libelle: aServiceLVE.getLibelle(),
        title: aServiceLVE.hint || aServiceLVE.getLibelle(),
      };
      if (aAvecColonnesEvaluation) {
        lColonnes.push({
          id:
            DonneesListe_BilanParDomaineLVE.colonnes.prefixeJauge +
            aServiceLVE.getNumero(),
          titre: [
            lSuperColonneService,
            {
              libelle: GTraductions.getValeur(
                "competences.bilanpardomaine.colonnes.Evaluations",
              ),
            },
          ],
          taille: 200,
          serviceLVE: aServiceLVE,
        });
        if (!lIdPremiereColonneScrollH) {
          lIdPremiereColonneScrollH =
            DonneesListe_BilanParDomaineLVE.colonnes.prefixeJauge +
            aServiceLVE.getNumero();
        }
      }
      lColonnes.push({
        id:
          DonneesListe_BilanParDomaineLVE.colonnes.prefixeNiveau +
          aServiceLVE.getNumero(),
        titre: [
          !aAvecColonnesEvaluation
            ? lSuperColonneService
            : { libelle: TypeFusionTitreListe.FusionGauche },
          {
            libelleHtml:
              (lAvecBoutonValidationAuto
                ? "<ie-btnicon ie-if=\"estBtnValidationAutoVisible('" +
                  aServiceLVE.getNumero() +
                  "')\" ie-model=\"btnValidationAuto('" +
                  aServiceLVE.getNumero() +
                  '\')" class="icon_sigma color-neutre MargeDroit"></ie-btnicon>'
                : "") +
              GTraductions.getValeur(
                "competences.bilanpardomaine.colonnes.Niveau",
              ),
          },
        ],
        taille: 70,
        serviceLVE: aServiceLVE,
      });
      if (!lIdPremiereColonneScrollH) {
        lIdPremiereColonneScrollH =
          DonneesListe_BilanParDomaineLVE.colonnes.prefixeNiveau +
          aServiceLVE.getNumero();
      }
    });
  }
  const lServiceConcerne = this.getServiceConcerne();
  aInstance.setOptionsListe(
    _getOptionListe(lColonnes, {
      scrollHorizontal: lIdPremiereColonneScrollH || false,
      avecLigneTotal: !lServiceConcerne || !lServiceConcerne.existeNumero(),
    }),
  );
}
function _reponseRequeteDetailEvaluations(
  aPilier,
  aEleve,
  aElementCompetence,
  aJSON,
) {
  const lFenetre = this.getInstance(this.identFenetreDetailEvaluations);
  const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(aEleve, aPilier);
  lFenetre.setDonnees(aPilier, aJSON, {
    titreFenetre: lTitreParDefaut,
    libelleComplementaire: !!aElementCompetence
      ? aElementCompetence.getLibelle()
      : "",
  });
}
function _initFenetreDetailEvaluations(aInstance) {
  aInstance.setOptionsFenetre({
    modale: false,
    largeur: 700,
    hauteur: 500,
    listeBoutons: [GTraductions.getValeur("Fermer")],
  });
}
module.exports = { _InterfaceBilanParDomaine };
