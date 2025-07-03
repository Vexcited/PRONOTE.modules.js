exports.ObjetFenetre_ChoixSemainesEleveGAEV = void 0;
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ChoixSemainesEleveGAEV extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"ChoixSemainesEleveGAEV.ReporterElevesGroupe",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.numeroSemaine = IE.Cycles.cycleCourant();
	}
	jsxComboModelSemaines() {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					longueur: 300,
					texteEdit: ObjetTraduction_1.GTraductions.getValeur(
						"ChoixSemainesEleveGAEV.AffecterElevesGroupeDeCycle",
					),
					classTexteEdit: "",
				});
			},
			getDonnees: (aListe) => {
				if (aListe) {
					return;
				}
				const lListe = new ObjetListeElements_1.ObjetListeElements();
				const lNbCycle = IE.Cycles.nombreCyclesAnneeScolaire();
				const lCycleCourant = IE.Cycles.cycleCourant();
				for (let lNumeroCycle = 1; lNumeroCycle <= lNbCycle; lNumeroCycle++) {
					let lLibelle =
						ObjetTraduction_1.GTraductions.getValeur("Semaine") +
						" " +
						lNumeroCycle.toString();
					if (lCycleCourant === lNumeroCycle) {
						lLibelle +=
							" " +
							ObjetTraduction_1.GTraductions.getValeur(
								"ChoixSemainesEleveGAEV.EnCours",
							);
					}
					lLibelle += ObjetDate_1.GDate.formatDate(
						IE.Cycles.dateDebutCycle(lNumeroCycle),
						" (%JJ/%MM/%AAAA",
					);
					lLibelle += ObjetDate_1.GDate.formatDate(
						IE.Cycles.dateDernierJourOuvreCycle(lNumeroCycle),
						" - %JJ/%MM/%AAAA)",
					);
					lListe.addElement(
						new ObjetElement_1.ObjetElement(lLibelle, 0, lNumeroCycle),
					);
				}
				return lListe;
			},
			getIndiceSelection: () => {
				return this.numeroSemaine - 1;
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.element
				) {
					this.numeroSemaine = aParams.element.getGenre();
				}
			},
		};
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str("ie-combo", {
				"ie-model": this.jsxComboModelSemaines.bind(this),
			}),
		);
		return T.join("");
	}
	surValidation(ANumeroBouton) {
		this.fermer();
		this.callback.appel(ANumeroBouton, this.numeroSemaine);
	}
}
exports.ObjetFenetre_ChoixSemainesEleveGAEV =
	ObjetFenetre_ChoixSemainesEleveGAEV;
