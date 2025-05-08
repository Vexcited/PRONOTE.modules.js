exports.TypeGenreRenduTAFUtil = exports.TypeGenreRenduTAF = void 0;
var TypeGenreRenduTAF;
(function (TypeGenreRenduTAF) {
	TypeGenreRenduTAF[(TypeGenreRenduTAF["GRTAF_AucunRendu"] = 0)] =
		"GRTAF_AucunRendu";
	TypeGenreRenduTAF[(TypeGenreRenduTAF["GRTAF_RenduPapier"] = 1)] =
		"GRTAF_RenduPapier";
	TypeGenreRenduTAF[(TypeGenreRenduTAF["GRTAF_RenduPronote"] = 2)] =
		"GRTAF_RenduPronote";
	TypeGenreRenduTAF[(TypeGenreRenduTAF["GRTAF_RenduKiosque"] = 3)] =
		"GRTAF_RenduKiosque";
	TypeGenreRenduTAF[
		(TypeGenreRenduTAF["GRTAF_RenduPronoteEnregistrementAudio"] = 4)
	] = "GRTAF_RenduPronoteEnregistrementAudio";
})(TypeGenreRenduTAF || (exports.TypeGenreRenduTAF = TypeGenreRenduTAF = {}));
const MethodesObjet_1 = require("MethodesObjet");
const ObjetElement_1 = require("ObjetElement");
const ObjetListeElements_1 = require("ObjetListeElements");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const TypeGenreRenduTAFUtil = {
	estGenreValable(aGenre) {
		const lParametresPN = GParametres;
		let lResult = true;
		if (
			lParametresPN &&
			lParametresPN.general &&
			lParametresPN.general.genresRenduTAFValable
		) {
			lResult = lParametresPN.general.genresRenduTAFValable.contains(aGenre);
		}
		return lResult;
	},
	getDureeMaxEnregistrementAudio() {
		const lParametresPN = GParametres;
		let lTailleMax = 30;
		if (
			lParametresPN &&
			lParametresPN.general &&
			lParametresPN.general.tailleMaxEnregistrementAudioRenduTAF
		) {
			lTailleMax =
				lParametresPN.general.tailleMaxEnregistrementAudioRenduTAF * 60;
		}
		return lTailleMax;
	},
	getLibelle(aGenre) {
		switch (aGenre) {
			case TypeGenreRenduTAF.GRTAF_AucunRendu:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.AucunRenduPrevu",
				);
			case TypeGenreRenduTAF.GRTAF_RenduPapier:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.ARemettre",
				);
			case TypeGenreRenduTAF.GRTAF_RenduPronote:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.ADeposer",
				);
			case TypeGenreRenduTAF.GRTAF_RenduKiosque:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.ACompleterEditeur",
				);
			case TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.EnregistrementADeposer",
				);
			default:
		}
		return "";
	},
	getOrdre(aGenre) {
		return [0, 1, 2, 3, 4][aGenre];
	},
	toElement(aGenre) {
		const lElement = new ObjetElement_1.ObjetElement(
			TypeGenreRenduTAFUtil.getLibelle(aGenre),
			0,
			aGenre,
		);
		lElement.ordre = TypeGenreRenduTAFUtil.getOrdre(aGenre);
		return lElement;
	},
	fromElement(aElt) {
		return aElt !== null && aElt !== undefined
			? aElt.getGenre()
			: TypeGenreRenduTAF.GRTAF_AucunRendu;
	},
	toListe(aGenresAExclure) {
		const lListe = new ObjetListeElements_1.ObjetListeElements();
		for (const lKey of MethodesObjet_1.MethodesObjet.enumKeys(
			TypeGenreRenduTAF,
		)) {
			const lRendu = TypeGenreRenduTAF[lKey];
			if (
				TypeGenreRenduTAFUtil.estGenreValable(lRendu) &&
				(!aGenresAExclure || !aGenresAExclure.includes(lRendu))
			) {
				let lElement = TypeGenreRenduTAFUtil.toElement(lRendu);
				lListe.addElement(lElement);
			}
		}
		lListe.setTri([ObjetTri_1.ObjetTri.init("ordre")]);
		lListe.trier();
		return lListe;
	},
	estUnRenduEnligne(aGenre, aInclureKiosque = true) {
		if (aGenre === undefined || aGenre === null) {
			return false;
		}
		const lArrTypes = [
			TypeGenreRenduTAF.GRTAF_RenduPronote,
			TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio,
		];
		if (aInclureKiosque !== false) {
			lArrTypes.push(TypeGenreRenduTAF.GRTAF_RenduKiosque);
		}
		return lArrTypes.includes(aGenre);
	},
	estUnRenduPapier(aGenre) {
		if (aGenre === undefined || aGenre === null) {
			return false;
		}
		return [TypeGenreRenduTAF.GRTAF_RenduPapier].includes(aGenre);
	},
	estSansRendu(aGenre) {
		if (aGenre === undefined || aGenre === null) {
			return true;
		}
		return [TypeGenreRenduTAF.GRTAF_AucunRendu].includes(aGenre);
	},
	estUnRenduKiosque(aGenre) {
		if (aGenre === undefined || aGenre === null) {
			return false;
		}
		return [TypeGenreRenduTAF.GRTAF_RenduKiosque].includes(aGenre);
	},
	estUnRenduMedia(aGenre) {
		if (aGenre === undefined || aGenre === null) {
			return false;
		}
		return [TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio].includes(
			aGenre,
		);
	},
	getLibelleConsultation(aGenre, aPourEleve) {
		switch (aGenre) {
			case TypeGenreRenduTAF.GRTAF_AucunRendu:
				return "";
			case TypeGenreRenduTAF.GRTAF_RenduPapier:
				return "";
			case TypeGenreRenduTAF.GRTAF_RenduPronote:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.Eleve.CopieDeposee",
				);
			case TypeGenreRenduTAF.GRTAF_RenduKiosque:
				return aPourEleve
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.Eleve.ConsulterMesReponses",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.Eleve.ConsulterLesReponses",
						);
			case TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio:
				return ObjetTraduction_1.GTraductions.getValeur(
					"EnregistrementAudio.depose",
				);
		}
		return "";
	},
	getLibelleDeposer(aGenre, aPourEleve) {
		switch (aGenre) {
			case TypeGenreRenduTAF.GRTAF_AucunRendu:
				return "";
			case TypeGenreRenduTAF.GRTAF_RenduPapier:
				return ObjetTraduction_1.GTraductions.getValeur(
					"CahierDeTexte.TAFARendre.Eleve.RenduPapier",
				);
			case TypeGenreRenduTAF.GRTAF_RenduPronote:
				return aPourEleve
					? GApplication.getEtatUtilisateur().pourPrimaire()
						? ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.Eleve.RenduPrimaire",
							)
						: ObjetTraduction_1.GTraductions.getValeur(
								"CahierDeTexte.TAFARendre.Eleve.RenduPronote",
							)
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.Eleve.RenduNumerique",
						);
			case TypeGenreRenduTAF.GRTAF_RenduKiosque:
				return aPourEleve
					? ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.ACompleterEditeurSite",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.ACompleterEditeur",
						);
			case TypeGenreRenduTAF.GRTAF_RenduPronoteEnregistrementAudio:
				return aPourEleve
					? ObjetTraduction_1.GTraductions.getValeur(
							"EnregistrementAudio.deposer",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"CahierDeTexte.TAFARendre.Eleve.RenduNumerique",
						);
		}
		return "";
	},
};
exports.TypeGenreRenduTAFUtil = TypeGenreRenduTAFUtil;
