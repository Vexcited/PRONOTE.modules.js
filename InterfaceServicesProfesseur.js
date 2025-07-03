exports.InterfaceServicesProfesseur = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_ServicesProfesseur_1 = require("DonneesListe_ServicesProfesseur");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const ObjetFenetre_SaisieSousService_1 = require("ObjetFenetre_SaisieSousService");
const ObjetRequeteListeServices_1 = require("ObjetRequeteListeServices");
const ObjetRequeteSaisieSousServices_1 = require("ObjetRequeteSaisieSousServices");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetRequeteProgrammesBO_1 = require("ObjetRequeteProgrammesBO");
const ObjetRequeteCreationDevoirDNL_1 = require("ObjetRequeteCreationDevoirDNL");
const Invocateur_1 = require("Invocateur");
const Invocateur_2 = require("Invocateur");
const Enumere_Onglet_1 = require("Enumere_Onglet");
class InterfaceServicesProfesseur extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilSco = this.applicationSco.getEtatUtilisateur();
		this.droits = {
			creerSousService: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.services.avecCreationSousServices,
			),
			modifierCoefGeneral: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.services.avecModificationCoefGeneral,
			),
			avecGestionNotation: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionNotation,
			),
			avecColonneDNL: this.applicationSco.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites
					.importExportEducationNationale,
			),
		};
	}
	construireInstances() {
		this.identTripleCombo = this.add(
			InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
			this._eventSurDernierMenuDeroulant.bind(this),
			this._initTripleCombo,
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListe.bind(this),
			this._initialiserListe.bind(this),
		);
		this.identFenetre_SaisieSousService = this.addFenetre(
			ObjetFenetre_SaisieSousService_1.ObjetFenetre_SaisieSousService,
			this._eventFenetreSaisieSousService,
			this._initFenetreSaisieSousService,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		if (this.droits.creerSousService === true) {
			this.AddSurZone.push({
				html: IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": this.jsxBtnCreerSousService.bind(this),
						class: "small-bt",
						title: ObjetChaine_1.GChaine.toTitle(
							ObjetTraduction_1.GTraductions.getValeur(
								"servicesProfesseur.CommandeCreerSousService",
							),
						),
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.CommandeCreerSousService",
					),
				),
				alignementDroite: true,
			});
		}
	}
	jsxBtnCreerSousService() {
		const lInstance = this;
		return {
			event() {
				const lListeServices = lInstance.getInstance(lInstance.identListe);
				if (!!lListeServices) {
					lInstance._callbackCreerSousService(
						lListeServices.getListeElementsSelection().getPremierElement(),
					);
				}
			},
			getDisabled() {
				const lListeServices = lInstance.getInstance(lInstance.identListe);
				if (!!lListeServices) {
					const objElementSelectionne = lListeServices
						.getListeElementsSelection()
						.getPremierElement();
					if (
						!!objElementSelectionne &&
						objElementSelectionne.estService === true &&
						lInstance.droits.creerSousService === true
					) {
						return false;
					}
				}
				return true;
			},
		};
	}
	_recupererDonnees() {
		const lPeriode = this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
		new ObjetRequeteListeServices_1.ObjetRequeteListeServices(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(this.etatUtilSco.getUtilisateur(), null, lPeriode);
	}
	actionSurRecupererDonnees(aListeServices) {
		this.listeServices = aListeServices;
		if (this.listeServices) {
			this.listeServices.parcourir((aService) => {
				if (aService.services && aService.services.count() > 0) {
					aService.services.parcourir((aSousService) => {
						aSousService.pere = aService;
					});
					aService.estUnDeploiement = true;
					aService.estDeploye = true;
				}
			});
		}
		const lOptionsListe = {
			avecCreerSousServices: this.droits.creerSousService,
			callbackCreerSousService: this._callbackCreerSousService.bind(this),
			callbackSupprimerSousService:
				this._callbackSupprimerSousService.bind(this),
			callbackCreerDevoirDNL: this._callbackCreerDevoirDNL.bind(this),
			avecEdition: this.droits.modifierCoefGeneral,
			avecGestionNotation: this.droits.avecGestionNotation,
		};
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur(
				this.listeServices,
				lOptionsListe,
			),
		);
	}
	_supprimerSousService(aSousService, aParametres) {
		const lThis = this;
		const lAncienEtatSousService = aSousService.Etat;
		aSousService.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		new ObjetRequeteSaisieSousServices_1.ObjetRequeteSaisieSousServices(
			this,
			(aJSON) => {
				if (
					(aJSON === null || aJSON === void 0 ? void 0 : aJSON.JSONReponse) &&
					(aJSON.JSONReponse.messageConfirmation ||
						aJSON.JSONReponse.messageInformation)
				) {
					aSousService.setEtat(lAncienEtatSousService);
					if (!!aJSON.JSONReponse.messageConfirmation) {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: aJSON.JSONReponse.messageConfirmation,
							callback: function (aGenreAction) {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									lThis._supprimerSousService(aSousService, {
										confirmation: true,
									});
								}
							},
						});
					} else {
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							message: aJSON.JSONReponse.messageInformation,
						});
					}
				} else {
					lThis._recupererDonnees();
				}
			},
		).lancerRequete(Object.assign({ service: aSousService }, aParametres));
	}
	_initFenetreSaisieSousService(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.CreerSousService.TitreFenetre",
			),
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
			largeur: 400,
			hauteur: 470,
		});
	}
	_initTripleCombo(aInstance) {
		aInstance.setParametres([Enumere_Ressource_1.EGenreRessource.Periode]);
	}
	_initialiserListe(aInstance) {
		const lAvecGestionNotation = this.droits.avecGestionNotation;
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.matiere,
			taille: 300,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.Matiere",
			),
		});
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.classe,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.Classe",
			),
		});
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.professeur,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.Professeur",
			),
		});
		if (lAvecGestionNotation) {
			lColonnes.push({
				id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
					.colonnes.facultatif,
				taille: 50,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.Facultatif",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.HintFacultatif",
				),
			});
		}
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.modeDEvaluation,
			taille: 80,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.ModeDEvaluation",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.HintModeDEvaluation",
			),
		});
		if (lAvecGestionNotation) {
			lColonnes.push({
				id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
					.colonnes.nbDevoirs,
				taille: 50,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.NbDevoirs",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.HintNbDevoirs",
				),
			});
		}
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.nbEvaluations,
			taille: 50,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.NbEvaluations",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.HintNbEvaluations",
			),
		});
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.volume,
			taille: 100,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.Volume",
			),
			hint: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.HintVolume",
			),
		});
		if (lAvecGestionNotation) {
			const lgetTitreColonneCoefficient = () => {
				let lTitreColonne = "";
				const lPeriode = this.etatUtilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				);
				if (
					lPeriode &&
					lPeriode.existeNumero() &&
					!GParametres.estPeriodeOfficielle(lPeriode.getNumero())
				) {
					lTitreColonne =
						ObjetTraduction_1.GTraductions.getValeur(
							"servicesProfesseur.CoefficientPeriodeNonOff",
						) +
						" " +
						lPeriode.getLibelle();
				} else {
					lTitreColonne = ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.CoefficientPeriodeOff",
					);
				}
				return lTitreColonne;
			};
			const lgeHintColonneCoeff = () => {
				let lHintColonne = "";
				const lPeriode = this.etatUtilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				);
				if (
					lPeriode &&
					lPeriode.existeNumero() &&
					!GParametres.estPeriodeOfficielle(lPeriode.getNumero())
				) {
					lHintColonne = ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.HintCoefficientPeriodeNonOff",
						[lPeriode.getLibelle()],
					);
				} else {
					lHintColonne = ObjetTraduction_1.GTraductions.getValeur(
						"servicesProfesseur.HintCoefficientPeriodeOff",
					);
				}
				return lHintColonne;
			};
			lColonnes.push({
				id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
					.colonnes.coefficient,
				taille: 50,
				titre: {
					getLibelleHtml: () =>
						IE.jsx.str("span", {
							"ie-html": lgetTitreColonneCoefficient,
							"ie-title": lgeHintColonneCoeff,
						}),
				},
			});
		}
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.periodes,
			taille: 150,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"servicesProfesseur.Periodes",
			),
		});
		lColonnes.push({
			id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.programmesBO,
			taille: 60,
			titre: {
				libelleHtml:
					'<i class="icon_academie i-medium" role="presentation"></i>',
				title: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.HintProgrammesBO",
				),
			},
		});
		if (this.droits.avecColonneDNL) {
			lColonnes.push({
				id: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
					.colonnes.DNL,
				taille: 50,
				titre: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.DNL",
				),
				hint: ObjetTraduction_1.GTraductions.getValeur(
					"servicesProfesseur.HintDNL",
				),
			});
		}
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			scrollHorizontal: true,
			boutons: [{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer }],
		});
		this.etatUtilSco.setTriListe({
			liste: aInstance,
			tri: DonneesListe_ServicesProfesseur_1.DonneesListe_ServicesProfesseur
				.colonnes.matiere,
		});
	}
	_eventSurDernierMenuDeroulant() {
		this._recupererDonnees();
	}
	_evenementListe(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.$refreshSelf();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				this._supprimerSousService(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition:
				new ObjetRequeteSaisieSousServices_1.ObjetRequeteSaisieSousServices(
					this,
					this._recupererDonnees,
				).lancerRequete({
					service: aParametres.article,
					periode: this.etatUtilSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
					),
				});
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionDblClick:
				if (
					!!aParametres.article.liensProgrammesBO &&
					aParametres.article.liensProgrammesBO.count() > 0
				) {
					const lProgrammeBO = aParametres.article.liensProgrammesBO.get(0);
					if (!!lProgrammeBO) {
						new ObjetRequeteProgrammesBO_1.ObjetRequeteProgrammesBO(
							this,
							this._surRecupererProgrammeBO.bind(this, lProgrammeBO),
						).lancerRequete(lProgrammeBO);
					}
				}
				break;
		}
	}
	_surRecupererProgrammeBO(aProgrammeBO, aJSONListeProgrammes, aJSONProgramme) {
		if (!!aJSONProgramme) {
			const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_1.ObjetFenetre,
				{
					pere: this,
					initialiser: function (aInstance) {
						aInstance.setOptionsFenetre({
							titre: aProgrammeBO.titre,
							largeur: 700,
							hauteurMaxContenu: 400,
							listeBoutons: [
								ObjetTraduction_1.GTraductions.getValeur("Fermer"),
							],
							avecScroll: true,
						});
					},
				},
			);
			lFenetre.afficher(aJSONProgramme);
		}
	}
	_eventFenetreSaisieSousService(aParametres) {
		if (aParametres.rafraichissementNecessaire) {
			this._recupererDonnees();
		}
	}
	_callbackCreerSousService(aService) {
		this.getInstance(this.identFenetre_SaisieSousService).requeteDetailService(
			aService,
		);
	}
	_callbackSupprimerSousService(aSousService) {
		this._supprimerSousService(aSousService);
	}
	_callbackCreerDevoirDNL(aService) {
		new ObjetRequeteCreationDevoirDNL_1.ObjetRequeteCreationDevoirDNL(
			this,
			(aJSON) => {
				var _a;
				if (
					(_a =
						aJSON === null || aJSON === void 0
							? void 0
							: aJSON.JSONRapportSaisie) === null || _a === void 0
						? void 0
						: _a.periodeDNL
				) {
					this.etatUtilSco.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.Periode,
						aJSON.JSONRapportSaisie.periodeDNL,
					);
					Invocateur_2.Invocateur.evenement(
						Invocateur_1.ObjetInvocateur.events.navigationOnglet,
						Enumere_Onglet_1.EGenreOnglet.ListeServices,
					);
				}
			},
		).lancerRequete({ service: aService });
	}
}
exports.InterfaceServicesProfesseur = InterfaceServicesProfesseur;
