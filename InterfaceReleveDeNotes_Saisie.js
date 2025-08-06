exports.InterfaceReleveDeNotes_Saisie = void 0;
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const InterfacePiedBulletin_1 = require("InterfacePiedBulletin");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const _InterfaceReleveDeNotes_1 = require("_InterfaceReleveDeNotes");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetMoteurGrilleSaisie_1 = require("ObjetMoteurGrilleSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Etat_1 = require("Enumere_Etat");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
class InterfaceReleveDeNotes_Saisie extends _InterfaceReleveDeNotes_1._InterfaceReleveDeNotes {
	constructor(...aParams) {
		super(...aParams);
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.moteurGrille = new ObjetMoteurGrilleSaisie_1.ObjetMoteurGrilleSaisie();
		this.initParams({
			avecSaisie: true,
			avecInfosEleve: true,
			avecCorrige: false,
		});
	}
	instancierCombos() {
		return this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this.evenementSurDernierMenuDeroulant,
			this.initialiserTripleCombo,
		);
	}
	instancierPiedBulletin() {
		return this.add(
			InterfacePiedBulletin_1.InterfacePiedBulletin,
			this._evntSurPied.bind(this),
		);
	}
	instancierAssistantSaisie() {
		if (this.avecAssistantSaisie()) {
			this.identFenetreAssistantSaisie = this.add(
				ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
				this._evntSurFenetreAssistantSaisie.bind(this),
				this.moteurAssSaisie.initialiserFenetreAssistantSaisie,
			);
		}
	}
	initialiserBulletin(aListe) {
		aListe.setOptionsListe({
			ariaLabel: () => {
				var _a, _b, _c;
				return `${this.etatUtilScoEspace.getLibelleLongOnglet()} ${((_a = this.getClasseGroupe()) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""} ${((_b = this.getPeriode()) === null || _b === void 0 ? void 0 : _b.getLibelle()) || ""} ${((_c = this.getEleve()) === null || _c === void 0 ? void 0 : _c.getLibelle()) || ""}`.trim();
			},
		});
	}
	ouvrirAssistantSaisie(aParams) {
		const lArticle = aParams.article;
		const lData = this.moteur.getApprDeService({
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
			article: lArticle,
		});
		const lAppreciation = lData.appreciation;
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation:
				Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
					this.etatUtilScoEspace.getGenreOnglet(),
					lAppreciation,
					false,
				),
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: false,
				eleve: this.getEleve(),
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
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
		return this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	getClasseGroupe() {
		return this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
	}
	avecAssistantSaisie() {
		return this.moteurAssSaisie.avecAssistantSaisie({
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
		});
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres([
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Eleve,
		]);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	surEvntMenusDeroulants(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
				.surOuvertureCombo:
				this.fermerFenetreCalculMoy();
				break;
			case Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
				.ressourceNonTrouve:
				this.surRessourceCouranteNonTrouveeDansCombo(aParam);
				break;
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [
			this.identTripleCombo,
			{
				html: IE.jsx.str("span", {
					"ie-html": () => {
						return this.aCopier.strInfoDatePublication || "";
					},
				}),
			},
		];
		const lAvecAssistant = this.avecAssistantSaisie();
		if (this.avecFicheEleve() || lAvecAssistant) {
			this.AddSurZone.push({ separateur: true });
		}
		if (lAvecAssistant) {
			const lbtnAssistantSaisie = () => {
				return {
					event: () => {
						this._evntSurAssistant();
					},
					getTitle: () => {
						return this.moteurAssSaisie.getTitleBoutonAssistantSaisie();
					},
					getSelection: () => {
						return this.etatUtilScoEspace.assistantSaisieActif;
					},
				};
			};
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					lbtnAssistantSaisie,
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
		const lClasseGroupe = this.getClasseGroupe();
		const lEstUnGroupe =
			lClasseGroupe.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe;
		const lParam = {
			numeroEleve: this.getEleve().getNumero(),
			numeroClasse: lEstUnGroupe ? 0 : lClasseGroupe.getNumero(),
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
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
			clbck: (aListeTypesAppreciations) => {
				this.listeTypesAppreciations = aListeTypesAppreciations;
			},
		});
	}
	getParametresCalcul(aParamEvnt) {
		return $.extend(super.getParametresCalcul(aParamEvnt), {
			libelleEleve: this.getEleve().getLibelle(),
			numeroEleve: this.getEleve().getNumero(),
			libelleClasse: this.getClasseGroupe().getLibelle(),
			numeroClasse: this.getClasseGroupe().getNumero(),
		});
	}
	_evntSurAssistant() {
		this.moteurAssSaisie.evntBtnAssistant({
			instanceListe: this.getInstance(this.identListe),
			instancePied: this.getInstance(this.identPiedPage),
		});
	}
	_evntSurPied(aParam) {
		this.objCelluleAppreciation = $.extend(aParam, { ctxPiedBulletin: true });
		this.moteurAssSaisie.evenementOuvrirAssistantSaisie({
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			listeTypesAppreciations: this.listeTypesAppreciations,
			tabTypeAppreciation:
				Enumere_TypeAppreciation_1.ETypeAppreciationUtil.getTypeAppreciation(
					this.etatUtilScoEspace.getGenreOnglet(),
					aParam.appreciation,
					true,
				),
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: true,
				appreciation: aParam.appreciation,
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
			}),
			avecEtatSaisie: false,
		});
	}
	_evntSurFenetreAssistantSaisie(aNumeroBouton) {
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventChangementUtiliserAssSaisie: () => {
				this.getInstance(this.identListe).actualiser(true);
				const lInstancePied = this.getInstance(this.identPiedPage);
				if (lInstancePied && lInstancePied.evenementSurAssistant) {
					lInstancePied.evenementSurAssistant();
				}
			},
			evntClbck: this.surEvntAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	_validerAppreciation(aParam, aParamSaisie) {
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
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
				article: this.objCelluleAppreciation.article,
			});
			lService = lData.service;
			lAppr = lData.appreciation;
			lService.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		this.saisieAppreciation(
			{ instanceListe: lListe, estCtxPied: lEstCtxPiedBulletin },
			{
				classe: this.getClasseGroupe(),
				periode: this.getPeriode(),
				eleve: this.getEleve(),
				service: lService,
				appreciation: lAppr,
				typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
					estCtxPied: lEstCtxPiedBulletin,
					eleve: this.getEleve(),
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
					appreciation: lAppr,
				}),
			},
		);
	}
	surEvntAssSaisie(aParam) {
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
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Valider:
					lClbck = () => {
						this._validerAppreciation(aParam, {
							estCtxPiedBulletin: lEstCtxPiedBulletin,
							liste: lListe,
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.PasserEnSaisie:
					lClbck = () => {
						this.moteurAssSaisie.passerEnSaisie({
							instanceListe: lListe,
							idColonne: this.objCelluleAppreciation.idColonne,
						});
					};
					break;
				case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
					.Fermer:
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
}
exports.InterfaceReleveDeNotes_Saisie = InterfaceReleveDeNotes_Saisie;
