exports.InterfacePageMenus = void 0;
const ObjetRequetePageMenus_1 = require("ObjetRequetePageMenus");
const Invocateur_1 = require("Invocateur");
const Enumere_GenreImpression_1 = require("Enumere_GenreImpression");
const ObjetCycles_1 = require("ObjetCycles");
const ObjetDate_1 = require("ObjetDate");
const InterfacePage_1 = require("InterfacePage");
const TypeHttpGenerationPDFSco_1 = require("TypeHttpGenerationPDFSco");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetCelluleSemaine_1 = require("ObjetCelluleSemaine");
const UtilitaireMenus_1 = require("UtilitaireMenus");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_LegendeIconesMenu_1 = require("ObjetFenetre_LegendeIconesMenu");
const ObjetMenuCantine_1 = require("ObjetMenuCantine");
const ObjetTraduction_1 = require("ObjetTraduction");
class InterfacePageMenus extends InterfacePage_1.InterfacePage {
	constructor(...aParams) {
		super(...aParams);
		const lGParam = this.applicationSco.getObjetParametres();
		this.cycles = new ObjetCycles_1.ObjetCycles().init({
			premiereDate: lGParam.PremiereDate,
			derniereDate: lGParam.DerniereDate,
			dateDebutPremierCycle: lGParam.dateDebutPremierCycle,
			joursOuvresParCycle: lGParam.joursDemiPension.count(),
			premierJourSemaine: lGParam.premierJourSemaine,
			joursOuvres: lGParam.joursDemiPension,
			joursFeries: lGParam.ensembleJoursFeries,
		});
		this.avecDetailAllergenes = true;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnModale: {
				event() {
					ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_LegendeIconesMenu_1.ObjetFenetre_LegendeIconesMenu,
						{ pere: this },
					).setDonnees({
						listeAllergenes: aInstance.listeAllergenes,
						listelabels: aInstance.listelabels,
					});
				},
			},
		});
	}
	construireInstances() {
		this.identCelluleSemaine = this.add(
			ObjetCelluleSemaine_1.ObjetCelluleSemaine,
			this.evenementCelluleSemaine,
			this.initialiserCelluleSemaine,
		);
		this.IdPremierElement = this.getInstance(
			this.identCelluleSemaine,
		).getPremierElement();
		this.idPremierObjet = this.IdPremierElement;
		this.identPage = this.add(
			ObjetMenuCantine_1.ObjetMenuCantine,
			null,
			this.initMenuCantine,
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
		this.avecBandeau = true;
	}
	recupererDonnees() {
		const lCelluleSemaine = this.getInstance(this.identCelluleSemaine);
		lCelluleSemaine.setParametresObjetCelluleSemaine(1, this.cycles);
		lCelluleSemaine.setParametresDateDebutPersonnalise(
			GParametres.PremiereDate,
		);
		lCelluleSemaine.setParametresDateFinPersonnalise(GParametres.DerniereDate);
		let lDate =
			this.cycles.datePremierJourOuvreCycle(
				GApplication.getEtatUtilisateur().getSemaineSelectionnee(),
			) || ObjetDate_1.GDate.aujourdhui;
		if (GApplication.getDemo()) {
			lDate = GApplication.getDateDemo();
		}
		lCelluleSemaine.setDonnees(lDate);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "InterfacePageMenus", style: "height: 100%;" },
				IE.jsx.str(
					"div",
					{ class: "header flex-contain justify-between flex-center p-all-xl" },
					IE.jsx.str(
						"div",
						{ class: "flex-contain justify-center flex-gap-l flex-center" },
						IE.jsx.str("div", {
							id: this.getNomInstance(this.identCelluleSemaine),
						}),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str("ie-btnicon", {
							"ie-model": "btnModale",
							"aria-haspopup": "dialog",
							class: "icon_legende bt-large bt-activable",
							"aria-label":
								ObjetTraduction_1.GTraductions.getValeur("menus.TitreFenetre"),
							title:
								ObjetTraduction_1.GTraductions.getValeur("menus.TitreFenetre"),
						}),
					),
				),
				IE.jsx.str("div", {
					id: this.getNomInstance(this.identPage),
					class: "fluid-bloc page p-x-xl overflow-auto ",
				}),
			),
		);
		return H.join("");
	}
	initialiserCelluleSemaine(aInstance) {
		aInstance.setParametresObjetCelluleSemaine(1);
	}
	evenementCelluleSemaine(aDomaine) {
		if (aDomaine) {
			const lEtatUtilisateur = GApplication.getEtatUtilisateur();
			lEtatUtilisateur.setDomaineSelectionne(aDomaine);
			lEtatUtilisateur.setSemaineSelectionnee(aDomaine.getPremierePosition());
			const lDate = this.cycles.dateDebutCycle(aDomaine.getPremierePosition());
			this.requete(lDate);
		}
	}
	requete(aDate) {
		new ObjetRequetePageMenus_1.ObjetRequetePageMenus(
			this,
			this.apresRequete,
		).lancerRequete(aDate);
	}
	apresRequete(aParams) {
		const _activerPDF = () => {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.GenerationPDF,
				this,
				() => {
					return {
						genreGenerationPDF:
							TypeHttpGenerationPDFSco_1.TypeHttpGenerationPDFSco.MenuCantine,
						numeroSemaine:
							GApplication.getEtatUtilisateur().getSemaineSelectionnee(),
					};
				},
			);
		};
		this.ListeJours = aParams.ListeJours;
		this.listeAllergenes = aParams.ListeAllergenes;
		this.listelabels = aParams.Listelabels;
		if (this.ListeJours.count() === 0) {
			Invocateur_1.Invocateur.evenement(
				Invocateur_1.ObjetInvocateur.events.activationImpression,
				Enumere_GenreImpression_1.EGenreImpression.Aucune,
			);
			this.getInstance(this.identPage).afficherMessage(
				this.composeMessage(
					ObjetTraduction_1.GTraductions.getValeur(
						"menus.Message.AucunJourPublie",
					),
				),
			);
		} else {
			if (
				this.applicationSco.getObjetParametres().joursDemiPension.count() === 0
			) {
				this.getInstance(this.identPage).afficherMessage(
					this.composeMessage(
						ObjetTraduction_1.GTraductions.getValeur(
							"menus.Message.AucunJourPublie",
						),
					),
				);
				return;
			}
			_activerPDF();
			this.donnees = UtilitaireMenus_1.UtilitaireMenus.formatDonnees(
				this.ListeJours,
				aParams.AvecRepasMidi,
				aParams.AvecRepasSoir,
			);
			const lDomaine =
				GApplication.getEtatUtilisateur().getSemaineSelectionnee();
			const lDateDebutDuCycleSelectionne =
				this.cycles.datePremierJourOuvreCycle(lDomaine);
			const lDateFinDuCycleSelectionne =
				this.cycles.dateDernierJourOuvreCycle(lDomaine);
			this.getInstance(this.identPage).setDonnees({
				donnees: this.donnees,
				dateDebutCycle: lDateDebutDuCycleSelectionne,
				dateFinCycle: lDateFinDuCycleSelectionne,
				cycles: this.cycles,
			});
		}
	}
	initMenuCantine(aInstance) {
		aInstance.setFiltre(this.avecDetailAllergenes);
	}
}
exports.InterfacePageMenus = InterfacePageMenus;
