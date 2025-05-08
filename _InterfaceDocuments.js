const { InterfacePageCP } = require("ObjetInterfacePageCP.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetListe } = require("ObjetListe.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { tag } = require("tag.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { GUID } = require("GUID.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetTri } = require("ObjetTri.js");
const {
	DonneesListe_RubriqueDocuments,
} = require("DonneesListe_RubriqueDocuments.js");
const {
	UtilitaireDocumentATelecharger,
} = require("UtilitaireDocumentATelecharger.js");
const { GTraductions } = require("ObjetTraduction.js");
class _InterfaceDocuments extends InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsEcrans({ nbNiveaux: 2, avecBascule: !!IE.estMobile });
		this.contexte = Object.assign(this.contexte, {
			ecran: [
				_InterfaceDocuments.genreEcran.ecranCentrale,
				_InterfaceDocuments.genreEcran.ecranDroite,
			],
			niveauCourant: 0,
		});
		this.classCssPrincipale = "interfaceDocuments";
		this.titreFenetreRubrique = "";
		this.idZoneMessage = GUID.getId();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			selecteurListeRubrique: {
				event() {
					aInstance.ouvrirFenetreListeRubrique();
				},
				getLibelle() {
					let lLibelle = "";
					if (aInstance.rubriqueSelectionne) {
						lLibelle = aInstance.rubriqueSelectionne.getLibelle();
					}
					return lLibelle;
				},
				getIcone() {
					return aInstance.getIconeRubrique();
				},
				avecSelecteurListeRubrique() {
					return (
						aInstance &&
						aInstance.avecSelecteurListeRubrique() &&
						aInstance.optionsEcrans.avecBascule &&
						aInstance.getCtxEcran({
							niveauEcran: aInstance.contexte.niveauCourant,
						}) === _InterfaceDocuments.genreEcran.ecranCentrale
					);
				},
			},
		});
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone.push({
			html: tag("ie-btnselecteur", {
				"ie-model": "selecteurListeRubrique",
				"ie-if": "selecteurListeRubrique.avecSelecteurListeRubrique",
				"aria-label": GTraductions.getValeur("WAI.SelectionRubrique"),
			}),
		});
	}
	construireInstances() {
		if (!this.optionsEcrans.avecBascule) {
			this.identListeRubrique = this.add(
				ObjetListe,
				this.eventListeRubrique,
				this.initListeRubrique,
			);
		}
	}
	construireStructureAffichage() {
		this.construireStructureAffichageBandeau();
		const H = [];
		H.push(
			`<div class="InterfaceDocuments ${this.classCssPrincipale} ${this.optionsEcrans.avecBascule ? "mono" : "multi"}" >`,
		);
		if (!this.optionsEcrans.avecBascule) {
			H.push(
				`<div class="ctn-gauche multi">`,
				`<div id="${this.getNomInstance(this.identListeRubrique)}" style="height:100%;" ></div>`,
				`</div>`,
			);
		}
		H.push(
			`<div id="${this.getIdDeNiveau({ niveauEcran: 0 })}" class="ctn-centre ${this.optionsEcrans.avecBascule ? "mono" : "multi"}" >`,
			`<div id="${this.getNomInstance(this.identDocuments)}" style="height:100%;" ></div>`,
			`</div>`,
		);
		H.push(
			`<div id="${this.getIdDeNiveau({ niveauEcran: 1 })}" class="ctn-droite ${this.optionsEcrans.avecBascule ? "mono" : "multi"}" >`,
			this.construireAffichageEcranDroite(),
			`</div>`,
		);
		H.push('<div style="display:none;" id="', this.idZoneMessage, '"></div>');
		H.push(`</div>`);
		return H.join("");
	}
	recupererDonnees() {
		this.requeteConsultation();
	}
	requeteConsultation() {}
	construireAffichageEcranDroite() {
		return "";
	}
	getRubriqueParGenre(aGenre) {
		let lRubrique;
		if (aGenre >= 0) {
			lRubrique = this.getDonneesDelaListeRubrique()
				.getListeElements((aI) => aI.getGenre() === aGenre)
				.get(0);
		}
		return lRubrique;
	}
	construireEcran(aEcran) {
		switch (aEcran.genreEcran) {
			case _InterfaceDocuments.genreEcran.ecranCentrale:
				return new Promise((aResolve) => {
					this.afficherEcranCentrale();
					aResolve();
				});
			case _InterfaceDocuments.genreEcran.ecranDroite:
				return new Promise((aResolve) => {
					this.afficherEcranDroite();
					aResolve();
				});
			default:
		}
	}
	afficherEcranCentrale() {}
	afficherEcranDroite() {}
	initAff() {
		const lRubriqueSelectionnee = this.getRubriqueParGenre(
			this.genreRubriqueSelectionne,
		);
		if (!this.optionsEcrans.avecBascule) {
			this.afficherListeRubrique();
		}
		this.surSelectionListeRubrique(lRubriqueSelectionnee);
	}
	eventListeRubrique(aParams) {
		switch (aParams.genreEvenement) {
			case EGenreEvenementListe.Selection:
				this.surSelectionListeRubrique(
					aParams.article,
					aParams.surInteractionUtilisateur,
				);
				break;
			default:
				break;
		}
	}
	setListeRubrique(aListe) {
		if (aListe) {
			this.listeRubrique = MethodesObjet.dupliquer(aListe);
			this.listeRubrique = this.listeRubrique.parcourir((aCategorie) => {
				const lListeDocumentDeLaCategorie =
					this.listeDocuments.getListeElements(
						(aDocument) =>
							aDocument.categorie &&
							aDocument.categorie.getNumero() === aCategorie.getNumero(),
					);
				aCategorie.conteur = lListeDocumentDeLaCategorie.count();
			});
			this.listeRubrique
				.setTri([
					ObjetTri.init((D) => D.getNumero() !== 0),
					ObjetTri.init("Libelle"),
				])
				.trier();
			this.listeRubrique.insererElement(this.getRubriqueParDefaut(), 0);
			return;
		}
		this.listeRubrique = new ObjetListeElements();
	}
	marquerSelectionListeRubrique() {
		if (!this.optionsEcrans.avecBascule) {
			const lDonneesDeLaListe = this.getDonneesDelaListeRubrique();
			if (lDonneesDeLaListe) {
				const lIndice = lDonneesDeLaListe.getIndiceElementParFiltre((aElem) =>
					this.filtreListeRubrique(aElem),
				);
				const lInstanceListe = this.getInstance(this.identListeRubrique);
				if (MethodesObjet.isNumeric(lIndice) && lInstanceListe) {
					lInstanceListe.selectionnerLigne({
						ligne: lIndice,
						avecScroll: true,
					});
				}
			}
		}
	}
	filtreListeRubrique(aRubrique) {
		return aRubrique.getGenre() === this.rubriqueSelectionne.getGenre();
	}
	surSelectionListeRubrique(aArticle) {
		this.rubriqueSelectionne = aArticle;
		this.genreRubriqueSelectionne = aArticle.getGenre();
		this.marquerSelectionListeRubrique();
		this.basculerEcran({ src: null, dest: 0 });
	}
	initListeRubrique(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
		});
	}
	afficherListeRubrique(aListe) {
		if (!this.optionsEcrans.avecBascule) {
			this.getInstance(this.identListeRubrique).setDonnees(
				aListe ? aListe : this.getDonneesListeRubrique(),
			);
		}
	}
	surSelectionDocument(aDataEcranPrec) {
		this.setCtxSelection({ niveauEcran: 1, dataEcran: aDataEcranPrec });
		this.basculerEcran({ src: 0, dest: 1, data: aDataEcranPrec });
	}
	getDonneesDelaListeRubrique() {
		const lInstanceListe = this.getInstance(this.identListeRubrique);
		let result;
		if (lInstanceListe) {
			const lListeArticles = lInstanceListe.getListeArticles();
			result = lListeArticles.count() > 0 ? lListeArticles : null;
		}
		if (!result) {
			result = this.listeRubrique;
		}
		return result;
	}
	getIconeRubrique() {
		return this.rubriqueSelectionne
			? UtilitaireDocumentATelecharger.getIconListeRubrique({
					categorie: this.rubriqueSelectionne,
				})
			: "";
	}
	ouvrirFenetreListeRubrique() {
		const lListeRubrique = this.listeRubrique;
		this.fenetreListeRubrique = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste,
			{
				pere: this,
				evenement(aNumeroBouton, aSelection) {
					if (aNumeroBouton === 1) {
						const lSelection = lListeRubrique.get(aSelection);
						if (lSelection) {
							this.surSelectionListeRubrique(lSelection);
						}
					}
				},
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre({ titre: this.titreFenetreRubrique });
					aFenetre.paramsListe = {
						optionsListe: {
							labelWAI: this.titreFenetreRubrique,
							skin: ObjetListe.skin.flatDesign,
						},
					};
				},
			},
		);
		this.fenetreListeRubrique.setDonnees(this.getDonneesListeRubrique(), true);
	}
	basculerEcran(aParams) {
		const lEcranSrc = {
			niveauEcran: aParams.src,
			genreEcran: this.getCtxEcran({ niveauEcran: aParams.src }),
		};
		const lEcranDest = {
			niveauEcran: aParams.dest,
			genreEcran: this.getCtxEcran({ niveauEcran: aParams.dest }),
		};
		if (aParams.data) {
			lEcranSrc.dataEcran = aParams.data;
		}
		super.basculerEcran(lEcranSrc, lEcranDest);
	}
	getDonneesListeRubrique(aListe) {
		return new DonneesListe_RubriqueDocuments(
			aListe && aListe.parcourir
				? aListe
				: this.listeRubrique || new ObjetListeElements(),
		);
	}
	avecSelecteurListeRubrique() {
		return true;
	}
}
_InterfaceDocuments.genreEcran = {
	ecranCentrale: "ecranCentrale",
	ecranDroite: "ecranDroite",
};
_InterfaceDocuments.genreEventDocument = { btnRetour: "btnRetour" };
module.exports = { _InterfaceDocuments };
