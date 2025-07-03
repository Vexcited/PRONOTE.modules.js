exports.InterfacePageRemplacements_Mobile = void 0;
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetListe_1 = require("ObjetListe");
const ObjetRequetePageRemplacements_1 = require("ObjetRequetePageRemplacements");
const DonneesListe_PageRemplacements_1 = require("DonneesListe_PageRemplacements");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const AccessApp_1 = require("AccessApp");
class InterfacePageRemplacements_Mobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construireInstances() {
		this.IdentRemplacements = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this.initialiserTableauFlatDesign,
		);
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this._evntCelluleSemaine,
			this.iniDate,
		);
	}
	iniDate(aInstance) {
		aInstance.setOptionsObjetCelluleDate({
			avecBoutonsPrecedentSuivant: true,
			avecSelectionSemaine: true,
		});
	}
	setParametresGeneraux() {
		this.IdentZoneAlClient = this.IdentRemplacements;
		this.AddSurZone = [this.identDate];
	}
	recupererDonnees() {
		this.getInstance(this.identDate).setDonnees(
			ObjetDate_1.GDate.getDateCourante(true),
			true,
		);
	}
	recupererDonneesCalendrier(aDureeNonAssuree, aDureeRemplacee, aListeCours) {
		this.ListeCours = aListeCours;
		this.afficherEnFlatDesign();
	}
	_evntCelluleSemaine(aDomaine) {
		let numeroSemaine = ObjetDate_1.GDate.getSemaine(aDomaine);
		if (aDomaine) {
			new ObjetRequetePageRemplacements_1.ObjetRequetePageRemplacements(
				this,
				this.recupererDonneesCalendrier,
			).lancerRequete(this.etatUtilisateurSco.getGenreOnglet(), numeroSemaine);
		} else {
			new ObjetRequetePageRemplacements_1.ObjetRequetePageRemplacements(
				this,
				this.recupererDonneesCalendrier,
			).lancerRequete(this.etatUtilisateurSco.getGenreOnglet(), numeroSemaine);
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
			this.getInstance(this.IdentRemplacements).setDonnees(
				new DonneesListe_PageRemplacements_1.DonneesListe_PageRemplacements(
					this.ListeCours,
				),
			);
		} else {
			this.getInstance(this.IdentRemplacements).setDonnees(
				new DonneesListe_PageRemplacements_1.DonneesListe_PageRemplacements(
					this.ListeCours,
				),
			);
			const H = [];
			H.push(
				`<div class="semi-bold taille-m m-all-xxl p-y-xl">`,
				ObjetTraduction_1.GTraductions.getValeur(
					"PageRemplacement.Remplacement_AucunCours",
				),
				`</div>`,
			);
			ObjetHtml_1.GHtml.setHtml(
				this.getInstance(this.IdentRemplacements).getNom(),
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
exports.InterfacePageRemplacements_Mobile = InterfacePageRemplacements_Mobile;
