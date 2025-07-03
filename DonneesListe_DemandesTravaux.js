exports.DonneesListe_DemandesTravaux = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetMoteurTravaux_1 = require("ObjetMoteurTravaux");
const TypeGenreTravauxIntendance_1 = require("TypeGenreTravauxIntendance");
const Enumere_Espace_1 = require("Enumere_Espace");
const TypeDestinationDemandeTravaux_1 = require("TypeDestinationDemandeTravaux");
const TypeNiveauDUrgence_1 = require("TypeNiveauDUrgence");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetElement_1 = require("ObjetElement");
const MethodesObjet_1 = require("MethodesObjet");
const TypeOrigineCreationAvanceeTravaux_1 = require("TypeOrigineCreationAvanceeTravaux");
const GUID_1 = require("GUID");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesTableau_1 = require("MethodesTableau");
class DonneesListe_DemandesTravaux extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aListeDonneesTravaux, aDonneesComplementaires) {
		super(aListeDonneesTravaux);
		this.callbacks = aDonneesComplementaires.callbacks;
		this.donneesFiltre = aDonneesComplementaires.donneesFiltre;
		this.donneesFiltre.listeEtatsAvancement.insererElement(
			this.getElementTotal(),
			0,
		);
		this.donneesFiltre.listeNatureTvx.insererElement(
			this.getElementTotal(true),
			0,
		);
		this.valeursFiltre = this.getValeurFiltreParDefaut();
		this.setOptions({
			avecEvnt_SelectionClick: true,
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
		});
		this.moteur = new ObjetMoteurTravaux_1.ObjetMoteurTravaux();
	}
	getElementTotal(aLibelleFeminin = false) {
		const lLibelle = aLibelleFeminin
			? ObjetTraduction_1.GTraductions.getValeur("TvxIntendance.Toutes")
			: ObjetTraduction_1.GTraductions.getValeur("TvxIntendance.Tous");
		return new ObjetElement_1.ObjetElement(lLibelle, -1);
	}
	estObjetElementTous(aElement) {
		return aElement && aElement.getNumero() === -1;
	}
	getValeurFiltreParDefaut() {
		const lNiveauxUrgences = [];
		if (this.donneesFiltre.listeNiveauUrgence) {
			for (const lObjNiveauUrgence of this.donneesFiltre.listeNiveauUrgence) {
				lNiveauxUrgences.push(lObjNiveauUrgence.getGenre());
			}
		}
		return {
			afficherMesDemandes: false,
			afficherMesTravaux: false,
			afficherDemandesInternes: true,
			afficherDemandesMairie: true,
			niveauxUrgenceSelectionnes: lNiveauxUrgences,
			listeEtatsAvancementSelectionnes:
				new ObjetListeElements_1.ObjetListeElements().add(
					this.getElementTotal(),
				),
			listeNaturesSelectionnees:
				new ObjetListeElements_1.ObjetListeElements().add(
					this.getElementTotal(true),
				),
		};
	}
	estFiltresParDefaut() {
		const lValeurFiltreParDefaut = this.getValeurFiltreParDefaut();
		let lEstFiltresParDefaut = true;
		if (
			this.valeursFiltre.afficherMesDemandes !==
				lValeurFiltreParDefaut.afficherMesDemandes ||
			this.valeursFiltre.afficherMesTravaux !==
				lValeurFiltreParDefaut.afficherMesTravaux ||
			this.valeursFiltre.afficherDemandesInternes !==
				lValeurFiltreParDefaut.afficherDemandesInternes ||
			this.valeursFiltre.afficherDemandesMairie !==
				lValeurFiltreParDefaut.afficherDemandesMairie ||
			!this.estTableauxNiveauDUrgenceIdentiques(
				this.valeursFiltre.niveauxUrgenceSelectionnes,
				lValeurFiltreParDefaut.niveauxUrgenceSelectionnes,
			) ||
			!this.valeursFiltre.listeEtatsAvancementSelectionnes.listeIdentiqueParElementsOrdonnes(
				lValeurFiltreParDefaut.listeEtatsAvancementSelectionnes,
			) ||
			!this.valeursFiltre.listeNaturesSelectionnees.listeIdentiqueParElementsOrdonnes(
				lValeurFiltreParDefaut.listeNaturesSelectionnees,
			)
		) {
			lEstFiltresParDefaut = false;
		}
		return lEstFiltresParDefaut;
	}
	estTableauxNiveauDUrgenceIdentiques(aTab1, aTab2) {
		return (
			MethodesTableau_1.MethodesTableau.inclus(aTab1, aTab2) &&
			aTab1.length === aTab2.length
		);
	}
	avecBoutonActionLigne(aParams) {
		return (
			!aParams.article.estUnDeploiement && super.avecBoutonActionLigne(aParams)
		);
	}
	getTitreZonePrincipale(aParams) {
		let H = [];
		if (aParams.article.estUnDeploiement) {
			H.push(
				`<div ie-ellipsis>${aParams.article.getLibelle()} (${this.getCompteurFilsDeploiement(aParams.article)})</div>`,
			);
		} else {
			H.push(
				`<div ie-ellipsis class="ie-titre" >${aParams.article.nature ? aParams.article.nature.getLibelle() : ""}</div>`,
			);
		}
		return H.join("");
	}
	estLigneOff(aParams) {
		if (aParams.article.estUnDeploiement) {
			return this.getCompteurFilsDeploiement(aParams.article) === 0;
		}
		return super.estLigneOff(aParams);
	}
	getCompteurFilsDeploiement(aArticle) {
		if (aArticle.estUnDeploiement) {
			if (aArticle.estDestination) {
				const lListeCumulsDeDestination =
					this.getArrayFilsVisiblesDePere(aArticle);
				let Compteur = 0;
				for (let lI = 0; lI < lListeCumulsDeDestination.length; lI++) {
					Compteur += this.getCompteurFilsDeploiement(
						lListeCumulsDeDestination[lI].article,
					);
				}
				return Compteur;
			} else {
				return this.getArrayFilsVisiblesDePere(aArticle).length;
			}
		}
		return 0;
	}
	getInfosSuppZonePrincipale(aParams) {
		let H = [];
		if (aParams.article.estUnDeploiement) {
			return;
		}
		if (aParams.article.dateRealisation) {
			let lDate = ObjetDate_1.GDate.formatDate(
				aParams.article.dateRealisation,
				"%JJ %MMM",
			);
			H.push(
				`<div>${ObjetTraduction_1.GTraductions.getValeur("TvxIntendance.colonne.realisationLe")} ${lDate}</div>`,
			);
		} else {
			H.push(`<div>${aParams.article.etat.getLibelle()}</div>`);
		}
		if (aParams.article.demandeur) {
			H.push(
				IE.jsx.str(
					"div",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.colonne.demandeur",
					),
					" : ",
					aParams.article.demandeur.getLibelle(),
				),
			);
		}
		H.push(`<div ie-ellipsis>${aParams.article.detail || ""}</div>`);
		return H.join("");
	}
	getZoneMessageLarge(aParams) {
		let H = [];
		if (
			MethodesObjet_1.MethodesObjet.isNumeric(aParams.article.niveauDUrgence)
		) {
			const lEstNiveauEleve =
				aParams.article.niveauDUrgence ===
					TypeNiveauDUrgence_1.TypeNiveauDUrgence.Tndu_Eleve ||
				aParams.article.niveauDUrgence ===
					TypeNiveauDUrgence_1.TypeNiveauDUrgence.Tndu_Prioritaire;
			H.push(`<div class="flex-contain justify-end">`);
			H.push(
				`<span class="${lEstNiveauEleve ? "color-red-foncee" : ""}">${TypeNiveauDUrgence_1.TypeNiveauDUrgenceUtil.getLibelle(aParams.article.niveauDUrgence)}</span>`,
			);
			if (lEstNiveauEleve) {
				H.push(
					IE.jsx.str("i", {
						class: "icon_warning_sign color-red-foncee m-x-l",
						title: ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.NiveauDUrgenceEleve",
						),
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.NiveauDUrgenceEleve",
						),
						role: "img",
					}),
				);
			}
			H.push(`</div>`);
		}
		return H.join("");
	}
	getZoneComplementaire(aParams) {
		let H = [];
		if (aParams.article.estUnDeploiement) {
			return;
		}
		if (aParams.article.dateEcheance) {
			let lDate = ObjetDate_1.GDate.formatDate(
				aParams.article.dateEcheance,
				"%Jjj %JJ %MMM",
			);
			H.push(
				`<time class="color-green-foncee" datetime="${ObjetDate_1.GDate.formatDate(aParams.article.dateEcheance, "%MM-%JJ")}">${lDate}</time>`,
			);
			if (
				[
					Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
					Enumere_Espace_1.EGenreEspace.PrimMairie,
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace)
			) {
				if (aParams.article.destination === 1) {
					H.push(
						`<i class="icon_mairie color-green-foncee m-left-l m-y-l" title="${TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux.DDT_Collectivite)}" aria-label="${TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux.DDT_Collectivite)}" role="img"></i>`,
					);
				}
			}
		}
		if (aParams.article.listePJ.count() !== 0) {
			H.push(
				IE.jsx.str("i", {
					class: "icon_piece_jointe color-green-foncee m-y-l",
					title: ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.fenetre.pieceJointe",
					),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.fenetre.pieceJointe",
					),
					role: "img",
				}),
			);
		}
		return H.join("");
	}
	avecEvenementSelectionClick(aParams) {
		if (aParams.article.estCumul) {
			return false;
		}
		if (aParams.article.estUnDeploiement) {
			return;
		}
		return this.options.avecEvnt_SelectionClick;
	}
	construireFiltres() {
		const H = [];
		H.push('<div class="flex-contain cols">');
		if (
			this.moteur.avecDroitExecutant() &&
			!this.moteur.avecDroitUniquementMesDemandesTravaux()
		) {
			const lLibelleCbMesDemandes =
				this.moteur.getGenreTravaux() ===
				TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande
					? ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.Filtre_MesCommandes",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.Filtre_MesDemandes",
						);
			H.push(
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "flex-contain justify-start m-y-l",
						"ie-model": this.jsxModeleCheckboxMesDemandes.bind(this),
					},
					lLibelleCbMesDemandes,
				),
			);
		}
		if (this.moteur.avecDroitDemandeTravaux()) {
			let lLibelleCbMesTravaux = "";
			switch (this.moteur.getGenreTravaux()) {
				case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
					.GTI_Maintenance:
					lLibelleCbMesTravaux = ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Filtre_MesTravaux",
					);
					break;
				case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
					.GTI_Secretariat:
					lLibelleCbMesTravaux = ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Filtre_MesTaches",
					);
					break;
				case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
					.GTI_Informatique:
					lLibelleCbMesTravaux = ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Filtre_MesInterventions",
					);
					break;
				case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
					.GTI_Commande:
					lLibelleCbMesTravaux = ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Filtre_MesCommandes",
					);
					break;
			}
			H.push(
				IE.jsx.str(
					"ie-checkbox",
					{
						class: "flex-contain m-y-l",
						"ie-display": this.avecCheckboxMesTravaux.bind(this),
						"ie-model": this.jsxModeleCheckboxMesTravaux.bind(this),
					},
					lLibelleCbMesTravaux,
				),
			);
		}
		H.push('<div class="m-y-xl flex-contain cols">');
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-y-m" },
				ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.fenetre.niveauUrgence",
				),
			),
		);
		if (this.donneesFiltre.listeNiveauUrgence) {
			this.donneesFiltre.listeNiveauUrgence.parcourir((aUrgence) => {
				H.push(
					IE.jsx.str(
						"ie-checkbox",
						{
							class: "m-y-l",
							"ie-model": this.jsxModeleCheckboxNiveauUrgence.bind(
								this,
								aUrgence,
							),
						},
						aUrgence.getLibelle(),
					),
				);
			});
		}
		H.push("</div>");
		const lIdNature = GUID_1.GUID.getId();
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-y-m" },
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{ id: lIdNature },
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.colonne.nature",
						),
					),
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelNatures.bind(this),
						"aria-labelledby": lIdNature,
					}),
				),
			),
		);
		const lIdAvancement = GUID_1.GUID.getId();
		H.push(
			IE.jsx.str(
				"div",
				{ class: "m-y-m" },
				IE.jsx.str(
					"div",
					{ class: "field-contain label-up" },
					IE.jsx.str(
						"label",
						{ id: lIdAvancement },
						ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.colonne.etatAvancement",
						),
					),
					IE.jsx.str("ie-combo", {
						"ie-model": this.jsxComboModelEtatsAvancement.bind(this),
						"aria-labelledby": lIdAvancement,
					}),
				),
			),
		);
		if (
			[
				Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
				Enumere_Espace_1.EGenreEspace.PrimMairie,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			H.push(
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"div",
						{ class: "m-y-l" },
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "flex-contain justify-between",
								"ie-model": this.jsxModeleCheckboxDemandesInternes.bind(this),
							},
							TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(
								TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
									.DDT_Interne,
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "m-y-l" },
						IE.jsx.str(
							"ie-checkbox",
							{
								class: "flex-contain justify-between",
								"ie-model": this.jsxModeleCheckboxDemandesMairie.bind(this),
							},
							TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(
								TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
									.DDT_Collectivite,
							),
							IE.jsx.str("i", {
								class: "icon_mairie m-left-l",
								title:
									TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(
										TypeDestinationDemandeTravaux_1
											.TypeDestinationDemandeTravaux.DDT_Collectivite,
									),
								"aria-label":
									TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravauxUtil.getLibelle(
										TypeDestinationDemandeTravaux_1
											.TypeDestinationDemandeTravaux.DDT_Collectivite,
									),
								role: "img",
							}),
						),
					),
				),
			);
		}
		H.push("</div>");
		return H.join("");
	}
	actualiserListeEtFiltre(aParams) {
		this.paramsListe.actualiserListe(aParams);
	}
	setModifierSelectionCombo(aElement, aParametresModifie) {
		if (
			aParametresModifie.elementSourceSelectionne &&
			this.estObjetElementTous(aElement) !==
				this.estObjetElementTous(aParametresModifie.elementSource)
		) {
			return false;
		}
	}
	jsxModeleCheckboxMesDemandes() {
		return {
			getValue: () => {
				return this.valeursFiltre.afficherMesDemandes;
			},
			setValue: (aValue) => {
				this.valeursFiltre.afficherMesDemandes = aValue;
				this.actualiserListeEtFiltre();
			},
		};
	}
	avecCheckboxMesTravaux() {
		return (
			this.getNbrLignes() > 0 &&
			this.Donnees.getIndiceElementParFiltre(this.filtreMesTravaux.bind(this)) >
				-1
		);
	}
	jsxModeleCheckboxMesTravaux() {
		return {
			getValue: () => {
				return this.valeursFiltre.afficherMesTravaux;
			},
			setValue: (aValue) => {
				this.valeursFiltre.afficherMesTravaux = aValue;
				this.actualiserListeEtFiltre();
			},
		};
	}
	jsxModeleCheckboxNiveauUrgence(aUrgence) {
		return {
			getValue: () => {
				return this.valeursFiltre.niveauxUrgenceSelectionnes.includes(
					aUrgence.getGenre(),
				);
			},
			setValue: (aValue) => {
				const lEstNiveauUrgenceSelectionne =
					this.valeursFiltre.niveauxUrgenceSelectionnes.includes(
						aUrgence.getGenre(),
					);
				if (!aValue && lEstNiveauUrgenceSelectionne) {
					this.valeursFiltre.niveauxUrgenceSelectionnes.splice(
						this.valeursFiltre.niveauxUrgenceSelectionnes.indexOf(
							aUrgence.getGenre(),
						),
						1,
					);
				} else if (aValue && !lEstNiveauUrgenceSelectionne) {
					this.valeursFiltre.niveauxUrgenceSelectionnes.push(
						aUrgence.getGenre(),
					);
				}
				this.actualiserListeEtFiltre();
			},
		};
	}
	jsxModeleCheckboxDemandesInternes() {
		return {
			getValue: () => {
				return this.valeursFiltre.afficherDemandesInternes;
			},
			setValue: (aValue) => {
				this.valeursFiltre.afficherDemandesInternes = aValue;
				this.actualiserListeEtFiltre();
			},
		};
	}
	jsxModeleCheckboxDemandesMairie() {
		return {
			getValue: () => {
				return this.valeursFiltre.afficherDemandesMairie;
			},
			setValue: (aValue) => {
				this.valeursFiltre.afficherDemandesMairie = aValue;
				this.actualiserListeEtFiltre();
			},
		};
	}
	jsxComboModelEtatsAvancement() {
		return {
			init: (aCombo) => {
				const lListeSelections =
					this.donneesFiltre.listeEtatsAvancement.getListeElements(
						(aEtat) =>
							!!this.valeursFiltre.listeEtatsAvancementSelectionnes.getElementParNumero(
								aEtat.getNumero(),
							),
					);
				aCombo.setDonneesObjetSaisie({
					liste: this.donneesFiltre.listeEtatsAvancement,
					selection: lListeSelections,
					options: {
						longueur: "100%",
						hauteur: 16,
						hauteurLigneDefault: 16,
						multiSelection: true,
						getInfosElementCB: (aElement) => {
							return {
								setModifierSelection: (aParametresModifie) =>
									this.setModifierSelectionCombo(aElement, aParametresModifie),
							};
						},
					},
				});
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.listeSelections
				) {
					this.valeursFiltre.listeEtatsAvancementSelectionnes =
						aParams.listeSelections;
					this.actualiserListeEtFiltre();
				}
			},
		};
	}
	jsxComboModelNatures() {
		return {
			init: (aCombo) => {
				const lListeSelections =
					this.donneesFiltre.listeNatureTvx.getListeElements(
						(aEtat) =>
							!!this.valeursFiltre.listeNaturesSelectionnees.getElementParNumero(
								aEtat.getNumero(),
							),
					);
				aCombo.setDonneesObjetSaisie({
					liste: this.donneesFiltre.listeNatureTvx,
					selection: lListeSelections,
					options: {
						longueur: "100%",
						hauteur: 16,
						hauteurLigneDefault: 16,
						multiSelection: true,
						getInfosElementCB: (aElement) => {
							return {
								setModifierSelection: (aParametresModifie) =>
									this.setModifierSelectionCombo(aElement, aParametresModifie),
							};
						},
					},
				});
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.listeSelections
				) {
					this.valeursFiltre.listeNaturesSelectionnees =
						aParams.listeSelections;
					this.actualiserListeEtFiltre();
				}
			},
		};
	}
	getVisible(aArticle) {
		let lEstVisible = false;
		if (aArticle.estUnDeploiement) {
			lEstVisible = true;
		} else {
			lEstVisible = true;
			if (
				this.valeursFiltre.afficherMesDemandes &&
				!this.moteur.estDemandeur(aArticle)
			) {
				lEstVisible = false;
			} else if (
				this.valeursFiltre.afficherMesTravaux &&
				!this.filtreMesTravaux(aArticle)
			) {
				lEstVisible = false;
			} else if (
				!this.valeursFiltre.afficherDemandesInternes &&
				aArticle.destination ===
					TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
						.DDT_Interne
			) {
				lEstVisible = false;
			} else if (
				!this.valeursFiltre.afficherDemandesMairie &&
				aArticle.destination ===
					TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux
						.DDT_Collectivite
			) {
				lEstVisible = false;
			} else if (
				!this.valeursFiltre.niveauxUrgenceSelectionnes.includes(
					aArticle.niveauDUrgence,
				)
			) {
				lEstVisible = false;
			} else {
				let lAccepteNature = false;
				if (this.valeursFiltre.listeNaturesSelectionnees) {
					for (const lNatureSelectionnee of this.valeursFiltre
						.listeNaturesSelectionnees) {
						if (this.estObjetElementTous(lNatureSelectionnee)) {
							lAccepteNature = true;
						} else {
							lAccepteNature =
								aArticle.nature.getNumero() === lNatureSelectionnee.getNumero();
						}
						if (lAccepteNature) {
							break;
						}
					}
				}
				if (!lAccepteNature) {
					lEstVisible = false;
				}
				if (lEstVisible) {
					let lAccepteEtatAvancement = false;
					if (this.valeursFiltre.listeEtatsAvancementSelectionnes) {
						for (const lEtatAvancementSelectionne of this.valeursFiltre
							.listeEtatsAvancementSelectionnes) {
							if (this.estObjetElementTous(lEtatAvancementSelectionne)) {
								lAccepteEtatAvancement = true;
							} else {
								lAccepteEtatAvancement =
									aArticle.etat.getNumero() ===
									lEtatAvancementSelectionne.getNumero();
							}
							if (lAccepteEtatAvancement) {
								break;
							}
						}
					}
					if (!lAccepteEtatAvancement) {
						lEstVisible = false;
					}
				}
			}
		}
		return lEstVisible;
	}
	filtreMesTravaux(aArticle) {
		return (
			this.moteur.estExecutant(aArticle) &&
			aArticle.etat.getGenre() !==
				TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
					.OCAT_Refuse
		);
	}
	transfererMission(aArticle) {
		let lTypeTransfertDe = "";
		let lTypeTransfertVers = "";
		let lNouveauGenre;
		switch (this.moteur.getGenreTravaux()) {
			case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
				.GTI_Maintenance:
				lTypeTransfertDe = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.Type.TravauxEntretien",
				);
				lTypeTransfertVers = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.Type.MaintenanceInformatique",
				);
				lNouveauGenre =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Informatique;
				break;
			case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
				.GTI_Informatique:
				lTypeTransfertDe = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.Type.MaintenanceInformatique",
				);
				lTypeTransfertVers = ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.Type.TravauxEntretien",
				);
				lNouveauGenre =
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
						.GTI_Maintenance;
				break;
		}
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			message: ObjetTraduction_1.GTraductions.getValeur(
				"TvxIntendance.ConfirmationTransferer",
				[lTypeTransfertDe, lTypeTransfertVers],
			),
			callback: (aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					aArticle.Genre = lNouveauGenre;
					aArticle.nouveauGenreTravaux = true;
					if (this.callbacks.callbackTransfererMission) {
						this.callbacks.callbackTransfererMission(aArticle);
					}
				}
			},
		});
	}
	reinitFiltres() {
		this.valeursFiltre = this.getValeurFiltreParDefaut();
		this.actualiserListeEtFiltre({ conserverSelection: false });
	}
	avecMenuContextuel() {
		return true;
	}
	initialisationObjetContextuel(aParams) {
		if (
			!aParams.menuContextuel ||
			aParams.article.estUnDeploiement ||
			!aParams.article
		) {
			return;
		}
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			true,
			() => {
				if (this.callbacks.callbackModifierDemande) {
					this.callbacks.callbackModifierDemande(aParams.article);
				}
			},
			{ icon: "icon_pencil" },
		);
		if (this.moteur.avecDroitTransfert()) {
			let lTypeTransfertVers = "";
			switch (this.moteur.getGenreTravaux()) {
				case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
					.GTI_Maintenance:
					lTypeTransfertVers = ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Type.MaintenanceInformatique",
					);
					break;
				case TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance
					.GTI_Informatique:
					lTypeTransfertVers = ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.Type.TravauxEntretien",
					);
					break;
			}
			aParams.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.TransfererVers",
					[lTypeTransfertVers],
				),
				true,
				() => {
					this.transfererMission(aParams.article);
				},
				{ icon: "icon_arrow_right" },
			);
		}
		if (this.moteur.avecDroitExecutant()) {
			aParams.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur("Dupliquer"),
				true,
				() => {
					if (this.callbacks.callbackDupliquerDemande) {
						this.callbacks.callbackDupliquerDemande(aParams.article);
					}
				},
				{ icon: "icon_dupliquer" },
			);
		}
		aParams.menuContextuel.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			this.moteur.estIdentificationEditable(aParams.article),
			async () => {
				if (this.callbacks.callbackSupprimerDemande) {
					const lReponse = await GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: this.moteur.getMessageSuppression(),
					});
					if (lReponse === Enumere_Action_1.EGenreAction.Valider) {
						this.callbacks.callbackSupprimerDemande(aParams.article);
					}
				}
			},
			{ icon: "icon_trash" },
		);
		aParams.menuContextuel.setDonnees();
	}
}
exports.DonneesListe_DemandesTravaux = DonneesListe_DemandesTravaux;
