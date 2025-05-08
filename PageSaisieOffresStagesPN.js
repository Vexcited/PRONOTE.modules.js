const { TypeDroits } = require("ObjetDroitsPN.js");
const { PageSaisieOffresStages } = require("PageSaisieOffresStages.js");
const {
  ObjetRequeteListeSujetsStages,
} = require("ObjetRequeteListeSujetsStages.js");
const {
  ObjetRequeteListeOffresStages,
} = require("ObjetRequeteListeOffresStages.js");
const {
  ObjetRequeteSaisieOffresStages,
} = require("ObjetRequeteSaisieOffresStages.js");
const { ObjetElement } = require("ObjetElement.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetSelecteurPJ } = require("ObjetSelecteurPJ.js");
class PageSaisieOffresStagesPN extends InterfacePage {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    this.identPage = this.add(
      PageSaisieOffresStages,
      _evntSaisieOffresStage.bind(this),
      _initSaisieOffresStage.bind(this),
    );
  }
  setParametresGeneraux() {
    this.avecBandeau = true;
    this.IdentZoneAlClient = this.identPage;
  }
  recupererDonnees() {
    new ObjetRequeteListeSujetsStages(
      this,
      this.actionSurRecupererListeSujetsDeStage,
    ).lancerRequete();
  }
  actionSurRecupererListeOffres(aParam) {
    this.listeEntreprises = aParam.listeEntreprises;
    this.entrepriseSelectionnee = this.listeEntreprises.get(0);
    const lEntreprise = new ObjetElement(
      "",
      this.entrepriseSelectionnee.getNumero(),
    );
    this.listeOffres = this.entrepriseSelectionnee.listeOffresStages;
    this.listeOffres.parcourir((aElement) => {
      aElement.entreprise = lEntreprise;
    });
    this.getInstance(this.identPage).setDonnees({
      listeOffres: this.listeOffres,
      listeSujets: this.listeSujets,
    });
  }
  actionSurRecupererListeSujetsDeStage(aParam) {
    this.listeSujets = aParam.listeSujetsStages;
    new ObjetRequeteListeOffresStages(
      this,
      this.actionSurRecupererListeOffres,
    ).lancerRequete();
  }
  lancerSaisie(aParam) {
    new ObjetRequeteSaisieOffresStages(
      this,
      _actionSurSaisie.bind(this),
    ).lancerRequete({ listeOffres: aParam.listeOffres });
  }
}
function _evntSaisieOffresStage(aParam) {
  this.lancerSaisie(aParam);
}
function _initSaisieOffresStage(aInstance) {
  aInstance.setOptions({
    avecMultipleEntreprisesAutorise: false,
    editionOffreStage: {
      avecPeriode: true,
      avecPeriodeUnique: false,
      avecSujetObjetSaisie: true,
      avecGestionPJ: false,
      tailleMaxPieceJointe: 0,
      avecEditionDocumentsJoints: false,
      genreRessourcePJ: -1,
      dureeParDefaut: 0,
    },
  });
  aInstance.setAutorisations({
    autoriserEditionToutesOffresStages: GApplication.droits.get(
      TypeDroits.stage.autoriserEditionToutesOffresStages,
    ),
  });
  aInstance.classSelecteurPJ = ObjetSelecteurPJ;
}
function _actionSurSaisie() {
  this.recupererDonnees();
}
module.exports = { PageSaisieOffresStagesPN };
