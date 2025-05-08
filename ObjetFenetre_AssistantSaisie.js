const {
	ObjetFenetre_ChoixTypeAppreciation,
} = require("ObjetFenetre_ChoixTypeAppreciation.js");
const {
	DonneesListe_AssSaisie_Appreciation,
} = require("DonneesListe_AssSaisie_Appreciation.js");
const {
	DonneesListe_AssSaisie_Categorie,
} = require("DonneesListe_AssSaisie_Categorie.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { ETypeAppreciation } = require("Enumere_TypeAppreciation.js");
const {
	EBoutonFenetreAssistantSaisie,
} = require("EBoutonFenetreAssistantSaisie.js");
class ObjetFenetre_AssistantSaisie extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this._parametres = {
			tailleMaxAppreciation: 0,
			avecCheckBoxNePasUtiliserAssistant: true,
			avecBoutonPasserEnSaisie: true,
			rangAppreciations: -1,
			avecEtatSaisie: true,
		};
		this.setOptionsFenetre({
			avecRetaillage: true,
			largeurMin: 600,
			hauteurMin: 150,
			listeBoutons: [
				GTraductions.getValeur("Fermer"),
				GTraductions.getValeur("Appreciations.PasserEnSaisie"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.estAssistantModifie = false;
	}
	construireInstances() {
		this.identListeCategories = this.add(
			ObjetListe,
			this.evntSurListeCategories,
			_initListeCategories,
		);
		this.identListeAppreciations = this.add(
			ObjetListe,
			this.evntSurListeAppreciations,
			_initListeAppreciations,
		);
		this.identFenetreChoixTypeAppreciation = this.add(
			ObjetFenetre_ChoixTypeAppreciation,
			this.evntChoixTypeAppreciation,
			_initFenetreChoixTypeAppreciation,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			avecCheckBoxNePasUtiliserAssistant: function () {
				return aInstance.estAvecCheckBoxNePasUtiliserAssistant();
			},
			cbNePasUtiliserAssistant: {
				getValue: function () {
					return !!aInstance.nePasUtiliserAssistantActif;
				},
				setValue: function (aValue) {
					aInstance.nePasUtiliserAssistantActif = aValue;
				},
			},
		});
	}
	evntSurListeCategories(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.Creation:
				this.categorieCourante = null;
				this._afficherMessageZoneAppreciations();
				break;
			case EGenreEvenementListe.Selection: {
				const lElmt = this.listeCategoriesPourAffichage.get(aParametres.ligne);
				this.categorieCourante = lElmt.estUneCategorie
					? aParametres.ligne
					: null;
				if (lElmt.estUneCategorie) {
					const lInstanceListe = this.getInstance(this.identListeAppreciations);
					_initListeAppreciations(
						lInstanceListe,
						_getTitreListeAppreciations(lElmt.typeAppreciation),
					);
					const llisteAppreciations = lElmt.listeAppreciations;
					if (llisteAppreciations) {
						lInstanceListe.setDonnees(
							new DonneesListe_AssSaisie_Appreciation(
								llisteAppreciations,
								this.getTailleMaxAppreciation(),
								this._parametres.avecEtatSaisie,
							),
						);
					}
				} else {
					this._afficherMessageZoneAppreciations();
				}
				break;
			}
			case EGenreEvenementListe.ApresSuppression:
				this.categorieCourante = null;
				if (!this._selectionCategorieParDefaut()) {
					this._afficherMessageZoneAppreciations();
				}
				this.estAssistantModifie = true;
				break;
			case EGenreEvenementListe.ApresCreation:
				for (let I = 0; I < this.listeCategoriesPourAffichage.count(); I++) {
					const lElmt = this.listeCategoriesPourAffichage.get(I);
					if (
						lElmt.getEtat() === EGenreEtat.Creation &&
						lElmt.traiterApresCreation
					) {
						if (this.listeElementsTypeAppreciation.count() === 1) {
							this.listeElementsTypeAppreciation
								.get(0)
								.listeCategories.addElement(lElmt);
						} else {
							this.elementCourant = lElmt;
							this.getInstance(
								this.identFenetreChoixTypeAppreciation,
							).setDonnees(this.listeElementsTypeAppreciation);
						}
						lElmt.traiterApresCreation = false;
					}
				}
				this.estAssistantModifie = true;
				break;
			case EGenreEvenementListe.ApresEdition:
				this.estAssistantModifie = true;
				break;
		}
	}
	_afficherMessageZoneAppreciations() {
		this.getInstance(this.identListeAppreciations).effacer();
		GHtml.setHtml(
			this.getNomInstance(this.identListeAppreciations),
			this.composeMessage(
				GTraductions.getValeur("Appreciations.SelectionnerCategorie"),
			),
		);
	}
	evntSurListeAppreciations(
		aParametres,
		aGenreEvenementListe,
		aColonne,
		aLigne,
	) {
		switch (aGenreEvenementListe) {
			case EGenreEvenementListe.Selection:
				this.appreciationCourante = aLigne;
				this.setBoutonActif(EBoutonFenetreAssistantSaisie.Valider, true);
				break;
			case EGenreEvenementListe.SelectionDblClick:
				this.surValidation(EBoutonFenetreAssistantSaisie.Valider);
				break;
			case EGenreEvenementListe.Suppression:
			case EGenreEvenementListe.ApresEdition:
			case EGenreEvenementListe.Creation:
				this.listeCategoriesPourAffichage
					.get(this.categorieCourante)
					.setEtat(EGenreEtat.Modification);
				this.estAssistantModifie = true;
				break;
		}
	}
	evntChoixTypeAppreciation(aNumeroBouton) {
		switch (aNumeroBouton) {
			case 1: {
				const lLibelleTypeAppreciationSelectionne = this.getInstance(
					this.identFenetreChoixTypeAppreciation,
				).typeAppreciationCourant;
				const lElmt = this.listeCategoriesPourAffichage.getElementParLibelle(
					lLibelleTypeAppreciationSelectionne,
				);
				if (!lElmt.estUneCategorie) {
					this.elementCourant.pere = lElmt;
					this.elementCourant.typeAppreciation = lElmt.getGenre();
					this.listeElementsTypeAppreciation
						.getElementParGenre(this.elementCourant.typeAppreciation)
						.listeCategories.addElement(this.elementCourant);
					this.getInstance(this.identListeCategories).actualiser();
					let lIndice = -1;
					this.listeCategoriesPourAffichage.parcourir((D, aIndex) => {
						if (D.getNumero() === this.elementCourant.getNumero()) {
							lIndice = aIndex;
							return false;
						}
					});
					if (lIndice >= 0) {
						this._selectionnerElementDansListeCategorie(lIndice);
					}
				} else {
					this.annulerCreation();
				}
				break;
			}
			case 0:
				this.annulerCreation();
				break;
			default:
				break;
		}
	}
	annulerCreation() {
		this.listeCategoriesPourAffichage.remove(
			this.listeCategoriesPourAffichage.count() - 1,
		);
		this.getInstance(this.identListeCategories).actualiser();
	}
	getAppreciationSelectionnee() {
		if (
			this.listeCategoriesPourAffichage !== null &&
			this.listeCategoriesPourAffichage !== undefined &&
			this.listeCategoriesPourAffichage.count() > 0 &&
			this.categorieCourante !== null &&
			this.categorieCourante !== undefined
		) {
			const lCategorie = this.listeCategoriesPourAffichage.get(
				this.categorieCourante,
			);
			if (lCategorie !== null && lCategorie !== undefined) {
				return lCategorie.listeAppreciations.get(this.appreciationCourante);
			}
		}
	}
	getEtatCbNePasUtiliserAssistant() {
		return this.nePasUtiliserAssistantActif;
	}
	getTailleMaxAppreciation() {
		return this._parametres.tailleMaxAppreciation;
	}
	estAvecCheckBoxNePasUtiliserAssistant() {
		return this._parametres.avecCheckBoxNePasUtiliserAssistant;
	}
	getRangAppreciations() {
		return this._parametres.rangAppreciations;
	}
	composeContenu() {
		const T = [];
		T.push('<div class="flex-contain cols flex-gap full-size">');
		T.push('  <div class="flex-contain justify-between fluid-bloc flex-gap">');
		T.push(
			'    <div class="fix-bloc" id="' +
				this.getNomInstance(this.identListeCategories) +
				'" style="min-width:250px;"></div>',
		);
		T.push(
			'    <div class="fluid-bloc" id="' +
				this.getNomInstance(this.identListeAppreciations) +
				'"></div>',
		);
		T.push("  </div>");
		T.push(
			'<div ie-if="avecCheckBoxNePasUtiliserAssistant" class="fix-bloc flex-contain full-width">',
			'<ie-checkbox ie-model="cbNePasUtiliserAssistant">',
			GTraductions.getValeur("Appreciations.NePasUtiliserAssistant"),
			"</ie-checkbox>",
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	setParametres(aParametres) {
		Object.assign(this._parametres, aParametres);
	}
	setDonnees(aListeElementsTypeAppreciation) {
		this.estAssistantModifie = false;
		this.nePasUtiliserAssistantActif = false;
		this.listeElementsTypeAppreciation = aListeElementsTypeAppreciation;
		this.listeCategoriesPourAffichage = new ObjetListeElements();
		const lNbrTypeAppreciation = aListeElementsTypeAppreciation.count();
		for (let I = 0; I < lNbrTypeAppreciation; I++) {
			const lElementTypeAppreciation = new ObjetElement();
			if (lNbrTypeAppreciation > 1) {
				lElementTypeAppreciation.Genre = aListeElementsTypeAppreciation
					.get(I)
					.getGenre();
				lElementTypeAppreciation.setLibelle(
					_getTitreListeAppreciations(lElementTypeAppreciation.Genre),
				);
				aListeElementsTypeAppreciation
					.get(I)
					.setLibelle(lElementTypeAppreciation.Libelle);
				lElementTypeAppreciation.estUneCategorie = false;
				lElementTypeAppreciation.estUnDeploiement = true;
				lElementTypeAppreciation.estDeploye = true;
				lElementTypeAppreciation.pere = null;
				this.listeCategoriesPourAffichage.addElement(lElementTypeAppreciation);
			}
			for (
				let J = 0;
				J < aListeElementsTypeAppreciation.get(I).listeCategories.count();
				J++
			) {
				const lCategorieCourante = aListeElementsTypeAppreciation
					.get(I)
					.listeCategories.get(J);
				lCategorieCourante.estUneCategorie = true;
				lCategorieCourante.estUnDeploiement = false;
				lCategorieCourante.estDeploye = false;
				lCategorieCourante.pere =
					lNbrTypeAppreciation > 1 ? lElementTypeAppreciation : null;
				this.listeCategoriesPourAffichage.addElement(lCategorieCourante);
			}
		}
		this.listeCategoriesPourAffichage
			.setTri([ObjetTri.initRecursif("pere", [ObjetTri.init("Libelle")])])
			.trier();
		this.afficher(null);
		this.setOptionsFenetre({ titre: _getTitreFenetre() });
		this.setBoutonActif(EBoutonFenetreAssistantSaisie.Valider, false);
		this.setBoutonVisible(
			EBoutonFenetreAssistantSaisie.PasserEnSaisie,
			this._parametres.avecBoutonPasserEnSaisie,
		);
		this.getInstance(this.identListeCategories).setDonnees(
			new DonneesListe_AssSaisie_Categorie(
				this.listeCategoriesPourAffichage,
				this._parametres.avecEtatSaisie,
			),
		);
		if (!this._selectionCategorieParDefaut()) {
			this._afficherMessageZoneAppreciations();
		}
	}
	_selectionCategorieParDefaut() {
		const lNbrElmts = this.listeCategoriesPourAffichage.count();
		for (let lLigne = 0; lLigne < lNbrElmts; lLigne++) {
			const lElement = this.listeCategoriesPourAffichage.get(lLigne);
			if (
				lElement.estUneCategorie &&
				lElement.getEtat() !== EGenreEtat.Suppression
			) {
				this._selectionnerElementDansListeCategorie(lLigne);
				return true;
			}
		}
		return false;
	}
	_selectionnerElementDansListeCategorie(aLigne) {
		this.getInstance(this.identListeCategories).selectionnerLigne({
			ligne: aLigne,
			avecEvenement: true,
		});
	}
	debutRetaillage() {
		super.debutRetaillage();
		this.getInstance(this.identListeCategories).surPreResize();
		this.getInstance(this.identListeAppreciations).surPreResize();
	}
	finRetaillage() {
		super.finRetaillage();
		this.getInstance(this.identListeCategories).surPostResize();
		this.getInstance(this.identListeAppreciations).surPostResize();
	}
	getParametresValidation(...aParams) {
		const lParametres = super.getParametresValidation(...aParams);
		lParametres.appreciationSelectionnee = this.getAppreciationSelectionnee();
		return lParametres;
	}
}
function _initListeCategories(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_AssSaisie_Categorie.colonnes.libelle,
		titre: GTraductions.getValeur("Appreciations.TitreColCategorie"),
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		listeCreations: 0,
		avecLigneCreation: true,
		titreCreation: GTraductions.getValeur(
			"Appreciations.LigneCreationCategorie",
		),
	});
}
function _initListeAppreciations(aInstance, aTitreColonne) {
	if (!aTitreColonne) {
		aTitreColonne = GTraductions.getValeur(
			"Appreciations.TitreColAppreciation",
		);
	}
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_AssSaisie_Appreciation.colonnes.libelle,
		titre: aTitreColonne,
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		listeCreations: 0,
		avecLigneCreation: true,
		titreCreation: GTraductions.getValeur(
			"Appreciations.LigneCreationAppreciation",
		),
		boutons: [{ genre: ObjetListe.typeBouton.editer }],
	});
}
function _initFenetreChoixTypeAppreciation(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		titre: GTraductions.getValeur("Appreciations.SelectionnerTypeAppr"),
		largeur: 200,
		hauteur: 200,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
function _getTitreFenetre() {
	switch (GEtatUtilisateur.getGenreOnglet()) {
		case EGenreOnglet.LivretScolaire_Fiche:
		case EGenreOnglet.LivretScolaire_Appreciations:
		case EGenreOnglet.LivretScolaire_Competences:
		case EGenreOnglet.FicheBrevet:
			return GTraductions.getValeur("Appreciations.TitreAss_Brevet");
		case EGenreOnglet.ConseilDeClasse:
		case EGenreOnglet.Bulletins:
		case EGenreOnglet.SaisieAppreciationsBulletin:
		case EGenreOnglet.ReleveEvaluationsParService:
			return GTraductions.getValeur("Appreciations.TitreAss_Bulletin");
		case EGenreOnglet.Releve:
		case EGenreOnglet.SaisieAppreciationsReleve:
			return GTraductions.getValeur("Appreciations.TitreAss_Releve");
		case EGenreOnglet.SaisieAppreciationsGenerales:
		case EGenreOnglet.SaisieAppreciationsGenerales_Competences:
			return GTraductions.getValeur("Appreciations.TitreAss_Bulletin");
		default:
			return GTraductions.getValeur("Appreciations.AssistantSaisie");
	}
}
function _getTitreListeAppreciations(aTypeAppreciation) {
	switch (aTypeAppreciation) {
		case ETypeAppreciation.Appreciations:
			return GTraductions.getValeur("Appreciations.ApprA");
		case ETypeAppreciation.Progression:
			return GTraductions.getValeur("Appreciations.ApprB");
		case ETypeAppreciation.Conseil:
			return GTraductions.getValeur("Appreciations.ApprC");
		case ETypeAppreciation.Assiduite:
			return GTraductions.getValeur("Appreciations.ApprA");
		case ETypeAppreciation.Autonomie:
			return GTraductions.getValeur("Appreciations.ApprB");
		case ETypeAppreciation.Globale:
			return GTraductions.getValeur("Appreciations.ApprC");
		case ETypeAppreciation.Commentaire1:
			return GTraductions.getValeur("Appreciations.CommA");
		case ETypeAppreciation.Commentaire2:
			return GTraductions.getValeur("Appreciations.CommB");
		case ETypeAppreciation.Commentaire3:
			return GTraductions.getValeur("Appreciations.CommC");
		case ETypeAppreciation.CPE:
			return GTraductions.getValeur("Appreciations.CPE");
		case ETypeAppreciation.FG_Annuelle:
			return GTraductions.getValeur("Appreciations.Annuelle");
		default:
			return "";
	}
}
module.exports = { ObjetFenetre_AssistantSaisie };
