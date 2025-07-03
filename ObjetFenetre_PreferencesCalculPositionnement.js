exports.ObjetFenetre_PreferencesCalculPositionnement = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeModeCalculPositionnementService_1 = require("TypeModeCalculPositionnementService");
const TypeNote_1 = require("TypeNote");
const GUID_1 = require("GUID");
class ObjetFenetre_PreferencesCalculPositionnement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.estEnLectureSeule = false;
		this.avecDonneesModifiees = false;
		this.valeursParDefaut = {
			nombreDEvaluations: 5,
			pourcentagesDEvaluation: 10,
		};
		this.donneesModeCalcul = {
			dernieresEvaluations: {
				utiliserNb: true,
				nb: this.valeursParDefaut.nombreDEvaluations,
				pourcent: this.valeursParDefaut.pourcentagesDEvaluation,
			},
			meilleuresEvals: {
				utiliserNb: true,
				nb: this.valeursParDefaut.nombreDEvaluations,
				pourcent: this.valeursParDefaut.pourcentagesDEvaluation,
			},
		};
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
			),
			largeur: 500,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	getOptionsNoteNombre() {
		return this._getOptionsNoteNombre(999);
	}
	getOptionsNotePourcentage() {
		return this._getOptionsNoteNombre(99);
	}
	_getOptionsNoteNombre(aValeurMax) {
		return {
			avecVirgule: false,
			afficherAvecVirgule: false,
			hintSurErreur: true,
			avecAnnotation: false,
			sansNotePossible: false,
			textAlign: "center",
			min: 1,
			max: aValeurMax,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			radioChoixDernieresEvals: {
				getValue(aEstUtiliserNombre) {
					return (
						aInstance.donneesModeCalcul.dernieresEvaluations.utiliserNb ===
						aEstUtiliserNombre
					);
				},
				setValue(aEstUtiliserNombre, aValeur) {
					const lValue = aEstUtiliserNombre ? !!aValeur : !aValeur;
					if (
						aInstance.donneesModeCalcul.dernieresEvaluations.utiliserNb !==
						lValue
					) {
						aInstance.donneesModeCalcul.dernieresEvaluations.utiliserNb =
							aEstUtiliserNombre ? !!aValeur : !aValeur;
						aInstance.avecDonneesModifiees = true;
					}
				},
				getDisabled() {
					return aInstance.estEnLectureSeule;
				},
			},
			inputNbDernieresEvals: {
				getNote() {
					let lValeur = aInstance.donneesModeCalcul.dernieresEvaluations.nb;
					if (!lValeur) {
						lValeur = aInstance.valeursParDefaut.nombreDEvaluations;
					}
					return new TypeNote_1.TypeNote(lValeur);
				},
				setNote(aValue) {
					if (!aValue.estUneNoteVide()) {
						const lNouvelleValeur = aValue.getValeur();
						if (
							aInstance.donneesModeCalcul.dernieresEvaluations.nb !==
							lNouvelleValeur
						) {
							aInstance.donneesModeCalcul.dernieresEvaluations.nb =
								lNouvelleValeur;
							aInstance.avecDonneesModifiees = true;
						}
					}
				},
				getOptionsNote() {
					return aInstance.getOptionsNoteNombre();
				},
				getDisabled() {
					return (
						aInstance.estEnLectureSeule ||
						!aInstance.donneesModeCalcul.dernieresEvaluations.utiliserNb
					);
				},
			},
			inputPercentDernieresEvals: {
				getNote() {
					let lValeur =
						aInstance.donneesModeCalcul.dernieresEvaluations.pourcent;
					if (!lValeur) {
						lValeur = aInstance.valeursParDefaut.pourcentagesDEvaluation;
					}
					return new TypeNote_1.TypeNote(lValeur);
				},
				setNote(aValue) {
					if (!aValue.estUneNoteVide()) {
						const lNouvelleValeur = aValue.getValeur();
						if (
							aInstance.donneesModeCalcul.dernieresEvaluations.pourcent !==
							lNouvelleValeur
						) {
							aInstance.donneesModeCalcul.dernieresEvaluations.pourcent =
								lNouvelleValeur;
							aInstance.avecDonneesModifiees = true;
						}
					}
				},
				getOptionsNote() {
					return aInstance.getOptionsNotePourcentage();
				},
				getDisabled() {
					return (
						aInstance.estEnLectureSeule ||
						aInstance.donneesModeCalcul.dernieresEvaluations.utiliserNb
					);
				},
			},
			radioChoixMeilleuresEvals: {
				getValue(aEstUtiliserNombre) {
					return (
						aInstance.donneesModeCalcul.meilleuresEvals.utiliserNb ===
						aEstUtiliserNombre
					);
				},
				setValue(aEstUtiliserNombre, aValeur) {
					const lValue = aEstUtiliserNombre ? !!aValeur : !aValeur;
					if (
						aInstance.donneesModeCalcul.meilleuresEvals.utiliserNb !== lValue
					) {
						aInstance.donneesModeCalcul.meilleuresEvals.utiliserNb = lValue;
						aInstance.avecDonneesModifiees = true;
					}
				},
				getDisabled() {
					return aInstance.estEnLectureSeule;
				},
			},
			inputNbMeilleuresEvals: {
				getNote() {
					let lValeur = aInstance.donneesModeCalcul.meilleuresEvals.nb;
					if (!lValeur) {
						lValeur = aInstance.valeursParDefaut.nombreDEvaluations;
					}
					return new TypeNote_1.TypeNote(lValeur);
				},
				setNote(aValue) {
					if (!aValue.estUneNoteVide()) {
						const lNouvelleValeur = aValue.getValeur();
						if (
							aInstance.donneesModeCalcul.meilleuresEvals.nb !== lNouvelleValeur
						) {
							aInstance.donneesModeCalcul.meilleuresEvals.nb = lNouvelleValeur;
							aInstance.avecDonneesModifiees = true;
						}
					}
				},
				getOptionsNote() {
					return aInstance.getOptionsNoteNombre();
				},
				getDisabled() {
					return (
						aInstance.estEnLectureSeule ||
						!aInstance.donneesModeCalcul.meilleuresEvals.utiliserNb
					);
				},
			},
			inputPercentMeilleuresEvals: {
				getNote() {
					let lValeur = aInstance.donneesModeCalcul.meilleuresEvals.pourcent;
					if (!lValeur) {
						lValeur = aInstance.valeursParDefaut.pourcentagesDEvaluation;
					}
					return new TypeNote_1.TypeNote(lValeur);
				},
				setNote(aValue) {
					if (!aValue.estUneNoteVide()) {
						const lNouvelleValeur = aValue.getValeur();
						if (
							aInstance.donneesModeCalcul.meilleuresEvals.pourcent !==
							lNouvelleValeur
						) {
							aInstance.donneesModeCalcul.meilleuresEvals.pourcent =
								lNouvelleValeur;
							aInstance.avecDonneesModifiees = true;
						}
					}
				},
				getOptionsNote() {
					return aInstance.getOptionsNotePourcentage();
				},
				getDisabled() {
					return (
						aInstance.estEnLectureSeule ||
						aInstance.donneesModeCalcul.meilleuresEvals.utiliserNb
					);
				},
			},
		});
	}
	_composeSimulation(aTypeModeSimulation, aContenuSimulation) {
		const H = [];
		H.push(
			'<div class="NomSimulation">',
			TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementServiceUtil.getNomSimulation(
				aTypeModeSimulation,
			),
			"</div>",
		);
		H.push('<div class="TexteSimulation">', aContenuSimulation, "</div>");
		return H.join("");
	}
	getDetailSimu2() {
		const lIDLabel = GUID_1.GUID.getId();
		const lIDDescriptionDernieres = GUID_1.GUID.getId();
		const lIDDescriptionDerniersPourcents = GUID_1.GUID.getId();
		const H = [];
		H.push(
			'<div id="',
			lIDLabel,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.DescriptionMode2",
			),
			"</div>",
		);
		H.push('<div class="m-left-xl">');
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixDernieresEvals(true)">',
			'<ie-inputnote ie-model="inputNbDernieresEvals" aria-labelledby="',
			lIDLabel,
			'" aria-describedby="',
			lIDDescriptionDernieres,
			'" class="m-right"></ie-inputnote><span id="',
			lIDDescriptionDernieres,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.Dernieres",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixDernieresEvals(false)">',
			'<ie-inputnote ie-model="inputPercentDernieresEvals" aria-labelledby="',
			lIDLabel,
			'" aria-describedby="',
			lIDDescriptionDerniersPourcents,
			'" class="m-right"></ie-inputnote><span id="',
			lIDDescriptionDerniersPourcents,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.DerniersPourcents",
			),
			"</span>",
			"</ie-radio>",
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	getDetailSimu3() {
		const lIDLabel = GUID_1.GUID.getId();
		const lIDDescriptionMeilleures = GUID_1.GUID.getId();
		const lIDDescriptionMeilleursPourcents = GUID_1.GUID.getId();
		const H = [];
		H.push(
			'<div id="',
			lIDLabel,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.DescriptionMode3",
			),
			"</div>",
		);
		H.push('<div class="m-left-xl">');
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixMeilleuresEvals(true)">',
			'<ie-inputnote ie-model="inputNbMeilleuresEvals" aria-labelledby="',
			lIDLabel,
			'" aria-describedby="',
			lIDDescriptionMeilleures,
			'" class="m-right"></ie-inputnote><span id="',
			lIDDescriptionMeilleures,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.Meilleures",
			),
			"</span>",
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixMeilleuresEvals(false)">',
			'<ie-inputnote ie-model="inputPercentMeilleuresEvals" aria-labelledby="',
			lIDLabel,
			'" aria-describedby="',
			lIDDescriptionMeilleursPourcents,
			'" class=m-right"></ie-inputnote><span id="',
			lIDDescriptionMeilleursPourcents,
			'">',
			ObjetTraduction_1.GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.MeilleursPourcents",
			),
			"</span>",
			"</ie-radio>",
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	composeContenu() {
		const T = [];
		T.push("<ul>");
		const lDetailSimu1 = ObjetTraduction_1.GTraductions.getValeur(
			"TypeModeCalculPositionnementService.explication.ModeCalculDefaut",
		);
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService_1
					.TypeModeCalculPositionnementService.tMCPS_Defaut,
				lDetailSimu1,
			),
			"</li>",
		);
		const lDetailSimu2 = this.getDetailSimu2();
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService_1
					.TypeModeCalculPositionnementService.tMCPS_NDernieresEvals,
				lDetailSimu2,
			),
			"</li>",
		);
		const lDetailSimu3 = this.getDetailSimu3();
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService_1
					.TypeModeCalculPositionnementService.tMCPS_NMeilleursEvals,
				lDetailSimu3,
			),
			"</li>",
		);
		const lDetailSimu4 = ObjetTraduction_1.GTraductions.getValeur(
			"TypeModeCalculPositionnementService.explication.ModeCalculPonderationAutoProgressive",
		);
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService_1
					.TypeModeCalculPositionnementService.tMCPS_PonderationAutoProgressive,
				lDetailSimu4,
			),
			"</li>",
		);
		T.push("</ul>");
		return T.join("");
	}
	setDonneesModeCalcul(aDonneesModeCalcul) {
		this.avecDonneesModifiees = false;
		this.donneesModeCalcul = aDonneesModeCalcul;
	}
	setLectureSeule(aEstEnLectureSeule) {
		this.estEnLectureSeule = aEstEnLectureSeule;
	}
	surValidation() {
		this.fermer();
		if (this.avecDonneesModifiees && !this.estEnLectureSeule) {
			this.callback.appel(this.donneesModeCalcul);
		}
	}
}
exports.ObjetFenetre_PreferencesCalculPositionnement =
	ObjetFenetre_PreferencesCalculPositionnement;
