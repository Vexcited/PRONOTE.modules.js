const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { TypeDomaine } = require("TypeDomaine.js");
function _modifierRangChoix(aChoix, aDecalage) {
	const lOldRang = aChoix.rang;
	const lNewRang = lOldRang + aDecalage;
	let lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
		return aElement.existe() && aElement.rang === lNewRang;
	});
	if (lIndice > -1) {
		const lElmRangConflit = this.Donnees.get(lIndice);
		lElmRangConflit.rang = lOldRang;
		lElmRangConflit.setEtat(EGenreEtat.Modification);
	}
	aChoix.rang = lNewRang;
	aChoix.setEtat(EGenreEtat.Modification);
	this.Donnees.trier();
	const lNumero = aChoix.getNumero();
	lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
		return aElement.existe() && aElement.getNumero() === lNumero;
	});
	return lIndice;
}
class DonneesListe_ActualitesChoix extends ObjetDonneesListe {
	constructor(aDonnees, aCallbackMenuContextuel, aAvecLimiteDomaine) {
		super(aDonnees);
		this.callbackMenuContextuel = aCallbackMenuContextuel;
		this.creerIndexUnique("Libelle");
		this.avecLimiteDomaine = aAvecLimiteDomaine;
		this.setOptions({
			hauteurMinCellule: 30,
			avecEvnt_ApresCreation: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_ApresSuppression: true,
			avecEtatSaisie: false,
			avecLigneDroppable: true,
			avecLigneDraggable: true,
		});
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		lTris.push(ObjetTri.init("rang", aGenreTri));
		return lTris;
	}
	avecEvenementCreation() {
		return (
			this.avecLimiteDomaine &&
			this.Donnees.getNbrElementsExistes() >= TypeDomaine.C_MaxDomaineCycle - 1
		);
	}
	surCreation(D, V) {
		D.setLibelle(V[0]);
		D.rang = this.Donnees.getNbrElementsExistes() + 1;
		let lChoixReponseLibre;
		this.Donnees.parcourir((aChoix) => {
			if (aChoix && aChoix.existe() && aChoix.estReponseLibre) {
				lChoixReponseLibre = aChoix;
				return false;
			}
		});
		if (lChoixReponseLibre) {
			D.setEtat(EGenreEtat.Creation);
			_modifierRangChoix.call(this, D, -1);
		}
	}
	surEdition(aParams, V) {
		aParams.article.setLibelle(V);
	}
	surSuppression(D) {
		let lRang = 1;
		for (let i = 0; i < this.Donnees.count(); i++) {
			const lChoix = this.Donnees.get(i);
			if (lChoix.existe() && lChoix.getNumero() !== D.getNumero()) {
				if (lChoix.rang !== lRang) {
					lChoix.rang = lRang;
					lChoix.setEtat(EGenreEtat.Modification);
				}
				lRang++;
			} else {
				lChoix.rang = 0;
			}
		}
		D.rang = 0;
		this.Donnees.trier();
		D.setEtat(EGenreEtat.Suppression);
	}
	getVisible(D) {
		if (D && D.existe() && D.estReponseLibre) {
			return false;
		}
		return true;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			EGenreCommandeMenu.Edition,
			GTraductions.getValeur("liste.modifier"),
			this.avecEdition(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.addSeparateur();
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesChoix.genreAction.monter,
			GTraductions.getValeur("actualites.choix.monter"),
			aParametres.article.rang > 1,
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesChoix.genreAction.descendre,
			GTraductions.getValeur("actualites.choix.descendre"),
			aParametres.article.rang < this.Donnees.getNbrElementsExistes(),
		);
		aParametres.menuContextuel.addSeparateur();
		aParametres.menuContextuel.addCommande(
			EGenreCommandeMenu.Suppression,
			GTraductions.getValeur("liste.supprimer"),
			this.avecSuppression(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		let lIndice;
		switch (aParametres.numeroMenu) {
			case DonneesListe_ActualitesChoix.genreAction.monter:
				if (aParametres.article.rang > 1) {
					lIndice = _modifierRangChoix.call(this, aParametres.article, -1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			case DonneesListe_ActualitesChoix.genreAction.descendre:
				if (aParametres.article.rang < this.Donnees.getNbrElementsExistes()) {
					lIndice = _modifierRangChoix.call(this, aParametres.article, 1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			default:
				return false;
		}
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		_modifierRangChoix.call(
			this,
			aParamsSource.article,
			aParamsLigneDestination.ligne - aParamsSource.ligne,
		);
	}
}
DonneesListe_ActualitesChoix.colonnes = { libelle: "DLChoix_libelle" };
DonneesListe_ActualitesChoix.genreAction = { monter: 1, descendre: 2 };
module.exports = { DonneesListe_ActualitesChoix };
