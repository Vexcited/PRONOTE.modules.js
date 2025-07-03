exports.PanelDetailServiceNotation = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const Enumere_RessourceArrondi_1 = require("Enumere_RessourceArrondi");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetInterface_1 = require("ObjetInterface");
const ToucheClavier_1 = require("ToucheClavier");
const TypeNote_1 = require("TypeNote");
const Enumere_Arrondi_1 = require("Enumere_Arrondi");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class PanelDetailServiceNotation extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idArrondis = this.Nom + "_Arrondis";
		this.IdPeriode = this.Nom + "_Periode";
		this.idCoefficientGeneral = this.Nom + "_CoefficientGeneral";
		this.idCoefficient = this.Nom + "_Coefficient";
		this.idPonderation = this.Nom + "_Ponderation";
		this.idModeCalculMoyenne = this.Nom + "_ModeCalculeMoyenne";
		this.idMoyenneBulletin = this.Nom + "_MoyenneBulletin";
	}
	construireInstances() {}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	recupererDonnees() {
		$("#" + this.Nom.escapeJQ())
			.off({ keydown: this.surKeyDown, keypress: this.surKeyPress })
			.on(
				{ keydown: this.surKeyDown, keypress: this.surKeyPress },
				{ instance: this },
			);
	}
	jsxComboModelPrecisionArrondi(aGenreRessourceArrondi) {
		return {
			init: (aCombo) => {
				const lWAIZone = [];
				if (
					aGenreRessourceArrondi ===
					Enumere_RessourceArrondi_1.EGenreRessourceArrondi.EleveEtudiant
				) {
					lWAIZone.push(this.getTraductionEleve(), " : ");
				} else if (
					aGenreRessourceArrondi ===
					Enumere_RessourceArrondi_1.EGenreRessourceArrondi.ClassePromotion
				) {
					lWAIZone.push(this.getTraductionClasse(), " : ");
				}
				lWAIZone.push(this.getTraductionArrondir());
				aCombo.setOptionsObjetSaisie({
					longueur: 50,
					labelWAICellule: lWAIZone.join(""),
				});
			},
			getDonnees: (aListe) => {
				if (!aListe) {
					return this.listeArrondis;
				}
			},
			getIndiceSelection: () => {
				const lElementConcerne = this.Service ? this.Service : this.module;
				let lIndice = 0;
				if (
					!!this.listeArrondis &&
					!!lElementConcerne &&
					!!lElementConcerne.periode &&
					!!lElementConcerne.periode.arrondis
				) {
					const lPrecisionArrondi =
						lElementConcerne.periode.arrondis[
							aGenreRessourceArrondi
						].getPrecision();
					lIndice = this.listeArrondis.getIndiceElementParFiltre((D) => {
						return D.precision === lPrecisionArrondi;
					});
				}
				return Math.max(lIndice, 0);
			},
			event: (aParams) => {
				if (
					aParams.genreEvenement ===
						Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
							.selection &&
					aParams.combo.estUneInteractionUtilisateur() &&
					!!aParams.element
				) {
					const lElementConcerne = this.Service ? this.Service : this.module;
					if (
						!!lElementConcerne &&
						!!lElementConcerne.periode &&
						!!lElementConcerne.periode.arrondis
					) {
						const lPrecisionSelectionnee = aParams.element.precision;
						const lObjetArrondis =
							lElementConcerne.periode.arrondis[aGenreRessourceArrondi];
						lObjetArrondis.setPrecision(lPrecisionSelectionnee);
						if (lPrecisionSelectionnee === 0.01) {
							lObjetArrondis.setGenre(Enumere_Arrondi_1.EGenreArrondi.sans);
						} else if (
							lObjetArrondis.getGenre() === Enumere_Arrondi_1.EGenreArrondi.sans
						) {
							lObjetArrondis.setGenre(
								Enumere_Arrondi_1.EGenreArrondi.superieur,
							);
						}
						lElementConcerne.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						lElementConcerne.periode.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						this.callback.appel();
					}
				}
			},
			getDisabled: () => {
				let lEstEditable = false;
				if (!this.cloture && !!this.Actif) {
					lEstEditable =
						!!this.autorisations &&
						!!this.autorisations.modifierParametresServices;
				}
				return !lEstEditable;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbFacultatif: {
				getValue() {
					return !!aInstance.Service && !!aInstance.Service.facultatif;
				},
				setValue(aValeur) {
					if (!!aInstance.Service) {
						aInstance.Service.facultatif = aValeur;
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.callback.appel();
					}
				},
				getDisabled() {
					let lEstEditable = false;
					if (!aInstance.cloture && !!aInstance.Actif) {
						if (
							!!aInstance.autorisations &&
							!!aInstance.autorisations.modifierCoefficientGeneral
						) {
							lEstEditable =
								aInstance.Service && !!aInstance.Service.estUnService;
						}
					}
					return !lEstEditable;
				},
			},
			estCbBonusMalusVisible() {
				return !!aInstance.afficherBonusMalus;
			},
			cbBonusMalus: {
				getValue() {
					return (
						!!aInstance.Service &&
						!!aInstance.Service.periode &&
						!!aInstance.Service.periode.avecBonusMalus
					);
				},
				setValue(aValeur) {
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						aInstance.Service.periode.avecBonusMalus = aValeur;
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.callback.appel();
					}
				},
				getDisabled() {
					let lEstEditable = false;
					if (!aInstance.cloture && !!aInstance.Actif) {
						if (
							!!aInstance.autorisations &&
							!!aInstance.autorisations.modifierParametresServices
						) {
							lEstEditable = true;
						}
					}
					return !lEstEditable;
				},
			},
			estCbDevoirSuperieurMoyenneVisible() {
				return !!aInstance.afficherDevoirSuperieurMoyenne;
			},
			cbAvecDevoirSuperieurMoyenne: {
				getValue() {
					return (
						!!aInstance.Service &&
						!!aInstance.Service.periode &&
						!!aInstance.Service.periode.avecDevoirSupMoy
					);
				},
				setValue(aValeur) {
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						aInstance.Service.periode.avecDevoirSupMoy = aValeur;
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.callback.appel();
					}
				},
				getDisabled() {
					let lEstEditable = false;
					if (!aInstance.cloture && !!aInstance.Actif) {
						if (
							!!aInstance.autorisations &&
							!!aInstance.autorisations.modifierParametresServices
						) {
							lEstEditable = true;
						}
					}
					return !lEstEditable;
				},
			},
			cbPonderationNote: {
				getValue(aEstPonderationPlusHaute) {
					let lEstActive = false;
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						if (aEstPonderationPlusHaute) {
							lEstActive = !!aInstance.Service.periode.avecPonderationPlusHaute;
						} else {
							lEstActive = !!aInstance.Service.periode.avecPonderationPlusBasse;
						}
					}
					return lEstActive;
				},
				setValue(aEstPonderationPlusHaute, aValeur) {
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						if (aEstPonderationPlusHaute) {
							aInstance.Service.periode.avecPonderationPlusHaute = aValeur;
						} else {
							aInstance.Service.periode.avecPonderationPlusBasse = aValeur;
						}
						if (!aValeur) {
							if (aEstPonderationPlusHaute) {
								aInstance.Service.periode.ponderationNotePlusHaute =
									new TypeNote_1.TypeNote(1);
							} else {
								aInstance.Service.periode.ponderationNotePlusBasse =
									new TypeNote_1.TypeNote(1);
							}
						}
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						let lExecuteCallback = true;
						if (!!aValeur) {
							let lNotePonderation;
							if (aEstPonderationPlusHaute) {
								lNotePonderation =
									aInstance.Service.periode.ponderationNotePlusHaute;
							} else {
								lNotePonderation =
									aInstance.Service.periode.ponderationNotePlusBasse;
							}
							const lValeurPonderation = !!lNotePonderation
								? lNotePonderation.getValeur()
								: 1;
							if (lValeurPonderation === 1) {
								lExecuteCallback = false;
							}
						}
						if (lExecuteCallback) {
							aInstance.callback.appel();
						}
					}
				},
				getDisabled() {
					return aInstance.getCheckboxesPonderationDisabled();
				},
			},
			estInputPonderationNoteVisible(aEstPonderationPlusHaute) {
				let lEstPonderationActive = false;
				if (!!aInstance.Service && !!aInstance.Service.periode) {
					if (aEstPonderationPlusHaute) {
						lEstPonderationActive =
							!!aInstance.Service.periode.avecPonderationPlusHaute;
					} else {
						lEstPonderationActive =
							!!aInstance.Service.periode.avecPonderationPlusBasse;
					}
				}
				return lEstPonderationActive;
			},
			inputPonderationNote: {
				getNote(aEstPonderationPlusHaute) {
					let lNote = null;
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						if (aEstPonderationPlusHaute) {
							lNote = aInstance.Service.periode.ponderationNotePlusHaute;
						} else {
							lNote = aInstance.Service.periode.ponderationNotePlusBasse;
						}
					}
					return lNote;
				},
				setNote(aEstPonderationPlusHaute, aValue) {
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						if (aEstPonderationPlusHaute) {
							aInstance.Service.periode.ponderationNotePlusHaute = aValue;
						} else {
							aInstance.Service.periode.ponderationNotePlusBasse = aValue;
						}
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.callback.appel();
					}
				},
				getOptionsNote() {
					return {
						avecVirgule: true,
						afficherAvecVirgule: true,
						hintSurErreur: true,
						avecAnnotation: false,
						sansNotePossible: false,
						min: 0,
						max: 99,
					};
				},
				getDisabled: function () {
					return aInstance.getCheckboxesPonderationDisabled();
				},
			},
			radioModeCalculMoyServicePere: {
				getValue(aModeCalculMoy) {
					const lEstMoyenneParSousMatiere =
						!!aInstance.Service &&
						!!aInstance.Service.periode &&
						!!aInstance.Service.periode.moyenneParSousMatiere;
					return (
						(aModeCalculMoy ===
							PanelDetailServiceNotation.ModeCalculMoyenneServicePere
								.MoyDesSousServices &&
							lEstMoyenneParSousMatiere) ||
						(aModeCalculMoy ===
							PanelDetailServiceNotation.ModeCalculMoyenneServicePere
								.MoyDesDevoirs &&
							!lEstMoyenneParSousMatiere)
					);
				},
				setValue(aModeCalculMoy, aValeur) {
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						let lEstMoyenneParSousMatiere;
						if (
							aModeCalculMoy ===
							PanelDetailServiceNotation.ModeCalculMoyenneServicePere
								.MoyDesSousServices
						) {
							lEstMoyenneParSousMatiere = !!aValeur;
						} else {
							lEstMoyenneParSousMatiere = !aValeur;
						}
						aInstance.Service.periode.moyenneParSousMatiere =
							lEstMoyenneParSousMatiere;
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.callback.appel();
						aInstance.actualiser();
					}
				},
				getDisabled() {
					let lEstEditable = false;
					if (!aInstance.cloture && !!aInstance.Actif) {
						if (
							!!aInstance.autorisations &&
							!!aInstance.autorisations.modifierParametresServices
						) {
							lEstEditable = !!aInstance.activerModeCalculMoyenne;
						}
					}
					return !lEstEditable;
				},
			},
			radioTypeMoyReferenceBulletin: {
				getValue(aTypeMoyenneReference) {
					const lEstMoyReferenceDeClasse =
						!!aInstance.Service &&
						!!aInstance.Service.periode &&
						!!aInstance.Service.periode.moyenneBulletinSurClasse;
					return (
						(aTypeMoyenneReference ===
							PanelDetailServiceNotation.TypeMoyReferenceBulletin
								.ElevesDuGroupe &&
							!lEstMoyReferenceDeClasse) ||
						(aTypeMoyenneReference ===
							PanelDetailServiceNotation.TypeMoyReferenceBulletin
								.ElevesDeMemeClasse &&
							!!lEstMoyReferenceDeClasse)
					);
				},
				setValue(aTypeMoyenneReference, aValeur) {
					if (!!aInstance.Service && !!aInstance.Service.periode) {
						let lEstMoyReferenceDeClasse;
						if (
							aTypeMoyenneReference ===
							PanelDetailServiceNotation.TypeMoyReferenceBulletin.ElevesDuGroupe
						) {
							lEstMoyReferenceDeClasse = !aValeur;
						} else {
							lEstMoyReferenceDeClasse = !!aValeur;
						}
						aInstance.Service.periode.moyenneBulletinSurClasse =
							lEstMoyReferenceDeClasse;
						aInstance.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						aInstance.callback.appel();
					}
				},
				getDisabled() {
					let lEstEditable = false;
					if (!aInstance.cloture && !!aInstance.Actif) {
						lEstEditable = true;
					}
					return !lEstEditable;
				},
			},
			radioTypeArrondi: {
				getValue(aGenreRessourceArrondi, aTypeArrondi) {
					let lEstRadioActive = false;
					const lElement = aInstance.Service
						? aInstance.Service
						: aInstance.module;
					if (!!lElement && !!lElement.periode) {
						const lGenreArrondi =
							lElement.periode.arrondis[aGenreRessourceArrondi].getGenre();
						lEstRadioActive = lGenreArrondi === aTypeArrondi;
					}
					return lEstRadioActive;
				},
				setValue(aGenreRessourceArrondi, aTypeArrondi) {
					const lElementConcerne = aInstance.Service
						? aInstance.Service
						: aInstance.module;
					if (!!lElementConcerne && !!lElementConcerne.periode) {
						lElementConcerne.periode.arrondis[aGenreRessourceArrondi].setGenre(
							aTypeArrondi,
						);
						lElementConcerne.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
						lElementConcerne.periode.setEtat(
							Enumere_Etat_1.EGenreEtat.Modification,
						);
						aInstance.callback.appel();
					}
				},
				getDisabled(aGenreRessourceArrondi) {
					let lEstEditable = false;
					if (!aInstance.cloture && !!aInstance.Actif) {
						if (
							!!aInstance.autorisations &&
							!!aInstance.autorisations.modifierParametresServices
						) {
							const lElementConcerne = aInstance.Service
								? aInstance.Service
								: aInstance.module;
							if (!!lElementConcerne && !!lElementConcerne.periode) {
								const lGenreArrondi =
									lElementConcerne.periode.arrondis[
										aGenreRessourceArrondi
									].getGenre();
								lEstEditable =
									lGenreArrondi !== Enumere_Arrondi_1.EGenreArrondi.sans;
							}
						}
					}
					return !lEstEditable;
				},
			},
		});
	}
	getCheckboxesPonderationDisabled() {
		let lEstEditable = false;
		if (!this.cloture && !!this.Actif) {
			if (
				!!this.autorisations &&
				!!this.autorisations.modifierParametresServices
			) {
				lEstEditable = true;
			}
		}
		return !lEstEditable;
	}
	setAutorisations(aAutorisations) {
		this.autorisations = $.extend({}, aAutorisations);
		this.autorisations.modifierCoefficient =
			this.autorisations.modifierParametresServices;
	}
	setDonnees(aAutorisations, APeriode, AService, aModule, aGenreRecherche) {
		this.setAutorisations(aAutorisations);
		this.Periode = APeriode;
		this.Service = AService;
		this.module = aModule;
		this.genreRecherche = aGenreRecherche;
		if (this.Periode && (this.module || this.Service)) {
			this.avecDonnees = true;
			if (this.Service && this.Service.periode) {
				this.Service.periode.avecPonderationPlusHaute =
					this.Service.periode.ponderationNotePlusHaute.getValeur() !== 1.0;
			}
			if (this.Service && this.Service.periode) {
				this.Service.periode.avecPonderationPlusBasse =
					this.Service.periode.ponderationNotePlusBasse.getValeur() !== 1.0;
			}
			this.listeArrondis = this.getListeArrondis();
		} else {
			this.avecDonnees = false;
		}
		this.actualiser();
	}
	setPanelDetailServiceActif(aActif, aCloture, aClotureGlobal) {
		this.Actif = aActif;
		this.cloture = aCloture;
		this.clotureGlobal = aClotureGlobal;
	}
	construireStructureAffichageAutre() {
		return this.composePage();
	}
	composeDevoirSupMoy() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model": "cbAvecDevoirSuperieurMoyenne",
						"ie-if": "estCbDevoirSuperieurMoyenneVisible",
					},
					this.getTraductionDevoirSupMoy(),
				),
			),
		);
		return H.join("");
	}
	composeBonusMalus() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model": "cbBonusMalus",
						"ie-display": "estCbBonusMalusVisible",
					},
					this.getTraductionBonusMalus(),
				),
			),
		);
		return H.join("");
	}
	composePonderation() {
		const T = [];
		T.push(
			'<fieldset id="',
			this.idPonderation,
			'" class="fiche-service-moyenne m-left">',
		);
		T.push("<legend>", this.getTraductionPonderer(), "</legend>");
		T.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain flex-center m-top-l" },
				IE.jsx.str(
					"ie-checkbox",
					{ "ie-model": "cbPonderationNote(true)" },
					this.getTraductionNotePlusHaute(),
				),
				IE.jsx.str("ie-inputnote", {
					"ie-model": "inputPonderationNote(true)",
					"ie-display": "estInputPonderationNoteVisible(true)",
					"aria-label": this.getTraductionNotePlusHaute(),
					class: "m-left-l",
					style: "width:4rem;",
				}),
			),
		);
		T.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ class: "flex-contain flex-center m-top-l" },
					IE.jsx.str(
						"ie-checkbox",
						{ "ie-model": "cbPonderationNote(false)" },
						this.getTraductionNotePlusBasse(),
					),
					IE.jsx.str("ie-inputnote", {
						"ie-model": "inputPonderationNote(false)",
						"ie-display": "estInputPonderationNoteVisible(false)",
						"aria-label": this.getTraductionNotePlusBasse(),
						class: "m-left-l",
						style: "width:4rem;",
					}),
				),
			),
		);
		T.push("</fieldset>");
		return T.join("");
	}
	composeSaisie(AId, AMessage) {
		const T = [];
		const lLabelFor = AId + "_Input";
		T.push(
			'<div id="',
			AId,
			'" class="full-width flex-contain flex-center flex-gap justify-between p-all">',
		);
		T.push(
			'<label class="fluid-bloc" for="',
			lLabelFor,
			'">',
			AMessage,
			"</label>",
		);
		T.push(
			'<input id="',
			AId,
			'_Input" type="text" class="AvecMain" style="width:50px;" onfocus="' +
				this.Nom +
				'.surSelection (id)" onblur="',
			this.Nom,
			".surVerification(id);",
			this.Nom,
			'.surDeselection(id);" onchange="' +
				this.Nom +
				'.surEdition (id)" onkeyup="' +
				this.Nom +
				'.surVerification (id)" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" />',
		);
		T.push("</div>");
		return T.join("");
	}
	surKeyDown(aEvent) {
		const lInstance = aEvent.data.instance;
		if (!lInstance.enEdition) {
			return;
		}
		if (aEvent.keyCode === ToucheClavier_1.ToucheClavier.RetourChariot) {
			lInstance.surEdition();
		}
	}
	surKeyPress(aEvent) {
		const lInstance = aEvent.data.instance;
		if (!lInstance.enEdition) {
			return true;
		}
		const lAvecLettre = false;
		const lAvecVirgule = TypeNote_1.TypeNote.avecVirgule();
		const lAvecMoins = false;
		if (
			!ObjetNavigateur_1.Navigateur.estCaractereNote(
				lAvecLettre,
				lAvecVirgule,
				lAvecMoins,
			)
		) {
			return false;
		}
	}
	surSelection(aId) {
		this.enEdition = true;
		this.idEdition = aId;
		if (aId === this.idCoefficientGeneral + "_Input") {
			this.note = this.Service.coefficientGeneral;
		}
		if (aId === this.idCoefficient + "_Input") {
			this.note = this.Service
				? this.Service.coefficientGeneral
				: this.module
					? this.module.coefficient
					: undefined;
		}
		ObjetHtml_1.GHtml.setSelectionEdit(aId);
	}
	surDeselection() {
		this.enEdition = false;
		this.idEdition = null;
		this.note = null;
	}
	surVerification(aId) {
		const lNote = new TypeNote_1.TypeNote(ObjetHtml_1.GHtml.getValue(aId));
		const lNoteMin = new TypeNote_1.TypeNote(0.0);
		const lNoteMax = new TypeNote_1.TypeNote(99.0);
		if (ObjetHtml_1.GHtml.getValue(aId) === "") {
			ObjetHtml_1.GHtml.setValue(aId, "0,00");
			ObjetHtml_1.GHtml.setSelectionEdit(aId);
		} else if (!lNote.estUneNoteValide(lNoteMin, lNoteMax, false)) {
			ObjetHtml_1.GHtml.setValue(aId, this.note.getNote());
			ObjetHtml_1.GHtml.setSelectionEdit(aId);
			(0, AccessApp_1.getApp)()
				.getMessage()
				.afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
					message: ObjetChaine_1.GChaine.format(
						this.getTraductionErreurSaisieNote(),
						[lNoteMin.getNote(), lNoteMax.getNote()],
					),
				});
		}
	}
	surEdition(aIdCourant) {
		if (this.Service) {
			if (this.Service.coefficientGeneral) {
				this.Service.coefficientGeneral = new TypeNote_1.TypeNote(
					ObjetHtml_1.GHtml.getValue(this.idCoefficientGeneral + "_Input"),
				);
			}
			this.Service.periode.coefficient = new TypeNote_1.TypeNote(
				ObjetHtml_1.GHtml.getValue(this.idCoefficient + "_Input"),
			);
			this.Service.periode.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this.Service.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		} else if (this.module) {
			this.module.coefficient = new TypeNote_1.TypeNote(
				ObjetHtml_1.GHtml.getValue(this.idCoefficient + "_Input"),
			);
			this.module.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		this.actualiser(aIdCourant);
		setTimeout(this.Nom + ".callback.appel ()", 50);
	}
	actualiserInput(aIdCourant, aId, aValeur) {
		if (!aIdCourant || aId === aIdCourant) {
			ObjetHtml_1.GHtml.setValue(aId + "_Input", aValeur);
		}
	}
	actualiser(aIdCourant) {
		this.activerModeCalculMoyenne = false;
		this.afficherCoefficientGeneral = false;
		this.afficherCoefficient = false;
		this.afficherModeCalculMoyenne = false;
		this.afficherMoyenneBulletin = false;
		this.afficherDevoirSuperieurMoyenne = false;
		this.afficherBonusMalus = false;
		this.afficherPonderation = false;
		this.afficherArrondis = false;
		this.afficherListePeriode = false;
		this.actualiserDroitAffichage();
		this.composeIdPeriode();
		if (this.avecDonnees) {
			this.setDisabled(
				this.idCoefficientGeneral + "_Input",
				this.cloture ||
					!this.Actif ||
					!this.autorisations.modifierCoefficientGeneral ||
					(this.Service &&
						(!this.Service.estUnService ||
							!this.Service.afficherCoefficientGeneral ||
							!this.Service.coefficientGeneral)),
			);
			this.setDisabled(
				this.idCoefficient + "_Input",
				this.cloture || !this.Actif || !this.autorisations.modifierCoefficient,
			);
			let lCoeffAffichage = this.Service
				? this.Service.periode.coefficient
					? this.Service.periode.coefficient.getNote()
					: ""
				: this.module.coefficient.getNote();
			if (lCoeffAffichage === "") {
				lCoeffAffichage = "x,xx";
			}
			this.actualiserInput(aIdCourant, this.idCoefficient, lCoeffAffichage);
			if (this.Service) {
				this.actualiserInput(
					aIdCourant,
					this.idCoefficientGeneral,
					this.Service.afficherCoefficientGeneral
						? this.Service.coefficientGeneral
							? this.Service.coefficientGeneral.getNote() || "x,xx"
							: "x,xx"
						: "",
				);
			}
			if (this.enEdition) {
				ObjetHtml_1.GHtml.setSelectionEdit(this.idEdition);
			}
			this.$refreshSelf();
		}
		this.setVisibleBlock();
	}
	setDisabled(aID, aValue) {
		ObjetHtml_1.GHtml.setDisabled(aID, aValue);
		ObjetHtml_1.GHtml.setAvecMain(aID, aValue);
	}
	composeIdPeriode() {
		ObjetHtml_1.GHtml.setHtml(this.IdPeriode, this.Periode.getLibelle());
	}
	setVisibleBlock() {
		ObjetStyle_1.GStyle.setVisible(
			this.idCoefficientGeneral,
			this.afficherCoefficientGeneral,
		);
		ObjetStyle_1.GStyle.setVisible(
			this.idCoefficient,
			this.afficherCoefficient,
		);
		ObjetStyle_1.GStyle.setVisible(
			this.idModeCalculMoyenne,
			this.afficherModeCalculMoyenne,
		);
		ObjetStyle_1.GStyle.setVisible(
			this.idMoyenneBulletin,
			this.afficherMoyenneBulletin,
		);
		ObjetStyle_1.GStyle.setVisible(
			this.idPonderation,
			this.afficherPonderation,
		);
		ObjetStyle_1.GStyle.setVisible(this.idArrondis, this.afficherArrondis);
	}
}
exports.PanelDetailServiceNotation = PanelDetailServiceNotation;
(function (PanelDetailServiceNotation) {
	let ModeCalculMoyenneServicePere;
	(function (ModeCalculMoyenneServicePere) {
		ModeCalculMoyenneServicePere[
			(ModeCalculMoyenneServicePere["MoyDesSousServices"] = 0)
		] = "MoyDesSousServices";
		ModeCalculMoyenneServicePere[
			(ModeCalculMoyenneServicePere["MoyDesDevoirs"] = 1)
		] = "MoyDesDevoirs";
	})(
		(ModeCalculMoyenneServicePere =
			PanelDetailServiceNotation.ModeCalculMoyenneServicePere ||
			(PanelDetailServiceNotation.ModeCalculMoyenneServicePere = {})),
	);
	let TypeMoyReferenceBulletin;
	(function (TypeMoyReferenceBulletin) {
		TypeMoyReferenceBulletin[(TypeMoyReferenceBulletin["ElevesDuGroupe"] = 0)] =
			"ElevesDuGroupe";
		TypeMoyReferenceBulletin[
			(TypeMoyReferenceBulletin["ElevesDeMemeClasse"] = 1)
		] = "ElevesDeMemeClasse";
	})(
		(TypeMoyReferenceBulletin =
			PanelDetailServiceNotation.TypeMoyReferenceBulletin ||
			(PanelDetailServiceNotation.TypeMoyReferenceBulletin = {})),
	);
})(
	PanelDetailServiceNotation ||
		(exports.PanelDetailServiceNotation = PanelDetailServiceNotation = {}),
);
