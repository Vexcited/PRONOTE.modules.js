const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const {
	TypeColListeAppreciationProfsParService,
} = require("TypeColListeAppreciationProfsParService.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypeNote } = require("TypeNote.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreAnnotation } = require("Enumere_Annotation.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_DocumentsEleve,
} = require("ObjetFenetre_DocumentsEleve.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
const { ToucheClavier } = require("ToucheClavier.js");
class DonneesListe_ApprBulletin extends ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
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
			hauteurMinContenuCellule: ObjetDonneesListe.hauteurMinCellule,
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
	getControleur(aDonneesListe) {
		return $.extend(true, super.getControleur(aDonneesListe), {
			nodePhoto: function (aNoArticle) {
				$(this.node).on("error", () => {
					const lIndiceElement =
						aDonneesListe.Donnees.getIndiceElementParFiltre(
							((aLigne) => {
								const lEleve = aLigne.eleve;
								return lEleve.getNumero() === aNoArticle;
							}).bind(),
						);
					const lElement = aDonneesListe.Donnees.get(lIndiceElement);
					lElement.eleve.avecPhoto = false;
				});
			},
			surClicPiecesJointesProjAcc: function (aNoEleve) {
				$(this.node).on("click keyup", (aEvent) => {
					if (
						aEvent.type === "keyup" &&
						!(
							aEvent.which === ToucheClavier.Espace ||
							aEvent.which === ToucheClavier.RetourChariot
						)
					) {
						return;
					}
					const lIndiceElement =
						aDonneesListe.Donnees.getIndiceElementParFiltre(
							((aLigne) => {
								const lEleve = aLigne.eleve;
								return lEleve.getNumero() === aNoEleve;
							}).bind(),
						);
					const lElement = aDonneesListe.Donnees.get(lIndiceElement);
					if (
						!!lElement &&
						!!lElement.eleve &&
						!!lElement.eleve.avecDocsProjetsAccompagnement
					) {
						const lInstanceFenetre = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_DocumentsEleve,
							{ pere: aDonneesListe },
						);
						lInstanceFenetre.setDonnees(lElement.eleve);
					}
				});
			},
			btnBasculeJauge: {
				event: function () {
					aDonneesListe.param.clbckJauge();
				},
				getTitle: function () {
					return aDonneesListe.param.modeChronologique
						? GTraductions.getValeur(
								"BulletinEtReleve.hintBtnAfficherJaugeParNiveau",
							)
						: GTraductions.getValeur(
								"BulletinEtReleve.hintBtnAfficherJaugeChronologique",
							);
				},
				getSelection: function () {
					return aDonneesListe.param.modeChronologique;
				},
			},
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
					return lCol !== null && lCol !== undefined
						? !lCol.btnSigmaActif
						: false;
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
					return lCol !== null && lCol !== undefined
						? !lCol.btnSigmaActif
						: false;
				},
			},
			comboPeriodePrec: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 90,
						hauteur: 16,
						hauteurLigneDefault: 16,
						labelWAICellule: GTraductions.getValeur(
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
							EGenreEvenementObjetSaisie.selection &&
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
				return ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_ApprBulletin.colonnes.rangParcoursup:
			case DonneesListe_ApprBulletin.colonnes.dureeAbs:
			case DonneesListe_ApprBulletin.colonnes.moyEleve:
			case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
			case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
				return ObjetDonneesListe.ETypeCellule.Texte;
			case DonneesListe_ApprBulletin.colonnes.noteLSU:
			case DonneesListe_ApprBulletin.colonnes.ects:
				return ObjetDonneesListe.ETypeCellule.Note;
			case DonneesListe_ApprBulletin.colonnes.moyAnnuelle:
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
			case DonneesListe_ApprBulletin.colonnes.periodePrec:
			case DonneesListe_ApprBulletin.colonnes.eleve:
				return ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				return ObjetDonneesListe.ETypeCellule.ZoneTexte;
			default:
				return ObjetDonneesListe.ETypeCellule.Texte;
		}
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
						avecPhoto: aParams.article.avecPhoto,
						largeurPhoto: DonneesListe_ApprBulletin.dimensions.largeurPhoto,
						hauteur: DonneesListe_ApprBulletin.dimensions.hauteurPhoto,
						strProjetAcc: aParams.article.eleve.projetsAccompagnement,
						avecDocsProjetAcc:
							aParams.article.eleve.avecDocsProjetsAccompagnement,
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
				let lData = _getDataPeriodePrecCourante.call(this, aParams);
				return lSurExportCSV
					? this.moteur.composeStrPeriodePrec(lData)
					: this.moteur.composeHtmlPeriodePrec(lData);
			}
			case DonneesListe_ApprBulletin.colonnes.ects:
				return aParams.article.ECTS
					? lSurExportCSV
						? aParams.article.ECTS
						: new TypeNote(aParams.article.ECTS)
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
								TypePositionnementUtil.getGenrePositionnementParDefaut(
									aParams.article.typePositionnementClasse,
								),
							avecPrefixe: false,
						});
			case DonneesListe_ApprBulletin.colonnes.jaugeEval:
				if (lSurExportCSV) {
					return TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
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
						? GTraductions.getValeur("Notes.Colonne.TitreMoyNR")
						: this.moteur.composeHtmlMoyNR()
					: "";
			case DonneesListe_ApprBulletin.colonnes.moyParcoursup:
				return aParams.article.estMoyNR === true
					? lSurExportCSV
						? GTraductions.getValeur("Notes.Colonne.TitreMoyNR")
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
				let lData = _getDataPeriodePrecCourante.call(this, aParams);
				return this.moteur.composeHtmlEvolution({
					genreEvol: lData !== null && !!lData.evolution ? lData.evolution : 0,
				});
			}
			default:
				return "";
		}
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
		if (_estColAvecGras.call(this, aParams)) {
			T.push("Gras");
		}
		if (_estCellEditable.call(this, aParams)) {
			T.push(" AvecMain ");
		}
		if (_estColAvecAlignementDroit.call(this, aParams)) {
			T.push("AlignementDroit");
		} else if (_estColAvecAlignementMilieu(aParams)) {
			T.push("AlignementMilieu");
		}
		const lAvecCurseurInterdiction =
			!this.param.estEnConsultation && !_estCellEditable.call(this, aParams);
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
					T.push(" AvecMain ");
				}
				break;
		}
		return T.join(" ");
	}
	fusionCelluleAvecLignePrecedente(aParams) {
		const lEstColAppr =
			_estColAppreciation(aParams.idColonne) ||
			aParams.idColonne === DonneesListe_ApprBulletin.colonnes.avisProfesseur ||
			aParams.idColonne ===
				DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup;
		const lLigne = aParams.article;
		const lEstPere = lLigne.estPere;
		return lEstColAppr && !lEstPere && lLigne.fusionAppr === true;
	}
	getHintForce(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
				if (aParams.article.estMoyNR === true) {
					return GTraductions.getValeur("Notes.Colonne.HintMoyenneNR");
				}
				break;
		}
	}
	getCouleurCellule(aParams) {
		if (_estColFixe.call(this, aParams)) {
			return ObjetDonneesListe.ECouleurCellule.Fixe;
		} else if (_estDonneeEditable.call(this, aParams)) {
			return ObjetDonneesListe.ECouleurCellule.Blanc;
		} else {
			return ObjetDonneesListe.ECouleurCellule.Gris;
		}
	}
	avecEdition(aParams) {
		return _estCellEditable.call(this, aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ApprBulletin.colonnes.moyNonRepresentative:
			case DonneesListe_ApprBulletin.colonnes.avisReligionDeliberee:
			case DonneesListe_ApprBulletin.colonnes.avisReligionPropose:
				return _estCellEditable.call(this, aParams);
			case DonneesListe_ApprBulletin.colonnes.evolution:
			case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
				return _estCellEditable.call(this, aParams);
			case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
			case DonneesListe_ApprBulletin.colonnes.appreciationA:
			case DonneesListe_ApprBulletin.colonnes.appreciationB:
			case DonneesListe_ApprBulletin.colonnes.appreciationC:
				return (
					_estCellEditable.call(this, aParams) &&
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
			default:
				return null;
		}
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
				lAppr.setEtat(EGenreEtat.Modification);
				break;
			}
			case DonneesListe_ApprBulletin.colonnes.avisProfesseurParcoursup:
				aParams.article.appAvisProfParcoursup.setLibelle(!!V ? V.trim() : "");
				aParams.article.appAvisProfParcoursup.setEtat(EGenreEtat.Modification);
				break;
			case DonneesListe_ApprBulletin.colonnes.avisProfesseur:
				aParams.article.appAvisProfesseur.setLibelle(!!V ? V.trim() : "");
				aParams.article.appAvisProfesseur.setEtat(EGenreEtat.Modification);
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
					listeAnnotations: [EGenreAnnotation.dispense],
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
					? GParametres.general.maxECTS
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
		if (_estColAvecAlignementDroit.call(this, aParams)) {
			T.push("AlignementDroit");
		} else if (_estColAvecAlignementMilieu(aParams)) {
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
			boutons: [{ genre: ObjetListe.typeBouton.exportCSV }],
			nonEditableSurModeExclusif: true,
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
					taille: _getDimensionCol.call(this, lIdCol),
					titre: _getTitreCol.call(this, { col: aCol }),
					hint:
						aCol.hintCol !== null && aCol.hintCol !== undefined
							? aCol.hintCol
							: "",
				});
			});
		}
		return lColonnes;
	}
}
DonneesListe_ApprBulletin.colonnes = {
	eleve: TypeColListeAppreciationProfsParService.tcapps_Eleve.toString(),
	classe: TypeColListeAppreciationProfsParService.tcapps_Classe.toString(),
	dureeAbs:
		TypeColListeAppreciationProfsParService.tcapps_DureeAbsence.toString(),
	nbRetards: TypeColListeAppreciationProfsParService.tcapps_NbRet.toString(),
	evolution:
		TypeColListeAppreciationProfsParService.tcapps_EvolutionEleve.toString(),
	periodePrec:
		TypeColListeAppreciationProfsParService.tcapps_RappelPeriodePrecedente.toString(),
	nbDevoirs: TypeColListeAppreciationProfsParService.tcapps_NbNotes.toString(),
	moyEleve:
		TypeColListeAppreciationProfsParService.tcapps_MoyenneEleve.toString(),
	moyAnnuelle:
		TypeColListeAppreciationProfsParService.tcapps_MoyenneAnnuelle.toString(),
	nbEvals: TypeColListeAppreciationProfsParService.tcapps_NbEvals.toString(),
	jaugeEval:
		TypeColListeAppreciationProfsParService.tcapps_JaugeEvaluations.toString(),
	niveauAcqu:
		TypeColListeAppreciationProfsParService.tcapps_NiveauAcquisition.toString(),
	noteLSU: TypeColListeAppreciationProfsParService.tcapps_NoteLSU.toString(),
	moyProposee:
		TypeColListeAppreciationProfsParService.tcapps_MoyProposee.toString(),
	avisReligionPropose:
		TypeColListeAppreciationProfsParService.tcapps_AvisReligionProposee.toString(),
	moyDeliberee:
		TypeColListeAppreciationProfsParService.tcapps_MoyDeliberee.toString(),
	avisReligionDeliberee:
		TypeColListeAppreciationProfsParService.tcapps_AvisReligionDeliberee.toString(),
	ects: TypeColListeAppreciationProfsParService.tcapps_ECTSEleve.toString(),
	appreciationA:
		TypeColListeAppreciationProfsParService.tcapps_AppreciationA.toString(),
	appreciationB:
		TypeColListeAppreciationProfsParService.tcapps_AppreciationB.toString(),
	appreciationC:
		TypeColListeAppreciationProfsParService.tcapps_AppreciationC.toString(),
	appreciationReleve:
		TypeColListeAppreciationProfsParService.tcapps_AppreciationReleve.toString(),
	avisProfesseur:
		TypeColListeAppreciationProfsParService.tcapps_AvisProfesseur.toString(),
	rangParcoursup:
		TypeColListeAppreciationProfsParService.tcapps_RangParcoursup.toString(),
	moyParcoursup:
		TypeColListeAppreciationProfsParService.tcapps_MoyenneParcoursup.toString(),
	avisProfesseurParcoursup:
		TypeColListeAppreciationProfsParService.tcapps_AvisProfesseurParcoursup.toString(),
	moyNonRepresentative:
		TypeColListeAppreciationProfsParService.tcapps_MoyenneNonRepresentative.toString(),
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
function _getDataPeriodePrecCourante(aParams) {
	return this.moteur.getDataPeriodePrecCourante({
		listePeriodesPrec: aParams.article.listePeriodesPrec,
		avecSelectionPeriodePrec: this.param.avecSelectionPeriodePrec,
		periodePrecCourante: this.param.periodePrecCourante,
	});
}
function _estColEditable(aParams) {
	return this.moteur.estColEditable(
		this.param.listeColVisibles,
		aParams.idColonne,
	);
}
function _estColAvecGras(aParams) {
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
function _estColAvecAlignementDroit(aParams) {
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
	].includes(aParams.idColonne);
}
function _estColAvecAlignementMilieu(aParams) {
	return [
		DonneesListe_ApprBulletin.colonnes.evolution,
		DonneesListe_ApprBulletin.colonnes.moyNonRepresentative,
	].includes(aParams.idColonne);
}
function _estColAppreciation(aIdCol) {
	return (
		aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationReleve ||
		aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationA ||
		aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationB ||
		aIdCol === DonneesListe_ApprBulletin.colonnes.appreciationC
	);
}
function _estColFixe(aParams) {
	const lTabColFixe = [DonneesListe_ApprBulletin.colonnes.eleve];
	return lTabColFixe.includes(aParams.idColonne);
}
function _estDonneeEditable(aParams) {
	if (!_estColEditable.call(this, aParams)) {
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
			return D.niveauAcquEditable !== null && D.niveauAcquEditable !== undefined
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
			const lAppr = DonneesListe_ApprBulletin.getAppreciationDeColonne(aParams);
			return lAppr !== null && lAppr !== undefined ? lAppr.estEditable : false;
		}
	}
}
function _estCellEditable(aParams) {
	return _estDonneeEditable.call(this, aParams);
}
function _getHtmlCol(aParam) {
	return this.moteur.composeHtmlTitreCol(aParam);
}
function _getTitreCol(aParam) {
	const lCol = aParam.col;
	const lIdCol = lCol.typeCol.toString();
	switch (lIdCol) {
		case DonneesListe_ApprBulletin.colonnes.periodePrec:
			if (this.param.avecSelectionPeriodePrec) {
				return {
					libelleHtml: _getHtmlCol.call(this, {
						titreCol: this.param.periodePrecCourante
							? this.param.periodePrecCourante.titreRappelPeriode
							: lCol.titreCol,
						ieTexteCol: "getTitrePeriodePrec",
						avecCombo: true,
						modelCombo: "comboPeriodePrec",
					}),
					ignorerOverflowHidden: true,
				};
			} else {
				return lCol.titreCol;
			}
		case DonneesListe_ApprBulletin.colonnes.jaugeEval:
			return {
				libelleHtml: _getHtmlCol.call(this, {
					titreCol: lCol.titreCol,
					avecBtnImg: true,
					modelBtnImg: "btnBasculeJauge",
					classImg: "Image_BasculeJauge",
					avecCombo: false,
				}),
			};
		case DonneesListe_ApprBulletin.colonnes.ects:
			if (lCol.avecBtnSigmaECTS) {
				return {
					libelleHtml: _getHtmlCol.call(this, {
						titreCol: lCol.titreCol,
						avecBtnIcon: true,
						titleBtnImg: lCol.hintBtnSigmaECTS,
						modelBtnImg: "btnSigmaECTS",
						classImg: "icon_sigma",
						avecCombo: false,
					}),
				};
			} else {
				return lCol.titreCol;
			}
		case DonneesListe_ApprBulletin.colonnes.noteLSU:
			if (lCol.avecBtnSigmaLSUPos) {
				return {
					libelleHtml: _getHtmlCol.call(this, {
						titreCol: lCol.titreCol,
						titleBtnImg: lCol.hintBtnSigmaLSU,
						modelBtnImg: "btnSigmaLSU",
						avecBtnIcon: true,
						classImg: "icon_sigma",
						avecCombo: false,
					}),
				};
			} else {
				return lCol.titreCol;
			}
		case DonneesListe_ApprBulletin.colonnes.niveauAcqu:
			if (lCol.avecBtnSigmaLSUPos) {
				return {
					libelleHtml: _getHtmlCol.call(this, {
						titreCol: lCol.titreCol,
						avecBtnIcon: true,
						titleBtnImg: lCol.hintBtnSigmaPos,
						modelBtnImg: "btnSigmaPos",
						classImg: "icon_sigma",
						avecCombo: false,
					}),
				};
			} else {
				return lCol.titreCol;
			}
		case DonneesListe_ApprBulletin.colonnes.appreciationReleve:
		case DonneesListe_ApprBulletin.colonnes.appreciationA:
		case DonneesListe_ApprBulletin.colonnes.appreciationB:
		case DonneesListe_ApprBulletin.colonnes.appreciationC:
			if (lCol.avecVerrou) {
				return {
					libelleHtml: _getHtmlCol.call(this, {
						titreCol: lCol.titreCol,
						avecIcon: true,
						classImg: "icon_lock Texte14",
						avecCombo: false,
					}),
				};
			} else {
				return lCol.titreCol;
			}
		default:
			return lCol.titreCol;
	}
}
function _getDimensionCol(aTypeCol) {
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
			return ObjetListe.initColonne(
				100,
				lDimensions.largeurMinAppr,
				lDimensions.largeurMaxAppr,
			);
		default:
			return 80;
	}
}
module.exports = { DonneesListe_ApprBulletin };
