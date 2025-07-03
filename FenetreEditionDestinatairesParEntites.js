exports.FenetreEditionDestinatairesParEntites = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
class FenetreEditionDestinatairesParEntites extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.id = {
			nbEntiteClasse: GUID_1.GUID.getId(),
			nbEntiteGpe: GUID_1.GUID.getId(),
		};
		this.options = { avecChoixParEleve: true };
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeSelectChoixClassesGpes: function (aGenreRessource) {
				$(this.node).on("click", function () {
					aInstance.openModaleSelectRessource({
						genreRessource: aGenreRessource,
						donnee: aInstance.donnee,
						clbck: () => {
							aInstance.updateCompteurs();
						},
					});
				});
			},
			cbGenreDest: {
				getValue: function (aGenreRessource) {
					return aInstance.utilitaires !== null &&
						aInstance.utilitaires !== undefined
						? aInstance.utilitaires.moteurDestinataires.estGenrePublicEntite({
								genreRessource: aGenreRessource,
								donnee: aInstance.donnee,
							})
						: false;
				},
				setValue: function (aGenreRessource, aValue) {
					if (
						aInstance.utilitaires !== null &&
						aInstance.utilitaires !== undefined
					) {
						aInstance.utilitaires.moteurDestinataires.setGenrePublicEntite({
							genreRessource: aGenreRessource,
							donnee: aInstance.donnee,
							valeur: aValue,
						});
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			rbChxParMembre: {
				getValue: function (aGenreRessource, aChoixParMembre) {
					if (
						aInstance.utilitaires !== null &&
						aInstance.utilitaires !== undefined
					) {
						const lRelatifEleve =
							aInstance.utilitaires.moteurDestinataires.estRelatifEleve({
								genreRessource: aGenreRessource,
								donnee: aInstance.donnee,
							});
						if (aChoixParMembre === true) {
							return lRelatifEleve === true;
						} else {
							return lRelatifEleve === false;
						}
					}
				},
				setValue: function (aGenreRessource, aChoixParMembre) {
					if (
						aInstance.utilitaires !== null &&
						aInstance.utilitaires !== undefined
					) {
						aInstance.utilitaires.moteurDestinataires.setChoixParMembre({
							genreRessource: aGenreRessource,
							donnee: aInstance.donnee,
							choixParMembre: aChoixParMembre,
						});
					}
				},
				getDisabled: function (aGenreRessource) {
					return aInstance.utilitaires !== null &&
						aInstance.utilitaires !== undefined
						? !aInstance.utilitaires.moteurDestinataires.estGenrePublicEntite({
								genreRessource: aGenreRessource,
								donnee: aInstance.donnee,
							})
						: true;
				},
			},
			cbElevesRattaches: {
				getValue: function () {
					if (aInstance.donnee !== null && aInstance.donnee !== undefined) {
						return aInstance.donnee.avecElevesRattaches;
					}
				},
				setValue: function (aValue) {
					if (aInstance.donnee !== null && aInstance.donnee !== undefined) {
						aInstance.donnee.avecElevesRattaches = aValue;
						aInstance.donnee.avecModificationPublic = true;
					}
				},
				getDisabled: function () {
					return false;
				},
			},
			getDestIcon: {
				getIcone() {
					return `icon_group`;
				},
			},
		});
	}
	construireInstances() {}
	setDonnees(aParam) {
		this.donneeOrigine = aParam.donnee;
		this.donnee = MethodesObjet_1.MethodesObjet.dupliquer(this.donneeOrigine);
		this.afficher(this.composeContenu());
		this.updateCompteurs();
	}
	setUtilitaires(aUtilitaires) {
		this.utilitaires = aUtilitaires;
	}
	setOptions(aOptions) {
		this.options = aOptions;
		return this;
	}
	composeContenu() {
		const H = [];
		H.push('<div class="FenetreEditionDestinatairesParEntites">');
		H.push(this._construireHtmlChoixClassesGpe());
		H.push(this._construireHtmlSelectionTypeDestinataires());
		H.push("</div>");
		return H.join("");
	}
	openModaleSelectRessource(aParam) {
		this.utilitaires.moteurDestinataires.ouvrirModaleSelectionRessource(aParam);
	}
	updateCompteurs() {
		const lNbClasses = this.donnee.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceClasse()
				);
			})
			.getNbrElementsExistes();
		ObjetHtml_1.GHtml.setHtml(
			this.id.nbEntiteClasse,
			this._construireHtmlNb(lNbClasses),
		);
		const lNbGpe = this.donnee.listePublicEntite
			.getListeElements((D) => {
				return (
					D.getGenre() === this.utilitaires.genreRessource.getRessourceGroupe()
				);
			})
			.getNbrElementsExistes();
		ObjetHtml_1.GHtml.setHtml(
			this.id.nbEntiteGpe,
			this._construireHtmlNb(lNbGpe),
		);
	}
	surValidation(aGenreBouton) {
		const lEstValidation = aGenreBouton === 1;
		this.callback.appel(aGenreBouton, {
			donnee: lEstValidation ? this.donnee : this.donneeOrigine,
		});
		this.fermer();
	}
	_construireHtmlChoixClassesGpe() {
		const H = [];
		H.push(
			'<div class="titreSection first"><span >',
			"1. ",
			ObjetTraduction_1.GTraductions.getValeur(
				"destinataires.choixClassesGpes",
			),
			"</span></div>",
		);
		H.push(
			`<div class="field-contain">\n    <ie-btnselecteur ie-model="getDestIcon" aria-label="${ObjetTraduction_1.GTraductions.getValeur("destinataires.classes")}" ie-node="nodeSelectChoixClassesGpes(${this.utilitaires.genreRessource.getRessourceClasse()})">${ObjetTraduction_1.GTraductions.getValeur("destinataires.classes")} <span class="strNumber" id="${this.id.nbEntiteClasse}">(0)</span></ie-btnselecteur>\n    </div>`,
		);
		H.push(
			`<div class="field-contain">\n    <ie-btnselecteur ie-model="getDestIcon" aria-label="${ObjetTraduction_1.GTraductions.getValeur("destinataires.gpes")}" ie-node="nodeSelectChoixClassesGpes(${this.utilitaires.genreRessource.getRessourceGroupe()})">${ObjetTraduction_1.GTraductions.getValeur("destinataires.gpes")} <span class="strNumber" id="${this.id.nbEntiteGpe}">(0)</span></ie-btnselecteur>\n    </div>`,
		);
		if (this.options && this.options.avecCBElevesRattaches === true) {
			H.push('<div class="item flex-contain vertical">');
			H.push(
				'<ie-checkbox class="cb" ie-model="cbElevesRattaches()">',
				ObjetTraduction_1.GTraductions.getValeur(
					"actualites.public.elevesRattaches",
				),
				"</ie-checkbox>",
			);
			H.push("</div>");
		}
		return H.join("");
	}
	_construireHtmlSelectionDeRessource(aParam) {
		const H = [];
		H.push(
			'<div  class="item flex-contain vertical',
			aParam.estDernier === true ? " last " : "",
			'">',
		);
		H.push(
			'<ie-checkbox class="cb" ie-model="cbGenreDest(',
			aParam.genreRessource,
			')">',
			aParam.strRessource,
			"</ie-checkbox>",
		);
		if (aParam.avecChoixParEleve === true) {
			H.push(
				'<ie-radio class="rb" ie-model="rbChxParMembre(',
				aParam.genreRessource,
				", ",
				true,
				')">',
				ObjetTraduction_1.GTraductions.getValeur("destinataires.envoiParEleve"),
				"</ie-radio>",
			);
			H.push(
				'<ie-radio class="rb" ie-model="rbChxParMembre(',
				aParam.genreRessource,
				", ",
				false,
				')">',
				ObjetTraduction_1.GTraductions.getValeur("destinataires.envoiParResp"),
				"</ie-radio>",
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_construireHtmlSelectionTypeDestinataires() {
		const H = [];
		H.push(
			'<div class="titreSection"><span >',
			"2. ",
			ObjetTraduction_1.GTraductions.getValeur(
				"destinataires.selectionnerTypeDests",
			),
			"</span></div>",
		);
		H.push(
			this._construireHtmlSelectionDeRessource({
				genreRessource: this.utilitaires.genreRessource.getRessourceEleve(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.eleves",
				),
			}),
		);
		H.push(
			this._construireHtmlSelectionDeRessource({
				genreRessource: this.utilitaires.genreRessource.getRessourceParent(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.responsables",
				),
				avecChoixParEleve: this.options.avecChoixParEleve,
			}),
		);
		H.push(
			this._construireHtmlSelectionDeRessource({
				genreRessource: this.utilitaires.genreRessource.getRessourceProf(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.professeurs",
				),
			}),
		);
		H.push(
			this._construireHtmlSelectionDeRessource({
				genreRessource: this.utilitaires.genreRessource.getRessourcePersonnel(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.personnels",
				),
			}),
		);
		H.push(
			this._construireHtmlSelectionDeRessource({
				genreRessource:
					this.utilitaires.genreRessource.getRessourceEntreprise(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.maitresDeStage",
				),
				estDernier: true,
			}),
		);
		return H.join("");
	}
	_construireHtmlNb(aNb) {
		return " (" + aNb + ") ";
	}
}
exports.FenetreEditionDestinatairesParEntites =
	FenetreEditionDestinatairesParEntites;
