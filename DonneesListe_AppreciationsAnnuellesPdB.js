exports.DonneesListe_AppreciationsAnnuellesPdB = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetMoteurGrilleSaisie_1 = require("ObjetMoteurGrilleSaisie");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_AppreciationGenerale_1 = require("Enumere_AppreciationGenerale");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const Enumere_Evolution_1 = require("Enumere_Evolution");
const TypePositionnement_1 = require("TypePositionnement");
class DonneesListe_AppreciationsAnnuellesPdB extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.moteurGrille = new ObjetMoteurGrilleSaisie_1.ObjetMoteurGrilleSaisie();
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
			hauteurMinContenuCellule:
				ObjetDonneesListe_1.ObjetDonneesListe.hauteurMinCellule,
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
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.periode:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			default:
				return aParams.declarationColonne.genre ===
					Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_Mention
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
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
				return Enumere_Evolution_1.EGenreEvolutionUtil.getImage(
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
					return Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
						{
							niveauDAcquisition: lNiveauDAcquisition,
							genrePositionnement:
								TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
									aParams.article.typePositionnementClasse,
								),
							avecPrefixe: true,
						},
					);
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
				return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbDevoirs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbEvals:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbAbs:
			case DonneesListe_AppreciationsAnnuellesPdB.colonnes.nbRetard:
				return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
			default:
				return this._estEditable(aParams)
					? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc
					: ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
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
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (
			this._estEditable(aParams) &&
			this.moteurAssSaisie.avecAssistantSaisieActif({
				appreciation: aParams.article,
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
			this._estEditable(aParams) &&
			(aParams.declarationColonne.genre ===
				Enumere_AppreciationGenerale_1.EGenreAppreciationGenerale.AG_Mention ||
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
		return this._estEditable(aParams);
	}
	avecMenuContextuel(aParams) {
		return (
			aParams.idColonne ===
				DonneesListe_AppreciationsAnnuellesPdB.colonnes.niveauDAcquisition &&
			this._estEditable(aParams)
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
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		} else {
			const lAppr = this.getAppreciation(aParams);
			if (lAppr) {
				lAppr.setLibelle(!!V ? V.trim() : "");
				lAppr.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
					suivante: { orientationVerticale: false },
				});
			}
		}
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		if (this._estEditable(aParams)) {
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
	_estEditable(aParams) {
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
		const lAppreciation = this.getAppreciation(aParams);
		if (lAppreciation) {
			if (this.param.global) {
				return aParams.article.EditableGenerale && !lAppreciation.cloture;
			}
			return lAppreciation.Editable && !lAppreciation.cloture;
		}
		return false;
	}
}
exports.DonneesListe_AppreciationsAnnuellesPdB =
	DonneesListe_AppreciationsAnnuellesPdB;
(function (DonneesListe_AppreciationsAnnuellesPdB) {
	let colonnes;
	(function (colonnes) {
		colonnes["periode"] = "periode";
		colonnes["evolution"] = "evolution";
		colonnes["niveauDAcquisition"] = "niveauDAcquisition";
		colonnes["moyenneLSU"] = "moyenneLSU";
		colonnes["nbDevoirs"] = "nbDevoirs";
		colonnes["nbEvals"] = "nbEvals";
		colonnes["nbAbs"] = "nbAbs";
		colonnes["nbRetard"] = "nbRetard";
		colonnes["appreciation"] = "appreciation";
	})(
		(colonnes =
			DonneesListe_AppreciationsAnnuellesPdB.colonnes ||
			(DonneesListe_AppreciationsAnnuellesPdB.colonnes = {})),
	);
})(
	DonneesListe_AppreciationsAnnuellesPdB ||
		(exports.DonneesListe_AppreciationsAnnuellesPdB =
			DonneesListe_AppreciationsAnnuellesPdB =
				{}),
);
