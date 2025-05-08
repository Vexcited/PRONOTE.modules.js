const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
class ObjetFenetre_ConfSaisieAbsenceCours extends ObjetFenetre {
  constructor(...aParams) {
    super(...aParams);
    this.setOptionsFenetre({
      largeur: 350,
      titre: GTraductions.getValeur("AbsenceVS.SelectionColonnes"),
      listeBoutons: [GTraductions.getValeur("principal.fermer")],
      avecTailleSelonContenu: true,
    });
  }
  surValidation(aNumeroBouton) {
    this.fermer();
    this.callback.appel(aNumeroBouton);
  }
  construireInstances() {
    this.identListeColonnesSupp = this.add(
      ObjetListe,
      _evenementSurListeColonnesSupp.bind(this),
      _initialiserListeColonnesSupp,
    );
  }
  composeContenu() {
    const H = [];
    H.push(
      '<div id="',
      this.getInstance(this.identListeColonnesSupp).getNom(),
      '"></div>',
    );
    return H.join("");
  }
  setDonnees(aListeColonne) {
    this.afficher();
    const lListeColonnes = aListeColonne.getListeElements((aElement) => {
      return (
        aElement.Genre === EGenreRessource.Observation &&
        aElement.genreObservation === TypeGenreObservationVS.OVS_Autres
      );
    });
    this.getInstance(this.identListeColonnesSupp).setDonnees(
      new DonneesListe_ConfSaisieAbsenceCours(lListeColonnes),
    );
  }
}
function _initialiserListeColonnesSupp(aInstance) {
  const lColonnes = [];
  lColonnes.push({
    id: DonneesListe_ConfSaisieAbsenceCours.colonnes.coche,
    taille: 25,
  });
  lColonnes.push({
    id: DonneesListe_ConfSaisieAbsenceCours.colonnes.libelle,
    taille: "100%",
  });
  aInstance.setOptionsListe({
    colonnes: lColonnes,
    hauteurAdapteContenu: true,
    hauteurMaxAdapteContenu: 500,
  });
}
function _evenementSurListeColonnesSupp(aParametres) {
  this.setBoutonActif(
    1,
    aParametres.genreEvenement === EGenreEvenementListe.Selection,
  );
}
class DonneesListe_ConfSaisieAbsenceCours extends ObjetDonneesListe {
  constructor(aDonnees) {
    super(aDonnees);
    this.setOptions({ avecSelection: false, avecSuppression: false });
  }
  avecEdition(aParams) {
    return (
      aParams.idColonne === DonneesListe_ConfSaisieAbsenceCours.colonnes.coche
    );
  }
  getCouleurCellule() {
    return ObjetDonneesListe.ECouleurCellule.Blanc;
  }
  getColonneTransfertEdition() {
    return DonneesListe_ConfSaisieAbsenceCours.colonnes.coche;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_ConfSaisieAbsenceCours.colonnes.coche:
        aParams.article.Actif = V;
        aParams.article.setEtat(EGenreEtat.Modification);
        break;
    }
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ConfSaisieAbsenceCours.colonnes.coche:
        return !!aParams.article.Actif;
      case DonneesListe_ConfSaisieAbsenceCours.colonnes.libelle:
        return aParams.article.getLibelle();
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ConfSaisieAbsenceCours.colonnes.coche:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
}
DonneesListe_ConfSaisieAbsenceCours.colonnes = {
  coche: "DL_ConfSaisieAbsenceCours_coche",
  libelle: "DL_ConfSaisieAbsenceCours__libelle",
};
module.exports = { ObjetFenetre_ConfSaisieAbsenceCours };
