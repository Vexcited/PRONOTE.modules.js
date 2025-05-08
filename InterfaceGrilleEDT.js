exports.InterfaceGrilleEDT = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetGrilleHoraires_1 = require("ObjetGrilleHoraires");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const ObjetFenetre_EDT_MS_1 = require("ObjetFenetre_EDT_MS");
const ObjetGrille_1 = require("ObjetGrille");
const UtilitaireConvertisseurPositionGrille_1 = require("UtilitaireConvertisseurPositionGrille");
const TypeHoraireGrillePlanning_1 = require("TypeHoraireGrillePlanning");
const UtilitairePrefsGrilleStructure_1 = require("UtilitairePrefsGrilleStructure");
const UtilitaireAbsencesGrille_1 = require("UtilitaireAbsencesGrille");
class InterfaceGrilleEDT extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.parametresSco = this.applicationSco.getObjetParametres();
		this._options = {
			avecGrilleMultiple: true,
			minHeight: null,
			evenementMouseDownPlace: null,
			avecParametresUtilisateurs: false,
			avecParametresUtilisateursPrefsHorairesEtPas: false,
			callbackPiedRessourcesLibres: null,
		};
		this._optionsGrille = {
			avecSelection: true,
			avecDrop: false,
			evenementMouseDownPlace: (aParams) => {
				this.actualisationSelectionSurGrillesDeCours(null);
				if (this._options.evenementMouseDownPlace) {
					this._options.evenementMouseDownPlace(false, aParams);
				}
			},
		};
		this._optionsGrilleMS = {
			evenementMouseDownPlace: (aParams) => {
				this.actualisationSelectionSurGrillesDeCours(null);
				if (this._options.evenementMouseDownPlace) {
					this._options.evenementMouseDownPlace(true, aParams);
				}
			},
		};
	}
	setOptionsInterfaceGrilleEDT(aOptions) {
		$.extend(this._options, aOptions);
		$.extend(this._optionsGrille, aOptions.optionsGrille);
		$.extend(this._optionsGrilleMS, aOptions.optionsGrilleMS);
	}
	construireInstances() {
		this.IdentGrille = this.add(
			ObjetGrille_1.ObjetGrille,
			this._evenementSurCours.bind(this),
			this._initialiserGrille.bind(this),
		);
		if (this._options.avecGrilleMultiple) {
			this.identFenetreCours_MS = this.addFenetre(
				ObjetFenetre_EDT_MS_1.ObjetFenetre_EDT_MS,
			);
		}
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	selectionnerGrille() {
		this.getInstance(this.IdentGrille).selectionnerGrille();
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div id="' +
				this.getInstance(this.IdentGrille).getNom() +
				'" style="height: 100%; ',
			this._options.minHeight
				? "min-height:" + this._options.minHeight + "px;"
				: "",
			'">',
			"&nbsp;",
			"</div>",
		);
		return H.join("");
	}
	recupererDonnees() {
		super.recupererDonnees();
		this.fermerFenetreMS();
	}
	estGrilleInverse() {
		return this.getInstance(this.IdentGrille).getOptions().grilleInverse;
	}
	setDonnees(aDonnees, aCallbackApresConstruction) {
		this.fermerFenetreMS();
		for (let I = 0; I < aDonnees.listeCours.count(); I++) {
			aDonnees.listeCours.get(I).avecSelection = this.avecFicheCours;
		}
		const lInstanceGrille = this.getInstance(this.IdentGrille);
		let lPrefsGrille;
		let lJoursOuvres = null;
		if (
			this._options.avecParametresUtilisateurs ||
			this._options.avecParametresUtilisateursPrefsHorairesEtPas
		) {
			lPrefsGrille =
				UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrille(
					aDonnees.prefsGrille
						? aDonnees.prefsGrille.genreRessource
						: aDonnees.ressources,
					aDonnees.estPlanning,
					aDonnees.prefsGrille ? aDonnees.prefsGrille.numEtablissement : null,
				);
			if (
				this._options.avecParametresUtilisateursPrefsHorairesEtPas &&
				!this._options.avecParametresUtilisateurs
			) {
				lJoursOuvres =
					UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrilleDefaut().joursOuvres.items();
			}
		} else {
			lPrefsGrille =
				UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrilleDefaut();
		}
		lJoursOuvres = lJoursOuvres || lPrefsGrille.joursOuvres.items();
		const lConvertisseur =
			new UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille(
				{
					estPlanning: aDonnees.estPlanning,
					typePlanning: this._options.typePlanningEDT,
					listeRessources: this._options.estPlanningParRessource
						? aDonnees.ressources
						: null,
					indiceJourCycle: aDonnees.indiceJourCycle,
					joursOuvresActifs: lJoursOuvres,
				},
			);
		let lEstGrilleInverse;
		if (this._options.avecParametresUtilisateurs) {
			if (this._options.estPlanning) {
				switch (this._options.typePlanningEDT) {
					case TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine:
						lEstGrilleInverse = this.applicationSco.parametresUtilisateur.get(
							"EDT.axeInversePlanningHebdo",
						);
						break;
					case TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour:
						lEstGrilleInverse = this.applicationSco.parametresUtilisateur.get(
							"EDT.axeInversePlanningJour",
						);
						break;
					case TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning
						.ongletParJour:
						lEstGrilleInverse = this.applicationSco.parametresUtilisateur.get(
							"EDT.axeInversePlanningOngletParJour",
						);
						break;
					default:
				}
			} else {
				lEstGrilleInverse =
					this.applicationSco.parametresUtilisateur.get("EDT.axeInverseEDT");
			}
		}
		let lLargeurTitreGauche = 40;
		let lBlocHoraires = null;
		if (
			this._options.avecParametresUtilisateurs ||
			this._options.avecParametresUtilisateursPrefsHorairesEtPas
		) {
			lBlocHoraires = new ObjetGrilleHoraires_1.ObjetGrilleHoraires();
			lBlocHoraires.addBloc({
				debutBloc: 0,
				debut: lPrefsGrille.placeDebut,
				finBloc: this.parametresSco.PlacesParJour - 1,
				fin: lPrefsGrille.placeFin,
			});
		}
		if (lEstGrilleInverse && !this._options.estPlanningParRessource) {
			lLargeurTitreGauche =
				this._options.typePlanningEDT ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour ||
				!aDonnees.estPlanning
					? ObjetChaine_1.GChaine.getLongueurChaineDansDiv(" WWW. 99/99 ", 10)
					: ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
							" 99/99 - 99/99 ",
							10,
							true,
						);
		}
		const lAvecPiedHoraireRessourcesLibre =
			aDonnees.placesRessourcesLibres &&
			this._options.callbackPiedRessourcesLibres &&
			this._options.estPlanningParRessource &&
			this._options.typePlanningEDT !==
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour;
		let lDecorateurAbsences = null;
		if (aDonnees.absences) {
			lDecorateurAbsences =
				new UtilitaireAbsencesGrille_1.TDecorateurAbsencesGrille().setOptions(
					{},
				);
			lDecorateurAbsences.setDonnees({ absencesGrille: aDonnees.absences });
		}
		const lOptions = {
			grilleInverse: lEstGrilleInverse,
			convertisseurPosition: lConvertisseur,
			blocHoraires: lBlocHoraires,
			decorateurAbsences: lDecorateurAbsences,
			largeurTitreGauche: lLargeurTitreGauche,
			granularitPasHoraire:
				this._options.avecParametresUtilisateurs ||
				this._options.avecParametresUtilisateursPrefsHorairesEtPas
					? lPrefsGrille.nbPas
					: false,
			avecZoomCtrlWheel:
				this._options.avecParametresUtilisateurs ||
				this._options.avecParametresUtilisateursPrefsHorairesEtPas ||
				undefined,
			classTitreSelectionTranche:
				"Souligne" + (this._options.estPlanningParRessource ? " Gras" : ""),
			avecPiedHoraire: lAvecPiedHoraireRessourcesLibre,
			taillePiedHoraire: lAvecPiedHoraireRessourcesLibre
				? lEstGrilleInverse
					? 17
					: 30
				: 0,
			callbackPiedRessourcesLibres: this._options.callbackPiedRessourcesLibres,
		};
		if (aDonnees.estPlanning) {
			Object.assign(lOptions, {
				tailleMaxTranche: 200,
				tailleMinTranche: 40,
				afficherDebutSelonCours: false,
				afficherFinSelonCours: false,
				nbAlternanceTitreColonnes:
					this._options.typePlanningEDT ===
						TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine &&
					lEstGrilleInverse &&
					!this.parametresSco.afficherSequences
						? 2
						: 1,
				desactiverTitreHorairesDebutFin:
					this._options.typePlanningEDT ===
						TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine &&
					lEstGrilleInverse,
				getLibelleTranche: !this._options.estPlanningParRessource
					? null
					: function (aParam) {
							const T = [];
							T.push(
								'<div ie-ellipsis style="width:',
								aParam.width,
								'px;">' + aParam.tranche.ressource.getLibelle() + "</div>",
							);
							return T.join("");
						},
				getTailleLibelleTranche: !this._options.estPlanningParRessource
					? null
					: function (aNumeroTranche, aTranche) {
							return (
								ObjetChaine_1.GChaine.getLongueurChaineDansDiv(
									aTranche.ressource.getLibelle(),
									10,
								) + 2
							);
						},
				getLibelleDecorateurBlocTranche: null,
			});
			switch (this._options.typePlanningEDT) {
				case TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning
					.ongletParJour:
					Object.assign(lOptions, {
						tailleMINPasHoraire: 10,
						nbTranchesEcran: this._options.avecParametresUtilisateurs
							? this.applicationSco.parametresUtilisateur.get(
									"EDT.nbRessources",
								) || 0
							: 0,
						avecDecorateurBlocHoraire: false,
						getLibelleBlocHoraire: null,
					});
					break;
				case TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine:
					lBlocHoraires = new ObjetGrilleHoraires_1.ObjetGrilleHoraires();
					lJoursOuvres.forEach((aJour, aIndice) => {
						lBlocHoraires.addBloc({
							debutBloc: aIndice * this.parametresSco.PlacesParJour,
							debut:
								aIndice * this.parametresSco.PlacesParJour +
								lPrefsGrille.placeDebut,
							finBloc: (aIndice + 1) * this.parametresSco.PlacesParJour - 1,
							fin:
								aIndice * this.parametresSco.PlacesParJour +
								lPrefsGrille.placeFin,
							indiceJour: aJour,
						});
					});
					Object.assign(lOptions, {
						blocHoraires: lBlocHoraires,
						nbGouttieresEcran: this._options.avecParametresUtilisateurs
							? this.applicationSco.parametresUtilisateur.get("EDT.nbJours") ||
								0
							: 0,
						nbTranchesEcran: this._options.avecParametresUtilisateurs
							? this.applicationSco.parametresUtilisateur.get(
									"EDT.nbRessources",
								) || 0
							: 0,
						tailleMINPasHoraire: 5,
						avecDecorateurBlocHoraire: true,
						getLibelleBlocHoraire: function (aBlocHoraire) {
							let lLibelle =
								UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille.getLibelleJourCycle(
									aBlocHoraire.indiceJour,
								);
							if (
								aDonnees &&
								(!aDonnees.domaine || aDonnees.domaine.getNbrValeurs() === 1)
							) {
								lLibelle += ObjetDate_1.GDate.formatDate(
									lConvertisseur.getDateDeTrancheHoraire({
										tranche: 0,
										horaire: aBlocHoraire.debut,
									}),
									" %JJ/%MM",
								);
							}
							return lLibelle;
						},
					});
					break;
				case TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour:
					Object.assign(lOptions, {
						tailleMINPasHoraire: 10,
						nbTranchesEcran: 0,
						avecDecorateurBlocHoraire: false,
						getLibelleBlocHoraire: null,
						getLibelleDecorateurBlocTranche: function (aParams) {
							let lLibelle =
								UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille.getLibelleJourCycle(
									aParams.tranches[0].indiceJour,
								);
							lLibelle += ObjetDate_1.GDate.formatDate(
								lConvertisseur.getDateDeTrancheHoraire({
									tranche: aParams.tranches[0].numeroTranche,
									horaire: 0,
								}),
								" %JJ/%MM",
							);
							return "<div ie-ellipsis>" + lLibelle + "</div>";
						},
					});
					break;
				default:
			}
		} else {
			if (this._options.avecParametresUtilisateurs) {
				let lNbPasHoraires =
					(this.applicationSco.parametresUtilisateur.get("EDT.nbSequences") ||
						0) * this.parametresSco.PlacesParHeure;
				if (lNbPasHoraires <= 0) {
					lNbPasHoraires = this.parametresSco.PlacesParJour;
				}
				lNbPasHoraires = Math.min(
					lNbPasHoraires,
					this.parametresSco.PlacesParJour,
				);
				Object.assign(lOptions, {
					nbTranchesEcran:
						this.applicationSco.parametresUtilisateur.get("EDT.nbJoursEDT") ||
						0,
					nbPasHorairesEcran: lNbPasHoraires,
				});
			}
		}
		lInstanceGrille.setOptions(lOptions);
		lInstanceGrille.setDonnees(aDonnees, aCallbackApresConstruction);
	}
	fermerFenetreMS() {
		if (this.Instances[this.identFenetreCours_MS]) {
			this.getInstance(this.identFenetreCours_MS).fermer();
		}
	}
	getInstanceGrille() {
		return this.getInstance(this.IdentGrille);
	}
	effacer(aMessage) {
		this.getInstance(this.IdentGrille).effacer(aMessage);
	}
	actualisationSelectionSurGrillesDeCours(aCours, aSelectionGrilleCourante) {
		const lInstanceGrilleMS = this.Instances[this.identFenetreCours_MS]
			? this.getInstance(this.identFenetreCours_MS).getInstanceGrille()
			: null;
		const lInstanceGrille = this.getInstance(this.IdentGrille);
		if (!aCours) {
			lInstanceGrille.deselectionnerElement();
			if (lInstanceGrilleMS) {
				lInstanceGrilleMS.deselectionnerElement();
			}
		} else if (aCours.coursOrigine) {
			lInstanceGrille.selectionnerElement(
				lInstanceGrille.getIndiceCoursParCours(aCours.coursOrigine),
				true,
			);
			if (aSelectionGrilleCourante && lInstanceGrilleMS) {
				lInstanceGrilleMS.selectionnerElement(
					lInstanceGrilleMS.getIndiceCoursParCours(aCours),
					true,
				);
			}
		} else if (lInstanceGrilleMS && aCours.estCoursMS) {
			const lIndiceCours = lInstanceGrilleMS.getIndiceCoursParCours(aCours);
			if (lIndiceCours >= 0) {
				lInstanceGrilleMS.selectionnerElement(lIndiceCours, true);
			} else {
				this.fermerFenetreMS();
			}
			if (aSelectionGrilleCourante) {
				lInstanceGrille.selectionnerElement(
					lInstanceGrille.getIndiceCoursParCours(aCours),
					true,
				);
			}
		} else if (lInstanceGrilleMS) {
			this.fermerFenetreMS();
		}
	}
	_initialiserGrille(AInstance) {
		AInstance.setOptions(this._optionsGrille);
		AInstance.setControleNavigation(this.ControleNavigation);
	}
	_evenementSurCours(aParam) {
		const lParam = { genre: null, id: "", cours: null };
		$.extend(lParam, aParam);
		switch (lParam.genre) {
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu: {
				this.actualisationSelectionSurGrillesDeCours(lParam.cours);
				this.callback.appel(aParam);
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel: {
				if (lParam.cours.coursMultiple && this._options.avecGrilleMultiple) {
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: this,
						evenement: this._evenementSurMenuContextuel,
						initCommandes: function (aMenu) {
							aMenu.addCommande(
								0,
								ObjetTraduction_1.GTraductions.getValeur("EDT.DetailCours"),
								true,
								{ cours: lParam.cours },
							);
						},
					});
				} else {
					this.actualisationSelectionSurGrillesDeCours(lParam.cours);
					this.callback.appel(aParam);
				}
				break;
			}
			default: {
				this.callback.appel(aParam);
			}
		}
	}
	_evenementSurMenuContextuel(ALigne) {
		if (ALigne) {
			switch (ALigne.Numero) {
				case 0: {
					if (!this._options.avecGrilleMultiple) {
						return;
					}
					this.fermerFenetreMS();
					const lOptionsGrille = this.getInstance(
						this.IdentGrille,
					).getOptions();
					this.getInstance(this.identFenetreCours_MS).setDonnees({
						coursMultiple: ALigne.data.cours,
						coursSelectionne: this.getInstance(
							this.IdentGrille,
						).getCoursSelectionne(),
						optionsGrille: $.extend(
							{
								grilleInverse: lOptionsGrille.grilleInverse,
								avecDecorateurBlocHoraire:
									lOptionsGrille.avecDecorateurBlocHoraire,
								desactiverTitreHorairesDebutFin:
									lOptionsGrille.desactiverTitreHorairesDebutFin,
							},
							this._optionsGrilleMS,
						),
						hauteurCelluleGrille: this.getInstance(this.IdentGrille)
							.hauteurCellule,
						callbackGrille: this._evenementSurCours.bind(this),
					});
					break;
				}
			}
		}
	}
}
exports.InterfaceGrilleEDT = InterfaceGrilleEDT;
