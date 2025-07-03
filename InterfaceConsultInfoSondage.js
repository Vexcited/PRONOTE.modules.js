exports.InterfaceConsultInfoSondage = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const MoteurInfoSondage_1 = require("MoteurInfoSondage");
const Enumere_StructureAffichage_1 = require("Enumere_StructureAffichage");
const ObjetHtml_1 = require("ObjetHtml");
const GUID_1 = require("GUID");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const EGenreEvntActu_1 = require("EGenreEvntActu");
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const ObjetDate_1 = require("ObjetDate");
const ObjetMenuCtxMixte_1 = require("ObjetMenuCtxMixte");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const AccessApp_1 = require("AccessApp");
const ObjetNavigateur_1 = require("ObjetNavigateur");
class InterfaceConsultInfoSondage extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idPage = GUID_1.GUID.getId();
		this.options = {
			avecRappelDescriptif: true,
			avecCmdMenuCtxMixte: !IE.estMobile,
			avecVisuResultats: !IE.estMobile,
			avecScrollZone: !IE.estMobile,
			avecMsgAucun: true,
			avecEditionActualite: false,
			evenementMenuContextuel: null,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAnnuler: {
				event: function () {
					aInstance.declencherCallback({
						actu: aInstance.donnee,
						genreEvnt: EGenreEvntActu_1.EGenreEvntActu.SurAnnulationSondage,
						param: { avecRecupDonnees: false },
					});
				},
				getDisabled: function () {
					return false;
				},
			},
			btnValider: {
				event: function () {
					aInstance._declencherClbckValidation(
						EGenreEvntActu_1.EGenreEvntActu.SurValidationSondage,
					);
				},
				getDisabled: function () {
					return false;
				},
			},
			surSaisieReponseTextuelle: {
				getValue: function (aIndice) {
					if (aInstance.options.avecEditionActualite) {
						return null;
					}
					const lQuestion = aInstance.donnee.listeQuestions.get(aIndice);
					return lQuestion.reponse.valeurReponse;
				},
				setValue: function (aIndice, aValue) {
					aInstance.surSaisieReponse(aIndice, aValue);
				},
				getDisabled: function () {
					return (
						aInstance.options.avecEditionActualite ||
						(0, AccessApp_1.getApp)().getModeExclusif()
					);
				},
			},
			btnVoirResultats: {
				event() {
					aInstance.declencherCallback({
						actu: aInstance.donnee,
						genreEvnt: EGenreEvntActu_1.EGenreEvntActu.SurVoirResultats,
					});
				},
			},
		});
	}
	declencherCallback(aParam) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(aParam.actu, aParam.genreEvnt, aParam.param);
		}
	}
	construireInstances() {
		this.identMenuCtxMixte = this.add(
			ObjetMenuCtxMixte_1.ObjetMenuCtxMixte,
			this._evntSurMenuCtxMixte.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure =
			Enumere_StructureAffichage_1.EStructureAffichage.Autre;
	}
	setDonnees(aParam, aAvecDateWidget) {
		if (
			this.donnee &&
			(!aParam.actualite ||
				!this.donnee.egalParNumeroEtGenre(aParam.actualite.getNumero()))
		) {
			UtilitaireSyntheseVocale_1.SyntheseVocale.forcerArretLecture();
		}
		this.donnee = aParam.actualite;
		this.options.avecMsgAucun = aParam.avecMsgAucun;
		if (this.donnee !== null && this.donnee !== undefined) {
			if (this.options.avecCmdMenuCtxMixte) {
				const lMenu = this.getInstance(
					this.identMenuCtxMixte,
				).getMenuContextuel();
				lMenu.vider();
				this.moteur.initCommandesMenuCtxDInfoSond(
					lMenu,
					this.donnee,
					this.options,
				);
			}
			ObjetHtml_1.GHtml.setHtml(
				this.idPage,
				this._construirePage(aAvecDateWidget),
				{ controleur: this.controleur },
			);
			if (this.options.avecCmdMenuCtxMixte) {
				this.getInstance(this.identMenuCtxMixte).initialiser();
			}
		} else {
			ObjetHtml_1.GHtml.setHtml(this.idPage, this._construirePageAucun(), {
				controleur: this.controleur,
			});
		}
	}
	setUtilitaires(aUtilitaires) {
		this.moteur = new MoteurInfoSondage_1.MoteurInfoSondage(aUtilitaires);
	}
	construireStructureAffichageAutre() {
		const H = [];
		H.push(
			'<div class="InterfaceConsultInfoSondage" id="',
			this.idPage,
			'"></div>',
		);
		return H.join("");
	}
	surKeyUpReponse(aIndice) {
		if (ObjetNavigateur_1.Navigateur.isToucheSelection()) {
			this.surSaisieReponse(aIndice);
		}
	}
	surSaisieReponse(aIndiceQuestion, aValeurReponse, aValeurCoche) {
		const lActualite = this.donnee;
		const lQuestion = lActualite.listeQuestions.get(aIndiceQuestion);
		if (this.moteur.estComposanteQuestTextuelle({ composante: lQuestion })) {
			if (aValeurReponse.length <= lQuestion.tailleReponse) {
				lQuestion.reponse.valeurReponse = aValeurReponse;
				lQuestion.reponse.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				lActualite.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
			} else {
				(0, AccessApp_1.getApp)()
					.getMessage()
					.afficher({
						type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Information,
						message: ObjetTraduction_1.GTraductions.getValeur(
							"actualites.TailleMaximale",
							[lQuestion.tailleReponse],
						),
					});
				ObjetHtml_1.GHtml.setValue(
					this.moteur.getIdReponse({
						instance: this,
						indice: aIndiceQuestion,
					}) + "_0",
					lQuestion.reponse.valeurReponse,
				);
			}
		}
		const lEstChoixUnique = this.moteur.estComposanteQuestChoixUnique({
			composante: lQuestion,
		});
		const lEstChoixMultiple = this.moteur.estComposanteQuestChoixMultiple({
			composante: lQuestion,
		});
		if (lEstChoixUnique || lEstChoixMultiple) {
			for (let I = 0; I < lQuestion.listeChoix.count(); I++) {
				const lIdReponse = this.moteur.getIdReponse({
					instance: this,
					indice: aIndiceQuestion,
				});
				const lChoixCorrespondant = lQuestion.listeChoix.get(I);
				if (lChoixCorrespondant && lChoixCorrespondant.estReponseLibre) {
					const lIdCoche = lIdReponse + "_" + I;
					if (!$("#" + lIdCoche.escapeJQ()).is(":checked")) {
						const lIdInputReponseLibre =
							this.moteur.getIdReponseInputTexteLibre(lIdReponse, I);
						lQuestion.reponse.valeurReponseLibre = "";
						$("#" + lIdInputReponseLibre.escapeJQ()).val(
							lQuestion.reponse.valeurReponseLibre,
						);
						$("#" + lIdInputReponseLibre.escapeJQ()).inputDisabled(true);
					}
				}
			}
			if (lEstChoixUnique) {
				lQuestion.reponse.valeurReponse.clear();
			}
			lQuestion.reponse.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			if (aValeurCoche) {
				lQuestion.reponse.valeurReponse.add(parseInt(aValeurReponse));
			} else {
				lQuestion.reponse.valeurReponse.remove(parseInt(aValeurReponse));
			}
			const lIndiceReponse = parseInt(aValeurReponse) - 1;
			const lChoixCorrespondant = lQuestion.listeChoix.get(lIndiceReponse);
			if (lChoixCorrespondant && lChoixCorrespondant.estReponseLibre) {
				const lIdReponse = this.moteur.getIdReponse({
					instance: this,
					indice: aIndiceQuestion,
				});
				const lIdInputReponseLibre = this.moteur.getIdReponseInputTexteLibre(
					lIdReponse,
					lIndiceReponse,
				);
				$("#" + lIdInputReponseLibre.escapeJQ()).inputDisabled(!aValeurCoche);
			}
			lQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lActualite.setEtat(Enumere_Etat_1.EGenreEtat.FilsModification);
			if (lEstChoixMultiple && lQuestion.avecMaximum) {
				const lNombreCoche = lQuestion.reponse.valeurReponse.count();
				let lID;
				if (lNombreCoche < lQuestion.nombreReponsesMax) {
					for (let I = 0; I < lQuestion.listeChoix.count(); I++) {
						lID =
							this.moteur.getIdReponse({
								instance: this,
								indice: aIndiceQuestion,
							}) +
							"_" +
							I;
						$("#" + lID.escapeJQ()).inputDisabled(false);
					}
				} else {
					for (let I = 0; I < lQuestion.listeChoix.count(); I++) {
						lID =
							this.moteur.getIdReponse({
								instance: this,
								indice: aIndiceQuestion,
							}) +
							"_" +
							I;
						let lIndiceIncremente = I + 1;
						const lValue =
							lQuestion.reponse.valeurReponse.contains(lIndiceIncremente);
						$("#" + lID.escapeJQ()).inputDisabled(!lValue);
					}
				}
			}
		}
		if (this.moteur.estComposanteAvecAR({ composante: lQuestion })) {
			lQuestion.reponse.valeurReponse = "";
			lQuestion.reponse.avecReponse = true;
			lQuestion.reponse.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lActualite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			this._declencherClbckValidation(EGenreEvntActu_1.EGenreEvntActu.SurAR);
		}
		lQuestion.reponse.avecReponse = true;
	}
	surSaisieReponseLibre(aIndiceQuestion, aTexteLibreSaisi) {
		const lActualite = this.donnee;
		const lQuestion = lActualite.listeQuestions.get(aIndiceQuestion);
		if (lQuestion && lQuestion.reponse) {
			lQuestion.reponse.valeurReponseLibre = aTexteLibreSaisi;
			lQuestion.reponse.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lQuestion.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
			lActualite.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
	}
	_declencherClbckValidation(aGenreEvnt) {
		if (this.donnee.aToutRepondu()) {
			this.donnee.lue = true;
		}
		this.declencherCallback({
			actu: this.donnee,
			genreEvnt: aGenreEvnt,
			param: { avecRecupDonnees: true },
		});
	}
	_evntSurMenuCtxMixte(aCmd) {
		this.declencherCallback({
			actu: this.donnee,
			genreEvnt: EGenreEvntActu_1.EGenreEvntActu.SurMenuCtxActu,
			param: { cmd: aCmd },
		});
	}
	_construirePage(aAvecDateWidget) {
		const H = [];
		if (this.options.avecCmdMenuCtxMixte) {
			H.push(
				'<div id="',
				this.getNomInstance(this.identMenuCtxMixte),
				'" class="info-sondage-menuCtxMixte"></div>',
			);
		}
		if (this.options.avecScrollZone) {
			H.push('<div class="zoneConsult_scroll">');
		}
		const lSyntheseVocale = () => {
			const H = [];
			if (this.donnee) {
				H.push(
					this.moteur.composeDescriptifLecture(
						this.donnee,
						!this.options.avecEditionActualite,
					),
				);
			}
			const lObj = { text: H.join(" ") };
			return lObj;
		};
		H.push(
			IE.jsx.str(
				"div",
				{ class: "zoneTotal", "ie-synthesevocale": lSyntheseVocale },
				(H) => {
					if (!aAvecDateWidget) {
						H.push(
							'<div class="zoneDescriptif">',
							this.options.avecRappelDescriptif
								? this.moteur.composeDescriptif({
										actualite: this.donnee,
										avecDate: true,
										avecEditionActualite: this.options.avecEditionActualite,
										avecTitre: true,
										avecDetailPublicSuccinct: false,
									})
								: "",
							"</div>",
						);
					}
					for (
						let i = 0, lNbr = this.donnee.listeQuestions.count();
						i < lNbr;
						i++
					) {
						const lQuestion = this.donnee.listeQuestions.get(i);
						H.push(
							'<div class="AvecSelectionTexte info-sondage-content ',
							i < lNbr - 1 ? "avecSuivant" : "",
							'">',
						);
						H.push(
							this.moteur.composeComposanteInfoSondage({
								instance: this,
								actu: this.donnee,
								composante: lQuestion,
								indice: i,
								avecLibelleQuestion: this.donnee.listeQuestions.count() > 1,
								estAffEditionActualite: this.options.avecEditionActualite,
							}),
						);
						H.push("</div>");
					}
					if (aAvecDateWidget) {
						H.push(
							'<div class="zoneDate">',
							ObjetTraduction_1.GTraductions.getValeur("Le"),
							" ",
							ObjetDate_1.GDate.formatDate(
								this.donnee.dateDebut,
								"%JJ/%MM/%AAAA",
							),
							"</div>",
						);
					}
				},
			),
		);
		if (
			this.donnee.estSondage &&
			!this.options.avecEditionActualite &&
			!(0, AccessApp_1.getApp)().getModeExclusif()
		) {
			H.push('<div class="zoneBtnsAction">');
			H.push(
				'<ie-bouton ie-model="btnAnnuler" class="' +
					Type_ThemeBouton_1.TypeThemeBouton.secondaire +
					' item">',
				ObjetTraduction_1.GTraductions.getValeur("Annuler"),
				"</ie-bouton>",
			);
			H.push(
				'<ie-bouton ie-model="btnValider" class="' +
					Type_ThemeBouton_1.TypeThemeBouton.primaire +
					' item">',
				ObjetTraduction_1.GTraductions.getValeur("Valider"),
				"</ie-bouton>",
			);
			H.push("</div>");
		}
		if (this.options.avecScrollZone) {
			H.push("</div>");
		}
		return H.join("");
	}
	_construirePageAucun() {
		const H = [];
		if (this.options.avecMsgAucun) {
			H.push(
				IE.jsx.str(
					"div",
					{ class: "message-vide" },
					IE.jsx.str(
						"div",
						{ class: "message" },
						ObjetTraduction_1.GTraductions.getValeur(
							"infoSond.msgAucunSelection",
						),
					),
					IE.jsx.str("div", { class: "Image_No_Data", "aria-hidden": "true" }),
				),
			);
		}
		return H.join("");
	}
}
exports.InterfaceConsultInfoSondage = InterfaceConsultInfoSondage;
