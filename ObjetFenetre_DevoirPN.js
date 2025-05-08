const { TypeDroits } = require("ObjetDroitsPN.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Devoir } = require("ObjetFenetre_Devoir.js");
const { ObjetElement } = require("ObjetElement.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { TypeNote } = require("TypeNote.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetFenetre_PanierRessourceKiosque,
} = require("ObjetFenetre_PanierRessourceKiosque.js");
const { ObjetRequeteListeQCMCumuls } = require("ObjetRequeteListeQCMCumuls.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const { ObjetFenetre_Competences } = require("ObjetFenetre_Competences.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { TypeFichierExterneHttpSco } = require("TypeFichierExterneHttpSco.js");
const {
	ObjetRequeteListeCompetencesQCM,
} = require("ObjetRequeteListeCompetencesQCM.js");
const {
	DonneesListe_EvaluationsQCM,
} = require("DonneesListe_EvaluationsQCM.js");
const {
	ObjetFenetre_CategorieEvaluation,
} = require("ObjetFenetre_CategorieEvaluation.js");
const {
	ObjetRequeteCategorieEvaluation,
} = require("ObjetRequeteCategorieEvaluation.js");
const {
	ObjetCelluleMultiSelectionThemes,
} = require("ObjetCelluleMultiSelectionThemes.js");
const { GDate } = require("ObjetDate.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const {
	UtilitaireGestionCloudEtPDF,
} = require("UtilitaireGestionCloudEtPDF.js");
const { ObjetFenetre_FichiersCloud } = require("ObjetFenetre_FichiersCloud.js");
class ObjetFenetre_DevoirPN extends ObjetFenetre_Devoir {
	constructor(...aParams) {
		super(...aParams);
		this.avecQCMCompetences = true;
		this.avecCategorieEvaluation = true;
		this.avecThemes = GApplication.parametresUtilisateur.get(
			"avecGestionDesThemes",
		);
		this.avecConsigneQCM = true;
		this.avecPersonnalisationProjetAccompagnement = true;
		this.avecModeCorrigeALaDate = true;
		this.avecMultipleExecutions = true;
		this.idCompetencesEvaluees = this.Nom + "_competencesEvaluees";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			CBRemarque: {
				getValue() {
					return (
						aInstance.devoir && aInstance.devoir.avecCommentaireSurNoteEleve
					);
				},
				async setValue(aValue) {
					if (aInstance.devoir) {
						if (!aValue && _avecUnCommentaireSurNote(aInstance.devoir)) {
							const lRes = await GApplication.getMessage().afficher({
								type: EGenreBoiteMessage.Confirmation,
								message: GTraductions.getValeur(
									"Notes.confirmationSupressionCommentaireSurNote",
								),
							});
							if (lRes === EGenreAction.Valider) {
								aInstance.devoir.avecCommentaireSurNoteEleve =
									!aInstance.devoir.avecCommentaireSurNoteEleve;
							}
							return;
						}
						aInstance.devoir.avecCommentaireSurNoteEleve =
							!aInstance.devoir.avecCommentaireSurNoteEleve;
					}
				},
			},
		});
	}
	initialiserDevoir() {
		this.regrouperPeriodes = false;
		this.avecSousMatiere = true;
		this.baremeAvecDecimales = true;
	}
	initialiserListeCompetencesQCM(aInstance) {
		aInstance.setOptionsListe(
			DonneesListe_EvaluationsQCM.getOptionsListe(false),
		);
	}
	evenementSurListeCompetencesQCM(aParametres) {
		switch (aParametres.genreEvenement) {
			case EGenreEvenementListe.ApresEdition:
				if (!!this.devoir && !!this.devoir.executionQCM) {
					this.devoir.executionQCM.setEtat(EGenreEtat.Modification);
				}
				break;
		}
	}
	addInstanceThemes() {
		this.identMultiSelectionTheme = this.add(
			ObjetCelluleMultiSelectionThemes,
			_evtCellMultiSelectionTheme.bind(this),
		);
	}
	getTitrePublic() {
		return this.devoir.service.classe.getNumero()
			? GTraductions.getValeur("FenetreDevoir.Classe")
			: GTraductions.getValeur("FenetreDevoir.Groupe");
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
			GParametres.avecAffichageDecalagePublicationNotesAuxParents &&
			!!GParametres.nbJDecalagePublicationAuxParents
		) {
			let lDatePublicationDecalee = GDate.formatDate(
				GDate.getJourSuivant(
					this.devoir.datePublication,
					GParametres.nbJDecalagePublicationAuxParents,
				),
				" %JJ/%MM",
			);
			if (GParametres.nbJDecalagePublicationAuxParents === 1) {
				lMessageDateDecaleeAuxParents = GTraductions.getValeur(
					"FenetreDevoir.DecalageUnJourPublicationParentsSoitLe",
					[lDatePublicationDecalee],
				);
			} else {
				lMessageDateDecaleeAuxParents = GTraductions.getValeur(
					"FenetreDevoir.DecalageXJoursPublicationParentsSoitLe",
					[
						GParametres.nbJDecalagePublicationAuxParents,
						lDatePublicationDecalee,
					],
				);
			}
		}
		return lMessageDateDecaleeAuxParents;
	}
	getEGenreSujet() {
		return TypeFichierExterneHttpSco.DevoirSujet;
	}
	getEGenreCorrige() {
		return TypeFichierExterneHttpSco.DevoirCorrige;
	}
	avecDepotCloud() {
		return GEtatUtilisateur.listeCloud.count() > 0;
	}
	ouvrirPJCloud(aParams) {
		const lThis = this;
		const lParamsDonnees = Object.assign(
			{
				instance: lThis,
				genre: TypeFichierExterneHttpSco.Aucun,
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
			modeGestion: UtilitaireGestionCloudEtPDF.modeGestion.Cloud,
		};
		UtilitaireGestionCloudEtPDF.creerFenetreGestion(lParams);
	}
	choisirFichierCloud(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				genre: TypeFichierExterneHttpSco.Aucun,
				listeElements: null,
				callback: null,
			},
			aParams,
		);
		return new Promise((aResolve) => {
			ObjetFenetre.creerInstanceFenetre(ObjetFenetre_FichiersCloud, {
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
			}).setDonnees({ service: lParams.service.Genre });
		});
	}
	getTailleMaxPieceJointe() {
		return GApplication.droits.get(TypeDroits.tailleMaxDocJointEtablissement);
	}
	composeCompetencesEvaluees() {
		const T = [];
		T.push(
			`<div class="flex-contain cols top-line m-top-xl" ie-display="competencesEvaluees.avecCompetencesClassique">`,
		);
		T.push(
			`  <div class="field-contain">\n                <ie-checkbox id="${this.Nom}_cbEvaluationAssociee" ie-model="cbEvaluationAssociee"><span ie-html="labelEvaluationAssociee"></span></ie-checkbox>\n              </div>`,
		);
		T.push(
			`  <div class="field-contain" ie-display="competencesEvaluees.estVisible">\n                <label>${GTraductions.getValeur("FenetreDevoir.CompetencesEvaluees")}</label>\n                <ie-bouton ie-model="competencesEvaluees.btnModifierCompetences">...</ie-bouton>\n              </div>\n              <div class="field-contain fixed-height" id="${this.idCompetencesEvaluees}"></div>\n            </div>`,
		);
		T.push(
			`<div class="flex-contain cols top-line" ie-display="competencesEvaluees.avecCompetencesDeQCM">`,
		);
		T.push(
			`  <div class="field-contain">\n                <ie-checkbox ie-model="cbEvaluationDuQCM">${GTraductions.getValeur("FenetreDevoir.GenererCompetencesQCM")}</ie-checkbox>\n              </div>\n              <div class="field-contain" id="${this.getInstance(this.identListeCompetencesQCM).getNom()}"></div>`,
		);
		T.push(
			`  <div class="field-contain">\n                <ie-checkbox ie-model="cbSansDoublon">${GTraductions.getValeur("FenetreDevoir.NeComptabiliserQuUnNiveauPourCompetencesIdentiques")}</ie-checkbox>\n              </div>`,
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
		GHtml.setHtml(this.idCompetencesEvaluees, T.join(""));
	}
	initFenetreSelectionQCM(aInstance) {
		UtilitaireQCM.initFenetreSelectionQCM(aInstance);
		aInstance.setGenreRessources({
			genreQCM: EGenreRessource.QCM,
			genreNiveau: EGenreRessource.Niveau,
			genreMatiere: EGenreRessource.Matiere,
			genreAucun: EGenreRessource.Aucune,
		});
	}
	evntSurSelectionQCM(aNumeroBouton, aEltQCM) {
		if (this.avecQCM && aNumeroBouton > 0) {
			UtilitaireQCM.surSelectionQCM(this.devoir, aEltQCM, {
				genreAucune: EGenreRessource.Aucune,
				genreExecQCM: EGenreRessource.ExecutionQCM,
			});
			const lExecution = this.devoir.executionQCM;
			if (
				lExecution !== null &&
				lExecution !== undefined &&
				lExecution.QCM !== null &&
				lExecution.QCM !== undefined
			) {
				this.devoir.bareme = new TypeNote(lExecution.QCM.nombreDePoints);
			} else {
				this.devoir.bareme = this.baremeService;
			}
			if (this.devoir.date !== null && this.devoir.date !== undefined) {
				if (this.avecDetailPublicationQCM) {
					const lPremiereHeure = GDate.placeEnDateHeure(0);
					const lDerniereHeure = GDate.placeEnDateHeure(
						GParametres.PlacesParJour - 1,
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
					UtilitaireQCM.verifierDateCorrection(this.devoir.executionQCM);
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
		new ObjetRequeteListeCompetencesQCM(
			this,
			_surRequeteListeCompetencesQCM.bind(this),
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
		const H = [];
		H.push(
			`<ie-checkbox ie-model="CBRemarque">${GTraductions.getValeur("FenetreDevoir.activerCommentaireSurNotes")}</ie-checkbox>`,
		);
		return H.join("");
	}
	_estUnGroupe(aClasse) {
		return aClasse && aClasse.getGenre() === EGenreRessource.Groupe;
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
	evenementSurBtnCompetencesEvaluees() {
		const lEstCloturePourEvaluation =
			this.leDevoirEstSurUnePeriodeClotureePourEvaluation(this.devoir);
		if (
			!lEstCloturePourEvaluation &&
			this.devoir.service.avecSaisieEvaluation
		) {
			const lFenetre = ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Competences,
				{
					pere: this,
					evenement: this._evenementSurFenetreCompetences,
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: GTraductions.getValeur(
								"competences.choixCompetencesConnaissancesAEvaluer",
							),
							largeur: 620,
							hauteur: 420,
							listeBoutons: [
								GTraductions.getValeur("Annuler"),
								GTraductions.getValeur("Valider"),
							],
						});
					},
				},
			);
			lFenetre.setDonnees({
				listeCompetences: this.devoir.evaluation
					? MethodesObjet.dupliquer(this.devoir.evaluation.listeCompetences)
					: new ObjetListeElements(),
				service: this.devoir.service,
				classe: GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Classe,
				),
			});
		} else {
			if (lEstCloturePourEvaluation) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur(
						"FenetreDevoir.MsgModificationCompetencesImpossible",
					),
				});
			} else if (!this.devoir.service.avecSaisieEvaluation) {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur(
						"FenetreDevoir.MsgModificationCompetencesImpossibleProfDifferent",
					),
				});
			}
		}
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
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Confirmation,
					message: GTraductions.getValeur("FenetreDevoir.MsgConfirmSupprEval"),
					callback: function (aGenreAction) {
						if (aGenreAction === EGenreAction.Valider) {
							lDevoir.evaluation.listeCompetences.parcourir((D) => {
								D.setEtat(EGenreEtat.Suppression);
							});
						}
					},
				});
			} else {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur(
						"FenetreDevoir.MsgSuppressionEvalImpossible",
					),
				});
			}
		}
	}
	_evenementSurFenetreCompetences(aGenreBouton, aListeCompetencesDEvaluation) {
		if (aGenreBouton === 1) {
			if (!this.devoir.evaluation) {
				this.devoir.evaluation = new ObjetElement();
				this.devoir.evaluation.setEtat(EGenreEtat.Creation);
			}
			if (!!aListeCompetencesDEvaluation) {
				let lPosition = 0;
				aListeCompetencesDEvaluation.parcourir((D) => {
					if (!!D && D.getEtat() !== EGenreEtat.Suppression) {
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
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PanierRessourceKiosque,
			{ pere: this, evenement: this.evenementSurFenetreRessourceKiosque },
		);
		const lGenresApi = new TypeEnsembleNombre();
		lGenresApi.add(TypeGenreApiKiosque.Api_EnvoiNote);
		lFenetre.afficherFenetre(lGenresApi);
	}
	evenementSurFenetreRessourceKiosque(aParams) {
		if (
			aParams.genreBouton === 1 &&
			!!aParams.selection &&
			aParams.selection.count() === 1
		) {
			const lElement = aParams.selection.getPremierElement();
			const lExecKiosque = new ObjetElement(
				"",
				null,
				EGenreRessource.ExecutionDevoirKiosque,
			);
			lExecKiosque.ressource = lElement.ressource;
			this.devoir.execKiosque = lExecKiosque;
			this.devoir.execKiosque.setEtat(EGenreEtat.Creation);
			const lPremiereHeure = GDate.placeEnDateHeure(0);
			const lDerniereHeure = GDate.placeEnDateHeure(
				GParametres.PlacesParJour - 1,
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
			this.devoir.setEtat(EGenreEtat.Modification);
			this.actualiser();
		}
	}
	evenementSurBtnAssocierQCM() {
		if (this.avecQCM && this.avecModifQCM) {
			new ObjetRequeteListeQCMCumuls(
				this,
				this.actionSurListeQCMCumuls,
			).lancerRequete();
		}
	}
	actualiserCategorieEvaluation() {
		const lParam = {
			classe: this.devoir.service.classe,
			service: this.devoir.service,
		};
		new ObjetRequeteCategorieEvaluation(
			this,
			_actionSurRequeteCategorie.bind(this),
		).lancerRequete(lParam);
	}
	getTailleMaxCommentaire() {
		return GParametres.tailleCommentaireDevoir;
	}
	evenementSurBtnCategorie() {
		const lFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_CategorieEvaluation,
			{ pere: this, evenement: _evenementCategorie.bind(this) },
		);
		lFenetre.setDonnees({
			listeCategories: this.listeCategories,
			avecMultiSelection: false,
			avecCreation: true,
			tailleMax: this.tailleMaxCategorie,
		});
	}
}
function _surRequeteListeCompetencesQCM(aJSON) {
	if (!!this.devoir.executionQCM && !!aJSON.listeCompetencesQCM) {
		this.devoir.executionQCM.listeCompetences = aJSON.listeCompetencesQCM;
		const lThis = this;
		this.$refreshSelf().then(() => {
			const lDonneesListeCompetencesQCM = new DonneesListe_EvaluationsQCM(
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
function _actionSurRequeteCategorie(aParam) {
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
function _evenementCategorie(aParams) {
	if (
		!!aParams.categorieSelectionnee &&
		aParams.categorieSelectionnee.existe()
	) {
		this.devoir.categorie = aParams.categorieSelectionnee;
	}
	this.actualiserCategorieEvaluation();
}
function _evtCellMultiSelectionTheme(aGenreBouton, aListeSelections) {
	if (aGenreBouton === 1) {
		this.devoir.ListeThemes = aListeSelections;
		this.devoir.setEtat(EGenreEtat.Modification);
	}
}
function _avecUnCommentaireSurNote(aDevoir) {
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
module.exports = { ObjetFenetre_DevoirPN };
