exports.ObjetFenetre_ChoixDateEleveGAEV = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeDomaine_1 = require("TypeDomaine");
var GenreChoixDate;
(function (GenreChoixDate) {
	GenreChoixDate[(GenreChoixDate["semaine"] = 0)] = "semaine";
	GenreChoixDate[(GenreChoixDate["jusquADate"] = 1)] = "jusquADate";
	GenreChoixDate[(GenreChoixDate["jusquAFinAnnee"] = 2)] = "jusquAFinAnnee";
})(GenreChoixDate || (GenreChoixDate = {}));
class ObjetFenetre_ChoixDateEleveGAEV extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"genreBoiteMessage.Confirmation",
			),
			largeur: 400,
			hauteur: 200,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Non"),
				ObjetTraduction_1.GTraductions.getValeur("Oui"),
			],
		});
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.evenementSurDate,
		);
	}
	jsxGetHtmlChoixSemaine() {
		let lLibelleChoixSemaine = "";
		if (!!this.domaine) {
			const lPremiereSemaine = this.domaine.getPremierePosition();
			const lDerniereSemaine = this.domaine.getDernierePosition();
			const lCleTraduction =
				lPremiereSemaine === lDerniereSemaine
					? "ChoixDateEleveGAEV.SemaineSelectionneeDuAu"
					: "ChoixDateEleveGAEV.SemainesSelectionneesDuAu";
			const lStrPremiereSemaine = ObjetDate_1.GDate.formatDate(
				IE.Cycles.dateDebutCycle(lPremiereSemaine),
				"%JJ/%MM",
			);
			const lStrDerniereSemaine = ObjetDate_1.GDate.formatDate(
				IE.Cycles.dateDernierJourOuvreCycle(lDerniereSemaine),
				"%JJ/%MM",
			);
			lLibelleChoixSemaine = ObjetTraduction_1.GTraductions.getValeur(
				lCleTraduction,
				[lStrPremiereSemaine, lStrDerniereSemaine],
			);
		}
		return lLibelleChoixSemaine;
	}
	jsxGetHtmlChoixJusquaFinAnnee() {
		let lLibelleChoixJusquaFinAnnee = "";
		if (!!this.domaine) {
			const lPremiereSemaine = this.domaine.getPremierePosition();
			const lStrPremiereSemaine = ObjetDate_1.GDate.formatDate(
				IE.Cycles.dateDebutCycle(lPremiereSemaine),
				"%JJ/%MM",
			);
			const lStrDerniereSemaine = ObjetDate_1.GDate.formatDate(
				GParametres.DerniereDate,
				"%JJ/%MM",
			);
			lLibelleChoixJusquaFinAnnee = ObjetTraduction_1.GTraductions.getValeur(
				"ChoixDateEleveGAEV.JusqueFinAnnee",
				[lStrPremiereSemaine, lStrDerniereSemaine],
			);
		}
		return lLibelleChoixJusquaFinAnnee;
	}
	jsxGetHtmlLibellePrincipal() {
		return this.estSuppressionEleve
			? ObjetTraduction_1.GTraductions.getValeur(
					"ChoixDateEleveGAEV.InfosSuppressionDansGroupe",
				)
			: ObjetTraduction_1.GTraductions.getValeur(
					"ChoixDateEleveGAEV.InfosModificationDansGroupe",
				);
	}
	jsxModelRadioChoixDate(aGenreChoix) {
		return {
			getValue: () => {
				return this.choix === aGenreChoix;
			},
			setValue: (aValue) => {
				this.choix = aGenreChoix;
				this.getInstance(this.identDate).setActif(
					aGenreChoix === GenreChoixDate.jusquADate,
				);
			},
			getName: () => {
				return `${this.Nom}_ChoixDate`;
			},
		};
	}
	setDonnees(aDomaine, aEstSuppressionEleve) {
		this.domaine = aDomaine;
		this.estSuppressionEleve = aEstSuppressionEleve;
		this.date = ObjetDate_1.GDate.getJourSuivant(
			IE.Cycles.dateDebutCycle(
				IE.Cycles.cycleDansAnnee(aDomaine.getDernierePosition() + 1),
			),
			6,
		);
		this.choix = GenreChoixDate.semaine;
		const lPremiereSemaine = this.getPremiereSemaineSelonChoix(this.choix);
		const lInstanceDate = this.getInstance(this.identDate);
		const lDomaine = new TypeDomaine_1.TypeDomaine();
		lDomaine.setValeur(true, 7);
		lInstanceDate.setParametresFenetre(
			GParametres.PremierLundi,
			IE.Cycles.dateDebutCycle(lPremiereSemaine),
			GParametres.DerniereDate,
			lDomaine,
		);
		lInstanceDate.setDonnees(this.date);
		lInstanceDate.setActif(false);
		this.afficher();
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str("div", {
					"ie-html": this.jsxGetHtmlLibellePrincipal.bind(this),
				}),
				IE.jsx.str(
					"div",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"ChoixDateEleveGAEV.IndicationNoteEvaluationGroupe",
					),
				),
				IE.jsx.str(
					"div",
					{ class: "EspaceHaut10" },
					ObjetChaine_1.GChaine.format(
						ObjetTraduction_1.GTraductions.getValeur(
							"ChoixDateEleveGAEV.ConfirmezLesDeuxS",
						),
						[""],
					),
				),
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceGauche" },
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str("ie-radio", {
							"ie-model": this.jsxModelRadioChoixDate.bind(
								this,
								GenreChoixDate.semaine,
							),
							"ie-html": this.jsxGetHtmlChoixSemaine.bind(this),
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str(
							"ie-radio",
							{
								"ie-model": this.jsxModelRadioChoixDate.bind(
									this,
									GenreChoixDate.jusquADate,
								),
							},
							IE.jsx.str(
								"span",
								{ class: "AlignementMilieuVertical" },
								ObjetTraduction_1.GTraductions.getValeur(
									"ChoixDateEleveGAEV.JusqueFinSemaine",
								),
							),
							IE.jsx.str("div", {
								id: this.getNomInstance(this.identDate),
								class: "InlineBlock AlignementMilieuVertical MargeGauche",
							}),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "EspaceHaut" },
						IE.jsx.str("ie-radio", {
							"ie-model": this.jsxModelRadioChoixDate.bind(
								this,
								GenreChoixDate.jusquAFinAnnee,
							),
							"ie-html": this.jsxGetHtmlChoixJusquaFinAnnee.bind(this),
						}),
					),
				),
			),
		);
		return T.join("");
	}
	evenementSurDate(aDate) {
		this.date = aDate;
	}
	surValidation(AGenreBouton) {
		let lDomaineValidation = null;
		if (AGenreBouton === 1) {
			const lPremiereSemaine = this.getPremiereSemaineSelonChoix(this.choix);
			const lDerniereSemaine = this.getDerniereSemaineSelonChoix(this.choix);
			lDomaineValidation = new TypeDomaine_1.TypeDomaine().setValeur(
				true,
				lPremiereSemaine,
				lDerniereSemaine,
			);
		}
		this.callback.appel(AGenreBouton, lDomaineValidation);
		this.fermer();
	}
	getPremiereSemaineSelonChoix(aGenreChoix) {
		if (this.domaine) {
			switch (aGenreChoix) {
				case GenreChoixDate.semaine:
					return this.domaine ? this.domaine.getPremierePosition() : null;
				case GenreChoixDate.jusquADate:
					return this.domaine ? this.domaine.getPremierePosition() : null;
				case GenreChoixDate.jusquAFinAnnee:
					return this.domaine ? this.domaine.getPremierePosition() : null;
			}
		}
		return null;
	}
	getDerniereSemaineSelonChoix(aGenreChoix) {
		switch (aGenreChoix) {
			case GenreChoixDate.semaine:
				return this.domaine.getDernierePosition();
			case GenreChoixDate.jusquADate:
				return IE.Cycles.cycleDeLaDate(this.date);
			case GenreChoixDate.jusquAFinAnnee:
				return IE.Cycles.nombreCyclesAnneeScolaire();
		}
		return null;
	}
}
exports.ObjetFenetre_ChoixDateEleveGAEV = ObjetFenetre_ChoixDateEleveGAEV;
