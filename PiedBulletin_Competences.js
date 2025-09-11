exports.PiedBulletin_Competences = void 0;
const PageBilanFinDeCycle_1 = require("PageBilanFinDeCycle");
const ObjetInterface_1 = require("ObjetInterface");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeModeAffichagePiedBulletin_1 = require("TypeModeAffichagePiedBulletin");
const TypeModuleFonctionnelPiedBulletin_1 = require("TypeModuleFonctionnelPiedBulletin");
const AccessApp_1 = require("AccessApp");
class PiedBulletin_Competences extends ObjetInterface_1.ObjetInterface {
	constructor() {
		super(...arguments);
		this.params = {
			modeAffichage:
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
			avecTitreModule: false,
			periodeCloture: false,
			droits: { avecSaisie: false },
		};
	}
	construireInstances() {
		this.identBilanFinDeCycle = this.add(
			PageBilanFinDeCycle_1.PageBilanFinDeCycle,
			this._evenementInterfaceBilanFinDeCycle.bind(this),
			this._initInterfaceBilanFinDeCycle,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identBilanFinDeCycle;
		this.avecBandeau = this.params.avecTitreModule;
		this.AvecCadre = false;
	}
	construireStructureAffichageBandeau() {
		const T = [];
		T.push('<p class="EspaceBas EspaceHaut Gras">');
		T.push(
			TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletinUtil.getLibelle(
				TypeModuleFonctionnelPiedBulletin_1.TypeModuleFonctionnelPiedBulletin
					.MFPB_Competences,
			),
		);
		T.push("</p>");
		return T.join("");
	}
	setDonnees(aParam) {
		$.extend(true, this.params, aParam);
		this.params.listePiliers = aParam.listePiliers;
	}
	setParametres(aParam) {
		$.extend(true, this.params, aParam);
	}
	estAffiche() {
		const lEtatUtil = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		const lPeriode = lEtatUtil.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		let lEstPeriodeValable = true;
		if (lPeriode && lPeriode.getNumero() === 0) {
			lEstPeriodeValable = false;
		}
		const lListeEleves = lEtatUtil.Navigation.getRessources(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
		let lPourClasse = false;
		if (
			!!lListeEleves &&
			lListeEleves.count() === 1 &&
			!lListeEleves.existeNumero(0)
		) {
			lPourClasse = true;
		}
		let lNombrePiliers = 0;
		if (!!this.params.listePiliers) {
			lNombrePiliers = this.params.listePiliers.count();
		}
		return lEstPeriodeValable && !lPourClasse && lNombrePiliers > 0;
	}
	afficher(aParam) {
		$.extend(true, this.params, aParam);
		switch (aParam.modeAffichage) {
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Onglets:
			case TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
				.MAPB_Lineaire:
				this.getInstance(this.identBilanFinDeCycle).setDonnees({
					pourDecompte: false,
					avecValidationAuto: false,
					listePiliers: this.params.listePiliers,
					listeElevesDeClasse: null,
					getAriaLabelListe: this.params.ariaLabelBilanFinDeCycle,
				});
				break;
		}
	}
	getDonneesSaisie() {
		if (
			[
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Onglets,
				TypeModeAffichagePiedBulletin_1.TypeModeAffichagePiedBulletin
					.MAPB_Lineaire,
			].includes(this.params.modeAffichage)
		) {
			return {
				listePiliers: this.getInstance(
					this.identBilanFinDeCycle,
				).getListePiliers(),
			};
		}
	}
	_initInterfaceBilanFinDeCycle(aInstance) {
		aInstance.setAvecEventResizeNavigateur(false);
	}
	_evenementInterfaceBilanFinDeCycle() {
		this.afficher();
	}
}
exports.PiedBulletin_Competences = PiedBulletin_Competences;
