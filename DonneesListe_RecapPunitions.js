exports.DonneesListe_RecapPunitions = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_RecapPunitions extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aLigneCumul) {
		super(aDonnees);
		this.ligneCumul = aLigneCumul;
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEtatSaisie: false,
			avecTri: false,
		});
	}
	estColonnePunition(aIdColonne) {
		return (
			aIdColonne.indexOf(
				DonneesListe_RecapPunitions.colonnes.prefixe_punition,
			) === 0
		);
	}
	estColonneSanction(aIdColonne) {
		return (
			aIdColonne.indexOf(
				DonneesListe_RecapPunitions.colonnes.prefixe_sanction,
			) === 0
		);
	}
	getIndicePunitionDeColonne(aIdColonne) {
		return parseInt(
			aIdColonne.substring(
				DonneesListe_RecapPunitions.colonnes.prefixe_punition.length,
			),
		);
	}
	getIndiceSanctionDeColonne(aIdColonne) {
		return parseInt(
			aIdColonne.substring(
				DonneesListe_RecapPunitions.colonnes.prefixe_sanction.length,
			),
		);
	}
	getNombrePunitionsDeColonne(aIdColonne, aArticle) {
		const lIndicePunition = this.getIndicePunitionDeColonne(aIdColonne);
		const lEltPunition = !!aArticle.listeRubriquePunition
			? aArticle.listeRubriquePunition.get(lIndicePunition)
			: null;
		return !!lEltPunition && !!lEltPunition.nbPunitions
			? lEltPunition.nbPunitions
			: 0;
	}
	getNombreSanctionsDeColonne(aIdColonne, aArticle) {
		const lIndiceSanction = this.getIndiceSanctionDeColonne(aIdColonne);
		const lEltSanction = !!aArticle.listeRubriqueSanction
			? aArticle.listeRubriqueSanction.get(lIndiceSanction)
			: null;
		return !!lEltSanction && !!lEltSanction.nbSanctions
			? lEltSanction.nbSanctions
			: 0;
	}
	avecMenuContextuel() {
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			this.estColonnePunition(aParams.idColonne) ||
			this.estColonneSanction(aParams.idColonne)
		) {
			lClasses.push("AlignementMilieu");
			let lContientDonnees = false;
			if (this.estColonnePunition(aParams.idColonne)) {
				lContientDonnees = !!this.getNombrePunitionsDeColonne(
					aParams.idColonne,
					aParams.article,
				);
			} else {
				lContientDonnees = !!this.getNombreSanctionsDeColonne(
					aParams.idColonne,
					aParams.article,
				);
			}
			if (lContientDonnees) {
				lClasses.push("AvecMain");
			}
		}
		return lClasses.join(" ");
	}
	getClassTotal(aParams) {
		const lClasses = ["Gras"];
		if (
			![
				DonneesListe_RecapPunitions.colonnes.eleves,
				DonneesListe_RecapPunitions.colonnes.classes,
			].includes(aParams.idColonne)
		) {
			lClasses.push("AlignementMilieu");
		}
		return lClasses.join(" ");
	}
	avecEvenementSelectionClick(aParams) {
		if (this.estColonnePunition(aParams.idColonne)) {
			const lNbPunitions = this.getNombrePunitionsDeColonne(
				aParams.idColonne,
				aParams.article,
			);
			return !!lNbPunitions;
		} else if (this.estColonneSanction(aParams.idColonne)) {
			const lNbSanctions = this.getNombreSanctionsDeColonne(
				aParams.idColonne,
				aParams.article,
			);
			return !!lNbSanctions;
		}
		return false;
	}
	getValeur(aParams) {
		if (this.estColonnePunition(aParams.idColonne)) {
			const lNbPunitions = this.getNombrePunitionsDeColonne(
				aParams.idColonne,
				aParams.article,
			);
			return !!lNbPunitions ? lNbPunitions.toString() : "-";
		} else if (this.estColonneSanction(aParams.idColonne)) {
			const lNbSanctions = this.getNombreSanctionsDeColonne(
				aParams.idColonne,
				aParams.article,
			);
			return !!lNbSanctions ? lNbSanctions.toString() : "-";
		} else {
			switch (aParams.idColonne) {
				case DonneesListe_RecapPunitions.colonnes.eleves:
					return !!aParams.article.eleve
						? aParams.article.eleve.getLibelle()
						: "";
				case DonneesListe_RecapPunitions.colonnes.classes:
					return !!aParams.article.classe
						? aParams.article.classe.getLibelle()
						: "";
				case DonneesListe_RecapPunitions.colonnes.dateNaissance:
					return !!aParams.article.DateNaissance
						? ObjetDate_1.GDate.formatDate(
								aParams.article.DateNaissance,
								"%JJ/%MM/%AAAA",
							)
						: "";
				case DonneesListe_RecapPunitions.colonnes.regimes:
					return !!aParams.article.regime
						? aParams.article.regime.getLibelle()
						: "";
			}
		}
		return "";
	}
	getContenuTotal(aParams) {
		if (this.ligneCumul) {
			if (this.estColonnePunition(aParams.idColonne)) {
				const lIndicePunition = this.getIndicePunitionDeColonne(
					aParams.idColonne,
				);
				const lPunition = !!this.ligneCumul.listeRubriquePunition
					? this.ligneCumul.listeRubriquePunition.get(lIndicePunition)
					: null;
				return !!lPunition && !!lPunition.nbPunitions
					? lPunition.nbPunitions
					: "-";
			} else if (this.estColonneSanction(aParams.idColonne)) {
				const lIndiceSanction = this.getIndiceSanctionDeColonne(
					aParams.idColonne,
				);
				const lSanction = !!this.ligneCumul.listeRubriqueSanction
					? this.ligneCumul.listeRubriqueSanction.get(lIndiceSanction)
					: null;
				return !!lSanction && !!lSanction.nbSanctions
					? lSanction.nbSanctions
					: "-";
			} else {
				switch (aParams.idColonne) {
					case DonneesListe_RecapPunitions.colonnes.eleves:
						return ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur("RecapAbs.NbEleves"),
							[this.ligneCumul.nbEleves],
						);
					case DonneesListe_RecapPunitions.colonnes.classes:
						return ObjetChaine_1.GChaine.format(
							ObjetTraduction_1.GTraductions.getValeur("RecapAbs.NbClasses"),
							[this.ligneCumul.nbClasses],
						);
				}
			}
		}
		return "";
	}
}
exports.DonneesListe_RecapPunitions = DonneesListe_RecapPunitions;
DonneesListe_RecapPunitions.colonnes = {
	eleves: "DL_RecapPun_eleves",
	classes: "DL_RecapPun_classes",
	dateNaissance: "DL_RecapPun_dateNaiss",
	regimes: "DL_RecapPun_regimes",
	prefixe_punition: "DL_RecapPun_pun_",
	prefixe_sanction: "DL_RecapPun_san_",
};
