exports.PageReleveEvaluationsParClasse = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const _PageReleveEvaluations_1 = require("_PageReleveEvaluations");
const DonneesListe_ReleveDEvaluations_1 = require("DonneesListe_ReleveDEvaluations");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetRequeteReleveDEvaluations_1 = require("ObjetRequeteReleveDEvaluations");
class PageReleveEvaluationsParClasse extends _PageReleveEvaluations_1._PageReleveEvaluations {
	constructor(...aParams) {
		super(...aParams);
		this.typeAffichage =
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations.TypeAffichage.AffichageParClasse;
	}
	_getListeParametresMenuDeroulant() {
		return [
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Palier,
			Enumere_Ressource_1.EGenreRessource.Pilier,
		];
	}
	_getParametresSupplementairesRequetes(aEstRequeteSaisie = false) {
		return {
			palier: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Palier,
			),
			pilier: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Pilier,
			),
		};
	}
	_ajouteCommandesSupplementairesMenuContextuel(aSelections, aMenuContextuel) {
		let lNivAcquiPilierEditable = false;
		aSelections.forEach((aSelection) => {
			if (
				aSelection.idColonne ===
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.niv_acqui_domaine
			) {
				lNivAcquiPilierEditable = true;
			}
		});
		const lEstUnPilierLVESelectionne = this.estPilierLVESelectionne();
		aMenuContextuel.addSousMenu(
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.menucontextuel.ModifierNivAcquiDomaine",
			),
			(aInstance) => {
				const lListeNiveauxAcquiPilier =
					UtilitaireCompetences_1.TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu(
						{
							genreChoixValidationCompetence:
								TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
									.tGVC_Competence,
							avecDispense: lEstUnPilierLVESelectionne,
						},
					);
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
exports.PageReleveEvaluationsParClasse = PageReleveEvaluationsParClasse;
