exports.DonneesListe_ActualitesQuestion = void 0;
const Enumere_CommandeMenu_1 = require("Enumere_CommandeMenu");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
class DonneesListe_ActualitesQuestion extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aCallbackMenuContextuel, aUtilitaires, aOptions) {
		super(aDonnees);
		this.callbackMenuContextuel = aCallbackMenuContextuel;
		this.creerIndexUnique("Libelle");
		this.utilitaires = aUtilitaires;
		this.moteurInfoSond = new MoteurInfoSondage_1.MoteurInfoSondage(
			this.utilitaires,
		);
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
					aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aParams.article.Libelle = this._getNouveauLibelleQuestion(
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
			ObjetTraduction_1.GTraductions.getValeur("actualites.choix.monter"),
			aParametres.article.rang > 1,
		);
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesQuestion.genreAction.descendre,
			ObjetTraduction_1.GTraductions.getValeur("actualites.choix.descendre"),
			aParametres.article.rang < this.Donnees.getNbrElementsExistes(),
		);
		aParametres.menuContextuel.addSeparateur();
		let lStrCommandeDupliquer =
			aParametres.article &&
			this.utilitaires.genreReponse.estGenreSansReponse(
				aParametres.article.genreReponse,
			)
				? ObjetTraduction_1.GTraductions.getValeur("infoSond.Edit.dupliquerTxt")
				: ObjetTraduction_1.GTraductions.getValeur("infoSond.Edit.dupliquerQu");
		aParametres.menuContextuel.addCommande(
			DonneesListe_ActualitesQuestion.genreAction.dupliquer,
			lStrCommandeDupliquer,
			true,
		);
		aParametres.menuContextuel.addCommande(
			Enumere_CommandeMenu_1.EGenreCommandeMenu.Suppression,
			ObjetTraduction_1.GTraductions.getValeur("liste.supprimer"),
			this.avecSuppression() && !aParametres.nonEditable,
		);
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		let lIndice;
		switch (aParametres.numeroMenu) {
			case DonneesListe_ActualitesQuestion.genreAction.monter:
				if (aParametres.article.rang > 1) {
					lIndice = this._modifierRangQuestion(aParametres.article, -1);
					this.callbackMenuContextuel(aParametres.numeroMenu, lIndice);
				}
				break;
			case DonneesListe_ActualitesQuestion.genreAction.descendre:
				if (aParametres.article.rang < this.Donnees.getNbrElementsExistes()) {
					lIndice = this._modifierRangQuestion(aParametres.article, 1);
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
				aElement.setLibelle(this._getNouveauLibelleQuestion(aElement, lRangT));
				aElement.indice = lRangT;
			} else {
				lRangQ++;
				aElement.setLibelle(this._getNouveauLibelleQuestion(aElement, lRangQ));
				aElement.indice = lRangQ;
			}
		});
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		lTris.push(ObjetTri_1.ObjetTri.init("rang", aGenreTri));
		return lTris;
	}
	surDeplacementElementSurLigne(aParamsLigneDestination, aParamsSource) {
		this._modifierRangQuestion(
			aParamsSource.article,
			aParamsLigneDestination.ligne - aParamsSource.ligne,
		);
	}
	_getNouveauLibelleQuestion(aQuestion, aRang) {
		return this.moteurInfoSond.getLibelleAffichageComposanteQuest({
			composante: aQuestion,
			rang: aRang,
		});
	}
	_modifierRangQuestion(aQuestion, aDecalage) {
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
			lElmRangConflit.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		aQuestion.rang = lNewRang;
		aQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this.Donnees.trier();
		lNumero = aQuestion.getNumero();
		lIndice = this.Donnees.getIndiceElementParFiltre((aElement) => {
			return aElement.existe() && aElement.getNumero() === lNumero;
		});
		this.reordonnerQuestions();
		return lIndice;
	}
}
exports.DonneesListe_ActualitesQuestion = DonneesListe_ActualitesQuestion;
(function (DonneesListe_ActualitesQuestion) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "DLQuestions_libelle";
	})(
		(colonnes =
			DonneesListe_ActualitesQuestion.colonnes ||
			(DonneesListe_ActualitesQuestion.colonnes = {})),
	);
	let genreAction;
	(function (genreAction) {
		genreAction[(genreAction["monter"] = 1)] = "monter";
		genreAction[(genreAction["descendre"] = 2)] = "descendre";
		genreAction[(genreAction["dupliquer"] = 3)] = "dupliquer";
	})(
		(genreAction =
			DonneesListe_ActualitesQuestion.genreAction ||
			(DonneesListe_ActualitesQuestion.genreAction = {})),
	);
})(
	DonneesListe_ActualitesQuestion ||
		(exports.DonneesListe_ActualitesQuestion = DonneesListe_ActualitesQuestion =
			{}),
);
