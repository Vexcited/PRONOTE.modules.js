exports.ObjetFenetre_SortieEleveGroupe = void 0;
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetDate_1 = require("ObjetDate");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_SortieEleveGroupe extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"SortieEleveGroupe.EnleverUnEleveGroupe",
			),
			largeur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
		this.donnees = {
			cours: null,
			eleve: null,
			groupe: null,
			groupeSaisie: null,
			surAnneeComplete: false,
			date: null,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleEleve: function () {
				return aInstance.donnees.eleve
					? aInstance.donnees.eleve.getLibelle()
					: "";
			},
			getLibelleGroupe: function () {
				return aInstance.donnees.groupe
					? aInstance.donnees.groupe.getLibelle()
					: "";
			},
			rbChoixDate: {
				getValue: function (aAnnee) {
					return aInstance.donnees.surAnneeComplete === aAnnee;
				},
				setValue: function (aAnnee) {
					aInstance.donnees.surAnneeComplete = aAnnee;
					aInstance._actualiserCelluleDate();
				},
				getDisabled: function (aAnnee) {
					if (aAnnee) {
						return (
							aInstance.donnees.eleve &&
							!aInstance.donnees.groupeSaisie.borneSortie.surAnneeScolaire
						);
					}
					return false;
				},
			},
		});
	}
	construireInstances() {
		this.identDate = this.add(
			ObjetCelluleDate_1.ObjetCelluleDate,
			this.surChangementDate.bind(this),
			this.initialiserCelluleDate,
		);
	}
	initialiserCelluleDate(aInstance) {
		aInstance.setParametresFenetre(
			GParametres.PremierLundi,
			GParametres.PremiereDate,
			GParametres.DerniereDate,
		);
	}
	surChangementDate(aDate) {
		if (
			aDate < this.donnees.groupeSaisie.borneSortie.dateMessageInf &&
			!ObjetDate_1.GDate.estJourEgal(
				aDate,
				this.donnees.groupeSaisie.borneSortie.dateMessageInf,
			) &&
			this.donnees.groupeSaisie.borneSortie.messageInf
		) {
			GApplication.getMessage().afficher({
				message: this.donnees.groupeSaisie.borneSortie.messageInf,
			});
			this.getInstance(this.identDate).setDonnees(this.donnees.date);
			return;
		}
		this.donnees.date = aDate;
	}
	setDonnees(aDonnees) {
		$.extend(this.donnees, aDonnees);
		if (this.donnees.eleve && this.donnees.eleve.historiqueGroupes) {
			this.donnees.eleve.historiqueGroupes.parcourir((aGroupe) => {
				if (aGroupe.getNumero() === aDonnees.groupe.getNumero()) {
					this.donnees.groupeSaisie = aGroupe;
				}
			});
			if (!this.donnees.groupeSaisie) {
				return;
			}
			if (!this.donnees.groupeSaisie.borneSortie.date) {
				this.donnees.groupeSaisie.borneSortie.date = GParametres.PremiereDate;
			}
			this.donnees.surAnneeComplete =
				!!this.donnees.groupeSaisie.borneSortie.surAnneeScolaire;
			this.donnees.date = new Date(
				this.donnees.groupeSaisie.borneSortie.date.getTime(),
			);
			this.getInstance(this.identDate).setDonnees(this.donnees.date);
			this._actualiserCelluleDate();
		}
		this.afficher();
	}
	composeContenu() {
		const T = [];
		T.push(
			IE.jsx.str(
				"div",
				{ class: "PetitEspace" },
				IE.jsx.str(
					"div",
					{
						class: "PetitEspaceBas",
						style: "display:flex; align-items:center;",
					},
					IE.jsx.str("div", {
						class: "PetitEspaceDroit Insecable",
						"ie-html": "getLibelleEleve",
					}),
					IE.jsx.str("div", {
						class: "Image_FlecheSortie",
						style: "flex:none;",
					}),
					IE.jsx.str("div", {
						class: "PetitEspaceGauche Insecable",
						"ie-html": "getLibelleGroupe",
					}),
				),
				IE.jsx.str(
					"div",
					{ class: "EspaceBas EspaceHaut" },
					ObjetTraduction_1.GTraductions.getValeur(
						"SortieEleveGroupe.RetirerEleveGroupe",
					),
				),
				IE.jsx.str(
					"div",
					{ style: "padding-left:10px;" },
					IE.jsx.str(
						"div",
						{ class: "EspaceBas" },
						IE.jsx.str(
							"ie-radio",
							{ "ie-model": "rbChoixDate(true)" },
							ObjetTraduction_1.GTraductions.getValeur(
								"SortieEleveGroupe.SurAnneeComplete",
							),
						),
					),
					IE.jsx.str(
						"div",
						null,
						IE.jsx.str(
							"div",
							{
								class: "InlineBlock AlignementMilieuVertical PetitEspaceDroit",
							},
							IE.jsx.str(
								"ie-radio",
								{ "ie-model": "rbChoixDate(false)" },
								ObjetTraduction_1.GTraductions.getValeur("Le"),
							),
						),
						IE.jsx.str("div", {
							class: "InlineBlock AlignementMilieuVertical",
							id: this.getNomInstance(this.identDate),
						}),
					),
				),
			),
		);
		return T.join("");
	}
	surValidation(aGenreBouton) {
		this.fermer();
		this.callback.appel(
			aGenreBouton === 1,
			this.donnees.surAnneeComplete,
			this.donnees.date,
		);
	}
	_actualiserCelluleDate() {
		this.getInstance(this.identDate).setActif(!this.donnees.surAnneeComplete);
	}
}
exports.ObjetFenetre_SortieEleveGroupe = ObjetFenetre_SortieEleveGroupe;
