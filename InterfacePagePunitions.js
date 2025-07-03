exports.InterfacePagePunitions = void 0;
const ObjetRequetePagePunitions_1 = require("ObjetRequetePagePunitions");
const DonneesListe_Punitions_1 = require("DonneesListe_Punitions");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetSaisie_1 = require("ObjetSaisie");
const ObjetListe_1 = require("ObjetListe");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequeteSaisiePunitions_1 = require("ObjetRequeteSaisiePunitions");
const AccessApp_1 = require("AccessApp");
class InterfacePagePunitions extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		this.appScoEspace = (0, AccessApp_1.getApp)();
		this.idxFiltre = this.appScoEspace
			.getEtatUtilisateur()
			.getFiltreSurveillances();
		this.filtres = new ObjetListeElements_1.ObjetListeElements();
		this.filtres.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"punition.surveillance.toutes",
				),
				null,
				GenreFiltre.toutes,
			),
		);
		this.filtres.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"punition.surveillance.lesMiennes",
				),
				null,
				GenreFiltre.lesMiennes,
			),
		);
		this.filtres.addElement(
			new ObjetElement_1.ObjetElement(
				ObjetTraduction_1.GTraductions.getValeur(
					"punition.surveillance.lesNonAttribuees",
				),
				null,
				GenreFiltre.lesNonAttribuees,
			),
		);
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDate,
			this.initialiserDate,
		);
		this.identFiltre = this.add(
			ObjetSaisie_1.ObjetSaisie,
			this._evenementFiltre.bind(this),
			this._initFiltre.bind(this),
		);
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserListe,
		);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identListe;
		this.avecBandeau = true;
		this.AddSurZone = [{ ident: this.identDate }, { ident: this.identFiltre }];
	}
	initialiserDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({ avecBoutonsPrecedentSuivant: true });
		aInstance.setControleNavigation(true);
	}
	initialiserListe(aInstance) {
		aInstance.setOptionsListe(
			DonneesListe_Punitions_1.DonneesListe_Punitions.options,
		);
		this.appScoEspace
			.getEtatUtilisateur()
			.setTriListe({ liste: aInstance, tri: [0, 1] });
	}
	requetePage(aNavigation) {
		new ObjetRequetePagePunitions_1.ObjetRequetePagePunitions(this)
			.lancerRequete({ dateDebut: aNavigation.dateDebut })
			.then((aReponse) => {
				this.listePunitions = aReponse.listePunitions;
				this._filtrerDonnees();
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_Punitions_1.DonneesListe_Punitions(
						this.listePunitions,
					),
				);
			});
	}
	recupererDonnees() {
		this.afficherPage();
		this.getInstance(this.identFiltre).setDonnees(this.filtres, this.idxFiltre);
	}
	afficherPage() {
		this.setEtatSaisie(false);
		const lDate = this.appScoEspace.getObjetParametres().listeComboPeriodes
			.navigation
			? this.appScoEspace.getObjetParametres().listeComboPeriodes.navigation
					.dateDebut
			: ObjetDate_1.GDate.getDateCourante();
		this.getInstance(this.identDate).setDonnees(lDate);
		this.evenementSurDate(lDate);
	}
	valider() {
		new ObjetRequeteSaisiePunitions_1.ObjetRequeteSaisiePunitions(
			this,
			this.actionSurValidation,
		).lancerRequete(this.listePunitions);
	}
	evenementSurDate(aDate) {
		this.setEtatSaisie(false);
		const lNavigation = {};
		lNavigation.dateDebut = aDate;
		lNavigation.dateFin = aDate;
		this.appScoEspace.getObjetParametres().listeComboPeriodes.navigation =
			lNavigation;
		this.requetePage(lNavigation);
	}
	_initFiltre(aInstance) {
		aInstance.setOptionsObjetSaisie({
			longueur: 200,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"punition.surveillances",
			),
			deroulerListeSeulementSiPlusieursElements: false,
			initAutoSelectionAvecUnElement: false,
			classTexte: "Gras",
			texteEdit: ObjetTraduction_1.GTraductions.getValeur(
				"punition.surveillances",
			),
		});
	}
	_evenementFiltre(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.idxFiltre = aParams.indice;
			this.appScoEspace
				.getEtatUtilisateur()
				.setFiltreSurveillances(this.idxFiltre);
			this._filtrerDonnees();
			if (this.listePunitions) {
				this.getInstance(this.identListe).actualiser(true);
			}
		}
	}
	_filtrerDonnees() {
		if (this.listePunitions) {
			this.listePunitions.parcourir((aElement) => {
				aElement.visible = false;
				switch (this.idxFiltre) {
					case GenreFiltre.toutes:
						aElement.visible = true;
						break;
					case GenreFiltre.lesMiennes:
						aElement.visible = aElement.estLeSurveillant;
						this._verifierVisibilitePere(aElement);
						break;
					case GenreFiltre.lesNonAttribuees:
						aElement.visible = aElement.sansSurveillant;
						this._verifierVisibilitePere(aElement);
						break;
					default:
						aElement.visible = true;
						break;
				}
			});
			this.listePunitions.parcourir((aElement) => {
				if (!aElement.visible && aElement.pere && aElement.pere.visible) {
					aElement.visible = true;
				}
			});
		}
	}
	_verifierVisibilitePere(aElement) {
		if (aElement.visible && aElement.pere) {
			aElement.pere.visible = true;
		}
	}
}
exports.InterfacePagePunitions = InterfacePagePunitions;
var GenreFiltre;
(function (GenreFiltre) {
	GenreFiltre[(GenreFiltre["toutes"] = 0)] = "toutes";
	GenreFiltre[(GenreFiltre["lesMiennes"] = 1)] = "lesMiennes";
	GenreFiltre[(GenreFiltre["lesNonAttribuees"] = 2)] = "lesNonAttribuees";
})(GenreFiltre || (GenreFiltre = {}));
