exports.InterfaceSaisieAppelInternat = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetRequeteCreneauxAppelsInternat_1 = require("ObjetRequeteCreneauxAppelsInternat");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const jsx_1 = require("jsx");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetRequeteSaisieAppelInternat_1 = require("ObjetRequeteSaisieAppelInternat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetTri_1 = require("ObjetTri");
class InterfaceSaisieAppelInternat extends ObjetInterfacePageCP_1.InterfacePageCP {
  constructor(...aParams) {
    super(...aParams);
    this.idBandeauAppel = this.Nom + "_BandeauAppel_" + GUID_1.GUID.getId();
    this.idBandeauAppelTitre =
      this.Nom + "_BandeauAppel_Titre_" + GUID_1.GUID.getId();
    this.date = GApplication.getDemo()
      ? GApplication.getDateDemo()
      : ObjetDate_1.GDate.getDateCourante(true);
    this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
    this.contexte = $.extend(this.contexte, {
      ecran: [
        InterfaceSaisieAppelInternat.genreEcran.listeCreneaux,
        InterfaceSaisieAppelInternat.genreEcran.listeAppel,
      ],
    });
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      btnRetourEcranPrec: {
        event: () => {
          this._evntRetourEcranPrec();
        },
      },
    });
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
    this.avecBandeau = true;
    this.AddSurZone = [this.identDate];
    if (this.optionsEcrans.avecBascule) {
      this.AddSurZone.push({
        html: IE.jsx.str(
          "div",
          { id: this.idBandeauAppel },
          this.construireBandeauEcran(
            IE.jsx.str(
              "div",
              { class: "titres-contain" },
              IE.jsx.str("h3", {
                class: "text-center m-right-xxl",
                id: this.idBandeauAppelTitre,
              }),
            ),
            { bgWhite: true },
          ),
        ),
      });
    }
  }
  construireInstances() {
    this.identDate = this.add(
      ObjetCelluleDate_1.ObjetCelluleDate,
      (aDate) => {
        if (aDate) {
          this.date = aDate;
          this.requeteAppelInternat();
          if (this.optionsEcrans.avecBascule) {
            ObjetHtml_1.GHtml.setDisplay(
              this.getIdDeNiveau({ niveauEcran: 1 }),
              false,
            );
          }
        }
      },
      (aInstance) => {
        aInstance.setOptionsObjetCelluleDate({
          formatDate: "[%JJJJ %JJ %MMM]",
          avecBoutonsPrecedentSuivant: true,
          largeurComposant: 120,
        });
      },
    );
    this.identListeCreneaux = this.add(
      ObjetListe_1.ObjetListe,
      (aParametres) => {
        switch (aParametres.genreEvenement) {
          case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
            this.setCtxSelection({
              niveauEcran: 0,
              dataEcran: aParametres.article,
            });
            this.basculerEcran(
              { niveauEcran: 0, dataEcran: aParametres.article },
              {
                niveauEcran: 1,
                genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
              },
            );
            break;
          }
        }
      },
      (aListe) => {
        aListe.setOptionsListe({
          skin: ObjetListe_1.ObjetListe.skin.flatDesign,
          avecOmbreDroite: true,
        });
      },
    );
    this.identListeAppel = this.add(ObjetListe_1.ObjetListe, null, (aListe) => {
      aListe.setOptionsListe({
        skin: ObjetListe_1.ObjetListe.skin.flatDesign,
        messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
          "AppelInternat.messageAucunEleveInscrit",
        ),
      });
    });
  }
  async construireEcran(aParams) {
    switch (aParams.genreEcran) {
      case InterfaceSaisieAppelInternat.genreEcran.listeCreneaux:
        if (this.optionsEcrans.avecBascule) {
          this.initialiser(true);
          this.getInstance(this.identListeCreneaux).selectionnerLigne({
            deselectionnerTout: true,
          });
        }
        break;
      case InterfaceSaisieAppelInternat.genreEcran.listeAppel: {
        const lCreneau = this.getCtxSelection({ niveauEcran: 0 });
        if (this.optionsEcrans.avecBascule) {
          ObjetHtml_1.GHtml.setDisplay(this.idBandeauAppel, true);
          ObjetHtml_1.GHtml.setHtml(
            this.idBandeauAppelTitre,
            lCreneau.getLibelle(),
          );
        }
        const lBoutons = [];
        lBoutons.push({
          controleur: {
            getInfoAppel: () => {
              return IE.jsx.str(
                IE.jsx.fragment,
                null,
                IE.jsx.str(
                  "div",
                  null,
                  lCreneau.estAppelTermine
                    ? ObjetTraduction_1.GTraductions.getValeur(
                        "AbsenceVS.AppelFait",
                      )
                    : ObjetTraduction_1.GTraductions.getValeur(
                        "AppelInternat.appelEnCours",
                      ),
                ),
                IE.jsx.str(
                  "div",
                  null,
                  ObjetTraduction_1.GTraductions.getValeur(
                    "AppelInternat.nbElevesAbsent",
                    [lCreneau.nbAbsences],
                  ),
                  " / ",
                  lCreneau.nbElevesAttendus,
                ),
              );
            },
          },
          html: IE.jsx.str("div", { "ie-html": "getInfoAppel" }),
        });
        lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
        lBoutons.push({ genre: ObjetListe_1.ObjetListe.typeBouton.deployer });
        this.getInstance(this.identListeAppel)
          .setOptionsListe({ boutons: lBoutons })
          .setDonnees(
            new DonneesListe_RessourcesAppelsInternat(
              lCreneau.listeRessources,
              this.requeteSaisieInternat.bind(this),
            ),
          );
        break;
      }
    }
  }
  _evntRetourEcranPrec() {
    switch (this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })) {
      case InterfaceSaisieAppelInternat.genreEcran.listeAppel:
        this.setCtxSelection({ niveauEcran: 0, dataEcran: null });
        this.revenirSurEcranPrecedent();
        break;
    }
  }
  construireStructureAffichageAutre() {
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str(
        "div",
        { class: "InterfaceSaisieAppelInternat" },
        IE.jsx.str(
          "section",
          {
            id: this.getIdDeNiveau({ niveauEcran: 0 }),
            class: "liste-creneaux",
          },
          IE.jsx.str("div", {
            id: this.getInstance(this.identListeCreneaux).getNom(),
            class: ["full-height"],
          }),
        ),
        IE.jsx.str(
          "section",
          {
            id: this.getIdDeNiveau({ niveauEcran: 1 }),
            class: "appel-internat",
          },
          IE.jsx.str("div", {
            id: this.getInstance(this.identListeAppel).getNom(),
            class: ["full-height"],
          }),
        ),
      ),
    );
  }
  recupererDonnees() {
    this.getInstance(this.identDate).setDonnees(this.date, true);
    ObjetHtml_1.GHtml.setDisplay(this.idBandeauAppel, false);
  }
  requeteAppelInternat() {
    new ObjetRequeteCreneauxAppelsInternat_1.ObjetRequeteCreneauxAppelsInternat(
      this,
      (aJSON) => {
        this.listeCreneaux = aJSON.listeCreneaux;
        const lCreneau = this.getCtxSelection({ niveauEcran: 0 });
        let lIndice = -1;
        if (lCreneau) {
          lIndice = this.listeCreneaux.getIndiceParElement(lCreneau);
        }
        this.getInstance(this.identListeCreneaux).setDonnees(
          new DonneesListe_CreneauxAppelsInternat(this.listeCreneaux),
          lIndice,
        );
        if (lIndice === undefined) {
          ObjetHtml_1.GHtml.setHtml(
            this.getNomInstance(this.identListeAppel),
            "",
          );
        }
      },
    ).lancerRequete({ date: this.date });
  }
  requeteSaisieInternat(aRessource) {
    const lCreneau = this.getCtxSelection({ niveauEcran: 0 });
    const lParam = {
      creneau: this.getCtxSelection({ niveauEcran: 0 }),
      date: this.date,
      ressource: aRessource,
    };
    new ObjetRequeteSaisieAppelInternat_1.ObjetRequeteSaisieAppelInternat(
      this,
      () => {
        let lNbAbsences = 0;
        let lNbRetards = 0;
        lCreneau.listeRessources.parcourir((aRessource) => {
          if (aRessource.estCumul) {
            lNbAbsences += aRessource.nbAbsences;
            lNbRetards += aRessource.nbRetards;
          }
        });
        lCreneau.estAppelTermine =
          !lCreneau.listeRessourcesCumul.getElementParFiltre((aRessource) => {
            return !aRessource.estAppelFait;
          });
        lCreneau.nbAbsences = lNbAbsences;
        lCreneau.nbRetards = lNbRetards;
      },
    ).lancerRequete(lParam);
  }
}
exports.InterfaceSaisieAppelInternat = InterfaceSaisieAppelInternat;
(function (InterfaceSaisieAppelInternat) {
  let genreEcran;
  (function (genreEcran) {
    genreEcran["listeCreneaux"] = "listeCreneaux";
    genreEcran["listeAppel"] = "listeAppel";
  })(
    (genreEcran =
      InterfaceSaisieAppelInternat.genreEcran ||
      (InterfaceSaisieAppelInternat.genreEcran = {})),
  );
})(
  InterfaceSaisieAppelInternat ||
    (exports.InterfaceSaisieAppelInternat = InterfaceSaisieAppelInternat = {}),
);
class DonneesListe_CreneauxAppelsInternat extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
  }
  getControleur(aInstance, aInstanceListe) {
    return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
      avecIcone: (aNumero) => {
        var _a;
        const lCreneau = aInstance.Donnees.getElementParNumero(aNumero);
        return !!((_a =
          lCreneau === null || lCreneau === void 0
            ? void 0
            : lCreneau.listeRessourcesCumul) === null || _a === void 0
          ? void 0
          : _a.count());
      },
      getAttrIcone: (aNumero) => {
        const lCreneau = aInstance.Donnees.getElementParNumero(aNumero);
        const lTexte = lCreneau.estAppelTermine
          ? ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AppelFait")
          : ObjetTraduction_1.GTraductions.getValeur(
              "AppelInternat.appelNonFait",
            );
        return {
          "aria-label": lTexte,
          title: lTexte,
          class:
            (lCreneau.estAppelTermine
              ? "Image_AppelFait"
              : "Image_AppelNonFait") + " m-left",
        };
      },
      getInfosCreneau: (aNumero) => {
        var _a;
        const lCreneau = aInstance.Donnees.getElementParNumero(aNumero);
        return (
          (_a = lCreneau.listeRessourcesCumul) === null || _a === void 0
            ? void 0
            : _a.count()
        )
          ? lCreneau.estAppelTermine
            ? ObjetTraduction_1.GTraductions.getValeur(
                "AppelInternat.nbAbsencesSurCreneau",
                [lCreneau.nbAbsences, lCreneau.nbElevesAttendus],
              )
            : ObjetTraduction_1.GTraductions.getValeur(
                "AppelInternat.nbPrevusSurCreneau",
                [lCreneau.nbElevesAttendus],
              )
          : "";
      },
    });
  }
  getTitreZonePrincipale(aParams) {
    return IE.jsx.str(
      "div",
      { class: "flex-contain" },
      aParams.article.getLibelle(),
      IE.jsx.str("div", {
        role: "img",
        "ie-if": (0, jsx_1.jsxFuncAttr)(
          "avecIcone",
          aParams.article.getNumero(),
        ),
        "ie-attr": (0, jsx_1.jsxFuncAttr)(
          "getAttrIcone",
          aParams.article.getNumero(),
        ),
        "aria-label": ObjetTraduction_1.GTraductions.getValeur(
          "AppelInternat.appelNonFait",
        ),
      }),
    );
  }
  getInfosSuppZonePrincipale(aParams) {
    const lStrLibellesRessources = aParams.article.listeRessourcesCumul
      .getTableauLibelles()
      .join(", ");
    const lLibelle =
      aParams.article.heure +
      (lStrLibellesRessources ? " - " + lStrLibellesRessources : "");
    return IE.jsx.str(
      "div",
      { title: ObjetChaine_1.GChaine.toTitle(lLibelle) },
      lLibelle,
    );
  }
  getZoneComplementaire(aParams) {
    return IE.jsx.str("div", {
      "ie-html": (0, jsx_1.jsxFuncAttr)(
        "getInfosCreneau",
        aParams.article.getNumero(),
      ),
    });
  }
}
class DonneesListe_RessourcesAppelsInternat extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
  constructor(aListeDonnees, aCallback) {
    super(aListeDonnees);
    this.idLabelSwitch = GUID_1.GUID.getId() + "_";
    this.callback = aCallback;
    this.setOptions({ avecBoutonActionLigne: false, avecSelection: false });
  }
  getTri() {
    return [
      ObjetTri_1.ObjetTri.initRecursif("pere", [
        ObjetTri_1.ObjetTri.init((D) => {
          return D.getLibelle();
        }),
      ]),
    ];
  }
  getControleur(aInstance, aInstanceListe) {
    return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
      nodePhotoEleve() {
        $(this.node).on("error", function () {
          $(this).attr("src", "FichiersRessource/PortraitSilhouette.png");
        });
      },
      infosAbsenceRessource: (aNumero) => {
        const lRessource = aInstance.Donnees.getElementParNumero(aNumero);
        const lNbAbsences = ObjetTraduction_1.GTraductions.getValeur(
          "AppelInternat.nbElevesAbsent",
          [lRessource.nbAbsences],
        );
        const lNbRetards = ObjetTraduction_1.GTraductions.getValeur(
          "AppelInternat.nbElevesRetard",
          [lRessource.nbRetards],
        );
        const lStrNbAbsence =
          lRessource.nbAbsences && lRessource.nbRetards
            ? lNbAbsences + ", " + lNbRetards
            : lRessource.nbAbsences
              ? lNbAbsences
              : lRessource.nbRetards
                ? lNbRetards
                : ObjetTraduction_1.GTraductions.getValeur(
                    "AppelInternat.aucunEleveAbsent",
                  );
        return lStrNbAbsence;
      },
      attrSW: (aNumero) => {
        const lRessource = aInstance.Donnees.getElementParNumero(aNumero);
        return {
          "aria-label": lRessource.estAppelFait
            ? ObjetTraduction_1.GTraductions.getValeur("Oui")
            : ObjetTraduction_1.GTraductions.getValeur("Non"),
        };
      },
      swAppelfait: {
        getValue: (aNumero) => {
          return aInstance.Donnees.getElementParNumero(aNumero).estAppelFait;
        },
        setValue: (aNumero, aValeur) => {
          const lRessource = aInstance.Donnees.getElementParNumero(aNumero);
          lRessource.estAppelFait = aValeur;
          this.callback(lRessource);
        },
      },
      attrCB: (aNumero) => {
        const lEleve = aInstance.Donnees.getElementParNumero(aNumero);
        return {
          "aria-label": lEleve.estAbsent
            ? ObjetTraduction_1.GTraductions.getValeur(
                "AppelInternat.boutonAbsent",
              )
            : lEleve.estEnRetard
              ? ObjetTraduction_1.GTraductions.getValeur(
                  "AppelInternat.boutonRetard",
                )
              : ObjetTraduction_1.GTraductions.getValeur(
                  "AppelInternat.wai.present",
                ),
        };
      },
      cbAbsence: {
        getValue: (aNumero) => {
          return aInstance.Donnees.getElementParNumero(aNumero).estAbsent;
        },
        setValue: (aNumero, aValeur) => {
          const lEleve = aInstance.Donnees.getElementParNumero(aNumero);
          const lFunc = (aEleve) => {
            if (aEleve.pere.estAppelFait) {
              GApplication.getMessage().afficher({
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "AppelInternat.messConfirmezModifFeuilleAppel",
                ),
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
                callback: (aAccepte) => {
                  if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
                    aEleve.pere.estAppelFait = false;
                    this.callback(aEleve.pere);
                    this.surCBAbsence(aEleve, aValeur);
                  }
                },
              });
            } else {
              this.surCBAbsence(aEleve, aValeur);
            }
          };
          if (lEleve.enStage && lEleve.avecConfirmationEnStage && aValeur) {
            GApplication.getMessage().afficher({
              message: ObjetTraduction_1.GTraductions.getValeur(
                "AppelInternat.messConfirmezSaisieAbsenceInternatSurStage",
              ),
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
              callback: (aAccepte) => {
                if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
                  lFunc(lEleve);
                }
              },
            });
          } else {
            lFunc(lEleve);
          }
        },
        getDisabled: (aNumero) => {
          const lEleve = aInstance.Donnees.getElementParNumero(aNumero);
          return lEleve.estExclu || lEleve.enMesureConservatoire;
        },
      },
      cbRetard: {
        getValue: (aNumero) => {
          return aInstance.Donnees.getElementParNumero(aNumero).estEnRetard;
        },
        setValue: (aNumero, aValeur) => {
          const lEleve = aInstance.Donnees.getElementParNumero(aNumero);
          const lFunc = (aEleve) => {
            if (lEleve.pere.estAppelFait) {
              GApplication.getMessage().afficher({
                message: ObjetTraduction_1.GTraductions.getValeur(
                  "AppelInternat.messConfirmezModifFeuilleAppel",
                ),
                type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
                callback: (aAccepte) => {
                  if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
                    lEleve.pere.estAppelFait = false;
                    this.callback(lEleve.pere);
                    this.surCBRetard(lEleve, aValeur);
                  }
                },
              });
            } else {
              this.surCBRetard(lEleve, aValeur);
            }
          };
          if (lEleve.enStage && lEleve.avecConfirmationEnStage && aValeur) {
            GApplication.getMessage().afficher({
              message: ObjetTraduction_1.GTraductions.getValeur(
                "AppelInternat.messConfirmezSaisieRetardInternatSurStage",
              ),
              type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
              callback: (aAccepte) => {
                if (aAccepte === Enumere_Action_1.EGenreAction.Valider) {
                  lFunc(lEleve);
                }
              },
            });
          } else {
            lFunc(lEleve);
          }
        },
        getDisabled: (aNumero) => {
          const lEleve = aInstance.Donnees.getElementParNumero(aNumero);
          return lEleve.estExclu || lEleve.enMesureConservatoire;
        },
      },
    });
  }
  surCBAbsence(aEleve, aValeur) {
    aEleve.estAbsent = aValeur;
    if (aEleve.estEnRetard) {
      aEleve.pere.nbRetards -= 1;
    }
    aEleve.estEnRetard = false;
    aEleve.pere.nbAbsences += aValeur ? 1 : -1;
    this.callback(aEleve);
  }
  surCBRetard(aEleve, aValeur) {
    aEleve.estEnRetard = aValeur;
    if (aEleve.estAbsent) {
      aEleve.pere.nbAbsences -= 1;
    }
    aEleve.estAbsent = false;
    aEleve.pere.nbRetards += aValeur ? 1 : -1;
    this.callback(aEleve);
  }
  getZoneGauche(aParams) {
    if (!aParams.article.estCumul) {
      const lEleve = aParams.article;
      let lAvecPhoto = GApplication.droits.get(
        ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
      );
      return IE.jsx.str("img", {
        src: lAvecPhoto ? false : "FichiersRessource/PortraitSilhouette.png",
        "ie-load-src": lAvecPhoto
          ? ObjetChaine_1.GChaine.creerUrlBruteLienExterne(lEleve, {
              libelle: "photo.jpg",
            })
          : false,
        "ie-node": (0, jsx_1.jsxFuncAttr)("nodePhotoEleve"),
        style: "width: 3.5rem;height: 4rem;",
        alt: "",
        "aria-hidden": "true",
      });
    }
  }
  getTitreZonePrincipale(aParams) {
    if (aParams.article.estCumul) {
      const lRessource = aParams.article;
      return IE.jsx.str(
        "div",
        { class: "theme_color_foncee" },
        lRessource.getLibelle(),
        " (",
        lRessource.nbElevesAttendus,
        ")",
      );
    } else {
      const lEleve = aParams.article;
      return IE.jsx.str(
        "div",
        null,
        lEleve.getLibelle(),
        lEleve.estExclu
          ? " [" +
              ObjetTraduction_1.GTraductions.getValeur("AppelInternat.exclu") +
              "]"
          : "",
        lEleve.enMesureConservatoire
          ? " [" +
              ObjetTraduction_1.GTraductions.getValeur("AppelInternat.MC") +
              "]"
          : "",
        lEleve.enStage
          ? " [" +
              ObjetTraduction_1.GTraductions.getValeur(
                "AppelInternat.enStage",
              ) +
              "]"
          : "",
      );
    }
  }
  getInfosSuppZonePrincipale(aParams) {
    if (!aParams.article.estCumul) {
      const lEleve = aParams.article;
      return IE.jsx.str("div", null, lEleve.strClasse);
    }
  }
  getZoneMessageLarge(aParams) {
    if (aParams.article.estCumul) {
      return IE.jsx.str(
        IE.jsx.fragment,
        null,
        IE.jsx.str("div", {
          "ie-html": (0, jsx_1.jsxFuncAttr)(
            "infosAbsenceRessource",
            aParams.article.getNumero(),
          ),
        }),
        IE.jsx.str(
          "div",
          { class: "flex-contain" },
          IE.jsx.str(
            "label",
            { id: this.idLabelSwitch + aParams.ligne },
            ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AppelFait"),
            " :",
          ),
          IE.jsx.str(
            "ie-switch",
            {
              class: "m-left-auto",
              "ie-model": (0, jsx_1.jsxFuncAttr)(
                "swAppelfait",
                aParams.article.getNumero(),
              ),
              "aria-describedby": this.idLabelSwitch + aParams.ligne,
              "ie-attr": (0, jsx_1.jsxFuncAttr)(
                "attrSW",
                aParams.article.getNumero(),
              ),
            },
            IE.jsx.str(
              "span",
              null,
              ObjetTraduction_1.GTraductions.getValeur("Non"),
            ),
            IE.jsx.str(
              "span",
              null,
              ObjetTraduction_1.GTraductions.getValeur("Oui"),
            ),
          ),
        ),
      );
    } else {
      return IE.jsx.str(
        "div",
        {
          role: "group",
          class: "text-right",
          "ie-attr": (0, jsx_1.jsxFuncAttr)(
            "attrCB",
            aParams.article.getNumero(),
          ),
        },
        IE.jsx.str(
          "ie-checkbox",
          {
            "ie-model": (0, jsx_1.jsxFuncAttr)(
              "cbAbsence",
              aParams.article.getNumero(),
            ),
            class: "as-chips rouge avecCouleur-is-disabled m-all",
          },
          ObjetTraduction_1.GTraductions.getValeur(
            "AppelInternat.boutonAbsent",
          ),
        ),
        IE.jsx.str(
          "ie-checkbox",
          {
            "ie-model": (0, jsx_1.jsxFuncAttr)(
              "cbRetard",
              aParams.article.getNumero(),
            ),
            class: "as-chips light-jaune avecCouleur-is-disabled m-all",
          },
          ObjetTraduction_1.GTraductions.getValeur(
            "AppelInternat.boutonRetard",
          ),
        ),
      );
    }
  }
}
