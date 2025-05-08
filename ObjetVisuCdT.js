const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GUID } = require("GUID.js");
const { ObjetMoteurCDT: MoteurCDT } = require("ObjetMoteurCahierDeTextes.js");
const { EGenreEvntCdT } = require("ObjetMoteurCahierDeTextes.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GestionnaireBlocSaisieTAF } = require("GestionnaireBlocSaisieTAF.js");
const {
  GestionnaireBlocSaisieContenu,
} = require("GestionnaireBlocSaisieContenu.js");
const {
  GestionnaireBlocSaisieEltPgm,
} = require("GestionnaireBlocSaisieEltPgm.js");
const { TypeOptionPublicationCDT } = require("TypeOptionPublicationCDT.js");
const ObjetPanelEditionContenu = require("ObjetPanelEditionContenu.js");
const ObjetPanelEditionTAF = require("ObjetPanelEditionTAF.js");
const { Identite } = require("ObjetIdentite.js");
const { EGenreEvntBlocCard } = require("BlocCard.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvntForm } = require("ObjetMoteurFormSaisieMobile.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GPosition } = require("ObjetPosition.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { ObjetFenetre_ListeTAFFaits } = require("ObjetFenetre_ListeTAFFaits.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_PostIt } = require("ObjetFenetre_PostIt.js");
class ObjetVisuCdT extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.data = null;
    this.ids = {
      page: GUID.getId(),
      zoneTAFSeance: GUID.getId(),
      zoneContenuSeance: GUID.getId(),
      zoneEltPgmSeance: GUID.getId(),
      zoneTAFProchaineSeance: GUID.getId(),
      boutonPlus: GUID.getId(),
      zonePublicationCdT: GUID.getId(),
      imgNonPub: GUID.getId(),
      zonePub: GUID.getId(),
      btnCmd: GUID.getId(),
    };
    this.dimensions = { largeurMenuCtx: 250 };
    this.genreTabSelectionne = ObjetVisuCdT.genreTab.tafSeance;
    this.moteurCDT = new MoteurCDT();
    _instancierGestionnaires.call(this);
    _instancierPanelsEdition.call(this);
    const lThis = this;
    this.identDatePublication = Identite.creerInstance(ObjetCelluleDate, {
      pere: this,
      evenement: function (aDate) {
        const lChangement = !GDate.estDateEgale(lThis.datePublication, aDate);
        if (lChangement) {
          lThis.CdT.setEtat(EGenreEtat.Modification);
          lThis.CdT.datePublication = aDate;
          lThis.callback.appel({
            evnt: EGenreEvntCdT.publierDate,
            data: lThis.CdT,
            ctx: {},
          });
        }
      },
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      btnOnglet: {
        event: function (aGenre) {
          this.genreTabSelectionne = aGenre;
          const lId = _getIdDeGenre.call(aInstance, aGenre);
          $(".content--active").each((aNum, aElt) => {
            aElt.classList.remove("content--active");
          });
          $(".tab--active").each((aNum, aElt) => {
            aElt.classList.remove("tab--active");
          });
          $(".tabicon--active").each((aNum, aElt) => {
            aElt.classList.remove("tabicon--active");
          });
          $("#" + lId.escapeJQ()).each((aNum, aElt) => {
            aElt.classList.add("content--active");
          });
          const lIdTab = lId + "_tab";
          $("#" + lIdTab.escapeJQ()).each((aNum, aElt) => {
            aElt.classList.add("tab--active");
          });
          $("#" + lIdTab.escapeJQ() + " > span > i").each((aNum, aElt) => {
            aElt.classList.add("tabicon--active");
          });
        }.bind(aInstance),
        getDisabled: function () {
          return false;
        },
      },
      publierCdt: {
        getValue: function () {
          return _estCdTPublie.call(this);
        }.bind(aInstance),
        setValue: function (aValue) {
          if (_estPublicationCdTEditable.call(this)) {
            this.CdT.publie = aValue;
            this.CdT.datePublication = aValue
              ? this.CdT.datePublication
                ? this.CdT.datePublication
                : GDate.getDateCourante()
              : null;
            this.CdT.setEtat(EGenreEtat.Modification);
            _actualiserImgPublication.call(this);
            this.callback.appel({
              evnt: EGenreEvntCdT.publierCdT,
              data: this.CdT,
              ctx: {},
            });
          }
        }.bind(aInstance),
        getDisabled: function () {
          return !_estPublicationCdTEditable.call(this);
        }.bind(aInstance),
      },
      verrouCdt: {
        getValue: function () {
          return _estCdTVerrouille.call(this);
        }.bind(aInstance),
        setValue: function () {}.bind(aInstance),
        getDisabled: function () {
          return true;
        }.bind(aInstance),
      },
      getNodePage: function () {
        if (
          !_estCdTVerrouille.call(aInstance) ||
          GApplication.parametresUtilisateur.get(
            "CDT.Commentaire.ActiverSaisie",
          )
        ) {
          $("#" + GInterface.idZonePrincipale).ieHtmlAppend(
            '<div id="' +
              aInstance.ids.boutonPlus +
              '" class="is-sticky btn-float primary messagerieNouveauMessage ie-ripple ie-ripple-claire" ie-event="click->btnPlus.surCreer()" ie-display="btnPlus.estVisible"></div>',
            { controleur: this.controleur },
          );
          $(this.node).on("destroyed", () => {
            $("#" + aInstance.ids.boutonPlus.escapeJQ()).remove();
          });
        }
      },
      btnPlus: {
        surCreer: function () {
          if (
            this.genreTabSelectionne === ObjetVisuCdT.genreTab.contenuSeance &&
            GApplication.parametresUtilisateur.get(
              "CDT.Commentaire.ActiverSaisie",
            )
          ) {
            ObjetMenuContextuel.afficher({
              pere: this,
              id: this.ids.boutonPlus,
              options: { largeurMin: 100 },
              initCommandes: function (aInstance) {
                aInstance.add(
                  GTraductions.getValeur("CahierDeTexte.SaisirContenu"),
                  !_estCdTVerrouille.call(this),
                  () => {
                    _ouvrirCreationSelonTab.call(
                      this,
                      ObjetVisuCdT.genreTab.contenuSeance,
                    );
                  },
                  { icon: "icon_contenu_cours" },
                );
                aInstance.add(
                  GTraductions.getValeur(
                    "CahierDeTexte.postIt.seanceSuivante.saisir",
                  ),
                  true,
                  () => {
                    _ouvrirCreationNoteProchaineSeance.call(this);
                  },
                  { icon: "icon_comment" },
                );
              },
            });
          } else {
            _ouvrirCreationSelonTab.call(aInstance, this.genreTabSelectionne);
          }
        }.bind(aInstance),
        estVisible: function () {
          return (
            _estTabAvecCreation.call(this, this.genreTabSelectionne) &&
            !_estCdTVerrouille.call(this)
          );
        }.bind(aInstance),
      },
      btnCommandes: {
        event: function () {
          ObjetMenuContextuel.afficher({
            pere: this,
            id: {
              x:
                GPosition.getLeft(this.ids.btnCmd) -
                this.dimensions.largeurMenuCtx -
                5,
              y: GPosition.getTop(this.ids.btnCmd),
            },
            evenement: function () {}.bind(this),
            initCommandes: function (aInstance) {
              aInstance.setOptions({
                largeurMin: this.dimensions.largeurMenuCtx,
              });
              aInstance.add(
                GTraductions.getValeur("CahierDeTexte.CopierCDT"),
                !!(this.cours.utilisable && this.cours.AvecCdT),
                () => {
                  this.cahierDeTextesCopie = this.CdT;
                  this.callback.appel({
                    evnt: EGenreEvntCdT.copierCdT,
                    data: this.CdT,
                    ctx: {},
                  });
                },
                { icon: "icon_copier_liste" },
              );
              aInstance.add(
                GTraductions.getValeur("CahierDeTexte.CollerCDT"),
                !(
                  !this.cahierDeTextesCopie ||
                  !this.cours.utilisable ||
                  (this.CdT && this.CdT.verrouille)
                ),
                () => {
                  if (
                    this.cahierDeTextesCopie !== null &&
                    this.cahierDeTextesCopie !== undefined &&
                    this.CdT !== null &&
                    this.CdT !== undefined &&
                    this.cahierDeTextesCopie.getNumero() !==
                      this.CdT.getNumero()
                  ) {
                    if (
                      this.cours &&
                      this.cours.utilisable &&
                      this.cours.AvecCdT
                    ) {
                      GApplication.getMessage().afficher({
                        type: EGenreBoiteMessage.Confirmation,
                        message: GTraductions.getValeur(
                          "CahierDeTexte.ConfirmerCollerCahierSurExistant",
                        ),
                        callback: function (aGenreAction) {
                          if (aGenreAction === EGenreAction.Valider) {
                            this.callback.appel({
                              evnt: EGenreEvntCdT.collerCdT,
                              data: this.CdT,
                              ctx: {},
                            });
                          }
                        }.bind(this),
                      });
                    } else {
                      this.callback.appel({
                        evnt: EGenreEvntCdT.collerCdT,
                        data: this.CdT,
                        ctx: {},
                      });
                    }
                  }
                },
                { icon: "icon_coller_liste" },
              );
              aInstance.add(
                GTraductions.getValeur("CahierDeTexte.SupprimerCDT"),
                !!(
                  this.cours.AvecCdT &&
                  !this.CdT.verrouille &&
                  this.cours.utilisable
                ),
                () => {
                  GApplication.getMessage().afficher({
                    type: EGenreBoiteMessage.Confirmation,
                    message: GTraductions.getValeur(
                      "CahierDeTexte.msgConfirmationSupprimerContenu",
                    ),
                    callback: function (aGenreAction) {
                      if (aGenreAction === EGenreAction.Valider) {
                        this.CdT.setEtat(EGenreEtat.Suppression);
                        this.callback.appel({
                          evnt: EGenreEvntCdT.deleteCdT,
                          data: this.CdT,
                          ctx: {},
                        });
                      }
                    }.bind(this),
                  });
                },
                { icon: "icon_trash" },
              );
              if (
                GApplication.parametresUtilisateur.get(
                  "CDT.Commentaire.ActiverSaisie",
                )
              ) {
                aInstance.addSeparateur();
                aInstance.add(
                  GTraductions.getValeur(
                    "CahierDeTexte.postIt.commentairePrive.menuCtx",
                  ),
                  !!this.cours.utilisable,
                  () => {
                    _ouvrirCreationCommentairePrive.call(this);
                  },
                  { icon: "icon_post_it_rempli" },
                );
              }
            }.bind(this),
          });
        }.bind(aInstance),
      },
      btnCommentaire: {
        avec() {
          return (
            aInstance.CdT.commentairePrive &&
            GApplication.parametresUtilisateur.get(
              "CDT.Commentaire.ActiverSaisie",
            )
          );
        },
        model: {
          event() {
            _ouvrirCreationCommentairePrive.call(aInstance);
          },
          getTitle() {
            return GTraductions.getValeur(
              "CahierDeTexte.postIt.commentairePrive.hintBtn",
            );
          },
        },
      },
      editionNoteProchaineSeance() {
        $(this.node).eventValidation(() => {
          _ouvrirCreationNoteProchaineSeance.call(aInstance);
        });
      },
      afficherNoteCoursPrecedent: {
        event() {
          if (!!aInstance.fenetreNotePourSeance) {
            aInstance.fenetreNotePourSeance.fermer();
          }
          aInstance.fenetreNotePourSeance = ObjetFenetre.creerInstanceFenetre(
            ObjetFenetre,
            {
              pere: aInstance,
              initialiser: (aInstanceFenetre) => {
                aInstanceFenetre.setOptionsFenetre({
                  titre: GTraductions.getValeur(
                    "CahierDeTexte.postIt.pourCetteSeance.titre",
                  ),
                });
              },
            },
          );
          aInstance.fenetreNotePourSeance.afficher(
            GChaine.replaceRCToHTML(
              aInstance.data.CoursPrecedent.noteProchaineSeance,
            ),
          );
        },
        getTitle() {
          return GTraductions.getValeur(
            "CahierDeTexte.postIt.pourCetteSeance.titre",
          );
        },
      },
    });
  }
  actualiserDataCdT(aParam) {
    this.data = aParam.cdt;
    this.CdT = aParam.cdt.CahierDeTextes;
    this.CdT.publie = !!this.CdT.datePublication;
    this.cours = aParam.cours;
    _actualiserPublication.call(this);
    switch (aParam.evnt) {
      case EGenreEvntCdT.createContenu:
      case EGenreEvntCdT.editContenu:
      case EGenreEvntCdT.deleteContenu:
      case EGenreEvntCdT.editNoteProchaineSeance:
        _actualiserContenus.call(this);
        break;
      case EGenreEvntCdT.createTAF:
      case EGenreEvntCdT.editTAF:
      case EGenreEvntCdT.deleteTAF:
        _actualiserTafs.call(this);
        break;
      case EGenreEvntCdT.deleteCdT:
      case EGenreEvntCdT.collerCdT:
        _actualiserContenus.call(this);
        _actualiserTafs.call(this);
        break;
    }
  }
  setDonnees(aParam) {
    this.data = aParam.cdt;
    this.CdT = aParam.cdt.CahierDeTextes;
    this.CdT.publie = !!this.CdT.datePublication;
    this.tafsSeance = aParam.tafs;
    this.general = aParam.general;
    this.cours = aParam.cours;
    this.cahierDeTextesCopie = aParam.cahierDeTextesCopie;
    this.avecElementsProgramme = this.data.avecElementsProgramme;
    this.DateCoursDeb = this.data.DateCoursDeb;
    this.DateCoursFin = this.data.DateCoursFin;
    _actualiserOptionsGestionnaires.call(this);
    this.afficher();
    _refreshBlocs.call(this);
    this.actualiserDatePublication();
  }
  construireAffichage() {
    const H = [];
    if (this.data !== null && this.data !== undefined) {
      const lTabOnglets = [
        {
          avecIcone: true,
          icone: "icon_saisie_appreciation",
          avecLibelle: false,
          libelle: GTraductions.getValeur("CahierDeTexte.TAFPourSeance"),
          selection: true,
          genre: 0,
          id: this.ids.zoneTAFSeance,
        },
        {
          avecIcone: true,
          icone: "icon_contenu_cours",
          avecLibelle: false,
          libelle: GTraductions.getValeur("CahierDeTexte.ContenusSeance"),
          selection: false,
          genre: 1,
          id: this.ids.zoneContenuSeance,
        },
      ];
      if (this.avecElementsProgramme) {
        lTabOnglets.push({
          avecIcone: true,
          icone: "icon_book",
          avecLibelle: false,
          libelle: GTraductions.getValeur("CahierDeTexte.EltPgmSeance"),
          selection: false,
          genre: 2,
          id: this.ids.zoneEltPgmSeance,
        });
      }
      lTabOnglets.push({
        avecIcone: true,
        icone: "icon_taf",
        avecLibelle: false,
        libelle: GTraductions.getValeur("CahierDeTexte.TAFAVenir"),
        selection: false,
        genre: 3,
        id: this.ids.zoneTAFProchaineSeance,
      });
      H.push(
        '<div class="ObjetVisuCdT" id="',
        this.ids.page,
        '" ie-node="getNodePage">',
      );
      H.push(_construireZoneCdT.call(this));
      H.push(_construireTabsScrollable.call(this, { onglets: lTabOnglets }));
      H.push(
        '<section class="content content--active" id="',
        this.ids.zoneTAFSeance,
        '">',
        _construireTAFSeance.call(this),
        "</section>",
      );
      H.push(
        '<section class="content" id="',
        this.ids.zoneContenuSeance,
        '">',
        _construireContenuSeance.call(this),
        "</section>",
      );
      H.push(
        '<section class="content" id="',
        this.ids.zoneEltPgmSeance,
        '">',
        _construireEltPgmeSeance.call(this),
        "</section>",
      );
      H.push(
        '<section class="content" id="',
        this.ids.zoneTAFProchaineSeance,
        '">',
        _construireTAFProchaineSeance.call(this),
        "</section>",
      );
      H.push("</div>");
    }
    return H.join("");
  }
  actualiserFicheTAFDuCours(aParam) {
    this.tafsSeance = aParam.tafs;
    _actualiserTafsSeance.call(this);
  }
  actualiserDatePublication() {
    if (
      this.identDatePublication &&
      _estPublicationVisible.call(this) &&
      !_estPublieAuto.call(this)
    ) {
      this.identDatePublication.setParametresFenetre(
        GParametres.PremierLundi,
        GParametres.PremiereDate,
        this.cours.DateDuCours,
      );
      this.identDatePublication.initialiser();
      if (this.CdT) {
        const lDate = this.CdT.datePublication
          ? this.CdT.datePublication
          : GDate.getDateCourante();
        this.identDatePublication.setActif(_estCdTPublie.call(this));
        this.identDatePublication.setOptionsObjetCelluleDate({
          domaineValide: GApplication.droits.get(
            TypeDroits.cours.domaineConsultationEDT,
          ),
        });
        this.identDatePublication.setDonnees(lDate);
      }
    }
  }
}
ObjetVisuCdT.genreTab = {
  tafSeance: 0,
  contenuSeance: 1,
  eltPgmSeance: 2,
  tafProchaineSeance: 3,
};
function _estTabAvecCreation(aGenre) {
  switch (aGenre) {
    case ObjetVisuCdT.genreTab.tafSeance:
      return false;
    case ObjetVisuCdT.genreTab.contenuSeance:
      return true;
    case ObjetVisuCdT.genreTab.eltPgmSeance:
      return false;
    case ObjetVisuCdT.genreTab.tafProchaineSeance:
      return true;
  }
}
function _ouvrirCreationSelonTab(aGenre) {
  switch (aGenre) {
    case ObjetVisuCdT.genreTab.contenuSeance:
      _ouvrirEditionContenu.call(this, {
        estCreation: true,
        contenu: this.moteurCDT.creerContenuParDefaut(),
      });
      break;
    case ObjetVisuCdT.genreTab.eltPgmSeance:
      break;
    case ObjetVisuCdT.genreTab.tafProchaineSeance:
      _ouvrirEditionTAF.call(this, {
        estCreation: true,
        taf: this.moteurCDT.creerTAFParDefaut({
          date: this.data.dateCoursSuivantTAF || this.data.DateTravailAFaire,
        }),
      });
      break;
  }
}
function _actualiserPublication() {
  GHtml.setHtml(
    this.ids.zonePublicationCdT,
    _construirePublication.call(
      this,
      _estCdTPublie.call(this),
      _estPublicationCdTEditable.call(this),
    ),
    { controleur: this.controleur },
  );
  this.actualiserDatePublication();
}
function _actualiserContenus() {
  GHtml.setHtml(
    this.ids.zoneContenuSeance,
    _construireContenuSeance.call(this),
    { controleur: this.controleur },
  );
  _refreshBlocs.call(this);
}
function _actualiserTafs() {
  GHtml.setHtml(
    this.ids.zoneTAFProchaineSeance,
    _construireTAFProchaineSeance.call(this),
    { controleur: this.controleur },
  );
  _refreshBlocs.call(this);
}
function _construireTabsScrollable(aParam) {
  const H = [];
  H.push('<div class="tabBar" role="tablist">');
  for (let i = 0, lNbr = aParam.onglets.length; i < lNbr; i++) {
    const lOnglet = aParam.onglets[i];
    const lId = _getIdDeGenre.call(this, lOnglet.genre);
    const lIdOnglet = lId + "_tab";
    H.push(
      '<ie-bouton ie-model="btnOnglet(',
      "" + lOnglet.genre,
      ')" class="tab themeTabBar ',
      lOnglet.selection ? "tab--active" : "",
      '" role="tab" aria-selected="true" tabindex="0" id="',
      lIdOnglet,
      '">',
    );
    H.push("<span>");
    if (lOnglet.avecIcone) {
      H.push(
        '<i class="tabicon ',
        lOnglet.icone,
        " ",
        lOnglet.selection ? "tabicon--active" : "",
        '" aria-hidden="true"></i>',
      );
    }
    if (lOnglet.avecLibelle) {
      H.push("<span>", lOnglet.libelle, "</span>");
    }
    H.push("</span>");
    H.push("</ie-bouton>");
  }
  H.push("</div>");
  return H.join("");
}
function _getIdDeGenre(aGenre) {
  switch (aGenre) {
    case ObjetVisuCdT.genreTab.tafSeance:
      return this.ids.zoneTAFSeance;
    case ObjetVisuCdT.genreTab.contenuSeance:
      return this.ids.zoneContenuSeance;
    case ObjetVisuCdT.genreTab.eltPgmSeance:
      return this.ids.zoneEltPgmSeance;
    case ObjetVisuCdT.genreTab.tafProchaineSeance:
      return this.ids.zoneTAFProchaineSeance;
  }
}
function _estPublicationVisible() {
  return this.CdT.existeNumero();
}
function _construireZoneCdT() {
  const H = [];
  H.push('<section class="ZoneCdT">');
  H.push('<div class="fluid-bloc">');
  H.push(
    '<div class="flex-contain flex-center flex-gap" id="',
    this.ids.zonePublicationCdT,
    '">',
    _construirePublication.call(
      this,
      _estCdTPublie.call(this),
      _estPublicationCdTEditable.call(this),
    ),
    "</div>",
  );
  if (_estCdTVerrouille.call(this)) {
    H.push(_construireVerrouVisa.call(this));
  }
  H.push("</div>");
  H.push(
    '<div ie-if="btnCommentaire.avec"><ie-btnicon ie-model="btnCommentaire.model" class="icon_post_it_rempli bt-activable m-right-l"></ie-btnicon></div>',
  );
  H.push(
    '<div style="width:.8rem;" id="',
    this.ids.btnCmd,
    '"><ie-btnicon ie-model="btnCommandes" class="icon_ellipsis_vertical btnCmd"></ie-btnicon></div>',
  );
  H.push("</section>");
  return H.join("");
}
function _construireSectionDonnees(aParam) {
  const lListeDonnees = aParam.listeDonnees;
  const H = [];
  H.push(
    "<header><h3>",
    aParam.titre,
    aParam.boutonTitre || "",
    "</h3></header>",
  );
  if (
    lListeDonnees !== null &&
    lListeDonnees !== undefined &&
    lListeDonnees.count() > 0
  ) {
    const lStrListeBlocs = [];
    lListeDonnees.parcourir((aData) => {
      lStrListeBlocs.push(
        _composeBlocArticle.call(this, {
          data: aData,
          gestionnaire: aParam.gestionnaire,
        }).html,
      );
    });
    H.push(lStrListeBlocs.join(""));
  } else {
    H.push(
      _composeBlocArticle.call(this, {
        msgAucun: aParam.msgAucun,
        gestionnaire: aParam.gestionnaire,
      }).html,
    );
  }
  return H.join("");
}
function _construireTAFSeance() {
  return _construireSectionDonnees.call(this, {
    titre: GTraductions.getValeur("CahierDeTexte.TAFPourSeance"),
    listeDonnees: this.tafsSeance,
    gestionnaire: this.gestionnaireBlocsTAFsSeance,
    msgAucun: GTraductions.getValeur("CahierDeTexte.AucunTAFPourSeance"),
  });
}
function _construireContenuSeance() {
  const H = [];
  H.push(
    _construireSectionDonnees.call(this, {
      titre: GTraductions.getValeur("CahierDeTexte.ContenusSeance"),
      boutonTitre:
        !!this.data.CoursPrecedent &&
        !!this.data.CoursPrecedent.noteProchaineSeance &&
        GApplication.parametresUtilisateur.get("CDT.Commentaire.ActiverSaisie")
          ? `<ie-btnicon class="icon_comment bt-activable m-left-xl" ie-model="afficherNoteCoursPrecedent"></ie-btnicon>`
          : "",
      listeDonnees: this.CdT.listeContenus,
      gestionnaire: this.gestionnaireBlocsContenus,
      msgAucun: GTraductions.getValeur("CahierDeTexte.AucunContenuSaisi"),
    }),
  );
  if (
    !!this.CdT.noteProchaineSeance &&
    GApplication.parametresUtilisateur.get("CDT.Commentaire.ActiverSaisie")
  ) {
    H.push(_constuireNoteProchaineSeance.call(this));
  }
  return H.join("");
}
function _construireEltPgmeSeance() {
  if (
    this.CdT.listeElementsProgrammeCDT &&
    this.CdT.listeElementsProgrammeCDT.getNbrElementsExistes()
  ) {
    this.CdT.listeElementsProgrammeCDT.trier();
  }
  return _construireSectionDonnees.call(this, {
    titre: GTraductions.getValeur("CahierDeTexte.EltPgmSeance"),
    listeDonnees: this.CdT.listeElementsProgrammeCDT,
    gestionnaire: this.gestionnaireBlocsEltPgm,
    msgAucun: GTraductions.getValeur("CahierDeTexte.AucunEltPgm"),
  });
}
function _construireTAFProchaineSeance() {
  return _construireSectionDonnees.call(this, {
    titre: GTraductions.getValeur("CahierDeTexte.TAFAVenir"),
    listeDonnees: this.CdT.ListeTravailAFaire,
    gestionnaire: this.gestionnaireBlocsTAFsProchaineSeance,
    msgAucun: GTraductions.getValeur("CahierDeTexte.AucunTAFSaisi"),
  });
}
function _instancierPanelsEdition() {
  this.instancePanelEditionContenu = Identite.creerInstance(
    ObjetPanelEditionContenu,
    { pere: this, evenement: _evntSurEditionContenu.bind(this) },
  );
  this.instancePanelEditionTAF = Identite.creerInstance(ObjetPanelEditionTAF, {
    pere: this,
    evenement: _evntSurEditionTAF.bind(this),
  });
}
function _ouvrirEditionContenu(aParam) {
  $.extend(aParam, {
    listeCategories: this.general.ListeCategories,
    listeDocumentsJoints: this.data.ListeDocumentsJoints,
    listePeriodes: this.general.ListePeriodes,
    dateCoursDeb: this.data.DateCoursDeb,
    matiere: this.data.CahierDeTextes.Matiere,
  });
  this.instancePanelEditionContenu.setOptions({
    avecSaisiePJ: this.general.PublierDocuments,
    avecSaisieSitesWeb: this.general.PublierUrl,
    avecCloud: this.general.PublierCloud,
    avecKiosque: this.general.PublierKiosque,
  });
  this.instancePanelEditionContenu.setDonnees(aParam);
  const lHtmlPanel = this.instancePanelEditionContenu.getHtmlPanel();
  GInterface.openPanel(lHtmlPanel, {
    controleur: this.instancePanelEditionContenu.controleur,
    optionsFenetre: this.instancePanelEditionContenu.getOptionsFenetre(),
  });
  this.instancePanelEditionContenu.updateContent();
}
function _ouvrirEditionEltPgme() {}
function _evntSurEditionContenu(aParam) {
  switch (aParam.commande) {
    case EGenreEvntForm.annuler:
      break;
    case EGenreEvntForm.valider:
      if (aParam.estCreation) {
        this.CdT.listeContenus.addElement(aParam.data);
      } else {
        this.CdT.listeContenus.addElement(
          aParam.data,
          this.CdT.listeContenus.getIndiceParElement(aParam.data),
        );
      }
      this.CdT.setEtat(EGenreEtat.Modification);
      this.callback.appel({
        evnt: aParam.estCreation
          ? EGenreEvntCdT.createContenu
          : EGenreEvntCdT.editContenu,
        data: this.CdT,
        ctx: { element: aParam.data },
      });
      break;
    case EGenreEvntForm.supprimer:
      this.CdT.listeContenus.addElement(
        aParam.data,
        this.CdT.listeContenus.getIndiceParElement(aParam.data),
      );
      this.CdT.setEtat(EGenreEtat.Modification);
      this.callback.appel({
        evnt: EGenreEvntCdT.deleteContenu,
        data: this.CdT,
        ctx: {},
      });
      break;
    default:
  }
  GInterface.closePanel();
}
function _evntSurEditionTAF(aParam) {
  switch (aParam.commande) {
    case EGenreEvntForm.annuler:
      break;
    case EGenreEvntForm.valider:
      if (aParam.estCreation) {
        this.CdT.ListeTravailAFaire.addElement(aParam.data);
      } else {
        this.CdT.ListeTravailAFaire.addElement(
          aParam.data,
          this.CdT.ListeTravailAFaire.getIndiceParElement(aParam.data),
        );
      }
      this.CdT.setEtat(EGenreEtat.Modification);
      this.callback.appel({
        evnt: aParam.estCreation
          ? EGenreEvntCdT.createTAF
          : EGenreEvntCdT.editTAF,
        data: this.CdT,
        ctx: { element: aParam.data },
      });
      break;
    case EGenreEvntForm.supprimer:
      this.CdT.ListeTravailAFaire.addElement(
        aParam.data,
        this.CdT.ListeTravailAFaire.getIndiceParElement(aParam.data),
      );
      this.CdT.setEtat(EGenreEtat.Modification);
      this.callback.appel({
        evnt: EGenreEvntCdT.deleteTAF,
        data: this.CdT,
        ctx: {},
      });
      break;
    default:
  }
  GInterface.closePanel();
}
function _ouvrirEditionTAF(aParam) {
  $.extend(aParam, {
    taf: aParam.taf,
    listeClassesEleves: this.data.listeClassesEleves,
    listeDocumentsJoints: this.data.ListeDocumentsJoints,
    listePeriodes: this.general.ListePeriodes,
    dateCoursDeb: this.data.DateCoursDeb,
    CDTPublie: _estCdTPublie.call(this),
    matiere: this.data.CahierDeTextes.Matiere,
  });
  this.instancePanelEditionTAF.setOptions({
    avecSaisiePJ: this.general.PublierDocuments,
    avecSaisieSitesWeb: this.general.PublierUrl,
    avecCloud: this.general.PublierCloud,
    avecKiosque: this.general.PublierKiosque,
  });
  this.instancePanelEditionTAF.setDonnees(aParam);
  const lHtmlPanel = this.instancePanelEditionTAF.getHtmlPanel();
  GInterface.openPanel(lHtmlPanel, {
    controleur: this.instancePanelEditionTAF.controleur,
    optionsFenetre: this.instancePanelEditionTAF.getOptionsFenetre(),
  });
  this.instancePanelEditionTAF.updateContent();
}
function _instancierGestionnaires() {
  this.gestionnaireBlocsTAFsSeance = Identite.creerInstance(
    GestionnaireBlocSaisieTAF,
    {
      pere: this,
      evenement: function (aDataBloc) {
        _ouvrirSuiviRendusTAFs.call(this, { taf: aDataBloc });
      }.bind(this),
    },
  );
  this.gestionnaireBlocsTAFsProchaineSeance = Identite.creerInstance(
    GestionnaireBlocSaisieTAF,
    {
      pere: this,
      evenement: function (aDataBloc, aGenreEvnt) {
        switch (aGenreEvnt) {
          case EGenreEvntBlocCard.edition:
            _ouvrirEditionTAF.call(this, {
              estCreation: false,
              taf: aDataBloc,
            });
            break;
          default:
            break;
        }
      }.bind(this),
    },
  );
  this.gestionnaireBlocsContenus = Identite.creerInstance(
    GestionnaireBlocSaisieContenu,
    {
      pere: this,
      evenement: function (aDataBloc, aGenreEvnt) {
        switch (aGenreEvnt) {
          case EGenreEvntBlocCard.edition:
            _ouvrirEditionContenu.call(this, {
              estCreation: false,
              contenu: aDataBloc,
            });
            break;
          default:
            break;
        }
      }.bind(this),
    },
  );
  this.gestionnaireBlocsEltPgm = Identite.creerInstance(
    GestionnaireBlocSaisieEltPgm,
    {
      pere: this,
      evenement: function (aDataBloc, aGenreEvnt) {
        switch (aGenreEvnt) {
          case EGenreEvntBlocCard.edition:
            _ouvrirEditionEltPgme.call(this, {
              estCreation: false,
              eltPgme: aDataBloc,
            });
            break;
          default:
            break;
        }
      }.bind(this),
    },
  );
}
function _actualiserOptionsGestionnaires() {
  this.gestionnaireBlocsTAFsSeance.setOptions({
    editable: false,
    avecDonneLe: true,
    avecPourLe: false,
    avecSuiviRendu: true,
    listeClassesEleves: this.data.listeClassesEleves,
  });
  this.gestionnaireBlocsTAFsProchaineSeance.setOptions({
    editable: !_estCdTVerrouille.call(this),
    avecDonneLe: false,
    avecPourLe: true,
    avecSuiviRendu: false,
    listeClassesEleves: this.data.listeClassesEleves,
  });
  this.gestionnaireBlocsContenus.setOptions({
    editable: !_estCdTVerrouille.call(this),
  });
  this.gestionnaireBlocsEltPgm.setOptions({ editable: false });
}
function _refreshBlocs() {
  if (
    this.tafsSeance !== null &&
    this.tafsSeance !== undefined &&
    this.tafsSeance.count() > 0
  ) {
    this.gestionnaireBlocsTAFsSeance.refresh();
  }
  if (
    this.CdT.ListeTravailAFaire !== null &&
    this.CdT.ListeTravailAFaire !== undefined &&
    this.CdT.ListeTravailAFaire.count() > 0
  ) {
    this.gestionnaireBlocsTAFsProchaineSeance.refresh();
  }
  if (
    this.CdT.listeContenus !== null &&
    this.CdT.listeContenus !== undefined &&
    this.CdT.listeContenus.count() > 0
  ) {
    this.gestionnaireBlocsContenus.refresh();
  }
  if (
    this.CdT.listeElementsProgrammeCDT !== null &&
    this.CdT.listeElementsProgrammeCDT !== undefined &&
    this.CdT.listeElementsProgrammeCDT.count() > 0
  ) {
    this.gestionnaireBlocsEltPgm.refresh();
  }
}
function _composeBlocArticle(aParam) {
  const H = [];
  let lBloc;
  if (aParam.data !== null && aParam.data !== undefined) {
    lBloc = aParam.gestionnaire.composeBloc(aParam.data);
  } else {
    lBloc = aParam.gestionnaire.composeBlocMsg(aParam.msgAucun);
  }
  H.push(lBloc.html);
  return { html: H.join(""), controleur: lBloc.controleur };
}
function _construirePublication(aCoche, aActif) {
  const H = [];
  if (_estPublicationVisible.call(this)) {
    H.push(
      '<div id="',
      this.ids.imgNonPub,
      '" class="',
      _getImgPublicationSelonEtat.call(this, aCoche, aActif),
      '"></div>',
    );
    H.push(
      '<ie-checkbox id="',
      this.ids.zonePub,
      '" class="EspaceGauche" ie-model="publierCdt">',
      GTraductions.getValeur("CahierDeTexte.publie"),
      "</ie-checkbox>",
    );
    H.push('<div id="' + this.identDatePublication.getNom() + '"></div>');
  }
  return H.join("");
}
function _estPublieAuto() {
  return (
    new Date() >
    (GApplication.parametresUtilisateurBase.optionPublicationCDT ===
    TypeOptionPublicationCDT.OPT_PublicationDebutCours
      ? this.DateCoursDeb
      : this.DateCoursFin)
  );
}
function _estCdTPublie() {
  return (
    this.CdT.existeNumero() && (this.CdT.publie || _estPublieAuto.call(this))
  );
}
function _estPublicationCdTEditable() {
  return !_estPublieAuto.call(this) && !_estCdTVerrouille.call(this);
}
function _getImgPublicationSelonEtat(aPublie, aActif) {
  return aActif === true
    ? aPublie === true
      ? "Image_Publie"
      : "Image_NonPublie"
    : aPublie === true
      ? "Image_Publie_Grise"
      : "Image_NonPublie_Grise";
}
function _actualiserImgPublication() {
  const lCoche = _estCdTPublie.call(this);
  const lActif = _estPublicationCdTEditable.call(this);
  $("#" + this.ids.imgNonPub.escapeJQ())
    .removeClass(
      "Image_Publie Image_NonPublie Image_Publie_Grise Image_NonPublie_Grise",
    )
    .addClass(_getImgPublicationSelonEtat.call(this, lCoche, lActif));
}
function _estCdTVerrouille() {
  return this.CdT ? this.CdT.verrouille : true;
}
function _construireVerrouVisa() {
  const H = [];
  H.push('<div class="flex-contain flex-center flex-gap">');
  H.push('<i class="icon_lock verrou"></i>');
  H.push(
    '<ie-checkbox ie-model="verrouCdt">',
    GTraductions.getValeur("CahierDeTexte.CDTViseEtVerrouille"),
    "</ie-checkbox>",
  );
  H.push("</div>");
  return H.join("");
}
function _ouvrirSuiviRendusTAFs(aParam) {
  ObjetFenetre_ListeTAFFaits.ouvrir(
    {
      pere: this,
      evenement: function () {
        this.callback.appel({
          evnt: EGenreEvntCdT.actualiserFicheTAFDuCours,
          data: this.CdT,
          ctx: {},
        });
      }.bind(this),
    },
    aParam.taf,
  );
}
function _actualiserTafsSeance() {
  GHtml.setHtml(this.ids.zoneTAFSeance, _construireTAFSeance.call(this), {
    controleur: this.controleur,
  });
  _refreshBlocs.call(this);
}
function _constuireNoteProchaineSeance() {
  const H = [];
  H.push(
    `<div class="m-all-xl" ie-node="editionNoteProchaineSeance">`,
    `<header><h3>${GTraductions.getValeur("CahierDeTexte.postIt.seanceSuivante.titre")}</h3></header>`,
    `<p>${GChaine.replaceRCToHTML(this.CdT.noteProchaineSeance)}</p>`,
    `</div>`,
  );
  return H.join("");
}
function _ouvrirCreationNoteProchaineSeance() {
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_PostIt, {
    pere: this,
    initialiser: (aInstanceFenetre) => {
      aInstanceFenetre.setOptionsFenetre({
        titre: GTraductions.getValeur(
          "CahierDeTexte.postIt.seanceSuivante.titre",
        ),
      });
    },
    evenement: (aNoteProchaineSeance) => {
      this.CdT.noteProchaineSeance = aNoteProchaineSeance;
      this.CdT.setEtat(EGenreEtat.Modification);
      this.callback.appel({
        evnt: EGenreEvntCdT.editNoteProchaineSeance,
        data: this.CdT,
      });
    },
  }).setDonnees({
    texte: this.CdT.noteProchaineSeance,
    label: GTraductions.getValeur("CahierDeTexte.postIt.seanceSuivante.label"),
    taillePostIt: this.CdT.taillePostIt,
  });
}
function _ouvrirCreationCommentairePrive() {
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_PostIt, {
    pere: this,
    initialiser: (aInstanceFenetre) => {
      aInstanceFenetre.setOptionsFenetre({
        titre: GTraductions.getValeur(
          "CahierDeTexte.postIt.commentairePrive.titre",
        ),
      });
    },
    evenement: (aCommentairePrive) => {
      this.CdT.commentairePrive = aCommentairePrive;
      this.CdT.setEtat(EGenreEtat.Modification);
      this.callback.appel({
        evnt: EGenreEvntCdT.editCommentairePrive,
        data: this.CdT,
      });
    },
  }).setDonnees({
    texte: this.CdT.commentairePrive,
    label:
      GTraductions.getValeur("Commentaire") +
      " (" +
      GTraductions.getValeur(
        "CahierDeTexte.postIt.commentairePrive.infoTitre",
      ) +
      ")",
    taillePostIt: this.CdT.taillePostIt,
  });
}
module.exports = { ObjetVisuCdT };
