exports.InterfaceFeuilleAppel = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequetePageSaisieAbsences_1 = require("ObjetRequetePageSaisieAbsences");
const ObjetRequetePageSaisieAbsences_General_1 = require("ObjetRequetePageSaisieAbsences_General");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const InterfacePageEmploiDuTemps_Journalier_1 = require("InterfacePageEmploiDuTemps_Journalier");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetMoteurAbsences_1 = require("ObjetMoteurAbsences");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const TypeDomaine_1 = require("TypeDomaine");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetMoteurPunitions_1 = require("ObjetMoteurPunitions");
const ObjetRequeteSaisieAbsences_1 = require("ObjetRequeteSaisieAbsences");
const ObjetUtilitaireAbsence_1 = require("ObjetUtilitaireAbsence");
const UtilitaireDuree_1 = require("UtilitaireDuree");
const MoteurSelectionContexte_1 = require("MoteurSelectionContexte");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTri_1 = require("ObjetTri");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Cache_1 = require("Cache");
const GUID_1 = require("GUID");
const tag_1 = require("tag");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_EditionObservation_1 = require("ObjetFenetre_EditionObservation");
const ObjetFenetre_Infirmerie_1 = require("ObjetFenetre_Infirmerie");
const ObjetImage_1 = require("ObjetImage");
const TTypePreparerRepas_1 = require("TTypePreparerRepas");
const TypeGenreRepasEleve_1 = require("TypeGenreRepasEleve");
const ObjetFenetre_FicheEleve_1 = require("ObjetFenetre_FicheEleve");
const Enumere_Action_1 = require("Enumere_Action");
const AccessApp_1 = require("AccessApp");
const DonneesListe_FeuilleDAppel_Mobile_1 = require("DonneesListe_FeuilleDAppel_Mobile");
class InterfaceFeuilleAppel extends InterfacePageEmploiDuTemps_Journalier_1.ObjetAffichagePageEmploiDuTemps_Journalier {
	constructor(...aParams) {
		super(...aParams);
		this.application = (0, AccessApp_1.getApp)();
		this.etatUtilisateurScoMobile = this.application.getEtatUtilisateur();
		this.avecDonnees = false;
		this.avecAnciennesFeuilleDAppel = this.application.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.avecAnciennesFeuilleDAppel,
		);
		this.jourConsultUniquement = false;
		this.listeDates = this.application.droits.get(
			ObjetDroitsPN_1.TypeDroits.absences.listeDatesSaisieAbsence,
		);
		this.listeDates.setTri([
			ObjetTri_1.ObjetTri.init(
				"Date",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		this.listeDates.trier();
		const lElement = this.listeDates.getPremierElement();
		this.premiereDate =
			this.avecAnciennesFeuilleDAppel || !lElement
				? GParametres.PremiereDate
				: lElement.Date;
		const lDerniereElement = this.listeDates.count()
			? this.listeDates.get(this.listeDates.count() - 1)
			: null;
		this.derniereDate = !!lDerniereElement
			? lDerniereElement.Date
			: ObjetDate_1.GDate.getDateCourante(true);
		this._coursProvenantDeNavigation = null;
		if (this.etatUtilisateurScoMobile.getNavigationCours()) {
			this.derniereDate =
				this.etatUtilisateurScoMobile.getNavigationCours().dateDebut;
			this._coursProvenantDeNavigation =
				this.etatUtilisateurScoMobile.getNavigationCours();
		}
		this.etatUtilisateurScoMobile.setDerniereDate(this.derniereDate);
		this.actualiserJourConsultUniquement(this.derniereDate);
		this.forcerClickCours = true;
		this.AvecTrouEDT = false;
		this.avecVerificationJoursPresence = false;
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: IE.estMobile });
		this.contexte = $.extend(this.contexte, {
			ecran: [
				InterfaceFeuilleAppel.genreEcran.EDT,
				InterfaceFeuilleAppel.genreEcran.feuilleDAppel,
			],
			date: null,
			cours: null,
			indice: null,
			dataFeuilleDAppel: null,
		});
		this.listeCours = new ObjetListeElements_1.ObjetListeElements();
		this.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		this.coursCourant = new ObjetElement_1.ObjetElement();
		this.moteur = new ObjetMoteurAbsences_1.ObjetMoteurAbsences();
		this.moteurPunitions = null;
		this.moteurInfirmerie = null;
		this.moteurEdition = null;
		this.moteurSelectionContexte =
			new MoteurSelectionContexte_1.MoteurSelectionContexte();
		this.fenetreFeuilleAppelAutres = null;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			retourEcranPrecSurContenu: function () {
				$(this.node).eventValidation(() => {
					aInstance.revenirSurEcranPrecedent();
				});
			},
			footer: {
				visible: function () {
					return aInstance.footerEstVisible();
				},
				infosEleves: function () {
					return aInstance.avecDonnees && aInstance.avecAppel
						? aInstance.composeNbElevePresent()
						: "";
				},
				appelTermine: {
					getValue: function () {
						return (
							!!aInstance.coursCourant && !!aInstance.coursCourant.AppelFait
						);
					},
					setValue: async function (aValue) {
						if (!!aInstance.coursCourant) {
							if (
								aInstance.footerEstVisible() &&
								aInstance.moteur.avecDemandesDispenseNonTraitee(
									aInstance.contexte.dataFeuilleDAppel.jsonReponse
										.listeDemandesDispense,
								)
							) {
								const lRes =
									await aInstance.moteur.afficherMessageConfirmationAppelTermineAvecDemandeDispense();
								if (lRes !== Enumere_Action_1.EGenreAction.Valider) {
									return;
								}
							}
							aInstance.coursCourant.AppelFait = aValue;
							aInstance.setEtatSaisie(true);
							aInstance.valider(true);
						}
					},
					getDisabled: function () {
						return (
							!aInstance.coursCourant ||
							!!aInstance.coursCourant.estAppelVerrouille
						);
					},
				},
				demandesDispense: {
					btn: {
						event() {
							if (aInstance.demandeDispenseVisible()) {
								aInstance.moteur.ouvrirFenetreDemandeDispense(
									aInstance.contexte.dataFeuilleDAppel.jsonReponse
										.listeDemandesDispense,
									aInstance.callbackFenetreDemandeDispense.bind(aInstance),
								);
							}
						},
					},
					html() {
						if (aInstance.demandeDispenseVisible()) {
							const lNbr =
								aInstance.contexte.dataFeuilleDAppel.jsonReponse.listeDemandesDispense.count();
							return lNbr === 1
								? ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.demandeDispense.1DemandeATraiter",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"AbsenceVS.demandeDispense.xDemandesATraiter",
										[lNbr],
									);
						}
						return "";
					},
					visible() {
						return aInstance.demandeDispenseVisible();
					},
				},
			},
		});
	}
	demandeDispenseVisible() {
		return (
			this.contexte &&
			this.contexte.dataFeuilleDAppel &&
			this.contexte.dataFeuilleDAppel &&
			this.contexte.dataFeuilleDAppel.jsonReponse &&
			this.contexte.dataFeuilleDAppel.jsonReponse.listeDemandesDispense &&
			this.contexte.dataFeuilleDAppel.jsonReponse.listeDemandesDispense.count() >
				0
		);
	}
	footerEstVisible() {
		return (
			this.avecDonnees &&
			this.avecAppel &&
			this.contexte &&
			this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant }) ===
				InterfaceFeuilleAppel.genreEcran.feuilleDAppel
		);
	}
	construireInstances() {
		super.construireInstances();
		this.identPage = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				if (
					aParametres.genreEvenement ===
					Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick
				) {
					ObjetFenetre_FicheEleve_1.ObjetFenetre_FicheEleve.ouvrir({
						instance: this,
						avecRequeteDonnees: true,
						donnees: {
							eleve: aParametres.article,
							listeEleves: this.moteur.listeEleves,
						},
					});
				}
			},
			(aInstance) => {
				aInstance.setOptionsListe({
					forcerOmbreScrollTop: true,
					forcerOmbreScrollBottom: true,
				});
			},
		);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div class="ifc-fa-main">');
		H.push(
			'<section id="',
			this.getIdDeNiveau({ niveauEcran: 0 }),
			'" class="fa-liste-cours">',
		);
		H.push(
			'<div class="edtJournalier" id="',
			this.getNomInstance(this.identPageListe),
			'"></div>',
		);
		H.push("</section>");
		H.push(
			'<aside id="',
			this.getIdDeNiveau({ niveauEcran: 1 }),
			'" style="display: none;" class="fa-detail-appel">',
		);
		H.push(
			'<div id="',
			this.getNomInstance(this.identPage),
			'" class="fa-detail-liste"></div>',
		);
		H.push(`<footer class="fa-detail-footer" ie-display="footer.visible">`);
		H.push(
			'<div class="flex-contain flex-center justify-between fa-ft-appel-demande" ie-if="footer.demandesDispense.visible">',
			`<p class="color-red-foncee" ie-html="footer.demandesDispense.html"></p>`,
			`<ie-bouton ie-model="footer.demandesDispense.btn" class="themeBoutonNeutre small-bt">${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.traiter")}</ie-bouton>`,
			"</div>",
		);
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain justify-between" },
				IE.jsx.str("div", {
					class: "fa-ft-appel-infos",
					"ie-html": "footer.infosEleves",
				}),
				IE.jsx.str(
					"div",
					{ class: "fa-ft-appel-term" },
					IE.jsx.str(
						"ie-switch",
						{ "ie-model": "footer.appelTermine" },
						ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.AppelFait"),
					),
				),
			),
		);
		H.push(`</footer>`);
		H.push("</aside>");
		H.push("</div>");
		return H.join("");
	}
	detruireInstances() {}
	async recupererDonnees() {
		const lRes =
			await new ObjetRequetePageSaisieAbsences_General_1.ObjetRequetePageSaisieAbsences_General(
				this,
			).lancerRequete();
		this.actionSurRecupererDonnees(lRes);
	}
	actionSurRecupererDonnees(aDonnees) {
		this.listeMotifs = aDonnees.listeMotifs;
		this.listeNaturePunition = aDonnees.listeNaturePunition;
		this.listeNatureExclusion = aDonnees.listeNatureExclusion;
		this.avecCommentaireAutorise = aDonnees.avecCommentaireAutorise;
		super.recupererDonnees();
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case InterfaceFeuilleAppel.genreEcran.EDT:
				this._afficherEcranEDT(this.contexte);
				return;
			case InterfaceFeuilleAppel.genreEcran.feuilleDAppel:
				this._afficherEcranFA(this.contexte, true);
				return;
			default:
		}
	}
	construireBandeauEcranFA() {
		let lListeCoursCmb = this._getListePourCombo(this.listeCours);
		lListeCoursCmb = this.moteurSelectionContexte.formatterListeCours({
			listeCours: lListeCoursCmb,
			genreTri: Enumere_TriElement_1.EGenreTriElement.Croissant,
		});
		const lCours = lListeCoursCmb.getElementParElement(this.contexte.cours);
		const H = [];
		H.push(
			(0, tag_1.tag)(
				"div",
				{ class: "fa_bandeauEcran_selection" },
				this._composeHtmlCours(lCours),
			),
		);
		return this.construireBandeauEcran(H.join(""), {
			bgWhite: true,
			class: "fa_bandeau_appel",
			avecRetourSurContenuBandeau: true,
		});
	}
	evenementFicheCours(aCours) {
		if (!!aCours && !!aCours.existeNumero()) {
			this.contexte.date = this.getDateCourante();
			this.contexte.cours = aCours;
			const lEcranSrc = {
				niveauEcran: 0,
				genreEcran: this.getCtxEcran({ niveauEcran: 0 }),
			};
			const lEcranDest = {
				niveauEcran: 1,
				genreEcran: this.getCtxEcran({ niveauEcran: 1 }),
			};
			this.basculerEcran(lEcranSrc, lEcranDest);
		}
	}
	actionApresListeCours(aParams) {
		this.placeCourante = aParams.placeCourante;
		this.listeCours = aParams.listeCours;
		if (!this.avecDonnees) {
			let lCoursASelectionner;
			if (!!this._coursProvenantDeNavigation && this.listeCours) {
				lCoursASelectionner = this.listeCours.getElementParNumero(
					this._coursProvenantDeNavigation.getNumero(),
				);
				delete this._coursProvenantDeNavigation;
			}
			if (!lCoursASelectionner) {
				const lIndiceParDefaut =
					new ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence().getIndiceCoursParPlace(
						this.listeCours,
						this.placeCourante,
						false,
					);
				lCoursASelectionner = this.listeCours.get(lIndiceParDefaut);
			}
			this.avecDonnees = true;
			this.evenementFicheCours(lCoursASelectionner);
		}
	}
	valider(aAvecActualisationPage) {
		this.avecActualisationPageApresValidation = aAvecActualisationPage;
		const lParametresSaisie = {
			cours: this.coursCourant,
			date: this.coursCourant.DateDuCours,
			listeEleves: this.listeEleves,
			placeDebut: this.placeSaisieDebut,
			placeFin: this.placeSaisieFin,
		};
		new ObjetRequeteSaisieAbsences_1.ObjetRequeteSaisieAbsences(
			this,
			this.actionSurValidation,
		).lancerRequete(lParametresSaisie);
	}
	actionSurValidation() {
		this.setEtatSaisie(false);
		if (this.avecActualisationPageApresValidation === true) {
			if (
				this.coursCourant &&
				this.contexte &&
				this.contexte.niveauCourant ===
					this.getNiveauDeGenreEcran({
						genreEcran: InterfaceFeuilleAppel.genreEcran.feuilleDAppel,
					})
			) {
				this._afficherEcranFA(this.contexte, true);
			} else {
				this.recupererDonnees();
			}
		}
	}
	actualiserJourConsultUniquement(aDate) {
		this.jourConsultUniquement =
			this.listeDates.getIndiceElementParFiltre((aElement) => {
				return ObjetDate_1.GDate.estJourEgal(aElement.Date, aDate);
			}) === -1;
	}
	initialiserMoteurDate(aInstance) {
		const lObj = {
			premiereDate: this.premiereDate,
			derniereDate: this.derniereDate,
			joursSemaineValide: GParametres.JoursOuvres,
			joursFeries: GParametres.JoursFeries,
		};
		aInstance.moteurDate.setOptions(lObj);
	}
	_getParamsRequeteEDT() {
		return Object.assign(super._getParamsRequeteEDT(), {
			estEDTAnnuel: false,
			avecConseilDeClasse: false,
			avecCoursSortiePeda: true,
			avecRetenuesEleve: false,
		});
	}
	callbackFenetreDemandeDispense() {
		this.setEtatSaisie(true);
		this.valider(true);
		if (this.fenetreFeuilleAppelAutres) {
			this.fenetreFeuilleAppelAutres.fermer();
		}
	}
	evenementListeMotifs(aParam, aMotif, aDuree) {
		const lAbsence = aParam.absence
			? aParam.absence
			: this.moteur.creerAbsence(
					aParam.eleve,
					aParam.genreAbsence,
					aParam.placeDebut,
					aParam.placeFin,
					aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Retard
						? !!aDuree
							? aDuree
							: this.moteur.dureeRetard
						: null,
					null,
					aParam.typeObservation,
					aParam.listeMotifs,
				);
		if (!!lAbsence) {
			lAbsence.listeMotifs = new ObjetListeElements_1.ObjetListeElements();
			if (aMotif) {
				lAbsence.listeMotifs.addElement(
					MethodesObjet_1.MethodesObjet.dupliquer(aMotif),
				);
			}
			this.getInstance(this.identPage).actualiser(true, true);
			lAbsence.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		} else {
		}
	}
	_getListePourCombo(aListe) {
		const lListeCours = new ObjetListeElements_1.ObjetListeElements();
		aListe.parcourir((aElement) => {
			if (aElement.coursMultiple !== true && aElement.existeNumero()) {
				const lElement = MethodesObjet_1.MethodesObjet.dupliquer(aElement);
				lElement.Visible = true;
				lListeCours.add(lElement);
			}
		});
		lListeCours.setTri([
			ObjetTri_1.ObjetTri.init(
				"DateDuCours",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init(
				"Debut",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
		]);
		lListeCours.trier();
		return lListeCours;
	}
	_afficherEcranEDT(aContexte) {
		return this._reinitialiserAffichage(aContexte.date);
	}
	_reinitialiserAffichage(aDate) {
		return new Promise((aResolve) => {
			this.contexte = $.extend(this.contexte, {
				date: null,
				cours: null,
				indice: null,
				dataFeuilleDAppel: null,
			});
			this.NumeroSemaine = null;
			this.etatUtilisateurSco.setDerniereDate(aDate);
			this.getInstance(this.identPage).setDonnees();
			this.initialiser();
			aResolve();
		});
	}
	_afficherEcranFA(aContexte, aActualiserBandeau) {
		this.coursCourant = aContexte.cours;
		let lMessage;
		if (this.coursCourant) {
			lMessage = "";
			if (this.coursCourant.estAnnule) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.AppelCoursAnnule",
				);
			} else if (
				!this.coursCourant.utilisable &&
				!this.coursCourant.estSortiePedagogique
			) {
				lMessage = ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.AppelCoursNonUtilisable",
				).replaceRCToHTML();
			}
			if (lMessage) {
				if (aActualiserBandeau) {
					switch (
						this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })
					) {
						case InterfaceFeuilleAppel.genreEcran.EDT:
							this._majBandeauEnteteEDTtoFA();
							break;
						case InterfaceFeuilleAppel.genreEcran.feuilleDAppel:
							this._majBandeauEnteteFA();
							break;
					}
				}
				this.getInstance(this.identPage).effacer(
					`<div class="fa-message">${lMessage}</div>`,
				);
				return;
			}
		}
		return new ObjetRequetePageSaisieAbsences_1.ObjetRequetePageSaisieAbsences(
			this,
		)
			.lancerRequete({
				numeroRessource: this.coursCourant.getNumero(),
				date: this.coursCourant.DateDuCours,
				coursSortiePeda:
					this.coursCourant && this.coursCourant.estSortiePedagogique
						? this.coursCourant
						: null,
			})
			.then((aData) => {
				aContexte.dataFeuilleDAppel = aData;
				if (aActualiserBandeau) {
					switch (
						this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })
					) {
						case InterfaceFeuilleAppel.genreEcran.EDT:
							this._majBandeauEnteteEDTtoFA();
							break;
						case InterfaceFeuilleAppel.genreEcran.feuilleDAppel:
							this._majBandeauEnteteFA();
							break;
					}
				}
				this._afficherFA();
			});
	}
	_majBandeauEnteteEDTtoFA() {
		this.setHtmlStructureAffichageBandeau(this.construireBandeauEcranFA());
	}
	_composeHtmlCours(aCours) {
		const H = [];
		const lPublics = [];
		const lParties = [];
		const lPlus = [];
		let i = 0;
		aCours.ListeContenus.parcourir((aElement) => {
			if (i < 3) {
				switch (aElement.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.Classe:
					case Enumere_Ressource_1.EGenreRessource.Groupe:
						lPublics.push(
							`<span class="fa_ic_classe">${aElement.getLibelle()}</span>`,
						);
						i++;
						break;
					case Enumere_Ressource_1.EGenreRessource.PartieDeClasse:
						lParties.push(
							`<span class="fa_ic_partie">${aElement.getLibelle()}</span>`,
						);
						i++;
						break;
				}
			} else if (i === 3) {
				lPlus.push(`<span>...</span>`);
				i++;
			}
		});
		let lSousTitre = lPublics
			.concat(lParties)
			.concat(lPlus)
			.join('<span class="fa_ic_sep">,</span>');
		if (aCours.estSortiePedagogique) {
			lSousTitre += `<div class="fa_ic_sup fa_ic_sortie InlineBlock">- ${ObjetTraduction_1.GTraductions.getValeur("EDT.AbsRess.SortiePedagogique")}</div>`;
		}
		if (aCours.matiere && aCours.matiere.getLibelle()) {
			lSousTitre += `<div class="fa_ic_sup fa_ic_matiere InlineBlock">- ${aCours.matiere.getLibelle()}</div>`;
		}
		if (aCours.NomImageAppelFait) {
			lSousTitre += `<div class="fa_ic_sup fa_ic_image_af InlineBlock">${ObjetImage_1.GImage.composeImage("Image_" + aCours.NomImageAppelFait, 16)}</div>`;
		}
		H.push(
			'<div class="fa-libelle-contain">',
			"   <div ie-ellipsis>",
			aCours.getLibelle(),
			"</div>",
			'   <div ie-ellipsis class="liste-classes fa_infocours">',
			lSousTitre,
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	_majBandeauEnteteFA() {
		this.setHtmlStructureAffichageBandeau(this.construireBandeauEcranFA());
	}
	composeNbElevePresent() {
		const lObjNbEleve = this.moteur.calculerNbElevePresent();
		const H = [];
		const lEstSortiePeda =
			this.coursCourant && this.coursCourant.estSortiePedagogique;
		if (this.coursCourant && this.coursCourant.estAppelVerrouille) {
			H.push(
				'<div style="margin-right:5px;" class="InlineBlock ' +
					(this.coursCourant.AppelFait
						? "Image_AppelVerrouFait"
						: "Image_AppelVerrouNonFait") +
					' AlignementMilieuVertical" style="width:16px;height:16px;" title="' +
					(lEstSortiePeda
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.VerrouAppelFaitSP",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.HintVerrouille",
							)) +
					'"></div>',
			);
		}
		H.push(
			lObjNbEleve.nbElevesPresents > 1
				? ObjetChaine_1.GChaine.format(
						lEstSortiePeda
							? ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.ElevesPresentsSP",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"AbsenceVS.ElevesPresents",
								),
						[lObjNbEleve.nbElevesPresents],
					)
				: lObjNbEleve.nbElevesPresents === 1
					? lEstSortiePeda
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.ElevePresentSP",
							)
						: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.ElevePresent")
					: lEstSortiePeda
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.AucunElevePresentSP",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.AucunElevePresent",
							),
		);
		if (
			this.listeElevesStage &&
			this.listeElevesStage.count &&
			this.listeElevesStage.count() > 0
		) {
			H.push(
				'&nbsp;-&nbsp;<span title="',
				ObjetChaine_1.GChaine.toTitle(
					this.listeElevesStage.getTableauLibelles().join("\n"),
				),
				'">',
				this.listeElevesStage.count() === 1
					? ObjetTraduction_1.GTraductions.getValeur("Absence.EleveEnStage")
					: ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur("Absence.ElevesEnStage"),
							[this.listeElevesStage.count()],
						),
				"</span>",
			);
		}
		if (this.elevesDetaches && this.elevesDetaches.str) {
			H.push(
				'&nbsp;-&nbsp;<span title="',
				ObjetChaine_1.GChaine.toTitle(this.elevesDetaches.hint),
				'">' + this.elevesDetaches.str + "</span>",
			);
		}
		return H.join("");
	}
	_afficherFA() {
		this.avecAppel = false;
		const aData = this.contexte.dataFeuilleDAppel;
		this.listeEleves = aData.listeEleves;
		this.placeGrilleDebut = aData.placeGrilleDebut;
		this.listeClasses = aData.listeClasses;
		this.listeElevesStage = aData.listeElevesEnStage;
		let aucunEleveAffiche = true;
		this.listeEleves.parcourir((aEleve) => {
			if ("ListeAbsences" in aEleve && !!aEleve.ListeAbsences) {
				aucunEleveAffiche = false;
				return false;
			}
		});
		this.listeColonnes = aData.listeTitreColonnes;
		this.avecSuppressionAutreAbsence = aData.avecSupprAutreAbs;
		this.avecModifRetardVS = aData.avecModifRetardVS;
		this.placeSaisieDebut = aData.placeDeb;
		this.placeSaisieFin = aData.placeFin;
		this.DureeRetard = aData.dureeRetard;
		(this.calculAutoDureeRetard = aData.calculAutoDureeRetard),
			(this.genreRepas = aData.genreRepas);
		this.nbElevesEnStage = aData.listeElevesEnStage.count();
		this.messageSortiePeda = aData.jsonReponse.messageSortiePeda;
		this.elevesDetaches = aData.jsonReponse.elevesDetaches;
		this.publierParDefautPassageInf = aData.publierParDefautPassageInf;
		this.actualiserJourConsultUniquement(this.coursCourant.DateDuCours);
		const lUtilisateur = GEtatUtilisateur.getUtilisateur();
		this.moteur.setOptions({
			Cours: this.coursCourant,
			numeroProf:
				lUtilisateur.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Enseignant
					? lUtilisateur.getNumero()
					: null,
			placeSaisieDebut: this.placeSaisieDebut,
			placeSaisieFin: this.placeSaisieFin,
			listeColonnes: this.listeColonnes,
			listeEleves: this.listeEleves,
			dureeRetard: this.DureeRetard,
			calculAutoDureeRetard: this.calculAutoDureeRetard,
			autorisations: {
				jourConsultUniquement: this.jourConsultUniquement,
				avecSaisieAbsence:
					GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: this.application.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsence,
							),
				avecSaisieRetard:
					GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: this.application.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieRetard,
							),
				avecSaisieDispense:
					GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: this.application.droits.get(
								ObjetDroitsPN_1.TypeDroits.dispenses.saisie,
							),
				suppressionAbsenceDeVS: this.avecSuppressionAutreAbsence,
				suppressionRetardDeVS: this.avecModifRetardVS,
				saisieAbsenceOuverte: this.application.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieAbsenceOuverte,
				),
				saisieHorsCours:
					GEtatUtilisateur.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.SaisieAbsences_Appel_Professeur
						? true
						: this.application.droits.get(
								ObjetDroitsPN_1.TypeDroits.absences.avecSaisieHorsCours,
							),
				saisieDefautCarnet: this.application.droits.get(
					ObjetDroitsPN_1.TypeDroits.absences.avecSaisieDefautCarnet,
				),
			},
		});
		if (aucunEleveAffiche) {
			this.getInstance(this.identPage).effacer(
				this.composeAucuneDonnee(
					ObjetTraduction_1.GTraductions.getValeur("Absence.AucunEleve"),
				),
			);
			return;
		}
		this.avecAppel = true;
		this.getInstance(this.identPage)
			.setOptionsListe({
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				colonnes:
					DonneesListe_FeuilleDAppel_Mobile_1.DonneesListe_FeuilleDAppel_Mobile.getColonnes(),
				boutons: [],
				forcerOmbreScrollTop: true,
			})
			.setDonnees(
				new DonneesListe_FeuilleDAppel_Mobile_1.DonneesListe_FeuilleDAppel_Mobile(
					this.moteur,
					{
						evenement: (aGenreEvent, aParams) => {
							switch (aGenreEvent) {
								case DonneesListe_FeuilleDAppel_Mobile_1
									.DonneesListe_FeuilleDAppel_Mobile.GenreAction
									.saisieAbsence: {
									const lParams = Object.assign(
										{
											fonctionSurOuvrirListeMotif:
												this.afficherListeMotif.bind(this),
											fonctionApresPasPossible: () => {},
											fonctionApresModification: () => {
												this.getInstance(this.identPage).actualiser(true, true);
												this.setEtatSaisie(true);
											},
										},
										aParams,
									);
									this.moteur.surEvenementSaisieAbsence(lParams);
									break;
								}
								case DonneesListe_FeuilleDAppel_Mobile_1
									.DonneesListe_FeuilleDAppel_Mobile.GenreAction.saisieAutres: {
									const lListe = aParams.moteur.listeColonnes.getListeElements(
										(aElement) => {
											let lEstColonneActif =
												![
													Enumere_Ressource_1.EGenreRessource.Absence,
													Enumere_Ressource_1.EGenreRessource.Retard,
												].includes(aElement.getGenre()) &&
												aElement.Actif === true;
											if (
												lEstColonneActif &&
												aElement.getGenre() ===
													Enumere_Ressource_1.EGenreRessource.RepasAPreparer
											) {
												const lEleve =
													this.moteur.listeEleves.getElementParNumero(
														aParams.eleve.getNumero(),
													);
												const lAbsence = this.moteur.getAbsence(
													lEleve,
													aElement.getGenre(),
												);
												lEstColonneActif =
													!!lAbsence &&
													lAbsence.type !==
														TTypePreparerRepas_1.TTypePreparerRepas.prNonDP;
											}
											return lEstColonneActif;
										},
									);
									if (lListe && lListe.count) {
										const lGenreRepas = this.genreRepas;
										this.fenetreFeuilleAppelAutres =
											ObjetFenetre_FeuilleAppelAutres.ouvrir({
												instance: this,
												titre: aParams.eleve.getLibelle(),
												callback: () => {},
												options: {
													moteur: this.moteur,
													rubriques: lListe,
													genreRepas: lGenreRepas,
													callbackListe: (aParametres) => {
														const lEleve =
															this.moteur.listeEleves.getElementParNumero(
																aParametres.eleve.getNumero(),
															);
														const lAbsence = this.moteur.getAbsence(
															lEleve,
															aParametres.genreAbsence,
															this.moteur.placeSaisieDebut,
															aParametres.numeroObservation,
														);
														const lEstActif =
															this.moteur.genreAbsenceDEleveEstEditable(
																aParametres.eleve.getNumero(),
																aParametres.genreAbsence,
																aParametres.numeroObservation,
																aParametres.genreObservation,
															);
														const lObjet = {
															numeroEleve: lEleve.getNumero(),
															placeDebut: this.moteur.placeSaisieDebut,
															placeFin: this.moteur.placeSaisieFin,
															typeAbsence: aParametres.genreAbsence,
															typeObservation: aParametres.numeroObservation,
															genreObservation: aParametres.genreObservation,
															typeSaisie: aParametres.etat,
															eleve: lEleve,
															absence: !!lAbsence ? lAbsence : undefined,
															actif: lEstActif,
															genreAbsence: aParametres.genreAbsence,
															evenementApresAction:
																aParametres.evenementApresAction,
															fonctionSurOuvrirListeMotif: function () {},
															fonctionApresPasPossible: function () {},
														};
														if (
															aParametres.genreEvenement ===
															ObjetFenetre_FeuilleAppelAutres.genreAction
																.checkbox
														) {
															if (lEstActif) {
																lObjet.fonctionApresModification = function (
																	aParams,
																) {
																	if (
																		aParams.typeAbsence ===
																			Enumere_Ressource_1.EGenreRessource
																				.Observation &&
																		[
																			TypeGenreObservationVS_1
																				.TypeGenreObservationVS
																				.OVS_ObservationParent,
																			TypeGenreObservationVS_1
																				.TypeGenreObservationVS
																				.OVS_Encouragement,
																		].includes(aParams.genreObservation) &&
																		aParams.typeSaisie ===
																			Enumere_Etat_1.EGenreEtat.Creation
																	) {
																		this.afficherEdition(aParams);
																	} else {
																		if (
																			aParams &&
																			aParams.evenementApresAction
																		) {
																			aParams.evenementApresAction();
																		}
																	}
																}.bind(this, lObjet);
																if (
																	aParametres.etat ===
																	Enumere_Etat_1.EGenreEtat.Creation
																) {
																	switch (aParametres.genreAbsence) {
																		case Enumere_Ressource_1.EGenreRessource
																			.Infirmerie:
																			this.afficherInfirmerie(lObjet);
																			break;
																		case Enumere_Ressource_1.EGenreRessource
																			.Punition:
																		case Enumere_Ressource_1.EGenreRessource
																			.Exclusion:
																			this.afficherPunition(lObjet);
																			break;
																		case Enumere_Ressource_1.EGenreRessource
																			.Dispense: {
																			const lDemandeDispense =
																				this.moteur.getDemandeDeDispense(
																					lObjet.numeroEleve,
																				);
																			const lDemandePasRefusee =
																				lDemandeDispense &&
																				!lDemandeDispense.estRefusee;
																			const lDemandeRefuseeEtAnnulable =
																				lDemandeDispense &&
																				lDemandeDispense.estRefusee &&
																				lDemandeDispense.estRefuseeAnnulable;
																			if (
																				lDemandePasRefusee ||
																				lDemandeRefuseeEtAnnulable
																			) {
																				this.moteur.ouvrirFenetreDemandeDispense(
																					lDemandeDispense,
																					this.callbackFenetreDemandeDispense.bind(
																						this,
																					),
																				);
																				break;
																			}
																			this.moteur.surEvenementSaisieAbsence(
																				lObjet,
																			);
																			break;
																		}
																		default:
																			this.moteur.surEvenementSaisieAbsence(
																				lObjet,
																			);
																			break;
																	}
																} else {
																	this.moteur.surEvenementSaisieAbsence(lObjet);
																}
															}
														} else if (
															aParametres.genreEvenement ===
															ObjetFenetre_FeuilleAppelAutres.genreAction
																.modification
														) {
															lObjet.fonctionApresModification = function (
																aParams,
															) {
																if (aParams && aParams.evenementApresAction) {
																	aParams.evenementApresAction();
																}
															}.bind(this, lObjet);
															switch (aParametres.genreAbsence) {
																case Enumere_Ressource_1.EGenreRessource
																	.Infirmerie:
																	this.afficherInfirmerie(lObjet);
																	break;
																case Enumere_Ressource_1.EGenreRessource
																	.Punition:
																case Enumere_Ressource_1.EGenreRessource
																	.Exclusion:
																	this.afficherPunition(lObjet);
																	break;
																default:
																	this.afficherEdition(lObjet);
																	break;
															}
														}
													},
												},
												donnees: { eleve: aParams.eleve },
											});
									}
									break;
								}
								case DonneesListe_FeuilleDAppel_Mobile_1
									.DonneesListe_FeuilleDAppel_Mobile.GenreAction
									.editionAutres: {
									const lEleve = this.moteur.listeEleves.getElementParNumero(
										aParams.eleve.getNumero(),
									);
									const lAbsence = this.moteur.getAbsence(
										lEleve,
										aParams.genre,
										this.moteur.placeSaisieDebut,
										aParams.numeroObservation,
									);
									const lEstActif = this.moteur.genreAbsenceDEleveEstEditable(
										aParams.eleve.getNumero(),
										aParams.genre,
										aParams.numeroObservation,
										aParams.genreObservation,
									);
									const lObjet = {
										numeroEleve: lEleve.getNumero(),
										placeDebut: this.moteur.placeSaisieDebut,
										placeFin: this.moteur.placeSaisieFin,
										typeAbsence: aParams.genre,
										typeObservation: aParams.numeroObservation,
										genreObservation: aParams.genreObservation,
										typeSaisie: undefined,
										eleve: lEleve,
										absence: !!lAbsence ? lAbsence : undefined,
										genreAbsence: aParams.genre,
										actif: lEstActif,
										evenementApresAction: (aAvecActualisation) => {
											if (aAvecActualisation) {
												this.getInstance(this.identPage).actualiser(true, true);
												this.setEtatSaisie(true);
											}
										},
										fonctionSurOuvrirListeMotif: () => {},
										fonctionApresPasPossible: () => {},
										fonctionApresModification: () => {
											this.getInstance(this.identPage).actualiser(true, true);
											this.setEtatSaisie(true);
										},
									};
									switch (aParams.genre) {
										case Enumere_Ressource_1.EGenreRessource.Infirmerie:
											this.afficherInfirmerie(lObjet);
											break;
										case Enumere_Ressource_1.EGenreRessource.Punition:
										case Enumere_Ressource_1.EGenreRessource.Exclusion:
											this.afficherPunition(lObjet);
											break;
										case Enumere_Ressource_1.EGenreRessource.RepasAPreparer:
											if (
												lAbsence.modifiable &&
												lAbsence.type !==
													TTypePreparerRepas_1.TTypePreparerRepas.prNonDP
											) {
												this.moteur.surEvenementSaisieAbsence(lObjet);
											}
											break;
										default:
											this.afficherEdition(lObjet);
											break;
									}
									break;
								}
								default:
									break;
							}
						},
						enseignant:
							lUtilisateur.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Enseignant
								? lUtilisateur
								: null,
						avecDeploiement: false,
						avecEvnt_Selection: true,
						avecDetails: true,
						avecEllipsis: false,
						avecInfoClasse: this.listeClasses.count() > 1,
					},
				),
				undefined,
				{ conserverPositionScroll: true },
			);
	}
	afficherEdition(aParams) {
		const lAbsence = this.moteur.getAbsence(
			aParams.eleve,
			aParams.typeAbsence,
			this.moteur.placeSaisieDebut,
			aParams.typeObservation,
		);
		let lColonneObservation;
		let lMaxLength;
		const lJSonRep = this.contexte.dataFeuilleDAppel.jsonReponse;
		if (
			!!lAbsence &&
			lAbsence.getGenre() === Enumere_Ressource_1.EGenreRessource.Dispense
		) {
			lColonneObservation = this.moteur.listeColonnes.getElementParGenre(
				Enumere_Ressource_1.EGenreRessource.Dispense,
			);
			lMaxLength =
				!!lJSonRep.maxlength &&
				"commentaireDispense" in lJSonRep.maxlength &&
				lJSonRep.maxlength.commentaireDispense > 0
					? lJSonRep.maxlength.commentaireDispense
					: undefined;
		} else {
			lColonneObservation = this.moteur.listeColonnes.getElementParNumero(
				aParams.typeObservation,
			);
			lMaxLength =
				!!lJSonRep.maxlength &&
				"commentaireObservation" in lJSonRep.maxlength &&
				lJSonRep.maxlength.commentaireObservation > 0
					? lJSonRep.maxlength.commentaireObservation
					: undefined;
		}
		const lObjet = {
			observation: lAbsence,
			numeroObservation: aParams.typeObservation,
			genreEtat: aParams.typeSaisie,
			typeObservation: !!lColonneObservation
				? lColonneObservation.genreObservation
				: null,
			publiable: !!lColonneObservation ? lColonneObservation.publiable : false,
			avecDate: false,
			actif: aParams.actif === undefined ? true : aParams.actif,
			maxlengthCommentaire: lMaxLength,
		};
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionObservation_1.ObjetFenetre_EditionObservation,
			{
				pere: this,
				evenement: (
					aSaisie,
					aGenreAbsence,
					aGenreObservation,
					aEstBtnValidation,
				) => {
					if (aSaisie) {
						if (aParams && aParams.evenementApresAction) {
							aParams.evenementApresAction(aEstBtnValidation);
						}
					}
				},
			},
			{ fermerFenetreSurClicHorsFenetre: true, avecCroixFermeture: false },
		);
		lFenetre.setDonnees(lObjet);
		lFenetre.afficher();
	}
	afficherInfirmerie(aParams) {
		const LBorneMin = this.moteur.placeSaisieDebut;
		const LBorneMax = this.moteur.placeSaisieFin;
		const lAbsence = this.moteur.getAbsence(
			aParams.eleve,
			Enumere_Ressource_1.EGenreRessource.Infirmerie,
			aParams.placeDebut,
		);
		this.moteur._majListeElevesVisible();
		const lMaxLength =
			this.contexte.dataFeuilleDAppel.jsonReponse &&
			this.contexte.dataFeuilleDAppel.jsonReponse.maxlength &&
			this.contexte.dataFeuilleDAppel.jsonReponse.maxlength
				.commentairePassageInfirmerie
				? this.contexte.dataFeuilleDAppel.jsonReponse.maxlength
						.commentairePassageInfirmerie
				: undefined;
		const lParam = {
			numeroEleve: aParams.numeroEleve,
			placeDebut: aParams.placeDebut,
			placeFin: aParams.placeFin,
			borneMin: ObjetDate_1.GDate.placeAnnuelleEnDate(LBorneMin),
			borneMax: ObjetDate_1.GDate.placeAnnuelleEnDate(LBorneMax, true),
			absence: lAbsence,
			publierParDefautPassageInf: this.publierParDefautPassageInf,
			avecEditionPublication: false,
			actif: aParams.actif === undefined ? true : aParams.actif,
			maxlengthCommentaire: lMaxLength,
			avecCommentaireAutorise: this.avecCommentaireAutorise,
		};
		const lListeAccompagnants = MethodesObjet_1.MethodesObjet.dupliquer(
			this.listeEleves,
		);
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Infirmerie_1.ObjetFenetre_Infirmerie,
			{
				pere: this,
				evenement: function (aNumeroBouton, aNumeroEleve, aNewAbs) {
					if (aNumeroBouton !== 0 && aNumeroBouton !== -1) {
						if (aNewAbs) {
							const lEleve = this.listeEleves.getElementParNumero(aNumeroEleve);
							lEleve.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lEleve.ListeAbsences.addElement(aNewAbs);
						}
						if (aParams && aParams.evenementApresAction) {
							aParams.evenementApresAction(true);
						}
					}
				},
			},
			{
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"AbsenceVS.Titre_FenetreInfirmerie",
				),
				fermerFenetreSurClicHorsFenetre: true,
			},
		);
		lFenetre.setDonnees(lListeAccompagnants, lParam);
	}
	afficherPunition(aParams) {
		const lParamsOrig = aParams;
		const lAttribut =
			aParams.genreAbsence === Enumere_Ressource_1.EGenreRessource.Punition
				? "listePunitions"
				: "ListeAbsences";
		const lDateCours = this.moteur.Cours ? this.moteur.Cours.DateDuCours : null;
		const lParam = {
			eleve: aParams.eleve,
			listeEleves:
				aParams.genreAbsence === Enumere_Ressource_1.EGenreRessource.Punition
					? null
					: this.listeEleves,
			punition:
				!!aParams && aParams.typeSaisie !== Enumere_Etat_1.EGenreEtat.Creation
					? aParams.eleve[lAttribut].getElementParGenre(aParams.genreAbsence)
					: null,
			listeMotifs: this.listeMotifs,
			listeNature:
				aParams.genreAbsence === Enumere_Ressource_1.EGenreRessource.Punition
					? this.listeNaturePunition
					: this.listeNatureExclusion,
			genreRessource: aParams.genreAbsence,
			placeSaisieDebut: aParams.placeDebut,
			placeSaisieFin: aParams.placeFin,
			date: lDateCours,
		};
		this.moteurPunitions = new ObjetMoteurPunitions_1.ObjetMoteurPunitions(
			this,
		);
		this.moteurPunitions.init(lParam);
		this.objetCalendrier = new ObjetCelluleDate_1.ObjetCelluleDate(
			this.Nom + ".objetCalendrier",
			null,
			this,
			(aDate) => {
				this.moteurPunitions.punition.date = aDate;
			},
		);
		const lSelf = this,
			lHtml = [],
			lBlackDays = [];
		for (let lDay = 0; lDay < 7; lDay++) {
			if (!ObjetDate_1.GDate.joursOuvres.getValeur(lDay)) {
				lBlackDays.push(lDay);
			}
		}
		const lIdLabelMotif = GUID_1.GUID.getId();
		lHtml.push(
			'<div class="section-content m-bottom-l">',
			'  <h3 class="ie-titre-couleur">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.circonstances",
			),
			"</h3>",
			'  <div class="field-contain">',
			'      <label id="',
			lIdLabelMotif,
			'" class="ie-titre-petit">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.motif"),
			"</label>",
			(0, tag_1.tag)("ie-combo", {
				"ie-model": "comboMotif",
				"aria-labelledby": lIdLabelMotif,
			}),
			"  </div>",
		);
		const lIdCirconstance = GUID_1.GUID.getId();
		const lMaxLengthCirconstance =
			this.contexte.dataFeuilleDAppel.jsonReponse &&
			this.contexte.dataFeuilleDAppel.jsonReponse.maxlength &&
			this.contexte.dataFeuilleDAppel.jsonReponse.maxlength.circonstance
				? this.contexte.dataFeuilleDAppel.jsonReponse.maxlength.circonstance
				: 10000;
		const lCtrCirconstance = aParams.actif
			? `<ie-textareamax maxlength="${lMaxLengthCirconstance}" ie-compteurmax="${lMaxLengthCirconstance}" aria-labelledby="${lIdCirconstance}" ie-model="circonstance"></ie-textareamax>`
			: `<div aria-labelledby="${lIdCirconstance}" >${lParam.punition.circonstance || ""}</div>`;
		lHtml.push(
			'<div class="field-contain m-top-l">',
			'  <label class="ie-titre-petit" id="',
			lIdCirconstance,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("punition.detailsCirconstances"),
			"</label>",
			lCtrCirconstance,
			"</div>",
		);
		lHtml.push("</div>");
		const lIdLabelType = GUID_1.GUID.getId();
		lHtml.push(
			'<div class="section-content no-line">',
			'  <h3 class="ie-titre-couleur">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.suiteDonnee",
			),
			"</h3>",
			'  <div class="field-contain m-top-l">',
			'       <label id="',
			lIdLabelType,
			'" class="ie-titre-petit" ie-html="libelleCombo"></label>',
			'       <div ie-style="visibiliteComboType">',
			(0, tag_1.tag)("ie-combo", {
				"ie-model": "comboType",
				class: "combo-mobile full-width",
				"aria-labelledby": lIdLabelType,
			}),
		);
		lHtml.push(
			"</div>",
			'     <div ie-style="visibiliteComboAccomp">',
			(0, tag_1.tag)("ie-combo", {
				"ie-model": "comboAcc",
				class: "combo-mobile full-width",
			}),
		);
		const lIdLabelDuree = GUID_1.GUID.getId();
		lHtml.push(
			"</div>",
			"  </div>",
			'<div class="field-contain m-top-l" ie-style="visibiliteChoixDuree">',
			'<label id="',
			lIdLabelDuree,
			'" class="ie-titre-petit">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.duree"),
			"</label>",
			(0, tag_1.tag)("ie-combo", {
				"ie-model": "comboChoixDuree",
				class: "combo-mobile full-width",
				"aria-labelledby": lIdLabelDuree,
			}),
			"</div>",
		);
		lHtml.push(
			'<div class="field-contain dates-contain m-top-l" ie-style="visibiliteChoixDate">',
			'   <label class="ie-titre-petit">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.aRendre",
			) + "&nbsp;:&nbsp;",
			"</label>",
			'   <div class="date-wrapper" id="',
			this.objetCalendrier.getNom(),
			'"></div>',
			"</div>",
		);
		const lIdTaf = GUID_1.GUID.getId();
		const lMaxLengthTaf =
			this.contexte.dataFeuilleDAppel.jsonReponse &&
			this.contexte.dataFeuilleDAppel.jsonReponse.maxlength &&
			this.contexte.dataFeuilleDAppel.jsonReponse.maxlength.taf
				? this.contexte.dataFeuilleDAppel.jsonReponse.maxlength.taf
				: 1000;
		const lCtrTaf = aParams.actif
			? `<ie-textareamax aria-labelledby="${lIdTaf}" maxlength="${lMaxLengthTaf}" ie-compteurmax="${lMaxLengthTaf}" ie-model="commentaire"></ie-textareamax>`
			: `<div aria-labelledby="${lIdTaf}" >${lParam.punition.commentaire || ""}</div>`;
		lHtml.push(
			'<div class="field-contain m-top-l">',
			'<label class="ie-titre-petit" id="',
			lIdTaf,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("fenetreSaisiePunition.taf"),
			"</label>",
			lCtrTaf,
			"</div>",
		);
		lHtml.push(
			'<div style="',
			this.moteurPunitions.avecDroitPublie() ? "" : "display:none;",
			'">',
		);
		lHtml.push(
			'<div class="public-team">',
			'<i role="presentation" ie-class="getClasseCssImagePublicationPunition"></i>',
			'<ie-checkbox ie-model="checkPublierPunition">',
			ObjetTraduction_1.GTraductions.getValeur(
				"fenetreSaisiePunition.publierPunition",
			),
			"</ie-checkbox>",
			"</div>",
		);
		lHtml.push(
			'<div class="p-top-l m-left-xl">',
			ObjetTraduction_1.GTraductions.getValeur("Le_Maj"),
			'<div class="InlineBlock m-left" style="width: 12rem;">',
			`<ie-btnselecteur ie-model="modelSelecteurDatePublication" aria-label="${ObjetTraduction_1.GTraductions.getValeur("Le_Maj")}"></ie-btnselecteur>`,
			"</div>",
			"</div>",
		);
		lHtml.push("</div>");
		lHtml.push("</div>");
		const lControleur = {
			instance: lSelf,
			comboMotif: {
				init(aCombo) {
					aCombo.setDonneesObjetSaisie({
						liste: lSelf.moteurPunitions.listeMotifsOrigin,
						options: {
							multiSelection: true,
							placeHolder: ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSaisiePunition.choisirMotif",
							),
						},
					});
				},
				getIndiceSelection() {
					return lSelf.moteurPunitions.punition.listeMotifs;
				},
				event(aParametres) {
					if (aParametres.estSelectionManuelle && aParametres.listeSelections) {
						const lPunition = lSelf.moteurPunitions.punition;
						lPunition.listeMotifs =
							new ObjetListeElements_1.ObjetListeElements();
						aParametres.listeSelections.parcourir((aArticle) => {
							const lElement = MethodesObjet_1.MethodesObjet.dupliquer(
								lSelf.moteurPunitions.listeMotifsOrigin.getElementParNumeroEtGenre(
									aArticle.getNumero(),
								),
							);
							lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lPunition.listeMotifs.addElement(lElement);
						});
						if (
							lSelf.moteurPunitions.enCreation &&
							!lPunition.datePublication
						) {
							for (let I = 0; I < lPunition.listeMotifs.count(); I++) {
								const lMotif = lPunition.listeMotifs.get(I);
								if (lMotif.publication) {
									lSelf.moteurPunitions.setDatePublication(
										ObjetUtilitaireAbsence_1.ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
											lPunition.naturePunition,
										),
									);
									break;
								}
							}
						}
					}
				},
				getDisabled() {
					return !aParams.actif;
				},
			},
			comboAcc: {
				init(aCombo) {
					aCombo.setDonneesObjetSaisie({
						liste: lSelf.moteurPunitions.listeEleves,
						options: {
							placeHolder: ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSaisiePunition.choisirAccompagnateur",
							),
							labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
								"fenetreSaisiePunition.choisirAccompagnateur",
							),
						},
					});
				},
				getIndiceSelection() {
					let lIndice = -1;
					if (lSelf.moteurPunitions.punition.Accompagnateur) {
						lSelf.moteurPunitions.listeEleves.parcourir((aEleve, aIndex) => {
							if (
								lSelf.moteurPunitions.punition.Accompagnateur.getNumero() ===
								aEleve.getNumero()
							) {
								lIndice = aIndex;
								return false;
							}
						});
					}
					return lIndice;
				},
				event(aParametres) {
					if (aParametres.estSelectionManuelle && aParametres.element) {
						if (!lSelf.moteurPunitions.punition.Accompagnateur) {
							lSelf.moteurPunitions.punition.Accompagnateur =
								new ObjetElement_1.ObjetElement();
						}
						lSelf.moteurPunitions.punition.Accompagnateur.Numero =
							aParametres.element.Numero;
					}
				},
				getDisabled() {
					return !aParams.actif;
				},
			},
			comboType: {
				init(aCombo) {
					aCombo.setDonneesObjetSaisie({
						liste: lSelf.moteurPunitions.listeNature,
					});
				},
				getIndiceSelection() {
					let lIndice = -1;
					if (
						lSelf.moteurPunitions.genreRessource ===
							Enumere_Ressource_1.EGenreRessource.Punition &&
						lSelf.moteurPunitions.punition.naturePunition
					) {
						lSelf.moteurPunitions.listeNature.parcourir((aNature, aIndex) => {
							if (
								lSelf.moteurPunitions.punition.naturePunition.getNumero() ===
								aNature.getNumero()
							) {
								lIndice = aIndex;
								return false;
							}
						});
					}
					return lIndice;
				},
				event(aParametres) {
					if (aParametres.estSelectionManuelle && aParametres.element) {
						lSelf.moteurPunitions.punition.naturePunition =
							new ObjetElement_1.ObjetElement(
								aParametres.element.getLibelle(),
								aParametres.element.getNumero(),
								aParametres.element.getGenre(),
							);
						lSelf.moteurPunitions.punition.naturePunition.nbJoursDecalagePublicationParDefaut =
							aParametres.element.nbJoursDecalagePublicationParDefaut;
						lSelf.moteurPunitions.punition.naturePunition.dureeParDefaut =
							aParametres.element.dureeParDefaut;
						if (lSelf.moteurPunitions.estPunitionEnDevoir()) {
							delete lSelf.moteurPunitions.punition.duree;
						} else {
							delete lSelf.moteurPunitions.punition.date;
						}
					}
				},
				getDisabled() {
					return !aParams.actif;
				},
			},
			comboChoixDuree: {
				init(aCombo) {
					aCombo.setDonneesObjetSaisie({
						liste: lSelf.moteurPunitions.listeDurees,
					});
				},
				getIndiceSelection() {
					let lIndice = -1;
					lSelf.moteurPunitions.listeDurees.parcourir((aDuree, aIndex) => {
						if (lSelf.moteurPunitions.punition.duree === aDuree.duree) {
							lIndice = aIndex;
							return false;
						}
					});
					return lIndice;
				},
				event(aParametres) {
					if (aParametres.estSelectionManuelle && aParametres.element) {
						lSelf.moteurPunitions.punition.duree = aParametres.element.duree;
					}
				},
				getDisabled() {
					return !aParams.actif;
				},
			},
		};
		const lCtrlPunition = this.moteurPunitions.getControleur();
		if (!aParams.actif) {
			if (lCtrlPunition.checkPublie) {
				lCtrlPunition.checkPublie.getDisabled = function () {
					return true;
				};
			}
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{ pere: this },
			{
				titre: this.moteurPunitions.getTitre(),
				fermerFenetreSurClicHorsFenetre: true,
				listeBoutons: aParams.actif
					? this.moteurPunitions.listeBoutons
					: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			},
		);
		$.extend(lFenetre.controleur, lCtrlPunition, lControleur);
		lFenetre.afficher(lHtml.join("")).then((aParams) => {
			if (this.moteurPunitions.surValidation(aParams.numeroBouton)) {
				const lPunition = this.moteurPunitions.punition;
				if (!lPunition.placeDemande) {
					lPunition.placeDemande = lParamsOrig.placeDebut;
				}
				if (
					!lPunition.duree &&
					!!lPunition.naturePunition &&
					lPunition.naturePunition.dureeParDefaut
				) {
					lPunition.duree = UtilitaireDuree_1.TUtilitaireDuree.dureeEnMin(
						lPunition.naturePunition.dureeParDefaut,
					);
				}
				if (lParamsOrig && lParamsOrig.evenementApresAction) {
					lParamsOrig.evenementApresAction(aParams.numeroBouton === 2);
				}
			}
			this.moteurPunitions = null;
		});
		this.objetCalendrier.initialiser();
		const lDate =
			this.moteurPunitions.punition.date ||
			this.moteurPunitions.punition.dateProgrammation ||
			lParam.date;
		this.objetCalendrier
			.setOptionsObjetCelluleDate({
				avecBoutonsPrecedentSuivant: false,
				ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
					"fenetreSaisiePunition.aRendre",
				),
				joursValidesAnnuels: new TypeDomaine_1.TypeDomaine(
					false,
					365,
				).setValeur(
					true,
					ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
						ObjetDate_1.GDate.premiereDate,
						lDateCours,
					),
					ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
						ObjetDate_1.GDate.premiereDate,
						ObjetDate_1.GDate.derniereDate,
					),
				),
				estJoursValidesAnnuelsSelonPremiereDate: true,
			})
			.setDonnees(lDate, true);
		this.objetCalendrier.setActif(aParams.actif);
	}
	afficherListeMotif(aParam) {
		let lListeMotif;
		let lTitre;
		if (aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Absence) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.RenseignerUneAbsence",
			);
			lListeMotif = Cache_1.GCache.listeMotifsAbsenceEleve;
		} else if (
			aParam.genreAbsence === Enumere_Ressource_1.EGenreRessource.Retard
		) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.RenseignerUnRetard",
			);
			lListeMotif = Cache_1.GCache.listeMotifsRetards;
		} else {
			return;
		}
		const lDroit = this.moteur.getDroitSaisieMotif(aParam.genreAbsence);
		ObjetFenetre_FeuilleAppelRenseigner.ouvrir({
			instance: this,
			titre: lTitre,
			callback: (aNumeroBouton, aParams) => {
				if (
					aParams &&
					((aParams.bouton && aParams.bouton.valider) ||
						aParams.validationDirect)
				) {
					this.evenementListeMotifs(aParam, aParams.motif, aParams.dureeSaisie);
				}
			},
			options: {
				moteur: this.moteur,
				avecSaisieDuree: aParam.avecSaisieDuree,
				dureeMax: aParam.maxDuree || 120,
				avecSaisieMotifs: lDroit,
				genre: aParam.genreAbsence,
			},
			donnees: {
				motifs: lListeMotif,
				dureeSaisie: aParam.absence
					? aParam.absence.Duree
					: this.moteur.dureeRetard,
			},
		});
	}
}
exports.InterfaceFeuilleAppel = InterfaceFeuilleAppel;
(function (InterfaceFeuilleAppel) {
	let genreEcran;
	(function (genreEcran) {
		genreEcran["EDT"] = "EDT";
		genreEcran["feuilleDAppel"] = "feuilleDAppel";
	})(
		(genreEcran =
			InterfaceFeuilleAppel.genreEcran ||
			(InterfaceFeuilleAppel.genreEcran = {})),
	);
})(
	InterfaceFeuilleAppel ||
		(exports.InterfaceFeuilleAppel = InterfaceFeuilleAppel = {}),
);
class ObjetFenetre_FeuilleAppelRenseigner extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.dureeSaisie = 5;
		this.motif = null;
		this.validationDirect = false;
		this.optionsFA = {
			moteur: null,
			avecSaisieDuree: false,
			dureeMax: 120,
			avecSaisieMotifs: true,
			genre: Enumere_Ressource_1.EGenreRessource.Absence,
		};
	}
	setOptionsFA(aOptions) {
		$.extend(this.optionsFA, aOptions);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			retard: {
				visible: function () {
					return (
						!!aInstance &&
						!!aInstance.avecDonnees &&
						!!aInstance.optionsFA.avecSaisieDuree
					);
				},
				getValue: function () {
					return !!aInstance && aInstance.dureeSaisie
						? aInstance.dureeSaisie
						: "";
				},
				setValue: function (aValue, aObjet) {
					if (!!aObjet && !!aObjet.event) {
						aObjet.event.stopImmediatePropagation();
					}
					aInstance.dureeSaisie = aValue;
				},
				exitChange: function (aValue) {
					try {
						let lMinutes = parseInt(aValue);
						if (lMinutes < 1 || lMinutes > aInstance.optionsFA.dureeMax) {
							GApplication.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"FenetreDevoir.ValeurComprise",
									[1, aInstance.optionsFA.dureeMax],
								),
								callback: function () {
									if (lMinutes < 1) {
										lMinutes = 1;
									} else if (lMinutes > aInstance.optionsFA.dureeMax) {
										lMinutes = aInstance.optionsFA.dureeMax;
									}
									aInstance.dureeSaisie = lMinutes;
								},
							});
						} else {
							aInstance.dureeSaisie = lMinutes;
						}
					} catch (e) {
						aInstance.dureeSaisie = aInstance.moteur.dureeRetard;
					}
				},
			},
			motifs: {
				visible: function () {
					return (
						!!aInstance &&
						!!aInstance.avecDonnees &&
						!!aInstance.optionsFA.avecSaisieMotifs
					);
				},
				getLibelle: function () {
					return aInstance.optionsFA.genre ===
						Enumere_Ressource_1.EGenreRessource.Absence
						? ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SelectionnerUnMotifAbsence",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SelectionnerUnMotifRetard",
							);
				},
				combo: {
					init: function (aInstanceCombo) {
						aInstanceCombo.setOptionsObjetSaisie({});
					},
					getDonnees: function () {
						return aInstance.motifs;
					},
					getIndiceSelection: function () {
						if (aInstance.motif !== null && aInstance.motif !== undefined) {
							if (aInstance.motifs && aInstance.motifs.count()) {
								return aInstance.motifs.getIndiceParElement(aInstance.motif);
							}
						}
						return 0;
					},
					event: function (aParametres) {
						if (
							aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection
						) {
							aInstance.motif = aParametres.element;
						}
					},
				},
			},
		});
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{ class: ["field-contain"], "ie-display": "retard.visible" },
				(aContenu) => {
					const lIdLabel = GUID_1.GUID.getId();
					aContenu.push(
						(0, tag_1.tag)(
							"label",
							{ id: lIdLabel, class: ["ie-titre-petit", "fix-bloc"] },
							ObjetTraduction_1.GTraductions.getValeur(
								"AbsenceVS.SelectionnerTempsDeRetard",
							) + " :",
						),
					);
					aContenu.push(
						(0, tag_1.tag)(
							"input",
							{
								"aria-labelledby": lIdLabel,
								type: "number",
								pattern: "\\d*",
								min: 1,
								max: this.optionsFA.dureeMax,
								"ie-model": tag_1.tag.funcAttr("retard"),
								"ie-mask": "/[^0-9]/i",
							},
							"",
						),
					);
				},
			),
		);
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{
					class: ["field-contain", "with-combo"],
					"ie-display": "motifs.visible",
				},
				(aContenu) => {
					const lIdLabel = GUID_1.GUID.getId();
					aContenu.push(
						(0, tag_1.tag)(
							"label",
							{
								id: lIdLabel,
								class: ["ie-titre-petit"],
								"ie-texte": "motifs.getLibelle",
							},
							"",
						),
					);
					aContenu.push(
						(0, tag_1.tag)("ie-combo", {
							class: ["combo-mobile full-width"],
							"aria-labelledby": lIdLabel,
							"ie-model": "motifs.combo",
						}),
					);
				},
			),
		);
		return lHtml.join("");
	}
	setDonnees(aDonnees) {
		this.avecDonnees = true;
		this.motifs = aDonnees.motifs;
		this.dureeSaisie = aDonnees.dureeSaisie;
		this.afficher();
	}
	getParametresValidation(aNumeroBouton) {
		const lParametres = super.getParametresValidation(aNumeroBouton);
		$.extend(lParametres, {
			dureeSaisie: this.dureeSaisie,
			motif: this.motif,
			validationDirect: this.validationDirect,
		});
		return lParametres;
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FeuilleAppelRenseigner,
			{
				pere: aParams.instance,
				evenement: aParams.callback,
				initialiser: function (aInstance) {
					aInstance.setOptionsFA(aParams.options);
				},
			},
			{
				titre: aParams.titre,
				listeBoutons: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
						annuler: true,
						theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
						action: 0,
					},
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
						valider: true,
						theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
						action: 1,
					},
				],
				fermerFenetreSurClicHorsFenetre: true,
			},
		);
		lFenetre.setDonnees(aParams.donnees);
	}
}
class ObjetFenetre_FeuilleAppelAutres extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.optionsFA = {
			moteur: null,
			rubriques: new ObjetListeElements_1.ObjetListeElements(),
			callbackListe: function () {},
		};
	}
	setOptionsFA(aOptions) {
		$.extend(this.optionsFA, aOptions);
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			(aParametres) => {
				if (
					aParametres.genreEvenement ===
					Enumere_EvenementListe_1.EGenreEvenementListe.ModificationCBLigne
				) {
					const lGenreAbsence = aParametres.article.getGenre();
					const lTypeObservation = aParametres.article.getNumero();
					const lGenreObservation = aParametres.article.genreObservation;
					let lEtat = !aParametres.article.activation
						? Enumere_Etat_1.EGenreEtat.Suppression
						: Enumere_Etat_1.EGenreEtat.Creation;
					if (
						lGenreAbsence === Enumere_Ressource_1.EGenreRessource.RepasAPreparer
					) {
						lEtat = Enumere_Etat_1.EGenreEtat.Modification;
					}
					this.optionsFA.callbackListe({
						genreEvenement:
							ObjetFenetre_FeuilleAppelAutres.genreAction.checkbox,
						eleve: this.eleve,
						genreAbsence: lGenreAbsence,
						numeroObservation: lTypeObservation,
						genreObservation: lGenreObservation,
						etat: lEtat,
						evenementApresAction: this.miseAJourAffichage.bind(this),
					});
				}
			},
			(aListe) => {
				aListe.setOptionsListe({
					colonnes: [{ taille: "100%" }],
					skin: ObjetListe_1.ObjetListe.skin.flatDesign,
					hauteurAdapteContenu: true,
				});
			},
		);
	}
	miseAJourAffichage() {
		this._jeton_actualisationListe = true;
		this.setEtatSaisie(true);
	}
	surAfficher() {
		if (this._jeton_actualisationListe) {
			delete this._jeton_actualisationListe;
			this.getInstance(this.identListe).actualiser(true, true);
		}
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			(0, tag_1.tag)(
				"div",
				{
					class: ["fa-autres-liste"],
					id: this.getNomInstance(this.identListe),
				},
				"",
			),
		);
		return lHtml.join("");
	}
	setDonnees(aDonnees) {
		this.avecDonnees = true;
		this.eleve = aDonnees.eleve;
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_RubriquesFA_Mobile(this.optionsFA.rubriques, {
				moteur: this.optionsFA.moteur,
				genreRepas: this.optionsFA.genreRepas,
				eleve: this.eleve,
				callbackEdition: (
					aGenreAbsence,
					aNumeroObservation,
					aGenreObservation,
				) => {
					this.optionsFA.callbackListe({
						genreEvenement:
							ObjetFenetre_FeuilleAppelAutres.genreAction.modification,
						eleve: this.eleve,
						genreAbsence: aGenreAbsence,
						numeroObservation: aNumeroObservation,
						genreObservation: aGenreObservation,
						etat: undefined,
						evenementApresAction: this.miseAJourAffichage.bind(this),
					});
				},
			}),
		);
	}
	getParametresValidation(aNumeroBouton) {
		const lParametres = super.getParametresValidation(aNumeroBouton);
		$.extend(lParametres, {
			dureeSaisie: this.dureeSaisie,
			motif: this.motif,
			validationDirect: this.validationDirect,
		});
		return lParametres;
	}
	static ouvrir(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FeuilleAppelAutres,
			{
				pere: aParams.instance,
				evenement: aParams.callback,
				initialiser: function (aInstance) {
					aInstance.setOptionsFA(aParams.options);
				},
			},
			{
				titre: aParams.titre,
				listeBoutons: [
					{
						libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
						annuler: true,
						theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
						action: 0,
					},
				],
				fermerFenetreSurClicHorsFenetre: true,
			},
		);
		lFenetre.setDonnees(aParams.donnees);
		return lFenetre;
	}
}
(function (ObjetFenetre_FeuilleAppelAutres) {
	let genreAction;
	(function (genreAction) {
		genreAction["checkbox"] = "ffaa_checkBox";
		genreAction["modification"] = "ffaa_modification";
	})(
		(genreAction =
			ObjetFenetre_FeuilleAppelAutres.genreAction ||
			(ObjetFenetre_FeuilleAppelAutres.genreAction = {})),
	);
})(ObjetFenetre_FeuilleAppelAutres || (ObjetFenetre_FeuilleAppelAutres = {}));
class DonneesListe_RubriquesFA_Mobile extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeRubriques, aParams) {
		super(aListeRubriques);
		this.moteur = aParams.moteur;
		this.eleve = aParams.eleve;
		this.genreRepas = aParams.genreRepas;
		this.evenementEdition = aParams.callbackEdition;
		this.setOptions({
			avecBoutonActionLigne: false,
			flatDesignMinimal: !IE.estMobile,
			avecCB: true,
			avecEvnt_CB: true,
			avecCocheCBSurLigne: true,
			avecSelection: false,
			avecDeploiement: false,
			avecTri: false,
			avecEvnt_Selection: false,
			avecEvnt_SelectionClick: false,
			avecEllipsis: false,
		});
	}
	getControleur(aInstance, aInstanceListe) {
		return $.extend(true, super.getControleur(aInstance, aInstanceListe), {
			modifierAbsence: {
				event: function (
					aGenreAbsence,
					aNumeroObservation,
					aGenreObservation,
					aEvent,
				) {
					if (!!aEvent) {
						aEvent.stopImmediatePropagation();
					}
					aInstance.evenementEdition(
						aGenreAbsence,
						aNumeroObservation,
						aGenreObservation,
					);
				},
			},
		});
	}
	getDisabledCB(aParams) {
		const lEstActif = this.moteur.genreAbsenceDEleveEstEditable(
			this.eleve.getNumero(),
			aParams.article.getGenre(),
			aParams.article.getNumero(),
			aParams.article.genreObservation,
		);
		return !lEstActif;
	}
	estLigneOff(aParams) {
		const lEstActif = this.moteur.genreAbsenceDEleveEstEditable(
			this.eleve.getNumero(),
			aParams.article.getGenre(),
			aParams.article.getNumero(),
			aParams.article.genreObservation,
		);
		return !lEstActif;
	}
	getTitreZonePrincipale(aParams) {
		switch (aParams.article.getGenre()) {
			case Enumere_Ressource_1.EGenreRessource.RepasAPreparer: {
				if (
					this.genreRepas ===
					TypeGenreRepasEleve_1.TypeGenreRepasEleve.RepasMidi
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InscritAuRepasMidi",
					);
				} else {
					return ObjetTraduction_1.GTraductions.getValeur(
						"AbsenceVS.InscritAuRepasSoir",
					);
				}
			}
			case Enumere_Ressource_1.EGenreRessource.Dispense: {
				const lDemandeDispense = this.moteur.getDemandeDeDispense(
					this.eleve.getNumero(),
				);
				const lDispense = this.moteur.getDispense(
					this.eleve.getNumero(),
					false,
				);
				if (lDemandeDispense && !lDispense) {
					const lEstRefusee =
						lDemandeDispense.estRefusee && lDemandeDispense.estTraitee;
					if (lEstRefusee) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"AbsenceVS.demandeDispense.dspenseDemandeRefusee",
						);
					} else {
						return `<span class="color-red-foncee">${ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.demandeDispense.dispenseDemandeATraiter")}</span>`;
					}
				}
				return aParams.article.getLibelle();
			}
			default:
				return aParams.article.getLibelle();
		}
	}
	getZoneComplementaire(aParams) {
		const lHtml = [];
		if (
			aParams.article.getGenre() !==
			Enumere_Ressource_1.EGenreRessource.RepasAPreparer
		) {
			const lEleve = this.moteur.listeEleves.getElementParNumero(
				this.eleve.getNumero(),
			);
			const lAbsence = this.moteur.getAbsence(
				lEleve,
				aParams.article.getGenre(),
				this.moteur.placeSaisieDebut,
				aParams.article.getNumero(),
			);
			if (!!lAbsence) {
				lHtml.push(
					(0, tag_1.tag)(
						"ie-btnicon",
						{
							class: "icon_edit",
							"ie-model": tag_1.tag.funcAttr("modifierAbsence", [
								aParams.article.getGenre(),
								aParams.article.getNumero(),
								aParams.article.genreObservation,
							]),
							"aria-label": "modifier",
						},
						" ",
					),
				);
			}
		}
		return lHtml.join("");
	}
	getValueCB(aParams) {
		const lEleve = this.moteur.listeEleves.getElementParNumero(
			this.eleve.getNumero(),
		);
		const lAbsence = this.moteur.getAbsence(
			lEleve,
			aParams.article.getGenre(),
			this.moteur.placeSaisieDebut,
			aParams.article.getNumero(),
		);
		if (
			aParams.article.getGenre() ===
			Enumere_Ressource_1.EGenreRessource.RepasAPreparer
		) {
			return lAbsence.type === TTypePreparerRepas_1.TTypePreparerRepas.prOui;
		} else {
			return !!lAbsence;
		}
	}
	setValueCB(aParams, aValue) {
		aParams.article.activation = aValue;
	}
}
