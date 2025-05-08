exports.ObjetGrille = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_AffichageGrilleDate_1 = require("Enumere_AffichageGrilleDate");
const Enumere_BoutonSouris_1 = require("Enumere_BoutonSouris");
const ObjetDate_1 = require("ObjetDate");
const ObjetGrilleHoraires_1 = require("ObjetGrilleHoraires");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_DemiJours_1 = require("Enumere_DemiJours");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const ObjetCalculCoursMultiple_1 = require("ObjetCalculCoursMultiple");
const ObjetGrilleCoursPN_1 = require("ObjetGrilleCoursPN");
const UtilitaireConvertisseurPositionGrille_1 = require("UtilitaireConvertisseurPositionGrille");
const ObjetListeArborescente_1 = require("ObjetListeArborescente");
const IEHtml = require("IEHtml");
const _ObjetGrille_1 = require("_ObjetGrille");
const UtilitaireListeCoursAccessible_1 = require("UtilitaireListeCoursAccessible");
const TypeGenreDisponibilite_1 = require("TypeGenreDisponibilite");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetWAI_1 = require("ObjetWAI");
const tag_1 = require("tag");
const TypeGranulariteGrille_1 = require("TypeGranulariteGrille");
const jsx_1 = require("jsx");
const ToucheClavier_1 = require("ToucheClavier");
class ObjetGrille extends _ObjetGrille_1._ObjetGrille {
  constructor(...aParams) {
    super(...aParams);
    this._parametresGrille = {};
    this.applicationSco = GApplication;
    this.parametresSco = this.applicationSco.getObjetParametres();
    this.couleur = this.applicationSco.getCouleur();
    $.extend(this._cache, {
      infosPlace: {},
      IdListeElements: this.Nom + "_Grille_Elements",
      IdDatePrefixe: this.Nom + "_Date",
      IdElementPrefixe: this.Nom + "_Element_",
      IdContenuPrefixe: this.Nom + "_ContenuPre_",
      IdStatutPrefixe: this.Nom + "_Statut_",
      IdImages: this.Nom + "_Images",
      IdElementCadreSlider: this.Nom + "_CadreSlider_",
      idAbsences: this.Nom + "_absences",
      classDroppable: GUID_1.GUID.getClassCss(),
    });
    this.moduleCours = new ObjetGrilleCoursPN_1.ObjetGrilleCoursPN(this);
  }
  getParametrsGrille() {
    return this._parametresGrille;
  }
  getDetailsGrille() {
    const T = [];
    let lPremierBloc = null;
    this._options.tranches.parcourir((aIndexTranche, aTranche) => {
      this._options.blocHoraires.horaires.forEach((aBloc) => {
        if (!lPremierBloc) {
          lPremierBloc = aBloc;
        }
        const lTrancheHoraireDebutBloc = {
          tranche: aIndexTranche,
          horaire: aBloc.debutBloc,
        };
        const lTrancheHoraireFinBloc = {
          tranche: aIndexTranche,
          horaire: aBloc.finBloc,
        };
        const lPlaceGrilleDebutJourBloc = this.getPlaceDeTrancheHoraire(
          lTrancheHoraireDebutBloc,
        );
        const lPlaceGrilleFinJourBloc = this.getPlaceDeTrancheHoraire(
          lTrancheHoraireFinBloc,
        );
        const lTrancheHoraireDebut = {
          tranche: aIndexTranche,
          horaire: aBloc.debut,
        };
        const lTrancheHoraireFin = {
          tranche: aIndexTranche,
          horaire: aBloc.fin,
        };
        const lPlaceGrilleDebutJour =
          this.getPlaceDeTrancheHoraire(lTrancheHoraireDebut);
        const lPlaceGrilleFinJour =
          this.getPlaceDeTrancheHoraire(lTrancheHoraireFin);
        const lDate =
          this._options.convertisseurPosition.getDateDeTrancheHoraire(
            lTrancheHoraireDebut,
          );
        let lTitre = ObjetDate_1.GDate.formatDate(lDate, "%JJJJ %JJ %MMMM");
        if (this._parametresGrille.multiSemaines) {
          lTitre = ObjetDate_1.GDate.formatDate(lDate, "%JJJJ");
        }
        const lTabBloc = [];
        const lInfosPlaceAM = this.getInfosDePlace(lPlaceGrilleDebutJour);
        const lInfosPlacePM = this.getInfosDePlace(lPlaceGrilleFinJour);
        const lStageAM = this.estTrancheHoraireEnStage(
          lTrancheHoraireDebut,
          true,
        );
        const lStagePM = this.estTrancheHoraireEnStage(
          lTrancheHoraireDebut,
          false,
        );
        if (lStageAM || lStagePM) {
          let lLibelle =
            ObjetTraduction_1.GTraductions.getValeur("EDT.EnStage");
          if (!lStageAM || !lStagePM) {
            lLibelle += ` - ${lStageAM ? ObjetTraduction_1.GTraductions.getValeur("Matin") : ObjetTraduction_1.GTraductions.getValeur("ApresMidi")}`;
          }
          lTabBloc.push(IE.jsx.str("li", null, lLibelle));
        }
        if (this._options.decorateurAbsences) {
          const lNumeroSemaine =
            this._options.convertisseurPosition.getSemaineDeTrancheHoraire(
              lTrancheHoraireDebut,
            );
          const lNumeroJour =
            this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
              lTrancheHoraireDebut,
            );
          const lExclusions =
            this._options.decorateurAbsences.getExclusionsEleveDeJourCycle(
              lNumeroJour,
              lNumeroSemaine,
            );
          if (lExclusions) {
            let lLibelleExclu =
              ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.Exclu");
            let lStrAMPM = "";
            if (
              (lExclusions.exclusionsEtab &&
                lExclusions.exclusionsEtab.placeDebut >
                  lPlaceGrilleDebutJourBloc) ||
              (lExclusions.exclusionsClasse &&
                lExclusions.exclusionsClasse.placeDebut >
                  lPlaceGrilleDebutJourBloc)
            ) {
              lStrAMPM = ` - ${ObjetTraduction_1.GTraductions.getValeur("ApresMidi")}`;
            } else if (
              (lExclusions.exclusionsEtab &&
                lExclusions.exclusionsEtab.placeFin <
                  lPlaceGrilleFinJourBloc) ||
              (lExclusions.exclusionsClasse &&
                lExclusions.exclusionsClasse.placeFin < lPlaceGrilleFinJourBloc)
            ) {
              lStrAMPM = ` - ${ObjetTraduction_1.GTraductions.getValeur("Matin")}`;
            }
            if (lExclusions.exclusionsEtab && lExclusions.exclusionsEtab.MC) {
              lLibelleExclu =
                ObjetTraduction_1.GTraductions.getValeur(
                  "EDT.WAI.MC",
                ).ucfirst();
            }
            lTabBloc.push(IE.jsx.str("li", null, lLibelleExclu + lStrAMPM));
          }
        }
        const lAbsRessources = this.getTabAbsencesRessource(
          aIndexTranche,
          aBloc,
        );
        let lTabStrAbsence = [];
        lAbsRessources.forEach((aAbsence) => {
          lTabStrAbsence.push(
            ObjetChaine_1.GChaine.format(
              ObjetTraduction_1.GTraductions.getValeur(
                "Dates.DeHeureDebutAHeureFin",
              ),
              [
                ObjetDate_1.GDate.formatDate(
                  ObjetDate_1.GDate.placeEnDateHeure(
                    aAbsence.placeGrilleDebut %
                      this.parametresSco.PlacesParJour,
                  ),
                  "%hh%sh%mm",
                ),
                ObjetDate_1.GDate.formatDate(
                  ObjetDate_1.GDate.placeEnDateHeure(
                    aAbsence.placeGrilleFin % this.parametresSco.PlacesParJour,
                    true,
                  ),
                  "%hh%sh%mm",
                ),
              ],
            ),
          );
        });
        if (lTabStrAbsence.length > 0) {
          lTabBloc.push(
            IE.jsx.str(
              "li",
              null,
              ObjetChaine_1.GChaine.format(
                ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.Absences_S"),
                [lTabStrAbsence.join(", ")],
              ),
            ),
          );
        }
        if (lInfosPlaceAM.nonTravaille || lInfosPlacePM.nonTravaille) {
          let lLibelle = ObjetTraduction_1.GTraductions.getValeur(
            "EDT.WAI.NonTravaille",
          );
          if (!lInfosPlaceAM.nonTravaille || !lInfosPlacePM.nonTravaille) {
            lLibelle += ` - ${lInfosPlaceAM.nonTravaille ? ObjetTraduction_1.GTraductions.getValeur("Matin") : ObjetTraduction_1.GTraductions.getValeur("ApresMidi")}`;
          }
          lTabBloc.push(IE.jsx.str("li", null, lLibelle));
        }
        if (lInfosPlaceAM.ferie) {
          lTabBloc.push(
            IE.jsx.str(
              "li",
              null,
              `${ObjetTraduction_1.GTraductions.getValeur("Ferie")} - ${lInfosPlaceAM.libelleFerie}`,
            ),
          );
        }
        if (lTabBloc.length > 0) {
          T.push(
            IE.jsx.str(
              IE.jsx.fragment,
              null,
              IE.jsx.str("h2", null, lTitre),
              IE.jsx.str(
                "ul",
                { "aria-label": lTitre, class: "browser-default" },
                lTabBloc.join(""),
              ),
            ),
          );
        }
      });
    });
    const lTabInfosJournee = [];
    const lAdd = (aPlace, aStr) => {
      if (aStr) {
        if (!lTabInfosJournee[aPlace]) {
          lTabInfosJournee[aPlace] = [];
        }
        lTabInfosJournee[aPlace].push(aStr);
      }
    };
    if (lPremierBloc) {
      lAdd(
        lPremierBloc.debutBloc,
        IE.jsx.str(
          "li",
          null,
          ObjetTraduction_1.GTraductions.getValeur(
            "EDT.WAI.DebutJournee_S",
            ObjetDate_1.GDate.formatDate(
              ObjetDate_1.GDate.placeEnDateHeure(lPremierBloc.debutBloc),
              "%hh%sh%mm",
            ),
          ),
        ),
      );
    }
    if (this._options.avecSeparationDemiJAbsence) {
      lAdd(
        this._options.placeDemiJournee,
        IE.jsx.str(
          "li",
          null,
          ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.DemiPension_S", [
            ObjetDate_1.GDate.formatDate(
              ObjetDate_1.GDate.placeEnDateHeure(
                this._options.placeDemiJournee,
              ),
              "%hh%sh%mm",
            ),
          ]),
        ),
      );
    } else if (this._options.avecDemiPension) {
      lAdd(
        this.parametresSco.debutDemiPension,
        IE.jsx.str(
          "li",
          null,
          ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.HeureFinAM_S", [
            ObjetDate_1.GDate.formatDate(
              ObjetDate_1.GDate.placeEnDateHeure(
                this.parametresSco.debutDemiPension,
              ),
              "%hh%sh%mm",
            ),
          ]),
        ),
      );
      if (
        this.parametresSco.debutDemiPension !==
        this.parametresSco.finDemiPension
      ) {
        lAdd(
          this.parametresSco.finDemiPension,
          IE.jsx.str(
            "li",
            null,
            ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.HeureDebutPM_S", [
              ObjetDate_1.GDate.formatDate(
                ObjetDate_1.GDate.placeEnDateHeure(
                  this.parametresSco.finDemiPension,
                ),
                "%hh%sh%mm",
              ),
            ]),
          ),
        );
      }
    }
    if (this._options.avecRecreations && this._options.recreations) {
      this._options.recreations.parcourir((aRecreation) => {
        lAdd(
          aRecreation.place,
          IE.jsx.str(
            "li",
            null,
            ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.Recreation_SS", [
              aRecreation.getLibelle(),
              ObjetDate_1.GDate.formatDate(
                ObjetDate_1.GDate.placeEnDateHeure(aRecreation.place),
                "%hh%sh%mm",
              ),
            ]),
          ),
        );
      });
    }
    if (lPremierBloc) {
      lAdd(
        lPremierBloc.finBloc,
        IE.jsx.str(
          "li",
          null,
          ObjetTraduction_1.GTraductions.getValeur(
            "EDT.WAI.FinJournee_S",
            ObjetDate_1.GDate.formatDate(
              ObjetDate_1.GDate.placeEnDateHeure(lPremierBloc.finBloc, true),
              "%hh%sh%mm",
            ),
          ),
        ),
      );
    }
    if (lTabInfosJournee.length > 0) {
      T.push(
        IE.jsx.str(
          IE.jsx.fragment,
          null,
          IE.jsx.str(
            "h2",
            { class: "p-top-xl" },
            ObjetTraduction_1.GTraductions.getValeur("EDT.WAI.TitreJournee"),
          ),
          IE.jsx.str(
            "ul",
            { class: "browser-default" },
            lTabInfosJournee.map((aVal) => aVal.join("")).join(""),
          ),
        ),
      );
    }
    if (T.length > 0) {
      return T.join("");
    }
    return "";
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getClassGrille: function () {
        let lClass = "";
        if (aInstance._options.getClassGrille) {
          lClass += " " + (aInstance._options.getClassGrille() || "");
        }
        return lClass;
      },
      getNodeCours: function (aIndiceCours) {
        const lEventMap = {
          mouseup: function (aEvent) {
            if (!aInstance._options.avecSelectionCours) {
              return;
            }
            if (aEvent.which === 3) {
              return;
            }
            aInstance.selectionnerElementParIndice(aIndiceCours, true);
            aInstance.$refresh();
          },
          keyup(aEvent) {
            if (ToucheClavier_1.ToucheClavierUtil.estEventSelection(aEvent)) {
              aInstance.selectionnerElementParIndice(aIndiceCours, true);
              return;
            }
          },
          focus() {
            if (aInstance.NumeroElement !== aIndiceCours) {
              aInstance.moduleCours.forcerVisibleCoursMS(aIndiceCours);
            }
          },
          contextmenu: function () {
            if (aInstance._options.avecSelectionCours) {
              aInstance._surContextMenuCours(aIndiceCours);
            }
          },
        };
        const lCours = aInstance.ListeCours.get(aIndiceCours);
        if (aInstance._options.avecMouseInOutCours) {
          lEventMap["mouseenter mouseleave"] = function (aEvent) {
            aInstance.callback.appel({
              genre:
                aEvent.type === "mouseenter"
                  ? Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMouseEnterCours
                  : Enumere_EvenementEDT_1.EGenreEvenementEDT
                      .SurMouseLeaveCours,
              id: aInstance.moduleCours.getIdCours(aIndiceCours),
              cours: lCours,
              indiceCours: aIndiceCours,
            });
          };
        }
        $(this.node).on(lEventMap);
      },
      dropCours(aIndiceCours) {
        let lBackupNumeroSelection = -1;
        return {
          accept: function (aParamsDrop) {
            if (aInstance._options.callbackAcceptDraggable) {
              return aInstance._options.callbackAcceptDraggable(aParamsDrop);
            }
            return false;
          },
          activate: function () {
            lBackupNumeroSelection = aInstance.NumeroElement;
          },
          deactivate: function () {
            if (lBackupNumeroSelection >= 0) {
              aInstance.selectionnerElement(lBackupNumeroSelection, true);
            }
            lBackupNumeroSelection = -1;
          },
          drop: function (aParamsDrop) {
            if (lBackupNumeroSelection >= 0) {
              aInstance.deselectionnerElement();
              aInstance.selectionnerElement(lBackupNumeroSelection, true);
            }
            aInstance._surDropGrilleCellule(aParamsDrop, aIndiceCours);
          },
          over: function () {
            aInstance.deselectionnerElement();
            aInstance.selectionnerElement(aIndiceCours, true);
          },
          out: function () {
            if (aInstance.NumeroElement === aIndiceCours) {
              aInstance.moduleCours.selectionnerCours(aIndiceCours, false);
            }
          },
        };
      },
      nodeImageCours: function (aIndiceCours, aGenreImage) {
        $(this.node).on("mouseup keyup", (aEvent) => {
          if (
            (aEvent.type === "mouseup" && aEvent.which === 1) ||
            (aEvent.type === "keyup" &&
              aEvent.which === ToucheClavier_1.ToucheClavier.Espace) ||
            aEvent.which === ToucheClavier_1.ToucheClavier.RetourChariot
          ) {
            aInstance._surEvenement(
              aEvent,
              Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage,
              aIndiceCours,
              null,
              aGenreImage,
              false,
            );
          }
        });
      },
      getNodeContenu: function (aIndiceCours, aIndiceContenu) {
        $(this.node).on("mouseup keyup", (aEvent) => {
          if (
            (aEvent.type === "mouseup" && aEvent.which === 1) ||
            (aEvent.type === "keyup" &&
              aEvent.which === ToucheClavier_1.ToucheClavier.Espace) ||
            aEvent.which === ToucheClavier_1.ToucheClavier.RetourChariot
          ) {
            aInstance._surEvenement(
              aEvent,
              Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu,
              aIndiceCours,
              aIndiceContenu,
              null,
              true,
            );
          }
        });
      },
      getNodePiedRessLibre: function (aIndex) {
        $(this.node).eventValidation(function () {
          ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
            pere: aInstance,
            id: this,
            initCommandes: function (aMenu) {
              aMenu.add(
                ObjetTraduction_1.GTraductions.getValeur(
                  "EDT.Pied.SelectionnerRessLibres",
                ),
                true,
                () => {
                  const lInfosPlace =
                    aInstance._parametresGrille.placesRessourcesLibres[aIndex];
                  if (lInfosPlace) {
                    aInstance._options.callbackPiedRessourcesLibres(
                      lInfosPlace.ress,
                    );
                  }
                },
              );
            },
          });
        });
      },
    });
  }
  _initialiserOptions() {
    this.parametresSco = GApplication.getObjetParametres();
    this.couleur = GApplication.getCouleur();
    super._initialiserOptions();
    $.extend(this._options, {
      tailleMinTranche: 55,
      tailleMINPasHoraire: 8,
      premierLundi: this.parametresSco.PremierLundi,
      joursOuvres: this.parametresSco.JoursOuvres,
      joursFeries: this.parametresSco.JoursFeries,
      pasHoraire: this.parametresSco.PlacesParHeure,
      placeDemiJournee: this.parametresSco.PlaceDemiJournee,
      avecHeuresPleinesApresMidi: this.parametresSco.AvecHeuresPleinesApresMidi,
      titresHorairesParSequence: this.parametresSco.afficherSequences,
      frequences: null,
      evenementMouseDownPlace: null,
      avecMouseInOutCours: false,
      avecIndisponibilite: false,
      avecDemiPension: true,
      avecSeparationDemiJAbsence: false,
      avecRecreations: true,
      recreations: this.parametresSco.recreations,
      couleurRecreationAvecDuree: this.couleur.themeNeutre.moyen2,
      afficherDebutSelonCours: false,
      afficherFinSelonCours: false,
      afficherCoursHorsHoraire: true,
      avecSelection: true,
      avecMenuContextuel: false,
      avecDrop: false,
      callbackAcceptDraggable: null,
      callbackDropCellule: null,
      remplirTranchesSurSetDonnees: true,
      classTitreSelectionTranche: "",
      avecPiedTranche: () => {
        let lAvecHorsGrille = false;
        if (this.ListeCours) {
          this.ListeCours.parcourir((aCours) => {
            if (
              aCours &&
              aCours.horsHoraire &&
              this._options.convertisseurPosition.estCoursDansGrille(aCours)
            ) {
              lAvecHorsGrille = true;
              return false;
            }
          });
        }
        return lAvecHorsGrille;
      },
      taillePiedTranche: 50,
      taillePiedTrancheInverse: 100,
      avecSelectionCours: true,
      couleurFondCoursSuperpose: null,
      decorateurAbsences: null,
      avecInitSelectionColonne: true,
      afficherPlacesLibreDiagnostic: true,
      getClassGrille: null,
      convertisseurPosition:
        new UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille(),
      avecCouleurCoursSousGabarit: false,
      callbackPiedRessourcesLibres: null,
      WAILabelGrille: "",
    });
  }
  getDecorateurAbsences() {
    return this._options.decorateurAbsences;
  }
  setParametresAffichage() {}
  free() {
    super.free();
    if (this._parametresGrille.gabarit) {
      this._parametresGrille.gabarit.vider();
    }
  }
  apresInitialisationOptions() {
    super.apresInitialisationOptions();
    this._cache.numeroTrancheSelectionnee = 0;
    this.NumeroElement = -1;
    this.EstAffiche = false;
    this.EnAffichage = false;
  }
  initParametresGrille() {
    this._parametresGrille = {
      numeroSemaine: 0,
      domaine: null,
      multiSemaines: false,
      estEDTAnnuel: false,
      date: null,
      listeCours: null,
      joursStage: null,
      avecCoursAnnule: true,
      avecCoursAnnulesSuperposes: true,
      gabarit: null,
      modeDiagnostic: false,
      diagnosticPlaces: null,
      callbackApresConstruction: null,
      ignorerCalculCoursMultiple: false,
    };
    this._options.convertisseurPosition.setOptions({
      parametresGrille: this._parametresGrille,
      optionsGrille: this._options,
      grille: this,
    });
  }
  setDonnees(aParametres, aCallbackApresConstruction) {
    this.initParametresGrille();
    $.extend(this._parametresGrille, aParametres);
    this._parametresGrille.callbackApresConstruction =
      aCallbackApresConstruction;
    this.cours = null;
    this.donneesRecus = true;
    if (!this._options.blocHoraires) {
      this._options.blocHoraires =
        new ObjetGrilleHoraires_1.ObjetGrilleHoraires().addBloc({
          debutBloc: 0,
          finBloc: this.parametresSco.PlacesParJour - 1,
        });
    }
    if (this._parametresGrille.gabarit) {
      this._parametresGrille.gabarit.setOptions({ grille: this });
      this._parametresGrille.gabarit.miseAJour();
    }
    this._parametresGrille.numeroSemaine =
      this._parametresGrille.numeroSemaine === null ||
      this._parametresGrille.numeroSemaine === undefined
        ? IE.Cycles.cycleDeLaDate(this._parametresGrille.date)
        : this._parametresGrille.numeroSemaine;
    if (this._options.remplirTranchesSurSetDonnees) {
      this._options.convertisseurPosition.remplirColonnesVisibles();
    }
    this.ListeCours = this._parametresGrille.listeCours;
    if (!this._parametresGrille.ignorerCalculCoursMultiple) {
      new ObjetCalculCoursMultiple_1.ObjetCalculCoursMultiple().calculer({
        listeCours: this._parametresGrille.listeCours,
        avecCoursAnnules: this._parametresGrille.avecCoursAnnule,
        avecCoursAnnulesSuperposes:
          this._parametresGrille.avecCoursAnnulesSuperposes,
        avecCoursPrevus: this._parametresGrille.avecCoursPrevus,
        getPlaceDebutCours: (aCours) => {
          return this._options.convertisseurPosition.getPlaceDebutCours(aCours);
        },
        getPlaceFinCours: (aCours) => {
          return this._options.convertisseurPosition.getPlaceFinCours(aCours);
        },
        estCoursDansGrille: (aCours) => {
          return this._options.convertisseurPosition.estCoursDansGrille(aCours);
        },
        estEDTAnnuel: this._parametresGrille.estEDTAnnuel,
      });
    }
    this._cache.numeroTrancheSelectionnee = 0;
    this.NumeroElement = -1;
    this.EstAffiche = true;
    this.construireAffichage();
  }
  construireAffichage() {
    this._cache.infosPlace = {};
    return super.construireAffichage();
  }
  actualiser() {
    if (this.NumeroElement > -1) {
      this._parametresGrille.indiceCoursAReselectionner = this.NumeroElement;
    }
    return super.actualiser();
  }
  apresConstructionGrille() {
    this.composeListeCours();
    this._composeRecreationsAvecDuree();
    if (this._options.decorateurAbsences) {
      const lHtml =
        this._options.decorateurAbsences.apresConstructionGrille(this);
      if (lHtml) {
        ObjetHtml_1.GHtml.setHtml(this._cache.idAbsences, lHtml, {
          controleur: this.controleur,
          ignorerScroll: true,
        });
      }
    }
    if (this._options.avecInitSelectionColonne) {
      this._selectionnerTranche(this._cache.numeroTrancheSelectionnee);
    }
    this._remplirTraitsHoraires();
    super.apresConstructionGrille();
    if (this._parametresGrille.gabarit) {
      this._parametresGrille.gabarit.afficher();
    }
    if (this._parametresGrille.indiceCoursAReselectionner > -1) {
      this.selectionnerElement(
        this._parametresGrille.indiceCoursAReselectionner,
      );
      this._parametresGrille.indiceCoursAReselectionner = -1;
    }
    if (this._parametresGrille.callbackApresConstruction) {
      this._parametresGrille.callbackApresConstruction(this);
    }
  }
  composeContenuPiedHoraire() {
    const T = [];
    const lSequences = [];
    let lSequenceCourante;
    this._options.blocHoraires.parcourirHoraires(
      (aNumeroHoraire, aBlocHoraire) => {
        if (!lSequenceCourante) {
          lSequenceCourante = { debut: aNumeroHoraire, fin: aNumeroHoraire };
        }
        const lHorairePlein =
          this.getGenreSeparateurLigne(
            aNumeroHoraire - aBlocHoraire.debutBloc,
            true,
          ) === _ObjetGrille_1._ObjetGrille.separateurLigne.plein;
        if (lHorairePlein || aNumeroHoraire === aBlocHoraire.fin) {
          lSequenceCourante.fin = aNumeroHoraire;
          lSequences.push(lSequenceCourante);
          lSequenceCourante = null;
        }
      },
    );
    lSequences.forEach((aSequence) => {
      const lPos = this.getPositionHoraireDeNumeroHoraire(aSequence.debut);
      const lTaille =
        this.getPositionHoraireDeNumeroHoraire(aSequence.fin, true) - lPos + 1;
      const lHeight = this._options.grilleInverse
        ? this._options.taillePiedHoraire
        : lTaille;
      let lInfosPlace = null;
      let lIndex = -1;
      if (this._parametresGrille.placesRessourcesLibres) {
        this._parametresGrille.placesRessourcesLibres.every(
          (aInfosPlace, aIndex) => {
            const lPlaceHebdoDebut =
              this._options.convertisseurPosition.getPlaceHebdoDePlaceGrille(
                aSequence.debut,
              );
            if (
              lPlaceHebdoDebut >= aInfosPlace.place &&
              lPlaceHebdoDebut + aSequence.fin - aSequence.debut <
                aInfosPlace.place + aInfosPlace.nbPlaces
            ) {
              lInfosPlace = aInfosPlace;
              lIndex = aIndex;
              return false;
            }
            return true;
          },
        );
      }
      const lAvecAction =
        this._options.callbackPiedRessourcesLibres &&
        lInfosPlace &&
        lInfosPlace.ress &&
        lInfosPlace.ress.count() > 0;
      T.push(
        '<div class="grille_piedRessLibre',
        lAvecAction ? " grille_avecAction" : "",
        '" style="',
        this._options.grilleInverse
          ? ObjetStyle_1.GStyle.composeWidth(lTaille) +
              "left:" +
              (lPos - 1) +
              "px;"
          : ObjetStyle_1.GStyle.composeHeight(lTaille) +
              "top:" +
              (lPos - 1) +
              "px;",
        "line-height:",
        lHeight,
        "px;",
        lHeight < 13 ? "font-size:" + (lHeight - 3) + "px;" : "",
        '"',
        ' tabindex="0"',
        lAvecAction
          ? ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodePiedRessLibre", [
              lIndex,
            ]) +
              ObjetWAI_1.GObjetWAI.composeAttribut({
                genre: ObjetWAI_1.EGenreAttribut.haspopup,
                valeur: "true",
              })
          : "",
        ' title="',
        ObjetTraduction_1.GTraductions.getValeur("EDT.Pied.HintPiedRessLibres"),
        '"',
        ">",
        lAvecAction ? lInfosPlace.nb : 0,
        "</div>",
      );
    });
    return T.join("");
  }
  getGenreSeparateurLigne(aNumeroHoraire, aPourHoraire) {
    const lHoraire =
      this._options.blocHoraires.rechercheHoraire(aNumeroHoraire);
    const lHoraireFin = aNumeroHoraire === lHoraire.fin;
    if (
      !aPourHoraire &&
      !lHoraireFin &&
      aNumeroHoraire + 1 !== this.numeroHoraireGranularite(aNumeroHoraire + 1)
    ) {
      return _ObjetGrille_1._ObjetGrille.separateurLigne.vide;
    }
    const JJ =
      this._options.avecHeuresPleinesApresMidi &&
      aNumeroHoraire + 1 >= this.parametresSco.finDemiPension
        ? aNumeroHoraire + 1 - this.parametresSco.finDemiPension
        : aNumeroHoraire + 1;
    const lGenre =
      JJ % this._options.pasHoraire && !lHoraireFin
        ? (2 * JJ) % this._options.pasHoraire
          ? _ObjetGrille_1._ObjetGrille.separateurLigne.petit
          : _ObjetGrille_1._ObjetGrille.separateurLigne.moyen
        : _ObjetGrille_1._ObjetGrille.separateurLigne.plein;
    return lGenre;
  }
  numeroHoraireGranularite(aNumeroHoraire) {
    let lNumeroHoraire = aNumeroHoraire;
    let lHoraire;
    switch (this._options.granularitPasHoraire) {
      case TypeGranulariteGrille_1.TypeGranulariteGrille.sequence:
        while (
          lNumeroHoraire >= 0 &&
          lNumeroHoraire % this._options.pasHoraire
        ) {
          lNumeroHoraire += -1;
        }
        break;
      case TypeGranulariteGrille_1.TypeGranulariteGrille.demiPensionMatin:
        lHoraire = this._options.blocHoraires.rechercheHoraire(lNumeroHoraire);
        lNumeroHoraire =
          lHoraire.debutBloc +
          (lNumeroHoraire - lHoraire.debutBloc <
          this.parametresSco.debutDemiPension
            ? 0
            : this.parametresSco.debutDemiPension);
        break;
      case TypeGranulariteGrille_1.TypeGranulariteGrille
        .demiPensionMatinApresMidi: {
        lHoraire = this._options.blocHoraires.rechercheHoraire(lNumeroHoraire);
        const lHoraireJour = lNumeroHoraire - lHoraire.debutBloc;
        if (lHoraireJour < this.parametresSco.debutDemiPension) {
          lNumeroHoraire = lHoraire.debutBloc;
        } else if (lHoraireJour < this.parametresSco.finDemiPension) {
          lNumeroHoraire =
            lHoraire.debutBloc + this.parametresSco.debutDemiPension;
        } else {
          lNumeroHoraire =
            lHoraire.debutBloc + this.parametresSco.finDemiPension;
        }
        break;
      }
      default:
        lNumeroHoraire = super.numeroHoraireGranularite(lNumeroHoraire);
    }
    return lNumeroHoraire;
  }
  getLibelleTitreHoraire(aNumeroHoraire) {
    const lPlaceJour = aNumeroHoraire;
    if (this._options.titresHorairesParSequence) {
      if (
        this._options.avecHeuresPleinesApresMidi &&
        lPlaceJour < this.parametresSco.finDemiPension &&
        lPlaceJour + this._options.pasHoraire - 1 >=
          this.parametresSco.finDemiPension
      ) {
        return "";
      }
      if (
        lPlaceJour + this._options.pasHoraire >
        this._options.blocHoraires.rechercheHoraire(aNumeroHoraire).fin + 1
      ) {
        return "";
      }
      const lLigne =
        this._options.avecHeuresPleinesApresMidi &&
        lPlaceJour >= this.parametresSco.finDemiPension
          ? lPlaceJour -
            (this.parametresSco.finDemiPension % this._options.pasHoraire)
          : lPlaceJour;
      if (lLigne % this._options.pasHoraire === 0) {
        return (
          this.parametresSco.sequences[
            Math.floor(lPlaceJour / this.parametresSco.PlacesParHeure)
          ] + "" || ""
        );
      }
      return "";
    }
    return lPlaceJour < this.parametresSco.LibellesHeures.count() &&
      this.parametresSco.LibellesHeures.getActif(lPlaceJour)
      ? this.parametresSco.LibellesHeures.getLibelle(lPlaceJour)
      : "";
  }
  getFormatTitreTrancheEnColonnes(aNombreTranche, aLargeur) {
    if (
      this._options.genreAffichageDate !==
      Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecDateEtJour
    ) {
      return null;
    }
    if (this._parametresGrille.multiSemaines) {
      return null;
    }
    for (let i = 0; i < aNombreTranche; i++) {
      const LDate = this._options.convertisseurPosition.getDateDeTrancheHoraire(
        { tranche: i, horaire: 0 },
      );
      const lLibelle = ObjetDate_1.GDate.formatDate(LDate, "%JJJ %JJ %MMM");
      if (
        ObjetChaine_1.GChaine.getLongueurChaineDansDiv(lLibelle, 10, true) + 4 >
        aLargeur
      ) {
        return "petit";
      }
    }
  }
  composeTitresTranches(I, ALargeur, aFormatColonnes) {
    let LDate = new Date();
    let lDateFinColonne;
    let lNumeroSemaine = 0;
    let lEstDateCourante = false;
    const lLargeur = this._options.grilleInverse ? ALargeur - 3 : ALargeur;
    let lAvecPlusieursJoursSurColonne = false;
    if (!this._parametresGrille.multiSemaines) {
      const lFinDernierHoraire =
        this._options.blocHoraires.horaires[
          this._options.blocHoraires.horaires.length - 1
        ].fin;
      LDate = this._options.convertisseurPosition.getDateDeTrancheHoraire({
        tranche: I,
        horaire: 0,
      });
      lDateFinColonne =
        this._options.convertisseurPosition.getDateDeTrancheHoraire({
          tranche: I,
          horaire: lFinDernierHoraire,
        });
      if (ObjetDate_1.GDate.estJourEgal(LDate, lDateFinColonne)) {
        lNumeroSemaine = IE.Cycles.cycleDeLaDate(LDate);
        lEstDateCourante = ObjetDate_1.GDate.estJourEgal(LDate, new Date());
      } else {
        lAvecPlusieursJoursSurColonne = true;
        lEstDateCourante = ObjetDate_1.GDate.dateEntreLesDates(
          new Date(),
          LDate,
          lDateFinColonne,
        );
      }
    }
    let lLibelle = "";
    const T = [];
    T.push(
      '<table id="' +
        this._cache.IdDatePrefixe +
        I +
        '" style="margin-left:auto; margin-right:auto;width:' +
        lLargeur +
        "px;",
      ObjetStyle_1.GStyle.composeCouleurTexte(
        this._options.couleurLibellesColonnes,
      ),
      '" class="NoWrap' +
        (lEstDateCourante ? " Gras" : "") +
        '" role="presentation"><tr>',
    );
    if (
      this._options.genreAffichageDate ===
        Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.SansDate ||
      LDate === null ||
      LDate === undefined
    ) {
      T.push('<div style="font-size:1px"></div>');
    } else if (
      this._options.genreAffichageDate ===
      Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecFrequence
    ) {
      if (
        this._options.frequences &&
        this._options.frequences[lNumeroSemaine]
      ) {
        lLibelle =
          ObjetTraduction_1.GTraductions.getValeur("Semaine") +
          "&nbsp;" +
          (this._options.frequences[lNumeroSemaine].libelle
            ? this._options.frequences[lNumeroSemaine].libelle
            : lNumeroSemaine);
      } else {
        this._options.genreAffichageDate =
          Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecDateEtJour;
      }
    }
    if (
      [
        Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecDate,
        Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecDateEtJour,
        Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecFrequence,
      ].includes(this._options.genreAffichageDate)
    ) {
      let lLibelleSup = "";
      if (
        !lAvecPlusieursJoursSurColonne &&
        this.estTrancheHoraireEnStage({ tranche: I, horaire: 0 })
      ) {
        lLibelleSup =
          " [" + ObjetTraduction_1.GTraductions.getValeur("EDT.EnStage") + "]";
      } else if (
        this._options.decorateurAbsences &&
        !lAvecPlusieursJoursSurColonne
      ) {
        const lExclusions =
          this._options.decorateurAbsences.getExclusionsEleveDeJourCycle(
            this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire({
              tranche: I,
              horaire: 0,
            }),
          );
        if (lExclusions) {
          let lLibelleExclu =
            ObjetTraduction_1.GTraductions.getValeur("EDT.Exclu");
          if (lExclusions.exclusionsEtab && lExclusions.exclusionsEtab.MC) {
            lLibelleExclu = ObjetTraduction_1.GTraductions.getValeur("EDT.MC");
          }
          lLibelleSup = " [" + lLibelleExclu + "]";
        }
      }
      if (
        this._options.genreAffichageDate ===
        Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecDateEtJour
      ) {
        if (this._parametresGrille.estEDTAnnuel) {
          lLibelle = ObjetDate_1.GDate.formatDate(
            IE.Cycles.jourCycleEnDate(
              this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
                { tranche: I, horaire: 0 },
              ),
              1,
            ),
            "%JJJJ",
          );
        } else if (this._parametresGrille.multiSemaines) {
          LDate = IE.Cycles.jourCycleEnDate(
            this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire({
              tranche: I,
              horaire: 0,
            }),
            this._parametresGrille.domaine.getPremierePosition(),
          );
          lLibelle = ObjetDate_1.GDate.formatDate(LDate, "%JJJJ");
        } else if (lAvecPlusieursJoursSurColonne) {
          lLibelle =
            ObjetDate_1.GDate.formatDate(LDate, "%JJ/%MM") +
            " - " +
            ObjetDate_1.GDate.formatDate(lDateFinColonne, "%JJ/%MM");
        } else {
          lLibelle =
            aFormatColonnes === "petit"
              ? this._options.grilleInverse
                ? ObjetDate_1.GDate.formatDate(LDate, "%JJJ %JJ/%MM")
                : ObjetDate_1.GDate.formatDate(LDate, "%JJ/%MM")
              : ObjetDate_1.GDate.formatDate(LDate, "%JJJ %JJ %MMM");
        }
        if (
          aFormatColonnes !== "petit" &&
          lLibelleSup &&
          ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
            lLibelle + lLibelleSup,
            10,
            true,
          ) +
            4 >
            lLargeur
        ) {
          lLibelle = ObjetDate_1.GDate.formatDate(LDate, "%JJ/%MM");
        }
      } else if (
        this._options.genreAffichageDate !==
        Enumere_AffichageGrilleDate_1.EGenreAffichageGrilleDate.AvecFrequence
      ) {
        lLibelle = ObjetDate_1.GDate.formatDate(LDate, "%JJ/%MM");
      }
      T.push(
        '<th class="',
        this._options.grilleInverse
          ? "AlignementDroit PetitEspaceDroit"
          : "AlignementMilieu",
        ' Insecable Maigre" scope="',
        this._options.grilleInverse ? "row" : "col",
        '">',
        '<div ie-ellipsis style="width:',
        lLargeur,
        'px;">' + lLibelle + lLibelleSup + "</div>",
        "</th>",
      );
    }
    T.push("</tr></table>");
    return T.join("");
  }
  getLargeurTitreLibellesLignes() {
    if (!this._cache.cacheLargeurTitreGauche) {
      super.getLargeurTitreLibellesLignes();
    }
    return this._cache.cacheLargeurTitreGauche;
  }
  estTrancheHoraireEnStage(aTrancheHoraire, aMatin) {
    if (
      !aTrancheHoraire ||
      !this._parametresGrille.joursStage ||
      this._parametresGrille.multiSemaines
    ) {
      return false;
    }
    const lJourAnnee =
      this._options.convertisseurPosition.getJourAnneeDeTrancheHoraire(
        aTrancheHoraire,
      );
    const lStageAM = this._parametresGrille.joursStage.am;
    const lStagePM = this._parametresGrille.joursStage.pm;
    if (aMatin === true && lStageAM) {
      return lStageAM.contains(lJourAnnee);
    }
    if (aMatin === false && lStagePM) {
      return lStagePM.contains(lJourAnnee);
    }
    if (aMatin === undefined || aMatin === null) {
      return (
        (lStageAM ? lStageAM.contains(lJourAnnee) : false) ||
        (lStagePM ? lStagePM.contains(lJourAnnee) : false)
      );
    }
    return false;
  }
  _composeContenuAbolueDansGrille() {
    const T = [];
    T.push(
      IE.jsx.str("div", {
        role: "list",
        id: this._cache.IdListeElements,
        class: "ObjetGrilleCours",
      }),
    );
    if (this._options.decorateurAbsences) {
      T.push('<div tabindex="-1" id="' + this._cache.idAbsences + '"></div>');
    }
    return T.join("");
  }
  getInfosDePlace(aPlaceGrille) {
    if (!this._cache.infosPlace) {
      this._cache.infosPlace = {};
    }
    if (this._cache.infosPlace[aPlaceGrille]) {
      return this._cache.infosPlace[aPlaceGrille];
    }
    const lResult = {
      ferie: false,
      nonTravaille: false,
      horsAnneScolaire: false,
      invalide: false,
    };
    let LDate, lJour, lJourAnnee;
    const lTrancheHoraire = this.getTrancheHoraireDePlace(aPlaceGrille),
      lLigneJour = this._options.blocHoraires.getNumeroHoraireSelonBloc(
        lTrancheHoraire.horaire,
      ),
      LIndiceDemiJournee =
        lLigneJour <
        (this._options.avecSeparationDemiJAbsence
          ? this._options.placeDemiJournee
          : this.parametresSco.debutDemiPension)
          ? Enumere_DemiJours_1.EGenreDemiJours.Matin
          : lLigneJour >=
              (this._options.avecSeparationDemiJAbsence
                ? this._options.placeDemiJournee
                : this.parametresSco.finDemiPension)
            ? Enumere_DemiJours_1.EGenreDemiJours.ApresMidi
            : -1;
    if (this._parametresGrille.estEDTAnnuel) {
      lJour =
        this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
          lTrancheHoraire,
        );
      if (LIndiceDemiJournee >= 0) {
        lResult.nonTravaille =
          !this.parametresSco.DemiJourneesOuvrees[LIndiceDemiJournee].contains(
            lJour,
          );
      }
    } else if (this._parametresGrille.multiSemaines) {
      lResult.ferie = true;
      lResult.nonTravaille = true;
      lResult.horsAnneScolaire = true;
      const lSemaines = this._parametresGrille.domaine.getSemaines();
      for (const iSemaine in lSemaines) {
        LDate = IE.Cycles.jourCycleEnDate(
          this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
            lTrancheHoraire,
          ),
          lSemaines[iSemaine],
        );
        lJour = IE.Cycles.dateEnJourCycle(LDate);
        lJourAnnee =
          ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
            IE.Cycles.dateDebutPremierCycle(),
            LDate,
          ) + 1;
        const lResultSemaine = this._remplirInfosPlace(
          LDate,
          lJour,
          lJourAnnee,
          LIndiceDemiJournee,
        );
        lResult.ferie = lResult.ferie && lResultSemaine.ferie;
        lResult.nonTravaille =
          lResult.nonTravaille && lResultSemaine.nonTravaille;
        lResult.horsAnneScolaire =
          lResult.horsAnneScolaire && lResultSemaine.horsAnneScolaire;
      }
    } else {
      LDate =
        this._options.convertisseurPosition.getDateDeTrancheHoraire(
          lTrancheHoraire,
        );
      lJour = IE.Cycles.dateEnJourCycle(LDate);
      lJourAnnee =
        this._options.convertisseurPosition.getJourAnneeDeTrancheHoraire(
          lTrancheHoraire,
        );
      $.extend(
        lResult,
        this._remplirInfosPlace(LDate, lJour, lJourAnnee, LIndiceDemiJournee),
      );
    }
    lResult.invalide =
      lResult.nonTravaille || lResult.horsAnneScolaire || lResult.ferie;
    this._cache.infosPlace[aPlaceGrille] = lResult;
    return lResult;
  }
  getCouleurBordures() {
    return this._parametresGrille.modeDiagnostic
      ? this.couleur.grilleOccupation.bordure
      : this._options.couleurBordures;
  }
  traceCalqueCanvasFondDePlace(aPlace) {
    super.traceCalqueCanvasFondDePlace(aPlace);
    if (this._options.decorateurAbsences) {
      this._options.decorateurAbsences.traceFondDePlace(
        aPlace,
        this.getInfosDePlace(aPlace),
        this.traceCanvasHachure.bind(this),
      );
    }
  }
  traceCalqueCanvasQuadrillagedDePlace(aParams) {
    const lInfosPlace = this.getInfosDePlace(aParams.place);
    if (lInfosPlace.nonTravaille) {
      this.traceCanvasHachure({
        place: aParams.place,
        couleur: "black",
        traitD: false,
        traitG: true,
        genreCalque: _ObjetGrille_1._ObjetGrille.calque.quadrillage,
      });
    }
    super.traceCalqueCanvasQuadrillagedDePlace(aParams);
  }
  getContenuHtmlCellule(aPlaceGrille, aParams) {
    const T = [];
    if (
      this._parametresGrille.modeDiagnostic &&
      this._options.afficherPlacesLibreDiagnostic
    ) {
      const lDiagnoPlace = this._getDiagnosticDePlace(aPlaceGrille);
      if (!lDiagnoPlace) {
        T.push(this._construireCarrePlaceLibre(aParams, true));
      } else {
        let lAvecGabaritLibre = false;
        if (this._parametresGrille.gabarit) {
          for (
            let lPlace = aPlaceGrille - 1;
            aPlaceGrille - lPlace <=
            this._parametresGrille.gabarit.getDuree() - 1;
            lPlace--
          ) {
            if (
              lPlace >= 0 &&
              !this.getTrancheHoraireDePlace(lPlace, true).erreur &&
              !this._getDiagnosticDePlace(lPlace)
            ) {
              lAvecGabaritLibre = true;
              break;
            }
          }
        }
        if (lAvecGabaritLibre) {
          T.push(this._construireCarrePlaceLibre(aParams, false));
        }
      }
    } else {
      const lDispo = this._getDispoDePlace(aPlaceGrille);
      if (
        lDispo &&
        lDispo.libelle &&
        this.hauteurCellule > 13 &&
        this.largeurCellule > 50 &&
        [
          TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Priorite1,
          TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Priorite2,
          TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Priorite3,
        ].includes(lDispo.genre)
      ) {
        const lStyle = `top: ${aParams.top}px; left: ${aParams.left}px; height:${this.hauteurCellule - 1}px; width:${this.largeurCellule - 1}px;`;
        T.push(
          IE.jsx.str(
            IE.jsx.fragment,
            null,
            IE.jsx.str(
              "div",
              { class: "dispo-priorite-texte", style: lStyle },
              IE.jsx.str("label", null, lDispo.libelle),
            ),
          ),
        );
      }
    }
    return T.join("");
  }
  composeFondTrancheBlocHoraire(aNumeroTranche, aBlocHoraire) {
    const H = [
      super.composeFondTrancheBlocHoraire(aNumeroTranche, aBlocHoraire),
    ];
    const lTrancheHoraireDebut = {
      tranche: aNumeroTranche,
      horaire: aBlocHoraire.debut,
    };
    const lPlaceGrilleDebut =
      this.getPlaceDeTrancheHoraire(lTrancheHoraireDebut);
    const lInfosPlace = this.getInfosDePlace(lPlaceGrilleDebut);
    if (lInfosPlace.ferie || lInfosPlace.horsAnneScolaire) {
      H.push(
        this.construireLibelleInclineSurBlocHoraire({
          libelle: ObjetTraduction_1.GTraductions.getValeur("EDT.Ferie"),
          blocHoraire: aBlocHoraire,
        }),
      );
    }
    const lStageAM = this.estTrancheHoraireEnStage(lTrancheHoraireDebut, true);
    const lStagePM = this.estTrancheHoraireEnStage(lTrancheHoraireDebut, false);
    let lPlaceDebutStage = -1;
    let lPlaceFinStage = -1;
    if (lStageAM || lStagePM) {
      lPlaceDebutStage = lStageAM ? 0 : this._options.placeDemiJournee;
      lPlaceFinStage = lStagePM
        ? this.parametresSco.PlacesParJour - 1
        : this._options.placeDemiJournee - 1;
      H.push(
        this.composeVoileTranche({
          placeDebut: lPlaceDebutStage,
          placeFin: lPlaceFinStage,
          couleur: "#FFFFFF",
        }),
      );
      if (!lInfosPlace.ferie && !lInfosPlace.horsAnneScolaire) {
        H.push(
          this.construireLibelleInclineSurBlocHoraire({
            libelle: ObjetTraduction_1.GTraductions.getValeur("EDT.Stage"),
            placeDebut: lPlaceDebutStage,
            placeFin: lPlaceFinStage,
            blocHoraire: aBlocHoraire,
          }),
        );
      }
    }
    if (
      this._options.decorateurAbsences &&
      !this._parametresGrille.multiSemaines
    ) {
      const lNumeroSemaine =
        this._options.convertisseurPosition.getSemaineDeTrancheHoraire(
          lTrancheHoraireDebut,
        );
      const lNumeroJour =
        this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
          lTrancheHoraireDebut,
        );
      this._options.decorateurAbsences
        .getVoilesTranchesExclusions(lNumeroJour, lNumeroSemaine)
        .forEach((aVoile) => {
          if (lPlaceDebutStage >= 0 && lPlaceFinStage >= 0) {
            if (lPlaceDebutStage === 0) {
              aVoile.placeDebut = lPlaceFinStage + 1;
            } else {
              aVoile.placeFin = lPlaceDebutStage - 1;
            }
          }
          if (
            aVoile.placeDebut >= 0 &&
            aVoile.placeFin >= 0 &&
            aVoile.placeFin < this.parametresSco.PlacesParJour &&
            aVoile.placeDebut < aVoile.placeFin
          ) {
            H.push(this.composeVoileTranche(aVoile));
          }
        });
    }
    this.getTabAbsencesRessource(aNumeroTranche, aBlocHoraire).forEach(
      (aAbs) => {
        H.push(
          this.composeVoileTranche({
            placeDebut: aAbs.placeGrilleDebut,
            placeFin: aAbs.placeGrilleFin,
            couleur: "#FFFFFF",
          }),
        );
      },
    );
    return H.join("");
  }
  getHintCellule(aPlace) {
    const lTrancheHoraire = this.getTrancheHoraireDePlace(aPlace);
    const lBlocHoraire = this._options.blocHoraires.rechercheHoraire(
      lTrancheHoraire.horaire,
    );
    const lTrancheHoraireDebut = {
      tranche: lTrancheHoraire.tranche,
      horaire: lBlocHoraire.debut,
    };
    const lInfosPlace = this.getInfosDePlace(
      this.getPlaceDeTrancheHoraire(lTrancheHoraireDebut),
    );
    let lLibelle = "";
    if (
      lInfosPlace.ferie &&
      !this._parametresGrille.multiSemaines &&
      !this._parametresGrille.estEDTAnnuel
    ) {
      const lDate =
        this._options.convertisseurPosition.getDateDeTrancheHoraire(
          lTrancheHoraireDebut,
        );
      if (lDate) {
        this.parametresSco.listeJoursFeries.parcourir((aFerie) => {
          if (
            aFerie &&
            aFerie.dateDebut &&
            aFerie.dateFin &&
            ObjetDate_1.GDate.dateEntreLesDates(
              lDate,
              aFerie.dateDebut,
              aFerie.dateFin,
            )
          ) {
            lLibelle = aFerie.getLibelle();
            return false;
          }
        });
      }
    }
    return lLibelle;
  }
  _construireCarrePlaceLibre(aParams, aLarge, aContenu) {
    const lEcartMin = 1,
      lEcartMax = 6;
    const lWidth = this.largeurCellule - 1,
      lHeight = this.hauteurCellule - 1;
    const lDiv = 6;
    const lDivEtroit = 3,
      lEcartMinEtroit = 2;
    let lEcartEtroit = lEcartMinEtroit;
    const lEcart = Math.min(
      lEcartMax,
      Math.max(lEcartMin, Math.floor(Math.min(lHeight, lWidth) / lDiv)),
    );
    if (!aLarge) {
      lEcartEtroit = Math.max(
        lEcartMinEtroit,
        Math.floor(
          (this._options.grilleInverse ? lHeight : lWidth) / lDivEtroit,
        ),
      );
    }
    const lEcartHeight =
      this._options.grilleInverse && !aLarge ? lEcartEtroit : lEcart;
    const lEcartWidth =
      !this._options.grilleInverse && !aLarge ? lEcartEtroit : lEcart;
    return (
      '<div style="position:absolute;' +
      ObjetStyle_1.GStyle.composeCouleurFond(
        this.couleur.grilleOccupation.placeLibre,
      ) +
      "top:" +
      (aParams.top + lEcartHeight) +
      "px;" +
      ObjetStyle_1.GStyle.composeHeight(lHeight - 2 * lEcartHeight) +
      "left:" +
      (aParams.left + lEcartWidth) +
      "px;" +
      ObjetStyle_1.GStyle.composeWidth(lWidth - 2 * lEcartWidth) +
      '">' +
      (aContenu ? aContenu : "") +
      "</div>"
    );
  }
  getCouleurFondDePlaceEDT(aPlaceGrille) {
    let lCouleur;
    if (this._options.decorateurAbsences) {
      const lPlaceHebdo =
        this._options.convertisseurPosition.getPlaceHebdoDePlaceGrille(
          aPlaceGrille,
        );
      lCouleur = this._options.decorateurAbsences.getCouleurFondDePlaceEDT(
        lPlaceHebdo,
        this.getInfosDePlace(aPlaceGrille),
      );
      if (lCouleur) {
        return lCouleur;
      }
    }
    const lDispo = this._getDispoDePlace(aPlaceGrille);
    if (lDispo) {
      switch (lDispo.genre) {
        case TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Voeu:
          return this.couleur.grille.voeu;
        case TypeGenreDisponibilite_1.TypeGenreDisponibilite
          .GD_IndisponibiliteSouple:
          return this.couleur.grille.indisponibiliteSouple;
        case TypeGenreDisponibilite_1.TypeGenreDisponibilite
          .GD_IndisponibiliteDure:
          return this.couleur.grille.indisponibilite;
        case TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Priorite1:
          return this.couleur.grille.priorite1;
        case TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Priorite2:
          return this.couleur.grille.priorite2;
        case TypeGenreDisponibilite_1.TypeGenreDisponibilite.GD_Priorite3:
          return this.couleur.grille.priorite3;
      }
    }
    return null;
  }
  getCouleurFond() {
    return this._parametresGrille.modeDiagnostic
      ? this.couleur.grilleOccupation.fond
      : this._options.couleurFond;
  }
  composeListeCours() {
    this.moduleCours.composeListeCours({
      id: this._cache.IdListeElements,
      idPiedTranche: this._options.afficherCoursHorsHoraire
        ? this._cache.idPiedTrancheConteneurAbs
        : "",
      listeCours: this._parametresGrille.listeCours,
      couleurBordureCours: this.getCouleurBordures(),
      grilleInverse: this._options.grilleInverse,
      avecCours: (aCours) => {
        return (
          aCours &&
          aCours.existe() &&
          this._options.convertisseurPosition.estCoursDansGrille(aCours)
        );
      },
      getClassCours: (aCours) => {
        const lClass = [];
        if (this._options.avecSelectionCours) {
          if (this._options.avecMenuContextuel) {
            lClass.push("Curseur_ClickDroit");
          } else if (
            this._options.avecSelection &&
            aCours &&
            aCours.avecSelection !== false
          ) {
            lClass.push("AvecMain");
          } else {
            lClass.push("SansMain");
          }
        }
        return lClass.join(" ");
      },
      getContenuNodeCours: function (aCours, aIndiceCours) {
        return (0, jsx_1.jsxFuncAttr)("getNodeCours", aIndiceCours);
      },
      getDroppableCours: (aCours, aIndiceCours) => {
        if (this._options.avecDrop && aCours && aCours.utilisable) {
          return tag_1.tag.funcAttr("dropCours", aIndiceCours);
        }
        return false;
      },
      classCoursMS: this._parametresGrille.modeDiagnostic
        ? "Image_HachureCoursSuperposeDiag"
        : "Image_HachureCoursSuperpose",
      couleurFondCoursMS: this._parametresGrille.modeDiagnostic
        ? this.couleur.grilleOccupation.fond
        : this._options.couleurFondCoursSuperpose
          ? this._options.couleurFondCoursSuperpose
          : this.couleur.grille.fondCoursSuperpose,
    });
  }
  calculerDebutEtFin() {
    if (!this._options.blocHoraires) {
      this._options.blocHoraires =
        new ObjetGrilleHoraires_1.ObjetGrilleHoraires().addBloc({
          debutBloc: 0,
          finBloc: this.parametresSco.PlacesParJour - 1,
        });
    }
    this._options.blocHoraires.initCache();
    super.calculerDebutEtFin();
    const lNbCours = this.ListeCours ? this.ListeCours.count() : 0;
    if (lNbCours) {
      this._options.blocHoraires.appliquerFiltre(
        (aBlocHoraire, aIndex, aGrilleHoraires) => {
          let lPlace;
          if (this._options.afficherDebutSelonCours) {
            aBlocHoraire.debut = aBlocHoraire.fin - 1;
            for (let I = 0; I < lNbCours; I++) {
              lPlace = this._options.convertisseurPosition.getPlaceDebutCours(
                this.ListeCours.get(I),
              );
              if (
                lPlace % this._options.blocHoraires.nbHoraires() <
                aBlocHoraire.debut
              ) {
                aBlocHoraire.debut =
                  lPlace % this._options.blocHoraires.nbHoraires();
              }
            }
          }
          if (this._options.afficherFinSelonCours) {
            aBlocHoraire.fin = 0;
            for (let I = 0; I < lNbCours; I++) {
              lPlace = this._options.convertisseurPosition.getPlaceFinCours(
                this.ListeCours.get(I),
              );
              if (
                lPlace % this._options.blocHoraires.nbHoraires() >
                aBlocHoraire.fin
              ) {
                aBlocHoraire.fin =
                  lPlace % this._options.blocHoraires.nbHoraires();
              }
            }
          }
        },
      );
    }
  }
  getCoursSelectionne() {
    return this.cours;
  }
  selectionnerElement(ANumeroElement, aSelectionNonManuelle) {
    if (this._avecSelectionElement()) {
      if (aSelectionNonManuelle) {
        this.deselectionnerElement();
      }
      this.NumeroElement = ANumeroElement;
      this.cours = this.ListeCours.get(this.NumeroElement);
      this.moduleCours.selectionnerCours(
        ANumeroElement,
        true,
        aSelectionNonManuelle,
      );
    }
  }
  deselectionnerElement() {
    if (this._avecSelectionElement()) {
      this.moduleCours.deselectionnerTout();
      if (this.NumeroElement > -1) {
        this.NumeroElement = -1;
      }
      this.cours = null;
    }
  }
  selectionnerElementParIndice(I, AAvecEvenement, aSelectionNonManuelle) {
    const lCours = this.ListeCours.get(I);
    if (lCours && lCours.coursMultiple) {
      return false;
    }
    (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
      this._selectionnerTranche(
        this._options.convertisseurPosition.getNumeroTrancheDeCours(lCours),
      );
      this.selectionnerElement(I, aSelectionNonManuelle);
      if (AAvecEvenement) {
        this._declencherEvenement();
      }
      this.$refresh();
    }, !this.ControleNavigation);
    return !!lCours;
  }
  getIndiceCoursParCours(aCoursCherche) {
    let lIndice = -1;
    if (this.ListeCours && aCoursCherche) {
      this.ListeCours.parcourir((aCours, aIndex) => {
        if (aCours.Visible === false && !aCours.estCoursMS) {
          return;
        }
        if (aCoursCherche.getNumero() !== aCours.getNumero()) {
          return;
        }
        if (
          aCoursCherche.numeroSemaine > 0 &&
          aCours.numeroSemaine &&
          aCoursCherche.numeroSemaine !== aCours.numeroSemaine
        ) {
          return;
        }
        if (aCoursCherche.ressource) {
          if (!aCours.ressource) {
            return;
          }
          if (
            aCoursCherche.ressource.getNumero() !== aCours.ressource.getNumero()
          ) {
            return;
          }
        }
        lIndice = aIndex;
        return false;
      });
    }
    return lIndice;
  }
  selectionnerCours(aCours, aAvecEvenement, aSelectionNonManuelle) {
    const lIndice = this.getIndiceCoursParCours(aCours);
    if (lIndice >= 0) {
      this.selectionnerElementParIndice(
        lIndice,
        aAvecEvenement === null || aAvecEvenement === undefined
          ? true
          : aAvecEvenement,
        aSelectionNonManuelle,
      );
      return true;
    }
    return false;
  }
  surMouseDownGrilleCellule(aPlace, aElement, aEvent) {
    if (
      GNavigateur.getBoutonSouris(aEvent.originalEvent) ===
      Enumere_BoutonSouris_1.EGenreBoutonSouris.Droite
    ) {
      return;
    }
    if (aEvent.pointerType === "touch") {
      return;
    }
    (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
      this.deselectionnerElement();
      this._selectionnerTranche(this.getTrancheHoraireDePlace(aPlace).tranche);
      if (this._options.evenementMouseDownPlace) {
        this._options.evenementMouseDownPlace({
          place: aPlace,
          element: aElement,
          event: aEvent,
        });
      }
      this.$refresh();
    }, !this.ControleNavigation);
  }
  getConvertisseurPosition() {
    return this._options.convertisseurPosition;
  }
  construireEDTListeAccessible(aParams, aTitre) {
    const lObjetListeArborescente =
      new ObjetListeArborescente_1.ObjetListeArborescente(
        this.Nom + "_Liste",
        0,
        this,
        null,
      );
    const lRacine = lObjetListeArborescente.construireRacine();
    lObjetListeArborescente.setParametres(false);
    const lNoeudListeCours = lObjetListeArborescente.ajouterUnNoeudAuNoeud(
      lRacine,
      "",
      aTitre,
      "Gras",
      true,
      true,
    );
    UtilitaireListeCoursAccessible_1.UtilitaireListeCoursAccessible.remplir(
      Object.assign(aParams, {
        listeArborescente: lObjetListeArborescente,
        nodeParent: lNoeudListeCours,
        estEDTAnnuel: this._parametresGrille.estEDTAnnuel,
      }),
    );
    return { liste: lObjetListeArborescente, racine: lRacine };
  }
  surPositionnerGabarit(aParamsGabarit) {
    if (this._options.avecCouleurCoursSousGabarit) {
      aParamsGabarit.placesPrecedentes.forEach((aPlace) => {
        this.traceCanvasFondRectDePlace(
          aPlace,
          this.getCouleurFondDePlaceEDT(aPlace),
        );
      });
      const lGabarit = aParamsGabarit.gabarit;
      if (
        lGabarit &&
        lGabarit.visible &&
        lGabarit.cours &&
        lGabarit.cours.CouleurFond
      ) {
        aParamsGabarit.placesCourantes.forEach((aPlace) => {
          this.traceCanvasFondRectDePlace(
            aPlace,
            this.couleur.getCouleurTransformationCours(
              lGabarit.cours.CouleurFond,
            ),
          );
        });
      }
    }
  }
  _getClassTitreHoraireDHoraire(aLigne) {
    const lClass = super._getClassTitreHoraireDHoraire(aLigne);
    return lClass;
  }
  _getDispoDePlace(aPlaceGrille) {
    let lResult = null;
    if (
      this._parametresGrille.disponibilites &&
      this._parametresGrille.disponibilites.length > 0
    ) {
      this._parametresGrille.disponibilites.every((aDispo) => {
        const lPlaceHebdo =
          this._options.convertisseurPosition.getPlaceHebdoDePlaceGrille(
            aPlaceGrille,
          );
        if (
          aDispo &&
          aDispo.placeDebut <= lPlaceHebdo &&
          aDispo.placeFin >= lPlaceHebdo
        ) {
          const lTrancheHoraire = this.getTrancheHoraireDePlace(aPlaceGrille);
          if (
            aDispo.domaine &&
            !aDispo.domaine.getValeur(
              this._options.convertisseurPosition.getSemaineDeTrancheHoraire(
                lTrancheHoraire,
              ),
            )
          ) {
            return true;
          }
          if (aDispo.ressource) {
            const lTranches =
              this._options.convertisseurPosition.getNumerosTranchesDeRessource(
                aDispo.ressource,
              );
            if (
              lTranches.length > 0 &&
              lTranches.indexOf(lTrancheHoraire.tranche) < 0
            ) {
              return true;
            }
          }
          lResult = aDispo;
          return false;
        }
        return true;
      });
    }
    return lResult;
  }
  _getIndicesTranchesSansDJNonTravailles(
    aHoraireDebut,
    aHoraireFin,
    aRessources,
  ) {
    const lResult = [];
    let lCourant = null;
    let lNumerosTranches = [];
    if (aRessources) {
      aRessources.parcourir((aRessource) => {
        lNumerosTranches = lNumerosTranches.concat(
          this._options.convertisseurPosition.getNumerosTranchesDeRessource(
            aRessource,
          ),
        );
      });
    }
    this._options.tranches.parcourir((aIndex, aTranche) => {
      const lPlaceDebut = this.getPlaceDeTrancheHoraire({
        horaire: aHoraireDebut,
        tranche: aTranche.numeroTranche,
      });
      const lPlaceFin = this.getPlaceDeTrancheHoraire({
        horaire: aHoraireFin,
        tranche: aTranche.numeroTranche,
      });
      if (
        !this.getInfosDePlace(lPlaceDebut).nonTravaille &&
        !this.getInfosDePlace(lPlaceFin).nonTravaille &&
        (lNumerosTranches.length === 0 ||
          lNumerosTranches.indexOf(aTranche.numeroTranche) >= 0)
      ) {
        if (!lCourant) {
          lCourant = {
            debut: aIndex,
            fin: aIndex,
            numeroTrancheDebut: aTranche.numeroTranche,
            numeroTrancheFin: aTranche.numeroTranche,
          };
          lResult.push(lCourant);
        } else if (lCourant.fin + 1 === aIndex) {
          lCourant.fin = aIndex;
          lCourant.numeroTrancheFin = aTranche.numeroTranche;
        } else {
          lCourant = null;
        }
      } else {
        lCourant = null;
      }
    });
    return lResult;
  }
  _composeRecreationsAvecDuree() {
    if (!this._options.avecRecreations || !this._options.recreations) {
      return;
    }
    const lRecreationsDuree = [];
    this._options.recreations.parcourir((aRecreation) => {
      if (aRecreation.duree) {
        if (!aRecreation.ressource) {
          lRecreationsDuree.push(aRecreation);
        } else {
          let lRecreationTrouve = null;
          lRecreationsDuree.every((aRecreationExistante) => {
            if (
              aRecreationExistante.place === aRecreation.place &&
              aRecreationExistante.duree === aRecreation.duree &&
              aRecreationExistante.getLibelle() === aRecreation.getLibelle()
            ) {
              lRecreationTrouve = aRecreationExistante;
              return false;
            }
            return true;
          });
          if (!lRecreationTrouve) {
            lRecreationTrouve =
              MethodesObjet_1.MethodesObjet.dupliquer(aRecreation);
            lRecreationsDuree.push(lRecreationTrouve);
            lRecreationTrouve.ressources =
              new ObjetListeElements_1.ObjetListeElements();
          }
          lRecreationTrouve.ressources.addElement(aRecreation.ressource);
        }
      }
    });
    const T = [];
    this._options.blocHoraires.parcourirBlocs((aBlocHoraire) => {
      lRecreationsDuree.forEach((aRecreation) => {
        const lHoraire = aBlocHoraire.debutBloc + aRecreation.place;
        let lHoraireDebut = lHoraire;
        let lHoraireFin = lHoraire + aRecreation.duree - 1;
        let lDescriptionHoraireDebut =
          this._options.blocHoraires.rechercheHoraire(lHoraireDebut);
        while (
          !lDescriptionHoraireDebut.trouve &&
          lHoraireDebut < lHoraireFin
        ) {
          lHoraireDebut += 1;
          lDescriptionHoraireDebut =
            this._options.blocHoraires.rechercheHoraire(lHoraireDebut);
        }
        let lDescriptionHoraireFin =
          this._options.blocHoraires.rechercheHoraire(lHoraireFin);
        while (!lDescriptionHoraireFin.trouve && lHoraireDebut < lHoraireFin) {
          lHoraireFin += -1;
          lDescriptionHoraireFin =
            this._options.blocHoraires.rechercheHoraire(lHoraireFin);
        }
        if (
          lDescriptionHoraireDebut.trouve &&
          lDescriptionHoraireFin.trouve &&
          lHoraireDebut <= lHoraireFin &&
          lHoraireDebut >= lDescriptionHoraireDebut.debut &&
          lHoraireFin <= lDescriptionHoraireDebut.fin
        ) {
          this._getIndicesTranchesSansDJNonTravailles(
            lHoraireDebut,
            lHoraireFin,
            aRecreation.ressources,
          ).forEach((aRangeTranche) => {
            const lCoordonnesDebut = this.getCoordonneesDePlace(
              this.getPlaceDeTrancheHoraire({
                horaire: lHoraireDebut,
                tranche: aRangeTranche.numeroTrancheDebut,
              }),
            );
            const lCoordonnesFin = this.getCoordonneesDePlace(
              this.getPlaceDeTrancheHoraire({
                horaire: lHoraireFin,
                tranche: aRangeTranche.numeroTrancheFin,
              }),
            );
            lCoordonnesDebut.top += -1;
            lCoordonnesDebut.left += -1;
            const lHeight =
              lCoordonnesFin.top - lCoordonnesDebut.top + this.hauteurCellule;
            const lWidth =
              lCoordonnesFin.left - lCoordonnesDebut.left + this.largeurCellule;
            T.push(
              '<div class="RecreationsDureeGrille" style="',
              ObjetStyle_1.GStyle.composeCouleurBordure(
                this.getCouleurBordures(),
              ),
              ObjetStyle_1.GStyle.composeCouleurFond(
                this._options.couleurRecreationAvecDuree,
              ),
              "left:" + lCoordonnesDebut.left + "px;",
              "top:" + lCoordonnesDebut.top + "px;",
              ObjetStyle_1.GStyle.composeHeight(lHeight),
              ObjetStyle_1.GStyle.composeWidth(lWidth),
              '">',
              '<div style="',
              this._options.grilleInverse
                ? ObjetStyle_1.GStyle.composeHeight(lWidth) +
                    ObjetStyle_1.GStyle.composeWidth(lHeight)
                : "",
              '"',
              ">",
              ObjetChaine_1.GChaine.format("%s %s %s %s %s", [
                aRecreation.getLibelle(),
                ObjetTraduction_1.GTraductions.getValeur("De"),
                ObjetDate_1.GDate.formatDate(
                  ObjetDate_1.GDate.placeEnDateHeure(aRecreation.place),
                  "%hh%sh%mm",
                ),
                ObjetTraduction_1.GTraductions.getValeur("A"),
                ObjetDate_1.GDate.formatDate(
                  ObjetDate_1.GDate.placeEnDateHeure(
                    aRecreation.place + aRecreation.duree - 1,
                    true,
                  ),
                  "%hh%sh%mm",
                ),
              ]),
              "</div>",
              "</div>",
            );
          });
        }
      });
    });
    if (T.length > 0) {
      IEHtml.injectHTML(
        ObjetHtml_1.GHtml.getElement(this.idConteneurAbsGrille),
        T.join(""),
        this.controleur,
        true,
      );
    }
  }
  _remplirTraitsHorairesDeJour(aBlocHoraire, aNumeroBloc) {
    let lAvecTraitDebut = false;
    let lAvecTraitFin = false;
    let lPlaceTraitDebut = 0;
    let lPlaceTraitFin = 0;
    let lCouleurTrait;
    const lPlacesOccupes = new TypeEnsembleNombre_1.TypeEnsembleNombre();
    const lPlaceJourDebut =
      this._options.blocHoraires.getNumeroHoraireSelonBloc(aBlocHoraire.debut);
    const lPlaceJourFin = this._options.blocHoraires.getNumeroHoraireSelonBloc(
      aBlocHoraire.fin,
    );
    if (this._options.avecSeparationDemiJAbsence) {
      lAvecTraitDebut = true;
      lPlaceTraitDebut =
        aBlocHoraire.debutBloc + this._options.placeDemiJournee;
      lCouleurTrait = this.couleur.grille.demiPensionInactive;
    } else if (this._options.avecDemiPension) {
      lAvecTraitDebut =
        this.parametresSco.debutDemiPension >= lPlaceJourDebut &&
        this.parametresSco.debutDemiPension <= lPlaceJourFin + 1;
      lAvecTraitFin =
        this.parametresSco.finDemiPension >= lPlaceJourDebut &&
        this.parametresSco.finDemiPension <= lPlaceJourFin + 1 &&
        this.parametresSco.debutDemiPension !==
          this.parametresSco.finDemiPension;
      lPlaceTraitDebut =
        aBlocHoraire.debutBloc + this.parametresSco.debutDemiPension;
      lPlaceTraitFin =
        aBlocHoraire.debutBloc + this.parametresSco.finDemiPension;
      lCouleurTrait = this.parametresSco.activationDemiPension
        ? this.couleur.grille.demiPensionActive
        : this.couleur.grille.demiPensionInactive;
    }
    if (lAvecTraitDebut || lAvecTraitFin) {
      if (GEtatUtilisateur.estAvecThemeAccessible()) {
        lCouleurTrait = this.couleur.getCouleurAccessible(lCouleurTrait);
      }
      if (lAvecTraitDebut) {
        this._cache.traitsHoraires.push({
          place: lPlaceTraitDebut,
          couleur: lCouleurTrait,
          numeroBlocHoraire: aNumeroBloc,
        });
        lPlacesOccupes.add(lPlaceTraitDebut);
      }
      if (lAvecTraitFin) {
        this._cache.traitsHoraires.push({
          place: lPlaceTraitFin,
          couleur: lCouleurTrait,
          numeroBlocHoraire: aNumeroBloc,
        });
        lPlacesOccupes.add(lPlaceTraitFin);
      }
    }
    if (this._options.avecRecreations && this._options.recreations) {
      this._options.recreations.parcourir((aRecreation) => {
        if (!aRecreation.duree && !lPlacesOccupes.contains(aRecreation.place)) {
          let lNumerosTranches = [-1];
          if (aRecreation.ressource) {
            lNumerosTranches =
              this._options.convertisseurPosition.getNumerosTranchesDeRessource(
                aRecreation.ressource,
              );
          }
          lNumerosTranches.forEach((aNumeroTranche) => {
            this._cache.traitsHoraires.push({
              place: aBlocHoraire.debutBloc + aRecreation.place,
              couleur: this.couleur.grille.recreations,
              numeroTranche: aNumeroTranche,
              numeroBlocHoraire: aNumeroBloc,
            });
          });
        }
      });
    }
  }
  _remplirTraitsHoraires() {
    this._cache.traitsHoraires = [];
    this._options.blocHoraires.parcourirBlocs((aBlocHoraire, aNumeroBloc) => {
      this._remplirTraitsHorairesDeJour(aBlocHoraire, aNumeroBloc);
    });
  }
  _remplirInfosPlace(aDate, aJour, aJourAnnee, aIndiceDemiJournee) {
    const lResult = {};
    if (aIndiceDemiJournee >= 0) {
      lResult.nonTravaille =
        !this.parametresSco.DemiJourneesOuvrees[aIndiceDemiJournee].contains(
          aJour,
        );
    } else {
      if (
        !this.parametresSco.DemiJourneesOuvrees[
          Enumere_DemiJours_1.EGenreDemiJours.Matin
        ].contains(aJour) &&
        !this.parametresSco.DemiJourneesOuvrees[
          Enumere_DemiJours_1.EGenreDemiJours.ApresMidi
        ].contains(aJour)
      ) {
        lResult.nonTravaille = true;
      }
    }
    lResult.horsAnneScolaire =
      !ObjetDate_1.GDate.estDateDansAnneeScolaire(aDate);
    lResult.ferie = this._options.joursFeries.getValeur(aJourAnnee);
    if (lResult.ferie) {
      this.parametresSco.listeJoursFeries.parcourir((aFerie) => {
        if (
          aFerie &&
          aFerie.dateDebut &&
          aFerie.dateFin &&
          ObjetDate_1.GDate.dateEntreLesDates(
            aDate,
            aFerie.dateDebut,
            aFerie.dateFin,
          )
        ) {
          lResult.libelleFerie = aFerie.getLibelle();
          return false;
        }
      });
    }
    return lResult;
  }
  _getDiagnosticDePlace(aPlace) {
    if (this._parametresGrille.diagnosticPlaces) {
      const lTrancheHoraire = this.getTrancheHoraireDePlace(aPlace),
        lPlace =
          this._options.convertisseurPosition.getPlaceHebdoDePlaceGrille(
            aPlace,
          );
      if (
        this._parametresGrille.diagnosticPlaces.ressourceDiagnostic &&
        this._options.convertisseurPosition
          .getNumerosTranchesDeRessource(
            this._parametresGrille.diagnosticPlaces.ressourceDiagnostic,
          )
          .indexOf(lTrancheHoraire.tranche) < 0
      ) {
        return {};
      }
      if (this._parametresGrille.diagnosticPlaces[lPlace]) {
        if (this._parametresGrille.estEDTAnnuel) {
          return this._parametresGrille.diagnosticPlaces[lPlace].diag;
        }
        const lSemaine =
          this._options.convertisseurPosition.getSemaineDeTrancheHoraire(
            lTrancheHoraire,
          );
        if (this._parametresGrille.diagnosticPlaces[lPlace][lSemaine]) {
          return this._parametresGrille.diagnosticPlaces[lPlace][lSemaine].diag;
        }
      }
    }
    return null;
  }
  _surContextMenuCours(aIndiceCours) {
    const lCours = this.ListeCours.get(aIndiceCours);
    const lParam = {
      genre: Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel,
      id: this.moduleCours.getIdCours(aIndiceCours),
      cours: lCours,
    };
    if (lCours.coursMultiple) {
      this.callback.appel(lParam);
      return;
    } else {
      (0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
        this._selectionnerTranche(
          this.getTrancheHoraireDePlace(
            this._options.convertisseurPosition.getPlaceDebutCours(
              this.ListeCours.get(aIndiceCours),
            ),
          ).tranche,
        );
        this.selectionnerElement(aIndiceCours, false);
        if (this.NumeroElement > -1) {
          lParam.date = lCours.DateDuCours;
          this.callback.appel(lParam);
        }
      }, !this.ControleNavigation);
    }
  }
  _selectionnerTranche(aNumeroTranche) {
    if (this._options.tranches.get(aNumeroTranche)) {
      const lUneTranche = this._options.tranches.count() === 1;
      if (this._options.classTitreSelectionTranche && !lUneTranche) {
        ObjetHtml_1.GHtml.delClass(
          this._cache.idTitreTranche + this._cache.numeroTrancheSelectionnee,
          this._options.classTitreSelectionTranche,
        );
      }
      this._cache.numeroTrancheSelectionnee = aNumeroTranche;
      if (this._options.classTitreSelectionTranche && !lUneTranche) {
        ObjetHtml_1.GHtml.addClass(
          this._cache.idTitreTranche + this._cache.numeroTrancheSelectionnee,
          this._options.classTitreSelectionTranche,
        );
      }
      this.deselectionnerElement();
    }
  }
  _avecSelectionElement() {
    if (this._options.avecSelection) {
      return true;
    }
    if (
      (GNavigateur.BoutonSouris ===
        Enumere_BoutonSouris_1.EGenreBoutonSouris.Droite ||
        GNavigateur.isToucheMenuContextuel()) &&
      this._options.avecMenuContextuel
    ) {
      return true;
    }
    return false;
  }
  _surEvenement(
    aEvent,
    aGenre,
    aIndiceCours,
    aIndiceContenu,
    aGenreImage,
    aAvecSelection,
  ) {
    GNavigateur.stopperEvenement(aEvent.originalEvent);
    const lCours = this.ListeCours.get(aIndiceCours);
    const lContenu =
      aIndiceContenu === null || aIndiceContenu === undefined
        ? lCours.ListeContenus.get(aIndiceContenu)
        : null;
    if (aAvecSelection) {
      this.selectionnerCours(lCours, false);
    }
    const lParam = {
      genre: aGenre,
      id: this.moduleCours.getIdCours(aIndiceCours),
      cours: lCours,
      contenu: lContenu,
      genreImage: aGenreImage,
    };
    this.callback.appel(lParam);
  }
  _declencherEvenement() {
    if (this.NumeroElement > -1) {
      const lCours = this.ListeCours.get(this.NumeroElement);
      const lConvertisseur = this._options.convertisseurPosition;
      const lParam = {
        genre: GNavigateur.isToucheMenuContextuel()
          ? Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel
          : Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours,
        id: this.moduleCours.getIdCours(this.NumeroElement),
        cours: lCours,
        date: lCours ? lCours.DateDuCours : null,
        coursMasquePartiel:
          lConvertisseur.getPlaceDebutCours(lCours, false) !==
            lConvertisseur.getPlaceDebutCours(lCours, true) ||
          lConvertisseur.getPlaceFinCours(lCours, false) !==
            lConvertisseur.getPlaceFinCours(lCours, true),
      };
      this.callback.appel(lParam);
    }
  }
  _surDropGrilleCellule(aParamsDrop, aIndiceCours) {
    if (this._options.callbackDropCellule) {
      this._options.callbackDropCellule(aIndiceCours, aParamsDrop);
    }
  }
  getTabAbsencesRessource(aNumeroTranche, aBlocHoraire) {
    const lResult = [];
    if (
      this._parametresGrille.listeAbsRessources &&
      this._parametresGrille.listeAbsRessources.length > 0
    ) {
      const lTrancheHoraireDebut = {
        tranche: aNumeroTranche,
        horaire: aBlocHoraire.debut,
      };
      const lPlaceGrilleDebut =
        this.getPlaceDeTrancheHoraire(lTrancheHoraireDebut);
      const lPlaceHebdoDebut =
        this._options.convertisseurPosition.getPlaceHebdoDePlaceGrille(
          lPlaceGrilleDebut,
        );
      const lPlaceHebdoFin =
        this._options.convertisseurPosition.getPlaceHebdoDePlaceGrille(
          this.getPlaceDeTrancheHoraire({
            tranche: aNumeroTranche,
            horaire: aBlocHoraire.fin,
          }),
        );
      const lPlacesAbsences = new TypeEnsembleNombre_1.TypeEnsembleNombre();
      this._parametresGrille.listeAbsRessources.forEach((aAbsence) => {
        if (
          aAbsence.place > lPlaceHebdoFin ||
          aAbsence.place + aAbsence.duree - 1 < lPlaceHebdoDebut
        ) {
          return;
        }
        if (aAbsence.ressource) {
          const lTranches =
            this._options.convertisseurPosition.getNumerosTranchesDeRessource(
              aAbsence.ressource,
            );
          if (lTranches.indexOf(aNumeroTranche) === -1) {
            return;
          }
        }
        if (
          aAbsence.numeroSemaine !==
          this._options.convertisseurPosition.getSemaineDeTrancheHoraire(
            lTrancheHoraireDebut,
          )
        ) {
          return;
        }
        const lPlaceDebut =
          Math.max(aAbsence.place, lPlaceHebdoDebut) %
          this.parametresSco.PlacesParJour;
        const lPlaceFin =
          Math.min(aAbsence.place + aAbsence.duree - 1, lPlaceHebdoFin) %
          this.parametresSco.PlacesParJour;
        for (let lPlace = lPlaceDebut; lPlace <= lPlaceFin; lPlace++) {
          lPlacesAbsences.add(lPlace);
        }
      });
      let lPlaceDebut = -1;
      const lTabPlaces = lPlacesAbsences.items();
      lTabPlaces.forEach((aPlace, aIndex) => {
        if (lPlaceDebut < 0) {
          lPlaceDebut = aPlace;
        }
        if (lTabPlaces[aIndex + 1] !== aPlace + 1) {
          lResult.push({
            placeGrilleDebut: lPlaceDebut,
            placeGrilleFin: aPlace,
          });
          lPlaceDebut = -1;
        }
      });
    }
    return lResult;
  }
}
exports.ObjetGrille = ObjetGrille;
