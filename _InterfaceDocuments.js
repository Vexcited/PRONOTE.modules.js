exports._InterfaceDocuments = exports.EGenreEcran = void 0;
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
const ObjetHtml_1 = require("ObjetHtml");
const DonneesListe_RubriqueDocuments_1 = require("DonneesListe_RubriqueDocuments");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
var EGenreEcran;
(function (EGenreEcran) {
	EGenreEcran["ecranCentrale"] = "ecranCentrale";
	EGenreEcran["ecranDroite"] = "ecranDroite";
	EGenreEcran["ecranGauche"] = "ecranGauche";
})(EGenreEcran || (exports.EGenreEcran = EGenreEcran = {}));
class _InterfaceDocuments extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		const lEcrans = [
			EGenreEcran.ecranGauche,
			EGenreEcran.ecranCentrale,
			EGenreEcran.ecranDroite,
		];
		this.setOptionsEcrans({
			nbNiveaux: lEcrans.length,
			avecBascule: !!IE.estMobile,
		});
		this.contexte = Object.assign(this.contexte, {
			ecran: lEcrans,
			niveauCourant: 0,
		});
		this.classCssPrincipale = "interfaceDocuments";
		this.titreFenetreRubrique = "";
		this.idZoneMessage = GUID_1.GUID.getId();
		const lPage = this.etatUtilisateurSco.getPage();
		if (
			MethodesObjet_1.MethodesObjet.isNumber(
				lPage === null || lPage === void 0 ? void 0 : lPage.genreRubrique,
			)
		) {
			this.genreRubriqueSelectionne = lPage.genreRubrique;
		}
		this.etatUtilisateurSco.resetPage();
	}
	avecAccesSignatureNumerique() {
		return !!(0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.casierNumerique.accesSignatureNumerique,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	construireInstances() {
		this.identListeRubrique = this.add(
			ObjetListe_1.ObjetListe,
			this.eventListeRubrique,
			this.initListeRubrique,
		);
	}
	construireStructureAffichage() {
		var _a, _b;
		const lClassBascule = this.optionsEcrans.avecBascule
			? InterfaceDocuments_css_1.StylesInterfaceDocuments.mono
			: InterfaceDocuments_css_1.StylesInterfaceDocuments.multi;
		const lStyleEcran = this.optionsEcrans.avecBascule && { display: "none" };
		return IE.jsx.str(
			"div",
			{ class: ["InterfaceDocuments", this.classCssPrincipale, lClassBascule] },
			(_b =
				(_a = this.contexte) === null || _a === void 0 ? void 0 : _a.ecran) ===
				null || _b === void 0
				? void 0
				: _b.map((aEcran) =>
						IE.jsx.str(
							"div",
							{
								id: this.getIdDeNiveau({
									niveauEcran: this.getNiveauEcran(aEcran),
								}),
								style: lStyleEcran,
								class: [this.getCssEcran(aEcran), lClassBascule],
							},
							this.getHtmlEcran(aEcran),
						),
					),
			IE.jsx.str("div", { style: { display: "none" }, id: this.idZoneMessage }),
		);
	}
	getHtmlEcran(aGenre) {
		switch (aGenre) {
			case EGenreEcran.ecranGauche:
				return IE.jsx.str("div", {
					id: this.getNomInstance(this.identListeRubrique),
					class: [
						Divers_css_1.StylesDivers.fullHeight,
						Divers_css_1.StylesDivers.pTopXl,
					],
				});
			case EGenreEcran.ecranCentrale:
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					this.composeContenuePageProfonde(
						EGenreEcran.ecranCentrale,
						IE.jsx.str("div", {
							id: this.getNomInstance(this.identDocuments),
							class: [Divers_css_1.StylesDivers.fullHeight],
						}),
					),
				);
			case EGenreEcran.ecranDroite:
				return IE.jsx.str(
					IE.jsx.fragment,
					null,
					this.composeContenuePageProfonde(
						EGenreEcran.ecranDroite,
						this.construireAffichageEcranDroite(),
					),
				);
			default:
				return "";
		}
	}
	getCssEcran(aGenre) {
		switch (aGenre) {
			case EGenreEcran.ecranGauche:
				return InterfaceDocuments_css_1.StylesInterfaceDocuments.ctnGauche;
			case EGenreEcran.ecranCentrale:
				return InterfaceDocuments_css_1.StylesInterfaceDocuments.ctnCentre;
			case EGenreEcran.ecranDroite:
				return InterfaceDocuments_css_1.StylesInterfaceDocuments.ctnDroite;
			default:
				return "";
		}
	}
	getNiveauEcran(aGenre) {
		return this.getNiveauDeGenreEcran({ genreEcran: aGenre });
	}
	getIdBandeauEcran(aNiveauEcran) {
		return `${this.Nom}_idBandeau_${this.getCtxEcran({ niveauEcran: aNiveauEcran })}_${aNiveauEcran}`;
	}
	updateBandeauEcran(aNiveauEcran, aLibelle) {
		if (!this.optionsEcrans.avecBascule) {
			return;
		}
		ObjetHtml_1.GHtml.setHtml(this.getIdBandeauEcran(aNiveauEcran), aLibelle);
	}
	composeContenuePageProfonde(aGenreEcran, aHtml) {
		return IE.jsx.str(
			"div",
			{
				class: [
					"ctn-ecran-bandeau",
					Divers_css_1.StylesDivers.flexContain,
					Divers_css_1.StylesDivers.cols,
				],
			},
			this.optionsEcrans.avecBascule &&
				IE.jsx.str(
					IE.jsx.fragment,
					null,
					this.optionsEcrans.avecBascule &&
						this.construireBandeauEcran(
							IE.jsx.str("p", {
								class: "titre-ecran",
								id: this.getIdBandeauEcran(this.getNiveauEcran(aGenreEcran)),
							}),
						),
				),
			IE.jsx.str(
				"div",
				{ class: [Divers_css_1.StylesDivers.fluidBloc] },
				aHtml,
			),
		);
	}
	recupererDonnees() {
		this.requeteConsultation();
	}
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
			case EGenreEcran.ecranGauche:
				this.afficherEcranGauche(aEcran);
				break;
			case EGenreEcran.ecranCentrale:
				this.updateBandeauEcran(
					aEcran.niveauEcran,
					this.rubriqueSelectionne.getLibelle(),
				);
				this.afficherEcranCentrale(aEcran);
				break;
			case EGenreEcran.ecranDroite:
				this.afficherEcranDroite(aEcran);
				break;
			default:
		}
	}
	afficherEcranGauche(aParams) {
		this.afficherListeRubrique();
	}
	afficherEcranDroite(aParams) {}
	initAff() {
		if (!this.optionsEcrans.avecBascule) {
			this.initGenreRubriquePardefaut();
		}
		const lRubriqueSelectionnee = this.getRubriqueParGenre(
			this.genreRubriqueSelectionne,
		);
		this.changerEcran({ src: null, dest: EGenreEcran.ecranGauche });
		if (lRubriqueSelectionnee) {
			this.surSelectionListeRubrique(lRubriqueSelectionnee);
		}
	}
	eventListeRubrique(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.surSelectionListeRubrique(aParams.article);
				break;
			default:
				break;
		}
	}
	marquerSelectionListeRubrique() {
		const lDonneesDeLaListe = this.getDonneesDelaListeRubrique();
		if (lDonneesDeLaListe) {
			const lIndice = lDonneesDeLaListe.getIndiceElementParFiltre((aElem) =>
				this.filtreListeRubrique(aElem),
			);
			const lInstanceListe = this.getInstance(this.identListeRubrique);
			if (MethodesObjet_1.MethodesObjet.isNumeric(lIndice) && lInstanceListe) {
				lInstanceListe.selectionnerLigne({ ligne: lIndice, avecScroll: true });
			}
		}
	}
	filtreListeRubrique(aRubrique) {
		return aRubrique.getGenre() === this.rubriqueSelectionne.getGenre();
	}
	setRubriqueSelectionne(aRubrique) {
		if (aRubrique) {
			this.rubriqueSelectionne = aRubrique;
			this.genreRubriqueSelectionne = aRubrique.getGenre();
		}
	}
	surSelectionListeRubrique(aArticle) {
		this.setRubriqueSelectionne(aArticle);
		this.marquerSelectionListeRubrique();
		this.changerEcran({
			src: EGenreEcran.ecranGauche,
			dest: EGenreEcran.ecranCentrale,
		});
	}
	initListeRubrique(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
			ariaLabel: this.etatUtilisateurSco.getLibelleLongOnglet(),
		});
	}
	afficherListeRubrique(aListe) {
		this.getInstance(this.identListeRubrique).setDonnees(
			aListe ? aListe : this.getDonneesListeRubrique(),
		);
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
	getLibelleRubrique() {
		let lLibelle = "";
		if (this.rubriqueSelectionne) {
			lLibelle = this.rubriqueSelectionne.getLibelle();
		}
		return lLibelle;
	}
	changerEcran(aParams) {
		const lSrc =
			typeof aParams.src === "string"
				? this.getNiveauEcran(aParams.src)
				: aParams.src;
		const lDest =
			typeof aParams.dest === "string"
				? this.getNiveauEcran(aParams.dest)
				: aParams.dest;
		const lEcranSrc = {
			niveauEcran: lSrc,
			genreEcran: this.getCtxEcran({ niveauEcran: lSrc }),
		};
		const lEcranDest = {
			niveauEcran: lDest,
			genreEcran: this.getCtxEcran({ niveauEcran: lDest }),
		};
		if (aParams.data) {
			lEcranSrc.dataEcran = aParams.data;
		}
		super.basculerEcran(lEcranSrc, lEcranDest);
	}
	getDonneesListeRubrique() {
		return new DonneesListe_RubriqueDocuments_1.DonneesListe_RubriqueDocuments(
			this.listeRubrique,
		);
	}
	ouvrirFenetreCommentaire(aCommentaire, aOptions = {}) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser(aFenetre) {
					aFenetre.setOptionsFenetre(
						Object.assign(
							{
								largeurMin: 300,
								avecTailleSelonContenu: true,
								listeBoutons: [
									ObjetTraduction_1.GTraductions.getValeur("Fermer"),
								],
							},
							aOptions,
						),
					);
				},
			},
		);
		lFenetre.afficher(`<p>${aCommentaire}</p>`);
	}
}
exports._InterfaceDocuments = _InterfaceDocuments;
