exports.InterfacePageListeEvaluations = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Evaluations_1 = require("DonneesListe_Evaluations");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_ParamListeEvaluations_1 = require("ObjetFenetre_ParamListeEvaluations");
const ObjetFenetre_Evaluation_1 = require("ObjetFenetre_Evaluation");
const ObjetFenetre_SelectionClasseGroupe_1 = require("ObjetFenetre_SelectionClasseGroupe");
const ObjetFenetre_SelectionServicesDEvaluation_1 = require("ObjetFenetre_SelectionServicesDEvaluation");
const ObjetRequeteListeEvaluations_1 = require("ObjetRequeteListeEvaluations");
const ObjetRequeteListeRessourcesDEvalPourDuplication_1 = require("ObjetRequeteListeRessourcesDEvalPourDuplication");
const ObjetRequeteListeServicesDEvalPourRemplacement_1 = require("ObjetRequeteListeServicesDEvalPourRemplacement");
const ObjetRequeteSaisieEvaluations_1 = require("ObjetRequeteSaisieEvaluations");
const ObjetUtilitaireEvaluation_1 = require("ObjetUtilitaireEvaluation");
const TypeHttpPeriode_1 = require("TypeHttpPeriode");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const InterfaceCompetencesParEvaluation_1 = require("InterfaceCompetencesParEvaluation");
const ObjetHint_1 = require("ObjetHint");
const ObjetRequeteListeServices_1 = require("ObjetRequeteListeServices");
const DonneesListe_ServicesEvaluationsPrim_1 = require("DonneesListe_ServicesEvaluationsPrim");
const Enumere_Message_1 = require("Enumere_Message");
const ObjetFenetre_EvaluationQCM_1 = require("ObjetFenetre_EvaluationQCM");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetRequeteListeQCMCumuls_1 = require("ObjetRequeteListeQCMCumuls");
const ObjetFenetre_SelectionQCM_1 = require("ObjetFenetre_SelectionQCM");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const ObjetRequeteSaisieQCMEvaluation_1 = require("ObjetRequeteSaisieQCMEvaluation");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const ObjetFenetre_ParamListeEvaluations_2 = require("ObjetFenetre_ParamListeEvaluations");
const ObjetTri_1 = require("ObjetTri");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const AccessApp_1 = require("AccessApp");
class InterfacePageListeEvaluations extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUilSco = this.appSco.getEtatUtilisateur();
		this.objeParametres = this.appSco.getObjetParametres();
		this.afficheUniquementMesEvaluations = true;
		this.idContainerListeEvaluations = GUID_1.GUID.getId();
		this.selectionEvaluation = {};
		if (this.etatUilSco.competences_modeSaisieClavierVertical === undefined) {
			this.etatUilSco.competences_modeSaisieClavierVertical = true;
		}
		this.avecGestionNotation = this.appSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
		);
	}
	construireInstances() {
		if (this._estOngletSaisieEvaluation()) {
			this.identTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				this.initialiserTripleCombo,
			);
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		} else {
			this.identSelecteurPeriode = this.add(
				ObjetSaisie_1.ObjetSaisie,
				this._evenementSurSelectionPeriode.bind(this),
				this._initialiserSelectionPeriode,
			);
			if (!this._estOngletEvaluationHistorique()) {
				this.identComboClasseGroupeNiv = this.add(
					ObjetSaisie_1.ObjetSaisie,
					this._evenementSurSelectionClasseGroupeNiv.bind(this),
					this._initialiserSelectionClasseGroupeNiv,
				);
			}
		}
		this.identFenetreOptionsAffichage = this.addFenetre(
			ObjetFenetre_ParamListeEvaluations_1.ObjetFenetre_ParamListeEvaluations,
			this._evntFenetreParamListeEvaluations.bind(this),
			this._initFenetreParamListeEvaluations,
		);
		if (this.etatUilSco.pourPrimaire() && this._estOngletSaisieEvaluation()) {
			this.identListeServices = this.add(
				ObjetListe_1.ObjetListe,
				this._evenementSurListeServices.bind(this),
				this._initialiserListeServices,
			);
		}
		this.identListeEvaluations = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListeEvaluations.bind(this),
		);
		this.identFenetreEvaluation = this.add(
			ObjetFenetre_Evaluation_1.ObjetFenetre_Evaluation,
			this.evenementSurFenetreEvaluation,
			this._initialiserFenetreEvaluation,
		);
		this.identFenetreSelectionServiceDEvaluation = this.addFenetre(
			ObjetFenetre_SelectionServicesDEvaluation_1.ObjetFenetre_SelectionServicesDEvaluation,
			this.evenementSurSelectionServiceDEvaluation,
		);
		if (
			this.etatUilSco.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Etablissement
		) {
			this.identFenetreSelectionClasseGroupe = this.addFenetre(
				ObjetFenetre_SelectionClasseGroupe_1.ObjetFenetre_SelectionClasseGroupe,
				this.evenementSurSelectionClasseGroupe,
				this._initialiserFenetreSelectionClasseGroupe,
			);
		}
		this.identCompetencesParEvaluation = this.add(
			InterfaceCompetencesParEvaluation_1.InterfaceCompetencesParEvaluation,
			this._evenementSurCompetencesParEvaluation,
			this._initialiserCompetencesParEvaluation,
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
					return ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.parametresAffichage",
					);
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
					UtilitaireCompetences_1.TUtilitaireCompetences.afficherAideSaisieNiveauMaitrise(
						{
							genreChoixValidationCompetence:
								TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
									.tGVC_EvaluationEtItem,
							callback: function () {
								ObjetHtml_1.GHtml.setFocus(lElement);
							},
						},
					);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"competences.TitreAideSaisieNivMaitrise",
					);
				},
			},
			btnHV: {
				event() {
					const lTexte = aInstance.etatUilSco
						.competences_modeSaisieClavierVertical
						? ObjetTraduction_1.GTraductions.getValeur(
								"competences.HintSaisieHorizontale",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.HintSaisieVerticale",
							);
					ObjetHint_1.ObjetHint.start(lTexte, {
						sansDelai: true,
						delaiFermeture: 1500,
						position: {
							x:
								ObjetPosition_1.GPosition.getLeft(this.node) +
								ObjetPosition_1.GPosition.getWidth(this.node) -
								20,
							y: ObjetPosition_1.GPosition.getTop(this.node),
						},
					});
					aInstance.etatUilSco.competences_modeSaisieClavierVertical =
						!aInstance.etatUilSco.competences_modeSaisieClavierVertical;
				},
				getSelection() {
					return aInstance.etatUilSco.competences_modeSaisieClavierVertical;
				},
				getTitle() {
					return aInstance.etatUilSco.competences_modeSaisieClavierVertical
						? ObjetTraduction_1.GTraductions.getValeur(
								"competences.SensDeSaisieHorizontal",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.SensDeSaisieVertical",
							);
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconSaisieHorizontalVertical(
						aInstance.etatUilSco.competences_modeSaisieClavierVertical,
					);
				},
			},
			btnCreationEvaluationPrimaire: {
				event() {
					aInstance._surEvenementCreationEvaluation();
				},
				getDisabled() {
					return !aInstance.avecSaisie;
				},
			},
		});
	}
	initialiserTripleCombo(aInstance) {
		if (
			this.etatUilSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement ||
			this.etatUilSco.pourPrimaire()
		) {
			aInstance.setParametres([
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
			]);
		} else {
			aInstance.setParametres([
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Periode,
				Enumere_Ressource_1.EGenreRessource.Service,
			]);
		}
	}
	initialiserListeEvaluations(aInstance) {
		aInstance.setOptionsListe({
			colonnes: this.getColonnesListeEvaluations(),
			listeCreations: this._estOngletSaisieEvaluation() ? 0 : null,
			avecLigneCreation:
				!this.etatUilSco.pourPrimaire() &&
				this._estOngletSaisieEvaluation() &&
				!!this.avecSaisie,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.CliquezPourCreerEvaluation",
			),
			alternanceCouleurLigneContenu: false,
			scrollHorizontal: !this.etatUilSco.pourPrimaire(),
		});
		this.etatUilSco.setTriListe({
			liste: aInstance,
			tri: 0,
			identifiant: "listeEvaluations",
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identCompetencesParEvaluation;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		if (this._estOngletSaisieEvaluation()) {
			this.AddSurZone.push(this.identTripleCombo);
			this.AddSurZone.push({ html: '<span ie-html="getInfoCloture"></span>' });
		} else {
			this.AddSurZone.push(this.identSelecteurPeriode);
			if (!this._estOngletEvaluationHistorique()) {
				this.AddSurZone.push(this.identComboClasseGroupeNiv);
			}
			this.AddSurZone.push({ separateur: true });
		}
		this.AddSurZone.push({ blocGauche: true });
		this.addSurZonePhotoEleve();
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnSaisieHorizontalVertical(
				"btnHV",
			),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
				"btnMrFiche",
			),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				"btnParametrage",
			),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	construireStructureAffichageAutre() {
		const lHTML = [];
		const lHeightListeEvals = !!this.identListeServices
			? "calc(100% - 70px - 5px)"
			: "100%";
		const lStyleFlexListe = this.appSco.estPrimaire
			? "flex: 10 1 45rem;"
			: this.etatUilSco.getGenreOnglet() ===
					Enumere_Onglet_1.EGenreOnglet.ListeEvaluation
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
				ObjetTraduction_1.GTraductions.getValeur("evaluations.CreerEvaluation"),
				"</ie-bouton>",
				"</div>",
			);
		}
		lZoneListeEvaluations.push(
			'<div id="',
			this.getNomInstance(this.identListeEvaluations),
			'" style="height: ',
			lHeightListeEvals,
			';"></div>',
		);
		lZoneListeEvaluations.push("</div>");
		lHTML.push(
			'<div class="p-all flex-contain full-height flex-gap">',
			!!this.identListeServices
				? '<div id="' +
						this.getNomInstance(this.identListeServices) +
						'" style="flex: 1 0 30rem; display:none;" class="InlineBlock">&nbsp;</div>'
				: "",
			lZoneListeEvaluations.join(""),
			'<div id="',
			this.getNomInstance(this.identCompetencesParEvaluation),
			'" style="flex: 50 1 50rem; display:none;" class="InlineBlock"></div>',
			"</div>",
		);
		return lHTML.join("");
	}
	recupererDonnees() {
		if (!this._estOngletSaisieEvaluation()) {
			this.getInstance(this.identSelecteurPeriode).focusSurPremierElement();
			this.afficherPage();
		}
	}
	evenementSurDernierMenuDeroulant(aClasse, aPeriode, aService) {
		if (this.etatUilSco.pourPrimaire()) {
			const lThis = this;
			const lClasseGroupeSelectionne = this.etatUilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			new ObjetRequeteListeServices_1.ObjetRequeteListeServices(
				this,
				(aListeServices) => {
					ObjetStyle_1.GStyle.setDisplay(
						lThis.getInstance(lThis.identListeServices).getNom(),
						true,
					);
					const lListeAReselect = new ObjetListeElements_1.ObjetListeElements();
					lListeAReselect.addElement(
						this.etatUilSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Service,
						),
					);
					const lColonnesCachees = [];
					if (
						lClasseGroupeSelectionne &&
						lClasseGroupeSelectionne.getGenre() !== 0
					) {
						lColonnesCachees.push(
							DonneesListe_ServicesEvaluationsPrim_1
								.DonneesListe_ServicesEvaluationsPrim.colonnes.classeGroupe,
						);
					}
					lThis
						.getInstance(lThis.identListeServices)
						.setOptionsListe({ colonnesCachees: lColonnesCachees });
					lThis
						.getInstance(lThis.identListeServices)
						.setDonnees(
							new DonneesListe_ServicesEvaluationsPrim_1.DonneesListe_ServicesEvaluationsPrim(
								aListeServices,
							),
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
							Enumere_Message_1.EGenreMessage.SelectionMatiere,
						);
					}
				},
			).lancerRequete(
				this.etatUilSco.getUtilisateur(),
				lClasseGroupeSelectionne,
				this.etatUilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
			);
		} else {
			this._surSelectionServices(aService);
		}
	}
	_surSelectionServices(aService) {
		this.Service = aService;
		this._desactiverPhotoEleve();
		ObjetStyle_1.GStyle.setDisplay(this.idContainerListeEvaluations, true);
		this.afficherPage();
		this.surResizeInterface();
	}
	afficherPage(aNumeroEvaluationCreee) {
		this.setEtatSaisie(false);
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUilSco.GenreEspace)
		) {
			const lJSON = {};
			if (
				[
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(this.etatUilSco.GenreEspace)
			) {
				lJSON.service = this.etatUilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Service,
				);
			}
			new ObjetRequeteListeQCMCumuls_1.ObjetRequeteListeQCMCumuls(
				this,
				(aListeQCM) => {
					this.listeQCMDisponibles = aListeQCM;
					this.lancerRequeteListeEvaluations(aNumeroEvaluationCreee);
				},
			).lancerRequete(lJSON);
		} else {
			this.lancerRequeteListeEvaluations();
		}
	}
	callbackMenuContextuel(aCommande, aEvaluation) {
		switch (aCommande) {
			case DonneesListe_Evaluations_1.DonneesListe_Evaluations
				.commandeMenuContextuel.dupliquer:
				this._dupliquerEvaluation(aEvaluation);
				break;
		}
	}
	ouvrirFenetreDupliquerSurClassesGroupes(aListeClasses) {
		this.selectionEvaluation.evaluation.listeClasses = aListeClasses;
		this.listeClassesGroupesSelection =
			new ObjetListeElements_1.ObjetListeElements();
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
			!this.etatUilSco.pourPrimaire(),
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
			this.etatUilSco.getOnglet().ClasseGroupeNivSelection;
		const lFiltreClasseGroupeNiv =
			!lSelectionClasseGroupeNiv ||
			lSelectionClasseGroupeNiv.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Aucune
				? null
				: lSelectionClasseGroupeNiv;
		this.getInstance(this.identListeEvaluations).setDonnees(
			new DonneesListe_Evaluations_1.DonneesListe_Evaluations(
				this.listeEvaluations,
				{
					estOngletHistorique: this._estOngletEvaluationHistorique(),
					periode: aPeriode,
					ClasseGroupeNiveau: lFiltreClasseGroupeNiv,
					avecMenuContextuelCreer:
						this._estOngletSaisieEvaluation() && this.avecSaisie,
					avecMenuContextuelDupliquer:
						this.etatUilSco.getGenreOnglet() ===
							Enumere_Onglet_1.EGenreOnglet.ListeEvaluation ||
						this._estOngletEvaluationHistorique() ||
						this.etatUilSco.pourPrimaire(),
					afficheUniquementMesEvaluations:
						this.etatUilSco.getGenreOnglet() !==
						Enumere_Onglet_1.EGenreOnglet.Evaluation
							? this.afficheUniquementMesEvaluations
							: false,
					callbackMenuContextuel: this.callbackMenuContextuel.bind(this),
					avecGestionNotation: this.avecGestionNotation,
				},
			),
		);
		let lListeSelections = new ObjetListeElements_1.ObjetListeElements();
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
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
			this._messageSelectionnerEvaluation();
		}
	}
	_evenementSurCompetencesParEvaluation(aGenre) {
		switch (aGenre) {
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.selectionEleve:
				this.surSelectionEleve();
				break;
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.editerCompetence:
				this._actualiseJaugeEvaluation(this.selectionEvaluation.evaluation);
				this.saisieUnitaire();
				this.getInstance(this.identListeEvaluations).actualiser(true);
				break;
			case InterfaceCompetencesParEvaluation_1
				.EGenreEvenementCompetencesParEvaluation.editionNote:
				this.saisieUnitaire();
				break;
		}
	}
	actualiserImpressionPDF() {
		if (
			!this._estOngletEvaluationHistorique() &&
			this.selectionEvaluation.evaluation
		) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				this._getParametresPDF.bind(this),
			);
		} else {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
		}
	}
	_getParametresPDF() {
		let lPeriode;
		if (this._estOngletSaisieEvaluation()) {
			lPeriode = this.etatUilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			);
		} else {
			lPeriode = this.etatUilSco.getOnglet().periodeSelection
				? this.etatUilSco.getOnglet().periodeSelection.periodeNotation
				: null;
		}
		const lOptionsAffichageListe = this.getInstance(
			this.identCompetencesParEvaluation,
		).getOptionsAffichageListe();
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.Evaluation,
			evaluation: this.selectionEvaluation.evaluation,
			periode: lPeriode,
			afficherProjetsAccompagnement:
				lOptionsAffichageListe.avecOptionAfficherProjetsAcc &&
				lOptionsAffichageListe.afficherProjetsAccompagnement,
			afficherPourcentageReussite:
				lOptionsAffichageListe.afficherPourcentageReussite,
			afficherLibelle:
				lOptionsAffichageListe.typeAffichageTitreColonneCompetence ===
				ObjetFenetre_ParamListeEvaluations_2.TypeAffichageTitreColonneCompetence
					.AffichageLibelle,
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
			classe: this.etatUilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
		});
	}
	_actualiseJaugeEvaluation(aEvaluation) {
		if (aEvaluation) {
			const lTousNiveauxDAcquisition =
				new ObjetListeElements_1.ObjetListeElements();
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
				UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
					lTousNiveauxDAcquisition,
				);
			aEvaluation.hintResultats =
				UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
					aEvaluation.resultats,
				);
			aEvaluation.moyenneResultats =
				UtilitaireCompetences_1.TUtilitaireCompetences.getMoyenneBarreNiveauDAcquisition(
					aEvaluation.resultats,
				);
		}
	}
	afficherFenetreEvaluation(aEnCreation) {
		const lEvaluation = this.selectionEvaluation.evaluation
			? MethodesObjet_1.MethodesObjet.dupliquer(
					this.selectionEvaluation.evaluation,
				)
			: this.creerEvaluationVide();
		if (
			this.selectionEvaluation.genreEvenement ===
			Enumere_EvenementListe_1.EGenreEvenementListe.Edition
		) {
			ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.calculerAvecEvaluation(
				lEvaluation,
			);
		}
		let lTitreFenetre;
		if (aEnCreation) {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.CreerEvaluation",
			);
		} else {
			lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.ModifierEvaluation",
			);
			if (lEvaluation && !lEvaluation.baremeDevoirDuService) {
				if (this.parametresCreationDevoir) {
					lEvaluation.baremeDevoirDuService =
						this.parametresCreationDevoir.baremeService;
				} else if (lEvaluation.baremeDevoirParDefaut) {
					lEvaluation.baremeDevoirDuService = lEvaluation.baremeDevoirParDefaut;
				}
			}
		}
		this.getInstance(this.identFenetreEvaluation).setOptionsFenetre({
			titre: lTitreFenetre,
		});
		this.getInstance(this.identFenetreEvaluation).setDonnees(
			lEvaluation,
			lEvaluation.listeServicesLVE,
			lEvaluation.listePeriodes,
			{
				avecSelectionPeriodeSecondaire: !this.etatUilSco.pourPrimaire(),
				avecCreationNouvelleCompetence: this.etatUilSco.pourPrimaire(),
				avecDuplicationCompetence: !this.etatUilSco.pourPrimaire(),
				avecDoublonCompetencesInterdit: false,
				listeReferentielsUniques: this.listeReferentielsUniques,
			},
		);
	}
	afficheFenetreCreationEvaluationQCM() {
		const lServiceEvaluation = this.etatUilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Service,
		);
		const lThis = this;
		const lFenetreChoixQCMAvecCompetences =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionQCM_1.ObjetFenetre_SelectionQCM,
				{
					pere: this,
					evenement: function (aNumeroBouton, aQCM) {
						if (aNumeroBouton === 1) {
							if (
								this._qCMEstCompatibleAvecLeService(aQCM, lServiceEvaluation)
							) {
								const lPeriodeSelectionnee =
									this.etatUilSco.Navigation.getRessource(
										Enumere_Ressource_1.EGenreRessource.Periode,
									);
								const lEvaluationVide =
									ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.creerNouvelleEvaluationQCM(
										aQCM,
										lServiceEvaluation,
										lPeriodeSelectionnee,
									);
								lThis.afficheFenetreModificationEvaluationQCM(
									lEvaluationVide,
									true,
								);
							} else {
								this.appSco
									.getMessage()
									.afficher({
										type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
										message: ObjetTraduction_1.GTraductions.getValeur(
											"evaluations.FenetreEvaluationQCM.QCMSelectionneNonCompatiblePourService",
										),
									});
							}
						}
					},
					initialiser: function (aInstance) {
						UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(aInstance);
						aInstance.setGenreRessources({
							genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
							genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
							genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
							genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
						});
					},
				},
			);
		let lExisteAuMoinsUnQCMCompatible = false;
		if (!!this.listeQCMDisponibles) {
			this.listeQCMDisponibles.parcourir((D) => {
				if (this._qCMEstCompatibleAvecLeService(D, lServiceEvaluation)) {
					lExisteAuMoinsUnQCMCompatible = true;
					return false;
				}
			});
		}
		if (lExisteAuMoinsUnQCMCompatible) {
			lFenetreChoixQCMAvecCompetences.setDonnees(this.listeQCMDisponibles);
		} else {
			this.appSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
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
			aEvaluation.Etat !== Enumere_Etat_1.EGenreEtat.Creation
				? ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.FenetreAssocEvaluation.ModifierEvaluation",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"SaisieQCM.FenetreAssocEvaluation.CreerEvaluation",
					);
		const lFenetreEvaluationQCM =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_EvaluationQCM_1.ObjetFenetre_EvaluationQCM,
				{
					pere: this,
					evenement: function (aGenreBouton, aEvaluationFenetre) {
						if (aGenreBouton === 1) {
							lThis.setEtatSaisie(true);
							aEvaluationFenetre.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
							new ObjetRequeteSaisieQCMEvaluation_1.ObjetRequeteSaisieQCMEvaluation(
								lThis,
								lThis._surSaisieEvaluations.bind(lThis),
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
					Enumere_EvenementListe_1.EGenreEvenementListe.Creation
					? Enumere_Etat_1.EGenreEtat.Creation
					: Enumere_Etat_1.EGenreEtat.Modification,
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
			const lEvaluationModele = this._getEvaluationModelePourDuplication();
			for (let i = 0, lNb = aListeServicesSelectionnes.count(); i < lNb; i++) {
				const lService = aListeServicesSelectionnes.get(i);
				const lEvaluation =
					MethodesObjet_1.MethodesObjet.dupliquer(lEvaluationModele);
				lEvaluation.Actif = true;
				lEvaluation.dateValidation = ObjetDate_1.GDate.getDateCourante();
				if (
					this.etatUilSco.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Etablissement
				) {
					lEvaluation.serviceLVE = lService;
				} else {
					lEvaluation.service = lService;
					lEvaluation.informations = `${lService.getLibelle()}${lService.libelleProfs ? " - " + lService.libelleProfs : ""}`;
				}
				lEvaluation.classe = lService.classe;
				this.listeEvaluations.addElement(lEvaluation);
				lEvaluation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
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
			const lEvaluationModele = this._getEvaluationModelePourDuplication();
			for (
				let i = 0, lNb = aListeRessourcesSelectionnes.count();
				i < lNb;
				i++
			) {
				const lRessource = aListeRessourcesSelectionnes.get(i);
				const lEvaluation =
					MethodesObjet_1.MethodesObjet.dupliquer(lEvaluationModele);
				lEvaluation.classe = lRessource;
				this.listeEvaluations.addElement(lEvaluation);
				lEvaluation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			}
			this.valider();
		}
	}
	valider() {
		let lListeSujetsEtCorriges;
		let lListeCloud;
		if (!!this.listeSujets || !!this.listeCorriges) {
			lListeSujetsEtCorriges = new ObjetListeElements_1.ObjetListeElements();
			if (!!this.listeSujets) {
				lListeSujetsEtCorriges.add(this.listeSujets);
			}
			if (!!this.listeCorriges) {
				lListeSujetsEtCorriges.add(this.listeCorriges);
			}
			lListeCloud = lListeSujetsEtCorriges.getListeElements((aElement) => {
				return (
					aElement.getGenre() ===
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud
				);
			});
		}
		new ObjetRequeteSaisieEvaluations_1.ObjetRequeteSaisieEvaluations(
			this,
			this._surSaisieEvaluations.bind(this),
		)
			.addUpload({
				listeFichiers: lListeSujetsEtCorriges,
				listeDJCloud: lListeCloud,
			})
			.lancerRequete(
				this._estOngletSaisieEvaluation()
					? this.etatUilSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Service,
						)
					: null,
				this._estOngletSaisieEvaluation()
					? this.etatUilSco.Navigation.getRessource(
							Enumere_Ressource_1.EGenreRessource.Classe,
						)
					: null,
				this.listeEvaluations,
				lListeSujetsEtCorriges,
			);
	}
	saisieUnitaire() {
		if (!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation)) {
			if (this.timeoutSaisieAsync) {
				clearTimeout(this.timeoutSaisieAsync);
			}
			this.timeoutSaisieAsync = setTimeout(() => {
				this.timeoutSaisieAsync = null;
				const lListeEvaluations =
					this._listeEvaluations_saisieAsync || this.listeEvaluations;
				this._listeEvaluations_saisieAsync = null;
				new ObjetRequeteSaisieEvaluations_1.ObjetRequeteSaisieEvaluations(this)
					.setOptions({
						sansBlocageInterface: true,
						afficherMessageErreur: false,
					})
					.lancerRequete(
						this._estOngletSaisieEvaluation()
							? this.etatUilSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Service,
								)
							: null,
						this._estOngletSaisieEvaluation()
							? this.etatUilSco.Navigation.getRessource(
									Enumere_Ressource_1.EGenreRessource.Classe,
								)
							: null,
						lListeEvaluations,
					);
				if (!!lListeEvaluations) {
					lListeEvaluations.parcourir((aEval) => {
						if (aEval.listeEleves) {
							aEval.listeEleves.parcourir((aEleve) => {
								if (aEleve.pourValidation()) {
									aEleve.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
									if (!!aEleve.listeCompetences) {
										aEleve.listeCompetences.parcourir((aCompetence) => {
											if (aCompetence.pourValidation()) {
												aCompetence.setEtat(Enumere_Etat_1.EGenreEtat.Aucun);
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
		ObjetStyle_1.GStyle.setDisplay(
			this.getInstance(this.identListeServices).getNom(),
			true,
		);
	}
	evenementAfficherMessage(aGenreMessage) {
		this.selectionEvaluation.evaluation = null;
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		if (!!this.identListeServices) {
			ObjetHtml_1.GHtml.setDisplay(
				this.getInstance(this.identListeServices).getNom(),
				false,
			);
		}
		ObjetHtml_1.GHtml.setDisplay(this.idContainerListeEvaluations, false);
		this.getInstance(
			this.identCompetencesParEvaluation,
		).evenementAfficherMessage(aGenreMessage);
	}
	_estOngletEvaluationHistorique() {
		return [Enumere_Onglet_1.EGenreOnglet.ListeEvaluationHistorique].includes(
			this.etatUilSco.getGenreOnglet(),
		);
	}
	_estOngletSaisieEvaluation() {
		return (
			this.etatUilSco.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.Evaluation
		);
	}
	_initialiserSelectionPeriode(aInstance) {
		aInstance.setOptionsObjetSaisie({
			hauteur: 15,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
			classTexte: "Gras",
		});
	}
	_initialiserSelectionClasseGroupeNiv(aInstance) {
		aInstance.setOptionsObjetSaisie({
			hauteur: 15,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.SelectionClasseGroupeNiv",
			),
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
	_initialiserListeServices(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ServicesEvaluationsPrim_1
				.DonneesListe_ServicesEvaluationsPrim.colonnes.libelle,
			titre: "",
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_ServicesEvaluationsPrim_1
				.DonneesListe_ServicesEvaluationsPrim.colonnes.classeGroupe,
			titre: "",
			taille: 60,
		});
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.alternance,
			colonnes: lColonnes,
		});
	}
	getColonnesListeEvaluations() {
		const lPourSaisie = this._estOngletSaisieEvaluation();
		const lPourEvaluationHistorique = this._estOngletEvaluationHistorique();
		const lColonnes = [];
		if (this.etatUilSco.pourPrimaire()) {
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
					.intitule,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.intitule",
				),
				taille: ObjetListe_1.ObjetListe.initColonne(50, 100, 450),
			});
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.date,
				titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
				taille: 50,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
					.resultats,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.resultats",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.hint.resultats",
				),
				taille: 160,
			});
		} else {
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
					.intitule,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.intitule",
				),
				taille: ObjetListe_1.ObjetListe.initColonne(50, 100, 250),
			});
			if (!lPourSaisie) {
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.classe,
					titre: lPourEvaluationHistorique
						? ObjetTraduction_1.GTraductions.getValeur("Niveau")
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.ClasseGroupe",
							),
					taille: lPourEvaluationHistorique ? 60 : 90,
				});
			}
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.palier,
				titre: ObjetTraduction_1.GTraductions.getValeur("competences.palier"),
				taille: 50,
			});
			if (this.appSco.parametresUtilisateur.get("avecGestionDesThemes")) {
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.themes,
					titre: ObjetTraduction_1.GTraductions.getValeur("Themes"),
					taille: 80,
				});
			}
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.nombre,
				titre: ObjetTraduction_1.GTraductions.getValeur("competences.nombre"),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.hint.nb",
				),
				taille: 30,
			});
			if (!lPourEvaluationHistorique) {
				if (this.avecGestionNotation) {
					lColonnes.push({
						id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
							.devoir,
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.colonne.devoir",
						),
						hint: ObjetTraduction_1.GTraductions.getValeur(
							"evaluations.colonne.hint.devoir",
						),
						taille: 30,
					});
				}
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.QCM,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.QCM",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.hint.QCM",
					),
					taille: 30,
				});
			}
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.date,
				titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
				taille: 50,
			});
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
					.coefficient,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"competences.colonne.coef",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"competences.coefficient",
				),
				taille: 35,
			});
			if (!lPourEvaluationHistorique) {
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.estDansBilan,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.estDansBilan",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.hint.estDansBilan",
					),
					taille: 45,
				});
			}
			lColonnes.push({
				id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
					.resultats,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.resultats",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.colonne.hint.resultats",
				),
				taille: 160,
			});
			if (!lPourSaisie) {
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.infos,
					titre: [
						Enumere_Espace_1.EGenreEspace.Professeur,
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
					].includes(this.etatUilSco.GenreEspace)
						? ObjetTraduction_1.GTraductions.getValeur("competences.service")
						: ObjetTraduction_1.GTraductions.getValeur(
								"competences.Informations",
							),
					taille: 80,
				});
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.descriptif,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"competences.descriptif",
					),
					taille: ObjetListe_1.ObjetListe.initColonne(50, 40),
				});
			}
			if (!lPourEvaluationHistorique) {
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.publie,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.publieeLe",
					),
					taille: 70,
				});
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.sujet,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.sujet",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.hint.sujet",
					),
					taille: 30,
				});
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.corrige,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.corrige",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.hint.corrige",
					),
					taille: 30,
				});
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.periode,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.periode1",
					),
					taille: 75,
				});
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.periodeSecondaire,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.periode2",
					),
					taille: 75,
				});
			}
			if (!lPourEvaluationHistorique && !lPourSaisie) {
				lColonnes.push({
					id: DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne
						.nbSaisi,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.nbSaisi",
					),
					hint: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.colonne.hint.nbSaisi",
					),
					taille: 45,
				});
			}
		}
		return lColonnes;
	}
	_initialiserFenetreEvaluation(aInstance) {
		aInstance.setOptionsFenetre({
			titre: "",
			largeur: 620,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_initialiserFenetreSelectionClasseGroupe(aInstance) {
		aInstance.setAvecCumul(true);
	}
	_initFenetreParamListeEvaluations(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"evaluations.parametresAffichage",
			),
			largeur: 350,
			hauteur: 80,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_evntFenetreParamListeEvaluations(aNumeroBouton, aParametres) {
		if (aNumeroBouton === 1) {
			this.getInstance(
				this.identCompetencesParEvaluation,
			).setOptionsAffichageListe({
				afficherProjetsAccompagnement:
					aParametres.afficherProjetsAccompagnement,
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
	lancerRequeteListeEvaluations(aNumeroEvaluationCreee) {
		new ObjetRequeteListeEvaluations_1.ObjetRequeteListeEvaluations(
			this,
			this._reponseRequeteListeEvaluation.bind(this, aNumeroEvaluationCreee),
		).lancerRequete({
			service: this._estOngletSaisieEvaluation()
				? this.etatUilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
					)
				: null,
			ressource: this._estOngletSaisieEvaluation()
				? this.etatUilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Classe,
					)
				: null,
			periode: this._estOngletSaisieEvaluation()
				? this.etatUilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					)
				: null,
		});
	}
	_reponseRequeteListeEvaluation(aNumeroEvaluationCreee, aParams) {
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
		this.listeNiveauxDAcquisitions =
			this.objeParametres.listeNiveauxDAcquisitions;
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
				!!this.etatUilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				) &&
				!!this.listePeriodes
			) {
				this.avecSaisie = !!this.listePeriodes.getElementParNumero(
					this.etatUilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					).getNumero(),
				);
			}
		}
		if (this._estOngletSaisieEvaluation()) {
			this.afficherListeEvaluations(null, aNumeroEvaluationCreee);
		} else {
			let lIndiceSelection = 0;
			let lListePeriodes;
			if (this._estOngletEvaluationHistorique()) {
				lListePeriodes = this.objeParametres.listeAnneesPrecedentes;
				if (!lListePeriodes.navigation) {
					lListePeriodes.navigation = {};
					lIndiceSelection = lListePeriodes.count() - 1;
					lListePeriodes.navigation.periodeSelection =
						lListePeriodes.count() > 0
							? lListePeriodes.get(lIndiceSelection)
							: null;
				} else {
					lIndiceSelection = lListePeriodes
						.getTabListeElements()
						.indexOf(lListePeriodes.navigation.periodeSelection);
				}
			} else {
				lListePeriodes = this.objeParametres.getListeComboPeriodes([
					TypeHttpPeriode_1.TypeHttpPeriode.TPN_Annee,
					TypeHttpPeriode_1.TypeHttpPeriode.TPN_Trimestres,
					TypeHttpPeriode_1.TypeHttpPeriode.TPN_Semestres,
					TypeHttpPeriode_1.TypeHttpPeriode.TPN_Continue,
					TypeHttpPeriode_1.TypeHttpPeriode.TPN_NonOfficielle,
				]);
				if (
					MethodesObjet_1.MethodesObjet.isUndefined(
						this.etatUilSco.getOnglet().periodeSelection,
					)
				) {
					lIndiceSelection = lListePeriodes.getIndiceParNumeroEtGenre(
						null,
						TypeHttpPeriode_1.TypeHttpPeriode.TPN_Annee,
					);
					this.etatUilSco.getOnglet().periodeSelection =
						lListePeriodes.get(lIndiceSelection);
				} else {
					lIndiceSelection = lListePeriodes
						.getTabListeElements()
						.indexOf(this.etatUilSco.getOnglet().periodeSelection);
				}
				this._remplirComboClasseGroupeNiv();
			}
			if (this.getInstance(this.identSelecteurPeriode)) {
				this.getInstance(this.identSelecteurPeriode).setDonnees(
					lListePeriodes,
					lIndiceSelection,
				);
			}
			if (lListePeriodes.count() === 0) {
				this._evenementSurSelectionPeriode();
			}
		}
	}
	_remplirComboClasseGroupeNiv() {
		const lCombo = this.getInstance(this.identComboClasseGroupeNiv);
		if (
			!lCombo ||
			this._estOngletSaisieEvaluation() ||
			this._estOngletEvaluationHistorique()
		) {
			return;
		}
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		let lAvecClasse = false;
		let lAvecGroup = false;
		let lAvecNiveau = false;
		const lPeriodeNotation = !!this.etatUilSco.getOnglet().periodeSelection
			? this.etatUilSco.getOnglet().periodeSelection.periodeNotation
			: this.etatUilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				);
		this.listeEvaluations.parcourir((aEval) => {
			if (!!lPeriodeNotation) {
				if (
					!DonneesListe_Evaluations_1.DonneesListe_Evaluations.estDansMaPeriodeNotation(
						lPeriodeNotation,
						aEval,
					)
				) {
					return;
				}
			}
			if (aEval.listeClasseGroupeNivPourFiltre) {
				aEval.listeClasseGroupeNivPourFiltre.parcourir((aClasseGroupeNiv) => {
					const lEstDejaDansListe =
						lListe.getElementParElement(aClasseGroupeNiv);
					if (lEstDejaDansListe) {
						return;
					}
					switch (aClasseGroupeNiv.getGenre()) {
						case Enumere_Ressource_1.EGenreRessource.Classe:
							lAvecClasse = true;
							break;
						case Enumere_Ressource_1.EGenreRessource.Groupe:
							lAvecGroup = true;
							break;
						case Enumere_Ressource_1.EGenreRessource.Niveau:
							lAvecNiveau = true;
							break;
					}
					lListe.add(aClasseGroupeNiv);
				});
			}
		});
		if (lAvecClasse) {
			lListe.add(
				this._getElementSeparationCombo(
					ObjetTraduction_1.GTraductions.getValeur("Classe"),
					Enumere_Ressource_1.EGenreRessource.Classe,
				),
			);
		}
		if (lAvecGroup) {
			lListe.add(
				this._getElementSeparationCombo(
					ObjetTraduction_1.GTraductions.getValeur("Groupe"),
					Enumere_Ressource_1.EGenreRessource.Groupe,
				),
			);
		}
		if (lAvecNiveau) {
			lListe.add(
				this._getElementSeparationCombo(
					ObjetTraduction_1.GTraductions.getValeur("Niveau"),
					Enumere_Ressource_1.EGenreRessource.Niveau,
				),
			);
		}
		const lEstComboActif = lListe.count() > 0;
		lCombo.setActif(lEstComboActif);
		lListe.add(
			ObjetElement_1.ObjetElement.create({
				Libelle: ObjetTraduction_1.GTraductions.getValeur(
					"evaluations.toutesLesEvaluations",
				),
				Genre: Enumere_Ressource_1.EGenreRessource.Aucune,
				estTotal: true,
			}),
		);
		lListe.setTri([
			ObjetTri_1.ObjetTri.init(
				(aElement) =>
					aElement.getGenre() !== Enumere_Ressource_1.EGenreRessource.Aucune,
			),
			ObjetTri_1.ObjetTri.init(
				(aElement) =>
					aElement.getGenre() !== Enumere_Ressource_1.EGenreRessource.Classe,
			),
			ObjetTri_1.ObjetTri.init(
				(aElement) =>
					aElement.getGenre() !== Enumere_Ressource_1.EGenreRessource.Groupe,
			),
			ObjetTri_1.ObjetTri.init(
				(aElement) =>
					aElement.getGenre() !== Enumere_Ressource_1.EGenreRessource.Niveau,
			),
			ObjetTri_1.ObjetTri.init((aElement) => aElement.AvecSelection !== false),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListe.trier();
		const lSelection = !!this.etatUilSco.getOnglet().ClasseGroupeNivSelection;
		const lSelectionDansLaListe = lListe.getElementParElement(
			this.etatUilSco.getOnglet().ClasseGroupeNivSelection,
		);
		let lIndice = null;
		if (lSelection && lSelectionDansLaListe) {
			lIndice = lListe.getIndiceParElement(
				this.etatUilSco.getOnglet().ClasseGroupeNivSelection,
			);
		} else {
			lIndice = lListe.get(
				lListe.getIndiceParNumeroEtGenre(
					null,
					Enumere_Ressource_1.EGenreRessource.Aucune,
				),
			);
		}
		lCombo.setDonneesObjetSaisie({
			liste: lListe,
			selection: MethodesObjet_1.MethodesObjet.isNumeric(lIndice) ? lIndice : 0,
		});
	}
	_getElementSeparationCombo(aLibelle, aGenre) {
		return ObjetElement_1.ObjetElement.create({
			Libelle: aLibelle,
			Genre: aGenre,
			AvecSelection: false,
		});
	}
	_dupliquerEvaluation(aEvaluation) {
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUilSco.GenreEspace) ||
			(this.etatUilSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Etablissement &&
				aEvaluation.serviceLVE)
		) {
			if (!aEvaluation.listeServices) {
				new ObjetRequeteListeRessourcesDEvalPourDuplication_1.ObjetRequeteListeRessourcesDEvalPourDuplication(
					this,
				)
					.lancerRequete(aEvaluation)
					.then((aReponse) => {
						this.ouvrirFenetreDupliquerSurServices(aReponse.liste);
					});
			} else {
				this.ouvrirFenetreDupliquerSurServices(aEvaluation.listeServices);
			}
		} else if (this.identFenetreSelectionClasseGroupe) {
			if (!aEvaluation.listeClasses) {
				new ObjetRequeteListeRessourcesDEvalPourDuplication_1.ObjetRequeteListeRessourcesDEvalPourDuplication(
					this,
				)
					.lancerRequete(aEvaluation)
					.then((aReponse) => {
						this.ouvrirFenetreDupliquerSurClassesGroupes(aReponse.liste);
					});
			} else {
				this.ouvrirFenetreDupliquerSurClassesGroupes(aEvaluation.listeClasses);
			}
		}
	}
	_evenementSurSelectionPeriode(aParams) {
		if (
			aParams &&
			aParams.genreEvenement ===
				Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			if (this._estOngletEvaluationHistorique()) {
				this.objeParametres.listeAnneesPrecedentes.periodeSelection =
					aParams.element;
			} else {
				this.etatUilSco.getOnglet().periodeSelection = aParams.element;
			}
			ObjetStyle_1.GStyle.setDisplay(this.idContainerListeEvaluations, true);
			this.afficherListeEvaluations(aParams.element);
			this._remplirComboClasseGroupeNiv();
		}
	}
	_evenementSurSelectionClasseGroupeNiv(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUilSco.getOnglet().ClasseGroupeNivSelection = aParams.element;
			this.afficherListeEvaluations(
				this.etatUilSco.getOnglet().periodeSelection,
			);
		}
	}
	_evenementSurListeServices(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (!!aParametres.article.estService) {
					this.etatUilSco.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
						aParametres.article,
					);
					this._surSelectionServices();
				} else {
					aParametres.instance.setListeElementsSelection(null);
					this.evenementAfficherMessageDepuisListeServices(
						Enumere_Message_1.EGenreMessage.SelectionSousMatiere,
					);
				}
				break;
		}
	}
	_evenementSurListeEvaluations(aParametres) {
		this._desactiverPhotoEleve();
		this.selectionEvaluation.evaluation = this.listeEvaluations.get(
			aParametres.ligne,
		);
		this.actualiserImpressionPDF();
		this.selectionEvaluation.genreEvenement = aParametres.genreEvenement;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				const lEvaluation = this.selectionEvaluation.evaluation;
				this.surSelectionEvaluation(
					lEvaluation.listePiliers,
					lEvaluation.listeServicesLVE,
				);
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._surEvenementCreationEvaluation();
				return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition: {
				const lEvaluationSelectionnee = aParametres.article;
				if (!lEvaluationSelectionnee.enCache) {
					return;
				}
				if (!!lEvaluationSelectionnee.executionQCM) {
					const lCopieEvaluationSelectionnee =
						MethodesObjet_1.MethodesObjet.dupliquer(lEvaluationSelectionnee);
					this.afficheFenetreModificationEvaluationQCM(
						lCopieEvaluationSelectionnee,
					);
				} else {
					if (
						aParametres.idColonne ===
						DonneesListe_Evaluations_1.DonneesListe_Evaluations.colonne.infos
					) {
						this.ouvrirFenetreChangerLeServiceDeLEvaluation(
							lEvaluationSelectionnee,
						);
					} else {
						this.afficherFenetreEvaluation(false);
					}
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression: {
				this._messageSelectionnerEvaluation();
				this.setEtatSaisie(true);
				this.selectionEvaluation.evaluation = null;
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresSuppression: {
				this.valider();
				break;
			}
		}
		return true;
	}
	_desactiverPhotoEleve() {
		this.etatUilSco.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
			null,
		);
		this.activerFichesEleve(false);
	}
	_surEvenementCreationEvaluation() {
		if (!!this.messageCreationEvalImpossible) {
			this.appSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
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
				ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
					pere: lThis,
					options: { largeurMin: 100 },
					initCommandes: function (aInstance) {
						aInstance.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"evaluations.CreerEvaluation",
							),
							true,
							() => {
								lThis.afficherFenetreEvaluation(true);
							},
						);
						aInstance.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"evaluations.CreerEvaluationQCM",
							),
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
	ouvrirFenetreChangerLeServiceDeLEvaluation(aEvaluation) {
		new ObjetRequeteListeServicesDEvalPourRemplacement_1.ObjetRequeteListeServicesDEvalPourRemplacement(
			this,
		)
			.lancerRequete(aEvaluation)
			.then((aReponse) => {
				this.surRecuperationListeServicesPourChangementServiceDEvaluation(
					aEvaluation,
					aReponse.listeServices,
				);
			});
	}
	surRecuperationListeServicesPourChangementServiceDEvaluation(
		aEvaluation,
		aListeServicesRequete,
	) {
		if (!!aListeServicesRequete && aListeServicesRequete.count() > 0) {
			const lThis = this;
			const lObjFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionServicesDEvaluation_1.ObjetFenetre_SelectionServicesDEvaluation,
				{
					pere: lThis,
					evenement: function (aListeServicesSelectionnes, aNumeroBouton) {
						if (aNumeroBouton === 1) {
							if (
								!!aListeServicesSelectionnes &&
								aListeServicesSelectionnes.count() > 0
							) {
								lThis.surChangementServiceDEvaluation(
									aEvaluation,
									aListeServicesSelectionnes.get(0),
								);
							}
						}
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"competences.selectionnerService",
							),
						});
					},
				},
			);
			lObjFenetre.setDonnees(
				aListeServicesRequete,
				false,
				!this.etatUilSco.pourPrimaire(),
			);
		} else {
			this.appSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"evaluations.MsgAucunServiceDisponiblePourRemplacement",
					),
				});
		}
	}
	surChangementServiceDEvaluation(aEvaluation, aService) {
		if (!!aEvaluation && !!aService) {
			aEvaluation.informations = aService.getLibelle();
			aEvaluation.service = MethodesObjet_1.MethodesObjet.dupliquer(aService);
			aEvaluation.service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aEvaluation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identListeEvaluations).actualiser(true);
		}
	}
	_initialiserCompetencesParEvaluation(aInstance) {
		aInstance.setOptionsAffichageListe({
			avecOptionAfficherProjetsAcc: !this._estOngletEvaluationHistorique(),
		});
	}
	creerEvaluationVide() {
		const lEvaluation = new ObjetElement_1.ObjetElement(
			"",
			Enumere_Ressource_1.EGenreRessource.Evaluation,
		);
		lEvaluation.avecSaisie = true;
		lEvaluation.dateValidation = ObjetDate_1.GDate.getDateCourante();
		lEvaluation.datePublication =
			ObjetUtilitaireEvaluation_1.ObjetUtilitaireEvaluation.getDatePublicationEvaluationParDefaut(
				lEvaluation.dateValidation,
			);
		lEvaluation.descriptif = "";
		lEvaluation.periode = this.etatUilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		lEvaluation.periodeSecondaire = new ObjetElement_1.ObjetElement("");
		lEvaluation.listePeriodes = MethodesObjet_1.MethodesObjet.dupliquer(
			this.listePeriodes,
		);
		lEvaluation.listeEleves = new ObjetListeElements_1.ObjetListeElements();
		lEvaluation.listePaliers = new ObjetListeElements_1.ObjetListeElements();
		lEvaluation.listeCompetences =
			new ObjetListeElements_1.ObjetListeElements();
		lEvaluation.listeSujets = new ObjetListeElements_1.ObjetListeElements();
		lEvaluation.listeCorriges = new ObjetListeElements_1.ObjetListeElements();
		lEvaluation.coefficient = 1;
		lEvaluation.priseEnCompteDansBilan = true;
		lEvaluation.service = this.etatUilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Service,
		);
		if (lEvaluation.service) {
			lEvaluation.service.estServiceLVE = this.serviceNavigationEstLVE;
		}
		lEvaluation.listeServicesLVE = this.listeServicesLVE;
		lEvaluation.libelleCBTheme = ObjetTraduction_1.GTraductions.getValeur(
			"Theme.libelleCB.evaluation",
		);
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Administrateur,
			].includes(this.etatUilSco.GenreEspace)
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
		lEvaluation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lEvaluation;
	}
	_qCMEstCompatibleAvecLeService(aQCM, aService) {
		let lEstCompatible = false;
		if (
			aQCM.getGenre() === Enumere_Ressource_1.EGenreRessource.QCM &&
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
	_getEvaluationModelePourDuplication() {
		const lEvaluationModele = MethodesObjet_1.MethodesObjet.dupliquer(
			this.selectionEvaluation.evaluation,
		);
		lEvaluationModele.dupliquerDepuis = this.selectionEvaluation.evaluation;
		lEvaluationModele.listePiliers = null;
		lEvaluationModele.listeEleves = null;
		lEvaluationModele.enCache = false;
		lEvaluationModele.resultats = null;
		lEvaluationModele.hintResultats = null;
		lEvaluationModele.moyenneResultats = null;
		lEvaluationModele.Genre = Enumere_Ressource_1.EGenreRessource.Evaluation;
		lEvaluationModele.Numero = null;
		lEvaluationModele.Etat = Enumere_Etat_1.EGenreEtat.Aucun;
		return lEvaluationModele;
	}
	_surSaisieEvaluations(aReponse) {
		var _a, _b;
		let lNumeroEvaluationASelectionnee;
		if (
			((_b =
				(_a =
					aReponse === null || aReponse === void 0
						? void 0
						: aReponse.JSONRapportSaisie) === null || _a === void 0
					? void 0
					: _a.listeEvaluationsCreees) === null || _b === void 0
				? void 0
				: _b.count()) > 0
		) {
			const lEvaluationCreee =
				aReponse.JSONRapportSaisie.listeEvaluationsCreees.getPremierElement();
			if (!!lEvaluationCreee) {
				lNumeroEvaluationASelectionnee = lEvaluationCreee.getNumero();
			}
		}
		this.actionSurValidation(lNumeroEvaluationASelectionnee);
	}
}
exports.InterfacePageListeEvaluations = InterfacePageListeEvaluations;
