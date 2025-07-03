exports.PageFicheStage_Mobile = void 0;
const PageFicheStageCP_Mobile_1 = require("PageFicheStageCP_Mobile");
const UtilitaireFicheStage_1 = require("UtilitaireFicheStage");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetListe_1 = require("ObjetListe");
const DonneesListe_SuiviStage_1 = require("DonneesListe_SuiviStage");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetIdentite_1 = require("ObjetIdentite");
const Enumere_AffichageFicheStage_1 = require("Enumere_AffichageFicheStage");
const ObjetFenetre_1 = require("ObjetFenetre");
class PageFicheStage_Mobile extends PageFicheStageCP_Mobile_1.PageFicheStageCP_Mobile {
	creerInstanceListeSuivis() {
		return ObjetIdentite_1.Identite.creerInstance(ObjetListe_1.ObjetListe, {
			pere: this,
			evenement: this._evenementListeSuivis.bind(this),
		});
	}
	initialiserListeSuivis() {
		this.instanceListeSuivis.initialiser();
		this.instanceListeSuivis
			.setOptionsListe({
				colonnes: [{ id: "PageFicheStageMobile_ListeSuivis", taille: "100%" }],
				skin: ObjetListe_1.ObjetListe.skin.flatDesign,
				messageContenuVide: ObjetTraduction_1.GTraductions.getValeur(
					"FicheStage.listeSuivis.AucunSuivi",
				),
				avecOmbreDroite: true,
				hauteurZoneContenuListeMin: 200,
				avecLigneCreation: this.parametres.avecEditionSuivisDeStage,
				titreCreation: ObjetTraduction_1.GTraductions.getValeur(
					"FenetreSuiviStage.NouveauSuivi",
				),
			})
			.setDonnees(
				new DonneesListe_SuiviStage_1.DonneesListe_SuiviStage(
					this.donnees.suiviStage,
					this.parametres,
				),
			);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getInfoConvention: {
				event: function () {
					const T = [];
					let lIcon = "";
					let lInfoAcc = "";
					if (!!aInstance.donnees.convention) {
						aInstance.donnees.convention.roles.parcourir((aRole) => {
							if (aRole.aSignee) {
								lIcon = "icon_ok";
								lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
									"FicheStageCP.SigneePar",
								);
							} else {
								lIcon = "icon_remove";
								lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
									"FicheStageCP.NonSigneePar",
								);
							}
							let lLibelle = aRole.getLibelle();
							if (!aRole.signatureObligatoire) {
								lLibelle += ` (${ObjetTraduction_1.GTraductions.getValeur("FicheStageCP.Optionnel")})`;
							}
							T.push(
								IE.jsx.str(
									"div",
									{ class: "item-hint" },
									IE.jsx.str("i", {
										class: lIcon,
										role: "img",
										"ie-tooltiplabel": lInfoAcc,
									}),
									lLibelle,
								),
							);
						});
					} else {
						if (aInstance.donnees.conventionSigneeEleve) {
							lIcon = "icon_ok";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.SigneePar",
							);
						} else {
							lIcon = "icon_remove";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.NonSigneePar",
							);
						}
						T.push(
							IE.jsx.str(
								"div",
								{ class: "item-hint" },
								IE.jsx.str("i", {
									class: lIcon,
									role: "img",
									"ie-tooltiplabel": lInfoAcc,
								}),
								ObjetTraduction_1.GTraductions.getValeur("FicheStage.parEleve"),
							),
						);
						if (aInstance.donnees.conventionSigneeEntreprise) {
							lIcon = "icon_ok";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.SigneePar",
							);
						} else {
							lIcon = "icon_remove";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.NonSigneePar",
							);
						}
						T.push(
							IE.jsx.str(
								"div",
								{ class: "item-hint" },
								IE.jsx.str("i", {
									class: lIcon,
									role: "img",
									"ie-tooltiplabel": lInfoAcc,
								}),
								ObjetTraduction_1.GTraductions.getValeur(
									"FicheStage.parEntreprise",
								),
							),
						);
						if (aInstance.donnees.conventionSigneeEtablissement) {
							lIcon = "icon_ok";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.SigneePar",
							);
						} else {
							lIcon = "icon_remove";
							lInfoAcc = ObjetTraduction_1.GTraductions.getValeur(
								"FicheStageCP.NonSigneePar",
							);
						}
						T.push(
							IE.jsx.str(
								"div",
								{ class: "item-hint" },
								IE.jsx.str("i", {
									class: lIcon,
									role: "img",
									"ie-tooltiplabel": lInfoAcc,
								}),
								ObjetTraduction_1.GTraductions.getValeur(
									"FicheStage.parEtablissement",
								),
							),
						);
					}
					aInstance._getInfoConvention(
						IE.jsx.str("div", { class: "hint-convention" }, T.join("")),
					);
				},
			},
		});
	}
	setDonnees(aDonnees) {
		(this.parametres.listeSujetsStage = aDonnees.listeSujetsStage),
			super.setDonnees(aDonnees);
	}
	construireAffichage() {
		const H = [];
		switch (this.selectOngletStage) {
			case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Details:
				H.push('<div class="conteneur-FicheStage">');
				H.push(
					UtilitaireFicheStage_1.UtilitaireFicheStage.composeBlocDetails(
						this.donnees,
						{ parametres: this.parametres, controleur: this.controleur },
					),
				);
				H.push("</div>");
				break;
			case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Annexe:
				H.push('<div class="conteneur-FicheStage">');
				H.push(
					UtilitaireFicheStage_1.UtilitaireFicheStage.composeBlocAnnexe(
						this.donnees,
						{ parametres: this.parametres, controleur: this.controleur },
					),
				);
				H.push("</div>");
				break;
			case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage.Suivi: {
				let lConventionEtiquette = "";
				let lCpt = 0;
				let lNrMax = 3;
				if (!!this.donnees.convention) {
					lNrMax = this.donnees.convention.roles.count();
					this.donnees.convention.roles.parcourir((aRole) => {
						if (aRole.aSignee) {
							lCpt++;
						}
					});
				} else {
					if (this.donnees.conventionSigneeEleve) {
						lCpt++;
					}
					if (this.donnees.conventionSigneeEntreprise) {
						lCpt++;
					}
					if (this.donnees.conventionSigneeEtablissement) {
						lCpt++;
					}
				}
				if (lCpt > 0) {
					lConventionEtiquette = IE.jsx.str(
						IE.jsx.fragment,
						null,
						IE.jsx.str(
							"ie-chips",
							{ class: "tag-style color-theme" },
							ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.conventionSignee",
							),
							" ",
							lCpt,
							"/",
							lNrMax,
						),
						IE.jsx.str("ie-btnicon", {
							class: "icon_question avecFond",
							"ie-model": "getInfoConvention",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"FicheStage.detailInfoSignatureConvention",
							),
						}),
					);
				} else {
					lConventionEtiquette = IE.jsx.str(
						"ie-chips",
						{ class: "tag-style" },
						ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.conventionNonSignee",
						),
					);
				}
				H.push(
					IE.jsx.str(
						"div",
						{ class: "onglet-suivi" },
						IE.jsx.str(
							"div",
							{ class: "conteneur-convention" },
							lConventionEtiquette,
						),
						IE.jsx.str("div", {
							class: "conteneur-liste-suivi",
							id: this.instanceListeSuivis.getNom(),
						}),
					),
				);
				break;
			}
			case Enumere_AffichageFicheStage_1.EGenreAffichageFicheStage
				.Appreciations:
				H.push('<div class="conteneur-FicheStage">');
				H.push(
					UtilitaireFicheStage_1.UtilitaireFicheStage.composeBlocAppreciations(
						this.donnees,
						{ parametres: this.parametres, controleur: this.controleur },
					),
				);
				H.push("</div>");
				break;
			default:
				break;
		}
		return H.join("");
	}
	actionSurValidation() {
		this.callback.appel();
	}
	_evenementListeSuivis(aParams) {
		switch (aParams.genreEvenement) {
			case Enumere_EvenementListe_1.EGenreEvenementListe.Creation:
				UtilitaireFicheStage_1.UtilitaireFicheStage.composeFenetreCreerSuivi(
					this,
				);
				break;
			case Enumere_EvenementListe_1.EGenreEvenementListe.Selection:
				this.callback.appel({ suivi: aParams.article });
				break;
		}
	}
	_getInfoConvention(aHtml) {
		const lFenetre = ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_1.ObjetFenetre,
			{
				pere: this,
				initialiser: function (aInstance) {
					aInstance.setOptionsFenetre({
						titre: ObjetTraduction_1.GTraductions.getValeur(
							"FicheStage.conventionSignee",
						),
					});
				},
			},
		);
		lFenetre.afficher(aHtml);
	}
}
exports.PageFicheStage_Mobile = PageFicheStage_Mobile;
