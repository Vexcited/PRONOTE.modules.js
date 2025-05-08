const { GTraductions } = require("ObjetTraduction.js");
const { InterfacePage } = require("InterfacePage.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { DonneesListe_ReleveDeNotes } = require("DonneesListe_ReleveDeNotes.js");
const { ObjetMoteurReleveBulletin } = require("ObjetMoteurReleveBulletin.js");
const { TypeReleveBulletin } = require("TypeReleveBulletin.js");
const { EGenreMessage } = require("Enumere_Message.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetMoteurPiedDeBulletin } = require("ObjetMoteurPiedDeBulletin.js");
const {
	ObjetFenetre_MethodeCalculMoyenne,
} = require("ObjetFenetre_MethodeCalculMoyenne.js");
const { ObjetListe } = require("ObjetListe.js");
const { TypeContexteBulletin } = require("TypeContexteBulletin.js");
const { ObjetRequetePageReleve } = require("ObjetRequetePageReleve.js");
const { TypeHttpGenerationPDFSco } = require("TypeHttpGenerationPDFSco.js");
const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GHtml } = require("ObjetHtml.js");
const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetListeArborescente } = require("ObjetListeArborescente.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const {
	ObjetFenetre_MoyenneTableauResultats,
} = require("ObjetFenetre_MoyenneTableauResultats.js");
const { TypeDroits } = require("ObjetDroitsPN.js");
const { EGenreEspace } = require("Enumere_Espace.js");
class _InterfaceReleveDeNotes extends InterfacePage {
	constructor(aNom, aIdent, aPere, aEvenement, aParam) {
		super(aNom, aIdent, aPere, aEvenement);
		this.param = $.extend(
			{ avecSaisie: false, avecInfosEleve: false, avecCorrige: false },
			aParam,
		);
		this.moteur = new ObjetMoteurReleveBulletin();
		this.moteurPdB = new ObjetMoteurPiedDeBulletin();
		this.avecGestionAccuseReception =
			[EGenreEspace.Parent].includes(GEtatUtilisateur.GenreEspace) &&
			GApplication.droits.get(TypeDroits.fonctionnalites.gestionARBulletins);
	}
	instancierCombos() {}
	instancierPiedBulletin() {}
	instancierAssistantSaisie() {}
	instancierFenetreVisuEleveQCM() {}
	instancierBulletin() {
		return this.add(ObjetListe, this._evenementSurListe);
	}
	instancierFenetreCalculMoy(aEstRegroupement) {
		if (aEstRegroupement) {
			return this.add(
				ObjetFenetre_MoyenneTableauResultats,
				null,
				this._initialiserMethodeCalculMoyenne,
			);
		} else {
			return this.add(
				ObjetFenetre_MethodeCalculMoyenne,
				null,
				this._initialiserMethodeCalculMoyenne,
			);
		}
	}
	getEleve() {}
	getClasse() {}
	getPeriode() {
		return GEtatUtilisateur.Navigation.getRessource(EGenreRessource.Periode);
	}
	setPeriode(aElementPeriode) {
		GEtatUtilisateur.Navigation.setRessource(
			EGenreRessource.Periode,
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
			this.getInstance(this.identPiedPage).getNom(),
			'"></div>',
		);
		H.push("</div>");
		return H.join("");
	}
	envoyerRequeteBulletin(aParam) {
		new ObjetRequetePageReleve(
			this,
			this.actionSurRecupererDonnees,
		).lancerRequete(aParam);
	}
	evenementAfficherMessage(aGenreMessage) {
		_masquerVisibilitePiedPage.call(this, true);
		this._evenementAfficherMessage(aGenreMessage);
	}
	actionSurRecupererDonnees(aParam) {
		if (aParam.Message) {
			this.evenementAfficherMessage(aParam.Message);
			this.getInstance(this.identListe).IdPremierElement =
				this.idMessageActionRequise;
			_masquerVisibilitePiedPage.call(this, true);
			this.desactiverImpression();
		} else {
			_masquerVisibilitePiedPage.call(this, false);
			$.extend(this, aParam.aCopier);
			this.donneesAbsences = aParam.absences;
			this.listeAccusesReception = aParam.listeAccusesReception;
			this.afficherInterfaceGraphique();
			if (
				GApplication.droits.get(
					TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				_activerImpression.call(this);
			}
			this.afficherBandeau(true);
		}
	}
	afficherInterfaceGraphique() {
		if (this.ExisteDevoir) {
			_afficherBulletin.call(this);
			_afficherPiedPage.call(this);
		} else {
			this.evenementAfficherMessage(
				this.ExisteService
					? EGenreMessage.PasDeNotes
					: EGenreMessage.AucunService,
			);
			this.desactiverImpression();
		}
		this.surResizeInterface();
	}
	desactiverImpression() {
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			EGenreImpression.Aucune,
		);
	}
	getParametresPDF() {
		const lResult = {
			genreGenerationPDF: TypeHttpGenerationPDFSco.ReleveDeNotes,
			eleve: this.getEleve(),
			periode: this.getPeriode(),
			avecCodeCompetences: GEtatUtilisateur.estAvecCodeCompetences(),
		};
		return lResult;
	}
	_initPiedPage(aInstance) {
		const lContexte = {
			classe: this.getClasse(),
			periode: this.getPeriode(),
			eleve: this.getEleve(),
			service: null,
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
		};
		this.moteurPdB.initPiedPage(aInstance, {
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			typeContexteBulletin: TypeContexteBulletin.CB_Eleve,
			avecSaisie: this.param.avecSaisie,
			avecValidationAuto: true,
			clbckValidationAutoSurEdition: _clbckValidationAutoSurEdition.bind(
				this,
				lContexte,
			),
		});
		aInstance.initialiser(true);
	}
	ouvrirAssistantSaisie() {}
	_evenementSurListe(aParams) {
		let lArticle;
		switch (aParams.genreEvenement) {
			case EGenreEvenementListe.Edition:
				lArticle = aParams.article;
				if (lArticle.Cloture) {
					GApplication.getMessage().afficher({
						type: EGenreBoiteMessage.Information,
						titre: GTraductions.getValeur("SaisieImpossible"),
						message: GTraductions.getValeur("PeriodeCloturee"),
					});
					return;
				}
				switch (aParams.idColonne) {
					case DonneesListe_ReleveDeNotes.colonnes.appreciation:
						this.ouvrirAssistantSaisie(aParams);
						break;
				}
				break;
			case EGenreEvenementListe.ApresEdition: {
				lArticle = aParams.article;
				const lData = this.moteur.getApprDeService({
					typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
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
						classe: this.getClasse(),
						periode: this.getPeriode(),
						eleve: this.getEleve(),
						service: lService,
						appreciation: lAppr,
						typeGenreAppreciation: this.moteur.getTypeGenreAppreciation({
							estCtxPied: false,
							eleve: this.getEleve(),
							typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
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
			clbckEchec: function () {
				this.actualiserPage();
			}.bind(this),
		};
		if (aParam.estCtxPied) {
			$.extend(lParam, {
				clbckSucces: function (aParamSucces) {
					this.moteurPdB.majAppreciationPdB(
						$.extend(aParamSucces, { instanceListe: lParam.instanceListe }),
					);
				}.bind(this),
			});
		} else {
			$.extend(lParam, {
				clbckSucces: function (aParamSucces) {
					const lService = _getServiceParNumero.call(
						this,
						aParamSucces.numeroService,
					);
					this.moteur.majAppreciationService(
						$.extend(aParamSucces, { service: lService }),
					);
				}.bind(this),
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
			lFenetreMoyenne.EstAffiche
		) {
			lFenetreMoyenne.fermer();
		}
		const lFenetreRegroupement = this.getInstance(
			this.identFenetreMethodeCalculRegroupement,
		);
		if (
			lFenetreRegroupement !== null &&
			lFenetreRegroupement !== undefined &&
			lFenetreRegroupement.EstAffiche
		) {
			lFenetreRegroupement.fermer();
		}
	}
	_initialiserMethodeCalculMoyenne(aInstance) {
		aInstance.setOptionsFenetre({
			modale: false,
			titre: GTraductions.getValeur(
				"BulletinEtReleve.TitreFenetreCalculMoyenne",
			),
			largeur: 600,
			hauteur: 300,
			listeBoutons: [GTraductions.getValeur("principal.fermer")],
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
				titreFenetre: lMethodeCalcul.chaineTitre,
				moyenneNette: true,
			};
		} else if (aParamEvnt.service.MethodeCalcul) {
			lMethodeCalcul = aParamEvnt.service.MethodeCalcul;
			return {
				html: lMethodeCalcul.FormuleHTML,
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
				DonneesListe_ReleveDeNotes.colonnes.devoir + lNumDevoir
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
	afficherListeAccessible(aListe, aParam) {
		const lListeArborescente = new ObjetListeArborescente(
			this.Nom + "_Liste",
			0,
			this,
			null,
		);
		let lRacine = lListeArborescente.construireRacine(),
			lNoeudRegroupement;
		lListeArborescente.setParametres(false);
		const lNoeudMatieres = lListeArborescente.ajouterUnNoeudAuNoeud(
			lRacine,
			"",
			"<strong>" + GTraductions.getValeur("Matieres") + "</strong>",
			null,
			true,
			true,
		);
		for (let i = 0, lNbr = aListe.count(); i < lNbr; i++) {
			const lService = aListe.get(i);
			if (lService.regroupement && lService.estSurMatiere) {
				const lLibelleRegroupement = lService.SurMatiere.getLibelle();
				lNoeudRegroupement = lListeArborescente.ajouterUnNoeudAuNoeud(
					lNoeudMatieres,
					"",
					lLibelleRegroupement,
				);
			}
			const lNoeudPere = lService.regroupement
				? lNoeudRegroupement
				: lNoeudMatieres;
			_construireListeArborescente_Service.call(this, {
				listeArborescente: lListeArborescente,
				service: lService,
				noeud: lNoeudPere,
				affichage: aParam.affichage,
				nbrMaxDevoirs: aParam.nbrMaxDevoirs,
			});
		}
		return { racine: lRacine, listeArborescente: lListeArborescente };
	}
}
function _activerImpression() {
	const lGenreImpression = this.moteur.getGenreImpression({
		typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
	});
	Invocateur.evenement(
		ObjetInvocateur.events.activationImpression,
		lGenreImpression,
		this,
		lGenreImpression === EGenreImpression.GenerationPDF
			? this.getParametresPDF.bind(this)
			: null,
	);
}
function _afficherPiedPage() {
	if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
		const lArbrePied = this.getInstance(this.identPiedPage).setDonnees({
			donnees: this.PiedDePage,
			absences: this.donneesAbsences,
		});
		if (GEtatUtilisateur.estModeAccessible()) {
			GHtml.setHtml(this.getInstance(this.identPiedPage).getNom(), lArbrePied);
		}
	}
}
function _masquerVisibilitePiedPage(aMasquer) {
	if (this.identPiedPage && this.getInstance(this.identPiedPage)) {
		$("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
			"display",
			aMasquer ? "none" : "",
		);
	}
}
function _actualiserListe() {
	const lAffichage = this.Affichage;
	let lParamDonneesListe = {
		instanceListe: this.getInstance(this.identListe),
		moyGenerale: this.MoyenneGenerale,
		affichage: lAffichage,
		saisie: this.param.avecSaisie && this.ServiceEditable,
		estEnConsultation: !this.param.avecSaisie,
		avecCorrige: this.param.avecCorrige,
		clbckCorrigeQCM: this._evenementSurListeExecutionQCM.bind(this),
		clbckCalculMoy: _evntCalculMoyenne.bind(this),
	};
	if (this.param.avecSaisie) {
		lParamDonneesListe = $.extend(lParamDonneesListe, {
			tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
				estCtxPied: false,
				eleve: this.getEleve(),
				typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			}),
		});
	}
	this.getInstance(this.identListe).setDonnees(
		new DonneesListe_ReleveDeNotes(this.donneesAcRegroup, lParamDonneesListe),
	);
}
function _afficherBulletin() {
	const lAffichage = this.Affichage;
	this.listeElementsLineaire = this.moteur._getListeDonneesLineaire(
		this.ListeElements,
		{
			typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes,
			affichage: lAffichage,
		},
	);
	if (GEtatUtilisateur.estModeAccessible()) {
		const lDataAccessibilite = this.afficherListeAccessible(
			this.listeElementsLineaire,
			{ affichage: lAffichage, nbrMaxDevoirs: this.NbrMaxDevoirs },
		);
		const lListeArborescente = lDataAccessibilite.listeArborescente;
		GHtml.setHtml(
			this.getInstance(this.identListe).getNom(),
			lListeArborescente.construireAffichage(),
		);
		lListeArborescente.setDonnees(lDataAccessibilite.racine);
	} else {
		this.donneesAcRegroup = this.moteur._formatterDonneesPourRegroupements.call(
			this,
			this.listeElementsLineaire,
			this.tableauSurMatieres,
			{ typeReleveBulletin: TypeReleveBulletin.ReleveDeNotes },
		);
		_actualiserListe.call(this);
	}
}
function _evntCalculMoyenne(aParam) {
	this._evenementSurListeMethodeCalculMoyenne(aParam);
}
function _getServiceParNumero(aNumeroService) {
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
function _clbckValidationAutoSurEdition(aCtx, aParam) {
	this.moteurPdB.clbckValidationAutoSurEditionPdB(
		$.extend(aCtx, {
			clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
		}),
		aParam,
	);
}
function _getLibelleService(aService, aCmpDevoirs) {
	const H = [];
	if (aService.Matiere) {
		H.push("<strong>" + aService.Matiere.getLibelle() + "</strong>");
	}
	if (aService.estSurMatiere) {
		H.push("<strong>" + aService.SurMatiere.getLibelle() + "</strong>");
	}
	if (aCmpDevoirs) {
		H.push(
			"&nbsp;[",
			aCmpDevoirs,
			" " +
				(aCmpDevoirs > 1
					? GTraductions.getValeur("BulletinEtReleve.Devoirs")
					: GTraductions.getValeur("BulletinEtReleve.Devoir")),
			"]",
		);
	}
	if (aService && aService.ListeProfesseurs) {
		for (let i = 0, lNbr = aService.ListeProfesseurs.count(); i < lNbr; i++) {
			const lProfesseur = aService.ListeProfesseurs.get(i);
			if (i > 0) {
				H.push(" |");
			} else {
				H.push("<br>");
			}
			H.push(lProfesseur.getLibelle());
		}
	}
	return H.join("");
}
function _getNbrDevoirsAccessible(aService) {
	let lDevoir;
	let lCmpDevoirs = 0;
	for (let i = 0, lNbr = aService.ListeDevoirs.count(); i < lNbr; i++) {
		lDevoir = aService.ListeDevoirs.get(i);
		if (lDevoir && lDevoir.Note) {
			lCmpDevoirs++;
		}
	}
	return lCmpDevoirs;
}
function _ajouterMoyennesAccessible(aParam) {
	const lService = aParam.service;
	const lListeArborecente = aParam.listeArborescente;
	const lAffichage = aParam.affichage;
	if (
		(lAffichage.AvecMoyenneEleve && lService.MoyenneEleve) ||
		(lAffichage.AvecMoyenneAnnuelle && lService.MoyenneAnnuelle) ||
		(lAffichage.AvecMoyenneInfSup &&
			(lService.MoyenneInf || lService.MoyenneSup)) ||
		lAffichage.NombreMoyennesPeriodes
	) {
		const lNoeudMoyennes = lListeArborecente.ajouterUnNoeudAuNoeud(
			aParam.noeud,
			"",
			GTraductions.getValeur("Moyennes"),
			"",
		);
		if (lAffichage.AvecMoyenneEleve) {
			lListeArborecente.ajouterUneFeuilleAuNoeud(
				lNoeudMoyennes,
				"",
				GTraductions.getValeur("Eleve") +
					" : " +
					(lService.MoyenneEleve ? lService.MoyenneEleve : ""),
			);
		}
		if (lAffichage.AvecMoyenneAnnuelle) {
			lListeArborecente.ajouterUneFeuilleAuNoeud(
				lNoeudMoyennes,
				"",
				GTraductions.getValeur("Eleve") +
					" : " +
					(lService.MoyenneAnnuelle ? lService.MoyenneAnnuelle : ""),
			);
		}
		if (lAffichage.AvecMoyenneInfSup) {
			lListeArborecente.ajouterUneFeuilleAuNoeud(
				lNoeudMoyennes,
				"",
				"- : " + (lService.MoyenneInf ? lService.MoyenneInf : ""),
			);
			lListeArborecente.ajouterUneFeuilleAuNoeud(
				lNoeudMoyennes,
				"",
				"+ : " + (lService.MoyenneSup ? lService.MoyenneSup : ""),
			);
		}
		for (let i = 0, lNbr = lAffichage.NombreMoyennesPeriodes; i < lNbr; i++) {
			lListeArborecente.ajouterUneFeuilleAuNoeud(
				lNoeudMoyennes,
				"",
				lAffichage.listePeriodes.getLibelle(i) +
					" : " +
					lService.ListeMoyennesPeriodes[i],
			);
		}
	}
}
function _ajouterDevoirsAccessible(aParam) {
	const lService = aParam.service;
	const lListeArborecente = aParam.listeArborescente;
	const lNoeud = aParam.noeud;
	const lCmpDevoirs = _getNbrDevoirsAccessible.call(this, lService);
	let lNoeudDevoirs;
	if (lCmpDevoirs > 0) {
		lNoeudDevoirs = lListeArborecente.ajouterUnNoeudAuNoeud(
			lNoeud,
			"",
			GTraductions.getValeur("Devoirs"),
			"",
		);
	} else {
		lListeArborecente.ajouterUneFeuilleAuNoeud(
			lNoeud,
			"",
			GTraductions.getValeur("BulletinEtReleve.aucunDevoir"),
			"",
		);
	}
	let lDevoir;
	for (let i = 0, lNbr = aParam.nbrMaxDevoirs; i < lNbr; i++) {
		lDevoir = lService.ListeDevoirs.get(i);
		if (lDevoir && lDevoir.Note) {
			const lLibelleDevoir = [];
			lLibelleDevoir.push(GTraductions.getValeur("BulletinEtReleve.Devoir"));
			if (lDevoir.Date) {
				lLibelleDevoir.push(
					" " + GTraductions.getValeur("Du") + " ",
					GDate.formatDate(lDevoir.Date, "%JJ/%MM/%AAAA"),
				);
			}
			if (lDevoir.Commentaire && lDevoir.Commentaire !== "") {
				lLibelleDevoir.push(" [", lDevoir.Commentaire, "]");
			}
			const lNoeudDateDevoir = lListeArborecente.ajouterUnNoeudAuNoeud(
				lNoeudDevoirs,
				"",
				lLibelleDevoir.join(""),
				"",
			);
			if (lDevoir.Note) {
				lListeArborecente.ajouterUneFeuilleAuNoeud(
					lNoeudDateDevoir,
					"",
					GTraductions.getValeur("ReleveDeNotes.Note") + " : " + lDevoir.Note,
				);
			}
			if (lDevoir.Coefficient) {
				lListeArborecente.ajouterUneFeuilleAuNoeud(
					lNoeudDateDevoir,
					"",
					GTraductions.getValeur("ReleveDeNotes.CoefficientDevoir") +
						" : " +
						lDevoir.Coefficient,
				);
			}
			if (lDevoir.Bareme) {
				lListeArborecente.ajouterUneFeuilleAuNoeud(
					lNoeudDateDevoir,
					"",
					GTraductions.getValeur("ReleveDeNotes.BaremeDevoir") +
						" : " +
						lDevoir.Bareme,
				);
			}
		}
	}
}
function _ajouterAppreciationsAccessible(aParam) {
	const lService = aParam.service;
	const lListeArborecente = aParam.listeArborescente;
	const lNoeud = aParam.noeud;
	const lAffichage = aParam.affichage;
	if (lAffichage.NombreAppreciations) {
		if (lAffichage.AvecAppreciationParSousService) {
			const lLibelleAppreciation = lService.ListeAppreciations.getLibelle(0);
			const lStrLibelleAppreciation =
				lLibelleAppreciation !== ""
					? GTraductions.getValeur("Appreciation") +
						" : " +
						GChaine.avecEspaceSiVide(lLibelleAppreciation)
					: GTraductions.getValeur("ReleveDeNotes.AucuneAppreciation");
			lListeArborecente.ajouterUneFeuilleAuNoeud(
				lNoeud,
				"",
				lStrLibelleAppreciation,
			);
		}
	}
}
function _construireListeArborescente_Service(aParam) {
	const lService = aParam.service;
	const lListeArborescente = aParam.listeArborescente;
	const lCmpDevoirs = _getNbrDevoirsAccessible.call(this, lService);
	const lLibelle = _getLibelleService.call(this, lService, lCmpDevoirs);
	const lNoeudMatiere = lListeArborescente.ajouterUnNoeudAuNoeud(
		aParam.noeud,
		"",
		lLibelle,
	);
	const lParam = {
		listeArborescente: lListeArborescente,
		service: lService,
		noeud: lNoeudMatiere,
		affichage: aParam.affichage,
		nbrMaxDevoirs: aParam.nbrMaxDevoirs,
	};
	_ajouterMoyennesAccessible.call(this, lParam);
	if (!lService.estSurMatiere) {
		_ajouterDevoirsAccessible.call(this, lParam);
		if (!lService.estServicePereAvecSousService) {
			_ajouterAppreciationsAccessible.call(this, lParam);
		}
	}
}
module.exports = { _InterfaceReleveDeNotes };
