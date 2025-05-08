const { DonneesListe_PageNotes } = require("DonneesListe_PageNotes.js");
const { TypeNote } = require("TypeNote.js");
const { GTraductions } = require("ObjetTraduction.js");
const { MoteurNotes } = require("MoteurNotes.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
  ObjetFenetre_DocumentsEleve,
} = require("ObjetFenetre_DocumentsEleve.js");
const { GChaine } = require("ObjetChaine.js");
const {
  EGenreEvenementSaisieNotes,
} = require("Enumere_EvenementSaisieNotes.js");
const { EGenreEleveDansDevoir } = require("Enumere_EleveDansDevoir.js");
const EGenreCommandeMenuCtxPageNotesPN = {
  modifierCommentaireSurNote: "modifierCommentaireSurNote",
};
class DonneesListe_PageNotesPN extends DonneesListe_PageNotes {
  constructor(aDonnees, aParam) {
    aParam.moteurNotesCP = new MoteurNotesCP(new MoteurNotes());
    super(aDonnees, aParam);
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      surClicPiecesJointesProjAcc: function (aNoEleve) {
        $(this.node).on("click", () => {
          const lEleve = !!aInstance.Donnees
            ? aInstance.Donnees.getElementParNumero(aNoEleve)
            : null;
          if (!!lEleve && lEleve.avecDocsProjetsAccompagnement) {
            const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
              ObjetFenetre_DocumentsEleve,
              { pere: aInstance },
            );
            lInstanceFenetre.setDonnees(lEleve);
          }
        });
      },
    });
  }
  composeEleveProjetAcc(D, aSurExportCSV, aPourImpression) {
    if (
      this.param.optionsAffichage.afficherProjetsAccompagnement &&
      !aSurExportCSV &&
      !aPourImpression
    ) {
      const lHintProjetAcc = !!D.projetsAccompagnement
        ? D.projetsAccompagnement.replace(/\n/g, "<br/>")
        : "";
      const lAvecPiecesJointes = !!D.avecDocsProjetsAccompagnement;
      if (lHintProjetAcc.length > 0 || lAvecPiecesJointes) {
        const lClass = ["AlignementMilieuVertical", "InlineBlock"];
        let lEvntClic = "";
        if (lAvecPiecesJointes) {
          lClass.push("AvecMain");
          lEvntClic =
            " ie-node=\"surClicPiecesJointesProjAcc('" + D.getNumero() + "')\"";
        }
        return (
          '<span style="float:right;"><span ie-hint="' +
          lHintProjetAcc +
          '" class=" ' +
          lClass.join(" ") +
          '" ' +
          lEvntClic +
          '><i class="icon_projet_accompagnement Texte12"></i></span></span>' +
          D.getLibelle()
        );
      }
    }
    return D.getLibelle();
  }
  getTraductionMoyenneClasse() {
    return this.param.avecColonneClasse
      ? GTraductions.getValeur("Notes.MoyenneGroupe") + " :"
      : GTraductions.getValeur("Notes.MoyenneClasse") + " :";
  }
  devoirDansPeriode(aDevoir, aEleve, aNumeroPeriode) {
    const lMoteurNotesProduit = this.moteurNotesCP.getMoteurNotesProduit();
    return (
      !!lMoteurNotesProduit &&
      lMoteurNotesProduit.devoirDansPeriode.call(
        this,
        aDevoir,
        aEleve,
        aNumeroPeriode,
      )
    );
  }
  eleveDansDevoir(aEleve, aDevoir) {
    const lMoteurNotesProduit = this.moteurNotesCP.getMoteurNotesProduit();
    return (
      !!lMoteurNotesProduit &&
      lMoteurNotesProduit.eleveDansDevoir.call(this, aEleve, aDevoir)
    );
  }
  getTitrePeriodes() {
    const lMoteurNotesProduit = this.moteurNotesCP.getMoteurNotesProduit();
    return !!lMoteurNotesProduit && lMoteurNotesProduit.getTitrePeriodes(this);
  }
  getNoteMaxDevoir() {
    let lValeurNoteMax;
    if (this.avecSaisieSuperieurAuBareme()) {
      lValeurNoteMax = this.moteurNotesCP.getNoteMaximaleDeDevoir();
    } else {
      lValeurNoteMax = this.moteurNotesCP.getBaremeDevoirMaximal();
    }
    return new TypeNote(lValeurNoteMax);
  }
  avecSaisieSuperieurAuBareme() {
    return true;
  }
  avecLigneTitreBouton() {
    return this.avecCompetences || this.avecCommentaireSurNoteEleve;
  }
  getControleurBtnLigneTitre() {
    return {
      getClassBoutonLigneTitre: (aIndex) => {
        const lDevoir = this.listeDevoirs.get(aIndex);
        if (lDevoir) {
          if (lDevoir.avecCommentaireSurNoteEleve && lDevoir.evaluation) {
            return "icon_comment_vide mix-icon_pastille_evaluation i-top";
          }
          if (lDevoir.avecCommentaireSurNoteEleve) {
            return "icon_comment_vide i-medium";
          }
          if (lDevoir.evaluation) {
            return "icon_pastille_evaluation i-medium";
          }
        }
        return "";
      },
      boutonLigneTitre: {
        event: (I) => {
          const lDevoir = this.listeDevoirs.get(I);
          if (lDevoir) {
            if (lDevoir.avecCommentaireSurNoteEleve && lDevoir.evaluation) {
              this.surCompetences(I);
              return false;
            }
            if (lDevoir.avecCommentaireSurNoteEleve) {
              this.surCommentaireSurNote(I);
              return false;
            }
            if (lDevoir.evaluation) {
              this.surCompetences(I);
              return false;
            }
          }
          return false;
        },
        getTitle: (I) => {
          const H = [],
            lDevoir = this.listeDevoirs.get(I);
          if (lDevoir) {
            if (lDevoir.avecCommentaireSurNoteEleve && lDevoir.evaluation) {
              H.push(
                GTraductions.getValeur(
                  "Notes.HintBtnAffSaisieCommentaireETNiveauAcqComp",
                ),
              );
            } else if (lDevoir.avecCommentaireSurNoteEleve) {
              H.push(
                GTraductions.getValeur(
                  "Notes.HintBtnAffSaisieNoteCommentaireSurnote",
                ),
              );
            } else if (lDevoir.evaluation) {
              H.push(GTraductions.getValeur("Notes.HintBtnSaisieNivAcq"));
            }
          }
          if (lDevoir.evaluation && lDevoir.evaluation.listeCompetences) {
            lDevoir.evaluation.listeCompetences.parcourir((aCompetence) => {
              H.push(aCompetence.code + " : " + aCompetence.getLibelle());
            });
            return GChaine.enleverEntites(H.join("\n"));
          }
          return H.join("");
        },
      },
    };
  }
  getTitreBouton(aDevoir, aIndex, aStrIeNodeEditionDevoir) {
    const H = [];
    H.push(
      `<div ${aStrIeNodeEditionDevoir} class="devoir AvecMain TitreListeSansTri">`,
      aDevoir.evaluation || aDevoir.avecCommentaireSurNoteEleve
        ? `<ie-btnicon ie-model="boutonLigneTitre(${aIndex})" ie-class="getClassBoutonLigneTitre(${aIndex})"></ie-btnicon>`
        : "&nbsp;",
      `</div>`,
    );
    return {
      libelleHtml: H.join(""),
      controleur: this.getControleurBtnLigneTitre(),
    };
  }
  getSuffixe(aEleveDevoir) {
    if (
      aEleveDevoir &&
      aEleveDevoir.commentaire &&
      aEleveDevoir.commentaire.length &&
      aEleveDevoir.Note &&
      !aEleveDevoir.Note.estUneNoteVide()
    ) {
      return `<i class="icon_comment_vide" style="position:absolute; left:0px; bottom:0px;" ie-hint="${GTraductions.getValeur("Notes.remarque")} : ${aEleveDevoir.commentaire}" ></i>`;
    }
    return;
  }
  surCommentaireSurNote(I) {
    this.enEdition = false;
    this.param.callbackEvnt({
      genreEvnt: EGenreEvenementSaisieNotes.CommentaireSurNote,
      devoir: this.listeDevoirs.get(I),
    });
  }
  avecMenuContextuel(aParams) {
    const lDevoir = aParams.instance.Donnees.listeDevoirs.get(
      aParams.declarationColonne.rangColonne,
    );
    let lAvecMenuCtx = false;
    if (lDevoir) {
      lAvecMenuCtx = lDevoir.avecCommentaireSurNoteEleve;
    }
    return super.avecMenuContextuel(aParams) || lAvecMenuCtx;
  }
  initialisationObjetContextuel(aParams) {
    if (!aParams.menuContextuel) {
      return;
    }
    const lEleve = aParams.article;
    if (lEleve) {
      for (const x in lEleve.dansDevoir) {
        if (
          lEleve.dansDevoir[x] === EGenreEleveDansDevoir.Non &&
          lEleve.listeDevoirs &&
          lEleve.listeDevoirs.getElementParNumero(x) &&
          lEleve.listeDevoirs.getElementParNumero(x).note &&
          lEleve.listeDevoirs.getElementParNumero(x).note.getNote()
        ) {
          aParams.menuContextuel.addCommande(
            1,
            GTraductions.getValeur(
              "Notes.MenuContext.SupprimerLesNotesNonComptabilises",
            ),
            true,
          );
          break;
        }
      }
    }
    const lDevoir = aParams.instance.Donnees.listeDevoirs.get(
      aParams.declarationColonne.rangColonne,
    );
    if (
      lDevoir &&
      lDevoir.avecCommentaireSurNoteEleve &&
      this.avecEdition(aParams)
    ) {
      const lEleveDeDevoir = lDevoir.listeEleves.getElementParNumero(
        lEleve.getNumero(),
      );
      if (
        (lEleveDeDevoir &&
          lEleveDeDevoir.note &&
          !lEleveDeDevoir.note.estUneNoteVide()) ||
        (lEleveDeDevoir.Note && !lEleveDeDevoir.Note.estUneNoteVide())
      ) {
        const lLibelleCommande =
          lEleveDeDevoir.commentaire && lEleveDeDevoir.commentaire.length > 0
            ? GTraductions.getValeur("Notes.ActionEditerCommentaireSurnote")
            : GTraductions.getValeur("Notes.ActionAjouterCommentaireSurnote");
        aParams.menuContextuel.addCommande(
          EGenreCommandeMenuCtxPageNotesPN.modifierCommentaireSurNote,
          lLibelleCommande,
          true,
        );
      }
    }
    if (aParams.menuContextuel.ListeLignes.count() > 0) {
      aParams.menuContextuel.setDonnees();
    }
  }
  evenementMenuContextuel(aParams) {
    switch (aParams.numeroMenu) {
      case EGenreCommandeMenuCtxPageNotesPN.modifierCommentaireSurNote: {
        const lDevoir = aParams.instance.Donnees.listeDevoirs.get(
          aParams.declarationColonne.rangColonne,
        );
        if (lDevoir && lDevoir.listeEleves) {
          const lEleveDeDevoir = lDevoir.listeEleves.getElementParNumero(
            aParams.article.getNumero(),
          );
          if (lEleveDeDevoir) {
            this.param.callbackEvnt({
              genreEvnt: EGenreEvenementSaisieNotes.EditionCommentaireSurNote,
              eleveDeDevoir: lEleveDeDevoir,
              devoir: lDevoir,
            });
          }
        }
        break;
      }
      default:
        super.evenementMenuContextuel(aParams);
        break;
    }
  }
}
module.exports = { DonneesListe_PageNotesPN };
