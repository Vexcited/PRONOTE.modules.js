const { ObjetFenetre } = require("ObjetFenetre.js");
const { GTraductions } = require("ObjetTraduction.js");
const {
	TypeModeCalculPositionnementService,
	TypeModeCalculPositionnementServiceUtil,
} = require("TypeModeCalculPositionnementService.js");
const { TypeNote } = require("TypeNote.js");
class ObjetFenetre_PreferencesCalculPositionnement extends ObjetFenetre {
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
			titre: GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
			),
			largeur: 500,
			listeBoutons: [GTraductions.getValeur("Fermer")],
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
		return $.extend(true, super.getControleur(this), {
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
					return new TypeNote(lValeur);
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
					return new TypeNote(lValeur);
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
					return new TypeNote(lValeur);
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
					return new TypeNote(lValeur);
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
			TypeModeCalculPositionnementServiceUtil.getNomSimulation(
				aTypeModeSimulation,
			),
			"</div>",
		);
		H.push('<div class="TexteSimulation">', aContenuSimulation, "</div>");
		return H.join("");
	}
	getDetailSimu2() {
		const H = [];
		H.push(
			"<div>",
			GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.DescriptionMode2",
			),
			"</div>",
		);
		H.push('<div class="m-left-xl">');
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixDernieresEvals(true)">',
			'<ie-inputnote ie-model="inputNbDernieresEvals" class="round-style m-right"></ie-inputnote>',
			GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.Dernieres",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixDernieresEvals(false)">',
			'<ie-inputnote ie-model="inputPercentDernieresEvals" class="round-style m-right"></ie-inputnote>',
			GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.DerniersPourcents",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	getDetailSimu3() {
		const H = [];
		H.push(
			"<div>",
			GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.DescriptionMode3",
			),
			"</div>",
		);
		H.push('<div class="m-left-xl">');
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixMeilleuresEvals(true)">',
			'<ie-inputnote ie-model="inputNbMeilleuresEvals" class="round-style m-right"></ie-inputnote>',
			GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.Meilleures",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push(
			'<div class="LigneSaisieValeurCalcul">',
			'<ie-radio ie-model="radioChoixMeilleuresEvals(false)">',
			'<ie-inputnote ie-model="inputPercentMeilleuresEvals" class="round-style m-right"></ie-inputnote>',
			GTraductions.getValeur(
				"FenetrePreferencesCalculPositionnement.MeilleursPourcents",
			),
			"</ie-radio>",
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
	composeContenu() {
		const T = [];
		T.push("<ul>");
		const lDetailSimu1 = GTraductions.getValeur(
			"TypeModeCalculPositionnementService.explication.ModeCalculDefaut",
		);
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService.tMCPS_Defaut,
				lDetailSimu1,
			),
			"</li>",
		);
		const lDetailSimu2 = this.getDetailSimu2();
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService.tMCPS_NDernieresEvals,
				lDetailSimu2,
			),
			"</li>",
		);
		const lDetailSimu3 = this.getDetailSimu3();
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService.tMCPS_NMeilleursEvals,
				lDetailSimu3,
			),
			"</li>",
		);
		const lDetailSimu4 = GTraductions.getValeur(
			"TypeModeCalculPositionnementService.explication.ModeCalculPonderationAutoProgressive",
		);
		T.push(
			"<li>",
			this._composeSimulation(
				TypeModeCalculPositionnementService.tMCPS_PonderationAutoProgressive,
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
		if (this.avecDonneesModifiees) {
			this.callback.appel(this.donneesModeCalcul);
		}
	}
}
module.exports = { ObjetFenetre_PreferencesCalculPositionnement };
