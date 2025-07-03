exports.InterfacePageDernieresNotes = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetSelection_1 = require("ObjetSelection");
const ObjetTabOnglets_1 = require("ObjetTabOnglets");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteDernieresNotes_1 = require("ObjetRequeteDernieresNotes");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_DernieresNotes_1 = require("DonneesListe_DernieresNotes");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_DetailsNote_1 = require("ObjetFenetre_DetailsNote");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetHtml_1 = require("ObjetHtml");
const MoteurDernieresNotes_1 = require("MoteurDernieresNotes");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const MethodesObjet_1 = require("MethodesObjet");
const AccessApp_1 = require("AccessApp");
var TypeOngletDernieresNotes;
(function (TypeOngletDernieresNotes) {
	TypeOngletDernieresNotes[(TypeOngletDernieresNotes["ParDate"] = 0)] =
		"ParDate";
	TypeOngletDernieresNotes[(TypeOngletDernieresNotes["ParMatiere"] = 1)] =
		"ParMatiere";
})(TypeOngletDernieresNotes || (TypeOngletDernieresNotes = {}));
class InterfacePageDernieresNotes extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.etatUtilSco = (0, AccessApp_1.getApp)().getEtatUtilisateur();
		this.listePeriodes = new ObjetListeElements_1.ObjetListeElements();
		this.periodeCourant = new ObjetElement_1.ObjetElement();
		this.indiceParDefaut = 0;
		this.listeTabs = new ObjetListeElements_1.ObjetListeElements();
		if (!this.etatUtilSco.infosSupp) {
			this.etatUtilSco.infosSupp = {};
		}
		if (!this.etatUtilSco.infosSupp.DernieresNotesMobile) {
			this.etatUtilSco.infosSupp.DernieresNotesMobile = {};
		}
		if (
			!MethodesObjet_1.MethodesObjet.isNumeric(
				this.etatUtilSco.infosSupp.DernieresNotesMobile.genreOngletSelectionne,
			)
		) {
			this.etatUtilSco.infosSupp.DernieresNotesMobile.genreOngletSelectionne =
				TypeOngletDernieresNotes.ParDate;
		}
		this.ongletAffiche = this.getGenreOngletSelectionne();
		this.moteur = new MoteurDernieresNotes_1.MoteurDernieresNotes();
		this.moteurBulletin =
			new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
	}
	construireInstances() {
		this.idListeDevoirs = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListeDevoirs.bind(this),
			this._initialiserListeDevoirs.bind(this),
		);
		this.identSelection = this.add(
			ObjetSelection_1.ObjetSelection,
			this.surSelectionPeriode,
			this._initSelecteur.bind(this),
		);
		this.identTabs = this.add(
			ObjetTabOnglets_1.ObjetTabOnglets,
			this._eventSurTabs.bind(this),
		);
		const lElementDate = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("Date"),
			null,
			TypeOngletDernieresNotes.ParDate,
			null,
			false,
		);
		this.listeTabs.addElement(lElementDate);
		const lElementMatiere = new ObjetElement_1.ObjetElement(
			ObjetTraduction_1.GTraductions.getValeur("Matiere"),
			null,
			TypeOngletDernieresNotes.ParMatiere,
			null,
			false,
		);
		this.listeTabs.addElement(lElementMatiere);
		this.AddSurZone = [this.identSelection, this.identTabs];
	}
	setParametresGeneraux() {
		super.setParametresGeneraux();
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str("section", {
			class: "ListeDernieresNotes full-height",
			id: this.getInstance(this.idListeDevoirs).getNom(),
		});
	}
	getGenreOngletSelectionne() {
		return this.etatUtilSco.infosSupp.DernieresNotesMobile
			.genreOngletSelectionne;
	}
	sauverGenreOngletSelectionne(aGenreOnglet) {
		this.etatUtilSco.infosSupp.DernieresNotesMobile.genreOngletSelectionne =
			aGenreOnglet;
	}
	getDevoirWidgetSelectionne() {
		return this.etatUtilSco.infosSupp.DernieresNotesMobile
			.devoirWidgetSelectionne;
	}
	recupererDonnees() {
		const lOngletInfosPeriodes = this.etatUtilSco.getOngletInfosPeriodes();
		this.listePeriodes = lOngletInfosPeriodes.listePeriodes;
		if (this.listePeriodes && this.listePeriodes.count() > 0) {
			const lNrPeriodeParDefaut =
				this.etatUtilSco.getPage() && this.etatUtilSco.getPage().periode
					? this.etatUtilSco.getPage().periode.getNumero()
					: lOngletInfosPeriodes.periodeParDefaut.getNumero();
			this.indiceParDefaut =
				this.listePeriodes.getIndiceParNumeroEtGenre(lNrPeriodeParDefaut);
			if (!this.indiceParDefaut) {
				this.indiceParDefaut = 0;
			}
			this.periodeCourant = this.listePeriodes.get(this.indiceParDefaut);
			this.getInstance(this.identSelection).setDonnees(
				this.listePeriodes,
				this.indiceParDefaut,
			);
		}
	}
	actionSurRecupererNotes(aListe) {
		this.donnees = aListe;
		this.listeTabs.getElementParGenre(TypeOngletDernieresNotes.ParDate).Actif =
			true;
		this.listeTabs.getElementParGenre(
			TypeOngletDernieresNotes.ParMatiere,
		).Actif = true;
		if (!this.donnees.listeDevoirs.count()) {
			const lMessage =
				typeof Enumere_Message_1.EGenreMessage.PasDeNotes === "number"
					? ObjetTraduction_1.GTraductions.getValeur("Message")[
							Enumere_Message_1.EGenreMessage.PasDeNotes
						]
					: Enumere_Message_1.EGenreMessage.PasDeNotes;
			this._afficherMessage(lMessage);
			this.getInstance(this.identTabs).setDonnees(
				new ObjetListeElements_1.ObjetListeElements(),
			);
			this.getInstance(this.identTabs).setVisible(false);
		} else {
			const lListeDevoirs = new ObjetListeElements_1.ObjetListeElements();
			this.donnees.listeDevoirs.parcourir((D) => {
				let lServiceDeLaListeDevoirs = lListeDevoirs.getElementParNumero(
					D.service.getNumero(),
				);
				if (!lServiceDeLaListeDevoirs) {
					lListeDevoirs.addElement(D.service);
					lServiceDeLaListeDevoirs = D.service;
					lServiceDeLaListeDevoirs.nbNotesEleve = 0;
				}
				lListeDevoirs.addElement(D);
				D.pere = lServiceDeLaListeDevoirs;
				lServiceDeLaListeDevoirs.nbNotesEleve++;
			});
			this.listeDevoirs = lListeDevoirs;
			let lIndiceOngletASelectionner = -1;
			for (let i = 0; i < this.listeTabs.count(); i++) {
				if (this.listeTabs.get(i).getGenre() === this.ongletAffiche) {
					lIndiceOngletASelectionner = i;
					break;
				}
			}
			if (lIndiceOngletASelectionner === -1) {
				lIndiceOngletASelectionner = TypeOngletDernieresNotes.ParDate;
			}
			this.getInstance(this.identTabs).setDonnees(
				this.listeTabs,
				lIndiceOngletASelectionner,
				true,
			);
			this.getInstance(this.identTabs).setVisible(true);
		}
	}
	recupererDernieresNotes() {
		new ObjetRequeteDernieresNotes_1.ObjetRequeteDernieresNotes(
			this,
			this.actionSurRecupererNotes,
		).lancerRequete({ periode: this.periodeCourant });
	}
	evntCorrigeQCM(aExecutionQCM) {
		if (aExecutionQCM) {
			this.callback.appel({
				genreOnglet: this.etatUtilSco.genreOnglet,
				executionQCM: aExecutionQCM,
			});
		}
	}
	surSelectionPeriode(aParam) {
		this.periodeCourant = aParam.element;
		this.recupererDernieresNotes();
	}
	_afficherMessage(aMessage) {
		ObjetHtml_1.GHtml.setHtml(
			this.getInstance(this.idListeDevoirs).getNom(),
			this.composeAucuneDonnee(aMessage),
		);
	}
	_initialiserListeDevoirs(aInstance) {
		const lOptionsListe = { skin: ObjetListe_1.ObjetListe.skin.flatDesign };
		aInstance.setOptionsListe(lOptionsListe);
	}
	_evenementListeDevoirs(aParametres) {
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				this._surClickListe(aParametres.article);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				if (!aParametres.surInteractionUtilisateur) {
					this._surClickListe(aParametres.article);
				}
				break;
		}
	}
	_surClickListe(aDevoirOuService) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DetailsNote_1.ObjetFenetre_DetailsNote,
			{
				pere: this,
				evenement: (aNumerobouton, aParams) => {
					if (aParams && aParams.executionQCM) {
						this.evntCorrigeQCM(aParams.executionQCM);
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre:
							aDevoirOuService.getGenre() ===
							Enumere_Ressource_1.EGenreRessource.Service
								? ObjetTraduction_1.GTraductions.getValeur(
										"DernieresNotes.DetailsDuService",
									)
								: ObjetTraduction_1.GTraductions.getValeur(
										"DernieresNotes.DetailsDuDevoir",
									),
						largeur: 600,
						hauteur: 300,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
						],
						modale: false,
					});
				},
			},
		).setDonnees(aDevoirOuService, this.donnees, {
			estUnService:
				aDevoirOuService.getGenre() ===
				Enumere_Ressource_1.EGenreRessource.Service,
			libelleMoyenneDuPublicService: aDevoirOuService.estServiceEnGroupe
				? ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Moyenne_groupe",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Moyenne_classe",
					),
			libelleMoyenneDuPublicDevoir: aDevoirOuService.estEnGroupe
				? ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Moyenne_groupe",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"DernieresNotes.Moyenne_classe",
					),
			commentaireEnTitre: true,
			getPiecesJointes: this.moteurBulletin.composePieceJointeDevoir.bind(this),
			callBackSurClicMethodeCalculMoyenne:
				this._surClicMethodeCalculMoyenne.bind(this),
			callBackSurClicPrecedentSuivant: this._surClickProchainElement.bind(this),
		});
	}
	_eventSurTabs(aParams) {
		if (!!aParams) {
			this.ongletAffiche = aParams.getGenre();
			this.sauverGenreOngletSelectionne(this.ongletAffiche);
			const lListeDevoirs = this.getInstance(this.idListeDevoirs);
			const lDonneesListe =
				new DonneesListe_DernieresNotes_1.DonneesListe_DernieresNotes(
					this.listeDevoirs,
					{
						avecServices:
							this.ongletAffiche === TypeOngletDernieresNotes.ParMatiere,
						afficherMoyenneService: true,
						afficherMoyenneDevoir: true,
						avecDetailService: this.donnees.avecDetailService,
						avecDetailDevoir: this.donnees.avecDetailDevoir,
						callbackExecutionQCM: this.evntCorrigeQCM.bind(this),
						htmlTotal: this.donnees.moyenneGenerale
							? this.moteur.composeLigneTotaleDernieresNotes(
									this.donnees.moyenneGenerale,
								)
							: "",
					},
				);
			lListeDevoirs.setDonnees(lDonneesListe);
			const lDevoirWidgetSelectionne = this.getDevoirWidgetSelectionne();
			if (
				!!lDevoirWidgetSelectionne &&
				lDevoirWidgetSelectionne.existeNumero()
			) {
				const lIndice = this.listeDevoirs.getIndiceElementParFiltre(
					(aDevoir) =>
						aDevoir.getNumero() === lDevoirWidgetSelectionne.getNumero(),
				);
				if (lIndice !== -1) {
					lListeDevoirs.selectionnerLigne({
						ligne: lIndice,
						avecScroll: true,
						avecEvenement: true,
					});
				}
				this.etatUtilSco.infosSupp.DernieresNotesMobile.devoirWidgetSelectionne =
					null;
			}
		}
	}
	_surClicMethodeCalculMoyenne(aInstanceFenetreMCM, aService) {
		const lEleve = this.etatUtilSco.getMembre();
		const lClasse = lEleve.Classe;
		const lPeriode = this.periodeCourant;
		const lParametresCalcul = {
			libelleEleve: lEleve.getLibelle(),
			numeroEleve: lEleve.getNumero(),
			libelleClasse: lClasse.getLibelle(),
			numeroClasse: lClasse.getNumero(),
			libelleServiceNotation: aService.getLibelle(),
			numeroServiceNotation: aService.getNumero(),
			numeroPeriodeNotation: lPeriode.getNumero(),
			genreChoixNotation: lPeriode.getGenre(),
			moyenneTrimestrielle: true,
			pourMoyenneNette: true,
		};
		aInstanceFenetreMCM.setDonnees(lParametresCalcul);
	}
	_surClickProchainElement(aNumeroElement, aGenreElement, aRechercheSuivant) {
		let lIndexElement = this.listeDevoirs.getIndiceParNumeroEtGenre(
			aNumeroElement,
			aGenreElement,
		);
		if (lIndexElement === undefined) {
			lIndexElement = 0;
		}
		const lNbTotalElements = this.listeDevoirs.count();
		let lProchainElement;
		if (lNbTotalElements > 1) {
			let lIndexProchainElement = aRechercheSuivant
				? lIndexElement + 1
				: lIndexElement - 1;
			while (!lProchainElement && lIndexProchainElement !== lIndexElement) {
				if (lIndexProchainElement < 0) {
					lIndexProchainElement = lNbTotalElements - 1;
				}
				if (lIndexProchainElement === lNbTotalElements) {
					lIndexProchainElement = 0;
				}
				const lElementTemp = this.listeDevoirs.get(lIndexProchainElement);
				const lAvecAction =
					lElementTemp.getGenre() ===
					Enumere_Ressource_1.EGenreRessource.Service
						? this.donnees.avecDetailService
						: this.donnees.avecDetailDevoir;
				if (lElementTemp.getGenre() === aGenreElement && lAvecAction) {
					lProchainElement = lElementTemp;
				} else {
					lIndexProchainElement = aRechercheSuivant
						? lIndexProchainElement + 1
						: lIndexProchainElement - 1;
				}
			}
		}
		return lProchainElement;
	}
	_initSelecteur(aInstance) {
		aInstance.setParametres({
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
	}
}
exports.InterfacePageDernieresNotes = InterfacePageDernieresNotes;
