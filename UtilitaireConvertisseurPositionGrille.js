exports.TUtilitaireConvertisseurPosition_Grille = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetDate_1 = require("ObjetDate");
const ObjetGrilleTranches_1 = require("ObjetGrilleTranches");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModeGrillesEDT_1 = require("TypeModeGrillesEDT");
const TypeHoraireGrillePlanning_1 = require("TypeHoraireGrillePlanning");
const UtilitaireConvertisseurPositionGrilleCP_1 = require("UtilitaireConvertisseurPositionGrilleCP");
class TUtilitaireConvertisseurPosition_Grille extends UtilitaireConvertisseurPositionGrilleCP_1.TUtilitaireConvertisseurPosition_GrilleCP {
	constructor(aOptions) {
		super(
			Object.assign(
				{
					estPlanning: false,
					typePlanning:
						TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine,
					listeRessources: null,
					joursOuvresActifs: null,
				},
				aOptions,
			),
		);
	}
	setOptions(aOptions) {
		if (this.options.semaines) {
			this.options.semaines = null;
		}
		super.setOptions(aOptions);
		return this;
	}
	estCoursDansGrille(aCours) {
		if (!aCours) {
			return false;
		}
		if (aCours.horsHoraire) {
			return this.getNumeroTrancheDeCours(aCours) >= 0;
		}
		if (
			this.getPlaceDebutCours(aCours, true) < 0 &&
			this.getPlaceFinCours(aCours, true) < 0
		) {
			return false;
		}
		return true;
	}
	getNumeroTrancheDeCours(aCours) {
		let lNumeroTranche = -1;
		if (!aCours) {
			return lNumeroTranche;
		}
		if (aCours.horsHoraire) {
			if (
				aCours.estRetenue &&
				aCours.DateDuCours &&
				!this.options.parametresGrille.multiSemaines &&
				this.options.typePlanning !==
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine
			) {
				this.options.optionsGrille.tranches.parcourir(
					(aNumeroTranche, aTranche) => {
						const lDate = this.getDateDeTrancheHoraire({
							tranche: aTranche.numeroTranche,
							horaire: 0,
						});
						if (
							lDate &&
							ObjetDate_1.GDate.estJourEgal(lDate, aCours.DateDuCours)
						) {
							lNumeroTranche = aNumeroTranche;
							return false;
						}
					},
				);
			}
		} else {
			const lPlace = this.getPlaceDebutCours(aCours);
			lNumeroTranche = Math.floor(
				lPlace / this.options.optionsGrille.blocHoraires.nbHoraires(),
			);
		}
		return lNumeroTranche;
	}
	getPlaceDebutCours(aCours, aAvecPlaceNonVisible) {
		if (!aCours || aCours.horsHoraire) {
			return -1;
		}
		const lDuree = aCours.Fin - aCours.Debut + 1;
		let lRessource;
		let lPlace;
		const lNbHoraires = this.options.optionsGrille.blocHoraires.nbHoraires();
		const lJour = Math.floor(aCours.Debut / lNbHoraires);
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine
		) {
			if (!this.options.listeRessources) {
				return this._getPlaceGrilleDePlacePlanningSemaine(
					aCours.Debut,
					lDuree,
					aCours.numeroSemaine,
					true,
					aAvecPlaceNonVisible,
				);
			} else {
				return this._getPlaceGrilleDePlacePlanningGeneral(
					aCours.Debut,
					lDuree,
					this._getRessourceDeCours(aCours),
					true,
					aAvecPlaceNonVisible,
				);
			}
		}
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour &&
			lJour !== this.options.indiceJourCycle
		) {
			return -1;
		}
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour
		) {
			if (this.options.listeRessources) {
				lRessource = this._getRessourceDeCours(aCours);
			}
			const lPlaceJour = aCours.Debut % lNbHoraires;
			lPlace = -1;
			this.options.optionsGrille.tranches.parcourir(
				(aNumeroTranche, aTranche) => {
					if (this.options.listeRessources) {
						if (
							!lRessource ||
							!aTranche.ressource ||
							aTranche.ressource.getNumero() !== lRessource.getNumero()
						) {
							return;
						}
					} else {
						if (
							aCours.numeroSemaine <= 0 ||
							aCours.numeroSemaine !== aTranche.numeroSemaine
						) {
							return;
						}
					}
					const lRecherche = this._recherchePlaceGrillePlanning({
						placeCours: lPlaceJour,
						dureeCours: lDuree,
						debut: true,
						nonVisible: aAvecPlaceNonVisible,
						numeroTranche: aNumeroTranche,
					});
					if (lRecherche.modifie) {
						lPlace = lRecherche.place;
					}
				},
			);
			return lPlace;
		}
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour &&
			this.options.listeRessources
		) {
			lRessource = this._getRessourceDeCours(aCours);
			lPlace = -1;
			this.options.optionsGrille.tranches.parcourir(
				(aNumeroTranche, aTranche) => {
					if (
						lRessource &&
						aTranche.ressource &&
						aTranche.ressource.getNumero() === lRessource.getNumero() &&
						lJour === aTranche.indiceJour
					) {
						const lPlaceJour = aCours.Debut % lNbHoraires;
						const lRecherche = this._recherchePlaceGrillePlanning({
							placeCours: lPlaceJour,
							dureeCours: lDuree,
							debut: true,
							nonVisible: aAvecPlaceNonVisible,
							numeroTranche: aNumeroTranche,
						});
						if (lRecherche.modifie) {
							lPlace = lRecherche.place;
						}
					}
				},
			);
			return lPlace;
		}
		return this._getPlaceGrilleDePlaceCours(
			aCours.Debut,
			lDuree,
			true,
			aAvecPlaceNonVisible,
		);
	}
	getPlaceGrilleDePlaceHebdo(aPlaceCours, aNonVisible) {
		if (this.options.estPlanning) {
			return -1;
		}
		return this._getPlaceGrilleDePlaceCours(aPlaceCours, 1, true, aNonVisible);
	}
	getDureeCours(aCours) {
		return aCours ? aCours.Fin - aCours.Debut + 1 : -1;
	}
	getPlaceHebdoDePlaceGrille(aPlace, aHoraireNonVisible) {
		const lTrancheHoraire = this.options.grille.getTrancheHoraireDePlace(
			aPlace,
			aHoraireNonVisible,
		);
		if (lTrancheHoraire.erreur && !aHoraireNonVisible) {
			return -1;
		}
		const lTranche = this.options.optionsGrille.tranches.get(
			lTrancheHoraire.tranche,
		);
		if (!lTranche) {
			return -1;
		}
		const lNbHoraires = this.options.optionsGrille.blocHoraires.nbHoraires();
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine
		) {
			const lBlocHoraire = this.options.grille
				.getOptions()
				.blocHoraires.rechercheHoraire(lTrancheHoraire.horaire);
			return (
				aPlace -
				Math.floor(aPlace / lNbHoraires) * lNbHoraires +
				(MethodesObjet_1.MethodesObjet.isNumber(lBlocHoraire.indiceJour)
					? (lBlocHoraire.indiceJour - lBlocHoraire.indiceBloc) *
						GParametres.PlacesParJour
					: 0)
			);
		}
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour &&
			this.options.listeRessources
		) {
			return (
				aPlace - (lTranche.numeroTranche - lTranche.indiceJour) * lNbHoraires
			);
		}
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour
		) {
			return (
				aPlace +
				this.options.indiceJourCycle * lNbHoraires -
				lTranche.numeroTranche * lNbHoraires
			);
		}
		if (
			lTranche &&
			MethodesObjet_1.MethodesObjet.isNumber(lTranche.indiceJour)
		) {
			return (
				aPlace + (lTranche.indiceJour - lTranche.numeroTranche) * lNbHoraires
			);
		}
		return aPlace;
	}
	remplirColonnesVisibles() {
		this.options.optionsGrille.tranches =
			new ObjetGrilleTranches_1.ObjetGrilleTranches();
		let lJoursOuvres = this.options.joursOuvresActifs;
		if (!lJoursOuvres) {
			lJoursOuvres = [];
			for (
				let lJour = 0;
				lJour < IE.Cycles.nombreJoursOuvresParCycle();
				lJour++
			) {
				lJoursOuvres.push(lJour);
			}
		}
		if (
			this.options.estPlanning &&
			(this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour ||
				this.options.typePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine) &&
			!this.options.listeRessources
		) {
			this.options.parametresGrille.domaine
				.getSemaines()
				.forEach((aNumeroSemaine) => {
					this.options.optionsGrille.tranches.add({
						numeroSemaine: aNumeroSemaine,
						indiceJour: this.options.indiceJourCycle,
					});
				});
		} else if (
			this.options.estPlanning &&
			(this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour ||
				this.options.typePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine) &&
			this.options.listeRessources
		) {
			this.options.listeRessources.parcourir((D, index) => {
				this.options.optionsGrille.tranches.add({ ressource: D });
			});
		} else if (
			this.options.estPlanning &&
			this.options.listeRessources &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour
		) {
			const lNbRessources = this.options.listeRessources.count();
			lJoursOuvres.forEach((aJour) => {
				this.options.listeRessources.parcourir((D, index) => {
					this.options.optionsGrille.tranches.add({
						ressource: D,
						indiceJour: aJour,
						tailleGouttiere: lNbRessources === index + 1 ? 10 : 0,
					});
				});
			});
		} else {
			if (this.options.parametresGrille.date) {
				this.options.optionsGrille.tranches.add({
					date: this.options.parametresGrille.date,
					indiceJour: IE.Cycles.dateEnJourCycle(
						this.options.parametresGrille.date,
					),
				});
			} else {
				lJoursOuvres.forEach((aJour) => {
					this.options.optionsGrille.tranches.add({ indiceJour: aJour });
				});
			}
		}
	}
	getNumeroJourDeTrancheHoraire(aTrancheHoraire) {
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine
		) {
			const lBloc = this.options.grille
				.getOptions()
				.blocHoraires.rechercheHoraire(aTrancheHoraire.horaire);
			return MethodesObjet_1.MethodesObjet.isNumber(lBloc.indiceJour)
				? lBloc.indiceJour
				: Math.floor(aTrancheHoraire.horaire / GParametres.PlacesParJour);
		}
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour &&
			this.options.listeRessources
		) {
			if (this.options.indiceJourCycle >= 0) {
				return this.options.indiceJourCycle;
			}
			return -1;
		}
		const lTranche = this.options.optionsGrille.tranches.get(
			aTrancheHoraire.tranche,
		);
		if (
			lTranche &&
			MethodesObjet_1.MethodesObjet.isNumber(lTranche.indiceJour)
		) {
			return lTranche.indiceJour;
		}
		return aTrancheHoraire.tranche;
	}
	getDateDeTrancheHoraire(aTrancheHoraire) {
		if (!aTrancheHoraire) {
			return new Date();
		}
		if (
			this.options.estPlanning &&
			(this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour ||
				this.options.typePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine) &&
			!this.options.listeRessources
		) {
			return IE.Cycles.jourCycleEnDate(
				this.getNumeroJourDeTrancheHoraire(aTrancheHoraire),
				this._getSemaines()[aTrancheHoraire.tranche],
			);
		}
		if (
			this.options.estPlanning &&
			(this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour ||
				this.options.typePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine) &&
			this.options.listeRessources
		) {
			return this.options.parametresGrille.numeroSemaine
				? IE.Cycles.jourCycleEnDate(
						this.getNumeroJourDeTrancheHoraire(aTrancheHoraire),
						this.options.parametresGrille.numeroSemaine,
					)
				: new Date();
		}
		return this.options.parametresGrille.date
			? this.options.parametresGrille.date
			: this.options.parametresGrille.numeroSemaine
				? IE.Cycles.jourCycleEnDate(
						this.getNumeroJourDeTrancheHoraire(aTrancheHoraire),
						this.options.parametresGrille.numeroSemaine,
					)
				: null;
	}
	getSemaineDeTrancheHoraire(aTrancheHoraire) {
		if (
			this.options.estPlanning &&
			(this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour ||
				this.options.typePlanning ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine) &&
			!this.options.listeRessources
		) {
			return this._getSemaines()[aTrancheHoraire.tranche];
		}
		return this.options.parametresGrille.date
			? IE.Cycles.cycleDeLaDate(this.options.parametresGrille.date)
			: this.options.parametresGrille.numeroSemaine;
	}
	getJourAnneeDeTrancheHoraire(aTrancheHoraire) {
		return (
			ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
				IE.Cycles.dateDebutPremierCycle(),
				this.getDateDeTrancheHoraire(aTrancheHoraire),
			) + 1
		);
	}
	getNumerosTranchesDeRessource(aRessource) {
		if (
			this.options.estPlanning &&
			this.options.typePlanning ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour &&
			this.options.listeRessources
		) {
			const lNumeros = [];
			this._getTranchesDeRessource(aRessource).forEach((aTranche) => {
				lNumeros.push(aTranche.numeroTranche);
			});
			return lNumeros;
		}
		if (!aRessource || !this.options.listeRessources) {
			return [];
		}
		const lIndice = this.options.listeRessources.getIndiceParNumeroEtGenre(
			aRessource.getNumero(),
			aRessource.getGenre(),
		);
		if (lIndice === undefined) {
			return [];
		}
		return [lIndice];
	}
	static getLibelleJourCycle(aNumeroJourCycle) {
		return GApplication.getObjetParametres().grillesEDTEnCycle ===
			TypeModeGrillesEDT_1.TypeModeGrillesEDT.TMG_CycleHebdomadaire
			? ObjetTraduction_1.GTraductions.getValeur("Jours")[
					IE.Cycles.indicesJoursOuvres()[aNumeroJourCycle] || 0
				]
			: ObjetTraduction_1.GTraductions.getValeur("JourCourt") +
					(aNumeroJourCycle + 1);
	}
	_getRessourceDeCours(aCours) {
		if (!aCours) {
			return null;
		}
		let lRessourceCours = aCours.ressource;
		if (
			!lRessourceCours &&
			this.options.listeRessources &&
			this.options.listeRessources.count() === 1
		) {
			lRessourceCours = this.options.listeRessources.get(0);
		}
		return lRessourceCours;
	}
	_getSemaines() {
		if (!this.options.semaines) {
			this.options.semaines =
				this.options.parametresGrille.domaine.getSemaines();
		}
		return this.options.semaines;
	}
	_getTranchesDeRessource(aRessource) {
		if (!aRessource || !this.options.listeRessources) {
			return [];
		}
		const lTranches = [];
		this.options.optionsGrille.tranches.parcourir(
			(aNumeroTranche, aTranche) => {
				if (
					aTranche.ressource &&
					aTranche.ressource.getNumero() === aRessource.getNumero()
				) {
					lTranches.push(aTranche);
				}
			},
		);
		return lTranches;
	}
}
exports.TUtilitaireConvertisseurPosition_Grille =
	TUtilitaireConvertisseurPosition_Grille;
