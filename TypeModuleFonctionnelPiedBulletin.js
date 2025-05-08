exports.TypeModuleFonctionnelPiedBulletinUtil =
	exports.TypeModuleFonctionnelPiedBulletin = void 0;
var TypeModuleFonctionnelPiedBulletin;
(function (TypeModuleFonctionnelPiedBulletin) {
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_VieScolaire"] = 0)
	] = "MFPB_VieScolaire";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Certificats"] = 1)
	] = "MFPB_Certificats";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Appreciations"] = 2)
	] = "MFPB_Appreciations";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_ParcoursEducatif"] = 3)
	] = "MFPB_ParcoursEducatif";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Competences"] = 4)
	] = "MFPB_Competences";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Stages"] = 5)
	] = "MFPB_Stages";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Orientations"] = 6)
	] = "MFPB_Orientations";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Mentions"] = 7)
	] = "MFPB_Mentions";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Legende"] = 8)
	] = "MFPB_Legende";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Projets"] = 9)
	] = "MFPB_Projets";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Credits"] = 10)
	] = "MFPB_Credits";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin[
			"MFPB_Appreciations_Generales_Annuelles"
		] = 11)
	] = "MFPB_Appreciations_Generales_Annuelles";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Appreciations_Annuelles"] = 12)
	] = "MFPB_Appreciations_Annuelles";
	TypeModuleFonctionnelPiedBulletin[
		(TypeModuleFonctionnelPiedBulletin["MFPB_Engagements"] = 13)
	] = "MFPB_Engagements";
})(
	TypeModuleFonctionnelPiedBulletin ||
		(exports.TypeModuleFonctionnelPiedBulletin =
			TypeModuleFonctionnelPiedBulletin =
				{}),
);
const ObjetTraduction_1 = require("ObjetTraduction");
const MethodesObjet_1 = require("MethodesObjet");
const TypeModuleFonctionnelPiedBulletinUtil = {
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeModuleFonctionnelPiedBulletin.MFPB_ParcoursEducatif:
				return ObjetTraduction_1.GTraductions.getValeur(
					"ParcoursPeda.ComboGenreParcours",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Stages:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.Onglet.Titre.Stages",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Competences:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.Competences",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Orientations:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.Orientations",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations:
				return ObjetTraduction_1.GTraductions.getValeur("ConseilDeClasse");
			case TypeModuleFonctionnelPiedBulletin.MFPB_Mentions:
				return ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.Mentions",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Certificats:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheEleve.attestations",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Credits:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.CreditsAnnuel",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Annuelles:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.AppreciationsAnnuelles",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Appreciations_Generales_Annuelles:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.AppreciationsAnnuellesGenerales",
				);
			case TypeModuleFonctionnelPiedBulletin.MFPB_Engagements:
				return ObjetTraduction_1.GTraductions.getValeur(
					"PiedDeBulletin.Engagements",
				);
		}
		return "";
	},
	getTabTousLesModules() {
		const lTousModules = [];
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeModuleFonctionnelPiedBulletin,
		)) {
			const lValeurEnum = TypeModuleFonctionnelPiedBulletin[lKey];
			lTousModules.push(lValeurEnum);
		}
		return lTousModules;
	},
};
exports.TypeModuleFonctionnelPiedBulletinUtil =
	TypeModuleFonctionnelPiedBulletinUtil;
