exports.EGenreNiveauDAcquisitionUtil = exports.EGenreNiveauDAcquisition =
	void 0;
const TypeNote_1 = require("TypeNote");
const UtilitaireNiveauAcquisition_1 = require("UtilitaireNiveauAcquisition");
const AccessApp_1 = require("AccessApp");
var EGenreNiveauDAcquisition;
(function (EGenreNiveauDAcquisition) {
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["Multiple"] = 100)] =
		"Multiple";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["Utilisateur"] = 0)] =
		"Utilisateur";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["Expert"] = 1)] = "Expert";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["Acquis"] = 2)] = "Acquis";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["PresqueAcquis"] = 3)] =
		"PresqueAcquis";
	EGenreNiveauDAcquisition[
		(EGenreNiveauDAcquisition["EnCoursAcquisition"] = 4)
	] = "EnCoursAcquisition";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["DebutAcquisition"] = 5)] =
		"DebutAcquisition";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["NonAcquis"] = 6)] =
		"NonAcquis";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["Absent"] = 7)] = "Absent";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["NonEvalue"] = 8)] =
		"NonEvalue";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["Dispense"] = 9)] =
		"Dispense";
	EGenreNiveauDAcquisition[(EGenreNiveauDAcquisition["NonRendu"] = 10)] =
		"NonRendu";
})(
	EGenreNiveauDAcquisition ||
		(exports.EGenreNiveauDAcquisition = EGenreNiveauDAcquisition = {}),
);
exports.EGenreNiveauDAcquisitionUtil = {
	ordre() {
		return [
			EGenreNiveauDAcquisition.Expert,
			EGenreNiveauDAcquisition.Acquis,
			EGenreNiveauDAcquisition.PresqueAcquis,
			EGenreNiveauDAcquisition.EnCoursAcquisition,
			EGenreNiveauDAcquisition.DebutAcquisition,
			EGenreNiveauDAcquisition.NonAcquis,
			EGenreNiveauDAcquisition.Absent,
			EGenreNiveauDAcquisition.NonEvalue,
			EGenreNiveauDAcquisition.Dispense,
			EGenreNiveauDAcquisition.NonRendu,
			EGenreNiveauDAcquisition.Utilisateur,
		];
	},
	getLibelle(aNiveauDAcquisition) {
		return !!aNiveauDAcquisition ? aNiveauDAcquisition.getLibelle() : "";
	},
	getCouleur(aNiveauDAcquisition) {
		return !!aNiveauDAcquisition ? aNiveauDAcquisition.couleur : "white";
	},
	getImage(aNiveauAcquisition, aParams) {
		const H = [];
		if (!!aNiveauAcquisition) {
			const lLibelleNiveau = this.getLibelle(aNiveauAcquisition);
			const lValeurTitle =
				!aParams ||
				aParams.avecTitle ||
				aParams.avecTitle === null ||
				aParams.avecTitle === undefined
					? lLibelleNiveau
					: null;
			const lGenreNiveauAcquisition = aNiveauAcquisition.getGenre();
			if (
				GParametres.afficherAbbreviationNiveauDAcquisition ||
				GEtatUtilisateur.estAvecCodeCompetences()
			) {
				H.push(
					IE.jsx.str(
						"span",
						{
							"ie-tooltiplabel": (
								aParams === null || aParams === void 0
									? void 0
									: aParams.avecTitle
							)
								? lLibelleNiveau
								: false,
							"aria-label": (
								aParams === null || aParams === void 0
									? void 0
									: aParams.avecTitle
							)
								? false
								: lLibelleNiveau,
						},
						exports.EGenreNiveauDAcquisitionUtil.getAbbreviation(
							aNiveauAcquisition,
							aParams,
						),
					),
				);
			} else if (lGenreNiveauAcquisition >= EGenreNiveauDAcquisition.Expert) {
				const lCouleurIcon = getCouleurIcone(aNiveauAcquisition);
				let lContenuPastille;
				if (lGenreNiveauAcquisition === EGenreNiveauDAcquisition.Expert) {
					lContenuPastille = {
						valeur: "+",
						couleur: (0, AccessApp_1.getApp)()
							.getCouleur()
							.getCouleurCorrespondance(lCouleurIcon),
					};
				}
				H.push(
					UtilitaireNiveauAcquisition_1.UtilitaireNiveauAcquisition.getHtmlPastille(
						{
							estAnnotation:
								exports.EGenreNiveauDAcquisitionUtil.estUneAnnotation(
									aNiveauAcquisition,
								),
							title: lValeurTitle,
							nomIcone: getNomIcone(aNiveauAcquisition),
							couleurIcone: lCouleurIcon,
							contenu: lContenuPastille,
						},
					),
				);
			}
		}
		return H.join("");
	},
	getNombrePointsBrevet(aNiveauAcquisition) {
		return !!aNiveauAcquisition && !!aNiveauAcquisition.nombrePointsBrevet
			? aNiveauAcquisition.nombrePointsBrevet
			: new TypeNote_1.TypeNote("");
	},
	getPonderation(aNiveauDAcquisition) {
		return !!aNiveauDAcquisition
			? aNiveauDAcquisition.ponderation
			: new TypeNote_1.TypeNote("");
	},
	estUneAnnotation(aNiveauAcquisition) {
		const lGenreNiveauAcquisition = aNiveauAcquisition.getGenre();
		return [
			EGenreNiveauDAcquisition.Absent,
			EGenreNiveauDAcquisition.Dispense,
			EGenreNiveauDAcquisition.NonRendu,
		].includes(lGenreNiveauAcquisition);
	},
	getAbbreviation(aNiveauAcquisition, aParams) {
		return !!aNiveauAcquisition &&
			(aNiveauAcquisition.existeNumero() ||
				(!!aParams && aParams.afficherValeurPourNonRempli))
			? aNiveauAcquisition.abbreviation || ""
			: "";
	},
	getImagePositionnement(aParams) {
		const H = [];
		if (aParams.niveauDAcquisition) {
			const lNiveauDAcquisition = aParams.niveauDAcquisition;
			const lLibelle = this.getLibellePositionnement(aParams);
			const lValeurTitle =
				aParams.avecTitle ||
				aParams.avecTitle === null ||
				aParams.avecTitle === undefined
					? lLibelle
					: null;
			if (
				GParametres.afficherAbbreviationNiveauDAcquisition ||
				GEtatUtilisateur.estAvecCodeCompetences()
			) {
				H.push(
					IE.jsx.str(
						"span",
						{ "ie-tooltiplabel": lLibelle },
						getAbbreviationPositionnement(lNiveauDAcquisition, aParams),
					),
				);
			} else if (
				lNiveauDAcquisition.getGenre() >= EGenreNiveauDAcquisition.Expert
			) {
				const lCouleurIcone = getCouleurIcone(lNiveauDAcquisition);
				let lContenuPastille;
				if (
					lNiveauDAcquisition.getGenre() === EGenreNiveauDAcquisition.Expert
				) {
					lContenuPastille = { valeur: 4 };
				} else if (
					lNiveauDAcquisition.getGenre() === EGenreNiveauDAcquisition.Acquis
				) {
					lContenuPastille = { valeur: 3 };
				} else if (
					lNiveauDAcquisition.getGenre() ===
					EGenreNiveauDAcquisition.EnCoursAcquisition
				) {
					lContenuPastille = { valeur: 2 };
				} else if (
					lNiveauDAcquisition.getGenre() === EGenreNiveauDAcquisition.NonAcquis
				) {
					lContenuPastille = { valeur: 1 };
				}
				if (!!lContenuPastille) {
					lContenuPastille.couleur = (0, AccessApp_1.getApp)()
						.getCouleur()
						.getCouleurCorrespondance(lCouleurIcone);
				}
				H.push(
					UtilitaireNiveauAcquisition_1.UtilitaireNiveauAcquisition.getHtmlPastille(
						{
							estPastillePositionnement: true,
							estAnnotation:
								exports.EGenreNiveauDAcquisitionUtil.estUneAnnotation(
									lNiveauDAcquisition,
								),
							title: lValeurTitle,
							nomIcone: getNomIcone(lNiveauDAcquisition),
							couleurIcone: lCouleurIcone,
							contenu: lContenuPastille,
						},
					),
				);
			}
		}
		return H.join("");
	},
	getLibellePositionnement(aParams) {
		if (!aParams.niveauDAcquisition) {
			return "";
		}
		const lPositionnement =
			!!aParams.niveauDAcquisition.listePositionnements.count()
				? aParams.niveauDAcquisition.listePositionnements.getElementParGenre(
						aParams.genrePositionnement,
					)
				: null;
		return !!lPositionnement &&
			(lPositionnement.getLibelle() || !!aParams.avecPositionnementVide)
			? lPositionnement.getLibelle()
			: aParams.niveauDAcquisition.getLibelle();
	},
};
function getNomIcone(aNiveauAcquisition) {
	let lNomIcone;
	if (!!aNiveauAcquisition) {
		switch (aNiveauAcquisition.getGenre()) {
			case EGenreNiveauDAcquisition.Absent:
				return "icon_competence_absent";
			case EGenreNiveauDAcquisition.Dispense:
				return "icon_competence_dispense";
			case EGenreNiveauDAcquisition.NonRendu:
				return "icon_competence_non_rendu";
			default:
				return "";
		}
	}
	return lNomIcone;
}
function getCouleurIcone(aNiveauAcquisition) {
	let lCouleurIcon;
	if (!!aNiveauAcquisition) {
		if (
			exports.EGenreNiveauDAcquisitionUtil.estUneAnnotation(aNiveauAcquisition)
		) {
			lCouleurIcon = "#009ee1";
		} else {
			lCouleurIcon =
				exports.EGenreNiveauDAcquisitionUtil.getCouleur(aNiveauAcquisition);
		}
	}
	return lCouleurIcon;
}
function getAbbreviationPositionnement(aNiveauAcquisition, aParams) {
	const lPositionnement = aNiveauAcquisition.listePositionnements
		? aNiveauAcquisition.listePositionnements.getElementParGenre(
				aParams.genrePositionnement,
			)
		: null;
	let result = "";
	if (
		(!!lPositionnement && lPositionnement.abbreviation) ||
		aParams.avecPositionnementVide
	) {
		result = aParams.avecPrefixe
			? lPositionnement.abbreviationAvecPrefixe
			: lPositionnement.abbreviation;
	} else {
		result = exports.EGenreNiveauDAcquisitionUtil.getAbbreviation(
			aNiveauAcquisition,
			aParams,
		);
	}
	return result;
}
