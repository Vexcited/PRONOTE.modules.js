const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetTri } = require("ObjetTri.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypeNote } = require("TypeNote.js");
const { MoteurNotesCP } = require("MoteurNotesCP.js");
const { TypeFusionTitreListe } = require("TypeFusionTitreListe.js");
const { GChaine } = require("ObjetChaine.js");
const { GImage } = require("ObjetImage.js");
const {
	EGenreEvenementSaisieNotes,
} = require("Enumere_EvenementSaisieNotes.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreEleveDansDevoir } = require("Enumere_EleveDansDevoir.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
	EGenreEvenementNotesEtAppreciations,
} = require("Enumere_EvenementNotesEtAppreciations.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ModeAffichageHeureAbsence } = require("TypeHeuresAbsences.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
class DonneesListe_PageNotes extends ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees.listeEleves);
		this.moteurNotesCP = aParam.moteurNotesCP;
		this.NbrEleves = aDonnees.listeEleves.count();
		this.NbrDevoirs = aDonnees.listeDevoirs.count();
		this.listeDevoirs = aDonnees.listeDevoirs;
		this.param = $.extend(
			{
				avecColonneClasse: false,
				matiere: new ObjetElement(),
				service: new ObjetElement(),
				periode: new ObjetElement(),
				listeClasses: new ObjetListeElements(),
				forcerMoyenneBruteDevoir: false,
				forcerSansSousService: false,
				avecNomMatiere: false,
				avecTotal: false,
				baremeParDefaut: GParametres.baremeNotation,
				avecAffichageAnciens: false,
				avecNomProfesseur: false,
				callbackEvnt: null,
				instance: null,
				optionsAffichage: null,
				pourImpression: false,
				avecImport: false,
				avecColNR: false,
			},
			aParam,
		);
		this.controlerElevesDansDevoirEtPeriode();
		this.Service = this.param.service;
		this.avecSousServices =
			!this.param.forcerSansSousService &&
			this.Service.estUnService && this.Service.periode.moyenneParSousMatiere &&
			this.Service.listeServices.count() > 0;
		this.avecPeriodes =
			(!this.param.periode.existeNumero() &&
				this.param.periode.getGenre() === 1) ||
			this.param.periode.listePeriodesNotation !== undefined;
		this.periode = this.param.periode;
		this.nbrPeriodes = this.getNbrPeriodes();
		this.titrePeriodes = this.getTitrePeriodes();
		this.nbrPeriodesAffichage = this.avecPeriodes
			? this.titrePeriodes.length
			: 0;
		this.avecGenreNotation =
			this.Service.listeGenreNotation &&
			this.Service.listeGenreNotation.count() > 1 &&
			(!this.avecSousServices || this.Service.pere.existeNumero()) &&
			!this.avecPeriodes &&
			this.periode.existeNumero();
		this.afficherNomProfesseur = !!this.param.avecNomProfesseur;
		const lThis = this;
		this.avecCompetences = false;
		this.avecCommentaireSurNoteEleve = false;
		this.listeDevoirs.parcourir((aDevoir) => {
			if (aDevoir.evaluation) {
				lThis.avecCompetences = true;
			}
			if (aDevoir.avecCommentaireSurNoteEleve) {
				lThis.avecCommentaireSurNoteEleve = true;
			}
			if (this.avecCompetences && this.avecCommentaireSurNoteEleve) {
				return false;
			}
		});
		this.idBtnCreerDevoir = "_BtnCreerDevoir";
		this.affichageAnciensEleves = this.param.avecAffichageAnciens;
		this.avecColonneTDOption = false;
		this.genreNote = {
			devoir: 0,
			devoirRattrapage: 1,
			moyenneRattrapage: 2,
			serviceRattrapage: 3,
		};
		this.genreRattrapage = {
			GR_Meilleure: 0,
			GR_Moyenne: 1,
			GR_Rattrapage: 2,
			GR_RattrapageService: 3,
		};
		this.genreMoyenne = {
			GM_Moyenne: 0,
			GM_MoyenneBrute: 1,
			GM_MoyennePeriode: 2,
			GM_MoyenneSousService: 3,
			GM_MoyenneGenreNotation: 4,
			GM_MoyenneAvRattrapageService: 5,
		};
		this.genreColonne = {
			Eleve: -5,
			Classe: -4,
			Moyenne: -3,
			MoyenneBrute: -2,
			BonusMalus: -1,
			MoyennePeriode: -100,
			MoyennePeriodeBrute: -200,
			MoyenneSousService: -300,
			MoyenneSousServiceBrute: -400,
			MoyenneGenreNotation: -500,
			MoyenneGenreNotationBrute: -600,
			Devoir: -700,
			TDOption: -6,
			Absences: -7,
			MoyenneAvRattrapageService: -8,
			MoyNR: -9,
		};
		this.avecRattrapageService = false;
		this.listeDevoirs.parcourir((aDevoir) => {
			const lDevoirRattrapage = _getDevoirRattrapage(aDevoir);
			const lServiceRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					lThis.getGenreRattrapage(lThis.genreRattrapage.GR_RattrapageService);
			if (lServiceRattrapage) {
				lThis.avecRattrapageService = true;
				return false;
			}
		});
		if (this.avecSousServices) {
			for (
				let I = 0, lNbr = this.Service.listeServices.count();
				I < lNbr;
				I++
			) {
				this.moteurNotesCP.rechercherNotePlusHauteEtPlusBasse({
					listeEleves: this.Donnees,
					listeElevesSelection: null,
					service: this.Service,
					numeroService: this.Service.listeServices.getNumero(I),
					avecGenreNotation: this.avecGenreNotation,
					affichageAnciensEleves: this.affichageAnciensEleves,
					periode: this.periode,
					listeDevoirs: this.listeDevoirs,
					devoirDansPeriode: this.devoirDansPeriode.bind(this),
					eleveDansDevoir: this.eleveDansDevoir.bind(this),
					baremeParDefaut: this.param.baremeParDefaut,
				});
			}
		} else {
			this.moteurNotesCP.rechercherNotePlusHauteEtPlusBasse({
				listeEleves: this.Donnees,
				listeElevesSelection: null,
				service: this.Service,
				numeroService: 0,
				avecGenreNotation: this.avecGenreNotation,
				affichageAnciensEleves: this.affichageAnciensEleves,
				periode: this.periode,
				listeDevoirs: this.listeDevoirs,
				devoirDansPeriode: this.devoirDansPeriode.bind(this),
				eleveDansDevoir: this.eleveDansDevoir.bind(this),
				baremeParDefaut: this.param.baremeParDefaut,
			});
		}
		_calculerMoyennes.call(this);
		this.param.instance.setOptionsListe({
			colonnes: this._getContexteColonnes(
				aDonnees.listeEleves,
				this.param.pourImpression,
			),
			colonnesCachees: this._getContexteColonnesCachees(),
			colonnesTriables: this._getContexteColonnesTriables(),
			hauteurAdapteContenu: Infinity,
			scrollHorizontal: _getIdByCol({
				id: DonneesListe_PageNotes.colonnes.devoir,
				indice: 0,
			}),
			avecReservationPlaceScrollHorizontal: true,
			AvecSuppression: false,
			avecLigneTotal: true,
			alternanceCouleurLigneContenu: true,
			nonEditableSurModeExclusif: true,
			avecSelectionLigneSurImpression: false,
			boutons: [
				{
					genre: ObjetListe.typeBouton.exportCSV,
					getNomFichier: function () {
						return (
							lThis.Service.getLibelle() || lThis.Service.matiere.getLibelle()
						);
					},
				},
			],
		});
		this.setOptions({
			avecEtatSaisie: false,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresEditionValidationSansModification: true,
			editionApresSelection: false,
			editionSurSelectionApresFinEdition: true,
			avecSelectionSurNavigationClavier: false,
			avecNavigationClavierFlechesEnEdition: true,
			avecCelluleSuivanteSurFinEdition: true,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getEditionDevoir: function (I) {
				$(this.node).eventValidation(() => {
					aInstance.surEditionDevoir(I);
				});
			},
			boutonCreerDevoir: {
				event: function () {
					aInstance.surCreerDevoir();
				},
				getDisabled: function () {
					return !aInstance.actifBoutonCreerDevoir;
				},
			},
			boutonImport: {
				getOptionsSelecFile: function () {
					return {
						maxSize: 500 * 1024 * 1024,
						extensions: ["xlsx", "xls", "xlsm", "xlsb", "ods", "csv", "txt"],
					};
				},
				addFiles: function (aParametres) {
					aInstance.surImporter(aParametres);
				},
				getDisabled: function () {
					let lEstClasseXORGroupe = true;
					if (aInstance.Service.avecSousService > 0) {
						let lFlag = false;
						for (
							let i = 0,
								lNbr = aInstance.Service.listeServices.count() && !lFlag;
							i < lNbr;
							i++
						) {
							const lService = aInstance.Service.listeServices.get(i);
							if (
								(lService.classe.getNumero() === 0 &&
									lService.groupe.getNumero() === 0) ||
								(lService.classe.getNumero() !== 0 &&
									lService.groupe.getNumero() !== 0)
							) {
								lFlag = true;
							}
						}
						lEstClasseXORGroupe = !lFlag;
					}
					if (
						((aInstance.Service.classe.getNumero() === 0 &&
							aInstance.Service.groupe.getNumero() !== 0) ||
							(aInstance.Service.classe.getNumero() !== 0 &&
								aInstance.Service.groupe.getNumero() === 0)) &&
						aInstance.actifBoutonCreerDevoir &&
						lEstClasseXORGroupe
					) {
						return false;
					} else {
						return true;
					}
				},
			},
			evntKiosque: function (aEleve, aDevoir) {
				$(this.node).on("mouseup", () => {
					aInstance.surEvntKiosque(aEleve, aDevoir);
				});
			},
		});
	}
	avecEvenementSelectionClick(aParams) {
		if (_estCellMethodeCalculMoyenne.call(this, aParams.article, aParams)) {
			switch (aParams.declarationColonne.genreColonne) {
				case this.genreColonne.Moyenne:
					this.surEvntMethodeCalculMoyenne(
						aParams.article,
						null,
						this.genreMoyenne.GM_Moyenne,
					);
					break;
				case this.genreColonne.MoyenneAvRattrapageService:
					this.surEvntMethodeCalculMoyenne(
						aParams.article,
						null,
						this.genreMoyenne.GM_MoyenneAvRattrapageService,
					);
					break;
				case this.genreColonne.MoyenneBrute:
					this.surEvntMethodeCalculMoyenne(
						aParams.article,
						null,
						this.genreMoyenne.GM_MoyenneBrute,
					);
					break;
				case this.genreColonne.MoyennePeriode:
					this.surEvntMethodeCalculMoyenne(
						aParams.article,
						aParams.declarationColonne.numeroPeriode,
						this.genreMoyenne.GM_MoyennePeriode,
						aParams.declarationColonne.rangColonne,
					);
					break;
				case this.genreColonne.MoyenneSousService:
					this.surEvntMethodeCalculMoyenne(
						aParams.article,
						aParams.declarationColonne.numeroService,
						this.genreMoyenne.GM_MoyenneSousService,
					);
					break;
				case this.genreColonne.MoyenneGenreNotation:
					this.surEvntMethodeCalculMoyenne(
						aParams.article,
						aParams.declarationColonne.numeroNotation,
						this.genreMoyenne.GM_MoyenneGenreNotation,
					);
					break;
				default:
					break;
			}
		} else if (aParams.idColonne === DonneesListe_PageNotes.colonnes.absences) {
			const lEleve = this.Donnees.getElementParNumero(aParams.article.Numero);
			const lParamEvnt = {
				genreEvnt: EGenreEvenementSaisieNotes.ClicCelluleAbsences,
				eleve: lEleve,
			};
			if (this.param.avecColonneClasse) {
				lParamEvnt.classe = lEleve.classe;
			}
			this.param.callbackEvnt(lParamEvnt);
			return false;
		}
		return false;
	}
	avecEdition(aParams) {
		return _estCellEditable.call(this, aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.declarationColonne.genreColonne) {
			case this.genreColonne.MoyNR:
				return true;
			default:
				break;
		}
		return false;
	}
	avecMenuContextuel(aParams) {
		let lANoteInutile = false;
		const lEleve = aParams.article;
		if (lEleve) {
			for (const x in lEleve.dansDevoir) {
				if (
					lEleve.dansDevoir[x] === EGenreEleveDansDevoir.Non &&
					lEleve.listeDevoirs &&
					lEleve.listeDevoirs.getElementParNumero(x) &&
					lEleve.listeDevoirs.getElementParNumero(x).note &&
					lEleve.listeDevoirs.getElementParNumero(x).note.getNote()
				) {
					lANoteInutile = true;
					break;
				}
			}
		}
		return lANoteInutile;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			1,
			GTraductions.getValeur(
				"Notes.MenuContext.SupprimerLesNotesNonComptabilises",
			),
			true,
		);
		aParametres.menuContextuel.setDonnees();
	}
	getValeursMoy(aParam) {
		let lNote, lNoteRattrapageService, lRattraperNote;
		lNote = aParam.article.moyennes[MoteurNotesCP.genreMoyenne.Moyenne];
		lNoteRattrapageService = this.moteurNotesCP.getNoteRattrapageServiceDEleve({
			eleve: aParam.article,
			listeDevoirs: this.listeDevoirs,
			baremeParDefaut: this.param.baremeParDefaut,
		});
		lRattraperNote =
			!this.periodesPourCalculMoyennes() &&
			!this.avecSousServices &&
			!!lNoteRattrapageService &&
			!lNoteRattrapageService.estUneNoteVide() &&
			(!lNoteRattrapageService.estUneAnnotation() ||
				(this.avecUtilisationAnnotationFelicitation() &&
					lNoteRattrapageService.getValeur() >
						this.param.baremeParDefaut.getValeur()));
		return {
			note: lNote,
			noteRattrapage: lNoteRattrapageService,
			rattraperNote: lRattraperNote,
		};
	}
	getValeur(aParams) {
		const lSurExportCSV = aParams && aParams.surExportCSV;
		let lNote, lNoteEleveRattrapageService;
		switch (aParams.declarationColonne.genreColonne) {
			case this.genreColonne.Eleve:
				return this.composeEleveProjetAcc(
					aParams.article,
					lSurExportCSV,
					this.param.pourImpression,
				);
			case this.genreColonne.Classe:
				return aParams.article.classe.getLibelle();
			case this.genreColonne.TDOption:
				return aParams.article.listeTDOptions.getTableauLibelles().join(", ");
			case this.genreColonne.Absences:
				return this.composeAbsences(
					aParams.article.absences,
					this.param.optionsAffichage.modeAffichageHeureAbsence,
				);
			case this.genreColonne.Moyenne: {
				let lValeursMoy = this.getValeursMoy({ article: aParams.article });
				lNote = lValeursMoy.note;
				lNoteEleveRattrapageService = lValeursMoy.noteRattrapage;
				if (lValeursMoy.rattraperNote) {
					lNote = lNoteEleveRattrapageService;
				}
				const lEstFacultatif =
					this.Service.facultatif === true &&
					lNote.getValeur() <= this.param.baremeParDefaut.getValeur() / 2;
				return lEstFacultatif && !lSurExportCSV ? "(" + lNote + ")" : lNote;
			}
			case this.genreColonne.MoyNR:
				if (aParams.article.estMoyNR === true) {
					return lSurExportCSV === true
						? GTraductions.getValeur("Notes.Colonne.TitreMoyNR")
						: this.moteurNotesCP.composeHtmlMoyNR();
				} else {
					return "";
				}
			case this.genreColonne.MoyenneAvRattrapageService:
				return aParams.article.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService
				];
			case this.genreColonne.MoyenneBrute:
				return aParams.article.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneBrute
				];
			case this.genreColonne.BonusMalus:
				if (
					!aParams.surEdition &&
					_getBonusMalus.call(this, aParams.article).valeur === 0
				) {
					return null;
				}
				return _getBonusMalus.call(this, aParams.article);
			case this.genreColonne.MoyennePeriode:
				lNote =
					aParams.article.moyennes[
						MoteurNotesCP.genreMoyenne.MoyennePeriode -
							aParams.declarationColonne.rangColonne
					];
				if (
					!this.Service.listeServices ||
					(this.Service.listeServices && !this.Service.listeServices.count())
				) {
					lNoteEleveRattrapageService =
						this.moteurNotesCP.getNoteRattrapageServiceDElevePeriode({
							eleve: aParams.article,
							listeDevoirs: this.listeDevoirs,
							numeroPeriode:
								this.titrePeriodes.length > 0
									? this.titrePeriodes[
											aParams.declarationColonne.rangColonne
										].getNumero()
									: this.periode.getNumero(),
							indicePeriode: aParams.declarationColonne.rangColonne,
							devoirDansPeriode: this.devoirDansPeriode.bind(this),
							baremeParDefaut: this.param.baremeParDefaut,
						});
					if (
						!!lNoteEleveRattrapageService &&
						!lNoteEleveRattrapageService.estUneNoteVide() &&
						(!lNoteEleveRattrapageService.estUneAnnotation() ||
							(this.avecUtilisationAnnotationFelicitation() &&
								lNoteEleveRattrapageService.getValeur() >
									this.param.baremeParDefaut.getValeur()))
					) {
						lNote = lNoteEleveRattrapageService;
					}
				}
				return lNote;
			case this.genreColonne.MoyenneSousService:
				lNote =
					aParams.article.moyennes[
						MoteurNotesCP.genreMoyenne.MoyenneSousService -
							aParams.declarationColonne.rangColonne
					];
				lNoteEleveRattrapageService =
					this.moteurNotesCP.getNoteRattrapageServiceDEleveSousService({
						eleve: aParams.article,
						listeDevoirs: this.listeDevoirs,
						numeroPeriode: this.periode.getNumero(),
						numeroService: this.Service.listeServices
							.get(aParams.declarationColonne.rangColonne)
							.getNumero(),
						indiceService: aParams.declarationColonne.rangColonne,
						devoirDansPeriode: this.devoirDansPeriode.bind(this),
						baremeParDefaut: this.param.baremeParDefaut,
					});
				if (
					!!lNoteEleveRattrapageService &&
					!lNoteEleveRattrapageService.estUneNoteVide() &&
					(!lNoteEleveRattrapageService.estUneAnnotation() ||
						(this.avecUtilisationAnnotationFelicitation() &&
							lNoteEleveRattrapageService.getValeur() >
								this.param.baremeParDefaut.getValeur()))
				) {
					lNote = lNoteEleveRattrapageService;
				}
				return lNote;
			case this.genreColonne.MoyenneGenreNotation:
				return aParams.article.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
						aParams.declarationColonne.rangColonne
				];
			case this.genreColonne.Devoir:
				return this.composeNoteDevoir(aParams);
			default:
				return "";
		}
	}
	getWAIIdColonnePourDescription(aParams) {
		if (aParams.declarationColonne.genreColonne !== this.genreColonne.Eleve) {
			return DonneesListe_PageNotes.colonnes.eleves;
		}
		return null;
	}
	getWAIInputEdition(aParams) {
		if (_estColDevoir.call(this, aParams)) {
			return GTraductions.getValeur("PageNotes.WAINoteDe_S", [
				aParams.article.getLibelle(),
			]);
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (
			_estColDevoir.call(this, aParams) ||
			aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus
		) {
			return ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe.ETypeCellule.Html;
	}
	getHintForce(aParams) {
		if (_estColDevoir.call(this, aParams)) {
			const lDevoir = this.listeDevoirs.get(
				aParams.declarationColonne.rangColonne,
			);
			const lMessage = this.moteurNotesCP.getMsgNoteNonEditable({
				devoir: lDevoir,
				eleve: aParams.article,
				eleveDevoir: lDevoir.listeEleves.getElementParNumero(
					aParams.article.getNumero(),
				),
				devoirDansPeriode: this.devoirDansPeriode.bind(this),
			});
			return lMessage;
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus) {
			if (_estDonneeCloture.call(this, aParams)) {
				return GTraductions.getValeur("PeriodeCloturee");
			} else {
				const lPeriodeBonus = aParams.article.listePeriodes.getElementParNumero(
					this.periode.getNumero(),
				);
				if (
					_estBonusMalusConformeAbsences(
						lPeriodeBonus.bonusMalus,
						lPeriodeBonus.malusAbsences,
					) &&
					!this.param.pourImpression
				) {
					return GTraductions.getValeur("Notes.HintMalusAbsences");
				}
			}
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyNR) {
			if (_estDonneeCloture.call(this, aParams)) {
				return GTraductions.getValeur("PeriodeCloturee");
			} else {
				if (aParams.article.estMoyNR) {
					return GTraductions.getValeur("Notes.Colonne.HintMoyenneNR");
				}
			}
		}
	}
	getClass(aParams) {
		const T = [];
		if (
			aParams.idColonne !== DonneesListe_PageNotes.colonnes.eleves &&
			aParams.idColonne !== DonneesListe_PageNotes.colonnes.classe &&
			aParams.idColonne !== DonneesListe_PageNotes.colonnes.moyNR
		) {
			T.push("AlignementDroit");
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyNR) {
			T.push("AlignementMilieu");
		}
		if (
			aParams.idColonne === DonneesListe_PageNotes.colonnes.moyenne &&
			this.param.avecColNR &&
			aParams.article.estMoyNR
		) {
			T.push("Gris");
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.absences) {
			const lDuree = this.getDureeAbsence(
				aParams.article.absences,
				this.param.optionsAffichage.modeAffichageHeureAbsence,
			);
			if (lDuree > 0) {
				T.push("AvecMain");
			}
		}
		if (_estColDevoir.call(this, aParams)) {
			const lEleveDevoir = _getEleveDevoir(aParams);
			if (_estExecKiosque.call(this, lEleveDevoir)) {
				T.push("LienAccueil", "AvecMain");
			}
			const lDevoir = _getDevoir(aParams);
			const lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
			if (
				lDevoirRattrapage &&
				aParams.declarationColonne.estRattrapageDevoir &&
				!_avecSasieRattrapage.call(this, {
					eleve: aParams.article,
					eleveDevoir: lEleveDevoir,
					devoir: lDevoir,
					devoirRattrapage: lDevoirRattrapage,
				}) &&
				!(
					aParams.declarationColonne.estRattrapageMoyenne &&
					lDevoirRattrapage.genreRattrapage ===
						this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne)
				)
			) {
				T.push("note-rattrapage");
			}
			const lEleveDevoirRattrapage =
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[aParams.article.getNumero()]
					? lDevoirRattrapage.objetListeEleves[aParams.article.getNumero()]
					: false;
			const lDevoirRattrapageMoy =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote("");
			const lNote = lEleveDevoir ? lEleveDevoir.Note : new TypeNote("");
			let lAfficherCommePlusBasseRattrap = false,
				lAfficherCommePlusHauteRattrap = false;
			let lAfficherCommePlusBasseMoyRattrap = false,
				lAfficherCommePlusHauteMoyRattrap = false;
			let lAfficherCommePlusHaute = _afficherCommePlusHaute.call(
				this,
				lNote,
				this.Service,
			);
			if (lAfficherCommePlusHaute) {
				if (
					lDevoirRattrapage &&
					!lDevoirRattrapageMoy &&
					lNoteRattrapage.estUneValeur() &&
					(lNote.getValeur() <= lNoteRattrapage.getValeur() ||
						!lNote.estUneValeur())
				) {
					lAfficherCommePlusHauteRattrap = true;
					lAfficherCommePlusHaute = false;
				} else if (lDevoirRattrapage && lDevoirRattrapageMoy) {
					lAfficherCommePlusHauteMoyRattrap = true;
					lAfficherCommePlusHaute = false;
				}
			}
			let lAfficherCommePlusBasse = _afficherCommePlusBasse.call(
				this,
				lNote,
				this.Service,
			);
			if (lAfficherCommePlusBasse) {
				if (
					lDevoirRattrapage &&
					!lDevoirRattrapageMoy &&
					lNoteRattrapage.estUneValeur() &&
					(lNote.getValeur() > lNoteRattrapage.getValeur() ||
						!lNote.estUneValeur())
				) {
					lAfficherCommePlusBasseRattrap = true;
					lAfficherCommePlusBasse = false;
				} else if (lDevoirRattrapage && lDevoirRattrapageMoy) {
					lAfficherCommePlusBasseMoyRattrap = true;
					lAfficherCommePlusBasse = false;
				}
			}
			if (
				aParams.declarationColonne.estRattrapageDevoir &&
				aParams.declarationColonne.estRattrapageMoyenne
			) {
				if (
					lAfficherCommePlusHauteMoyRattrap ||
					lAfficherCommePlusBasseMoyRattrap
				) {
					T.push("Gras");
				}
			} else if (aParams.declarationColonne.estRattrapageDevoir) {
				if (lAfficherCommePlusHauteRattrap || lAfficherCommePlusBasseRattrap) {
					T.push("Gras");
				}
			} else {
				if (lAfficherCommePlusHaute || lAfficherCommePlusBasse) {
					T.push("Gras");
				}
			}
		}
		return T.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (_estCellMethodeCalculMoyenne.call(this, aParams.article, aParams)) {
			T.push("Curseur_MethodeCalculMoyenneActif");
		}
		return T;
	}
	getCouleurCellule(aParams, aCouleurCellule) {
		const lPourImpression = this.param.pourImpression;
		if (_estColDevoir.call(this, aParams)) {
			const lEleve = aParams.article;
			const lDevoir = _getDevoir(aParams);
			const lEleveDevoir = _getEleveDevoir(aParams);
			const lNote = lEleveDevoir.Note;
			const lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
			const lEleveDevoirRattrapage =
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					: false;
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote("");
			const lDevoirRattrapageGenreRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Rattrapage);
			const lDevoirRattrapageMoy =
				lDevoirRattrapage.genreRattrapage ===
				this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
			const lServiceRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_RattrapageService);
			const lNoteMoyenne = lEleve.moyennes[this.genreColonne.Moyenne];
			const lNoteRef = lServiceRattrapage ? lNoteMoyenne : lNote;
			const lNoteCourrante = aParams.declarationColonne.estRattrapageDevoir
				? aParams.declarationColonne.estRattrapageMoyenne
					? this.moteurNotesCP.getMoyenneNotesRattrapage(
							lNote,
							lNoteRattrapage,
							lDevoirRattrapage.noteSeuil,
						)
					: lNoteRattrapage
				: lNote;
			let lRattrapageMoinsBon = false,
				lNoteMoinsBonne = false;
			if (
				this.moteurNotesCP.afficherCommeUnBonus({
					note: lNoteCourrante,
					devoir: lDevoir,
					service: this.Service,
				})
			) {
				aCouleurCellule.texte = GCouleur.grisTresFonce;
				return aCouleurCellule;
			}
			if (lDevoirRattrapageMoy) {
				lNoteMoinsBonne = true;
				lRattrapageMoinsBon = true;
			} else if (lDevoirRattrapageGenreRattrapage) {
				lNoteMoinsBonne = true;
				lRattrapageMoinsBon = false;
			} else if (lDevoirRattrapage && !lServiceRattrapage) {
				if (lNoteRef.estUneValeur() && lNoteRattrapage.estUneValeur()) {
					if (lNoteRef.getValeur() < lNoteRattrapage.getValeur()) {
						lNoteMoinsBonne = true;
					} else {
						lRattrapageMoinsBon = true;
					}
				} else {
					if (!lNoteRef.estUneValeur() && !lNoteRattrapage.estUneNoteVide()) {
						lNoteMoinsBonne = true;
					}
					if (!lNoteRattrapage.estUneValeur()) {
						lRattrapageMoinsBon = true;
					}
				}
			}
			if (!lDevoirRattrapage) {
				aCouleurCellule.texte = this.getCouleurDeNoteDeDevoir(
					lNote,
					lDevoir,
					lPourImpression,
				);
				return aCouleurCellule;
			} else {
				let lCouleurNoteRattrapage;
				if (!aParams.declarationColonne.estRattrapageMoyenne) {
					if (aParams.declarationColonne.estRattrapageDevoir) {
						lCouleurNoteRattrapage = lRattrapageMoinsBon
							? GCouleur.grisTresFonce
							: this.getCouleurDeNoteDeDevoir(
									lNoteCourrante,
									lDevoir,
									lPourImpression,
								);
					} else {
						lCouleurNoteRattrapage = lNoteMoinsBonne
							? GCouleur.grisTresFonce
							: this.getCouleurDeNoteDeDevoir(
									lNoteCourrante,
									lDevoir,
									lPourImpression,
								);
					}
				} else {
					lCouleurNoteRattrapage = this.getCouleurDeNoteDeDevoir(
						lNoteCourrante,
						lDevoir,
						lPourImpression,
					);
				}
				aCouleurCellule.texte = lCouleurNoteRattrapage;
				return aCouleurCellule;
			}
		}
		if (
			[
				this.genreColonne.Moyenne,
				this.genreColonne.MoyenneBrute,
				this.genreColonne.MoyenneAvRattrapageService,
				this.genreColonne.MoyennePeriode,
				this.genreColonne.MoyennePeriodeBrute,
				this.genreColonne.MoyenneSousService,
				this.genreColonne.MoyenneSousServiceBrute,
				this.genreColonne.MoyenneGenreNotation,
				this.genreColonne.MoyenneGenreNotationBrute,
			].includes(aParams.declarationColonne.genreColonne)
		) {
			const lGenreColonne =
				aParams.declarationColonne.genreColonne -
				(aParams.declarationColonne.rangColonne !== undefined
					? aParams.declarationColonne.rangColonne
					: 0);
			let lNoteSeuilComparative;
			if (
				aParams.declarationColonne.genreColonne !==
					this.genreColonne.MoyenneBrute &&
				!!this.Service
			) {
				let lService = _getServiceOuSousServiceDeLaColonneMoyenne.call(
					this,
					lGenreColonne,
				);
				if (!lService) {
					lService = this.Service;
				}
				lNoteSeuilComparative = lService.valeurSeuil;
			}
			if (!lNoteSeuilComparative) {
				lNoteSeuilComparative = GParametres.seuilNotation;
			}
			if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyenne) {
				let lValeursMoy = this.getValeursMoy({ article: aParams.article });
				let lNoteMoy = lValeursMoy.note;
				const lNoteEleveRattrapageService = lValeursMoy.noteRattrapage;
				if (lValeursMoy.rattraperNote) {
					lNoteMoy = lNoteEleveRattrapageService;
				}
				if (
					aParams.idColonne === DonneesListe_PageNotes.colonnes.moyenne &&
					this.Service.facultatif === true &&
					lNoteMoy.getValeur() <= this.param.baremeParDefaut.getValeur() / 2
				) {
					aCouleurCellule.texte = GCouleur.grisTresFonce;
				} else {
					aCouleurCellule.texte = this.getCouleurDeNoteSousSeuil(
						lNoteMoy,
						lNoteSeuilComparative,
						lPourImpression,
					);
				}
			} else if (
				aParams.declarationColonne.genreColonne ===
				this.genreColonne.MoyenneSousService
			) {
				let lNote = aParams.article.moyennes[lGenreColonne];
				let lNoteEleveRattrapageService =
					this.moteurNotesCP.getNoteRattrapageServiceDEleveSousService({
						eleve: aParams.article,
						listeDevoirs: this.listeDevoirs,
						numeroPeriode: this.periode.getNumero(),
						numeroService: this.Service.listeServices
							.get(aParams.declarationColonne.rangColonne)
							.getNumero(),
						indiceService: aParams.declarationColonne.rangColonne,
						devoirDansPeriode: this.devoirDansPeriode.bind(this),
						baremeParDefaut: this.param.baremeParDefaut,
					});
				if (
					!!lNoteEleveRattrapageService &&
					!lNoteEleveRattrapageService.estUneNoteVide() &&
					(!lNoteEleveRattrapageService.estUneAnnotation() ||
						(this.avecUtilisationAnnotationFelicitation() &&
							lNoteEleveRattrapageService.getValeur() >
								this.param.baremeParDefaut.getValeur()))
				) {
					lNote = lNoteEleveRattrapageService;
				}
				aCouleurCellule.texte = this.getCouleurDeNoteSousSeuil(
					lNote,
					lNoteSeuilComparative,
					lPourImpression,
				);
			} else if (
				aParams.declarationColonne.genreColonne ===
				this.genreColonne.MoyennePeriode
			) {
				let lNote = aParams.article.moyennes[lGenreColonne];
				if (
					!this.Service.listeServices ||
					(this.Service.listeServices && !this.Service.listeServices.count())
				) {
					let lNoteEleveRattrapageService =
						this.moteurNotesCP.getNoteRattrapageServiceDElevePeriode({
							eleve: aParams.article,
							listeDevoirs: this.listeDevoirs,
							numeroPeriode:
								this.titrePeriodes.length > 0
									? this.titrePeriodes[
											aParams.declarationColonne.rangColonne
										].getNumero()
									: this.periode.getNumero(),
							indicePeriode: aParams.declarationColonne.rangColonne,
							devoirDansPeriode: this.devoirDansPeriode.bind(this),
							baremeParDefaut: this.param.baremeParDefaut,
						});
					if (
						!!lNoteEleveRattrapageService &&
						!lNoteEleveRattrapageService.estUneNoteVide() &&
						(!lNoteEleveRattrapageService.estUneAnnotation() ||
							(this.avecUtilisationAnnotationFelicitation() &&
								lNoteEleveRattrapageService.getValeur() >
									this.param.baremeParDefaut.getValeur()))
					) {
						lNote = lNoteEleveRattrapageService;
					}
				}
				aCouleurCellule.texte = this.getCouleurDeNoteSousSeuil(
					lNote,
					lNoteSeuilComparative,
					lPourImpression,
				);
			} else {
				aCouleurCellule.texte = this.getCouleurDeNoteSousSeuil(
					aParams.article.moyennes[lGenreColonne],
					lNoteSeuilComparative,
					lPourImpression,
				);
			}
			return aCouleurCellule;
		}
	}
	getValeurPourTri(aColonne, aArticle) {
		const lCol = _getColById(this.getId(aColonne));
		switch (lCol.id) {
			case DonneesListe_PageNotes.colonnes.eleves:
				return aArticle.Position;
			case DonneesListe_PageNotes.colonnes.classe:
				return aArticle.classe.Libelle;
			case DonneesListe_PageNotes.colonnes.moyenne: {
				let lValeursMoy = this.getValeursMoy({ article: aArticle });
				let lNote = lValeursMoy.note;
				let lNoteEleveRattrapageService = lValeursMoy.noteRattrapage;
				if (lValeursMoy.rattraperNote) {
					lNote = lNoteEleveRattrapageService;
				}
				return lNote;
			}
			case DonneesListe_PageNotes.colonnes.moyenneBrute:
				return aArticle.moyennes[MoteurNotesCP.genreMoyenne.MoyenneBrute];
			case DonneesListe_PageNotes.colonnes.moyenneSousService:
				return aArticle.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneSousService - lCol.indice
				];
			case DonneesListe_PageNotes.colonnes.moyenneGenreNotation:
				return aArticle.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneGenreNotation - lCol.indice
				];
			case DonneesListe_PageNotes.colonnes.moyenneAvRattrapageService:
				return aArticle.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService
				];
			case DonneesListe_PageNotes.colonnes.bonusMalus:
				return _getBonusMalus.call(this, aArticle).getValeur();
			case DonneesListe_PageNotes.colonnes.moyNR:
				return aArticle.estMoyNR;
			default:
				return super.getValeurPourTri(aColonne, aArticle);
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		let lTris = [];
		const lThis = this;
		const lGenreTriInverse = aGenreTri === -1 ? 1 : -1;
		if (MethodesObjet.isNumber(aColonneDeTri)) {
			const lCol = _getColById(this.getId(aColonneDeTri));
			switch (lCol.id) {
				case DonneesListe_PageNotes.colonnes.eleves:
				case DonneesListe_PageNotes.colonnes.classe:
					lTris.push(
						ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
				case DonneesListe_PageNotes.colonnes.absences:
					lTris.push(
						ObjetTri.init((D) => {
							let lDuree;
							switch (lThis.param.optionsAffichage.modeAffichageHeureAbsence) {
								case ModeAffichageHeureAbsence.Total:
									lDuree = TUtilitaireDuree.dureeEnMs(
										D.absences.injustif + D.absences.justif,
									);
									break;
								case ModeAffichageHeureAbsence.TotalObligatoire:
									lDuree = TUtilitaireDuree.dureeEnMs(
										D.absences.injustifOblig + D.absences.justifOblig,
									);
									break;
								case ModeAffichageHeureAbsence.Injustifiees:
									lDuree = TUtilitaireDuree.dureeEnMs(D.absences.injustif);
									break;
								case ModeAffichageHeureAbsence.InjustifieesObligatoire:
									lDuree = TUtilitaireDuree.dureeEnMs(D.absences.injustifOblig);
									break;
								case ModeAffichageHeureAbsence.Justifiees:
									lDuree = TUtilitaireDuree.dureeEnMs(D.absences.justif);
									break;
								case ModeAffichageHeureAbsence.JustifieesObligatoire:
									lDuree = TUtilitaireDuree.dureeEnMs(D.absences.justifOblig);
									break;
							}
							return lDuree;
						}, aGenreTri),
					);
					break;
				case DonneesListe_PageNotes.colonnes.moyenne:
				case DonneesListe_PageNotes.colonnes.moyenneBrute:
				case DonneesListe_PageNotes.colonnes.moyennePeriode:
				case DonneesListe_PageNotes.colonnes.moyenneSousService:
				case DonneesListe_PageNotes.colonnes.moyenneGenreNotation:
				case DonneesListe_PageNotes.colonnes.moyenneAvRattrapageService:
					lTris = lTris.concat(
						TypeNote.getTrisDefaut(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							lGenreTriInverse,
						),
					);
					break;
				case DonneesListe_PageNotes.colonnes.bonusMalus:
					lTris.push(
						ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							lGenreTriInverse,
						),
					);
					break;
				case DonneesListe_PageNotes.colonnes.devoir:
					lTris.push(
						ObjetTri.init((D) => {
							const lEleve = D;
							const lDevoir = lThis.listeDevoirs.get(lCol.indice);
							const lEleveDansDevoir = lEleve.dansDevoir[lDevoir.getNumero()];
							const lEleveDevoir = lDevoir.listeEleves.getElementParNumero(
								D.getNumero(),
							);
							if (!lEleveDevoir || !lEleveDevoir.Note) {
								return -1000;
							}
							if (lEleveDansDevoir === EGenreEleveDansDevoir.Non) {
								return -1000;
							}
							if (lEleveDansDevoir === EGenreEleveDansDevoir.Jamais) {
								return -1001;
							}
							if (!lThis.devoirDansPeriode(lDevoir, lEleve)) {
								return -1000;
							}
							return 0;
						}, lGenreTriInverse),
					);
					lTris = lTris.concat(
						TypeNote.getTrisDefaut((D) => {
							return lThis.listeDevoirs
								.get(lCol.indice)
								.listeEleves.getElementParNumero(D.getNumero()).Note;
						}, lGenreTriInverse),
					);
					break;
				case DonneesListe_PageNotes.colonnes.moyNR:
					lTris.push(
						ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							lGenreTriInverse,
						),
					);
					break;
				default:
					break;
			}
		}
		lTris.push(ObjetTri.init("Position"));
		return lTris;
	}
	getListeLignesTotal() {
		const lListe = new ObjetListeElements().add(new ObjetElement("", 0));
		if (this.param.avecTotal) {
			lListe.add(new ObjetElement("", 1));
		}
		return lListe;
	}
	actualiserMoyennes() {
		_calculerMoyennes.call(this);
	}
	getContenuTotal(aParams) {
		let lDevoir, lDevoirRattrapage;
		if (aParams.article.getNumero() === 0) {
			switch (aParams.declarationColonne.genreColonne) {
				case this.genreColonne.Eleve:
					return this.getTraductionMoyenneClasse();
				case this.genreColonne.Moyenne:
					return this.moyGenerales[MoteurNotesCP.genreMoyenne.Moyenne];
				case this.genreColonne.MoyenneAvRattrapageService:
					return this.moyGenerales[
						MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService
					];
				case this.genreColonne.MoyenneBrute:
					return this.moyGenerales[MoteurNotesCP.genreMoyenne.MoyenneBrute];
				case this.genreColonne.MoyennePeriode:
					return this.moyGenerales[
						MoteurNotesCP.genreMoyenne.MoyennePeriode -
							aParams.declarationColonne.rangColonne
					];
				case this.genreColonne.MoyenneSousService:
					return this.moyGenerales[
						MoteurNotesCP.genreMoyenne.MoyenneSousService -
							aParams.declarationColonne.rangColonne
					];
				case this.genreColonne.MoyenneGenreNotation:
					return this.moyGenerales[
						MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
							aParams.declarationColonne.rangColonne
					];
				case this.genreColonne.Devoir:
					lDevoir = _getDevoir(aParams);
					lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
					return lDevoirRattrapage &&
						aParams.declarationColonne.estRattrapageDevoir
						? aParams.declarationColonne.estRattrapageMoyenne
							? lDevoirRattrapage.MoyenneGenreMoyenne
							: lDevoirRattrapage.Moyenne
						: lDevoir.Moyenne;
				case this.genreColonne.MoyNR:
					return this.moyGenerales[MoteurNotesCP.genreMoyenne.MoyenneNR];
				default:
					return "";
			}
		}
		if (aParams.article.getNumero() === 1) {
			if (_estColDevoir.call(this, aParams)) {
				lDevoir = _getDevoir(aParams);
				lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
				if (
					lDevoirRattrapage &&
					aParams.declarationColonne.estRattrapageDevoir &&
					!aParams.declarationColonne.estRattrapageMoyenne
				) {
					return (
						lDevoirRattrapage.listeEleves
							.getListeElements((aEle) => {
								return !aEle.Note.estUneNoteVide();
							})
							.count() +
						" / " +
						lDevoir.listeEleves
							.getListeElements((aEle) => {
								return (
									isNaN(aEle.Note.getValeur()) ||
									aEle.Note.getValeur() <
										lDevoirRattrapage.noteSeuil.getValeur()
								);
							})
							.count()
					);
				} else {
					return (
						lDevoir.listeEleves
							.getListeElements((aEle) => {
								return !aEle.Note.estUneNoteVide();
							})
							.count() +
						" / " +
						lDevoir.listeEleves.count()
					);
				}
			}
		}
		return "";
	}
	getClassTotal() {
		const T = [];
		T.push("AlignementDroit");
		return T.join(" ");
	}
	getStyleTotal(aParam) {
		if (aParam.article.getNumero() === 0) {
			return aParam.idColonne === DonneesListe_PageNotes.colonnes.eleves
				? GStyle.composeCouleurFond(GCouleur.fond) +
						GStyle.composeCouleurTexte(GCouleur.noir)
				: GStyle.composeCouleurFond(GCouleur.liste.total.fond) +
						GStyle.composeCouleurTexte(GCouleur.liste.total.texte);
		}
		if (aParam.article.getNumero() === 1) {
			return aParam.idColonne === DonneesListe_PageNotes.colonnes.eleves
				? GStyle.composeCouleurFond(GCouleur.fond) +
						GStyle.composeCouleurTexte(GCouleur.noir)
				: GStyle.composeCouleurFond(GCouleur.liste.moyenneAlternee2.fond) +
						GStyle.composeCouleurTexte(GCouleur.noir);
		}
	}
	avecBordureTotalVisible(aParams) {
		return aParams.idColonne !== DonneesListe_PageNotes.colonnes.eleves;
	}
	getColonneDeFusionTotal(aParams) {
		if (aParams.article.getNumero() === 0) {
			if (
				aParams.idColonne === DonneesListe_PageNotes.colonnes.classe ||
				aParams.idColonne === DonneesListe_PageNotes.colonnes.absences
			) {
				return DonneesListe_PageNotes.colonnes.eleves;
			}
		}
		if (aParams.article.getNumero() === 1) {
			if (
				aParams.idColonne === DonneesListe_PageNotes.colonnes.classe ||
				aParams.idColonne === DonneesListe_PageNotes.colonnes.absences ||
				aParams.idColonne === DonneesListe_PageNotes.colonnes.moyenne ||
				aParams.idColonne === DonneesListe_PageNotes.colonnes.moyenneBrute ||
				aParams.idColonne ===
					DonneesListe_PageNotes.colonnes.moyenneAvRattrapageService ||
				aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus ||
				aParams.declarationColonne.genreColonne ===
					this.genreColonne.MoyennePeriode ||
				aParams.declarationColonne.genreColonne ===
					this.genreColonne.MoyenneSousService ||
				aParams.declarationColonne.genreColonne ===
					this.genreColonne.MoyenneGenreNotation
			) {
				return DonneesListe_PageNotes.colonnes.eleves;
			}
		}
		return null;
	}
	getDureeAbsence(aAbsences, aModeAffichage) {
		let lDuree;
		switch (aModeAffichage) {
			case ModeAffichageHeureAbsence.Total:
				lDuree = TUtilitaireDuree.dureeEnMs(
					aAbsences.injustif + aAbsences.justif,
				);
				break;
			case ModeAffichageHeureAbsence.TotalObligatoire:
				lDuree = TUtilitaireDuree.dureeEnMs(
					aAbsences.injustifOblig + aAbsences.justifOblig,
				);
				break;
			case ModeAffichageHeureAbsence.Injustifiees:
				lDuree = TUtilitaireDuree.dureeEnMs(aAbsences.injustif);
				break;
			case ModeAffichageHeureAbsence.InjustifieesObligatoire:
				lDuree = TUtilitaireDuree.dureeEnMs(aAbsences.injustifOblig);
				break;
			case ModeAffichageHeureAbsence.Justifiees:
				lDuree = TUtilitaireDuree.dureeEnMs(aAbsences.justif);
				break;
			case ModeAffichageHeureAbsence.JustifieesObligatoire:
				lDuree = TUtilitaireDuree.dureeEnMs(aAbsences.justifOblig);
				break;
		}
		return lDuree;
	}
	composeAbsences(aAbsences, aModeAffichage) {
		let lDuree = this.getDureeAbsence(aAbsences, aModeAffichage);
		return lDuree > 0
			? GDate.formatDureeEnMillisecondes(lDuree, "%xh%sh%mm")
			: "";
	}
	composeNoteDevoir(aParam) {
		const lSurExportCSV = aParam.surExportCSV;
		const lEleveDevoir = _getEleveDevoir(aParam);
		const lEleve = aParam.article;
		const lDevoir = _getDevoir(aParam);
		const lEleveDansDevoir = lEleve.dansDevoir[lDevoir.getNumero()];
		const lNote = lEleveDevoir.Note;
		if (!lEleveDevoir || !lNote) {
			return lSurExportCSV ? "X" : null;
		}
		if (lEleveDansDevoir === EGenreEleveDansDevoir.Non) {
			return lSurExportCSV ? "X" : null;
		}
		if (lEleveDansDevoir === EGenreEleveDansDevoir.Jamais) {
			return lSurExportCSV ? "X" : null;
		}
		if (!this.devoirDansPeriode(lDevoir, lEleve)) {
			return lSurExportCSV ? "X" : null;
		}
		if (
			aParam.declarationColonne.genreColonne === this.genreColonne.Devoir &&
			this.moteurNotesCP.afficherCommeUnBonus({
				note: lNote,
				devoir: lDevoir,
				service: this.Service,
			}) &&
			!aParam.declarationColonne.estRattrapageDevoir
		) {
			return lNote;
		} else if (_estExecKiosque(lEleveDevoir)) {
			return lSurExportCSV || this.param.pourImpression
				? lNote
				: '<div ie-node="evntKiosque(' +
						lEleve +
						", " +
						lDevoir +
						')">' +
						lNote +
						"<div>";
		} else {
			const lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
			if (lDevoirRattrapage && aParam.declarationColonne.estRattrapageDevoir) {
				const lEleveDevoirRattrapage =
					lDevoirRattrapage.objetListeEleves &&
					lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
						? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
						: false;
				const lAvecSaisieRattrapage = _avecSasieRattrapage.call(this, {
					eleve: lEleve,
					eleveDevoir: lEleveDevoir,
					devoir: lDevoir,
					devoirRattrapage: lDevoirRattrapage,
				});
				const lNoteRattrapage =
					lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
						? lEleveDevoirRattrapage.Note
						: new TypeNote("");
				const lDevoirRattrapageMoy =
					lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
				if (
					lDevoirRattrapageMoy &&
					aParam.declarationColonne.estRattrapageMoyenne
				) {
					return this.moteurNotesCP.getMoyenneNotesRattrapage(
						lNote,
						lNoteRattrapage,
						lDevoirRattrapage.noteSeuil,
					);
				} else {
					return lAvecSaisieRattrapage ? lNoteRattrapage : new TypeNote("");
				}
			} else {
				return lNote;
			}
		}
	}
	getOptionsNote(aParams) {
		if (_estColDevoir.call(this, aParams)) {
			const lDevoir = _getDevoir(aParams);
			const lEleve = aParams.article;
			const lEleveDevoir = _getEleveDevoir(aParams);
			const lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
			const lEleveDevoirRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					: false;
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote("");
			const lDevoirRattrapageMoy =
				lDevoirRattrapage.genreRattrapage ===
				this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
			const lMoyenneRattrapage = lDevoirRattrapageMoy
				? this.moteurNotesCP.getMoyenneNotesRattrapage(
						lEleveDevoir.Note,
						lNoteRattrapage,
						lDevoirRattrapage.noteSeuil,
					)
				: new TypeNote("");
			const lNote = aParams.declarationColonne.estRattrapageDevoir
				? aParams.declarationColonne.estRattrapageMoyenne
					? lMoyenneRattrapage
					: lNoteRattrapage
				: lEleveDevoir.Note;
			return {
				avecParenthese: this.moteurNotesCP.afficherCommeUnBonus({
					note: lNote,
					devoir: lDevoir,
					service: this.Service,
				}),
				avecTiret:
					lDevoirRattrapage &&
					aParams.declarationColonne.estRattrapageDevoir &&
					!_avecSasieRattrapage.call(this, {
						eleve: aParams.article,
						eleveDevoir: lEleveDevoir,
						devoir: lDevoir,
						devoirRattrapage: lDevoirRattrapage,
					}) &&
					!(
						aParams.declarationColonne.estRattrapageMoyenne &&
						lDevoirRattrapage.genreRattrapage ===
							this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne)
					),
				avecVirgule: true,
				suffixe: this.getSuffixe(lEleveDevoir),
				sansNotePossible: true,
				afficherAvecVirgule: true,
				avecAnnotation: true,
				selectionSurFocus: true,
				min: 0,
				max: this.moteurNotesCP.getNoteMaximaleDeDevoir(lDevoir),
				texteSiVide: aParams.declarationColonne.estRattrapageDevoir
					? this.composeChaineElevePasDansDevoirRattrapage(
							lEleveDevoirRattrapage,
							lDevoirRattrapage.noteSeuil,
						)
					: this.composeChaineElevePasDansDevoir(lEleveDevoir),
			};
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus) {
			const lInvisible =
				_getBonusMalus.call(this, aParams.article).valeur === 0;
			const lPeriodeBonus = aParams.article.listePeriodes.getElementParNumero(
				this.periode.getNumero(),
			);
			return {
				suffixe: _estBonusMalusConformeAbsences(
					lPeriodeBonus.bonusMalus,
					lPeriodeBonus.malusAbsences,
				)
					? " *"
					: "",
				avecVirgule: true,
				afficherAvecVirgule: true,
				sansNotePossible: true,
				selectionSurFocus: true,
				avecSigneMoins: true,
				min: -1 * this.param.baremeParDefaut.getValeur(),
				max: this.param.baremeParDefaut.getValeur(),
				texteSiVide: lInvisible ? "" : "X",
			};
		}
	}
	composeEleveProjetAcc(D) {
		return D.getLibelle();
	}
	getTitrePeriodes() {
		return "";
	}
	getSuffixe(aEleveDevoir) {
		return;
	}
	avecLigneTitreBouton() {
		return this.avecCompetences;
	}
	getTitreBouton(aDevoir, aIndex, aStrIeNode) {
		return {
			libelleHtml:
				"<div " +
				aStrIeNode +
				' class="devoir competences AvecMain TitreListeSansTri">' +
				(aDevoir.evaluation
					? '<ie-btnimage ie-model="boutonCompetences(' +
						aIndex +
						')" class="Image_SaisieCompetenceDevoir InlineBlock" style="width:16px;"></ie-btnimage>'
					: "&nbsp;") +
				"</div>",
			controleur: {
				boutonCompetences: {
					event: (I) => {
						this.surCompetences(I);
						return false;
					},
					getTitle: (I) => {
						const H = [],
							lDevoir = this.listeDevoirs.get(I);
						if (lDevoir.evaluation && lDevoir.evaluation.listeCompetences) {
							lDevoir.evaluation.listeCompetences.parcourir((aCompetence) => {
								H.push(aCompetence.code + " : " + aCompetence.getLibelle());
							});
							return GChaine.enleverEntites(H.join("\n"));
						}
					},
				},
			},
		};
	}
	periodesPourCalculMoyennes() {
		return this.avecPeriodes;
	}
	getNbrPeriodes() {
		return (this.avecTrimestre ? 3 : 0) + (this.avecSemestre ? 2 : 0);
	}
	avecUtilisationAnnotationFelicitation() {
		return false;
	}
	createChaineAnnotationFelicitation() {
		return null;
	}
	estUneAnnotationAutorisee(aGenreAnnotation) {
		return TypeNote.estAnnotationPermise(aGenreAnnotation);
	}
	estPeriodeActuelleToutes() {
		return false;
	}
	getGenreRattrapage() {
		return "LesRattrapagesNExistePas";
	}
	genresPourCalculMoyennes() {
		return this.avecGenreNotation;
	}
	colonneBonusMalus() {
		return {
			id: DonneesListe_PageNotes.colonnes.bonusMalus,
			genreColonne: this.genreColonne.BonusMalus,
			titre: [
				{
					libelle: GTraductions.getValeur("Notes.Colonne.BonusMalus"),
					libelleHtml: GTraductions.getValeur("Notes.Colonne.Bonus"),
					title: GTraductions.getValeur("Notes.Colonne.BonusMalus"),
				},
			],
			taille: 60,
		};
	}
	getCouleurDeNoteDeDevoir() {
		return "inherit";
	}
	getCouleurDeNoteSousSeuil() {
		return "inherit";
	}
	getNoteMaxDevoir() {}
	composeChaineElevePasDansDevoir() {
		return "X";
	}
	composeChaineElevePasDansDevoirRattrapage() {
		return "X";
	}
	setActif(aActif, aActifBoutonCreerDevoir) {
		this.Actif = aActif;
		this.actifBoutonCreerDevoir = aActifBoutonCreerDevoir;
	}
	getOptionsAffichage() {
		return this.param.optionsAffichage;
	}
	setOptionsAffichage(aOptionsAffichage) {
		Object.assign(this.param.optionsAffichage, aOptionsAffichage);
	}
	surCompetences(I) {
		const lParamEvnt = {
			genreEvnt: EGenreEvenementSaisieNotes.Competences,
			devoir: this.listeDevoirs.get(I),
		};
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	surCreerDevoir() {
		const lParamEvnt = { genreEvnt: EGenreEvenementSaisieNotes.CreationDevoir };
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	surEditionDevoir(I) {
		const lParamEvnt = {
			genreEvnt: EGenreEvenementSaisieNotes.EditionDevoir,
			devoir: this.listeDevoirs.get(I),
		};
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	evenementMenuContextuel(aParametres) {
		if (aParametres.numeroMenu === 1) {
			const lParamEvnt = {
				genreEvnt: EGenreCommandeMenu.Suppression,
				eleve: aParametres.article,
			};
			this.enEdition = false;
			this.param.callbackEvnt(lParamEvnt);
		}
	}
	surImporter(aParametres) {
		const lParamEvnt = {
			genreEvnt: EGenreEvenementSaisieNotes.Import,
			file: aParametres,
		};
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	surEvntMethodeCalculMoyenne(D, aNumero, aGenreMoyenne, aIndicePeriode) {
		const lEleve = this.Donnees.getElementParNumero(D.Numero);
		let lService = null;
		if (aGenreMoyenne === this.genreMoyenne.GM_MoyenneSousService) {
			lService = this.Service.listeServices.getElementParNumero(aNumero);
		}
		let lGenreNotation = null;
		if (aGenreMoyenne === this.genreMoyenne.GM_MoyenneGenreNotation) {
			lGenreNotation =
				this.Service.listeGenreNotation.getElementParNumero(aNumero);
		}
		const lParamEvnt = {
			genreEvnt: EGenreEvenementNotesEtAppreciations.MethodeCalculMoyenne,
			eleve: lEleve,
			estMoyenneNette: aGenreMoyenne !== this.genreMoyenne.GM_MoyenneBrute,
			periode: this.titrePeriodes[aIndicePeriode],
			service: lService,
			genreNotation: lGenreNotation,
		};
		if (this.param.avecColonneClasse) {
			const v1 = { classe: lEleve.classe };
			$.extend(lParamEvnt, v1);
		}
		this.param.callbackEvnt(lParamEvnt);
	}
	surEvntKiosque(aEleve, aDevoir) {
		const lEleveDevoir = aDevoir.objetListeEleves[aEleve.getNumero()];
		if (!!lEleveDevoir && !!lEleveDevoir.execKiosque) {
			window.open(GChaine.creerUrlBruteLienExterne(lEleveDevoir.execKiosque));
		}
	}
	surSelectionLigne(J, D) {
		const lParamEvnt = {
			genreEvnt: EGenreEvenementNotesEtAppreciations.SelectionLigne,
			eleve: D,
		};
		this.param.callbackEvnt(lParamEvnt);
	}
	surSelection(I, D) {
		if (I !== -1) {
			const lCol = _getColById(this.getId(I));
			if (lCol.id === DonneesListe_PageNotes.colonnes.devoir) {
				const lDevoir = this.listeDevoirs.get(lCol.indice);
				const lEleve = D;
				if (
					!this.moteurNotesCP.estNoteEditable({
						actif: this.Service.getActif(),
						devoir: lDevoir,
						eleve: lEleve,
						eleveDevoir: lDevoir.listeEleves.getElementParNumero(D.getNumero()),
						devoirDansPeriode: this.devoirDansPeriode.bind(this),
					})
				) {
					const lMessage = this.moteurNotesCP.getMsgNoteNonEditable({
						devoir: lDevoir,
						eleve: lEleve,
						eleveDevoir: lDevoir.listeEleves.getElementParNumero(D.getNumero()),
						devoirDansPeriode: this.devoirDansPeriode.bind(this),
					});
					if (lMessage) {
						GApplication.getMessage().afficher({
							type: EGenreBoiteMessage.Information,
							message: lMessage,
						});
					}
				}
			}
		}
	}
	surEdition(aParams, V) {
		const lDevoir = this.listeDevoirs.get(
			aParams.declarationColonne.rangColonne,
		);
		const lGenreColonne = aParams.declarationColonne.genreColonne;
		const lEstRattrapage = aParams.declarationColonne.estRattrapageDevoir;
		this.Note = this.getNote(
			aParams.article,
			lDevoir,
			lGenreColonne,
			lEstRattrapage,
		);
		return this.surDeselection(
			aParams.declarationColonne.rangColonne,
			lEstRattrapage,
			lDevoir,
			lGenreColonne,
			aParams.ligne,
			aParams.article,
			V,
		);
	}
	surDeselection(
		ANumColonne,
		aEstRattrapage,
		aDevoir,
		aGenreColonne,
		aNumLigne,
		aEleve,
		aNote,
	) {
		if (this.avecSaisieSuperieurAuBareme() && !!aDevoir) {
			if (aNote.estUneNoteValide(new TypeNote(0), aDevoir.bareme, true, true)) {
				this.surDeselectionApresConfirmation(
					ANumColonne,
					aEstRattrapage,
					aDevoir,
					aGenreColonne,
					aNumLigne,
					aEleve,
					aNote,
				);
			} else {
				return this.moteurNotesCP
					.afficherConfirmationSaisieNoteAuDessusBareme(aNote, aDevoir.bareme)
					.then((aValider) => {
						if (aValider) {
							this.surDeselectionApresConfirmation(
								ANumColonne,
								aEstRattrapage,
								aDevoir,
								aGenreColonne,
								aNumLigne,
								aEleve,
								aNote,
							);
						} else {
							return { annulerEdition: true, enEditionSurCelllule: true };
						}
					});
			}
		} else {
			this.surDeselectionApresConfirmation(
				ANumColonne,
				aEstRattrapage,
				aDevoir,
				aGenreColonne,
				aNumLigne,
				aEleve,
				aNote,
			);
		}
	}
	surDeselectionApresConfirmation(
		ANumColonne,
		aEstRattrapage,
		aDevoir,
		aGenreColonne,
		aNumLigne,
		aEleve,
		aNote,
	) {
		let lNote = this.surVerificationNote(
			aNumLigne,
			aGenreColonne,
			aDevoir,
			aNote,
		);
		this.enEdition = false;
		if (lNote.estUneAnnotation()) {
			const lBaremeDevoir =
				!!aDevoir && aDevoir.bareme.estUneValeur()
					? aDevoir.bareme.getValeur()
					: null;
			if (!!lBaremeDevoir) {
				lNote.bareme = lBaremeDevoir;
			}
			lNote = new TypeNote(lNote.toStr());
		}
		this.setNote(aEleve, aDevoir, aGenreColonne, lNote, aEstRattrapage);
		if (this.avecSousServices) {
			for (
				let I = 0, lNbr = this.Service.listeServices.count();
				I < lNbr;
				I++
			) {
				this.moteurNotesCP.rechercherNotePlusHauteEtPlusBasse({
					listeEleves: this.Donnees,
					listeElevesSelection: new ObjetListeElements().add(aEleve),
					service: this.Service,
					numeroService: this.Service.listeServices.getNumero(I),
					avecGenreNotation: this.avecGenreNotation,
					affichageAnciensEleves: this.affichageAnciensEleves,
					periode: this.periode,
					listeDevoirs: this.listeDevoirs,
					devoirDansPeriode: this.devoirDansPeriode.bind(this),
					eleveDansDevoir: this.eleveDansDevoir.bind(this),
					baremeParDefaut: this.param.baremeParDefaut,
				});
			}
		} else {
			this.moteurNotesCP.rechercherNotePlusHauteEtPlusBasse({
				listeEleves: this.Donnees,
				listeElevesSelection: null,
				service: this.Service,
				numeroService: 0,
				avecGenreNotation: this.avecGenreNotation,
				affichageAnciensEleves: this.affichageAnciensEleves,
				periode: this.periode,
				listeDevoirs: this.listeDevoirs,
				devoirDansPeriode: this.devoirDansPeriode.bind(this),
				eleveDansDevoir: this.eleveDansDevoir.bind(this),
				baremeParDefaut: this.param.baremeParDefaut,
			});
		}
		_calculerMoyennes.call(this, aNumLigne, ANumColonne);
		if (this.Note && lNote.getNote() === this.Note.getNote()) {
			return;
		}
		this.param.callbackEvnt({
			genreEvnt: EGenreEvenementSaisieNotes.SurDeselection,
			devoir: aDevoir,
			eleve: aEleve,
			note: ANumColonne >= 0 ? lNote : null,
			bonusMalus: ANumColonne >= 0 ? null : lNote,
			avecActualisation: false,
			ligneSuivante: true,
		});
	}
	controlerElevesDansDevoirEtPeriode() {
		let lDevoir;
		for (let I = 0; I < this.NbrEleves; I++) {
			const lEleve = this.Donnees.get(I);
			lEleve.dansDevoir = [];
			for (let J = 0; J < this.NbrDevoirs; J++) {
				lDevoir = this.listeDevoirs.get(J);
				lEleve.dansDevoir[lDevoir.getNumero()] = this.eleveDansDevoir(
					lEleve,
					lDevoir,
				);
			}
		}
		this.avecTrimestre = false;
		this.avecSemestre = false;
		for (let J = 0; J < this.NbrDevoirs; J++) {
			lDevoir = this.listeDevoirs.get(J);
			lDevoir.dansPeriode = [];
			lDevoir.dansPeriode[0] = [true];
			for (let K = 0, lNbr = lDevoir.listeClasses.count(); K < lNbr; K++) {
				const lClasseDevoir = lDevoir.listeClasses.get(K);
				if (lClasseDevoir) {
					lDevoir.dansPeriode[lClasseDevoir.getNumero()] = [true];
					for (
						let L = 0, lNbr2 = lClasseDevoir.listePeriodes.count();
						L < lNbr2;
						L++
					) {
						const lPeriodeDevoir = lClasseDevoir.listePeriodes.get(L);
						lDevoir.dansPeriode[0][lPeriodeDevoir.getNumero()] = true;
						lDevoir.dansPeriode[lClasseDevoir.getNumero()][
							lPeriodeDevoir.getNumero()
						] = true;
						if (
							GParametres.estPeriodeTrimestrielle(lPeriodeDevoir.getNumero())
						) {
							this.avecTrimestre = true;
						}
						if (
							GParametres.estPeriodeSemestrielle(lPeriodeDevoir.getNumero())
						) {
							this.avecSemestre = true;
						}
					}
				}
			}
			const lNbEleves = lDevoir.listeEleves.count();
			lDevoir.objetListeEleves = {};
			let lEleveDevoir;
			for (let L = 0; L < lNbEleves; L++) {
				lEleveDevoir = lDevoir.listeEleves.get(L);
				lDevoir.objetListeEleves[lEleveDevoir.getNumero()] = lEleveDevoir;
			}
			if (lDevoir.devoirRattrapage) {
				const lNbElevesRattrapage =
					lDevoir.devoirRattrapage.listeEleves.count();
				lDevoir.devoirRattrapage.objetListeEleves = {};
				for (let L = 0; L < lNbElevesRattrapage; L++) {
					lEleveDevoir = lDevoir.devoirRattrapage.listeEleves.get(L);
					lDevoir.devoirRattrapage.objetListeEleves[lEleveDevoir.getNumero()] =
						lEleveDevoir;
				}
			}
		}
	}
	getNote(aEleve, aDevoir, aGenreColonne, aRattrap) {
		if (aGenreColonne === this.genreColonne.Devoir) {
			const lEleveDevoir = aDevoir.objetListeEleves[aEleve.getNumero()];
			if (!aRattrap) {
				return lEleveDevoir
					? lEleveDevoir.Note === null || lEleveDevoir.Note === undefined
						? ""
						: lEleveDevoir.Note
					: "X";
			} else if (
				aDevoir.devoirRattrapage &&
				aDevoir.devoirRattrapage.existe() &&
				aDevoir.devoirRattrapage.existeNumero()
			) {
				const lEleveDevoirRattrapage =
					aDevoir.devoirRattrapage &&
					aDevoir.devoirRattrapage.objetListeEleves &&
					aDevoir.devoirRattrapage.objetListeEleves[aEleve.getNumero()]
						? aDevoir.devoirRattrapage.objetListeEleves[aEleve.getNumero()]
						: false;
				return lEleveDevoirRattrapage
					? lEleveDevoirRattrapage.Note === null ||
						lEleveDevoirRattrapage.Note === undefined
						? ""
						: lEleveDevoirRattrapage.Note
					: "X";
			} else {
				return "";
			}
		} else if (aGenreColonne === this.genreColonne.BonusMalus) {
			const lPeriodeBonus = aEleve.listePeriodes
				? aEleve.listePeriodes.getElementParNumero(this.periode.getNumero())
				: null;
			const lBonus = lPeriodeBonus ? lPeriodeBonus.bonusMalus : "";
			return lBonus;
		} else {
			return null;
		}
	}
	setNote(aEleve, aDevoir, aGenreColonne, aNote, aRattrap) {
		if (aGenreColonne === this.genreColonne.Devoir) {
			const lEleveDevoir = aDevoir.objetListeEleves[aEleve.getNumero()];
			if (!aRattrap) {
				if (
					lEleveDevoir &&
					(!lEleveDevoir.Note ||
						lEleveDevoir.Note.getNote() !== aNote.getNote())
				) {
					lEleveDevoir.setEtat(
						lEleveDevoir.Note ? EGenreEtat.Modification : EGenreEtat.Creation,
					);
					lEleveDevoir.Note = aNote;
					const lDevoirRattrapage = _getDevoirRattrapage(aDevoir);
					if (
						lDevoirRattrapage &&
						!_avecSasieRattrapage.call(this, {
							eleve: aEleve,
							eleveDevoir: lEleveDevoir,
							devoir: aDevoir,
							devoirRattrapage: lDevoirRattrapage,
						})
					) {
						if (lDevoirRattrapage.listeEleves) {
							let lEleveDevoirRattrapage =
								lDevoirRattrapage.objetListeEleves[aEleve.getNumero()];
							if (lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note) {
								lEleveDevoirRattrapage.Note = new TypeNote("");
								lDevoirRattrapage.setEtat(EGenreEtat.Modification);
								this._ajouteDevoirRattrapagePourSaisie(
									aDevoir,
									lDevoirRattrapage,
								);
							}
						}
					}
				}
			} else {
				const lDevoirRattrapage = aDevoir.devoirRattrapage;
				if (!lDevoirRattrapage.listeEleves) {
					lDevoirRattrapage.listeEleves = new ObjetListeElements();
					lDevoirRattrapage.objetListeEleves = {};
				}
				let lEleveDevoirRattrap =
					lDevoirRattrapage &&
					lDevoirRattrapage.objetListeEleves &&
					lDevoirRattrapage.objetListeEleves[aEleve.getNumero()]
						? lDevoirRattrapage.objetListeEleves[aEleve.getNumero()]
						: false;
				if (!lEleveDevoirRattrap) {
					lEleveDevoirRattrap = new ObjetElement(
						aEleve.getLibelle(),
						aEleve.getNumero(),
					);
					lDevoirRattrapage.listeEleves.addElement(lEleveDevoirRattrap);
					lDevoirRattrapage.objetListeEleves[aEleve.getNumero()] =
						lEleveDevoirRattrap;
				}
				if (
					!lEleveDevoirRattrap.Note ||
					lEleveDevoirRattrap.Note.getNote() !== aNote.getNote()
				) {
					lEleveDevoirRattrap.setEtat(
						lEleveDevoirRattrap.Note
							? EGenreEtat.Modification
							: EGenreEtat.Creation,
					);
					lEleveDevoirRattrap.Note = aNote;
				}
				lDevoirRattrapage.setEtat(EGenreEtat.Modification);
				this._ajouteDevoirRattrapagePourSaisie(aDevoir, lDevoirRattrapage);
			}
		} else if (aGenreColonne === this.genreColonne.BonusMalus) {
			if (
				aEleve.listePeriodes
					.getElementParNumero(this.periode.getNumero())
					.bonusMalus.getNote() !== aNote.getNote()
			) {
				aEleve.setEtat(EGenreEtat.Modification);
				aEleve.listePeriodes.getElementParNumero(
					this.periode.getNumero(),
				).bonusMalus = aNote;
			}
		}
	}
	_ajouteDevoirRattrapagePourSaisie(aDevoir, aDevoirRattrapage) {
		if (aDevoir && aDevoirRattrapage) {
			if (!aDevoir.listeDevoirsRattrapage) {
				aDevoir.listeDevoirsRattrapage = new ObjetListeElements();
			}
			const lIndiceDevoirDansListe =
				aDevoir.listeDevoirsRattrapage.getIndiceParNumeroEtGenre(
					aDevoirRattrapage.getNumero(),
				);
			if (lIndiceDevoirDansListe !== undefined) {
				aDevoir.listeDevoirsRattrapage.remove(lIndiceDevoirDansListe);
			}
			const lDevoirRattrapagePourListe =
				MethodesObjet.dupliquer(aDevoirRattrapage);
			aDevoir.listeDevoirsRattrapage.addElement(lDevoirRattrapagePourListe);
		}
	}
	avecSaisieSuperieurAuBareme() {
		return false;
	}
	surVerificationNote(aNumLigne, aGenreColonne, aDevoir, aNote) {
		let lValueNote = GChaine.ajouterEntites(aNote.chaine);
		if (
			this.avecUtilisationAnnotationFelicitation() &&
			lValueNote.search(/^[0-9]*((,|\.)[0-9]+)?\+$/) === 0
		) {
			let lCaractereSplit = ",";
			if (lValueNote.indexOf(".") > -1) {
				lCaractereSplit = ".";
			}
			const lBaremeNotation = lValueNote.split(lCaractereSplit)[0];
			lValueNote = this.createChaineAnnotationFelicitation(lBaremeNotation);
		} else if (lValueNote.search(/^[0-9]*(,|\.)[0-9]+/) === 0) {
			const lRegExp = new RegExp(
				"^([0-9]*(,|\\.)[0-9]{" + TypeNote.decimalNotation + "}).*$",
			);
			lValueNote = lValueNote.replace(lRegExp, "$1");
		}
		let lNote = new TypeNote(lValueNote);
		let lNoteMin, lNoteMax;
		if (aGenreColonne === this.genreColonne.BonusMalus) {
			lNoteMin = new TypeNote(-1 * this.param.baremeParDefaut.getValeur());
			lNoteMax = new TypeNote(this.param.baremeParDefaut.getValeur());
		} else {
			lNoteMin = new TypeNote(0.0);
			lNoteMax = this.getNoteMaxDevoir(aDevoir);
		}
		if (
			(!lNote.estUneNoteValide(
				lNoteMin,
				lNoteMax,
				aGenreColonne !== this.genreColonne.BonusMalus,
				true,
			) &&
				GChaine.ajouterEntites(lNote.chaine) !== "-") ||
			(lNote.estUneAnnotation() &&
				!this.estUneAnnotationAutorisee(lNote.getGenre()))
		) {
			if (!this.Note.estUneNoteValide(lNoteMin, lNoteMax, true, true)) {
				lNote = new TypeNote("");
			} else {
				lNote = this.Note;
			}
		}
		return lNote;
	}
	getTailleColonneDevoir() {
		return 56;
	}
	_getContexteColonnes(aListeEleves, aPourImpression) {
		const lNbrEtudiants = aListeEleves.count();
		const lColonnes = [];
		let lTitres = [];
		lTitres.push({
			libelleHtml: !aPourImpression
				? '<div class="NoWrap AlignementGauche TitreListeSansTri"><span class="EspaceGauche">' +
					'<ie-bouton id="' +
					this.idBtnCreerDevoir +
					'" ie-model="boutonCreerDevoir" class="small-bt ' +
					TypeThemeBouton.primaire +
					'">' +
					GTraductions.getValeur("Notes.CreerDevoir") +
					"</ie-bouton></span>" +
					(this.param.avecImport
						? '<span class="GrandEspaceGauche"><ie-bouton ie-model="boutonImport" ie-selecfile ' +
							'class="' +
							TypeThemeBouton.primaire +
							'">' +
							GTraductions.getValeur("progression.importer") +
							"</ie-bouton></span>"
						: "") +
					"</div>"
				: "&nbsp;",
		});
		lTitres.push({ libelle: this.moteurNotesCP.strTitreEleves(lNbrEtudiants) });
		lColonnes.push({
			id: DonneesListe_PageNotes.colonnes.eleves,
			genreColonne: this.genreColonne.Eleve,
			titre: lTitres,
			taille: 170,
		});
		lColonnes.push({
			id: DonneesListe_PageNotes.colonnes.classe,
			genreColonne: this.genreColonne.Classe,
			titre: [
				TypeFusionTitreListe.FusionGauche,
				{ libelle: GTraductions.getValeur("Notes.Colonne.Promotion") },
			],
			taille: 65,
		});
		if (this.avecColonneTDOption && this.avecColonneClasse) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.TDOption,
				genreColonne: this.genreColonne.TDOption,
				titre: [
					TypeFusionTitreListe.FusionGauche,
					{ libelle: GTraductions.getValeur("Notes.Colonne.TDOption") },
				],
				taille: 70,
			});
		}
		if (
			!!this.param.optionsAffichage &&
			!!this.param.optionsAffichage.modeAffichageHeureAbsence > 0 &&
			!this.avecPeriodes &&
			this.periode.getNumero() !== 0
		) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.absences,
				genreColonne: this.genreColonne.Absences,
				titre: [
					TypeFusionTitreListe.FusionGauche,
					{ libelle: GTraductions.getValeur("Notes.Colonne.Absences") },
				],
				taille: 60,
			});
		}
		lColonnes.push({
			id: DonneesListe_PageNotes.colonnes.moyenne,
			genreColonne: this.genreColonne.Moyenne,
			titre: [
				TypeFusionTitreListe.FusionGauche,
				{
					libelle: GTraductions.getValeur("Notes.Colonne.Moyenne"),
					libelleHtml: GTraductions.getValeur("Notes.Colonne.Moyenne"),
					title: GTraductions.getValeur("Notes.Colonne.TitreMoyenne"),
				},
			],
			taille: 61,
		});
		if (this.param.avecColNR) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.moyNR,
				genreColonne: this.genreColonne.MoyNR,
				titre: [
					TypeFusionTitreListe.FusionGauche,
					{
						libelle: GTraductions.getValeur("Notes.Colonne.TitreMoyNR"),
						libelleHtml: GTraductions.getValeur("Notes.Colonne.TitreMoyNR"),
						title: GTraductions.getValeur("Notes.Colonne.HintMoyNR"),
					},
				],
				taille: 61,
			});
		}
		if (
			this.avecRattrapageService &&
			!this.avecSousServices &&
			!this.periodesPourCalculMoyennes()
		) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.moyenneAvRattrapageService,
				genreColonne: this.genreColonne.MoyenneAvRattrapageService,
				titre: [
					TypeFusionTitreListe.FusionGauche,
					{
						libelle: GTraductions.getValeur(
							"Notes.Colonne.MoyAvRattrapageService",
						),
						libelleHtml: GTraductions.getValeur(
							"Notes.Colonne.MoyAvRattrapageService",
						),
						title: GTraductions.getValeur(
							"Notes.Colonne.TitreMoyAvRattrapageService",
						),
					},
				],
				taille: 61,
			});
		}
		lColonnes.push({
			id: DonneesListe_PageNotes.colonnes.moyenneBrute,
			genreColonne: this.genreColonne.MoyenneBrute,
			titre: [
				TypeFusionTitreListe.FusionGauche,
				{
					libelle: GTraductions.getValeur("Notes.Colonne.MoyenneBrute"),
					libelleHtml: GTraductions.getValeur("Notes.Colonne.MoyenneBrute"),
					title: GTraductions.getValeur("Notes.Colonne.TitreMoyenneBrute"),
				},
			],
			taille: 61,
		});
		for (let i = 0, lNbr = this.nbrPeriodesAffichage; i < lNbr; i++) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.moyennePeriode + "_" + i,
				genreColonne: this.genreColonne.MoyennePeriode,
				rangColonne: i,
				numeroPeriode: this.titrePeriodes[i].getNumero(),
				titre: [
					{
						libelle: this.titrePeriodes[i].abbr
							? this.titrePeriodes[i].abbr
							: this.titrePeriodes[i].getLibelle(),
						libelleHtml:
							'<div class="Maigre" ><div class="InlineBlock AlignementMilieuVertical" style="width: 6px; height: 12px;' +
							GStyle.composeCouleurFond(
								this.couleurPeriodes[i + 1]
									? this.couleurPeriodes[i + 1]
									: GCouleur.periodesClair
										? GCouleur.periodesClair[i + 1]
										: "transparent",
							) +
							GStyle.composeCouleurBordure(GCouleur.blanc, 1) +
							'">&nbsp;</div><span class="EspaceGauche">' +
							(this.titrePeriodes[i].abbr
								? this.titrePeriodes[i].abbr
								: this.titrePeriodes[i].getLibelle()) +
							"</span></div>",
						couleurTexte: "black",
						title: this.titrePeriodes[i].abbr
							? this.titrePeriodes[i].getLibelle()
							: "",
					},
					{
						libelle: this.titrePeriodes[i].coefficient,
						title: this.titrePeriodes[i].coefficient,
					},
				],
				taille: 61,
			});
		}
		if (this.NbrDevoirs) {
			let lService, lListeProfesseurs, lListeGenreNotation, lGenre;
			if (this.avecSousServices) {
				for (
					let i = 0, lNbr = this.Service.listeServices.count();
					i < lNbr;
					i++
				) {
					lService = this.Service.listeServices.get(i);
					lListeProfesseurs = [];
					if (lService.listeProfesseurs) {
						for (
							let j = 0, lNbr2 = lService.listeProfesseurs.count();
							j < lNbr2;
							j++
						) {
							lListeProfesseurs.push(
								lService.listeProfesseurs.get(j).getLibelle(),
							);
						}
					}
					lTitres = [
						{
							libelle: GTraductions.getValeur("PageNotes.MoyenneAbr"),
							libelleHtml:
								'<div class="Maigre">' +
								GTraductions.getValeur("PageNotes.MoyenneAbr") +
								"</div>",
							couleurTexte: "black",
						},
					];
					if (this.avecLigneTitreBouton() && !aPourImpression) {
						lTitres.push({ libelleHtml: "<div>&nbsp;</div>" });
					}
					lTitres.push({
						libelle: this.afficherNomProfesseur
							? lListeProfesseurs.join(", ")
							: lService.matiere.getLibelle(),
						libelleHtml:
							'<div class="devoir service ' +
							(!aPourImpression ? "pas-impression " : "") +
							'">' +
							'<div class="Maigre NoWrap" style="border:' +
							(lService.matiere.couleur
								? lService.matiere.couleur
								: "transparent") +
							' 0.2rem solid;">' +
							(this.afficherNomProfesseur
								? lListeProfesseurs.join(", ")
								: lService.matiere.getLibelle()) +
							"</div></div>",
						couleurTexte: "black",
						title: this.afficherNomProfesseur
							? lListeProfesseurs.join(", ")
							: lService.matiere.getLibelle(),
					});
					if (lService.periode) {
						lTitres.push({
							libelle: lService.periode.coefficient.getCoefficientEntier(),
							libelleHtml: lService.periode.coefficient.getCoefficientEntier(),
							title: lService.periode.coefficient.getCoefficientEntier(),
						});
					}
					lColonnes.push({
						id: DonneesListe_PageNotes.colonnes.moyenneSousService + "_" + i,
						genreColonne: this.genreColonne.MoyenneSousService,
						rangColonne: i,
						numeroService: lService.getNumero(),
						libelleService: lService.getLibelle(),
						titre: lTitres,
						taille: 60,
					});
				}
			} else if (this.avecGenreNotation) {
				lListeGenreNotation =
					this.Service.listeGenreNotation ||
					this.Service.pere.listeGenreNotation;
				for (let i = 0, lNbr = lListeGenreNotation.count(); i < lNbr; i++) {
					lGenre = lListeGenreNotation.get(i);
					lColonnes.push({
						id: DonneesListe_PageNotes.colonnes.moyenneGenreNotation + "_" + i,
						genreColonne: this.genreColonne.MoyenneGenreNotation,
						rangColonne: i,
						numeroNotation: lGenre.getNumero(),
						libelleNotation: lGenre.getLibelle(),
						titre: [
							{
								libelle: lGenre.getLibelle(),
								libelleHtml:
									'<div class="Maigre"><div class="InlineBlock AlignementMilieuVertical" style="width: 6px; height: 12px;' +
									GStyle.composeCouleurFond(lGenre.couleur) +
									GStyle.composeCouleurBordure(GCouleur.blanc, 1) +
									'">&nbsp;</div>' +
									'<span class="EspaceGauche">' +
									lGenre.abbr +
									"</span>" +
									"</div>",
								couleurTexte: "black",
								title: lGenre.getLibelle(),
							},
							{
								libelle: lGenre.coeff.getCoefficientEntier(),
								title: lGenre.coeff.getCoefficientEntier(),
							},
						],
						taille: 61,
					});
				}
			}
			lColonnes.push(this.colonneBonusMalus());
		}
		for (let i = 0, lNbr = this.listeDevoirs.count(); i < lNbr; i++) {
			let lDevoir = this.listeDevoirs.get(i);
			let lSurEditionDevoir = aPourImpression
				? ""
				: 'ie-node="getEditionDevoir(' + i + ')" role="button" tabindex="0"';
			const lCategorieDevoir = !!lDevoir.categorie
				? lDevoir.categorie.getLibelle()
				: "";
			let lHint =
				lDevoir.service.matiere.getLibelle() +
				" \n" +
				GDate.formatDate(lDevoir.date, "%JJ/%MM/%AAAA") +
				(lDevoir.commentaire ? " - " + lDevoir.commentaire : "") +
				"\n" +
				lCategorieDevoir +
				"\n" +
				GTraductions.getValeur("FenetreDevoir.Bareme") +
				" " +
				lDevoir.bareme.toString() +
				"\n" +
				GTraductions.getValeur("FenetreDevoir.Coefficient") +
				" " +
				lDevoir.coefficient.toString() +
				(lDevoir.executionQCM && lDevoir.executionQCM.existeNumero()
					? "\n" + GTraductions.getValeur("QCM_Divers.HintDevoirLieQCM")
					: "") +
				(lDevoir.execKiosque && lDevoir.execKiosque.existeNumero()
					? "\n" + GTraductions.getValeur("QCM_Divers.HintDevoirLieKiosque")
					: "");
			let lCouleurFacultatif = "transparent";
			if (lDevoir.commeUnBonus) {
				lCouleurFacultatif = GCouleur.devoir.commeUnBonus;
			} else if (lDevoir.commeUneNote) {
				lCouleurFacultatif = GCouleur.devoir.commeUneNote;
			} else if (lDevoir.commeUnSeuil) {
				lCouleurFacultatif = GCouleur.devoir.commeUnSeuil;
			}
			let lListeProfesseurs = [];
			if (lDevoir.service.listeProfesseurs) {
				for (
					let j = 0, lNbr2 = lDevoir.service.listeProfesseurs.count();
					j < lNbr2;
					j++
				) {
					lListeProfesseurs.push(
						lDevoir.service.listeProfesseurs.get(j).getLibelle(),
					);
				}
			}
			let lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
			let lServiceRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_RattrapageService);
			let lDevoirRattrapageMoy =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
			let lIconeDevoir =
				lDevoir.executionQCM && lDevoir.executionQCM.existeNumero()
					? '<i class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>'
					: lDevoir.execKiosque && lDevoir.execKiosque.existeNumero()
						? '<div class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></div>'
						: "";
			const lCouleurCategorie = !!lDevoir.categorie
				? '<div class="categorie-devoir" style="background-color:' +
					lDevoir.categorie.couleur +
					';"></div>'
				: "";
			const lAcronymDS = lDevoir.estDevoirSurveille
				? GTraductions.getValeur("DernieresNotes.DevoirSurveilleAbr")
				: "";
			const lGetFormatAffichageDate = function (aDate) {
				return GDate.dateEntreLesDates(
					aDate,
					GDate.premiereDate,
					GDate.derniereDate,
				)
					? "%JJ/%MM"
					: "%JJ/%MM/%AAAA";
			};
			const lDateDevoir = GDate.formatDate(
				lDevoir.date,
				lGetFormatAffichageDate(lDevoir.date),
			);
			const lDateDevoirRattrapage = lDevoirRattrapage
				? GDate.formatDate(
						lDevoirRattrapage.date,
						lGetFormatAffichageDate(lDevoirRattrapage.date),
					)
				: "";
			lTitres = [
				{
					libelle: !lServiceRattrapage ? lDateDevoir : "",
					libelleHtml:
						"<div " +
						(lSurEditionDevoir
							? `${lSurEditionDevoir} aria-label="${lHint}"`
							: "") +
						' class="devoir nom-devoir ' +
						(!aPourImpression ? "pas-impression " : "") +
						'Maigre InlineBlock AlignementMilieuVertical AvecMain TitreListeSansTri" ' +
						'style="border-top:' +
						lCouleurFacultatif +
						' 0.33rem solid;">' +
						lCouleurCategorie +
						(!lServiceRattrapage ? lDateDevoir : "") +
						(lDevoir.verrouille && !aPourImpression
							? '<i class="icon_lock"></i>'
							: "") +
						(lDevoirRattrapage
							? ' <div class="InlineBlock AlignementMilieuVertical EspaceGauche EspaceDroit">' +
								GImage.composeImage("Image_DevoirRefait", 16, aPourImpression) +
								"</div> " +
								lDateDevoirRattrapage
							: "") +
						(lDevoirRattrapageMoy
							? ' <span class="InlineBlock AlignementMilieuVertical" style="text-align:right;width:58px;">' +
								GTraductions.getValeur("PageNotes.MoyenneAbr") +
								"</span>"
							: "") +
						(lDevoir.estDevoirSurveille
							? '<div style="' +
								(!aPourImpression
									? "position:absolute;top:0;right:0;margin-left: .5rem;"
									: "") +
								'" class="pseudo-icone-ds tiny" ie-hint="' +
								GTraductions.getValeur("DernieresNotes.DevoirSurveille") +
								'" data-ico="' +
								lAcronymDS +
								'">' +
								"</div>"
							: "") +
						"</div>",
					couleurTexte: "black",
				},
			];
			if (this.avecLigneTitreBouton() && !aPourImpression) {
				lTitres.push(this.getTitreBouton(lDevoir, i, lSurEditionDevoir));
			}
			if (lDevoir.service.getNumero() !== this.Service.getNumero()) {
				lTitres.push({
					libelle: lDevoir.service.matiere.getLibelle(),
					libelleHtml:
						"<div " +
						lSurEditionDevoir +
						' class="devoir service ' +
						(!aPourImpression ? "pas-impression " : "") +
						'AvecMain TitreListeSansTri">' +
						'<div class="Maigre NoWrap" style="border:' +
						(lDevoir.service.matiere.couleur
							? lDevoir.service.matiere.couleur
							: "transparent") +
						' 0.2rem solid;">' +
						lDevoir.service.matiere.getLibelle() +
						"</div></div>",
					couleurTexte: "black",
				});
			}
			if (this.avecPeriodes) {
				let lCouleurFond;
				for (let j = 0; j < this.nbrPeriodesAffichage; j++) {
					if (
						this.devoirDansPeriode(
							lDevoir,
							false,
							this.titrePeriodes[j].getNumero(),
						)
					) {
						lCouleurFond = this.couleurPeriodes
							? this.couleurPeriodes[j + 1]
							: GCouleur.periodesClair
								? GCouleur.periodesClair[j + 1]
								: "transparent";
					}
				}
				lTitres.push({
					libelle:
						lDevoir.coefficient.getCoefficientEntier() +
						(!lDevoir.bareme.egal(this.param.baremeParDefaut)
							? "-" + lDevoir.bareme.getBaremeEntier()
							: ""),
					libelleHtml:
						'<div class="NoWrap Maigre" style="' +
						GStyle.composeCouleur(
							lCouleurFond,
							GCouleur.getCouleurCorrespondance(lCouleurFond),
						) +
						(!aPourImpression
							? "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; padding-top: 5px;"
							: "") +
						' overflow:hidden;">' +
						lIconeDevoir +
						'<div class="InlineBlock AlignementMilieuVertical">' +
						(lServiceRattrapage
							? '<span ie-hint="' +
								GTraductions.getValeur("Notes.Rattrapage") +
								'">' +
								GTraductions.getValeur("Notes.Rattrapage") +
								"</span>"
							: lDevoir.coefficient.getCoefficientEntier() +
								(!lDevoir.bareme.egal(this.param.baremeParDefaut)
									? "-" + lDevoir.bareme.getBaremeEntier()
									: "")) +
						"</div></div>",
				});
			} else if (this.avecGenreNotation) {
				let lGenre = this.Service.listeGenreNotation.getElementParNumero(
					lDevoir.genreNotation.getNumero(),
				);
				let lCouleurFond = lGenre ? lGenre.couleur : "transparent";
				lTitres.push({
					libelle:
						lDevoir.coefficient.getCoefficientEntier() +
						(!lDevoir.bareme.egal(this.param.baremeParDefaut)
							? "-" + lDevoir.bareme.getBaremeEntier()
							: ""),
					libelleHtml:
						'<div class="NoWrap Maigre" style="' +
						GStyle.composeCouleur(
							lCouleurFond,
							GCouleur.getCouleurCorrespondance(lCouleurFond),
						) +
						(!aPourImpression
							? "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; padding-top: 5px;"
							: "") +
						' overflow:hidden;">' +
						lIconeDevoir +
						'<div class="InlineBlock AlignementMilieuVertical">' +
						(lServiceRattrapage
							? '<span ie-hint="' +
								GTraductions.getValeur("Notes.Rattrapage") +
								'">' +
								GTraductions.getValeur("Notes.Rattrapage") +
								"</span>"
							: lDevoir.coefficient.getCoefficientEntier() +
								(!lDevoir.bareme.egal(this.param.baremeParDefaut)
									? "-" + lDevoir.bareme.getBaremeEntier()
									: "")) +
						"</div></div>",
				});
			} else {
				lTitres.push({
					libelle: lServiceRattrapage
						? GTraductions.getValeur("Notes.Rattrapage")
						: lDevoir.coefficient.getCoefficientEntier() +
							(!lDevoir.bareme.egal(this.param.baremeParDefaut)
								? "-" + lDevoir.bareme.getBaremeEntier()
								: ""),
					libelleHtml:
						'<div class="devoir coefficient NoWrap">' +
						lIconeDevoir +
						'<div class="InlineBlock AlignementMilieuVertical">' +
						(lServiceRattrapage
							? '<span ie-hint="' +
								GTraductions.getValeur("Notes.Rattrapage") +
								'">' +
								GTraductions.getValeur("Notes.Rattrapage") +
								"</span>"
							: lDevoir.coefficient.getCoefficientEntier() +
								(!lDevoir.bareme.egal(this.param.baremeParDefaut)
									? "-" + lDevoir.bareme.getBaremeEntier()
									: "")) +
						"</div></div>",
				});
			}
			const lTailleColDevoir = this.getTailleColonneDevoir();
			let lIdColDevoir = _getIdByCol({
				id: DonneesListe_PageNotes.colonnes.devoir,
				indice: i,
			});
			if (!lServiceRattrapage) {
				lColonnes.push({
					id: lIdColDevoir,
					genreColonne: this.genreColonne.Devoir,
					rangColonne: i,
					titre: lTitres,
					hint: lHint,
					taille: lTailleColDevoir,
					libelleWai:
						GTraductions.getValeur("PageNotes.WAITitreDevoir_S", [
							GDate.formatDate(lDevoir.date, "%JJJJ %J %MMMM"),
						]) +
						" " +
						lHint,
				});
			}
			if (lDevoirRattrapage) {
				lColonnes.push({
					id: lIdColDevoir + "_rattrapage",
					genreColonne: this.genreColonne.Devoir,
					estRattrapageDevoir: true,
					rangColonne: i,
					titre: lServiceRattrapage
						? lTitres
						: [
								TypeFusionTitreListe.FusionGauche,
								TypeFusionTitreListe.FusionGauche,
								TypeFusionTitreListe.FusionGauche,
							],
					hint: lHint,
					taille: lTailleColDevoir,
				});
				if (lDevoirRattrapageMoy) {
					lColonnes.push({
						id: lIdColDevoir + "_rattrapage_moy",
						genreColonne: this.genreColonne.Devoir,
						estRattrapageDevoir: true,
						estRattrapageMoyenne: true,
						rangColonne: i,
						titre: [
							TypeFusionTitreListe.FusionGauche,
							TypeFusionTitreListe.FusionGauche,
							TypeFusionTitreListe.FusionGauche,
						],
						hint: lHint,
						taille: lTailleColDevoir,
					});
				}
			}
		}
		return lColonnes;
	}
	_getContexteColonnesCachees() {
		const lColonnes = [];
		if (!this.param.avecColonneClasse) {
			lColonnes.push(DonneesListe_PageNotes.colonnes.classe);
		}
		if (
			!(
				!!this.param.optionsAffichage &&
				!!this.param.optionsAffichage.afficherMoyenneBrute
			)
		) {
			lColonnes.push(DonneesListe_PageNotes.colonnes.moyenneBrute);
		}
		if (!this.Service.periode.avecBonusMalus) {
			lColonnes.push(DonneesListe_PageNotes.colonnes.bonusMalus);
		}
		return lColonnes;
	}
	_getContexteColonnesTriables() {
		const lResult = [
			DonneesListe_PageNotes.colonnes.eleves,
			DonneesListe_PageNotes.colonnes.classe,
		];
		if (
			!!this.param.optionsAffichage &&
			!!this.param.optionsAffichage.modeAffichageHeureAbsence > 0 &&
			!this.avecPeriodes &&
			this.periode.getNumero() !== 0
		) {
			lResult.push(DonneesListe_PageNotes.colonnes.absences);
		}
		lResult.push(DonneesListe_PageNotes.colonnes.moyenne);
		if (this.param.avecColNR) {
			lResult.push(DonneesListe_PageNotes.colonnes.moyNR);
		}
		if (
			this.avecRattrapageService &&
			!this.avecSousServices &&
			!this.periodesPourCalculMoyennes()
		) {
			lResult.push(DonneesListe_PageNotes.colonnes.moyenneAvRattrapageService);
		}
		lResult.push(DonneesListe_PageNotes.colonnes.moyenneBrute);
		if (this.avecPeriodes) {
			for (let i = 0, lNbr = this.nbrPeriodesAffichage; i < lNbr; i++) {
				lResult.push(
					_getIdByCol({
						id: DonneesListe_PageNotes.colonnes.moyennePeriode,
						indice: i,
					}),
				);
			}
		}
		if (this.NbrDevoirs) {
			if (this.avecSousServices) {
				for (
					let i = 0, lNbr = this.Service.listeServices.count();
					i < lNbr;
					i++
				) {
					lResult.push(
						_getIdByCol({
							id: DonneesListe_PageNotes.colonnes.moyenneSousService,
							indice: i,
						}),
					);
				}
			} else if (this.avecGenreNotation) {
				let lListeGenreNotation =
					this.Service.listeGenreNotation ||
					this.Service.pere.listeGenreNotation;
				for (let i = 0, lNbr = lListeGenreNotation.count(); i < lNbr; i++) {
					lResult.push(
						_getIdByCol({
							id: DonneesListe_PageNotes.colonnes.moyenneGenreNotation,
							indice: i,
						}),
					);
				}
			}
		}
		lResult.push(DonneesListe_PageNotes.colonnes.bonusMalus);
		for (let i = 0, lNbr = this.listeDevoirs.count(); i < lNbr; i++) {
			let lIdColDevoir = _getIdByCol({
				id: DonneesListe_PageNotes.colonnes.devoir,
				indice: i,
			});
			lResult.push(lIdColDevoir);
		}
		return lResult;
	}
}
DonneesListe_PageNotes.colonnes = {
	eleves: "pageNotes_eleves",
	classe: "pageNotes_classe",
	TDOption: "pageNotes_TDOption",
	absences: "pageNotes_absences",
	moyenne: "pageNotes_moyenne",
	moyenneAvRattrapageService: "pageNotes_moyenneAvRattrapageService",
	moyenneBrute: "pageNotes_moyenneBrute",
	moyennePeriode: "pageNotes_moyennePeriode",
	moyenneSousService: "pageNotes_moyenneSousService",
	moyenneGenreNotation: "pageNotes_moyenneGenreNotation",
	bonusMalus: "pageNotes_bonusMalus",
	devoir: "pageNotes_devoir",
	moyNR: "pageNotes_moyNR",
};
function _estColDevoir(aParams) {
	if (
		aParams.declarationColonne.rangColonne !== undefined &&
		aParams.declarationColonne.genreColonne === this.genreColonne.Devoir
	) {
		return true;
	} else {
		return false;
	}
}
function _estCellEditable(aParams) {
	const lEditable = _estDonneeEditable.call(this, aParams);
	const lCloture = _estDonneeCloture.call(this, aParams);
	return lEditable && !lCloture;
}
function _estDonneeCloture(aParams) {
	const lPeriode = this.periode;
	if (lPeriode && !lPeriode.getActif()) {
		return true;
	} else {
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyNR) {
			return aParams.article.estMoyNRCloture === true;
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus) {
			let lEstClasseEleveClotureSurPeriode = false;
			if (this.param.avecColonneClasse && this.param.listeClasses) {
				const lEleve = aParams.article;
				if (lEleve && lEleve.classe) {
					let lNumClasse = lEleve.classe.getNumero();
					let lClasse = this.param.listeClasses.getElementParNumero(lNumClasse);
					if (lClasse && lClasse.listePeriodes) {
						const lPeriode = lClasse.listePeriodes.getElementParNumero(
							this.periode.getNumero(),
						);
						if (lPeriode && !lPeriode.getActif()) {
							lEstClasseEleveClotureSurPeriode = true;
						}
					}
				}
			}
			return lEstClasseEleveClotureSurPeriode;
		}
		return false;
	}
}
function _estDonneeEditable(aParams) {
	const lEleve = aParams.article;
	if (_estColDevoir.call(this, aParams)) {
		const lDevoir = _getDevoir(aParams);
		const lEleveDevoir = _getEleveDevoir(aParams);
		const lDevoirRattrapage = _getDevoirRattrapage(lDevoir);
		if (
			lDevoirRattrapage &&
			aParams.declarationColonne.estRattrapageDevoir &&
			(!_avecSasieRattrapage.call(this, {
				eleve: aParams.article,
				eleveDevoir: lEleveDevoir,
				devoir: lDevoir,
				devoirRattrapage: lDevoirRattrapage,
			}) ||
				aParams.declarationColonne.estRattrapageMoyenne)
		) {
			return false;
		} else {
			return this.moteurNotesCP.estNoteEditable({
				actif: this.Service.getActif(),
				devoir: _getDevoir(aParams),
				eleve: lEleve,
				eleveDevoir: _getEleveDevoir(aParams),
				devoirDansPeriode: this.devoirDansPeriode.bind(this),
			});
		}
	}
	if (aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus) {
		return this.Service.getActif();
	}
	if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyNR) {
		return lEleve.estMoyNREditable === true;
	}
	return false;
}
function _avecSasieRattrapage(aParams) {
	const lNote =
		aParams.eleveDevoir && aParams.eleveDevoir.Note
			? aParams.eleveDevoir.Note
			: new TypeNote("");
	const lNoteMoyenne = aParams.eleve.moyennes[this.genreColonne.Moyenne];
	const lServiceRattrapage =
		aParams.devoirRattrapage &&
		aParams.devoirRattrapage.genreRattrapage ===
			this.getGenreRattrapage(this.genreRattrapage.GR_RattrapageService);
	const lAvecSaisieRattrapage =
		aParams.devoirRattrapage &&
		(lServiceRattrapage
			? !this.periodesPourCalculMoyennes() &&
				!this.avecSousServices &&
				!lNoteMoyenne.estUneNoteVide() &&
				lNoteMoyenne.estUneValeur() &&
				lNoteMoyenne.getValeur() <
					aParams.devoir.devoirRattrapage.noteSeuil.getValeur()
			: !lNote.estUneNoteVide() &&
				(!lNote.estUneValeur() ||
					lNote.getValeur() <
						aParams.devoir.devoirRattrapage.noteSeuil.getValeur()));
	return lAvecSaisieRattrapage;
}
function _getDevoir(aParams) {
	return aParams.instance.Donnees.listeDevoirs.get(
		aParams.declarationColonne.rangColonne,
	);
}
function _getDevoirRattrapage(aDevoir) {
	return aDevoir.devoirRattrapage &&
		aDevoir.devoirRattrapage.existeNumero() &&
		aDevoir.devoirRattrapage.existe()
		? aDevoir.devoirRattrapage
		: false;
}
function _getEleveDevoir(aParams) {
	if (
		_getDevoir(aParams).listeEleves.getElementParNumero(
			aParams.article.Numero,
		) !== undefined
	) {
		return _getDevoir(aParams).listeEleves.getElementParNumero(
			aParams.article.Numero,
		);
	} else {
		const lEleve = aParams.article;
		lEleve.Note = null;
		return lEleve;
	}
}
function _getBonusMalus(aParam) {
	const lPeriodeBonus = aParam.listePeriodes.getElementParNumero(
		this.periode.getNumero(),
	);
	if (
		_estBonusMalusConformeAbsences(
			lPeriodeBonus.bonusMalus,
			lPeriodeBonus.malusAbsences,
		) &&
		!this.param.pourImpression
	) {
		return lPeriodeBonus.malusAbsences;
	} else {
		return lPeriodeBonus.bonusMalus;
	}
}
function _estBonusMalusConformeAbsences(aBonusMalus, aMalusAbsences) {
	return (
		aBonusMalus &&
		aMalusAbsences &&
		aBonusMalus.getValeur() !== 0 &&
		aBonusMalus.getValeur() === aMalusAbsences.getValeur()
	);
}
function _estCellMethodeCalculMoyenne(D, aParam) {
	let lNote, lNoteEleveRattrapageService, lValeursMoy;
	switch (aParam.declarationColonne.genreColonne) {
		case this.genreColonne.Moyenne:
			lValeursMoy = this.getValeursMoy({ article: D });
			lNote = lValeursMoy.note;
			lNoteEleveRattrapageService = lValeursMoy.noteRattrapage;
			if (lValeursMoy.rattraperNote) {
				lNote = lNoteEleveRattrapageService;
			}
			return !isNaN(lNote.getValeur());
		case this.genreColonne.MoyenneAvRattrapageService:
			return !isNaN(
				D.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService
				].getValeur(),
			);
		case this.genreColonne.MoyenneBrute:
			return !isNaN(
				D.moyennes[MoteurNotesCP.genreMoyenne.MoyenneBrute].getValeur(),
			);
		case this.genreColonne.MoyennePeriode:
			lNote =
				D.moyennes[
					MoteurNotesCP.genreMoyenne.MoyennePeriode -
						aParam.declarationColonne.rangColonne
				];
			if (
				!this.Service.listeServices ||
				(this.Service.listeServices && !this.Service.listeServices.count())
			) {
				lNoteEleveRattrapageService =
					this.moteurNotesCP.getNoteRattrapageServiceDElevePeriode({
						eleve: D,
						listeDevoirs: this.listeDevoirs,
						numeroPeriode:
							this.titrePeriodes.length > 0
								? this.titrePeriodes[
										aParam.declarationColonne.rangColonne
									].getNumero()
								: this.periode.getNumero(),
						indicePeriode: aParam.declarationColonne.rangColonne,
						devoirDansPeriode: this.devoirDansPeriode.bind(this),
						baremeParDefaut: this.param.baremeParDefaut,
					});
				if (
					!!lNoteEleveRattrapageService &&
					!lNoteEleveRattrapageService.estUneNoteVide() &&
					(!lNoteEleveRattrapageService.estUneAnnotation() ||
						(this.avecUtilisationAnnotationFelicitation() &&
							lNoteEleveRattrapageService.getValeur() >
								this.param.baremeParDefaut.getValeur()))
				) {
					lNote = lNoteEleveRattrapageService;
				}
			}
			return !isNaN(lNote.getValeur());
		case this.genreColonne.MoyenneSousService:
			lNote =
				D.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneSousService -
						aParam.declarationColonne.rangColonne
				];
			lNoteEleveRattrapageService =
				this.moteurNotesCP.getNoteRattrapageServiceDEleveSousService({
					eleve: D,
					listeDevoirs: this.listeDevoirs,
					numeroPeriode: this.periode.getNumero(),
					numeroService: this.Service.listeServices
						.get(aParam.declarationColonne.rangColonne)
						.getNumero(),
					indiceService: aParam.declarationColonne.rangColonne,
					devoirDansPeriode: this.devoirDansPeriode.bind(this),
					baremeParDefaut: this.param.baremeParDefaut,
				});
			if (
				!!lNoteEleveRattrapageService &&
				!lNoteEleveRattrapageService.estUneNoteVide() &&
				(!lNoteEleveRattrapageService.estUneAnnotation() ||
					(this.avecUtilisationAnnotationFelicitation() &&
						lNoteEleveRattrapageService.getValeur() >
							this.param.baremeParDefaut.getValeur()))
			) {
				lNote = lNoteEleveRattrapageService;
			}
			return !isNaN(lNote.getValeur());
		case this.genreColonne.MoyenneGenreNotation:
			return !isNaN(
				D.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
						aParam.declarationColonne.rangColonne
				].getValeur(),
			);
		default:
			return false;
	}
}
function _getIdByCol(aCol) {
	switch (aCol.id) {
		case DonneesListe_PageNotes.colonnes.devoir:
		case DonneesListe_PageNotes.colonnes.moyennePeriode:
		case DonneesListe_PageNotes.colonnes.moyenneSousService:
		case DonneesListe_PageNotes.colonnes.moyenneGenreNotation:
			return aCol.id + "_" + aCol.indice;
		default:
			return aCol.id;
	}
}
function _getColById(aId) {
	const lCol = {},
		lSplit = aId.split("_");
	lCol.id = aId;
	lCol.indice = null;
	if (lSplit[1] === "devoir") {
		lCol.id = DonneesListe_PageNotes.colonnes.devoir;
		lCol.indice = lSplit[2];
	}
	if (lSplit[1] === "moyennePeriode") {
		lCol.id = DonneesListe_PageNotes.colonnes.moyennePeriode;
		lCol.indice = lSplit[2];
	}
	if (lSplit[1] === "moyenneSousService") {
		lCol.id = DonneesListe_PageNotes.colonnes.moyenneSousService;
		lCol.indice = lSplit[2];
	}
	if (lSplit[1] === "moyenneGenreNotation") {
		lCol.id = DonneesListe_PageNotes.colonnes.moyenneGenreNotation;
		lCol.indice = lSplit[2];
	}
	return lCol;
}
function _afficherCommePlusHaute(aNote, aService) {
	return (
		this.moteurNotesCP.getPonderationNotePlusHaute(aService) !== 1.0 &&
		aNote.estPlusHaute
	);
}
function _afficherCommePlusBasse(aNote, aService) {
	return (
		this.moteurNotesCP.getPonderationNotePlusBasse(aService) !== 1.0 &&
		aNote.estPlusBasse
	);
}
function _estExecKiosque(aEleveDevoir) {
	return aEleveDevoir && aEleveDevoir.execKiosque
		? aEleveDevoir.execKiosque
		: false;
}
function _getServiceOuSousServiceDeLaColonneMoyenne(aIndiceColonne) {
	let lServiceConcernee = null;
	if (this.avecSousServices && !!this.Service && !!this.Service.listeServices) {
		for (let K = 0; K < this.Service.listeServices.count(); K++) {
			if (
				aIndiceColonne === this.genreColonne.MoyenneSousService - K ||
				aIndiceColonne === this.genreColonne.MoyenneSousServiceBrute - K
			) {
				lServiceConcernee = this.Service.listeServices.get(K);
				break;
			}
		}
	}
	if (!lServiceConcernee) {
		lServiceConcernee = this.Service;
	}
	return lServiceConcernee;
}
function _calculerMoyennes(ANumLigne, ANumColonne) {
	const lAvecPeriode = this.periodesPourCalculMoyennes();
	const lDebEleve =
		ANumLigne === null || ANumLigne === undefined ? 0 : ANumLigne;
	const lFinEleve =
		ANumLigne === null || ANumLigne === undefined
			? this.NbrEleves
			: ANumLigne + 1;
	const LDeb =
		ANumColonne !== null && ANumColonne !== undefined
			? ANumColonne < 0
				? 0
				: ANumColonne
			: 0;
	const LFin =
		ANumColonne !== null && ANumColonne !== undefined
			? ANumColonne < 0
				? 0
				: ANumColonne + 1
			: this.NbrDevoirs;
	const lListeElevesSelection = new ObjetListeElements();
	for (let I = lDebEleve; I < lFinEleve; I++) {
		lListeElevesSelection.addElement(this.Donnees.get(I));
	}
	const lListeDevoirsSelection = new ObjetListeElements();
	for (let J = LDeb; J < LFin; J++) {
		lListeDevoirsSelection.addElement(this.listeDevoirs.get(J));
	}
	this.moyGenerales = this.moteurNotesCP.calculerMoyennes(
		$.extend(
			{},
			{
				periode: this.periode,
				infosPeriodes: {
					avecPeriodes: lAvecPeriode,
					nbPeriodes: this.nbrPeriodes,
					titrePeriodes: this.titrePeriodes,
				},
				listeClasses: this.param.listeClasses,
				baremeParDefaut: this.param.baremeParDefaut,
				forcerSansSousService: this.param.forcerSansSousService,
				service: this.Service,
				listeDevoirs: this.listeDevoirs,
				devoirDansPeriode: this.devoirDansPeriode.bind(this),
				listeEleves: this.Donnees,
				affichageAnciensEleves: this.affichageAnciensEleves,
				eleveDansDevoir: this.eleveDansDevoir.bind(this),
				avecTotalMoyNR: this.param.avecColNR,
			},
			{
				listeElevesSelection: ANumLigne ? lListeElevesSelection : null,
				listeDevoirsSelection: ANumColonne ? lListeDevoirsSelection : null,
			},
		),
	);
}
module.exports = { DonneesListe_PageNotes };
