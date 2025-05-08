exports.ObjetRequeteSaisieCreneauxLibres = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetRequeteSaisieCreneauxLibres extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
    this.setOptions({
      titreAnnulationValidation: ObjetTraduction_1.GTraductions.getValeur(
        "diagnostic.PlacementImpossible",
      ),
    });
  }
  lancerRequete(aParametres) {
    const lParametres = {
      place: -1,
      numeroSemaine: 1,
      dureeEnPlaces: 0,
      matiere: null,
      coursAnnule: null,
      semaineCoursAnnule: 1,
      salleImposee: null,
      salles: null,
      classes: null,
      groupes: null,
      personnels: null,
      materiels: null,
      eleves: null,
      forcerSaisie: false,
    };
    $.extend(lParametres, aParametres);
    function _serialisation(aElement, aJSON) {
      if (aElement.nombre > 1) {
        aJSON.nombre = aElement.nombre;
      }
    }
    this.JSON.numeroSemaine = lParametres.numeroSemaine;
    this.JSON.place = lParametres.place;
    this.JSON.dureeEnPlaces = lParametres.dureeEnPlaces;
    this.JSON.forcerSaisie = lParametres.forcerSaisie;
    this.JSON.matiere;
    if (lParametres.matiere) {
      this.JSON.matiere = lParametres.matiere.toJSON();
      if (lParametres.matiere.genreReservation) {
        this.JSON.matiere.genreReservation =
          lParametres.matiere.genreReservation;
      }
    }
    if (lParametres.coursAnnule) {
      this.JSON.coursAnnule = lParametres.coursAnnule;
      this.JSON.semaineCoursAnnule = lParametres.semaineCoursAnnule;
    }
    if (lParametres.salleImposee) {
      this.JSON.salleImposee = lParametres.salleImposee;
    } else if (lParametres.salles) {
      lParametres.salles.setSerialisateurJSON({
        ignorerEtatsElements: true,
        nePasTrierPourValidation: true,
        methodeSerialisation: _serialisation,
      });
      this.JSON.salles = lParametres.salles;
    }
    [
      "classes",
      "groupes",
      "professeurs",
      "personnels",
      "materiels",
      "eleves",
    ].forEach((aElement) => {
      if (lParametres[aElement]) {
        lParametres[aElement].setSerialisateurJSON({
          ignorerEtatsElements: true,
          nePasTrierPourValidation: true,
          methodeSerialisation: _serialisation,
        });
        this.JSON[aElement] = lParametres[aElement];
      }
    }, this);
    return this.appelAsynchrone();
  }
}
exports.ObjetRequeteSaisieCreneauxLibres = ObjetRequeteSaisieCreneauxLibres;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieCreneauxLibres",
  ObjetRequeteSaisieCreneauxLibres,
);
