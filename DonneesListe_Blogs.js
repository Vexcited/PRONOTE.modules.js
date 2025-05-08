exports.DonneesListe_Blogs = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_Action_1 = require("Enumere_Action");
class DonneesListe_Blogs extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			flatDesignMinimal: true,
			avecEvnt_Creation: true,
			avecEvnt_Selection: true,
			avecTri: false,
		});
	}
	estElementTousLesBlogs(aArticle) {
		return aArticle && !aArticle.existeNumero();
	}
	getTitreZonePrincipale(aParams) {
		return aParams.article.getLibelle();
	}
	avecBoutonActionLigne(aParams) {
		let lAvecBtnActionLigne = super.avecBoutonActionLigne(aParams);
		if (lAvecBtnActionLigne) {
			lAvecBtnActionLigne = !this.estElementTousLesBlogs(aParams.article);
		}
		if (lAvecBtnActionLigne) {
			const lBlog = aParams.article;
			lAvecBtnActionLigne = lBlog.estModifiable || lBlog.estSupprimable;
		}
		return lAvecBtnActionLigne;
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		lTris.push((D) => {
			return D.existeNumero();
		});
		return lTris;
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel || !aParametres.article) {
			return;
		}
		if (!this.estElementTousLesBlogs(aParametres.article)) {
			const lBlog = aParametres.article;
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Modifier"),
				lBlog.estModifiable,
				function () {
					this.callback.appel({
						article: aParametres.article,
						genreEvenement:
							Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
					});
				},
				{ icon: "icon_pencil" },
			);
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				lBlog.estSupprimable,
				async function () {
					const lGenreAction = await GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"blog.ConfirmSupprBlog",
							[aParametres.article.getLibelle()],
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
	}
}
exports.DonneesListe_Blogs = DonneesListe_Blogs;
