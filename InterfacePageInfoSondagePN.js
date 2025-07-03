exports.InterfacePageInfoSondagePN = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const InterfacePageInfoSondage_1 = require("InterfacePageInfoSondage");
const ObjetRequetePageActualites_1 = require("ObjetRequetePageActualites");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetMoteurActus_1 = require("ObjetMoteurActus");
const EGenreEvntActu_1 = require("EGenreEvntActu");
const ObjetRequeteSaisieActualites_1 = require("ObjetRequeteSaisieActualites");
const ObjetRequeteSaisieActualitesNotification_1 = require("ObjetRequeteSaisieActualitesNotification");
const Enumere_Espace_1 = require("Enumere_Espace");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_ResultatsActualite_1 = require("ObjetFenetre_ResultatsActualite");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_EditionActualite_1 = require("ObjetFenetre_EditionActualite");
const ObjetRequeteGenererFichiersResultatsSondage_1 = require("ObjetRequeteGenererFichiersResultatsSondage");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const GestionnaireBlocPN_1 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_2 = require("GestionnaireBlocPN");
const GestionnaireBlocPN_3 = require("GestionnaireBlocPN");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetRequeteSaisieFichierResultatsSondage_1 = require("ObjetRequeteSaisieFichierResultatsSondage");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_Message_1 = require("ObjetFenetre_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetDate_1 = require("ObjetDate");
const FicheEditionInfoSond_Mobile_1 = require("FicheEditionInfoSond_Mobile");
const MoteurDestinatairesPN_1 = require("MoteurDestinatairesPN");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const MoteurGestionPJPN_1 = require("MoteurGestionPJPN");
const TypeEtatPublication_1 = require("TypeEtatPublication");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const ObjetRequeteSaisieExportFichierProf_1 = require("ObjetRequeteSaisieExportFichierProf");
const TypeGenreEchangeDonnees_1 = require("TypeGenreEchangeDonnees");
const ObjetChaine_1 = require("ObjetChaine");
const MultipleObjetFenetre_ImportFichierProf = require("ObjetFenetre_ImportFichierProf");
const Cache_1 = require("Cache");
const ObjetRequeteListeDiffusion_1 = require("ObjetRequeteListeDiffusion");
const ObjetFenetre_SelectionListeDiffusion_1 = require("ObjetFenetre_SelectionListeDiffusion");
const DonneesListe_SelectionDiffusion_1 = require("DonneesListe_SelectionDiffusion");
const ObjetFenetre_ResultatsActualite_PN_1 = require("ObjetFenetre_ResultatsActualite_PN");
const ObjetFenetre_PartageModeleActualite_1 = require("ObjetFenetre_PartageModeleActualite");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const Toast_1 = require("Toast");
class InterfacePageInfoSondagePN extends InterfacePageInfoSondage_1.InterfacePageInfoSondage {
	constructor(...aParams) {
		super(...aParams);
		this.diffusionResultatsSondageEnCours = false;
		this.utilitaires = {
			genreRessource: new GestionnaireBlocPN_1.UtilitaireGenreRessource(),
			genreEspace: new GestionnaireBlocPN_2.UtilitaireGenreEspace(),
			genreReponse: new GestionnaireBlocPN_3.UtilitaireGenreReponse(),
			moteurDestinataires: new MoteurDestinatairesPN_1.MoteurDestinatairesPN(),
			moteurGestionPJ: new MoteurGestionPJPN_1.MoteurGestionPJPN(),
		};
		this.moteur = new ObjetMoteurActus_1.ObjetMoteurActus(this.utilitaires);
		this.moteurCP = new MoteurInfoSondage_1.MoteurInfoSondage(this.utilitaires);
		this.listePJ =
			this.avecAuteur && this.droitSaisie
				? this.utilitaires.moteurGestionPJ.getListePJEtablissement()
				: null;
		this.page = IE.estMobile
			? this.etatUtil.getPage()
			: this.etatUtil.Navigation.OptionsOnglet;
		if (!!this.page && this.page.avecActionSaisie) {
			this.genreAff = this.genresAffichages.saisie;
			this.filtreModeItem =
				TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout;
			this.modeAuteur = this.avecAuteur;
		}
	}
	init() {
		super.init();
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtil = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
	}
	instancierEditionInfoSond() {
		if (IE.estMobile) {
			return this.addFenetre(
				FicheEditionInfoSond_Mobile_1.FicheEditionInfoSond_Mobile,
				this._evenementEditionActu.bind(this),
				this._initFicheEditionInfoSond.bind(this),
			);
		} else {
			return this.addFenetre(
				ObjetFenetre_EditionActualite_1.ObjetFenetre_EditionActualite,
				this._evenementEditionActu.bind(this),
				this.initFenetreEditionInfoSond,
			);
		}
	}
	actualiserDonnees() {
		const lModesAff = new TypeEnsembleNombre_1.TypeEnsembleNombre();
		lModesAff.add(TypeEtatPublication_1.TypeModeAff.MA_Reception);
		if (this.avecAuteur) {
			lModesAff.add(TypeEtatPublication_1.TypeModeAff.MA_Diffusion);
			lModesAff.add(TypeEtatPublication_1.TypeModeAff.MA_Brouillon);
			lModesAff.add(TypeEtatPublication_1.TypeModeAff.MA_Modele);
		}
		new ObjetRequetePageActualites_1.ObjetRequetePageActualites(
			this,
			this._actionSurRecupererDonnees.bind(this),
		).lancerRequete({ modesAffActus: lModesAff });
	}
	estInfoSondDuTypeModeDiff(aInfoSond, aFiltreModeAff) {
		const lInfos = this.moteurCP.getInfosPublication(aInfoSond);
		switch (aFiltreModeAff) {
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout:
				return true;
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Publiee:
				return lInfos.estEnCours;
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieeFutur:
				return lInfos.estFutur;
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieePasse:
				return lInfos.estPassee;
			case TypeEtatPublication_1.TypeItemEnum.IE_Brouillon:
				return !lInfos.estPubliee;
			default:
				return false;
		}
	}
	estInfoSondDuTypeModeModeles(aInfoSond, aFiltreModeAff) {
		switch (aFiltreModeAff) {
			case TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info:
				return aInfoSond.estInformation;
			case TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage:
				return aInfoSond.estSondage;
			default:
				return false;
		}
	}
	getListeActualitesDeModeAff(aModeAff) {
		const lData = this.tabModeAff[aModeAff];
		if (lData !== null && lData !== undefined) {
			return lData.listeActualites;
		} else {
			return null;
		}
	}
	getCompteurDeType(aTypeItemEnum) {
		let lModeAff =
			TypeEtatPublication_1.TypeItemEnumUtil.getTypeModeAffDeTypeItemEnum(
				aTypeItemEnum,
			);
		let lListeActus = this.getListeActualitesDeModeAff(lModeAff);
		if (lListeActus === null || lListeActus === undefined) {
			return 0;
		}
		let lListeFiltree = lListeActus.getListeElements((aElt) => {
			switch (aTypeItemEnum) {
				case TypeEtatPublication_1.TypeItemEnum.IE_Reception:
					return !aElt.lue;
				case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout:
				case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieePasse:
				case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Publiee:
				case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieeFutur:
				case TypeEtatPublication_1.TypeItemEnum.IE_Brouillon:
					return this.estInfoSondDuTypeModeDiff(aElt, aTypeItemEnum);
				case TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage:
				case TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info:
					return this.estInfoSondDuTypeModeModeles(aElt, aTypeItemEnum);
				default:
					return false;
			}
		});
		return lListeFiltree !== null && lListeFiltree !== undefined
			? lListeFiltree.count()
			: 0;
	}
	getListeFiltree() {
		const lListeFiltree = this.listeActualites.getListeElements((aElement) => {
			return (
				!(this.estGenreReception() && this.uniquementNonLues && aElement.lue) &&
				(!this.estGenreDiffusion() ||
					this.estInfoSondDuTypeModeDiff(aElement, this.filtreModeItem)) &&
				(!this.estGenreModeles() ||
					this.estInfoSondDuTypeModeModeles(aElement, this.filtreModeItem)) &&
				(!this.avecFiltreCategorie ||
					(this.categorie !== null &&
						this.categorie !== undefined &&
						(!this.categorie.existeNumero() ||
							aElement.categorie.getNumero() === this.categorie.getNumero())))
			);
		});
		lListeFiltree.setTri([
			ObjetTri_1.ObjetTri.init(
				"dateDebut",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init(
				"dateCreation",
				Enumere_TriElement_1.EGenreTriElement.Decroissant,
			),
			ObjetTri_1.ObjetTri.init("Libelle"),
		]);
		lListeFiltree.trier();
		return lListeFiltree;
	}
	getOptionsInfoSond() {
		return {
			avecEditionActualite: this.estGenreDiffusion() || this.estGenreModeles(),
			droitSaisie: this.droitSaisie,
			droitSaisieModele: this.droitSaisieModele,
			droitPublicationPageEtablissement: this.droitPublicationPageEtablissement,
			avecVisuResultats: this.estGenreDiffusion(),
			avecSuppressionActusRecues: true,
			avecDiscussion:
				this.estGenreReception() &&
				[
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.Etablissement,
					Enumere_Espace_1.EGenreEspace.Administrateur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
					Enumere_Espace_1.EGenreEspace.Eleve,
					Enumere_Espace_1.EGenreEspace.Parent,
					Enumere_Espace_1.EGenreEspace.PrimParent,
					Enumere_Espace_1.EGenreEspace.Accompagnant,
					Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
					Enumere_Espace_1.EGenreEspace.Tuteur,
				].includes(this.etatUtil.GenreEspace),
			avecModeles: this.getAvecModeles(),
			estCtxModeles: this.estGenreModeles(),
			evenementMenuContextuel: (aInfoSond, aGenreEvnt, aParam) => {
				this.evntSurValidationInfoSond(aInfoSond, aGenreEvnt, aParam);
			},
			getHintModalite: (aListeModalites) => {
				return ObjetFenetre_PartageModeleActualite_1.ObjetFenetre_PartageModeleActualite.getTitleListeModalites(
					aListeModalites,
				);
			},
		};
	}
	reInitialiserSurValidation() {
		this.contexte.niveauCourant = this.getNiveauDeGenreEcran({
			genreEcran: this.avecAuteur
				? InterfacePageInfoSondage_1.InterfacePageInfoSondage.genreEcran
						.listeTypesBlocs
				: InterfacePageInfoSondage_1.InterfacePageInfoSondage.genreEcran
						.listeBlocs,
		});
		this._jetonReinitScrollListeInfosSond = this.getInstance(
			this.identListeInfosSond,
		).getPositionScrollV();
		this.initialiser(true);
	}
	evntSurValidationInfoSond(aInfoSond, aGenreEvnt, aParam) {
		if (EGenreEvntActu_1.EGenreEvntActuUtil.estEvntSaisieReponse(aGenreEvnt)) {
			aParam.modeAuteur = this.modeAuteur;
			aParam.clbckRecupDonnees = this.reInitialiserSurValidation;
			aParam.pereRecupDonnees = this;
			this.moteur.surEvntSaisieReponseActu(aInfoSond, aGenreEvnt, aParam);
		} else {
			switch (aGenreEvnt) {
				case EGenreEvntActu_1.EGenreEvntActu.SurSelectionInfoSondage:
					this.surSelectionInfoSondage({ infoSondage: aInfoSond });
					break;
				case EGenreEvntActu_1.EGenreEvntActu.SurCreationActu: {
					let lItemASelectionner;
					let lModele = true;
					if (aInfoSond && !!aInfoSond.estAModeliser) {
						lItemASelectionner = aInfoSond.estInformation
							? TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info
							: TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage;
					} else {
						lItemASelectionner =
							TypeEtatPublication_1.TypeItemEnum.IE_Brouillon;
						lModele = false;
					}
					this.filtreModeItem = lItemASelectionner;
					let lItemASelectionnerApresSaisie = this.getItemDeType(
						this.filtreModeItem,
					);
					this.typeSelectionne = lItemASelectionnerApresSaisie;
					this.listeActualites.addElement(aInfoSond);
					this.declencherSaisie(true, lModele, lItemASelectionnerApresSaisie);
					break;
				}
				case EGenreEvntActu_1.EGenreEvntActu.SurValidationModif: {
					let avecToast = true;
					if (
						aInfoSond &&
						aInfoSond.getEtat() === Enumere_Etat_1.EGenreEtat.Suppression
					) {
						this.contexte.selectionCouranteModeDiffusion = null;
						avecToast = false;
					}
					let lItemASelectionnerApresSaisie;
					if (!!aInfoSond && aInfoSond.publie === false) {
						let lItemASelectionner =
							TypeEtatPublication_1.TypeItemEnum.IE_Brouillon;
						lItemASelectionnerApresSaisie =
							this.getItemDeType(lItemASelectionner);
						this.typeSelectionne = lItemASelectionnerApresSaisie;
					}
					this.declencherSaisie(avecToast, null, lItemASelectionnerApresSaisie);
					break;
				}
				case EGenreEvntActu_1.EGenreEvntActu.SurMenuCtxActu:
					switch (aParam.cmd.getNumero()) {
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.editerActu:
							this.getInstance(this.identEditionInfoSond).setOptionsFenetre({
								titre: ObjetTraduction_1.GTraductions.getValeur(
									"actualites.Edition.Modification",
								),
							});
							this.getInstance(this.identEditionInfoSond).setDonnees(
								this.initDataInfoSondSurEdition({
									estCreation: false,
									donnee: aInfoSond,
									estModele: aInfoSond.estModele === true,
									avecRecupModele: !aInfoSond.estModele && this.avecModeles,
								}),
							);
							break;
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.recupererModele: {
							this.getInstance(this.identEditionInfoSond).setDonnees(
								this.initDataInfoSondSurEdition({
									estCreation: true,
									estInfo: aInfoSond.estInformation,
									appliquerModele: aInfoSond,
									avecRecupModele: false,
								}),
							);
							break;
						}
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.exporterModele: {
							new ObjetRequeteSaisieExportFichierProf_1.ObjetRequeteSaisieExportFichierProf(
								{},
							)
								.lancerRequete({
									genreFichier:
										TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees
											.GED_ModelesSondage,
									listeModeles:
										new ObjetListeElements_1.ObjetListeElements().addElement(
											aInfoSond,
										),
								})
								.then((aReponse) => {
									var _a;
									if (
										(_a = aReponse.JSONReponse) === null || _a === void 0
											? void 0
											: _a.url
									) {
										window.open(
											ObjetChaine_1.GChaine.encoderUrl(
												aReponse.JSONReponse.url,
											),
										);
									}
								});
							break;
						}
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.voirResultats:
							this.evntSurAfficherResultats(aInfoSond);
							break;
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.demarrerDiscussion:
							this.surDemarrerDiscussion(aInfoSond);
							break;
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.relancerSelection:
							this.surRelancerSelection(aInfoSond);
							break;
						case MoteurInfoSondage_1.EGenreEvntMenuCtxBlocInfoSondage
							.gestionPartageModele:
							this.ouvrirFenetreGestionDuPartage(aInfoSond);
							break;
					}
					break;
				case EGenreEvntActu_1.EGenreEvntActu.SurDiffusionResultats: {
					const lInstanceFenetreEdition = this.getInstance(
						this.identEditionInfoSond,
					);
					if (!!lInstanceFenetreEdition) {
						new ObjetRequeteGenererFichiersResultatsSondage_1.ObjetRequeteGenererFichiersResultatsSondage(
							this,
						)
							.lancerRequete({
								sondage: aInfoSond,
								nominatif: aParam.estNominatif,
							})
							.then((aReponse) => {
								var _a, _b;
								if (
									!aReponse.messageErreur &&
									((_b =
										(_a = aReponse.JSONRapportSaisie) === null || _a === void 0
											? void 0
											: _a.listeFichiersResultats) === null || _b === void 0
										? void 0
										: _b.count()) > 0
								) {
									const lNouvelleActu =
										this.moteurCP.creerInfoDiffusionDesResultatsSondage(
											aInfoSond,
											this.listeCategories,
											aReponse.JSONRapportSaisie.listeFichiersResultats,
										);
									this.diffusionResultatsSondageEnCours = true;
									lInstanceFenetreEdition.setOptionsFenetre({
										titre: ObjetTraduction_1.GTraductions.getValeur(
											"actualites.creerInfo",
										),
									});
									lInstanceFenetreEdition.setDonnees({
										donnee: lNouvelleActu,
										creation: true,
									});
								} else {
									this.applicationSco
										.getMessage()
										.afficher({
											type: Enumere_BoiteMessage_1.EGenreBoiteMessage
												.Information,
											titre:
												ObjetTraduction_1.GTraductions.getValeur(
													"SaisieImpossible",
												),
											message: ObjetTraduction_1.GTraductions.getValeur(
												"actualites.Edition.ErreurCreationFichiersResultats",
											),
										});
								}
							});
					}
					break;
				}
			}
		}
	}
	getAvecAuteur() {
		const lMasquerFonctionnalite = false;
		return (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimMairie,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
				Enumere_Espace_1.EGenreEspace.PrimPeriscolaire,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimPeriscolaire,
			].includes(this.etatUtil.GenreEspace) ||
			([
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Mobile_Parent,
			].includes(this.etatUtil.GenreEspace) &&
				this.etatUtil.Identification.ressource.estDelegue &&
				this.parametresSco.ActivationMessagerieEntreParents &&
				!lMasquerFonctionnalite)
		);
	}
	getAvecDroitSaisie() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.actualite.avecSaisieActualite,
		);
	}
	getDroitPublicationPageEtablissement() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.communication.avecPublicationPageEtablissement,
		);
	}
	getForcerAR() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.forcerARInfos,
		);
	}
	getAvecSondageAnonyme() {
		return this.applicationSco.droits.get(
			ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionSondageAnonyme,
		);
	}
	getAvecFiltreCategorie() {
		return true;
	}
	getAvecDroitSaisieModele() {
		const lEstEspaceParent = [
			Enumere_Espace_1.EGenreEspace.PrimParent,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimParent,
			Enumere_Espace_1.EGenreEspace.Parent,
			Enumere_Espace_1.EGenreEspace.Mobile_Parent,
		].includes(this.etatUtil.GenreEspace);
		if (lEstEspaceParent) {
			return false;
		}
		return super.getAvecDroitSaisieModele();
	}
	getAvecRecupModele() {
		return this.avecModeles && this.getAvecDroitSaisieModele();
	}
	surDemarrerDiscussion(aInfoSond) {
		ObjetFenetre_Message_1.ObjetFenetre_Message.creerFenetreDiscussion(
			this,
			this._donneesFenetreEditionDiscussion(aInfoSond),
		);
	}
	surRelancerSelection(aInfoSond) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		lListe.add(aInfoSond);
		new ObjetRequeteSaisieActualitesNotification_1.ObjetRequeteSaisieActualitesNotification(
			this,
		).lancerRequete({
			avecNotificationParticipant: true,
			listeActualite: lListe,
			saisieActualite: this.modeAuteur,
		});
	}
	ouvrirFenetreGestionDuPartage(aInfoSond) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PartageModeleActualite_1.ObjetFenetre_PartageModeleActualite,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (
						aNumeroBouton === 1 &&
						aParams.actualite &&
						[
							Enumere_Etat_1.EGenreEtat.Creation,
							Enumere_Etat_1.EGenreEtat.Modification,
						].includes(aParams.actualite.getEtat())
					) {
						aParams.actualite.changePartageModeleSeulement = true;
						this.moteur.surEvntSaisieReponseActu(
							aParams.actualite,
							EGenreEvntActu_1.EGenreEvntActu.SurValidationDirecte,
							{
								modeAuteur: this.modeAuteur,
								clbckRecupDonnees: this.reInitialiserSurValidation,
								pereRecupDonnees: this,
								avecRecupDonnees: true,
							},
						);
					}
				},
			},
		);
		if (lFenetre) {
			lFenetre.setDonnees(aInfoSond);
		}
	}
	initDataInfoSondSurEdition(aParam) {
		if (aParam.estCreation === true) {
			const lDefault = {
				donnee: null,
				creation: true,
				forcerAR: this.forcerAR,
				estInfo: aParam.estInfo,
				genreReponse: aParam.estInfo
					? this.utilitaires.genreReponse.getGenreAvecAR()
					: this.utilitaires.genreReponse.getGenreChoixUnique(),
				listePJ: this.listePJ,
				maxSizePJ: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
				),
				listeCategories: this.listeCategories,
				publie: !(
					this.avecAuteur &&
					this.filtreModeItem ===
						TypeEtatPublication_1.TypeItemEnum.IE_Brouillon
				),
				estModele: aParam.estModele,
				appliquerModele: aParam.appliquerModele,
				avecRecupModele: aParam.avecRecupModele,
			};
			if (aParam.estInfo === false) {
				return $.extend(lDefault, {
					avecChoixAnonyme: this.avecSondageAnonyme,
				});
			}
			return lDefault;
		} else {
			return {
				donnee: aParam.donnee,
				forcerAR: this.forcerAR,
				avecChoixAnonyme: this.avecSondageAnonyme,
				creation: false,
				listePJ: this.listePJ,
				maxSizePJ: this.applicationSco.droits.get(
					ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
				),
				listeCategories: this.listeCategories,
				estModele: aParam.estModele,
				avecRecupModele: aParam.avecRecupModele,
			};
		}
	}
	getTypeInfoSondParDefaut() {
		return this.page && this.page.avecActionSaisie
			? TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout
			: TypeEtatPublication_1.TypeItemEnum.IE_Reception;
	}
	getListeDonneesTypesInfoSond() {
		const lDonnees = new ObjetListeElements_1.ObjetListeElements();
		let lEltDiffTout = null;
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeEtatPublication_1.TypeItemEnum,
		)) {
			const lTypeItemEnum = TypeEtatPublication_1.TypeItemEnum[lKey];
			if (
				MethodesObjet_1.MethodesObjet.isNumber(lTypeItemEnum) &&
				(this.getAvecModeles() ||
					![
						TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info,
						TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage,
					].includes(lTypeItemEnum))
			) {
				let lElt = new ObjetElement_1.ObjetElement(
					TypeEtatPublication_1.TypeItemEnumUtil.getStr(lTypeItemEnum),
					lTypeItemEnum,
					lTypeItemEnum,
				);
				lElt.icone =
					TypeEtatPublication_1.TypeItemEnumUtil.getIcon(lTypeItemEnum);
				lElt.compteur = this.getCompteurDeType(lTypeItemEnum);
				lElt.estAvecSeparateurHaut = [
					TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout,
					TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage,
				].includes(lTypeItemEnum);
				if (
					lTypeItemEnum === TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout
				) {
					lEltDiffTout = lElt;
				} else if (
					lEltDiffTout !== null &&
					[
						TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Publiee,
						TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieeFutur,
						TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieePasse,
					].includes(lTypeItemEnum)
				) {
					lElt.pere = lEltDiffTout;
				}
				lDonnees.addElement(lElt);
			}
		}
		return lDonnees;
	}
	getGenreAffichageSelonTypeAcces(aGenreTypeAcces) {
		switch (aGenreTypeAcces) {
			case TypeEtatPublication_1.TypeItemEnum.IE_Reception:
				return this.genresAffichages.reception;
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout:
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieePasse:
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Publiee:
			case TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_PublieeFutur:
			case TypeEtatPublication_1.TypeItemEnum.IE_Brouillon:
				return this.genresAffichages.saisie;
			case TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info:
			case TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage:
				return this.genresAffichages.modeles;
			default:
		}
	}
	getAvecModeles() {
		return (
			this.getAvecAuteur() &&
			this.getAvecDroitSaisie() &&
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.PrimParent,
			].includes(this.etatUtil.GenreEspace)
		);
	}
	estModeItemDeTypeInfo() {
		return (
			this.filtreModeItem === TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info
		);
	}
	estModeItemDeTypeSondage() {
		return (
			this.filtreModeItem ===
			TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage
		);
	}
	evntImportModele() {
		if (this.applicationSco.getModeExclusif()) {
			this.applicationSco
				.getMessage()
				.afficher({
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"ModeExclusif.UsageExclusif",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"ModeExclusif.SaisieImpossibleConsultation",
					),
				});
		} else {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				MultipleObjetFenetre_ImportFichierProf.ObjetFenetre_ImportFichierProf,
				{
					pere: this,
					initialiser: (aInstance) => {
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"actualites.importerModeleSondage",
							),
						});
						aInstance.setOptions({
							genreFichier:
								TypeGenreEchangeDonnees_1.TypeGenreEchangeDonnees
									.GED_ModelesSondage,
						});
					},
					evenement: () => {
						this.reInitialiserSurValidation();
					},
				},
			).setDonnees();
		}
	}
	evenementOuvrirMenuContextuel(aInfoSondage, aParams) {
		const lInstance = this;
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: aParams.instance,
			options: { largeurMaxLibelle: 450 },
			evenement: function (aLigne) {
				aParams.instance.fermer();
				lInstance.evntSurValidationInfoSond(
					aInfoSondage,
					EGenreEvntActu_1.EGenreEvntActu.SurDiffusionResultats,
					{ estNominatif: aLigne.getNumero() === 0 },
				);
			},
			initCommandes: function (aInstance) {
				aInstance.addCommande(
					0,
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.DiffuserResultatsNominatif",
					),
				);
				aInstance.addCommande(
					1,
					ObjetTraduction_1.GTraductions.getValeur(
						"actualites.Edition.DiffuserResultatsAnonyme",
					),
				);
			},
		});
	}
	evntSurAfficherResultats(aInfoSond) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ResultatsActualite_PN_1.ObjetFenetre_ResultatsActualite_PN,
			{
				pere: this,
				evenement: (aNumeroBouton, aParams) => {
					if (
						!!aParams.bouton &&
						aParams.bouton.typeBouton ===
							ObjetFenetre_ResultatsActualite_1
								.TypeBoutonFenetreResultatActualite.DiffuserResultats
					) {
						if (!!aInfoSond.reponseAnonyme) {
							aParams.instance.fermer();
							this.evntSurValidationInfoSond(
								aInfoSond,
								EGenreEvntActu_1.EGenreEvntActu.SurDiffusionResultats,
								{ estNominatif: false },
							);
						} else {
							this.evenementOuvrirMenuContextuel(aInfoSond, aParams);
						}
					}
				},
				initialiser(aInstance) {
					const lListeBoutons = [];
					const lEstSurEspaceProfOuPersonnel = [
						Enumere_Espace_1.EGenreEspace.Professeur,
						Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
						Enumere_Espace_1.EGenreEspace.PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
						Enumere_Espace_1.EGenreEspace.Etablissement,
						Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
						Enumere_Espace_1.EGenreEspace.Administrateur,
						Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
						Enumere_Espace_1.EGenreEspace.PrimDirection,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
						Enumere_Espace_1.EGenreEspace.PrimMairie,
						Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie,
					].includes(this.etatUtil.GenreEspace);
					if (lEstSurEspaceProfOuPersonnel && aInfoSond.estSondage) {
						lListeBoutons.push({
							libelle: ObjetTraduction_1.GTraductions.getValeur(
								"actualites.Edition.DiffuserResultats",
							),
							theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
							typeBouton:
								ObjetFenetre_ResultatsActualite_1
									.TypeBoutonFenetreResultatActualite.DiffuserResultats,
							sansFermeture: true,
						});
					}
					lListeBoutons.push({
						libelle: ObjetTraduction_1.GTraductions.getValeur("Fermer"),
						theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
						typeBouton:
							ObjetFenetre_ResultatsActualite_1
								.TypeBoutonFenetreResultatActualite.Fermer,
					});
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.Edition.OngletResultats",
						),
						modale: true,
						largeur: 900,
						hauteur: 700,
						listeBoutons: lListeBoutons,
					});
					aInstance.setUtilitaires(this.utilitaires);
				},
			},
		);
		lFenetre.setActualite(aInfoSond);
	}
	formatterDataSurBasculeModeAff(aGenreAff, aFiltre) {
		this.listeActualites = this._getListeActualitesDeGenreAff(
			aGenreAff,
			aFiltre,
		);
		this.initListeInfosSond(this.getInstance(this.identListeInfosSond));
		this.moteurCP.formatterDonnees({
			listeInfoSond: this.listeActualites,
			forcerAR: this.forcerAR,
		});
		this.moteurCP.formatterListeActusPourBlocs({
			listeActualites: this.listeActualites,
		});
	}
	declencherActionsAutoSurNavigation() {
		if (this.page && this.page.avecActionSaisie) {
			this._creerInfoSondDepuisNavigation();
		}
	}
	getAvecBtnNouveau() {
		if (this.estGenreModeles()) {
			return this.getAvecDroitSaisieModele();
		}
		return super.getAvecBtnNouveau();
	}
	_initFicheEditionInfoSond(aInstance) {
		var _a;
		aInstance.setUtilitaires(this.utilitaires);
		aInstance.setOptions({
			avecCBElevesRattaches: this.parametresSco.avecElevesRattaches,
			avecGestionEleves: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionEleves,
			),
			avecGestionPersonnels: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionPersonnels,
			),
			avecGestionStages: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionStages,
			),
			avecGestionIPR: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionIPR,
			),
			avecPublicationPageEtablissement: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.communication
					.avecPublicationPageEtablissement,
			),
			strSignature:
				(_a = this.etatUtil.messagerieSignature) === null || _a === void 0
					? void 0
					: _a.signature,
		});
		aInstance.setOptionsFenetre({ avecFooterFlottant: false });
		aInstance.envoyerRequete = (aParam) => {
			this.moteurCP.formatterDonneesAvantSaisie({
				listeInfoSond: aParam.paramRequete.listeActualite,
			});
			return new ObjetRequeteSaisieActualites_1.ObjetRequeteSaisieActualites(
				this,
				aParam.clbckSurReussite.bind(aInstance, 1),
			)
				.addUpload({
					listeFichiers: aParam.listePJCree,
					listeDJCloud: aParam.listePJ,
				})
				.lancerRequete(aParam.paramRequete);
		};
		aInstance.avecListeDiffusion = true;
		aInstance.surBtnListeDiffusion = () => {
			let lListeDiffusions = null;
			if (
				Cache_1.GCache &&
				Cache_1.GCache.general.existeDonnee("listeDiffusion")
			) {
				lListeDiffusions = Cache_1.GCache.general.getDonnee("listeDiffusion");
			}
			return Promise.resolve()
				.then(() => {
					if (!lListeDiffusions) {
						return new ObjetRequeteListeDiffusion_1.ObjetRequeteListeDiffusion(
							this,
						)
							.lancerRequete()
							.then((aJSON) => {
								if (aJSON && aJSON.liste) {
									lListeDiffusions = aJSON.liste;
									if (Cache_1.GCache) {
										Cache_1.GCache.general.setDonnee(
											"listeDiffusion",
											lListeDiffusions,
										);
									}
								}
							});
					}
				})
				.then(() => {
					return new Promise((aResolve) => {
						if (!lListeDiffusions) {
							return null;
						}
						lListeDiffusions.parcourir((aElement) => {
							aElement.cmsActif = false;
						});
						ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
							ObjetFenetre_SelectionListeDiffusion_1.ObjetFenetre_SelectionListeDiffusion,
							{
								pere: this,
								evenement: (aGenreBouton) => {
									let lListeDiffusionsSelection =
										new ObjetListeElements_1.ObjetListeElements();
									if (aGenreBouton === 1) {
										lListeDiffusionsSelection =
											lListeDiffusions.getListeElements(
												(aElement) => !!aElement.cmsActif,
											);
									}
									aResolve(lListeDiffusionsSelection);
								},
							},
						).setDonnees(
							new DonneesListe_SelectionDiffusion_1.DonneesListe_SelectionDiffusion(
								lListeDiffusions,
							),
							false,
						);
					});
				});
		};
		aInstance.setOptionsFenetre({
			modale: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	_initialiserCategories(aParam) {
		this.listeCategories = aParam.listeCategories;
		if (
			this.etatUtil.getCategorie() === null ||
			this.etatUtil.getCategorie() === undefined
		) {
			const lCategorieParDefaut = this.listeCategories
				.getListeElements((aElt) => {
					return aElt.toutesLesCategories === true;
				})
				.get(0);
			this.categorie = lCategorieParDefaut;
			this.etatUtil.setCategorie(lCategorieParDefaut);
		}
	}
	_creerInfoSondDepuisNavigation() {
		if (this.page.creerInformation) {
			this.evntBtnCreerActuInfo();
		} else {
			this.evntBtnCreerActuSondage();
		}
		this.page = null;
		this.etatUtil.resetPage();
		this.etatUtil.Navigation.OptionsOnglet = null;
	}
	_getListeActualitesDeGenreAff(aGenreAff, aFiltreModeAff) {
		let lModeAffCourant;
		switch (aGenreAff) {
			case this.genresAffichages.reception:
				lModeAffCourant = TypeEtatPublication_1.TypeModeAff.MA_Reception;
				break;
			case this.genresAffichages.saisie:
				if (
					aFiltreModeAff === TypeEtatPublication_1.TypeItemEnum.IE_Brouillon
				) {
					lModeAffCourant = TypeEtatPublication_1.TypeModeAff.MA_Brouillon;
				} else {
					lModeAffCourant = TypeEtatPublication_1.TypeModeAff.MA_Diffusion;
				}
				break;
			case this.genresAffichages.modeles:
				lModeAffCourant = TypeEtatPublication_1.TypeModeAff.MA_Modele;
				break;
			default:
		}
		return this.getListeActualitesDeModeAff(lModeAffCourant);
	}
	_actionSurRecupererDonnees(aDonnees) {
		this.tabModeAff = aDonnees.listeModesAff;
		this.formatterDataSurBasculeModeAff(this.genreAff, this.filtreModeItem);
		this._initialiserCategories({ listeCategories: aDonnees.listeCategories });
		this.initEcranTypeAccesInfoSond();
		this.afficherSelonFiltres();
	}
	_evenementEditionActu(aGenreBouton, aParam) {
		const lEstCtxCreation =
			aGenreBouton === 1 &&
			aParam &&
			aParam.eltCree !== null &&
			aParam.eltCree !== undefined;
		if (lEstCtxCreation) {
			const lEstUneCreationDepuisUnModele =
				(this.filtreModeItem ===
					TypeEtatPublication_1.TypeItemEnum.IE_Modele_Info ||
					this.filtreModeItem ===
						TypeEtatPublication_1.TypeItemEnum.IE_Modele_Sondage) &&
				aParam.donnee &&
				!aParam.donnee.estModele;
			if (
				this.filtreModeItem ===
					TypeEtatPublication_1.TypeItemEnum.IE_Reception ||
				lEstUneCreationDepuisUnModele
			) {
				const lTypeItem =
					aParam.donnee && aParam.donnee.publie === false
						? TypeEtatPublication_1.TypeItemEnum.IE_Brouillon
						: TypeEtatPublication_1.TypeItemEnum.IE_Diffusion_Tout;
				let lItemASelectionnerApresSaisie = this.getItemDeType(lTypeItem);
				this.typeSelectionne = lItemASelectionnerApresSaisie;
				this.modeAuteur = this.avecAuteur;
				this.genreAff = this.genresAffichages.saisie;
				this.filtreModeItem = lTypeItem;
			}
		}
		if (this.diffusionResultatsSondageEnCours) {
			this.diffusionResultatsSondageEnCours = false;
			if (aGenreBouton !== 1) {
				const lListePiecesJointes =
					this.moteurCP.getListePiecesJointesDActualite(aParam.donnee);
				if (!!lListePiecesJointes) {
					lListePiecesJointes.parcourir((D) => {
						D.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					});
				}
				new ObjetRequeteSaisieFichierResultatsSondage_1.ObjetRequeteSaisieFichierResultatsSondage(
					this,
				).lancerRequete({ listePJASupprimer: lListePiecesJointes });
			} else {
				this._reponseSaisie();
			}
		} else {
			if (aGenreBouton === 1) {
				if (aParam && aParam.eltCree !== null && aParam.eltCree !== undefined) {
					this.contexte.selectionCouranteModeDiffusion = aParam.eltCree;
				}
				this._reponseSaisie();
			}
		}
	}
	declencherSaisie(avecToast, avecCreationModele, avecNouvelEl) {
		var _a;
		const lObjetSaisie = {
			listeActualite: this.listeActualites,
			validationDirecte: false,
			saisieActualite: this.modeAuteur,
		};
		let toastMessage = ObjetTraduction_1.GTraductions.getValeur(
			"actualites.PublicationEffective",
		);
		if (
			!!avecNouvelEl &&
			avecNouvelEl.getGenre() ===
				TypeEtatPublication_1.TypeItemEnum.IE_Brouillon
		) {
			toastMessage = ObjetTraduction_1.GTraductions.getValeur(
				"actualites.BrouillonEnregistre",
			);
		}
		if (
			((_a = this.contexte.selectionCouranteModeDiffusion) === null ||
			_a === void 0
				? void 0
				: _a.publie) === false
		) {
			toastMessage = ObjetTraduction_1.GTraductions.getValeur(
				"actualites.BrouillonEnregistre",
			);
		}
		if (avecCreationModele === true) {
			toastMessage = ObjetTraduction_1.GTraductions.getValeur(
				"actualites.nouveauModele",
			);
		}
		new ObjetRequeteSaisieActualites_1.ObjetRequeteSaisieActualites(
			this,
			this._reponseSaisie.bind(this),
		)
			.lancerRequete(lObjetSaisie)
			.then((aReponse) => {
				if (aReponse[0] === ObjetRequeteJSON_1.EGenreReponseSaisie.succes) {
					if (!!avecToast && avecToast === true) {
						Toast_1.Toast.afficher({
							msg: toastMessage,
							type: Toast_1.ETypeToast.succes,
						});
					}
				}
			});
	}
	_reponseSaisie(aJSONReponse, aJSONRapportSaisie) {
		if (this.modeAuteur) {
			if (
				aJSONRapportSaisie !== null &&
				aJSONRapportSaisie !== undefined &&
				aJSONRapportSaisie.infoSondCree !== null &&
				aJSONRapportSaisie.infoSondCree !== undefined
			) {
				this.contexte.selectionCouranteModeDiffusion =
					aJSONRapportSaisie.infoSondCree;
			}
			this.recupererDonnees();
		}
	}
	_donneesFenetreEditionDiscussion(aInfoSond) {
		const lDonnees = {};
		const lAuteur = aInfoSond.elmauteur;
		if (this._estSurEspaceProfesseurOuPersonnel()) {
			const lListeEns = new ObjetListeElements_1.ObjetListeElements();
			const lListePers = new ObjetListeElements_1.ObjetListeElements();
			switch (lAuteur.getGenre()) {
				case Enumere_Ressource_1.EGenreRessource.Enseignant:
					lListeEns.addElement(lAuteur);
					break;
				case Enumere_Ressource_1.EGenreRessource.Personnel:
					lListePers.addElement(lAuteur);
					break;
				default:
					break;
			}
			const lGenresRessources = [
				{
					genre: Enumere_Ressource_1.EGenreRessource.Enseignant,
					listeDestinataires: lListeEns,
				},
				{
					genre: Enumere_Ressource_1.EGenreRessource.Personnel,
					listeDestinataires: lListePers,
				},
			];
			lDonnees.genresRessources = lGenresRessources;
		} else {
			lDonnees.genreRessource = lAuteur.getGenre();
			const lListe = new ObjetListeElements_1.ObjetListeElements();
			lListe.addElement(lAuteur);
			lDonnees.ListeRessources = lListe;
			lDonnees.listeSelectionnee = lListe;
		}
		let lStrTraduc, lParamsTraduc;
		const lEstInfo = aInfoSond.estInformation;
		if (aInfoSond.getLibelle()) {
			lStrTraduc = lEstInfo
				? "actualites.discussion.enReponseAInformation"
				: "actualites.discussion.enReponseAuSondage";
			lParamsTraduc = [
				aInfoSond.getLibelle(),
				ObjetDate_1.GDate.formatDate(aInfoSond.dateDebut, "%J/%MM/%AAAA"),
			];
		} else {
			lStrTraduc = lEstInfo
				? "actualites.discussion.enReponseAInformationDu"
				: "actualites.discussion.enReponseAuSondageDu";
			lParamsTraduc = [
				ObjetDate_1.GDate.formatDate(aInfoSond.dateDebut, "%J/%MM/%AAAA"),
			];
		}
		lDonnees.message = {
			objet: ObjetTraduction_1.GTraductions.getValeur(
				"actualites.discussion.reponse",
				[aInfoSond.getLibelle()],
			),
			contenu: ObjetTraduction_1.GTraductions.getValeur(
				lStrTraduc,
				lParamsTraduc,
			),
		};
		return lDonnees;
	}
	_estSurEspaceProfesseurOuPersonnel() {
		return [
			Enumere_Espace_1.EGenreEspace.Professeur,
			Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
			Enumere_Espace_1.EGenreEspace.PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimProfesseur,
			Enumere_Espace_1.EGenreEspace.Etablissement,
			Enumere_Espace_1.EGenreEspace.Mobile_Etablissement,
			Enumere_Espace_1.EGenreEspace.Administrateur,
			Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
			Enumere_Espace_1.EGenreEspace.PrimDirection,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			Enumere_Espace_1.EGenreEspace.Accompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
			Enumere_Espace_1.EGenreEspace.PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Mobile_PrimAccompagnant,
			Enumere_Espace_1.EGenreEspace.Tuteur,
			Enumere_Espace_1.EGenreEspace.Mobile_Tuteur,
		].includes(this.etatUtil.GenreEspace);
	}
}
exports.InterfacePageInfoSondagePN = InterfacePageInfoSondagePN;
