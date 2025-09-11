exports.ObjetModule_EDTSaisie = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetGrilleGabarit_1 = require("ObjetGrilleGabarit");
const ObjetHint_1 = require("ObjetHint");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeStatutCours_1 = require("TypeStatutCours");
const ObjetFenetre_SelectionRessourceCours_1 = require("ObjetFenetre_SelectionRessourceCours");
const ObjetRequeteEvaluationCours_1 = require("ObjetRequeteEvaluationCours");
const ObjetRequeteRessourcesSaisieCours_1 = require("ObjetRequeteRessourcesSaisieCours");
const ObjetRequeteSaisieCours_1 = require("ObjetRequeteSaisieCours");
const Type_Diagnostic_1 = require("Type_Diagnostic");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetHtml_1 = require("ObjetHtml");
const CollectionRequetes_1 = require("CollectionRequetes");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetFenetre_SelectionMatiere_1 = require("ObjetFenetre_SelectionMatiere");
const ObjetFenetre_Memo_1 = require("ObjetFenetre_Memo");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class ObjetModule_EDTSaisie {
	constructor(aOptions) {
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.options = {
			instance: null,
			getInterfaceGrille: null,
			getObjetGrille: null,
			getFicheCours: null,
			actionSurValidation: null,
			estEDTAnnuel: false,
			estPlanningParRessource: false,
			autoriserCreationCours: null,
			messageInterruptionCreationCours: null,
			surCreationCours: null,
			surDupliquerCours: null,
			avecRetaillageHoraireGabarit: false,
			saisieGabaritDirecte: false,
			interdireSuppressionDerniereClasse: [
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace),
			ouvrirFenetreMemo: null,
			surDeselectionCours: null,
			remplirMenuContextuelCours: null,
			avecRequeteLibelleCours: false,
			listeMatieresPrimaire: null,
			optionsComboMatieresPrimaire: null,
			contexteFeuilleAppel: false,
		};
		this.setOptions(aOptions);
		this.instance = this.options.instance;
	}
	setOptions(aOptions) {
		Object.assign(this.options, aOptions);
		return this;
	}
	avecMenuContextuel() {
		return (
			this.autorisationEditionCoursAutoriseeSurContexte() &&
			(this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.avecReservationCreneauxLibres,
			) ||
				this._avecDroitModificationCoursEtRessources() ||
				this._estEspaceAvecSaisieLiensVisio())
		);
	}
	autoriserReservationRessourcesDeCours(aCours, aGenreRessource) {
		return (
			this._autoriserModificationCours(aCours) &&
			aCours.ressourcesModifiables &&
			((aGenreRessource === Enumere_Ressource_1.EGenreRessource.Salle &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.modifierSalles,
				)) ||
				(aGenreRessource === Enumere_Ressource_1.EGenreRessource.Materiel &&
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cours.modifierMateriels,
					)))
		);
	}
	initMenuContextuelReservationDeCours(aInstanceMenu, aCours, aGenreRessource) {
		const lThis = this;
		const _evenement = (aSupprimer, aRessource) => {
			if (!aSupprimer) {
				this._surCallbackModificationRessourceFicheCours({
					cours: aCours,
					numeroSemaine: aCours.numeroSemaine,
					genreRessource: aGenreRessource,
					ressourceRemplacee: aRessource,
				});
			} else {
				this._surModificationRessourceCours({
					cours: aCours,
					numeroSemaine: aCours.numeroSemaine,
					genreRessource: aGenreRessource,
					listeRessources: new ObjetListeElements_1.ObjetListeElements(),
					ressourceRemplacee: aRessource,
				});
			}
		};
		function _ajouterCommandeRessource(aSupprimer, aListe, aLibelle) {
			if (aListe && aListe.count() > 1) {
				aInstanceMenu.addSousMenu(
					aLibelle,
					(aSousMenu) => {
						aListe.parcourir(function (aRessource) {
							aSousMenu.addCommande(
								null,
								aRessource.getLibelle(),
							).callbackValidation = _evenement.bind(
								lThis,
								aSupprimer,
								aRessource,
							);
						});
					},
					{ options: { largeurMin: 70 } },
				);
			} else if (aListe && aListe.count() === 1) {
				aInstanceMenu.addCommande(null, aLibelle).callbackValidation =
					_evenement.bind(lThis, aSupprimer, aListe.get(0));
			} else {
				aInstanceMenu.addCommande(null, aLibelle, false);
			}
		}
		if (
			aGenreRessource !== Enumere_Ressource_1.EGenreRessource.Salle &&
			aGenreRessource !== Enumere_Ressource_1.EGenreRessource.Materiel
		) {
			return;
		}
		const lPourSalle =
				aGenreRessource === Enumere_Ressource_1.EGenreRessource.Salle,
			lListe = this._getListeRessourcesDeCoursPourReservation(
				aCours,
				aGenreRessource,
			);
		_ajouterCommandeRessource(
			false,
			lListe,
			lPourSalle
				? ObjetTraduction_1.GTraductions.getValeur("SaisieCours.RemplacerSalle")
				: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.RemplacerMateriel",
					),
		);
		aInstanceMenu.addCommande(
			null,
			lPourSalle
				? ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ReserverSalleSupp",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ReserverMateriel",
					),
			!!lListe,
		).callbackValidation = _evenement.bind(this, false, null);
		_ajouterCommandeRessource(
			true,
			lListe,
			lPourSalle
				? ObjetTraduction_1.GTraductions.getValeur("SaisieCours.SupprimerSalle")
				: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.SupprimerMateriel",
					),
		);
	}
	initMenuContextuelModifMatiere(aInstanceMenu, aCours) {
		if (!aCours || !aInstanceMenu) {
			return;
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		) {
			return;
		}
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierMatieres,
			) &&
			aCours.matiereModifiable
		) {
			aInstanceMenu.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.RemplacerParCours",
				),
				true,
				() => {
					this._surCallbackModificationRessourceFicheCours({
						cours: aCours,
						numeroSemaine: aCours.numeroSemaine,
						genreRessource: Enumere_Ressource_1.EGenreRessource.Matiere,
						ressourceRemplacee: aCours.matiere,
					});
				},
				{ ariaHasPopup: "dialog" },
			);
		}
		if (aCours.listeMatSaisieEPI && aCours.listeMatSaisieEPI.count() > 0) {
			this._ajouterCommandeModifierMatiere(
				aInstanceMenu,
				aCours,
				aCours.listeMatSaisieEPI,
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.RemplacerParCoursEPI",
				),
			);
		}
		if (aCours.listeMatSaisieAP && aCours.listeMatSaisieAP.count() > 0) {
			this._ajouterCommandeModifierMatiere(
				aInstanceMenu,
				aCours,
				aCours.listeMatSaisieAP,
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.RemplacerParCoursAP",
				),
			);
		}
		if (
			aCours.listeMatSaisieAutres &&
			aCours.listeMatSaisieAutres.count() > 0
		) {
			this._ajouterCommandeModifierMatiere(
				aInstanceMenu,
				aCours,
				aCours.listeMatSaisieAutres,
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.RemplacerParCours",
				),
			);
		}
	}
	initMenuContextuelSupprimer(
		aInstanceMenu,
		aCours,
		aUniquementAvecAnnulation,
	) {
		if (this._autoriserSuppressionCours(aUniquementAvecAnnulation, aCours)) {
			aInstanceMenu.add(
				aCours.modifAnnulable
					? ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.AnnulerModification",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.SupprimerCours",
						),
				true,
				() => {
					this._surSuppressionCours(aCours, aCours.numeroSemaine);
				},
			);
		}
	}
	async remplirCoursInfoModifierMatiereCoursPromise(aCours) {
		if (
			aCours &&
			aCours.modifMatieres &&
			aCours.modifMatieres.classes &&
			aCours.matiere
		) {
			const lReponse =
				await new ObjetRequeteInfoModifierMatiereCours().lancerRequete({
					cours: aCours,
					matiere: aCours.matiere,
					semaine: aCours.modifMatieres.semaine,
					classes: aCours.modifMatieres.classes.setSerialisateurJSON({
						ignorerEtatsElements: true,
					}),
				});
			if (lReponse.resultat) {
				aCours.modifMatieres = null;
				Object.assign(aCours, lReponse.resultat);
			}
		}
	}
	afficherMenuContextuelDeCoursGrille(aCours, aForcerNavigationClavier) {
		if (!aCours) {
			return;
		}
		const lThis = this;
		this.remplirCoursInfoModifierMatiereCoursPromise(aCours).then(() => {
			ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
				pere: lThis.instance,
				evenement: function (aLigne) {},
				initCommandes: function (aMenu) {
					lThis._remplirMenuContextuelCoursGrille(
						aMenu,
						aCours,
						aForcerNavigationClavier,
					);
				},
			});
		});
	}
	afficherDomaineClotureCalendrier() {
		return (
			this.autorisationEditionCoursAutoriseeSurContexte() &&
			this._avecDroitModificationCoursEtRessources()
		);
	}
	requeteEvaluation(aCours, aDomaineEvaluation) {
		return new ObjetRequeteEvaluationCours_1.ObjetRequeteEvaluationCours(this)
			.lancerRequete({
				cours: aCours,
				matiere: aCours.matiere,
				duree: aCours.duree,
				domaine: aDomaineEvaluation,
				numeroSemaineCours: aCours.numeroSemaine,
				estEDTAnnuel: this.options.estEDTAnnuel,
			})
			.then((aJSON) => {
				this._reponseRequeteEvaluationCours(
					aJSON,
					aCours,
					null,
					aDomaineEvaluation,
				);
			});
	}
	autorisationEditionCoursAutoriseeSurContexte() {
		return [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
		].includes(this.etatUtilisateurSco.GenreEspace);
	}
	getDonneesFicheCours() {
		const lFicheCoursNonEditable =
			!this.autorisationEditionCoursAutoriseeSurContexte();
		return {
			nonEditable: lFicheCoursNonEditable,
			avecModificationCoursPossible:
				this._avecModificationCoursPossible.bind(this),
			avecModificationMemoPossible:
				this._avecModificationMemoPossible.bind(this),
			callbackModificationRessource: lFicheCoursNonEditable
				? null
				: this._surCallbackModificationRessourceFicheCours.bind(this),
			callbackSuppressionRessource: lFicheCoursNonEditable
				? null
				: this._surModificationRessourceCours.bind(this),
			suppressionCoursVisible: (aCours) => {
				return (
					!!aCours &&
					([
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
					].includes(this.etatUtilisateurSco.GenreEspace) ||
						aCours.getGenre() ===
							TypeStatutCours_1.TypeStatutCours.EnseignementRemplacement)
				);
			},
			suppressionCoursActif: this._autoriserSuppressionCours.bind(this, false),
			callbackSuppressionCours: lFicheCoursNonEditable
				? null
				: this._surCallbackSuppressionCours.bind(this),
			rechercheCreneauLibrePossible:
				this._rechercheCreneauLibrePossible.bind(this),
			rechercheCreneauLibreActif: this._rechercheCreneauLibreActif.bind(this),
			callbackDeplacerCoursAutreSemaine: this._callbackCreneauLibre.bind(this, {
				sallesIgnorees: true,
			}),
			ouvrirFenetreMemo: this._ouvrirFenetreMemo.bind(this),
			callbackSaisieMemo: (aCours, aMemo) => {
				this.saisieMemoCours(aCours, aMemo);
			},
			callbackSaisieVisios: () => {
				this._actualisationApresValidation();
			},
		};
	}
	surModificationRessourceCours(aParametres) {
		return this._surModificationRessourceCours(aParametres);
	}
	saisieMemoCours(aCours, aMemo) {
		this._requeteSaisieCours(
			{
				cours: aCours,
				numeroSemaine: aCours.numeroSemaine,
				modificationMemo: aMemo,
			},
			aCours,
			aCours.numeroSemaine,
		);
	}
	sortieModeDiagnosticRestaurerOptions() {
		if (this.instance.donneesGrille.modeDiagnostic) {
			this.instance.donneesGrille.modeDiagnostic = false;
			this.instance.donneesGrille.diagnostic = null;
		}
	}
	sortieModeDiagnostic() {
		if (this.instance.donneesGrille.modeDiagnostic) {
			this.sortieModeDiagnosticRestaurerOptions();
			const lInstanceGrille = this.options.getInterfaceGrille(),
				lCoursSelection = this.instance.paramCours
					? this.instance.paramCours.cours
					: null;
			lInstanceGrille.setDonnees(this.instance.donneesGrille, (aGrille) => {
				if (lCoursSelection) {
					aGrille.selectionnerCours(lCoursSelection, false, true);
				}
			});
		}
	}
	mouseDownPlaceGrille(aEstGrilleMS, aParams) {
		const lEtaitDiagno = this.instance.donneesGrille.modeDiagnostic;
		this.sortieModeDiagnostic();
		if (lEtaitDiagno) {
			const lFicheCours = this.options.getFicheCours
				? this.options.getFicheCours()
				: null;
			if (lFicheCours && lFicheCours.estAffiche()) {
				lFicheCours.actualiserFicheCours({
					avecDiagnosticRessource: false,
					listeCoursDiagnostic: null,
					diagnosticPlace: null,
					id: null,
					positionCours: null,
				});
			}
		} else {
			if (
				this.options.autoriserCreationCours &&
				this.options.autoriserCreationCours()
			) {
				const lGabarit = this._creerGabaritSurCreationDeCours();
				lGabarit.demarrerCreation({
					place: aParams.place,
					deplacementMinPourAffichage: 12,
					event: aParams.event,
					avecInterruptionApresDeplacement: true,
					hintInterruptionCreation: (aPlace) => {
						let lMessage = "";
						if (this.options.messageInterruptionCreationCours) {
							lMessage = this.options.messageInterruptionCreationCours(aPlace);
						}
						return lMessage;
					},
				});
			}
		}
	}
	surLongTouchGrille(aParams) {
		if (this.instance.donneesGrille.modeDiagnostic) {
			this.sortieModeDiagnostic();
			return false;
		}
		if (
			!this.options.autoriserCreationCours ||
			!this.options.autoriserCreationCours()
		) {
			return false;
		}
		let lPlace = aParams.placeGrille;
		const lGrille = aParams.grille;
		if (this.options.messageInterruptionCreationCours) {
			const lMessage = this.options.messageInterruptionCreationCours(lPlace);
			if (lMessage) {
				this.applicationSco.getMessage().afficher({ message: lMessage });
				return false;
			}
		}
		const lDureeDemarrage = 2,
			lTrancheHoraire = lGrille.getTrancheHoraireDePlace(lPlace);
		for (
			let lIHoraire = lTrancheHoraire.horaire + lDureeDemarrage - 1;
			lIHoraire > lTrancheHoraire.horaire;
			lIHoraire--
		) {
			if (
				lIHoraire >= lGrille.getOptions().blocHoraires.nbHoraires() ||
				lGrille.getOptions().blocHoraires.rechercheHoraire(lIHoraire)
					.tailleGouttiere > 0
			) {
				lPlace -= 1;
				break;
			}
		}
		const lGabarit = this._creerGabaritSurCreationDeCours();
		lGabarit.demarrerCreation({
			place: lPlace,
			placeFin: lPlace + lDureeDemarrage - 1,
			event: aParams.event,
		});
		return true;
	}
	supprimerListeCours(aParams) {
		const lParams = Object.assign(
			{ listeCours: null, numeroSemaine: -1, message: "" },
			aParams,
		);
		if (
			!lParams.listeCours ||
			lParams.listeCours.count() === 0 ||
			!lParams.numeroSemaine
		) {
			return Promise.reject();
		}
		return this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message:
					lParams.message +
					this._getDetailMessageSuppressionListeCours(lParams.listeCours),
			})
			.then((aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					return this._requeteSaisieCours(
						{
							suppressionListeCours: true,
							listeCours: lParams.listeCours,
							numeroSemaine: lParams.numeroSemaine,
						},
						null,
						lParams.numeroSemaine,
					);
				}
			});
	}
	retablirListeCoursPrimaire(aParams) {
		const lParams = Object.assign(
			{ listeCours: null, numeroSemaine: -1, message: "" },
			aParams,
		);
		if (
			!lParams.listeCours ||
			lParams.listeCours.count() === 0 ||
			!lParams.numeroSemaine
		) {
			return Promise.reject();
		}
		return this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message:
					lParams.message +
					this._getDetailMessageSuppressionListeCours(lParams.listeCours),
			})
			.then((aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					return this._requeteSaisieCours(
						{
							retablirListeCoursPrimaire: true,
							listeCours: lParams.listeCours,
							numeroSemaine: lParams.numeroSemaine,
						},
						null,
						lParams.numeroSemaine,
					);
				}
			});
	}
	_autoriserModificationCours(aCours) {
		return (
			aCours && aCours.modifiable && this._avecModificationCoursPossible(aCours)
		);
	}
	_avecModificationCoursPossible(aCours) {
		return (
			this.autorisationEditionCoursAutoriseeSurContexte() &&
			aCours.getGenre() !== TypeStatutCours_1.TypeStatutCours.ConseilDeClasse &&
			!aCours.coursDuplique &&
			(this.options.estEDTAnnuel ||
				!this.parametresSco.domaineVerrou.getValeur(aCours.numeroSemaine)) &&
			(this.options.estEDTAnnuel ||
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
					aCours.numeroSemaine,
				))
		);
	}
	_getListeRessourcesDeCoursPourReservation(aCours, aGenreRessource) {
		if (this.autoriserReservationRessourcesDeCours(aCours, aGenreRessource)) {
			return aCours.ListeContenus.getListeElements((aContenu) => {
				return aContenu.getGenre() === aGenreRessource;
			});
		}
		return null;
	}
	_ajouterCommandeModifierMatiere(aInstanceMenu, aCours, aListe, aTraduction) {
		const _modifMatiere = (aMatiere) => {
			this._surModificationRessourceCours({
				cours: aCours,
				numeroSemaine: aCours.numeroSemaine,
				genreRessource: Enumere_Ressource_1.EGenreRessource.Matiere,
				listeRessources:
					new ObjetListeElements_1.ObjetListeElements().addElement(aMatiere),
				ressourceRemplacee: null,
			});
		};
		if (aListe.count() === 1) {
			aInstanceMenu.addCommande(
				null,
				ObjetChaine_1.GChaine.format("%s « %s »", [
					aTraduction,
					aListe.getLibelle(0),
				]),
			).callbackValidation = _modifMatiere.bind(this, aListe.get(0));
		} else {
			aListe.trier();
			aInstanceMenu.addSousMenu(
				aTraduction,
				(aSousMenu) => {
					aListe.parcourir((aMatiere) => {
						aSousMenu.addCommande(
							null,
							aMatiere.getLibelle(),
						).callbackValidation = _modifMatiere.bind(this, aMatiere);
					});
				},
				{ options: { largeurMin: 70 } },
			);
		}
	}
	_autoriserSuppressionCours(aUniquementAvecAnnulation, aCours) {
		return (
			((aCours.supprimable && !aUniquementAvecAnnulation) ||
				aCours.modifAnnulable) &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			) &&
			!aCours.coursDuplique &&
			(this.options.estEDTAnnuel ||
				(!this.parametresSco.domaineVerrou.getValeur(aCours.numeroSemaine) &&
					this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
						aCours.numeroSemaine,
					)))
		);
	}
	_rechercheCreneauLibrePossible() {
		return (
			this.etatUtilisateurSco.getUtilisateur().getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Enseignant &&
			this.etatUtilisateurSco.ongletEstVisible(
				Enumere_Onglet_1.EGenreOnglet.CreneauxLibres,
			)
		);
	}
	_rechercheCreneauLibreActif(aCours) {
		return (
			aCours.modifiable &&
			this._rechercheCreneauLibrePossible() &&
			!this.parametresSco.domaineVerrou.getValeur(aCours.numeroSemaine) &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			)
		);
	}
	_estEspaceAvecSaisieLiensVisio() {
		return [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
		].includes(this.etatUtilisateurSco.GenreEspace);
	}
	_callbackCreneauLibre(aParams, aCours) {
		this.etatUtilisateurSco._rechercheCreneauLibre = {
			coursAnnule: aCours,
			numeroSemaine: aCours.numeroSemaine,
			sallesIgnorees: !!(aParams && aParams.sallesIgnorees),
		};
		this.etatUtilisateurSco.setSemaineSelectionnee(aCours.numeroSemaine);
		this.applicationSco
			.getInterfaceEspace()
			.changementManuelOnglet(Enumere_Onglet_1.EGenreOnglet.CreneauxLibres);
	}
	_estCoursAvecCDT(aCours) {
		return !!aCours && (!!aCours.avecCDT || !!aCours.cahierDeTextes);
	}
	_scinderCours(aCours) {
		const H = [
			IE.jsx.str(
				"div",
				{ style: "display:flex; align-items:center;" },
				IE.jsx.str(
					"div",
					{ class: "EspaceDroit" },
					"GTraductions.getValeur('SaisieCours.DureePremierCours')",
				),
				IE.jsx.str("ie-combo", {
					"ie-model": "combo",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.DureePremierCours",
					),
				}),
			),
		];
		if (this._estCoursAvecCDT(aCours)) {
			H.push(
				"<br><br>" +
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.MessageCDTSurCours",
					),
			);
		}
		const lDuree = aCours.Fin - aCours.Debut + 1;
		let lDureeSelection = Math.floor(lDuree / 2);
		const lListeDuree = new ObjetListeElements_1.ObjetListeElements();
		for (let lDureePlace = 1; lDureePlace < lDuree; lDureePlace++) {
			lListeDuree.addElement(
				new ObjetElement_1.ObjetElement(
					ObjetDate_1.GDate.formatDureeEnPlaces(lDureePlace),
					lDureePlace,
				),
			);
		}
		const lControleur = {
			combo: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({ longueur: 40 });
				},
				getDonnees: function (aDonnees) {
					if (aDonnees) {
						return;
					}
					return lListeDuree;
				},
				getIndiceSelection: function () {
					return lListeDuree.getIndiceParElement(
						new ObjetElement_1.ObjetElement("", lDureeSelection),
					);
				},
				event: function (aParametres, aInstanceCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element &&
						aInstanceCombo.estUneInteractionUtilisateur()
					) {
						lDureeSelection = aParametres.element.getNumero();
					}
				},
				getDisabled: function () {
					return !lListeDuree || lListeDuree.count() <= 1;
				},
			},
		};
		this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				titre: ObjetChaine_1.GChaine.insecable(
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.TitreConfirmerScinder",
					),
				),
				message: H.join(""),
				controleur: lControleur,
			})
			.then((aGenreAction) => {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					return this._requeteSaisieCours(
						{
							scinderCours: true,
							scinderCoursDuree: lDureeSelection,
							cours: aCours,
							numeroSemaine: aCours.numeroSemaine,
						},
						aCours,
						aCours.numeroSemaine,
					);
				}
			});
	}
	_avecModificationMemoPossible(aCours) {
		return (
			aCours &&
			aCours.memoModifiable &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			) &&
			this._avecModificationCoursPossible(aCours) &&
			!this.options.estEDTAnnuel
		);
	}
	_ouvrirFenetreMemo(aParams) {
		const lAvecEdition =
			!aParams.nonEditable && this._avecModificationMemoPossible(aParams.cours);
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Memo_1.ObjetFenetre_Memo,
			{ pere: this },
			{ identConservationCoordonnees: "ObjetFenetre_Memo" },
		).setDonnees({
			contenu: aParams.cours.memo,
			nonEditable: !lAvecEdition,
			callback: (aNumeroBouton, aMemo) => {
				if (lAvecEdition && aNumeroBouton === 1) {
					this.saisieMemoCours(aParams.cours, aMemo);
				}
			},
		});
	}
	_remplirMenuContextuelCoursGrille(
		aInstanceMenu,
		aCours,
		aForcerNavigationClavier,
	) {
		const lThis = this;
		let lCommande;
		if (
			ObjetNavigateur_1.Navigateur.isToucheMenuContextuel() ||
			aForcerNavigationClavier
		) {
			const lPlace = aCours.Debut;
			const lGrille = this.options.getObjetGrille();
			const lPosition = lGrille.getPositionDePlace(lPlace);
			const lElementGrille = ObjetHtml_1.GHtml.getElement(
				lGrille.getIdCellulePrefixe(),
			);
			if (lElementGrille) {
				ObjetNavigateur_1.Navigateur.positionnerMenuContextuelSurId(
					lElementGrille,
					(lPosition.x + 1) * lGrille.largeurCellule,
					lPosition.y * lGrille.hauteurCellule,
				);
			}
		}
		if (this.options.remplirMenuContextuelCours) {
			this.options.remplirMenuContextuelCours(aInstanceMenu, aCours);
		}
		if (
			!this.options.contexteFeuilleAppel &&
			this._estEspaceAvecSaisieLiensVisio() &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			) &&
			!!aCours &&
			!!aCours.urlCoursModifiable
		) {
			lCommande = aInstanceMenu.addCommande(
				0,
				ObjetTraduction_1.GTraductions.getValeur("SaisieCours.AssocierURL"),
				true,
			);
			lCommande.setCallback(() => {
				UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirFenetreEditionVisiosCours(
					aCours,
					this._actualisationApresValidation.bind(this),
				);
			});
			lCommande.icon =
				UtilitaireVisiosSco_1.UtilitaireVisios.getNomIconeParametrageVisios();
			aInstanceMenu.avecSeparateurSurSuivant();
		}
		if (
			!this.options.contexteFeuilleAppel &&
			this._avecModificationMemoPossible(aCours)
		) {
			lCommande = aInstanceMenu.add(
				aCours.memo
					? ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.ModifierMemoCours",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.CreerMemoCours",
						),
				true,
				() => {
					this._ouvrirFenetreMemo({ cours: aCours });
				},
				{ ariaHasPopup: "dialog" },
			);
			aInstanceMenu.avecSeparateurSurSuivant();
		}
		if (
			!this.options.contexteFeuilleAppel &&
			this._autoriserModificationCours(aCours) &&
			aCours.Fin - aCours.Debut > 0 &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.deplacerCours,
			) &&
			!this.options.estEDTAnnuel
		) {
			lCommande = aInstanceMenu.add(
				ObjetTraduction_1.GTraductions.getValeur("SaisieCours.ScinderLeCours"),
				true,
				this._scinderCours.bind(this, aCours),
			);
			aInstanceMenu.avecSeparateurSurSuivant();
		}
		if (
			!this.options.contexteFeuilleAppel &&
			this._rechercheCreneauLibrePossible() &&
			!!aCours.modifiable
		) {
			lCommande = aInstanceMenu.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"CreneauxLibres.RechercherCreneauLibre",
				),
				this._rechercheCreneauLibreActif(aCours),
				() => {
					this._callbackCreneauLibre(null, aCours);
				},
			);
			aInstanceMenu.avecSeparateurSurSuivant();
		}
		if (
			this.autoriserReservationRessourcesDeCours(
				aCours,
				Enumere_Ressource_1.EGenreRessource.Salle,
			)
		) {
			lCommande = aInstanceMenu.addSousMenu(
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ReservationDeSalles",
				),
				(aSousMenu) => {
					lThis.initMenuContextuelReservationDeCours(
						aSousMenu,
						aCours,
						Enumere_Ressource_1.EGenreRessource.Salle,
					);
				},
			);
			lCommande.icon = "icon_reservation_salle";
		}
		if (
			!this.options.contexteFeuilleAppel &&
			this.autoriserReservationRessourcesDeCours(
				aCours,
				Enumere_Ressource_1.EGenreRessource.Materiel,
			)
		) {
			lCommande = aInstanceMenu.addSousMenu(
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ReservationDeMateriels",
				),
				(aSousMenu) => {
					lThis.initMenuContextuelReservationDeCours(
						aSousMenu,
						aCours,
						Enumere_Ressource_1.EGenreRessource.Materiel,
					);
				},
			);
			lCommande.icon = "icon_reservation_materiel";
		}
		aInstanceMenu.avecSeparateurSurSuivant();
		if (!this.options.contexteFeuilleAppel) {
			this.initMenuContextuelModifMatiere(aInstanceMenu, aCours);
		}
		aInstanceMenu.avecSeparateurSurSuivant();
		if (!this.options.contexteFeuilleAppel && aCours.dupliquable) {
			aInstanceMenu.add(
				ObjetTraduction_1.GTraductions.getValeur("SaisieCours.DupliquerCours"),
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.estEnConsultation,
				),
				() => {
					const lCours = this.options.surDupliquerCours(aCours);
					new ObjetRequeteEvaluationCours_1.ObjetRequeteEvaluationCours(this)
						.lancerRequete({
							estEDTAnnuel: this.options.estEDTAnnuel,
							cours: lCours,
							dupliquerCours: true,
						})
						.then((aJSON) => {
							this._reponseRequeteEvaluationCours(aJSON, lCours, null, null);
						});
				},
			);
			aInstanceMenu.avecSeparateurSurSuivant();
		}
		this.initMenuContextuelSupprimer(aInstanceMenu, aCours);
	}
	_avecDroitModificationCoursEtRessources() {
		return (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierClasses,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierProfesseurs,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierMatieres,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierSalles,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierMateriels,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierMatieresCoursEPIEtAP,
			) ||
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.deplacerCours,
			)
		);
	}
	async _requeteSaisieCours(aParam, aCours, aNumeroSemaine) {
		const lParams = Object.assign({}, aParam, {
			estEDTAnnuel: this.options.estEDTAnnuel,
		});
		const lResult = await new ObjetRequeteSaisieCours_1.ObjetRequeteSaisieCours(
			this,
		).lancerRequete(lParams);
		return this._surReponseRequeteSaisieCours(
			aParam,
			aCours,
			aNumeroSemaine,
			lResult,
		);
	}
	async _surModificationRessourceCours(aParametres) {
		const lParametres = {
			cours: null,
			genreRessource: null,
			listeRessources: null,
			ressourceRemplacee: null,
			numeroSemaine: aParametres.cours.numeroSemaine,
		};
		$.extend(lParametres, aParametres);
		if (lParametres.ressourceRemplacee && lParametres.listeRessources) {
			const lThis = this,
				lEstSuppression = lParametres.listeRessources.count() === 0;
			if (
				(lParametres.genreRessource ===
					Enumere_Ressource_1.EGenreRessource.Materiel ||
					lParametres.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Salle) &&
				lParametres.ressourceRemplacee &&
				lParametres.ressourceRemplacee.nombre > 1
			) {
				const H = [];
				let lInputValue = lParametres.ressourceRemplacee.nombre;
				let lNombreSaisie = lInputValue;
				const lControleur = {
					inputNb: {
						getValue: function () {
							return lInputValue;
						},
						setValue: function (aValue) {
							lInputValue = aValue;
						},
						exitChange: function (aValue) {
							lInputValue = parseInt(aValue || "0", 10);
							if (
								lInputValue < 1 ||
								lInputValue > lParametres.ressourceRemplacee.nombre
							) {
								lInputValue = lParametres.ressourceRemplacee.nombre;
								ObjetHint_1.ObjetHint.start(
									ObjetTraduction_1.GTraductions.getValeur(
										"ErreurMinMaxEntier",
										[1, lParametres.ressourceRemplacee.nombre],
									),
									{
										sansDelai: true,
										position: {
											x:
												ObjetPosition_1.GPosition.getLeft(this.node) +
												ObjetPosition_1.GPosition.getWidth(this.node) +
												2,
											y: ObjetPosition_1.GPosition.getTop(this.node) - 3,
										},
									},
								);
								return;
							}
							lNombreSaisie = lInputValue;
						},
					},
				};
				H.push(
					lEstSuppression
						? ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.ConfirmezRetraitDe",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.ConfirmezRemplacementDe",
							),
				);
				H.push(
					'<input ie-model="inputNb" ie-mask="/[^0-9]/i" maxlength="',
					lParametres.ressourceRemplacee.nombre.toString().length,
					'"',
					' style="width:25px;',
					ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
					'margin-left:3px; margin-right:3px;"/>',
				);
				H.push(
					lParametres.ressourceRemplacee.getLibelle() +
						(lEstSuppression
							? " ?"
							: " " +
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieCours.ConfirmezRemplacementPar",
								)),
				);
				const lRemplacements = {};
				lParametres.listeRessources.parcourir((aRessource) => {
					if (!lRemplacements[aRessource.getLibelle()]) {
						lRemplacements[aRessource.getLibelle()] = 0;
					}
					lRemplacements[aRessource.getLibelle()] += 1;
				});
				for (const lLibelle in lRemplacements) {
					H.push(
						ObjetChaine_1.GChaine.format(
							"<br>&nbsp;&nbsp;&nbsp;&nbsp;-&nbsp;%d %s",
							[lRemplacements[lLibelle], lLibelle],
						),
					);
				}
				const lGenreAction = await this.applicationSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: H.join(""),
						controleur: lControleur,
					});
				if (lGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
					return;
				}
				const lMateriel = lParametres.ressourceRemplacee;
				lParametres.ressourceRemplacee =
					new ObjetListeElements_1.ObjetListeElements();
				for (let i = 1; i <= lNombreSaisie; i++) {
					lParametres.ressourceRemplacee.addElement(lMateriel);
				}
				lThis._requeteSaisieCours(
					lParametres,
					lParametres.cours,
					lParametres.cours.numeroSemaine,
				);
				return;
			}
			if (lEstSuppression) {
				if (
					this.options.interdireSuppressionDerniereClasse &&
					lParametres.genreRessource ===
						Enumere_Ressource_1.EGenreRessource.Classe
				) {
					let lNbClasses = 0;
					lParametres.cours.ListeContenus.parcourir((aRess) => {
						if (
							aRess.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
						) {
							lNbClasses += 1;
						}
					});
					if (lNbClasses < 2) {
						this.applicationSco
							.getMessage()
							.afficher({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"SaisieCours.SuppressionImpossible",
								),
								message: ObjetTraduction_1.GTraductions.getValeur(
									"SaisieCours.InterdireSuppDerniereClasse",
								),
							});
						return;
					}
				}
				const lGenreAction = await this.applicationSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.ConfirmerSuppressionRessource",
							),
							[aParametres.ressourceRemplacee.getLibelle()],
						),
					});
				if (lGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
					return;
				}
				lThis._requeteSaisieCours(
					lParametres,
					lParametres.cours,
					lParametres.cours.numeroSemaine,
				);
				return;
			}
		}
		this._requeteSaisieCours(
			lParametres,
			lParametres.cours,
			lParametres.cours.numeroSemaine,
		);
	}
	_surCallbackSuppressionCours(aCours, aNumeroSemaine) {
		this._surSuppressionCours(aCours, aNumeroSemaine);
	}
	_surSuppressionCours(aCours, aNumeroSemaine) {
		const lLibelleDebut = aCours.genants
			? ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.CoursAnnuelModifieDate",
				) + this._getLibelleTabCoursGenants(aCours.genants)
			: "";
		if (aCours.dateEffetPoseImpossible) {
			return this.applicationSco
				.getMessage()
				.afficher({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.SuppressionImpossible",
					),
					message:
						lLibelleDebut +
						ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.MessageDateEffetCoursAnnuelImpossible",
						),
				});
		}
		let lMessage = "";
		if (MethodesObjet_1.MethodesObjet.isDate(aCours.dateEffetDebut)) {
			lMessage =
				lLibelleDebut +
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MessageModifCoursDateEffet",
				) +
				"<br><br>" +
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ConfirmerSuppressionCoursDateEffet",
					[
						ObjetDate_1.GDate.formatDate(
							aCours.dateEffetDebut,
							"%JJ/%MM/%AAAA",
						),
					],
				);
		} else {
			lMessage = aCours.supprimable
				? ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ConfirmerSuppressionCours",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ConfirmerAnnulationModificationCours",
					);
		}
		if (this._estCoursAvecCDT(aCours)) {
			lMessage +=
				"<br><br>" +
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MessageCDTSurCours",
				);
		} else if (aCours.nbCDT > 0) {
			lMessage += "<br><br>" + this._getMessageSuppressionNbCDT(aCours.nbCDT);
		}
		return this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: lMessage,
			})
			.then((aNon) => {
				if (aNon) {
					return;
				}
				return this._requeteSaisieCours(
					{
						suppressionCours: true,
						cours: aCours,
						numeroSemaine: aNumeroSemaine,
					},
					null,
					aNumeroSemaine,
				);
			});
	}
	async _surReponseRequeteSaisieCours(
		aParametresSaisie,
		aCours,
		aNumeroSemainePlacement,
		aParamsRequete,
	) {
		const lRapportSaisie = aParamsRequete.JSONRapportSaisie;
		if (lRapportSaisie && lRapportSaisie.refusSaisie) {
			this.sortieModeDiagnostic();
			return;
		}
		if (
			aParamsRequete.genreReponse ===
				ObjetRequeteJSON_1.EGenreReponseSaisie.succes &&
			lRapportSaisie &&
			lRapportSaisie.demandeConfirmationSaisie
		) {
			const lGenreAction = await this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					titre: lRapportSaisie.demandeConfirmationSaisie.titre || "",
					message: ObjetChaine_1.GChaine.replaceRCToHTML(
						lRapportSaisie.demandeConfirmationSaisie.message,
					),
				});
			if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
				aParametresSaisie.forcerSaisie = true;
				return this._requeteSaisieCours(
					aParametresSaisie,
					aCours,
					aNumeroSemainePlacement,
				);
			}
			return;
		}
		if (this.instance.paramCours) {
			this.instance.paramCours = {};
		}
		if (this.options.surDeselectionCours) {
			this.options.surDeselectionCours();
		}
		this.etatUtilisateurSco._coursASelectionner = lRapportSaisie.cours
			? lRapportSaisie.cours
			: aCours;
		if (this.etatUtilisateurSco._coursASelectionner) {
			this.etatUtilisateurSco._coursASelectionner.numeroSemaine =
				aNumeroSemainePlacement;
		}
		this._actualisationApresValidation();
	}
	_actualisationApresValidation() {
		if (this.options.actionSurValidation) {
			this.options.actionSurValidation();
		} else {
			this.instance.actionSurValidation();
		}
	}
	_callbackMenuContextuelGabarit(aParams) {
		const lRapport = this._getRapportDiagnostic(aParams);
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: (aInstance) => {
				aInstance.add(
					ObjetNavigateur_1.Navigateur.isTactile
						? ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.PlacerCours",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.Gabarit.DblClickPlacerCours",
							),
					!!(lRapport === null || lRapport === void 0
						? void 0
						: lRapport.action),
					() => {
						this._callbackPoseGabarit(aParams);
					},
				);
			},
		});
	}
	_creerGabarit(aParams, aOptionsGabarit) {
		const lGabarit = new ObjetGrilleGabarit_1.ObjetGrilleGabarit();
		const lCoursSelectionne = this.instance.paramCours
			? this.instance.paramCours.cours
			: null;
		const lGrille = this.options.getObjetGrille();
		const lParams = Object.assign(
			{ domaineEvaluation: null, positionGabarit: null },
			aParams,
		);
		lGabarit.setOptions(
			Object.assign(
				{
					avecRetaillageHoraire:
						!lCoursSelectionne ||
						lCoursSelectionne.getEtat() ===
							Enumere_Etat_1.EGenreEtat.Creation ||
						(this.options.avecRetaillageHoraireGabarit &&
							(!lCoursSelectionne || !lCoursSelectionne.coursDuplique)),
					hint: this.options.saisieGabaritDirecte
						? ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.Gabarit.ClickGabaritPlacerCours",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"SaisieCours.Gabarit.DblClickPlacerCours",
							),
					class: this.options.saisieGabaritDirecte
						? "AvecMain"
						: "Curseur_DoubleClick",
					couleurTrait: GCouleur.grille.gabarit,
					tailleTraitMax: 3,
					callbackPositionner: function (aParams) {
						lGrille.surPositionnerGabarit(aParams);
					},
					deplacementAutorise: (aParams) => {
						if (
							this.options.estPlanningParRessource &&
							lGabarit.cours &&
							lGabarit.cours.ressource
						) {
							return (
								lGrille
									.getConvertisseurPosition()
									.getNumerosTranchesDeRessource(lGabarit.cours.ressource)
									.indexOf(
										lGrille.getTrancheHoraireDePlace(aParams.place).tranche,
									) >= 0
							);
						}
						return true;
					},
					callbackDeplacement: this._callbackDeplacementGabarit.bind(this),
					callbackFinDeplacement: this.options.saisieGabaritDirecte
						? this._callbackPoseGabarit.bind(this)
						: null,
					callbackModificationTaille:
						this._callbackModificationTailleGabarit.bind(
							this,
							lParams.domaineEvaluation,
						),
					callbackDoubleClic: this._callbackPoseGabarit.bind(this),
					callbackMenuContextuel:
						this._callbackMenuContextuelGabarit.bind(this),
					surMiseAJour: function (aGabarit) {
						lGabarit.visible =
							!!lCoursSelectionne &&
							lGrille.getParametrsGrille().modeDiagnostic;
						if (!lGabarit.visible) {
							aGabarit.init();
							return;
						}
						if (lCoursSelectionne) {
							lGabarit.cours = lCoursSelectionne;
						}
						if (lParams.positionGabarit) {
							lGabarit.placeDebut = lParams.positionGabarit.place;
							lGabarit.placeFin =
								lParams.positionGabarit.place +
								lParams.positionGabarit.duree -
								1;
						} else if (lCoursSelectionne) {
							lGabarit.placeDebut = lGrille
								.getConvertisseurPosition()
								.getPlaceDebutCours(lCoursSelectionne);
							lGabarit.placeFin = lGrille
								.getConvertisseurPosition()
								.getPlaceFinCours(lCoursSelectionne);
						}
					},
				},
				aOptionsGabarit,
			),
		);
		return lGabarit;
	}
	_reponseRequeteEvaluationCours(
		aJSON,
		aCours,
		aParamsGabarit,
		aDomaineEvaluation,
	) {
		this.instance.donneesGrille.diagnostic = aJSON;
		this.instance.donneesGrille.modeDiagnostic = true;
		const lGrille = this.options.getObjetGrille();
		const lGetCoursCopieDePlace = function (aPlace) {
			const lCoursCopie = MethodesObjet_1.MethodesObjet.dupliquer(aCours);
			const lDuree = aCours.Fin - aCours.Debut + 1;
			lCoursCopie.Debut = aPlace;
			lCoursCopie.Fin = lCoursCopie.Debut + lDuree - 1;
			return lCoursCopie;
		};
		let lPlaceDiagnostic = aParamsGabarit
			? lGrille
					.getConvertisseurPosition()
					.getPlaceHebdoDePlaceGrille(aParamsGabarit.place)
			: aCours.Debut;
		let lPositionGabarit = aParamsGabarit;
		if (
			aJSON.meilleurePlace >= 0 &&
			MethodesObjet_1.MethodesObjet.isNumber(aJSON.meilleurePlace)
		) {
			lPlaceDiagnostic = aJSON.meilleurePlace;
			lPositionGabarit = {
				place: lGrille
					.getConvertisseurPosition()
					.getPlaceDebutCours(lGetCoursCopieDePlace(lPlaceDiagnostic)),
				duree: aCours.Fin - aCours.Debut + 1,
			};
		}
		this._actualiserDiagnosticFicheCours(
			aCours,
			this._getDiagnosticDePlaceEtSemaine(
				lPlaceDiagnostic,
				aCours.numeroSemaine,
			),
			this.instance.paramCours.id,
			aParamsGabarit
				? aParamsGabarit
				: {
						place: lGrille
							.getConvertisseurPosition()
							.getPlaceDebutCours(lGetCoursCopieDePlace(lPlaceDiagnostic)),
						duree: aCours.Fin - aCours.Debut + 1,
					},
		);
		let lGabarit = null;
		if (aCours) {
			lGabarit = this._creerGabarit({
				domaineEvaluation: aDomaineEvaluation || null,
				positionGabarit: lPositionGabarit,
			});
		}
		aJSON.places.ressourceDiagnostic = aCours.ressource;
		const lParametresGrille = {
			diagnosticPlaces: aJSON.places,
			gabarit: lGabarit,
		};
		$.extend(lParametresGrille, this.instance.donneesGrille);
		this.options
			.getInterfaceGrille()
			.setDonnees(lParametresGrille, (aGrille) => {
				aGrille.selectionnerCours(aCours, false, true);
			});
	}
	_callbackDeplacementGabarit(aParam) {
		if (!this.instance.donneesGrille.modeDiagnostic) {
			aParam.gabarit.init();
			return;
		}
		const lInstanceGrille = this.options.getObjetGrille();
		const lPlace = lInstanceGrille
			.getConvertisseurPosition()
			.getPlaceHebdoDePlaceGrille(aParam.place);
		const lSemaine = this.options.estEDTAnnuel
			? 0
			: lInstanceGrille
					.getConvertisseurPosition()
					.getSemaineDeTrancheHoraire(
						lInstanceGrille.getTrancheHoraireDePlace(aParam.place),
					);
		this._actualiserDiagnosticFicheCours(
			this.instance.paramCours.cours,
			this._getDiagnosticDePlaceEtSemaine(lPlace, lSemaine),
			aParam.id,
			aParam,
		);
	}
	_callbackModificationTailleGabarit(aDomaineEvaluation, aParams) {
		const lParams = Object.assign(
			{ id: "", place: 0, duree: 0, estModificationDuree: true },
			aParams,
		);
		const lPositionGabarit = { place: lParams.place, duree: lParams.duree };
		const lCours = this.instance.paramCours.cours;
		return new ObjetRequeteEvaluationCours_1.ObjetRequeteEvaluationCours(this)
			.lancerRequete({
				estEDTAnnuel: this.options.estEDTAnnuel,
				cours: lCours,
				domaine: aDomaineEvaluation,
				numeroSemaineCours: lCours.numeroSemaine,
				duree: lParams.duree,
				matiere: lCours.matiere,
				listeRessources: new ObjetListeElements_1.ObjetListeElements()
					.add(lCours.ListeContenus)
					.setSerialisateurJSON({ ignorerEtatsElements: true }),
			})
			.then((aJSON) => {
				this._reponseRequeteEvaluationCours(
					aJSON,
					lCours,
					lPositionGabarit,
					aDomaineEvaluation,
				);
				if (this.options.saisieGabaritDirecte) {
					this._callbackPoseGabarit(lParams);
				}
			});
	}
	_getDiagnosticDePlaceEtSemaine(aPlaceHebdo, aNumeroSemaine) {
		if (
			this.instance.donneesGrille.diagnostic &&
			this.instance.donneesGrille.diagnostic.places &&
			this.instance.donneesGrille.diagnostic.places[aPlaceHebdo]
		) {
			if (this.options.estEDTAnnuel) {
				return this.instance.donneesGrille.diagnostic.places[aPlaceHebdo];
			}
			if (
				this.instance.donneesGrille.diagnostic.places[aPlaceHebdo][
					aNumeroSemaine
				]
			) {
				return this.instance.donneesGrille.diagnostic.places[aPlaceHebdo][
					aNumeroSemaine
				];
			}
		}
		return null;
	}
	_diagnosticsRessourcesAutorise(aDiagnosticRessource) {
		function _diagnoAutorise(aDiag) {
			return (
				aDiag &&
				new TypeEnsembleNombre_1.TypeEnsembleNombre()
					.add(aDiag)
					.remove(
						Type_Diagnostic_1.TypeDiagnosticUtil.getDiagnosticsAutorises(),
					)
					.count() === 0
			);
		}
		let lResult = null;
		aDiagnosticRessource.parcourir((D) => {
			if (lResult !== false && _diagnoAutorise(D.diag)) {
				lResult = true;
			} else {
				lResult = false;
				return false;
			}
		});
		return !!lResult;
	}
	_getLibelleTabCoursGenants(aTabCoursGenants) {
		let lLibelle = "";
		if (aTabCoursGenants && aTabCoursGenants.length > 0) {
			aTabCoursGenants.sort();
			aTabCoursGenants.forEach((aDate) => {
				lLibelle += ObjetChaine_1.GChaine.format("<br>- %s %s %s %s", [
					ObjetTraduction_1.GTraductions.getValeur("Le"),
					ObjetDate_1.GDate.formatDate(aDate, "%JJ/%MM/%AAAA"),
					ObjetTraduction_1.GTraductions.getValeur("A"),
					ObjetDate_1.GDate.formatDate(aDate, "%hh%sh%mm"),
				]);
			});
		}
		return lLibelle ? lLibelle + "<br><br>" : "";
	}
	_construireDiagnoResult(aDiagno, aResult) {
		const lLibelleCoursGenants = aDiagno
			? this._getLibelleTabCoursGenants(aDiagno.genants)
			: "";
		if (
			aDiagno &&
			aDiagno.diag &&
			new TypeEnsembleNombre_1.TypeEnsembleNombre()
				.add(aDiagno.diag)
				.remove(Type_Diagnostic_1.TypeDiagnosticUtil.getDiagnosticsAutorises())
				.count() > 0
		) {
			aResult.placementImpossible = true;
			if (
				aDiagno.diag.contains(Type_Diagnostic_1.TypeDiagnostic.DiagJourFerie)
			) {
				aResult.detail = ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.JourFerie",
				);
			} else if (
				aDiagno.diag.contains(
					Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteEtablissement,
				)
			) {
				aResult.detail = ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.DJNonTravaille",
				);
			} else if (lLibelleCoursGenants) {
				aResult.detail +=
					(aResult.detail ? "<br>" : "") +
					ObjetTraduction_1.GTraductions.getValeur("diagnostic.CoursGenant") +
					lLibelleCoursGenants;
			}
		}
		if (aDiagno && !aDiagno.diag && lLibelleCoursGenants) {
			aResult.detail =
				ObjetTraduction_1.GTraductions.getValeur("diagnostic.CoursGenant") +
				lLibelleCoursGenants;
			aResult.dateEffetDebut = aDiagno.dateEffet;
		}
		if (
			aDiagno &&
			aDiagno.diagRess &&
			!aResult.detail &&
			(aResult.placementImpossible ||
				!this._diagnosticsRessourcesAutorise(aDiagno.diagRess))
		) {
			aResult.placementImpossible = true;
			aResult.detail = this._getMessageDiagnosticRessources(aDiagno.diagRess);
		}
	}
	_getRapportDiagnostic(aParam) {
		const lCours = this.instance.paramCours.cours;
		const lGrille = this.options.getObjetGrille();
		const lResult = {
			placeHebdoGabarit: lGrille
				.getConvertisseurPosition()
				.getPlaceHebdoDePlaceGrille(aParam.place),
			semainePlacement: this.options.estEDTAnnuel
				? 0
				: lGrille
						.getConvertisseurPosition()
						.getSemaineDeTrancheHoraire(
							lGrille.getTrancheHoraireDePlace(aParam.place),
						),
			placementImpossible: false,
			detail: "",
			action: false,
		};
		if (lCours.dateEffetPoseImpossible) {
			lResult.placementImpossible = true;
			lResult.detail = ObjetTraduction_1.GTraductions.getValeur(
				"SaisieCours.MessageDateEffetCoursAnnuelImpossible",
			);
		}
		let lDiagno;
		if (
			this.options.estEDTAnnuel &&
			lCours.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			lDiagno = this._getDiagnosticDePlaceEtSemaine(lResult.placeHebdoGabarit);
			this._construireDiagnoResult(lDiagno, lResult);
			lResult.action = true;
			return lResult;
		}
		const lPlaceCours = lCours.Debut,
			lDureeCours = lCours.Fin - lCours.Debut + 1;
		if (
			lPlaceCours !== lResult.placeHebdoGabarit ||
			lDureeCours !== aParam.duree ||
			(!this.options.estEDTAnnuel &&
				lCours.numeroSemaine !== lResult.semainePlacement)
		) {
			lDiagno = this._getDiagnosticDePlaceEtSemaine(
				lResult.placeHebdoGabarit,
				lResult.semainePlacement,
			);
			if (this.options.estEDTAnnuel) {
				this._construireDiagnoResult(lDiagno, lResult);
			} else if (
				this.parametresSco.domaineVerrou.getValeur(lCours.numeroSemaine) ||
				this.parametresSco.domaineVerrou.getValeur(lResult.semainePlacement)
			) {
				lResult.placementImpossible = true;
				lResult.detail = ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.PlacementSemaineVerrouillee",
				);
			} else if (
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
					lCours.numeroSemaine,
				) ||
				!this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
					lResult.semainePlacement,
				)
			) {
				lResult.placementImpossible = true;
				lResult.detail = ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.PlacementSemaineNonModifiable",
				);
			} else if (
				lCours.verrouDeplacement &&
				lCours.numeroSemaine * lPlaceCours !==
					lResult.semainePlacement * lResult.placeHebdoGabarit
			) {
				lResult.placementImpossible = true;
				lResult.detail = ObjetTraduction_1.GTraductions.getValeur(
					"EDT.CoursVerrouille",
				);
			} else {
				this._construireDiagnoResult(lDiagno, lResult);
			}
			lResult.action = true;
			return lResult;
		}
		return null;
	}
	async _getMessageConfirmationCreation(aCours, aRapportDiagnostic) {
		let lMessage = "";
		let lControleur = null;
		let lGetDisabledBouton = null;
		if (aCours._avecSelectionMatiereCreationCours) {
			const lListeMatieres =
				this.options.listeMatieresPrimaire ||
				MethodesObjet_1.MethodesObjet.dupliquer(
					this.etatUtilisateurSco.listeMatieres,
				);
			if (!lListeMatieres || lListeMatieres.count() === 0) {
				throw "DEBUG : pas de matère";
			}
			lMessage = [
				'<div style="padding-bottom:20px;">',
				'<ie-combo ie-model="combo"></ie-combo>',
				"</div>",
				lMessage,
			].join("");
			lGetDisabledBouton = function (aBouton) {
				if (aBouton.genreAction === Enumere_Action_1.EGenreAction.Valider) {
					return !aCours.matiere;
				}
			};
			const lThis = this;
			lControleur = {
				combo: {
					init: function (aInstance) {
						aInstance.setOptionsObjetSaisie(
							Object.assign({}, lThis.options.optionsComboMatieresPrimaire, {
								longueur: 250,
							}),
						);
					},
					getDonnees: function (aDonnees) {
						if (!aDonnees) {
							return lListeMatieres;
						}
					},
					getLibelle: function () {
						if (!aCours.matiere) {
							return (
								"&lt;" +
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieCours.SelectionnerMatiereCours",
								) +
								"&gt;"
							);
						}
					},
					getIndiceSelection: function () {
						let lIndice = lListeMatieres.getIndiceParElement(aCours.matiere);
						if (
							lIndice < 0 ||
							!MethodesObjet_1.MethodesObjet.isNumber(lIndice)
						) {
							lIndice = -1;
						}
						return lIndice;
					},
					event: function (aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							aParametres.element
						) {
							aCours.matiere = aParametres.element;
							if (aCours.matiere) {
								aCours.CouleurFond = aCours.matiere.couleur;
							}
						}
					},
				},
			};
		}
		if (aRapportDiagnostic && aRapportDiagnostic.dateEffetDebut) {
			lMessage +=
				aRapportDiagnostic.detail +
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MessageModifCoursDateEffet",
				) +
				"<br><br>" +
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ConfirmezCreationCoursPlaceDateEffet",
					[
						ObjetDate_1.GDate.formatDate(
							aRapportDiagnostic.dateEffetDebut,
							"%JJ/%MM/%AAAA",
						),
					],
				);
		} else {
			lMessage += ObjetTraduction_1.GTraductions.getValeur(
				"SaisieCours.ConfirmezCreationCoursPlace",
			);
		}
		return this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: lMessage,
				controleur: lControleur,
				getDisabledBouton: lGetDisabledBouton,
			});
	}
	_fermerFicheCours() {
		const lFicheCours = this.options.getFicheCours
			? this.options.getFicheCours()
			: null;
		if (lFicheCours) {
			lFicheCours.fermer();
		}
	}
	async _callbackPoseGabarit(aParam) {
		const lCours = this.instance.paramCours.cours;
		const lRapport = this._getRapportDiagnostic(aParam);
		let lMessage = "";
		if (!lRapport || !lRapport.action) {
			if (this.options.saisieGabaritDirecte) {
				this.sortieModeDiagnostic();
			}
			return;
		}
		if (lRapport.placementImpossible) {
			await this.applicationSco
				.getMessage()
				.afficher({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"diagnostic.PlacementImpossible",
					),
					message: lRapport.detail,
				});
			if (this.options.saisieGabaritDirecte) {
				this.sortieModeDiagnostic();
				this._fermerFicheCours();
			}
			return;
		}
		let lDateEffetDebut = null;
		if (lRapport && lRapport.dateEffetDebut) {
			lDateEffetDebut = lRapport.dateEffetDebut;
		}
		if (
			MethodesObjet_1.MethodesObjet.isDate(lCours.dateEffetDebut) &&
			(!lDateEffetDebut || lCours.dateEffetDebut > lDateEffetDebut)
		) {
			lDateEffetDebut = lCours.dateEffetDebut;
		}
		if (lCours.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
			const lGenreAction = await this._getMessageConfirmationCreation(
				lCours,
				lRapport,
			);
			if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
				const lNumeroSemaine = this.options.estEDTAnnuel
					? -1
					: lCours.numeroSemaine;
				const lPlace = this.options
					.getObjetGrille()
					.getConvertisseurPosition()
					.getPlaceHebdoDePlaceGrille(aParam.place);
				return await this._requeteSaisieCours(
					{
						cours: lCours,
						creationCours: true,
						place: lPlace,
						duree: aParam.duree,
						dateEffetDebut: lDateEffetDebut,
						matiere: lCours.matiere,
						numeroSemaine: lNumeroSemaine,
						estCoursCDIFeuilleAppel: lCours.estCoursCDIFeuilleAppel,
						listeRessources: lCours.ListeContenus.getListeElements((D) => {
							return (
								D.getNumero() !==
								this.etatUtilisateurSco.getUtilisateur().getNumero()
							);
						}),
					},
					lCours,
					lNumeroSemaine,
				);
			} else if (this.options.saisieGabaritDirecte) {
				this.sortieModeDiagnostic();
				this._fermerFicheCours();
				this.instance.paramCours = {};
			}
			return;
		}
		if (lCours.coursDuplique) {
			lMessage = "";
			if (lRapport && lRapport.dateEffetDebut) {
				lMessage +=
					lRapport.detail +
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.MessageModifCoursDateEffet",
					) +
					"<br><br>" +
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ConfirmezDupliquationCoursPlaceDateEffet",
						[
							ObjetDate_1.GDate.formatDate(
								lRapport.dateEffetDebut,
								"%JJ/%MM/%AAAA",
							),
						],
					);
			} else {
				lMessage += ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.ConfirmezDupliquationCoursPlace",
				);
			}
			const lGenreAction = await this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: lMessage,
				});
			if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
				const lCours = this.instance.paramCours.cours,
					lNumeroSemainePlacement =
						lRapport.semainePlacement !== lCours.numeroSemaine
							? lRapport.semainePlacement
							: undefined;
				return await this._requeteSaisieCours(
					{
						cours: lCours,
						duplicationCours: true,
						place: this.options
							.getObjetGrille()
							.getConvertisseurPosition()
							.getPlaceHebdoDePlaceGrille(aParam.place),
						numeroSemaine: lCours.numeroSemaine,
						dateEffetDebut: lDateEffetDebut,
					},
					lCours,
					lNumeroSemainePlacement || lCours.numeroSemaine,
				);
			} else if (this.options.saisieGabaritDirecte) {
				this.sortieModeDiagnostic();
				this._fermerFicheCours();
			}
			return;
		}
		lMessage = "";
		if (lDateEffetDebut) {
			if (lCours.genants) {
				lMessage +=
					ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.CoursAnnuelModifieDate",
					) + this._getLibelleTabCoursGenants(lCours.genants);
			}
			if (lRapport && lRapport.dateEffetDebut && lRapport.detail) {
				lMessage += lRapport.detail;
			}
			const lStrDateEffet = ObjetDate_1.GDate.formatDate(
				lDateEffetDebut,
				"%JJ/%MM/%AAAA",
			);
			lMessage +=
				ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MessageModifCoursDateEffet",
				) +
				"<br><br>" +
				(aParam.estModificationDuree
					? ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.ConfirmerChangementDureeCoursDateEffet_S",
							[lStrDateEffet],
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"SaisieCours.ConfirmerDeplacementCoursDateEffet",
							[lStrDateEffet],
						));
		} else {
			lMessage = aParam.estModificationDuree
				? ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ConfirmerChangementDureeCours",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.ConfirmerDeplacementCours",
					);
		}
		const lGenreAction = await this.applicationSco
			.getMessage()
			.afficher({
				type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
				message: lMessage,
			});
		if (lGenreAction === Enumere_Action_1.EGenreAction.Valider) {
			const lCours = this.instance.paramCours.cours,
				lNumeroSemainePlacement =
					lRapport.semainePlacement !== lCours.numeroSemaine
						? lRapport.semainePlacement
						: undefined;
			return await this._requeteSaisieCours(
				{
					cours: lCours,
					numeroSemaine: lCours.numeroSemaine,
					numeroSemainePlacement: lNumeroSemainePlacement,
					deplacementCours: true,
					placePose: lRapport.placeHebdoGabarit,
					dureePose: aParam.duree,
					dateEffetDebut: lDateEffetDebut,
				},
				lCours,
				lNumeroSemainePlacement || lCours.numeroSemaine,
			);
		} else if (this.options.saisieGabaritDirecte) {
			this.sortieModeDiagnostic();
		}
	}
	_getMessageDiagnosticRessources(aDiagnosticsRessource) {
		const uDiagnos = {};
		function _add(aRessource, aGenre) {
			if (!uDiagnos[aGenre]) {
				uDiagnos[aGenre] = [];
			}
			if (aRessource && aRessource.getLibelle()) {
				uDiagnos[aGenre].push(aRessource.getLibelle());
			}
		}
		function _getMessage(aMessage, aGenre) {
			let lMess = "";
			if (uDiagnos[aGenre] && uDiagnos[aGenre].length > 0) {
				lMess = " : " + uDiagnos[aGenre].join(", ");
			}
			return (
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.PlacementRessourcesOccupees",
				) + lMess
			);
		}
		aDiagnosticsRessource.parcourir((D) => {
			if (D.diag) {
				if (
					new TypeEnsembleNombre_1.TypeEnsembleNombre()
						.add([
							Type_Diagnostic_1.TypeDiagnostic.DiagOccupe,
							Type_Diagnostic_1.TypeDiagnostic.DiagOccupeVerrouilleDure,
						])
						.intersect(D.diag)
						.count() > 0
				) {
					_add(D, Type_Diagnostic_1.TypeDiagnostic.DiagOccupe);
				} else if (
					D.diag.contains(Type_Diagnostic_1.TypeDiagnostic.DiagAbsenceRessource)
				) {
					_add(D, Type_Diagnostic_1.TypeDiagnostic.DiagAbsenceRessource);
				} else if (
					D.diag.contains(
						Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteDureRessource,
					)
				) {
					_add(
						D,
						Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteDureRessource,
					);
				} else if (
					D.diag.contains(
						Type_Diagnostic_1.TypeDiagnostic.DiagChangementCycleGAEV,
					)
				) {
					_add(D, Type_Diagnostic_1.TypeDiagnostic.DiagChangementCycleGAEV);
				} else if (
					D.diag.contains(
						Type_Diagnostic_1.TypeDiagnostic.DiagDemiPensionMaximaDepasses,
					) ||
					D.diag.contains(
						Type_Diagnostic_1.TypeDiagnostic.DiagDemiPensionPasDeService,
					) ||
					D.diag.contains(
						Type_Diagnostic_1.TypeDiagnostic.DiagDemiPensionPasDeServiceSeul,
					)
				) {
					_add(D, Type_Diagnostic_1.TypeDiagnostic.DiagDemiPensionPasDeService);
				}
			}
		});
		if (uDiagnos[Type_Diagnostic_1.TypeDiagnostic.DiagOccupe]) {
			return _getMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.PlacementRessourcesOccupees",
				),
				Type_Diagnostic_1.TypeDiagnostic.DiagOccupe,
			);
		}
		if (uDiagnos[Type_Diagnostic_1.TypeDiagnostic.DiagAbsenceRessource]) {
			return _getMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.PlacementRessourcesAbsentes",
				),
				Type_Diagnostic_1.TypeDiagnostic.DiagAbsenceRessource,
			);
		}
		if (
			uDiagnos[
				Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteDureRessource
			]
		) {
			return _getMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.PlacementRessourcesIndisponibles",
				),
				Type_Diagnostic_1.TypeDiagnostic.DiagIndisponibiliteDureRessource,
			);
		}
		if (
			uDiagnos[Type_Diagnostic_1.TypeDiagnostic.DiagDemiPensionPasDeService]
		) {
			return _getMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.AucunServiceDemiPension",
				),
				Type_Diagnostic_1.TypeDiagnostic.DiagDemiPensionPasDeService,
			);
		}
		if (uDiagnos[Type_Diagnostic_1.TypeDiagnostic.DiagChangementCycleGAEV]) {
			return _getMessage(
				ObjetTraduction_1.GTraductions.getValeur(
					"diagnostic.DiagChangementSemaineGAEV",
				),
				Type_Diagnostic_1.TypeDiagnostic.DiagChangementCycleGAEV,
			);
		}
		return ObjetTraduction_1.GTraductions.getValeur(
			"diagnostic.PlacementRessourcesOccupees",
		);
	}
	async _callbackFinCreationGabarit(aParamsGabarit) {
		const lCours = aParamsGabarit.gabarit.cours;
		if (!lCours) {
			aParamsGabarit.gabarit.vider();
			throw "DEBUG : pas de cours";
		}
		const lReponse =
			await new ObjetRequeteEvaluationCours_1.ObjetRequeteEvaluationCours(
				this,
			).lancerRequete({
				estEDTAnnuel: this.options.estEDTAnnuel,
				cours: lCours,
				matiere: lCours.matiere,
				duree: lCours.duree,
				numeroSemaineCours: this.options.estEDTAnnuel
					? undefined
					: lCours.numeroSemaine,
				listeRessources: new ObjetListeElements_1.ObjetListeElements()
					.add(lCours.ListeContenus)
					.setSerialisateurJSON({ ignorerEtatsElements: true }),
			});
		this._reponseRequeteEvaluationCours(lReponse, lCours, aParamsGabarit);
		if (this.options.saisieGabaritDirecte) {
			await this._callbackPoseGabarit(aParamsGabarit);
		}
	}
	_creerGabaritSurCreationDeCours() {
		const lGrille = this.options.getObjetGrille();
		const lGabarit = this._creerGabarit(null, {
			grille: lGrille,
			callbackCreation: (aParamsGabarit) => {
				const lParamsGabarit = aParamsGabarit;
				lParamsGabarit.placeHebdo = lGrille
					.getConvertisseurPosition()
					.getPlaceHebdoDePlaceGrille(aParamsGabarit.place);
				const lCours = this.options.surCreationCours(lParamsGabarit);
				lGabarit.cours = lCours;
				lGrille.getParametrsGrille().gabarit = lGabarit;
			},
			callbackFinCreation: this._callbackFinCreationGabarit.bind(this),
		});
		return lGabarit;
	}
	_actualiserDiagnosticFicheCours(aCours, aDiagnostic, aId, aParamsGabarit) {
		const lListeCours = new ObjetListeElements_1.ObjetListeElements();
		if (!aDiagnostic) {
			return;
		}
		aCours.diagnosticRessource = aDiagnostic.diagRess;
		lListeCours.addElement(aCours);
		const lFicheCours = this.options.getFicheCours
			? this.options.getFicheCours()
			: null;
		if (lFicheCours && lFicheCours.estAffiche()) {
			let lPositionCours = null;
			if (aParamsGabarit) {
				const lGrille = this.options.getObjetGrille();
				lPositionCours = {
					place: lGrille
						.getConvertisseurPosition()
						.getPlaceHebdoDePlaceGrille(aParamsGabarit.place),
					duree: aParamsGabarit.duree,
					numeroSemaine: this.options.estEDTAnnuel
						? 0
						: lGrille
								.getConvertisseurPosition()
								.getSemaineDeTrancheHoraire(
									lGrille.getTrancheHoraireDePlace(aParamsGabarit.place),
								),
				};
			}
			lFicheCours.actualiserFicheCours({
				avecDiagnosticRessource: true,
				listeCoursDiagnostic: lListeCours,
				diagnosticPlace: aDiagnostic.diag,
				id: aId,
				positionCours: lPositionCours,
			});
		}
	}
	_ouvrirFenetreSelectionRessource(
		aParametres,
		aDonnees,
		aAvecTriDonneesListe,
	) {
		if (
			aParametres.genreRessource ===
				Enumere_Ressource_1.EGenreRessource.Matiere &&
			!this.options.listeMatieresPrimaire
		) {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionMatiere_1.ObjetFenetre_SelectionMatiere,
				{
					pere: this.instance,
					evenement: (aNumeroBouton, aIndice, aNumeroMatiereSelection) => {
						let lMatiere = null;
						if (aNumeroMatiereSelection) {
							lMatiere = aDonnees.liste.getElementParNumeroEtGenre(
								aNumeroMatiereSelection,
							);
						}
						if (lMatiere) {
							this._surModificationRessourceCours({
								cours: aParametres.cours,
								numeroSemaine: aParametres.numeroSemaine,
								genreRessource: aParametres.genreRessource,
								listeRessources:
									new ObjetListeElements_1.ObjetListeElements().add(lMatiere),
								ressourceRemplacee: aParametres.ressourceRemplacee,
							});
						}
					},
				},
				{
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieCours.MatiereDisponible",
					),
					hauteur: 500,
				},
			).setDonnees(aDonnees.liste);
			return;
		}
		let lAvecModif = false;
		const lAvecEditionListe =
			aParametres.genreRessource ===
				Enumere_Ressource_1.EGenreRessource.LibelleCours &&
			this.options.avecRequeteLibelleCours;
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessourceCours_1.ObjetFenetre_SelectionRessourceCours,
			{
				pere: this.instance,
				evenement: (aValider, aGenreRessource, aListeSelection) => {
					if (aValider) {
						this._surModificationRessourceCours({
							cours: aParametres.cours,
							numeroSemaine: aParametres.numeroSemaine,
							genreRessource: aGenreRessource,
							listeRessources: aListeSelection,
							ressourceRemplacee: aParametres.ressourceRemplacee,
						});
					} else if (lAvecModif) {
						this.etatUtilisateurSco._coursASelectionner = aParametres.cours;
						this._actualisationApresValidation();
					}
				},
			},
			{
				avecColonneCodeMatiere: !this.etatUtilisateurSco.pourPrimaire(),
				avecTriDonneesListe: aAvecTriDonneesListe !== false,
				avecEditionListe: lAvecEditionListe,
				surEditionListe: async (aParams) => {
					const lResult = await new ObjetRequeteSaisieLibelleCours(
						this,
					).lancerRequete({ liste: aParams.liste });
					if (
						lResult &&
						lResult.JSONRapportSaisie &&
						lResult.JSONRapportSaisie.liste
					) {
						const lListeSelection =
							new ObjetListeElements_1.ObjetListeElements();
						if (lResult.JSONRapportSaisie.libelleCours) {
							lListeSelection.addElement(
								lResult.JSONRapportSaisie.libelleCours,
							);
						}
						lFenetre.setDonnees(
							lResult.JSONRapportSaisie.liste,
							aParametres.genreRessource,
							lListeSelection,
						);
						lAvecModif = true;
					}
				},
				editionCelluleAutorisee: (aParams) => {
					return (
						lAvecEditionListe && aParams.article && !aParams.article.nonEditable
					);
				},
				suppressionLigneAutorisee: (aArticle) => {
					return lAvecEditionListe && aArticle && !aArticle.nonSupprimable;
				},
				sitesActifs: aDonnees.sitesActifs,
			},
		);
		switch (aParametres.genreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Matiere:
			case Enumere_Ressource_1.EGenreRessource.Classe:
			case Enumere_Ressource_1.EGenreRessource.Salle:
			case Enumere_Ressource_1.EGenreRessource.Enseignant:
			case Enumere_Ressource_1.EGenreRessource.Materiel:
			case Enumere_Ressource_1.EGenreRessource.LibelleCours:
				lFenetre.setDonnees(aDonnees.liste, aParametres.genreRessource);
				break;
			default:
				lFenetre.fermer();
		}
	}
	async _surCallbackModificationRessourceFicheCours(aParametres) {
		const lParametres = Object.assign(
			{
				cours: null,
				numeroSemaine: null,
				genreRessource: null,
				ressourceRemplacee: null,
				estEDTAnnuel: this.options.estEDTAnnuel,
			},
			aParametres,
		);
		if (!this.autorisationEditionCoursAutoriseeSurContexte()) {
			return;
		}
		if (
			this.options.listeMatieresPrimaire &&
			lParametres.genreRessource === Enumere_Ressource_1.EGenreRessource.Matiere
		) {
			const lListeMatieres = MethodesObjet_1.MethodesObjet.dupliquer(
				this.options.listeMatieresPrimaire,
			);
			let lPere = null;
			lListeMatieres.parcourir((aMatiere) => {
				if (aMatiere.cumul > 1) {
					aMatiere.pere = lPere;
				} else {
					lPere = aMatiere;
				}
				const H = [
					'<div style="display:flex; align-items:center; height:20px; padding:1px 0;">',
				];
				if (aMatiere.couleur) {
					H.push(
						'<div style="height:',
						aMatiere.cumul > 1 ? "6px;" : "100%;",
						"min-width:6px; margin-right: 3px; " +
							ObjetStyle_1.GStyle.composeCouleurFond(aMatiere.couleur),
						aMatiere.cumul > 1
							? "border-radius:6px;"
							: "border-radius:6px 0 0 6px;",
						'"></div>',
						"<div ie-ellipsis-fixe>",
						aMatiere.getLibelle(),
						"</div>",
					);
				} else {
					H.push(aMatiere.getLibelle());
				}
				H.push("</div>");
				aMatiere.Libelle = H.join("");
			});
			this._ouvrirFenetreSelectionRessource(
				lParametres,
				{ liste: lListeMatieres },
				false,
			);
		} else {
			const lReponse =
				await new ObjetRequeteRessourcesSaisieCours_1.ObjetRequeteRessourcesSaisieCours(
					this,
				).lancerRequete(lParametres);
			this._ouvrirFenetreSelectionRessource(lParametres, lReponse);
		}
	}
	_getMessageSuppressionNbCDT(aNbCDT) {
		return aNbCDT > 1
			? ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MessageSuppressionCahierJournauxP",
					[aNbCDT],
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"SaisieCours.MessageSuppressionCahierJournauxS",
					[aNbCDT],
				);
	}
	_getDetailMessageSuppressionListeCours(aListeCours) {
		let lNbCDT = 0;
		aListeCours.parcourir((aCours) => {
			if (this._estCoursAvecCDT(aCours)) {
				lNbCDT += 1;
			}
		});
		if (lNbCDT > 0) {
			return "<br><br>" + this._getMessageSuppressionNbCDT(lNbCDT);
		}
		return "";
	}
}
exports.ObjetModule_EDTSaisie = ObjetModule_EDTSaisie;
class ObjetRequeteInfoModifierMatiereCours extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"InfoModifierMatiereCours",
	ObjetRequeteInfoModifierMatiereCours,
);
class ObjetRequeteSaisieLibelleCours extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieLibelleCours",
	ObjetRequeteSaisieLibelleCours,
);
