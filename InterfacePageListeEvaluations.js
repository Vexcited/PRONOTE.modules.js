const { MethodesObjet } = require("MethodesObjet.js");
const { GUID } = require("GUID.js");
const { GHtml } = require("ObjetHtml.js");
const { GPosition } = require("ObjetPosition.js");
const { GStyle } = require("ObjetStyle.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetSaisie } = require("ObjetSaisie.js");
const { GTraductions } = require("ObjetTraduction.js");
const { DonneesListe_Evaluations } = require("DonneesListe_Evaluations.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { InterfacePage } = require("InterfacePage.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const {
	ObjetFenetre_ParamListeEvaluations,
} = require("ObjetFenetre_ParamListeEvaluations.js");
const { ObjetFenetre_Evaluation } = require("ObjetFenetre_Evaluation.js");
const {
	ObjetFenetre_SelectionClasseGroupe,
} = require("ObjetFenetre_SelectionClasseGroupe.js");
const {
	ObjetFenetre_SelectionServicesDEvaluation,
} = require("ObjetFenetre_SelectionServicesDEvaluation.js");
const {
	ObjetRequeteListeEvaluations,
} = require("ObjetRequeteListeEvaluations.js");
const {
	ObjetRequeteListeRessourcesDEvalPourDuplication,
} = require("ObjetRequeteListeRessourcesDEvalPourDuplication.js");
const {
	ObjetRequeteListeServicesDEvalPourRemplacement,
} = require("ObjetRequeteListeServicesDEvalPourRemplacement.js");
const {
	ObjetRequeteSaisieEvaluations,
} = require("ObjetRequeteSaisieEvaluations.js");
const { ObjetUtilitaireEvaluation } = require("ObjetUtilitaireEvaluation.js");
const { TypeHttpPeriode } = require("TypeHttpPeriode.js");
const { TUtilitaireCompetences } = require("UtilitaireCompetences.js");
const {
	TypeGenreValidationCompetence,
} = require("TypeGenreValidationCompetence.js");
const {
	InterfaceCompetencesParEvaluation,
	EGenreEvenementCompetencesParEvaluation,
} = require("InterfaceCompetencesParEvaluation.js");
const { ObjetHint } = require("ObjetHint.js");
const { ObjetRequeteListeServices } = require("ObjetRequeteListeServices.js");
const {
	DonneesListe_ServicesEvaluationsPrim,
} = require("DonneesListe_ServicesEvaluationsPrim.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { ObjetFenetre_EvaluationQCM } = require("ObjetFenetre_EvaluationQCM.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { ObjetRequeteListeQCMCumuls } = require("ObjetRequeteListeQCMCumuls.js");
const { ObjetFenetre_SelectionQCM } = require("ObjetFenetre_SelectionQCM.js");
const { UtilitaireQCM } = require("UtilitaireQCM.js");
const {
	ObjetRequeteSaisieQCMEvaluation,
} = require("ObjetRequeteSaisieQCMEvaluation.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { UtilitaireBoutonBandeau } = require("UtilitaireBoutonBandeau.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const {
	TypeAffichageTitreColonneCompetence,
} = require("ObjetFenetre_ParamListeEvaluations.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
class InterfacePageListeEvaluations extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.selectionEvaluation = {};
		this.afficheUniquementMesEvaluations = true;
		if (GEtatUtilisateur.competences_modeSaisieClavierVertical === undefined) {
			GEtatUtilisateur.competences_modeSaisieClavierVertical = true;
		}
		this.avecGestionNotation = GApplication.droits.get(
			TypeDroits.fonctionnalites.gestionNotation,
		);
		this.idContainerListeEvaluations = GUID.getId();
	}
	construireInstances() {
		if (_estOngletSaisieEvaluation()) {
			this.identTripleCombo = this.add(
				ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				this.initialiserTripleCombo,
			);
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		} else {
			this.identSelecteurPeriode = this.add(
				ObjetSaisie,
				_evenementSurSelectionPeriode.bind(this),
				_initialiserSelectionPeriode,
			);
			if (!_estOngletEvaluationHistorique()) {
				this.identComboClasseGroupeNiv = this.add(
					ObjetSaisie,
					_evenementSurSelectionClasseGroupeNiv.bind(this),
					_initialiserSelectionClasseGroupeNiv,
				);
			}
		}
		this.identFenetreOptionsAffichage = this.addFenetre(
			ObjetFenetre_ParamListeEvaluations,
			_evntFenetreParamListeEvaluations.bind(this),
			_initFenetreParamListeEvaluations,
		);
		if (GEtatUtilisateur.pourPrimaire() && _estOngletSaisieEvaluation()) {
			this.identListeServices = this.add(
				ObjetListe,
				_evenementSurListeServices.bind(this),
				_initialiserListeServices,
			);
		}
		this.identListeEvaluations = this.add(
			ObjetListe,
			_evenementSurListeEvaluations.bind(this),
		);
		this.identFenetreEvaluation = this.add(
			ObjetFenetre_Evaluation,
			this.evenementSurFenetreEvaluation,
			_initialiserFenetreEvaluation,
		);
		this.identFenetreSelectionServiceDEvaluation = this.addFenetre(
			ObjetFenetre_SelectionServicesDEvaluation,
			this.evenementSurSelectionServiceDEvaluation,
		);
		if (GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement) {
			this.identFenetreSelectionClasseGroupe = this.addFenetre(
				ObjetFenetre_SelectionClasseGroupe,
				this.evenementSurSelectionClasseGroupe,
				_initialiserFenetreSelectionClasseGroupe,
			);
		}
		this.identCompetencesParEvaluation = this.add(
			InterfaceCompetencesParEvaluation,
			this._evenementSurCompetencesParEvaluation,
			_initialiserCompetencesParEvaluation,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getInfoCloture: function () {
				return aInstance.strInfoCloture ? aInstance.strInfoCloture : "";
			},
			cbUniquementMesEvaluations: {
				getValue() {
					return aInstance.afficheUniquementMesEvaluations;
				},
				setValue(aValue) {
					aInstance.afficheUniquementMesEvaluations = aValue;
					aInstance
						.getInstance(aInstance.identListeEvaluations)
						.getDonneesListe()
						.setUniquementMesEvaluations(
							aInstance.afficheUniquementMesEvaluations,
						);
					aInstance
						.getInstance(aInstance.identListeEvaluations)
						.actualiser(true);
				},
			},
			btnParametrage: {
				event() {
					const lOptionsAffichage = aInstance
						.getInstance(aInstance.identCompetencesParEvaluation)
						.getOptionsAffichageListe();
					const lFenetreOptionsAffichage = aInstance.getInstance(
						aInstance.identFenetreOptionsAffichage,
					);
					lFenetreOptionsAffichage.setDonnees({
						avecOptionAfficherProjetsAcc:
							lOptionsAffichage.avecOptionAfficherProjetsAcc,
						afficherProjetsAccompagnement:
							lOptionsAffichage.afficherProjetsAccompagnement,
						afficherPourcentageReussite:
							lOptionsAffichage.afficherPourcentageReussite,
						typeAffichageTitreColonneCompetence:
							lOptionsAffichage.typeAffichageTitreColonneCompetence,
						hintPourcentageReussite: aInstance.hintOptionPourcentageReussite,
					});
					lFenetreOptionsAffichage.afficher();
				},
				getTitle() {
					return GTraductions.getValeur("evaluations.parametresAffichage");
				},
				getSelection() {
					return aInstance
						.getInstance(aInstance.identFenetreOptionsAffichage)
						.estAffiche();
				},
			},
			btnMrFiche: {
				event() {
					const lElement = this.node;
					TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise({
						genreChoixValidationCompetence:
							TypeGenreValidationCompetence.tGVC_EvaluationEtItem,
						callback: function () {
							GHtml.setFocus(lElement);
						},
					});
				},
				getTitle() {
					return GTraductions.getValeur(
						"competences.TitreAideSaisieNivMaitrise",
					);
				},
			},
			btnHV: {
				event() {
					const lTexte = GEtatUtilisateur.competences_modeSaisieClavierVertical
						? GTraductions.getValeur("competences.HintSaisieHorizontale")
						: GTraductions.getValeur("competences.HintSaisieVerticale");
					ObjetHint.start(lTexte, {
						sansDelai: true,
						delaiFermeture: 1500,
						position: {
							x:
								GPosition.getLeft(this.node) +
								GPosition.getWidth(this.node) -
								20,
							y: GPosition.getTop(this.node),
						},
					});
					GEtatUtilisateur.competences_modeSaisieClavierVertical =
						!GEtatUtilisateur.competences_modeSaisieClavierVertical;
				},
				getSelection() {
					return GEtatUtilisateur.competences_modeSaisieClavierVertical;
				},
				getTitle() {
					return GEtatUtilisateur.competences_modeSaisieClavierVertical
						? GTraductions.getValeur("competences.SensDeSaisieHorizontal")
						: GTraductions.getValeur("competences.SensDeSaisieVertical");
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau.getClassesMixIconSaisieHorizontalVertical(
						GEtatUtilisateur.competences_modeSaisieClavierVertical,
					);
				},
			},
			btnCreationEvaluationPrimaire: {
				event() {
					_surEvenementCreationEvaluation.call(aInstance);
				},
				getDisabled() {
					return !aInstance.avecSaisie;
				},
			},
		});
	}
	initialiserTripleCombo(aInstance) {
		if (
			GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement ||
			GEtatUtilisateur.pourPrimaire()
		) {
			aInstance.setParametres([
				EGenreRessource.Classe,
				EGenreRessource.Periode,
			]);
		} else {
			aInstance.setParametres([
				EGenreRessource.Classe,
				EGenreRessource.Periode,
				EGenreRessource.Service,
			]);
		}
	}
	initialiserListeEvaluations(aInstance) {
		aInstance.setOptionsListe({
			colonnes: getColonnesListeEvaluations.call(this),
			listeCreations: _estOngletSaisieEvaluation() ? 0 : null,
			avecLigneCreation:
				!GEtatUtilisateur.pourPrimaire() &&
				_estOngletSaisieEvaluation() &&
				!!this.avecSaisie,
			titreCreation: GTraductions.getValeur(
				"evaluations.CliquezPourCreerEvaluation",
			),
			alternanceCouleurLigneContenu: false,
			scrollHorizontal: !GEtatUtilisateur.pourPrimaire(),
			avecScrollEnTactileH: true,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: 0,
			identifiant: "listeEvaluations",
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identCompetencesParEvaluation;
		this.GenreStructure = EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		if (_estOngletSaisieEvaluation()) {
			this.AddSurZone.push(this.identTripleCombo);
			this.AddSurZone.push({
				html: '<span ie-html = "getInfoCloture"></span>',
			});
		} else {
			this.AddSurZone.push(this.identSelecteurPeriode);
			if (!_estOngletEvaluationHistorique()) {
				this.AddSurZone.push(this.identComboClasseGroupeNiv);
			}
			this.AddSurZone.push({ separateur: true });
		}
		this.AddSurZone.push({ blocGauche: true });
		this.addSurZonePhotoEleve();
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnSaisieHorizontalVertical("btnHV"),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche("btnMrFiche"),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau.getHtmlBtnParametrer("btnParametrage"),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	construireStructureAffichageAutre() {
		const lHTML = [];
		const lHeightListeEvals = !!this.identListeServices
			? "calc(100% - 70px - 5px)"
			: "100%";
		const lStyleFlexListe = GApplication.estPrimaire
			? "flex: 10 1 45rem;"
			: GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ListeEvaluation
				? "flex: 70 1 60rem;"
				: "flex: 60 1 50rem;";
		const lZoneListeEvaluations = [];
		lZoneListeEvaluations.push(
			'<div id="',
			this.idContainerListeEvaluations,
			'" style="',
			lStyleFlexListe,
			' display: none;" class="InlineBlock">',
		);
		if (!!this.identListeServices) {
			lZoneListeEvaluations.push(
				'<div class="MargeBas">',
				'<ie-bouton class="AlignementMilieuVertical bouton-carre" ie-model="btnCreationEvaluationPrimaire" ie-icon="icon_nouvelles_evals" ie-iconsize="2.1rem">',
				GTraductions.getValeur("evaluations.CreerEvaluation"),
				"</ie-bouton>",
				"</div>",
			);
		}
		lZoneListeEvaluations.push(
			'<div id="',
			this.getInstance(this.identListeEvaluations).getNom(),
			'" style="height: ',
			lHeightListeEvals,
			';"></div>',
		);
		lZoneListeEvaluations.push("</div>");
		lHTML.push(
			'<div class="p-all flex-contain full-height flex-gap">',
			!!this.identListeServices
				? '<div id="' +
						this.getInstance(this.identListeServices).getNom() +
						'" style="flex: 1 0 30rem; display:none;" class="InlineBlock">&nbsp;</div>'
				: "",
			lZoneListeEvaluations.join(""),
			'<div id="',
			this.getInstance(this.identCompetencesParEvaluation).getNom(),
			'" style="flex: 50 1 50rem; display:none;" class="InlineBlock"></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	recupererDonnees() {
		if (!_estOngletSaisieEvaluation()) {
			this.getInstance(this.identSelecteurPeriode).focusSurPremierElement();
			this.afficherPage();
		}
	}
	evenementSurDernierMenuDeroulant(aClasse, aPeriode, aService) {
		if (GEtatUtilisateur.pourPrimaire()) {
			const lThis = this;
			const lClasseGroupeSelectionne = GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Classe,
			);
			new ObjetRequeteListeServices(this, (aListeServices) => {
				GStyle.setDisplay(
					lThis.getInstance(lThis.identListeServices).getNom(),
					true,
				);
				const lListeAReselect = new ObjetListeElements();
				lListeAReselect.addElement(
					GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service),
				);
				const lColonnesCachees = [];
				if (
					lClasseGroupeSelectionne &&
					lClasseGroupeSelectionne.getGenre() !== 0
				) {
					lColonnesCachees.push(
						DonneesListe_ServicesEvaluationsPrim.colonnes.classeGroupe,
					);
				}
				lThis
					.getInstance(lThis.identListeServices)
					.setOptionsListe({ colonnesCachees: lColonnesCachees });
				lThis
					.getInstance(lThis.identListeServices)
					.setDonnees(
						new DonneesListe_ServicesEvaluationsPrim(aListeServices),
						null,
						{ listeElementsSelection: lListeAReselect },
					);
				if (
					lThis
						.getInstance(lThis.identListeServices)
						.getListeElementsSelection()
						.count() === 0
				) {
					lThis.evenementAfficherMessageDepuisListeServices(
						EGenreMessage.SelectionMatiere,
					);
				}
			}).lancerRequete(
				GEtatUtilisateur.getUtilisateur(),
				lClasseGroupeSelectionne,
				GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode),
			);
		} else {
			this._surSelectionServices(aService);
		}
	}
	_surSelectionServices(aService) {
		this.Service = aService;
		_desactiverPhotoEleve.call(this);
		GStyle.setDisplay(this.idContainerListeEvaluations, true);
		this.afficherPage();
		this.surResizeInterface();
	}
	afficherPage(aNumeroEvaluationCreee) {
		this.setEtatSaisie(false);
		if (
			[
				EGenreEspace.Professeur,
				EGenreEspace.PrimProfesseur,
				EGenreEspace.PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			const lThis = this;
			const lJSON = {};
			if (
				[EGenreEspace.PrimProfesseur, EGenreEspace.PrimDirection].includes(
					GEtatUtilisateur.GenreEspace,
				)
			) {
				lJSON.service = GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Service,
				);
			}
			new ObjetRequeteListeQCMCumuls(this, (aListeQCM) => {
				lThis.listeQCMDisponibles = aListeQCM;
				lancerRequeteListeEvaluations.call(lThis, aNumeroEvaluationCreee);
			}).lancerRequete(lJSON);
		} else {
			lancerRequeteListeEvaluations.call(this);
		}
	}
	callbackMenuContextuel(aCommande, aEvaluation) {
		switch (aCommande) {
			case DonneesListe_Evaluations.commandeMenuContextuel.dupliquer:
				_dupliquerEvaluation.call(this, aEvaluation);
				break;
		}
	}
	ouvrirFenetreDupliquerSurClassesGroupes(aListeClasses) {
		this.selectionEvaluation.evaluation.listeClasses = aListeClasses;
		this.listeClassesGroupesSelection = new ObjetListeElements();
		this.getInstance(this.identFenetreSelectionClasseGroupe).setDonnees({
			listeRessources: aListeClasses,
			listeRessourcesSelectionnees: this.listeClassesGroupesSelection,
		});
	}
	ouvrirFenetreDupliquerSurServices(aListeServices) {
		this.selectionEvaluation.evaluation.listeServices = aListeServices;
		this.getInstance(this.identFenetreSelectionServiceDEvaluation).setDonnees(
			aListeServices,
			true,
			!GEtatUtilisateur.pourPrimaire(),
		);
	}
	afficherListeEvaluations(aPeriode, aNumeroEvaluationCreee) {
		this.initialiserListeEvaluations(
			this.getInstance(this.identListeEvaluations),
		);
		const lOldListeSelections = this.getInstance(
			this.identListeEvaluations,
		).getListeElementsSelection();
		const lSelectionClasseGroupeNiv =
			GEtatUtilisateur.getOnglet().ClasseGroupeNivSelection;
		const lFiltreClasseGroupeNiv =
			!lSelectionClasseGroupeNiv ||
			lSelectionClasseGroupeNiv.getGenre() === EGenreRessource.Aucune
				? null
				: lSelectionClasseGroupeNiv;
		this.getInstance(this.identListeEvaluations).setDonnees(
			new DonneesListe_Evaluations(this.listeEvaluations, {
				estOngletHistorique: _estOngletEvaluationHistorique(),
				periode: aPeriode,
				ClasseGroupeNiveau: lFiltreClasseGroupeNiv,
				avecMenuContextuelCreer:
					_estOngletSaisieEvaluation() && this.avecSaisie,
				avecMenuContextuelDupliquer:
					GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.ListeEvaluation ||
					_estOngletEvaluationHistorique() ||
					GEtatUtilisateur.pourPrimaire(),
				afficheUniquementMesEvaluations:
					GEtatUtilisateur.getGenreOnglet() !== EGenreOnglet.Evaluation
						? this.afficheUniquementMesEvaluations
						: false,
				callbackMenuContextuel: this.callbackMenuContextuel.bind(this),
				avecGestionNotation: this.avecGestionNotation,
			}),
		);
		let lListeSelections = new ObjetListeElements();
		let lEvaluationASelectionnee;
		if (!!aNumeroEvaluationCreee && this.listeEvaluations) {
			lEvaluationASelectionnee = this.listeEvaluations.getElementParNumero(
				aNumeroEvaluationCreee,
			);
			if (!!lEvaluationASelectionnee) {
				lListeSelections.addElement(lEvaluationASelectionnee);
			}
		}
		if (lListeSelections.count() === 0) {
			lListeSelections = lOldListeSelections;
		}
		if (lListeSelections.count() > 0) {
			this.getInstance(this.identListeEvaluations).setListeElementsSelection(
				lListeSelections,
				{ avecEvenement: true, avecScroll: true },
			);
			lListeSelections = this.getInstance(
				this.identListeEvaluations,
			).getListeElementsSelection();
		}
		if (lListeSelections.count() === 0) {
			this.selectionEvaluation.evaluation = null;
			Invocateur.evenement(
				ObjetInvocateur.events.activationImpression,
				EGenreImpression.Aucune,
			);
			this._messageSelectionnerEvaluation();
		}
	}
	_evenementSurCompetencesParEvaluation(aGenre) {
		switch (aGenre) {
			case EGenreEvenementCompetencesParEvaluation.selectionEleve:
				this.surSelectionEleve();
				break;
			case EGenreEvenementCompetencesParEvaluation.editerCompetence:
				this._actualiseJaugeEvaluation(this.selectionEvaluation.evaluation);
				this.saisieUnitaire();
				this.getInstance(this.identListeEvaluations).actualiser(true);
				break;
			case EGenreEvenementCompetencesParEvaluation.editionNote:
				this.saisieUnitaire();
				break;
		}
	}
	actualiserImpressionPDF() {
		if (
			!_estOngletEvaluationHistorique() &&
			this.selectionEvaluation.evaluation
		) {
			Invocateur.evenement(
				ObjetInvocateur.events.activationImpression,
				EGenreImpression.GenerationPDF,
				this,
				this._getParametresPDF.bind(this),
			);
		} else {
			Invocateur.evenement(
				ObjetInvocateur.events.activationImpression,
				EGenreImpression.Aucune,
			);
		}
	}
	_getParametresPDF() {
		let lPeriode;
		if (_estOngletSaisieEvaluation()) {
			lPeriode = GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Periode,
			);
		} else {
			lPeriode = GEtatUtilisateur.getOnglet().periodeSelection
				? GEtatUtilisateur.getOnglet().periodeSelection.periodeNotation
				: null;
		}
		const lOptionsAffichageListe = this.getInstance(
			this.identCompetencesParEvaluation,
		).getOptionsAffichageListe();
		return {
			genreGenerationPDF: TypeHttpGenerationPDFSco.Evaluation,
			evaluation: this.selectionEvaluation.evaluation,
			periode: lPeriode,
			afficherProjetsAccompagnement:
				lOptionsAffichageListe.avecOptionAfficherProjetsAcc &&
				lOptionsAffichageListe.afficherProjetsAccompagnement,
			afficherPourcentageReussite:
				lOptionsAffichageListe.afficherPourcentageReussite,
			afficherLibelle:
				lOptionsAffichageListe.typeAffichageTitreColonneCompetence ===
				TypeAffichageTitreColonneCompetence.AffichageLibelle,
		};
	}
	surSelectionEvaluation(aListePiliers, aListeServicesLVE) {
		this.selectionEvaluation.evaluation.listePiliers = aListePiliers;
		this.selectionEvaluation.evaluation.listeServicesLVE = aListeServicesLVE;
		const lEvaluation = this.selectionEvaluation.evaluation;
		this.getInstance(this.identCompetencesParEvaluation).setParametres({
			hauteurAdapteContenu: false,
		});
		this.getInstance(this.identCompetencesParEvaluation).setDonnees({
			evaluation: lEvaluation,
			droitSaisieNotes: this.droitSaisieNotes,
			classe: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe),
		});
	}
	_actualiseJaugeEvaluation(aEvaluation) {
		if (aEvaluation) {
			const lTousNiveauxDAcquisition = new ObjetListeElements();
			if (aEvaluation.listeEleves) {
				for (let i = 0; i < aEvaluation.listeEleves.count(); i++) {
					const lEleve = aEvaluation.listeEleves.get(i);
					for (let j = 0; j < lEleve.listeCompetences.count(); j++) {
						const lCompetence = lEleve.listeCompetences.get(j);
						if (
							lCompetence.existe() &&
							lCompetence.niveauDAcquisition &&
							lCompetence.niveauDAcquisition.getNumero()
						) {
							lTousNiveauxDAcquisition.addElement(
								lCompetence.niveauDAcquisition,
							);
						}
					}
				}
			}
			aEvaluation.nbSaisiCompetences = lTousNiveauxDAcquisition.count();
			aEvaluation.resultats =
				TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
					lTousNiveauxDAcquisition,
				);
			aEvaluation.hintResultats =
				TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
					aEvaluation.resultats,
				);
			aEvaluation.moyenneResultats =
				TUtilitaireCompetences.getMoyenneBarreNiveauDAcquisition(
					aEvaluation.resultats,
				);
		}
	}
	afficherFenetreEvaluation(aEnCreation) {
		const lEvaluation = this.selectionEvaluation.evaluation
			? MethodesObjet.dupliquer(this.selectionEvaluation.evaluation)
			: creerEvaluationVide.call(this);
		if (
			this.selectionEvaluation.genreEvenement === EGenreEvenementListe.Edition
		) {
			ObjetUtilitaireEvaluation.calculerAvecEvaluation(
				lEvaluation,
				lEvaluation.listePiliers,
			);
		}
		let lTitreFenetre;
		if (aEnCreation) {
			lTitreFenetre = GTraductions.getValeur("evaluations.CreerEvaluation");
		} else {
			lTitreFenetre = GTraductions.getValeur("evaluations.ModifierEvaluation");
		}
		this.getInstance(this.identFenetreEvaluation).setOptionsFenetre({
			titre: lTitreFenetre,
		});
		this.getInstance(this.identFenetreEvaluation).setDonnees(
			lEvaluation,
			lEvaluation.listeServicesLVE,
			lEvaluation.listePeriodes,
			{
				avecSelectionPeriodeSecondaire: !GEtatUtilisateur.pourPrimaire(),
				avecCreationNouvelleCompetence: GEtatUtilisateur.pourPrimaire(),
				avecDuplicationCompetence: !GEtatUtilisateur.pourPrimaire(),
				avecDoublonCompetencesInterdit: false,
				listeReferentielsUniques: this.listeReferentielsUniques,
			},
		);
	}
	afficheFenetreCreationEvaluationQCM() {
		const lServiceEvaluation = GEtatUtilisateur.Navigation.getRessource(
			EGenreRessource.Service,
		);
		const lThis = this;
		const lFenetreChoixQCMAvecCompetences = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionQCM,
			{
				pere: this,
				evenement: function (aNumeroBouton, aQCM) {
					if (aNumeroBouton === 1) {
						if (_QCMEstCompatibleAvecLeService(aQCM, lServiceEvaluation)) {
							const lPeriodeSelectionnee =
								GEtatUtilisateur.Navigation.getRessource(
									EGenreRessource.Periode,
								);
							const lEvaluationVide =
								ObjetUtilitaireEvaluation.creerNouvelleEvaluationQCM(
									aQCM,
									lServiceEvaluation,
									lPeriodeSelectionnee,
								);
							lThis.afficheFenetreModificationEvaluationQCM(
								lEvaluationVide,
								true,
							);
						} else {
							GApplication.getMessage().afficher({
								type: EGenreBoiteMessage.Information,
								message: GTraductions.getValeur(
									"evaluations.FenetreEvaluationQCM.QCMSelectionneNonCompatiblePourService",
								),
							});
						}
					}
				},
				initialiser: function (aInstance) {
					UtilitaireQCM.initFenetreSelectionQCM(aInstance);
					aInstance.setGenreRessources({
						genreQCM: EGenreRessource.QCM,
						genreNiveau: EGenreRessource.Niveau,
						genreMatiere: EGenreRessource.Matiere,
						genreAucun: EGenreRessource.Aucune,
					});
				},
			},
		);
		let lExisteAuMoinsUnQCMCompatible = false;
		if (!!this.listeQCMDisponibles) {
			this.listeQCMDisponibles.parcourir((D) => {
				if (_QCMEstCompatibleAvecLeService(D, lServiceEvaluation)) {
					lExisteAuMoinsUnQCMCompatible = true;
					return false;
				}
			});
		}
		if (lExisteAuMoinsUnQCMCompatible) {
			lFenetreChoixQCMAvecCompetences.setDonnees(this.listeQCMDisponibles);
		} else {
			GApplication.getMessage().afficher({
				type: EGenreBoiteMessage.Information,
				message: GTraductions.getValeur(
					"evaluations.FenetreEvaluationQCM.AucunQCMCompatible",
				),
			});
		}
	}
	afficheFenetreModificationEvaluationQCM(aEvaluation, aAvecChoixQCM) {
		aEvaluation.avecDevoir =
			!!aEvaluation.devoir && aEvaluation.devoir.existe();
		const lThis = this;
		const lTitre =
			aEvaluation.Etat !== EGenreEtat.Creation
				? GTraductions.getValeur(
						"SaisieQCM.FenetreAssocEvaluation.ModifierEvaluation",
					)
				: GTraductions.getValeur(
						"SaisieQCM.FenetreAssocEvaluation.CreerEvaluation",
					);
		const lFenetreEvaluationQCM = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_EvaluationQCM,
			{
				pere: this,
				evenement: function (aGenreBouton, aEvaluationFenetre) {
					if (aGenreBouton === 1) {
						lThis.setEtatSaisie(true);
						aEvaluationFenetre.setEtat(EGenreEtat.Modification);
						new ObjetRequeteSaisieQCMEvaluation(
							lThis,
							_surSaisieEvaluations.bind(lThis),
						).lancerRequete({ evaluation: aEvaluationFenetre });
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({ titre: lTitre });
				},
			},
		);
		lFenetreEvaluationQCM.setDonnees({
			evaluation: aEvaluation,
			avecChoixQCM: !!aAvecChoixQCM,
		});
	}
	synchroniserSujetEtCorrige(aEval) {
		const lSujet = aEval.listeSujets.get(0);
		if (lSujet) {
			lSujet.setNumero(aEval.getNumero());
			this.listeSujets.addElement(
				lSujet,
				this.listeSujets.getIndiceParNumeroEtGenre(aEval.getNumero()),
			);
		}
		const lCorrige = aEval.listeCorriges.get(0);
		if (lCorrige) {
			lCorrige.setNumero(aEval.getNumero());
			this.listeCorriges.addElement(
				lCorrige,
				this.listeCorriges.getIndiceParNumeroEtGenre(aEval.getNumero()),
			);
		}
	}
	evenementSurFenetreEvaluation(aGenreBouton, aEvaluation) {
		if (aGenreBouton === 1) {
			this.setEtatSaisie(true);
			aEvaluation.setEtat(
				this.selectionEvaluation.genreEvenement ===
					EGenreEvenementListe.Creation
					? EGenreEtat.Creation
					: EGenreEtat.Modification,
			);
			const lIndice = this.listeEvaluations.getIndiceParNumeroEtGenre(
				aEvaluation.getNumero(),
				aEvaluation.getGenre(),
			);
			this.listeEvaluations.addElement(aEvaluation, lIndice);
			this.synchroniserSujetEtCorrige(aEvaluation);
			this.valider();
		}
	}
	evenementSurSelectionServiceDEvaluation(
		aListeServicesSelectionnes,
		aGenreBouton,
	) {
		if (aGenreBouton === 1) {
			this.setEtatSaisie(true);
			const lEvaluationModele = _getEvaluationModelePourDuplication.call(this);
			for (let i = 0, lNb = aListeServicesSelectionnes.count(); i < lNb; i++) {
				const lService = aListeServicesSelectionnes.get(i);
				const lEvaluation = MethodesObjet.dupliquer(lEvaluationModele);
				lEvaluation.Actif = true;
				lEvaluation.dateValidation = GDate.getDateCourante();
				if (GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement) {
					lEvaluation.serviceLVE = lService;
				} else {
					lEvaluation.service = lService;
					lEvaluation.informations = `${lService.getLibelle()}${lService.libelleProfs ? " - " + lService.libelleProfs : ""}`;
				}
				lEvaluation.classe = lService.classe;
				this.listeEvaluations.addElement(lEvaluation);
				lEvaluation.setEtat(EGenreEtat.Creation);
			}
			this.valider();
		}
	}
	evenementSurSelectionClasseGroupe(
		aGenreRessource,
		aListeRessourcesSelectionnes,
		aGenreBouton,
	) {
		if (aGenreBouton === 1) {
			this.setEtatSaisie(true);
			const lEvaluationModele = _getEvaluationModelePourDuplication.call(this);
			for (
				let i = 0, lNb = aListeRessourcesSelectionnes.count();
				i < lNb;
				i++
			) {
				const lRessource = aListeRessourcesSelectionnes.get(i);
				const lEvaluation = MethodesObjet.dupliquer(lEvaluationModele);
				lEvaluation.classe = lRessource;
				this.listeEvaluations.addElement(lEvaluation);
				lEvaluation.setEtat(EGenreEtat.Creation);
			}
			this.valider();
		}
	}
	valider() {
		let lListeSujetsEtCorriges;
		let lListeCloud;
		if (!!this.listeSujets || !!this.listeCorriges) {
			lListeSujetsEtCorriges = new ObjetListeElements();
			if (!!this.listeSujets) {
				lListeSujetsEtCorriges.add(this.listeSujets);
			}
			if (!!this.listeCorriges) {
				lListeSujetsEtCorriges.add(this.listeCorriges);
			}
			lListeCloud = lListeSujetsEtCorriges.getListeElements((aElement) => {
				return aElement.getGenre() === EGenreDocumentJoint.Cloud;
			});
		}
		new ObjetRequeteSaisieEvaluations(this, _surSaisieEvaluations.bind(this))
			.addUpload({
				listeFichiers: lListeSujetsEtCorriges,
				listeDJCloud: lListeCloud,
			})
			.lancerRequete(
				_estOngletSaisieEvaluation()
					? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service)
					: null,
				_estOngletSaisieEvaluation()
					? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe)
					: null,
				this.listeEvaluations,
				lListeSujetsEtCorriges,
			);
	}
	saisieUnitaire() {
		if (!GApplication.droits.get(TypeDroits.estEnConsultation)) {
			if (this.timeoutSaisieAsync) {
				clearTimeout(this.timeoutSaisieAsync);
			}
			this.timeoutSaisieAsync = setTimeout(() => {
				this.timeoutSaisieAsync = null;
				const lListeEvaluations =
					this._listeEvaluations_saisieAsync || this.listeEvaluations;
				this._listeEvaluations_saisieAsync = null;
				new ObjetRequeteSaisieEvaluations(this)
					.setOptions({
						sansBlocageInterface: true,
						afficherMessageErreur: false,
					})
					.lancerRequete(
						_estOngletSaisieEvaluation()
							? GEtatUtilisateur.Navigation.getRessource(
									EGenreRessource.Service,
								)
							: null,
						_estOngletSaisieEvaluation()
							? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe)
							: null,
						lListeEvaluations,
					);
				if (!!lListeEvaluations) {
					lListeEvaluations.parcourir((aEval) => {
						if (aEval.listeEleves) {
							aEval.listeEleves.parcourir((aEleve) => {
								if (aEleve.pourValidation()) {
									aEleve.setEtat(EGenreEtat.Aucun);
									if (!!aEleve.listeCompetences) {
										aEleve.listeCompetences.parcourir((aCompetence) => {
											if (aCompetence.pourValidation()) {
												aCompetence.setEtat(EGenreEtat.Aucun);
											}
										});
									}
								}
							});
						}
					});
				}
			}, 400);
		}
	}
	_messageSelectionnerEvaluation() {
		if (this.getInstance(this.identCompetencesParEvaluation)) {
			this.getInstance(
				this.identCompetencesParEvaluation,
			).afficherMessageSelectionnerEvaluation();
		}
	}
	evenementAfficherMessageDepuisListeServices(aGenreMessage) {
		this.evenementAfficherMessage(aGenreMessage);
		GStyle.setDisplay(this.getInstance(this.identListeServices).getNom(), true);
	}
	evenementAfficherMessage(aGenreMessage) {
		this.selectionEvaluation.evaluation = null;
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
		if (!!this.identListeServices) {
			GHtml.setDisplay(
				this.getInstance(this.identListeServices).getNom(),
				false,
			);
		}
		GHtml.setDisplay(this.idContainerListeEvaluations, false);
		this.getInstance(
			this.identCompetencesParEvaluation,
		).evenementAfficherMessage(aGenreMessage);
	}
}
function _estOngletEvaluationHistorique() {
	return [EGenreOnglet.ListeEvaluationHistorique].includes(
		GEtatUtilisateur.getGenreOnglet(),
	);
}
function _estOngletSaisieEvaluation() {
	return GEtatUtilisateur.getGenreOnglet() === EGenreOnglet.Evaluation;
}
function _initialiserSelectionPeriode(aInstance) {
	aInstance.setOptionsObjetSaisie({
		hauteur: 15,
		labelWAICellule: GTraductions.getValeur("WAI.ListeSelectionPeriode"),
		classTexte: "Gras",
	});
}
function _initialiserSelectionClasseGroupeNiv(aInstance) {
	aInstance.setOptionsObjetSaisie({
		hauteur: 15,
		labelWAICellule: GTraductions.getValeur("WAI.SelectionClasseGroupeNiv"),
		getClassElement: (aParams) => {
			return aParams &&
				aParams.element &&
				(aParams.element.AvecSelection === false || aParams.element.estTotal)
				? "titre-liste"
				: "";
		},
		estLargeurAuto: true,
		largeurAutoMax: 300,
		celluleAvecTexteHtml: true,
	});
}
function _initialiserListeServices(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ServicesEvaluationsPrim.colonnes.libelle,
		titre: "",
		taille: "100%",
	});
	lColonnes.push({
		id: DonneesListe_ServicesEvaluationsPrim.colonnes.classeGroupe,
		titre: "",
		taille: 60,
	});
	aInstance.setOptionsListe({
		skin: ObjetListe.skin.alternance,
		colonnes: lColonnes,
	});
}
function getColonnesListeEvaluations() {
	const lPourSaisie = _estOngletSaisieEvaluation();
	const lPourEvaluationHistorique = _estOngletEvaluationHistorique();
	const lColonnes = [];
	if (GEtatUtilisateur.pourPrimaire()) {
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.intitule,
			titre: GTraductions.getValeur("evaluations.colonne.intitule"),
			taille: ObjetListe.initColonne(50, 100, 450),
		});
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.date,
			titre: GTraductions.getValeur("Date"),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.resultats,
			titre: GTraductions.getValeur("evaluations.colonne.resultats"),
			hint: GTraductions.getValeur("evaluations.colonne.hint.resultats"),
			taille: 160,
		});
	} else {
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.intitule,
			titre: GTraductions.getValeur("evaluations.colonne.intitule"),
			taille: ObjetListe.initColonne(50, 100, 250),
		});
		if (!lPourSaisie) {
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.classe,
				titre: lPourEvaluationHistorique
					? GTraductions.getValeur("Niveau")
					: GTraductions.getValeur("competences.ClasseGroupe"),
				taille: lPourEvaluationHistorique ? 60 : 90,
			});
		}
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.palier,
			titre: GTraductions.getValeur("competences.palier"),
			taille: 50,
		});
		if (GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.themes,
				titre: GTraductions.getValeur("Themes"),
				taille: 80,
			});
		}
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.nombre,
			titre: GTraductions.getValeur("competences.nombre"),
			hint: GTraductions.getValeur("evaluations.colonne.hint.nb"),
			taille: 30,
		});
		if (!lPourEvaluationHistorique) {
			if (this.avecGestionNotation) {
				lColonnes.push({
					id: DonneesListe_Evaluations.colonne.devoir,
					titre: GTraductions.getValeur("evaluations.colonne.devoir"),
					hint: GTraductions.getValeur("evaluations.colonne.hint.devoir"),
					taille: 30,
				});
			}
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.QCM,
				titre: GTraductions.getValeur("evaluations.colonne.QCM"),
				hint: GTraductions.getValeur("evaluations.colonne.hint.QCM"),
				taille: 30,
			});
		}
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.date,
			titre: GTraductions.getValeur("Date"),
			taille: 50,
		});
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.coefficient,
			titre: GTraductions.getValeur("competences.colonne.coef"),
			hint: GTraductions.getValeur("competences.coefficient"),
			taille: 35,
		});
		if (!lPourEvaluationHistorique) {
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.estDansBilan,
				titre: GTraductions.getValeur("evaluations.colonne.estDansBilan"),
				hint: GTraductions.getValeur("evaluations.colonne.hint.estDansBilan"),
				taille: 45,
			});
		}
		lColonnes.push({
			id: DonneesListe_Evaluations.colonne.resultats,
			titre: GTraductions.getValeur("evaluations.colonne.resultats"),
			hint: GTraductions.getValeur("evaluations.colonne.hint.resultats"),
			taille: 160,
		});
		if (!lPourSaisie) {
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.infos,
				titre: [
					EGenreEspace.Professeur,
					EGenreEspace.PrimProfesseur,
					EGenreEspace.PrimDirection,
				].includes(GEtatUtilisateur.GenreEspace)
					? GTraductions.getValeur("competences.service")
					: GTraductions.getValeur("competences.Informations"),
				taille: 80,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.descriptif,
				titre: GTraductions.getValeur("competences.descriptif"),
				taille: ObjetListe.initColonne(50, 40),
			});
		}
		if (!lPourEvaluationHistorique) {
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.publie,
				titre: GTraductions.getValeur("evaluations.colonne.publieeLe"),
				taille: 70,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.sujet,
				titre: GTraductions.getValeur("evaluations.colonne.sujet"),
				hint: GTraductions.getValeur("evaluations.colonne.hint.sujet"),
				taille: 30,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.corrige,
				titre: GTraductions.getValeur("evaluations.colonne.corrige"),
				hint: GTraductions.getValeur("evaluations.colonne.hint.corrige"),
				taille: 30,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.periode,
				titre: GTraductions.getValeur("evaluations.colonne.periode1"),
				taille: 75,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.periodeSecondaire,
				titre: GTraductions.getValeur("evaluations.colonne.periode2"),
				taille: 75,
			});
		}
		if (!lPourEvaluationHistorique && !lPourSaisie) {
			lColonnes.push({
				id: DonneesListe_Evaluations.colonne.nbSaisi,
				titre: GTraductions.getValeur("evaluations.colonne.nbSaisi"),
				hint: GTraductions.getValeur("evaluations.colonne.hint.nbSaisi"),
				taille: 45,
			});
		}
	}
	return lColonnes;
}
function _initialiserFenetreEvaluation(aInstance) {
	aInstance.setOptionsFenetre({
		titre: "",
		largeur: 620,
		hauteur: 400,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
function _initialiserFenetreSelectionClasseGroupe(aInstance) {
	aInstance.setAvecCumul(true);
}
function _initFenetreParamListeEvaluations(aInstance) {
	aInstance.setOptionsFenetre({
		titre: GTraductions.getValeur("evaluations.parametresAffichage"),
		largeur: 350,
		hauteur: 80,
		listeBoutons: [
			GTraductions.getValeur("Annuler"),
			GTraductions.getValeur("Valider"),
		],
	});
}
function _evntFenetreParamListeEvaluations(aNumeroBouton, aParametres) {
	if (aNumeroBouton === 1) {
		this.getInstance(
			this.identCompetencesParEvaluation,
		).setOptionsAffichageListe({
			afficherProjetsAccompagnement: aParametres.afficherProjetsAccompagnement,
			afficherPourcentageReussite: aParametres.afficherPourcentageReussite,
			typeAffichageTitreColonneCompetence:
				aParametres.typeAffichageTitreColonneCompetence,
		});
		if (!!this.selectionEvaluation.evaluation) {
			this.getInstance(
				this.identCompetencesParEvaluation,
			).actualisationListeElevesCompetences(
				this.selectionEvaluation.evaluation,
			);
		}
	}
}
function lancerRequeteListeEvaluations(aNumeroEvaluationCreee) {
	new ObjetRequeteListeEvaluations(
		this,
		_reponseRequeteListeEvaluation.bind(this, aNumeroEvaluationCreee),
	).lancerRequete({
		service: _estOngletSaisieEvaluation()
			? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Service)
			: null,
		ressource: _estOngletSaisieEvaluation()
			? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Classe)
			: null,
		periode: _estOngletSaisieEvaluation()
			? GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode)
			: null,
	});
}
function _reponseRequeteListeEvaluation(aNumeroEvaluationCreee, aParams) {
	if (this.timeoutSaisieAsync) {
		this._listeEvaluations_saisieAsync = this.listeEvaluations;
	}
	this.strInfoCloture = aParams.strInfoCloture || "";
	this.avecSaisie = aParams.avecSaisie;
	this.serviceNavigationEstLVE = aParams.serviceNavigationEstLVE;
	this.droitSaisieNotes = aParams.droitSaisieNotes;
	this.parametresCreationDevoir = aParams.parametresCreationDevoir;
	this.listeReferentielsUniques = aParams.listeReferentielsUniques;
	this.messageCreationEvalImpossible = aParams.messageCreationImpossible;
	this.hintOptionPourcentageReussite = aParams.hintOptionPourcentageReussite;
	this.listeNiveauxDAcquisitions = GParametres.listeNiveauxDAcquisitions;
	this.listeEvaluations = aParams.listeEvaluations;
	this.listeSujets = aParams.listeSujets;
	this.listeCorriges = aParams.listeCorriges;
	this.listeServicesLVE = aParams.listeServicesLVE;
	this.listePeriodes = aParams.listePeriodes;
	if (!!this.listeEvaluations) {
		this.listeEvaluations.parcourir((aEval) => {
			aEval.matiere = this.Service ? this.Service.matiere : null;
		});
	}
	if (this.avecSaisie) {
		if (
			!!GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode) &&
			!!this.listePeriodes
		) {
			this.avecSaisie = !!this.listePeriodes.getElementParNumero(
				GEtatUtilisateur.Navigation.getRessource(
					EGenreRessource.Periode,
				).getNumero(),
			);
		}
	}
	if (_estOngletSaisieEvaluation()) {
		this.afficherListeEvaluations(null, aNumeroEvaluationCreee);
	} else {
		let lIndiceSelection = 0;
		let lListePeriodes;
		if (_estOngletEvaluationHistorique()) {
			lListePeriodes = GParametres.listeAnneesPrecedentes;
			if (!lListePeriodes.navigation) {
				lListePeriodes.navigation = {};
				lIndiceSelection = lListePeriodes.count() - 1;
				lListePeriodes.navigation.periodeSelection =
					lListePeriodes.count() > 0
						? lListePeriodes.get(lIndiceSelection)
						: null;
			} else {
				lIndiceSelection = lListePeriodes.ListeElements.indexOf(
					lListePeriodes.navigation.periodeSelection,
				);
			}
		} else {
			lListePeriodes = GParametres.getListeComboPeriodes([
				TypeHttpPeriode.TPN_Annee,
				TypeHttpPeriode.TPN_Trimestres,
				TypeHttpPeriode.TPN_Semestres,
				TypeHttpPeriode.TPN_Continue,
				TypeHttpPeriode.TPN_NonOfficielle,
			]);
			if (
				MethodesObjet.isUndefined(GEtatUtilisateur.getOnglet().periodeSelection)
			) {
				lIndiceSelection = lListePeriodes.getIndiceParNumeroEtGenre(
					null,
					TypeHttpPeriode.TPN_Annee,
				);
				GEtatUtilisateur.getOnglet().periodeSelection =
					lListePeriodes.get(lIndiceSelection);
			} else {
				lIndiceSelection = lListePeriodes.ListeElements.indexOf(
					GEtatUtilisateur.getOnglet().periodeSelection,
				);
			}
			_remplirComboClasseGroupeNiv.call(this);
		}
		if (this.getInstance(this.identSelecteurPeriode)) {
			this.getInstance(this.identSelecteurPeriode).setDonnees(
				lListePeriodes,
				lIndiceSelection,
			);
		}
		if (lListePeriodes.count() === 0) {
			_evenementSurSelectionPeriode.call(this);
		}
	}
}
function _remplirComboClasseGroupeNiv() {
	const lCombo = this.getInstance(this.identComboClasseGroupeNiv);
	if (
		!lCombo ||
		_estOngletSaisieEvaluation() ||
		_estOngletEvaluationHistorique()
	) {
		return;
	}
	const lListe = new ObjetListeElements();
	let lAvecClasse = false;
	let lAvecGroup = false;
	let lAvecNiveau = false;
	const lPeriodeNotation = !!GEtatUtilisateur.getOnglet().periodeSelection
		? GEtatUtilisateur.getOnglet().periodeSelection.periodeNotation
		: GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
	this.listeEvaluations.parcourir((aEval) => {
		if (!!lPeriodeNotation) {
			if (
				!DonneesListe_Evaluations.estDansMaPeriodeNotation(
					lPeriodeNotation,
					aEval,
				)
			) {
				return;
			}
		}
		if (aEval.listeClasseGroupeNivPourFiltre) {
			aEval.listeClasseGroupeNivPourFiltre.parcourir((aClasseGroupeNiv) => {
				const lEstDejaDansListe = lListe.getElementParElement(aClasseGroupeNiv);
				if (lEstDejaDansListe) {
					return;
				}
				switch (aClasseGroupeNiv.getGenre()) {
					case EGenreRessource.Classe:
						lAvecClasse = true;
						break;
					case EGenreRessource.Groupe:
						lAvecGroup = true;
						break;
					case EGenreRessource.Niveau:
						lAvecNiveau = true;
						break;
				}
				lListe.add(aClasseGroupeNiv);
			});
		}
	});
	if (lAvecClasse) {
		lListe.add(
			_getElementSeparationCombo(
				GTraductions.getValeur("Classe"),
				EGenreRessource.Classe,
			),
		);
	}
	if (lAvecGroup) {
		lListe.add(
			_getElementSeparationCombo(
				GTraductions.getValeur("Groupe"),
				EGenreRessource.Groupe,
			),
		);
	}
	if (lAvecNiveau) {
		lListe.add(
			_getElementSeparationCombo(
				GTraductions.getValeur("Niveau"),
				EGenreRessource.Niveau,
			),
		);
	}
	const lEstComboActif = lListe.count() > 0;
	lCombo.setActif(lEstComboActif);
	lListe.add(
		ObjetElement.create({
			Libelle: GTraductions.getValeur("evaluations.toutesLesEvaluations"),
			Genre: EGenreRessource.Aucune,
			estTotal: true,
		}),
	);
	lListe.setTri([
		ObjetTri.init((aElement) => aElement.getGenre() !== EGenreRessource.Aucune),
		ObjetTri.init((aElement) => aElement.getGenre() !== EGenreRessource.Classe),
		ObjetTri.init((aElement) => aElement.getGenre() !== EGenreRessource.Groupe),
		ObjetTri.init((aElement) => aElement.getGenre() !== EGenreRessource.Niveau),
		ObjetTri.init((aElement) => aElement.AvecSelection !== false),
		ObjetTri.init("Libelle"),
	]);
	lListe.trier();
	const lSelection = !!GEtatUtilisateur.getOnglet().ClasseGroupeNivSelection;
	const lSelectionDansLaListe = lListe.getElementParElement(
		GEtatUtilisateur.getOnglet().ClasseGroupeNivSelection,
	);
	let lIndice = null;
	if (lSelection && lSelectionDansLaListe) {
		lIndice = lListe.getIndiceParElement(
			GEtatUtilisateur.getOnglet().ClasseGroupeNivSelection,
		);
	} else {
		lIndice = lListe.get(
			lListe.getIndiceParNumeroEtGenre(null, EGenreRessource.Aucune),
		);
	}
	lCombo.setDonneesObjetSaisie({
		liste: lListe,
		selection: MethodesObjet.isNumeric(lIndice) ? lIndice : 0,
	});
}
function _getElementSeparationCombo(aLibelle, aGenre) {
	return ObjetElement.create({
		Libelle: aLibelle,
		Genre: aGenre,
		AvecSelection: false,
	});
}
function _dupliquerEvaluation(aEvaluation) {
	if (
		[
			EGenreEspace.Professeur,
			EGenreEspace.PrimProfesseur,
			EGenreEspace.PrimDirection,
		].includes(GEtatUtilisateur.GenreEspace) ||
		(GEtatUtilisateur.GenreEspace === EGenreEspace.Etablissement &&
			aEvaluation.serviceLVE)
	) {
		if (!aEvaluation.listeServices) {
			new ObjetRequeteListeRessourcesDEvalPourDuplication(
				this,
				this.ouvrirFenetreDupliquerSurServices,
			).lancerRequete(aEvaluation);
		} else {
			this.ouvrirFenetreDupliquerSurServices(aEvaluation.listeServices);
		}
	} else if (this.identFenetreSelectionClasseGroupe) {
		if (!aEvaluation.listeClasses) {
			new ObjetRequeteListeRessourcesDEvalPourDuplication(
				this,
				this.ouvrirFenetreDupliquerSurClassesGroupes,
			).lancerRequete(aEvaluation);
		} else {
			this.ouvrirFenetreDupliquerSurClassesGroupes(aEvaluation.listeClasses);
		}
	}
}
function _evenementSurSelectionPeriode(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		if (_estOngletEvaluationHistorique()) {
			GParametres.listeAnneesPrecedentes.periodeSelection = aParams.element;
		} else {
			GEtatUtilisateur.getOnglet().periodeSelection = aParams.element;
		}
		GStyle.setDisplay(this.idContainerListeEvaluations, true);
		this.afficherListeEvaluations(aParams.element);
		_remplirComboClasseGroupeNiv.call(this);
	}
}
function _evenementSurSelectionClasseGroupeNiv(aParams) {
	if (aParams.genreEvenement === EGenreEvenementObjetSaisie.selection) {
		GEtatUtilisateur.getOnglet().ClasseGroupeNivSelection = aParams.element;
		this.afficherListeEvaluations(
			GEtatUtilisateur.getOnglet().periodeSelection,
		);
	}
}
function _evenementSurListeServices(aParametres, aGenreEvenement) {
	switch (aGenreEvenement) {
		case EGenreEvenementListe.Selection:
			if (!!aParametres.article.estService) {
				GEtatUtilisateur.Navigation.setRessource(
					EGenreRessource.Service,
					aParametres.article,
				);
				this._surSelectionServices();
			} else {
				aParametres.instance.setListeElementsSelection(null);
				this.evenementAfficherMessageDepuisListeServices(
					EGenreMessage.SelectionSousMatiere,
				);
			}
			break;
	}
}
function _evenementSurListeEvaluations(aParametres, aGenreEvenement, I, J) {
	_desactiverPhotoEleve.call(this);
	this.selectionEvaluation.evaluation = this.listeEvaluations.get(J);
	this.actualiserImpressionPDF();
	this.selectionEvaluation.genreEvenement = aGenreEvenement;
	switch (aGenreEvenement) {
		case EGenreEvenementListe.Selection: {
			const lEvaluation = this.selectionEvaluation.evaluation;
			this.surSelectionEvaluation(
				lEvaluation.listePiliers,
				lEvaluation.listeServicesLVE,
			);
			break;
		}
		case EGenreEvenementListe.Creation:
			_surEvenementCreationEvaluation.call(this);
			return EGenreEvenementListe.Creation;
		case EGenreEvenementListe.Edition: {
			const lEvaluationSelectionnee = aParametres.article;
			if (!lEvaluationSelectionnee.enCache) {
				return;
			}
			if (!!lEvaluationSelectionnee.executionQCM) {
				const lCopieEvaluationSelectionnee = MethodesObjet.dupliquer(
					lEvaluationSelectionnee,
				);
				this.afficheFenetreModificationEvaluationQCM(
					lCopieEvaluationSelectionnee,
				);
			} else {
				if (aParametres.idColonne === DonneesListe_Evaluations.colonne.infos) {
					ouvrirFenetreChangerLeServiceDeLEvaluation.call(
						this,
						lEvaluationSelectionnee,
					);
				} else {
					this.afficherFenetreEvaluation(false);
				}
			}
			break;
		}
		case EGenreEvenementListe.Suppression: {
			this._messageSelectionnerEvaluation();
			this.setEtatSaisie(true);
			this.selectionEvaluation.evaluation = null;
			break;
		}
		case EGenreEvenementListe.ApresSuppression: {
			this.valider();
			break;
		}
	}
	return true;
}
function _desactiverPhotoEleve() {
	GEtatUtilisateur.Navigation.setRessource(EGenreRessource.Eleve, null);
	this.activerFichesEleve(false);
}
function _surEvenementCreationEvaluation() {
	if (!!this.messageCreationEvalImpossible) {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: this.messageCreationEvalImpossible,
		});
	} else {
		this.selectionEvaluation.evaluation = null;
		this.getInstance(this.identListeEvaluations).surSelection(-1, -1, {
			avecFocus: false,
		});
		this._messageSelectionnerEvaluation();
		const lAvecCreationParQCMPossible =
			!!this.listeQCMDisponibles && this.listeQCMDisponibles.count() > 0;
		if (lAvecCreationParQCMPossible) {
			const lThis = this;
			ObjetMenuContextuel.afficher({
				pere: lThis,
				options: { largeurMin: 100 },
				initCommandes: function (aInstance) {
					aInstance.add(
						GTraductions.getValeur("evaluations.CreerEvaluation"),
						true,
						() => {
							lThis.afficherFenetreEvaluation(true);
						},
					);
					aInstance.add(
						GTraductions.getValeur("evaluations.CreerEvaluationQCM"),
						true,
						() => {
							lThis.afficheFenetreCreationEvaluationQCM();
						},
					);
				},
			});
		} else {
			this.afficherFenetreEvaluation(true);
		}
	}
}
function ouvrirFenetreChangerLeServiceDeLEvaluation(aEvaluation) {
	new ObjetRequeteListeServicesDEvalPourRemplacement(
		this,
		surRecuperationListeServicesPourChangementServiceDEvaluation.bind(
			this,
			aEvaluation,
		),
	).lancerRequete(aEvaluation);
}
function surRecuperationListeServicesPourChangementServiceDEvaluation(
	aEvaluation,
	aListeServicesRequete,
) {
	if (!!aListeServicesRequete && aListeServicesRequete.count() > 0) {
		const lThis = this;
		const lObjFenetre = ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SelectionServicesDEvaluation,
			{
				pere: lThis,
				evenement: function (aListeServicesSelectionnes, aNumeroBouton) {
					if (aNumeroBouton === 1) {
						if (
							!!aListeServicesSelectionnes &&
							aListeServicesSelectionnes.count() > 0
						) {
							surChangementServiceDEvaluation.call(
								lThis,
								aEvaluation,
								aListeServicesSelectionnes.get(0),
							);
						}
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: GTraductions.getValeur("competences.selectionnerService"),
					});
				},
			},
		);
		lObjFenetre.setDonnees(
			aListeServicesRequete,
			false,
			!GEtatUtilisateur.pourPrimaire(),
		);
	} else {
		GApplication.getMessage().afficher({
			type: EGenreBoiteMessage.Information,
			message: GTraductions.getValeur(
				"evaluations.MsgAucunServiceDisponiblePourRemplacement",
			),
		});
	}
}
function surChangementServiceDEvaluation(aEvaluation, aService) {
	if (!!aEvaluation && !!aService) {
		aEvaluation.informations = aService.getLibelle();
		aEvaluation.service = MethodesObjet.dupliquer(aService);
		aEvaluation.service.setEtat(EGenreEtat.Modification);
		aEvaluation.setEtat(EGenreEtat.Modification);
		this.setEtatSaisie(true);
		this.getInstance(this.identListeEvaluations).actualiser(true);
	}
}
function _initialiserCompetencesParEvaluation(aInstance) {
	aInstance.setOptionsAffichageListe({
		avecOptionAfficherProjetsAcc: !_estOngletEvaluationHistorique(),
	});
}
function creerEvaluationVide() {
	const lEvaluation = new ObjetElement("", EGenreRessource.Evaluation);
	lEvaluation.avecSaisie = true;
	lEvaluation.dateValidation = GDate.getDateCourante();
	lEvaluation.datePublication =
		ObjetUtilitaireEvaluation.getDatePublicationEvaluationParDefaut(
			lEvaluation.dateValidation,
		);
	lEvaluation.descriptif = "";
	lEvaluation.periode = GEtatUtilisateur.Navigation.getRessource(
		EGenreRessource.Periode,
	);
	lEvaluation.periodeSecondaire = new ObjetElement("");
	lEvaluation.listePeriodes = MethodesObjet.dupliquer(this.listePeriodes);
	lEvaluation.listeEleves = new ObjetListeElements();
	lEvaluation.listePaliers = new ObjetListeElements();
	lEvaluation.listeCompetences = new ObjetListeElements();
	lEvaluation.listeSujets = new ObjetListeElements();
	lEvaluation.listeCorriges = new ObjetListeElements();
	lEvaluation.coefficient = 1;
	lEvaluation.priseEnCompteDansBilan = true;
	lEvaluation.service = GEtatUtilisateur.Navigation.getRessource(
		EGenreRessource.Service,
	);
	if (lEvaluation.service) {
		lEvaluation.service.estServiceLVE = this.serviceNavigationEstLVE;
	}
	lEvaluation.listeServicesLVE = this.listeServicesLVE;
	lEvaluation.libelleCBTheme = GTraductions.getValeur(
		"Theme.libelleCB.evaluation",
	);
	if (
		[EGenreEspace.Professeur, EGenreEspace.Administrateur].includes(
			GEtatUtilisateur.GenreEspace,
		)
	) {
		lEvaluation.avecDevoirPossible =
			!!lEvaluation.service &&
			!lEvaluation.service.estSansNote &&
			!!this.parametresCreationDevoir;
		if (lEvaluation.avecDevoirPossible) {
			lEvaluation.baremeDevoirParDefaut =
				this.parametresCreationDevoir.baremeParDefaut;
			lEvaluation.baremeDevoirDuService =
				this.parametresCreationDevoir.baremeService;
			lEvaluation.saisieDevoirsSurSousServices =
				this.parametresCreationDevoir.saisieDevoirsSurSousServices;
			lEvaluation.servicesDevoir =
				this.parametresCreationDevoir.listeSousServices;
		}
	}
	lEvaluation.setEtat(EGenreEtat.Creation);
	return lEvaluation;
}
function _QCMEstCompatibleAvecLeService(aQCM, aService) {
	let lEstCompatible = false;
	if (
		aQCM.getGenre() === EGenreRessource.QCM &&
		!!aQCM.listeServicesCompatiblesAvecCompetencesDuQCM
	) {
		const lIndice =
			aQCM.listeServicesCompatiblesAvecCompetencesDuQCM.getIndiceParElement(
				aService,
			);
		if (!!lIndice || lIndice === 0) {
			lEstCompatible = true;
		}
	}
	return lEstCompatible;
}
function _getEvaluationModelePourDuplication() {
	const lEvaluationModele = MethodesObjet.dupliquer(
		this.selectionEvaluation.evaluation,
	);
	lEvaluationModele.dupliquerDepuis = this.selectionEvaluation.evaluation;
	lEvaluationModele.listePiliers = null;
	lEvaluationModele.listeEleves = null;
	lEvaluationModele.enCache = false;
	lEvaluationModele.resultats = null;
	lEvaluationModele.hintResultats = null;
	lEvaluationModele.moyenneResultats = null;
	lEvaluationModele.Genre = EGenreRessource.Evaluation;
	lEvaluationModele.Numero = null;
	lEvaluationModele.Etat = EGenreEtat.Aucun;
	return lEvaluationModele;
}
function _surSaisieEvaluations(aJSONReponseSaisie) {
	let lNumeroEvaluationASelectionnee;
	if (
		!!aJSONReponseSaisie &&
		!!aJSONReponseSaisie.listeEvaluationsCreees &&
		aJSONReponseSaisie.listeEvaluationsCreees.count() > 0
	) {
		const lEvaluationCreee =
			aJSONReponseSaisie.listeEvaluationsCreees.getPremierElement();
		if (!!lEvaluationCreee) {
			lNumeroEvaluationASelectionnee = lEvaluationCreee.getNumero();
		}
	}
	this.actionSurValidation(lNumeroEvaluationASelectionnee);
}
module.exports = InterfacePageListeEvaluations;
