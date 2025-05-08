exports.TDecorateurAbsencesGrille = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const UtilitairePlaces_1 = require("UtilitairePlaces");
const C_FOND_MIXE = "MIXE";
class TDecorateurAbsencesGrille {
	constructor(aParams) {
		this.setDonnees(aParams);
		this.options = {
			callbackAbsenceOuverte: null,
			couleurAbsence: null,
			avecAbsencesDynamique: false,
			rayureRetard: false,
			rayureAbsence: false,
			classRayure: "Image_IndisponibiliteEtablissement",
		};
	}
	setDonnees(aParams) {
		this.placesAbsencesGrille = {};
		if (aParams) {
			this.absences = aParams.absencesGrille;
			this.domaine = aParams.domaine;
			this._preparerListes(aParams);
		}
		return this;
	}
	setOptions(aOptions) {
		$.extend(this.options, aOptions);
		return this;
	}
	ajouterAbsencesDansCours(aInstanceGrille, aCours, aHtml) {
		const lResult = { avecAbsence: false, couleur: null };
		if (aCours && aHtml && this.absences) {
			const lOptions = this.options;
			let lPlace;
			if (this.absences.listeAbsences) {
				this.absences.listeAbsences.parcourir((aAbsence) => {
					if (this._intersectionCoursAvecAbsence(aCours, aAbsence)) {
						const lPlaceDebut = Math.max(aAbsence.placeDebut, aCours.Debut);
						const lPlaceFin = Math.min(aAbsence.placeFin, aCours.Fin);
						let lCouleur = lOptions.couleurAbsence;
						if (
							!lCouleur &&
							aAbsence &&
							aAbsence.motif &&
							aAbsence.motif.couleur
						) {
							lCouleur = aAbsence.motif.couleur;
						}
						if (
							!lResult.couleur ||
							(lResult.couleur && lResult.couleur > lCouleur)
						) {
							lResult.couleur = lCouleur;
						}
						for (lPlace = lPlaceDebut; lPlace <= lPlaceFin; lPlace++) {
							aHtml.push(
								'<div style="position:absolute;',
								ObjetStyle_1.GStyle.composeCouleurFond(lCouleur),
								"left:0;right:0;",
								"top:",
								(lPlace - aCours.Debut) * aInstanceGrille.hauteurCellule,
								"px;",
								"height:",
								aInstanceGrille.hauteurCellule,
								"px;",
								this._getStyleHachure(lOptions, aInstanceGrille, lPlace),
								'" ',
								lOptions.avecAbsencesDynamique
									? ' ie-if="afficherAbsenceExistantesSurCours (' +
											lPlace +
											')"'
									: "",
								lOptions.rayureAbsence
									? 'class="' + lOptions.classRayure + '" '
									: "",
								"></div>",
							);
						}
						lResult.avecAbsence = true;
					}
				});
			}
			if (this.options.avecAbsencesDynamique) {
				for (lPlace = aCours.Debut; lPlace <= aCours.Fin; lPlace++) {
					aHtml.push(
						'<div ie-if="afficherAbsenceSurCours (',
						lPlace,
						')"',
						' ie-style="getStyleAbsenceSurCours (',
						lPlace,
						')"',
						' style="position:absolute;',
						"left:0;right:0;",
						"top:",
						(lPlace - aCours.Debut) * aInstanceGrille.hauteurCellule,
						"px;",
						"height:",
						aInstanceGrille.hauteurCellule,
						"px;",
						'" ',
						"></div>",
					);
				}
			}
		}
		return lResult;
	}
	traiterCoursMultiple(aCours, aLargeurSlide) {
		if (this.absences.listeRetards) {
			this.absences.listeRetards.parcourir((aAbsence) => {
				if (
					aCours.coursMultiple &&
					this._intersectionCoursAvecAbsence(aCours, aAbsence)
				) {
					aAbsence.decalageGauche = aLargeurSlide;
				}
			});
		}
		if (this.absences.listePunitions) {
			this.absences.listePunitions.parcourir((aAbsence) => {
				if (
					aCours.coursMultiple &&
					this._intersectionCoursAvecAbsence(aCours, aAbsence)
				) {
					aAbsence.decalageGauche = aLargeurSlide;
				}
			});
		}
	}
	getAbsenceDePlace(aPlace, aGenreAbsence) {
		return this._getAbsenceDePlace(aPlace, aGenreAbsence);
	}
	absencePresenteEntierementEntreLesPlaces(aPlaceDebut, aPlaceFin, aMotif) {
		let lResult = false;
		const lListe = this._getListeDeGenre(
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		if (!lListe) {
			return lResult;
		}
		lListe.parcourir((aAbsence) => {
			if (
				aAbsence.placeDebut <= aPlaceDebut &&
				aAbsence.placeFin >= aPlaceFin &&
				aMotif &&
				aAbsence.motif &&
				aMotif.getNumero() === aAbsence.motif.getNumero()
			) {
				lResult = true;
				return false;
			}
		});
		return lResult;
	}
	getCouleurFondDePlaceEDT(aPlace, aInfosPlace) {
		if (!aInfosPlace || aInfosPlace.ferie || aInfosPlace.horsAnneScolaire) {
			return "";
		}
		if (
			this.placesAbsencesGrille &&
			this.placesAbsencesGrille[aPlace] === C_FOND_MIXE
		) {
			return "";
		}
		const lAbsence = this._getAbsenceDePlace(
			aPlace,
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		if (!lAbsence) {
			return "";
		}
		if (
			!this.options.couleurAbsence &&
			lAbsence.motif &&
			lAbsence.motif.couleur
		) {
			return lAbsence.motif.couleur;
		}
		return this.options.couleurAbsence;
	}
	traceFondDePlace(aPlace, aInfosPlace, aFuncTraceHachure) {
		if (
			this.placesAbsencesGrille &&
			this.placesAbsencesGrille[aPlace] === C_FOND_MIXE
		) {
			aFuncTraceHachure({
				place: aPlace,
				couleur: TDecorateurAbsencesGrille.couleursAbsences.absenceP,
				traitD: true,
				traitG: !aInfosPlace.invalide,
			});
			return;
		}
		if (aInfosPlace.invalide) {
			return;
		}
		if (!this.options.rayureAbsence) {
			return;
		}
		const lAbsence = this._getAbsenceDePlace(
			aPlace,
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		if (!lAbsence) {
			return;
		}
		return aFuncTraceHachure({
			place: aPlace,
			couleur: "black",
			traitD: false,
			traitG: true,
		});
	}
	getExclusionsEleveDeJourCycle(aJourCycle, aNumeroSemaine) {
		const lElement = this.getElementDeJour(aJourCycle, aNumeroSemaine);
		if (lElement && (lElement.exclusionsEtab || lElement.exclusionsClasse)) {
			return lElement;
		}
		return null;
	}
	getVoilesTranchesExclusions(aJourCycle, aNumeroSemaine) {
		const lVoiles = [];
		if (this.absences && this.absences.joursCycle) {
			const lExclusions = this.getExclusionsEleveDeJourCycle(
				aJourCycle,
				aNumeroSemaine,
			);
			if (lExclusions) {
				if (
					lExclusions.exclusionsEtab &&
					lExclusions.exclusionsEtab.placeFin > 0
				) {
					lVoiles.push({
						placeDebut:
							lExclusions.exclusionsEtab.placeDebut % GParametres.PlacesParJour,
						placeFin:
							lExclusions.exclusionsEtab.placeFin % GParametres.PlacesParJour,
						couleur: TDecorateurAbsencesGrille.couleursAbsences.exclusionEtab,
					});
				}
				const lExclusionsClasseVisibles = lExclusions.exclusionsClasse;
				if (lExclusionsClasseVisibles && lExclusions.exclusionsEtab) {
					lExclusionsClasseVisibles.placeDebut = Math.max(
						lExclusionsClasseVisibles.placeDebut,
						lExclusions.exclusionsEtab.placeDebut,
					);
					lExclusionsClasseVisibles.placeFin = Math.min(
						lExclusionsClasseVisibles.placeFin,
						lExclusions.exclusionsEtab.placeFin,
					);
				}
				if (
					lExclusions.exclusionsClasse &&
					lExclusions.exclusionsClasse.placeFin > 0
				) {
					lVoiles.push({
						placeDebut:
							lExclusions.exclusionsClasse.placeDebut %
							GParametres.PlacesParJour,
						placeFin:
							lExclusions.exclusionsClasse.placeFin % GParametres.PlacesParJour,
						couleur: TDecorateurAbsencesGrille.couleursAbsences.exclusionClasse,
					});
				}
			}
		}
		return lVoiles;
	}
	getElementDeJour(aJourCycle, aNumeroSemaine) {
		if (!this.absences || !this.absences.joursCycle) {
			return null;
		}
		let lResult = false;
		this.absences.joursCycle.parcourir((aElement) => {
			if (aElement.jourCycle === aJourCycle) {
				if (
					!aElement.numeroSemaine ||
					!aNumeroSemaine ||
					aElement.numeroSemaine === aNumeroSemaine
				) {
					lResult = aElement;
					return false;
				}
			}
		});
		return lResult;
	}
	getOubliCarnetDeJour(aJourCycle) {
		const lElement = this.getElementDeJour(aJourCycle);
		if (lElement) {
			return !!lElement.oubliCarnet;
		}
		return false;
	}
	getDemiPensionDeJour(aJourCycle) {
		if (!this.absences || !this.absences.joursCycle) {
			return null;
		}
		let lResult = false;
		this.absences.joursCycle.parcourir((aElement) => {
			if (aElement.jourCycle === aJourCycle) {
				lResult = aElement.DP;
				return false;
			}
		});
		return lResult;
	}
	apresConstructionGrille(aInstanceGrille) {
		const T = [];
		if (this.absences) {
			if (this.absences.listeRetards) {
				this.absences.listeRetards.parcourir((aAbsence) => {
					T.push(this._construireRetard(aInstanceGrille, aAbsence));
				});
			}
			this._fusionnerElementsAbsences(this.absences.listeInfirmeries).parcourir(
				(aAbsence) => {
					T.push(
						this._construireExclusionEtInfirmerie(
							aInstanceGrille,
							aAbsence,
							Enumere_Ressource_1.EGenreRessource.Infirmerie,
						),
					);
				},
			);
			this._fusionnerElementsAbsences(this.absences.listePunitions).parcourir(
				(aAbsence) => {
					T.push(
						this._construireExclusionEtInfirmerie(
							aInstanceGrille,
							aAbsence,
							Enumere_Ressource_1.EGenreRessource.Exclusion,
						),
					);
				},
			);
			T.push(this._construireAbsenceOuverte(aInstanceGrille));
		}
		return T.join("");
	}
	_getListeDeGenre(aGenre) {
		let lListe = null;
		if (!this.absences) {
			return null;
		}
		switch (aGenre) {
			case Enumere_Ressource_1.EGenreRessource.Infirmerie:
				lListe = this.absences.listeInfirmeries;
				break;
			case Enumere_Ressource_1.EGenreRessource.Absence:
				lListe = this.absences.listeAbsences;
				break;
			case Enumere_Ressource_1.EGenreRessource.Exclusion:
				lListe = this.absences.listePunitions;
				break;
			case Enumere_Ressource_1.EGenreRessource.Retard:
				lListe = this.absences.listeRetards;
				break;
		}
		return lListe;
	}
	_traiterAbsencesMultiSemaines() {
		const lListe = this._getListeDeGenre(
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		const lDomaine = this.domaine;
		const lPlacesSemaine = {};
		let lSemaine;
		const lPremiereSemaine = lDomaine.getPremierePosition();
		const lDerniereSemaine = lDomaine.getDernierePosition();
		let lMaxPlaceHebdo = 0;
		let lInfosPlace;
		let lPlaceHebdo, lPlaceAnnuelle;
		this.placesAbsencesGrille = {};
		for (
			lSemaine = lPremiereSemaine;
			lSemaine <= lDerniereSemaine;
			lSemaine++
		) {
			lPlacesSemaine[lSemaine] = {};
		}
		if (lListe) {
			lListe.parcourir((aAbsence) => {
				for (
					lPlaceAnnuelle = aAbsence.placeAnnuelleDebut;
					lPlaceAnnuelle <= aAbsence.placeAnnuelleFin;
					lPlaceAnnuelle++
				) {
					lInfosPlace =
						UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
							lPlaceAnnuelle,
						);
					if (
						lInfosPlace.trouve &&
						lInfosPlace.cycle >= lPremiereSemaine &&
						lInfosPlace.cycle <= lDerniereSemaine
					) {
						lMaxPlaceHebdo = Math.max(lMaxPlaceHebdo, lInfosPlace.place);
						if (!lPlacesSemaine[lInfosPlace.cycle]) {
							lPlacesSemaine[lInfosPlace.cycle] = {};
						}
						lPlacesSemaine[lInfosPlace.cycle][lInfosPlace.place] = {
							motif: aAbsence.motif,
						};
					}
				}
			});
			for (lPlaceHebdo = 0; lPlaceHebdo <= lMaxPlaceHebdo; lPlaceHebdo++) {
				for (
					lSemaine = lPremiereSemaine;
					lSemaine <= lDerniereSemaine;
					lSemaine++
				) {
					if (this.placesAbsencesGrille[lPlaceHebdo] !== C_FOND_MIXE) {
						lInfosPlace = lPlacesSemaine[lSemaine][lPlaceHebdo];
						if (lSemaine === lPremiereSemaine) {
							if (lInfosPlace && lInfosPlace.motif) {
								this.placesAbsencesGrille[lPlaceHebdo] = lInfosPlace;
							}
						} else {
							if (lInfosPlace && lInfosPlace.motif) {
								if (
									!this.placesAbsencesGrille[lPlaceHebdo] ||
									this.placesAbsencesGrille[lPlaceHebdo].motif.getNumero() !==
										lInfosPlace.motif.getNumero()
								) {
									this.placesAbsencesGrille[lPlaceHebdo] = C_FOND_MIXE;
								}
							} else {
								if (
									this.placesAbsencesGrille[lPlaceHebdo] &&
									this.placesAbsencesGrille[lPlaceHebdo].motif
								) {
									this.placesAbsencesGrille[lPlaceHebdo] = C_FOND_MIXE;
								}
							}
						}
					}
				}
			}
		}
	}
	_preparerListes(aParams) {
		if (this.domaine && this.domaine.getNbrValeurs() > 1) {
			this._traiterAbsencesMultiSemaines();
		}
		if (aParams.cours) {
			this.cours = new ObjetElement_1.ObjetElement(
				"",
				aParams.cours.getNumero(),
			);
			this.cours.debut = aParams.cours.Debut;
			if (
				aParams.listeDispenses &&
				aParams.listeDispenses.count() > 0 &&
				aParams.listeDispenses.get(0).getEtat() !==
					Enumere_Etat_1.EGenreEtat.Suppression
			) {
				this.cours.avecDispense = true;
			}
		}
		if (!aParams.listeAbsences) {
			return;
		}
		const lListeAbsences = new ObjetListeElements_1.ObjetListeElements().add(
			aParams.listeAbsences,
		);
		let lAbsence;
		let lGenre;
		let lListe;
		let lParamsDebut;
		let lParamsFin;
		for (let i = 0, lNb = lListeAbsences.count(); i < lNb; i++) {
			lAbsence = lListeAbsences.get(i);
			lGenre = lAbsence.getGenre();
			lListe = this._getListeDeGenre(lGenre);
			if (!lListe) {
				continue;
			}
			switch (lAbsence.Etat) {
				case Enumere_Etat_1.EGenreEtat.Suppression: {
					const lIndice = lListe.getIndiceParNumeroEtGenre(
						lAbsence.getNumero(),
					);
					if (lIndice >= 0) {
						lListe.remove(lIndice);
					}
					break;
				}
				case Enumere_Etat_1.EGenreEtat.Creation:
					if (this.cours && this.cours.debut && lAbsence && lAbsence.tabAbs) {
						for (let j = 0; j < lAbsence.tabAbs.length; j++) {
							if (lAbsence.tabAbs[j].N === "1") {
								let lElement = new ObjetElement_1.ObjetElement();
								lElement.placeDebut = this.cours.debut + j;
								lElement.placeFin = this.cours.debut + j;
								lElement.Numero = lAbsence.Numero;
								lListe.addElement(lElement);
							}
						}
					} else {
						lParamsDebut =
							UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
								lAbsence.PlaceDebut,
							);
						lParamsFin =
							UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
								lAbsence.PlaceFin,
							);
						let lElement = lListe.getElementParNumero(lAbsence.getNumero());
						if (!lElement) {
							lElement = new ObjetElement_1.ObjetElement();
							lListe.addElement(lElement);
							lElement.Numero = lAbsence.Numero;
						}
						lElement.placeDebut = lParamsDebut.place;
						lElement.placeFin = lParamsFin.place;
					}
					break;
				case Enumere_Etat_1.EGenreEtat.Modification: {
					let lElement = lListe.getElementParNumero(lAbsence.getNumero());
					if (lElement) {
						lParamsDebut =
							UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
								lAbsence.PlaceDebut,
							);
						lParamsFin =
							UtilitairePlaces_1.TUtilitairePlaces.placeAnnuelleEnPlaceCycle(
								lAbsence.PlaceFin,
							);
						lElement.placeDebut = lParamsDebut.place;
						lElement.placeFin = lParamsFin.place;
					}
					break;
				}
			}
		}
	}
	_getStyleHachure(aOptions, aInstanceGrille, aPlace) {
		if (!aOptions.rayureAbsence) {
			return "";
		}
		const lCoordonnees = aInstanceGrille.getCoordonneesDePlace(aPlace);
		return (
			"background-position:" +
			-lCoordonnees.left +
			"px " +
			-lCoordonnees.top +
			"px;"
		);
	}
	_intersectionCoursAvecAbsence(aCours, aAbsence) {
		return (
			aAbsence.placeDebut <= aCours.Fin && aAbsence.placeFin >= aCours.Debut
		);
	}
	_getAbsenceDePlace(aPlace, aGenreAbsence) {
		let lAbsence = null;
		const lListe = this._getListeDeGenre(aGenreAbsence);
		if (!lListe) {
			return;
		}
		lListe.parcourir((aAbsence) => {
			if (aAbsence.placeDebut <= aPlace && aAbsence.placeFin >= aPlace) {
				lAbsence = aAbsence;
				return false;
			}
		});
		return lAbsence;
	}
	_construireRetard(aInstanceGrille, aRetard) {
		const T = [],
			lDecalage = aRetard.decalageGauche ? aRetard.decalageGauche + 1 : 0,
			lHeight = aInstanceGrille.hauteurCellule - 7,
			lCoordonnes = aInstanceGrille.getCoordonneesDePlace(
				aInstanceGrille
					.getOptions()
					.convertisseurPosition.getPlaceGrilleDePlaceHebdo(aRetard.placeDebut),
			);
		let lCouleur = this.options.couleurRetard;
		if (!lCouleur) {
			lCouleur = aRetard.motif.couleur;
		}
		T.push(
			'<div style="position:absolute; overflow:hidden; z-index:4;',
			"left:",
			lCoordonnes.left + 2 + lDecalage,
			"px;",
			"width:",
			aInstanceGrille.largeurCellule - 7 - lDecalage,
			"px;",
			"height:",
			lHeight,
			"px;",
			"line-height:",
			lHeight,
			"px;",
			"top:",
			lCoordonnes.top + 2,
			"px;",
			ObjetStyle_1.GStyle.composeCouleurFond(lCouleur),
			ObjetStyle_1.GStyle.composeCouleurTexte(
				GCouleur.getCouleurCorrespondance(lCouleur),
			),
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.noir),
			'"',
			' class="AlignementMilieu',
			this.options.rayureRetard ? " " + this.options.classRayure : "",
			'">',
			"<span>",
			ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.1Retard"),
			"</span>",
		);
		T.push("</div>");
		return T.join("");
	}
	_construireExclusionEtInfirmerie(aInstanceGrille, aAbsence, aGenre) {
		if (aAbsence.placeFin < aAbsence.placeDebut) {
			return;
		}
		const lCoordonnes = aInstanceGrille.getCoordonneesDePlace(
			aInstanceGrille
				.getOptions()
				.convertisseurPosition.getPlaceGrilleDePlaceHebdo(aAbsence.placeDebut),
		);
		const lCoordonnesFin = aInstanceGrille.getCoordonneesDePlace(
			aInstanceGrille
				.getOptions()
				.convertisseurPosition.getPlaceGrilleDePlaceHebdo(aAbsence.placeFin),
		);
		const T = [];
		let lLibelle, lLeft, lCouleur;
		const lWidthTrait = 3;
		if (aGenre === Enumere_Ressource_1.EGenreRessource.Exclusion) {
			lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.ExclusionAbr",
			);
			lLeft = lCoordonnes.left + (aAbsence.decalageGauche || 0);
			lCouleur = TDecorateurAbsencesGrille.couleursAbsences.exclusion;
		} else {
			lLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.InfirmerieAbr",
			);
			lLeft = lCoordonnes.right - lWidthTrait;
			lCouleur = TDecorateurAbsencesGrille.couleursAbsences.infirmerie;
		}
		T.push(
			'<div style="position:absolute; z-index:5;',
			"left:",
			lLeft,
			"px;",
			"top:",
			lCoordonnes.top,
			"px;",
			ObjetStyle_1.GStyle.composeHeight(
				lCoordonnesFin.bottom - lCoordonnes.top,
			),
			ObjetStyle_1.GStyle.composeWidth(lWidthTrait),
			ObjetStyle_1.GStyle.composeCouleurFond(lCouleur),
			'pointer-events:none;">',
			'<span class="Gras" style="',
			ObjetStyle_1.GStyle.composeCouleurTexte(lCouleur),
			"font-family: Verdana, Geneva, Arial, Helvetica, sans-serif;",
			"position:absolute;top:0; left:",
			aGenre === Enumere_Ressource_1.EGenreRessource.Exclusion ? 4 : -7,
			'px;">',
			lLibelle,
			"</span>",
		);
		T.push("</div>");
		return T.join("");
	}
	_fusionnerElementsAbsences(aListe) {
		const lListe = new ObjetListeElements_1.ObjetListeElements(),
			lListeModele = new ObjetListeElements_1.ObjetListeElements(),
			lHashPlaces = {};
		if (aListe) {
			lListeModele.add(aListe);
		}
		lListeModele.setTri([
			ObjetTri_1.ObjetTri.init("placeDebut"),
			ObjetTri_1.ObjetTri.init("placeFin"),
		]);
		lListeModele.trier();
		lListeModele.parcourir((aElement) => {
			let lElement = new ObjetElement_1.ObjetElement();
			lElement.placeDebut = aElement.placeDebut;
			lElement.placeFin = aElement.placeFin;
			let lTrouve = false;
			if (lHashPlaces[aElement.placeDebut - 1]) {
				lElement = lHashPlaces[aElement.placeDebut - 1];
				lElement.placeDebut = Math.min(
					lElement.placeDebut,
					aElement.placeDebut,
				);
				lElement.placeFin = Math.max(lElement.placeFin, aElement.placeFin);
				lTrouve = true;
			}
			if (lHashPlaces[aElement.placeFin + 1]) {
				lElement = lHashPlaces[aElement.placeFin + 1];
				lElement.placeDebut = Math.min(
					lElement.placeDebut,
					aElement.placeDebut,
				);
				lElement.placeFin = Math.max(lElement.placeFin, aElement.placeFin);
				lTrouve = true;
			}
			for (
				let lPlace = aElement.placeDebut;
				lPlace <= aElement.placeFin;
				lPlace++
			) {
				lHashPlaces[lPlace] = lElement;
			}
			if (!lTrouve) {
				lListe.addElement(lElement);
			}
		});
		return lListe;
	}
	_construireAbsenceOuverte(aInstanceGrille) {
		const T = [];
		const lListe = this._getListeDeGenre(
			Enumere_Ressource_1.EGenreRessource.Absence,
		);
		if (!lListe) {
			return "";
		}
		let lAbsenceConcerneOuverture = null;
		lListe.parcourir((aAbsence) => {
			if (aAbsence.concerneOuverture) {
				lAbsenceConcerneOuverture = aAbsence;
				return false;
			}
		});
		if (!lAbsenceConcerneOuverture) {
			return "";
		}
		const lCoordonnees = aInstanceGrille.getCoordonneesDePlace(
				aInstanceGrille
					.getOptions()
					.convertisseurPosition.getPlaceGrilleDePlaceHebdo(
						lAbsenceConcerneOuverture.placeFin,
					),
			),
			lCallbackSaisie =
				this.options.callbackAbsenceOuverte && !this.options.rayureAbsence;
		if (lCallbackSaisie) {
			const lThis = this;
			aInstanceGrille.controleur._getNodeAbsenceOuverte_ = function () {
				$(this.node).on({
					pointerdown: function (aEvent) {
						aEvent.stopPropagation();
					},
					pointerup: function () {
						lThis.options.callbackAbsenceOuverte(lAbsenceConcerneOuverture);
					},
				});
			};
		}
		T.push(
			'<div style="position:absolute; z-index:4;',
			"left:",
			lCoordonnees.left +
				Math.floor(aInstanceGrille.largeurCellule / 2 - 15 / 2 - 1),
			"px;",
			"top:",
			lCoordonnees.top + aInstanceGrille.hauteurCellule - 10 - 1,
			"px;",
			'"',
			lCallbackSaisie ? ' ie-node="_getNodeAbsenceOuverte_"' : "",
			' title="',
			ObjetChaine_1.GChaine.toTitle(
				lAbsenceConcerneOuverture.absenceOuverte
					? ObjetTraduction_1.GTraductions.getValeur(
							"grilleAbsence.HintFermerAbsence",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"grilleAbsence.HintOuvrirAbsence",
						),
			),
			'"',
			' class="',
			lCallbackSaisie ? "AvecMain " : "",
			lAbsenceConcerneOuverture.absenceOuverte
				? "Image_GrilleAbsence_AbsenceOuverte"
				: "Image_GrilleAbsence_AbsenceFermee",
			'"></div>',
		);
		return T.join("");
	}
}
exports.TDecorateurAbsencesGrille = TDecorateurAbsencesGrille;
TDecorateurAbsencesGrille.couleursAbsences = {
	infirmerie: "#008000",
	exclusion: "var(--color-red)",
	exclusionEtab: "#E75555",
	exclusionClasse: "#FD9243",
	absenceP: "#dcc5f7",
};
