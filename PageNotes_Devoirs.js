const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { GHtml } = require("ObjetHtml.js");
const { GDate } = require("ObjetDate.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListe } = require("ObjetListe.js");
const { Identite } = require("ObjetIdentite.js");
const {
  DonneesListe_Notes,
  EGenreCommandeMenuCtxNote,
} = require("DonneesListe_Notes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { ObjetSelection } = require("ObjetSelection.js");
const { ObjetPanelEditionDevoir } = require("ObjetPanelEditionDevoir.js");
const { ObjetPanelMoyennesEleve } = require("ObjetPanelMoyennesEleve.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GObjetWAI, EGenreAttribut } = require("ObjetWAI.js");
const { GUID } = require("GUID.js");
const { Clavier_SaisieNote } = require("Clavier_SaisieNote.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeNote } = require("TypeNote.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_MethodeCalculMoyenne,
} = require("ObjetFenetre_MethodeCalculMoyenne.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { GChaine } = require("ObjetChaine.js");
class PageNotes_Devoirs extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.moteurGrille = new ObjetMoteurGrilleSaisie();
    this.moteurNotes = new MoteurNotes();
    this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
    this.ids = {
      page: "Notes_Devoirs",
      listeEleves: this.Nom + "_listeEleves",
      boutonPlus: this.Nom + "_btnPlus",
      msgAucun: GUID.getId(),
      inputCommentaireSurNote: GUID.getId(),
    };
    this.donnees = {
      listeEleves: null,
      listeDevoirs: null,
      listeClasses: null,
      service: null,
      periode: null,
      devoirSelectionne: null,
      baremeParDefaut: null,
      strInfoCloture: "",
    };
    this.dimensions = { carreDevoirFac: 20, hauteurComboDevoirSur2Lignes: 68 };
    this.afficherComboDevoirSur2Lignes = false;
    this.eleveDevoirEnCourDeSaisie = null;
    this.instanceComboDevoir = Identite.creerInstance(ObjetSelection, {
      pere: this,
      evenement: _evntSelecteur.bind(this),
      options: {
        avecBoutonsPrecedentSuivant: false,
        labelWAICellule: GTraductions.getValeur("Notes.SelectionnezDevoir"),
      },
    });
    _initSelecteur.call(this, this.instanceComboDevoir);
    this.instanceListeNotes = Identite.creerInstance(ObjetListe, {
      pere: this,
      evenement: _evntSurListe.bind(this),
    });
    this.instancePanelEditionDevoir = Identite.creerInstance(
      ObjetPanelEditionDevoir,
      { pere: this, evenement: _evntSurEditionDevoir.bind(this) },
    );
    this.clavierSaisieNote = null;
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(this), {
      getInfoCloture: function () {
        return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
      },
      getNodePage: function () {
        $("#" + GInterface.idZonePrincipale).ieHtmlAppend(
          '<div id="' +
            aInstance.ids.boutonPlus +
            '" class="is-sticky btn-float primary messagerieNouveauMessage ie-ripple ie-ripple-claire" ie-event="click->btnPlus.surCreerDevoir()" ie-display="btnPlus.estVisible"></div>',
          { controleur: this.controleur },
        );
        $(this.node).on("destroyed", function () {
          $("#" + aInstance.ids.boutonPlus.escapeJQ()).remove();
        });
      },
      btnPlus: {
        surCreerDevoir: function () {
          ouvrirEditionDevoir.call(aInstance, { estCreation: true });
        },
        estVisible: function () {
          return (
            aInstance.donnees &&
            aInstance.donnees.listeDevoirs &&
            aInstance.donnees.listeDevoirs.count() === 0 &&
            aInstance.moteurNotes.avecCreationDevoir({
              service: aInstance.donnees.service,
              periode: aInstance.donnees.periode,
              clotureGlobal: aInstance.clotureGlobal,
            })
          );
        },
      },
      nodeEditDevoir: {
        event: function () {
          ouvrirEditionDevoir.call(aInstance, { estCreation: false });
        },
        getDisabled: function () {
          return (
            aInstance.donnees.devoirSelectionne === null ||
            aInstance.donnees.devoirSelectionne === undefined
          );
        },
      },
      estCrayonVisible: function () {
        return aInstance.donnees.listeDevoirs.count() > 0;
      },
      estMessageVisible: function () {
        const lListeDevoirs = aInstance.donnees.listeDevoirs;
        const lListeEleves = aInstance.donnees.listeEleves;
        return (
          lListeDevoirs === null ||
          lListeDevoirs === undefined ||
          lListeDevoirs.count() === 0 ||
          lListeEleves === null ||
          lListeEleves === undefined ||
          lListeEleves.count() === 0
        );
      },
      inputCommentaireSurNote: {
        getValue() {
          if (
            aInstance.eleveDevoirEnCourDeSaisie &&
            aInstance.eleveDevoirEnCourDeSaisie.commentaire
          ) {
            return aInstance.eleveDevoirEnCourDeSaisie.commentaire;
          }
          return "";
        },
        setValue(aVal) {
          if (aInstance.eleveDevoirEnCourDeSaisie) {
            aInstance.eleveDevoirEnCourDeSaisie.commentaire = aVal;
          }
        },
        getDisabled() {
          if (aInstance.clavierSaisieNote) {
            return aInstance.clavierSaisieNote.estNoteSaisieVide();
          }
          return true;
        },
        node() {
          $(this.node).on({
            focusout_TextareaMax: function () {
              if (aInstance.clavierSaisieNote) {
                _afficherpaveSaisie.call(aInstance);
                this.classList.add("border-color-neutre");
              }
            },
            focus: function () {
              if (aInstance.clavierSaisieNote) {
                _masquerPaveSaisie.call(aInstance);
                this.classList.remove("border-color-neutre");
              }
            },
          });
        },
      },
    });
  }
  setControleur(aController) {
    Object.assign(this.controleur, aController);
  }
  setDonnees(aDonnees) {
    let lSelectionCourante;
    if (
      aDonnees.selectionDevoir !== null &&
      aDonnees.selectionDevoir !== undefined
    ) {
      lSelectionCourante = aDonnees.selectionDevoir;
    } else if (this.donnees.devoirSelectionne !== null) {
      lSelectionCourante = this.donnees.devoirSelectionne;
    }
    Object.assign(this.donnees, aDonnees);
    this.moteurNotes.controlerElevesClotures({
      listeDevoirs: this.donnees.listeDevoirs,
      listeEleves: this.donnees.listeEleves,
    });
    this.strInfoCloture = aDonnees.strInfoCloture;
    this.cloture = this.moteurNotes.laPeriodeEstClotureePourNotation({
      periode: this.donnees.periode,
      listeClasses:
        this.donnees.classe.getGenre() === EGenreRessource.Classe
          ? new ObjetListeElements().addElement(
              this.donnees.listeClasses.getElementParNumero(
                this.donnees.classe.getNumero(),
              ),
            )
          : this.donnees.listeClasses,
    });
    this.clotureGlobal = this.moteurNotes.laPeriodeEstClotureePourNotation({
      periode: this.donnees.periode,
      listeClasses: this.donnees.listeClasses,
    });
    if (
      this.donnees.listeDevoirs !== null &&
      this.donnees.listeDevoirs !== undefined
    ) {
      this.afficherComboDevoirSur2Lignes = false;
      this.donnees.listeDevoirs.parcourir((D) => {
        const lStrDate = GDate.formatDate(D.date, "%JJ %MMM");
        const lStrDevoir =
          D.commentaire !== ""
            ? lStrDate + " (" + D.commentaire + ")"
            : lStrDate;
        D.setLibelle(lStrDevoir);
        D.Visible = this.moteurNotesCP.devoirExiste({
          devoir: D,
          periode: this.donnees.periode,
        });
        D.libelleHtml = this._getHtmlDevoir({ devoir: D });
      });
      this.donnees.listeDevoirs.parcourir((D) => {
        D.libelleHtmlTitre = this._getHtmlTitreDevoir({ devoir: D });
      });
      this.donnees.listeDevoirs.setTri([
        ObjetTri.init("date", EGenreTriElement.Decroissant),
      ]);
      this.donnees.listeDevoirs.trier();
      let lDevoir;
      if (lSelectionCourante !== null && lSelectionCourante !== undefined) {
        lDevoir = this.donnees.listeDevoirs.getElementParNumero(
          lSelectionCourante.getNumero(),
        );
      }
      if (lDevoir !== null && lDevoir !== undefined) {
        this.donnees.devoirSelectionne = lDevoir;
      } else {
        if (this.donnees.listeDevoirs.count() > 0) {
          this.donnees.devoirSelectionne = this.donnees.listeDevoirs.get(0);
        }
      }
    }
    this.moteurNotes.setContexte({ periodeParDefaut: this.donnees.periode });
    this.afficher();
    this.instanceComboDevoir.setParametres({
      height:
        this.afficherComboDevoirSur2Lignes === true
          ? this.dimensions.hauteurComboDevoirSur2Lignes
          : null,
    });
    if (this.donnees.listeDevoirs.count() === 0) {
      this.instanceComboDevoir.setVisible(false);
      GHtml.setHtml(
        this.ids.msgAucun,
        this.composeAucuneDonnee(GTraductions.getValeur("Notes.AucunDevoir")),
      );
    } else {
      const lIndiceDevoirDefaut = this.donnees.listeDevoirs.getIndiceParElement(
        this.donnees.devoirSelectionne,
      );
      this.instanceComboDevoir.setDonnees(
        this.donnees.listeDevoirs,
        lIndiceDevoirDefaut,
      );
    }
  }
  _getHtmlTitreDevoir(aParam) {
    const lHtml = this._getHtmlDevoir(
      $.extend(aParam, { sansEspaceSiAucuneInfo: true }),
    );
    if (this.afficherComboDevoirSur2Lignes) {
      return (
        '<div style="height:calc(' +
        this.dimensions.hauteurComboDevoirSur2Lignes +
        'px - 10px)">' +
        lHtml +
        "</div>"
      );
    } else {
      return lHtml;
    }
  }
  _getHtmlDevoir(aParam) {
    const H = [];
    if (aParam && aParam.devoir) {
      const lDevoir = aParam.devoir;
      H.push('<div class="NoWrap" style="width:100%; height:100%">');
      const lAvecInfo =
        lDevoir.commeUnBonus ||
        lDevoir.commeUneNote ||
        lDevoir.verrouille ||
        aParam.sansEspaceSiAucuneInfo !== true;
      if (lAvecInfo) {
        const lCouleur = this.moteurNotesCP.getBgColorDevoirFacultatif({
          commeUnBonus: lDevoir.commeUnBonus,
          commeUneNote: lDevoir.commeUneNote,
        });
        const lbgCouleur = "background-color : " + lCouleur + "; ";
        H.push(
          '<div class="InlineBlock AlignementMilieuVertical AlignementMilieu MargeDroit" style="height:',
          this.dimensions.carreDevoirFac,
          "px; width:",
          this.dimensions.carreDevoirFac,
          "px; ",
          lbgCouleur,
          '">',
        );
        if (lDevoir.verrouille) {
          H.push(
            '<div style="height:',
            this.dimensions.carreDevoirFac,
            "px; width:",
            this.dimensions.carreDevoirFac,
            'px; display: flex; align-items: center; justify-content: center;"><i class="icon_lock" style="font-size:14px; margin:0px;"></i></div>',
          );
        } else {
          H.push("&nbsp;");
        }
        H.push("</div>");
      }
      const lAvecCoef = !lDevoir.coefficient.estCoefficientParDefaut();
      const lAvecBareme =
        lDevoir.bareme.getValeur() !== this.donnees.baremeParDefaut.getValeur();
      const lEstSousService = !lDevoir.service.estUnService;
      const lAvecLigne2 = lAvecCoef || lAvecBareme || lEstSousService;
      if (lAvecLigne2 === true) {
        this.afficherComboDevoirSur2Lignes = true;
      }
      H.push(
        '<div style="height:100%; width:calc(100% - ',
        this.dimensions.carreDevoirFac,
        'px)" class="',
        lAvecInfo ? "EspaceGauche" : "",
        ' InlineBlock AlignementMilieuVertical">',
      );
      H.push(
        '<div style="height:',
        lAvecLigne2 ? "50" : "100",
        '%" class="NoWrap">',
      );
      H.push(
        '<div style="height:100%; width:0px" class="InlineBlock AlignementMilieuVertical">&nbsp;</div>',
      );
      H.push(
        '<div class="ie-ellipsis InlineBlock AlignementMilieuVertical" style="line-height:1.1">',
      );
      H.push(GDate.formatDate(lDevoir.date, "%JJ %MMM"));
      if (lDevoir.commentaire) {
        H.push(" - ", lDevoir.commentaire);
      }
      H.push("</div>");
      H.push("</div>");
      if (lAvecLigne2) {
        H.push('<div style="height:50%" class="NoWrap">');
        H.push(
          '<div style="height:100%; width:0px" class="InlineBlock AlignementMilieuVertical">&nbsp;</div>',
        );
        H.push(
          '<div class="ie-ellipsis InlineBlock AlignementMilieuVertical" style="line-height:1.1">',
        );
        if (lAvecCoef) {
          H.push(
            GTraductions.getValeur("Notes.Coefficient") +
              " " +
              lDevoir.coefficient.getValeur(),
          );
        }
        if (lAvecBareme) {
          H.push(
            lAvecCoef ? " - " : "",
            GTraductions.getValeur("Notes.NoteSur", [
              lDevoir.bareme.getValeur(),
            ]),
          );
        }
        if (lEstSousService) {
          H.push(
            lAvecBareme || lAvecCoef ? " - " : "",
            lDevoir.service.getLibelle(),
          );
        }
        H.push("</div>");
        H.push("</div>");
      }
      H.push("</div>");
      H.push("</div>");
    }
    return H.join("");
  }
  construireAffichage() {
    const H = [];
    if (!!this.donnees.listeEleves && !!this.donnees.listeDevoirs) {
      H.push(
        '<div id="',
        this.ids.page,
        '" ie-node="getNodePage" class="flex-contain cols bg-white full-height fluid-bloc" >',
        '<div class="flex-contain btn-avec-edition fix-bloc">',
        '   <div id="',
        this.instanceComboDevoir.getNom(),
        '" class="fluid-bloc">',
        "</div>",
        '   <div class="fix-bloc p-left"><ie-btnicon class="icon_pencil i-medium avecFond" ie-model="nodeEditDevoir" ie-display="estCrayonVisible" ',
        GObjetWAI.composeAttribut({
          genre: EGenreAttribut.label,
          valeur: GTraductions.getValeur("Notes.ModifierDevoir"),
        }),
        " ></ie-btnicon></div>",
        "</div>",
        '<div id="',
        this.ids.msgAucun,
        '" ie-display="estMessageVisible" class="fix-bloc"></div>',
        '<span class="self-center" ie-html = "getInfoCloture"></span>',
        '<div class="fluid-bloc liste-notes" id="',
        this.instanceListeNotes.getNom(),
        '" ></div>',
        "</div>",
      );
    }
    return H.join("");
  }
  initListeNotes() {
    const lAvecLigneCreation = this.moteurNotes.avecCreationDevoir({
      service: this.donnees.service,
      periode: this.donnees.periode,
      clotureGlobal: this.clotureGlobal,
    });
    this.instanceListeNotes.setOptionsListe({
      avecLigneCreation: lAvecLigneCreation,
      nonEditableSurModeExclusif: true,
      skin: ObjetListe.skin.flatDesign,
      messageContenuVide: GTraductions.getValeur("Notes.AucunEleve"),
    });
  }
  callbackSurToucheClavierSaisieNote() {
    this.$refresh();
  }
}
PageNotes_Devoirs.genreEvnt = {
  valider: "valider",
  majMoyennes: "majMoyennes",
  validerUnitaire: "validerUnitaire",
};
function _afficherListe() {
  const lDonnees = _formatterDonneesPourListe.call(this);
  const lListeDevoirs = _formatterDevoirsPourListe.call(this);
  const lParamDonneesListe = {
    devoirSelectionne: this.donnees.devoirSelectionne,
    instanceListe: this.instanceListeNotes,
    listeDevoirs: lListeDevoirs,
    listeEleves: this.donnees.listeEleves,
    avecDevoirs: true,
    service: this.donnees.service,
    periode: this.donnees.periode,
    moyGenerales: this.donnees.moyGenerales.tabGenerales,
    baremeParDefaut: this.donnees.baremeParDefaut,
    callbackMenuCtx: _callbackMenuCtx.bind(this),
  };
  this.initListeNotes();
  this.donneesListeNotes = new DonneesListe_Notes(lDonnees, lParamDonneesListe);
  this.instanceListeNotes.setDonnees(this.donneesListeNotes);
}
function _formatterDonneesPourListe() {
  const lListeEleves = new ObjetListeElements();
  this.donnees.listeEleves.parcourir((D) => {
    const lEleve = new ObjetElement(
      D.getLibelle(),
      D.getNumero(),
      undefined,
      D.getPosition(),
    );
    lEleve.listeDevoirs = new ObjetListeElements();
    lEleve.moyennes = D.moyennes;
    if (D.classe !== null && D.classe !== undefined) {
      lEleve.classe = new ObjetElement(
        D.classe.getLibelle(),
        D.classe.getNumero(),
      );
    }
    lListeEleves.addElement(lEleve);
  });
  this.donnees.listeDevoirs.parcourir((aDevoir) => {
    lListeEleves.parcourir((aEleve) => {
      const lDevoir = new ObjetElement(
        aDevoir.getLibelle(),
        aDevoir.getNumero(),
      );
      lDevoir.date = aDevoir.date;
      lDevoir.commentaire = aDevoir.commentaire;
      const lEleveDevoir = aDevoir.listeEleves.getElementParNumero(
        aEleve.getNumero(),
      );
      if (lEleveDevoir !== null && lEleveDevoir !== undefined) {
        lDevoir.note = lEleveDevoir.Note;
        aEleve.listeDevoirs.addElement(lDevoir);
      }
    });
  });
  return lListeEleves;
}
function _formatterDevoirsPourListe() {
  this.donnees.listeDevoirs.parcourir((aDevoir) => {
    aDevoir.visible =
      this.donnees.devoirSelectionne !== null &&
      this.donnees.devoirSelectionne !== undefined
        ? aDevoir.getNumero() === this.donnees.devoirSelectionne.getNumero()
        : false;
  });
  return this.donnees.listeDevoirs;
}
function _evntSurListe(aParams) {
  switch (aParams.genreEvenement) {
    case EGenreEvenementListe.Creation:
      ouvrirEditionDevoir.call(this, { estCreation: true });
      break;
    case EGenreEvenementListe.SelectionClick: {
      _afficherFicheEleve.call(this, aParams.article.getNumero());
      break;
    }
    default:
      break;
  }
}
function _initSelecteur(aInstance) {
  aInstance.setParametres({ avecBoutonsPrecedentSuivant: false, icone: null });
}
function _evntSelecteur(aParam) {
  if (aParam.element && aParam.element.getNumero() !== -1) {
    const lNumeroDevoir = aParam.element.getNumero();
    this.donnees.devoirSelectionne =
      this.donnees.listeDevoirs.getElementParNumero(lNumeroDevoir);
    _afficherListe.call(this);
  }
}
function _callbackMenuCtx(aParams) {
  switch (aParams.genreCommande) {
    case EGenreCommandeMenuCtxNote.saisieNote:
      _afficherClavier.call(this, aParams);
      break;
    case EGenreCommandeMenuCtxNote.ouvrirFicheEleve:
      if (aParams.eleve) {
        _afficherFicheEleve.call(this, aParams.eleve.getNumero());
      }
      break;
    case EGenreCommandeMenuCtxNote.afficherMoyenneAnciennesNotes: {
      _afficherFicheMoyennes.call(this, aParams.article.getNumero());
      break;
    }
    case EGenreCommandeMenuCtxNote.afficherCalculMoyenne:
      _afficherCalculMoyenne.call(this, aParams);
      break;
    default:
      break;
  }
}
const getHtmlContexteClavierSaisieNote = (aParams) => {
  const lEleve = aParams.eleve;
  const lDevoir = aParams.devoir;
  const H = [];
  H.push('<div class="Gras">');
  H.push(lEleve.getLibelle().toUpperCase());
  H.push("</div>");
  H.push("<div>");
  H.push(
    GTraductions.getValeur("Notes.Bareme"),
    " ",
    lDevoir.bareme.getNote(),
    " - ",
    GTraductions.getValeur("Notes.Coefficient"),
    " ",
    lDevoir.coefficient.getNote(),
  );
  H.push("</div>");
  return H.join("");
};
function _afficherClavier(aInfo, aParams = {}) {
  if (this.clavierSaisieNote) {
    this.clavierSaisieNote.fermer();
    this.clavierSaisieNote.free();
    this.clavierSaisieNote = null;
  }
  const lHtmlContenueAdditionnel = [];
  if (aInfo.devoir.avecCommentaireSurNoteEleve) {
    lHtmlContenueAdditionnel.push(
      `<div class="p-x-l">`,
      `<label for="${this.ids.inputCommentaireSurNote}">${GTraductions.getValeur("Notes.remarque")} :</label>`,
      `<ie-textareamax id="${this.ids.inputCommentaireSurNote}" class="border-color-neutre" ie-model="inputCommentaireSurNote" placeholder="${GTraductions.getValeur("Notes.RenseignezUneNote")}"></ie-textareamax>`,
      `</div>`,
    );
  }
  const lDevoir = aInfo.devoir;
  const lClavierSaisieNote = Identite.creerInstance(Clavier_SaisieNote, {
    pere: this,
    evenement: (aNote) => {
      if (!aNote) {
        return;
      }
      if (
        !aNote.estUneNoteValide(new TypeNote(0), lDevoir.bareme, true, true)
      ) {
        GApplication.getMessage()
          .afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GChaine.format(
              GTraductions.getValeur("Notes.Message.NoteSuperieureAuBareme"),
              [aNote.getValeur(), lDevoir.bareme.getValeur()],
            ),
            avecDecalageFocusBouton: true,
          })
          .then((aGenreAction) => {
            if (aGenreAction === EGenreAction.Valider) {
              majApresNoteClavier.call(this, aInfo, aNote);
            } else {
              _afficherClavier.call(this, aInfo);
            }
          });
      } else {
        majApresNoteClavier.call(this, aInfo, aNote);
      }
    },
  });
  if (aInfo.devoir.avecCommentaireSurNoteEleve) {
    Object.assign(lClavierSaisieNote.controleur, this.controleur);
  }
  lClavierSaisieNote.setCallbackSurTouche(
    this.callbackSurToucheClavierSaisieNote,
  );
  lClavierSaisieNote.setOptions({
    valeurInit: aInfo.note.getNote(),
    metier: {
      avecAnnotations: true,
      avecSeparateurDecimal: true,
      avecSigneMoins: false,
      sansNotePossible: true,
      min: 0,
      max: this.moteurNotesCP.getBaremeDevoirMaximal(),
      bareme: this.moteurNotesCP.getBaremeDuDevoir(lDevoir),
      htmlContexte: getHtmlContexteClavierSaisieNote(aInfo),
    },
    grille: { nbLignes: 4 },
    contenueAdditionnel: {
      avec: aInfo.devoir.avecCommentaireSurNoteEleve,
      html: lHtmlContenueAdditionnel.join(""),
    },
    methodeValidationNote: TypeNote.validerNote,
  });
  this.clavierSaisieNote = lClavierSaisieNote;
  lClavierSaisieNote.afficher();
  this.eleveDevoirEnCourDeSaisie = MethodesObjet.dupliquer(aInfo.eleveDevoir);
}
function _masquerPaveSaisie() {
  if (!this.clavierSaisieNote) {
    return;
  }
  this.clavierSaisieNote.masquerClavier();
  this.clavierSaisieNote.setFocusSurNote(false);
}
function _afficherpaveSaisie() {
  if (!this.clavierSaisieNote) {
    return;
  }
  this.clavierSaisieNote.afficherClavier();
  this.clavierSaisieNote.setFocusSurNote(true);
}
function majApresNoteClavier(aInfo, aNote) {
  evntSurSaisieNoteClavier.call(this, aInfo, aNote);
  const lInfos = this.donneesListeNotes.getInfoArticleSuivant(aInfo.article);
  if (lInfos) {
    _afficherClavier.call(this, lInfos);
  }
}
function evntSurSaisieNoteClavier(aBind, aValeurSaisie, aCallback) {
  if (aValeurSaisie === null) {
    return;
  }
  const lEleveDevoir = aBind.eleveDevoir;
  if (lEleveDevoir !== null && lEleveDevoir !== undefined) {
    lEleveDevoir.Note = aValeurSaisie;
    aBind.note = aValeurSaisie;
    const lAvecSaisieCommentaire =
      this.eleveDevoirEnCourDeSaisie &&
      "commentaire" in this.eleveDevoirEnCourDeSaisie &&
      !aValeurSaisie.estUneNoteVide();
    if (lAvecSaisieCommentaire) {
      lEleveDevoir.commentaire = this.eleveDevoirEnCourDeSaisie.commentaire;
    }
    lEleveDevoir.setEtat(EGenreEtat.Modification);
  }
  this.callback.appel({
    genreEvnt: PageNotes_Devoirs.genreEvnt.validerUnitaire,
    devoir: aBind.devoir,
    eleve: aBind.eleveDevoir,
    note: aBind.eleveDevoir.Note,
  });
  this.callback.appel({
    genreEvnt: PageNotes_Devoirs.genreEvnt.majMoyennes,
    eleve: aBind.eleve,
    devoir: aBind.devoir,
    validationAuto: false,
  });
  this.eleveDevoirEnCourDeSaisie = null;
  _afficherListe.call(this);
}
function _afficherFicheEleve(aNumeroEleve) {
  let lEleve;
  if (!!this.donnees.listeEleves) {
    lEleve = this.donnees.listeEleves.getElementParNumero(aNumeroEleve);
  }
  if (!!lEleve) {
    ObjetFenetre_FicheEleve.ouvrir({
      instance: this,
      avecRequeteDonnees: true,
      donnees: { eleve: lEleve, listeEleves: this.donnees.listeEleves },
    });
  }
}
function _afficherCalculMoyenne(aParams) {
  if (!aParams.article || !aParams.article.classe) {
    return;
  }
  const lParametresCalcul = {
    libelleEleve: aParams.article.getLibelle(),
    numeroEleve: aParams.article.getNumero(),
    libelleClasse: aParams.article.classe.getLibelle(),
    numeroClasse: aParams.article.classe.getNumero(),
    libelleServiceNotation: this.donnees.service.getLibelle(),
    numeroServiceNotation: this.donnees.service.getNumero(),
    numeroPeriodeNotation: this.donnees.periode.getNumero(),
    genreChoixNotation: this.donnees.periode.getGenre(),
    moyenneTrimestrielle: true,
    pourMoyenneNette: true,
  };
  ObjetFenetre.creerInstanceFenetre(ObjetFenetre_MethodeCalculMoyenne, {
    pere: this,
    initialiser: (aInstanceFenetre) => {
      aInstanceFenetre.setOptionsFenetre({
        titre: GTraductions.getValeur(
          "BulletinEtReleve.TitreFenetreCalculMoyenne",
        ),
        listeBoutons: [GTraductions.getValeur("principal.fermer")],
      });
    },
  }).setDonnees(lParametresCalcul);
}
function _afficherFicheMoyennes(aNumeroEleve) {
  let lEleve;
  if (!!this.donnees.listeEleves) {
    lEleve = this.donnees.listeEleves.getElementParNumero(aNumeroEleve);
  }
  if (!!lEleve) {
    const lInstance = Identite.creerInstance(ObjetPanelMoyennesEleve, {
      pere: this,
      evenement: _evntSurEditionFicheMoyennes.bind(this),
    });
    lInstance.setDonnees({
      eleve: lEleve,
      listeEleves: this.donnees.listeEleves,
      service: this.donnees.service,
      periode: this.donnees.periode,
      listeDevoirs: this.donnees.listeDevoirs,
      baremeParDefaut: this.donnees.baremeParDefaut,
      actif: this.donnees.service.getActif(),
      avecSsServices: this.moteurNotesCP.getAvecSousServices({
        forcerSansSousService: false,
        service: this.donnees.service,
      }),
    });
  }
}
function _evntSurEditionFicheMoyennes(aParam) {
  switch (aParam.genreEvnt) {
    case ObjetPanelMoyennesEleve.genreEvnt.valider:
      this.callback.appel({
        genreEvnt: PageNotes_Devoirs.genreEvnt.valider,
        validationAuto: aParam.validationAuto,
        eleve: aParam.eleve,
      });
      break;
    case ObjetPanelMoyennesEleve.genreEvnt.majMoyennes:
      this.callback.appel({
        genreEvnt: PageNotes_Devoirs.genreEvnt.majMoyennes,
        validationAuto: aParam.validationAuto,
        eleve: aParam.eleve,
      });
      _afficherListe.call(this);
      break;
  }
}
function ouvrirEditionDevoir(aParam) {
  let lInfosServices;
  if (aParam.estCreation) {
    lInfosServices = this.moteurNotes.getInfosServicesDefaut({
      service: this.donnees.service,
      professeur: null,
    });
  }
  const lDevoir = aParam.estCreation
    ? this.moteurNotes.creerDevoirParDefaut({
        service: lInfosServices.serviceDefaut,
        periode: this.donnees.periode,
        matiere: this.donnees.service.matiere,
        listeEleves: this.donnees.listeEleves,
        listeClasses: this.donnees.listeClasses,
        baremeParDefaut: this.donnees.baremeParDefaut,
      })
    : this.donnees.devoirSelectionne;
  $.extend(aParam, {
    devoir: lDevoir,
    baremeParDefaut: this.donnees.baremeParDefaut,
    avecQCM: true,
    listeClasses: this.donnees.listeClasses,
    cloture: this.cloture,
    clotureGlobal: this.clotureGlobal,
    actif: this.donnees.service.getActif(),
    infosServices: lInfosServices,
  });
  this.instancePanelEditionDevoir.setDonnees(aParam);
  GInterface.openPanel(this.instancePanelEditionDevoir.getHtmlPanel(), {
    controleur: this.instancePanelEditionDevoir.controleur,
    optionsFenetre: {
      titre: this.instancePanelEditionDevoir.getTitrePanel(),
      sansPaddingContenu: true,
    },
  });
  this.instancePanelEditionDevoir.updateContent();
}
function _evntSurEditionDevoir(aParam) {
  switch (aParam.commande) {
    case ObjetPanelEditionDevoir.commandes.annuler:
      break;
    case ObjetPanelEditionDevoir.commandes.valider:
      if (aParam.estCreation) {
        if (aParam.devoir.service && aParam.devoir.service.listeEleves) {
          aParam.devoir.listeEleves =
            this.moteurNotes.creerDevoirParDefautListeEleves({
              listeEleves: aParam.devoir.service.listeEleves,
            });
        }
        this.moteurNotes.synchroniserSujetEtCorrige({
          devoir: aParam.devoir,
          listeSujets: this.donnees.listeSujets,
          listeCorriges: this.donnees.listeCorriges,
        });
        this.donnees.listeDevoirs.addElement(aParam.devoir);
      } else {
        this.donnees.listeDevoirs.addElement(
          aParam.devoir,
          this.donnees.listeDevoirs.getIndiceParElement(aParam.devoir),
        );
        this.moteurNotes.synchroniserSujetEtCorrige({
          devoir: aParam.devoir,
          listeSujets: this.donnees.listeSujets,
          listeCorriges: this.donnees.listeCorriges,
        });
        this.moteurNotes.majNotesElevesSelonBaremeDuDevoir({
          devoir: aParam.devoir,
        });
      }
      this.callback.appel({
        genreEvnt: PageNotes_Devoirs.genreEvnt.valider,
        estCreation: aParam.estCreation,
        validationAuto: true,
      });
      break;
    case ObjetPanelEditionDevoir.commandes.supprimer:
      this.donnees.listeDevoirs.addElement(
        aParam.devoir,
        this.donnees.listeDevoirs.getIndiceParElement(aParam.devoir),
      );
      this.callback.appel({
        genreEvnt: PageNotes_Devoirs.genreEvnt.valider,
        validationAuto: true,
      });
      break;
    default:
  }
  GInterface.closePanel();
}
module.exports = PageNotes_Devoirs;
