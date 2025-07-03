exports.DonneesListe_ActualitesChoix = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeDomaine_1 = require("TypeDomaine");
class DonneesListe_ActualitesChoix extends ObjetDonneesListe_1.ObjetDonneesListe {
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
		lTris.push(ObjetTri_1.ObjetTri.init("rang", aGenreTri));
		return lTris;
	}
	avecEvenementCreation() {
		return (
			this.avecLimiteDomaine &&
			this.Donnees.getNbrElementsExistes() >=
				TypeDomaine_1.TypeDomaine.C_MaxDomaineCycle - 1
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
			D.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			this._modifierRangChoix(D, -1);
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
					lChoix.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				lRang++;
			} else {
				lChoix.rang = 0;
			}
		}
		D.rang = 0;
		this.Donnees.trier();
		D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
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
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Edition,
			ObjetTraduction_1.GTraductions.getValeur("liste.modifier"),
			this.avecEdition(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.addSeparateur();
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesChoix.genreAction.monter,
			ObjetTraduction_1.GTraductions.getValeur("actualites.choix.monter"),
			aParametres.article.rang > 1,
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesChoix.genreAction.descendre,
			ObjetTraduction_1.GTraductions.getValeur("actualites.choix.descendre"),
			aParametres.article.rang < this.Donnees.getNbrElementsExistes(),
		);
		aParametres.menuContextuel.addSeparateur();
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			this.avecSuppression(aParametres) && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		let lIndice;
		switch (aParametres.numeroMenu) {
			case DonneesListe_ActualitesChoix.genreAction.monter:
				if (aParametres.article.rang > 1) {
					lIndice = this._modifierRangChoix(aParametres.article, -1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			case DonneesListe_ActualitesChoix.genreAction.descendre:
				if (aParametres.article.rang < this.Donnees.getNbrElementsExistes()) {
					lIndice = this._modifierRangChoix(aParametres.article, 1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			default:
				return false;
		}
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		this._modifierRangChoix(
			aParamsSource.article,
			aParamsLigneDestination.ligne - aParamsSource.ligne,
		);
	}
	_modifierRangChoix(aChoix, aDecalage) {
		const lOldRang = aChoix.rang;
		const lNewRang = lOldRang + aDecalage;
		let lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
			return aElement.existe() && aElement.rang === lNewRang;
		});
		if (lIndice > -1) {
			const lElmRangConflit = this.Donnees.get(lIndice);
			lElmRangConflit.rang = lOldRang;
			lElmRangConflit.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		aChoix.rang = lNewRang;
		aChoix.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.Donnees.trier();
		const lNumero = aChoix.getNumero();
		lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
			return aElement.existe() && aElement.getNumero() === lNumero;
		});
		return lIndice;
	}
}
exports.DonneesListe_ActualitesChoix = DonneesListe_ActualitesChoix;
(function (DonneesListe_ActualitesChoix) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "DLChoix_libelle";
	})(
		(colonnes =
			DonneesListe_ActualitesChoix.colonnes ||
			(DonneesListe_ActualitesChoix.colonnes = {})),
	);
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["monter"] = 1)] = "monter";
		genreAction[(genreAction["descendre"] = 2)] = "descendre";
	})(
		(genreAction =
			DonneesListe_ActualitesChoix.genreAction ||
			(DonneesListe_ActualitesChoix.genreAction = {})),
	);
})(
	DonneesListe_ActualitesChoix ||
		(exports.DonneesListe_ActualitesChoix = DonneesListe_ActualitesChoix = {}),
);
