const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const ETypeFiltreRepondus = { tous: 0, repondus: 1, nonRepondus: 2 };
class DonneesListe_ResultatsActualite extends ObjetDonneesListe {
  constructor(aParam, aUtilitaires) {
    super(aParam.donnees);
    this.pere = aParam.pere;
    this.evenement = aParam.evenement;
    this.genreActualite = aParam.genre;
    this.niveauMaxCumul = aParam.niveauMaxCumul;
    this.filtreRepondu = aParam.filtreRepondu;
    this.avecNombreReponses = aParam.avecNombreReponses || false;
    this.avecCommandeRenvoyerNotfication =
      aParam.avecCommandeRenvoyerNotfication;
    this.avecSeparationNomPrenom = aParam.avecSeparationNomPrenom;
    this.setOptions({
      avecEdition: false,
      avecSuppression: false,
      avecDeploiement: true,
      avecContenuTronque: true,
      avecSelection: !IE.estMobile,
    });
    this.utilitaires = aUtilitaires;
  }
  getTri() {
    return [
      ObjetTri.init((D) => {
        return D.Position;
      }),
    ];
  }
  getNiveauDeploiement(aParams) {
    if (aParams.article.estCumul) {
      return aParams.article.niveauCumul;
    } else {
      return this.niveauMaxCumul;
    }
  }
  getCouleurCellule(aParams) {
    if (aParams.article.estCumul) {
      return GCouleur.liste.cumul[aParams.article.niveauCumul];
    }
    return ObjetDonneesListe.ECouleurCellule.Blanc;
  }
  avecImageSurColonneDeploiement(aParams) {
    return (
      aParams.declarationColonne.genreColonne ===
      DonneesListe_ResultatsActualite.colonnes.destinataires
    );
  }
  fusionCelluleAvecColonnePrecedente(aParams) {
    return (
      this.avecSeparationNomPrenom &&
      !!aParams.article &&
      !!aParams.article.estCumul &&
      aParams.declarationColonne.genreColonne ===
        DonneesListe_ResultatsActualite.colonnes.prenom
    );
  }
  getValeur(aParams) {
    let lDonnee;
    switch (aParams.declarationColonne.genreColonne) {
      case DonneesListe_ResultatsActualite.colonnes.destinataires: {
        const lLibelle = [];
        if (!aParams.article.estCumul) {
          lLibelle.push("&nbsp;&nbsp;&nbsp;&nbsp;");
        }
        lLibelle.push(aParams.article.getLibelle());
        if (aParams.article.estCumul) {
          lLibelle.push(" : ");
          let lNbRepondues = aParams.article.nbRecue;
          let lNbTotal = aParams.article.nbAttendue;
          let lNbManquantes = lNbTotal - lNbRepondues;
          switch (this.filtreRepondu) {
            case ETypeFiltreRepondus.nonRepondus:
              lLibelle.push(
                GTraductions.getValeur(
                  lNbManquantes < 2
                    ? "infoSond.reponseManquanteSurNbTotal"
                    : "infoSond.reponsesManquantesSurNbTotal",
                  [lNbManquantes, lNbTotal],
                ),
              );
              break;
            default:
              lLibelle.push(
                GTraductions.getValeur(
                  lNbRepondues < 2
                    ? "infoSond.reponseSurNbTotal"
                    : "infoSond.reponsesSurNbTotal",
                  [lNbRepondues, lNbTotal],
                ),
              );
              break;
          }
        }
        return lLibelle.join("");
      }
      case DonneesListe_ResultatsActualite.colonnes.prenom: {
        if (!aParams.article.estCumul && !!aParams.article.prenom) {
          return aParams.article.prenom;
        }
        return "";
      }
      case DonneesListe_ResultatsActualite.colonnes.classe:
        return !!aParams.article.libelleClasse
          ? aParams.article.libelleClasse
          : "";
      case DonneesListe_ResultatsActualite.colonnes.reponse: {
        lDonnee = aParams.article.listeReponses.getElementParNumero(
          aParams.declarationColonne.numeroQuestion,
        );
        if (aParams.article.estCumul) {
          let lPourcentageRecue =
            lDonnee.pourcentageRecue ||
            Math.round((100 * lDonnee.nbRecue) / lDonnee.nbAttendue);
          let lTxtRecue = lPourcentageRecue + "%";
          if (this.avecNombreReponses) {
            lTxtRecue += " (" + lDonnee.nbRecue + ")";
          }
          return lTxtRecue;
        } else if (
          this.utilitaires.genreReponse.estGenreTextuelle(lDonnee.getGenre())
        ) {
          return lDonnee.texteReponse;
        } else {
          return lDonnee.repondu;
        }
      }
      case DonneesListe_ResultatsActualite.colonnes.choix:
        lDonnee = aParams.article.listeReponses.getElementParNumero(
          aParams.declarationColonne.numeroQuestion,
        );
        if (aParams.article.estCumul) {
          const lValeurChoix = aParams.declarationColonne.numeroChoix + 1;
          const lPercentReponsesPourChoix = lDonnee.percentCumul[lValeurChoix];
          let lTxtQuestion = lPercentReponsesPourChoix + "%";
          if (this.avecNombreReponses) {
            const lNbReponsesPourChoix = lDonnee.valeurCumul[lValeurChoix];
            lTxtQuestion +=
              " (" + (lDonnee.nbRecue ? lNbReponsesPourChoix : "0") + ")";
          }
          return lTxtQuestion;
        } else if (
          this.utilitaires.genreReponse.estGenreTextuelle(lDonnee.getGenre())
        ) {
          return false;
        } else {
          return lDonnee.domaineReponse.getValeur(
            aParams.declarationColonne.numeroChoix + 1,
          );
        }
    }
  }
  getTypeValeur(aParams) {
    switch (aParams.declarationColonne.genreColonne) {
      case DonneesListe_ResultatsActualite.colonnes.destinataires:
        return ObjetDonneesListe.ETypeCellule.Html;
      case DonneesListe_ResultatsActualite.colonnes.prenom:
        return ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_ResultatsActualite.colonnes.classe:
        return ObjetDonneesListe.ETypeCellule.Texte;
      case DonneesListe_ResultatsActualite.colonnes.reponse: {
        const lDonnee = aParams.article.listeReponses.getElementParNumero(
          aParams.declarationColonne.numeroQuestion,
        );
        if (
          aParams.article.estCumul ||
          this.utilitaires.genreReponse.estGenreTextuelle(lDonnee.getGenre())
        ) {
          return ObjetDonneesListe.ETypeCellule.Texte;
        } else {
          return ObjetDonneesListe.ETypeCellule.Coche;
        }
      }
      default:
        if (aParams.article.estCumul) {
          return ObjetDonneesListe.ETypeCellule.Texte;
        } else {
          return ObjetDonneesListe.ETypeCellule.Coche;
        }
    }
  }
  getHintForce(aParams) {
    switch (aParams.declarationColonne.genreColonne) {
      case DonneesListe_ResultatsActualite.colonnes.destinataires:
        if (!aParams.article.estCumul) {
          return aParams.article.getLibelle();
        }
        break;
      case DonneesListe_ResultatsActualite.colonnes.choix:
        if (!aParams.article.estCumul) {
          const lDonnee = aParams.article.listeReponses.getElementParNumero(
            aParams.declarationColonne.numeroQuestion,
          );
          const lEstCoche = lDonnee.domaineReponse.getValeur(
            aParams.declarationColonne.numeroChoix + 1,
          );
          if (
            lEstCoche &&
            !!aParams.declarationColonne.estChoixAutre &&
            !!lDonnee.texteReponse
          ) {
            return lDonnee.texteReponse;
          }
        }
        return "";
    }
  }
  getClass(aParams) {
    const lClasses = [];
    if (aParams.article.estCumul) {
      lClasses.push("Gras");
    }
    if (
      ![
        DonneesListe_ResultatsActualite.colonnes.destinataires,
        DonneesListe_ResultatsActualite.colonnes.prenom,
      ].includes(aParams.idColonne)
    ) {
      lClasses.push(IE.estMobile ? "AlignementDroit" : "AlignementMilieu");
    }
    return lClasses.join(" ");
  }
  getVisible(D) {
    switch (this.filtreRepondu) {
      case ETypeFiltreRepondus.repondus:
        return D.estCumul ? D.nbRecue > 0 : D.repondu;
      case ETypeFiltreRepondus.nonRepondus:
        return D.estCumul
          ? D.nbAttendue !== null &&
            D.nbAttendue !== undefined &&
            D.nbRecue !== null &&
            D.nbRecue !== undefined
            ? D.nbAttendue - D.nbRecue > 0
            : true
          : !D.repondu;
      case ETypeFiltreRepondus.tous:
        return true;
      default:
        return true;
    }
  }
  avecMenuContextuel(aParams) {
    return !aParams.surFondListe && aParams.article.listeReponses.count() === 1;
  }
  initialisationObjetContextuel(aParametres) {
    if (!aParametres.menuContextuel) {
      return;
    }
    if (aParametres.article.estCumul) {
      aParametres.menuContextuel.addCommande(
        DonneesListe_ResultatsActualite.genreCommande.graphique,
        GTraductions.getValeur("actualites.Edition.MenuGrapheCumul", [
          aParametres.article.getLibelle(),
        ]),
        !aParametres.nonEditable,
      );
      aParametres.menuContextuel.addCommande(
        DonneesListe_ResultatsActualite.genreCommande.graphiqueTotal,
        GTraductions.getValeur("actualites.Edition.MenuGrapheTotal"),
        !aParametres.nonEditable,
      );
    } else {
      aParametres.menuContextuel.addCommande(
        DonneesListe_ResultatsActualite.genreCommande.graphiqueTotal,
        GTraductions.getValeur("actualites.Edition.MenuGrapheTotal"),
        !aParametres.nonEditable,
      );
      if (this.avecCommandeRenvoyerNotfication) {
        let lCommandeRenvoyerEditable = !aParametres.nonEditable;
        if (lCommandeRenvoyerEditable) {
          if (aParametres.article && !aParametres.article.getNumero()) {
            lCommandeRenvoyerEditable = false;
          }
        }
        aParametres.menuContextuel.addCommande(
          DonneesListe_ResultatsActualite.genreCommande.renvoyerNotification,
          GTraductions.getValeur("actualites.Edition.menuRenvoyerNotification"),
          lCommandeRenvoyerEditable,
        );
      }
    }
    aParametres.menuContextuel.setDonnees();
  }
  evenementMenuContextuel(aParametres) {
    this.evenement.call(this.pere, aParametres.numeroMenu, aParametres.article);
  }
  avecBordureDroite() {
    return !this.utilitaires.genreReponse.estGenreAvecAR(this.genreActualite);
  }
}
DonneesListe_ResultatsActualite.genreCommande = {
  graphique: 0,
  graphiqueTotal: 1,
  supprimerReponse: 2,
  renvoyerNotification: 3,
};
DonneesListe_ResultatsActualite.colonnes = {
  destinataires: "destinataires",
  prenom: "prenom",
  classe: "classe",
  reponse: "reponse",
  choix: "choix",
};
module.exports = { ETypeFiltreRepondus, DonneesListe_ResultatsActualite };
