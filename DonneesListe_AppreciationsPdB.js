const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetMoteurAssistantSaisie } = require("ObjetMoteurAssistantSaisie.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
class DonneesListe_AppreciationsPdB extends ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurAssSaisie = new ObjetMoteurAssistantSaisie();
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
		this.param = $.extend(
			{
				saisie: false,
				typeReleveBulletin: null,
				contexte: null,
				total: false,
				avecValidationAuto: false,
				clbckValidationAutoSurEdition: null,
				instanceListe: null,
			},
			aParam,
		);
		const lNbrLignes = aDonnees.count();
		if (lNbrLignes > 0) {
			this.setOptions({
				hauteurMinCellule: lNbrLignes > 4 ? 40 : 160 / lNbrLignes,
				hauteurMinContenuCellule: ObjetDonneesListe.hauteurMinCellule,
			});
		}
	}
	avecEtatSaisie() {
		return this.param.avecValidationAuto !== true;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.libelle:
				return aParams.article.Intitule !== null &&
					aParams.article.Intitule !== undefined &&
					aParams.article.Intitule !== ""
					? GChaine.avecEspaceSiVide(aParams.article.Intitule)
					: "";
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return aParams.article.ListeAppreciations.get(0).getLibelle();
			default:
		}
	}
	getClassCelluleConteneur(aParams) {
		const D = aParams.article;
		const T = [];
		if (_estColAvecGras.call(this, aParams)) {
			T.push("Gras");
		}
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				if (!_estCellEditable.call(this, aParams)) {
					T.push("AvecInterdiction");
				} else {
					if (
						this.moteurAssSaisie.avecAssistantSaisieActif({
							estCtxPied: true,
							typeReleveBulletin: this.param.typeReleveBulletin,
							appreciation: D,
							contexte: this.param.contexte,
						})
					) {
						T.push("Curseur_AssistantSaisieActif");
					}
				}
				break;
		}
		return T.join(" ");
	}
	getCouleurCellule(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.libelle:
				return ObjetDonneesListe.ECouleurCellule.Fixe;
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				if (_estCellEditable.call(this, aParams)) {
					return ObjetDonneesListe.ECouleurCellule.Blanc;
				} else {
					return ObjetDonneesListe.ECouleurCellule.Gris;
				}
			default:
				break;
		}
	}
	avecEdition(aParams) {
		return _estCellEditable.call(this, aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return (
					_estCellEditable.call(this, aParams) &&
					(this.moteurPdB.estMention({ appreciation: aParams.article }) ||
						this.moteurAssSaisie.avecAssistantSaisieActif({
							estCtxPied: true,
							typeReleveBulletin: this.param.typeReleveBulletin,
							appreciation: aParams.article,
							contexte: this.param.contexte,
						}))
				);
			default:
				break;
		}
		return false;
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	getControleCaracteresInput(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return {
					tailleMax: this.moteur.getTailleMaxAppreciation({
						estCtxPied: true,
						appreciation: aParams.article,
						typeReleveBulletin: this.param.typeReleveBulletin,
					}),
				};
		}
		return null;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation: {
				const lAppr = aParams.article.ListeAppreciations
					? aParams.article.ListeAppreciations.get(
							aParams.declarationColonne.indice,
						)
					: null;
				if (lAppr) {
					lAppr.setLibelle(!!V ? V.trim() : "");
					lAppr.setEtat(EGenreEtat.Modification);
				}
				if (
					this.param.avecValidationAuto === true &&
					this.param.clbckValidationAutoSurEdition !== null &&
					this.param.clbckValidationAutoSurEdition !== undefined
				) {
					this.param.clbckValidationAutoSurEdition({
						instanceListe: this.param.instanceListe,
						appreciation: lAppr,
					});
				}
				break;
			}
		}
	}
	getHauteurMinCellule() {
		return this.options.hauteurMinCellule;
	}
}
DonneesListe_AppreciationsPdB.colonnes = {
	libelle: "libelle",
	appreciation: "appreciation",
};
function _estColAvecGras(aParams) {
	return [DonneesListe_AppreciationsPdB.colonnes.libelle].includes(
		aParams.idColonne,
	);
}
function _estCellEditable(aParams) {
	let lEditable;
	switch (aParams.idColonne) {
		case DonneesListe_AppreciationsPdB.colonnes.appreciation:
			lEditable = aParams.article.Editable && !aParams.article.Cloture;
			return this.param.saisie && lEditable;
		default:
			return false;
	}
}
module.exports = { DonneesListe_AppreciationsPdB };
