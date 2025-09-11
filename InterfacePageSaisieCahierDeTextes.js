exports.InterfacePageSaisieCahierDeTextes = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DomaineInformation_1 = require("Enumere_DomaineInformation");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetFenetre_RattachementCDT_1 = require("ObjetFenetre_RattachementCDT");
const ObjetRequeteSaisieRattachementCDT_1 = require("ObjetRequeteSaisieRattachementCDT");
const ObjetRequetePageSaisieCahierDeTextes_General_1 = require("ObjetRequetePageSaisieCahierDeTextes_General");
const ObjetRequeteListeCDTPourRattachement_1 = require("ObjetRequeteListeCDTPourRattachement");
const ObjetFenetre_DevoirSurTable_1 = require("ObjetFenetre_DevoirSurTable");
const GUID_1 = require("GUID");
const TinyInit_1 = require("TinyInit");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetPosition_1 = require("ObjetPosition");
const CollectionRequetes_1 = require("CollectionRequetes");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const _InterfacePageSaisieCahierDeTextes_1 = require("_InterfacePageSaisieCahierDeTextes");
const DonneesListe_CDTsPrecedents_1 = require("DonneesListe_CDTsPrecedents");
const Enumere_ElementCDT_1 = require("Enumere_ElementCDT");
const Enumere_EvenementEDT_1 = require("Enumere_EvenementEDT");
const Enumere_LienDS_1 = require("Enumere_LienDS");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfaceListeTAFsCDT_1 = require("InterfaceListeTAFsCDT");
const ObjetFenetre_Categorie_1 = require("ObjetFenetre_Categorie");
const ObjetFenetre_ElementsProgramme_1 = require("ObjetFenetre_ElementsProgramme");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const ObjetFenetre_PanierRessourceKiosque_1 = require("ObjetFenetre_PanierRessourceKiosque");
const ObjetFenetre_PieceJointe_1 = require("ObjetFenetre_PieceJointe");
const ObjetFenetre_URLKiosque_1 = require("ObjetFenetre_URLKiosque");
const ObjetModule_EDTSaisie_1 = require("ObjetModule_EDTSaisie");
const ObjetRequeteFicheCDT_1 = require("ObjetRequeteFicheCDT");
const ObjetRequetePageEmploiDuTemps_1 = require("ObjetRequetePageEmploiDuTemps");
const ObjetRequetePageSaisieCahierDeTextes_1 = require("ObjetRequetePageSaisieCahierDeTextes");
const ObjetRequeteSaisieCahierDeTextes_1 = require("ObjetRequeteSaisieCahierDeTextes");
const TypeOrigineCreationCategorieCahierDeTexte_1 = require("TypeOrigineCreationCategorieCahierDeTexte");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const UtilitaireLienCoursPrecedentSuivant_1 = require("UtilitaireLienCoursPrecedentSuivant");
const InterfaceContenuCahierDeTextes_1 = require("InterfaceContenuCahierDeTextes");
const EGenreEvenementContenuCahierDeTextes_1 = require("EGenreEvenementContenuCahierDeTextes");
const EGenreFenetreDocumentJoint_1 = require("EGenreFenetreDocumentJoint");
const TypeOptionPublicationCDT_1 = require("TypeOptionPublicationCDT");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const UtilitaireCDT_1 = require("UtilitaireCDT");
const GestionnaireBlocCDT_1 = require("GestionnaireBlocCDT");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const ObjetFenetre_PostIt_1 = require("ObjetFenetre_PostIt");
const ObjetFenetre_ChoixDossierCopieCDT_1 = require("ObjetFenetre_ChoixDossierCopieCDT");
const InterfaceGrilleEDT_1 = require("InterfaceGrilleEDT");
class ObjetRequeteSaisiePreferencesRessourcesKiosque extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisiePreferencesRessourcesKiosque",
	ObjetRequeteSaisiePreferencesRessourcesKiosque,
);
var EGenreSelectionSemaine;
(function (EGenreSelectionSemaine) {
	EGenreSelectionSemaine[(EGenreSelectionSemaine["Sans"] = 0)] = "Sans";
	EGenreSelectionSemaine[(EGenreSelectionSemaine["Avec"] = 1)] = "Avec";
	EGenreSelectionSemaine[(EGenreSelectionSemaine["Forcer"] = 2)] = "Forcer";
})(EGenreSelectionSemaine || (EGenreSelectionSemaine = {}));
var EGenreCommandeCdT;
(function (EGenreCommandeCdT) {
	EGenreCommandeCdT[(EGenreCommandeCdT["CopierCdT"] = 0)] = "CopierCdT";
	EGenreCommandeCdT[(EGenreCommandeCdT["CollerCdT"] = 1)] = "CollerCdT";
	EGenreCommandeCdT[(EGenreCommandeCdT["SupprimerCdT"] = 2)] = "SupprimerCdT";
	EGenreCommandeCdT[(EGenreCommandeCdT["AffecterProgressionAuCdT"] = 3)] =
		"AffecterProgressionAuCdT";
	EGenreCommandeCdT[(EGenreCommandeCdT["RattacherCDT"] = 4)] = "RattacherCDT";
	EGenreCommandeCdT[(EGenreCommandeCdT["AjouterContenuDansProgression"] = 5)] =
		"AjouterContenuDansProgression";
	EGenreCommandeCdT[(EGenreCommandeCdT["saisieDS"] = 6)] = "saisieDS";
	EGenreCommandeCdT[(EGenreCommandeCdT["saisieEval"] = 7)] = "saisieEval";
})(EGenreCommandeCdT || (EGenreCommandeCdT = {}));
let uEstNoteProchaineSeanceVisible = false;
class InterfacePageSaisieCahierDeTextes extends _InterfacePageSaisieCahierDeTextes_1._InterfacePageSaisieCahierDeTextes {
	constructor(...aParams) {
		super(...aParams);
		this.objetParametres = this.applicationSco.getObjetParametres();
		this.idBandeauGauche = this.applicationSco.idBreadcrumbPerso;
		this.idBandeauDroite = this.Nom + "_BandeauDroite";
		this.idPublieContenu = this.Nom + "_ImagePublieContenu";
		this.idContenu = this.Nom + "_Contenu";
		this.idNoteProcghaineSeance = this.Nom + "_NoteProchaineSeance";
		this.idElementsProgramme = this.Nom + "_ElementsProgramme";
		this.idKiosque = this.Nom + "_Kiosque";
		this.idDescriptif = this.Nom + "_Descriptif";
		this.classDivBlocTiny = GUID_1.GUID.getClassCss();
		this.avecQCM = true;
		this.avecGestionNotation = this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
		);
		this.enAuthCloud = false;
		this.paramsListeCDTPrec = {
			deploye: false,
			nbAffiches: 3,
			nbMaxAffiches: 10,
			hauteurListe: 66,
		};
		this.listeCDTPleinEcran = false;
		this.palierElementTravailleSelectionne = null;
		this.moduleSaisieCours = new ObjetModule_EDTSaisie_1.ObjetModule_EDTSaisie({
			instance: this,
		});
		this.Actif = false;
		this.idPremierObjet = this.idBandeauGauche;
		this.identContenus = [];
		this.indiceContenus = [];
		if (this.etatUtilisateur.getNavigationCours()) {
			this.Cours = this.etatUtilisateur.getNavigationCours();
			this.etatUtilisateur.setNavigationCours(null);
		}
		this._cacheJoursPresenceCours = {};
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.etatSaisie,
			this._changementEtatSaisie,
			this,
		);
	}
	construireInstances() {
		this.IdentCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this.evenementSurCalendrier,
			this.initialiserCalendrier,
		);
		this.IdPremierElement = this.getInstance(
			this.IdentCalendrier,
		).getPremierElement();
		this.identFenetreEditionCategorie = this.add(
			ObjetFenetre_Categorie_1.ObjetFenetre_Categorie,
			this.evenementEditionCategorie,
		);
		this.IdentEditionPieceJointe = this.add(
			ObjetFenetre_PieceJointe_1.ObjetFenetre_PieceJointe,
			this.evenementEditionDocumentJoint,
		);
		this.IdentGrille = this.add(
			InterfaceGrilleEDT_1.InterfaceGrilleEDT,
			this.evenementSurGrille,
			this.initialiserGrille,
		);
		this.identFenetreChoixDossierCopieCDT = this.addFenetre(
			ObjetFenetre_ChoixDossierCopieCDT_1.ObjetFenetre_ChoixDossierCopieCDT,
		);
		this.identFenetreRattachementCDT = this.addFenetre(
			ObjetFenetre_RattachementCDT_1.ObjetFenetre_RattachementCDT,
			this.evenementSurFenetreRattachementCDT,
			this.initialiserFenetreRattachementCDT,
		);
		if (this.etatUtilisateur.listeCloud.count() > 0) {
			this.identFenetreFichiersCloud = this.addFenetre(
				ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
				this.eventFenetreFichiersCloud,
			);
		}
		this.identFenetreElementsProgramme = this.addFenetre(
			ObjetFenetre_ElementsProgramme_1.ObjetFenetre_ElementsProgramme,
			this._evenementSurFenetreElementsProgramme,
		);
		this.IdentDatePublication = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDatePublication,
			this.initialiserDatePublication,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			this.evenementSurVisuEleve,
		);
		this.identListeCDTPrec = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListeCDTPrec.bind(this),
		);
		this.identListeTAFs = this.add(
			InterfaceListeTAFsCDT_1.InterfaceListeTAFsCDT,
			this.evenementTAFDesCours,
		);
		this.utilLienBtns =
			new UtilitaireLienCoursPrecedentSuivant_1.UtilitaireLienCoursPrecedentSuivant(
				{
					idRef: this.Nom,
					callback: this.evenementSurBoutonRechercheCours.bind(this),
					controleNavigation: true,
					pere: this,
				},
			);
		this.identFenetreURLKiosque = this.addFenetre(
			ObjetFenetre_URLKiosque_1.ObjetFenetre_URLKiosque,
			this.evntSurFenetreURLKiosque,
			this.initFenetreURLKiosque,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	jsxModeleBoutonAfficherCahiersDeTexteDetaches() {
		return {
			event: async () => {
				this.avecDrag = true;
				const lReponse =
					await new ObjetRequeteListeCDTPourRattachement_1.ObjetRequeteListeCDTPourRattachement(
						this,
					).lancerRequete();
				this.actionSurRattachementCDT(lReponse.listeCDT);
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.BoutonRattachementCDT",
				);
			},
			getDisabled: () => {
				return !this.etatUtilisateur.existeCDTsDetaches;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			listeCDT: {
				btnDeploy: {
					event: function () {
						const lAvecCDTs = aInstance.listeCDTsPrecedents
							? aInstance.listeCDTsPrecedents.count() > 0
							: false;
						aInstance.paramsListeCDTPrec.deploye =
							!aInstance.paramsListeCDTPrec.deploye && lAvecCDTs;
						ObjetHtml_1.GHtml.setDisplay(
							aInstance.getInstance(aInstance.identListeCDTPrec).getNom(),
							aInstance.paramsListeCDTPrec.deploye,
						);
						!!aInstance.paramsListeCDTPrec.deploye
							? $(this.node).attr("aria-expanded", "true")
							: $(this.node).attr("aria-expanded", "false");
						aInstance.actualiser(true);
						this.node.focus();
					},
					getSelection: function () {
						return aInstance.paramsListeCDTPrec.deploye;
					},
					afficherDeploy: function () {
						return !aInstance.listeCDTPleinEcran;
					},
				},
				btnIconeMoins: {
					event: function () {
						aInstance.paramsListeCDTPrec.nbAffiches = Math.max(
							1,
							aInstance.paramsListeCDTPrec.nbAffiches - 1,
						);
						aInstance._actualiserListeCDTsPrecedents();
					},
					getDisabled: function () {
						return (
							aInstance.paramsListeCDTPrec.nbAffiches < 2 ||
							!aInstance.listeCDTsPrecedents ||
							aInstance.listeCDTsPrecedents.count() === 0
						);
					},
				},
				btnIconePlus: {
					event: function () {
						aInstance.paramsListeCDTPrec.nbAffiches = Math.min(
							aInstance.listeCDTsPrecedents.count(),
							Math.min(
								aInstance.paramsListeCDTPrec.nbMaxAffiches,
								aInstance.paramsListeCDTPrec.nbAffiches + 1,
							),
						);
						aInstance._actualiserListeCDTsPrecedents();
					},
					getDisabled: function () {
						return (
							aInstance.paramsListeCDTPrec.nbAffiches >=
								aInstance.paramsListeCDTPrec.nbMaxAffiches ||
							!aInstance.listeCDTsPrecedents ||
							aInstance.paramsListeCDTPrec.nbAffiches >=
								aInstance.listeCDTsPrecedents.count()
						);
					},
				},
				htmlElementsPrecedents: function () {
					if (
						!aInstance.listeCDTsPrecedents ||
						aInstance.listeCDTsPrecedents.count() === 0
					) {
						return (
							'<span style="' +
							ObjetStyle_1.GStyle.composeCouleurTexte(
								GCouleur.nonEditable.texte,
							) +
							'">' +
							aInstance.paramsListeCDTPrec.nbAffiches +
							"</span>"
						);
					}
					return aInstance.paramsListeCDTPrec.nbAffiches;
				},
				htmlElementsPrecedentsWAI() {
					return (
						aInstance.paramsListeCDTPrec.nbAffiches +
						" " +
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ContenusPrecedents",
						)
					);
				},
				afficherTraitSeparation: function () {
					return !aInstance.listeCDTPleinEcran;
				},
			},
			btnAjouterContenu: {
				event() {
					aInstance.evenementSurAjoutContenu();
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.hintBoutonAjoutContenu",
					);
				},
				getDisabled() {
					return (
						!aInstance.CahierDeTextes || !!aInstance.CahierDeTextes.verrouille
					);
				},
			},
			btnElementsProgramme: {
				event() {
					aInstance
						.getInstance(aInstance.identFenetreElementsProgramme)
						.setDonnees({
							cours: aInstance.Cours,
							numeroSemaine: aInstance.NumeroSemaine,
							listeElementsProgramme:
								aInstance.CahierDeTextes.listeElementsProgrammeCDT,
							palier: aInstance.palierElementTravailleSelectionne,
						});
				},
				getDisabled() {
					return (
						!aInstance.CahierDeTextes || !!aInstance.CahierDeTextes.verrouille
					);
				},
			},
			btnAfficherCoursAnnules: {
				event() {
					aInstance.etatUtilisateur.setAvecCoursAnnule(
						!aInstance.etatUtilisateur.getAvecCoursAnnule(),
					);
					aInstance._actualiserGrille();
				},
				getSelection() {
					return aInstance.etatUtilisateur.getAvecCoursAnnule();
				},
				getTitle() {
					return aInstance.etatUtilisateur.getAvecCoursAnnule()
						? ObjetTraduction_1.GTraductions.getValeur(
								"EDT.MasquerCoursAnnules",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"EDT.AfficherCoursAnnules",
							);
				},
				getClassesMixIcon() {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesMixIconAfficherCoursAnnules(
						aInstance.etatUtilisateur.getAvecCoursAnnule(),
					);
				},
			},
			btnParametrerRessourceKiosque: {
				event() {
					aInstance._surOuvertureURLKiosque(false);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.kiosque.fenetre.titreSelect",
					);
				},
			},
			contenu: {
				afficherTraitSeparation: function () {
					return !aInstance.ContenuPleinEcran;
				},
			},
			btnAgrandirReduireZoneListeCDT: {
				event() {
					aInstance._evenementSurZoomListeCDT(!aInstance.listeCDTPleinEcran);
				},
				getTitle() {
					if (aInstance.listeCDTPleinEcran) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.hintBoutonPleinEcranReduire",
						);
					}
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.hintBoutonPleinEcranAgrandir",
					);
				},
			},
			btnAgrandirReduireZoneContenu: {
				event() {
					aInstance.evenementSurBoutonPleinEcranContenu();
				},
				getTitle() {
					if (aInstance.ContenuPleinEcran) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.hintBoutonPleinEcranReduire",
						);
					}
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.hintBoutonPleinEcranAgrandir",
					);
				},
			},
			taf: {
				afficherTraitSeparation() {
					return (
						!aInstance.TAFPleinEcran &&
						aInstance.applicationSco.parametresUtilisateur.get(
							"CDT.Commentaire.ActiverSaisie",
						)
					);
				},
			},
			mrFicheElementsProg: {
				event: function () {
					const lNode = this.node;
					aInstance.applicationSco.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.AideSaisieElementsPgm",
						),
						callback: function () {
							ObjetHtml_1.GHtml.setFocus(lNode);
						},
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.mrFicheInformation",
					);
				},
			},
			estVisibleCbPublierCDT: function () {
				const lCDT = aInstance.CahierDeTextes;
				let lAuMoinsUnContenu = false;
				if (
					lCDT &&
					lCDT.listeContenus &&
					lCDT.listeContenus.getNbrElementsExistes() > 0
				) {
					lCDT.listeContenus.parcourir((aContenu) => {
						if (!aContenu.estVide) {
							lAuMoinsUnContenu = true;
						}
					});
				}
				return (
					!!lCDT &&
					lCDT.getNumero() &&
					!lCDT.verrouille &&
					!aInstance._estPublieAuto() &&
					(lAuMoinsUnContenu ||
						(lCDT.ListeTravailAFaire &&
							lCDT.ListeTravailAFaire.getNbrElementsExistes() > 0))
				);
			},
			estVisibleDatePublication: function () {
				const lEstPublie =
					!!aInstance.CahierDeTextes && !!aInstance.CahierDeTextes.publie;
				return lEstPublie;
			},
			getTitlePublierCDT: function () {
				let lTitlePublication = "";
				if (
					!!aInstance.CahierDeTextes &&
					aInstance.CahierDeTextes.getNumero() &&
					!aInstance._estPublieAuto()
				) {
					if (
						aInstance.applicationSco.parametresUtilisateurBase
							.optionPublicationCDT ===
						TypeOptionPublicationCDT_1.TypeOptionPublicationCDT
							.OPT_PublicationDebutCours
					) {
						lTitlePublication = ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.hintPublie_Debut",
						);
					} else {
						lTitlePublication = ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.hintPublie",
						);
					}
				}
				return lTitlePublication;
			},
			checkPublierCDT: {
				getValue: function () {
					return (
						!!aInstance.CahierDeTextes && !!aInstance.CahierDeTextes.publie
					);
				},
				setValue: function (aValeur) {
					if (!!aInstance.CahierDeTextes) {
						aInstance.CahierDeTextes.publie = aValeur;
						const lCDTEstConsiderePublie =
							aValeur || !aInstance._estPublieAuto();
						aInstance
							.getInstance(aInstance.identListeTAFs)
							.actualiser(lCDTEstConsiderePublie);
						const lIdentDate = aInstance.getInstance(
							aInstance.IdentDatePublication,
						);
						lIdentDate.setActif(aValeur);
						aInstance.CahierDeTextes.datePublication = aValeur
							? aInstance.CahierDeTextes.datePublication
								? aInstance.CahierDeTextes.datePublication
								: ObjetDate_1.GDate.getDateCourante()
							: null;
						lIdentDate.setDonnees(aInstance.CahierDeTextes.datePublication);
						aInstance.setEtatSaisie(true);
					}
				},
			},
			avecSaisieCommentaire() {
				return aInstance.applicationSco.parametresUtilisateur.get(
					"CDT.Commentaire.ActiverSaisie",
				);
			},
			getHtmlNoteProchaineSeance() {
				return `<header><h4 id="${aInstance.idNoteProcghaineSeance}">${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.postIt.seanceSuivante.titre")}</h4><ie-btnicon class="icon_fermeture_widget m-left-l" ie-model="displayNoteProchaineSeance(true)"></ie-btnicon></header><ie-textareamax aria-labelledby="${aInstance.idNoteProcghaineSeance}" ie-model="textNoteProchaineSeance" maxlength="${aInstance.CahierDeTextes && aInstance.CahierDeTextes.taillePostIt ? aInstance.CahierDeTextes.taillePostIt : 10000}" class="full-width"></ie-textareamax>`;
			},
			displayNoteProchaineSeance: {
				event() {
					uEstNoteProchaineSeanceVisible = !uEstNoteProchaineSeanceVisible;
				},
				getTitle(aEstCroixFermer) {
					if (aEstCroixFermer) {
						return ObjetTraduction_1.GTraductions.getValeur("Fermer");
					}
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.postIt.seanceSuivante.hintBtn",
					);
				},
				getSelection() {
					return uEstNoteProchaineSeanceVisible;
				},
			},
			avecNoteProchaineSeance() {
				return (
					uEstNoteProchaineSeanceVisible &&
					aInstance.applicationSco.parametresUtilisateur.get(
						"CDT.Commentaire.ActiverSaisie",
					)
				);
			},
			textNoteProchaineSeance: {
				getValue: function () {
					return aInstance.CahierDeTextes &&
						aInstance.CahierDeTextes.noteProchaineSeance
						? aInstance.CahierDeTextes.noteProchaineSeance
						: "";
				},
				setValue: function (aValeur) {
					aInstance.CahierDeTextes.noteProchaineSeance = aValeur;
					aInstance.setEtatSaisie(true);
				},
			},
			afficherNoteCoursPrecedent: {
				event() {
					if (!!aInstance.fenetreNotePourSeance) {
						aInstance.fenetreNotePourSeance.fermer();
					}
					aInstance.fenetreNotePourSeance =
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_1.ObjetFenetre,
							{
								pere: aInstance,
								initialiser: (aInstanceFenetre) => {
									aInstanceFenetre.setOptionsFenetre({
										largeur: 600,
										hauteur: 400,
										hauteurMaxContenu: 400,
										modale: false,
										titre: ObjetTraduction_1.GTraductions.getValeur(
											"CahierDeTexte.postIt.pourCetteSeance.titre",
										),
									});
								},
							},
						);
					aInstance.fenetreNotePourSeance.afficher(
						`<div class="conteneur-postIt full-weight p-all"><p class="AvecScrollVerticalAuto">${ObjetChaine_1.GChaine.replaceRCToHTML(aInstance.CoursPrecedent.noteProchaineSeance)}</p></div>`,
					);
				},
				getTitle() {
					return ObjetChaine_1.GChaine.enleverEntites(
						`${ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.postIt.pourCetteSeance.titre")} :\r\n${aInstance.CoursPrecedent.noteProchaineSeance}`,
					);
				},
			},
			btnCommentairePrive: {
				event() {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_PostIt_1.ObjetFenetre_PostIt,
						{
							pere: aInstance,
							initialiser: (aInstanceFenetre) => {
								aInstanceFenetre.setOptionsFenetre({
									titre: ObjetTraduction_1.GTraductions.getValeur(
										"CahierDeTexte.postIt.commentairePrive.titre",
									),
									largeur: 600,
									hauteur: 400,
								});
							},
							evenement: (aCommentairePrive) => {
								aInstance.CahierDeTextes.commentairePrive = aCommentairePrive;
								aInstance.setEtatSaisie(true);
								aInstance.valider();
							},
						},
					).setDonnees({
						texte: aInstance.CahierDeTextes.commentairePrive,
						label:
							ObjetTraduction_1.GTraductions.getValeur("Commentaire") +
							" (" +
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.postIt.commentairePrive.infoTitre",
							) +
							")",
						taillePostIt: aInstance.CahierDeTextes.taillePostIt,
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.postIt.commentairePrive.hintBtn",
					);
				},
			},
		});
	}
	jsxModelBoutonInfosDetails() {
		return {
			event: () => {
				this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.ouvrirFenetreDetailsGrille();
			},
		};
	}
	composeBandeauGauche() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "table-header" },
				IE.jsx.str(
					"h1",
					{ id: this.idBandeauGauche, class: "titre-onglet", tabindex: "0" },
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.SaisieCahierDeTextes",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "bta-contain" },
					UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCoursAnnulesControleur(
						"btnAfficherCoursAnnules",
					),
					UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnAfficherCahiersDeTextesDetaches(
						this.jsxModeleBoutonAfficherCahiersDeTexteDetaches.bind(this),
					),
					UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnInformationsGrille(
						this.jsxModelBoutonInfosDetails.bind(this),
					),
				),
			),
		);
		return T.join("");
	}
	composeBandeauDroite() {
		const lJsxImagePublication = () => {
			const lEstPublie = !!this.CahierDeTextes && !!this.CahierDeTextes.publie;
			const lAEtePublieAuto = this._estPublieAuto();
			return lEstPublie || lAEtePublieAuto ? "Image_Publie" : "Image_NonPublie";
		};
		const lJsxAttributesImagePublication = () => {
			const lEstPublie = !!this.CahierDeTextes && !!this.CahierDeTextes.publie;
			const lAEtePublieAuto = this._estPublieAuto();
			const lTrad =
				lEstPublie || lAEtePublieAuto
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.WAI.CDTPublie",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.WAI.CDTNonPublie",
						);
			return { title: lTrad, "aria-label": lTrad };
		};
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "table-header" },
				IE.jsx.str("div", {
					role: "heading",
					"aria-level": "2",
					id: this.idBandeauDroite,
					class: "titre",
					"ie-ellipsis": true,
				}),
				IE.jsx.str(
					"div",
					{ class: "bta-contain", "ie-display": "estVisibleCbPublierCDT" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "checkPublierCDT", "ie-title": "getTitlePublierCDT" },
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.publie"),
					),
					IE.jsx.str("div", {
						"ie-display": "estVisibleDatePublication",
						id: this.getInstance(this.IdentDatePublication).getNom(),
					}),
					IE.jsx.str("div", {
						id: this.idPublieContenu,
						"ie-class": lJsxImagePublication,
						class: "hide",
						style: "width:2.4rem",
						role: "img",
						"ie-attr": lJsxAttributesImagePublication,
					}),
				),
			),
		);
		return T.join("");
	}
	construireStructureAffichageAutre() {
		const lWidth = "450px";
		return IE.jsx.str(
			"div",
			{ class: "full-height flex-contain cols p-all flex-gap" },
			IE.jsx.str("div", {
				id: this.Nom + "_Page_Message",
				class: "fix-bloc Gras AlignementMilieu",
			}),
			IE.jsx.str("div", {
				id: this.getInstance(this.IdentCalendrier).getNom(),
				class: "fix-bloc",
			}),
			IE.jsx.str(
				"div",
				{ id: this.Nom + "_Page", class: "fluid-bloc flex-contain" },
				IE.jsx.str(
					"div",
					{
						id: this.Nom + "_ZoneGrille",
						class: "fix-bloc flex-contain cols full-height",
					},
					IE.jsx.str("div", { class: "fix-bloc" }, this.composeBandeauGauche()),
					IE.jsx.str(
						"div",
						{
							id: this.getInstance(this.IdentGrille).getNom(),
							class: "fluid-bloc p-top",
							style: `width:${parseInt(lWidth) + GNavigateur.getLargeurBarreDeScroll()}px`,
						},
						this.composeBandeauGauche(),
					),
					IE.jsx.str(
						"div",
						{
							class:
								"fix-bloc m-bottom flex-contain flex-center justify-center p-all",
							style: "height: 10px",
						},
						this.utilLienBtns.construire(),
					),
				),
				IE.jsx.str(
					"div",
					{
						id: this.Nom + "_ZoneDeSaisie_Message",
						class:
							"fluid-bloc full-height flex-contain cols flex-center justify-center",
						style: "height:290px;",
						tabindex: "0",
					},
					IE.jsx.str(
						"span",
						{ class: "Gras" },
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.SelectionnerUnCoursPourSaisirCDT",
						),
					),
				),
				IE.jsx.str(
					"div",
					{
						id: this.Nom + "_ZoneDeSaisie",
						class: "fluid-bloc full-height p-left flex-contain cols",
						style: "display: none; position:relative; top:0px",
					},
					IE.jsx.str("div", { class: "fix-bloc" }, this.composeBandeauDroite()),
					IE.jsx.str(
						"div",
						{ id: this.Nom + "_P3_2", class: "fix-bloc flex-contain cols" },
						this._composeListeCDTsPrecedents(),
					),
					IE.jsx.str(
						"div",
						{ id: this.Nom + "_P3_3", class: "fluid-bloc flex-contain cols" },
						this._composeLigneZoneContenu(),
						this._composeLigneZoneElementsProgramme(),
						this._composeLigneZoneTAF(),
						this.applicationSco.parametresUtilisateur.get(
							"CDT.Commentaire.ActiverSaisie",
						)
							? this._composeLigneZoneCommentairePrive()
							: "",
					),
				),
			),
		);
	}
	initialiserCalendrier(aInstance) {
		UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aInstance);
		aInstance.setControleNavigation(true);
	}
	initialiserGrille(aInstance) {
		aInstance.setOptionsInterfaceGrilleEDT({
			minHeight: 290,
			optionsGrille: {
				avecDrop: true,
				callbackAcceptDraggable: (aParamsDrop) => {
					const lData = aParamsDrop.drag.data;
					return !!(
						lData &&
						lData.estObjetListe &&
						lData.article &&
						lData.article.estRattachementCDT
					);
				},
				callbackDropCellule: this.callbackDropCellule.bind(this),
			},
			evenementMouseDownPlace: () => {
				this.Cours = null;
				if (this.fenetreCDT) {
					this.fenetreCDT.fermer();
				}
				this.setActif(false);
			},
		});
		aInstance.setControleNavigation(true);
	}
	callbackDropCellule(aIndiceCours, aParamsDrop) {
		const lData = aParamsDrop.drag.data;
		const lCahierDeTextes = this.listeCDT.getElementParNumero(
			lData.article.getNumero(),
		);
		const lCours = this.listeCours.get(aIndiceCours);
		const lHeure = this.objetParametres.LibellesHeures.getLibelle(
			lCours.Debut % this.objetParametres.PlacesParJour,
		);
		const lMessage = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.Rattachement.Confirmation",
			[
				ObjetDate_1.GDate.formatDate(lCours.DateDuCours, "%JJJJ %J %MMMM"),
				lHeure,
			],
		);
		if (lCahierDeTextes && lCours) {
			this.applicationSco
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: lMessage,
					callback: this._apresConfirmationCallbackDropCellule.bind(
						this,
						lCahierDeTextes,
						lCours,
					),
				});
		}
	}
	_apresConfirmationCallbackDropCellule(aCahierDeTextes, aCours, aGenreBouton) {
		if (aGenreBouton === Enumere_Action_1.EGenreAction.Valider) {
			const lListeCDTaSupprimer = this.listeCDT.getListeElements((aElement) => {
				return !aElement.existe();
			});
			new ObjetRequeteSaisieRattachementCDT_1.ObjetRequeteSaisieRattachementCDT(
				this,
				this._actionSurRequeteSaisieRattachementCDT,
			).lancerRequete({
				cahierDeTextes: aCahierDeTextes,
				cours: aCours,
				numeroSemaine: this.NumeroSemaine,
				listeCDT: lListeCDTaSupprimer.count() > 0 ? lListeCDTaSupprimer : null,
			});
			if (
				this.existeInstance(this.identFenetreRattachementCDT) &&
				this.getInstance(this.identFenetreRattachementCDT).estAffiche()
			) {
				this.getInstance(this.identFenetreRattachementCDT).fermer();
			}
		}
		this._verifierListeCDTAAffecter(this.listeCDT);
	}
	initialiserFenetreRattachementCDT(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.FenetreRattachementCDT",
			),
			largeur: 600,
			hauteur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.annuler"),
				ObjetTraduction_1.GTraductions.getValeur("principal.affecter"),
			],
		});
	}
	eventFenetreFichiersCloud(aParam) {
		if (aParam.listeNouveauxDocs && aParam.listeNouveauxDocs.count() > 0) {
			const lElementCourant =
				this.genreElementSelectionne ===
				Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire
					? this.tafCourant
					: this.contenuCourant;
			lElementCourant.ListePieceJointe.add(aParam.listeNouveauxDocs);
			lElementCourant.estVide = false;
			this.ListeDocumentsJoints.add(aParam.listeNouveauxDocs);
			this.actualiser(true);
			lElementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.setEtatSaisie(true);
		}
	}
	initialiserDatePublication(aInstance) {
		aInstance.setVisible(false);
		aInstance.setOptionsObjetCelluleDate({
			avecBoutonsPrecedentSuivant: false,
		});
		aInstance.setParametresFenetre(
			this.objetParametres.PremierLundi,
			this.objetParametres.PremiereDate,
			this.objetParametres.DerniereDate,
			this.objetParametres.JoursOuvres,
			null,
			this.objetParametres.JoursFeries,
			null,
		);
	}
	recupererDonnees(aAvecRequeteGenerale) {
		aAvecRequeteGenerale =
			aAvecRequeteGenerale === null || aAvecRequeteGenerale === undefined
				? true
				: aAvecRequeteGenerale;
		const lCalendrier = this.getInstance(this.IdentCalendrier);
		lCalendrier.setFrequences(this.objetParametres.frequences);
		lCalendrier.setDomaineInformation(
			IE.Cycles.getDomaineFerie(),
			Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee,
		);
		lCalendrier.setPeriodeDeConsultation(
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
		if (this.moduleSaisieCours.afficherDomaineClotureCalendrier()) {
			lCalendrier.setDomaineInformation(
				this.objetParametres.domaineVerrou,
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Cloturee,
			);
		}
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		if (aAvecRequeteGenerale) {
			new ObjetRequetePageSaisieCahierDeTextes_General_1.ObjetRequetePageSaisieCahierDeTextes_General(
				this,
				this.actionSurRecupererDonnees,
			).lancerRequete(
				!this.etatUtilisateur.getDomainePresence(
					this.etatUtilisateur.getMembre(),
				),
			);
		} else {
			new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
				this,
				this.actionSurCalendrier,
			).lancerRequete({ numeroSemaine: this.NumeroSemaine });
		}
	}
	recupererCahierDeTextes() {
		const lParam = {
			cours: this.Cours,
			numeroSemaine: this.NumeroSemaine,
			avecJoursPresence: !this._cacheJoursPresenceCours[this.Cours.getNumero()],
		};
		new ObjetRequetePageSaisieCahierDeTextes_1.ObjetRequetePageSaisieCahierDeTextes(
			this,
			this.actionSurRecupererCahierDeTextes.bind(this, this.Cours),
		).lancerRequete(lParam);
		this.setEtatIdCourant(true);
		this.setFocusIdCourant();
	}
	valider() {
		if (this.Actif) {
			this.avecRequeteGenerale =
				this.listeCategories.existeElementPourValidation() ||
				this.ListeModeles.existeElementPourValidation();
			const lInstance = this.getInstance(this.IdentEditionPieceJointe);
			new ObjetRequeteSaisieCahierDeTextes_1.ObjetRequeteSaisieCahierDeTextes(
				this,
				this.actionSurValidation,
			)
				.addUpload({
					listeFichiers: lInstance.ListeFichiers,
					listeDJCloud: this.ListeDocumentsJoints,
					callback: function () {
						lInstance.reset();
					},
				})
				.lancerRequete(
					this.Cours.Numero,
					this.NumeroSemaine,
					this.listeCategories,
					this.ListeDocumentsJoints,
					this.ListeModeles,
					this.ListeCahierDeTextes,
				);
		}
	}
	actionSurValidation() {
		if (this._callbackNavigation) {
			this._callbackNavigation();
			delete this._callbackNavigation;
			if (!this.isDestroyed()) {
				this.reset(true);
				this.afficherPage();
			}
		} else {
			this.setEtatSaisie(false);
			this.reset(true);
			this.afficherPage();
		}
	}
	evenementSurContenu(
		aGenreEvenement,
		aElement,
		aGenreDocJoint,
		aDonneesSupplementaires,
	) {
		this.genreElementSelectionne =
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
		this.contenuCourant = aElement;
		if (
			this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 1 &&
			!!this.contenuCourant &&
			!this.CahierDeTextes.listeContenus.getIndiceParElement(
				this.contenuCourant,
			) &&
			this.CahierDeTextes.listeContenus.get(0).getEtat() ===
				Enumere_Etat_1.EGenreEtat.Creation
		) {
			const lContenu = this.contenuCourant;
			this.contenuCourant = this.CahierDeTextes.listeContenus.get(0);
			this.contenuCourant.Libelle = lContenu.getLibelle();
			this.contenuCourant.descriptif = lContenu.descriptif;
			this.contenuCourant.estVide = lContenu.estVide;
		}
		this.indiceElementSelectionne =
			this.CahierDeTextes.listeContenus.getIndiceParElement(
				this.contenuCourant,
			) !== null
				? this.CahierDeTextes.listeContenus.getIndiceParElement(
						this.contenuCourant,
					)
				: this.CahierDeTextes.listeContenus.count() - 1;
		switch (aGenreEvenement) {
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.fenetreEditeurHTML:
				this.evenementSurBoutonHTML(this.contenuCourant.descriptif, null, {
					filePickerOpener: this.evenementSurBoutonDocumentJoint.bind(
						this,
						Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
					),
					filePickerTypes: "image",
				});
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.fenetreCategorie:
				this.evenementSurBoutonCategorie();
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionTitre:
				this.setEtatSaisie(true);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionCategorie:
				this.setEtatSaisie(true);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionParcoursEducatif:
				this.setEtatSaisie(true);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.ajouterDocumentJoint: {
				let lListeFichiers;
				if (
					aGenreDocJoint === Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
				) {
					const lNouvelleUrl = aDonneesSupplementaires;
					lListeFichiers =
						new ObjetListeElements_1.ObjetListeElements().addElement(
							lNouvelleUrl,
						);
				} else {
					const lElementFichierUploade = aDonneesSupplementaires;
					lListeFichiers = lElementFichierUploade
						? lElementFichierUploade.listeFichiers
						: null;
				}
				this._ajouterListeFichiers(lListeFichiers, aGenreDocJoint);
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDocumentJoint: {
				const lTypeServiceCloud = aDonneesSupplementaires;
				this.evenementSurBoutonDocumentJoint(aGenreDocJoint, lTypeServiceCloud);
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionDescriptif:
				this.setEtatSaisie(true);
				if (this.indiceElementSelectionne >= 0) {
					this.getInstanceContenu().actualiserContenu(
						this.CahierDeTextes.listeContenus.get(
							this.indiceElementSelectionne,
						),
						this.CahierDeTextes.verrouille,
						this.avecDocumentJoint,
						this.ContenuPleinEcran,
						this._getOptionsContenuMenuMagique(),
					);
				}
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.supprimer:
				this.supprimerContenuCourant();
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.ajoutQCM:
				if (!this.contenuCourant) {
					return;
				}
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirQCM({
					instance: this,
					donneesSupplementaire: { contexteAppel: "contenu" },
					element: this.contenuCourant,
					pourTAF: false,
				}).then((aParams) => {
					if (aParams.valider) {
						this.setEtatSaisie(true);
						this.getInstanceContenu().actualiserContenu(
							this.contenuCourant,
							this.CahierDeTextes.verrouille,
							this.avecDocumentJoint,
							this.ContenuPleinEcran,
							this._getOptionsContenuMenuMagique(),
						);
					}
				});
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.affecterProgressionAuCdT:
				this._affecterProgressionAuCdT(false);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.poursuivreCoursPrecedent: {
				const lNewContenu =
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.getCopieContenuCoursPrecedent(
						this.listeCDTsPrecedents,
					);
				if (lNewContenu) {
					const lIndice = this.CahierDeTextes.listeContenus.count() - 1;
					const lElementVide = this.CahierDeTextes.listeContenus.get(lIndice);
					if (lElementVide && lElementVide.existe() && lElementVide.estVide) {
						this.CahierDeTextes.listeContenus.remove(lIndice);
					}
					this.CahierDeTextes.listeContenus.addElement(lNewContenu);
					this.genreElementSelectionne =
						Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
					this.contenuCourant = this.CahierDeTextes.listeContenus.get(
						this.CahierDeTextes.listeContenus.count() - 1,
					);
					this.indiceElementSelectionne =
						this.CahierDeTextes.listeContenus.getIndiceParElement(
							this.contenuCourant,
						) !== null
							? this.CahierDeTextes.listeContenus.getIndiceParElement(
									this.contenuCourant,
								)
							: this.CahierDeTextes.listeContenus.count() - 1;
					this._actualiserContenu(true);
					this.setEtatSaisie(true);
				}
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.poursuivreProgression:
				UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.poursuivreProgression({
					instance: this,
					cdt: this.CahierDeTextes,
					listeCDTsPrecedents: this.listeCDTsPrecedents,
					dateTAF: new Date(
						(this.dateCoursSuivantTAF || this.DateTravailAFaire).getTime(),
					),
					listeCategories: this.listeCategories,
					callbackAffectation: this._callbackAffectationProgression.bind(this),
				});
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.saisieDS:
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.saisieEval:
				this._commandeCreerDevoirOuEval(
					this.contenuCourant,
					aGenreEvenement ===
						EGenreEvenementContenuCahierDeTextes_1
							.EGenreEvenementContenuCahierDeTextes.saisieDS
						? Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
						: Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation,
				);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.suppressionDocument:
				this.setEtatSaisie(true);
				aElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.verifierEtatContenu();
				this.getInstanceContenu().actualiserContenu(
					this.CahierDeTextes.listeContenus.get(this.indiceElementSelectionne),
					this.CahierDeTextes.verrouille,
					this.avecDocumentJoint,
					this.ContenuPleinEcran,
					this._getOptionsContenuMenuMagique(),
				);
				break;
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.ajouterLienKiosque: {
				const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
					{
						pere: this,
						evenement: this._evenementSurFenetreRessourceKiosqueLiens,
					},
				);
				lFenetre.setOptions({ avecMultiSelection: true });
				lFenetre.afficherFenetre();
				break;
			}
			case EGenreEvenementContenuCahierDeTextes_1
				.EGenreEvenementContenuCahierDeTextes.editionTheme:
				this.setEtatSaisie(true);
				break;
		}
		this.verifierEtatContenu();
	}
	supprimerContenuCourant() {
		if (
			!this.CahierDeTextes.verrouille &&
			!(
				this.CahierDeTextes.listeContenus.aUnElementVide() &&
				this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 1
			)
		) {
			if (this.contenuCourant) {
				this.applicationSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.msgConfirmationSupprimerContenu",
						),
						callback: this.evenementSurSupprimerContenu.bind(this),
					});
			}
		}
	}
	evenementSurSupprimerContenu(aAccepte) {
		if (
			this.contenuCourant &&
			aAccepte === Enumere_Action_1.EGenreAction.Valider
		) {
			this.contenuCourant.Libelle = "";
			this.contenuCourant.descriptif = "";
			this.contenuCourant.categorie = new ObjetElement_1.ObjetElement("", 0);
			this.contenuCourant.categorie.setEtat(
				Enumere_Etat_1.EGenreEtat.Modification,
			);
			this.contenuCourant.estVide = true;
			for (let i = 0; i < this.contenuCourant.ListePieceJointe.count(); i++) {
				this.contenuCourant.ListePieceJointe.get(i).setEtat(
					Enumere_Etat_1.EGenreEtat.Suppression,
				);
			}
			this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			this.setEtatSaisie(true);
			if (this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 0) {
				this.CahierDeTextes.listeContenus.addElement(this._initContenu());
			}
			this.genreElementSelectionne =
				Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
			this.contenuCourant = this.CahierDeTextes.listeContenus.get(
				this.CahierDeTextes.listeContenus.count() - 1,
			);
			this.indiceElementSelectionne =
				this.CahierDeTextes.listeContenus.getIndiceParElement(
					this.contenuCourant,
				) !== null
					? this.CahierDeTextes.listeContenus.getIndiceParElement(
							this.contenuCourant,
						)
					: this.CahierDeTextes.listeContenus.count() - 1;
			this._actualiserContenu(true);
		}
	}
	evenementTAFDesCours(aGenreEvenement, aElement, aDonneesSupplementaires) {
		this.genreElementSelectionne =
			Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire;
		this.tafCourant = aElement;
		this.indiceElementSelectionne = -1;
		const lThis = this;
		switch (aGenreEvenement) {
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.fenetreEditeurHTML:
				this.evenementSurBoutonHTML(this.tafCourant.descriptif);
				break;
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.ajouterDocumentJoint: {
				const lDonnees = aDonneesSupplementaires;
				const lEstUneUrl =
					lDonnees.getGenre &&
					lDonnees.getGenre() ===
						Enumere_DocumentJoint_1.EGenreDocumentJoint.Url;
				let lListeFichiers;
				let lGenreDocument;
				if (lEstUneUrl) {
					const lNouvelleUrl = lDonnees;
					lListeFichiers =
						new ObjetListeElements_1.ObjetListeElements().addElement(
							lNouvelleUrl,
						);
					lGenreDocument = Enumere_DocumentJoint_1.EGenreDocumentJoint.Url;
				} else {
					const lElementFichierUploade = lDonnees;
					lListeFichiers = lElementFichierUploade
						? lElementFichierUploade.listeFichiers
						: null;
					lGenreDocument = Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier;
				}
				this._ajouterListeFichiers(lListeFichiers, lGenreDocument);
				break;
			}
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.editionDocumentJoint: {
				const lGenreFichier = aDonneesSupplementaires;
				this.evenementSurBoutonDocumentJoint(lGenreFichier);
				break;
			}
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.ajouterDocumentDepuisCloud: {
				let lParams = {
					callbaskEvenement: (aLigne) => {
						if (aLigne >= 0) {
							const lService = this.etatUtilisateur.listeCloud.get(aLigne);
							lThis.evenementSurBoutonDocumentJoint(
								Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
								lService,
							);
						}
					},
					modeGestion:
						UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF
							.modeGestion.Cloud,
				};
				UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
					lParams,
				);
				break;
			}
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.ouvrirCloudENEJ: {
				const lService = this.etatUtilisateur.getCloudENEJ();
				lThis.evenementSurBoutonDocumentJoint(
					Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud,
					lService,
				);
				break;
			}
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.ajouterLienKiosque: {
				const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
					{
						pere: this,
						evenement: this._evenementSurFenetreRessourceKiosqueLiens,
					},
				);
				lFenetre.setOptions({ avecMultiSelection: true });
				lFenetre.afficherFenetre();
				break;
			}
			case InterfaceListeTAFsCDT_1.EGenreEvenementTAFCahierDeTextes
				.clicBoutonZoom:
				this.evenementSurBoutonPleinEcranTAF();
				break;
			default:
				break;
		}
	}
	surFermetureMessage() {
		this.setFocusIdCourant();
	}
	getListeDocumentsJointsSelonContexte(aGenreElementSelectionne) {
		return aGenreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
			? this.contenuCourant.ListePieceJointe
			: this.tafCourant.ListePieceJointe;
	}
	evenementSurBoutonDocumentJoint(AGenre, aInfoSelection) {
		const lListeDocumentsJointsActive =
			this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
		const lGenreFentrePJ =
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu
				? EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.CahierDeTextes
				: EGenreFenetreDocumentJoint_1.EGenreFenetreDocumentJoint.TravailAFaire;
		if (AGenre !== Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud) {
			this.getInstance(this.IdentEditionPieceJointe).afficherFenetrePJ({
				listePJTot: this.ListeDocumentsJoints,
				listePJContexte: lListeDocumentsJointsActive,
				genreFenetrePJ: lGenreFentrePJ,
				genrePJ: aInfoSelection
					? aInfoSelection.meta.filetype === "image"
						? Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
						: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url
					: AGenre,
				genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
				avecFiltre: { date: true, classeMatiere: true },
				listePeriodes: this.ListePeriodes,
				dateCours: this.DateCoursDeb,
				contenuCourant: this.contenuCourant,
				tafCourant: this.tafCourant,
				avecThemes: this.applicationSco.parametresUtilisateur.get(
					"avecGestionDesThemes",
				),
				optionsSelecFile: {
					multiple: !aInfoSelection,
					maxSize: this.applicationSco.droits.get(
						ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
					),
				},
				modeLien: !!aInfoSelection,
				surValiderAvantFermer: !!aInfoSelection
					? () => {
							const lURL = this.getInstance(
								this.IdentEditionPieceJointe,
							).getLien();
							if (this.instanceFenetreHTML) {
								const lEditor = TinyInit_1.TinyInit.get(
									this.instanceFenetreHTML.idEditeurHTML,
								);
								if (lEditor) {
									lEditor.settings.filePickerReturn(lURL);
								}
							}
							const lEltPJDeListeTot = this.getInstance(
								this.IdentEditionPieceJointe,
							).getEltLien();
							this.ajouterDocAuContexte(lEltPJDeListeTot, true);
						}
					: null,
				validationAuto: !!aInfoSelection ? this.valider.bind(this) : null,
			});
		} else {
			this.getInstance(this.identFenetreFichiersCloud).setDonnees({
				service: aInfoSelection.Genre,
			});
		}
	}
	selectionnerCours(ACours, AGenreSelectionSemaine, aAvecEvenementSelection) {
		if (ACours) {
			this.etatUtilisateur.setNavigationCours(ACours);
			this.Cours = ACours;
			const LNumeroSemaine = this.Cours.NumeroSemaine;
			if (
				AGenreSelectionSemaine === EGenreSelectionSemaine.Forcer ||
				(AGenreSelectionSemaine === EGenreSelectionSemaine.Avec &&
					LNumeroSemaine !== this.NumeroSemaine)
			) {
				this.getInstance(this.IdentCalendrier).setSelection(LNumeroSemaine);
			} else if (
				!this.getInstance(this.IdentGrille)
					.getInstanceGrille()
					.selectionnerCours(this.Cours, aAvecEvenementSelection)
			) {
				this.setActif(false);
			}
		} else {
			this.setActif(false);
			this.setEtatIdCourant(true);
		}
	}
	evenementSurBoutonRechercheCours(aPrecedent) {
		GNavigateur.resetCodeTouche();
		this.setEtatSaisie(false);
		if (aPrecedent && this.CoursPrecedent) {
			this.setEtatIdCourant(false);
			this.selectionnerCours(this.CoursPrecedent, EGenreSelectionSemaine.Avec);
		}
		if (!aPrecedent && this.CoursSuivant) {
			this.setEtatIdCourant(false);
			this.selectionnerCours(this.CoursSuivant, EGenreSelectionSemaine.Avec);
		}
	}
	evenementSurCalendrier(
		ANumeroSemaine,
		ABidon,
		AGenreDomaineInformation,
		aEstDansPeriodeConsultation,
		AIsToucheSelection,
	) {
		if (AIsToucheSelection) {
			this.setIdCourant(
				this.getInstance(this.IdentGrille).getInstanceGrille().IdPremierElement,
			);
			this.setFocusIdCourant();
		} else {
			this.setIdCourant(
				this.getInstance(this.IdentCalendrier).IdPremierElement,
			);
			this.setEtatIdCourant(false);
			this.etatUtilisateur.setSemaineSelectionnee(
				(this.NumeroSemaine = ANumeroSemaine),
			);
			if (
				AGenreDomaineInformation ===
				Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee
			) {
				this.setActif(false);
				ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Page", false);
				ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Page_Message", true);
				this.setEtatIdCourant(true);
			} else {
				ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Page_Message", false);
				ObjetHtml_1.GHtml.setDisplay(this.Nom + "_Page", true);
				new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
					this,
					this.actionSurCalendrier,
				).lancerRequete({ numeroSemaine: this.NumeroSemaine });
			}
		}
	}
	ajouterDocAuContexte(aEltDocDeListeTot, aDepuisModeLien) {
		if (aEltDocDeListeTot === null || aEltDocDeListeTot === undefined) {
			return;
		}
		const lListeDocJointsSelonContexte =
			this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
		let lDocumentTrouve = lListeDocJointsSelonContexte.getElementParNumero(
			aEltDocDeListeTot.getNumero(),
		);
		if (lDocumentTrouve) {
			return;
		}
		let lActif = aDepuisModeLien ? true : aEltDocDeListeTot.getActif();
		let lDocumentJoint = new ObjetElement_1.ObjetElement(
			aEltDocDeListeTot.getLibelle(),
			aEltDocDeListeTot.getNumero(),
			aEltDocDeListeTot.getGenre(),
			aEltDocDeListeTot.getPosition(),
			lActif,
		);
		lDocumentJoint.url = aEltDocDeListeTot.url;
		lDocumentJoint.estUnLienInterne = aDepuisModeLien;
		lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		const lGenreDocJointEstDeContenu =
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
		if (lGenreDocJointEstDeContenu) {
			if (
				this.contenuCourant.Numero === null ||
				this.contenuCourant.Numero === undefined
			) {
				this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else {
				this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		} else {
			if (
				this.tafCourant.Numero === null ||
				this.tafCourant.Numero === undefined
			) {
				this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else {
				this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		}
		lListeDocJointsSelonContexte.addElement(lDocumentJoint);
	}
	evenementEditionDocumentJoint() {
		let lMAJ = false;
		const lInstance = this.getInstance(this.IdentEditionPieceJointe);
		if (lInstance.parametres.modeLien) {
			return;
		}
		const lListeDocJointsSelonContexte =
			this.getListeDocumentsJointsSelonContexte(this.genreElementSelectionne);
		const lGenreDocJointEstDeContenu =
			this.genreElementSelectionne ===
			Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
		for (let I = 0; I < this.ListeDocumentsJoints.count(); I++) {
			let lDocumentJoint = lListeDocJointsSelonContexte.getElementParNumero(
				this.ListeDocumentsJoints.getNumero(I),
			);
			const lActif =
				this.ListeDocumentsJoints.get(I).Actif &&
				this.ListeDocumentsJoints.existe(I);
			if (lDocumentJoint) {
				if (!lActif) {
					lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					if (lGenreDocJointEstDeContenu) {
						if (
							this.contenuCourant.Numero === null ||
							this.contenuCourant.Numero === undefined
						) {
							this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							this.contenuCourant.setEtat(
								Enumere_Etat_1.EGenreEtat.Modification,
							);
						}
					} else {
						if (
							this.tafCourant.Numero === null ||
							this.tafCourant.Numero === undefined
						) {
							this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							this.tafCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
					}
				}
			} else if (this.contenuCourant || this.tafCourant) {
				if (lActif) {
					this.ajouterDocAuContexte(this.ListeDocumentsJoints.get(I), false);
				}
			}
			if (!this.ListeDocumentsJoints.existe(I)) {
				for (let x = 0; x < this.CahierDeTextes.listeContenus.count(); x++) {
					const lTempPJ = this.CahierDeTextes.listeContenus
						.get(x)
						.ListePieceJointe.getElementParNumero(
							this.ListeDocumentsJoints.getNumero(I),
						);
					if (lTempPJ) {
						lTempPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						lMAJ = true;
					}
				}
				for (
					let x = 0;
					x < this.CahierDeTextes.ListeTravailAFaire.count();
					x++
				) {
					const lTempPJ = this.CahierDeTextes.ListeTravailAFaire.get(
						x,
					).ListePieceJointe.getElementParNumero(
						this.ListeDocumentsJoints.getNumero(I),
					);
					if (lTempPJ) {
						lTempPJ.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						lMAJ = true;
					}
				}
			}
		}
		lListeDocJointsSelonContexte.trier();
		if (lGenreDocJointEstDeContenu) {
			this.verifierEtatContenu();
			this.getInstanceContenu().actualiserContenu(
				this.CahierDeTextes.listeContenus.get(this.indiceElementSelectionne),
				this.CahierDeTextes.verrouille,
				this.avecDocumentJoint,
				this.ContenuPleinEcran,
				this._getOptionsContenuMenuMagique(),
			);
		} else {
			this.actualiserTAF();
		}
		if (lMAJ) {
			this.actualiser(true);
		}
	}
	actualiserTAF() {
		this.getInstance(this.identListeTAFs).actualiser();
	}
	getInstanceContenu() {
		const lContenu = this.CahierDeTextes.listeContenus.get(
			this.indiceElementSelectionne,
		);
		let lIndice =
			this.CahierDeTextes.listeContenus.getIndiceExisteParElement(lContenu);
		if (lIndice === null || lIndice === undefined) {
			lIndice = this.CahierDeTextes.listeContenus.getNbrElementsExistes() - 1;
		}
		return this.getInstance(this.identContenus[lIndice]);
	}
	evenementSurFenetreRattachementCDT(aGenreBouton, aCahierDeTextes) {
		let lListeCDTaSupprimer;
		switch (aGenreBouton) {
			case 1:
				if (this.fenetreCDT) {
					this.fenetreCDT.fermer();
				}
				lListeCDTaSupprimer = this.listeCDT.getListeElements((aElement) => {
					return !aElement.existe();
				});
				new ObjetRequeteSaisieRattachementCDT_1.ObjetRequeteSaisieRattachementCDT(
					this,
					this._actionSurRequeteSaisieRattachementCDT,
				).lancerRequete({
					cahierDeTextes: aCahierDeTextes,
					cours: this.Cours,
					numeroSemaine: this.NumeroSemaine,
					listeCDT:
						lListeCDTaSupprimer.count() > 0 ? lListeCDTaSupprimer : null,
				});
				break;
			case 2:
				this.paramFicheCDT = { pourCDT: true, cahierDeTextes: aCahierDeTextes };
				new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
					this,
					this._actionSurRequeteFicheCDT.bind(this),
				).lancerRequete(this.paramFicheCDT);
				break;
			default:
				lListeCDTaSupprimer = this.listeCDT.getListeElements((aElement) => {
					return !aElement.existe();
				});
				if (lListeCDTaSupprimer.count() > 0) {
					new ObjetRequeteSaisieRattachementCDT_1.ObjetRequeteSaisieRattachementCDT(
						this,
						this._actionSurRequeteSaisieRattachementCDT,
					).lancerRequete({
						numeroSemaine: this.NumeroSemaine,
						listeCDT: lListeCDTaSupprimer,
					});
				}
				break;
		}
		this._verifierListeCDTAAffecter(this.listeCDT);
	}
	_actionSurRequeteSaisieRattachementCDT() {
		this.recupererDonnees(false);
	}
	_actionSurRequeteFicheCDT(aGenreAffichageEDT, aCahierDeTextes) {
		UtilitaireCDT_1.TUtilitaireCDT.afficheFenetreDetail(
			this,
			{
				cahiersDeTextes: aCahierDeTextes,
				genreAffichage: aGenreAffichageEDT,
				gestionnaire: GestionnaireBlocCDT_1.GestionnaireBlocCDT,
			},
			{ evenementSurBlocCDT: this.evenementSurBlocCDT },
		);
	}
	evenementSurBlocCDT(aObjet, aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.executionQCM:
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.voirQCM:
				this.surExecutionQCMContenu(aParam.event, aElement);
				break;
			case GestionnaireBlocCDT_1.EGenreBtnActionBlocCDT.detailTAF:
				ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
					{ pere: this, evenement: this._evenementFenetreTAFARendre },
					aElement,
				);
				break;
			default:
				break;
		}
	}
	_evenementFenetreTAFARendre(aGenreBouton) {
		if (
			aGenreBouton ===
			ObjetFenetre_ListeTAFFaits_1.TypeBoutonFenetreTAFFaits.Fermer
		) {
			new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
				this,
				this._actionSurRequeteFicheCDT.bind(this),
			).lancerRequete(this.paramFicheCDT);
		}
	}
	initFenetreURLKiosque(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.kiosque.fenetre.titre",
			),
			largeur: 600,
			hauteur: 150,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.kiosque.fenetre.boutonAnnuler",
				),
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.kiosque.fenetre.boutonEnregistrer",
				),
			],
			listeBoutonsInvisibles: [false, true],
		});
	}
	evntSurFenetreURLKiosque(aNumeroBouton, aListeRessourcesEdit) {
		if (aNumeroBouton !== 1) {
		} else {
			aListeRessourcesEdit.setSerialisateurJSON({
				ignorerEtatsElements: true,
				methodeSerialisation: this._serialisationDonnees.bind(this),
			});
			new ObjetRequeteSaisiePreferencesRessourcesKiosque(this)
				.lancerRequete({
					listeRessources: aListeRessourcesEdit,
					cours: this.Cours,
					numeroSemaine: this.NumeroSemaine,
				})
				.then((aReponse) => {
					this.listeRessources = aReponse.JSONReponse.listeRessources;
					this.setDonneesKiosque();
				});
		}
	}
	_estPublieAuto() {
		return (
			new Date() >
			(this.applicationSco.parametresUtilisateurBase.optionPublicationCDT ===
			TypeOptionPublicationCDT_1.TypeOptionPublicationCDT
				.OPT_PublicationDebutCours
				? this.DateCoursDeb
				: this.DateCoursFin)
		);
	}
	evenementSurGrille(aParam) {
		const lParam = {
			genre: null,
			id: "",
			cours: null,
			date: null,
			genreImage: 0,
		};
		$.extend(lParam, aParam);
		switch (lParam.genre) {
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurImage: {
				if (aParam.genreImage === 2) {
					this.paramFicheCDT = {
						pourTAF: true,
						cours: lParam.cours,
						numeroSemaine: this.NumeroSemaine,
					};
					new ObjetRequeteFicheCDT_1.ObjetRequeteFicheCDT(
						this,
						this._actionSurRequeteFicheCDT.bind(this),
					).lancerRequete(this.paramFicheCDT);
				}
				break;
			}
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel:
			case Enumere_EvenementEDT_1.EGenreEvenementEDT.SurCours:
				this.etatUtilisateur.setNavigationCours(lParam.cours);
				if (
					lParam.genre ===
						Enumere_EvenementEDT_1.EGenreEvenementEDT.SurMenuContextuel &&
					this.Cours &&
					this.Cours.getNumero() === lParam.cours.getNumero()
				) {
					this.moduleSaisieCours
						.remplirCoursInfoModifierMatiereCoursPromise(lParam.cours)
						.then(() => {
							const lMenuContextuel =
								ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
									pere: this,
									evenement: this._evenementSurMenuContextuel,
									initCommandes: this._initialiserMenuContextuel.bind(
										this,
										lParam.cours,
									),
									id: lParam.id,
								});
							this.setIdCourant(lMenuContextuel.IdPremierElement);
							this.setFocusIdCourant();
						});
				}
				this.idCours = lParam.id;
				this.Cours = lParam.cours;
				this.actionSurCours(!GNavigateur.CtrlTouche && !GNavigateur.AltTouche);
				break;
		}
	}
	actionSurCours(ASurActionClavier) {
		this.setEtatSaisie(false);
		if (this.fenetreCDT) {
			this.fenetreCDT.fermer(ASurActionClavier);
		}
		if (!this.Cours.utilisable) {
			this.setActif(
				false,
				ObjetChaine_1.GChaine.replaceRCToHTML(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.CoursNonUtilisableDansPNParCDT",
					),
				),
			);
			return;
		} else {
			this.recupererCahierDeTextes();
		}
	}
	evenementSurAjoutContenu() {
		if (
			!this.CahierDeTextes.listeContenus.aUnElementVide() &&
			!this.CahierDeTextes.verrouille
		) {
			this.CahierDeTextes.listeContenus.addElement(this._initContenu());
			this.genreElementSelectionne =
				Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
			this.contenuCourant = this.CahierDeTextes.listeContenus.get(
				this.CahierDeTextes.listeContenus.count() - 1,
			);
			this.indiceElementSelectionne =
				this.CahierDeTextes.listeContenus.getIndiceParElement(
					this.contenuCourant,
				) !== null
					? this.CahierDeTextes.listeContenus.getIndiceParElement(
							this.contenuCourant,
						)
					: this.CahierDeTextes.listeContenus.count() - 1;
			this._actualiserContenu(true);
		}
	}
	evenementSurDatePublication(aDate) {
		this.CahierDeTextes.datePublication = aDate;
		this.setEtatSaisie(true);
	}
	actionSurRattachementCDT(aListeCDT) {
		this.listeCDT = aListeCDT;
		this._verifierListeCDTAAffecter(this.listeCDT);
		this.getInstance(this.identFenetreRattachementCDT).setBoutonLibelle(
			0,
			this.avecDrag
				? ObjetTraduction_1.GTraductions.getValeur("principal.fermer")
				: ObjetTraduction_1.GTraductions.getValeur("principal.annuler"),
		);
		this.getInstance(this.identFenetreRattachementCDT).setDonnees(
			aListeCDT,
			this.avecDrag,
			{
				callbackDragStart: this._bloquerInterfaceTiny.bind(this, true),
				callbackDragStop: this._bloquerInterfaceTiny.bind(this, false),
			},
		);
	}
	_verifierListeCDTAAffecter(aListeCDT) {
		if (aListeCDT.getNbrElementsExistes() === 0) {
			this.etatUtilisateur.existeCDTsDetaches = false;
		}
	}
	surExecutionQCMContenu(aEvent, aExecutionQCM) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.identFenetreVisuQCM),
			aExecutionQCM,
			true,
		);
	}
	evenementSurVisuEleve() {}
	evenementSurBoutonPleinEcranTAF() {
		this.TAFPleinEcran = !this.TAFPleinEcran;
		this.getInstance(this.identListeTAFs).setInterfaceEnPleinEcran(
			this.TAFPleinEcran,
		);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ZoneGrille", !this.TAFPleinEcran);
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_ZoneContenu",
			!this.TAFPleinEcran,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_ZoneElementsProgramme",
			!this.TAFPleinEcran && this.avecElementsProgramme,
		);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_listePrec", !this.TAFPleinEcran);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_P5", !this.TAFPleinEcran);
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			!this.TAFPleinEcran,
		);
		this.$refreshSelf();
		if (this.TAFPleinEcran) {
			this.actualiser(false);
		} else {
			this._restaurationEDTEnAttente();
			this.actualiser(false);
		}
		GNavigateur.surResize();
		this.surResizeInterface();
	}
	evenementSurBoutonPleinEcranContenu() {
		this.ContenuPleinEcran = !this.ContenuPleinEcran;
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_ZoneGrille",
			!this.ContenuPleinEcran,
		);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_P4", !this.ContenuPleinEcran);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_P5", !this.ContenuPleinEcran);
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_listePrec",
			!this.ContenuPleinEcran,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_ZoneElementsProgramme",
			!this.ContenuPleinEcran && this.avecElementsProgramme,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			!this.ContenuPleinEcran,
		);
		this.$refreshSelf();
		if (this.ContenuPleinEcran) {
			this.actualiser(false);
		} else {
			this._restaurationEDTEnAttente();
			this.actualiser(false);
		}
		GNavigateur.surResize();
		this.surResizeInterface();
	}
	_actualiserVisa() {
		ObjetHtml_1.GHtml.setHtml(
			this.idContenu,
			this.getLibelleContenus(this.Cours),
		);
	}
	_actualiserVisibilitePublication() {
		const lVisible = this.CahierDeTextes.existeNumero();
		ObjetStyle_1.GStyle.setVisible(this.idPublieContenu, lVisible);
		this.$refreshSelf();
	}
	_changementEtatSaisie(AEtat) {
		if (AEtat) {
			if (
				this.CahierDeTextes.Numero === null ||
				this.CahierDeTextes.Numero === undefined
			) {
				this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			} else {
				this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		} else {
			this.indiceElementSelectionne = -1;
			this.genreElementSelectionne = null;
			this.tafCourant = null;
			this.contenuCourant = null;
		}
	}
	setEtatSaisie(AEtat) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.etatSaisie,
			AEtat,
		);
		if (AEtat) {
			this._actualiserVisibilitePublication();
		}
	}
	actionSurCalendrier(aParam) {
		this.etatUtilisateur.existeCDTsDetaches = aParam.existeCDTsDetaches;
		this.setEtatSaisie(false);
		this.utilLienBtns.actualiser(false);
		if (aParam.message !== null && aParam.message !== undefined) {
			this.evenementAfficherMessage(aParam.message);
			this.setEtatIdCourant(true);
		} else {
			for (let I = 0; I < aParam.listeCours.count(); I++) {
				const lElementCours = aParam.listeCours.get(I);
				for (let J = 0; J < lElementCours.ListeContenus.count(); J++) {
					const lElementContenu = lElementCours.ListeContenus.get(J);
					const lGenre = lElementContenu.getGenre();
					if (
						lGenre === Enumere_Ressource_1.EGenreRessource.Matiere ||
						lGenre === Enumere_Ressource_1.EGenreRessource.Classe ||
						lGenre === Enumere_Ressource_1.EGenreRessource.Groupe ||
						lGenre === Enumere_Ressource_1.EGenreRessource.PartieDeClasse
					) {
						lElementContenu.Visible =
							lGenre !== Enumere_Ressource_1.EGenreRessource.Matiere;
					} else {
						lElementContenu.Visible = false;
					}
				}
			}
			this.listeCours = aParam.listeCours;
			if (!this.TAFPleinEcran) {
				this.getInstance(this.IdentGrille).setDonnees({
					numeroSemaine: this.etatUtilisateur.getSemaineSelectionnee(),
					listeCours: this.listeCours,
					avecCoursAnnule: this.etatUtilisateur.getAvecCoursAnnule(),
				});
			} else {
				this.actualisationEDTAttente = true;
			}
			if (this.etatUtilisateur._coursASelectionner) {
				if (this.listeCours) {
					this.Cours = this.listeCours.getElementParElement(
						this.etatUtilisateur._coursASelectionner,
					);
				}
				delete this.etatUtilisateur._coursASelectionner;
			}
			this.selectionnerCours(this.Cours, EGenreSelectionSemaine.Sans);
		}
	}
	actionSurRecupererDonnees(aParam) {
		this.avecDocumentJoint = [];
		this.avecDocumentJoint[
			Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier
		] = aParam.PublierDocuments;
		this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Url] =
			aParam.PublierUrl;
		this.avecDocumentJoint[Enumere_DocumentJoint_1.EGenreDocumentJoint.Cloud] =
			aParam.PublierCloud;
		this.avecDocumentJoint[
			Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque
		] = aParam.PublierKiosque;
		this.avecRessourcesGranulaire =
			this.etatUtilisateur.avecRessourcesGranulaire;
		this.getInstance(this.identListeTAFs).setAffichageBoutonChargeTravail(
			!!aParam.voirChargeTAF,
		);
		this.actionSurRecupererCategories(aParam.ListeCategories);
		this.ListePeriodes = aParam.ListePeriodes;
		this.ListeModeles = aParam.ListeModeles;
		this.ListeModeles.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		this.ListeModeles.trier();
		if (aParam.Domaine) {
			this.etatUtilisateur.setDomainePresence(
				this.etatUtilisateur.getMembre(),
				aParam.Domaine,
			);
		}
		this.getInstance(this.IdentCalendrier).setDomaineInformation(
			IE.Cycles.getDomaineFerie(),
			Enumere_DomaineInformation_1.EGenreDomaineInformation.Feriee,
		);
		this.getInstance(this.IdentCalendrier).setDomaineInformation(
			this.etatUtilisateur.getDomainePresence(this.etatUtilisateur.getMembre()),
			Enumere_DomaineInformation_1.EGenreDomaineInformation.AvecContenu,
		);
		this.getInstance(this.IdentCalendrier).setPeriodeDeConsultation(
			this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.cours.domaineConsultationEDT,
			),
		);
		this.getInstance(this.IdentCalendrier).setSelection(
			this.etatUtilisateur.getSemaineSelectionnee(),
		);
		this.surResizeInterface();
	}
	actionSurRecupererCategories(aListeCategories) {
		this.listeCategories = aListeCategories;
		const LElement = new ObjetElement_1.ObjetElement("", 0);
		this.listeCategories.addElement(LElement);
		this.listeCategories.trier();
	}
	actionSurRecupererCahierDeTextes(aCours, aParam) {
		this.setActif(true);
		this.listeRessources = aParam.listeRessources;
		this.getInstance(this.identListeTAFs).setDonneesChargeTravail(
			aCours,
			aParam.listeClasses,
		);
		this.DateCoursDeb = aParam.DateCoursDeb;
		this.DateCoursFin = aParam.DateCoursFin;
		this.DateTravailAFaire = aParam.DateTravailAFaire;
		this.avecQCMDevoir = aParam.avecQCMDevoir;
		this.servicesDevoir =
			aParam.servicesDevoir || new ObjetListeElements_1.ObjetListeElements();
		this.avecQCMEvaluation = aParam.avecQCMEvaluation;
		this.servicesEvaluation =
			aParam.servicesEvaluation ||
			new ObjetListeElements_1.ObjetListeElements();
		this.listeClassesEleves = aParam.listeClassesEleves;
		this.nombresDEleves = aParam.nombresDEleves;
		this.CoursPrecedent = aParam.CoursPrecedent;
		this.CoursSuivant = aParam.CoursSuivant;
		this.dateCoursSuivantTAF = aParam.dateCoursSuivantTAF;
		if (aParam.JoursPresenceCours) {
			this.JoursPresenceCours = aParam.JoursPresenceCours;
		} else {
			this.JoursPresenceCours =
				this._cacheJoursPresenceCours[aCours.getNumero()];
		}
		this.listeCDTsPrecedents = aParam.listeCDTsPrecedents;
		if (this.listeCDTsPrecedents) {
			if (this.listeCDTsPrecedents.count() > 0) {
				this.paramsListeCDTPrec.nbAffiches = Math.min(
					this.paramsListeCDTPrec.nbAffiches,
					this.listeCDTsPrecedents.count(),
				);
			}
		}
		this.utilLienBtns.actualiser(true, this.CoursPrecedent, this.CoursSuivant);
		this.ListeDocumentsJoints = aParam.ListeDocumentsJoints;
		this.setDonneesContenus(this.Cours);
		this.setDonneesKiosque();
		const lCahierDeTextes = aParam.CahierDeTextes;
		if (!lCahierDeTextes.listeContenus) {
			lCahierDeTextes.listeContenus =
				new ObjetListeElements_1.ObjetListeElements();
		}
		if (lCahierDeTextes.listeContenus.count() === 0) {
			lCahierDeTextes.listeContenus.addElement(this._initContenu());
		}
		this.setDonneesCahierDeTextes(lCahierDeTextes);
		this.ajoutNouveauTAFInterdit = aParam.ajoutNouveauTAFInterdit;
		this.messageSurNouveauTAF = aParam.messageSurNouveauTAF;
		this.setDonneesBandeauDroite(this.Cours, lCahierDeTextes);
		this.avecElementsProgramme = aParam.avecElementsProgramme;
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_ZoneElementsProgramme",
			!this.TAFPleinEcran &&
				!this.ContenuPleinEcran &&
				this.avecElementsProgramme,
		);
		const lInstance = this.getInstance(this.IdentEditionPieceJointe);
		if (lInstance && lInstance.EnAffichage) {
			if (lInstance.parametres.contenuCourant) {
				this.evenementSurContenu(null, lInstance.parametres.contenuCourant);
			}
			if (lInstance.parametres.tafCourant) {
				this.evenementTAFDesCours(null, lInstance.parametres.tafCourant);
			}
			lInstance.actualiserDonneesListe({
				listePiecesJointes: this.ListeDocumentsJoints,
			});
			this.actualiser(false);
		} else {
			this.actualiser(true);
		}
		if (this._ouvertureAutoFenetreDS) {
			this._ouvertureAutoFenetreDS();
		}
	}
	afficherPage() {
		this.recupererDonnees(this.avecRequeteGenerale);
	}
	reset(AAvecResetCahierDeTextes) {
		if (AAvecResetCahierDeTextes) {
			this.CoursPrecedent = null;
			this.CoursSuivant = null;
			this.ListeCahierDeTextes = new ObjetListeElements_1.ObjetListeElements();
			this.listeRessources = new ObjetListeElements_1.ObjetListeElements();
		}
		this.setDonneesBandeauDroite(null);
		this.setDonneesContenus(null);
		this.setDonneesKiosque();
		this.setDonneesCahierDeTextes(this._initCahierDeTextes());
	}
	_initCahierDeTextes() {
		return UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.initCahierDeTextes();
	}
	_initContenu() {
		return UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.createContenu();
	}
	getLibelleCours(aCours, aCahierDeTexte) {
		if (!aCours) {
			return "";
		}
		const lLibellePublics = this.getLibellePublicsDeCours(aCours);
		const lMatiere = aCours.ListeContenus.getElementParNumeroEtGenre(
			null,
			Enumere_Ressource_1.EGenreRessource.Matiere,
		);
		let lChaine =
			ObjetDate_1.GDate.formatDate(aCours.DateDuCours, "%JJJJ %JJ %MMM %AAAA") +
			(lLibellePublics ? " - " + lLibellePublics : "") +
			(lMatiere ? " - " + lMatiere.getLibelle() : "");
		if (aCahierDeTexte && aCahierDeTexte.verrouille) {
			lChaine +=
				" (" +
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.CDTViseEtVerrouille",
				) +
				")";
		}
		return ObjetChaine_1.GChaine.insecable(lChaine);
	}
	getLibelleContenus(aCours) {
		if (!aCours) {
			return ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.contenus");
		}
		const lChaine = ObjetChaine_1.GChaine.format(
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.contenusDu"),
			[
				ObjetDate_1.GDate.formatDate(
					aCours.DateDuCours,
					"%JJJJ %JJ %MMM %AAAA",
				),
			],
		);
		return ObjetChaine_1.GChaine.insecable(lChaine);
	}
	getLibellePublicsDeCours(aCours) {
		const lPublics = [];
		if (aCours && aCours.ListeContenus) {
			aCours.ListeContenus.parcourir((aElement) => {
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
				) {
					lPublics.push(aElement.getLibelle());
				}
			});
			aCours.ListeContenus.parcourir((aElement) => {
				if (
					aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.Classe
				) {
					lPublics.push(aElement.getLibelle());
				}
			});
			aCours.ListeContenus.parcourir((aElement) => {
				if (
					aElement.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.PartieDeClasse
				) {
					lPublics.push(aElement.getLibelle());
				}
			});
		}
		return lPublics.join(", ");
	}
	setDonneesBandeauDroite(aCours, aCahierDeTexte) {
		const lTitreBandeau = [];
		lTitreBandeau.push(this.getLibelleCours(aCours, aCahierDeTexte));
		if (
			this.applicationSco.parametresUtilisateur.get(
				"CDT.Commentaire.ActiverSaisie",
			) &&
			this.CoursPrecedent &&
			!!this.CoursPrecedent.noteProchaineSeance &&
			this.CoursPrecedent.noteProchaineSeance !== ""
		) {
			lTitreBandeau.push(
				`<ie-btnicon ie-model="afficherNoteCoursPrecedent" class="icon_comment i-medium m-left-l"></ie-btnicon>`,
			);
		}
		ObjetHtml_1.GHtml.setHtml(this.idBandeauDroite, lTitreBandeau.join(""), {
			controleur: this.controleur,
		});
		this.updatePublication(aCours, aCahierDeTexte);
	}
	updatePublication(aCours, aCahierDeTexte) {
		if (aCours && aCours.DateDuCours) {
			const lInstanceDate = this.getInstance(this.IdentDatePublication);
			lInstanceDate.setParametresFenetre(
				this.objetParametres.PremierLundi,
				this.objetParametres.PremiereDate,
				aCours.DateDuCours,
				this.objetParametres.JoursOuvres,
				null,
				this.objetParametres.JoursFeries,
				null,
			);
			lInstanceDate.setDonnees(undefined);
			lInstanceDate.setActif(aCahierDeTexte.publie);
			if (aCahierDeTexte.datePublication) {
				lInstanceDate.setDonnees(aCahierDeTexte.datePublication);
			}
		}
	}
	setDonneesContenus(aCours) {
		ObjetHtml_1.GHtml.setHtml(this.idContenu, this.getLibelleContenus(aCours));
	}
	setDonneesKiosque() {
		const H = [];
		H.push('<div class="GrandEspaceGauche">');
		let lListeRessourcesDeCours;
		if (this.listeRessources) {
			lListeRessourcesDeCours = this.listeRessources.getListeElements(
				(aElement) => {
					return aElement.estRessourceDeCours;
				},
			);
		}
		if (lListeRessourcesDeCours && lListeRessourcesDeCours.count() === 1) {
			const lAvecBtnParametrage =
				this.listeRessources && this.listeRessources.count() > 0;
			const lIndice = this.listeRessources.getIndiceElementParFiltre(
				(aElement) => {
					return aElement.estRessourceDeCours;
				},
			);
			if (lAvecBtnParametrage) {
				H.push(
					'<div class="NoWrap"><div class="InlineBlock AlignementMilieuVertical">',
				);
			}
			H.push(
				ObjetFenetre_URLKiosque_1.ObjetFenetre_URLKiosque.composeLienRessource.call(
					this,
					this.listeRessources.get(lIndice),
					lIndice,
				),
			);
			if (lAvecBtnParametrage) {
				H.push("</div>");
				H.push(
					'<div class="InlineBlock AlignementMilieuVertical EspaceGauche"><ie-btnicon ie-model="btnParametrerRessourceKiosque" class="icon_cog" style="font-size:1.4rem;"></ie-btnicon></div>',
				);
				H.push("</div>");
			}
		} else if (this.listeRessources && this.listeRessources.count() > 0) {
			H.push(
				'<div class="LienAccueil" onclick="',
				this.Nom,
				"._surOuvertureURLKiosque (",
				lListeRessourcesDeCours && lListeRessourcesDeCours.count() === 0,
				')">',
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.xManuelsNumeriques",
					[lListeRessourcesDeCours.count()],
				),
				"</div>",
			);
		}
		H.push("</div>");
		ObjetHtml_1.GHtml.setHtml(this.idKiosque, H.join(""), {
			controleur: this.controleur,
		});
	}
	_surOuvertureURLKiosque(aAvecParametrage) {
		const lParam = { listeRessources: this.listeRessources };
		if (!!aAvecParametrage) {
			lParam.avecParametrage = aAvecParametrage;
		}
		if (this.getInstance(this.identFenetreURLKiosque)) {
			this.getInstance(this.identFenetreURLKiosque).setDonnees(lParam);
		}
	}
	setDonneesCahierDeTextes(aCahierDeTextes) {
		this.CahierDeTextes = aCahierDeTextes;
		this.CahierDeTextes.publie = !!this.CahierDeTextes.datePublication;
		this.ListeCahierDeTextes.addElement(this.CahierDeTextes, 0);
		this._actualiserVisa();
		this._actualiserVisibilitePublication();
	}
	setActif(AActif, aMessage) {
		const lIdMessage = this.Nom + "_ZoneDeSaisie_Message";
		if (!AActif) {
			const lMessage = aMessage
				? aMessage
				: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.SelectionnerUnCoursPourSaisirCDT",
					);
			$("#" + lIdMessage.escapeJQ() + " :first").html(lMessage);
		}
		ObjetHtml_1.GHtml.setDisplay(lIdMessage, !AActif);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_ZoneDeSaisie", AActif);
		if (this.Actif !== AActif) {
			this.reset(true);
			this.utilLienBtns.actualiser(
				AActif && !!this.Cours,
				this.CoursPrecedent,
				this.CoursSuivant,
			);
		}
		this.Actif = AActif;
		if (this.Actif) {
			ObjetHtml_1.GHtml.setDisplay(
				this.getInstance(this.identListeCDTPrec).getNom(),
				this.paramsListeCDTPrec.deploye,
			);
		}
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
	}
	actualiser(aReconstruire) {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		if (this.CahierDeTextes) {
			this._actualiserContenu(
				aReconstruire === null || aReconstruire === undefined
					? true
					: aReconstruire,
			);
			this._actualiserElementsProgramme();
			this._actualiserListeCDTsPrecedents();
			this.updatePublication(this.Cours, this.CahierDeTextes);
		}
		this.surResizeInterface();
		if (this.CahierDeTextes) {
			this._actualiserTAF(
				aReconstruire === null || aReconstruire === undefined
					? true
					: aReconstruire,
			);
		}
	}
	_actualiserContenu(aReconstruire) {
		let i = 0;
		let j = 0;
		let lIndice = -1;
		const lParamsAffichage = {
			avecRessourcesGranulaire: this.avecRessourcesGranulaire,
		};
		if (this.CahierDeTextes.listeContenus.getNbrElementsExistes() === 1) {
			const lHeightZoom =
				ObjetPosition_1.GPosition.getHeight(this.Nom) -
				200 -
				(this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")
					? 44
					: 0);
			const lHeightNormal =
				ObjetPosition_1.GPosition.getHeight(this.Nom) / 2 -
				200 -
				(this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")
					? 44
					: 0);
			$.extend(lParamsAffichage, {
				autoresize: false,
				height: [lHeightNormal.toString(), lHeightZoom.toString()],
				min_height: ["75", "250"],
				max_height: [lHeightNormal.toString(), lHeightZoom.toString()],
				position: [false, undefined],
			});
		} else {
			$.extend(lParamsAffichage, {
				autoresize: true,
				height: ["75", "250"],
				min_height: ["75", "250"],
				max_height: ["200", "400"],
				position: [false, false],
			});
		}
		if (aReconstruire) {
			if (this.identContenus && this.identContenus.length > 0) {
				for (i = this.identContenus.length; i > 0; i--) {
					this.getInstance(this.identContenus[i - 1]).free();
					this.Instances[this.identContenus[i - 1]] = null;
				}
			}
			this.identContenus = [];
			if (this.CahierDeTextes) {
				ObjetHtml_1.GHtml.setHtml(this.Nom + "_Contenus", "");
				let lHR = false;
				j = 0;
				for (i = 0; i < this.CahierDeTextes.listeContenus.count(); i++) {
					if (this.CahierDeTextes.listeContenus.get(i).existe()) {
						this.identContenus[j] = this.add(
							InterfaceContenuCahierDeTextes_1.InterfaceContenuCahierDeTextes,
							this.evenementSurContenu,
							null,
						);
						if (lHR) {
							ObjetHtml_1.GHtml.addHtml(this.Nom + "_Contenus", "<hr>");
						}
						ObjetHtml_1.GHtml.addHtml(
							this.Nom + "_Contenus",
							'<div id="' +
								this.getNomInstance(this.identContenus[j]) +
								'"></div>',
						);
						this.getInstance(this.identContenus[j]).cahierDeTexteVerrouille =
							this.CahierDeTextes.verrouille;
						this.getInstance(this.identContenus[j]).cours = this.Cours;
						this.getInstance(this.identContenus[j]).numeroSemaine =
							this.NumeroSemaine;
						this.getInstance(this.identContenus[j]).setParametresAffichage(
							lParamsAffichage,
						);
						this.getInstance(this.identContenus[j]).initialiser();
						lHR = true;
						j++;
					}
				}
			}
		}
		if (this.CahierDeTextes) {
			j = 0;
			for (i = 0; i < this.CahierDeTextes.listeContenus.count(); i++) {
				if (this.CahierDeTextes.listeContenus.get(i).existe()) {
					if (
						this.genreElementSelectionne ===
							Enumere_ElementCDT_1.EGenreElementCDT.Contenu &&
						this.indiceElementSelectionne === i
					) {
						lIndice = j;
						this.contenuCourant = this.CahierDeTextes.listeContenus.get(
							this.indiceElementSelectionne,
						);
					}
					this.indiceContenus[i] = j;
					this.getInstance(this.identContenus[j]).actualiserContenu(
						this.CahierDeTextes.listeContenus.get(i),
						this.CahierDeTextes.verrouille,
						this.avecDocumentJoint,
						this.ContenuPleinEcran,
						this._getOptionsContenuMenuMagique(),
					);
					j++;
				}
			}
			if (
				lIndice > -1 &&
				this.genreElementSelectionne ===
					Enumere_ElementCDT_1.EGenreElementCDT.Contenu
			) {
				this.getInstance(this.identContenus[lIndice]).focusSurPremierObjet();
			}
		}
	}
	_actualiserTAF(aReconstruire) {
		const lThis = this;
		if (aReconstruire) {
			this.getInstance(this.identListeTAFs).setDonnees({
				listeTAFs: this.CahierDeTextes.ListeTravailAFaire,
				CDTPublie: !!this.CahierDeTextes.publie || this._estPublieAuto(),
				CDTVerrouille: this.CahierDeTextes.verrouille,
				avecDocumentJoint: this.avecDocumentJoint,
				avecRessourcesGranulaire: this.avecRessourcesGranulaire,
				pleinEcran: this.TAFPleinEcran,
				dateDebutCours: this.DateCoursDeb,
				joursPresenceCours: this.JoursPresenceCours,
				avecQCMDevoir: this.avecQCMDevoir,
				servicesDevoir: this.servicesDevoir,
				avecQCMEvaluation: this.avecQCMEvaluation,
				servicesEvaluation: this.servicesEvaluation,
				cours: this.Cours,
				numeroSemaine: this.NumeroSemaine,
				listeClassesEleves: this.listeClassesEleves,
				listeModeles: this.ListeModeles,
				dateCreationTAF: this.dateCoursSuivantTAF || this.DateTravailAFaire,
				dateFinCours: this.DateCoursFin,
				afficherFenetreHtml: function (aDescriptif, aCallbackValider) {
					lThis.evenementSurBoutonHTML(aDescriptif, aCallbackValider);
				},
				ajoutNouveauTAFInterdit: this.ajoutNouveauTAFInterdit,
				messageSurNouveauTAF: this.messageSurNouveauTAF,
			});
		} else {
			this.actualiserTAF();
		}
	}
	_bloquerInterfaceTiny(aBloquer) {
		if (aBloquer !== false) {
			const lElementACouvrir = $(
				"#" + (this.Nom + "_P3").escapeJQ() + " :first-child",
			).get(0);
			const ldivBloquant = ObjetHtml_1.GHtml.htmlToDOM(
				'<div class="' +
					this.classDivBlocTiny +
					'" ' +
					'style="position:absolute; z-index:10;' +
					"top:0;" +
					"left:0;" +
					ObjetStyle_1.GStyle.composeHeight(
						ObjetPosition_1.GPosition.getHeight(lElementACouvrir) + 2,
					) +
					ObjetStyle_1.GStyle.composeWidth(
						ObjetPosition_1.GPosition.getWidth(lElementACouvrir) + 2,
					) +
					ObjetStyle_1.GStyle.composeOpacite(0.01) +
					ObjetStyle_1.GStyle.composeCouleurFond(GCouleur.blanc) +
					'">&nbsp;</div>',
			);
			ObjetHtml_1.GHtml.insererElementDOM(lElementACouvrir, ldivBloquant, true);
		} else {
			$("." + this.classDivBlocTiny).remove();
		}
	}
	surResizeInterface() {
		super.surResizeInterface();
		this._actualiserElementsProgramme();
	}
	_estVerrouille() {
		return this.CahierDeTextes ? this.CahierDeTextes.verrouille : true;
	}
	_getContenu(aIndice) {
		return this.CahierDeTextes.listeContenus.get(aIndice);
	}
	_getTAF(aIndice) {
		return this.CahierDeTextes.ListeTravailAFaire.get(aIndice);
	}
	_evenementSurFenetreElementsProgramme(aValider, aDonnees) {
		this.CahierDeTextes.listeElementsProgrammeCDT =
			aDonnees.listeElementsProgramme;
		this.palierElementTravailleSelectionne = aDonnees.palierActif;
		if (!!aDonnees.servicePourComptabilisationBulletin) {
			this.CahierDeTextes.servicePourComptabilisationBulletin =
				aDonnees.servicePourComptabilisationBulletin;
		}
		if (aValider) {
			this.setEtatSaisie(true);
			this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		this.surResizeInterface();
	}
	_actualiserListeCDTsPrecedents() {
		if (this.paramsListeCDTPrec.deploye) {
			this.getInstance(this.identListeCDTPrec).setDonnees(
				new DonneesListe_CDTsPrecedents_1.DonneesListe_CDTsPrecedents(
					this.listeCDTsPrecedents,
					this.paramsListeCDTPrec.nbAffiches,
				),
			);
		}
	}
	_evenementSurZoomListeCDT(aSurZoom) {
		this.listeCDTPleinEcran = aSurZoom;
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			!this.listeCDTPleinEcran,
		);
		ObjetHtml_1.GHtml.setDisplay(
			this.Nom + "_ZoneGrille",
			!this.listeCDTPleinEcran,
		);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_P3_3", !this.listeCDTPleinEcran);
		ObjetHtml_1.GHtml.setDisplay(this.Nom + "_P5", !this.listeCDTPleinEcran);
		const lJContListePrec = $(`#${this.Nom.escapeJQ()}_P3_2`);
		if (this.listeCDTPleinEcran) {
			lJContListePrec.removeClass("fix-bloc").addClass("fluid-bloc");
		} else {
			lJContListePrec.removeClass("fluid-bloc").addClass("fix-bloc");
		}
		const lInstanceListe = this.getInstance(this.identListeCDTPrec);
		if (this.listeCDTPleinEcran) {
			ObjetHtml_1.GHtml.setDisplay(lInstanceListe.getNom(), true);
			this.paramsListeCDTPrec.deploye = true;
		} else {
			ObjetHtml_1.GHtml.setDisplay(
				lInstanceListe.getNom(),
				this.paramsListeCDTPrec.deploye,
			);
			ObjetPosition_1.GPosition.setHeight(
				lInstanceListe.getNom(),
				this.paramsListeCDTPrec.hauteurListe,
			);
		}
		if (!this.listeCDTPleinEcran) {
			this._restaurationEDTEnAttente();
		}
		this.actualiser(false);
		GNavigateur.surResize();
		this.surResizeInterface();
	}
	_composeListeCDTsPrecedents() {
		const lJsxClasseZoomListeCahiersDeTextes = () => {
			return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesIconZoomPlusMoins(
				this.listeCDTPleinEcran,
			);
		};
		const H = [];
		H.push(
			'<div id="',
			this.Nom + '_listePrec" class="fluid-bloc flex-contain cols">',
		);
		H.push('<div class="fix-bloc p-y p-right-xl" style="overflow:hidden">');
		H.push('<div class="NoWrap" style="float:left">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical">',
			'<ie-btnimage class="Image_DeploiementBandeau" ie-model="listeCDT.btnDeploy" ie-display="afficherDeploy" title="',
			ObjetTraduction_1.GTraductions.getValeur("liste.HintBoutonDeploiement"),
			'" aria-labelledby="deploy" aria-controls="',
			this.getInstance(this.identListeCDTPrec).getNom(),
			'" aria-expanded="false"></ie-btnimage>',
			"</div>",
		);
		H.push(
			'<div class="InlineBlock EspaceGauche Gras AlignementMilieuVertical" id="deploy">',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ContenusPrecedents",
			),
			"</div>",
		);
		H.push(
			'<div class="InlineBlock EspaceGauche AlignementMilieuVertical">',
			'<ie-btnimage class="Image_IconeMoins" ie-model="listeCDT.btnIconeMoins" style="width:18px;" aria-label="',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.retirerContenuPrecedent",
			),
			'" title="',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.afficherMoinsContenuPrecedent",
			),
			'"></ie-btnimage>',
			"</div>",
		);
		H.push(
			'<div class="InlineBlock EspaceGauche AlignementMilieuVertical Gras" ie-html="listeCDT.htmlElementsPrecedents"></div>',
		);
		H.push(
			'<p class="sr-only" aria-live="polite" ie-html="listeCDT.htmlElementsPrecedentsWAI"></p>',
		);
		H.push(
			'<div class="InlineBlock EspaceGauche AlignementMilieuVertical">',
			'<ie-btnimage class="Image_IconePlus" ie-model="listeCDT.btnIconePlus" style="width:18px;" aria-label="',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ajouterContenuPrecedent",
			),
			'" title="',
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.afficherPlusContenuPrecedent",
			),
			'"></ie-btnimage>',
			"</div>",
		);
		H.push("</div>");
		H.push(
			'<span style="float: right;">',
			UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnZoomPlusMoins(
				"btnAgrandirReduireZoneListeCDT",
				lJsxClasseZoomListeCahiersDeTextes,
			),
			"</span>",
		);
		H.push("</div>");
		H.push(
			'<div id="',
			this.getInstance(this.identListeCDTPrec).getNom(),
			'" class="PetitEspaceBas fluid-bloc"',
			' style="',
			ObjetStyle_1.GStyle.composeHeight(this.paramsListeCDTPrec.hauteurListe),
			'"></div>',
		);
		H.push(
			'<div ie-if="listeCDT.afficherTraitSeparation" style="',
			ObjetStyle_1.GStyle.composeCouleurBordure(
				GCouleur.bordure,
				1,
				ObjetStyle_1.EGenreBordure.haut,
			),
			'" class="fix-bloc"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	_composeLigneZoneContenu() {
		const lJsxClasseZoomContenu = () => {
			return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesIconZoomPlusMoins(
				this.ContenuPleinEcran,
			);
		};
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.Nom + "_ZoneContenu",
					style: "flex: 1 1 52%; height:0;",
					class: "flex-contain cols p-top",
				},
				IE.jsx.str(
					"div",
					{
						class: "fluid-bloc flex-contain cols p-bottom",
						style: "height: 0;",
					},
					IE.jsx.str(
						"div",
						{
							class:
								"fix-bloc flex-contain flex-center justify-between flex-gap",
							style: "min-height:22px;",
						},
						IE.jsx.str("ie-btnicon", {
							"ie-model": "btnAjouterContenu",
							class: "fix-bloc icon_plus_fin bt-activable",
						}),
						IE.jsx.str(
							"span",
							{
								id: this.idContenu,
								class: "fluid-bloc semi-bold Insecable",
								role: "heading",
								"aria-level": "3",
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.contenus",
							),
						),
						IE.jsx.str("div", { class: "fluid-bloc", id: this.idKiosque }),
						IE.jsx.str("ie-btnicon", {
							class: "fix-bloc icon_comment_vide bt-activable m-right",
							"ie-if": "avecSaisieCommentaire",
							"ie-model": "displayNoteProchaineSeance(false)",
						}),
						IE.jsx.str(
							"div",
							{ class: "fix-bloc p-right-xl" },
							UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnZoomPlusMoins(
								"btnAgrandirReduireZoneContenu",
								lJsxClasseZoomContenu,
							),
						),
					),
					IE.jsx.str(
						"div",
						{
							class: "flex-contain AvecScrollVertical EspaceDroit full-height",
							style: "overflow-x:hidden;",
						},
						IE.jsx.str("div", {
							id: this.Nom + "_Contenus",
							class: "fluid-bloc m-right",
						}),
						IE.jsx.str("div", {
							"ie-if": "avecNoteProchaineSeance",
							"ie-html": "getHtmlNoteProchaineSeance",
							class: "conteneur-postIt",
						}),
					),
				),
				IE.jsx.str("div", {
					"ie-if": "contenu.afficherTraitSeparation",
					class: "fix-bloc m-top m-bottom-l",
					style: ObjetStyle_1.GStyle.composeCouleurBordure(
						GCouleur.bordure,
						1,
						ObjetStyle_1.EGenreBordure.haut,
					),
				}),
			),
		);
		return H.join("");
	}
	_composeLigneZoneElementsProgramme() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.Nom + "_ZoneElementsProgramme",
					style: "display:none;",
					class: "fix-bloc flex-contain cols",
				},
				IE.jsx.str(
					"div",
					{
						class: "fix-bloc flex-contain flex-center justify-between flex-gap",
					},
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnElementsProgramme",
						class: "fix-bloc icon_pencil bt-activable",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.Titre",
						),
						title: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.Titre",
						),
						"aria-haspopup": "dialog",
					}),
					IE.jsx.str(
						"span",
						{ class: "semi-bold fluid-bloc" },
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ElementsProgramme",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "fix-bloc p-right-xl" },
						UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnMonsieurFiche(
							"mrFicheElementsProg",
						),
					),
				),
				IE.jsx.str("div", {
					id: this.idElementsProgramme,
					class: "m-left p-bottom-l p-x-xl",
				}),
				IE.jsx.str("div", {
					style: ObjetStyle_1.GStyle.composeCouleurBordure(
						GCouleur.bordure,
						1,
						ObjetStyle_1.EGenreBordure.haut,
					),
				}),
			),
		);
		return H.join("");
	}
	_composeLigneZoneTAF() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{
						id: this.Nom + "_P4",
						style: "flex: 1 1 48%; height:0;",
						class: "flex-contain cols p-top flex-gap",
					},
					IE.jsx.str("div", {
						id: this.getInstance(this.identListeTAFs).getNom(),
						class: "fluid-bloc",
					}),
				),
				IE.jsx.str("div", {
					"ie-if": "taf.afficherTraitSeparation",
					style: ObjetStyle_1.GStyle.composeCouleurBordure(
						GCouleur.bordure,
						1,
						ObjetStyle_1.EGenreBordure.bas,
					),
					class: "m-top-l",
				}),
			),
		);
		return H.join("");
	}
	_composeLigneZoneCommentairePrive() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{
					id: this.Nom + "_P5",
					class: "flex-contain cols flex-gap p-top-l m-bottom-l",
				},
				IE.jsx.str(
					"div",
					{ class: "fix-bloc flex-contain flex-center flex-gap" },
					IE.jsx.str("ie-btnicon", {
						"ie-model": "btnCommentairePrive",
						class: "p-left-s icon_post_it_rempli bt-activable",
					}),
					IE.jsx.str(
						"span",
						{ class: "Gras" },
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.postIt.commentairePrive.titre",
						),
					),
					IE.jsx.str(
						"span",
						null,
						" (",
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.postIt.commentairePrive.infoTitre",
						),
						")",
					),
				),
			),
		);
		return H.join("");
	}
	_initialiserListeCDTPrec(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_CDTsPrecedents_1.DonneesListe_CDTsPrecedents.colonnes
				.deploiement,
			taille: 10,
		});
		lColonnes.push({
			id: DonneesListe_CDTsPrecedents_1.DonneesListe_CDTsPrecedents.colonnes
				.contenu,
			taille: "70%",
		});
		lColonnes.push({
			id: DonneesListe_CDTsPrecedents_1.DonneesListe_CDTsPrecedents.colonnes
				.taf,
			taille: "30%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesSansBordureDroit: [
				DonneesListe_CDTsPrecedents_1.DonneesListe_CDTsPrecedents.colonnes
					.deploiement,
			],
		});
	}
	_commandeCreerDevoirOuEval(aContenu, aGenreLienDS) {
		const lSaisieEnCours = this.etatUtilisateur.EtatSaisie;
		this._ouvertureAutoFenetreDS = () => {
			this.contenuCourant = aContenu;
			this._ouvrirFenetreDevoirSurTable(aGenreLienDS);
		};
		(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
			if (lSaisieEnCours) {
				this.recupererCahierDeTextes();
			} else {
				this._ouvrirFenetreDevoirSurTable(aGenreLienDS);
			}
		});
	}
	_evenementSurFenetreRessourceKiosqueLiens(aParams) {
		if (
			aParams.genreBouton === 1 &&
			!!aParams.selection &&
			aParams.selection.count() > 0
		) {
			for (let i = 0; i < aParams.selection.count(); i++) {
				const lElement = aParams.selection.get(i);
				if (!!lElement && !!lElement.ressource) {
					const lElementCourant =
						this.genreElementSelectionne ===
						Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire
							? this.tafCourant
							: this.contenuCourant;
					const lLienKiosque = new ObjetElement_1.ObjetElement(
						lElement.ressource.getLibelle(),
						null,
						Enumere_DocumentJoint_1.EGenreDocumentJoint.LienKiosque,
					);
					lLienKiosque.ressource = lElement.ressource;
					lLienKiosque.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
					if (
						!UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ressourceGranulaireKiosqueEstDejaPresentDanslesPJ(
							lLienKiosque,
							lElementCourant.ListePieceJointe,
						)
					) {
						this.ListeDocumentsJoints.addElement(lLienKiosque);
						lElementCourant.ListePieceJointe.addElement(lLienKiosque);
						lElementCourant.estVide = false;
						lElementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.setEtatSaisie(true);
						this.actualiser(true);
					}
				}
			}
		}
	}
	_ouvrirFenetreDevoirSurTable(aGenreLienDS, aParamsFenetreOrigine) {
		this._ouvertureAutoFenetreDS = null;
		const lInstanceFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DevoirSurTable_1.ObjetFenetre_DevoirSurTable,
			{
				pere: this,
				evenement: this._evenementSurFenetreDevoirSurTable.bind(this),
			},
		);
		lInstanceFenetre.setDonnees({
			cours: this.Cours,
			date: this.Cours.DateDuCours,
			numeroCycle: this.NumeroSemaine,
			contenu: this.contenuCourant,
			genreLienDS: aGenreLienDS,
			callbackSaisieSalle: this._callbackSaisieSalle.bind(
				this,
				lInstanceFenetre,
			),
			paramsFenetreOrigine: aParamsFenetreOrigine,
		});
	}
	_rechercheElementContenu(aContenu) {
		let lContenu =
			this.CahierDeTextes.listeContenus.getElementParElement(aContenu);
		if (!lContenu && aContenu && aContenu.estVide) {
			this.CahierDeTextes.listeContenus.parcourir((D) => {
				if (D.estVide) {
					lContenu = D;
					return false;
				}
			});
		}
		return lContenu;
	}
	_callbackSaisieSalle(aInstanceFenetre, aCours, aParamFenetre) {
		this.Cours = aCours;
		this._ouvertureAutoFenetreDS = () => {
			this.contenuCourant = this._rechercheElementContenu(
				aInstanceFenetre.param.contenu,
			);
			aInstanceFenetre.fermer();
			this._ouvrirFenetreDevoirSurTable(
				aParamFenetre.genreLienDS,
				aParamFenetre,
			);
		};
		new ObjetRequetePageEmploiDuTemps_1.ObjetRequetePageEmploiDuTemps(
			this,
			this.actionSurCalendrier,
		).lancerRequete({ numeroSemaine: this.NumeroSemaine });
	}
	_evenementSurFenetreDevoirSurTable(aValider, aParametres, aAvecLien) {
		if (!aValider) {
			return;
		}
		if (!this.contenuCourant || this.contenuCourant.estVide) {
			let lCategorie = null;
			this.listeCategories.parcourir((D) => {
				if (aParametres.genreLienDS === D.genreLienDS) {
					lCategorie = D;
					return false;
				}
			});
			const lNewContenu = new ObjetElement_1.ObjetElement(
				aParametres.contenu.getLibelle(),
			);
			lNewContenu.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			lNewContenu.descriptif = aParametres.contenu.descriptif;
			lNewContenu.estVide = false;
			lNewContenu.categorie =
				MethodesObjet_1.MethodesObjet.dupliquer(lCategorie);
			lNewContenu.ListePieceJointe =
				new ObjetListeElements_1.ObjetListeElements();
			lNewContenu.genreLienDS = aParametres.genreLienDS;
			if (aAvecLien) {
				lNewContenu.infosDS = $.extend({}, aParametres);
			}
			const lIndice = this.CahierDeTextes.listeContenus.count() - 1;
			const lElementVide = this.CahierDeTextes.listeContenus.get(lIndice);
			if (lElementVide && lElementVide.existe() && lElementVide.estVide) {
				this.CahierDeTextes.listeContenus.remove(lIndice);
			}
			this.CahierDeTextes.listeContenus.addElement(lNewContenu);
			this.CahierDeTextes.publie = true;
			this.CahierDeTextes.datePublication = ObjetDate_1.GDate.getDateCourante();
			this.genreElementSelectionne =
				Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
			this.contenuCourant = this.CahierDeTextes.listeContenus.get(
				this.CahierDeTextes.listeContenus.count() - 1,
			);
			this.indiceElementSelectionne =
				this.CahierDeTextes.listeContenus.getIndiceParElement(
					this.contenuCourant,
				) !== null
					? this.CahierDeTextes.listeContenus.getIndiceParElement(
							this.contenuCourant,
						)
					: this.CahierDeTextes.listeContenus.count() - 1;
			if (
				this.CahierDeTextes.Numero === null ||
				this.CahierDeTextes.Numero === undefined
			) {
				this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				this.CahierDeTextes.publie = true;
				this.CahierDeTextes.datePublication =
					ObjetDate_1.GDate.getDateCourante();
			} else {
				this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
			this.valider();
		} else {
			this.contenuCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.contenuCourant.Libelle = aParametres.contenu.getLibelle();
			this.contenuCourant.descriptif = aParametres.contenu.descriptif;
			this.contenuCourant.genreLienDS = aParametres.genreLienDS;
			if (aParametres.surModification_suppression) {
				this.contenuCourant.suppressionLien = true;
			} else if (aAvecLien) {
				this.contenuCourant.infosDS = $.extend({}, aParametres);
			}
			this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.valider();
		}
	}
	_serialisationDonnees(aElement) {
		if (aElement.estRessourceDeCours === false) {
			return false;
		}
	}
	_collerCDT() {
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.collerCDT(
			this.CahierDeTextes,
			this.CahierDeTextesCopie,
			this.avecElementsProgramme,
			this.dateCoursSuivantTAF || this.DateTravailAFaire,
		);
		this.ListeCahierDeTextes.addElement(this.CahierDeTextes, 0);
		this.actualiser(true);
		this.setEtatSaisie(true);
		this.setFocusIdCourant();
	}
	async _evenementSurMenuContextuel(ALigne) {
		this.setIdCourant(
			this.getInstance(this.IdentGrille).getNom() + "_Navigation",
		);
		if (GNavigateur.isToucheEchap()) {
			this.setFocusIdCourant();
		}
		if (ALigne && !GNavigateur.isToucheEchap()) {
			switch (ALigne.Numero) {
				case EGenreCommandeCdT.CopierCdT:
					this.CahierDeTextesCopie = this.CahierDeTextes;
					this.setFocusIdCourant();
					break;
				case EGenreCommandeCdT.CollerCdT:
					if (
						this.CahierDeTextesCopie &&
						this.CahierDeTextesCopie.getNumero() !==
							this.CahierDeTextes.getNumero()
					) {
						if (this.Cours && this.Cours.utilisable && this.Cours.AvecCdT) {
							this.applicationSco.getMessage().afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ConfirmerCollerCahierSurExistant",
								),
								callback: (aGenreAction) => {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										this._collerCDT();
									}
								},
							});
						} else {
							this._collerCDT();
						}
					}
					break;
				case EGenreCommandeCdT.SupprimerCdT: {
					const lResult = await this.applicationSco
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.msgConfirmationSupprimerContenu",
							),
						});
					if (lResult === Enumere_Action_1.EGenreAction.Valider) {
						this.CahierDeTextes.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
						this.setEtatSaisie(true);
						this.valider();
					}
					break;
				}
				case EGenreCommandeCdT.AffecterProgressionAuCdT:
					this._affecterProgressionAuCdT(true);
					break;
				case EGenreCommandeCdT.RattacherCDT: {
					this.avecDrag = false;
					const lReponse =
						await new ObjetRequeteListeCDTPourRattachement_1.ObjetRequeteListeCDTPourRattachement(
							this,
						).lancerRequete();
					this.actionSurRattachementCDT(lReponse.listeCDT);
					break;
				}
				case EGenreCommandeCdT.saisieDS:
				case EGenreCommandeCdT.saisieEval:
					this.contenuCourant = this.CahierDeTextes.listeContenus.get(0);
					this._commandeCreerDevoirOuEval(
						this.contenuCourant,
						ALigne.Numero === EGenreCommandeCdT.saisieDS
							? Enumere_LienDS_1.EGenreLienDS.tGL_Devoir
							: Enumere_LienDS_1.EGenreLienDS.tGL_Evaluation,
					);
					break;
				case EGenreCommandeCdT.AjouterContenuDansProgression:
					this.getInstance(
						this.identFenetreChoixDossierCopieCDT,
					).afficherChoixDossierCopieCDT(this.Cours, this.CahierDeTextes);
					break;
			}
		}
	}
	_callbackAffectationProgression(aParams) {
		aParams.listeNewContenus.parcourir((aContenu) => {
			const lIndice = this.CahierDeTextes.listeContenus.count() - 1;
			const lElementVide = this.CahierDeTextes.listeContenus.get(lIndice);
			if (lElementVide && lElementVide.existe() && lElementVide.estVide) {
				this.CahierDeTextes.listeContenus.remove(lIndice);
			}
			this.CahierDeTextes.listeContenus.addElement(aContenu);
			this.contenuCourant = aParams.contenu;
			this.genreElementSelectionne =
				Enumere_ElementCDT_1.EGenreElementCDT.Contenu;
			this.indiceElementSelectionne =
				this.CahierDeTextes.listeContenus.getIndiceParElement(
					this.contenuCourant,
				) !== null
					? this.CahierDeTextes.listeContenus.getIndiceParElement(
							this.contenuCourant,
						)
					: this.CahierDeTextes.listeContenus.count() - 1;
		});
		aParams.listeNewTAFs.parcourir((aTAF) => {
			this.CahierDeTextes.ListeTravailAFaire.addElement(aTAF);
		});
		if (aParams.listeNewContenus.count() > 0) {
			this._actualiserContenu(true);
		}
		if (aParams.listeNewTAFs.count() > 0) {
			this._actualiserTAF(true);
		}
		this.setEtatSaisie(true);
	}
	_affecterProgressionAuCdT(avecTAFVisible) {
		const lPublics = this.Cours.ListeContenus.getListeElements((aContenu) => {
			return [
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Groupe,
				Enumere_Ressource_1.EGenreRessource.PartieDeClasse,
			].includes(aContenu.getGenre());
		});
		const lMatiere = this.Cours.ListeContenus.getElementParNumeroEtGenre(
			null,
			Enumere_Ressource_1.EGenreRessource.Matiere,
		);
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.affecterProgressionAuCdT({
			instance: this,
			avecTAFVisible: avecTAFVisible,
			paramsAutorisationCreationTAF: {
				ajoutNouveauTAFInterdit: this.ajoutNouveauTAFInterdit,
				messageSurNouveauTAF: this.messageSurNouveauTAF,
			},
			cours: this.Cours,
			numeroSemaine: this.NumeroSemaine,
			cdt: this.CahierDeTextes,
			JoursPresenceCours: this.JoursPresenceCours,
			dateTAFMin: this.DateCoursDeb,
			dateTAF: new Date(
				(this.dateCoursSuivantTAF || this.DateTravailAFaire).getTime(),
			),
			listeCategories: this.listeCategories,
			strPublics: lPublics.getTableauLibelles().join(", "),
			strMatiere: lMatiere ? lMatiere.getLibelle() : "",
			callbackAffectation: this._callbackAffectationProgression.bind(this),
		});
	}
	_initialiserMenuContextuel(aCours, aInstance) {
		aInstance.addCommande(
			EGenreCommandeCdT.CopierCdT,
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CopierCDT"),
			!!(aCours.utilisable && aCours.AvecCdT),
		);
		aInstance.addCommande(
			EGenreCommandeCdT.CollerCdT,
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.CollerCDT"),
			!(
				!this.CahierDeTextesCopie ||
				!aCours.utilisable ||
				(this.CahierDeTextes && this.CahierDeTextes.verrouille)
			),
		);
		aInstance.addCommande(
			EGenreCommandeCdT.SupprimerCdT,
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.SupprimerCDT"),
			!!(
				aCours.AvecCdT &&
				!this.CahierDeTextes.verrouille &&
				aCours.utilisable
			),
		);
		aInstance.addSeparateur();
		aInstance.addCommande(
			EGenreCommandeCdT.RattacherCDT,
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.RattacherAUnCDTSansCours",
			),
			this.etatUtilisateur.existeCDTsDetaches,
		);
		aInstance.addSeparateur();
		const lActiverSaisieDSOuEval = !!(
			aCours.utilisable &&
			!this.CahierDeTextes.verrouille &&
			this.CahierDeTextes.listeContenus.get(0) &&
			this.CahierDeTextes.listeContenus.get(0).estVide
		);
		if (this.avecGestionNotation) {
			const lCommande = aInstance.addCommande(
				EGenreCommandeCdT.saisieDS,
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ProgrammerDS"),
				lActiverSaisieDSOuEval,
			);
			lCommande.icon = [
				TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
					TypeOrigineCreationCategorieCahierDeTexte_1
						.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Devoir,
				),
				"i-small",
				"m-right-s",
			].join(" ");
			lCommande.libelleIcone = ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.iconeDS",
			);
		}
		const lCommande = aInstance.addCommande(
			EGenreCommandeCdT.saisieEval,
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.ProgrammerEval"),
			lActiverSaisieDSOuEval,
		);
		lCommande.icon = [
			TypeOrigineCreationCategorieCahierDeTexte_1.TypeOrigineCreationCategorieCahierDeTexteUtil.getIcone(
				TypeOrigineCreationCategorieCahierDeTexte_1
					.TypeOrigineCreationCategorieCahierDeTexte.OCCCDT_Pre_Evaluation,
			),
			"i-small",
			"m-right-s",
		].join(" ");
		lCommande.libelleIcone = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.iconeEval",
		);
		aInstance.addSeparateur();
		aInstance.addCommande(
			EGenreCommandeCdT.AffecterProgressionAuCdT,
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.AffectationEltsProgressionAUnCahier",
			),
			!!(aCours.utilisable && !this.CahierDeTextes.verrouille),
		);
		aInstance.addCommande(
			EGenreCommandeCdT.AjouterContenuDansProgression,
			ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.AjouterElementsCDT",
			),
			aCours.utilisable &&
				this.CahierDeTextes &&
				((this.CahierDeTextes.listeContenus &&
					this.CahierDeTextes.listeContenus.getNbrElementsExistes() > 0 &&
					!this.CahierDeTextes.listeContenus.aUnElementVide()) ||
					(this.CahierDeTextes.ListeTravailAFaire &&
						this.CahierDeTextes.ListeTravailAFaire.getNbrElementsExistes() >
							0)),
		);
		aInstance.avecSeparateurSurSuivant();
		this.moduleSaisieCours.initMenuContextuelModifMatiere(aInstance, aCours);
		this.moduleSaisieCours.initMenuContextuelSupprimer(aInstance, aCours, true);
	}
	_actualiserGrille() {
		this.getInstance(this.IdentGrille).setDonnees({
			numeroSemaine: this.etatUtilisateur.getSemaineSelectionnee(),
			listeCours: this.listeCours,
			avecCoursAnnule: this.etatUtilisateur.getAvecCoursAnnule(),
		});
		this.selectionnerCours(this.Cours, EGenreSelectionSemaine.Sans, false);
		delete this.actualisationEDTAttente;
	}
	_restaurationEDTEnAttente() {
		if (this.actualisationEDTAttente) {
			this._actualiserGrille();
		}
	}
	_actualiserElementsProgramme() {
		const H = [];
		if (
			this.avecElementsProgramme &&
			this.CahierDeTextes.listeElementsProgrammeCDT &&
			this.CahierDeTextes.listeElementsProgrammeCDT.getNbrElementsExistes()
		) {
			this.CahierDeTextes.listeElementsProgrammeCDT.trier();
			let lElement;
			const lMaxHeight = Math.max(
				40,
				Math.floor(
					ObjetPosition_1.GPosition.getHeight(this.Nom + "_P3_2") / 4 - 20,
				),
			);
			H.push('<div ie-scrollv style="max-height:', lMaxHeight, 'px;"><div>');
			H.push("<ul>");
			for (
				let i = 0;
				i < this.CahierDeTextes.listeElementsProgrammeCDT.count();
				i++
			) {
				lElement = this.CahierDeTextes.listeElementsProgrammeCDT.get(i);
				if (lElement.existe()) {
					H.push("<li>", lElement.getLibelle(), "</li>");
				}
			}
			H.push("</ul>");
			H.push("</div></div>");
		}
		ObjetHtml_1.GHtml.setHtml(this.idElementsProgramme, H.join(""), {
			controleur: this.controleur,
		});
	}
	_ajouterListeFichiers(aListeFichiers, aGenreDocJoint) {
		if (aListeFichiers && aListeFichiers.count() > 0) {
			const lPJsCloud =
				UtilitaireSelecFile_1.UtilitaireSelecFile.extraireListeFichiersCloudsPartage(
					aListeFichiers,
				);
			if (aListeFichiers.count() > 0) {
				const lListeDocJointsSelonContexte =
					this.getListeDocumentsJointsSelonContexte(
						this.genreElementSelectionne,
					);
				this.getInstance(
					this.IdentEditionPieceJointe,
				).ajouterPiecesJointesAvecAppelCallback(
					aListeFichiers,
					aGenreDocJoint,
					this.ListeDocumentsJoints,
					lListeDocJointsSelonContexte,
					true,
				);
			}
			if (lPJsCloud.count() > 0) {
				const lElementCourant =
					this.genreElementSelectionne ===
					Enumere_ElementCDT_1.EGenreElementCDT.TravailAFaire
						? this.tafCourant
						: this.contenuCourant;
				lPJsCloud.parcourir((aFichier) => {
					lElementCourant.ListePieceJointe.addElement(aFichier);
					lElementCourant.estVide = false;
					this.ListeDocumentsJoints.addElement(aFichier);
				});
				lElementCourant.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.actualiser(true);
			}
			this.setEtatSaisie(true);
		}
	}
}
exports.InterfacePageSaisieCahierDeTextes = InterfacePageSaisieCahierDeTextes;
