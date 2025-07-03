exports.ObjetFenetre_SaisieQCMResultat = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetDisponibilite_1 = require("ObjetDisponibilite");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeHttpSaisieResultatQCM_1 = require("TypeHttpSaisieResultatQCM");
class ObjetFenetre_SaisieQCMResultat extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idWrapperRedonnerTAF = this.Nom + "_RedonnerTAF";
		this.idWrapperAnnulerNote = this.Nom + "_AnnulerNote";
		this.optionsExecutionQCM = {
			tolererFausses: false,
			consigne: false,
			personnalisationProjAcc: false,
			avecModeCorrigeALaDate: false,
			avecMultipleExecutions: false,
		};
		this.garderMeilleureNoteDevoirRedonne = false;
		this.setOptionsFenetre({
			largeur: 500,
			hauteur: null,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	setOptionsExecutionQCM(aOptions) {
		Object.assign(this.optionsExecutionQCM, aOptions);
	}
	construireInstances() {
		this.idCelluleDate = this.add(ObjetCelluleDate_1.ObjetCelluleDate);
		this.idFenetreParamQCM = this.addFenetre(
			ObjetFenetre_ParamExecutionQCM_1.ObjetFenetre_ParamExecutionQCM,
			this.evntSurParamExecutionQCM,
			this.initFenetreParamExecutionQCM,
		);
		this.idDisponibiliteQCM = this.add(
			ObjetDisponibilite_1.ObjetDisponibilite,
			this.evntSurDisponibiliteQCM,
			this.initDisponibiliteQCM,
		);
		this.idDateDevoir = this.add(ObjetCelluleDate_1.ObjetCelluleDate);
	}
	setDonnees(aParam, aDonneesCours) {
		this.paramOrigine = aParam;
		this.param = MethodesObjet_1.MethodesObjet.dupliquer(aParam);
		this.param.execution.estVerrouille = false;
		if (
			this.param.typeSaisieQCMResultat ===
			TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
				.HttpSaisieResultatQCM_RedonnerLeTAFAuxElevesJusquaLaDate
		) {
			this.setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.TitreRedonnerTAF",
				),
			});
			$("#" + this.idWrapperRedonnerTAF.escapeJQ()).show();
			const lInstanceDate = this.getInstance(this.idCelluleDate);
			lInstanceDate.setParametresFenetre(
				GParametres.PremierLundi,
				GParametres.PremiereDate,
				GParametres.DerniereDate,
				GParametres.JoursOuvres,
				null,
				GParametres.JoursFeries,
				null,
				aDonneesCours.JoursPresenceCours,
			);
			lInstanceDate.setPremiereDateSaisissable(ObjetDate_1.GDate.jour, true);
			const lDateCourante = ObjetDate_1.GDate.getDateCourante();
			let lDateTAF = aDonneesCours.DateTravailAFaire;
			if (ObjetDate_1.GDate.estAvantJour(lDateTAF, lDateCourante)) {
				lDateTAF = lDateCourante;
			}
			lInstanceDate.setDonnees(lDateTAF);
		} else if (
			this.param.typeSaisieQCMResultat ===
			TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
				.HttpSaisieResultatQCM_AnnulerLeDevoirDesEleves
		) {
			this.setOptionsFenetre({
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.TitreAnnulerNote",
				),
			});
			$("#" + this.idWrapperAnnulerNote.escapeJQ()).show();
			this.param.debut = this.param.execution.dateDebutPublication;
			this.param.fin = this.param.execution.dateFinPublication;
			const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
				GParametres.PlacesParJour - 1,
				true,
			);
			const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0, false);
			const lDateCourante = ObjetDate_1.GDate.getDateCourante();
			const lDateDebut = new Date(
				lDateCourante.setHours(
					lPremiereHeure.getHours(),
					lPremiereHeure.getMinutes(),
				),
			);
			const lDateFin = new Date(
				lDateCourante.setHours(
					lDerniereHeure.getHours(),
					lDerniereHeure.getMinutes(),
				),
			);
			if (
				!this.param.debut ||
				ObjetDate_1.GDate.estAvantJour(this.param.debut, lDateDebut)
			) {
				this.param.debut = lDateDebut;
			}
			if (
				!this.param.fin ||
				ObjetDate_1.GDate.estAvantJour(this.param.fin, lDateFin)
			) {
				this.param.fin = lDateFin;
			}
			this.getInstance(this.idDisponibiliteQCM).setDonnees({
				dateDebutPublication: this.param.debut,
				dateFinPublication: this.param.fin,
				actif: true,
				premiereDateSaisie: ObjetDate_1.GDate.jour,
			});
			const lInstanceDateDevoir = this.getInstance(this.idDateDevoir);
			lInstanceDateDevoir.setPremiereDateSaisissable(
				ObjetDate_1.GDate.jour,
				true,
			);
			lInstanceDateDevoir.setDonnees(ObjetDate_1.GDate.jour);
		}
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		let lParamSup = {};
		if (
			this.param.typeSaisieQCMResultat ===
			TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
				.HttpSaisieResultatQCM_RedonnerLeTAFAuxElevesJusquaLaDate
		) {
			const lDate = this.getInstance(this.idCelluleDate).getDate();
			this._mettreAJourDateExecution(lDate, this.param.execution);
			lParamSup = { fin: this.param.execution.dateFinPublication };
		} else if (
			this.param.typeSaisieQCMResultat ===
			TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
				.HttpSaisieResultatQCM_AnnulerLeDevoirDesEleves
		) {
			lParamSup = {
				publication: this.getInstance(this.idDateDevoir).getDate(),
				garderMeilleureNote: this.garderMeilleureNoteDevoirRedonne,
			};
		}
		if (aNumeroBouton === 1) {
			this.callback.appel(aNumeroBouton, $.extend(this.param, lParamSup));
		}
		this.fermer();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnParametrerQCM: {
				event: function () {
					aInstance.evntBoutonParamQCM();
				},
				getTitle: function () {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.ParametresExeQCMDevoir",
					);
				},
			},
			radioTypeDevoirRedonne: {
				getValue: function (aGarderMeilleureNote) {
					let lEstCoche = false;
					if (aGarderMeilleureNote) {
						lEstCoche = !!aInstance.garderMeilleureNoteDevoirRedonne;
					} else {
						lEstCoche = !aInstance.garderMeilleureNoteDevoirRedonne;
					}
					return lEstCoche;
				},
				setValue: function (aGarderMeilleureNote, aValue) {
					if (aGarderMeilleureNote) {
						aInstance.garderMeilleureNoteDevoirRedonne = aValue;
					} else {
						aInstance.garderMeilleureNoteDevoirRedonne = !aValue;
					}
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push("<div>");
		T.push(
			'<div id="',
			this.idWrapperRedonnerTAF,
			'" style="display:none;">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.TexteRedonnerTAF"),
			"</div>",
			'<div class="MargeHaut">',
			'<div id="',
			this.getNomInstance(this.idCelluleDate),
			'" class="InlineBlock"></div>',
			'<ie-btnicon ie-model="btnParametrerQCM" class="icon_cog MargeGauche"></ie-btnicon>',
			"</div>",
			"</div>",
		);
		T.push(
			'<div id="',
			this.idWrapperAnnulerNote,
			'" style="display:none;">',
			"<div>",
			ObjetTraduction_1.GTraductions.getValeur("SaisieQCM.TexteAnnulerNote"),
			"</div>",
			'<div class="m-top-l">',
			'<div class="m-bottom">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.ReponseEleveEntre",
			),
			"</div>",
			'<div id="',
			this.getNomInstance(this.idDisponibiliteQCM),
			'"></div>',
			"</div>",
			'<div class="m-top-l">',
			ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.DatePublication"),
			"&nbsp;",
			'<div id="',
			this.getNomInstance(this.idDateDevoir),
			'" class="InlineBlock AlignementMilieuVertical"></div>',
			"</div>",
			'<div class="m-top-l">',
			'<div><ie-radio ie-model="radioTypeDevoirRedonne(true)">',
			ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.PrendreEnCompteMeilleureNote",
			),
			"</ie-radio></div>",
			'<div><ie-radio ie-model="radioTypeDevoirRedonne(false)">',
			ObjetTraduction_1.GTraductions.getValeur(
				"SaisieQCM.PrendreEnCompteDerniereNote",
			),
			"</ie-radio></div>",
			"</div>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	evntBoutonParamQCM() {
		if (
			this.param.typeSaisieQCMResultat ===
			TypeHttpSaisieResultatQCM_1.TypeHttpSaisieResultatQCM
				.HttpSaisieResultatQCM_RedonnerLeTAFAuxElevesJusquaLaDate
		) {
			const lDate = this.getInstance(this.idCelluleDate).getDate();
			this._mettreAJourDateExecution(lDate, this.param.execution);
		}
		this.getInstance(this.idFenetreParamQCM).setDonnees({
			afficherModeQuestionnaire: true,
			afficherRessentiEleve: true,
			autoriserSansCorrige: true,
			autoriserCorrigerALaDate: true,
			executionQCM: this.param.execution,
			avecConsigne: this.optionsExecutionQCM.consigne,
			avecPersonnalisationProjetAccompagnement:
				this.optionsExecutionQCM.personnalisationProjAcc,
			avecModeCorrigeALaDate: this.optionsExecutionQCM.avecModeCorrigeALaDate,
			avecMultipleExecutions: this.optionsExecutionQCM.avecMultipleExecutions,
		});
	}
	initFenetreParamExecutionQCM(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.ParametresExeQCMDevoir",
			),
			largeur: 540,
			hauteur: null,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	evntSurParamExecutionQCM(aBouton, aExecution) {
		if (aBouton === 1) {
			this.param.execution = aExecution;
		}
	}
	evntSurDisponibiliteQCM(aParam) {
		if (aParam.dateDebutPublication) {
			this.param.debut = aParam.dateDebutPublication;
		}
		if (aParam.dateFinPublication) {
			this.param.fin = aParam.dateFinPublication;
		}
		const lInstanceDateDevoir = this.getInstance(this.idDateDevoir);
		if (lInstanceDateDevoir.getDate() < this.param.debut) {
			lInstanceDateDevoir.setPremiereDateSaisissable(this.param.debut, true);
			lInstanceDateDevoir.setDonnees(this.param.debut);
		}
	}
	initDisponibiliteQCM(aInstance) {
		aInstance.setOptionsAffichage({
			afficherEnModeForm: false,
			afficherSurUneSeuleLigne: true,
			chaines: [
				ObjetTraduction_1.GTraductions.getValeur("Le"),
				ObjetTraduction_1.GTraductions.getValeur("EtLe"),
			],
			avecHeureDebut: true,
			avecHeureFin: true,
		});
	}
	_mettreAJourDateExecution(aDate, aExecution) {
		const lDateFinPub = new Date(
			aDate.getFullYear(),
			aDate.getMonth(),
			aDate.getDate(),
			aExecution.dateFinPublication.getHours(),
			aExecution.dateFinPublication.getMinutes(),
		);
		aExecution.dateFinPublication = lDateFinPub;
	}
}
exports.ObjetFenetre_SaisieQCMResultat = ObjetFenetre_SaisieQCMResultat;
