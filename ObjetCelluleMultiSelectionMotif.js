exports.ObjetCelluleMultiSelectionMotif = void 0;
const Enumere_Event_1 = require("Enumere_Event");
const ObjetCelluleBouton_1 = require("ObjetCelluleBouton");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetCelluleBouton_2 = require("ObjetCelluleBouton");
const ObjetGestionnaireMotifs_1 = require("ObjetGestionnaireMotifs");
const ObjetWAI_1 = require("ObjetWAI");
class ObjetCelluleMultiSelectionMotif extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.initOptions();
	}
	initOptions() {
		this._options = {
			genreBouton: ObjetCelluleBouton_2.EGenreBoutonCellule.Points,
			classTexte: "",
			largeurBouton: 248,
			hauteurBouton: 18,
			ariaLabelledBy: "",
		};
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		return this;
	}
	initialiser() {
		this.cellule = new ObjetCelluleBouton_1.ObjetCelluleBouton(
			this.Nom + ".cellule",
			null,
			this,
			this.surCellule,
		);
		this.gestionnaireMotifs =
			new ObjetGestionnaireMotifs_1.ObjetGestionnaireMotifs(
				this.Nom + ".gestionnaireMotifs",
				null,
				this,
				this.surGestionnaireMotifs,
			);
		this.setPremierElement(this.cellule.NomEdit);
		this.cellule.setOptionsObjetCelluleBouton({
			estSaisissable: false,
			genreBouton: this._options.genreBouton,
			hauteur: this._options.hauteurBouton,
			largeur: this._options.largeurBouton,
			classTexte: this._options.classTexte,
			ariaLabelledBy: this._options.ariaLabelledBy,
			avecZoneSaisie: false,
			roleWAI: ObjetWAI_1.EGenreRole.Combobox,
			popupWAI: "dialog",
		});
		if (!!this._options.gestionnaireMotifs) {
			this.gestionnaireMotifs.setOptions(this._options.gestionnaireMotifs);
		}
		this.afficher();
		this.cellule.initialiser();
		this.cellule.setActif(this.Actif);
		this.gestionnaireMotifs.initialiser();
	}
	construireAffichage() {
		const getClassesDynamiques = () => {
			const lClasses = [];
			if (!this.getActif()) {
				lClasses.push("input-wrapper-disabled");
			}
			return lClasses.join(" ");
		};
		return IE.jsx.str("div", {
			class: "input-wrapper multi-choix",
			"ie-class": getClassesDynamiques,
			id: this.cellule.getNom(),
		});
	}
	surCellule(aGenreEvent) {
		if (!this.Actif) {
			return;
		}
		switch (aGenreEvent) {
			case Enumere_Event_1.EEvent.SurClick:
				this.gestionnaireMotifs.ouvrirFenetre();
				break;
			case Enumere_Event_1.EEvent.SurKeyUp:
				if (
					GNavigateur.isToucheRetourChariot() ||
					GNavigateur.isToucheFlecheBas()
				) {
					this.gestionnaireMotifs.ouvrirFenetre();
				}
				break;
		}
	}
	surGestionnaireMotifs(aParam) {
		this._actualiserCellule();
		if (
			aParam.event ===
			ObjetGestionnaireMotifs_1.ObjetGestionnaireMotifs.genreEvent
				.actualiserDonnees
		) {
			this.callback.appel(
				aParam.genreBouton,
				aParam.liste,
				aParam.listeComplet,
			);
		}
	}
	_actualiserCellule() {
		let lListeSelectionne = new ObjetListeElements_1.ObjetListeElements();
		if (this.gestionnaireMotifs) {
			lListeSelectionne = this.gestionnaireMotifs
				.getDonnees()
				.getListeElements((aElement) => {
					return aElement.cmsActif && !aElement.ssMotif;
				});
		}
		this.cellule.setLibelle(lListeSelectionne.getTableauLibelles().join(", "));
	}
	setDonnees(aListeSelectionne, aAvecReinitialiserlisteMotifs) {
		this.listeSelectionneOrigin = aListeSelectionne;
		this.gestionnaireMotifs.setDonnees({
			listeSelectionne: this.listeSelectionneOrigin,
			reinitialiserlisteMotifs: !!aAvecReinitialiserlisteMotifs,
		});
	}
	setActif(aActif) {
		super.setActif(aActif);
		if (this.cellule) {
			this.cellule.setActif(aActif);
		}
		this.$refreshSelf();
	}
}
exports.ObjetCelluleMultiSelectionMotif = ObjetCelluleMultiSelectionMotif;
