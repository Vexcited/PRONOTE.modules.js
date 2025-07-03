exports.BlocCard = exports.EGenreEvntBlocCard = void 0;
const ObjetIdentite_1 = require("ObjetIdentite");
const GUID_1 = require("GUID");
const ObjetHtml_1 = require("ObjetHtml");
const UtilitaireUrl_1 = require("UtilitaireUrl");
var EGenreEvntBlocCard;
(function (EGenreEvntBlocCard) {
	EGenreEvntBlocCard["edition"] = "edition";
})(
	EGenreEvntBlocCard || (exports.EGenreEvntBlocCard = EGenreEvntBlocCard = {}),
);
class BlocCard extends ObjetIdentite_1.Identite {
	constructor() {
		super(...arguments);
		this.ids = { card: GUID_1.GUID.getId() };
		this.default = { avecEtendre: false };
		this.donneesRecues = false;
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			getNodeCard: function () {
				if (aInstance.donnees.editable) {
					const lMap = {
						click: function (aEvent) {
							if (
								$(aEvent.originalEvent.target)
									.parentsUntil(aEvent.currentTarget)
									.addBack()
									.filter("a").length === 1
							) {
								return;
							}
							aInstance.declencherCallback({
								genreEvnt: EGenreEvntBlocCard.edition,
							});
						}.bind(aInstance),
					};
					$(this.node).on(lMap);
				}
			},
		});
	}
	declencherCallback(aParam) {
		if (this.Pere && this.Evenement) {
			this.callback.appel(this.donnees.data, aParam.genreEvnt, aParam.param);
		}
	}
	setParam(aParam) {
		this.param = $.extend(this.default, aParam);
	}
	setDonnees(aParam) {
		this.donneesRecues = true;
		this.donnees = aParam;
	}
	afficher() {
		const H = [];
		if (this.donneesRecues) {
			const lEditable = this.donnees.editable;
			H.push(
				'<article id="',
				this.ids.card,
				'" ',
				ObjetHtml_1.GHtml.composeAttr("ie-node", "getNodeCard"),
				' class=" ',
				"BlocCard ",
				lEditable ? "Editable" : "",
				'" tabindex="0">',
			);
			H.push('<section class="Main">');
			H.push(
				'<div class="info-principale">',
				this.donnees.htmlInfoPrincipale,
				"</div>",
			);
			if (this.param.avecEtendre && this.donnees.htmlInfoSecondaire !== "") {
				H.push(
					'<i class="icon_chevron_down IconDeployer" role="presentation"></i>',
				);
			}
			H.push("</section>");
			H.push('<section class="Secondary">');
			H.push(this.donnees.htmlInfoSecondaire);
			H.push("</section>");
			H.push("</article>");
		}
		return H.join("");
	}
	composeHtmlMsg(aMsg) {
		const H = [];
		H.push('<article class="BlocCard" tabindex="0">');
		H.push('<section class="MsgInfo">');
		H.push(
			'<i role="presentation" class="MainText IconInfo icon_diffuser_info" style="padding-right:0.5em;"></i>',
		);
		H.push('<div class="MsgLibelle">', aMsg, "</div>");
		H.push("</section>");
		H.push("</article>");
		return H.join("");
	}
	composeHtmlZoneInfo(aParam) {
		const lContent = aParam.html;
		const lAvecSeparateur = aParam.avecSeparateur === true;
		const lEstDernier = aParam.estDernier === true;
		const H = [];
		H.push(
			'<div class="ZoneInfo ',
			lAvecSeparateur ? " Separateur " : "",
			lEstDernier ? " Last " : "",
			'">',
		);
		H.push(lContent);
		H.push("</div>");
		return H.join("");
	}
	composeHtmlInfoPrincipale(aParam) {
		const H = [];
		H.push('<div class="MainText">');
		H.push(aParam.html);
		H.push("</div>");
		return H.join("");
	}
	composeHtmlInfoSecondaire(aParam) {
		const H = [];
		H.push('<div class="SecondaryText-container">');
		if (aParam.icon) {
			H.push(
				'<i role="presentation" class="SecondaryText ',
				aParam.icon,
				'"></i>',
			);
		} else if (aParam.htmlIconInfo) {
			H.push(
				'<div class="SecondaryText iconic">',
				aParam.htmlIconInfo,
				"</div>",
			);
		}
		H.push('<span class="SecondaryText">', aParam.libelleInfo, "</span>");
		H.push("</div>");
		return H.join("");
	}
	composeHtmlPJ(aListePJ) {
		const lHtmlPJ = [];
		if (!!aListePJ) {
			lHtmlPJ.push(UtilitaireUrl_1.UtilitaireUrl.construireListeUrls(aListePJ));
		}
		return lHtmlPJ.join("");
	}
}
exports.BlocCard = BlocCard;
