exports.DonneesListe_RecapPunitions = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const TypeSexe_1 = require("TypeSexe");
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
	estColonneCommission(aIdColonne) {
		return (
			aIdColonne.indexOf(
				DonneesListe_RecapPunitions.colonnes.prefixe_commission,
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
	getIndiceCommissionDeColonne(aIdColonne) {
		return parseInt(
			aIdColonne.substring(
				DonneesListe_RecapPunitions.colonnes.prefixe_commission.length,
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
	getNombreCommissionDeColonne(aIdColonne, aArticle) {
		const lIndiceCommission = this.getIndiceCommissionDeColonne(aIdColonne);
		const lEltCommission = !!aArticle.listeCommissions
			? aArticle.listeCommissions.get(lIndiceCommission)
			: null;
		return !!lEltCommission && !!lEltCommission.nombre
			? lEltCommission.nombre
			: 0;
	}
	avecMenuContextuel() {
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		if (
			this.estColonnePunition(aParams.idColonne) ||
			this.estColonneSanction(aParams.idColonne) ||
			this.estColonneCommission(aParams.idColonne) ||
			[
				DonneesListe_RecapPunitions.colonnes.mesuresConservatoire,
				DonneesListe_RecapPunitions.colonnes.sexe,
			].includes(aParams.idColonne)
		) {
			lClasses.push("AlignementMilieu");
			let lContientDonnees = false;
			if (this.estColonnePunition(aParams.idColonne)) {
				lContientDonnees = !!this.getNombrePunitionsDeColonne(
					aParams.idColonne,
					aParams.article,
				);
			} else if (this.estColonneSanction(aParams.idColonne)) {
				lContientDonnees = !!this.getNombreSanctionsDeColonne(
					aParams.idColonne,
					aParams.article,
				);
			} else if (this.estColonneCommission(aParams.idColonne)) {
				lContientDonnees = !!this.getNombreCommissionDeColonne(
					aParams.idColonne,
					aParams.article,
				);
			} else {
				lContientDonnees =
					aParams.article.mesureConservatoire &&
					aParams.article.mesureConservatoire.nombre > 0;
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
		var _a, _b;
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
		} else if (this.estColonneCommission(aParams.idColonne)) {
			const lNbCommissions = this.getNombreCommissionDeColonne(
				aParams.idColonne,
				aParams.article,
			);
			return !!lNbCommissions;
		} else if (
			aParams.idColonne ===
			DonneesListe_RecapPunitions.colonnes.mesuresConservatoire
		) {
			return (
				((_b =
					(_a = aParams.article) === null || _a === void 0
						? void 0
						: _a.mesureConservatoire) === null || _b === void 0
					? void 0
					: _b.nombre) && aParams.article.mesureConservatoire.nombre > 0
			);
		}
		return false;
	}
	getValeur(aParams) {
		var _a, _b, _c, _d;
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
		} else if (this.estColonneCommission(aParams.idColonne)) {
			const lNbCommission = this.getNombreCommissionDeColonne(
				aParams.idColonne,
				aParams.article,
			);
			return !!lNbCommission ? lNbCommission.toString() : "-";
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
				case DonneesListe_RecapPunitions.colonnes.age:
					return aParams.article.strAge;
				case DonneesListe_RecapPunitions.colonnes.sexe:
					return "sexe" in aParams.article
						? IE.jsx.str("i", {
								class: [
									"icon",
									"i-medium",
									TypeSexe_1.TypeSexeUtil.getClasse(
										aParams.article.sexe,
										false,
									),
								],
								title: TypeSexe_1.TypeSexeUtil.getLibelle(aParams.article.sexe),
								role: "img",
							})
						: "";
				case DonneesListe_RecapPunitions.colonnes.regimes:
					return !!aParams.article.regime
						? aParams.article.regime.getLibelle()
						: "";
				case DonneesListe_RecapPunitions.colonnes.mesuresConservatoire:
					return (
						(_b =
							(_a = aParams.article) === null || _a === void 0
								? void 0
								: _a.mesureConservatoire) === null || _b === void 0
							? void 0
							: _b.nombre
					)
						? (_d =
								(_c = aParams.article) === null || _c === void 0
									? void 0
									: _c.mesureConservatoire) === null || _d === void 0
							? void 0
							: _d.nombre.toString()
						: "-";
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
			} else if (this.estColonneCommission(aParams.idColonne)) {
				const LIndiceCommission = this.getIndiceCommissionDeColonne(
					aParams.idColonne,
				);
				const lCommission = !!this.ligneCumul.listeCommissions
					? this.ligneCumul.listeCommissions.get(LIndiceCommission)
					: null;
				return !!lCommission && !!lCommission.nombre ? lCommission.nombre : "-";
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
					case DonneesListe_RecapPunitions.colonnes.mesuresConservatoire:
						return !!this.ligneCumul.nbMesureConservatoire
							? this.ligneCumul.nbMesureConservatoire
							: "-";
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
	age: "DL_RecapPun_age",
	sexe: "DL_RecapPun_sexe",
	regimes: "DL_RecapPun_regimes",
	prefixe_punition: "DL_RecapPun_pun_",
	prefixe_sanction: "DL_RecapPun_san_",
	mesuresConservatoire: "DL_RecapPun_MC",
	prefixe_commission: "DL_RecapPun_commisison_",
};
