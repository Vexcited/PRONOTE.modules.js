exports.DonneesListe_DetailAbsences = void 0;
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class DonneesListe_DetailAbsences extends ObjetDonneesListe_1.ObjetDonneesListe {
  constructor(aCours, aEleve, aDonnees, aGenreRessource, aAvecARObservation) {
    super(aDonnees);
    this.cours = aCours;
    this.eleve = aEleve;
    this.genreRessource = aGenreRessource;
    this.avecARObservation = aAvecARObservation;
    this.setOptions({
      avecSelection: false,
      avecEdition: false,
      avecSuppression: false,
      avecDeploiement: true,
    });
  }
  fusionCelluleAvecColonnePrecedente(aParams) {
    if (this.cours) {
      return aParams.article.estUnDeploiement && aParams.colonne > 1;
    } else {
      return aParams.article.estUnDeploiement && aParams.colonne > 0;
    }
  }
  getNiveauDeploiement() {
    return 3;
  }
  getCouleurCellule(aParams) {
    if (aParams.article.estUnDeploiement) {
      return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
  }
  getStyle(aParams) {
    if (this.cours && aParams.article.absentAuDernierCours) {
      return "color:" + GCouleur.rouge + ";";
    }
  }
  getValeur(aParams) {
    switch (aParams.colonne) {
      case 0: {
        let lLibelle = "";
        if (!this.cours) {
          if (aParams.article.estUnDeploiement) {
            lLibelle = aParams.article.getLibelle();
          } else {
            lLibelle = this.eleve.getLibelle();
          }
        }
        return lLibelle;
      }
      case 1: {
        if (this.cours) {
          if (aParams.article.estUnDeploiement) {
            return aParams.article.getLibelle();
          } else if (
            this.genreRessource ===
            Enumere_Ressource_1.EGenreRessource.Infirmerie
          ) {
            return ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
              ObjetDate_1.GDate.formatDate(
                aParams.article.dateDebut,
                "%JJ/%MM/%AAAA",
              ),
            ]);
          } else if (aParams.article.dateDebut) {
            if (aParams.article.horsCours) {
              return ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
                ObjetDate_1.GDate.formatDate(
                  aParams.article.dateDebut,
                  "%JJ/%MM/%AAAA",
                ),
              ]);
            } else {
              return ObjetTraduction_1.GTraductions.getValeur(
                "Dates.LeDateDebutAHeureDebut",
                [
                  ObjetDate_1.GDate.formatDate(
                    aParams.article.dateDebut,
                    "%JJ/%MM/%AAAA",
                  ),
                  ObjetDate_1.GDate.formatDate(
                    aParams.article.dateDebut,
                    "%hh:%mm",
                  ),
                ],
              );
            }
          } else if (aParams.article.dateDemande) {
            return ObjetDate_1.GDate.formatDate(
              aParams.article.dateDemande,
              "%JJ/%MM/%AAAA",
            );
          } else {
            return ObjetTraduction_1.GTraductions.getValeur(
              "Dates.LeDateDebutAHeureDebut",
              [
                ObjetDate_1.GDate.formatDate(
                  ObjetDate_1.GDate.placeAnnuelleEnDate(
                    aParams.article.placeDebut,
                  ),
                  "%JJ/%MM/%AA",
                ),
                ObjetDate_1.GDate.formatDate(
                  ObjetDate_1.GDate.placeAnnuelleEnDate(
                    aParams.article.placeDebut,
                  ),
                  "%hh:%mm",
                ),
              ],
            );
          }
        } else {
          return ObjetTraduction_1.GTraductions.getValeur(
            "Dates.DuDateDebutAuDateFin",
            [
              ObjetDate_1.GDate.formatDate(
                ObjetDate_1.GDate.placeAnnuelleEnDate(
                  aParams.article.placeDebut,
                ),
                "%JJ/%MM/%AA %hh:%mm",
              ),
              ObjetDate_1.GDate.formatDate(
                ObjetDate_1.GDate.placeAnnuelleEnDate(
                  aParams.article.placeFin,
                  true,
                ),
                "%JJ/%MM/%AA %hh:%mm",
              ),
            ],
          );
        }
      }
      case 2: {
        if (this.cours) {
          if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Absence
          ) {
            return ObjetDate_1.GDate.formatDureeEnMillisecondes(
              ObjetDate_1.GDate.nombrePlacesEnMillisecondes(
                aParams.article.placesManquees,
              ),
              "%xh%sh%mm",
            );
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Retard
          ) {
            return (
              aParams.article.duree +
              " " +
              ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.minutes")
            );
          } else if (
            this.genreRessource ===
            Enumere_Ressource_1.EGenreRessource.Infirmerie
          ) {
            return ObjetDate_1.GDate.formatDate(
              aParams.article.dateDebut,
              "%hh%sh%mm",
            );
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Punition
          ) {
            return aParams.article.nature.getLibelle();
          } else if (
            this.genreRessource ===
            Enumere_Ressource_1.EGenreRessource.Exclusion
          ) {
            return (
              (this._getCouleurMotif(aParams.article)
                ? '<span style="background-color:' +
                  this._getCouleurMotif(aParams.article) +
                  ';">&nbsp;&nbsp;</span>&nbsp;'
                : "") + aParams.article.listeMotifs.getTableauLibelles()
            );
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Dispense
          ) {
            return ObjetDate_1.GDate.formatDureeEnMillisecondes(
              ObjetDate_1.GDate.nombrePlacesEnMillisecondes(
                aParams.article.placesManquees,
              ),
              "%xh%sh%mm",
            );
          } else if (
            this.genreRessource ===
            Enumere_Ressource_1.EGenreRessource.Observation
          ) {
            return aParams.article.observation;
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Sanction
          ) {
            return aParams.article.strMotifs;
          }
        } else {
          return (
            (this._getCouleurMotif(aParams.article)
              ? '<span style="background-color:' +
                this._getCouleurMotif(aParams.article) +
                ';">&nbsp;&nbsp;</span>&nbsp;'
              : "") +
            (aParams.article.motif ? aParams.article.motif.getLibelle() : "")
          );
        }
        break;
      }
      case 3: {
        if (this.cours) {
          if (
            this.genreRessource ===
              Enumere_Ressource_1.EGenreRessource.Absence ||
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Retard
          ) {
            return (
              (this._getCouleurMotif(aParams.article)
                ? '<span style="background-color:' +
                  this._getCouleurMotif(aParams.article) +
                  ';">&nbsp;&nbsp;</span>&nbsp;'
                : "") + this._getLibelleMotif(aParams.article)
            );
          } else if (
            this.genreRessource ===
            Enumere_Ressource_1.EGenreRessource.Infirmerie
          ) {
            return ObjetDate_1.GDate.formatDate(
              aParams.article.dateFin,
              "%hh%sh%mm",
            );
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Punition
          ) {
            return aParams.article.demandeur
              ? aParams.article.demandeur.getLibelle()
              : "";
          } else if (
            this.genreRessource ===
            Enumere_Ressource_1.EGenreRessource.Exclusion
          ) {
            return aParams.article.demandeur
              ? aParams.article.demandeur.getLibelle()
              : "";
          } else if (
            this.genreRessource ===
              Enumere_Ressource_1.EGenreRessource.Observation &&
            this.avecARObservation
          ) {
            return ObjetDate_1.GDate.formatDate(
              aParams.article.dateVisu,
              "%JJ/%MM/%AAAA",
            );
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Dispense
          ) {
            return aParams.article.observation;
          } else if (
            this.genreRessource === Enumere_Ressource_1.EGenreRessource.Sanction
          ) {
            return aParams.article.strDemandeur || "";
          }
        }
        break;
      }
      case 4: {
        if (
          this.genreRessource === Enumere_Ressource_1.EGenreRessource.Absence ||
          this.genreRessource === Enumere_Ressource_1.EGenreRessource.Retard
        ) {
          return aParams.article.reglee;
        } else if (
          this.cours &&
          this.genreRessource === Enumere_Ressource_1.EGenreRessource.Sanction
        ) {
          return aParams.article.strDuree;
        }
        return "";
      }
    }
    return "";
  }
  getTypeValeur(aParams) {
    if (this.cours) {
      if (aParams.colonne === 0 && aParams.article.estUnDeploiement) {
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule
          .CocheDeploiement;
      } else if (
        (this.genreRessource === Enumere_Ressource_1.EGenreRessource.Absence ||
          this.genreRessource === Enumere_Ressource_1.EGenreRessource.Retard) &&
        aParams.colonne === 3 &&
        this._getCouleurMotif(aParams.article)
      ) {
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      } else if (
        (this.genreRessource === Enumere_Ressource_1.EGenreRessource.Absence ||
          this.genreRessource === Enumere_Ressource_1.EGenreRessource.Retard) &&
        aParams.colonne === 4
      ) {
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
      } else if (
        this.genreRessource === Enumere_Ressource_1.EGenreRessource.Exclusion &&
        aParams.colonne === 2 &&
        this._getCouleurMotif(aParams.article)
      ) {
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      }
    } else {
      if (aParams.colonne === 2 && this._getCouleurMotif(aParams.article)) {
        return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
      }
    }
    return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
  }
  getTri() {
    return [
      ObjetTri_1.ObjetTri.init((D) => {
        let lEstHorsCours = !!D.pere
          ? "horsCours" in D.pere
            ? D.pere.horsCours
            : undefined
          : D.horsCours;
        return lEstHorsCours || D.sansDemandeur;
      }, Enumere_TriElement_1.EGenreTriElement.Decroissant),
      ObjetTri_1.ObjetTri.init("Libelle"),
      ObjetTri_1.ObjetTri.init(
        "estUnDeploiement",
        Enumere_TriElement_1.EGenreTriElement.Decroissant,
      ),
      ObjetTri_1.ObjetTri.init(
        "placeDebut",
        Enumere_TriElement_1.EGenreTriElement.Decroissant,
      ),
    ];
  }
  _getLibelleMotif(D) {
    if (D.listeMotifs) {
      return D.listeMotifs.getTableauLibelles().join(",");
    }
    if (D.motif) {
      return D.motif.getLibelle();
    }
    return "";
  }
  _getCouleurMotif(D) {
    if (D.listeMotifs && D.listeMotifs.count() === 1) {
      return D.listeMotifs.get(0).couleur;
    }
    if (D.motif) {
      return D.motif.couleur;
    }
    return null;
  }
}
exports.DonneesListe_DetailAbsences = DonneesListe_DetailAbsences;
