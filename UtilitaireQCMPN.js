const { EGenreEspace } = require("Enumere_Espace.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const {
	TypeEtatExecutionQCMPourRepondant,
} = require("TypeEtatExecutionQCMPourRepondant.js");
const { EGenreAction } = require("Enumere_Action.js");
const UtilitaireQCMPN = {};
UtilitaireQCMPN.executerQCM = function (
	aInstanceFenetreVisu,
	aExecutionQCM,
	aSansQCMRevision,
) {
	if (!!aExecutionQCM && !!aInstanceFenetreVisu) {
		const lQCMRevision =
			!aExecutionQCM.estLieADevoir &&
			!aExecutionQCM.estLieAEvaluation &&
			!aExecutionQCM.estUnTAF;
		const lEstQCMExecutable =
			(aExecutionQCM.etatCloture === undefined ||
				aExecutionQCM.etatCloture ===
					TypeEtatExecutionQCMPourRepondant.EQR_EnCours) &&
			(aSansQCMRevision || !lQCMRevision);
		const lEspaceQCMConsult =
			[
				EGenreEspace.Parent,
				EGenreEspace.Mobile_Parent,
				EGenreEspace.Accompagnant,
				EGenreEspace.PrimAccompagnant,
				EGenreEspace.Mobile_Accompagnant,
				EGenreEspace.Mobile_PrimAccompagnant,
				EGenreEspace.Tuteur,
				EGenreEspace.Mobile_Tuteur,
				EGenreEspace.Entreprise,
			].includes(GEtatUtilisateur.GenreEspace) ||
			(aExecutionQCM.estUneActivite &&
				[EGenreEspace.PrimParent, EGenreEspace.Mobile_PrimParent].includes(
					GEtatUtilisateur.GenreEspace,
				));
		if (lEspaceQCMConsult && lEstQCMExecutable) {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur("ExecutionQCM.DepuisEspaceEleve"),
			});
		} else {
			if (
				[EGenreEspace.PrimParent, EGenreEspace.Mobile_PrimParent].includes(
					GEtatUtilisateur.GenreEspace,
				) &&
				lEstQCMExecutable
			) {
				GApplication.getMessage().afficher({
					message: GTraductions.getValeur("ExecutionQCM.DepuisEspaceParent"),
					type: EGenreBoiteMessage.Confirmation,
					callback: (aGenreAction) => {
						if (aGenreAction === EGenreAction.Valider) {
							UtilitaireQCMPN.jouerQCM(
								aInstanceFenetreVisu,
								aExecutionQCM,
								lEspaceQCMConsult,
							);
						}
					},
				});
			} else {
				UtilitaireQCMPN.jouerQCM(
					aInstanceFenetreVisu,
					aExecutionQCM,
					lEspaceQCMConsult,
				);
			}
		}
	}
};
UtilitaireQCMPN.jouerQCM = function (
	aInstanceFenetreVisu,
	aExecutionQCM,
	aEspaceQCMConsult,
) {
	aInstanceFenetreVisu.setParametres(
		aExecutionQCM.getNumero(),
		GApplication.getDemo() ||
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.Academie,
				EGenreEspace.Administrateur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace) ||
			(aEspaceQCMConsult &&
				(aExecutionQCM.etatCloture === undefined ||
					aExecutionQCM.etatCloture ===
						TypeEtatExecutionQCMPourRepondant.EQR_EnCours)),
	);
	aInstanceFenetreVisu.setDonnees(aExecutionQCM);
};
module.exports = { UtilitaireQCMPN };
