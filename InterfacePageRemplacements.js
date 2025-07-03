exports.InterfacePageRemplacements = void 0;
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const InterfacePage_1 = require("InterfacePage");
const ObjetRequetePageRemplacements_1 = require("ObjetRequetePageRemplacements");
const DonneesListe_PageRemplacements_1 = require("DonneesListe_PageRemplacements");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetCelluleSemaine_1 = require("ObjetCelluleSemaine");
const ObjetTri_1 = require("ObjetTri");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class InterfacePageRemplacements extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construireInstances() {
		this.identRemplacements = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserTableauFlatDesign,
		);
		this.identCelluleSemaine = this.add(
			ObjetCelluleSemaine_1.ObjetCelluleSemaine,
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
	recupererDonnees() {
		this.getInstance(this.identCelluleSemaine).setDonnees(
			ObjetDate_1.GDate.getDateCourante(true),
		);
	}
	recupererDonneesCalendrier(aDureeNonAssuree, aDureeRemplacee, aListeCours) {
		this.ListeCours = aListeCours;
		this.afficherEnFlatDesign();
		Invocateur_1.Invocateur.evenement(
			Invocateur_1.ObjetInvocateur.events.activationImpression,
			this.ListeCours.count()
				? Enumere_GenreImpression_1.EGenreImpression.Aucune
				: Enumere_GenreImpression_1.EGenreImpression.Aucune,
			this,
		);
	}
	_evntCelluleSemaine(aDomaine) {
		if (aDomaine) {
			new ObjetRequetePageRemplacements_1.ObjetRequetePageRemplacements(
				this,
				this.recupererDonneesCalendrier,
			).lancerRequete(
				this.etatUtilisateurSco.getGenreOnglet(),
				aDomaine.getPremierePosition(),
				aDomaine,
			);
		}
	}
	afficherEnFlatDesign() {
		this.ListeCours.setTri([
			ObjetTri_1.ObjetTri.init((D) => {
				return D.Date;
			}),
			ObjetTri_1.ObjetTri.init((D) => {
				return D.HeureDebut;
			}),
		]);
		this.ListeCours.trier();
		if (this.ListeCours.count()) {
			this.getInstance(this.identRemplacements).setDonnees(
				new DonneesListe_PageRemplacements_1.DonneesListe_PageRemplacements(
					this.ListeCours,
				),
			);
		} else {
			this.getInstance(this.identRemplacements).setDonnees(
				new DonneesListe_PageRemplacements_1.DonneesListe_PageRemplacements(
					this.ListeCours,
				),
			);
			const H = [];
			H.push(
				`<p class="semi-bold taille-m text-center p-y-xl m-bottom-l">`,
				ObjetTraduction_1.GTraductions.getValeur(
					"PageRemplacement.Remplacement_AucunCours",
				),
				`</p>`,
			);
			ObjetHtml_1.GHtml.setHtml(
				this.getInstance(this.identRemplacements).getNom(),
				H.join(""),
			);
		}
	}
	initialiserTableauFlatDesign(aInstance) {
		aInstance.setOptionsListe({
			skin: ObjetListe_1.ObjetListe.skin.flatDesign,
		});
	}
}
exports.InterfacePageRemplacements = InterfacePageRemplacements;
