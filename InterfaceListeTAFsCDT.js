exports.InterfaceListeTAFsCDT = exports.EGenreEvenementTAFCahierDeTextes =
	void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetInterface_1 = require("ObjetInterface");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const TinyInit_1 = require("TinyInit");
const DonneesListe_TAFsCDT_1 = require("DonneesListe_TAFsCDT");
const ObjetFenetre_ModeleTravailAFaire_1 = require("ObjetFenetre_ModeleTravailAFaire");
const ObjetFenetre_PanierRessourceKiosque_1 = require("ObjetFenetre_PanierRessourceKiosque");
const TypeGenreApiKiosque_1 = require("TypeGenreApiKiosque");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const TypeNiveauDifficulte_1 = require("TypeNiveauDifficulte");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const TypeModeCorrectionQCM_1 = require("TypeModeCorrectionQCM");
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetFenetre_SelectionQCMServicePeriode_1 = require("ObjetFenetre_SelectionQCMServicePeriode");
const ObjetRequeteListeTousLesThemes_1 = require("ObjetRequeteListeTousLesThemes");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_ListeThemes_1 = require("ObjetFenetre_ListeThemes");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
const AccessApp_1 = require("AccessApp");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetFenetre_SaisieMessage_1 = require("ObjetFenetre_SaisieMessage");
const ObjetFenetre_ParametrageTAF_1 = require("ObjetFenetre_ParametrageTAF");
const ObjetFenetre_ChargeTAF_1 = require("ObjetFenetre_ChargeTAF");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
var EGenreEvenementTAFCahierDeTextes;
(function (EGenreEvenementTAFCahierDeTextes) {
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["fenetreEditeurHTML"] = 0)
	] = "fenetreEditeurHTML";
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["editionDocumentJoint"] = 1)
	] = "editionDocumentJoint";
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["ajouterLienKiosque"] = 2)
	] = "ajouterLienKiosque";
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["ajouterDocumentDepuisCloud"] = 3)
	] = "ajouterDocumentDepuisCloud";
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["ajouterDocumentJoint"] = 4)
	] = "ajouterDocumentJoint";
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["clicBoutonZoom"] = 5)
	] = "clicBoutonZoom";
	EGenreEvenementTAFCahierDeTextes[
		(EGenreEvenementTAFCahierDeTextes["ouvrirCloudENEJ"] = 6)
	] = "ouvrirCloudENEJ";
})(
	EGenreEvenementTAFCahierDeTextes ||
		(exports.EGenreEvenementTAFCahierDeTextes =
			EGenreEvenementTAFCahierDeTextes =
				{}),
);
class InterfaceListeTAFsCDT extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.parametres = {};
		this.estInterfaceEnPleinEcran = false;
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
			this._initialiserListe,
		);
	}
	setDonnees(aParams) {
		this.parametres = $.extend(
			{
				listeTAFs: null,
				listeModeles: null,
				avecQCMDevoir: true,
				servicesDevoir: new ObjetListeElements_1.ObjetListeElements(),
				avecQCMEvaluation: true,
				servicesEvaluation: new ObjetListeElements_1.ObjetListeElements(),
				listeClassesEleves: null,
				CDTVerrouille: false,
				CDTPublie: false,
				avecDocumentJoint: false,
				cours: null,
				numeroSemaine: null,
				avecRessourcesGranulaire: false,
				ajoutNouveauTAFInterdit: false,
				messageSurNouveauTAF: "",
			},
			aParams,
		);
		const lListeTousEleves = new ObjetListeElements_1.ObjetListeElements();
		const lListeElevesDetaches = new ObjetListeElements_1.ObjetListeElements();
		let lListeTemp;
		if (!!this.parametres.listeClassesEleves) {
			this.parametres.listeClassesEleves.parcourir((aClasse) => {
				if (!!aClasse.listeEleves) {
					lListeTousEleves.add(aClasse.listeEleves);
					lListeTemp = aClasse.listeEleves.getListeElements((aElement) => {
						return aElement.estElevesDetachesDuCours;
					});
					if (lListeTemp.count() > 0) {
						lListeElevesDetaches.add(lListeTemp);
					}
				}
			});
		}
		lListeTousEleves.trier();
		this.parametres.listeTousEleves = lListeTousEleves;
		const lThis = this;
		const lListe = this.getInstance(this.identListe);
		lListe.setOptionsListe({ nonEditable: this.parametres.CDTVerrouille });
		lListe.setDonnees(
			new DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT({
				listeTAFs: this.parametres.listeTAFs,
				listeTousEleves: lListeTousEleves,
				listeElevesDetaches: lListeElevesDetaches,
				avecDocumentJoint: this.parametres.avecDocumentJoint,
				CDTVerrouille: this.parametres.CDTVerrouille,
				CDTPublie: this.parametres.CDTPublie,
				callbackPJ: (aTAF, aId) => {
					const lAvecCloudDisponibles = GEtatUtilisateur.avecCloudDisponibles();
					UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes(
						{
							instance: lThis,
							id: aId,
							callbackChoixParmiFichiersExistants: () => {
								lThis.callback.appel(
									EGenreEvenementTAFCahierDeTextes.editionDocumentJoint,
									aTAF,
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
								);
							},
							callbackChoixParmiLiensExistants: () => {
								lThis.callback.appel(
									EGenreEvenementTAFCahierDeTextes.editionDocumentJoint,
									aTAF,
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
								);
							},
							maxSizeNouvellePJ: this.applicationSco.droits.get(
								ObjetDroitsPN_1.TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
							),
							avecUploadMultiple: true,
							callbackUploadNouvellePJ: (aParametresInput) => {
								lThis.callback.appel(
									EGenreEvenementTAFCahierDeTextes.ajouterDocumentJoint,
									aTAF,
									aParametresInput,
								);
							},
							callbackChoixDepuisCloud: lAvecCloudDisponibles
								? () => {
										lThis.callback.appel(
											EGenreEvenementTAFCahierDeTextes.ajouterDocumentDepuisCloud,
											aTAF,
										);
									}
								: null,
							callbackChoixDepuisCloudENEJ: this.applicationSco
								.getEtatUtilisateur()
								.avecCloudENEJDisponible()
								? () => {
										lThis.callback.appel(
											EGenreEvenementTAFCahierDeTextes.ouvrirCloudENEJ,
											aTAF,
										);
									}
								: null,
							callbackNouvelleURL: (aNouvelleURL) => {
								lThis.callback.appel(
									EGenreEvenementTAFCahierDeTextes.ajouterDocumentJoint,
									aTAF,
									aNouvelleURL,
								);
							},
							callbackAjoutLienKiosque: lThis.parametres
								.avecRessourcesGranulaire
								? () => {
										lThis.callback.appel(
											EGenreEvenementTAFCahierDeTextes.ajouterLienKiosque,
											aTAF,
										);
									}
								: null,
						},
					);
				},
				completerTAFEnCreation: this._completerTAFEnCreation.bind(this),
				evenementMenuContextuelListeTAF:
					this._evenementMenuContextuelListeTAF.bind(this),
			}),
		);
	}
	actualiser(aCDTPublie) {
		const lInstanceListe = this.getInstance(this.identListe);
		if (
			lInstanceListe &&
			lInstanceListe.getDonneesListe() &&
			lInstanceListe.getDonneesListe().parametres
		) {
			if (aCDTPublie !== undefined && aCDTPublie !== null) {
				this.parametres.CDTPublie = aCDTPublie;
				lInstanceListe.getDonneesListe().parametres.CDTPublie = aCDTPublie;
			}
		}
		lInstanceListe.actualiser(true);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str("div", {
				style: "height:100%",
				id: this.getInstance(this.identListe).getNom(),
			}),
		);
		return H.join("");
	}
	setAffichageBoutonChargeTravail(aAffichageBouton) {
		this.avecAffichageBoutonChargeTravail = aAffichageBouton;
	}
	setDonneesChargeTravail(aCours, aListeClasses) {
		this.coursConcerne = aCours;
		this.listeClassesConcernees = aListeClasses;
	}
	setInterfaceEnPleinEcran(aEstInterfaceEnPleinEcran) {
		this.estInterfaceEnPleinEcran = aEstInterfaceEnPleinEcran;
	}
	_initialiserListe(aInstance) {
		const lColonnesCachees = [];
		if (
			!this.applicationSco.parametresUtilisateur.get("avecGestionDesThemes")
		) {
			lColonnesCachees.push(
				DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.themes,
			);
		}
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.description,
			taille: ObjetListe_1.ObjetListe.initColonne(100, 100),
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.DescriptionTAF",
			),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.pourLe,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.PourLeTAF",
			),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.aRendre,
			taille: 130,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.Rendu",
			),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.themes,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur("Themes"),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.eleves,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.ElevesTAF",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.ElevesTAFHint",
			),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.docsJoints,
			taille: ObjetListe_1.ObjetListe.initColonne(50, 100, 300),
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.DJsTAF",
			),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.duree,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.DureeTAF",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.DureeTAFHint",
			),
		});
		lColonnes.push({
			id: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.niveau,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.NiveauTAF",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.taf.NiveauTAFHint",
			),
		});
		const lListeBoutons = [];
		lListeBoutons.push({
			getHtml: () => {
				const lJsxModelBoutonParametresTAF = () => {
					return {
						getTitle: () => {
							return ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.paramTaf.SaisieTAFsPreferences",
							);
						},
						event: () => {
							const lFenetreParametresTAF =
								ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
									ObjetFenetre_ParametrageTAF_1.ObjetFenetre_ParametrageTAF,
									{ pere: this },
								);
							this.instanceFenetreParametrageTAF = lFenetreParametresTAF;
							lFenetreParametresTAF.afficher();
						},
						getSelection: () => {
							const lFenetreParametresTAF = this.instanceFenetreParametrageTAF;
							return (
								lFenetreParametresTAF && lFenetreParametresTAF.estAffiche()
							);
						},
					};
				};
				return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnParametrer(
					lJsxModelBoutonParametresTAF,
				);
			},
		});
		lListeBoutons.push({
			getHtml: () => {
				const H = [];
				if (this.avecAffichageBoutonChargeTravail) {
					const lJsxModelBoutonAfficherChargeTAF = () => {
						return {
							getTitle: () => {
								return ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ChargeTAFAFaire",
								);
							},
							event: () => {
								const lFenetreChargeTAF =
									ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
										ObjetFenetre_ChargeTAF_1.ObjetFenetre_ChargeTAF,
										{ pere: this },
									);
								this.instanceFenetreChargeTAF = lFenetreChargeTAF;
								lFenetreChargeTAF.setDonnees(
									this.coursConcerne,
									this.listeClassesConcernees,
								);
							},
							getSelection: () => {
								const lFenetreChargeTAF = this.instanceFenetreChargeTAF;
								return lFenetreChargeTAF && lFenetreChargeTAF.estAffiche();
							},
						};
					};
					H.push(
						UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnChargeDeTravail(
							lJsxModelBoutonAfficherChargeTAF,
						),
					);
				}
				return H.join("");
			},
		});
		lListeBoutons.push({
			getHtml: () => {
				const lJsxClasseIcone = () => {
					return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getClassesIconZoomPlusMoins(
						this.estInterfaceEnPleinEcran,
					);
				};
				const lJsxModelBoutonZoom = () => {
					return {
						event: () => {
							this.callback.appel(
								EGenreEvenementTAFCahierDeTextes.clicBoutonZoom,
							);
						},
						getTitle: () => {
							if (this.estInterfaceEnPleinEcran) {
								return ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.hintBoutonPleinEcranReduire",
								);
							}
							return ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.hintBoutonPleinEcranAgrandir",
							);
						},
					};
				};
				return UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnZoomPlusMoins(
					lJsxModelBoutonZoom,
					lJsxClasseIcone,
				);
			},
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			colonnesCachees: lColonnesCachees,
			avecLigneCreation: true,
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.ajouterTAF",
			),
			avecCreationEnBoutonDesignClassique: true,
			scrollHorizontal: true,
			boutons: lListeBoutons,
		});
		GEtatUtilisateur.setTriListe({
			liste: aInstance,
			tri: DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.description,
		});
	}
	_editerDate(aTAF) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: function (aGenreBouton, aDate) {
					if (aDate) {
						aTAF.PourLe = aDate;
						if (aTAF.Numero === null || aTAF.Numero === undefined) {
							aTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						} else {
							aTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
						if (aTAF.executionQCM) {
							const lDateFinPub = new Date(
								aDate.getFullYear(),
								aDate.getMonth(),
								aDate.getDate(),
								aTAF.executionQCM.dateFinPublication.getHours(),
								aTAF.executionQCM.dateFinPublication.getMinutes(),
							);
							aTAF.executionQCM.dateFinPublication = lDateFinPub;
							aTAF.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						}
						this.setEtatSaisie(true);
						this.getInstance(this.identListe).actualiser(true);
					}
				},
			},
		);
		lFenetre.setParametres(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
			GParametres.JoursOuvres,
			null,
			GParametres.JoursFeries,
		);
		lFenetre.setJoursMarques(this.parametres.joursPresenceCours);
		lFenetre.setPremiereDateSaisissable(this.parametres.dateDebutCours, true);
		lFenetre.setDonnees(aTAF.PourLe);
	}
	_editerNiveauDifficulte(aTAF) {
		const lListeNiveaux =
			TypeNiveauDifficulte_1.TypeNiveauDifficulteUtil.toListe(true);
		let lSelection = 0;
		lListeNiveaux.parcourir((D, aIndex) => {
			if (aTAF.niveauDifficulte === D.getGenre()) {
				lSelection = aIndex;
				return false;
			}
		});
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aGenreBouton, aSelection) {
					if (aGenreBouton !== 1) {
						return;
					}
					aTAF.niveauDifficulte = lListeNiveaux.get(aSelection).getGenre();
					aTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					this.setEtatSaisie(true);
					this.getInstance(this.identListe).actualiser(true);
				},
				initialiser: function (aInstance) {
					const lParamsListe = {
						optionsListe: {
							hauteurAdapteContenu: true,
							hauteurMaxAdapteContenu: 300,
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
						},
					};
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.taf.SelectionNiveauDifficulte",
						),
						largeur: 200,
						hauteur: null,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
					aInstance.paramsListe = lParamsListe;
				},
			},
		).setDonnees(
			new DonneesListe_NiveauxDifficulteTAF(lListeNiveaux),
			false,
			lSelection,
		);
	}
	_completerTAFEnCreation(aTAF) {
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.initTAF(
			aTAF,
			this.parametres.dateCreationTAF,
			this.parametres.listeTousEleves,
		);
		aTAF.Matiere = this.parametres.cours.matiere;
	}
	_creerTAF(aModele) {
		const lTAF = new ObjetElement_1.ObjetElement("");
		lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		this._completerTAFEnCreation(lTAF);
		lTAF.descriptif =
			"<div>" + (aModele ? aModele.getLibelle() : "") + "</div>";
		return lTAF;
	}
	_ajouterNouveauTAF(aTAF) {
		aTAF.Matiere = this.parametres.cours.matiere;
		this.parametres.listeTAFs.addElement(aTAF);
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.initListeElevesTAF(
			aTAF,
			this.parametres.listeTousEleves,
		);
		this.setEtatSaisie(true);
		const lListe = this.getInstance(this.identListe);
		lListe.actualiser();
		const lListeSelections =
			new ObjetListeElements_1.ObjetListeElements().addElement(aTAF);
		lListe.setListeElementsSelection(lListeSelections, {
			instancesIdentiques: true,
		});
	}
	_editerARendre(aTAF) {
		const lListeRenduTAFs = TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.toListe([
			TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque,
		]);
		let lSelection = 0;
		lListeRenduTAFs.parcourir((D, aIndex) => {
			if (aTAF.genreRendu === D.getGenre()) {
				lSelection = aIndex;
				return false;
			}
		});
		const lFenetreListeTypeRendusTAF =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_Liste_1.ObjetFenetre_Liste,
				{
					pere: this,
					evenement(aGenreBouton, aSelection) {
						if (aGenreBouton !== 1) {
							return;
						}
						aTAF.genreRendu = lListeRenduTAFs.get(aSelection).getGenre();
						aTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.setEtatSaisie(true);
						this.getInstance(this.identListe).actualiser(true);
					},
					initialiser(aInstance) {
						const lParamsListe = {
							optionsListe: {
								hauteurAdapteContenu: true,
								hauteurMaxAdapteContenu: 300,
								skin: ObjetListe_1.ObjetListe.skin.flatDesign,
							},
						};
						aInstance.setOptionsFenetre({
							titre: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.taf.Rendu",
							),
							largeur: 460,
							hauteur: null,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Annuler"),
								ObjetTraduction_1.GTraductions.getValeur("Valider"),
							],
						});
						aInstance.paramsListe = lParamsListe;
					},
				},
			);
		lFenetreListeTypeRendusTAF.setDonnees(
			new DonneesListe_ModesRenduTAF(lListeRenduTAFs),
			false,
			lSelection,
		);
	}
	_evenementSurListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.afficherMenuContextuelCreationTAF(aParametres.nodeBouton);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.description:
						this.callback.appel(
							EGenreEvenementTAFCahierDeTextes.fenetreEditeurHTML,
							aParametres.article,
						);
						break;
					case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.pourLe:
						this._editerDate(aParametres.article);
						break;
					case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.themes: {
						const lListeThemeOriginaux =
							new ObjetListeElements_1.ObjetListeElements();
						if (
							!!aParametres.article.ListeThemes &&
							aParametres.article.ListeThemes.count()
						) {
							aParametres.article.ListeThemes.parcourir((aTheme) => {
								aTheme.cmsActif = true;
								lListeThemeOriginaux.add(
									MethodesObjet_1.MethodesObjet.dupliquer(aTheme),
								);
							});
						}
						new ObjetRequeteListeTousLesThemes_1.ObjetRequeteListeTousLesThemes(
							this,
							this._ouvrirFenetreThemes.bind(
								this,
								aParametres.article,
								lListeThemeOriginaux,
							),
						).lancerRequete();
						break;
					}
					case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.eleves:
						UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirElevesTAF({
							instance: this,
							element: aParametres.article,
							listeTousEleves: this.parametres.listeTousEleves,
							callback: () => {
								this.setEtatSaisie(true);
								this.getInstance(this.identListe).actualiser(true);
							},
						});
						break;
					case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.niveau:
						this._editerNiveauDifficulte(aParametres.article);
						break;
					case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes.aRendre:
						this._editerARendre(aParametres.article);
						break;
					default:
				}
				break;
		}
	}
	_evenementSurFenetreRessourceKiosque(aParams) {
		this.listeRessourceKiosque = aParams.liste;
		if (
			aParams.genreBouton === 1 &&
			!!aParams.selection &&
			aParams.selection.count() === 1
		) {
			const lElement = aParams.selection.getPremierElement();
			const lElmPanierKiosque = this.listeRessourceKiosque.getElementParGenre(
				lElement.getGenre(),
			);
			IE.log.addLog(
				lElmPanierKiosque.getGenre() +
					" - " +
					lElmPanierKiosque.ressource.getLibelle(),
			);
			const lTAF = this._creerTAF();
			lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			$.extend(lTAF, {
				descriptif: lElmPanierKiosque.ressource.getLibelle(),
				PourLe: this.parametres.dateCreationTAF,
				listeEleves: new ObjetListeElements_1.ObjetListeElements(),
				estPourTous: true,
				ListePieceJointe: new ObjetListeElements_1.ObjetListeElements(),
				genreRendu: TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_RenduKiosque,
				ressource: lElmPanierKiosque.ressource,
			});
			this._ajouterNouveauTAF(lTAF);
		}
	}
	creerTAFDeTypeQCM(aAvecDevoirAssocie, aAvecEvaluationAssociee) {
		if (aAvecDevoirAssocie || aAvecEvaluationAssociee) {
			this.creerTAFDeTypeQCMChoixService(aAvecEvaluationAssociee);
		} else {
			this.creerTAFDeTypeQCMCDT();
		}
	}
	creerTAFDeTypeQCMChoixService(aAvecEvaluationAssociee) {
		const lThis = this;
		const lParams = {
			instance: lThis,
			pourEvaluation: !!aAvecEvaluationAssociee,
			services: !aAvecEvaluationAssociee
				? this.parametres.servicesDevoir
				: this.parametres.servicesEvaluation,
			dateCreationTAF: this.parametres.dateCreationTAF,
			dateFinCours: this.parametres.dateFinCours,
		};
		ObjetFenetre_SelectionQCMServicePeriode_1.ObjetFenetre_SelectionQCMServicePeriode.ouvrir(
			lParams,
		).then((aParams) => {
			if (
				!!aParams.valider &&
				!!aParams.qcm &&
				!!aParams.service &&
				!!aParams.periode
			) {
				let lTAF;
				if (!aParams.pourEvaluation) {
					lTAF =
						UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.creerTAFAvecQCMAvecDevoir(
							aParams,
						);
				} else {
					lTAF =
						UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.creerTAFAvecQCMAvecEvaluation(
							aParams,
						);
				}
				if (!!lTAF) {
					lThis._ajouterNouveauTAF(lTAF);
				}
			}
		});
	}
	creerTAFDeTypeQCMCDT() {
		const lThis = this;
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.choisirQCM({
			instance: lThis,
			paramsRequete: { pourEvaluation: false },
		}).then((aParamQCM) => {
			if (aParamQCM.eltQCM) {
				const lTAF = UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.creerTAFAvecQCM({
					qcm: aParamQCM.eltQCM,
					dateCreationTAF: lThis.parametres.dateCreationTAF,
					dateFinCours: lThis.parametres.dateFinCours,
					cours: lThis.parametres.cours,
					numeroSemaine: lThis.parametres.numeroSemaine,
				});
				if (!!lTAF) {
					lThis._ajouterNouveauTAF(lTAF);
				}
			}
		});
	}
	async afficherMenuContextuelCreationTAF(aElementDeclencheur) {
		const lAvecCreation =
			await UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.autoriserCreationTAF(
				this.parametres,
			);
		if (lAvecCreation) {
			ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
				pere: this,
				id: aElementDeclencheur,
				initCommandes: (aMenu) => {
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAF_SaisirUnTravail",
						),
						true,
						() => {
							const lAvecMiseEnForme =
								this.applicationSco.parametresUtilisateur.get(
									"CDT.TAF.ActiverMiseEnForme",
								);
							if (lAvecMiseEnForme) {
								const lTAF = this._creerTAF();
								this.parametres.afficherFenetreHtml("", (aDescriptif) => {
									if (TinyInit_1.TinyInit.estContenuVide(aDescriptif)) {
										return;
									}
									lTAF.descriptif = aDescriptif;
									this._ajouterNouveauTAF(lTAF);
								});
							} else {
								const lFenetreSaisieLibelleTAF =
									ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
										ObjetFenetre_SaisieMessage_1.ObjetFenetre_SaisieMessage,
										{
											pere: this,
											evenement: (aGenreBouton, aDonnees) => {
												if (aGenreBouton === 1) {
													const lTAF = this._creerTAF();
													lTAF.descriptif =
														"<div>" +
														aDonnees.message.replace(/\n/g, "<br>\n") +
														"</div>";
													this._ajouterNouveauTAF(lTAF);
												}
											},
											initialiser: (aInstance) => {
												aInstance.setOptionsFenetre({
													hauteur: 60,
													titre: ObjetTraduction_1.GTraductions.getValeur(
														"CahierDeTexte.TAF_SaisirUnTravail",
													),
												});
												aInstance.setParametresFenetreSaisieMessage({
													afficherZoneTexte: true,
													maxLengthSaisie: 10000,
												});
											},
										},
									);
								lFenetreSaisieLibelleTAF.afficher();
							}
						},
					);
					aMenu.addSeparateur();
					this.parametres.listeModeles.parcourir((aModeleCreation) => {
						if (
							aModeleCreation.getEtat() !==
							Enumere_Etat_1.EGenreEtat.Suppression
						) {
							aMenu.add(aModeleCreation.getLibelle(), true, () => {
								const lTAF = this._creerTAF(aModeleCreation);
								this._ajouterNouveauTAF(lTAF);
								if (
									!this.applicationSco.parametresUtilisateur.get(
										"CDT.TAF.ActiverMiseEnForme",
									)
								) {
									const lObjListe = this.getInstance(this.identListe);
									lObjListe.demarrerEditionSurCellule(
										lObjListe.getSelection(),
										lObjListe.getNumeroColonneDIdColonne(
											DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.colonnes
												.description,
										),
									);
								} else {
									this.parametres.afficherFenetreHtml(
										lTAF.descriptif,
										(aDescriptif) => {
											if (TinyInit_1.TinyInit.estContenuVide(aDescriptif)) {
												return;
											}
											lTAF.descriptif = aDescriptif;
											this.actualiser();
										},
									);
								}
							});
						}
					});
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAF_EnrichirLaListe",
						),
						true,
						() => {
							this.initFenetreModele();
						},
					);
					aMenu.addSeparateur();
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.TAF_QCM"),
						true,
						() => {
							this.creerTAFDeTypeQCM(false, false);
						},
					);
					if (
						this.applicationSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
						)
					) {
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF_QCMAvecDevoir",
							),
							this.parametres.avecQCMDevoir,
							() => {
								this.creerTAFDeTypeQCM(true, false);
							},
						);
					}
					aMenu.add(
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAF_QCMAvecEvaluation",
						),
						this.parametres.avecQCMEvaluation,
						() => {
							this.creerTAFDeTypeQCM(false, true);
						},
					);
					if (
						this.parametres.avecRessourcesGranulaire &&
						this.applicationSco.getEtatUtilisateur().activerKiosqueRenduTAF &&
						this.applicationSco.getEtatUtilisateur().avecRessourcesRenduTAF
					) {
						aMenu.add(
							ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAF_RenduKiosque",
							),
							true,
							() => {
								const lFenetre =
									ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
										ObjetFenetre_PanierRessourceKiosque_1.ObjetFenetre_PanierRessourceKiosque,
										{
											pere: this,
											evenement: this._evenementSurFenetreRessourceKiosque,
										},
									);
								const lGenresApi =
									new TypeEnsembleNombre_1.TypeEnsembleNombre();
								lGenresApi.add(
									TypeGenreApiKiosque_1.TypeGenreApiKiosque.Api_RenduPJTAF,
								);
								lFenetre.afficherFenetre(lGenresApi);
							},
						);
					}
				},
			});
		}
	}
	_evenementMenuContextuelListeTAF(aDonnees, aParametresListe) {
		const lThis = this;
		let lTAF = aDonnees.element;
		switch (aDonnees.genre) {
			case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.menuContextuelListeTAFs
				.ParametrageQCM:
				if (
					!!lTAF.executionQCM &&
					lTAF.executionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
				) {
					if (
						!lTAF.estPourTous &&
						lTAF.listeEleves &&
						lTAF.listeEleves.count()
					) {
						lTAF.executionQCM.listeElevesTAF = lTAF.listeEleves;
					} else {
						lTAF.executionQCM.listeElevesTAF = undefined;
						lTAF.executionQCM.cours = lThis.parametres.cours;
						lTAF.executionQCM.numeroSemaine = lThis.parametres.numeroSemaine;
					}
				}
				this.ouvrirFenetreParamExecutionQCM(
					(aNumeroBouton, aExecutionQCM) => {
						lTAF.executionQCM = aExecutionQCM;
						if (aNumeroBouton > 0) {
							if (
								(lTAF.executionQCM.estLieADevoir ||
									lTAF.executionQCM.estLieAEvaluation) &&
								lTAF.executionQCM.publierCorrige === undefined
							) {
								lTAF.executionQCM.publierCorrige =
									lTAF.executionQCM.modeDiffusionCorrige !==
									TypeModeCorrectionQCM_1.TypeModeCorrectionQCM.FBQ_CorrigeSans;
							}
							lTAF.executionQCM.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							lThis.actualiser();
							lThis.setEtatSaisie(true);
						}
					},
					{
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.ParametresExeQCMTAF",
						),
						largeur: 600,
					},
					{
						afficherModeQuestionnaire: true,
						afficherRessentiEleve: true,
						autoriserSansCorrige: true,
						autoriserCorrigerALaDate: true,
						executionQCM: lTAF.executionQCM,
						avecConsigne: true,
						avecPersonnalisationProjetAccompagnement: true,
						avecModeCorrigeALaDate: true,
						avecMultipleExecutions: true,
					},
				);
				break;
			case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.menuContextuelListeTAFs
				.SupprimerDJ:
				aDonnees.data.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				lTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				this.setEtatSaisie(true);
				break;
			case DonneesListe_TAFsCDT_1.DonneesListe_TAFsCDT.menuContextuelListeTAFs
				.DevoirAssocieQCM:
				if (!!lTAF.devoirAssocieQCM) {
				}
				break;
			default:
		}
	}
	initFenetreModele() {
		const lFenetreListeModeles =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_ModeleTravailAFaire_1.ObjetFenetre_ModeleTravailAFaire,
				{
					pere: this,
					evenement(aGenreBouton) {
						this.setEtatSaisie(true);
					},
				},
			);
		lFenetreListeModeles.setDonnees(this.parametres.listeModeles);
	}
	ouvrirFenetreParamExecutionQCM(aEvenement, aOptionsFenetre, aDonnees) {
		const lOptionsFenetre = $.extend(
			{
				listeBoutons: [
					ObjetTraduction_1.GTraductions.getValeur("Annuler"),
					ObjetTraduction_1.GTraductions.getValeur("Valider"),
				],
			},
			aOptionsFenetre,
		);
		if (!IE.estMobile) {
			lOptionsFenetre.largeur = 540;
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ParamExecutionQCM_1.ObjetFenetre_ParamExecutionQCM,
			{ pere: this, evenement: aEvenement },
			lOptionsFenetre,
		);
		lFenetre.setDonnees(
			$.extend(aDonnees, { afficherEnModeForm: IE.estMobile }),
		);
	}
	_ouvrirFenetreThemes(aTAF, aListeSelection, aJSON) {
		let lListeThemes = MethodesObjet_1.MethodesObjet.dupliquer(
			aJSON.listeTousLesThemes,
		);
		if (lListeThemes) {
			for (let i = 0; i < aListeSelection.count(); i++) {
				const lElm = lListeThemes.getElementParNumero(
					aListeSelection.getNumero(i),
				);
				if (lElm) {
					lElm.cmsActif = true;
				}
			}
		} else {
			lListeThemes = new ObjetListeElements_1.ObjetListeElements();
		}
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_ListeThemes_1.ObjetFenetre_ListeThemes,
			{
				pere: this,
				evenement: function (aGenreBouton, aChangementListe) {
					lFenetre.fermer();
					if (aGenreBouton === 1) {
						const lListeActif = aChangementListe.getListeElements(
							(aElement) => {
								return aElement.cmsActif;
							},
						);
						aTAF.ListeThemes = lListeActif;
						aTAF.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						this.setEtatSaisie(true);
						this.getInstance(this.identListe).actualiser(true);
					}
				},
			},
		);
		lFenetre.setDonnees({
			listeThemes: lListeThemes,
			matiereContexte: aTAF.Matiere || aJSON.matiereNonDesignee,
			listeMatieres: aJSON.listeMatieres,
			tailleLibelleTheme: aJSON.tailleLibelleTheme,
			libelleCB: aTAF.libelleCBTheme,
			matiereNonDesignee: aJSON.matiereNonDesignee,
		});
	}
}
exports.InterfaceListeTAFsCDT = InterfaceListeTAFsCDT;
class DonneesListe_ModesRenduTAF extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
}
class DonneesListe_NiveauxDifficulteTAF extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
}
