exports.InterfaceEditionDetailSelectionQCM_PN = void 0;
const InterfaceEditionDetailSelectionQCM_1 = require("InterfaceEditionDetailSelectionQCM");
const ObjetFenetre_EditionQuestionQCM_PN_1 = require("ObjetFenetre_EditionQuestionQCM_PN");
const ObjetFenetre_DetailsPIEleve_1 = require("ObjetFenetre_DetailsPIEleve");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
class InterfaceEditionDetailSelectionQCM_PN extends InterfaceEditionDetailSelectionQCM_1.InterfaceEditionDetailSelectionQCM {
  constructor(...aParams) {
    super(...aParams);
    this.applicationSco = GApplication;
    this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
    $.extend(this.options, {
      avecAffNotation: true,
      avecConsigne: true,
      avecPersonnalisationProjetAccompagnement: true,
      avecModeCorrigeALaDate: true,
      avecMultipleExecutions: true,
      avecGestionBaremeSurQuestion: !this.etatUtilisateurSco.pourPrimaire(),
      avecRectificationNotePossible: true,
    });
    this.ObjetFenetre_DetailsPIEleve =
      ObjetFenetre_DetailsPIEleve_1.ObjetFenetre_DetailsPIEleve;
  }
  avecComboNumerotationQuestions() {
    return !this.etatUtilisateurSco.pourPrimaire();
  }
  construireInstancesEditionQuestionQCM() {
    this.identFenetreEditionQuestionQCM = this.addFenetre(
      ObjetFenetre_EditionQuestionQCM_PN_1.ObjetFenetre_EditionQuestionQCM_PN,
      this.evntSurEditionQuestionQCM,
      this.initEditionQuestionQCM,
    );
  }
  initEditionQuestionQCM(aInstance) {
    super.initEditionQuestionQCM(aInstance);
    aInstance.setOptionsFenetreEditionQuestionQCM({
      avecEvaluations:
        !this.etatUtilisateurSco.pourPrimaire() ||
        this.applicationSco.droits.get(
          ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionCompetences,
        ),
      avecAffichageBareme: this.options.avecGestionBaremeSurQuestion,
      avecVerificationMatierePourEvaluations: false,
    });
  }
}
exports.InterfaceEditionDetailSelectionQCM_PN =
  InterfaceEditionDetailSelectionQCM_PN;
