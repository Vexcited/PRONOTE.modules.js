exports.ObjetParametresAffichage = exports.ParametreAffichage = void 0;
var EEtatElementGraphique;
(function (EEtatElementGraphique) {
	EEtatElementGraphique[(EEtatElementGraphique["base"] = 0)] = "base";
	EEtatElementGraphique[(EEtatElementGraphique["selection"] = 1)] = "selection";
	EEtatElementGraphique[(EEtatElementGraphique["survol"] = 2)] = "survol";
})(EEtatElementGraphique || (EEtatElementGraphique = {}));
class ParametreAffichage {
	constructor(aNom, aValeur, aValeurSelection, aValeurSurvol) {
		this.nom = aNom;
		this.valeur = [];
		if (aValeur !== null && aValeur !== undefined) {
			this.valeur[EEtatElementGraphique.base] = aValeur;
		}
		if (aValeurSelection !== null && aValeurSelection !== undefined) {
			this.valeur[EEtatElementGraphique.selection] = aValeurSelection;
		}
		if (aValeurSurvol !== null && aValeurSurvol !== undefined) {
			this.valeur[EEtatElementGraphique.survol] = aValeurSurvol;
		}
	}
	getValeur(aEnSelection, aEnSurvol) {
		if (
			aEnSurvol &&
			this.valeur[EEtatElementGraphique.survol] !== null &&
			this.valeur[EEtatElementGraphique.survol] !== undefined
		) {
			return this.valeur[EEtatElementGraphique.survol];
		} else {
			if (
				aEnSelection &&
				this.valeur[EEtatElementGraphique.selection] !== null &&
				this.valeur[EEtatElementGraphique.selection] !== undefined
			) {
				return this.valeur[EEtatElementGraphique.selection];
			} else {
				return this.valeur[EEtatElementGraphique.base];
			}
		}
	}
	setValeur(aBase, aEnSelection, aEnSurvol) {
		if (aBase !== null && aBase !== undefined) {
			this.valeur[EEtatElementGraphique.base] = aBase;
		}
		if (aEnSelection !== null && aEnSelection !== undefined) {
			this.valeur[EEtatElementGraphique.selection] = aEnSelection;
		}
		if (aEnSurvol !== null && aEnSurvol !== undefined) {
			this.valeur[EEtatElementGraphique.survol] = aEnSurvol;
		}
	}
}
exports.ParametreAffichage = ParametreAffichage;
class ObjetParametresAffichage {
	constructor(aNom) {
		this.nom = aNom;
		this.tabParametres = [];
	}
	addParametre(aObjet) {
		this.tabParametres.push(aObjet);
	}
	getParametre(aNom) {
		for (let I = 0; I < this.tabParametres.length; I++) {
			if (this.tabParametres[I].nom === aNom) {
				return this.tabParametres[I];
			}
		}
	}
}
exports.ObjetParametresAffichage = ObjetParametresAffichage;
