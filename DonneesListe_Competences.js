exports.DonneesListe_Competences = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_Statut_1 = require("Enumere_Statut");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const AccessApp_1 = require("AccessApp");
class DonneesListe_Competences extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.avecSousItems = aParams.avecSousItems || false;
		this.pourCompetenceNumerique = aParams.pourCompetenceNumerique || false;
		this.afficherUniquementMesCompetences =
			aParams.afficherUniquementMesCompetences || false;
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecEvnt_ApresEdition: true,
			avecEtatSaisie: false,
			avecDeploiement: true,
			avecTri: false,
		});
	}
	setAfficherUniquementMesCompetences(aUniquementMesCompetences) {
		this.afficherUniquementMesCompetences = aUniquementMesCompetences;
	}
	getVisible(D) {
		let lEstVisible = true;
		if (this.afficherUniquementMesCompetences) {
			lEstVisible = false;
			if (!lEstVisible) {
				lEstVisible = D.estMienne;
			}
			if (!lEstVisible) {
				const lParents = [D];
				for (const lArticle of this.Donnees) {
					if (lArticle.pere && lParents.includes(lArticle.pere)) {
						if (lArticle.estMienne) {
							lEstVisible = true;
							break;
						}
						lParents.push(lArticle);
					}
				}
			}
		}
		return lEstVisible;
	}
	getIndentationCellule(aParams) {
		if (aParams.idColonne === DonneesListe_Competences.colonnes.libelle) {
			const lGenre = aParams.article.getGenre();
			if (lGenre === Enumere_Ressource_1.EGenreRessource.Competence) {
				return 10;
			} else if (lGenre === Enumere_Ressource_1.EGenreRessource.SousItem) {
				return 20;
			}
		}
		return 0;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne !== DonneesListe_Competences.colonnes.coche &&
			aParams.idColonne !== DonneesListe_Competences.colonnes.nombre
		);
	}
	avecImageSurColonneDeploiement(aParams) {
		return aParams.idColonne === DonneesListe_Competences.colonnes.libelle;
	}
	getTypeValeur(aParams) {
		if (aParams.idColonne === DonneesListe_Competences.colonnes.coche) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClass(aParams) {
		const lClasses = [];
		const lGenre = aParams.article.getGenre();
		if (
			lGenre === Enumere_Ressource_1.EGenreRessource.ElementPilier ||
			(lGenre === Enumere_Ressource_1.EGenreRessource.Competence &&
				this.avecSousItems)
		) {
			lClasses.push("Gras");
		}
		if (
			aParams.idColonne === DonneesListe_Competences.colonnes.domaines &&
			aParams.article.estListeDomainesHerites === true
		) {
			lClasses.push("Italique");
		}
		return lClasses.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (
			!!aParams.article.estUnDeploiement ||
			this._avecEditionSurSimpleClic()
		) {
			lClasses.push("AvecMain");
		}
		return lClasses.join(" ");
	}
	avecEvenementSelectionClick(aParams) {
		if (
			this._avecEditionSurSimpleClic() &&
			!!aParams.article &&
			this.lArticleEstConcernePourAjoutRelationsSurSimpleClic(
				aParams.article,
				this.avecSousItems,
			)
		) {
			return (
				aParams.idColonne === DonneesListe_Competences.colonnes.libelle ||
				aParams.idColonne === DonneesListe_Competences.colonnes.domaines ||
				aParams.idColonne === DonneesListe_Competences.colonnes.niveauLVE
			);
		}
		return false;
	}
	ajouteOuSupprimeRelationsSurSelection(aParams, aCallbackApresEdition) {
		const lAjouteRelation = aParams.article.nombreRelations === 0;
		this.controleEditionEtSaisieElementCompetence(
			aParams,
			lAjouteRelation ? 1 : 0,
			aCallbackApresEdition,
		);
	}
	avecEdition(aParams) {
		let lAvecEdition = false;
		switch (aParams.idColonne) {
			case DonneesListe_Competences.colonnes.coche:
				lAvecEdition = this.pourCompetenceNumerique
					? !aParams.article.estUnDeploiement
					: true;
				break;
			case DonneesListe_Competences.colonnes.nombre:
				lAvecEdition = aParams.article.nombreRelations > 0;
				break;
		}
		return lAvecEdition && aParams.article.getActif();
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences.colonnes.nombre:
				return { mask: "0-9", tailleMax: 3 };
		}
		return null;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences.colonnes.coche:
				this.controleEditionEtSaisieElementCompetence(aParams, V ? 1 : 0);
				break;
			case DonneesListe_Competences.colonnes.nombre:
				this.controleEditionEtSaisieElementCompetence(aParams, V);
				break;
		}
	}
	getEtatSurEdition() {
		return null;
	}
	getTableauLignesModifieesCocheTitre() {
		const T = [];
		if (this.Donnees) {
			const lAvecGestionSousItem = this.avecSousItems;
			this.Donnees.parcourir((D, aIndex) => {
				if (this._lArticleEstConcerneePourCocheTitre(D, lAvecGestionSousItem)) {
					T.push(aIndex);
				}
			});
		}
		return T;
	}
	getEtatCocheSelonFils() {
		let lEtat;
		if (this.Donnees) {
			const lAvecGestionSousItem = this.avecSousItems;
			let lEstActif;
			this.Donnees.parcourir((D) => {
				if (this._lArticleEstConcerneePourCocheTitre(D, lAvecGestionSousItem)) {
					lEstActif = D.nombreRelations > 0;
					if (lEtat === undefined) {
						lEtat = lEstActif
							? ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte
							: ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune;
					} else {
						if (
							(lEstActif &&
								lEtat ===
									ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune) ||
							(!lEstActif &&
								lEtat ===
									ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Verte)
						) {
							lEtat = ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Grise;
							return false;
						}
					}
				}
			});
		}
		return lEtat === undefined
			? ObjetDonneesListe_1.ObjetDonneesListe.EGenreCoche.Aucune
			: lEtat;
	}
	surEditionCocheTitre(aListeParamsCellule, aValeur) {
		if (!!aListeParamsCellule) {
			const lNouveauNombreRelation = aValeur ? 1 : 0;
			const lListeArticles = [];
			for (let i = 0; i < aListeParamsCellule.length; i++) {
				lListeArticles.push(aListeParamsCellule[i].article);
			}
			let lAvecAvertissement = false;
			let lAvecTestParentsEnfants;
			let lControleEditionArticle;
			for (let j = 0; j < lListeArticles.length; j++) {
				lAvecTestParentsEnfants =
					lListeArticles[j].nombreRelations === 0 && aValeur;
				lControleEditionArticle =
					this.controleEditionElementCompetenceEtParentsEnfants(
						lListeArticles[j],
						lNouveauNombreRelation,
						lAvecTestParentsEnfants,
					);
				if (lControleEditionArticle !== Enumere_Statut_1.EStatut.succes) {
					lAvecAvertissement = true;
					break;
				}
			}
			const lEffectueEditionTousArticles = () => {
				this.effectueEditionElementCompetence(
					lListeArticles,
					lNouveauNombreRelation,
				);
				for (let k = 0; k < lListeArticles.length; k++) {
					this.effectueEditionElementCompetence(
						this.getListeElementsCompetenceParentsEtEnfants(lListeArticles[k]),
						0,
					);
				}
			};
			if (lAvecAvertissement) {
				return GApplication.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"competences.message.ConfirmationSuppression",
						),
					})
					.then((AAccepte) => {
						if (AAccepte === Enumere_Action_1.EGenreAction.Valider) {
							lEffectueEditionTousArticles.call(this);
						}
					});
			} else {
				lEffectueEditionTousArticles.call(this);
			}
		}
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences.colonnes.coche:
				return aParams.article.getActif()
					? aParams.article.nombreRelations > 0
					: "";
			case DonneesListe_Competences.colonnes.nombre:
				return aParams.article.nombreRelations || "";
			case DonneesListe_Competences.colonnes.libelle: {
				const lLibelle = [aParams.article.getLibelle()];
				if (!!aParams.article.estUneActiviteLangagiere) {
					lLibelle.push('<span style="float: right">');
					lLibelle.push(
						UtilitaireCompetences_1.TUtilitaireCompetences.construitInfoActiviteLangagiere(
							{ avecHint: true },
						),
					);
					lLibelle.push("</span>");
				}
				return lLibelle.join("");
			}
			case DonneesListe_Competences.colonnes.domaines:
				return aParams.article.strListeDomaines || "";
			case DonneesListe_Competences.colonnes.niveauLVE:
				return aParams.article.nivEquivCE || "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Competences.colonnes.libelle:
				return aParams.article.LibelleLong || "";
			case DonneesListe_Competences.colonnes.domaines:
				return aParams.article.hintListeDomaines || "";
		}
		return "";
	}
	_avecEditionSurSimpleClic() {
		return this.etatUtilisateurSco.pourPrimaire();
	}
	lArticleEstConcernePourAjoutRelationsSurSimpleClic(
		aArticle,
		aAvecGestionSousItems,
	) {
		let result = false;
		if (!!aArticle) {
			if (aAvecGestionSousItems) {
				result =
					aArticle.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.SousItem ||
					!aArticle.estUnDeploiement;
			} else {
				result =
					aArticle.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Competence;
			}
		}
		return result;
	}
	effectueEditionElementCompetence(aListeArticles, aNouveauNombreRelations) {
		aListeArticles.forEach((aArticle) => {
			aArticle.nombreRelations = aNouveauNombreRelations;
		});
	}
	controleEditionElementCompetenceEtParentsEnfants(
		aArticle,
		aNouveauNombreRelations,
		aAvecTestParentsEnfants,
	) {
		let result = this.controleEditionElementCompetence(
			aArticle,
			aNouveauNombreRelations,
		);
		if (result === Enumere_Statut_1.EStatut.succes && aAvecTestParentsEnfants) {
			const lTabElementsParentsEtEnfants =
				this.getListeElementsCompetenceParentsEtEnfants(aArticle);
			for (let i = 0; i < lTabElementsParentsEtEnfants.length; i++) {
				const lControleEditionParentEnfant =
					this.controleEditionElementCompetence(
						lTabElementsParentsEtEnfants[i],
						0,
					);
				if (lControleEditionParentEnfant !== Enumere_Statut_1.EStatut.succes) {
					result = lControleEditionParentEnfant;
					if (result === Enumere_Statut_1.EStatut.erreur) {
						break;
					}
				}
			}
		}
		return result;
	}
	controleEditionElementCompetence(aArticle, aNouveauNombreRelations) {
		let resultControle = Enumere_Statut_1.EStatut.succes;
		if (aArticle.nombreRelations !== aNouveauNombreRelations) {
			if (aNouveauNombreRelations < aArticle.nombreRelations) {
				if (aNouveauNombreRelations < aArticle.nombreCompetencesEvaluees) {
					if (
						aNouveauNombreRelations === 0 ||
						aArticle.nombreCompetencesEvaluees === 1
					) {
						resultControle = Enumere_Statut_1.EStatut.avertissement;
					} else {
						resultControle = Enumere_Statut_1.EStatut.erreur;
					}
				}
			}
		}
		return resultControle;
	}
	getListeElementsCompetenceParentsEtEnfants(aArticle) {
		const result = [];
		let lPere = aArticle.pere;
		while (lPere) {
			result.push(lPere);
			lPere = lPere.pere;
		}
		const lParents = [aArticle];
		this.Donnees.parcourir((D) => {
			if (D.pere && lParents.includes(D.pere)) {
				result.push(D);
				lParents.push(D);
			}
		});
		return result;
	}
	controleEditionEtSaisieElementCompetence(
		aParams,
		aNouveauNombreRelations,
		aCallbackApresEdition,
	) {
		const lArticle = aParams.article;
		if (lArticle) {
			aNouveauNombreRelations = Math.min(
				100,
				Math.max(0, aNouveauNombreRelations),
			);
			const lSaisieSurParentsEtEnfants =
				lArticle.nombreRelations === 0 && aNouveauNombreRelations > 0;
			const lResultControleEdition =
				this.controleEditionElementCompetenceEtParentsEnfants(
					lArticle,
					aNouveauNombreRelations,
					lSaisieSurParentsEtEnfants,
				);
			if (lResultControleEdition === Enumere_Statut_1.EStatut.succes) {
				this.effectueEditionElementCompetence(
					[lArticle],
					aNouveauNombreRelations,
				);
				if (lSaisieSurParentsEtEnfants) {
					this.effectueEditionElementCompetence(
						this.getListeElementsCompetenceParentsEtEnfants(lArticle),
						0,
					);
				}
				if (!!aCallbackApresEdition) {
					aCallbackApresEdition();
				}
			} else if (
				lResultControleEdition === Enumere_Statut_1.EStatut.avertissement
			) {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"competences.message.ConfirmationSuppression",
					),
					callback: (AAccepte) => {
						if (AAccepte === Enumere_Action_1.EGenreAction.Valider) {
							this.effectueEditionElementCompetence(
								[lArticle],
								aNouveauNombreRelations,
							);
							if (lSaisieSurParentsEtEnfants) {
								this.effectueEditionElementCompetence(
									this.getListeElementsCompetenceParentsEtEnfants(lArticle),
									0,
								);
							}
							aParams.instance.actualiser(true, true);
							if (!!aCallbackApresEdition) {
								aCallbackApresEdition();
							}
						}
					},
				});
			} else {
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"competences.message.ModifNombreItemsImpossible",
						[lArticle.nombreCompetencesEvaluees],
					),
				});
			}
		}
	}
	_lArticleEstConcerneePourCocheTitre(aArticle, aAvecGestionSousItems) {
		return (
			!!aArticle &&
			(aArticle.pere ? aArticle.pere.estDeploye : true) &&
			((aAvecGestionSousItems &&
				aArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.SousItem) ||
				(!aAvecGestionSousItems &&
					aArticle.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.Competence))
		);
	}
}
exports.DonneesListe_Competences = DonneesListe_Competences;
DonneesListe_Competences.colonnes = {
	coche: "competences_coche",
	nombre: "competences_nombre",
	libelle: "competences_libelle",
	niveauLVE: "competences_niveau_lve",
	domaines: "competences_domaines",
};
