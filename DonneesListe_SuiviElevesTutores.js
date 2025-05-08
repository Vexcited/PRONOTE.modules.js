exports.DonneesListe_SuiviElevesTutores = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_SuiviElevesTutores extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecDeploiement: true,
			avecEdition: false,
			avecSuppression: false,
			avecTri: false,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	avecEvenementSelection(aParams) {
		return !aParams.article.estUnDeploiement;
	}
	avecEvenementSelectionDblClick(aParams) {
		return this._estUneColonneRecapVieScolaire(aParams.idColonne);
	}
	avecImageSurColonneDeploiement(aParams) {
		return aParams.idColonne === DonneesListe_SuiviElevesTutores.colonnes.nom;
	}
	getCouleurCellule(aParams) {
		if (aParams.article.estUnDeploiement) {
			let lNbPeresAuDessus = 0;
			let lArticle = aParams.article;
			while (!!lArticle && !!lArticle.pere) {
				lNbPeresAuDessus++;
				lArticle = lArticle.pere;
				if (lNbPeresAuDessus >= 10) {
					break;
				}
			}
			return GCouleur.liste.cumul[lNbPeresAuDessus];
		}
	}
	getColonneDeFusion(aParams) {
		if (aParams.article.estUnDeploiement) {
			return DonneesListe_SuiviElevesTutores.colonnes.nom;
		}
		return null;
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		lClasses.push("AvecMain");
		if (aParams.article.estUnDeploiement) {
			lClasses.push("Gras");
		} else {
			if (this._estUneColonneRecapVieScolaire(aParams.idColonne)) {
				lClasses.push("AlignementMilieu");
				lClasses.push("Gras");
			} else if (
				this._estUneColonneMatiere(aParams.idColonne) ||
				aParams.idColonne ===
					DonneesListe_SuiviElevesTutores.colonnes.moyenneG ||
				aParams.idColonne ===
					DonneesListe_SuiviElevesTutores.colonnes.moyenneTroncCommun
			) {
				lClasses.push("AlignementDroit");
			}
		}
		return lClasses.join(" ");
	}
	getValeur(aParams) {
		if (this._estUneColonneMatiere(aParams.idColonne)) {
			let lNoteDeMatiere = null;
			const lMatiereEleve = this._getMatiereEleveDeColonneId(aParams);
			if (!!lMatiereEleve) {
				if (lMatiereEleve.nbServices > 0) {
					lNoteDeMatiere = lMatiereEleve.note;
				} else {
					lNoteDeMatiere = '<i class="icon_warning_sign"></i>';
				}
			}
			return !!lNoteDeMatiere ? lNoteDeMatiere : "-";
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_SuiviElevesTutores.colonnes.nom:
					return aParams.article.nom;
				case DonneesListe_SuiviElevesTutores.colonnes.prenom:
					return aParams.article.prenom;
				case DonneesListe_SuiviElevesTutores.colonnes.classe:
					return aParams.article.strClasse || "";
				case DonneesListe_SuiviElevesTutores.colonnes.dateNaissance: {
					let lStrDateNaissance = "";
					if (!!aParams.article.dateNaissance) {
						lStrDateNaissance = ObjetDate_1.GDate.formatDate(
							aParams.article.dateNaissance,
							"%JJ/%MM/%AAAA",
						);
					}
					return lStrDateNaissance;
				}
				case DonneesListe_SuiviElevesTutores.colonnes.moyenneG:
					return aParams.article.moyGenerale
						? aParams.article.moyGenerale.toString()
						: "";
				case DonneesListe_SuiviElevesTutores.colonnes.moyenneTroncCommun:
					return aParams.article.moyTroncCommun
						? aParams.article.moyTroncCommun.toString()
						: "";
				case DonneesListe_SuiviElevesTutores.colonnes.absences: {
					const lNbAbs = aParams.article.nbAbsences || 0;
					return lNbAbs > 0 ? lNbAbs : "";
				}
				case DonneesListe_SuiviElevesTutores.colonnes.retards: {
					const lNbRet = aParams.article.nbRetards || 0;
					return lNbRet > 0 ? lNbRet : "";
				}
				case DonneesListe_SuiviElevesTutores.colonnes.punitions: {
					const lNbPun = aParams.article.nbPunitions || 0;
					return lNbPun > 0 ? lNbPun : "";
				}
				case DonneesListe_SuiviElevesTutores.colonnes.sanctions: {
					const lNbSanct = aParams.article.nbSanctions || 0;
					return lNbSanct > 0 ? lNbSanct : "";
				}
			}
		}
	}
	getHintForce(aParams) {
		if (this._estUneColonneMatiere(aParams.idColonne)) {
			const lMatiereEleve = this._getMatiereEleveDeColonneId(aParams);
			if (!!lMatiereEleve) {
				if (!!lMatiereEleve.hint) {
					return lMatiereEleve.hint;
				}
			} else {
				return ObjetTraduction_1.GTraductions.getValeur(
					"SuiviElevesTutores.ListeEleves.HintEleveSansOption",
				);
			}
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_SuiviElevesTutores.colonnes.moyenneTroncCommun:
					return aParams.article.hintMoyenneTC || "";
			}
		}
	}
	getIndentationCellule(aParams) {
		if (aParams.idColonne === DonneesListe_SuiviElevesTutores.colonnes.nom) {
			if (
				aParams.article.getGenre() !== Enumere_Ressource_1.EGenreRessource.Eleve
			) {
				return this.getIndentationCelluleSelonParente(aParams);
			}
		}
		return 0;
	}
	_estUneColonneMatiere(aIdColonne) {
		return (
			aIdColonne.indexOf(
				DonneesListe_SuiviElevesTutores.colonnes.prefixeMatieres,
			) === 0
		);
	}
	_estUneColonneRecapVieScolaire(aIdColonne) {
		return [
			DonneesListe_SuiviElevesTutores.colonnes.absences,
			DonneesListe_SuiviElevesTutores.colonnes.retards,
			DonneesListe_SuiviElevesTutores.colonnes.punitions,
			DonneesListe_SuiviElevesTutores.colonnes.sanctions,
		].includes(aIdColonne);
	}
	_getMatiereEleveDeColonneId(aParams) {
		let lMatiereEleve = null;
		if (this._estUneColonneMatiere(aParams.idColonne)) {
			const lListeMatieresEleve = aParams.article.listeMatieresEleve;
			const lMatiereConcernee = aParams.declarationColonne.matiereConcernee;
			if (!!lListeMatieresEleve && !!lMatiereConcernee) {
				lMatiereEleve = lListeMatieresEleve.getElementParNumero(
					lMatiereConcernee.getNumero(),
				);
			}
		}
		return lMatiereEleve;
	}
}
exports.DonneesListe_SuiviElevesTutores = DonneesListe_SuiviElevesTutores;
DonneesListe_SuiviElevesTutores.colonnes = {
	nom: "DLSuivisElevesTutores_nom",
	prenom: "DLSuivisElevesTutores_prenom",
	classe: "DLSuivisElevesTutores_classe",
	dateNaissance: "DLSuivisElevesTutores_naissance",
	moyenneG: "DLSuivisElevesTutores_moyg",
	moyenneTroncCommun: "DLSuivisElevesTutores_moytc",
	prefixeMatieres: "DLSuivisElevesTutores_mat_",
	absences: "DLSuivisElevesTutores_abs",
	retards: "DLSuivisElevesTutores_ret",
	punitions: "DLSuivisElevesTutores_pun",
	sanctions: "DLSuivisElevesTutores_san",
};
