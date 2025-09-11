exports.InterfaceIntendanceDemandesTravaux = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetListe_1 = require("ObjetListe");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_DemandesTravaux_1 = require("DonneesListe_DemandesTravaux");
const ObjetFenetre_DemandesMissions_1 = require("ObjetFenetre_DemandesMissions");
const ObjetRequeteSaisieTravauxIntendance_1 = require("ObjetRequeteSaisieTravauxIntendance");
const ObjetRequeteTravauxIntendance_1 = require("ObjetRequeteTravauxIntendance");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const ObjetMoteurTravaux_1 = require("ObjetMoteurTravaux");
const ObjetDate_1 = require("ObjetDate");
const ObjetInterfacePageCP_1 = require("ObjetInterfacePageCP");
const Invocateur_1 = require("Invocateur");
const AccessApp_1 = require("AccessApp");
const ObjetFenetre_1 = require("ObjetFenetre");
const TypeNiveauDUrgence_1 = require("TypeNiveauDUrgence");
class InterfaceIntendanceDemandesTravaux extends ObjetInterfacePageCP_1.InterfacePageCP {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
		this.elementSelectionnee = null;
	}
	construireInstances() {
		this.moteur = new ObjetMoteurTravaux_1.ObjetMoteurTravaux();
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this.evenementListe,
			this._initialiserListe,
		);
	}
	_initialiserListe(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
			avecLigneCreation: this.moteur.avecDroitExecutant(),
			messageContenuVide:
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_PrimMairie ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.PrimMairie ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection ||
				GEtatUtilisateur.GenreEspace ===
					Enumere_Espace_1.EGenreEspace.PrimDirection
					? ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.AucuneDemande",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.AucuneMission",
						),
			boutons: [
				{ genre: ObjetListe_1.ObjetListe.typeBouton.rechercher },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.filtrer },
				{ genre: ObjetListe_1.ObjetListe.typeBouton.deployer },
			],
		});
	}
	evenementListe(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				this.elementSelectionnee = aParams.article;
				this._ouvrirFenetreTravaux(false);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this._ouvrirFenetreTravaux(true);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
				this._saisie();
				break;
		}
	}
	evntDupliquerElementMission(aArticle) {
		const lDateCourante = ObjetDate_1.GDate.getDateCourante();
		const lDateCouranteFormat = ObjetDate_1.GDate.formatDate(
			lDateCourante,
			"%JJ/%MM/%AAAA",
		);
		const lFenetreTravaux = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DemandesMissions_1.ObjetFenetre_DemandesMissions,
			{
				pere: this,
				evenement: (aGenreBouton, aDemande, aListeFichiers) => {
					this._evenementFenetreTravaux(aGenreBouton, aDemande, aListeFichiers);
				},
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"TvxIntendance.DupliquerLe",
							[lDateCouranteFormat],
						),
						largeur: 450,
						hauteur: null,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
						avecTailleSelonContenu: true,
					});
				},
			},
		);
		lFenetreTravaux.setDonnees({
			demandeCourante: aArticle,
			listeEtatsAvancement: this.listeEtatsAvancement,
			listeNatureTvx: this.listeNatureTvx,
			listeSallesLieu: this.listeSallesLieu,
			listeLieux: null,
			listePJ: this.listePiecesJointes,
			estEnCreation: true,
			estEnDuplication: true,
		});
	}
	_actionSurRequeteTravauxIntendance(aJSON) {
		this.listeDemandesTvx = aJSON.listeLignes;
		this.listeSallesLieu = aJSON.listeSallesLieu;
		this.listeNatureTvx = aJSON.listeNatureTvx;
		this.listeEtatsAvancement = aJSON.listeEtatAvcmt;
		if (
			this.etatUtilisateurSco.listeDonnees &&
			this.etatUtilisateurSco.listeDonnees[
				TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
					.THND_ListeDocJointEtablissement
			]
		) {
			this.listePiecesJointes = MethodesObjet_1.MethodesObjet.dupliquer(
				this.etatUtilisateurSco.listeDonnees[
					TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
						.THND_ListeDocJointEtablissement
				],
			);
		}
		const lDonneesListe =
			new DonneesListe_DemandesTravaux_1.DonneesListe_DemandesTravaux(
				this.moteur.formaterListe(this.listeDemandesTvx),
				{
					callbacks: {
						callbackModifierDemande: (aArticle) => {
							this._ouvrirFenetreTravaux(false);
						},
						callbackDupliquerDemande: (aArticle) => {
							this.evntDupliquerElementMission(aArticle);
						},
						callbackSupprimerDemande: (aArticle) => {
							aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							this._saisie();
						},
						callbackTransfererMission: this.surTransfertMission.bind(this),
					},
					donneesFiltre: {
						listeEtatsAvancement: this.listeEtatsAvancement,
						listeNiveauUrgence:
							TypeNiveauDUrgence_1.TypeNiveauDUrgenceUtil.toListe(),
						listeNatureTvx: this.listeNatureTvx,
					},
				},
			);
		const lInstanceListe = this.getInstance(this.identListe);
		lInstanceListe.setDonnees(lDonneesListe);
		if (this.elementSelectionnee) {
			const lIndice = lInstanceListe
				.getListeArticles()
				.getIndiceParNumeroEtGenre(
					this.elementSelectionnee.getNumero(),
					this.elementSelectionnee.getGenre(),
				);
			if (MethodesObjet_1.MethodesObjet.isNumeric(lIndice)) {
				lInstanceListe.selectionnerLigne({ ligne: lIndice, avecScroll: true });
			}
		}
	}
	recupererDonnees() {
		this._envoieRequete();
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "EspaceGauche full-height" },
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identListe),
					class: "p-top full-height",
					style: "height:100%; max-width:130rem;",
				}),
			),
		);
		return H.join("");
	}
	surTransfertMission(aArticle) {
		aArticle.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		this._saisie();
		const lOngletDestination =
			this.moteur.getOngletDestinationSelonGenreDemande(aArticle.getGenre());
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.navigationOnglet,
			lOngletDestination,
		);
	}
	getDemandeSelectionnee() {
		return this.getInstance(this.identListe).getElementSelection();
	}
	_envoieRequete() {
		new ObjetRequeteTravauxIntendance_1.ObjetRequeteTravauxIntendance(
			this,
			this._actionSurRequeteTravauxIntendance,
		).lancerRequete();
	}
	_ouvrirFenetreTravaux(aEnCreation) {
		let lAvecDroitGestion = this.moteur.avecDroitGestionTravaux();
		const lDemandeSelectionnee = this.getDemandeSelectionnee();
		const lSeulementConsult =
			lDemandeSelectionnee &&
			lDemandeSelectionnee.seulementConsult &&
			!lAvecDroitGestion;
		const lFenetreTravaux = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_DemandesMissions_1.ObjetFenetre_DemandesMissions,
			{
				pere: this,
				evenement: (aGenreBouton, aDemande, aListeFichiers) => {
					this._evenementFenetreTravaux(aGenreBouton, aDemande, aListeFichiers);
				},
				initialiser: (aInstance) => {
					let lDateCreation = null;
					if (!!lDemandeSelectionnee && !!lDemandeSelectionnee.dateCreation) {
						lDateCreation = lDemandeSelectionnee.dateCreation;
					}
					const lTitre = this.moteur.getTitreFenetre(
						aEnCreation
							? Enumere_Etat_1.EGenreEtat.Creation
							: Enumere_Etat_1.EGenreEtat.Modification,
						lDateCreation,
						lSeulementConsult,
					);
					aInstance.setOptionsFenetre({
						titre: lTitre,
						largeur: 450,
						hauteur: null,
						listeBoutons: lSeulementConsult
							? [ObjetTraduction_1.GTraductions.getValeur("Fermer")]
							: [
									ObjetTraduction_1.GTraductions.getValeur("Annuler"),
									ObjetTraduction_1.GTraductions.getValeur("Valider"),
								],
						avecTailleSelonContenu: true,
					});
				},
			},
		);
		lFenetreTravaux.setDonnees({
			demandeCourante: aEnCreation ? null : lDemandeSelectionnee,
			listeEtatsAvancement: this.listeEtatsAvancement,
			listeNatureTvx: this.listeNatureTvx,
			listeSallesLieu: this.listeSallesLieu,
			listeLieux: null,
			listePJ: this.listePiecesJointes,
			estEnCreation: aEnCreation,
			estEnDuplication: false,
			callbackSupprimer: aEnCreation
				? null
				: (aElement) => {
						const lElement =
							this.listeDemandesTvx.getElementParElement(aElement);
						if (lElement) {
							lElement.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
							this._saisie();
						}
					},
		});
	}
	_evenementFenetreTravaux(aGenreBouton, aDemande, aListeFichiers) {
		if (aGenreBouton === 1) {
			this.listeDemandesTvx = new ObjetListeElements_1.ObjetListeElements();
			this.listeDemandesTvx.addElement(aDemande);
			this.listePiecesJointes = aListeFichiers;
			this._saisie();
		}
		if (aGenreBouton === "Supprimer") {
			this._saisie();
		}
	}
	_saisie() {
		let lListeFichiers;
		if (this.listePiecesJointes) {
			lListeFichiers = this.listePiecesJointes.getListeElements((aElement) => {
				return aElement.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun;
			});
		}
		new ObjetRequeteSaisieTravauxIntendance_1.ObjetRequeteSaisieTravauxIntendance(
			this,
			this._envoieRequete.bind(this),
		)
			.addUpload({ listeFichiers: this.listePiecesJointes })
			.lancerRequete({
				listeTvx: this.listeDemandesTvx,
				ListeFichiers: lListeFichiers,
			});
	}
}
exports.InterfaceIntendanceDemandesTravaux = InterfaceIntendanceDemandesTravaux;
