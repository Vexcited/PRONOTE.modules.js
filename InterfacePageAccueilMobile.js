exports.InterfacePageAccueilMobile = void 0;
const PageAccueil_1 = require("PageAccueil");
const ObjetRequetePageAccueil_1 = require("ObjetRequetePageAccueil");
const MultipleObjetRequeteSaisieAccueil = require("ObjetRequeteSaisieAccueil");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const InterfacePage_Mobile_1 = require("InterfacePage_Mobile");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Espace_1 = require("Enumere_Espace");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const TypeDemiJournee_1 = require("TypeDemiJournee");
const TypeAffichageRemplacements_1 = require("TypeAffichageRemplacements");
const Enumere_Widget_1 = require("Enumere_Widget");
const AccessApp_1 = require("AccessApp");
class InterfacePageAccueilMobile extends InterfacePage_Mobile_1.InterfacePage_Mobile {
	constructor(...aParams) {
		super(...aParams);
		this.appMobile = (0, AccessApp_1.getApp)();
		this.parametresScoMobile = this.appMobile.getObjetParametres();
		this.etatUtilMobile = this.appMobile.getEtatUtilisateur();
		this.dateParDefaut = this.appMobile.getDateDemo()
			? this.appMobile.getDateDemo()
			: this.parametresScoMobile.JourOuvre;
		if (
			!this.appMobile.getDateDemo() &&
			[
				Enumere_Espace_1.EGenreEspace.Mobile_Administrateur,
				Enumere_Espace_1.EGenreEspace.Mobile_PrimDirection,
			].includes(this.etatUtilMobile.GenreEspace)
		) {
			this.dateParDefaut = ObjetDate_1.GDate.getDateCourante();
			const lHeureMidi = ObjetDate_1.GDate.placeParJourEnDate(
				this.parametresScoMobile.PlaceDemiJournee,
			);
			const lHeure = ObjetDate_1.GDate.getDateHeureCourante();
			this.demiJournee = ObjetDate_1.GDate.estAvantJour(lHeure, lHeureMidi)
				? TypeDemiJournee_1.TypeDemiJournee.Matin
				: TypeDemiJournee_1.TypeDemiJournee.ApresMidi;
		}
		this.numeroSemaineParDefaut = IE.Cycles.cycleDeLaDate(this.dateParDefaut);
		this.donneesRequete = {
			dateGrille: null,
			EDT: {
				date: [
					Enumere_Espace_1.EGenreEspace.Parent,
					Enumere_Espace_1.EGenreEspace.Eleve,
					Enumere_Espace_1.EGenreEspace.Accompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_Parent,
					Enumere_Espace_1.EGenreEspace.Mobile_Eleve,
					Enumere_Espace_1.EGenreEspace.Mobile_Accompagnant,
					Enumere_Espace_1.EGenreEspace.Mobile_Professeur,
				].includes(this.etatUtilMobile.GenreEspace)
					? null
					: this.dateParDefaut,
			},
			incidents: { numeroSemaine: this.numeroSemaineParDefaut },
			exclusions: { numeroSemaine: this.numeroSemaineParDefaut },
			donneesVS: {
				date: ObjetDate_1.GDate.getDateBornee(ObjetDate_1.GDate.aujourdhui),
			},
			registreAppel: { date: this.dateParDefaut, dj: this.demiJournee },
			previsionnelAbsServiceAnnexe: { date: this.dateParDefaut },
			donneesProfs: {
				date: ObjetDate_1.GDate.getDateBornee(ObjetDate_1.GDate.aujourdhui),
			},
			personnelsAbsents: { numeroSemaine: this.numeroSemaineParDefaut },
			coursNonAssures: { numeroSemaine: this.numeroSemaineParDefaut },
			menuDeLaCantine: { date: this.dateParDefaut },
			TAFARendre: { date: this.dateParDefaut },
			partenaireCDI: { CDI: new ObjetElement_1.ObjetElement() },
			tableauDeBord: { date: this.dateParDefaut },
			TAFEtActivites: { date: this.dateParDefaut },
			modificationsEDT: { date: this.dateParDefaut },
		};
	}
	construireInstances() {
		this.identPage = this.add(
			PageAccueil_1.ObjetAccueil,
			this.surEvenementPageAccueil,
		);
	}
	recupererDonnees(aWidget) {
		if (aWidget) {
			this.donneesRequete.widgets = aWidget;
		}
		this.donneesRequete.dateGrille = this.appMobile.getDateDemo()
			? this.appMobile.getDateDemo()
			: this.parametresScoMobile.JourOuvre;
		if (this.actionSurRecupererDonnees !== undefined) {
			new ObjetRequetePageAccueil_1.ObjetRequetePageAccueil(
				this,
				this.actionSurRecupererDonnees,
			).lancerRequete(this.donneesRequete);
		} else {
			new ObjetRequetePageAccueil_1.ObjetRequetePageAccueil(
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
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage:
				if (!!aDonnees.page) {
					this.etatUtilMobile.setPage(aDonnees.page);
					this.etatUtilMobile.Navigation.OptionsOnglet = aDonnees.page;
				}
				switch (aDonnees.genreOngletDest) {
					case Enumere_Onglet_1.EGenreOnglet.CDT_TAF:
						if (aDonnees.taf) {
							this.etatUtilMobile.setDerniereDate(
								aDonnees.taf.pourLe ? aDonnees.taf.pourLe : aDonnees.taf.date,
							);
						} else {
							this.etatUtilMobile.setDerniereDate(ObjetDate_1.GDate.aujourdhui);
						}
						break;
					case Enumere_Onglet_1.EGenreOnglet.RemplacementsEnseignants: {
						if (
							aGenreWidgetSource ===
							Enumere_Widget_1.EGenreWidget.RemplacementsEnseignants
						) {
							this.etatUtilMobile.setContexteRemplacementsEnseignant({
								genreAffichage:
									TypeAffichageRemplacements_1.TypeAffichageRemplacements
										.tarPropositions,
							});
						}
						break;
					}
					default:
						break;
				}
				this.callback.appel({
					genreOnglet: Enumere_Onglet_1.EGenreOnglet.Accueil,
					genreOngletDest: aDonnees.genreOngletDest,
				});
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.SaisieWidget: {
				const lRequete =
					new MultipleObjetRequeteSaisieAccueil.ObjetRequeteSaisieAccueil(
						this,
						this.actionSurRequeteSaisieAccueil,
					);
				if (aDonnees.pieceJoints && aDonnees.pieceJoints.count()) {
					lRequete.addUpload({ listeFichiers: aDonnees.pieceJoints });
				}
				lRequete.lancerRequete(aDonnees);
				break;
			}
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.AfficherExecutionQCM:
				this.callback.appel({
					genreOnglet: Enumere_Onglet_1.EGenreOnglet.Accueil,
					executionQCM: aDonnees,
				});
				break;
			case Enumere_EvenementWidget_1.EGenreEvenementWidget.ActualiserWidget:
				this.recupererDonnees([aGenreWidgetSource]);
				break;
		}
	}
	actionSurRequeteSaisieAccueil() {
		this.recupererDonnees();
	}
}
exports.InterfacePageAccueilMobile = InterfacePageAccueilMobile;
