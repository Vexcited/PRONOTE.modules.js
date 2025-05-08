const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  ObjetRequeteSaisieEvaluations,
} = require("ObjetRequeteSaisieEvaluations.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  InterfaceCompetencesParEvaluation,
  EGenreEvenementCompetencesParEvaluation,
} = require("InterfaceCompetencesParEvaluation.js");
const { GHtml } = require("ObjetHtml.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypeModeInfosADE } = require("TypeModeAssociationDevoirEvaluation.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const {
  ObjetRequeteSaisieNotesUnitaire,
} = require("ObjetRequeteSaisieNotesUnitaire.js");
class ObjetFenetre_CompetencesParEvaluation extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    if (GEtatUtilisateur.competences_modeSaisieClavierVertical === undefined) {
      GEtatUtilisateur.competences_modeSaisieClavierVertical = true;
    }
    this.setOptionsFenetre({
      titre: GTraductions.getValeur("Notes.TitreCompetencesParEvaluation"),
      listeBoutons: [GTraductions.getValeur("Fermer")],
      hauteurAdapteContenu: true,
      largeur: 790,
    });
    this.estFenetreEditionCommentaireSurNoteUniquement = false;
  }
  construireInstances() {
    this.identCompetencesParEvaluation = this.add(
      InterfaceCompetencesParEvaluation,
      this._evenementSurCompetencesParEvaluation,
    );
  }
  setDonnees(aParams, aOptionsAffichage) {
    const lDevoirDuplique = MethodesObjet.dupliquer(aParams.devoir);
    lDevoirDuplique.evaluation = null;
    lDevoirDuplique.modeAssociation = TypeModeInfosADE.tMIADE_Modification;
    if (aParams.devoir && aParams.devoir.evaluation) {
      aParams.devoir.evaluation.devoir = lDevoirDuplique;
    }
    this.listeEvaluations = new ObjetListeElements();
    if (aParams.devoir.evaluation) {
      this.listeEvaluations.addElement(aParams.devoir.evaluation);
    }
    this.getInstance(this.identCompetencesParEvaluation).setParametres({
      hauteurAdapteContenu: true,
    });
    this.getInstance(
      this.identCompetencesParEvaluation,
    ).setOptionsAffichageListe({
      afficherProjetsAccompagnement:
        aOptionsAffichage.afficherProjetsAccompagnement,
    });
    this.getInstance(
      this.identCompetencesParEvaluation,
    ).setAfficherCommentaireSurNote(
      aOptionsAffichage.afficherCommentaireSurNote,
    );
    this.getInstance(this.identCompetencesParEvaluation).setDonnees(aParams);
    this.updateTitre();
    this.afficher();
  }
  composeContenu() {
    const H = [];
    H.push(
      '<div class="m-bottom" style="display: flex; justify-content: end; gap: 0.5rem;">',
      '<span ie-html="getLibelleDevoir"></span>',
      `<div ie-if="btnMrFiche.avecBtn">${UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche")}</div>`,
      UtilitaireBoutonBandeau.getHtmlBtnSaisieHorizontalVertical("btnHV"),
      "</div>",
    );
    H.push(
      '<div id="',
      this.getNomInstance(this.identCompetencesParEvaluation),
      '"></div>',
    );
    return H.join("");
  }
  saisieNotesUnitaire(aParamEvnt) {
    if (GApplication.droits.get(TypeDroits.estEnConsultation)) {
      return;
    }
    new ObjetRequeteSaisieNotesUnitaire(this, () => {
      if (aParamEvnt && aParamEvnt.eleve) {
        aParamEvnt.eleve.setEtat(EGenreEtat.Aucun);
        if (aParamEvnt.devoir && aParamEvnt.devoir.listeEleves) {
          const lEleveDuDevoir =
            aParamEvnt.devoir.listeEleves.getElementParNumero(
              aParamEvnt.eleve.getNumero(),
            );
          if (lEleveDuDevoir) {
            lEleveDuDevoir.setEtat(EGenreEtat.Aucun);
          }
        }
      }
    }).lancerRequete(aParamEvnt);
  }
  saisieUnitaire() {
    if (!GApplication.droits.get(TypeDroits.estEnConsultation)) {
      const lListeEvaluations = this.listeEvaluations;
      new ObjetRequeteSaisieEvaluations(this)
        .setOptions({
          sansBlocageInterface: true,
          afficherMessageErreur: false,
        })
        .lancerRequete(
          GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service),
          GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
          lListeEvaluations,
        );
      if (!!lListeEvaluations) {
        lListeEvaluations.parcourir((aEval) => {
          if (aEval.listeEleves) {
            aEval.listeEleves.parcourir((aEleve) => {
              if (aEleve.pourValidation()) {
                aEleve.setEtat(EGenreEtat.Aucun);
                if (!!aEleve.listeCompetences) {
                  aEleve.listeCompetences.parcourir((aCompetence) => {
                    if (aCompetence.pourValidation()) {
                      aCompetence.setEtat(EGenreEtat.Aucun);
                    }
                  });
                }
              }
            });
          }
        });
      }
    }
  }
  surValidation(aNumeroBouton) {
    if (!!this.listeEvaluations) {
      this.listeEvaluations.parcourir((D) => {
        D.enCache = false;
      });
    }
    _surFermerFenetre.call(this, aNumeroBouton);
  }
  _evenementSurCompetencesParEvaluation(aGenre, aParams) {
    switch (aGenre) {
      case EGenreEvenementCompetencesParEvaluation.recupererDonnees:
        this.positionnerFenetre();
        break;
      case EGenreEvenementCompetencesParEvaluation.editerCompetence:
        this.saisieUnitaire();
        break;
      case EGenreEvenementCompetencesParEvaluation.editionNote:
      case EGenreEvenementCompetencesParEvaluation.editionCommentaireSurNote:
        this.estFenetreEditionCommentaireSurNoteUniquement
          ? this.saisieNotesUnitaire(aParams)
          : this.saisieUnitaire();
        break;
    }
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      getLibelleDevoir() {
        return "";
      },
      btnMrFiche: {
        event() {
          const lElement = this.node;
          TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise({
            genreChoixValidationCompetence:
              TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
            callback: function () {
              GHtml.setFocus(lElement);
            },
          });
        },
        getTitle() {
          return GTraductions.getValeur(
            "competences.TitreAideSaisieNivMaitrise",
          );
        },
        avecBtn() {
          return !aInstance.estFenetreEditionCommentaireSurNoteUniquement;
        },
      },
      btnHV: {
        event() {
          GEtatUtilisateur.competences_modeSaisieClavierVertical =
            !GEtatUtilisateur.competences_modeSaisieClavierVertical;
        },
        getSelection() {
          return GEtatUtilisateur.competences_modeSaisieClavierVertical;
        },
        getTitle() {
          return GEtatUtilisateur.competences_modeSaisieClavierVertical
            ? GTraductions.getValeur("competences.SensDeSaisieHorizontal")
            : GTraductions.getValeur("competences.SensDeSaisieVertical");
        },
        getClassesMixIcon() {
          return UtilitaireBoutonBandeau.getClassesMixIconSaisieHorizontalVertical(
            GEtatUtilisateur.competences_modeSaisieClavierVertical,
          );
        },
      },
    });
  }
  setEstFenetreEditionCommentaireSurNoteUniquement(aValeur) {
    this.estFenetreEditionCommentaireSurNoteUniquement = aValeur;
  }
  updateTitre() {
    let lTitre = GTraductions.getValeur("Notes.TitreCompetencesParEvaluation");
    if (
      this.getInstance(this.identCompetencesParEvaluation)
        .afficherCommentaireSurNote
    ) {
      if (this.estFenetreEditionCommentaireSurNoteUniquement) {
        lTitre = GTraductions.getValeur(
          "Notes.TitreCompetencesParEvaluationRemarquesUniquement",
        );
      } else {
        lTitre = GTraductions.getValeur(
          "Notes.TitreCompetencesParEvaluationEtRemarque",
        );
      }
    }
    this.setOptionsFenetre({ titre: lTitre });
  }
}
function _surFermerFenetre(aNumeroBouton) {
  this.callback.appel(aNumeroBouton);
  this.fermer();
}
module.exports = ObjetFenetre_CompetencesParEvaluation;
