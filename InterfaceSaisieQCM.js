exports.InterfaceSaisieQCM = void 0;
const InterfaceEditionDetailSelectionQCM_1 = require("InterfaceEditionDetailSelectionQCM");
const InterfaceEditionListeQCM_1 = require("InterfaceEditionListeQCM");
const MethodesObjet_1 = require("MethodesObjet");
const _InterfacePage_1 = require("_InterfacePage");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const DonneesListe_FiltresQCM_1 = require("DonneesListe_FiltresQCM");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SelectionCategoriesQCM_1 = require("ObjetFenetre_SelectionCategoriesQCM");
const ObjetFenetre_SelectionRessource_1 = require("ObjetFenetre_SelectionRessource");
const DonneesListe_ResultatsQCM_1 = require("DonneesListe_ResultatsQCM");
const AccessApp_1 = require("AccessApp");
const GlossaireCP_1 = require("GlossaireCP");
class InterfaceSaisieQCM extends _InterfacePage_1._InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.element = null;
		this.idInfoVerrou = GUID_1.GUID.getId();
		this.options = { avecGestionCategorie: false, avecGestionNotation: true };
		this.FiltresGlobaux = {
			Matiere: { liste: null, listeSelectionnees: null },
			Niveau: { liste: null, listeSelectionnees: null },
		};
		this.filtreActif = this.getFiltreDefault();
		this.estLigneCategoriesDeployee = false;
		this.listeCategoriesQCM = new ObjetListeElements_1.ObjetListeElements();
		this.genreRessource = {
			QCM: this.getGenreRessourceQCM(),
			execQCM: this.getGenreRessourceExecutionQCM(),
		};
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.AddSurZone = [];
		if (this.identTripleCombo !== undefined && this.identTripleCombo !== null) {
			this.AddSurZone.push(this.identTripleCombo);
		}
		if (this.avecFiltreGlobalMatiere()) {
			this.AddSurZone.push({
				html: IE.jsx.str(
					"span",
					{ class: "EspaceGauche10" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "FiltreGlobal.Matiere.btnChoixMatieres",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.Filtres.SelectionnerMatieres",
							),
							"aria-haspopup": "dialog",
						},
						"...",
					),
				),
			});
			this.AddSurZone.push({
				html: '<span ie-html="FiltreGlobal.Matiere.getStrAffichage"></span>',
			});
		}
		if (this.avecFiltreGlobalNiveau()) {
			this.AddSurZone.push({
				html: IE.jsx.str(
					"span",
					{ class: "GrandEspaceGauche" },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": "FiltreGlobal.Niveau.btnChoixNiveaux",
							"ie-tooltiplabel": ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.Filtres.SelectionnerNiveaux",
							),
							"aria-haspopup": "dialog",
						},
						"...",
					),
				),
			});
			this.AddSurZone.push({
				html: '<span ie-html="FiltreGlobal.Niveau.getStrAffichage"></span>',
			});
		}
		if (this.estModeCollaboratif()) {
			this.AddSurZone.push({ html: this._composeInfoVerrouCollab() });
		}
	}
	construireInstances() {
		this.identListeFiltresQCM = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeFiltres,
			this._initialiserListeFiltres,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			FiltreGlobal: {
				Matiere: {
					btnChoixMatieres: {
						event: function () {
							const lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.Filtres.SelectionnerMatieres",
							);
							aInstance.ouvrirFenetreSelectionFiltresGlobaux(
								aInstance.FiltresGlobaux.Matiere.liste,
								aInstance.FiltresGlobaux.Matiere.listeSelectionnees,
								lTitreFenetre,
							);
						},
					},
					getStrAffichage: function () {
						const lNbMatieresSelectionnees = !!aInstance.FiltresGlobaux.Matiere
							.listeSelectionnees
							? aInstance.FiltresGlobaux.Matiere.listeSelectionnees.count()
							: 0;
						const lNbMatieres = !!aInstance.FiltresGlobaux.Matiere.liste
							? aInstance.FiltresGlobaux.Matiere.liste.count()
							: 0;
						const lStrNb = [];
						if (lNbMatieresSelectionnees === lNbMatieres) {
							lStrNb.push(
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.Filtres.Toutes",
								),
							);
						} else {
							lStrNb.push(lNbMatieresSelectionnees, " / ", lNbMatieres);
						}
						return (
							ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.Filtres.Matieres",
							) +
							" (" +
							lStrNb.join("") +
							")"
						);
					},
				},
				Niveau: {
					btnChoixNiveaux: {
						event: function () {
							const lTitreFenetre = ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.Filtres.SelectionnerNiveaux",
							);
							aInstance.ouvrirFenetreSelectionFiltresGlobaux(
								aInstance.FiltresGlobaux.Niveau.liste,
								aInstance.FiltresGlobaux.Niveau.listeSelectionnees,
								lTitreFenetre,
							);
						},
					},
					getStrAffichage: function () {
						const lNbNiveauxSelectionnes = !!aInstance.FiltresGlobaux.Niveau
							.listeSelectionnees
							? aInstance.FiltresGlobaux.Niveau.listeSelectionnees.count()
							: 0;
						const lNbNiveaux = !!aInstance.FiltresGlobaux.Niveau.liste
							? aInstance.FiltresGlobaux.Niveau.liste.count()
							: 0;
						const lStrNb = [];
						if (lNbNiveauxSelectionnes === lNbNiveaux) {
							lStrNb.push(
								ObjetTraduction_1.GTraductions.getValeur(
									"SaisieQCM.Filtres.Tous",
								),
							);
						} else {
							lStrNb.push(lNbNiveauxSelectionnes, " / ", lNbNiveaux);
						}
						return (
							ObjetTraduction_1.GTraductions.getValeur(
								"SaisieQCM.Filtres.Niveaux",
							) +
							" (" +
							lStrNb.join("") +
							")"
						);
					},
				},
			},
			avecListeFiltresQCM: function () {
				return !aInstance.estModeCollaboratif();
			},
		});
	}
	avecFiltreGlobalMatiere() {
		return true;
	}
	avecFiltreGlobalNiveau() {
		return false;
	}
	ouvrirFenetreSelectionFiltresGlobaux(
		aListeComplete,
		aListeElementsSelectionnes,
		aTitreFenetre,
	) {
		const lThis = this;
		const lFenetreSelectionRessource =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionRessource_1.ObjetFenetre_SelectionRessource,
				{
					pere: this,
					evenement: function () {
						lThis.actualiserVisibilitesElementsQCM(lThis.listeQCM);
						lThis.getInstance(lThis.interfaceListeQCM).actualiserListe();
					},
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({ titre: aTitreFenetre });
					},
				},
			);
		lFenetreSelectionRessource.setOptionsFenetreSelectionRessource({
			autoriseEltAucun: true,
			selectionObligatoire: true,
			listeFlatDesign: true,
		});
		const lDonnees = {
			listeRessources: aListeComplete,
			listeRessourcesSelectionnees: aListeElementsSelectionnes,
		};
		if (!!lDonnees.listeRessources) {
			lFenetreSelectionRessource.setDonnees(lDonnees);
		}
	}
	miseAJourFiltresGlobaux(aListeQCM) {
		const lThis = this;
		if (this.avecFiltreGlobalMatiere()) {
			const lNouvelleListeMatieres =
				new ObjetListeElements_1.ObjetListeElements();
			if (!!aListeQCM) {
				aListeQCM.parcourir((aElementQCM) => {
					if (aElementQCM.getGenre() === lThis.genreRessource.QCM) {
						let lNumeroMatiereDeListe;
						const lMatiereDuQCM = aElementQCM.matiere;
						if (!lMatiereDuQCM || !lMatiereDuQCM.existeNumero()) {
							lNumeroMatiereDeListe = 0;
						} else {
							lNumeroMatiereDeListe = lMatiereDuQCM.getNumero();
						}
						let lMatiereDepuisNouvelleListe =
							lNouvelleListeMatieres.getElementParNumero(lNumeroMatiereDeListe);
						if (!lMatiereDepuisNouvelleListe) {
							if (lNumeroMatiereDeListe === 0) {
								lMatiereDepuisNouvelleListe = new ObjetElement_1.ObjetElement(
									GlossaireCP_1.TradGlossaireCP.Aucune,
									lNumeroMatiereDeListe,
								);
								lMatiereDepuisNouvelleListe.Position = 0;
							} else {
								lMatiereDepuisNouvelleListe =
									MethodesObjet_1.MethodesObjet.dupliquer(lMatiereDuQCM);
								lMatiereDepuisNouvelleListe.Position = 1;
							}
							lNouvelleListeMatieres.addElement(lMatiereDepuisNouvelleListe);
						}
					}
				});
			}
			this.FiltresGlobaux.Matiere.liste = lNouvelleListeMatieres;
			this.FiltresGlobaux.Matiere.listeSelectionnees =
				lNouvelleListeMatieres.getListeElements();
		}
		if (this.avecFiltreGlobalNiveau()) {
			const lNouvelleListeNiveaux =
				new ObjetListeElements_1.ObjetListeElements();
			if (!!aListeQCM) {
				aListeQCM.parcourir((aElementQCM) => {
					if (aElementQCM.getGenre() === lThis.genreRessource.QCM) {
						let lNumeroNiveauDeListe;
						const lNiveauDuQCM = aElementQCM.niveau;
						if (!lNiveauDuQCM || !lNiveauDuQCM.existeNumero()) {
							lNumeroNiveauDeListe = 0;
						} else {
							lNumeroNiveauDeListe = lNiveauDuQCM.getNumero();
						}
						let lNiveauDepuisNouvelleListe =
							lNouvelleListeNiveaux.getElementParNumero(lNumeroNiveauDeListe);
						if (!lNiveauDepuisNouvelleListe) {
							if (lNumeroNiveauDeListe === 0) {
								lNiveauDepuisNouvelleListe = new ObjetElement_1.ObjetElement(
									GlossaireCP_1.TradGlossaireCP.Aucun,
									lNumeroNiveauDeListe,
								);
								lNiveauDepuisNouvelleListe.Position = 0;
							} else {
								lNiveauDepuisNouvelleListe =
									MethodesObjet_1.MethodesObjet.dupliquer(lNiveauDuQCM);
								lNiveauDepuisNouvelleListe.Position = 1;
							}
							lNouvelleListeNiveaux.addElement(lNiveauDepuisNouvelleListe);
						}
					}
				});
			}
			this.FiltresGlobaux.Niveau.liste = lNouvelleListeNiveaux;
			this.FiltresGlobaux.Niveau.listeSelectionnees =
				lNouvelleListeNiveaux.getListeElements();
		}
	}
	estModeCollaboratif() {
		return false;
	}
	construireStructureAffichageAutre() {
		const T = [];
		T.push('<div class="InterfaceSaisieQCM">');
		T.push(this.composeSectionMessage());
		T.push('<div class="ISQ_inner">');
		T.push('<div class="ISQ_gauche" ie-if="avecListeFiltresQCM">');
		T.push(
			'<div id="',
			this.getNomInstance(this.identListeFiltresQCM),
			'" class="ISQ_gauche_ListeFiltresQCM"></div>',
		);
		T.push("</div>");
		T.push(
			'<div class="ISQ_milieu" id="',
			this.getNomInstance(this.interfaceListeQCM),
			'"></div>',
		);
		T.push(
			'<div class="ISQ_droite" id="',
			this.getNomInstance(this.interfaceDetailSelectionQCM),
			'"></div>',
		);
		T.push("</div>");
		T.push("</div>");
		return T.join("");
	}
	composeSectionMessage() {
		return "";
	}
	evntSurInterfaceDetailQCM(aParam) {
		switch (aParam.genreEvnt) {
			case InterfaceEditionDetailSelectionQCM_1
				.InterfaceEditionDetailSelectionQCM.GenreCallback.affichageQuestions: {
				if (aParam.avecMsg !== true) {
					if (this.estModeCollaboratif()) {
						this.getInstance(this.interfaceListeQCM).setInfosCollab(
							aParam.infosCollab,
						);
						this._setInfoVerrouCollab(aParam.infosCollab);
					}
				}
				break;
			}
			case InterfaceEditionDetailSelectionQCM_1
				.InterfaceEditionDetailSelectionQCM.GenreCallback.modificationDetail: {
				this.getInstance(this.interfaceListeQCM).setEtatBtnVisu();
				if (aParam.avecValidationAuto && this.getEtatSaisie()) {
					this.valider({
						validationAutoSurSelection: true,
						paramSelection: aParam,
					});
				}
				break;
			}
			case InterfaceEditionDetailSelectionQCM_1
				.InterfaceEditionDetailSelectionQCM.GenreCallback
				.actualisationQuestions: {
				if (this.element.contenuQCM) {
					const lListe = new ObjetListeElements_1.ObjetListeElements();
					this.element.contenuQCM.listeQuestions.parcourir((aElement) => {
						if (!!aElement.listeEvaluations) {
							aElement.listeEvaluations.parcourir((aElement) => {
								const lElement = lListe.getElementParElement(aElement);
								if (!lElement) {
									lListe.addElement(aElement);
								}
							});
						}
					});
					this.element.nbCompetencesTotal = lListe.count();
				}
				this.getInstance(this.interfaceListeQCM).actualiserListe();
				break;
			}
			case InterfaceEditionDetailSelectionQCM_1
				.InterfaceEditionDetailSelectionQCM.GenreCallback.validationAuto:
				this.lancerRequeteSaisieQCMSelonProduit(
					this.actionSurValidationAutoDetailQCM.bind(this, aParam.numero),
				);
				break;
			case InterfaceEditionDetailSelectionQCM_1
				.InterfaceEditionDetailSelectionQCM.GenreCallback.afficherResultats:
				this.getInstance(this.interfaceListeQCM).lancerRequeteResultatsQCM();
				break;
		}
	}
	activerImpression() {
		let lAUneExec = false;
		if (
			this.element &&
			this.element.existeNumero() &&
			this.element.getEtat() !== Enumere_Etat_1.EGenreEtat.Creation &&
			!this.estModeCollaboratif()
		) {
			if (this.element.getGenre() === this.genreRessource.execQCM) {
				lAUneExec = true;
			} else {
				this.listeQCM.parcourir((aElement) => {
					if (
						aElement.getGenre() === this.genreRessource.execQCM &&
						aElement.QCM &&
						this.element.egalParNumeroEtGenre(aElement.QCM.getNumero())
					) {
						lAUneExec = true;
						return false;
					}
				});
			}
		}
		return lAUneExec;
	}
	genererPDF(aParam) {}
	evntSurInterfaceListeQCM(aParam) {
		switch (aParam.genreEvnt) {
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.AjoutQuestions: {
				this.getInstance(
					this.interfaceDetailSelectionQCM,
				).actualiserListeQuestions();
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.actualiserQCM: {
				if (this.getEtatSaisie()) {
					this.valider({
						validationAutoSurSelection: true,
						paramSelection: aParam,
					});
				}
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.suppressionQCM: {
				for (let i = 0; i < this.listeQCM.count(); i++) {
					const lElement = this.listeQCM.get(i);
					if (
						lElement.pere &&
						lElement.pere.existeNumero() &&
						(!aParam.selection ||
							lElement.pere.getNumero() === aParam.selection.getNumero())
					) {
						lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
					}
				}
				this.element = null;
				this.getInstance(this.interfaceDetailSelectionQCM)._initialiser({
					initOngletSelectionne: false,
				});
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.suppressionServeur: {
				this.element = null;
				this.actionSurSaisieDirecteQCM(aParam.donneesJSON);
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.selectionQCM: {
				if (
					(this.estModeCollaboratif() ||
						aParam.forcerValidation === true ||
						aParam.validationAutoSurSelection === true) &&
					this.getEtatSaisie() &&
					aParam.chgmtQcm === true
				) {
					this.element = aParam.selection;
					this.valider({
						validationAutoSurSelection:
							!aParam.forcerValidation || aParam.validationAutoSurSelection,
						paramSelection: aParam,
					});
				} else {
					this.selectionnerQCM(aParam);
				}
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.deselectionQCM: {
				this.element = null;
				this.getInstance(this.interfaceDetailSelectionQCM)._initialiser({
					initOngletSelectionne: false,
				});
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.copieQCM: {
				this.actionSurCopieQCM();
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.associeDevoir:
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.associeEvaluation:
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.associeCdT: {
				this.afficherPage();
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.creationAutoQCM: {
				this.lancerRequeteSaisieQCMSelonProduit(this.actionSurCreationQCM);
				break;
			}
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.eventApresSuppressionQCM:
				this.lancerRequeteSaisieQCMSelonProduit(this.actionSurSuppressionQCM);
				break;
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.recupererDonnees:
				if (this.getEtatSaisie()) {
					this.valider({
						validationAutoSurSelection: true,
						paramSelection: aParam,
					});
				} else {
					this.recupererDonnees(true);
				}
				break;
			case InterfaceEditionListeQCM_1.InterfaceEditionListeQCM.GenreEvenement
				.fenetreResultats:
				switch (aParam.action) {
					case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM
						.genreCommande.genererPDF:
						this.genererPDF(aParam);
						break;
					case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM
						.genreCommande.supprimerReponse:
					case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM
						.genreCommande.recommencerTaf:
					case DonneesListe_ResultatsQCM_1.DonneesListe_ResultatsQCM
						.genreCommande.recommencerDevoir:
						this.actionSurSaisieDirecteQCM(aParam.donneesJSON);
						break;
				}
				break;
		}
	}
	actionSurValidationAutoDetailQCM(aNumero) {
		this.afficherPage(aNumero);
	}
	actionSurSuppressionQCM() {
		this.afficherPage();
	}
	actionSurCreationQCM(aJSON) {
		let lNumero;
		if (!!aJSON && !!aJSON.JSONRapportSaisie) {
			const lElmCree = aJSON.JSONRapportSaisie.qcm;
			if (!!lElmCree) {
				lNumero = lElmCree.getNumero();
			}
		}
		this.afficherPage(lNumero);
	}
	actionSurCopieQCM() {
		this.recupererDonnees(true);
	}
	actionSurSaisieDirecteQCM(aJSON) {
		if (aJSON !== null && aJSON !== undefined && aJSON.message) {
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: aJSON.message,
					callback: this.actionSurValidationQCM.bind(this),
				});
		} else {
			this.actionSurValidationQCM();
		}
	}
	ouvrirFenetreEditionCategories() {
		const lThis = this;
		const lFenetreSaisieEtiquettes =
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SelectionCategoriesQCM_1.ObjetFenetre_SelectionCategoriesQCM,
				{
					pere: lThis,
					evenement: function (aNumeroBouton, aDonnees) {
						if (!!aDonnees && aDonnees.avecModification) {
							lThis.afficherPage();
						}
					},
				},
			);
		lFenetreSaisieEtiquettes.setDonnees(lThis.listeCategoriesQCM);
	}
	estElementQCMVisibleSelonFiltre(aFiltre, aElementQCM) {
		let lAccepte = false;
		const lThis = this;
		if (
			aFiltre.getGenre() ===
			DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.FiltreStandard
		) {
			let lCalculeQCMEnFonctionDeSesFils = false;
			switch (aFiltre.getNumero()) {
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.ToutVoir:
					lAccepte = true;
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.Executes:
					if (aElementQCM.getGenre() === this.genreRessource.execQCM) {
						lAccepte =
							!!aElementQCM.dateFinPublication &&
							ObjetDate_1.GDate.estAvantJour(
								aElementQCM.dateFinPublication,
								new Date(),
							);
					} else {
						lCalculeQCMEnFonctionDeSesFils = true;
					}
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.EnCoursDExecution:
					if (aElementQCM.getGenre() === this.genreRessource.execQCM) {
						lAccepte = !!aElementQCM.estEnPublication;
					} else {
						lCalculeQCMEnFonctionDeSesFils = true;
					}
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.SansExecution:
					if (aElementQCM.getGenre() === this.genreRessource.QCM) {
						lAccepte = !aElementQCM.nbExecution;
					}
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.LiesADevoir:
					if (aElementQCM.getGenre() === this.genreRessource.execQCM) {
						lAccepte = !!aElementQCM.estLieADevoir;
					} else {
						lCalculeQCMEnFonctionDeSesFils = true;
					}
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.LiesAEvaluation:
					if (aElementQCM.getGenre() === this.genreRessource.execQCM) {
						lAccepte = !!aElementQCM.estLieAEvaluation;
					} else {
						lCalculeQCMEnFonctionDeSesFils = true;
					}
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.LiesAContenuDeCours:
					if (aElementQCM.getGenre() === this.genreRessource.execQCM) {
						lAccepte =
							!aElementQCM.estLieADevoir &&
							!aElementQCM.estLieAEvaluation &&
							!aElementQCM.estUnTAF;
					} else {
						lCalculeQCMEnFonctionDeSesFils = true;
					}
					break;
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.LiesATravailAFaire:
					if (aElementQCM.getGenre() === this.genreRessource.execQCM) {
						lAccepte = !!aElementQCM.estUnTAF;
					} else {
						lCalculeQCMEnFonctionDeSesFils = true;
					}
					break;
			}
			if (lCalculeQCMEnFonctionDeSesFils) {
				this.listeQCM.parcourir((aElemFilsQCM) => {
					if (
						!!aElemFilsQCM.pere &&
						aElemFilsQCM.pere.getNumero() === aElementQCM.getNumero()
					) {
						lAccepte = lThis.estElementQCMVisibleSelonFiltre(
							aFiltre,
							aElemFilsQCM,
						);
						if (lAccepte) {
							return false;
						}
					}
				});
			}
		} else if (
			aFiltre.getGenre() ===
			DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.Categorie
		) {
			if (aElementQCM.getGenre() === this.genreRessource.QCM) {
				lAccepte =
					!!aElementQCM.categories &&
					!!aElementQCM.categories.getElementParNumero(aFiltre.getNumero());
			} else {
				lAccepte = lThis.estElementQCMVisibleSelonFiltre(
					aFiltre,
					aElementQCM.pere,
				);
			}
		}
		return lAccepte;
	}
	estElementQCMVisibleSelonProduit(aElementQCM) {
		let lEstVisible = true;
		if (lEstVisible && this.avecFiltreGlobalMatiere()) {
			if (aElementQCM.getGenre() === this.genreRessource.QCM) {
				const lNumeroMatiereDuQCM =
					!!aElementQCM.matiere && aElementQCM.matiere.existeNumero()
						? aElementQCM.matiere.getNumero()
						: 0;
				lEstVisible =
					!!this.FiltresGlobaux.Matiere.listeSelectionnees.getElementParNumero(
						lNumeroMatiereDuQCM,
					);
			}
		}
		if (lEstVisible && this.avecFiltreGlobalNiveau()) {
			if (aElementQCM.getGenre() === this.genreRessource.QCM) {
				const lNumeroNiveauDuQCM =
					!!aElementQCM.niveau && aElementQCM.niveau.existeNumero()
						? aElementQCM.niveau.getNumero()
						: 0;
				lEstVisible =
					!!this.FiltresGlobaux.Niveau.listeSelectionnees.getElementParNumero(
						lNumeroNiveauDuQCM,
					);
			}
		}
		return lEstVisible;
	}
	actualiserVisibilitesElementsQCM(aListeQCM) {
		if (!!aListeQCM) {
			const lThis = this;
			aListeQCM.parcourir((aElementQCM) => {
				let lElemEstVisible =
					lThis.estElementQCMVisibleSelonProduit(aElementQCM);
				if (lElemEstVisible) {
					lElemEstVisible = lThis.estElementQCMVisibleSelonFiltre(
						lThis.filtreActif,
						aElementQCM,
					);
				}
				aElementQCM.visible = lElemEstVisible;
			});
		}
	}
	comptabiliseNbElementsAcceptesParFiltre(aFiltre) {
		let lGenreRessourceComptabilisee = this.genreRessource.execQCM;
		if (
			aFiltre.getGenre() ===
			DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.FiltreStandard
		) {
			switch (aFiltre.getNumero()) {
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.ToutVoir:
				case DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.SansExecution:
					lGenreRessourceComptabilisee = this.genreRessource.QCM;
					break;
			}
		} else if (
			aFiltre.getGenre() ===
			DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.Categorie
		) {
			lGenreRessourceComptabilisee = this.genreRessource.QCM;
		}
		let lNbElementsAcceptes = 0;
		if (!!this.listeQCM && lGenreRessourceComptabilisee !== null) {
			const lThis = this;
			lNbElementsAcceptes = this.listeQCM
				.getListeElements((aElem) => {
					return (
						aElem.getGenre() === lGenreRessourceComptabilisee &&
						lThis.estElementQCMVisibleSelonFiltre(aFiltre, aElem)
					);
				})
				.count();
		}
		return lNbElementsAcceptes;
	}
	actualiserListeFiltresQCM(aAvecEvent = false) {
		const lThis = this;
		const lFnCreerFiltreStandard = function (aTypeFiltre, aPosition) {
			const lFiltre = new ObjetElement_1.ObjetElement(
				"",
				aTypeFiltre,
				DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.FiltreStandard,
				aPosition,
			);
			lFiltre.nbElementsAcceptes =
				lThis.comptabiliseNbElementsAcceptesParFiltre(lFiltre);
			return lFiltre;
		};
		const lFnCreerFiltreCategorie = function (aCategorie) {
			const lFiltre = MethodesObjet_1.MethodesObjet.dupliquer(aCategorie);
			lFiltre.Genre =
				DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.Categorie;
			lFiltre.nbElementsAcceptes =
				lThis.comptabiliseNbElementsAcceptesParFiltre(lFiltre);
			return lFiltre;
		};
		let lPositionFiltre = 0;
		const lListeFiltres = new ObjetListeElements_1.ObjetListeElements();
		lListeFiltres.addElement(
			lFnCreerFiltreStandard(
				DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.ToutVoir,
				lPositionFiltre++,
			),
		);
		lListeFiltres.addElement(
			lFnCreerFiltreStandard(
				DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.Executes,
				lPositionFiltre++,
			),
		);
		lListeFiltres.addElement(
			lFnCreerFiltreStandard(
				DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre
					.EnCoursDExecution,
				lPositionFiltre++,
			),
		);
		lListeFiltres.addElement(
			lFnCreerFiltreStandard(
				DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.SansExecution,
				lPositionFiltre++,
			),
		);
		const lTypesFiltreQCMLies = this.getTypesFiltreQCMLies();
		for (let i = 0; i < lTypesFiltreQCMLies.length; i++) {
			lListeFiltres.addElement(
				lFnCreerFiltreStandard(lTypesFiltreQCMLies[i], lPositionFiltre++),
			);
		}
		const lAvecGestionFiltreCategorie = this.options.avecGestionCategorie;
		let lListeFiltresCategories = null;
		if (lAvecGestionFiltreCategorie) {
			lListeFiltresCategories = new ObjetListeElements_1.ObjetListeElements();
			if (!!this.listeCategoriesQCM) {
				this.listeCategoriesQCM.parcourir((aCategorie) => {
					lListeFiltresCategories.addElement(
						lFnCreerFiltreCategorie(aCategorie),
					);
				});
			}
		}
		const lInstanceListeFiltres = this.getInstance(this.identListeFiltresQCM);
		lInstanceListeFiltres.setDonnees(
			new DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM(lListeFiltres, {
				avecGestionCategorie: lAvecGestionFiltreCategorie,
				listeCategories: lListeFiltresCategories,
				estLigneCategoriesDeployee: this.estLigneCategoriesDeployee,
			}),
		);
		if (!!this.filtreActif) {
			lInstanceListeFiltres.setListeElementsSelection(
				new ObjetListeElements_1.ObjetListeElements().addElement(
					this.filtreActif,
				),
				{ avecEvenement: aAvecEvent },
			);
		}
	}
	recupererDonnees(aEstActualisation) {
		this.afficherPage(null, !aEstActualisation);
	}
	afficherPage(aNumeroEltASelectionner, aSurInit = false) {
		this.setEtatSaisie(false);
		this.faireRequeteListeQCM(aNumeroEltASelectionner, aSurInit);
	}
	valider(aParametresSaisieQCM) {
		this.setEtatSaisie(false);
		const aValidationAutoSurSelection =
			aParametresSaisieQCM === null || aParametresSaisieQCM === void 0
				? void 0
				: aParametresSaisieQCM.validationAutoSurSelection;
		const aParamSelection =
			aParametresSaisieQCM === null || aParametresSaisieQCM === void 0
				? void 0
				: aParametresSaisieQCM.paramSelection;
		const lValidationAutoSurSelection =
			aValidationAutoSurSelection !== null &&
			aValidationAutoSurSelection !== undefined &&
			aValidationAutoSurSelection === true;
		let lCallback;
		if (lValidationAutoSurSelection) {
			lCallback = this.actionSurValidationAutoSurSelection.bind(
				this,
				aParamSelection,
			);
		} else {
			const lNumeroEltASelectionner =
				this.element !== null &&
				this.element !== undefined &&
				this.element.getEtat() === Enumere_Etat_1.EGenreEtat.Modification
					? this.element.getNumero()
					: null;
			lCallback = this.actionSurValidation.bind(
				this,
				lNumeroEltASelectionner,
				false,
			);
		}
		this.lancerRequeteSaisieQCMSelonProduit(lCallback);
	}
	actionSurValidationQCM() {
		this.afficherPage();
	}
	actionSurValidationAutoSurSelection(aParam) {
		this.afficherPage(aParam.selection.getNumero());
	}
	selectionnerQCM(aParam) {
		this.element = aParam.selection;
		this.getInstance(this.interfaceDetailSelectionQCM).setSelection(aParam);
	}
	getFiltreDefault() {
		return new ObjetElement_1.ObjetElement(
			"",
			DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Filtre.ToutVoir,
			DonneesListe_FiltresQCM_1.DonneesListe_FiltresQCM.Genres.FiltreStandard,
		);
	}
	_composeInfoVerrouCollab() {
		const T = [];
		T.push(
			'<div class="Gras GrandEspaceGauche" id="',
			this.idInfoVerrou,
			'"></div>',
		);
		return T.join("");
	}
	_setInfoVerrouCollab(aInfosCollab) {
		if (aInfosCollab.avecVerrouCollab === true) {
			ObjetHtml_1.GHtml.setHtml(
				this.idInfoVerrou,
				ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"QCM_Divers.infoQCMCollabVerrou",
					),
					[aInfosCollab.possesseurVerrou.getLibelle()],
				),
			);
		} else {
			ObjetHtml_1.GHtml.setHtml(this.idInfoVerrou, "&nbsp;");
		}
	}
	_initialiserListeFiltres(aInstance) {
		const lColonnes = [];
		lColonnes.push({ taille: "100%" });
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecOmbreDroite: true,
		});
	}
	_evenementListeFiltres(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (!!aParams.article) {
					if (!!aParams.article.estBoutonEditerCategoriesQCM) {
						this.ouvrirFenetreEditionCategories();
					} else {
						this.filtreActif = aParams.article;
						this.actualiserVisibilitesElementsQCM(this.listeQCM);
						this.getInstance(this.interfaceListeQCM).actualiserListe();
					}
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Deploiement:
				if (aParams.article.estUnDeploiement) {
					this.estLigneCategoriesDeployee = !!aParams.article.estDeploye;
				}
				break;
		}
	}
}
exports.InterfaceSaisieQCM = InterfaceSaisieQCM;
