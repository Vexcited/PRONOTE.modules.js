exports.ObjetFenetre_EnregistrementAudio = void 0;
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetTraduction_1 = require("ObjetTraduction");
const Type_ThemeBouton_1 = require("Type_ThemeBouton");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetListeElements_1 = require("ObjetListeElements");
const UtilitaireSelecFile_1 = require("UtilitaireSelecFile");
const UtilitaireAudio_1 = require("UtilitaireAudio");
const Enumere_Action_1 = require("Enumere_Action");
const Enumere_BoiteMessage_1 = require("Enumere_BoiteMessage");
const AccessApp_1 = require("AccessApp");
const IEHtml_1 = require("IEHtml");
const vmsg = require("vmsg.es5.min.js");
var EEtatChargementComposant;
(function (EEtatChargementComposant) {
	EEtatChargementComposant[(EEtatChargementComposant["nonInitialise"] = 0)] =
		"nonInitialise";
	EEtatChargementComposant[
		(EEtatChargementComposant["enCoursDInitialisation"] = 1)
	] = "enCoursDInitialisation";
	EEtatChargementComposant[(EEtatChargementComposant["initialise"] = 2)] =
		"initialise";
	EEtatChargementComposant[(EEtatChargementComposant["arrete"] = 3)] = "arrete";
})(EEtatChargementComposant || (EEtatChargementComposant = {}));
class ObjetFenetre_EnregistrementAudio extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.idTime = GUID_1.GUID.getId();
		this.setOptionsFenetre({
			modale: true,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"EnregistrementAudio.titre",
			),
			largeur: 400,
			hauteurMin: 100,
			listeBoutons: [
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"EnregistrementAudio.recommencer",
					),
					recommencer: true,
					theme: Type_ThemeBouton_1.TypeThemeBouton.secondaire,
				},
				{
					libelle: ObjetTraduction_1.GTraductions.getValeur(
						"EnregistrementAudio.upload",
					),
					valider: true,
					theme: Type_ThemeBouton_1.TypeThemeBouton.primaire,
				},
			],
			addParametresValidation: (aParametres) => {
				if (
					aParametres.bouton &&
					aParametres.bouton.valider &&
					this.listeFichiers
				) {
					aParametres.listeFichiers = this.listeFichiers;
				}
			},
		});
		this.optionsEnregistrementAudio = {
			contexte: "",
			maxLengthAudio: this.getDureeMaxEnregistrementAudio(),
		};
		this.donnees = { genreRessourcePJ: null };
		this.listeFichiers = null;
		this.error = null;
		this.audio = {
			enregistrementEnCours: false,
			chargementComposant: EEtatChargementComposant.nonInitialise,
			blob: null,
			fichier: null,
		};
		this.initEnregistrement(false);
	}
	getDureeMaxEnregistrementAudio() {
		return 180;
	}
	setOptions(aOptions) {
		$.extend(this.optionsEnregistrementAudio, aOptions);
		return this;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			fenetreBtn: {
				getDisabled: function (aBoutonRepeat) {
					if (aInstance.audio.enregistrementEnCours) {
						return true;
					}
					if (aBoutonRepeat.element.valider) {
						return aInstance.audio.fichier === null;
					}
					if (aBoutonRepeat.element.recommencer) {
						return aInstance.audio.fichier === null;
					}
					return false;
				},
				event: function (aBoutonRepeat) {
					if (aBoutonRepeat.element.valider) {
						aInstance.listeFichiers =
							new ObjetListeElements_1.ObjetListeElements();
						UtilitaireSelecFile_1.UtilitaireSelecFile.addFileDansListe(
							aInstance.audio.blob,
							aInstance.listeFichiers,
							aInstance.donnees.genreRessourcePJ,
						);
						aInstance.surValidation(aBoutonRepeat.element.index);
					} else if (
						aBoutonRepeat.element.recommencer &&
						!!aInstance.audio.fichier
					) {
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"EnregistrementAudio.suppressionExistant",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										if (aInstance.audio.fichier) {
											URL.revokeObjectURL(aInstance.audio.fichier);
										}
										$.extend(aInstance.audio, { blob: null, fichier: null });
										aInstance.setTime(0);
										aInstance.listeFichiers = null;
									}
								},
							});
					}
				},
			},
			iconvisible: function () {
				return aInstance.audio.enregistrementEnCours;
			},
			boutonAudio: {
				title: function () {
					if (aInstance.audio.enregistrementEnCours) {
						return ObjetTraduction_1.GTraductions.getValeur(
							"EnregistrementAudio.encours",
						);
					} else {
						return ObjetTraduction_1.GTraductions.getValeur(
							"EnregistrementAudio.record",
						);
					}
				},
				visible: function () {
					return true;
				},
				getDisabled: function () {
					return (
						[
							EEtatChargementComposant.nonInitialise,
							EEtatChargementComposant.enCoursDInitialisation,
						].includes(aInstance.audio.chargementComposant) ||
						aInstance.audio.enregistrementEnCours ||
						!!aInstance.audio.fichier
					);
				},
				event: function () {
					if (
						[
							EEtatChargementComposant.initialise,
							EEtatChargementComposant.arrete,
						].includes(aInstance.audio.chargementComposant)
					) {
						if (!!aInstance.audio.fichier) {
							(0, AccessApp_1.getApp)()
								.getMessage()
								.afficher({
									type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
									message: ObjetTraduction_1.GTraductions.getValeur(
										"EnregistrementAudio.suppressionExistant",
									),
									callback: (aGenreAction) => {
										if (
											aGenreAction === Enumere_Action_1.EGenreAction.Valider
										) {
											if (aInstance.audio.fichier) {
												URL.revokeObjectURL(aInstance.audio.fichier);
											}
											$.extend(aInstance.audio, { blob: null, fichier: null });
											aInstance.enregistrer();
										}
									},
								});
						} else {
							aInstance.enregistrer();
						}
					}
				},
			},
			boutonAudioStop: {
				event: function () {
					if (
						aInstance.audio.chargementComposant ===
							EEtatChargementComposant.initialise &&
						aInstance.audio.enregistrementEnCours
					) {
						aInstance.stopEnregistrement();
					}
				},
				getDisabled: function () {
					return (
						aInstance.audio.chargementComposant !==
							EEtatChargementComposant.initialise ||
						!aInstance.audio.enregistrementEnCours
					);
				},
			},
			boutonRefresh: {
				event: function () {
					if (
						aInstance.audio.chargementComposant ===
						EEtatChargementComposant.nonInitialise
					) {
						aInstance.error.reset = true;
						aInstance.initEnregistrement(false);
						aInstance.$refreshSelf();
					}
				},
			},
			getEnregistrement: function () {
				if (
					!!aInstance.error &&
					aInstance.error.name === "NotAllowedError" &&
					!aInstance.error.reset
				) {
					return `<div>${ObjetTraduction_1.GTraductions.getValeur("EnregistrementAudio.msgErreur").replaceRCToHTML()}</div><ie-btnicon ie-model="boutonRefresh" class="bt-activable bt-large icon_refresh"></ie-btnicon>`;
				}
				if (
					aInstance.audio.chargementComposant ===
					EEtatChargementComposant.enCoursDInitialisation
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"EnregistrementAudio.msgAutoriser",
					).replaceRCToHTML();
				}
				if (
					aInstance.audio.chargementComposant ===
						EEtatChargementComposant.initialise &&
					aInstance.audio.enregistrementEnCours
				) {
					return ObjetTraduction_1.GTraductions.getValeur(
						"EnregistrementAudio.encours",
					);
				}
				return "";
			},
			getAudio: function () {
				if (!!aInstance.audio.fichier && !!aInstance.audio.blob) {
					let lID = GUID_1.GUID.getId();
					const lName = aInstance.audio.blob.name;
					if (lName) {
						const lArr = lName.split(".");
						lID = lArr[0];
					}
					return UtilitaireAudio_1.UtilitaireAudio.construitChipsAudio({
						libelle: ObjetTraduction_1.GTraductions.getValeur(
							"EnregistrementAudio.monEnregistrement",
						),
						url: aInstance.audio.fichier,
						ieModel: "chipsAudio",
						argsIEModel: [],
						idAudio: lID,
						classes: ["no-underline"],
					});
				}
				return "";
			},
			chipsAudio: {
				event: function () {
					UtilitaireAudio_1.UtilitaireAudio.executeClicChipsParDefaut(
						this.node,
					);
				},
				eventBtn: function () {
					if (!!aInstance.audio.fichier) {
						(0, AccessApp_1.getApp)()
							.getMessage()
							.afficher({
								type: Enumere_BoiteMessage_1.EGenreBoiteMessage.Confirmation,
								message: ObjetTraduction_1.GTraductions.getValeur(
									"EnregistrementAudio.suppression",
								),
								callback: function (aGenreAction) {
									if (aGenreAction === Enumere_Action_1.EGenreAction.Valider) {
										if (aInstance.audio.fichier) {
											URL.revokeObjectURL(aInstance.audio.fichier);
										}
										$.extend(aInstance.audio, {
											enregistrementEnCours: false,
											blob: null,
											fichier: null,
										});
										aInstance.setTime(0);
										aInstance.listeFichiers = null;
									}
								},
							});
					}
				},
				node() {
					const $chips = $(this.node);
					const $audio = $chips.find("audio");
					$audio.on("play", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop);
					});
					$audio.on("pause", () => {
						$chips
							.removeClass(UtilitaireAudio_1.UtilitaireAudio.IconeStop)
							.addClass(UtilitaireAudio_1.UtilitaireAudio.IconeLecture);
					});
				},
				getOptions: function (aAvecBtnSuppr) {
					return { avecBtn: aAvecBtnSuppr };
				},
			},
		});
	}
	fermer() {
		if (
			!!this.recorder &&
			this.audio.chargementComposant === EEtatChargementComposant.initialise
		) {
			try {
				this.recorder.close();
			} catch (aError) {
				IE.log.addLog(aError);
			}
		}
		return super.fermer();
	}
	setDonnees(aGenreRessourcePieceJointe, aOptionsFenetre) {
		this.donnees.genreRessourcePJ = aGenreRessourcePieceJointe;
		if (!!aOptionsFenetre) {
			Object.assign(this.optionsEnregistrementAudio, aOptionsFenetre);
		}
	}
	afficher() {
		const lContenuFenetre = this.composeContenuFenetre();
		return super.afficher(lContenuFenetre);
	}
	enregistrer() {
		if (this.audio.chargementComposant === EEtatChargementComposant.arrete) {
			this.initEnregistrement(true);
		} else {
			this._enregistrer();
		}
	}
	_enregistrer() {
		this.recorder.startRecording();
		this.debut = Date.now();
		this.audio.enregistrementEnCours = true;
		this.updateTime();
		this.$refreshSelf();
	}
	stopEnregistrement() {
		this.recorder
			.stopRecording()
			.then((ablob) => {
				this.audio.chargementComposant = EEtatChargementComposant.arrete;
				const lNom = new Date().getTime();
				try {
					ablob.name = lNom.toString() + ".mp3";
				} catch (error) {
					IE.log.addLog(
						`erreur affectation nom enregistrement audio : ${error}`,
					);
				}
				$.extend(this.audio, {
					enregistrementEnCours: false,
					blob: ablob,
					fichier: URL.createObjectURL(ablob),
				});
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.$refreshSelf();
			})
			.catch((aError) => {
				this.audio.chargementComposant = EEtatChargementComposant.arrete;
				IE.log.addLog(aError);
				if (this.audio.fichier) {
					URL.revokeObjectURL(this.audio.fichier);
				}
				$.extend(this.audio, {
					enregistrementEnCours: false,
					blob: null,
					fichier: null,
				});
			});
	}
	updateTime() {
		const lTime = Math.round((Date.now() - this.debut) / 1000);
		this.setTime(lTime);
		if (lTime > this.optionsEnregistrementAudio.maxLengthAudio) {
			this.setTime(this.optionsEnregistrementAudio.maxLengthAudio);
			this.stopEnregistrement();
		} else {
			this.setTime(lTime);
			this.timer = setTimeout(() => {
				return this.updateTime();
			}, 300);
		}
	}
	setTime(aTime) {
		const lText =
			this.serialiserTime(aTime / 60) + ":" + this.serialiserTime(aTime % 60);
		ObjetHtml_1.GHtml.setHtml(this.idTime, lText);
	}
	initEnregistrement(aAvecDemarrerEnregistrement) {
		this.recorder = new vmsg.Recorder({ wasmURL: "vmsg.wasm" });
		this.audio.chargementComposant =
			EEtatChargementComposant.enCoursDInitialisation;
		this.recorder
			.init()
			.then(() => {
				this.error = null;
				this.audio.chargementComposant = EEtatChargementComposant.initialise;
				if (aAvecDemarrerEnregistrement) {
					this._enregistrer();
				}
				this.$refreshSelf();
			})
			.catch((aError) => {
				IE.log.addLog(aError);
				this.error = aError;
				this.audio.chargementComposant = EEtatChargementComposant.nonInitialise;
				this.$refreshSelf();
			});
	}
	serialiserTime(n) {
		n |= 0;
		return n < 10
			? "0".concat(n.toString())
			: "".concat(Math.min(n, 99).toString());
	}
	composeContenuFenetre() {
		const H = [];
		H.push('<div class="fenetreEnregistrementAudio">');
		const lText =
			this.serialiserTime(this.optionsEnregistrementAudio.maxLengthAudio / 60) +
			":" +
			this.serialiserTime(this.optionsEnregistrementAudio.maxLengthAudio % 60);
		H.push(
			'<div class="flex-contain cols flex-center">',
			'<div ie-html="getEnregistrement" class="audio-enregistrement"></div>',
			'<div class="m-top-xl flex-contain cols flex-center">',
			`<div class="flex-contain flex-center"><div class="container-icon fix-bloc"><i class="icon_pastille_evaluation" title="${ObjetTraduction_1.GTraductions.getValeur("EnregistrementAudio.encours")}" ie-display="iconvisible"></i></div><div class="container-count fix-bloc" id ="${this.idTime}">00:00</div> / <div class="m-right-xl">${lText}</div></div>`,
			'<div class="m-top-xl">',
			`<ie-btnicon ie-model="boutonAudio" ie-title="boutonAudio.title" class="bt-activable bt-big icon_microphone ${IEHtml_1.default.Styles.debugWAIInputIgnoreAssert}"></ie-btnicon>`,
			`<ie-btnicon ie-model="boutonAudioStop" title="${ObjetTraduction_1.GTraductions.getValeur("EnregistrementAudio.stop")}" class="m-left-xl bt-activable bt-big icon_case_inactive"></ie-btnicon>`,
			"</div>",
			"</div>",
			'<div ie-html="getAudio" class="m-all-xl audio-fichier"></div>',
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
}
exports.ObjetFenetre_EnregistrementAudio = ObjetFenetre_EnregistrementAudio;
