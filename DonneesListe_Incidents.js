const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const {
  TypeGenreStatutProtagonisteIncident,
} = require("TypeGenreStatutProtagonisteIncident.js");
class DonneesListe_Incidents extends ObjetDonneesListe {
  constructor(
    aDonnees,
    aUniquementMesIncidents,
    aAvecSaisie,
    aUniquementNonRegle,
  ) {
    super(aDonnees);
    this.uniquementMesIncidents = aUniquementMesIncidents;
    this.uniquementNonRegle = aUniquementNonRegle;
    this.avecSaisieVise = [
      EGenreEspace.Administrateur,
      EGenreEspace.PrimDirection,
    ].includes(GEtatUtilisateur.GenreEspace);
    this._avecSaisie = aAvecSaisie;
    this.setOptions({
      avecEvnt_Selection: true,
      avecEvnt_Creation: true,
      avecEvnt_ApresSuppression: true,
      avecContenuTronque: true,
    });
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.date:
        return aParams.article.avecEditDate;
      case DonneesListe_Incidents.colonnes.heure:
        return false;
      case DonneesListe_Incidents.colonnes.motifs:
        return aParams.article.avecEditMotifs;
      case DonneesListe_Incidents.colonnes.lieu:
        return aParams.article.avecEditLieu;
      case DonneesListe_Incidents.colonnes.details:
        return aParams.article.avecEditDescription;
      case DonneesListe_Incidents.colonnes.vise:
        return (
          (this.avecSaisieVise && !aParams.article.estRA) ||
          aParams.article.avecEditVise
        );
      case DonneesListe_Incidents.colonnes.regle:
        return aParams.article.avecEditRA;
      case DonneesListe_Incidents.colonnes.faitDeViolence:
        return aParams.article.avecEditFaitDeViolence;
    }
    return false;
  }
  autoriserChaineVideSurEdition(aParams) {
    return aParams.idColonne === DonneesListe_Incidents.colonnes.details;
  }
  getCouleurCellule(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.heure:
        return aParams.article.avecEditHeure
          ? ObjetDonneesListe.ECouleurCellule.Blanc
          : null;
    }
    return null;
  }
  avecEvenementEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.motifs:
        return aParams.article.avecEditMotifs;
      case DonneesListe_Incidents.colonnes.lieu:
        return aParams.article.avecEditLieu;
    }
    return false;
  }
  avecEvenementApresEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.date:
        return aParams.article.avecEditDate;
      case DonneesListe_Incidents.colonnes.heure:
        return false;
      case DonneesListe_Incidents.colonnes.details:
        return aParams.article.avecEditDescription;
      case DonneesListe_Incidents.colonnes.vise:
        return this.avecSaisieVise && !aParams.article.estRA;
      case DonneesListe_Incidents.colonnes.regle:
        return aParams.article.avecEditRA;
    }
    return false;
  }
  getValeur(aParams) {
    const lArr = [];
    let lListe;
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.date:
        return aParams.article.dateheure;
      case DonneesListe_Incidents.colonnes.heure:
        return this._avecSaisie && aParams.article.avecEditHeure
          ? '<input type="time" ie-model="inputTime(\'' +
              aParams.article.getNumero() +
              "', " +
              aParams.article.Etat +
              ')" class="browser-default" />'
          : GDate.formatDate(aParams.article.dateheure, "%hh : %mm");
      case DonneesListe_Incidents.colonnes.motifs:
        return aParams.article.listeMotifs.getTableauLibelles().join(", ");
      case DonneesListe_Incidents.colonnes.lieu:
        return aParams.article.lieu ? aParams.article.lieu.getLibelle() : "";
      case DonneesListe_Incidents.colonnes.details:
        return aParams.article.getLibelle();
      case DonneesListe_Incidents.colonnes.auteurs:
        lListe = aParams.article.protagonistes.getListeElements((aElement) => {
          return (
            aElement.Genre === TypeGenreStatutProtagonisteIncident.GSP_Auteur &&
            aElement.existe()
          );
        });
        lListe.parcourir((aElement) => {
          if (aElement && aElement.protagoniste) {
            lArr.push(aElement.protagoniste.getLibelle());
          }
        });
        return lArr.join(", ");
      case DonneesListe_Incidents.colonnes.victimes:
        lListe = aParams.article.protagonistes.getListeElements((aElement) => {
          return (
            aElement.Genre ===
              TypeGenreStatutProtagonisteIncident.GSP_Victime &&
            aElement.existe()
          );
        });
        lListe.parcourir((aElement) => {
          if (aElement && aElement.protagoniste) {
            lArr.push(aElement.protagoniste.getLibelle());
          }
        });
        return lArr.join(", ");
      case DonneesListe_Incidents.colonnes.temoins:
        lListe = aParams.article.protagonistes.getListeElements((aElement) => {
          return (
            aElement.Genre === TypeGenreStatutProtagonisteIncident.GSP_Temoin &&
            aElement.existe()
          );
        });
        lListe.parcourir((aElement) => {
          if (aElement && aElement.protagoniste) {
            lArr.push(aElement.protagoniste.getLibelle());
          }
        });
        return lArr.join(", ");
      case DonneesListe_Incidents.colonnes.vise:
        return aParams.article.estVise;
      case DonneesListe_Incidents.colonnes.regle:
        return aParams.article.estRA;
      case DonneesListe_Incidents.colonnes.faitDeViolence:
        return aParams.article.faitDeViolence;
      case DonneesListe_Incidents.colonnes.actionsEnvisagees:
        return !!aParams.article.actionsEnvisagees
          ? aParams.article.actionsEnvisagees.getTableauLibelles().join(", ")
          : "";
      case DonneesListe_Incidents.colonnes.gravite:
        return aParams.article.gravite + "/5";
      case DonneesListe_Incidents.colonnes.rapporteur:
        return aParams.article.rapporteur.getLibelle();
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.date:
        return ObjetDonneesListe.ETypeCellule.DateCalendrier;
      case DonneesListe_Incidents.colonnes.heure:
        return aParams.article && aParams.article.avecEditHeure
          ? ObjetDonneesListe.ETypeCellule.Html
          : ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_Incidents.colonnes.vise:
      case DonneesListe_Incidents.colonnes.regle:
      case DonneesListe_Incidents.colonnes.faitDeViolence:
        return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  initialiserObjetGraphique(aParams, aInstance) {
    aInstance.setParametres(
      GParametres.PremierLundi,
      GParametres.PremiereDate,
      GParametres.DerniereDate,
      null,
      null,
      null,
    );
  }
  setDonneesObjetGraphique(aParams, aInstance) {
    aInstance.setDonnees(aParams.article.dateheure);
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_Incidents.colonnes.date:
        if (GDate.estDateValide(V)) {
          const lDate = new Date(
            V.getFullYear(),
            V.getMonth(),
            V.getDate(),
            aParams.article.dateheure.getHours(),
            aParams.article.dateheure.getMinutes(),
          );
          aParams.article.dateheure = lDate;
        }
        break;
      case DonneesListe_Incidents.colonnes.details:
        aParams.article.Libelle = V;
        break;
      case DonneesListe_Incidents.colonnes.vise:
        aParams.article.estVise = V;
        break;
      case DonneesListe_Incidents.colonnes.regle:
        aParams.article.estRA = V;
        break;
      case DonneesListe_Incidents.colonnes.faitDeViolence:
        aParams.article.faitDeViolence = V;
        break;
      default:
        break;
    }
  }
  getVisible(aArticle) {
    return (
      (!this.uniquementNonRegle || !aArticle.estRA) &&
      (!this.uniquementMesIncidents || aArticle.estRapporteur)
    );
  }
  avecSuppression(aParams) {
    return this._avecSaisie && aParams.article.estEditable;
  }
  getLibelleDraggable(aParams) {
    return GTraductions.getValeur("incidents.IncidentDu", [
      GDate.formatDate(aParams.article.dateheure, "%JJ/%MM/%AAAA"),
    ]);
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (this._avecSaisie) {
      aParametres.menuContextuel.addCommande(
        EGenreCommandeMenu.Suppression,
        GTraductions.getValeur("liste.supprimer"),
        this.avecSuppression(aParametres) && !aParametres.nonEditable,
      );
    }
    aParametres.menuContextuel.setDonnees();
  }
}
DonneesListe_Incidents.colonnes = {
  date: "0",
  heure: "1",
  motifs: "2",
  lieu: "3",
  details: "4",
  auteurs: "5",
  victimes: "6",
  temoins: "7",
  vise: "8",
  regle: "9",
  faitDeViolence: "10",
  actionsEnvisagees: "11",
  rapporteur: "12",
  gravite: "13",
};
module.exports = { DonneesListe_Incidents };
