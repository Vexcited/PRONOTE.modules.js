exports.DonneesListe_ListeAttestations = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetDroitsPN_1 = require("ObjetDroitsPN");
const AccessApp_1 = require("AccessApp");
class DonneesListe_ListeAttestations extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.avecSaisie =
			(0, AccessApp_1.getApp)().droits.get(
				ObjetDroitsPN_1.TypeDroits.eleves.avecSaisieAttestations,
			) || (0, AccessApp_1.getApp)().getEtatUtilisateur().pourPrimaire();
		this.param = { avecValidationAuto: false };
		this.setOptions({ avecEvnt_Creation: true });
	}
	setParametres(aParam) {
		$.extend(this.param, aParam);
	}
	avecMenuContextuel() {
		return false;
	}
	avecSuppression() {
		return this.avecSaisie;
	}
	avecEdition(aParams) {
		if (this.avecSaisie) {
			switch (aParams.idColonne) {
				case DonneesListe_ListeAttestations.colonnes.etat:
					return true;
				case DonneesListe_ListeAttestations.colonnes.date:
					return !!aParams.article.delivree;
			}
		}
		return false;
	}
	avecEvenementSelection(aParams) {
		return aParams.idColonne === DonneesListe_ListeAttestations.colonnes.date;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeAttestations.colonnes.etat:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Image;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getClassCelluleConteneur(aParams) {
		return aParams.idColonne === DonneesListe_ListeAttestations.colonnes.etat
			? "AvecMain"
			: "";
	}
	getStyle(aParams) {
		const lStyles = [];
		switch (aParams.idColonne) {
			case DonneesListe_ListeAttestations.colonnes.etat:
				lStyles.push("margin:0 auto;");
				break;
		}
		return lStyles.join("");
	}
	surEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeAttestations.colonnes.etat:
				aParams.article.delivree = !aParams.article.delivree;
				if (!aParams.article.date) {
					aParams.article.date = new Date();
				}
				break;
		}
	}
	getTri() {
		return [ObjetTri_1.ObjetTri.init("abbreviation")];
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeAttestations.colonnes.libelle:
				return aParams.article.abbreviation;
			case DonneesListe_ListeAttestations.colonnes.libelleLong:
				return aParams.article.getLibelle();
			case DonneesListe_ListeAttestations.colonnes.descriptif:
				return aParams.article.descriptif;
			case DonneesListe_ListeAttestations.colonnes.etat:
				return aParams.article.delivree
					? "Image_DiodeVerte"
					: aParams.article.delivree === undefined
						? ""
						: "Image_DiodeGrise";
			case DonneesListe_ListeAttestations.colonnes.date: {
				let lStrDateDelivree = "";
				if (aParams.article.delivree) {
					let lStrDate = "";
					if (aParams.article.date) {
						lStrDate =
							" " +
							ObjetDate_1.GDate.formatDate(
								aParams.article.date,
								"%JJ/%MM/%AAAA",
							);
					}
					lStrDateDelivree =
						ObjetTraduction_1.GTraductions.getValeur("FicheEleve.delivree") +
						lStrDate;
				} else {
					lStrDateDelivree =
						aParams.article.delivree === undefined
							? ""
							: ObjetTraduction_1.GTraductions.getValeur(
									"FicheEleve.nonDelivree",
								);
				}
				return lStrDateDelivree;
			}
		}
		return "";
	}
	avecEtatSaisie() {
		return this.param.avecValidationAuto !== true;
	}
	avecEvenementApresEdition() {
		return this.param.avecValidationAuto === true;
	}
}
exports.DonneesListe_ListeAttestations = DonneesListe_ListeAttestations;
(function (DonneesListe_ListeAttestations) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "libelle";
		colonnes["libelleLong"] = "libelleLong";
		colonnes["etat"] = "etat";
		colonnes["date"] = "date";
		colonnes["descriptif"] = "descriptif";
	})(
		(colonnes =
			DonneesListe_ListeAttestations.colonnes ||
			(DonneesListe_ListeAttestations.colonnes = {})),
	);
})(
	DonneesListe_ListeAttestations ||
		(exports.DonneesListe_ListeAttestations = DonneesListe_ListeAttestations =
			{}),
);
