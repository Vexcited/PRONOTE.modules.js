const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreDocumentJoint } = require("Enumere_DocumentJoint.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
const { ObjetFenetre_Liste } = require("ObjetFenetre_Liste.js");
const { ObjetInterface } = require("ObjetInterface.js");
const { ObjetListe } = require("ObjetListe.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeEnsembleNombre } = require("TypeEnsembleNombre.js");
const { TinyInit } = require("TinyInit.js");
const DonneesListe_TAFsCDT = require("DonneesListe_TAFsCDT.js");
const ObjetFenetre_ModeleTravailAFaire = require("ObjetFenetre_ModeleTravailAFaire.js");
const {
	ObjetFenetre_PanierRessourceKiosque,
} = require("ObjetFenetre_PanierRessourceKiosque.js");
const { TypeGenreApiKiosque } = require("TypeGenreApiKiosque.js");
const {
	TypeGenreRenduTAF,
	TypeGenreRenduTAFUtil,
} = require("TypeGenreRenduTAF.js");
const { TypeNiveauDifficulteUtil } = require("TypeNiveauDifficulte.js");
const { UtilitaireSaisieCDT } = require("UtilitaireSaisieCDT.js");
const { TypeModeCorrectionQCM } = require("TypeModeCorrectionQCM.js");
const {
	ObjetDonneesListeFlatDesign,
} = require("ObjetDonneesListeFlatDesign.js");
const ObjetFenetre_SelectionQCMServicePeriode = require("ObjetFenetre_SelectionQCMServicePeriode.js");
const {
	ObjetRequeteListeTousLesThemes,
} = require("ObjetRequeteListeTousLesThemes.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { ObjetFenetre_ListeThemes } = require("ObjetFenetre_ListeThemes.js");
const {
	ObjetFenetre_ParamExecutionQCM,
} = require("ObjetFenetre_ParamExecutionQCM.js");
const EGenreEvenementTAFCahierDeTextes = {
	fenetreEditeurHTML: 0,
	editionDocumentJoint: 1,
	ajouterLienKiosque: 2,
	ajouterDocumentDepuisCloud: 3,
	ajouterDocumentJoint: 4,
};
class InterfaceListeTAFsCDT extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.parametres = {};
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.GenreStructure = EStructureAffichage.Autre;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementSurListe,
			_initialiserListe,
		);
	}
	setDonnees(aParams) {
		this.parametres = $.extend(
			{
				listeTAFs: null,
				listeModeles: null,
				avecQCMDevoir: true,
				servicesDevoir: new ObjetListeElements(),
				avecQCMEvaluation: true,
				servicesEvaluation: new ObjetListeElements(),
				listeClassesEleves: null,
				CDTVerrouille: false,
				CDTPublie: false,
				avecDocumentJoint: false,
				cours: null,
				numeroSemaine: null,
				avecRessourcesGranulaire: false,
			},
			aParams,
		);
		const lListeTousEleves = new ObjetListeElements();
		const lListeElevesDetaches = new ObjetListeElements();
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
			new DonneesListe_TAFsCDT({
				listeTAFs: this.parametres.listeTAFs,
				avecQCMDevoir: this.parametres.avecQCMDevoir,
				avecQCMEvaluation: this.parametres.avecQCMEvaluation,
				avecGestionNotation: GApplication.droits.get(
					TypeDroits.fonctionnalites.gestionNotation,
				),
				listeTousEleves: lListeTousEleves,
				listeElevesDetaches: lListeElevesDetaches,
				listeModeles: this.parametres.listeModeles,
				avecDocumentJoint: this.parametres.avecDocumentJoint,
				avecRessourcesGranulaire: this.parametres.avecRessourcesGranulaire,
				CDTVerrouille: this.parametres.CDTVerrouille,
				CDTPublie: this.parametres.CDTPublie,
				callbackPJ: function (aTAF, aId) {
					const lAvecCloudDisponibles = GEtatUtilisateur.avecCloudDisponibles();
					UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes({
						instance: lThis,
						id: aId,
						callbackChoixParmiFichiersExistants: () => {
							lThis.callback.appel(
								EGenreEvenementTAFCahierDeTextes.editionDocumentJoint,
								aTAF,
								EGenreDocumentJoint.Fichier,
							);
						},
						callbackChoixParmiLiensExistants: () => {
							lThis.callback.appel(
								EGenreEvenementTAFCahierDeTextes.editionDocumentJoint,
								aTAF,
								EGenreDocumentJoint.Url,
							);
						},
						maxSizeNouvellePJ: GApplication.droits.get(
							TypeDroits.cahierDeTexte.tailleMaxPieceJointe,
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
						callbackNouvelleURL: (aNouvelleURL) => {
							lThis.callback.appel(
								EGenreEvenementTAFCahierDeTextes.ajouterDocumentJoint,
								aTAF,
								aNouvelleURL,
							);
						},
						callbackAjoutLienKiosque: lThis.parametres.avecRessourcesGranulaire
							? () => {
									lThis.callback.appel(
										EGenreEvenementTAFCahierDeTextes.ajouterLienKiosque,
										aTAF,
									);
								}
							: null,
					});
				},
				completerTAFEnCreation: _completerTAFEnCreation.bind(this),
				evenementMenuContextuelListeTAF:
					_evenementMenuContextuelListeTAF.bind(this),
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
			'<div style="height:100%" id="',
			this.getInstance(this.identListe).getNom(),
			'"></div>',
		);
		return H.join("");
	}
}
function _initialiserListe(aInstance) {
	const lColonnesCachees = [];
	if (!GApplication.parametresUtilisateur.get("avecGestionDesThemes")) {
		lColonnesCachees.push(DonneesListe_TAFsCDT.colonnes.themes);
	}
	aInstance.setOptionsListe({
		colonnes: [
			{
				id: DonneesListe_TAFsCDT.colonnes.description,
				taille: ObjetListe.initColonne(100, 100),
				titre: GTraductions.getValeur("CahierDeTexte.taf.DescriptionTAF"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.pourLe,
				taille: 80,
				titre: GTraductions.getValeur("CahierDeTexte.taf.PourLeTAF"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.aRendre,
				taille: 130,
				titre: GTraductions.getValeur("CahierDeTexte.taf.Rendu"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.themes,
				taille: 80,
				titre: GTraductions.getValeur("Themes"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.eleves,
				taille: 80,
				titre: GTraductions.getValeur("CahierDeTexte.taf.ElevesTAF"),
				hint: GTraductions.getValeur("CahierDeTexte.taf.ElevesTAFHint"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.docsJoints,
				taille: ObjetListe.initColonne(50, 100, 300),
				titre: GTraductions.getValeur("CahierDeTexte.taf.DJsTAF"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.duree,
				taille: 80,
				titre: GTraductions.getValeur("CahierDeTexte.taf.DureeTAF"),
				hint: GTraductions.getValeur("CahierDeTexte.taf.DureeTAFHint"),
			},
			{
				id: DonneesListe_TAFsCDT.colonnes.niveau,
				taille: 80,
				titre: GTraductions.getValeur("CahierDeTexte.taf.NiveauTAF"),
				hint: GTraductions.getValeur("CahierDeTexte.taf.NiveauTAFHint"),
			},
		],
		colonnesCachees: lColonnesCachees,
		listeCreations: DonneesListe_TAFsCDT.colonnes.description,
		avecLigneCreation: true,
		scrollHorizontal: true,
	});
	GEtatUtilisateur.setTriListe({
		liste: aInstance,
		tri: DonneesListe_TAFsCDT.colonnes.description,
	});
}
function _editerDate(aTAF) {
	const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Date, {
		pere: this,
		evenement: function (aGenreBouton, aDate) {
			if (aDate) {
				aTAF.PourLe = aDate;
				if (aTAF.Numero === null || aTAF.Numero === undefined) {
					aTAF.setEtat(EGenreEtat.Creation);
				} else {
					aTAF.setEtat(EGenreEtat.Modification);
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
					aTAF.executionQCM.setEtat(EGenreEtat.Modification);
				}
				this.setEtatSaisie(true);
				this.getInstance(this.identListe).actualiser(true);
			}
		},
	});
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
function _editerNiveauDifficulte(aTAF) {
	const lListeNiveaux = TypeNiveauDifficulteUtil.toListe(true);
	let lSelection = 0;
	lListeNiveaux.parcourir((D, aIndex) => {
		if (aTAF.niveauDifficulte === D.getGenre()) {
			lSelection = aIndex;
			return false;
		}
	});
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
		pere: this,
		evenement: function (aGenreBouton, aSelection) {
			if (aGenreBouton !== 1) {
				return;
			}
			aTAF.niveauDifficulte = lListeNiveaux.get(aSelection).getGenre();
			aTAF.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		},
		initialiser: function (aInstance) {
			const lParamsListe = {
				optionsListe: {
					hauteurAdapteContenu: true,
					hauteurMaxAdapteContenu: 300,
					skin: ObjetListe.skin.flatDesign,
				},
			};
			aInstance.setOptionsFenetre({
				titre: GTraductions.getValeur(
					"CahierDeTexte.taf.SelectionNiveauDifficulte",
				),
				largeur: 200,
				hauteur: null,
				listeBoutons: [
					GTraductions.getValeur("Annuler"),
					GTraductions.getValeur("Valider"),
				],
			});
			aInstance.paramsListe = lParamsListe;
		},
	}).setDonnees(
		new DonneesListe_NiveauxDifficulteTAF(lListeNiveaux),
		false,
		lSelection,
	);
}
function _completerTAFEnCreation(aTAF) {
	UtilitaireSaisieCDT.initTAF(aTAF, this.parametres.dateCreationTAF);
	aTAF.Matiere = this.parametres.cours.matiere;
}
function _creerTAF(aModele) {
	const lTAF = new ObjetElement("");
	lTAF.setEtat(EGenreEtat.Creation);
	_completerTAFEnCreation.call(this, lTAF);
	lTAF.descriptif = "<div>" + (aModele ? aModele.getLibelle() : "") + "</div>";
	return lTAF;
}
function _ajouterNouveauTAF(aTAF) {
	aTAF.Matiere = this.parametres.cours.matiere;
	this.parametres.listeTAFs.addElement(aTAF);
	this.setEtatSaisie(true);
	const lListe = this.getInstance(this.identListe);
	lListe.actualiser();
	const lListeSelections = new ObjetListeElements().addElement(aTAF);
	lListe.setListeElementsSelection(lListeSelections, {
		instancesIdentiques: true,
	});
}
function _editerARendre(aTAF) {
	const lListeRenduTAFs = TypeGenreRenduTAFUtil.toListe([
		TypeGenreRenduTAF.GRTAF_RenduKiosque,
	]);
	let lSelection = 0;
	lListeRenduTAFs.parcourir((D, aIndex) => {
		if (aTAF.genreRendu === D.getGenre()) {
			lSelection = aIndex;
			return false;
		}
	});
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Liste, {
		pere: this,
		evenement(aGenreBouton, aSelection) {
			if (aGenreBouton !== 1) {
				return;
			}
			aTAF.genreRendu = lListeRenduTAFs.get(aSelection).getGenre();
			aTAF.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
			this.getInstance(this.identListe).actualiser(true);
		},
		initialiser(aInstance) {
			const lParamsListe = {
				optionsListe: {
					hauteurAdapteContenu: true,
					hauteurMaxAdapteContenu: 300,
					skin: ObjetListe.skin.flatDesign,
				},
			};
			aInstance.setOptionsFenetre({
				titre: GTraductions.getValeur("CahierDeTexte.taf.Rendu"),
				largeur: 460,
				hauteur: null,
				listeBoutons: [
					GTraductions.getValeur("Annuler"),
					GTraductions.getValeur("Valider"),
				],
			});
			aInstance.paramsListe = lParamsListe;
		},
	}).setDonnees(
		new DonneesListe_ModesRenduTAF(lListeRenduTAFs),
		false,
		lSelection,
	);
}
function _evenementSurListe(aParametres) {
	switch (aParametres.genreEvenement) {
		case EGenreEvenementListe.Edition:
			switch (aParametres.idColonne) {
				case DonneesListe_TAFsCDT.colonnes.description:
					this.callback.appel(
						EGenreEvenementTAFCahierDeTextes.fenetreEditeurHTML,
						aParametres.article,
					);
					break;
				case DonneesListe_TAFsCDT.colonnes.pourLe:
					_editerDate.call(this, aParametres.article);
					break;
				case DonneesListe_TAFsCDT.colonnes.themes: {
					const lListeThemeOriginaux = new ObjetListeElements();
					if (
						!!aParametres.article.ListeThemes &&
						aParametres.article.ListeThemes.count()
					) {
						aParametres.article.ListeThemes.parcourir((aTheme) => {
							aTheme.cmsActif = true;
							lListeThemeOriginaux.add(MethodesObjet.dupliquer(aTheme));
						});
					}
					new ObjetRequeteListeTousLesThemes(
						this,
						_ouvrirFenetreThemes.bind(
							this,
							aParametres.article,
							lListeThemeOriginaux,
						),
					).lancerRequete();
					break;
				}
				case DonneesListe_TAFsCDT.colonnes.eleves:
					UtilitaireSaisieCDT.choisirElevesTAF({
						instance: this,
						element: aParametres.article,
						listeTousEleves: this.parametres.listeTousEleves,
						callback: function () {
							this.setEtatSaisie(true);
							this.getInstance(this.identListe).actualiser(true);
						}.bind(this),
					});
					break;
				case DonneesListe_TAFsCDT.colonnes.niveau:
					_editerNiveauDifficulte.call(this, aParametres.article);
					break;
				case DonneesListe_TAFsCDT.colonnes.aRendre:
					_editerARendre.call(this, aParametres.article);
					break;
				default:
			}
			break;
	}
}
function _evenementSurFenetreRessourceKiosque(aParams) {
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
		const lTAF = _creerTAF.call(this);
		lTAF.setEtat(EGenreEtat.Creation);
		$.extend(lTAF, {
			descriptif: lElmPanierKiosque.ressource.getLibelle(),
			PourLe: this.parametres.dateCreationTAF,
			listeEleves: new ObjetListeElements(),
			estPourTous: true,
			ListePieceJointe: new ObjetListeElements(),
			genreRendu: TypeGenreRenduTAF.GRTAF_RenduKiosque,
			ressource: lElmPanierKiosque.ressource,
		});
		_ajouterNouveauTAF.call(this, lTAF);
	}
}
function creerTAFDeTypeQCM(aAvecDevoirAssocie, aAvecEvaluationAssociee) {
	if (aAvecDevoirAssocie || aAvecEvaluationAssociee) {
		creerTAFDeTypeQCMChoixService.call(this, aAvecEvaluationAssociee);
	} else {
		creerTAFDeTypeQCMCDT.call(this);
	}
}
function creerTAFDeTypeQCMChoixService(aAvecEvaluationAssociee) {
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
	ObjetFenetre_SelectionQCMServicePeriode.ouvrir(lParams).then((aParams) => {
		if (
			!!aParams.valider &&
			!!aParams.qcm &&
			!!aParams.service &&
			!!aParams.periode
		) {
			let lTAF;
			if (!aParams.pourEvaluation) {
				lTAF = UtilitaireSaisieCDT.creerTAFAvecQCMAvecDevoir(aParams);
			} else {
				lTAF = UtilitaireSaisieCDT.creerTAFAvecQCMAvecEvaluation(aParams);
			}
			if (!!lTAF) {
				_ajouterNouveauTAF.call(lThis, lTAF);
			}
		}
	});
}
function creerTAFDeTypeQCMCDT() {
	const lThis = this;
	UtilitaireSaisieCDT.choisirQCM({
		instance: lThis,
		paramsRequete: { pourEvaluation: false },
	}).then((aParamQCM) => {
		if (aParamQCM.eltQCM) {
			const lTAF = UtilitaireSaisieCDT.creerTAFAvecQCM({
				qcm: aParamQCM.eltQCM,
				dateCreationTAF: lThis.parametres.dateCreationTAF,
				dateFinCours: lThis.parametres.dateFinCours,
				cours: lThis.parametres.cours,
				numeroSemaine: lThis.parametres.numeroSemaine,
			});
			if (!!lTAF) {
				_ajouterNouveauTAF.call(lThis, lTAF);
			}
		}
	});
}
function _evenementMenuContextuelListeTAF(aDonnees, aParametresListe) {
	const lThis = this;
	let lTAF = aDonnees.element;
	const lListe = this.getInstance(this.identListe);
	switch (aDonnees.genre) {
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.SaisirTravail:
			lTAF = _creerTAF.call(this);
			this.parametres.afficherFenetreHtml("", (aDescriptif) => {
				if (TinyInit.estContenuVide(aDescriptif)) {
					return;
				}
				lTAF.descriptif = aDescriptif;
				_ajouterNouveauTAF.call(lThis, lTAF);
			});
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.ListeModeles:
			aParametresListe.avecActualisation = false;
			lTAF = _creerTAF.call(this, aDonnees.data.modele);
			_ajouterNouveauTAF.call(this, lTAF);
			if (
				!GApplication.parametresUtilisateur.get("CDT.TAF.ActiverMiseEnForme")
			) {
				lListe.demarrerEditionSurCellule(
					lListe.getSelection(),
					lListe.getNumeroColonneDIdColonne(
						DonneesListe_TAFsCDT.colonnes.description,
					),
				);
			} else {
				this.parametres.afficherFenetreHtml(lTAF.descriptif, (aDescriptif) => {
					if (TinyInit.estContenuVide(aDescriptif)) {
						return;
					}
					lTAF.descriptif = aDescriptif;
					lThis.actualiser();
				});
			}
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.EnrichirListe:
			ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ModeleTravailAFaire, {
				pere: this,
			}).setDonnees(this.parametres.listeModeles);
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.QCM:
			creerTAFDeTypeQCM.call(this, false, false);
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.QCMAvecDevoir:
			if (this.parametres.avecQCMDevoir) {
				creerTAFDeTypeQCM.call(this, true, false);
			} else {
			}
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.QCMAvecEvaluation:
			if (this.parametres.avecQCMEvaluation) {
				creerTAFDeTypeQCM.call(this, false, true);
			} else {
			}
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.DevoirKiosque: {
			const lFenetre = ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_PanierRessourceKiosque,
				{ pere: lThis, evenement: _evenementSurFenetreRessourceKiosque },
			);
			const lGenresApi = new TypeEnsembleNombre();
			lGenresApi.add(TypeGenreApiKiosque.Api_RenduPJTAF);
			lFenetre.afficherFenetre(lGenresApi);
			break;
		}
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.ParametrageQCM:
			if (
				!!lTAF.executionQCM &&
				lTAF.executionQCM.getEtat() === EGenreEtat.Creation
			) {
				if (!lTAF.estPourTous && lTAF.listeEleves && lTAF.listeEleves.count()) {
					lTAF.executionQCM.listeElevesTAF = lTAF.listeEleves;
				} else {
					lTAF.executionQCM.listeElevesTAF = undefined;
					lTAF.executionQCM.cours = lThis.parametres.cours;
					lTAF.executionQCM.numeroSemaine = lThis.parametres.numeroSemaine;
				}
			}
			ouvrirFenetreParamExecutionQCM(
				this,
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
								TypeModeCorrectionQCM.FBQ_CorrigeSans;
						}
						lTAF.executionQCM.setEtat(EGenreEtat.Modification);
						lTAF.setEtat(EGenreEtat.Modification);
						lThis.actualiser();
						lThis.setEtatSaisie(true);
					}
				},
				{
					titre: GTraductions.getValeur("CahierDeTexte.ParametresExeQCMTAF"),
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
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.SupprimerDJ:
			aDonnees.data.setEtat(EGenreEtat.Suppression);
			lTAF.setEtat(EGenreEtat.Modification);
			this.setEtatSaisie(true);
			break;
		case DonneesListe_TAFsCDT.menuContextuelListeTAFs.DevoirAssocieQCM:
			if (!!lTAF.devoirAssocieQCM) {
			}
			break;
		default:
	}
}
function ouvrirFenetreParamExecutionQCM(
	aPere,
	aEvenement,
	aOptionsFenetre,
	aDonnees,
) {
	const lOptionsFenetre = $.extend(
		{
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		},
		aOptionsFenetre,
	);
	if (!IE.estMobile) {
		lOptionsFenetre.largeur = 540;
	}
	const lFenetre = ObjetFenetre.creerInstanceFenetre(
		ObjetFenetre_ParamExecutionQCM,
		{ pere: aPere, evenement: aEvenement },
		lOptionsFenetre,
	);
	lFenetre.setDonnees($.extend(aDonnees, { afficherEnModeForm: IE.estMobile }));
}
function _ouvrirFenetreThemes(aTAF, aListeSelection, aJSON) {
	let lListeThemes = MethodesObjet.dupliquer(aJSON.listeTousLesThemes);
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
		lListeThemes = new ObjetListeElements();
	}
	const lFenetre = ObjetFenetre.creerInstanceFenetre(ObjetFenetre_ListeThemes, {
		pere: this,
		evenement: function (aGenreBouton, aChangementListe) {
			lFenetre.fermer();
			if (aGenreBouton === 1) {
				const lListeActif = aChangementListe.getListeElements((aElement) => {
					return aElement.cmsActif;
				});
				aTAF.ListeThemes = lListeActif;
				aTAF.setEtat(EGenreEtat.Modification);
				this.setEtatSaisie(true);
				this.getInstance(this.identListe).actualiser(true);
			}
		},
	});
	lFenetre.setDonnees({
		listeThemes: lListeThemes,
		matiereContexte: aTAF.Matiere || aJSON.matiereNonDesignee,
		listeMatieres: aJSON.listeMatieres,
		tailleLibelleTheme: aJSON.tailleLibelleTheme,
		libelleCB: aTAF.libelleCBTheme,
		matiereNonDesignee: aJSON.matiereNonDesignee,
	});
}
class DonneesListe_ModesRenduTAF extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
}
class DonneesListe_NiveauxDifficulteTAF extends ObjetDonneesListeFlatDesign {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecBoutonActionLigne: false, avecEvnt_Selection: true });
	}
}
module.exports = { InterfaceListeTAFsCDT, EGenreEvenementTAFCahierDeTextes };
