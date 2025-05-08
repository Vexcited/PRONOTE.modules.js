exports.CommandeSaisieCompetencesGrilles =
  exports.ObjetRequeteSaisieCompetencesGrilles = void 0;
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Ressource_1 = require("Enumere_Ressource");
class ObjetRequeteSaisieCompetencesGrilles extends ObjetRequeteJSON_1.ObjetRequeteSaisie {
  constructor(...aParams) {
    super(...aParams);
    const lApplicationSco = GApplication;
    this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
  }
  lancerRequete(aParams) {
    this.JSON = $.extend(
      {
        palier: !!aParams.palier
          ? aParams.palier
          : this.etatUtilisateurSco.Navigation.getRessource(
              Enumere_Ressource_1.EGenreRessource.Palier,
            ),
        commande: "",
        genreReferentiel: "",
      },
      aParams,
    );
    if (aParams.referentiel) {
      this.JSON.referentiel = aParams.referentiel.toJSON();
      this.JSON.referentiel.estLVE = aParams.referentiel.estLVE;
    }
    if (aParams.listeClasses) {
      this.JSON.listeClasses = aParams.listeClasses.getListeElements((D) => {
        return D.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression;
      });
      this.JSON.listeClasses.setSerialisateurJSON({
        ignorerEtatsElements: true,
      });
    }
    if (aParams.referentiels) {
      this.JSON.referentiels.setSerialisateurJSON({
        methodeSerialisation: function (aReferentiel, aJSON) {
          if (aReferentiel.estLVE !== undefined) {
            aJSON.estLVE = aReferentiel.estLVE;
          }
        },
        ignorerEtatsElements: true,
      });
    }
    if (aParams.elementsCompetence) {
      this.JSON.elementsCompetence.setSerialisateurJSON({
        methodeSerialisation: function (aElementCompetence, aJSON) {
          if (aElementCompetence.evaluableEditable) {
            aJSON.evaluable = aElementCompetence.evaluable;
          }
          if (
            aElementCompetence.coefficient &&
            aElementCompetence.coefficientEditable
          ) {
            aJSON.coefficient = aElementCompetence.coefficient;
          }
          if (aElementCompetence.libelleBulletin) {
            aJSON.libelleBulletin = aElementCompetence.libelleBulletin;
          }
          if (aElementCompetence.pere) {
            aJSON.pere = aElementCompetence.pere;
          }
          if (aElementCompetence.listeRestrictionsNiveaux) {
            aJSON.listeRestrictionsNiveaux =
              aElementCompetence.listeRestrictionsNiveaux;
          }
        },
        ignorerEtatsElements: true,
      });
    }
    return this.appelAsynchrone();
  }
  actionApresRequete(aGenreReponse) {
    this.callbackReussite.appel(
      this.JSONRapportSaisie,
      this.JSONReponse,
      aGenreReponse,
    );
  }
}
exports.ObjetRequeteSaisieCompetencesGrilles =
  ObjetRequeteSaisieCompetencesGrilles;
CollectionRequetes_1.Requetes.inscrire(
  "SaisieCompetencesGrilles",
  ObjetRequeteSaisieCompetencesGrilles,
);
const CommandeSaisieCompetencesGrilles = {
  saisieClasses: "saisieClasses",
  saisieReferentiel: "saisieReferentiel",
  suppressionReferentiel: "suppressionReferentiel",
  creationRelationReferentiel: "creationRelationReferentiel",
  suppressionRelationReferentiel: "suppressionRelationReferentiel",
  creationElementsCompetence: "creationElementsCompetence",
  editionElementsCompetenceLibelle: "editionElementsCompetenceLibelle",
  editionElementsCompetenceNivEquivalence:
    "editionElementsCompetenceNivEquivalence",
  editionElementsCompetenceLibelleBulletin:
    "editionElementsCompetenceLibelleBulletin",
  editionElementsCompetenceCoefficient: "editionElementsCompetenceCoefficient",
  editionElementsCompetenceEvaluable: "editionElementsCompetenceEvaluable",
  suppressionElementsCompetence: "suppressionElementsCompetence",
  saisieDomainesDuSocleAssocie: "saisieDomainesDuSocleAssocie",
  saisieElementSignifiant: "saisieElementSignifiant",
  saisieRestrictionsNiveaux: "saisieRestrictionsNiveaux",
  echOrdreReferentiels: "echangerOrdreReferentiels",
  echOrdreElementsCompetence: "echangerOrdreElementsCompetence",
  collerElementsCompetence: "collerElementsCompetence",
  collerGrille: "collerGrille",
  saisieParametrageGrille: "saisieParametrageGrille",
  saisieElementCompetenceApprentissage: "saisieElementCompetenceApprentissage",
};
exports.CommandeSaisieCompetencesGrilles = CommandeSaisieCompetencesGrilles;
