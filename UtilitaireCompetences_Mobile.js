const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const {
	TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypePositionnement } = require("TypePositionnement.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const UtilitaireCompetences_Mobile = { id: GUID.getId() };
UtilitaireCompetences_Mobile.openPopupDetailLegende = function (
	avecNiveauxPositionnements,
) {
	const lHtml = [];
	let lNiveauDAcquisition, lLibelleNiveau, lImageNiveau;
	const lNbrNiveauDAqcuisition = GParametres.listeNiveauxDAcquisitions.count();
	if (!!lNbrNiveauDAqcuisition) {
		lHtml.push('<div style="padding: 1rem;">');
		lHtml.push(
			"<div>",
			GTraductions.getValeur("competences.niveauDeMaitrise"),
			"</div>",
		);
		for (let i = 1; i < lNbrNiveauDAqcuisition; i++) {
			if (
				GParametres.listeNiveauxDAcquisitions.get(i).existeNumero() &&
				GParametres.listeNiveauxDAcquisitions
					.get(i)
					.actifPour.contains(
						TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
					)
			) {
				lNiveauDAcquisition = GParametres.listeNiveauxDAcquisitions.get(i);
				lLibelleNiveau = lNiveauDAcquisition.getLibelle();
				lImageNiveau =
					EGenreNiveauDAcquisitionUtil.getImage(lNiveauDAcquisition);
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
				GTraductions.getValeur("competences.PositionnementLSU"),
				"</div>",
			);
			for (let j = 1; j < lNbrNiveauDAqcuisition; j++) {
				lNiveauDAcquisition = GParametres.listeNiveauxDAcquisitions.get(j);
				if (
					lNiveauDAcquisition.existeNumero() &&
					lNiveauDAcquisition.actifPour.contains(
						TypeGenreValidationCompetence.tGVC_Competence,
					)
				) {
					lLibelleNiveau =
						EGenreNiveauDAcquisitionUtil.getLibellePositionnement({
							niveauDAcquisition: lNiveauDAcquisition,
							genrePositionnement: TypePositionnement.POS_Echelle,
						});
					lImageNiveau = EGenreNiveauDAcquisitionUtil.getImagePositionnement({
						niveauDAcquisition: lNiveauDAcquisition,
						genrePositionnement: TypePositionnement.POS_Echelle,
					});
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
	ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre,
		{ pere: this },
		{
			titre: GTraductions.getValeur("competences.Legende"),
			fermerFenetreSurClicHorsFenetre: true,
		},
	).afficher(lHtml.join(""));
};
module.exports = UtilitaireCompetences_Mobile;
