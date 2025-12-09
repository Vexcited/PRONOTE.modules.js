exports.InterfacePageAgendaMobile = void 0;
const ObjetRequetePageAgenda_1 = require("ObjetRequetePageAgenda");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const DonneesListe_Agenda_1 = require("DonneesListe_Agenda");
const ObjetListe_1 = require("ObjetListe");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetFenetre_SaisieAgenda_1 = require("ObjetFenetre_SaisieAgenda");
const MethodesObjet_1 = require("MethodesObjet");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const EGenreEvtAgenda_1 = require("EGenreEvtAgenda");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetRequeteSaisieAgenda_1 = require("ObjetRequeteSaisieAgenda");
const Enumere_Espace_1 = require("Enumere_Espace");
const UtilitaireAgenda_1 = require("UtilitaireAgenda");
const AccessApp_1 = require("AccessApp");
const ObjetFenetre_DetailAgenda_1 = require("ObjetFenetre_DetailAgenda");
class InterfacePageAgendaMobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.listeEvenements = null;
		this.application = (0, AccessApp_1.getApp)();
		this.avecPublicationPageEtablissement = this.application.droits.get(
			ObjetDroitsPN_1.TypeDroits.communication.avecPublicationPageEtablissement,
		);
		this.etatUtilisateur = this.application.getEtatUtilisateur();
		this._objGestionFocus_apresFenetreSaisieAgenda = {};
	}
	construireInstances() {
		this.identListeAgenda = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListeAgenda.bind(this),
			this._initialiserListeAgenda,
		);
	}
	async recupererDonnees() {
		const lRes = await new ObjetRequetePageAgenda_1.ObjetRequetePageAgenda(
			this,
		).lancerRequete({
			avecEventsPasses:
				UtilitaireAgenda_1.UtilitaireAgenda.getInfosOnglet().avecEventsPasses,
		});
		this._surRecupererDonneesAgenda(lRes);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListeAgenda;
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str("div", {
			class: [Divers_css_1.StylesDivers.fullHeight],
			id: this.getNomInstance(this.identListeAgenda),
		});
	}
	evntBtnCreerElementAgenda(aNbJoursEcoules) {
		let lJourDeSemaine;
		let lDate;
		if (aNbJoursEcoules === undefined) {
			lJourDeSemaine =
				ObjetDate_1.GDate.getNbrJoursDepuisPremiereLundi(
					ObjetDate_1.GDate.aujourdhui,
				) % 7;
			lDate = ObjetDate_1.GDate.aujourdhui;
		} else {
			lJourDeSemaine = aNbJoursEcoules % 7;
			lDate = ObjetDate_1.GDate.getJour(
				ObjetDate_1.GDate.PremierLundi,
				aNbJoursEcoules,
			);
		}
		const lAgendaVierge = this._getEvenementParDefaut(lJourDeSemaine, lDate);
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieAgenda_1.ObjetFenetre_SaisieAgenda,
			{
				pere: this,
				evenement: this._evenementFenetreSaisieAgenda.bind(this),
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						avecTailleSelonContenu: true,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		).setDonnees({
			agenda: lAgendaVierge,
			listeClassesGroupes: this.listeClassesGroupes,
			listeFamilles: this.listeFamilles,
			etat: Enumere_Etat_1.EGenreEtat.Creation,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeJourDansMois: this.listeJourDansMois,
			genreEvt: EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique,
			dateDebutAgenda: this.dateDebutPrevisionnel,
			dateFinAgenda: this.dateFinPrevisionnel,
		});
	}
	evntDupliquerElementAgenda(aArticle) {
		const lArticle = aArticle;
		this.copieAgenda = MethodesObjet_1.MethodesObjet.dupliquer(lArticle);
		const lListe = (this.copieAgenda.listeDocJoints =
			new ObjetListeElements_1.ObjetListeElements());
		lArticle.listeDocJoints.parcourir((D) => {
			if (D.getEtat() !== Enumere_Etat_1.EGenreEtat.Suppression) {
				const lElement = MethodesObjet_1.MethodesObjet.dupliquer(D);
				if (lElement.getEtat() === Enumere_Etat_1.EGenreEtat.Aucun) {
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
				}
				lListe.addElement(lElement);
			}
		});
		const lAgenda = MethodesObjet_1.MethodesObjet.dupliquer(this.copieAgenda);
		lAgenda.avecModificationPublic = true;
		lAgenda.Etat = Enumere_Etat_1.EGenreEtat.Aucun;
		lAgenda.Numero = null;
		lAgenda.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
		const lDateDebutOrigine = lAgenda.DateDebut,
			lDateFinOrigine = lAgenda.DateFin,
			lEcartJour = ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
				lAgenda.DateDebut,
				lAgenda.DateFin,
			);
		lAgenda.DateDebut = new Date(lAgenda.DateDebut);
		lAgenda.DateFin = ObjetDate_1.GDate.getDateBornee(
			ObjetDate_1.GDate.getJourSuivant(lAgenda.DateDebut, lEcartJour),
		);
		lAgenda.DateDebut.setHours(lDateDebutOrigine.getHours());
		lAgenda.DateDebut.setMinutes(lDateDebutOrigine.getMinutes());
		lAgenda.DateFin.setHours(lDateFinOrigine.getHours());
		lAgenda.DateFin.setMinutes(lDateFinOrigine.getMinutes());
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieAgenda_1.ObjetFenetre_SaisieAgenda,
			{
				pere: this,
				evenement: this._evenementFenetreSaisieAgenda.bind(this),
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						avecTailleSelonContenu: true,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		).setDonnees({
			agenda: lAgenda,
			listeFamilles: this.listeFamilles,
			etat: Enumere_Etat_1.EGenreEtat.Creation,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeJourDansMois: this.listeJourDansMois,
			genreEvt: lAgenda.estPeriodique
				? EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement
				: EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique,
			dateDebutAgenda: this.dateDebutPrevisionnel,
			dateFinAgenda: this.dateFinPrevisionnel,
		});
	}
	_gestionFocusApresFenetreSaisieAgenda(aParams) {
		if (aParams.numeroBouton !== 1) {
			return;
		}
		if (aParams.evenement) {
			this._objGestionFocus_apresFenetreSaisieAgenda.element =
				aParams.evenement;
		}
		if (aParams.numeroEvenementSaisie) {
			this._objGestionFocus_apresFenetreSaisieAgenda.numero =
				aParams.numeroEvenementSaisie;
		}
	}
	getIndiceParElement(aArticle) {
		return UtilitaireAgenda_1.UtilitaireAgenda.getIndiceParElement(
			aArticle,
			this.getInstance(this.identListeAgenda),
		);
	}
	_initialiserListeAgenda(aInstance) {
		UtilitaireAgenda_1.UtilitaireAgenda.initListeAgenda(aInstance);
		aInstance.setOptionsListe({ forcerScrollV_mobile: true });
	}
	_surRecupererDonneesAgenda(aParam) {
		this.listeEvenements = aParam.listeEvenements;
		if (this.listeEvenements) {
			UtilitaireAgenda_1.UtilitaireAgenda.trierListeEvenements(
				this.listeEvenements,
			);
		}
		this.listeFamilles = aParam.listeFamilles;
		this.listeClassesGroupes = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listeClassesGroupes,
		);
		this.listeJourDansMois = aParam.listeJourDansMois;
		this.dateDebutPrevisionnel = aParam.dateDebutPrevisionnel;
		this.dateFinPrevisionnel = aParam.dateFinPrevisionnel;
		if (
			this.etatUtilisateur.listeDonnees &&
			this.etatUtilisateur.listeDonnees[
				TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
					.THND_ListeDocJointEtablissement
			]
		) {
			this.listePiecesJointes = MethodesObjet_1.MethodesObjet.dupliquer(
				this.etatUtilisateur.listeDonnees[
					TypeHttpNotificationDonnes_1.TypeHttpNotificationDonnes
						.THND_ListeDocJointEtablissement
				],
			);
		}
		if (!!aParam.listeEvenements) {
			this._actualiserAgenda();
		}
	}
	_evenementFenetreSaisieAgenda(aParametres) {
		if (aParametres.numeroBouton === 1) {
			this.recupererDonnees();
			this._gestionFocusApresFenetreSaisieAgenda(aParametres);
		}
	}
	_evenementSurListeAgenda(aParametres) {
		const lArticle = aParametres.article;
		let lGenreEvt;
		switch (aParametres.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.SelectionClick:
				ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
					ObjetFenetre_DetailAgenda_1.ObjetFenetre_DetailAgenda,
					{
						pere: this,
						evenement: this._evenementFenetreDetailAgenda.bind(this),
						initialiser(aInstance) {
							aInstance.setOptionsFenetre({
								avecTailleSelonContenu: false,
								listeBoutons:
									!!lArticle.proprietaire &&
									IE.estMobile &&
									this.application.droits.get(
										ObjetDroitsPN_1.TypeDroits.agenda.avecSaisieAgenda,
									)
										? [ObjetTraduction_1.GTraductions.getValeur("Modifier")]
										: [],
							});
							aInstance.setOptions({
								estEspaceProf: [
									Enumere_Espace_1.EGenreEspace.Professeur,
									Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
								].includes(GEtatUtilisateur.GenreEspace),
								droitSaisie: this.application.droits.get(
									ObjetDroitsPN_1.TypeDroits.agenda.avecSaisieAgenda,
								),
								estFenetreAgenda: true,
							});
						},
					},
				).setDonnees({
					detail: lArticle,
					evenementAgenda: this._evenementSurListeAgenda.bind(this),
					evenementDupliquer: this.evntDupliquerElementAgenda.bind(this),
					avecPublicationPageEtablissement:
						this.avecPublicationPageEtablissement,
				});
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				this.evntBtnCreerElementAgenda();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (lArticle.estPeriodique) {
					lGenreEvt = EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement;
					const lControleur = {
						RDEvenement: {
							getValue: function (aIndice) {
								return lGenreEvt === aIndice;
							},
							setValue: function (aIndice) {
								lGenreEvt = aIndice;
							},
						},
					};
					this.application.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: UtilitaireAgenda_1.UtilitaireAgenda._composeMessage(true),
						controleur: lControleur,
						callback: (aGenreAction) => {
							if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
								this._callbackFenetreSaisieAgenda(lArticle, lGenreEvt);
							}
						},
					});
				} else {
					this._callbackFenetreSaisieAgenda(
						lArticle,
						EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique,
					);
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Suppression:
				if (lArticle.proprietaire) {
					if (lArticle.estPeriodique) {
						lGenreEvt = EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement;
						const lControleur = {
							RDEvenement: {
								getValue: function (aIndice) {
									return lGenreEvt === aIndice;
								},
								setValue: function (aIndice) {
									lGenreEvt = aIndice;
								},
							},
						};
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message:
								UtilitaireAgenda_1.UtilitaireAgenda._composeMessage(false),
							controleur: lControleur,
							callback: (aGenreAction) => {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									this._callbackSupprimerAgenda(lArticle, lGenreEvt);
								}
							},
						});
					} else {
						lGenreEvt = EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique;
						const H = [];
						H.push(
							'<div class="Gras">',
							ObjetTraduction_1.GTraductions.getValeur(
								"Agenda.AgendaSuppressionEvt",
							),
							"</div>",
						);
						H.push(
							'<div class="GrandEspaceHaut">',
							ObjetTraduction_1.GTraductions.getValeur(
								"Agenda.AgendaConfirmerSupp",
							),
							"</div>",
						);
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message: H.join(""),
							callback: (aGenreAction) => {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									this._callbackSupprimerAgenda(lArticle, lGenreEvt);
								}
							},
						});
					}
				}
				break;
		}
	}
	_evenementFenetreDetailAgenda(aParam) {
		if (!aParam) {
			return;
		}
		const lParam = {
			article: aParam.element,
			genreEvenement: Enumere_EvenementListe_1.EGenreEvenementListe.Edition,
		};
		this._evenementSurListeAgenda(lParam);
	}
	_actualiserAgenda() {
		this.getInstance(this.identListeAgenda).setDonnees(
			new DonneesListe_Agenda_1.DonneesListe_Agenda(this.listeEvenements, {
				eventDupliquer: this.evntDupliquerElementAgenda.bind(this),
				callbackMenuCtx: this._evenementSurListeAgenda.bind(this),
				callbackCBEventsPasses: () => this.recupererDonnees(),
			}),
		);
		let lIndexLigne = 0;
		if (this._objGestionFocus_apresFenetreSaisieAgenda.numero) {
			lIndexLigne = this.getInstance(this.identListeAgenda)
				.getDonneesListe()
				.Donnees.getIndiceParNumeroEtGenre(
					this._objGestionFocus_apresFenetreSaisieAgenda.numero,
				);
			this._objGestionFocus_apresFenetreSaisieAgenda = {};
		} else if (
			"element" in this._objGestionFocus_apresFenetreSaisieAgenda &&
			this._objGestionFocus_apresFenetreSaisieAgenda.element
		) {
			lIndexLigne = this.getIndiceParElement(
				this._objGestionFocus_apresFenetreSaisieAgenda.element,
			);
			this._objGestionFocus_apresFenetreSaisieAgenda = {};
		} else {
			const lEvenementLePlusProche =
				UtilitaireAgenda_1.UtilitaireAgenda._getJourLePlusProche(
					this.listeEvenements,
					ObjetDate_1.GDate.aujourdhui,
				);
			if (
				lEvenementLePlusProche &&
				lEvenementLePlusProche.element &&
				MethodesObjet_1.MethodesObjet.isNumeric(lEvenementLePlusProche.indice)
			) {
				lIndexLigne = lEvenementLePlusProche.indice;
			}
		}
		if (MethodesObjet_1.MethodesObjet.isNumeric(lIndexLigne)) {
			this.getInstance(this.identListeAgenda).scrollTo({ ligne: lIndexLigne });
		}
	}
	_callbackFenetreSaisieAgenda(aElement, aGenreEvt) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieAgenda_1.ObjetFenetre_SaisieAgenda,
			{
				pere: this,
				evenement: this._evenementFenetreSaisieAgenda.bind(this),
				initialiser(aInstance) {
					aInstance.setOptionsFenetre({
						avecTailleSelonContenu: true,
						listeBoutons: [
							ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							ObjetTraduction_1.GTraductions.getValeur("Valider"),
						],
					});
				},
			},
		).setDonnees({
			agenda: aElement,
			etat: Enumere_Etat_1.EGenreEtat.Modification,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeFamilles: this.listeFamilles,
			listeJourDansMois: this.listeJourDansMois,
			genreEvt: aGenreEvt,
			dateDebutAgenda: this.dateDebutPrevisionnel,
			dateFinAgenda: this.dateFinPrevisionnel,
		});
	}
	_callbackSupprimerAgenda(aElementAgenda, aGenreEvt) {
		aElementAgenda.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
		if (aGenreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique) {
			aElementAgenda.periodicite.estEvtPerso =
				aGenreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement;
		}
		this.dateCourante = aElementAgenda.DateDebut;
		new ObjetRequeteSaisieAgenda_1.ObjetRequeteSaisieAgenda(
			this,
			this.actionSurValidation,
		).lancerRequete({
			listeEvenements: this.listeEvenements,
			listePiecesJointes: this.listePiecesJointes,
		});
	}
	_getEvenementParDefaut(aJourDeSemaine, aDate) {
		const lFamille = this.listeFamilles.get(0);
		return UtilitaireAgenda_1.UtilitaireAgenda._getEvenementParDefaut(
			aJourDeSemaine,
			aDate,
			lFamille,
			this.etatUtilisateur.pourPrimaire(),
		);
	}
}
exports.InterfacePageAgendaMobile = InterfacePageAgendaMobile;
