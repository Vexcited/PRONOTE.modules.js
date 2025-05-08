const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { DonneesListe_ListeDevoirs } = require("DonneesListe_ListeDevoirs.js");
const { Requetes } = require("CollectionRequetes.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
  ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
Requetes.inscrire("ListeDevoirs", ObjetRequeteConsultation);
class InterfaceListeDevoirs extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identTripleCombo = this.add(
      ObjetAffichagePageAvecMenusDeroulants,
      _eventSurDernierMenuDeroulant.bind(this),
      _initTripleCombo.bind(this),
    );
    this.identListeDevoirs = this.add(
      ObjetListe,
      this.evenementListeDevoirs,
      this.initialiserListeDevoirs,
    );
  }
  setParametresGeneraux() {
    this.IdentZoneAlClient = this.identListeDevoirs;
    this.avecBandeau = true;
    this.AddSurZone = [this.identTripleCombo];
  }
  setDonnees() {}
  recupererDonnees() {}
  evenementListeDevoirs() {}
  initialiserListeDevoirs(aInstance) {
    const lColonnes = [];
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.professeur,
      taille: 200,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Professeur"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.classe,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Classe"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Classe"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.matiere,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Matiere"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Matiere"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.sousMatiere,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.SousMatiere"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.SousMatiere"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.date,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Date"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Date"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.periode1,
      taille: 75,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Periode1"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Periode1"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.periode2,
      taille: 75,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Periode2"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Periode2"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.publieLe,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.DatePublication"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.DatePublication"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.facultatif,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Facultatif"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Facultatif"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.qcm,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.QCM"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.QCM"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.commentaire,
      taille: 200,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Commentaire"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Commentaire"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.piecesJointes,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Corrige"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Corrige"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.bareme,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Bareme"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Bareme"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.moyenne,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Moyenne"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Moyenne"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.maximum,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.NoteHaute"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.NoteHaute"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.minimum,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.NoteBasse"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.NoteBasse"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.mediane,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.NoteMediane"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.NoteMediane"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.coefficient,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Coefficient"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Coefficient"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.verrouille,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Verrouille"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Verrouille"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.cloturee,
      taille: 50,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.Cloturee"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.Cloturee"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.devoirSaisiLe,
      taille: 150,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.DateCreation"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.DateCreation"),
    });
    lColonnes.push({
      id: DonneesListe_ListeDevoirs.colonnes.dateInitiale,
      taille: 100,
      titre: GTraductions.getValeur("ListeDevoirs.colonne.DateInitiale"),
      hint: GTraductions.getValeur("ListeDevoirs.hint.DateInitiale"),
    });
    aInstance.setOptionsListe({
      colonnes: lColonnes,
      hauteurAdapteContenu: false,
      scrollHorizontal: true,
    });
    GEtatUtilisateur.setTriListe({
      liste: aInstance,
      tri: [
        DonneesListe_ListeDevoirs.colonnes.professeur,
        DonneesListe_ListeDevoirs.colonnes.classe,
      ],
    });
  }
}
function _actionApresRequeteListeDevoirs(aJSON) {
  this.getInstance(this.identListeDevoirs).setDonnees(
    new DonneesListe_ListeDevoirs(
      aJSON.listeDevoirs || new ObjetListeElements(),
    ),
  );
}
function _eventSurDernierMenuDeroulant() {
  this.classe = GEtatUtilisateur.Navigation.getRessource(
    EGenreRessource.Classe,
  );
  this.periode = GEtatUtilisateur.Navigation.getRessource(
    EGenreRessource.Periode,
  );
  Requetes(
    "ListeDevoirs",
    this,
    _actionApresRequeteListeDevoirs.bind(this),
  ).lancerRequete({ periode: this.periode });
}
function _initTripleCombo(aInstance) {
  aInstance.setParametres(
    [EGenreRessource.Classe, EGenreRessource.Periode],
    true,
  );
}
module.exports = { InterfaceListeDevoirs };
