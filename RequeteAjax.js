exports.RequeteAjax = exports.EGenreRequete = void 0;
const MoteurAjax_1 = require("MoteurAjax");
var EGenreRequete;
(function (EGenreRequete) {
  EGenreRequete[(EGenreRequete["SOAP"] = 0)] = "SOAP";
})(EGenreRequete || (exports.EGenreRequete = EGenreRequete = {}));
class RequeteAjax {
  constructor(
    aPOST,
    aModeAsynchrone,
    aReponseTexte,
    aGenreRequete,
    aDescriptionRequete,
    aURLCible,
    aCallback,
    aDonnees,
  ) {
    this.methode = !aPOST ? "GET" : "POST";
    this.modeAsynchrone = aModeAsynchrone ? aModeAsynchrone : true;
    this.reponseTexte = aReponseTexte ? aReponseTexte : true;
    this.urlCible = aURLCible;
    this.pere = aCallback.pere;
    this.evenement = aCallback.evenement;
    this.donnees = aDonnees;
    this.genreRequete = aGenreRequete;
    this.descriptionRequete = aDescriptionRequete;
    this.moteurAjax = new MoteurAjax_1.MoteurAjax(
      this.methode,
      this.modeAsynchrone,
    );
  }
  envoyerRequete() {
    this.moteurAjax.definirRequete(this.urlCible);
    this.moteurAjax.associerFonctionDeRappel(this.methodeCallback, this);
    if (this.genreRequete === EGenreRequete.SOAP) {
      const lEntetesHttp = this.descriptionRequete.getEntetesHttp();
      for (
        let lIndice = 0, lTaille = lEntetesHttp.length;
        lIndice < lTaille;
        lIndice++
      ) {
        const lEntete = lEntetesHttp[lIndice];
        this.moteurAjax.definirEnteteHTTP(lEntete.nom, lEntete.valeur);
      }
    }
    this.moteurAjax.envoyerRequete(this.donnees);
  }
  methodeCallback(aReponse) {
    if (this.pere && this.evenement) {
      this.evenement.call(this.pere, aReponse);
    }
  }
}
exports.RequeteAjax = RequeteAjax;
