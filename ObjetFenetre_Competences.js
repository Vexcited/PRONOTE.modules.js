const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { ObjetTabOnglets } = require("ObjetTabOnglets.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Competences } = require("DonneesListe_Competences.js");
const {
	EGenreRessource,
	EGenreRessourceUtil,
} = require("Enumere_Ressource.js");
const { ObjetRequeteListePiliers } = require("ObjetRequeteListePiliers.js");
const { TypeGenreReferentiel } = require("TypeReferentielGrilleCompetence.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { TypeCategorieCompetence } = require("TypeCategorieCompetence.js");
class ObjetFenetre_Competences extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.avecChoixReferentiel = !GEtatUtilisateur.pourPrimaire();
		this.avecAffichageChoixPilier = !GEtatUtilisateur.pourPrimaire();
	}
	construireInstances() {
		this.identOnglets = this.add(
			ObjetTabOnglets,
			this._evenementSurOnglets,
			this._initialiserOnglets,
		);
		this.identComboPalier = this.add(
			ObjetSaisie,
			this.evenementSurComboPalier,
			this.initialiserComboPalier,
		);
		this.identComboPilier = this.add(
			ObjetSaisie,
			this.evenementSurComboPilier,
			this.initialiserComboPilier,
		);
		this.identListe = this.add(
			ObjetListe,
			this._evenementSurListe,
			this.initialiserListe,
		);
	}
	composeBas() {
		const H = [];
		H.push(
			GTraductions.getValeur("competences.TotalElementsCompetencesEvalues"),
			' : <span ie-html="nbElementsCompetencesCoches"></span>',
		);
		return H.join("");
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			nbElementsCompetencesCoches: function () {
				return getNombreCompetencesCocheesDeTousLesPiliers.call(aInstance);
			},
		});
	}
	_initialiserOnglets(aInstance) {
		this.listeOnglets = new ObjetListeElements();
		let lOnglet;
		lOnglet = new ObjetElement(
			GTraductions.getValeur("competences.grilleParDomaine"),
			null,
			TypeGenreReferentiel.GR_PilierDeCompetence,
		);
		lOnglet.pourCompetenceNumerique = false;
		this.listeOnglets.addElement(lOnglet);
		lOnglet = new ObjetElement(
			GTraductions.getValeur("competences.grilleParMatiere"),
			null,
			TypeGenreReferentiel.GR_Metamatiere,
		);
		lOnglet.pourCompetenceNumerique = false;
		this.listeOnglets.addElement(lOnglet);
		lOnglet = new ObjetElement(
			GTraductions.getValeur("competences.competetencesNumeriques"),
			null,
			TypeGenreReferentiel.GR_PilierDeCompetence,
		);
		lOnglet.pourCompetenceNumerique = true;
		this.listeOnglets.addElement(lOnglet);
		aInstance.setParametres(this.listeOnglets);
	}
	initialiserComboPalier(aInstance) {
		const lThis = this;
		aInstance.controleur.getLibellePalier = function (aNumeroPalier) {
			let lPalierConcerne;
			if (lThis.listePiliers) {
				const lGenreReferentiel = lThis.genreReferentiel;
				lThis.listePiliers.parcourir((aPilier) => {
					if (
						lGenreReferentiel === aPilier.getGenre() &&
						!!aPilier.palier &&
						aPilier.palier.getNumero() === aNumeroPalier
					) {
						lPalierConcerne = aPilier.palier;
						return false;
					}
				});
			}
			return _getLibellePalier.call(lThis, lPalierConcerne);
		};
		aInstance.setOptionsObjetSaisie({
			longueur: 100,
			labelWAICellule: GTraductions.getValeur("WAI.listeSelectionPalier"),
			celluleAvecTexteHtml: true,
			getContenuCellule: function (aPalier) {
				return _getLibellePalier.call(lThis, aPalier);
			},
		});
	}
	initialiserComboPilier(aInstance) {
		const lThis = this;
		aInstance.controleur.getLibellePilier = function (
			aNumeroPalier,
			aNumeroPilier,
		) {
			let lPilierConcerne;
			if (lThis.listePiliers) {
				const lGenreReferentiel = lThis.genreReferentiel;
				lThis.listePiliers.parcourir((aPilier) => {
					if (
						lGenreReferentiel === aPilier.getGenre() &&
						!!aPilier.palier &&
						aPilier.palier.getNumero() === aNumeroPalier &&
						aPilier.getNumero() === aNumeroPilier
					) {
						lPilierConcerne = aPilier;
						return false;
					}
				});
			}
			return _getLibellePilier.call(lThis, lPilierConcerne);
		};
		aInstance.setOptionsObjetSaisie({
			longueur: 400,
			labelWAICellule: GTraductions.getValeur("WAI.listeSelectionCompetence"),
			celluleAvecTexteHtml: true,
			getContenuCellule: function (aPilier) {
				return _getLibellePilier.call(lThis, aPilier);
			},
		});
	}
	getListeColonnesCompetences(aElement) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_Competences.colonnes.coche,
			taille: 20,
			titre: { estCoche: true },
		});
		if (this.avecColonneNombreRelations) {
			lColonnes.push({
				id: DonneesListe_Competences.colonnes.nombre,
				taille: 30,
				titre: GTraductions.getValeur("competences.nombre"),
				hint: GTraductions.getValeur("competences.nombreHint"),
			});
		}
		lColonnes.push({
			id: DonneesListe_Competences.colonnes.libelle,
			taille: "100%",
			titre: GTraductions.getValeur("competences.competencesConnaissances"),
		});
		if (this.genreReferentiel === TypeGenreReferentiel.GR_Metamatiere) {
			lColonnes.push({
				id: DonneesListe_Competences.colonnes.domaines,
				taille: 70,
				titre: GTraductions.getValeur("competences.Domaines"),
			});
		}
		const lAvecNiveau =
			aElement &&
			(aElement.PilierLVE ||
				aElement.categorie === TypeCategorieCompetence.CompetenceNumerique);
		if (lAvecNiveau === true) {
			lColonnes.push({
				id: DonneesListe_Competences.colonnes.niveauLVE,
				taille: 50,
				titre:
					aElement.categorie === TypeCategorieCompetence.CompetenceNumerique
						? GTraductions.getValeur("competences.NivCN")
						: GTraductions.getValeur("competences.NivLVE"),
				hint:
					aElement.categorie === TypeCategorieCompetence.CompetenceNumerique
						? GTraductions.getValeur("competences.HintNiveauCN")
						: GTraductions.getValeur("competences.HintNiveauLVE"),
			});
		}
		return lColonnes;
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			colonnes: this.getListeColonnesCompetences(),
			boutons: [
				{ genre: ObjetListe.typeBouton.deployer },
				{ genre: ObjetListe.typeBouton.rechercher },
			],
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
		let lResult = false;
		const lThis = this,
			lOnglet = aOnglet;
		if (this.listePiliers) {
			this.listePiliers.parcourir((aPilier) => {
				if (!lResult) {
					if (lOnglet.getGenre() === aPilier.getGenre()) {
						if (
							lThis.filtreCompetenceNumerique(
								aPilier,
								lOnglet.pourCompetenceNumerique,
							)
						) {
							lResult = true;
						}
					}
				}
			});
		}
		return lResult;
	}
	filtreCompetenceNumerique(aPilier, aPourCompetenceNumerique) {
		return aPourCompetenceNumerique
			? aPilier.categorie === TypeCategorieCompetence.CompetenceNumerique
			: aPilier.categorie !== TypeCategorieCompetence.CompetenceNumerique;
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
		new ObjetRequeteListePiliers(
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
				type: EGenreBoiteMessage.Information,
				message: aParams.message,
			});
			this.surValidation(0);
			return;
		}
		this.afficher();
		this.actualiserListeCompetencesDePilier();
		let lIndiceOngletASelectionner = -1;
		const lThis = this;
		this.listeOnglets.parcourir((aOnglet, aIndiceOnglet) => {
			const lOngletEstVisible = lThis.estOngletVisible(aOnglet);
			aOnglet.setActif(lOngletEstVisible);
			if (lOngletEstVisible) {
				if (
					lIndiceOngletASelectionner === -1 ||
					aOnglet.getGenre() === TypeGenreReferentiel.GR_Metamatiere
				) {
					lIndiceOngletASelectionner = aIndiceOnglet;
				}
			}
		});
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
				lListePaliers = new ObjetListeElements(),
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
								aPilier.palier.libelleHtml =
									"<span ie-html=\"getLibellePalier('" +
									aPilier.palier.getNumero() +
									"')\"></span>";
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
			this.getInstance(this.identComboPalier).setDonnees(
				lListePaliers,
				lIndicePalier,
			);
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
	surValidation(ANumeroBouton) {
		this.fermer();
		this.actualiserListeCompetencesDEvaluation();
		this.callback.appel(ANumeroBouton, this.listeCompetencesDEvaluation);
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.SelectionClick: {
				const lListe = this.getInstance(this.identListe);
				lListe
					.getDonneesListe()
					.ajouteOuSupprimeRelationsSurSelection(aParametres, () => {
						lListe.actualiser(true, true);
					});
				break;
			}
			case EGenreEvenementListe.ApresEdition: {
				const lLibellePalier = _getLibellePalier.call(
					this,
					this.palierSelected,
				);
				this.getInstance(this.identComboPalier).setContenu(lLibellePalier);
				const lElementSelectionne =
					this.genreReferentiel === TypeGenreReferentiel.GR_Metamatiere
						? this.metaMatiereSelected
						: this.pilierDeCompetenceSelected;
				const lLibellePilier = _getLibellePilier.call(
					this,
					lElementSelectionne,
				);
				this.getInstance(this.identComboPilier).setContenu(lLibellePilier);
				break;
			}
		}
	}
	evenementSurComboPalier(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			this.palierSelected = aParams.element;
			const lGenreReferentiel = this.genreReferentiel;
			const lListePiliers = new ObjetListeElements();
			this.listePiliers.parcourir((D) => {
				if (lGenreReferentiel === D.getGenre()) {
					if (D.palier.getNumero() === aParams.element.getNumero()) {
						D.libelleHtml =
							"<span ie-html=\"getLibellePilier('" +
							aParams.element.getNumero() +
							"', '" +
							D.getNumero() +
							"')\"></span>";
						lListePiliers.addElement(D);
					}
				}
			});
			lListePiliers.trier();
			this.getInstance(this.identComboPilier).setDonnees(lListePiliers);
			const lElementSelectionne =
				lGenreReferentiel === TypeGenreReferentiel.GR_Metamatiere
					? this.metaMatiereSelected
					: this.pilierDeCompetenceSelected;
			this.getInstance(this.identComboPilier).setSelectionParElement(
				lElementSelectionne,
				0,
			);
		}
	}
	evenementSurComboPilier(aParams) {
		if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
			if (
				this.avecControleCompetenceLVE &&
				aParams.element.PilierLVE === true &&
				this.estUnServiceLVE === false
			) {
				const lThis = this;
				GApplication.getMessage().afficher({
					message: GTraductions.getValeur(
						"competences.SaisieImpossibleGrilleLVE",
					),
					callback: function () {
						aParams.element.listeCompetences.parcourir((D) => {
							D.setActif(false);
						});
						lThis._evenementSurComboPilier(aParams.element);
					},
				});
			} else {
				this._evenementSurComboPilier(aParams.element);
			}
		}
	}
	_evenementSurComboPilier(aElement) {
		if (this.genreReferentiel === TypeGenreReferentiel.GR_Metamatiere) {
			this.metaMatiereSelected = aElement;
		} else {
			this.pilierDeCompetenceSelected = aElement;
		}
		this.actualiserDeploiementsListeCompetencesDePilier(
			new ObjetListeElements().add(aElement),
		);
		const lListe = this.getInstance(this.identListe);
		lListe.setOptionsListe({
			colonnes: this.getListeColonnesCompetences(aElement),
		});
		lListe.setDonnees(
			new DonneesListe_Competences(aElement.listeCompetences, {
				avecSousItems: aElement.AvecSousItems,
				pourCompetenceNumerique:
					aElement.categorie === TypeCategorieCompetence.CompetenceNumerique,
			}),
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
						EGenreRessourceUtil.getGenrePereCompetence(D.getGenre())
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
				if (lCompetenceDePilier.getGenre() === EGenreRessource.Competence) {
					lPere = lCompetenceDePilier;
				}
				switch (lCompetenceDePilier.getGenre()) {
					case EGenreRessource.ElementPilier: {
						lCompetenceDePilier.Actif = true;
						break;
					}
					case EGenreRessource.Competence: {
						lCompetenceDePilier.Actif = true;
						break;
					}
					case EGenreRessource.SousItem: {
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
										elementCree = MethodesObjet.dupliquer(lCompetenceDePilier);
										elementCree.pilier = lPilier;
										elementCree.coefficient = 1;
										elementCree.relationESI = new ObjetElement("");
										elementCree.relationESI.setEtat(EGenreEtat.Creation);
										elementCree.setEtat(EGenreEtat.Creation);
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
									ObjetTri.init("avecEvaluation"),
								]);
								lListeCompetenceDEvaluation.trier();
								for (let i = 0; i < lNombreDElementsCompetenceASupprimer; i++) {
									lListeCompetenceDEvaluation
										.get(i)
										.setEtat(EGenreEtat.Suppression);
								}
							}
						}
					} else {
						lListeCompetenceDEvaluation.parcourir((D) => {
							D.setEtat(EGenreEtat.Suppression);
						});
					}
				}
			});
		});
	}
}
function _getLibellePalier(aPalierConcerne) {
	const lLibelle = [];
	if (!!aPalierConcerne) {
		const lNbCompetencesCochees = getNombreCompetencesCocheesDUnPalier.call(
			this,
			aPalierConcerne,
		);
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
function _getLibellePilier(aPilierConcerne) {
	const lLibelle = [];
	if (!!aPilierConcerne) {
		const lNbCompetencesCochees =
			getNombreCompetencesCocheesDUnPilier(aPilierConcerne);
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
const lGenreReferentiel = this.genreReferentiel;
function getNombreCompetencesCocheesDUnPalier(aPalier) {
	let lResult = 0;
	this.listePiliers.parcourir((aPilier) => {
		if (lGenreReferentiel === aPilier.getGenre()) {
			if (aPilier.palier.getNumero() === aPalier.getNumero()) {
				lResult += getNombreCompetencesCocheesDUnPilier(aPilier);
			}
		}
	});
	return lResult;
}
function getNombreCompetencesCocheesDUnPilier(aPilier) {
	let lResult = 0;
	if (!!aPilier && aPilier.listeCompetences) {
		aPilier.listeCompetences.parcourir((aCompetenceDePilier) => {
			lResult += aCompetenceDePilier.nombreRelations || 0;
		});
	}
	return lResult;
}
function getNombreCompetencesCocheesDeTousLesPiliers() {
	let lResult = 0;
	if (this.listePiliers) {
		this.listePiliers.parcourir((aPilier) => {
			lResult += getNombreCompetencesCocheesDUnPilier(aPilier);
		});
	}
	return lResult;
}
module.exports = { ObjetFenetre_Competences };
