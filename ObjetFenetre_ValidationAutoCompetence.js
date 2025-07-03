exports.TypeEvenementValidationAutoCompetences =
	exports.ObjetFenetre_ValidationAutoCompetence = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetFenetre_1 = require("ObjetFenetre");
const Enumere_Onglet_1 = require("Enumere_Onglet");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetHint_1 = require("ObjetHint");
const ObjetRequeteValidationAutoCompetences_1 = require("ObjetRequeteValidationAutoCompetences");
const TypeModeCalculPositionnementService_1 = require("TypeModeCalculPositionnementService");
const ObjetJSON_1 = require("ObjetJSON");
const AccessApp_1 = require("AccessApp");
var TypeEvenementValidationAutoCompetences;
(function (TypeEvenementValidationAutoCompetences) {
	TypeEvenementValidationAutoCompetences["Saisie"] = "saisie";
	TypeEvenementValidationAutoCompetences["AfficherPreferencesCalcul"] =
		"afficherPrefCalcul";
})(
	TypeEvenementValidationAutoCompetences ||
		(exports.TypeEvenementValidationAutoCompetences =
			TypeEvenementValidationAutoCompetences =
				{}),
);
class ObjetFenetre_ValidationAutoCompetence extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.applicationSco = (0, AccessApp_1.getApp)();
		this.etatUtilisateurSco = this.applicationSco.getEtatUtilisateur();
		this.parametresSco = this.applicationSco.getObjetParametres();
		this.options = {
			estCompetenceNumerique: false,
			estPourLaClasse: false,
			estValidationCECRLDomaine: false,
			estValidationCECRLLV: false,
			avecChoixCalcul: false,
			mrFiche: null,
		};
		this.donnees = {
			palier: null,
			listePiliers: null,
			periode: null,
			service: null,
			listeEleves: null,
			modeCalcul:
				TypeModeCalculPositionnementService_1
					.TypeModeCalculPositionnementService.tMCPS_Defaut,
			donneesModeCalcul: null,
		};
		this.setOptionsFenetre({
			titre: this.getTitreObjetMessage.bind(this),
			largeur: 600,
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
			],
		});
	}
	jsxModelRadioChoixModeCalcul(aModeCalcul) {
		return {
			getValue: () => {
				return this.donnees.modeCalcul === aModeCalcul;
			},
			setValue: (aValue) => {
				this.donnees.modeCalcul = aModeCalcul;
				this.applicationSco.parametresUtilisateur.set(
					"CalculPositionnementEleveParClasse.ModeCalcul",
					aModeCalcul,
				);
			},
			getName: () => {
				return `${this.Nom}_ChoixModeCalcul`;
			},
		};
	}
	jsxModeleBoutonPreferencesCalcul() {
		return {
			event: () => {
				this.callback.appel(
					TypeEvenementValidationAutoCompetences.AfficherPreferencesCalcul,
				);
			},
			getTitle: () => {
				return ObjetTraduction_1.GTraductions.getValeur(
					"FenetrePreferencesCalculPositionnement.MesPreferencesCalculPos",
				);
			},
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			surRadioChoixModeCalcul: {
				getValue(aModeCalcul) {
					return aInstance.donnees.modeCalcul === aModeCalcul;
				},
				setValue(aModeCalcul) {
					aInstance.donnees.modeCalcul = aModeCalcul;
					aInstance.applicationSco.parametresUtilisateur.set(
						"CalculPositionnementEleveParClasse.ModeCalcul",
						aModeCalcul,
					);
				},
			},
			cbRemplacerExistants: {
				getValue() {
					return aInstance.etatUtilisateurSco.remplacerNiveauxDAcquisitions;
				},
				setValue(aValue) {
					aInstance.etatUtilisateurSco.remplacerNiveauxDAcquisitions = aValue;
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
	_getJSONMrFiche() {
		let lJsonMrFiche = null;
		if (!!this.options.mrFiche) {
			lJsonMrFiche = ObjetJSON_1.ObjetJSON.parse(this.options.mrFiche);
		}
		return lJsonMrFiche;
	}
	setOptions(aOptions) {
		Object.assign(this.options, aOptions);
		return this;
	}
	setDonnees(aDonnees) {
		Object.assign(this.donnees, aDonnees);
	}
	mettreAJourValeursDonneesCalcul() {
		this.$refreshSelf();
	}
	composeContenu() {
		const lMessage = [];
		const lStrDetailExplication = this.getStrDetailExplication();
		if (!!lStrDetailExplication) {
			lMessage.push("<div>", lStrDetailExplication, "</div>");
			const lOptionsLi = this.getTableauOptionsDetailCalcul();
			if (lOptionsLi.length > 0) {
				lMessage.push("<div>");
				lMessage.push('<ul class="browser-default">');
				for (let i = 0; i < lOptionsLi.length; i++) {
					lMessage.push("<li>", lOptionsLi[i], "</li>");
				}
				lMessage.push("</ul>");
				lMessage.push("</div>");
			}
		}
		const lStrDetailSuite = this.getStrDetailExplicationSuite();
		if (lStrDetailSuite.length > 0) {
			const lClasses = [];
			if (lMessage.length > 0) {
				lClasses.push("GrandEspaceHaut");
			}
			lMessage.push(
				`<div class="${lClasses.join(" ")}">${lStrDetailSuite}</div>`,
			);
		}
		if (
			this.options.avecChoixCalcul &&
			this.parametresSco.general.SansValidationNivIntermediairesDsValidAuto
		) {
			this.donnees.modeCalcul = this.applicationSco.parametresUtilisateur.get(
				"CalculPositionnementEleveParClasse.ModeCalcul",
			);
			if (!this.donnees.modeCalcul && this.donnees.modeCalcul !== 0) {
				this.donnees.modeCalcul =
					TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementService.tMCPS_Defaut;
			}
			this.donnees.donneesModeCalcul = {
				dernieresEvaluations: this.applicationSco.parametresUtilisateur.get(
					"CalculPositionnementEleveParClasse.NDernieresEvaluations",
				),
				meilleuresEvals: this.applicationSco.parametresUtilisateur.get(
					"CalculPositionnementEleveParClasse.NMeilleuresEvaluations",
				),
			};
			lMessage.push(
				IE.jsx.str(
					"div",
					{ class: "EspaceHaut10" },
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAuto.IndiquezModeCalcul",
					),
					IE.jsx.str("ie-btnicon", {
						style: "float: right;",
						"ie-model": this.jsxModeleBoutonPreferencesCalcul.bind(this),
						class: "icon_cog",
					}),
				),
			);
			lMessage.push('<div class="EspaceGauche">');
			for (const sModeCalcul in TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementServiceUtil.getListe()) {
				const lModeCalcul = parseInt(sModeCalcul);
				lMessage.push(
					IE.jsx.str(
						"div",
						{ class: "PetitEspaceHaut" },
						IE.jsx.str(
							"ie-radio",
							{
								class: "AlignementMilieuVertical",
								"ie-model": this.jsxModelRadioChoixModeCalcul.bind(
									this,
									lModeCalcul,
								),
							},
							TypeModeCalculPositionnementService_1.TypeModeCalculPositionnementServiceUtil.getLibelleComplet(
								lModeCalcul,
								this.donnees.donneesModeCalcul,
							),
						),
					),
				);
			}
			lMessage.push("</div>");
		} else {
			lMessage.push(
				IE.jsx.str(
					"div",
					{ class: "GrandEspaceHaut" },
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAuto.QuestionContinuer",
					),
				),
			);
		}
		lMessage.push(
			'<div class="m-top-xl m-left">',
			'<ie-checkbox ie-model="cbRemplacerExistants">',
			this.getMessageRemplacerExistants(),
			"</ie-checkbox>",
			"</div>",
		);
		const lJSONMrFiche = this._getJSONMrFiche();
		if (lJSONMrFiche) {
			lMessage.push(
				'<div class="EspaceHaut flex-contain flex-center">',
				"<span>",
				lJSONMrFiche.titre,
				"</span>",
				'<ie-btnicon class="MargeGauche icon_question bt-activable" ie-model="surAfficherMrFiche" title="',
				lJSONMrFiche.titre,
				'"></ie-btnicon>',
				"</div>",
			);
		}
		return lMessage.join("");
	}
	surValidation(aNumeroBouton) {
		if (aNumeroBouton === 1) {
			this.lancerRequeteSaisie();
		} else {
			this.fermer();
		}
	}
	lancerRequeteSaisie() {
		const lAvecService = [
			Enumere_Onglet_1.EGenreOnglet.BilanParDomaine,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		const lAvecPeriode = [
			Enumere_Onglet_1.EGenreOnglet.BilanFinDeCycle,
			Enumere_Onglet_1.EGenreOnglet.ReleveEvaluationsParClasse,
		].includes(this.etatUtilisateurSco.getGenreOnglet());
		const lPalier = !!this.donnees.palier
			? this.donnees.palier
			: this.etatUtilisateurSco.Navigation.getRessource(
					Enumere_Ressource_1.EGenreRessource.Palier,
				);
		const lListePiliers = !!this.donnees.listePiliers
			? this.donnees.listePiliers
			: this.etatUtilisateurSco.Navigation.getRessources(
					Enumere_Ressource_1.EGenreRessource.Pilier,
				);
		const lListeEleves = !!this.donnees.listeEleves
			? this.donnees.listeEleves
			: this.etatUtilisateurSco.Navigation.getRessources(
					Enumere_Ressource_1.EGenreRessource.Eleve,
				);
		let lService = null;
		if (lAvecService) {
			lService = !!this.donnees.service
				? this.donnees.service
				: this.etatUtilisateurSco.Navigation.getRessource(
						Enumere_Ressource_1.EGenreRessource.Service,
					);
		}
		let lPeriode = null;
		if (lAvecPeriode) {
			lPeriode = this.donnees.periode;
		}
		let lModeCalcul = null;
		if (this.options.avecChoixCalcul) {
			lModeCalcul = this.donnees.modeCalcul;
		}
		new ObjetRequeteValidationAutoCompetences_1.ObjetRequeteValidationAutoCompetences(
			this,
			this.surRequeteSaisie,
		).lancerRequete({
			palier: lPalier,
			listePiliers: lListePiliers,
			service: lService,
			periode: lPeriode,
			listeEleves: lListeEleves,
			modeCalcul: lModeCalcul,
			remplacerNiveauxDAcquisitions:
				this.etatUtilisateurSco.remplacerNiveauxDAcquisitions,
		});
	}
	surRequeteSaisie() {
		this.callback.appel(TypeEvenementValidationAutoCompetences.Saisie);
		this.fermer();
	}
	_estMultiDomaines() {
		return !!this.donnees.listePiliers && this.donnees.listePiliers.count() > 1;
	}
	getTitreObjetMessage() {
		let lTitre;
		if (!!this.options.estCompetenceNumerique) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"competences.fenetreValidationAuto.titre.validationAutoCN",
			);
		} else if (this._estMultiDomaines()) {
			if (!!this.options.estPourLaClasse) {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.titre.validationAutoDesComposantesDesClasses",
				);
			} else {
				lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.titre.validationAutoDesComposantes",
				);
			}
		}
		if (!lTitre) {
			lTitre = ObjetTraduction_1.GTraductions.getValeur(
				"competences.fenetreValidationAuto.titre.validationAuto",
			);
		}
		return lTitre;
	}
	getLibellesNiveauxAcquis() {
		const lLibelles = [];
		this.parametresSco.listeNiveauxDAcquisitions.parcourir((aNiveauGlobal) => {
			if (!!aNiveauGlobal && !!aNiveauGlobal.estAcqui) {
				lLibelles.push(aNiveauGlobal.getLibelle());
			}
		});
		return lLibelles.join(", ");
	}
	estPourPrimaire() {
		return this.etatUtilisateurSco.pourPrimaire();
	}
	getStrDetailExplication() {
		const H = [];
		if (
			this.options.estCompetenceNumerique ||
			this.options.estValidationCECRLLV
		) {
			if (!this.estPourPrimaire()) {
				H.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAuto.ExplicationCalculCN",
					),
				);
			}
		} else if (this.options.estValidationCECRLDomaine) {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.ExplicationCalculCECRLDomaine",
				),
			);
		} else {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.ExplicationCalcul",
				),
			);
		}
		return H.join("");
	}
	getTableauOptionsDetailCalcul() {
		const H = [];
		if (
			this.options.estCompetenceNumerique ||
			this.options.estValidationCECRLLV
		) {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.OptionNivAcquisCN",
					[this.getLibellesNiveauxAcquis()],
				),
			);
		} else if (!this.options.estValidationCECRLDomaine) {
			if (
				this.parametresSco.general.SansValidationNivIntermediairesDsValidAuto
			) {
				H.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAuto.CalculParEvaluations",
					),
				);
			} else {
				H.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAuto.CalculParNiveauxMaitrise",
					),
				);
			}
		}
		if (!this.donnees.periode || !this.donnees.periode.existeNumero()) {
			if (!this.options.estValidationCECRLDomaine) {
				if (
					!(this.options.estCompetenceNumerique && this.estPourPrimaire()) ||
					this.options.estValidationCECRLLV
				) {
					if (
						this.parametresSco.general
							.NeComptabiliserQueEvalsAnneeScoDsValidAuto
					) {
						H.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.fenetreValidationAuto.EvaluationsAnneeEnCours",
							),
						);
					} else {
						H.push(
							ObjetTraduction_1.GTraductions.getValeur(
								"competences.fenetreValidationAuto.EvaluationsCycle",
							),
						);
					}
				}
			}
		}
		if (
			!this.options.estValidationCECRLDomaine &&
			!this.options.estValidationCECRLLV &&
			!this.options.estCompetenceNumerique
		) {
			if (this.parametresSco.general.PondererMatieresSelonLeurCoeffDsDomaine) {
				H.push(
					ObjetTraduction_1.GTraductions.getValeur(
						"competences.fenetreValidationAuto.EnPonderantMatieres",
					),
				);
			}
		}
		return H;
	}
	getStrDetailExplicationSuite() {
		const H = [];
		if (
			this.options.estCompetenceNumerique ||
			this.options.estValidationCECRLLV
		) {
			H.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.ExplicationCalculAuto3CN",
				),
			);
		}
		return H.join("");
	}
	getMessageRemplacerExistants() {
		const lMessageRemplacerExistants = [];
		if (
			this.options.estCompetenceNumerique ||
			this.options.estValidationCECRLLV
		) {
			lMessageRemplacerExistants.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.RemplacerExistantsCN",
				),
			);
		} else {
			lMessageRemplacerExistants.push(
				ObjetTraduction_1.GTraductions.getValeur(
					"competences.fenetreValidationAuto.RemplacerExistants",
				),
			);
		}
		return lMessageRemplacerExistants.join("");
	}
}
exports.ObjetFenetre_ValidationAutoCompetence =
	ObjetFenetre_ValidationAutoCompetence;
