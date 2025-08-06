exports.ObjetFenetre_Attestation = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetDate_1 = require("ObjetDate");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const MethodesObjet_1 = require("MethodesObjet");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const ObjetCelluleDate_1 = require("ObjetCelluleDate");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetRequeteSaisieFicheEleve_1 = require("ObjetRequeteSaisieFicheEleve");
const GUID_1 = require("GUID");
class ObjetFenetre_Attestation extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.enModification = false;
		this.zoneDateDelivree = GUID_1.GUID.getId();
		this.setOptionsFenetre({
			largeur: 400,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
			avecComposeBasInFooter: true,
		});
	}
	construireInstances() {
		this.selecDate = ObjetIdentite_1.Identite.creerInstance(
			ObjetCelluleDate_1.ObjetCelluleDate,
			{
				pere: this,
				evenement: (aDate) => {
					this.attestation.date = aDate;
				},
			},
		);
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
						placeHolder: ObjetTraduction_1.GTraductions.getValeur(
							"FicheEleve.aucunTypeDeProjet",
						),
						getContenuElement: function (aParams) {
							const T = [];
							T.push(
								`<abbr>${aParams.element.abbreviation}</abbr><div class="libelle">${aParams.element.getLibelle()}</div>`,
							);
							return T.join("");
						},
						getClassElement: function (aParams) {
							return aParams.element.getActif() ? "" : "color-neutre-foncee";
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
					if (lIndice < 0 || !MethodesObjet_1.MethodesObjet.isNumber(lIndice)) {
						lIndice = -1;
					}
					return lIndice;
				},
				event: function (aParametres) {
					if (
						!aInstance.enModification &&
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						aParametres.element
					) {
						aInstance.attestation = aParametres.element;
						aInstance.attestation.date = ObjetDate_1.GDate.aujourdhui;
						aInstance.attestation.delivree = true;
						aInstance.attestation.setEtat(Enumere_Etat_1.EGenreEtat.Creation);
						aInstance._toggleDate();
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
				aInstance._toggleDate();
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
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"Attestation.msgConfirmerSuppression",
									[""],
								),
							})
							.then((aGenreAction) => {
								if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
									aInstance.donnees.attestation.setEtat(
										Enumere_Etat_1.EGenreEtat.Suppression,
									);
									aInstance.surValidation(1);
								}
							});
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
			this.attestation.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		} else {
			this.attestation = new ObjetElement_1.ObjetElement();
			this.attestation.delivree = true;
			this.attestation.date = ObjetDate_1.GDate.aujourdhui;
		}
		this._toggleDate();
		this.afficher();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			const lListeAttestation = new ObjetListeElements_1.ObjetListeElements();
			lListeAttestation.add(this.attestation);
			new ObjetRequeteSaisieFicheEleve_1.ObjetRequeteSaisieFicheEleve(
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
		const lIdType = GUID_1.GUID.getId();
		const lIdLe = GUID_1.GUID.getId();
		return IE.jsx.str(
			"div",
			{ class: ["flex-contain", "cols"] },
			IE.jsx.str(
				"div",
				{ class: "field-contain" },
				IE.jsx.str(
					"label",
					{ id: lIdType, class: ["ie-titre-petit"] },
					ObjetTraduction_1.GTraductions.getValeur("Attestation.type"),
					" : ",
				),
				IE.jsx.str(
					"div",
					{ class: "fluid-bloc" },
					IE.jsx.str("ie-combo", {
						"ie-model": "comboType",
						"aria-labelledby": lIdType,
						class: "full-width",
					}),
				),
			),
			IE.jsx.str(
				"div",
				{
					class: "field-contain attestation-contain",
					role: "group",
					"aria-label": "GTraductions.getValeur('Attestation.etat')",
				},
				IE.jsx.str(
					"label",
					{ class: "ie-titre-petit", "aria-hidden": "true" },
					ObjetTraduction_1.GTraductions.getValeur("Attestation.etat"),
					" : ",
				),
				IE.jsx.str(
					"div",
					null,
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "cbDelivree" },
						ObjetTraduction_1.GTraductions.getValeur("Attestation.delivree"),
					),
					IE.jsx.str(
						"div",
						{ id: this.zoneDateDelivree, class: ["flex-contain", "m-top-l"] },
						IE.jsx.str(
							"label",
							{ id: lIdLe, class: ["fix-bloc", "m-right", "self-center"] },
							ObjetTraduction_1.GTraductions.getValeur("Le") + " :",
						),
						IE.jsx.str("div", {
							class: ["text-left", "fix-bloc"],
							id: this.selecDate.getNom(),
							"ie-node": "getNodeSelecDate",
							"aria-labelledby": lIdLe,
						}),
					),
				),
			),
		);
	}
	composeBas() {
		const lHTML = [];
		lHTML.push(
			IE.jsx.str(
				"div",
				{ class: "compose-bas" },
				IE.jsx.str("ie-btnicon", {
					"ie-model": "btnSupprimer",
					"ie-tooltiplabel":
						ObjetTraduction_1.GTraductions.getValeur("Supprimer"),
					class: "icon_trash avecFond i-medium",
				}),
			),
		);
		return lHTML.join("");
	}
	_toggleDate() {
		if (this.selecDate && this.attestation) {
			this.selecDate.setPremiereDateSaisissable(GParametres.PremiereDate, true);
			this.selecDate.setDonnees(
				this.attestation.date
					? this.attestation.date
					: ObjetDate_1.GDate.aujourdhui,
			);
			$("#" + this.zoneDateDelivree).toggle(this.attestation.delivree);
		}
	}
}
exports.ObjetFenetre_Attestation = ObjetFenetre_Attestation;
