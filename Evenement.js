exports.Evenement = void 0;
const Enumere_CategorieEvenement_1 = require("Enumere_CategorieEvenement");
const Enumere_Statut_1 = require("Enumere_Statut");
class Evenement {
  constructor(
    aStatut = Enumere_Statut_1.EStatut.information,
    aCategorie = Enumere_CategorieEvenement_1.ECategorieEvenement.trace,
    aUnite,
    aMethode,
    aMessage,
    aObjetDetail,
  ) {
    this.statut = aStatut;
    this.categorie = aCategorie;
    this.unite = aUnite || "";
    this.methode = aMethode || "";
    this.message = aMessage || "";
    this.detail = aObjetDetail || null;
  }
  toString() {
    return (
      "[" +
      this.toStringStatut() +
      "]" +
      "[" +
      this.toStringCategorie() +
      "]  " +
      this.unite +
      " - " +
      this.methode +
      "    :" +
      this.message
    );
  }
  getMessage() {
    return this.message;
  }
  getCategorie() {
    return this.categorie;
  }
  getStatut() {
    return this.statut;
  }
  getDetail() {
    return this.detail;
  }
  setDetail(aDetail) {
    this.detail = aDetail;
  }
  isNonJournalisable() {
    return (
      this.detail !== null &&
      this.detail !== undefined &&
      this.detail.nonJournalisable
    );
  }
  toStringStatut() {
    switch (this.statut) {
      case Enumere_Statut_1.EStatut.erreur: {
        return "erreur       ";
      }
      case Enumere_Statut_1.EStatut.avertissement: {
        return "avertissement";
      }
      case Enumere_Statut_1.EStatut.information: {
        return "information  ";
      }
    }
    return "             ";
  }
  toStringCategorie() {
    switch (this.categorie) {
      case Enumere_CategorieEvenement_1.ECategorieEvenement
        .aideDeveloppementEtDebug: {
        return "aideDeveloppementEtDebug";
      }
      case Enumere_CategorieEvenement_1.ECategorieEvenement
        .navigationUtilisateur: {
        return "navigationUtilisateur   ";
      }
      case Enumere_CategorieEvenement_1.ECategorieEvenement.trace: {
        return "traces                  ";
      }
    }
    return "                        ";
  }
}
exports.Evenement = Evenement;
