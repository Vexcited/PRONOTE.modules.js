exports.DonneesListe_FiltresQCM = void 0;
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const UtilitaireQCM_1 = require("UtilitaireQCM");
class DonneesListe_FiltresQCM extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeFiltres, aParametres) {
		const lListeDonnees = aListeFiltres;
		if (!!aParametres.avecGestionCategorie) {
			const lElemCategories = ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FiltresQCM.Categories",
				),
				Numero: 0,
				Genre: DonneesListe_FiltresQCM.Genres.Categorie,
				Position: 1,
			});
			lElemCategories.estUnDeploiement = true;
			lElemCategories.estDeploye = !!aParametres.estLigneCategoriesDeployee;
			lListeDonnees.addElement(lElemCategories);
			if (!!aParametres.listeCategories) {
				aParametres.listeCategories.parcourir((aCategorie) => {
					aCategorie.pere = lElemCategories;
					lListeDonnees.addElement(aCategorie);
				});
			}
			const lElemCreerCategories = ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"FiltresQCM.EditerCategories",
				),
				Numero: 0,
				Genre: DonneesListe_FiltresQCM.Genres.Categorie,
			});
			lElemCreerCategories.estBoutonEditerCategoriesQCM = true;
			lElemCreerCategories.pere = lElemCategories;
			lListeDonnees.addElement(lElemCreerCategories);
		}
		super(lListeDonnees);
		this.setOptions({
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
			avecDeselectionSurNonSelectionnable: false,
			avecEventDeploiementSurCellule: true,
			avecEvnt_Deploiement: true,
			avecEvnt_Selection: true,
		});
	}
	getClassCelluleConteneur() {
		const lClasses = ["AvecMain"];
		return lClasses.join(" ");
	}
	avecSelection(aParams) {
		return (
			!aParams.article.estUnDeploiement &&
			!aParams.article.estBoutonEditerCategoriesQCM
		);
	}
	getTri() {
		const lTris = [];
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				if (
					D.getGenre() === DonneesListe_FiltresQCM.Genres.FiltreStandard &&
					D.getNumero() === DonneesListe_FiltresQCM.Filtre.ToutVoir
				) {
					return 1;
				} else if (D.getGenre() === DonneesListe_FiltresQCM.Genres.Categorie) {
					return 2;
				}
				return 3;
			}),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				if (D.getGenre() === DonneesListe_FiltresQCM.Genres.Categorie) {
					return D.estUnDeploiement
						? 1
						: D.estBoutonEditerCategoriesQCM
							? 3
							: 2;
				}
				return D.getPosition();
			}),
		);
		lTris.push(
			ObjetTri_1.ObjetTri.init((D) => {
				if (D.getGenre() === DonneesListe_FiltresQCM.Genres.Categorie) {
					return D.getLibelle();
				}
				return 0;
			}),
		);
		return lTris;
	}
	getTitreZonePrincipale(aParams) {
		const lStrIcone = [];
		if (
			aParams.article.getGenre() ===
			DonneesListe_FiltresQCM.Genres.FiltreStandard
		) {
			const lNomClasseIcone = this.getIconeFiltre(aParams.article.getNumero());
			if (!!lNomClasseIcone) {
				lStrIcone.push(
					'<i class="',
					lNomClasseIcone,
					'" aria-hidden="true"></i>',
				);
			}
		} else if (this.estUneCategorie(aParams.article)) {
			lStrIcone.push(
				UtilitaireQCM_1.UtilitaireQCM.dessineIconeCategorieQCM(
					aParams.article.couleur,
					aParams.article.abr,
				),
			);
		}
		const lIcone = lStrIcone.join("");
		const lLibelle = this.getLibelleFiltre(aParams.article);
		const H = [];
		H.push(lIcone);
		H.push(
			"<span",
			!!lIcone ? ' class="m-left"' : "",
			">",
			lLibelle,
			"</span>",
		);
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		const H = [];
		if (!!aParams.article.nbElementsAcceptes) {
			H.push(aParams.article.nbElementsAcceptes);
		}
		return H.join("");
	}
	estUneCategorie(aArticle) {
		return (
			aArticle.getGenre() === DonneesListe_FiltresQCM.Genres.Categorie &&
			!aArticle.estUnDeploiement &&
			!aArticle.estBoutonEditerCategoriesQCM
		);
	}
	getIconeFiltre(aGenreFiltre) {
		const lIcone = "";
		switch (aGenreFiltre) {
			case DonneesListe_FiltresQCM.Filtre.ToutVoir:
				return "icon_inbox";
			case DonneesListe_FiltresQCM.Filtre.Executes:
				return "icon_pastille_evaluation";
			case DonneesListe_FiltresQCM.Filtre.EnCoursDExecution:
				return "icon_adjust";
			case DonneesListe_FiltresQCM.Filtre.SansExecution:
				return "icon_circle_blank";
			case DonneesListe_FiltresQCM.Filtre.LiesADevoir:
				return "icon_saisie_note";
			case DonneesListe_FiltresQCM.Filtre.LiesAEvaluation:
				return "icon_saisie_evaluation";
			case DonneesListe_FiltresQCM.Filtre.LiesAContenuDeCours:
				return "icon_taf";
			case DonneesListe_FiltresQCM.Filtre.LiesATravailAFaire:
				return "icon_home";
		}
		return lIcone;
	}
	getLibelleFiltre(aArticle) {
		let lLibelle;
		if (aArticle.getGenre() === DonneesListe_FiltresQCM.Genres.FiltreStandard) {
			const lGenreFiltre = aArticle.getNumero();
			switch (lGenreFiltre) {
				case DonneesListe_FiltresQCM.Filtre.ToutVoir:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.ToutVoir",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.Executes:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.Executes",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.EnCoursDExecution:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.EnCoursDExecution",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.SansExecution:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.SansExecution",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.LiesADevoir:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.LiesADevoir",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.LiesAEvaluation:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.LiesAEvaluation",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.LiesAContenuDeCours:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.LiesAContenuDeCours",
					);
					break;
				case DonneesListe_FiltresQCM.Filtre.LiesATravailAFaire:
					lLibelle = ObjetTraduction_1.GTraductions.getValeur(
						"FiltresQCM.LiesATravailAFaire",
					);
					break;
			}
		} else {
			lLibelle = aArticle.getLibelle();
		}
		return lLibelle;
	}
}
exports.DonneesListe_FiltresQCM = DonneesListe_FiltresQCM;
(function (DonneesListe_FiltresQCM) {
	let Genres;
	(function (Genres) {
		Genres[(Genres["FiltreStandard"] = 0)] = "FiltreStandard";
		Genres[(Genres["Categorie"] = 1)] = "Categorie";
	})(
		(Genres =
			DonneesListe_FiltresQCM.Genres || (DonneesListe_FiltresQCM.Genres = {})),
	);
	let Filtre;
	(function (Filtre) {
		Filtre[(Filtre["ToutVoir"] = 0)] = "ToutVoir";
		Filtre[(Filtre["Executes"] = 1)] = "Executes";
		Filtre[(Filtre["EnCoursDExecution"] = 3)] = "EnCoursDExecution";
		Filtre[(Filtre["SansExecution"] = 4)] = "SansExecution";
		Filtre[(Filtre["LiesADevoir"] = 5)] = "LiesADevoir";
		Filtre[(Filtre["LiesAEvaluation"] = 6)] = "LiesAEvaluation";
		Filtre[(Filtre["LiesAContenuDeCours"] = 7)] = "LiesAContenuDeCours";
		Filtre[(Filtre["LiesATravailAFaire"] = 8)] = "LiesATravailAFaire";
	})(
		(Filtre =
			DonneesListe_FiltresQCM.Filtre || (DonneesListe_FiltresQCM.Filtre = {})),
	);
})(
	DonneesListe_FiltresQCM ||
		(exports.DonneesListe_FiltresQCM = DonneesListe_FiltresQCM = {}),
);
