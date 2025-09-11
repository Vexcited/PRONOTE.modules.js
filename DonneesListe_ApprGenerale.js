exports.DonneesListe_ApprGenerale = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const ObjetListe_1 = require("ObjetListe");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DocumentsEleve_1 = require("ObjetFenetre_DocumentsEleve");
const ObjetTraduction_1 = require("ObjetTraduction");
const ToucheClavier_1 = require("ToucheClavier");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const TypeColonneSaisieApprPiedDeBulletin_1 = require("TypeColonneSaisieApprPiedDeBulletin");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ApprGenerale extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.param = $.extend(
			{
				instanceListe: null,
				typeReleveBulletin: null,
				listeColVisibles: null,
				estCtxRubrique: false,
				avecSelectionPeriodePrec: false,
				listePeriodesPrec: null,
				callbackOuvrirAssSaisie: null,
				avecMultiSelectionLignes: false,
				periodePrecCourante: null,
				clbckSelectionPeriode: null,
			},
			aParam,
		);
		if (
			this.param.avecSelectionPeriodePrec === true &&
			this.param.listePeriodesPrec !== null &&
			this.param.listePeriodesPrec !== undefined &&
			this.param.listePeriodesPrec.count() > 0
		) {
			this.param.periodePrecCourante = this.param.listePeriodesPrec.get(
				this.param.listePeriodesPrec.count() - 1,
			);
		}
		if (this.param.instanceListe !== null) {
			this.initOptions(this.param.instanceListe, this.param);
		}
		this.setOptions({
			hauteurMinCellule: DonneesListe_ApprGenerale.dimensions.hauteurLigne,
			hauteurMinContenuCellule:
				ObjetDonneesListe_1.ObjetDonneesListe.hauteurMinCellule,
			avecDeploiement: false,
			avecTri: false,
			avecSuppression: false,
			editionApresSelection: false,
			avecEvnt_Selection: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresEditionValidationSansModification: true,
			avecMultiSelection: this.param.avecMultiSelectionLignes,
		});
	}
	avecSelection(aParams) {
		if (
			this._estColEditable(
				DonneesListe_ApprGenerale.colonnes.appreciationGenerale,
			)
		) {
			const lAppr = aParams.article.appreciationGle;
			if (
				!lAppr ||
				!lAppr.editable ||
				this.moteurPdB.estMention({ appreciation: lAppr })
			) {
				return false;
			}
		}
		return true;
	}
	jsxNodeClicPJProjetAcc(aArticle, aNode) {
		if (aArticle) {
			$(aNode).eventValidation((aEvent) => {
				if (
					aEvent.type === "keyup" &&
					!(
						aEvent.which === ToucheClavier_1.ToucheClavier.Espace ||
						aEvent.which === ToucheClavier_1.ToucheClavier.RetourChariot
					)
				) {
					return;
				}
				if (aArticle.eleve && !!aArticle.eleve.avecDocsProjetsAccompagnement) {
					const lInstanceFenetre =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_DocumentsEleve_1.ObjetFenetre_DocumentsEleve,
							{ pere: this },
						);
					lInstanceFenetre.setDonnees(aArticle.eleve);
				}
			});
		}
	}
	getControleur(aDonneesListe, aListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aListe), {
			comboPeriodePrec: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 90,
						hauteur: 16,
						hauteurLigneDefault: 16,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"WAI.ListeSelectionPeriode",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aDonneesListe.param.listePeriodesPrec;
					}
				},
				getIndiceSelection: function () {
					let lIndice = 0;
					if (
						!!aDonneesListe.param.periodePrecCourante &&
						!!aDonneesListe.param.listePeriodesPrec &&
						aDonneesListe.param.listePeriodesPrec.count() > 0
					) {
						lIndice =
							aDonneesListe.param.listePeriodesPrec.getIndiceElementParFiltre(
								(D) => {
									return (
										D.getNumero() ===
										aDonneesListe.param.periodePrecCourante.getNumero()
									);
								},
							);
					}
					return Math.max(lIndice, 0);
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aParametres.element &&
						aDonneesListe.param.periodePrecCourante.getNumero() !==
							aParametres.element.getNumero()
					) {
						aDonneesListe.param.periodePrecCourante = aParametres.element;
						aDonneesListe.param.clbckSelectionPeriode();
					}
				},
			},
			getTitrePeriodePrec: function () {
				if (aDonneesListe.param.periodePrecCourante) {
					return aDonneesListe.param.periodePrecCourante.titreRappelPeriode;
				} else {
					return aDonneesListe.moteur.getTitreCol(
						aDonneesListe.param.listeColVisibles,
						DonneesListe_ApprGenerale.colonnes.periodePrec,
					);
				}
			},
		});
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.dureeAbs:
			case DonneesListe_ApprGenerale.colonnes.nbRetards:
			case DonneesListe_ApprGenerale.colonnes.moyEleve:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_ApprGenerale.colonnes.evolution:
			case DonneesListe_ApprGenerale.colonnes.eleve:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
			default:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
		}
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.eleve:
				if (!this.param.estCtxRubrique || aParams.article.estPere) {
					return this.moteur.composeHtmlEleve({
						eleve: aParams.article.eleve,
						avecPhoto: aParams.article.eleve.avecPhoto,
						largeurPhoto: DonneesListe_ApprGenerale.dimensions.largeurPhoto,
						hauteur: DonneesListe_ApprGenerale.dimensions.hauteurPhoto,
						strProjetAcc: aParams.article.eleve.projetsAccompagnement,
						avecDocsProjetAcc:
							aParams.article.eleve.avecDocsProjetsAccompagnement,
						jsxNodeClicPJProjetAcc: this.jsxNodeClicPJProjetAcc.bind(
							this,
							aParams.article,
						),
					});
				} else {
					const lAppr =
						DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
					return lAppr && lAppr.titre ? "<div>" + lAppr.titre + "</div>" : "";
				}
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
				const lAppr =
					DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
				return lAppr ? lAppr.getLibelle() : "";
			}
			case DonneesListe_ApprGenerale.colonnes.dureeAbs:
				return !!aParams.article.strHAbs ? aParams.article.strHAbs : "";
			case DonneesListe_ApprGenerale.colonnes.nbRetards:
				return !!aParams.article.strNbRetards
					? aParams.article.strNbRetards
					: "";
			case DonneesListe_ApprGenerale.colonnes.moyEleve:
				return aParams.article.moyEleve !== null &&
					aParams.article.moyEleve !== undefined
					? aParams.article.moyEleve
					: "";
			case DonneesListe_ApprGenerale.colonnes.evolution: {
				const lData = this._getDataPeriodePrecCourante(aParams);
				return this.moteur.composeHtmlEvolution({
					genreEvol: lData !== null && !!lData.evolution ? lData.evolution : 0,
				});
			}
			case DonneesListe_ApprGenerale.colonnes.periodePrec: {
				const lData = this._getDataPeriodePrecCourante(aParams);
				return this.moteur.composeHtmlPeriodePrec(lData);
			}
		}
		return "";
	}
	static getAppreciationDeColonne(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.eleve:
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
				return aParams.article.appreciationGle;
			default:
		}
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (this._estColAvecGras(aParams)) {
			T.push("Gras");
		}
		if (this._estCellEditable(aParams)) {
			T.push(" AvecMain ");
		}
		if (this._estColAvecAlignementDroit(aParams)) {
			T.push("AlignementDroit");
		} else if (this._estColAvecAlignementMilieu(aParams)) {
			T.push("AlignementMilieu");
		}
		const lAvecCurseurInterdiction = !this._estCellEditable(aParams);
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
				if (lAvecCurseurInterdiction) {
					T.push("AvecInterdiction");
				} else {
					const lAppr =
						DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
					if (
						this.moteurAssSaisie.avecAssistantSaisieActif({
							appreciation: lAppr,
							estCtxApprGenerale: true,
						})
					) {
						T.push("Curseur_AssistantSaisieActif");
					}
				}
				break;
		}
		return T.join(" ");
	}
	getCouleurCellule(aParams) {
		if (this._estColFixe(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
		} else if (this._estColCouleurTotal(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Total;
		} else if (this._estDonneeEditable(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		} else {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
		}
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
				const lAppr =
					DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
				return lAppr !== null && lAppr !== undefined && lAppr.cloture === true
					? ObjetTraduction_1.GTraductions.getValeur(
							"BulletinEtReleve.appreciationGleCloture",
						)
					: null;
			}
		}
	}
	avecEdition(aParams) {
		return this._estCellEditable(aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.evolution:
				return this._estCellEditable(aParams);
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
				return (
					this._estCellEditable(aParams) &&
					((this.param.typeReleveBulletin !==
						TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes &&
						this.moteurPdB.estMention({
							appreciation: aParams.article.appreciationGle,
						})) ||
						this.moteurAssSaisie.avecAssistantSaisieActif({
							estCtxApprGenerale: true,
						}))
				);
		}
		return false;
	}
	avecEtatSaisie() {
		return false;
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
				return { tailleMax: this.param.tailleMaxAppreciation };
			default:
				return null;
		}
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
				const lAppr =
					DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
				lAppr.setLibelle(!!V ? V.trim() : "");
				lAppr.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
			}
		}
	}
	avecMenuContextuel() {
		return false;
	}
	initOptions(aInstance, aParam) {
		aInstance.setOptionsListe({
			colonnes: this.getColonnesOrdonneesSelonContexte(aParam),
			avecLigneTotal: false,
			colonnesTriables: false,
			nonEditableSurModeExclusif: true,
		});
	}
	getHauteurMinCellule() {
		return DonneesListe_ApprGenerale.dimensions.hauteurPhoto;
	}
	getColonnesOrdonneesSelonContexte(aParam) {
		const lColonnes = [];
		if (aParam && aParam.listeColVisibles) {
			aParam.listeColVisibles.parcourir((aCol) => {
				const lIdCol = aCol.typeCol.toString();
				lColonnes.push({
					id: lIdCol,
					taille: this._getDimensionCol(lIdCol),
					titre: this._getTitreCol(aCol),
					hint:
						aCol.hintCol !== null && aCol.hintCol !== undefined
							? aCol.hintCol
							: "",
				});
			});
		}
		return lColonnes;
	}
	_getDataPeriodePrecCourante(aParams) {
		return this.moteur.getDataPeriodePrecCourante({
			listePeriodesPrec: aParams.article.listePeriodesPrec,
			avecSelectionPeriodePrec: this.param.avecSelectionPeriodePrec,
			periodePrecCourante: this.param.periodePrecCourante,
		});
	}
	_getTitreCol(aColonne) {
		const lIdCol = aColonne.typeCol.toString();
		switch (lIdCol) {
			case DonneesListe_ApprGenerale.colonnes.periodePrec:
				if (this.param.avecSelectionPeriodePrec) {
					return {
						libelleHtml: this.moteur.composeHtmlTitreCol({
							titreCol: this.param.periodePrecCourante
								? this.param.periodePrecCourante.titreRappelPeriode
								: aColonne.titreCol,
							ieTexteCol: "getTitrePeriodePrec",
							avecCombo: true,
							modelCombo: "comboPeriodePrec",
						}),
						ignorerOverflowHidden: true,
					};
				} else {
					return aColonne.titreCol;
				}
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
				return {
					getLibelleHtml: () => {
						const lEstDisabledBtnAssSaisie = () => {
							let lResult = true;
							const lSelections =
								this.param.instanceListe.getListeElementsSelection();
							if (!!lSelections && lSelections.count() > 0) {
								for (const lLigneElement of lSelections) {
									if (
										lLigneElement.appreciationGle &&
										lLigneElement.appreciationGle.editable
									) {
										lResult = false;
										break;
									}
								}
							}
							return lResult;
						};
						const lJsxModelBoutonAssSaisie = () => {
							return {
								event: () => {
									const lSelections =
										this.param.instanceListe.getListeElementsSelection();
									if (!!lSelections && lSelections.count() > 0) {
										this.etatUtilisateurSco.assistantSaisieActif = true;
										this.param.callbackOuvrirAssSaisie();
									}
								},
								getDisabled: () => {
									return lEstDisabledBtnAssSaisie();
								},
							};
						};
						const lJsxClassBoutonAssSaisie = () => {
							return lEstDisabledBtnAssSaisie() ? "" : "TitreListeSansTri";
						};
						const lTitreColonneAppreciation = [];
						lTitreColonneAppreciation.push(
							IE.jsx.str(
								"div",
								{ class: "display-flex flex-center" },
								IE.jsx.str("ie-btnicon", {
									"ie-model": lJsxModelBoutonAssSaisie,
									"ie-class": lJsxClassBoutonAssSaisie,
									class: "icon_pencil fix-bloc m-right-l",
									"aria-haspopup": "dialog",
									style: "font-size: 1.4rem;",
									"aria-label": ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
									),
								}),
								IE.jsx.str("span", null, aColonne.titreCol),
							),
						);
						return lTitreColonneAppreciation.join("");
					},
				};
			}
			default:
				return aColonne.titreCol;
		}
	}
	_estColEditable(aIdColonne) {
		return this.moteur.estColEditable(this.param.listeColVisibles, aIdColonne);
	}
	_estColAvecGras(aParams) {
		return [DonneesListe_ApprGenerale.colonnes.moyEleve].includes(
			aParams.idColonne,
		);
	}
	_estColAvecAlignementDroit(aParams) {
		return [
			DonneesListe_ApprGenerale.colonnes.moyEleve,
			DonneesListe_ApprGenerale.colonnes.dureeAbs,
			DonneesListe_ApprGenerale.colonnes.nbRetards,
		].includes(aParams.idColonne);
	}
	_estColAvecAlignementMilieu(aParams) {
		return [DonneesListe_ApprGenerale.colonnes.evolution].includes(
			aParams.idColonne,
		);
	}
	_estColFixe(aParams) {
		const lTabColFixe = [DonneesListe_ApprGenerale.colonnes.eleve];
		return lTabColFixe.includes(aParams.idColonne);
	}
	_estColCouleurTotal(aParams) {
		const lTabColTotal = [DonneesListe_ApprGenerale.colonnes.moyEleve];
		return lTabColTotal.includes(aParams.idColonne);
	}
	_estDonneeEditable(aParams) {
		if (!this._estColEditable(aParams.idColonne)) {
			return false;
		}
		const D = aParams.article;
		switch (aParams.idColonne) {
			case DonneesListe_ApprGenerale.colonnes.evolution:
				return D.evolutionEditable !== null && D.evolutionEditable !== undefined
					? D.evolutionEditable
					: false;
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
				const lAppr =
					DonneesListe_ApprGenerale.getAppreciationDeColonne(aParams);
				return lAppr !== null && lAppr !== undefined ? lAppr.editable : false;
			}
		}
	}
	_estCellEditable(aParams) {
		return this._estDonneeEditable(aParams);
	}
	_getDimensionCol(aTypeCol) {
		const lDimensions = DonneesListe_ApprGenerale.dimensions;
		switch (aTypeCol) {
			case DonneesListe_ApprGenerale.colonnes.eleve:
				return lDimensions.largeurEleve;
			case DonneesListe_ApprGenerale.colonnes.evolution:
			case DonneesListe_ApprGenerale.colonnes.moyEleve:
				return lDimensions.largeurNote;
			case DonneesListe_ApprGenerale.colonnes.periodePrec:
				return lDimensions.largeurRappelPeriodePrec;
			case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
				return ObjetListe_1.ObjetListe.initColonne(
					100,
					lDimensions.largeurMinAppr,
					lDimensions.largeurMaxAppr,
				);
			default:
				return 80;
		}
	}
}
exports.DonneesListe_ApprGenerale = DonneesListe_ApprGenerale;
DonneesListe_ApprGenerale.colonnes = {
	eleve:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cEleve.toString(),
	dureeAbs:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cNbDJBulletin.toString(),
	nbRetards:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cNbRetard.toString(),
	evolution:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cEvolution.toString(),
	periodePrec:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cRappelPeriodePRec.toString(),
	moyEleve:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cMoyenne.toString(),
	appreciationGenerale:
		TypeColonneSaisieApprPiedDeBulletin_1.TypeColSaisieApprPiedDeBulletin.cAppreciation.toString(),
};
DonneesListe_ApprGenerale.dimensions = {
	largeurEleve: 250,
	largeurNote: 45,
	largeurRappelPeriodePrec: 250,
	largeurPhoto: 58,
	hauteurPhoto: 78,
	hauteurLigne: 40,
	largeurMinAppr: 160,
	largeurMaxAppr: 400,
};
