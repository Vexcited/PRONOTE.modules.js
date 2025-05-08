const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetElement } = require("ObjetElement.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { tag } = require("tag.js");
const { GUID } = require("GUID.js");
const { GDate } = require("ObjetDate.js");
const { MethodesObjet } = require("MethodesObjet.js");
class ObjetFenetre_SaisieDisposRencontre extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: GTraductions.getValeur(
				"Rencontres.PersonnalisezMesPlagesDisponibilite",
			),
			largeur: 400,
			hauteur: 300,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				{ libelle: GTraductions.getValeur("Valider"), valider: true },
			],
		});
		this.donnees = {
			listePlagesDispos: null,
			heureDebutSession: null,
			heureFinSession: null,
			pasDisponibilite: 5,
			modale: null,
		};
		this.nombreCreneauxMax = 5;
		this.id = { plagesDispo: GUID.getId() };
	}
	construireInstances() {}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			if (this.donnees.listePlagesDispos) {
				const lNouvellesPlages = new ObjetListeElements();
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
			this.listeOriginalDispo;
		}
		this.fermer();
	}
	composeContenu() {
		const H = [];
		H.push(
			tag(
				"div",
				tag("p", { "ie-html": "getHtmlSession" }),
				tag("p", GTraductions.getValeur("Rencontres.disponiblePourLaSession")),
				tag("div", {
					"ie-html": "composePlageDispo",
					class: "flex-contain cols",
				}),
			),
			tag(
				"ie-bouton",
				{
					"ie-model": "btnAjouterPlage",
					class: "m-top-xl themeBoutonNeutre btn-ajouter",
				},
				GTraductions.getValeur("Rencontres.AjouterDisponibilite"),
			),
		);
		return H.join("");
	}
	setDonnees(aDonnees) {
		this.donnees.heureDebutSession = aDonnees.heureDebutSession;
		this.donnees.heureFinSession = aDonnees.heureFinSession;
		this.donnees.listePlagesDispos = MethodesObjet.dupliquer(
			aDonnees.listePlagesDispos,
		);
		this.afficher();
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getHtmlSession: function () {
				return aInstance.donnees &&
					aInstance.donnees.heureDebutSession &&
					aInstance.donnees.heureFinSession
					? GTraductions.getValeur("Rencontres.LaSessionDureDeA", [
							GDate.formatDate(aInstance.donnees.heureDebutSession, "%hh:%mm"),
							GDate.formatDate(aInstance.donnees.heureFinSession, "%hh:%mm"),
						])
					: "";
			},
			composePlageDispo: function () {
				const H = [];
				if (aInstance.donnees && aInstance.donnees.listePlagesDispos) {
					H.push(_composePlage.call(aInstance));
				}
				return H.join("");
			},
			inputTime: {
				getValueInit(aEstHeureDebut, aIndicePlage) {
					if (aInstance.donnees && aInstance.donnees.listePlagesDispos) {
						const lPlage =
							aInstance.donnees.listePlagesDispos.get(aIndicePlage);
						if (lPlage) {
							if (aEstHeureDebut && lPlage.dateDebut) {
								return GDate.formatDate(lPlage.dateDebut, "%hh:%mm");
							} else if (!aEstHeureDebut && lPlage.dateFin) {
								return GDate.formatDate(lPlage.dateFin, "%hh:%mm");
							}
						}
					}
					return "";
				},
				exitChange(aEstHeureDebut, aIndicePlage, aValue, aParamsSetter) {
					const lPlage = aInstance.donnees.listePlagesDispos.get(aIndicePlage);
					let lDate = null;
					if (lPlage) {
						lDate = new Date();
						lDate.setHours(aParamsSetter.time.heure);
						lDate.setMinutes(aParamsSetter.time.minute);
						lDate.setSeconds(0);
						lDate.setMilliseconds(0);
						if (aEstHeureDebut) {
							lPlage.dateDebut = lDate;
						} else {
							lPlage.dateFin = lDate;
						}
					}
				},
			},
			btnAjouterPlage: {
				event: function () {
					if (aInstance.donnees && aInstance.donnees.listePlagesDispos) {
						aInstance.donnees.listePlagesDispos.add(new ObjetElement());
					}
				},
				getDisabled: function () {
					if (aInstance.donnees.listePlagesDispos) {
						const lNbrCreneaux = aInstance.donnees.listePlagesDispos.count();
						if (lNbrCreneaux >= aInstance.nombreCreneauxMax) {
							return false;
						}
						if (lNbrCreneaux > 0) {
							const lElement = aInstance.donnees.listePlagesDispos.get(
								lNbrCreneaux - 1,
							);
							return !(lElement && lElement.dateDebut && lElement.dateFin);
						} else {
							return false;
						}
					}
					return true;
				},
			},
			btnSupprimerPlage: {
				event: function (aIndicePlage) {
					if (aInstance.donnees && aInstance.donnees.listePlagesDispos) {
						aInstance.donnees.listePlagesDispos.remove(aIndicePlage);
					}
				},
			},
		});
	}
}
function _composePlage() {
	const H = [];
	const _construireInput = (
		aHeureDeb,
		aHeureFin,
		aEstHeureDeb,
		aIndice,
		aLabel,
	) => {
		return tag("input", {
			type: "time",
			min: aHeureDeb,
			max: aHeureFin,
			step: this.pasDisponibilite * 60,
			"ie-model": tag.funcAttr("inputTime", [aEstHeureDeb, aIndice]),
			class: "round-style m-right-l m-left-l",
			"aria-label": aLabel,
		});
	};
	const lHeureDebSession = GDate.formatDate(
		this.donnees.heureDebutSession,
		"%hh:%mm",
	);
	const lHeureFinSession = GDate.formatDate(
		this.donnees.heureFinSession,
		"%hh:%mm",
	);
	this.donnees.listePlagesDispos.parcourir((aPlage, aIndicePlage) => {
		H.push(
			tag(
				"div",
				{ class: "m-all flex-contain flex-center" },
				'<div class="flex-contain flex-center fluid-bloc">',
				GTraductions.getValeur("De"),
				_construireInput(
					lHeureDebSession,
					lHeureFinSession,
					true,
					aIndicePlage,
					GTraductions.getValeur("De"),
				),
				GTraductions.getValeur("A"),
				_construireInput(
					lHeureDebSession,
					lHeureFinSession,
					false,
					aIndicePlage,
					GTraductions.getValeur("A"),
				),
				"</div>",
				tag("ie-btnicon", {
					"ie-model": tag.funcAttr("btnSupprimerPlage", [aIndicePlage]),
					class: "icon_trash m-left-xl bt-large avecFond",
					title: GTraductions.getValeur("Supprimer"),
				}),
			),
		);
	});
	return H.join("");
}
module.exports = ObjetFenetre_SaisieDisposRencontre;
