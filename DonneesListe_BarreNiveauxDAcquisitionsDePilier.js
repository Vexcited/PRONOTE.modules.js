const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreNiveauDAcquisition } = require("Enumere_NiveauDAcquisition.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_BarreNiveauxDAcquisitionsDePilier extends ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.parametres = Object.assign(
      { afficheJaugesChronologiques: false },
      aParams,
    );
    this.creerIndexUnique("Libelle");
    this.setOptions({
      avecCreation: false,
      avecEdition: false,
      avecSuppression: false,
    });
  }
  getVisible(D) {
    if (!this.parametres.afficheJaugesChronologiques) {
      let lResult = false;
      if (!!D.listeNiveaux) {
        D.listeNiveaux.parcourir((aNiveau) => {
          if (
            aNiveau.getGenre() !== EGenreNiveauDAcquisition.Absent &&
            aNiveau.getGenre() !== EGenreNiveauDAcquisition.NonEvalue
          ) {
            lResult = true;
            return false;
          }
        });
      }
      return lResult;
    }
    return true;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.jauge:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.domaine:
        return (
          aParams.article.getLibelle() ||
          GTraductions.getValeur(
            "Fenetre_BarreNiveauxDacquisitions.SansLienAvecLeDomaineDuSocle",
          )
        );
      case DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes.jauge:
        if (this.parametres.afficheJaugesChronologiques) {
          return TUtilitaireCompetences.composeJaugeChronologique({
            listeNiveaux: aParams.article.listeNiveauxChronologiques,
            hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
              aParams.article.listeNiveauxChronologiques,
            ),
          });
        } else {
          return TUtilitaireCompetences.composeJaugeParNiveaux({
            listeNiveaux: aParams.article.listeNiveaux,
            hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
              aParams.article.listeNiveaux,
            ),
          });
        }
    }
  }
}
DonneesListe_BarreNiveauxDAcquisitionsDePilier.colonnes = {
  domaine: "DLBarreNiv_domaine",
  jauge: "DLBarreNiv_jauge",
};
module.exports = { DonneesListe_BarreNiveauxDAcquisitionsDePilier };
