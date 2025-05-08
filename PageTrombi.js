const { ObjetIdentite_Mobile } = require("ObjetIdentite_Mobile.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { DonneesListe_Trombi } = require("DonneesListe_Trombi.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListe } = require("ObjetListe.js");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve.js");
class ObjetTrombi extends ObjetIdentite_Mobile {
  constructor(...aParams) {
    super(...aParams);
    this.instanceListe = Identite.creerInstance(ObjetListe, {
      pere: this,
      evenement: _evntSurListe.bind(this),
    });
    initOptions.call(this, this.instanceListe);
    this.donnees = [];
  }
  setDonnees(aListeRessourcesPourPhotos, aAvecTotal) {
    this.donnees.listeEleves = aListeRessourcesPourPhotos;
    this.avecTotal =
      aAvecTotal !== null && aAvecTotal !== undefined ? aAvecTotal : false;
    this.actualiserListe();
  }
  construireAffichage() {
    const H = [];
    H.push(
      '<div class="PetitEspace full-height" id="',
      this.instanceListe.getNom(),
      '"></div>',
    );
    return H.join("");
  }
  actualiserListe() {
    this.instanceListe.setDonnees(
      new DonneesListe_Trombi(this.donnees.listeEleves),
    );
  }
}
function initOptions(aInstance) {
  aInstance.setOptionsListe({
    skin: ObjetListe.skin.flatDesign,
    nonEditable: true,
    scrollHorizontal: false,
    avecModeAccessible: true,
  });
}
function _evntSurListe(aParametres) {
  switch (aParametres.genreEvenement) {
    case EGenreEvenementListe.SelectionClick:
      _afficherFicheEleve.call(this, aParametres.article.getNumero());
      break;
  }
}
function _afficherFicheEleve(aNumeroEleve) {
  let lEleve;
  if (!!this.donnees.listeEleves) {
    lEleve = this.donnees.listeEleves.getElementParNumero(aNumeroEleve);
  }
  if (!!lEleve) {
    ObjetFenetre_FicheEleve.ouvrir({
      instance: this,
      avecRequeteDonnees: true,
      donnees: { eleve: lEleve, listeEleves: this.donnees.listeEleves },
    });
  }
}
module.exports = ObjetTrombi;
