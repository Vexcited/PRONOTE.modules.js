exports.DonneesListe_AppreciationsPdB = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
class DonneesListe_AppreciationsPdB extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
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
				hauteurMinContenuCellule:
					ObjetDonneesListe_1.ObjetDonneesListe.hauteurMinCellule,
			});
		}
	}
	avecEtatSaisie() {
		return this.param.avecValidationAuto !== true;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.libelle:
				return aParams.article.Intitule !== null &&
					aParams.article.Intitule !== undefined &&
					aParams.article.Intitule !== ""
					? ObjetChaine_1.GChaine.avecEspaceSiVide(aParams.article.Intitule)
					: "";
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return aParams.article.ListeAppreciations.get(0).getLibelle();
			default:
		}
	}
	getClassCelluleConteneur(aParams) {
		const D = aParams.article;
		const T = [];
		if (this._estColAvecGras(aParams)) {
			T.push("Gras");
		}
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				if (!this._estCellEditable(aParams)) {
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
				return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				if (this._estCellEditable(aParams)) {
					return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
				} else {
					return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Gris;
				}
			default:
				break;
		}
	}
	avecEdition(aParams) {
		return this._estCellEditable(aParams);
	}
	avecEvenementEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				return (
					this._estCellEditable(aParams) &&
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
					lAppr.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
	_estColAvecGras(aParams) {
		return [DonneesListe_AppreciationsPdB.colonnes.libelle].includes(
			aParams.idColonne,
		);
	}
	_estCellEditable(aParams) {
		let lEditable;
		switch (aParams.idColonne) {
			case DonneesListe_AppreciationsPdB.colonnes.appreciation:
				lEditable = aParams.article.Editable && !aParams.article.Cloture;
				return this.param.saisie && lEditable;
			default:
				return false;
		}
	}
}
exports.DonneesListe_AppreciationsPdB = DonneesListe_AppreciationsPdB;
(function (DonneesListe_AppreciationsPdB) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "libelle";
		colonnes["appreciation"] = "appreciation";
	})(
		(colonnes =
			DonneesListe_AppreciationsPdB.colonnes ||
			(DonneesListe_AppreciationsPdB.colonnes = {})),
	);
})(
	DonneesListe_AppreciationsPdB ||
		(exports.DonneesListe_AppreciationsPdB = DonneesListe_AppreciationsPdB =
			{}),
);
