exports.InterfacePageRecapCahierDeTexte = void 0;
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const Invocateur_1 = require("Invocateur");
const ObjetHtml_1 = require("ObjetHtml");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetFenetreVisuEleveQCM_1 = require("ObjetFenetreVisuEleveQCM");
const ObjetCalendrier_1 = require("ObjetCalendrier");
const ObjetDate_1 = require("ObjetDate");
const ObjetMenuContextuel_1 = require("ObjetMenuContextuel");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_AffichageCahierDeTextes_1 = require("Enumere_AffichageCahierDeTextes");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePageAvecMenusDeroulants_1 = require("InterfacePageAvecMenusDeroulants");
const EGenreTriCDT_1 = require("EGenreTriCDT");
const UtilitaireInitCalendrier_1 = require("UtilitaireInitCalendrier");
const ObjetRequetePageCahierDeTexte_1 = require("ObjetRequetePageCahierDeTexte");
const InterfacePage_1 = require("InterfacePage");
const PageCahierDeTexte_1 = require("PageCahierDeTexte");
const MultiPageCahierDeTexte_Inspecteur = require("PageCahierDeTexte_Inspecteur");
const ObjetFenetre_ChoixDossierCopieCDT_1 = require("ObjetFenetre_ChoixDossierCopieCDT");
const AccessApp_1 = require("AccessApp");
class InterfacePageRecapCahierDeTexte extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.etatUtilScoEspace = this.appScoEspace.getEtatUtilisateur();
		this.ModeAffichage =
			Enumere_AffichageCahierDeTextes_1.EGenreAffichageCahierDeTextes.ContenuDeCours;
		this.TypeTri = EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe;
		this._donneesMenusDeroulantsRecues = false;
		this.donnees = { libelleBandeau: "" };
	}
	construireInstances() {
		super.construireInstances();
		const lAcces = this.etatUtilScoEspace.getAcces();
		if (lAcces.autoriseSurDate) {
			this.identTripleCombo = this.add(
				InterfacePageAvecMenusDeroulants_1.ObjetAffichagePageAvecMenusDeroulants,
				this._evenementSurDernierMenuDeroulant,
				(aObjet) => {
					aObjet.setParametres(
						[
							Enumere_Ressource_1.EGenreRessource.Classe,
							Enumere_Ressource_1.EGenreRessource.Matiere,
						],
						false,
					);
				},
			);
		}
		if (
			this.identTripleCombo !== null &&
			this.identTripleCombo !== undefined &&
			this.getInstance(this.identTripleCombo) !== null
		) {
			this.IdPremierElement = this.getInstance(
				this.identTripleCombo,
			).getPremierElement();
		}
		this.IdentCalendrier = this.add(
			ObjetCalendrier_1.ObjetCalendrier,
			this.evenementSurCalendrier,
			(aObjet) => {
				UtilitaireInitCalendrier_1.UtilitaireInitCalendrier.init(aObjet, {
					avecMultiSelection: true,
				});
			},
		);
		this.IdentCahierDeTexte = this.add(
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Academie
				? MultiPageCahierDeTexte_Inspecteur === null ||
					MultiPageCahierDeTexte_Inspecteur === void 0
					? void 0
					: MultiPageCahierDeTexte_Inspecteur.PageCahierDeTexte_Inspecteur
				: PageCahierDeTexte_1.PageCahierDeTexte,
			this._evenementSurCahierDeTexte,
			(aObjet) => {
				aObjet.setParametres(true, true);
			},
		);
		this.identFenetreVisuQCM = this.addFenetre(
			ObjetFenetreVisuEleveQCM_1.ObjetFenetreVisuEleveQCM,
		);
		this.identFenetreChoixDossierCopieCDT = this.addFenetre(
			ObjetFenetre_ChoixDossierCopieCDT_1.ObjetFenetre_ChoixDossierCopieCDT,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.IdentCahierDeTexte;
		this.AvecCadre = this.etatUtilScoEspace.getAcces().autoriseSurDate;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({
			html: IE.jsx.str("span", {
				class: "Gras",
				"ie-html": () => this.donnees.libelleBandeau,
			}),
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			false,
		);
		this._evenementAfficherMessage(aGenreMessage);
	}
	evenementSurCalendrier(
		aSelection,
		aDomaine,
		aBidon,
		aEstDansPeriodeConsultation,
		aIsToucheSelection,
	) {
		if (aIsToucheSelection) {
			this.getInstance(this.IdentCahierDeTexte).focusSurPremierElement();
		} else {
			this.etatUtilScoEspace.setDomaineSelectionne(aDomaine);
			this.actualiserPage();
		}
	}
	actualiserPage() {
		const lParamsRequete = {
			domaine: this.etatUtilScoEspace.getDomaineSelectionne(),
			ressource: this.etatUtilScoEspace.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Classe,
			),
		};
		new ObjetRequetePageCahierDeTexte_1.ObjetRequetePageCahierDeTexte(
			this,
			this.actionSurEvenementSurCalendrier,
		).lancerRequete(lParamsRequete);
	}
	actionSurEvenementSurCalendrier(aParametres) {
		this.ListeTravailAFaire = aParametres.listeTAF;
		this.ListeCahierDeTextes = aParametres.listeCDT;
		this.listeDS = aParametres.listeDS;
		if (this.getInstance(this.IdentCalendrier)) {
			this.getInstance(this.IdentCalendrier).setFrequences(
				this.appScoEspace.getObjetParametres().frequences,
				true,
			);
		}
		this.getInstance(this.IdentCahierDeTexte).setDonnees(
			this.ListeTravailAFaire,
			this.ListeCahierDeTextes,
		);
		const lTypeTri = !this.etatUtilScoEspace.Navigation.getNumeroRessource(
			Enumere_Ressource_1.EGenreRessource.Matiere,
		)
			? EGenreTriCDT_1.EGenreTriCDT.ParDatePourLe
			: EGenreTriCDT_1.EGenreTriCDT.ParMatiere;
		this.actualiser(lTypeTri);
	}
	recupererDonnees() {
		super.recupererDonnees();
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			this._donneesMenusDeroulantsRecues,
		);
		this._donneesMenusDeroulantsRecues = false;
		const lAcces = this.etatUtilScoEspace.getAcces();
		if (!lAcces.autorise) {
			ObjetHtml_1.GHtml.setHtml(
				this.getNomInstance(this.IdentZoneAlClient),
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.CDTNonConsultable",
					),
				),
			);
		} else if (!lAcces.autoriseSurDate) {
			ObjetHtml_1.GHtml.setHtml(
				this.getNomInstance(this.IdentZoneAlClient),
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.CDTconsultableDuAu",
						[
							ObjetDate_1.GDate.formatDate(lAcces.dateDebut, "%JJ/%MM/%AA"),
							ObjetDate_1.GDate.formatDate(lAcces.dateFin, "%JJ/%MM/%AA"),
						],
					),
				),
			);
		} else if (lAcces.dateDebut && lAcces.dateFin) {
			this.afficherBandeau(false);
			this.donnees.libelleBandeau =
				"(" +
				ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.consultableDuAu",
					[
						ObjetDate_1.GDate.formatDate(lAcces.dateDebut, "%JJ/%MM/%AA"),
						ObjetDate_1.GDate.formatDate(lAcces.dateFin, "%JJ/%MM/%AA"),
					],
				) +
				")";
		}
	}
	actualiser(aTypeTri) {
		if (aTypeTri !== null && aTypeTri !== undefined) {
			this.TypeTri = aTypeTri;
		}
		if (!this._existePourMatiere()) {
			this.getInstance(this.IdentCahierDeTexte).afficher(
				this.composeMessage(
					[
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.AucunTAFSaisi",
						),
						ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.AucunContenuSaisi",
						),
					][this.ModeAffichage],
				),
			);
			ObjetHtml_1.GHtml.setTabIndex(this.getZoneId(this.IdentCahierDeTexte), 0);
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
		} else {
			ObjetHtml_1.GHtml.setTabIndex(
				this.getZoneId(this.IdentCahierDeTexte),
				-1,
			);
			const lCallback = this.appScoEspace.droits.get(
				ObjetDroitsPN_1.TypeDroits.cahierDeTexte.avecSaisieCahierDeTexte,
			)
				? this._surContextMenuCDT.bind(this)
				: null;
			this.getInstance(this.IdentCahierDeTexte).setOptionsCDT({
				callbackContextMenuCDT: lCallback,
			});
			this.getInstance(this.IdentCahierDeTexte).actualiser(
				this.ModeAffichage,
				this.TypeTri,
				this.etatUtilScoEspace.Navigation.getNumeroRessource(
					Enumere_Ressource_1.EGenreRessource.Matiere,
				),
			);
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Normale,
				this,
			);
		}
	}
	getPageImpression() {
		return {
			titre1: "",
			contenu: this.getInstance(this.IdentCahierDeTexte).composePage(true),
		};
	}
	_evenementSurDernierMenuDeroulant() {
		this._donneesMenusDeroulantsRecues = true;
		this.afficherBandeau(true);
		ObjetHtml_1.GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			true,
		);
		this.getInstance(this.IdentCalendrier).setDomaine(
			this.etatUtilScoEspace.getDomaineSelectionne(),
		);
		this.surResizeInterface();
	}
	_surContextMenuCDT(event, aCDT) {
		ObjetMenuContextuel_1.ObjetMenuContextuel.afficher({
			pere: this,
			evenement: () => {
				this.getInstance(
					this.identFenetreChoixDossierCopieCDT,
				).afficherChoixDossierCopieCDT(null, aCDT);
			},
			initCommandes: function (aInstance) {
				aInstance.addCommande(
					0,
					ObjetTraduction_1.GTraductions.getValeur(
						"CahierDeTexte.AjouterElementsCDT",
					),
				);
			},
		});
	}
	_existePourMatiere() {
		const lNumeroMatiere = this.etatUtilScoEspace.Navigation.getNumeroRessource(
			Enumere_Ressource_1.EGenreRessource.Matiere,
		);
		const lListe = this.ListeCahierDeTextes;
		for (let I = 0; lListe && I < lListe.count(); I++) {
			if (!lNumeroMatiere || lNumeroMatiere === lListe.get(I).Matiere.Numero) {
				return true;
			}
		}
		return false;
	}
	_evenementSurCahierDeTexte(aParam) {
		if (
			this.etatUtilScoEspace.GenreEspace ===
				Enumere_Espace_1.EGenreEspace.Academie &&
			aParam &&
			aParam.actualiser
		) {
			this.actualiserPage();
			return;
		}
		if (aParam && aParam.executionQCM) {
			this.getInstance(this.identFenetreVisuQCM).setParametres(
				aParam.executionQCM.getNumero(),
				true,
			);
			this.getInstance(this.identFenetreVisuQCM).setDonnees(
				aParam.executionQCM,
			);
		}
	}
}
exports.InterfacePageRecapCahierDeTexte = InterfacePageRecapCahierDeTexte;
