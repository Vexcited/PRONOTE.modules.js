exports._InterfaceBulletinNotes = void 0;
const InterfacePage_1 = require("InterfacePage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetMoteurReleveBulletin_1 = require("ObjetMoteurReleveBulletin");
const ObjetMoteurPiedDeBulletin_1 = require("ObjetMoteurPiedDeBulletin");
const TypeReleveBulletin_1 = require("TypeReleveBulletin");
const DonneesListe_BulletinNotes_1 = require("DonneesListe_BulletinNotes");
const ObjetRequetePageBulletins_1 = require("ObjetRequetePageBulletins");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const Invocateur_1 = require("Invocateur");
const ObjetFicheGraphe_1 = require("ObjetFicheGraphe");
const Enumere_Espace_1 = require("Enumere_Espace");
const GUID_1 = require("GUID");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class _InterfaceBulletinNotes extends InterfacePage_1.InterfacePage {
	constructor(aParams) {
		super(aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.moteur = new ObjetMoteurReleveBulletin_1.ObjetMoteurReleveBulletin();
		this.moteurPdB =
			new ObjetMoteurPiedDeBulletin_1.ObjetMoteurPiedDeBulletin();
		this.idBulletin = GUID_1.GUID.getId();
		this.aCopier = {};
		this.param = $.extend(
			{ avecSaisie: false, avecInfosEleve: false, avecDocsATelecharger: false },
			aParams.params,
		);
	}
	instancierBulletin() {
		return;
	}
	instancierPiedBulletin() {
		return;
	}
	instancierDocsATelecharger() {
		return;
	}
	instancierAssistantSaisie() {}
	addSurZoneAssistantSaisie() {}
	addSurZoneFichesEleve() {}
	addSurZoneDatePublicationBulletin() {}
	addSurZoneAccuseReception() {
		return false;
	}
	getListeTypesAppreciations() {}
	getListeAnnotationsPourAvisReligion() {}
	estCtxEleve() {
		const lEleve = this.getEleve();
		return lEleve !== null && lEleve !== undefined && lEleve.existeNumero();
	}
	getEleve() {
		return this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Eleve,
		);
	}
	getClasse() {
		return this.etatUtilScoEspace.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
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
		this.getInstance(this.identListe).setOptionsListe({
			ariaLabel: () => {
				var _a;
				return `${this.etatUtilScoEspace.getLibelleLongOnglet()} ${((_a = this.etatUtilScoEspace.getPeriode()) === null || _a === void 0 ? void 0 : _a.getLibelle()) || ""}`.trim();
			},
		});
		this.identPiedPage = this.instancierPiedBulletin();
		if (this.param.avecGraphe) {
			this.identFicheGraphe = this.add(ObjetFicheGraphe_1.ObjetFicheGraphe);
		}
		if (this.param.avecSaisie) {
			this.instancierAssistantSaisie();
		}
		if (this.param.avecInfosEleve) {
			this.construireFicheEleveEtFichePhoto();
		}
		if (this.param.avecDocsATelecharger) {
			this.identDocumentsATelecharger = this.instancierDocsATelecharger();
		}
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push('<div style="height:100%">');
		H.push('<div style="height:100%" id="', this.idBulletin, '">');
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
		if (this.param.avecDocsATelecharger) {
			if (this.getInstance(this.identDocumentsATelecharger)) {
				H.push(
					'<div class="Espace" id="' +
						this.getInstance(this.identDocumentsATelecharger).getNom() +
						'" style="display:none; height:100%;width: 70rem;"></div>',
				);
			}
		}
		H.push("</div>");
		return H.join("");
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [this.identTripleCombo];
		this.addSurZoneDatePublicationBulletin();
		const lAvecAR = this.addSurZoneAccuseReception();
		if (this.param.avecGraphe) {
			if (!lAvecAR) {
				this.AddSurZone.push({ separateur: true });
			}
			this.AddSurZone.push({ html: this.getHtmlBoutonBandeauGraphe() });
		}
		if (this.param.avecSaisie) {
			this.addSurZoneAssistantSaisie();
		}
		if (this.param.avecInfosEleve) {
			this.addSurZoneFichesEleve();
		}
	}
	evenementAfficherMessage(aGenreMessage) {
		$("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
			"display",
			"none",
		);
		this._evenementAfficherMessage(aGenreMessage);
	}
	envoyerRequeteBulletin(aParam) {
		new ObjetRequetePageBulletins_1.ObjetRequetePageBulletins(
			this,
			this.actionSurRecupererDonnees.bind(this),
		).lancerRequete(aParam);
	}
	actionSurRecupererDonnees(aParam) {
		this.setGraphe(null);
		if (aParam.Message) {
			this.evenementAfficherMessage(aParam.Message);
			this._masquerVisibilitePiedPage(true);
			this.desactiverImpression();
		} else {
			this._masquerVisibilitePiedPage(false);
			Object.assign(this.aCopier, aParam.aCopier);
			$.extend(this, aParam.aCopier);
			this.donneesAbsences = aParam.absences;
			if (this.param.avecSaisie) {
				this.getListeAnnotationsPourAvisReligion();
			}
			this._afficherBulletin();
			this._afficherPiedPage();
			if (
				this.appScoEspace.droits.get(
					ObjetDroitsPN_1.TypeDroits.autoriserImpressionBulletinReleveBrevet,
				)
			) {
				this._activerImpression();
			}
		}
		if (this.param.avecGraphe && !!this.identFicheGraphe) {
			this.getInstance(this.identFicheGraphe).fermer();
		}
		if (!aParam.Message) {
			this.afficherBandeau(true);
			if (aParam.aCopier.graph) {
				this.setGraphe({
					image: [aParam.aCopier.graph],
					titre: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.titreGraphe",
					),
					message: ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.pasDAffichageGraphe",
					),
					alt: this._construireAltGraph(),
				});
			}
			this.surResizeInterface();
		}
	}
	desactiverImpression() {
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			Enumere_GenreImpression_1.EGenreImpression.Aucune,
		);
	}
	initPiedPage(aParam) {
		const lInstancePdP = this.getInstance(this.identPiedPage);
		const lParam = {
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
			typeContexteBulletin: aParam.typeContexteBulletin,
			avecSaisie: this.param.avecSaisie,
		};
		if (this.param.avecSaisie) {
			const lContexte = {
				classe: this.getClasse(),
				periode: this.getPeriode(),
				eleve: this.getEleve(),
				service: null,
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
			};
			$.extend(lParam, {
				avecValidationAuto: true,
				clbckValidationAutoSurEdition: this._clbckValidationAutoSurEdition.bind(
					this,
					lContexte,
				),
			});
		}
		this.moteurPdB.initPiedPage(lInstancePdP, lParam);
		lInstancePdP.initialiser(true);
	}
	_activerImpression() {
		const lGenreImpression = this.moteur.getGenreImpression({
			typeReleveBulletin: TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
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
	getParametresPDF() {
		const lParam = {
			genreGenerationPDF: this.moteur.getGenreGenerationPdf({
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
			}),
			periode: this.getPeriode(),
			avecCodeCompetences: this.etatUtilScoEspace.estAvecCodeCompetences(),
		};
		if (this.param.avecSaisie) {
			$.extend(lParam, { classe: this.getClasse(), eleve: this.getEleve() });
		}
		return lParam;
	}
	saisieAppreciation(aParamss, aParamRequete) {}
	_clbckValidationAutoSurEdition(aCtx, aParam) {
		this.moteurPdB.clbckValidationAutoSurEditionPdB(
			$.extend(aCtx, {
				clbckSaisieAppreciation: this.saisieAppreciation.bind(this),
			}),
			aParam,
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
			$("#" + this.getInstance(this.identPiedPage).getNom().escapeJQ()).css(
				"display",
				aMasquer ? "none" : "",
			);
		}
	}
	_afficherBulletin() {
		const lExisteEleve = this.estCtxEleve();
		this.listeElementsLineaire = this.moteur._getListeDonneesLineaire(
			this.aCopier.ListeElements,
			{
				typeReleveBulletin:
					TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
			},
		);
		const lDonneesAcRegroup =
			this.moteur._formatterDonneesPourRegroupements.call(
				this,
				this.listeElementsLineaire,
				this.aCopier.tableauSurMatieres,
				{
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
				},
			);
		let lParamDonneesListe = {
			instanceListe: this.getInstance(this.identListe),
			estCtxClasse: !lExisteEleve,
			affichage: this.aCopier.Affichage,
			estEnConsultation: !this.param.avecSaisie,
			saisie: this.param.avecSaisie && this.aCopier.ServiceEditable,
			periode: this.etatUtilScoEspace.getPeriode(),
			total: this.aCopier.MoyenneGenerale,
		};
		if (this.param.avecSaisie) {
			lParamDonneesListe = $.extend(lParamDonneesListe, {
				baremeNotationNiveau:
					this.aCopier.baremeNotationNiveau !== null &&
					this.aCopier.baremeNotationNiveau !== undefined
						? this.aCopier.baremeNotationNiveau
						: GParametres.baremeNotation,
				avecCrayonEltPgm:
					this.etatUtilScoEspace.GenreEspace ===
						Enumere_Espace_1.EGenreEspace.Professeur && lExisteEleve,
				tailleMaxAppreciation: this.moteur.getTailleMaxAppreciation({
					estCtxPied: false,
					eleve: this.getEleve(),
					typeReleveBulletin:
						TypeReleveBulletin_1.TypeReleveBulletin.BulletinNotes,
				}),
			});
		}
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_BulletinNotes_1.DonneesListe_BulletinNotes(
				lDonneesAcRegroup,
				lParamDonneesListe,
			),
		);
	}
	_construireAltGraph() {
		const H = [];
		if (this.aCopier.ListeElements && this.aCopier.ListeElements.count()) {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"BulletinEtReleve.BaremeClasse",
					[this.moteur.getStrNote(this.aCopier.baremeParDefaut)],
				),
			);
			this.aCopier.ListeElements.parcourir((aService) => {
				if (
					aService.MoyenneClasse &&
					aService.MoyenneClasse.estUneValeur() &&
					aService.MoyenneEleve &&
					aService.MoyenneEleve.estUneValeur()
				) {
					H.push(
						`${aService.getLibelle()} : ${ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyEleve")} ${this.moteur.getStrNote(aService.MoyenneEleve)} ${ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.MoyenneClasse")} ${this.moteur.getStrNote(aService.MoyenneClasse)}`,
					);
				}
			});
		}
		return H.join(". ");
	}
}
exports._InterfaceBulletinNotes = _InterfaceBulletinNotes;
