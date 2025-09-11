exports.ObjetFenetre_ListeThemes = void 0;
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Themes_1 = require("DonneesListe_Themes");
const MethodesObjet_1 = require("MethodesObjet");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetFenetre_EditionTheme_1 = require("ObjetFenetre_EditionTheme");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieListeThemes_1 = require("ObjetRequeteSaisieListeThemes");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_ListeThemes extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecThemeLesMiens = false;
		this.avecThemeAssocieSelection = true;
		this.avecThemesMesMatieres = false;
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Theme.titre.selectionnerThemes",
			),
			largeur: 450,
			hauteur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementSurListe.bind(this),
			this._initialiserListe,
		);
	}
	jsxModeleCheckboxThemesLesMiens() {
		return {
			getValue: () => {
				return this.avecThemeLesMiens;
			},
			setValue: (aValue) => {
				this.avecThemeLesMiens = !this.avecThemeLesMiens;
				if (this.avecThemeLesMiens) {
					this.avecThemeAssocieSelection = false;
					this.avecThemesMesMatieres = false;
				}
				this._filtrageSelection();
			},
		};
	}
	jsxModeleCheckboxThemesSelection() {
		return {
			getValue: () => {
				return this.avecThemeAssocieSelection;
			},
			setValue: (aValue) => {
				this.avecThemeAssocieSelection = !this.avecThemeAssocieSelection;
				if (this.avecThemeAssocieSelection) {
					this.avecThemeLesMiens = false;
					this.avecThemesMesMatieres = false;
				}
				this._filtrageSelection();
			},
		};
	}
	jsxModeleCheckboxThemesMesMatieres() {
		return {
			getValue: () => {
				return this.avecThemesMesMatieres;
			},
			setValue: (aValue) => {
				this.avecThemesMesMatieres = !this.avecThemesMesMatieres;
				if (this.avecThemesMesMatieres) {
					this.avecThemeLesMiens = false;
					this.avecThemeAssocieSelection = false;
				}
				this._filtrageSelection();
			},
		};
	}
	setDonnees(aParams) {
		this.donnees = MethodesObjet_1.MethodesObjet.dupliquer(aParams.listeThemes);
		this.matiereContexte = aParams.matiereContexte;
		this.listeMatieres = aParams.listeMatieres;
		this.tailleLibelleTheme = aParams.tailleLibelleTheme;
		this.libelleCB = aParams.libelleCB;
		this.matiereNonDesignee = aParams.matiereNonDesignee;
		if (!this.libelleCB) {
		}
		this.afficher(this.composeContenu());
		this.surFixerTaille();
		this._filtrageSelection();
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols", style: "height:100%" },
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModeleCheckboxThemesLesMiens.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"Theme.filtrePar.lesMiens",
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModeleCheckboxThemesSelection.bind(this) },
						this.libelleCB ||
							ObjetTraduction_1.GTraductions.getValeur(
								"Theme.libelleCB.selection",
							),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": this.jsxModeleCheckboxThemesMesMatieres.bind(this) },
						ObjetTraduction_1.GTraductions.getValeur(
							"Theme.filtrePar.mesMatieres",
						),
					),
				),
				IE.jsx.str("div", {
					class: "field-contain",
					style: "flex: 1 1 auto;",
					id: this.getNomInstance(this.identListe),
				}),
			),
		);
		return H.join("");
	}
	_actualiserListe(aListeFiltrees) {
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_Themes_1.DonneesListe_Themes(
				aListeFiltrees,
				this.listeMatieres,
				this.tailleLibelleTheme,
			),
		);
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton, this.donnees);
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: [{ taille: "100%" }],
			avecLigneCreation: true,
			estBoutonCreationPiedFlottant_mobile: false,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			ariaLabel: this.optionsFenetre.titre,
		});
	}
	evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreCreation(aParametres);
				break;
		}
	}
	_filtrageSelection() {
		let lListeFiltrees = new ObjetListeElements_1.ObjetListeElements();
		if (
			!this.avecThemeAssocieSelection &&
			!this.avecThemesMesMatieres &&
			!this.avecThemeLesMiens
		) {
			lListeFiltrees = this.donnees;
		} else {
			if (this.avecThemeLesMiens) {
				this.donnees.parcourir((aTheme) => {
					if (!aTheme.auteur) {
						lListeFiltrees.add(aTheme);
					}
				});
			} else if (
				this.avecThemeAssocieSelection ||
				!(0, AccessApp_1.getApp)().getEtatUtilisateur().listeMatieres
			) {
				const lListeThemesActifs =
					new ObjetListeElements_1.ObjetListeElements();
				this.donnees.parcourir((aTheme) => {
					if (aTheme.cmsActif) {
						lListeThemesActifs.add(aTheme);
					}
				});
				const lListeMatieresSelectionnees = {};
				if (this.matiereContexte) {
					lListeMatieresSelectionnees[this.matiereContexte.getNumero()] =
						this.matiereContexte;
				}
				if (this.matiereNonDesignee) {
					lListeMatieresSelectionnees[this.matiereNonDesignee.getNumero()] =
						this.matiereNonDesignee;
				}
				lListeThemesActifs.parcourir((aTheme) => {
					if (!lListeMatieresSelectionnees[aTheme.matiere.getNumero()]) {
						lListeMatieresSelectionnees[aTheme.matiere.getNumero()] =
							aTheme.matiere;
					}
				});
				this.donnees.parcourir((aTheme) => {
					let lEstDejaDansLaListe = false;
					for (let i in lListeMatieresSelectionnees) {
						if (
							!lEstDejaDansLaListe &&
							(!aTheme.matiere ||
								aTheme.matiere.getNumero() ===
									lListeMatieresSelectionnees[i].getNumero())
						) {
							lListeFiltrees.add(aTheme);
							lEstDejaDansLaListe = true;
						}
					}
				});
			} else {
				const lListeMatieresEnseignees =
					new ObjetListeElements_1.ObjetListeElements();
				(0, AccessApp_1.getApp)()
					.getEtatUtilisateur()
					.listeMatieres.parcourir((aMatiere) => {
						if (aMatiere.estEnseignee) {
							lListeMatieresEnseignees.add(aMatiere);
						}
					});
				if (this.matiereNonDesignee) {
					lListeMatieresEnseignees.add(this.matiereNonDesignee);
				}
				this.donnees.parcourir((aTheme) => {
					let lEstDejaDansLaListe = false;
					lListeMatieresEnseignees.parcourir((aMatiere) => {
						if (
							!lEstDejaDansLaListe &&
							(!aTheme.matiere ||
								aTheme.matiere.getNumero() === aMatiere.getNumero())
						) {
							lListeFiltrees.add(aTheme);
							lEstDejaDansLaListe = true;
						}
					});
				});
			}
		}
		this._actualiserListe(lListeFiltrees);
	}
	_ouvrirFenetreCreation(aParams) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EditionTheme_1.ObjetFenetre_EditionTheme,
			{
				pere: this,
				evenement: function (aTheme) {
					if (aTheme.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
						aTheme.cmsActif = true;
						aTheme.modificationAutorisee = true;
						new ObjetRequeteSaisieListeThemes_1.ObjetRequeteSaisieListeThemes(
							this,
							(aDonneesJSON) => {
								if (!!aDonneesJSON && !!aDonneesJSON.JSONRapportSaisie) {
									const lThemeCree = aDonneesJSON.JSONRapportSaisie.ThemeCree;
									if (!!lThemeCree) {
										aTheme.setNumero(lThemeCree.getNumero());
										if (
											aTheme.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression
										) {
											aTheme.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
										}
										this.donnees.addElement(aTheme);
										this._filtrageSelection();
									}
								}
							},
						).lancerRequete({
							ListeThemes: new ObjetListeElements_1.ObjetListeElements().add(
								aTheme,
							),
						});
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"Theme.titre.nouveauTheme",
						),
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							{
								theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
								libelle:
									ObjetTraduction_1.GTraductions.getValeur("Theme.btn.creer"),
							},
						],
					});
				},
			},
		);
		lFenetre.setDonnees(aParams, {
			matiereContexte: this.matiereContexte,
			listeMatieres: this.listeMatieres,
			enCreation: true,
			tailleLibelleTheme: this.tailleLibelleTheme,
			listeThemes: this.donnees,
		});
	}
}
exports.ObjetFenetre_ListeThemes = ObjetFenetre_ListeThemes;
