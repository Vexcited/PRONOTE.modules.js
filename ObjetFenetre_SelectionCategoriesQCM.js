exports.ObjetFenetre_SelectionCategoriesQCM = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetRequeteSaisieEtiquettesQCM_1 = require("ObjetRequeteSaisieEtiquettesQCM");
const ObjetElement_1 = require("ObjetElement");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetFenetre_SelecteurCouleur_1 = require("ObjetFenetre_SelecteurCouleur");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetIndexsUnique_1 = require("ObjetIndexsUnique");
const GUID_1 = require("GUID");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_SelectionCategoriesQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CategoriesQCM.SelectionnerCategories",
			),
			largeur: 400,
			hauteur: 500,
		});
		this.avecCochesSelection = false;
		this.avecModification = false;
	}
	construireInstances() {
		this.identListeEtiquettesQCM = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeEtiquettesQCM,
			this._initialiserListeEtiquettesQCM,
		);
	}
	setDonnees(aListeEtiquettesQCM, aParams = {}) {
		this.avecModification = false;
		const lListeEtiquettesSelectionnees = !!aParams
			? aParams.listeEtiquettesSelectionnees
			: null;
		this.avecCochesSelection = !!aParams ? aParams.avecCocheSelection : false;
		const lListeBoutonsFenetre = [];
		if (this.avecCochesSelection) {
			lListeBoutonsFenetre.push(
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			);
		} else {
			lListeBoutonsFenetre.push(
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			);
		}
		this.setOptionsFenetre({ listeBoutons: lListeBoutonsFenetre });
		this.afficher();
		const lListeEtiquettesQCM = aListeEtiquettesQCM;
		aListeEtiquettesQCM.parcourir((aEtiquette) => {
			aEtiquette.estCoche =
				!!lListeEtiquettesSelectionnees &&
				!!lListeEtiquettesSelectionnees.getElementParNumero(
					aEtiquette.getNumero(),
				);
		});
		this.getInstance(this.identListeEtiquettesQCM).setDonnees(
			new DonneesListe_EditionEtiquettesQCM(lListeEtiquettesQCM, {
				avecCochesSelection: this.avecCochesSelection,
				callbackEdition: this._callbackEditionCategorie.bind(this),
				callbackSuppression: this._callbackSuppressionCategorie.bind(this),
			}),
		);
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", {
					id: this.getInstance(this.identListeEtiquettesQCM).getNom(),
					style: "width: 100%; height: 100%",
				}),
			),
		);
		return T.join("");
	}
	_lancerSaisie(aNomCommande, aEtiquette) {
		this.avecModification = true;
		new ObjetRequeteSaisieEtiquettesQCM_1.ObjetRequeteSaisieEtiquettesQCM(
			this,
			(aDonneesJSON) => {
				if (
					!!aDonneesJSON &&
					!!aDonneesJSON.JSONRapportSaisie &&
					!!aDonneesJSON.JSONRapportSaisie.etiquetteCreee
				) {
					const lEtiquetteCreee = aDonneesJSON.JSONRapportSaisie.etiquetteCreee;
					if (!!lEtiquetteCreee) {
						aEtiquette.setNumero(lEtiquetteCreee.getNumero());
					}
				}
				if (aEtiquette.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
					aEtiquette.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
				}
			},
		).lancerRequete(aNomCommande, aEtiquette);
	}
	surValidation(aNumeroBouton) {
		let lListeEtiquettesCochees = null;
		const lListeEtiquettes = this.getInstance(
			this.identListeEtiquettesQCM,
		).getDonneesListe().Donnees;
		if (aNumeroBouton === 1 && this.avecCochesSelection) {
			if (!!lListeEtiquettes) {
				lListeEtiquettesCochees = lListeEtiquettes.getListeElements(
					(aEtiquette) => {
						const lEstCochee = !!aEtiquette.estCoche;
						if (lEstCochee) {
							aEtiquette.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
						return lEstCochee;
					},
				);
			}
		}
		const lParamsCallback = {
			avecModification: this.avecModification,
			listeToutesEtiquettes: null,
			etiquettesCochees: null,
		};
		if (this.avecModification) {
			lParamsCallback.listeToutesEtiquettes = lListeEtiquettes;
		}
		if (!!lListeEtiquettesCochees) {
			lParamsCallback.etiquettesCochees = lListeEtiquettesCochees;
		}
		this.callback.appel(aNumeroBouton, lParamsCallback);
		this.fermer();
	}
	_initialiserListeEtiquettesQCM(aInstance) {
		aInstance.setOptionsListe({
			avecLigneCreation: true,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
	_evenementListeEtiquettesQCM(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation: {
				const lNouvelleEtiquette = ObjetElement_1.ObjetElement.create({
					Libelle: "",
					couleur: "#000000",
				});
				this.ouvrirFenetreEditionCategorieQCM(lNouvelleEtiquette);
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.ouvrirFenetreEditionCategorieQCM(aParams.article);
				break;
		}
	}
	_callbackEditionCategorie(aCategorieQCM) {
		this.ouvrirFenetreEditionCategorieQCM(aCategorieQCM);
	}
	_callbackSuppressionCategorie(aCategorieQCM) {
		if (aCategorieQCM) {
			const lThis = this;
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"liste.suppressionSelection",
					),
					callback(aGenreAction) {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							aCategorieQCM.estCoche = false;
							aCategorieQCM.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							lThis._lancerSaisie(
								ObjetRequeteSaisieEtiquettesQCM_1
									.ObjetRequeteSaisieEtiquettesQCM.CommandeRequete
									.SupprimerEtiquette,
								aCategorieQCM,
							);
							lThis.getInstance(lThis.identListeEtiquettesQCM).actualiser();
						}
					},
				});
		}
	}
	ouvrirFenetreEditionCategorieQCM(aCategorieQCM) {
		const lInstanceListe = this.getInstance(this.identListeEtiquettesQCM);
		const lListeToutesCategoris = lInstanceListe.getDonneesListe().Donnees;
		const lFenetreEditionCategorieQCM =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_EditionCategorieQCM,
				{
					pere: this,
					evenement(aNumeroBouton, aCategorieQCM) {
						if (aNumeroBouton === 1) {
							if (aCategorieQCM && aCategorieQCM.pourValidation()) {
								if (
									aCategorieQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
								) {
									this._lancerSaisie(
										ObjetRequeteSaisieEtiquettesQCM_1
											.ObjetRequeteSaisieEtiquettesQCM.CommandeRequete
											.CreerEtiquette,
										aCategorieQCM,
									);
									lListeToutesCategoris.addElement(aCategorieQCM);
								} else {
									this._lancerSaisie(
										ObjetRequeteSaisieEtiquettesQCM_1
											.ObjetRequeteSaisieEtiquettesQCM.CommandeRequete
											.ModifierEtiquette,
										aCategorieQCM,
									);
								}
								lInstanceListe.actualiser();
							}
						}
					},
					initialiser(aInstanceFenetre) {
						let lTitreFenetre;
						if (aCategorieQCM.existeNumero()) {
							lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
								"CategoriesQCM.ModifierCategorie",
							);
						} else {
							lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
								"CategoriesQCM.CreerCategorie",
							);
						}
						aInstanceFenetre.setOptionsFenetre({ titre: lTitreFenetre });
					},
				},
			);
		lFenetreEditionCategorieQCM.setDonneesCategorieQCM(
			aCategorieQCM,
			lListeToutesCategoris,
		);
	}
}
exports.ObjetFenetre_SelectionCategoriesQCM =
	ObjetFenetre_SelectionCategoriesQCM;
class DonneesListe_EditionEtiquettesQCM extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.callbackEdition = aParams.callbackEdition;
		this.callbackSuppression = aParams.callbackSuppression;
		this.setOptions({
			avecEvnt_Creation: true,
			avecCB: !!aParams.avecCochesSelection,
			avecCocheCBSurLigne: true,
		});
	}
	getTitreZonePrincipale(aParams) {
		const H = [];
		H.push(
			UtilitaireQCM_1.UtilitaireQCM.dessineIconeCategorieQCM(
				aParams.article.couleur,
				aParams.article.abr,
			),
		);
		H.push('<span class="m-left">', aParams.article.getLibelle(), "</span>");
		return H.join("");
	}
	avecBoutonActionLigne(aParams) {
		return !!aParams.article;
	}
	avecMenuContextuel(aParams) {
		return this.avecBoutonActionLigne(aParams);
	}
	remplirMenuContextuel(aParams) {
		const lThis = this;
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			true,
			() => {
				if (lThis.callbackEdition) {
					lThis.callbackEdition(aParams.article);
				}
			},
			{ icon: "icon_pencil" },
		);
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			true,
			() => {
				if (lThis.callbackSuppression) {
					lThis.callbackSuppression(aParams.article);
				}
			},
			{ icon: "icon_trash" },
		);
	}
	getValueCB(aParams) {
		return aParams.article ? aParams.article.estCoche : false;
	}
	setValueCB(aParams, aValue) {
		aParams.article.estCoche = aValue;
	}
}
class ObjetFenetre_EditionCategorieQCM extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = { categorieQCM: null, listeToutesCategories: null };
		this.setOptionsFenetre({
			largeur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecCroixFermeture: false,
		});
		this._indexsUnique = new ObjetIndexsUnique_1.ObjetIndexsUnique();
		this._indexsUnique.ajouterIndex(["Libelle"]);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleCategorie: {
				getValue() {
					return aInstance.donnees.categorieQCM
						? aInstance.donnees.categorieQCM.getLibelle()
						: "";
				},
				setValue(aValue) {
					if (aInstance.donnees.categorieQCM) {
						const lValue = aValue ? aValue.trim() : "";
						aInstance.donnees.categorieQCM.setLibelle(lValue);
						aInstance.donnees.categorieQCM.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			getAbreviationCategorie: {
				getValue() {
					return aInstance.donnees.categorieQCM
						? aInstance.donnees.categorieQCM.abr || ""
						: "";
				},
				setValue(aValue) {
					if (aInstance.donnees.categorieQCM) {
						aInstance.donnees.categorieQCM.abr = aValue;
						aInstance.donnees.categorieQCM.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
					}
				},
			},
			getCouleurCategorie() {
				if (aInstance.donnees.categorieQCM) {
					return UtilitaireQCM_1.UtilitaireQCM.dessineIconeCategorieQCM(
						aInstance.donnees.categorieQCM.couleur,
					);
				}
				return "";
			},
			nodeChampCouleur() {
				$(this.node).eventValidation(() => {
					const lCategorie = aInstance.donnees.categorieQCM;
					const lFenetreChoixCouleur =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelecteurCouleur_1.ObjetFenetre_SelecteurCouleur,
							{
								pere: aInstance,
								evenement(aGenreBouton, aCouleur) {
									if (aGenreBouton === 1) {
										if (lCategorie.couleur !== aCouleur) {
											lCategorie.couleur = aCouleur;
											lCategorie.setEtat(
												Enumere_Etat_1.EGenreEtat.Modification,
											);
										}
									}
								},
							},
						);
					lFenetreChoixCouleur.setDonnees(lCategorie.couleur);
				});
			},
		});
	}
	composeContenu() {
		const lLargeurLabels = "5rem;";
		const lIdNom = GUID_1.GUID.getId();
		const lIdAbr = GUID_1.GUID.getId();
		const lIdCou = GUID_1.GUID.getId();
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ for: lIdNom, style: "min-width:" + lLargeurLabels },
					ObjetTraduction_1.GTraductions.getValeur("CategoriesQCM.Nom"),
				),
				IE.jsx.str("input", {
					id: lIdNom,
					type: "text",
					class: "full-width",
					"ie-model": "getLibelleCategorie",
					maxlength: "1000",
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ for: lIdAbr, style: "min-width:" + lLargeurLabels },
					ObjetTraduction_1.GTraductions.getValeur("CategoriesQCM.Abreviation"),
				),
				IE.jsx.str("input", {
					id: lIdAbr,
					type: "text",
					class: "full-width",
					"ie-model": "getAbreviationCategorie",
					maxlength: "1",
				}),
			),
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ id: lIdCou, style: "min-width:" + lLargeurLabels },
					ObjetTraduction_1.GTraductions.getValeur("CategoriesQCM.Couleur"),
				),
				IE.jsx.str("div", {
					"aria-labelledby": lIdCou,
					"ie-html": "getCouleurCategorie",
					class: "like-input as-color-picker",
					"ie-node": "nodeChampCouleur",
					tabindex: "0",
				}),
			),
		);
	}
	setDonneesCategorieQCM(aCategorieQCM, aListeToutesCategoriesQCM) {
		this.donnees.categorieQCM = aCategorieQCM;
		this.donnees.listeToutesCategories = aListeToutesCategoriesQCM;
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			if (!this.donnees.categorieQCM.getLibelle()) {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CategoriesQCM.LibelleObligatoire",
						),
					});
				return;
			}
			let lTestLibelleExisteDeja = false;
			if (this.donnees.listeToutesCategories) {
				const lCategorieSaisi = this.donnees.categorieQCM;
				this.donnees.listeToutesCategories.parcourir((aCategorie) => {
					if (
						!aCategorie.egalParNumeroEtGenre(
							lCategorieSaisi.getNumero(),
							lCategorieSaisi.getGenre(),
						) &&
						aCategorie.Etat !== Enumere_Etat_1.EGenreEtat.Suppression
					) {
						if (this._indexsUnique.estDoublon(lCategorieSaisi, aCategorie)) {
							lTestLibelleExisteDeja = true;
							return false;
						}
					}
				});
			}
			if (lTestLibelleExisteDeja) {
				const lMessageDoublon = ObjetTraduction_1.GTraductions.getValeur(
					"liste.doublonNom",
					[this.donnees.categorieQCM.getLibelle()],
				);
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: lMessageDoublon,
					});
				return;
			}
			this.callback.appel(aNumeroBouton, this.donnees.categorieQCM);
			this.fermer();
		} else {
			this.fermer();
		}
	}
}
