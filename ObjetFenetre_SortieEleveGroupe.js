const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { GDate } = require("ObjetDate.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
class ObjetFenetre_SortieEleveGroupe extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur("SortieEleveGroupe.EnleverUnEleveGroupe"),
			largeur: 300,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
		});
		this.donnees = {
			cours: null,
			semaine: null,
			eleve: null,
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
					_actualiserCelluleDate.call(aInstance);
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
			ObjetCelluleDate,
			function (aDate) {
				if (
					aDate < this.donnees.groupeSaisie.borneSortie.dateMessageInf &&
					!GDate.estJourEgal(
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
			},
			(aInstance) => {
				aInstance.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
				);
			},
		);
	}
	setDonnees(aDonnees) {
		$.extend(this.donnees, aDonnees);
		if (this.donnees.eleve && this.donnees.eleve.historiqueGroupes) {
			this.donnees.eleve.historiqueGroupes.parcourir(function (aGroupe) {
				if (aGroupe.getNumero() === aDonnees.groupe.getNumero()) {
					this.donnees.groupeSaisie = aGroupe;
				}
			}, this);
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
			_actualiserCelluleDate.call(this);
		}
		this.afficher();
	}
	composeContenu() {
		const T = [];
		T.push(
			'<div class="PetitEspace">',
			'<div class="PetitEspaceBas" style="display:flex; align-items:center;">',
			'<div class="PetitEspaceDroit Insecable" ie-html="getLibelleEleve"></div>',
			'<div class="Image_FlecheSortie" style="flex:none;"></div>',
			'<div class="PetitEspaceGauche Insecable" ie-html="getLibelleGroupe"></div>',
			"</div>",
			'<div class="EspaceBas EspaceHaut">',
			GTraductions.getValeur("SortieEleveGroupe.RetirerEleveGroupe"),
			"</div>",
			'<div style="padding-left:10px;">',
			'<div class="EspaceBas">',
			'<ie-radio ie-model="rbChoixDate(true)">' +
				GTraductions.getValeur("SortieEleveGroupe.SurAnneeComplete") +
				"</ie-radio>",
			"</div>",
			"<div>",
			'<div class="InlineBlock AlignementMilieuVertical PetitEspaceDroit">',
			'<ie-radio ie-model="rbChoixDate(false)">' +
				GTraductions.getValeur("Le") +
				"</ie-radio>",
			"</div>",
			'<div class="InlineBlock AlignementMilieuVertical" id="',
			this.getInstance(this.identDate).getNom(),
			'"></div>',
			"</div>",
			"</div>",
			"</div>",
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
}
function _actualiserCelluleDate() {
	this.getInstance(this.identDate).setActif(!this.donnees.surAnneeComplete);
}
module.exports = ObjetFenetre_SortieEleveGroupe;
