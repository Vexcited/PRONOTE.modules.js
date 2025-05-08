const { GTraductions } = require("ObjetTraduction.js");
const { _PageReleveEvaluations } = require("_PageReleveEvaluations.js");
const {
  DonneesListe_ReleveDEvaluations,
} = require("DonneesListe_ReleveDEvaluations.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
  TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
class PageReleveEvaluationsParClasse extends _PageReleveEvaluations {
  constructor(...aParams) {
    super(...aParams);
    this.typeAffichage = this.constantes.AffichageParClasse;
  }
  _getListeParametresMenuDeroulant() {
    return [
      EGenreRessource.Classe,
      EGenreRessource.Periode,
      EGenreRessource.Palier,
      EGenreRessource.Pilier,
    ];
  }
  _getParametresSupplementairesRequetes() {
    return {
      palier: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Palier),
      pilier: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Pilier),
    };
  }
  _ajouteCommandesSupplementairesMenuContextuel(aSelections, aMenuContextuel) {
    let lNivAcquiPilierEditable = false;
    aSelections.forEach((aSelection) => {
      if (
        aSelection.idColonne ===
        DonneesListe_ReleveDEvaluations.colonnes.niv_acqui_domaine
      ) {
        lNivAcquiPilierEditable = true;
      }
    });
    const lEstUnPilierLVESelectionne = this.estPilierLVESelectionne();
    aMenuContextuel.addSousMenu(
      GTraductions.getValeur(
        "releve_evaluations.menucontextuel.ModifierNivAcquiDomaine",
      ),
      (aInstance) => {
        const lListeNiveauxAcquiPilier =
          TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu({
            genreChoixValidationCompetence:
              TypeGenreValidationCompetence.tGVC_Competence,
            avecDispense: lEstUnPilierLVESelectionne,
          });
        lListeNiveauxAcquiPilier.parcourir((D) => {
          aInstance.add(
            D.Libelle,
            lNivAcquiPilierEditable,
            () => {
              this._modifierNiveauAcquiDomaine(D);
            },
            {
              image: D.image,
              imageFormate: true,
              largeurImage: D.largeurImage,
            },
          );
        });
      },
    );
  }
}
module.exports = { PageReleveEvaluationsParClasse };
