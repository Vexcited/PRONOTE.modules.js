exports.InterfaceListeProgression = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetInterface_1 = require("ObjetInterface");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_RemplirProgression_1 = require("ObjetFenetre_RemplirProgression");
const DonneesListe_Progression_1 = require("DonneesListe_Progression");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const ObjetElement_1 = require("ObjetElement");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_SelectionNiveauProgression_1 = require("ObjetFenetre_SelectionNiveauProgression");
const ObjetFenetre_SelectionMatiere_1 = require("ObjetFenetre_SelectionMatiere");
class InterfaceListeProgression extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.donnees = {};
		this.applicationSco = GApplication;
		this.AvecCadre = false;
		this.options = {
			callbackSelectionProgression: null,
			nonEditable: false,
			estModeSelection: false,
			avecProgressionsPublic: false,
			classeFenetreProgression: null,
		};
	}
	construireInstances() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
		);
	}
	construireStructureAffichageAutre() {
		return [
			'<div id="',
			this.getInstance(this.identListe).getNom(),
			'" style="height:100%;"></div>',
		].join("");
	}
	actualiser(aDonnees) {
		Object.assign(this.donnees, aDonnees);
		const lListe = this.getInstance(this.identListe);
		this._initListe();
		let lListeSelections = null;
		if (
			this.donnees.progressionsASelectionner &&
			this.donnees.progressionsASelectionner.count() === 1
		) {
			const lProgressionSelection =
				this.donnees.listeProgressions.getElementParNumero(
					this.donnees.progressionsASelectionner.getNumero(0),
				);
			if (lProgressionSelection) {
				lListeSelections =
					new ObjetListeElements_1.ObjetListeElements().addElement(
						lProgressionSelection,
					);
			}
			this.donnees.progressionsASelectionner = null;
		}
		if (!lListeSelections) {
			lListeSelections = lListe.getListeElementsSelection();
		}
		lListe.setDonnees(
			new DonneesListe_Progression_1.DonneesListe_Progression(
				this.donnees.listeProgressions,
			).setOptions({
				controleVisibilite:
					this.options.estModeSelection && !this.options.avecProgressionsPublic,
			}),
		);
		if (lListeSelections && lListeSelections.count() > 0) {
			lListe.setListeElementsSelection(lListeSelections, {
				avecEvenement: false,
				avecScroll: true,
			});
		}
	}
	getProgressionSelection() {
		return this.getInstance(this.identListe)
			? this.getInstance(this.identListe).getElementSelection()
			: null;
	}
	remplirProgressionCourante(aNode) {
		const lProgression = this.getInstance(
			this.identListe,
		).getElementSelection();
		if (!lProgression) {
			return;
		}
		this._afficherFenetreRemplirProgression(
			lProgression,
			(aValider) => {
				if (aNode) {
					ObjetHtml_1.GHtml.setFocus(aNode);
				}
				if (aValider) {
					this.setEtatSaisie(true);
				}
			},
			{
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			},
			true,
		);
	}
	_initListe() {
		const lColonnes = [
			{
				id: DonneesListe_Progression_1.DonneesListe_Progression.colonnes.nom,
				titre: ObjetTraduction_1.GTraductions.getValeur("Nom"),
				taille: ObjetListe_1.ObjetListe.initColonne(100, 100),
			},
			{
				id: DonneesListe_Progression_1.DonneesListe_Progression.colonnes.niveau,
				titre: ObjetTraduction_1.GTraductions.getValeur("Niveau"),
				taille: ObjetListe_1.ObjetListe.initColonne(50, 70, 100),
			},
			{
				id: DonneesListe_Progression_1.DonneesListe_Progression.colonnes
					.matiere,
				titre: ObjetTraduction_1.GTraductions.getValeur("Matiere"),
				taille: ObjetListe_1.ObjetListe.initColonne(50, 70, 150),
			},
		];
		if (this.options.estModeSelection) {
			lColonnes.push({
				id: DonneesListe_Progression_1.DonneesListe_Progression.colonnes
					.professeur,
				titre: ObjetTraduction_1.GTraductions.getValeur("Professeur"),
				taille: 150,
			});
		} else {
			lColonnes.push(
				{
					id: DonneesListe_Progression_1.DonneesListe_Progression.colonnes
						.biblio,
					titre: {
						libelleHtml:
							'<i class="icon_sondage_bibliotheque" style="font-size:1.4rem;"></i>',
						title: ObjetTraduction_1.GTraductions.getValeur(
							"progression.ProgressionDeBibliotheque",
						),
					},
					taille: 18,
				},
				{
					id: DonneesListe_Progression_1.DonneesListe_Progression.colonnes
						.partage,
					titre: {
						libelleHtml:
							'<i class="icon_fiche_cours_partage" style="font-size:1.4rem;"></i>',
						title: ObjetTraduction_1.GTraductions.getValeur(
							"progression.ProgressionPartagee",
						),
					},
					taille: 18,
				},
			);
		}
		this.getInstance(this.identListe).setOptionsListe({
			colonnes: lColonnes,
			nonEditable:
				this.options.estModeSelection ||
				this.options.nonEditable ||
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
			avecLigneCreation: true,
			listeCreations: [
				DonneesListe_Progression_1.DonneesListe_Progression.colonnes.nom,
				DonneesListe_Progression_1.DonneesListe_Progression.colonnes.niveau,
			],
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"progression.CreerProgression",
			),
		});
		GEtatUtilisateur.setTriListe({
			liste: this.getInstance(this.identListe),
			tri: DonneesListe_Progression_1.DonneesListe_Progression.colonnes.nom,
		});
	}
	_creationProgressionSuite() {
		new Promise((aResolve, aReject) => {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionNiveauProgression_1.ObjetFenetre_SelectionNiveauProgression,
				{
					pere: this,
					evenement: (aNumeroBouton, aNumeroNiveau) => {
						let lProgression = null;
						if (aNumeroBouton === 1) {
							const lNiveau =
								this.donnees.listeNiveaux.getElementParNumeroEtGenre(
									aNumeroNiveau,
								);
							if (lNiveau) {
								lProgression = new ObjetElement_1.ObjetElement("");
								lProgression.listeDossiers =
									new ObjetListeElements_1.ObjetListeElements();
								lProgression.niveau = lNiveau;
							}
						}
						if (lProgression) {
							aResolve(lProgression);
						} else {
							aReject();
						}
					},
				},
				{
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"progression.TitreFenetreNiveau",
					),
					largeur: 250,
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
				},
			).setDonnees(this.donnees.listeNiveaux);
		})
			.then((aProgression) => {
				return new Promise((aResolve, aReject) => {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionMatiere_1.ObjetFenetre_SelectionMatiere,
						{
							pere: this,
							evenement: (aNumeroBouton, aIndiceSelection, aNumeroMatiere) => {
								let lMatiere = null;
								if (aNumeroBouton === 1) {
									if (aIndiceSelection >= 0 && aNumeroMatiere) {
										lMatiere =
											aProgression.niveau.listeMatieres.getElementParNumeroEtGenre(
												aNumeroMatiere,
											);
									}
								}
								if (lMatiere) {
									aProgression.matiere = lMatiere;
									this._afficherFenetreRemplirProgression(aProgression, () => {
										aResolve(aProgression);
									});
								} else {
									aReject();
								}
							},
						},
						{
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"progression.TitreFenetreMatiere",
							),
							largeur: 300,
							hauteur: 400,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
						},
					).setDonnees(aProgression.niveau.listeMatieres);
				});
			})
			.then((aProgression) => {
				this.getInstance(this.identListe).ajouterElementCreation(aProgression);
			})
			.catch(() => {
				this.getInstance(this.identListe).ajouterElementCreation(null);
			});
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ModificationSelection:
				if (this.options.callbackSelectionProgression) {
					this.options.callbackSelectionProgression(
						this.getInstance(this.identListe).getElementSelection(),
					);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				switch (aParametres.idColonne) {
					case DonneesListe_Progression_1.DonneesListe_Progression.colonnes
						.niveau:
						this._creationProgressionSuite();
						break;
				}
				return (
					aParametres.idColonne !==
					DonneesListe_Progression_1.DonneesListe_Progression.colonnes.nom
				);
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_Progression_1.DonneesListe_Progression.colonnes
						.partage:
						if (!aParametres.article.listeCoEnseignants) {
							aParametres.article.listeCoEnseignants =
								new ObjetListeElements_1.ObjetListeElements();
						}
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
							{
								pere: this,
								evenement: this._evenementFenetreProfs.bind(
									this,
									aParametres.article,
								),
								initialiser: function (aInstance) {
									aInstance.setSelectionObligatoire(false);
								},
							},
						).setDonnees({
							listeRessources: aParametres.article.matiere.listeProfs
								? aParametres.article.matiere.listeProfs
								: new ObjetListeElements_1.ObjetListeElements(),
							listeRessourcesSelectionnees:
								MethodesObjet_1.MethodesObjet.dupliquer(
									aParametres.article.listeCoEnseignants,
								),
							genreRessource: Enumere_Ressource_1.EGenreRessource.Enseignant,
							titre:
								Enumere_Ressource_1.EGenreRessourceUtil.getTitreFenetreSelectionRessource(
									Enumere_Ressource_1.EGenreRessource.Enseignant,
								),
						});
						break;
					default:
				}
				break;
		}
	}
	_evenementFenetreProfs(
		aProgression,
		aGenreRessource,
		aListeRessourcesSelectionnees,
		aNumeroBouton,
	) {
		if (aNumeroBouton === 0) {
			aProgression.listeCoEnseignants =
				new ObjetListeElements_1.ObjetListeElements();
			let lElement;
			for (let i = 0; i < aListeRessourcesSelectionnees.count(); i++) {
				lElement = aListeRessourcesSelectionnees.get(i);
				lElement.proprietaire = true;
				aProgression.listeCoEnseignants.addElement(lElement);
			}
			if (aProgression.listeCoEnseignants.count() > 0) {
				lElement = MethodesObjet_1.MethodesObjet.dupliquer(
					GEtatUtilisateur.getUtilisateur(),
				);
				lElement.proprietaire = true;
				aProgression.listeCoEnseignants.addElement(lElement);
			} else {
				delete aProgression.listeCoEnseignants;
			}
			aProgression.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	_afficherFenetreRemplirProgression(
		aProgression,
		aCallbackFin,
		aOptionsFenetre,
		aAvecBoutonAnnuler,
	) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_RemplirProgression_1.ObjetFenetre_RemplirProgression,
			{
				pere: this,
				evenement: (aGenreBouton, aGenreEvenement) => {
					if (
						(aAvecBoutonAnnuler && aGenreBouton > 0) ||
						(!aAvecBoutonAnnuler && aGenreBouton >= 0)
					) {
						ObjetFenetre_RemplirProgression_1.ObjetFenetre_RemplirProgression.validerProgressionAvecEvenement(
							{
								pere: this,
								progression: aProgression,
								listeProgressionsPublicPourCopie:
									this.donnees.listeProgressionsPublicPourCopie,
								listeNiveaux: this.donnees.listeNiveaux,
								genreEvenement: aGenreEvenement,
								annuler: aCallbackFin.bind(this, false),
								callbackFinCreation: aCallbackFin.bind(this, true),
								classeFenetreProgression: this.options.classeFenetreProgression,
							},
						);
					} else {
						aCallbackFin(false);
					}
				},
			},
			Object.assign(
				{
					titre:
						aProgression.niveau.getLibelle() +
						" - " +
						aProgression.matiere.getLibelle(),
					listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
				},
				aOptionsFenetre,
			),
		).afficher();
	}
}
exports.InterfaceListeProgression = InterfaceListeProgression;
