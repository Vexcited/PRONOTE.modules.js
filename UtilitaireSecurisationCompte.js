exports.UtilitaireSecurisationCompte = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetChoixStrategieSecurisation_1 = require("ObjetChoixStrategieSecurisation");
const ObjetSaisieCodePIN_1 = require("ObjetSaisieCodePIN");
const ObjetRequeteSecurisationCompte_1 = require("ObjetRequeteSecurisationCompte");
const TypeSecurisationCompte_1 = require("TypeSecurisationCompte");
const MethodesObjet_1 = require("MethodesObjet");
const ToucheClavier_1 = require("ToucheClavier");
const ObjetFenetre_SaisieMdpCP_1 = require("ObjetFenetre_SaisieMdpCP");
const ObjetChaine_1 = require("ObjetChaine");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const Enumere_Action_1 = require("Enumere_Action");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
var Etape;
(function (Etape) {
	Etape[(Etape["choixStrat"] = 0)] = "choixStrat";
	Etape[(Etape["PIN"] = 1)] = "PIN";
	Etape[(Etape["enregistrement"] = 2)] = "enregistrement";
})(Etape || (Etape = {}));
class ChaineEtape {
	constructor(aEtape) {
		this.etape = aEtape;
	}
	add(aEtape) {
		const lEtape = new ChaineEtape(aEtape);
		lEtape.precedent = this;
		this.suivant = lEtape;
		return lEtape;
	}
}
class UtilitaireSecurisationCompte {
	static async demarrerPersonnalisationMDP(aParam) {
		return await new Promise((aResolve) => {
			ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
				ObjetFenetre_SaisieMdpCP_1.ObjetFenetre_SaisieMdpCP,
				{
					pere: this,
					evenement(aReussite, aParamForcerMDP) {
						aResolve({ reussite: aReussite, paramForcerMDP: aParamForcerMDP });
					},
				},
				{
					titre: ObjetChaine_1.GChaine.insecable(
						ObjetTraduction_1.GTraductions.getValeur("saisieMDP.TitreFenetre"),
					),
					optionsMDP: {
						forcerModificationMdp: true,
						classRequeteSecurisation:
							ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationCompteDoubleAuth,
						actionRequeteSecurisation:
							TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
								.csch_VerifierMotDePassePersonnalise,
						messageExplication: aParam.messageForcerModificationMdp,
						setReglesMDP(aJSON) {
							GEtatUtilisateur.setReglesSaisieMotDePasse(aJSON);
						},
					},
				},
			).setDonnees(aParam.reglesSaisieMDP);
		});
	}
	static async demarrerDoubleAut(aDonnees) {
		const lResultAnnuler = { annuler: true };
		const lDonneesSecu = {};
		const lEstChoixStrategie = aDonnees.actionsDoubleAuth.contains(
			TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
				.AIHMSC_ChoixStrategie,
		);
		let lChaineEtape = null;
		const lChoixUnique = aDonnees.modesPossibles.count() === 1;
		if (lEstChoixStrategie) {
			lDonneesSecu.mode = this.initVerifierMode(aDonnees);
		}
		if (lEstChoixStrategie && !lChoixUnique) {
			lChaineEtape = new ChaineEtape(Etape.choixStrat);
			return await UtilitaireSecurisationCompte.suivant(
				aDonnees,
				lDonneesSecu,
				lChaineEtape,
			);
		}
		if (
			aDonnees.actionsDoubleAuth.contains(
				TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
					.AIHMSC_SaisieCodePINetSource,
			) ||
			(lChoixUnique &&
				aDonnees.modesPossibles.contains(
					TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
						.MGDA_SaisieCodePIN,
				))
		) {
			lChaineEtape = new ChaineEtape(Etape.PIN);
			lChaineEtape.add(Etape.enregistrement);
			return await UtilitaireSecurisationCompte.suivant(
				aDonnees,
				lDonneesSecu,
				lChaineEtape,
			);
		}
		if (
			aDonnees.actionsDoubleAuth.contains(
				TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
					.AIHMSC_SaisieSourcePourNotifSeulement,
			) ||
			(lChoixUnique &&
				aDonnees.modesPossibles.contains(
					TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
						.MGDA_NotificationSeulement,
				))
		) {
			lChaineEtape = new ChaineEtape(Etape.enregistrement);
			return await UtilitaireSecurisationCompte.suivant(
				aDonnees,
				lDonneesSecu,
				lChaineEtape,
			);
		}
		return lResultAnnuler;
	}
	static async suivant(aDonnees, aResultSecu, aChaineEtape) {
		const lPere = {};
		const lResultAnnuler = { annuler: true };
		if (!aChaineEtape) {
			return lResultAnnuler;
		}
		switch (aChaineEtape.etape) {
			case Etape.choixStrat: {
				const lResultFenetre =
					await ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_ChoixStrategie,
						{ pere: lPere },
					).setDonnees(aDonnees, aResultSecu);
				if (lResultFenetre.bouton && lResultFenetre.bouton.valider) {
					switch (aResultSecu.mode) {
						case TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
							.MGDA_SaisieCodePIN: {
							aChaineEtape.add(Etape.PIN).add(Etape.enregistrement);
							return await UtilitaireSecurisationCompte.suivant(
								aDonnees,
								aResultSecu,
								aChaineEtape.suivant,
							);
						}
						case TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
							.MGDA_NotificationSeulement: {
							aChaineEtape.add(Etape.enregistrement);
							return await UtilitaireSecurisationCompte.suivant(
								aDonnees,
								aResultSecu,
								aChaineEtape.suivant,
							);
						}
						case TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
							.MGDA_Inactive: {
							return { suivant: true, donnees: aResultSecu };
						}
						default: {
							throw new Error("Choix strategie inconnue");
						}
					}
				}
				break;
			}
			case Etape.PIN: {
				let lModePIN =
					ObjetSaisieCodePIN_1.ObjetSaisieCodePIN.ModeSaisieValiderPIN
						.ControlePIN;
				let lAvecReinitPIN = aDonnees.avecReinitPIN;
				let lTitre = ObjetTraduction_1.GTraductions.getValeur(
					"DoubleAuth.TitreValiderCodePIN",
				);
				let lLibelleBouton =
					ObjetTraduction_1.GTraductions.getValeur("Annuler");
				if (
					aDonnees.actionsDoubleAuth.contains(
						TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
							.AIHMSC_ChoixStrategie,
					)
				) {
					lModePIN =
						ObjetSaisieCodePIN_1.ObjetSaisieCodePIN.ModeSaisieValiderPIN
							.DefinirPIN;
					lAvecReinitPIN = false;
					lTitre = ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.RenforcerSecuDefinirPIN",
					);
					if (aChaineEtape.precedent) {
						lLibelleBouton =
							ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Retour");
					}
				}
				const lResultFenetrePIN =
					await ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_PIN,
						{ pere: lPere },
						{ titre: lTitre, listeBoutons: [lLibelleBouton] },
					).setDonnees({
						modePIN: lModePIN,
						avecReinitPIN: lAvecReinitPIN,
						emailOcculte: aDonnees.emailOcculte,
					});
				if (lResultFenetrePIN.paramsPIN) {
					Object.assign(aResultSecu, lResultFenetrePIN.paramsPIN);
					return await UtilitaireSecurisationCompte.suivant(
						aDonnees,
						aResultSecu,
						aChaineEtape.suivant,
					);
				}
				if (aChaineEtape.precedent) {
					return await UtilitaireSecurisationCompte.suivant(
						aDonnees,
						aResultSecu,
						aChaineEtape.precedent,
					);
				}
				break;
			}
			case Etape.enregistrement: {
				let lAvecRetour = false;
				if (
					aDonnees.actionsDoubleAuth.contains(
						TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
							.AIHMSC_ChoixStrategie,
					) &&
					aChaineEtape.precedent
				) {
					lAvecRetour = true;
				}
				const lResultFenetreEnregistrement =
					await ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
						ObjetFenetre_Enregistrement,
						{ pere: lPere },
					).setDonnees(aDonnees, lAvecRetour);
				if (lResultFenetreEnregistrement.enregistrement) {
					Object.assign(
						aResultSecu,
						lResultFenetreEnregistrement.enregistrement,
					);
					return { suivant: true, donnees: aResultSecu };
				}
				if (
					aChaineEtape.precedent &&
					aChaineEtape.precedent.etape === Etape.choixStrat
				) {
					return await UtilitaireSecurisationCompte.suivant(
						aDonnees,
						aResultSecu,
						aChaineEtape.precedent,
					);
				}
				break;
			}
			default: {
				return lResultAnnuler;
			}
		}
		return lResultAnnuler;
	}
	static initVerifierMode(aDonnees) {
		let lResult;
		if (
			MethodesObjet_1.MethodesObjet.isNumber(aDonnees.modeSecurisationParDefaut)
		) {
			lResult = aDonnees.modeSecurisationParDefaut;
		}
		const lModesPossibles = aDonnees.modesPossibles;
		if (
			lResult ===
				TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
					.MGDA_PasEncoreChoisi ||
			!lModesPossibles.contains(lResult)
		) {
			TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentificationUtil.getOrdreModeDoubleAuth(
				aDonnees.modeSecurisationParDefaut,
			).every((aMode) => {
				if (aMode !== lResult && lModesPossibles.contains(aMode)) {
					lResult = aMode;
					return false;
				}
				return true;
			});
		}
		return lResult;
	}
}
exports.UtilitaireSecurisationCompte = UtilitaireSecurisationCompte;
const cLargeurFenetre = 450;
class ObjetFenetre_ChoixStrategie extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"DoubleAuth.RenforcerSecurite",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				{
					valider: true,
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
				},
			],
			largeur: cLargeurFenetre,
		});
	}
	construireInstances() {
		this.identChoixStrategie = this.add(
			ObjetChoixStrategieSecurisation_1.ObjetChoixStrategieSecurisation,
		);
	}
	async setDonnees(aDonnees, aResultSecu) {
		const lParamsStrat = { mode: aResultSecu.mode };
		const lResultPromise = super.afficher(
			IE.jsx.str("div", {
				id: this.getInstance(this.identChoixStrategie).getNom(),
			}),
		);
		this.getInstance(this.identChoixStrategie)
			.setOptions({
				modeAffichage:
					ObjetChoixStrategieSecurisation_1.ObjetChoixStrategieSecurisation
						.typeAffichage.securisation,
				modesPossibles: aDonnees.modesPossibles,
				modeSecurisationParDefaut: aDonnees.modeSecurisationParDefaut,
				callbackChoix: (aGenre) => {
					lParamsStrat.mode = aGenre;
				},
			})
			.setDonnees(lParamsStrat);
		const lResult = await lResultPromise;
		if (lResult.bouton && lResult.bouton.valider) {
			aResultSecu.mode = lParamsStrat.mode;
		}
		return lResult;
	}
}
class ObjetFenetre_PIN extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			addParametresValidation: () => {
				return { paramsPIN: this.paramsPIN };
			},
		});
	}
	construireInstances() {
		this.identPIN = this.add(
			ObjetSaisieCodePIN_1.ObjetSaisieCodePIN,
			(aParams) => {
				if (aParams) {
					this.paramsPIN = aParams;
					this.surValidation(undefined);
				}
			},
		);
	}
	composeContenu() {
		return IE.jsx.str("div", { id: this.getInstance(this.identPIN).getNom() });
	}
	setDonnees(aOptions) {
		this.getInstance(this.identPIN)
			.setOptions(
				Object.assign(
					{
						classeRequete:
							ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationCompteDoubleAuth,
					},
					aOptions,
				),
			)
			.setDonnees({
				mode: TypeSecurisationCompte_1.TypeModeGestionDoubleAuthentification
					.MGDA_SaisieCodePIN,
			});
		return super.afficher();
	}
}
class ObjetFenetre_Enregistrement extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.cbIdentification = true;
		this.strIdentification = "";
		this.avecWarningIdentification = true;
		this.idInput = `${this.Nom}_inp`;
		this.setOptionsFenetre({
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Annuler"),
				{
					valider: true,
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
				},
			],
			largeur: cLargeurFenetre,
		});
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbIdentification: {
				getValue() {
					return aInstance.cbIdentification;
				},
				setValue(aValue) {
					aInstance.cbIdentification = aValue;
					if (
						aInstance.avecWarningIdentification &&
						!aInstance.cbIdentification
					) {
						aInstance.avecWarningIdentification = false;
						GApplication.getMessage().afficher({
							message:
								ObjetTraduction_1.GTraductions.getValeur(
									"DoubleAuth.EnregistrerAppareilResterInconnu",
								) +
								"<br>" +
								ObjetTraduction_1.GTraductions.getValeur(
									"DoubleAuth.PersonnesConfiance",
								),
						});
					}
				},
			},
			inputIdentification: {
				getValue() {
					return aInstance.strIdentification;
				},
				setValue(aValue) {
					aInstance.strIdentification = aValue;
				},
				getDisabled() {
					return !aInstance.cbIdentification;
				},
				node() {
					$(this.node).on("keyup", (aEvent) => {
						if (aEvent.which === ToucheClavier_1.ToucheClavier.RetourChariot) {
							for (
								let lNumeroBouton = 0;
								lNumeroBouton < aInstance.optionsFenetre.listeBoutons.length;
								lNumeroBouton++
							) {
								const lBouton =
									aInstance.optionsFenetre.listeBoutons[lNumeroBouton];
								if (typeof lBouton === "string") {
								} else if (lBouton.valider) {
									aInstance.surValidation(lNumeroBouton);
									return;
								}
							}
						}
					});
				},
			},
			getHtmlCompteurInput: function () {
				return aInstance.strIdentification.length > 0
					? aInstance.strIdentification.length +
							"/" +
							TypeSecurisationCompte_1.C_LibelleAppareilMaxLength
					: "&nbsp;";
			},
		});
	}
	compose() {
		if (!this.donnees) {
			return "";
		}
		const lIdLegende = `${this.Nom}_legendeCB`;
		const lIdCompteur = `${this.Nom}_compteurInput`;
		const lIdCB = `${this.Nom}_ccb`;
		const lAvecChoixStrategie = this.donnees.actionsDoubleAuth.contains(
			TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
				.AIHMSC_ChoixStrategie,
		);
		const lAvecChoixCodePIN = this.donnees.actionsDoubleAuth.contains(
			TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
				.AIHMSC_SaisieCodePINetSource,
		);
		return IE.jsx.str(
			"div",
			null,
			IE.jsx.str(
				"p",
				{ class: "m-bottom-xl", id: lIdLegende },
				!lAvecChoixStrategie && !lAvecChoixCodePIN
					? ObjetTraduction_1.GTraductions.getValeur(
							"DoubleAuth.EnregistrerAppareilRappelNotif",
						) + "<br>"
					: "",
				ObjetTraduction_1.GTraductions.getValeur(
					"DoubleAuth.EnregistrerAppareilInfoIdentification",
				),
			),
			IE.jsx.str(
				"ie-checkbox",
				{ id: lIdCB, "ie-model": "cbIdentification", class: "m-bottom-xl" },
				ObjetTraduction_1.GTraductions.getValeur(
					"DoubleAuth.EnregistrerAppareilNommerAppareil",
				),
			),
			IE.jsx.str(
				"div",
				{ class: false },
				IE.jsx.str(
					"label",
					{ for: this.idInput, class: "m-bottom-l" },
					ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.EnregistrerSousNom",
					),
					" :",
				),
				IE.jsx.str("input", {
					type: "text",
					id: this.idInput,
					"ie-model": "inputIdentification",
					class: "round-style full-width",
					maxlength: TypeSecurisationCompte_1.C_LibelleAppareilMaxLength,
					"ie-trim": true,
					autocomplete: "new-password",
					placeholder: ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.EnregistrerAppareilSuggestions",
					),
					"aria-describedby": [lIdCompteur, lIdLegende, lIdCB].join(" "),
				}),
				IE.jsx.str("div", {
					"ie-html": "getHtmlCompteurInput",
					class: "sc-compteurInput",
				}),
				IE.jsx.str(
					"span",
					{ class: "sr-only", id: lIdCompteur },
					ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.NbCaracteresMax_D",
						TypeSecurisationCompte_1.C_LibelleAppareilMaxLength,
					),
				),
				!lAvecChoixStrategie && GParametres.urlFAQEnregistrementDoubleAuth
					? IE.jsx.str(
							"ie-chips",
							{
								class: "iconic icon_question_sign",
								href: GParametres.urlFAQEnregistrementDoubleAuth,
							},
							ObjetTraduction_1.GTraductions.getValeur(
								"DoubleAuth.LienFAQEnregistrement",
							),
						)
					: "",
			),
		);
	}
	async setDonnees(aDonnees, aAvecRetour) {
		this.donnees = aDonnees;
		this.setOptionsFenetre({
			listeBoutons: [
				aAvecRetour
					? ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Retour")
					: ObjetTraduction_1.GTraductions.getValeur("DoubleAuth.Annuler"),
				{
					valider: true,
					libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
				},
			],
		});
		if (
			this.donnees.libelleSaisieExistant &&
			this.donnees.changementStrategieImpose
		) {
			this.strIdentification = this.donnees.libelleSaisieExistant;
		}
		const lAvecChoixStrategie = this.donnees.actionsDoubleAuth.contains(
			TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
				.AIHMSC_ChoixStrategie,
		);
		const lAvecChoixCodePIN = this.donnees.actionsDoubleAuth.contains(
			TypeSecurisationCompte_1.TypeActionIHMSecurisationCompte
				.AIHMSC_SaisieCodePINetSource,
		);
		this.setOptionsFenetre({
			titre:
				!lAvecChoixStrategie && !lAvecChoixCodePIN
					? ObjetTraduction_1.GTraductions.getValeur(
							"DoubleAuth.ValiderTitreInconnu",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"DoubleAuth.EnregistrerAppareilTitre",
						),
		});
		const lPromise = super.afficher(this.compose());
		$(`#${this.idInput.escapeJQ()}`).trigger("focus");
		const lResult = await lPromise;
		if (lResult.bouton && lResult.bouton.valider) {
			lResult.enregistrement = {
				avecIdentification: this.cbIdentification,
				strIdentification: this.strIdentification,
			};
		}
		return lResult;
	}
	async surValidation(ANumeroBouton) {
		const lParams = this.getParametresValidation(ANumeroBouton);
		if (lParams.bouton && lParams.bouton.valider) {
			if (this.cbIdentification && !this.strIdentification) {
				await GApplication.getMessage().afficher({
					message: ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.EnregistrerAppareilNomInvalide",
					),
				});
				this._focusInputIndentification();
				return;
			}
			if ((await this._controleNomUniquePromise()) !== true) {
				this._focusInputIndentification();
				return;
			}
		}
		super.surValidation(ANumeroBouton);
	}
	_focusInputIndentification() {
		$(`#${this.idInput.escapeJQ()}`).trigger("focus");
	}
	async _controleNomUniquePromise() {
		if (this.cbIdentification && this.strIdentification) {
			if (
				this.donnees.changementStrategieImpose &&
				this.strIdentification === this.donnees.libelleSaisieExistant
			) {
				return true;
			}
			const lJSON =
				await new ObjetRequeteSecurisationCompte_1.ObjetRequeteSecurisationCompteDoubleAuth(
					this,
				).lancerRequete({
					action:
						TypeSecurisationCompte_1.TypeCommandeSecurisationCompteHttp
							.csch_LibellesSourceConnexionDejaConnus,
					libelle: this.strIdentification,
				});
			if (lJSON && lJSON.dejaConnu) {
				if (this.donnees.changementStrategieImpose) {
					await GApplication.getMessage().afficher({
						message: ObjetTraduction_1.GTraductions.getValeur(
							"DoubleAuth.LibelleAppareilDejaUtilise",
						),
					});
					return false;
				}
				let lMessage = "";
				if (
					GApplication.estAppliMobile ||
					!GParametres.urlFAQEnregistrementDoubleAuth
				) {
					lMessage = ObjetTraduction_1.GTraductions.getValeur(
						"DoubleAuth.EnregistrerAppareilNomDejaUtilise",
					);
				} else {
					lMessage = IE.jsx.str(
						IE.jsx.fragment,
						null,
						ObjetTraduction_1.GTraductions.getValeur(
							"DoubleAuth.Message_SourceConnexion_1",
						),
						IE.jsx.str("br", null),
						IE.jsx.str("br", null),
						IE.jsx.str(
							"ul",
							{ class: "browser-default" },
							IE.jsx.str(
								"li",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"DoubleAuth.Message_SourceConnexion_2",
								),
								IE.jsx.str(
									"div",
									{ style: "font-style: italic; padding:.3rem 0 .5rem 0;" },
									ObjetTraduction_1.GTraductions.getValeur(
										"DoubleAuth.Message_SourceConnexion_3_S",
										[
											'<a href="' +
												GParametres.urlFAQEnregistrementDoubleAuth +
												'">' +
												ObjetTraduction_1.GTraductions.getValeur(
													"DoubleAuth.FAQEnregistrement",
												) +
												"</a>",
										],
									),
								),
							),
							IE.jsx.str(
								"li",
								null,
								ObjetTraduction_1.GTraductions.getValeur(
									"DoubleAuth.Message_SourceConnexion_4",
								),
							),
						),
					);
				}
				const lGenreAction = await GApplication.getMessage().afficher({
					type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
					message: lMessage,
					listeBoutons: [
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur("Annuler"),
							theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
						},
						{
							libelle: ObjetTraduction_1.GTraductions.getValeur("Valider"),
							theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
							genreAction: Enumere_Action_1.EGenreAction.Valider,
						},
					],
				});
				if (lGenreAction !== Enumere_Action_1.EGenreAction.Valider) {
					return false;
				}
			}
		}
		return true;
	}
}
