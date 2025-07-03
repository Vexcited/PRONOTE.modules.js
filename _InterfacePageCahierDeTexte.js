exports._InterfacePageCahierDeTexte = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const GUID_1 = require("GUID");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const Enumere_ModeAffichageTimeline_1 = require("Enumere_ModeAffichageTimeline");
const GestionnaireBlocTAF_1 = require("GestionnaireBlocTAF");
const GestionnaireBlocCDC_1 = require("GestionnaireBlocCDC");
const ObjetFenetre_1 = require("ObjetFenetre");
const GestionnaireBlocTAF_2 = require("GestionnaireBlocTAF");
const GestionnaireBlocCDC_2 = require("GestionnaireBlocCDC");
const ObjetRequetePageCahierDeTexte_1 = require("ObjetRequetePageCahierDeTexte");
const ObjetUtilitaireCahierDeTexte_1 = require("ObjetUtilitaireCahierDeTexte");
const EGenreTriCDT_1 = require("EGenreTriCDT");
const TypeDomaine_1 = require("TypeDomaine");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const ObjetFenetre_ListeTAFFaits_1 = require("ObjetFenetre_ListeTAFFaits");
const ObjetFenetre_Bloc_1 = require("ObjetFenetre_Bloc");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const PageCahierDeTexte_1 = require("PageCahierDeTexte");
const Enumere_RessourcePedagogique_1 = require("Enumere_RessourcePedagogique");
const PageCahierDeTexteEleve_1 = require("PageCahierDeTexteEleve");
const ObjetRequeteSaisieTAFFaitEleve_1 = require("ObjetRequeteSaisieTAFFaitEleve");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_Message_1 = require("Enumere_Message");
const InterfacePageCahierDeTexteCP_1 = require("InterfacePageCahierDeTexteCP");
const ObjetCelluleSemaine_1 = require("ObjetCelluleSemaine");
const Enumere_TypeRessourcesPedagogiques_1 = require("Enumere_TypeRessourcesPedagogiques");
const UtilitaireQCMPN_1 = require("UtilitaireQCMPN");
const ObjetDeserialiser_1 = require("ObjetDeserialiser");
const ObjetVisuEleveQCM_1 = require("ObjetVisuEleveQCM");
const ObjetRequeteDonneesContenusCDT_1 = require("ObjetRequeteDonneesContenusCDT");
const AccessApp_1 = require("AccessApp");
class _InterfacePageCahierDeTexte extends InterfacePageCahierDeTexteCP_1.ObjetInterfacePageCahierDeTexteCP {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.idTitreRessourcesPeda = GUID_1.GUID.getId();
		this.idBlocSujetsCorriges = GUID_1.GUID.getId();
		this.idBlocTravauxRendus = GUID_1.GUID.getId();
		this.idBlocQCM = GUID_1.GUID.getId();
		this.idBlocRessourcesGranulaires = GUID_1.GUID.getId();
		this.idBlocForumPedagogique = GUID_1.GUID.getId();
		this.idBlocDocumentsAutres = GUID_1.GUID.getId();
		this.idBlocRessourcesNumeriques = GUID_1.GUID.getId();
		this.listeRessourcesNumeriques = null;
		this.idZoneBlocsRessourcesPedagogiques = GUID_1.GUID.getId();
		this.ListeCahierDeTextes = new ObjetListeElements_1.ObjetListeElements();
		this.ListeTravailAFaire = new ObjetListeElements_1.ObjetListeElements();
		this.peuFaireTAF = [Enumere_Espace_1.EGenreEspace.Eleve].includes(
			this.etatUtilSco.GenreEspace,
		);
		this.ModeAffichage =
			this.etatUtilSco.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.CDT_TAF
				? Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.TravailAFaire
				: Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.ContenuDeCours;
		this.utilitaireCDT =
			new ObjetUtilitaireCahierDeTexte_1.ObjetUtilitaireCahierDeTexte(
				this.Nom + "_utilitaireCDT",
				this,
			);
		this.inclureTAFFait = true;
		this.inclureTAFAFaire = true;
		this.infoRessourceDeploye = {
			ressourcesNumeriques: false,
			sujetsCorriges: false,
			travauxRendu: false,
			QCM: false,
			ressourcesGranulaires: false,
			documentsAutres: false,
			forumPedagogique: false,
		};
		this.optionsBloc = {};
		this.date =
			this.etatUtilSco.getNavigationDate() || ObjetDate_1.GDate.aujourdhui;
		this.modeTimeLine = this.etatUtilSco.getModeAffichageTimeLine();
		if (!this.modeTimeLine) {
			this.modeTimeLine =
				Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.classique;
			this.etatUtilSco.setModeAffichageTimeLine(this.modeTimeLine);
		}
		this.avecBandeau = true;
	}
	construireInstances() {
		super.construireInstances();
		this.IdentCahierDeTexte = this.add(
			PageCahierDeTexteEleve_1.PageCahierDeTexteEleve,
			this.surEvenementPage,
		);
		this.gestionnaireTAF = ObjetIdentite_1.Identite.creerInstance(
			GestionnaireBlocTAF_2.GestionnaireBlocTAF,
			{
				pere: this,
				evenement: this.evenementSurBlocTAF.bind(this, { fenetre: false }),
			},
		);
		this.gestionnaireCDC = ObjetIdentite_1.Identite.creerInstance(
			GestionnaireBlocCDC_2.GestionnaireBlocCDC,
			{ pere: this, evenement: this.evenementSurBlocCDC },
		);
		this.identCelluleSemaine = this.add(
			ObjetCelluleSemaine_1.ObjetCelluleSemaine,
			this._evntCelluleSemaine,
			this._initCelluleSemaine,
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
			this.evenementSurVisuEleve,
		);
		this.identDetailCDT = this.addFenetre(
			ObjetFenetre_Bloc_1.ObjetFenetre_Bloc,
			null,
			this._initDetailCDT,
		);
		this.identImpression = this.add(
			PageCahierDeTexte_1.PageCahierDeTexte,
			null,
			this._initialiserCDTpourImpression,
		);
	}
	construireStructureListeADroite() {
		return [
			'<div id="',
			this.idZoneBlocsRessourcesPedagogiques,
			'" class="conteneur-ressourcePeda">',
			'<div style="max-width: 450px;">',
			'<div id="',
			this.idTitreRessourcesPeda,
			'" ></div>',
			'<div id="',
			this.idBlocRessourcesNumeriques,
			'" class="m-top-xl"></div>',
			'<div id="',
			this.idBlocSujetsCorriges,
			'" class="m-top-xl"></div>',
			'<div id="',
			this.idBlocTravauxRendus,
			'" class="m-top-xl"></div>',
			'<div id="',
			this.idBlocQCM,
			'" class="m-top-xl"></div>',
			'<div id="',
			this.idBlocRessourcesGranulaires,
			'" class="m-top-xl"></div>',
			'<div id="',
			this.idBlocForumPedagogique,
			'" class="m-top-xl"></div>',
			'<div id="',
			this.idBlocDocumentsAutres,
			'" class="m-top-xl"></div>',
			"</div>",
			"</div>",
		].join("");
	}
	setOptionsBloc(aOptionsBloc) {
		Object.assign(this.optionsBloc, aOptionsBloc);
		return this;
	}
	setModeTimeline(aModeTimeline) {
		this.modeTimeLine = aModeTimeline;
		if (this.existeInstance(this.identDetailCDT)) {
			this.getInstance(this.identDetailCDT).fermer();
		}
		this.etatUtilSco.setModeAffichageTimeLine(this.modeTimeLine);
	}
	evenementSurPage() {
		this.recupererDonnees();
	}
	recupererDonnees() {
		this.presetDates();
		this.finRecupererDonnees();
	}
	presetDates() {
		this.gestionnaireBloc =
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
				? this.gestionnaireTAF
				: this.gestionnaireCDC;
		this.initialiserBloc(this.gestionnaireBloc);
		this.gestionnaireBloc.initialiser();
		this.domaine = this.etatUtilSco.getDomaineSelectionne();
		this.dateDepuis = this.etatUtilSco.getDateDebutTimeLineCDT();
		this.estNavigationTAF = this.etatUtilSco.getPage();
		if (this.estNavigationTAF && this.estNavigationTAF.date) {
			const lDomaine = new TypeDomaine_1.TypeDomaine();
			const lSemaine = IE.Cycles.cycleDeLaDate(this.estNavigationTAF.date);
			lDomaine.vider();
			lDomaine.setValeur(true, lSemaine);
			this.domaine = lDomaine;
		}
		this.etatUtilSco.resetPage();
		this.domaineChronologique = this.initDomaineChronologique(this.dateDepuis);
		this.dateDepuis = ObjetDate_1.GDate.getDateBornee(
			IE.Cycles.dateDebutCycle(
				this.domaineChronologique.getPremierePosition(true),
			),
		);
		$("#" + this.idZoneChxModeAff.escapeJQ() + " > input")
			.off("change")
			.on("change", this._evenementChxModeAff.bind(this));
		this.setVisibilite();
	}
	finRecupererDonnees() {
		this.getInstance(this.identCelluleSemaine).setDonnees(
			IE.Cycles.dateDebutCycle(this.domaine.getPremierePosition(true)),
		);
		this.getInstance(this.identCelluleDate).setDonnees(this.dateDepuis);
		if (this.estChronologique()) {
			this.evenementSurCalendrier(this.domaineChronologique);
		}
	}
	_evntCelluleSemaine(aDomaine) {
		if (aDomaine && this.estHebdomadaire()) {
			this.modifierDomaine(aDomaine);
		}
	}
	_eventCelluleDate(aDate) {
		if (aDate && this.estChronologique()) {
			this.modifierDate(aDate);
			this.getInstance(this.identCelluleDate).setDonnees(aDate);
		}
	}
	getDomaineSelonAffichage() {
		let lDomaine;
		if (this.estChronologique()) {
			lDomaine = this.domaineChronologique;
		} else {
			lDomaine = this.domaine;
		}
		return lDomaine;
	}
	evenementSurBlocTAF(aObjet, aTAF, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.documentRendu:
				if (aObjet && aObjet.fenetre && aObjet.contexte) {
					new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
						this,
						this._actionApresRequeteDonneesTAFCDT.bind(this, {
							contexte: aObjet.contexte,
						}),
					).lancerRequete({
						cahierDeTextes: new ObjetElement_1.ObjetElement(
							"",
							aObjet.contexte.getNumero(),
						),
						pourTAF: true,
					});
				} else {
					this.evenementSurCalendrier(this.getDomaineSelonAffichage());
				}
				break;
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.executionQCM:
				this.surExecutionQCM(aParam.event, aTAF.getNumero(), aObjet);
				break;
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.voirQCM:
				this.surExecutionQCM(aParam.event, aTAF.getNumero(), aObjet);
				break;
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.voirContenu:
				new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
					this,
					this._actionApresRequeteDonneesContenusCDT,
				).lancerRequete({ cahierDeTextes: aTAF.cahierDeTextes });
				break;
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.detailTAF:
				this.surDetailRendu(aParam.event, aTAF.getNumero(), aObjet);
				break;
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.tafFait: {
				const lTAF = this.ListeTravailAFaire.getElementParNumero(
					aTAF.getNumero(),
				);
				if (!!lTAF) {
					lTAF.TAFFait = aTAF.TAFFait;
					this.actualiser();
				}
				break;
			}
			case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.executionKiosque:
				window.open(ObjetChaine_1.GChaine.creerUrlBruteLienExterne(aTAF));
				break;
			default:
				break;
		}
	}
	evenementSurBlocCDC(aElement, aGenreEvnt, aParam) {
		switch (aGenreEvnt) {
			case GestionnaireBlocCDC_1.EGenreBtnActionBlocCDC.executionQCM:
				this.surExecutionQCMContenu(aParam.event, aElement);
				break;
			case GestionnaireBlocCDC_1.EGenreBtnActionBlocCDC.navigationTAF:
				new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
					this,
					this._actionApresRequeteDonneesTAFCDT.bind(this, {
						contexte: aElement,
						pourLe: true,
					}),
				).lancerRequete({
					cahierDeTextes: new ObjetElement_1.ObjetElement(
						"",
						aElement.getNumero(),
					),
					pourTAF: true,
				});
				break;
			default:
				break;
		}
	}
	initialiserBloc(aInstance, aEstAffContenuDesCours) {
		let lEvent = null;
		if (this.estHebdomadaire()) {
			lEvent = this._afficheFenetreDetail.bind(
				this,
				this.ModeAffichage ===
					Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.TravailAFaire,
			);
		}
		aInstance.setOptions(
			Object.assign(
				{
					avecPastille: false,
					modeAffichage: this.modeTimeLine,
					formatDate:
						this.modeTimeLine ===
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact
							? "%Jjj %JJ %Mmm"
							: null,
					avecZoneAction: !this.estHebdomadaire() && !aEstAffContenuDesCours,
					avecBordure: this.estHebdomadaire(),
					initPlie: this.estHebdomadaire(),
					callBackTitre: lEvent,
					pourLe:
						this.modeTimeLine ===
						Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.compact,
					avecPourLeEtDonneeLe: true,
				},
				this.optionsBloc,
			),
		);
	}
	modifierDomaine(aDomaine) {
		const lDomaine = new TypeDomaine_1.TypeDomaine();
		const lSemaine = aDomaine.getPremierePosition(true);
		lDomaine.vider();
		lDomaine.setValeur(true, lSemaine, lSemaine);
		this.domaine = lDomaine;
		this.evenementSurCalendrier(this.domaine);
	}
	modifierDate(aDate) {
		this.domaineChronologique = this.initDomaineChronologique(aDate);
		this.dateDepuis = ObjetDate_1.GDate.getDateBornee(
			IE.Cycles.dateDebutCycle(
				this.domaineChronologique.getPremierePosition(true),
			),
		);
		this.etatUtilSco.setDateDebutTimeLineCDT(this.dateDepuis);
		this.evenementSurCalendrier(this.domaineChronologique);
	}
	evenementSurCalendrier(aDomaine) {
		if (this.estHebdomadaire()) {
			this.etatUtilSco.setDomaineSelectionne(aDomaine);
		}
		if (this.existeInstance(this.identDetailCDT)) {
			this.getInstance(this.identDetailCDT).fermer();
		}
		const lParams = { domaine: aDomaine };
		if (
			[
				Enumere_Espace_1.EGenreEspace.Academie,
				Enumere_Espace_1.EGenreEspace.Etablissement,
				Enumere_Espace_1.EGenreEspace.Professeur,
				Enumere_Espace_1.EGenreEspace.PrimProfesseur,
				Enumere_Espace_1.EGenreEspace.PrimDirection,
			].includes(this.etatUtilSco.GenreEspace)
		) {
			lParams.ressource = this.etatUtilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			if (
				!!lParams.ressource &&
				lParams.ressource.getGenre() !==
					Enumere_Ressource_1.EGenreRessource.Classe
			) {
				lParams.ressource = null;
			}
		}
		new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
			this,
			this.actionSurEvenementSurCalendrier,
		).lancerRequete(lParams);
	}
	actualiserPage() {
		const lParamsRequete = {
			domaine: this.getDomaineSelonAffichage(),
			ressource: this.etatUtilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
		};
		new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
			this,
			this.actionSurEvenementSurCalendrier,
		).lancerRequete(lParamsRequete);
	}
	surEvenementPage(aParams) {
		if (aParams) {
			if (aParams.cours) {
				new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
					this,
					this._actionApresRequeteDonneesTAFCDT.bind(this, {
						contexte: aParams.cours,
						pourLe: true,
					}),
				).lancerRequete({
					cahierDeTextes: new ObjetElement_1.ObjetElement(
						"",
						aParams.cours.getNumero(),
					),
					pourTAF: true,
				});
			}
			if (aParams.taf) {
				switch (aParams.GenreBtnAction) {
					case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.voirContenu:
						new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
							this,
							this._actionApresRequeteDonneesContenusCDT,
						).lancerRequete({ cahierDeTextes: aParams.taf.cahierDeTextes });
						break;
					case GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.detailTAF:
						this.surDetailRendu(null, aParams.taf.getNumero(), aParams.objet);
						break;
					default:
						this.evenementSurPage();
						break;
				}
			}
			if (aParams.executionQCM) {
				let i, j, k, lNbr, lElement, lContenu, lExecutionQCM;
				if (
					this.ModeAffichage ===
					Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.TravailAFaire
				) {
					if (aParams.CDT) {
						lElement = aParams.CDT;
						for (
							j = 0;
							lElement.listeContenus && j < lElement.listeContenus.count();
							j++
						) {
							lContenu = lElement.listeContenus.get(j);
							for (
								k = 0;
								lContenu.listeExecutionQCM &&
								k < lContenu.listeExecutionQCM.count();
								k++
							) {
								lExecutionQCM = lContenu.listeExecutionQCM.get(k);
								if (
									lExecutionQCM &&
									lExecutionQCM.getNumero() === aParams.executionQCM
								) {
									break;
								}
							}
							if (
								lExecutionQCM &&
								lExecutionQCM.getNumero() === aParams.executionQCM
							) {
								break;
							}
						}
						this.surExecutionQCMContenu(null, lExecutionQCM);
					} else {
						for (i = 0, lNbr = this.ListeTravailAFaire.count(); i < lNbr; i++) {
							lElement = this.ListeTravailAFaire.get(i);
							if (
								lElement.executionQCM &&
								!!aParams &&
								!!aParams.executionQCM &&
								lElement.executionQCM.getNumero() === aParams.executionQCM
							) {
								break;
							}
						}
						this.surExecutionQCM(null, lElement.getNumero());
					}
				} else {
					if (aParams.estRessource) {
						this.listeRessourcesPedagogiques.parcourir((D) => {
							if (
								D.ressource &&
								D.ressource.getNumero() === aParams.executionQCM
							) {
								lExecutionQCM = D.ressource;
								return false;
							}
						});
						this._ouvrirExecutionQCM(lExecutionQCM);
					} else if (aParams.TAFQCM) {
						lContenu = aParams.TAFQCM;
						for (
							i = 0, lNbr = lContenu.ListeTravailAFaire.count();
							i < lNbr;
							i++
						) {
							lElement = lContenu.ListeTravailAFaire.get(i);
							if (
								lElement.executionQCM &&
								!!aParams &&
								!!aParams.executionQCM &&
								lElement.executionQCM.getNumero() === aParams.executionQCM
							) {
								break;
							}
						}
						this.surExecutionQCM(null, lElement.getNumero(), aParams);
					} else {
						for (i = 0; i < this.ListeCahierDeTextes.count(); i++) {
							lElement = this.ListeCahierDeTextes.get(i);
							for (
								j = 0;
								lElement.listeContenus && j < lElement.listeContenus.count();
								j++
							) {
								lContenu = lElement.listeContenus.get(j);
								for (
									k = 0;
									lContenu.listeExecutionQCM &&
									k < lContenu.listeExecutionQCM.count();
									k++
								) {
									lExecutionQCM = lContenu.listeExecutionQCM.get(k);
									if (
										lExecutionQCM &&
										lExecutionQCM.getNumero() === aParams.executionQCM
									) {
										break;
									}
								}
								if (
									lExecutionQCM &&
									lExecutionQCM.getNumero() === aParams.executionQCM
								) {
									break;
								}
							}
							if (
								lExecutionQCM &&
								lExecutionQCM.getNumero() === aParams.executionQCM
							) {
								break;
							}
						}
						this.surExecutionQCMContenu(null, lExecutionQCM);
					}
				}
			}
			if (aParams.nodeDeploye) {
				this._setInfoRessourceDeploye(aParams.nodeDeploye);
			}
		} else {
			this.apresModificationTAF = true;
			if (this.donnee) {
				if (this.fenetre) {
					this.fenetre.fermer();
				}
				this.evenementSurPage();
			} else {
				this.evenementSurPage();
			}
		}
	}
	evenementFiche(aParam) {
		if (aParam && aParam.surTAFARendre) {
			this.recupererDonnees();
		} else if (aParam && aParam.executionQCM) {
			this._ouvrirExecutionQCM(aParam.executionQCM);
		}
	}
	actualiser() {
		this.ModeAffichage =
			this.etatUtilSco.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.CDT_TAF
				? Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.TravailAFaire
				: Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.ContenuDeCours;
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
		const lDonnees = this.formatDonnees();
		if (lDonnees && lDonnees.count()) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Normale,
				this,
			);
		}
		let lCompteurRessources = 0;
		if (
			!this.estHebdomadaire() &&
			this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.ContenuDeCours &&
			!!this.listeRessourcesNumeriques &&
			this.listeRessourcesNumeriques.count() > 0
		) {
			const lHtmlRessourcesNumerique = this.getInstance(
				this.IdentCahierDeTexte,
			).composeManuelsNumeriques(
				this.listeRessourcesNumeriques,
				this.filtreMatiere,
				this.infoRessourceDeploye,
			);
			ObjetHtml_1.GHtml.setHtml(
				this.idBlocRessourcesNumeriques,
				lHtmlRessourcesNumerique,
				this.getInstance(this.IdentCahierDeTexte).controleur,
			);
			lCompteurRessources += lHtmlRessourcesNumerique.length;
			$("#" + this.idBlocRessourcesNumeriques.escapeJQ()).show();
		} else {
			$("#" + this.idBlocRessourcesNumeriques.escapeJQ()).hide();
		}
		const lRessourcesPedagogiquesParType =
			this._regrouperRessourcesPedagogiquesParType(
				this.listeRessourcesPedagogiques,
				this.filtreMatiere,
				this.filtreThemes,
			);
		if (
			!this.estHebdomadaire() &&
			this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.ContenuDeCours &&
			((!!this.listeRessourcesPedagogiques &&
				this.listeRessourcesPedagogiques.count() > 0) ||
				(!!this.listeRessourcesNumeriques &&
					this.listeRessourcesNumeriques.count() > 0))
		) {
			for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
				Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques,
			)) {
				const lType =
					Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques[
						lKey
					];
				let lHtmlListeRessourcesPeda = "";
				const lIdBlocRessources =
					this._getIdBlocRessourcesPedagogiquePourType(lType);
				if (
					!!lIdBlocRessources &&
					!!lRessourcesPedagogiquesParType[lType] &&
					!!this.filtreMatiere
				) {
					lHtmlListeRessourcesPeda = this.getInstance(
						this.IdentCahierDeTexte,
					).composeRessourcesPeda(
						lRessourcesPedagogiquesParType[lType],
						lType,
						this.infoRessourceDeploye,
					);
				}
				ObjetHtml_1.GHtml.setHtml(
					lIdBlocRessources,
					lHtmlListeRessourcesPeda,
					this.getInstance(this.IdentCahierDeTexte).controleur,
				);
				lCompteurRessources += lHtmlListeRessourcesPeda.length;
			}
			ObjetHtml_1.GHtml.setHtml(
				this.idTitreRessourcesPeda,
				lCompteurRessources > 0
					? this.getInstance(
							this.IdentCahierDeTexte,
						).composeTitreRessourcesPeda()
					: "",
			);
			$("#" + this.idZoneBlocsRessourcesPedagogiques.escapeJQ()).show();
			const lElementTitreRessource = $(
				"#" + this.idTitreRessourcesPeda.escapeJQ(),
			);
			if (
				lElementTitreRessource &&
				lElementTitreRessource.get(0) &&
				lElementTitreRessource.get(0).scrollIntoView
			) {
				lElementTitreRessource.get(0).scrollIntoView();
			}
		} else {
			$("#" + this.idZoneBlocsRessourcesPedagogiques.escapeJQ()).hide();
		}
		const lDomaine = this.getDomaineSelonAffichage();
		const lParams = {
			modeAffichage: this.modeTimeLine,
			avecJoursOuvres: true,
			debutGrille: IE.Cycles.dateDebutCycle(lDomaine.getPremierePosition(true)),
			finGrille: IE.Cycles.dateFinCycle(lDomaine.getDernierePosition(true)),
		};
		this.gestionnaireBloc =
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
				? this.gestionnaireTAF
				: this.gestionnaireCDC;
		this.initialiserBloc(
			this.gestionnaireBloc,
			this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.ContenuDeCours,
		);
		this.getInstance(this.IdentTimeLine).setOptions(lParams);
		const lTris = [];
		if (
			this.modeTimeLine ===
			Enumere_ModeAffichageTimeline_1.EModeAffichageTimeline.grille
		) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((a) => {
					return ObjetDate_1.GDate.getJour(a.DateDebut);
				}, Enumere_TriElement_1.EGenreTriElement.Decroissant),
			);
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"DateDebut",
					Enumere_TriElement_1.EGenreTriElement.Croissant,
				),
			);
		} else {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"DateDebut",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			);
		}
		lDonnees.setTri(lTris);
		lDonnees.trier();
		if (!this.estHebdomadaire()) {
			$("#" + this.getInstance(this.IdentTimeLine).getNom().escapeJQ()).hide();
			$(
				"#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
			).show();
		} else {
			$(
				"#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
			).hide();
			$("#" + this.getInstance(this.IdentTimeLine).getNom().escapeJQ()).show();
		}
		if (lDonnees.count() > 0 || this.estHebdomadaire()) {
			const lListeFiltree =
				this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire
					? this.listeTAFFiltres
					: this.listeCDCFiltres;
			const lParamsTL = {
				liste: !this.estHebdomadaire() ? lListeFiltree : lDonnees,
				gestionnairesBlocs: [this.gestionnaireBloc],
				avecFiltrage: this.filtreMatiere !== null,
			};
			if (this.estNavigationTAF && this.estNavigationTAF.date) {
				lParamsTL.dateCourante = this.estNavigationTAF.date;
				this.estNavigationTAF = null;
			}
			if (!this.estHebdomadaire()) {
				$(
					"#" + this.getInstance(this.IdentCahierDeTexte).getNom().escapeJQ(),
				).get(0).style.maxWidth = "80rem";
				this.getInstance(this.IdentCahierDeTexte).setDonnees(lParamsTL);
			} else {
				this.getInstance(this.IdentTimeLine).setDonnees(lParamsTL);
				const lJqBloc = $(
					"#" + this.getNomInstance(this.IdentTimeLine).escapeJQ(),
				);
				const lJqContenu = lJqBloc.find(".PourFenetreBloc_Contenu");
				lJqContenu.each(function () {
					$(this)
						.parents(".UtilitaireBloc_containerNormal")
						.first()
						.css({ "justify-content": "flex-start" });
				});
			}
		} else {
			let lMessage = "";
			const lClasse = this.etatUtilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			);
			if (
				[
					Enumere_Espace_1.EGenreEspace.Academie,
					Enumere_Espace_1.EGenreEspace.Etablissement,
					Enumere_Espace_1.EGenreEspace.Professeur,
					Enumere_Espace_1.EGenreEspace.PrimProfesseur,
					Enumere_Espace_1.EGenreEspace.PrimDirection,
				].includes(this.etatUtilSco.GenreEspace) &&
				(!lClasse ||
					lClasse.getGenre() !== Enumere_Ressource_1.EGenreRessource.Classe)
			) {
				lMessage =
					ObjetTraduction_1.GTraductions.getValeur("Message")[
						Enumere_Message_1.EGenreMessage.SelectionClasse
					];
			} else {
				if (
					this.ModeAffichage ===
					Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
						.TravailAFaire
				) {
					if (this.listeMatieres && this.listeMatieres.count() > 0) {
						lMessage = ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.AucunTAFAVenirSelonCriteres",
						);
					} else {
						lMessage = ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.AucunTAFJoursAVenir",
							[ObjetDate_1.GDate.formatDate(this.dateDepuis, "%JJ/%MM/%AAAA")],
						);
					}
				} else {
					lMessage = ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.AucunContenuJoursAVenir",
						[ObjetDate_1.GDate.formatDate(this.dateDepuis, "%JJ/%MM/%AAAA")],
					);
				}
			}
			this.getInstance(this.IdentCahierDeTexte).afficher(
				'<div class="message-vide card card-nodata"><div class="card-content">' +
					this.composeMessage(lMessage) +
					'</div><div class="Image_No_Data" aria-hidden="true"></div></div>',
			);
		}
	}
	actionSurEvenementSurCalendrier(aParametres) {
		this.ListeTravailAFaire = aParametres.listeTAF;
		this.ListeCahierDeTextes = aParametres.listeCDT;
		this.listeDS = aParametres.listeDS;
		this.listeRessourcesNumeriques = aParametres.listeRessourcesNumeriques;
		this.listeRessourcesPedagogiques = aParametres.listeRessourcesPedagogiques;
		this.gestionMatiere();
		this.listeThemes = this.getListeThemes();
		let lScrollTop = 0;
		const lElementScroll = ObjetHtml_1.GHtml.getElement(
			this.getInstance(this.IdentCahierDeTexte).getNom(),
		);
		lScrollTop = lElementScroll.scrollTop;
		this.actualiser();
		lElementScroll.scrollTop = lScrollTop;
		if (
			this.estChronologique() &&
			this.ModeAffichage ===
				Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
					.TravailAFaire
		) {
			this.mettreFocusSurProchainTAF(this.ListeTravailAFaire);
		}
	}
	getListeThemes() {
		let lResult = new ObjetListeElements_1.ObjetListeElements();
		let lThemeDeLaListe;
		if (
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
		) {
			this.ListeTravailAFaire.parcourir((aElement) => {
				if (
					!!aElement &&
					!!aElement.ListeThemes &&
					aElement.ListeThemes.count()
				) {
					aElement.ListeThemes.parcourir((aTheme) => {
						lThemeDeLaListe = lResult.getElementParNumero(aTheme.getNumero());
						if (!lThemeDeLaListe) {
							lThemeDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(aTheme);
							lResult.addElement(lThemeDeLaListe);
						}
					});
				}
			});
		} else {
			this.ListeCahierDeTextes.parcourir((aElement) => {
				if (
					!!aElement &&
					!!aElement.listeContenus &&
					aElement.listeContenus.count()
				) {
					aElement.listeContenus.parcourir((aContenu) => {
						if (
							!!aContenu &&
							!!aContenu.ListeThemes &&
							aContenu.ListeThemes.count()
						) {
							aContenu.ListeThemes.parcourir((aTheme) => {
								lThemeDeLaListe = lResult.getElementParNumero(
									aTheme.getNumero(),
								);
								if (!lThemeDeLaListe) {
									lThemeDeLaListe =
										MethodesObjet_1.MethodesObjet.dupliquer(aTheme);
									lResult.addElement(lThemeDeLaListe);
								}
							});
						}
					});
				}
			});
			if (!!this.listeRessourcesPedagogiques) {
				this.listeRessourcesPedagogiques.parcourir((aRessource) => {
					if (
						!!aRessource &&
						!!aRessource.ListeThemes &&
						aRessource.ListeThemes.count()
					) {
						aRessource.ListeThemes.parcourir((aTheme) => {
							lThemeDeLaListe = lResult.getElementParNumero(aTheme.getNumero());
							if (!lThemeDeLaListe) {
								lThemeDeLaListe =
									MethodesObjet_1.MethodesObjet.dupliquer(aTheme);
								lResult.addElement(lThemeDeLaListe);
							}
						});
					}
				});
			}
		}
		lResult.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lResult.trier();
		lResult.insererElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur("CahierDeTexte.tousLesThemes"),
				null,
				-1,
			),
			0,
		);
		return lResult;
	}
	getPageImpression() {
		this.getInstance(this.identImpression).setDonnees(
			this.listeTAFFiltres,
			this.listeCDCFiltres,
		);
		this.getInstance(this.identImpression).actualiser(
			this.ModeAffichage,
			EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe,
		);
		return {
			contenu: this.getInstance(this.identImpression).composePage(true),
		};
	}
	getListeMatieres() {
		const lResult = new ObjetListeElements_1.ObjetListeElements();
		let lMatiereDeLaListe;
		if (
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
		) {
			this.ListeTravailAFaire.parcourir((aElement) => {
				lMatiereDeLaListe = lResult.getElementParNumero(
					aElement.Matiere.getNumero(),
				);
				if (!lMatiereDeLaListe) {
					lMatiereDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(
						aElement.Matiere,
					);
					lMatiereDeLaListe.nbElementsConcernes = 0;
					lMatiereDeLaListe.couleurFond = aElement.CouleurFond;
					lResult.addElement(lMatiereDeLaListe);
				}
				lMatiereDeLaListe.nbElementsConcernes++;
			});
		} else {
			this.ListeCahierDeTextes.parcourir((aElement) => {
				if (
					!!aElement &&
					!!aElement.listeContenus &&
					aElement.listeContenus.count() > 0
				) {
					lMatiereDeLaListe = lResult.getElementParNumero(
						aElement.Matiere.getNumero(),
					);
					if (!lMatiereDeLaListe) {
						lMatiereDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(
							aElement.Matiere,
						);
						lMatiereDeLaListe.nbElementsConcernes = 0;
						lMatiereDeLaListe.couleurFond = aElement.CouleurFond;
						lResult.addElement(lMatiereDeLaListe);
					}
					lMatiereDeLaListe.nbElementsConcernes++;
				}
			});
			if (!!this.listeRessourcesPedagogiques) {
				this.listeRessourcesPedagogiques.parcourir((aRessource) => {
					if (!!aRessource && !!aRessource.matiere) {
						lMatiereDeLaListe = lResult.getElementParNumero(
							aRessource.matiere.getNumero(),
						);
						if (!lMatiereDeLaListe) {
							lMatiereDeLaListe = MethodesObjet_1.MethodesObjet.dupliquer(
								aRessource.matiere,
							);
							lMatiereDeLaListe.nbElementsConcernes = 0;
							lMatiereDeLaListe.couleurFond = aRessource.matiere.CouleurFond;
							lResult.addElement(lMatiereDeLaListe);
						}
						lMatiereDeLaListe.nbElementsConcernes++;
					}
				});
			}
		}
		lResult.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lResult.trier();
		if (lResult.count() > 0) {
			lResult.insererElement(
				new ObjetElement_1.ObjetElement(
					ObjetTraduction_1.GTraductions.getValeur(
						"TAFEtContenu.toutesLesMatieres",
					),
					null,
					-1,
				),
				0,
			);
		}
		return lResult;
	}
	formatDonnees() {
		let lListeTAF = new ObjetListeElements_1.ObjetListeElements();
		let lListeCDC = new ObjetListeElements_1.ObjetListeElements();
		const lAvecTestFiltreMatiere = this.estChronologique();
		let llTestFiltreMatiere;
		if (
			this.ModeAffichage ===
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes
				.TravailAFaire
		) {
			lListeTAF = this.ListeTravailAFaire.getListeElements((aElement) => {
				const lFait = aElement.executionQCM
					? aElement.QCMFait
					: aElement.TAFFait;
				const lTestFiltreTAF =
					(this.inclureTAFFait && lFait) || (this.inclureTAFAFaire && !lFait);
				llTestFiltreMatiere =
					!this.filtreMatiere ||
					this.filtreMatiere.getNumero() === aElement.Matiere.getNumero();
				return (
					lTestFiltreTAF && (!lAvecTestFiltreMatiere || llTestFiltreMatiere)
				);
			});
			if (this.filtreThemes) {
				lListeTAF = lListeTAF.getListeElements((aElement) => {
					let lTestTheme = false;
					if (aElement.ListeThemes && aElement.ListeThemes.count()) {
						aElement.ListeThemes.parcourir((aTheme) => {
							if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
								lTestTheme = true;
							}
						});
					}
					return lTestTheme;
				});
			}
		} else {
			this.ListeCahierDeTextes.parcourir((aEl) => {
				lListeCDC.add(Object.assign(new ObjetElement_1.ObjetElement(), aEl));
			});
			lListeCDC = lListeCDC.getListeElements((aElement) => {
				llTestFiltreMatiere =
					!this.filtreMatiere ||
					this.filtreMatiere.getNumero() === aElement.Matiere.getNumero();
				return llTestFiltreMatiere;
			});
			if (this.filtreThemes) {
				lListeCDC.parcourir((aCDT) => {
					aCDT.listeContenus = aCDT.listeContenus.getListeElements(
						(aContenu) => {
							let lTestTheme = false;
							if (aContenu.ListeThemes && aContenu.ListeThemes.count()) {
								aContenu.ListeThemes.parcourir((aTheme) => {
									if (aTheme.getNumero() === this.filtreThemes.getNumero()) {
										lTestTheme = true;
									}
								});
							}
							return lTestTheme;
						},
					);
				});
				lListeCDC = lListeCDC.getListeElements((aElement) => {
					return !!aElement.listeContenus.count();
				});
			}
		}
		this.listeTAFFiltres = lListeTAF;
		this.listeCDCFiltres = lListeCDC;
		return this.utilitaireCDT.formatDonnees({
			modeAffichage: this.ModeAffichage,
			listeCDT: lListeCDC,
			listeTAF: lListeTAF,
			listeDS: this.listeDS,
			sansRegroupementTAF: true,
			avecDS: false,
			avecTAF: true,
			nom: this.Nom,
			pere: this,
			avecDetailTAF:
				this.etatUtilSco.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Professeur,
			controleur: this.controleur,
		});
	}
	surDetailRendu(aEvent, aNumeroElement, aObjet) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		const lListeTAF =
			aObjet && aObjet.fenetre && aObjet.contexte
				? this.listeTAFDeContenu
				: this.ListeTravailAFaire;
		const lElement = lListeTAF.getElementParNumero(aNumeroElement);
		ObjetFenetre_ListeTAFFaits_1.ObjetFenetre_ListeTAFFaits.ouvrir(
			{
				pere: this,
				evenement: this._surEvenementFenetreListeTAFFaits.bind(this),
			},
			lElement,
		);
	}
	surExecutionQCM(aEvent, aNumeroElement, aObjet) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		let lElement;
		if (aObjet && aObjet.fenetre && aObjet.contexte) {
			lElement = this.listeTAFDeContenu.getElementParNumero(aNumeroElement);
		} else {
			lElement = this.ListeTravailAFaire.getElementParNumero(aNumeroElement);
		}
		this.evenementFiche({ executionQCM: lElement.executionQCM });
	}
	surExecutionQCMContenu(aEvent, aElement) {
		if (aEvent) {
			aEvent.stopImmediatePropagation();
		}
		this.evenementFiche({ executionQCM: aElement });
	}
	evenementSurVisuEleve(aParam) {
		if (aParam.action === ObjetVisuEleveQCM_1.TypeCallbackVisuEleveQCM.close) {
			this.evenementSurCalendrier(this.getDomaineSelonAffichage());
		}
	}
	modifierInclureTAF(aTAFFait, aValue) {
		if (aTAFFait) {
			this.inclureTAFFait = aValue;
			if (!aValue && !this.inclureTAFAFaire) {
				this.inclureTAFAFaire = true;
			}
		} else {
			this.inclureTAFAFaire = aValue;
			if (!aValue && !this.inclureTAFFait) {
				this.inclureTAFFait = true;
			}
		}
		if (this.existeInstance(this.identDetailCDT)) {
			this.getInstance(this.identDetailCDT).fermer();
		}
		this.actualiser();
	}
	_initialiserCDTpourImpression(aInstance) {
		aInstance.setParametres(true, true);
		aInstance.setVisible(false);
	}
	_initDetailCDT(aInstance) {
		aInstance.setOptionsFenetre({ modale: false });
	}
	initDomaineChronologique(aDate) {
		const lResult = new TypeDomaine_1.TypeDomaine();
		let lDate;
		if (aDate) {
			lDate = aDate;
		} else {
			lDate = new Date();
			lDate.setDate(lDate.getDate() - 30);
		}
		lDate = ObjetDate_1.GDate.getDateBornee(lDate);
		const lSemaine = IE.Cycles.cycleDeLaDate(lDate);
		lResult.vider();
		lResult.setValeur(
			true,
			lSemaine,
			TypeDomaine_1.TypeDomaine.C_MaxDomaineCycle,
		);
		return lResult;
	}
	_actionApresRequeteDonneesContenusCDT(aJSON) {
		const lDonnee =
			aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
				? aJSON.ListeCahierDeTextes.getPremierElement()
				: null;
		this.listeContenuDeTAF = aJSON.ListeCahierDeTextes;
		if (lDonnee) {
			new ObjetDeserialiser_1.ObjetDeserialiser().deserialiserCahierDeTexte(
				lDonnee,
			);
			this._afficheFenetreDetail(false, lDonnee);
		} else {
		}
	}
	_actionApresRequeteDonneesTAFCDT(aParams, aJSON) {
		const lDonnee =
			aJSON.ListeCahierDeTextes && aJSON.ListeCahierDeTextes.count() === 1
				? aJSON.ListeCahierDeTextes.getPremierElement()
				: null;
		this.listeTAFDeContenu = lDonnee.ListeTravailAFaire;
		if (lDonnee) {
			this._afficheFenetreDetail(true, lDonnee);
		} else {
		}
	}
	_afficheFenetreDetail(aEstTAF, aDonnee) {
		const lRessource =
			"ressources" in aDonnee &&
			aDonnee.ressources &&
			aDonnee.ressources.getPremierElement()
				? aDonnee.ressources.getPremierElement()
				: null;
		const lDonnee = lRessource ? lRessource.elementOriginal : aDonnee;
		this.donnee = lDonnee;
		if (this.fenetre) {
			this.fenetre.fermer();
		}
		this.fenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				evenement: function (aGenreBouton) {
					if (aGenreBouton !== 1) {
						this.donnee = null;
					}
				},
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: aEstTAF
							? ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.TravailAFaire",
								)
							: ObjetTraduction_1.GTraductions.getValeur(
									"CahierDeTexte.ContenuDuCours",
								),
						largeur: 600,
						hauteurMaxContenu: 600,
						avecScroll: true,
						listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
					});
				},
			},
		);
		const lThis = this;
		$.extend(this.fenetre.controleur, {
			appelQCM: {
				event: function (aNumeroQCM) {
					if (aEstTAF) {
						lThis.surEvenementPage({
							TAFQCM: lDonnee,
							executionQCM: aNumeroQCM,
							fenetre: lThis.fenetre,
							contexte: true,
						});
					} else {
						lThis.surEvenementPage({
							CDT: lDonnee,
							executionQCM: aNumeroQCM,
							fenetre: lThis.fenetre,
							contexte: true,
						});
					}
				},
			},
			evenementTafFait: {
				getValue: function (aNumeroTaf) {
					const lElement = lDonnee.ListeTravailAFaire
						? lDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTaf)
						: lDonnee;
					return lElement.TAFFait;
				},
				setValue: function (aNumeroTaf) {
					const lElement = lDonnee.ListeTravailAFaire
						? lDonnee.ListeTravailAFaire.getElementParNumero(aNumeroTaf)
						: lDonnee;
					if (!!lElement.TAFFait) {
						lElement.TAFFait = false;
					} else {
						lElement.TAFFait = true;
					}
					lElement.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
					new ObjetRequeteSaisieTAFFaitEleve_1.ObjetRequeteSaisieTAFFaitEleve(
						lThis,
					)
						.lancerRequete({
							listeTAF: lDonnee.ListeTravailAFaire
								? lDonnee.ListeTravailAFaire
								: new ObjetListeElements_1.ObjetListeElements().add(lDonnee),
						})
						.then(() => {
							if (
								lThis.estHebdomadaire() &&
								lThis.ModeAffichage ===
									Enumere_AffichageCahierDeTextes_1
										.EGenreAffichageCahierDeTextes.TravailAFaire
							) {
								lThis.callback.appel();
							}
							lThis.fenetre.actualiser();
							let lHtml;
							lHtml = lThis
								.getInstance(lThis.IdentCahierDeTexte)
								.composeTAF(
									lDonnee,
									lThis.fenetre.controleur,
									lThis.estChronologique(),
								);
							ObjetHtml_1.GHtml.setHtml(lThis.fenetre.IdContenu, lHtml, {
								controleur: lThis.fenetre.controleur,
							});
						});
				},
			},
			appelDetailTAF: {
				event: function (aNumero) {
					let lTAF = lThis.ListeTravailAFaire.getElementParNumero(aNumero);
					if (!lTAF) {
						lTAF = lThis.listeTAFDeContenu.getElementParNumero(aNumero);
						lThis.surEvenementPage({
							GenreBtnAction:
								GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.detailTAF,
							taf: lTAF,
							objet: { fenetre: lThis.fenetre, contexte: lTAF },
						});
					} else {
						lThis.surEvenementPage({
							GenreBtnAction:
								GestionnaireBlocTAF_1.EGenreBtnActionBlocTAF.detailTAF,
							taf: lTAF,
						});
					}
				},
			},
			appelCours: {
				event: function (aNumero) {
					let lTAF = lThis.ListeTravailAFaire.getElementParNumero(aNumero);
					if (!lTAF) {
						lTAF = lThis.listeTAFDeContenu.getElementParNumero(aNumero);
					}
					new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
						lThis,
						lThis._actionApresRequeteDonneesContenusCDT,
					).lancerRequete({ cahierDeTextes: lTAF.cahierDeTextes });
				},
			},
			appelTAF: {
				event: function (aNumero) {
					let lCours = lThis.ListeCahierDeTextes.getElementParNumero(aNumero);
					if (!lCours) {
						lCours = lThis.listeContenuDeTAF.getElementParNumero(aNumero);
					}
					new ObjetRequeteDonneesContenusCDT_1.ObjetRequeteDonneesContenusCDT(
						lThis,
						lThis._actionApresRequeteDonneesTAFCDT.bind(lThis, {
							contexte: lCours,
							pourLe: true,
						}),
					).lancerRequete({
						cahierDeTextes: new ObjetElement_1.ObjetElement(
							"",
							lCours.getNumero(),
						),
						pourTAF: true,
					});
				},
			},
		});
		if (aEstTAF) {
			this.fenetre.afficher(
				this.getInstance(this.IdentCahierDeTexte).composeTAF(
					lDonnee,
					this.fenetre.controleur,
					this.estChronologique(),
				),
			);
		} else {
			this.fenetre.afficher(
				this.getInstance(this.IdentCahierDeTexte).composeCours(
					lDonnee,
					this.estChronologique(),
				),
			);
		}
	}
	_ouvrirExecutionQCM(aExecutionQCM) {
		UtilitaireQCMPN_1.UtilitaireQCMPN.executerQCM(
			this.getInstance(this.identFenetreVisuQCM),
			aExecutionQCM,
		);
	}
	_regrouperRessourcesPedagogiquesParType(
		aListeRessources,
		aMatiereFiltrante,
		aFiltreTheme,
	) {
		const lRessourcesPedagogiquesParType = {};
		if (!!aListeRessources) {
			aListeRessources.parcourir((D) => {
				if (
					!D.matiere ||
					!aMatiereFiltrante ||
					D.matiere.getNumero() === aMatiereFiltrante.getNumero()
				) {
					let lEstRessourceFiltree = true;
					if (aFiltreTheme) {
						lEstRessourceFiltree = false;
						if (D.ListeThemes && D.ListeThemes.count()) {
							D.ListeThemes.parcourir((aTheme) => {
								if (aTheme.getNumero() === aFiltreTheme.getNumero()) {
									lEstRessourceFiltree = true;
								}
							});
						}
					}
					if (lEstRessourceFiltree) {
						let lTypeListe;
						if (
							D.getGenre() ===
								Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
									.sujet ||
							D.getGenre() ===
								Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
									.corrige
						) {
							lTypeListe =
								Enumere_TypeRessourcesPedagogiques_1
									.EGenreTypeRessourcesPedagogiques.SujetOuCorrige;
						} else if (
							D.getGenre() ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique
								.travailRendu
						) {
							lTypeListe =
								Enumere_TypeRessourcesPedagogiques_1
									.EGenreTypeRessourcesPedagogiques.TravailRendu;
						} else if (
							D.getGenre() ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.QCM
						) {
							lTypeListe =
								Enumere_TypeRessourcesPedagogiques_1
									.EGenreTypeRessourcesPedagogiques.QCM;
						} else if (D.estForumPeda) {
							lTypeListe =
								Enumere_TypeRessourcesPedagogiques_1
									.EGenreTypeRessourcesPedagogiques.ForumPedagogique;
						} else if (
							D.getGenre() ===
							Enumere_RessourcePedagogique_1.EGenreRessourcePedagogique.kiosque
						) {
							lTypeListe =
								Enumere_TypeRessourcesPedagogiques_1
									.EGenreTypeRessourcesPedagogiques.RessourcesGranulaires;
						} else {
							lTypeListe =
								Enumere_TypeRessourcesPedagogiques_1
									.EGenreTypeRessourcesPedagogiques.Autre;
						}
						if (!lRessourcesPedagogiquesParType[lTypeListe]) {
							lRessourcesPedagogiquesParType[lTypeListe] =
								new ObjetListeElements_1.ObjetListeElements();
						}
						lRessourcesPedagogiquesParType[lTypeListe].addElement(D);
					}
				}
			});
		}
		return lRessourcesPedagogiquesParType;
	}
	_getIdBlocRessourcesPedagogiquePourType(aType) {
		let lIdBloc = null;
		switch (aType) {
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.SujetOuCorrige:
				lIdBloc = this.idBlocSujetsCorriges;
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.TravailRendu:
				lIdBloc = this.idBlocTravauxRendus;
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.QCM:
				lIdBloc = this.idBlocQCM;
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.ForumPedagogique:
				lIdBloc = this.idBlocForumPedagogique;
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.RessourcesGranulaires:
				lIdBloc = this.idBlocRessourcesGranulaires;
				break;
			case Enumere_TypeRessourcesPedagogiques_1.EGenreTypeRessourcesPedagogiques
				.Autre:
				lIdBloc = this.idBlocDocumentsAutres;
				break;
			default:
				break;
		}
		return lIdBloc;
	}
	_setInfoRessourceDeploye(aNode) {
		const lIdBloc = aNode.parent().get(0).id;
		switch (lIdBloc) {
			case this.idBlocRessourcesNumeriques:
				this.infoRessourceDeploye.ressourcesNumeriques =
					!this.infoRessourceDeploye.ressourcesNumeriques;
				break;
			case this.idBlocSujetsCorriges:
				this.infoRessourceDeploye.sujetsCorriges =
					!this.infoRessourceDeploye.sujetsCorriges;
				break;
			case this.idBlocTravauxRendus:
				this.infoRessourceDeploye.travauxRendu =
					!this.infoRessourceDeploye.travauxRendu;
				break;
			case this.idBlocQCM:
				this.infoRessourceDeploye.QCM = !this.infoRessourceDeploye.QCM;
				break;
			case this.idBlocRessourcesGranulaires:
				this.infoRessourceDeploye.ressourcesGranulaires =
					!this.infoRessourceDeploye.ressourcesGranulaires;
				break;
			case this.idBlocForumPedagogique:
				this.infoRessourceDeploye.forumPedagogique =
					!this.infoRessourceDeploye.forumPedagogique;
				break;
			case this.idBlocDocumentsAutres:
				this.infoRessourceDeploye.documentsAutres =
					!this.infoRessourceDeploye.documentsAutres;
				break;
			default:
				break;
		}
	}
	_surEvenementFenetreListeTAFFaits() {
		this.actualiserPage();
	}
}
exports._InterfacePageCahierDeTexte = _InterfacePageCahierDeTexte;
