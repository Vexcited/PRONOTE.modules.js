exports.ObjetInterfaceFicheStage = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_DocumentJoint_1 = require("Enumere_DocumentJoint");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Espace_1 = require("Enumere_Espace");
const InterfaceFicheStageCP_1 = require("InterfaceFicheStageCP");
const InterfaceFicheStageCP_2 = require("InterfaceFicheStageCP");
const ObjetFenetre_SuiviStage_1 = require("ObjetFenetre_SuiviStage");
const ObjetListeElements_1 = require("ObjetListeElements");
const ControleSaisieEvenement_1 = require("ControleSaisieEvenement");
const ObjetElement_1 = require("ObjetElement");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetRequetePageStageGeneral_1 = require("ObjetRequetePageStageGeneral");
const ObjetRequetePageAppreciationFinDeStage_1 = require("ObjetRequetePageAppreciationFinDeStage");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const PageFicheStage_1 = require("PageFicheStage");
const ObjetRequeteSaisieAppreciationFinDeStage_1 = require("ObjetRequeteSaisieAppreciationFinDeStage");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
const UtilitaireRenseignementsEleve_1 = require("UtilitaireRenseignementsEleve");
const Enumere_EvntMenusDeroulants_1 = require("Enumere_EvntMenusDeroulants");
const ObjetListe_1 = require("ObjetListe");
const AccessApp_1 = require("AccessApp");
const ObjetFenetre_FicheEleve_1 = require("ObjetFenetre_FicheEleve");
class ObjetInterfaceFicheStage extends InterfaceFicheStageCP_1.ObjetInterfaceFicheStageCP {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.parametres = {
			avecEdition: false,
			avecEditionSuivisDeStage: false,
			tailleMaxPieceJointe: (0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
			),
		};
		this.genreOngletSelectionne =
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi;
		const lOnglet = this.etatUtilScoEspace.listeOnglets.getElementParGenre(
			this.etatUtilScoEspace.getGenreOnglet(),
		);
		if (lOnglet) {
			this.infosNotificationStage = this.etatUtilScoEspace.getInfosSupp(
				lOnglet.getLibelle(),
			);
			if (
				this.infosNotificationStage &&
				this.infosNotificationStage.genreAffichage !== undefined
			) {
				this.genreOngletSelectionne =
					this.infosNotificationStage.genreAffichage;
			}
		}
		const lOngletSuivi = new ObjetElement_1.ObjetElement(
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi,
			),
			null,
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi,
		);
		lOngletSuivi.icone = "icon_th_list";
		const lOngletDetails = new ObjetElement_1.ObjetElement(
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Details,
			),
			null,
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Details,
		);
		lOngletDetails.icone = "icon_entreprise";
		const lOngletAnnexe = new ObjetElement_1.ObjetElement(
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Annexe,
			),
			null,
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Annexe,
		);
		lOngletAnnexe.icone = "icon_details_seance";
		const lOngletAppreciations = new ObjetElement_1.ObjetElement(
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStageUtil.getTraductionOnglet(
				Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Appreciations,
			),
			null,
			Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Appreciations,
		);
		lOngletAppreciations.icone = "icon_post_it_rempli";
		this.listeOnglets = new ObjetListeElements_1.ObjetListeElements();
		this.listeOnglets.add(lOngletSuivi);
		this.listeOnglets.add(lOngletDetails);
		this.listeOnglets.add(lOngletAnnexe);
		this.listeOnglets.add(lOngletAppreciations);
	}
	creerInstancePage() {
		return this.add(
			PageFicheStage_1.PageFicheStage,
			this.surEvenementPageStage.bind(this),
		);
	}
	construireInstances() {
		super.construireInstances();
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Etablissement,
			].includes(this.etatUtilScoEspace.GenreEspace)
		) {
			this.IdentTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				this.evenementSurDernierMenuDeroulant,
				this.initialiserTripleCombo,
			);
			if (
				this.IdentTripleCombo !== null &&
				this.IdentTripleCombo !== undefined &&
				this.getInstance(this.IdentTripleCombo) !== null
			) {
				this.IdPremierElement = this.getInstance(
					this.IdentTripleCombo,
				).getPremierElement();
			}
		}
		if (
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur &&
			UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.avecPhotoEleve()
		) {
			this.identFenetreFicheEleve = this.add(
				ObjetFenetre_FicheEleve_1.ObjetFenetre_FicheEleve,
				null,
				UtilitaireRenseignementsEleve_1.UtilitaireFicheEleve.initFicheEleve,
			);
			if (
				UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.getClassFichePhotoEeve()
			) {
				this.identFichePhoto = this.add(
					UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.getClassFichePhotoEeve(),
				);
			}
		}
		this.getInstance(this.identListeOnglet).setOptionsListe({
			ariaLabel: () => {
				return this.getResumeOnglet();
			},
		});
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		if (
			this.etatUtilScoEspace.GenreEspace ===
			Enumere_Espace_1.EGenreEspace.Professeur
		) {
			this.AddSurZone.push({ separateur: true });
			if (
				UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.avecPhotoEleve()
			) {
				this.AddSurZone.push({
					html: UtilitaireRenseignementsEleve_1.UtilitaireFicheEleve.getHtmlBtnAfficherFicheEleve(
						this,
					),
				});
				this.AddSurZone.push({
					html: UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.getHtmlBtnAfficherPhotoEleve(
						this,
					),
				});
			}
		}
	}
	getResumeOnglet() {
		var _a;
		const T = [this.etatUtilScoEspace.getLibelleLongOnglet()];
		if (this.existeInstance(this.IdentTripleCombo)) {
			const lClasse = this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			if (lClasse) {
				T.push(lClasse.getLibelle());
			}
			const lEleve = this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Eleve,
			);
			if (lEleve) {
				T.push(lEleve.getLibelle());
			}
		}
		const lListe = this.getInstance(this.identCmbStage).getListeElements();
		if (this.stage && lListe) {
			T.push(
				(_a = lListe.getElementParNumero(this.stage.getNumero())) === null ||
					_a === void 0
					? void 0
					: _a.getLibelle(),
			);
		}
		return T.join(" ");
	}
	eventModeAffStage(aParam) {
		this.genreOngletSelectionne = aParam.article.getGenre();
		this.getInstance(this.identPageStage).setDonnees({
			stage: this.stage,
			pj: this.listeDocJointsStage,
			genreOnglet: this.genreOngletSelectionne,
			evenements: this.listeEvenementsSuiviStage,
			lieux: this.listeLieuxSuiviStage,
			listeSujetsStage: this.listeSujetsStage,
			dateFinSaisieSuivi: this.dateFinSaisieSuivi,
		});
	}
	recupererDonnees(...aParams) {
		this.setEtatSaisie(false);
		this.stage = undefined;
		switch (this.etatUtilScoEspace.GenreEspace) {
			case Enumere_Espace_1.EGenreEspace.Entreprise:
			case Enumere_Espace_1.EGenreEspace.Eleve:
			case Enumere_Espace_1.EGenreEspace.Parent:
				this.numeroEleve = this.etatUtilScoEspace.getMembre()
					? this.etatUtilScoEspace.getMembre().getNumero()
					: 0;
				new ObjetRequetePageStageGeneral_1.ObjetRequetePageStageGeneral(
					this,
					this.surListeStage.bind(this),
				).lancerRequete(this.numeroEleve);
				break;
			case Enumere_Espace_1.EGenreEspace.Professeur:
			case Enumere_Espace_1.EGenreEspace.Etablissement:
				if (this.numeroClasse && this.numeroEleve) {
					new ObjetRequetePageStageGeneral_1.ObjetRequetePageStageGeneral(
						this,
						this.surListeStage.bind(this),
					).lancerRequete(
						this.numeroEleve,
						this.etatUtilScoEspace.GenreEspace ===
							Enumere_Espace_1.EGenreEspace.Etablissement,
					);
				}
				break;
			default:
				break;
		}
	}
	valider() {
		const lListeFichiersUpload = new ObjetListeElements_1.ObjetListeElements();
		if (!!this.listeDocJointsStage) {
			lListeFichiersUpload.add(this.listeDocJointsStage);
		}
		if (!!this.listePJSuivis) {
			lListeFichiersUpload.add(this.listePJSuivis);
		}
		new ObjetRequeteSaisieAppreciationFinDeStage_1.ObjetRequeteSaisieAppreciationFinDeStage(
			this,
			this.surEvenementPageStage.bind(this),
		).addUpload({ listeFichiers: lListeFichiersUpload });
	}
	initialiserTripleCombo(aInstance) {
		aInstance.setParametres(
			[
				Enumere_Ressource_1.EGenreRessource.Classe,
				Enumere_Ressource_1.EGenreRessource.Eleve,
			],
			true,
		);
		aInstance.setEvenementMenusDeroulants(this.surEvntMenusDeroulants);
	}
	evenementSurDernierMenuDeroulant(aLigneClasse, aLignePeriode, aLigneEleve) {
		this.numeroClasse = !!aLigneClasse ? aLigneClasse.getNumero() : 0;
		this.numeroEleve = !!aLigneEleve ? aLigneEleve.getNumero() : 0;
		this.surSelectionEleve();
		this.recupererDonnees();
	}
	surEvntMenusDeroulants(aParam) {
		switch (aParam.genreEvenement) {
			case Enumere_EvntMenusDeroulants_1.EGenreEvntMenusDeroulants
				.ressourceNonTrouve:
				break;
		}
		if (aParam.genreCombo === Enumere_Ressource_1.EGenreRessource.Classe) {
			this.numeroEleve = 0;
			this.stage = undefined;
			this.getInstance(this.identCmbStage).setVisible(false);
			this.getInstance(this.identListeOnglet).setVisible(false);
			this.evenementAfficherMessage(
				this.getInstance(this.IdentTripleCombo).getMessageSelection(
					aParam.genreCombo,
				),
			);
		}
	}
	initCmbEtudiant(aCombo) {}
	evntCmbStage(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			const lThis = this;
			(0, ControleSaisieEvenement_1.ControleSaisieEvenement)(() => {
				if (
					aParams.element &&
					aParams.element.getNumero() &&
					(!lThis.stage ||
						aParams.element.getNumero() !== lThis.stage.getNumero())
				) {
					lThis.stage = aParams.element;
					const lEleve = new ObjetElement_1.ObjetElement(
						"",
						lThis.numeroEleve || this.etatUtilScoEspace.getMembre().getNumero(),
					);
					new ObjetRequetePageAppreciationFinDeStage_1.ObjetRequetePageAppreciationFinDeStage(
						lThis,
						this.surReponse.bind(lThis),
					).lancerRequete({ eleve: lEleve, stage: lThis.stage });
				}
			});
		}
	}
	surEvenementPageStage(aParam) {
		if (!aParam) {
			this.recupererDonnees();
		} else if (aParam.suivi) {
			const lListePJEleves = new ObjetListeElements_1.ObjetListeElements();
			if (!!this.listePJSuivis) {
				lListePJEleves.add(this.listePJSuivis);
			}
			let lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
				"FenetreSuiviStage.CreerSuivi",
			);
			if (aParam.suivi.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation) {
				lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
					"FenetreSuiviStage.ModifierSuivi",
				);
			}
			ObjetFenetre_SuiviStage_1.ObjetFenetre_SuiviStage.ouvrir({
				pere: this,
				evenement: this.evenementFenetreSuiviStage,
				initialiser: initialiserFenetreSuiviStage,
				optionsFenetre: { titre: lTitreFenetre },
				donnees: {
					suivi: aParam.suivi,
					listeResponsables: this.stage.listeResponsables,
					respAdminCBFiltrage: this.stage.respAdminCBFiltrage,
					evenements: this.listeEvenementsSuiviStage,
					lieux: this.listeLieuxSuiviStage,
					listePJEleve: lListePJEleves,
				},
			});
		}
	}
	surReponse(aJSON) {
		this.stage = aJSON.stage;
		this.stage.numeroEleve = this.numeroEleve;
		this.etatUtilScoEspace.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Stage,
			this.stage,
		);
		this.parametres.avecEdition = this.stage.avecEditionAnnexe;
		this.parametres.avecEditionSuivisDeStage = this.stage.avecEdition;
		this.getInstance(this.identPageStage).setParametres({
			avecEdition: this.parametres.avecEdition,
			avecEditionDocumentsJoints: this.parametres.avecEdition,
			avecEditionSuivisDeStage: this.parametres.avecEditionSuivisDeStage,
			tailleMaxPieceJointe: this.parametres.tailleMaxPieceJointe,
			getLabelListe: () => {
				const T = [this.getResumeOnglet()];
				const lOnglet = this.listeOnglets.getElementParGenre(
					this.genreOngletSelectionne,
				);
				if (lOnglet) {
					T.push(lOnglet.getLibelle());
				}
				return T.join(" - ");
			},
		});
		this.listePJSuivis = null;
		if (!!this.stage.suiviStage) {
			const lThis = this;
			this.stage.suiviStage.parcourir((aSuivi) => {
				if (lThis.listeEvenementsSuiviStage && !!aSuivi.evenement) {
					const lEvenementDeListeComplete =
						lThis.listeEvenementsSuiviStage.getElementParNumero(
							aSuivi.evenement.getNumero(),
						);
					if (!!lEvenementDeListeComplete) {
						aSuivi.evenement = lEvenementDeListeComplete;
					}
				}
				if (!!lThis.listeLieuxSuiviStage && !!aSuivi.lieu) {
					const lLieuDeListeComplete =
						lThis.listeLieuxSuiviStage.getElementParNumero(
							aSuivi.lieu.getNumero(),
						);
					if (!!lLieuDeListeComplete) {
						aSuivi.lieu = lLieuDeListeComplete;
					}
				}
			});
		}
		aJSON.listePJEleve.parcourir((aPieceJointe) => {
			aPieceJointe.Genre = Enumere_DocumentJoint_1.EGenreDocumentJoint.Fichier;
		});
		this.listeDocJointsStage = MethodesObjet_1.MethodesObjet.dupliquer(
			aJSON.listePJEleve,
		);
		const lNiveauInterTitre = ObjetListe_1.ObjetListe.typeInterTitre.h3;
		const lIndiceDernierElement = this.listeOnglets.count() - 1;
		const lDernierElementListe = this.listeOnglets.get(lIndiceDernierElement);
		if (
			!!lDernierElementListe &&
			lDernierElementListe.estInterTitre === lNiveauInterTitre
		) {
			this.listeOnglets.remove(lIndiceDernierElement);
		}
		let lElementConventionEtiquette;
		let lCpt = 0;
		let lNrMax = 3;
		let lConventionSigneeElectroniquement = null;
		if (this.stage.listeDocumentsSignes) {
			this.stage.listeDocumentsSignes.parcourir((aDoc) => {
				if (aDoc.estConventionParDefaut) {
					lConventionSigneeElectroniquement = aDoc;
				}
			});
		}
		if (lConventionSigneeElectroniquement) {
			lNrMax = lConventionSigneeElectroniquement.roles.count();
			lConventionSigneeElectroniquement.roles.parcourir((aRole) => {
				if (aRole.aSignee) {
					lCpt++;
				}
			});
		} else {
			if (this.stage.conventionSigneeEleve) {
				lCpt++;
			}
			if (this.stage.conventionSigneeEntreprise) {
				lCpt++;
			}
			if (this.stage.conventionSigneeEtablissement) {
				lCpt++;
			}
		}
		if (lCpt > 0) {
			lElementConventionEtiquette = Object.assign(
				new ObjetElement_1.ObjetElement(
					IE.jsx.str(
						"div",
						{ style: "display: flex;align-items: center;" },
						IE.jsx.str(
							"ie-chips",
							{ class: "tag-style chips-design-liste color-theme" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.conventionSignee",
							),
							" ",
							lCpt,
							"/",
							lNrMax,
						),
						IE.jsx.str("ie-btnicon", {
							class: "icon_question avecFond",
							"ie-model": "getInfoConvention",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.detailInfoSignatureConvention",
							),
						}),
					),
				),
				{ estInterTitre: lNiveauInterTitre },
			);
		} else {
			lElementConventionEtiquette = Object.assign(
				new ObjetElement_1.ObjetElement(
					IE.jsx.str(
						"ie-chips",
						{ class: "tag-style chips-design-liste" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.conventionNonSignee",
						),
					),
				),
				{ estInterTitre: lNiveauInterTitre },
			);
		}
		this.listeOnglets.add(lElementConventionEtiquette);
		this.getInstance(this.identListeOnglet).setVisible(true);
		this.getInstance(this.identListeOnglet).setDonnees(
			new InterfaceFicheStageCP_2.DonneesListe_SelectionOngletStage(
				this.listeOnglets,
				this.stage,
			),
		);
		this.getInstance(this.identListeOnglet).selectionnerLigne({
			ligne: this.listeOnglets.getIndiceParElement(
				this.listeOnglets.getElementParGenre(this.genreOngletSelectionne),
			),
			avecEvenement: true,
		});
	}
	surListeStage(
		aListeStages,
		aListeEvenements,
		aListeLieux,
		aListeSujets,
		aDateFinSaisieSuivi,
	) {
		this.listeEvenementsSuiviStage = aListeEvenements;
		this.listeLieuxSuiviStage = aListeLieux;
		this.listeSujetsStage = aListeSujets;
		this.dateFinSaisieSuivi = aDateFinSaisieSuivi;
		const lListeStages = aListeStages;
		if (!!lListeStages && lListeStages.count() > 0) {
			let lIndice = 0;
			const lStageSelect = this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Stage,
			);
			if (!!lStageSelect) {
				lIndice = lListeStages.getIndiceElementParFiltre((aElement) => {
					return aElement.getNumero() === lStageSelect.getNumero();
				});
			}
			lListeStages.parcourir((aStage) => {
				if (aStage.periode) {
					aStage.setLibelle(aStage.getLibelle() + " " + aStage.periodeDebutFin);
				}
			});
			this.getInstance(this.identCmbStage).setVisible(true);
			this.getInstance(this.identCmbStage).setDonnees(
				lListeStages,
				Math.max(lIndice, 0),
			);
		} else {
			this.getInstance(this.identCmbStage).setVisible(false);
			this.evenementAfficherMessage(
				ObjetTraduction_1.GTraductions.getValeur("FicheStage.msgAucunStage"),
			);
		}
	}
	surSelectionEleve() {
		let lFenetre = this.getInstance(this.identFenetreFicheEleve);
		if (lFenetre && lFenetre.estAffiche()) {
			lFenetre.setDonnees(null, true);
		}
		if (
			UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.estPhotoEleveAffiche(
				this,
			)
		) {
			UtilitaireRenseignementsEleve_1.UtilitairePhotoEleve.afficherPhotoEleve(
				this,
				true,
			);
		}
	}
}
exports.ObjetInterfaceFicheStage = ObjetInterfaceFicheStage;
function initialiserFenetreSuiviStage(aInstance) {
	aInstance.setParametresFenetreSuivi({
		libellePublication: ObjetTraduction_1.GTraductions.getValeur(
			"FicheStage.listeSuivis.publierSuivi",
		),
		maxSizeDocumentJoint: (0, AccessApp_1.getApp)().droits.get(
			ObjetDroitsPN_1.TypeDroits.tailleMaxDocJointEtablissement,
		),
	});
}
