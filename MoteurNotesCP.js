exports.MoteurNotesCP = void 0;
const Enumere_EleveDansDevoir_1 = require("Enumere_EleveDansDevoir");
const TypeNote_1 = require("TypeNote");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_RessourceArrondi_1 = require("Enumere_RessourceArrondi");
const TypeArrondi_1 = require("TypeArrondi");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const AccessApp_1 = require("AccessApp");
const Enumere_Action_1 = require("Enumere_Action");
const MethodesObjet_1 = require("MethodesObjet");
class MoteurNotesCP {
	constructor(aMoteurNotes) {
		this.genreMessage = {
			ElevePasDansClasse: 1,
			ElevePasDansClasseOuGroupe: 2,
			ElevePasDansPeriode: 3,
			PeriodeCloturee: 4,
			DevoirVerrouille: 5,
		};
		if (aMoteurNotes) {
			this.MoteurNotes = aMoteurNotes;
			this.genreRattrapage = this.MoteurNotes.genreRattrapage;
		}
	}
	estMoteurHP(aMoteur) {
		return aMoteur.estMoteurHP;
	}
	getMoteurNotesProduit() {
		return this.MoteurNotes;
	}
	controlerDevoirs(aParam) {
		const lResult = { avecTrimestre: false, avecSemestre: false };
		aParam.listeDevoirs.parcourir((aDevoir) => {
			aDevoir.dansPeriode = [];
			aDevoir.dansPeriode[0] = [true];
			aDevoir.listeClasses.parcourir((aClasseDevoir) => {
				if (aClasseDevoir) {
					aDevoir.dansPeriode[aClasseDevoir.getNumero()] = [true];
					aClasseDevoir.listePeriodes.parcourir((aPeriodeDevoir) => {
						const lNumPeriodeDevoir = aPeriodeDevoir.getNumero();
						aDevoir.dansPeriode[0][lNumPeriodeDevoir] = true;
						aDevoir.dansPeriode[aClasseDevoir.getNumero()][lNumPeriodeDevoir] =
							true;
						if (GParametres.estPeriodeTrimestrielle(lNumPeriodeDevoir)) {
							lResult.avecTrimestre = true;
						}
						if (GParametres.estPeriodeSemestrielle(lNumPeriodeDevoir)) {
							lResult.avecSemestre = true;
						}
					});
				}
			});
			aDevoir.objetListeEleves = {};
			aDevoir.listeEleves.parcourir((aEleveDevoir) => {
				aDevoir.objetListeEleves[aEleveDevoir.getNumero()] = aEleveDevoir;
			});
		});
		return lResult;
	}
	controlerElevesDansDevoir(aParam) {
		aParam.listeEleves.parcourir((aEleve) => {
			aEleve.dansDevoir = [];
			aParam.listeDevoirs.parcourir((aDevoir) => {
				aEleve.dansDevoir[aDevoir.getNumero()] =
					aParam.clbckEleveDansDevoir.call(null, aEleve, aDevoir);
			});
		});
	}
	getGenreEleveDansDevoir(aParam) {
		if (
			aParam.eleve === null ||
			aParam.eleve === undefined ||
			aParam.eleve.dansDevoir === null ||
			aParam.eleve.dansDevoir === undefined ||
			aParam.devoir === null ||
			aParam.devoir === undefined
		) {
			return Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non;
		}
		return aParam.eleve.dansDevoir[aParam.devoir.getNumero()];
	}
	estEleveDansDevoirDeGenre(aParam) {
		const lGenreEleveDansDevoir = this.getGenreEleveDansDevoir(aParam);
		return lGenreEleveDansDevoir === aParam.genreEleveDansDevoir;
	}
	getServiceDuDevoir(aParam) {
		const lService = aParam.service.listeServices
			? aParam.service.listeServices.getElementParNumero(
					aParam.devoir.service.getNumero(),
				)
			: null;
		return lService ? lService : aParam.service;
	}
	getPeriodeDuService(aService, aNumeroPeriode) {
		return aNumeroPeriode === null || aNumeroPeriode === undefined
			? aService.periode
			: aService.listePeriodes.getElementParNumero(aNumeroPeriode);
	}
	getBaremeDuDevoir(aDevoir) {
		return aDevoir && aDevoir.bareme && aDevoir.bareme.estUneValeur()
			? aDevoir.bareme.getValeur()
			: 20;
	}
	getNoteMaximaleDeDevoir(aDevoir) {
		return this.MoteurNotes && this.estMoteurHP(this.MoteurNotes)
			? this.getBaremeDuDevoir(aDevoir)
			: this.getBaremeDevoirMaximal();
	}
	afficherConfirmationSaisieNoteAuDessusBareme(aNote, aNoteMax) {
		return (0, AccessApp_1.getApp)()
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: ObjetTraduction_1.GTraductions.getValeur(
					"Notes.Message.NoteSuperieureAuBareme",
					[aNote + "", aNoteMax + ""],
				),
				avecDecalageFocusBouton: true,
			})
			.then((aGenreAction) => {
				return aGenreAction === Enumere_Action_1.EGenreAction.Valider;
			});
	}
	afficherCommeUnBonus(aParam) {
		let lStrictementInferieur = false;
		let lValeurSeuil = aParam.devoir.bareme.getValeur() / 2.0;
		if (aParam.devoir.commeUnSeuil) {
			lValeurSeuil =
				(GParametres.seuilNotation.getValeur() /
					GParametres.baremeNotation.getValeur()) *
				aParam.devoir.bareme.getValeur();
			lStrictementInferieur = true;
		}
		let lAfficherCommeBonus = false;
		if (aParam.note && aParam.note.estUneValeur()) {
			if (
				aParam.devoir.commeUnBonus ||
				aParam.devoir.commeUnSeuil ||
				this.getServiceDuDevoir({
					devoir: aParam.devoir,
					service: aParam.service,
				}).periode.avecDevoirSupMoy
			) {
				lAfficherCommeBonus =
					(!lStrictementInferieur && aParam.note.getValeur() <= lValeurSeuil) ||
					(lStrictementInferieur && aParam.note.getValeur() < lValeurSeuil);
			}
		}
		return lAfficherCommeBonus;
	}
	strTitreEleves(aNbrEtudiants) {
		if (aNbrEtudiants === null || aNbrEtudiants === undefined) {
			return "";
		}
		return (
			aNbrEtudiants +
			" " +
			ObjetTraduction_1.GTraductions.getValeur(
				aNbrEtudiants > 1 ? "Etudiants" : "Etudiant",
			).toLowerCase()
		);
	}
	estNoteEditable(aParam) {
		return (
			aParam.actif &&
			aParam.eleveDevoir &&
			aParam.eleveDevoir.Actif &&
			aParam.eleveDevoir.Note &&
			this.estEleveDansDevoirDeGenre({
				eleve: aParam.eleve,
				devoir: aParam.devoir,
				genreEleveDansDevoir:
					Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Oui,
			}) &&
			!aParam.devoir.verrouille &&
			aParam.devoir.estDevoirEditable !== false &&
			aParam.devoirDansPeriode(aParam.devoir, aParam.eleve) &&
			(!this.MoteurNotes.estMoteurHP ||
				(this.estMoteurHP(this.MoteurNotes) &&
					this.MoteurNotes.avecDroitsSaisie()))
		);
	}
	getNote(estNoteExistante, aEleveDevoir) {
		return estNoteExistante === true
			? aEleveDevoir && aEleveDevoir.Note
				? aEleveDevoir.Note
				: new TypeNote_1.TypeNote("")
			: null;
	}
	estNoteExistante(aParam) {
		if (
			!aParam.eleveDevoir ||
			!aParam.eleveDevoir.Note ||
			!aParam.devoirDansPeriode(aParam.devoir, aParam.eleve) ||
			this.estEleveDansDevoirDeGenre({
				eleve: aParam.eleve,
				devoir: aParam.devoir,
				genreEleveDansDevoir:
					Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non,
			}) ||
			this.estEleveDansDevoirDeGenre({
				eleve: aParam.eleve,
				devoir: aParam.devoir,
				genreEleveDansDevoir:
					Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Jamais,
			})
		) {
			return false;
		}
		return true;
	}
	getGenreMsgNoteNonEditable(aParam) {
		if (!aParam.eleveDevoir || !aParam.eleveDevoir.Note) {
			return this.genreMessage.ElevePasDansClasseOuGroupe;
		}
		if (
			this.estEleveDansDevoirDeGenre({
				eleve: aParam.eleve,
				devoir: aParam.devoir,
				genreEleveDansDevoir:
					Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Non,
			}) ||
			this.estEleveDansDevoirDeGenre({
				eleve: aParam.eleve,
				devoir: aParam.devoir,
				genreEleveDansDevoir:
					Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Jamais,
			})
		) {
			return this.genreMessage.ElevePasDansClasse;
		}
		if (!aParam.devoirDansPeriode(aParam.devoir, aParam.eleve)) {
			return this.genreMessage.ElevePasDansPeriode;
		}
		if (aParam.eleveDevoir && aParam.eleveDevoir.Actif) {
			if (aParam.devoir.verrouille) {
				return this.genreMessage.DevoirVerrouille;
			}
		} else {
			return this.genreMessage.PeriodeCloturee;
		}
		return null;
	}
	getMsgNoteNonEditable(aParam) {
		const lGenreMessage = this.getGenreMsgNoteNonEditable(aParam);
		if (lGenreMessage !== null && lGenreMessage !== undefined) {
			return this.getMessage(lGenreMessage);
		} else {
			return "";
		}
	}
	getMessage(aGenreMessage) {
		switch (aGenreMessage) {
			case this.genreMessage.ElevePasDansClasse:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Notes.Message.EleveNonNotable",
				);
			case this.genreMessage.ElevePasDansClasseOuGroupe:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PageNotes.ElevePasDansClasseOuGroupe",
				);
			case this.genreMessage.ElevePasDansPeriode:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PageNotes.ElevePasDansPeriode",
				);
			case this.genreMessage.PeriodeCloturee:
				return ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee");
			case this.genreMessage.DevoirVerrouille:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Notes.Message.DevoirVerrouille",
				);
			default:
				return "";
		}
	}
	strBareme(aBareme, avecDecimales) {
		let lBareme = aBareme.getValeur();
		if (avecDecimales) {
			if (lBareme !== Math.floor(lBareme)) {
				lBareme = aBareme.getNote();
			}
		}
		return lBareme;
	}
	controlerNote(aValue, aMin, aMax) {
		const lNote = new TypeNote_1.TypeNote(aValue);
		const lNoteMin = new TypeNote_1.TypeNote(aMin);
		const lNoteMax = new TypeNote_1.TypeNote(aMax);
		const lEstValide = lNote.estUneNoteValide(lNoteMin, lNoteMax, false, false);
		return {
			estValide: lEstValide,
			msgInfoNoteInvalide: ObjetChaine_1.GChaine.format(
				ObjetTraduction_1.GTraductions.getValeur(
					"FenetreDevoir.ValeurComprise",
				),
				[lNoteMin.getNote(), lNoteMax.getNote()],
			),
			note: lEstValide ? lNote : null,
		};
	}
	getMaxLengthBareme(aAvecDecimales) {
		return 3 + (aAvecDecimales ? 1 + TypeNote_1.TypeNote.decimalNotation : 0);
	}
	getBaremeDevoirMaximal() {
		return GParametres.baremeMaxDevoirs
			? GParametres.baremeMaxDevoirs.getValeur()
			: 100.0;
	}
	surEditionBareme(aValue, aDevoir, aEnCreation, aClbckConfirm) {
		const lControleBareme = this.controlerNote(
			aValue,
			1.0,
			this.getBaremeDevoirMaximal(),
		);
		if (!lControleBareme.estValide) {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({ message: lControleBareme.msgInfoNoteInvalide });
		} else {
			const lNote = lControleBareme.note;
			if (
				lNote &&
				lNote.getValeur() < aDevoir.bareme.getValeur() &&
				!aEnCreation
			) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message:
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.AvertissementChangementDeBareme1",
								[lNote.getValeur()],
							) +
							"<br />" +
							"<br />" +
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreDevoir.ConfirmerChangementDeBareme",
							),
						callback: function (aBouton) {
							if (aBouton === 0) {
								aClbckConfirm(lNote);
							}
						},
					});
				return;
			} else if (lNote) {
				aClbckConfirm(lNote);
			}
		}
	}
	_autoriseSujetEtCorrigeDevoir(aParam) {
		return !(
			aParam.avecQCM &&
			aParam.devoir &&
			aParam.devoir.executionQCM &&
			aParam.devoir.executionQCM.existeNumero()
		);
	}
	_avecSujetDevoir(aParam) {
		return (
			aParam.devoir &&
			aParam.devoir.listeSujets &&
			aParam.devoir.listeSujets.getNbrElementsExistes() > 0
		);
	}
	_avecCorrigeDevoir(aParam) {
		return (
			aParam.devoir &&
			aParam.devoir.listeCorriges &&
			aParam.devoir.listeCorriges.getNbrElementsExistes() > 0
		);
	}
	devoirExiste(aParam) {
		const lDevoir = aParam.devoir;
		const lPeriode = aParam.periode;
		if (!lDevoir.existe()) {
			return false;
		}
		for (let I = 0; I < lDevoir.listeClasses.count(); I++) {
			const lClasseDevoir = lDevoir.listeClasses.get(I);
			for (let J = 0; J < lClasseDevoir.listePeriodes.count(); J++) {
				const lPeriodeDevoir = lClasseDevoir.listePeriodes.get(J);
				if (!lPeriode.existeNumero()) {
					return GParametres.estPeriodeOfficielle(lPeriodeDevoir.getNumero());
				} else if (lPeriodeDevoir.getNumero() === lPeriode.getNumero()) {
					return true;
				} else if (
					lPeriode.listePeriodesNotation &&
					lPeriode.listePeriodesNotation.getElementParNumero(
						lPeriodeDevoir.getNumero(),
					)
				) {
					return true;
				}
			}
		}
		return false;
	}
	getMoyenneNotesRattrapage(aNoteDevoir, aNoteRattrapage, aSeuil) {
		if (
			aNoteDevoir &&
			!aNoteDevoir.estUneNoteVide() &&
			aNoteRattrapage &&
			!aNoteRattrapage.estUneNoteVide()
		) {
			if (!aNoteDevoir.estUneValeur() && !aNoteRattrapage.estUneValeur()) {
				return aNoteDevoir;
			} else if (!aNoteDevoir.estUneValeur()) {
				return new TypeNote_1.TypeNote(aNoteRattrapage.getValeur());
			} else if (!aNoteRattrapage.estUneValeur()) {
				return new TypeNote_1.TypeNote(aNoteDevoir.getValeur());
			} else if (aNoteDevoir.getValeur() >= aSeuil.getValeur()) {
				return aNoteDevoir;
			} else {
				return new TypeNote_1.TypeNote(
					(aNoteDevoir.getValeur() + aNoteRattrapage.getValeur()) / 2,
				);
			}
		} else if (aNoteDevoir && !aNoteDevoir.estUneNoteVide()) {
			return aNoteDevoir;
		} else if (aNoteRattrapage && !aNoteRattrapage.estUneNoteVide()) {
			return aNoteRattrapage;
		} else {
			return new TypeNote_1.TypeNote("");
		}
	}
	calculerMoyennesGenerales(aParam) {
		const lMoy = [];
		let lArrondi = _getArrondiDePeriodePourGenre.call(
			this,
			aParam.service.periode,
			Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion,
		);
		const lDefault = {
			arrondi: null,
			listeEleves: aParam.listeEleves,
			listeDevoirs: aParam.listeDevoirs,
			affichageAnciensEleves: aParam.affichageAnciensEleves,
			baremeParDefaut: aParam.baremeParDefaut,
		};
		lMoy[MoteurNotesCP.genreMoyenne.Moyenne] = this.getMoyenneClasse(
			$.extend({}, lDefault, {
				genreMoyenne: MoteurNotesCP.genreMoyenne.Moyenne,
				arrondi: lArrondi,
				avecPeriode: aParam.avecPeriode,
				avecSousServices: aParam.avecSousServices,
			}),
		);
		lMoy[MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService] =
			this.getMoyenneClasse(
				$.extend({}, lDefault, {
					genreMoyenne: MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService,
				}),
			);
		lMoy[MoteurNotesCP.genreMoyenne.MoyenneBrute] = this.getMoyenneClasse(
			$.extend({}, lDefault, {
				genreMoyenne: MoteurNotesCP.genreMoyenne.MoyenneBrute,
			}),
		);
		if (aParam.avecTotalMoyNR === true) {
			lMoy[MoteurNotesCP.genreMoyenne.MoyenneNR] = this.getMoyenneClasse(
				$.extend({}, lDefault, {
					genreMoyenne: MoteurNotesCP.genreMoyenne.MoyenneNR,
				}),
			);
		}
		let lIdMoy;
		if (aParam.avecGenreNotation) {
			const lListeGenreNotation =
				aParam.service.listeGenreNotation ||
				aParam.service.pere.listeGenreNotation;
			for (let i = 0, lNbr = lListeGenreNotation.count(); i < lNbr; i++) {
				lIdMoy = MoteurNotesCP.genreMoyenne.MoyenneGenreNotation - i;
				lMoy[lIdMoy] = this.getMoyenneClasse(
					$.extend({}, lDefault, { genreMoyenne: lIdMoy }),
				);
			}
		}
		for (let i = aParam.debPeriode; i < aParam.finPeriode; i++) {
			lIdMoy = MoteurNotesCP.genreMoyenne.MoyennePeriode - i;
			lMoy[lIdMoy] = this.getMoyenneClasse(
				$.extend({}, lDefault, {
					genreMoyenne: lIdMoy,
					service: aParam.service,
					numeroPeriode:
						aParam.titrePeriodes && aParam.titrePeriodes.length > 0
							? aParam.titrePeriodes[i].getNumero()
							: aParam.periode
								? aParam.periode.getNumero()
								: 0,
					indicePeriode: i,
					devoirDansPeriode: aParam.devoirDansPeriode,
				}),
			);
		}
		for (let i = aParam.debService; i < aParam.finService; i++) {
			const lService = aParam.avecSousServices
				? aParam.service.listeServices.get(i)
				: aParam.service;
			lArrondi = _getArrondiDePeriodePourGenre.call(
				this,
				lService.periode,
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion,
			);
			lIdMoy = MoteurNotesCP.genreMoyenne.MoyenneSousService - i;
			lMoy[lIdMoy] = this.getMoyenneClasse(
				$.extend({}, lDefault, {
					genreMoyenne: lIdMoy,
					arrondi: lArrondi,
					numeroPeriode: aParam.periode.getNumero(),
					numeroService: lService.getNumero(),
					indiceService: i,
					devoirDansPeriode: aParam.devoirDansPeriode,
				}),
			);
		}
		return lMoy;
	}
	getMoyenneClasse(aParam) {
		let lMoyenne = 0;
		let lBareme = 0;
		let lNbrMoyNR = 0;
		const lNbrEleves = aParam.listeEleves.count();
		for (let I = 0; I < lNbrEleves; I++) {
			const lEleve = aParam.listeEleves.get(I);
			if (!aParam.affichageAnciensEleves && lEleve.estAncienEleve === true) {
				continue;
			}
			let lNote = lEleve.moyennes[aParam.genreMoyenne];
			let lNoteEleveRattrapageService;
			if (aParam.genreMoyenne === MoteurNotesCP.genreMoyenne.MoyenneNR) {
				if (lEleve.estMoyNR === true) {
					lNbrMoyNR++;
				}
			}
			if (aParam.genreMoyenne === MoteurNotesCP.genreMoyenne.Moyenne) {
				lNoteEleveRattrapageService = this.getNoteRattrapageServiceDEleve({
					eleve: lEleve,
					listeDevoirs: aParam.listeDevoirs,
					baremeParDefaut: aParam.baremeParDefaut,
				});
				if (
					!aParam.avecPeriode &&
					!aParam.avecSousServices &&
					!!lNoteEleveRattrapageService &&
					!lNoteEleveRattrapageService.estUneNoteVide() &&
					(!lNoteEleveRattrapageService.estUneAnnotation() ||
						(this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
							lNoteEleveRattrapageService.getValeur() >
								aParam.baremeParDefaut.getValeur()))
				) {
					lNote = lNoteEleveRattrapageService;
				}
			}
			if (!!aParam.numeroPeriode && !aParam.numeroService) {
				if (
					!aParam.service.listeServices ||
					(aParam.service.listeServices &&
						!aParam.service.listeServices.count())
				) {
					lNoteEleveRattrapageService =
						this.getNoteRattrapageServiceDElevePeriode({
							eleve: lEleve,
							listeDevoirs: aParam.listeDevoirs,
							numeroPeriode: aParam.numeroPeriode,
							indicePeriode: aParam.indicePeriode,
							devoirDansPeriode: aParam.devoirDansPeriode,
							baremeParDefaut: aParam.baremeParDefaut,
						});
					if (
						!!lNoteEleveRattrapageService &&
						!lNoteEleveRattrapageService.estUneNoteVide() &&
						(!lNoteEleveRattrapageService.estUneAnnotation() ||
							(this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
								lNoteEleveRattrapageService.getValeur() >
									aParam.baremeParDefaut.getValeur()))
					) {
						lNote = lNoteEleveRattrapageService;
					}
				}
			}
			if (!!aParam.numeroPeriode && !!aParam.numeroService) {
				lNoteEleveRattrapageService =
					this.getNoteRattrapageServiceDEleveSousService({
						eleve: lEleve,
						listeDevoirs: aParam.listeDevoirs,
						numeroPeriode: aParam.numeroPeriode,
						numeroService: aParam.numeroService,
						indiceService: aParam.indiceService,
						devoirDansPeriode: aParam.devoirDansPeriode,
						baremeParDefaut: aParam.baremeParDefaut,
					});
				if (
					!!lNoteEleveRattrapageService &&
					!lNoteEleveRattrapageService.estUneNoteVide() &&
					(!lNoteEleveRattrapageService.estUneAnnotation() ||
						(this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
							lNoteEleveRattrapageService.getValeur() >
								aParam.baremeParDefaut.getValeur()))
				) {
					lNote = lNoteEleveRattrapageService;
				}
			}
			if (lNote !== null && lNote !== undefined && lNote.estUneValeur()) {
				lMoyenne += lNote.getValeur();
				lBareme += 1;
			}
		}
		if (aParam.genreMoyenne === MoteurNotesCP.genreMoyenne.MoyenneNR) {
			return lNbrMoyNR.toString();
		}
		const lArrondi = aParam.arrondi
			? aParam.arrondi
			: new TypeArrondi_1.TypeArrondi(0);
		let LMoyenneClasse;
		if (lBareme) {
			const lValeurMoyenneClasse = lMoyenne / lBareme;
			if (
				this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
				lValeurMoyenneClasse > aParam.baremeParDefaut.getValeur()
			) {
				LMoyenneClasse = new TypeNote_1.TypeNote(
					this.MoteurNotes.createChaineAnnotationFelicitation(
						aParam.baremeParDefaut.getValeur(),
					),
				);
			} else {
				LMoyenneClasse = new TypeNote_1.TypeNote(
					lArrondi.arrondir(lValeurMoyenneClasse),
				);
			}
		} else {
			LMoyenneClasse = new TypeNote_1.TypeNote("");
		}
		return LMoyenneClasse;
	}
	calculerMoyennesDevoir(aParam) {
		const lDevoir = aParam.devoir;
		if (this.devoirExiste({ devoir: lDevoir, periode: aParam.periode })) {
			lDevoir.Moyenne = this.getMoyenneDevoir({
				devoir: aParam.devoir,
				listeEleves: aParam.listeEleves,
				affichageAnciensEleves: aParam.affichageAnciensEleves,
				devoirDansPeriode: aParam.devoirDansPeriode,
				baremeParDefaut: aParam.baremeParDefaut,
			});
			if (
				lDevoir.devoirRattrapage &&
				lDevoir.devoirRattrapage.existe() &&
				lDevoir.devoirRattrapage.existeNumero()
			) {
				lDevoir.devoirRattrapage.Moyenne =
					this.getMoyenneDevoirRattrapage(aParam);
				if (
					lDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(this.genreRattrapage.GR_Moyenne)
				) {
					lDevoir.devoirRattrapage.MoyenneGenreMoyenne =
						this.getMoyenneDevoirRattrapageMoyenne(aParam);
				}
			}
		}
	}
	getMoyenneDevoirRattrapage(aParam, APourMoyenneBrute) {
		let LMoyenne = 0;
		let LBareme = 0;
		const LDevoir = aParam.devoir;
		const LDevoirRattrapage = aParam.devoir.devoirRattrapage;
		const lNbrEleves = aParam.listeEleves.count();
		for (let I = 0; I < lNbrEleves; I++) {
			const lEleve = aParam.listeEleves.get(I);
			if (!aParam.affichageAnciensEleves && lEleve.estAncienEleve === true) {
				continue;
			}
			const LEleveDevoir = LDevoir.objetListeEleves[lEleve.getNumero()];
			const LEleveDevoirRattrapage =
				LDevoirRattrapage.objetListeEleves[lEleve.getNumero()];
			if (
				LEleveDevoirRattrapage &&
				LEleveDevoir &&
				((this.estNotePourMoyenne({
					eleveDevoir: LEleveDevoir,
					eleve: lEleve,
					devoir: LDevoir,
					devoirDansPeriode: aParam.devoirDansPeriode,
				}) &&
					LEleveDevoir.Note.getValeur() <
						LDevoirRattrapage.noteSeuil.getValeur()) ||
					(!LEleveDevoir.Note.estUneNoteVide() &&
						isNaN(LEleveDevoir.Note.getValeur())) ||
					LDevoirRattrapage.genreRattrapage ===
						this.MoteurNotes.getGenreRattrapage(
							this.genreRattrapage.GR_RattrapageService,
						)) &&
				LEleveDevoirRattrapage.Note &&
				!isNaN(LEleveDevoirRattrapage.Note.getValeur())
			) {
				const LCoefficientRamenerSur20 =
					APourMoyenneBrute || !LDevoir.ramenerSur20
						? 1
						: aParam.baremeParDefaut.getValeur() / LDevoir.bareme.getValeur();
				LMoyenne +=
					LCoefficientRamenerSur20 * LEleveDevoirRattrapage.Note.getValeur();
				LBareme += LCoefficientRamenerSur20 * LDevoir.bareme.getValeur();
			}
		}
		let LMoyenneDevoirRattrapage;
		if (LBareme) {
			const lValeurMoyenneDevoirRatt =
				(LDevoir.bareme.getValeur() * LMoyenne) / LBareme;
			if (
				this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
				lValeurMoyenneDevoirRatt > LDevoir.bareme.getValeur()
			) {
				LMoyenneDevoirRattrapage = new TypeNote_1.TypeNote(
					this.MoteurNotes.createChaineAnnotationFelicitation(
						LDevoir.bareme.getValeur(),
					),
				);
			} else {
				LMoyenneDevoirRattrapage = new TypeNote_1.TypeNote(
					new TypeArrondi_1.TypeArrondi(0).arrondir(lValeurMoyenneDevoirRatt),
				);
			}
		} else {
			LMoyenneDevoirRattrapage = new TypeNote_1.TypeNote("");
		}
		return LMoyenneDevoirRattrapage;
	}
	getMoyenneDevoirRattrapageMoyenne(aParam, APourMoyenneBrute) {
		let LBareme = 0;
		let LMoyenne = 0;
		const LDevoir = aParam.devoir;
		const LDevoirRattrapage = aParam.devoir.devoirRattrapage;
		const lNbrEleves = aParam.listeEleves.count();
		for (let I = 0; I < lNbrEleves; I++) {
			const lEleve = aParam.listeEleves.get(I);
			if (!aParam.affichageAnciensEleves && lEleve.estAncienEleve === true) {
				continue;
			}
			const LEleveDevoir = LDevoir.objetListeEleves[lEleve.getNumero()];
			const LEleveDevoirRattrapage =
				LDevoirRattrapage.objetListeEleves[lEleve.getNumero()];
			if (
				LEleveDevoirRattrapage &&
				LEleveDevoir &&
				(this.estNotePourMoyenne({
					eleveDevoir: LEleveDevoir,
					eleve: lEleve,
					devoir: LDevoir,
					devoirDansPeriode: aParam.devoirDansPeriode,
				}) ||
					(!LEleveDevoir.Note.estUneNoteVide() &&
						isNaN(LEleveDevoir.Note.getValeur()))) &&
				LEleveDevoirRattrapage.Note
			) {
				const LCoefficientRamenerSur20 =
					APourMoyenneBrute || !LDevoir.ramenerSur20
						? 1
						: aParam.baremeParDefaut.getValeur() / LDevoir.bareme.getValeur();
				LMoyenne +=
					LCoefficientRamenerSur20 *
					this.getMoyenneNotesRattrapage(
						LEleveDevoir.Note,
						LEleveDevoirRattrapage.Note,
						LDevoir.devoirRattrapage.noteSeuil,
					).getValeur();
				LBareme += LCoefficientRamenerSur20 * LDevoir.bareme.getValeur();
			}
		}
		let LMoyenneDevoirRattrapageMoyenne;
		if (LBareme) {
			const lValeurMoyenneDevoirRatt =
				(LDevoir.bareme.getValeur() * LMoyenne) / LBareme;
			if (
				this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
				lValeurMoyenneDevoirRatt > LDevoir.bareme.getValeur()
			) {
				LMoyenneDevoirRattrapageMoyenne = new TypeNote_1.TypeNote(
					this.MoteurNotes.createChaineAnnotationFelicitation(
						LDevoir.bareme.getValeur(),
					),
				);
			} else {
				LMoyenneDevoirRattrapageMoyenne = new TypeNote_1.TypeNote(
					new TypeArrondi_1.TypeArrondi(0).arrondir(lValeurMoyenneDevoirRatt),
				);
			}
		} else {
			LMoyenneDevoirRattrapageMoyenne = new TypeNote_1.TypeNote("");
		}
		return LMoyenneDevoirRattrapageMoyenne;
	}
	getMoyenneDevoir(aParam) {
		let LBareme = 0;
		let LMoyenne = 0;
		const LDevoir = aParam.devoir;
		const lNbrEleves = aParam.listeEleves.count();
		for (let I = 0; I < lNbrEleves; I++) {
			const lEleve = aParam.listeEleves.get(I);
			if (!aParam.affichageAnciensEleves && lEleve.estAncienEleve === true) {
				continue;
			}
			const LEleveDevoir = LDevoir.objetListeEleves[lEleve.getNumero()];
			if (
				LEleveDevoir &&
				this.estNotePourMoyenne({
					devoir: LDevoir,
					eleve: lEleve,
					eleveDevoir: LEleveDevoir,
					devoirDansPeriode: aParam.devoirDansPeriode,
				}) &&
				LEleveDevoir.Note &&
				LEleveDevoir.Note.estUneValeur()
			) {
				const LCoefficientRamenerSur20 =
					aParam.pourMoyenneBrute || !LDevoir.ramenerSur20
						? 1
						: aParam.baremeParDefaut.getValeur() / LDevoir.bareme.getValeur();
				LMoyenne += LCoefficientRamenerSur20 * LEleveDevoir.Note.getValeur();
				LBareme += LCoefficientRamenerSur20 * LDevoir.bareme.getValeur();
			}
		}
		let LMoyenneDevoir;
		if (LBareme) {
			const lValeurMoyenneDevoir =
				(LDevoir.bareme.getValeur() * LMoyenne) / LBareme;
			if (
				this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
				lValeurMoyenneDevoir > LDevoir.bareme.getValeur()
			) {
				LMoyenneDevoir = new TypeNote_1.TypeNote(
					this.MoteurNotes.createChaineAnnotationFelicitation(
						LDevoir.bareme.getValeur(),
					),
				);
			} else {
				LMoyenneDevoir = new TypeNote_1.TypeNote(
					new TypeArrondi_1.TypeArrondi(0).arrondir(lValeurMoyenneDevoir),
				);
			}
		} else {
			LMoyenneDevoir = new TypeNote_1.TypeNote("");
		}
		return LMoyenneDevoir;
	}
	calculerMoyennesEleve(aParam) {
		const lEleve = aParam.eleve;
		const lDebPeriode = aParam.debPeriode;
		const lFinPeriode = aParam.finPeriode;
		const lAvecPeriode = aParam.avecPeriode;
		lEleve.moyennes = [];
		lEleve.aAuMoinsUneNote = this.elevePossedeAuMoinsUneNote({
			eleve: lEleve,
			listeDevoirs: aParam.listeDevoirs,
		});
		for (let i = lDebPeriode; i < lFinPeriode; i++) {
			const lPeriodeServiceCourant = lAvecPeriode
				? aParam.service.listePeriodes.getElementParNumero(
						aParam.titrePeriodes[i].getNumero(),
					)
				: this.getPeriodeDuService(aParam.service);
			const lNumeroFiltrePeriode = lPeriodeServiceCourant
				? lPeriodeServiceCourant.getNumero()
				: 0;
			const lAvecSousServices =
				aParam.avecSousServices ||
				(lAvecPeriode &&
					lPeriodeServiceCourant &&
					lPeriodeServiceCourant.moyenneParSousMatiere &&
					aParam.service.listeServices &&
					aParam.service.listeServices.count() > 0);
			const lAvecGenre =
				aParam.avecGenreNotation ||
				(lAvecPeriode &&
					aParam.service.listeGenreNotation &&
					aParam.service.listeGenreNotation.count() > 1);
			const lDebService = 0;
			const lFinService = lAvecSousServices
				? aParam.service.listeServices.count()
				: 1;
			for (let j = lDebService; j < lFinService; j++) {
				const lService = lAvecSousServices
					? aParam.service.listeServices.get(j)
					: aParam.service;
				const lNumeroFiltreService = lAvecSousServices
					? lService.getNumero()
					: null;
				const lPeriodeService = this.getPeriodeDuService(
					lService,
					lNumeroFiltrePeriode,
				);
				const lAvecGenreEtSsServ =
					lAvecSousServices &&
					lService.pere.periode.moyenneParSousMatiere &&
					lService.pere.listeGenreNotation &&
					lService.pere.listeGenreNotation.count() > 1;
				const lDefault = {
					avecGenreNotationEtSSService: lAvecGenreEtSsServ,
					service: lService,
					numeroPeriodeService: lNumeroFiltrePeriode,
					numeroService: lNumeroFiltreService,
					eleve: lEleve,
					listeDevoirs: aParam.listeDevoirs,
					devoirDansPeriode: aParam.devoirDansPeriode,
					avecGenreNotation: aParam.avecGenreNotation,
					baremeParDefaut: aParam.baremeParDefaut,
					periode: aParam.periode,
				};
				lEleve.moyennes[MoteurNotesCP.genreMoyenne.MoyenneSousService - j] =
					this._getMoyenneService(
						$.extend({}, lDefault, {
							nette: true,
							periodeService: lPeriodeService,
						}),
					);
				lEleve.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneSousServiceBrute - j
				] = this._getMoyenneService(
					$.extend({}, lDefault, {
						nette: false,
						forcerMoyenneBruteDevoir: this.forcerMoyenneBruteDevoir,
					}),
				);
			}
			const lDefault = {
				avecGenreNotation: lAvecGenre,
				numeroPeriodeService: lNumeroFiltrePeriode,
				avecSousServices: lAvecSousServices,
				eleve: lEleve,
				service: aParam.service,
				listeDevoirs: aParam.listeDevoirs,
				baremeParDefaut: aParam.baremeParDefaut,
				devoirDansPeriode: aParam.devoirDansPeriode,
				periode: aParam.periode,
				numeroPeriode:
					aParam.titrePeriodes && aParam.titrePeriodes.length
						? aParam.titrePeriodes[i].getNumero()
						: aParam.periode.getNumero(),
			};
			lEleve.moyennes[MoteurNotesCP.genreMoyenne.MoyennePeriode - i] =
				this._getMoyenneServiceSurPeriode(
					$.extend({}, lDefault, {
						nette: true,
						genreColonne: MoteurNotesCP.genreMoyenne.MoyenneSousService,
					}),
				);
			lEleve.moyennes[MoteurNotesCP.genreMoyenne.MoyennePeriodeBrute - i] =
				this._getMoyenneServiceSurPeriode(
					$.extend({}, lDefault, {
						nette: false,
						genreColonne: MoteurNotesCP.genreMoyenne.MoyenneSousServiceBrute,
					}),
				);
		}
		if (aParam.avecGenreNotation) {
			const lListeGenreNotation =
				aParam.service.listeGenreNotation ||
				aParam.service.pere.listeGenreNotation;
			for (let i = 0; i < lListeGenreNotation.count(); i++) {
				const lGenre = lListeGenreNotation.get(i);
				const lDefault = {
					eleve: lEleve,
					service: aParam.service,
					listeDevoirs: aParam.listeDevoirs,
					numeroGenreNotation: lGenre.getNumero(),
					numeroPeriode: aParam.periode.getNumero(),
					periode: aParam.periode,
					baremeParDefaut: aParam.baremeParDefaut,
					devoirDansPeriode: aParam.devoirDansPeriode,
					avecGenreNotation: aParam.avecGenreNotation,
				};
				lEleve.moyennes[MoteurNotesCP.genreMoyenne.MoyenneGenreNotation - i] =
					this.getMoyenneGenreNotation($.extend({}, lDefault, { nette: true }));
				lEleve.moyennes[
					MoteurNotesCP.genreMoyenne.MoyenneGenreNotationBrute - i
				] = this.getMoyenneGenreNotation(
					$.extend({}, lDefault, { nette: false }),
				);
			}
		}
		const lDefault = {
			avecPeriode: lAvecPeriode,
			eleve: lEleve,
			titrePeriodes: aParam.titrePeriodes,
			service: aParam.service,
			periode: aParam.periode,
			nbrPeriodes: aParam.nbrPeriodes,
			listeDevoirs: aParam.listeDevoirs,
			listeClasses: aParam.listeClasses,
			baremeParDefaut: aParam.baremeParDefaut,
			devoirDansPeriode: aParam.devoirDansPeriode,
			avecGenreNotation: aParam.avecGenreNotation,
		};
		lEleve.moyennes[MoteurNotesCP.genreMoyenne.Moyenne] = this._getMoyenneEleve(
			$.extend({}, lDefault, {
				genreColonne: MoteurNotesCP.genreMoyenne.MoyennePeriode,
				genreMoyenne: MoteurNotesCP.genreMoyenne.MoyenneGenreNotation,
			}),
		);
		lEleve.moyennes[MoteurNotesCP.genreMoyenne.MoyenneAvRattrapageService] =
			this._getMoyenneEleve(
				$.extend({}, lDefault, {
					genreColonne: MoteurNotesCP.genreMoyenne.MoyennePeriode,
					genreMoyenne: MoteurNotesCP.genreMoyenne.MoyenneGenreNotation,
				}),
			);
		lEleve.moyennes[MoteurNotesCP.genreMoyenne.MoyenneBrute] = this.estMoteurHP(
			this.MoteurNotes,
		)
			? this.MoteurNotes.getMoyenneBruteEleve(lDefault)
			: this._getMoyenneEleve(
					$.extend({}, lDefault, {
						genreColonne: MoteurNotesCP.genreMoyenne.MoyennePeriodeBrute,
						genreMoyenne: MoteurNotesCP.genreMoyenne.MoyenneGenreNotationBrute,
					}),
				);
	}
	getMoyenneEleveDePeriode(aParam) {
		let lNumerateur = 0;
		let lDenominateur = 0;
		const lEstColMoyPeriode =
			aParam.genreColonne === MoteurNotesCP.genreMoyenne.MoyennePeriode;
		const lAvecArrondi = lEstColMoyPeriode;
		const lAvecCoefficient = lEstColMoyPeriode;
		const lEleve = aParam.eleve;
		let lPeriodeService;
		for (let i = 0, lNbr = aParam.nbrPeriodes; i < lNbr; i++) {
			const lNote = lEleve.moyennes[aParam.genreColonne - i];
			if (lNote.estUneValeur()) {
				lPeriodeService = this.getPeriodeDuService(
					aParam.service,
					aParam.titrePeriodes[i].getNumero(),
				);
				const lClasse = lEleve.classe
					? aParam.listeClasses.getElementParNumero(lEleve.classe.getNumero())
					: null;
				const lPeriode = lClasse
					? lClasse.listePeriodes.getElementParNumero(
							lPeriodeService.getNumero(),
						)
					: null;
				const lCoefficient =
					lAvecCoefficient && lPeriode && lPeriode.coefficientClasse
						? lPeriode.coefficientClasse.getValeur()
						: 1.0;
				lNumerateur += lCoefficient * lNote.getValeur();
				lDenominateur += lCoefficient;
			}
		}
		if (lDenominateur === 0) {
			return new TypeNote_1.TypeNote("");
		}
		lPeriodeService = this.getPeriodeDuService(aParam.service, 0);
		const lMoyenne = lNumerateur / lDenominateur;
		const lArrondi = lAvecArrondi
			? _getArrondiDePeriodePourGenre.call(
					this,
					lPeriodeService,
					Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant,
				)
			: new TypeArrondi_1.TypeArrondi(0);
		return new TypeNote_1.TypeNote(lArrondi.arrondir(lMoyenne));
	}
	elevePossedeAuMoinsUneNote(aParam) {
		let lResult = false;
		const lEleve = aParam.eleve;
		if (lEleve && lEleve.listeDevoirs) {
			for (
				let lIdxDevoir = 0;
				lIdxDevoir < lEleve.listeDevoirs.count() && !lResult;
				lIdxDevoir++
			) {
				const lDevoirEleve = lEleve.listeDevoirs.get(lIdxDevoir);
				const lDevoir = aParam.listeDevoirs.getElementParNumero(
					lDevoirEleve.getNumero(),
				);
				if (lDevoir && !lDevoir.estRattrapageService) {
					lResult = !lDevoirEleve.note.estUneNoteVide();
				}
			}
		}
		return lResult;
	}
	getMoyenneDuSousService(aParam) {
		let lNumerateur = 0;
		let lDenominateur = 0;
		const lEstColMoySousService =
			aParam.genreColonne === MoteurNotesCP.genreMoyenne.MoyenneSousService;
		const lAvecArrondi = lEstColMoySousService;
		const lAvecCoefficient = lEstColMoySousService;
		const lAvecBonusMalus = lEstColMoySousService;
		const lEleve = aParam.eleve;
		let lPeriodeService;
		for (
			let i = 0, lNbr = aParam.service.listeServices.count();
			i < lNbr;
			i++
		) {
			const lService = aParam.service.listeServices.get(i);
			let lNote = lEleve.moyennes[aParam.genreColonne - i];
			lPeriodeService = this.getPeriodeDuService(
				lService,
				aParam.numeroPeriodeService,
			);
			const lNoteEleveRattrapageService =
				this.getNoteRattrapageServiceDEleveSousService({
					eleve: lEleve,
					listeDevoirs: aParam.listeDevoirs,
					numeroPeriode: aParam.numeroPeriode,
					numeroService: lService.getNumero(),
					indiceService: i,
					devoirDansPeriode: aParam.devoirDansPeriode,
					baremeParDefaut: aParam.baremeParDefaut,
				});
			if (
				!!lNoteEleveRattrapageService &&
				!lNoteEleveRattrapageService.estUneNoteVide() &&
				(!lNoteEleveRattrapageService.estUneAnnotation() ||
					(this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
						lNoteEleveRattrapageService.getValeur() >
							aParam.baremeParDefaut.getValeur()))
			) {
				lNote = lNoteEleveRattrapageService;
			}
			if (lNote.estUneValeur()) {
				const lCoefficient =
					lAvecCoefficient && lPeriodeService && lPeriodeService.coefficient
						? lPeriodeService.coefficient.getValeur()
						: 1.0;
				lNumerateur += lCoefficient * lNote.getValeur();
				lDenominateur += lCoefficient;
			}
		}
		if (lDenominateur === 0) {
			return new TypeNote_1.TypeNote("");
		}
		lPeriodeService = this.getPeriodeDuService(
			aParam.service,
			aParam.numeroPeriodeService,
		);
		let lMoyenneValeur;
		const lArrondi = lAvecArrondi
			? _getArrondiDePeriodePourGenre.call(
					this,
					lPeriodeService,
					Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant,
				)
			: new TypeArrondi_1.TypeArrondi(0);
		if (lAvecBonusMalus) {
			lMoyenneValeur = this.getNoteAvecBonus(
				lEleve,
				aParam.service.listePeriodes.getElementParNumeroEtGenre(
					aParam.numeroPeriodeService,
				),
				new TypeNote_1.TypeNote(lNumerateur / lDenominateur),
				aParam.baremeParDefaut,
			).getValeur();
		} else {
			lMoyenneValeur = lNumerateur / lDenominateur;
		}
		let lNoteMoyenneService;
		if (
			this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
			lMoyenneValeur > aParam.baremeParDefaut.getValeur()
		) {
			lNoteMoyenneService = new TypeNote_1.TypeNote(
				this.MoteurNotes.createChaineAnnotationFelicitation(
					aParam.baremeParDefaut.getValeur(),
				),
			);
		} else {
			lNoteMoyenneService = new TypeNote_1.TypeNote(
				Math.borner(lMoyenneValeur, 0.0, aParam.baremeParDefaut.getValeur()),
			);
			lNoteMoyenneService = new TypeNote_1.TypeNote(
				lArrondi.arrondir(lNoteMoyenneService.getValeur()),
			);
		}
		return lNoteMoyenneService;
	}
	getMoyenneService(aParam) {
		let LNoteValeur;
		const lDefault = {
			eleve: aParam.eleve,
			service: aParam.service,
			periodeService: aParam.periodeService,
			numeroService: aParam.numeroService,
			numeroPeriode: aParam.numeroPeriode,
			listeDevoirs: aParam.listeDevoirs,
			devoirDansPeriode: aParam.devoirDansPeriode,
			baremeParDefaut: aParam.baremeParDefaut,
			periode: aParam.periode,
		};
		LNoteValeur = this.getMoyenneEleveAvecBonus(
			$.extend({}, lDefault, {
				commeUneNote: true,
				commeUnBonus: true,
				moyenne: null,
			}),
		);
		if (LNoteValeur === -1) {
			LNoteValeur = this.getMoyenneEleveAvecBonus(
				$.extend({}, lDefault, {
					commeUneNote: true,
					commeUnBonus: false,
					moyenne: null,
				}),
			);
		}
		let lNoteMoyenneService;
		if (LNoteValeur === -1) {
			lNoteMoyenneService = new TypeNote_1.TypeNote("");
		} else {
			let lArrondi = _getArrondiDePeriodePourGenre.call(
				this,
				aParam.periodeService,
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant,
			);
			if (!lArrondi) {
				lArrondi = new TypeArrondi_1.TypeArrondi(0);
			}
			let LNote = new TypeNote_1.TypeNote(LNoteValeur);
			if (
				this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
				LNote.getValeur() > aParam.baremeParDefaut.getValeur()
			) {
				LNote = new TypeNote_1.TypeNote(
					this.MoteurNotes.createChaineAnnotationFelicitation(
						aParam.baremeParDefaut.getValeur(),
					),
				);
			}
			LNote = this.getNoteAvecBonus(
				aParam.eleve,
				aParam.periodeService,
				LNote,
				aParam.baremeParDefaut,
			);
			if (!!LNote && LNote.estUneValeur()) {
				if (
					this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
					LNote.getValeur() > aParam.baremeParDefaut.getValeur()
				) {
					lNoteMoyenneService = new TypeNote_1.TypeNote(
						this.MoteurNotes.createChaineAnnotationFelicitation(
							aParam.baremeParDefaut.getValeur(),
						),
					);
				} else {
					LNote = new TypeNote_1.TypeNote(
						Math.borner(
							LNote.getValeur(),
							0.0,
							aParam.baremeParDefaut.getValeur(),
						),
					);
					lNoteMoyenneService = new TypeNote_1.TypeNote(
						lArrondi.arrondir(LNote.getValeur()),
					);
				}
			} else {
				lNoteMoyenneService = new TypeNote_1.TypeNote(
					lArrondi.arrondir(LNote.getValeur()),
				);
			}
		}
		return lNoteMoyenneService;
	}
	getMoyenneServiceBrute(aParam) {
		let LBareme = 0;
		let LMoyenne = 0;
		const lEleve = aParam.eleve;
		for (let i = 0, lNbr = aParam.listeDevoirs.count(); i < lNbr; i++) {
			const LDevoir = aParam.listeDevoirs.get(i);
			const lServiceDevoir = LDevoir.service;
			const lPourService =
				aParam.numeroService === null ||
				aParam.numeroService === undefined ||
				lServiceDevoir.getNumero() === aParam.numeroService;
			const lPourPeriode =
				aParam.numeroPeriode === null ||
				aParam.numeroPeriode === undefined ||
				aParam.devoirDansPeriode(LDevoir, aParam.eleve, aParam.numeroPeriode);
			if (
				lPourService &&
				lPourPeriode &&
				this.devoirExiste({ devoir: LDevoir, periode: aParam.periode })
			) {
				const LEleveDevoir = LDevoir.objetListeEleves[aParam.eleve.getNumero()];
				if (
					LEleveDevoir &&
					this.estNotePourMoyenne({
						devoir: LDevoir,
						eleve: aParam.eleve,
						eleveDevoir: LEleveDevoir,
						devoirDansPeriode: aParam.devoirDansPeriode,
					})
				) {
					let lNote = LEleveDevoir.Note.getValeur();
					const lAvecRattrapage =
						LDevoir.devoirRattrapage &&
						LDevoir.devoirRattrapage.existe() &&
						LDevoir.devoirRattrapage.existeNumero() &&
						lNote < LDevoir.devoirRattrapage.noteSeuil.getValeur();
					const lNoteRattrapage =
						lAvecRattrapage &&
						LDevoir.devoirRattrapage.objetListeEleves[lEleve.getNumero()] &&
						LDevoir.devoirRattrapage.objetListeEleves[
							lEleve.getNumero()
						].Note.getValeur();
					if (MethodesObjet_1.MethodesObjet.isNumeric(lNoteRattrapage)) {
						if (
							LDevoir.devoirRattrapage.genreRattrapage ===
								this.MoteurNotes.getGenreRattrapage(
									this.genreRattrapage.GR_Meilleure,
								) &&
							lNote < lNoteRattrapage
						) {
							lNote = Math.max(lNote, lNoteRattrapage);
						} else if (
							LDevoir.devoirRattrapage.genreRattrapage ===
							this.MoteurNotes.getGenreRattrapage(
								this.genreRattrapage.GR_Rattrapage,
							)
						) {
							lNote = lNoteRattrapage;
						} else if (
							LDevoir.devoirRattrapage.genreRattrapage ===
							this.MoteurNotes.getGenreRattrapage(
								this.genreRattrapage.GR_Moyenne,
							)
						) {
							lNote = this.getMoyenneNotesRattrapage(
								LEleveDevoir.Note,
								LDevoir.devoirRattrapage.objetListeEleves[lEleve.getNumero()]
									.Note,
								LDevoir.devoirRattrapage.noteSeuil,
							).getValeur();
						}
					}
					LMoyenne += lNote;
					LBareme += LDevoir.bareme.getValeur();
				}
			}
		}
		return new TypeNote_1.TypeNote(
			LBareme
				? new TypeArrondi_1.TypeArrondi(0).arrondir(
						(aParam.baremeParDefaut.getValeur() * LMoyenne) / LBareme,
					)
				: "",
		);
	}
	getMoyenneEleveAvecBonus(aParam) {
		let LBareme = 0;
		let LNumerateurMoyenne = 0;
		const lEleve = aParam.eleve;
		const lListeDevoirsDupliquee = cloneListeDevoirsTrieesPourCalculMoyenne(
			aParam.listeDevoirs,
			lEleve,
		);
		const lListeDevoirsComptabilises =
			new ObjetListeElements_1.ObjetListeElements();
		const lThis = this;
		lListeDevoirsDupliquee.parcourir((aDevoir) => {
			const lPourService =
				aParam.numeroService === null ||
				aParam.numeroService === undefined ||
				aDevoir.service.getNumero() === aParam.numeroService;
			const lPourPeriode =
				aParam.numeroPeriode === null ||
				aParam.numeroPeriode === undefined ||
				aParam.devoirDansPeriode(aDevoir, lEleve, aParam.numeroPeriode);
			if (lPourService && lPourPeriode) {
				if (lThis.devoirExiste({ devoir: aDevoir, periode: aParam.periode })) {
					const LEleveDevoir = aDevoir.objetListeEleves[lEleve.getNumero()];
					if (
						LEleveDevoir &&
						lThis.estNotePourMoyenne({
							devoir: aDevoir,
							eleve: lEleve,
							eleveDevoir: LEleveDevoir,
							devoirDansPeriode: aParam.devoirDansPeriode,
						})
					) {
						lListeDevoirsComptabilises.addElement(aDevoir);
					}
				}
			}
		});
		const lTousLesDevoirsSontFacultatifsCommeNote =
			this.tousLesDevoirsSontFacultatifsCommeNote(lListeDevoirsComptabilises);
		for (let i = 0, lNbr = lListeDevoirsComptabilises.count(); i < lNbr; i++) {
			const LDevoir = lListeDevoirsComptabilises.get(i);
			const LEleveDevoir = LDevoir.objetListeEleves[lEleve.getNumero()];
			let lNote = LEleveDevoir.Note.getValeur();
			const lAvecRattrapage =
				LDevoir.devoirRattrapage &&
				LDevoir.devoirRattrapage.existe() &&
				LDevoir.devoirRattrapage.existeNumero() &&
				(lNote < LDevoir.devoirRattrapage.noteSeuil.getValeur() ||
					!LEleveDevoir.Note.estUneValeur());
			const lNoteRattrapage =
				lAvecRattrapage &&
				LDevoir.devoirRattrapage.objetListeEleves[lEleve.getNumero()] &&
				LDevoir.devoirRattrapage.objetListeEleves[
					lEleve.getNumero()
				].Note.getValeur();
			if (MethodesObjet_1.MethodesObjet.isNumeric(lNoteRattrapage)) {
				if (
					LDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(this.genreRattrapage.GR_Meilleure)
				) {
					if (LEleveDevoir.Note.estUneValeur()) {
						lNote = Math.max(lNote, lNoteRattrapage);
					} else {
						lNote = lNoteRattrapage;
					}
				} else if (
					LDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(
						this.genreRattrapage.GR_Rattrapage,
					)
				) {
					lNote = lNoteRattrapage;
				} else if (
					LDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(this.genreRattrapage.GR_Moyenne)
				) {
					lNote = this.getMoyenneNotesRattrapage(
						LEleveDevoir.Note,
						LDevoir.devoirRattrapage.objetListeEleves[lEleve.getNumero()].Note,
						LDevoir.devoirRattrapage.noteSeuil,
					).getValeur();
				}
			}
			const LNumerateurMoyenneAvantAjoutNote = LNumerateurMoyenne;
			const LBaremeAvantAjoutNote = LBareme;
			const LCommeUnBonus = LDevoir.commeUnBonus && aParam.commeUnBonus;
			const LCommeUneNote = LDevoir.commeUneNote && aParam.commeUneNote;
			const LCoefficient = LDevoir.coefficient.getValeur();
			const LCoefficientRamenerSur20 = !LDevoir.ramenerSur20
				? 1
				: aParam.baremeParDefaut.getValeur() / LDevoir.bareme.getValeur();
			const lPonderationNotePlusHaute = LEleveDevoir.Note.estPlusHaute
				? this.getPonderationNotePlusHaute(aParam.service, aParam.numeroPeriode)
				: 1.0;
			const lPonderationNotePlusBasse = LEleveDevoir.Note.estPlusBasse
				? this.getPonderationNotePlusBasse(aParam.service, aParam.numeroPeriode)
				: 1.0;
			const LNoteSupMoy = lNote > LDevoir.bareme.getValeur() / 2;
			const LFacultatifEtSousSeuil =
				!!LDevoir.commeUnSeuil &&
				lNote <
					(GParametres.seuilNotation.getValeur() /
						GParametres.baremeNotation.getValeur()) *
						LDevoir.bareme.getValeur();
			if (!LFacultatifEtSousSeuil) {
				if (
					aParam.periodeService &&
					!LCommeUnBonus &&
					(!aParam.periodeService.avecDevoirSupMoy || LNoteSupMoy)
				) {
					LNumerateurMoyenne +=
						LCoefficient *
						LCoefficientRamenerSur20 *
						lPonderationNotePlusHaute *
						lPonderationNotePlusBasse *
						lNote;
					LBareme +=
						LCoefficient *
						LCoefficientRamenerSur20 *
						lPonderationNotePlusHaute *
						lPonderationNotePlusBasse *
						LDevoir.bareme.getValeur();
				} else if (LNoteSupMoy) {
					LNumerateurMoyenne +=
						LCoefficient *
						LCoefficientRamenerSur20 *
						(lNote - LDevoir.bareme.getValeur() / 2);
				}
			}
			if (LCommeUneNote && !lTousLesDevoirsSontFacultatifsCommeNote) {
				const LAncienneMoyenne = LBaremeAvantAjoutNote
					? (aParam.baremeParDefaut.getValeur() *
							LNumerateurMoyenneAvantAjoutNote) /
						LBaremeAvantAjoutNote
					: -1;
				const LNouvelleMoyenne = LBareme
					? (aParam.baremeParDefaut.getValeur() * LNumerateurMoyenne) / LBareme
					: -1;
				if (LNouvelleMoyenne <= LAncienneMoyenne) {
					LNumerateurMoyenne = LNumerateurMoyenneAvantAjoutNote;
					LBareme = LBaremeAvantAjoutNote;
				}
			}
		}
		return LBareme
			? (aParam.baremeParDefaut.getValeur() * LNumerateurMoyenne) / LBareme
			: -1;
	}
	getMoyenneGenreNotation(aParam) {
		let LNote;
		const lDefault = aParam;
		LNote = this.getMoyenneGenreNotationAvecBonus(
			$.extend({}, lDefault, { commeUneNote: true, commeUnBonus: true }),
		);
		if (LNote === -1) {
			LNote = this.getMoyenneGenreNotationAvecBonus(
				$.extend({}, lDefault, { commeUneNote: true, commeUnBonus: false }),
			);
		}
		if (LNote === -1) {
			LNote = new TypeNote_1.TypeNote("");
		} else {
			if (
				this.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
				LNote > aParam.baremeParDefaut.getValeur()
			) {
				LNote = new TypeNote_1.TypeNote(
					this.MoteurNotes.createChaineAnnotationFelicitation(
						aParam.baremeParDefaut.getValeur(),
					),
				);
			} else {
				LNote = new TypeNote_1.TypeNote(
					Math.borner(LNote, 0.0, aParam.baremeParDefaut.getValeur()),
				);
			}
		}
		return LNote;
	}
	getMoyenneGenreNotationAvecBonus(aParam) {
		let lNumerateur = 0;
		let lDenominateur = 0;
		const lEleve = aParam.eleve;
		const lListeDevoirsDupliquee = cloneListeDevoirsTrieesPourCalculMoyenne(
			aParam.listeDevoirs,
			lEleve,
		);
		const lListeDevoirsComptabilises =
			new ObjetListeElements_1.ObjetListeElements();
		const lThis = this;
		lListeDevoirsDupliquee.parcourir((aDevoir) => {
			const lPourGenre =
				aDevoir.genreNotation.getNumero() === aParam.numeroGenreNotation;
			const lPourService =
				aParam.avecGenreNotation ||
				aDevoir.service.getNumero() === aParam.service.getNumero() ||
				(aParam.numeroPeriode &&
					aParam.service.periode.calendrier &&
					aParam.service.periode.calendrier.getNumero() === 0 &&
					!aParam.service.listePeriodes.getElementParNumeroEtGenre(
						aParam.numeroPeriode,
					).moyenneParSousMatiere);
			const lPourPeriode =
				!aParam.numeroPeriode ||
				aParam.devoirDansPeriode(aDevoir, lEleve, aParam.numeroPeriode);
			if (lPourService && lPourPeriode && lPourGenre) {
				if (lThis.devoirExiste({ devoir: aDevoir, periode: aParam.periode })) {
					const LEleveDevoir = aDevoir.listeEleves.getElementParNumero(
						lEleve.getNumero(),
					);
					if (
						LEleveDevoir &&
						lThis.estNotePourMoyenne({
							devoir: aDevoir,
							eleve: lEleve,
							eleveDevoir: LEleveDevoir,
							devoirDansPeriode: aParam.devoirDansPeriode,
						})
					) {
						lListeDevoirsComptabilises.addElement(aDevoir);
					}
				}
			}
		});
		const lTousLesDevoirsSontFacultatifsCommeNote =
			this.tousLesDevoirsSontFacultatifsCommeNote(lListeDevoirsComptabilises);
		for (let i = 0, lNbr = lListeDevoirsComptabilises.count(); i < lNbr; i++) {
			const LDevoir = lListeDevoirsComptabilises.get(i);
			const LEleveDevoir = LDevoir.listeEleves.getElementParNumero(
				lEleve.getNumero(),
			);
			let lNote = LEleveDevoir.Note;
			const lAvecRattrapage =
				LDevoir.devoirRattrapage &&
				LDevoir.devoirRattrapage.existe() &&
				LDevoir.devoirRattrapage.existeNumero() &&
				(lNote.getValeur() < LDevoir.devoirRattrapage.noteSeuil.getValeur() ||
					!lNote.estUneValeur());
			const lNoteRattrapage =
				lAvecRattrapage &&
				LDevoir.devoirRattrapage.objetListeEleves[lEleve.getNumero()] &&
				LDevoir.devoirRattrapage.objetListeEleves[lEleve.getNumero()].Note;
			if (
				lNoteRattrapage &&
				MethodesObjet_1.MethodesObjet.isNumeric(lNoteRattrapage.getValeur())
			) {
				if (
					LDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(this.genreRattrapage.GR_Meilleure)
				) {
					if (lNote.estUneValeur()) {
						lNote = new TypeNote_1.TypeNote(
							Math.max(lNote.getValeur(), lNoteRattrapage.getValeur()),
						);
					} else {
						lNote = new TypeNote_1.TypeNote(lNoteRattrapage.getValeur());
					}
				} else if (
					LDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(
						this.genreRattrapage.GR_Rattrapage,
					)
				) {
					lNote = new TypeNote_1.TypeNote(lNoteRattrapage.getValeur());
				} else if (
					LDevoir.devoirRattrapage.genreRattrapage ===
					this.MoteurNotes.getGenreRattrapage(this.genreRattrapage.GR_Moyenne)
				) {
					lNote = this.getMoyenneNotesRattrapage(
						lNote,
						lNoteRattrapage,
						LDevoir.devoirRattrapage.noteSeuil,
					);
				}
			}
			const lNette = aParam.nette;
			const LNumerateurMoyenneAvantAjoutNote = lNumerateur;
			const LDenominateurAvantAjoutNote = lDenominateur;
			const lCommeBonus =
				!!lNette && aParam.commeUnBonus && LDevoir.commeUnBonus;
			const lCommeNote =
				!!lNette && LDevoir.commeUneNote && aParam.commeUneNote;
			const lCoeff = !!lNette ? LDevoir.coefficient.getValeur() : 1;
			const lCoeff20 =
				!!lNette && LDevoir.ramenerSur20
					? aParam.baremeParDefaut.getValeur() / LDevoir.bareme.getValeur()
					: 1;
			const lPondeHaute =
				!!lNette && LEleveDevoir.Note.estPlusHaute
					? this.getPonderationNotePlusHaute(
							aParam.service,
							aParam.numeroPeriode,
						)
					: 1.0;
			const lPondeBasse =
				!!lNette && LEleveDevoir.Note.estPlusBasse
					? this.getPonderationNotePlusBasse(
							aParam.service,
							aParam.numeroPeriode,
						)
					: 1.0;
			const lNoteSupMoy = lNote.getValeur() > LDevoir.bareme.getValeur() / 2;
			const LFacultatifEtSousSeuil =
				!!LDevoir.commeUnSeuil &&
				lNote.getValeur() <
					(GParametres.seuilNotation.getValeur() /
						GParametres.baremeNotation.getValeur()) *
						LDevoir.bareme.getValeur();
			if (!LFacultatifEtSousSeuil) {
				if (!lCommeBonus) {
					lNumerateur +=
						lNote.getValeur() * lCoeff * lCoeff20 * lPondeHaute * lPondeBasse;
					lDenominateur +=
						LDevoir.bareme.getValeur() *
						lCoeff *
						lCoeff20 *
						lPondeHaute *
						lPondeBasse;
				} else if (lNoteSupMoy) {
					lNumerateur +=
						(lNote.getValeur() - LDevoir.bareme.getValeur() / 2) *
						lCoeff *
						lCoeff20;
				}
			}
			if (lCommeNote && !lTousLesDevoirsSontFacultatifsCommeNote) {
				const LAncienneMoyenne = LDenominateurAvantAjoutNote
					? (aParam.baremeParDefaut.getValeur() *
							LNumerateurMoyenneAvantAjoutNote) /
						LDenominateurAvantAjoutNote
					: -1;
				const LNouvelleMoyenne = lDenominateur
					? (aParam.baremeParDefaut.getValeur() * lNumerateur) / lDenominateur
					: -1;
				if (LNouvelleMoyenne <= LAncienneMoyenne) {
					lNumerateur = LNumerateurMoyenneAvantAjoutNote;
					lDenominateur = LDenominateurAvantAjoutNote;
				}
			}
		}
		return lDenominateur
			? new TypeArrondi_1.TypeArrondi(0).arrondir(
					(aParam.baremeParDefaut.getValeur() * lNumerateur) / lDenominateur,
				)
			: -1;
	}
	getMoyenneServiceGenrePeriode(aParam) {
		const lAvecSousService =
			aParam.service.listeServices && aParam.service.listeServices.count() > 0;
		const lMoyenneSousService =
			lAvecSousService &&
			aParam.service.listePeriodes.getElementParNumeroEtGenre(
				aParam.numeroPeriode,
			).moyenneParSousMatiere;
		const lEleve = aParam.eleve;
		const lEleveVirt = { moyennes: [], listePeriodes: lEleve.listePeriodes };
		if (lAvecSousService && lMoyenneSousService) {
			let lColonne = aParam.genreColonne;
			let lNb = aParam.service.listeServices.count();
			for (let j = 0; j < lNb; j++) {
				const lService = aParam.service.listeServices.get(j);
				lEleveVirt.moyennes[lColonne - j] = this.getMoyenneSousServiceGenre({
					eleve: lEleve,
					nette: aParam.nette,
					numeroPeriode: aParam.numeroPeriode,
					service: lService,
					listeDevoirs: aParam.listeDevoirs,
					devoirDansPeriode: aParam.devoirDansPeriode,
					avecGenreNotation: aParam.avecGenreNotation,
					baremeParDefaut: aParam.baremeParDefaut,
					periode: aParam.periode,
				});
			}
			return this.getMoyenneDuSousService({
				eleve: lEleveVirt,
				numeroPeriodeService: aParam.numeroPeriode,
				genreColonne: lColonne,
				service: aParam.service,
				baremeParDefaut: aParam.baremeParDefaut,
			});
		} else {
			let lService = aParam.service;
			let lColonne = aParam.nette
				? MoteurNotesCP.genreMoyenne.MoyenneGenreNotation
				: MoteurNotesCP.genreMoyenne.MoyenneGenreNotationBrute;
			const lListeGenreNotation =
				lService.listeGenreNotation || lService.pere.listeGenreNotation;
			let lNb = lListeGenreNotation.count();
			for (let j = 0; j < lNb; j++) {
				const lGenre = lListeGenreNotation.get(j);
				lEleveVirt.moyennes[lColonne - j] = this.getMoyenneGenreNotation({
					eleve: lEleve,
					nette: aParam.nette,
					numeroPeriode: aParam.numeroPeriode,
					service: lService,
					listeDevoirs: aParam.listeDevoirs,
					devoirDansPeriode: aParam.devoirDansPeriode,
					avecGenreNotation: aParam.avecGenreNotation,
					baremeParDefaut: aParam.baremeParDefaut,
					periode: aParam.periode,
					numeroGenreNotation: lGenre.getNumero(),
				});
			}
			if (this.estMoteurHP(this.MoteurNotes)) {
				return this.MoteurNotes.getMoyenneDeGenre(
					lEleveVirt,
					lColonne,
					lService,
					aParam.numeroPeriode,
				);
			} else {
				return this.getMoyenneDeGenreNotation({
					eleve: lEleveVirt,
					genreMoyenne: lColonne,
				});
			}
		}
	}
	getMoyenneSousServiceGenre(aParam) {
		const lEleve = aParam.eleve;
		const lEleveVirt = { moyennes: [], listePeriodes: lEleve.listePeriodes };
		const lColonne = aParam.nette
			? MoteurNotesCP.genreMoyenne.MoyenneGenreNotation
			: MoteurNotesCP.genreMoyenne.MoyenneGenreNotationBrute;
		const lListeGenreNotation =
			aParam.service.listeGenreNotation ||
			aParam.service.pere.listeGenreNotation;
		const lNb = lListeGenreNotation.count();
		for (let j = 0; j < lNb; j++) {
			const lGenre = lListeGenreNotation.get(j);
			lEleveVirt.moyennes[lColonne - j] = this.getMoyenneGenreNotation({
				eleve: lEleve,
				service: aParam.service,
				listeDevoirs: aParam.listeDevoirs,
				numeroGenreNotation: lGenre.getNumero(),
				numeroPeriode: aParam.numeroPeriode,
				devoirDansPeriode: aParam.devoirDansPeriode,
				avecGenreNotation: aParam.avecGenreNotation,
				nette: aParam.nette,
				baremeParDefaut: aParam.baremeParDefaut,
				periode: aParam.periode,
			});
		}
		if (this.estMoteurHP(this.MoteurNotes)) {
			return this.MoteurNotes.getMoyenneDeGenre(
				lEleveVirt,
				lColonne,
				aParam.service,
				aParam.numeroPeriode,
				true,
			);
		} else {
			return this.getMoyenneDeGenreNotation({
				eleve: lEleveVirt,
				genreMoyenne: lColonne,
			});
		}
	}
	getMoyenneDeGenreNotation(aParam) {
		const lGenreColonne =
			aParam.genreMoyenne === MoteurNotesCP.genreMoyenne.MoyenneGenreNotation
				? MoteurNotesCP.genreMoyenne.MoyennePeriode
				: MoteurNotesCP.genreMoyenne.MoyennePeriodeBrute;
		return aParam.eleve.moyennes[lGenreColonne];
	}
	calculerMoyennes(aParam) {
		const lPeriode = aParam.periode;
		const lInfosPeriodes = aParam.infosPeriodes;
		const lAvecSousServices = this.getAvecSousServices({
			forcerSansSousService: aParam.forcerSansSousService,
			service: aParam.service,
		});
		const lAvecGenreNotation = this.getAvecGenreNotation({
			service: aParam.service,
			avecSousServices: lAvecSousServices,
			avecPeriode: lInfosPeriodes.avecPeriodes,
			periode: lPeriode,
		});
		let lDefault = {
			periode: aParam.periode,
			baremeParDefaut: aParam.baremeParDefaut,
			service: aParam.service,
			listeDevoirs: aParam.listeDevoirs,
			devoirDansPeriode: aParam.devoirDansPeriode,
			listeEleves: aParam.listeEleves,
			affichageAnciensEleves: aParam.affichageAnciensEleves,
			listeElevesSelection: aParam.listeElevesSelection,
			eleveDansDevoir: aParam.eleveDansDevoir,
			avecGenreNotation: lAvecGenreNotation,
		};
		if (lAvecSousServices) {
			aParam.service.listeServices.parcourir((aService) => {
				this.rechercherNotePlusHauteEtPlusBasse(
					$.extend({}, lDefault, { numeroService: aService.getNumero() }),
				);
			});
		} else {
			this.rechercherNotePlusHauteEtPlusBasse(
				$.extend({}, lDefault, { numeroService: 0 }),
			);
		}
		const lDebPeriode = 0;
		const lFinPeriode = lInfosPeriodes.avecPeriodes
			? lInfosPeriodes.nbPeriodes
			: 1;
		lDefault = {
			listeDevoirs: aParam.listeDevoirs,
			debPeriode: lDebPeriode,
			finPeriode: lFinPeriode,
			avecPeriode: lInfosPeriodes.avecPeriodes,
			titrePeriodes: lInfosPeriodes.titrePeriodes,
			nbrPeriodes: lInfosPeriodes.nbPeriodes,
			service: aParam.service,
			avecSousServices: lAvecSousServices,
			avecGenreNotation: lAvecGenreNotation,
			listeClasses: aParam.listeClasses,
			devoirDansPeriode: aParam.devoirDansPeriode,
			baremeParDefaut: aParam.baremeParDefaut,
			periode: lPeriode,
		};
		const lListeEleves =
			aParam.listeElevesSelection !== null &&
			aParam.listeElevesSelection !== undefined
				? aParam.listeElevesSelection
				: aParam.listeEleves;
		lListeEleves.parcourir((aEleve) => {
			this.calculerMoyennesEleve($.extend({}, lDefault, { eleve: aEleve }));
		});
		lDefault = {
			periode: lPeriode,
			devoirDansPeriode: aParam.devoirDansPeriode,
			listeEleves: aParam.listeEleves,
			affichageAnciensEleves: aParam.affichageAnciensEleves,
			baremeParDefaut: aParam.baremeParDefaut,
		};
		const lListeDevoirs =
			aParam.listeDevoirsSelection !== null &&
			aParam.listeDevoirsSelection !== undefined
				? aParam.listeDevoirsSelection
				: aParam.listeDevoirs;
		lListeDevoirs.parcourir((aDevoir) => {
			this.calculerMoyennesDevoir($.extend({}, lDefault, { devoir: aDevoir }));
		});
		return this.calculerMoyennesGenerales({
			service: aParam.service,
			avecGenreNotation: lAvecGenreNotation,
			avecPeriode: lInfosPeriodes.avecPeriodes,
			titrePeriodes: lInfosPeriodes.titrePeriodes,
			debPeriode: lDebPeriode,
			finPeriode: lFinPeriode,
			periode: lPeriode,
			devoirDansPeriode: aParam.devoirDansPeriode,
			baremeParDefaut: aParam.baremeParDefaut,
			avecSousServices: lAvecSousServices,
			listeEleves: aParam.listeEleves,
			listeDevoirs: lListeDevoirs,
			affichageAnciensEleves: aParam.affichageAnciensEleves,
			debService: 0,
			finService: lAvecSousServices ? aParam.service.listeServices.count() : 1,
			avecTotalMoyNR: aParam.avecTotalMoyNR,
		});
	}
	rechercherNotePlusHauteEtPlusBasse(aParam) {
		const lService =
			aParam.numeroService === 0 ||
			aParam.service.getNumero() === aParam.numeroService
				? aParam.service
				: aParam.service.listeServices.getElementParNumeroEtGenre(
						aParam.numeroService,
					);
		const lAvecGenre =
			aParam.avecGenreNotation ||
			(aParam.service.listeGenreNotation &&
				aParam.service.listeGenreNotation.count() > 1);
		const lListeEleves =
			aParam.listeElevesSelection !== null &&
			aParam.listeElevesSelection !== undefined
				? aParam.listeElevesSelection
				: aParam.listeEleves;
		lListeEleves.parcourir((aEleve) => {
			if (!aParam.affichageAnciensEleves && aEleve.estAncienEleve === true) {
				return;
			}
			let lListePeriode = null;
			if (this.MoteurNotes.estPeriodeActuelleToutes(aParam.periode)) {
				lListePeriode = lService.listePeriodes.getListeElements((aEle) => {
					return aEle.getNumero() !== 0;
				});
			} else if (
				lService.periode.calendrier &&
				lService.periode.calendrier.getNumero() === 0
			) {
				const lNumPeriodeActuelle = aParam.periode.getNumero();
				lListePeriode = lService.listePeriodes.getListeElements((aEle) => {
					return (
						aEle.calendrier &&
						aEle.calendrier.getNumero() === lNumPeriodeActuelle
					);
				});
			} else {
				lListePeriode =
					new ObjetListeElements_1.ObjetListeElements().addElement(
						lService.periode,
					);
			}
			lListePeriode.parcourir((aPeriode) => {
				const lNumPeriode = aPeriode.getNumero();
				let lRatioMax = 0.0;
				let lProdCoeffBaremeMax = 0.0;
				let lNoteMax = null;
				let lRatioMin = 1.0;
				let lProdCoeffBaremeMin = 0.0;
				let lNoteMin = null;
				const lMinMaxGenre = {};
				if (lAvecGenre) {
					lService.listeGenreNotation.parcourir((aGenreNotation) => {
						lMinMaxGenre[aGenreNotation.getNumero()] = {
							nbDevoirsParGenre: 0,
							ratioMax: 0.0,
							pCoeffBaMax: 0.0,
							noteMax: null,
							ratioMin: 1.0,
							pCoeffBaMin: 0.0,
							noteMin: null,
						};
					});
				}
				let lNbDevoirsConcernesHorsGenre = 0;
				aParam.listeDevoirs.parcourir((aDevoir) => {
					const lServiceDevoir = this.getServiceDuDevoir({
						devoir: aDevoir,
						service: aParam.service,
					});
					const lDevoirDansPeriode = aParam.devoirDansPeriode(
						aDevoir,
						aEleve,
						lNumPeriode,
					);
					const lEleveDansDevoir =
						aParam.eleveDansDevoir(aEleve, aDevoir) ===
						Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Oui;
					if (
						(lDevoirDansPeriode &&
							lEleveDansDevoir &&
							aParam.numeroService === 0) ||
						lServiceDevoir.getNumero() === aParam.numeroService
					) {
						const lEleveDevoir = aDevoir.objetListeEleves[aEleve.getNumero()];
						let lNote = lEleveDevoir
							? lEleveDevoir.Note
							: new TypeNote_1.TypeNote();
						const lAvecRattrapage =
							aDevoir.devoirRattrapage &&
							aDevoir.devoirRattrapage.existe() &&
							aDevoir.devoirRattrapage.existeNumero() &&
							(lNote.getValeur() <
								aDevoir.devoirRattrapage.noteSeuil.getValeur() ||
								!lNote.estUneValeur());
						const lNoteRattrapage =
							lAvecRattrapage &&
							aDevoir.devoirRattrapage.objetListeEleves[aEleve.getNumero()] &&
							aDevoir.devoirRattrapage.objetListeEleves[aEleve.getNumero()]
								.Note;
						if (lNoteRattrapage && lNoteRattrapage.estUneValeur()) {
							if (
								aDevoir.devoirRattrapage.genreRattrapage ===
								this.MoteurNotes.getGenreRattrapage(
									this.genreRattrapage.GR_Meilleure,
								)
							) {
								if (lNote.estUneValeur()) {
									lNote = new TypeNote_1.TypeNote(
										Math.max(lNote.getValeur(), lNoteRattrapage.getValeur()),
									);
								} else {
									lNote = new TypeNote_1.TypeNote(lNoteRattrapage.getValeur());
								}
							} else if (
								aDevoir.devoirRattrapage.genreRattrapage ===
								this.MoteurNotes.getGenreRattrapage(
									this.genreRattrapage.GR_Rattrapage,
								)
							) {
								lNote = new TypeNote_1.TypeNote(lNoteRattrapage.getValeur());
							} else if (
								aDevoir.devoirRattrapage.genreRattrapage ===
								this.MoteurNotes.getGenreRattrapage(
									this.genreRattrapage.GR_Moyenne,
								)
							) {
								lNote = this.getMoyenneNotesRattrapage(
									lNote,
									lNoteRattrapage,
									aDevoir.devoirRattrapage.noteSeuil,
								);
							}
						}
						const lBaremeRetenu = aDevoir.ramenerSur20
							? aParam.baremeParDefaut
							: aDevoir.bareme;
						if (
							lEleveDevoir &&
							lNote &&
							lNote.estUneValeur() &&
							!aDevoir.commeUnBonus &&
							!aDevoir.commeUneNote
						) {
							lNote.estPlusHaute = false;
							lNote.estPlusBasse = false;
							const lRatio = lNote.getValeur() / aDevoir.bareme.getValeur();
							if (!lAvecGenre) {
								if (aDevoir.coefficient.getValeur() > 0) {
									lNbDevoirsConcernesHorsGenre++;
									if (
										lRatio > lRatioMax ||
										(lRatio === lRatioMax &&
											aDevoir.coefficient.getValeur() *
												lBaremeRetenu.getValeur() >=
												lProdCoeffBaremeMax)
									) {
										lRatioMax = lRatio;
										lProdCoeffBaremeMax =
											aDevoir.coefficient.getValeur() *
											lBaremeRetenu.getValeur();
										lNoteMax = lEleveDevoir.Note;
									}
									if (
										lRatio < lRatioMin ||
										(lRatio === lRatioMin &&
											aDevoir.coefficient.getValeur() *
												lBaremeRetenu.getValeur() >=
												lProdCoeffBaremeMin)
									) {
										lRatioMin = lRatio;
										lProdCoeffBaremeMin =
											aDevoir.coefficient.getValeur() *
											lBaremeRetenu.getValeur();
										lNoteMin = lEleveDevoir.Note;
									}
								}
							} else {
								const lMinMaxDeGenre =
									lMinMaxGenre[aDevoir.genreNotation.getNumero()];
								lMinMaxDeGenre.nbDevoirsParGenre++;
								if (
									lRatio > lMinMaxDeGenre.ratioMax ||
									(lRatio === lMinMaxDeGenre.ratioMax &&
										aDevoir.coefficient.getValeur() *
											lBaremeRetenu.getValeur() >=
											lMinMaxDeGenre.pCoeffBaMax)
								) {
									lMinMaxDeGenre.ratioMax = lRatio;
									lMinMaxDeGenre.pCoeffBaMax =
										aDevoir.coefficient.getValeur() * lBaremeRetenu.getValeur();
									lMinMaxDeGenre.noteMax = lEleveDevoir.Note;
								}
								if (
									lRatio < lMinMaxDeGenre.ratioMin ||
									(lRatio === lMinMaxDeGenre.ratioMin &&
										aDevoir.coefficient.getValeur() *
											lBaremeRetenu.getValeur() >=
											lMinMaxDeGenre.pCoeffBaMin)
								) {
									lMinMaxDeGenre.ratioMin = lRatio;
									lMinMaxDeGenre.pCoeffBaMin =
										aDevoir.coefficient.getValeur() * lBaremeRetenu.getValeur();
									lMinMaxDeGenre.noteMin = lEleveDevoir.Note;
								}
							}
						}
					}
				});
				if (!lAvecGenre) {
					if (lNoteMax && lNbDevoirsConcernesHorsGenre > 1) {
						lNoteMax.estPlusHaute = true;
					}
					if (lNoteMin && lNbDevoirsConcernesHorsGenre > 1) {
						lNoteMin.estPlusBasse = true;
					}
				} else {
					for (const k in lMinMaxGenre) {
						if (
							lMinMaxGenre[k].noteMax &&
							lMinMaxGenre[k].nbDevoirsParGenre > 1
						) {
							lMinMaxGenre[k].noteMax.estPlusHaute = true;
						}
						if (
							lMinMaxGenre[k].noteMin &&
							lMinMaxGenre[k].nbDevoirsParGenre > 1
						) {
							lMinMaxGenre[k].noteMin.estPlusBasse = true;
						}
					}
				}
			});
		});
	}
	estNotePourMoyenne(aParam) {
		const lDevoirRattrapage =
			aParam.devoir.devoirRattrapage && aParam.devoir.devoirRattrapage.existe()
				? aParam.devoir.devoirRattrapage
				: undefined;
		return (
			(aParam.eleveDevoir &&
				aParam.eleveDevoir.Note &&
				aParam.eleveDevoir.Note.estUneValeur() &&
				aParam.eleve.dansDevoir[aParam.devoir.getNumero()] ===
					Enumere_EleveDansDevoir_1.EGenreEleveDansDevoir.Oui &&
				aParam.devoirDansPeriode(aParam.devoir, aParam.eleve) &&
				(!lDevoirRattrapage ||
					lDevoirRattrapage.genreRattrapage !==
						this.MoteurNotes.getGenreRattrapage(
							this.genreRattrapage.GR_RattrapageService,
						)) &&
				(!lDevoirRattrapage ||
					lDevoirRattrapage.genreRattrapage !==
						this.MoteurNotes.getGenreRattrapage(
							this.genreRattrapage.GR_Rattrapage,
						) ||
					(!!lDevoirRattrapage.noteSeuil &&
						aParam.eleveDevoir.Note.getValeur() >=
							lDevoirRattrapage.noteSeuil.getValeur()) ||
					(lDevoirRattrapage.objetListeEleves[aParam.eleve.getNumero()] &&
						lDevoirRattrapage.objetListeEleves[
							aParam.eleve.getNumero()
						].Note.estUneValeur()))) ||
			(lDevoirRattrapage &&
				lDevoirRattrapage.genreRattrapage !==
					this.MoteurNotes.getGenreRattrapage(
						this.genreRattrapage.GR_RattrapageService,
					) &&
				lDevoirRattrapage.objetListeEleves[aParam.eleve.getNumero()] &&
				lDevoirRattrapage.objetListeEleves[
					aParam.eleve.getNumero()
				].Note.estUneValeur())
		);
	}
	getPonderationNotePlusHaute(aService, aNumPeriode) {
		const lNumPeriode = aNumPeriode || aService.periode.getNumero();
		return lNumPeriode &&
			(aService.estUnService ||
				aService.pere.listePeriodes.getElementParNumeroEtGenre(lNumPeriode)
					.moyenneParSousMatiere)
			? lNumPeriode !== undefined
				? aService.listePeriodes
						.getElementParNumeroEtGenre(lNumPeriode)
						.ponderationNotePlusHaute.getValeur()
				: 1.0
			: 1.0;
	}
	getPonderationNotePlusBasse(aService, aNumPeriode) {
		const lNumPeriode = aNumPeriode || aService.periode.getNumero();
		return lNumPeriode &&
			(aService.estUnService ||
				aService.pere.listePeriodes.getElementParNumeroEtGenre(lNumPeriode)
					.moyenneParSousMatiere)
			? lNumPeriode !== undefined
				? aService.listePeriodes
						.getElementParNumeroEtGenre(lNumPeriode)
						.ponderationNotePlusBasse.getValeur()
				: 1.0
			: 1.0;
	}
	getNoteAvecBonus(aEleve, aPeriodeService, aNote, aBaremeParDefaut) {
		if (!aPeriodeService) {
			return new TypeNote_1.TypeNote("");
		} else if (aPeriodeService.avecBonusMalus) {
			const lPeriode = aEleve.listePeriodes.getElementParNumero(
				aPeriodeService.getNumero(),
			);
			if (lPeriode.bonusMalus.estUneValeur() && aNote.estUneValeur()) {
				const lValeurNoteBornee = Math.borner(
					aNote.getValeur(),
					0.0,
					aBaremeParDefaut.getValeur(),
				);
				return new TypeNote_1.TypeNote(
					lValeurNoteBornee + lPeriode.bonusMalus.getValeur(),
				);
			} else {
				return aNote;
			}
		}
		return aNote;
	}
	getAvecSousServices(aParam) {
		return (
			!aParam.forcerSansSousService &&
			aParam.service.estUnService &&
				aParam.service.periode.moyenneParSousMatiere &&
			aParam.service.listeServices.count() > 0
		);
	}
	getAvecGenreNotation(aParam) {
		return (
			aParam.service.listeGenreNotation &&
			aParam.service.listeGenreNotation.count() > 1 &&
			(!aParam.avecSousServices || aParam.service.pere.existeNumero()) &&
			!aParam.avecPeriode &&
			aParam.periode.existeNumero()
		);
	}
	avecSaisieBonus(aParam) {
		let lAvecSaisie =
			aParam.actif && (!aParam.periode || !aParam.periode.estCloture);
		if (!!lAvecSaisie && aParam.service.listeProfesseurs) {
			lAvecSaisie = false;
			const lNumeroUtilisateurConnecte = aParam.utilisateurConnecte.getNumero();
			aParam.service.listeProfesseurs.parcourir((D) => {
				if (D.getNumero() === lNumeroUtilisateurConnecte) {
					lAvecSaisie = true;
					return false;
				}
			});
		}
		return lAvecSaisie;
	}
	composeHtmlNote(aParam) {
		return aParam.facultatif
			? '<span style="color:' +
					(0, AccessApp_1.getApp)().getCouleur().grisFonce +
					'">' +
					"(" +
					aParam.note +
					")" +
					"</span>"
			: aParam.note;
	}
	getBgColorDevoirFacultatif(aParam) {
		const lCouleur = aParam.commeUnBonus
			? (0, AccessApp_1.getApp)().getCouleur().devoir.commeUnBonus
			: aParam.commeUneNote
				? (0, AccessApp_1.getApp)().getCouleur().devoir.commeUneNote
				: "transparent";
		return lCouleur;
	}
	getNoteRattrapageServiceDEleve(aParam) {
		let lResult = null;
		const lEleve = aParam.eleve;
		const lListeDevoirs = aParam.listeDevoirs;
		if (!!lEleve && !!lEleve.listeDevoirs) {
			const lThis = this;
			lEleve.listeDevoirs.parcourir((aDevoirEleve) => {
				if (!!aDevoirEleve) {
					const lDevoir = lListeDevoirs.getElementParNumero(
						aDevoirEleve.getNumero(),
					);
					if (
						!!lDevoir &&
						!!lDevoir.devoirRattrapage &&
						lDevoir.devoirRattrapage.existeNumero() &&
						lDevoir.devoirRattrapage.existe() &&
						lDevoir.devoirRattrapage.genreRattrapage ===
							lThis.MoteurNotes.getGenreRattrapage(
								lThis.genreRattrapage.GR_RattrapageService,
							)
					) {
						const lDevoirRattrapageService = lDevoir.devoirRattrapage;
						if (lDevoirRattrapageService.listeEleves) {
							const lEleveDuRattrapageDeService =
								lDevoirRattrapageService.listeEleves.getElementParNumero(
									lEleve.getNumero(),
								);
							const lMoyenneEleve =
								lEleve.moyennes[MoteurNotesCP.genreMoyenne.Moyenne];
							if (
								!!lEleveDuRattrapageDeService &&
								!lMoyenneEleve.estUneNoteVide() &&
									lMoyenneEleve.estUneValeur() &&
								lMoyenneEleve.getValeur() <
									lDevoirRattrapageService.noteSeuil.getValeur()
							) {
								let lValeurRattrapageService =
									lEleveDuRattrapageDeService.Note.getValeur();
								if (lDevoir.ramenerSur20) {
									lValeurRattrapageService =
										(lValeurRattrapageService / lDevoir.bareme.getValeur()) *
										aParam.baremeParDefaut.getValeur();
								}
								if (lMoyenneEleve.getValeur() > lValeurRattrapageService) {
									lResult = lMoyenneEleve;
								} else {
									if (
										lThis.MoteurNotes.avecUtilisationAnnotationFelicitation() &&
										lValeurRattrapageService >
											aParam.baremeParDefaut.getValeur()
									) {
										lResult = new TypeNote_1.TypeNote(
											lThis.MoteurNotes.createChaineAnnotationFelicitation(
												aParam.baremeParDefaut.getValeur(),
											),
										);
									} else {
										lResult = new TypeNote_1.TypeNote(lValeurRattrapageService);
									}
								}
							}
						}
					}
				}
				if (!!lResult) {
					return false;
				}
			});
		}
		return lResult;
	}
	getNoteRattrapageServiceDElevePeriode(aParam) {
		let lResult = null;
		const lEleve = aParam.eleve;
		const lListeDevoirs = aParam.listeDevoirs;
		if (!!lEleve && !!lEleve.listeDevoirs) {
			const lThis = this;
			lEleve.listeDevoirs.parcourir((aDevoirEleve) => {
				if (!!aDevoirEleve) {
					const lDevoir = lListeDevoirs.getElementParNumero(
						aDevoirEleve.getNumero(),
					);
					if (
						!!lDevoir &&
						aParam.devoirDansPeriode(lDevoir, lEleve, aParam.numeroPeriode) &&
						!!lDevoir.devoirRattrapage &&
						lDevoir.devoirRattrapage.existeNumero() &&
						lDevoir.devoirRattrapage.existe() &&
						lDevoir.devoirRattrapage.genreRattrapage ===
							lThis.MoteurNotes.getGenreRattrapage(
								lThis.genreRattrapage.GR_RattrapageService,
							)
					) {
						const lDevoirRattrapageService = lDevoir.devoirRattrapage;
						if (lDevoirRattrapageService.listeEleves) {
							const lEleveDuRattrapageDeService =
								lDevoirRattrapageService.listeEleves.getElementParNumero(
									lEleve.getNumero(),
								);
							const lMoyenneEleve =
								lEleve.moyennes[
									MoteurNotesCP.genreMoyenne.MoyennePeriode -
										aParam.indicePeriode
								];
							if (
								!!lEleveDuRattrapageDeService &&
								!lMoyenneEleve.estUneNoteVide() &&
									lMoyenneEleve.estUneValeur() &&
								lMoyenneEleve.getValeur() <
									lDevoirRattrapageService.noteSeuil.getValeur()
							) {
								lResult = lEleveDuRattrapageDeService.Note;
								if (lDevoir.ramenerSur20) {
									lResult = new TypeNote_1.TypeNote(
										(lResult.getValeur() / lDevoir.bareme.getValeur()) *
											aParam.baremeParDefaut.getValeur(),
									);
								}
								lResult =
									lMoyenneEleve.getValeur() > lResult.getValeur()
										? lMoyenneEleve
										: lResult;
							}
						}
					}
				}
				if (!!lResult) {
					return false;
				}
			});
		}
		return lResult;
	}
	getNoteRattrapageServiceDEleveSousService(aParam) {
		let lResult = null;
		const lEleve = aParam.eleve;
		const lListeDevoirs = aParam.listeDevoirs;
		if (!!lEleve && !!lEleve.listeDevoirs) {
			const lThis = this;
			lEleve.listeDevoirs.parcourir((aDevoirEleve) => {
				if (!!aDevoirEleve) {
					const lDevoir = lListeDevoirs.getElementParNumero(
						aDevoirEleve.getNumero(),
					);
					if (
						!!lDevoir &&
						lDevoir.service.getNumero() === aParam.numeroService &&
						aParam.devoirDansPeriode(lDevoir, lEleve, aParam.numeroPeriode) &&
						!!lDevoir.devoirRattrapage &&
						lDevoir.devoirRattrapage.existeNumero() &&
						lDevoir.devoirRattrapage.existe() &&
						lDevoir.devoirRattrapage.genreRattrapage ===
							lThis.MoteurNotes.getGenreRattrapage(
								lThis.genreRattrapage.GR_RattrapageService,
							)
					) {
						const lDevoirRattrapageService = lDevoir.devoirRattrapage;
						if (lDevoirRattrapageService.listeEleves) {
							const lEleveDuRattrapageDeService =
								lDevoirRattrapageService.listeEleves.getElementParNumero(
									lEleve.getNumero(),
								);
							const lMoyenneEleve =
								lEleve.moyennes[
									MoteurNotesCP.genreMoyenne.MoyenneSousService -
										aParam.indiceService
								];
							if (
								!!lEleveDuRattrapageDeService &&
								!lMoyenneEleve.estUneNoteVide() &&
									lMoyenneEleve.estUneValeur() &&
								lMoyenneEleve.getValeur() <
									lDevoirRattrapageService.noteSeuil.getValeur()
							) {
								lResult = lEleveDuRattrapageDeService.Note;
								if (lDevoir.ramenerSur20) {
									lResult = new TypeNote_1.TypeNote(
										(lResult.getValeur() / lDevoir.bareme.getValeur()) *
											aParam.baremeParDefaut.getValeur(),
									);
								}
								lResult =
									lMoyenneEleve.getValeur() > lResult.getValeur()
										? lMoyenneEleve
										: lResult;
							}
						}
					}
				}
				if (!!lResult) {
					return false;
				}
			});
		}
		return lResult;
	}
	composeHtmlMoyNR() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					class: "notation_pastille_moy_NR",
					"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
						"Notes.Colonne.HintMoyenneNR",
					),
				},
				ObjetTraduction_1.GTraductions.getValeur("Notes.Colonne.TitreMoyNR"),
			),
		);
		return H.join("");
	}
	_getMoyenneEleve(aParam) {
		return aParam.avecPeriode
			? this.estMoteurHP(this.MoteurNotes)
				? this.MoteurNotes.getMoyenneDePeriode({
						eleve: aParam.eleve,
						genreColonne: aParam.genreColonne,
						titrePeriodes: aParam.titrePeriodes,
						service: aParam.service,
						nbrPeriodes: aParam.nbrPeriodes,
						listeDevoirs: aParam.listeDevoirs,
						periode: aParam.periode,
						devoirDansPeriode: aParam.devoirDansPeriode,
						baremeParDefaut: aParam.baremeParDefaut,
					})
				: this.getMoyenneEleveDePeriode({
						eleve: aParam.eleve,
						genreColonne: aParam.genreColonne,
						titrePeriodes: aParam.titrePeriodes,
						service: aParam.service,
						nbrPeriodes: aParam.nbrPeriodes,
						listeClasses: aParam.listeClasses,
					})
			: aParam.avecGenreNotation
				? this.getMoyenneDeGenreNotation({
						eleve: aParam.eleve,
						genreMoyenne: aParam.genreMoyenne,
					})
				: aParam.eleve.moyennes[aParam.genreColonne];
	}
	_getMoyenneService(aParam) {
		return aParam.avecGenreNotationEtSSService
			? this.getMoyenneSousServiceGenre({
					eleve: aParam.eleve,
					nette: aParam.nette,
					numeroPeriode: aParam.numeroPeriodeService,
					service: aParam.service,
					listeDevoirs: aParam.listeDevoirs,
					devoirDansPeriode: aParam.devoirDansPeriode,
					avecGenreNotation: aParam.avecGenreNotation,
					baremeParDefaut: aParam.baremeParDefaut,
					periode: aParam.periode,
				})
			: aParam.nette
				? this.getMoyenneService({
						eleve: aParam.eleve,
						service: aParam.service,
						periodeService: aParam.periodeService,
						numeroService: aParam.numeroService,
						numeroPeriode: aParam.numeroPeriodeService,
						listeDevoirs: aParam.listeDevoirs,
						devoirDansPeriode: aParam.devoirDansPeriode,
						baremeParDefaut: aParam.baremeParDefaut,
						periode: aParam.periode,
					})
				: this.getMoyenneServiceBrute({
						eleve: aParam.eleve,
						numeroService: aParam.forcerMoyenneBruteDevoir
							? null
							: aParam.numeroService,
						numeroPeriode: aParam.numeroPeriodeService,
						listeDevoirs: aParam.listeDevoirs,
						service: aParam.service,
						periode: aParam.periode,
						devoirDansPeriode: aParam.devoirDansPeriode,
						baremeParDefaut: aParam.baremeParDefaut,
					});
	}
	tousLesDevoirsSontFacultatifsCommeNote(aListeDevoirs) {
		let lResult = false;
		if (!!aListeDevoirs && aListeDevoirs.count() > 0) {
			lResult = true;
			aListeDevoirs.parcourir((aDevoir) => {
				if (!aDevoir.commeUneNote) {
					lResult = false;
					return false;
				}
			});
		}
		return lResult;
	}
	_getMoyenneServiceSurPeriode(aParam) {
		return aParam.avecGenreNotation
			? this.getMoyenneServiceGenrePeriode({
					eleve: aParam.eleve,
					service: aParam.service,
					numeroPeriode: aParam.numeroPeriodeService,
					nette: aParam.nette,
					genreColonne: aParam.genreColonne,
					avecGenreNotation: aParam.avecGenreNotation,
					listeDevoirs: aParam.listeDevoirs,
					baremeParDefaut: aParam.baremeParDefaut,
					devoirDansPeriode: aParam.devoirDansPeriode,
					periode: aParam.periode,
				})
			: aParam.avecSousServices
				? this.getMoyenneDuSousService({
						eleve: aParam.eleve,
						numeroPeriodeService: aParam.numeroPeriodeService,
						genreColonne: aParam.genreColonne,
						service: aParam.service,
						baremeParDefaut: aParam.baremeParDefaut,
						numeroPeriode: aParam.numeroPeriode,
						listeDevoirs: aParam.listeDevoirs,
						devoirDansPeriode: aParam.devoirDansPeriode,
					})
				: aParam.eleve.moyennes[aParam.genreColonne];
	}
}
exports.MoteurNotesCP = MoteurNotesCP;
(function (MoteurNotesCP) {
	let genreMoyenne;
	(function (genreMoyenne) {
		genreMoyenne[(genreMoyenne["Moyenne"] = -3)] = "Moyenne";
		genreMoyenne[(genreMoyenne["MoyenneBrute"] = -2)] = "MoyenneBrute";
		genreMoyenne[(genreMoyenne["MoyennePeriode"] = -100)] = "MoyennePeriode";
		genreMoyenne[(genreMoyenne["MoyennePeriodeBrute"] = -200)] =
			"MoyennePeriodeBrute";
		genreMoyenne[(genreMoyenne["MoyenneSousService"] = -300)] =
			"MoyenneSousService";
		genreMoyenne[(genreMoyenne["MoyenneSousServiceBrute"] = -400)] =
			"MoyenneSousServiceBrute";
		genreMoyenne[(genreMoyenne["MoyenneGenreNotation"] = -500)] =
			"MoyenneGenreNotation";
		genreMoyenne[(genreMoyenne["MoyenneGenreNotationBrute"] = -600)] =
			"MoyenneGenreNotationBrute";
		genreMoyenne[(genreMoyenne["MoyenneAvRattrapageService"] = -8)] =
			"MoyenneAvRattrapageService";
		genreMoyenne[(genreMoyenne["MoyenneNR"] = -9)] = "MoyenneNR";
	})(
		(genreMoyenne =
			MoteurNotesCP.genreMoyenne || (MoteurNotesCP.genreMoyenne = {})),
	);
})(MoteurNotesCP || (exports.MoteurNotesCP = MoteurNotesCP = {}));
function cloneListeDevoirsTrieesPourCalculMoyenne(aListeDevoirs, aEleve) {
	let lListeDevoirsDupliquee = null;
	if (!!aListeDevoirs) {
		lListeDevoirsDupliquee = aListeDevoirs.getListeElements();
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				if (!D.commeUnBonus && !D.commeUneNote) {
					return 1;
				} else if (!!D.commeUnBonus) {
					return 2;
				}
				return 3;
			}),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				const LEleveDevoir = D.objetListeEleves[aEleve.getNumero()];
				if (
					!!LEleveDevoir &&
					!!LEleveDevoir.Note &&
					LEleveDevoir.Note.estUneValeur()
				) {
					const lBareme =
						!!D.bareme && D.bareme.estUneValeur() ? D.bareme.getValeur() : 1;
					return LEleveDevoir.Note.getValeur() / lBareme;
				}
				return -1;
			}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
		);
		lListeDevoirsDupliquee.setTri(lTris).trier();
	}
	return (
		lListeDevoirsDupliquee || new ObjetListeElements_1.ObjetListeElements()
	);
}
function _getArrondiDePeriodePourGenre(aPeriode, aGenre) {
	return aPeriode && aPeriode.arrondis
		? aPeriode.arrondis[aGenre]
		: new TypeArrondi_1.TypeArrondi(0);
}
