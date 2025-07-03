exports.ObjetFenetre_AssistantSaisie = void 0;
const ObjetFenetre_ChoixTypeAppreciation_1 = require("ObjetFenetre_ChoixTypeAppreciation");
const DonneesListe_AssSaisie_Appreciation_1 = require("DonneesListe_AssSaisie_Appreciation");
const DonneesListe_AssSaisie_Categorie_1 = require("DonneesListe_AssSaisie_Categorie");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_TypeAppreciation_1 = require("Enumere_TypeAppreciation");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
class ObjetFenetre_AssistantSaisie extends ObjetFenetre_1.ObjetFenetre {
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
				ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.PasserEnSaisie",
				),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.estAssistantModifie = false;
	}
	construireInstances() {
		this.identListeCategories = this.add(
			ObjetListe_1.ObjetListe,
			this.evntSurListeCategories,
			_initListeCategories,
		);
		this.identListeAppreciations = this.add(
			ObjetListe_1.ObjetListe,
			this.evntSurListeAppreciations,
			_initListeAppreciations,
		);
		this.identFenetreChoixTypeAppreciation = this.add(
			ObjetFenetre_ChoixTypeAppreciation_1.ObjetFenetre_ChoixTypeAppreciation,
			this.evntChoixTypeAppreciation,
			_initFenetreChoixTypeAppreciation,
		);
	}
	evntSurListeCategories(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.categorieCourante = null;
				this._afficherMessageZoneAppreciations();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
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
							new DonneesListe_AssSaisie_Appreciation_1.DonneesListe_AssSaisie_Appreciation(
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
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression:
				this.categorieCourante = null;
				if (!this._selectionCategorieParDefaut()) {
					this._afficherMessageZoneAppreciations();
				}
				this.estAssistantModifie = true;
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
				for (let I = 0; I < this.listeCategoriesPourAffichage.count(); I++) {
					const lElmt = this.listeCategoriesPourAffichage.get(I);
					if (
						lElmt.getEtat() === Enumere_Etat_1.EGenreEtat.Creation &&
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
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				this.estAssistantModifie = true;
				break;
		}
	}
	_afficherMessageZoneAppreciations() {
		this.getInstance(this.identListeAppreciations).effacer();
		ObjetHtml_1.GHtml.setHtml(
			this.getNomInstance(this.identListeAppreciations),
			this.composeMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.SelectionnerCategorie",
				),
			),
		);
	}
	evntSurListeAppreciations(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.appreciationCourante = aParametres.ligne;
				this.setBoutonActif(
					EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie.Valider,
					true,
				);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				this.surValidation(
					EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie.Valider,
				);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.listeCategoriesPourAffichage
					.get(this.categorieCourante)
					.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
		const lavecCheckBoxNePasUtiliserAssistant = () => {
			return this.estAvecCheckBoxNePasUtiliserAssistant();
		};
		const lcbNePasUtiliserAssistant = () => {
			return {
				getValue: () => {
					return !!this.nePasUtiliserAssistantActif;
				},
				setValue: (aValue) => {
					this.nePasUtiliserAssistantActif = aValue;
				},
			};
		};
		return IE.jsx.str(
			"div",
			{ class: "flex-contain cols flex-gap full-size" },
			IE.jsx.str(
				"div",
				{ class: "flex-contain justify-between fluid-bloc flex-gap" },
				IE.jsx.str("div", {
					class: "fix-bloc",
					id: this.getNomInstance(this.identListeCategories),
					style: "min-width:250px;",
				}),
				IE.jsx.str("div", {
					class: "fluid-bloc",
					id: this.getNomInstance(this.identListeAppreciations),
				}),
			),
			IE.jsx.str(
				"div",
				{
					"ie-if": lavecCheckBoxNePasUtiliserAssistant,
					class: "fix-bloc flex-contain full-width",
				},
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": lcbNePasUtiliserAssistant },
					ObjetTraduction_1.GTraductions.getValeur(
						"Appreciations.NePasUtiliserAssistant",
					),
				),
			),
		);
	}
	setParametres(aParametres) {
		Object.assign(this._parametres, aParametres);
	}
	setDonnees(aListeElementsTypeAppreciation) {
		this.estAssistantModifie = false;
		this.nePasUtiliserAssistantActif = false;
		this.listeElementsTypeAppreciation = aListeElementsTypeAppreciation;
		this.listeCategoriesPourAffichage =
			new ObjetListeElements_1.ObjetListeElements();
		const lNbrTypeAppreciation = aListeElementsTypeAppreciation.count();
		for (let I = 0; I < lNbrTypeAppreciation; I++) {
			const lElementTypeAppreciation = new ObjetElement_1.ObjetElement();
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
			.setTri([
				ObjetTri_1.ObjetTri.initRecursif("pere", [
					ObjetTri_1.ObjetTri.init("Libelle"),
				]),
			])
			.trier();
		this.afficher(null);
		this.setOptionsFenetre({ titre: _getTitreFenetre() });
		this.setBoutonActif(
			EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie.Valider,
			false,
		);
		this.setBoutonVisible(
			EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.PasserEnSaisie,
			this._parametres.avecBoutonPasserEnSaisie,
		);
		this.getInstance(this.identListeCategories).setDonnees(
			new DonneesListe_AssSaisie_Categorie_1.DonneesListe_AssSaisie_Categorie(
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
				lElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
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
	getParametresValidation(aNumeroBouton) {
		const lParametres = super.getParametresValidation(aNumeroBouton);
		lParametres.appreciationSelectionnee = this.getAppreciationSelectionnee();
		return lParametres;
	}
}
exports.ObjetFenetre_AssistantSaisie = ObjetFenetre_AssistantSaisie;
function _initListeCategories(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_AssSaisie_Categorie_1.DonneesListe_AssSaisie_Categorie
			.colonnes.libelle,
		titre: ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.TitreColCategorie",
		),
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.ListeCategories",
		),
		listeCreations: 0,
		avecLigneCreation: true,
		titreCreation: ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.LigneCreationCategorie",
		),
	});
}
function _initListeAppreciations(aInstance, aTitreColonne) {
	if (!aTitreColonne) {
		aTitreColonne = ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.TitreColAppreciation",
		);
	}
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_AssSaisie_Appreciation_1
			.DonneesListe_AssSaisie_Appreciation.colonnes.libelle,
		titre: aTitreColonne,
		taille: "100%",
	});
	aInstance.setOptionsListe({
		colonnes: lColonnes,
		ariaLabel: ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.ListeAppreciations",
		),
		listeCreations: 0,
		avecLigneCreation: true,
		titreCreation: ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.LigneCreationAppreciation",
		),
		boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.editer }],
	});
}
function _initFenetreChoixTypeAppreciation(aInstance) {
	aInstance.setOptionsFenetre({
		modale: true,
		titre: ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.SelectionnerTypeAppr",
		),
		largeur: 200,
		hauteur: 200,
		listeBoutons: [
			ObjetTraduction_1.GTraductions.getValeur("Annuler"),
			ObjetTraduction_1.GTraductions.getValeur("Valider"),
		],
	});
}
function _getTitreFenetre() {
	switch (GEtatUtilisateur.getGenreOnglet()) {
		case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Fiche:
		case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations:
		case Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences:
		case Enumere_Onglet_1.EGenreOnglet.FicheBrevet:
			return ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.TitreAss_Brevet",
			);
		case Enumere_Onglet_1.EGenreOnglet.ConseilDeClasse:
		case Enumere_Onglet_1.EGenreOnglet.Bulletins:
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin:
		case Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService:
			return ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.TitreAss_Bulletin",
			);
		case Enumere_Onglet_1.EGenreOnglet.Releve:
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsReleve:
			return ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.TitreAss_Releve",
			);
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales:
		case Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsGenerales_Competences:
			return ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.TitreAss_Bulletin",
			);
		default:
			return ObjetTraduction_1.GTraductions.getValeur(
				"Appreciations.AssistantSaisie",
			);
	}
}
function _getTitreListeAppreciations(aTypeAppreciation) {
	switch (aTypeAppreciation) {
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Appreciations:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.ApprA");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Progression:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.ApprB");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Conseil:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.ApprC");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Assiduite:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.ApprA");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Autonomie:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.ApprB");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Globale:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.ApprC");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Commentaire1:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.CommA");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Commentaire2:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.CommB");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.Commentaire3:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.CommC");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.CPE:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.CPE");
		case Enumere_TypeAppreciation_1.ETypeAppreciation.FG_Annuelle:
			return ObjetTraduction_1.GTraductions.getValeur("Appreciations.Annuelle");
		default:
			return "";
	}
}
