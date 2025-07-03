exports.ObjetSelection = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
class ObjetSelection extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.idListeSelection = this.Nom + "_ListeObjetSelection";
		this.identList = this.Nom + "_ZoneListe";
		this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
		this.elementCourant = new ObjetElement_1.ObjetElement();
		this.actif = true;
		this.options = {
			styles: "",
			avecEvenementAvantSelection: false,
			icone: "icon_reorder",
			avecBoutonsPrecedentSuivant: true,
			height: null,
			getTitre: null,
			controleNavigation: false,
			optionsCombo: null,
			labelWAICellule: "",
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			combo: {
				init(aCombo) {
					aInstance._initCombo(aCombo);
				},
				event(aParametres) {
					if (
						aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
					) {
						aInstance._setElementCourant(aParametres.indice, true);
					}
				},
				getDisabled() {
					return !aInstance.actif;
				},
			},
		});
	}
	estVisible() {
		return true;
	}
	setParametres(aParam) {
		Object.assign(this.options, aParam);
	}
	setDonnees(aListeRessources, aIndiceParDefaut, aAvecEvnt) {
		this.listeRessources = aListeRessources;
		this.donneesRecues = true;
		this.afficher();
		if (this._combo) {
			if (aIndiceParDefaut === null || aIndiceParDefaut === undefined) {
				aIndiceParDefaut = 0;
			}
			const lAvecEvnt = aAvecEvnt !== false;
			if (lAvecEvnt) {
				this._combo.setSelection(aIndiceParDefaut);
			} else {
				this._combo.initSelection(aIndiceParDefaut);
			}
		}
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this.composeSelecteur();
		} else {
			return "";
		}
	}
	afficherMessage(aMessage) {
		ObjetHtml_1.GHtml.setHtml(this.getNom(), this.composeMessage(aMessage));
	}
	surPrecedent() {
		this._combo.surPrecedentSuivant(true);
	}
	surSuivant() {
		this._combo.surPrecedentSuivant(false);
	}
	composeSelecteur() {
		return IE.jsx.str("ie-combo", {
			"ie-model": "combo",
			"ie-controlesaisie": !!this.options.controleNavigation,
		});
	}
	setActif(aActif) {
		if (aActif !== null && aActif !== undefined && aActif !== this.actif) {
			this.actif = aActif;
			this.$refreshSelf();
		}
	}
	getCombo() {
		return this._combo;
	}
	_initCombo(aCombo) {
		this._combo = aCombo;
		aCombo.setDonneesObjetSaisie({
			liste: this.listeRessources,
			options: Object.assign(
				{
					avecBoutonsPrecSuiv: this.options.avecBoutonsPrecedentSuivant,
					avecBoutonsPrecSuiv_boucle: true,
					initAutoSelectionAvecUnElement: false,
					getContenuCellule: (aElement) => {
						const lHtml = [];
						if (this.options.getTitre) {
							lHtml.push(this.options.getTitre(aElement));
						} else if (aElement && aElement.libelleHtmlTitre) {
							lHtml.push(aElement.libelleHtmlTitre);
						} else {
							lHtml.push(
								"<span>",
								aElement ? aElement.getLibelle() : "",
								"</span>",
								aElement && aElement.sousTitre
									? "&nbsp;<span>" + aElement.sousTitre + "</span>"
									: "",
							);
						}
						return { libelleHtml: lHtml.join("") };
					},
					getContenuElement(aParams) {
						const lElement = aParams.element;
						const H = [];
						if (lElement.AvecSelection === false) {
							H.push(
								'<div class=" ',
								lElement.classeTitre ? lElement.classeTitre : "semi-bold",
								' text-center">',
								lElement.libelleHtml
									? '<div class="full-size">' + lElement.libelleHtml + "</div>"
									: ObjetChaine_1.GChaine.insecable(lElement.getLibelle()),
								"</div>",
							);
						} else {
							const lImagePerso = lElement.imagePerso
								? '<i class="material-icons ' + lElement.imagePerso + '"></i>'
								: "";
							H.push(
								lImagePerso && lElement.imagePosition === "left"
									? lImagePerso
									: "",
								"<div ie-ellipsis" +
									(lElement.idNotif ? ' id="' + lElement.idNotif + '"' : "") +
									' style="position:relative;' +
									(lElement.idNotif ? "padding-right:1.6em" : "") +
									'">',
								lElement.libelleHtml
									? lElement.libelleHtml
									: ObjetChaine_1.GChaine.insecable(lElement.getLibelle()),
								"</div>",
								lElement.sousTitre
									? '<div ie-ellipsis style="margin-left:18px;" class="taille-m color-neutre-foncee truncate">' +
											lElement.sousTitre +
											"</div>"
									: "",
							);
						}
						return H.join("");
					},
					labelWAICellule: this.options.labelWAICellule,
				},
				this.options.optionsCombo,
			),
		});
	}
	_setElementCourant(aIndice, aAvecEvenement) {
		const lElement = this.listeRessources.get(aIndice);
		if (lElement) {
			this.elementCourant = lElement;
			if (aAvecEvenement) {
				this.callback.appel({ element: this.elementCourant });
			}
		}
	}
}
exports.ObjetSelection = ObjetSelection;
