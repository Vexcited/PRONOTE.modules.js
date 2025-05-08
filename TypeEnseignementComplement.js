exports.TypeEnseignementComplementUtil = exports.TypeEnseignementComplement =
	void 0;
var TypeEnseignementComplement;
(function (TypeEnseignementComplement) {
	TypeEnseignementComplement[(TypeEnseignementComplement["tecAucun"] = 0)] =
		"tecAucun";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecLangueEtCultureAntiquite"] = 1)
	] = "tecLangueEtCultureAntiquite";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecLangueEtCultureRegionale"] = 2)
	] = "tecLangueEtCultureRegionale";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecDecouverteProfessionnelle"] = 3)
	] = "tecDecouverteProfessionnelle";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecLanguesDesSignes"] = 4)
	] = "tecLanguesDesSignes";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecLangueVivanteEtrangere"] = 5)
	] = "tecLangueVivanteEtrangere";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecLangueEtCultureEuropeennes"] = 6)
	] = "tecLangueEtCultureEuropeennes";
	TypeEnseignementComplement[
		(TypeEnseignementComplement["tecChantChoral"] = 7)
	] = "tecChantChoral";
})(
	TypeEnseignementComplement ||
		(exports.TypeEnseignementComplement = TypeEnseignementComplement = {}),
);
const MethodesObjet_1 = require("MethodesObjet");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeEnseignementComplementUtil = {
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeEnseignementComplement.tecAucun:
				return "";
			case TypeEnseignementComplement.tecLangueEtCultureRegionale:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueEtCultureRegionales",
				);
			case TypeEnseignementComplement.tecLangueEtCultureAntiquite:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueEtCultureDeLAntiquite",
				);
			case TypeEnseignementComplement.tecDecouverteProfessionnelle:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.DecouverteProfessionnelle",
				);
			case TypeEnseignementComplement.tecLanguesDesSignes:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueDesSignes",
				);
			case TypeEnseignementComplement.tecLangueVivanteEtrangere:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueVivanteEtrangere",
				);
			case TypeEnseignementComplement.tecLangueEtCultureEuropeennes:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueEtCultureEuropeenne",
				);
			case TypeEnseignementComplement.tecChantChoral:
				return ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.ChantChoral",
				);
			default:
				return "";
		}
	},
	getType(aLibelle) {
		if (aLibelle === "") {
			return TypeEnseignementComplement.tecAucun;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueEtCultureDeLAntiquite",
				),
			)
		) {
			return TypeEnseignementComplement.tecLangueEtCultureAntiquite;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueEtCultureRegionales",
				),
			)
		) {
			return TypeEnseignementComplement.tecLangueEtCultureRegionale;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.DecouverteProfessionnelle",
				),
			)
		) {
			return TypeEnseignementComplement.tecDecouverteProfessionnelle;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueDesSignes",
				),
			)
		) {
			return TypeEnseignementComplement.tecLanguesDesSignes;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueVivanteEtrangere",
				),
			)
		) {
			return TypeEnseignementComplement.tecLangueVivanteEtrangere;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.LangueEtCultureEuropeenne",
				),
			)
		) {
			return TypeEnseignementComplement.tecLangueEtCultureEuropeennes;
		} else if (
			ObjetChaine_1.GChaine.estChaineHTMLEgal(
				aLibelle,
				ObjetTraduction_1.GTraductions.getValeur(
					"FicheBrevet.EnseignementComplement.ChantChoral",
				),
			)
		) {
			return TypeEnseignementComplement.tecChantChoral;
		} else {
			return TypeEnseignementComplement.tecAucun;
		}
	},
	toListe() {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeEnseignementComplement,
		)) {
			const lRendu = TypeEnseignementComplement[lKey];
			const lElement = new ObjetElement_1.ObjetElement(
				TypeEnseignementComplementUtil.getLibelle(lRendu),
				undefined,
				lRendu,
			);
			lListe.addElement(lElement);
		}
		lListe.setTri([ObjetTri_1.ObjetTri.init("Libelle")]);
		lListe.trier();
		return lListe;
	},
};
exports.TypeEnseignementComplementUtil = TypeEnseignementComplementUtil;
