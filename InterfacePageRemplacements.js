const { ObjetInvocateur, Invocateur } = require("Invocateur.js");
const { EGenreImpression } = require("Enumere_GenreImpression.js");
const { InterfacePage } = require("InterfacePage.js");
const ObjetRequetePageRemplacements = require("ObjetRequetePageRemplacements.js");
const { UtilitaireInitCalendrier } = require("UtilitaireInitCalendrier.js");
const DonneesListe_PageRemplacements = require("DonneesListe_PageRemplacements.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { GHtml } = require("ObjetHtml.js");
const { ObjetCelluleSemaine } = require("ObjetCelluleSemaine.js");
const { ObjetTri } = require("ObjetTri.js");
const { GDate } = require("ObjetDate.js");
class InterfacePageRemplacements extends InterfacePage {
	constructor(...aParams) {
		super(...aParams);
	}
	construireInstances() {
		this.identRemplacements = this.add(
			ObjetListe,
			null,
			this.initialiserTableauFlatDesign,
		);
		this.identCelluleSemaine = this.add(
			ObjetCelluleSemaine,
			this._evntCelluleSemaine,
			this._initCelluleSemaine,
		);
	}
	_initCelluleSemaine(aInstance) {
		aInstance.setParametresObjetCelluleSemaine(1);
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.identRemplacements;
		this.AddSurZone = [this.identCelluleSemaine];
	}
	initialiserCalendrier(AObjet) {
		UtilitaireInitCalendrier.init(AObjet, "");
		AObjet.setFrequences(GParametres.frequences, true);
	}
	recupererDonnees() {
		this.getInstance(this.identCelluleSemaine).setDonnees(
			GDate.getDateCourante(true),
		);
	}
	recupererDonneesCalendrier(aDureeNonAssuree, aDureeRemplacee, aListeCours) {
		this.DureeNonAssuree = aDureeNonAssuree;
		this.DureeRemplacee = aDureeRemplacee;
		this.ListeCours = aListeCours;
		this.afficherEnFlatDesign();
		Invocateur.evenement(
			ObjetInvocateur.events.activationImpression,
			this.ListeCours.count()
				? EGenreImpression.Aucune
				: EGenreImpression.Aucune,
			this,
		);
	}
	_evntCelluleSemaine(aDomaine) {
		if (aDomaine) {
			new ObjetRequetePageRemplacements(
				this,
				this.recupererDonneesCalendrier,
			).lancerRequete(
				GEtatUtilisateur.getGenreOnglet(),
				aDomaine.getPremierePosition(),
				aDomaine,
			);
		}
	}
	afficherEnFlatDesign() {
		this.ListeCours.setTri([
			ObjetTri.init((D) => {
				return D.Date;
			}),
			ObjetTri.init((D) => {
				return D.HeureDebut;
			}),
		]);
		this.ListeCours.trier();
		if (this.ListeCours.count()) {
			this.getInstance(this.identRemplacements).setDonnees(
				new DonneesListe_PageRemplacements(
					{
						ListeCours: this.ListeCours,
						DureeNonAssuree: this.DureeNonAssuree,
						DureeRemplacee: this.DureeRemplacee,
					},
					{ instance: this.getInstance(this.identRemplacements) },
				),
			);
		} else {
			this.getInstance(this.identRemplacements).setDonnees(
				new DonneesListe_PageRemplacements(
					{
						ListeCours: this.ListeCours,
						DureeNonAssuree: this.DureeNonAssuree,
						DureeRemplacee: this.DureeRemplacee,
					},
					{ instance: this.getInstance(this.identRemplacements) },
				),
			);
			const H = [];
			H.push(
				`<p class="semi-bold taille-m text-center p-y-xl m-bottom-l">`,
				GTraductions.getValeur("PageRemplacement.Remplacement_AucunCours"),
				`</p>`,
			);
			GHtml.setHtml(this.getInstance(this.identRemplacements).Nom, H.join(""));
		}
	}
	initialiserTableauFlatDesign(aInstance) {
		aInstance.setOptionsListe({ skin: ObjetListe.skin.flatDesign });
	}
}
module.exports = InterfacePageRemplacements;
