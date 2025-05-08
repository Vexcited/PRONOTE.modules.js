exports.ObjetFenetre_Categorie = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetFenetre_Categorie extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = { listeCategories: null };
		this.param = { avecEtatSaisie: true };
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.categorieEditionOuSelection",
			),
			largeur: 400,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					valider: true,
				},
			],
			avecCroixFermeture: false,
		});
	}
	construireInstances() {
		this.identListeCategories = this.add(
			ObjetListe_1.ObjetListe,
			this._surEvenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	setDonnees(aListeCategories, aParam) {
		this.afficher();
		this.setBoutonActif(1, false);
		if (aParam !== null && aParam !== undefined) {
			$.extend(this.param, aParam);
		}
		this.donnees.listeCategories = aListeCategories;
		this.getInstance(this.identListeCategories).setDonnees(
			new DonneesListe_CategorieListe(this.donnees.listeCategories),
		);
	}
	getNumeroCategorie() {
		let lNumero = null;
		if (this.donnees.listeCategories) {
			lNumero = this.donnees.listeCategories.getNumero(
				this.getInstance(this.identListeCategories).getSelection(),
			);
		}
		return lNumero;
	}
	ouvrirFenetreSaisieCategorie(aCategorie) {
		let lTitreFenetre;
		let lCategorieSaisie;
		if (aCategorie) {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ModifierCategorieCDT",
			);
			lCategorieSaisie = MethodesObjet_1.MethodesObjet.dupliquer(aCategorie);
		} else {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.CreerCategorieCDT",
			);
			lCategorieSaisie = new ObjetElement_1.ObjetElement("");
			lCategorieSaisie.Editable = true;
			lCategorieSaisie.Supprimable = true;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement(aGenreBouton) {
					if (aGenreBouton === 1 && lCategorieSaisie.pourValidation()) {
						const lElementDeListeAvecLibelle =
							this.donnees.listeCategories.getElementParLibelle(
								lCategorieSaisie.getLibelle(),
							);
						if (lElementDeListeAvecLibelle) {
							GApplication.getMessage().afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.CategorieExisteDeja",
								),
							});
						} else {
							if (aCategorie) {
								const lIndiceCategorieExistante =
									this.donnees.listeCategories.getIndiceParElement(aCategorie);
								if (lIndiceCategorieExistante > -1) {
									this.donnees.listeCategories.remove(
										lIndiceCategorieExistante,
									);
								}
							}
							this.donnees.listeCategories.add(lCategorieSaisie);
							this.getInstance(this.identListeCategories).actualiser(true);
						}
					}
				},
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						titre: lTitreFenetre,
						largeur: 300,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		$.extend(lFenetre.controleur, {
			inputLibelle: {
				getValue() {
					return lCategorieSaisie.getLibelle();
				},
				setValue(aValue) {
					lCategorieSaisie.setLibelle(aValue);
					lCategorieSaisie.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
			},
		});
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("input", {
				"ie-model": "inputLibelle",
				type: "text",
				class: "round-style",
				style: "width:100%;",
				"aria-label": lTitreFenetre,
			}),
		);
		lFenetre.afficher(lHtml);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			IE.jsx.str("div", {
				style: "height:100%",
				id: this.getNomInstance(this.identListeCategories),
			}),
		);
		return lHtml.join("");
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecLigneCreation: true,
		});
	}
	_surEvenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.setBoutonActif(1, true);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.ouvrirFenetreSaisieCategorie(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.ouvrirFenetreSaisieCategorie(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				this.getInstance(this.identListeCategories).actualiser(true);
				this.setBoutonActif(1, false);
				break;
		}
	}
}
exports.ObjetFenetre_Categorie = ObjetFenetre_Categorie;
class DonneesListe_CategorieListe extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.creerIndexUnique("Libelle");
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
			avecEvnt_Suppression: true,
			avecTri: false,
		});
	}
	getZoneComplementaire(aParams) {
		const H = [];
		if (
			TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.estTypeAvecImage(
				aParams.article.getGenre(),
			)
		) {
			const lImage =
				TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getImage(
					aParams.article.getGenre(),
				);
			if (!!lImage) {
				H.push(IE.jsx.str("div", { class: lImage }));
			}
		}
		return H.join("");
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			!!aParametres.article.Editable,
			function () {
				this.callback.appel({
					article: aParametres.article,
					genreEvenement: Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
				});
			},
			{ icon: "icon_pencil" },
		);
		aParametres.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			!!aParametres.article.Supprimable,
			async function () {
				const lGenreAction = await GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ConfirmSuppressionCategorieCDT",
					),
				});
				if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					this.callback.appel({
						article: aParametres.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Suppression,
					});
				}
			},
			{ icon: "icon_trash" },
		);
		aParametres.menuContextuel.setDonnees();
	}
	getVisible(D) {
		return !!D.getLibelle();
	}
}
