exports.DonneesListe_ReleveDeNotes = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetMoteurGrilleSaisie_1 = require("ObjetMoteurGrilleSaisie");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetListe_1 = require("ObjetListe");
const TypePositionnement_1 = require("TypePositionnement");
const UtilitaireDuree_1 = require("UtilitaireDuree");
class DonneesListe_ReleveDeNotes extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurGrille = new ObjetMoteurGrilleSaisie_1.ObjetMoteurGrilleSaisie();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.param = $.extend(
			{
				instanceListe: null,
				affichage: null,
				saisie: false,
				moyGenerale: null,
				avecCorrige: null,
				clbckCorrigeQCM: null,
				clbckCalculMoy: null,
			},
			aParam,
		);
		if (this.param.instanceListe !== null && this.param.affichage !== null) {
			this.initOptions(this.param.instanceListe);
		}
		this.setOptions({
			avecDeploiement: true,
			avecTri: false,
			avecSuppression: false,
			avecEdition: false,
			avecEvnt_KeyUpListe: false,
			avecEvnt_ApresEdition: true,
			avecEtatSaisie: false,
		});
	}
	jsxNodeCorrigeQCM(aDevoir, aNode) {
		$(aNode).eventValidation(() => {
			if (aDevoir) {
				this.param.clbckCorrigeQCM.call(this, aDevoir.executionQCM);
			}
		});
	}
	jsxGetNodeCalculMoy(aParams, aEstTotal, aNode) {
		$(aNode).eventValidation(() => {
			const lArticle = !aEstTotal ? aParams.article : this.param.moyGenerale;
			const lParamEvnt = {
				service: lArticle.estUnDeploiement ? lArticle.surMatiere : lArticle,
				moyenneTrimestrielle:
					aParams.idColonne ===
					DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
			};
			if (this._estColMoyPeriode(aParams.idColonne)) {
				const lIndice = aParams.declarationColonne.indice;
				$.extend(lParamEvnt, {
					periode: this.param.affichage.listePeriodes.get(lIndice),
				});
			}
			this.param.clbckCalculMoy.call(this, lParamEvnt);
		});
	}
	_getPeriode(aParams) {
		if (this._estColMoyPeriode(aParams.idColonne)) {
			const lNumero = aParams.declarationColonne.numeroPeriode;
			return aParams.article.ListeMoyennesPeriodes
				? aParams.article.ListeMoyennesPeriodes.getElementParNumero(lNumero)
						.MoyennePeriode
				: aParams.article.surMatiere &&
						aParams.article.surMatiere.ListeMoyennesPeriodes
					? aParams.article.surMatiere.ListeMoyennesPeriodes.getElementParNumero(
							lNumero,
						).MoyennePeriode
					: null;
		}
	}
	_getMoyNRPeriode(aParams) {
		let lPeriode;
		if (this._estColMoyPeriode(aParams.idColonne)) {
			const lNumero = aParams.declarationColonne.numeroPeriode;
			lPeriode = aParams.article.ListeMoyennesPeriodes
				? aParams.article.ListeMoyennesPeriodes.getElementParNumero(lNumero)
				: aParams.article.surMatiere &&
						aParams.article.surMatiere.ListeMoyennesPeriodes
					? aParams.article.surMatiere.ListeMoyennesPeriodes.getElementParNumero(
							lNumero,
						)
					: null;
		}
		if (lPeriode !== null && lPeriode !== undefined) {
			return lPeriode.estMoyNR;
		}
	}
	_getDevoir(aParams) {
		if (this._estColDevoir(aParams.idColonne)) {
			const lIndice = aParams.declarationColonne.indice;
			return aParams.article.ListeDevoirs
				? aParams.article.ListeDevoirs.get(lIndice)
				: null;
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.regroupement:
				return aParams.article.estUnDeploiement === true
					? ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.CocheDeploiement
					: ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
			case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneSup: {
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			}
			case DonneesListe_ReleveDeNotes.colonnes.appreciation:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			default: {
				if (this._estColMoyPeriode(aParams.idColonne)) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				}
			}
		}
	}
	getValeur(aParams) {
		let lService;
		const lMoy = this._getMoyenne(aParams.ligne, aParams.article, aParams);
		if (aParams.article && aParams.article.estUnDeploiement) {
			let lSurMatiere = aParams.article.surMatiere;
			switch (aParams.idColonne) {
				case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
					return this.moteur.composeHtmlNote({
						note: null,
						niveauDAcquisition: lSurMatiere.NiveauDAcquisition,
						genrePositionnement:
							TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
								lSurMatiere.TypePositionnementClasse,
							),
						avecPrefixe: false,
					});
				case DonneesListe_ReleveDeNotes.colonnes.pts:
					return !!lSurMatiere.NombrePointsEleve &&
						lSurMatiere.NombrePointsEleve.getValeur() > 0
						? this.moteur.getStrNote(lSurMatiere.NombrePointsEleve)
						: "";
				case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
					return lSurMatiere.MoyenneEleve
						? this.moteur.composeHtmlLienNoteCalculMoyenne({
								note: lSurMatiere.MoyenneEleve,
								estUnDeploiement: true,
								JSXFuncNode: this.jsxGetNodeCalculMoy.bind(
									this,
									aParams,
									false,
								),
							})
						: "";
				case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
					return lSurMatiere.MoyenneClasse;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
					return lSurMatiere.MoyenneMediane;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
					return lSurMatiere.MoyenneInf;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
					return lSurMatiere.MoyenneSup;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
					return lSurMatiere.MoyenneAnnuelle
						? this.moteur.composeHtmlLienNoteCalculMoyenne({
								note: lSurMatiere.MoyenneAnnuelle,
								estUnDeploiement: true,
								JSXFuncNode: this.jsxGetNodeCalculMoy.bind(
									this,
									aParams,
									false,
								),
							})
						: "";
				case DonneesListe_ReleveDeNotes.colonnes.service:
					return aParams.article.getLibelle();
				case DonneesListe_ReleveDeNotes.colonnes.volumeHoraire:
					return lSurMatiere.volumeHoraire
						? UtilitaireDuree_1.TUtilitaireDuree.dureeEnHeuresMinutes(
								lSurMatiere.volumeHoraire,
							).toString("%xh%sh%om")
						: "";
				case DonneesListe_ReleveDeNotes.colonnes.coefficient:
					return lSurMatiere.Coefficient || "";
				case DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees:
					return lSurMatiere.heureCoursManquees
						? UtilitaireDuree_1.TUtilitaireDuree.dureeEnHeuresMinutes(
								lSurMatiere.heureCoursManquees,
							).toString("%xh%sh%om")
						: "";
				default:
					if (this._estColMoyPeriode(aParams.idColonne)) {
						if (lMoy) {
							return this.moteur.composeHtmlLienNoteCalculMoyenne({
								note: lMoy,
								estUnDeploiement: true,
								JSXFuncNode: this.jsxGetNodeCalculMoy.bind(
									this,
									aParams,
									false,
								),
							});
						}
					}
					return "";
			}
		}
		let T = [];
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.regroupement:
				return "";
			case DonneesListe_ReleveDeNotes.colonnes.service: {
				lService = aParams.article.estService
					? aParams.article
					: aParams.article.estPremier
						? aParams.article.service
						: null;
				return this.moteur.composeHtmlService({
					service: lService,
					nbrMaxProfesseurs: DonneesListe_ReleveDeNotes.dimensions.nbMaxProfs,
				});
			}
			case DonneesListe_ReleveDeNotes.colonnes.sousService: {
				lService = aParams.article.estService ? null : aParams.article;
				return this.moteur.composeHtmlService({
					service: lService,
					nbrMaxProfesseurs: DonneesListe_ReleveDeNotes.dimensions.nbMaxProfs,
				});
			}
			case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle: {
				T = [];
				if (aParams.article.estMoyAnnuelleNR === true) {
					T.push(this.moteur.composeHtmlMoyNR());
				}
				if (lMoy !== null && lMoy !== undefined) {
					T.push(
						this.moteur.composeHtmlLienNoteCalculMoyenne({
							note: lMoy,
							JSXFuncNode: this.jsxGetNodeCalculMoy.bind(this, aParams, false),
						}),
					);
				}
				return T.join("");
			}
			case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
				return this.moteur.composeHtmlNote({
					note: null,
					niveauDAcquisition: aParams.article.NiveauDAcquisition,
					genrePositionnement:
						TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
							aParams.article.TypePositionnementClasse,
						),
					avecPrefixe: false,
				});
			case DonneesListe_ReleveDeNotes.colonnes.pts:
				return !!aParams.article.NombrePointsEleve &&
					aParams.article.NombrePointsEleve.getValeur() > 0
					? this.moteur.getStrNote(aParams.article.NombrePointsEleve)
					: "";
			case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve: {
				T = [];
				if (aParams.article.estMoyNR === true) {
					T.push(this.moteur.composeHtmlMoyNR());
				}
				if (
					aParams.article.MoyenneEleve !== null &&
					aParams.article.MoyenneEleve !== undefined
				) {
					T.push(
						this.moteur.composeHtmlLienNoteCalculMoyenne({
							note: lMoy,
							JSXFuncNode: this.jsxGetNodeCalculMoy.bind(this, aParams, false),
						}),
					);
				}
				return T.join("");
			}
			case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
			case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
				return lMoy;
			case DonneesListe_ReleveDeNotes.colonnes.appreciation: {
				const lAppr = this.moteur.getApprDeService({
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
					article: aParams.article,
				}).appreciation;
				return lAppr !== null ? lAppr.getLibelle() : "";
			}
			case DonneesListe_ReleveDeNotes.colonnes.volumeHoraire:
				return aParams.article.volumeHoraire
					? UtilitaireDuree_1.TUtilitaireDuree.dureeEnHeuresMinutes(
							aParams.article.volumeHoraire,
						).toString("%xh%sh%om")
					: "";
			case DonneesListe_ReleveDeNotes.colonnes.coefficient:
				return aParams.article.Coefficient || "";
			case DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees:
				return aParams.article.heureCoursManquees
					? UtilitaireDuree_1.TUtilitaireDuree.dureeEnHeuresMinutes(
							aParams.article.heureCoursManquees,
						).toString("%xh%sh%om")
					: "";
			default: {
				if (this._estColMoyPeriode(aParams.idColonne)) {
					T = [];
					const lPeriode = lMoy;
					const lEstMoyNRPeriode = this._getMoyNRPeriode(aParams);
					if (lEstMoyNRPeriode === true) {
						T.push(this.moteur.composeHtmlMoyNR());
					}
					if (lPeriode) {
						T.push(
							this.moteur.composeHtmlLienNoteCalculMoyenne({
								note: lMoy,
								JSXFuncNode: this.jsxGetNodeCalculMoy.bind(
									this,
									aParams,
									false,
								),
							}),
						);
					}
					return T.join("");
				} else if (this._estColDevoir(aParams.idColonne)) {
					const lDevoir = this._getDevoir(aParams);
					const lAvecLigneCoeff = this.param.affichage.avecDevoirsCoefficient
						? this._existeDevoirSansCoeffParDefaut(aParams)
						: false;
					return this.moteur.composeHtmlDevoir({
						devoir: lDevoir,
						avecCorrige: this.param.avecCorrige,
						avecDevoirsDate: this.param.affichage.avecDevoirsDate,
						avecDevoirsCoefficient:
							this.param.affichage.avecDevoirsCoefficient && lAvecLigneCoeff,
						jsxFuncNodeCorrigeQCM: this.jsxNodeCorrigeQCM.bind(this, lDevoir),
					});
				}
			}
		}
		return "";
	}
	estCelluleWAIRowHeader(aParams) {
		if (aParams.article.estUnDeploiement) {
			return false;
		}
		return aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.service;
	}
	getVisible(D) {
		return !D.estSurMatiere;
	}
	getClass(aParams) {
		const D = aParams.article;
		const T = [];
		if (!D.estUnDeploiement) {
			if (
				[
					DonneesListe_ReleveDeNotes.colonnes.service,
					DonneesListe_ReleveDeNotes.colonnes.sousService,
				].includes(aParams.idColonne)
			) {
				if (
					(!D.estImprimable || !D.Actif) &&
					(D.estService ||
						aParams.idColonne !== DonneesListe_ReleveDeNotes.colonnes.service ||
						D.service.nbSousServicesActifs === 0)
				) {
					T.push("color-neutre-foncee");
				}
			}
		}
		return T.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (this._estColAvecGras(aParams)) {
			T.push("Gras");
		}
		if (this._estColAvecAlignementDroit(aParams)) {
			T.push("AlignementDroit");
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.appreciation: {
				const lAvecCurseurInterdiction =
					!this.param.estEnConsultation && !this._estCellEditable(aParams);
				if (lAvecCurseurInterdiction) {
					T.push("AvecInterdiction");
				} else {
					if (
						this.moteurAssSaisie.avecAssistantSaisieActif({
							typeReleveBulletin:
								TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
						})
					) {
						T.push("Curseur_AssistantSaisieActif");
					} else if (!this.param.estEnConsultation) {
						T.push("AvecMain");
					}
				}
				break;
			}
		}
		return T.join(" ");
	}
	getStyle(aParams) {
		let lCouleurFacultatif = null;
		if (
			this._estColDevoir(aParams.idColonne) &&
			this.param.affichage.NombreMoyennesPeriodes > 0
		) {
			const lDevoir = this._getDevoir(aParams);
			if (lDevoir) {
				lCouleurFacultatif = lDevoir.couleur;
			}
		}
		return lCouleurFacultatif
			? "border-top:" + lCouleurFacultatif + " 0.33rem solid;"
			: "";
	}
	avecBordureDroite(aParams) {
		if (
			aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
		) {
			return !this._estCelluleDeploiement(aParams);
		}
		if (aParams && aParams.article && aParams.article.estUnDeploiement) {
			return false;
		}
		return ![DonneesListe_ReleveDeNotes.colonnes.service].includes(
			aParams.idColonne,
		);
	}
	avecBordureBas(aParams) {
		const D = aParams.article;
		if (!D.estUnDeploiement) {
			switch (aParams.idColonne) {
				case DonneesListe_ReleveDeNotes.colonnes.sousService: {
					const lService =
						!D.estService || D.estServicePereAvecSousService ? D : null;
					if (lService !== null) {
						return D.estDernier || (D.estService && !D.avecSousServiceAffiche);
					}
				}
			}
		}
		return true;
	}
	fusionCelluleAvecLignePrecedente(aParams) {
		if (
			aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
		) {
			if (this._estCelluleDeploiement(aParams.celluleLignePrecedente)) {
				return false;
			}
			return (
				!aParams.article.estUnDeploiement && !!aParams.article.regroupement
			);
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.service:
				return (
					!aParams.article.estService &&
					!aParams.article.estPremier &&
					!aParams.article.estUnDeploiement
				);
			case DonneesListe_ReleveDeNotes.colonnes.appreciation:
				return (
					!aParams.article.estUnDeploiement &&
					!aParams.article.avecAppreciationParSousService &&
					!aParams.article.estService &&
					!aParams.article.estPremier
				);
		}
		return false;
	}
	getColonneDeFusion(aParams) {
		if (
			aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement &&
			!aParams.article.estUnDeploiement &&
			!aParams.article.regroupement
		) {
			return DonneesListe_ReleveDeNotes.colonnes.service;
		}
	}
	getHauteurMinCellule(aParams) {
		if (
			aParams &&
			aParams.article &&
			(aParams.article.estUnDeploiement ||
				aParams.article.estServicePereAvecSousService)
		) {
			return DonneesListe_ReleveDeNotes.dimensions.hauteurTitre;
		}
		return this.options.hauteurMinCellule;
	}
	getTooltip(aParams) {
		var _a, _b;
		if (this._estColDevoir(aParams.idColonne)) {
			const lDevoir = this._getDevoir(aParams);
			if (lDevoir) {
				return (_b =
					(_a = lDevoir.Hint) === null || _a === void 0
						? void 0
						: _a.enleverEntites) === null || _b === void 0
					? void 0
					: _b.call(_a);
			}
		} else if (
			this._estDonneeEditable(aParams) &&
			this._estDonneeCloture(aParams)
		) {
			return ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee");
		}
	}
	getCouleurCellule(aParams) {
		if (
			aParams.article.estUnDeploiement ||
			(aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement &&
				aParams.article.regroupement)
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		if (this._estColFixe(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
		}
		if (this._estColCouleurTotal(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Total;
		}
		if (this._estColDevoir(aParams.idColonne)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		return null;
	}
	avecMenuContextuel() {
		return false;
	}
	avecSelection(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			aParams.idColonne !== DonneesListe_ReleveDeNotes.colonnes.regroupement
		);
	}
	avecEvenementSelection(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.devoir: {
				const lDevoir = this._getDevoir(aParams);
				if (lDevoir) {
					if (
						this.param.avecCorrige &&
						lDevoir.executionQCM &&
						lDevoir.executionQCM.publierCorrige
					) {
						return true;
					}
				}
				return false;
			}
		}
	}
	avecEdition(aParams) {
		return this._estCellEditable(aParams);
	}
	avecEvenementEdition(aParams) {
		if (!this._estColEditable(aParams) || !this._estDonneeEditable(aParams)) {
			return false;
		}
		if (this._estDonneeCloture(aParams)) {
			return true;
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.appreciation:
				return (
					this._estCellEditable(aParams) &&
					this.moteurAssSaisie.avecAssistantSaisieActif({
						typeReleveBulletin:
							TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
					})
				);
		}
		return false;
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.appreciation:
				return { tailleMax: this.param.tailleMaxAppreciation };
			default:
				return null;
		}
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.appreciation: {
				const lData = this.moteur.getApprDeService({
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
					article: aParams.article,
				});
				const lService = lData.service;
				const lAppr = lData.appreciation;
				if (lAppr) {
					lAppr.setLibelle(!!V ? V.trim() : "");
					lAppr.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lService.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				break;
			}
		}
	}
	getContenuTotal(aParams) {
		if (this.param.moyGenerale) {
			switch (aParams.idColonne) {
				case DonneesListe_ReleveDeNotes.colonnes.service:
					return this.param.affichage.AvecSousService
						? ""
						: ObjetTraduction_1.GTraductions.getValeur("MoyenneGenerale");
				case DonneesListe_ReleveDeNotes.colonnes.sousService:
					return ObjetTraduction_1.GTraductions.getValeur("MoyenneGenerale");
				case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
					return this.moteur.composeHtmlLienNoteCalculMoyenne({
						note: this.param.moyGenerale.MoyenneEleve,
						JSXFuncNode: this.jsxGetNodeCalculMoy.bind(this, aParams, true),
					});
				case DonneesListe_ReleveDeNotes.colonnes.pts:
					return !!this.param.moyGenerale.NombrePointsEleve &&
						this.param.moyGenerale.NombrePointsEleve.getValeur() > 0
						? this.moteur.getStrNote(this.param.moyGenerale.NombrePointsEleve)
						: "";
				case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
					return this.param.moyGenerale.MoyenneClasse;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
					return this.param.moyGenerale.MoyenneMediane;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
					return this.param.moyGenerale.MoyenneInf;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
					return this.param.moyGenerale.MoyenneSup;
				case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
					return this.moteur.composeHtmlLienNoteCalculMoyenne({
						note: this.param.moyGenerale.MoyenneAnnuelle,
						JSXFuncNode: this.jsxGetNodeCalculMoy.bind(this, aParams, true),
					});
				default:
					if (this._estColMoyPeriode(aParams.idColonne)) {
						const lNumero = aParams.declarationColonne.numeroPeriode;
						const lMoy =
							this.param.moyGenerale.ListeMoyennesPeriodes &&
							this.param.moyGenerale.ListeMoyennesPeriodes.count()
								? this.param.moyGenerale.ListeMoyennesPeriodes.getElementParNumero(
										lNumero,
									).MoyennePeriode
								: null;
						return lMoy
							? this.moteur.composeHtmlLienNoteCalculMoyenne({
									note: lMoy,
									JSXFuncNode: this.jsxGetNodeCalculMoy.bind(
										this,
										aParams,
										true,
									),
								})
							: "";
					}
					return "";
			}
		}
	}
	getTypeCelluleTotal(aParams) {
		if (this.param.moyGenerale) {
			switch (aParams.idColonne) {
				case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
				case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
				case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
				case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
				case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
				case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
				case DonneesListe_ReleveDeNotes.colonnes.pts:
				case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
					return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.defaut;
				default:
					if (this._estColMoyPeriode(aParams.idColonne)) {
						return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal
							.defaut;
					}
					return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.fond;
			}
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.fond;
	}
	getClassTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.service:
			case DonneesListe_ReleveDeNotes.colonnes.sousService:
				return "AlignementDroit";
			default:
				return "AlignementDroit Gras";
		}
	}
	getColonneDeFusionTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.service:
				return DonneesListe_ReleveDeNotes.colonnes.sousService;
		}
		return null;
	}
	avecDeploiementSurColonne(aParams) {
		return (
			aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
		);
	}
	getPadding(aParams) {
		if (
			aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement
		) {
			return 4;
		}
	}
	initOptions(aInstance) {
		aInstance.setOptionsListe({
			colonnes: this.getColonnesOrdonneesSelonContexte(),
			scrollHorizontal: true,
			avecLigneTotal: this.param.affichage.AvecMoyenneGenerale,
			colonnesTriables: false,
			hauteurAdapteContenu: true,
			nonEditableSurModeExclusif: true,
		});
	}
	getTitreColSectionEleve(aSurTitre, aCol, aNbColDansSection, aLibelleMoy) {
		let lStr = "";
		switch (aCol) {
			case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
				lStr = aSurTitre
					? aNbColDansSection > 1
						? ObjetTraduction_1.GTraductions.getValeur("Eleve")
						: aLibelleMoy
					: aNbColDansSection > 1
						? aLibelleMoy
						: ObjetTraduction_1.GTraductions.getValeur("Eleve");
				break;
			case DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve:
				lStr = aSurTitre
					? aNbColDansSection > 1
						? ObjetTraduction_1.GTraductions.getValeur("Eleve")
						: ""
					: ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pos");
				break;
			case DonneesListe_ReleveDeNotes.colonnes.pts:
				lStr = aSurTitre
					? ObjetTraduction_1.GTraductions.getValeur("Eleve")
					: ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pts");
				break;
		}
		return aSurTitre
			? { libelle: lStr, avecFusionColonne: true }
			: { libelle: lStr };
	}
	ajouterColSectionEleve(
		aColonnes,
		aCondition,
		aCol,
		aNbColDansSectionEleve,
		aSansSurTitreSiSeul,
		aLibelleMoy,
		aHint,
	) {
		if (aCondition) {
			const lDimensions = DonneesListe_ReleveDeNotes.dimensions;
			let lTitre = this.getTitreColSectionEleve(
				false,
				aCol,
				aNbColDansSectionEleve,
				aLibelleMoy,
			);
			let lSurTitre = this.getTitreColSectionEleve(
				true,
				aCol,
				aNbColDansSectionEleve,
				aLibelleMoy,
			);
			let lColSeule = aNbColDansSectionEleve === 1;
			aColonnes.push({
				id: aCol,
				taille: lDimensions.largeurNote,
				titre: aSansSurTitreSiSeul && lColSeule ? lTitre : [lSurTitre, lTitre],
				hint: aHint,
			});
		}
	}
	ajouterColsSectionEleve(aColonnes, aLibelleMoy) {
		const lAffichage = this.param.affichage;
		let lNbColDansSectionEleve =
			Number(lAffichage.AvecNombrePointsEleve) +
			Number(lAffichage.AvecNivMaitriseEleve) +
			Number(lAffichage.AvecMoyenneEleve);
		if (lNbColDansSectionEleve > 0) {
			this.ajouterColSectionEleve(
				aColonnes,
				lAffichage.AvecNombrePointsEleve,
				DonneesListe_ReleveDeNotes.colonnes.pts,
				lNbColDansSectionEleve,
				false,
				"",
				ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.PtsHint"),
			);
			this.ajouterColSectionEleve(
				aColonnes,
				lAffichage.AvecNivMaitriseEleve,
				DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve,
				lNbColDansSectionEleve,
				true,
				"",
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.HintPositionnement",
				),
			);
			this.ajouterColSectionEleve(
				aColonnes,
				lAffichage.AvecMoyenneEleve,
				DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
				lNbColDansSectionEleve,
				false,
				aLibelleMoy,
				"",
			);
		}
	}
	getColonnesOrdonneesSelonContexte() {
		const lDimensions = DonneesListe_ReleveDeNotes.dimensions;
		const lAffichage = this.param.affichage;
		const lColonnes = [];
		let lIdCol;
		lColonnes.push({
			id: DonneesListe_ReleveDeNotes.colonnes.regroupement,
			taille: lDimensions.largeurRegroupement,
			titre: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
		});
		lColonnes.push({
			id: DonneesListe_ReleveDeNotes.colonnes.service,
			taille: lDimensions.largeurService,
			titre: {
				libelle: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
				avecFusionColonne: true,
			},
		});
		if (lAffichage.AvecSousService) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.sousService,
				taille: lDimensions.largeurSousService,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur("Matieres"),
					avecFusionColonne: true,
				},
			});
		}
		if (lAffichage.AvecVolumeHoraire) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.volumeHoraire,
				taille: lDimensions.largeurDevoir,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.VolH",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.HintVolH",
				),
			});
		}
		if (lAffichage.AvecCoefficient) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.coefficient,
				taille: lDimensions.largeurNote,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.Coeff",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.HintCoeff",
				),
			});
		}
		const lNbrMoy =
			Number(lAffichage.AvecMoyenneEleve) +
			Number(lAffichage.AvecMoyenneClasse) +
			Number(lAffichage.AvecMoyenneAnnuelle) +
			lAffichage.NombreMoyennesPeriodes +
			2 * Number(lAffichage.AvecMoyenneInfSup);
		const lLibelleMoy = this._getLibelleMoyennes({
			nbrMoy: lNbrMoy,
			affichage: lAffichage,
		});
		this.ajouterColsSectionEleve(lColonnes, lLibelleMoy);
		if (lAffichage.AvecMoyenneAnnuelle) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
				taille: lDimensions.largeurNote,
				titre: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
						avecFusionColonne: true,
					},
					{ libelle: ObjetTraduction_1.GTraductions.getValeur("Annee") },
				],
			});
		}
		for (let i = 0; i < lAffichage.NombreMoyennesPeriodes; i++) {
			lIdCol = this._getIdColMoyPeriode(i);
			const lPeriode = lAffichage.listePeriodes.get(i);
			const lCouleurPeriode =
				lAffichage.listeLibellesPeriodes.getElementParNumero(
					lPeriode.getNumero(),
				).couleur;
			const lHtmlCouleurPeriode = !!lCouleurPeriode
				? '<div class="couleur-periode" style="background-color:' +
					lCouleurPeriode +
					';"></div>'
				: "";
			lColonnes.push({
				id: lIdCol,
				numeroPeriode: lPeriode.getNumero(),
				indice: i,
				taille: lDimensions.largeurNote,
				titre: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Eleve"),
						avecFusionColonne: true,
					},
					{
						libelleHtml:
							'<div class="titre-periode">' +
							lHtmlCouleurPeriode +
							"<div>" +
							lPeriode.getLibelle() +
							"</div></div>",
					},
				],
			});
		}
		if (lAffichage.AvecMoyenneClasse) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
				taille: lDimensions.largeurNote,
				titre: [
					{ libelle: lLibelleMoy, avecFusionColonne: true },
					{
						libelle: lAffichage.AvecMoyenneAnnuelle
							? ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Moy")
							: ObjetTraduction_1.GTraductions.getValeur("Classe"),
					},
				],
			});
		}
		if (lAffichage.AvecMoyenneInfSup) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
				taille: lDimensions.largeurNote,
				titre: [
					{ libelle: lLibelleMoy, avecFusionColonne: true },
					{ libelle: "-" },
				],
			});
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
				taille: lDimensions.largeurNote,
				titre: [
					{ libelle: lLibelleMoy, avecFusionColonne: true },
					{ libelle: "+" },
				],
			});
		}
		if (lAffichage.AvecMoyenneMediane) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
				taille: lDimensions.largeurNote,
				titre: [
					{ libelle: lLibelleMoy, avecFusionColonne: true },
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.Mediane",
						),
					},
				],
			});
		}
		if (lAffichage.AvecDureeDesAbsenses) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees,
				taille: lDimensions.largeurDevoir,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.HeuresCoursManquees",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.HintHeuresCoursManquees",
				),
			});
		}
		for (let i = 0; i < this.Donnees.nbrMaxTotDevoirs; i++) {
			lIdCol = this._getIdColDevoir(i);
			lColonnes.push({
				id: lIdCol,
				indice: i,
				taille: lDimensions.largeurDevoir,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur("Devoirs"),
					avecFusionColonne: true,
				},
			});
		}
		if (lAffichage.NombreAppreciations) {
			lColonnes.push({
				id: DonneesListe_ReleveDeNotes.colonnes.appreciation,
				taille: ObjetListe_1.ObjetListe.initColonne(
					100,
					lDimensions.largeurMinAppr,
					lDimensions.largeurMaxAppr,
				),
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur("Appreciation"),
				},
			});
		}
		return lColonnes;
	}
	_estColMoyPeriode(aIdCol) {
		return this.moteurGrille.estColVariable(
			aIdCol,
			DonneesListe_ReleveDeNotes.colonnes.moyennePeriode,
		);
	}
	_getIdColMoyPeriode(aIndice) {
		return this.moteurGrille.getIdColVariable(
			aIndice,
			DonneesListe_ReleveDeNotes.colonnes.moyennePeriode,
		);
	}
	_estColDevoir(aIdCol) {
		return this.moteurGrille.estColVariable(
			aIdCol,
			DonneesListe_ReleveDeNotes.colonnes.devoir,
		);
	}
	_getIdColDevoir(aIndice) {
		return this.moteurGrille.getIdColVariable(
			aIndice,
			DonneesListe_ReleveDeNotes.colonnes.devoir,
		);
	}
	_existeDevoirSansCoeffParDefaut(aParams) {
		let lResult = false;
		if (aParams.article.ListeDevoirs) {
			aParams.article.ListeDevoirs.parcourir((aDevoir) => {
				if (lResult !== true) {
					lResult =
						aDevoir.Coefficient &&
						!aDevoir.Coefficient.estCoefficientParDefaut();
				}
			});
		}
		return lResult;
	}
	_getMoyenne(I, D, aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.moyenneEleve:
				return D.MoyenneEleve;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneClasse:
				return D.MoyenneClasse;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneMediane:
				return D.MoyenneMediane;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle:
				return D.MoyenneAnnuelle;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneInf:
				return D.MoyenneInf;
			case DonneesListe_ReleveDeNotes.colonnes.moyenneSup:
				return D.MoyenneSup;
			default: {
				if (this._estColMoyPeriode(aParams.idColonne)) {
					return this._getPeriode(aParams);
				}
			}
		}
		return null;
	}
	_estColAvecGras(aParams) {
		return (
			[
				DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
				DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
				DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
				DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
				DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
				DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
				DonneesListe_ReleveDeNotes.colonnes.pts,
			].includes(aParams.idColonne) || this._estColMoyPeriode(aParams.idColonne)
		);
	}
	_estColAvecAlignementDroit(aParams) {
		return (
			[
				DonneesListe_ReleveDeNotes.colonnes.sousService,
				DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
				DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
				DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
				DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
				DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
				DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
				DonneesListe_ReleveDeNotes.colonnes.volumeHoraire,
				DonneesListe_ReleveDeNotes.colonnes.coefficient,
				DonneesListe_ReleveDeNotes.colonnes.heureCoursManquees,
				DonneesListe_ReleveDeNotes.colonnes.pts,
			].includes(aParams.idColonne) || this._estColMoyPeriode(aParams.idColonne)
		);
	}
	_estCelluleDeploiement(aParams) {
		return (
			aParams.idColonne === DonneesListe_ReleveDeNotes.colonnes.regroupement &&
			aParams.article.estUnDeploiement === true
		);
	}
	_estColFixe(aParams) {
		const lTabColFixe = [
			DonneesListe_ReleveDeNotes.colonnes.service,
			DonneesListe_ReleveDeNotes.colonnes.sousService,
		];
		return lTabColFixe.includes(aParams.idColonne);
	}
	_estColCouleurTotal(aParams) {
		const lTabCol = [
			DonneesListe_ReleveDeNotes.colonnes.pts,
			DonneesListe_ReleveDeNotes.colonnes.nivMaitriseEleve,
			DonneesListe_ReleveDeNotes.colonnes.moyenneEleve,
			DonneesListe_ReleveDeNotes.colonnes.moyenneClasse,
			DonneesListe_ReleveDeNotes.colonnes.moyenneMediane,
			DonneesListe_ReleveDeNotes.colonnes.moyenneAnnuelle,
			DonneesListe_ReleveDeNotes.colonnes.moyenneInf,
			DonneesListe_ReleveDeNotes.colonnes.moyenneSup,
		];
		return (
			lTabCol.includes(aParams.idColonne) ||
			this._estColMoyPeriode(aParams.idColonne)
		);
	}
	_estColEditable(aParams) {
		const lTabColEditable = [DonneesListe_ReleveDeNotes.colonnes.appreciation];
		if (lTabColEditable.includes(aParams.idColonne)) {
			return true;
		}
		return false;
	}
	_estDonneeEditable(aParams) {
		if (!this._estColEditable(aParams)) {
			return false;
		}
		switch (aParams.idColonne) {
			case DonneesListe_ReleveDeNotes.colonnes.appreciation:
				return this.param.saisie && aParams.article.Editable;
			default:
				return false;
		}
	}
	_estDonneeCloture(aParams) {
		return aParams.article.Cloture;
	}
	_estCellEditable(aParams) {
		const lEditable = this._estDonneeEditable(aParams);
		const lCloture = this._estDonneeCloture(aParams);
		const lServicePereAvecAppreciationParSousService =
			aParams.article.estServicePereAvecSousService &&
			aParams.article.avecAppreciationParSousService;
		return (
			lEditable && !lCloture && !lServicePereAvecAppreciationParSousService
		);
	}
	_getLibelleMoyennes(aParam) {
		let lLibelleMoyennes;
		if (aParam.affichage.AvecMoyenneAnnuelle) {
			lLibelleMoyennes = ObjetTraduction_1.GTraductions.getValeur("Classe");
		} else {
			lLibelleMoyennes =
				aParam.nbrMoy === 1
					? ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Moy")
					: ObjetTraduction_1.GTraductions.getValeur("Moyennes");
		}
		return lLibelleMoyennes;
	}
}
exports.DonneesListe_ReleveDeNotes = DonneesListe_ReleveDeNotes;
(function (DonneesListe_ReleveDeNotes) {
	let colonnes;
	(function (colonnes) {
		colonnes["regroupement"] = "ReleveNotes_regroupement";
		colonnes["service"] = "ReleveNotes_service";
		colonnes["sousService"] = "ReleveNotes_sous_service";
		colonnes["moyenneEleve"] = "ReleveNotes_moyenne_eleve";
		colonnes["moyenneAnnuelle"] = "ReleveNotes_moyenne_annuelle";
		colonnes["moyennePeriode"] = "ReleveNotes_moyenne_periode";
		colonnes["moyenneClasse"] = "ReleveNotes_moyenne_classe";
		colonnes["moyenneMediane"] = "ReleveNotes_moyenne_mediane";
		colonnes["moyenneInf"] = "ReleveNotes_moyenne_inferieure";
		colonnes["moyenneSup"] = "ReleveNotes_moyenne_superieure";
		colonnes["devoir"] = "ReleveNotes_devoir";
		colonnes["appreciation"] = "ReleveNotes_appreciation";
		colonnes["nivMaitriseEleve"] = "ReleveNotes_nivMaitriseEleve";
		colonnes["coefficient"] = "ReleveNotes_coefficient";
		colonnes["volumeHoraire"] = "ReleveNotes_volumeHoraire";
		colonnes["heureCoursManquees"] = "ReleveNotes_heureCoursManquees";
		colonnes["pts"] = "ReleveNotes_pts";
	})(
		(colonnes =
			DonneesListe_ReleveDeNotes.colonnes ||
			(DonneesListe_ReleveDeNotes.colonnes = {})),
	);
	let dimensions;
	(function (dimensions) {
		dimensions[(dimensions["largeurRegroupement"] = 4)] = "largeurRegroupement";
		dimensions[(dimensions["largeurService"] = 175)] = "largeurService";
		dimensions[(dimensions["largeurSousService"] = 100)] = "largeurSousService";
		dimensions[(dimensions["largeurNote"] = 50)] = "largeurNote";
		dimensions[(dimensions["largeurDevoir"] = 72)] = "largeurDevoir";
		dimensions[(dimensions["largeurMinAppr"] = 160)] = "largeurMinAppr";
		dimensions[(dimensions["largeurMaxAppr"] = 400)] = "largeurMaxAppr";
		dimensions[(dimensions["hauteurTitre"] = 20)] = "hauteurTitre";
		dimensions[(dimensions["hauteurService"] = 35)] = "hauteurService";
		dimensions[(dimensions["nbMaxProfs"] = 3)] = "nbMaxProfs";
	})(
		(dimensions =
			DonneesListe_ReleveDeNotes.dimensions ||
			(DonneesListe_ReleveDeNotes.dimensions = {})),
	);
})(
	DonneesListe_ReleveDeNotes ||
		(exports.DonneesListe_ReleveDeNotes = DonneesListe_ReleveDeNotes = {}),
);
