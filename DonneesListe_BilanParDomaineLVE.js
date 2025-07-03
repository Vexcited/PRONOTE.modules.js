exports.DonneesListe_BilanParDomaineLVE = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_BilanParDomaineLVE extends ObjetDonneesListe_1.ObjetDonneesListe {
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
			if (this._estUneColonneDeServiceLVE(aDeclarationColonne)) {
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
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
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
		if (this._estUneColonneNiveau(aParams.idColonne)) {
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
		if (this._estUneColonneNiveau(this.getId(I))) {
			return true;
		}
		return false;
	}
	avecEvenementSelectionClick(aParams) {
		if (this._estUneColonneJauge(aParams.idColonne)) {
			return true;
		}
		return false;
	}
	avecEdition(aParams) {
		if (this._estUneColonneNiveau(aParams.idColonne)) {
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
		if (this._estUneColonneDeServiceLVE(aParams.declarationColonne)) {
			const lInfosService = this.getInfosService(
				aParams.declarationColonne,
				aParams.article,
			);
			if (!!lInfosService) {
				if (this._estUneColonneJauge(aParams.idColonne)) {
					const lValeurCelluleJauge = [];
					if (!!lInfosService.listeNiveaux) {
						lValeurCelluleJauge.push(
							UtilitaireCompetences_1.TUtilitaireCompetences.composeJaugeParNiveaux(
								{
									listeNiveaux: lInfosService.listeNiveaux,
									hint: UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
										lInfosService.listeNiveaux,
									),
								},
							),
						);
					}
					return lValeurCelluleJauge.join("");
				} else if (this._estUneColonneNiveau(aParams.idColonne)) {
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
										Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
											lNiveauAcquisitionGlobal,
											{ avecTitle: false },
										),
									);
								}
							}
						}
					} else {
						lValeurCelluleNiveau.push(
							ObjetTraduction_1.GTraductions.getValeur("Multiple"),
						);
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
								UtilitaireCompetences_1.TUtilitaireCompetences.construitInfoActiviteLangagiere(),
							);
						} else {
							lLibelle.push(
								'<i style="color:',
								this.parametres.couleurs.grilleMM,
								';" class="icon_star" role="presentation"></i>',
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
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	avecMenuContextuel(aParams) {
		return !!aParams.article && !!this.parametres.callbackInitMenuContextuel;
	}
	remplirMenuContextuel(aParams) {
		this.parametres.callbackInitMenuContextuel(aParams);
	}
	getContenuTotal(aParams) {
		if (
			aParams.idColonne === DonneesListe_BilanParDomaineLVE.colonnes.libelle
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"competences.bilanpardomaine.NiveauMaitriseLVE",
			);
		} else if (this._estUneColonneNiveau(aParams.idColonne)) {
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
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImage(
								lNiveauAcquisitionGlobal,
								{ avecTitle: false },
							),
						);
					}
				}
			} else {
				lNiveauMaitrise.push(
					ObjetTraduction_1.GTraductions.getValeur("Multiple"),
				);
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
		} else if (this._estUneColonneNiveau(aParams.idColonne)) {
			lClasses.push("AlignementMilieu");
		}
		if (this._avecEditionCelluleTotal(aParams)) {
			lClasses.push("AvecMain");
		}
		return lClasses.join(" ");
	}
	getTypeCelluleTotal(aParams) {
		if (this._avecEditionCelluleTotal(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.editable;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.defaut;
	}
	avecEvenementSelectionClickTotal(aParams) {
		return this._avecEditionCelluleTotal(aParams);
	}
	_estUneColonneDeServiceLVE(aDeclarationColonne) {
		return !!aDeclarationColonne && !!aDeclarationColonne.serviceLVE;
	}
	_estUneColonneJauge(aColonneId) {
		return (
			aColonneId.indexOf(
				DonneesListe_BilanParDomaineLVE.colonnes.prefixeJauge,
			) === 0
		);
	}
	_estUneColonneNiveau(aColonneId) {
		return (
			aColonneId.indexOf(
				DonneesListe_BilanParDomaineLVE.colonnes.prefixeNiveau,
			) === 0
		);
	}
	_avecEditionCelluleTotal(aParams) {
		if (this._estUneColonneNiveau(aParams.idColonne)) {
			const lServiceLVE = aParams.declarationColonne.serviceLVE;
			return !!lServiceLVE && !!lServiceLVE.niveauAcquiDomaineEditable;
		}
		return false;
	}
}
exports.DonneesListe_BilanParDomaineLVE = DonneesListe_BilanParDomaineLVE;
DonneesListe_BilanParDomaineLVE.unNiveauEquivalenceCEPeutEtreDefini = (
	aArticle,
) => {
	return (
		!!aArticle &&
		aArticle.getGenre() === Enumere_Ressource_1.EGenreRessource.ElementPilier
	);
};
DonneesListe_BilanParDomaineLVE.colonnes = {
	libelle: "DLBilanLVE_libelle",
	prefixeJauge: "DLBilanLVE_jauge_",
	prefixeNiveau: "DLBilanLVE_niveau_",
};
