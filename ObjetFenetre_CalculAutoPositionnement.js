exports.ObjetFenetre_CalculAutoPositionnement =
	exports.TypeEvenementValidationAutoPositionnement = void 0;
const MethodesObjet_1 = require("MethodesObjet");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetDate_1 = require("ObjetDate");
const TypeModeCalculPositionnementService_1 = require("TypeModeCalculPositionnementService");
const TypeModeValidationAuto_1 = require("TypeModeValidationAuto");
const ObjetHint_1 = require("ObjetHint");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetRequeteValidationAutoPositionnement_1 = require("ObjetRequeteValidationAutoPositionnement");
const ObjetJSON_1 = require("ObjetJSON");
const AccessApp_1 = require("AccessApp");
var TypeEvenementValidationAutoPositionnement;
(function (TypeEvenementValidationAutoPositionnement) {
	TypeEvenementValidationAutoPositionnement["Saisie"] = "saisie";
	TypeEvenementValidationAutoPositionnement["AfficherPreferencesCalcul"] =
		"afficherPrefCalcul";
})(
	TypeEvenementValidationAutoPositionnement ||
		(exports.TypeEvenementValidationAutoPositionnement =
			TypeEvenementValidationAutoPositionnement =
				{}),
);
class ObjetFenetre_CalculAutoPositionnement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.appSco = (0, AccessApp_1.getApp)();
		this.etatUtilSco = this.appSco.getEtatUtilisateur();
		this.donneesAffichage = {
			messageRestrictionsSurCalculAuto: null,
			message: "",
			avecChoixCalcul: false,
			avecChoixPreferencesCalcul: false,
			mrFiche: null,
		};
		this.donnees = {
			borneDateDebut: null,
			borneDateFin: null,
			calculMultiServices: false,
			modeCalculPositionnement: null,
			modeValidationAuto: null,
			listeEleves: null,
			donneesModeCalcul: null,
		};
		this.setOptionsFenetre({
			largeur: 500,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	jsxModeleCheckboxRemplacerPositionnementsExistants() {
		return {
			getValue: () => {
				return this.etatUtilSco.remplacerNiveauxDAcquisitions;
			},
			setValue: (aValue) => {
				this.etatUtilSco.remplacerNiveauxDAcquisitions = aValue;
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getLibelleModeCalcul(aModeCalcul) {
				return TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementServiceUtil.getLibelleComplet(
					aModeCalcul,
					aInstance.donnees.donneesModeCalcul,
				);
			},
			btnAfficherPreferencesCalcul: {
				event() {
					aInstance.callback.appel(
						TypeEvenementValidationAutoPositionnement.AfficherPreferencesCalcul,
					);
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
					);
				},
			},
			surRadioChoixModeCalcul: {
				getValue(aModeCalcul) {
					return aInstance.donnees.modeCalculPositionnement === aModeCalcul;
				},
				setValue(aModeCalcul) {
					aInstance.donnees.modeCalculPositionnement = aModeCalcul;
					aInstance.appSco.parametresUtilisateur.set(
						"CalculPositionnementEleveParService.ModeCalcul",
						aInstance.donnees.modeCalculPositionnement,
					);
				},
			},
			surAfficherMrFiche: {
				event() {
					const lJSONMrFiche = aInstance._getJSONMrFiche();
					if (!!lJSONMrFiche) {
						ObjetHint_1.ObjetHint.start(lJSONMrFiche.html, { sansDelai: true });
					}
				},
			},
		});
	}
	_getDetailPointsCompetences() {
		let lDetailPointCompetences;
		const lListeGlobalNiveauxDAcquisitions =
			MethodesObjet_1.MethodesObjet.dupliquer(
				this.appSco.getObjetParametres().listeNiveauxDAcquisitions,
			);
		if (
			!!lListeGlobalNiveauxDAcquisitions &&
			lListeGlobalNiveauxDAcquisitions.count() > 0
		) {
			lDetailPointCompetences = [];
			lListeGlobalNiveauxDAcquisitions.parcourir((D) => {
				if (!!D.ponderation && D.ponderation.estUneValeur()) {
					lDetailPointCompetences.push(
						'<span class="InlineBlock AlignementDroit" style="' +
							ObjetStyle_1.GStyle.composeWidth(40) +
							'">' +
							D.ponderation.getNoteEntier() +
							" " +
							ObjetTraduction_1.GTraductions.getValeur("BulletinEtReleve.Pts") +
							"</span> : " +
							D.getLibelle(),
					);
				}
			});
		}
		return lDetailPointCompetences;
	}
	_getJSONMrFiche() {
		let lJsonMrFiche = null;
		if (!!this.donnees.modeValidationAuto) {
			let lMrFiche;
			if (!!this.donneesAffichage.mrFiche) {
				lMrFiche = this.donneesAffichage.mrFiche;
			} else {
				if (
					this.donnees.modeValidationAuto ===
					TypeModeValidationAuto_1.TypeModeValidationAuto
						.tmva_PosAvecNoteSelonEvaluation
				) {
					lMrFiche = ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MFicheCalculNoteAutomatique",
					);
				} else {
					lMrFiche = ObjetTraduction_1.GTraductions.getValeur(
						"BulletinEtReleve.MFichePostionnement",
					);
				}
			}
			lJsonMrFiche = ObjetJSON_1.ObjetJSON.parse(lMrFiche);
		}
		return lJsonMrFiche;
	}
	composeContenu() {
		const T = [];
		const lAvecMessageRestrictions =
			!!this.donneesAffichage.messageRestrictionsSurCalculAuto &&
			this.donneesAffichage.messageRestrictionsSurCalculAuto.length > 0;
		if (lAvecMessageRestrictions) {
			T.push(
				'<div class="Gras">',
				this.donneesAffichage.messageRestrictionsSurCalculAuto,
				"</div>",
			);
		}
		if (this.donneesAffichage.message) {
			T.push(
				"<div",
				lAvecMessageRestrictions ? ' class="EspaceHaut"' : "",
				">",
				this.donneesAffichage.message,
				"</div>",
			);
		} else {
			const lDetailPointCompetences = this._getDetailPointsCompetences();
			const lExplicationCalcul = this.donnees.calculMultiServices
				? ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAutoPositionnement.messageCalculTousServices",
					)
				: ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAutoPositionnement.message",
					);
			T.push(
				"<div",
				lAvecMessageRestrictions ? ' class="EspaceHaut"' : "",
				">",
				lExplicationCalcul,
				"</div>",
				'<div class="EspaceHaut">',
				"<div>",
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.detailPoints",
				),
				"</div>",
				!!lDetailPointCompetences
					? '<div class="EspaceGauche PetitEspaceHaut">' +
							lDetailPointCompetences.join(
								'</div><div class="EspaceGauche PetitEspaceHaut">',
							) +
							"</div>"
					: "",
				"</div>",
			);
		}
		if (!!this.donnees.borneDateDebut && !!this.donnees.borneDateFin) {
			T.push(
				'<div class="EspaceHaut">',
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.messageOptionnel",
					[
						ObjetDate_1.GDate.formatDate(
							this.donnees.borneDateDebut,
							"%JJ/%MM/%AAAA",
						),
						ObjetDate_1.GDate.formatDate(
							this.donnees.borneDateFin,
							"%JJ/%MM/%AAAA",
						),
					],
				),
				"</div>",
			);
		}
		this.donnees.modeCalculPositionnement =
			this.appSco.parametresUtilisateur.get(
				"CalculPositionnementEleveParService.ModeCalcul",
			);
		if (
			!this.donnees.modeCalculPositionnement &&
			this.donnees.modeCalculPositionnement !== 0
		) {
			this.donnees.modeCalculPositionnement =
				TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementService.tMCPS_Defaut;
		}
		if (this.donneesAffichage.avecChoixCalcul) {
			T.push(
				'<div class="EspaceHaut">',
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.indiquezModeCalculPositionnement",
				),
			);
			if (this.donneesAffichage.avecChoixPreferencesCalcul) {
				T.push(
					'<ie-btnicon style="float: right;" ie-model="btnAfficherPreferencesCalcul" class="icon_cog"></ie-btnicon>',
				);
			}
			T.push("</div>");
			this.donnees.donneesModeCalcul = {
				dernieresEvaluations: this.appSco.parametresUtilisateur.get(
					"CalculPositionnementEleveParService.NDernieresEvaluations",
				),
				meilleuresEvals: this.appSco.parametresUtilisateur.get(
					"CalculPositionnementEleveParService.NMeilleuresEvaluations",
				),
			};
			T.push('<div class="EspaceGauche">');
			for (const sModeCalcul in TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementServiceUtil.getListe()) {
				const lModeCalcul = parseInt(sModeCalcul);
				T.push(
					'<div class="PetitEspaceHaut">',
					'<ie-radio ie-html="getLibelleModeCalcul(',
					lModeCalcul,
					')" class="AlignementMilieuVertical" ie-model="surRadioChoixModeCalcul(',
					lModeCalcul,
					')">',
					"</ie-radio>",
					"</div>",
				);
			}
			T.push("</div>");
		} else {
			T.push(
				'<div class="EspaceHaut">',
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAutoPositionnement.voulezVousContinuer",
				),
				"</div>",
			);
		}
		let lLibelleRemplacerExistants;
		if (
			this.donnees.modeValidationAuto ===
			TypeModeValidationAuto_1.TypeModeValidationAuto
				.tmva_PosAvecNoteSelonEvaluation
		) {
			lLibelleRemplacerExistants = ObjetTraduction_1.GTraductions.getValeur(
				"competences.fenetreValidationAutoPositionnement.remplacerPositionnementsNote",
			);
		} else {
			lLibelleRemplacerExistants = ObjetTraduction_1.GTraductions.getValeur(
				"competences.fenetreValidationAutoPositionnement.remplacerPositionnementsExistants",
			);
		}
		T.push(
			IE.jsx.str(
				"div",
				{ class: "EspaceHaut10 EspaceGauche10" },
				IE.jsx.str(
					"ie-checkbox",
					{
						"ie-model":
							this.jsxModeleCheckboxRemplacerPositionnementsExistants.bind(
								this,
							),
					},
					lLibelleRemplacerExistants,
				),
			),
		);
		if (!!this.donnees.modeValidationAuto) {
			const lJsonMrFiche = this._getJSONMrFiche();
			T.push(
				'<div class="flex-contain flex-center">',
				"<span>",
				lJsonMrFiche.titre,
				"</span>",
				'<ie-btnicon class="MargeGauche icon_question bt-activable" ie-model="surAfficherMrFiche" title="',
				lJsonMrFiche.titre,
				'"></ie-btnicon>',
				"</div>",
			);
		}
		return T.join("");
	}
	setDonneesAffichage(aDonneesAffichage) {
		Object.assign(this.donneesAffichage, aDonneesAffichage);
	}
	setDonnees(aDonnees) {
		Object.assign(this.donnees, aDonnees);
	}
	mettreAJourValeursDonneesCalcul() {
		this.$refreshSelf();
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			this.lancerRequeteSaisie();
		} else {
			this.fermer();
		}
	}
	lancerRequeteSaisie() {
		let lService = !!this.donnees.calculMultiServices
			? null
			: this.etatUtilSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Service,
				);
		let lRessource = this.etatUtilSco.Navigation.getRessource(
			Enumere_Ressource_1.EGenreRessource.Classe,
		);
		if (
			lRessource !== null &&
			lRessource !== undefined &&
			lRessource.getNumero() === -1 &&
			lRessource.getGenre() === Enumere_Ressource_1.EGenreRessource.Aucune
		) {
			if (lService !== null && lService !== undefined) {
				let lGpeDuService = lService.groupe;
				if (lGpeDuService && lGpeDuService.existeNumero()) {
					lGpeDuService.Genre = Enumere_Ressource_1.EGenreRessource.Groupe;
					lRessource = lGpeDuService;
				} else {
					let lClasseDuService = lService.classe;
					if (lClasseDuService && lClasseDuService.existeNumero()) {
						lClasseDuService.Genre = Enumere_Ressource_1.EGenreRessource.Classe;
						lRessource = lClasseDuService;
					}
				}
			}
		}
		const lParamsSaisie = {
			periode: this.etatUtilSco.Navigation.getRessource(
				Enumere_Ressource_1.EGenreRessource.Periode,
			),
			calculMultiServices: !!this.donnees.calculMultiServices,
			service: lService,
			ressource: lRessource,
			remplacerPosExistants: this.etatUtilSco.remplacerNiveauxDAcquisitions,
			modeValidationAuto: this.donnees.modeValidationAuto,
			modeCalcul: this.donnees.modeCalculPositionnement,
			borneDateDebut: this.donnees.borneDateDebut,
			borneDateFin: this.donnees.borneDateFin,
		};
		if (!!this.donnees.listeEleves) {
			lParamsSaisie.listeEleves = this.donnees.listeEleves;
		}
		new ObjetRequeteValidationAutoPositionnement_1.ObjetRequeteValidationAutoPositionnement(
			this,
			this.surRequeteSaisieCalculAutoPositionnement,
		).lancerRequete(lParamsSaisie);
	}
	surRequeteSaisieCalculAutoPositionnement() {
		this.callback.appel(TypeEvenementValidationAutoPositionnement.Saisie);
		this.fermer();
	}
}
exports.ObjetFenetre_CalculAutoPositionnement =
	ObjetFenetre_CalculAutoPositionnement;
