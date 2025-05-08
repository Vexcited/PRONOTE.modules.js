exports.DonneesListe_SelectionDomaineCompetence = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_SelectionDomaineCompetence extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aListeDomaines, aParams) {
    super(aListeDomaines);
    this.setOptions({
      avecEvnt_Selection: true,
      avecEvnt_Suppression: true,
      avecMultiSelection: true,
      avecEtatSaisie: false,
    });
    this.droits = {
      edition: aParams ? aParams.avecEdition || false : false,
      suppression: aParams ? aParams.avecSuppression || false : false,
    };
  }
  avecMenuContextuel() {
    return false;
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectionDomaineCompetence.colonnes.coche:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_SelectionDomaineCompetence.colonnes.libelle:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_SelectionDomaineCompetence.colonnes.lve:
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
  }
  avecTrimSurEdition() {
    return true;
  }
  avecEvenementApresCreation() {
    return true;
  }
  surCreation(D, V) {
    const lLibelle = !!V[0] ? V[0].trim() : "";
    if (lLibelle.length > 0) {
      D.Libelle = lLibelle;
      D.libelleEditable = true;
      D.lveEditable = true;
      D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
    }
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectionDomaineCompetence.colonnes.coche:
        return true;
      case DonneesListe_SelectionDomaineCompetence.colonnes.libelle:
        if (this.droits.edition === true) {
          return aParams.article.libelleEditable === true;
        }
        return false;
      case DonneesListe_SelectionDomaineCompetence.colonnes.lve:
        if (this.droits.edition === true) {
          return aParams.article.lveEditable === true;
        }
        return false;
    }
    return false;
  }
  avecEvenementApresEdition(aParams) {
    return (
      aParams.idColonne !==
      DonneesListe_SelectionDomaineCompetence.colonnes.coche
    );
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectionDomaineCompetence.colonnes.coche:
        aParams.article.selectionne = !!V;
        break;
      case DonneesListe_SelectionDomaineCompetence.colonnes.libelle:
        aParams.article.setLibelle(V.trim());
        break;
      case DonneesListe_SelectionDomaineCompetence.colonnes.lve:
        aParams.article.estLVE = V;
        break;
    }
  }
  avecSuppression() {
    return this.droits.suppression;
  }
  getLibelleDraggable(aParams) {
    return aParams.article.getLibelle();
  }
  avecInterruptionSuppression() {
    return true;
  }
  suppressionConfirmation() {
    return false;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SelectionDomaineCompetence.colonnes.coche:
        return !!aParams.article.selectionne;
      case DonneesListe_SelectionDomaineCompetence.colonnes.libelle:
        return aParams.article.getLibelle();
      case DonneesListe_SelectionDomaineCompetence.colonnes.lve:
        return !!aParams.article.estLVE;
    }
    return "";
  }
}
exports.DonneesListe_SelectionDomaineCompetence =
  DonneesListe_SelectionDomaineCompetence;
DonneesListe_SelectionDomaineCompetence.colonnes = {
  coche: "selectDomaine_coche",
  libelle: "selectDomaine_libelle",
  lve: "selectDomaine_lve",
};
