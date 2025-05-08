const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { EGenreTotalAffiche } = require("Enumere_ResultatsClasse.js");
const { GDate } = require("ObjetDate.js");
const {
  EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreAnnotation } = require("Enumere_Annotation.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
class DonneesListe_ResultatsClasse extends ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.nbCol = aParams.nbColonnes;
    this.donnees = aDonnees;
    this.moyennes = aParams.moyennes;
    this.moyenneClasse = aParams.moyenneClasse;
    this.anneeComplete = aParams.anneeComplete;
    this.avecDonneesItalie = aParams.avecDonneesItalie;
    this.avecGestionNotation = aParams.avecGestionNotation;
    this.genrePositonnementClasse = aParams.genrePositonnementClasse;
    this.avecNom =
      GEtatUtilisateur.triDonneesResultat !== undefined
        ? GEtatUtilisateur.triDonneesResultat
        : true;
    this.decalageItalie = 6;
    this.nombreColonnesFixes = this.avecDonneesItalie ? 17 : 11;
    this.listeTotaux = aParams.listeTotaux
      ? aParams.listeTotaux
      : [
          EGenreTotalAffiche.moyenneClasse,
          EGenreTotalAffiche.moyenneGroupe,
          EGenreTotalAffiche.noteMediane,
          EGenreTotalAffiche.noteHaute,
          EGenreTotalAffiche.noteBasse,
        ];
  }
  afficherNom(aBoolean) {
    this.avecNom = aBoolean;
    GEtatUtilisateur.triDonneesResultat = aBoolean;
  }
  avecSelection() {
    return false;
  }
  avecEdition() {
    return false;
  }
  avecSuppression() {
    return false;
  }
  avecEvenementSelectionClick(aParams) {
    return (
      aParams.idColonne ===
        DonneesListe_ResultatsClasse.colonnes.moyenneGenerale ||
      aParams.declarationColonne.estMoyenneRegroupement
    );
  }
  avecDeploiement() {
    return this.anneeComplete;
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne === DonneesListe_ResultatsClasse.colonnes.nom &&
      this.anneeComplete
    );
  }
  avecImageSurColonneDeploiement() {
    return true;
  }
  estUnDeploiement(aParams) {
    return aParams && aParams.article && aParams.article.lignePere === 0;
  }
  surDeploiement(I, J, D) {
    D.estDeploye = !D.estDeploye;
  }
  getCouleurCellule(aParams) {
    if (!aParams.article.pere && this.anneeComplete) {
      return ObjetDonneesListe.ECouleurCellule.Deploiement;
    }
  }
  getValeurPourTri(aColonne, aArticle) {
    const lParams = this.paramsListe.getParams(aColonne, -1, { surTri: true });
    lParams.article = aArticle;
    let lColonne = aColonne;
    if (aColonne > this.nombreColonnesFixes) {
      lColonne = aColonne + (this.avecDonneesItalie ? 0 : this.decalageItalie);
    }
    switch (lColonne) {
      case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale:
        return !isNaN(aArticle.moyenneGenerale.getValeur())
          ? aArticle.moyenneGenerale.getValeur()
          : aArticle.moyenneGenerale.genre - 100;
      case DonneesListe_ResultatsClasse.genreColonne.ressource:
      case DonneesListe_ResultatsClasse.genreColonne.lignePere:
      case DonneesListe_ResultatsClasse.genreColonne.deploye:
      case DonneesListe_ResultatsClasse.genreColonne.redoublant:
      case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
      case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
      case DonneesListe_ResultatsClasse.genreColonne.mention:
      case DonneesListe_ResultatsClasse.genreColonne.mentionVote:
      case DonneesListe_ResultatsClasse.genreColonne.credits:
      case DonneesListe_ResultatsClasse.genreColonne.creditsVote:
      case DonneesListe_ResultatsClasse.genreColonne.validite:
      case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
      case DonneesListe_ResultatsClasse.genreColonne.classe:
        return this.getValeur(lParams);
      case DonneesListe_ResultatsClasse.genreColonne.nom:
        return aArticle.position;
      case DonneesListe_ResultatsClasse.genreColonne.rang:
        return aArticle.rang;
      case DonneesListe_ResultatsClasse.genreColonne.neLe:
        return aArticle.dateNaissance;
      case DonneesListe_ResultatsClasse.genreColonne.absences:
        return aArticle.demiJourneesAbs;
      case DonneesListe_ResultatsClasse.genreColonne.creditsTotaux:
        return aArticle.chaineCreditsScolairesTotal;
      default: {
        const notes = aArticle.notesEleve.get(
          lParams.declarationColonne.rangColonne,
        );
        const estAbsence = lParams.declarationColonne.typeColonne === "absence";
        const lEstMoyenne =
          lParams.declarationColonne.typeColonne === "moyenne";
        const lEstPositionnement =
          lParams.declarationColonne.typeColonne === "positionnement";
        if (estAbsence) {
          return notes.ColAbs.detailAbsence;
        } else if (lEstMoyenne) {
          const lNote = notes.ColMoy.moyenne;
          if (
            lNote &&
            lNote.genre === EGenreAnnotation.note &&
            lNote.estUneValeur()
          ) {
            return lNote.valeur;
          } else {
            if (lNote) {
              return lNote.genre - 100;
            }
          }
          return -1000;
        }
        if (lEstPositionnement) {
          const lPositionNiveau = GParametres.listeNiveauxDAcquisitions
            .getElementParGenre(
              notes.ColPos.niveauDAcquisition
                ? notes.ColPos.niveauDAcquisition.getGenre()
                : 0,
            )
            .getPosition();
          return lPositionNiveau > 0 ? lPositionNiveau : 1000;
        } else {
          return this.getValeur(lParams);
        }
      }
    }
  }
  getTri(aColonneDeTri, aGenreTri) {
    if (aColonneDeTri === null || aColonneDeTri === undefined) {
      return [];
    }
    const lTri = [];
    lTri.push(
      ObjetTri.init(this.getValeurPourTri.bind(this, aColonneDeTri), aGenreTri),
    );
    return lTri;
  }
  getHintForce(aParams) {
    if (this.avecDonneesItalie) {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.validite:
          return aParams.article.hintValiditeAnnee;
      }
      return "";
    }
  }
  getValeur(aParams) {
    if (this.avecDonneesItalie) {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.ressource:
          return aParams.article.ressource;
        case DonneesListe_ResultatsClasse.genreColonne.lignePere:
          return aParams.article.lignePere;
        case DonneesListe_ResultatsClasse.genreColonne.deploye:
          return aParams.article.estDeploye;
        case DonneesListe_ResultatsClasse.genreColonne.nom:
          return aParams.article.periode === ""
            ? this.avecNom
              ? aParams.article.nom
              : aParams.article.numeroNational
            : aParams.article.periode;
        case DonneesListe_ResultatsClasse.genreColonne.redoublant:
          return aParams.article.redoublant;
        case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
          return aParams.article.projetsAccompagnement;
        case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
          return aParams.article.dernierEtablissement;
        case DonneesListe_ResultatsClasse.genreColonne.rang:
          return aParams.article.rang !== 0 ? aParams.article.rang : "-";
        case DonneesListe_ResultatsClasse.genreColonne.absences:
          return aParams.article.demiJourneesAbsStr;
        case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale:
          return aParams.article.moyenneGenerale;
        case DonneesListe_ResultatsClasse.genreColonne.mention:
          return aParams.article.libelleMention;
        case DonneesListe_ResultatsClasse.genreColonne.mentionVote:
          return aParams.article.mentionCode;
        case DonneesListe_ResultatsClasse.genreColonne.credits:
          return aParams.article.chaineCreditsScolaires
            ? parseInt(aParams.article.chaineCreditsScolaires)
            : "";
        case DonneesListe_ResultatsClasse.genreColonne.creditsVote:
          return aParams.article.creditsCode;
        case DonneesListe_ResultatsClasse.genreColonne.validite:
          return aParams.article.validiteAnnee;
        case DonneesListe_ResultatsClasse.genreColonne.creditsTotaux:
          return aParams.article.chaineCreditsScolairesTotal === ""
            ? "-"
            : parseInt(aParams.article.chaineCreditsScolairesTotal);
        case DonneesListe_ResultatsClasse.genreColonne.neLe:
          return GDate.formatDate(
            aParams.article.dateNaissance,
            "%JJ/%MM/%AAAA",
          );
        case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
          return aParams.article.nbRetard > 0 ? aParams.article.nbRetard : "";
        case DonneesListe_ResultatsClasse.genreColonne.classe:
          return "classe";
        default:
          return getContenuDynamique.call(
            this,
            aParams,
            aParams.colonne,
            aParams.article,
          );
      }
    } else {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.ressource:
          return aParams.article.ressource;
        case DonneesListe_ResultatsClasse.genreColonne.lignePere:
          return aParams.article.lignePere;
        case DonneesListe_ResultatsClasse.genreColonne.deploye:
          return aParams.article.estDeploye;
        case DonneesListe_ResultatsClasse.genreColonne.nom:
          return aParams.article.periode === ""
            ? this.avecNom
              ? aParams.article.nom
              : aParams.article.numeroNational
            : aParams.article.periode;
        case DonneesListe_ResultatsClasse.genreColonne.redoublant:
          return aParams.article.redoublant;
        case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
          return aParams.article.projetsAccompagnement;
        case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
          return aParams.article.dernierEtablissement;
        case DonneesListe_ResultatsClasse.genreColonne.rang:
          return aParams.article.rang !== 0 ? aParams.article.rang : "-";
        case DonneesListe_ResultatsClasse.genreColonne.absences:
          return aParams.article.demiJourneesAbs > 0
            ? aParams.article.demiJourneesAbs
            : "-";
        case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale -
          this.decalageItalie:
          return aParams.article.moyenneGenerale;
        case DonneesListe_ResultatsClasse.genreColonne.neLe:
          return GDate.formatDate(
            aParams.article.dateNaissance,
            "%JJ/%MM/%AAAA",
          );
        case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
          return aParams.article.nbRetard > 0 ? aParams.article.nbRetard : "";
        case DonneesListe_ResultatsClasse.genreColonne.classe:
          return "Classe";
        default:
          return getContenuDynamique.call(
            this,
            aParams,
            aParams.colonne,
            aParams.article,
          );
      }
    }
  }
  getTypeValeur(aParams) {
    if (this.avecDonneesItalie) {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.ressource:
          return ObjetDonneesListe.ETypeCellule.CocheDeploiement;
        case DonneesListe_ResultatsClasse.genreColonne.lignePere:
        case DonneesListe_ResultatsClasse.genreColonne.deploye:
          return ObjetDonneesListe.ETypeCellule.Coche;
        case DonneesListe_ResultatsClasse.genreColonne.nom:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.redoublant:
          return ObjetDonneesListe.ETypeCellule.Coche;
        case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
        case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
        case DonneesListe_ResultatsClasse.genreColonne.rang:
        case DonneesListe_ResultatsClasse.genreColonne.absences:
        case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale:
        case DonneesListe_ResultatsClasse.genreColonne.mention:
        case DonneesListe_ResultatsClasse.genreColonne.mentionVote:
        case DonneesListe_ResultatsClasse.genreColonne.credits:
        case DonneesListe_ResultatsClasse.genreColonne.creditsVote:
        case DonneesListe_ResultatsClasse.genreColonne.validite:
        case DonneesListe_ResultatsClasse.genreColonne.creditsTotaux:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.neLe:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
        case DonneesListe_ResultatsClasse.genreColonne.classe:
          return ObjetDonneesListe.ETypeCellule.Texte;
        default:
          return getTypeContenuDynamique.call(this, aParams);
      }
    } else {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.ressource:
          return ObjetDonneesListe.ETypeCellule.CocheDeploiement;
        case DonneesListe_ResultatsClasse.genreColonne.lignePere:
        case DonneesListe_ResultatsClasse.genreColonne.deploye:
          return ObjetDonneesListe.ETypeCellule.Coche;
        case DonneesListe_ResultatsClasse.genreColonne.nom:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.redoublant:
          return ObjetDonneesListe.ETypeCellule.Coche;
        case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
        case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
        case DonneesListe_ResultatsClasse.genreColonne.rang:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.absences:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale -
          this.decalageItalie:
          return ObjetDonneesListe.ETypeCellule.Note;
        case DonneesListe_ResultatsClasse.genreColonne.neLe:
          return ObjetDonneesListe.ETypeCellule.Texte;
        case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
        case DonneesListe_ResultatsClasse.genreColonne.classe:
          return ObjetDonneesListe.ETypeCellule.Texte;
        default:
          return getTypeContenuDynamique.call(this, aParams);
      }
    }
  }
  getStyle(aParams) {
    switch (aParams.colonne) {
      case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale:
        return "font-weight:bold;";
      default:
        return getStyleDynamique.call(this, aParams);
    }
  }
  getClass(aParams) {
    if (this.avecDonneesItalie) {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.ressource:
        case DonneesListe_ResultatsClasse.genreColonne.lignePere:
        case DonneesListe_ResultatsClasse.genreColonne.deploye:
          return "AlignementDroit";
        case DonneesListe_ResultatsClasse.genreColonne.nom:
          return "AlignementGauche";
        case DonneesListe_ResultatsClasse.genreColonne.redoublant:
        case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
        case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
        case DonneesListe_ResultatsClasse.genreColonne.rang:
        case DonneesListe_ResultatsClasse.genreColonne.absences:
          return "";
        case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale:
          return "Gras";
        case DonneesListe_ResultatsClasse.genreColonne.mention:
          return "AlignementDroit";
        case DonneesListe_ResultatsClasse.genreColonne.mentionVote:
          return "AlignementMilieu";
        case DonneesListe_ResultatsClasse.genreColonne.credits:
          return "AlignementDroit";
        case DonneesListe_ResultatsClasse.genreColonne.creditsVote:
          return "AlignementMilieu";
        case DonneesListe_ResultatsClasse.genreColonne.validite:
          return "AlignementMilieu";
        case DonneesListe_ResultatsClasse.genreColonne.creditsTotaux:
          return "AlignementDroit";
        case DonneesListe_ResultatsClasse.genreColonne.neLe:
        case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
        case DonneesListe_ResultatsClasse.genreColonne.classe:
          return "AlignementDroit";
        default:
          return getClassDynamique.call(this, aParams);
      }
    } else {
      switch (aParams.colonne) {
        case DonneesListe_ResultatsClasse.genreColonne.ressource:
        case DonneesListe_ResultatsClasse.genreColonne.lignePere:
        case DonneesListe_ResultatsClasse.genreColonne.deploye:
          return "AlignementDroit";
        case DonneesListe_ResultatsClasse.genreColonne.nom:
          return "AlignementGauche";
        case DonneesListe_ResultatsClasse.genreColonne.redoublant:
        case DonneesListe_ResultatsClasse.genreColonne.projetsAccompagnement:
        case DonneesListe_ResultatsClasse.genreColonne.dernierEtablissement:
        case DonneesListe_ResultatsClasse.genreColonne.rang:
        case DonneesListe_ResultatsClasse.genreColonne.absences:
          return "AlignementDroit";
        case DonneesListe_ResultatsClasse.genreColonne.moyenneGenerale -
          this.decalageItalie:
          return "AlignementDroit Gras";
        case DonneesListe_ResultatsClasse.genreColonne.neLe:
        case DonneesListe_ResultatsClasse.genreColonne.nombreRetards:
        case DonneesListe_ResultatsClasse.genreColonne.classe:
          return "AlignementDroit";
        default:
          return getClassDynamique.call(this, aParams);
      }
    }
  }
  getClassTotal(aParams) {
    return this.getClass(aParams);
  }
  getListeLignesTotal() {
    const lListe = new ObjetListeElements();
    if (this.avecGestionNotation) {
      this.listeTotaux.forEach((element) => {
        switch (element) {
          case EGenreTotalAffiche.moyenneClasse:
            lListe.addElement(
              new ObjetElement(
                GTraductions.getValeur("resultatsClasses.total.moyenneService"),
                EGenreTotalAffiche.moyenneClasse,
              ),
            );
            break;
          case EGenreTotalAffiche.moyenneGroupe:
            lListe.addElement(
              new ObjetElement(
                GTraductions.getValeur("resultatsClasses.total.moyenneGroupe"),
                EGenreTotalAffiche.moyenneGroupe,
              ),
            );
            break;
          case EGenreTotalAffiche.noteBasse:
            lListe.addElement(
              new ObjetElement(
                GTraductions.getValeur("resultatsClasses.total.noteBasse"),
                EGenreTotalAffiche.noteBasse,
              ),
            );
            break;
          case EGenreTotalAffiche.noteMediane:
            lListe.addElement(
              new ObjetElement(
                GTraductions.getValeur("resultatsClasses.total.noteMediane"),
                EGenreTotalAffiche.noteMediane,
              ),
            );
            break;
          case EGenreTotalAffiche.noteHaute:
            lListe.addElement(
              new ObjetElement(
                GTraductions.getValeur("resultatsClasses.total.noteHaute"),
                EGenreTotalAffiche.noteHaute,
              ),
            );
            break;
        }
      });
    }
    return lListe;
  }
  getContenuTotal(aParams) {
    if (aParams.idColonne === "moyenneGenerale") {
      switch (aParams.article.getNumero()) {
        case EGenreTotalAffiche.moyenneClasse:
          return this.moyenneClasse.generale;
        case EGenreTotalAffiche.noteBasse:
          return this.moyenneClasse.basse;
        case EGenreTotalAffiche.noteMediane:
          return this.moyenneClasse.mediane;
        case EGenreTotalAffiche.noteHaute:
          return this.moyenneClasse.haute;
      }
    }
    if (aParams.idColonne === "nom") {
      return aParams.article.getLibelle();
    }
    const i = aParams.declarationColonne.rangColonne;
    if (i >= 0) {
      if (aParams.declarationColonne.typeColonne === "absence") {
        return aParams.article.getNumero() === EGenreTotalAffiche.moyenneClasse
          ? this.moyennes.get(aParams.declarationColonne.rangColonne)
              .totalAbsenceColonne
          : "&nbsp;";
      }
      if (aParams.declarationColonne.typeColonne === "positionnement") {
        return "";
      }
      switch (aParams.article.getNumero()) {
        case EGenreTotalAffiche.moyenneClasse:
          return this.moyennes.get(i).moyenneService.chaine !== ""
            ? this.moyennes.get(i).moyenneService
            : "&nbsp;";
        case EGenreTotalAffiche.moyenneGroupe:
          return this.moyennes.get(i).moyenneGroupeService.chaine !== ""
            ? this.moyennes.get(i).moyenneGroupeService
            : "&nbsp;";
        case EGenreTotalAffiche.noteBasse:
          return this.moyennes.get(i).noteBasse &&
            this.moyennes.get(i).noteBasse.chaine !== ""
            ? this.moyennes.get(i).noteBasse
            : "&nbsp;";
        case EGenreTotalAffiche.noteMediane:
          return this.moyennes.get(i).noteMediane &&
            this.moyennes.get(i).noteMediane.chaine !== ""
            ? this.moyennes.get(i).noteMediane
            : "&nbsp;";
        case EGenreTotalAffiche.noteHaute:
          return this.moyennes.get(i).noteHaute &&
            this.moyennes.get(i).noteHaute.chaine !== ""
            ? this.moyennes.get(i).noteHaute
            : "&nbsp;";
      }
    }
    return "";
  }
}
DonneesListe_ResultatsClasse.colonnes = {
  ressource: "ressource",
  nom: "nom",
  redoublant: "redoublant",
  projetsAccompagnement: "projetAccompagnement",
  dernierEtablissement: "dernierEtablissement",
  rang: "rang",
  absences: "demiJourneesAbs",
  moyenneGenerale: "moyenneGenerale",
  lignePere: "lignePere",
  coldyn: "colDyn",
  sousCol: "sousCol",
  deploye: "deploye",
  mention: "libelleMention",
  mentionV: "mentionCode",
  credits: "chaineCreditsScolaires",
  creditsV: "creditsCode",
  validite: "validiteAnnee",
  creditsTotaux: "chaineCreditsScolairesTotal",
  neLe: "dateNaissance",
  nombreRetards: "nbRetard",
  classe: "classe",
};
DonneesListe_ResultatsClasse.genreColonne = {
  ressource: 0,
  lignePere: 1,
  deploye: 2,
  nom: 3,
  neLe: 4,
  redoublant: 5,
  projetsAccompagnement: 6,
  dernierEtablissement: 7,
  absences: 8,
  nombreRetards: 9,
  rang: 10,
  classe: 11,
  mention: 12,
  mentionVote: 13,
  credits: 14,
  creditsVote: 15,
  validite: 16,
  creditsTotaux: 17,
  moyenneGenerale: 18,
};
function getClassDynamique(params) {
  const lBold = params.declarationColonne.estPere ? " Gras " : "";
  return (
    (params.declarationColonne.estPere
      ? "AlignementDroit"
      : params.declarationColonne.estAbsence
        ? "AlignementDroit"
        : params.declarationColonne.estCompetence
          ? "AlignementMilieu"
          : "AlignementDroit") + lBold
  );
}
function getStyleDynamique(params) {
  const colonne = params.article.notesEleve.get(
    params.declarationColonne.rangColonne,
  );
  const lStyle = [];
  if (params.declarationColonne.estPere) {
    lStyle.push("font-weight:bold");
  }
  if (params.declarationColonne.typeColonne === "moyenne" && colonne.ColMoy) {
    lStyle.push(GStyle.composeCouleurTexte(colonne.ColMoy.couleurNote));
  }
  return lStyle.join(";");
}
function getContenuDynamique(aParams) {
  const lSurExportCSV = aParams && aParams.surExportCSV;
  const notes = aParams.article
    ? aParams.article.notesEleve.get(aParams.declarationColonne.rangColonne)
    : null;
  if (notes) {
    let lAbr;
    if (notes.ColMoy.avecAnnotation) {
      switch (GEtatUtilisateur.etatComboTypeMoyenne) {
        case 0:
        case 1:
          lAbr = notes.ColMoy.abrProposee;
          break;
        case 2:
          lAbr = notes.ColMoy.abrDeliberee;
          break;
        default:
          lAbr = "";
      }
    }
    switch (aParams.declarationColonne.typeColonne) {
      case "moyenne":
        return aParams.declarationColonne.avecAnnotation
          ? lAbr
          : !!notes.ColMoy.moyenne
            ? notes.ColMoy.moyenne
            : "";
      case "positionnement": {
        const lElement =
          GParametres.listeNiveauxDAcquisitions.getElementParGenre(
            notes.ColPos.niveauDAcquisition
              ? notes.ColPos.niveauDAcquisition.getGenre()
              : 0,
          );
        const lImage = EGenreNiveauDAcquisitionUtil.getImagePositionnement({
          niveauDAcquisition: lElement,
          genrePositionnement:
            TypePositionnementUtil.getGenrePositionnementParDefaut(
              this.genrePositonnementClasse,
            ),
        });
        return lSurExportCSV
          ? EGenreNiveauDAcquisitionUtil.getAbbreviation(lElement)
          : lImage;
      }
      case "absence":
        return notes.ColAbs.contenuCellule;
      default:
    }
  }
}
function getTypeContenuDynamique(aParams) {
  switch (aParams.declarationColonne.typeColonne) {
    case "moyenne":
      return aParams.declarationColonne.estAnnotation
        ? ObjetDonneesListe.ETypeCellule.Texte
        : ObjetDonneesListe.ETypeCellule.Note;
    case "positionnement":
      return ObjetDonneesListe.ETypeCellule.Html;
    case "absence":
      return ObjetDonneesListe.ETypeCellule.Texte;
    default:
  }
  return aParams.declarationColonne.estPere
    ? ObjetDonneesListe.ETypeCellule.Texte
    : aParams.declarationColonne.estAbsence
      ? ObjetDonneesListe.ETypeCellule.Texte
      : aParams.declarationColonne.estCompetence
        ? ObjetDonneesListe.ETypeCellule.Html
        : ObjetDonneesListe.ETypeCellule.Html;
}
module.exports = { DonneesListe_ResultatsClasse };
