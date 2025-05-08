exports.InterfaceBilanFinDeCycle_Saisie = void 0;
const _InterfaceBilanFinDeCycle_1 = require("_InterfaceBilanFinDeCycle");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetRequeteSaisieBilanFinDeCycle_1 = require("ObjetRequeteSaisieBilanFinDeCycle");
class InterfaceBilanFinDeCycle_Saisie extends _InterfaceBilanFinDeCycle_1._InterfaceBilanFinDeCycle {
  constructor(...aParams) {
    super(...aParams);
    this.periodeSelectionnee = this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Periode,
    );
  }
  _addSurZone() {
    this.AddSurZone = [];
    this.AddSurZone.push(this.identTripleCombo);
    this.AddSurZone.push({ blocGauche: true });
    this.AddSurZone.push({
      html:
        '<ie-checkbox ie-model="cbJaugeParPeriode" ie-display="avecCheckboxJaugeParPeriode">' +
        ObjetTraduction_1.GTraductions.getValeur(
          "competences.AfficherUneJaugeParPeriode",
        ) +
        "</ie-checkbox>",
    });
    this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
    this.AddSurZone.push({ blocDroit: true });
  }
  _construireInstancesSupplementaires() {
    this.identTripleCombo = this.add(
      InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
      this.evenementSurDernierMenuDeroulant,
      this.initialiserTripleCombo,
    );
    this.IdPremierElement = this.getInstance(
      this.identTripleCombo,
    ).getPremierElement();
  }
  getControleur(aInstance) {
    return $.extend(true, super.getControleur(aInstance), {
      avecCheckboxJaugeParPeriode() {
        const lPeriode = aInstance.etatUtilisateurSco.Navigation.getRessource(
          Enumere_Ressource_1.EGenreRessource.Periode,
        );
        return (
          lPeriode &&
          !lPeriode.existeNumero() &&
          !aInstance.affichageDecompteDesResultats()
        );
      },
      cbJaugeParPeriode: {
        getValue() {
          return aInstance.optionsAffichage.uneJaugeParPeriode;
        },
        setValue(aValeur) {
          aInstance.optionsAffichage.uneJaugeParPeriode = aValeur;
          aInstance
            .getInstance(aInstance.identBilanFinDeCycle)
            .setOptionsAffichageListe({
              uneJaugeParPeriode: aInstance.optionsAffichage.uneJaugeParPeriode,
            });
        },
      },
    });
  }
  initialiserTripleCombo(aInstance) {
    aInstance.setParametres([
      Enumere_Ressource_1.EGenreRessource.Classe,
      Enumere_Ressource_1.EGenreRessource.Periode,
      Enumere_Ressource_1.EGenreRessource.Eleve,
      Enumere_Ressource_1.EGenreRessource.Palier,
    ]);
  }
  evenementSurDernierMenuDeroulant() {
    this.afficherBandeau(true);
    this.recupererDonnees();
    this.lancerRequeteRecuperationDonnees();
  }
  getTitleBoutonGraphe() {
    return ObjetTraduction_1.GTraductions.getValeur(
      "competences.graphe.hintBoutonGraphe",
    );
  }
  getListeEleves() {
    return this.etatUtilisateurSco.Navigation.getRessources(
      Enumere_Ressource_1.EGenreRessource.Eleve,
    );
  }
  getClasseConcernee() {
    return this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Classe,
    );
  }
  getPeriodeConcernee() {
    return this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Periode,
    );
  }
  getPalierConcerne() {
    return this.etatUtilisateurSco.Navigation.getRessource(
      Enumere_Ressource_1.EGenreRessource.Palier,
    );
  }
  valider() {
    const lParamsSaisie = {
      eleve: this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Eleve,
      ),
      periode: this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Periode,
      ),
      palier: this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Palier,
      ),
      appreciation: this.appreciation,
      ensComplementEleve: null,
      ensComplementElevePoints: null,
    };
    if (!!this.donnees.EnseignementDeComplement) {
      lParamsSaisie.ensComplementEleve =
        this.donnees.EnseignementDeComplement.valeurEleve;
      lParamsSaisie.ensComplementElevePoints =
        this.donnees.EnseignementDeComplement.valeurPoints;
    }
    new ObjetRequeteSaisieBilanFinDeCycle_1.ObjetRequeteSaisieBilanFinDeCycle(
      this,
      this.actionSurValidation,
    ).lancerRequete(lParamsSaisie);
  }
  validerTransfertAppreciations(aEcraserAppreciations) {
    new ObjetRequeteSaisieBilanFinDeCycle_1.ObjetRequeteSaisieBilanFinDeCycle(
      this,
      this.actionSurValidation,
    ).lancerRequete({
      estTransfertAppAnnuelle: true,
      classe: this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Classe,
      ),
      eleves: this.getInstance(
        this.identBilanFinDeCycle,
      ).getListeElevesConcernes(),
      palier: this.etatUtilisateurSco.Navigation.getRessource(
        Enumere_Ressource_1.EGenreRessource.Palier,
      ),
      ecraserAppExistantes: !!aEcraserAppreciations,
    });
  }
}
exports.InterfaceBilanFinDeCycle_Saisie = InterfaceBilanFinDeCycle_Saisie;
