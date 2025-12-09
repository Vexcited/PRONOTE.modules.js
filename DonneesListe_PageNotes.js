exports.DonneesListe_PageNotes = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetListe_1 = require("ObjetListe");
const TypeNote_1 = require("TypeNote");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetImage_1 = require("ObjetImage");
const Enumere_EvenementSaisieNotes_1 = require("Enumere_EvenementSaisieNotes");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EleveDansDevoir_1 = require("Enumere_EleveDansDevoir");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_EvenementNotesEtAppreciations_1 = require("Enumere_EvenementNotesEtAppreciations");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeHeuresAbsences_1 = require("TypeHeuresAbsences");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const AccessApp_1 = require("AccessApp");
const ObjetFenetre_MoyenneTableauResultats_1 = require("ObjetFenetre_MoyenneTableauResultats");
class DonneesListe_PageNotes extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees.listeEleves);
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
		this.moteurNotesCP = aParam.moteurNotesCP;
		this.NbrEleves = aDonnees.listeEleves.count();
		this.NbrDevoirs = aDonnees.listeDevoirs.count();
		this.listeDevoirs = aDonnees.listeDevoirs;
		this.param = $.extend(
			{
				avecColonneClasse: false,
				matiere: new ObjetElement_1.ObjetElement(),
				service: new ObjetElement_1.ObjetElement(),
				periode: new ObjetElement_1.ObjetElement(),
				listeClasses: new ObjetListeElements_1.ObjetListeElements(),
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
		this.avecRattrapageService = false;
		this.listeDevoirs.parcourir((aDevoir) => {
			const lDevoirRattrapage = this._getDevoirRattrapage(aDevoir);
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
		this._calculerMoyennes();
		this.param.instance.setOptionsListe({
			colonnes: this._getContexteColonnes(
				aDonnees.listeEleves,
				this.param.pourImpression,
			),
			colonnesCachees: this._getContexteColonnesCachees(),
			colonnesTriables: this._getContexteColonnesTriables(),
			hauteurAdapteContenu: Infinity,
			scrollHorizontal: this._getIdByCol({
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
					genre: ObjetListe_1.ObjetListe.typeBouton.exportCSV,
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
	getControleur(aInstance, aListe) {
		return $.extend(true, super.getControleur(aInstance, aListe), {
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
							let i = 0, lNbr = aInstance.Service.listeServices.count();
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
								break;
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
		});
	}
	avecEvenementSelectionClick(aParams) {
		if (this._estCellMethodeCalculMoyenne(aParams.article, aParams)) {
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
				genreEvnt:
					Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
						.ClicCelluleAbsences,
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
	getAriaHasPopup(aParams) {
		if (this.estCelluleAvecActionFenetreMoyenne(aParams)) {
			return "dialog";
		}
		return false;
	}
	estCelluleAvecActionFenetreMoyenne(aParams) {
		if (
			this._estCellMethodeCalculMoyenne(aParams.article, aParams) &&
			[
				this.genreColonne.Moyenne,
				this.genreColonne.MoyenneAvRattrapageService,
				this.genreColonne.MoyenneBrute,
				this.genreColonne.MoyennePeriode,
				this.genreColonne.MoyenneSousService,
				this.genreColonne.MoyenneGenreNotation,
			].includes(aParams.declarationColonne.genreColonne)
		) {
			return true;
		}
		return false;
	}
	avecEdition(aParams) {
		return this._estCellEditable(aParams);
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
					lEleve.dansDevoir[x] ===
						Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non &&
					lEleve.listeDevoirs &&
					lEleve.listeDevoirs.getElementParNumero(x) &&
					lEleve.listeDevoirs.getElementParNumero(x).note &&
					lEleve.listeDevoirs.getElementParNumero(x).note.getNote()
				) {
					lANoteInutile = true;
					break;
				}
			}
			if (this._estUnNoteDevoirExecKiosque(aParams)) {
				return true;
			}
		}
		return lANoteInutile;
	}
	_estUnNoteDevoirExecKiosque(aParams) {
		if (this._estColDevoir(aParams)) {
			const lEleveDevoir = this._getEleveDevoir(aParams);
			if (this._estExecKiosque(lEleveDevoir)) {
				return true;
			}
		}
		return false;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			1,
			ObjetTraduction_1.GTraductions.getValeur(
				"Notes.MenuContext.SupprimerLesNotesNonComptabilises",
			),
			true,
		);
		aParametres.menuContextuel.setDonnees();
	}
	getValeursMoy(aParam) {
		const lNote =
			aParam.article.moyennes[
				MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.Moyenne
			];
		const lNoteRattrapageService =
			this.moteurNotesCP.getNoteRattrapageServiceDEleve({
				eleve: aParam.article,
				listeDevoirs: this.listeDevoirs,
				baremeParDefaut: this.param.baremeParDefaut,
			});
		const lRattraperNote =
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
						? ObjetTraduction_1.GTraductions.getValeur(
								"Notes.Colonne.TitreMoyNR",
							)
						: this.moteurNotesCP.composeHtmlMoyNR();
				} else {
					return "";
				}
			case this.genreColonne.MoyenneAvRattrapageService:
				return aParams.article.moyennes[
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService
				];
			case this.genreColonne.MoyenneBrute:
				return aParams.article.moyennes[
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneBrute
				];
			case this.genreColonne.BonusMalus:
				if (
					!aParams.surEdition &&
					this._getBonusMalus(aParams.article).getValeur() === 0
				) {
					return null;
				}
				return this._getBonusMalus(aParams.article);
			case this.genreColonne.MoyennePeriode:
				lNote =
					aParams.article.moyennes[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyennePeriode -
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
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneSousService -
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
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
						aParams.declarationColonne.rangColonne
				];
			case this.genreColonne.Devoir:
				return this.composeNoteDevoir(aParams);
			default:
				return "";
		}
	}
	estCelluleWAIRowHeader(aParams) {
		return aParams.declarationColonne.genreColonne === this.genreColonne.Eleve;
	}
	getWAIInputEdition(aParams) {
		if (this._estColDevoir(aParams)) {
			return ObjetTraduction_1.GTraductions.getValeur("PageNotes.WAINoteDe_S", [
				aParams.article.getLibelle(),
			]);
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (
			this._estColDevoir(aParams) ||
			aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Note;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
	}
	getTooltip(aParams) {
		if (this._estColDevoir(aParams)) {
			const lDevoir = this.listeDevoirs.get(
				aParams.declarationColonne.rangColonne,
			);
			const lEleve = aParams.article;
			let lMessage = this.moteurNotesCP.getMsgNoteNonEditable({
				devoir: lDevoir,
				eleve: lEleve,
				eleveDevoir: lDevoir.listeEleves.getElementParNumero(
					lEleve.getNumero(),
				),
				devoirDansPeriode: this.devoirDansPeriode.bind(this),
			});
			const lEleveDevoir = this._getEleveDevoir(aParams);
			const lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
			const lEleveDevoirRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					: null;
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote_1.TypeNote("");
			const lDevoirRattrapageMoy =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
			const lMoyenneRattrapage = lDevoirRattrapageMoy
				? this.moteurNotesCP.getMoyenneNotesRattrapage(
						lEleveDevoir.Note,
						lNoteRattrapage,
						lDevoirRattrapage.noteSeuil,
					)
				: new TypeNote_1.TypeNote("");
			const lNote = aParams.declarationColonne.estRattrapageDevoir
				? aParams.declarationColonne.estRattrapageMoyenne
					? lMoyenneRattrapage
					: lNoteRattrapage
				: lEleveDevoir.Note;
			if (
				this.moteurNotesCP.afficherCommeUnBonus({
					note: lNote,
					devoir: lDevoir,
					service: this.Service,
				})
			) {
				lMessage =
					ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Message.NoteNonPriseEnCompte",
					) + (lMessage ? "\n" + lMessage : "");
			}
			if (
				this.estNotePonderee({
					note: lEleveDevoir ? lEleveDevoir.Note : new TypeNote_1.TypeNote(""),
					noteRattrapage: lNoteRattrapage,
					devoirRattrapageMoy: lDevoirRattrapageMoy,
					devoirRattrapage: lDevoirRattrapage,
					declarationColonne: aParams.declarationColonne,
				})
			) {
				lMessage =
					ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Message.NotePonderee",
					) + (lMessage ? "\n" + lMessage : "");
			}
			return lMessage;
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus) {
			if (this._estDonneeCloture(aParams)) {
				return ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee");
			} else {
				const lPeriodeBonus = aParams.article.listePeriodes.getElementParNumero(
					this.periode.getNumero(),
				);
				if (
					this._estBonusMalusConformeAbsences(
						lPeriodeBonus.bonusMalus,
						lPeriodeBonus.malusAbsences,
					) &&
					!this.param.pourImpression
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Notes.HintMalusAbsences",
					);
				}
			}
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyNR) {
			if (this._estDonneeCloture(aParams)) {
				return ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee");
			} else {
				if (aParams.article.estMoyNR) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.HintMoyenneNR",
					);
				}
			}
		}
		let lMessage = "";
		if (this.estCelluleAvecActionFenetreMoyenne(aParams)) {
			lMessage =
				ObjetFenetre_MoyenneTableauResultats_1
					.TradObjetFenetre_MoyenneTableauResultats.OuvrirFenetre;
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyenne) {
			const lValeursMoy = this.getValeursMoy({ article: aParams.article });
			let lNote = lValeursMoy.note;
			const lNoteEleveRattrapageService = lValeursMoy.noteRattrapage;
			if (lValeursMoy.rattraperNote) {
				lNote = lNoteEleveRattrapageService;
			}
			if (
				this.Service.facultatif === true &&
				lNote.getValeur() <= this.param.baremeParDefaut.getValeur() / 2
			) {
				lMessage =
					ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Message.MoyenneNonPriseEnCompte",
					) + (lMessage ? "\n" + lMessage : "");
			}
		}
		return lMessage;
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
			T.push("color-neutre-sombre");
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
		if (this._estColDevoir(aParams)) {
			const lEleveDevoir = this._getEleveDevoir(aParams);
			if (this._estExecKiosque(lEleveDevoir)) {
				T.push(Divers_css_1.StylesDivers.cursorContextMenu);
			}
			const lDevoir = this._getDevoir(aParams);
			const lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
			if (
				lDevoirRattrapage &&
				aParams.declarationColonne.estRattrapageDevoir &&
				!this._avecSaisieRattrapage({
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
				lDevoirRattrapage &&
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[aParams.article.getNumero()]
					? lDevoirRattrapage.objetListeEleves[aParams.article.getNumero()]
					: null;
			const lDevoirRattrapageMoy =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne);
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote_1.TypeNote("");
			const lNote = lEleveDevoir
				? lEleveDevoir.Note
				: new TypeNote_1.TypeNote("");
			if (
				this.estNotePonderee({
					note: lNote,
					noteRattrapage: lNoteRattrapage,
					devoirRattrapageMoy: lDevoirRattrapageMoy,
					devoirRattrapage: lDevoirRattrapage,
					declarationColonne: aParams.declarationColonne,
				})
			) {
				T.push("Gras");
			}
		}
		return T.join(" ");
	}
	getClassCelluleConteneur(aParams) {
		const T = [];
		if (this._estCellMethodeCalculMoyenne(aParams.article, aParams)) {
			T.push("Curseur_MethodeCalculMoyenneActif");
		}
		return T.join("");
	}
	getCouleurCellule(aParams, aCouleurCellule) {
		const lPourImpression = this.param.pourImpression;
		if (this._estColDevoir(aParams)) {
			const lEleve = aParams.article;
			const lDevoir = this._getDevoir(aParams);
			const lEleveDevoir = this._getEleveDevoir(aParams);
			const lNote = lEleveDevoir.Note;
			const lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
			const lEleveDevoirRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					: null;
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote_1.TypeNote("");
			const lDevoirRattrapageGenreRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Rattrapage);
			const lDevoirRattrapageMoy =
				lDevoirRattrapage &&
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
				aCouleurCellule.texte = (0,
				AccessApp_1.getApp)().getCouleur().grisTresFonce;
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
							? (0, AccessApp_1.getApp)().getCouleur().grisTresFonce
							: this.getCouleurDeNoteDeDevoir(
									lNoteCourrante,
									lDevoir,
									lPourImpression,
								);
					} else {
						lCouleurNoteRattrapage = lNoteMoinsBonne
							? (0, AccessApp_1.getApp)().getCouleur().grisTresFonce
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
				let lService =
					this._getServiceOuSousServiceDeLaColonneMoyenne(lGenreColonne);
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
					aCouleurCellule.texte = (0,
					AccessApp_1.getApp)().getCouleur().grisTresFonce;
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
		const lCol = this._getColById(this.getId(aColonne));
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
				return aArticle.moyennes[
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneBrute
				];
			case DonneesListe_PageNotes.colonnes.moyenneSousService:
				return aArticle.moyennes[
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneSousService -
						lCol.indice
				];
			case DonneesListe_PageNotes.colonnes.moyenneGenreNotation:
				return aArticle.moyennes[
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
						lCol.indice
				];
			case DonneesListe_PageNotes.colonnes.moyenneAvRattrapageService:
				return aArticle.moyennes[
					MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService
				];
			case DonneesListe_PageNotes.colonnes.bonusMalus:
				return this._getBonusMalus(aArticle).getValeur();
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
		if (MethodesObjet_1.MethodesObjet.isNumber(aColonneDeTri)) {
			const lCol = this._getColById(this.getId(aColonneDeTri));
			switch (lCol.id) {
				case DonneesListe_PageNotes.colonnes.eleves:
				case DonneesListe_PageNotes.colonnes.classe:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
				case DonneesListe_PageNotes.colonnes.absences:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							let lDuree;
							switch (lThis.param.optionsAffichage.modeAffichageHeureAbsence) {
								case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.Total:
									lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
										D.absences.injustif + D.absences.justif,
									);
									break;
								case TypeHeuresAbsences_1.ModeAffichageHeureAbsence
									.TotalObligatoire:
									lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
										D.absences.injustifOblig + D.absences.justifOblig,
									);
									break;
								case TypeHeuresAbsences_1.ModeAffichageHeureAbsence
									.Injustifiees:
									lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
										D.absences.injustif,
									);
									break;
								case TypeHeuresAbsences_1.ModeAffichageHeureAbsence
									.InjustifieesObligatoire:
									lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
										D.absences.injustifOblig,
									);
									break;
								case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.Justifiees:
									lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
										D.absences.justif,
									);
									break;
								case TypeHeuresAbsences_1.ModeAffichageHeureAbsence
									.JustifieesObligatoire:
									lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
										D.absences.justifOblig,
									);
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
						TypeNote_1.TypeNote.getTrisDefaut(
							(aArticle) => this.getValeurPourTri(aColonneDeTri, aArticle),
							lGenreTriInverse,
						),
					);
					break;
				case DonneesListe_PageNotes.colonnes.bonusMalus:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							lGenreTriInverse,
						),
					);
					break;
				case DonneesListe_PageNotes.colonnes.devoir:
					lTris.push(
						ObjetTri_1.ObjetTri.init((D) => {
							const lEleve = D;
							const lDevoir = lThis.listeDevoirs.get(lCol.indice);
							const lEleveDansDevoir = lEleve.dansDevoir[lDevoir.getNumero()];
							const lEleveDevoir = lDevoir.listeEleves.getElementParNumero(
								D.getNumero(),
							);
							if (!lEleveDevoir || !lEleveDevoir.Note) {
								return -1000;
							}
							if (
								lEleveDansDevoir ===
								Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non
							) {
								return -1000;
							}
							if (
								lEleveDansDevoir ===
								Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Jamais
							) {
								return -1001;
							}
							if (!lThis.devoirDansPeriode(lDevoir, lEleve)) {
								return -1000;
							}
							return 0;
						}, lGenreTriInverse),
					);
					lTris = lTris.concat(
						TypeNote_1.TypeNote.getTrisDefaut((D) => {
							return lThis.listeDevoirs
								.get(lCol.indice)
								.listeEleves.getElementParNumero(D.getNumero()).Note;
						}, lGenreTriInverse),
					);
					break;
				case DonneesListe_PageNotes.colonnes.moyNR:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							lGenreTriInverse,
						),
					);
					break;
				default:
					break;
			}
		}
		lTris.push(ObjetTri_1.ObjetTri.init("Position"));
		return lTris;
	}
	getListeLignesTotal() {
		const lListe = new ObjetListeElements_1.ObjetListeElements().add(
			new ObjetElement_1.ObjetElement("", 0),
		);
		if (this.param.avecTotal) {
			lListe.add(new ObjetElement_1.ObjetElement("", 1));
		}
		return lListe;
	}
	actualiserMoyennes() {
		this._calculerMoyennes();
	}
	getTraductionMoyenneClasse() {
		return "";
	}
	getContenuTotal(aParams) {
		let lDevoir;
		let lDevoirRattrapage;
		if (aParams.article.getNumero() === 0) {
			switch (aParams.declarationColonne.genreColonne) {
				case this.genreColonne.Eleve:
					return this.getTraductionMoyenneClasse();
				case this.genreColonne.Moyenne:
					return (
						this.moyGenerales[
							MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.Moyenne
						] + ""
					);
				case this.genreColonne.MoyenneAvRattrapageService:
					return this.moyGenerales[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne
							.MoyenneAvRattrapageService
					];
				case this.genreColonne.MoyenneBrute:
					return this.moyGenerales[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneBrute
					];
				case this.genreColonne.MoyennePeriode:
					return this.moyGenerales[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyennePeriode -
							aParams.declarationColonne.rangColonne
					];
				case this.genreColonne.MoyenneSousService:
					return this.moyGenerales[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneSousService -
							aParams.declarationColonne.rangColonne
					];
				case this.genreColonne.MoyenneGenreNotation:
					return this.moyGenerales[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
							aParams.declarationColonne.rangColonne
					];
				case this.genreColonne.Devoir:
					lDevoir = this._getDevoir(aParams);
					lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
					return lDevoirRattrapage &&
						aParams.declarationColonne.estRattrapageDevoir
						? aParams.declarationColonne.estRattrapageMoyenne
							? lDevoirRattrapage.MoyenneGenreMoyenne
							: lDevoirRattrapage.Moyenne
						: lDevoir.Moyenne;
				case this.genreColonne.MoyNR:
					return (
						(this.moyGenerales[
							MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneNR
						] || "") + ""
					);
				default:
					return "";
			}
		}
		if (aParams.article.getNumero() === 1) {
			if (this._estColDevoir(aParams)) {
				lDevoir = this._getDevoir(aParams);
				lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
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
	getTypeCelluleTotal(aParams) {
		if (aParams.article.getNumero() === 0) {
			return aParams.idColonne === DonneesListe_PageNotes.colonnes.eleves
				? ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.fond
				: ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.defaut;
		}
		if (aParams.article.getNumero() === 1) {
			return aParams.idColonne === DonneesListe_PageNotes.colonnes.eleves
				? ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.fond
				: ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.alterne;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.typeCelluleTotal.defaut;
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
			case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.Total:
				lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
					aAbsences.injustif + aAbsences.justif,
				);
				break;
			case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.TotalObligatoire:
				lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
					aAbsences.injustifOblig + aAbsences.justifOblig,
				);
				break;
			case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.Injustifiees:
				lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
					aAbsences.injustif,
				);
				break;
			case TypeHeuresAbsences_1.ModeAffichageHeureAbsence
				.InjustifieesObligatoire:
				lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
					aAbsences.injustifOblig,
				);
				break;
			case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.Justifiees:
				lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(aAbsences.justif);
				break;
			case TypeHeuresAbsences_1.ModeAffichageHeureAbsence.JustifieesObligatoire:
				lDuree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMs(
					aAbsences.justifOblig,
				);
				break;
		}
		return lDuree;
	}
	composeAbsences(aAbsences, aModeAffichage) {
		let lDuree = this.getDureeAbsence(aAbsences, aModeAffichage);
		return lDuree > 0
			? ObjetDate_1.GDate.formatDureeEnMillisecondes(lDuree, "%xh%sh%mm")
			: "";
	}
	composeNoteDevoir(aParam) {
		const lSurExportCSV = aParam.surExportCSV;
		const lEleveDevoir = this._getEleveDevoir(aParam);
		const lEleve = aParam.article;
		const lDevoir = this._getDevoir(aParam);
		const lEleveDansDevoir = lEleve.dansDevoir[lDevoir.getNumero()];
		const lNote = lEleveDevoir.Note;
		if (!lEleveDevoir || !lNote) {
			return lSurExportCSV ? "X" : null;
		}
		if (
			lEleveDansDevoir === Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non
		) {
			return lSurExportCSV ? "X" : null;
		}
		if (
			lEleveDansDevoir ===
			Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Jamais
		) {
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
		} else {
			const lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
			if (lDevoirRattrapage && aParam.declarationColonne.estRattrapageDevoir) {
				const lEleveDevoirRattrapage =
					lDevoirRattrapage.objetListeEleves &&
					lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
						? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
						: false;
				const lAvecSaisieRattrapage = this._avecSaisieRattrapage({
					eleve: lEleve,
					eleveDevoir: lEleveDevoir,
					devoir: lDevoir,
					devoirRattrapage: lDevoirRattrapage,
				});
				const lNoteRattrapage =
					lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
						? lEleveDevoirRattrapage.Note
						: new TypeNote_1.TypeNote("");
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
					return lAvecSaisieRattrapage
						? lNoteRattrapage
						: new TypeNote_1.TypeNote("");
				}
			} else {
				return lNote;
			}
		}
	}
	getOptionsNote(aParams) {
		if (this._estColDevoir(aParams)) {
			const lDevoir = this._getDevoir(aParams);
			const lEleve = aParams.article;
			const lEleveDevoir = this._getEleveDevoir(aParams);
			const lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
			const lEleveDevoirRattrapage =
				lDevoirRattrapage &&
				lDevoirRattrapage.objetListeEleves &&
				lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					? lDevoirRattrapage.objetListeEleves[lEleve.getNumero()]
					: null;
			const lNoteRattrapage =
				lEleveDevoirRattrapage && lEleveDevoirRattrapage.Note
					? lEleveDevoirRattrapage.Note
					: new TypeNote_1.TypeNote("");
			const lDevoirRattrapageMoy = lDevoirRattrapage
				? lDevoirRattrapage.genreRattrapage ===
					this.getGenreRattrapage(this.genreRattrapage.GR_Moyenne)
				: false;
			const lMoyenneRattrapage = lDevoirRattrapageMoy
				? this.moteurNotesCP.getMoyenneNotesRattrapage(
						lEleveDevoir.Note,
						lNoteRattrapage,
						lDevoirRattrapage.noteSeuil,
					)
				: new TypeNote_1.TypeNote("");
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
					!this._avecSaisieRattrapage({
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
			const lInvisible = this._getBonusMalus(aParams.article).getValeur() === 0;
			const lPeriodeBonus = aParams.article.listePeriodes.getElementParNumero(
				this.periode.getNumero(),
			);
			return {
				suffixe: this._estBonusMalusConformeAbsences(
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
	composeEleveProjetAcc(D, a, b) {
		return D.getLibelle();
	}
	getTitrePeriodes() {
		return null;
	}
	getSuffixe(aEleveDevoir) {
		return;
	}
	avecLigneTitreBouton() {
		return this.avecCompetences;
	}
	getTitreBouton(aDevoir, aIndex, aStrIeNode, aAriaLabel) {
		return {
			getLibelleHtml: () =>
				"<div " +
				(aStrIeNode
					? `${aStrIeNode} aria-label="${aAriaLabel}" data-tooltip`
					: "") +
				' class="devoir competences AvecMain TitreListeSansTri">' +
				(aDevoir.evaluation
					? IE.jsx.str("ie-btnimage", {
							"ie-model": this.jsxModeleBoutonCompetences.bind(this, aIndex),
							class: "Image_SaisieCompetenceDevoir InlineBlock",
							style: "width:16px;",
						})
					: "&nbsp;") +
				"</div>",
		};
	}
	jsxModeleBoutonCompetences(aIndex) {
		return {
			event: () => {
				this.surCompetences(aIndex);
				return false;
			},
			getTitle: () => {
				const H = [],
					lDevoir = this.listeDevoirs.get(aIndex);
				if (lDevoir.evaluation && lDevoir.evaluation.listeCompetences) {
					lDevoir.evaluation.listeCompetences.parcourir((aCompetence) => {
						H.push(aCompetence.code + " : " + aCompetence.getLibelle());
					});
					return ObjetChaine_1.GChaine.enleverEntites(H.join("\n"));
				}
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
	createChaineAnnotationFelicitation(aValeurBareme) {
		return null;
	}
	estUneAnnotationAutorisee(aGenreAnnotation) {
		return TypeNote_1.TypeNote.estAnnotationPermise(aGenreAnnotation);
	}
	estPeriodeActuelleToutes() {
		return false;
	}
	getGenreRattrapage(aBidon) {
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
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.BonusMalus",
					),
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.Bonus",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.BonusMalus",
					),
				},
			],
			taille: 60,
		};
	}
	getCouleurDeNoteDeDevoir(aNote, aDevoir, aPourImpression) {
		return "inherit";
	}
	getCouleurDeNoteSousSeuil(aNote, aNoteSeuil, aPourImpression) {
		return "inherit";
	}
	getNoteMaxDevoir(aDevoir) {
		return null;
	}
	composeChaineElevePasDansDevoir(aEleveDevoir) {
		return "X";
	}
	composeChaineElevePasDansDevoirRattrapage(aEleveDevoir, aNoteSeuil) {
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
			genreEvnt:
				Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes.Competences,
			devoir: this.listeDevoirs.get(I),
		};
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	surCreerDevoir() {
		const lParamEvnt = {
			genreEvnt:
				Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
					.CreationDevoir,
		};
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	surEditionDevoir(I) {
		const lParamEvnt = {
			genreEvnt:
				Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes.EditionDevoir,
			devoir: this.listeDevoirs.get(I),
		};
		this.enEdition = false;
		this.param.callbackEvnt(lParamEvnt);
	}
	evenementMenuContextuel(aParametres) {
		if (aParametres.numeroMenu === 1) {
			const lParamEvnt = {
				genreEvnt: Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
				eleve: aParametres.article,
			};
			this.enEdition = false;
			this.param.callbackEvnt(lParamEvnt);
		}
	}
	surImporter(aParametres) {
		const lParamEvnt = {
			genreEvnt:
				Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes.Import,
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
			genreEvnt:
				Enumere_EvenementNotesEtAppreciations_1
					.EGenreEvenementNotesEtAppreciations.MethodeCalculMoyenne,
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
	surSelectionLigne(J, D) {
		const lParamEvnt = {
			genreEvnt:
				Enumere_EvenementNotesEtAppreciations_1
					.EGenreEvenementNotesEtAppreciations.SelectionLigne,
			eleve: D,
		};
		this.param.callbackEvnt(lParamEvnt);
	}
	surSelection(I, D) {
		if (I !== -1) {
			const lCol = this._getColById(this.getId(I));
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
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
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
			if (
				aNote.estUneNoteValide(
					new TypeNote_1.TypeNote(0),
					aDevoir.bareme,
					true,
					true,
				)
			) {
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
				lNote.setBareme(lBaremeDevoir);
			}
			lNote = new TypeNote_1.TypeNote(lNote.toStr());
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
					listeElevesSelection:
						new ObjetListeElements_1.ObjetListeElements().add(aEleve),
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
		this._calculerMoyennes(aNumLigne, ANumColonne);
		if (this.Note && lNote.getNote() === this.Note.getNote()) {
			return;
		}
		this.param.callbackEvnt({
			genreEvnt:
				Enumere_EvenementSaisieNotes_1.EGenreEvenementSaisieNotes
					.SurDeselection,
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
						lEleveDevoir.Note
							? Enumere_Etat_1.EGenreEtat.Modification
							: Enumere_Etat_1.EGenreEtat.Creation,
					);
					lEleveDevoir.Note = aNote;
					const lDevoirRattrapage = this._getDevoirRattrapage(aDevoir);
					if (
						lDevoirRattrapage &&
						!this._avecSaisieRattrapage({
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
								lEleveDevoirRattrapage.Note = new TypeNote_1.TypeNote("");
								lDevoirRattrapage.setEtat(
									Enumere_Etat_1.EGenreEtat.Modification,
								);
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
					lDevoirRattrapage.listeEleves =
						new ObjetListeElements_1.ObjetListeElements();
					lDevoirRattrapage.objetListeEleves = {};
				}
				let lEleveDevoirRattrap =
					lDevoirRattrapage &&
					lDevoirRattrapage.objetListeEleves &&
					lDevoirRattrapage.objetListeEleves[aEleve.getNumero()]
						? lDevoirRattrapage.objetListeEleves[aEleve.getNumero()]
						: false;
				if (!lEleveDevoirRattrap) {
					lEleveDevoirRattrap = new ObjetElement_1.ObjetElement(
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
							? Enumere_Etat_1.EGenreEtat.Modification
							: Enumere_Etat_1.EGenreEtat.Creation,
					);
					lEleveDevoirRattrap.Note = aNote;
				}
				lDevoirRattrapage.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this._ajouteDevoirRattrapagePourSaisie(aDevoir, lDevoirRattrapage);
			}
		} else if (aGenreColonne === this.genreColonne.BonusMalus) {
			if (
				aEleve.listePeriodes
					.getElementParNumero(this.periode.getNumero())
					.bonusMalus.getNote() !== aNote.getNote()
			) {
				aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aEleve.listePeriodes.getElementParNumero(
					this.periode.getNumero(),
				).bonusMalus = aNote;
			}
		}
	}
	_ajouteDevoirRattrapagePourSaisie(aDevoir, aDevoirRattrapage) {
		if (aDevoir && aDevoirRattrapage) {
			if (!aDevoir.listeDevoirsRattrapage) {
				aDevoir.listeDevoirsRattrapage =
					new ObjetListeElements_1.ObjetListeElements();
			}
			const lIndiceDevoirDansListe =
				aDevoir.listeDevoirsRattrapage.getIndiceParNumeroEtGenre(
					aDevoirRattrapage.getNumero(),
				);
			if (lIndiceDevoirDansListe !== undefined) {
				aDevoir.listeDevoirsRattrapage.remove(lIndiceDevoirDansListe);
			}
			const lDevoirRattrapagePourListe =
				MethodesObjet_1.MethodesObjet.dupliquer(aDevoirRattrapage);
			aDevoir.listeDevoirsRattrapage.addElement(lDevoirRattrapagePourListe);
		}
	}
	avecSaisieSuperieurAuBareme() {
		return false;
	}
	surVerificationNote(aNumLigne, aGenreColonne, aDevoir, aNote) {
		let lValueNote = ObjetChaine_1.GChaine.ajouterEntites(aNote.getChaine());
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
				"^([0-9]*(,|\\.)[0-9]{" + TypeNote_1.TypeNote.decimalNotation + "}).*$",
			);
			lValueNote = lValueNote.replace(lRegExp, "$1");
		}
		let lNote = new TypeNote_1.TypeNote(lValueNote);
		let lNoteMin, lNoteMax;
		if (aGenreColonne === this.genreColonne.BonusMalus) {
			lNoteMin = new TypeNote_1.TypeNote(
				-1 * this.param.baremeParDefaut.getValeur(),
			);
			lNoteMax = new TypeNote_1.TypeNote(
				this.param.baremeParDefaut.getValeur(),
			);
		} else {
			lNoteMin = new TypeNote_1.TypeNote(0.0);
			lNoteMax = this.getNoteMaxDevoir(aDevoir);
		}
		if (
			(!lNote.estUneNoteValide(
				lNoteMin,
				lNoteMax,
				aGenreColonne !== this.genreColonne.BonusMalus,
				true,
			) &&
				ObjetChaine_1.GChaine.ajouterEntites(lNote.getChaine()) !== "-") ||
			(lNote.estUneAnnotation() &&
				!this.estUneAnnotationAutorisee(lNote.getGenre()))
		) {
			if (!this.Note.estUneNoteValide(lNoteMin, lNoteMax, true, true)) {
				lNote = new TypeNote_1.TypeNote("");
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
					Type_ThemeBouton_1.TypeThemeBouton.primaire +
					'" aria-haspopup="dialog">' +
					ObjetTraduction_1.GTraductions.getValeur("Notes.CreerDevoir") +
					"</ie-bouton></span>" +
					(this.param.avecImport
						? '<span class="GrandEspaceGauche"><ie-bouton ie-model="boutonImport" ie-selecfile ' +
							'class="' +
							Type_ThemeBouton_1.TypeThemeBouton.primaire +
							'">' +
							ObjetTraduction_1.GTraductions.getValeur("progression.importer") +
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
				TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.Promotion",
					),
				},
			],
			taille: 65,
		});
		if (this.avecColonneTDOption && this.avecColonneClasse) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.TDOption,
				genreColonne: this.genreColonne.TDOption,
				titre: [
					TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.TDOption",
						),
					},
				],
				taille: 70,
			});
		}
		if (
			!!this.param.optionsAffichage &&
			!!this.param.optionsAffichage.modeAffichageHeureAbsence &&
			!this.avecPeriodes &&
			this.periode.getNumero() !== 0
		) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.absences,
				genreColonne: this.genreColonne.Absences,
				titre: [
					TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.Absences",
						),
					},
				],
				taille: 60,
			});
		}
		lColonnes.push({
			id: DonneesListe_PageNotes.colonnes.moyenne,
			genreColonne: this.genreColonne.Moyenne,
			titre: [
				TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.Moyenne",
					),
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.Moyenne",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.TitreMoyenne",
					),
				},
			],
			taille: 61,
		});
		if (this.param.avecColNR) {
			lColonnes.push({
				id: DonneesListe_PageNotes.colonnes.moyNR,
				genreColonne: this.genreColonne.MoyNR,
				titre: [
					TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.TitreMoyNR",
						),
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.TitreMoyNR",
						),
						title: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.HintMoyNR",
						),
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
					TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.MoyAvRattrapageService",
						),
						libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
							"Notes.Colonne.MoyAvRattrapageService",
						),
						title: ObjetTraduction_1.GTraductions.getValeur(
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
				TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.MoyenneBrute",
					),
					libelleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.MoyenneBrute",
					),
					title: ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.TitreMoyenneBrute",
					),
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
							'<div class="Maigre"><div class="InlineBlock AlignementMilieuVertical" style="width: 6px; height: 12px;' +
							ObjetStyle_1.GStyle.composeCouleurFond(
								this.couleurPeriodes[i + 1]
									? this.couleurPeriodes[i + 1]
									: "transparent",
							) +
							ObjetStyle_1.GStyle.composeCouleurBordure(
								(0, AccessApp_1.getApp)().getCouleur().blanc,
								1,
							) +
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
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"PageNotes.MoyenneAbr",
							),
							libelleHtml:
								'<div class="Maigre">' +
								ObjetTraduction_1.GTraductions.getValeur(
									"PageNotes.MoyenneAbr",
								) +
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
									ObjetStyle_1.GStyle.composeCouleurFond(lGenre.couleur) +
									ObjetStyle_1.GStyle.composeCouleurBordure(
										(0, AccessApp_1.getApp)().getCouleur().blanc,
										1,
									) +
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
				: 'ie-node="getEditionDevoir(' +
					i +
					')" role="button" tabindex="0" aria-haspopup="dialog"';
			const lCategorieDevoir = !!lDevoir.categorie
				? lDevoir.categorie.getLibelle()
				: "";
			let lHint =
				lDevoir.service.matiere.getLibelle() +
				" \n" +
				ObjetDate_1.GDate.formatDate(lDevoir.date, "%JJ/%MM/%AAAA") +
				(lDevoir.commentaire ? " - " + lDevoir.commentaire : "") +
				"\n" +
				lCategorieDevoir +
				"\n" +
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Bareme") +
				" " +
				lDevoir.bareme.toString() +
				"\n" +
				ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Coefficient") +
				" " +
				lDevoir.coefficient.toString() +
				(lDevoir.executionQCM && lDevoir.executionQCM.existeNumero()
					? "\n" +
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.HintDevoirLieQCM",
						)
					: "") +
				(lDevoir.execKiosque && lDevoir.execKiosque.existeNumero()
					? "\n" +
						ObjetTraduction_1.GTraductions.getValeur(
							"QCM_Divers.HintDevoirLieKiosque",
						)
					: "");
			let lCouleurFacultatif = "transparent";
			if (lDevoir.commeUnBonus) {
				lCouleurFacultatif = (0, AccessApp_1.getApp)().getCouleur().devoir
					.commeUnBonus;
				lHint += `\n${ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.hintFacultativeBonus")}`;
			} else if (lDevoir.commeUneNote) {
				lCouleurFacultatif = (0, AccessApp_1.getApp)().getCouleur().devoir
					.commeUneNote;
				lHint += `\n${ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.hintFacultativeNote")}`;
			} else if (lDevoir.commeUnSeuil) {
				lCouleurFacultatif = (0, AccessApp_1.getApp)().getCouleur().devoir
					.commeUnSeuil;
				lHint += `\n${ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.hintFacultativeSeuil")}`;
			}
			const lTooltipBouton =
				ObjetTraduction_1.GTraductions.getValeur("Notes.ModificationDevoir") +
				" :\n" +
				lHint;
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
			let lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
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
					? '<i role="presentation" class="icon_qcm ThemeCat-pedagogie AlignementMilieuVertical"></i>'
					: lDevoir.execKiosque && lDevoir.execKiosque.existeNumero()
						? '<div class="Image_Kiosque_ListeDevoir InlineBlock AlignementMilieuVertical"></div>'
						: "";
			const lCouleurCategorie = !!lDevoir.categorie
				? '<div class="categorie-devoir" style="background-color:' +
					lDevoir.categorie.couleur +
					';"></div>'
				: "";
			const lAcronymDS = lDevoir.estDevoirSurveille
				? ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.DevoirSurveilleAbr",
					)
				: "";
			const lGetFormatAffichageDate = function (aDate) {
				return ObjetDate_1.GDate.dateEntreLesDates(
					aDate,
					ObjetDate_1.GDate.premiereDate,
					ObjetDate_1.GDate.derniereDate,
				)
					? "%JJ/%MM"
					: "%JJ/%MM/%AAAA";
			};
			const lDateDevoir = ObjetDate_1.GDate.formatDate(
				lDevoir.date,
				lGetFormatAffichageDate(lDevoir.date),
			);
			const lDateDevoirRattrapage = lDevoirRattrapage
				? ObjetDate_1.GDate.formatDate(
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
							? `${lSurEditionDevoir} aria-label="${lTooltipBouton}" data-tooltip`
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
							? IE.jsx.str("i", { class: "icon_lock", role: "presentation" })
							: "") +
						(lDevoirRattrapage
							? ' <div class="InlineBlock AlignementMilieuVertical EspaceGauche EspaceDroit">' +
								ObjetImage_1.GImage.composeImage(
									"Image_DevoirRefait",
									16,
									aPourImpression,
								) +
								"</div> " +
								lDateDevoirRattrapage
							: "") +
						(lDevoirRattrapageMoy
							? ' <span class="InlineBlock AlignementMilieuVertical" style="text-align:right;width:58px;">' +
								ObjetTraduction_1.GTraductions.getValeur(
									"PageNotes.MoyenneAbr",
								) +
								"</span>"
							: "") +
						(lDevoir.estDevoirSurveille
							? '<div style="' +
								(!aPourImpression
									? "position:absolute;top:0;right:0;margin-left: .5rem;"
									: "") +
								'" class="pseudo-icone-ds tiny" ie-hint="' +
								ObjetTraduction_1.GTraductions.getValeur(
									"DernieresNotes.DevoirSurveille",
								) +
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
				lTitres.push(
					this.getTitreBouton(lDevoir, i, lSurEditionDevoir, lTooltipBouton),
				);
			}
			if (lDevoir.service.getNumero() !== this.Service.getNumero()) {
				lTitres.push({
					libelle: lDevoir.service.matiere.getLibelle(),
					libelleHtml:
						"<div " +
						(lSurEditionDevoir
							? `${lSurEditionDevoir} aria-label="${lTooltipBouton}" data-tooltip`
							: "") +
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
						ObjetStyle_1.GStyle.composeCouleur(
							lCouleurFond,
							(0, AccessApp_1.getApp)()
								.getCouleur()
								.getCouleurCorrespondance(lCouleurFond),
						) +
						(!aPourImpression
							? "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; padding-top: 5px;"
							: "") +
						' overflow:hidden;">' +
						lIconeDevoir +
						'<div class="InlineBlock AlignementMilieuVertical">' +
						(lServiceRattrapage
							? '<span ie-hint="' +
								ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage") +
								'">' +
								ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage") +
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
						ObjetStyle_1.GStyle.composeCouleur(
							lCouleurFond,
							(0, AccessApp_1.getApp)()
								.getCouleur()
								.getCouleurCorrespondance(lCouleurFond),
						) +
						(!aPourImpression
							? "position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; padding-top: 5px;"
							: "") +
						' overflow:hidden;">' +
						lIconeDevoir +
						'<div class="InlineBlock AlignementMilieuVertical">' +
						(lServiceRattrapage
							? '<span ie-hint="' +
								ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage") +
								'">' +
								ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage") +
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
						? ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage")
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
								ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage") +
								'">' +
								ObjetTraduction_1.GTraductions.getValeur("Notes.Rattrapage") +
								"</span>"
							: lDevoir.coefficient.getCoefficientEntier() +
								(!lDevoir.bareme.egal(this.param.baremeParDefaut)
									? "-" + lDevoir.bareme.getBaremeEntier()
									: "")) +
						"</div></div>",
				});
			}
			const lTailleColDevoir = this.getTailleColonneDevoir();
			let lIdColDevoir = this._getIdByCol({
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
								TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
								TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
								TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
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
							TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
							TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
							TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
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
			!!this.param.optionsAffichage.modeAffichageHeureAbsence &&
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
					this._getIdByCol({
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
						this._getIdByCol({
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
						this._getIdByCol({
							id: DonneesListe_PageNotes.colonnes.moyenneGenreNotation,
							indice: i,
						}),
					);
				}
			}
		}
		lResult.push(DonneesListe_PageNotes.colonnes.bonusMalus);
		for (let i = 0, lNbr = this.listeDevoirs.count(); i < lNbr; i++) {
			let lIdColDevoir = this._getIdByCol({
				id: DonneesListe_PageNotes.colonnes.devoir,
				indice: i,
			});
			lResult.push(lIdColDevoir);
		}
		return lResult;
	}
	_estColDevoir(aParams) {
		if (
			aParams.declarationColonne.rangColonne !== undefined &&
			aParams.declarationColonne.genreColonne === this.genreColonne.Devoir
		) {
			return true;
		} else {
			return false;
		}
	}
	_estCellEditable(aParams) {
		const lEditable = this._estDonneeEditable(aParams);
		const lCloture = this._estDonneeCloture(aParams);
		return lEditable && !lCloture;
	}
	_estDonneeCloture(aParams) {
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
						let lClasse =
							this.param.listeClasses.getElementParNumero(lNumClasse);
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
	_estDonneeEditable(aParams) {
		const lEleve = aParams.article;
		if (this._estColDevoir(aParams)) {
			const lDevoir = this._getDevoir(aParams);
			const lEleveDevoir = this._getEleveDevoir(aParams);
			const lDevoirRattrapage = this._getDevoirRattrapage(lDevoir);
			if (
				lDevoirRattrapage &&
				aParams.declarationColonne.estRattrapageDevoir &&
				(!this._avecSaisieRattrapage({
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
					devoir: this._getDevoir(aParams),
					eleve: lEleve,
					eleveDevoir: this._getEleveDevoir(aParams),
					devoirDansPeriode: this.devoirDansPeriode.bind(this),
				});
			}
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.bonusMalus) {
			let lEstBonusEditable = this.Service.getActif();
			if (
				lEstBonusEditable &&
				"estServiceEditablePourPeriode" in this.Service
			) {
				lEstBonusEditable = !!this.Service.estServiceEditablePourPeriode;
			}
			return lEstBonusEditable;
		}
		if (aParams.idColonne === DonneesListe_PageNotes.colonnes.moyNR) {
			return lEleve.estMoyNREditable === true;
		}
		return false;
	}
	_avecSaisieRattrapage(aParams) {
		const lNote =
			aParams.eleveDevoir && aParams.eleveDevoir.Note
				? aParams.eleveDevoir.Note
				: new TypeNote_1.TypeNote("");
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
	_getDevoir(aParams) {
		return this.listeDevoirs.get(aParams.declarationColonne.rangColonne);
	}
	_getDevoirRattrapage(aDevoir) {
		return aDevoir.devoirRattrapage &&
			aDevoir.devoirRattrapage.existeNumero() &&
			aDevoir.devoirRattrapage.existe()
			? aDevoir.devoirRattrapage
			: null;
	}
	_getEleveDevoir(aParams) {
		if (
			this._getDevoir(aParams).listeEleves.getElementParNumero(
				aParams.article.Numero,
			) !== undefined
		) {
			return this._getDevoir(aParams).listeEleves.getElementParNumero(
				aParams.article.Numero,
			);
		} else {
			const lEleve = aParams.article;
			lEleve.Note = null;
			return lEleve;
		}
	}
	_getBonusMalus(aParam) {
		const lPeriodeBonus = aParam.listePeriodes.getElementParNumero(
			this.periode.getNumero(),
		);
		if (
			this._estBonusMalusConformeAbsences(
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
	_estBonusMalusConformeAbsences(aBonusMalus, aMalusAbsences) {
		return (
			aBonusMalus &&
			aMalusAbsences &&
			aBonusMalus.getValeur() !== 0 &&
			aBonusMalus.getValeur() === aMalusAbsences.getValeur()
		);
	}
	_estCellMethodeCalculMoyenne(D, aParam) {
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
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne
							.MoyenneAvRattrapageService
					].getValeur(),
				);
			case this.genreColonne.MoyenneBrute:
				return !isNaN(
					D.moyennes[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneBrute
					].getValeur(),
				);
			case this.genreColonne.MoyennePeriode:
				lNote =
					D.moyennes[
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyennePeriode -
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
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneSousService -
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
						MoteurNotesCP_1.MoteurNotesCP.genreMoyenne.MoyenneGenreNotation -
							aParam.declarationColonne.rangColonne
					].getValeur(),
				);
			default:
				return false;
		}
	}
	_getIdByCol(aCol) {
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
	_getColById(aId) {
		const lCol = {},
			lSplit = aId.split("_");
		lCol.id = aId;
		lCol.indice = null;
		if (lSplit[1] === "devoir") {
			lCol.id = DonneesListe_PageNotes.colonnes.devoir;
			lCol.indice = parseInt(lSplit[2]);
		}
		if (lSplit[1] === "moyennePeriode") {
			lCol.id = DonneesListe_PageNotes.colonnes.moyennePeriode;
			lCol.indice = parseInt(lSplit[2]);
		}
		if (lSplit[1] === "moyenneSousService") {
			lCol.id = DonneesListe_PageNotes.colonnes.moyenneSousService;
			lCol.indice = parseInt(lSplit[2]);
		}
		if (lSplit[1] === "moyenneGenreNotation") {
			lCol.id = DonneesListe_PageNotes.colonnes.moyenneGenreNotation;
			lCol.indice = parseInt(lSplit[2]);
		}
		return lCol;
	}
	_afficherCommePlusHaute(aNote, aService) {
		return (
			this.moteurNotesCP.getPonderationNotePlusHaute(aService) !== 1.0 &&
			aNote.estPlusHaute
		);
	}
	_afficherCommePlusBasse(aNote, aService) {
		return (
			this.moteurNotesCP.getPonderationNotePlusBasse(aService) !== 1.0 &&
			aNote.estPlusBasse
		);
	}
	estNotePonderee(aParams) {
		let lAfficherCommePlusBasseRattrap = false,
			lAfficherCommePlusHauteRattrap = false;
		let lAfficherCommePlusBasseMoyRattrap = false,
			lAfficherCommePlusHauteMoyRattrap = false;
		let lAfficherCommePlusHaute = this._afficherCommePlusHaute(
			aParams.note,
			this.Service,
		);
		if (lAfficherCommePlusHaute) {
			if (
				aParams.devoirRattrapage &&
				!aParams.devoirRattrapageMoy &&
				aParams.noteRattrapage.estUneValeur() &&
				(aParams.note.getValeur() <= aParams.noteRattrapage.getValeur() ||
					!aParams.note.estUneValeur())
			) {
				lAfficherCommePlusHauteRattrap = true;
				lAfficherCommePlusHaute = false;
			} else if (aParams.devoirRattrapage && aParams.devoirRattrapageMoy) {
				lAfficherCommePlusHauteMoyRattrap = true;
				lAfficherCommePlusHaute = false;
			}
		}
		let lAfficherCommePlusBasse = this._afficherCommePlusBasse(
			aParams.note,
			this.Service,
		);
		if (lAfficherCommePlusBasse) {
			if (
				aParams.devoirRattrapage &&
				!aParams.devoirRattrapageMoy &&
				aParams.noteRattrapage.estUneValeur() &&
				(aParams.note.getValeur() > aParams.noteRattrapage.getValeur() ||
					!aParams.note.estUneValeur())
			) {
				lAfficherCommePlusBasseRattrap = true;
				lAfficherCommePlusBasse = false;
			} else if (aParams.devoirRattrapage && aParams.devoirRattrapageMoy) {
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
				return true;
			}
		} else if (aParams.declarationColonne.estRattrapageDevoir) {
			if (lAfficherCommePlusHauteRattrap || lAfficherCommePlusBasseRattrap) {
				return true;
			}
		} else {
			if (lAfficherCommePlusHaute || lAfficherCommePlusBasse) {
				return true;
			}
		}
		return false;
	}
	_estExecKiosque(aEleveDevoir) {
		return aEleveDevoir && aEleveDevoir.execKiosque
			? aEleveDevoir.execKiosque
			: false;
	}
	_getServiceOuSousServiceDeLaColonneMoyenne(aIndiceColonne) {
		let lServiceConcernee = null;
		if (
			this.avecSousServices &&
			!!this.Service &&
			!!this.Service.listeServices
		) {
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
	_calculerMoyennes(ANumLigne, ANumColonne) {
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
		const lListeElevesSelection = new ObjetListeElements_1.ObjetListeElements();
		for (let I = lDebEleve; I < lFinEleve; I++) {
			lListeElevesSelection.addElement(this.Donnees.get(I));
		}
		const lListeDevoirsSelection =
			new ObjetListeElements_1.ObjetListeElements();
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
	devoirDansPeriode(aDevoir, aEleve, lNumPeriode) {
		return false;
	}
	eleveDansDevoir(aEleve, aDevoir) {
		return null;
	}
}
exports.DonneesListe_PageNotes = DonneesListe_PageNotes;
(function (DonneesListe_PageNotes) {
	let colonnes;
	(function (colonnes) {
		colonnes["eleves"] = "pageNotes_eleves";
		colonnes["classe"] = "pageNotes_classe";
		colonnes["TDOption"] = "pageNotes_TDOption";
		colonnes["absences"] = "pageNotes_absences";
		colonnes["moyenne"] = "pageNotes_moyenne";
		colonnes["moyenneAvRattrapageService"] =
			"pageNotes_moyenneAvRattrapageService";
		colonnes["moyenneBrute"] = "pageNotes_moyenneBrute";
		colonnes["moyennePeriode"] = "pageNotes_moyennePeriode";
		colonnes["moyenneSousService"] = "pageNotes_moyenneSousService";
		colonnes["moyenneGenreNotation"] = "pageNotes_moyenneGenreNotation";
		colonnes["bonusMalus"] = "pageNotes_bonusMalus";
		colonnes["devoir"] = "pageNotes_devoir";
		colonnes["moyNR"] = "pageNotes_moyNR";
	})(
		(colonnes =
			DonneesListe_PageNotes.colonnes ||
			(DonneesListe_PageNotes.colonnes = {})),
	);
})(
	DonneesListe_PageNotes ||
		(exports.DonneesListe_PageNotes = DonneesListe_PageNotes = {}),
);
