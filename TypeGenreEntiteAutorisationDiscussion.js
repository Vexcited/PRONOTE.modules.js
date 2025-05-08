exports.TypeGenreEntiteAutorisationDiscussionUtil =
	exports.TypeGenreEntiteAutorisationDiscussion = void 0;
const ObjetTraduction_1 = require("ObjetTraduction");
var TypeGenreEntiteAutorisationDiscussion;
(function (TypeGenreEntiteAutorisationDiscussion) {
	TypeGenreEntiteAutorisationDiscussion[
		(TypeGenreEntiteAutorisationDiscussion["AD_Classe"] = 0)
	] = "AD_Classe";
	TypeGenreEntiteAutorisationDiscussion[
		(TypeGenreEntiteAutorisationDiscussion["AD_Groupe"] = 1)
	] = "AD_Groupe";
	TypeGenreEntiteAutorisationDiscussion[
		(TypeGenreEntiteAutorisationDiscussion["AD_MesClassesGroupes"] = 2)
	] = "AD_MesClassesGroupes";
	TypeGenreEntiteAutorisationDiscussion[
		(TypeGenreEntiteAutorisationDiscussion["AD_Tout"] = 3)
	] = "AD_Tout";
	TypeGenreEntiteAutorisationDiscussion[
		(TypeGenreEntiteAutorisationDiscussion["AD_Personnalise"] = 4)
	] = "AD_Personnalise";
})(
	TypeGenreEntiteAutorisationDiscussion ||
		(exports.TypeGenreEntiteAutorisationDiscussion =
			TypeGenreEntiteAutorisationDiscussion =
				{}),
);
exports.TypeGenreEntiteAutorisationDiscussionUtil = {
	getLibelle(aGenre) {
		let LLibelle = "";
		switch (aGenre) {
			case TypeGenreEntiteAutorisationDiscussion.AD_MesClassesGroupes:
				LLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.discussion.mesClassesGroupes",
				);
				break;
			case TypeGenreEntiteAutorisationDiscussion.AD_Tout:
				LLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.discussion.tous",
				);
				break;
			case TypeGenreEntiteAutorisationDiscussion.AD_Personnalise:
				LLibelle = ObjetTraduction_1.GTraductions.getValeur(
					"infosperso.discussion.personnalises",
				);
				break;
			default:
				break;
		}
		return LLibelle;
	},
};
