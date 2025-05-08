const { GHtml } = require("ObjetHtml.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
  _InterfaceCompetencesNumeriques,
} = require("_InterfaceCompetencesNumeriques.js");
const { EGenreMessage } = require("Enumere_Message.js");
const {
  ObjetRequeteCompetencesNumeriques,
} = require("ObjetRequeteCompetencesNumeriques.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { GTraductions } = require("ObjetTraduction.js");
class InterfaceCompetencesNumeriques_Consultation extends _InterfaceCompetencesNumeriques {
  constructor(...aParams) {
    super(...aParams);
  }
  construireInstances() {
    super.construireInstances();
    this.identComboPalier = this.add(
      ObjetSaisiePN,
      this.evenementSurComboPalier,
      _initialiserComboPalier,
    );
    this.IdPremierElement = this.getInstance(
      this.identComboPalier,
    ).getPremierElement();
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    this.AddSurZone = [this.identComboPalier, { separateur: true }];
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
    this.AddSurZone.push({ blocDroit: true });
  }
  estAffichageDeLaClasse() {
    return false;
  }
  recupererDonnees() {
    const lListePaliers =
      GEtatUtilisateur.getOngletListePaliers() || new ObjetListeElements();
    GHtml.setDisplay(
      this.getInstance(this.identComboPalier).getNom(),
      lListePaliers.count() > 1,
    );
    if (lListePaliers.count() === 0) {
      this.evenementAfficherMessage(EGenreMessage.AucunPilierPourEleve);
    } else {
      this.getInstance(this.identComboPalier).setDonnees(lListePaliers, 0);
    }
  }
  _actualiserCommandePDF() {
    if (
      GApplication.droits.get(
        TypeDroits.autoriserImpressionBulletinReleveBrevet,
      )
    ) {
      Invocateur.evenement(
        ObjetInvocateur.events.activationImpression,
        EGenreImpression.GenerationPDF,
        this,
        this._getParametresPDF.bind(this),
      );
    }
  }
  afficherPage() {
    new ObjetRequeteCompetencesNumeriques(
      this,
      this._reponseRequeteCompetences,
    ).lancerRequete({
      eleve: GEtatUtilisateur.getMembre(),
      filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
    });
  }
  _getParametresPDF() {
    return {
      genreGenerationPDF: TypeHttpGenerationPDFSco.LivretCompetenceNumerique,
      parametres: this.parametres,
      filtrerNiveauxSansEvaluation: this.filtrerNiveauxSansEvaluation,
      avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
    };
  }
  evenementSurComboPalier(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      this.selection = { palier: aParams.element };
      this.afficherPage();
    }
  }
}
function _initialiserComboPalier(aInstance) {
  aInstance.setOptionsObjetSaisie({
    avecTriListeElements: true,
    longueur: 150,
    labelWAICellule: GTraductions.getValeur("WAI.listeSelectionPalier"),
  });
}
module.exports = { InterfaceCompetencesNumeriques_Consultation };
