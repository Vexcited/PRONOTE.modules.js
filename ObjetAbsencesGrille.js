const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreBordure } = require("ObjetStyle.js");
const { GChaine } = require("ObjetChaine.js");
const { GStyle } = require("ObjetStyle.js");
const { GDate } = require("ObjetDate.js");
const { GTraductions } = require("ObjetTraduction.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetGrille } = require("ObjetGrille.js");
const {
	TypeHttpSaisieAbsencesGrille,
} = require("TypeHttpSaisieAbsencesGrille.js");
const { TDecorateurAbsencesGrille } = require("UtilitaireAbsencesGrille.js");
const {
	TUtilitaireGrilleImageCoursPN,
} = require("UtilitaireGrilleImageCoursPN.js");
class ObjetAbsencesGrille extends ObjetGrille {
	constructor(...aParams) {
		super(...aParams);
		this.setOptions({
			avecSelectionCours: false,
			couleurFond: GCouleur.grilleOccupation.fond,
			couleurBordures: "black",
			couleurFondCoursSuperpose: GCouleur.grille.fond,
			hauteurLigneTitre: 22,
			hauteurContenuTitre: 17,
			avecZoomCtrlWheel: true,
			avecInitSelectionColonne: false,
			largeurReserve: 500,
			avecPiedTranche: false,
			taillePiedTranche: 0,
			hauteurCellulePiedGrille_DP: 21,
			hauteurCellulePiedGrille_Internat: 17,
			ieClassConteneurGrille: "getClassConteneurGrille",
			choixAbsence: EGenreRessource.Absence,
			motifAbsence: null,
			callbackSaisieAbsence: null,
			callbackMenuContextuelMotifAbsence: null,
			couleurLibelleExclu: "red",
			couleurLibelleExcluEtab:
				TDecorateurAbsencesGrille.couleursAbsences.exclusionEtab,
			largeurTitreGauche: Math.max(
				40,
				GChaine.getLongueurChaineDansDiv(
					GTraductions.getValeur("grilleAbsence.Internat"),
					10,
				) + 2,
			),
			saisieAbsencesParDJ: GApplication.droits.get(
				TypeDroits.fonctionnalites.gestionAbsenceDJParUtilisateur,
			),
			getNodeConteneurGrille: _getNodeConteneurGrille.bind(this),
		});
		this.moduleCours.setParametres({
			filtresImagesUniquement: [
				TUtilitaireGrilleImageCoursPN.type.dispense,
				TUtilitaireGrilleImageCoursPN.type.aucunEleve,
				TUtilitaireGrilleImageCoursPN.type.appelFait,
				TUtilitaireGrilleImageCoursPN.type.devoir,
				TUtilitaireGrilleImageCoursPN.type.evaluation,
			],
			avecVoileCoursObligDispense: false,
		});
	}
	actualisationGabarit(aParams) {
		aParams.placesPrecedentes.forEach((aPlace) => {
			const lCouleur =
				this._options.decorateurAbsences.getCouleurFondDePlaceEDT(
					aPlace,
					this.getInfosDePlace(aPlace),
				);
			this.traceCanvasFondRectDePlace(aPlace, lCouleur);
		});
		aParams.placesCourantes.forEach((aPlace) => {
			const lInfosPlace = this.getInfosDePlace(aPlace),
				lGabarit = this._parametresGrille.gabarit;
			let lCouleur = this._options.decorateurAbsences.getCouleurFondDePlaceEDT(
				aPlace,
				this.getInfosDePlace(aPlace),
			);
			if (!lInfosPlace.horsAnneScolaire && !lInfosPlace.ferie && lGabarit) {
				if (lGabarit.ajout !== false) {
					lCouleur = this._options.motifAbsence.couleur;
				} else {
					lCouleur = null;
				}
			}
			this.traceCanvasFondRectDePlace(aPlace, lCouleur);
		});
	}
	getPlaceAbsence(aPlace, aPlaceDebut) {
		let lPlace = aPlace;
		if (aPlace >= 0 && this._options.saisieAbsencesParDJ) {
			const lTrancheHoraire = this.getTrancheHoraireDePlace(aPlace);
			if (lTrancheHoraire.horaire < GParametres.PlaceDemiJournee) {
				lPlace = this.getPlaceDeTrancheHoraire({
					tranche: lTrancheHoraire.tranche,
					horaire: aPlaceDebut ? 0 : GParametres.PlaceDemiJournee - 1,
				});
			} else {
				lPlace = this.getPlaceDeTrancheHoraire({
					tranche: lTrancheHoraire.tranche,
					horaire: aPlaceDebut
						? GParametres.PlaceDemiJournee
						: GParametres.PlacesParJour - 1,
				});
			}
		}
		return lPlace;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getClassConteneurGrille: function () {
				switch (this.instance._options.choixAbsence) {
					case EGenreRessource.Absence:
						return "Curseur_Absence";
					case EGenreRessource.Retard:
						return "Curseur_Retard";
					case EGenreRessource.Infirmerie:
						return "Curseur_Infirmerie";
					case EGenreRessource.Exclusion:
						return "Curseur_Exclusion";
					default:
						return "";
				}
			},
			afficherAbsenceExistantesSurCours: function (aPlace) {
				const lGabarit = this.instance._parametresGrille.gabarit;
				if (lGabarit && lGabarit.ajout === false) {
					return (
						aPlace < aInstance.getPlaceAbsence(lGabarit.placeDebut, true) ||
						aPlace >= aInstance.getPlaceAbsence(lGabarit.placeFin, false) + 1
					);
				}
				return true;
			},
			afficherAbsenceSurCours: function (aPlace) {
				const lGabarit = this.instance._parametresGrille.gabarit;
				if (!lGabarit) {
					return false;
				}
				return (
					lGabarit.ajout !== false &&
					aPlace >= aInstance.getPlaceAbsence(lGabarit.placeDebut, true) &&
					aPlace < aInstance.getPlaceAbsence(lGabarit.placeFin, false) + 1
				);
			},
			getStyleAbsenceSurCours: function (aPlace) {
				const lGrille = this.instance,
					lInfosPlace = lGrille.getInfosDePlace(aPlace);
				return {
					"background-color":
						lInfosPlace.horsAnneScolaire ||
						lInfosPlace.ferie ||
						(lGrille._parametresGrille.gabarit && lGrille.ajout === false)
							? ""
							: lGrille._options.motifAbsence
								? lGrille._options.motifAbsence.couleur
								: "white",
				};
			},
			avecSaisieAbsenceJournee: function (aColonne) {
				if (this.instance._options.choixAbsence !== EGenreRessource.Absence) {
					return false;
				}
				if (this.instance._parametresGrille.multiSemaines) {
					return false;
				}
				const lDate =
					this.instance._options.convertisseurPosition.getDateDeTrancheHoraire({
						tranche: aColonne,
						horaire: 0,
					});
				return (
					GDate.estDateDansAnneeScolaire(lDate) &&
					(!this.instance._options.joursFeries ||
						!this.instance._options.joursFeries.getValeur(
							this.instance._options.convertisseurPosition.getJourAnneeDeTrancheHoraire(
								{ tranche: aColonne, horaire: 0 },
							),
						))
				);
			},
			getClassSaisieAbsenceJournee: function (aColonne) {
				const lInterval = _getIntervalDeColonne.call(this.instance, aColonne),
					lDecorateur = this.instance.getDecorateurAbsences();
				return lDecorateur.absencePresenteEntierementEntreLesPlaces(
					lInterval.placeDebut,
					lInterval.placeFin,
					this.instance._options.motifAbsence,
				)
					? "Image_BtnSaisieAbsenceEnleverJournee1etat"
					: "Image_BtnSaisieAbsenceJournee1etat";
			},
			getTitleSaisieAbsenceJournee: function (aColonne) {
				const lInterval = _getIntervalDeColonne.call(this.instance, aColonne),
					lDecorateur = this.instance.getDecorateurAbsences();
				return lDecorateur.absencePresenteEntierementEntreLesPlaces(
					lInterval.placeDebut,
					lInterval.placeFin,
					this.instance._options.motifAbsence,
				)
					? GTraductions.getValeur("grilleAbsence.HintEnleverAbsenceJournee")
					: GTraductions.getValeur("grilleAbsence.HintSaisieAbsenceJournee");
			},
			getNodeSaisieAbsenceJournee: function (aColonne) {
				const lGrille = this.instance;
				$(this.node).on("click", () => {
					const lInterval = _getIntervalDeColonne.call(lGrille, aColonne);
					lGrille._options.callbackSaisieAbsence({
						genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Grille,
						placeDebut: lInterval.placeDebut,
						placeFin: lInterval.placeFin,
						genre: EGenreRessource.Absence,
					});
				});
			},
			avecSaisieDefautCarnet: function (aColonne) {
				if (
					!GApplication.droits.get(TypeDroits.absences.avecSaisieDefautCarnet)
				) {
					return false;
				}
				if (this.instance._parametresGrille.multiSemaines) {
					return false;
				}
				const lDate =
					this.instance._options.convertisseurPosition.getDateDeTrancheHoraire({
						tranche: aColonne,
						horaire: 0,
					});
				return (
					GDate.estDateDansAnneeScolaire(lDate) &&
					(!this.instance._options.joursFeries ||
						!this.instance._options.joursFeries.getValeur(
							this.instance._options.convertisseurPosition.getJourAnneeDeTrancheHoraire(
								{ tranche: aColonne, horaire: 0 },
							),
						))
				);
			},
			getClassSaisieDefautCarnet: function (aColonne) {
				return this.instance
					.getDecorateurAbsences()
					.getOubliCarnetDeJour(
						this.instance._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
							{ tranche: aColonne, horaire: 0 },
						),
					)
					? "Image_OubliCarnet1etatBarre"
					: "Image_OubliCarnet1etat";
			},
			getTitleSaisieDefautCarnet: function (aColonne) {
				return this.instance
					.getDecorateurAbsences()
					.getOubliCarnetDeJour(
						this.instance._options.convertisseurPosition.getNumeroJourDeTrancheHoraire(
							{ tranche: aColonne, horaire: 0 },
						),
					)
					? GTraductions.getValeur(
							"grilleAbsence.HintEnleverCarnetOublieJournee",
						)
					: GTraductions.getValeur(
							"grilleAbsence.HintSaisieCarnetOublieJournee",
						);
			},
			getNodeSaisieDefautCarnet: function (aColonne) {
				const lGrille = this.instance;
				$(this.node).on("click", () => {
					lGrille._options.callbackSaisieAbsence({
						genreSaisie: TypeHttpSaisieAbsencesGrille.sag_defautCarnet,
						date: lGrille._options.convertisseurPosition.getDateDeTrancheHoraire(
							{ tranche: aColonne, horaire: 0 },
						),
					});
				});
			},
			getNodeDemiPension: function (aColonne, aRepasMidi) {
				const lGrille = this.instance;
				$(this.node).on("click", () => {
					lGrille._options.callbackSaisieAbsence({
						genreSaisie: TypeHttpSaisieAbsencesGrille.sag_DemiPension,
						date: lGrille._options.convertisseurPosition.getDateDeTrancheHoraire(
							{ tranche: aColonne, horaire: 0 },
						),
						repasMidi: aRepasMidi,
					});
				});
			},
			getNodeDemiPensionExclusion: function (aColonne) {
				const lGrille = this.instance;
				$(this.node).on("click", () => {
					lGrille._options.callbackSaisieAbsence({
						genreSaisie: TypeHttpSaisieAbsencesGrille.sag_DemiPension,
						date: lGrille._options.convertisseurPosition.getDateDeTrancheHoraire(
							{ tranche: aColonne, horaire: 0 },
						),
					});
				});
			},
			getNodeInternat: function (aColonne) {
				const lGrille = this.instance;
				$(this.node).on("click", () => {
					lGrille._options.callbackSaisieAbsence({
						genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Internat,
						date: lGrille._options.convertisseurPosition.getDateDeTrancheHoraire(
							{ tranche: aColonne, horaire: 0 },
						),
					});
				});
			},
		});
	}
	setDonnees(aParams) {
		const lDecorateur = this.getDecorateurAbsences();
		if (lDecorateur.absences) {
			this.setOptions({
				afficherCoursHorsHoraire: false,
				avecPiedTranche:
					(!!lDecorateur.absences.avecDemiPension ||
						!!lDecorateur.absences.avecInternat) &&
					(this._options.choixAbsence === EGenreRessource.Absence ||
						this._options.choixAbsence === EGenreRessource.Exclusion),
				taillePiedTranche:
					(!!lDecorateur.absences.avecDemiPension
						? this._options.hauteurCellulePiedGrille_DP
						: 0) +
					(!!lDecorateur.absences.avecInternat
						? this._options.hauteurCellulePiedGrille_Internat
						: 0) +
					5,
			});
		}
		aParams.multiSemaines =
			!!aParams.domaine && aParams.domaine.getNbrValeurs() > 1;
		super.setDonnees(aParams);
	}
	getClassCurseurDeCellule(aPlaceGrille) {
		let lClass = super.getClassCurseurDeCellule(aPlaceGrille),
			lInfosPlace = this.getInfosDePlace(aPlaceGrille);
		if (lInfosPlace.horsAnneScolaire || lInfosPlace.ferie) {
			lClass += " AvecInterdiction";
		}
		return lClass;
	}
	composeTitresTranches(I, ALargeur, aFormatColonnes) {
		const T = [];
		T.push(super.composeTitresTranches(I, ALargeur, aFormatColonnes));
		T.push(
			'<div ie-class="getClassSaisieAbsenceJournee(',
			I,
			')"',
			' ie-if="avecSaisieAbsenceJournee(',
			I,
			')"',
			' ie-node="getNodeSaisieAbsenceJournee(',
			I,
			')"',
			' ie-title="getTitleSaisieAbsenceJournee(',
			I,
			')"',
			' class="AvecMain" style="position:absolute; top:0; left:2px;"></div>',
		);
		T.push(
			'<div ie-class="getClassSaisieDefautCarnet(',
			I,
			')"',
			' ie-if="avecSaisieDefautCarnet(',
			I,
			')"',
			' ie-node="getNodeSaisieDefautCarnet(',
			I,
			')"',
			' ie-title="getTitleSaisieDefautCarnet(',
			I,
			')"',
			' class="AvecMain" style="position:absolute; top:0; right:2px;"></div>',
		);
		return T.join("");
	}
	composeTitreHorairePiedTranche() {
		const T = [],
			lDecorateur = this.getDecorateurAbsences();
		if (!lDecorateur || !lDecorateur.absences) {
			return "";
		}
		if (lDecorateur.absences.avecDemiPension) {
			T.push(
				'<div style="',
				GStyle.composeHeight(this._options.hauteurCellulePiedGrille_DP),
				'" class="AlignementMilieuVertical">',
			);
			T.push(
				'<div style="line-height:',
				this._options.hauteurCellulePiedGrille_DP,
				'px;">' + GTraductions.getValeur("grilleAbsence.Repas") + "</div>",
			);
			T.push("</div>");
		}
		if (lDecorateur.absences.avecInternat) {
			T.push(
				'<div style="',
				GStyle.composeHeight(this._options.hauteurCellulePiedGrille_Internat),
				lDecorateur.absences.avecDemiPension ? "margin-top:5px;" : "",
				'" class="AlignementMilieuVertical">',
			);
			T.push(
				'<div style="line-height:',
				this._options.hauteurCellulePiedGrille_Internat,
				'px;">' + GTraductions.getValeur("grilleAbsence.Internat") + "</div>",
			);
			T.push("</div>");
		}
		return T.join("");
	}
	composeContenuPiedTranche(aParams) {
		const T = [];
		const lJourCycle =
			this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire({
				tranche: aParams.numeroTranche,
				horaire: 0,
			});
		const lDecorateur = this.getDecorateurAbsences();
		const lElementJour = lDecorateur.getElementDeJour(lJourCycle);
		let lAvecDP = false;
		if (
			lDecorateur.absences &&
			lDecorateur.absences.avecDemiPension &&
			lElementJour &&
			lElementJour.DP
		) {
			lAvecDP = true;
			switch (this._options.choixAbsence) {
				case EGenreRessource.Absence:
					T.push(
						_composeDemiPensionAbsence.call(
							this,
							aParams.numeroTranche,
							lElementJour.DP,
						),
					);
					break;
				case EGenreRessource.Exclusion:
					T.push(
						_composeDemiPensionExclusion.call(
							this,
							aParams.numeroTranche,
							lElementJour.DP,
							aParams.derniereTranche,
						),
					);
					break;
				default:
			}
		}
		if (
			lDecorateur.absences &&
			lDecorateur.absences.avecInternat &&
			lElementJour &&
			lElementJour.internat
		) {
			T.push(
				_composeInternat.call(this, {
					internat: lElementJour.internat,
					numeroColonne: aParams.numeroTranche,
					derniereColonne: aParams.derniereTranche,
					jourCycle: lJourCycle,
					avecDP: lAvecDP,
				}),
			);
		}
		return T.join("");
	}
	getLargeurMaxGrille() {
		const lLargeur = super.getLargeurMaxGrille();
		return lLargeur - this._options.largeurReserve;
	}
}
function _getIntervalDeColonne(aColonne) {
	const lInterval = { placeDebut: 0, placeFin: 0 },
		lJour = this._options.convertisseurPosition.getNumeroJourDeTrancheHoraire({
			tranche: aColonne,
			horaire: 0,
		});
	lInterval.placeDebut = lJour * GParametres.PlacesParJour;
	lInterval.placeFin = lInterval.placeDebut + GParametres.PlacesParJour - 1;
	return lInterval;
}
function _getNodeConteneurGrille(aNode) {
	const lGrille = this;
	$(aNode).on("pointerdown", (aEvent) => {
		if (aEvent && aEvent.target) {
			if (
				aEvent.target.classList &&
				aEvent.target.classList.contains("cours-multiple-slider")
			) {
				return;
			}
			if (
				aEvent.target.closest &&
				aEvent.target.closest(".cours-multiple-slider")
			) {
				return;
			}
		}
		const lPosition = lGrille.getPositionGrilleEvent(aEvent),
			lPlace = lGrille.getPlaceDePosition(lPosition),
			lInfosPlace = lGrille.getInfosDePlace(lPlace);
		if (lInfosPlace.horsAnneScolaire || lInfosPlace.ferie) {
			return;
		}
		if (lGrille._parametresGrille.gabarit) {
			let lAjout = true;
			if (lGrille._options.choixAbsence === EGenreRessource.Absence) {
				const lAbsence = lGrille
					.getDecorateurAbsences()
					.getAbsenceDePlace(lPlace, EGenreRessource.Absence);
				if (
					lAbsence &&
					lGrille._options.motifAbsence &&
					lAbsence.motif.getNumero() ===
						lGrille._options.motifAbsence.getNumero()
				) {
					lAjout = false;
				}
			}
			if (aEvent.pointerType === "mouse" && aEvent.which !== 1) {
				return;
			}
			lGrille._parametresGrille.gabarit.ajout = lAjout;
			lGrille._parametresGrille.gabarit.demarrerCreation({
				place: lGrille.getPlaceDePosition(lPosition),
			});
		} else {
			lGrille._options.callbackSaisieAbsence({
				genreSaisie: TypeHttpSaisieAbsencesGrille.sag_Grille,
				placeDebut: lPlace,
				placeFin: lPlace,
				genre: lGrille._options.choixAbsence,
			});
		}
	});
	if (lGrille._options.choixAbsence === EGenreRessource.Absence) {
		$(aNode).on("contextmenu", (aEvent) => {
			const lPosition = lGrille.getPositionGrilleEvent(aEvent),
				lPlace = lGrille.getPlaceDePosition(lPosition);
			const lAbsence = lGrille
				.getDecorateurAbsences()
				.getAbsenceDePlace(lPlace, EGenreRessource.Absence);
			if (lAbsence && lAbsence.motif) {
				lGrille._options.callbackMenuContextuelMotifAbsence(lAbsence.motif);
			}
		});
	}
}
function _colonneEstFeriee(aNumeroColonne) {
	return this._options.joursFeries.getValeur(
		this._options.convertisseurPosition.getJourAnneeDeTrancheHoraire({
			tranche: aNumeroColonne,
			horaire: 0,
		}),
	);
}
function _composeDemiPensionAbsence(aNumeroColonne, aDemiPension) {
	const T = [];
	T.push(
		'<div style="',
		GStyle.composeHeight(this._options.hauteurCellulePiedGrille_DP),
		'" class="NoWrap">',
	);
	if (aDemiPension.midi) {
		T.push(
			'<div class="InlineBlock Image_',
			aDemiPension.midi.img,
			aDemiPension.saisieAbsence ? " AvecMain" : "",
			'" title="',
			GChaine.toTitle(aDemiPension.midi.hint),
			'"',
			aDemiPension.saisieAbsence
				? ' ie-node="getNodeDemiPension(' + aNumeroColonne + ',true)"'
				: "",
			"></div>",
		);
	}
	if (aDemiPension.soir) {
		if (aDemiPension.midi) {
			T.push('<div class="InlineBlock EspaceGauche"></div>');
		}
		T.push(
			'<div class="InlineBlock Image_',
			aDemiPension.soir.img,
			aDemiPension.saisieAbsence ? " AvecMain" : "",
			'"',
			' title="',
			GChaine.toTitle(aDemiPension.soir.hint),
			'"',
			aDemiPension.saisieAbsence
				? ' ie-node="getNodeDemiPension(' + aNumeroColonne + ',false)"'
				: "",
			"></div>",
		);
	}
	if (aDemiPension.exclusion) {
		T.push(
			'<div class="InlineBlock Gras Texte11" style="',
			GStyle.composeCouleurTexte(this._options.couleurLibelleExclu),
			"line-height:",
			this._options.hauteurCellulePiedGrille_DP,
			'px;">',
			GTraductions.getValeur("grilleAbsence.Exclu"),
			"</div>",
		);
	}
	T.push("</div>");
	return T.join("");
}
function _composeDemiPensionExclusion(
	aNumeroColonne,
	aDemiPension,
	aDerniereColonne,
) {
	const T = [];
	const lAvecAbsence =
			(aDemiPension.midi && aDemiPension.midi.absent) ||
			(aDemiPension.soir && aDemiPension.soir.absent),
		lAvecSaisie = aDemiPension.saisieExclusion && !lAvecAbsence;
	T.push(
		'<div style="',
		GStyle.composeCouleurBordure(
			this.getCouleurBordures(),
			1,
			EGenreBordure.gauche +
				EGenreBordure.haut +
				EGenreBordure.bas +
				(aDerniereColonne ? EGenreBordure.droite : 0),
		),
		GStyle.composeHeight(this._options.hauteurCellulePiedGrille_DP - 2),
		GStyle.composeCouleurFond(this.getCouleurFond()),
		'"',
		' class="Texte11 Gras',
		lAvecSaisie ? " AvecMain" : "",
		'"',
		lAvecSaisie
			? ' ie-node="getNodeDemiPensionExclusion(' + aNumeroColonne + ')"'
			: "",
		">",
	);
	if (_colonneEstFeriee.call(this, aNumeroColonne)) {
		T.push(
			'<div style="line-height:',
			this._options.hauteurCellulePiedGrille_DP,
			"px;",
			GStyle.composeCouleurTexte(GCouleur.themeNeutre.moyen2),
			'">',
			GTraductions.getValeur("Ferie"),
			"</div>",
		);
	} else if (
		!aDemiPension.saisieExclusion &&
		this.estTrancheHoraireEnStage({ tranche: aNumeroColonne, horaire: 0 })
	) {
		T.push(
			'<div style="line-height:',
			this._options.hauteurCellulePiedGrille_DP,
			"px;",
			GStyle.composeCouleurTexte("white"),
			'">',
			GTraductions.getValeur("grilleAbsence.Stage"),
			"</div>",
		);
	} else {
		if (aDemiPension.exclusion) {
			T.push(
				'<div style="',
				GStyle.composeCouleurTexte(this._options.couleurLibelleExclu),
				"line-height:",
				this._options.hauteurCellulePiedGrille_DP,
				'px;">',
				GTraductions.getValeur("grilleAbsence.Exclu"),
				"</div>",
			);
		} else if (lAvecAbsence) {
			T.push(
				'<div style="line-height:',
				this._options.hauteurCellulePiedGrille_DP,
				'px;">',
				GTraductions.getValeur("grilleAbsence.AbsenceRepas"),
				"</div>",
			);
		}
	}
	T.push("</div>");
	return T.join("");
}
function _composeInternat(aParam) {
	const T = [];
	let lCouleur = this.getCouleurFond();
	let lAvecSaisie = false;
	let lHint = "";
	switch (this._options.choixAbsence) {
		case EGenreRessource.Absence:
			lAvecSaisie = aParam.internat.saisieAbsence;
			break;
		case EGenreRessource.Exclusion:
			lAvecSaisie = aParam.internat.saisieExclusion;
			break;
		default:
	}
	if (aParam.internat.absence && aParam.internat.absence && lAvecSaisie) {
		lCouleur = aParam.internat.absence;
	}
	if (aParam.internat.absence) {
		lHint = GTraductions.getValeur("grilleAbsence.hintInternat.absence");
	}
	if (aParam.internat.exclusion) {
		lHint +=
			(aParam.internat.absence ? " -- " : "") +
			GTraductions.getValeur("grilleAbsence.hintInternat.exclusion");
	}
	const lHauteur = this._options.hauteurCellulePiedGrille_Internat - 2;
	T.push(
		'<div style="',
		GStyle.composeCouleurBordure(
			this.getCouleurBordures(),
			1,
			EGenreBordure.gauche +
				EGenreBordure.haut +
				EGenreBordure.bas +
				(aParam.derniereColonne ? EGenreBordure.droite : 0),
		),
		GStyle.composeHeight(lHauteur),
		GStyle.composeCouleurFond(lCouleur),
		aParam.avecDP ? "margin-top:5px;" : "",
		'"',
		lHint ? ' title="' + GChaine.toTitle(lHint) + '"' : "",
		' class="Gras Texte11 ',
		lAvecSaisie ? "AvecMain" : "",
		'"',
		lAvecSaisie
			? ' ie-node="getNodeInternat(' + aParam.numeroColonne + ')"'
			: "",
		">",
	);
	if (!lAvecSaisie) {
		if (
			this.estTrancheHoraireEnStage({
				tranche: aParam.numeroColonne,
				horaire: 0,
			})
		) {
			T.push(
				'<div style="line-height:',
				lHauteur,
				"px;",
				GStyle.composeCouleurTexte("white"),
				'">',
				GTraductions.getValeur("grilleAbsence.Stage"),
				"</div>",
			);
		} else {
			const lElement =
				this.getDecorateurAbsences().getExclusionsEleveDeJourCycle(
					aParam.jourCycle,
				);
			if (lElement && lElement.exclusionsEtab) {
				T.push(
					'<div style="line-height:',
					lHauteur,
					"px;",
					GStyle.composeCouleurTexte(this._options.couleurLibelleExcluEtab),
					'">',
					GTraductions.getValeur("grilleAbsence.ExcluEtab"),
					"</div>",
				);
			} else if (!aParam.internat.saisieAbsence) {
				T.push(
					'<div style="line-height:',
					lHauteur,
					"px;",
					GStyle.composeCouleurFond(GCouleur.themeNeutre.moyen1),
					'">',
					GTraductions.getValeur("grilleAbsence.NonInscrit"),
					"</div>",
				);
			}
		}
	} else if (aParam.internat.exclusion) {
		T.push(
			'<div style="',
			GStyle.composeCouleurTexte(this._options.couleurLibelleExclu),
			"line-height:",
			lHauteur,
			'px;">',
			GTraductions.getValeur("grilleAbsence.Exclu"),
			"</div>",
		);
	}
	T.push("</div>");
	return T.join("");
}
module.exports = { ObjetAbsencesGrille };
