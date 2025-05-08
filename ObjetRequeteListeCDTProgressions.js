exports.ObjetRequeteListeCDTProgressions = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetChaine_1 = require("ObjetChaine");
class ObjetRequeteListeCDTProgressions extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    this.JSON = {
      contenuPourAffectationAuCours: null,
      AvecMatiereNiveau: false,
      ProgressionsDeCours: false,
      Cours: undefined,
      NumeroCycle: undefined,
      avecProgressionDefautDuCours: false,
      avecListeCategorieEtDocJoints: true,
      avecListeProgrammesNiveaux: true,
      avecDossierProgression: true,
      toutesLesProgressionsPublics: false,
      avecContenuDossier: false,
      progressionDemande: undefined,
    };
    $.extend(this.JSON, aParametres);
    this.contenuPourAffectation = !!aParametres.contenuPourAffectationAuCours;
    if (
      this.JSON.avecListeProgrammesNiveaux === true &&
      GEtatUtilisateur.listeProgrammesParNiveau
    ) {
      this.JSON.avecListeProgrammesNiveaux = false;
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (this.contenuPourAffectation) {
      this.callbackReussite.appel(this.JSONReponse);
      return;
    }
    const lListeProfsParMatiere =
      new ObjetListeElements_1.ObjetListeElements().fromJSON(
        this.JSONReponse ? this.JSONReponse.listeProfsParMatiere : null,
        _ajouterDetailsProfsMatiere.bind(this),
      );
    const lListeProgressions =
        new ObjetListeElements_1.ObjetListeElements().fromJSON(
          this.JSONReponse.ListeProgressions,
          _ajouterDetailsDeProgression.bind(this, {
            listeMatieresProf: lListeProfsParMatiere,
          }),
        ),
      lListeProgressionsPublicCopie =
        new ObjetListeElements_1.ObjetListeElements().fromJSON(
          this.JSONReponse.listeProgressionsPublicCopie,
          _ajouterDetailsDeProgression.bind(this, { pourCopie: true }),
        );
    lListeProgressions.trier();
    if (this.JSONReponse.messageAucuneProgression) {
      lListeProgressions.messageAucuneProgression =
        this.JSONReponse.messageAucuneProgression;
    }
    lListeProgressionsPublicCopie.add(lListeProgressions);
    lListeProgressionsPublicCopie.trier();
    const lListeNiveaux = this.JSONReponse.ListeNiveaux;
    if (lListeNiveaux) {
      lListeNiveaux.parcourir((D) => {
        if (D.listeMatieres) {
          D.listeMatieres.parcourir((aMatiere) => {
            _ajouterListeProfsAMatiere(aMatiere, lListeProfsParMatiere);
          });
        }
      });
    }
    const lListePieceJointes = this.JSONReponse.listeDocumentsJoints;
    if (lListePieceJointes) {
      lListePieceJointes.parcourir((aPieceJointe) => {
        if (
          aPieceJointe.Genre ===
          Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
        ) {
          aPieceJointe.Url = ObjetChaine_1.GChaine.composerUrlLienExterne({
            documentJoint: aPieceJointe,
          });
        } else {
          aPieceJointe.Url = aPieceJointe.Libelle;
        }
        aPieceJointe.PourMemeMatiere = true;
        aPieceJointe.PourMemeClasseEtGroupe = true;
        aPieceJointe.Date = ObjetDate_1.GDate.getDateCourante();
      });
    }
    if (this.JSONReponse.ListeProgrammesNiveaux) {
      GEtatUtilisateur.listeProgrammesParNiveau =
        new ObjetListeElements_1.ObjetListeElements().fromJSON(
          this.JSONReponse.ListeProgrammesNiveaux,
          _ajouterDetailsNiveauDeProgramme.bind(this),
        );
      GEtatUtilisateur.listeProgrammesParNiveau.trier();
    }
    this.callbackReussite.appel(
      lListeProgressions,
      lListeNiveaux,
      this.JSONReponse.listeCategories,
      lListePieceJointes,
      lListeProgressionsPublicCopie,
      this.JSONReponse.progressionDefault,
    );
  }
}
exports.ObjetRequeteListeCDTProgressions = ObjetRequeteListeCDTProgressions;
CollectionRequetes_1.Requetes.inscrire(
  "ListeCDTProgressions",
  ObjetRequeteListeCDTProgressions,
);
function _trierListe(aListeElements) {
  if (!aListeElements) {
    return;
  }
  function _triSelonGenreRessource(aElement) {
    switch (aElement.getGenre()) {
      case Enumere_Ressource_1.EGenreRessource.DossierProgression:
        return 0;
      default: {
        return 1;
      }
    }
  }
  aListeElements.setTri([
    ObjetTri_1.ObjetTri.init(_triSelonGenreRessource),
    ObjetTri_1.ObjetTri.init("ordre"),
  ]);
  aListeElements.trier();
}
function _ajouterDetailsDeProgression(aParametres, aJSON, aProgression) {
  const lParametres = { listeMatieresProf: null, pourCopie: false };
  $.extend(lParametres, aParametres);
  aProgression.matiere = new ObjetElement_1.ObjetElement().fromJSON(
    aJSON.matiere,
  );
  aProgression.niveau = new ObjetElement_1.ObjetElement().fromJSON(
    aJSON.niveau,
  );
  aProgression.periode = aJSON.periode;
  aProgression.estPublic = aJSON.EstPublic;
  aProgression.estVide = aJSON.estVide;
  if (lParametres.pourCopie) {
    aProgression.progressionPourCopie = true;
  }
  if (aJSON.listeCoEnseignants) {
    aProgression.listeCoEnseignants = aJSON.listeCoEnseignants;
  }
  if (aJSON.ListeDossiers) {
    aProgression.listeDossiers =
      new ObjetListeElements_1.ObjetListeElements().fromJSON(
        aJSON.ListeDossiers,
        _ajouterDossier,
      );
    _trierListe(aProgression.listeDossiers);
  }
  if (lParametres.listeMatieresProf) {
    _ajouterListeProfsAMatiere(
      aProgression.matiere,
      lParametres.listeMatieresProf,
    );
  }
  if (aJSON.nonPersonnel) {
    aProgression.nonPersonnel = true;
  }
}
function _ajouterDossier(aJSON, aDossier) {
  aDossier.ordre = aJSON.Ordre;
  aDossier._ordreOrigine = aJSON.Ordre;
  aDossier.listeDossiers =
    new ObjetListeElements_1.ObjetListeElements().fromJSON(
      aJSON.ListeDossiers,
      _ajouterDossier,
    );
  _trierListe(aDossier.listeDossiers);
  aDossier.listeContenus =
    new ObjetListeElements_1.ObjetListeElements().fromJSON(
      aJSON.listeElements,
      _ajouterElement,
    );
  _trierListe(aDossier.listeContenus);
}
function _ajouterElement(aJSON, aElement) {
  aElement.ordre = aJSON.Ordre;
  aElement._ordreOrigine = aJSON.Ordre;
  if (aJSON.descriptif) {
    aElement.descriptif = aJSON.descriptif;
  }
  if (aJSON.categorie) {
    aElement.categorie = aJSON.categorie;
  }
  if (aJSON.ListePiecesJointes) {
    aElement.ListePieceJointe = aJSON.ListePiecesJointes;
    aElement.ListePieceJointe.parcourir((aElement) => {
      aElement.Url = ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aElement);
    });
  }
  if (aJSON.listeAffectes) {
    aElement.listeAffectes = aJSON.listeAffectes;
    aElement.listeAffectes.setTri([ObjetTri_1.ObjetTri.init("date")]);
    aElement.listeAffectes.trier();
  }
}
function _ajouterDetailsProfsMatiere(aJSON, aElement) {
  aElement.listeProfs = new ObjetListeElements_1.ObjetListeElements().fromJSON(
    aJSON.listeProfs,
  );
}
function _ajouterListeProfsAMatiere(aMatiere, aListeProfsParMatiere) {
  if (aListeProfsParMatiere) {
    const lMatiereTrouve = aListeProfsParMatiere.getElementParNumero(
      aMatiere.getNumero(),
    );
    if (lMatiereTrouve && lMatiereTrouve.listeProfs) {
      aMatiere.listeProfs = lMatiereTrouve.listeProfs;
    }
  }
}
function _ajouterDetailsNiveauDeProgramme(aJSON, aElement) {
  aElement.listeProgrammes =
    new ObjetListeElements_1.ObjetListeElements().fromJSON(
      aJSON.Liste,
      _ajouterDetailsMatiereDeProgramme,
    );
  aElement.ancienNouveau = aJSON.ancienNouveau;
  aElement.cycle = aJSON.cycle || "";
}
function _ajouterDetailsMatiereDeProgramme(aJSON, aElement) {
  aElement.titreProgramme = aJSON.T;
  aElement.filiere = aJSON.F;
  aElement.cycle = aJSON.C || "";
  aElement.nouveau = !!aJSON.nouveau;
  aElement.filieres = aElement.filiere ? aElement.filiere.split(",") : [];
  for (const i in aElement.filieres) {
    aElement.filieres[i] = aElement.filieres[i].trim();
  }
}
