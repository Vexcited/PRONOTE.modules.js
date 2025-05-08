const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreNiveauDAcquisitionUtil,
} = require("Enumere_NiveauDAcquisition.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { GHtml } = require("ObjetHtml.js");
const { TypePositionnementUtil } = require("TypePositionnement.js");
class DonneesListe_SuiviPluriAnnuel extends ObjetDonneesListe {
	constructor(aParams) {
		super(aParams.listeDonnees);
		this.params = Object.assign(
			{
				listeDonnees: null,
				listeTotal: null,
				infosGrapheTotal: [],
				avecMoyennesSaisies: false,
			},
			aParams,
		);
		this.setOptions({
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
			heightLigne: 0,
			getCouleurAnnee: null,
		});
	}
	getControleur(aInstanceDonneesListe, aInstanceListe) {
		return $.extend(
			true,
			super.getControleur(aInstanceDonneesListe, aInstanceListe),
			{
				getHint: function (aHint) {
					return aHint;
				},
			},
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviPluriAnnuel.colonnes.matiere:
				return aParams.article.matiere;
			case DonneesListe_SuiviPluriAnnuel.colonnes.graphe: {
				return _composeGraphique.call(this, aParams.article.infosGraphe);
			}
			default:
				return _getValeurDynamique(aParams.colonne, aParams.article, aParams);
		}
	}
	getTri() {
		return [ObjetTri.init("matiere")];
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviPluriAnnuel.colonnes.matiere:
				return ObjetDonneesListe.ETypeCellule.Texte;
			default:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviPluriAnnuel.colonnes.matiere:
				return GCouleur.liste.nonEditable;
			default:
				return GCouleur.liste.editable;
		}
	}
	getContenuTotal(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SuiviPluriAnnuel.colonnes.matiere:
				return _getTitreTotalDynamique.call(this, aParams);
			case DonneesListe_SuiviPluriAnnuel.colonnes.graphe:
				return _composeGraphique.call(this, this.params.infosGrapheTotal);
			default:
				return _getValeurTotalDynamique.call(this, aParams);
		}
	}
}
DonneesListe_SuiviPluriAnnuel.colonnes = {
	matiere: "matiere",
	graphe: "graphe",
	annee: "annee",
};
function _getImgPastille(aDeNiveau) {
	const lElement = GParametres.listeNiveauxDAcquisitions.getElementParGenre(
		aDeNiveau.getGenre(),
	);
	return EGenreNiveauDAcquisitionUtil.getImagePositionnement({
		niveauDAcquisition: lElement,
		avecTitle: false,
		genrePositionnement:
			TypePositionnementUtil.getGenrePositionnementParDefaut(),
	});
}
function _getHint(aParams) {
	let lHint = [];
	const regexFwd = /#/gi;
	const regexBwd = /@#@/gi;
	const lPastilles = [aParams.image.replace(regexFwd, "@#@")];
	if (aParams.maitrise.listeDetails) {
		for (let i = 0; i < aParams.maitrise.listeDetails.count(); i++) {
			const lDetail = aParams.maitrise.listeDetails.get(i);
			let lCouleurPastille = _getImgPastille(lDetail.niveau);
			lCouleurPastille = lCouleurPastille.replace(regexFwd, "@#@");
			lPastilles.push(lCouleurPastille);
		}
	}
	lHint.push(GChaine.format(aParams.maitrise.hint, lPastilles));
	lHint = lHint.join("");
	lHint = lHint.replace(regexBwd, "#");
	return lHint;
}
function _getValeurDynamique(aColonne, D, aParams) {
	const idColonne = aParams.declarationColonne.id;
	const lClass = [];
	let lCoeff = "";
	let lTitle = "";
	lClass.push("InlineBlock");
	if (
		D[idColonne].suivi.appreciation !== undefined &&
		D[idColonne].suivi.appreciation !== ""
	) {
		lClass.push("Image_ListeCommentaire");
		lTitle = ' title="' + D[idColonne].suivi.appreciation + '"';
	}
	if (
		D[idColonne].suivi.coefficient &&
		D[idColonne].suivi.moyenne &&
		D[idColonne].suivi.moyenne.valeur > 0 &&
		!D[idColonne].suivi.coefficient.estCoefficientParDefaut()
	) {
		lCoeff = D[idColonne].suivi.coefficient;
	}
	const lHtml = [];
	lHtml.push('<div class="p-all-s flex-contain cols justify-center">');
	lHtml.push("<div>");
	lHtml.push(
		'<div class="',
		lClass.join(" "),
		'" style="width:26px;height:16px;"',
	);
	lHtml.push(lTitle);
	lHtml.push("></div>");
	const lAvecMoyenneEleve =
		D[idColonne].suivi.moyenne && D[idColonne].suivi.moyenne.valeur > 0;
	const lAvecAnnotation =
		!!D[idColonne].suivi.strAnnotation &&
		D[idColonne].suivi.strAnnotation !== "";
	let lAvecHint = lAvecAnnotation;
	let lStrHint = D[idColonne].suivi.hintAnnotation;
	let lClassMoyenne = "InlineBlock AlignementMilieu Gras";
	const lStrMoyenne = [
		lAvecMoyenneEleve
			? D[idColonne].suivi.moyenne
			: lAvecAnnotation
				? D[idColonne].suivi.strAnnotation
				: "&nbsp;",
	];
	if (lAvecMoyenneEleve && D[idColonne].suivi.facultatif) {
		lAvecHint = true;
		lStrHint = GTraductions.getValeur("SuiviPluriannuel.facultatif");
		if (D[idColonne].suivi.Bonus) {
			lClassMoyenne = lClassMoyenne + " Italique";
		} else {
			lStrMoyenne.push("(", lStrMoyenne, ")");
		}
	}
	let lHint = lAvecHint ? 'ie-hint="' + lStrHint + '"' : "";
	lHtml.push(
		'<div class="',
		lClassMoyenne,
		'" style="width:42px; vertical-align:top;" ',
		lHint,
		">",
		lStrMoyenne.join(""),
		"</div>",
	);
	lHtml.push(
		'<div class="InlineBlock" style="font-size: 0.8em;width:26px;height:16px;">',
		lCoeff,
		"</div>",
	);
	lHtml.push("</div>");
	const lAvecMoyenneClasse =
		D[idColonne].suivi.moyenneClasse &&
		D[idColonne].suivi.moyenneClasse.valeur > 0;
	lHint =
		'ie-hint="' +
		GTraductions.getValeur("SuiviPluriannuel.moyenneClasse") +
		'"';
	lHtml.push(
		'<div class="AlignementMilieu Italique EspaceBas" ',
		lAvecMoyenneClasse ? lHint : "",
		">",
		lAvecMoyenneClasse ? D[idColonne].suivi.moyenneClasse : "&nbsp;",
		"</div>",
	);
	const lNbElt = D[idColonne].suivi.listeMaitrises
		? D[idColonne].suivi.listeMaitrises.count()
		: 0;
	if (lNbElt > 0) {
		lHtml.push('<div class="AlignementMilieu">');
		for (let i = 0; i < lNbElt; i++) {
			const lMaitrise = D[idColonne].suivi.listeMaitrises.get(i);
			const lImage = _getImgPastille(lMaitrise.niveau);
			const lDonneesHint = { maitrise: lMaitrise, image: lImage };
			let lEcart = "";
			if (i === 0) {
				lEcart = "padding-left: 7px;";
			}
			lHtml.push(
				'<div class="InlineBlock" style="width:20px;',
				lEcart,
				'"',
				GHtml.composeAttr("ie-hint", "getHint", _getHint(lDonneesHint)),
				">",
				lImage,
				"</div>",
			);
		}
		for (let j = lNbElt; j < D[idColonne].nbMaxPeriode; j++) {
			lHtml.push('<div class="InlineBlock" style="width:20px;">&nbsp;</div>');
		}
		lHtml.push("</div>");
	}
	lHtml.push("</div>");
	return lHtml.join("");
}
function _getTitreTotalDynamique() {
	if (this.params.avecMoyennesSaisies) {
		const lHtml = [];
		lHtml.push('<div class="AlignementDroit">');
		lHtml.push(GTraductions.getValeur("SuiviPluriannuel.moyenneGenerale"));
		lHtml.push("</div>");
		lHtml.push('<div class="AlignementDroit">');
		lHtml.push(GTraductions.getValeur("SuiviPluriannuel.esito"));
		lHtml.push("</div>");
		lHtml.push('<div class="AlignementDroit">');
		lHtml.push(GTraductions.getValeur("SuiviPluriannuel.assiduite"));
		lHtml.push("</div>");
		lHtml.push('<div class="AlignementDroit">');
		lHtml.push(GTraductions.getValeur("SuiviPluriannuel.credit"));
		lHtml.push("</div>");
		return lHtml.join("");
	} else {
		return GTraductions.getValeur("SuiviPluriannuel.moyenneGenerale");
	}
}
function _getValeurTotalDynamique(aParams) {
	const idColonne = aParams.declarationColonne.id;
	const lElement = this.params.listeTotal[idColonne];
	const lHtml = [];
	lHtml.push('<div class="PetitEspace">');
	lHtml.push(
		'<div class="AlignementMilieu Gras PetitEspaceBas">',
		lElement.moyenne && lElement.moyenne.valeur > 0
			? lElement.moyenne
			: "&nbsp;",
		"</div>",
	);
	if (this.params.avecMoyennesSaisies) {
		lHtml.push(
			'<div ie-ellipsis-fixe class="AlignementMilieu" style="',
			GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.haut),
			'">',
		);
		lHtml.push(
			lElement.strEsito && lElement.strEsito !== ""
				? lElement.strEsito
				: "&nbsp;",
		);
		lHtml.push("</div>");
		const lHint = lElement.hintAssiduite
			? '" ie-hint="' + lElement.hintAssiduite
			: "";
		lHtml.push(
			'<div class="AlignementMilieu" style="',
			GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.haut),
			lHint,
			'">',
		);
		lHtml.push(
			lElement.strAssiduite && lElement.strAssiduite !== ""
				? lElement.strAssiduite
				: "&nbsp;",
		);
		lHtml.push("</div>");
		lHtml.push(
			'<div class="AlignementMilieu" style="',
			GStyle.composeCouleurBordure(GCouleur.bordure, 1, EGenreBordure.haut),
			'">',
		);
		lHtml.push(
			lElement.credits && lElement.credits !== "" ? lElement.credits : "&nbsp;",
		);
		lHtml.push("</div>");
	} else {
		lHtml.push(
			'<div class="AlignementMilieu Italique PetitEspaceBas">',
			lElement.moyenneClasse && lElement.moyenneClasse.valeur > 0
				? lElement.moyenneClasse
				: "&nbsp;",
			"</div>",
		);
	}
	lHtml.push("</div>");
	return lHtml.join("");
}
function _composeGraphique(aAnnees) {
	const T = [];
	T.push('<div class="AlignementMilieu">');
	if (aAnnees && aAnnees.length > 0) {
		const lLargeur = 20 + 20 * aAnnees.length;
		let lRangAnnee = 0;
		let lTabLabel = [];
		aAnnees.forEach((aAnnee, aIndex) => {
			if (aAnnee && aAnnee.moyenne && aAnnee.moyenne.estUneValeur()) {
				const lDonnesAnnee = this.params.listeDonnees.get(0)[`annee${aIndex}`];
				if (lDonnesAnnee) {
					lTabLabel.push(
						GTraductions.getValeur("SuiviPluriannuel.WAIGraphe_SSS", [
							lDonnesAnnee.strAnnee,
							aAnnee.moyenne.getValeur(),
							aAnnee.bareme.getValeur(),
						]),
					);
				}
			}
		});
		const lArialabel = lTabLabel.join(", ").toAttrValue();
		T.push(
			`<svg width="${lLargeur}" height="60" role="img" ${lArialabel ? `aria-label="${lArialabel}"` : ""} aria-hidden="${!lArialabel}">`,
		);
		aAnnees.forEach((aAnnee) => {
			if (aAnnee && aAnnee.moyenne && aAnnee.moyenne.estUneValeur()) {
				T.push(_composeAnneeSVG.call(this, aAnnee, lRangAnnee));
			}
			lRangAnnee++;
		});
		T.push(
			'  <line x1="5" y1="30" x2="',
			lLargeur - 5,
			'" y2="30" stroke="#c5c5c5" stroke-width="0.5" /> </svg>',
		);
	}
	T.push("</div>");
	return T.join("");
}
function _composeAnneeSVG(aAnnee, aRang) {
	const lImage = [];
	const lHauteur =
		(40 * aAnnee.moyenne.getValeur()) / aAnnee.bareme.getValeur();
	const lTop = 50 - lHauteur;
	const lAbscisse = 10 + 20 * aRang;
	lImage.push(
		'  <rect x="',
		lAbscisse,
		'" y="',
		lTop,
		'" width="20" height="',
		lHauteur,
		'" fill="',
		aAnnee.couleur,
		'" />',
	);
	return lImage.join("");
}
module.exports = DonneesListe_SuiviPluriAnnuel;
