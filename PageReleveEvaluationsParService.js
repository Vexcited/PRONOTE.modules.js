const { TypeDroits } = require("ObjetDroitsPN.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ControleSaisieEvenement } = require("ControleSaisieEvenement.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const {
	ObjetFenetre_SaisieTypeNote,
} = require("ObjetFenetre_SaisieTypeNote.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeNote } = require("TypeNote.js");
const { _PageReleveEvaluations } = require("_PageReleveEvaluations.js");
const {
	DonneesListe_ReleveDEvaluations,
} = require("DonneesListe_ReleveDEvaluations.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetPiedPageAppreciationsBulletin_Professeur,
} = require("ObjetPiedPageAppreciationsBulletin_Professeur.js");
const {
	TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const { TypePositionnement } = require("TypePositionnement.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { ObjetListe } = require("ObjetListe.js");
class PageReleveEvaluationsParService extends _PageReleveEvaluations {
	constructor(...aParams) {
		super(...aParams);
		this.typeAffichage = this.constantes.AffichageParService;
		this.moteur = new ObjetMoteurReleveBulletin();
	}
	construireInstances() {
		super.construireInstances();
		if (!GEtatUtilisateur.pourPrimaire()) {
			this.identDateDebut = this.add(
				ObjetCelluleDate,
				_eventSelecteurDate.bind(this, true),
			);
			this.identDateFin = this.add(
				ObjetCelluleDate,
				_eventSelecteurDate.bind(this, false),
			);
		}
		this.identAppreciationClasse = this.add(
			ObjetPiedPageAppreciationsBulletin_Professeur,
			_evntSurPied.bind(this),
		);
	}
	clbckSaisieApprClasse(aParamSucces) {
		if (
			!this.moteur.controleCtxAppSaisie(
				{
					service: GEtatUtilisateur.Navigation.getRessource(
						EGenreRessource.Service,
					),
					periode: GEtatUtilisateur.Navigation.getRessource(
						EGenreRessource.Periode,
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
			EGenreRessource.Classe,
			EGenreRessource.Periode,
			EGenreRessource.Service,
		];
	}
	_evenementSurDernierMenuDeroulant() {
		if (!!this.identDateDebut && !!this.identDateFin) {
			const lBornes = _getBornesPeriodeSelectionnee();
			const lInstanceDateDebut = this.getInstance(this.identDateDebut);
			if (
				!GDate.estJourEgal(
					lInstanceDateDebut.getBorneDates().dateDebut,
					lBornes.dateDebut,
				) ||
				!GDate.estJourEgal(
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
	_getParametresSupplementairesRequetes(aRequeteSaisie) {
		const lParams = {
			service: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Service,
			),
		};
		if (!aRequeteSaisie) {
			lParams.dateDebut = this.donnees.dateDebut;
			lParams.dateFin = this.donnees.dateFin;
		}
		if (aRequeteSaisie) {
			let lClasse = _getInfoClasse.call(this);
			lParams.ressource = lClasse;
			const lDonneesPiedDePage = this.getInstance(
				this.identAppreciationClasse,
			).donnees;
			if (
				lDonneesPiedDePage &&
				lDonneesPiedDePage.pied &&
				lDonneesPiedDePage.pied.listeElementsProgramme &&
				lDonneesPiedDePage.pied.listeElementsProgramme.avecSaisie
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
		return GApplication.droits.get(TypeDroits.assistantSaisieAppreciations);
	}
	_getBoutonsListe() {
		const lThis = this;
		return [
			{ genre: ObjetListe.typeBouton.exportCSV },
			{
				class: "icon_wrench",
				title: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.HintBouton",
				),
				getDisabled: function () {
					const lListeColonnes = lThis.donnees.listeColonnesRESIAffichables;
					return !lListeColonnes || lListeColonnes.count() === 0;
				},
				event: function () {
					_ouvrirFenetreChoixAffichageColonnes.call(lThis);
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
				lAppreciation.titre = GTraductions.getValeur(
					"releve_evaluations.piedDePage.AppreciationGeneraleClasse",
				);
			}
		}
		let lStrMatiere = "";
		const lStrProfs = [];
		const lServiceSelectionne = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Service,
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
			strClasse: GEtatUtilisateur.Navigation.getLibelleRessource(
				EGenreRessource.Classe,
			),
			heightContenu: this.parametres.hauteurs.piedDePage - 35,
			service: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Service,
			),
			periode: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			),
			appreciation: lAppreciation,
			appreciation_sauvegarde: MethodesObjet.dupliquer(lAppreciation),
			pied: lPiedPage,
		});
	}
	_composePiedDePage() {
		return [
			'<div class="Espace" id="',
			this.getInstance(this.identAppreciationClasse).getNom(),
			'">',
			"</div>",
		].join("");
	}
	_ajouteCommandesSupplementairesMenuContextuel(aSelections, aMenuContextuel) {
		let lPosLSUParNiveauxEditable = false,
			lTypePositionnementCommun;
		let lPosLSUParNoteEditable = false,
			lTypeNoteCommune;
		aSelections.forEach((aSelection) => {
			if (
				aSelection.idColonne ===
				DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_note
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
				DonneesListe_ReleveDEvaluations.colonnes.pos_lsu_niveau
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
			GTraductions.getValeur(
				"releve_evaluations.menucontextuel.ModifierPosLSU",
			),
			(aInstance) => {
				const lListeNiveauxPosLSU =
					TUtilitaireCompetences.getListeNiveauxDAcquisitionsPourMenu({
						genreChoixValidationCompetence:
							TypeGenreValidationCompetence.tGVC_Competence,
						genrePositionnement:
							lTypePositionnementCommun || TypePositionnement.POS_Echelle,
					});
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
					GTraductions.getValeur(
						"releve_evaluations.menucontextuel.SaisieUneNote",
					),
					lPosLSUParNoteEditable,
					() => {
						const lFenetreSaisieNote = ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SaisieTypeNote,
							{
								pere: this,
								evenement: function (aNumeroBouton, aTypeNote) {
									if (aNumeroBouton === 1) {
										if (aTypeNote === null) {
											aTypeNote = new TypeNote("");
										}
										this._modifierNotePositionnement(aTypeNote);
									}
								},
							},
							{
								titre: GTraductions.getValeur(
									"releve_evaluations.menucontextuel.SaisieUneNote",
								),
							},
						);
						lFenetreSaisieNote.setOptionsInputNote(lOptionsInputNote);
						lFenetreSaisieNote.setDonnees(lTypeNoteCommune, {
							labelChamps: GTraductions.getValeur(
								"releve_evaluations.fenetreSaisieNote.label",
							),
						});
					},
				);
			},
		);
	}
}
function _evntSurPied(
	aParam,
	aEstEditionEltPgm,
	aEstEditionParamSynchroClasse,
) {
	if (aEstEditionParamSynchroClasse === true) {
		this.clbckSaisieApprClasse(aParam);
	}
}
function _getBornesPeriodeSelectionnee() {
	let lDateDebut, lDateFin;
	if (
		!!GParametres.listePeriodes &&
		!!GEtatUtilisateur.Navigation.getNumeroRessource(EGenreRessource.Periode)
	) {
		const lPeriodeSelectionnee = GParametres.listePeriodes.getElementParNumero(
			GEtatUtilisateur.Navigation.getNumeroRessource(EGenreRessource.Periode),
		);
		if (!!lPeriodeSelectionnee && !!lPeriodeSelectionnee.dates) {
			lDateDebut = lPeriodeSelectionnee.dates.debut;
			lDateFin = lPeriodeSelectionnee.dates.fin;
		}
	}
	return {
		dateDebut: lDateDebut || GDate.premiereDate,
		dateFin: lDateFin || GDate.derniereDate,
	};
}
function _eventSelecteurDate(aEstDateDebut, aDate) {
	let lChangement = false;
	if (aEstDateDebut && !GDate.estDateEgale(this.donnees.dateDebut, aDate)) {
		lChangement = true;
		this.donnees.dateDebut = aDate;
		if (this.donnees.dateDebut > this.donnees.dateFin) {
			this.donnees.dateFin = aDate;
			this.getInstance(this.identDateFin).setDonnees(this.donnees.dateFin);
		}
	} else if (
		!aEstDateDebut &&
		!GDate.estDateEgale(this.donnees.dateFin, aDate)
	) {
		lChangement = true;
		this.donnees.dateFin = aDate;
		if (this.donnees.dateFin < this.donnees.dateDebut) {
			this.donnees.dateDebut = aDate;
			this.getInstance(this.identDateDebut).setDonnees(this.donnees.dateDebut);
		}
	}
	if (lChangement) {
		if (this.getEtatSaisie() === true) {
			ControleSaisieEvenement(this.afficherPage.bind(this));
		} else {
			this.afficherPage();
		}
	}
}
function _ouvrirFenetreChoixAffichageColonnes() {
	const lListeColonnesAffichables = new ObjetListeElements();
	if (!!this.donnees.listeColonnesRESIAffichables) {
		this.donnees.listeColonnesRESIAffichables.parcourir((D) => {
			lListeColonnesAffichables.addElement(MethodesObjet.dupliquer(D));
		});
	}
	const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
		pere: this,
		initialiser: function (aInstance) {
			const lColonnes = [];
			lColonnes.push({
				id: DonneesListe_ChoixAffichageColonnes.colonnes.coche,
				titre: { estCoche: true },
				hint: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.hintCoche",
				),
				taille: 20,
			});
			lColonnes.push({
				id: DonneesListe_ChoixAffichageColonnes.colonnes.date,
				titre: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.date",
				),
				taille: 65,
			});
			lColonnes.push({
				id: DonneesListe_ChoixAffichageColonnes.colonnes.libelle,
				titre: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.libelle",
				),
				taille: "100%",
			});
			lColonnes.push({
				id: DonneesListe_ChoixAffichageColonnes.colonnes.domaines,
				titre: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.domaines",
				),
				hint: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.hintDomaines",
				),
				taille: 70,
			});
			lColonnes.push({
				id: DonneesListe_ChoixAffichageColonnes.colonnes.coefficient,
				titre: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.coefficient",
				),
				hint: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.colonnes.hintCoefficient",
				),
				taille: 30,
			});
			const lOptionsFenetreListe = { optionsListe: { colonnes: lColonnes } };
			aInstance.setOptionsFenetre({
				titre: GTraductions.getValeur(
					"releve_evaluations.fenetrePersonnalisationListe.Titre",
				),
				largeur: 650,
				hauteur: 350,
				listeBoutons: [
					GTraductions.getValeur("Annuler"),
					GTraductions.getValeur("Valider"),
				],
			});
			aInstance.paramsListe = lOptionsFenetreListe;
		},
		evenement: function (aNumeroBouton) {
			if (aNumeroBouton === 1) {
				this.donnees.listeColonnesRESIAffichables = lListeColonnesAffichables;
				this.valider();
			}
		},
	});
	lFenetre.setDonnees(
		new DonneesListe_ChoixAffichageColonnes(lListeColonnesAffichables),
		false,
	);
}
function _getInfoClasse() {
	let lClasse = GEtatUtilisateur.Navigation.getRessource(
		EGenreRessource.Classe,
	);
	if (
		lClasse !== null &&
		lClasse !== undefined &&
		lClasse.getNumero() !== -1 &&
		lClasse.getGenre() !== EGenreRessource.Aucune
	) {
		return lClasse;
	} else {
		let lService = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Service,
		);
		if (lService !== null && lService !== undefined) {
			let lClasseDuService = lService.classe;
			let lGpeDuService = lService.groupe;
			if (lGpeDuService && lGpeDuService.existeNumero()) {
				lGpeDuService.Genre = EGenreRessource.Groupe;
				return lGpeDuService;
			} else {
				if (lClasseDuService && lClasseDuService.existeNumero()) {
					lClasseDuService.Genre = EGenreRessource.Classe;
					return lClasseDuService;
				} else {
				}
			}
		}
	}
}
class DonneesListe_ChoixAffichageColonnes extends ObjetDonneesListe {
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
					lStrDate = GDate.formatDate(aParams.article.date, "%JJ/%MM/%AAAA");
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
	getHintForce(aParams) {
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
			return ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getColonneTransfertEdition() {
		return DonneesListe_ChoixAffichageColonnes.colonnes.coche;
	}
	surEdition(aParams, V) {
		if (!!aParams.article) {
			aParams.article.estAffiche = !!V;
			aParams.article.setEtat(EGenreEtat.Modification);
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
module.exports = { PageReleveEvaluationsParService };
