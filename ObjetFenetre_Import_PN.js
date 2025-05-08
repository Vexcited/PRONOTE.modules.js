const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetFenetre_Import } = require("ObjetFenetre_Import.js");
class ObjetFenetre_Import_PN extends ObjetFenetre_Import {
  constructor(...aParams) {
    super(...aParams);
    this.baremeAvecDecimales = true;
  }
  setDonnees(aParam) {
    this.listeService = aParam.listeService;
    if (
      GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur &&
      GEtatUtilisateur.genreOnglet === EGenreOnglet.SaisieNotes
    ) {
      this.avecComboTableSiSeule = false;
    }
    super.setDonnees(aParam, aParam.listeService);
  }
  avecBaremePremiereLigne() {
    if (
      GEtatUtilisateur.GenreEspace === EGenreEspace.Professeur &&
      GEtatUtilisateur.genreOnglet === EGenreOnglet.SaisieNotes
    ) {
      return true;
    } else {
      return false;
    }
  }
  avecSousService() {
    return true;
  }
  actualiserSelectionService(aListeService) {
    if (this.listeService) {
      const lListeService = aListeService;
      const lNbr = lListeService.count();
      let lElement;
      for (let i = 0; i < lNbr; i++) {
        lElement = lListeService.get(i);
        lElement.libelleHtml =
          (lElement.pere !== undefined
            ? lElement.pere.matiere.getLibelle() + " - "
            : "") +
          (lElement.pere !== undefined && lElement.pere.estCoEnseignement
            ? lElement.professeur.getLibelle() + " - "
            : "") +
          lElement.getLibelle() +
          " - " +
          (lElement.groupe.existeNumero()
            ? lElement.groupe.getLibelle()
            : lElement.classe.getLibelle()) +
          (lElement.listeProfesseurs
            ? " - " + lElement.listeProfesseurs.get(0).getLibelle()
            : "");
      }
      $(
        "#" +
          this.identZoneSelectionService.escapeJQ() +
          ", #" +
          this.identZoneSelectionService_mirroir.escapeJQ(),
      ).show();
      this.getInstance(this.idSelectionService).setDonnees(
        aListeService,
        aListeService.getIndiceParNumeroEtGenre(
          aListeService.get(0).getNumero(),
        ),
      );
    } else {
      $(
        "#" +
          this.identZoneSelectionService.escapeJQ() +
          ", #" +
          this.identZoneSelectionService_mirroir.escapeJQ(),
      ).hide();
    }
  }
}
module.exports = ObjetFenetre_Import_PN;
