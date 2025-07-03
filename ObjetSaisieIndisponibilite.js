exports.ObjetSaisieIndisponibilite = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_SaisieDisposRencontre_1 = require("ObjetFenetre_SaisieDisposRencontre");
const ObjetRequeteSaisieRencontreIndisponibilites_1 = require("ObjetRequeteSaisieRencontreIndisponibilites");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetDate_1 = require("ObjetDate");
const UtilitaireRencontres_1 = require("UtilitaireRencontres");
const TypeEnsembleNombre_1 = require("TypeEnsembleNombre");
class ObjetSaisieIndisponibilite extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.donneesRecues = false;
	}
	setDonnees(aDonnees) {
		this.donneesRecues = true;
		this.session = aDonnees.session;
		this.indisponibilites = aDonnees.indisponibilites;
		this.placeFinSession =
			this.indisponibilites.placeDebutSession +
			this.indisponibilites.dureeSession;
		this.pas = 5;
		this.placesDisponibilites =
			UtilitaireRencontres_1.TUtilitaireRencontre.calculePlacesDisponibilites(
				this.indisponibilites.placeDebutSession,
				this.placeFinSession,
				this.pas,
				this.indisponibilites.placesIndisponibilitesPersonnelles,
			);
		this.placesDisponibilites.parcourir((aPlage) => {
			aPlage.dateDebut =
				UtilitaireRencontres_1.TUtilitaireRencontre.getPlaceEnDate(
					aPlage.placeDebut,
				);
			aPlage.dateFin =
				UtilitaireRencontres_1.TUtilitaireRencontre.getPlaceEnDate(
					aPlage.placeFin,
				);
		});
		this.actualiser();
	}
	actualiser() {
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
	}
	construireAffichage() {
		if (this.donneesRecues) {
			return this._composeDisponibilites();
		}
		return "";
	}
	_ouvrirFenetreModifierDispo() {
		const lParam = {
			heureDebutSession:
				UtilitaireRencontres_1.TUtilitaireRencontre.getPlaceEnDate(
					this.indisponibilites.placeDebutSession,
				),
			heureFinSession:
				UtilitaireRencontres_1.TUtilitaireRencontre.getPlaceEnDate(
					this.placeFinSession,
				),
			listePlagesDispos: this.placesDisponibilites,
		};
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_SaisieDisposRencontre_1.ObjetFenetre_SaisieDisposRencontre,
			{
				pere: this,
				evenement: function (aNumeroBouton, aListeDispos) {
					if (aNumeroBouton === 1) {
						this.placesDisponibilites = aListeDispos;
						this.actualiser();
						const lPlacesIndisponibilitesPersonnelles =
							this._calculePlacesIndisponibles(aListeDispos);
						new ObjetRequeteSaisieRencontreIndisponibilites_1.ObjetRequeteSaisieRencontreIndisponibilites(
							this,
							this.Evenement,
						).lancerRequete({
							session: this.session,
							indisponibilites: lPlacesIndisponibilitesPersonnelles,
						});
					}
				},
			},
		).setDonnees(lParam);
	}
	jsxModeleBtnModifier() {
		return {
			event: () => {
				this._ouvrirFenetreModifierDispo();
			},
		};
	}
	_composeDisponibilites() {
		const H = [];
		const lDispos = [];
		if (this.placesDisponibilites) {
			this.placesDisponibilites.parcourir((aPlage) => {
				if (aPlage.dateDebut && aPlage.dateFin) {
					lDispos.push(
						IE.jsx.str(
							"li",
							null,
							ObjetTraduction_1.GTraductions.getValeur("Rencontres.DeA", [
								ObjetDate_1.GDate.formatDate(aPlage.dateDebut, "%hh:%mm"),
								ObjetDate_1.GDate.formatDate(aPlage.dateFin, "%hh:%mm"),
							]),
						),
					);
				}
			});
		}
		H.push(
			IE.jsx.str(
				"div",
				{ class: ["zone-indisponiblites"] },
				IE.jsx.str(
					"span",
					null,
					ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.disponiblePourLaSession",
					),
				),
				IE.jsx.str("ul", { class: ["liste-disponibilites"] }, lDispos.join("")),
				IE.jsx.str(
					"div",
					{ class: ["flex-contain", "self-end", "m-right-l", "m-bottom-xl"] },
					IE.jsx.str(
						"ie-bouton",
						{
							"ie-model": this.jsxModeleBtnModifier.bind(this),
							class: ["themeBoutonNeutre"],
						},
						ObjetTraduction_1.GTraductions.getValeur("Modifier"),
					),
				),
			),
		);
		return H.join("");
	}
	_calculePlacesIndisponibles(aListeDisponibilites) {
		const lPlaceDebutHeurePleine =
			UtilitaireRencontres_1.TUtilitaireRencontre.getPlaceHeurePleinePrecedente(
				this.indisponibilites.placeDebutSession,
				this.pas,
			);
		const lFuncPlaceEstContenueDans = function (aPlace, aListeDisponibilites) {
			let lEstContenue = false;
			const lDatePourPlace =
				UtilitaireRencontres_1.TUtilitaireRencontre.getPlaceEnDate(aPlace);
			let lBorneDebut = null;
			let lBorneFin = null;
			aListeDisponibilites.parcourir((aPlage) => {
				lBorneDebut = aPlage.dateDebut;
				lBorneFin = aPlage.dateFin;
				if (
					(!lBorneDebut || lDatePourPlace >= lBorneDebut) &&
					(!lBorneFin || lDatePourPlace < lBorneFin)
				) {
					lEstContenue = true;
					return;
				}
			});
			return lEstContenue;
		};
		const lPlacesDisponibilitesPersonnelles =
			new TypeEnsembleNombre_1.TypeEnsembleNombre();
		const lPlacesIndisponibilitesPersonnelles =
			new TypeEnsembleNombre_1.TypeEnsembleNombre();
		for (
			let i = this.indisponibilites.placeDebutSession;
			i < this.placeFinSession;
			i += this.pas
		) {
			if (lFuncPlaceEstContenueDans(i, aListeDisponibilites)) {
				lPlacesDisponibilitesPersonnelles.add(
					(i - lPlaceDebutHeurePleine) / this.pas,
				);
			} else {
				lPlacesIndisponibilitesPersonnelles.add(
					(i - lPlaceDebutHeurePleine) / this.pas,
				);
			}
		}
		return lPlacesIndisponibilitesPersonnelles;
	}
}
exports.ObjetSaisieIndisponibilite = ObjetSaisieIndisponibilite;
