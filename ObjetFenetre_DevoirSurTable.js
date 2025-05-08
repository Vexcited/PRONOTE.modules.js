exports.ObjetFenetre_DevoirSurTable = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const GUID_1 = require("GUID");
const MethodesObjet_1 = require("MethodesObjet");
const TinyInit_1 = require("TinyInit");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeStatutCours_1 = require("TypeStatutCours");
const ObjetFenetre_Competences_1 = require("ObjetFenetre_Competences");
const ObjetFenetre_SelectionRessourceCours_1 = require("ObjetFenetre_SelectionRessourceCours");
const ObjetRequeteRessourcesSaisieCours_1 = require("ObjetRequeteRessourcesSaisieCours");
const ObjetRequeteSaisieCours_1 = require("ObjetRequeteSaisieCours");
const MoteurNotesCP_1 = require("MoteurNotesCP");
const MoteurNotes_1 = require("MoteurNotes");
class ObjetRequeteProgrammerDevoirEvaluationCDT extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"ProgrammerDevoirEvaluationCDT",
	ObjetRequeteProgrammerDevoirEvaluationCDT,
);
var EGenreSaisieSalle;
(function (EGenreSaisieSalle) {
	EGenreSaisieSalle[(EGenreSaisieSalle["ajouter"] = 0)] = "ajouter";
	EGenreSaisieSalle[(EGenreSaisieSalle["remplacer"] = 1)] = "remplacer";
	EGenreSaisieSalle[(EGenreSaisieSalle["supprimer"] = 2)] = "supprimer";
})(EGenreSaisieSalle || (EGenreSaisieSalle = {}));
class ObjetFenetre_DevoirSurTable extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.moteurNotes = new MoteurNotes_1.MoteurNotes();
		this.moteurNotesCP = new MoteurNotesCP_1.MoteurNotesCP(this.moteurNotes);
		this.setOptionsFenetre({
			largeur: 800,
			hauteur: 600,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecTailleSelonContenu: true,
		});
		this.idContenuMsg = GUID_1.GUID.getId();
		this.param = {
			init: false,
			contenuPourDescription: null,
			avecCreationDevoirEvaluation: false,
			service: null,
			periode: null,
			periodeSecondaire: null,
			listePeriodeSecondairePossible:
				new ObjetListeElements_1.ObjetListeElements(),
			listeItems: null,
			bareme: null,
			coefficient: 1,
			surModification_suppression: false,
			largeurCombo: 300,
			largeurInput: 60,
		};
	}
	getControleur(aInstance) {
		let lBaremeTemp = null,
			lCoeffTemp = null;
		return $.extend(true, super.getControleur(aInstance), {
			inputTitreContenu: {
				getValue: function () {
					return aInstance.param.contenu.getLibelle();
				},
				setValue: function (aValue) {
					aInstance.param.contenu.setLibelle(aValue);
				},
			},
			cbCreer: {
				getValue: function () {
					return aInstance.param.avecCreationDevoirEvaluation;
				},
				setValue: function (aValue) {
					aInstance.param.avecCreationDevoirEvaluation = aValue;
				},
				getDisabled: function () {
					const lDisabled =
						!aInstance.param.services ||
						aInstance.param.services.count() === 0 ||
						(aInstance.param.genreLienDS ===
							Enumere_LienDS_1.EGenreLienDS.tGL_Devoir &&
							!aInstance.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.notation.avecSaisieDevoirs,
							)) ||
						(aInstance.param.genreLienDS ===
							Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation &&
							!aInstance.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.competence.avecSaisieEvaluations,
							));
					return lDisabled;
				},
			},
			comboService: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: aInstance.param.largeurCombo,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.Service",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						const lListeLignes = new ObjetListeElements_1.ObjetListeElements();
						lListeLignes.add(aInstance.param.services);
						return lListeLignes;
					}
				},
				getIndiceSelection: function () {
					return aInstance.param.services.getIndiceParElement(
						aInstance.param.service,
					);
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.indice !==
							aInstance.param.services.getIndiceParElement(
								aInstance.param.service,
							)
					) {
						aInstance.param.service = aInstance.param.services.get(
							aParametres.indice,
						);
						aInstance.param.periode = null;
						aInstance.param.periodeSecondaire = null;
						aInstance.param.listeItems = null;
						aInstance.param.bareme = aInstance.param.service.baremeParDefaut;
					}
				},
				getDisabled: aInstance.cbCreationNonChecked
					.bind(aInstance)
					.bind(aInstance),
			},
			comboPeriode: {
				init: function (aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: aInstance.param.largeurCombo,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.Periode",
						),
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees || !aInstance.param.periode) {
						const lListeLignes = new ObjetListeElements_1.ObjetListeElements(),
							lService = aInstance.param.service;
						if (lService) {
							lListeLignes.add(lService.periodes);
							aInstance.param.periode = lService.periodes.get(0);
						}
						return lListeLignes;
					}
				},
				getIndiceSelection: function () {
					return aInstance.param.service
						? aInstance.param.service.periodes.getIndiceParElement(
								aInstance.param.periode,
							)
						: 0;
				},
				event: function (aParametres, aInstanceCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aInstanceCombo.estUneInteractionUtilisateur() &&
						aParametres.indice !==
							aInstance.param.service.periodes.getIndiceParElement(
								aInstance.param.periode,
							)
					) {
						aInstance.param.periode = aInstance.param.service.periodes.get(
							aParametres.indice,
						);
						aInstance._updateListePeriodesSecondairesPossible();
						if (
							!!aInstance.param.periode &&
							!!aInstance.param.periodeSecondaire &&
							aInstance.param.periode.getNumero() ===
								aInstance.param.periodeSecondaire.getNumero()
						) {
							aInstance.param.periodeSecondaire = null;
						}
					}
				},
				getDisabled: aInstance.cbCreationNonChecked.bind(aInstance),
			},
			comboPeriodeSecondaire: {
				init(aInstanceCombo) {
					aInstanceCombo.setOptionsObjetSaisie({
						longueur: aInstance.param.largeurCombo,
						labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.PeriodeSecondaire",
						),
					});
				},
				getDonnees(aDonnees) {
					if (!aDonnees) {
						aInstance._updateListePeriodesSecondairesPossible();
						return aInstance.param.listePeriodeSecondairePossible;
					}
				},
				getIndiceSelection() {
					return !!aInstance.param.periodeSecondaire
						? aInstance.param.listePeriodeSecondairePossible.getIndiceParElement(
								aInstance.param.periodeSecondaire,
							)
						: 0;
				},
				event(aParametres, aCombo) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aInstance.estUneInteractionUtilisateur() &&
						aParametres.indice !==
							aInstance.param.listePeriodeSecondairePossible.getIndiceParElement(
								aInstance.param.periodeSecondaire,
							)
					) {
						aInstance.param.periodeSecondaire =
							aInstance.param.listePeriodeSecondairePossible.get(
								aParametres.indice,
							);
					}
				},
				getDisabled: aInstance.cbCreationNonChecked.bind(aInstance),
			},
			inputNotation: {
				getValue() {
					return lBaremeTemp !== null
						? lBaremeTemp
						: aInstance.param.bareme
							? aInstance.param.bareme.getNote()
							: null;
				},
				setValue(aValue) {
					lBaremeTemp = aValue;
				},
				exitChange() {
					if (lBaremeTemp === null) {
						return;
					}
					const lNote = new TypeNote_1.TypeNote(lBaremeTemp);
					const lNoteMin = new TypeNote_1.TypeNote(1.0);
					const lNoteMax = new TypeNote_1.TypeNote(
						aInstance.moteurNotesCP.getBaremeDevoirMaximal(),
					);
					const lEstValide = lNote.estUneNoteValide(
						lNoteMin,
						lNoteMax,
						false,
						false,
					);
					lBaremeTemp = null;
					if (lEstValide) {
						aInstance.param.bareme = lNote;
					} else {
						aInstance.applicationSco
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetChaine_1.GChaine.format(
									ObjetTraduction_1.GTraductions.getValeur(
										"FenetreDevoir.ValeurComprise",
									),
									[lNoteMin + "", lNoteMax + ""],
								),
							});
					}
				},
				getDisabled: aInstance._surSuppressionOuSansCreation.bind(aInstance),
			},
			inputCoefficient: {
				getValue: function () {
					let lResult = lCoeffTemp;
					if (lResult === null) {
						lResult = aInstance.param.coefficient.toFixed(2).toString();
						lResult = lResult.replace(".", ",");
					}
					return lResult;
				},
				setValue: function (aValue) {
					lCoeffTemp = aValue;
				},
				exitChange: function () {
					if (lCoeffTemp === null) {
						return;
					}
					lCoeffTemp = lCoeffTemp.replace(",", ".");
					const lCoeffTempInt = Math.trunc(parseFloat(lCoeffTemp) * 100) / 100;
					if (lCoeffTempInt >= 0 && lCoeffTempInt <= 99) {
						aInstance.param.coefficient = lCoeffTempInt;
					} else {
						aInstance.applicationSco
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
								message: ObjetChaine_1.GChaine.format(
									ObjetTraduction_1.GTraductions.getValeur(
										"FenetreDevoir.ValeurComprise",
									),
									["0.00", "99.00"],
								),
							});
					}
					lCoeffTemp = null;
				},
				getDisabled: aInstance._surSuppressionOuSansCreation.bind(aInstance),
			},
			btnSaisieCours: {
				event: function () {
					if (aInstance.param.salles && aInstance.param.salles.count() === 0) {
						aInstance._requeteRessourcesSalle(null);
						return;
					}
					ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
						pere: aInstance,
						evenement: function (aLigne) {
							switch (aLigne.getNumero()) {
								case EGenreSaisieSalle.ajouter:
									aInstance._requeteRessourcesSalle(null);
									break;
								case EGenreSaisieSalle.remplacer:
									aInstance._requeteRessourcesSalle(aLigne.salle);
									break;
								case EGenreSaisieSalle.supprimer:
									aInstance.applicationSco.getMessage().afficher({
										type: Enumere_BoiteMessage_1.EGenreBoiteMessage
											.Confirmation,
										message: ObjetChaine_1.GChaine.format(
											ObjetTraduction_1.GTraductions.getValeur(
												"SaisieCours.ConfirmerSuppressionRessource",
											),
											[aLigne.salle.getLibelle()],
										),
										callback: function (aNon) {
											if (aNon) {
												return;
											}
											aInstance._saisieSalle(
												new ObjetListeElements_1.ObjetListeElements(),
												aLigne.salle,
											);
										},
									});
									break;
							}
						},
						initCommandes: function (aInstanceMenuContextuel) {
							aInstanceMenuContextuel.addCommande(
								EGenreSaisieSalle.ajouter,
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_DevoirSurTable.AjouterSalle",
								),
							);
							if (aInstance.param.salles.count() > 1) {
								aInstanceMenuContextuel.addSousMenu(
									ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_DevoirSurTable.RemplacerSalle",
									),
									(aInstanceMenu) => {
										aInstance.param.salles.parcourir((D) => {
											aInstanceMenu.addCommande(
												EGenreSaisieSalle.remplacer,
												D.getLibelle(),
											).salle = D;
										});
									},
								);
								aInstanceMenuContextuel.addSousMenu(
									ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_DevoirSurTable.SupprimerSalle",
									),
									(aInstanceMenu) => {
										aInstance.param.salles.parcourir((D) => {
											aInstanceMenu.addCommande(
												EGenreSaisieSalle.supprimer,
												D.getLibelle(),
											).salle = D;
										});
									},
								);
							} else {
								const lSalle = aInstance.param.salles.get(0);
								aInstanceMenuContextuel.addCommande(
									EGenreSaisieSalle.remplacer,
									ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_DevoirSurTable.RemplacerSalle",
									),
								).salle = lSalle;
								aInstanceMenuContextuel.addCommande(
									EGenreSaisieSalle.supprimer,
									ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_DevoirSurTable.SupprimerSalle",
									),
								).salle = lSalle;
							}
						},
					});
				},
			},
			inputItem: {
				getValue() {
					let result = "";
					if (aInstance.param.listeItems) {
						const lNbItemsExiste =
							aInstance.param.listeItems.getNbrElementsExistes();
						if (lNbItemsExiste > 1) {
							result =
								lNbItemsExiste +
								" " +
								ObjetTraduction_1.GTraductions.getValeur("competences.items");
						} else if (lNbItemsExiste === 1) {
							result =
								lNbItemsExiste +
								" " +
								ObjetTraduction_1.GTraductions.getValeur("Item");
						}
					}
					return result;
				},
				getDisabled: aInstance._surSuppressionOuSansCreation.bind(aInstance),
				surClickItem() {
					aInstance._ouvrirFenetreCompetences();
				},
				getClass() {
					return aInstance._surSuppressionOuSansCreation() ? "" : "AvecMain";
				},
			},
			rbChoixModification: {
				getValue(aSuppression) {
					return aInstance.param.surModification_suppression === aSuppression;
				},
				setValue(aSuppression) {
					aInstance.param.surModification_suppression = aSuppression;
				},
			},
			intituleEval: {
				getValue() {
					return aInstance.param.lien.getLibelle();
				},
				setValue(aValue) {
					aInstance.param.lien.setLibelle(aValue);
				},
				getDisabled() {
					return aInstance.param.surModification_suppression;
				},
			},
		});
	}
	setDonnees(aParam) {
		$.extend(this.param, aParam);
		this.param.contenu = aParam.contenu
			? MethodesObjet_1.MethodesObjet.dupliquer(aParam.contenu)
			: new ObjetElement_1.ObjetElement();
		if (!this.param.contenu.descriptif) {
			this.param.contenu.descriptif = "";
		}
		const lTitreFenetre =
			aParam.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
				? this.param.contenu.estVide
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ProgrammerDS",
						)
					: ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ModifierDS")
				: this.param.contenu.estVide
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ProgrammerEval",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ModifierEval",
						);
		this.setOptionsFenetre({ titre: lTitreFenetre });
		new ObjetRequeteProgrammerDevoirEvaluationCDT(this)
			.lancerRequete({
				cours: aParam.cours,
				numeroCycle: aParam.numeroCycle,
				genreLienDS: aParam.genreLienDS,
				contenuPourDescription: aParam.contenuPourDescription,
			})
			.then((aReponse) => {
				this._apresRequete(aReponse);
			});
	}
	composeContenu() {
		const T = [];
		if (!this.param.init) {
			return "";
		}
		T.push(
			'<div class="PetitEspace">',
			'<div class="like-input no-hover" style="',
			ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.cumul),
			'">',
			'<div class="Espace Gras">',
			this.param.titre,
			"</div>",
			"</div>",
			"</div>",
		);
		T.push(this._composeSalles());
		T.push(this._composeSaisieTitre());
		T.push(this._composeZoneContenuMsg());
		if (!this.param.lien) {
			T.push(this._composeCreationDevoirEvaluation());
		} else {
			T.push(this._composeModificationDevoirEvaluation());
		}
		return T.join("");
	}
	surValidation(aNumeroBouton) {
		const lAvecLien =
			(this.param.lien && !this.param.surModification_suppression) ||
			(!this.param.lien && this.param.avecCreationDevoirEvaluation);
		if (aNumeroBouton === 1) {
			if (
				this.param.genreLienDS ===
					Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation &&
				lAvecLien &&
				(!this.param.listeItems || this.param.listeItems.count() === 0)
			) {
				this.applicationSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.CompetenceItemsManquant",
						),
					});
				return;
			}
			this.param.contenu.descriptif = this._recupererDescriptif();
		}
		this.fermer();
		this.callback.appel(aNumeroBouton === 1, this.param, lAvecLien);
	}
	_updateListePeriodesSecondairesPossible() {
		this.param.listePeriodeSecondairePossible.vider();
		this.param.listePeriodeSecondairePossible.addElement(
			new ObjetElement_1.ObjetElement(""),
		);
		const lService = this.param.service;
		if (!!lService) {
			this.param.listePeriodeSecondairePossible.add(lService.periodes);
		}
		if (!!this.param.periode) {
			const lPeriodeARetirer = this.param.periode;
			this.param.listePeriodeSecondairePossible.removeFilter((aElement) => {
				return lPeriodeARetirer.getNumero() === aElement.getNumero();
			});
		}
	}
	cbCreationNonChecked() {
		return !this.param.avecCreationDevoirEvaluation;
	}
	_surSuppressionOuSansCreation() {
		return this.param.lien
			? this.param.surModification_suppression
			: !this.param.avecCreationDevoirEvaluation;
	}
	_ouvrirFenetreCompetences() {
		const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Competences_1.ObjetFenetre_Competences,
			{
				pere: this,
				evenement: this._surEvenementFenetreCompetences.bind(this),
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"competences.choixCompetencesConnaissancesAEvaluer",
						),
						largeur: 620,
						hauteur: 420,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		);
		let lListeItemsFenetreCompetences;
		if (!!this.param.listeItems) {
			lListeItemsFenetreCompetences = MethodesObjet_1.MethodesObjet.dupliquer(
				this.param.listeItems,
			);
		} else {
			lListeItemsFenetreCompetences =
				new ObjetListeElements_1.ObjetListeElements();
		}
		lInstance.setDonnees({
			listeCompetences: lListeItemsFenetreCompetences,
			service: this.param.service,
		});
	}
	_surEvenementFenetreCompetences(aGenreBouton, aListeCompetencesDEvaluation) {
		if (aGenreBouton === 1) {
			this.param.listeItems = aListeCompetencesDEvaluation;
		}
	}
	async _saisieSalle(aListeSelection, aRessourceRemplacee) {
		if (aRessourceRemplacee) {
			aRessourceRemplacee.Genre = Enumere_Ressource_1.EGenreRessource.Salle;
		}
		const lParametres = {
			cours: this.param.cours,
			numeroSemaine: this.param.numeroCycle,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Salle,
			listeRessources: aListeSelection,
			ressourceRemplacee: aRessourceRemplacee,
		};
		const lReonse = await new ObjetRequeteSaisieCours_1.ObjetRequeteSaisieCours(
			this,
		).lancerRequete(lParametres);
		if (
			lReonse &&
			lReonse.JSONRapportSaisie &&
			lReonse.JSONRapportSaisie.cours
		) {
			lParametres.cours.Numero = lReonse.JSONRapportSaisie.cours.Numero;
		}
		this.param.contenu.descriptif = this._recupererDescriptif();
		this.param.callbackSaisieSalle(lParametres.cours, this.param);
	}
	_evenementSurFenetreSelectionRessource(
		aParametres,
		aValider,
		aGenreRessource,
		aListeSelection,
	) {
		if (aValider) {
			this._saisieSalle(aListeSelection, aParametres.ressourceRemplacee);
		}
	}
	async _requeteRessourcesSalle(aSalleARemplacer) {
		const lParametres = {
			cours: this.param.cours,
			numeroSemaine: this.param.numeroCycle,
			genreRessource: Enumere_Ressource_1.EGenreRessource.Salle,
			ressourceRemplacee: aSalleARemplacer,
		};
		const lReponse =
			await new ObjetRequeteRessourcesSaisieCours_1.ObjetRequeteRessourcesSaisieCours(
				this,
			).lancerRequete(lParametres);
		const lInstance = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionRessourceCours_1.ObjetFenetre_SelectionRessourceCours,
			{
				pere: this,
				evenement: this._evenementSurFenetreSelectionRessource.bind(
					this,
					lParametres,
				),
			},
		);
		lInstance.setDonnees(
			lReponse.liste,
			Enumere_Ressource_1.EGenreRessource.Salle,
		);
	}
	_apresRequete(aParam) {
		$("#" + this.idContenuMsg.escapeJQ()).val("");
		$.extend(this.param, aParam);
		this.param.init = true;
		let lServicePreferentiel = null;
		if (this.param.services && this.param.services.count() > 0) {
			this.param.services.parcourir((aService) => {
				if (aService.preferentiel) {
					lServicePreferentiel = aService;
					return false;
				}
			});
		}
		this.param.service = lServicePreferentiel;
		if (
			!this.param.service &&
			this.param.services &&
			this.param.services.count() > 0
		) {
			this.param.service = this.param.services.get(0);
		}
		if (
			!this.param.bareme &&
			this.param.services &&
			this.param.services.count() > 0
		) {
			let lServiceConcerne = null;
			if (this.param.service) {
				lServiceConcerne = this.param.service;
			} else {
				lServiceConcerne = this.param.services.get(0);
			}
			this.param.bareme = lServiceConcerne.baremeParDefaut;
		}
		if (this.param.paramsFenetreOrigine) {
			this.param.contenu.setLibelle(
				this.param.paramsFenetreOrigine.contenu.getLibelle(),
			);
			this.param.contenu.descriptif =
				this.param.paramsFenetreOrigine.contenu.descriptif;
			this.param.avecCreationDevoirEvaluation =
				this.param.paramsFenetreOrigine.avecCreationDevoirEvaluation;
			this.param.service = this.param.paramsFenetreOrigine.service;
			this.param.periode = this.param.paramsFenetreOrigine.periode;
			this.param.periodeSecondaire =
				this.param.paramsFenetreOrigine.periodeSecondaire;
			this.param.listeItems = this.param.paramsFenetreOrigine.listeItems;
			this.param.coefficient = this.param.paramsFenetreOrigine.coefficient;
			this.param.bareme = this.param.paramsFenetreOrigine.bareme;
			this.param.surModification_suppression =
				this.param.paramsFenetreOrigine.surModification_suppression;
		}
		this.param.salles.trier();
		this.afficher(this.composeContenu());
		if (this._autoriseTiny()) {
			this._initTiny();
		}
		const lHauteur = $("#" + this.IdContenu.escapeJQ()).height() - 10;
		$("#" + this.idContenuMsg.escapeJQ()).height(lHauteur);
	}
	_initTiny() {
		if (GNavigateur.withContentEditable) {
			TinyInit_1.TinyInit.init({
				id: this.idContenuMsg,
				min_height: 200,
				height: 200,
				max_height: 200,
				editeurEquation: true,
				editeurEquationMaxFileSize: 4096,
			}).then((aEditor) => {
				if (aEditor) {
					aEditor.setContent(this.param.contenu.descriptif);
				}
			});
		} else {
			ObjetHtml_1.GHtml.setValue(
				this.idContenuMsg,
				this.param.contenu.descriptif,
			);
		}
	}
	_composeSalles() {
		const H = [];
		H.push(
			'<div class="NoWrap Espace">',
			'<div class="InlineBlock PetitEspaceDroit">',
			(this.param.salles.count() > 1
				? ObjetTraduction_1.GTraductions.getValeur("Salles")
				: ObjetTraduction_1.GTraductions.getValeur("Salle")) + " :",
			"</div>",
		);
		H.push(
			'<div class="InlineBlock">',
			this.param.salles.getTableauLibelles().join(", "),
			"</div>",
		);
		if (
			this.param.cours &&
			this.param.avecSaisieSalle &&
			this.param.cours.getGenre() !==
				TypeStatutCours_1.TypeStatutCours.ConseilDeClasse &&
			!this.parametresSco.domaineVerrou.getValeur(this.param.numeroCycle) &&
			!this.param.cours.estAnnule &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.estSemaineModifiable,
				this.param.numeroCycle,
			) &&
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.modifierSalles,
			)
		) {
			H.push(
				'<div class="InlineBlock EspaceGauche">',
				'<ie-bouton ie-model="btnSaisieCours">',
				this.param.salles.count() === 0
					? ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.ReserverSalle",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.ModifierSalle",
						),
				"</ie-bouton>",
				"</div>",
			);
		}
		H.push("</div>");
		return H.join("");
	}
	_composeLigneField(aLibelle, aContenu) {
		const H = [],
			lEcart = 100;
		H.push('<div class="NoWrap PetitEspace">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical AlignementDroit GrandEspaceDroit" style="',
			ObjetStyle_1.GStyle.composeWidth(lEcart),
			'">',
			aLibelle,
			"</div>",
		);
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical">',
			aContenu,
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	_composeZoneItems(aLabel) {
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str("input", {
				readonly: true,
				"ie-model": "inputItem",
				"ie-event": "click->surClickItem",
				class: "round-style",
				"ie-class": "getClass",
				style: ObjetStyle_1.GStyle.composeWidth(this.param.largeurCombo + 27),
				"aria-label": aLabel,
			}),
		);
	}
	_composeNotation() {
		const H = [];
		H.push(
			this._composeLigneField(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_DevoirSurTable.Bareme",
				),
				IE.jsx.str("input", {
					"ie-model": "inputNotation",
					"ie-mask": "/[^0-9,.]/i",
					maxlength: "6",
					class: "round-style",
					style: ObjetStyle_1.GStyle.composeWidth(this.param.largeurInput),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.Bareme",
					),
				}),
			),
		);
		H.push(
			this._composeLigneField(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_DevoirSurTable.Coefficient",
				),
				IE.jsx.str("input", {
					"ie-model": "inputCoefficient",
					"ie-mask": "/[^0-9,.]/i",
					maxlength: "6",
					class: "round-style",
					style: ObjetStyle_1.GStyle.composeWidth(this.param.largeurInput),
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.Coefficient",
					),
				}),
			),
		);
		return H.join("");
	}
	_composeCreationDevoirEvaluation() {
		const H = [];
		H.push(
			'<fieldset class="Espace AlignementGauche" style="',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
			'">',
		);
		H.push('<legend class="Espace">');
		H.push(
			'<ie-checkbox ie-model="cbCreer">',
			this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.CreerUnDevoir",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.CreerUneEvaluation",
					),
			"</ie-checkbox>",
		);
		H.push("</legend>");
		H.push("<div>");
		H.push(
			this._composeLigneField(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_DevoirSurTable.Service",
				),
				'<ie-combo ie-model="comboService"></ie-combo>',
			),
		);
		H.push(
			this._composeLigneField(
				ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_DevoirSurTable.Periode",
				),
				'<ie-combo ie-model="comboPeriode"></ie-combo>',
			),
		);
		if (
			this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation
		) {
			H.push(
				this._composeLigneField(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.PeriodeSecondaire",
					),
					'<ie-combo ie-model="comboPeriodeSecondaire"></ie-combo>',
				),
			);
			H.push(
				this._composeLigneField(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.Items",
					),
					this._composeZoneItems(
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_DevoirSurTable.Items",
						),
					),
				),
			);
		}
		if (this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir) {
			H.push(this._composeNotation());
		}
		H.push("</div>");
		H.push("</div>");
		H.push("</fieldset>");
		return H.join("");
	}
	_composeModificationDevoirEvaluation() {
		const H = [];
		H.push(
			'<fieldset class="Espace AlignementGauche" style="',
			ObjetStyle_1.GStyle.composeCouleurBordure(GCouleur.bordure),
			'">',
		);
		H.push('<legend class="Espace">');
		H.push(
			this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.ModifierLeDevoirAssocie",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.ModifierLEvalAssociee",
					),
		);
		H.push("</legend>");
		H.push('<div class="GrandEspaceGauche">');
		H.push(
			'<div class="PetitEspace">',
			'<ie-radio ie-model="rbChoixModification(true)">',
			this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.SupprimerLeDevoir",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.SupprimerLEval",
					),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="PetitEspace">',
			'<ie-radio ie-model="rbChoixModification(false)">',
			this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
				? ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.ModifierLeDevoir",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_DevoirSurTable.ModifierLEval",
					),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="PetitEspace" class="margin-left:30px;">',
			this.param.genreLienDS === Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
				? this._composeNotation()
				: this._composeLigneField(
						ObjetTraduction_1.GTraductions.getValeur("competences.intitule") +
							" :",
						'<textarea ie-model="intituleEval" style="' +
							ObjetStyle_1.GStyle.composeCouleurBordure(
								GCouleur.themeNeutre.claire,
							) +
							ObjetStyle_1.GStyle.composeWidth(this.param.largeurCombo + 27) +
							ObjetStyle_1.GStyle.composeHeight(40) +
							'"' +
							' class="Texte10" maxlength="1000"></textarea>',
					) +
						this._composeLigneField(
							ObjetTraduction_1.GTraductions.getValeur("competences.items") +
								" :",
							this._composeZoneItems(
								ObjetTraduction_1.GTraductions.getValeur("competences.items"),
							),
						),
			"</div>",
		);
		H.push("</div>");
		H.push("</fieldset>");
		return H.join("");
	}
	_composeSaisieTitre() {
		const H = [];
		const lId = `${this.Nom}_inp_titre`;
		H.push(
			IE.jsx.str(
				"label",
				{ class: "PetitEspace", for: lId },
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.titre"),
			),
		);
		H.push(
			IE.jsx.str("input", {
				"ie-model": "inputTitreContenu",
				id: lId,
				maxlength: "255",
				class: "round-style",
				style: "width:100%; margin-bottom:3px;",
			}),
		);
		return H.join("");
	}
	_composeZoneContenuMsg() {
		const H = [];
		H.push(
			'<div class="PetitEspace">',
			ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_DevoirSurTable.ConsignesRevisions",
			),
			"</div>",
		);
		H.push(
			'<textarea id="' +
				this.idContenuMsg +
				'"' +
				(!this._autoriseTiny() ? ' maxlength="1000"' : "") +
				' class="Texte10" style="width:100%; border:1px solid black"></textarea>',
		);
		return H.join("");
	}
	_recupererDescriptif() {
		let lContent = "";
		if (this._autoriseTiny()) {
			if (!GNavigateur.withContentEditable) {
				lContent = ObjetHtml_1.GHtml.getValue(this.idContenuMsg);
			} else {
				const lEditor = TinyInit_1.TinyInit.get(this.idContenuMsg);
				if (lEditor) {
					lContent = lEditor.getContent();
				}
			}
			return lContent;
		} else {
			return ObjetHtml_1.GHtml.getValue(this.idContenuMsg);
		}
	}
	_autoriseTiny() {
		return true;
	}
}
exports.ObjetFenetre_DevoirSurTable = ObjetFenetre_DevoirSurTable;
