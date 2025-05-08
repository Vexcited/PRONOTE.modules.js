const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { GTraductions } = require("ObjetTraduction.js");
class DonneesListe_BilanParDomaineLVE extends ObjetDonneesListe {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.parametres = aParametres;
		this.setOptions({
			avecDeploiement: true,
			avecImageSurColonneDeploiement: true,
			avecTri: false,
			avecSuppression: false,
			avecEvnt_KeyUpListe: true,
			editionApresSelection: false,
		});
	}
	getInfosService(aDeclarationColonne, aArticle) {
		let lInfosService = null;
		if (!!aArticle && !!aArticle.listeInfosServices) {
			let lNumeroServiceColonne = null;
			if (_estUneColonneDeServiceLVE(aDeclarationColonne)) {
				lNumeroServiceColonne = aDeclarationColonne.serviceLVE.getNumero();
				if (!!lNumeroServiceColonne) {
					aArticle.listeInfosServices.parcourir((aService) => {
						if (aService.getNumero() === lNumeroServiceColonne) {
							lInfosService = aService;
							return true;
						}
					});
				} else {
				}
			}
		}
		return lInfosService;
	}
	getCouleurCellule(aParams) {
		if (this.avecEdition(aParams)) {
			return ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		if (!!aParams.article && aParams.article.estUnDeploiement) {
			return GCouleur.liste.cumul;
		}
		return GCouleur.liste.colonneFixe;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_BilanParDomaineLVE.colonnes.libelle
		);
	}
	getClassCelluleConteneur(aParams) {
		const lClasses = [];
		if (aParams.article.estUnDeploiement) {
			lClasses.push("Gras");
		}
		if (_estUneColonneNiveau(aParams.idColonne)) {
			lClasses.push("AlignementMilieu");
		} else if (
			aParams.idColonne === DonneesListe_BilanParDomaineLVE.colonnes.libelle
		) {
			if (aParams.article.estUnDeploiement) {
				lClasses.push("AvecMain");
			}
		}
		return lClasses.join(" ");
	}
	selectionParCellule(I) {
		if (_estUneColonneNiveau(this.getId(I))) {
			return true;
		}
		return false;
	}
	avecEvenementSelectionClick(aParams) {
		if (_estUneColonneJauge(aParams.idColonne)) {
			return true;
		}
		return false;
	}
	avecEdition(aParams) {
		if (_estUneColonneNiveau(aParams.idColonne)) {
			const lInfosService = this.getInfosService(
				aParams.declarationColonne,
				aParams.article,
			);
			return !!lInfosService && !!lInfosService.estNiveauEditable;
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		return this.avecEdition(aParams);
	}
	getValeur(aParams) {
		if (_estUneColonneDeServiceLVE(aParams.declarationColonne)) {
			const lInfosService = this.getInfosService(
				aParams.declarationColonne,
				aParams.article,
			);
			if (!!lInfosService) {
				if (_estUneColonneJauge(aParams.idColonne)) {
					const lValeurCelluleJauge = [];
					if (!!lInfosService.listeNiveaux) {
						lValeurCelluleJauge.push(
							TUtilitaireCompetences.composeJaugeParNiveaux({
								listeNiveaux: lInfosService.listeNiveaux,
								hint: TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
									lInfosService.listeNiveaux,
								),
							}),
						);
					}
					return lValeurCelluleJauge.join("");
				} else if (_estUneColonneNiveau(aParams.idColonne)) {
					const lValeurCelluleNiveau = [];
					if (!lInfosService.estNiveauxMultiples) {
						if (
							DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini(
								aParams.article,
							)
						) {
							if (!!lInfosService.niveauEquivCE) {
								lValeurCelluleNiveau.push(
									lInfosService.niveauEquivCE.getLibelle(),
								);
							}
						} else {
							if (!!lInfosService.niveauAcquisition) {
								let lNiveauAcquisitionGlobal = null;
								if (GParametres.listeNiveauxDAcquisitions) {
									lNiveauAcquisitionGlobal =
										GParametres.listeNiveauxDAcquisitions.getElementParNumero(
											lInfosService.niveauAcquisition.getNumero(),
										);
								}
								if (!!lNiveauAcquisitionGlobal) {
									lValeurCelluleNiveau.push(
										EGenreNiveauDAcquisitionUtil.getImage(
											lNiveauAcquisitionGlobal,
											{ avecTitle: false },
										),
									);
								}
							}
						}
					} else {
						lValeurCelluleNiveau.push(GTraductions.getValeur("Multiple"));
					}
					return lValeurCelluleNiveau.join("");
				}
			}
			return "";
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_BilanParDomaineLVE.colonnes.libelle: {
					const lLibelle = [];
					lLibelle.push(
						"<span>",
						aParams.article.getLibelle() || "",
						"</span>",
					);
					if (
						!!this.parametres.avecMarqueursSurCptProvenantGrilleMM &&
						(!!aParams.article.estActiviteLangagiere ||
							!!aParams.article.provientGrilleMM)
					) {
						lLibelle.push('<span style="float: right;">');
						if (!!aParams.article.estActiviteLangagiere) {
							lLibelle.push(
								TUtilitaireCompetences.construitInfoActiviteLangagiere(),
							);
						} else {
							lLibelle.push(
								'<i style="color:',
								this.parametres.couleurs.grilleMM,
								';" class="icon_star"></i>',
							);
						}
						lLibelle.push("</span>");
					}
					return lLibelle.join("");
				}
			}
		}
		return "";
	}
	getTypeValeur() {
		return ObjetDonneesListe.ETypeCellule.Html;
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && !!this.parametres.callbackInitMenuContextuel;
	}
	remplirMenuContextuel(aParametres) {
		this.parametres.callbackInitMenuContextuel(aParametres);
	}
	getContenuTotal(aParams) {
		if (
			aParams.idColonne === DonneesListe_BilanParDomaineLVE.colonnes.libelle
		) {
			return GTraductions.getValeur(
				"competences.bilanpardomaine.NiveauMaitriseLVE",
			);
		} else if (_estUneColonneNiveau(aParams.idColonne)) {
			const lNiveauMaitrise = [];
			const lServiceConcerne = aParams.declarationColonne.serviceLVE;
			if (!lServiceConcerne.estNiveauxMultiples) {
				const lNiveauAcquiDomaine = lServiceConcerne
					? lServiceConcerne.niveauAcquiDomaine
					: null;
				if (!!lNiveauAcquiDomaine) {
					let lNiveauAcquisitionGlobal = null;
					if (GParametres.listeNiveauxDAcquisitions) {
						lNiveauAcquisitionGlobal =
							GParametres.listeNiveauxDAcquisitions.getElementParNumero(
								lNiveauAcquiDomaine.getNumero(),
							);
					}
					if (!!lNiveauAcquisitionGlobal) {
						lNiveauMaitrise.push(
							EGenreNiveauDAcquisitionUtil.getImage(lNiveauAcquisitionGlobal, {
								avecTitle: false,
							}),
						);
					}
				}
			} else {
				lNiveauMaitrise.push(GTraductions.getValeur("Multiple"));
			}
			return lNiveauMaitrise.join("");
		}
		return "";
	}
	getClassTotal(aParams) {
		const lClasses = [];
		if (
			aParams.idColonne === DonneesListe_BilanParDomaineLVE.colonnes.libelle
		) {
			lClasses.push("AlignementDroit");
		} else if (_estUneColonneNiveau(aParams.idColonne)) {
			lClasses.push("AlignementMilieu");
		}
		if (_avecEditionCelluleTotal(aParams)) {
			lClasses.push("AvecMain");
		}
		return lClasses.join(" ");
	}
	getTypeCelluleTotal(aParams) {
		if (_avecEditionCelluleTotal(aParams)) {
			return ObjetDonneesListe.typeCelluleTotal.editable;
		}
		return ObjetDonneesListe.typeCelluleTotal.defaut;
	}
	avecEvenementSelectionClickTotal(aParams) {
		return _avecEditionCelluleTotal(aParams);
	}
}
DonneesListe_BilanParDomaineLVE.colonnes = {
	libelle: "DLBilanLVE_libelle",
	prefixeJauge: "DLBilanLVE_jauge_",
	prefixeNiveau: "DLBilanLVE_niveau_",
};
function _estUneColonneDeServiceLVE(aDeclarationColonne) {
	return !!aDeclarationColonne && !!aDeclarationColonne.serviceLVE;
}
function _estUneColonneJauge(aColonneId) {
	return (
		aColonneId.indexOf(
			DonneesListe_BilanParDomaineLVE.colonnes.prefixeJauge,
		) === 0
	);
}
function _estUneColonneNiveau(aColonneId) {
	return (
		aColonneId.indexOf(
			DonneesListe_BilanParDomaineLVE.colonnes.prefixeNiveau,
		) === 0
	);
}
function _avecEditionCelluleTotal(aParams) {
	if (_estUneColonneNiveau(aParams.idColonne)) {
		const lServiceLVE = aParams.declarationColonne.serviceLVE;
		return !!lServiceLVE && !!lServiceLVE.niveauAcquiDomaineEditable;
	}
	return false;
}
DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini = function (
	aArticle,
) {
	return !!aArticle && aArticle.getGenre() === EGenreRessource.ElementPilier;
};
module.exports = { DonneesListe_BilanParDomaineLVE };
