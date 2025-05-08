const { ObjetRequeteConsultation } = require("ObjetRequeteJSON.js");
const { Requetes } = require("CollectionRequetes.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetDeserialiser } = require("ObjetDeserialiser.js");
class ObjetRequeteListeQCM extends ObjetRequeteConsultation {
  constructor(...aParams) {
    super(...aParams);
  }
  lancerRequete() {
    return this.appelAsynchrone();
  }
  actionApresRequete() {
    const lUtilitaireDeserialisation = new ObjetDeserialiser();
    const lListeQCM = new ObjetListeElements().fromJSON(
      this.JSONReponse.listeQCM,
      lUtilitaireDeserialisation._ajouterQCM.bind(lUtilitaireDeserialisation),
    );
    const lListeCategories = this.JSONReponse.listeCategories;
    const lListeServices = new ObjetListeElements().fromJSON(
      this.JSONReponse.listeServices,
      _ajouterServices,
    );
    const lListeClasses = new ObjetListeElements().fromJSON(
      this.JSONReponse.listeClasses,
      _ajouterClasses,
    );
    const lListeProfs = new ObjetListeElements().fromJSON(
      this.JSONReponse.listeProfs,
    );
    const lAvecServicesEvaluation = !!this.JSONReponse.avecServicesEvaluation;
    lListeQCM.parcourir((aElement) => {
      if (aElement.getGenre() === EGenreRessource.ExecutionQCM) {
        aElement.QCM = lListeQCM.getElementParNumero(aElement.QCM.getNumero());
      }
      if (aElement.getGenre() === EGenreRessource.ExecutionQCM) {
        aElement.estUnDeploiement = false;
        aElement.estDeploye = true;
        aElement.pere = aElement.QCM;
        if (
          aElement.estSupprimable === false &&
          aElement.QCM.estSupprimable !== false
        ) {
          aElement.QCM.estSupprimable = false;
          if (!!aElement.msgSuppression) {
            aElement.QCM.msgSuppression = aElement.msgSuppression;
          }
        }
      } else {
        aElement.estUnDeploiement = true;
        aElement.estDeploye = true;
        aElement.pere = null;
        aElement.nbExecution = lListeQCM
          .getListeElements((aEle) => {
            return aEle.QCM && aEle.QCM.getNumero() === aElement.getNumero();
          })
          .count();
        if (!!lListeCategories && !!aElement.categories) {
          const lNouvelleListe = new ObjetListeElements();
          aElement.categories.parcourir((aCategorieQCM) => {
            const lCategorieDeListeGlobale =
              lListeCategories.getElementParNumero(aCategorieQCM.getNumero());
            if (!!lCategorieDeListeGlobale) {
              lNouvelleListe.add(
                MethodesObjet.dupliquer(lCategorieDeListeGlobale),
              );
            }
          });
          aElement.categories = lNouvelleListe;
        }
      }
    });
    this.callbackReussite.appel(lListeQCM, {
      listeServices: lListeServices,
      listeClasses: lListeClasses,
      listeProfesseurs: lListeProfs,
      avecServicesEvaluation: lAvecServicesEvaluation,
      listeCategories: lListeCategories,
    });
  }
}
Requetes.inscrire("listeQCM", ObjetRequeteListeQCM);
function _ajouterServices(aJSON, aElement) {
  aElement.copieJSON(aJSON);
  const lListeProprietes = [
    "classe",
    "groupe",
    "matiere",
    "pere",
    "professeur",
  ];
  for (const x in lListeProprietes) {
    if (aJSON[lListeProprietes[x]]) {
      aElement[lListeProprietes[x]] = new ObjetElement().fromJSON(
        aJSON[lListeProprietes[x]],
      );
      aElement[lListeProprietes[x]].copieJSON(aJSON[lListeProprietes[x]]);
      if (aElement[lListeProprietes[x]].matiere) {
        aElement[lListeProprietes[x]].matiere = new ObjetElement().fromJSON(
          aJSON[lListeProprietes[x]].matiere,
        );
      }
      if (aElement[lListeProprietes[x]].listePeriodes) {
        aElement[lListeProprietes[x]].listePeriodes =
          new ObjetListeElements().fromJSON(
            aJSON[lListeProprietes[x]].listePeriodes,
          );
      }
    }
  }
  aElement.listePeriodes = new ObjetListeElements().fromJSON(
    aJSON.listePeriodes,
  );
  aElement.groupe.listeClasses = new ObjetListeElements().fromJSON(
    aJSON.groupe.listeClasses,
    _ajouterClasses,
  );
  if (aJSON.classe.service) {
    aElement.classe.service = new ObjetElement().fromJSON(aJSON.classe.service);
  }
}
function _ajouterClasses(aJSON, aElement) {
  aElement.copieJSON(aJSON);
  if (aJSON.service) {
    aElement.service = new ObjetElement().fromJSON(aJSON.service);
  }
  if (aJSON.periodeParDefaut) {
    aElement.periodeParDefaut = new ObjetElement().fromJSON(
      aJSON.periodeParDefaut,
    );
  }
  if (aJSON.listePeriodes) {
    aElement.listePeriodes = new ObjetListeElements().fromJSON(
      aJSON.listePeriodes,
      (aJSON, aElement) => {
        aElement.Actif = aJSON.actif;
      },
    );
    aElement.listePeriodes.addElement(
      new ObjetElement(GTraductions.getValeur("Aucune"), 0, 0),
    );
  }
}
module.exports = { ObjetRequeteListeQCM };
