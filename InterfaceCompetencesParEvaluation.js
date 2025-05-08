const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_SaisieMessage } = require("ObjetFenetre_SaisieMessage.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  DonneesListe_Competences_ElevesEvaluation,
} = require("DonneesListe_Competences_ElevesEvaluation.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetRequetePageCompetencesParEvaluation,
} = require("ObjetRequetePageCompetencesParEvaluation.js");
const { ObjetUtilitaireEvaluation } = require("ObjetUtilitaireEvaluation.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { TypeModeInfosADE } = require("TypeModeAssociationDevoirEvaluation.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const {
  TypeAffichageTitreColonneCompetence,
} = require("ObjetFenetre_ParamListeEvaluations.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const { MethodesObjet } = require("MethodesObjet.js");
const EGenreEvenementCompetencesParEvaluation = {
  recupererDonnees: 0,
  editerCompetence: 1,
  selectionEleve: 2,
  editionNote: 3,
  editionCommentaireSurNote: 4,
};
class InterfaceCompetencesParEvaluation extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
    this.droitSaisieNotes = false;
    this.parametres = {};
    this.afficherCommentaireSurNote = false;
    if (GEtatUtilisateur.optionsAffCompetenceParEval === undefined) {
      GEtatUtilisateur.optionsAffCompetenceParEval = {
        avecOptionAfficherProjetsAcc: true,
        afficherProjetsAccompagnement: false,
        afficherPourcentageReussite: false,
        typeAffichageTitreColonneCompetence:
          TypeAffichageTitreColonneCompetence.AffichageLibelle,
      };
    }
  }
  construireInstances() {
    this.identListeElevesEvaluation = this.add(
      ObjetListe,
      this._evenementSurListeElevesEvaluation,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListeElevesEvaluation;
    this.GenreStructure = EStructureAffichage.Autre;
  }
  setAfficherCommentaireSurNote(aValeur) {
    this.afficherCommentaireSurNote = aValeur;
  }
  setOptionsAffichageListe(aOptionsAffichage) {
    Object.assign(
      GEtatUtilisateur.optionsAffCompetenceParEval,
      aOptionsAffichage,
    );
  }
  getOptionsAffichageListe() {
    return GEtatUtilisateur.optionsAffCompetenceParEval;
  }
  _initListeElevesEvaluation(aEvaluation, aListeCompetences) {
    const lThis = this;
    const lListe = this.getInstance(this.identListeElevesEvaluation);
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
      taille: 150,
      titre:
        aEvaluation.listeEleves.count() +
        " " +
        GTraductions.getValeur("competences.eleve")[
          aEvaluation.listeEleves.count() ? 1 : 0
        ],
    });
    if (this.estPourGroupe) {
      lColonnes.push({
        id: DonneesListe_Competences_ElevesEvaluation.colonnes.classe,
        taille: 65,
        titre: GTraductions.getValeur("Classe"),
      });
    }
    if (
      !!aEvaluation.devoir &&
      (!!aEvaluation.executionQCM ||
        [
          TypeModeInfosADE.tMIADE_Creation,
          TypeModeInfosADE.tMIADE_Modification,
        ].includes(aEvaluation.devoir.modeAssociation))
    ) {
      lListe.controleur.btnCalculNoteAuto = {
        event() {
          TUtilitaireCompetences.surBoutonCalculNotesDevoir({
            instance: lThis,
            evaluation: aEvaluation,
            callback: function () {
              aEvaluation.enCache = false;
              lThis.setDonnees({
                evaluation: aEvaluation,
                droitSaisieNotes: lThis.droitSaisieNotes,
                classe: GEtatUtilisateur.Navigation.getRessource(
                  EGenreRessource.Classe,
                ),
              });
            },
          });
        },
        getDisplayBouton() {
          return !aEvaluation.executionQCM;
        },
        getTitle() {
          return GTraductions.getValeur("evaluations.calculAutoNotes");
        },
        getDisabled() {
          return (
            !lThis.droitSaisieNotes ||
            !aEvaluation.avecSaisie ||
            (!!aEvaluation.devoir && aEvaluation.devoir.estVerrouille)
          );
        },
        getClasseBouton() {
          return this.controleur.btnCalculNoteAuto.getDisabled.call(this)
            ? ""
            : "TitreListeSansTri";
        },
      };
      lListe.controleur.hintColonneNote = function () {
        return aEvaluation.devoir.hintDevoir || "";
      };
      const lTitreColonneNotes = [];
      lTitreColonneNotes.push(
        `<div class="flex-contain flex-center justify-center">`,
      );
      lTitreColonneNotes.push(
        `<ie-btnicon ie-display="btnCalculNoteAuto.getDisplayBouton" ie-model="btnCalculNoteAuto" ie-class="btnCalculNoteAuto.getClasseBouton" class="icon_sigma color-neutre m-right"></ie-btnicon>`,
      );
      lTitreColonneNotes.push(
        `<span ie-hint="hintColonneNote">${GTraductions.getValeur("evaluations.notes")}</span>`,
      );
      lTitreColonneNotes.push(`</div>`);
      lColonnes.push({
        id: DonneesListe_Competences_ElevesEvaluation.colonnes.notes,
        taille: 70,
        titre: { libelleHtml: lTitreColonneNotes.join("") },
      });
      if (this.afficherCommentaireSurNote) {
        lColonnes.push(
          getColonne.call(
            this,
            DonneesListe_Competences_ElevesEvaluation.colonnes
              .commentaireSurNote,
          ).colonne,
        );
      }
    }
    const lTypeAffichageColonneCompetence =
      GEtatUtilisateur.optionsAffCompetenceParEval
        .typeAffichageTitreColonneCompetence;
    const lAvecPourcentageReussite =
      GEtatUtilisateur.optionsAffCompetenceParEval.afficherPourcentageReussite;
    lListe.controleur.getPourcentageReussiteCompetence = function (
      aIndexColonneCompetence,
    ) {
      const lValeurPourcentage = this.instance
        .getDonneesListe()
        .getPourcentageReussite(aIndexColonneCompetence);
      if (lValeurPourcentage === null || lValeurPourcentage === undefined) {
        return "-";
      }
      return lValeurPourcentage + " %";
    };
    lListe.controleur.getHintColonneCompetence = function (
      aIndexColonneCompetence,
    ) {
      const lCompetence = aListeCompetences.get(aIndexColonneCompetence);
      const lPourcentageReussite = this.instance
        .getDonneesListe()
        .getPourcentageReussite(aIndexColonneCompetence);
      const lHint = [];
      lHint.push(TUtilitaireCompetences.composeTitleEvaluation(lCompetence));
      if (lPourcentageReussite !== null && lPourcentageReussite !== undefined) {
        lHint.push("<br/><br/>");
        lHint.push(
          "<b>",
          GTraductions.getValeur("competences.PourcentageDeReussite"),
          "</b> ",
          lPourcentageReussite,
          " %",
        );
      }
      if (
        !!lCompetence.informationQCM &&
        !!lCompetence.informationQCM.listeQuestions &&
        lCompetence.informationQCM.listeQuestions.count() > 0
      ) {
        const lTypeNumerotationQCM =
          lCompetence.informationQCM.typeNumerotation;
        lHint.push("<br/><br/>");
        lCompetence.informationQCM.listeQuestions.parcourir((aQuestionQCM) => {
          const lHtmlQuestion = UtilitaireQCM.composeHintDeQuestionQCM(
            lThis,
            aQuestionQCM.getPosition(),
            aQuestionQCM,
            {
              avecAffichageInfosCompetences: false,
              avecAffichageBareme: !GEtatUtilisateur.pourPrimaire(),
              typeNumerotationQCM: lTypeNumerotationQCM,
            },
          );
          lHint.push(lHtmlQuestion);
        });
      }
      return lHint.join("");
    };
    let lIdPremiereColonne = null;
    aListeCompetences.parcourir((aCompetence, aIndex) => {
      let lLibelleCompetence;
      if (
        lTypeAffichageColonneCompetence ===
        TypeAffichageTitreColonneCompetence.AffichageLibelle
      ) {
        lLibelleCompetence = aCompetence.getLibelle();
      } else {
        lLibelleCompetence =
          (aCompetence.pilier && aCompetence.pilier.code
            ? aCompetence.pilier.code + " - "
            : "") + (aCompetence.code || "");
      }
      const lLibelleColonneCompetence = [];
      lLibelleColonneCompetence.push(
        '<div class="ie-ellipsis" ie-hint="getHintColonneCompetence(' +
          aIndex +
          ')">',
      );
      lLibelleColonneCompetence.push(lLibelleCompetence);
      if (lAvecPourcentageReussite) {
        lLibelleColonneCompetence.push(
          '<br/><span ie-html="getPourcentageReussiteCompetence(' +
            aIndex +
            ')"></span>',
        );
      }
      lLibelleColonneCompetence.push("</div>");
      const lIdColonne =
        DonneesListe_Competences_ElevesEvaluation.colonnes.prefixe_competence +
        aIndex;
      lColonnes.push({
        id: lIdColonne,
        taille: 70,
        titre: { libelleHtml: lLibelleColonneCompetence.join("") },
      });
      if (!lIdPremiereColonne) {
        lIdPremiereColonne = lIdColonne;
      }
    });
    let lHauteurTitre = 30;
    if (lAvecPourcentageReussite) {
      lHauteurTitre += 10;
    }
    lListe.setOptionsListe({
      colonnes: lColonnes,
      scrollHorizontal: lIdPremiereColonne || false,
      alternanceCouleurLigneContenu: true,
      hauteurCelluleTitreStandard: lHauteurTitre,
      avecLigneTotal: !!aEvaluation.devoir,
      hauteurAdapteContenu: this.parametres.hauteurAdapteContenu,
      hauteurMaxAdapteContenu: this.parametres.hauteurAdapteContenu
        ? GNavigateur.ecranH - 300
        : null,
    });
    GEtatUtilisateur.setTriListe({
      liste: lListe,
      tri: DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
      identifiant: "elevesEvaluation",
    });
    const lParamsDonneesListe = {
      eleves: aEvaluation.listeEleves,
      competences: aListeCompetences,
      initMenuContextuel: _initMenuContextuelListe.bind(this),
      avecSaisie: aEvaluation.avecSaisie,
      dateEvaluation: aEvaluation.dateValidation,
      genreEvaluation: aEvaluation.getGenre(),
      evaluation: aEvaluation,
    };
    if (!!aEvaluation.devoir) {
      lParamsDonneesListe.droitSaisieNotes = this.droitSaisieNotes;
      lParamsDonneesListe.baremeDevoirParDefaut =
        aEvaluation.baremeDevoirParDefaut;
      lParamsDonneesListe.devoir = {
        bareme: aEvaluation.devoir.bareme,
        estUnBonus: aEvaluation.devoir.commeUnBonus,
        ramenerSur20: aEvaluation.devoir.ramenerSur20,
        estVerrouille:
          aEvaluation.devoir.estVerrouille || aEvaluation.devoir.verrouille,
        estCloture: aEvaluation.devoir.estCloture,
        hintDevoir: aEvaluation.devoir.hintDevoir || "",
        avecCommentaireSurNoteEleve:
          aEvaluation.devoir.avecCommentaireSurNoteEleve,
      };
      if (this.afficherCommentaireSurNote && !!aEvaluation.devoir.listeEleves) {
        lParamsDonneesListe.eleves.parcourir((aEleve) => {
          const lEleve = aEvaluation.devoir.listeEleves.getElementParNumero(
            aEleve.getNumero(),
          );
          if (lEleve && lEleve.commentaire) {
            aEleve.commentaire = lEleve.commentaire;
          }
        });
      }
    }
    const lOptionsAffichage = Object.assign(
      MethodesObjet.dupliquer(GEtatUtilisateur.optionsAffCompetenceParEval),
      { afficherCommentaireSurNote: this.afficherCommentaireSurNote },
    );
    lListe.setDonnees(
      new DonneesListe_Competences_ElevesEvaluation(
        lParamsDonneesListe,
        lOptionsAffichage,
      ),
    );
  }
  construireStructureAffichageAutre() {
    const lHTML = [];
    lHTML.push(
      '<div id="',
      this.getInstance(this.identListeElevesEvaluation).getNom(),
      '" style="height: 100%" class="AlignementHaut SansSelectionTexte"></div>',
    );
    return lHTML.join("");
  }
  setParametres(aParametres) {
    this.parametres = aParametres;
  }
  setDonnees(aParams) {
    this.droitSaisieNotes = aParams.droitSaisieNotes;
    this.estPourGroupe =
      aParams && aParams.classe
        ? aParams.classe.getGenre() === EGenreRessource.Groupe
        : false;
    const lEvaluation = !!aParams.devoir
      ? aParams.devoir.evaluation
      : aParams.evaluation;
    if (!!lEvaluation) {
      if (!lEvaluation.enCache) {
        new ObjetRequetePageCompetencesParEvaluation(
          this,
          this.actualisationListeElevesCompetences,
        ).lancerRequete(aParams);
      } else {
        this.actualisationListeElevesCompetences(lEvaluation);
      }
    } else {
      this.devoir = aParams.devoir;
      this.afficherListeElevesSansCompetences(aParams);
    }
  }
  _evenementSurListeElevesEvaluation(aParametres) {
    switch (aParametres.genreEvenement) {
      case EGenreEvenementListe.Selection: {
        let lNouvelleRessource = null;
        const lListeCellulesSelectionnees =
          aParametres.instance.getTableauCellulesSelection();
        if (
          !!lListeCellulesSelectionnees &&
          lListeCellulesSelectionnees.length > 0
        ) {
          if (
            lListeCellulesSelectionnees.length === 1 &&
            !!lListeCellulesSelectionnees[0]
          ) {
            lNouvelleRessource = lListeCellulesSelectionnees[0].article;
          } else {
            for (let i = 0; i < lListeCellulesSelectionnees.length; i++) {
              if (!!lListeCellulesSelectionnees[i]) {
                const lCellule = lListeCellulesSelectionnees[i];
                if (!lNouvelleRessource) {
                  lNouvelleRessource = lCellule.article;
                } else if (
                  !!lCellule.article &&
                  lCellule.article.getNumero() !==
                    lNouvelleRessource.getNumero()
                ) {
                  lNouvelleRessource = null;
                  break;
                }
              }
            }
          }
        }
        const lRessourceActuelle = GEtatUtilisateur.Navigation.getRessource(
          EGenreRessource.Eleve,
        );
        if (!!lRessourceActuelle || !!lNouvelleRessource) {
          if (
            (!lRessourceActuelle && !!lNouvelleRessource) ||
            (!!lRessourceActuelle && !lNouvelleRessource) ||
            lRessourceActuelle.getNumero() !== lNouvelleRessource.getNumero()
          ) {
            GEtatUtilisateur.Navigation.setRessource(
              EGenreRessource.Eleve,
              lNouvelleRessource,
            );
            this.callback.appel(
              EGenreEvenementCompetencesParEvaluation.selectionEleve,
            );
          }
        }
        break;
      }
      case EGenreEvenementListe.Edition:
        aParametres.ouvrirMenuContextuel();
        break;
      case EGenreEvenementListe.ApresEdition: {
        const lParams = {
          devoir: this.devoir,
          eleve: aParametres.article.eleve,
          note:
            aParametres.article.eleve.note || aParametres.article.eleve.Note,
        };
        switch (aParametres.idColonne) {
          case DonneesListe_Competences_ElevesEvaluation.colonnes
            .commentaireSurNote:
            this.callback.appel(
              EGenreEvenementCompetencesParEvaluation.editionCommentaireSurNote,
              lParams,
            );
            break;
          case DonneesListe_Competences_ElevesEvaluation.colonnes.notes:
            this.callback.appel(
              EGenreEvenementCompetencesParEvaluation.editionNote,
              lParams,
            );
            break;
        }
        _selectionnerCelluleSuivante(
          this.getInstance(this.identListeElevesEvaluation),
          true,
        );
        break;
      }
      case EGenreEvenementListe.KeyPressListe:
        return _surKeyUpListe.call(this, aParametres.event);
    }
  }
  afficherListeElevesSansCompetences(aParams) {
    const lDevoir = aParams.devoir;
    const lListe = this.getInstance(this.identListeElevesEvaluation);
    const lColonnes = [];
    const lParams = { devoir: lDevoir };
    const lColonneEleve = getColonne.call(
      this,
      DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
      lParams,
    );
    lColonnes.push(lColonneEleve.colonne);
    if (lColonneEleve.controleur) {
      Object.assign(lListe.controleur, lColonneEleve.controleur);
    }
    if (this.estPourGroupe) {
      const lColonneClasse = getColonne.call(
        this,
        DonneesListe_Competences_ElevesEvaluation.colonnes.classe,
        lParams,
      );
      lColonnes.push(lColonneClasse.colonne);
      if (lColonneClasse.controleur) {
        Object.assign(lListe.controleur, lColonneClasse.controleur);
      }
    }
    if (lDevoir) {
      const lColonneNotes = getColonne.call(
        this,
        DonneesListe_Competences_ElevesEvaluation.colonnes.notes,
        lParams,
      );
      lColonnes.push(lColonneNotes.colonne);
      if (lColonneNotes.controleur) {
        Object.assign(lListe.controleur, lColonneNotes.controleur);
      }
    }
    if (this.afficherCommentaireSurNote) {
      const lColonneCommentaire = getColonne.call(
        this,
        DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote,
        lParams,
      );
      lColonnes.push(lColonneCommentaire.colonne);
      if (lColonneCommentaire.controleur) {
        Object.assign(lListe.controleur, lColonneCommentaire.controleur);
      }
    }
    lListe.setOptionsListe({
      colonnes: lColonnes,
      alternanceCouleurLigneContenu: true,
      hauteurCelluleTitreStandard: 30,
      avecLigneTotal: !!lDevoir,
      hauteurAdapteContenu: this.parametres.hauteurAdapteContenu,
      hauteurMaxAdapteContenu: this.parametres.hauteurAdapteContenu
        ? GNavigateur.ecranH - 300
        : null,
    });
    GEtatUtilisateur.setTriListe({
      liste: lListe,
      tri: DonneesListe_Competences_ElevesEvaluation.colonnes.eleve,
      identifiant: "elevesEvaluation",
    });
    const lParamsDonneesListe = {
      eleves: lDevoir.listeEleves,
      competences: new ObjetListeElements(),
      initMenuContextuel: () => {},
    };
    lParamsDonneesListe.droitSaisieNotes = this.droitSaisieNotes;
    lParamsDonneesListe.avecSaisie = this.droitSaisieNotes;
    lParamsDonneesListe.baremeDevoirParDefaut = aParams.baremeParDefaut;
    lParamsDonneesListe.devoir = {
      bareme: lDevoir.bareme,
      estUnBonus: lDevoir.commeUnBonus,
      ramenerSur20: lDevoir.ramenerSur20,
      estVerrouille: lDevoir.estVerrouille || lDevoir.verrouille,
      estCloture: lDevoir.estCloture,
      hintDevoir: lDevoir.hintDevoir || "",
      avecCommentaireSurNoteEleve: lDevoir.avecCommentaireSurNoteEleve,
    };
    if (this.afficherCommentaireSurNote && !!lDevoir.listeEleves) {
      lParamsDonneesListe.afficherCommentaireSurNote = true;
      lParamsDonneesListe.eleves.parcourir((aEleve) => {
        const lEleve = lDevoir.listeEleves.getElementParNumero(
          aEleve.getNumero(),
        );
        if (lEleve && lEleve.commentaire) {
          aEleve.commentaire = lEleve.commentaire;
        }
      });
    }
    lListe.setDonnees(
      new DonneesListe_Competences_ElevesEvaluation(lParamsDonneesListe, {
        afficherCommentaireSurNote: this.afficherCommentaireSurNote,
      }),
    );
    this.callback.appel(
      EGenreEvenementCompetencesParEvaluation.recupererDonnees,
    );
  }
  actualisationListeElevesCompetences(aEvaluation) {
    if (!aEvaluation) {
      return;
    }
    ObjetUtilitaireEvaluation.calculerAvecEvaluation(
      aEvaluation,
      aEvaluation.listePiliers,
    );
    const lListeCompetences = new ObjetListeElements();
    for (let i = 0; i < aEvaluation.listeCompetences.count(); i++) {
      if (aEvaluation.listeCompetences.get(i).existe()) {
        lListeCompetences.addElement(aEvaluation.listeCompetences.get(i));
      }
    }
    this._initListeElevesEvaluation(aEvaluation, lListeCompetences);
    this.callback.appel(
      EGenreEvenementCompetencesParEvaluation.recupererDonnees,
    );
  }
  afficherMessageSelectionnerEvaluation() {
    if (this.getInstance(this.identListeElevesEvaluation)) {
      this.getInstance(this.identListeElevesEvaluation).effacer(
        '<div class="Gras AlignementMilieu GrandEspaceHaut">' +
          GTraductions.getValeur("competences.SelectionnezEvaluation") +
          "</div>",
      );
    }
  }
}
function getColonne(aId, aParams = {}) {
  const lResult = { controleur: null, colonne: null };
  switch (aId) {
    case DonneesListe_Competences_ElevesEvaluation.colonnes.eleve: {
      let lTitre = "";
      if (aParams.evaluation) {
        lTitre =
          aParams.evaluation.listeEleves.count() +
          " " +
          GTraductions.getValeur("competences.eleve")[
            aParams.evaluation.listeEleves.count() ? 1 : 0
          ];
      } else if (aParams.devoir) {
        lTitre =
          aParams.devoir.listeEleves &&
          aParams.devoir.listeEleves.count() +
            " " +
            GTraductions.getValeur("competences.eleve")[
              aParams.devoir.listeEleves.count() ? 1 : 0
            ];
      }
      lResult.colonne = { id: aId, taille: 150, titre: lTitre };
      break;
    }
    case DonneesListe_Competences_ElevesEvaluation.colonnes.classe:
      lResult.colonne = {
        id: aId,
        taille: 65,
        titre: GTraductions.getValeur("Classe"),
      };
      break;
    case DonneesListe_Competences_ElevesEvaluation.colonnes.notes: {
      let lTitre = [];
      const lThis = this;
      if (aParams.evaluation) {
        lTitre.push(`<div class="flex-contain flex-center justify-center">`);
        lTitre.push(
          `<ie-btnicon ie-display="btnCalculNoteAuto.getDisplayBouton" ie-model="btnCalculNoteAuto" ie-class="btnCalculNoteAuto.getClasseBouton" class="icon_sigma color-neutre m-right"></ie-btnicon>`,
        );
        lTitre.push(
          `<span ie-hint="hintColonneNote">${GTraductions.getValeur("evaluations.notes")}</span>`,
        );
        lTitre.push(`</div>`);
      } else if (aParams.devoir) {
        lTitre.push(
          `<span ie-hint="hintColonneNote">${GTraductions.getValeur("evaluations.notes")}</span>`,
        );
      }
      lResult.colonne = {
        id: aId,
        taille: 70,
        titre: { libelleHtml: lTitre.join("") },
      };
      lResult.controleur = {};
      lResult.controleur.btnCalculNoteAuto = {
        event() {
          TUtilitaireCompetences.surBoutonCalculNotesDevoir({
            instance: lThis,
            evaluation: aParams.evaluation,
            callback: function () {
              aParams.evaluation.enCache = false;
              lThis.setDonnees({
                evaluation: aParams.evaluation,
                droitSaisieNotes: lThis.droitSaisieNotes,
                classe: GEtatUtilisateur.Navigation.getRessource(
                  EGenreRessource.Classe,
                ),
              });
            },
          });
        },
        getDisplayBouton() {
          return true;
        },
        getTitle() {
          return GTraductions.getValeur("evaluations.calculAutoNotes");
        },
        getDisabled() {
          if (aParams.evaluation) {
            return (
              !lThis.droitSaisieNotes ||
              !aParams.evaluation.avecSaisie ||
              (!!aParams.evaluation.devoir &&
                aParams.evaluation.devoir.estVerrouille)
            );
          }
          if (aParams.devoir) {
            return !lThis.droitSaisieNotes || aParams.devoir.estVerrouille;
          }
          return true;
        },
        getClasseBouton() {
          return this.controleur.btnCalculNoteAuto.getDisabled.call(this)
            ? ""
            : "TitreListeSansTri";
        },
      };
      lResult.controleur.hintColonneNote = function () {
        return (
          (aParams.evaluation
            ? aParams.evaluation.devoir.hintDevoir
            : aParams.devoir.hintDevoir) || ""
        );
      };
      break;
    }
    case DonneesListe_Competences_ElevesEvaluation.colonnes.commentaireSurNote:
      lResult.colonne = {
        id: DonneesListe_Competences_ElevesEvaluation.colonnes
          .commentaireSurNote,
        taille: 200,
        titre: { libelle: GTraductions.getValeur("Notes.remarques") },
      };
      break;
  }
  return lResult;
}
function _initMenuContextuelListe(aParametres) {
  const lSelections = this.getInstance(
    this.identListeElevesEvaluation,
  ).getTableauCellulesSelection();
  let lEvalEditable = false;
  let lObservationEditable = false;
  if (!lSelections || lSelections.length === 0) {
    return;
  }
  if (!aParametres.nonEditable) {
    lSelections.forEach((aSelection) => {
      if (
        DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
          aSelection.idColonne,
        )
      ) {
        const lColonne =
          aSelection.article.colonnesCompetences[aSelection.idColonne];
        if (lColonne.editable) {
          lEvalEditable = true;
          if (
            lColonne.competence &&
            lColonne.competence.niveauDAcquisition.getNumero()
          ) {
            lObservationEditable = true;
          }
        }
      }
    });
  }
  TUtilitaireCompetences.initMenuContextuelNiveauAcquisition({
    instance: this,
    menuContextuel: aParametres.menuContextuel,
    avecLibelleRaccourci: true,
    genreChoixValidationCompetence:
      TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
    evaluationsEditables: lEvalEditable,
    estObservationEditable: lObservationEditable,
    callbackNiveau: _modifierNiveauDeSelectionCourante.bind(this, true),
    callbackCommentaire: _editionCommentaireAcquisitions.bind(
      this,
      lSelections,
    ),
  });
}
function _surKeyUpListe(aEvent) {
  const lListe = this.getInstance(this.identListeElevesEvaluation),
    lSelections = lListe.getTableauCellulesSelection();
  let lSelectionsContientUneColonneCompetence = false;
  lSelections.forEach((aSelection) => {
    if (
      DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
        aSelection.idColonne,
      )
    ) {
      lSelectionsContientUneColonneCompetence = true;
      return false;
    }
  });
  if (lSelectionsContientUneColonneCompetence) {
    let lNiveaux;
    if (GParametres.listeNiveauxDAcquisitions) {
      lNiveaux = GParametres.listeNiveauxDAcquisitions.getListeElements(
        (aEle) => {
          return aEle.actifPour.contains(
            TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
          );
        },
      );
    }
    if (!!lNiveaux) {
      const lNiveau = TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
        aEvent,
        lNiveaux,
      );
      if (lNiveau) {
        _modifierNiveauDeSelectionCourante.call(this, false, lNiveau);
        return true;
      }
    }
  }
}
function _editionCommentaireAcquisitions(aSelections) {
  let lCommentaireCommun = null;
  let lEstPublieeCommun = null;
  let lCommentaireEstIdentique = true;
  let lPublicationEstIdentique = true;
  aSelections.every((aSelection) => {
    const lColonnesCompetences =
      aSelection.article.colonnesCompetences[aSelection.idColonne];
    const lCompetence = lColonnesCompetences && lColonnesCompetences.competence;
    if (lCompetence) {
      if (lCommentaireCommun === null) {
        lCommentaireCommun = lCompetence.observation || "";
      } else if (
        lCommentaireEstIdentique &&
        lCommentaireCommun !== lCompetence.observation
      ) {
        lCommentaireCommun = null;
        lCommentaireEstIdentique = false;
      }
      if (lEstPublieeCommun === null) {
        lEstPublieeCommun = !!lCompetence.observationPubliee;
      } else if (
        lPublicationEstIdentique &&
        lEstPublieeCommun !== lCompetence.observationPubliee
      ) {
        lEstPublieeCommun = null;
        lPublicationEstIdentique = false;
      }
      if (!lCommentaireEstIdentique && !lPublicationEstIdentique) {
        return false;
      }
    }
    return true;
  });
  const lFenetreEditionObservation = ObjetFenetre.creerInstanceFenetre(
    ObjetFenetre_SaisieMessage,
    {
      pere: this,
      evenement: function (aNumeroBouton, aDonnees) {
        if (aNumeroBouton === 1) {
          const lObservationSaisie = aDonnees.message;
          const lEstPublieeSaisie = aDonnees.estPublie;
          if (
            lObservationSaisie !== undefined ||
            lEstPublieeSaisie !== undefined
          ) {
            _editionSelectionsCellulesListe.call(
              this,
              aSelections,
              (aCompetence, aSelection) => {
                if (
                  aSelection.article.colonnesCompetences[aSelection.idColonne]
                    .editable &&
                  aCompetence
                ) {
                  let lCompetenceModifiee = false;
                  if (
                    lObservationSaisie !== undefined &&
                    aCompetence.observation !== lObservationSaisie
                  ) {
                    aCompetence.observation = lObservationSaisie;
                    lCompetenceModifiee = true;
                  }
                  if (
                    lEstPublieeSaisie !== undefined &&
                    aCompetence.observationPubliee !== lEstPublieeSaisie
                  ) {
                    aCompetence.observationPubliee = lEstPublieeSaisie;
                    lCompetenceModifiee = true;
                  }
                  if (!!lCompetenceModifiee) {
                    return true;
                  }
                }
              },
            );
          }
        }
      },
      initialiser: function (aInstance) {
        aInstance.setOptionsFenetre({
          titre: GTraductions.getValeur("competences.AjouterCommentaire"),
        });
        aInstance.setParametresFenetreSaisieMessage({
          maxLengthSaisie: 1000,
          avecControlePublication: true,
        });
      },
    },
  );
  lFenetreEditionObservation.setDonnees(lCommentaireCommun, lEstPublieeCommun);
}
function _editionSelectionsCellulesListe(aSelections, aMethodeEdition) {
  if (!aSelections || aSelections.length === 0) {
    return;
  }
  let lAvecModif = false;
  aSelections.forEach((aSelection) => {
    if (
      DonneesListe_Competences_ElevesEvaluation.estUneColonneCompetence(
        aSelection.idColonne,
      )
    ) {
      const lCompetenceEleve =
        aSelection.article.colonnesCompetences[aSelection.idColonne].competence;
      if (aMethodeEdition.call(this, lCompetenceEleve, aSelection)) {
        lCompetenceEleve.setEtat(EGenreEtat.Modification);
        aSelection.article.eleve.setEtat(EGenreEtat.Modification);
        lAvecModif = true;
      }
    }
  });
  if (lAvecModif) {
    this.callback.appel(
      EGenreEvenementCompetencesParEvaluation.editerCompetence,
    );
    this.getInstance(this.identListeElevesEvaluation).actualiser(true);
  }
}
function _modifierNiveauDeSelectionCourante(
  aAvecReouvertureMenuContextuel,
  aNiveau,
) {
  if (!aNiveau) {
    return;
  }
  const lListe = this.getInstance(this.identListeElevesEvaluation),
    lSelections = lListe.getTableauCellulesSelection();
  if (lSelections.length === 0) {
    return;
  }
  _editionSelectionsCellulesListe.call(
    this,
    lSelections,
    (aCompetence, aSelection) => {
      if (
        aSelection.article.colonnesCompetences[aSelection.idColonne].editable &&
        aCompetence &&
        aNiveau &&
        aCompetence.getNumero() !== aNiveau.getNumero()
      ) {
        aCompetence.niveauDAcquisition = aNiveau;
        return true;
      }
    },
  );
  if (lSelections.length === 1) {
    _selectionnerCelluleSuivante(lListe, aAvecReouvertureMenuContextuel);
  }
}
function _selectionnerCelluleSuivante(aListe, aAvecEntreeEnEdition) {
  aListe.selectionnerCelluleSuivante({
    entrerEdition: function (aParams) {
      return (
        aAvecEntreeEnEdition ||
        (aParams &&
          aParams.idColonne ===
            DonneesListe_Competences_ElevesEvaluation.colonnes.notes)
      );
    },
    orientationVerticale:
      GEtatUtilisateur.competences_modeSaisieClavierVertical,
  });
}
module.exports = {
  InterfaceCompetencesParEvaluation,
  EGenreEvenementCompetencesParEvaluation,
};
