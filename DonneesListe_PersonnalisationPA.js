exports.DonneesListe_PersonnalisationPA = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetFenetre_1 = require("ObjetFenetre");
const AccessApp_1 = require("AccessApp");
let ObjetFenetre_DetailsPIEleve = null;
class DonneesListe_PersonnalisationPA extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptions) {
		super(aDonnees);
		this.maxNbrQuestions = aOptions.maxNbrQuestions || 10;
		this.maxDuree = aOptions.maxDuree || 120;
		this.setOptions(
			$.extend(
				{
					avecSelection: true,
					avecEdition: false,
					avecMenuContextuel: true,
					avecSuppression: true,
					avecEvnt_Selection: true,
					avecEvnt_Edition: false,
					avecEvnt_Creation: false,
					avecEvnt_ApresSuppression: false,
					avecEtatSaisie: false,
					avecMultiSelection: true,
					avecTri: true,
					editionApresSelection: false,
					editionSurSelectionApresFinEdition: true,
					avecSelectionSurNavigationClavier: true,
					avecNavigationClavierFlechesEnEdition: true,
					avecCelluleSuivanteSurFinEdition: true,
				},
				aOptions,
			),
		);
	}
	getControleur(aInstance, aInstanceListe) {
		return $.extend(true, super.getControleur(this, aInstanceListe), {
			surClicPA: function (aNoLigne) {
				$(this.node).on("click", function () {
					if (ObjetFenetre_DetailsPIEleve) {
						const lArticle =
							!!aInstance.Donnees && aNoLigne < aInstance.Donnees.count()
								? aInstance.Donnees.get(aNoLigne)
								: null;
						if (lArticle && lArticle.eleve) {
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_DetailsPIEleve,
								{ pere: this },
							).setDonnees({ eleve: lArticle.eleve });
						}
					}
				});
			},
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PersonnalisationPA.colonnes.nom:
				return aParams.article.eleve.getLibelle();
			case DonneesListe_PersonnalisationPA.colonnes.projet:
				return this.construireProjet(aParams);
			case DonneesListe_PersonnalisationPA.colonnes.dureeSuppl:
				return aParams.article.dureeSupplementaire !== undefined
					? UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
							aParams.article.dureeSupplementaire,
						)
					: "";
			case DonneesListe_PersonnalisationPA.colonnes.questEnMoins:
				return aParams.article.nombreQuestionsEnMoins !== undefined
					? aParams.article.nombreQuestionsEnMoins
					: "";
		}
		return "";
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			[
				DonneesListe_PersonnalisationPA.colonnes.dureeSuppl,
				DonneesListe_PersonnalisationPA.colonnes.questEnMoins,
			].includes(aParams.idColonne)
		) {
			lClasses.push("AlignementDroit");
		}
		return lClasses.join(" ");
	}
	avecEdition(aParams) {
		return (
			this.options.avecEdition &&
			[
				DonneesListe_PersonnalisationPA.colonnes.dureeSuppl,
				DonneesListe_PersonnalisationPA.colonnes.questEnMoins,
			].includes(aParams.idColonne)
		);
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PersonnalisationPA.colonnes.dureeSuppl:
				return { mask: /^0-9/i, tailleMax: 3 };
			case DonneesListe_PersonnalisationPA.colonnes.questEnMoins:
				return { mask: /^0-9/i, tailleMax: 3 };
			default:
				return null;
		}
	}
	getMessageEditionImpossible(aParams, aMessageErreur) {
		if (!(0, AccessApp_1.getApp)().getMessage().EnAffichage) {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: aMessageErreur,
				});
		}
		return "";
	}
	surEdition(aParams, V) {
		let lMin;
		let lValeur;
		switch (aParams.idColonne) {
			case DonneesListe_PersonnalisationPA.colonnes.questEnMoins:
				lValeur = parseInt(V, 10);
				lMin = aParams.article.dureeSupplementaire === 0 ? 1 : 0;
				if (lValeur < lMin || lValeur > this.maxNbrQuestions) {
					lMin = aParams.article.dureeSupplementaire === 0 ? 1 : 0;
					return ObjetTraduction_1.GTraductions.getValeur(
						"ErreurMinMaxEntier",
						[lMin, this.maxNbrQuestions],
					);
				}
				aParams.article.nombreQuestionsEnMoins = lValeur;
				break;
			case DonneesListe_PersonnalisationPA.colonnes.dureeSuppl:
				lValeur = parseInt(V, 10);
				lMin = aParams.article.nombreQuestionsEnMoins === 0 ? 1 : 0;
				if (lValeur < lMin || lValeur > this.maxDuree) {
					lMin = aParams.article.nombreQuestionsEnMoins === 0 ? 1 : 0;
					return ObjetTraduction_1.GTraductions.getValeur(
						"ErreurMinMaxEntier",
						[lMin, this.maxDuree],
					);
				}
				aParams.article.dureeSupplementaire =
					UtilitaireDuree_1.TUtilitaireDuree.minEnDuree(lValeur);
				break;
			default:
		}
	}
	getMessageSuppressionConfirmation() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"FenetreParamExecutionQCM.ConfirmSuppressionPersonnalisation",
		);
	}
	construireProjet(aParams) {
		const H = [];
		if (aParams.article.eleve && aParams.article.eleve.projetsAccompagnement) {
			H.push(
				'<span class="flex-contain AvecMain" ie-node="surClicPA(',
				aParams.ligne,
				')">',
				aParams.article.eleve.projetsAccompagnement,
			);
			H.push(
				'<i class="fluid-bloc text-right icon icon_projet_accompagnement"></i></span>',
			);
		}
		return H.join("");
	}
}
exports.DonneesListe_PersonnalisationPA = DonneesListe_PersonnalisationPA;
DonneesListe_PersonnalisationPA.setFenetreDetailsPIEleve = function (aFenetre) {
	ObjetFenetre_DetailsPIEleve = aFenetre;
};
DonneesListe_PersonnalisationPA.colonnes = {
	nom: "DLPersonnalisationPA_nom",
	projet: "DLPersonnalisationPA_projet",
	dureeSuppl: "DLPersonnalisationPA_dureeSuppl",
	questEnMoins: "DLPersonnalisationPA_questEnMoins",
};
