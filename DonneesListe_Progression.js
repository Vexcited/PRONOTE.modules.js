exports.DonneesListe_Progression = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_Progression extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			nonEditable: false,
			avecSelection: true,
			avecEvnt_Selection: true,
			avecEvnt_SelectionDblClick: true,
			avecEvnt_ModificationSelection: true,
			avecContenuTronque: true,
			avecSuppression: true,
			avecEvnt_Creation: true,
			controleVisibilite: false,
		});
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Progression.colonnes.biblio:
			case DonneesListe_Progression.colonnes.partage:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Progression.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_Progression.colonnes.niveau:
				return aParams.article.niveau
					? aParams.article.niveau.getLibelle()
					: "";
			case DonneesListe_Progression.colonnes.matiere:
				return aParams.article.matiere
					? aParams.article.matiere.getLibelle()
					: "";
			case DonneesListe_Progression.colonnes.biblio:
				return !!aParams.article.estPublic;
			case DonneesListe_Progression.colonnes.partage: {
				let lAvecCo = false;
				if (
					aParams.article &&
					aParams.article.listeCoEnseignants &&
					aParams.article.listeCoEnseignants.count() > 0
				) {
					aParams.article.listeCoEnseignants.parcourir((aElement) => {
						if (
							aElement.getNumero() !==
							GEtatUtilisateur.getUtilisateur().getNumero()
						) {
							lAvecCo = true;
							return false;
						}
					});
				}
				return lAvecCo;
			}
			case DonneesListe_Progression.colonnes.professeur:
				if (
					aParams.article &&
					aParams.article.listeCoEnseignants &&
					aParams.article.listeCoEnseignants.count() > 0
				) {
					return aParams.article.listeCoEnseignants
						.getTableauLibelles()
						.sort()
						.join(", ");
				}
				return GEtatUtilisateur.getUtilisateur().getLibelle();
		}
		return "";
	}
	getTri(aColonneDeTri, aGenreTri) {
		return [
			ObjetTri_1.ObjetTri.init(
				this.getValeurPourTri.bind(this, aColonneDeTri),
				aGenreTri,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
			ObjetTri_1.ObjetTri.init("niveau.Libelle"),
			ObjetTri_1.ObjetTri.init("matiere.Libelle"),
		];
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Progression.colonnes.biblio:
				return aParams.article.estPublic
					? ObjetTraduction_1.GTraductions.getValeur(
							"progression.ProgressionDeBibliotheque",
						)
					: "";
			case DonneesListe_Progression.colonnes.partage:
			case DonneesListe_Progression.colonnes.professeur:
				if (
					aParams.article.listeCoEnseignants &&
					aParams.article.listeCoEnseignants.count() > 0
				) {
					const lTab = new ObjetListeElements_1.ObjetListeElements();
					for (let i = 0; i < aParams.article.listeCoEnseignants.count(); i++) {
						if (
							aParams.article.listeCoEnseignants.get(i).getNumero() !==
							GEtatUtilisateur.getUtilisateur().getNumero()
						) {
							lTab.addElement(aParams.article.listeCoEnseignants.get(i));
						}
					}
					lTab.trier();
					return lTab.count() > 0
						? ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"progression.PartageePar_S",
								),
								[lTab.getTableauLibelles().join(", ")],
							)
						: "";
				} else {
					return "";
				}
		}
		return "";
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Progression.colonnes.nom:
				aParams.article.Libelle = V;
				break;
			case DonneesListe_Progression.colonnes.biblio:
				aParams.article.estPublic = !!V;
				break;
			default:
		}
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_Progression.colonnes.partage &&
			this._avecEditionProgression(aParams.article)
		);
	}
	avecEdition(aParams) {
		return (
			(aParams.idColonne === DonneesListe_Progression.colonnes.nom ||
				aParams.idColonne === DonneesListe_Progression.colonnes.biblio) &&
			this._avecEditionProgression(aParams.article)
		);
	}
	surCreation(aArticle, V) {
		Object.assign(aArticle, V[1]);
		aArticle.Libelle = V[0];
		aArticle.estPublic = false;
		if (!aArticle.listeDossiers) {
			aArticle.listeDossiers = new ObjetListeElements_1.ObjetListeElements();
		}
	}
	getMessageSuppressionConfirmation(aArticle) {
		let lChaine = super.getMessageSuppressionConfirmation(aArticle);
		if (
			(aArticle.listeDossiers && aArticle.listeDossiers.count() > 0) ||
			(aArticle.listeContenus && aArticle.listeContenus.count() > 0)
		) {
			lChaine =
				ObjetTraduction_1.GTraductions.getValeur(
					"progression.progressionUtilise",
				) +
				"\n" +
				lChaine;
		}
		return lChaine;
	}
	_avecEditionProgression(aArticle) {
		if (!aArticle || this.options.nonEditable) {
			return false;
		}
		if (
			!aArticle.listeCoEnseignants ||
			aArticle.listeCoEnseignants.count() === 0
		) {
			return true;
		}
		let lResult = false;
		for (let i = 0; i < aArticle.listeCoEnseignants.count(); i++) {
			const lProf = aArticle.listeCoEnseignants.get(i);
			if (
				lProf.getNumero() === GEtatUtilisateur.getUtilisateur().getNumero() &&
				aArticle.listeCoEnseignants.get(i).proprietaire === true
			) {
				lResult = true;
				break;
			}
		}
		return lResult;
	}
	getCouleurCellule(aParams) {
		return (aParams.idColonne === DonneesListe_Progression.colonnes.partage ||
			aParams.idColonne === DonneesListe_Progression.colonnes.biblio) &&
			this._avecEditionProgression(aParams.article)
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc
			: null;
	}
	getVisible(aArticle) {
		if (!this.options.controleVisibilite) {
			return true;
		}
		return aArticle && !aArticle.nonPersonnel
			? !aArticle.estVide
				? true
				: aArticle.progressionPourCopie
			: false;
	}
}
exports.DonneesListe_Progression = DonneesListe_Progression;
(function (DonneesListe_Progression) {
	let colonnes;
	(function (colonnes) {
		colonnes["nom"] = "nom";
		colonnes["niveau"] = "niveau";
		colonnes["matiere"] = "matiere";
		colonnes["biblio"] = "biblio";
		colonnes["partage"] = "partage";
		colonnes["professeur"] = "professeur";
	})(
		(colonnes =
			DonneesListe_Progression.colonnes ||
			(DonneesListe_Progression.colonnes = {})),
	);
})(
	DonneesListe_Progression ||
		(exports.DonneesListe_Progression = DonneesListe_Progression = {}),
);
