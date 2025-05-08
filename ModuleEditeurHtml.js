exports.ModuleEditeurHtml = void 0;
const ObjetInterface_1 = require("ObjetInterface");
const GUID_1 = require("GUID");
const TinyInit_1 = require("TinyInit");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetStyle_1 = require("ObjetStyle");
const Invocateur_1 = require("Invocateur");
const UtilitaireTiny_1 = require("UtilitaireTiny");
class ModuleEditeurHtml extends ObjetInterface_1.ObjetInterface {
	constructor(...aParams) {
		super(...aParams);
		const lGuid = GUID_1.GUID.getId();
		this.idContenuTiny = lGuid + "_tiny_";
		this.idContenuTinyFenetre = lGuid + "_tiny_fenetre_";
		this.avecEditeurRiche = GNavigateur.withContentEditable;
		this.idBoutonFenetre = lGuid + "_btnEditeurHtml";
		this.param = {
			strLabel: "",
			classLabel: "Gras",
			widthLabel: 200,
			avecTinyEnFenetre: true,
			heightEdition: 100,
			minHeightEdition: 50,
			surChange: null,
			surExitChange: null,
			gererModeExclusif: false,
			editeurEquation: false,
			editeurEquationMaxFileSize: 2048,
			placeholder: "",
			optionsTiny: { toolbar: false },
		};
		Invocateur_1.Invocateur.abonner(
			Invocateur_1.ObjetInvocateur.events.modeExclusif,
			(aModeExclusif) => {
				if (this.param.gererModeExclusif && this._autoriseTiny()) {
					TinyInit_1.TinyInit.setReadonly(
						this.idContenuTiny,
						aModeExclusif || !this.Actif,
					);
				}
			},
			this,
		);
	}
	setActif(AActif) {
		if (this._autoriseTiny()) {
			TinyInit_1.TinyInit.setReadonly(this.idContenuTiny, !AActif);
		}
		super.setActif(AActif);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			textarea: {
				getValue: function () {
					return aInstance._val || "";
				},
				setValue: function (aValue) {
					aInstance._val = aValue;
					if (aInstance.param.surChange) {
						aInstance.param.surChange(aValue);
					}
				},
				exitChange: function (aValue) {
					if (aInstance.param.surExitChange) {
						aInstance.param.surExitChange(
							aValue,
							aInstance.declenchementEventBtn,
						);
					}
				},
				getDisabled: function () {
					return !aInstance.Actif;
				},
			},
			nodebtn: function () {
				$(this.node).on(
					"mousedown",
					(() => {
						aInstance.declenchementEventBtn = true;
					}).bind(aInstance),
				);
				$(this.node).on(
					"blur",
					(() => {
						aInstance.declenchementEventBtn = false;
					}).bind(aInstance),
				);
			},
			btn: {
				event: function () {
					aInstance.evntSurBoutonHTML();
					aInstance.declenchementEventBtn = false;
				},
				getTitle() {
					return ObjetTraduction_1.GTraductions.getValeur(
						"ModuleEditeurHtml.editeurHtml",
					);
				},
				getDisabled: function () {
					return !aInstance.Actif;
				},
			},
		});
	}
	construireStructureAffichage() {
		const H = [];
		H.push('<div class="flex-contain justify-between flex-center p-y">');
		H.push(
			'<div class="',
			this.param.classLabel,
			' " style="' +
				ObjetStyle_1.GStyle.composeWidth(this.param.widthLabel) +
				'">',
			this.param.strLabel,
			"</div>",
		);
		if (
			this.param.avecTinyEnFenetre &&
			this._autoriseTiny() &&
			!this.param.sideBySide
		) {
			H.push(
				'<ie-btnicon ie-model="btn" ie-node="nodebtn" id="',
				this.idBoutonFenetre,
				'" class="bt-activable icon_font"></ie-btnicon>',
			);
		}
		H.push("</div>");
		if (
			this.param.avecTinyEnFenetre &&
			this._autoriseTiny() &&
			this.param.sideBySide
		) {
			H.push('<div class="flex-contain">');
			H.push(
				'<div class="fix-bloc" style="padding: 0.1rem 0.3rem 0 0;"><ie-btnicon id="',
				this.idBoutonFenetre,
				'" ie-model="btn" ie-node="nodebtn" class="bt-activable icon_font"></ie-btnicon></div>',
			);
			H.push('<div style="flex: 1 0 auto">');
		}
		const lPlaceHolder = this.param.placeholder
			? ' placeholder="' + this.param.placeholder + '"'
			: "";
		if (this._autoriseTiny()) {
			H.push(
				'<textarea id="' +
					this.idContenuTiny +
					'" class="round-style" style="width:100%;" disabled ',
				lPlaceHolder,
				"></textarea>",
			);
		} else {
			H.push(
				'<textarea id="' +
					this.idContenuTiny +
					'" ie-model="textarea" maxlength="1000" class="Texte10 round-style" style="width:100%;',
				ObjetStyle_1.GStyle.composeHeight(this.param.heightEdition),
				'"',
				lPlaceHolder,
				"></textarea>",
			);
		}
		if (this._autoriseTiny() && this.param.sideBySide) {
			H.push("</div>");
			H.push("</div>");
		}
		return H.join("");
	}
	setParametres(aParam) {
		$.extend(this.param, aParam);
	}
	recupererDonnees() {
		if (
			this._autoriseTiny() &&
			ObjetHtml_1.GHtml.elementExiste(this.idContenuTiny)
		) {
			this._initTiny();
		}
	}
	setDonnees(aDonnee) {
		this._val = aDonnee;
		if (this._autoriseTiny()) {
			this._remplirTiny(this._val);
		}
	}
	recupererContenu() {
		return this._recupererTiny();
	}
	_autoriseTiny() {
		return this.avecEditeurRiche;
	}
	_remplirTiny(aContenu) {
		TinyInit_1.TinyInit.onLoadEnd(this.idContenuTiny).then((aParams) => {
			if (aParams.tiny) {
				aParams.tiny.setContent(aContenu);
			}
		});
	}
	_recupererTiny() {
		let lContent = "";
		if (this._autoriseTiny()) {
			const lEditor = TinyInit_1.TinyInit.get(this.idContenuTiny);
			if (lEditor) {
				lContent = lEditor.getContent();
				lContent = TinyInit_1.TinyInit.estContenuVide(lContent) ? "" : lContent;
			}
			return lContent;
		} else {
			return this._val;
		}
	}
	_initTiny() {
		const lThis = this;
		if (this._autoriseTiny()) {
			const lParams = {
				id: this.idContenuTiny,
				min_height: this.param.minHeightEdition,
				height: this.param.heightEdition,
				editeurEquation: this.param.editeurEquation,
				editeurEquationMaxFileSize: this.param.editeurEquationMaxFileSize,
				toolbar: false,
				labelWAI:
					this.param.labelWAI ||
					this.param.strLabel ||
					ObjetTraduction_1.GTraductions.getValeur("Tiny.WAITitre"),
				readonly:
					this.param.gererModeExclusif && GApplication.getModeExclusif(),
				setup: function (ed) {
					ed.on("blur", () => {
						if (lThis.param.surExitChange && !ed._enCoursDestruction) {
							lThis.param.surExitChange(
								lThis._recupererTiny(),
								lThis.declenchementEventBtn,
							);
						}
					});
					ed.on("KeyUp", () => {
						if (lThis.param.surChange && !ed._enCoursDestruction) {
							lThis.param.surChange(lThis._recupererTiny());
						}
					});
					ed.on("Change", () => {
						if (lThis.param.surChange && !ed._enCoursDestruction) {
							lThis.param.surChange(lThis._recupererTiny());
						}
					});
				},
				filePickerOpener: this.param.filePickerOpener,
				filePickerTypes: this.param.filePickerTypes,
				iEContextSearch: this.param.iEContextSearch,
				placeholder: this.param.placeholder,
			};
			if (this.param.fontSize) {
				lParams.fontSize = this.param.fontSize;
			}
			if (this.param.fontFamily) {
				lParams.fontFamily = this.param.fontFamily;
			}
			if (this.param.optionsTiny) {
				Object.assign(lParams, this.param.optionsTiny);
			}
			TinyInit_1.TinyInit.init(lParams);
		}
	}
	evntSurBoutonHTML() {
		const lDescriptif = this._recupererTiny();
		const lParams = {
			instance: this,
			descriptif: lDescriptif,
			avecModificationAuDebut:
				!ObjetChaine_1.GChaine.estChaineHTMLEgal(this._val, lDescriptif) &&
				this.declenchementEventBtn,
			labelWAI:
				this.param.labelWAI ||
				this.param.strLabel ||
				ObjetTraduction_1.GTraductions.getValeur("Tiny.WAITitre"),
			readonly: this.param.gererModeExclusif && GApplication.getModeExclusif(),
			callback: (aParams) => {
				if (aParams.valider) {
					if (this._autoriseTiny()) {
						this._remplirTiny(aParams.descriptif);
					} else {
						ObjetHtml_1.GHtml.setValue(this.idContenuTiny, aParams.descriptif);
					}
					if (this.param.surExitChange) {
						this.param.surExitChange(
							aParams.descriptif,
							this.declenchementEventBtn,
						);
					}
					if (this.param.surChange) {
						this.param.surChange(aParams.descriptif);
					}
				} else if (aParams.avecModificationAuDebut) {
					if (this.param.surExitChange) {
						this.param.surExitChange(this._recupererTiny());
					}
				}
			},
			filePickerOpener: this.param.filePickerOpener,
			filePickerTypes: this.param.filePickerTypes,
			editeurEquation: this.param.editeurEquation,
			editeurEquationMaxFileSize: this.param.editeurEquationMaxFileSize,
		};
		if (this.param.modeQCM) {
			lParams.modeQCM = this.param.modeQCM;
		}
		if (this.param.fontSize) {
			lParams.fontSize = this.param.fontSize;
		}
		if (this.param.fontFamily) {
			lParams.fontFamily = this.param.fontFamily;
		}
		UtilitaireTiny_1.UtilitaireTiny.ouvrirFenetreHtml(lParams);
	}
}
exports.ModuleEditeurHtml = ModuleEditeurHtml;
