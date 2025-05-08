const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreAppreciationGenerale,
} = require("Enumere_AppreciationGenerale.js");
const {
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { EGenreEvolutionUtil } = require("Enumere_Evolution.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
class DonneesListe_AppreciationsAnnuellesPdB extends ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
		this.moteurGrille = new ObjetMoteurGrilleSaisie();
		this.initMenuContextuel = aParam.initMenuContextuel;
		this.param = $.extend(
			{
				saisie: false,
				typeReleveBulletin: null,
				contexte: null,
				total: false,
				avecValidationAuto: false,
				clbckValidationAutoSurEdition: null,
			},
			aParam,
		);
		this.setOptions({
			hauteurMinCellule: 48,
			hauteurMinContenuCellule: ObjetDonneesListe.hauteurMinCellule,
		});
	}
	getAppreciation(aParams) {
		const lListeAppreciations = this.param.global
			? aParams.article.listeAppreciationsGenerales
			: aParams.article.listeAppreciations;
		if (lListeAppreciations === undefined) {
			return null;
		}
		for (
			let lNumAppreciation = 0;
			lNumAppreciation < lListeAppreciations.count();
			lNumAppreciation++
		) {
			if (
				aParams.idColonne ===
				DonneesListe_AppreciationsAnnuellesPdB.colonnes.appreciation +
					lListeAppreciations.getGenre(lNumAppreciation)
			) {
				return lListeAppreciations.get(lNumAppreciation);
			}
		}
		return null;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU:
				return ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard:
				return ObjetDonneesListe.ETypeCellule.Texte;
			default:
				return aParams.declarationColonne.genre ===
					EGenreAppreciationGenerale.AG_Mention
					? ObjetDonneesListe.ETypeCellule.Texte
					: ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode:
				return aParams.article.getLibelle();
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs:
				return aParams.article.nbrDevoirs;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals:
				return aParams.article.nbrEvaluations;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs:
				return aParams.article.absences;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard:
				return aParams.article.retards;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.evolution:
				return EGenreEvolutionUtil.getImage(
					!!aParams.article.evolution
						? aParams.article.evolution.getGenre()
						: 0,
				);
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU:
				return aParams.article.moyenneLSU;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition:
				if (aParams.article.niveauDAcquisition) {
					const lNiveauDAcquisition =
						GParametres.listeNiveauxDAcquisitions.getElementParNumero(
							aParams.article.niveauDAcquisition.getNumero(),
						);
					return EGenreNiveauDAcquisitionUtil.getImagePositionnement({
						niveauDAcquisition: lNiveauDAcquisition,
						genrePositionnement:
							TypePositionnementUtil.getGenrePositionnementParDefaut(
								aParams.article.typePositionnementClasse,
							),
						avecPrefixe: true,
					});
				}
				return aParams.article.niveauDAcquisition
					? aParams.article.niveauDAcquisition
					: "";
			default: {
				const appreciation = this.getAppreciation(aParams);
				if (appreciation) {
					return appreciation.getLibelle();
				}
			}
		}
		return "";
	}
	avecEtatSaisie(aParamsCellule) {
		return !(
			this.moteurGrille.estColVariable(
				aParamsCellule.idColonne,
				DonneesListe_AppreciationsAnnuellesPdB.colonnes.appreciation,
			) && this.param.avecValidationAuto === true
		);
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode:
				return ObjetDonneesListe.ECouleurCellule.Fixe;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard:
				return ObjetDonneesListe.ECouleurCellule.Gris;
			default:
				return _estEditable(this, aParams)
					? ObjetDonneesListe.ECouleurCellule.Blanc
					: ObjetDonneesListe.ECouleurCellule.Gris;
		}
	}
	getClass(aParams) {
		const T = [];
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard:
				T.push("AlignementDroit");
				break;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.evolution:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition:
				T.push("AlignementMilieu");
				break;
			default:
				break;
		}
		return T.join(" ");
	}
	getClassCelluleConteneur(aParams, I, D) {
		const T = [];
		if (
			_estEditable(this, aParams) &&
			this.moteurAssSaisie.avecAssistantSaisieActif({
				appreciation: D,
				typeReleveBulletin: this.param.typeReleveBulletin,
				contexte: this.param.contexte,
			})
		) {
			T.push("Curseur_AssistantSaisieActif");
		}
		return T.join(" ");
	}
	avecEvenementEdition(aParams) {
		return (
			_estEditable(this, aParams) &&
			(aParams.declarationColonne.genre ===
				EGenreAppreciationGenerale.AG_Mention ||
				aParams.idColonne ===
					DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition ||
				this.moteurAssSaisie.avecAssistantSaisieActif({
					appreciation: aParams.article,
					typeReleveBulletin: this.param.typeReleveBulletin,
					contexte: this.param.contexte,
				}))
		);
	}
	avecEdition(aParams) {
		return _estEditable(this, aParams);
	}
	avecMenuContextuel(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition &&
			_estEditable(this, aParams)
		);
	}
	remplirMenuContextuel(aParametres) {
		this.initMenuContextuel(aParametres);
	}
	surEdition(aParams, V) {
		if (
			aParams.idColonne ===
			DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU
		) {
			aParams.article.moyenneLSU = V;
			aParams.article.setEtat(EGenreEtat.Modification);
		} else {
			const lAppr = this.getAppreciation(aParams);
			if (lAppr) {
				lAppr.setLibelle(!!V ? V.trim() : "");
				lAppr.setEtat(EGenreEtat.Modification);
			}
			if (
				this.param.avecValidationAuto === true &&
				this.param.clbckValidationAutoSurEdition !== null &&
				this.param.clbckValidationAutoSurEdition !== undefined
			) {
				this.param.clbckValidationAutoSurEdition({
					instanceListe: this.param.instanceListe,
					appreciation: lAppr,
					periode: aParams.article,
					global: this.param.global,
					suivante: { orientationVertical: false },
				});
			}
		}
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		if (_estEditable(this, aParams)) {
			const listeAppreciations = this.param.global
				? aParams.article.listeAppreciationsGenerales
				: aParams.article.listeAppreciations;
			const D = listeAppreciations.get(aParams.declarationColonne.indice);
			return {
				tailleMax: this.moteur.getTailleMaxAppreciation({
					estCtxPied: true,
					appreciation: D,
					typeReleveBulletin: this.param.typeReleveBulletin,
					estCtxApprGenerale: this.param.global,
				}),
			};
		}
		return null;
	}
	avecSelection() {
		return true;
	}
}
DonneesListe_AppreciationsAnnuellesPdB.colonnes = {
	periode: "periode",
	evolution: "evolution",
	niveauDAcquisition: "niveauDAcquisition",
	moyenneLSU: "moyenneLSU",
	nbDevoirs: "nbDevoirs",
	nbEvals: "nbEvals",
	nbAbs: "nbAbs",
	nbRetard: "nbRetard",
	appreciation: "appreciation",
};
function _estEditable(aInstance, aParams) {
	const lColonneNonEditable = [
		DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode,
		DonneesListe_AppreciationsAnnuellesPdB.colonnes.evolution,
		DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs,
		DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs,
		DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard,
		DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals,
	];
	if (lColonneNonEditable.includes(aParams.idColonne)) {
		return false;
	}
	if (
		[
			DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition,
			DonneesListe_AppreciationsAnnuellesPdB.colonnes.moyenneLSU,
		].includes(aParams.idColonne)
	) {
		return aParams.article.Editable && !aParams.article.cloture;
	}
	const lAppreciation = aInstance.getAppreciation(aParams);
	if (lAppreciation) {
		if (aInstance.param.global) {
			return aParams.article.EditableGenerale && !lAppreciation.cloture;
		}
		return lAppreciation.Editable && !lAppreciation.cloture;
	}
	return false;
}
module.exports = { DonneesListe_AppreciationsAnnuellesPdB };
