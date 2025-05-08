const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { GUID } = require("GUID.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { GChaine } = require("ObjetChaine.js");
const { Identite } = require("ObjetIdentite.js");
const { GDate } = require("ObjetDate.js");
const { UtilitaireUrl } = require("UtilitaireUrl.js");
const { GHtml } = require("ObjetHtml.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetTri } = require("ObjetTri.js");
const IEHtml = require("IEHtml.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
  ObjetMoteurFormSaisieMobile,
} = require("ObjetMoteurFormSaisieMobile.js");
require("IEHtml.InputNote_Mobile.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { tag } = require("tag.js");
const { EEvent } = require("Enumere_Event.js");
const {
  ObjetRequeteCategorieEvaluation,
} = require("ObjetRequeteCategorieEvaluation.js");
const {
  ObjetFenetre_CategorieEvaluation,
} = require("ObjetFenetre_CategorieEvaluation.js");
const {
  ObjetFenetre_ActionContextuelle,
} = require("ObjetFenetre_ActionContextuelle.js");
const {
  UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { ObjetFenetre_FichiersCloud } = require("ObjetFenetre_FichiersCloud.js");
class ObjetPanelEditionDevoir extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.moteurNotes = new MoteurNotes();
    this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
    this.moteurFormSaisie = new ObjetMoteurFormSaisieMobile();
    this.ids = {
      panel: "PanelEditionDevoir",
      commentaire: GUID.getId(),
      bareme: GUID.getId(),
      coefficient: GUID.getId(),
      ramenerSur20: GUID.getId(),
      verrouille: GUID.getId(),
      titreFacultatif: GUID.getId(),
      zoneFacultatif: GUID.getId(),
      cbfacultatif: GUID.getId(),
      selectSujet: GUID.getId(),
      selectCorrige: GUID.getId(),
      fileSujet: GUID.getId(),
      fileCorrige: GUID.getId(),
      periode: GUID.getId(),
    };
    this.dimensions = {
      largeurSelecFile: 80,
      largeurMaxUrlSelecFile: 200,
      largeurPeriodes: 100,
      carreDevoirFac: 15,
      hauteurCB: 50,
      hauteurPied: 50,
      hauteurDate: 60,
      hauteurCommentaire: 68,
      hauteurNotes: 45,
      largeurNotes: 60,
      hauteurSelectFile: 50,
      hauteurRameneSur20: 60,
      hauteurTheme: 60,
      hauteurCategorie: 60,
    };
    this.maxCommentaire = this.moteurNotes.getTailleMaxCommentaire();
    this.paramCalendrier = {
      avecBoutonsPrecedentSuivant: false,
      avecSelectionJoursNonOuvres: true,
      avecSelectionJoursFeries: true,
    };
    this.instanceSelectDateDevoir = _instancierCalendrier.call(
      this,
      _evntSelectDateDevoir.bind(this),
    );
    this.instanceSelectDatePublication = _instancierCalendrier.call(
      this,
      _evntSelectDatePublication.bind(this),
    );
    this.instanceSelecteurCategorie =
      this.moteurFormSaisie.instancierSelecteurCategorie(
        this,
        _evntCategorie.bind(this),
      );
    _instancierMultiSelectTheme.call(this);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      nodeFlecheRetour: {
        event: function () {
          _annulerEditionDevoir.call(aInstance);
        },
      },
      btnAnnuler: {
        event: function () {
          _annulerEditionDevoir.call(aInstance);
        },
        getDisabled: function () {
          return false;
        },
      },
      btnValider: {
        event: function () {
          aInstance.callback.appel({
            commande: ObjetPanelEditionDevoir.commandes.valider,
            devoir: aInstance.devoir,
            estCreation: aInstance.donnees.estCreation,
          });
        },
        getDisabled: function () {
          return false;
        },
      },
      nodePoubelle: {
        event: function () {
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GTraductions.getValeur(
              "FenetreDevoir.ConfirmerSuppression",
            ),
            callback: function (aGenreBouton) {
              if (aGenreBouton === EGenreAction.Valider) {
                const lDevoir = this.devoir;
                lDevoir.setEtat(EGenreEtat.Suppression);
                this.callback.appel({
                  commande: ObjetPanelEditionDevoir.commandes.supprimer,
                  devoir: lDevoir,
                });
              }
            }.bind(aInstance),
          });
        },
        getDisabled: function () {
          return (
            aInstance.donnees.estCreation ||
            aInstance.devoir.verrouille ||
            aInstance.donnees.clotureGlobal
          );
        },
      },
      getStyleLabel: function () {
        return { color: GCouleur.themeNeutre.foncee };
      },
      getStyle: function () {
        return {
          "font-weight": 400,
          "font-size": 14,
          "margin-top": 20,
          "margin-bottom": 20,
        };
      },
      commentaire: {
        getValue: function () {
          return aInstance.devoir.commentaire;
        },
        setValue: function (aValue) {
          if (aValue.length <= aInstance.maxCommentaire) {
            aInstance.devoir.commentaire = aValue;
            aInstance.devoir.setEtat(EGenreEtat.Modification);
          }
        },
        getClasseLabel: function () {
          const lDevoir = aInstance.devoir;
          return !!lDevoir &&
            !!lDevoir.commentaire &&
            lDevoir.commentaire.length > 0
            ? "active"
            : "";
        },
        node: function () {
          $(this.node).on("focus", function () {
            $(this).select();
            return false;
          });
        },
        getDisabled: function () {
          return (
            _estChampInactif.call(aInstance) ||
            aInstance.devoir.commentaireVerrouille
          );
        },
        getStyleValeur: function () {
          return { fontWeight: 400, fontSize: 14, color: GCouleur.noir };
        },
        getStyleLabel: function () {
          const lDevoir = aInstance.devoir;
          const lStyle = {
            fontWeight: 400,
            color: GCouleur.themeNeutre.foncee,
          };
          const lSurcharge =
            !!lDevoir && !!lDevoir.commentaire && lDevoir.commentaire.length > 0
              ? {}
              : { fontSize: 14 };
          return $.extend({}, lStyle, lSurcharge);
        },
      },
      bareme: {
        getNote: function () {
          return aInstance.devoir.bareme;
        },
        setNote: function (aNote) {
          if (aNote === null) {
            return;
          }
          aInstance.moteurNotesCP.surEditionBareme(
            aNote.chaine,
            aInstance.devoir,
            aInstance.donnees.estCreation,
            function (aNote) {
              this.devoir.bareme = aNote;
              this.devoir.setEtat(EGenreEtat.Modification);
            }.bind(aInstance),
          );
        },
        getOptionsNote: function () {
          return {
            avecVirgule: true,
            sansNotePossible: false,
            avecAnnotation: false,
            min: 1.0,
            max: aInstance.moteurNotesCP.getBaremeDevoirMaximal(),
            avecSigneMoins: false,
            hintSurErreur: false,
            htmlContexte:
              '<div class="Gras">' +
              GTraductions.getValeur("FenetreDevoir.Bareme") +
              "</div>",
          };
        },
        getDisabled: function () {
          if (
            aInstance.donnees.avecQCM &&
            aInstance.devoir.executionQCM &&
            aInstance.devoir.executionQCM.existeNumero()
          ) {
            return true;
          } else {
            return (
              _estChampInactif.call(aInstance) ||
              aInstance.devoir.baremeVerrouille
            );
          }
        },
      },
      coeff: {
        getNote: function () {
          return aInstance.devoir.coefficient;
        },
        setNote: function (aNote) {
          if (aNote === null) {
            return;
          }
          const lNote = aInstance.moteurNotesCP.controlerNote(
            aNote.chaine,
            0.0,
            99.0,
          );
          if (!lNote.estValide) {
            GApplication.getMessage().afficher({
              message: lNote.msgInfoNoteInvalide,
            });
          } else {
            aInstance.devoir.coefficient = lNote.note;
            aInstance.devoir.setEtat(EGenreEtat.Modification);
          }
        },
        getOptionsNote: function () {
          return {
            avecVirgule: true,
            sansNotePossible: false,
            avecAnnotation: false,
            min: 0.0,
            max: 99.0,
            avecSigneMoins: false,
            hintSurErreur: false,
            htmlContexte:
              '<div class="Gras">' +
              GTraductions.getValeur("FenetreDevoir.Coefficient") +
              "</div>",
          };
        },
        getDisabled: function () {
          return (
            _estChampInactif.call(aInstance) ||
            !!aInstance.devoir.coeffVerrouille
          );
        },
      },
      date: {
        getClasseLabel: function () {
          return "active";
        },
      },
      checkSur20: {
        getValue: function () {
          return aInstance.devoir.ramenerSur20;
        },
        setValue: function (aValue) {
          aInstance.devoir.ramenerSur20 = aValue;
          aInstance.devoir.setEtat(EGenreEtat.Modification);
        },
        getDisabled: function () {
          const lDevoir = aInstance.devoir;
          return (
            _estChampInactif.call(aInstance) ||
            _getBaremeParDefaut.call(aInstance) === lDevoir.bareme.getValeur()
          );
        },
      },
      verrouille: {
        getValue: function () {
          return aInstance.devoir.verrouille;
        },
        setValue: function (aValue) {
          aInstance.devoir.verrouille = aValue;
          aInstance.devoir.setEtat(EGenreEtat.Modification);
          actualiserFichierSujet.call(aInstance, { devoir: aInstance.devoir });
          actualiserFichierCorrige.call(aInstance, {
            devoir: aInstance.devoir,
          });
          aInstance.updateDates();
        },
        getDisabled: function () {
          return aInstance.donnees.cloture || !aInstance.donnees.actif;
        },
      },
      facultatif: {
        getValue: function () {
          return (
            aInstance.devoir.commeUnBonus === true ||
            aInstance.devoir.commeUneNote === true
          );
        },
        setValue: function () {
          aInstance.afficherModaleDevoirFac();
        },
        getDisabled: function () {
          return _estChampInactif.call(aInstance);
        },
        getStyleValeur: function () {
          return { fontWeight: 400, fontSize: 14, color: GCouleur.noir };
        },
        getStyleLabel: function () {
          return { fontWeight: 400, color: GCouleur.themeNeutre.foncee };
        },
      },
      selectDocument: function (aGenre) {
        const lAvecFile =
          aGenre === TypeFichierExterneHttpSco.DevoirSujet
            ? aInstance.moteurNotesCP._avecSujetDevoir({
                devoir: aInstance.devoir,
              })
            : aInstance.moteurNotesCP._avecCorrigeDevoir({
                devoir: aInstance.devoir,
              });
        const lActif = !_estDocumentNonEditable.call(aInstance) && !lAvecFile;
        const lListe =
          aGenre === TypeFichierExterneHttpSco.DevoirSujet
            ? aInstance.devoir.listeSujets
            : aInstance.devoir.listeCorriges;
        $(this.node).eventValidation((aEvent) => {
          const lThis = aInstance;
          if (lActif) {
            const lTabActions = [];
            lTabActions.push({
              libelle: GTraductions.getValeur(
                "fenetre_ActionContextuelle.depuisMesDocuments",
              ),
              icon: "icon_folder_open",
              selecFile: true,
              optionsSelecFile: {
                maxSize: aInstance.moteurNotes.getTailleMaxPieceJointe(),
              },
              event(aParamsInput) {
                if (aParamsInput) {
                  const lPJ = _getPJ.call(aInstance, {
                    devoir: aInstance.devoir,
                    typeFichierExterne: aGenre,
                  });
                  if (lPJ) {
                    const lLibelleFile = lPJ.getLibelle();
                    const lMsg =
                      aGenre === TypeFichierExterneHttpSco.DevoirSujet
                        ? GChaine.format(
                            GTraductions.getValeur(
                              "FenetreDevoir.MsgConfirmModifSujet",
                            ),
                            [lLibelleFile],
                          )
                        : GChaine.format(
                            GTraductions.getValeur(
                              "FenetreDevoir.MsgConfirmModifCorrige",
                            ),
                            [lLibelleFile],
                          );
                    GApplication.getMessage().afficher({
                      type: EGenreBoiteMessage.Confirmation,
                      message: lMsg,
                      callback: function (aGenreBouton) {
                        if (aGenreBouton === EGenreAction.Valider) {
                          _surModifFile.call(this, {
                            typeFichierExterne: aGenre,
                            devoir: this.devoir,
                            eltFichier: aParamsInput.eltFichier,
                          });
                        }
                      }.bind(aInstance),
                    });
                  } else {
                    _surModifFile.call(aInstance, {
                      typeFichierExterne: aGenre,
                      devoir: aInstance.devoir,
                      eltFichier: aParamsInput.eltFichier,
                    });
                  }
                }
              },
              class: "bg-util-marron-claire",
            });
            const lParams = {
              genre: aGenre,
              listeElements: lListe,
              callback: lThis.surModifCloud,
            };
            lTabActions.push({
              libelle: GTraductions.getValeur(
                "fenetre_ActionContextuelle.depuisMonCloud",
              ),
              icon: "icon_cloud",
              event: function () {
                lThis.ouvrirPJCloud(lParams);
              }.bind(this),
              class: "bg-util-marron-claire",
            });
            ObjetFenetre_ActionContextuelle.ouvrir(lTabActions, {
              pere: lThis,
            });
            aEvent.stopImmediatePropagation();
            aEvent.preventDefault();
          }
        });
      },
      gestionDocument: {
        getDisabled: function (aGenre) {
          const lAvecFile =
            aGenre === TypeFichierExterneHttpSco.DevoirSujet
              ? aInstance.moteurNotesCP._avecSujetDevoir({
                  devoir: aInstance.devoir,
                })
              : aInstance.moteurNotesCP._avecCorrigeDevoir({
                  devoir: aInstance.devoir,
                });
          return _estDocumentNonEditable.call(aInstance) || lAvecFile;
        },
      },
      selecFile: {
        getOptionsSelecFile: function () {
          return {
            maxSize: aInstance.moteurNotes.getTailleMaxPieceJointe(),
            interrompreClick: true,
          };
        },
        addFiles: function (aGenre, aParams) {
          const lPJ = _getPJ.call(aInstance, {
            devoir: aInstance.devoir,
            typeFichierExterne: aGenre,
          });
          if (lPJ) {
            const lLibelleFile = lPJ.getLibelle();
            const lMsg =
              aGenre === TypeFichierExterneHttpSco.DevoirSujet
                ? GChaine.format(
                    GTraductions.getValeur(
                      "FenetreDevoir.MsgConfirmModifSujet",
                    ),
                    [lLibelleFile],
                  )
                : GChaine.format(
                    GTraductions.getValeur(
                      "FenetreDevoir.MsgConfirmModifCorrige",
                    ),
                    [lLibelleFile],
                  );
            GApplication.getMessage().afficher({
              type: EGenreBoiteMessage.Confirmation,
              message: lMsg,
              callback: function (aGenreBouton) {
                if (aGenreBouton === EGenreAction.Valider) {
                  _surModifFile.call(this, {
                    typeFichierExterne: aGenre,
                    devoir: this.devoir,
                    eltFichier: aParams.eltFichier,
                  });
                }
              }.bind(aInstance),
            });
          } else {
            _surModifFile.call(aInstance, {
              typeFichierExterne: aGenre,
              devoir: aInstance.devoir,
              eltFichier: aParams.eltFichier,
            });
          }
        },
        getDisabled: function (aGenre) {
          const lAvecFile =
            aGenre === TypeFichierExterneHttpSco.DevoirSujet
              ? aInstance.moteurNotesCP._avecSujetDevoir({
                  devoir: aInstance.devoir,
                })
              : aInstance.moteurNotesCP._avecCorrigeDevoir({
                  devoir: aInstance.devoir,
                });
          return _estDocumentNonEditable.call(aInstance) || lAvecFile;
        },
        getStyleLabel: function () {
          return {
            fontWeight: 400,
            color: GCouleur.themeNeutre.foncee,
            fontSize: 14,
          };
        },
        getIcone: function () {
          return '<i class="icon_piece_jointe"></i>';
        },
      },
      chipsSujetCorrige: {
        eventBtn: function (aIndice, aGenre) {
          const lMsg =
            aGenre === TypeFichierExterneHttpSco.DevoirSujet
              ? GTraductions.getValeur("FenetreDevoir.MsgConfirmSupprSujet")
              : GTraductions.getValeur("FenetreDevoir.MsgConfirmSupprCorrige");
          GApplication.getMessage().afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: lMsg,
            callback: function (aGenreBouton) {
              if (aGenreBouton === EGenreAction.Valider) {
                _surSuppressionFile.call(this, {
                  typeFichierExterne: aGenre,
                  devoir: this.devoir,
                });
              }
            }.bind(aInstance),
          });
        },
      },
      nodePeriode: function () {
        $(this.node).on("click", () => {
          _afficherModalePeriodes.call(aInstance, { devoir: aInstance.devoir });
        });
      },
      getHtmlInfoPublicationDecaleeParents() {
        let lMessageDateDecaleeAuxParents = "";
        if (
          aInstance.devoir &&
          GParametres.avecAffichageDecalagePublicationNotesAuxParents &&
          !!GParametres.nbJDecalagePublicationAuxParents
        ) {
          let lDatePublicationDecalee = GDate.formatDate(
            GDate.getJourSuivant(
              aInstance.devoir.datePublication,
              GParametres.nbJDecalagePublicationAuxParents,
            ),
            " %JJ/%MM",
          );
          if (GParametres.nbJDecalagePublicationAuxParents === 1) {
            lMessageDateDecaleeAuxParents = GTraductions.getValeur(
              "FenetreDevoir.DecalageUnJourPublicationParentsSoitLe",
              [lDatePublicationDecalee],
            );
          } else {
            lMessageDateDecaleeAuxParents = GTraductions.getValeur(
              "FenetreDevoir.DecalageXJoursPublicationParentsSoitLe",
              [
                GParametres.nbJDecalagePublicationAuxParents,
                lDatePublicationDecalee,
              ],
            );
          }
        }
        return lMessageDateDecaleeAuxParents;
      },
      avecInfoPublicationDecaleeParents() {
        return (
          aInstance.devoir &&
          GParametres.avecAffichageDecalagePublicationNotesAuxParents &&
          !!GParametres.nbJDecalagePublicationAuxParents
        );
      },
      CBRemarque: {
        getValue() {
          return (
            aInstance.devoir && aInstance.devoir.avecCommentaireSurNoteEleve
          );
        },
        async setValue(aValue) {
          if (aInstance.devoir) {
            if (!aValue && _avecUnCommentaireSurNote(aInstance.devoir)) {
              const lRes = await GApplication.getMessage().afficher({
                type: EGenreBoiteMessage.Confirmation,
                message: GTraductions.getValeur(
                  "Notes.confirmationSupressionCommentaireSurNote",
                ),
              });
              if (lRes === EGenreAction.Valider) {
                aInstance.devoir.avecCommentaireSurNoteEleve =
                  !aInstance.devoir.avecCommentaireSurNoteEleve;
              }
              return;
            }
            aInstance.devoir.avecCommentaireSurNoteEleve =
              !aInstance.devoir.avecCommentaireSurNoteEleve;
          }
        },
      },
    });
  }
  avecDepotCloud() {
    return GEtatUtilisateur.listeCloud.count() > 0;
  }
  ouvrirPJCloud(aParams) {
    const lThis = this;
    const lParamsDonnees = Object.assign(
      {
        instance: lThis,
        genre: TypeFichierExterneHttpSco.Aucun,
        listeElements: null,
        callback: null,
      },
      aParams,
    );
    let lParams = {
      callbaskEvenement: function (aLigne) {
        if (aLigne >= 0) {
          lParamsDonnees.service = GEtatUtilisateur.listeCloud.get(aLigne);
          lThis.choisirFichierCloud(lParamsDonnees);
        }
      },
      modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
    };
    UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
  }
  surModifCloud(aParam) {
    this.devoir.setEtat(EGenreEtat.Modification);
    switch (aParam.genre) {
      case TypeFichierExterneHttpSco.DevoirSujet:
        actualiserFichierSujet.call(this, { devoir: this.devoir });
        break;
      case TypeFichierExterneHttpSco.DevoirCorrige:
        actualiserFichierCorrige.call(this, { devoir: this.devoir });
        break;
    }
  }
  choisirFichierCloud(aParams) {
    const lParams = Object.assign(
      {
        instance: null,
        genre: TypeFichierExterneHttpSco.Aucun,
        listeElements: null,
        callback: null,
      },
      aParams,
    );
    return new Promise((aResolve) => {
      ObjetFenetre.creerInstanceFenetre(ObjetFenetre_FichiersCloud, {
        pere: lParams.instance,
        evenement: function (aParam) {
          if (
            aParam.listeNouveauxDocs &&
            aParam.listeNouveauxDocs.count() === 1
          ) {
            const lElement = aParam.listeNouveauxDocs.get(0);
            lParams.listeElements.addElement(lElement, 0);
            if (lParams.callback) {
              lParams.callback.call(lParams.instance, lParams);
            }
            aResolve(true);
          }
        },
        initialiser(aFenetre) {
          aFenetre.setOptionsFenetre({
            callbackApresFermer() {
              aResolve();
            },
          });
        },
      }).setDonnees({ service: lParams.service.Genre });
    });
  }
  setDonnees(aDonnees) {
    this.donnees = aDonnees;
    this.devoirOriginel = this.donnees.devoir;
    this.devoir = MethodesObjet.dupliquer(this.donnees.devoir);
    if (_avecSelectionService.call(this)) {
      this.instanceSelecteurService = Identite.creerInstance(ObjetSelection, {
        pere: this,
        evenement: function (aCtx, aParam) {
          _surSelectionService.call(this, {
            devoir: aCtx.devoir,
            selection: aParam,
          });
        }.bind(this, { devoir: this.devoir }),
      });
      _initSelecteurService.call(this, this.instanceSelecteurService);
    }
  }
  getHtmlPanel() {
    const lHtml = [];
    lHtml.push(
      '<div class="FormSaisie ofm-design" id="',
      this.ids.panel,
      '">',
      _composePanelEditionDevoir.call(this),
      "</div>",
    );
    return lHtml.join("");
  }
  getTitrePanel() {
    return this.donnees.estCreation
      ? GTraductions.getValeur("Notes.CreerDevoir")
      : GTraductions.getValeur("Notes.ModifierDevoir");
  }
  updateDates() {
    const leDevoirAUneEvaluationAvecPeriodeCloturee =
      this.moteurNotes.leDevoirAUneEvaluationAvecPeriodeCloturee(this.devoir);
    const lDateDevoirActive = !(
      _estChampInactif.call(this) || leDevoirAUneEvaluationAvecPeriodeCloturee
    );
    _updateDate.call(
      this,
      this.instanceSelectDateDevoir,
      this.devoir.date,
      lDateDevoirActive,
    );
    const lDatePublicationActive =
      this.donnees.actif &&
      !this.devoir.verrouille &&
      !leDevoirAUneEvaluationAvecPeriodeCloturee;
    this.instanceSelectDatePublication.setOptionsObjetCelluleDate({
      premiereDate: this.devoir.date,
    });
    _updateDate.call(
      this,
      this.instanceSelectDatePublication,
      this.devoir.datePublication,
      lDatePublicationActive,
    );
  }
  updateContent() {
    this.updateDates();
    _updateMultiSelectTheme.call(this);
    _actualiserCategorieEvaluation.call(this);
    if (_avecSelectionService.call(this)) {
      if (
        this.donnees.infosServices &&
        this.donnees.infosServices.listeService
      ) {
        const lIndiceParDefaut =
          this.donnees.infosServices.listeService.getIndiceElementParFiltre(
            (aElt) => {
              return (
                aElt.getNumero() ===
                this.donnees.infosServices.serviceDefaut.getNumero()
              );
            },
          );
        this.instanceSelecteurService.setDonnees(
          this.donnees.infosServices.listeService,
          lIndiceParDefaut,
          null,
          "",
        );
      }
    }
  }
  afficherModaleDevoirFac() {
    const lInstance = this;
    ObjetFenetre.creerInstanceFenetre(
      ObjetFenetre,
      {
        pere: this,
        initialiser(aFenetre) {
          aFenetre.controleur.cbChoixFacultatif = {
            getValue: function (aTypeChoix) {
              const lDevoir = lInstance.devoir;
              switch (aTypeChoix) {
                case ObjetPanelEditionDevoir.typeDevoirFacultatif.aucun:
                  return !lDevoir.commeUneNote && !lDevoir.commeUnBonus;
                case ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUnBonus:
                  return lDevoir.commeUnBonus;
                case ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUneNote:
                  return lDevoir.commeUneNote;
                default:
                  return false;
              }
            },
            setValue: function (aTypeChoix) {
              const lDevoir = lInstance.devoir;
              switch (aTypeChoix) {
                case ObjetPanelEditionDevoir.typeDevoirFacultatif.aucun:
                  lDevoir.commeUnBonus = false;
                  lDevoir.commeUneNote = false;
                  lDevoir.setEtat(EGenreEtat.Modification);
                  break;
                case ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUnBonus:
                  lDevoir.commeUnBonus = true;
                  lDevoir.commeUneNote = false;
                  lDevoir.setEtat(EGenreEtat.Modification);
                  break;
                case ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUneNote:
                  lDevoir.commeUnBonus = false;
                  lDevoir.commeUneNote = true;
                  lDevoir.setEtat(EGenreEtat.Modification);
                  break;
              }
              actualiserDevoirFacultatif.call(lInstance, { devoir: lDevoir });
              aFenetre.fermer();
            },
            getDisabled: function () {
              return _estChampInactif.call(lInstance);
            },
          };
        },
      },
      {
        listeBoutons: [GTraductions.getValeur("Fermer")],
        fermerFenetreSurClicHorsFenetre: true,
        avecCroixFermeture: false,
      },
    ).afficher(_composeContenuModaleChoixFacultatif.call(this));
  }
}
ObjetPanelEditionDevoir.commandes = {
  annuler: "annuler",
  valider: "valider",
  supprimer: "supprimer",
};
ObjetPanelEditionDevoir.typeDevoirFacultatif = {
  aucun: "aucun",
  commeUnBonus: "commeUnBonus",
  commeUneNote: "commeUneNote",
};
function _estDocumentNonEditable() {
  return !this.donnees.actif || !this.devoir || this.devoir.verrouille;
}
function _getPJ(aParam) {
  let lPJ;
  const lDevoir = aParam.devoir;
  switch (aParam.typeFichierExterne) {
    case TypeFichierExterneHttpSco.DevoirSujet:
      if (this.moteurNotesCP._avecSujetDevoir({ devoir: lDevoir })) {
        lPJ = lDevoir.listeSujets.get(0);
      }
      break;
    case TypeFichierExterneHttpSco.DevoirCorrige:
      if (this.moteurNotesCP._avecCorrigeDevoir({ devoir: lDevoir })) {
        lPJ = lDevoir.listeCorriges.get(0);
      }
  }
  return lPJ;
}
function _surModifFile(aParam) {
  aParam.devoir.setEtat(EGenreEtat.Modification);
  switch (aParam.typeFichierExterne) {
    case TypeFichierExterneHttpSco.DevoirSujet:
      aParam.devoir.listeSujets.addElement(aParam.eltFichier, 0);
      actualiserFichierSujet.call(this, { devoir: aParam.devoir });
      break;
    case TypeFichierExterneHttpSco.DevoirCorrige:
      aParam.devoir.listeCorriges.addElement(aParam.eltFichier, 0);
      actualiserFichierCorrige.call(this, { devoir: aParam.devoir });
      break;
  }
}
function _surSuppressionFile(aParam) {
  const lGenreFichier = aParam.typeFichierExterne;
  const lDevoir = aParam.devoir;
  const lPJ = _getPJ.call(this, aParam);
  if (lPJ) {
    lDevoir.setEtat(EGenreEtat.Modification);
    lPJ.setEtat(EGenreEtat.Suppression);
    switch (lGenreFichier) {
      case TypeFichierExterneHttpSco.DevoirSujet:
        actualiserFichierSujet.call(this, { devoir: lDevoir });
        break;
      case TypeFichierExterneHttpSco.DevoirCorrige:
        actualiserFichierCorrige.call(this, { devoir: lDevoir });
    }
    IEHtml.refresh();
  }
}
function _estChampInactif() {
  return this.donnees.cloture || !this.donnees.actif || this.devoir.verrouille;
}
function _annulerEditionDevoir() {
  this.callback.appel({
    commande: ObjetPanelEditionDevoir.commandes.annuler,
    devoir: this.devoirOriginel,
  });
}
function _composeDate(aInstanceSelectDate, aTitre) {
  return this.moteurFormSaisie.composeDate({
    id: aInstanceSelectDate.getNom(),
    label: aTitre,
    classLabel: "date.getClasseLabel",
    styleLabel: "getStyleLabel",
    hauteur: this.dimensions.hauteurDate,
  });
}
function _composeDateDevoir() {
  return _composeDate.call(
    this,
    this.instanceSelectDateDevoir,
    GTraductions.getValeur("FenetreDevoir.DateDevoir"),
  );
}
function _composeDatePublication() {
  const H = [];
  H.push(
    _composeDate.call(
      this,
      this.instanceSelectDatePublication,
      GTraductions.getValeur("FenetreDevoir.DateDePublication"),
    ),
  );
  H.push(
    '<div class="field-contain" ie-html="getHtmlInfoPublicationDecaleeParents" ie-if="avecInfoPublicationDecaleeParents"></div>',
  );
  return H.join("");
}
function _composeCommentaire() {
  return this.moteurFormSaisie.composeFormTextArea({
    id: this.ids.commentaire,
    model: "commentaire",
    label: GTraductions.getValeur("FenetreDevoir.Commentaire"),
    maxLength: this.maxCommentaire,
    classLabel: "commentaire.getClasseLabel",
    styleLabel: "commentaire.getStyleLabel",
    hauteur: this.dimensions.hauteurCommentaire,
    placeholder: GTraductions.getValeur(
      "FenetreDevoir.RedigezVotreCommentaire",
    ),
  });
}
function _composeInputNote(aParam) {
  return this.moteurFormSaisie.composeFormInputNote({
    id: aParam.id,
    model: aParam.model,
    label: aParam.label,
    maxLength: aParam.maxLength,
    hauteur: this.dimensions.hauteurNotes,
    largeur: this.dimensions.largeurNotes,
  });
}
function _composeBareme() {
  const H = [];
  H.push(
    _composeInputNote.call(this, {
      model: "bareme",
      id: this.ids.bareme,
      label: GTraductions.getValeur("FenetreDevoir.Bareme"),
      maxLength: this.moteurNotesCP.getMaxLengthBareme(true),
    }),
  );
  return H.join("");
}
function _composeCoefficient() {
  const H = [];
  H.push(
    _composeInputNote.call(this, {
      model: "coeff",
      id: this.ids.coefficient,
      label: GTraductions.getValeur("FenetreDevoir.Coefficient"),
      maxLength: 7,
    }),
  );
  return H.join("");
}
function _composeOptionRamenerSur20() {
  const H = [];
  const lIdCBSur20 = this.ids.ramenerSur20;
  H.push(
    '<div class="field-contain devoirs-contain">',
    '<ie-checkbox id="',
    lIdCBSur20,
    '" ie-model="checkSur20" class="iecbrbdroite">',
    GChaine.format(GTraductions.getValeur("FenetreDevoir.Ramenersur20"), [
      _getBaremeParDefaut.call(this),
    ]),
    "</ie-checkbox>",
    "</div>",
  );
  return H.join("");
}
function _getBaremeParDefaut() {
  return this.donnees.baremeParDefaut !== null &&
    this.donnees.baremeParDefaut !== undefined
    ? this.donnees.baremeParDefaut.getValeur()
    : 20;
}
function _composeDevoirVerrouille(aParam) {
  const H = [];
  if (aParam.estCtxEdition) {
    const lIdVerrouille = this.ids.verrouille;
    H.push(
      '<div class="field-contain lock-contain">',
      '<i class="icon_lock i-as-deco"></i>',
      '<ie-checkbox id="',
      lIdVerrouille,
      '" ie-model="verrouille">',
      GTraductions.getValeur("FenetreDevoir.Verrouille"),
      "</ie-checkbox>",
      "</div>",
    );
  }
  return H.join("");
}
function _avecSelectionService() {
  return (
    this.donnees.estCreation &&
    this.donnees.infosServices !== null &&
    this.donnees.infosServices !== undefined &&
    this.donnees.infosServices.avecSelectionService === true
  );
}
function _composeSelectionService() {
  const H = [];
  if (_avecSelectionService.call(this)) {
    H.push('<div class="field-contain">');
    H.push(
      '<label for="',
      this.instanceSelecteurService.getNom(),
      '" class="active" ie-style="getStyleLabel">',
      GTraductions.getValeur("FenetreDevoir.Service"),
      "</label>",
    );
    H.push('<div id="', this.instanceSelecteurService.getNom(), '"></div>');
    H.push("</div>");
  }
  return H.join("");
}
function _surSelectionService(aParam) {
  const lDevoir = aParam.devoir;
  lDevoir.service = aParam.selection.element;
  lDevoir.estDevoirEditable = lDevoir.service.getActif();
}
function _initSelecteurService(aInstance) {
  aInstance.setParametres({ avecBoutonsPrecedentSuivant: false, icone: null });
}
function _avecUnCommentaireSurNote(aDevoir) {
  let lResult = false;
  if (!aDevoir || !aDevoir.listeEleves) {
    return lResult;
  }
  aDevoir.listeEleves.parcourir((aEleve) => {
    if (aEleve.commentaire && aEleve.commentaire.length > 0) {
      lResult = true;
      return false;
    }
  });
  return lResult;
}
function _composeDevoir(aParam) {
  const lParam = {
    devoir: aParam.devoir,
    estCtxEdition: aParam.modeCreation === false,
  };
  const lDevoir = aParam.devoir;
  const H = [];
  if (lDevoir !== null && lDevoir !== undefined) {
    H.push(`<div class="Fenetre_Contenu">`);
    H.push(_composeSelectionService.call(this, lParam));
    H.push(_composeDateDevoir.call(this, lParam));
    H.push(_composeDatePublication.call(this, lParam));
    H.push('<div class="pj-global-conteneur no-line p-y p-x-l">');
    H.push(_composeSujet.call(this, lParam));
    H.push("</div>");
    H.push('<div class="pj-global-conteneur p-top p-bottom-l p-x-l">');
    H.push(_composeCorrige.call(this, lParam));
    H.push("</div>");
    H.push(_composeRemarque.call(this, lParam));
    H.push(_composePeriode.call(this, lParam));
    H.push(_composeBareme.call(this, lParam));
    H.push(_composeCoefficient.call(this, lParam));
    H.push(_composeOptionRamenerSur20.call(this, lParam));
    H.push(_composeDevoirFacultatif.call(this, lParam));
    H.push(_composeCategorie.call(this, lParam));
    H.push(_composeCommentaire.call(this, lParam));
    if (GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
      H.push(_composeTheme.call(this, lParam));
    }
    H.push(_composeDevoirVerrouille.call(this, lParam));
    H.push(`</div>`);
  }
  return H.join("");
}
function _composePiedPanel() {
  const H = [];
  H.push(
    `<div class="compose-bas">\n            <ie-btnicon class="icon_trash avecFond i-medium" ie-model="nodePoubelle" ${GObjetWAI.composeAttribut({ genre: EGenreAttribut.label, valeur: GTraductions.getValeur("Supprimer") })}></ie-btnicon>\n          </div>`,
  );
  H.push('<div class="repeat-bouton">');
  H.push(
    '<ie-bouton ie-model="btnAnnuler" class="' +
      TypeThemeBouton.secondaire +
      '">',
    GTraductions.getValeur("Annuler"),
    "</ie-bouton>",
  );
  H.push("</div>");
  H.push('<div class="repeat-bouton">');
  H.push(
    '<ie-bouton ie-model="btnValider" class="' +
      TypeThemeBouton.primaire +
      '">',
    GTraductions.getValeur("Valider"),
    "</ie-bouton>",
  );
  H.push("</div>");
  return H.join("");
}
function _composePanelEditionDevoir() {
  const H = [];
  H.push(
    '<div class="content">',
    _composeDevoir.call(this, {
      modeCreation: this.donnees.estCreation,
      devoir: this.devoir,
    }),
    "</div>",
  );
  H.push("<footer>", _composePiedPanel.call(this, {}), "</footer>");
  return H.join("");
}
function _instancierCalendrier(aEvnt) {
  return this.moteurFormSaisie.instancierCalendrier(aEvnt, this, {
    avecBoutonsPrecedentSuivant: false,
  });
}
function _evntSelectDateDevoir(aDate) {
  if (!GDate.estJourEgal(aDate, this.devoir.date)) {
    this.devoir.date = aDate;
    this.devoir.setEtat(EGenreEtat.Modification);
    this.devoir.datePublication = this.devoir.date;
    this.instanceSelectDatePublication.setOptionsObjetCelluleDate({
      premiereDate: this.devoir.date,
    });
    this.instanceSelectDatePublication.setDonnees(this.devoir.datePublication);
  }
}
function _evntSelectDatePublication(aDate) {
  this.devoir.datePublication = aDate;
  this.devoir.setEtat(EGenreEtat.Modification);
}
function _updateDate(aInstance, aDate, aActif) {
  aInstance.initialiser();
  aInstance.setDonnees(aDate, true);
  if (aActif !== null && aActif !== undefined) {
    aInstance.setActif(aActif);
  }
}
function _composeTheme() {
  return this.moteurFormSaisie.composeMultiSelecteurTheme({
    id: this.instanceMultiSelectTheme.getNom(),
    label: GTraductions.getValeur("Themes"),
    styleLabel: "getStyleLabel",
    hauteur: this.dimensions.hauteurTheme,
  });
}
function _instancierMultiSelectTheme() {
  this.instanceMultiSelectTheme =
    this.moteurFormSaisie.instancierMultiSelecteurTheme(
      _evtCellMultiSelectionTheme.bind(this),
      this,
    );
}
function _evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
  if (aGenreBouton === 1) {
    this.devoir.ListeThemes = aListeSelections;
    this.devoir.setEtat(EGenreEtat.Modification);
  }
}
function _updateMultiSelectTheme() {
  this.instanceMultiSelectTheme.initialiser();
  this.moteurFormSaisie.updateMultiSelectTheme({
    instanceSelect: this.instanceMultiSelectTheme,
    liste: this.devoir.ListeThemes || new ObjetListeElements(),
    matiere: this.devoir.service.estUnService
      ? this.devoir.service.matiere
      : this.devoir.service.pere.matiere,
    libelleCB: this.devoir.libelleCBTheme,
  });
}
function _composeCategorie() {
  return this.moteurFormSaisie.composeCategorie({
    id: this.instanceSelecteurCategorie.getNom(),
    label: GTraductions.getValeur("FenetreDevoir.Categorie"),
    hauteur: this.dimensions.hauteurCategorie,
  });
}
function _evntCategorie(aGenreEvent) {
  if (aGenreEvent === EEvent.SurKeyUp || aGenreEvent === EEvent.SurMouseDown) {
    ObjetFenetre.creerInstanceFenetre(ObjetFenetre_CategorieEvaluation, {
      pere: this,
      evenement(aParams) {
        if (
          !!aParams.categorieSelectionnee &&
          aParams.categorieSelectionnee.existe()
        ) {
          this.devoir.categorie = aParams.categorieSelectionnee;
        }
        _actualiserCategorieEvaluation.call(this);
      },
      initialiser() {},
    }).setDonnees({
      listeCategories: this.listeCategories,
      avecMultiSelection: false,
      avecCreation: true,
      tailleMax: this.tailleMaxCategorie,
    });
  }
}
function _actualiserCategorieEvaluation() {
  const lParam = {
    classe: this.devoir.service.classe,
    service: this.devoir.service,
  };
  new ObjetRequeteCategorieEvaluation(
    this,
    _actionSurRequeteCategorie.bind(this),
  ).lancerRequete(lParam);
}
function _actionSurRequeteCategorie(aParam) {
  this.listeCategories = aParam.listeCategories;
  this.tailleMaxCategorie = aParam.tailleMax;
  this.devoir.categorie =
    !!this.devoir.categorie && this.devoir.categorie.existe()
      ? this.listeCategories.getElementParLibelle(
          this.devoir.categorie.getLibelle(),
        )
      : undefined;
  this.instanceSelecteurCategorie.initialiser();
  this.instanceSelecteurCategorie.setLibelle(
    this.devoir && this.devoir.categorie
      ? this.devoir.categorie.getLibelle()
      : "",
  );
}
function _composeSelecteurFichier(aParam) {
  const H = [];
  const lIdSelectFile = aParam.idSelectFile;
  const lmodel = this.avecDepotCloud()
    ? `ie-node="selectDocument('${aParam.typeFichierExterne}')" ie-model="gestionDocument('${aParam.typeFichierExterne}')"`
    : `ie-model="selecFile('${aParam.typeFichierExterne}')" ie-selecfile`;
  H.push(
    `<ie-btnselecteur class="pj" id="${lIdSelectFile}" ${lmodel} role="button">${aParam.strLabel}</ie-btnselecteur>`,
  );
  return H.join("");
}
function _composeFichierCourant(aParam) {
  const H = [];
  H.push(
    UtilitaireUrl.construireListeUrls(aParam.listeFichiers, {
      genreRessource: aParam.typeFichierExterne,
      IEModelChips: aParam.estEditable === true ? "chipsSujetCorrige" : null,
      argsIEModelChips: [aParam.typeFichierExterne],
      maxWidth: aParam.width,
    }),
  );
  return H.join("");
}
function _composeZoneFichier(aParam) {
  const H = [];
  const lWidthSelecteur = aParam.width;
  H.push(
    _composeSelecteurFichier.call(this, {
      strLabel: aParam.strLabel,
      idSelectFile: aParam.idSelectFile,
      width: lWidthSelecteur,
      typeFichierExterne: aParam.typeFichierExterne,
    }),
  );
  H.push('<div id="', aParam.idZoneFile, '" class="docs-joints">');
  const lAvecSujet = aParam.avecFichier;
  if (lAvecSujet) {
    H.push(
      _composeFichierCourant.call(this, {
        listeFichiers: aParam.listeFichiers,
        typeFichierExterne: aParam.typeFichierExterne,
        estEditable: aParam.estEditable,
        width: this.dimensions.largeurMaxUrlSelecFile,
      }),
    );
  }
  H.push("</div>");
  return H.join("");
}
function actualiserFichier(aParam) {
  GHtml.setHtml(
    aParam.idFile,
    _composeFichierCourant.call(this, {
      listeFichiers: aParam.listeFichiers,
      typeFichierExterne: aParam.typeFichierExterne,
      estEditable: aParam.estEditable,
      width: this.dimensions.largeurMaxUrlSelecFile,
    }),
    { instance: this },
  );
}
function _composeSujet(aParam) {
  const lDevoir = aParam.devoir;
  if (
    this.moteurNotesCP._autoriseSujetEtCorrigeDevoir({
      avecQCM: this.donnees.avecQCM,
      devoir: lDevoir,
    })
  ) {
    return _composeZoneFichier.call(this, {
      strLabel: GTraductions.getValeur("Notes.AjoutSujet"),
      idSelectFile: this.ids.selectSujet,
      idZoneFile: this.ids.fileSujet,
      avecFichier: this.moteurNotesCP._avecSujetDevoir({ devoir: lDevoir }),
      listeFichiers: lDevoir.listeSujets,
      typeFichierExterne: this.moteurNotes.getEGenreSujet(),
      width: this.dimensions.largeurSelecFile,
      estEditable: !_estDocumentNonEditable.call(this),
    });
  }
  return "";
}
function actualiserFichierSujet(aParam) {
  actualiserFichier.call(this, {
    idFile: this.ids.fileSujet,
    listeFichiers: aParam.devoir.listeSujets,
    typeFichierExterne: this.moteurNotes.getEGenreSujet(),
    estEditable: !_estDocumentNonEditable.call(this),
  });
}
function _composeCorrige(aParam) {
  const lDevoir = aParam.devoir;
  if (
    this.moteurNotesCP._autoriseSujetEtCorrigeDevoir({
      avecQCM: this.donnees.avecQCM,
      devoir: lDevoir,
    })
  ) {
    return _composeZoneFichier.call(this, {
      strLabel: GTraductions.getValeur("Notes.AjoutCorrige"),
      idSelectFile: this.ids.selectCorrige,
      idZoneFile: this.ids.fileCorrige,
      avecFichier: this.moteurNotesCP._avecCorrigeDevoir({ devoir: lDevoir }),
      listeFichiers: lDevoir.listeCorriges,
      typeFichierExterne: this.moteurNotes.getEGenreCorrige(),
      width: this.dimensions.largeurSelecFile,
      estEditable: !_estDocumentNonEditable.call(this),
    });
  }
  return "";
}
function actualiserFichierCorrige(aParam) {
  actualiserFichier.call(this, {
    idFile: this.ids.fileCorrige,
    listeFichiers: aParam.devoir.listeCorriges,
    typeFichierExterne: this.moteurNotes.getEGenreCorrige(),
    estEditable: !_estDocumentNonEditable.call(this),
  });
}
function _getStrDevoirFacultatif(aParam) {
  const lDevoir = aParam.devoir;
  if (lDevoir.commeUnBonus) {
    return GTraductions.getValeur("FenetreDevoir.CommeUnBonus");
  } else {
    if (lDevoir.commeUneNote) {
      return GTraductions.getValeur("FenetreDevoir.CommeUneNote");
    } else {
      return GTraductions.getValeur("FenetreDevoir.DevoirFacultatif");
    }
  }
}
function _getStrTitreFacultatif(aParam) {
  const lDevoir = aParam.devoir;
  if (lDevoir.commeUnBonus || lDevoir.commeUneNote) {
    return GTraductions.getValeur("FenetreDevoir.DevoirFacultatif");
  } else {
    return "";
  }
}
function actualiserDevoirFacultatif(aParam) {
  const lDevoir = aParam.devoir;
  GHtml.setHtml(
    this.ids.zoneFacultatif,
    _composeZoneFacultatif.call(this, { devoir: lDevoir }),
    { instance: this },
  );
  GHtml.setHtml(
    this.ids.titreFacultatif,
    _getStrTitreFacultatif.call(this, { devoir: lDevoir }),
    { instance: this },
  );
}
function _composeContenuModaleChoixFacultatif() {
  const H = [];
  H.push('<div class="Espace">');
  const lTab = [
    {
      type: ObjetPanelEditionDevoir.typeDevoirFacultatif.aucun,
      label: GTraductions.getValeur("FenetreDevoir.FacultatifAucun"),
    },
    {
      type: ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUnBonus,
      label: GTraductions.getValeur("FenetreDevoir.FacultatifBonus"),
    },
    {
      type: ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUneNote,
      label: GTraductions.getValeur("FenetreDevoir.FacultatifNote"),
    },
  ];
  const lStyle =
    "border-bottom: solid 1px " + GCouleur.themeNeutre.claire + "; ";
  const lHeight = "height:" + this.dimensions.hauteurCB + "px; width:100%;";
  for (let i = 0, lNbr = lTab.length; i < lNbr; i++) {
    const lElt = lTab[i];
    const lCouleur = this.moteurNotesCP.getBgColorDevoirFacultatif({
      commeUnBonus:
        lElt.type === ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUnBonus,
      commeUneNote:
        lElt.type === ObjetPanelEditionDevoir.typeDevoirFacultatif.commeUneNote,
    });
    const lbgCouleur = "background-color : " + lCouleur + "; ";
    H.push(
      '<div style="',
      i < lNbr - 1 ? lStyle : "",
      lHeight,
      '" class="NoWrap">',
      '<div class="AlignementMilieuVertical InlineBlock EspaceDroit" style="height:',
      this.dimensions.carreDevoirFac,
      "px; width:",
      this.dimensions.carreDevoirFac,
      "px; ",
      lbgCouleur,
      '">&nbsp;</div>',
      '<div class="AlignementMilieuVertical InlineBlock EspaceGauche" style="width:calc(100% - ',
      this.dimensions.carreDevoirFac,
      'px); ">',
      '<ie-radio class="Espace" ie-model="cbChoixFacultatif(\'',
      lElt.type,
      "')\">",
      lElt.label,
      "</ie-radio>",
      "</div>",
      '<div class="AlignementMilieuVertical InlineBlock" style="height:100%; width:0px">&nbsp</div>',
      "</div>",
    );
  }
  H.push("</div>");
  return H.join("");
}
function _composeDevoirFacultatif(aParam) {
  const H = [];
  H.push(
    '<div class="field-contain facultatif-contain">',
    '<label class="active" id="',
    this.ids.titreFacultatif,
    '" for="',
    this.ids.zoneFacultatif,
    '">',
    _getStrTitreFacultatif.call(this, aParam),
    "</label>",
    '<div id="',
    this.ids.zoneFacultatif,
    '" class="flex-contain flex-center self-end m-bottom">',
    _composeZoneFacultatif.call(this, aParam),
    "</div>",
    "</div>",
  );
  return H.join("");
}
function _composeZoneFacultatif(aParam) {
  const H = [];
  const lLabel = _getStrDevoirFacultatif.call(this, { devoir: aParam.devoir });
  const lId = this.ids.cbfacultatif;
  const lAvecCouleur = aParam.devoir.commeUnBonus || aParam.devoir.commeUneNote;
  const lCouleur = aParam.devoir.commeUnBonus
    ? GCouleur.devoir.commeUnBonus
    : aParam.devoir.commeUneNote
      ? GCouleur.devoir.commeUneNote
      : "transparent";
  const lbgCouleur = lAvecCouleur ? "background-color : " + lCouleur : "";
  H.push(
    '<div class="facultatif-carre" style="',
    lbgCouleur,
    '" ></div>',
    '<ie-checkbox class="m-left" id="',
    lId,
    '" ie-model="facultatif">',
    lLabel,
    "</ie-checkbox>",
  );
  return H.join("");
}
function _composeRemarque(aParam) {
  const H = [];
  H.push('<div class="field-contain">');
  H.push(
    `<ie-checkbox ie-model="CBRemarque">${GTraductions.getValeur("FenetreDevoir.activerCommentaireSurNotes")}</ie-checkbox>`,
  );
  H.push("</div>");
  return H.join("");
}
function _getStrPeriodes(aListePeriodes) {
  const H = [];
  if (aListePeriodes !== null && aListePeriodes !== undefined) {
    aListePeriodes.parcourir((aPeriode) => {
      const lLibelle = aPeriode.getLibelle();
      if (lLibelle !== "") {
        H.push(lLibelle);
      }
    });
  }
  return H.join(", ");
}
function _composePeriode(aParam) {
  const H = [];
  H.push(
    '<div id="',
    this.ids.periode,
    '" ie-node="nodePeriode" class="field-contain">',
  );
  H.push(_composePeriodes.call(this, aParam));
  H.push("</div>");
  return H.join("");
}
function _composePeriodes(aParam) {
  const H = [];
  const lDevoir = aParam.devoir;
  H.push(
    '<label class="active">',
    GTraductions.getValeur("FenetreDevoir.Periodes"),
    "</label>",
  );
  if (lDevoir && lDevoir.listeClasses) {
    lDevoir.listeClasses.parcourir((aClasse) => {
      H.push('<div class="periode-conteneur">');
      H.push(
        '    <span class="classe-libelle">',
        aClasse.getLibelle(),
        "</span>",
      );
      const lStrPeriodes = _getStrPeriodes.call(this, aClasse.listePeriodes);
      H.push('      <span class="periodes">', lStrPeriodes, "</span>");
      H.push("</div>");
    });
  }
  return H.join("");
}
function actualiserPeriodes(aParam) {
  GHtml.setHtml(
    aParam.idPeriodes,
    _composePeriodes.call(this, { devoir: aParam.devoir }),
    { instance: this },
  );
}
function _afficherModalePeriodes(aParam) {
  ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre,
    {
      pere: this,
      initialiser(aFenetre) {
        aFenetre.controleur.combo = {
          event(aIndexClasse, aIndexPeriode, aParams) {
            if (!aParams.estSelectionManuelle) {
              return;
            }
            const lClasse = aParam.devoir.listeClasses.get(aIndexClasse);
            const lSelectionPrec = lClasse.listePeriodes.get(aIndexPeriode);
            const lNewSelection = aParams.element;
            if (lSelectionPrec.getNumero() !== lNewSelection.getNumero()) {
              const lPeriodeDevoir = lClasse.listePeriodes.getElementParNumero(
                lNewSelection.getNumero(),
              );
              if (lPeriodeDevoir === null || lPeriodeDevoir === undefined) {
                aParam.devoir.setEtat(EGenreEtat.Modification);
                lSelectionPrec.setNumero(lNewSelection.getNumero());
                lSelectionPrec.setLibelle(
                  lNewSelection.existeNumero()
                    ? lNewSelection.getLibelle()
                    : "",
                );
                lSelectionPrec.setActif(true);
                lSelectionPrec.setEtat(EGenreEtat.Modification);
                lSelectionPrec.estEvaluationCloturee =
                  lNewSelection.estEvaluationCloturee;
              } else {
                GApplication.getMessage().afficher({
                  type: EGenreBoiteMessage.Information,
                  message: GTraductions.getValeur("Notes.PeriodeDejaAffectee"),
                });
              }
            }
          },
          getDisabled(aIndexClasse, aIndexPeriode) {
            const lClasse = aParam.devoir.listeClasses.get(aIndexClasse);
            const lPeriode = lClasse.listePeriodes.get(aIndexPeriode);
            return (
              (lPeriode.getNumero() && !lPeriode.getActif()) ||
              aParam.devoir.verrouille
            );
          },
        };
      },
    },
    {
      titre: GTraductions.getValeur("FenetreDevoir.PeriodesDevoir"),
      listeBoutons: [GTraductions.getValeur("Fermer")],
      fermerFenetreSurClicHorsFenetre: true,
    },
  )
    .afficher(_composePeriodesDuDevoir.call(this, { devoir: aParam.devoir }))
    .then(() => {
      actualiserPeriodes.call(this, {
        idPeriodes: this.ids.periode,
        devoir: this.devoir,
      });
    });
}
function _composePeriodesDuDevoir(aParam) {
  const lDevoir = aParam.devoir;
  const H = [];
  if (lDevoir && lDevoir.listeClasses) {
    lDevoir.listeClasses.parcourir((aClasse, aIndexClasse) => {
      const lClasse = this.donnees.listeClasses.getElementParNumero(
        aClasse.getNumero(),
      );
      const lListePeriodes = lClasse.listePeriodes;
      lListePeriodes
        .setTri([ObjetTri.init("Genre"), ObjetTri.init("Libelle")])
        .trier();
      H.push('<div class="Espace" style="width:100%">');
      H.push('<div class="Gras Texte14">');
      H.push(aClasse.getLibelle());
      H.push("</div>");
      aClasse.listePeriodes.parcourir((aPeriodeClasse, aIndexPeriode) => {
        const lIdLabel = GUID.getId();
        H.push(
          tag(
            "div",
            { class: "Espace" },
            tag(
              "label",
              { id: lIdLabel, class: "active" },
              GTraductions.getValeur("FenetreDevoir.PeriodeNotation")[
                aIndexPeriode
              ],
            ) +
              tag(
                "ie-combo",
                {
                  "aria-labelledby": lIdLabel,
                  "ie-model": tag.funcAttr("combo", [
                    aIndexClasse,
                    aIndexPeriode,
                  ]),
                },
                (aTab) => {
                  lListePeriodes.parcourir((aPeriode) => {
                    if (aIndexPeriode > 0 || aPeriode.existeNumero()) {
                      aTab.push(
                        tag(
                          "option",
                          {
                            value: aPeriode.getNumero(),
                            selected:
                              aPeriode.getNumero() ===
                              aPeriodeClasse.getNumero()
                                ? "selected"
                                : false,
                          },
                          aPeriode.getLibelle(),
                        ),
                      );
                    }
                  });
                },
              ),
          ),
        );
      });
      H.push("</div>");
    });
  }
  return H.join("");
}
module.exports = { ObjetPanelEditionDevoir };
