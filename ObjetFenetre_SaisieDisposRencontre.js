exports.ObjetFenetre_SaisieDisposRencontre = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const GUID_1 = require("GUID");
const ObjetDate_1 = require("ObjetDate");
const MethodesObjet_1 = require("MethodesObjet");
class ObjetFenetre_SaisieDisposRencontre extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.nombreCreneauxMax = 5;
		this.id = { plagesDispo: GUID_1.GUID.getId() };
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.PersonnalisezMesPlagesDisponibilite",
			),
			largeur: 400,
			hauteur: 300,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
					valider: true,
				},
			],
		});
		this.donnees = {
			listePlagesDispos: null,
			heureDebutSession: null,
			heureFinSession: null,
			pasDisponibilite: 5,
		};
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			if (this.donnees.listePlagesDispos) {
				const lNouvellesPlages = new ObjetListeElements_1.ObjetListeElements();
				this.donnees.listePlagesDispos.parcourir((aPlage) => {
					if (aPlage.dateDebut === undefined) {
						const lNbrPlages = lNouvellesPlages.count();
						aPlage.dateDebut =
							lNbrPlages > 0
								? lNouvellesPlages.get(lNbrPlages - 1).dateFin
								: this.donnees.heureDebutSession;
					}
					if (aPlage.dateFin === undefined) {
						aPlage.dateFin = this.donnees.heureFinSession;
					}
					lNouvellesPlages.add(aPlage);
				});
				this.callback.appel(aNumeroBouton, lNouvellesPlages);
			}
		} else {
		}
		this.fermer();
	}
	jsxGetHtmlSession() {
		if (
			this.donnees &&
			this.donnees.heureDebutSession &&
			this.donnees.heureFinSession
		) {
			return ObjetTraduction_1.GTraductions.getValeur(
				"Rencontres.LaSessionDureDeA",
				[
					ObjetDate_1.GDate.formatDate(
						this.donnees.heureDebutSession,
						"%hh:%mm",
					),
					ObjetDate_1.GDate.formatDate(this.donnees.heureFinSession, "%hh:%mm"),
				],
			);
		}
		return "";
	}
	jsxGetHtmlPlageDispo() {
		const H = [];
		if (this.donnees && this.donnees.listePlagesDispos) {
			H.push(this._composePlage());
		}
		return H.join("");
	}
	jsxModeleBoutonAjouterPlage() {
		return {
			event: () => {
				if (this.donnees && this.donnees.listePlagesDispos) {
					this.donnees.listePlagesDispos.add(new ObjetElement_1.ObjetElement());
				}
			},
			getDisabled: () => {
				if (this.donnees.listePlagesDispos) {
					const lNbrCreneaux = this.donnees.listePlagesDispos.count();
					if (lNbrCreneaux >= this.nombreCreneauxMax) {
						return false;
					}
					if (lNbrCreneaux > 0) {
						const lElement = this.donnees.listePlagesDispos.get(
							lNbrCreneaux - 1,
						);
						return !(lElement && lElement.dateDebut && lElement.dateFin);
					} else {
						return false;
					}
				}
				return true;
			},
		};
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str("p", { "ie-html": this.jsxGetHtmlSession.bind(this) }),
					IE.jsx.str(
						"p",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"Rencontres.disponiblePourLaSession",
						),
					),
					IE.jsx.str("div", {
						"ie-html": this.jsxGetHtmlPlageDispo.bind(this),
						class: "flex-contain cols",
					}),
				),
				IE.jsx.str(
					"ie-bouton",
					{
						"ie-model": this.jsxModeleBoutonAjouterPlage.bind(this),
						class: "m-top-xl themeBoutonNeutre btn-ajouter",
					},
					ObjetTraduction_1.GTraductions.getValeur(
						"Rencontres.AjouterDisponibilite",
					),
				),
			),
		);
		return H.join("");
	}
	setDonnees(aDonnees) {
		this.donnees.heureDebutSession = aDonnees.heureDebutSession;
		this.donnees.heureFinSession = aDonnees.heureFinSession;
		this.donnees.listePlagesDispos = MethodesObjet_1.MethodesObjet.dupliquer(
			aDonnees.listePlagesDispos,
		);
		this.afficher();
	}
	jsxModeleInputTime(aEstHeureDebut, aPlage) {
		return {
			getValueInit: () => {
				if (this.donnees && this.donnees.listePlagesDispos && aPlage) {
					if (aEstHeureDebut && aPlage.dateDebut) {
						return ObjetDate_1.GDate.formatDate(aPlage.dateDebut, "%hh:%mm");
					} else if (!aEstHeureDebut && aPlage.dateFin) {
						return ObjetDate_1.GDate.formatDate(aPlage.dateFin, "%hh:%mm");
					}
				}
				return "";
			},
			exitChange: (aValue, aParamsSetter) => {
				let lDate = null;
				if (aPlage) {
					lDate = new Date();
					lDate.setHours(aParamsSetter.time.heure);
					lDate.setMinutes(aParamsSetter.time.minute);
					lDate.setSeconds(0);
					lDate.setMilliseconds(0);
					if (aEstHeureDebut) {
						aPlage.dateDebut = lDate;
					} else {
						aPlage.dateFin = lDate;
					}
				}
			},
		};
	}
	jsxModeleBoutonSupprimerPlage(aPlage) {
		return {
			event: () => {
				if (this.donnees && this.donnees.listePlagesDispos && aPlage) {
					const lIndicePlage =
						this.donnees.listePlagesDispos.getIndiceParElement(aPlage);
					this.donnees.listePlagesDispos.remove(lIndicePlage);
				}
			},
		};
	}
	_composePlage() {
		const H = [];
		const _construireInput = (
			aHeureDeb,
			aHeureFin,
			aEstHeureDeb,
			aPlage,
			aLabel,
		) => {
			return IE.jsx.str("input", {
				type: "time",
				min: aHeureDeb,
				max: aHeureFin,
				step: this.donnees.pasDisponibilite * 60,
				"ie-model": this.jsxModeleInputTime.bind(this, aEstHeureDeb, aPlage),
				class: "m-right-l m-left-l",
				"aria-label": aLabel,
			});
		};
		const lHeureDebSession = ObjetDate_1.GDate.formatDate(
			this.donnees.heureDebutSession,
			"%hh:%mm",
		);
		const lHeureFinSession = ObjetDate_1.GDate.formatDate(
			this.donnees.heureFinSession,
			"%hh:%mm",
		);
		this.donnees.listePlagesDispos.parcourir((aPlage) => {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "m-all flex-contain flex-center" },
					IE.jsx.str(
						"div",
						{ class: "flex-contain flex-center fluid-bloc" },
						ObjetTraduction_1.GTraductions.getValeur("De"),
						_construireInput(
							lHeureDebSession,
							lHeureFinSession,
							true,
							aPlage,
							ObjetTraduction_1.GTraductions.getValeur("De"),
						),
						ObjetTraduction_1.GTraductions.getValeur("A"),
						_construireInput(
							lHeureDebSession,
							lHeureFinSession,
							false,
							aPlage,
							ObjetTraduction_1.GTraductions.getValeur("A"),
						),
					),
					IE.jsx.str("ie-btnicon", {
						"ie-model": this.jsxModeleBoutonSupprimerPlage.bind(this, aPlage),
						class: "icon_trash m-left-xl bt-large avecFond",
						title: ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					}),
				),
			);
		});
		return H.join("");
	}
}
exports.ObjetFenetre_SaisieDisposRencontre = ObjetFenetre_SaisieDisposRencontre;
