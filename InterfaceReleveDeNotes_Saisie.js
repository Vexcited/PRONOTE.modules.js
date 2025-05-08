const { EGenreEvntMenusDeroulants } = require("Enumere_EvntMenusDeroulants.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { InterfacePiedBulletin } = require("InterfacePiedBulletin.js");
const {
	ObjetFenetre_AssistantSaisie,
} = require("ObjetFenetre_AssistantSaisie.js");
const { _InterfaceReleveDeNotes } = require("_InterfaceReleveDeNotes.js");
const {
	EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
const { ETypeAppreciationUtil } = require("Enumere_TypeAppreciation.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetMoteurGrilleSaisie } = require("ObjetMoteurGrilleSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
class InterfaceReleveDeNotes extends _InterfaceReleveDeNotes {
	constructor(aNom, aIdent, aPere, aEvenement) {
		const lParam = {
			avecSaisie: true,
			avecInfosEleve: true,
			avecCorrige: false,
		};
		super(aNom, aIdent, aPere, aEvenement, lParam);
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
		this.moteurGrille = new ObjetMoteurGrilleSaisie();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getInformationDatePublication() {
				return aInstance.strInfoDatePublication || "";
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
			},
		});
	}
	instancierCombos() {
		return this.add(
			ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
	}
	instancierPiedBulletin() {
		return this.add(InterfacePiedBulletin, _evntSurPied.bind(this));
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
	ouvrirAssistantSaisie(aParams) {
		const lArticle = aParams.article;
		const lData = this.moteur.getApprDeService({
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			article: lArticle,
		});
		const lAppreciation = lData.appreciation;
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
				GEtatUtilisateur.getGenreOnglet(),
				lAppreciation,
				false,
			),
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: false,
				eleve: this.getEleve(),
				typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			}),
			avecEtatSaisie: false,
		});
		this.objCelluleAppreciation = $.extend(
			{
				article: lArticle,
				appreciation: lAppreciation,
				idColonne: aParams.idColonne,
			},
			{ ctxPiedBulletin: false },
		);
	}
	getEleve() {
		return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Eleve);
	}
	getClasse() {
		return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe);
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
		});
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			EGenreRessource.Classe,
			EGenreRessource.Periode,
			EGenreRessource.Eleve,
		]);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	surEvntMenusDeroulants(aParam) {
		switch (aParam.genreEvenement) {
			case EGenreEvntMenusDeroulants.surOuvertureCombo:
				this.fermerFenetreCalculMoy();
				break;
			case EGenreEvntMenusDeroulants.ressourceNonTrouve:
				this.surRessourceCouranteNonTrouveeDansCombo(aParam);
				break;
		}
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [
			this.identTripleCombo,
			{ html: '<span ie-html="getInformationDatePublication"></span>' },
		];
		const lAvecAssistant = this.avecAssistantSaisie();
		if (this.avecFicheEleve() || lAvecAssistant) {
			this.AddSurZone.push({ separateur: true });
		}
		if (lAvecAssistant) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					"btnAssistantSaisie",
				),
			});
		}
		this.addSurZoneFicheEleve();
		this.addSurZonePhotoEleve();
	}
	evenementSurDernierMenuDeroulant() {
		if (this.param.avecInfosEleve) {
			this.surSelectionEleve();
		}
		this.afficherPage();
	}
	afficherPage() {
		if (this.param.avecSaisie) {
			this.getListeTypesAppreciations();
			this.setEtatSaisie(false);
		}
		const lParam = {
			numeroEleve: this.getEleve().getNumero(),
			numeroClasse: this.getClasse().getNumero(),
			genrePeriode: this.getPeriode().getGenre(),
			numeroPeriode: this.getPeriode().getNumero(),
		};
		this._initPiedPage(this.getInstance(this.identPiedPage));
		this.envoyerRequeteBulletin(lParam);
	}
	actualiserPage() {
		this.afficherPage();
	}
	getListeTypesAppreciations() {
		this.moteurAssSaisie.getListeTypesAppreciations({
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			clbck: function (aListeTypesAppreciations) {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			}.bind(this),
		});
	}
	getParametresCalcul(aParamEvnt) {
		return $.extend(super.getParametresCalcul(aParamEvnt), {
			libelleEleve: this.getEleve().getLibelle(),
			numeroEleve: this.getEleve().getNumero(),
			libelleClasse: this.getClasse().getLibelle(),
			numeroClasse: this.getClasse().getNumero(),
		});
	}
}
function _evntSurAssistant() {
	this.moteurAssSaisie.evntBtnAssistant({
		instanceListe: this.getInstance(this.identListe),
		instancePied: this.getInstance(this.identPiedPage),
	});
}
function _evntSurPied(aParam) {
	this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
	this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
		instanceFenetreAssistantSaisie: this.getInstance(
			this.identFenetreAssistantSaisie,
		),
		listeTypesAppreciations: this.listeTypesAppreciations,
		tabTypeAppreciation: ETypeAppreciationUtil.getTypeAppreciation(
			GEtatUtilisateur.getGenreOnglet(),
			aParam.appreciation,
			true,
		),
		tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
			estCtxPied: true,
			appreciation: aParam.appreciation,
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
		}),
		avecEtatSaisie: false,
	});
}
function _evntSurFenetreAssistantSaisie(aNumeroBouton) {
	const lThis = this;
	const lParam = {
		instanceFenetreAssistantSaisie: this.getInstance(
			this.identFenetreAssistantSaisie,
		),
		eventChangementUtiliserAssSaisie: function () {
			lThis.getInstance(lThis.identListe).actualiser(true);
			const lInstancePied = lThis.getInstance(lThis.identPiedPage);
			if (lInstancePied && lInstancePied.evenementSurAssistant) {
				lInstancePied.evenementSurAssistant();
			}
		},
		evntClbck: surEvntAssSaisie.bind(this),
	};
	this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
}
function _validerAppreciation(aParam, aParamSaisie) {
	const lEstCtxPiedBulletin = aParamSaisie.estCtxPiedBulletin;
	const lListe = aParamSaisie.liste;
	this.moteurAssSaisie.validerDonneesSurValider({
		article: this.objCelluleAppreciation.article,
		appreciation: this.objCelluleAppreciation.appreciation,
		eltSelectionne: aParam.eltSelectionne,
	});
	let lService, lAppr;
	if (lEstCtxPiedBulletin) {
		lService = null;
		lAppr = this.objCelluleAppreciation.appreciation;
	} else {
		const lData = this.moteur.getApprDeService({
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			article: this.objCelluleAppreciation.article,
		});
		lService = lData.service;
		lAppr = lData.appreciation;
		lService.setEtat(EGenreEtat.Modification);
	}
	this.saisieAppreciation(
		{ instanceListe: lListe, estCtxPied: lEstCtxPiedBulletin },
		{
			classe: this.getClasse(),
			periode: this.getPeriode(),
			eleve: this.getEleve(),
			service: lService,
			appreciation: lAppr,
			typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
				estCtxPied: lEstCtxPiedBulletin,
				eleve: this.getEleve(),
				typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
				appreciation: lAppr,
			}),
		},
	);
}
function surEvntAssSaisie(aParam) {
	const lEstCtxPiedBulletin =
		this.objCelluleAppreciation !== null &&
		this.objCelluleAppreciation !== undefined &&
		this.objCelluleAppreciation.ctxPiedBulletin;
	const lListe = lEstCtxPiedBulletin
		? this.objCelluleAppreciation.instanceListe
		: this.getInstance(this.identListe);
	if (lListe !== null && lListe !== undefined) {
		let lClbck;
		switch (aParam.cmd) {
			case EBoutonFenetreAssistantSaisie.Valider:
				lClbck = function () {
					_validerAppreciation.call(this, aParam, {
						estCtxPiedBulletin: lEstCtxPiedBulletin,
						liste: lListe,
					});
				}.bind(this);
				break;
			case EBoutonFenetreAssistantSaisie.PasserEnSaisie:
				lClbck = function () {
					this.moteurAssSaisie.passerEnSaisie({
						instanceListe: lListe,
						idColonne: this.objCelluleAppreciation.idColonne,
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
module.exports = InterfaceReleveDeNotes;
