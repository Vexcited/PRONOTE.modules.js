const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { EStatut } = require("Enumere_Statut.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class DonneesListe_Competences extends ObjetDonneesListe {
  constructor(aDonnees, aParams) {
    super(aDonnees);
    this.avecSousItems = aParams.avecSousItems || false;
    this.pourCompetenceNumerique = aParams.pourCompetenceNumerique || false;
    this.setOptions({
      avecSelection: false,
      avecSuppression: false,
      avecEvnt_ApresEdition: true,
      avecEtatSaisie: false,
      avecDeploiement: true,
      avecTri: false,
    });
  }
  getIndentationCellule(aParams) {
    if (aParams.idColonne === DonneesListe_Competences.colonnes.libelle) {
      const lGenre = aParams.article.getGenre();
      if (lGenre === EGenreRessource.Competence) {
        return 10;
      } else if (lGenre === EGenreRessource.SousItem) {
        return 20;
      }
    }
    return 0;
  }
  avecDeploiementSurColonne(aParams) {
    return (
      aParams.idColonne !== DonneesListe_Competences.colonnes.coche &&
      aParams.idColonne !== DonneesListe_Competences.colonnes.nombre
    );
  }
  avecImageSurColonneDeploiement(aParams) {
    return aParams.idColonne === DonneesListe_Competences.colonnes.libelle;
  }
  getTypeValeur(aParams) {
    if (aParams.idColonne === DonneesListe_Competences.colonnes.coche) {
      return ObjetDonneesListe.ETypeCellule.Coche;
    }
    return ObjetDonneesListe.ETypeCellule.Texte;
  }
  getClass(aParams) {
    const lClasses = [];
    const lGenre = aParams.article.getGenre();
    if (
      lGenre === EGenreRessource.ElementPilier ||
      (lGenre === EGenreRessource.Competence && this.avecSousItems)
    ) {
      lClasses.push("Gras");
    }
    if (!!aParams.article.estUnDeploiement || _avecEditionSurSimpleClic()) {
      lClasses.push("AvecMain");
    }
    if (
      aParams.idColonne === DonneesListe_Competences.colonnes.domaines &&
      aParams.article.estListeDomainesHerites === true
    ) {
      lClasses.push("Italique");
    }
    return lClasses.join(" ");
  }
  avecEvenementSelectionClick(aParams) {
    if (
      _avecEditionSurSimpleClic() &&
      !!aParams.article &&
      LArticleEstConcernePourAjoutRelationsSurSimpleClic(
        aParams.article,
        this.avecSousItems,
      )
    ) {
      return (
        aParams.idColonne === DonneesListe_Competences.colonnes.libelle ||
        aParams.idColonne === DonneesListe_Competences.colonnes.domaines ||
        aParams.idColonne === DonneesListe_Competences.colonnes.niveauLVE
      );
    }
    return false;
  }
  ajouteOuSupprimeRelationsSurSelection(aParams, aCallbackApresEdition) {
    const lAjouteRelation = aParams.article.nombreRelations === 0;
    controleEditionEtSaisieElementCompetence.call(
      this,
      aParams,
      lAjouteRelation ? 1 : 0,
      aCallbackApresEdition,
    );
  }
  avecEdition(aParams) {
    let lAvecEdition = false;
    switch (aParams.idColonne) {
      case DonneesListe_Competences.colonnes.coche:
        lAvecEdition = this.pourCompetenceNumerique
          ? !aParams.article.estUnDeploiement
          : true;
        break;
      case DonneesListe_Competences.colonnes.nombre:
        lAvecEdition = aParams.article.nombreRelations > 0;
        break;
    }
    return lAvecEdition && aParams.article.getActif();
  }
  getControleCaracteresInput(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Competences.colonnes.nombre:
        return { mask: "0-9", tailleMax: 3 };
    }
    return null;
  }
  surEdition(aParams, V) {
    switch (aParams.idColonne) {
      case DonneesListe_Competences.colonnes.coche:
        controleEditionEtSaisieElementCompetence.call(this, aParams, V ? 1 : 0);
        break;
      case DonneesListe_Competences.colonnes.nombre:
        controleEditionEtSaisieElementCompetence.call(this, aParams, V);
        break;
    }
  }
  getEtatSurEdition() {
    return null;
  }
  getTableauLignesModifieesCocheTitre() {
    const T = [];
    if (this.Donnees) {
      const lAvecGestionSousItem = this.avecSousItems;
      this.Donnees.parcourir((D, aIndex) => {
        if (_LArticleEstConcerneePourCocheTitre(D, lAvecGestionSousItem)) {
          T.push(aIndex);
        }
      });
    }
    return T;
  }
  getEtatCocheSelonFils() {
    let lEtat;
    if (this.Donnees) {
      const lAvecGestionSousItem = this.avecSousItems;
      let lEstActif;
      this.Donnees.parcourir((D) => {
        if (_LArticleEstConcerneePourCocheTitre(D, lAvecGestionSousItem)) {
          lEstActif = D.nombreRelations > 0;
          if (lEtat === undefined) {
            lEtat = lEstActif
              ? ObjetDonneesListe.EGenreCoche.Verte
              : ObjetDonneesListe.EGenreCoche.Aucune;
          } else {
            if (
              (lEstActif && lEtat === ObjetDonneesListe.EGenreCoche.Aucune) ||
              (!lEstActif && lEtat === ObjetDonneesListe.EGenreCoche.Verte)
            ) {
              lEtat = ObjetDonneesListe.EGenreCoche.Grise;
              return false;
            }
          }
        }
      });
    }
    return lEtat === undefined ? ObjetDonneesListe.EGenreCoche.Aucune : lEtat;
  }
  surEditionCocheTitre(aListeParamsCellule, aValeur) {
    if (!!aListeParamsCellule) {
      const lNouveauNombreRelation = aValeur ? 1 : 0;
      const lListeArticles = [];
      for (let i = 0; i < aListeParamsCellule.length; i++) {
        lListeArticles.push(aListeParamsCellule[i].article);
      }
      let lAvecAvertissement = false;
      let lAvecTestParentsEnfants;
      let lControleEditionArticle;
      for (let j = 0; j < lListeArticles.length; j++) {
        lAvecTestParentsEnfants =
          lListeArticles[j].nombreRelations === 0 && aValeur;
        lControleEditionArticle =
          controleEditionElementCompetenceEtParentsEnfants.call(
            this,
            lListeArticles[j],
            lNouveauNombreRelation,
            lAvecTestParentsEnfants,
          );
        if (lControleEditionArticle !== EStatut.succes) {
          lAvecAvertissement = true;
          break;
        }
      }
      const lEffectueEditionTousArticles = function () {
        effectueEditionElementCompetence(
          lListeArticles,
          lNouveauNombreRelation,
        );
        for (let k = 0; k < lListeArticles.length; k++) {
          effectueEditionElementCompetence(
            getListeElementsCompetenceParentsEtEnfants.call(
              this,
              lListeArticles[k],
            ),
            0,
          );
        }
      };
      if (lAvecAvertissement) {
        return GApplication.getMessage()
          .afficher({
            type: EGenreBoiteMessage.Confirmation,
            message: GTraductions.getValeur(
              "competences.message.ConfirmationSuppression",
            ),
          })
          .then((AAccepte) => {
            if (AAccepte === EGenreAction.Valider) {
              lEffectueEditionTousArticles.call(this);
            }
          });
      } else {
        lEffectueEditionTousArticles.call(this);
      }
    }
  }
  getValeur(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Competences.colonnes.coche:
        return aParams.article.getActif()
          ? aParams.article.nombreRelations > 0
          : "";
      case DonneesListe_Competences.colonnes.nombre:
        return aParams.article.nombreRelations || "";
      case DonneesListe_Competences.colonnes.libelle: {
        const lLibelle = [aParams.article.getLibelle()];
        if (!!aParams.article.estUneActiviteLangagiere) {
          lLibelle.push('<span style="float: right">');
          lLibelle.push(
            TUtilitaireCompetences.construitInfoActiviteLangagiere({
              avecHint: true,
            }),
          );
          lLibelle.push("</span>");
        }
        return lLibelle.join("");
      }
      case DonneesListe_Competences.colonnes.domaines:
        return aParams.article.strListeDomaines || "";
      case DonneesListe_Competences.colonnes.niveauLVE:
        return aParams.article.nivEquivCE || "";
    }
    return "";
  }
  getHintForce(aParams) {
    switch (aParams.idColonne) {
      case DonneesListe_Competences.colonnes.libelle:
        return aParams.article.LibelleLong || "";
      case DonneesListe_Competences.colonnes.domaines:
        return aParams.article.hintListeDomaines || "";
    }
    return "";
  }
}
DonneesListe_Competences.colonnes = {
  coche: "competences_coche",
  nombre: "competences_nombre",
  libelle: "competences_libelle",
  niveauLVE: "competences_niveau_lve",
  domaines: "competences_domaines",
};
function _avecEditionSurSimpleClic() {
  return GEtatUtilisateur.pourPrimaire();
}
function LArticleEstConcernePourAjoutRelationsSurSimpleClic(
  aArticle,
  aAvecGestionSousItems,
) {
  let result = false;
  if (!!aArticle) {
    if (aAvecGestionSousItems) {
      result =
        aArticle.getGenre() === EGenreRessource.SousItem ||
        !aArticle.estUnDeploiement;
    } else {
      result = aArticle.getGenre() === EGenreRessource.Competence;
    }
  }
  return result;
}
function effectueEditionElementCompetence(
  aListeArticles,
  aNouveauNombreRelations,
) {
  aListeArticles.forEach((aArticle) => {
    aArticle.nombreRelations = aNouveauNombreRelations;
  });
}
function controleEditionElementCompetenceEtParentsEnfants(
  aArticle,
  aNouveauNombreRelations,
  aAvecTestParentsEnfants,
) {
  let result = controleEditionElementCompetence(
    aArticle,
    aNouveauNombreRelations,
  );
  if (result === EStatut.succes && aAvecTestParentsEnfants) {
    const lTabElementsParentsEtEnfants =
      getListeElementsCompetenceParentsEtEnfants.call(this, aArticle);
    for (let i = 0; i < lTabElementsParentsEtEnfants.length; i++) {
      const lControleEditionParentEnfant = controleEditionElementCompetence(
        lTabElementsParentsEtEnfants[i],
        0,
      );
      if (lControleEditionParentEnfant !== EStatut.succes) {
        result = lControleEditionParentEnfant;
        if (result === EStatut.erreur) {
          break;
        }
      }
    }
  }
  return result;
}
function controleEditionElementCompetence(aArticle, aNouveauNombreRelations) {
  let resultControle = EStatut.succes;
  if (aArticle.nombreRelations !== aNouveauNombreRelations) {
    if (aNouveauNombreRelations < aArticle.nombreRelations) {
      if (aNouveauNombreRelations < aArticle.nombreCompetencesEvaluees) {
        if (
          aNouveauNombreRelations === 0 ||
          aArticle.nombreCompetencesEvaluees === 1
        ) {
          resultControle = EStatut.avertissement;
        } else {
          resultControle = EStatut.erreur;
        }
      }
    }
  }
  return resultControle;
}
function getListeElementsCompetenceParentsEtEnfants(aArticle) {
  const result = [];
  let lPere = aArticle.pere;
  while (lPere) {
    result.push(lPere);
    lPere = lPere.pere;
  }
  const lParents = [aArticle];
  this.Donnees.parcourir((D) => {
    if (D.pere && lParents.includes(D.pere)) {
      result.push(D);
      lParents.push(D);
    }
  });
  return result;
}
function controleEditionEtSaisieElementCompetence(
  aParams,
  aNouveauNombreRelations,
  aCallbackApresEdition,
) {
  const lArticle = aParams.article;
  if (lArticle) {
    aNouveauNombreRelations = Math.min(
      100,
      Math.max(0, aNouveauNombreRelations),
    );
    const lSaisieSurParentsEtEnfants =
      lArticle.nombreRelations === 0 && aNouveauNombreRelations > 0;
    const lResultControleEdition =
      controleEditionElementCompetenceEtParentsEnfants.call(
        this,
        lArticle,
        aNouveauNombreRelations,
        lSaisieSurParentsEtEnfants,
      );
    if (lResultControleEdition === EStatut.succes) {
      effectueEditionElementCompetence([lArticle], aNouveauNombreRelations);
      if (lSaisieSurParentsEtEnfants) {
        effectueEditionElementCompetence(
          getListeElementsCompetenceParentsEtEnfants.call(this, lArticle),
          0,
        );
      }
      if (!!aCallbackApresEdition) {
        aCallbackApresEdition();
      }
    } else if (lResultControleEdition === EStatut.avertissement) {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Confirmation,
        message: GTraductions.getValeur(
          "competences.message.ConfirmationSuppression",
        ),
        callback: function (AAccepte) {
          if (AAccepte === EGenreAction.Valider) {
            effectueEditionElementCompetence(
              [lArticle],
              aNouveauNombreRelations,
            );
            if (lSaisieSurParentsEtEnfants) {
              effectueEditionElementCompetence(
                getListeElementsCompetenceParentsEtEnfants.call(this, lArticle),
                0,
              );
            }
            aParams.instance.actualiser(true, true);
            if (!!aCallbackApresEdition) {
              aCallbackApresEdition();
            }
          }
        }.bind(this),
      });
    } else {
      GApplication.getMessage().afficher({
        type: EGenreBoiteMessage.Information,
        message: GTraductions.getValeur(
          "competences.message.ModifNombreItemsImpossible",
          [lArticle.nombreCompetencesEvaluees],
        ),
      });
    }
  }
}
function _LArticleEstConcerneePourCocheTitre(aArticle, aAvecGestionSousItems) {
  return (
    !!aArticle &&
    (aArticle.pere ? aArticle.pere.estDeploye : true) &&
    ((aAvecGestionSousItems &&
      aArticle.getGenre() === EGenreRessource.SousItem) ||
      (!aAvecGestionSousItems &&
        aArticle.getGenre() === EGenreRessource.Competence))
  );
}
module.exports = { DonneesListe_Competences };
