exports.PanelDetailServiceNotationPN = void 0;
const ObjetStyle_1 = require("ObjetStyle");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_RessourceArrondi_1 = require("Enumere_RessourceArrondi");
const PanelDetailServiceNotation_1 = require("PanelDetailServiceNotation");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Arrondi_1 = require("Enumere_Arrondi");
const TypeArrondi_1 = require("TypeArrondi");
class PanelDetailServiceNotationPN extends PanelDetailServiceNotation_1.PanelDetailServiceNotation {
	constructor(...aParams) {
		super(...aParams);
		this.Largeur = 33.3333;
	}
	getTraductionDevoirSupMoy() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"FicheService.DevoirSupMoyenne",
		);
	}
	getTraductionPonderer() {
		return ObjetTraduction_1.GTraductions.getValeur("FicheService.Ponderer");
	}
	getTraductionNotePlusHaute() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"FicheService.NotePlusHaute",
		);
	}
	getTraductionNotePlusBasse() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"FicheService.NotePlusBasse",
		);
	}
	getTraductionEleve() {
		return ObjetTraduction_1.GTraductions.getValeur("Eleve");
	}
	getTraductionClasse() {
		return ObjetTraduction_1.GTraductions.getValeur("Classe");
	}
	getTraductionArrondir() {
		return ObjetTraduction_1.GTraductions.getValeur("FicheService.Arrondir");
	}
	getTraductionBonusMalus() {
		return ObjetTraduction_1.GTraductions.getValeur("FicheService.BonusMalus");
	}
	getTraductionErreurSaisieNote() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"FicheService.ErreurSaisieNote",
		);
	}
	getTraductionCoefficient() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"FicheService.CoefficientGeneral",
		);
	}
	composePage() {
		const LStyleBordure = ObjetStyle_2.GStyle.composeCouleurBordure(
			GCouleur.liste.bordure,
			1,
			ObjetStyle_1.EGenreBordure.gauche,
		);
		const H = [];
		H.push('<div style="width:738px">');
		H.push('<table class="full-width" role="presentation">');
		H.push("<tr>");
		H.push(
			'<td class="Gras p-all" style="' +
				LStyleBordure +
				"width:" +
				this.Largeur +
				"%;" +
				ObjetStyle_2.GStyle.composeCouleur(
					GCouleur.bandeau.fond,
					GCouleur.bandeau.texte,
				) +
				'">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheService.MoyenneService",
				) +
				"&nbsp;" +
				'<span id="' +
				this.IdPeriode +
				'"></span>' +
				"</td>",
		);
		H.push('<td class="Gras p-left-l p-y">' + this.composeGeneral() + "</td>");
		H.push("</tr>");
		H.push("</table>");
		H.push(
			'<table class="full-width" style="' +
				ObjetStyle_2.GStyle.composeCouleurBordure(
					GCouleur.liste.bordure,
					1,
					ObjetStyle_1.EGenreBordure.droite +
						ObjetStyle_1.EGenreBordure.haut +
						ObjetStyle_1.EGenreBordure.bas,
				) +
				'" role="presentation">',
		);
		H.push(
			'<tr style="' +
				ObjetStyle_2.GStyle.composeCouleurBordure(
					GCouleur.liste.bordure,
					1,
					ObjetStyle_1.EGenreBordure.haut,
				) +
				'">',
		);
		H.push(
			'<td style="' +
				LStyleBordure +
				"width:" +
				1 * this.Largeur +
				'%;" rowspan="2">' +
				this.composeModeCalculMoyenne() +
				"</td>",
		);
		H.push(
			'<td class="p-all" style="' +
				LStyleBordure +
				"width:" +
				1 * this.Largeur +
				'%;">' +
				this.composeDevoirSupMoy() +
				"</td>",
		);
		H.push(
			'<td class="p-all" style="' +
				LStyleBordure +
				"width:" +
				1 * this.Largeur +
				'%;">' +
				this.composeCoefficient() +
				"</td>",
		);
		H.push("</tr>");
		H.push("<tr>");
		H.push(
			'<td class="p-all" style="' +
				LStyleBordure +
				'">' +
				this.composeBonusMalus() +
				"</td>",
		);
		H.push(
			'<td class="AlignementHaut" style="' +
				LStyleBordure +
				'" rowspan="2">' +
				this.composeArrondis() +
				"</td>",
		);
		H.push("</tr>");
		H.push(
			'<tr style="' +
				ObjetStyle_2.GStyle.composeCouleurBordure(
					GCouleur.liste.bordure,
					1,
					ObjetStyle_1.EGenreBordure.bas,
				) +
				'">',
		);
		H.push(
			'<td style="' +
				LStyleBordure +
				'">' +
				this.composeMoyenneBulletin() +
				"</td>",
		);
		H.push(
			'<td style="' +
				LStyleBordure +
				'">' +
				this.composePonderation() +
				"</td>",
		);
		H.push("</tr>");
		H.push("</table>");
		H.push("</div>");
		return H.join("");
	}
	actualiserDroitAffichage() {
		this.activerModeCalculMoyenne = this.Service.estUnService;
		const lMoyenneParSousMatiere = this.Service.estUnService
			? this.Service.periode.moyenneParSousMatiere
			: this.Service.pere.periode.moyenneParSousMatiere;
		this.afficherCoefficientGeneral = this.Service.estUnService
			? true
			: lMoyenneParSousMatiere;
		this.afficherCoefficient = this.Service.estUnService
			? false
			: lMoyenneParSousMatiere;
		this.afficherModeCalculMoyenne = this.Service.estUnService
			? this.Service.avecSousService
			: true;
		this.afficherMoyenneBulletin = this.Service.estUnService
			? this.Service.estUnServiceEnGroupe
			: false;
		this.afficherDevoirSuperieurMoyenne = this.Service.estUnService
			? !this.Service.avecSousService || !lMoyenneParSousMatiere
			: true;
		this.afficherBonusMalus = !!this.Service.estUnService;
		this.afficherPonderation = this.Service.estUnService
			? !this.Service.avecSousService || !lMoyenneParSousMatiere
			: lMoyenneParSousMatiere;
		this.afficherArrondis = this.Service.estUnService
			? true
			: lMoyenneParSousMatiere;
	}
	composeCoefficient() {
		return this.composeSaisie(
			this.idCoefficient,
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheService.CoefficientSousService",
			),
		);
	}
	composeModeCalculMoyenne() {
		const H = [];
		H.push('<fieldset id="', this.idModeCalculMoyenne, '" class="p-all">');
		H.push(
			'<legend class="semi-bold">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheService.ModeCalculMoyenne",
			),
			"</legend>",
		);
		H.push(
			'<div class="p-left-l flex-contain cols flex-gap p-y-l">',
			'<ie-radio ie-model="radioModeCalculMoyServicePere(',
			PanelDetailServiceNotation_1.PanelDetailServiceNotation
				.ModeCalculMoyenneServicePere.MoyDesSousServices,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheService.ModeCalculMoyenneSousService",
			),
			"</ie-radio>",
		);
		H.push(
			'<ie-radio ie-model="radioModeCalculMoyServicePere(',
			PanelDetailServiceNotation_1.PanelDetailServiceNotation
				.ModeCalculMoyenneServicePere.MoyDesDevoirs,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheService.ModeCalculMoyenneDevoir",
			),
			"</ie-radio>",
		);
		H.push("</div></fieldset>");
		return H.join("");
	}
	composeMoyenneBulletin() {
		const H = [];
		H.push('<fieldset id="', this.idMoyenneBulletin, '" class="p-all">');
		H.push(
			'<legend class="semi-bold">',
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheService.MoyenneBulletin",
				),
			),
			"</legend>",
		);
		H.push(
			'<div class="p-left-l flex-contain cols flex-gap p-y-l">',
			'<ie-radio ie-model="radioTypeMoyReferenceBulletin(',
			PanelDetailServiceNotation_1.PanelDetailServiceNotation
				.TypeMoyReferenceBulletin.ElevesDuGroupe,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheService.MoyenneBulletinGroupe",
			),
			"</ie-radio>",
		);
		H.push(
			'<ie-radio ie-model="radioTypeMoyReferenceBulletin(',
			PanelDetailServiceNotation_1.PanelDetailServiceNotation
				.TypeMoyReferenceBulletin.ElevesDeMemeClasse,
			')">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FicheService.MoyenneBulletinClasse",
			),
			"</ie-radio>",
		);
		H.push("</div></fieldset>");
		return H.join("");
	}
	composeGeneral() {
		const H = [];
		H.push(
			'<div class="full-width flex-contain flex-center flex-gap justify-between">',
			'<div class="semi-bold p-left fluid-bloc" style="' +
				ObjetStyle_2.GStyle.composeCouleurTexte(GCouleur.texte) +
				'">' +
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheService.MoyenneGenerale",
				) +
				"</div>",
			'<div class="flex-contain justify-end flex-gap-l">' +
				this.composeSaisie(
					this.idCoefficientGeneral,
					ObjetTraduction_1.GTraductions.getValeur(
						"FicheService.CoefficientGeneral",
					),
				),
			'<ie-checkbox ie-model="cbFacultatif">',
			ObjetTraduction_1.GTraductions.getValeur("FicheService.Facultatif"),
			"</ie-checkbox>",
			"</div>",
			"</div>",
		);
		return H.join("");
	}
	composeArrondis() {
		const T = [];
		T.push(
			'<fieldset id="',
			this.idArrondis,
			'" class="p-all">',
			'<legend class="semi-bold text-center">',
			ObjetTraduction_1.GTraductions.getValeur("FicheService.Arrondir"),
			"</legend>",
			'<div class="flex-contain cols flex-gap p-y-l">',
			this.composeArrondi(
				ObjetTraduction_1.GTraductions.getValeur("Eleve"),
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant,
			),
			this.composeArrondi(
				ObjetTraduction_1.GTraductions.getValeur("Classe"),
				Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion,
			),
			"</div></fieldset>",
		);
		return T.join("");
	}
	composeArrondi(aMessage, aGenreRessourceArrondi) {
		const lIdMess = `${this.Nom}_arr_mess_${aGenreRessourceArrondi}`;
		const lIdCombo = `${this.Nom}_arr_combo_${aGenreRessourceArrondi}`;
		const T = [];
		T.push('<div class="flex-contain flex-center flex-gap ">');
		T.push(
			IE.jsx.str(
				"div",
				{ class: "fix-bloc", style: "min-width:35px;", id: lIdMess },
				aMessage,
			),
		);
		T.push(
			IE.jsx.str(
				"div",
				{ id: lIdCombo },
				IE.jsx.str("ie-combo", {
					"ie-model": this.jsxComboModelPrecisionArrondi.bind(
						this,
						aGenreRessourceArrondi,
					),
				}),
			),
		);
		const lGroupeRadioName = "group_" + aGenreRessourceArrondi;
		T.push(
			`<div role="group" aria-labelledby="${lIdMess} ${lIdCombo}">`,
			'<ie-radio ie-model="radioTypeArrondi(',
			aGenreRessourceArrondi,
			",",
			Enumere_Arrondi_1.EGenreArrondi.superieur,
			')" name="',
			lGroupeRadioName,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("FicheService.Superieure"),
			"</ie-radio>",
			'<ie-radio ie-model="radioTypeArrondi(',
			aGenreRessourceArrondi,
			",",
			Enumere_Arrondi_1.EGenreArrondi.plusProche,
			')" name="',
			lGroupeRadioName,
			'">',
			ObjetTraduction_1.GTraductions.getValeur("FicheService.LaPlusProche"),
			"</ie-radio>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	getListeArrondis() {
		let lArrondi;
		const lListeArrondis = new ObjetListeElements_1.ObjetListeElements();
		lArrondi = new ObjetElement_1.ObjetElement(
			TypeArrondi_1.TypeArrondi.getLibelleSelonPrecision(0.01),
		);
		lArrondi.precision = 0.01;
		lListeArrondis.addElement(lArrondi);
		lArrondi = new ObjetElement_1.ObjetElement(
			TypeArrondi_1.TypeArrondi.getLibelleSelonPrecision(0.1),
		);
		lArrondi.precision = 0.1;
		lListeArrondis.addElement(lArrondi);
		lArrondi = new ObjetElement_1.ObjetElement(
			TypeArrondi_1.TypeArrondi.getLibelleSelonPrecision(0.5),
		);
		lArrondi.precision = 0.5;
		lListeArrondis.addElement(lArrondi);
		lArrondi = new ObjetElement_1.ObjetElement(
			TypeArrondi_1.TypeArrondi.getLibelleSelonPrecision(1.0),
		);
		lArrondi.precision = 1.0;
		lListeArrondis.addElement(lArrondi);
		return lListeArrondis;
	}
}
exports.PanelDetailServiceNotationPN = PanelDetailServiceNotationPN;
