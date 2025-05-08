const { EGenreCommandeMenu } = require("Enumere_CommandeMenu.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
function _getNouveauLibelleQuestion(aQuestion, aRang) {
	return this.moteurInfoSond.getLibelleAffichageComposanteQuest({
		composante: aQuestion,
		rang: aRang,
	});
}
function _modifierRangQuestion(aQuestion, aDecalage) {
	const lOldRang = aQuestion.rang;
	const lNewRang = lOldRang + aDecalage;
	let lElmRangConflit;
	let lNumero;
	let lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
		return aElement.existe() && aElement.rang === lNewRang;
	});
	if (lIndice > -1) {
		lElmRangConflit = this.Donnees.get(lIndice);
		lElmRangConflit.rang = lOldRang;
		lElmRangConflit.setEtat(EGenreEtat.Modification);
	}
	aQuestion.rang = lNewRang;
	aQuestion.setEtat(EGenreEtat.Modification);
	this.Donnees.trier();
	lNumero = aQuestion.getNumero();
	lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
		return aElement.existe() && aElement.getNumero() === lNumero;
	});
	this.reordonnerQuestions();
	return lIndice;
}
class DonneesListe_ActualitesQuestion extends ObjetDonneesListe {
	constructor(aDonnees, aCallbackMenuContextuel, aUtilitaires, aOptions) {
		super(aDonnees);
		this.callbackMenuContextuel = aCallbackMenuContextuel;
		this.creerIndexUnique("Libelle");
		this.utilitaires = aUtilitaires;
		this.moteurInfoSond = new MoteurInfoSondage(this.utilitaires);
		this.setOptions(
			$.extend(
				{
					avecEdition: true,
					avecEvnt_Selection: true,
					avecEvnt_Creation: true,
					avecEvnt_ApresSuppression: true,
					avecEtatSaisie: false,
					avecLigneDroppable: true,
					avecLigneDraggable: true,
				},
				aOptions,
			),
		);
		this.reordonnerQuestions();
	}
	avecSuppression() {
		return this.Donnees.getNbrElementsExistes() > 1;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ActualitesQuestion.colonnes.libelle:
				return !!aParams.article
					? aParams.surEdition
						? aParams.article.titre
						: aParams.article.getLibelle()
					: "";
		}
		return "";
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ActualitesQuestion.colonnes.libelle:
				if (aParams.article.titre !== V) {
					aParams.article.titre = V;
					aParams.article.setEtat(EGenreEtat.Modification);
					aParams.article.Libelle = _getNouveauLibelleQuestion.call(
						this,
						aParams.article,
						aParams.article.indice,
					);
				}
		}
	}
	autoriserChaineVideSurEdition() {
		return true;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesQuestion.genreAction.monter,
			GTraductions.getValeur("actualites.choix.monter"),
			aParametres.article.rang > 1,
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesQuestion.genreAction.descendre,
			GTraductions.getValeur("actualites.choix.descendre"),
			aParametres.article.rang < this.Donnees.getNbrElementsExistes(),
		);
		aParametres.menuContextuel.addSeparateur();
		let lStrCommandeDupliquer =
			aParametres.article &&
			this.utilitaires.genreReponse.estGenreSansReponse(
				aParametres.article.genreReponse,
			)
				? GTraductions.getValeur("infoSond.Edit.dupliquerTxt")
				: GTraductions.getValeur("infoSond.Edit.dupliquerQu");
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesQuestion.genreAction.dupliquer,
			lStrCommandeDupliquer,
			true,
		);
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
			case DonneesListe_ActualitesQuestion.genreAction.monter:
				if (aParametres.article.rang > 1) {
					lIndice = _modifierRangQuestion.call(this, aParametres.article, -1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			case DonneesListe_ActualitesQuestion.genreAction.descendre:
				if (aParametres.article.rang < this.Donnees.getNbrElementsExistes()) {
					lIndice = _modifierRangQuestion.call(this, aParametres.article, 1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			case DonneesListe_ActualitesQuestion.genreAction.dupliquer:
				if (this.callbackMenuContextuel(aParametres.numeroMenu)) {
					const lQu = this.moteurInfoSond.dupliquerQuestion(
						aParametres.article,
					);
					lQu.rang = this.Donnees.getNbrElementsExistes() + 1;
					this.Donnees.addElement(lQu);
					this.reordonnerQuestions();
				}
				break;
			default:
				return false;
		}
	}
	reordonnerQuestions() {
		let lRangQ = 0;
		let lRangT = 0;
		this.Donnees.trier();
		this.Donnees.parcourir((aElement) => {
			if (
				this.utilitaires.genreReponse.estGenreSansReponse(aElement.genreReponse)
			) {
				lRangT++;
				aElement.setLibelle(
					_getNouveauLibelleQuestion.call(this, aElement, lRangT),
				);
				aElement.indice = lRangT;
			} else {
				lRangQ++;
				aElement.setLibelle(
					_getNouveauLibelleQuestion.call(this, aElement, lRangQ),
				);
				aElement.indice = lRangQ;
			}
		});
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		lTris.push(ObjetTri.init("rang", aGenreTri));
		return lTris;
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		_modifierRangQuestion.call(
			this,
			aParamsSource.article,
			aParamsLigneDestination.ligne - aParamsSource.ligne,
		);
	}
}
DonneesListe_ActualitesQuestion.colonnes = { libelle: "DLQuestions_libelle" };
DonneesListe_ActualitesQuestion.genreAction = {
	monter: 1,
	descendre: 2,
	dupliquer: 3,
};
module.exports = { DonneesListe_ActualitesQuestion };
