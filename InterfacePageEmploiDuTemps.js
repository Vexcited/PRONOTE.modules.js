exports.ObjetAffichagePageEmploiDuTemps = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_ICal_1 = require("ObjetFenetre_ICal");
const ObjetRequeteFicheCours_1 = require("ObjetRequeteFicheCours");
const Invocateur_1 = require("Invocateur");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const ObjetStyle_2 = require("ObjetStyle");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeGenreICal_1 = require("TypeGenreICal");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeDomaine_1 = require("TypeDomaine");
const MultiDonneesListe_Eleves = require("DonneesListe_Eleves");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const MultipleObjetAffichagePageAvecMenusDeroulants = require("InterfacePageAvecMenusDeroulants");
const ObjetAffichagePageAvecMenusDeroulants =
	MultipleObjetAffichagePageAvecMenusDeroulants === null ||
	MultipleObjetAffichagePageAvecMenusDeroulants === void 0
		? void 0
		: MultipleObjetAffichagePageAvecMenusDeroulants.ObjetAffichagePageAvecMenusDeroulants;
const ObjetFenetre_ParametrageEDT_1 = require("ObjetFenetre_ParametrageEDT");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequetePageEmploiDuTemps_DomainePresence_1 = require("ObjetRequetePageEmploiDuTemps_DomainePresence");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const MultipleTUtilitaireAffectationElevesGroupe = require("UtilitaireAffectationElevesGroupe");
const UtilitaireConvertisseurPositionGrille_1 = require("UtilitaireConvertisseurPositionGrille");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const TypeGestionRenvoisImp_1 = require("TypeGestionRenvoisImp");
const TypeStatutCours_1 = require("TypeStatutCours");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const GestionnaireBlocCDT_2 = require("GestionnaireBlocCDT");
const GestionnaireBlocCDC_1 = require("GestionnaireBlocCDC");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const ObjetFenetre_Bloc_1 = require("ObjetFenetre_Bloc");
const UtilitaireEDTSortiePedagogique_1 = require("UtilitaireEDTSortiePedagogique");
const TypeHoraireGrillePlanning_1 = require("TypeHoraireGrillePlanning");
const UtilitairePrefsGrilleStructure_1 = require("UtilitairePrefsGrilleStructure");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_ListeTAFFaits_2 = require("ObjetFenetre_ListeTAFFaits");
const UtilitaireVisiosSco_1 = require("UtilitaireVisiosSco");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
const FicheCours_1 = require("FicheCours");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetFenetre_ProgrammationPunition_1 = require("ObjetFenetre_ProgrammationPunition");
const MultipleObjetModule_EDTSaisie = require("ObjetModule_EDTSaisie");
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetNavigateur_1 = require("ObjetNavigateur");
const ObjetRequeteDonneesContenusCDT_1 = require("ObjetRequeteDonneesContenusCDT");
const GlossaireEDT_1 = require("GlossaireEDT");
class ObjetAffichagePageEmploiDuTemps extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.avecFicheCours = true;
		this.avecFicheCdT = true;
		this.fenetreParamsAffichee = false;
		const lOngletCourant = this.etatUtilisateurSco.getGenreOnglet();
		this.avecListeEleves = [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
		].includes(this.etatUtilisateurSco.GenreEspace);
		const lForcerSansCombos = [
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
		].includes(this.etatUtilisateurSco.GenreEspace);
		this.avecComboEleve =
			[
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsEleve,
				Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Eleve,
				Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Eleve,
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
				Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Classe,
			].includes(lOngletCourant) && !lForcerSansCombos;
		this.avecComboClasse =
			[
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsClasse,
				Enumere_Onglet_1.EGenreOnglet.CahierDeTextesClasse,
				Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Classe,
				Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Classe,
			].includes(lOngletCourant) && !lForcerSansCombos;
		this.avecComboSalle =
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace) &&
			(lOngletCourant === Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsSalle ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Salle ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Salle);
		this.avecComboProfesseur =
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsProfesseur ||
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Professeur ||
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Professeur;
		this.avecComboPersonnel =
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsPersonnelEtablissement ||
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet
					.PlanningParSemaine_PersonnelEtablissement ||
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet
					.PlanningParRessource_PersonnelEtablissement;
		this.avecComboMateriel =
			lOngletCourant === Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsMateriel ||
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Materiel ||
			lOngletCourant ===
				Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Materiel;
		this.listeAvecPhotos = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
		);
		this.ressources =
			this.avecComboSalle ||
			this.avecComboClasse ||
			this.avecComboEleve ||
			this.avecComboProfesseur ||
			this.avecComboPersonnel ||
			this.avecComboMateriel
				? new ObjetListeElements_1.ObjetListeElements()
				: new ObjetListeElements_1.ObjetListeElements().addElement(
						this.etatUtilisateurSco.getMembre(),
					);
		if (
			[
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
			].includes(this.etatUtilisateurSco.GenreEspace) &&
			lOngletCourant === Enumere_Onglet_1.EGenreOnglet.EmploiDuTemps
		) {
			this.ressources =
				new ObjetListeElements_1.ObjetListeElements().addElement(
					this.etatUtilisateurSco.getUtilisateur(),
				);
		}
		const lEstPlanningParSemaine =
				lOngletCourant === Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Professeur ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Eleve ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Classe ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Salle ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet
						.PlanningParSemaine_PersonnelEtablissement ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParSemaine_Materiel,
			lEstPlanningParRessource =
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Professeur ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Eleve ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Classe ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Salle ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet
						.PlanningParRessource_PersonnelEtablissement ||
				lOngletCourant ===
					Enumere_Onglet_1.EGenreOnglet.PlanningParRessource_Materiel;
		this.idTabsOnglet = this.Nom + "_idTabsOnglet";
		if (
			(lEstPlanningParSemaine || lEstPlanningParRessource) &&
			this.etatUtilisateurSco.getOnglet().typePlanningEDT === undefined
		) {
			this.etatUtilisateurSco.getOnglet().typePlanningEDT =
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine;
		}
		this.donneesICal = {};
		this.donneesGrille = {
			avecCoursAnnule: this.etatUtilisateurSco.getAvecCoursAnnule(),
			avecCoursAnnulesSuperposes: !this.etatUtilisateurSco.estEspacePourEleve(),
			numeroSemaine: 0,
			domaine: null,
			estEDTAnnuel: false,
			listeCours: null,
			joursStage: null,
			modeDiagnostic: false,
			diagnostic: null,
			estPlanning: lEstPlanningParSemaine || lEstPlanningParRessource,
			estPlanningParRessource: lEstPlanningParRessource,
			multiSelectionSemaines: lEstPlanningParSemaine,
			indiceJourCycle: 0,
		};
		if (
			MultipleObjetModule_EDTSaisie &&
			MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie
		) {
			this.moduleSaisie =
				new MultipleObjetModule_EDTSaisie.ObjetModule_EDTSaisie({
					instance: this,
					getInterfaceGrille: () => {
						return this.getInstance(this.IdentGrille);
					},
					getObjetGrille: () => {
						return this.getInstance(this.IdentGrille).getInstanceGrille();
					},
					getFicheCours: () => {
						return this.getInstance(this.IdentFicheCours);
					},
					estPlanningParRessource: lEstPlanningParRessource,
				});
		}
		if (MultipleTUtilitaireAffectationElevesGroupe) {
			if (
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(this.etatUtilisateurSco.GenreEspace)
			) {
				this.moduleAffectationElevesGroupe =
					new MultipleTUtilitaireAffectationElevesGroupe.TUtilitaireAffectationElevesGroupe(
						this,
					);
			}
		}
	}
	jsxModeleBoutonAvecListeEleves() {
		return {
			event: () => {
				this.etatUtilisateurSco.setAfficherListeElevesEDT(
					!this.etatUtilisateurSco.getAfficherListeElevesEDT(),
				);
				ObjetStyle_2.GStyle.setDisplay(
					this._getIdConteneurListeEleves(),
					this.etatUtilisateurSco.getAfficherListeElevesEDT(),
				);
				this.getInstance(this.IdentGrille).getInstanceGrille().surPreResize();
				this.getInstance(this.IdentCalendrier).surPostResize();
				this._actualiserGrilleEtListe();
				if (this.etatUtilisateurSco.getAfficherListeElevesEDT()) {
					ObjetHtml_1.GHtml.setFocus(
						ObjetHtml_1.GHtml.getElementsFocusablesDElement(
							this._getIdConteneurListeEleves(),
						)[0],
					);
				}
			},
			getTitle: () => {
				return this.etatUtilisateurSco.getAfficherListeElevesEDT()
					? ObjetTraduction_1.GTraductions.getValeur("EDT.MasquerListeEleves")
					: ObjetTraduction_1.GTraductions.getValeur("EDT.AfficherListeEleves");
			},
			getSelection: () => {
				return !!this.etatUtilisateurSco.getAfficherListeElevesEDT();
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getHtmlBandeau: function () {
				return aInstance._getLibelleBandeau();
			},
			getDisplayBandeau: function () {
				return aInstance._getLibelleBandeau() !== "";
			},
			getDisplayCbsPlanning: function () {
				return aInstance.ressources && aInstance.ressources.count() > 0;
			},
			cbPlanningParJourSemaine: {
				getValue: function (aTypePlanningEDT) {
					return (
						aInstance.etatUtilisateurSco.getOnglet().typePlanningEDT ===
						aTypePlanningEDT
					);
				},
				setValue: function (aTypePlanningEDT) {
					const lInstanceGrille = aInstance.getInstance(aInstance.IdentGrille);
					aInstance.etatUtilisateurSco.getOnglet().typePlanningEDT =
						aTypePlanningEDT;
					aInstance._fermerFiches();
					aInstance.viderAffichage();
					const lDomaineVide = aInstance._domaineSelectionneVide();
					aInstance._actualiserTabOnglet();
					lInstanceGrille.effacer("");
					aInstance.surResizeInterface();
					if (!lDomaineVide) {
						if (aInstance.moduleSaisie) {
							aInstance.moduleSaisie.sortieModeDiagnosticRestaurerOptions();
						}
						lInstanceGrille.setOptionsInterfaceGrilleEDT({
							typePlanningEDT: aTypePlanningEDT,
						});
						lInstanceGrille.setDonnees(aInstance.donneesGrille);
					}
				},
			},
			getDisplayBtnAvecRessourcesEtDomaine: function () {
				return aInstance._avecRessourcesEtDomaine();
			},
			btnAvecCoursAnnules: {
				event() {
					aInstance.etatUtilisateurSco.setAvecCoursAnnule(
						!aInstance.etatUtilisateurSco.getAvecCoursAnnule(),
					);
					aInstance.donneesGrille.avecCoursAnnule =
						aInstance.etatUtilisateurSco.getAvecCoursAnnule();
					aInstance._actualiserGrilleEtListe();
				},
				getSelection() {
					return aInstance.etatUtilisateurSco.getAvecCoursAnnule();
				},
				getTitle() {
					return aInstance.etatUtilisateurSco.getAvecCoursAnnule()
						? ObjetTraduction_1.GTraductions.getValeur(
								"EDT.MasquerCoursAnnules",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AfficherCoursAnnules",
							);
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
						aInstance.etatUtilisateurSco.getAvecCoursAnnule(),
					);
				},
			},
			getDisplayBtnPartageICalSalles() {
				return aInstance._getDisplayIcalSalles();
			},
			getDisplayBtnAfficherICal() {
				let lAfficherICal = false;
				if (aInstance._getDisplayIcalSalles()) {
					lAfficherICal = false;
				} else {
					lAfficherICal =
						aInstance.donneesICal.avecExport &&
						aInstance.ressources &&
						aInstance.ressources.count() === 1;
				}
				return lAfficherICal;
			},
			btnAfficherICal: {
				event() {
					if (!aInstance._getDisplayIcalSalles()) {
						GApplication.getMessage().afficher({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.iCal.Titre",
							),
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"infosperso.iCal.MessageBouton",
							),
						});
						return;
					}
					const lFenetreICal = aInstance.getInstance(
						aInstance.IdentFenetreICal,
					);
					if (aInstance._getDisplayIcalSalles()) {
						lFenetreICal.setSemainesPubliees(
							ObjetTraduction_1.GTraductions.getValeur(
								"iCal.fenetre.salles.semainesPubliees",
							),
						);
					}
					lFenetreICal.setDonnees(
						aInstance.ressources.get(0),
						aInstance.donneesICal.parametresExport,
						null,
						null,
						null,
						aInstance._getDisplayIcalSalles(),
					);
				},
				getSelection() {
					return (
						aInstance.existeInstance(aInstance.IdentFenetreICal) &&
						aInstance.getInstance(aInstance.IdentFenetreICal).estAffiche()
					);
				},
				getTitle() {
					return aInstance._getDisplayIcalSalles()
						? ObjetTraduction_1.GTraductions.getValeur(
								"iCal.fenetre.salles.Hint",
							)
						: ObjetTraduction_1.GTraductions.getValeur("iCal.hint")[
								TypeGenreICal_1.TypeGenreICal.ICal_EDT
							];
				},
			},
			getDisplayBtnParametrage: function () {
				return aInstance._avecRessourcesEtDomaine();
			},
			btnParametrage: {
				event: function () {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_ParametrageEDT_1.ObjetFenetre_ParametrageEDT,
						{
							pere: aInstance,
							evenement: function (aAvecModif) {
								aInstance.fenetreParamsAffichee = false;
								if (aAvecModif) {
									aInstance
										.getInstance(aInstance.IdentGrille)
										.getInstanceGrille()
										.resetValeurZoom();
									aInstance._actualiserTabOnglet();
									aInstance._actualiserGrilleEtListe();
								}
							},
						},
						{
							estEDT: !aInstance.donneesGrille.estPlanning,
							avecGranularite: !!aInstance.moduleSaisie,
							choixGenreRessource:
								UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getGenreRessource(
									aInstance.ressources,
								),
						},
					).afficher();
					aInstance.fenetreParamsAffichee = true;
				},
				getSelection: function () {
					return aInstance.fenetreParamsAffichee;
				},
				getTitle: function () {
					return aInstance.donneesGrille.estPlanning
						? ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.PersonnalisationPlannings",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ParametrageEDT.PersonnalisationEDTs",
							);
				},
			},
			getDisplayBtnInfosGrille() {
				return aInstance._avecRessourcesEtDomaine();
			},
		});
	}
	jsxModeleBoutonInfosGrille() {
		return {
			event: () => {
				this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.ouvrirFenetreDetailsGrille();
			},
		};
	}
	construireInstances() {
		this.IdentCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this.evenementSurCalendrier,
			this.initialiserCalendrier,
		);
		if (
			this.IdentCalendrier !== null &&
			this.IdentCalendrier !== undefined &&
			this.getInstance(this.IdentCalendrier) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.IdentCalendrier,
			).getPremierElement();
		}
		this.IdentGrille = this.add(
			InterfaceGrilleEDT_1.InterfaceGrilleEDT,
			this.evenementSurCours,
			this.initialiserGrille,
		);
		this.idPage = this.getNomInstance(this.IdentGrille);
		if (this.avecListeEleves) {
			this.identListeEleves = this.add(
				ObjetListe_1.ObjetListe,
				this.evenementSurListeEleves,
				this.initialiserListeEleves,
			);
		}
		this.IdentFicheCours = this.add(FicheCours_1.FicheCours);
		this.IdentFenetreICal = this.addFenetre(
			ObjetFenetre_ICal_1.ObjetFenetre_ICal,
			this.evenementSurFenetreICal,
			this.initialiserFenetreICal,
		);
		if (
			this.avecComboEleve ||
			this.avecComboClasse ||
			this.avecComboSalle ||
			this.avecComboProfesseur ||
			this.avecComboPersonnel ||
			this.avecComboMateriel
		) {
			if (ObjetAffichagePageAvecMenusDeroulants) {
				this.identTripleCombo = this.add(
					ObjetAffichagePageAvecMenusDeroulants,
					this.evenementSurDernierMenuDeroulant,
					this.initialiserTripleCombo,
				);
			}
		}
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			this.evenementSurVisuEleve,
		);
		if (this.donneesGrille.estPlanning) {
			this.identTabs = this.add(
				ObjetTabOnglets_1.ObjetTabOnglets,
				this._evenementSurTabOnglet,
				this._initialiserTabOnglet,
			);
		}
	}
	free() {
		super.free();
		clearTimeout(this._timeoutPlanning);
	}
	getPrioriteAffichageBandeauLargeur() {
		return [];
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.IdentGrille;
		this.AddSurZone = [];
		if (this.identTripleCombo) {
			this.AddSurZone.push(this.identTripleCombo);
		}
		this.AddSurZone.push({
			html: '<div ie-html="getHtmlBandeau" class="Insecable"></div>',
			getDisplay: "getDisplayBandeau",
		});
		this.AddSurZone.push({ separateur: true });
		this.AddSurZone.push({ blocGauche: true });
		const H = [];
		H.push(
			IE.jsx.str(
				"ie-bouton",
				{
					class: "small-bt themeBoutonNeutre",
					"ie-model": "btnAfficherICal",
					"aria-haspopup": "dialog",
				},
				ObjetTraduction_1.GTraductions.getValeur(
					"iCal.fenetre.salles.PartagerSalles",
				),
			),
		);
		if (this.donneesGrille.estPlanning) {
			if (this.donneesGrille.estPlanningParRessource) {
				this.AddSurZone.push({
					html:
						'<div class="EspaceDroit"><ie-radio' +
						ObjetHtml_1.GHtml.composeAttr(
							"ie-model",
							"cbPlanningParJourSemaine",
							TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour,
						) +
						">" +
						ObjetChaine_1.GChaine.insecable(
							ObjetTraduction_1.GTraductions.getValeur("EDT.ParJour"),
						) +
						"</ie-radio></div>",
					alignementDroite: true,
					getDisplay: "getDisplayCbsPlanning",
				});
			}
			this.AddSurZone.push({
				html:
					'<div style="padding-right:10px;"><ie-radio' +
					ObjetHtml_1.GHtml.composeAttr(
						"ie-model",
						"cbPlanningParJourSemaine",
						TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour,
					) +
					">" +
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur("EDT.OngletParJour"),
					) +
					"</ie-radio></div>",
				alignementDroite: true,
				getDisplay: "getDisplayCbsPlanning",
			});
			this.AddSurZone.push({
				html:
					'<div class="EspaceDroit"><ie-radio' +
					ObjetHtml_1.GHtml.composeAttr(
						"ie-model",
						"cbPlanningParJourSemaine",
						TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parSemaine,
					) +
					">" +
					ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur("EDT.ParSemaine"),
					) +
					"</ie-radio></div>",
				alignementDroite: true,
				getDisplay: "getDisplayCbsPlanning",
			});
		}
		if (
			this.etatUtilisateurSco.getAvecChoixCoursAnnule() &&
			this.etatUtilisateurSco.getAcces().autoriseSurDate
		) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnulesControleur(
					"btnAvecCoursAnnules",
				),
				getDisplay: "getDisplayBtnAvecRessourcesEtDomaine",
			});
		}
		if (this.avecListeEleves) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAvecListeEleves(
					this.jsxModeleBoutonAvecListeEleves.bind(this),
				),
				getDisplay: "getDisplayBtnAvecRessourcesEtDomaine",
			});
		}
		if (
			[
				Enumere_Espace_1.EGenreEspace.Accompagnant,
				Enumere_Espace_1.EGenreEspace.Tuteur,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilisateurSco.GenreEspace)
		) {
			this.AddSurZone.push({
				html: H.join(""),
				getDisplay: "getDisplayBtnPartageICalSalles",
			});
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnICal(
					"btnAfficherICal",
				),
				getDisplay: "getDisplayBtnAfficherICal",
			});
		}
		if (!this.etatUtilisateurSco.pourPrimaire()) {
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
					"btnParametrage",
				),
				getDisplay: "getDisplayBtnParametrage",
			});
		}
		this.AddSurZone.push({
			html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnInformationsGrille(
				this.jsxModeleBoutonInfosGrille.bind(this),
			),
			getDisplay: "getDisplayBtnInfosGrille",
		});
		this.AddSurZone.push({ blocDroit: true });
	}
	construireStructureAffichageAutre() {
		const H = [];
		const lAcces = this.etatUtilisateurSco.getAcces();
		if (!lAcces.autorise) {
			return this.composeMessage(
				ObjetTraduction_1.GTraductions.getValeur("EDT.EDTNonConsultable"),
			);
		} else if (!lAcces.autoriseSurDate) {
			return this.composeMessage(
				ObjetTraduction_1.GTraductions.getValeur("EDT.EDTconsultableDuAu", [
					ObjetDate_1.GDate.formatDate(lAcces.dateDebut, "%JJ/%MM/%AA"),
					ObjetDate_1.GDate.formatDate(lAcces.dateFin, "%JJ/%MM/%AA"),
				]),
			);
		}
		H.push(`<div style="height:calc(100% - 0.8rem);">`);
		H.push(`<div class="ly-cols-2">`);
		H.push(`  <div class="main-content cols">`);
		H.push(
			`    <div class="full-width" id="${this.getNomInstance(this.IdentCalendrier)}">${ObjetHtml_1.GHtml.composeBlanc()}</div>`,
		);
		if (this.getInstance(this.identTabs)) {
			H.push(
				' <div  id="',
				this.idTabsOnglet + '"',
				this.etatUtilisateurSco.getOnglet().typePlanningEDT ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour
					? ""
					: ' style="display:none;"',
				">",
			);
			H.push(
				'  <div class="m-right-l" id="',
				this.getNomInstance(this.identTabs),
				'" style="',
				ObjetStyle_2.GStyle.composeCouleurBordure(
					GCouleur.bordure,
					1,
					ObjetStyle_1.EGenreBordure.bas,
				),
				'"></div>',
			);
			H.push(" </div>");
		}
		H.push(
			'    <div class="fluid-bloc full-height" id="' +
				this.getNomInstance(this.IdentGrille) +
				'">',
			ObjetHtml_1.GHtml.composeBlanc(),
			"</div>",
		);
		H.push(`  </div>`);
		if (this.avecListeEleves) {
			H.push(
				IE.jsx.str(
					"div",
					{
						id: this._getIdConteneurListeEleves(),
						class: "aside-content",
						style: !this.etatUtilisateurSco.getAfficherListeElevesEDT()
							? "display:none;"
							: "",
					},
					IE.jsx.str("div", {
						id: this.getNomInstance(this.identListeEleves),
						style: "width:240px;" + ObjetStyle_2.GStyle.composeHeightCalc(5),
					}),
				),
			);
		}
		H.push(`</div>`);
		H.push(`</div>`);
		return H.join("");
	}
	initialiserTripleCombo(aInstance) {
		if (this.avecComboSalle) {
			aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Salle]);
		} else if (this.avecComboEleve) {
			aInstance.setParametres([
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			]);
		} else if (this.avecComboProfesseur) {
			aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Enseignant]);
		} else if (this.avecComboPersonnel) {
			aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Personnel]);
		} else if (this.avecComboMateriel) {
			aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Materiel]);
		} else {
			aInstance.setParametres(
				[Enumere_Ressource_1.EGenreRessource.Classe],
				true,
			);
		}
	}
	initialiserCalendrier(AInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(AInstance);
		if (this.donneesGrille.multiSelectionSemaines) {
			AInstance.setOptionsCalendrier({ avecMultiSelection: true });
		}
	}
	initialiserGrille(AInstance) {
		AInstance.setOptionsInterfaceGrilleEDT({
			avecParametresUtilisateurs: true,
			estPlanning: this.donneesGrille.estPlanning,
			estPlanningParRessource: this.donneesGrille.estPlanningParRessource,
			typePlanningEDT: this.etatUtilisateurSco.getOnglet().typePlanningEDT,
			evenementMouseDownPlace: (aEstGrilleMS, aParams) => {
				this._initParamCours();
				if (this.moduleSaisie) {
					this.moduleSaisie.mouseDownPlaceGrille(aEstGrilleMS, aParams);
				}
				this._fermerFiches();
				this._viderListeEleves();
			},
			callbackPiedRessourcesLibres: (aListeASelectionner) => {
				const lListe = this.ressources.getListeElements((aRess) => {
					return !!aListeASelectionner.getElementParElement(aRess);
				});
				this.getInstance(this.identTripleCombo).modifierSelection(
					lListe.get(0).getGenre(),
					lListe,
				);
			},
		});
	}
	initialiserListeEleves(aInstance) {
		const lColonnes = [];
		const lThis = this;
		aInstance.controleur.boutonAfficherPhoto = {
			event: function () {
				lThis.listeAvecPhotos = !lThis.listeAvecPhotos;
				aInstance
					.getDonneesListe()
					.setOptionsAffichage({ avecPhotos: lThis.listeAvecPhotos });
				aInstance.actualiser(true);
			},
			getTitle: function () {
				return lThis.listeAvecPhotos
					? ObjetTraduction_1.GTraductions.getValeur("EDT.MasquerPhotoEleves")
					: ObjetTraduction_1.GTraductions.getValeur("EDT.AfficherPhotoEleves");
			},
			getSelection: function () {
				return lThis.listeAvecPhotos;
			},
			getDisabled: () => {
				var _a;
				return !((_a = this.paramCours) === null || _a === void 0
					? void 0
					: _a.cours);
			},
		};
		const lTitreColonne = [];
		lTitreColonne.push(
			'<div class="flex-contain flex-center full-width p-y-s p-x">',
		);
		if (
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.consulterPhotosEleves,
			)
		) {
			lTitreColonne.push(
				'<ie-btnicon ie-model="boutonAfficherPhoto" class="fix-bloc icon_photo bt-activable"></ie-btnicon>',
			);
		}
		lTitreColonne.push(
			'<div class="fluid-bloc text-center">',
			ObjetTraduction_1.GTraductions.getValeur("Eleve"),
			"</div>",
		);
		lTitreColonne.push("</div>");
		lColonnes.push({
			id: MultiDonneesListe_Eleves.DonneesListe_Eleves.colonnes.Eleve,
			titre: { libelleHtml: lTitreColonne.join("") },
			taille: "100%",
		});
		lColonnes.push({
			id: MultiDonneesListe_Eleves.DonneesListe_Eleves.colonnes.Classe,
			titre: ObjetTraduction_1.GTraductions.getValeur("Classe"),
			taille: 50,
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: [
				MultiDonneesListe_Eleves.DonneesListe_Eleves.colonnes.Classe,
			],
			ariaLabel: () => {
				var _a, _b, _c;
				let lStr = "";
				if (
					(_a = this.paramCours) === null || _a === void 0 ? void 0 : _a.cours
				) {
					lStr =
						(_c =
							(_b = this.getInstance(this.IdentGrille).getInstanceGrille()) ===
								null || _b === void 0
								? void 0
								: _b.getModuleCours()) === null || _c === void 0
							? void 0
							: _c.getAriaLabelCours(this.paramCours.cours);
				}
				return lStr
					? GlossaireEDT_1.TradGlossaireEDT.ListeElevesDe_S.format(lStr)
					: GlossaireEDT_1.TradGlossaireEDT.ListeElevesSasnCours;
			},
			messageContenuVide: GlossaireEDT_1.TradGlossaireEDT.ListeElevesSasnCours,
		});
	}
	initialiserFenetreICal(aInstance) {
		aInstance.setOptionsFenetre({
			titre: this._getDisplayIcalSalles()
				? ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.salles.Titre")
				: ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.titre"),
			largeur: 425,
			hauteur: 265,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		aInstance.setGenreICal(TypeGenreICal_1.TypeGenreICal.ICal_EDT);
	}
	recupererDonnees(aSurActualisation) {
		if (
			this.avecListeEleves &&
			this.etatUtilisateurSco.getAfficherListeElevesEDT()
		) {
			ObjetStyle_2.GStyle.setVisible(this._getIdConteneurListeEleves(), false);
		}
		this.viderAffichage(aSurActualisation);
		this.lancerAffichage();
	}
	viderAffichage(aSurActualisation) {
		this.getInstance(this.IdentGrille).fermerFenetreMS();
		this._viderListeEleves();
		if (!aSurActualisation) {
			this.getInstance(this.IdentGrille).getInstanceGrille().effacer();
		}
	}
	lancerAffichage() {
		if (!this.ressources || this.ressources.count() === 0) {
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.IdentCalendrier),
				false,
			);
			if (this.getInstance(this.identTabs)) {
				ObjetHtml_1.GHtml.setDisplay(this.idTabsOnglet, false);
			}
		} else if (
			!this.etatUtilisateurSco.getDomainePresence(this.ressources.get(0)) &&
			!(
				this.donneesGrille.estPlanning &&
				this.donneesGrille.estPlanningParRessource
			)
		) {
			this.requeteDomaineDePresence();
		} else {
			this.actionSurRecupererDonnees();
		}
	}
	async requeteDomaineDePresence() {
		const lReponse =
			await new ObjetRequetePageEmploiDuTemps_DomainePresence_1.ObjetRequetePageEmploiDuTemps_DomainePresence(
				this,
			).lancerRequete(this.ressources.get(0));
		this.actionSurRecupererDonnees(lReponse.Domaine, lReponse.message);
	}
	actionSurRecupererDonnees(aDomainePresence, aMessage) {
		if (!!aMessage) {
			this.message = aMessage;
			ObjetHtml_1.GHtml.setDisplay(
				this.getNomInstance(this.IdentCalendrier),
				false,
			);
			this.afficherMessage(this.message);
		} else {
			if (aDomainePresence) {
				this.etatUtilisateurSco.setDomainePresence(
					this.ressources.get(0),
					aDomainePresence,
				);
			}
			this.initialisationCalendrier(
				this.etatUtilisateurSco.getDomainePresence(this.ressources.get(0)),
			);
		}
	}
	initialisationCalendrier(aDomainePresence) {
		const lCalendrier = this.getInstance(this.IdentCalendrier);
		lCalendrier.setFrequences(this.parametresSco.frequences, true);
		if (aDomainePresence) {
			lCalendrier.setDomaineInformation(
				aDomainePresence,
				Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu,
			);
		}
		lCalendrier.setPeriodeDeConsultation(
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
		if (this.donneesGrille.multiSelectionSemaines) {
			lCalendrier.setDomaine(this.etatUtilisateurSco.getDomaineSelectionne());
		} else {
			lCalendrier.setSelection(
				this.etatUtilisateurSco.getSemaineSelectionnee(),
			);
		}
		if (
			this.moduleSaisie &&
			this.moduleSaisie.afficherDomaineClotureCalendrier()
		) {
			lCalendrier.setDomaineInformation(
				this.parametresSco.domaineVerrou,
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Cloturee,
			);
		}
	}
	evenementSurCalendrier(
		ASelection,
		aDomaine,
		AGenreDomaineInformation,
		aEstDansPeriodeConsultation,
		AIsToucheSelection,
	) {
		if (AIsToucheSelection) {
			this.setIdCourant(
				this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.getPremierElement(),
			);
			this.setFocusIdCourant();
		} else {
			this.setIdCourant(this.Instances[this.IdentCalendrier].IdPremierElement);
			this.setEtatIdCourant(false);
			if (this.donneesGrille.multiSelectionSemaines) {
				this.etatUtilisateurSco.setDomaineSelectionne(aDomaine);
			} else {
				this.etatUtilisateurSco.setSemaineSelectionnee(ASelection);
			}
			const lDomaineVide = this._domaineSelectionneVide();
			this._actualiserTabOnglet();
			if (
				AGenreDomaineInformation ===
					Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee ||
				lDomaineVide
			) {
				Invocateur_1.Invocateur.evenement(
					Invocateur_1.ObjetInvocateur.events.activationImpression,
					Enumere_GenreImpression_1.EGenreImpression.Aucune,
				);
				this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.effacer(
						lDomaineVide
							? "&nbsp;"
							: this.composeMessage(
									ObjetTraduction_1.GTraductions.getValeur("SemaineFeriee"),
								),
					);
				this.setEtatIdCourant(true);
				this._fermerFiches();
			} else {
				this.requetePageEmploiDuTemps();
			}
		}
	}
	requetePageEmploiDuTemps() {
		const lDonnees = {};
		if (
			this.donneesGrille.estPlanning &&
			this.donneesGrille.estPlanningParRessource
		) {
			lDonnees.listeRessources = this.ressources;
		} else {
			lDonnees.ressource = this.ressources.get(0);
		}
		if (this.donneesGrille.multiSelectionSemaines) {
			lDonnees.domaine = this.etatUtilisateurSco.getDomaineSelectionne();
		} else {
			lDonnees.numeroSemaine = this.etatUtilisateurSco.getSemaineSelectionnee();
		}
		lDonnees.avecConseilDeClasse = true;
		lDonnees.avecAbsencesRessource = true;
		lDonnees.avecCoursSortiePeda = true;
		lDonnees.avecDisponibilites = true;
		lDonnees.avecRetenuesEleve = true;
		lDonnees.avecInfosPrefsGrille = true;
		lDonnees.avecRessourcesLibrePiedHoraire =
			this.donneesGrille.estPlanningParRessource;
		new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
			this,
			this.actionSurCalendrier,
		).lancerRequete(lDonnees);
	}
	actionSurCalendrier(aParam) {
		const lInstanceGrille = this.getInstance(this.IdentGrille);
		if (
			this.avecListeEleves &&
			this.etatUtilisateurSco.getAfficherListeElevesEDT()
		) {
			ObjetStyle_2.GStyle.setVisible(this._getIdConteneurListeEleves(), true);
		}
		this.donneesICal = {
			avecExport: !!aParam.avecExportICal,
			parametresExport: aParam.ParametreExportiCal,
		};
		if (!this.etatUtilisateurSco.getAvecChoixCoursAnnule()) {
			this.etatUtilisateurSco.setAvecCoursAnnule(aParam.avecCoursAnnule);
			this.donneesGrille.avecCoursAnnule =
				this.etatUtilisateurSco.getAvecCoursAnnule();
		}
		this._fermerFiches(
			this.getInstance(this.IdentCalendrier).estUneInteractionUtilisateur(),
		);
		this.viderAffichage(true);
		const LNumeroSemaine = this.etatUtilisateurSco.getSemaineSelectionnee();
		if (this.etatUtilisateurSco.getAcces().autoriseSurDate) {
			const lCallback = this._getParametresPDF;
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				lCallback.bind(this),
			);
		}
		this.donneesGrille.numeroSemaine = LNumeroSemaine;
		if (this.donneesGrille.multiSelectionSemaines) {
			this.donneesGrille.domaine =
				this.etatUtilisateurSco.getDomaineSelectionne();
		}
		this.donneesGrille.listeCours = aParam.listeCours;
		this.donneesGrille.joursStage = aParam.joursStage;
		this.donneesGrille.absences = aParam.absences;
		this.donneesGrille.listeAbsRessources = aParam.listeAbsRessources;
		this.donneesGrille.disponibilites = aParam.disponibilites;
		this.donneesGrille.modeDiagnostic = false;
		this.donneesGrille.diagnostic = null;
		this.donneesGrille.ressources = this.ressources;
		this.donneesGrille.prefsGrille = aParam.prefsGrille;
		this.donneesGrille.placesRessourcesLibres = aParam.placesRessourcesLibres;
		this._actualiserTabOnglet();
		lInstanceGrille
			.getInstanceGrille()
			.setOptions({
				recreations: aParam.recreations || this.parametresSco.recreations,
			});
		lInstanceGrille.setDonnees(this.donneesGrille, (aGrille) => {
			if (this.etatUtilisateurSco._coursASelectionner) {
				aGrille.selectionnerCours(
					this.etatUtilisateurSco._coursASelectionner,
					null,
					true,
				);
				delete this.etatUtilisateurSco._coursASelectionner;
			}
		});
		this.setEtatIdCourant(true);
		if (this.getInstance(this.IdentCalendrier).estUneInteractionUtilisateur()) {
			this.setFocusIdCourant();
		}
	}
	evenementFicheCdt(aParam) {
		if (aParam) {
			UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
				this.getInstance(this.identFenetreVisuQCM),
				aParam.executionQCM,
			);
			if (aParam.surModifTAFARendre) {
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					this._actionSurRequeteFicheCDT.bind(this),
				).lancerRequete(this.paramFicheCDT);
			}
		}
	}
	evenementSurFenetreICal() {}
	evenementSurDernierMenuDeroulant() {
		ObjetHtml_1.GHtml.setDisplay(
			this.getNomInstance(this.IdentCalendrier),
			true,
		);
		if (
			this.avecListeEleves &&
			this.etatUtilisateurSco.getAfficherListeElevesEDT()
		) {
			ObjetStyle_2.GStyle.setDisplay(this._getIdConteneurListeEleves(), true);
		}
		if (this.avecComboSalle) {
			this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Salle,
			);
		} else if (this.avecComboEleve) {
			this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			);
			if (
				this.ressources.count() === 1 &&
				!this.ressources.get(0).existeNumero()
			) {
				this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
					Enumere_Ressource_1.EGenreRessource.Classe,
				);
			}
		} else if (this.avecComboProfesseur) {
			this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Enseignant,
			);
		} else if (this.avecComboPersonnel) {
			this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Personnel,
			);
		} else if (this.avecComboMateriel) {
			this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Materiel,
			);
		} else {
			this.ressources = this.etatUtilisateurSco.Navigation.getRessources(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
		}
		this.surResizeInterface();
		this.lancerAffichage();
	}
	evenementSurCours(aParam) {
		const lCoursPrecedentSelectionne = this.paramCours
			? this.paramCours.cours
			: null;
		const lParam = { genre: null, id: "", cours: null };
		$.extend(lParam, aParam);
		this.paramCours_precedent = this.paramCours;
		this.paramCours = aParam;
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnostic();
		}
		switch (lParam.genre) {
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage: {
				if (
					lParam.genre !== Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours ||
					this.avecFicheCours
				) {
					if (!lParam.cours.coursMultiple) {
						this._requeteFiche(
							lParam.cours,
							lCoursPrecedentSelectionne,
							lParam,
						);
					}
				} else {
					this._fermerFiches();
				}
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel: {
				if (!lParam.cours.coursMultiple) {
					this._fermerFiches();
					if (
						this._estCoursDejaSelectionne(
							lParam.cours,
							lCoursPrecedentSelectionne,
						) &&
						this._avecMenuContextuel()
					) {
						this._afficherMenuContextuelDeCours(lParam.cours);
					} else if (this.avecListeEleves) {
						this._requeteFicheCours(lParam.cours, {
							cours: lParam.cours,
							forcerNavigationClavier:
								ObjetNavigateur_1.Navigateur.isToucheMenuContextuel(),
						});
					}
				}
				break;
			}
			default: {
			}
		}
	}
	evenementSurListeEleves(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (this.moduleAffectationElevesGroupe) {
					this.moduleAffectationElevesGroupe.ajoutEleveAuGroupe({
						instance: this,
						cours: this.paramCours.cours,
						groupe: this.paramCours.listeEleves.groupePourEleve,
						domaine: new TypeDomaine_1.TypeDomaine().setValeur(
							true,
							this.paramCours.cours.numeroSemaine,
						),
						callbackSaisie: () => {
							this._requeteFiche(this.paramCours.cours, null);
							this.setEtatSaisie(false);
							if (this.moduleSaisie) {
								this.moduleSaisie.sortieModeDiagnosticRestaurerOptions();
							}
						},
					});
					return Enumere_EvenementListe_1.EGenreEvenementListe.Creation;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (this.moduleAffectationElevesGroupe) {
					this.moduleAffectationElevesGroupe.surSuppressionEleve({
						instance: this,
						cours: this.paramCours.cours,
						groupe: this.paramCours.listeEleves.groupePourEleve,
						domaine: new TypeDomaine_1.TypeDomaine().setValeur(
							true,
							this.paramCours.cours.numeroSemaine,
						),
						eleve: aParametres.article,
						callbackSaisie: () => {
							this._requeteFiche(this.paramCours.cours, null);
							this.setEtatSaisie(false);
							if (this.moduleSaisie) {
								this.moduleSaisie.sortieModeDiagnosticRestaurerOptions();
							}
						},
					});
				}
				break;
		}
	}
	evenementSurVisuEleve(aParam) {
		if (aParam.action === ObjetVisuEleveQCM_1.TypeCallbackVisuEleveQCM.close) {
			this.recupererDonnees();
		}
	}
	_requeteFiche(aCours, aCoursPrecedentSelectionne, aParamsCours) {
		if (
			this.paramCours.genre ===
			Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage
		) {
			if (this.paramCours.genreImage === 1) {
				this.paramFicheCDT = {
					pourCDT: true,
					cours: aCours,
					numeroSemaine: aCours.numeroSemaine,
				};
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					this._actionSurRequeteFicheCDT.bind(this),
				).lancerRequete(this.paramFicheCDT);
			} else if (this.paramCours.genreImage === 3) {
				UtilitaireVisiosSco_1.UtilitaireVisios.ouvrirLiensVisioCours(
					aCours.listeVisios,
				);
			}
		} else if (
			this.paramCours.genre ===
			Enumere_EvenementEDT_1.EGenreEvenementEDT.SurContenu
		) {
			this.paramFicheCDT = {
				pourTAF: true,
				cours: aCours,
				numeroSemaine: aCours.numeroSemaine,
			};
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._actionSurRequeteFicheCDT.bind(this),
			).lancerRequete(this.paramFicheCDT);
		} else {
			const lInstanceFicheCours = this.getInstance(this.IdentFicheCours);
			if (
				this.moduleSaisie &&
				this.moduleSaisie.autorisationEditionCoursAutoriseeSurContexte() &&
				this._estCoursDejaSelectionne(aCours, aCoursPrecedentSelectionne) &&
				lInstanceFicheCours &&
				lInstanceFicheCours.EnAffichage &&
				!aCours.coursOrigine &&
				aCours.modifiable &&
				this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.cours.deplacerCours,
				) &&
				aParamsCours &&
				!aParamsCours.coursMasquePartiel
			) {
				if (
					this.paramCours &&
					!this.paramCours.listeEleves &&
					this.paramCours_precedent &&
					this.paramCours_precedent.listeEleves
				) {
					this.paramCours.listeEleves = this.paramCours_precedent.listeEleves;
				}
				this.moduleSaisie.requeteEvaluation(
					aCours,
					this._getDomaineSelectionne(),
				);
			} else {
				this._requeteFicheCours(aCours);
			}
		}
	}
	_actionSurRequeteFicheCDT(aGenreAffichageCDT, aCahierDeTextes) {
		UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
			this,
			{
				cahiersDeTextes: aCahierDeTextes,
				genreAffichage: aGenreAffichageCDT,
				gestionnaire: GestionnaireBlocCDT_2.GestionnaireBlocCDT,
			},
			{ evenementSurBlocCDT: this.evenementSurBlocCDT },
		);
	}
	evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM:
				this.surExecutionQCMContenu(aParam.event, aElement, aParam);
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{ pere: this, evenement: this._evenementFenetreTAFFaits },
					aElement,
				);
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirContenu:
				new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
					this,
					this._actionApresRequeteDonneesContenusCDT,
				).lancerRequete({ cahierDeTextes: aElement.cahierDeTextes });
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.documentRendu:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.supprimer:
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					this._actionSurRequeteFicheCDT.bind(this),
				).lancerRequete(this.paramFicheCDT);
				break;
			default:
				break;
		}
	}
	_evenementFenetreTAFFaits(aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_2.TypeBoutonFenetreTAFFaits.Fermer
		) {
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._actionSurRequeteFicheCDT.bind(this),
			).lancerRequete(this.paramFicheCDT);
		}
	}
	surExecutionQCMContenu(aEvent, aElement, aParam) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		const lExecQCM =
			aParam && !!aParam.estQCM ? aElement : aElement.executionQCM;
		this.evenementFicheCdt({ executionQCM: lExecQCM });
	}
	afficherPage() {
		this.recupererDonnees(true);
	}
	evenementAfficherMessage(aGenreMessage) {
		this.ressources = new ObjetListeElements_1.ObjetListeElements();
		this._fermerFiches();
		this.viderAffichage();
		ObjetStyle_2.GStyle.setDisplay(
			this.getNomInstance(this.IdentCalendrier),
			false,
		);
		if (this.avecListeEleves) {
			ObjetStyle_2.GStyle.setDisplay(this._getIdConteneurListeEleves(), false);
		}
		if (this.getInstance(this.identTabs)) {
			ObjetHtml_1.GHtml.setDisplay(this.idTabsOnglet, false);
		}
		this._evenementAfficherMessage(aGenreMessage);
		this.afficherBandeau(this._getDisplayIcalSalles());
	}
	surResizeInterface() {
		super.surResizeInterface();
		if (this.avecListeEleves) {
			ObjetPosition_1.GPosition.setHeight(
				this.getNomInstance(this.identListeEleves),
				0,
			);
		}
		if (this.avecListeEleves) {
			ObjetPosition_1.GPosition.setHeight(
				this.getNomInstance(this.identListeEleves),
				ObjetPosition_1.GPosition.getHeight(this.Nom) - 10,
			);
		}
		this.getInstance(this.IdentCalendrier).surPostResize();
	}
	_actualiserTabOnglet() {
		const lOngletsVisible =
			this.getInstance(this.identTabs) &&
			this.etatUtilisateurSco.getOnglet().typePlanningEDT ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour &&
			!this._domaineSelectionneVide();
		ObjetHtml_1.GHtml.setDisplay(this.idTabsOnglet, lOngletsVisible);
		if (lOngletsVisible) {
			const lListeOnglets = new ObjetListeElements_1.ObjetListeElements();
			let lIndiceOnglet = -1;
			const lPrefs =
				UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrille(
					this.donneesGrille.prefsGrille
						? this.donneesGrille.prefsGrille.genreRessource
						: this.ressources,
					this.donneesGrille.estPlanning,
					this.donneesGrille.prefsGrille
						? this.donneesGrille.prefsGrille.numEtablissement
						: null,
				);
			lPrefs.joursOuvres.items().forEach((aJour, aIndice) => {
				lListeOnglets.addElement(
					new ObjetElement_1.ObjetElement(
						UtilitaireConvertisseurPositionGrille_1.TUtilitaireConvertisseurPosition_Grille.getLibelleJourCycle(
							aJour,
						),
						0,
						aJour,
					),
				);
				if (this.donneesGrille.indiceJourCycle === aJour) {
					lIndiceOnglet = aIndice;
				}
			});
			const lTabs = this.getInstance(this.identTabs);
			const lOngletTab = lTabs.getIndiceOngletSelectionne();
			lTabs.setDonnees(lListeOnglets);
			if (lIndiceOnglet < 0) {
				this.donneesGrille.indiceJourCycle = lPrefs.joursOuvres.items()[0];
				lIndiceOnglet = 0;
			}
			if (lIndiceOnglet !== lOngletTab) {
				lTabs.selectOnglet(lIndiceOnglet);
			}
		}
	}
	_initialiserTabOnglet(aInstance) {
		aInstance.setParametres(new ObjetListeElements_1.ObjetListeElements());
	}
	_evenementSurTabOnglet(aElement) {
		clearTimeout(this._timeoutPlanning);
		this._timeoutPlanning = setTimeout(() => {
			this.donneesGrille.indiceJourCycle = aElement.getGenre();
			this._actualiserGrilleEtListe();
		}, 0);
	}
	_actualiserGrilleEtListe() {
		this._fermerFiches();
		this.viderAffichage();
		if (this.moduleSaisie) {
			this.moduleSaisie.sortieModeDiagnosticRestaurerOptions();
		}
		const lGrilleEDT = this.getInstance(this.IdentGrille);
		lGrilleEDT.setDonnees(this.donneesGrille);
		if (this.paramCours && this.paramCours.cours) {
			const lAvecSelection = lGrilleEDT
				.getInstanceGrille()
				.selectionnerCours(this.paramCours.cours, true, true);
			if (!lAvecSelection) {
				this._initParamCours();
			}
		}
	}
	_initParamCours() {
		this.paramCours = { genre: null, id: "", cours: null };
	}
	_fermerFiches(aSurInteractionUtilisateur) {
		this.getInstance(this.IdentFicheCours).fermer(aSurInteractionUtilisateur);
		if (this.fenetreCDT) {
			this.fenetreCDT.fermer(aSurInteractionUtilisateur);
		}
		if (this.fenetre_ProgrammationPunition) {
			this.fenetre_ProgrammationPunition.fermer();
		}
		if (this.fenetre_SortiePedagogique) {
			this.fenetre_SortiePedagogique.fermer();
		}
	}
	_getLibelleBandeau() {
		let lLibelle = "";
		if (!!this.message) {
			return "";
		}
		if (!this.ressources || this.ressources.count() === 0) {
			return "";
		}
		const lDomaine = this._getDomaineSelectionne();
		const lNbSemaines = lDomaine.getNbrValeurs();
		if (lNbSemaines > 0) {
			lLibelle += '<span class="titre-onglet">';
			if (
				this.etatUtilisateurSco.getOnglet().typePlanningEDT ===
					TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour &&
				lNbSemaines === 1
			) {
				lLibelle += ObjetDate_1.GDate.formatDate(
					IE.Cycles.jourCycleEnDate(
						this.donneesGrille.indiceJourCycle,
						lDomaine.getPremierePosition(true),
					),
					ObjetTraduction_1.GTraductions.getValeur("Du") + " %JJ/%MM/%AAAA",
				);
			} else {
				lLibelle +=
					ObjetDate_1.GDate.formatDate(
						IE.Cycles.dateDebutCycle(lDomaine.getPremierePosition(true)),
						ObjetTraduction_1.GTraductions.getValeur("Du") + " %JJ/%MM/%AAAA",
					) +
					ObjetDate_1.GDate.formatDate(
						IE.Cycles.dateDernierJourOuvreCycle(
							lDomaine.getDernierePosition(true),
						),
						" " +
							ObjetTraduction_1.GTraductions.getValeur("Au") +
							" %JJ/%MM/%AAAA",
					);
			}
		}
		let lEstSemaineFeriee;
		let lTableau = this.getInstance(
			this.IdentCalendrier,
		).getTableauInformations();
		lEstSemaineFeriee =
			lTableau[Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee] &&
			lTableau[
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			].domaine.getValeur(lDomaine.getPremierePosition(true));
		if (!this.donneesGrille.estPlanning) {
			const lFrequence =
				this.parametresSco.frequences &&
				this.parametresSco.frequences[lDomaine.getPremierePosition(true)]
					? this.parametresSco.frequences[lDomaine.getPremierePosition(true)]
							.libelle
					: "";
			if (lFrequence) {
				lLibelle +=
					" - " +
					ObjetTraduction_1.GTraductions.getValeur("Semaine") +
					" " +
					(lEstSemaineFeriee
						? ObjetTraduction_1.GTraductions.getValeur("Feriee").toLowerCase()
						: lFrequence);
			}
		}
		const lAcces = this.etatUtilisateurSco.getAcces();
		if (lAcces.autoriseSurDate && lAcces.dateDebut && lAcces.dateFin) {
			lLibelle +=
				" (" +
				ObjetTraduction_1.GTraductions.getValeur("EDT.consultableDuAu", [
					ObjetDate_1.GDate.formatDate(lAcces.dateDebut, "%JJ/%MM/%AA"),
					ObjetDate_1.GDate.formatDate(lAcces.dateFin, "%JJ/%MM/%AA"),
				]) +
				")";
		}
		lLibelle += "</span>";
		return lLibelle;
	}
	_avecRessourcesEtDomaine() {
		return (
			this.ressources &&
			this.ressources.count() > 0 &&
			!this._domaineSelectionneVide()
		);
	}
	_getIdConteneurListeEleves() {
		return this.getNomInstance(this.identListeEleves) + "_conteneur";
	}
	_viderListeEleves() {
		if (
			this.avecListeEleves &&
			this.etatUtilisateurSco.getAfficherListeElevesEDT()
		) {
			const lListe = this.getInstance(this.identListeEleves);
			lListe.setOptionsListe({
				listeCreations: null,
				avecLigneCreation: false,
				colonnesCachees: [
					MultiDonneesListe_Eleves.DonneesListe_Eleves.colonnes.Classe,
				],
			});
			lListe.setDonnees(
				new MultiDonneesListe_Eleves.DonneesListe_Eleves(
					new ObjetListeElements_1.ObjetListeElements(),
				),
			);
		}
	}
	_getDomaineSelectionne() {
		if (this.donneesGrille && this.donneesGrille.multiSelectionSemaines) {
			return this.etatUtilisateurSco.getDomaineSelectionne();
		}
		return new TypeDomaine_1.TypeDomaine().setValeur(
			true,
			this.etatUtilisateurSco.getSemaineSelectionnee(),
		);
	}
	_domaineSelectionneVide() {
		return this._getDomaineSelectionne().estVide();
	}
	_getParametresPDF() {
		const lRenvois = [
			TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisAucun,
			TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisSousBloc,
			TypeGestionRenvoisImp_1.TypeGestionRenvoisImp.impRenvoisApresPage,
		];
		const lRessources = new ObjetListeElements_1.ObjetListeElements().add(
			this.ressources,
		);
		lRessources.setSerialisateurJSON({ ignorerEtatsElements: true });
		let lDomaine;
		if (this.donneesGrille.multiSelectionSemaines) {
			lDomaine = this.etatUtilisateurSco.getDomaineSelectionne();
		} else {
			lDomaine = new TypeDomaine_1.TypeDomaine().setValeur(
				true,
				this.etatUtilisateurSco.getSemaineSelectionnee(),
			);
		}
		return {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.EDT,
			estPlanning: this.donneesGrille.estPlanning,
			estPlanningParRessource: this.donneesGrille.estPlanningParRessource,
			estPlanningOngletParJour:
				this.etatUtilisateurSco.getOnglet().typePlanningEDT ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.ongletParJour,
			estPlanningParJour:
				this.etatUtilisateurSco.getOnglet().typePlanningEDT ===
				TypeHoraireGrillePlanning_1.TypeHoraireGrillePlanning.parJour,
			indiceJour: this.donneesGrille.indiceJourCycle,
			ressource: lRessources.get(0),
			ressources: lRessources,
			domaine: lDomaine,
			avecCoursAnnules: this.donneesGrille.avecCoursAnnule,
			grilleInverse: this.getInstance(this.IdentGrille).estGrilleInverse(),
			prefsGrille:
				UtilitairePrefsGrilleStructure_1.UtilitairePrefsGrilleStructure.getPrefsGrille(
					this.donneesGrille.prefsGrille
						? this.donneesGrille.prefsGrille.genreRessource
						: this.ressources,
					this.donneesGrille.estPlanning,
					this.donneesGrille.prefsGrille
						? this.donneesGrille.prefsGrille.numEtablissement
						: null,
				),
			PARAMETRE_FENETRE: {
				choixRenvois: lRenvois,
				avecChoixEDTAnnuel: !this.donneesGrille.estPlanning,
			},
		};
	}
	_avecMenuContextuel() {
		return this.moduleSaisie ? this.moduleSaisie.avecMenuContextuel() : false;
	}
	_estCoursDejaSelectionne(aCours, aCoursPrecedentSelectionne) {
		return (
			aCoursPrecedentSelectionne &&
			aCoursPrecedentSelectionne.getNumero() === aCours.getNumero() &&
			aCoursPrecedentSelectionne.numeroSemaine === aCours.numeroSemaine
		);
	}
	_afficherMenuContextuelDeCours(aCours, aForcerNavigationClavier) {
		if (this.moduleSaisie) {
			this.moduleSaisie.afficherMenuContextuelDeCoursGrille(
				aCours,
				aForcerNavigationClavier,
			);
		}
	}
	async _requeteFicheCours(aCours, aParamMenuContextuel) {
		this._fermerFiches();
		if (
			aCours.getGenre() === TypeStatutCours_1.TypeStatutCours.ConseilDeClasse &&
			!this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.avecFicheCoursConseil,
			)
		) {
			return;
		}
		if (aCours.estSortiePedagogique) {
			this._viderListeEleves();
			this.fenetre_SortiePedagogique =
				UtilitaireEDTSortiePedagogique_1.UtilitaireEDTSortiePedagogique.afficherFenetreSortiePeda(
					{
						pere: this,
						cours: aCours,
						idCours: this.paramCours.id,
						surFermerFenetre: () => {
							this.fenetre_SortiePedagogique = null;
						},
					},
				);
			return;
		}
		let lRessource = aCours.ressource;
		if (!lRessource) {
			lRessource = this.ressources.get(0);
		}
		let lReponse;
		try {
			lReponse = await new ObjetRequeteFicheCours_1.ObjetRequeteFicheCours(
				this,
			).lancerRequete({
				cours: aCours,
				numeroSemaine: aCours.numeroSemaine,
				ressource: lRessource,
				avecListeEleves: !!this.avecListeEleves,
				avecNbEleves: !!this.avecListeEleves,
			});
		} catch (e) {
			await this.applicationSco
				.getMessage()
				.afficher({
					message:
						e || ObjetTraduction_1.GTraductions.getValeur("requete.erreur"),
				});
			this.afficherPage();
			return;
		}
		if (lReponse) {
			this._actionSurRequeteFicheCours(aParamMenuContextuel, lReponse);
		}
	}
	_actionApresRequeteDonneesContenusCDT(aJSON) {
		const lDonnee =
			aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
				? aJSON.ListeCahierDeTextes.getPremierElement()
				: null;
		if (lDonnee) {
			new ObjetDeserialiser_1.ObjetDeserialiser().deserialiserCahierDeTexte(
				lDonnee,
			);
			this._afficheFenetreDetail(lDonnee);
		} else {
		}
	}
	_afficheFenetreDetail(aDonnee, aParams) {
		let lGestionnaireBloc;
		let lCoordonnees;
		if (this.fenetreContenu) {
			lCoordonnees = this.fenetreContenu.coordonnees;
			this.fenetreContenu.fermer();
		}
		const lParams = { fenetre: true };
		if (aParams) {
			$.extend(lParams, aParams);
		}
		lGestionnaireBloc = ObjetIdentite_1.Identite.creerInstance(
			GestionnaireBlocCDC_1.GestionnaireBlocCDC,
			{ pere: this },
		);
		lGestionnaireBloc.setOptions({
			avecPastille: false,
			modeAffichage:
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique,
			avecZoneAction: false,
			avecBordure: false,
			avecOmbre: false,
			formatDate: "%JJJ %JJ %MMM",
			initPlie: false,
			cacherBoutonTAF: true,
			callBackTitre: undefined,
		});
		const lObjDonnees = {
			gestionnaireBloc: lGestionnaireBloc,
			element: aDonnee,
			coordonnees:
				lCoordonnees && lCoordonnees.left !== null && lCoordonnees.top !== null
					? lCoordonnees
					: undefined,
		};
		this.fenetreContenu = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Bloc_1.ObjetFenetre_Bloc,
			{ pere: this, initialiser: false },
		);
		this.fenetreContenu.setOptionsFenetre({ modale: false });
		this.fenetreContenu.initialiser();
		this.fenetreContenu.setDonnees(lObjDonnees);
	}
	_surCDTFicheCours(aCours, aNumeroSemaine) {
		this.paramFicheCDT = {
			pourCDT: true,
			cours: aCours,
			numeroSemaine: aNumeroSemaine,
		};
		new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
			this,
			this._actionSurRequeteFicheCDT.bind(this),
		).lancerRequete(this.paramFicheCDT);
	}
	_surEnteteFicheCours(aCours) {
		this.getInstance(this.IdentGrille)
			.getInstanceGrille()
			.selectionnerCours(aCours, true, true);
	}
	_actionSurRequeteFicheCours(aParamMenuContextuel, aJSON) {
		const lFicheCoursOuvert =
			this.getInstance(this.IdentFicheCours) &&
			this.getInstance(this.IdentFicheCours).EnAffichage;
		const lEvenementMenuContextuel =
			aParamMenuContextuel && aParamMenuContextuel.cours;
		if (aJSON.estProgrammationPunition) {
			this._viderListeEleves();
			this.fenetre_ProgrammationPunition =
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_ProgrammationPunition_1.ObjetFenetre_ProgrammationPunition,
					{ pere: this },
					{
						idPositionnement: this.paramCours.id,
						callbackApresFermer: () => {
							this.fenetre_ProgrammationPunition = null;
						},
					},
				).setDonnees(aJSON);
			return;
		}
		if (this.avecListeEleves) {
			this.paramCours.listeEleves = aJSON.listeEleves;
			this.paramCours.listeEleves.groupePourEleve = aJSON.groupePourEleve;
			if (this.etatUtilisateurSco.getAfficherListeElevesEDT()) {
				const lListeEleves = this.getInstance(this.identListeEleves);
				ObjetStyle_2.GStyle.setVisible(this._getIdConteneurListeEleves(), true);
				const lEditionSurGroupeGAEV =
					this.moduleAffectationElevesGroupe &&
					this.moduleAffectationElevesGroupe.autorisationEditionGroupeGAEV(
						this.paramCours.listeEleves.groupePourEleve,
						aJSON.estCoursGAEV,
					);
				if (this.moduleAffectationElevesGroupe) {
					lListeEleves.setOptionsListe(
						this.moduleAffectationElevesGroupe.getOptionsListe(
							this.paramCours.listeEleves.groupePourEleve,
							aJSON.estCoursGAEV,
						),
					);
				} else {
					lListeEleves.setOptionsListe({
						listeCreations: null,
						avecLigneCreation: false,
						AvecSuppression: false,
					});
				}
				lListeEleves.setOptionsListe({
					colonnesCachees: aJSON.afficherClasse
						? null
						: [MultiDonneesListe_Eleves.DonneesListe_Eleves.colonnes.Classe],
				});
				lListeEleves.setDonnees(
					new MultiDonneesListe_Eleves.DonneesListe_Eleves(
						aJSON.listeEleves,
						lEditionSurGroupeGAEV,
						this.listeAvecPhotos,
					),
				);
			}
		}
		if (lFicheCoursOuvert || !lEvenementMenuContextuel) {
			const lDonnees = {
				id: this.paramCours.id,
				listeCours: aJSON.listeCours,
				coursSelectionne: this.paramCours.cours,
				domaine: this._getDomaineSelectionne(),
				nonEditable: true,
				callbackCDT: this._surCDTFicheCours.bind(this),
				callbackEntete: this._surEnteteFicheCours.bind(this),
			};
			if (this.moduleSaisie) {
				$.extend(lDonnees, this.moduleSaisie.getDonneesFicheCours());
			}
			this.getInstance(this.IdentFicheCours).setDonneesFicheCours(lDonnees);
		}
		if (lEvenementMenuContextuel) {
			const lCours = aParamMenuContextuel.cours;
			if (this._avecMenuContextuel()) {
				this._afficherMenuContextuelDeCours(
					lCours,
					aParamMenuContextuel.forcerNavigationClavier,
				);
			}
		}
	}
	_getDisplayIcalSalles() {
		const lAutorise =
			this.etatUtilisateurSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Administrateur &&
			this.etatUtilisateurSco.getGenreOnglet() ===
				Enumere_Onglet_1.EGenreOnglet.EmploiDuTempsSalle;
		return lAutorise;
	}
}
exports.ObjetAffichagePageEmploiDuTemps = ObjetAffichagePageEmploiDuTemps;
