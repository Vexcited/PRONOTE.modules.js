exports.ObjetFenetre_ElementsProgramme = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const TypeFusionTitreListe_1 = require("TypeFusionTitreListe");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const CollectionRequetes_1 = require("CollectionRequetes");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeNote_1 = require("TypeNote");
const DonneesListe_ElementsProgramme_1 = require("DonneesListe_ElementsProgramme");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_SelectionClasseGroupe_1 = require("ObjetFenetre_SelectionClasseGroupe");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
const ObjetFenetre_OrdonnerElementsProgramme_1 = require("ObjetFenetre_OrdonnerElementsProgramme");
const GUID_1 = require("GUID");
require("IEHtml.InputNote.js");
const AccessApp_1 = require("AccessApp");
const ObjetRequeteListeElementsProgramme_1 = require("ObjetRequeteListeElementsProgramme");
const GlossaireWAI_1 = require("GlossaireWAI");
class ObjetRequeteSaisieElementsProgramme extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisieElementsProgramme",
	ObjetRequeteSaisieElementsProgramme,
);
class ObjetFenetre_ElementsProgramme extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.TypeAffichage = { ParMatiere: 0, ParDomaine: 1, ParEltSaisisCDT: 2 };
		this.idLabelPalier = GUID_1.GUID.getId();
		this.idLabelMatiere = GUID_1.GUID.getId();
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.Titre",
			),
			largeur: 700,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			contextePrimaire: this.appSco.getEtatUtilisateur().pourPrimaire(),
		});
		if (
			!this.appSco.parametresUtilisateur.get(
				"CDT.ElementProgramme.TypeAffichage",
			)
		) {
			this.appSco.parametresUtilisateur.set(
				"CDT.ElementProgramme.TypeAffichage",
				this.TypeAffichage.ParMatiere,
			);
		}
		this.donnees = {};
		this.parametresJSON = {};
	}
	estAffichageDuBulletin() {
		return !!this.donnees.service;
	}
	jsxModeleCheckboxAfficherEltDuProfesseur() {
		return {
			getValue: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.AfficherEltDuProfesseur",
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.AfficherEltDuProfesseur",
					aValue,
				);
				this._actualiserListe(null, { avecListeDomaines: false });
			},
			getDisabled: () => {
				return !this._estFiltreParMatiere();
			},
		};
	}
	jsxModeleCheckboxAfficherBO() {
		return {
			getValue: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.AfficherBO",
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.AfficherBO",
					aValue,
				);
				this._actualiserListe(null, { avecListeDomaines: false });
			},
			getDisabled: () => {
				return !this._estFiltreParMatiere();
			},
		};
	}
	jsxModeleCheckboxAfficherEltsPartages() {
		return {
			getValue: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.AfficherPartage",
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.AfficherPartage",
					aValue,
				);
				this._actualiserListe(null, { avecListeDomaines: false });
			},
			getDisabled: () => {
				return !this._estFiltreParMatiere();
			},
		};
	}
	jsxModeleCheckboxAfficherCompetences() {
		return {
			getValue: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.AfficherCompetences",
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.AfficherCompetences",
					aValue,
				);
				this._actualiserListe(null, { avecListeDomaines: false });
			},
			getDisabled: () => {
				return !this._estFiltreParMatiere();
			},
		};
	}
	jsxModeleRadioFiltreActif(aTypeAffichage) {
		return {
			getValue: () => {
				return (
					this.appSco.parametresUtilisateur.get(
						"CDT.ElementProgramme.TypeAffichage",
					) === aTypeAffichage
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.TypeAffichage",
					aTypeAffichage,
				);
				this._actualiserListe(null, {
					avecListeMatieres: false,
					avecListeDomaines: false,
				});
			},
			getName: () => {
				return `${this.Nom}_FiltreActif`;
			},
		};
	}
	jsxModeleCheckboxFiltreTravail() {
		return {
			getValue: () => {
				return this.appSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.FiltreEltsTravailles",
				);
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.FiltreEltsTravailles",
					aValue,
				);
				this._actualiserListe(null, {
					avecListeMatieres: false,
					avecListeDomaines: false,
				});
			},
			getDisabled: () => {
				return !this._estFiltreParElementsSaisisCDT();
			},
		};
	}
	estComptabiliserPourBulletin() {
		const lNbServicesDispo = !!this.donnees.listeServicesDuCours
			? this.donnees.listeServicesDuCours.count()
			: 0;
		return (
			lNbServicesDispo > 0 &&
			this.appSco.parametresUtilisateur.get(
				"CDT.ElementProgramme.ComptabiliserPourBulletin",
			)
		);
	}
	jsxModeleCheckboxComptabiliserPourBulletin() {
		return {
			getValue: () => {
				return this.estComptabiliserPourBulletin();
			},
			setValue: (aValue) => {
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.ComptabiliserPourBulletin",
					aValue,
				);
			},
			getDisabled: () => {
				const lNbServicesDispo = !!this.donnees.listeServicesDuCours
					? this.donnees.listeServicesDuCours.count()
					: 0;
				return lNbServicesDispo === 0;
			},
		};
	}
	jsxIfPanelComptabiliserPourBulletinVisible() {
		return false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			estAfficherDansContexteBulletin: function () {
				return aInstance.estAffichageDuBulletin();
			},
			inputNbTravail: {
				getNote: function () {
					return new TypeNote_1.TypeNote(
						aInstance.appSco.parametresUtilisateur.get(
							"CDT.ElementProgramme.NbFiltreEltsTravailles",
						) || 0,
					);
				},
				setNote: function (aNote) {
					aInstance.appSco.parametresUtilisateur.set(
						"CDT.ElementProgramme.NbFiltreEltsTravailles",
						aNote.getValeur(),
					);
					if (aInstance._estFiltreParElementsSaisisCDT()) {
						aInstance._actualiserListe(null, {
							avecListeMatieres: false,
							avecListeDomaines: false,
						});
					}
				},
				getOptionsNote: function () {
					return {
						avecVirgule: false,
						sansNotePossible: false,
						avecAnnotation: false,
						min: 1,
						max: 50,
						hintSurErreur: true,
					};
				},
				getDisabled: function () {
					return !aInstance._estFiltreParElementsSaisisCDT();
				},
			},
			getHtmlNbMax: function () {
				const lMaxDepasse =
					aInstance.donnees &&
					aInstance.donnees.listeElementsProgramme_saisie &&
					aInstance.parametresJSON &&
					aInstance.parametresJSON.nbMaxElements > 0 &&
					aInstance.donnees.listeElementsProgramme_saisie.count() >
						aInstance.parametresJSON.nbMaxElements;
				return !lMaxDepasse
					? ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.LimitNBEltProgrammeTravailles",
						) +
							" " +
							(aInstance.parametresJSON.nbMaxElements > 0
								? aInstance.parametresJSON.nbMaxElements
								: ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_ElementsProgramme.Illimite",
									))
					: '<label class="semi-bold" style="color:var(--color-red-moyen);">' +
							ObjetChaine_1.GChaine.format(
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ElementsProgramme.LimiteNBEltProgrammeTravaillesDepassee",
								),
								[aInstance.parametresJSON.nbMaxElements],
							) +
							"</label>";
			},
			btnAffectation: {
				event: function () {
					const lListe =
						aInstance.parametresJSON.listeServicesAffectation ||
						new ObjetListeElements_1.ObjetListeElements();
					if (lListe.count() === 0) {
						return aInstance.appSco
							.getMessage()
							.afficher({
								message: ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ElementsProgramme.AucuneClasseSimilaireTrouvee",
								),
							});
					}
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_SelectionClasseGroupe_1.ObjetFenetre_SelectionClasseGroupe,
						{
							pere: aInstance,
							evenement: function (
								aGenreRessource,
								aListeSelection,
								aNumeroBouton,
							) {
								if (aNumeroBouton !== 1) {
									return;
								}
								if (aListeSelection.count() === 0) {
									return;
								}
								this._getPromesseConfirmationSaisieAffectation(aListeSelection)
									.then(
										() => {
											return new ObjetRequeteSaisieElementsProgramme(
												aInstance,
											).lancerRequete({
												estAffectation: true,
												periode: this.donnees.periode,
												service: this.donnees.service,
												listeServices: aListeSelection.setSerialisateurJSON({
													ignorerEtatsElements: true,
												}),
												listeElements: MethodesObjet_1.MethodesObjet.dupliquer(
													this.donnees.listeElementsProgramme_saisie,
												).setSerialisateurJSON({ ignorerEtatsElements: true }),
											});
										},
										() => {},
									)
									.then(() => {
										aInstance._actualiserListe();
									});
							},
						},
					).setDonnees({
						listeRessources: lListe,
						listeRessourcesSelectionnees:
							new ObjetListeElements_1.ObjetListeElements(),
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.TitreSelectionElts",
						),
					});
				},
			},
			btnOrdonnerElements: {
				event: function () {
					const lListeElements_Saisie =
						aInstance.donnees.listeElementsProgramme_saisie;
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_OrdonnerElementsProgramme_1.ObjetFenetre_OrdonnerElementsProgramme,
						{
							pere: aInstance,
							initialiser: function (aInstance) {
								aInstance.initialiserFenetre();
							},
							evenement: function (aAvecSaisie) {
								if (aAvecSaisie) {
									const lListe = aInstance.getInstance(aInstance.identListe);
									lListe.getListeArticles().parcourir((D) => {
										D.actif = !!lListeElements_Saisie.getElementParNumero(
											D.getNumero(),
										);
									});
									lListe.actualiser(false, false);
								}
							},
						},
					).setDonneesFenetreOrdonnerElementProgramme({
						service: aInstance.donnees.service,
						periode: aInstance.donnees.periode,
						listeElementsProgramme: lListeElements_Saisie,
					});
				},
				getDisabled: function () {
					let lDisabled = true;
					if (
						aInstance.donnees &&
						aInstance.donnees.listeElementsProgramme_saisie &&
						aInstance.donnees.listeElementsProgramme_saisie.count() > 1
					) {
						lDisabled = false;
					}
					return lDisabled;
				},
			},
			panelComptabiliserPourBulletin: {
				avecComboChoixServices: function () {
					const lNbServicesDispo = !!aInstance.donnees.listeServicesDuCours
						? aInstance.donnees.listeServicesDuCours.count()
						: 0;
					return lNbServicesDispo > 0;
				},
				sansComboChoixServices: function () {
					return !this.controleur.panelComptabiliserPourBulletin.avecComboChoixServices.call(
						this,
					);
				},
				getMessageAucunService: function () {
					let lLibelleMatiereDuCours = "";
					let lLibelleClasseDuCours = "";
					if (
						!!aInstance.donnees.cours &&
						!!aInstance.donnees.cours.ListeContenus
					) {
						aInstance.donnees.cours.ListeContenus.parcourir((aContenu) => {
							if (!!aContenu) {
								if (
									aContenu.getGenre() ===
									Enumere_Ressource_1.EGenreRessource.Matiere
								) {
									lLibelleMatiereDuCours = aContenu.getLibelle();
								}
								if (
									aContenu.getGenre() ===
										Enumere_Ressource_1.EGenreRessource.Classe ||
									aContenu.getGenre() ===
										Enumere_Ressource_1.EGenreRessource.Groupe
								) {
									lLibelleClasseDuCours = aContenu.getLibelle();
								}
							}
							if (
								lLibelleMatiereDuCours.length > 0 &&
								lLibelleClasseDuCours.length > 0
							) {
								return true;
							}
						});
					}
					return ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.SaisieCDT.AucunServiceDisponible",
						[lLibelleClasseDuCours, lLibelleMatiereDuCours],
					);
				},
				comboChoixServicesPourBulletin: {
					init: function (aCombo) {
						aCombo.setOptionsObjetSaisie({ longueur: 400 });
					},
					getDonnees: function (aDonnees) {
						if (!aDonnees) {
							if (!!aInstance.donnees.listeServicesDuCours) {
								aInstance.donnees.listeServicesDuCours.parcourir((aService) => {
									const lLibelleService = [aService.getLibelle()];
									if (
										!!aService.listeDernPeriodesNonCloturees &&
										aService.listeDernPeriodesNonCloturees.count() > 0
									) {
										const lPremierePeriode =
											aService.listeDernPeriodesNonCloturees.getPremierElement();
										if (!!lPremierePeriode) {
											lLibelleService.push(" ", lPremierePeriode.getLibelle());
										}
									}
									aService.setLibelle(lLibelleService.join(""));
								});
							}
							return aInstance.donnees.listeServicesDuCours;
						}
					},
					getIndiceSelection: function () {
						let lIndice = 0;
						if (
							!!aInstance.serviceDuCoursSelectionne &&
							!!aInstance.donnees.listeServicesDuCours &&
							aInstance.donnees.listeServicesDuCours.count() > 0
						) {
							lIndice =
								aInstance.donnees.listeServicesDuCours.getIndiceParNumeroEtGenre(
									aInstance.serviceDuCoursSelectionne.getNumero(),
								);
						}
						return Math.max(lIndice, 0);
					},
					event: function (aParametres) {
						if (
							aParametres.genreEvenement ===
								Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
									.selection &&
							!!aParametres.element
						) {
							aInstance.serviceDuCoursSelectionne = aParametres.element;
						}
					},
					getDisabled: function () {
						return !aInstance.estComptabiliserPourBulletin();
					},
				},
			},
			getHtmlParMatiere() {
				const lTab = [];
				if (
					aInstance.optionsFenetre.contextePrimaire ||
					!aInstance.estAffichageDuBulletin()
				) {
					lTab.push(
						"<div>",
						'<label id="',
						aInstance.idLabelMatiere,
						'" class="AlignementMilieuVertical InlineBlock">',
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.Matiere.AfficherMatiere",
						),
						"</label>",
						'<ie-combo ie-model="comboMatiere" class="AlignementMilieuVertical InlineBlock EspaceGauche"></ie-combo>',
						"</div>",
					);
				} else {
					lTab.push(
						IE.jsx.str(
							IE.jsx.fragment,
							null,
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": aInstance.jsxModeleRadioFiltreActif.bind(
										aInstance,
										aInstance.TypeAffichage.ParMatiere,
									),
								},
								IE.jsx.str(
									"label",
									{
										id: aInstance.idLabelMatiere,
										class: "AlignementMilieuVertical",
									},
									ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_ElementsProgramme.Matiere.AfficherMatiere",
									),
								),
							),
							IE.jsx.str("ie-combo", {
								"ie-model": "comboMatiere",
								class: "AlignementMilieuVertical InlineBlock EspaceGauche",
							}),
						),
					);
				}
				return lTab.join("");
			},
			comboMatiere: {
				init(aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: 320,
						getClassElement: function (aParams) {
							if (aParams && aParams.element && aParams.element.avecElt) {
								return "element-distinct";
							}
						},
						ariaLabelledBy: aInstance.idLabelMatiere,
					});
				},
				getDonnees(aDonnees) {
					if (!aDonnees) {
						return aInstance.listeMatieres;
					}
				},
				getIndiceSelection() {
					let lIndice = 0;
					if (
						!!aInstance.listeMatieres &&
						!!aInstance.donnees &&
						aInstance.donnees.matiere
					) {
						lIndice = aInstance.listeMatieres.getIndiceParElement(
							aInstance.donnees.matiere,
						);
					}
					return Math.max(lIndice, 0);
				},
				event(aParametres) {
					if (
						aParametres.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
					) {
						aInstance.donnees.matiere = aParametres.element;
						if (aParametres.interactionUtilisateur) {
							aInstance._actualiserListe(null, {
								avecListeMatieres: false,
								avecListeDomaines: false,
							});
						}
					}
				},
				getDisabled() {
					return !aInstance._estFiltreParMatiere();
				},
			},
		});
	}
	construireInstances() {
		this.identComboPalier = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			function (aParams) {
				if (
					aParams.genreEvenement ===
					Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
				) {
					this.donnees.palier = aParams.element;
					if (
						this.getInstance(
							this.identComboPalier,
						).estUneInteractionUtilisateur()
					) {
						this._actualiserListe();
					}
				}
			},
			(aInstance) => {
				aInstance.setOptionsObjetSaisie({
					longueur: 120,
					ariaLabelledBy: this.idLabelPalier,
				});
			},
		);
		this.identComboDomaine = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			function (aParams) {
				if (
					aParams.genreEvenement ===
					Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
				) {
					this.donnees.domaine = aParams.element;
					if (
						this.getInstance(
							this.identComboDomaine,
						).estUneInteractionUtilisateur()
					) {
						this._actualiserListe(null, {
							avecListeMatieres: false,
							avecListeDomaines: false,
						});
					}
				}
			},
			(aInstance) => {
				aInstance.setOptionsObjetSaisie({
					longueur: 320,
					getClassElement: function (aParams) {
						if (aParams && aParams.element && aParams.element.avecElt) {
							return "element-distinct";
						}
					},
				});
			},
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurliste.bind(this),
			this._initialiserliste.bind(this),
		);
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.modeExclusif,
			this._actualiserSurModeExclusif,
			this,
		);
	}
	setDonnees(aDonnees) {
		this.donnees = $.extend(
			{
				cours: null,
				numeroSemaine: null,
				service: null,
				periode: null,
				contenu: null,
				palier: new ObjetElement_1.ObjetElement("", 0),
				matiere: null,
				domaine: null,
				listeElementsProgramme: new ObjetListeElements_1.ObjetListeElements(),
				progression: null,
				ressource: null,
				cahierJournal: null,
				listeServicesDuCours: null,
			},
			aDonnees,
		);
		this.serviceDuCoursSelectionne = null;
		if (
			!this.estAffichageDuBulletin() &&
			this._estFiltreParElementsSaisisCDT()
		) {
			this.appSco.parametresUtilisateur.set(
				"CDT.ElementProgramme.TypeAffichage",
				this.TypeAffichage.ParMatiere,
			);
		}
		let lPosition = 1;
		this.donnees.listeElementsProgramme.parcourir((D) => {
			D.Genre = Enumere_Ressource_1.EGenreRessource.ElementProgramme;
			D.Position = lPosition;
			lPosition++;
		});
		this.donnees.listeElementsProgramme_saisie =
			MethodesObjet_1.MethodesObjet.dupliquer(
				this.donnees.listeElementsProgramme,
			);
		this.afficher();
		this._actualiserListe().then(() => {
			this.positionnerFenetre();
		});
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"label",
					{ id: this.idLabelPalier },
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.ElementsCycle",
					),
				),
				IE.jsx.str("div", {
					class: "AlignementMilieuVertical InlineBlock EspaceGauche",
					id: this.getNomInstance(this.identComboPalier),
				}),
			),
		);
		const lArrAfficherEltsPartages = [];
		if (!this.optionsFenetre.contextePrimaire) {
			lArrAfficherEltsPartages.push(
				IE.jsx.str(
					"div",
					{ class: "PetitEspaceBas" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModeleCheckboxAfficherEltsPartages.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.Matiere.AfficherEltPartages",
						),
					),
				),
			);
		}
		const lId = `${this.Nom}_sec_mat`;
		T.push('<div class="EspaceHaut">');
		T.push(
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str("div", {
					"ie-html": "getHtmlParMatiere",
					class: "PetitEspaceBas",
					id: lId,
				}),
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche", role: "group", "aria-labelledby": lId },
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceBas" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model":
									this.jsxModeleCheckboxAfficherEltDuProfesseur.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.Matiere.AfficherEltDuProfesseur",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceBas" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxAfficherBO.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.Matiere.AfficherLSU",
							),
						),
					),
					lArrAfficherEltsPartages.join(""),
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceBas" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model":
									this.jsxModeleCheckboxAfficherCompetences.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.Matiere.AfficherCompetences",
							),
						),
					),
				),
			),
		);
		if (!this.optionsFenetre.contextePrimaire) {
			T.push(
				IE.jsx.str(
					"div",
					{ "ie-if": "estAfficherDansContexteBulletin()" },
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceBas" },
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": this.jsxModeleRadioFiltreActif.bind(
									this,
									this.TypeAffichage.ParEltSaisisCDT,
								),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.SaisieCDT.AfficherEltCDT",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "NoWrap" },
						IE.jsx.str(
							"div",
							{ class: "GrandEspaceGauche InlineBlock" },
							IE.jsx.str(
								"ie-checkbox",
								{ "ie-model": this.jsxModeleCheckboxFiltreTravail.bind(this) },
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ElementsProgramme.SaisieCDT.AfficherLesEltsParOccurence1_2",
								),
								IE.jsx.str("ie-inputnote", {
									class: "m-left m-right",
									"ie-model": "inputNbTravail",
									style: "width:30px;",
									"aria-label": ObjetTraduction_1.GTraductions.getValeur(
										"Fenetre_ElementsProgramme.SaisieCDT.AfficherLesEltsParOccurence2_2",
									),
								}),
								ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ElementsProgramme.SaisieCDT.AfficherLesEltsParOccurence2_2",
								),
							),
						),
					),
				),
			);
		}
		T.push(
			IE.jsx.str("div", {
				id: this.getNomInstance(this.identListe),
				class: "EspaceHaut",
				style: "width: 100%; min-height: 350px;",
			}),
		);
		T.push(
			IE.jsx.str("div", {
				class: "EspaceHaut",
				"ie-if": "estAfficherDansContexteBulletin()",
				"ie-html": "getHtmlNbMax",
			}),
		);
		T.push(
			IE.jsx.str(
				"div",
				{
					class: "EspaceHaut",
					"ie-if": this.jsxIfPanelComptabiliserPourBulletinVisible.bind(this),
				},
				IE.jsx.str(
					"div",
					{ class: "Gras" },
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.SaisieCDT.ReportSurBulletin",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche EspaceHaut" },
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model":
									this.jsxModeleCheckboxComptabiliserPourBulletin.bind(this),
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.SaisieCDT.ComptabiliserPourBulletin",
							),
						),
					),
					IE.jsx.str(
						"div",
						{
							"ie-if": "panelComptabiliserPourBulletin.avecComboChoixServices",
						},
						IE.jsx.str(
							"div",
							{ class: "EspaceHaut" },
							IE.jsx.str("ie-combo", {
								"ie-model":
									"panelComptabiliserPourBulletin.comboChoixServicesPourBulletin",
								"aria-label": ObjetTraduction_1.GTraductions.getValeur(
									"Fenetre_ElementsProgramme.SaisieCDT.LimiteDuReport",
								),
							}),
						),
						IE.jsx.str(
							"div",
							null,
							ObjetTraduction_1.GTraductions.getValeur(
								"Fenetre_ElementsProgramme.SaisieCDT.LimiteDuReport",
							),
						),
					),
					IE.jsx.str("div", {
						"ie-if": "panelComptabiliserPourBulletin.sansComboChoixServices",
						"ie-html": "panelComptabiliserPourBulletin.getMessageAucunService",
					}),
				),
			),
		);
		return T.join("");
	}
	composeBas() {
		const lAffichageBoutonAffectation = [];
		if (!this.appSco.estPrimaire) {
			lAffichageBoutonAffectation.push(
				IE.jsx.str(
					"ie-bouton",
					{ "ie-model": "btnAffectation" },
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.AffecterA",
					),
				),
			);
		}
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain", "ie-if": "estAfficherDansContexteBulletin()" },
				lAffichageBoutonAffectation.join(""),
				IE.jsx.str(
					"ie-bouton",
					{ "ie-model": "btnOrdonnerElements", class: "MargeGauche" },
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.OrdonnerElements",
					),
				),
			),
		);
		return T.join("");
	}
	surValidation(aGenreBouton) {
		this.fermer();
		let lListe = this.donnees.listeElementsProgramme;
		if (aGenreBouton === 1) {
			lListe = this.donnees.listeElementsProgramme_saisie;
			lListe.avecSaisie = true;
			lListe.setSerialisateurJSON({ ignorerEtatsElements: true });
		}
		const lEstValider = aGenreBouton === 1;
		const lDonneesCallback = {
			listeElementsProgramme: lListe,
			palierActif: this.donnees.palier,
		};
		if (
			this.appSco.parametresUtilisateur.get(
				"CDT.ElementProgramme.ComptabiliserPourBulletin",
			) &&
			!!this.serviceDuCoursSelectionne
		) {
			lDonneesCallback.servicePourComptabilisationBulletin =
				this.serviceDuCoursSelectionne;
		}
		this.callback.appel(lEstValider, lDonneesCallback);
	}
	_estFiltreParMatiere() {
		return (
			this.appSco.parametresUtilisateur.get(
				"CDT.ElementProgramme.TypeAffichage",
			) === this.TypeAffichage.ParMatiere
		);
	}
	_estFiltreParDomaine() {
		return (
			this.appSco.parametresUtilisateur.get(
				"CDT.ElementProgramme.TypeAffichage",
			) === this.TypeAffichage.ParDomaine
		);
	}
	_estFiltreParElementsSaisisCDT() {
		return (
			this.appSco.parametresUtilisateur.get(
				"CDT.ElementProgramme.TypeAffichage",
			) === this.TypeAffichage.ParEltSaisisCDT
		);
	}
	_getPromesseConfirmationSaisieAffectation(aSelectionServices) {
		let lAvecElementsClasse = false;
		aSelectionServices.parcourir((D) => {
			if (D.avecElements) {
				lAvecElementsClasse = true;
				return false;
			}
		});
		return lAvecElementsClasse
			? this.appSco
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.SuppressionEltsTravilles",
						),
					})
					.then((aGenreAction) => {
						if (aGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
							return Promise.reject();
						}
					})
			: Promise.resolve();
	}
	_getListeAvecFils(aListe) {
		const lListe = new ObjetListeElements_1.ObjetListeElements(),
			lListeTousElements = this.donnees.liste;
		aListe.parcourir((aElement) => {
			lListe.addElement(aElement);
			if (
				aElement.getGenre() !==
				Enumere_Ressource_1.EGenreRessource.ElementProgramme
			) {
				lListeTousElements.parcourir((aElementFils) => {
					if (
						aElementFils.pere &&
						aElementFils.pere.getNumero() === aElement.getNumero()
					) {
						lListe.addElement(aElementFils);
					}
				});
			}
		});
		return lListe;
	}
	_modifierLibelle(aListe, aElementSource) {
		const lTrouve = aListe.getElementParElement(aElementSource);
		if (lTrouve) {
			lTrouve.Libelle = aElementSource.getLibelle();
		}
	}
	_gererSuppressionElement(aListe, aElementSource) {
		const lIndice = aListe.getIndiceParElement(aElementSource);
		if (lIndice >= 0 && MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
			aListe.remove(lIndice);
		}
	}
	_saisie(aListe, aEstSuppression) {
		aListe.setSerialisateurJSON({
			methodeSerialisation: function (aElement, aJSON) {
				aJSON.pere = aElement.pere;
				if (aElement.actif) {
					aJSON.coche = true;
				}
				aJSON.partage = aElement.partage;
			},
		});
		new ObjetRequeteSaisieElementsProgramme(this)
			.lancerRequete({
				typeSaisie: this.appSco.parametresUtilisateur.get(
					"CDT.ElementProgramme.TypeAffichage",
				),
				matiere: this.donnees.matiere,
				palier: this.donnees.palier,
				service: this.donnees.service,
				liste: aListe,
			})
			.then(
				(aReponse) => {
					if (
						aReponse.genreReponse ===
						ObjetRequeteJSON_1.EGenreReponseSaisie.succes
					) {
						if (aReponse.JSONRapportSaisie.liste) {
							aReponse.JSONRapportSaisie.liste.parcourir((aElement) => {
								if (aElement.coche) {
									this.donnees.listeElementsProgramme_saisie.addElement(
										aElement,
									);
								}
								this._modifierLibelle(
									this.donnees.listeElementsProgramme,
									aElement,
								);
								this._modifierLibelle(
									this.donnees.listeElementsProgramme_saisie,
									aElement,
								);
							}, this);
						}
						if (aEstSuppression) {
							this._getListeAvecFils(aListe).parcourir((aElement) => {
								this._gererSuppressionElement(
									this.donnees.listeElementsProgramme,
									aElement,
								);
								this._gererSuppressionElement(
									this.donnees.listeElementsProgramme_saisie,
									aElement,
								);
							}, this);
						}
					}
					this._actualiserListe(aReponse.JSONRapportSaisie.liste, null, {
						conserverPositionScroll: true,
					});
				},
				() => {
					this._actualiserListe();
				},
			);
	}
	_evenementSurliste(aParametres) {
		let lListe;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				aParametres.instance.setCreationLigne(aParametres.ligne);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				switch (aParametres.idColonne) {
					case DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
						.genreColonne.coche: {
						if (
							aParametres.article.getGenre() !==
								Enumere_Ressource_1.EGenreRessource.ElementProgramme &&
							aParametres.article.getGenre() !==
								Enumere_Ressource_1.EGenreRessource.Competence
						) {
							return;
						}
						if (
							aParametres.article.getGenre() ===
								Enumere_Ressource_1.EGenreRessource.Competence &&
							aParametres.article.actif
						) {
							this._saisie(
								new ObjetListeElements_1.ObjetListeElements().addElement(
									aParametres.article,
								),
							);
							return;
						}
						const lIndice =
							this.donnees.listeElementsProgramme_saisie.getIndiceParNumeroEtGenre(
								aParametres.article.getNumero(),
							);
						if (aParametres.article.actif) {
							if (
								lIndice < 0 ||
								!MethodesObjet_1.MethodesObjet.isNumber(lIndice)
							) {
								this.donnees.listeElementsProgramme_saisie.addElement(
									aParametres.article,
								);
							} else {
							}
						} else {
							if (
								lIndice >= 0 &&
								MethodesObjet_1.MethodesObjet.isNumber(lIndice)
							) {
								this.donnees.listeElementsProgramme_saisie.remove(lIndice);
							}
						}
						break;
					}
					case DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
						.genreColonne.libelle:
						if (
							aParametres.article.getLibelle() &&
							aParametres.article.getLibelle() !==
								aParametres.article.Libelle_bak &&
							aParametres.article.Libelle_bak !== undefined
						) {
							this._saisie(
								new ObjetListeElements_1.ObjetListeElements().addElement(
									aParametres.article,
								),
							);
						}
						break;
					case DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
						.genreColonne.partage:
						this._saisie(
							new ObjetListeElements_1.ObjetListeElements().addElement(
								aParametres.article,
							),
						);
						break;
					default:
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresCreation:
				this.appSco.parametresUtilisateur.set(
					"CDT.ElementProgramme.AfficherEltDuProfesseur",
					true,
				);
				lListe = new ObjetListeElements_1.ObjetListeElements();
				this.donnees.liste.parcourir((D) => {
					if (D.getEtat() === Enumere_Etat_1.EGenreEtat.Creation) {
						lListe.addElement(D);
					}
				});
				this._saisie(lListe);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				lListe = MethodesObjet_1.MethodesObjet.dupliquer(
					aParametres.listeSuppressions,
				);
				lListe.parcourir((aElement) => {
					aElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				}, this);
				this._saisie(lListe, true);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				switch (aParametres.idColonne) {
					case DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
						.genreColonne.partage: {
						aParametres.article.partage = !aParametres.article.partage;
						aParametres.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						const lListe = this.getInstance(this.identListe);
						lListe.actualiser(true);
						this._saisie(
							new ObjetListeElements_1.ObjetListeElements().addElement(
								aParametres.article,
							),
						);
					}
				}
				break;
			default:
		}
	}
	_initialiserliste(aInstance) {
		let lColonneLibelle = null;
		if (this._estFiltreParMatiere() && !!this.donnees.matiere) {
			lColonneLibelle = this.donnees.matiere.getLibelle();
		} else if (this._estFiltreParDomaine() && !!this.donnees.domaine) {
			lColonneLibelle = this.donnees.domaine.getLibelle();
		} else {
			lColonneLibelle = ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.Liste.TitreSaisisDsCDT",
			);
		}
		const lColonnes = [
			{
				id: DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.coche,
				titre: "[Image_CocheVerte as-icon]",
				hint: GlossaireWAI_1.TradGlossaireWAI.Coche,
				taille: 20,
			},
			{
				id: DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.deploiement,
				titre: lColonneLibelle,
				taille: 7,
			},
			{
				id: DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.libelle,
				titre: TypeFusionTitreListe_1.TypeFusionTitreListe.FusionGauche,
				taille: "100%",
			},
		];
		if (this.donnees.service) {
			lColonnes.push({
				id: DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.nombre,
				titre: {
					libelleHtml:
						'<div class="Image_CahierDeTexte" style="margin-left:auto; margin-right:auto;"></div>',
				},
				hint: ObjetChaine_1.GChaine.format(
					ObjetTraduction_1.GTraductions.getValeur(
						"Fenetre_ElementsProgramme.HintTitreOccurence",
					),
					[this.donnees.periode ? this.donnees.periode.getLibelle() : ""],
				),
				taille: 30,
			});
		}
		lColonnes.push({
			id: DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
				.genreColonne.proprietaire,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.TitreSaisiPar",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.HintTitreSaisiPar",
			),
			taille: 140,
		});
		if (!this.optionsFenetre.contextePrimaire) {
			lColonnes.push({
				id: DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.partage,
				titre: {
					libelleHtml:
						'<i role="img" class="icon_fiche_cours_partage" aria-label="' +
						ObjetTraduction_1.GTraductions.getValeur(
							"Fenetre_ElementsProgramme.HintTitrePartage",
						) +
						' "style="font-size: 1.4rem;"></i>',
				},
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"Fenetre_ElementsProgramme.HintTitrePartage",
				),
				taille: 20,
			});
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			listeCreations:
				DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.libelle,
			avecLigneCreation:
				this._estFiltreParMatiere() &&
				!this.appSco.droits.get(ObjetDroitsPN_1.TypeDroits.estEnConsultation),
			titreCreation: ObjetTraduction_1.GTraductions.getValeur(
				"Fenetre_ElementsProgramme.Liste.Creation",
			),
			colonnesSansBordureDroit: [
				DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme
					.genreColonne.deploiement,
			],
			AvecSuppression: !this.appSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.estEnConsultation,
			),
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.supprimer },
			],
		});
	}
	_actualiserListe(aListeSelection, aParamsAvecListes, aParamsObjetListe) {
		const lParamsAvecListes = {};
		lParamsAvecListes.avecListeMatieres =
			!aParamsAvecListes || aParamsAvecListes.avecListeMatieres !== false;
		lParamsAvecListes.avecListeDomaines =
			!aParamsAvecListes || aParamsAvecListes.avecListeDomaines !== false;
		const lAvecListeServicesDuCours =
			!this.estAffichageDuBulletin() && !this.donnees.listeServicesDuCours;
		const lParam = {
			cours: this.donnees.cours,
			numeroSemaine: this.donnees.numeroSemaine,
			service: this.donnees.service,
			periode: this.donnees.periode,
			progression: this.donnees.progression,
			cahierJournal: this.donnees.cahierJournal
				? this.donnees.cahierJournal.toJSON()
				: null,
			ressource: this.donnees.ressource,
			contenu: this.donnees.contenu,
			palier: this.donnees.palier,
			matiere: this._estFiltreParMatiere() ? this.donnees.matiere : null,
			domaine: this._estFiltreParDomaine() ? this.donnees.domaine : null,
			avecListePaliers: !this.parametresJSON.listePaliers,
			avecListeMatiere: lParamsAvecListes.avecListeMatieres,
			avecListeDomaines: lParamsAvecListes.avecListeDomaines,
			avecListeServicesDuCours: lAvecListeServicesDuCours,
		};
		if (!!this.donnees.cahierJournal && !!this.donnees.cahierJournal.matiere) {
			lParam.cahierJournal.matiere =
				this.donnees.cahierJournal.matiere.toJSON();
		}
		return new ObjetRequeteListeElementsProgramme_1.ObjetRequeteListeElementsProgramme(
			this,
		)
			.lancerRequete(lParam)
			.then((aJSON) => {
				this._actionSurListeElementsProgramme(
					aListeSelection,
					aJSON,
					aParamsObjetListe,
				);
			});
	}
	_actualiserSurModeExclusif() {
		this._actualiserListe(
			this.getInstance(this.identListe).getListeElementsSelection(),
		);
	}
	_actionSurListeElementsProgramme(aListeSelection, aJSON, aParamsListe) {
		this.parametresJSON = $.extend(
			{ nbMaxElements: 0 },
			this.parametresJSON,
			aJSON,
		);
		if (
			aJSON.palierParDefaut &&
			(!this.donnees.palier || this.donnees.palier.getNumero() === 0)
		) {
			this.donnees.palier = aJSON.palierParDefaut;
		}
		if (aJSON.listePaliers) {
			this.getInstance(this.identComboPalier).setDonnees(
				this.parametresJSON.listePaliers,
				this.parametresJSON.listePaliers.getIndiceParElement(
					this.donnees.palier,
				),
			);
		}
		if (aJSON.matiere && !this.donnees.matiere) {
			this.donnees.matiere = aJSON.matiere;
		}
		if (aJSON.domaine && !this.donnees.domaine) {
			this.donnees.domaine = aJSON.domaine;
		}
		if (aJSON.listeMatieres) {
			this.listeMatieres = aJSON.listeMatieres;
			this.listeMatieres.trier();
		}
		if (aJSON.listeDomaines) {
			this.getInstance(this.identComboDomaine).setDonnees(
				aJSON.listeDomaines,
				aJSON.listeDomaines.getIndiceParElement(this.donnees.domaine),
			);
		}
		if (aJSON.listeServicesDuCours) {
			this.donnees.listeServicesDuCours = aJSON.listeServicesDuCours;
		}
		this.getInstance(this.identComboDomaine).setActif(
			this._estFiltreParDomaine(),
		);
		this._initialiserliste(this.getInstance(this.identListe));
		let lNbElementsActuelHorsListe = !!this.donnees
			.listeElementsProgramme_saisie
			? this.donnees.listeElementsProgramme_saisie.count()
			: 0;
		const lAncienneListeProgramme = this.donnees.liste;
		this.donnees.liste = aJSON.listeElementsProgramme;
		let lPere = null;
		if (this.donnees.liste) {
			this.donnees.liste.parcourir((aElement) => {
				if (
					aElement.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ChapitreEltPgm ||
					aElement.getGenre() ===
						Enumere_Ressource_1.EGenreRessource.ElementPilier
				) {
					lPere = aElement;
					aElement.estUnDeploiement = true;
					const lAncienElement = lAncienneListeProgramme
						? lAncienneListeProgramme.getElementParElement(aElement)
						: null;
					aElement.estDeploye = lAncienElement
						? lAncienElement.estDeploye
						: true;
				} else {
					aElement.pere = lPere;
					aElement.estUnDeploiement = false;
					aElement.actif =
						!!this.donnees.listeElementsProgramme_saisie.getElementParNumero(
							aElement.getNumero(),
						);
					if (aElement.actif) {
						lNbElementsActuelHorsListe--;
					}
				}
			}, this);
		}
		const lDonneesListe =
			new DonneesListe_ElementsProgramme_1.DonneesListe_ElementsProgramme(
				this.donnees.liste,
				{
					periode: this.donnees.periode,
					nbElementsActuelHorsListe: lNbElementsActuelHorsListe,
					nbMaxElements: this.parametresJSON.nbMaxElements,
					avecCreationPossible:
						!this.appSco.droits.get(
							ObjetDroitsPN_1.TypeDroits.estEnConsultation,
						) && !this._estFiltreParDomaine(),
				},
			);
		this.getInstance(this.identListe).setDonnees(
			lDonneesListe,
			null,
			aParamsListe,
		);
		if (aListeSelection) {
			this.getInstance(this.identListe).setListeElementsSelection(
				aListeSelection,
				{ avecScroll: true },
			);
		}
	}
}
exports.ObjetFenetre_ElementsProgramme = ObjetFenetre_ElementsProgramme;
