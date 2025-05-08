const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
class ObjetFenetre_SelectionQCMServicePeriode extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aInstance.donnees && aBoutonRepeat.element.valider) {
						return !_verifierDonnees.call(aInstance, aInstance.donnees);
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs &&
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
			selectQCM: {
				bouton: function () {
					$(this.node).eventValidation(_selectionQCM.bind(aInstance));
				},
				libelle: function () {
					if (!!aInstance.donnees && !!aInstance.donnees.qcm) {
						return GChaine.enleverEntites(aInstance.donnees.qcm.getLibelle());
					} else {
						return "";
					}
				},
			},
			comboService: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie(
						Object.assign(
							{
								longueur: "100%",
								labelWAICellule: GTraductions.getValeur(
									"CahierDeTexte.TAFQCM.Service",
								),
							},
							_getOptionsComboService.call(aInstance),
						),
					);
				},
				getDonnees: function (aDonnees) {
					if (
						!aDonnees &&
						aInstance &&
						aInstance.donnees &&
						!!aInstance.donnees.services
					) {
						return aInstance.donnees.services;
					}
				},
				getIndiceSelection: function () {
					let lResult = 0;
					if (aInstance && aInstance.donnees && !!aInstance.donnees.services) {
						if (!!aInstance.donnees.service) {
							lResult = aInstance.donnees.services.getIndiceParElement(
								aInstance.donnees.service,
							);
						} else {
							lResult = aInstance.donnees.services.getIndiceElementParFiltre(
								(aElement) => {
									return aElement.preferentiel;
								},
							);
						}
					}
					return lResult;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element &&
						(!aInstance.donnees.service ||
							!aInstance.donnees.service.egalParNumeroEtGenre(
								aParametres.element.getNumero(),
								aParametres.element.getGenre(),
							))
					) {
						aInstance.donnees.periode = undefined;
						aInstance.resetDonnees = true;
						aInstance.donnees.service = aParametres.element;
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			comboPeriode: {
				init: function (aInstance) {
					aInstance.setOptionsObjetSaisie(
						Object.assign(
							{
								longueur: "100%",
								labelWAICellule: GTraductions.getValeur(
									"CahierDeTexte.TAFQCM.Periode",
								),
							},
							_getOptionsComboService.call(aInstance),
						),
					);
				},
				getDonnees: function (aDonnees) {
					if (
						aInstance &&
						(!aDonnees || aInstance.resetDonnees) &&
						aInstance.donnees &&
						!!aInstance.donnees.service
					) {
						aInstance.resetDonnees = false;
						return aInstance.donnees.service.periodes;
					}
				},
				getIndiceSelection: function () {
					let lResult = 0;
					if (
						aInstance &&
						aInstance.donnees &&
						!!aInstance.donnees.service &&
						!!aInstance.donnees.service.periodes
					) {
						if (!!aInstance.donnees.periode) {
							lResult = aInstance.donnees.service.periodes.getIndiceParElement(
								aInstance.donnees.periode,
							);
						} else {
							lResult =
								aInstance.donnees.service.periodes.getIndiceElementParFiltre(
									(aElement) => {
										return GDate.dateEntreLesDates(
											aInstance.donnees.dateCreationTAF,
											aElement.debut,
											aElement.fin,
										);
									},
								);
						}
					}
					return lResult;
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element
					) {
						aInstance.donnees.periode = aParametres.element;
					}
				},
				getDisabled: function () {
					return false;
				},
			},
		});
	}
	composeContenu() {
		return this.compose();
	}
	compose() {
		const lHTML = [];
		lHTML.push('<div class="SelectionQCMServicePeriode">');
		lHTML.push(_composeQCM.call(this));
		lHTML.push(_composeService.call(this));
		lHTML.push(_composePeriode.call(this));
		lHTML.push("</div>");
		return lHTML.join("");
	}
	getParametresValidation(aNumeroBouton) {
		const lParametres = super.getParametresValidation(aNumeroBouton);
		$.extend(lParametres, this.donnees);
		return lParametres;
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		this.afficher();
		_selectionQCM.call(this);
	}
	static ouvrir(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				pourEvaluation: false,
				services: new ObjetListeElements(),
				dateCreationTAF: null,
				dateFinCours: null,
			},
			aParams,
		);
		return new Promise((aResolve) => {
			const lFenetre = ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionQCMServicePeriode,
				{
					pere: lParams.instance,
					evenement: function (aNumeroBouton, aParams) {
						if (aNumeroBouton !== 1) {
							return aResolve({ valider: false });
						}
						aParams.valider = true;
						aResolve(aParams);
					},
				},
				{
					modale: true,
					titre: lParams.pourEvaluation
						? GTraductions.getValeur("CahierDeTexte.TAFQCM.AddQCMEvaluation")
						: GTraductions.getValeur("CahierDeTexte.TAFQCM.AddQCMDevoir"),
					listeBoutons: [
						{
							libelle: GTraductions.getValeur("Annuler"),
							theme: TypeThemeBouton.secondaire,
						},
						{
							libelle: GTraductions.getValeur("Valider"),
							valider: true,
							theme: TypeThemeBouton.primaire,
						},
					],
					largeur: 520,
					avecTailleSelonContenu: true,
				},
			);
			lFenetre.setDonnees({
				pourEvaluation: lParams.pourEvaluation,
				services: lParams.services,
				dateCreationTAF: lParams.dateCreationTAF,
				dateFinCours: lParams.dateFinCours,
			});
		});
	}
}
function _verifierDonnees(aDonnees) {
	let lResult = false;
	if (!!aDonnees) {
		lResult = !!aDonnees.qcm && !!aDonnees.service && !!aDonnees.periode;
	}
	return lResult;
}
function _selectionQCM() {
	UtilitaireSaisieCDT.choisirQCM({
		instance: this,
		paramsRequete: { pourEvaluation: this.donnees.pourEvaluation },
	}).then((aParamQCM) => {
		if (aParamQCM.eltQCM) {
			this.donnees.qcm = aParamQCM.eltQCM;
		}
	});
}
function _getOptionsComboService() {
	return {};
}
function _composeQCM() {
	const lHTML = [];
	lHTML.push(
		'<div class="selqcm_zone selqcm_z_qcm">',
		'<div class="selqcm_label">',
		GTraductions.getValeur("CahierDeTexte.TAFQCM.QCM"),
		"</div>",
		'<div class="like-input selqcm_qcm AvecMain" tabindex="0" ie-node="selectQCM.bouton"><div class="selqcm_qcm_content" ie-texte="selectQCM.libelle"></div></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composeService() {
	const lHTML = [];
	lHTML.push(
		'<div class="selqcm_zone selqcm_z_service">',
		'<div class="selqcm_label">',
		GTraductions.getValeur("CahierDeTexte.TAFQCM.Service"),
		"</div>",
		'<div class="selqcm_service"><ie-combo class="selqcm_service" ie-model="comboService"></ie-combo></div>',
		"</div>",
	);
	return lHTML.join("");
}
function _composePeriode() {
	const lHTML = [];
	lHTML.push(
		'<div class="selqcm_zone selqcm_z_periode">',
		'<div class="selqcm_label">',
		GTraductions.getValeur("CahierDeTexte.TAFQCM.Periode"),
		"</div>",
		'<div class="selqcm_periode"><ie-combo class="selqcm_periode" ie-model="comboPeriode"></ie-combo></div>',
		"</div>",
	);
	return lHTML.join("");
}
module.exports = ObjetFenetre_SelectionQCMServicePeriode;
