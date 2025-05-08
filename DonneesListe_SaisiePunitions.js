const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
  TypeEtatRealisationPunitionUtil,
} = require("TypeEtatRealisationPunition.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
class DonneesListe_SaisiePunitions extends ObjetDonneesListe {
  constructor(aDonnees, aAutorisations) {
    super(aDonnees);
    this._autorisations = aAutorisations;
    this.setOptions({
      avecContenuTronque: true,
      avecEvnt_Selection: true,
      avecEvnt_Creation: true,
      avecEvnt_ApresSuppression: true,
      hauteurMinCellule: 26,
    });
  }
  avecEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SaisiePunitions.colonnes.date:
        return this._autorisations.saisie && !aParams.article.estLieIncident;
      case DonneesListe_SaisiePunitions.colonnes.motif:
        return this._autorisations.saisie && !aParams.article.estLieIncident;
      case DonneesListe_SaisiePunitions.colonnes.dossier:
        return (
          this._autorisations.saisie &&
          this._autorisations.avecPublicationDossier &&
          aParams.article.avecDossier
        );
      case DonneesListe_SaisiePunitions.colonnes.publication:
        return (
          this._autorisations.saisie &&
          this._autorisations.avecPublicationPunitions
        );
    }
    return false;
  }
  getCouleurCellule(aParams) {
    if (this._autorisations.saisie) {
      switch (aParams.idColonne) {
        case DonneesListe_SaisiePunitions.colonnes.nature:
          return ObjetDonneesListe.ECouleurCellule.Blanc;
        case DonneesListe_SaisiePunitions.colonnes.etat:
          if (
            !aParams.article.typesEtatPunition ||
            aParams.article.typesEtatPunition.count() === 0
          ) {
            return ObjetDonneesListe.ECouleurCellule.Blanc;
          }
          break;
      }
    }
  }
  avecEvenementEdition(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SaisiePunitions.colonnes.motif:
        return this._autorisations.saisie && !aParams.article.estLieIncident;
      case DonneesListe_SaisiePunitions.colonnes.publication:
        return this._autorisations.saisie;
    }
    return false;
  }
  avecSuppression() {
    return this._autorisations.saisie;
  }
  suppressionImpossible(D) {
    return !this._autorisations.saisie || !D.userEstProprietaire;
  }
  getMessageSuppressionImpossible() {
    return GTraductions.getValeur("punition.suppressionImpossible");
  }
  getMessageSuppressionConfirmation() {
    return GTraductions.getValeur("punition.suppressionConfirmation");
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SaisiePunitions.colonnes.date:
        return ObjetDonneesListe.ETypeCellule.DateCalendrier;
      case DonneesListe_SaisiePunitions.colonnes.etat:
        return ObjetDonneesListe.ETypeCellule.Image;
      case DonneesListe_SaisiePunitions.colonnes.dossier:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_SaisiePunitions.colonnes.publication:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_SaisiePunitions.colonnes.date:
        return aParams.article.dateDemande || "";
      case DonneesListe_SaisiePunitions.colonnes.nature:
        return !!aParams.article.nature
          ? aParams.article.nature.getLibelle()
          : "";
      case DonneesListe_SaisiePunitions.colonnes.motif:
        return !!aParams.article.motifs
          ? aParams.article.motifs.getTableauLibelles().join(", ")
          : "";
      case DonneesListe_SaisiePunitions.colonnes.etat:
        return TypeEtatRealisationPunitionUtil.getClassImage(
          aParams.article.typesEtatPunition,
        );
      case DonneesListe_SaisiePunitions.colonnes.dossier:
        return !!aParams.article.publicationDossier;
      case DonneesListe_SaisiePunitions.colonnes.publication:
        return (
          '<i class="' +
          ObjetUtilitaireAbsence.getClassesIconePublicationPunition(
            aParams.article.datePublication,
          ) +
          '"></i>'
        );
    }
    return "";
  }
  getClassCelluleConteneur(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_SaisiePunitions.colonnes.publication:
        lClasses.push("AlignementMilieu");
        break;
    }
    return lClasses.join(" ");
  }
  getHintForce(aParams) {
    if (aParams.idColonne === DonneesListe_SaisiePunitions.colonnes.etat) {
      return aParams.article.hintRealisation;
    }
    return "";
  }
  surEdition(aParams, aValeur) {
    switch (aParams.idColonne) {
      case DonneesListe_SaisiePunitions.colonnes.date:
        if (GDate.estDateValide(aValeur)) {
          aParams.article.dateDemande = aValeur;
        }
        break;
      case DonneesListe_SaisiePunitions.colonnes.dossier:
        aParams.article.publicationDossier = aValeur;
        break;
    }
  }
  initialiserObjetGraphique(aParams, aInstance) {
    let lDateDernier = GParametres.DerniereDate;
    for (let i = 0; i < aParams.article.programmations.count(); i++) {
      const lProg = aParams.article.programmations.get(i);
      if (
        lProg.dateExecution &&
        GDate.estAvantJour(lProg.dateExecution, lDateDernier)
      ) {
        lDateDernier = lProg.dateExecution;
      }
      if (
        lProg.dateRealisation &&
        GDate.estAvantJour(lProg.dateRealisation, lDateDernier)
      ) {
        lDateDernier = lProg.dateRealisation;
      }
      if (
        lProg.report &&
        lProg.report.existe() &&
        lProg.report.dateExecution &&
        GDate.estAvantJour(lProg.report.dateRealisation, lDateDernier)
      ) {
        lDateDernier = lProg.report.dateRealisation;
      }
    }
    aInstance.setParametres(
      GParametres.PremierLundi,
      GParametres.PremiereDate,
      lDateDernier,
      GParametres.JoursOuvres,
      null,
      GParametres.JoursFeries,
      false,
    );
  }
  setDonneesObjetGraphique(aParams, aInstance) {
    aInstance.setDonnees(aParams.article.dateDemande);
  }
  remplirMenuContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (aParametres.avecCreation) {
      aParametres.menuContextuel.addCommande(
        EGenreCommandeMenu.Creation,
        GTraductions.getValeur("liste.creer"),
        !aParametres.nonEditable,
      );
    }
    aParametres.menuContextuel.addCommande(
      EGenreCommandeMenu.Suppression,
      GTraductions.getValeur("liste.supprimer"),
      !aParametres.nonEditable &&
        aParametres.avecSuppression &&
        this._avecSuppression(aParametres),
    );
  }
}
DonneesListe_SaisiePunitions.colonnes = {
  date: "DL_SaisiePunition_date",
  nature: "DL_SaisiePunition_nature",
  motif: "DL_SaisiePunition_motif",
  etat: "DL_SaisiePunition_etat",
  dossier: "DL_SaisiePunition_dossier",
  publication: "DL_SaisiePunition_publication",
};
module.exports = { DonneesListe_SaisiePunitions };
