exports.EGenreMediaUtil = exports.TypeOrigineCreationMedia = void 0;
var TypeOrigineCreationMedia;
(function (TypeOrigineCreationMedia) {
	TypeOrigineCreationMedia[(TypeOrigineCreationMedia["OCM_Utilisateur"] = 0)] =
		"OCM_Utilisateur";
	TypeOrigineCreationMedia[
		(TypeOrigineCreationMedia["OCM_Pre_Telephone"] = 1)
	] = "OCM_Pre_Telephone";
	TypeOrigineCreationMedia[(TypeOrigineCreationMedia["OCM_Pre_Lettre"] = 2)] =
		"OCM_Pre_Lettre";
	TypeOrigineCreationMedia[(TypeOrigineCreationMedia["OCM_Pre_Fax"] = 3)] =
		"OCM_Pre_Fax";
	TypeOrigineCreationMedia[(TypeOrigineCreationMedia["OCM_Pre_Mail"] = 4)] =
		"OCM_Pre_Mail";
	TypeOrigineCreationMedia[
		(TypeOrigineCreationMedia["OCM_Pre_Entretien"] = 5)
	] = "OCM_Pre_Entretien";
	TypeOrigineCreationMedia[(TypeOrigineCreationMedia["OCM_Pre_SMS"] = 6)] =
		"OCM_Pre_SMS";
	TypeOrigineCreationMedia[
		(TypeOrigineCreationMedia["OCM_Pre_LettreManuscrite"] = 7)
	] = "OCM_Pre_LettreManuscrite";
	TypeOrigineCreationMedia[
		(TypeOrigineCreationMedia["OCM_Pre_MessageRepondeur"] = 8)
	] = "OCM_Pre_MessageRepondeur";
	TypeOrigineCreationMedia[
		(TypeOrigineCreationMedia["OCM_Pre_SignatureElectronique"] = 9)
	] = "OCM_Pre_SignatureElectronique";
})(
	TypeOrigineCreationMedia ||
		(exports.TypeOrigineCreationMedia = TypeOrigineCreationMedia = {}),
);
const EGenreMediaUtil = {
	getClassesIconeMedia(aGenre, aReception) {
		let lIconeGenreMedia = "";
		if (aGenre > TypeOrigineCreationMedia.OCM_Utilisateur) {
			switch (aGenre) {
				case TypeOrigineCreationMedia.OCM_Pre_Telephone:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_phone;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_Lettre:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_envelope;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_Fax:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_tel_fax;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_Mail:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_arobase;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_Entretien:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_co_enseignement;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_SMS:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_mobile_phone;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_LettreManuscrite:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_plume;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_MessageRepondeur:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_uniF2A0;
					break;
				case TypeOrigineCreationMedia.OCM_Pre_SignatureElectronique:
					lIconeGenreMedia = fonts_css_1.StylesFonts.icon_signature;
					break;
			}
		}
		const lClasses = [];
		if (lIconeGenreMedia) {
			lClasses.push(lIconeGenreMedia);
			if (aReception) {
				lClasses.push("mix-icon_arrow_left", "i-red");
			} else {
				lClasses.push("mix-icon_arrow_right", "i-green");
			}
		}
		return lClasses.join(" ");
	},
};
exports.EGenreMediaUtil = EGenreMediaUtil;
