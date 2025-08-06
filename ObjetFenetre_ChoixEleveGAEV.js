exports.ObjetFenetre_ChoixEleveGAEV = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_ElevesGAEV_1 = require("DonneesListe_ElevesGAEV");
const ObjetRequeteListeElevesGAEV_1 = require("ObjetRequeteListeElevesGAEV");
var GenreTri;
(function (GenreTri) {
	GenreTri[(GenreTri["ordreAlphabetique"] = 0)] = "ordreAlphabetique";
	GenreTri[(GenreTri["classe"] = 1)] = "classe";
})(GenreTri || (GenreTri = {}));
class ObjetFenetre_ChoixEleveGAEV extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.filtres = {
			dansLeGroupe: true,
			dansAutreGroupe: true,
			aucunGroupe: true,
			presents: true,
		};
	}
	construireInstances() {
		this.identListeEleves = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListeEleves,
			this.initialiserListeEleves,
		);
		this.identComboTri = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this.evenementComboTri,
			this.initialiserComboTri,
		);
	}
	jsxModelCheckboxDansLeGroupe() {
		return {
			getValue: () => {
				return this.filtres.dansLeGroupe;
			},
			setValue: (aValue) => {
				this.filtres.dansLeGroupe = aValue;
				this.getInstance(this.identListeEleves).actualiser();
			},
		};
	}
	jsxModelCheckboxAutresGroupes() {
		return {
			getValue: () => {
				return this.filtres.dansAutreGroupe;
			},
			setValue: (aValue) => {
				this.filtres.dansAutreGroupe = aValue;
				this.getInstance(this.identListeEleves).actualiser();
			},
		};
	}
	jsxModelCheckboxAucunGroupe() {
		return {
			getValue: () => {
				return this.filtres.aucunGroupe;
			},
			setValue: (aValue) => {
				this.filtres.aucunGroupe = aValue;
				this.getInstance(this.identListeEleves).actualiser();
			},
		};
	}
	jsxModelCheckboxUniquementPresents() {
		return {
			getValue: () => {
				return this.filtres.presents;
			},
			setValue: (aValue) => {
				this.filtres.presents = aValue;
				this.getInstance(this.identListeEleves).actualiser();
			},
		};
	}
	setDonnees(aCours, aGroupe, aDomaine) {
		new ObjetRequeteListeElevesGAEV_1.ObjetRequeteListeElevesGAEV(
			this,
			this._actionSurRequeteListeElevesGAEV,
			this._surEchecListeElevesGAEV,
		).lancerRequete({ cours: aCours, groupe: aGroupe, domaine: aDomaine });
	}
	getListeTrisDisponibles() {
		const lListeTris = new ObjetListeElements_1.ObjetListeElements();
		lListeTris.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"ChoixEleveGAEV.ordreAlphabetique",
				),
				null,
				GenreTri.ordreAlphabetique,
			),
		);
		lListeTris.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"ChoixEleveGAEV.colonne.classe",
				),
				null,
				GenreTri.classe,
			),
		);
		return lListeTris;
	}
	_actionSurRequeteListeElevesGAEV(aJSON) {
		this.listeEleves = aJSON.listeElevesGAEV;
		const lListeClasses = new ObjetListeElements_1.ObjetListeElements();
		let lElmClasse;
		this.trierListeSelonGenre(GenreTri.classe);
		let lClasse = "";
		for (let I = 0; I < this.listeEleves.count(); I++) {
			const lEleve = this.listeEleves.get(I);
			lEleve.pere = null;
			lEleve.estUneClasse = false;
			lEleve.estUnDeploiement = false;
			lEleve.estDeploye = true;
			lEleve.visible = true;
			lEleve.initial = {
				estTotalementDesGroupes: lEleve.estTotalementDesGroupes,
				estPartiellementDesGroupes: lEleve.estPartiellementDesGroupes,
			};
			if (!lEleve.estUneClasse && lClasse !== lEleve.classe) {
				lElmClasse = new ObjetElement_1.ObjetElement(lEleve.classe);
				lElmClasse.pere = null;
				lElmClasse.classe = lEleve.classe;
				lElmClasse.estUneClasse = true;
				lElmClasse.visible = false;
				lElmClasse.estUnDeploiement = true;
				lElmClasse.estDeploye = true;
				lListeClasses.addElement(lElmClasse);
			}
			lClasse = lEleve.classe;
		}
		for (let I = 0; I < lListeClasses.count(); I++) {
			lElmClasse = lListeClasses.get(I);
			lClasse = lElmClasse.classe;
			const lListeEleves = this.listeEleves.getListeElements((aEleve) => {
				return aEleve.classe === lClasse;
			});
			const lListeElevesSelectionne = lListeEleves.getListeElements(
				(aEleve) => {
					return aEleve.estTotalementDesGroupes;
				},
			);
			lElmClasse.estTotalementDesGroupes =
				lListeElevesSelectionne.count() > 0 &&
				lListeEleves.count() === lListeElevesSelectionne.count()
					? true
					: null;
		}
		this.listeEleves.add(lListeClasses);
		const lListeTris = this.getListeTrisDisponibles();
		this.getInstance(this.identComboTri).setDonnees(lListeTris);
		this.triCourant = GenreTri.ordreAlphabetique;
		this.getInstance(this.identComboTri).initSelection(this.triCourant);
		this.trierListeSelonGenre(this.triCourant);
		this.afficher();
		this.getInstance(this.identListeEleves).setDonnees(
			new DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV(
				this.listeEleves,
				this.filtres,
				this.triCourant,
			),
		);
		this.setBoutonActif(1, false);
	}
	_surEchecListeElevesGAEV() {}
	composeContenu() {
		const lHeightListe =
			this.optionsFenetre.hauteur - 23 - 30 - 5 - 4 * 20 - 20 - 15;
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center m-bottom" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxDansLeGroupe.bind(this),
							class: "EspaceDroit",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"ChoixEleveGAEV.coche.presentDansGroupe",
						),
					),
					IE.jsx.str("i", {
						class: "Image_CocheVerte as-icon self-start m-bottom-l",
						role: "presentation",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center m-bottom" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModelCheckboxAutresGroupes.bind(this),
							class: "EspaceDroit",
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"ChoixEleveGAEV.coche.affectesAutresGroupes",
						),
					),
					IE.jsx.str("i", {
						class: "Image_DiagAffEleTGris as-icon self-start",
						role: "presentation",
					}),
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModelCheckboxAucunGroupe.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"ChoixEleveGAEV.coche.affectesAucunGroupe",
						),
					),
				),
				IE.jsx.str("hr", {
					style:
						"text-align:left; margin-left:2rem; margin-bottom:.4rem; width: 200px;",
				}),
				IE.jsx.str(
					"div",
					{ class: "EspaceBas" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModelCheckboxUniquementPresents.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"ChoixEleveGAEV.coche.uniquementsPresents",
						),
					),
				),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identComboTri),
					class: "EspaceBas",
				}),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListeEleves),
					style: "width:100%; height:" + lHeightListe + "px;",
				}),
			),
		);
		return T.join("");
	}
	initialiserComboTri(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 150,
			texteEdit:
				ObjetTraduction_1.GTraductions.getValeur("ChoixEleveGAEV.classerPar") +
				" ",
		});
	}
	initialiserListeEleves(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV.colonnes.coche,
			titre: { title: "", estCoche: true },
			taille: 20,
		});
		lColonnes.push({
			id: DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV.colonnes.nom,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixEleveGAEV.colonne.nom",
			),
			taille: 150,
		});
		lColonnes.push({
			id: DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV.colonnes.diagnostic,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixEleveGAEV.colonne.diagnostic",
			),
			taille: 40,
		});
		lColonnes.push({
			id: DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV.colonnes.classe,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixEleveGAEV.colonne.classe",
			),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV.colonnes.options,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixEleveGAEV.colonne.options",
			),
			taille: "100%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
	}
	evenementComboTri(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.triCourant = aParams.element.getGenre();
			if (this.listeEleves) {
				this.trierListeSelonGenre(this.triCourant);
				this.getInstance(this.identListeEleves).setDonnees(
					new DonneesListe_ElevesGAEV_1.DonneesListe_ElevesGAEV(
						this.listeEleves,
						this.filtres,
						this.triCourant,
					),
				);
			}
		}
	}
	trierListeSelonGenre(aGenreTri) {
		if (aGenreTri === GenreTri.ordreAlphabetique) {
			this.listeEleves.setTri([
				ObjetTri_1.ObjetTri.init("Libelle"),
				ObjetTri_1.ObjetTri.init("classe"),
			]);
			this.listeEleves.trier();
			for (let I = 0; I < this.listeEleves.count(); I++) {
				const lEleve = this.listeEleves.get(I);
				if (lEleve.estUneClasse) {
					lEleve.visible = false;
				} else {
					lEleve.pere = null;
				}
			}
		} else {
			this.listeEleves.setTri([
				ObjetTri_1.ObjetTri.init("classe"),
				ObjetTri_1.ObjetTri.init(
					"estUneClasse",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
				ObjetTri_1.ObjetTri.init("Libelle"),
			]);
			this.listeEleves.trier();
			let lElmPere = null;
			for (let I = 0; I < this.listeEleves.count(); I++) {
				const lEleve = this.listeEleves.get(I);
				if (lEleve.estUneClasse) {
					lElmPere = lEleve;
					lEleve.visible = true;
				} else {
					lEleve.pere = lElmPere;
				}
			}
		}
	}
	evenementListeEleves(aParametres) {
		if (
			aParametres.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition
		) {
			this.setBoutonActif(1, this.estListeElevesModifie());
		}
	}
	estListeElevesModifie() {
		for (let I = 0; I < this.listeEleves.count(); I++) {
			const lEleve = this.listeEleves.get(I);
			if (this._estEleveModifie(lEleve)) {
				return true;
			}
		}
		return false;
	}
	surValidation(aGenreBouton) {
		this.fermer();
		let lListeEleves;
		if (aGenreBouton === 1) {
			lListeEleves = this.listeEleves.getListeElements((aElement) => {
				return !aElement.estUneClasse;
			});
			for (let I = 0; I < lListeEleves.count(); I++) {
				const lEleve = lListeEleves.get(I);
				if (this._estEleveModifie(lEleve)) {
					lEleve.setEtat(
						lEleve.estTotalementDesGroupes
							? Enumere_Etat_1.EGenreEtat.Modification
							: Enumere_Etat_1.EGenreEtat.Suppression,
					);
				}
			}
		}
		this.callback.appel(aGenreBouton, lListeEleves);
	}
	_estEleveModifie(aEleve) {
		return (
			aEleve &&
			!aEleve.estUneClasse &&
			(aEleve.initial.estTotalementDesGroupes !==
				aEleve.estTotalementDesGroupes ||
				aEleve.initial.estPartiellementDesGroupes !==
					aEleve.estPartiellementDesGroupes)
		);
	}
}
exports.ObjetFenetre_ChoixEleveGAEV = ObjetFenetre_ChoixEleveGAEV;
