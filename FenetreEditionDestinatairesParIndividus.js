exports.FenetreEditionDestinatairesParIndividus = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
class FenetreEditionDestinatairesParIndividus extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.id = {
			nbEleves: GUID_1.GUID.getId(),
			nbProfs: GUID_1.GUID.getId(),
			nbResps: GUID_1.GUID.getId(),
			nbPersonnels: GUID_1.GUID.getId(),
			nbMdS: GUID_1.GUID.getId(),
			nbInspecteurs: GUID_1.GUID.getId(),
		};
		this.options = {
			avecGestionEleves: true,
			avecGestionPersonnels: true,
			avecGestionStages: true,
			avecGestionIPR: true,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnListeDiffusion() {
				return aInstance.avecListeDiffusion;
			},
			btnListeDiffusion: {
				event() {
					aInstance.surBtnListeDiffusion().then((aListeSelec) => {
						if (aListeSelec && aListeSelec.count() > 0) {
							aListeSelec.parcourir((aDiffusion) => {
								aDiffusion.listePublicIndividu.parcourir((aElement) => {
									if (
										!aInstance.donnee.listePublicIndividu.getElementParElement(
											aElement,
										) &&
										!aInstance._getDisabledParGenre(aElement.getGenre())
									) {
										aInstance.donnee.listePublicIndividu.addElement(
											MethodesObjet_1.MethodesObjet.dupliquer(aElement),
										);
									}
								});
							});
							aInstance.donnee.avecModificationPublic = true;
							aInstance.updateCompteurs();
						}
					});
				},
			},
			nodeSelectGenreDest: function (aGenreRessource) {
				$(this.node).on("click", () => {
					aInstance.utilitaires.moteurDestinataires
						.getDonneesPublic({ genreRessource: aGenreRessource })
						.then((aDonnees) => {
							aInstance.utilitaires.moteurDestinataires.openModaleSelectPublic({
								titre:
									aInstance.utilitaires.moteurDestinataires.getTitreSelectRessource(
										{ genreRessource: aGenreRessource },
									),
								listePublicDonnee: aInstance.donnee.listePublicIndividu,
								genreRessource: aGenreRessource,
								listeRessources: aDonnees.listePublic,
								listeServicesPeriscolaire: aDonnees.listeServicesPeriscolaire,
								listeProjetsAcc: aDonnees.listeProjetsAcc,
								listeFamilles: aDonnees.listeFamilles,
								listeRessourcesSelectionnees:
									aInstance.donnee.listePublicIndividu.getListeElements(
										(aElt) => {
											return aElt.getGenre() === aGenreRessource;
										},
									),
								listeNiveauxResponsabilite: aDonnees.listeNiveauxResponsabilite,
								clbck: (aParam) => {
									aInstance.donnee.avecModificationPublic =
										aParam.avecModificationPublic;
									aInstance.donnee.listePublicIndividu =
										aParam.listePublicDonnee;
									aInstance.updateCompteurs();
								},
							});
						});
				});
			},
			getDestIcon: {
				getIcone() {
					return `icon_user`;
				},
			},
		});
	}
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
		this.options = $.extend(this.options, aOptions);
		return this;
	}
	composeContenu() {
		const H = [];
		const lTabInfosRessources = this._getTabInfosRessources();
		H.push('<div class="FenetreEditionDestinatairesParIndividus">');
		H.push(
			'<div class="m-all" ie-if="avecBtnListeDiffusion"><ie-bouton class="small-bt themeBoutonNeutre" ie-model="btnListeDiffusion">',
			ObjetTraduction_1.GTraductions.getValeur(
				"listeDiffusion.btnListeDiffusion",
			),
			"</ie-bouton></div>",
		);
		for (let i = 0, lNbr = lTabInfosRessources.length; i < lNbr; i++) {
			const lInfosRessource = lTabInfosRessources[i];
			H.push(
				this._construireHtmlSelectionDeRessource(
					$.extend(lInfosRessource, { estDernier: i === lNbr - 1 }),
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	updateCompteurs() {
		const lTabInfosRessources = this._getTabInfosRessources();
		for (let i = 0, lNbr = lTabInfosRessources.length; i < lNbr; i++) {
			const lInfosRessource = lTabInfosRessources[i];
			const lNb = this.donnee.listePublicIndividu
				.getListeElements((D) => {
					return D.getGenre() === lInfosRessource.genreRessource;
				})
				.getNbrElementsExistes();
			ObjetHtml_1.GHtml.setHtml(
				lInfosRessource.idCompteur,
				this._construireHtmlNb(lNb),
			);
		}
	}
	surValidation(aGenreBouton) {
		const lEstValidation = aGenreBouton === 1;
		this.callback.appel(aGenreBouton, {
			donnee: lEstValidation ? this.donnee : this.donneeOrigine,
		});
		this.fermer();
	}
	_construireHtmlSelectionDeRessource(aParam) {
		const H = [];
		H.push(
			`<div class="field-contain">\n    <ie-btnselecteur ie-model="getDestIcon" aria-label="${aParam.strRessource}" ie-node="nodeSelectGenreDest(${aParam.genreRessource})">${aParam.strRessource}<span class="strNumber" id="${aParam.idCompteur}"></span></ie-btnselecteur>\n    </div>`,
		);
		return H.join("");
	}
	_construireHtmlNb(aNb) {
		return " (" + aNb + ") ";
	}
	_getTabInfosRessources() {
		const lResult = [];
		if (this.options.avecGestionEleves) {
			lResult.push({
				genreRessource: this.utilitaires.genreRessource.getRessourceEleve(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.eleves",
				),
				idCompteur: this.id.nbEleves,
			});
		}
		lResult.push(
			{
				genreRessource: this.utilitaires.genreRessource.getRessourceParent(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.responsables",
				),
				idCompteur: this.id.nbResps,
			},
			{
				genreRessource: this.utilitaires.genreRessource.getRessourceProf(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.professeurs",
				),
				idCompteur: this.id.nbProfs,
			},
		);
		if (this.options.avecGestionPersonnels) {
			lResult.push({
				genreRessource: this.utilitaires.genreRessource.getRessourcePersonnel(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.personnels",
				),
				idCompteur: this.id.nbPersonnels,
			});
		}
		if (this.options.avecGestionStages) {
			lResult.push({
				genreRessource:
					this.utilitaires.genreRessource.getRessourceEntreprise(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.maitresDeStage",
				),
				idCompteur: this.id.nbMdS,
			});
		}
		if (this.options.avecGestionIPR) {
			lResult.push({
				genreRessource:
					this.utilitaires.genreRessource.getRessourceInspecteur(),
				strRessource: ObjetTraduction_1.GTraductions.getValeur(
					"destinataires.inspecteur",
				),
				idCompteur: this.id.nbInspecteurs,
			});
		}
		return lResult;
	}
	_getDisabledParGenre(aGenre) {
		switch (aGenre) {
			case this.utilitaires.genreRessource.getRessourceEleve():
				return !this.options.avecGestionEleves;
			case this.utilitaires.genreRessource.getRessourcePersonnel():
				return !this.options.avecGestionPersonnels;
			case this.utilitaires.genreRessource.getRessourceEntreprise():
				return !this.options.avecGestionStages;
			case this.utilitaires.genreRessource.getRessourceInspecteur():
				return !this.options.avecGestionIPR;
			default:
				return false;
		}
	}
}
exports.FenetreEditionDestinatairesParIndividus =
	FenetreEditionDestinatairesParIndividus;
