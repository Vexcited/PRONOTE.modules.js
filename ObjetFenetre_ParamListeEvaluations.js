const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const TypeAffichageTitreColonneCompetence = {
	AffichageLibelle: 0,
	AffichageCode: 1,
};
class ObjetFenetre_ParamListeEvaluations extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecOptionAfficherProjetsAcc = true;
		this.afficherProjetsAccompagnement = false;
		this.afficherPourcentageReussite = false;
		this.typeAffichageTitreColonneCompetence =
			TypeAffichageTitreColonneCompetence.AffichageLibelle;
		this.hintPourcentageReussite = "";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			checkAfficherProjetsAccompagnement: {
				getValue: function () {
					return aInstance.afficherProjetsAccompagnement;
				},
				setValue: function (aData) {
					aInstance.afficherProjetsAccompagnement = aData;
				},
			},
			displayOptionAfficherProjAcc: function () {
				return aInstance.avecOptionAfficherProjetsAcc;
			},
			checkAfficherPourcentageReussite: {
				getValue: function () {
					return aInstance.afficherPourcentageReussite;
				},
				setValue: function (aData) {
					aInstance.afficherPourcentageReussite = aData;
				},
			},
			radioTypeAffichageTitreColonne: {
				getValue: function (aTypeAffichage) {
					return (
						aInstance.typeAffichageTitreColonneCompetence === aTypeAffichage
					);
				},
				setValue: function (aTypeAffichage) {
					aInstance.typeAffichageTitreColonneCompetence = aTypeAffichage;
				},
			},
			aidePourcentageReussite: {
				getDisplay: function () {
					return (
						!!aInstance.hintPourcentageReussite &&
						aInstance.hintPourcentageReussite.length > 0
					);
				},
				getTitle: function () {
					return aInstance.hintPourcentageReussite;
				},
			},
		});
	}
	composeContenu() {
		const T = [];
		T.push('<div class="Espace">');
		T.push('<fieldset class="EspaceBas10">');
		T.push(
			"<legend>",
			GTraductions.getValeur(
				"evaluations.FenetreParametrageAffichage.PersonnaliserColonnes",
			),
			"</legend>",
		);
		T.push('<div class="PetitEspaceHaut GrandEspaceGauche">');
		_getTypesAffichageTitreColonneCompetence().forEach((D) => {
			T.push(
				'<div class="PetitEspaceHaut">',
				'<ie-radio ie-model="radioTypeAffichageTitreColonne(',
				D[0],
				')" class="AlignementMilieuVertical PetitEspaceDroit">',
				D[1],
				"</ie-radio>",
				"</div>",
			);
		});
		T.push(
			'<div class="EspaceHaut">',
			'<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherPourcentageReussite">',
			GTraductions.getValeur(
				"evaluations.FenetreParametrageAffichage.AfficherPourcentageReussite",
			),
			"</ie-checkbox>",
			'<span ie-display="aidePourcentageReussite.getDisplay" ie-title="aidePourcentageReussite.getTitle" class="Image_Infos_Transparent InlineBlock MargeGauche AlignementMilieuVertical"></span>',
			"</div>",
		);
		T.push("</div>");
		T.push("</fieldset>");
		T.push(
			'<div ie-display="displayOptionAfficherProjAcc">',
			'<ie-checkbox class="AlignementMilieuVertical" ie-model="checkAfficherProjetsAccompagnement">',
			GTraductions.getValeur(
				"evaluations.FenetreParametrageAffichage.AfficherProjetsAccompagnement",
			),
			"</ie-checkbox>",
			"</label>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	setDonnees(aDonnees) {
		this.avecOptionAfficherProjetsAcc = aDonnees.avecOptionAfficherProjetsAcc;
		this.afficherProjetsAccompagnement = aDonnees.afficherProjetsAccompagnement;
		this.afficherPourcentageReussite = aDonnees.afficherPourcentageReussite;
		this.typeAffichageTitreColonneCompetence =
			aDonnees.typeAffichageTitreColonneCompetence;
		this.hintPourcentageReussite = aDonnees.hintPourcentageReussite;
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, {
			afficherProjetsAccompagnement: this.afficherProjetsAccompagnement,
			afficherPourcentageReussite: this.afficherPourcentageReussite,
			typeAffichageTitreColonneCompetence:
				this.typeAffichageTitreColonneCompetence,
		});
	}
}
function _getTypesAffichageTitreColonneCompetence() {
	const result = [];
	result.push([
		TypeAffichageTitreColonneCompetence.AffichageLibelle,
		GTraductions.getValeur(
			"evaluations.FenetreParametrageAffichage.ColonnesAvecLibelleItem",
		),
	]);
	result.push([
		TypeAffichageTitreColonneCompetence.AffichageCode,
		GTraductions.getValeur(
			"evaluations.FenetreParametrageAffichage.ColonnesAvecCodeItem",
		),
	]);
	return result;
}
module.exports = {
	ObjetFenetre_ParamListeEvaluations,
	TypeAffichageTitreColonneCompetence,
};
