exports.ObjetFenetre_Competences = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Competences_1 = require("DonneesListe_Competences");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteListePiliers_1 = require("ObjetRequeteListePiliers");
const TypeReferentielGrilleCompetence_1 = require("TypeReferentielGrilleCompetence");
const ObjetTri_1 = require("ObjetTri");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const TypeCategorieCompetence_1 = require("TypeCategorieCompetence");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_Competences extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = lApplicationSco.getEtatUtilisateur();
		this.avecChoixReferentiel = !this.etatUtilSco.pourPrimaire();
		this.avecAffichageChoixPilier = !this.etatUtilSco.pourPrimaire();
		this.filtreUniquementMesCompetences = false;
	}
	construireInstances() {
		this.identOnglets = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._evenementSurOnglets,
			this._initialiserOnglets,
		);
		this.identComboPalier = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this.evenementSurComboPalier,
			this.initialiserComboPalier,
		);
		this.identComboPilier = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this.evenementSurComboPilier,
			this.initialiserComboPilier,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
			this.initialiserListe,
		);
	}
	composeBas() {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			ObjetTraduction_1.GTraductions.getValeur(
				"competences.TotalElementsCompetencesEvalues",
			),
			" : ",
			IE.jsx.str("span", {
				"ie-html": () => this.getNombreCompetencesCocheesDeTousLesPiliers(),
			}),
		);
	}
	_initialiserOnglets(aInstance) {
		this.listeOnglets = new ObjetListeElements_1.ObjetListeElements();
		let lOnglet;
		lOnglet = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("competences.grilleParDomaine"),
			null,
			TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
				.GR_PilierDeCompetence,
		);
		lOnglet.pourCompetenceNumerique = false;
		this.listeOnglets.addElement(lOnglet);
		lOnglet = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("competences.grilleParMatiere"),
			null,
			TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere,
		);
		lOnglet.pourCompetenceNumerique = false;
		this.listeOnglets.addElement(lOnglet);
		lOnglet = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur(
				"competences.competetencesNumeriques",
			),
			null,
			TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
				.GR_PilierDeCompetence,
		);
		lOnglet.pourCompetenceNumerique = true;
		this.listeOnglets.addElement(lOnglet);
		aInstance.setParametres(this.listeOnglets);
	}
	initialiserComboPalier(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 100,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.listeSelectionPalier",
			),
			celluleAvecTexteHtml: true,
			getContenuCellule: (aPalier) => {
				return this._getLibellePalier(aPalier);
			},
			getContenuElement: (aElement) => {
				return this._getLibellePalier(aElement.element);
			},
		});
	}
	initialiserComboPilier(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 400,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.listeSelectionCompetence",
			),
			celluleAvecTexteHtml: true,
			getContenuCellule: (aPilier) => {
				return this._getLibellePilier(aPilier);
			},
			getContenuElement: (aElement) => {
				return this._getLibellePilier(aElement.element);
			},
		});
	}
	getListeColonnesCompetences(aElement) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Competences_1.DonneesListe_Competences.colonnes.coche,
			taille: 20,
			titre: { estCoche: true },
		});
		if (this.avecColonneNombreRelations) {
			lColonnes.push({
				id: DonneesListe_Competences_1.DonneesListe_Competences.colonnes.nombre,
				taille: 30,
				titre: ObjetTraduction_1.GTraductions.getValeur("competences.nombre"),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"competences.nombreHint",
				),
			});
		}
		lColonnes.push({
			id: DonneesListe_Competences_1.DonneesListe_Competences.colonnes.libelle,
			taille: "100%",
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"competences.competencesConnaissances",
			),
		});
		if (
			this.genreReferentiel ===
			TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere
		) {
			lColonnes.push({
				id: DonneesListe_Competences_1.DonneesListe_Competences.colonnes
					.domaines,
				taille: 70,
				titre: ObjetTraduction_1.GTraductions.getValeur("competences.Domaines"),
			});
		}
		const lAvecNiveau =
			aElement &&
			(aElement.PilierLVE ||
				aElement.categorie ===
					TypeCategorieCompetence_1.TypeCategorieCompetence
						.CompetenceNumerique);
		if (lAvecNiveau === true) {
			lColonnes.push({
				id: DonneesListe_Competences_1.DonneesListe_Competences.colonnes
					.niveauLVE,
				taille: 50,
				titre:
					aElement.categorie ===
					TypeCategorieCompetence_1.TypeCategorieCompetence.CompetenceNumerique
						? ObjetTraduction_1.GTraductions.getValeur("competences.NivCN")
						: ObjetTraduction_1.GTraductions.getValeur("competences.NivLVE"),
				hint:
					aElement.categorie ===
					TypeCategorieCompetence_1.TypeCategorieCompetence.CompetenceNumerique
						? ObjetTraduction_1.GTraductions.getValeur(
								"competences.HintNiveauCN",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.HintNiveauLVE",
							),
			});
		}
		return lColonnes;
	}
	initialiserListe(aInstance) {
		const lBoutonsListe = [];
		if (this.etatUtilSco.pourPrimaire()) {
			const lJsxBoutonFiltreUniquementMesEval = () => {
				return {
					getValue: () => {
						return this.filtreUniquementMesCompetences;
					},
					setValue: (aValue) => {
						this.filtreUniquementMesCompetences = aValue;
						const lListe = this.getInstance(this.identListe);
						lListe
							.getDonneesListe()
							.setAfficherUniquementMesCompetences(
								this.filtreUniquementMesCompetences,
							);
						lListe.actualiser({ conserverSelection: true });
					},
				};
			};
			lBoutonsListe.push({
				getHtml: () =>
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": lJsxBoutonFiltreUniquementMesEval },
						ObjetTraduction_1.GTraductions.getValeur(
							"competences.UniquementMesCompetences",
						),
					),
			});
		}
		lBoutonsListe.push({ genre: ObjetListe_1.ObjetListe.typeBouton.deployer });
		lBoutonsListe.push({
			genre: ObjetListe_1.ObjetListe.typeBouton.rechercher,
		});
		aInstance.setOptionsListe({
			colonnes: this.getListeColonnesCompetences(),
			boutons: lBoutonsListe,
		});
	}
	composeContenu() {
		const T = [];
		if (this.avecChoixReferentiel) {
			T.push('<div id="' + this.getNomInstance(this.identOnglets) + '"></div>');
		}
		T.push('<div class="tabs-contenu InlineBlock" style="width: 600px;">');
		T.push(
			'<div class="InlineBlock PetitEspaceBas Texte10" id="' +
				this.getNomInstance(this.identComboPalier) +
				'"></div>',
		);
		if (this.avecAffichageChoixPilier) {
			T.push(
				'<div class="InlineBlock PetitEspaceBas PetitEspaceGauche Texte10" id="' +
					this.getNomInstance(this.identComboPilier) +
					'"></div>',
			);
		}
		T.push(
			'<div id="' +
				this.getNomInstance(this.identListe) +
				'" style="width: 100%; min-height: 500px;"></div>',
		);
		T.push("</div>");
		return T.join("");
	}
	estOngletVisible(aOnglet) {
		let lOngletEstVisible = false;
		if (this.listePiliers) {
			for (const lPilier of this.listePiliers) {
				if (aOnglet.getGenre() === lPilier.getGenre()) {
					if (
						this.filtreCompetenceNumerique(
							lPilier,
							aOnglet.pourCompetenceNumerique,
						)
					) {
						lOngletEstVisible = true;
						break;
					}
				}
			}
		}
		return lOngletEstVisible;
	}
	filtreCompetenceNumerique(aPilier, aPourCompetenceNumerique) {
		return aPourCompetenceNumerique
			? aPilier.categorie ===
					TypeCategorieCompetence_1.TypeCategorieCompetence.CompetenceNumerique
			: aPilier.categorie !==
					TypeCategorieCompetence_1.TypeCategorieCompetence.CompetenceNumerique;
	}
	setDonnees(aParametres) {
		this.listeCompetencesDEvaluation = aParametres.listeCompetences;
		this.estUnServiceLVE = aParametres.service
			? aParametres.service.estServiceLVE || false
			: false;
		this.listeReferentielsUniques = !!aParametres.optionsContexte
			? aParametres.optionsContexte.listeReferentielsUniques
			: null;
		this.avecDoublonCompetencesInterdit = !!aParametres.optionsContexte
			? aParametres.optionsContexte.avecDoublonCompetencesInterdit
			: null;
		this.avecControleCompetenceLVE = !(
			!!aParametres.optionsContexte &&
			aParametres.optionsContexte.avecControleCompetenceLVE === false
		);
		this.avecColonneNombreRelations = !(
			!!aParametres.optionsContexte &&
			aParametres.optionsContexte.avecColonneNombreRelations === false
		);
		let lQCM = null;
		if (aParametres.qcm) {
			lQCM = aParametres.qcm.toJSON();
			if (aParametres.qcm.matiere) {
				lQCM.matiere = aParametres.qcm.matiere.toJSON();
			}
			if (aParametres.qcm.niveau) {
				lQCM.niveau = aParametres.qcm.niveau.toJSON();
			}
		}
		new ObjetRequeteListePiliers_1.ObjetRequeteListePiliers(
			this,
			this.surRequeteListePiliers,
		).lancerRequete({
			service: aParametres.service,
			ressource: aParametres.classe,
			qcm: lQCM,
		});
	}
	surRequeteListePiliers(aParams) {
		this.listePiliers = aParams.listePiliers;
		this.palierSelected = aParams.PalierParDefaut;
		this.pilierDeCompetenceSelected = aParams.PilierParDefaut;
		this.metaMatiereSelected = aParams.MetaMatiereParDefaut;
		if (!this.listePiliers || this.listePiliers.count() === 0) {
			GApplication.getMessage().afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
				message: aParams.message,
			});
			this.surValidation(0);
			return;
		}
		this.afficher();
		this.actualiserListeCompetencesDePilier();
		let lIndiceOngletASelectionner = -1;
		let lIndiceOngletBoucle = 0;
		for (const lOnglet of this.listeOnglets) {
			const lOngletEstVisible = this.estOngletVisible(lOnglet);
			lOnglet.setActif(lOngletEstVisible);
			if (lOngletEstVisible) {
				if (
					lIndiceOngletASelectionner === -1 ||
					lOnglet.getGenre() ===
						TypeReferentielGrilleCompetence_1.TypeGenreReferentiel
							.GR_Metamatiere
				) {
					lIndiceOngletASelectionner = lIndiceOngletBoucle;
				}
			}
			lIndiceOngletBoucle++;
		}
		this.getInstance(this.identOnglets).setDonnees(
			this.listeOnglets,
			lIndiceOngletASelectionner,
			true,
		);
	}
	_evenementSurOnglets(aOnglet) {
		if (aOnglet) {
			this.getInstance(this.identComboPalier).fermerListe();
			this.getInstance(this.identComboPilier).fermerListe();
			this.genreReferentiel = aOnglet.getGenre();
			const lThis = this,
				lListePaliers = new ObjetListeElements_1.ObjetListeElements(),
				lGenreReferentiel = this.genreReferentiel;
			if (this.listePiliers) {
				this.listePiliers.parcourir((aPilier) => {
					if (lGenreReferentiel === aPilier.getGenre()) {
						if (
							lThis.filtreCompetenceNumerique(
								aPilier,
								aOnglet.pourCompetenceNumerique,
							)
						) {
							if (!lListePaliers.getElementParElement(aPilier.palier)) {
								lListePaliers.addElement(aPilier.palier);
							}
						}
					}
				});
			}
			lListePaliers.trier();
			let lIndicePalier;
			if (!!this.palierSelected) {
				lIndicePalier = lListePaliers.getIndiceParNumeroEtGenre(
					this.palierSelected.getNumero(),
					this.palierSelected.getGenre(),
				);
			}
			if (lIndicePalier === undefined || lIndicePalier === null) {
				lIndicePalier = 0;
			}
			this.getInstance(this.identComboPalier).setDonneesObjetSaisie({
				liste: lListePaliers,
				selection: lIndicePalier,
			});
			this.getInstance(this.identComboPalier).setActif(
				lListePaliers.count() > 1,
			);
			let lEstComboPalierVisible = !aOnglet.pourCompetenceNumerique;
			if (!this.avecAffichageChoixPilier) {
				lEstComboPalierVisible = lListePaliers.count() > 1;
			}
			this.getInstance(this.identComboPalier).setVisible(
				lEstComboPalierVisible,
			);
			if (lListePaliers.count() === 0) {
				this.getInstance(this.identComboPilier).setDonnees();
				this.getInstance(this.identListe).setDonnees();
			}
		}
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.actualiserListeCompetencesDEvaluation();
		this.callback.appel(aNumeroBouton, this.listeCompetencesDEvaluation);
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick: {
				const lListe = this.getInstance(this.identListe);
				lListe
					.getDonneesListe()
					.ajouteOuSupprimeRelationsSurSelection(aParametres, () => {
						lListe.actualiser(true, true);
					});
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition: {
				const lLibellePalier = this._getLibellePalier(this.palierSelected);
				this.getInstance(this.identComboPalier).setContenu(lLibellePalier);
				const lElementSelectionne =
					this.genreReferentiel ===
					TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere
						? this.metaMatiereSelected
						: this.pilierDeCompetenceSelected;
				const lLibellePilier = this._getLibellePilier(lElementSelectionne);
				this.getInstance(this.identComboPilier).setContenu(lLibellePilier);
				break;
			}
		}
	}
	evenementSurComboPalier(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.palierSelected = aParams.element;
			const lGenreReferentiel = this.genreReferentiel;
			const lListePiliers = new ObjetListeElements_1.ObjetListeElements();
			this.listePiliers.parcourir((D) => {
				if (lGenreReferentiel === D.getGenre()) {
					if (D.palier.getNumero() === aParams.element.getNumero()) {
						lListePiliers.addElement(D);
					}
				}
			});
			lListePiliers.trier();
			this.getInstance(this.identComboPilier).setDonneesObjetSaisie({
				liste: lListePiliers,
			});
			const lElementSelectionne =
				lGenreReferentiel ===
				TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere
					? this.metaMatiereSelected
					: this.pilierDeCompetenceSelected;
			this.getInstance(this.identComboPilier).setSelectionParElement(
				lElementSelectionne,
				0,
			);
		}
	}
	evenementSurComboPilier(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (
				this.avecControleCompetenceLVE &&
				aParams.element.PilierLVE === true &&
				this.estUnServiceLVE === false
			) {
				GApplication.getMessage().afficher({
					message: ObjetTraduction_1.GTraductions.getValeur(
						"competences.SaisieImpossibleGrilleLVE",
					),
					callback: () => {
						aParams.element.listeCompetences.parcourir((D) => {
							D.setActif(false);
						});
						this._evenementSurComboPilier(aParams.element);
					},
				});
			} else {
				this._evenementSurComboPilier(aParams.element);
			}
		}
	}
	_evenementSurComboPilier(aElement) {
		if (
			this.genreReferentiel ===
			TypeReferentielGrilleCompetence_1.TypeGenreReferentiel.GR_Metamatiere
		) {
			this.metaMatiereSelected = aElement;
		} else {
			this.pilierDeCompetenceSelected = aElement;
		}
		this.actualiserDeploiementsListeCompetencesDePilier(
			new ObjetListeElements_1.ObjetListeElements().add(aElement),
		);
		const lListe = this.getInstance(this.identListe);
		lListe.setOptionsListe({
			colonnes: this.getListeColonnesCompetences(aElement),
		});
		lListe.setDonnees(
			new DonneesListe_Competences_1.DonneesListe_Competences(
				aElement.listeCompetences,
				{
					avecSousItems: aElement.AvecSousItems,
					pourCompetenceNumerique:
						aElement.categorie ===
						TypeCategorieCompetence_1.TypeCategorieCompetence
							.CompetenceNumerique,
					afficherUniquementMesCompetences: this.filtreUniquementMesCompetences,
				},
			),
		);
	}
	actualiserDeploiementsListeCompetencesDePilier(aListePiliers) {
		let lReferentielUnique;
		if (
			this.listeReferentielsUniques &&
			this.listeReferentielsUniques.count() > 0
		) {
			for (const lRefUniqueTemp of this.listeReferentielsUniques) {
				if (
					lRefUniqueTemp.palier.getNumero() === this.palierSelected.getNumero()
				) {
					lReferentielUnique = lRefUniqueTemp;
					break;
				}
			}
		}
		for (const lPilier of aListePiliers) {
			const lTableauPeres = [];
			let lExisteAuMoinsUnPereDeploye = false;
			lPilier.listeCompetences.parcourir((D) => {
				lTableauPeres[D.getGenre()] = D;
				D.pere =
					lTableauPeres[
						Enumere_Ressource_1.EGenreRessourceUtil.getGenrePereCompetence(
							D.getGenre(),
						)
					];
				if (!!D.pere) {
					D.pere.estUnDeploiement = true;
					D.pere.estDeploye =
						lReferentielUnique && lReferentielUnique.elementSignifiant
							? lReferentielUnique.elementSignifiant.getNumero() ===
								D.pere.getNumero()
							: true;
					if (D.pere.estDeploye) {
						lExisteAuMoinsUnPereDeploye = true;
					}
				}
			});
			if (
				lReferentielUnique &&
				lReferentielUnique.elementSignifiant &&
				!lExisteAuMoinsUnPereDeploye
			) {
				lPilier.listeCompetences.parcourir((D) => {
					if (!D.pere) {
						D.estDeploye = true;
					}
				});
			}
		}
	}
	actualiserListeCompetencesDePilier() {
		let lPere;
		this.actualiserDeploiementsListeCompetencesDePilier(this.listePiliers);
		for (let I = 0; I < this.listePiliers.count(); I++) {
			const lPilier = this.listePiliers.get(I);
			for (let J = 0; J < lPilier.listeCompetences.count(); J++) {
				const lCompetenceDePilier = lPilier.listeCompetences.get(J);
				lCompetenceDePilier.palier = lPilier.palier;
				if (
					lCompetenceDePilier.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Competence
				) {
					lPere = lCompetenceDePilier;
				}
				switch (lCompetenceDePilier.getGenre()) {
					case Enumere_Ressource_1.EGenreRessource.ElementPilier: {
						lCompetenceDePilier.Actif = true;
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.Competence: {
						lCompetenceDePilier.Actif = true;
						break;
					}
					case Enumere_Ressource_1.EGenreRessource.SousItem: {
						lCompetenceDePilier.Actif = true;
						lPere.Actif = true;
						break;
					}
				}
				const lListeCompetencesEvalCorrespondantes =
					this.listeCompetencesDEvaluation.getListeElements((D) => {
						return (
							D &&
							D.egalParNumeroEtGenre(
								lCompetenceDePilier.getNumero(),
								lCompetenceDePilier.getGenre(),
								true,
							)
						);
					});
				lCompetenceDePilier.nombreRelations =
					lListeCompetencesEvalCorrespondantes.count();
				lCompetenceDePilier.nombreCompetencesEvaluees = 0;
				if (lCompetenceDePilier.nombreRelations > 0) {
					lListeCompetencesEvalCorrespondantes.parcourir((D) => {
						if (D.avecEvaluation) {
							lCompetenceDePilier.nombreCompetencesEvaluees++;
						}
					});
				}
			}
		}
	}
	actualiserListeCompetencesDEvaluation() {
		const lThis = this;
		this.listePiliers.parcourir((lPilier) => {
			lPilier.listeCompetences.parcourir((lCompetenceDePilier) => {
				let lExisteCompetenceDEvaluationAvecMemeLibelle = false;
				if (lThis.avecDoublonCompetencesInterdit) {
					lThis.listeCompetencesDEvaluation.parcourir((D) => {
						if (
							D.existe() &&
							lCompetenceDePilier.getLibelle() === D.getLibelle() &&
							(!D.code || lCompetenceDePilier.code === D.code)
						) {
							lExisteCompetenceDEvaluationAvecMemeLibelle = true;
							return true;
						}
					});
				}
				const lListeCompetenceDEvaluation =
					lThis.listeCompetencesDEvaluation.getListeElements((D) => {
						return (
							D &&
							D.egalParNumeroEtGenre(
								lCompetenceDePilier.getNumero(),
								lCompetenceDePilier.getGenre(),
								true,
							)
						);
					});
				if (
					lCompetenceDePilier.nombreRelations !==
					lListeCompetenceDEvaluation.count()
				) {
					if (lCompetenceDePilier.nombreRelations > 0) {
						if (
							lCompetenceDePilier.nombreRelations >
							lListeCompetenceDEvaluation.count()
						) {
							if (!lExisteCompetenceDEvaluationAvecMemeLibelle) {
								const lNombreDElementsCompetenceACreer = Math.max(
									0,
									lCompetenceDePilier.nombreRelations -
										lListeCompetenceDEvaluation.count(),
								);
								if (lNombreDElementsCompetenceACreer > 0) {
									let elementCree;
									for (let k = 0; k < lNombreDElementsCompetenceACreer; k++) {
										elementCree =
											MethodesObjet_1.MethodesObjet.dupliquer(
												lCompetenceDePilier,
											);
										elementCree.pilier = lPilier;
										elementCree.coefficient = 1;
										elementCree.relationESI = new ObjetElement_1.ObjetElement(
											"",
										);
										elementCree.relationESI.setEtat(
											Enumere_Etat_1.EGenreEtat.Creation,
										);
										elementCree.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
										lThis.listeCompetencesDEvaluation.addElement(elementCree);
									}
								}
							}
						} else {
							const lNombreDElementsCompetenceASupprimer = Math.max(
								0,
								lListeCompetenceDEvaluation.count() -
									lCompetenceDePilier.nombreRelations,
							);
							if (lNombreDElementsCompetenceASupprimer > 0) {
								lListeCompetenceDEvaluation.setTri([
									ObjetTri_1.ObjetTri.init("avecEvaluation"),
								]);
								lListeCompetenceDEvaluation.trier();
								for (let i = 0; i < lNombreDElementsCompetenceASupprimer; i++) {
									lListeCompetenceDEvaluation
										.get(i)
										.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								}
							}
						}
					} else {
						lListeCompetenceDEvaluation.parcourir((D) => {
							D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						});
					}
				}
			});
		});
	}
	_getLibellePalier(aPalierConcerne) {
		const lLibelle = [];
		if (!!aPalierConcerne) {
			const lNbCompetencesCochees =
				this.getNombreCompetencesCocheesDUnPalier(aPalierConcerne);
			lLibelle.push("<span");
			if (lNbCompetencesCochees > 0) {
				lLibelle.push(' style="font-weight: bold;"');
			}
			lLibelle.push(">", aPalierConcerne.getLibelle());
			if (lNbCompetencesCochees > 0) {
				lLibelle.push(" (", lNbCompetencesCochees, ")");
			}
			lLibelle.push("</span>");
		}
		return lLibelle.join("");
	}
	_getLibellePilier(aPilierConcerne) {
		const lLibelle = [];
		if (!!aPilierConcerne) {
			const lNbCompetencesCochees =
				this.getNombreCompetencesCocheesDUnPilier(aPilierConcerne);
			lLibelle.push("<span");
			if (lNbCompetencesCochees > 0) {
				lLibelle.push(' style="font-weight:bold;"');
			}
			lLibelle.push(">", aPilierConcerne.getLibelle());
			if (lNbCompetencesCochees > 0) {
				lLibelle.push(" (", lNbCompetencesCochees, ")");
			}
			lLibelle.push("</span>");
		}
		return lLibelle.join("");
	}
	getNombreCompetencesCocheesDUnPalier(aPalier) {
		let lResult = 0;
		this.listePiliers.parcourir((aPilier) => {
			if (this.genreReferentiel === aPilier.getGenre()) {
				if (aPilier.palier.getNumero() === aPalier.getNumero()) {
					lResult += this.getNombreCompetencesCocheesDUnPilier(aPilier);
				}
			}
		});
		return lResult;
	}
	getNombreCompetencesCocheesDUnPilier(aPilier) {
		let lResult = 0;
		if (!!aPilier && aPilier.listeCompetences) {
			aPilier.listeCompetences.parcourir((aCompetenceDePilier) => {
				lResult += aCompetenceDePilier.nombreRelations || 0;
			});
		}
		return lResult;
	}
	getNombreCompetencesCocheesDeTousLesPiliers() {
		let lResult = 0;
		if (this.listePiliers) {
			this.listePiliers.parcourir((aPilier) => {
				lResult += this.getNombreCompetencesCocheesDUnPilier(aPilier);
			});
		}
		return lResult;
	}
}
exports.ObjetFenetre_Competences = ObjetFenetre_Competences;
