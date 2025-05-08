const {
  ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { MethodesObjet } = require("MethodesObjet.js");
const EGenreCommandeMenuCtxNote = {
  saisieNote: "saisieNote",
  afficherMoyenneAnciennesNotes: "afficherMoyenneAnciennesNotes",
  ouvrirFicheEleve: "ouvrirFicheEleve",
  afficherCalculMoyenne: "afficherCalculMoyenne",
};
class DonneesListe_Notes extends ObjetDonneesListeFlatDesign {
  constructor(aDonnees, aParam) {
    super(aDonnees);
    this.param = $.extend(
      {
        instanceListe: null,
        listeDevoirs: new ObjetListeElements(),
        listeEleves: new ObjetListeElements(),
        service: new ObjetElement(),
        periode: new ObjetElement(),
        callbackMenuCtx: () => {},
      },
      aParam,
    );
    this.moteurNotes = new MoteurNotes({
      periodeParDefaut: this.param.periode,
    });
    this.moteurNotesCP = new MoteurNotesCP(this.moteurNotes);
    this.setOptions({
      avecSelection: true,
      avecEvnt_SelectionClick: true,
      avecEllipsis: true,
    });
  }
  getControleur(aInstance, aListe) {
    return $.extend(true, super.getControleur(aInstance, aListe), {
      btnModel: {
        getDisabled(aNumeroLigne) {
          const lArticle = aInstance.Donnees.get(aNumeroLigne);
          const lInfo = getInfos.call(aInstance, lArticle);
          if (!lInfo.estNoteExistante) {
            return false;
          }
          if (!lArticle) {
            return true;
          }
          return !_estCellEditable.call(aInstance, lArticle);
        },
        event(aNumeroLigne) {
          const lArticle = aInstance.Donnees.get(aNumeroLigne);
          const lInfo = getInfos.call(aInstance, lArticle);
          if (!lInfo.estNoteExistante) {
            const lParametres = {
              article: lArticle,
              numeroDevoir: aInstance.param.devoirSelectionne.getNumero(),
            };
            const lMsgInfo = aInstance.moteurNotesCP.getMsgNoteNonEditable({
              actif: aInstance.param.service.getActif(),
              devoir: aInstance.moteurNotes.getDevoir(lParametres, {
                listeDevoirs: aInstance.param.listeDevoirs,
              }),
              eleve: aInstance.moteurNotes.getEleve(lParametres, {
                listeEleves: aInstance.param.listeEleves,
              }),
              eleveDevoir: aInstance.moteurNotes.getEleveDevoir(lParametres, {
                listeDevoirs: aInstance.param.listeDevoirs,
              }),
              devoirDansPeriode: aInstance.moteurNotes.devoirDansPeriode.bind(
                aInstance.moteurNotes,
              ),
            });
            if (lMsgInfo !== "") {
              GApplication.getMessage().afficher({ message: lMsgInfo });
            }
            return true;
          }
          if (!lArticle) {
            return true;
          }
          aInstance.param.callbackMenuCtx(
            Object.assign(
              {
                article: lArticle,
                genreCommande: EGenreCommandeMenuCtxNote.saisieNote,
              },
              getInfos.call(aInstance, lArticle),
            ),
          );
        },
        getLibelle(aNumeroLigne) {
          const lArticle = aInstance.Donnees.get(aNumeroLigne);
          const lInfo = getInfos.call(aInstance, lArticle);
          if (!lInfo.estNoteExistante) {
            return "X";
          } else {
            return lInfo.estNoteExistante &&
              lInfo.note &&
              !lInfo.note.estUneNoteVide()
              ? lInfo.note.getNote()
              : "...";
          }
        },
      },
    });
  }
  getTotal(aEstHeader) {
    if (aEstHeader) {
      return null;
    }
    let lDevoir = this.moteurNotes.getDevoir(
      {
        article: new ObjetElement(
          "",
          DonneesListe_Notes.genreLigneTotal.generale,
        ),
        numeroDevoir: this.param.devoirSelectionne.getNumero(),
      },
      { listeDevoirs: this.param.listeDevoirs },
    );
    if (lDevoir && lDevoir.Moyenne) {
      lDevoir = lDevoir.Moyenne.getNote();
    }
    let lMoyenneDeLaClasse =
      this.param.moyGenerales[MoteurNotesCP.genreMoyenne.Moyenne];
    if (lMoyenneDeLaClasse) {
      lMoyenneDeLaClasse = lMoyenneDeLaClasse.getNote();
    }
    const lStrNbrEleve = this.moteurNotesCP.strTitreEleves(
      this.Donnees.count(),
    );
    const H = [];
    H.push(
      `<section class="flex-contain justify-between flex-center">`,
      `<article>`,
      `<p class="ie-titre">${lStrNbrEleve || ""}</p>`,
      `<p class="ie-sous-titre">${GTraductions.getValeur("Notes.MoyClasse")} : ${lMoyenneDeLaClasse || ""}</p>`,
      `</article>`,
      `<article>`,
      `<p class="ie-titre">${GTraductions.getValeur("Notes.MoyDevoir")} : ${lDevoir}</p>`,
      `</article>`,
      `</section>`,
    );
    return { html: H.join(""), wai: "" };
  }
  getInfosSuppZonePrincipale(aParams) {
    const lNote = aParams.article.moyennes[MoteurNotesCP.genreMoyenne.Moyenne];
    if (!lNote) {
      return "";
    }
    const lMoyenne = this.moteurNotesCP.composeHtmlNote({
      facultatif:
        this.param.service.facultatif === true &&
        lNote.getValeur() <= this.param.baremeParDefaut.getValeur() / 2,
      note: lNote,
    });
    return `<p class="ie-sous-titre">${GTraductions.getValeur("Notes.Moy")} : ${lMoyenne}</p>`;
  }
  getZoneComplementaire(aParams) {
    const lInfo = getInfos.call(this, aParams.article);
    const lAvecCommentaireSurNote =
      lInfo.eleveDevoir &&
      MethodesObjet.isString(lInfo.eleveDevoir.commentaire) &&
      lInfo.eleveDevoir.commentaire.length > 0;
    const H = [];
    H.push(
      "<div>",
      lAvecCommentaireSurNote
        ? `<i class="icon_comment_vide theme_color_moyen1 m-right-xl" ></i>`
        : "",
      `<ie-bouton ie-model="btnModel(${aParams.ligne})" class="themeBoutonNeutre fixed-mobile"></ie-bouton>`,
      "</div>",
    );
    return H.join("");
  }
  initialisationObjetContextuel(aParams) {
    if (!aParams.menuContextuel) {
      return;
    }
    const lEstEditable = _estCellEditable.call(this, aParams.article);
    const lInfo = getInfos.call(this, aParams.article);
    const lNote = aParams.article.moyennes[MoteurNotesCP.genreMoyenne.Moyenne];
    const lExisteMoyenne = lNote.note !== "";
    aParams.menuContextuel.add(
      lInfo && lInfo.devoir.avecCommentaireSurNoteEleve
        ? GTraductions.getValeur("Notes.saisirLaNoteEtRemarque")
        : GTraductions.getValeur("Notes.saisirLaNote"),
      lEstEditable,
      () => {
        this.param.callbackMenuCtx(
          Object.assign(
            {
              article: aParams.article,
              genreCommande: EGenreCommandeMenuCtxNote.saisieNote,
            },
            lInfo,
          ),
        );
      },
    );
    aParams.menuContextuel.add(
      GTraductions.getValeur("Notes.voirMoyenne"),
      true,
      () => {
        this.param.callbackMenuCtx(
          Object.assign(
            {
              article: aParams.article,
              genreCommande:
                EGenreCommandeMenuCtxNote.afficherMoyenneAnciennesNotes,
            },
            lInfo,
          ),
        );
      },
    );
    aParams.menuContextuel.add(
      GTraductions.getValeur("BulletinEtReleve.TitreFenetreCalculMoyenne"),
      lExisteMoyenne,
      () => {
        this.param.callbackMenuCtx(
          Object.assign(
            {
              article: aParams.article,
              genreCommande: EGenreCommandeMenuCtxNote.afficherCalculMoyenne,
            },
            lInfo,
          ),
        );
      },
    );
    aParams.menuContextuel.add(
      GTraductions.getValeur("Notes.voirFicheEleve"),
      true,
      () => {
        this.param.callbackMenuCtx(
          Object.assign(
            {
              article: aParams.article,
              genreCommande: EGenreCommandeMenuCtxNote.ouvrirFicheEleve,
            },
            lInfo,
          ),
        );
      },
    );
    aParams.menuContextuel.setDonnees();
  }
  getInfoArticle(aArticle) {
    const lInfo = getInfos.call(this, aArticle);
    return Object.assign({ article: aArticle }, lInfo);
  }
  getInfoArticleSuivant(aArticle) {
    const lArticleLigneSuivante = this.getArticleSuivant(aArticle);
    if (lArticleLigneSuivante) {
      const lInfo = getInfos.call(this, lArticleLigneSuivante);
      return Object.assign({ article: lArticleLigneSuivante }, lInfo);
    }
    return null;
  }
  getArticleSuivant(aArticle) {
    const lIndiceEleveSelectionne = this.Donnees.getIndiceParElement(aArticle);
    const lArticleLigneSuivante = this.Donnees.get(lIndiceEleveSelectionne + 1);
    const maxIndice = this.Donnees.count() - 1;
    if (lArticleLigneSuivante) {
      const lInfo = getInfos.call(this, lArticleLigneSuivante);
      if (lInfo.estNoteEditable) {
        return lArticleLigneSuivante;
      } else if (lIndiceEleveSelectionne + 1 < maxIndice) {
        return this.getArticleSuivant(lArticleLigneSuivante);
      }
    }
  }
}
DonneesListe_Notes.colonnes = {
  eleve: "eleve",
  devoir: "devoir",
  moyenne: "moyenne",
};
DonneesListe_Notes.dimensions = { largeurNote: 45 };
DonneesListe_Notes.genreLigneTotal = { generale: 1 };
function _estDonneeEditable(aParams) {
  const lInfo = getInfos.call(this, aParams);
  return this.moteurNotesCP.estNoteEditable({
    actif: this.param.service.getActif(),
    devoir: lInfo.devoir,
    eleve: lInfo.eleve,
    eleveDevoir: lInfo.eleveDevoir,
    devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
      this.moteurNotes,
    ),
  });
}
function _estDonneeCloture() {
  return false;
}
function _estCellEditable(aParams) {
  const lEditable = _estDonneeEditable.call(this, aParams);
  const lCloture = _estDonneeCloture.call(this, aParams);
  return lEditable && !lCloture;
}
function getInfos(aArticle) {
  const lResult = {
    note: null,
    eleveDevoir: null,
    estNoteExistante: false,
    estNoteEditable: false,
    devoir: null,
    eleve: null,
  };
  const lParamsAuFormatDuMoteur = {
    article: aArticle,
    numeroDevoir: this.param.devoirSelectionne.getNumero(),
  };
  lResult.eleve = this.moteurNotes.getEleve(lParamsAuFormatDuMoteur, {
    listeEleves: this.param.listeEleves,
  });
  lResult.devoir = this.moteurNotes.getDevoir(lParamsAuFormatDuMoteur, {
    listeDevoirs: this.param.listeDevoirs,
  });
  lResult.eleveDevoir = this.moteurNotes.getEleveDevoirParNumero({
    listeDevoirs: this.param.listeDevoirs,
    numeroDevoir: this.param.devoirSelectionne.getNumero(),
    numeroEleve: aArticle.getNumero(),
  });
  lResult.estNoteExistante = this.moteurNotesCP.estNoteExistante({
    eleveDevoir: lResult.eleveDevoir,
    devoir: this.param.devoirSelectionne,
    eleve: lResult.eleve,
    devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
      this.moteurNotes,
    ),
  });
  if (lResult.estNoteExistante) {
    lResult.note = this.moteurNotes.getNoteEleveAuDevoirParNumero({
      listeDevoirs: this.param.listeDevoirs,
      numeroDevoir: this.param.devoirSelectionne.getNumero(),
      numeroEleve: aArticle.getNumero(),
    });
  }
  lResult.estNoteEditable = this.moteurNotesCP.estNoteEditable({
    actif: this.param.service.getActif(),
    devoir: lResult.devoir,
    eleve: lResult.eleve,
    eleveDevoir: lResult.eleveDevoir,
    devoirDansPeriode: this.moteurNotes.devoirDansPeriode.bind(
      this.moteurNotes,
    ),
  });
  return lResult;
}
module.exports = { DonneesListe_Notes, EGenreCommandeMenuCtxNote };
