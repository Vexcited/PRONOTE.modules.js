const { EEvent } = require("Enumere_Event.js");
const { ObjetCelluleBouton } = require("ObjetCelluleBouton.js");
const { Identite } = require("ObjetIdentite.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreBoutonCellule } = require("ObjetCelluleBouton.js");
const { ObjetGestionnaireMotifs } = require("ObjetGestionnaireMotifs.js");
const { EGenreRole } = require("ObjetWAI.js");
class ObjetCelluleMultiSelectionMotif extends Identite {
	constructor(...aParams) {
		super(...aParams);
		this.initOptions();
	}
	initOptions() {
		this._options = {
			genreBouton: EGenreBoutonCellule.Points,
			classTexte: "",
			largeurBouton: 248,
			hauteurBouton: 18,
			labelledById: "",
		};
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
	}
	initialiser() {
		this.cellule = new ObjetCelluleBouton(
			this.Nom + ".cellule",
			null,
			this,
			this.surCellule,
		);
		this.gestionnaireMotifs = new ObjetGestionnaireMotifs(
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
			labelledById: this._options.labelledById,
			avecZoneSaisie: false,
			roleWAI: EGenreRole.Combobox,
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
		const H = [];
		H.push(
			'<div class="input-wrapper multi-choix" ie-class="getClassesDynamiques" id="',
			this.cellule.getNom(),
			'"></div>',
		);
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getClassesDynamiques: function () {
				const lClasses = [];
				if (!aInstance.getActif()) {
					lClasses.push("input-wrapper-disabled");
				}
				return lClasses.join(" ");
			},
		});
	}
	surCellule(aGenreEvent) {
		if (!this.Actif) {
			return;
		}
		switch (aGenreEvent) {
			case EEvent.SurClick:
				this.gestionnaireMotifs.ouvrirFenetre();
				break;
			case EEvent.SurKeyUp:
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
		if (aParam.event === ObjetGestionnaireMotifs.genreEvent.actualiserDonnees) {
			this.callback.appel(
				aParam.genreBouton,
				aParam.liste,
				aParam.listeComplet,
			);
		}
	}
	_actualiserCellule() {
		let lListeSelectionne = new ObjetListeElements();
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
module.exports = { ObjetCelluleMultiSelectionMotif };
