exports._InterfaceReleveDeNotes = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const InterfacePage_1 = require("InterfacePage");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const DonneesListe_ReleveDeNotes_1 = require("DonneesListe_ReleveDeNotes");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const Enumere_Message_1 = require("Enumere_Message");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const ObjetFenetre_MethodeCalculMoyenne_1 = require("ObjetFenetre_MethodeCalculMoyenne");
const ObjetListe_1 = require("ObjetListe");
const TypeContexteBulletin_1 = require("TypeContexteBulletin");
const ObjetRequetePageReleve_1 = require("ObjetRequetePageReleve");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetFenetre_MoyenneTableauResultats_1 = require("ObjetFenetre_MoyenneTableauResultats");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Enumere_Espace_1 = require("Enumere_Espace");
const AccessApp_1 = require("AccessApp");
class _InterfaceReleveDeNotes extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.avecGestionAccuseReception =
			[Enumere_Espace_1.EGenreEspace.Parent].includes(
				this.etatUtilScoEspace.GenreEspace,
			) &&
			this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.fonctionnalites.gestionARBulletins,
			);
		this.param = {
			avecSaisie: false,
			avecInfosEleve: false,
			avecCorrige: false,
		};
		this.aCopier = {};
	}
	initParams(aParam) {
		this.param = $.extend(
			{ avecSaisie: false, avecInfosEleve: false, avecCorrige: false },
			aParam,
		);
	}
	instancierAssistantSaisie() {}
	instancierFenetreVisuEleveQCM() {
		return undefined;
	}
	instancierBulletin() {
		return this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListe,
			this.initialiserBulletin,
		);
	}
	instancierFenetreCalculMoy(aEstRegroupement) {
		if (aEstRegroupement) {
			return this.add(
				ObjetFenetre_MoyenneTableauResultats_1.ObjetFenetre_MoyenneTableauResultats,
				null,
				this._initialiserMethodeCalculMoyenne,
			);
		} else {
			return this.add(
				ObjetFenetre_MethodeCalculMoyenne_1.ObjetFenetre_MethodeCalculMoyenne,
				null,
				this._initialiserMethodeCalculMoyenne,
			);
		}
	}
	getPeriode() {
		return this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
		);
	}
	setPeriode(aElementPeriode) {
		this.etatUtilScoEspace.Navigation.setRessource(
			Enumere_Ressource_1.EGenreRessource.Periode,
			aElementPeriode,
		);
	}
	construireInstances() {
		this.identTripleCombo = this.instancierCombos();
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.identListe = this.instancierBulletin();
		this.identPiedPage = this.instancierPiedBulletin();
		if (this.param.avecSaisie) {
			this.instancierAssistantSaisie();
		}
		if (this.param.avecInfosEleve) {
			this.construireFicheEleveEtFichePhoto();
		}
		this.identFenetreMethodeCalculMoyenne = this.instancierFenetreCalculMoy();
		this.identFenetreMethodeCalculRegroupement =
			this.instancierFenetreCalculMoy(true);
		if (this.param.avecCorrige) {
			this.identFenetreVisuQCM = this.instancierFenetreVisuEleveQCM();
		}
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div style="height:100%" >');
		H.push(
			'<div class="Espace" id="',
			this.getInstance(this.identListe).getNom(),
			'"></div>',
		);
		H.push(
			'<div class="Espace AlignementBas" id="',
			this.getNomInstance(this.identPiedPage),
			'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	envoyerRequeteBulletin(aParam) {
		new ObjetRequetePageReleve_1.ObjetRequetePageReleve(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(aParam);
	}
	evenementAfficherMessage(aGenreMessage) {
		this._masquerVisibilitePiedPage(true);
		this._evenementAfficherMessage(aGenreMessage);
	}
	actionSurRecupererDonnees(aParam) {
		if (aParam.Message) {
			this.evenementAfficherMessage(aParam.Message);
			this.getInstance(this.identListe).IdPremierElement =
				this.idMessageActionRequise;
			this._masquerVisibilitePiedPage(true);
			this.desactiverImpression();
		} else {
			this._masquerVisibilitePiedPage(false);
			$.extend(this, aParam.aCopier);
			$.extend(this.aCopier, aParam.aCopier);
			this.donneesAbsences = aParam.absences;
			this.listeAccusesReception = aParam.listeAccusesReception;
			this.afficherInterfaceGraphique();
			if (
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				this._activerImpression();
			}
			this.afficherBandeau(true);
		}
	}
	afficherInterfaceGraphique() {
		if (this.aCopier.ExisteDevoir) {
			this._afficherBulletin();
			this._afficherPiedPage();
		} else {
			this.evenementAfficherMessage(
				this.aCopier.ExisteService
					? Enumere_Message_1.EGenreMessage.PasDeNotes
					: Enumere_Message_1.EGenreMessage.AucunService,
			);
			this.desactiverImpression();
		}
		this.surResizeInterface();
	}
	desactiverImpression() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
	}
	getParametresPDF() {
		const lResult = {
			genreGenerationPDF:
				TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.ReleveDeNotes,
			eleve: this.getEleve(),
			periode: this.getPeriode(),
			avecCodeCompetences: this.etatUtilScoEspace.estAvecCodeCompetences(),
		};
		return lResult;
	}
	_initPiedPage(aInstance) {
		const lContexte = {
			classe: this.getClasseGroupe(),
			periode: this.getPeriode(),
			eleve: this.getEleve(),
			service: null,
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
		};
		this.moteurPdB.initPiedPage(aInstance, {
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
			typeContexteBulletin:
				TypeContexteBulletin_1.TypeContexteBulletin.CB_Eleve,
			avecSaisie: this.param.avecSaisie,
			avecValidationAuto: true,
			clbckValidationAutoSurEdition: this._clbckValidationAutoSurEdition.bind(
				this,
				lContexte,
			),
		});
		aInstance.initialiser();
	}
	ouvrirAssistantSaisie(aParams) {}
	_evenementSurListe(aParams) {
		let lArticle;
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Edition:
				lArticle = aParams.article;
				if (lArticle.Cloture) {
					this.appScoEspace
						.getMessage()
						.afficher({
							type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
							titre:
								ObjetTraduction_1.GTraductions.getValeur("SaisieImpossible"),
							message:
								ObjetTraduction_1.GTraductions.getValeur("PeriodeCloturee"),
						});
					return;
				}
				switch (aParams.idColonne) {
					case DonneesListe_ReleveDeNotes_1.DonneesListe_ReleveDeNotes.colonnes
						.appreciation:
						this.ouvrirAssistantSaisie(aParams);
						break;
				}
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.ApresEdition: {
				lArticle = aParams.article;
				const lData = this.moteur.getApprDeService({
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
					article: lArticle,
				});
				const lService = lData.service;
				const lAppr = lData.appreciation;
				this.saisieAppreciation(
					{
						instanceListe: this.getInstance(this.identListe),
						estCtxPied: false,
					},
					{
						classe: this.getClasseGroupe(),
						periode: this.getPeriode(),
						eleve: this.getEleve(),
						service: lService,
						appreciation: lAppr,
						typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
							estCtxPied: false,
							eleve: this.getEleve(),
							typeReleveBulletin:
								TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
						}),
					},
				);
				break;
			}
		}
	}
	saisieAppreciation(aParam, aParamRequete) {
		const lParam = {
			instanceListe: aParam.instanceListe,
			paramRequete: aParamRequete,
			paramCellSuivante: { orientationVerticale: true },
			clbckEchec: () => {
				this.actualiserPage();
			},
			clbckSucces: null,
		};
		if (aParam.estCtxPied) {
			$.extend(lParam, {
				clbckSucces: (aParamSucces) => {
					this.moteurPdB.majAppreciationPdB(
						$.extend(aParamSucces, { instanceListe: lParam.instanceListe }),
					);
				},
			});
		} else {
			$.extend(lParam, {
				clbckSucces: (aParamSucces) => {
					const lService = this._getServiceParNumero(
						aParamSucces.numeroService,
					);
					this.moteur.majAppreciationService(
						$.extend(aParamSucces, { service: lService }),
					);
				},
			});
			const lPeriode = lParam.paramRequete.periode;
			if (lPeriode !== null && lPeriode !== undefined) {
				const lNumeroPeriode = lPeriode.getNumero();
				if (lNumeroPeriode === null || lNumeroPeriode === undefined) {
					lParam.paramRequete.periode.setNumero(0);
				}
			}
		}
		this.moteur.saisieAppreciation(lParam);
	}
	fermerFenetreCalculMoy() {
		const lFenetreMoyenne = this.getInstance(
			this.identFenetreMethodeCalculMoyenne,
		);
		if (
			lFenetreMoyenne !== null &&
			lFenetreMoyenne !== undefined &&
			lFenetreMoyenne.estAffiche
		) {
			lFenetreMoyenne.fermer();
		}
		const lFenetreRegroupement = this.getInstance(
			this.identFenetreMethodeCalculRegroupement,
		);
		if (
			lFenetreRegroupement !== null &&
			lFenetreRegroupement !== undefined &&
			lFenetreRegroupement.estAffiche
		) {
			lFenetreRegroupement.fermer();
		}
	}
	_initialiserMethodeCalculMoyenne(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"BulletinEtReleve.TitreFenetreCalculMoyenne",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			largeurMin: 600,
			hauteurMin: 150,
		});
	}
	_evenementSurListeMethodeCalculMoyenne(aParamEvnt) {
		if (aParamEvnt.service.MethodeCalcul) {
			if (this.identFenetreMethodeCalculRegroupement) {
				this.getInstance(this.identFenetreMethodeCalculRegroupement).setDonnees(
					this.getParametresCalcul(aParamEvnt),
				);
			}
		} else {
			if (this.identFenetreMethodeCalculMoyenne) {
				this.getInstance(this.identFenetreMethodeCalculMoyenne).setDonnees(
					this.getParametresCalcul(aParamEvnt),
				);
			}
		}
	}
	getParametresCalcul(aParamEvnt) {
		const lPeriode = aParamEvnt.periode
			? aParamEvnt.periode
			: this.getPeriode();
		let lMethodeCalcul;
		if (
			aParamEvnt.periode &&
			aParamEvnt.service.ListeMoyennesPeriodes &&
			aParamEvnt.service.ListeMoyennesPeriodes.getElementParNumero(
				aParamEvnt.periode.getNumero(),
			) &&
			aParamEvnt.service.ListeMoyennesPeriodes.getElementParNumero(
				aParamEvnt.periode.getNumero(),
			).MethodeCalcul
		) {
			lMethodeCalcul =
				aParamEvnt.service.ListeMoyennesPeriodes.getElementParNumero(
					aParamEvnt.periode.getNumero(),
				).MethodeCalcul;
			return {
				html: lMethodeCalcul.FormuleHTML,
				legende: lMethodeCalcul.FormuleLegende,
				wai: lMethodeCalcul.FormuleWAI,
				titreFenetre: lMethodeCalcul.chaineTitre,
				moyenneNette: true,
			};
		} else if (aParamEvnt.service.MethodeCalcul) {
			lMethodeCalcul = aParamEvnt.service.MethodeCalcul;
			return {
				html: lMethodeCalcul.FormuleHTML,
				legende: lMethodeCalcul.FormuleLegende,
				wai: lMethodeCalcul.FormuleWAI,
				titreFenetre: lMethodeCalcul.chaineTitre,
				moyenneNette: true,
			};
		} else {
			return {
				libelleEleve: null,
				numeroEleve: null,
				libelleClasse: null,
				numeroClasse: null,
				libelleServiceNotation: aParamEvnt.service.getLibelle(),
				numeroServiceNotation: aParamEvnt.service.getNumero(),
				numeroPeriodeNotation: lPeriode.getNumero(),
				genreChoixNotation: lPeriode.getGenre(),
				moyenneTrimestrielle: aParamEvnt.moyenneTrimestrielle,
				pourMoyenneNette: true,
				ordreChronologique: false,
			};
		}
	}
	_getDevoir(aParams) {
		for (
			let lNumDevoir = 0;
			lNumDevoir < aParams.article.ListeDevoirs.count();
			lNumDevoir++
		) {
			if (
				aParams.idColonne ===
				DonneesListe_ReleveDeNotes_1.DonneesListe_ReleveDeNotes.colonnes
					.devoir +
					lNumDevoir
			) {
				return aParams.article.ListeDevoirs.get(lNumDevoir);
			}
		}
		return null;
	}
	_evenementSurListeExecutionQCM(aExecutionQCM) {
		if (aExecutionQCM && this.getInstance(this.identFenetreVisuQCM)) {
			this.getInstance(this.identFenetreVisuQCM).setParametres(
				aExecutionQCM.getNumero(),
			);
			this.getInstance(this.identFenetreVisuQCM).setDonnees(aExecutionQCM);
		}
	}
	_activerImpression() {
		const lGenreImpression = this.moteur.getGenreImpression({
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
		});
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			lGenreImpression,
			this,
			lGenreImpression ===
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF
				? this.getParametresPDF.bind(this)
				: null,
		);
	}
	_afficherPiedPage() {
		if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
			this.getInstance(this.identPiedPage).setDonnees({
				donnees: this.aCopier.PiedDePage,
				absences: this.donneesAbsences,
			});
		}
	}
	_masquerVisibilitePiedPage(aMasquer) {
		if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
			$("#" + this.getNomInstance(this.identPiedPage).escapeJQ()).css(
				"display",
				aMasquer ? "none" : "",
			);
		}
	}
	_actualiserListe() {
		const lAffichage = this.aCopier.Affichage;
		let lParamDonneesListe = {
			instanceListe: this.getInstance(this.identListe),
			moyGenerale: this.aCopier.MoyenneGenerale,
			affichage: lAffichage,
			saisie: this.param.avecSaisie && this.aCopier.ServiceEditable,
			estEnConsultation: !this.param.avecSaisie,
			avecCorrige: this.param.avecCorrige,
			clbckCorrigeQCM: this._evenementSurListeExecutionQCM.bind(this),
			clbckCalculMoy: this._evntCalculMoyenne.bind(this),
		};
		if (this.param.avecSaisie) {
			lParamDonneesListe = $.extend(lParamDonneesListe, {
				tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
					estCtxPied: false,
					eleve: this.getEleve(),
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
				}),
			});
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ReleveDeNotes_1.DonneesListe_ReleveDeNotes(
				this.donneesAcRegroup,
				lParamDonneesListe,
			),
		);
	}
	_afficherBulletin() {
		const lAffichage = this.aCopier.Affichage;
		this.listeElementsLineaire = this.moteur._getListeDonneesLineaire(
			this.aCopier.ListeElements,
			{
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
				affichage: lAffichage,
			},
		);
		this.donneesAcRegroup = this.moteur._formatterDonneesPourRegroupements.call(
			this,
			this.listeElementsLineaire,
			this.aCopier.tableauSurMatieres,
			{
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.ReleveDeNotes,
			},
		);
		this._actualiserListe();
	}
	_evntCalculMoyenne(aParam) {
		this._evenementSurListeMethodeCalculMoyenne(aParam);
	}
	_getServiceParNumero(aNumeroService) {
		const lIndice = this.listeElementsLineaire.getIndiceElementParFiltre(
			(aElt) => {
				if (!aElt.estService) {
					if (aElt.getNumero() !== aNumeroService && aElt.service) {
						return aElt.service.getNumero() === aNumeroService;
					}
				}
				return aElt.getNumero() === aNumeroService;
			},
		);
		if (lIndice > -1) {
			let lService = this.listeElementsLineaire.get(lIndice);
			if (!lService.estService && lService.getNumero() !== aNumeroService) {
				lService = lService.service;
			}
			return lService;
		}
		return null;
	}
	_clbckValidationAutoSurEdition(aCtx, aParam) {
		this.moteurPdB.clbckValidationAutoSurEditionPdB(
			$.extend(aCtx, {
				clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
			}),
			aParam,
		);
	}
}
exports._InterfaceReleveDeNotes = _InterfaceReleveDeNotes;
