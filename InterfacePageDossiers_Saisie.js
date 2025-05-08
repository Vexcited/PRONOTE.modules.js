const { _InterfacePageDossiers } = require("_InterfacePageDossiers.js");
const {
  ObjetFenetre_DossierVieScolaire,
} = require("ObjetFenetre_DossierVieScolaire.js");
const { ObjetFenetre_Punition } = require("ObjetFenetre_Punition.js");
const {
  ObjetFenetre_Correspondance,
} = require("ObjetFenetre_Correspondance.js");
const {
  ObjetRequeteSaisieDossierVS,
} = require("ObjetRequeteSaisieDossierVS.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GCache } = require("Cache.js");
const { DonneesListe_Dossiers } = require("DonneesListe_Dossiers.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { ObjetDossiersRecapitulatif } = require("ObjetDossiersRecapitulatif.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class InterfacePageDossiers_Saisie extends _InterfacePageDossiers {
  construireInstances() {
    this.IdentTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      this.surEvenementTripleCombo,
      _initialiserTripleCombo,
    );
    this.IdPremierElement = this.getInstance(
      this.IdentTripleCombo,
    ).getPremierElement();
    this.IdentRecapitulatif = this.add(
      ObjetDossiersRecapitulatif,
      _surEvenementRecapitulatif.bind(this),
    );
    this.identListeDossiers = this.add(
      ObjetListe,
      this.evenementListeDossiers,
      _initialiserListe,
    );
    this.identFenetreDossier = this.addFenetre(
      ObjetFenetre_DossierVieScolaire,
      this.evenementSurFenetre,
      this._initialiserFenetreDossier,
    );
    this.identFenetrePunition = this.addFenetre(
      ObjetFenetre_Punition,
      this.evenementSurPunition,
      this._initialiserFenetrePunition,
    );
    this.identFenetreCorrespondance = this.addFenetre(
      ObjetFenetre_Correspondance,
      this.evenementSurCorrespondance,
      this._initialiserFenetreCorrespondance,
    );
    this.construireFicheEleveEtFichePhoto();
  }
  detruireInstances() {
    GCache.dossierVS.vider();
  }
  setParametresGeneraux() {
    this.GenreStructure = EStructureAffichage.Verticale;
    this.IdentZoneAlClient = this.identListeDossiers;
    this.avecBandeau = true;
    this.AddSurZone = [];
    this.AddSurZone.push(this.IdentTripleCombo);
    if (this.avecFicheEleve()) {
      this.AddSurZone.push({ separateur: true });
    }
    this.addSurZoneFicheEleve();
    this.addSurZonePhotoEleve();
  }
  surEvenementTripleCombo() {
    this.surSelectionEleve();
    this.afficherPage();
  }
  _initialiserFenetreDossier(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("dossierVieScolaire.fenetre.titre"),
      largeur: 700,
      hauteur: 250,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  _initialiserFenetrePunition(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("fenetrePunition.titre"),
      largeur: 650,
      hauteur: 320,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  _initialiserFenetreCorrespondance(aInstance) {
    aInstance.setOptionsFenetre({
      titre: GTraductions.getValeur("FenetreCorrespondance.titre"),
      largeur: 400,
      hauteur: 300,
      listeBoutons: [
        GTraductions.getValeur("Annuler"),
        GTraductions.getValeur("Valider"),
      ],
    });
  }
  _getEleveSelectionne() {
    return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
  }
  valider() {
    new ObjetRequeteSaisieDossierVS(this, this.actionSurValidation)
      .addUpload({ listeFichiers: this.listePJEleve })
      .lancerRequete({
        listePJ: this.listePJEleve,
        listeDossiers: this.ListeDossiers,
        eleve: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve),
        donneesSaisie: this.donneesSaisieDossiers,
        listeCategories: this.listeCategories,
      });
  }
}
function _initialiserListe(aInstance) {
  const lTraductionTitres = GTraductions.getValeur(
    "dossierVieScolaire.listeTitres",
  );
  const lColonnes = [
    {
      id: DonneesListe_Dossiers.colonnes.evenement,
      titre: lTraductionTitres[0],
      taille: 120,
    },
    {
      id: DonneesListe_Dossiers.colonnes.date,
      titre: lTraductionTitres[1],
      taille: 145,
    },
    {
      id: DonneesListe_Dossiers.colonnes.responsable,
      titre: lTraductionTitres[2],
      taille: 160,
    },
    {
      id: DonneesListe_Dossiers.colonnes.interlocuteur,
      titre: lTraductionTitres[3],
      taille: 160,
    },
    {
      id: DonneesListe_Dossiers.colonnes.complementInfo,
      titre: lTraductionTitres[4],
      taille: "100%",
    },
    {
      id: DonneesListe_Dossiers.colonnes.pieceJointe,
      titre: { classeCssImage: "Image_Trombone" },
      taille: 24,
    },
    {
      id: DonneesListe_Dossiers.colonnes.publie,
      titre: { classeCssImage: "Image_Publie" },
      taille: 30,
    },
    {
      id: DonneesListe_Dossiers.colonnes.accesRestreint,
      titre: { classeCssImage: "Image_AccesRestreint" },
      taille: 30,
      hint: GTraductions.getValeur("dossierVS.restreindreAcces"),
    },
    { id: DonneesListe_Dossiers.colonnes.genre, titre: "", taille: 30 },
    { id: DonneesListe_Dossiers.colonnes.rang, titre: "", taille: 30 },
  ];
  const lColonnesCachees = [
    DonneesListe_Dossiers.colonnes.genre,
    DonneesListe_Dossiers.colonnes.rang,
  ];
  if (GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur) {
    lColonnesCachees.push(DonneesListe_Dossiers.colonnes.accesRestreint);
  }
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    colonnesCachees: lColonnesCachees,
    avecLigneCreation: GApplication.droits.get(
      TypeDroits.dossierVS.creerDossiersVS,
    ),
    titreCreation: GTraductions.getValeur("dossierVieScolaire.creerDossier"),
    boutons: [{ genre: ObjetListe.typeBouton.deployer }],
  });
}
function _initialiserTripleCombo(aInstance) {
  aInstance.setParametres([
    EGenreRessource.Classe,
    EGenreRessource.Periode,
    EGenreRessource.Eleve,
  ]);
}
function _surEvenementRecapitulatif(aInclureAnneesPrecedente) {
  this.afficherAnneesPrecedentes = aInclureAnneesPrecedente;
  this.executerRequetePageDossiers();
}
module.exports = { InterfacePageDossiers_Saisie };
