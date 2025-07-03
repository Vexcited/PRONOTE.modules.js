exports.DonneesListe_BilanFinDeCycle = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
class DonneesListe_BilanFinDeCycle extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.optionsBilanFinDeCycle = {
			pourDecompte: false,
			affichageJaugeChronologique: false,
			estMultiJauges: false,
			avecCocheVerte: true,
			callbackClicJauge: null,
		};
		this.setOptions({
			avecSuppression: false,
			avecEvnt_ApresEdition: true,
			avecEtatSaisie: false,
		});
	}
	static estUneColonneMaitrise(aIdColonne) {
		return aIdColonne.startsWith(
			DonneesListe_BilanFinDeCycle.colonnes.prefixeNiveauAcqui,
		);
	}
	setOptionsBilanFinDeCycle(aOptions) {
		Object.assign(this.optionsBilanFinDeCycle, aOptions);
	}
	avecMenuContextuel() {
		return false;
	}
	avecTri() {
		return false;
	}
	avecEdition(aParams) {
		if (
			![
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			return false;
		}
		if (
			!this.optionsBilanFinDeCycle.pourDecompte &&
			DonneesListe_BilanFinDeCycle.estUneColonneMaitrise(aParams.idColonne)
		) {
			const lGenreColonne = this.getGenreColonneMaitrise(aParams.idColonne);
			if (
				lGenreColonne ===
					Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Dispense &&
				!aParams.article.estPilierLVE
			) {
				return false;
			}
			return aParams.article.editable && aParams.article.utilise;
		}
		return false;
	}
	jsxNodeJaugeNiveauxAcquisition(aArticle, aNumeroPeriode, aNode) {
		let lObjetJaugeConcerne = null;
		if (this.optionsBilanFinDeCycle.estMultiJauges) {
			if (aArticle.listeJaugesDePeriode) {
				lObjetJaugeConcerne =
					aArticle.listeJaugesDePeriode.getElementParNumero(aNumeroPeriode);
			}
		} else {
			lObjetJaugeConcerne = aArticle.jaugeUnique;
		}
		$(aNode).eventValidation(() => {
			if (!!this.optionsBilanFinDeCycle.callbackClicJauge) {
				this.optionsBilanFinDeCycle.callbackClicJauge(
					aArticle,
					lObjetJaugeConcerne,
				);
			}
		});
	}
	_composeJauge(
		aArticle,
		aObjetJauge,
		aHintComplementaire = "",
		aLibelle = "",
	) {
		const lAvecAffichageJaugeChrono =
			this.optionsBilanFinDeCycle.affichageJaugeChronologique;
		let lStrJauge = "";
		const lHintNiveauParNiveau = [];
		if (aHintComplementaire) {
			lHintNiveauParNiveau.push(aHintComplementaire, "\n");
		}
		lHintNiveauParNiveau.push(aObjetJauge.hintNiveaux);
		if (lAvecAffichageJaugeChrono) {
			lStrJauge =
				UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeChronologique(
					{
						listeNiveaux: aObjetJauge.listeNiveaux,
						hint: lHintNiveauParNiveau.join(""),
					},
				);
		} else {
			lStrJauge =
				UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux({
					listeNiveaux: aObjetJauge.listeNiveauxParNiveau,
					hint: lHintNiveauParNiveau.join(""),
				});
		}
		return IE.jsx.str(
			"div",
			null,
			aLibelle
				? IE.jsx.str(
						"span",
						{
							class: "InlineBlock AlignementMilieuVertical",
							style: "width: 2rem;",
						},
						aLibelle,
					)
				: "",
			lStrJauge
				? IE.jsx.str(
						"div",
						{
							role: "button",
							tabindex: "0",
							"aria-haspopup": "dialog",
							"ie-node": this.jsxNodeJaugeNiveauxAcquisition.bind(
								this,
								aArticle,
								aObjetJauge.getNumero(),
							),
							class: "InlineBlock AlignementMilieuVertical AvecMain",
							style: `width: calc(100% - ${aLibelle ? 2 : 0}rem)`,
						},
						lStrJauge,
					)
				: "",
		);
	}
	getValeur(aParams) {
		if (DonneesListe_BilanFinDeCycle.estUneColonneMaitrise(aParams.idColonne)) {
			const lGenreColonne = this.getGenreColonneMaitrise(aParams.idColonne);
			if (this.optionsBilanFinDeCycle.pourDecompte) {
				const lArticle = aParams.article;
				const lNiveauDAcquisition = lArticle.listeNiveauxDAcquisitions
					? lArticle.listeNiveauxDAcquisitions.getElementParGenre(lGenreColonne)
					: null;
				return lNiveauDAcquisition
					? lNiveauDAcquisition.nombre
					: lArticle.utilise &&
							!(
								lGenreColonne ===
									Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition
										.Dispense && !lArticle.estPilierLVE
							)
						? 0
						: "";
			} else {
				const lArticle = aParams.article;
				let lResult;
				if (
					lArticle.niveauDAcquisition &&
					lArticle.niveauDAcquisition.getGenre() === lGenreColonne
				) {
					lResult = this.optionsBilanFinDeCycle.avecCocheVerte
						? true
						: '<i class="icon_remove" role="presentation"></i>';
				} else {
					lResult = this.optionsBilanFinDeCycle.avecCocheVerte ? false : "";
				}
				return lResult;
			}
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_BilanFinDeCycle.colonnes.competences:
					return aParams.article.getLibelle();
				case DonneesListe_BilanFinDeCycle.colonnes.jauge: {
					const lArticle = aParams.article;
					const lHtmlJauges = [];
					if (this.optionsBilanFinDeCycle.estMultiJauges) {
						if (
							lArticle.listeJaugesDePeriode &&
							lArticle.listeJaugesDePeriode.count() > 0
						) {
							lHtmlJauges.push(
								'<div class="flex-contain cols" style="gap: 0.5rem;">',
							);
							lArticle.listeJaugesDePeriode.parcourir((aPeriodeJauge) => {
								lHtmlJauges.push(
									this._composeJauge(
										lArticle,
										aPeriodeJauge,
										aPeriodeJauge.libelleLong,
										aPeriodeJauge.getLibelle(),
									),
								);
							});
							lHtmlJauges.push("</div>");
						}
					} else {
						if (lArticle.jaugeUnique) {
							lHtmlJauges.push(
								this._composeJauge(lArticle, lArticle.jaugeUnique),
							);
						}
					}
					return lHtmlJauges.join("");
				}
				case DonneesListe_BilanFinDeCycle.colonnes.score: {
					const lArticle = aParams.article;
					return lArticle.scoreEleve || "";
				}
				case DonneesListe_BilanFinDeCycle.colonnes.nbPointsExamen: {
					const lArticle = aParams.article;
					return lArticle.nbPointsExamen || "";
				}
			}
			return "";
		}
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_BilanFinDeCycle.colonnes.score: {
				const lArticle = aParams.article;
				return lArticle.hintScoreEleve || "";
			}
		}
		return "";
	}
	surEdition(aParams) {
		const lArticle = aParams.article;
		lArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		let lGenreNiveau = this.getGenreColonneMaitrise(aParams.idColonne);
		if (
			lArticle.niveauDAcquisition &&
			lArticle.niveauDAcquisition.getGenre() === lGenreNiveau
		) {
			lGenreNiveau =
				Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Utilisateur;
		}
		const lNiveauAcquiGlobal =
			GParametres.listeNiveauxDAcquisitions.getElementParGenre(lGenreNiveau);
		lArticle.niveauDAcquisition = lNiveauAcquiGlobal;
	}
	getTypeValeur(aParams) {
		if (DonneesListe_BilanFinDeCycle.estUneColonneMaitrise(aParams.idColonne)) {
			return this.optionsBilanFinDeCycle.pourDecompte
				? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte
				: this.optionsBilanFinDeCycle.avecCocheVerte
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_BilanFinDeCycle.colonnes.jauge:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			}
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		const lClasses = [];
		if (DonneesListe_BilanFinDeCycle.estUneColonneMaitrise(aParams.idColonne)) {
			if (this.optionsBilanFinDeCycle.pourDecompte) {
				lClasses.push("AlignementDroit");
			} else if (!this.optionsBilanFinDeCycle.avecCocheVerte) {
				lClasses.push("AlignementMilieu");
			}
		} else if (
			aParams.idColonne === DonneesListe_BilanFinDeCycle.colonnes.score
		) {
			lClasses.push("AlignementMilieu");
		}
		return lClasses.join(" ");
	}
	getCouleurCellule(aParams) {
		return aParams.article.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.Palier
			? ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement
			: null;
	}
	getGenreColonneMaitrise(aIdColonne) {
		let lGenreColonne = -1;
		const lPrefixeColonne =
			DonneesListe_BilanFinDeCycle.colonnes.prefixeNiveauAcqui;
		const lStrGenre = aIdColonne.substring(
			lPrefixeColonne.length,
			aIdColonne.length,
		);
		if (!!lStrGenre) {
			lGenreColonne = parseInt(lStrGenre, 10);
		}
		return lGenreColonne;
	}
}
exports.DonneesListe_BilanFinDeCycle = DonneesListe_BilanFinDeCycle;
DonneesListe_BilanFinDeCycle.colonnes = {
	competences: "DLBilanFC_competences",
	jauge: "DLBilanFC_jauge",
	score: "DLBilanFC_score",
	prefixeNiveauAcqui: "DLBilanFC_maitrise_",
	nbPointsExamen: "DLBilanFC_nbPointsExam",
};
