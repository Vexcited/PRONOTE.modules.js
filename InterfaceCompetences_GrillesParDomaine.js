exports.InterfaceCompetences_GrillesParDomaine = void 0;
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfaceCompetences_Grilles_1 = require("InterfaceCompetences_Grilles");
const ObjetFenetre_SelectionDomaineCompetence_1 = require("ObjetFenetre_SelectionDomaineCompetence");
const TypeReferentielGrilleCompetence_1 = require("TypeReferentielGrilleCompetence");
const TypeCategorieCompetence_1 = require("TypeCategorieCompetence");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const ObjetRequeteSaisieCompetencesGrilles_1 = require("ObjetRequeteSaisieCompetencesGrilles");
class InterfaceCompetences_GrillesParDomaine extends InterfaceCompetences_Grilles_1.InterfaceCompetences_Grilles {
	constructor(...aParams) {
		super(...aParams);
		this.idPage = this.Nom + "_page_domaine";
		this.categorieCompetence =
			GEtatUtilisateur.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.Competences_GrillesCompetencesNumeriques
				? TypeCategorieCompetence_1.TypeCategorieCompetence.CompetenceNumerique
				: TypeCategorieCompetence_1.TypeCategorieCompetence.Socle;
	}
	getGenreReferentiel() {
		return TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
			.GR_PilierDeCompetence;
	}
	construireInstances() {
		super.construireInstances();
		this.identFenetreSelectionDomaine = this.addFenetre(
			ObjetFenetre_SelectionDomaineCompetence_1.ObjetFenetre_SelectionDomaineCompetence,
			this._evenementFenetreSelectionDomaine,
			this._initFenetreSelectionDomaine,
		);
	}
	_surCreationReferentiel() {
		this.getInstance(this.identFenetreSelectionDomaine).setDonnees({
			listeRessources: this._getListeReferentielsPossibles(),
			listeRessourcesSelectionnees:
				new ObjetListeElements_1.ObjetListeElements(),
			genreRessource: this.getGenreReferentiel(),
		});
	}
	_initFenetreSelectionDomaine(aInstance) {
		aInstance.setOptionsFenetreSelectionRessource({
			avecCocheRessources: false,
			avecCreation: true,
			avecEdition: true,
			avecSuppression: true,
			commandeSaisie:
				ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
					.saisieReferentiel,
			commandeSuppression:
				ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
					.suppressionReferentiel,
		});
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competencesGrilles.GrilleCompetences.AjoutDomaine.Titre",
			),
			largeur: 500,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_evenementFenetreSelectionDomaine(aNumeroBouton, aListeElementsSelectionnes) {
		if (aNumeroBouton === 1) {
			this._saisie(
				ObjetRequeteSaisieCompetencesGrilles_1.CommandeSaisieCompetencesGrilles
					.creationRelationReferentiel,
				{ referentiels: aListeElementsSelectionnes },
			);
		} else {
			this._actualiserPage();
		}
	}
}
exports.InterfaceCompetences_GrillesParDomaine =
	InterfaceCompetences_GrillesParDomaine;
