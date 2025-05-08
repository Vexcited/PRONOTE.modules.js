const { TypeDroits } = require("ObjetDroitsPN.js");
const {
	ObjetRequetePageSaisieAbsences,
} = require("ObjetRequetePageSaisieAbsences.js");
const {
	ObjetRequetePageSaisieAbsences_General,
} = require("ObjetRequetePageSaisieAbsences_General.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const {
	ObjetAffichagePageEmploiDuTemps_Journalier,
} = require("InterfacePageEmploiDuTemps_Journalier.js");
const { GDate } = require("ObjetDate.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetMoteurAbsences } = require("ObjetMoteurAbsences.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
const { TypeDomaine } = require("TypeDomaine.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetMoteurPunitions } = require("ObjetMoteurPunitions.js");
const { ObjetRequeteSaisieAbsences } = require("ObjetRequeteSaisieAbsences.js");
const { ObjetUtilitaireAbsence } = require("ObjetUtilitaireAbsence.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
const { MoteurSelectionContexte } = require("MoteurSelectionContexte.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	DonneesListe_FeuilleDAppel_Mobile,
} = require("DonneesListe_FeuilleDAppel_Mobile.js");
const { GCache } = require("Cache.js");
const { GUID } = require("GUID.js");
const { tag } = require("tag.js");
const { GChaine } = require("ObjetChaine.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const {
	ObjetFenetre_EditionObservation,
} = require("ObjetFenetre_EditionObservation.js");
const { ObjetFenetre_Infirmerie } = require("ObjetFenetre_Infirmerie.js");
const { GImage } = require("ObjetImage.js");
const { TTypePreparerRepas } = require("TTypePreparerRepas.js");
const { TypeGenreRepasEleve } = require("TypeGenreRepasEleve.js");
const ObjetFenetre_FicheEleve = require("ObjetFenetre_FicheEleve.js");
const { EGenreAction } = require("Enumere_Action.js");
class InterfaceFeuilleAppel extends ObjetAffichagePageEmploiDuTemps_Journalier {
	constructor(...aParams) {
		super(...aParams);
		this.avecDonnees = false;
		this.avecAnciennesFeuilleDAppel = GApplication.droits.get(
			TypeDroits.absences.avecAnciennesFeuilleDAppel,
		);
		this.jourConsultUniquement = false;
		this.listeDates = GApplication.droits.get(
			TypeDroits.absences.listeDatesSaisieAbsence,
		);
		this.listeDates.setTri([ObjetTri.init("Date", EGenreTriElement.Croissant)]);
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
			: GDate.getDateCourante(true);
		this._coursProvenantDeNavigation = null;
		if (GEtatUtilisateur.getNavigationCours()) {
			this.derniereDate = GEtatUtilisateur.getNavigationCours().dateDebut;
			this._coursProvenantDeNavigation = GEtatUtilisateur.getNavigationCours();
		}
		GEtatUtilisateur.setDerniereDate(this.derniereDate);
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
		this.listeCours = new ObjetListeElements();
		this.listeEleves = new ObjetListeElements();
		this.coursCourant = new ObjetElement();
		this.moteur = new ObjetMoteurAbsences();
		this.moteurPunitions = null;
		this.moteurInfirmerie = null;
		this.moteurEdition = null;
		this.moteurSelectionContexte = new MoteurSelectionContexte();
		this.fenetreFeuilleAppelAutres = null;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			btnRetourEcranPrec: {
				event: function () {
					this.revenirSurEcranPrecedent();
				}.bind(aInstance),
			},
			retourEcranPrecSurContenu: function () {
				$(this.node).eventValidation(
					function () {
						this.revenirSurEcranPrecedent();
					}.bind(aInstance),
				);
			},
			footer: {
				visible: function () {
					return (
						aInstance.avecDonnees &&
						aInstance.avecAppel &&
						aInstance.contexte &&
						aInstance.getCtxEcran({
							niveauEcran: aInstance.contexte.niveauCourant,
						}) === InterfaceFeuilleAppel.genreEcran.feuilleDAppel
					);
				},
				infosEleves: function () {
					return aInstance.avecDonnees && aInstance.avecAppel
						? composeNbElevePresent.call(aInstance)
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
								this.controleur.footer.demandesDispense.visible() &&
								aInstance.moteur.avecDemandesDispenseNonTraitee(
									aInstance.contexte.dataFeuilleDAppel.jsonReponse
										.listeDemandesDispense,
								)
							) {
								const lRes =
									await aInstance.moteur.afficherMessageConfirmationAppelTermineAvecDemandeDispense();
								if (lRes !== EGenreAction.Valider) {
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
							if (this.controleur.footer.demandesDispense.visible()) {
								aInstance.moteur.ouvrirFenetreDemandeDispense(
									aInstance.contexte.dataFeuilleDAppel.jsonReponse
										.listeDemandesDispense,
									aInstance.callbackFenetreDemandeDispense.bind(aInstance),
								);
							}
						},
					},
					html() {
						if (this.controleur.footer.demandesDispense.visible()) {
							const lNbr =
								aInstance.contexte.dataFeuilleDAppel.jsonReponse.listeDemandesDispense.count();
							return lNbr === 1
								? GTraductions.getValeur(
										"AbsenceVS.demandeDispense.1DemandeATraiter",
									)
								: GTraductions.getValeur(
										"AbsenceVS.demandeDispense.xDemandesATraiter",
										[lNbr],
									);
						}
						return "";
					},
					visible() {
						return (
							aInstance.contexte &&
							aInstance.contexte.dataFeuilleDAppel &&
							aInstance.contexte.dataFeuilleDAppel &&
							aInstance.contexte.dataFeuilleDAppel.jsonReponse &&
							aInstance.contexte.dataFeuilleDAppel.jsonReponse
								.listeDemandesDispense &&
							aInstance.contexte.dataFeuilleDAppel.jsonReponse.listeDemandesDispense.count() >
								0
						);
					},
				},
			},
		});
	}
	construireInstances() {
		super.construireInstances();
		this.identPage = this.add(
			ObjetListe,
			function (aParametres) {
				if (
					aParametres.genreEvenement === EGenreEvenementListe.SelectionClick
				) {
					ObjetFenetre_FicheEleve.ouvrir({
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
			this.getInstance(this.identPageListe).getNom(),
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
			this.getInstance(this.identPage).getNom(),
			'" class="fa-detail-liste"></div>',
		);
		H.push(`<footer class="fa-detail-footer" ie-display="footer.visible">`);
		H.push(
			'<div class="flex-contain flex-center justify-between fa-ft-appel-demande" ie-if="footer.demandesDispense.visible">',
			`<p class="text-util-rouge-foncee" ie-html="footer.demandesDispense.html"></p>`,
			`<ie-bouton ie-model="footer.demandesDispense.btn" class="themeBoutonNeutre small-bt">${GTraductions.getValeur("AbsenceVS.traiter")}</ie-bouton>`,
			"</div>",
		);
		H.push(
			`<div class="flex-contain justify-between">`,
			`<div class="fa-ft-appel-infos" ie-html="footer.infosEleves"></div>`,
			`<div class="fa-ft-appel-term">`,
			`<div>${GTraductions.getValeur("AbsenceVS.AppelFait")}</div>`,
			`<ie-switch ie-model="footer.appelTermine">`,
			`<span>${GTraductions.getValeur("Non")}</span>`,
			`<span>${GTraductions.getValeur("Oui")}</span>`,
			`</ie-switch>`,
			`</div>`,
			`</div>`,
		);
		H.push(`</footer>`);
		H.push("</aside>");
		H.push("</div>");
		return H.join("");
	}
	detruireInstances() {}
	recupererDonnees() {
		new ObjetRequetePageSaisieAbsences_General(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete();
	}
	actionSurRecupererDonnees(aDonnees) {
		this.listeMotifs = aDonnees.listeMotifs;
		this.listeNaturePunition = aDonnees.listeNaturePunition;
		this.listeNatureExclusion = aDonnees.listeNatureExclusion;
		super.recupererDonnees();
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case InterfaceFeuilleAppel.genreEcran.EDT:
				return _afficherEcranEDT.call(this, this.contexte);
			case InterfaceFeuilleAppel.genreEcran.feuilleDAppel:
				return _afficherEcranFA.call(this, this.contexte, true);
			default:
		}
	}
	construireBandeauEcranFA() {
		let lListeCoursCmb = _getListePourCombo(this.listeCours);
		lListeCoursCmb = this.moteurSelectionContexte.formatterListeCours({
			listeCours: lListeCoursCmb,
			genreTri: EGenreTriElement.Croissant,
		});
		const lCours = lListeCoursCmb.getElementParElement(this.contexte.cours);
		const H = [];
		H.push(
			tag(
				"div",
				{ class: "fa_bandeauEcran_selection" },
				_composeHtmlCours.call(this, lCours),
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
					new ObjetUtilitaireAbsence().getIndiceCoursParPlace(
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
		new ObjetRequeteSaisieAbsences(
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
				_afficherEcranFA.call(this, this.contexte, true);
			} else {
				this.recupererDonnees();
			}
		}
	}
	actualiserJourConsultUniquement(aDate) {
		this.jourConsultUniquement =
			this.listeDates.getIndiceElementParFiltre((aElement) => {
				return GDate.estJourEgal(aElement.Date, aDate);
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
					aParam.genreAbsence === EGenreRessource.Retard
						? !!aDuree
							? aDuree
							: this.moteur.dureeRetard
						: null,
					null,
					aParam.typeObservation,
					aParam.listeMotifs,
				);
		if (!!lAbsence) {
			lAbsence.listeMotifs = new ObjetListeElements();
			if (aMotif) {
				lAbsence.listeMotifs.addElement(MethodesObjet.dupliquer(aMotif));
			}
			this.getInstance(this.identPage).actualiser(true, true);
			lAbsence.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
		} else {
		}
	}
}
InterfaceFeuilleAppel.genreEcran = {
	EDT: "EDT",
	feuilleDAppel: "feuilleDAppel",
};
function _getListePourCombo(aListe) {
	const lListeCours = new ObjetListeElements();
	aListe.parcourir((aElement) => {
		if (aElement.coursMultiple !== true && aElement.existeNumero()) {
			const lElement = MethodesObjet.dupliquer(aElement);
			lElement.Visible = true;
			lListeCours.add(lElement);
		}
	});
	lListeCours.setTri([
		ObjetTri.init("DateDuCours", EGenreTriElement.Decroissant),
		ObjetTri.init("Debut", EGenreTriElement.Decroissant),
	]);
	lListeCours.trier();
	return lListeCours;
}
function _afficherEcranEDT(aContexte) {
	return _reinitialiserAffichage.call(this, aContexte.date);
}
function _reinitialiserAffichage(aDate) {
	return new Promise((aResolve) => {
		this.contexte = $.extend(this.contexte, {
			date: null,
			cours: null,
			indice: null,
			dataFeuilleDAppel: null,
		});
		this.NumeroSemaine = null;
		GEtatUtilisateur.setDerniereDate(aDate);
		this.getInstance(this.identPage).setDonnees();
		this.initialiser();
		aResolve();
	});
}
function _afficherEcranFA(aContexte, aActualiserBandeau) {
	this.coursCourant = aContexte.cours;
	let lMessage;
	if (this.coursCourant) {
		lMessage = "";
		if (this.coursCourant.estAnnule) {
			lMessage = GTraductions.getValeur("AbsenceVS.AppelCoursAnnule");
		} else if (
			!this.coursCourant.utilisable &&
			!this.coursCourant.estSortiePedagogique
		) {
			lMessage = GTraductions.getValeur(
				"AbsenceVS.AppelCoursNonUtilisable",
			).replaceRCToHTML();
		}
		if (lMessage) {
			if (aActualiserBandeau) {
				switch (
					this.getCtxEcran({ niveauEcran: this.contexte.niveauCourant })
				) {
					case InterfaceFeuilleAppel.genreEcran.EDT:
						_majBandeauEnteteEDTtoFA.call(this, this.contexte);
						break;
					case InterfaceFeuilleAppel.genreEcran.feuilleDAppel:
						_majBandeauEnteteFA.call(this, this.contexte);
						break;
				}
			}
			this.getInstance(this.identPage).effacer(
				`<div class="fa-message">${lMessage}</div>`,
			);
			return;
		}
	}
	return new ObjetRequetePageSaisieAbsences(this)
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
						_majBandeauEnteteEDTtoFA.call(this, aContexte);
						break;
					case InterfaceFeuilleAppel.genreEcran.feuilleDAppel:
						_majBandeauEnteteFA.call(this, aContexte);
						break;
				}
			}
			_afficherFA.call(this);
		});
}
function _majBandeauEnteteEDTtoFA() {
	this.setHtmlStructureAffichageBandeau(this.construireBandeauEcranFA());
}
function _composeHtmlCours(aCours) {
	const H = [];
	const lPublics = [];
	const lParties = [];
	const lPlus = [];
	let i = 0;
	aCours.ListeContenus.parcourir((aElement) => {
		if (i < 3) {
			switch (aElement.getGenre()) {
				case EGenreRessource.Classe:
				case EGenreRessource.Groupe:
					lPublics.push(
						`<span class="fa_ic_classe">${aElement.getLibelle()}</span>`,
					);
					i++;
					break;
				case EGenreRessource.PartieDeClasse:
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
		lSousTitre += `<div class="fa_ic_sup fa_ic_sortie InlineBlock">- ${GTraductions.getValeur("EDT.AbsRess.SortiePedagogique")}</div>`;
	}
	if (aCours.matiere && aCours.matiere.getLibelle()) {
		lSousTitre += `<div class="fa_ic_sup fa_ic_matiere InlineBlock">- ${aCours.matiere.getLibelle()}</div>`;
	}
	if (aCours.NomImageAppelFait) {
		lSousTitre += `<div class="fa_ic_sup fa_ic_image_af InlineBlock">${GImage.composeImage("Image_" + aCours.NomImageAppelFait, 16)}</div>`;
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
function _majBandeauEnteteFA() {
	this.setHtmlStructureAffichageBandeau(this.construireBandeauEcranFA());
}
function composeNbElevePresent() {
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
					? GTraductions.getValeur("AbsenceVS.VerrouAppelFaitSP")
					: GTraductions.getValeur("AbsenceVS.HintVerrouille")) +
				'"></div>',
		);
	}
	H.push(
		lObjNbEleve.nbElevesPresents > 1
			? GChaine.format(
					lEstSortiePeda
						? GTraductions.getValeur("AbsenceVS.ElevesPresentsSP")
						: GTraductions.getValeur("AbsenceVS.ElevesPresents"),
					[lObjNbEleve.nbElevesPresents],
				)
			: lObjNbEleve.nbElevesPresents === 1
				? lEstSortiePeda
					? GTraductions.getValeur("AbsenceVS.ElevePresentSP")
					: GTraductions.getValeur("AbsenceVS.ElevePresent")
				: lEstSortiePeda
					? GTraductions.getValeur("AbsenceVS.AucunElevePresentSP")
					: GTraductions.getValeur("AbsenceVS.AucunElevePresent"),
	);
	if (
		this.listeElevesStage &&
		this.listeElevesStage.count &&
		this.listeElevesStage.count() > 0
	) {
		H.push(
			'&nbsp;-&nbsp;<span title="',
			GChaine.toTitle(this.listeElevesStage.getTableauLibelles().join("\n")),
			'">',
			this.listeElevesStage.count() === 1
				? GTraductions.getValeur("Absence.EleveEnStage")
				: GChaine.format(GTraductions.getValeur("Absence.ElevesEnStage"), [
						this.listeElevesStage.count(),
					]),
			"</span>",
		);
	}
	if (this.elevesDetaches && this.elevesDetaches.str) {
		H.push(
			'&nbsp;-&nbsp;<span title="',
			GChaine.toTitle(this.elevesDetaches.hint),
			'">' + this.elevesDetaches.str + "</span>",
		);
	}
	return H.join("");
}
function _afficherFA() {
	this.avecAppel = false;
	const aData = this.contexte.dataFeuilleDAppel;
	this.placeGrilleDebut = aData.placeGrilleDebut;
	this.listeEleves = aData.listeEleves;
	this.listeClasses = aData.listeClasses;
	this.listeElevesStage = aData.listeElevesEnStage;
	let aucunEleveAffiche = true;
	this.listeEleves.parcourir((aEleve) => {
		if (!!aEleve.ListeAbsences) {
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
			lUtilisateur.getGenre() === EGenreRessource.Enseignant
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
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieAbsence),
			avecSaisieRetard:
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieRetard),
			avecSaisieDispense:
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: GApplication.droits.get(TypeDroits.dispenses.saisie),
			suppressionAbsenceDeVS: this.avecSuppressionAutreAbsence,
			suppressionRetardDeVS: this.avecModifRetardVS,
			saisieAbsenceOuverte: GApplication.droits.get(
				TypeDroits.absences.avecSaisieAbsenceOuverte,
			),
			saisieHorsCours:
				GEtatUtilisateur.getGenreOnglet() ===
				EGenreOnglet.SaisieAbsences_Appel_Professeur
					? true
					: GApplication.droits.get(TypeDroits.absences.avecSaisieHorsCours),
			saisieDefautCarnet: GApplication.droits.get(
				TypeDroits.absences.avecSaisieDefautCarnet,
			),
		},
	});
	if (!aucunEleveAffiche) {
		this.avecAppel = true;
		this.getInstance(this.identPage)
			.setOptionsListe({
				skin: ObjetListe.skin.flatDesign,
				colonnes: DonneesListe_FeuilleDAppel_Mobile.getColonnes(),
				boutons: [],
				forcerOmbreScrollTop: true,
			})
			.setDonnees(
				new DonneesListe_FeuilleDAppel_Mobile(this.moteur, {
					evenement: function (aGenreEvent, aParams) {
						switch (aGenreEvent) {
							case DonneesListe_FeuilleDAppel_Mobile.genreAction
								.saisieAbsence: {
								const lParams = Object.assign(
									{
										fonctionSurOuvrirListeMotif: afficherListeMotif.bind(this),
										fonctionApresPasPossible: function () {},
										fonctionApresModification: function () {
											this.getInstance(this.identPage).actualiser(true, true);
											this.setEtatSaisie(true);
										}.bind(this),
									},
									aParams,
								);
								this.moteur.surEvenementSaisieAbsence(lParams);
								break;
							}
							case DonneesListe_FeuilleDAppel_Mobile.genreAction.saisieAutres: {
								const lListe = aParams.moteur.listeColonnes.getListeElements(
									(aElement) => {
										let lEstColonneActif =
											![
												EGenreRessource.Absence,
												EGenreRessource.Retard,
											].includes(aElement.getGenre()) &&
											aElement.Actif === true;
										if (
											lEstColonneActif &&
											aElement.getGenre() === EGenreRessource.RepasAPreparer
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
												lAbsence.type !== TTypePreparerRepas.prNonDP;
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
											callback: function (aNumeroBouton, aParams) {
												if (
													aParams &&
													aParams.bouton &&
													aParams.bouton.valider
												) {
												}
											}.bind(this),
											options: {
												moteur: this.moteur,
												rubriques: lListe,
												genreRepas: lGenreRepas,
												callbackListe: function (aParametres) {
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
														ObjetFenetre_FeuilleAppelAutres.genreAction.checkbox
													) {
														if (lEstActif) {
															lObjet.fonctionApresModification = function (
																aParams,
															) {
																if (
																	aParams.typeAbsence ===
																		EGenreRessource.Observation &&
																	[
																		TypeGenreObservationVS.OVS_ObservationParent,
																		TypeGenreObservationVS.OVS_Encouragement,
																	].includes(aParams.genreObservation) &&
																	aParams.typeSaisie === EGenreEtat.Creation
																) {
																	afficherEdition.call(this, aParams);
																} else {
																	if (aParams && aParams.evenementApresAction) {
																		aParams.evenementApresAction();
																	}
																}
															}.bind(this, lObjet);
															if (aParametres.etat === EGenreEtat.Creation) {
																switch (aParametres.genreAbsence) {
																	case EGenreRessource.Infirmerie:
																		afficherInfirmerie.call(this, lObjet);
																		break;
																	case EGenreRessource.Punition:
																	case EGenreRessource.Exclusion:
																		afficherPunition.call(this, lObjet);
																		break;
																	case EGenreRessource.Dispense: {
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
															case EGenreRessource.Infirmerie:
																afficherInfirmerie.call(this, lObjet);
																break;
															case EGenreRessource.Punition:
															case EGenreRessource.Exclusion:
																afficherPunition.call(this, lObjet);
																break;
															default:
																afficherEdition.call(this, lObjet);
																break;
														}
													}
												}.bind(this),
											},
											donnees: { eleve: aParams.eleve },
										});
								}
								break;
							}
							case DonneesListe_FeuilleDAppel_Mobile.genreAction
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
									evenementApresAction: function (aAvecActualisation) {
										if (aAvecActualisation) {
											this.getInstance(this.identPage).actualiser(true, true);
											this.setEtatSaisie(true);
										}
									}.bind(this),
									fonctionSurOuvrirListeMotif: function () {},
									fonctionApresPasPossible: function () {},
									fonctionApresModification: function () {
										this.getInstance(this.identPage).actualiser(true, true);
										this.setEtatSaisie(true);
									}.bind(this),
								};
								switch (aParams.genre) {
									case EGenreRessource.Infirmerie:
										afficherInfirmerie.call(this, lObjet);
										break;
									case EGenreRessource.Punition:
									case EGenreRessource.Exclusion:
										afficherPunition.call(this, lObjet);
										break;
									case EGenreRessource.RepasAPreparer:
										if (
											lAbsence.modifiable &&
											lAbsence.type !== TTypePreparerRepas.prNonDP
										) {
											this.moteur.surEvenementSaisieAbsence(lObjet);
										}
										break;
									default:
										afficherEdition.call(this, lObjet);
										break;
								}
								break;
							}
							default:
								break;
						}
					}.bind(this),
					enseignant:
						lUtilisateur.getGenre() === EGenreRessource.Enseignant
							? lUtilisateur
							: null,
					avecDeploiement: false,
					avecEvnt_Selection: true,
					avecDetails: true,
					avecEllipsis: false,
					avecInfoClasse: this.listeClasses.count() > 1,
				}),
				undefined,
				{ conserverPositionScroll: true },
			);
	} else {
		this.getInstance(this.identPage).effacer(
			this.composeAucuneDonnee(GTraductions.getValeur("Absence.AucunEleve")),
		);
	}
}
function afficherEdition(aParams) {
	const lAbsence = this.moteur.getAbsence(
		aParams.eleve,
		aParams.typeAbsence,
		this.moteur.placeSaisieDebut,
		aParams.typeObservation,
	);
	let lColonneObservation;
	if (!!lAbsence && lAbsence.getGenre() === EGenreRessource.Dispense) {
		lColonneObservation = this.moteur.listeColonnes.getElementParGenre(
			EGenreRessource.Dispense,
		);
	} else {
		lColonneObservation = this.moteur.listeColonnes.getElementParNumero(
			aParams.typeObservation,
		);
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
	};
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_EditionObservation,
		{
			pere: this,
			evenement: function (
				aSaisie,
				aGenreAbsence,
				aGenreObservation,
				aEstBtnValidation,
			) {
				if (aSaisie) {
					if (aParams && aParams.evenementApresAction) {
						aParams.evenementApresAction(aEstBtnValidation);
					}
				}
			}.bind(this),
		},
		{ fermerFenetreSurClicHorsFenetre: true, avecCroixFermeture: false },
	);
	lFenetre.setDonnees(lObjet);
	lFenetre.afficher();
}
function afficherInfirmerie(aParams) {
	const LBorneMin = this.moteur.placeSaisieDebut;
	const LBorneMax = this.moteur.placeSaisieFin;
	const lAbsence = this.moteur.getAbsence(
		aParams.eleve,
		EGenreRessource.Infirmerie,
		aParams.placeDebut,
	);
	this.moteur._majListeElevesVisible();
	const lParam = {
		numeroEleve: aParams.numeroEleve,
		placeDebut: aParams.placeDebut,
		placeFin: aParams.placeFin,
		borneMin: GDate.placeAnnuelleEnDate(LBorneMin),
		borneMax: GDate.placeAnnuelleEnDate(LBorneMax, true),
		absence: lAbsence,
		publierParDefautPassageInf: this.publierParDefautPassageInf,
		avecEditionPublication: false,
		actif: aParams.actif === undefined ? true : aParams.actif,
	};
	const lListeAccompagnants = MethodesObjet.dupliquer(this.listeEleves);
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_Infirmerie,
		{
			pere: this,
			evenement: function (aNumeroBouton, aNumeroEleve, aNewAbs) {
				if (aNumeroBouton !== 0 && aNumeroBouton !== -1) {
					if (aNewAbs) {
						this.listeEleves
							.getElementParNumero(aNumeroEleve)
							.setEtat(EGenreEtat.Modification);
						this.listeEleves
							.getElementParNumero(aNumeroEleve)
							.ListeAbsences.addElement(aNewAbs);
					}
					if (aParams && aParams.evenementApresAction) {
						aParams.evenementApresAction(true);
					}
				}
			},
		},
		{
			titre: GTraductions.getValeur("AbsenceVS.Titre_FenetreInfirmerie"),
			fermerFenetreSurClicHorsFenetre: true,
		},
	);
	lFenetre.setDonnees(lListeAccompagnants, lParam);
}
function afficherPunition(aParams) {
	const lParamsOrig = aParams;
	const lAttribut =
		aParams.genreAbsence === EGenreRessource.Punition
			? "listePunitions"
			: "ListeAbsences";
	const lDateCours = this.moteur.Cours ? this.moteur.Cours.DateDuCours : null;
	const lParam = {
		eleve: aParams.eleve,
		listeEleves:
			aParams.genreAbsence === EGenreRessource.Punition
				? null
				: this.listeEleves,
		punition:
			!!aParams && aParams.typeSaisie !== EGenreEtat.Creation
				? aParams.eleve[lAttribut].getElementParGenre(aParams.genreAbsence)
				: null,
		listeMotifs: this.listeMotifs,
		listeNature:
			aParams.genreAbsence === EGenreRessource.Punition
				? this.listeNaturePunition
				: this.listeNatureExclusion,
		genreRessource: aParams.genreAbsence,
		placeSaisieDebut: aParams.placeDebut,
		placeSaisieFin: aParams.placeFin,
		date: lDateCours,
	};
	this.moteurPunitions = new ObjetMoteurPunitions(this);
	this.moteurPunitions.init(lParam);
	this.objetCalendrier = new ObjetCelluleDate(
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
		if (!GDate.joursOuvres.getValeur(lDay)) {
			lBlackDays.push(lDay);
		}
	}
	const lIdLabelMotif = GUID.getId();
	lHtml.push(
		'<div class="section-content m-bottom-l">',
		'  <h3 class="ie-titre-couleur">',
		GTraductions.getValeur("fenetreSaisiePunition.circonstances"),
		"</h3>",
		'  <div class="field-contain">',
		'      <label id="',
		lIdLabelMotif,
		'" class="ie-titre-petit">',
		GTraductions.getValeur("fenetreSaisiePunition.motif"),
		"</label>",
		tag("ie-combo", {
			"ie-model": "comboMotif",
			"aria-labelledby": lIdLabelMotif,
		}),
		"  </div>",
	);
	const lIdCirconstance = GUID.getId();
	const lCtrCirconstance = aParams.actif
		? `<ie-textareamax aria-labelledby="${lIdCirconstance}" ie-model="circonstance"></ie-textareamax>`
		: `<div aria-labelledby="${lIdCirconstance}" class="round-style">${lParam.punition.circonstance || ""}</div>`;
	lHtml.push(
		'<div class="field-contain m-top-l">',
		'  <label class="ie-titre-petit" id="',
		lIdCirconstance,
		'">',
		GTraductions.getValeur("punition.detailsCirconstances"),
		"</label>",
		lCtrCirconstance,
		"</div>",
	);
	lHtml.push("</div>");
	const lIdLabelType = GUID.getId();
	lHtml.push(
		'<div class="section-content no-line">',
		'  <h3 class="ie-titre-couleur">',
		GTraductions.getValeur("fenetreSaisiePunition.suiteDonnee"),
		"</h3>",
		'  <div class="field-contain m-top-l">',
		'       <label id="',
		lIdLabelType,
		'" class="ie-titre-petit" ie-html="libelleCombo"></label>',
		'       <div ie-style="visibiliteComboType">',
		tag("ie-combo", {
			"ie-model": "comboType",
			class: "combo-mobile full-width",
			"aria-labelledby": lIdLabelType,
		}),
	);
	lHtml.push(
		"</div>",
		'     <div ie-style="visibiliteComboAccomp">',
		tag("ie-combo", {
			"ie-model": "comboAcc",
			class: "combo-mobile full-width",
		}),
	);
	const lIdLabelDuree = GUID.getId();
	lHtml.push(
		"</div>",
		"  </div>",
		'<div class="field-contain m-top-l" ie-style="visibiliteChoixDuree">',
		'<label id="',
		lIdLabelDuree,
		'" class="ie-titre-petit">',
		GTraductions.getValeur("fenetreSaisiePunition.duree"),
		"</label>",
		tag("ie-combo", {
			"ie-model": "comboChoixDuree",
			class: "combo-mobile full-width",
			"aria-labelledby": lIdLabelDuree,
		}),
		"</div>",
	);
	lHtml.push(
		'<div class="field-contain dates-contain m-top-l" ie-style="visibiliteChoixDate">',
		'   <label class="ie-titre-petit">',
		GTraductions.getValeur("fenetreSaisiePunition.aRendre") + "&nbsp;:&nbsp;",
		"</label>",
		'   <div class="date-wrapper" id="',
		this.objetCalendrier.getNom(),
		'"></div>',
		"</div>",
	);
	const lIdTaf = GUID.getId();
	const lCtrTaf = aParams.actif
		? `<ie-textareamax aria-labelledby="${lIdTaf}" ie-model="commentaire"></ie-textareamax>`
		: `<div aria-labelledby="${lIdTaf}" class="round-style">${lParam.punition.commentaire || ""}</div>`;
	lHtml.push(
		'<div class="field-contain m-top-l">',
		'<label class="ie-titre-petit" id="',
		lIdTaf,
		'">',
		GTraductions.getValeur("fenetreSaisiePunition.taf"),
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
		'<i role="img" ie-class="getClasseCssImagePublicationPunition"></i>',
		'<ie-checkbox ie-model="checkPublierPunition">',
		GTraductions.getValeur("fenetreSaisiePunition.publierPunition"),
		"</ie-checkbox>",
		"</div>",
	);
	lHtml.push(
		'<div class="p-top-l m-left-xl">',
		GTraductions.getValeur("Le_Maj"),
		'<div class="InlineBlock m-left" style="width: 12rem;">',
		`<ie-btnselecteur ie-model="modelSelecteurDatePublication" aria-label="${GTraductions.getValeur("Le_Maj")}"></ie-btnselecteur>`,
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
						placeHolder: GTraductions.getValeur(
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
					lPunition.listeMotifs = new ObjetListeElements();
					aParametres.listeSelections.parcourir((aArticle) => {
						const lElement = MethodesObjet.dupliquer(
							lSelf.moteurPunitions.listeMotifsOrigin.getElementParNumeroEtGenre(
								aArticle.getNumero(),
							),
						);
						lElement.setEtat(EGenreEtat.Modification);
						lPunition.listeMotifs.addElement(lElement);
					});
					if (lSelf.moteurPunitions.enCreation && !lPunition.datePublication) {
						for (let I = 0; I < lPunition.listeMotifs.count(); I++) {
							const lMotif = lPunition.listeMotifs.get(I);
							if (lMotif.publication) {
								lSelf.moteurPunitions.setDatePublication(
									ObjetUtilitaireAbsence.getDatePublicationPunitionParDefaut(
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
						placeHolder: GTraductions.getValeur(
							"fenetreSaisiePunition.choisirAccompagnateur",
						),
						labelWAICellule: GTraductions.getValeur(
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
						lSelf.moteurPunitions.punition.Accompagnateur = new ObjetElement();
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
					lSelf.moteurPunitions.genreRessource === EGenreRessource.Punition &&
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
					lSelf.moteurPunitions.punition.naturePunition = new ObjetElement(
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
		lCtrlPunition.checkPublie.getDisabled = function () {
			return true;
		};
	}
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre,
		{ pere: this },
		{
			titre: this.moteurPunitions.getTitre(),
			fermerFenetreSurClicHorsFenetre: true,
			listeBoutons: aParams.actif
				? this.moteurPunitions.listeBoutons
				: [GTraductions.getValeur("Fermer")],
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
				lPunition.duree = TUtilitaireDuree.dureeEnMin(
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
			labelWAI: GTraductions.getValeur("fenetreSaisiePunition.aRendre"),
			joursValidesAnnuels: new TypeDomaine(false, 365).setValeur(
				true,
				GDate.getNbrJoursEntreDeuxDates(GDate.premiereDate, lDateCours),
				GDate.getNbrJoursEntreDeuxDates(GDate.premiereDate, GDate.derniereDate),
			),
			estJoursValidesAnnuelsSelonPremiereDate: true,
		})
		.setDonnees(lDate, true);
	this.objetCalendrier.setActif(aParams.actif);
}
function afficherListeMotif(aParam) {
	let lListeMotif;
	let lTitre;
	if (aParam.genreAbsence === EGenreRessource.Absence) {
		lTitre = GTraductions.getValeur("AbsenceVS.RenseignerUneAbsence");
		lListeMotif = GCache.listeMotifsAbsenceEleve;
	} else if (aParam.genreAbsence === EGenreRessource.Retard) {
		lTitre = GTraductions.getValeur("AbsenceVS.RenseignerUnRetard");
		lListeMotif = GCache.listeMotifsRetards;
	} else {
		return;
	}
	const lDroit = this.moteur.getDroitSaisieMotif(aParam.genreAbsence);
	ObjetFenetre_FeuilleAppelRenseigner.ouvrir({
		instance: this,
		titre: lTitre,
		callback: function (aNumeroBouton, aParams) {
			if (
				aParams &&
				((aParams.bouton && aParams.bouton.valider) || aParams.validationDirect)
			) {
				this.evenementListeMotifs(aParam, aParams.motif, aParams.dureeSaisie);
			}
		}.bind(this),
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
class ObjetFenetre_FeuilleAppelRenseigner extends ObjetFenetre {
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
			genre: EGenreRessource.Absence,
		};
	}
	setOptions(aOptions) {
		$.extend(this.optionsFA, aOptions);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
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
								type: EGenreBoiteMessage.Information,
								message: GTraductions.getValeur(
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
					return aInstance.optionsFA.genre === EGenreRessource.Absence
						? GTraductions.getValeur("AbsenceVS.SelectionnerUnMotifAbsence")
						: GTraductions.getValeur("AbsenceVS.SelectionnerUnMotifRetard");
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
							EGenreEvenementObjetSaisie.selection
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
			tag(
				"div",
				{ class: ["field-contain"], "ie-display": "retard.visible" },
				(aContenu) => {
					aContenu.push(
						tag(
							"label",
							{ class: ["ie-titre-petit", "fix-bloc"] },
							GTraductions.getValeur("AbsenceVS.SelectionnerTempsDeRetard") +
								" :",
						),
					);
					aContenu.push(
						tag(
							"input",
							{
								type: "number",
								pattern: "\\d*",
								min: 1,
								max: this.optionsFA.dureeMax,
								"ie-model": tag.funcAttr("retard"),
								"ie-mask": "/[^0-9]/i",
								class: "round-style",
							},
							"",
						),
					);
				},
			),
		);
		lHtml.push(
			tag(
				"div",
				{
					class: ["field-contain", "with-combo"],
					"ie-display": "motifs.visible",
				},
				(aContenu) => {
					const lIdLabel = GUID.getId();
					aContenu.push(
						tag(
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
						tag("ie-combo", {
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
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FeuilleAppelRenseigner,
			{
				pere: aParams.instance,
				evenement: aParams.callback,
				initialiser: function (aInstance) {
					aInstance.setOptions(aParams.options);
				},
			},
			{
				titre: aParams.titre,
				listeBoutons: [
					{
						libelle: GTraductions.getValeur("Annuler"),
						annuler: true,
						theme: TypeThemeBouton.secondaire,
						action: 0,
					},
					{
						libelle: GTraductions.getValeur("Valider"),
						valider: true,
						theme: TypeThemeBouton.primaire,
						action: 1,
					},
				],
				fermerFenetreSurClicHorsFenetre: true,
			},
		);
		lFenetre.setDonnees(aParams.donnees);
	}
}
class ObjetFenetre_FeuilleAppelAutres extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.optionsFA = {
			moteur: null,
			rubriques: new ObjetListeElements(),
			callbackListe: function () {},
		};
	}
	setOptions(aOptions) {
		$.extend(this.optionsFA, aOptions);
	}
	getControleur() {
		return $.extend(true, super.getControleur(this), {});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			(aParametres) => {
				if (
					aParametres.genreEvenement ===
					EGenreEvenementListe.ModificationCBLigne
				) {
					const lGenreAbsence = aParametres.article.getGenre();
					const lTypeObservation = aParametres.article.getNumero();
					const lGenreObservation = aParametres.article.genreObservation;
					let lEtat = !aParametres.article.activation
						? EGenreEtat.Suppression
						: EGenreEtat.Creation;
					if (lGenreAbsence === EGenreRessource.RepasAPreparer) {
						lEtat = EGenreEtat.Modification;
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
					skin: ObjetListe.skin.flatDesign,
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
			tag(
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
				callbackEdition: function (
					aGenreAbsence,
					aNumeroObservation,
					aGenreObservation,
				) {
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
				}.bind(this),
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
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FeuilleAppelAutres,
			{
				pere: aParams.instance,
				evenement: aParams.callback,
				initialiser: function (aInstance) {
					aInstance.setOptions(aParams.options);
				},
			},
			{
				titre: aParams.titre,
				listeBoutons: [
					{
						libelle: GTraductions.getValeur("Fermer"),
						annuler: true,
						theme: TypeThemeBouton.secondaire,
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
ObjetFenetre_FeuilleAppelAutres.genreAction = {
	checkbox: "ffaa_checkBox",
	modification: "ffaa_modification",
};
class DonneesListe_RubriquesFA_Mobile extends ObjetDonneesListeFlatDesign {
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
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
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
			case EGenreRessource.RepasAPreparer: {
				if (this.genreRepas === TypeGenreRepasEleve.RepasMidi) {
					return GTraductions.getValeur("AbsenceVS.InscritAuRepasMidi");
				} else {
					return GTraductions.getValeur("AbsenceVS.InscritAuRepasSoir");
				}
			}
			case EGenreRessource.Dispense: {
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
						return GTraductions.getValeur(
							"AbsenceVS.demandeDispense.dspenseDemandeRefusee",
						);
					} else {
						return `<span class="text-util-rouge-foncee">${GTraductions.getValeur("AbsenceVS.demandeDispense.dispenseDemandeATraiter")}</span>`;
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
		if (aParams.article.getGenre() !== EGenreRessource.RepasAPreparer) {
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
					tag(
						"ie-btnicon",
						{
							class: "icon_edit",
							"ie-model": tag.funcAttr("modifierAbsence", [
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
		if (aParams.article.getGenre() === EGenreRessource.RepasAPreparer) {
			return lAbsence.type === TTypePreparerRepas.prOui;
		} else {
			return !!lAbsence;
		}
	}
	setValueCB(aParams, aValue) {
		aParams.article.activation = aValue;
	}
}
module.exports = InterfaceFeuilleAppel;
