const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const {
	ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const ObjetRequetePageAppreciationsGenerales = require("ObjetRequetePageAppreciationsGenerales.js");
const { ObjetListe } = require("ObjetListe.js");
const DonneesListe_ApprGenerale = require("DonneesListe_ApprGenerale.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const {
	EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetInvocateur } = require("Invocateur.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ObjetFenetre_Mention } = require("ObjetFenetre_Mention.js");
const {
	EGenreAppreciationGenerale,
} = require("Enumere_AppreciationGenerale.js");
class _InterfaceSaisieApprGenerale extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		switch (GEtatUtilisateur.getGenreOnglet()) {
			case EGenreOnglet.SaisieApprGeneralesReleve:
				this.typeReleveBulletin = TypeReleveBulletin.ReleveDeNotes;
				break;
			case EGenreOnglet.SaisieAppreciationsGenerales:
				this.typeReleveBulletin = TypeReleveBulletin.BulletinNotes;
				break;
			case EGenreOnglet.SaisieAppreciationsGenerales_Competences:
				this.typeReleveBulletin = TypeReleveBulletin.BulletinCompetences;
				break;
		}
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getInfoCloture: function () {
				return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
			},
			btnAssistantSaisie: {
				event() {
					_evntSurAssistant.call(aInstance);
				},
				getTitle() {
					return aInstance.moteurAssSaisie.getTitleBoutonAssistantSaisie();
				},
				getSelection() {
					return GEtatUtilisateur.assistantSaisieActif;
				},
				getDisabled() {
					return aInstance.donnees === null;
				},
			},
		});
	}
	instancierCombos() {
		return this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			_evntSurDernierMenuDeroulant.bind(this),
			_initTripleCombo.bind(this),
		);
	}
	getClasse() {
		return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
	}
	getPeriode() {
		return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
	}
	getAppreciation() {
		return GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Appreciation,
		);
	}
	envoyerRequete(aParam) {
		new ObjetRequetePageAppreciationsGenerales(
			this,
			_actionSurRecupererDonnees.bind(this),
		).lancerRequete(aParam);
	}
	instancierBulletin() {
		return this.add(ObjetListe, _evntSurListe.bind(this));
	}
	getListeTypesAppreciations() {
		this.moteurAssSaisie.getListeTypesAppreciations({
			typeReleveBulletin: this.typeReleveBulletin,
			estCtxApprGenerale: true,
			clbck: function (aListeTypesAppreciations) {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			}.bind(this),
		});
	}
	saisieAppreciation(aParam, aParamRequete) {
		const lParam = {
			instanceListe: aParam.instanceListe,
			paramRequete: aParamRequete,
			paramCellSuivante: aParam.suivante,
			clbckEchec: function (aPromiseMsg) {
				_actualiserSurErreurSaisie.call(this, {
					liste: aParam.instanceListe,
					promiseMsg: aPromiseMsg,
				});
			}.bind(this),
		};
		$.extend(lParam, {
			clbckSucces: function (aParamSucces) {
				const lDonneesListe = this.getInstance(
					this.identListe,
				).getListeArticles();
				const lLignes = lDonneesListe.getListeElements((aLigne) => {
					return (
						aLigne.eleve.getNumero() === aParamSucces.numeroEleve &&
						!aLigne.estPere &&
						aLigne.appreciationGle.getGenre() ===
							aParamSucces.apprSaisie.getGenre()
					);
				});
				const lLigne = lLignes.get(0);
				let lApp = lLigne.appreciationGle;
				if (lApp) {
					lApp.setNumero(aParamSucces.apprSaisie.getNumero());
					lApp.setLibelle(aParamSucces.apprSaisie.getLibelle());
					lApp.setEtat(EGenreEtat.Aucun);
				}
			}.bind(this),
		});
		this.moteur.saisieAppreciation(lParam);
	}
	construireInstances() {
		this.identTripleCombo = this.instancierCombos();
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identListe = this.instancierBulletin();
		if (this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes) {
			this.identFenetreMentions = this.add(
				ObjetFenetre_Mention,
				_evntMention.bind(this),
				_initMentions.bind(this),
			);
		}
		this.instancierAssistantSaisie();
		this.construireFicheEleveEtFichePhoto();
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
		this.AddSurZone.push({ html: '<span ie-html = "getInfoCloture"></span>' });
		this.AddSurZone.push({ separateur: true });
		this.addSurZoneAssistantSaisie();
		this.addSurZoneFichesEleve();
	}
	evenementAfficherMessage(aMessage) {
		this._evenementAfficherMessage(aMessage);
	}
	desactiverImpression() {
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
	}
	actualiserListe() {
		this.getInstance(this.identListe).setDonnees(
			this.donneesListe_ApprGenerale,
		);
		this.selectionneEleveAutoDansPage();
	}
	selectionneEleveAutoDansPage() {
		const lTrouve = this.selectionnerEleveCourant();
		this.activerFichesEleve(lTrouve);
	}
	selectionnerEleveCourant() {
		let lTrouve = false;
		const lEleve = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Eleve,
		);
		if (lEleve && !lEleve.multiSelection) {
			const lDonneesListe = this.getInstance(
				this.identListe,
			).getListeArticles();
			for (let i = 0, lNbr = lDonneesListe.count(); i < lNbr; i++) {
				if (!lTrouve) {
					const lElement = lDonneesListe.get(i);
					if (lElement.eleve.getNumero() === lEleve.getNumero()) {
						lTrouve = true;
						this.getInstance(this.identListe).selectionnerLigne({
							ligne: i,
							avecScroll: true,
						});
						break;
					}
				}
			}
		}
		return lTrouve;
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin: this.typeReleveBulletin,
			estCtxApprGenerale: true,
		});
	}
	instancierAssistantSaisie() {
		if (this.avecAssistantSaisie()) {
			this.identFenetreAssistantSaisie = this.add(
				ObjetFenetre_AssistantSaisie,
				_evntSurFenetreAssistantSaisie.bind(this),
				this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
			);
		}
	}
	addSurZoneAssistantSaisie() {
		if (this.avecAssistantSaisie()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					"btnAssistantSaisie",
				),
			});
		}
	}
	ouvrirFenetreAssistantSaisiePourLignesSelectionnees() {
		this.viderListeContextesCelluleAppreciation();
		const lSelections = this.getInstance(
			this.identListe,
		).getListeElementsSelection();
		if (!!lSelections && lSelections.count() > 0) {
			for (const lArticleLigneSelectionnee of lSelections) {
				this.sauverContexteCelluleAppreciation(
					lArticleLigneSelectionnee.appreciationGle,
					lArticleLigneSelectionnee,
					DonneesListe_ApprGenerale.colonnes.appreciationGenerale,
				);
			}
			const lPremiereAppreciation = lSelections.get(0).appreciationGle;
			this.ouvrirFenetreAssistantSaisie(lPremiereAppreciation);
		}
	}
	ouvrirFenetreAssistantSaisie(aObjAppreciation) {
		const lEstEnMultiSelection =
			this.contexteCellulesAppreciationEstMultiCellules();
		this.getInstance(this.identFenetreAssistantSaisie).setParametres({
			avecBoutonPasserEnSaisie: !lEstEnMultiSelection,
		});
		let lGenreAppr = _estCtxCPE.call(this)
			? EGenreAppreciationGenerale.AG_CPE
			: null;
		const lTailleMaxAppr = this.moteur.getTailleMaxAppreciation({
			estCtxApprGenerale: true,
			estCtxPied: false,
			typeReleveBulletin: this.typeReleveBulletin,
			genreAppr: lGenreAppr,
		});
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
				GEtatUtilisateur.getGenreOnglet(),
				aObjAppreciation,
				false,
			),
			tailleMaxAppreciation: lTailleMaxAppr,
			avecEtatSaisie: false,
		});
	}
	addSurZoneFichesEleve() {
		this.addSurZoneFicheEleve();
	}
	ouvrirFenetreChoixMentions() {
		this.moteurPdB.evenementOuvrirMentions({
			instanceFenetre: this.getInstance(this.identFenetreMentions),
			listeMentions: this.listeMentions,
		});
	}
	viderListeContextesCelluleAppreciation() {
		this.listeContextesCellulesAppreciation = [];
	}
	sauverContexteCelluleAppreciation(aObjAppreciation, aArticle, aIdColonne) {
		const lContexteCelluleAppreciation = {
			article: aArticle,
			appreciation: aObjAppreciation,
			idColonne: aIdColonne,
			ctxPiedBulletin: false,
		};
		this.listeContextesCellulesAppreciation.push(lContexteCelluleAppreciation);
	}
	contexteCellulesAppreciationEstMultiCellules() {
		return this.listeContextesCellulesAppreciation.length > 1;
	}
}
function _initTripleCombo(aInstance) {
	const lCombos = [EGenreRessource.Classe];
	lCombos.push(EGenreRessource.Periode);
	if (this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes) {
		lCombos.push(EGenreRessource.Appreciation);
	}
	aInstance.setParametres(lCombos, false);
}
function _evntSurDernierMenuDeroulant() {
	_actualiserDonnees.call(this);
}
function _actualiserDonnees() {
	this.getListeTypesAppreciations();
	const lParam = { classe: this.getClasse(), periode: this.getPeriode() };
	if (this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes) {
		$.extend(lParam, { appreciation: this.getAppreciation() });
	}
	this.envoyerRequete(lParam);
}
function _evntSurListe(aParametres) {
	const lLigne = aParametres.article;
	const lClasse = _getInfoClasseEleve.call(this, lLigne);
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Selection:
			GEtatUtilisateur.Navigation.setRessource(
				EGenreRessource.Eleve,
				aParametres.article.eleve,
			);
			this.surSelectionEleve();
			break;
		case EGenreEvenementListe.Edition:
			switch (aParametres.idColonne) {
				case DonneesListe_ApprGenerale.colonnes.evolution:
					this.moteur.ouvrirMenuEvolution({
						id: this.getInstance(this.identListe).getIdCellule(
							aParametres.colonne,
							aParametres.ligne,
						),
						instance: this,
						clbackMenuEvolution: function (aEvolution) {
							if (aEvolution && lLigne.evolution !== aEvolution.getGenre()) {
								this.moteur.saisieEvolution({
									paramRequete: {
										evolution: aEvolution.getGenre(),
										classe: lClasse,
										periode: this.getPeriode(),
										eleve: lLigne.eleve,
									},
									instanceListe: this.getInstance(this.identListe),
									clbckSucces: function (aParamSucces) {
										const lDonneesDeLaListe = this.getInstance(
											this.identListe,
										).getListeArticles();
										const lEstCasRubrique =
											this.donneesListe_ApprGenerale.param.estCtxRubrique;
										const lLignes = lDonneesDeLaListe.getListeElements(
											(aLigne) => {
												return (
													aLigne.eleve.getNumero() ===
														aParamSucces.numeroEleve &&
													(!lEstCasRubrique || aLigne.estPere)
												);
											},
										);
										const lLigne = lLignes.get(0);
										lLigne.listePeriodesPrec.parcourir((aEltPeriodePrec) => {
											aEltPeriodePrec.evolution = aParamSucces.evolutionSaisie;
										});
									}.bind(this),
									paramCellSuivante: { orientationVerticale: true },
									clbckEchec: function (aPromiseMsg) {
										_actualiserSurErreurSaisie.call(this, {
											liste: this.getInstance(this.identListe),
											promiseMsg: aPromiseMsg,
										});
									}.bind(this),
								});
							}
						}.bind(this),
					});
					break;
				case DonneesListe_ApprGenerale.colonnes.appreciationGenerale: {
					this.viderListeContextesCelluleAppreciation();
					const lObjetAppreciation =
						DonneesListe_ApprGenerale.getAppreciationDeColonne(aParametres);
					if (this.moteurPdB.estMention({ appreciation: lObjetAppreciation })) {
						if (this.typeReleveBulletin === TypeReleveBulletin.ReleveDeNotes) {
							return;
						}
						this.sauverContexteCelluleAppreciation(
							lObjetAppreciation,
							aParametres.article,
							aParametres.idColonne,
						);
						this.ouvrirFenetreChoixMentions();
					} else {
						this.sauverContexteCelluleAppreciation(
							lObjetAppreciation,
							aParametres.article,
							aParametres.idColonne,
						);
						this.ouvrirFenetreAssistantSaisie(lObjetAppreciation);
					}
					break;
				}
			}
			break;
		case EGenreEvenementListe.ApresEdition:
			switch (aParametres.idColonne) {
				case DonneesListe_ApprGenerale.colonnes.appreciationGenerale:
					_saisirAppreciation.call(this, {
						appr: lLigne.appreciationGle,
						eleve: lLigne.eleve,
						classe: lClasse,
						avecSaisieSurCelluleSuivante: true,
					});
					break;
			}
			break;
	}
}
function _getInfoClasse() {
	let lClasse = this.getClasse();
	if (
		lClasse !== null &&
		lClasse !== undefined &&
		lClasse.getNumero() !== -1 &&
		lClasse.getGenre() !== EGenreRessource.Aucune
	) {
		return lClasse;
	} else {
	}
}
function _getInfoClasseEleve(aLigne) {
	if (aLigne && aLigne.classe) {
		return aLigne.classe;
	} else {
		return _getInfoClasse.call(this);
	}
}
function _actualiserSurErreurSaisie(aParam) {
	const lSelection = aParam.liste.getSelectionCellule();
	_actualiserDonnees.call(this);
	if (aParam.promiseMsg !== null && aParam.promiseMsg !== undefined) {
		aParam.promiseMsg.then(() => {
			if (lSelection !== null && lSelection !== undefined) {
				aParam.liste.selectionnerCellule({
					ligne: lSelection.ligne,
					colonne: lSelection.colonne,
					avecScroll: true,
				});
			}
		});
	}
}
function _saisirAppreciation(aParam) {
	let lSuivante = null;
	if (aParam.avecSaisieSurCelluleSuivante) {
		const lNumColonneAppreciation = this.getInstance(
			this.identListe,
		).getNumeroColonneDIdColonne(
			DonneesListe_ApprGenerale.colonnes.appreciationGenerale,
		);
		lSuivante = {
			orientationVerticale: true,
			colonne: lNumColonneAppreciation,
		};
	}
	this.saisieAppreciation(
		{
			instanceListe: this.getInstance(this.identListe),
			estCtxPied: false,
			suivante: lSuivante,
		},
		{
			classe: aParam.classe,
			periode: this.getPeriode(),
			eleve: aParam.eleve,
			appreciation: aParam.appr,
			typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
				estCtxApprGenerale: true,
				estCtxPied: false,
				eleve: aParam.eleve,
				typeReleveBulletin: this.typeReleveBulletin,
				appreciation: aParam.appr,
			}),
		},
	);
}
function _actionSurRecupererDonnees(aParam) {
	this.desactiverImpression();
	if (aParam.message !== null && aParam.message !== undefined) {
		this.donnees = null;
		this.evenementAfficherMessage(aParam.message);
	} else {
		this.donnees = aParam;
		_afficherBulletin.call(this, aParam);
		_activerImpression.call(this);
	}
	this.afficherBandeau(true);
}
function _activerImpression() {
	const lGenreImpression = this.moteur.getGenreImpression({
		typeReleveBulletin: this.typeReleveBulletin,
		estCtxApprGenerale: true,
	});
	Invocateur.evenement(
		ObjetInvocateur.events.activationImpression,
		lGenreImpression,
		this,
		lGenreImpression === EGenreImpression.GenerationPDF
			? getParametresPDF.bind(this)
			: null,
	);
}
function getParametresPDF() {
	let lClasse = _getInfoClasse.call(this);
	const lParam = {
		genreGenerationPDF: this.moteur.getGenreGenerationPdf({
			typeReleveBulletin: this.typeReleveBulletin,
			estCtxApprGenerale: true,
		}),
		periode: this.getPeriode(),
		ressource: lClasse,
	};
	if (this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes) {
		const lAppreciation = this.getAppreciation();
		$.extend(lParam, {
			appreciation: lAppreciation,
			estUneRubrique:
				lAppreciation.estUneRubrique !== null &&
				lAppreciation.estUneRubrique !== undefined
					? lAppreciation.estUneRubrique
					: false,
		});
	}
	const lDonneesListe = this.getInstance(this.identListe).getDonneesListe();
	if (lDonneesListe.param.avecSelectionPeriodePrec === true) {
		$.extend(lParam, { periodePrec: lDonneesListe.param.periodePrecCourante });
	} else if (
		lDonneesListe.param.listePeriodesPrec &&
		lDonneesListe.param.listePeriodesPrec.count() > 0
	) {
		$.extend(lParam, {
			periodePrec: lDonneesListe.param.listePeriodesPrec.get(0),
		});
	}
	return lParam;
}
function _estCtxCPE() {
	if (this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes) {
		let lApprDuCombo = this.getAppreciation();
		if (lApprDuCombo !== null && lApprDuCombo !== undefined) {
			if (lApprDuCombo.estUneRubrique) {
				return lApprDuCombo.Genre === 3;
			} else {
				return lApprDuCombo.Genre === EGenreAppreciationGenerale.AG_CPE - 1;
			}
		} else {
			return false;
		}
	} else {
		return false;
	}
}
function _afficherBulletin(aParam) {
	this.listeMentions = aParam.listeMentions;
	this.strInfoCloture = aParam.strInfoCloture || "";
	const lParamDonneesListe = {
		instanceListe: this.getInstance(this.identListe),
		typeReleveBulletin: this.typeReleveBulletin,
		avecMultiSelectionLignes: GApplication.estPrimaire,
	};
	let lGenreAppr = _estCtxCPE.call(this)
		? EGenreAppreciationGenerale.AG_CPE
		: null;
	$.extend(lParamDonneesListe, {
		tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
			estCtxApprGenerale: true,
			estCtxPied: false,
			typeReleveBulletin: this.typeReleveBulletin,
			genreAppr: lGenreAppr,
		}),
	});
	const lInfosCol = this.moteur.getInfosCol(
		aParam.listeColonnes,
		DonneesListe_ApprGenerale.colonnes.periodePrec,
	);
	if (lInfosCol !== null) {
		const lAvecComboSelectionPeriode =
			aParam.listePeriodesPrec !== null &&
			aParam.listePeriodesPrec !== undefined &&
			aParam.listePeriodesPrec.count() > 1;
		$.extend(lParamDonneesListe, {
			avecSelectionPeriodePrec: lAvecComboSelectionPeriode,
			listePeriodesPrec: aParam.listePeriodesPrec,
			clbckSelectionPeriode: function () {
				this.getInstance(this.identListe).actualiser(true);
			}.bind(this),
		});
	}
	let lEstCtxRubrique = false;
	if (this.typeReleveBulletin !== TypeReleveBulletin.ReleveDeNotes) {
		let lAppreciation = this.getAppreciation();
		lEstCtxRubrique =
			lAppreciation !== null && lAppreciation !== undefined
				? lAppreciation.estUneRubrique
				: false;
	}
	$.extend(lParamDonneesListe, {
		estCtxRubrique: lEstCtxRubrique,
		listeColVisibles: aParam.listeColonnes,
		callbackOuvrirAssSaisie:
			this.ouvrirFenetreAssistantSaisiePourLignesSelectionnees.bind(this),
	});
	this.donneesListe_ApprGenerale = new DonneesListe_ApprGenerale(
		aParam.listeLignes,
		lParamDonneesListe,
	);
	this.actualiserListe();
}
function _initMentions(aInstance) {
	this.moteurPdB.initialiserMentions({ instanceFenetre: aInstance });
}
function _evntMention(aGenreBouton) {
	let lObjCelluleAppreciation = null;
	if (
		this.listeContextesCellulesAppreciation &&
		this.listeContextesCellulesAppreciation.length > 0
	) {
		lObjCelluleAppreciation = this.listeContextesCellulesAppreciation[0];
	}
	if (lObjCelluleAppreciation) {
		const lContexte = {
			classe: _getInfoClasseEleve.call(this, lObjCelluleAppreciation.article),
			periode: this.getPeriode(),
			eleve: lObjCelluleAppreciation.article.eleve,
			service: null,
			typeReleveBulletin: this.typeReleveBulletin,
		};
		const lParam = $.extend(lObjCelluleAppreciation, {
			instanceListe: this.getInstance(this.identListe),
			instanceFenetre: this.getInstance(this.identFenetreMentions),
			avecValidationAuto: true,
			clbckValidationAutoSurEdition: _clbckValidationAutoSurEdition.bind(
				this,
				lContexte,
			),
		});
		this.moteurPdB.evenementMention(aGenreBouton, lParam);
	}
}
function _clbckValidationAutoSurEdition(aCtx, aParam) {
	const lParametres = $.extend(aParam, {
		suivante: {
			orientationVerticale: true,
			entrerEdition: true,
			avecCelluleEditable: true,
		},
	});
	this.moteurPdB.clbckValidationAutoSurEditionPdB(
		$.extend(aCtx, {
			clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
		}),
		lParametres,
	);
}
function _evntSurAssistant() {
	this.moteurAssSaisie.evntBtnAssistant({
		instanceListe: this.getInstance(this.identListe),
		instancePied: null,
	});
}
function _evntSurFenetreAssistantSaisie(aNumeroBouton) {
	const lThis = this;
	const lParam = {
		instanceFenetreAssistantSaisie: this.getInstance(
			this.identFenetreAssistantSaisie,
		),
		eventcall: function () {
			lThis.getInstance(lThis.identListe).actualiser(true);
		},
		evntClbck: surEvntAssSaisie.bind(this),
	};
	this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
}
function _validerAppreciation(aParam, aParamSaisie) {
	const lListeContextes = aParamSaisie.listeContextes;
	if (lListeContextes && lListeContextes.length > 0) {
		const lAvecPassageCelluleSuivante = lListeContextes.length === 1;
		for (const lContexte of lListeContextes) {
			if (
				this.moteurAssSaisie.avecAssistantSaisieActif({
					typeReleveBulletin: this.typeReleveBulletin,
				})
			) {
				this.moteurAssSaisie.validerDonneesSurValider({
					article: lContexte.article,
					appreciation: lContexte.appreciation,
					eltSelectionne: aParam.eltSelectionne,
				});
			}
			_saisirAppreciation.call(this, {
				eleve: lContexte.article.eleve,
				classe: _getInfoClasseEleve.call(this, lContexte.article),
				appr: lContexte.appreciation,
				avecSaisieSurCelluleSuivante: lAvecPassageCelluleSuivante,
			});
		}
	}
}
function surEvntAssSaisie(aParam) {
	const lInstanceListe = this.getInstance(this.identListe);
	if (lInstanceListe !== null && lInstanceListe !== undefined) {
		let lClbck;
		switch (aParam.cmd) {
			case EBoutonFenetreAssistantSaisie.Valider:
				lClbck = function () {
					_validerAppreciation.call(this, aParam, {
						listeContextes: this.listeContextesCellulesAppreciation,
					});
				}.bind(this);
				break;
			case EBoutonFenetreAssistantSaisie.PasserEnSaisie:
				lClbck = function () {
					const lContexteUnique = this.listeContextesCellulesAppreciation[0];
					this.moteurAssSaisie.passerEnSaisie({
						instanceListe: lInstanceListe,
						idColonne: lContexteUnique.idColonne,
					});
				}.bind(this);
				break;
			case EBoutonFenetreAssistantSaisie.Fermer:
				lClbck = null;
				break;
			default:
		}
		this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
			estAssistantModifie: aParam.estAssistantModifie,
			pere: this,
			clbck: lClbck,
		});
	}
}
module.exports = _InterfaceSaisieApprGenerale;
