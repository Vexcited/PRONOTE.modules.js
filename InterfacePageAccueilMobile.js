const ObjetAccueil = require("PageAccueil.js");
const { ObjetRequetePageAccueil } = require("ObjetRequetePageAccueil.js");
const ObjetRequeteSaisieAccueil = require("ObjetRequeteSaisieAccueil.js");
const { ObjetElement } = require("ObjetElement.js");
const { GDate } = require("ObjetDate.js");
const { InterfacePage_Mobile } = require("InterfacePage_Mobile.js");
const { EGenreOnglet } = require("Enumere_Onglet.js");
const { EGenreEspace } = require("Enumere_Espace.js");
const { EGenreEvenementWidget } = require("Enumere_EvenementWidget.js");
const { TypeDemiJournee } = require("TypeDemiJournee.js");
const { TypeAffichageRemplacements } = require("TypeAffichageRemplacements.js");
const { EGenreWidget } = require("Enumere_Widget.js");
class InterfacePageAccueilMobile extends InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.dateParDefaut = GApplication.getDateDemo()
			? GApplication.getDateDemo()
			: GParametres.JourOuvre;
		if (
			!GApplication.getDateDemo() &&
			[
				EGenreEspace.Mobile_Administrateur,
				EGenreEspace.Mobile_PrimDirection,
			].includes(GEtatUtilisateur.GenreEspace)
		) {
			this.dateParDefaut = GDate.getDateCourante();
			const lHeureMidi = GDate.placeParJourEnDate(GParametres.PlaceDemiJournee);
			const lHeure = GDate.getDateHeureCourante();
			this.demiJournee = GDate.estAvantJour(lHeure, lHeureMidi)
				? TypeDemiJournee.Matin
				: TypeDemiJournee.ApresMidi;
		}
		this.numeroSemaineParDefaut = IE.Cycles.cycleDeLaDate(this.dateParDefaut);
		this.donneesRequete = {
			dateGrille: null,
			EDT: {
				date: [
					EGenreEspace.Parent,
					EGenreEspace.Eleve,
					EGenreEspace.Accompagnant,
					EGenreEspace.Mobile_Parent,
					EGenreEspace.Mobile_Eleve,
					EGenreEspace.Mobile_Accompagnant,
					EGenreEspace.Mobile_Professeur,
				].includes(GEtatUtilisateur.GenreEspace)
					? null
					: this.dateParDefaut,
			},
			incidents: { numeroSemaine: this.numeroSemaineParDefaut },
			exclusions: { numeroSemaine: this.numeroSemaineParDefaut },
			donneesVS: { date: GDate.getDateBornee(GDate.aujourdhui) },
			registreAppel: { date: this.dateParDefaut, dj: this.demiJournee },
			previsionnelAbsServiceAnnexe: { date: this.dateParDefaut },
			donneesProfs: { date: GDate.getDateBornee(GDate.aujourdhui) },
			personnelsAbsents: { numeroSemaine: this.numeroSemaineParDefaut },
			coursNonAssures: { numeroSemaine: this.numeroSemaineParDefaut },
			menuDeLaCantine: { date: this.dateParDefaut },
			TAFARendre: { date: this.dateParDefaut },
			partenaireCDI: { CDI: new ObjetElement() },
			tableauDeBord: { date: this.dateParDefaut },
			TAFEtActivites: { date: this.dateParDefaut },
			modificationsEDT: { date: this.dateParDefaut },
		};
	}
	construireInstances() {
		this.identPage = this.add(ObjetAccueil, this.surEvenementPageAccueil);
	}
	recupererDonnees(aWidget) {
		if (aWidget) {
			this.donneesRequete.widgets = aWidget;
		}
		this.donneesRequete.dateGrille = GApplication.getDateDemo()
			? GApplication.getDateDemo()
			: GParametres.JourOuvre;
		if (this.actionSurRecupererDonnees !== undefined) {
			new ObjetRequetePageAccueil(
				this,
				this.actionSurRecupererDonnees,
			).lancerRequete(this.donneesRequete);
		} else {
			new ObjetRequetePageAccueil(
				this,
				this.Pere.actionSurRecupererDonnees.bind(this.Pere),
			).lancerRequete(this.donneesRequete);
		}
	}
	actionSurRecupererDonnees(aDonnees) {
		this.DonneesRecues = true;
		this.donnees = aDonnees;
		this.getInstance(this.identPage).setDonnees(
			aDonnees,
			this.numeroSemaineParDefaut,
			this.donneesRequete,
			this.dateParDefaut,
		);
	}
	surEvenementPageAccueil(aGenreWidgetSource, aGenreEvenement, aDonnees) {
		switch (aGenreEvenement) {
			case EGenreEvenementWidget.NavigationVersPage:
				if (!!aDonnees.page) {
					GEtatUtilisateur.setPage(aDonnees.page);
					GEtatUtilisateur.Navigation.OptionsOnglet = aDonnees.page;
				}
				switch (aDonnees.genreOngletDest) {
					case EGenreOnglet.CDT_TAF:
						if (aDonnees.taf) {
							GEtatUtilisateur.setDerniereDate(
								aDonnees.taf.pourLe ? aDonnees.taf.pourLe : aDonnees.taf.date,
							);
						} else {
							GEtatUtilisateur.setDerniereDate(GDate.aujourdhui);
						}
						break;
					case EGenreOnglet.RemplacementsEnseignants: {
						if (aGenreWidgetSource === EGenreWidget.RemplacementsEnseignants) {
							GEtatUtilisateur.setContexteRemplacementsEnseignant({
								genreAffichage: TypeAffichageRemplacements.tarPropositions,
							});
						}
						break;
					}
					default:
						break;
				}
				this.callback.appel({
					genreOnglet: EGenreOnglet.Accueil,
					genreOngletDest: aDonnees.genreOngletDest,
				});
				break;
			case EGenreEvenementWidget.SaisieWidget: {
				const lRequete = new ObjetRequeteSaisieAccueil(
					this,
					this.actionSurRequeteSaisieAccueil,
				);
				if (aDonnees.pieceJoints && aDonnees.pieceJoints.count()) {
					lRequete.addUpload({ listeFichiers: aDonnees.pieceJoints });
				}
				lRequete.lancerRequete(aDonnees);
				break;
			}
			case EGenreEvenementWidget.AfficherExecutionQCM:
				this.callback.appel({
					genreOnglet: EGenreOnglet.Accueil,
					executionQCM: aDonnees,
				});
				break;
			case EGenreEvenementWidget.ActualiserWidget:
				this.recupererDonnees([aGenreWidgetSource]);
				break;
		}
	}
	actionSurRequeteSaisieAccueil() {
		this.recupererDonnees();
	}
}
module.exports = InterfacePageAccueilMobile;
