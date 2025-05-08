exports.ObjetCalendrier = void 0;
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_Saisie_1 = require("Enumere_Saisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeDomaine_1 = require("TypeDomaine");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const ToucheClavier_1 = require("ToucheClavier");
const jsx_1 = require("jsx");
const ObjetWAI_1 = require("ObjetWAI");
class ObjetCalendrier extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.Selection = new TypeDomaine_1.TypeDomaine();
		this.InteractionUtilisateur = false;
		if (this.avecEventResizeNavigateur()) {
			this.ajouterEvenementGlobal(
				Enumere_Event_1.EEvent.SurResize,
				this.surPostResize,
			);
			this.ajouterEvenementGlobal(
				Enumere_Event_1.EEvent.SurPostResize,
				this.surPostResize,
			);
		}
		this.ClassJour = "Texte8";
		this.idTable = this.Nom + "_table";
		this.avecDonnees = false;
		this.IdPremierElement = this.Nom + "_Div_Calendrier";
		this.options = {};
		this.setOptionsCalendrier({
			cycles: IE.Cycles,
			avecControlePeriodeConsultation: false,
			addClasseJour: null,
			avecComboPeriodes: false,
			avecPeriodeCours: false,
			avecDomaineCours: false,
			avecMultiSelection: false,
			avecMultiSemainesContinues: false,
			numeroPremiereSemaine: null,
			minWidth: 400,
		});
		this.tableauInformations = [];
		this.Position = -1;
		this.EnSelection = false;
		this._indicePeriodeCombo = -1;
	}
	setOptionsCalendrier(aOptions) {
		const lCycles = this.options.cycles;
		Object.assign(this.options, aOptions);
		if (!this.options.cycles) {
			this.options.cycles = lCycles || IE.Cycles;
		}
		if (aOptions) {
			if (aOptions.cycles) {
				this.NombreSemaines = this.options.cycles.nombreCyclesAnneeScolaire();
				this.PeriodeDeConsultation = new TypeDomaine_1.TypeDomaine(
					true,
					this.NombreSemaines,
				);
			}
			if (aOptions.avecMultiSemainesContinues) {
				this.options.avecMultiSelection = false;
			}
		}
		return this;
	}
	setListePeriodes(aListePeriodes, aPeriodeParDefaut) {
		if (this.options.avecComboPeriodes) {
			this.listePeriodes = this._getListePeriodes(aListePeriodes);
			if (aPeriodeParDefaut && this.listePeriodes) {
				const lIndicePeriode = this.listePeriodes.getIndiceParNumeroEtGenre(
					aPeriodeParDefaut.getNumero(),
					aPeriodeParDefaut.getGenre(),
				);
				if (lIndicePeriode >= 0) {
					this._indicePeriodeCombo = lIndicePeriode;
				}
			}
			this.$refreshSelf();
		}
	}
	getTableauInformations() {
		return this.tableauInformations;
	}
	getNombreSemaines() {
		return this.NombreSemaines;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			nodeSemaine(aNumeroSemaine) {
				$(this.node).on({
					pointerdown(aEvent) {
						const lEstTouch = aEvent.originalEvent
							? aEvent.originalEvent.pointerType === "touch"
							: false;
						aInstance.surSelection(aNumeroSemaine, true, lEstTouch);
					},
					pointerup() {
						aInstance.surDeselection();
					},
					keyup(aEvent) {
						aInstance._keyUpDomaine(aNumeroSemaine, aEvent);
					},
				});
			},
			dragSemaine() {
				return {
					drag(aParamsDrag) {
						if (aInstance.EnSelection) {
							for (let I = 1; I <= aInstance.NombreSemaines; I++) {
								const lElement = ObjetHtml_1.GHtml.getElement(
									aInstance.Nom + "_j_" + I,
								);
								if (
									ObjetPosition_1.GPosition.positionDansZone(
										aParamsDrag.pos,
										lElement,
									)
								) {
									aInstance.surSelection(I, false, aParamsDrag.touch);
									return;
								}
							}
						}
					},
					stop() {
						aInstance.surDeselection();
					},
				};
			},
			getNodeListBox() {
				$(this.node).on("keyup", (aEvent) => {});
			},
			getAttrListBox() {
				return {
					"aria-activedescendant": `${aInstance.Nom}_j_${aInstance.Param_Position || aInstance.Position || 1}`,
				};
			},
			getHtmlSemaine: function (aCycle) {
				let lVerrou = "";
				if (
					aInstance.tableauInformations[
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Cloturee
					] &&
					aInstance.tableauInformations[
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Cloturee
					].domaine.getValeur(aCycle)
				) {
					lVerrou = IE.jsx.str("div", {
						class: "Image_VerrouPeriodeActiveGris",
						style: "position:absolute; top:1px; left:1px;",
					});
				}
				if (
					aInstance.tableauInformations[
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
					] &&
					aInstance.tableauInformations[
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
					].domaine.getValeur(aCycle)
				) {
					return (
						ObjetTraduction_1.GTraductions.getValeur("calendrier.ferieAbr") +
						lVerrou
					);
				}
				const LNumeroSemaine = ObjetDate_1.GDate.semaineToCalendaire(
					aCycle,
					aInstance.options.numeroPremiereSemaine,
				);
				return LNumeroSemaine + lVerrou;
			},
			getClassSemaine: function (aCycle) {
				return aInstance._getClassDuJour(aCycle);
			},
			getAttrSemaine(aCycle) {
				const lResult = {};
				const lMultiSelec = aInstance.estMultiSelec();
				if (!aInstance.PeriodeDeConsultation.getValeur(aCycle)) {
					lResult["aria-disabled"] = "true";
				} else {
					const lChecked = aInstance.Selection.getValeur(aCycle);
					lResult[lMultiSelec ? "aria-selected" : "aria-checked"] = lChecked
						? "true"
						: "false";
					if (!lMultiSelec) {
						lResult["tabindex"] = lChecked ? "0" : "-1";
					}
				}
				return lResult;
			},
			getTitleSemaine: function (aCycle) {
				return aInstance._composeTitleSemaine(aCycle);
			},
			getClasseSemaineCours(aCycle) {
				if (
					aInstance._cycleDansDomaineDeGenre(
						aCycle,
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours,
					)
				) {
					if (
						aInstance.tableauInformations[
							Enumere_DomaineInformation_1.EGenreDomaineInformation
								.CoursPotentiel
						] &&
						aInstance.tableauInformations[
							Enumere_DomaineInformation_1.EGenreDomaineInformation
								.CoursPotentiel
						].afficher &&
						aInstance.tableauInformations[
							Enumere_DomaineInformation_1.EGenreDomaineInformation
								.CoursPotentiel
						].domaine
					) {
						return "cours-potentiel-possible";
					} else {
						return "cours";
					}
				} else if (
					aInstance._cycleDansDomaineDeGenre(
						aCycle,
						Enumere_DomaineInformation_1.EGenreDomaineInformation.CoursPere,
					)
				) {
					return "cours-pere";
				} else if (
					aInstance._cycleDansDomaineDeGenre(
						aCycle,
						Enumere_DomaineInformation_1.EGenreDomaineInformation
							.CoursPotentiel,
					)
				) {
					return "cours-potentiel";
				}
				return "";
			},
			getLibelleSemaineCours: function (aCycle) {
				if (
					aInstance._cycleDansDomaineDeGenre(
						aCycle,
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours,
					)
				) {
					if (
						aInstance.tableauInformations[
							Enumere_DomaineInformation_1.EGenreDomaineInformation
								.CoursPotentiel
						] &&
						aInstance.tableauInformations[
							Enumere_DomaineInformation_1.EGenreDomaineInformation
								.CoursPotentiel
						].afficher &&
						aInstance.tableauInformations[
							Enumere_DomaineInformation_1.EGenreDomaineInformation
								.CoursPotentiel
						].domaine
					) {
						const lItems =
							aInstance.tableauInformations[
								Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours
							].domaine.getSemaines();
						return lItems.indexOf(aCycle) + 1;
					}
				}
				return "";
			},
			getTitleSemaineCours: function (aCycle) {
				if (
					aInstance._cycleDansDomaineDeGenre(
						aCycle,
						Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours,
					)
				) {
					return ObjetTraduction_1.GTraductions.getValeur("DomaineCours");
				} else if (
					aInstance._cycleDansDomaineDeGenre(
						aCycle,
						Enumere_DomaineInformation_1.EGenreDomaineInformation.CoursPere,
					)
				) {
					return ObjetTraduction_1.GTraductions.getValeur("DomainePere");
				}
				return "";
			},
			comboPeriode: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						mode: Enumere_Saisie_1.EGenreSaisie.Combo,
						longueur: 120,
						deroulerListeSeulementSiPlusieursElements: false,
						initAutoSelectionAvecUnElement: false,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"calendrier.WAI.SelecPeriode",
						),
					});
					aInstance.comboP = aCombo;
				},
				getDonnees: function () {
					return aInstance.listePeriodes;
				},
				getIndiceSelection: function () {
					return aInstance._indicePeriodeCombo;
				},
				getLibelle: function () {
					return aInstance._indicePeriodeCombo < 0
						? ObjetTraduction_1.GTraductions.getValeur("Personnalisee")
						: null;
				},
				event: function (aParametresCombo) {
					aInstance._evenementSurComboPeriode(aParametresCombo);
				},
				display: function () {
					return (
						!!aInstance.listePeriodes && aInstance.listePeriodes.count() > 1
					);
				},
			},
		});
	}
	initialiser() {
		this.construireAffichage();
	}
	setSelection(ASelection) {
		this.InteractionUtilisateur = false;
		ASelection =
			ASelection >= 1
				? ASelection <= this.NombreSemaines
					? ASelection
					: this.NombreSemaines
				: 1;
		if (
			this.options.avecControlePeriodeConsultation &&
			this.PeriodeDeConsultation &&
			!this.PeriodeDeConsultation.getValeur(ASelection)
		) {
			ASelection = this.PeriodeDeConsultation.getPremierePosition();
		}
		this.setDomaine(new TypeDomaine_1.TypeDomaine(ASelection));
	}
	setDomaine(ADomaine, aSansEvenement) {
		this.InteractionUtilisateur = false;
		this.avecDonnees = true;
		this.Selection = ADomaine.getIntersection(this.PeriodeDeConsultation);
		if (
			this.options.avecControlePeriodeConsultation &&
			this.PeriodeDeConsultation &&
			this.Selection.getNbrValeurs() === 0 &&
			this.PeriodeDeConsultation.getNbrValeurs() > 0
		) {
			this.Selection = new TypeDomaine_1.TypeDomaine(
				this.PeriodeDeConsultation.getPremierePosition(),
			);
		}
		delete this._donneesActualisation;
		this.Position = this.Selection.getPremierePosition();
		this._actualiserTabIndexDePosition(this.Position);
		this._actualiser();
		if (!aSansEvenement) {
			this.declencherEvenement();
		}
	}
	setDomaineInformation(aDomaine, aGenre, aAfficher, aActualiser) {
		this.tableauInformations[aGenre] = {};
		this.tableauInformations[aGenre].domaine =
			MethodesObjet_1.MethodesObjet.dupliquer(aDomaine);
		this.tableauInformations[aGenre].afficher =
			aAfficher === null || aAfficher === undefined ? true : aAfficher;
		if (
			this.options.avecPeriodeCours &&
			this.afficherPeriodeCours &&
			this.options.avecComboPeriodes &&
			this.listePeriodes &&
			aGenre === Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours
		) {
			this._actualiserElementPeriodeCoursDuCombo(
				!this.tableauInformations[aGenre].afficher ||
					!aDomaine ||
					aDomaine.estVide(),
			);
			this.comboP.setDonnees(this.listePeriodes);
		}
		if (aActualiser !== false) {
			this._actualiser();
		}
	}
	setDates(aDateDeb, aDateFin, aSansEvenement) {
		const lSemaineDeb = this.options.cycles.cycleDeLaDate(aDateDeb);
		const lSemaineFin = this.options.cycles.cycleDeLaDate(aDateFin);
		const lDomaine = new TypeDomaine_1.TypeDomaine();
		lDomaine.setValeur(true, lSemaineDeb, lSemaineFin);
		this.setDomaine(lDomaine, aSansEvenement);
	}
	getDates() {
		const lDates = {};
		lDates.dateDebut = this.options.cycles.dateDebutCycle(
			this.Selection.getPremierePosition(),
		);
		lDates.dateFin = this.options.cycles.dateDernierJourOuvreCycle(
			this.Selection.getDernierePosition(),
		);
		return lDates;
	}
	setFrequences(aFrequences, aFeries) {
		this.frequences = aFrequences;
		if (aFeries) {
			this.setDomaineInformation(
				this.options.cycles.getDomaineFerie(),
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee,
			);
		}
	}
	setDomaineCours(
		aDomaineCours,
		aDomaineCoursPere,
		aAfficherPeriodeCours,
		aDomaineCoursPotentiel,
	) {
		this.afficherPeriodeCours =
			aAfficherPeriodeCours === null || aAfficherPeriodeCours === undefined
				? true
				: aAfficherPeriodeCours;
		this.setDomaineInformation(
			aDomaineCours,
			Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours,
			null,
			false,
		);
		this.setDomaineInformation(
			aDomaineCoursPere,
			Enumere_DomaineInformation_1.EGenreDomaineInformation.CoursPere,
			null,
			false,
		);
		this.setDomaineInformation(
			aDomaineCoursPotentiel,
			Enumere_DomaineInformation_1.EGenreDomaineInformation.CoursPotentiel,
			null,
			false,
		);
		this._actualiser();
	}
	resetDomaineCours() {
		this.InteractionUtilisateur = false;
		this.setDomaineCours();
	}
	setPeriodeDeConsultation(APeriodeDeConsultation) {
		this.PeriodeDeConsultation = APeriodeDeConsultation;
		this._actualiser();
	}
	construireAffichage() {
		let H = IE.jsx.str(
			"div",
			{ class: "ObjetCalendrier" },
			IE.jsx.str(
				"div",
				{ id: this.Nom + "_Boutons", class: "Calendrier_Boutons" },
				IE.jsx.str(
					"table",
					{ id: this.idTable, class: "full-width", role: "presentation" },
					IE.jsx.str(
						"tr",
						null,
						this.options.avecComboPeriodes
							? IE.jsx.str(
									"td",
									{ style: "width:auto;", class: "EspaceDroit AlignementHaut" },
									IE.jsx.str("ie-combo", {
										"ie-model": "comboPeriode",
										"ie-display": "comboPeriode.display",
									}),
								)
							: "",
						IE.jsx.str(
							"td",
							{ id: this.Nom + "_Calendrier", style: "width:100%;" },
							"\u00A0",
						),
					),
				),
			),
			IE.jsx.str("div", {
				class: "hide",
				style: "width:" + this.options.minWidth + "px;font-size:0px;",
			}),
		);
		ObjetHtml_1.GHtml.setHtml(this.Nom, H, { controleur: this.controleur });
		const lLargeurCalendrier = ObjetPosition_1.GPosition.getWidth(
			this.Nom + "_Calendrier",
		);
		this.Zoom = Math.max(
			8,
			Math.floor(lLargeurCalendrier / this.NombreSemaines),
		);
		this.ClassJour =
			this.Zoom > 17 ? "Texte10" : this.Zoom > 15 ? "Texte9" : "Texte8";
		ObjetHtml_1.GHtml.setHtml(
			this.Nom + "_Calendrier",
			this._composeJours() + this._composeMois(this.Zoom * this.NombreSemaines),
			{ controleur: this.controleur },
		);
		return "";
	}
	declencherEvenement(ASurClavier) {
		this._surClavier = ASurClavier;
		if (
			this.ControleNavigation &&
			ControleSaisieEvenement_1.ControleSaisieEvenement
		) {
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
				this._retourSurNavigation.bind(this),
			);
		} else {
			this._retourSurNavigation();
		}
	}
	surSelection(APosition, aInitialisationDeplacement, aSurTouch) {
		if (
			this.Actif &&
			this.PeriodeDeConsultation.getValeur(APosition) &&
			!ControleSaisieEvenement_1.ControleSaisieEvenement.saisieEnCours()
		) {
			this.InteractionUtilisateur = true;
			this.Param_Position = APosition;
			this._actualiserCalendrierSurPosition(
				true,
				aInitialisationDeplacement,
				aSurTouch,
			);
		}
	}
	surDeselection() {
		if (
			this.EnSelection &&
			!ControleSaisieEvenement_1.ControleSaisieEvenement.saisieEnCours()
		) {
			this.declencherEvenement();
			this.EnSelection = false;
		}
	}
	surPostResize() {
		let lIdFocus = "";
		if (ObjetHtml_1.GHtml.focusEstDansElement(this.Nom)) {
			const lNode = ObjetHtml_1.GHtml.getElementEnFocus();
			lIdFocus = lNode ? lNode.id : "";
		}
		ObjetHtml_1.GHtml.setHtml(this.Nom, "&nbsp;");
		this.construireAffichage();
		if (lIdFocus) {
			ObjetHtml_1.GHtml.setFocus(lIdFocus);
		}
	}
	_keyUpDomaine(aNumeroSemaine, aEvent) {
		var _a, _b, _c, _d, _e, _f;
		const lEstMultiSelec = this.estMultiSelec();
		if (
			aEvent.which === ToucheClavier_1.ToucheClavier.FlecheGauche ||
			(!lEstMultiSelec &&
				aEvent.which === ToucheClavier_1.ToucheClavier.FlecheHaut)
		) {
			this.Param_Position = aNumeroSemaine;
			this._surClavier = true;
			let LPosition = this.Param_Position;
			if (
				!lEstMultiSelec &&
				LPosition ===
					((_a = this.PeriodeDeConsultation) === null || _a === void 0
						? void 0
						: _a.getPremierePosition())
			) {
				LPosition =
					(_b = this.PeriodeDeConsultation) === null || _b === void 0
						? void 0
						: _b.getDernierePosition();
			} else {
				do {
					LPosition--;
				} while (
					LPosition >= 1 &&
					!this.PeriodeDeConsultation.getValeur(LPosition)
				);
			}
			if (lEstMultiSelec) {
				this._navigation(LPosition);
				return;
			}
			this.surSelection(LPosition, true);
			this.surDeselection();
		} else if (
			aEvent.which === ToucheClavier_1.ToucheClavier.FlecheDroite ||
			(!lEstMultiSelec &&
				aEvent.which === ToucheClavier_1.ToucheClavier.FlecheBas)
		) {
			this.Param_Position = aNumeroSemaine;
			this._surClavier = true;
			let LPosition = this.Param_Position;
			if (
				!lEstMultiSelec &&
				LPosition ===
					((_c = this.PeriodeDeConsultation) === null || _c === void 0
						? void 0
						: _c.getDernierePosition())
			) {
				LPosition =
					(_d = this.PeriodeDeConsultation) === null || _d === void 0
						? void 0
						: _d.getPremierePosition();
			} else {
				do {
					LPosition++;
				} while (
					LPosition <= this.NombreSemaines &&
					!this.PeriodeDeConsultation.getValeur(LPosition)
				);
			}
			if (this.estMultiSelec()) {
				this._navigation(LPosition);
				return;
			}
			this.surSelection(LPosition, true);
			this.surDeselection();
		} else if (aEvent.which === ToucheClavier_1.ToucheClavier.Debut) {
			if (lEstMultiSelec) {
				this._navigation(
					((_e = this.PeriodeDeConsultation) === null || _e === void 0
						? void 0
						: _e.getPremierePosition()) || 1,
				);
			}
		} else if (aEvent.which === ToucheClavier_1.ToucheClavier.Fin) {
			if (lEstMultiSelec) {
				this._navigation(
					((_f = this.PeriodeDeConsultation) === null || _f === void 0
						? void 0
						: _f.getDernierePosition()) || 1,
				);
			}
		} else if (ToucheClavier_1.ToucheClavierUtil.estEventSelection(aEvent)) {
			this._surClavier = true;
			this.Param_Position = aNumeroSemaine;
			this.surSelection(aNumeroSemaine, true);
			this.surDeselection();
		}
	}
	_getListePeriodes(aListePeriodes) {
		const lLlistePeriodes = aListePeriodes
			? MethodesObjet_1.MethodesObjet.dupliquer(aListePeriodes)
			: new ObjetListeElements_1.ObjetListeElements();
		if (this.options.avecPeriodeCours) {
			const lPeriode = new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("AjusterCours"),
				-1,
				-1,
			);
			lPeriode.ClassAffichage = "Gras";
			lPeriode.periodeCours = true;
			lLlistePeriodes.insererElement(lPeriode, 0);
		}
		return lLlistePeriodes;
	}
	_cycleDansDomaineDeGenre(aNumeroCycle, aGenreDomaine) {
		return (
			this.tableauInformations[aGenreDomaine] &&
			this.tableauInformations[aGenreDomaine].afficher &&
			this.tableauInformations[aGenreDomaine].domaine &&
			this.tableauInformations[aGenreDomaine].domaine.getValeur(aNumeroCycle)
		);
	}
	_getClassDuJour(I) {
		const lClasses = [this.ClassJour];
		if (
			this.tableauInformations[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			] &&
			this.tableauInformations[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			].domaine.getValeur(I)
		) {
			lClasses.push("ferie");
		}
		if (this.frequences && this.options.addClasseJour) {
			const lClasse = this.options.addClasseJour(this, I);
			if (lClasse) {
				lClasses.push(lClasse);
			}
		}
		if (!this.PeriodeDeConsultation.getValeur(I)) {
			lClasses.push("disabled");
		} else {
			if (this.Selection.getValeur(I)) {
				lClasses.push("selected");
			}
			if (
				this._cycleDansDomaineDeGenre(
					I,
					Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu,
				)
			) {
				lClasses.push("avecContenu");
			}
		}
		return lClasses.join(" ");
	}
	_getGenreDomaine(aDomaine) {
		const lAvecContenu =
			this.tableauInformations[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu
			] &&
			this.tableauInformations[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu
			].domaine &&
			!aDomaine
				.getIntersection(
					this.tableauInformations[
						Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu
					].domaine,
				)
				.estVide();
		return lAvecContenu
			? Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu
			: Enumere_DomaineInformation_1.EGenreDomaineInformation.Aucun;
	}
	_estSemaineFeriee(aPosition) {
		return (
			this.tableauInformations[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			] &&
			this.tableauInformations[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			].domaine.getValeur(aPosition)
		);
	}
	_actualiser() {
		if (this.$refreshSelf) {
			this.$refreshSelf();
		}
	}
	_actualiserElementPeriodeCoursDuCombo(aSansDomaineCours) {
		let lPeriode = null;
		for (let i = 0, lNb = this.listePeriodes.count(); i < lNb; i++) {
			if (this.listePeriodes.get(i).periodeCours) {
				lPeriode = this.listePeriodes.get(i);
				break;
			}
		}
		if (lPeriode) {
			lPeriode.Visible = !aSansDomaineCours;
		}
		return lPeriode;
	}
	_composeJours() {
		const lEstMultiSelec = this.estMultiSelec();
		return IE.jsx.str(
			"table",
			{
				id: this.IdPremierElement,
				class: "ie-draggable-handle tableJours",
				role: lEstMultiSelec ? "listbox" : "radiogroup",
				"ie-attr": "getAttrListBox",
				"aria-orientation": lEstMultiSelec ? "horizontal" : false,
				"aria-multiselectable": lEstMultiSelec ? "true" : false,
				"aria-label": lEstMultiSelec
					? ObjetTraduction_1.GTraductions.getValeur(
							"calendrier.WAI.MultiSelec",
						)
					: ObjetWAI_1.GObjetWAI.getInfo(
							ObjetWAI_1.EGenreObjet.CalendrierNavigation,
						) +
						ObjetWAI_1.GObjetWAI.getInfo(
							ObjetWAI_1.EGenreObjet.NavigationHorizontal,
						),
			},
			IE.jsx.str(
				"tbody",
				{ role: "presentation" },
				IE.jsx.str(
					"tr",
					{ style: "height:20px", role: "presentation" },
					(H) => {
						for (let I = 1; I <= this.NombreSemaines; I++) {
							H.push(this._composeUnJour(I, this.Zoom));
						}
					},
				),
			),
		);
	}
	_composeUnJour(I, aLargeur) {
		return IE.jsx.str(
			"td",
			{
				class: "Calendrier_Jour_td",
				style: ObjetStyle_1.GStyle.composeWidth(aLargeur - 1),
				role: "presentation",
			},
			IE.jsx.str("div", {
				id: this.Nom + "_j_" + I,
				class: "calendrier-jour",
				"ie-node": (0, jsx_1.jsxFuncAttr)("nodeSemaine", I),
				"ie-draggable": (0, jsx_1.jsxFuncAttr)("dragSemaine", I),
				role: this.estMultiSelec() ? "option" : "radio",
				tabindex: I === 1 ? "0" : "-1",
				"aria-checked": this.estMultiSelec() ? false : "false",
				"aria-label": this._composeTitleSemaine(I, true),
				style: `max-width:${aLargeur - 2 - 1}px;`,
				"ie-class": (0, jsx_1.jsxFuncAttr)("getClassSemaine", I),
				"ie-attr": (0, jsx_1.jsxFuncAttr)("getAttrSemaine", I),
				"ie-hint": (0, jsx_1.jsxFuncAttr)("getTitleSemaine", I),
				"ie-html": (0, jsx_1.jsxFuncAttr)("getHtmlSemaine", I),
			}),
			this.options.avecDomaineCours
				? IE.jsx.str("div", {
						class: "calendrier-jour-domaine Texte8",
						"ie-hint": (0, jsx_1.jsxFuncAttr)("getTitleSemaineCours", I),
						"ie-class": (0, jsx_1.jsxFuncAttr)("getClasseSemaineCours", I),
						"ie-html": (0, jsx_1.jsxFuncAttr)("getLibelleSemaineCours", I),
					})
				: "",
		);
	}
	_composeTitleSemaine(APosition, AWai) {
		const LNumeroSemaine = ObjetDate_1.GDate.semaineToCalendaire(
			APosition,
			this.options.numeroPremiereSemaine,
		);
		const LDateDeb = AWai
			? ObjetDate_1.GDate.formatDate(
					this.options.cycles.datePremierJourOuvreCycle(APosition),
					"%J %MMMM %AAAA",
				)
			: ObjetDate_1.GDate.formatDate(
					this.options.cycles.datePremierJourOuvreCycle(APosition),
					"%JJ/%MM/%AAAA",
				);
		const LDateFin = AWai
			? ObjetDate_1.GDate.formatDate(
					this.options.cycles.dateDernierJourOuvreCycle(APosition),
					"%J %MMMM %AAAA",
				)
			: ObjetDate_1.GDate.formatDate(
					this.options.cycles.dateDernierJourOuvreCycle(APosition),
					"%JJ/%MM/%AAAA",
				);
		const lFrequence = this._estSemaineFeriee(APosition)
			? ObjetTraduction_1.GTraductions.getValeur("Feriee").toLowerCase()
			: this.frequences && this.frequences[APosition]
				? this.frequences[APosition].libelle
				: "";
		return (
			ObjetTraduction_1.GTraductions.getValeur("Semaine") +
			" " +
			(AWai
				? LNumeroSemaine + (lFrequence ? ` - ${lFrequence}` : "")
				: lFrequence || LNumeroSemaine) +
			", " +
			ObjetTraduction_1.GTraductions.getValeur("Du") +
			" " +
			LDateDeb +
			" " +
			ObjetTraduction_1.GTraductions.getValeur("Au") +
			" " +
			LDateFin
		);
	}
	_getTraductionsMois(aIndice) {
		const lTraductions = ObjetTraduction_1.GTraductions.hasTabValeurs(
			"ListeMoisCourt",
		)
			? ObjetTraduction_1.GTraductions.getTabValeurs("ListeMoisCourt")
			: ObjetTraduction_1.GTraductions.getTabValeurs("MoisCourt");
		return lTraductions ? lTraductions[aIndice].toLowerCase() : "";
	}
	_composeMois(aLargeurMax) {
		let H = "";
		H += '<table class="tableMois" aria-hidden="true">';
		H += '<tr class="text-center">';
		const LRapport =
			this.Zoom / this.options.cycles.nombreJoursOuvresParCycle();
		let LTaille;
		let LChaine;
		let LResidu = 0;
		let lLargeurTotal = 0;
		const lMarges = 2;
		let LMois;
		let lCycle = 1;
		let lJourCycle = 0;
		const lNombreCycles = this.options.cycles.nombreCyclesAnneeScolaire();
		const lNombreJoursCycle = this.options.cycles.nombreJoursOuvresParCycle();
		let lDate;
		let lMoisPrecedent = null;
		let lEstDernierJour = false;
		let lNbJoursCycleCourant = 0;
		while (lCycle <= lNombreCycles) {
			while (lJourCycle < lNombreJoursCycle) {
				lDate = this.options.cycles.jourCycleEnDate(lJourCycle, lCycle);
				LMois = lDate.getMonth();
				if (lMoisPrecedent === null || lMoisPrecedent === undefined) {
					lMoisPrecedent = LMois;
				}
				lEstDernierJour =
					lJourCycle === lNombreJoursCycle - 1 && lCycle === lNombreCycles;
				if (LMois !== lMoisPrecedent || lEstDernierJour) {
					if (lEstDernierJour) {
						lNbJoursCycleCourant += 1;
					}
					LTaille = lNbJoursCycleCourant * LRapport - 2 + LResidu;
					LTaille = Math.min(LTaille, aLargeurMax - lLargeurTotal - lMarges);
					LResidu = LTaille - Math.round(LTaille);
					lLargeurTotal += Math.round(LTaille) + lMarges;
					if (
						ObjetChaine_1.GChaine.getLongueurChaine(
							this._getTraductionsMois(lMoisPrecedent % 12),
							10,
							true,
						) > LTaille
					) {
						LChaine = "";
					} else {
						LChaine = ObjetChaine_1.GChaine.avecEspaceSiVide(
							this._getTraductionsMois(lMoisPrecedent % 12),
						);
					}
					if (LTaille > 0) {
						H +=
							'<td style="width:' +
							Math.round(LTaille + 1) +
							'px;" class="Texte10 Gras FondBlanc Calendrier_Mois">' +
							LChaine +
							"</td>";
					}
					lMoisPrecedent = LMois;
					lNbJoursCycleCourant = 0;
				}
				lJourCycle += 1;
				lNbJoursCycleCourant += 1;
			}
			lCycle += 1;
			lJourCycle = 0;
		}
		H += "</tr>";
		H += "</table>";
		return H;
	}
	_retourSurNavigation() {
		const LPosition = this.Selection.getPremierePosition();
		Invocateur_1.Invocateur.evenement("modificationDomaineCalendrier", {
			domaine: this.Selection,
			interactionUtilisateur: this.estUneInteractionUtilisateur(),
		});
		this.callback.appel(
			LPosition,
			this.Selection,
			this._getGenreDomaine(this.Selection),
			!this.Selection.getIntersection(this.PeriodeDeConsultation).estVide(),
			this._surClavier,
			this.options.avecComboPeriodes && this._indicePeriodeCombo >= 0
				? this.listePeriodes.get(this._indicePeriodeCombo)
				: null,
		);
		this.$refresh();
		delete this._surClavier;
	}
	_evenementSurComboPeriode(aParams) {
		if (!aParams.element) {
			return;
		}
		const lPeriode = aParams.element;
		if (lPeriode && lPeriode.periodeCours) {
			const lTabInfosCours =
				this.tableauInformations[
					Enumere_DomaineInformation_1.EGenreDomaineInformation.Cours
				];
			if (
				lTabInfosCours &&
				lTabInfosCours.afficher &&
				lTabInfosCours.domaine &&
				!lTabInfosCours.domaine.estVide()
			) {
				this.setDomaine(
					new TypeDomaine_1.TypeDomaine(lTabInfosCours.domaine.toString()),
				);
			} else {
			}
			this._indicePeriodeCombo = -1;
		} else {
			this._indicePeriodeCombo = aParams.indice;
			if (aParams.indice > 0 && lPeriode.domaine) {
				this.setDomaine(
					MethodesObjet_1.MethodesObjet.dupliquer(lPeriode.domaine),
				);
			}
		}
	}
	_initDonneesActualisation() {
		this._donneesActualisation = {
			valeur: this.Selection.getValeur(this.Position),
			domaine: MethodesObjet_1.MethodesObjet.dupliquer(this.Selection),
			debut: this.Param_Position,
			fin: this.Param_Position,
		};
	}
	_actualiserCalendrierSurPosition(
		ASansDeselection,
		aInitialisationDeplacement,
		aSurTouch,
	) {
		var _a;
		this.EnSelection = true;
		let lAvecRefresh = false;
		let lDeb, lFin, I, lAncienneValeur, lNouvelleValeur;
		const lSurAjoutMultiSelection =
			this.options.avecMultiSelection &&
			!this.options.avecMultiSemainesContinues &&
			(this._surClavier || GNavigateur.CtrlTouche || aSurTouch);
		if (
			this.Param_Position >= 1 &&
			this.Param_Position <= this.NombreSemaines &&
			this.PeriodeDeConsultation.getValeur(this.Param_Position)
		) {
			if (
				!this.estMultiSelec() ||
				(aInitialisationDeplacement &&
					(aSurTouch ||
						this._surClavier ||
						(!this.options.avecMultiSemainesContinues &&
							!GNavigateur.ShiftTouche) ||
						(this.options.avecMultiSemainesContinues &&
							!GNavigateur.CtrlTouche &&
							!GNavigateur.ShiftTouche)))
			) {
				this.Position = this.Param_Position;
				(_a = ObjetHtml_1.GHtml.getElement(
					this.Nom + "_j_" + this.Position,
				)) === null || _a === void 0
					? void 0
					: _a.focus();
				this._initDonneesActualisation();
			} else {
				if (!this._donneesActualisation) {
					if (this.Param_Position < this.Selection.getPremierePosition()) {
						this.Position = this.Selection.getDernierePosition();
					}
					this._initDonneesActualisation();
				}
				this._donneesActualisation.debut = Math.min(
					this.Param_Position,
					this._donneesActualisation.debut,
				);
				this._donneesActualisation.fin = Math.max(
					this.Param_Position,
					this._donneesActualisation.fin,
				);
			}
			const LPositionDeb = Math.min(this.Position, this.Param_Position);
			const LPositionFin = Math.max(this.Position, this.Param_Position);
			if (this.options.avecMultiSemainesContinues) {
				lDeb = Math.min(
					this.Selection.getPremierePosition(),
					this._donneesActualisation.debut,
				);
				lFin = Math.max(
					this.Selection.getDernierePosition(),
					this._donneesActualisation.fin,
				);
			} else if (lSurAjoutMultiSelection) {
				lDeb = this._donneesActualisation.debut;
				lFin = this._donneesActualisation.fin;
			} else {
				lDeb = 1;
				lFin = this.NombreSemaines;
			}
			for (I = lDeb; I <= lFin; I++) {
				lAncienneValeur = this.Selection.getValeur(I);
				if (lSurAjoutMultiSelection) {
					if (I >= LPositionDeb && I <= LPositionFin) {
						lNouvelleValeur =
							!this._donneesActualisation.valeur &&
							this.PeriodeDeConsultation.getValeur(I);
					} else {
						lNouvelleValeur = this._donneesActualisation.domaine.getValeur(I);
					}
				} else {
					lNouvelleValeur =
						I >= LPositionDeb &&
						I <= LPositionFin &&
						this.PeriodeDeConsultation.getValeur(I);
				}
				this.Selection.setValeur(lNouvelleValeur, I);
				lAvecRefresh = lAvecRefresh || lAncienneValeur !== lNouvelleValeur;
			}
			if (this.options.avecComboPeriodes) {
				if (this._indicePeriodeCombo !== -1 || this.options.avecPeriodeCours) {
					if (this._indicePeriodeCombo !== -1) {
						lAvecRefresh = true;
					}
					this._indicePeriodeCombo = -1;
				}
			}
			if (lAvecRefresh) {
				this._actualiser();
			}
			if (!ASansDeselection) {
				this.surDeselection();
			}
		}
	}
	estMultiSelec() {
		return (
			this.options.avecMultiSelection || this.options.avecMultiSemainesContinues
		);
	}
	_navigation(aPosition) {
		if (this.Actif && this.PeriodeDeConsultation.getValeur(aPosition)) {
			this.InteractionUtilisateur = true;
			this.Param_Position = aPosition;
			const lElement = ObjetHtml_1.GHtml.getElement(
				this.Nom + "_j_" + this.Param_Position,
			);
			if (lElement) {
				lElement.focus();
				this._actualiserTabIndexDePosition(this.Param_Position);
			}
		}
	}
	_actualiserTabIndexDePosition(aPosition) {
		const lElement = ObjetHtml_1.GHtml.getElement(this.Nom + "_j_" + aPosition);
		if (lElement) {
			$(`#${this.Nom.escapeJQ()} .calendrier-jour[tabindex="0"]`).attr(
				"tabindex",
				"-1",
			);
			lElement.setAttribute("tabindex", "0");
		}
	}
}
exports.ObjetCalendrier = ObjetCalendrier;
