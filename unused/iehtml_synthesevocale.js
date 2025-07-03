const IEHtml = require("IEHtml");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireSyntheseVocale_1 = require("UtilitaireSyntheseVocale");
const AccessApp_1 = require("AccessApp");
IEHtml.addAttribut(
	"ie-synthesevocale",
	async (
		aContexteCourant,
		aNodeName,
		aAttributValue,
		aOutils,
		aComp,
		aAttrName,
	) => {
		let lValue = aAttributValue || "";
		let lValueCommentaire = lValue;
		const lSyntheseVocaleActif =
			UtilitaireSyntheseVocale_1.SyntheseVocale.getActif();
		const lJNode = $(aContexteCourant.node);
		let lResult = { text: "" };
		if (["", "true"].includes(lValue)) {
			lResult.text = lJNode.text() || lJNode.val();
		} else {
			const lInfos = aOutils.getAccesParametres(
				lValue,
				aAttrName,
				aContexteCourant,
			);
			if (lSyntheseVocaleActif) {
				lValueCommentaire = lInfos.nomCommentaire || lValueCommentaire;
				lResult = lInfos.callback([aContexteCourant.node, aContexteCourant]);
				if (lResult.text === "") {
					lResult.text = lJNode.text() || lJNode.val();
				}
			}
		}
		if (!lSyntheseVocaleActif) {
			return true;
		}
		if (
			!UtilitaireSyntheseVocale_1.SyntheseVocale.supportee &&
			!(0, AccessApp_1.getApp)().estAppliMobile
		) {
			return true;
		}
		const lVoix = UtilitaireSyntheseVocale_1.SyntheseVocale.getVoix();
		if (!lVoix && !(0, AccessApp_1.getApp)().estAppliMobile) {
			return true;
		}
		const lClass = aContexteCourant.node.classList.contains("no-fixed")
			? ""
			: "sv_speech";
		const lID = lResult.idCourant ? `id="${lResult.idCourant}"` : "";
		let lJNodeSpeaker = $(
			`<div role="presentation" class="sv_icon ${lClass}"><i ${lID} class="icone icon_play_sign btnImage" role="button" tabindex="0" aria-label="${ObjetTraduction_1.GTraductions.getValeur("SyntheseVocale.BoutonPlayStop")}"></i></div>`,
		);
		const lJNodePlay = $(lJNodeSpeaker).children("i").last();
		lJNodePlay.eventValidation(() => {
			UtilitaireSyntheseVocale_1.SyntheseVocale.speak(
				aContexteCourant.node,
				lJNodePlay,
				lResult,
			);
		});
		aOutils.abonnerRefresh(
			() => {
				lJNodeSpeaker.css("display", lJNode.text() || lJNode.val());
			},
			aContexteCourant.node,
			aContexteCourant,
		);
		aOutils.surInjectionHtml(aContexteCourant, () => {
			lJNode.append(lJNodeSpeaker);
		});
		aOutils.addCommentaireDebug(
			aContexteCourant.node,
			'ie-synthesevocale="' + lValueCommentaire + '"',
		);
	},
);
