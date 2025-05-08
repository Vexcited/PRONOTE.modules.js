const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_SuiviResultatsCompEleve extends ObjetDonneesListe {
  constructor(aDonnees, aParams = {}) {
    super(aDonnees);
    this.optionsAffichage = {
      avecJaugeCliquable: !!aParams.avecJaugeCliquable,
      afficheJaugeChronologique: false,
    };
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecDeploiement: true,
      avecTri: false,
      avecEvnt_SelectionClick: this.optionsAffichage.avecJaugeCliquable,
    });
  }
  setOptionsAffichage(aOptionsAffichage) {
    Object.assign(this.optionsAffichage, aOptionsAffichage);
  }
  avecMenuContextuel() {
    return false;
  }
  getColonneDeFusion(aParams) {
    if (aParams.article.estUnDeploiement) {
      if (
        aParams.article.getGenre() === EGenreRessource.Palier ||
        aParams.article.getGenre() === EGenreRessource.Pilier
      ) {
        return DonneesListe_SuiviResultatsCompEleve.colonnes.libelle;
      }
    }
    return null;
  }
  getTypeValeur() {
    return ObjetDonneesListe.ETypeCellule.Html;
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_SuiviResultatsCompEleve.colonnes.libelle:
        if (aParams.article.estUnDeploiement) {
          lClasses.push("AvecMain");
        }
        break;
      case DonneesListe_SuiviResultatsCompEleve.colonnes.jauge:
        if (this.optionsAffichage.avecJaugeCliquable) {
          lClasses.push("AvecMain");
        }
        break;
    }
    return lClasses.join(" ");
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne ===
      DonneesListe_SuiviResultatsCompEleve.colonnes.libelle
    );
  }
  avecImageSurColonneDeploiement(aParams) {
    return (
      aParams.idColonne ===
      DonneesListe_SuiviResultatsCompEleve.colonnes.libelle
    );
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SuiviResultatsCompEleve.colonnes.libelle:
        return aParams.article.getLibelle();
      case DonneesListe_SuiviResultatsCompEleve.colonnes.jauge: {
        let lJauge = "";
        if (this.optionsAffichage.afficheJaugeChronologique) {
          lJauge = TUtilitaireCompetences.composeJaugeChronologique({
            listeNiveaux: aParams.article.listeNiveaux,
            hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
              aParams.article.listeNiveaux,
            ),
          });
        } else {
          lJauge = TUtilitaireCompetences.composeJaugeParNiveaux({
            listeNiveaux: aParams.article.listeNiveauxParNiveau,
            hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
              aParams.article.listeNiveauxParNiveau,
            ),
          });
        }
        return lJauge;
      }
    }
    return "";
  }
  getCouleurCellule(aParams) {
    if (!!aParams.article) {
      switch (aParams.article.getGenre()) {
        case EGenreRessource.Palier:
        case EGenreRessource.Pilier:
          return GCouleur.liste.cumul[0];
        case EGenreRessource.ElementPilier:
          return GCouleur.liste.cumul[1];
        case EGenreRessource.Competence:
        case EGenreRessource.SousItem:
          return GCouleur.liste.cumul[2];
      }
    }
    return null;
  }
  getIndentationCellule(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_SuiviResultatsCompEleve.colonnes.libelle
    ) {
      return this.getIndentationCelluleSelonParente(aParams);
    }
    return 0;
  }
}
DonneesListe_SuiviResultatsCompEleve.colonnes = {
  libelle: "DLSuiviCpt_libelle",
  jauge: "DLSuiviCpt_jauge",
};
module.exports = { DonneesListe_SuiviResultatsCompEleve };
