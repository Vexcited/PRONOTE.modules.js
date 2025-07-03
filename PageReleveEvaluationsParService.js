exports.PageReleveEvaluationsParService = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SaisieTypeNote_1 = require("ObjetFenetre_SaisieTypeNote");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const _PageReleveEvaluations_1 = require("_PageReleveEvaluations");
const DonneesListe_ReleveDEvaluations_1 = require("DonneesListe_ReleveDEvaluations");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetPiedPageAppreciationsBulletin_Professeur_1 = require("ObjetPiedPageAppreciationsBulletin_Professeur");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypePositionnement_1 = require("TypePositionnement");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetListe_1 = require("ObjetListe");
const ObjetRequeteReleveDEvaluations_1 = require("ObjetRequeteReleveDEvaluations");
class PageReleveEvaluationsParService extends _PageReleveEvaluations_1._PageReleveEvaluations {
	constructor(...aParams) {
		super(...aParams);
		this.typeAffichage =
			ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations.TypeAffichage.AffichageParService;
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
	}
	construireInstances() {
		super.construireInstances();
		if (!this.etatUtilisateurSco.pourPrimaire()) {
			this.identDateDebut = this.add(
				ObjetCelluleDate_1.ObjetCelluleDate,
				this._eventSelecteurDate.bind(this, true),
			);
			this.identDateFin = this.add(
				ObjetCelluleDate_1.ObjetCelluleDate,
				this._eventSelecteurDate.bind(this, false),
			);
		}
		this.identAppreciationClasse = this.add(
			ObjetPiedPageAppreciationsBulletin_Professeur_1.ObjetPiedPageAppreciationsBulletin_Professeur,
			this._evntSurPied.bind(this),
		);
	}
	clbckSaisieApprClasse(aParamSucces) {
		if (
			!this.moteur.controleCtxAppSaisie(
				{
					service: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
					),
					periode: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
				},
				aParamSucces,
			)
		) {
			return;
		}
		this.moteur.updateAppClasseSurRetourSaisie(
			this.donnees.appreciationClasse,
			aParamSucces,
		);
		this.actualiserDonneesPiedDePage();
	}
	avecOptionCompacterLignes() {
		return true;
	}
	_getListeParametresMenuDeroulant() {
		return [
			Enumere_Ressource_1.EGenreRessource.Classe,
			Enumere_Ressource_1.EGenreRessource.Periode,
			Enumere_Ressource_1.EGenreRessource.Service,
		];
	}
	_evenementSurDernierMenuDeroulant() {
		if (!!this.identDateDebut && !!this.identDateFin) {
			const lBornes = this._getBornesPeriodeSelectionnee();
			const lInstanceDateDebut = this.getInstance(this.identDateDebut);
			if (
				!ObjetDate_1.GDate.estJourEgal(
					lInstanceDateDebut.getBorneDates().dateDebut,
					lBornes.dateDebut,
				) ||
				!ObjetDate_1.GDate.estJourEgal(
					lInstanceDateDebut.getBorneDates().dateFin,
					lBornes.dateFin,
				)
			) {
				const lInstanceDateFin = this.getInstance(this.identDateFin);
				this.donnees.dateDebut = lBornes.dateDebut;
				this.donnees.dateFin = lBornes.dateFin;
				lInstanceDateDebut.setDonnees(lBornes.dateDebut);
				lInstanceDateFin.setDonnees(lBornes.dateFin);
				lInstanceDateDebut.setParametresFenetre(
					GParametres.PremierLundi,
					lBornes.dateDebut,
					lBornes.dateFin,
				);
				lInstanceDateFin.setParametresFenetre(
					GParametres.PremierLundi,
					lBornes.dateDebut,
					lBornes.dateFin,
				);
			}
		}
		super._evenementSurDernierMenuDeroulant();
	}
	_getParametresSupplementairesRequetes(aEstRequeteSaisie = false) {
		const lParams = {
			service: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Service,
			),
			dateDebut: null,
			dateFin: null,
			ressource: null,
			listeElementsProgrammes: null,
			listeColonnesRESIAffichables: null,
		};
		if (!aEstRequeteSaisie) {
			lParams.dateDebut = this.donnees.dateDebut;
			lParams.dateFin = this.donnees.dateFin;
		}
		if (aEstRequeteSaisie) {
			let lClasse = this._getInfoClasse();
			lParams.ressource = lClasse;
			const lDonneesPiedDePage = this.getInstance(
				this.identAppreciationClasse,
			).getDonnees();
			if (
				lDonneesPiedDePage &&
				lDonneesPiedDePage.pied &&
				lDonneesPiedDePage.pied.listeElementsProgramme &&
				lDonneesPiedDePage.pied.avecSaisieListeElementsProgramme
			) {
				lParams.listeElementsProgrammes =
					lDonneesPiedDePage.pied.listeElementsProgramme;
			}
			lParams.listeColonnesRESIAffichables =
				this.donnees.listeColonnesRESIAffichables;
		}
		return lParams;
	}
	avecAssistantSaisie() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.assistantSaisieAppreciations,
		);
	}
	_getBoutonsListe() {
		return [
			{ genre: ObjetListe_1.ObjetListe.typeBouton.exportCSV },
			{
				class: "icon_wrench",
				title: ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.HintBouton",
				),
				getDisabled: () => {
					const lListeColonnes = this.donnees.listeColonnesRESIAffichables;
					return !lListeColonnes || lListeColonnes.count() === 0;
				},
				event: () => {
					this._ouvrirFenetreChoixAffichageColonnes();
				},
			},
		];
	}
	estPiedDePageVisible() {
		const lAvecElementsProgramme = !!this.donnees.listeElementsProgramme;
		const lAvecAppreciations =
			this.donnees.appreciationClasse &&
			this.parametres.affichage.avecAppreciations;
		return lAvecAppreciations || lAvecElementsProgramme;
	}
	actualiserDonneesPiedDePage() {
		let lAppreciation = null;
		if (
			this.parametres.affichage.avecAppreciations &&
			this.donnees.appreciationClasse
		) {
			lAppreciation = this.donnees.appreciationClasse;
			if (
				lAppreciation.titre === null ||
				lAppreciation.titre === undefined ||
				lAppreciation.titre === ""
			) {
				lAppreciation.titre = ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.piedDePage.AppreciationGeneraleClasse",
				);
			}
		}
		let lStrMatiere = "";
		const lStrProfs = [];
		const lServiceSelectionne = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Service,
		);
		if (!!lServiceSelectionne) {
			lStrMatiere = lServiceSelectionne.getLibelle();
			if (!!lServiceSelectionne.listeProfesseurs) {
				lServiceSelectionne.listeProfesseurs.parcourir((D) => {
					lStrProfs.push(D.getLibelle());
				});
			}
		}
		const lPiedPage = {
			strMatiere: lStrMatiere,
			profs: lStrProfs,
			listeElementsProgramme: this.donnees.listeElementsProgramme,
			elementsEditable: this.donnees.elementsProgrammeEditable,
			elementsCloture: this.donnees.elementsProgrammeCloture,
		};
		this.getInstance(this.identAppreciationClasse).setDonnees({
			strMatiere: lStrMatiere,
			strClasse: this.etatUtilisateurSco.Navigation.getLibelleRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
			heightContenu: this.parametres.hauteurs.piedDePage - 35,
			service: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Service,
			),
			periode: this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			appreciation: lAppreciation,
			appreciation_sauvegarde:
				MethodesObjet_1.MethodesObjet.dupliquer(lAppreciation),
			pied: lPiedPage,
		});
	}
	_composePiedDePage() {
		return IE.jsx.str("div", {
			class: "Espace",
			id: this.getNomInstance(this.identAppreciationClasse),
		});
	}
	_ajouteCommandesSupplementairesMenuContextuel(aSelections, aMenuContextuel) {
		let lPosLSUParNiveauxEditable = false,
			lTypePositionnementCommun;
		let lPosLSUParNoteEditable = false,
			lTypeNoteCommune;
		aSelections.forEach((aSelection) => {
			if (
				aSelection.idColonne ===
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.pos_lsu_note
			) {
				lPosLSUParNoteEditable = true;
				if (lTypeNoteCommune === undefined) {
					lTypeNoteCommune = aSelection.article.posLSUNote;
				} else if (lTypeNoteCommune !== null) {
					const lArticleNote = aSelection.article.posLSUNote;
					if (
						!lArticleNote ||
						lTypeNoteCommune.getNote() !== lArticleNote.getNote()
					) {
						lTypeNoteCommune = null;
					}
				}
			} else if (
				aSelection.idColonne ===
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.pos_lsu_niveau
			) {
				lPosLSUParNiveauxEditable = true;
				if (lTypePositionnementCommun === undefined) {
					lTypePositionnementCommun =
						aSelection.article.genrePositionnementSansNote;
				} else if (lTypePositionnementCommun !== null) {
					if (
						aSelection.article.genrePositionnementSansNote !==
						lTypePositionnementCommun
					) {
						lTypePositionnementCommun = null;
					}
				}
			}
		});
		aMenuContextuel.addSousMenu(
			ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.menucontextuel.ModifierPosLSU",
			),
			(aInstance) => {
				const lListeNiveauxPosLSU =
					UtilitaireCompetences_1.TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu(
						{
							genreChoixValidationCompetence:
								TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
									.tGVC_Competence,
							genrePositionnement:
								lTypePositionnementCommun ||
								TypePositionnement_1.TypePositionnement.POS_Echelle,
						},
					);
				lListeNiveauxPosLSU.parcourir((D) => {
					aInstance.add(
						D.Libelle,
						lPosLSUParNiveauxEditable,
						() => {
							this._modifierNiveauPositionnement(D);
						},
						{
							image: D.image,
							imageFormate: true,
							largeurImage: D.largeurImage,
						},
					);
				});
				aInstance.avecSeparateurSurSuivant();
				const lOptionsInputNote = {
					sansNotePossible: true,
					afficherAvecVirgule: true,
					hintSurErreur: false,
					min: 0,
					max: 20,
				};
				aInstance.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.menucontextuel.SaisieUneNote",
					),
					lPosLSUParNoteEditable,
					() => {
						const lFenetreSaisieNote =
							ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
								ObjetFenetre_SaisieTypeNote_1.ObjetFenetre_SaisieTypeNote,
								{
									pere: this,
									evenement: function (aNumeroBouton, aTypeNote) {
										if (aNumeroBouton === 1) {
											if (aTypeNote === null) {
												aTypeNote = new TypeNote_1.TypeNote("");
											}
											this._modifierNotePositionnement(aTypeNote);
										}
									},
								},
								{
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.menucontextuel.SaisieUneNote",
									),
								},
							);
						lFenetreSaisieNote.setOptionsInputNote(lOptionsInputNote);
						lFenetreSaisieNote.setDonnees(lTypeNoteCommune, {
							labelChamps: ObjetTraduction_1.GTraductions.getValeur(
								"releve_evaluations.fenetreSaisieNote.label",
							),
						});
					},
				);
			},
		);
	}
	_evntSurPied(aParam, aEstEditionEltPgm, aEstEditionParamSynchroClasse) {
		if (aEstEditionParamSynchroClasse === true) {
			this.clbckSaisieApprClasse(aParam);
		}
	}
	_getBornesPeriodeSelectionnee() {
		let lDateDebut, lDateFin;
		if (
			!!this.parametresSco.listePeriodes &&
			!!this.etatUtilisateurSco.Navigation.getNumeroRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			)
		) {
			const lPeriodeSelectionnee =
				this.parametresSco.listePeriodes.getElementParNumero(
					this.etatUtilisateurSco.Navigation.getNumeroRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
				);
			if (!!lPeriodeSelectionnee && !!lPeriodeSelectionnee.dates) {
				lDateDebut = lPeriodeSelectionnee.dates.debut;
				lDateFin = lPeriodeSelectionnee.dates.fin;
			}
		}
		return {
			dateDebut: lDateDebut || ObjetDate_1.GDate.premiereDate,
			dateFin: lDateFin || ObjetDate_1.GDate.derniereDate,
		};
	}
	_eventSelecteurDate(aEstDateDebut, aDate) {
		let lChangement = false;
		if (
			aEstDateDebut &&
			!ObjetDate_1.GDate.estDateEgale(this.donnees.dateDebut, aDate)
		) {
			lChangement = true;
			this.donnees.dateDebut = aDate;
			if (this.donnees.dateDebut > this.donnees.dateFin) {
				this.donnees.dateFin = aDate;
				this.getInstance(this.identDateFin).setDonnees(this.donnees.dateFin);
			}
		} else if (
			!aEstDateDebut &&
			!ObjetDate_1.GDate.estDateEgale(this.donnees.dateFin, aDate)
		) {
			lChangement = true;
			this.donnees.dateFin = aDate;
			if (this.donnees.dateFin < this.donnees.dateDebut) {
				this.donnees.dateDebut = aDate;
				this.getInstance(this.identDateDebut).setDonnees(
					this.donnees.dateDebut,
				);
			}
		}
		if (lChangement) {
			if (this.getEtatSaisie() === true) {
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
					this.afficherPage.bind(this),
				);
			} else {
				this.afficherPage();
			}
		}
	}
	_ouvrirFenetreChoixAffichageColonnes() {
		const lListeColonnesAffichables =
			new ObjetListeElements_1.ObjetListeElements();
		if (!!this.donnees.listeColonnesRESIAffichables) {
			this.donnees.listeColonnesRESIAffichables.parcourir((D) => {
				lListeColonnesAffichables.addElement(
					MethodesObjet_1.MethodesObjet.dupliquer(D),
				);
			});
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				initialiser: function (aInstance) {
					const lColonnes = [];
					lColonnes.push({
						id: DonneesListe_ChoixAffichageColonnes.colonnes.coche,
						titre: { estCoche: true },
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.hintCoche",
						),
						taille: 20,
					});
					lColonnes.push({
						id: DonneesListe_ChoixAffichageColonnes.colonnes.date,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.date",
						),
						taille: 65,
					});
					lColonnes.push({
						id: DonneesListe_ChoixAffichageColonnes.colonnes.libelle,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.libelle",
						),
						taille: "100%",
					});
					lColonnes.push({
						id: DonneesListe_ChoixAffichageColonnes.colonnes.domaines,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.domaines",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.hintDomaines",
						),
						taille: 70,
					});
					lColonnes.push({
						id: DonneesListe_ChoixAffichageColonnes.colonnes.coefficient,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.coefficient",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.colonnes.hintCoefficient",
						),
						taille: 30,
					});
					const lOptionsFenetreListe = {
						optionsListe: { colonnes: lColonnes },
					};
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.fenetrePersonnalisationListe.Titre",
						),
						largeur: 650,
						hauteur: 350,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
					aInstance.paramsListe = lOptionsFenetreListe;
				},
				evenement: function (aNumeroBouton) {
					if (aNumeroBouton === 1) {
						this.donnees.listeColonnesRESIAffichables =
							lListeColonnesAffichables;
						this.valider();
					}
				},
			},
		);
		lFenetre.setDonnees(
			new DonneesListe_ChoixAffichageColonnes(lListeColonnesAffichables),
			false,
		);
	}
	_getInfoClasse() {
		let lClasse = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (
			lClasse !== null &&
			lClasse !== undefined &&
			lClasse.getNumero() !== -1 &&
			lClasse.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune
		) {
			return lClasse;
		} else {
			let lService = this.etatUtilisateurSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Service,
			);
			if (lService !== null && lService !== undefined) {
				let lClasseDuService = lService.classe;
				let lGpeDuService = lService.groupe;
				if (lGpeDuService && lGpeDuService.existeNumero()) {
					lGpeDuService.Genre = Enumere_Ressource_1.EGenreRessource.Groupe;
					return lGpeDuService;
				} else {
					if (lClasseDuService && lClasseDuService.existeNumero()) {
						lClasseDuService.Genre = Enumere_Ressource_1.EGenreRessource.Classe;
						return lClasseDuService;
					} else {
					}
				}
			}
		}
	}
}
exports.PageReleveEvaluationsParService = PageReleveEvaluationsParService;
class DonneesListe_ChoixAffichageColonnes extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecSelection: false,
			avecSuppression: false,
			avecEtatSaisie: false,
			avecEvnt_ApresEdition: true,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ChoixAffichageColonnes.colonnes.coche:
				return aParams.article.estAffiche;
			case DonneesListe_ChoixAffichageColonnes.colonnes.date: {
				let lStrDate = "";
				if (!!aParams.article.date) {
					lStrDate = ObjetDate_1.GDate.formatDate(
						aParams.article.date,
						"%JJ/%MM/%AAAA",
					);
				}
				return lStrDate;
			}
			case DonneesListe_ChoixAffichageColonnes.colonnes.libelle:
				return aParams.article.getLibelle() || "";
			case DonneesListe_ChoixAffichageColonnes.colonnes.domaines:
				return aParams.article.strDomaines || "";
			case DonneesListe_ChoixAffichageColonnes.colonnes.coefficient:
				return aParams.article.coefficient || "";
		}
		return "";
	}
	getTooltip(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ChoixAffichageColonnes.colonnes.libelle:
				return aParams.article.strLibelleHint || "";
			case DonneesListe_ChoixAffichageColonnes.colonnes.domaines:
				return aParams.article.strDomainesHint || "";
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne === DonneesListe_ChoixAffichageColonnes.colonnes.coche
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getColonneTransfertEdition() {
		return DonneesListe_ChoixAffichageColonnes.colonnes.coche;
	}
	surEdition(aParams, V) {
		if (!!aParams.article) {
			aParams.article.estAffiche = !!V;
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
}
DonneesListe_ChoixAffichageColonnes.colonnes = {
	coche: "PRE_AffCol_coche",
	date: "PRE_AffCol_date",
	libelle: "PRE_AffCol_libelle",
	domaines: "PRE_AffCol_domaines",
	coefficient: "PRE_AffCol_coeff",
};
