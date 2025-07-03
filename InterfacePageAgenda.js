exports.InterfacePageAgenda = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetFenetre_ICal_1 = require("ObjetFenetre_ICal");
const ObjetRequetePageAgenda_1 = require("ObjetRequetePageAgenda");
const MultipleObjetRequeteSaisieAgenda = require("ObjetRequeteSaisieAgenda");
const Invocateur_1 = require("Invocateur");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const TypeGenreICal_1 = require("TypeGenreICal");
const ObjetCycles_1 = require("ObjetCycles");
const ObjetDate_1 = require("ObjetDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
const Enumere_Espace_1 = require("Enumere_Espace");
const InterfacePage_1 = require("InterfacePage");
const TypeHttpNotificationDonnes_1 = require("TypeHttpNotificationDonnes");
const Enumere_Event_1 = require("Enumere_Event");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const EGenreEvtAgenda_1 = require("EGenreEvtAgenda");
const UtilitaireBoutonBandeau_1 = require("UtilitaireBoutonBandeau");
const DonneesListe_Agenda_1 = require("DonneesListe_Agenda");
const ObjetListe_1 = require("ObjetListe");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetFenetre_SaisieAgenda_1 = require("ObjetFenetre_SaisieAgenda");
const UtilitaireAgenda_1 = require("UtilitaireAgenda");
const AccessApp_1 = require("AccessApp");
class InterfacePageAgenda extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.application = (0, AccessApp_1.getApp)();
		this.etatUtilisateur = this.application.getEtatUtilisateur();
		this.parametres = this.application.getObjetParametres();
		this.donnees = {
			NumeroSemaine: 0,
			libelleImpression: "",
			listeEvenements: null,
			listeFamilles: new ObjetListeElements_1.ObjetListeElements(),
			iCal: {},
		};
		this._objGestionFocus_apresFenetreSaisieAgenda = {};
		const lJoursOuvres = new TypeEnsembleNombre_1.TypeEnsembleNombre().add([
			0, 1, 2, 3, 4, 5, 6,
		]);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPreResize,
			this.surPreResize,
		);
		this.ajouterEvenementGlobal(
			Enumere_Event_1.EEvent.SurPostResize,
			this.surPostResize,
		);
		this.cycles = new ObjetCycles_1.ObjetCycles().init({
			premiereDate: GParametres.PremiereDate,
			derniereDate: GParametres.DerniereDate,
			dateDebutPremierCycle: this.parametres.dateDebutPremierCycle,
			joursOuvresParCycle: lJoursOuvres.count(),
			premierJourSemaine: GParametres.premierJourSemaine,
			joursOuvres: lJoursOuvres,
			joursFeries: this.parametres.ensembleJoursFeries,
		});
	}
	surPreResize() {}
	surPostResize() {
		this._actualiserAgenda(this.estHebdomadaire());
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			avecBtnAfficherICal() {
				return aInstance.donnees.iCal && aInstance.donnees.iCal.avecExport;
			},
			btnAfficherICal: {
				event() {
					GApplication.getMessage().afficher({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.iCal.Titre",
						),
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"infosperso.iCal.MessageBouton",
						),
					});
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur("iCal.hint")[
						TypeGenreICal_1.TypeGenreICal.ICal_Agenda
					];
				},
				getSelection() {
					return aInstance.getInstance(aInstance.IdentFenetreICal).estAffiche();
				},
			},
		});
	}
	construireInstances() {
		this.identListeAgenda = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListeAgenda.bind(this),
			this._initialiserListeAgenda,
		);
		this.IdentFenetreICal = this.addFenetre(
			ObjetFenetre_ICal_1.ObjetFenetre_ICal,
			null,
			this.initialiserFenetreICal,
		);
		if (
			!!this.application.droits.get(
				ObjetDroitsPN_1.TypeDroits.agenda.avecSaisieAgenda,
			)
		) {
			this.identFenetreSaisieAgenda = this.addFenetre(
				ObjetFenetre_SaisieAgenda_1.ObjetFenetre_SaisieAgenda,
				this._evenementFenetreSaisieAgenda.bind(this),
				this._initialiserFenetreSaisieAgenda,
			);
		}
	}
	construireStructureAffichageAutre() {
		return IE.jsx.str(
			"div",
			{ style: "height:100%" },
			IE.jsx.str("div", {
				style: "height:100%;max-width:130rem",
				id: this.getInstance(this.identListeAgenda).getNom(),
			}),
		);
	}
	estHebdomadaire() {
		return false;
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.identListeAgenda;
		if (
			[
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.Eleve,
				Enumere_Espace_1.EGenreEspace.Parent,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Administrateur,
				Enumere_Espace_1.EGenreEspace.PrimParent,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
				Enumere_Espace_1.EGenreEspace.PrimMairie,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			this.AddSurZone.push({ separateur: true });
			this.AddSurZone.push({
				html: UtilitaireBoutonBandeau_1.UtilitaireBoutonBandeau.getHtmlBtnICal(
					"btnAfficherICal",
				),
				getDisplay: "avecBtnAfficherICal",
			});
		}
	}
	actifBtnCreerElementAgenda(aNbJoursEcoules) {
		let lDate;
		if (aNbJoursEcoules === undefined) {
			lDate = ObjetDate_1.GDate.aujourdhui;
		} else {
			lDate = ObjetDate_1.GDate.getJour(
				ObjetDate_1.GDate.PremierLundi,
				aNbJoursEcoules,
			);
		}
		return !ObjetDate_1.GDate.estAvantJour(
			lDate,
			this.donnees.dateDebutPrevisionnel,
		);
	}
	evntDupliquerElementAgenda(aParams) {
		const lArticle = aParams;
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
		const aJour =
			ObjetDate_1.GDate.getNbrJoursDepuisPremiereLundi(
				ObjetDate_1.GDate.aujourdhui,
			) % 7;
		lAgenda.DateDebut = new Date(
			this.cycles.jourCycleEnDate(
				aJour,
				this.cycles.cycleDeLaDate(ObjetDate_1.GDate.aujourdhui),
			),
		);
		lAgenda.DateFin = ObjetDate_1.GDate.getDateBornee(
			ObjetDate_1.GDate.getJourSuivant(lAgenda.DateDebut, lEcartJour),
		);
		lAgenda.DateDebut.setHours(lDateDebutOrigine.getHours());
		lAgenda.DateDebut.setMinutes(lDateDebutOrigine.getMinutes());
		lAgenda.DateFin.setHours(lDateFinOrigine.getHours());
		lAgenda.DateFin.setMinutes(lDateFinOrigine.getMinutes());
		this.getInstance(this.identFenetreSaisieAgenda).setDonnees({
			agenda: lAgenda,
			listeClassesGroupes: this.donnees.listeClassesGroupes,
			etat: Enumere_Etat_1.EGenreEtat.Creation,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeFamilles: this.donnees.listeFamilles,
			listeJourDansMois: this.donnees.listeJourDansMois,
			genreEvt: lAgenda.estPeriodique
				? EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement
				: EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique,
			dateDebutAgenda: this.donnees.dateDebutPrevisionnel,
			dateFinAgenda: this.donnees.dateFinPrevisionnel,
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
		this.getInstance(this.identFenetreSaisieAgenda).setDonnees({
			agenda: lAgendaVierge,
			listeClassesGroupes: this.donnees.listeClassesGroupes,
			etat: Enumere_Etat_1.EGenreEtat.Creation,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeFamilles: this.donnees.listeFamilles,
			listeJourDansMois: this.donnees.listeJourDansMois,
			genreEvt: EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique,
			dateDebutAgenda: this.donnees.dateDebutPrevisionnel,
			dateFinAgenda: this.donnees.dateFinPrevisionnel,
		});
	}
	initialiserFenetreICal(aInstance) {
		aInstance.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur("iCal.fenetre.titre"),
			largeur: 425,
			hauteur: 265,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
		aInstance.setGenreICal(TypeGenreICal_1.TypeGenreICal.ICal_Agenda);
	}
	recupererDonnees() {
		this.afficherPage();
	}
	afficherPage() {
		this.setEtatSaisie(false);
		this.requeteConsultation();
	}
	getPageImpression() {
		return {
			titre1: this.estHebdomadaire() ? this.donnees.libelleImpression : "",
			contenu: this.composePageImpression(),
		};
	}
	composePageImpression() {
		const T = [];
		const lFormatDate = "%JJJ %JJ %MMM";
		let dateCourante = this.donnees.dateDebutPrevisionnel;
		let dateDebut = this.donnees.dateDebutPrevisionnel;
		let dateFin = this.donnees.dateFinPrevisionnel;
		T.push(
			'<div style="height:100%;width:calc(100% - 13px);overflow:hidden;">',
		);
		for (let i = 0; i < this.donnees.listeEvenements.count(); i++) {
			const elt = this.donnees.listeEvenements.get(i);
			const lParams = { sansHoraire: elt.sansHoraire, sansCrochet: true };
			const strDate = ObjetDate_1.GDate.strDates(
				elt.DateDebut,
				elt.DateFin,
				lParams,
			);
			if (
				ObjetDate_1.GDate.dateEntreLesDates(elt.DateDebut, dateDebut, dateFin)
			) {
				const lArrondiTop = "border-top-left-radius: 20px 30px;";
				const lArrondiBottom = "border-bottom-left-radius: 20px 30px;";
				const lCouleurBloc = GCouleur.themeNeutre.legere2;
				if (
					ObjetDate_1.GDate.getNbrJoursEntreDeuxDates(
						elt.DateDebut,
						dateCourante,
					) !== 0
				) {
					T.push(
						'<div style="width:100%;padding:10px 0 10px 5px;',
						ObjetStyle_1.GStyle.composeCouleurFond(lCouleurBloc),
						'">',
					);
					T.push(ObjetDate_1.GDate.formatDate(elt.DateDebut, lFormatDate));
					T.push("</div>");
					dateCourante = elt.DateDebut;
				}
				T.push('<div style="width:100%;margin:0 5px 0 5px;" class="Espace">');
				T.push('<div style="display:inline-flex">');
				T.push(
					'<div class="celluleMarqueur" style="width: 8px; background-color:',
					elt.CouleurCellule,
					"; ",
					lArrondiTop,
					" ",
					lArrondiBottom,
					' ">&nbsp;</div>',
				);
				T.push(
					'<div style="background-color : #ffffff; color : black; width: calc(100% - 6px);"><div class="Espace"><div class="Bloc_Titre">',
				);
				T.push(elt.getLibelle());
				T.push("</div>");
				T.push('<div class="Bloc_SSTitre">');
				T.push(strDate);
				T.push("</div></div></div></div>");
				T.push("</div>");
				T.push('<div style="width:100%" class="Espace">');
				T.push(
					elt.Commentaire
						? ObjetChaine_1.GChaine.replaceRCToHTML(elt.Commentaire)
						: ObjetTraduction_1.GTraductions.getValeur("Agenda.EvenementVide"),
				);
				T.push("</div>");
			}
		}
		T.push("</div>");
		return T.join("");
	}
	setLibelleImpression(aNumeroSemaine) {
		if (
			"getLibelleSousOnglet" in this.Pere &&
			MethodesObjet_1.MethodesObjet.isFunction(this.Pere.getLibelleSousOnglet)
		) {
			this.donnees.libelleImpression = this.Pere.getLibelleSousOnglet(
				ObjetDate_1.GDate.strSemaineSelonCycle(
					this.cycles,
					aNumeroSemaine,
					"%JJ/%MM/%AA",
					"%JJ/%MM/%AA",
					ObjetTraduction_1.GTraductions.getValeur("Agenda.SemaineDu") + " ",
					" " + ObjetTraduction_1.GTraductions.getValeur("Au") + " ",
					"",
				),
				true,
				true,
				true,
			);
		}
	}
	surReponseRequetePageAgenda(aParam) {
		this.donnees.listeEvenements = aParam.listeEvenements;
		UtilitaireAgenda_1.UtilitaireAgenda.trierListeEvenements(
			this.donnees.listeEvenements,
		);
		this.donnees.listeFamilles = aParam.listeFamilles;
		this.donnees.listeJourDansMois = aParam.listeJourDansMois;
		this.donnees.listeClassesGroupes = MethodesObjet_1.MethodesObjet.dupliquer(
			aParam.listeClassesGroupes,
		);
		this.donnees.dateDebutPrevisionnel = aParam.dateDebutPrevisionnel;
		this.donnees.dateFinPrevisionnel = aParam.dateFinPrevisionnel;
		this.setEtatSaisie(false);
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
		this.donnees.iCal = {
			avecExport: !!aParam.avecExportICal,
			parametresExport: aParam.parametreExportICal,
		};
		const lJoursOuvres = new TypeEnsembleNombre_1.TypeEnsembleNombre().add([
			0, 1, 2, 3, 4, 5, 6,
		]);
		this.cycles = new ObjetCycles_1.ObjetCycles().init({
			premiereDate: this.donnees.dateDebutPrevisionnel,
			derniereDate: this.donnees.dateFinPrevisionnel,
			dateDebutPremierCycle: this.parametres.dateDebutPremierCycle,
			joursOuvresParCycle: lJoursOuvres.count(),
			premierJourSemaine: this.parametres.premierJourSemaine,
			joursOuvres: lJoursOuvres,
			joursFeries: this.parametres.ensembleJoursFeries,
		});
		this._afficherCacher(false);
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Normale,
			this,
		);
		this._actualiserAgenda(this.estHebdomadaire());
		const lDate = this.dateCourante || ObjetDate_1.GDate.aujourdhui;
		this.setLibelleImpression(this.cycles.cycleDeLaDate(lDate));
	}
	_gestionFocusApresFenetreSaisieAgenda(aParams) {
		if (aParams.numeroBouton !== 1 || this.estHebdomadaire()) {
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
	scrollToListeAgenda(aIndice) {
		this.getInstance(this.identListeAgenda).scrollTo({ ligne: aIndice });
	}
	getIndiceParElement(aArticle) {
		return UtilitaireAgenda_1.UtilitaireAgenda.getIndiceParElement(
			aArticle,
			this.getInstance(this.identListeAgenda),
		);
	}
	_initialiserListeAgenda(aInstance) {
		UtilitaireAgenda_1.UtilitaireAgenda.initListeAgenda(aInstance);
	}
	_evenementSurListeAgenda(aParams) {
		const lArticle = aParams.article;
		let lGenreEvt;
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				if (aParams.estDuplication) {
					this.evntDupliquerElementAgenda(lArticle);
					return;
				}
				this.evntBtnCreerElementAgenda();
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				if (lArticle.estPeriodique) {
					lGenreEvt = EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement;
					GApplication.getMessage().afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
						message: UtilitaireAgenda_1.UtilitaireAgenda._composeMessage(true),
						controleur: {
							RDEvenement: {
								getValue: function (aIndice) {
									return lGenreEvt === aIndice;
								},
								setValue: function (aIndice) {
									lGenreEvt = aIndice;
								},
							},
						},
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
						GApplication.getMessage().afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
							message:
								UtilitaireAgenda_1.UtilitaireAgenda._composeMessage(false),
							controleur: {
								RDEvenement: {
									getValue: function (aIndice) {
										return lGenreEvt === aIndice;
									},
									setValue: function (aIndice) {
										lGenreEvt = aIndice;
									},
								},
							},
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
	_callbackFenetreSaisieAgenda(aElement, aGenreEvt) {
		this.getInstance(this.identFenetreSaisieAgenda).setDonnees({
			agenda: aElement,
			listeClassesGroupes: this.donnees.listeClassesGroupes,
			etat: Enumere_Etat_1.EGenreEtat.Modification,
			avecSaisie: true,
			listePJ: this.listePiecesJointes,
			listeFamilles: this.donnees.listeFamilles,
			listeJourDansMois: this.donnees.listeJourDansMois,
			genreEvt: aGenreEvt,
			dateDebutAgenda: this.donnees.dateDebutPrevisionnel,
			dateFinAgenda: this.donnees.dateFinPrevisionnel,
		});
	}
	_callbackSupprimerAgenda(aElementAgenda, aGenreEvt) {
		if (MultipleObjetRequeteSaisieAgenda) {
			aElementAgenda.setEtat(Enumere_Etat_1.EGenreEtat.Suppression);
			if (aGenreEvt !== EGenreEvtAgenda_1.EGenreEvtAgenda.nonPeriodique) {
				aElementAgenda.periodicite.estEvtPerso =
					aGenreEvt === EGenreEvtAgenda_1.EGenreEvtAgenda.surEvtUniquement;
			}
			this.dateCourante = aElementAgenda.DateDebut;
			new MultipleObjetRequeteSaisieAgenda.ObjetRequeteSaisieAgenda(
				this,
				this.actionSurValidation,
			).lancerRequete({
				listeEvenements: this.donnees.listeEvenements,
				listePiecesJointes: this.listePiecesJointes,
			});
		}
	}
	_getEvenementParDefaut(aJourDeSemaine, aDate) {
		const lFamille = this.donnees.listeFamilles.get(0);
		return UtilitaireAgenda_1.UtilitaireAgenda._getEvenementParDefaut(
			aJourDeSemaine,
			aDate,
			lFamille,
			this.etatUtilisateur.pourPrimaire(),
		);
	}
	_initialiserFenetreSaisieAgenda(aInstance) {
		aInstance.setOptionsFenetre({
			largeur: 360,
			avecTailleSelonContenu: true,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	async requeteConsultation() {
		const lRes = await new ObjetRequetePageAgenda_1.ObjetRequetePageAgenda(
			this,
		).lancerRequete({
			numeroSemaine: this.donnees.NumeroSemaine,
			avecEventsPasses:
				UtilitaireAgenda_1.UtilitaireAgenda.getInfosOnglet().avecEventsPasses,
		});
		this.surReponseRequetePageAgenda(lRes);
	}
	_evenementFenetreSaisieAgenda(aParametres) {
		if (aParametres.numeroBouton === 1) {
			if (aParametres.evenement) {
				this.dateCourante = aParametres.evenement.DateDebut;
			}
			this.requeteConsultation();
		}
		this._gestionFocusApresFenetreSaisieAgenda(aParametres);
	}
	_actualiserAgenda(aEstGrille) {
		this.getInstance(this.identListeAgenda).setDonnees(
			new DonneesListe_Agenda_1.DonneesListe_Agenda(
				this.donnees.listeEvenements,
				{
					eventDupliquer: this.evntDupliquerElementAgenda.bind(this),
					callbackMenuCtx: this._evenementSurListeAgenda.bind(this),
					callbackCBEventsPasses: () => this.requeteConsultation(),
				},
			),
		);
		if (
			this._objGestionFocus_apresFenetreSaisieAgenda &&
			this._objGestionFocus_apresFenetreSaisieAgenda.element
		) {
			let lIndice;
			if (this._objGestionFocus_apresFenetreSaisieAgenda.numero) {
				lIndice = this.getInstance(this.identListeAgenda)
					.getDonneesListe()
					.Donnees.getIndiceParNumeroEtGenre(
						this._objGestionFocus_apresFenetreSaisieAgenda.numero,
					);
			} else {
				lIndice = this.getIndiceParElement(
					this._objGestionFocus_apresFenetreSaisieAgenda.element,
				);
			}
			if (lIndice) {
				this.scrollToListeAgenda(lIndice);
				this._objGestionFocus_apresFenetreSaisieAgenda = {};
				return;
			}
		}
		const lEvenementLePlusProche =
			UtilitaireAgenda_1.UtilitaireAgenda._getJourLePlusProche(
				this.donnees.listeEvenements,
				ObjetDate_1.GDate.aujourdhui,
			);
		if (
			lEvenementLePlusProche &&
			lEvenementLePlusProche.element &&
			MethodesObjet_1.MethodesObjet.isNumeric(lEvenementLePlusProche.indice)
		) {
			this.scrollToListeAgenda(lEvenementLePlusProche.indice);
		}
	}
	_afficherCacher(aEstGrille) {
		$(this._getIdInstance(this.identListeAgenda)).show();
	}
	_getIdInstance(aInstance) {
		return "#" + this.getNomInstance(aInstance).escapeJQ();
	}
}
exports.InterfacePageAgenda = InterfacePageAgenda;
