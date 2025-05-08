exports.ObjetInterfaceCommandeCP = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const Invocateur_1 = require("Invocateur");
const ObjetFenetre_Impression_1 = require("ObjetFenetre_Impression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
class ObjetInterfaceCommandeCP extends ObjetInterface_1.ObjetInterface {
  constructor(...aParams) {
    super(...aParams);
    Invocateur_1.Invocateur.abonner(
      Invocateur_1.ObjetInvocateur.events.modeExclusif,
      () => {
        this.$refreshSelf();
      },
      this,
    );
    Invocateur_1.Invocateur.abonner(
      Invocateur_1.ObjetInvocateur.events.etatSaisie,
      this._setEtatSaisie.bind(this),
      this,
    );
    Invocateur_1.Invocateur.abonner(
      Invocateur_1.ObjetInvocateur.events.activationImpression,
      (aGenreImpression, aInstance, aCallback) => {
        ObjetFenetre_Impression_1.GestionImpression.surActivationImpression(
          aGenreImpression,
          aInstance,
          aCallback,
        );
        this.actualiserInformationEtatCommande();
        this.$refreshSelf();
      },
      this,
    );
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
    this.AvecCadre = false;
  }
}
exports.ObjetInterfaceCommandeCP = ObjetInterfaceCommandeCP;
