const { ObjetEditionOffreStage } = require("ObjetEditionOffreStage.js");
const {
	ObjetAffSaisieOffresDeStages,
} = require("ObjetAffSaisieOffresDeStages.js");
const {
	ObjetFenetre_EditionOffreStage,
} = require("ObjetFenetre_EditionOffreStage.js");
const { Callback } = require("Callback.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEventOffresStages } = require("TypeEventOffresStages.js");
class PageSaisieOffresStages extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this._options = {
			avecMultipleEntreprisesAutorise: false,
			editionOffreStage: {
				avecPeriode: false,
				avecPeriodeUnique: true,
				avecSujetObjetSaisie: true,
				avecGestionPJ: false,
				tailleMaxPieceJointe: 0,
				avecEditionDocumentsJoints: false,
				genreRessourcePJ: 0,
				dureeParDefaut: 70,
			},
		};
		this._autorisations = { autoriserEditionToutesOffresStages: true };
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	setAutorisations(aAutorisations) {
		$.extend(this._autorisations, aAutorisations);
	}
	construireInstances() {
		this.identEditNewOffre = this.add(
			ObjetEditionOffreStage,
			null,
			_initNewOffre.bind(this),
		);
		this.identListeOffres = this.add(
			ObjetAffSaisieOffresDeStages,
			_evntListeOffres.bind(this),
			_initListeOffres.bind(this),
		);
		this.identFenetreEdition = this.add(
			ObjetFenetre_EditionOffreStage,
			_evntFenetreEdition.bind(this),
			_initFenetreEdition.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			`<div class="offre-stages-conteneur">\n             <div class="bloc-contain">\n               <h4>${GTraductions.getValeur("OffreStage.TitreNewOffre")}</h4>\n               <div class="saisie-content" id="${this.getInstance(this.identEditNewOffre).getNom()}"></div>\n               <div class="bt-contain"><ie-bouton ie-model="btnCreerOffreStage">${GTraductions.getValeur("OffreStage.Proposer")}</ie-bouton></div>\n             </div>\n             <div class="bloc-contain liste">\n               <h4>${GTraductions.getValeur("OffreStage.TitreListeOffres")}</h4>\n               <div class="liste-content" id="${this.getInstance(this.identListeOffres).getNom()}"></div>\n             </div>\n           </div>`,
		);
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnCreerOffreStage: {
				event() {
					_evntBtnCreerOffre.call(aInstance);
				},
			},
		});
	}
	setDonnees(aParam) {
		if (!aParam.listeOffres) {
			aParam.listeOffres = new ObjetListeElements();
		}
		this.listeOffres = aParam.listeOffres;
		if (this._options.editionOffreStage.avecSujetObjetSaisie) {
			this.listeSujets = aParam.listeSujets;
		} else {
			this.listeSujets = new ObjetListeElements();
		}
		this.listePJ_Creation = new ObjetListeElements();
		this.getInstance(this.identEditNewOffre).setDonnees({
			sujetsStage: this.listeSujets,
			listePJ: this.listePJ_Creation,
		});
		if (this.listeOffres) {
			this.getInstance(this.identListeOffres).setDonnees({
				listeOffres: this.listeOffres,
			});
		}
	}
	lancerSaisie(aParam) {
		const lParam = {
			listeOffres: this.listeOffres,
			offre: new ObjetElement(),
			listePJ: new ObjetListeElements(),
		};
		$.extend(lParam, aParam);
		this.callback.appel(lParam);
	}
}
function _initListeOffres(aInstance) {
	aInstance.setOptions({
		avecPeriode: this._options.editionOffreStage.avecPeriode,
		avecPeriodeUnique: this._options.editionOffreStage.avecPeriodeUnique,
		avecGestionPJ: this._options.editionOffreStage.avecGestionPJ,
		genreRessourcePJ: this._options.editionOffreStage.genreRessourcePJ,
	});
	aInstance.setAutorisations(this._autorisations);
}
function _initNewOffre(aInstance) {
	aInstance.setParametres(this._options.editionOffreStage);
	aInstance.classSelecteurPJ = this.classSelecteurPJ;
}
function _initFenetreEdition(aInstance) {
	aInstance.setOptionsFenetre({
		titre: GTraductions.getValeur("OffreStage.TitreEdition"),
		largeur: 500,
		hauteur: 600,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
	aInstance.setParametresEditionOffreStage(this._options.editionOffreStage);
	aInstance.classSelecteurPJ = this.classSelecteurPJ;
}
function _evntBtnCreerOffre() {
	const lOffre = this.getInstance(this.identEditNewOffre).getOffreStage();
	lOffre.setEtat(EGenreEtat.Creation);
	this.listeOffres.addElement(lOffre);
	this.lancerSaisie({
		offre: lOffre,
		listePJ: this.listePJ_Creation,
		listeOffres: this.listeOffres,
	});
}
function _evntFenetreEdition(aNumeroBouton, aParam) {
	if (aNumeroBouton > 0) {
		aParam.offre.setEtat(EGenreEtat.Modification);
		this.listeOffres.addElement(
			aParam.offre,
			this.listeOffres.getIndiceParNumeroEtGenre(aParam.offre.getNumero()),
		);
		this.lancerSaisie({ offre: aParam.offre, listePJ: this.listePJ });
	}
}
function _evntListeOffres(aParam) {
	let lOffre;
	switch (aParam.genreEvnt) {
		case TypeEventOffresStages.ModificationOffre:
			lOffre = this.listeOffres.get(aParam.indOffre);
			if (lOffre.piecesjointes) {
				this.listePJ = MethodesObjet.dupliquer(lOffre.piecesjointes);
			}
			this.getInstance(this.identFenetreEdition).setDonnees({
				offre: this.listeOffres.get(aParam.indOffre),
				sujetsStage: this.listeSujets,
				listePJ: this.listePJ,
			});
			break;
		case TypeEventOffresStages.SuppressionOffre:
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Confirmation,
				message: GTraductions.getValeur("OffreStage.suppression.message"),
				titre: GTraductions.getValeur("OffreStage.suppression.titre"),
				callback: new Callback(
					this,
					_evntSuppressionApresConfirm.bind(this, aParam),
				),
			});
			break;
		default:
			break;
	}
}
function _evntSuppressionApresConfirm(aParam, aGenreAction) {
	if (aGenreAction === EGenreAction.Valider) {
		const lOffre = this.listeOffres.get(aParam.indOffre);
		lOffre.setEtat(EGenreEtat.Suppression);
		this.lancerSaisie({ offre: lOffre, listePJ: new ObjetListeElements() });
	}
}
module.exports = { PageSaisieOffresStages };
