exports.DonneesListe_SelectionNiveauProgression =
	exports.ObjetFenetre_SelectionNiveauProgression = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_SelectionNiveauProgression extends ObjetFenetre_1.ObjetFenetre {
	constructor() {
		super(...arguments);
		this.avecChoixFiltrageEnseignees = false;
		this.filtreEnseignees = false;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe,
			this._initialiserListe,
		);
	}
	jsxModeleCheckboxFiltreUniquementEnseignes() {
		return {
			getValue: () => {
				return !!this.filtreEnseignees;
			},
			setValue: (aValue) => {
				this.filtreEnseignees = !!aValue;
				const lListe = this.getInstance(this.identListe);
				lListe.setDonnees(
					new DonneesListe_SelectionNiveauProgression(
						this.listeNiveaux,
						this.filtreEnseignees,
					),
				);
			},
		};
	}
	composeContenu() {
		const H = [];
		H.push('<div class=" flex-contain cols full-size">');
		if (this.avecChoixFiltrageEnseignees) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "fix-bloc" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model":
								this.jsxModeleCheckboxFiltreUniquementEnseignes.bind(this),
							style: "padding-bottom:0.5rem;",
						},
						ObjetTraduction_1.GTraductions.getValeur("UniquementMesClasses"),
					),
				),
			);
		}
		H.push(
			IE.jsx.str("div", {
				class: "fluid-bloc",
				id: this.getNomInstance(this.identListe),
			}),
		);
		H.push("</div>");
		return H.join("");
	}
	setDonnees(aListeNiveaux, aAvecFiltrage, aAvecLigneAucune) {
		this.avecChoixFiltrageEnseignees = aAvecFiltrage === true;
		this.avecLigneAucune = aAvecLigneAucune === true;
		this.actualiser();
		this.afficher();
		this.listeNiveaux = new ObjetListeElements_1.ObjetListeElements();
		this.listeNiveaux.add(aListeNiveaux);
		if (this.avecLigneAucune) {
			const lElement = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("Aucun"),
				0,
				null,
				0,
			);
			lElement.estEnseignee = true;
			lElement.code = "";
			this.listeNiveaux.addElement(lElement);
		}
		this.listeNiveaux.setTri([
			ObjetTri_1.ObjetTri.init(
				"Position",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		this.listeNiveaux.trier();
		this.setBoutonActif(1, false);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionNiveauProgression(
				this.listeNiveaux,
				this.filtreEnseignees,
			),
		);
	}
	surValidation(aNumeroBouton) {
		const lNiveauSelectionne = this.getInstance(
			this.identListe,
		).getElementSelection();
		this.callback.appel(
			aNumeroBouton,
			!!lNiveauSelectionne ? lNiveauSelectionne.getNumero() : null,
		);
		this.fermer();
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.surValidation(1);
				break;
		}
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_SelectionNiveauProgression.colonnes.libelle,
			titre: "",
			taille: "100%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 400,
		});
	}
}
exports.ObjetFenetre_SelectionNiveauProgression =
	ObjetFenetre_SelectionNiveauProgression;
class DonneesListe_SelectionNiveauProgression extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aFiltreEnseignees) {
		super(aDonnees);
		this.filtreEnseignees = aFiltreEnseignees === true;
		this.setOptions({
			avecEvnt_Selection: true,
			avecBoutonActionLigne: false,
			flatDesignMinimal: true,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionNiveauProgression.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getVisible(aArticle) {
		let lEstVisible = true;
		if (this.filtreEnseignees) {
			lEstVisible = aArticle.estEnseignee === true;
		}
		return lEstVisible;
	}
}
exports.DonneesListe_SelectionNiveauProgression =
	DonneesListe_SelectionNiveauProgression;
(function (DonneesListe_SelectionNiveauProgression) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "DLSelectionNiveau_libelle";
	})(
		(colonnes =
			DonneesListe_SelectionNiveauProgression.colonnes ||
			(DonneesListe_SelectionNiveauProgression.colonnes = {})),
	);
})(
	DonneesListe_SelectionNiveauProgression ||
		(exports.DonneesListe_SelectionNiveauProgression =
			DonneesListe_SelectionNiveauProgression =
				{}),
);
