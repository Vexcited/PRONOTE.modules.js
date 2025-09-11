exports.DonneesListe_ApprBulletin = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const TypeColListeAppreciationProfsParService_1 = require("TypeColListeAppreciationProfsParService");
const ObjetListe_1 = require("ObjetListe");
const TypeNote_1 = require("TypeNote");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Annotation_1 = require("Enumere_Annotation");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DocumentsEleve_1 = require("ObjetFenetre_DocumentsEleve");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypePositionnement_1 = require("TypePositionnement");
const ToucheClavier_1 = require("ToucheClavier");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ApprBulletin extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.param = $.extend(
			{
				typeReleveBulletin: null,
				instanceListe: null,
				listeColVisibles: null,
				modeChronologique: true,
				clbckJauge: null,
				clbckSigmaECTS: null,
				clbckSigmaLSU: null,
				clbckSigmaPos: null,
				total: null,
				baremeNotationNiveau: GParametres.baremeNotation,
			},
			aParam,
		);
		if (
			this.param.avecSelectionPeriodePrec === true &&
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
			hauteurMinCellule: DonneesListe_ApprBulletin.dimensions.hauteurLigne,
			hauteurMinContenuCellule:
				ObjetDonneesListe_1.ObjetDonneesListe.hauteurMinCellule,
			avecDeploiement: false,
			avecTri: false,
			avecSuppression: false,
			editionApresSelection: false,
			avecEvnt_Selection: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresEditionValidationSansModification: true,
			avecEvnt_KeyUpListe: true,
			selectionParCellule: true,
		});
	}
	remplirMenuContextuel(aParametres) {
		this.moteur.remplirMenuContextuelPositionnement(
			aParametres.menuContextuel,
			{
				genreChoixValidationCompetence:
					aParametres.genreChoixValidationCompetence,
				genrePositionnement: aParametres.genrePositionnement,
				avecLibelleRaccourci: aParametres.avecLibelleRaccourci,
				clbackMenuPositionnement: aParametres.clbackMenuPositionnement,
			},
		);
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
				if (
					!!aArticle.eleve &&
					!!aArticle.eleve.avecDocsProjetsAccompagnement
				) {
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
	getControleur(aDonneesListe, aInstanceListe) {
		return $.extend(true, super.getControleur(aDonneesListe, aInstanceListe), {
			btnSigmaECTS: {
				event: function () {
					aDonneesListe.param.clbckSigmaECTS();
				},
			},
			btnSigmaLSU: {
				event: function () {
					aDonneesListe.param.clbckSigmaLSU();
				},
				getDisabled: function () {
					const lCol = aDonneesListe.moteur.getInfosCol(
						aDonneesListe.param.listeColVisibles,
						DonneesListe_ApprBulletin.colonnes.noteLSU,
					);
					return lCol ? !lCol.btnSigmaActif : false;
				},
			},
			btnSigmaPos: {
				event: function () {
					aDonneesListe.param.clbckSigmaPos();
				},
				getDisabled: function () {
					const lCol = aDonneesListe.moteur.getInfosCol(
						aDonneesListe.param.listeColVisibles,
						DonneesListe_ApprBulletin.colonnes.niveauAcqu,
					);
					return lCol ? !lCol.btnSigmaActif : false;
				},
			},
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
						DonneesListe_ApprBulletin.colonnes.periodePrec,
					);
				}
			},
		});
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
			case DonneesListe_ApprBulletin.colonnes.moyProposee:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_ApprBulletin.colonnes.rangParcoursup:
			case DonneesListe_ApprBulletin.colonnes.rangPeriode1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.rangPeriode2Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.dureeAbs:
			case DonneesListe_ApprBulletin.colonnes.moyEleve:
			case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
			case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
			case DonneesListe_ApprBulletin.colonnes.ects:
			case DonneesListe_ApprBulletin.colonnes.moyPeriode1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.moyPeriode2Parcoursup:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_ApprBulletin.colonnes.moyAnnuelle:
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
			case DonneesListe_ApprBulletin.colonnes.periodePrec:
			case DonneesListe_ApprBulletin.colonnes.eleve:
			case DonneesListe_ApprBulletin.colonnes.niveauAcquiParcoursup:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
			case DonneesListe_ApprBulletin.colonnes.appreciation1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.appreciation2Parcoursup:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		const lSurExportCSV = aParams && aParams.surExportCSV;
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.eleve:
				if (lSurExportCSV) {
					return aParams.article.strEleve;
				} else if (aParams.article.estPere === true) {
					return this.moteur.composeHtmlEleve({
						eleve: aParams.article.eleve,
						avecPhoto: aParams.article.eleve.avecPhoto,
						largeurPhoto: DonneesListe_ApprBulletin.dimensions.largeurPhoto,
						hauteur: DonneesListe_ApprBulletin.dimensions.hauteurPhoto,
						strProjetAcc: aParams.article.eleve.projetsAccompagnement,
						avecDocsProjetAcc:
							aParams.article.eleve.avecDocsProjetsAccompagnement,
						jsxNodeClicPJProjetAcc: this.jsxNodeClicPJProjetAcc.bind(
							this,
							aParams.article,
						),
					});
				} else {
					return (
						'<div class="AlignementDroit">' +
						aParams.article.strEleve +
						"</div>"
					);
				}
			case DonneesListe_ApprBulletin.colonnes.classe:
				return aParams.article.classe.getLibelle();
			case DonneesListe_ApprBulletin.colonnes.dureeAbs:
				return aParams.article.estService ? aParams.article.strHAbs : "";
			case DonneesListe_ApprBulletin.colonnes.nbRetards:
				return aParams.article.estService ? aParams.article.strNbRetards : "";
			case DonneesListe_ApprBulletin.colonnes.nbDevoirs:
				return lSurExportCSV
					? aParams.article.nbDevoirs.replace("/", " sur ")
					: aParams.article.nbDevoirs;
			case DonneesListe_ApprBulletin.colonnes.periodePrec: {
				const lData = this._getDataPeriodePrecCourante(aParams);
				return lSurExportCSV
					? this.moteur.composeStrPeriodePrec(lData)
					: this.moteur.composeHtmlPeriodePrec(lData);
			}
			case DonneesListe_ApprBulletin.colonnes.ects:
				return aParams.article.ECTS
					? lSurExportCSV
						? aParams.article.ECTS
						: new TypeNote_1.TypeNote(aParams.article.ECTS)
					: "";
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
				return aParams.article.noteLSU;
			case DonneesListe_ApprBulletin.colonnes.moyProposee:
				return aParams.article.moyenneProposee;
			case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
				return aParams.article.moyenneDeliberee;
			case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
				return aParams.article.avisReligionPropose.getLibelle();
			case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
				return aParams.article.avisReligionDelibere.getLibelle();
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
				return aParams.article.appAvisProfesseur
					? aParams.article.appAvisProfesseur.getLibelle()
					: "";
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
				return aParams.article.appAvisProfParcoursup
					? aParams.article.appAvisProfParcoursup.getLibelle()
					: "";
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC: {
				const lAppr =
					DonneesListe_ApprBulletin.getAppreciationDeColonne(aParams);
				return lAppr ? lAppr.getLibelle() : "";
			}
			case DonneesListe_ApprBulletin.colonnes.niveauAcquiParcoursup: {
				const H = [];
				const lNiveauAcquiPeriode1 = aParams.article.niveauPeriode1;
				if (lNiveauAcquiPeriode1) {
					H.push(
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: lNiveauAcquiPeriode1,
								genrePositionnement: aParams.article.genrePositionnementClasse,
								avecTitle: false,
							},
						),
					);
				}
				const lNiveauAcquiPeriode2 = aParams.article.niveauPeriode2;
				if (lNiveauAcquiPeriode2) {
					if (H.length > 0) {
						H.push(" ");
					}
					H.push(
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisitionUtil.getImagePositionnement(
							{
								niveauDAcquisition: lNiveauAcquiPeriode2,
								genrePositionnement: aParams.article.genrePositionnementClasse,
								avecTitle: false,
							},
						),
					);
				}
				return H.join("");
			}
			case DonneesListe_ApprBulletin.colonnes.rangPeriode1Parcoursup:
				return aParams.article.rangParcoursup1 || "";
			case DonneesListe_ApprBulletin.colonnes.moyPeriode1Parcoursup:
				return aParams.article.moyenneParcoursup1;
			case DonneesListe_ApprBulletin.colonnes.appreciation1Parcoursup:
				return aParams.article.appParcoursup1 || "";
			case DonneesListe_ApprBulletin.colonnes.rangPeriode2Parcoursup:
				return aParams.article.rangParcoursup2 || "";
			case DonneesListe_ApprBulletin.colonnes.moyPeriode2Parcoursup:
				return aParams.article.moyenneParcoursup2;
			case DonneesListe_ApprBulletin.colonnes.appreciation2Parcoursup:
				return aParams.article.appParcoursup2 || "";
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
				return lSurExportCSV
					? (aParams.article &&
							aParams.article.niveauAcqu &&
							aParams.article.niveauAcqu.getLibelle &&
							aParams.article.niveauAcqu.getLibelle()) ||
							""
					: this.moteur.composeHtmlNote({
							note: null,
							niveauDAcquisition: aParams.article.niveauAcqu,
							genrePositionnement:
								TypePositionnement_1.TypePositionnementUtil.getGenrePositionnementParDefaut(
									aParams.article.typePositionnementClasse,
								),
							avecPrefixe: false,
						});
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
				if (lSurExportCSV) {
					return UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
						aParams.article.listeNiveauxChronologique,
					);
				} else {
					return this.moteur.composeBaretteEvaluations({
						modeChronologique: this.param.modeChronologique,
						listeNiveaux: aParams.article.listeNiveaux,
						listeNiveauxChronologiques:
							aParams.article.listeNiveauxChronologique,
					});
				}
			case DonneesListe_ApprBulletin.colonnes.moyEleve:
				return aParams.article.moyEleve;
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
				return aParams.article.estMoyNR === true
					? lSurExportCSV
						? ObjetTraduction_1.GTraductions.getValeur(
								"Notes.Colonne.TitreMoyNR",
							)
						: this.moteur.composeHtmlMoyNR()
					: "";
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
				return aParams.article.estMoyNR === true
					? lSurExportCSV
						? ObjetTraduction_1.GTraductions.getValeur(
								"Notes.Colonne.TitreMoyNR",
							)
						: this.moteur.composeHtmlMoyNR()
					: aParams.article.moyParcoursup !== null &&
							aParams.article.moyParcoursup !== undefined
						? aParams.article.moyParcoursup
						: "";
			case DonneesListe_ApprBulletin.colonnes.rangParcoursup:
				return aParams.article.rangParcoursup !== null &&
					aParams.article.rangParcoursup !== undefined
					? aParams.article.rangParcoursup
					: "";
			case DonneesListe_ApprBulletin.colonnes.nbEvals:
				return aParams.article.strNbEvals
					? lSurExportCSV
						? aParams.article.strNbEvals.replace("/", " sur ")
						: aParams.article.strNbEvals
					: "";
			case DonneesListe_ApprBulletin.colonnes.moyAnnuelle:
				return this.moteur.composeHtmlMoyAnnuelle(
					aParams.article.moyAnnuelle,
					aParams.article.estMoyAnnuelleNR,
				);
			case DonneesListe_ApprBulletin.colonnes.evolution: {
				const lData = this._getDataPeriodePrecCourante(aParams);
				return this.moteur.composeHtmlEvolution({
					genreEvol: lData !== null && !!lData.evolution ? lData.evolution : 0,
				});
			}
		}
		return "";
	}
	estCelluleWAIRowHeader(aParams) {
		return aParams.idColonne === DonneesListe_ApprBulletin.colonnes.eleve;
	}
	getAriaHasPopup(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.jaugeEval: {
				if (aParams.article.estService) {
					return "dialog";
				}
				return false;
			}
		}
		return false;
	}
	static getAppreciationDeColonne(aParams) {
		const D = aParams.article;
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
				return D.appReleve;
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
				return D.appA;
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
				return D.appB;
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				return D.appC;
			default:
		}
	}
	getClassCelluleConteneur(aParams) {
		const D = aParams.article;
		const T = [];
		if (this._estColAvecGras(aParams)) {
			T.push("Gras");
		}
		if (this._estCellEditable(aParams)) {
			T.push("AvecMain");
		}
		if (this._estColAvecAlignementDroit(aParams)) {
			T.push("AlignementDroit");
		} else if (this._estColAvecAlignementMilieu(aParams)) {
			T.push("AlignementMilieu");
		}
		const lAvecCurseurInterdiction = !this._estCellEditable(aParams);
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.ects:
				if (lAvecCurseurInterdiction) {
					T.push("AvecInterdiction");
				}
				break;
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				if (lAvecCurseurInterdiction) {
					T.push("AvecInterdiction");
				} else {
					const lAppr =
						DonneesListe_ApprBulletin.getAppreciationDeColonne(aParams);
					if (
						this.moteurAssSaisie.avecAssistantSaisieActif({
							appreciation: lAppr,
							typeReleveBulletin: this.param.typeReleveBulletin,
						})
					) {
						T.push("Curseur_AssistantSaisieActif");
					}
				}
				break;
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
				if (D.estService) {
					T.push("AvecMain ");
				}
				break;
		}
		return T.join(" ");
	}
	fusionCelluleAvecLignePrecedente(aParams) {
		const lEstColAppr =
			this._estColAppreciation(aParams.idColonne) ||
			aParams.idColonne === DonneesListe_ApprBulletin.colonnes.avisProfesseur ||
			aParams.idColonne ===
				DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup;
		const lLigne = aParams.article;
		const lEstPere = lLigne.estPere;
		return lEstColAppr && !lEstPere && lLigne.fusionAppr === true;
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
				if (aParams.article.estMoyNR === true) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.HintMoyenneNR",
					);
				}
				break;
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
				return aParams.article.hintMoyenneParcoursup || "";
			case DonneesListe_ApprBulletin.colonnes.niveauAcquiParcoursup:
				return aParams.article.hintNiveauAcquiParcoursup || "";
		}
		return "";
	}
	getCouleurCellule(aParams) {
		if (this._estColFixe(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
		} else if (this._estDonneeEditable(aParams)) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		} else {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
		}
	}
	avecEdition(aParams) {
		return this._estCellEditable(aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
			case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
			case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
				return this._estCellEditable(aParams);
			case DonneesListe_ApprBulletin.colonnes.evolution:
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
				return this._estCellEditable(aParams);
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				return (
					this._estCellEditable(aParams) &&
					this.moteurAssSaisie.avecAssistantSaisieActif({
						typeReleveBulletin: this.param.typeReleveBulletin,
					})
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
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				return { tailleMax: this.param.tailleMaxAppreciation };
		}
		return null;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC: {
				const lAppr =
					DonneesListe_ApprBulletin.getAppreciationDeColonne(aParams);
				lAppr.setLibelle(!!V ? V.trim() : "");
				lAppr.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
			}
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
				aParams.article.appAvisProfParcoursup.setLibelle(!!V ? V.trim() : "");
				aParams.article.appAvisProfParcoursup.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				break;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
				aParams.article.appAvisProfesseur.setLibelle(!!V ? V.trim() : "");
				aParams.article.appAvisProfesseur.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				break;
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
				aParams.article.noteLSUModifie = V;
				break;
			case DonneesListe_ApprBulletin.colonnes.ects: {
				const lValeurECTS = V === "" || !V.estUneValeur() ? 0 : V.getValeur();
				aParams.article.ectsModifie =
					lValeurECTS !== aParams.article.ECTS ? lValeurECTS : null;
				break;
			}
			case DonneesListe_ApprBulletin.colonnes.moyProposee:
				aParams.article.moyProposeeModifie = V;
				break;
			case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
				aParams.article.moyDelibereeModifie = V;
				break;
		}
	}
	getOptionsNote(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.moyProposee:
			case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
				return {
					avecAnnotation: true,
					listeAnnotations: [Enumere_Annotation_1.EGenreAnnotation.dispense],
					sansNotePossible: true,
					min: 0,
					max:
						this.param.baremeNotationNiveau &&
						this.param.baremeNotationNiveau.estUneValeur()
							? this.param.baremeNotationNiveau.getValeur()
							: 20,
					avecVirgule: false,
					afficherAvecVirgule: true,
				};
			case DonneesListe_ApprBulletin.colonnes.ects: {
				const lNbECTSService = !aParams.article.nbECTSService
					? this.parametresSco.general.maxECTS
					: aParams.article.nbECTSService;
				return {
					avecAnnotation: false,
					listeAnnotations: [],
					sansNotePossible: true,
					min: 0,
					max: lNbECTSService,
					avecVirgule: true,
					afficherAvecVirgule: false,
				};
			}
		}
	}
	avecMenuContextuel() {
		return false;
	}
	getContenuTotal(aParams) {
		const lGeneral = this.param.total;
		if (lGeneral !== null && lGeneral !== undefined) {
			switch (aParams.idColonne) {
				case DonneesListe_ApprBulletin.colonnes.dureeAbs:
					return lGeneral.strDureeAbs;
				case DonneesListe_ApprBulletin.colonnes.nbRetards:
					return lGeneral.strNbRetard;
				case DonneesListe_ApprBulletin.colonnes.moyEleve:
					return lGeneral.strMoyEleve;
				case DonneesListe_ApprBulletin.colonnes.moyAnnuelle:
					return lGeneral.strMoyAnnuelle;
				case DonneesListe_ApprBulletin.colonnes.moyProposee:
					return lGeneral.strMoyProposee;
				case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
					return lGeneral.strMoyDeliberee;
				case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
					return lGeneral.strMoyParcoursup;
				case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
					return lGeneral.strMoyNR;
			}
		}
		return "";
	}
	actualiserTotalMoyNR() {
		const lGeneral = this.param.total;
		let lCmp = 0;
		for (let i = 0, lNbr = this.Donnees.count(); i < lNbr; i++) {
			const lLigne = this.Donnees.get(i);
			if (lLigne && lLigne.estMoyNR === true) {
				lCmp++;
			}
		}
		lGeneral.strMoyNR = lCmp.toString();
	}
	getClassTotal(aParams) {
		const T = [];
		T.push("Gras");
		if (this._estColAvecAlignementDroit(aParams)) {
			T.push("AlignementDroit");
		} else if (this._estColAvecAlignementMilieu(aParams)) {
			T.push("AlignementMilieu");
		}
		return T.join(" ");
	}
	initOptions(aInstance, aParam) {
		aInstance.setOptionsListe({
			colonnes: this.getColonnesOrdonneesSelonContexte(aParam),
			avecLigneTotal: true,
			colonnesTriables: false,
			hauteurAdapteContenu: Infinity,
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.exportCSV },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
			],
			nonEditableSurModeExclusif: true,
			scrollHorizontal: true,
		});
	}
	getHauteurMinCellule(aParams) {
		if (aParams && aParams.article && aParams.article.estPere) {
			return DonneesListe_ApprBulletin.dimensions.hauteurPhoto;
		} else {
			return DonneesListe_ApprBulletin.dimensions.hauteurLigne;
		}
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
	_estColEditable(aParams) {
		return this.moteur.estColEditable(
			this.param.listeColVisibles,
			aParams.idColonne,
		);
	}
	_estColAvecGras(aParams) {
		return [
			DonneesListe_ApprBulletin.colonnes.classe,
			DonneesListe_ApprBulletin.colonnes.nbDevoirs,
			DonneesListe_ApprBulletin.colonnes.moyEleve,
			DonneesListe_ApprBulletin.colonnes.moyAnnuelle,
			DonneesListe_ApprBulletin.colonnes.ects,
			DonneesListe_ApprBulletin.colonnes.moyParcoursup,
			DonneesListe_ApprBulletin.colonnes.rangParcoursup,
		].includes(aParams.idColonne);
	}
	_estColAvecAlignementDroit(aParams) {
		return [
			DonneesListe_ApprBulletin.colonnes.dureeAbs,
			DonneesListe_ApprBulletin.colonnes.nbRetards,
			DonneesListe_ApprBulletin.colonnes.nbDevoirs,
			DonneesListe_ApprBulletin.colonnes.moyEleve,
			DonneesListe_ApprBulletin.colonnes.moyAnnuelle,
			DonneesListe_ApprBulletin.colonnes.nbEvals,
			DonneesListe_ApprBulletin.colonnes.ects,
			DonneesListe_ApprBulletin.colonnes.noteLSU,
			DonneesListe_ApprBulletin.colonnes.moyDeliberee,
			DonneesListe_ApprBulletin.colonnes.moyProposee,
			DonneesListe_ApprBulletin.colonnes.avisReligionPropose,
			DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee,
			DonneesListe_ApprBulletin.colonnes.moyParcoursup,
			DonneesListe_ApprBulletin.colonnes.rangParcoursup,
			DonneesListe_ApprBulletin.colonnes.moyPeriode1Parcoursup,
			DonneesListe_ApprBulletin.colonnes.rangPeriode1Parcoursup,
			DonneesListe_ApprBulletin.colonnes.moyPeriode2Parcoursup,
			DonneesListe_ApprBulletin.colonnes.rangPeriode2Parcoursup,
		].includes(aParams.idColonne);
	}
	_estColAvecAlignementMilieu(aParams) {
		return [
			DonneesListe_ApprBulletin.colonnes.evolution,
			DonneesListe_ApprBulletin.colonnes.moyNonRepresentative,
			DonneesListe_ApprBulletin.colonnes.niveauAcquiParcoursup,
		].includes(aParams.idColonne);
	}
	_estColAppreciation(aIdCol) {
		return (
			aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationReleve ||
			aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationA ||
			aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationB ||
			aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationC
		);
	}
	_estColFixe(aParams) {
		const lTabColFixe = [DonneesListe_ApprBulletin.colonnes.eleve];
		return lTabColFixe.includes(aParams.idColonne);
	}
	_estDonneeEditable(aParams) {
		if (!this._estColEditable(aParams)) {
			return false;
		}
		const D = aParams.article;
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.evolution:
				return D.evolutionEditable !== null && D.evolutionEditable !== undefined
					? D.evolutionEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.moyProposee:
				return D.moyProposeeEditable !== null &&
					D.moyProposeeEditable !== undefined
					? D.moyProposeeEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
				return D.moyDelibereeEditable !== null &&
					D.moyDelibereeEditable !== undefined
					? D.moyDelibereeEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
				return D.avisReligionPropEditable !== null &&
					D.avisReligionPropEditable !== undefined
					? D.avisReligionPropEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
				return D.avisReligionDelibEditable !== null &&
					D.avisReligionDelibEditable !== undefined
					? D.avisReligionDelibEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
				return D.niveauAcquEditable !== null &&
					D.niveauAcquEditable !== undefined
					? D.niveauAcquEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
				return D.noteLSUEditable !== null && D.noteLSUEditable !== undefined
					? D.noteLSUEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.ects:
				return D.ECTSEditable !== null && D.ECTSEditable !== undefined
					? D.ECTSEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
				return D.avisProfesseurEditable !== null &&
					D.avisProfesseurEditable !== undefined
					? D.avisProfesseurEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
				return D.avisProfParcoursupEditable !== null &&
					D.avisProfParcoursupEditable !== undefined
					? D.avisProfParcoursupEditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
				return D.estMoyNREditable !== null && D.estMoyNREditable !== undefined
					? D.estMoyNREditable
					: false;
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC: {
				const lAppr =
					DonneesListe_ApprBulletin.getAppreciationDeColonne(aParams);
				return lAppr !== null && lAppr !== undefined
					? lAppr.estEditable
					: false;
			}
		}
	}
	_estCellEditable(aParams) {
		return this._estDonneeEditable(aParams);
	}
	_getHtmlCol(aParam) {
		return this.moteur.composeHtmlTitreCol(aParam);
	}
	_getTitreCol(aColonne) {
		const lIdCol = aColonne.typeCol.toString();
		switch (lIdCol) {
			case DonneesListe_ApprBulletin.colonnes.periodePrec:
				if (this.param.avecSelectionPeriodePrec) {
					return {
						libelleHtml: this._getHtmlCol({
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
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
				return {
					getLibelleHtml: () => {
						const lJsxModeleBoutonBasculeJauge = () => {
							return {
								event: () => {
									this.param.clbckJauge();
								},
								getTitle: () => {
									return this.param.modeChronologique
										? ObjetTraduction_1.GTraductions.getValeur(
												"BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"BulletinEtReleve.hintBtnAfficherJaugeChronologique",
											);
								},
							};
						};
						const lJsxGetClasseBoutonBasculeJauge = () => {
							if (this.param.modeChronologique) {
								return UtilitaireCompetences_1.TUtilitaireCompetences
									.ClasseIconeJaugeChronologique;
							}
							return UtilitaireCompetences_1.TUtilitaireCompetences
								.ClasseIconeJaugeParNiveau;
						};
						const lColJauge = [];
						lColJauge.push(
							IE.jsx.str(
								"div",
								{ class: "flex-contain flex-center justify-center full-width" },
								IE.jsx.str("ie-btnicon", {
									"ie-model": lJsxModeleBoutonBasculeJauge,
									"ie-class": lJsxGetClasseBoutonBasculeJauge,
								}),
								IE.jsx.str("div", { class: "EspaceGauche" }, aColonne.titreCol),
							),
						);
						lColJauge.push();
						return lColJauge.join("");
					},
				};
			case DonneesListe_ApprBulletin.colonnes.ects:
				if (aColonne.avecBtnSigmaECTS) {
					return {
						libelleHtml: this._getHtmlCol({
							titreCol: aColonne.titreCol,
							avecBtnIcon: true,
							titleBtnImg: aColonne.hintBtnSigmaECTS,
							modelBtnImg: "btnSigmaECTS",
							classImg: "icon_sigma",
							avecCombo: false,
						}),
					};
				} else {
					return aColonne.titreCol;
				}
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
				if (aColonne.avecBtnSigmaLSUPos) {
					return {
						libelleHtml: this._getHtmlCol({
							titreCol: aColonne.titreCol,
							titleBtnImg: aColonne.hintBtnSigmaLSU,
							modelBtnImg: "btnSigmaLSU",
							avecBtnIcon: true,
							classImg: "icon_sigma",
							avecCombo: false,
						}),
					};
				} else {
					return aColonne.titreCol;
				}
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
				if (aColonne.avecBtnSigmaLSUPos) {
					return {
						libelleHtml: this._getHtmlCol({
							titreCol: aColonne.titreCol,
							avecBtnIcon: true,
							titleBtnImg: aColonne.hintBtnSigmaPos,
							modelBtnImg: "btnSigmaPos",
							classImg: "icon_sigma",
							avecCombo: false,
						}),
					};
				} else {
					return aColonne.titreCol;
				}
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				if (aColonne.avecVerrou) {
					return {
						libelleHtml: this._getHtmlCol({
							titreCol: aColonne.titreCol,
							avecIcon: true,
							classImg: "icon_lock Texte14",
							avecCombo: false,
						}),
					};
				} else {
					return aColonne.titreCol;
				}
			case DonneesListe_ApprBulletin.colonnes.rangParcoursup:
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
				if (aColonne.titreGroupeCol) {
					return [
						{ libelle: aColonne.titreGroupeCol, avecFusionColonne: true },
						aColonne.titreCol,
					];
				}
				return aColonne.titreCol;
			case DonneesListe_ApprBulletin.colonnes.rangPeriode1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.moyPeriode1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.appreciation1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.rangPeriode2Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.moyPeriode2Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.appreciation2Parcoursup: {
				return [
					{ libelle: aColonne.titreGroupeCol || "", avecFusionColonne: true },
					aColonne.titreCol,
				];
			}
		}
		return aColonne.titreCol;
	}
	_getDimensionCol(aTypeCol) {
		const lDimensions = DonneesListe_ApprBulletin.dimensions;
		switch (aTypeCol) {
			case DonneesListe_ApprBulletin.colonnes.eleve:
				return lDimensions.largeurEleve;
			case DonneesListe_ApprBulletin.colonnes.nbRetards:
			case DonneesListe_ApprBulletin.colonnes.nbDevoirs:
			case DonneesListe_ApprBulletin.colonnes.nbEvals:
			case DonneesListe_ApprBulletin.colonnes.evolution:
			case DonneesListe_ApprBulletin.colonnes.moyAnnuelle:
			case DonneesListe_ApprBulletin.colonnes.moyEleve:
			case DonneesListe_ApprBulletin.colonnes.moyProposee:
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
				return lDimensions.largeurNote;
			case DonneesListe_ApprBulletin.colonnes.moyDeliberee:
				return lDimensions.largeurMoyenneDeliberee;
			case DonneesListe_ApprBulletin.colonnes.classe:
				return lDimensions.largeurClasse;
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
			case DonneesListe_ApprBulletin.colonnes.niveauAcquiParcoursup:
				return lDimensions.largeurPositionnement;
			case DonneesListe_ApprBulletin.colonnes.ects:
				return lDimensions.largeurECTS;
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
				return lDimensions.largeurEvaluations;
			case DonneesListe_ApprBulletin.colonnes.dureeAbs:
				return lDimensions.largeurDureeAbs;
			case DonneesListe_ApprBulletin.colonnes.periodePrec:
				return lDimensions.largeurRappelPeriodePrec;
			case DonneesListe_ApprBulletin.colonnes.rangParcoursup:
				return lDimensions.largeurRang;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
			case DonneesListe_ApprBulletin.colonnes.appreciation1Parcoursup:
			case DonneesListe_ApprBulletin.colonnes.appreciation2Parcoursup:
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
exports.DonneesListe_ApprBulletin = DonneesListe_ApprBulletin;
DonneesListe_ApprBulletin.colonnes = {
	eleve:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_Eleve.toString(),
	classe:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_Classe.toString(),
	dureeAbs:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_DureeAbsence.toString(),
	nbRetards:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_NbRet.toString(),
	evolution:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_EvolutionEleve.toString(),
	periodePrec:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_RappelPeriodePrecedente.toString(),
	nbDevoirs:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_NbNotes.toString(),
	moyEleve:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyenneEleve.toString(),
	moyAnnuelle:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyenneAnnuelle.toString(),
	nbEvals:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_NbEvals.toString(),
	jaugeEval:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_JaugeEvaluations.toString(),
	niveauAcqu:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_NiveauAcquisition.toString(),
	noteLSU:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_NoteLSU.toString(),
	moyProposee:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyProposee.toString(),
	avisReligionPropose:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AvisReligionProposee.toString(),
	moyDeliberee:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyDeliberee.toString(),
	avisReligionDeliberee:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AvisReligionDeliberee.toString(),
	ects: TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_ECTSEleve.toString(),
	appreciationA:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AppreciationA.toString(),
	appreciationB:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AppreciationB.toString(),
	appreciationC:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AppreciationC.toString(),
	appreciationReleve:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AppreciationReleve.toString(),
	avisProfesseur:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AvisProfesseur.toString(),
	rangParcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_RangParcoursup.toString(),
	moyParcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyenneParcoursup.toString(),
	avisProfesseurParcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AvisProfesseurParcoursup.toString(),
	moyNonRepresentative:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyenneNonRepresentative.toString(),
	niveauAcquiParcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_NiveauAcquisitionParcoursup.toString(),
	rangPeriode1Parcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_RangParcoursupPrecedent1.toString(),
	moyPeriode1Parcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_MoyParcoursupPrecedente1.toString(),
	appreciation1Parcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AppreciationParcoursup1.toString(),
	rangPeriode2Parcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_RangParcoursupPrecedent2.toString(),
	moyPeriode2Parcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_moyParcoursupPrecedente2.toString(),
	appreciation2Parcoursup:
		TypeColListeAppreciationProfsParService_1.TypeColListeAppreciationProfsParService.tcapps_AppreciationParcoursup2.toString(),
};
DonneesListe_ApprBulletin.dimensions = {
	largeurEleve: 250,
	largeurNote: 45,
	largeurClasse: 50,
	largeurRappelPeriodePrec: 250,
	largeurPositionnement: 50,
	largeurEvaluations: 175,
	largeurECTS: 65,
	largeurMoyenneDeliberee: 70,
	largeurDureeAbs: 70,
	largeurPhoto: 58,
	hauteurPhoto: 78,
	hauteurLigne: 40,
	largeurMinAppr: 160,
	largeurMaxAppr: 400,
	largeurRang: 45,
};
