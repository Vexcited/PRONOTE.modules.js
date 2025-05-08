exports.ObjetChampFormulaire =
	exports.EGenreTypeTel =
	exports.EGenreTypeChampForm =
		void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const ObjetHtml_1 = require("ObjetHtml");
const ObjetStyle_1 = require("ObjetStyle");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_EvenementObjetSaisie_1 = require("Enumere_EvenementObjetSaisie");
const GUID_1 = require("GUID");
var EGenreTypeChampForm;
(function (EGenreTypeChampForm) {
	EGenreTypeChampForm[(EGenreTypeChampForm["texte"] = 0)] = "texte";
	EGenreTypeChampForm[(EGenreTypeChampForm["email"] = 1)] = "email";
	EGenreTypeChampForm[(EGenreTypeChampForm["tel"] = 2)] = "tel";
	EGenreTypeChampForm[(EGenreTypeChampForm["combo"] = 3)] = "combo";
})(
	EGenreTypeChampForm ||
		(exports.EGenreTypeChampForm = EGenreTypeChampForm = {}),
);
var EGenreTypeTel;
(function (EGenreTypeTel) {
	EGenreTypeTel[(EGenreTypeTel["domicile"] = 0)] = "domicile";
	EGenreTypeTel[(EGenreTypeTel["mobile"] = 1)] = "mobile";
	EGenreTypeTel[(EGenreTypeTel["professionnel"] = 2)] = "professionnel";
})(EGenreTypeTel || (exports.EGenreTypeTel = EGenreTypeTel = {}));
class ObjetChampFormulaire extends ObjetIdentite_1.Identite {
	constructor(...aParams) {
		super(...aParams);
		this.donneesRecues = false;
		this.param = {
			typeChamp: EGenreTypeChampForm.texte,
			valeur: "",
			liste: new ObjetListeElements_1.ObjetListeElements(),
			selection: null,
			estOptionnel: true,
			estActif: true,
			maxLength: null,
			avecClbckSurModif: false,
			placeholder: { avecOption: false, str: "" },
			label: { avecOption: false, str: "", classCss: "" },
			signalerErreur: { avecOption: false, str: "" },
			styleOnFocus: { avecOption: true },
		};
		const lGuid = GUID_1.GUID.getId();
		this.zoneMsg = lGuid + "_msg";
		this.zoneChmp = lGuid + "_chmp";
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			chmpstexte: {
				getValue: function () {
					return aInstance.param && aInstance.param.valeur
						? aInstance.param.valeur
						: "";
				},
				setValue: function (aValue) {
					aInstance.param.valeur = aValue;
					if (aInstance.param.avecClbckSurModif === true) {
						aInstance.declencherCallback({ valeur: aInstance.param.valeur });
					}
				},
				exitChange: function () {
					aInstance.declencherCallback({ valeur: aInstance.param.valeur });
				},
				getDisabled: function () {
					return !aInstance.param.estActif;
				},
			},
			chmpsCombo: {
				init: function (aCombo) {
					aCombo.setOptionsObjetSaisie({
						longueur: !!aInstance.param.maxLength
							? aInstance.param.maxLength
							: 354,
						hauteur: 25,
						libelleHaut: aInstance.param.label.avecOption
							? aInstance.param.label.str
							: "",
					});
				},
				getDonnees: function (aDonnees) {
					if (!aDonnees) {
						return aInstance.param.liste;
					}
				},
				getDisabled: function () {
					return !aInstance.param.estActif;
				},
				getIndiceSelection: function () {
					return aInstance.param.liste.getIndiceParElement(
						aInstance.param.selection,
					);
				},
				event: function (aParametres) {
					if (
						aParametres.genreEvenement ===
							Enumere_EvenementObjetSaisie_1.EGenreEvenementObjetSaisie
								.selection &&
						!!aInstance.param &&
						aInstance.param.selection !== null &&
						aInstance.param.selection !== undefined
					) {
						if (
							aParametres.element.getNumero() !==
							aInstance.param.selection.getNumero()
						) {
							aInstance.param.selection = aParametres.element;
							aInstance.declencherCallback({
								valeur: aInstance.param.selection,
							});
						}
					}
				},
			},
			ind: {
				getValue: function () {
					return aInstance.param && aInstance.param.valeur
						? aInstance.param.valeur.ind
						: "";
				},
				setValue: function (aValue) {
					aInstance.param.valeur.ind = aValue;
				},
				exitChange: function () {
					aInstance.declencherCallback({ valeur: aInstance.param.valeur });
				},
				getDisabled: function () {
					return !aInstance.param.estActif;
				},
			},
			tel: {
				getValue: function () {
					return aInstance.param && aInstance.param.valeur
						? aInstance.param.valeur.tel
						: "";
				},
				setValue: function (aValue) {
					aInstance.param.valeur.tel = aValue;
				},
				exitChange: function () {
					aInstance.declencherCallback({ valeur: aInstance.param.valeur });
				},
				getDisabled: function () {
					return !aInstance.param.estActif;
				},
			},
		});
	}
	declencherCallback(aParam) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(aParam);
		}
	}
	setParametres(aParam) {
		if (
			!(
				aParam.label !== undefined &&
				aParam.label !== null &&
				aParam.label.avecOption === false
			) &&
			aParam.typeChamp === EGenreTypeChampForm.tel &&
			aParam.typeTel !== null &&
			aParam.typeTel !== undefined
		) {
			const lLabel = this.getLabel({
				typeChamp: aParam.typeChamp,
				typeTel: aParam.typeTel,
			});
			$.extend(true, this.param, { label: { avecOption: true, str: lLabel } });
		}
		$.extend(true, this.param, aParam);
	}
	getLabel(aParam) {
		let lLabel = "";
		switch (aParam.typeChamp) {
			case EGenreTypeChampForm.tel:
				switch (aParam.typeTel) {
					case EGenreTypeTel.domicile:
						lLabel = ObjetTraduction_1.GTraductions.getValeur(
							"InfosEnfantPrim.autresContacts.telDom",
						);
						break;
					case EGenreTypeTel.mobile:
						lLabel = ObjetTraduction_1.GTraductions.getValeur(
							"InfosEnfantPrim.autresContacts.telMob",
						);
						break;
					case EGenreTypeTel.professionnel:
						lLabel = ObjetTraduction_1.GTraductions.getValeur(
							"InfosEnfantPrim.autresContacts.telPro",
						);
						break;
				}
				break;
		}
		return lLabel;
	}
	setDonnees(aParam) {
		this.setParametres(aParam);
		this.donneesRecues = true;
		ObjetHtml_1.GHtml.setHtml(this.Nom, this.construireAffichage(), {
			controleur: this.controleur,
		});
	}
	construireAffichage() {
		const H = [];
		const lIdInput = GUID_1.GUID.getId();
		if (this.donneesRecues) {
			const lClass = "Espace";
			const lStyle = "height:25px; width:100%;";
			const lStyleEspaceHaut = "margin-top: 10px;";
			H.push('<div id="', this.zoneChmp, '" style="', lStyleEspaceHaut, '">');
			if (
				this.param.label.avecOption &&
				this.param.typeChamp !== EGenreTypeChampForm.combo
			) {
				const lStyleLabel = "margin-bottom:5px;";
				const lCssLabel = this.param.label.classCss;
				H.push(
					'<label for="',
					lIdInput,
					'" style="',
					lStyleLabel,
					'" class="',
					lCssLabel,
					'">',
					this.param.label.str,
					"</label>",
				);
			}
			switch (this.param.typeChamp) {
				case EGenreTypeChampForm.texte: {
					const lMaxLength =
						this.param.maxLength !== null
							? 'maxlength="' + this.param.maxLength + '"'
							: "";
					H.push(
						'<input aria-required="true" id="',
						lIdInput,
						'" ie-model="chmpstexte" ie-trim type="text" value="',
						this.param.valeur,
						'" ',
						lMaxLength,
						' class="round-style ',
						lClass,
						'" style="',
						lStyle,
						'" />',
					);
					break;
				}
				case EGenreTypeChampForm.tel:
					H.push("<div>");
					H.push(this._composeTelephone(this.param.typeTel, this.param.label));
					H.push("</div>");
					break;
				case EGenreTypeChampForm.combo:
					H.push(
						'<ie-combo ie-model="chmpsCombo" style="',
						lStyle,
						'"></ie-combo>',
					);
					break;
			}
			H.push('<div style="height:10px;" id="', this.zoneMsg, '" >&nbsp;</div>');
			H.push("</div>");
		}
		return H.join("");
	}
	setMsgErreur(aParam) {
		let lMsg = aParam.msg;
		if (lMsg === "") {
			lMsg = "&nbsp;";
			$("#" + this.zoneChmp.escapeJQ() + " input").css("border", "");
			$("#" + this.zoneMsg.escapeJQ()).css("color", "");
		} else {
			$("#" + this.zoneChmp.escapeJQ() + " input").css(
				"border",
				"1px solid red",
			);
			$("#" + this.zoneMsg.escapeJQ()).css("color", "red");
		}
		ObjetHtml_1.GHtml.setHtml(this.zoneMsg, lMsg);
	}
	avecMsgErreur() {
		const lMsg = ObjetHtml_1.GHtml.getHtml(this.zoneMsg);
		return lMsg !== "&nbsp;" && lMsg !== "";
	}
	_composeTelephone(aGenre, aLabel) {
		const H = [],
			lLargeurLibelleInput = 30,
			lLargeurIndicatif = 45,
			lLargeurTel = 115,
			lTitleImage = "",
			lTitle = "";
		let lClasseIcone;
		let lLabel = "";
		if (aLabel && aLabel.avecOption) {
			lLabel = aLabel.str;
		}
		switch (aGenre) {
			case EGenreTypeTel.domicile:
				lClasseIcone = "icon_home";
				break;
			case EGenreTypeTel.mobile:
				lClasseIcone = "icon_mobile_phone";
				break;
			case EGenreTypeTel.professionnel:
				lClasseIcone = "icon_suitcase";
				break;
		}
		H.push('<div class="NoWrap">');
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical AlignementMilieu" style="font-size: 1.5rem;',
			ObjetStyle_1.GStyle.composeWidth(lLargeurLibelleInput),
			'">',
		);
		H.push('<i class="', lClasseIcone, '" title="', lTitleImage, '"></i>');
		H.push("</div>");
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical">',
			'<input ie-model="ind" class="round-style"',
			" ie-indicatiftel ",
			' style="',
			ObjetStyle_1.GStyle.composeWidth(lLargeurIndicatif),
			'"',
			' type="text"',
			' title="',
			lTitle,
			'"',
			' tabindex="0"',
			` aria-label="${ObjetTraduction_1.GTraductions.getValeur("InfosEnfantPrim.autresContacts.indicatif")} ${lLabel}"`,
			"/>",
			"</div>",
		);
		H.push(
			'<div class="InlineBlock AlignementMilieuVertical PetitEspaceGauche">',
			'<input ie-model="tel" class="round-style"',
			" ie-telephone  ",
			' aria-required="true"',
			' style="',
			ObjetStyle_1.GStyle.composeWidth(lLargeurTel),
			'"',
			' type="text"',
			lTitle ? ' placeholder="' + lTitle + '"' : "",
			lTitle ? ' title="' + lTitle + '"' : "",
			' tabindex="0"',
			' aria-label="',
			lLabel,
			'"',
			"/>",
			"</div>",
		);
		H.push("</div>");
		return H.join("");
	}
}
exports.ObjetChampFormulaire = ObjetChampFormulaire;
