const { GHtml } = require("ObjetHtml.js");
const {
  EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { _InterfaceBilanParDomaine } = require("_InterfaceBilanParDomaine.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { ObjetSaisiePN } = require("ObjetSaisiePN.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
class InterfaceBilanParDomaine_Consultation extends _InterfaceBilanParDomaine {
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
    this.identComboPilier = this.add(
      ObjetSaisiePN,
      this.evenementSurComboPilier,
      _initialiserComboPilier,
    );
    this.IdPremierElement = this.getInstance(
      this.identComboPilier,
    ).getPremierElement();
  }
  setParametresGeneraux() {
    super.setParametresGeneraux();
    this.AddSurZone = [
      this.identComboPalier,
      this.identComboPilier,
      { separateur: true },
    ];
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone = this.AddSurZone.concat(this._construitAddSurZoneCommun());
    this.AddSurZone.push({ blocDroit: true });
  }
  recupererDonnees() {
    const lListePaliers =
      GEtatUtilisateur.getOngletListePaliers() || new ObjetListeElements();
    if (lListePaliers.count() === 0) {
      GHtml.setDisplay(this.getInstance(this.identComboPalier).getNom(), false);
      GHtml.setDisplay(this.getInstance(this.identComboPilier).getNom(), false);
      this.evenementAfficherMessage(EGenreMessage.AucunPilierPourEleve);
    } else {
      this.getInstance(this.identComboPalier).setDonnees(lListePaliers, 0);
    }
  }
  getListeEleves() {
    const result = new ObjetListeElements();
    result.addElement(GEtatUtilisateur.getMembre());
    return result;
  }
  getServiceConcerne() {
    const lPilierSelectionne = GEtatUtilisateur.Navigation.getRessource(
      EGenreRessource.Pilier,
    );
    return !!lPilierSelectionne ? lPilierSelectionne.Service : null;
  }
  evenementSurComboPalier(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Palier,
        aParams.element,
      );
      GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Pilier, null);
      let lAvecSocleCommun = false;
      let lAvecPersonnalise = false;
      let lPilier;
      const lListePiliers = new ObjetListeElements();
      const lListePiliersOnglet =
        aParams.element.listePiliers || new ObjetListeElements();
      if (lListePiliersOnglet.count() === 0) {
        this.evenementAfficherMessage(EGenreMessage.AucunPilierPourEleve);
      } else {
        for (let i = 0; i < lListePiliersOnglet.count(); i++) {
          lPilier = lListePiliersOnglet.get(i);
          if (lPilier.estSocleCommun) {
            lAvecSocleCommun = true;
            lPilier.positionSocle = 0;
          }
          if (lPilier.estPersonnalise && !lPilier.estSocleCommun) {
            lAvecPersonnalise = true;
            lPilier.positionSocle = 2;
          }
        }
        lListePiliers.add(lListePiliersOnglet);
        if (lAvecSocleCommun && lAvecPersonnalise) {
          lPilier = new ObjetElement(
            GTraductions.getValeur("pilier.socleCommun"),
          );
          lPilier.positionSocle = 0;
          lPilier.Position = -1;
          lPilier.AvecSelection = false;
          lListePiliers.addElement(lPilier);
          lPilier = new ObjetElement(
            GTraductions.getValeur("pilier.personnalise"),
          );
          lPilier.positionSocle = 2;
          lPilier.Position = -1;
          lPilier.AvecSelection = false;
          lListePiliers.addElement(lPilier);
        }
        lListePiliers.setTri([
          ObjetTri.init((D) => {
            return D.positionSocle;
          }),
          ObjetTri.init((D) => {
            return D.getPosition();
          }),
        ]);
        lListePiliers.trier();
        this.getInstance(this.identComboPilier).setDonnees(
          lListePiliers,
          lAvecSocleCommun && lAvecPersonnalise ? 1 : 0,
        );
        this.getInstance(this.identComboPilier).setSelectionParIndice(0);
      }
    }
  }
  evenementSurComboPilier(aParams) {
    if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
      GEtatUtilisateur.Navigation.setRessource(
        EGenreRessource.Pilier,
        aParams.element,
      );
      this.afficherPage();
    }
  }
}
function _initialiserComboPalier(aInstance) {
  aInstance.setOptionsObjetSaisie({
    longueur: 100,
    avecTriListeElements: true,
    labelWAICellule: GTraductions.getValeur("WAI.listeSelectionPalier"),
  });
}
function _initialiserComboPilier(aInstance) {
  const lOptions = {
    longueur: 450,
    largeurListe: 450,
    avecTriListeElements: true,
    getClassElement: function (aParams) {
      return aParams.element.Position === -1 ? "titre-liste" : "";
    },
    labelWAICellule: GTraductions.getValeur("WAI.listeSelectionCompetence"),
  };
  aInstance.setOptionsObjetSaisie(lOptions);
}
module.exports = InterfaceBilanParDomaine_Consultation;
