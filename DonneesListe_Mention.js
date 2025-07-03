exports.DonneesListe_Mention = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_Mention extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEvnt_Selection: true,
		});
	}
	fusionCelluleAvecColonnePrecedente(aParams) {
		if (
			aParams.idColonne === DonneesListe_Mention.colonnes.imprimee &&
			!aParams.article.existeNumero()
		) {
			return true;
		}
		return false;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Mention.colonnes.libelle: {
				let lLibelle = "";
				if (!!aParams.article) {
					lLibelle = aParams.article.Libelle;
					if (!!aParams.article.strCode) {
						lLibelle += " (" + aParams.article.strCode + ")";
					}
				}
				return lLibelle;
			}
			case DonneesListe_Mention.colonnes.imprimee:
				return aParams.article.imprimee;
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Mention.colonnes.imprimee:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTooltip(aParams) {
		if (aParams.idColonne === DonneesListe_Mention.colonnes.imprimee) {
			if (!aParams.article.existeNumero()) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.HintAucuneMention",
				);
			} else if (aParams.article.imprimee) {
				return ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.HintImprimeeDansLesDocuments",
				);
			} else {
				return ObjetTraduction_1.GTraductions.getValeur(
					"Appreciations.HintNonImprimeeDansLesDocuments",
				);
			}
		}
		return "";
	}
}
exports.DonneesListe_Mention = DonneesListe_Mention;
(function (DonneesListe_Mention) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "Mention_libelle";
		colonnes["imprimee"] = "Mention_imprimee";
	})(
		(colonnes =
			DonneesListe_Mention.colonnes || (DonneesListe_Mention.colonnes = {})),
	);
})(
	DonneesListe_Mention ||
		(exports.DonneesListe_Mention = DonneesListe_Mention = {}),
);
