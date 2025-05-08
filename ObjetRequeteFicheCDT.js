exports.ObjetRequeteFicheCDT = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetElement_1 = require("ObjetElement");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
class ObjetRequeteFicheCDT extends ObjetRequeteJSON_1.ObjetRequeteConsultation {
  lancerRequete(aParametres) {
    const lParametres = {
      pourCDT: false,
      pourTAF: false,
      cahierDeTextes: undefined,
      cours: undefined,
      numeroSemaine: undefined,
      matiere: undefined,
      date: undefined,
      contenu: undefined,
      TAF: undefined,
    };
    $.extend(lParametres, aParametres);
    this.JSON = {
      pourCDT: lParametres.pourCDT,
      pourTAF: lParametres.pourTAF,
      cahierDeTextes: lParametres.cahierDeTextes,
      cours: lParametres.cours,
      numeroSemaine: lParametres.numeroSemaine,
      matiere: lParametres.matiere,
      date: lParametres.date,
      contenu: lParametres.contenu,
      TAF: lParametres.TAF,
    };
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    let lGenreAffichageCDT;
    if (this.JSON.pourTAF) {
      lGenreAffichageCDT =
        Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
          .TravailAFaire;
    } else {
      lGenreAffichageCDT =
        Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
          .ContenuDeCours;
    }
    const lObjetDeserialiser = new ObjetDeserialiser_1.ObjetDeserialiser();
    let lCahierDeTexte = new ObjetElement_1.ObjetElement();
    if (
      !!this.JSONReponse.listeCahiersDeTexte &&
      this.JSONReponse.listeCahiersDeTexte.count() > 0 &&
      !!this.JSONReponse.listeCahiersDeTexte.get(0)
    ) {
      lCahierDeTexte = this.JSONReponse.listeCahiersDeTexte.get(0);
    }
    lObjetDeserialiser.deserialiserCahierDeTexte(lCahierDeTexte);
    this.callbackReussite.appel(lGenreAffichageCDT, lCahierDeTexte, this.JSON);
  }
}
exports.ObjetRequeteFicheCDT = ObjetRequeteFicheCDT;
CollectionRequetes_1.Requetes.inscrire("FicheCDT", ObjetRequeteFicheCDT);
