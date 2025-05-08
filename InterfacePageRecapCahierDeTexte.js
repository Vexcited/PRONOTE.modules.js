const { TypeDroits } = require("ObjetDroitsPN.js");
const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { GHtml } = require("ObjetHtml.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { ObjetFenetreVisuEleveQCM } = require("ObjetFenetreVisuEleveQCM.js");
const { ObjetCalendrier } = require("ObjetCalendrier.js");
const { GDate } = require("ObjetDate.js");
const { ObjetMenuContextuel } = require("ObjetMenuContextuel.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	EGenreAffichageCahierDeTextes,
} = require("Enumere_AffichageCahierDeTextes.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const {
	ObjetAffichagePageAvecMenusDeroulants,
} = require("InterfacePageAvecMenusDeroulants.js");
const { EGenreTriCDT } = require("EGenreTriCDT.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const {
	ObjetRequetePageCahierDeTexte,
} = require("ObjetRequetePageCahierDeTexte.js");
const { InterfacePage } = require("InterfacePage.js");
const { PageCahierDeTexte } = require("PageCahierDeTexte.js");
const PageCahierDeTexte_Inspecteur = require("PageCahierDeTexte_Inspecteur.js");
const {
	ObjetFenetre_ChoixDossierCopieCDT,
} = require("ObjetFenetre_ChoixDossierCopieCDT.js");
class InterfacePageRecapCahierDeTexte extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.ModeAffichage = EGenreAffichageCahierDeTextes.ContenuDeCours;
		this.TypeTri = EGenreTriCDT.ParDatePourLe;
		this._donneesMenusDeroulantsRecues = false;
		this.donnees = { libelleBandeau: "" };
	}
	construireInstances() {
		super.construireInstances();
		const lAcces = GEtatUtilisateur.getAcces();
		if (lAcces.autoriseSurDate) {
			this.identTripleCombo = this.add(
				ObjetAffichagePageAvecMenusDeroulants,
				_evenementSurDernierMenuDeroulant,
				(aObjet) => {
					aObjet.setParametres(
						[EGenreRessource.Classe, EGenreRessource.Matiere],
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
			ObjetCalendrier,
			this.evenementSurCalendrier,
			(aObjet) => {
				UtilitaireInitCalendrier.init(aObjet, { avecMultiSelection: true });
			},
		);
		this.IdentCahierDeTexte = this.add(
			GEtatUtilisateur.GenreEspace === EGenreEspace.Academie
				? PageCahierDeTexte_Inspecteur
				: PageCahierDeTexte,
			_evenementSurCahierDeTexte,
			(aObjet) => {
				aObjet.setParametres(true, true);
			},
		);
		this.identFenetreVisuQCM = this.addFenetre(ObjetFenetreVisuEleveQCM);
		this.identFenetreChoixDossierCopieCDT = this.addFenetre(
			ObjetFenetre_ChoixDossierCopieCDT,
		);
	}
	setParametresGeneraux() {
		this.avecBandeau = true;
		this.IdentZoneAlClient = this.IdentCahierDeTexte;
		this.AvecCadre = GEtatUtilisateur.getAcces().autoriseSurDate;
		this.AddSurZone = [];
		this.AddSurZone.push(this.identTripleCombo);
		this.AddSurZone.push({
			html: '<span class="Gras" ie-html="getLibelleBandeau"></span>',
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getLibelleBandeau: function () {
				return aInstance.donnees.libelleBandeau;
			},
		});
	}
	evenementAfficherMessage(aGenreMessage) {
		GHtml.setDisplay(this.getInstance(this.IdentCalendrier).getNom(), false);
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
			this.Instances[this.IdentCahierDeTexte].focusSurPremierElement();
		} else {
			GEtatUtilisateur.setDomaineSelectionne(aDomaine);
			this.actualiserPage();
		}
	}
	actualiserPage() {
		const lParamsRequete = {
			domaine: GEtatUtilisateur.getDomaineSelectionne(),
			ressource: GEtatUtilisateur.Navigation.getRessource(
				EGenreRessource.Classe,
			),
		};
		new ObjetRequetePageCahierDeTexte(
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
				GParametres.frequences,
				true,
			);
		}
		this.getInstance(this.IdentCahierDeTexte).setDonnees(
			this.ListeTravailAFaire,
			this.ListeCahierDeTextes,
		);
		const lTypeTri = !GEtatUtilisateur.Navigation.getNumeroRessource(
			EGenreRessource.Matiere,
		)
			? EGenreTriCDT.ParDatePourLe
			: EGenreTriCDT.ParMatiere;
		this.actualiser(lTypeTri);
	}
	recupererDonnees() {
		super.recupererDonnees();
		GHtml.setDisplay(
			this.getInstance(this.IdentCalendrier).getNom(),
			this._donneesMenusDeroulantsRecues,
		);
		this._donneesMenusDeroulantsRecues = false;
		const lAcces = GEtatUtilisateur.getAcces();
		if (!lAcces.autorise) {
			GHtml.setHtml(
				this.getNomInstance(this.IdentZoneAlClient),
				this.composeMessage(
					GTraductions.getValeur("CahierDeTexte.CDTNonConsultable"),
				),
			);
		} else if (!lAcces.autoriseSurDate) {
			GHtml.setHtml(
				this.getNomInstance(this.IdentZoneAlClient),
				this.composeMessage(
					GTraductions.getValeur("CahierDeTexte.CDTconsultableDuAu", [
						GDate.formatDate(lAcces.dateDebut, "%JJ/%MM/%AA"),
						GDate.formatDate(lAcces.dateFin, "%JJ/%MM/%AA"),
					]),
				),
			);
		} else if (lAcces.dateDebut && lAcces.dateFin) {
			this.afficherBandeau(false);
			this.donnees.libelleBandeau =
				"(" +
				GTraductions.getValeur("CahierDeTexte.consultableDuAu", [
					GDate.formatDate(lAcces.dateDebut, "%JJ/%MM/%AA"),
					GDate.formatDate(lAcces.dateFin, "%JJ/%MM/%AA"),
				]) +
				")";
		}
	}
	actualiser(aTypeTri) {
		if (aTypeTri !== null && aTypeTri !== undefined) {
			this.TypeTri = aTypeTri;
		}
		if (!_ExistePourMatiere.call(this)) {
			this.getInstance(this.IdentCahierDeTexte).afficher(
				this.composeMessage(
					[
						GTraductions.getValeur("CahierDeTexte.AucunTAFSaisi"),
						GTraductions.getValeur("CahierDeTexte.AucunContenuSaisi"),
					][this.ModeAffichage],
				),
			);
			GHtml.setTabIndex(this.getZoneId(this.IdentCahierDeTexte), "0");
			Invocateur.evenement(
				ObjetInvocateur.events.activationImpression,
				EGenreImpression.Aucune,
			);
		} else {
			GHtml.setTabIndex(this.getZoneId(this.IdentCahierDeTexte), "-1");
			const lCallback = GApplication.droits.get(
				TypeDroits.cahierDeTexte.avecSaisieCahierDeTexte,
			)
				? _surContextMenuCDT.bind(this)
				: null;
			this.getInstance(this.IdentCahierDeTexte).setOptionsCDT({
				callbackContextMenuCDT: lCallback,
			});
			this.getInstance(this.IdentCahierDeTexte).actualiser(
				this.ModeAffichage,
				this.TypeTri,
				GEtatUtilisateur.Navigation.getNumeroRessource(EGenreRessource.Matiere),
			);
			Invocateur.evenement(
				ObjetInvocateur.events.activationImpression,
				EGenreImpression.Normale,
				this,
			);
		}
	}
	getPageImpression() {
		const lTitre = this.getInstance(this.IdentBandeau)
			? this.getInstance(this.IdentBandeau).Libelle
			: "";
		return {
			titre1: lTitre,
			contenu: this.getInstance(this.IdentCahierDeTexte).composePage(true),
		};
	}
}
function _evenementSurDernierMenuDeroulant() {
	this._donneesMenusDeroulantsRecues = true;
	this.afficherBandeau(true);
	GHtml.setDisplay(this.getInstance(this.IdentCalendrier).getNom(), true);
	this.getInstance(this.IdentCalendrier).setDomaine(
		GEtatUtilisateur.getDomaineSelectionne(),
	);
	this.surResizeInterface();
}
function _surContextMenuCDT(event, aCDT) {
	const lthis = this;
	ObjetMenuContextuel.afficher({
		pere: this,
		evenement: function () {
			lthis
				.getInstance(lthis.identFenetreChoixDossierCopieCDT)
				.afficherChoixDossierCopieCDT(null, aCDT);
		},
		initCommandes: function (aInstance) {
			aInstance.addCommande(
				0,
				GTraductions.getValeur("CahierDeTexte.AjouterElementsCDT"),
			);
		},
	});
}
function _ExistePourMatiere() {
	const lNumeroMatiere = GEtatUtilisateur.Navigation.getNumeroRessource(
		EGenreRessource.Matiere,
	);
	const lListe = this.ListeCahierDeTextes;
	for (let I = 0; lListe && I < lListe.count(); I++) {
		if (!lNumeroMatiere || lNumeroMatiere === lListe.get(I).Matiere.Numero) {
			return true;
		}
	}
	return false;
}
function _evenementSurCahierDeTexte(aParam) {
	if (
		GEtatUtilisateur.GenreEspace === EGenreEspace.Academie &&
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
		this.getInstance(this.identFenetreVisuQCM).setDonnees(aParam.executionQCM);
	}
}
module.exports = InterfacePageRecapCahierDeTexte;
