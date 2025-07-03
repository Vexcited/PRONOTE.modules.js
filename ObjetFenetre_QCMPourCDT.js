exports.ObjetFenetre_QCMPourCDT = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetRequeteQCMPourCDT_InfosCours_1 = require("ObjetRequeteQCMPourCDT_InfosCours");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_2 = require("ObjetStyle");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequetePageEmploiDuTemps_DomainePresence_1 = require("ObjetRequetePageEmploiDuTemps_DomainePresence");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const UtilitaireLienCoursPrecedentSuivant_1 = require("UtilitaireLienCoursPrecedentSuivant");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetChaine_1 = require("ObjetChaine");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
var TypeDestinationQCM;
(function (TypeDestinationQCM) {
	TypeDestinationQCM[(TypeDestinationQCM["PourContenu"] = 0)] = "PourContenu";
	TypeDestinationQCM[(TypeDestinationQCM["PourTAF"] = 1)] = "PourTAF";
})(TypeDestinationQCM || (TypeDestinationQCM = {}));
class ObjetFenetre_QCMPourCDT extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		const lGUIDRef = GUID_1.GUID.getId();
		this.ids = {
			PiedAvecCours: lGUIDRef + "_pac",
			PiedSansCours: lGUIDRef + "_psc",
		};
		this.setOptionsFenetre({
			modale: false,
			avecRetaillage: true,
			largeur: 650,
			hauteur: 588,
			largeurMin: 480,
			hauteurMin: 300,
		});
		this._parametres = {
			cycle: this.etatUtilisateurSco.getSemaineSelectionnee(),
			QCM: null,
			coursSelectionne: null,
			QCMPourTAF: true,
			dateTAF: new Date(),
			hauteurPied: 40,
			cacheJoursPresenceCours: {},
			infosCours: null,
		};
	}
	getParametresFenetreQCMPourCDT() {
		return this._parametres;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			radioDestinationQCM: {
				getValue: function (aTypeDestinationQCM) {
					let lEstActif = false;
					if (!!aInstance._parametres) {
						if (
							aInstance._parametres.QCMPourTAF &&
							aTypeDestinationQCM === TypeDestinationQCM.PourTAF
						) {
							lEstActif = true;
						} else if (
							!aInstance._parametres.QCMPourTAF &&
							aTypeDestinationQCM === TypeDestinationQCM.PourContenu
						) {
							lEstActif = true;
						}
					}
					return lEstActif;
				},
				setValue: function (aTypeDestinationQCM) {
					if (!!aInstance._parametres) {
						aInstance._parametres.QCMPourTAF =
							aTypeDestinationQCM === TypeDestinationQCM.PourTAF;
					}
				},
				getDisabled: function () {
					let lEstActif = false;
					if (
						!!aInstance._parametres &&
						!!aInstance._parametres.coursSelectionne
					) {
						lEstActif = true;
						const lCoursSelectionne = aInstance._parametres.coursSelectionne;
						if (
							lCoursSelectionne.cahierDeTextes &&
							lCoursSelectionne.AvecVisa
						) {
							lEstActif = false;
						} else if (!lCoursSelectionne.utilisable) {
							lEstActif = false;
						}
					}
					return !lEstActif;
				},
			},
		});
	}
	construireInstances() {
		this.identCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this._evenementSurCalendrier,
			this._initialiserCalendrier,
		);
		this.identGrille = this.add(
			InterfaceGrilleEDT_1.InterfaceGrilleEDT,
			this._evenementSurGrille,
			this._initialiserGrille.bind(this),
		);
		this.identSelectDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evenementSelectDate,
		);
		this.utilLienBtns =
			new UtilitaireLienCoursPrecedentSuivant_1.UtilitaireLienCoursPrecedentSuivant(
				{
					idRef: this.Nom,
					callback: this._evenementBtnPrecedentSuivant.bind(this),
				},
			);
	}
	_evenementFenetreTAFFaits(aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_1.TypeBoutonFenetreTAFFaits.Fermer
		) {
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._reponseRequeteFicheCDT.bind(this, this.paramFicheCDT.idCours),
			).lancerRequete(this.paramFicheCDT);
		}
	}
	afficherExerciceCDT(aQCM) {
		this._parametres.QCM = aQCM;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"QCM.PourCDT.TitreAffectationQCMCDT",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				ObjetTraduction_1.GTraductions.getValeur("QCM.PourCDT.Associer"),
			],
		});
		this.afficher();
		if (
			!this.etatUtilisateurSco.getDomainePresence(
				this.etatUtilisateurSco.getUtilisateur(),
			)
		) {
			new ObjetRequetePageEmploiDuTemps_DomainePresence_1.ObjetRequetePageEmploiDuTemps_DomainePresence(
				this,
			)
				.lancerRequete(this.etatUtilisateurSco.getUtilisateur())
				.then((aReponse) => {
					this._surReponseDomaineDePresence(aReponse.Domaine);
				});
		} else {
			this._surReponseDomaineDePresence();
		}
	}
	composeContenu() {
		const H = [];
		H.push('<div style="display:flex; flex-direction: column; height: 100%;">');
		H.push('<div id="', this.getNomInstance(this.identCalendrier), '"></div>');
		H.push(
			'<div id="',
			this.getNomInstance(this.identGrille),
			'" style="position:relative; flex: 1 1 auto;"></div>',
		);
		H.push(this._construirePied());
		H.push("</div>");
		return H.join("");
	}
	surFixerTaille() {
		super.surFixerTaille();
		this.getInstance(this.identCalendrier).surPostResize();
	}
	debutRetaillage() {
		super.debutRetaillage();
		this.getInstance(this.identGrille).getInstanceGrille().surPreResize();
	}
	finRetaillage() {
		super.finRetaillage;
		this.getInstance(this.identGrille).getInstanceGrille().surPostResize();
	}
	surValidation(aNumeroBouton) {
		this.callback.appel(aNumeroBouton);
	}
	_actualisationSurCoursInterdit() {
		this.getInstance(this.identSelectDate).setActif(false);
		this.getInstance(this.identSelectDate).setDonnees(new Date());
		this.setBoutonActif(1, false);
		ObjetHtml_1.GHtml.setDisplay(this.ids.PiedAvecCours, false);
		ObjetHtml_1.GHtml.setDisplay(this.ids.PiedSansCours, true);
	}
	_surReponseRequeteEDT(aParam) {
		this._fermerFichesEtFenetres();
		this.utilLienBtns.actualiser(false);
		this._actualisationSurCoursInterdit();
		const lInstanceGrille = this.getInstance(this.identGrille);
		lInstanceGrille.setDonnees({
			numeroSemaine: this._parametres.cycle,
			listeCours: aParam.listeCours,
		});
		if (this._parametres.coursSelectionne) {
			lInstanceGrille
				.getInstanceGrille()
				.selectionnerCours(this._parametres.coursSelectionne, true);
		}
	}
	_evenementSurCalendrier(ASelection) {
		this._parametres.cycle = ASelection;
		new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
			this,
			this._surReponseRequeteEDT,
		).lancerRequete({
			ressource: this.etatUtilisateurSco.getUtilisateur(),
			numeroSemaine: this._parametres.cycle,
		});
	}
	_initialiserCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance);
	}
	_evenementBtnPrecedentSuivant(aPrecedent) {
		if (!this._parametres.infosCours) {
			return;
		}
		let lCours;
		if (aPrecedent) {
			lCours = this._parametres.infosCours.CoursPrecedent;
		} else {
			lCours = this._parametres.infosCours.CoursSuivant;
		}
		if (lCours.NumeroSemaine !== this._parametres.cycle) {
			this._parametres.coursSelectionne = lCours;
			this.getInstance(this.identCalendrier).setSelection(lCours.NumeroSemaine);
		} else {
			this.getInstance(this.identGrille)
				.getInstanceGrille()
				.selectionnerCours(lCours, true);
		}
	}
	_evenementSelectDate(aDate) {
		this._parametres.dateTAF = aDate;
	}
	_evenementSurBlocCDT(aObjet, aElement, aGenreEvnt) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM:
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{ pere: this, evenement: this._evenementFenetreTAFFaits },
					aElement,
				);
				break;
			default:
				break;
		}
	}
	_fermerFichesEtFenetres() {
		if (this.fenetreCDT) {
			this.fenetreCDT.fermer();
		}
	}
	_initialiserGrille(aInstance) {
		aInstance.setOptionsInterfaceGrilleEDT({
			optionsGrille: {
				couleurLibellesLignes: GCouleur.fenetre.texte,
				couleurLibellesColonnes: GCouleur.fenetre.texte,
			},
			evenementMouseDownPlace: () => {
				this._fermerFichesEtFenetres();
				this._parametres.coursSelectionne = null;
				this._parametres.infosCours = null;
				this.utilLienBtns.actualiser(false, null, null);
				this._actualisationSurCoursInterdit();
			},
		});
	}
	_reponseRequeteFicheCDT(aIdCours, aGenreAffichageEDT, aCahierDeTextes) {
		UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
			this,
			{
				cahiersDeTextes: aCahierDeTextes,
				genreAffichage: aGenreAffichageEDT,
				gestionnaire: GestionnaireBlocCDT_1.GestionnaireBlocCDT,
			},
			{ evenementSurBlocCDT: this._evenementSurBlocCDT.bind(this) },
			{ sansLienQCM: true },
		);
	}
	_reponseRequeteQCMPourCDTInfosCours(aCours, aJSON) {
		this._parametres.infosCours = aJSON;
		this.utilLienBtns.actualiser(
			!!aCours,
			aJSON.CoursPrecedent,
			aJSON.CoursSuivant,
		);
		if (
			this._parametres.coursSelectionne &&
			this._parametres.coursSelectionne.cahierDeTextes &&
			this._parametres.coursSelectionne.AvecVisa
		) {
			this._actualisationSurCoursInterdit();
			GApplication.getMessage().afficher({
				message: ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.AjoutImpossibleCDTVerrouille",
				),
			});
			return;
		}
		if (
			this._parametres.coursSelectionne &&
			!this._parametres.coursSelectionne.utilisable
		) {
			this._actualisationSurCoursInterdit();
			GApplication.getMessage().afficher({
				message: ObjetChaine_1.GChaine.replaceRCToHTML(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.CoursNonUtilisableDansPNParCDT",
					),
				),
			});
			return;
		}
		let lJoursPresence =
			this._parametres.cacheJoursPresenceCours[aCours.getNumero()];
		if (aJSON.JoursPresenceCours) {
			lJoursPresence = aJSON.JoursPresenceCours;
		}
		this.getInstance(this.identSelectDate).setActif(true);
		this.getInstance(this.identSelectDate).setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
			null,
			lJoursPresence,
		);
		this.getInstance(this.identSelectDate).setPremiereDateSaisissable(
			aJSON.DateCoursDeb,
			true,
		);
		this.getInstance(this.identSelectDate).setDonnees(aJSON.DateTravailAFaire);
		this._parametres.dateTAF = aJSON.DateTravailAFaire;
		this.setBoutonActif(1, true);
		ObjetHtml_1.GHtml.setDisplay(this.ids.PiedAvecCours, true);
		ObjetHtml_1.GHtml.setDisplay(this.ids.PiedSansCours, false);
	}
	_evenementSurGrille(aParam) {
		const lParam = { genre: null, id: "", cours: null, genreImage: 0 };
		$.extend(lParam, aParam);
		switch (lParam.genre) {
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage:
				if (lParam.genreImage === 1) {
					this.paramFicheCDT = {
						idCours: lParam.id,
						pourCDT: true,
						cours: lParam.cours,
						numeroSemaine: this._parametres.cycle,
					};
					new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
						this,
						this._reponseRequeteFicheCDT.bind(this, lParam.id),
					).lancerRequete(this.paramFicheCDT);
				} else if (lParam.genreImage === 2) {
					this.paramFicheCDT = {
						idCours: lParam.id,
						pourTAF: true,
						cours: lParam.cours,
						numeroSemaine: this._parametres.cycle,
					};
					new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
						this,
						this._reponseRequeteFicheCDT.bind(this, lParam.id),
					).lancerRequete(this.paramFicheCDT);
				}
				break;
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours:
				this._fermerFichesEtFenetres();
				this._parametres.coursSelectionne = lParam.cours;
				new ObjetRequeteQCMPourCDT_InfosCours_1.ObjetRequeteQCMPourCDT_InfosCours(
					this,
					this._reponseRequeteQCMPourCDTInfosCours.bind(this, lParam.cours),
				).lancerRequete({
					cours: lParam.cours,
					numeroCycle: this._parametres.cycle,
					avecJoursPresence:
						!this._parametres.cacheJoursPresenceCours[lParam.cours.getNumero()],
				});
				break;
		}
	}
	_initialisationCalendrier(aDomainePresence) {
		const lCalendrier = this.getInstance(this.identCalendrier);
		lCalendrier.setFrequences(this.parametresSco.frequences, true);
		lCalendrier.setDomaineInformation(
			aDomainePresence,
			Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu,
		);
		lCalendrier.setPeriodeDeConsultation(
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
		lCalendrier.setSelection(this._parametres.cycle);
	}
	_surReponseDomaineDePresence(aDomainePresence) {
		if (aDomainePresence) {
			this.etatUtilisateurSco.setDomainePresence(
				this.etatUtilisateurSco.getUtilisateur(),
				aDomainePresence,
			);
		}
		this._initialisationCalendrier(
			this.etatUtilisateurSco.getDomainePresence(
				this.etatUtilisateurSco.getUtilisateur(),
			),
		);
	}
	_construirePied() {
		const H = [];
		H.push('<div class="Texte10">', this.utilLienBtns.construire(), "</div>");
		H.push(
			this._construireSeparateur(
				ObjetTraduction_1.GTraductions.getValeur("QCM.PourCDT.CommentCDT"),
			),
		);
		H.push(
			'<div class="Texte10" style="',
			ObjetStyle_2.GStyle.composeHeight(this._parametres.hauteurPied),
			'">',
		);
		H.push('<div style="padding-left:40px; padding-bottom:5px;">');
		H.push('<div id="', this.ids.PiedAvecCours, '" style="display:none">');
		H.push(
			"<div>",
			'<ie-radio ie-model="radioDestinationQCM(',
			TypeDestinationQCM.PourContenu,
			')">',
			ObjetTraduction_1.GTraductions.getValeur("QCM.PourCDT.CommentContenu"),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			"<div>",
			'<ie-radio ie-model="radioDestinationQCM(',
			TypeDestinationQCM.PourTAF,
			')">',
			ObjetTraduction_1.GTraductions.getValeur("QCM.PourCDT.CommentTAF"),
			"</ie-radio>",
			'<div class="InlineBlock MargeGauche" id="',
			this.getNomInstance(this.identSelectDate),
			'"></div>',
			"</div>",
		);
		H.push("</div>");
		H.push('<div id="', this.ids.PiedSansCours, '" class="EspaceHaut">');
		H.push(
			ObjetTraduction_1.GTraductions.getValeur(
				"QCM.PourCDT.SansSelectionCours",
			),
		);
		H.push("</div>");
		H.push("</div>");
		H.push("</div>");
		return H.join("");
	}
	_construireSeparateur(aLibelle) {
		const H = [];
		H.push(
			'<ul class="Texte10" style="padding:0 10px 5px 15px; margin:0; list-style-type:disc;">',
			'<li style="position:relative;">',
			'<div style="position:absolute;left:0; right:0; bottom : 4px;',
			ObjetStyle_2.GStyle.composeCouleurBordure(
				GCouleur.grisFonce,
				1,
				ObjetStyle_1.EGenreBordure.bas,
			),
			'"></div>',
			'<span style="position:absolute;left:0;',
			ObjetStyle_2.GStyle.composeCouleurFond(GCouleur.fenetre.fond),
			'">',
			aLibelle + "&nbsp;",
			"</span>",
			"</li>",
			"</ul>",
		);
		return H.join("");
	}
}
exports.ObjetFenetre_QCMPourCDT = ObjetFenetre_QCMPourCDT;
