const { ObjetInterface } = require("ObjetInterface.js");
const { MoteurInfoSondage } = require("MoteurInfoSondage.js");
const { EStructureAffichage } = require("Enumere_StructureAffichage.js");
const { GHtml } = require("ObjetHtml.js");
const { GUID } = require("GUID.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TypeThemeBouton } = require("Type_ThemeBouton.js");
const { EGenreEvntActu } = require("EGenreEvntActu.js");
const { EGenreEtat } = require("Enumere_Etat.js");
const { EGenreBoiteMessage } = require("Enumere_BoiteMessage.js");
const { GDate } = require("ObjetDate.js");
const { ObjetMenuCtxMixte } = require("ObjetMenuCtxMixte.js");
const { tag } = require("tag.js");
const { ObjetGalerieCarrousel } = require("ObjetGalerieCarrousel.js");
const { ObjetListeElements } = require("ObjetListeElements.js");
const { ObjetElement } = require("ObjetElement.js");
const { TypeGenreMiniature } = require("TypeGenreMiniature.js");
const { SyntheseVocale } = require("UtilitaireSyntheseVocale.js");
class InterfaceConsultInfoSondage extends ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		this.idPage = GUID.getId();
		this.options = {
			avecRappelDescriptif: true,
			avecCmdMenuCtxMixte: !IE.estMobile,
			avecVisuResultats: !IE.estMobile,
			avecScrollZone: !IE.estMobile,
			avecMsgAucun: true,
		};
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			btnAnnuler: {
				event: function () {
					this.declencherCallback({
						actu: this.donnee,
						genreEvnt: EGenreEvntActu.SurAnnulationSondage,
						param: { avecRecupDonnees: false },
					});
				}.bind(aInstance),
				getDisabled: function () {
					return false;
				},
			},
			btnValider: {
				event: function () {
					_declencherClbckValidation.call(
						this,
						EGenreEvntActu.SurValidationSondage,
					);
				}.bind(aInstance),
				getDisabled: function () {
					return false;
				},
			},
			surSaisieReponseTextuelle: {
				getValue: function (aIndice) {
					if (this.options.avecEditionActualite) {
						return null;
					}
					const lQuestion = this.donnee.listeQuestions.get(aIndice);
					return lQuestion.reponse.valeurReponse;
				}.bind(aInstance),
				setValue: function (aIndice, aValue) {
					aInstance.surSaisieReponse(aIndice, aValue);
				},
				getDisabled: function () {
					return (
						aInstance.options.avecEditionActualite ||
						GApplication.getModeExclusif()
					);
				},
			},
			btnVoirResultats: {
				event() {
					aInstance.declencherCallback({
						actu: aInstance.donnee,
						genreEvnt: EGenreEvntActu.SurVoirResultats,
					});
				},
			},
			getCarrouselInfoSondage(aNumeroInfoSondage) {
				return {
					class: ObjetGalerieCarrousel,
					pere: aInstance,
					init: (aCarrousel) => {
						aCarrousel.setOptions({
							dimensionPhoto: 300,
							nbMaxDiaposEnZoneVisible: 10,
							justifieAGauche: true,
							sansBlocLibelle: true,
							altImage: GTraductions.getValeur("infoSond.altImgViewer"),
						});
						aCarrousel.initialiser();
					},
					start: (aCarrousel) => {
						const lComposante =
							aInstance.donnee.listeQuestions.getElementParNumero(
								aNumeroInfoSondage,
							);
						const lListeDiapos = new ObjetListeElements();
						if (lComposante && lComposante.listePiecesJointes) {
							lComposante.listePiecesJointes.parcourir((aPJ) => {
								if (aPJ.avecMiniaturePossible) {
									let lDiapo = new ObjetElement();
									lDiapo.setLibelle(aPJ.getLibelle());
									aPJ.miniature = TypeGenreMiniature.GM_600;
									lDiapo.documentCasier = aPJ;
									lListeDiapos.add(lDiapo);
								}
							});
						}
						aCarrousel.setDonnees({ listeDiapos: lListeDiapos });
					},
				};
			},
			lireTexte: function () {
				const H = [];
				if (aInstance.donnee) {
					H.push(
						aInstance.moteur.composeDescriptifLecture(
							aInstance.donnee,
							!aInstance.options.avecEditionActualite,
						),
					);
				}
				const lObj = { text: H.join(" ") };
				return lObj;
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
			ObjetMenuCtxMixte,
			_evntSurMenuCtxMixte.bind(this),
		);
	}
	setParametresGeneraux() {
		this.GenreStructure = EStructureAffichage.Autre;
	}
	setOptions(aParam) {
		$.extend(this.options, aParam);
	}
	setDonnees(aParam, aAvecDateWidget) {
		if (
			this.donnee &&
			(!aParam.actualite ||
				!this.donnee.egalParNumeroEtGenre(aParam.actualite.getNumero()))
		) {
			SyntheseVocale.forcerArretLecture();
		}
		this.donnee = aParam.actualite;
		this.options.avecMsgAucun = aParam.avecMsgAucun;
		if (this.donnee !== null && this.donnee !== undefined) {
			if (this.options.avecCmdMenuCtxMixte) {
				const lMenu = this.getInstance(this.identMenuCtxMixte).menuContextuel;
				lMenu.vider();
				this.moteur.initCommandesMenuCtxDInfoSond(
					lMenu,
					this.donnee,
					this.options,
				);
			}
			GHtml.setHtml(this.idPage, _construirePage.call(this, aAvecDateWidget), {
				controleur: this.controleur,
			});
			if (this.options.avecCmdMenuCtxMixte) {
				this.getInstance(this.identMenuCtxMixte).initialiser();
			}
		} else {
			GHtml.setHtml(this.idPage, _construirePageAucun.call(this), {
				controleur: this.controleur,
			});
		}
	}
	setUtilitaires(aUtilitaires) {
		this.moteur = new MoteurInfoSondage(aUtilitaires);
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
		if (GNavigateur.isToucheSelection()) {
			this.surSaisieReponse(aIndice);
		}
	}
	surSaisieReponse(aIndiceQuestion, aValeurReponse, aValeurCoche) {
		const lActualite = this.donnee;
		const lQuestion = lActualite.listeQuestions.get(aIndiceQuestion);
		if (this.moteur.estComposanteQuestTextuelle({ composante: lQuestion })) {
			if (aValeurReponse.length <= lQuestion.tailleReponse) {
				lQuestion.reponse.valeurReponse = aValeurReponse;
				lQuestion.reponse.setEtat(EGenreEtat.Modification);
				lQuestion.setEtat(EGenreEtat.Modification);
				lActualite.setEtat(EGenreEtat.FilsModification);
			} else {
				GApplication.getMessage().afficher({
					type: EGenreBoiteMessage.Information,
					message: GTraductions.getValeur("actualites.TailleMaximale", [
						lQuestion.tailleReponse,
					]),
				});
				GHtml.setValue(
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
				lQuestion.reponse.valeurReponse.vider();
			}
			lQuestion.reponse.setEtat(EGenreEtat.Modification);
			lQuestion.reponse.valeurReponse.setValeur(aValeurCoche, aValeurReponse);
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
			lQuestion.setEtat(EGenreEtat.Modification);
			lActualite.setEtat(EGenreEtat.FilsModification);
			if (lEstChoixMultiple && lQuestion.avecMaximum) {
				const lNombreCoche = lQuestion.reponse.valeurReponse.getNbrValeurs();
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
						const lValue = lQuestion.reponse.valeurReponse.getValeur(I + 1);
						$("#" + lID.escapeJQ()).inputDisabled(!lValue);
					}
				}
			}
		}
		if (this.moteur.estComposanteAvecAR({ composante: lQuestion })) {
			lQuestion.reponse.valeurReponse = "";
			lQuestion.reponse.avecReponse = true;
			lQuestion.reponse.setEtat(EGenreEtat.Modification);
			lQuestion.setEtat(EGenreEtat.Modification);
			lActualite.setEtat(EGenreEtat.Modification);
			_declencherClbckValidation.call(this, EGenreEvntActu.SurAR);
		}
		lQuestion.reponse.avecReponse = true;
	}
	surSaisieReponseLibre(aIndiceQuestion, aTexteLibreSaisi) {
		const lActualite = this.donnee;
		const lQuestion = lActualite.listeQuestions.get(aIndiceQuestion);
		if (lQuestion && lQuestion.reponse) {
			lQuestion.reponse.valeurReponseLibre = aTexteLibreSaisi;
			lQuestion.reponse.setEtat(EGenreEtat.Modification);
			lQuestion.setEtat(EGenreEtat.Modification);
			lActualite.setEtat(EGenreEtat.Modification);
		}
	}
}
function _declencherClbckValidation(aGenreEvnt) {
	if (this.donnee.aToutRepondu()) {
		this.donnee.lue = true;
	}
	this.declencherCallback({
		actu: this.donnee,
		genreEvnt: aGenreEvnt,
		param: { avecRecupDonnees: true },
	});
}
function _evntSurMenuCtxMixte(aCmd) {
	this.declencherCallback({
		actu: this.donnee,
		genreEvnt: EGenreEvntActu.SurMenuCtxActu,
		param: { cmd: aCmd },
	});
}
function _construirePage(aAvecDateWidget) {
	const H = [];
	if (this.options.avecCmdMenuCtxMixte) {
		H.push(
			'<div id="',
			this.getInstance(this.identMenuCtxMixte).getNom(),
			'" class="info-sondage-menuCtxMixte"></div>',
		);
	}
	if (this.options.avecScrollZone) {
		H.push('<div class="zoneConsult_scroll">');
	}
	H.push('<div class="zoneTotal" ie-synthesevocale="lireTexte">');
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
	for (let i = 0, lNbr = this.donnee.listeQuestions.count(); i < lNbr; i++) {
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
			GTraductions.getValeur("Le"),
			" ",
			GDate.formatDate(this.donnee.dateDebut, "%JJ/%MM/%AAAA"),
			"</div>",
		);
	}
	H.push("</div>");
	if (
		this.donnee.estSondage &&
		!this.options.avecEditionActualite &&
		!GApplication.getModeExclusif()
	) {
		H.push('<div class="zoneBtnsAction">');
		H.push(
			'<ie-bouton ie-model="btnAnnuler" class="' +
				TypeThemeBouton.secondaire +
				' item">',
			GTraductions.getValeur("Annuler"),
			"</ie-bouton>",
		);
		H.push(
			'<ie-bouton ie-model="btnValider" class="' +
				TypeThemeBouton.primaire +
				' item">',
			GTraductions.getValeur("Valider"),
			"</ie-bouton>",
		);
		H.push("</div>");
	}
	if (this.options.avecScrollZone) {
		H.push("</div>");
	}
	return H.join("");
}
function _construirePageAucun() {
	const H = [];
	if (this.options.avecMsgAucun) {
		H.push(
			tag(
				"div",
				{ class: "message-vide" },
				tag(
					"div",
					{ class: "message" },
					GTraductions.getValeur("infoSond.msgAucunSelection"),
				),
				tag("div", { class: "Image_No_Data", "aria-hidden": "true" }),
			),
		);
	}
	return H.join("");
}
module.exports = { InterfaceConsultInfoSondage };
