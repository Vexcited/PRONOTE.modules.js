exports.ObjetFenetre_DemandesMissions = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeOrigineCreationAvanceeTravaux_1 = require("TypeOrigineCreationAvanceeTravaux");
const ObjetElement_1 = require("ObjetElement");
const TypeDestinationDemandeTravaux_1 = require("TypeDestinationDemandeTravaux");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Etat_1 = require("Enumere_Etat");
const TypeGenreTravauxIntendance_1 = require("TypeGenreTravauxIntendance");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const PageMissionsDemande_1 = require("PageMissionsDemande");
const PageMissionsTraitement_1 = require("PageMissionsTraitement");
const ObjetMoteurTravaux_js_1 = require("ObjetMoteurTravaux.js");
const TypeNiveauDUrgence_1 = require("TypeNiveauDUrgence");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const EGenreAffichage = { demande: "demande", traitement: "traitement" };
class ObjetFenetre_DemandesMissions extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = GApplication;
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.setOptionsFenetre({
			avecComposeBasInFooter: true,
			titre: "",
			largeur: 450,
			hauteur: 450,
			avecScroll: true,
			avecTailleSelonContenu: false,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Fermer"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	setDonnees(aParams) {
		this.droits = aParams.droits;
		this.listeNatureTvx = aParams.listeNatureTvx;
		this.listePJ = aParams.listePJ;
		this.estEnCreation = aParams.estEnCreation;
		this.listeExecutantsSelectionnes = aParams.listeExecutantsSelectionnes;
		this.idZoneContenu = this.getInstance(this.identZoneDemande).getNom();
		this.listeNiveauUrgence =
			TypeNiveauDUrgence_1.TypeNiveauDUrgenceUtil.toListe();
		this.listeEtatsAvancement = aParams.listeEtatsAvancement;
		this.listeSalleLieu = aParams.listeSallesLieu;
		this.genreTravaux = aParams.genreTravaux;
		this.estEnDuplication = aParams.estEnDuplication;
		this.enModification = false;
		this.callbackSupprimer = aParams.callbackSupprimer;
		if (!!aParams.demandeCourante && !this.estEnDuplication) {
			this.demandeCourante = aParams.demandeCourante;
			this.enModification = true;
		} else if (!!aParams.demandeCourante && this.estEnDuplication) {
			this.demandeCourante = aParams.demandeCourante;
			this.demandeCourante = this.dupliquerDemande(this.demandeCourante);
		} else {
			this.demandeCourante = this.creerNouvelleDemande();
		}
		this.destination = this.demandeCourante.destination;
		this.moteur = new ObjetMoteurTravaux_js_1.ObjetMoteurTravaux(aParams);
		this.afficher(this.composeContenu());
		const lListeOnglet = new ObjetListeElements_1.ObjetListeElements();
		lListeOnglet.add(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"TvxIntendance.TitreSurColonne.Demande",
				),
				null,
				EGenreAffichage.demande,
			),
		);
		if (!this.estEnCreation) {
			lListeOnglet.add(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.TitreSurColonne.Traitement",
					),
					null,
					EGenreAffichage.traitement,
				),
			);
		}
		this.getInstance(this.identTabs).setDonnees(lListeOnglet, 0, true);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnSupprimer: {
				async event() {
					var _a;
					if (!!aInstance.demandeCourante) {
						aInstance.fermer();
						if (
							(await ObjetMoteurTravaux_js_1.ObjetMoteurTravaux.getMessageSuppresion()) ===
							Enumere_Action_1.EGenreAction.Valider
						) {
							(_a =
								aInstance === null || aInstance === void 0
									? void 0
									: aInstance.callbackSupprimer) === null || _a === void 0
								? void 0
								: _a.call(aInstance, aInstance.demandeCourante);
						}
					}
				},
				visible() {
					var _a;
					return !!(
						(aInstance === null || aInstance === void 0
							? void 0
							: aInstance.callbackSupprimer) &&
						aInstance.demandeCourante &&
						!aInstance.estEnCreation &&
						!!((_a = aInstance.moteur) === null || _a === void 0
							? void 0
							: _a.estIdentificationEditable(aInstance.demandeCourante))
					);
				},
			},
		});
	}
	construireInstances() {
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._evenementChxModeAff,
			this.initTabs,
		);
		this.identZoneDemande = this.add(PageMissionsDemande_1.PageMissionsDemande);
		this.identZoneTraitement = this.add(
			PageMissionsTraitement_1.PageMissionsTraitement,
		);
	}
	_evenementChxModeAff(aObjet) {
		const lModeAffichageSelectionne = aObjet.getGenre();
		if (this.modeAffichage === lModeAffichageSelectionne) {
			return;
		}
		this.getInstance(this.identZoneTraitement).setVisible(
			lModeAffichageSelectionne === EGenreAffichage.traitement,
		);
		this.getInstance(this.identZoneDemande).setVisible(
			lModeAffichageSelectionne === EGenreAffichage.demande,
		);
		switch (lModeAffichageSelectionne) {
			case EGenreAffichage.demande:
				this.idZoneContenu = this.getInstance(this.identZoneDemande).getNom();
				this.getInstance(this.identZoneDemande).setDonnees({
					listeNatureTvx: this.listeNatureTvx,
					demandeCourante: this.demandeCourante,
					dateEcheance: this.demandeCourante.dateEcheance,
					listeNiveauUrgence: this.listeNiveauUrgence,
					listeSalleLieu: this.listeSalleLieu,
					listeLieux: this.listeLieux,
					listePJ: this.listePJ,
					estEnCreation: this.estEnCreation,
					enModification: this.enModification,
					estEnDuplication: this.estEnDuplication,
					dateRealisation: this.dateRealisation,
					genreTravaux: this.genreTravaux,
					droits: this.droits,
					destination: this.destination,
				});
				this.demandeCourante = this.getInstance(
					this.identZoneDemande,
				).getDonnees();
				break;
			case EGenreAffichage.traitement:
				this.idZoneContenu = this.getInstance(
					this.identZoneTraitement,
				).getNom();
				this.getInstance(this.identZoneTraitement).setDonnees({
					listeNatureTvx: this.listeNatureTvx,
					demandeCourante: this.demandeCourante,
					dateEcheance: this.demandeCourante.dateEcheance,
					listeNiveauUrgence: this.listeNiveauUrgence,
					listeSalleLieu: this.listeSalleLieu,
					listePJ: this.listePJ,
					estEnCreation: this.estEnCreation,
					enModification: this.enModification,
					dateRealisation: this.dateRealisation,
					genreTravaux: this.genreTravaux,
					duree: this.duree,
					droits: this.droits,
					destination: this.destination,
				});
				this.demandeCourante = this.getInstance(
					this.identZoneTraitement,
				).getDonnees();
				break;
			default:
				break;
		}
		this.modeAffichage = lModeAffichageSelectionne;
	}
	initTabs() {}
	composeContenu() {
		if (!this.demandeCourante) {
			return "";
		}
		return IE.jsx.str(
			IE.jsx.fragment,
			null,
			IE.jsx.str(
				"div",
				null,
				IE.jsx.str(
					"label",
					{ class: ["ie-titre-petit m-bottom m-top-xl"] },
					ObjetTraduction_1.GTraductions.getValeur(
						"TvxIntendance.colonne.etatAvancement",
					),
				),
			),
			IE.jsx.str(
				"div",
				{ class: "flex-contain  m-top-l m-bottom-l field-contain" },
				IE.jsx.str("i", {
					class:
						TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravauxUtil.getClassIcone(
							this.demandeCourante.etat.getGenre(),
						),
				}),
				IE.jsx.str(
					"span",
					{ class: "m-left-l" },
					this.demandeCourante.etat.getLibelle(),
				),
			),
			IE.jsx.str("div", {
				class: "menu-tabs-wrapper m-bottom-xxl",
				id: this.getInstance(this.identTabs).getNom(),
			}),
			IE.jsx.str(
				"div",
				{ id: "idContenu" },
				IE.jsx.str("div", {
					class: "flex-contain  m-top-l m-bottom-l",
					id: this.getInstance(this.identZoneDemande).getNom(),
				}),
				IE.jsx.str("div", {
					class: "flex-contain  m-top-l m-bottom-l",
					id: this.getInstance(this.identZoneTraitement).getNom(),
				}),
			),
		);
	}
	creerNouvelleDemande() {
		const lDemande = ObjetElement_1.ObjetElement.create();
		const lUserConnecte = GEtatUtilisateur.getUtilisateur();
		const lEtatDemande = this.listeEtatsAvancement.getElementParGenre(
			TypeOrigineCreationAvanceeTravaux_1.TypeOrigineCreationAvanceeTravaux
				.OCAT_EnAttente,
		);
		lDemande.detail = "";
		lDemande.listePJ = new ObjetListeElements_1.ObjetListeElements();
		lDemande.dateCreation = new Date();
		lDemande.destination =
			TypeDestinationDemandeTravaux_1.TypeDestinationDemandeTravaux.DDT_Interne;
		lDemande.genreTravaux = this.genreTravaux;
		lDemande.demandeur = new ObjetElement_1.ObjetElement(
			lUserConnecte.getLibelle(),
			lUserConnecte.getNumero(),
			lUserConnecte.getGenre(),
		);
		lDemande.etat = ObjetElement_1.ObjetElement.create({
			Libelle: lEtatDemande.getLibelle(),
			Numero: lEtatDemande.getNumero(),
			Genre: lEtatDemande.Genre,
		});
		lDemande.dateEcheance = this.dateEcheance;
		lDemande.niveauDUrgence = this.niveauDUrgence;
		lDemande.listeLieux = new ObjetListeElements_1.ObjetListeElements();
		lDemande.dateRealisation = this.dateRealisation;
		lDemande.listeExecutants = this.listeExecutants;
		lDemande.commentaire = this.commentaire;
		lDemande.remarque = this.remarque;
		lDemande.duree = this.duree;
		lDemande.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		return lDemande;
	}
	dupliquerDemande(aDemandeCourante) {
		const lDemande = this.creerNouvelleDemande();
		if (aDemandeCourante.nature) {
			lDemande.nature = aDemandeCourante.nature;
		}
		if (aDemandeCourante.detail) {
			lDemande.detail = aDemandeCourante.detail;
		}
		if (aDemandeCourante.listeLieux) {
			lDemande.listeLieux = this.setEtatLieux(aDemandeCourante.listeLieux);
		}
		if (aDemandeCourante.niveauDUrgence) {
			lDemande.niveauDUrgence = aDemandeCourante.niveauDUrgence;
		}
		if (aDemandeCourante.listePJ) {
			lDemande.listePJ = new ObjetListeElements_1.ObjetListeElements().add(
				aDemandeCourante.listePJ,
			);
			lDemande.listePJ.parcourir((aPJ) => {
				aPJ.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
			});
		}
		return lDemande;
	}
	setEtatLieux(aElements) {
		for (let i = 0; i < aElements.count(); i++) {
			const lLieu = aElements.get(i);
			lLieu.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		return aElements;
	}
	surValidation(aGenreBouton) {
		if (aGenreBouton === 1) {
			this.demandeCourante.listeExecutants;
			if (!!this.demandeCourante.detail) {
				this.fermer();
				if (this.enModification) {
					this.demandeCourante.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				}
				this.callback.appel(
					aGenreBouton,
					this.demandeCourante,
					this.demandeCourante.listePJ,
				);
			} else {
				const lCleMsg =
					this.genreTravaux ===
					TypeGenreTravauxIntendance_1.TypeGenreTravauxIntendance.GTI_Commande
						? "TvxIntendance.fenetre.msgDetailCommandeObligatoire"
						: "TvxIntendance.fenetre.msgDetailTacheObligatoire";
				GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetTraduction_1.GTraductions.getValeur(lCleMsg),
				});
			}
		} else {
			this.fermer();
		}
	}
	composeBas() {
		return IE.jsx.str(
			"div",
			{ class: ["compose-bas"] },
			IE.jsx.str("ie-btnicon", {
				title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
				class: "icon_trash avecFond i-medium",
				"ie-model": "btnSupprimer",
				"ie-if": "btnSupprimer.visible",
			}),
		);
	}
}
exports.ObjetFenetre_DemandesMissions = ObjetFenetre_DemandesMissions;
