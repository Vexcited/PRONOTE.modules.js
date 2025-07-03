exports.UtilitaireActiviteTAFPP = exports.EGenreEvntMenuCtxActiviteTAFPP =
	void 0;
const AccessApp_1 = require("AccessApp");
const ObjetListeElements_1 = require("ObjetListeElements");
const MethodesTableau_1 = require("MethodesTableau");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetElement_1 = require("ObjetElement");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetTri_1 = require("ObjetTri");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreTravailAFaire_1 = require("TypeGenreTravailAFaire");
const TypeChaineHtml_1 = require("TypeChaineHtml");
const CollectionRequetes_1 = require("CollectionRequetes");
const SerialiserQCM_PN_1 = require("SerialiserQCM_PN");
const Enumere_Bloc_1 = require("Enumere_Bloc");
const TypeGenreRenduTAF_1 = require("TypeGenreRenduTAF");
const Enumere_Activites_Tvx_1 = require("Enumere_Activites_Tvx");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const DonneesListe_SelectClassesMN_1 = require("DonneesListe_SelectClassesMN");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_SelectElevesTAF_Prim_1 = require("DonneesListe_SelectElevesTAF_Prim");
const UtilitaireQCM_1 = require("UtilitaireQCM");
const UtilitaireSaisieCDT_1 = require("UtilitaireSaisieCDT");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const UtilitaireGestionCloudEtPDF_1 = require("UtilitaireGestionCloudEtPDF");
const ObjetFenetre_FichiersCloud_1 = require("ObjetFenetre_FichiersCloud");
const ObjetFenetre_Liste_1 = require("ObjetFenetre_Liste");
const ObjetFenetre_PieceJointe_1 = require("ObjetFenetre_PieceJointe");
const ObjetFenetre_ParamExecutionQCM_1 = require("ObjetFenetre_ParamExecutionQCM");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteSaisieEvenementRappel_1 = require("ObjetRequeteSaisieEvenementRappel");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
class ObjetRequeteSaisieTAF extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire("SaisieTAF", ObjetRequeteSaisieTAF);
var EGenreEvntMenuCtxActiviteTAFPP;
(function (EGenreEvntMenuCtxActiviteTAFPP) {
	EGenreEvntMenuCtxActiviteTAFPP[
		(EGenreEvntMenuCtxActiviteTAFPP["creerActivite"] = 1)
	] = "creerActivite";
	EGenreEvntMenuCtxActiviteTAFPP[
		(EGenreEvntMenuCtxActiviteTAFPP["editerActivite"] = 2)
	] = "editerActivite";
	EGenreEvntMenuCtxActiviteTAFPP[
		(EGenreEvntMenuCtxActiviteTAFPP["supprimerActivite"] = 3)
	] = "supprimerActivite";
	EGenreEvntMenuCtxActiviteTAFPP[
		(EGenreEvntMenuCtxActiviteTAFPP["creerRappel"] = 4)
	] = "creerRappel";
	EGenreEvntMenuCtxActiviteTAFPP[
		(EGenreEvntMenuCtxActiviteTAFPP["editerRappel"] = 5)
	] = "editerRappel";
	EGenreEvntMenuCtxActiviteTAFPP[
		(EGenreEvntMenuCtxActiviteTAFPP["supprimerRappel"] = 6)
	] = "supprimerRappel";
})(
	EGenreEvntMenuCtxActiviteTAFPP ||
		(exports.EGenreEvntMenuCtxActiviteTAFPP = EGenreEvntMenuCtxActiviteTAFPP =
			{}),
);
exports.UtilitaireActiviteTAFPP = {
	getListeElevesPourRessources(
		aListeEleves,
		aArrayClasses,
		aTousLesElevesPotentiel = false,
	) {
		return _getListeElevesPourRessources(
			aListeEleves,
			aArrayClasses,
			aTousLesElevesPotentiel,
		);
	},
	recupererElementsElevesSelectionnesPourChips(aActivite, aListeEleves) {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		const lNombreTotal = aActivite.eleves.count();
		const lNombreMax = 5;
		let iCount = 0;
		let iNbrChipsEleves = 0;
		const lArrNrClassesFait = [];
		let iEleve, lEleve, lEleveDeListe;
		const lListeElementAAfficher =
			new ObjetListeElements_1.ObjetListeElements();
		for (iEleve = 0; iEleve < lNombreTotal; iEleve++) {
			if (iCount < lNombreMax) {
				lEleve = aActivite.eleves.get(iEleve);
				lEleveDeListe = aListeEleves.getElementParNumeroEtGenre(
					lEleve.getNumero(),
					lEleve.getGenre(),
				);
				if (lEleve.existe()) {
					if (!!lEleveDeListe && !!lEleveDeListe.pere) {
						if (lEleveDeListe.pere.pourTous) {
							if (!lArrNrClassesFait.includes(lEleveDeListe.pere.getNumero())) {
								lListeElementAAfficher.addElement(lEleveDeListe.pere);
								lArrNrClassesFait.push(lEleveDeListe.pere.getNumero());
							}
						} else {
							iNbrChipsEleves++;
						}
					}
				}
			}
		}
		for (iEleve = 0; iEleve < lNombreTotal && iCount < lNombreMax; iEleve++) {
			lEleve = aActivite.eleves.get(iEleve);
			lEleveDeListe = aListeEleves.getElementParNumeroEtGenre(
				lEleve.getNumero(),
				lEleve.getGenre(),
			);
			if (
				lEleve.existe() &&
				!!lEleveDeListe &&
				!!lEleveDeListe.pere &&
				!lEleveDeListe.pere.pourTous
			) {
				iCount++;
				lListeElementAAfficher.addElement(lEleve);
			}
		}
		if (iNbrChipsEleves > lNombreMax) {
			const lElement = ObjetElement_1.ObjetElement.create();
			lElement.setLibelle("...");
			lElement.sansSuppression = true;
			lElement.title = ObjetTraduction_1.GTraductions.getValeur(
				"CahierDeTexte.TAF.xAutresEleves",
				[iNbrChipsEleves - lNombreMax],
			);
			lListeElementAAfficher.addElement(lElement);
		}
		if (
			aActivite.classeMN &&
			aActivite.classeMN.classes &&
			aActivite.classeMN.classes.count() === lArrNrClassesFait.length
		) {
			lResult.addElement(aActivite.classeMN);
		} else if (
			!!aActivite.classes &&
			aActivite.classes.count() === 1 &&
			aActivite.classes.getGenre(0) ===
				Enumere_Ressource_1.EGenreRessource.Groupe &&
			!!aActivite.classes.get(0).listeComposantes &&
			aActivite.classes.get(0).listeComposantes.count() ===
				lArrNrClassesFait.length
		) {
			lResult.addElement(aActivite.classes.get(0));
		} else {
			lResult = lListeElementAAfficher;
		}
		return lResult;
	},
	getListeElevePourSelection(aActivite) {
		return _getListeElevePourSelection(aActivite);
	},
	getClassesMN(aParams) {
		let lResult;
		if (
			aParams.ressource &&
			(aParams.ressource.dansRegroupement || aParams.ressource.estClasseMN)
		) {
			const lListeClasse = (0, AccessApp_1.getApp)()
				.getEtatUtilisateur()
				.getListeClasses({
					avecClasse: true,
					avecGroupe: true,
					avecClasseMultiNiveau: true,
					sansClasseDeRegroupement: false,
					uniquementClassePrincipal: false,
					uniquementClasseEnseignee: true,
				});
			for (let i = 0; i < lListeClasse.count() && lResult === undefined; i++) {
				const lClasse = lListeClasse.get(i);
				if (
					lClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe &&
					lClasse.listeComposantes
				) {
					const lIndiceRessource =
						lClasse.listeComposantes.getIndiceElementParFiltre((aElement) => {
							return aParams.ressource.getNumero() === aElement.getNumero();
						});
					if (
						lIndiceRessource > -1 ||
						aParams.ressource.getNumero() === lClasse.getNumero()
					) {
						lResult = ObjetElement_1.ObjetElement.create({
							Libelle: lClasse.getLibelle(),
							Numero: lClasse.getNumero(),
							Genre: lClasse.getGenre(),
							classes: new ObjetListeElements_1.ObjetListeElements(),
						});
						for (
							let iClasse = 0;
							iClasse < lClasse.listeComposantes.count();
							iClasse++
						) {
							const lElement = lClasse.listeComposantes.get(iClasse);
							lResult.classes.addElement(
								new ObjetElement_1.ObjetElement(
									lElement.getLibelle(),
									lElement.getNumero(),
									lElement.getGenre(),
								),
							);
						}
					}
				}
			}
		}
		return lResult;
	},
	creerNouvelleActivite(aParams) {
		const lActivite = ObjetElement_1.ObjetElement.create();
		lActivite.Genre = aParams.genre;
		lActivite.consigne = "";
		lActivite.DateDebut = aParams.date;
		lActivite.donneLe = ObjetDate_1.GDate.aujourdhui;
		lActivite.genreBloc = Enumere_Bloc_1.EGenreBloc.Activite_Prim;
		lActivite.pourTous = true;
		lActivite.editable = true;
		lActivite.documents = new ObjetListeElements_1.ObjetListeElements();
		lActivite.classes = new ObjetListeElements_1.ObjetListeElements();
		lActivite.classes.addElement(aParams.ressource);
		lActivite.classeMN = this.getClassesMN(aParams);
		lActivite.eleves = new ObjetListeElements_1.ObjetListeElements();
		lActivite.tousElevesDesRessourcesALaDate =
			new ObjetListeElements_1.ObjetListeElements();
		lActivite.elevesPotentiel = new ObjetListeElements_1.ObjetListeElements();
		lActivite.genreRendu =
			TypeGenreRenduTAF_1.TypeGenreRenduTAF.GRTAF_AucunRendu;
		lActivite.matiere = aParams.matiere;
		if (aParams.QCM) {
			this.associerQCMAActivite({ activite: lActivite, eltQCM: aParams.QCM });
		}
		return lActivite;
	},
	creerNouveauRappel(aParam) {
		const lEvenementRappel = ObjetElement_1.ObjetElement.create();
		lEvenementRappel.DateDebut = !!aParam.date
			? aParam.date
			: ObjetDate_1.GDate.getDateJour();
		lEvenementRappel.description = "";
		lEvenementRappel.titre = "";
		lEvenementRappel.classes = new ObjetListeElements_1.ObjetListeElements();
		lEvenementRappel.classes.addElement(aParam.ressource);
		lEvenementRappel.classeMN = this.getClassesMN(aParam);
		lEvenementRappel.eleves = new ObjetListeElements_1.ObjetListeElements();
		lEvenementRappel.tousElevesDesRessourcesALaDate =
			new ObjetListeElements_1.ObjetListeElements();
		lEvenementRappel.elevesPotentiel =
			new ObjetListeElements_1.ObjetListeElements();
		return lEvenementRappel;
	},
	initFenetreSelectionQCM(aInstance) {
		UtilitaireQCM_1.UtilitaireQCM.initFenetreSelectionQCM(aInstance);
		aInstance.setGenreRessources({
			genreQCM: Enumere_Ressource_1.EGenreRessource.QCM,
			genreNiveau: Enumere_Ressource_1.EGenreRessource.Niveau,
			genreMatiere: Enumere_Ressource_1.EGenreRessource.Matiere,
			genreAucun: Enumere_Ressource_1.EGenreRessource.Aucune,
		});
	},
	associerQCMAActivite(aParam) {
		let lActivite = aParam.activite;
		let lEltQCM = aParam.eltQCM;
		UtilitaireQCM_1.UtilitaireQCM.surSelectionQCM(lActivite, lEltQCM, {
			genreAucune: Enumere_Ressource_1.EGenreRessource.Aucune,
			genreExecQCM: Enumere_Ressource_1.EGenreRessource.ExecutionQCM,
		});
		const lObjInitDateQCM = this.initHeureDebutEtFin(lActivite);
		$.extend(lActivite.executionQCM, {
			estLieADevoir: false,
			estLieAEvaluation: false,
			estUnTAF: true,
			estUneActivite:
				lActivite.getGenre() ===
				TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite,
			dateDebutPublication: lObjInitDateQCM.dateDebut,
			dateFinPublication: lObjInitDateQCM.dateFin,
		});
		UtilitaireQCM_1.UtilitaireQCM.verifierDateCorrection(
			lActivite.executionQCM,
		);
	},
	initHeureDebutEtFin(aActivite) {
		const lObjInitDateQCM = UtilitaireQCM_1.UtilitaireQCM.initHeureDebutEtFin(
			aActivite.DateDebut,
		);
		const lDateDebutPub = aActivite.donneLe
			? new Date(
					aActivite.donneLe.getFullYear(),
					aActivite.donneLe.getMonth(),
					aActivite.donneLe.getDate(),
					0,
					0,
				)
			: lObjInitDateQCM.dateDebut;
		const lDateFinPub = aActivite.DateDebut
			? new Date(
					aActivite.DateDebut.getFullYear(),
					aActivite.DateDebut.getMonth(),
					aActivite.DateDebut.getDate(),
					23,
					59,
				)
			: lObjInitDateQCM.dateFin;
		return { dateDebut: lDateDebutPub, dateFin: lDateFinPub };
	},
	requeteSaisieRappel(aArticle, aParam) {
		if (aArticle.classes) {
			aArticle.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		if (aArticle.eleves) {
			aArticle.eleves.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		const lJSON = aArticle.toJSONAll();
		return new ObjetRequeteSaisieEvenementRappel_1.ObjetRequeteSaisieEvenementRappel(
			this,
		)
			.lancerRequete({ evenementRappel: lJSON })
			.catch(() => {
				IE.log.addLog("Erreur saisie EvenementRappel");
			})
			.then(() => {
				if (aParam.callback) {
					aParam.callback.call(this, aParam.donneesCallback);
				}
			});
	},
	requeteSaisie(aActivite, aParam) {
		if (aActivite.documents) {
			aActivite.documents.setSerialisateurJSON({
				methodeSerialisation: _surValidation_Fichier.bind(
					this,
					aParam.listeDocuments,
				),
			});
		}
		if (aActivite.classes) {
			aActivite.classes.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		if (aActivite.eleves) {
			aActivite.eleves.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		aActivite.consigne = new TypeChaineHtml_1.TypeChaineHtml(
			aActivite.consigne,
		);
		const lJSON = aActivite.toJSONAll();
		if (aActivite.executionQCM && aActivite.executionQCM.pourValidation()) {
			lJSON.executionQCM = aActivite.executionQCM.toJSON();
			new SerialiserQCM_PN_1.SerialiserQCM_PN().executionQCM(
				aActivite.executionQCM,
				lJSON.executionQCM,
			);
		}
		const lOjbJSON = { activite: lJSON };
		if (aParam.listeDocuments) {
			lOjbJSON.ListeFichiers = aParam.listeDocuments.setSerialisateurJSON({
				methodeSerialisation: _surValidation_Fichier.bind(this, null),
			});
		}
		return new ObjetRequeteSaisieTAF(this)
			.addUpload({
				listeFichiers:
					aParam.listeFichiersCrees ||
					new ObjetListeElements_1.ObjetListeElements(),
				listeDJCloud:
					aParam.listeDocuments ||
					new ObjetListeElements_1.ObjetListeElements(),
			})
			.lancerRequete(lOjbJSON)
			.catch(() => {
				IE.log.addLog("Erreur saisie Activité");
			})
			.then(() => {
				if (aParam.callback) {
					aParam.callback.call(this, aParam.donneesCallback);
				}
			});
	},
	getInfosRendus(aParam) {
		let lNbEleves = 0;
		let lNbRendusEleve = 0;
		let lStrLienNombreRendus = "";
		const lActivite = aParam.activite;
		if (!!lActivite.eleves) {
			lNbEleves = lActivite.eleves.count();
			lNbRendusEleve = lActivite.eleves
				.getListeElements((aEleve) => {
					return (
						!!aEleve && aEleve.existe() && (aEleve.estRendu || aEleve.TAFFait)
					);
				})
				.count();
			if (
				TypeGenreRenduTAF_1.TypeGenreRenduTAFUtil.estUnRenduEnligne(
					lActivite.genreRendu,
					false,
				) &&
				aParam.tenirCompteRenduEnLigne
			) {
				lStrLienNombreRendus = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAF.RenduX/Y",
					[lNbRendusEleve, lNbEleves],
				);
			} else {
				lStrLienNombreRendus = ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAF.FaitX/Y",
					[lNbRendusEleve, lNbEleves],
				);
			}
			if (lNbEleves > 0) {
				if (aParam.avecLienPourVisuDetail) {
					lStrLienNombreRendus = IE.jsx.str(
						"a",
						{
							class: ["LienAccueil"],
							tabindex: "0",
							"aria-haspopup": "dialog",
							"ie-node": aParam.strControleVisuDetail,
							title: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.Titre",
							),
						},
						lStrLienNombreRendus,
					);
				} else if (aParam.avecBtnPourVisuDetail) {
					lStrLienNombreRendus = IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": aParam.strControleVisuDetail,
							class: ["themeBoutonNeutre"],
							title: ObjetTraduction_1.GTraductions.getValeur(
								"FenetreListeTAFFaits.Titre",
							),
						},
						"lStrLienNombreRendus",
					);
				}
			}
		}
		return {
			nbEleves: lNbEleves,
			nbRendusEleves: lNbRendusEleve,
			strLienNbrRendus: lStrLienNombreRendus,
		};
	},
	getArrayClasses(aActivite) {
		let lArrayClasses = [];
		const lClasse = !!aActivite.classes ? aActivite.classes.get(0) : null;
		if (
			aActivite.classes.count() === 1 &&
			lClasse.getGenre() === Enumere_Ressource_1.EGenreRessource.Groupe
		) {
			if (!!aActivite.classeMN) {
				lArrayClasses = aActivite.classeMN.classes.getTableauNumeros();
			} else if (!!lClasse && lClasse.listeComposantes) {
				lArrayClasses = lClasse.listeComposantes.getTableauNumeros();
			}
		} else {
			lArrayClasses = aActivite.classes.getTableauNumeros();
		}
		return lArrayClasses;
	},
	majElevesPotentiels(
		aActivite,
		aArrayClasses,
		aAvecTousElevesPotentiel = false,
	) {
		const lAvecTousElevesPotentiel =
			aAvecTousElevesPotentiel !== null &&
			aAvecTousElevesPotentiel !== undefined
				? aAvecTousElevesPotentiel
				: aActivite.getGenre() ===
					TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail;
		aActivite.elevesPotentiel = this.getListeElevesPourRessources(
			aActivite.tousElevesDesRessourcesALaDate,
			aArrayClasses,
			lAvecTousElevesPotentiel,
		);
	},
	verifierElevesConcernes(aActivite, aArrayClasses, aEstCreation) {
		if (aArrayClasses === undefined) {
			aArrayClasses = this.getArrayClasses(aActivite);
		}
		this.majElevesPotentiels(aActivite, aArrayClasses);
		if (
			(aEstCreation ||
				aActivite.getEtat() === Enumere_Etat_1.EGenreEtat.Creation ||
				aActivite.getEtat() === Enumere_Etat_1.EGenreEtat.Modification) &&
			(aActivite.getGenre() ===
				TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite ||
				!aActivite.eleves)
		) {
			aActivite.eleves = this.getListeElevesPourRessources(
				aActivite.tousElevesDesRessourcesALaDate,
				aArrayClasses,
			);
		}
	},
	miseAJourInfosEleves(
		aActivite,
		aTousLesElevesPotentiel,
		aAvecTousElevesPotentiels = false,
	) {
		aActivite.tousElevesDesRessourcesALaDate = aTousLesElevesPotentiel;
		let lArrayClasses = this.getArrayClasses(aActivite);
		this.majElevesPotentiels(
			aActivite,
			lArrayClasses,
			aAvecTousElevesPotentiels,
		);
		if (!aActivite.eleves || aActivite.eleves.count() === 0) {
			aActivite.eleves = aActivite.elevesPotentiel.getListeElements(
				(aElement) => {
					return aElement.estConcerne;
				},
			);
		}
	},
	getListePublicDeData(aActivite) {
		let lListePublic;
		if (
			aActivite.getGenre() ===
			TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail
		) {
			const lListeEleves = this.getListeElevePourSelection(aActivite);
			lListePublic = this.recupererElementsElevesSelectionnesPourChips(
				aActivite,
				lListeEleves,
			);
		} else {
			if (aActivite.classeMN) {
				lListePublic = aActivite.classes;
			}
		}
		return lListePublic;
	},
	toGenreActiviteTvx(aActivite) {
		let lResult =
			Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.getConsigneDeGenreTravailAFaire(
				aActivite.getGenre(),
			);
		if (aActivite.executionQCM) {
			lResult =
				Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.getQCMDeGenreTravailAFaire(
					aActivite.getGenre(),
				);
		} else if (aActivite.titreKiosque) {
			lResult =
				Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.getExerciceDeGenreTravailAFaire(
					aActivite.getGenre(),
				);
		}
		return lResult;
	},
	getTitreFenetreActivite(aGenreActivite, aEstCreation) {
		const lStrCreerActivite = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.AjouterActiviteEnClasse",
		);
		const lStrModifierActivite = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.ModifierActiviteEnClasse",
		);
		const lStrCreerTAF = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.AjouterTravailALaMaison",
		);
		const lStrModifierTAF = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.ModifierTravailALaMaison",
		);
		const lStrCasConsigne = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.SaisirConsigne",
		);
		const lStrCasQCM = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.enligne.qcm",
		);
		const lStrCasExNum = ObjetTraduction_1.GTraductions.getValeur(
			"CahierDeTexte.enligne.exerciceNumerique",
		);
		const lResult = [];
		const lEstActivite =
			Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.toGenreTravailAFaire(
				aGenreActivite,
			) === TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Activite;
		lResult.push(
			!!aEstCreation
				? lEstActivite
					? lStrCreerActivite
					: lStrCreerTAF
				: lEstActivite
					? lStrModifierActivite
					: lStrModifierTAF,
		);
		if (!!aEstCreation) {
			const lEstUnQCM =
				Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnQCM(
					aGenreActivite,
				);
			const lEstUnExNum =
				Enumere_Activites_Tvx_1.EGenreActivite_Tvx_Util.estUnExerciceNumerique(
					aGenreActivite,
				);
			lResult.push(
				lEstUnQCM ? lStrCasQCM : lEstUnExNum ? lStrCasExNum : lStrCasConsigne,
			);
		}
		return lResult.join(" - ");
	},
	initCmdCtxSaisieActivitesTvx(aParam) {
		let lMenu = aParam.menuCtx;
		let lClbck = aParam.clbck;
		let lDate = aParam.date;
		let lAvecKiosque = aParam.avecKiosque;
		if (aParam.avecRappels) {
			lMenu.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"EvenementRappel.TitreFenetre",
				),
				true,
				lClbck.bind(this, {
					date: lDate,
					cmd: null,
					cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerRappel,
				}),
				{ icon: "icon_bell" },
			);
		}
		if (!ObjetDate_1.GDate.estJourCourant(lDate)) {
			let lLibelleTitreTravailCeJour = IE.jsx.str(
				"span",
				{ class: ["iconic", "icon_home", "flex-contain", "flex-center"] },
				ObjetChaine_1.GChaine.insecable(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.TravailPourCeJour",
					),
				),
			);
			lMenu.addTitre(lLibelleTitreTravailCeJour);
			lMenu.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.SaisirConsigne",
				),
				true,
				lClbck.bind(this, {
					date: lDate,
					cmd: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Taf_Consigne,
					cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
				}),
				{},
			);
			if (
				(0, AccessApp_1.getApp)().droits.get(
					ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionQCM,
				)
			) {
				lMenu.add(
					ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.enligne.qcm"),
					true,
					lClbck.bind(this, {
						date: lDate,
						cmd: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Taf_QCM,
						cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
					}),
					{},
				);
			}
			if (lAvecKiosque) {
				lMenu.add(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.enligne.exerciceNumerique",
					),
					true,
					lClbck.bind(this, {
						date: lDate,
						cmd: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Taf_Exercice,
						cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
					}),
					{},
				);
			}
		}
		let lLibelleTitreActivite = IE.jsx.str(
			"span",
			{ class: ["iconic", "icon_ecole", "flex-contain", "flex-center"] },
			" ",
			ObjetChaine_1.GChaine.insecable(
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.ActiviteSurCeJour",
				),
			),
		);
		lMenu.addTitre(lLibelleTitreActivite);
		lMenu.add(
			ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.SaisirConsigne"),
			true,
			lClbck.bind(this, {
				date: lDate,
				cmd: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Act_Consigne,
				cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
			}),
			{},
		);
		if (
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionQCM,
			)
		) {
			lMenu.add(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.enligne.qcm"),
				true,
				lClbck.bind(this, {
					date: lDate,
					cmd: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Act_QCM,
					cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
				}),
				{},
			);
		}
		if (lAvecKiosque) {
			lMenu.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.enligne.exerciceNumerique",
				),
				true,
				lClbck.bind(this, {
					date: lDate,
					cmd: Enumere_Activites_Tvx_1.EGenreActivite_Tvx.ga_Act_Exercice,
					cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.creerActivite,
				}),
				{},
			);
		}
	},
	initCmdCtxRappel(aParam) {
		let lMenu = aParam.menuCtx;
		let lClbck = aParam.clbck;
		lMenu.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			true,
			lClbck.bind(this, {
				article: aParam.article,
				cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.editerRappel,
			}),
			{ icon: "icon_pencil" },
		);
		lMenu.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			true,
			lClbck.bind(this, {
				article: aParam.article,
				cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.supprimerRappel,
			}),
			{ icon: "icon_trash" },
		);
	},
	initCmdCtxActiviteTvx(aParam) {
		let lMenu = aParam.menuCtx;
		let lClbck = aParam.clbck;
		lMenu.add(
			ObjetTraduction_1.GTraductions.getValeur("Modifier"),
			true,
			lClbck.bind(this, {
				article: aParam.article,
				cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.editerActivite,
			}),
			{ icon: "icon_pencil" },
		);
		lMenu.add(
			ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
			true,
			lClbck.bind(this, {
				article: aParam.article,
				cmdMenuCtx: EGenreEvntMenuCtxActiviteTAFPP.supprimerActivite,
			}),
			{ icon: "icon_trash" },
		);
	},
	surCmdSupprimerActivite(aParam) {
		let lActivite = aParam.activite;
		if (lActivite && lActivite.existeNumero()) {
			GApplication.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.msgConfirmationSupprimerActivite",
					),
				})
				.then(function (aGenreAction) {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
						aParam.clbck();
					}
				});
		}
	},
	surCmdSupprimerRappel(aParam) {
		let lArticle = aParam.article;
		if (lArticle && lArticle.existeNumero()) {
			GApplication.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: ObjetTraduction_1.GTraductions.getValeur(
						"EvenementRappel.msgConfirmationSupprimer",
					),
				})
				.then(function (aGenreAction) {
					if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
						aParam.clbck();
					}
				});
		}
	},
	surEvntSelectDatePourLe(aParam) {
		let lActivite = aParam.activite;
		if (
			lActivite &&
			!ObjetDate_1.GDate.estDateEgale(lActivite.DateDebut, aParam.date)
		) {
			if (
				lActivite.getGenre() ===
					TypeGenreTravailAFaire_1.TypeGenreTravailAFaire.tGTAF_Travail &&
				ObjetDate_1.GDate.estJourCourant(aParam.date)
			) {
				GApplication.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.msgInformationImpossibleSaisirTAFsurAujourdhui",
						),
					})
					.then(() => {
						aParam.instanceSelectDate.setDonnees(lActivite.DateDebut);
					});
			} else {
				lActivite.DateDebut = aParam.date;
				if ("executionQCM" in lActivite && lActivite.executionQCM) {
					const lObjInitDateQCM = this.initHeureDebutEtFin(lActivite);
					lActivite.executionQCM.dateFinPublication = lObjInitDateQCM.dateFin;
					lActivite.executionQCM.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					if (
						lActivite.executionQCM.dateDebutPublication >
						lActivite.executionQCM.dateFinPublication
					) {
						lActivite.executionQCM.dateDebutPublication =
							lObjInitDateQCM.dateDebut;
					}
				}
				lActivite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			}
		}
	},
	getListeClassesDActivite(aParam) {
		let lListeClasses = new ObjetListeElements_1.ObjetListeElements();
		let lActivite = aParam.activite;
		let lClasseMN = lActivite.classeMN;
		if (!lClasseMN) {
			return;
		}
		let lClasses = lActivite.classes;
		const lPere = ObjetElement_1.ObjetElement.create({
			Libelle: lClasseMN.getLibelle(),
			Numero: lClasseMN.getNumero(),
			Genre: lClasseMN.getGenre(),
		});
		lPere.estUnDeploiement = true;
		lPere.estDeploye = true;
		lPere.cmsActif = !!lClasses.getElementParNumero(lPere.getNumero());
		lListeClasses.addElement(lPere);
		for (let iClasse = 0; iClasse < lClasseMN.classes.count(); iClasse++) {
			const lClasse = ObjetElement_1.ObjetElement.create({
				Libelle: lClasseMN.classes.getLibelle(iClasse),
				Numero: lClasseMN.classes.getNumero(iClasse),
				Genre: lClasseMN.classes.getGenre(iClasse),
			});
			lClasse.pere = lPere;
			lClasse.cmsActif =
				lPere.cmsActif || !!lClasses.getElementParNumero(lClasse.getNumero());
			lListeClasses.addElement(lClasse);
		}
		return lListeClasses;
	},
	ouvrirFenetreSelectionClasseGpe(aParam) {
		let lListeClasses = this.getListeClassesDActivite(aParam);
		let lActivite = aParam.activite;
		const lDonneesListe =
			new DonneesListe_SelectClassesMN_1.DonneesListe_SelectClassesMN(
				lListeClasses,
			);
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aNumeroBouton) {
					if (aNumeroBouton === 1 && lActivite) {
						const lClasses = lListeClasses.getListeElements((aElement) => {
							return !!aElement.cmsActif;
						});
						let lTabClassesSelection;
						const lEstSelectionClasseMN =
							lListeClasses.count() === lClasses.count();
						let lModifierActivite = false;
						if (
							lEstSelectionClasseMN &&
							lActivite.classes.getGenre(0) !==
								Enumere_Ressource_1.EGenreRessource.Groupe
						) {
							lActivite.classes = new ObjetListeElements_1.ObjetListeElements();
							lActivite.classes.addElement(lClasses.get(0));
							lTabClassesSelection = lClasses.getTableauNumeros();
							lModifierActivite = true;
						} else if (!lEstSelectionClasseMN) {
							const lTableauClassesActuelles =
								lActivite.classes.getTableauNumeros();
							lTabClassesSelection = lClasses.getTableauNumeros();
							const lTableauClassesIntersect =
								MethodesTableau_1.MethodesTableau.intersection(
									lTableauClassesActuelles,
									lTabClassesSelection,
								);
							if (
								lTableauClassesActuelles.length !==
									lTabClassesSelection.length ||
								lTableauClassesActuelles.length !==
									lTableauClassesIntersect.length
							) {
								lActivite.classes = lClasses;
								lModifierActivite = true;
							}
						}
						if (lModifierActivite) {
							lActivite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
							if (aParam.clbck !== null && aParam.clbck !== undefined) {
								aParam.clbck(lActivite, lTabClassesSelection);
							}
						}
					}
				},
				initialiser: function (aInstance) {
					const lParamsListe = {
						optionsListe: {
							skin: ObjetListe_1.ObjetListe.skin.flatDesign,
							hauteurAdapteContenu: true,
						},
					};
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAF.SelectionClasseGroupe",
						),
						largeur: 320,
						avecTailleSelonContenu: true,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
						modeActivationBtnValider:
							aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
					});
					aInstance.paramsListe = lParamsListe;
				},
			},
		).setDonnees(lDonneesListe);
	},
	ouvrirFenetreSelectionEleves(aParam) {
		const lDonneesListe =
			new DonneesListe_SelectElevesTAF_Prim_1.DonneesListe_SelectElevesTAF_Prim(
				aParam.listeEleves,
			);
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Liste_1.ObjetFenetre_Liste,
			{
				pere: this,
				evenement: function (aNumeroBouton) {
					if (aNumeroBouton === 1) {
						if (
							aParam.clbckSurValider !== null &&
							aParam.clbckSurValider !== undefined
						) {
							aParam.clbckSurValider();
						}
					} else {
						if (
							aParam.clbckSurAnnuler !== null &&
							aParam.clbckSurAnnuler !== undefined
						) {
							aParam.clbckSurAnnuler();
						}
					}
				},
				initialiser: function (aInstance) {
					const lParamsListe = {
						optionsListe: { skin: ObjetListe_1.ObjetListe.skin.flatDesign },
					};
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAF.SelectionEleves",
						),
						largeur: 350,
						hauteur: 500,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
						modeActivationBtnValider:
							aInstance.modeActivationBtnValider.auMoinsUnEltSelectionne,
					});
					aInstance.paramsListe = lParamsListe;
				},
			},
		).setDonnees(lDonneesListe);
	},
	miseAJourClassesConcerneesDepuisListeEleves(aParam) {
		let lArticle = aParam.article;
		let lRessourceMN = aParam.ressourceMN;
		let lElevesPotentielDesClasses = lArticle.elevesPotentiel;
		const lClassesConcernees = aParam.listeEleves.getListeElements(
			(aElement) => {
				return (
					!!aElement.estUnDeploiement &&
					!!aElement.cmsActif &&
					(!aParam.tenirComptePourTous || !!aElement.pourTous)
				);
			},
		);
		if (lClassesConcernees && lRessourceMN) {
			const lEstSelectionClasseMN = lRessourceMN.classes
				? lRessourceMN.classes.count() === lClassesConcernees.count()
				: false;
			if (
				lEstSelectionClasseMN &&
				(lArticle.classes.count() === 0 ||
					lArticle.classes.getGenre(0) !==
						Enumere_Ressource_1.EGenreRessource.Groupe)
			) {
				lArticle.classes = new ObjetListeElements_1.ObjetListeElements();
				const lGroupe = new ObjetElement_1.ObjetElement(
					lRessourceMN.getLibelle(),
					lRessourceMN.getNumero(),
					lRessourceMN.getGenre(),
				);
				lArticle.classes.addElement(lGroupe);
			} else if (!lEstSelectionClasseMN) {
				const lTableauClassesActuelles = lArticle.classes.getTableauNumeros();
				const lTableauClassesSelection = lClassesConcernees.getTableauNumeros();
				const lTableauClassesIntersect =
					MethodesTableau_1.MethodesTableau.intersection(
						lTableauClassesActuelles,
						lTableauClassesSelection,
					);
				if (
					lTableauClassesActuelles.length !== lTableauClassesSelection.length ||
					lTableauClassesActuelles.length !== lTableauClassesIntersect.length
				) {
					lArticle.classes = lClassesConcernees;
				}
				lElevesPotentielDesClasses = this.getListeElevesPourRessources(
					lArticle.elevesPotentiel,
					lTableauClassesSelection,
				);
			}
		}
		return lElevesPotentielDesClasses;
	},
	miseAJourElevesConcernes(aParam) {
		let lArticle = aParam.article;
		const lElevesConcernees = aParam.listeEleves.getListeElements(
			(aElement) => {
				return !!aElement.pere && !!aElement.cmsActif;
			},
		);
		lElevesConcernees.setTri([
			ObjetTri_1.ObjetTri.init(
				"Libelle",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		lElevesConcernees.trier();
		lArticle.elevesPotentiel.parcourir((aEleve) => {
			aEleve.estConcerne = !!lElevesConcernees.getElementParNumero(
				aEleve.getNumero(),
			);
		});
		const lPourTous =
			aParam.elevesPotentielDesClasses.count() === lElevesConcernees.count();
		lArticle.pourTous = lPourTous;
		lArticle.eleves = lElevesConcernees;
		lArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
	},
	verifierActiviteValide(aActivite) {
		let lResult = false;
		if (!!aActivite) {
			lResult =
				!!aActivite.matiere &&
				aActivite.matiere.existeNumero() &&
				(aActivite.consigne !== "" ||
					(!!aActivite.documents &&
						aActivite.documents.getNbrElementsExistes() > 0) ||
					!!aActivite.executionQCM ||
					!!aActivite.ressourceDataLien) &&
				aActivite.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun;
		}
		return lResult;
	},
	ouvrirModalitesExecQCMDActivite(aParam) {
		let lActivite = aParam.activite;
		if (
			!!lActivite &&
			!!lActivite.executionQCM &&
			lActivite.executionQCM.getEtat() === Enumere_Etat_1.EGenreEtat.Creation
		) {
			if (!lActivite.pourTous && lActivite.eleves && lActivite.eleves.count()) {
				lActivite.executionQCM.classes = undefined;
				lActivite.executionQCM.listeElevesTAF = lActivite.eleves;
				lActivite.executionQCM.listeElevesTAF.setSerialisateurJSON({
					ignorerEtatsElements: true,
				});
			} else {
				lActivite.executionQCM.listeElevesTAF = undefined;
				lActivite.executionQCM.classes = lActivite.classes;
				lActivite.executionQCM.classes.setSerialisateurJSON({
					ignorerEtatsElements: true,
				});
			}
		}
		this.ouvrirFenetreParamExecutionQCM(
			this,
			(aNumeroBouton, aExecutionQCM) => {
				lActivite.executionQCM = aExecutionQCM;
				if (aNumeroBouton > 0) {
					lActivite.executionQCM.setEtat(
						Enumere_Etat_1.EGenreEtat.Modification,
					);
					lActivite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				aParam.clbck();
			},
			{
				titre:
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.ParametresExeQCMTAF",
					) +
					(IE.estMobile
						? '<span role="doc-noteref" aria-label="' +
							ObjetTraduction_1.GTraductions.getValeur(
								"FenetreParamExecutionQCM.msgOptionsReduites",
							) +
							'" > *</span>'
						: ""),
			},
			{
				afficherModeQuestionnaire: false,
				afficherRessentiEleve: false,
				autoriserSansCorrige: false,
				autoriserCorrigerALaDate: true,
				executionQCM: lActivite.executionQCM,
				avecConsigne: true,
				avecPersonnalisationProjetAccompagnement: true,
				avecModeCorrigeALaDate: true,
				avecMultipleExecutions: true,
			},
		);
	},
	ouvrirFenetreParamExecutionQCM(aPere, aEvenement, aOptionsFenetre, aDonnees) {
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
			{ pere: aPere, evenement: aEvenement },
			lOptionsFenetre,
		);
		lFenetre.setDonnees(
			$.extend(aDonnees, { afficherEnModeForm: IE.estMobile }),
		);
	},
	ouvrirFenetrePJ(aParams) {
		const lParams = Object.assign(
			{
				instance: null,
				element: null,
				genrePJ: null,
				nodeFocus: null,
				listePJTot: null,
				listePJContexte: null,
				dateCours: null,
				validation: null,
				maxSize: null,
			},
			aParams,
		);
		let lAvecSaisie = false;
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_PieceJointe_1.ObjetFenetre_PieceJointe,
			{
				pere: lParams.instance,
				evenement: function (aNumeroBouton, aParamsFenetre) {
					const lListeFichiers = aParamsFenetre.instance.ListeFichiers;
					lParams.listePJTot.parcourir((aDocument) => {
						let lDocumentJoint = lParams.listePJContexte.getElementParNumero(
							aDocument.getNumero(),
						);
						const lActif = aDocument.Actif && aDocument.existe();
						if (lDocumentJoint) {
							const lChangementDoc =
								lDocumentJoint.getLibelle() !== aDocument.getLibelle() ||
								(lParams.genrePJ ===
									Enumere_DocumentJoint_1.EGenreDocumentJoint.Url &&
									lDocumentJoint.url !== aDocument.url);
							if (!lActif) {
								lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
								lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								lAvecSaisie = true;
							} else if (lChangementDoc) {
								lDocumentJoint.setLibelle(aDocument.getLibelle());
								lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								lAvecSaisie = true;
							}
						} else {
							if (lActif) {
								lDocumentJoint = new ObjetElement_1.ObjetElement(
									aDocument.getLibelle(),
									aDocument.getNumero(),
									aDocument.getGenre(),
								);
								lDocumentJoint.url = aDocument.url;
								lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
								lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
								lParams.listePJContexte.addElement(lDocumentJoint);
								lAvecSaisie = true;
							}
						}
					});
					lParams.listePJTot.trier();
					const lPromise = lParams.validation(
						aParamsFenetre,
						lListeFichiers,
						lAvecSaisie,
					);
					return (lPromise || Promise.resolve()).then(() => {
						if (lParams.nodeFocus) {
							ObjetHtml_1.GHtml.setFocus(lParams.nodeFocus, true);
						}
					});
				},
				initialiser: function (aInstance) {
					aInstance.setEtatSaisie = function (aEtatSaisie) {
						if (aEtatSaisie) {
							lAvecSaisie = true;
						}
					};
				},
			},
		).afficherFenetrePJ({
			listePJTot: lParams.listePJTot,
			listePJContexte: lParams.listePJContexte,
			genreFenetrePJ: -1,
			genrePJ: lParams.genrePJ,
			genreRessourcePJ: Enumere_Ressource_1.EGenreRessource.DocumentJoint,
			optionsSelecFile: { maxSize: lParams.maxSize },
			avecFiltre: { date: false, classeMatiere: false },
			dateCours: lParams.dateCours,
			modeFlat:
				lParams.genrePJ === Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
		});
	},
	ouvrirFenetreChoixRessourcePeda(aParam) {
		const lAvecCloud = GEtatUtilisateur.avecCloudDisponibles();
		const lAvecGestionAppareilPhoto =
			GEtatUtilisateur.avecGestionAppareilPhoto();
		const lParamSelectPJ = {
			instance: aParam.instance,
			element: aParam.activite,
			nodeFocus: aParam.nodeFocus,
			listePJTot: aParam.listePJTot,
			listePJContexte: aParam.activite.documents,
			validation: function (aParamsFenetre, aListeFichiers) {
				aParam.listeFichiersCrees.add(aListeFichiers);
			},
			maxSize: aParam.tailleMaxPJ,
		};
		UtilitaireSaisieCDT_1.UtilitaireSaisieCDT.ouvrirFenetreChoixAjoutPiecesJointes(
			{
				instance: aParam.instance,
				avecGestionAppareilPhoto: lAvecGestionAppareilPhoto,
				clbckPrendrePhoto: lAvecGestionAppareilPhoto
					? (aParametresInput) => {
							this.addFiles(aParametresInput, aParam);
						}
					: null,
				clbckOuvrirGalerie: lAvecGestionAppareilPhoto
					? (aParametresInput) => {
							this.addFiles(aParametresInput, aParam);
						}
					: null,
				callbackChoixParmiFichiersExistants: () => {
					this.ouvrirFenetrePJ(
						$.extend(lParamSelectPJ, {
							genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier,
						}),
					);
				},
				callbackChoixParmiLiensExistants: () => {
					this.ouvrirFenetrePJ(
						$.extend(lParamSelectPJ, {
							genrePJ: Enumere_DocumentJoint_1.EGenreDocumentJoint.Url,
						}),
					);
				},
				maxSizeNouvellePJ: aParam.tailleMaxPJ,
				avecUploadMultiple: true,
				callbackUploadNouvellePJ: (aParametresInput) => {
					this.addFiles(aParametresInput, aParam);
				},
				callbackChoixDepuisCloud: lAvecCloud
					? () => {
							let lParams = {
								callbaskEvenement(aLigne) {
									if (aLigne >= 0) {
										const lService = GEtatUtilisateur.listeCloud.get(aLigne);
										_choisirFichierCloud({
											instance: aParam.instance,
											element: aParam.activite,
											numeroService: lService.getGenre(),
											listeDocumentsJoints: aParam.listePJTot,
										});
									}
								},
								modeGestion:
									UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF
										.modeGestion.Cloud,
							};
							UtilitaireGestionCloudEtPDF_1.UtilitaireGestionCloudEtPDF.creerFenetreGestion(
								lParams,
							);
						}
					: null,
				callbackChoixDepuisCloudENEJ: GEtatUtilisateur.avecCloudENEJDisponible()
					? () => {
							const lService = GEtatUtilisateur.getCloudENEJ();
							_choisirFichierCloud({
								instance: aParam.instance,
								element: aParam.activite,
								numeroService: lService.getGenre(),
								listeDocumentsJoints: aParam.listePJTot,
							});
						}
					: null,
				callbackAjoutLienKiosque: aParam.callbackAjoutLienKiosque,
				callbackNouvelleURL: (aNouvelleURL) => {
					aParam.activite.documents.addElement(aNouvelleURL);
					aParam.listePJTot.addElement(aNouvelleURL);
					aParam.activite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				},
			},
		);
	},
	addFiles(aParametresInput, aParamCtx) {
		if (
			aParametresInput &&
			aParametresInput.listeFichiers &&
			aParametresInput.listeFichiers.count() > 0
		) {
			const lListePJContexte = aParamCtx.activite.documents;
			const lListePJTotal = aParamCtx.listePJTot;
			aParametresInput.listeFichiers.parcourir((aFichier) => {
				const lDocumentJoint = new ObjetElement_1.ObjetElement(
					aFichier.getLibelle(),
					aFichier.getNumero(),
					aFichier.getGenre(),
				);
				lDocumentJoint.url = aFichier.url;
				lDocumentJoint.Fichier = aFichier;
				lDocumentJoint.idFichier = aFichier.idFichier;
				lDocumentJoint.nomOriginal = aFichier.nomOriginal;
				lDocumentJoint.file = aFichier.file;
				lDocumentJoint.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				lListePJContexte.addElement(lDocumentJoint);
				lListePJTotal.addElement(lDocumentJoint);
			});
			aParamCtx.activite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			aParamCtx.listeFichiersCrees.add(aParametresInput.listeFichiers);
		}
	},
};
function _getListeElevesPourRessources(
	aListeEleves,
	aArrayClasses,
	aTousLesElevesPotentiel,
) {
	const lResult = new ObjetListeElements_1.ObjetListeElements();
	for (let iEleve = 0; iEleve < aListeEleves.count(); iEleve++) {
		const lEleve = aListeEleves.get(iEleve);
		const lEstConcerne = aArrayClasses.includes(lEleve.classe.getNumero());
		if (lEleve && lEleve.classe && (lEstConcerne || aTousLesElevesPotentiel)) {
			const lNewElement = ObjetElement_1.ObjetElement.create({
				Libelle: lEleve.getLibelle(),
				Numero: lEleve.getNumero(),
				Genre: lEleve.getGenre(),
			});
			lNewElement.classe = lEleve.classe;
			lNewElement.estConcerne = lEstConcerne;
			lResult.addElement(lNewElement);
		}
	}
	return lResult;
}
function _getListeElevePourSelection(aActivite) {
	const lResult = new ObjetListeElements_1.ObjetListeElements();
	if (
		aActivite.elevesPotentiel !== null &&
		aActivite.elevesPotentiel !== undefined
	) {
		aActivite.elevesPotentiel.setTri([
			ObjetTri_1.ObjetTri.init(
				"classe.Libelle",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
			ObjetTri_1.ObjetTri.init(
				"Libelle",
				Enumere_TriElement_1.EGenreTriElement.Croissant,
			),
		]);
		aActivite.elevesPotentiel.trier();
		let lPere;
		let iEleve, lEleve, lNewEleve;
		for (iEleve = 0; iEleve < aActivite.elevesPotentiel.count(); iEleve++) {
			lEleve = aActivite.elevesPotentiel.get(iEleve);
			lNewEleve = new ObjetElement_1.ObjetElement(
				lEleve.getLibelle(),
				lEleve.getNumero(),
				lEleve.getGenre(),
			);
			if (!lPere || !lPere.egalParNumeroEtGenre(lEleve.classe.getNumero())) {
				lPere = new ObjetElement_1.ObjetElement(
					lEleve.classe.getLibelle(),
					lEleve.classe.getNumero(),
					lEleve.classe.getGenre(),
				);
				lPere.estUnDeploiement = true;
				lPere.estDeploye = true;
				lPere.pourTous = true;
				lResult.addElement(lPere);
			}
			lNewEleve.pere = lPere;
			lNewEleve.cmsActif =
				lEleve.estConcerne &&
				(("pourTous" in aActivite && aActivite.pourTous) ||
					!!aActivite.eleves.getElementParNumero(lEleve.getNumero()));
			if (lNewEleve.cmsActif) {
				lPere.cmsActif = true;
			}
			if (lPere.pourTous) {
				lPere.pourTous = lNewEleve.cmsActif;
			}
			lResult.addElement(lNewEleve);
		}
	}
	return lResult;
}
function _surValidation_Fichier(aListeDocuments, aElement, aJSON) {
	let lElement;
	if (aListeDocuments) {
		lElement = aListeDocuments.getElementParNumero(aElement.getNumero());
	}
	if (aElement.Fichier) {
		aJSON.IDFichier = ObjetChaine_1.GChaine.cardinalToStr(
			aElement.Fichier.idFichier,
		);
	} else if (lElement && lElement.Fichier) {
		aJSON.IDFichier = ObjetChaine_1.GChaine.cardinalToStr(
			lElement.Fichier.idFichier,
		);
	} else if (aElement.idFichier) {
		aJSON.IDFichier = ObjetChaine_1.GChaine.cardinalToStr(aElement.idFichier);
	}
	if (aElement.url) {
		aJSON.url = aElement.url;
	}
	if (aElement.ressource) {
		aJSON.ressource = aElement.ressource;
	}
}
function _choisirFichierCloud(aParams) {
	const lParams = Object.assign(
		{
			instance: null,
			element: null,
			numeroService: -1,
			listeDocumentsJoints: null,
		},
		aParams,
	);
	return new Promise((aResolve) => {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_FichiersCloud_1.ObjetFenetre_FichiersCloud,
			{
				pere: lParams.instance,
				evenement(aParam) {
					if (
						aParam.listeNouveauxDocs &&
						aParam.listeNouveauxDocs.count() > 0
					) {
						lParams.element.documents.add(aParam.listeNouveauxDocs);
						lParams.listeDocumentsJoints.add(aParam.listeNouveauxDocs);
						lParams.element.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
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
		).setDonnees({ service: lParams.numeroService });
	});
}
