exports.WidgetCDC = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const UtilitaireWidget_1 = require("UtilitaireWidget");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const ObjetWidget_1 = require("ObjetWidget");
var TypeElementWidgetCDC;
(function (TypeElementWidgetCDC) {
	TypeElementWidgetCDC[(TypeElementWidgetCDC["DateConseil"] = 0)] =
		"DateConseil";
	TypeElementWidgetCDC[(TypeElementWidgetCDC["Appreciations"] = 1)] =
		"Appreciations";
	TypeElementWidgetCDC[(TypeElementWidgetCDC["Devoirs"] = 2)] = "Devoirs";
	TypeElementWidgetCDC[(TypeElementWidgetCDC["Evaluations"] = 3)] =
		"Evaluations";
})(TypeElementWidgetCDC || (TypeElementWidgetCDC = {}));
class WidgetCDC extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		this.nbColonneMax =
			GNavigateur.ecranL < 1250 && GNavigateur.ecranL >= 1199 ? 3 : 4;
		this.etatUtilisateurPN = GEtatUtilisateur;
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		if (this.donnees.listeClasses) {
			this.donnees.listeClasses.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
			this.donnees.listeClasses.trier();
		}
		this.donnees.navigations = {};
		this.donnees.navigations[TypeElementWidgetCDC.Appreciations] = {
			ongletNavigation: GApplication.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
			)
				? Enumere_Onglet_1.EGenreOnglet.SaisieAppreciationsBulletin
				: Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService,
			nomProprieteServiceSuggere: "serviceSuggereApp",
		};
		this.donnees.navigations[TypeElementWidgetCDC.Devoirs] = {
			ongletNavigation: Enumere_Onglet_1.EGenreOnglet.SaisieNotes,
			nomProprieteServiceSuggere: "serviceSuggereNote",
		};
		this.donnees.navigations[TypeElementWidgetCDC.Evaluations] = {
			ongletNavigation: Enumere_Onglet_1.EGenreOnglet.Evaluation,
			nomProprieteServiceSuggere: "serviceSuggereEval",
		};
		this.creerObjetsCDC();
		const lWidget = {
			listeElementsGraphiques: [{ id: this.comboCDC.getNom() }],
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
		this.initialiserObjetsCDC();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			nodeCelluleAppreciations: function (aNumeroClasse, aNumeroPeriode) {
				$(this.node).eventValidation(() => {
					aInstance._surClicItemCDC(
						aNumeroClasse,
						aNumeroPeriode,
						TypeElementWidgetCDC.Appreciations,
					);
				});
			},
			nodeCelluleDevoirs: function (aNumeroClasse, aNumeroPeriode) {
				$(this.node).eventValidation(() => {
					aInstance._surClicItemCDC(
						aNumeroClasse,
						aNumeroPeriode,
						TypeElementWidgetCDC.Devoirs,
					);
				});
			},
			nodeCelluleEvaluations: function (aNumeroClasse, aNumeroPeriode) {
				$(this.node).eventValidation(() => {
					aInstance._surClicItemCDC(
						aNumeroClasse,
						aNumeroPeriode,
						TypeElementWidgetCDC.Evaluations,
					);
				});
			},
		});
	}
	creerObjetsCDC() {
		this.comboCDC = ObjetIdentite_1.Identite.creerInstance(
			ObjetSaisie_1.ObjetSaisie,
			{ pere: this, evenement: this._evenementComboCDC },
		);
		this._initialiserComboCDC(this.comboCDC);
	}
	initialiserObjetsCDC() {
		this.comboCDC.initialiser();
		const lListePeriodes = new ObjetListeElements_1.ObjetListeElements();
		if (this.donnees.listeClasses) {
			for (let i = 0; i < this.donnees.listeClasses.count(); i++) {
				const lClasse = this.donnees.listeClasses.get(i);
				if (!lListePeriodes.getElementParElement(lClasse.periode)) {
					lListePeriodes.addElement(lClasse.periode);
				}
			}
		}
		this.comboCDC.setDonnees(
			lListePeriodes,
			lListePeriodes.getIndiceParElement(this.donnees.periodeParDefaut),
		);
	}
	actualiserWidgetCDC(aPeriode) {
		const lWidget = { html: this.composeWidgetCDC(aPeriode) };
		$.extend(true, this.donnees, lWidget);
		UtilitaireWidget_1.UtilitaireWidget.actualiserWidget(this);
	}
	getArrayListeTypesElement() {
		return [
			TypeElementWidgetCDC.DateConseil,
			TypeElementWidgetCDC.Appreciations,
			TypeElementWidgetCDC.Devoirs,
			TypeElementWidgetCDC.Evaluations,
		];
	}
	getClasseIconeTypeElement(aTypeElement) {
		switch (aTypeElement) {
			case TypeElementWidgetCDC.DateConseil:
				return "icon_mode_conseil_classe";
			case TypeElementWidgetCDC.Appreciations:
				return "icon_saisie_appreciation";
			case TypeElementWidgetCDC.Devoirs:
				return "icon_saisie_note";
			case TypeElementWidgetCDC.Evaluations:
				return "icon_saisie_evaluation";
		}
		return "";
	}
	estAvecTypeElement(aTypeElement) {
		switch (aTypeElement) {
			case TypeElementWidgetCDC.DateConseil:
				return true;
			case TypeElementWidgetCDC.Appreciations:
				return (
					this.donnees.avecAppr &&
					this.etatUtilisateurPN.estOngletActif(
						this.donnees.navigations[aTypeElement].ongletNavigation,
					)
				);
			case TypeElementWidgetCDC.Devoirs:
				return (
					this.donnees.avecNotes &&
					this.etatUtilisateurPN.estOngletActif(
						this.donnees.navigations[aTypeElement].ongletNavigation,
					)
				);
			case TypeElementWidgetCDC.Evaluations:
				return (
					this.donnees.avecCompetences &&
					this.etatUtilisateurPN.estOngletActif(
						this.donnees.navigations[aTypeElement].ongletNavigation,
					)
				);
		}
		return false;
	}
	getHintInfoTypeElement(aTypeElement) {
		switch (aTypeElement) {
			case TypeElementWidgetCDC.DateConseil:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.hint.dateConseilDeClasse",
				);
			case TypeElementWidgetCDC.Appreciations:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.hint.apprSaisies",
				);
			case TypeElementWidgetCDC.Devoirs:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.hint.devoirs",
				);
			case TypeElementWidgetCDC.Evaluations:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.hint.evaluations",
				);
		}
		return "";
	}
	getLibelleLegende(aTypeElement) {
		switch (aTypeElement) {
			case TypeElementWidgetCDC.DateConseil:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.dateConseilDeClasse",
				);
			case TypeElementWidgetCDC.Appreciations:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.apprSaisies",
				);
			case TypeElementWidgetCDC.Devoirs:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.devoirs",
				);
			case TypeElementWidgetCDC.Evaluations:
				return ObjetTraduction_1.GTraductions.getValeur(
					"accueil.CDC.colonne.evaluations",
				);
		}
		return "";
	}
	getListeClassesAvecServiceDePeriode(aNumeroPeriode) {
		const lListeClassesAvecServicesDePeriode =
			new ObjetListeElements_1.ObjetListeElements();
		if (this.donnees.listeClasses) {
			for (const lClasse of this.donnees.listeClasses) {
				if (lClasse.periode.getNumero() === aNumeroPeriode) {
					lListeClassesAvecServicesDePeriode.add(lClasse);
				}
			}
		}
		return lListeClassesAvecServicesDePeriode;
	}
	composeWidgetCDC(aPeriode) {
		const H = [];
		const lListeClassesAvecServicesDePeriode =
			this.getListeClassesAvecServiceDePeriode(aPeriode.getNumero());
		if (lListeClassesAvecServicesDePeriode.count() > 0) {
			H.push(
				this.construireTable(
					aPeriode,
					0,
					this.nbColonneMax,
					lListeClassesAvecServicesDePeriode,
				),
			);
			const lItemsLegende = [];
			for (const lTypeElement of this.getArrayListeTypesElement()) {
				if (this.estAvecTypeElement(lTypeElement)) {
					const lHintLegende = this.getHintInfoTypeElement(lTypeElement);
					const lLibelleLegende = this.getLibelleLegende(lTypeElement);
					lItemsLegende.push(
						`<span title="${lHintLegende}" class="${this.getClasseIconeTypeElement(lTypeElement)}">${lLibelleLegende}</span>`,
					);
				}
			}
			H.push(
				'<div aria-hidden="true" class="legende">',
				lItemsLegende.join(""),
				"</div>",
			);
		}
		return H.join("");
	}
	construireTable(
		aPeriode,
		aIndex,
		aIndexClasseMax,
		aListeClassesAvecServicesDePeriode,
	) {
		const H = [];
		H.push(
			'<table class="widget-table" aria-label="',
			ObjetTraduction_1.GTraductions.getValeur("accueil.CDC.titre") +
				" " +
				aPeriode.getLibelle().toLowerCase(),
			'">',
		);
		H.push("<tr><td></td>");
		let lIndex = aIndex;
		let lClasse = aListeClassesAvecServicesDePeriode.get(lIndex);
		while (lIndex < aIndexClasseMax) {
			if (!lClasse) {
				H.push(IE.jsx.str("th", { scope: "col", "aria-hidden": "true" }));
			} else {
				H.push(IE.jsx.str("th", { scope: "col" }, lClasse.getLibelle()));
			}
			lIndex++;
			lClasse = aListeClassesAvecServicesDePeriode.get(lIndex);
		}
		H.push("</tr>");
		for (const lTypeElement of this.getArrayListeTypesElement()) {
			if (this.estAvecTypeElement(lTypeElement)) {
				H.push("<tr>");
				const lTitle = this.getHintInfoTypeElement(lTypeElement);
				H.push(
					IE.jsx.str(
						"th",
						{ scope: "row", title: lTitle, class: "cdc_item_enteteligne" },
						IE.jsx.str(
							"div",
							null,
							IE.jsx.str("i", {
								class: this.getClasseIconeTypeElement(lTypeElement),
								role: "img",
								"aria-label": lTitle,
							}),
						),
					),
				);
				lIndex = aIndex;
				lClasse = aListeClassesAvecServicesDePeriode.get(lIndex);
				while (lIndex < aIndexClasseMax) {
					if (!lClasse) {
						H.push(IE.jsx.str("td", { "aria-hidden": "true" }));
					} else {
						switch (lTypeElement) {
							case TypeElementWidgetCDC.DateConseil: {
								let lStrDateConseil = "";
								if (lClasse.dateConseil) {
									lStrDateConseil = ObjetDate_1.GDate.formatDate(
										lClasse.dateConseil,
										"%JJJ %JJ %MMM",
									);
								}
								H.push(
									'<td><div class="item-date-conseil-classe"',
									lStrDateConseil
										? ' title="' +
												ObjetTraduction_1.GTraductions.getValeur(
													"accueil.CDC.hint.ConseilProgrammeLe",
													[lStrDateConseil],
												) +
												'"'
										: ' aria-hidden="true"',
									">",
									lStrDateConseil,
									"</div></td>",
								);
								break;
							}
							case TypeElementWidgetCDC.Appreciations: {
								H.push("<td>");
								if (lClasse.auMoinsUnEleveDsServicesAppr) {
									H.push(
										'<div class="item-contain" tabindex="0" ie-node="nodeCelluleAppreciations(\'',
										lClasse.getNumero(),
										"', '",
										lClasse.periode.getNumero(),
										'\')" title="',
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDC.hintLien.appreciation",
										),
										'">',
									);
									H.push(
										lClasse.nbAppreciationsSaisies,
										" / ",
										lClasse.nbAppreciationsTotales,
									);
									H.push(
										this._composeCadenas(
											lClasse.appEstCloturee,
											lClasse.dateClotureApp,
										),
									);
									H.push(
										'<span class="sr-only">&nbsp; ',
										ObjetTraduction_1.GTraductions.getValeur(
											"accueil.CDC.hintLien.appreciation",
										),
										"</span></div>",
									);
								} else {
									const lContenuCelluleSansEleveAppr = "&nbsp;";
									H.push("<div>", lContenuCelluleSansEleveAppr, "</div>");
								}
								H.push("</td>");
								break;
							}
							case TypeElementWidgetCDC.Devoirs: {
								const lContenuCelluleDevoir = [];
								let lHintCelluleDevoir;
								if (lClasse.UniquementServicesSansNote) {
									lContenuCelluleDevoir.push("X");
									lHintCelluleDevoir = ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.hint.aucunServiceNote",
									);
								} else {
									lContenuCelluleDevoir.push(lClasse.nbDevoirs);
									lHintCelluleDevoir = ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.hintLien.devoir",
									);
								}
								const lClassesCellule = ["item-contain"];
								if (lClasse.UniquementServicesSansNote) {
									lClassesCellule.push("item-contain-disabled");
								}
								H.push(
									'<td><div class="',
									lClassesCellule.join(" "),
									'" tabindex="0" ie-node="nodeCelluleDevoirs(\'',
									lClasse.getNumero(),
									"', '",
									lClasse.periode.getNumero(),
									'\')" title="',
									lHintCelluleDevoir,
									'">',
								);
								H.push(lContenuCelluleDevoir.join(""));
								H.push(
									this._composeCadenas(
										lClasse.notationEstCloturee,
										lClasse.dateClotureNotation,
									),
								);
								H.push(
									'<span class="sr-only">&nbsp; ',
									lHintCelluleDevoir,
									"</span></div></td>",
								);
								break;
							}
							case TypeElementWidgetCDC.Evaluations: {
								H.push(
									'<td><div class="item-contain" tabindex="0" ie-node="nodeCelluleEvaluations(\'',
									lClasse.getNumero(),
									"', '",
									lClasse.periode.getNumero(),
									'\')" title="',
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.hintLien.evaluation",
									),
									'">',
								);
								H.push(lClasse.nbEvaluations);
								H.push(
									this._composeCadenas(
										lClasse.evaluationEstCloturee,
										lClasse.dateClotureEvaluation,
									),
								);
								H.push(
									'<span class="sr-only">&nbsp; ',
									ObjetTraduction_1.GTraductions.getValeur(
										"accueil.CDC.hintLien.evaluation",
									),
									"</span></div></td>",
								);
								break;
							}
							default:
								break;
						}
					}
					lIndex++;
					lClasse = aListeClassesAvecServicesDePeriode.get(lIndex);
				}
				H.push("</tr>");
			}
		}
		H.push("</table>");
		if (aListeClassesAvecServicesDePeriode.get(aIndexClasseMax)) {
			H.push(
				this.construireTable(
					aPeriode,
					aIndexClasseMax,
					aIndexClasseMax + this.nbColonneMax,
					aListeClassesAvecServicesDePeriode,
				),
			);
		}
		return H.join("");
	}
	_composeCadenas(aEstCloture, aDateCloture) {
		let lIconeCadenas;
		if (aEstCloture) {
			lIconeCadenas = "icon_lock";
		} else if (aDateCloture) {
			lIconeCadenas = "icon_unlock_alt";
		}
		const H = [];
		let lHintCadenas;
		if (lIconeCadenas) {
			if (aDateCloture) {
				const lStrDate = ObjetDate_1.GDate.formatDate(
					aDateCloture,
					"%JJ %MMMM",
				);
				if (aEstCloture) {
					lHintCadenas = ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDC.hint.ClotureDepuisLe",
						[lStrDate],
					);
				} else {
					lHintCadenas = ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDC.hint.CloturePrevueLe",
						[lStrDate],
					);
				}
			} else {
				if (aEstCloture) {
					lHintCadenas = ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDC.hint.Cloturee",
					);
				} else {
					lHintCadenas = ObjetTraduction_1.GTraductions.getValeur(
						"accueil.CDC.hint.NonCloturee",
					);
				}
			}
			H.push(
				'<i class="',
				lIconeCadenas,
				'" title="',
				lHintCadenas,
				'" role="img" ></i>',
			);
		}
		return H.join("");
	}
	_getServiceSuggere(aTypeElementWidget, aClasse) {
		let lService = null;
		if (aClasse) {
			let lNomProprieteServiceSuggere =
				this.donnees.navigations[aTypeElementWidget].nomProprieteServiceSuggere;
			if (lNomProprieteServiceSuggere) {
				lService = aClasse[lNomProprieteServiceSuggere];
			}
		}
		return lService;
	}
	_surClicItemCDC(aNumeroClasse, aNumeroPeriode, aTypeElementWidget) {
		const lOngletNavigationConcerne =
			this.donnees.navigations[aTypeElementWidget].ongletNavigation;
		if (lOngletNavigationConcerne) {
			let lClasseConcernee;
			const lListeClassesAvecServicesDePeriode =
				this.getListeClassesAvecServiceDePeriode(aNumeroPeriode);
			if (lListeClassesAvecServicesDePeriode) {
				lClasseConcernee =
					lListeClassesAvecServicesDePeriode.getElementParNumero(aNumeroClasse);
			}
			if (lClasseConcernee) {
				if (
					aTypeElementWidget === TypeElementWidgetCDC.Devoirs &&
					lClasseConcernee.UniquementServicesSansNote
				) {
					return;
				}
				const lAvecNavigationSurMesServices =
					aTypeElementWidget === TypeElementWidgetCDC.Evaluations;
				if (lAvecNavigationSurMesServices) {
					this.etatUtilisateurPN.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
						"",
						-1,
						Enumere_Ressource_1.EGenreRessource.Aucune,
					);
				} else {
					this.etatUtilisateurPN.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
						lClasseConcernee.getLibelle(),
						lClasseConcernee.getNumero(),
						lClasseConcernee.getGenre(),
					);
				}
				this.etatUtilisateurPN.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
					lClasseConcernee.periode.getLibelle(),
					lClasseConcernee.periode.getNumero(),
					lClasseConcernee.periode.getGenre(),
				);
				let lServiceSuggere = this._getServiceSuggere(
					aTypeElementWidget,
					lClasseConcernee,
				);
				if (lServiceSuggere) {
					this.etatUtilisateurPN.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
						lServiceSuggere.getLibelle(),
						lServiceSuggere.getNumero(),
						lServiceSuggere.getGenre(),
					);
				}
				const lPageDestination = { Onglet: lOngletNavigationConcerne };
				this.callback.appel(
					this.donnees.genre,
					Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
					lPageDestination,
				);
			}
		}
	}
	_initialiserComboCDC(aObjet) {
		aObjet.setOptionsObjetSaisie({
			longueur: 70,
			avecBoutonsPrecSuiv: true,
			avecBoutonsPrecSuivVisiblesInactifs: false,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
	_evenementComboCDC(aParams) {
		if (
			aParams.element &&
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.actualiserWidgetCDC(aParams.element);
		}
	}
}
exports.WidgetCDC = WidgetCDC;
