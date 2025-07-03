exports._PageReleveEvaluations = void 0;
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const ObjetRequeteAssistantSaisie_1 = require("ObjetRequeteAssistantSaisie");
const MultipleObjetRequeteSaisieReleveDEvaluations = require("ObjetRequeteSaisieReleveDEvaluations");
const MethodesObjet_1 = require("MethodesObjet");
const MethodesTableau_1 = require("MethodesTableau");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SaisieMessage_1 = require("ObjetFenetre_SaisieMessage");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const DonneesListe_ReleveDEvaluations_1 = require("DonneesListe_ReleveDEvaluations");
const Enumere_NiveauDAcquisition_1 = require("Enumere_NiveauDAcquisition");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_AssistantSaisie_1 = require("ObjetFenetre_AssistantSaisie");
const EBoutonFenetreAssistantSaisie_1 = require("EBoutonFenetreAssistantSaisie");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetRequeteReleveDEvaluations_1 = require("ObjetRequeteReleveDEvaluations");
const TypeGenreAppreciation_1 = require("TypeGenreAppreciation");
const TypeGenreValidationCompetence_1 = require("TypeGenreValidationCompetence");
const TypeModeValidationAuto_1 = require("TypeModeValidationAuto");
const UtilitaireCompetences_1 = require("UtilitaireCompetences");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetFenetre_ParametresReleveDEvaluations_1 = require("ObjetFenetre_ParametresReleveDEvaluations");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const ObjetRequeteDetailEvaluationsCompetences_1 = require("ObjetRequeteDetailEvaluationsCompetences");
const ObjetFenetre_DetailEvaluationsCompetences_1 = require("ObjetFenetre_DetailEvaluationsCompetences");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetMoteurAssistantSaisie_1 = require("ObjetMoteurAssistantSaisie");
const ObjetFenetre_DocumentsEleve_1 = require("ObjetFenetre_DocumentsEleve");
class _PageReleveEvaluations extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		const lPrefixeIds = "releveDEvaluations_";
		this.typeAffichage = undefined;
		this.constantes = {
			TypesTri: {
				ParEvaluation: 0,
				ParDate: 1,
				ParCompetence: 2,
				ParMatiere: 3,
			},
			TypesEvolution: { Aucun: 0, TauxReussite: 1, Score: 2 },
			TypesContexteReleveEvaluations: { Releve: 0, EltsCompNivAcq: 1 },
		};
		this.parametres = {
			affichage: {
				afficheJaugeChronologique: false,
				modeCompact: false,
				modeMultiLigne: true,
				parOrdreChronologique: true,
				ordreColonnes: this.constantes.TypesTri.ParDate,
				avecSynthese: true,
				avecPourcentageAcqui: true,
				avecPositionnementLSUNiveau: true,
				avecPositionnementPrecedents: false,
				avecPositionnementLSUNote: true,
				avecNiveauMaitriseDomaine: true,
				avecAppreciations: true,
				avecSimuCalculPositionnement: false,
				avecRegroupementParDomaine: !this.etatUtilisateurSco.pourPrimaire(),
				avecEvaluationsCoeffNul: true,
				avecEvaluationsHistoriques: false,
				avecProjetsAccompagnement: false,
				typeEvolution: this.constantes.TypesEvolution.Aucun,
				toleranceEvolution: 0,
				typeContexteReleveEvaluations:
					this.constantes.TypesContexteReleveEvaluations.Releve,
			},
			droits: {
				tailleMaxAppreciationEleve:
					this.parametresSco.getTailleMaxAppreciationParEnumere(
						TypeGenreAppreciation_1.TypeGenreAppreciation
							.GA_Bulletin_Professeur,
					),
				tailleMaxAppreciationClasse:
					this.parametresSco.getTailleMaxAppreciationParEnumere(
						TypeGenreAppreciation_1.TypeGenreAppreciation.GA_Bulletin_Generale,
					),
			},
			hauteurs: { piedDePage: 150 },
			id: {
				page: lPrefixeIds + "page",
				piedPage: lPrefixeIds + "pied",
				labelAppreciationClasse: lPrefixeIds + "appreciationClasse",
			},
		};
		this.donnees = {
			nbLignesDEntete: 1,
			avecColonne: {
				appreciation: true,
				posLSUNiveau: false,
				posLSUNote: false,
				nivAcquiPilier: false,
				pourcentageAcqui: true,
				evolution: false,
			},
			avecBtnCalculPositionnementClasse: false,
			avecBoutonPosLSUParNiveau: false,
			avecBoutonPosLSUParNote: false,
			avecBoutonNivAcquiPilier: false,
			listeColonnesLSL: new ObjetListeElements_1.ObjetListeElements(),
			listeColonnesPosPrecedents: new ObjetListeElements_1.ObjetListeElements(),
			listeColonnesSimulations: new ObjetListeElements_1.ObjetListeElements(),
			listeColonnesDEvaluations: new ObjetListeElements_1.ObjetListeElements(),
			listeColonnesAppreciations: new ObjetListeElements_1.ObjetListeElements(),
			listeColonnesRESIAffichables:
				new ObjetListeElements_1.ObjetListeElements(),
			hintColonnePourcentageAcquis: "",
			appreciationClasse: undefined,
			listeElementsProgramme: undefined,
			elementsProgrammeEditable: false,
			elementsProgrammeCloture: false,
			listeEleves: new ObjetListeElements_1.ObjetListeElements(),
			listeTypeAppreciations: new ObjetListeElements_1.ObjetListeElements(),
			dateDebut: null,
			dateFin: null,
			listeTypeContextesDispos: null,
		};
		this.moteurAssSaisie =
			new ObjetMoteurAssistantSaisie_1.ObjetMoteurAssistantSaisie();
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._evenementSurDernierMenuDeroulant,
			this._initialiserMenuDeroulant,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe.bind(this),
			this._initialiserListe.bind(this),
		);
		this.identFenetreParametres = this.addFenetre(
			ObjetFenetre_ParametresReleveDEvaluations_1.ObjetFenetre_ParametresReleveDEvaluations,
			this._evenementFenetreParametres.bind(this),
			this._initFenetreParametres,
		);
		this.identFenetreAssistantSaisie = this.add(
			ObjetFenetre_AssistantSaisie_1.ObjetFenetre_AssistantSaisie,
			this._evenementFenetreAssistantSaisie,
			this._initialiserFenetreAssistantSaisie,
		);
		this.construireFicheEleveEtFichePhoto();
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
		if (!!this.identDateDebut && !!this.identDateFin) {
			this.AddSurZone.push(
				{ html: ObjetTraduction_1.GTraductions.getValeur("Du") },
				this.identDateDebut,
				{ html: ObjetTraduction_1.GTraductions.getValeur("Au") },
				this.identDateFin,
			);
		}
		if (
			[
				ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
					.TypeAffichage.AffichageParService,
			].includes(this.typeAffichage)
		) {
			this.AddSurZone.push({
				html: IE.jsx.str("span", {
					"ie-html": this.jsxGetHtmlInformationCloture.bind(this),
				}),
			});
		}
		if (this.etatUtilisateurSco.pourPrimaire()) {
			this.AddSurZone.push({
				html: IE.jsx.str(
					"ie-bouton",
					{
						"ie-model":
							this.jsxModeleBoutonCalculerTousLesPositionnements.bind(this),
						"ie-display":
							this.jsxDisplayBoutonCalculerTousLesPositionnements.bind(this),
						class: [
							Type_ThemeBouton_1.TypeThemeBouton.primaire,
							"MargeGauche",
							"small-bt",
						],
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.CalculerLesPositionnementsDeMaClasse",
					),
				),
			});
		}
		this.AddSurZone.push({ blocGauche: true });
		this.AddSurZone.push({
			html: IE.jsx.str("ie-combo", {
				"ie-controlesaisie": true,
				"ie-model": this.jsxComboModelTypeContexteAffichage.bind(this),
				"ie-display": this.jsxDisplayComboTypeContexteAffichage.bind(this),
				class: "MargeDroit",
			}),
		});
		if (this.avecOptionCompacterLignes()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnCompacterLignes(
					this.jsxModeleBoutonCompacterLignes.bind(this),
				),
			});
		}
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnCompacterColonnes(
				this.jsxModeleBoutonCompacterColonnes.bind(this),
			),
		});
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnTriOrdreChronologique(
				this.jsxModeleBoutonTriEvaluations.bind(this),
			),
		});
		this.addSurZonePhotoEleve();
		if (this.avecAssistantSaisie()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAssistantSaisie(
					this.jsxModeleBoutonAssistantSaisie.bind(this),
				),
			});
		}
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
				this.jsxModeleBoutonOptionsAffichage.bind(this),
			),
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	jsxGetHtmlInformationCloture() {
		return this.strInfoCloture ? this.strInfoCloture : "";
	}
	jsxDisplayBoutonCalculerTousLesPositionnements() {
		return !!this.donnees.avecBtnCalculPositionnementClasse;
	}
	jsxModeleBoutonCalculerTousLesPositionnements() {
		return {
			event: () => {
				const lParamsCalculAuto = {
					instance: this,
					modeValidationAuto:
						TypeModeValidationAuto_1.TypeModeValidationAuto
							.tmva_PosSansNoteSelonEvaluation,
					avecChoixCalcul: true,
					messageRestrictionsSurCalculAuto: null,
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAutoPositionnement.titreTousLesPositionnements",
					),
					calculMultiServices: true,
				};
				UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
					lParamsCalculAuto,
				);
			},
		};
	}
	jsxDisplayComboTypeContexteAffichage() {
		return (
			this.donnees.listeTypeContextesDispos &&
			this.donnees.listeTypeContextesDispos.count() > 1
		);
	}
	jsxComboModelTypeContexteAffichage() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
						"competences.wai.selectionnezAffichage",
					),
				});
			},
			getDonnees: (aListe) => {
				return this.donnees.listeTypeContextesDispos;
			},
			getIndiceSelection: () => {
				let lIndice = 0;
				if (this.donnees.listeTypeContextesDispos) {
					lIndice =
						this.donnees.listeTypeContextesDispos.getIndiceElementParFiltre(
							(D) => {
								return (
									D.getGenre() ===
									this.parametres.affichage.typeContexteReleveEvaluations
								);
							},
						);
				}
				return Math.max(lIndice, 0);
			},
			event: (aParams) => {
				if (aParams.estSelectionManuelle && aParams.element) {
					this.parametres.affichage.typeContexteReleveEvaluations =
						aParams.element.getGenre();
					this.afficherPage();
				}
			},
		};
	}
	jsxModeleBoutonCompacterLignes() {
		return {
			event: () => {
				this.parametres.affichage.modeMultiLigne =
					!this.parametres.affichage.modeMultiLigne;
				this._actualiserListe();
			},
			getTitle: () => {
				if (this.parametres.affichage.modeMultiLigne) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.parametres.AffichageModeSimpleLigne",
					);
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AffichageModeMultiLigne",
				);
			},
			getSelection: () => {
				return !this.parametres.affichage.modeMultiLigne;
			},
		};
	}
	jsxModeleBoutonCompacterColonnes() {
		return {
			event: () => {
				this.parametres.affichage.modeCompact =
					!this.parametres.affichage.modeCompact;
				this._actualiserListe();
			},
			getTitle: () => {
				if (this.parametres.affichage.modeCompact) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.parametres.AffichageModeNormal",
					);
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.AffichageModeCompact",
				);
			},
			getSelection: () => {
				return this.parametres.affichage.modeCompact;
			},
		};
	}
	jsxModeleBoutonTriEvaluations() {
		return {
			event: () => {
				this.parametres.affichage.parOrdreChronologique =
					!this.parametres.affichage.parOrdreChronologique;
				if (this.getEtatSaisie() === true) {
					(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
						this.afficherPage,
					);
				} else {
					this.afficherPage();
				}
			},
			getTitle: () => {
				if (this.parametres.affichage.parOrdreChronologique) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.parametres.ParOrdreChronologiqueInverse",
					);
				}
				return ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.ParOrdreChronologique",
				);
			},
			getSelection: () => {
				return this.parametres.affichage.parOrdreChronologique;
			},
		};
	}
	jsxModeleBoutonAssistantSaisie() {
		return {
			event: () => {
				this.moteurAssSaisie.evntBtnAssistant({
					instanceListe: this.getInstance(this.identListe),
					instancePied: null,
				});
			},
			getTitle: () => {
				return this.moteurAssSaisie.getTitleBoutonAssistantSaisie();
			},
			getSelection: () => {
				return this.etatUtilisateurSco.assistantSaisieActif;
			},
		};
	}
	jsxModeleBoutonOptionsAffichage() {
		return {
			event: () => {
				const lFenetreParametres = this.getInstance(
					this.identFenetreParametres,
				);
				lFenetreParametres.setOptionsAffichage({
					avecSynthese: this.parametres.affichage.avecSynthese,
					avecPourcentageAcqui: this.parametres.affichage.avecPourcentageAcqui,
					avecPositionnementLSUNiveau:
						this.parametres.affichage.avecPositionnementLSUNiveau,
					avecPositionnementPrecedents:
						this.parametres.affichage.avecPositionnementPrecedents,
					avecPositionnementLSUNote:
						this.parametres.affichage.avecPositionnementLSUNote,
					avecNiveauMaitriseDomaine:
						this.parametres.affichage.avecNiveauMaitriseDomaine,
					avecAppreciations: this.parametres.affichage.avecAppreciations,
					avecSimuCalculPositionnement:
						this.parametres.affichage.avecSimuCalculPositionnement,
					avecRegroupementParDomaine:
						this.parametres.affichage.avecRegroupementParDomaine,
					avecEvaluationsCoeffNul:
						this.parametres.affichage.avecEvaluationsCoeffNul,
					avecEvaluationsHistoriques:
						this.parametres.affichage.avecEvaluationsHistoriques,
					avecProjetsAccompagnement:
						this.parametres.affichage.avecProjetsAccompagnement,
					ordreColonnes: this.parametres.affichage.ordreColonnes,
					typeEvolution: this.parametres.affichage.typeEvolution,
					toleranceEvolution: this.parametres.affichage.toleranceEvolution,
				});
				lFenetreParametres.actualiser();
				lFenetreParametres.afficher();
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.parametres.ParametresDAffichage",
				);
			},
			getSelection: () => {
				return this.getInstance(this.identFenetreParametres).estAffiche();
			},
		};
	}
	estPilierLVESelectionne() {
		const lPilierConcerne = this.etatUtilisateurSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Pilier,
		);
		return !!lPilierConcerne && !!lPilierConcerne.estPilierLVE;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.parametres.id.page,
					class: "EspaceDroit EspaceGauche",
					style: ObjetStyle_1.GStyle.composeHeight(100, "%"),
				},
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListe),
					class: "p-top",
					style: ObjetStyle_1.GStyle.composeHeightCalc(
						this.parametres.hauteurs.piedDePage,
					),
				}),
				IE.jsx.str(
					"div",
					{
						id: this.parametres.id.piedPage,
						style:
							ObjetStyle_1.GStyle.composeHeight(
								this.parametres.hauteurs.piedDePage,
							) + "display: none;",
					},
					this._composePiedDePage(),
				),
			),
		);
		return H.join("");
	}
	_composePiedDePage() {
		return [].join("");
	}
	estPiedDePageVisible() {
		return false;
	}
	actualiserDonneesPiedDePage() {}
	evenementAfficherMessage(aGenreMessage) {
		if (this.parametres.id.piedPage) {
			ObjetHtml_1.GHtml.setDisplay(this.parametres.id.piedPage, false);
		}
		this._evenementAfficherMessage(aGenreMessage);
	}
	avecOptionCompacterLignes() {
		return false;
	}
	afficherPage() {
		this.setEtatSaisie(false);
		const lParametresRequete = Object.assign(
			{
				typeReleveEvaluations: this.typeAffichage,
				typeContexteReleveEvaluations:
					this.parametres.affichage.typeContexteReleveEvaluations,
				ressource: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
				),
				periode: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
				parOrdreChrono: this.parametres.affichage.parOrdreChronologique,
				avecRegroupementParDomaine:
					this.parametres.affichage.avecRegroupementParDomaine,
				avecEvaluationsCoeffNul:
					this.parametres.affichage.avecEvaluationsCoeffNul,
				avecEvaluationsHistoriques:
					this.parametres.affichage.avecEvaluationsHistoriques,
				avecProjetsAccompagnement:
					this.parametres.affichage.avecProjetsAccompagnement,
				ordreColonnes: this.parametres.affichage.ordreColonnes,
				typeEvolution: this.parametres.affichage.typeEvolution,
				toleranceEvolution: this.parametres.affichage.toleranceEvolution,
			},
			this._getParametresSupplementairesRequetes(),
		);
		new ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations(
			this,
			this._surRecupererDonnees.bind(this),
		).lancerRequete(lParametresRequete);
	}
	_evenementSurDernierMenuDeroulant() {
		this.afficherPage();
	}
	_modifierNotePositionnement(aNote) {
		this._appliquerModificationSelectionCourante(aNote, (aSelection) => {
			if (
				aSelection.idColonne ===
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.pos_lsu_note
			) {
				aSelection.article.posLSUNote = aNote;
				return true;
			}
		});
	}
	_modifierNiveauPositionnement(aNiveau) {
		this._appliquerModificationSelectionCourante(aNiveau, (aSelection) => {
			if (
				aSelection.idColonne ===
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.pos_lsu_niveau
			) {
				aSelection.article.posLSUNiveau = aNiveau;
				aSelection.article.posLSUNiveau.setEtat(
					Enumere_Etat_1.EGenreEtat.Modification,
				);
				return true;
			}
		});
	}
	_modifierNiveauAcquiDomaine(aNiveau) {
		this._appliquerModificationSelectionCourante(aNiveau, (aSelection) => {
			let lObservation;
			if (!!aSelection.article.nivAcquiPilier) {
				lObservation = aSelection.article.nivAcquiPilier.observation;
			}
			aSelection.article.nivAcquiPilier =
				MethodesObjet_1.MethodesObjet.dupliquer(aNiveau);
			if (!!lObservation) {
				aSelection.article.nivAcquiPilier.observation = lObservation;
			}
			aSelection.article.nivAcquiPilier.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			return true;
		});
	}
	_getBoutonsListe() {
		return null;
	}
	avecAssistantSaisie() {
		return false;
	}
	requeteDonneesAssistantSaisie(aCallback) {
		new ObjetRequeteAssistantSaisie_1.ObjetRequeteAssistantSaisie(
			this,
			this.actionSurRequeteDonneesAssistantSaisie.bind(this, aCallback),
		).lancerRequete();
	}
	actionSurRequeteDonneesAssistantSaisie(aCallback, aListeTypesAppreciations) {
		this.donnees.listeTypeAppreciations =
			aListeTypesAppreciations || new ObjetListeElements_1.ObjetListeElements();
		aCallback();
	}
	ouvrirFenetreAssistantSaisie(aSelectionMultiple, aRangAppreciation) {
		const lInstanceFenetre = this.getInstance(this.identFenetreAssistantSaisie);
		lInstanceFenetre.setParametres({
			avecCheckBoxNePasUtiliserAssistant:
				this.etatUtilisateurSco.assistantSaisieActif,
			avecBoutonPasserEnSaisie: !aSelectionMultiple,
			rangAppreciations: aRangAppreciation,
		});
		const lListeAppreciationsParRang =
			this.donnees.listeTypeAppreciations.getListeElements((D) => {
				return D.getGenre() === aRangAppreciation - 1;
			});
		lInstanceFenetre.setDonnees(lListeAppreciationsParRang);
	}
	_initialiserFenetreAssistantSaisie(aInstance) {
		aInstance.setParametres({
			tailleMaxAppreciation: this.parametres.droits.tailleMaxAppreciationEleve,
		});
		aInstance.setOptionsFenetre({ largeur: 700, hauteur: 300 });
	}
	_evenementFenetreAssistantSaisie(aNumeroBouton) {
		const lParam = {
			instanceFenetreAssistantSaisie: this.getInstance(
				this.identFenetreAssistantSaisie,
			),
			eventChangementUtiliserAssSaisie: () => {
				this.getInstance(this.identListe).actualiser(true);
			},
			evntClbck: this._surEvntAssSaisie.bind(this),
		};
		this.moteurAssSaisie.evenementAssistantSaisie(aNumeroBouton, lParam);
	}
	valider() {
		if (MultipleObjetRequeteSaisieReleveDEvaluations) {
			const lDonneesSaisies = Object.assign(
				{
					listeEleves: this.donnees.listeEleves,
					listeTypeAppreciations: this.donnees.listeTypeAppreciations,
				},
				this._getParametresSupplementairesRequetes(true),
			);
			if (!!this.donnees.appreciationClasse) {
				lDonneesSaisies.appreciationClasse = this.donnees.appreciationClasse;
			}
			new MultipleObjetRequeteSaisieReleveDEvaluations.ObjetRequeteSaisieReleveDEvaluations(
				this,
				this.actionSurValidation,
			).lancerRequete(lDonneesSaisies);
		}
	}
	_surEvntAssSaisie(aParam) {
		let lClbck;
		switch (aParam.cmd) {
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.Valider:
				lClbck = () => {
					this._surValidationAssistantSaisie(
						aParam.eltSelectionne,
						aParam.rangAppr,
					);
				};
				break;
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie
				.PasserEnSaisie: {
				lClbck = () => {
					this.moteurAssSaisie.passerEnSaisie({
						instanceListe: this.getInstance(this.identListe),
						idColonne:
							DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
								.colonnes.prefixe_appreciations + aParam.rangAppr,
					});
				};
				break;
			}
			case EBoutonFenetreAssistantSaisie_1.EBoutonFenetreAssistantSaisie.Fermer:
				break;
		}
		this.moteurAssSaisie.saisirModifAssSaisieAvantTraitement({
			estAssistantModifie: false,
			pere: this,
			clbck: lClbck,
		});
	}
	_surRecupererDonnees(aParams) {
		this.strInfoCloture = aParams.strInfoCloture || "";
		this.donnees.listeTypeContextesDispos = aParams.listeTypeContextesDispos;
		this.donnees.nbLignesDEntete = aParams.nbLignesDEntete;
		this.donnees.avecColonne.pourcentageAcqui = aParams.avecColonnePercentAcqui;
		this.donnees.avecColonne.posLSUNiveau = aParams.avecColonnePosLSUNiveau;
		this.donnees.avecColonne.posLSUNote = aParams.avecColonnePosLSUNote;
		this.donnees.avecColonne.nivAcquiPilier = aParams.avecColonneNivAcquiPilier;
		this.donnees.avecColonne.evolution = aParams.avecColonneEvolution;
		this.donnees.avecBtnCalculPositionnementClasse =
			aParams.avecBtnCalculPositionnementClasse;
		this.donnees.avecBoutonPosLSUParNiveau = aParams.avecBoutonPosLSUNiveau;
		this.donnees.avecBoutonPosLSUParNote = aParams.avecBoutonPosLSUNote;
		this.donnees.avecBoutonNivAcquiPilier = aParams.avecBoutonNivAcquiPilier;
		this.donnees.listeColonnesLSL = aParams.listeColonnesLSL;
		this.donnees.listeColonnesPosPrecedents =
			aParams.listeColonnesPosPrecedents;
		this.donnees.listeColonnesSimulations = aParams.listeColonnesSimulations;
		this.donnees.listeColonnesDEvaluations = aParams.listeColonnesEvaluations;
		this.donnees.listeColonnesAppreciations =
			aParams.listeColonnesAppreciations;
		this.donnees.listeColonnesRESIAffichables =
			aParams.listeColonnesRESIAffichables;
		this.donnees.hintColonnePourcentageAcquis =
			aParams.hintColonnePourcentageAcquis;
		if (!!aParams.piedPage) {
			this.donnees.appreciationClasse = aParams.piedPage.appreciationClasse;
			this.donnees.listeElementsProgramme =
				aParams.piedPage.listeElementsProgramme;
			this.donnees.elementsProgrammeEditable =
				aParams.piedPage.elementsProgrammeEditable;
			this.donnees.elementsProgrammeCloture =
				aParams.piedPage.elementsProgrammeCloture;
		}
		this.donnees.listeEleves = aParams.listeEleves;
		if (!!aParams.constantes) {
			if (!!aParams.constantes.TypeTri) {
				this.constantes.TypesTri.ParEvaluation =
					aParams.constantes.TypeTri.parEvaluation;
				this.constantes.TypesTri.ParDate = aParams.constantes.TypeTri.parDate;
				this.constantes.TypesTri.ParCompetence =
					aParams.constantes.TypeTri.parCompetence;
				this.constantes.TypesTri.ParMatiere =
					aParams.constantes.TypeTri.parMatiere;
			}
			if (!!aParams.constantes.TypeEvolution) {
				this.constantes.TypesEvolution.Aucun =
					aParams.constantes.TypeEvolution.aucun;
				this.constantes.TypesEvolution.TauxReussite =
					aParams.constantes.TypeEvolution.tauxReussite;
				this.constantes.TypesEvolution.Score =
					aParams.constantes.TypeEvolution.score;
			}
			if (!!aParams.constantes.TypeContexteReleveEvaluations) {
				this.constantes.TypesContexteReleveEvaluations.Releve =
					aParams.constantes.TypeContexteReleveEvaluations.releve;
				this.constantes.TypesContexteReleveEvaluations.EltsCompNivAcq =
					aParams.constantes.TypeContexteReleveEvaluations.eltsCompNivAcq;
			}
		}
		if (
			this.parametres.affichage.ordreColonnes !==
				this.constantes.TypesTri.ParEvaluation &&
			this.parametres.affichage.ordreColonnes !==
				this.constantes.TypesTri.ParCompetence &&
			this.parametres.affichage.ordreColonnes !==
				this.constantes.TypesTri.ParMatiere
		) {
			this.parametres.affichage.ordreColonnes =
				this.constantes.TypesTri.ParDate;
		}
		this._structurerDonnees(
			this.donnees.listeEleves,
			this.donnees.listeColonnesDEvaluations,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.parametres.id.piedPage,
			this.estPiedDePageVisible(),
		);
		if (this.estPiedDePageVisible()) {
			this.actualiserDonneesPiedDePage();
		}
		if (this.avecAssistantSaisie()) {
			this.requeteDonneesAssistantSaisie(this._actualiserListe.bind(this));
		} else {
			this._actualiserListe();
		}
	}
	_structurerDonnees(aListeEleves, aListeColonnesEvaluations) {
		const lListeCompetenceEvaluation = [];
		const lCacheColonnesJumelles = {};
		let lKey;
		if (aListeColonnesEvaluations) {
			aListeColonnesEvaluations.parcourir((D, aIndex) => {
				lListeCompetenceEvaluation.push({
					numeroRESI: D.getNumero(),
					posChronologique: D.posChronologique,
				});
				lKey = D.getNumero();
				if (!lCacheColonnesJumelles[lKey]) {
					lCacheColonnesJumelles[lKey] = [];
				}
				lCacheColonnesJumelles[lKey].push(aIndex);
			});
			lListeCompetenceEvaluation.forEach((D, aIndex) => {
				const lKey = D.numeroRESI;
				const lArrayFromCache = lCacheColonnesJumelles[lKey].slice(0);
				if (lArrayFromCache.length > 1) {
					MethodesTableau_1.MethodesTableau.remove(lArrayFromCache, aIndex);
					D.colonnesJumelles = lArrayFromCache;
				}
			});
		}
		if (aListeEleves) {
			aListeEleves.parcourir((aEleve) => {
				if (aEleve.listeNiveauxDAcquisitions) {
					aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau, aIndex) => {
						aNiveau.posChronologique =
							lListeCompetenceEvaluation[aIndex].posChronologique;
						aNiveau.numeroRESI = lListeCompetenceEvaluation[aIndex].numeroRESI;
						aNiveau.colonnesJumelles =
							lListeCompetenceEvaluation[aIndex].colonnesJumelles;
					});
					this._composeListeNiveauxSynthese(aEleve);
				}
				if (aEleve.listeValeursColonnesLSL) {
					aEleve.listeValeursColonnesLSL.parcourir((aValeurColonneLSL) => {
						if (aValeurColonneLSL.listeNiveauxDAcquisitions) {
							aValeurColonneLSL.listeNiveauxDAcquisitions =
								UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
									aValeurColonneLSL.listeNiveauxDAcquisitions,
								);
							aValeurColonneLSL.hintNiveauxDAcquisitions =
								UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
									aValeurColonneLSL.listeNiveauxDAcquisitions,
								);
						}
					});
				}
			});
		}
	}
	_composeListeNiveauxSynthese(aEleve) {
		aEleve.listeNiveauxSyntheseChrono =
			new ObjetListeElements_1.ObjetListeElements();
		aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau) => {
			if (
				aNiveau.getGenre() >=
				Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
			) {
				aEleve.listeNiveauxSyntheseChrono.addElement(
					MethodesObjet_1.MethodesObjet.dupliquer(aNiveau),
				);
			}
		});
		aEleve.listeNiveauxSyntheseParNiveau =
			UtilitaireCompetences_1.TUtilitaireCompetences.regroupeNiveauxDAcquisitions(
				aEleve.listeNiveauxDAcquisitions,
			);
		let lColonnesJumellesTraitees = [];
		aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau, aIndex) => {
			if (!!aNiveau.colonnesJumelles && aNiveau.colonnesJumelles.length > 0) {
				if (lColonnesJumellesTraitees.includes(aIndex)) {
					if (
						aNiveau.getGenre() >=
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
					) {
						const lIndex =
							aEleve.listeNiveauxSyntheseChrono.getIndiceElementParFiltre(
								(D) => {
									return (
										D.getNumero() === aNiveau.getNumero() &&
										D.posChronologique === aNiveau.posChronologique
									);
								},
							);
						if (
							lIndex > -1 &&
							lIndex < aEleve.listeNiveauxSyntheseChrono.count()
						) {
							aEleve.listeNiveauxSyntheseChrono.remove(lIndex);
						}
					}
				}
				if (!lColonnesJumellesTraitees.includes(aIndex)) {
					if (
						aNiveau.getGenre() >=
						Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
					) {
						const lSynthese =
							aEleve.listeNiveauxSyntheseParNiveau.getElementParGenre(
								aNiveau.getGenre(),
							);
						if (lSynthese) {
							const lValeurNiveau =
								aNiveau.coeff !== undefined && aNiveau.coeff !== null
									? aNiveau.coeff
									: 1;
							lSynthese.nbr -= aNiveau.colonnesJumelles.length * lValeurNiveau;
						}
					}
				}
				if (!lColonnesJumellesTraitees.includes(aIndex)) {
					lColonnesJumellesTraitees.push(aIndex);
					aNiveau.colonnesJumelles.forEach((aIndexJumelle) => {
						lColonnesJumellesTraitees.push(aIndexJumelle);
					});
				}
			}
		});
		aEleve.listeNiveauxSyntheseChrono.setTri([
			ObjetTri_1.ObjetTri.init("posChronologique"),
		]);
		aEleve.listeNiveauxSyntheseChrono.trier();
		aEleve.hintSyntheseChrono =
			UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionChronologique(
				aEleve.listeNiveauxSyntheseChrono,
			);
		aEleve.hintSyntheseParNiveau =
			UtilitaireCompetences_1.TUtilitaireCompetences.getDefaultHintBarreNiveauDAcquisitionParNiveauOuPastille(
				aEleve.listeNiveauxSyntheseParNiveau,
			);
		aEleve.moyenneSynthese =
			UtilitaireCompetences_1.TUtilitaireCompetences.getMoyenneBarreNiveauDAcquisition(
				aEleve.listeNiveauxSyntheseParNiveau,
			);
		let lNbNiveauxAcquis = 0,
			lNbEvaluationsNotees = 0;
		lColonnesJumellesTraitees = [];
		aEleve.listeNiveauxDAcquisitions.parcourir((aNiveau, aIndex) => {
			let lTraitementNiveau = true;
			if (
				!!aNiveau.colonnesJumelles &&
				aNiveau.colonnesJumelles.length > 0 &&
				lColonnesJumellesTraitees.includes(aIndex)
			) {
				lTraitementNiveau = false;
			}
			if (lTraitementNiveau) {
				if (
					UtilitaireCompetences_1.TUtilitaireCompetences.estNotantPourTxReussiteEvaluation(
						aNiveau,
					)
				) {
					let lValeurNiveau = 1;
					if (aNiveau.coeff === 0) {
						lValeurNiveau = 0;
					}
					lNbEvaluationsNotees += lValeurNiveau;
					if (
						UtilitaireCompetences_1.TUtilitaireCompetences.estNiveauAcqui(
							aNiveau,
						)
					) {
						lNbNiveauxAcquis += lValeurNiveau;
					}
				}
				if (!!aNiveau.colonnesJumelles) {
					lColonnesJumellesTraitees.push(aIndex);
					aNiveau.colonnesJumelles.forEach((aIndexJumelle) => {
						lColonnesJumellesTraitees.push(aIndexJumelle);
					});
				}
			}
		});
		let lPercentAcquisition = null;
		if (!!aEleve.estEvaluable) {
			lPercentAcquisition = "0";
			if (lNbNiveauxAcquis > 0) {
				lPercentAcquisition = (
					Math.round(((lNbNiveauxAcquis * 100) / lNbEvaluationsNotees) * 10) /
					10
				)
					.toString()
					.replace(".", ",");
			}
		}
		aEleve.percentAcqui = lPercentAcquisition;
	}
	_initialiserMenuDeroulant(aInstance) {
		aInstance.setParametres(this._getListeParametresMenuDeroulant());
	}
	_completeSelectionsAvecColonnesJumelles(aSelections) {
		const result = [];
		if (!!aSelections && aSelections.length > 0) {
			aSelections.forEach((aSelection) => {
				const lIndex =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
						aSelection.idColonne,
					);
				if (lIndex > -1) {
					if (!result.includes(aSelection)) {
						result.push(aSelection);
					}
					const lNiveauDAcquisition =
						aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
					if (
						!!lNiveauDAcquisition.colonnesJumelles &&
						lNiveauDAcquisition.colonnesJumelles.length > 0
					) {
						lNiveauDAcquisition.colonnesJumelles.forEach(
							(aIndexColonneJumelle) => {
								result.push({
									article: aSelection.article,
									idColonne:
										DonneesListe_ReleveDEvaluations_1
											.DonneesListe_ReleveDEvaluations.colonnes
											.prefixe_evaluation + aIndexColonneJumelle,
									ligne: lNiveauDAcquisition.ligne,
								});
							},
						);
					}
				}
			});
		}
		return result;
	}
	_editionSelectionsCellulesListe(aSelections, aMethodeEdition) {
		if (!aSelections || aSelections.length === 0) {
			return;
		}
		let lAvecModif = false;
		aSelections.forEach((aSelection) => {
			if (aMethodeEdition.call(this, aSelection)) {
				this._composeListeNiveauxSynthese(aSelection.article);
				aSelection.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lAvecModif = true;
			}
		});
		if (lAvecModif) {
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		}
		return lAvecModif;
	}
	_editionCommentaireAcquisitions(aSelections) {
		let lCommentaireCommun = null;
		let lEstPublieeCommun = null;
		let lCommentaireEstIdentique = true;
		let lPublicationEstIdentique = true;
		aSelections.every((aSelection) => {
			const lIndex =
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
					aSelection.idColonne,
				);
			const lNiveauDAcquisition =
				aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
			if (lNiveauDAcquisition) {
				if (lCommentaireCommun === null) {
					lCommentaireCommun = lNiveauDAcquisition.observation || "";
				} else if (
					lCommentaireEstIdentique &&
					lCommentaireCommun !== lNiveauDAcquisition.observation
				) {
					lCommentaireCommun = null;
					lCommentaireEstIdentique = false;
				}
				if (lEstPublieeCommun === null) {
					lEstPublieeCommun = !!lNiveauDAcquisition.observationPubliee;
				} else if (
					lPublicationEstIdentique &&
					lEstPublieeCommun !== lNiveauDAcquisition.observationPubliee
				) {
					lEstPublieeCommun = null;
					lPublicationEstIdentique = false;
				}
				if (!lCommentaireEstIdentique && !lPublicationEstIdentique) {
					return false;
				}
			}
			return true;
		});
		const lFenetreEditionObservation =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SaisieMessage_1.ObjetFenetre_SaisieMessage,
				{
					pere: this,
					evenement: function (aNumeroBouton, aDonnees) {
						if (aNumeroBouton === 1) {
							const lObservationSaisie = aDonnees.message;
							const lEstPublieeSaisie = aDonnees.estPublie;
							if (
								lObservationSaisie !== undefined ||
								lEstPublieeSaisie !== undefined
							) {
								const lSelectionsAvecColonnesJumelles =
									this._completeSelectionsAvecColonnesJumelles(aSelections);
								this._editionSelectionsCellulesListe(
									lSelectionsAvecColonnesJumelles,
									(aSelection) => {
										const lIndex =
											DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
												aSelection.idColonne,
											);
										const lNiveauDAcquisition =
											aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
										if (!!lNiveauDAcquisition) {
											let lCompetenceModifiee = false;
											if (
												lObservationSaisie !== undefined &&
												lNiveauDAcquisition.observation !== lObservationSaisie
											) {
												lNiveauDAcquisition.observation = lObservationSaisie;
												lCompetenceModifiee = true;
											}
											if (
												lEstPublieeSaisie !== undefined &&
												lNiveauDAcquisition.observationPubliee !==
													lEstPublieeSaisie
											) {
												lNiveauDAcquisition.observationPubliee =
													lEstPublieeSaisie;
												lCompetenceModifiee = true;
											}
											if (!!lCompetenceModifiee) {
												lNiveauDAcquisition.setEtat(
													Enumere_Etat_1.EGenreEtat.Modification,
												);
												return true;
											}
										}
									},
								);
							}
						}
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"competences.AjouterCommentaire",
							),
						});
						aInstance.setParametresFenetreSaisieMessage({
							maxLengthSaisie: 1000,
							avecControlePublication: true,
						});
					},
				},
			);
		lFenetreEditionObservation.setDonnees(
			lCommentaireCommun,
			lEstPublieeCommun,
		);
	}
	_appliquerModificationSelectionCourante(
		aValeurPositionnement,
		aMethodeModification,
	) {
		if (!aValeurPositionnement) {
			return;
		}
		const lListe = this.getInstance(this.identListe);
		const lSelections = lListe.getTableauCellulesSelection();
		if (lSelections.length === 0) {
			return;
		}
		let lModif = false;
		lSelections.forEach((aSelection) => {
			if (aMethodeModification(aSelection)) {
				aSelection.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lModif = true;
			}
		});
		if (lModif) {
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		}
	}
	_modifierNiveauDeSelectionCourante(aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identListe);
		const lSelections = this._completeSelectionsAvecColonnesJumelles(
			lListe.getTableauCellulesSelection(),
		);
		if (lSelections.length === 0) {
			return;
		}
		const lSaisieEffective = this._editionSelectionsCellulesListe(
			lSelections,
			(aSelection) => {
				const lIndex =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
						aSelection.idColonne,
					);
				if (lIndex > -1) {
					const lNiveauDAcquisitionActuel =
						aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
					if (lNiveauDAcquisitionActuel) {
						const lNiveau = MethodesObjet_1.MethodesObjet.dupliquer(aNiveau);
						lNiveau.posChronologique =
							lNiveauDAcquisitionActuel.posChronologique;
						lNiveau.numeroRESI = lNiveauDAcquisitionActuel.numeroRESI;
						lNiveau.estEditable = lNiveauDAcquisitionActuel.estEditable;
						lNiveau.coeff = lNiveauDAcquisitionActuel.coeff;
						lNiveau.colonnesJumelles =
							lNiveauDAcquisitionActuel.colonnesJumelles;
						lNiveau.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aSelection.article.listeNiveauxDAcquisitions.remove(lIndex);
						aSelection.article.listeNiveauxDAcquisitions.insererElement(
							lNiveau,
							lIndex,
						);
						aSelection.article.simulations = null;
					}
					return true;
				}
				return false;
			},
		);
		if (lSaisieEffective) {
			if (lSelections.length === 1) {
				lListe.selectionnerCelluleSuivante({ orientationVerticale: true });
			}
		}
	}
	_modifierNiveauDeColonneLSL(aNiveau) {
		if (!aNiveau) {
			return;
		}
		const lListe = this.getInstance(this.identListe);
		const lSelections = lListe.getTableauCellulesSelection();
		if (lSelections.length === 0) {
			return;
		}
		let lAvecModif = false;
		lSelections.forEach((aSelection) => {
			const lValeurColonneLSL =
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getValeurColonneLSL(
					aSelection.idColonne,
					aSelection.article,
				);
			if (lValeurColonneLSL) {
				lValeurColonneLSL.niveau = aNiveau;
				lValeurColonneLSL.niveau.estEditable = true;
				lValeurColonneLSL.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				aSelection.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lAvecModif = true;
			}
		});
		if (lAvecModif) {
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		}
	}
	_surKeyUpListe(aEvent) {
		const lNiveaux =
			this.parametresSco.listeNiveauxDAcquisitions &&
			this.parametresSco.listeNiveauxDAcquisitions.getListeElements((D) => {
				return D.actifPour.contains(
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_EvaluationEtItem,
				);
			});
		const lNiveau =
			UtilitaireCompetences_1.TUtilitaireCompetences.getNiveauAcqusitionDEventClavier(
				aEvent,
				lNiveaux,
			);
		if (lNiveau) {
			this._modifierNiveauDeSelectionCourante(lNiveau);
		}
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			hauteurAdapteContenu: true,
			alternanceCouleurLigneContenu: true,
			boutons: this._getBoutonsListe(),
		});
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection: {
				let lEleve = null;
				const lSelections = aParametres.instance.getTableauCellulesSelection();
				lSelections.every((aSelection) => {
					if (lEleve === null) {
						lEleve = aSelection.article;
					} else if (lEleve.getNumero() !== aSelection.article.getNumero()) {
						lEleve = null;
						return false;
					}
					return true;
				});
				const lEleveEtatUtilisateur =
					this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
					);
				if (
					(lEleve === null &&
						!!lEleveEtatUtilisateur &&
						lEleveEtatUtilisateur.existeNumero()) ||
					(!!lEleve &&
						lEleve.existeNumero() &&
						(!lEleveEtatUtilisateur ||
							!lEleveEtatUtilisateur.existeNumero())) ||
					(!!lEleve &&
						!!lEleveEtatUtilisateur &&
						lEleve.getNumero() !== lEleveEtatUtilisateur.getNumero())
				) {
					this.etatUtilisateurSco.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Eleve,
						lEleve,
					);
					this.surSelectionEleve();
				}
				break;
			}
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
						aParametres.idColonne,
					)
				) {
					const lRangAppreciation =
						DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getRangAppreciation(
							aParametres.idColonne,
						);
					this.ouvrirFenetreAssistantSaisie(false, lRangAppreciation);
				} else if (
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.estUneColonneLSLNiveau(
						aParametres.idColonne,
					)
				) {
					this._ouvrirMenuContextuelChoixNiveauDAcquisition(
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
						this._modifierNiveauDeColonneLSL,
						false,
						true,
					);
				} else if (
					aParametres.idColonne ===
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
						.colonnes.pos_lsu_niveau
				) {
					this._ouvrirMenuContextuelChoixNiveauDAcquisition(
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_Competence,
						this._modifierNiveauPositionnement,
						false,
						true,
						aParametres.article.genrePositionnementSansNote,
					);
				} else if (
					aParametres.idColonne ===
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
						.colonnes.niv_acqui_domaine
				) {
					this._ouvrirMenuContextuelChoixNiveauDAcquisition(
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_Competence,
						this._modifierNiveauAcquiDomaine,
						false,
						this.estPilierLVESelectionne(),
					);
				} else {
					this._ouvrirMenuContextuelChoixNiveauDAcquisition(
						TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
							.tGVC_EvaluationEtItem,
						this._modifierNiveauDeSelectionCourante,
						true,
						true,
					);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.KeyUpListe:
				return this._surKeyUpListe(aParametres.event);
		}
	}
	_ouvrirMenuContextuelChoixNiveauDAcquisition(
		aTypeGenreValidationCompetence,
		aMethodeModification,
		aAvecRaccourci,
		aAvecDispense,
		aTypePositionnement,
	) {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			initCommandes: (aInstance) => {
				UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
					{
						instance: this,
						menuContextuel: aInstance,
						avecLibelleRaccourci: aAvecRaccourci,
						avecDispense: aAvecDispense,
						genreChoixValidationCompetence: aTypeGenreValidationCompetence,
						genrePositionnement: aTypePositionnement,
						callbackNiveau: (aNiveau) => {
							aMethodeModification.call(this, aNiveau);
						},
					},
				);
			},
		});
	}
	_initMenuContextuelListe(aParametres) {
		const lSelections = this.getInstance(
			this.identListe,
		).getTableauCellulesSelection();
		if (!lSelections || lSelections.length === 0) {
			return;
		}
		let lEvaluationEditable = false;
		let lObservationEditable = false;
		let lColonneLSLEditable = false;
		lSelections.forEach((aSelection) => {
			if (
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.estUneColonneDEvaluation(
					aSelection.idColonne,
				)
			) {
				const lIndex =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getIndexDeColonneEvaluation(
						aSelection.idColonne,
					);
				const lNiveauDAcquisitionActuel =
					aSelection.article.listeNiveauxDAcquisitions.get(lIndex);
				if (
					lNiveauDAcquisitionActuel &&
					lNiveauDAcquisitionActuel.estEditable === true
				) {
					lEvaluationEditable = true;
					if (lNiveauDAcquisitionActuel.getNumero()) {
						lObservationEditable = true;
					}
				}
			} else if (
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.estUneColonneLSLNiveau(
					aSelection.idColonne,
				)
			) {
				lColonneLSLEditable = true;
				lObservationEditable = false;
			}
		});
		this._ajouteCommandesSupplementairesMenuContextuel(
			lSelections,
			aParametres.menuContextuel,
		);
		aParametres.menuContextuel.avecSeparateurSurSuivant();
		UtilitaireCompetences_1.TUtilitaireCompetences.initMenuContextuelNiveauAcquisition(
			{
				instance: this,
				menuContextuel: aParametres.menuContextuel,
				avecLibelleRaccourci: true,
				avecSousMenu: true,
				genreChoixValidationCompetence:
					TypeGenreValidationCompetence_1.TypeGenreValidationCompetence
						.tGVC_EvaluationEtItem,
				evaluationsEditables: lEvaluationEditable || lColonneLSLEditable,
				estObservationEditable: lObservationEditable,
				callbackNiveau: lColonneLSLEditable
					? this._modifierNiveauDeColonneLSL.bind(this)
					: this._modifierNiveauDeSelectionCourante.bind(this),
				callbackCommentaire: this._editionCommentaireAcquisitions.bind(
					this,
					lSelections,
				),
			},
		);
	}
	_getParametresValidationAutoPositionnement(aModeValidation) {
		let lMessageRestrictions;
		if (!!this.donnees.listeColonnesRESIAffichables) {
			const lNbCptTotal = this.donnees.listeColonnesRESIAffichables.count();
			let lNbCptMasquees = 0;
			this.donnees.listeColonnesRESIAffichables.parcourir((D) => {
				if (!D.estAffiche) {
					lNbCptMasquees++;
				}
			});
			if (lNbCptMasquees > 0) {
				const lNbCptComptabilisees = lNbCptTotal - lNbCptMasquees;
				if (lNbCptComptabilisees === 1) {
					lMessageRestrictions = ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAutoPositionnement.restrictions.uneCompetencePriseEnCompte",
						[lNbCptTotal],
					);
				} else {
					lMessageRestrictions = ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAutoPositionnement.restrictions.XCompetencesPrisesEnCompte",
						[lNbCptComptabilisees, lNbCptTotal],
					);
				}
			}
		}
		const result = {
			instance: this,
			modeValidationAuto: aModeValidation,
			avecChoixCalcul: true,
			messageRestrictionsSurCalculAuto: lMessageRestrictions,
			borneDateDebut: null,
			borneDateFin: null,
		};
		if (!!this.identDateDebut) {
			const lBornesDatePeriode = this.getInstance(
				this.identDateDebut,
			).getBorneDates();
			if (
				!lBornesDatePeriode ||
				!ObjetDate_1.GDate.estJourEgal(
					lBornesDatePeriode.dateDebut,
					this.donnees.dateDebut,
				) ||
				!ObjetDate_1.GDate.estJourEgal(
					lBornesDatePeriode.dateFin,
					this.donnees.dateFin,
				)
			) {
				result.borneDateDebut = this.donnees.dateDebut;
				result.borneDateFin = this.donnees.dateFin;
			}
		}
		return result;
	}
	_actualiserListe() {
		const lListeInstance = this.getInstance(this.identListe);
		const lEstAvecColonnesLSL =
			this.donnees.listeColonnesLSL &&
			this.donnees.listeColonnesLSL.count() > 0;
		let firstIdColonneScrollable =
			DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.colonnes
				.eleve;
		let lastIdColonneScrollable = null;
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
				.colonnes.eleve,
			taille: 180,
			titre:
				(!!this.donnees.listeEleves
					? this.donnees.listeEleves.count() + " "
					: "") + ObjetTraduction_1.GTraductions.getValeur("Eleves"),
		});
		if (this.parametres.affichage.avecSynthese && !lEstAvecColonnesLSL) {
			lColonnes.push({
				id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.synthese,
				taille: 280,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.colonne.titre.synthese",
					),
					getLibelleHtml: () => {
						const lJsxModeleBoutonBasculeJauge = () => {
							return {
								event: () => {
									this.parametres.affichage.afficheJaugeChronologique =
										!this.parametres.affichage.afficheJaugeChronologique;
									this._actualiserListe();
								},
								getTitle: () => {
									return this.parametres.affichage.afficheJaugeChronologique
										? ObjetTraduction_1.GTraductions.getValeur(
												"releve_evaluations.colonne.hint.btnAfficheJaugeParNiveau",
											)
										: ObjetTraduction_1.GTraductions.getValeur(
												"releve_evaluations.colonne.hint.btnAfficheJaugeChronologique",
											);
								},
							};
						};
						const lJsxGetClasseBoutonBasculeJauge = () => {
							if (this.parametres.affichage.afficheJaugeChronologique) {
								return UtilitaireCompetences_1.TUtilitaireCompetences
									.ClasseIconeJaugeChronologique;
							}
							return UtilitaireCompetences_1.TUtilitaireCompetences
								.ClasseIconeJaugeParNiveau;
						};
						const lTitreColonneSynthese = [];
						lTitreColonneSynthese.push(
							IE.jsx.str(
								"div",
								{ class: "flex-contain flex-center justify-center" },
								IE.jsx.str("ie-btnicon", {
									"ie-model": lJsxModeleBoutonBasculeJauge,
									"ie-class": lJsxGetClasseBoutonBasculeJauge,
									style: "width: 18px;",
								}),
								IE.jsx.str(
									"span",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.colonne.titre.synthese",
									),
								),
							),
						);
						return lTitreColonneSynthese.join("");
					},
				},
			});
		}
		if (
			this.donnees.avecColonne.evolution &&
			this.parametres.affichage.typeEvolution !==
				this.constantes.TypesEvolution.Aucun &&
			!lEstAvecColonnesLSL
		) {
			lColonnes.push({
				id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.evolution,
				taille: 50,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.colonne.titre.evolution",
					),
					titleHtml: ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.colonne.hint.evolution",
					),
				},
			});
		}
		if (
			this.donnees.avecColonne.pourcentageAcqui &&
			this.parametres.affichage.avecPourcentageAcqui &&
			!lEstAvecColonnesLSL
		) {
			lColonnes.push({
				id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.percent_acquisition,
				taille: 50,
				titre: {
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.colonne.titre.pourcentage_acqui",
					),
					titleHtml: this.donnees.hintColonnePourcentageAcquis || "",
				},
			});
		}
		if (
			!!this.donnees.listeColonnesPosPrecedents &&
			this.parametres.affichage.avecPositionnementPrecedents &&
			!lEstAvecColonnesLSL
		) {
			this.donnees.listeColonnesPosPrecedents.parcourir((D, aIndex) => {
				lColonnes.push({
					id:
						DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
							.colonnes.prefixe_posPrecedent + aIndex,
					taille: 50,
					titre: [
						{
							libelleCSV: ObjetTraduction_1.GTraductions.getValeur(
								"releve_evaluations.colonne.titre.pos_lsu_precedents",
							),
							libelle:
								aIndex === 0
									? ObjetTraduction_1.GTraductions.getValeur(
											"releve_evaluations.colonne.titre.pos_lsu_precedents",
										)
									: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
						},
						{
							libelleCSV: D.getLibelle(),
							libelleHtml: D.getLibelle(),
							titleHtml: D.hint,
						},
					],
				});
			});
		}
		const lAvecAuMoinsUneColonnePositionnementPossible =
			(!!this.donnees.avecColonne.posLSUNiveau ||
				!!this.donnees.avecColonne.posLSUNote ||
				!!this.donnees.avecColonne.nivAcquiPilier) &&
			!lEstAvecColonnesLSL;
		if (
			!!this.donnees.listeColonnesSimulations &&
			this.parametres.affichage.avecSimuCalculPositionnement &&
			lAvecAuMoinsUneColonnePositionnementPossible
		) {
			this.donnees.listeColonnesSimulations.parcourir((D, aIndex) => {
				lColonnes.push({
					id:
						DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
							.colonnes.prefixe_simulation + aIndex,
					taille: 50,
					titre: [
						{
							libelle:
								aIndex === 0
									? ObjetTraduction_1.GTraductions.getValeur(
											"releve_evaluations.colonne.titre.simulations",
										)
									: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
						},
						{ libelle: D.getLibelle(), titleHtml: D.hint },
					],
					affichagePastillesDePositionnenment:
						this.typeAffichage ===
						ObjetRequeteReleveDEvaluations_1.ObjetRequeteReleveDEvaluations
							.TypeAffichage.AffichageParService,
				});
			});
		}
		const lAvecColonnePosLSUNiveau =
			this.donnees.avecColonne.posLSUNiveau &&
			this.parametres.affichage.avecPositionnementLSUNiveau &&
			!lEstAvecColonnesLSL;
		if (lAvecColonnePosLSUNiveau) {
			lColonnes.push({
				id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.pos_lsu_niveau,
				taille: 50,
				titre: {
					libelleCSV: ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.colonne.titre.pos_lsu_niveau",
					),
					getLibelleHtml: () => {
						const lJsxModeleBoutonPreferencesCalculPositionnement = () => {
							return {
								event: () => {
									const lEstContexteParService =
										this.typeAffichage ===
										ObjetRequeteReleveDEvaluations_1
											.ObjetRequeteReleveDEvaluations.TypeAffichage
											.AffichageParService;
									UtilitaireCompetences_1.TUtilitaireCompetences.ouvrirFenetrePreferencesCalculPositionnement(
										lEstContexteParService,
										{ callbackSurChangement: this.afficherPage.bind(this) },
									);
								},
								getTitle: () => {
									return ObjetTraduction_1.GTraductions.getValeur(
										"FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
									);
								},
							};
						};
						const lJsxModeleBoutonValidationAutoPosLSUParNiveau = () => {
							return {
								event: () => {
									const lParamValidationAuto =
										this._getParametresValidationAutoPositionnement(
											TypeModeValidationAuto_1.TypeModeValidationAuto
												.tmva_PosSansNoteSelonEvaluation,
										);
									UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
										lParamValidationAuto,
									);
								},
								getTitle: () => {
									return ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.colonne.hint.btnValidationAutoPosLSUParNiveau",
									);
								},
								getDisabled: () => {
									return !this.donnees.avecBoutonPosLSUParNiveau;
								},
							};
						};
						const jJsxClasseBoutonValidationAutoPosLSUParNiveau = () => {
							return !this.donnees.avecBoutonPosLSUParNiveau
								? ""
								: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
						};
						const lTitreColonnePosLSUNiveau = [];
						lTitreColonnePosLSUNiveau.push(
							IE.jsx.str(
								IE.jsx.fragment,
								null,
								IE.jsx.str(
									"div",
									{ style: "position:absolute; top:4px; right: 4px;" },
									IE.jsx.str("ie-btnicon", {
										"ie-model":
											lJsxModeleBoutonPreferencesCalculPositionnement.bind(
												this,
											),
										class: [
											"icon_cog",
											ObjetListe_1.ObjetListe
												.StyleElementInteractifTitreSansTri,
										],
									}),
								),
								IE.jsx.str("ie-btnicon", {
									"ie-model":
										lJsxModeleBoutonValidationAutoPosLSUParNiveau.bind(this),
									"ie-class":
										jJsxClasseBoutonValidationAutoPosLSUParNiveau.bind(this),
									class: "icon_sigma color-neutre",
								}),
								IE.jsx.str(
									"span",
									{
										class: "m-left",
										"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
											"releve_evaluations.colonne.hint.pos_lsu_niveau",
										),
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.colonne.titre.pos_lsu_niveau",
									),
								),
							),
						);
						return lTitreColonnePosLSUNiveau.join("");
					},
				},
			});
		}
		const lAvecColonnePosLSUNote =
			this.donnees.avecColonne.posLSUNote &&
			this.parametres.affichage.avecPositionnementLSUNote &&
			!lEstAvecColonnesLSL;
		if (lAvecColonnePosLSUNote) {
			lColonnes.push({
				id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.pos_lsu_note,
				taille: 50,
				titre: {
					libelleCSV: ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.colonne.titre.pos_lsu_note",
					),
					getLibelleHtml: () => {
						const lJsxModeleBoutonValidationAutoPosLSUParNote = () => {
							return {
								event: () => {
									const lParamValidationAuto =
										this._getParametresValidationAutoPositionnement(
											TypeModeValidationAuto_1.TypeModeValidationAuto
												.tmva_PosAvecNoteSelonEvaluation,
										);
									UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAutoPositionnement(
										lParamValidationAuto,
									);
								},
								getTitle: () => {
									return ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.colonne.hint.btnValidationAutoPosLSUParNote",
									);
								},
								getDisabled: () => {
									return !this.donnees.avecBoutonPosLSUParNote;
								},
							};
						};
						const lJsxClasseBoutonValidationAutoPosLSUParNote = () => {
							return !this.donnees.avecBoutonPosLSUParNote
								? ""
								: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
						};
						const lTitreColonnePosLSUNote = [];
						lTitreColonnePosLSUNote.push(
							IE.jsx.str(
								"div",
								{ class: "display-flex flex-center justify-center" },
								IE.jsx.str(
									"div",
									{ class: "display-flex flex-center" },
									IE.jsx.str("ie-btnicon", {
										"ie-model":
											lJsxModeleBoutonValidationAutoPosLSUParNote.bind(this),
										"ie-class":
											lJsxClasseBoutonValidationAutoPosLSUParNote.bind(this),
										class: "icon_pencil fix-bloc m-right-l",
										style: "font-size:1.4rem;",
									}),
									IE.jsx.str(
										"span",
										{
											"ie-tooltiplabel":
												ObjetTraduction_1.GTraductions.getValeur(
													"releve_evaluations.colonne.hint.pos_lsu_note",
												),
										},
										ObjetTraduction_1.GTraductions.getValeur(
											"releve_evaluations.colonne.titre.pos_lsu_note",
										),
									),
								),
							),
						);
						return lTitreColonnePosLSUNote.join("");
					},
				},
			});
		}
		const lAvecColonneNiveauAcquiPilier =
			this.donnees.avecColonne.nivAcquiPilier &&
			this.parametres.affichage.avecNiveauMaitriseDomaine &&
			!lEstAvecColonnesLSL;
		if (lAvecColonneNiveauAcquiPilier) {
			lColonnes.push({
				id: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
					.colonnes.niv_acqui_domaine,
				taille: 100,
				titre: {
					getLibelleHtml: () => {
						const lJsxModeleBoutonValidationNivAcquiDomaine = () => {
							return {
								event: () => {
									UtilitaireCompetences_1.TUtilitaireCompetences.surBoutonValidationAuto(
										{
											instance: this,
											avecChoixCalcul: true,
											periode: this.etatUtilisateurSco.Navigation.getRessource(
												Enumere_Ressource_1.EGenreRessource.Periode,
											),
											listeEleves: this.donnees.listeEleves,
										},
									);
								},
								getTitle: () => {
									return ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.colonne.hint.btnValidationAutoNivAcquiDomaine",
									);
								},
								getDisabled: () => {
									return !this.donnees.avecBoutonNivAcquiPilier;
								},
							};
						};
						const lJsxClasseBoutonValidationNivAcquiDomaine = () => {
							return !this.donnees.avecBoutonNivAcquiPilier
								? ""
								: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
						};
						const lTitreColonneNivAcquiDomaine = [];
						lTitreColonneNivAcquiDomaine.push(
							IE.jsx.str(
								"div",
								{ class: "flex-contain flex-center justify-center" },
								IE.jsx.str("ie-btnicon", {
									"ie-model":
										lJsxModeleBoutonValidationNivAcquiDomaine.bind(this),
									"ie-class":
										lJsxClasseBoutonValidationNivAcquiDomaine.bind(this),
									class: "icon_sigma color-neutre",
								}),
								IE.jsx.str(
									"span",
									null,
									ObjetTraduction_1.GTraductions.getValeur(
										"releve_evaluations.colonne.titre.niv_acqui_domaine",
									),
								),
							),
						);
						return lTitreColonneNivAcquiDomaine.join("");
					},
				},
			});
		}
		const lEstEnModeCompact = this.parametres.affichage.modeCompact;
		if (
			this.donnees.listeColonnesDEvaluations &&
			this.donnees.listeColonnesDEvaluations.count() > 0
		) {
			let lListeTitres;
			const lNbLignesDEntete = this.donnees.nbLignesDEntete;
			this.donnees.listeColonnesDEvaluations.parcourir((D, aIndex) => {
				lListeTitres = [];
				for (let i = 0; i < lNbLignesDEntete; i++) {
					lListeTitres.push({
						libelle:
							D.lignes[i].titre === ""
								? TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche
								: D.lignes[i].titre,
						titleHtml: D.lignes[i].hint,
					});
				}
				lColonnes.push({
					id:
						DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
							.colonnes.prefixe_evaluation + aIndex,
					taille: lEstEnModeCompact ? 30 : 60,
					titre: lListeTitres,
				});
			});
			if (this.donnees.listeColonnesDEvaluations.count() >= 2) {
				firstIdColonneScrollable =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
						.colonnes.prefixe_evaluation + "0";
				lastIdColonneScrollable =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
						.colonnes.prefixe_evaluation +
					(this.donnees.listeColonnesDEvaluations.count() - 1);
			}
		}
		if (lEstAvecColonnesLSL) {
			const lJsxModeleBoutonValidationAutoColonneLSL = (
				aIdColonne,
				aAvecBtnCalculAutoEnabled,
			) => {
				return {
					event: () => {
						if (aAvecBtnCalculAutoEnabled) {
							if (this.donnees) {
								this._surCalculAutoColonneLSL(
									this.donnees.listeEleves,
									aIdColonne,
								);
							}
						}
					},
					getTitle: () => {
						return ObjetTraduction_1.GTraductions.getValeur(
							"releve_evaluations.colonne.hint.btnValidationAutoNivAcqRefDisciplinaire",
						);
					},
					getDisabled: () => {
						return !aAvecBtnCalculAutoEnabled;
					},
				};
			};
			const lJsxClasseBoutonValidationAutoColonneLSL = (
				aAvecBtnCalculAutoEnabled,
			) => {
				return !aAvecBtnCalculAutoEnabled
					? ""
					: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
			};
			this.donnees.listeColonnesLSL.parcourir((D, aIndex) => {
				const lElementCptConcerne = D.elementConcerne;
				const lColonneJaugeId =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
						.colonnes.prefixe_LSL_jauge +
					(lElementCptConcerne ? lElementCptConcerne.getNumero() : aIndex);
				const lLibelleColonne = [];
				lLibelleColonne.push(
					IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str("ie-btnicon", {
							"ie-model": lJsxModeleBoutonValidationAutoColonneLSL.bind(
								this,
								lColonneJaugeId,
								!!D.avecBtnCalculAutoEnabled,
							),
							"ie-class": lJsxClasseBoutonValidationAutoColonneLSL.bind(
								this,
								!!D.avecBtnCalculAutoEnabled,
							),
							class: "icon_sigma color-neutre m-right-l",
						}),
						IE.jsx.str("span", null, D.getLibelle()),
					),
				);
				lColonnes.push({
					id: lColonneJaugeId,
					taille: lEstEnModeCompact ? 60 : 120,
					titre: lLibelleColonne.join(""),
					hint: D.hint || "",
				});
				lColonnes.push({
					id:
						DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
							.colonnes.prefixe_LSL_niveau +
						(lElementCptConcerne ? lElementCptConcerne.getNumero() : aIndex),
					taille: lEstEnModeCompact ? 30 : 60,
					titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				});
			});
		}
		if (
			this.donnees.listeColonnesAppreciations &&
			this.donnees.listeColonnesAppreciations.count() > 0 &&
			this.parametres.affichage.avecAppreciations
		) {
			const lEstDisabledBoutonAssistantSaisieListe = (aRangAppreciation) => {
				let lResult = true;
				const lInstanceListe = this.getInstance(this.identListe);
				const lSelections = lInstanceListe.getTableauCellulesSelection();
				if (!!lSelections && lSelections.length > 0) {
					lResult = !lSelections.some((aSelection) => {
						if (
							DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
								aSelection.idColonne,
							)
						) {
							const lRangAppSelection =
								DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getRangAppreciation(
									aSelection.idColonne,
								);
							if (
								lRangAppSelection === aRangAppreciation &&
								DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.lAppreciationEstEditable(
									aSelection.idColonne,
									aSelection.article,
								)
							) {
								return true;
							}
						}
						return false;
					});
				}
				return lResult;
			};
			this.donnees.listeColonnesAppreciations.parcourir((D) => {
				lColonnes.push({
					id:
						DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
							.colonnes.prefixe_appreciations + D.getGenre(),
					taille: 220,
					titre: {
						libelleCSV: D.getLibelle(),
						getLibelleHtml: () => {
							const lJsxModeleBoutonAssistantSaisieListe = (
								aRangAppreciation,
							) => {
								return {
									event: () => {
										const lInstanceListe = this.getInstance(this.identListe);
										const lSelections =
											lInstanceListe.getTableauCellulesSelection();
										this.ouvrirFenetreAssistantSaisie(
											!!lSelections && lSelections.length > 1,
											aRangAppreciation,
										);
									},
									getTitle: () => {
										return ObjetTraduction_1.GTraductions.getValeur(
											"releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
										);
									},
									getDisabled: () => {
										return lEstDisabledBoutonAssistantSaisieListe(
											aRangAppreciation,
										);
									},
								};
							};
							const lJsxClasseBoutonAssistantSaisieListe = (
								aRangAppreciation,
							) => {
								return lEstDisabledBoutonAssistantSaisieListe(aRangAppreciation)
									? ""
									: ObjetListe_1.ObjetListe.StyleElementInteractifTitreSansTri;
							};
							const lTitreColonneAppreciation = [];
							lTitreColonneAppreciation.push(
								'<div class="display-flex flex-center justify-center">',
							);
							lTitreColonneAppreciation.push(
								'<div class="display-flex flex-center">',
							);
							if (this.avecAssistantSaisie()) {
								lTitreColonneAppreciation.push(
									IE.jsx.str("ie-btnicon", {
										"ie-model": lJsxModeleBoutonAssistantSaisieListe.bind(
											this,
											D.getGenre(),
										),
										"ie-class": lJsxClasseBoutonAssistantSaisieListe.bind(
											this,
											D.getGenre(),
										),
										class: "icon_pencil fix-bloc m-right-l",
										style: "font-size: 1.4rem;",
										"aria-label": ObjetTraduction_1.GTraductions.getValeur(
											"releve_evaluations.assistantSaisie.AffecterAppreciationAuxElevesSelectionnes",
										),
									}),
								);
							}
							lTitreColonneAppreciation.push(
								"<span>",
								D.getLibelle(),
								"</span>",
							);
							lTitreColonneAppreciation.push("</div>");
							lTitreColonneAppreciation.push("</div>");
							return lTitreColonneAppreciation.join("");
						},
					},
				});
			});
		}
		lListeInstance.setOptionsListe({
			colonnes: lColonnes,
			scrollHorizontal: {
				debut: firstIdColonneScrollable,
				fin: lastIdColonneScrollable,
			},
		});
		GEtatUtilisateur.setTriListe({
			liste: lListeInstance,
			tri: DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations
				.colonnes.eleve,
		});
		lListeInstance.setDonnees(
			new DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations(
				this.donnees.listeEleves,
				{
					affichageProjetsAccompagnement:
						this.parametres.affichage.avecProjetsAccompagnement,
					affichageJaugeChronologique:
						this.parametres.affichage.afficheJaugeChronologique,
					affichageModeMultiLigne: this.parametres.affichage.modeMultiLigne,
					tailleMaxAppreciation:
						this.parametres.droits.tailleMaxAppreciationEleve,
					initMenuContextuel: this._initMenuContextuelListe.bind(this),
					avecAssistantSaisie: this.avecAssistantSaisie(),
					callbackClicJauge: this._surClicJaugeColonneLSL.bind(this),
					callbackClicProjetsAccompagnement:
						this._surClicProjetsAccompagnement.bind(this),
				},
			),
		);
		this.afficherBandeau(true);
	}
	_surCalculAutoColonneLSL(aListeEleves, aIdColonneConcernee) {
		const lThis = this;
		let lAvecRemplacementValeurs = false;
		const lFunctionExecutionCalculAuto = function () {
			let lAvecChangement = false;
			aListeEleves.parcourir((D) => {
				const lValeurColonneLSL =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getValeurColonneLSL(
						aIdColonneConcernee,
						D,
					);
				if (
					lValeurColonneLSL.niveau &&
					lValeurColonneLSL.niveau.estEditable &&
					lValeurColonneLSL.niveauMoyenne
				) {
					if (
						lAvecRemplacementValeurs ||
						lValeurColonneLSL.niveau.getGenre() <
							Enumere_NiveauDAcquisition_1.EGenreNiveauDAcquisition.Expert
					) {
						lValeurColonneLSL.niveau = Object.assign(
							lValeurColonneLSL.niveau,
							lValeurColonneLSL.niveauMoyenne,
						);
						lValeurColonneLSL.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						D.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						lAvecChangement = true;
					}
				}
			});
			if (lAvecChangement) {
				lThis.setEtatSaisie(true);
				lThis.getInstance(lThis.identListe).actualiser(true);
			}
		};
		const lJsxCheckboxAvecRemplacement = () => {
			return {
				getValue: () => {
					return lAvecRemplacementValeurs;
				},
				setValue: (aValue) => {
					lAvecRemplacementValeurs = aValue;
				},
			};
		};
		const lMessage = [];
		lMessage.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				ObjetTraduction_1.GTraductions.getValeur(
					"releve_evaluations.calculAutoColonneLSL.message",
				),
				IE.jsx.str("br", null),
				IE.jsx.str("br", null),
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": lJsxCheckboxAvecRemplacement.bind(this) },
					ObjetTraduction_1.GTraductions.getValeur(
						"releve_evaluations.calculAutoColonneLSL.remplacerExistants",
					),
				),
			),
		);
		GApplication.getMessage().afficher({
			type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.calculAutoColonneLSL.titre",
			),
			message: lMessage.join(""),
			callback: function (aGenreAction) {
				if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
					lFunctionExecutionCalculAuto.call(this);
				}
			},
		});
	}
	_surClicProjetsAccompagnement(aEleve) {
		if (aEleve && aEleve.avecDocsProjetsAccompagnement) {
			const lInstanceFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_DocumentsEleve_1.ObjetFenetre_DocumentsEleve,
				{ pere: this },
			);
			lInstanceFenetre.setDonnees(aEleve);
		}
	}
	_surClicJaugeColonneLSL(aEleve, aValeurColonneLSL) {
		if (
			aEleve &&
			aValeurColonneLSL &&
			aValeurColonneLSL.relationsESI &&
			aValeurColonneLSL.relationsESI.length
		) {
			new ObjetRequeteDetailEvaluationsCompetences_1.ObjetRequeteDetailEvaluationsCompetences(
				this,
				this._reponseRequeteDetailEvaluations.bind(
					this,
					aEleve,
					aValeurColonneLSL,
				),
			).lancerRequete({
				eleve: aEleve,
				pilier: null,
				periode: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				),
				numRelESI: aValeurColonneLSL.relationsESI,
			});
		}
	}
	_reponseRequeteDetailEvaluations(aEleve, aValeurColonneLSL, aJSON) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailEvaluationsCompetences_1.ObjetFenetre_DetailEvaluationsCompetences,
			{
				pere: this,
				evenement: null,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: "",
						largeur: 700,
						hauteur: 500,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
				},
			},
		);
		const lTitreParDefaut = lFenetre.getTitreFenetreParDefaut(
			aEleve,
			aValeurColonneLSL,
		);
		lFenetre.setDonnees(aValeurColonneLSL, aJSON, {
			titreFenetre: lTitreParDefaut,
		});
	}
	_surValidationAssistantSaisie(aAppreciationSelectionnee, aRangAppreciation) {
		const lSelections = this.getInstance(
			this.identListe,
		).getTableauCellulesSelection();
		let lModif = false;
		lSelections.forEach((aSelection) => {
			if (
				DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.estUneColonneDAppreciation(
					aSelection.idColonne,
				)
			) {
				const lObjetAppreciation =
					DonneesListe_ReleveDEvaluations_1.DonneesListe_ReleveDEvaluations.getObjetAppreciation(
						aSelection.idColonne,
						aSelection.article,
					);
				if (
					!!lObjetAppreciation &&
					lObjetAppreciation.getGenre() === aRangAppreciation &&
					lObjetAppreciation.estEditable
				) {
					lObjetAppreciation.valeur = aAppreciationSelectionnee.getLibelle();
					lObjetAppreciation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					aSelection.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					lModif = true;
				}
			}
		});
		if (lModif) {
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		}
	}
	_initFenetreParametres(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"releve_evaluations.parametres.ParametresDAffichage",
			),
			largeur: 500,
			hauteur: 200,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		aInstance.setParametres(this.typeAffichage, this.constantes);
	}
	_evenementFenetreParametres(aDonnees, aAvecChangementDonneesCalculSimu) {
		this.parametres.affichage.avecSynthese = aDonnees.avecSynthese;
		this.parametres.affichage.avecPourcentageAcqui =
			aDonnees.avecPourcentageAcqui;
		this.parametres.affichage.avecPositionnementLSUNiveau =
			aDonnees.avecPositionnementLSUNiveau;
		this.parametres.affichage.avecPositionnementPrecedents =
			aDonnees.avecPositionnementPrecedents;
		this.parametres.affichage.avecPositionnementLSUNote =
			aDonnees.avecPositionnementLSUNote;
		this.parametres.affichage.avecNiveauMaitriseDomaine =
			aDonnees.avecNiveauMaitriseDomaine;
		this.parametres.affichage.avecSimuCalculPositionnement =
			aDonnees.avecSimuCalculPositionnement;
		let lRequeteNecessaire = !!aAvecChangementDonneesCalculSimu;
		if (
			this.parametres.affichage.avecAppreciations !== aDonnees.avecAppreciations
		) {
			this.parametres.affichage.avecAppreciations = aDonnees.avecAppreciations;
			ObjetHtml_1.GHtml.setDisplay(
				this.parametres.id.piedPage,
				this.estPiedDePageVisible(),
			);
			if (this.estPiedDePageVisible()) {
				this.actualiserDonneesPiedDePage();
			}
		}
		if (
			this.parametres.affichage.avecRegroupementParDomaine !==
			aDonnees.avecRegroupementParDomaine
		) {
			this.parametres.affichage.avecRegroupementParDomaine =
				aDonnees.avecRegroupementParDomaine;
			lRequeteNecessaire = true;
		}
		if (
			this.parametres.affichage.avecEvaluationsCoeffNul !==
			aDonnees.avecEvaluationsCoeffNul
		) {
			this.parametres.affichage.avecEvaluationsCoeffNul =
				aDonnees.avecEvaluationsCoeffNul;
			lRequeteNecessaire = true;
		}
		if (
			this.parametres.affichage.avecEvaluationsHistoriques !==
			aDonnees.avecEvaluationsHistoriques
		) {
			this.parametres.affichage.avecEvaluationsHistoriques =
				aDonnees.avecEvaluationsHistoriques;
			lRequeteNecessaire = true;
		}
		if (
			this.parametres.affichage.avecProjetsAccompagnement !==
			aDonnees.avecProjetsAccompagnement
		) {
			this.parametres.affichage.avecProjetsAccompagnement =
				aDonnees.avecProjetsAccompagnement;
			lRequeteNecessaire = true;
		}
		if (this.parametres.affichage.ordreColonnes !== aDonnees.ordreColonnes) {
			this.parametres.affichage.ordreColonnes = aDonnees.ordreColonnes;
			lRequeteNecessaire = true;
		}
		if (this.parametres.affichage.typeEvolution !== aDonnees.typeEvolution) {
			this.parametres.affichage.typeEvolution = aDonnees.typeEvolution;
			lRequeteNecessaire = true;
		}
		if (
			this.parametres.affichage.toleranceEvolution !==
			aDonnees.toleranceEvolution
		) {
			this.parametres.affichage.toleranceEvolution =
				aDonnees.toleranceEvolution;
			lRequeteNecessaire = true;
		}
		if (lRequeteNecessaire) {
			if (this.getEtatSaisie() === true) {
				(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(
					this.afficherPage.bind(this),
				);
			} else {
				this.afficherPage();
			}
		} else {
			this._actualiserListe();
		}
	}
}
exports._PageReleveEvaluations = _PageReleveEvaluations;
