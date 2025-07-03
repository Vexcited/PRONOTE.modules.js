exports.ObjetPreferenceMessagerie = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetIdentite_1 = require("ObjetIdentite");
const CollectionRequetes_1 = require("CollectionRequetes");
const ObjetRequeteJSON_1 = require("ObjetRequeteJSON");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetElement_1 = require("ObjetElement");
const ObjetDate_1 = require("ObjetDate");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
class ObjetRequetePreferenceMessagerie extends ObjetRequeteJSON_1.ObjetRequeteConsultation {}
CollectionRequetes_1.Requetes.inscrire(
	"PreferenceMessagerie",
	ObjetRequetePreferenceMessagerie,
);
class ObjetRequeteSaisiePreferenceMessagerie extends ObjetRequeteJSON_1.ObjetRequeteSaisie {}
CollectionRequetes_1.Requetes.inscrire(
	"SaisiePreferenceMessagerie",
	ObjetRequeteSaisiePreferenceMessagerie,
);
class ObjetPreferenceMessagerie extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.listeHeures = new ObjetListeElements_1.ObjetListeElements();
		for (let i = 1; i <= 23; i++) {
			this.listeHeures.add(
				new ObjetElement_1.ObjetElement(
					ObjetDate_1.GDate.formatDureeEnMillisecondes(
						i * 60 * 60 * 1000,
						"%hh%sh%mm",
					),
					i,
				),
			);
		}
	}
	jsxModeleRadioUniquementParentEleve(aUniquementParentEleve) {
		return {
			getValue: () => {
				return this.donnees.uniquementParentEleve === aUniquementParentEleve;
			},
			setValue: (aValue) => {
				this.donnees.uniquementParentEleve = aUniquementParentEleve;
				this._saisie("uniquementParentEleve", aUniquementParentEleve);
			},
			getDisabled: () => {
				return this._estConsult();
			},
			getName: () => {
				return `${this.Nom}_oUniquementParentEleve`;
			},
		};
	}
	jsxModeleCheckboxJoursNonOuvres() {
		return {
			getValue: () => {
				return this.donnees.nonOuvres;
			},
			setValue: (aValue) => {
				this.donnees.nonOuvres = aValue;
				this._saisie("nonOuvres", aValue);
			},
			getDisabled: () => {
				return this._estConsult();
			},
		};
	}
	jsxModeleCheckboxJoursOuvres() {
		return {
			getValue: () => {
				return this.donnees.ouvres;
			},
			setValue: (aValue) => {
				this.donnees.ouvres = aValue;
				this._saisie("ouvres", aValue);
			},
			getDisabled: () => {
				return this._estConsult();
			},
		};
	}
	jsxModeleCheckboxJoursOuvresAvantApres(aCle) {
		return {
			getValue: () => {
				return this.donnees[aCle];
			},
			setValue: (aValue) => {
				this.donnees[aCle] = aValue;
				this._saisie(aCle, aValue);
			},
			getDisabled: () => {
				return !this.donnees.ouvres || this._estConsult();
			},
		};
	}
	jsxComboModelOuvres(aHeureAvant) {
		return {
			init: (aCombo) => {
				aCombo.setOptionsObjetSaisie({
					longueur: 40,
					iconeGauche: "icon_time",
					avecBouton: !IE.estMobile,
					labelWAICellule: aHeureAvant
						? ObjetTraduction_1.GTraductions.getValeur(
								"PrefMess.SelectionHeureAvant",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"PrefMess.SelectionHeureApres",
							),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe) {
					return this.listeHeures;
				}
			},
			getIndiceSelection: () => {
				const lHeure = aHeureAvant
					? this.donnees.heureAvant
					: this.donnees.heureApres;
				return this.listeHeures.getIndiceParNumeroEtGenre(lHeure) || 0;
			},
			event: (aParams, aCombo) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.element &&
					aCombo.estUneInteractionUtilisateur()
				) {
					const lHeure = aParams.element.getNumero();
					const lAccesseur = aHeureAvant ? "heureAvant" : "heureApres";
					if (this.donnees[lAccesseur] !== lHeure) {
						this.donnees[lAccesseur] = lHeure;
						this._saisie(lAccesseur, lHeure);
					}
				}
			},
			getDisabled: () => {
				return !this.donnees.ouvres || this._estConsult();
			},
		};
	}
	jsxModeleCheckboxJours(aIndexJour) {
		return {
			getValue: () => {
				const lJour = this.donnees.listeJours[aIndexJour];
				return lJour.actif;
			},
			setValue: (aValue) => {
				const lJour = this.donnees.listeJours[aIndexJour];
				lJour.actif = aValue;
				this._saisie("jour", { jour: lJour.jour, actif: aValue });
			},
			getDisabled: () => {
				return !this.donnees.ouvres || this._estConsult();
			},
		};
	}
	jsxModeleSwitchActiverRetour() {
		return {
			getValue: () => {
				return this.donnees.activerMessageAuto;
			},
			setValue: (aValue) => {
				this.donnees.activerMessageAuto = aValue;
				this._saisie("messageAuto", aValue ? this.donnees.messageAuto : "");
			},
			getDisabled: () => {
				return this._estConsult();
			},
		};
	}
	jsxModeleTextarea() {
		return {
			getValue: () => {
				return this.donnees.messageAuto;
			},
			setValue: (aValue) => {
				this.donnees.messageAuto = aValue;
			},
			exitChange: () => {
				if (this.donnees.activerMessageAuto) {
					this._saisie("messageAuto", this.donnees.messageAuto);
				}
			},
			getDisabled: () => {
				return !this.donnees.activerMessageAuto || this._estConsult();
			},
		};
	}
	recupererDonnees() {
		this._requeteDonnees();
	}
	construireAffichage() {
		if (!this.donnees) {
			return "";
		}
		const H = [];
		$("#" + this.Nom.escapeJQ()).addClass(
			"ObjetPreferenceMessagerie droit-deconnexion-contain",
		);
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"fieldset",
					null,
					IE.jsx.str(
						"legend",
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"PrefMess.DesactivationReception",
						),
					),
					IE.jsx.str(
						"div",
						{ class: "droit-deconnexion-bloc" },
						IE.jsx.str(
							"div",
							{ class: "choice-contain" },
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioUniquementParentEleve.bind(
										this,
										false,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"PrefMess.TousLesMessages",
								),
							),
						),
						IE.jsx.str(
							"div",
							{ class: "choice-contain" },
							IE.jsx.str(
								"ie-radio",
								{
									"ie-model": this.jsxModeleRadioUniquementParentEleve.bind(
										this,
										true,
									),
								},
								ObjetTraduction_1.GTraductions.getValeur(
									"PrefMess.UniquementLesMessagesDesParentsEtEleves",
								),
							),
						),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "droit-deconnexion-bloc mobile-line" },
					IE.jsx.str(
						"div",
						{ class: "choice-contain" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxJoursNonOuvres.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur(
								"PrefMess.PendantNonOuvres",
							),
						),
					),
					IE.jsx.str(
						"div",
						{ class: "choice-contain" },
						IE.jsx.str(
							"ie-checkbox",
							{ "ie-model": this.jsxModeleCheckboxJoursOuvres.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur(
								"PrefMess.PendantOuvres",
							),
						),
					),
					IE.jsx.str(
						"div",
						{
							class: "liste-choice",
							role: "group",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"PrefMess.SelectionJourOuvres",
							),
						},
						(aTabJours) => {
							this.donnees.listeJours.forEach((aJour, aIndex) => {
								aTabJours.push(
									IE.jsx.str(
										"ie-checkbox",
										{
											class: "as-chips",
											"ie-model": this.jsxModeleCheckboxJours.bind(
												this,
												aIndex,
											),
										},
										!IE.estMobile
											? ObjetTraduction_1.GTraductions.getValeur("Jours")[
													aJour.jour - 1
												]
											: ObjetTraduction_1.GTraductions.getValeur("JoursCourt")[
													aJour.jour - 1
												],
									),
								);
							});
						},
					),
					IE.jsx.str(
						"div",
						{ class: "choice-contain duree" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModeleCheckboxJoursOuvresAvantApres.bind(
									this,
									"plageAvant",
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("PrefMess.Avant"),
						),
						IE.jsx.str("ie-combo", {
							"ie-model": this.jsxComboModelOuvres.bind(this, true),
							class: "combo-mobile",
						}),
					),
					IE.jsx.str(
						"div",
						{ class: "choice-contain duree" },
						IE.jsx.str(
							"ie-checkbox",
							{
								"ie-model": this.jsxModeleCheckboxJoursOuvresAvantApres.bind(
									this,
									"plageApres",
								),
							},
							ObjetTraduction_1.GTraductions.getValeur("PrefMess.Apres"),
						),
						IE.jsx.str("ie-combo", {
							"ie-model": this.jsxComboModelOuvres.bind(this, false),
							class: "combo-mobile",
						}),
					),
				),
				IE.jsx.str(
					"div",
					{ class: "droit-deconnexion-bloc" },
					IE.jsx.str(
						"div",
						{ class: "choice-contain" },
						IE.jsx.str(
							"ie-switch",
							{ "ie-model": this.jsxModeleSwitchActiverRetour.bind(this) },
							ObjetTraduction_1.GTraductions.getValeur(
								"PrefMess.ActiverMessageAutoCourt",
							),
						),
					),
					IE.jsx.str("ie-textareamax", {
						"ie-model": this.jsxModeleTextarea.bind(this),
						maxlength: "500",
						"aria-label": ObjetTraduction_1.GTraductions.getValeur(
							"PrefMess.ActiverMessageAutoCourt",
						),
					}),
				),
			),
		);
		return H.join("");
	}
	_estConsult() {
		return GApplication.droits.get(
			ObjetDroitsPN_1.TypeDroits.estEnConsultation,
		);
	}
	_requeteDonnees() {
		return new ObjetRequetePreferenceMessagerie(this)
			.lancerRequete()
			.then((aDonnees) => {
				this.donnees = aDonnees;
				this.donnees.activerMessageAuto = !!this.donnees.messageAuto;
				if (!this.donnees.messageAuto) {
					this.donnees.messageAuto = ObjetTraduction_1.GTraductions.getValeur(
						"PrefMess.MessageAutoDefaut",
					);
				}
				this.afficher();
			});
	}
	_saisie(aGenre, aVal) {
		return new ObjetRequeteSaisiePreferenceMessagerie(this).lancerRequete({
			genre: aGenre,
			val: aVal,
		});
	}
}
exports.ObjetPreferenceMessagerie = ObjetPreferenceMessagerie;
