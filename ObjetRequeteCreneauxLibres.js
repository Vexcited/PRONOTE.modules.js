exports.ObjetRequeteCreneauxLibres = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteCreneauxLibres extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    const lParametres = {
      numeroSemaine: 1,
      dureeEnPlaces: 0,
      capaciteSalle: 0,
      site: undefined,
      salles: null,
      classes: null,
      groupes: null,
      parties: null,
      materiels: null,
      eleves: null,
      coursAnnule: null,
      semaineCoursAnnule: 1,
      demandeRessources: false,
      demandeCoursAnnule: false,
    };
    $.extend(lParametres, aParametres);
    this._listeSallesModele = aParametres.listeSallesModele;
    if (lParametres.demandeRessources || lParametres.demandeCoursAnnule) {
      this.JSON.demandeRessources = lParametres.demandeRessources;
      if (lParametres.demandeCoursAnnule) {
        this.JSON.demandeCoursAnnule = true;
        this.JSON.coursAnnule = lParametres.coursAnnule;
        this.JSON.semaineCoursAnnule = lParametres.semaineCoursAnnule;
      }
    } else {
      this.JSON.numeroSemaine = lParametres.numeroSemaine;
      this.JSON.dureeEnPlaces = lParametres.dureeEnPlaces;
      this.JSON.capaciteSalle = lParametres.capaciteSalle;
      this.JSON.site = lParametres.site;
      [
        "salles",
        "classes",
        "groupes",
        "parties",
        "professeurs",
        "personnels",
        "materiels",
        "eleves",
      ].forEach((aElement) => {
        if (lParametres[aElement]) {
          lParametres[aElement].setSerialisateurJSON({
            ignorerEtatsElements: true,
            nePasTrierPourValidation: true,
            methodeSerialisation: function (aElement, aJSON) {
              if (aElement.nombre > 1) {
                aJSON.nombre = aElement.nombre;
              }
            },
          });
          this.JSON[aElement] = lParametres[aElement];
        }
      });
      if (lParametres.coursAnnule) {
        this.JSON.coursAnnule = lParametres.coursAnnule;
        this.JSON.semaineCoursAnnule = lParametres.semaineCoursAnnule;
      }
    }
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    if (this.JSONReponse.demandeRessources || this.JSONReponse.coursAnnule) {
      this.callbackReussite.appel({
        demandeRessources: this.JSONReponse.demandeRessources,
        reponse: this.JSONReponse,
      });
      return;
    }
    const lListeSalles = this.JSONReponse.salles,
      lListeSallesModele = this._listeSallesModele;
    if (lListeSalles && this._listeSallesModele) {
      lListeSalles.parcourir((D) => {
        const lModele = lListeSallesModele.getElementParNumero(D.getNumero());
        if (lModele) {
          D.Libelle = lModele.getLibelle();
        }
      });
    }
    const lListeInfosPlaces = new ObjetListeElements_1.ObjetListeElements();
    for (let lIPlace = 0; lIPlace < this.JSONReponse.places.length; lIPlace++) {
      const lJInfosPlace = this.JSONReponse.places[lIPlace];
      const lPlace = new ObjetElement_1.ObjetElement();
      lListeInfosPlaces.addElement(lPlace);
      lPlace.place = lIPlace;
      lPlace.resultatRecherche = lJInfosPlace.res;
      const lListeRessources = new ObjetListeElements_1.ObjetListeElements();
      if (lJInfosPlace.lP && this.JSONReponse.listeProfesseursD) {
        lJInfosPlace.lP.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listeProfesseursD,
            Enumere_Ressource_1.EGenreRessource.Enseignant,
          ),
        );
      }
      if (lJInfosPlace.lS && this.JSONReponse.listeSallesD) {
        lJInfosPlace.lS.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listeSallesD,
            Enumere_Ressource_1.EGenreRessource.Salle,
          ),
        );
      }
      if (lJInfosPlace.lC && this.JSONReponse.listeClassesD) {
        lJInfosPlace.lC.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listeClassesD,
            Enumere_Ressource_1.EGenreRessource.Classe,
          ),
        );
      }
      if (lJInfosPlace.lG && this.JSONReponse.listeGroupesD) {
        lJInfosPlace.lG.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listeGroupesD,
            Enumere_Ressource_1.EGenreRessource.Groupe,
          ),
        );
      }
      if (lJInfosPlace.lPa && this.JSONReponse.listePartiesD) {
        lJInfosPlace.lPa.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listePartiesD,
            Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
          ),
        );
      }
      if (lJInfosPlace.lPe && this.JSONReponse.listePersonnelsD) {
        lJInfosPlace.lPe.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listePersonnelsD,
            Enumere_Ressource_1.EGenreRessource.Personnel,
          ),
        );
      }
      if (lJInfosPlace.lMa && this.JSONReponse.listeMaterielsD) {
        lJInfosPlace.lMa.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listeMaterielsD,
            Enumere_Ressource_1.EGenreRessource.Materiel,
          ),
        );
      }
      if (lJInfosPlace.lEl && this.JSONReponse.listeElevesD) {
        lJInfosPlace.lEl.every(
          _remplacerRessource.bind(
            this,
            lListeRessources,
            this.JSONReponse.listeElevesD,
            Enumere_Ressource_1.EGenreRessource.Eleve,
          ),
        );
      }
      if (lListeRessources.count() > 0) {
        lPlace.diagnostic = lListeRessources;
      }
      lPlace.listeSallesLibres = new ObjetListeElements_1.ObjetListeElements();
      if (lJInfosPlace.sallesL) {
        const lArraySalles = lJInfosPlace.sallesL.items();
        for (let ISalle = 0; ISalle < lArraySalles.length; ISalle++) {
          const lSalle = lListeSalles.get(lArraySalles[ISalle]);
          lPlace.listeSallesLibres.addElement(lSalle);
        }
      }
    }
    this.callbackReussite.appel({
      listeSalles: lListeSalles,
      listeInfosPlaces: lListeInfosPlaces,
      ressourcesIncompatibles: this.JSONReponse.ressourcesIncompatibles,
    });
  }
}
exports.ObjetRequeteCreneauxLibres = ObjetRequeteCreneauxLibres;
CollectionRequetes_1.Requetes.inscrire(
  "CreneauxLibres",
  ObjetRequeteCreneauxLibres,
);
function _remplacerRessource(
  aListeRessourcesARemplir,
  aListeRessourceModele,
  aGenreRessource,
  aElement,
) {
  if (!aElement) {
    return true;
  }
  if (!aElement.d) {
    return true;
  }
  const lIndice = aElement.G,
    lRessourceModele = aListeRessourceModele.get(lIndice);
  const lRessource = new ObjetElement_1.ObjetElement(
    "",
    lRessourceModele.getNumero(),
    aGenreRessource,
  );
  lRessource.diag = new TypeEnsembleNombre_1.TypeEnsembleNombre().fromString(
    aElement.d,
  );
  aListeRessourcesARemplir.addElement(lRessource);
  return true;
}
