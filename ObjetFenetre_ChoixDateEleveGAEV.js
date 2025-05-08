const { GChaine } = require("ObjetChaine.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeDomaine } = require("TypeDomaine.js");
class ObjetFenetre_ChoixDateEleveGAEV extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("genreBoiteMessage.Confirmation"),
			largeur: 400,
			hauteur: 200,
			listeBoutons: [
				GTraductions.getValeur("Non"),
				GTraductions.getValeur("Oui"),
			],
		});
		this.EGenreChoix = { semaine: 0, jusquADate: 1, jusquAFinAnnee: 2 };
	}
	construireInstances() {
		this.identDate = this.add(ObjetCelluleDate, this.evenementSurDate);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(this), {
			getLibellePrincipale: function () {
				return aInstance.estSuppressionEleve
					? GTraductions.getValeur(
							"ChoixDateEleveGAEV.InfosSuppressionDansGroupe",
						)
					: GTraductions.getValeur(
							"ChoixDateEleveGAEV.InfosModificationDansGroupe",
						);
			},
			getLibelleChoixSemaine: function () {
				let lLibelleChoixSemaine = "";
				if (!!aInstance.domaine) {
					const lPremiereSemaine = aInstance.domaine.getPremierePosition();
					const lDerniereSemaine = aInstance.domaine.getDernierePosition();
					const lCleTraduction =
						lPremiereSemaine === lDerniereSemaine
							? "ChoixDateEleveGAEV.SemaineSelectionneeDuAu"
							: "ChoixDateEleveGAEV.SemainesSelectionneesDuAu";
					const lStrPremiereSemaine = GDate.formatDate(
						IE.Cycles.dateDebutCycle(lPremiereSemaine),
						"%JJ/%MM",
					);
					const lStrDerniereSemaine = GDate.formatDate(
						IE.Cycles.dateDernierJourOuvreCycle(lDerniereSemaine),
						"%JJ/%MM",
					);
					lLibelleChoixSemaine = GTraductions.getValeur(lCleTraduction, [
						lStrPremiereSemaine,
						lStrDerniereSemaine,
					]);
				}
				return lLibelleChoixSemaine;
			},
			getLibelleChoixJusquaFinAnnee: function () {
				let lLibelleChoixJusquaFinAnnee = "";
				if (!!aInstance.domaine) {
					const lPremiereSemaine = aInstance.domaine.getPremierePosition();
					const lStrPremiereSemaine = GDate.formatDate(
						IE.Cycles.dateDebutCycle(lPremiereSemaine),
						"%JJ/%MM",
					);
					const lStrDerniereSemaine = GDate.formatDate(
						GParametres.DerniereDate,
						"%JJ/%MM",
					);
					lLibelleChoixJusquaFinAnnee = GTraductions.getValeur(
						"ChoixDateEleveGAEV.JusqueFinAnnee",
						[lStrPremiereSemaine, lStrDerniereSemaine],
					);
				}
				return lLibelleChoixJusquaFinAnnee;
			},
			radioChoixDates: {
				getValue: function (aGenreChoix) {
					return aInstance.choix === aGenreChoix;
				},
				setValue: function (aGenreChoix) {
					aInstance.choix = aGenreChoix;
					aInstance
						.getInstance(aInstance.identDate)
						.setActif(aGenreChoix === aInstance.EGenreChoix.jusquADate);
				},
			},
		});
	}
	setDonnees(aDomaine, aEstSuppressionEleve) {
		this.domaine = aDomaine;
		this.estSuppressionEleve = aEstSuppressionEleve;
		this.date = GDate.getJourSuivant(
			IE.Cycles.dateDebutCycle(
				IE.Cycles.cycleDansAnnee(aDomaine.getDernierePosition() + 1),
			),
			6,
		);
		this.choix = this.EGenreChoix.semaine;
		const lPremiereSemaine = getPremiereSemaineSelonChoix.call(
			this,
			this.choix,
		);
		const lInstanceDate = this.getInstance(this.identDate);
		const lDomaine = new TypeDomaine();
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
			'<div ie-html="getLibellePrincipale"></div>',
			"<div>",
			GTraductions.getValeur(
				"ChoixDateEleveGAEV.IndicationNoteEvaluationGroupe",
			),
			"</div>",
		);
		T.push(
			'<div class="EspaceHaut10">',
			GChaine.format(
				GTraductions.getValeur("ChoixDateEleveGAEV.ConfirmezLesDeuxS"),
				[""],
			),
			"</div>",
		);
		T.push('<div class="GrandEspaceGauche">');
		T.push(
			'<div class="EspaceHaut">',
			'<ie-radio ie-model="radioChoixDates(',
			this.EGenreChoix.semaine,
			')" ie-html="getLibelleChoixSemaine"></ie-radio>',
			"</div>",
		);
		T.push(
			'<div class="EspaceHaut">',
			'<ie-radio ie-model="radioChoixDates(',
			this.EGenreChoix.jusquADate,
			')">',
			'<span class="AlignementMilieuVertical">',
			GTraductions.getValeur("ChoixDateEleveGAEV.JusqueFinSemaine"),
			"</span>",
			'<div id="',
			this.getNomInstance(this.identDate),
			'" class="InlineBlock AlignementMilieuVertical MargeGauche"></div>',
			"</ie-radio>",
			"</div>",
		);
		T.push(
			'<div class="EspaceHaut">',
			'<ie-radio ie-model="radioChoixDates(',
			this.EGenreChoix.jusquAFinAnnee,
			')" ie-html="getLibelleChoixJusquaFinAnnee"></ie-radio>',
			"</div>",
		);
		T.push("</div>");
		return T.join("");
	}
	evenementSurDate(aDate) {
		this.date = aDate;
	}
	surValidation(AGenreBouton) {
		let lDomaineValidation = null;
		if (AGenreBouton === 1) {
			const lPremiereSemaine = getPremiereSemaineSelonChoix.call(
				this,
				this.choix,
			);
			const lDerniereSemaine = getDerniereSemaineSelonChoix.call(
				this,
				this.choix,
			);
			lDomaineValidation = new TypeDomaine().setValeur(
				true,
				lPremiereSemaine,
				lDerniereSemaine,
			);
		}
		this.callback.appel(AGenreBouton, lDomaineValidation);
		this.fermer();
	}
}
function getPremiereSemaineSelonChoix(aGenreChoix) {
	if (this.domaine) {
		switch (aGenreChoix) {
			case this.EGenreChoix.semaine:
				return this.domaine ? this.domaine.getPremierePosition() : null;
			case this.EGenreChoix.jusquADate:
				return this.domaine ? this.domaine.getPremierePosition() : null;
			case this.EGenreChoix.jusquAFinAnnee:
				return this.domaine ? this.domaine.getPremierePosition() : null;
		}
	}
	return null;
}
function getDerniereSemaineSelonChoix(aGenreChoix) {
	switch (aGenreChoix) {
		case this.EGenreChoix.semaine:
			return this.domaine.getDernierePosition();
		case this.EGenreChoix.jusquADate:
			return IE.Cycles.cycleDeLaDate(this.date);
		case this.EGenreChoix.jusquAFinAnnee:
			return IE.Cycles.nombreCyclesAnneeScolaire();
	}
	return null;
}
module.exports = ObjetFenetre_ChoixDateEleveGAEV;
