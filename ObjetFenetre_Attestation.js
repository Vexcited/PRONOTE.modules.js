const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const { Identite } = require("ObjetIdentite.js");
const { GDate } = require("ObjetDate.js");
const { tag } = require("tag.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const {
	EGenreEvenementObjetSaisie,
} = require("Enumere_EvenementObjetSaisie.js");
const { MethodesObjet } = require("MethodesObjet.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { EGenreAction } = require("Enumere_Action.js");
const { ObjetCelluleDate } = require("ObjetCelluleDate.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const {
	ObjetRequeteSaisieFicheEleve,
} = require("ObjetRequeteSaisieFicheEleve.js");
const { GUID } = require("GUID.js");
class ObjetFenetre_Attestation extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 400,
			listeBoutons: [
				GTraductions.getValeur("Annuler"),
				GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
		this.enModification = false;
		this.zoneDateDelivree = GUID.getId();
	}
	construireInstances() {
		this.selecDate = Identite.creerInstance(ObjetCelluleDate, {
			pere: this,
			evenement: (aDate) => {
				this.attestation.date = aDate;
			},
		});
		this.selecDate.setOptionsObjetCelluleDate({
			largeurComposant: 100,
			formatDate: "%JJ/%MM/%AAAA",
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			comboType: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						estLargeurAuto: false,
						placeHolder: GTraductions.getValeur("FicheEleve.aucunTypeDeProjet"),
						getContenuElement: function (aParams) {
							const T = [];
							T.push(
								`<abbr>${aParams.element.abbreviation}</abbr><div class="libelle">${aParams.element.getLibelle()}</div>`,
							);
							return T.join("");
						},
						getClassElement: function (aParams) {
							return aParams.element.getActif() ? "" : "Gris";
						},
						getEstElementNonSelectionnable: (aElement) => {
							return !aInstance.enModification && !aElement.Actif;
						},
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.donnees ? aInstance.donnees.listeTypes : null;
					}
				},
				getDisabled: function () {
					return aInstance.enModification;
				},
				getIndiceSelection: function () {
					if (
						!aInstance.donnees ||
						!aInstance.donnees.attestation ||
						!aInstance.donnees.listeTypes
					) {
						return -1;
					}
					let lIndice = aInstance.donnees.listeTypes.getIndiceParNumeroEtGenre(
						aInstance.donnees.attestation.getNumero(),
					);
					if (lIndice < 0 || !MethodesObjet.isNumber(lIndice)) {
						lIndice = -1;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						!aInstance.enModification &&
						aParametres.genreEvenement ===
							EGenreEvenementObjetSaisie.selection &&
						aParametres.element
					) {
						aInstance.attestation = aParametres.element;
						aInstance.attestation.date = GDate.aujourdhui;
						aInstance.attestation.delivree = true;
						aInstance.attestation.setEtat(EGenreEtat.Creation);
						_toggleDate.call(aInstance);
					}
				},
			},
			cbDelivree: {
				getValue: function () {
					return aInstance.attestation && aInstance.attestation.delivree;
				},
				setValue: function (aDelivree) {
					aInstance.attestation.delivree = aDelivree;
					$("#" + aInstance.zoneDateDelivree).toggle(
						aInstance.attestation.delivree,
					);
				},
			},
			getNodeSelecDate: function () {
				aInstance.selecDate.initialiser();
				aInstance.selecDate.setParametresFenetre(
					GParametres.PremierLundi,
					GParametres.PremiereDate,
					GParametres.DerniereDate,
					GParametres.JoursOuvres,
					null,
					GParametres.JoursFeries,
					null,
					null,
				);
				_toggleDate.call(aInstance);
			},
			btnSupprimer: {
				event: function () {
					if (
						aInstance.enModification &&
						aInstance.donnees &&
						aInstance.donnees.attestation &&
						aInstance.donnees.attestation.existeNumero()
					) {
						GApplication.getMessage()
							.afficher({
								type: EGenreBoiteMessage.Confirmation,
								message: GTraductions.getValeur(
									"Attestation.msgConfirmerSuppression",
									[""],
								),
							})
							.then(
								((aGenreAction) => {
									if (aGenreAction === EGenreAction.Valider) {
										aInstance.donnees.attestation.setEtat(
											EGenreEtat.Suppression,
										);
										aInstance.surValidation(1);
									}
								}).bind(aInstance),
							);
					}
				},
				getDisabled: function () {
					return !aInstance.donnees || !aInstance.enModification;
				},
			},
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.index === 1) {
						return !(
							aInstance.attestation && aInstance.attestation.existeNumero()
						);
					}
					return (
						aInstance.optionsFenetre.listeBoutonsInactifs &&
						aInstance.optionsFenetre.listeBoutonsInactifs[
							aBoutonRepeat.element.index
						] === true
					);
				},
			},
		});
	}
	setDonnees(aDonnees) {
		this.donnees = aDonnees;
		if (aDonnees.attestation) {
			this.enModification = true;
			this.attestation = aDonnees.attestation;
			this.attestation.setEtat(EGenreEtat.Modification);
		} else {
			this.attestation = new ObjetElement();
			this.attestation.delivree = true;
			this.attestation.date = GDate.aujourdhui;
		}
		_toggleDate.call(this);
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeAttestation = new ObjetListeElements();
			lListeAttestation.add(this.attestation);
			new ObjetRequeteSaisieFicheEleve(
				this,
				this.actionSurValidation,
			).lancerRequete({
				listeAttestations: lListeAttestation,
				eleve: this.donnees.eleve,
			});
			this.callback.appel(aNumeroBouton, this.attestation);
		}
		this.fermer();
	}
	composeContenu() {
		const T = [];
		const lIdType = GUID.getId();
		const lIdLe = GUID.getId();
		T.push(
			tag(
				"div",
				{ class: ["flex-contain", "cols"] },
				tag(
					"div",
					{ class: "field-contain" },
					tag(
						"label",
						{ id: lIdType, class: ["fix-bloc"] },
						GTraductions.getValeur("Attestation.type"),
						" : ",
					),
					tag(
						"div",
						{ class: "fluid-bloc" },
						tag("ie-combo", {
							"ie-model": "comboType",
							"aria-labelledby": lIdType,
							class: "full-width",
						}),
					),
				),
				tag(
					"fieldset",
					{ class: "flex-contain m-top-l no-line" },
					tag(
						"legend",
						{ class: "sr-only" },
						GTraductions.getValeur("Attestation.etat"),
					),
					tag(
						"label",
						{ class: "m-right-l", "aria-hidden": true },
						GTraductions.getValeur("Attestation.etat"),
						" : ",
					),
					tag(
						"div",
						tag(
							"ie-checkbox",
							{ "ie-model": "cbDelivree" },
							GTraductions.getValeur("Attestation.delivree"),
						),
						tag(
							"div",
							{ id: this.zoneDateDelivree, class: ["flex-contain", "m-top-l"] },
							tag(
								"label",
								{ id: lIdLe, class: ["fix-bloc", "m-right", "self-center"] },
								GTraductions.getValeur("Le") + " :",
							),
							tag("div", {
								class: ["text-left", "fix-bloc"],
								id: this.selecDate.getNom(),
								"ie-node": "getNodeSelecDate",
								"aria-labelledby": lIdLe,
							}),
						),
					),
				),
			),
		);
		return T.join("");
	}
	composeBas() {
		const lHTML = [];
		lHTML.push(
			`<div class="compose-bas">\n    <ie-btnicon ie-model="btnSupprimer" title="${GTraductions.getValeur("Supprimer")}" class="icon_trash avecFond i-medium"></ie-btnicon>\n    </div>`,
		);
		return lHTML.join("");
	}
}
function _toggleDate() {
	if (this.selecDate && this.attestation) {
		this.selecDate.setPremiereDateSaisissable(GParametres.PremiereDate, true);
		this.selecDate.setDonnees(
			this.attestation.date ? this.attestation.date : GDate.aujourdhui,
		);
		$("#" + this.zoneDateDelivree).toggle(this.attestation.delivree);
	}
}
module.exports = { ObjetFenetre_Attestation };
