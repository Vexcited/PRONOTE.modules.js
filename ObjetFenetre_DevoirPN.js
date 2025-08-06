exports.ObjetFenetre_DevoirPN = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Devoir_1 = require("ObjetFenetre_Devoir");
const ObjetElement_1 = require("ObjetElement");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const TypeNote_1 = require("TypeNote");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_PanierRessourceKiosque_1 = require("ObjetFenetre_PanierRessourceKiosque");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const ObjetFenetre_Competences_1 = require("ObjetFenetre_Competences");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const TypeFichierExterneHttpSco_1 = require("TypeFichierExterneHttpSco");
const ObjetRequeteListeCompetencesQCM_1 = require("ObjetRequeteListeCompetencesQCM");
const DonneesListe_EvaluationsQCM_1 = require("DonneesListe_EvaluationsQCM");
const ObjetFenetre_CategorieEvaluation_1 = require("ObjetFenetre_CategorieEvaluation");
const ObjetRequeteCategorieEvaluation_1 = require("ObjetRequeteCategorieEvaluation");
const ObjetCelluleMultiSelectionThemes_1 = require("ObjetCelluleMultiSelectionThemes");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const AccessApp_1 = require("AccessApp");
class ObjetFenetre_DevoirPN extends ObjetFenetre_Devoir_1.ObjetFenetre_Devoir {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.objetParametres = this.applicationSco.getObjetParametres();
		this.idCompetencesEvaluees = this.Nom + "_competencesEvaluees";
		this.avecQCMCompetences = true;
		this.avecCategorieEvaluation = true;
		this.avecThemes = this.applicationSco.parametresUtilisateur.get(
			"avecGestionDesThemes",
		);
		this.avecConsigneQCM = true;
		this.avecPersonnalisationProjetAccompagnement = true;
		this.avecModeCorrigeALaDate = true;
		this.avecMultipleExecutions = true;
	}
	initialiserDevoir() {
		this.regrouperPeriodes = false;
		this.avecSousMatiere = true;
		this.baremeAvecDecimales = true;
	}
	initialiserListeCompetencesQCM(aInstance) {
		aInstance.setOptionsListe(
			DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM.getOptionsListe(
				false,
			),
		);
	}
	evenementSurListeCompetencesQCM(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				if (!!this.devoir && !!this.devoir.executionQCM) {
					this.devoir.executionQCM.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
				}
				break;
		}
	}
	addInstanceThemes() {
		this.identMultiSelectionTheme = this.add(
			ObjetCelluleMultiSelectionThemes_1.ObjetCelluleMultiSelectionThemes,
			this._evtCellMultiSelectionTheme.bind(this),
		);
	}
	getTitrePublic() {
		return this.devoir.service.classe.getNumero()
			? ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Classe")
			: ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.Groupe");
	}
	getLibellePublic() {
		return this.devoir.service.classe.getNumero()
			? this.devoir.service.classe.getLibelle()
			: this.devoir.service.groupe.getLibelle();
	}
	getLibelleProfesseur() {
		return this.devoir.service.professeur.getLibelle();
	}
	getHtmlInfoPublicationDecaleeParents() {
		let lMessageDateDecaleeAuxParents = "";
		if (
			this.devoir &&
			this.objetParametres.avecAffichageDecalagePublicationNotesAuxParents &&
			!!this.objetParametres.nbJDecalagePublicationAuxParents
		) {
			let lDatePublicationDecalee = ObjetDate_1.GDate.formatDate(
				ObjetDate_1.GDate.getJourSuivant(
					this.devoir.datePublication,
					this.objetParametres.nbJDecalagePublicationAuxParents,
				),
				" %JJ/%MM",
			);
			if (this.objetParametres.nbJDecalagePublicationAuxParents === 1) {
				lMessageDateDecaleeAuxParents =
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.DecalageUnJourPublicationParentsSoitLe",
						[lDatePublicationDecalee],
					);
			} else {
				lMessageDateDecaleeAuxParents =
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.DecalageXJoursPublicationParentsSoitLe",
						[
							this.objetParametres.nbJDecalagePublicationAuxParents,
							lDatePublicationDecalee,
						],
					);
			}
		}
		return lMessageDateDecaleeAuxParents;
	}
	getEGenreSujet() {
		return TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirSujet;
	}
	getEGenreCorrige() {
		return TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.DevoirCorrige;
	}
	avecDepotCloud() {
		return GEtatUtilisateur.listeCloud.count() > 0;
	}
	ouvrirPJCloud(aParams) {
		const lThis = this;
		const lParamsDonnees = Object.assign(
			{
				instance: lThis,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
			},
			aParams,
		);
		let lParams = {
			callbaskEvenement: function (aLigne) {
				if (aLigne >= 0) {
					lParamsDonnees.service = GEtatUtilisateur.listeCloud.get(aLigne);
					lThis.choisirFichierCloud(lParamsDonnees);
				}
			},
			modeGestion:
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.modeGestion
					.Cloud,
		};
		UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
			lParams,
		);
	}
	ouvrirPJCloudENEJ(aParams) {
		var _a;
		const lParamsDonnees = Object.assign(
			{
				instance: this,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
				service:
					(_a = this.applicationSco.getEtatUtilisateur()) === null ||
					_a === void 0
						? void 0
						: _a.getCloudENEJ(),
			},
			aParams,
		);
		this.choisirFichierCloud(lParamsDonnees);
	}
	async choisirFichierCloud(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				genre: TypeFichierExterneHttpSco_1.TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
			},
			aParams,
		);
		return new Promise((aResolve) => {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
				{
					pere: lParams.instance,
					evenement: function (aParam) {
						if (
							aParam.listeNouveauxDocs &&
							aParam.listeNouveauxDocs.count() === 1
						) {
							const lElement = aParam.listeNouveauxDocs.get(0);
							lParams.listeElements.addElement(lElement, 0);
							if (lParams.callback) {
								lParams.callback.call(lParams.instance);
							}
							aResolve(true);
						}
					},
					initialiser(aFenetre) {
						aFenetre.setOptionsFenetre({
							callbackApresFermer() {
								aResolve();
							},
						});
					},
				},
			).setDonnees({ service: lParams.service.Genre });
		});
	}
	getTailleMaxPieceJointe() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
		);
	}
	composeCompetencesEvaluees() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{
					class: "flex-contain cols top-line m-top-xl",
					"ie-display": "competencesEvaluees.avecCompetencesClassique",
				},
				IE.jsx.str(
					"div",
					{ class: "field-contain" },
					IE.jsx.str(
						"ie-checkbox",
						{
							id: this.Nom + "_cbEvaluationAssociee",
							"ie-model": "cbEvaluationAssociee",
						},
						IE.jsx.str("span", { "ie-html": "labelEvaluationAssociee" }),
					),
				),
				IE.jsx.str(
					"div",
					{
						class: "field-contain",
						"ie-display": "competencesEvaluees.estVisible",
					},
					IE.jsx.str(
						"label",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.CompetencesEvaluees",
						),
					),
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "competencesEvaluees.btnModifierCompetences",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"competences.choixCompetencesConnaissancesAEvaluer",
							),
						},
						"...",
					),
				),
				IE.jsx.str("div", {
					class: "field-contain fixed-height",
					id: this.idCompetencesEvaluees,
				}),
			),
		);
		T.push(
			`<div class="flex-contain cols top-line" ie-display="competencesEvaluees.avecCompetencesDeQCM">`,
		);
		T.push(
			`  <div class="field-contain">\n                <ie-checkbox ie-model="cbEvaluationDuQCM">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.GenererCompetencesQCM")}</ie-checkbox>\n              </div>\n              <div class="field-contain" id="${this.getNomInstance(this.identListeCompetencesQCM)}"></div>`,
		);
		T.push(
			`  <div class="field-contain">\n                <ie-checkbox ie-model="cbSansDoublon">${ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.NeComptabiliserQuUnNiveauPourCompetencesIdentiques")}</ie-checkbox>\n              </div>`,
		);
		T.push(`</div>`);
		return T.join("");
	}
	actualiserCompetencesEvaluees() {
		const T = [];
		if (this.devoir.evaluation && this.devoir.evaluation.listeCompetences) {
			T.push('<ul class="liste-competences">');
			this.devoir.evaluation.listeCompetences.parcourir((aCompetence) => {
				if (aCompetence.existe()) {
					T.push(
						"<li><span>",
						aCompetence.code,
						" : </span>",
						aCompetence.getLibelle(),
						"</li>",
					);
				}
			});
			T.push("</ul>");
		}
		ObjetHtml_1.GHtml.setHtml(this.idCompetencesEvaluees, T.join(""));
	}
	initFenetreSelectionQCM(aInstance) {
		UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(aInstance);
		aInstance.setGenreRessources({
			genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
			genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
			genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
			genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
		});
	}
	evntSurSelectionQCM(aNumeroBouton, aEltQCM) {
		if (this.avecQCM && aNumeroBouton > 0) {
			UtilitaireQCM_1.UtilitaireQCM.surSelectionQCM(this.devoir, aEltQCM, {
				genreAucune: Enumere_Ressource_1.EGenreRessource.Aucune,
				genreExecQCM: Enumere_Ressource_1.EGenreRessource.ExecutionQCM,
			});
			const lExecution = this.devoir.executionQCM;
			if (
				lExecution !== null &&
				lExecution !== undefined &&
				lExecution.QCM !== null &&
				lExecution.QCM !== undefined
			) {
				this.devoir.bareme = new TypeNote_1.TypeNote(
					lExecution.QCM.nombreDePoints,
				);
			} else {
				this.devoir.bareme = this.baremeService;
			}
			if (this.devoir.date !== null && this.devoir.date !== undefined) {
				if (this.avecDetailPublicationQCM) {
					const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
					const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
						this.objetParametres.PlacesParJour - 1,
						true,
					);
					$.extend(this.devoir.executionQCM, {
						dateDebutPublication: new Date(
							this.devoir.date.setHours(
								lPremiereHeure.getHours(),
								lPremiereHeure.getMinutes(),
							),
						),
						dateFinPublication: new Date(
							this.devoir.date.setHours(
								lDerniereHeure.getHours(),
								lDerniereHeure.getMinutes(),
							),
						),
					});
					UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(
						this.devoir.executionQCM,
					);
				}
			}
			if (
				lExecution &&
				lExecution.QCM &&
				lExecution.QCM.nbCompetencesTotal > 0
			) {
				if (lExecution.estLieAEvaluation === undefined) {
					lExecution.estLieAEvaluation = false;
				}
				if (lExecution.sansDoublon === undefined) {
					lExecution.sansDoublon = true;
				}
				this.actualiserCompetencesDeServiceEtQcm(lExecution);
			} else {
				this.actualiser();
			}
		}
	}
	actualiserCompetencesDeServiceEtQcm(aExecutionQCM) {
		new ObjetRequeteListeCompetencesQCM_1.ObjetRequeteListeCompetencesQCM(
			this,
			this._surRequeteListeCompetencesQCM.bind(this),
		).lancerRequete({
			executionQCM: aExecutionQCM,
			qcm: aExecutionQCM.QCM,
			service: this.devoir.service,
			sansDoublon: aExecutionQCM.sansDoublon,
		});
	}
	actualiserSelectionService(aListeService) {
		this.listeServices = aListeService;
		if (this.avecSelectionService) {
			const lListeService = aListeService;
			const lNbr = lListeService.count();
			for (let i = 0; i < lNbr; i++) {
				const lElement = lListeService.get(i);
				lElement.libelleHtml =
					(lElement.pere.existeNumero()
						? lElement.pere.matiere.getLibelle() + " - "
						: "") +
					(lElement.pere.estCoEnseignement
						? lElement.professeur.getLibelle() + " - "
						: "") +
					lElement.getLibelle() +
					(lElement.estCoEnseignement
						? " - " + lElement.professeur.getLibelle()
						: "") +
					" - " +
					(lElement.groupe.existeNumero()
						? lElement.groupe.getLibelle()
						: lElement.classe.getLibelle());
			}
			$(
				"#" +
					this.identZoneSelectionService.escapeJQ() +
					", #" +
					this.identZoneSelectionService_mirroir.escapeJQ(),
			).show();
			this.getInstance(this.idSelectionService).setDonnees(
				aListeService,
				aListeService.getIndiceParNumeroEtGenre(
					this.devoir.service.getNumero(),
				),
			);
		} else {
			$(
				"#" +
					this.identZoneSelectionService.escapeJQ() +
					", #" +
					this.identZoneSelectionService_mirroir.escapeJQ(),
			).hide();
		}
	}
	composeCommentaireSurNote() {
		const lModelCBRemarque = () => {
			return {
				getValue: () => {
					return this.devoir && this.devoir.avecCommentaireSurNoteEleve;
				},
				setValue: async (aValue) => {
					if (this.devoir) {
						if (!aValue && this._avecUnCommentaireSurNote(this.devoir)) {
							const lRes = await this.applicationSco
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"Notes.confirmationSupressionCommentaireSurNote",
									),
								});
							if (lRes === Enumere_Action_1.EGenreAction.Valider) {
								this.devoir.avecCommentaireSurNoteEleve =
									!this.devoir.avecCommentaireSurNoteEleve;
							}
							return;
						}
						this.devoir.avecCommentaireSurNoteEleve =
							!this.devoir.avecCommentaireSurNoteEleve;
					}
				},
			};
		};
		return IE.jsx.str(
			"ie-checkbox",
			{ "ie-model": lModelCBRemarque },
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetreDevoir.activerCommentaireSurNotes",
			),
		);
	}
	_estUnGroupe(aClasse) {
		return (
			aClasse &&
			aClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
		);
	}
	leDevoirEstSurUnePeriodeClotureePourEvaluation(aDevoir) {
		if (!!aDevoir && !!aDevoir.listeClasses) {
			for (let i = 0; i < aDevoir.listeClasses.count(); i++) {
				const lClasse = aDevoir.listeClasses.get(i);
				for (let j = 0; j < lClasse.listePeriodes.count(); j++) {
					const lPeriode = lClasse.listePeriodes.get(j);
					if (!!lPeriode && lPeriode.estEvaluationCloturee) {
						return true;
					}
				}
			}
			return false;
		}
		return true;
	}
	leDevoirEstSurPeriodesIdentiques(aDevoir) {
		let lResult = false;
		if (aDevoir && aDevoir.listeClasses) {
			const lFuncPeriodesSontIdentiques = (aPeriode1, aPeriode2) => {
				let lSontIdentiques = false;
				if (!aPeriode1) {
					lSontIdentiques = !aPeriode2;
				} else {
					lSontIdentiques =
						aPeriode2 && aPeriode1.getNumero() === aPeriode2.getNumero();
				}
				return lSontIdentiques;
			};
			lResult = true;
			let lPeriodePrincipaleUnique = null;
			let lPeriodeSecondaireUnique = null;
			let lEstInitialise = false;
			for (const lClasse of aDevoir.listeClasses) {
				if (!lEstInitialise) {
					if (lClasse.listePeriodes) {
						if (lClasse.listePeriodes.count() > 0) {
							lPeriodePrincipaleUnique = lClasse.listePeriodes.get(0);
						}
						if (lClasse.listePeriodes.count() > 1) {
							lPeriodeSecondaireUnique = lClasse.listePeriodes.get(1);
						}
					}
					lEstInitialise = true;
					continue;
				}
				let lPeriodePrincipaleDeClasseCourante = null;
				let lPeriodeSecondaireDeClasseCourante = null;
				if (lClasse.listePeriodes) {
					if (lClasse.listePeriodes.count() > 0) {
						lPeriodePrincipaleDeClasseCourante = lClasse.listePeriodes.get(0);
					}
					if (lClasse.listePeriodes.count() > 1) {
						lPeriodeSecondaireDeClasseCourante = lClasse.listePeriodes.get(1);
					}
				}
				lResult =
					lFuncPeriodesSontIdentiques(
						lPeriodePrincipaleUnique,
						lPeriodePrincipaleDeClasseCourante,
					) &&
					lFuncPeriodesSontIdentiques(
						lPeriodeSecondaireUnique,
						lPeriodeSecondaireDeClasseCourante,
					);
				if (!lResult) {
					break;
				}
			}
		}
		return lResult;
	}
	evenementSurBtnCompetencesEvaluees() {
		const lEstCloturePourEvaluation =
			this.leDevoirEstSurUnePeriodeClotureePourEvaluation(this.devoir);
		if (lEstCloturePourEvaluation) {
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.MsgModificationCompetencesImpossible",
					),
				});
			return;
		}
		if (!this.leDevoirEstSurPeriodesIdentiques(this.devoir)) {
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.MsgModificationCompetencesImpossibleMultiClasses",
					),
				});
			return;
		}
		if (!this.devoir.service.avecSaisieEvaluation) {
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.MsgModificationCompetencesImpossibleProfDifferent",
					),
				});
			return;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Competences_1.ObjetFenetre_Competences,
			{
				pere: this,
				evenement: this._evenementSurFenetreCompetences,
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
		lFenetre.setDonnees({
			listeCompetences: this.devoir.evaluation
				? MethodesObjet_1.MethodesObjet.dupliquer(
						this.devoir.evaluation.listeCompetences,
					)
				: new ObjetListeElements_1.ObjetListeElements(),
			service: this.devoir.service,
			classe: this.applicationSco
				.getEtatUtilisateur()
				.Navigation.getRessource(Enumere_Ressource_1.EGenreRessource.Classe),
		});
	}
	evenementSurSuppressionEvaluationAssociee() {
		const lDevoir = this.devoir;
		if (
			!!lDevoir &&
			!!lDevoir.evaluation &&
			!!lDevoir.evaluation.listeCompetences
		) {
			const lEstCloturePourEvaluation =
				this.leDevoirEstSurUnePeriodeClotureePourEvaluation(lDevoir);
			if (!lEstCloturePourEvaluation) {
				this.applicationSco.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"FenetreDevoir.MsgConfirmSupprEval",
					),
					callback: function (aGenreAction) {
						if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
							lDevoir.evaluation.listeCompetences.parcourir((D) => {
								D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							});
						}
					},
				});
			} else {
				this.applicationSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.MsgSuppressionEvalImpossible",
						),
					});
			}
		}
	}
	_evenementSurFenetreCompetences(aGenreBouton, aListeCompetencesDEvaluation) {
		if (aGenreBouton === 1) {
			if (!this.devoir.evaluation) {
				this.devoir.evaluation = new ObjetElement_1.ObjetElement();
				this.devoir.evaluation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			}
			if (!!aListeCompetencesDEvaluation) {
				let lPosition = 0;
				aListeCompetencesDEvaluation.parcourir((D) => {
					if (!!D && D.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
						D.Position = lPosition;
						lPosition++;
					}
				});
				this.devoir.evaluation.listeCompetences = aListeCompetencesDEvaluation;
			}
			this.actualiserCompetencesEvaluees();
		}
	}
	evenementSurBtnAssocierKiosque() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
			{ pere: this, evenement: this.evenementSurFenetreRessourceKiosque },
		);
		const lGenresApi = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		lGenresApi.add(TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_EnvoiNote);
		lFenetre.afficherFenetre(lGenresApi);
	}
	evenementSurFenetreRessourceKiosque(aParams) {
		if (
			aParams.genreBouton === 1 &&
			!!aParams.selection &&
			aParams.selection.count() === 1
		) {
			const lElement = aParams.selection.getPremierElement();
			const lExecKiosque = new ObjetElement_1.ObjetElement(
				"",
				null,
				Enumere_Ressource_1.EGenreRessource.ExecutionDevoirKiosque,
			);
			lExecKiosque.ressource = lElement.ressource;
			this.devoir.execKiosque = lExecKiosque;
			this.devoir.execKiosque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			const lPremiereHeure = ObjetDate_1.GDate.placeEnDateHeure(0);
			const lDerniereHeure = ObjetDate_1.GDate.placeEnDateHeure(
				this.objetParametres.PlacesParJour - 1,
				true,
			);
			$.extend(this.devoir.execKiosque, {
				enCoursDAffectation: true,
				dateDebutPublication: new Date(
					this.devoir.date.setHours(
						lPremiereHeure.getHours(),
						lPremiereHeure.getMinutes(),
					),
				),
				dateFinPublication: new Date(
					this.devoir.date.setHours(
						lDerniereHeure.getHours(),
						lDerniereHeure.getMinutes(),
					),
				),
			});
			this.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.actualiser();
		}
	}
	evenementSurBtnAssocierQCM() {
		if (this.avecQCM && this.avecModifQCM) {
			new ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls(
				this,
				this.actionSurListeQCMCumuls,
			).lancerRequete();
		}
	}
	actualiserCategorieEvaluation() {
		new ObjetRequeteCategorieEvaluation_1.ObjetRequeteCategorieEvaluation(
			this,
			this._actionSurRequeteCategorie.bind(this),
		).lancerRequete();
	}
	getTailleMaxCommentaire() {
		return this.objetParametres.tailleCommentaireDevoir;
	}
	evenementSurBtnCategorie() {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_CategorieEvaluation_1.ObjetFenetre_CategorieEvaluation,
			{ pere: this, evenement: this._evenementCategorie.bind(this) },
		);
		lFenetre.setDonnees({
			listeCategories: this.listeCategories,
			avecMultiSelection: false,
			avecCreation: true,
			tailleMax: this.tailleMaxCategorie,
		});
	}
	_surRequeteListeCompetencesQCM(aJSON) {
		if (!!this.devoir.executionQCM && !!aJSON.listeCompetencesQCM) {
			this.devoir.executionQCM.listeCompetences = aJSON.listeCompetencesQCM;
			const lThis = this;
			this.$refreshSelf().then(() => {
				const lDonneesListeCompetencesQCM =
					new DonneesListe_EvaluationsQCM_1.DonneesListe_EvaluationsQCM(
						lThis.devoir.executionQCM.listeCompetences,
						{ getValeurMaxCoefficientCompetence: 100 },
					);
				lDonneesListeCompetencesQCM.setOptions({ avecSuppression: false });
				lThis
					.getInstance(lThis.identListeCompetencesQCM)
					.setDonnees(lDonneesListeCompetencesQCM);
				lThis.actualiser();
			});
		} else {
			this.actualiser();
		}
	}
	_actionSurRequeteCategorie(aParam) {
		this.listeCategories = aParam.listeCategories;
		this.tailleMaxCategorie = aParam.tailleMax;
		this.getInstance(this.idComboCategorie).setDonnees(this.listeCategories);
		this.devoir.categorie =
			!!this.devoir.categorie && this.devoir.categorie.existe()
				? this.listeCategories.getElementParLibelle(
						this.devoir.categorie.getLibelle(),
					)
				: undefined;
		const lIndex =
			!!this.listeCategories &&
			this.listeCategories.count() > 0 &&
			!!this.devoir.categorie
				? this.listeCategories.getIndiceParLibelle(
						this.devoir.categorie.getLibelle(),
					)
				: 0;
		this.getInstance(this.idComboCategorie).initSelection(lIndex);
	}
	_evenementCategorie(aParams) {
		if (
			!!aParams.categorieSelectionnee &&
			aParams.categorieSelectionnee.existe()
		) {
			this.devoir.categorie = aParams.categorieSelectionnee;
		}
		this.actualiserCategorieEvaluation();
	}
	_evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
		if (aGenreBouton === 1) {
			this.devoir.ListeThemes = aListeSelections;
			this.devoir.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_avecUnCommentaireSurNote(aDevoir) {
		let lResult = false;
		if (!aDevoir || !aDevoir.listeEleves) {
			return lResult;
		}
		aDevoir.listeEleves.parcourir((aEleve) => {
			if (aEleve.commentaire && aEleve.commentaire.length > 0) {
				lResult = true;
				return false;
			}
		});
		return lResult;
	}
}
exports.ObjetFenetre_DevoirPN = ObjetFenetre_DevoirPN;
