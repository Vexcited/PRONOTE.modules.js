exports.WidgetInfosParcoursupLSL = void 0;
const ObjetWidget_1 = require("ObjetWidget");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_EvenementWidget_1 = require("Enumere_EvenementWidget");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const AccessApp_1 = require("AccessApp");
const TradWidgetInfosParcoursupLSL =
	ObjetTraduction_1.TraductionsModule.getModule("WidgetInfosParcoursupLSL", {
		MesServices: "",
		FicheAvenir: "",
		AppreciationsAnnuelles: "",
		Competences: "",
		Autres: "",
		HintFicheAvenir: "",
		HintAppreciationsAnnuelles: "",
		HintCompetences: "",
		HintAutres: "",
		LienVoirFicheAvenir: "",
		LienVoirApprAnnuelles: "",
		LienVoirCompetences: "",
	});
class WidgetInfosParcoursupLSL extends ObjetWidget_1.Widget.ObjetWidget {
	constructor(...aParams) {
		super(...aParams);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = lApplicationSco.getEtatUtilisateur();
	}
	construire(aParams) {
		this.donnees = aParams.donnees;
		const lWidget = {
			getHtml: this.composeWidgetInfosParcoursupLSL.bind(this),
		};
		$.extend(true, this.donnees, lWidget);
		aParams.construireWidget(this.donnees);
	}
	getOngletDestinationCelluleAutre(aService) {
		return aService.estUnServiceSansNote
			? Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParService
			: Enumere_Onglet_1.EGenreOnglet.SaisieNotes;
	}
	jsxNodeLienFicheAvenir(aServiceConcerne, aNode) {
		$(aNode).eventValidation(() => {
			this.naviguerVersInterface(
				Enumere_Onglet_1.EGenreOnglet.SaisieAvisParcoursup,
				aServiceConcerne,
			);
		});
	}
	jsxNodeLienAppreciationsAnnuelles(aServiceConcerne, aNode) {
		$(aNode).eventValidation(() => {
			this.naviguerVersInterface(
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations,
				aServiceConcerne,
			);
		});
	}
	jsxNodeLienCompetences(aServiceConcerne, aNode) {
		$(aNode).eventValidation(() => {
			this.naviguerVersInterface(
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences,
				aServiceConcerne,
			);
		});
	}
	jsxNodeLienAutre(aServiceConcerne, aNode) {
		$(aNode).eventValidation(() => {
			this.naviguerVersInterface(
				this.getOngletDestinationCelluleAutre(aServiceConcerne),
				aServiceConcerne,
			);
		});
	}
	naviguerVersInterface(aOngletDestination, aServiceConcerne) {
		if (aServiceConcerne) {
			const lClasseGroupeConcernee = aServiceConcerne.classeGroupe;
			if (lClasseGroupeConcernee) {
				this.etatUtilisateurSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Classe,
					lClasseGroupeConcernee.getLibelle(),
					lClasseGroupeConcernee.getNumero(),
					lClasseGroupeConcernee.getGenre(),
				);
			}
			const lAvecNavigationSurContexteDiscipline = [
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Appreciations,
				Enumere_Onglet_1.EGenreOnglet.LivretScolaire_Competences,
			].includes(aOngletDestination);
			if (lAvecNavigationSurContexteDiscipline) {
				const lDiscipline = aServiceConcerne.disciplineLivretScolaire;
				if (lDiscipline) {
					this.etatUtilisateurSco.Navigation.setRessource(
						Enumere_Ressource_1.EGenreRessource.DisciplineLivretScolaire,
						lDiscipline.getLibelle(),
						lDiscipline.getNumero(),
						lDiscipline.getGenre(),
					);
				}
			} else {
				this.etatUtilisateurSco.Navigation.setRessource(
					Enumere_Ressource_1.EGenreRessource.Service,
					aServiceConcerne.getLibelle(),
					aServiceConcerne.getNumero(),
					aServiceConcerne.getGenre(),
				);
			}
		}
		const lPageDestination = { Onglet: aOngletDestination };
		this.callback.appel(
			this.donnees.genre,
			Enumere_EvenementWidget_1.EGenreEvenementWidget.NavigationVersPage,
			lPageDestination,
		);
	}
	jsxTooltipCelluleAutre(aService) {
		const H = [];
		if (aService && aService.infosAutre && aService.infosAutre.length > 0) {
			for (const lInfoAutre of aService.infosAutre) {
				H.push(lInfoAutre);
			}
		}
		return H.join("<br/>");
	}
	getClassesCSSItem(aAvecNavigationPossible) {
		const lClasses = ["item-contain"];
		if (!aAvecNavigationPossible) {
			lClasses.push("item-contain-disabled");
		}
		return lClasses.join(" ");
	}
	composeWidgetInfosParcoursupLSL() {
		return this.construireTable();
	}
	construireTable() {
		if (this.donnees.listeServices) {
			return IE.jsx.str(
				"table",
				{
					class: "widget-table",
					"aria-label": ObjetTraduction_1.GTraductions.getValeur(
						"accueil.infosParcoursupLSL.titre",
					),
				},
				IE.jsx.str(
					"tr",
					null,
					IE.jsx.str(
						"th",
						{ scope: "col" },
						TradWidgetInfosParcoursupLSL.MesServices,
					),
					IE.jsx.str(
						"th",
						{
							style: "width: 15%;",
							scope: "col",
							title: TradWidgetInfosParcoursupLSL.HintFicheAvenir,
						},
						TradWidgetInfosParcoursupLSL.FicheAvenir,
					),
					IE.jsx.str(
						"th",
						{
							style: "width: 15%;",
							scope: "col",
							title: TradWidgetInfosParcoursupLSL.HintAppreciationsAnnuelles,
						},
						TradWidgetInfosParcoursupLSL.AppreciationsAnnuelles,
					),
					IE.jsx.str(
						"th",
						{
							style: "width: 15%;",
							scope: "col",
							title: TradWidgetInfosParcoursupLSL.HintCompetences,
						},
						TradWidgetInfosParcoursupLSL.Competences,
					),
					IE.jsx.str(
						"th",
						{
							style: "width: 15%;",
							scope: "col",
							title: TradWidgetInfosParcoursupLSL.HintAutres,
						},
						TradWidgetInfosParcoursupLSL.Autres,
					),
				),
				(H) => {
					for (const lService of this.donnees.listeServices) {
						let lValeurNbAppFicheAvenirManquantes =
							lService.nbAppFicheAvenirManquantes || 0;
						if (!lService.avecLienFicheAvenir) {
							lValeurNbAppFicheAvenirManquantes = "X";
						}
						let lTooltipLienFicheAvenir = false;
						let lIENodeLienFicheAvenir = false;
						if (lService.avecLienFicheAvenir) {
							lTooltipLienFicheAvenir =
								TradWidgetInfosParcoursupLSL.LienVoirFicheAvenir;
							lIENodeLienFicheAvenir = this.jsxNodeLienFicheAvenir.bind(
								this,
								lService,
							);
						}
						const lCelluleFicheAvenir = [];
						lCelluleFicheAvenir.push(
							IE.jsx.str(
								"div",
								{
									class: this.getClassesCSSItem(lService.avecLienFicheAvenir),
									tabindex: "0",
									role: "link",
									"ie-node": lIENodeLienFicheAvenir,
									"aria-disabled": lService.avecLienFicheAvenir
										? false
										: "true",
									"ie-tooltipdescribe": lTooltipLienFicheAvenir,
								},
								lValeurNbAppFicheAvenirManquantes,
							),
						);
						const lCelluleAppreciationsAnnuelles = [];
						lCelluleAppreciationsAnnuelles.push(
							IE.jsx.str(
								"div",
								{
									class: this.getClassesCSSItem(true),
									tabindex: "0",
									role: "link",
									"ie-node": this.jsxNodeLienAppreciationsAnnuelles.bind(
										this,
										lService,
									),
									"ie-tooltipdescribe":
										TradWidgetInfosParcoursupLSL.LienVoirApprAnnuelles,
								},
								lService.nbAppAnnuellesManquantes,
							),
						);
						let lValeurNbCompetencesManquantes =
							lService.nbCompetencesManquantes || 0;
						if (!lService.avecLienCompetences) {
							lValeurNbCompetencesManquantes = "X";
						}
						let lTooltipLienCompetencesManquantes = false;
						let lIENodeLienCompetences = false;
						if (lService.avecLienCompetences) {
							lTooltipLienCompetencesManquantes =
								TradWidgetInfosParcoursupLSL.LienVoirCompetences;
							lIENodeLienCompetences = this.jsxNodeLienCompetences.bind(
								this,
								lService,
							);
						}
						const lCelluleCompetences = [];
						lCelluleCompetences.push(
							IE.jsx.str(
								"div",
								{
									class: this.getClassesCSSItem(lService.avecLienCompetences),
									tabindex: "0",
									role: "link",
									"ie-node": lIENodeLienCompetences,
									"aria-disabled": lService.avecLienCompetences
										? false
										: "true",
									"ie-tooltipdescribe": lTooltipLienCompetencesManquantes,
								},
								lValeurNbCompetencesManquantes,
							),
						);
						const lCelluleAutres = [];
						if (lService.infosAutre && lService.infosAutre.length > 0) {
							let lIENodeLienAutre = false;
							if (
								this.etatUtilisateurSco.estOngletAccessible(
									this.getOngletDestinationCelluleAutre(lService),
								)
							) {
								lIENodeLienAutre = this.jsxNodeLienAutre.bind(this, lService);
							}
							const lClassesCelluleAutre = ["AlignementMilieuVertical"];
							if (!!lIENodeLienAutre) {
								lClassesCelluleAutre.push("AvecMain");
							}
							lCelluleAutres.push(
								IE.jsx.str(
									"div",
									{
										class: lClassesCelluleAutre.join(" "),
										tabindex: "0",
										role: "link",
										"ie-node": lIENodeLienAutre,
										"aria-disabled": !!lIENodeLienAutre ? false : "true",
										"ie-tooltiplabel": this.jsxTooltipCelluleAutre.bind(
											this,
											lService,
										),
									},
									IE.jsx.str("i", {
										class: "icon_warning_sign font-size-19",
										role: "presentation",
									}),
								),
							);
						}
						H.push(
							IE.jsx.str(
								"tr",
								null,
								IE.jsx.str("th", { scope: "row" }, lService.getLibelle()),
								IE.jsx.str("td", null, lCelluleFicheAvenir.join("")),
								IE.jsx.str("td", null, lCelluleAppreciationsAnnuelles.join("")),
								IE.jsx.str("td", null, lCelluleCompetences.join("")),
								IE.jsx.str("td", null, lCelluleAutres.join("")),
							),
						);
					}
				},
			);
		}
		return "";
	}
}
exports.WidgetInfosParcoursupLSL = WidgetInfosParcoursupLSL;
