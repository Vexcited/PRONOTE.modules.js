exports.UtilitaireCompetences_Mobile = void 0;
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypePositionnement_1 = require("TypePositionnement");
const ObjetFenetre_1 = require("ObjetFenetre");
const AccessApp_1 = require("AccessApp");
exports.UtilitaireCompetences_Mobile = {
	id: GUID_1.GUID.getId(),
	openPopupDetailLegende: function (avecNiveauxPositionnements) {
		const lListeNiveaux = (0, AccessApp_1.getApp)().getObjetParametres()
			.listeNiveauxDAcquisitions;
		const lHtml = [];
		let lNiveauDAcquisition, lLibelleNiveau, lImageNiveau;
		const lNbrNiveauDAqcuisition = lListeNiveaux.count();
		if (!!lNbrNiveauDAqcuisition) {
			lHtml.push('<div style="padding: 1rem;">');
			lHtml.push(
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.niveauDeMaitrise",
				),
				"</div>",
			);
			for (let i = 1; i < lNbrNiveauDAqcuisition; i++) {
				if (
					lListeNiveaux.get(i).existeNumero() &&
					lListeNiveaux
						.get(i)
						.actifPour.contains(
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_EvaluationEtItem,
						)
				) {
					lNiveauDAcquisition = lListeNiveaux.get(i);
					lLibelleNiveau = lNiveauDAcquisition.getLibelle();
					lImageNiveau =
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
							lNiveauDAcquisition,
						);
					lHtml.push(
						'<div style="padding-left: 1rem; padding-top: 0.5rem;">',
						'<span style="display: inline-block; width: 2rem; text-align: center;">',
						lImageNiveau,
						"</span>",
						'<span style="padding-left:',
						!!GParametres.afficherAbbreviationNiveauDAcquisition
							? "2rem;"
							: "1.2rem;",
						'">',
						lLibelleNiveau,
						"</span>",
						"</div>",
					);
				}
			}
			if (!!avecNiveauxPositionnements) {
				lHtml.push(
					'<div style="padding-top : 2rem;">',
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.PositionnementLSU",
					),
					"</div>",
				);
				for (let j = 1; j < lNbrNiveauDAqcuisition; j++) {
					lNiveauDAcquisition = lListeNiveaux.get(j);
					if (
						lNiveauDAcquisition.existeNumero() &&
						lNiveauDAcquisition.actifPour.contains(
							TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
								.tGVC_Competence,
						)
					) {
						lLibelleNiveau =
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getLibellePositionnement(
								{
									niveauDAcquisition: lNiveauDAcquisition,
									genrePositionnement:
										TypePositionnement_1.TypePositionnement.POS_Echelle,
								},
							);
						lImageNiveau =
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
								{
									niveauDAcquisition: lNiveauDAcquisition,
									genrePositionnement:
										TypePositionnement_1.TypePositionnement.POS_Echelle,
								},
							);
						lHtml.push(
							'<div style="padding-left: 1rem; padding-top: 0.5rem;">',
							'<span style="display: inline-block; width: 2rem; text-align: center;">',
							lImageNiveau,
							"</span>",
							'<span style="padding-left:',
							!!GParametres.afficherAbbreviationNiveauDAcquisition
								? "2rem;"
								: "1.2rem;",
							'">',
							lLibelleNiveau,
							"</span>",
							"</div>",
						);
					}
				}
			}
			lHtml.push("</div>");
		}
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{ pere: this },
			{
				titre: ObjetTraduction_1.GTraductions.getValeur("competences.Legende"),
				fermerFenetreSurClicHorsFenetre: true,
			},
		).afficher(lHtml.join(""));
	},
};
