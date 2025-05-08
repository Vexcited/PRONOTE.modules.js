const { EGenreTriElement } = require("Enumere_TriElement.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjectCouleurCellule } = require("_ObjetCouleur.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
class DonneesListe_ServicesProfesseur extends ObjetDonneesListe {
  constructor(aDonnees, aParam) {
    if (!!aDonnees) {
      aDonnees.parcourir((D) => {
        let lCoeffEstEditable = false;
        if (
          !!D.estService &&
          !D.estRattache &&
          !_estServiceRattacheApparaissantCommeService(D) &&
          !D.avecPlusieursCoefficients
        ) {
          lCoeffEstEditable = true;
        }
        D.coefficientEstEditable = lCoeffEstEditable;
        if (_estServiceRattacheApparaissantCommeSousService(D) && !!D.pere) {
          D.pere.coefficientEstEditable = false;
        }
      });
    }
    super(aDonnees);
    this.avecCreerSousServices = aParam.avecCreerSousServices;
    this.callbackCreerSousService = aParam.callbackCreerSousService;
    this.callbackSupprimerSousService = aParam.callbackSupprimerSousService;
    this.callbackCreerDevoirDNL = aParam.callbackCreerDevoirDNL;
    this.estAvecEdition = aParam.avecEdition || false;
    this.setOptions({
      avecEtatSaisie: false,
      avecDeploiement: true,
      avecEvnt_Selection: true,
      avecEvnt_Suppression: true,
    });
  }
  avecEdition(aParams) {
    if (this.estAvecEdition) {
      switch (aParams.idColonne) {
        case DonneesListe_ServicesProfesseur.colonnes.facultatif:
          return (
            !!aParams.article.estService &&
            !_estServiceRattacheApparaissantCommeSousService(aParams.article)
          );
        case DonneesListe_ServicesProfesseur.colonnes.coefficient:
          return (
            !!aParams.article.coefficient &&
            !!aParams.article.coefficientEstEditable &&
            !aParams.article.estSansNote &&
            !!GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Periode,
            ) &&
            GEtatUtilisateur.Navigation.getRessource(
              EGenreRessource.Periode,
            ).existeNumero()
          );
      }
    }
    return false;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_ServicesProfesseur.colonnes.facultatif:
        aParams.article.facultatif = V;
        break;
      case DonneesListe_ServicesProfesseur.colonnes.coefficient:
        aParams.article.coefficient = V;
        break;
    }
  }
  avecEvenementApresEdition(aParams) {
    return this.avecEdition(aParams);
  }
  getOptionsNote() {
    return {
      afficherAvecVirgule: true,
      sansNotePossible: false,
      avecAnnotation: false,
    };
  }
  avecSuppression(aParams) {
    return _estSupprimable(aParams.article);
  }
  avecInterruptionSuppression() {
    return true;
  }
  suppressionConfirmation() {
    return false;
  }
  avecEvenementSelectionDblClick(aParams) {
    if (
      aParams.idColonne ===
      DonneesListe_ServicesProfesseur.colonnes.programmesBO
    ) {
      return (
        !!aParams.article.liensProgrammesBO &&
        aParams.article.liensProgrammesBO.count() > 0
      );
    }
    return false;
  }
  avecImageSurColonneDeploiement(aParams) {
    return (
      aParams.idColonne === DonneesListe_ServicesProfesseur.colonnes.matiere
    );
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne === DonneesListe_ServicesProfesseur.colonnes.matiere
    );
  }
  getClass(aParams) {
    const lClasses = [];
    switch (aParams.idColonne) {
      case DonneesListe_ServicesProfesseur.colonnes.matiere:
        if (!!aParams.article.pere) {
          lClasses.push("EspaceGauche10");
        }
        break;
      case DonneesListe_ServicesProfesseur.colonnes.professeur:
        if (
          !aParams.article.estService ||
          aParams.article.estEnCoEnseignement === true
        ) {
          if (!aParams.article.estService) {
            if (_leSousServiceMAppartient(aParams.article)) {
              lClasses.push("Gras");
            }
          } else if (aParams.article.estEnCoEnseignement === true) {
            if (aParams.article.estResponsable === true) {
              lClasses.push("Gras");
            }
          }
        } else {
          lClasses.push("Gras");
        }
        break;
      case DonneesListe_ServicesProfesseur.colonnes.nbDevoirs:
      case DonneesListe_ServicesProfesseur.colonnes.nbEvaluations:
      case DonneesListe_ServicesProfesseur.colonnes.volume:
      case DonneesListe_ServicesProfesseur.colonnes.coefficient:
        lClasses.push("AlignementDroit");
        break;
      case DonneesListe_ServicesProfesseur.colonnes.programmesBO:
        lClasses.push("AlignementMilieu");
        if (
          !!aParams.article.liensProgrammesBO &&
          aParams.article.liensProgrammesBO.count() > 0
        ) {
          lClasses.push("AvecMain");
        }
        break;
    }
    return lClasses.join(" ");
  }
  getCouleurCellule(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ServicesProfesseur.colonnes.matiere:
        return aParams.article.pere
          ? ObjetDonneesListe.ECouleurCellule.Blanc
          : new ObjectCouleurCellule(
              GCouleur.themeCouleur.claire,
              GCouleur.noir,
              GCouleur.grisFonce,
            );
      case DonneesListe_ServicesProfesseur.colonnes.classe:
      case DonneesListe_ServicesProfesseur.colonnes.professeur:
        return new ObjectCouleurCellule(
          GCouleur.themeCouleur.claire,
          GCouleur.noir,
          GCouleur.grisFonce,
        );
      case DonneesListe_ServicesProfesseur.colonnes.programmesBO:
        if (
          !!aParams.article.liensProgrammesBO &&
          aParams.article.liensProgrammesBO.count() > 0
        ) {
          return ObjetDonneesListe.ECouleurCellule.Blanc;
        }
    }
  }
  getTri(aCol, aGenreTri) {
    function _triProf(D) {
      const lProfesseur = D.listeProfesseurs.getPremierElement();
      return !!lProfesseur ? lProfesseur.getPosition() : 0;
    }
    const lTableau = [],
      lGenreTri = aGenreTri;
    const lThis = this;
    switch (this.getId(aCol)) {
      case DonneesListe_ServicesProfesseur.colonnes.matiere:
        lTableau.push(ObjetTri.init("Libelle", aGenreTri));
        break;
      case DonneesListe_ServicesProfesseur.colonnes.professeur:
        lTableau.push(ObjetTri.init(_triProf, lGenreTri));
        break;
      case DonneesListe_ServicesProfesseur.colonnes.nbDevoirs:
        lTableau.push(
          ObjetTri.init(
            (D) => {
              return D.nbrDevoirsPeriode || -1;
            },
            lGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        lTableau.push(
          ObjetTri.init(
            (D) => {
              return D.nbrDevoirsTotal || -1;
            },
            lGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        break;
      case DonneesListe_ServicesProfesseur.colonnes.nbEvaluations:
        lTableau.push(
          ObjetTri.init(
            (D) => {
              return D.nbrEvaluationsPeriode || -1;
            },
            lGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        lTableau.push(
          ObjetTri.init(
            (D) => {
              return D.nbrEvaluationsTotal || -1;
            },
            lGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        break;
      case DonneesListe_ServicesProfesseur.colonnes.volume:
      case DonneesListe_ServicesProfesseur.colonnes.facultatif:
      case DonneesListe_ServicesProfesseur.colonnes.DNL:
      case DonneesListe_ServicesProfesseur.colonnes.modeDEvaluation:
        lTableau.push(
          ObjetTri.init(
            (D) => {
              const lParams = { idColonne: aCol, article: D };
              return lThis.getValeur(lParams);
            },
            lGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        break;
      case DonneesListe_ServicesProfesseur.colonnes.coefficient:
        lTableau.push(
          ObjetTri.init(
            (D) => {
              if (D.avecPlusieursCoefficients) {
                return 1;
              }
              if (!!D.coefficient) {
                if (D.coefficient.estUneValeur()) {
                  return D.coefficient.getValeur();
                }
                return D.coefficient.getGenre();
              }
              return "";
            },
            lGenreTri === EGenreTriElement.Croissant
              ? EGenreTriElement.Decroissant
              : EGenreTriElement.Croissant,
          ),
        );
        break;
      case DonneesListe_ServicesProfesseur.colonnes.classe:
      case DonneesListe_ServicesProfesseur.colonnes.periodes:
        lTableau.push(
          ObjetTri.init((D) => {
            const lParams = { idColonne: aCol, article: D };
            return lThis.getValeur(lParams);
          }, lGenreTri),
        );
        break;
    }
    return ObjetTri.initRecursif(
      "pere",
      lTableau.concat([
        ObjetTri.init("Libelle"),
        ObjetTri.init((D) => {
          const lIdColonne = lThis.getNumeroColonneDId(
            DonneesListe_ServicesProfesseur.colonnes.classe,
          );
          const lParams = { idColonne: lIdColonne, article: D };
          return lThis.getValeur(lParams);
        }),
        ObjetTri.init(_triProf),
        ObjetTri.init((D) => {
          return D.getNumero();
        }),
      ]),
    );
  }
  avecContenuTronque(aParams) {
    return (
      aParams.idColonne === DonneesListe_ServicesProfesseur.colonnes.periodes
    );
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ServicesProfesseur.colonnes.matiere: {
        const lTableauMatiere = [];
        lTableauMatiere.push(
          '<div class="InlineBlock AlignementMilieuVertical">',
          aParams.article.matiere.getLibelle(),
          "</div>",
        );
        if (aParams.article.estEnCoEnseignement) {
          lTableauMatiere.push(
            '<i class="icon_co_enseignement" style="float:right; font-size: 1.4rem;" title="',
            GTraductions.getValeur(
              "servicesProfesseur.HintServiceCoEnseignement",
            ),
            '"></i>',
          );
        }
        return lTableauMatiere.join("");
      }
      case DonneesListe_ServicesProfesseur.colonnes.classe: {
        let lClasse = aParams.article.classe.getLibelle();
        if (aParams.article.groupe && aParams.article.groupe.getLibelle()) {
          if (lClasse) {
            lClasse += " > ";
          }
          lClasse += aParams.article.groupe.getLibelle();
        }
        const lTableauClasses = [];
        lTableauClasses.push(lClasse);
        if (_estServiceRattacheApparaissantCommeService(aParams.article)) {
          lTableauClasses.push(
            '<div style="float:right;" class="Image_Trombone"></div>',
          );
        }
        return lTableauClasses.join("");
      }
      case DonneesListe_ServicesProfesseur.colonnes.professeur:
        return aParams.article.listeProfesseurs.getTableauLibelles().join(", ");
      case DonneesListe_ServicesProfesseur.colonnes.facultatif:
        return aParams.article.estService && aParams.article.facultatif;
      case DonneesListe_ServicesProfesseur.colonnes.modeDEvaluation:
        if (aParams.article.estSansNote === undefined) {
          return "";
        }
        return !aParams.article.estSansNote
          ? GTraductions.getValeur("servicesProfesseur.Service_Avec_Notes")
          : GTraductions.getValeur("servicesProfesseur.Service_Sans_Notes");
      case DonneesListe_ServicesProfesseur.colonnes.nbDevoirs: {
        let lNbDevoirs = "";
        if (aParams.article.nbrDevoirsTotal) {
          lNbDevoirs =
            (aParams.article.nbrDevoirsPeriode
              ? aParams.article.nbrDevoirsPeriode
              : 0) +
            "/" +
            aParams.article.nbrDevoirsTotal;
        }
        return lNbDevoirs;
      }
      case DonneesListe_ServicesProfesseur.colonnes.nbEvaluations: {
        let lNbEvaluations = "";
        if (aParams.article.nbrEvaluationsTotal) {
          lNbEvaluations =
            (aParams.article.nbrEvaluationsPeriode
              ? aParams.article.nbrEvaluationsPeriode
              : 0) +
            "/" +
            aParams.article.nbrEvaluationsTotal;
        }
        return lNbEvaluations;
      }
      case DonneesListe_ServicesProfesseur.colonnes.volume:
        return aParams.article.strVolumeHoraire;
      case DonneesListe_ServicesProfesseur.colonnes.coefficient: {
        let result = "";
        if (
          !_estServiceRattacheApparaissantCommeService(aParams.article) &&
          ((!aParams.article.pere && !aParams.article.estSansNote) ||
            (!!aParams.article.pere && !aParams.article.pere.estSansNote))
        ) {
          if (aParams.article.avecPlusieursCoefficients) {
            result = "x,xx";
          } else if (
            !!aParams.article.coefficient &&
            !aParams.article.coefficient.estUneNoteVide()
          ) {
            result = aParams.article.coefficient;
          }
        }
        return result;
      }
      case DonneesListe_ServicesProfesseur.colonnes.periodes: {
        let lPeriode = "";
        const lPeriodesActives =
          aParams.article.periodesActives.getListeElements((aElement) => {
            if (aElement.active) {
              return aElement.active;
            }
          });
        const nbPeriodesActives = lPeriodesActives.count();
        if (nbPeriodesActives === 0) {
          lPeriode = GTraductions.getValeur("servicesProfesseur.Aucune");
        } else if (
          nbPeriodesActives === aParams.article.periodesActives.count()
        ) {
          lPeriode = GTraductions.getValeur("servicesProfesseur.Toutes");
        } else {
          lPeriode = lPeriodesActives.getTableauLibelles().join(", ");
        }
        return lPeriode;
      }
      case DonneesListe_ServicesProfesseur.colonnes.programmesBO:
        return !!aParams.article.liensProgrammesBO &&
          aParams.article.liensProgrammesBO.count() > 0
          ? '<i class="icon_eye_open i-medium" role="img" aria-label="' +
              GTraductions.getValeur("servicesProfesseur.VoirProgrammesBO") +
              '"></i>'
          : "";
      case DonneesListe_ServicesProfesseur.colonnes.DNL:
        return !!aParams.article.estServiceDNL;
    }
    return "";
  }
  getTypeValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_ServicesProfesseur.colonnes.facultatif:
      case DonneesListe_ServicesProfesseur.colonnes.DNL:
        return ObjetDonneesListe.ETypeCellule.Coche;
      case DonneesListe_ServicesProfesseur.colonnes.coefficient:
        if (!!aParams.article && aParams.article.avecPlusieursCoefficients) {
          return ObjetDonneesListe.ETypeCellule.Texte;
        }
        return ObjetDonneesListe.ETypeCellule.Note;
      case DonneesListe_ServicesProfesseur.colonnes.matiere:
        return ObjetDonneesListe.ETypeCellule.Html;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  avecMenuContextuel(aParams) {
    return !aParams.surFondListe;
  }
  remplirMenuContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (!aParametres.article.pere && this.avecCreerSousServices) {
      aParametres.menuContextuel.addCommande(
        DonneesListe_ServicesProfesseur.genreAction.creer_sous_service,
        GTraductions.getValeur("servicesProfesseur.CommandeCreerSousService"),
        true,
      );
    }
    if (
      !aParametres.article.pere &&
      aParametres.article.avecCreationDevoirDNL &&
      !GApplication.droits.get(TypeDroits.estEnConsultation)
    ) {
      aParametres.menuContextuel.addCommande(
        DonneesListe_ServicesProfesseur.genreAction.creer_devoir_DNL,
        GTraductions.getValeur("servicesProfesseur.CommandeCreerDevoirDNL"),
        true,
      );
    }
    if (
      !!aParametres.article.pere &&
      aParametres.article.pere.estEnCoEnseignement !== true
    ) {
      const lSupprimerSsServicePossible = _estSupprimable(aParametres.article);
      aParametres.menuContextuel.addCommande(
        DonneesListe_ServicesProfesseur.genreAction.supprimer_sous_service,
        GTraductions.getValeur(
          "servicesProfesseur.CommandeSupprimerSousService",
        ),
        lSupprimerSsServicePossible,
      );
    }
  }
  evenementMenuContextuel(aParametres) {
    switch (aParametres.numeroMenu) {
      case DonneesListe_ServicesProfesseur.genreAction.creer_sous_service:
        this.callbackCreerSousService(aParametres.article);
        break;
      case DonneesListe_ServicesProfesseur.genreAction.supprimer_sous_service:
        this.callbackSupprimerSousService(aParametres.article);
        aParametres.avecActualisation = false;
        break;
      case DonneesListe_ServicesProfesseur.genreAction.creer_devoir_DNL: {
        const lThis = this;
        GApplication.getMessage().afficher({
          type: EGenreBoiteMessage.Confirmation,
          titre: GTraductions.getValeur(
            "servicesProfesseur.CreerDevoirDNL.TitreConf",
          ),
          message: GTraductions.getValeur(
            "servicesProfesseur.CreerDevoirDNL.MessageConf",
            aParametres.article.nomPeriodeDNL,
          ),
          callback: function (aGenreAction) {
            if (aGenreAction === EGenreAction.Valider) {
              lThis.callbackCreerDevoirDNL(aParametres.article);
            }
          },
        });
        break;
      }
      default:
    }
  }
}
DonneesListe_ServicesProfesseur.colonnes = {
  matiere: "servicesProfesseurMatiere",
  classe: "servicesProfesseurClasse",
  professeur: "servicesProfesseurProfesseur",
  facultatif: "servicesProfesseurFacultatif",
  modeDEvaluation: "servicesProfesseurModeDEvaluation",
  nbDevoirs: "servicesProfesseurNbDevoirs",
  nbEvaluations: "servicesProfesseurNbEvaluations",
  volume: "servicesProfesseurVolume",
  coefficient: "servicesProfesseurCoefficient",
  periodes: "servicesProfesseurPeriodes",
  programmesBO: "servicesProfesseurBO",
  DNL: "servicesProfesseurDNL",
};
DonneesListe_ServicesProfesseur.genreAction = {
  creer_sous_service: "creerSousService",
  supprimer_sous_service: "supprimerSousService",
  creer_devoir_DNL: "creerDevoirDNL",
};
function _leSousServiceMAppartient(D) {
  let result = false;
  if (D.listeProfesseurs) {
    result = !!D.listeProfesseurs.getElementParNumero(
      GEtatUtilisateur.getUtilisateur().getNumero(),
    );
  }
  return result;
}
function _estSupprimable(D) {
  if (
    !D.estService &&
    !_estSousServiceDUnServiceRattacheApparaissantCommeSousService(D)
  ) {
    return (
      !!D.pere &&
      D.pere.estEnCoEnseignement !== true &&
      _leSousServiceMAppartient(D)
    );
  }
  return false;
}
function _estServiceRattacheApparaissantCommeService(D) {
  return (
    D.estService === true &&
    D.estRattache === true &&
    D.estServicePartie === false
  );
}
function _estServiceRattacheApparaissantCommeSousService(D) {
  return (
    D.estService === true &&
    D.estRattache === true &&
    D.estServicePartie === true
  );
}
function _estSousServiceDUnServiceRattacheApparaissantCommeSousService(D) {
  return D.estService === false && D.estServicePartie === true;
}
module.exports = { DonneesListe_ServicesProfesseur };
