exports._ObjetSelecteur = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetTraduction_1 = require("ObjetTraduction");
class _ObjetSelecteur extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this._options = {
			labelWAI: "",
			titreFenetre: "",
			titreLibelle: "",
			avecSelectionObligatoire: false,
		};
	}
	setOptions(aOptions) {
		$.extend(this._options, aOptions);
		return this;
	}
	construireInstances() {
		this.construireInstanceFenetreSelection();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnSelecteur: {
				event() {
					aInstance.evntBtnSelection();
				},
				getDisabled() {
					return !aInstance.getActif();
				},
			},
			getStyleLibelleNbSelections() {
				let lCouleur = GCouleur.nonEditable.texte;
				if (aInstance.getActif()) {
					lCouleur = GCouleur.noir;
				}
				return { color: lCouleur };
			},
			htmlLibelleNbSelections() {
				return aInstance.construitChaineLibelleNbSelections();
			},
		});
	}
	setDonnees(aParam) {
		this.param = aParam;
		this.listeSelection = aParam.listeSelection;
		this.listeTotale = aParam.listeTotale;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "NoWrap" },
					IE.jsx.str(
						"div",
						{ class: "InlineBlock" },
						IE.jsx.str("ie-bouton", { "ie-model": "btnSelecteur" }, "..."),
					),
					IE.jsx.str("div", {
						"ie-style": "getStyleLibelleNbSelections",
						"ie-html": "htmlLibelleNbSelections",
						class: "InlineBlock EspaceGauche AlignementMilieuVertical",
					}),
				),
			),
		);
		return T.join("");
	}
	construitChaineLibelleNbSelections() {
		const lNbRess = {
			nbSelectionne: this.listeSelection ? this.listeSelection.count() : 0,
			nbTotal: this.listeTotale ? this.listeTotale.count() : 0,
		};
		const T = [];
		T.push(this._options.titreLibelle);
		T.push(" (");
		if (lNbRess.nbSelectionne === lNbRess.nbTotal) {
			T.push(ObjetTraduction_1.GTraductions.getValeur("tous"));
		} else {
			T.push(lNbRess.nbSelectionne, "/", lNbRess.nbTotal);
		}
		T.push(")");
		return ObjetChaine_1.GChaine.insecable(T.join(""));
	}
	actualiserLibelle() {
		this.$refresh();
	}
	evntFenetreSelection(
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 1) {
			this.callback.appel({
				listeSelection: aListeRessourcesSelectionnees,
				genreRessource: aGenreRessource,
			});
			this.listeSelection = aListeRessourcesSelectionnees;
			this.actualiserLibelle();
		}
	}
}
exports._ObjetSelecteur = _ObjetSelecteur;
