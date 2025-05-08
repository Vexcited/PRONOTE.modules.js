exports.InterfacePageGraphique = void 0;
const ObjetHistogramme_1 = require("ObjetHistogramme");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const InterfacePage_1 = require("InterfacePage");
const ObjetSaisiePN_1 = require("ObjetSaisiePN");
class InterfacePageGraphique extends InterfacePage_1.InterfacePage {
	constructor() {
		super(...arguments);
		this.etatUtilisateurSco = GApplication.getEtatUtilisateur();
	}
	construireInstances() {
		this.IdentCombo = this.add(
			ObjetSaisiePN_1.ObjetSaisiePN,
			this.evenementSurCombo,
			this.initialiserCombo,
		);
		this.IdPremierElement = this.getInstance(
			this.IdentCombo,
		).getPremierElement();
		this.IdentPage = this.add(ObjetHistogramme_1.ObjetHistogramme);
	}
	setParametresGeneraux() {
		this.AddSurZone = [this.IdentCombo];
		this.IdentZoneAlClient = this.IdentPage;
	}
	initialiserCombo(AInstance) {
		AInstance.setOptionsObjetSaisie({
			longueur: 175,
			labelWAICellule: ObjetTraduction_1.GTraductions.getValeur(
				"WAI.ListeSelectionPeriode",
			),
		});
		ObjetStyle_1.GStyle.setVisible(
			AInstance.getNom(),
			this.etatUtilisateurSco.getGenreOnglet() !==
				Enumere_Onglet_1.EGenreOnglet.Graphique_Evolution,
		);
	}
	recupererDonnees() {
		if (
			this.etatUtilisateurSco.getGenreOnglet() !==
			Enumere_Onglet_1.EGenreOnglet.Graphique_Evolution
		) {
			this.listePeriodes = this.etatUtilisateurSco.getOngletListePeriodes();
			if (!this.listePeriodes || this.listePeriodes.count() === 0) {
				this._afficherNonPublie();
			} else {
				this.getInstance(this.IdentCombo).setDonnees(this.listePeriodes);
				this.getInstance(this.IdentCombo).setSelectionParElement(
					this.etatUtilisateurSco.getOngletPeriodeParDefaut(),
					0,
				);
			}
		} else {
			this._actualiser();
		}
	}
	evenementSurCombo(aParams) {
		if (
			aParams.genreEvenement ===
			Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie.selection
		) {
			this.etatUtilisateurSco.Navigation.setRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
				aParams.element,
			);
			this._actualiser();
		}
	}
	_actualiser() {
		const lGrapheHisto =
			this.etatUtilisateurSco.getGenreOnglet() ===
			Enumere_Onglet_1.EGenreOnglet.Graphique_Evolution;
		let lPeriode;
		if (
			!lGrapheHisto &&
			(!this.listePeriodes || this.listePeriodes.count() === 0)
		) {
			this._afficherNonPublie();
		} else {
			ObjetStyle_1.GStyle.setVisible(
				this.getInstance(this.IdentCombo).getNom(),
				!lGrapheHisto,
			);
			if (lGrapheHisto) {
				lPeriode = null;
			} else {
				lPeriode = this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Periode,
				);
				if (!lPeriode) {
					this._afficherNonPublie();
					return;
				}
			}
			ObjetHtml_1.GHtml.setHtml(
				this.getInstance(this.IdentPage).getNom(),
				"&nbsp;",
			);
			this.getInstance(this.IdentPage).setDonneesImage(
				this.etatUtilisateurSco.getMembre(),
				lPeriode,
			);
		}
	}
	_afficherNonPublie() {
		ObjetStyle_1.GStyle.setVisible(
			this.getInstance(this.IdentCombo).getNom(),
			false,
		);
		this.getInstance(this.IdentPage).vider(
			ObjetTraduction_1.GTraductions.getValeur("NonPublie"),
		);
	}
}
exports.InterfacePageGraphique = InterfacePageGraphique;
