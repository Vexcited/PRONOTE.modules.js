exports.ObjetFenetre_SelectionMatiere = void 0;
const DonneesListe_SelectionMatiere_1 = require("DonneesListe_SelectionMatiere");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class ObjetFenetre_SelectionMatiere extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecChoixFiltrageEnseignees = false;
		this.filtreEnseignees = false;
		this.libelleFiltreEnseignees = "";
		this.setOptionsFenetre({
			largeur: 300,
			hauteur: 400,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			titre: TradObjetFenetre_SelectionMatiere.SelectionnerMatiere,
		});
	}
	construireInstances() {
		this.identListe = this.add(ObjetListe_1.ObjetListe, this.evntSurListe);
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div id="' + this.getNomInstance(this.identListe) + '" style="height: ',
			this.optionsFenetre.hauteur - 65,
			'px"></div>',
		);
		return T.join("");
	}
	setLibelleFiltreEnseignees(aLibelle) {
		this.libelleFiltreEnseignees = aLibelle;
	}
	setDonnees(
		aListeMatieres,
		aAvecFiltrage,
		aAvecLigneAucune,
		aFiltreEnseignees,
	) {
		this.avecChoixFiltrageEnseignees = aAvecFiltrage === true;
		this.avecLigneAucune = aAvecLigneAucune === true;
		if (aFiltreEnseignees !== undefined) {
			this.filtreEnseignees = aFiltreEnseignees;
		} else {
			this.filtreEnseignees = this.avecChoixFiltrageEnseignees;
		}
		this.actualiser();
		this.afficher();
		this.listeMatieres = new ObjetListeElements_1.ObjetListeElements();
		this.listeMatieres.add(aListeMatieres);
		if (this.avecLigneAucune) {
			const lElement = new ObjetElement_1.ObjetElement(
				GlossaireCP_1.TradGlossaireCP.Aucune,
				0,
				null,
				0,
			);
			lElement.estEnseignee = true;
			lElement.code = "";
			this.listeMatieres.addElement(lElement);
		}
		this.listeMatieres.setTri([
			ObjetTri_1.ObjetTri.init(
				"Position",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		this.listeMatieres.trier();
		this.indiceSelection = null;
		const lFiltre = [];
		if (this.avecChoixFiltrageEnseignees) {
			const lJSXcbFiltreUniquementEnseignees = () => {
				return {
					getValue: () => {
						return !!this.filtreEnseignees;
					},
					setValue: (aValeur) => {
						this.filtreEnseignees = aValeur;
						this.getInstance(this.identListe).setDonnees(
							new DonneesListe_SelectionMatiere_1.DonneesListe_SelectionMatiere(
								this.listeMatieres,
								this.filtreEnseignees,
							),
						);
						this.indiceSelection = -1;
					},
					getLibelle: () => {
						return this.libelleFiltreEnseignees || "";
					},
				};
			};
			lFiltre.push({
				getHtml: () =>
					IE.jsx.str("ie-checkbox", {
						"ie-model": lJSXcbFiltreUniquementEnseignees,
					}),
				controleur: this.controleur,
			});
		}
		lFiltre.push({ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher });
		this.getInstance(this.identListe).setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecListeNeutre: true,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			boutons: lFiltre,
		});
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_SelectionMatiere_1.DonneesListe_SelectionMatiere(
				this.listeMatieres,
				this.filtreEnseignees,
			),
		);
	}
	surValidation(aNumeroBouton) {
		const lMatiereSelectionnee = this.listeMatieres.get(this.indiceSelection);
		this.fermer();
		this.callback.appel(
			aNumeroBouton,
			this.indiceSelection,
			lMatiereSelectionnee ? lMatiereSelectionnee.getNumero() : null,
		);
	}
	evntSurListe(aParametres, aGenreEvenementListe, I, J) {
		switch (aGenreEvenementListe) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				this.indiceSelection = J;
				this.surValidation(1);
				break;
			}
		}
	}
}
exports.ObjetFenetre_SelectionMatiere = ObjetFenetre_SelectionMatiere;
const ObjetTraduction_2 = require("ObjetTraduction");
const GlossaireCP_1 = require("GlossaireCP");
const TradObjetFenetre_SelectionMatiere =
	ObjetTraduction_2.TraductionsModule.getModule(
		"ObjetFenetre_SelectionMatiere",
		{ SelectionnerMatiere: "" },
	);
