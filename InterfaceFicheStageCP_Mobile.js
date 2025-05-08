exports.InterfaceFicheStageCP_Mobile = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetElement_1 = require("ObjetElement");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfaceFicheStageCP_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
  constructor() {
    super(...arguments);
    this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
  }
  construireInstances() {
    if (this.parametres.avecSelectionEtudiant) {
      this.identCmbEtudiant = this.add(
        ObjetSelection_1.ObjetSelection,
        this.evntCmbEtudiant,
      );
    }
    this.identCmbStage = this.add(
      ObjetSelection_1.ObjetSelection,
      this.evntCmbStage,
      _initCmb,
    );
    this.identPage = this.creerInstancePage();
    this.identPageSuivi = this.creerInstanceSuivi();
    this.identTabs = this.add(
      ObjetTabOnglets_1.ObjetTabOnglets,
      this.eventModeAffStage,
    );
    const lElementSuivi = new ObjetElement_1.ObjetElement(
      Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
        Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi,
      ),
      null,
      Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi,
      null,
      true,
    );
    this.ajouterOngletSuivi(lElementSuivi);
    const lElementEntreprise = new ObjetElement_1.ObjetElement(
      Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
        Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Entreprise,
      ),
      null,
      Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Entreprise,
      null,
      true,
    );
    this.ajouterOngletEntreprise(lElementEntreprise);
    const lElementDetails = new ObjetElement_1.ObjetElement(
      Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
        Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Details,
      ),
      null,
      Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Details,
      null,
      true,
    );
    this.listeTabs.addElement(lElementDetails);
    this.AddSurZone = [];
    if (this.identCmbEtudiant !== undefined) {
      this.AddSurZone.push(this.identCmbEtudiant);
    }
    if (this.parametres.avecSelectionEleve) {
      this.AddSurZone.push(this.identComboClasse);
      this.AddSurZone.push(this.identComboEleve);
    }
    this.AddSurZone.push(this.identCmbStage);
    this.AddSurZone.push(this.identTabs);
  }
  setParametresGeneraux() {
    this.GenreStructure =
      Enumere_StructureAffichage_1.EStructureAffichage.Autre;
  }
  construireStructureAffichageAutre() {
    return IE.jsx.str(
      IE.jsx.fragment,
      null,
      IE.jsx.str("div", { id: this.getInstance(this.identPage).getNom() }),
      IE.jsx.str("div", { id: this.getInstance(this.identPageSuivi).getNom() }),
    );
  }
  surEvenementPageStage(aParam) {
    if (!aParam) {
      this.recupererDonnees();
    } else if (aParam.suivi) {
      $("#" + this.getInstance(this.identPage).getNom().escapeJQ()).hide();
      $("#" + GApplication.idLigneBandeau.escapeJQ()).hide();
      this.getInstance(this.identPageSuivi).setDonnees(
        aParam.suivi,
        this.stage,
        {
          evenements: this.listeEvenementsSuiviStage,
          lieux: this.listeLieuxSuiviStage,
        },
      );
      $("#" + this.getInstance(this.identPageSuivi).getNom().escapeJQ()).show();
    }
  }
}
exports.InterfaceFicheStageCP_Mobile = InterfaceFicheStageCP_Mobile;
function _initCmb(aInstance) {
  aInstance.setParametres({
    avecBoutonsPrecedentSuivant: false,
    labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
      "FenetreSuiviStage.TypeDeStage",
    ),
  });
}
