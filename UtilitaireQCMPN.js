exports.UtilitaireQCMPN = void 0;
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const TypeEtatExecutionQCMPourRepondant_1 = require("TypeEtatExecutionQCMPourRepondant");
const Enumere_Action_1 = require("Enumere_Action");
exports.UtilitaireQCMPN = {
	executerQCM: function (
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
						TypeEtatExecutionQCMPourRepondant_1
							.TypeEtatExecutionQCMPourRepondant.EQR_EnCours) &&
				(aSansQCMRevision || !lQCMRevision);
			const lEspaceQCMConsult =
				[
					Enumere_Espace_1.EGenreEspace.Parent,
					Enumere_Espace_1.EGenreEspace.Mobile_Parent,
					Enumere_Espace_1.EGenreEspace.Accompagnant,
					Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
					Enumere_Espace_1.EGenreEspace.Tuteur,
					Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
					Enumere_Espace_1.EGenreEspace.Entreprise,
					Enumere_Espace_1.EGenreEspace.Mobile_Entreprise,
				].includes(GEtatUtilisateur.GenreEspace) ||
				(aExecutionQCM.estUneActivite &&
					[
						Enumere_Espace_1.EGenreEspace.PrimParent,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
					].includes(GEtatUtilisateur.GenreEspace));
			if (lEspaceQCMConsult && lEstQCMExecutable) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"ExecutionQCM.DepuisEspaceEleve",
					),
				});
			} else {
				if (
					[
						Enumere_Espace_1.EGenreEspace.PrimParent,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
					].includes(GEtatUtilisateur.GenreEspace) &&
					lEstQCMExecutable
				) {
					GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"ExecutionQCM.DepuisEspaceParent",
						),
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						callback: (aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								exports.UtilitaireQCMPN.jouerQCM(
									aInstanceFenetreVisu,
									aExecutionQCM,
									lEspaceQCMConsult,
								);
							}
						},
					});
				} else {
					exports.UtilitaireQCMPN.jouerQCM(
						aInstanceFenetreVisu,
						aExecutionQCM,
						lEspaceQCMConsult,
					);
				}
			}
		}
	},
	jouerQCM: function (aInstanceFenetreVisu, aExecutionQCM, aEspaceQCMConsult) {
		aInstanceFenetreVisu.setParametres(
			aExecutionQCM.getNumero(),
			GApplication.getDemo() ||
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Academie,
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace) ||
				(aEspaceQCMConsult &&
					(aExecutionQCM.etatCloture === undefined ||
						aExecutionQCM.etatCloture ===
							TypeEtatExecutionQCMPourRepondant_1
								.TypeEtatExecutionQCMPourRepondant.EQR_EnCours)),
		);
		aInstanceFenetreVisu.setDonnees(aExecutionQCM);
	},
};
