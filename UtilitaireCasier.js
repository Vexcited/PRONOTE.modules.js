exports.UtilitaireCasier = void 0;
const TypeCasier_1 = require("TypeCasier");
const ObjetDate_1 = require("ObjetDate");
const ChoixDestinatairesParCriteres_1 = require("ChoixDestinatairesParCriteres");
const ObjetListeElements_1 = require("ObjetListeElements");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const ObjetFenetre_ChoixDestinatairesParCriteres_1 = require("ObjetFenetre_ChoixDestinatairesParCriteres");
const ObjetTraduction_1 = require("ObjetTraduction");
var UtilitaireCasier;
(function (UtilitaireCasier) {
	let EGenreRubriqueCasier;
	(function (EGenreRubriqueCasier) {
		EGenreRubriqueCasier[(EGenreRubriqueCasier["monCasier"] = 1)] = "monCasier";
		EGenreRubriqueCasier[(EGenreRubriqueCasier["depositaire"] = 2)] =
			"depositaire";
		EGenreRubriqueCasier[(EGenreRubriqueCasier["responsable"] = 3)] =
			"responsable";
		EGenreRubriqueCasier[(EGenreRubriqueCasier["collecteParDocument"] = 4)] =
			"collecteParDocument";
		EGenreRubriqueCasier[(EGenreRubriqueCasier["collecteParEleve"] = 5)] =
			"collecteParEleve";
		EGenreRubriqueCasier[(EGenreRubriqueCasier["documentsASigner"] = 6)] =
			"documentsASigner";
	})(
		(EGenreRubriqueCasier =
			UtilitaireCasier.EGenreRubriqueCasier ||
			(UtilitaireCasier.EGenreRubriqueCasier = {})),
	);
	let EGenrefonctionnalite;
	(function (EGenrefonctionnalite) {
		EGenrefonctionnalite[(EGenrefonctionnalite["creationDoc"] = 1)] =
			"creationDoc";
		EGenrefonctionnalite[(EGenrefonctionnalite["suppressionDoc"] = 2)] =
			"suppressionDoc";
		EGenrefonctionnalite[(EGenrefonctionnalite["miseAJourDoc"] = 3)] =
			"miseAJourDoc";
		EGenrefonctionnalite[
			(EGenrefonctionnalite["notificationOuvertureDoc"] = 4)
		] = "notificationOuvertureDoc";
		EGenrefonctionnalite[(EGenrefonctionnalite["telecharger"] = 8)] =
			"telecharger";
		EGenrefonctionnalite[(EGenrefonctionnalite["consulterLeMemo"] = 9)] =
			"consulterLeMemo";
		EGenrefonctionnalite[
			(EGenrefonctionnalite["marquerLectureDocument"] = 10)
		] = "marquerLectureDocument";
		EGenrefonctionnalite[(EGenrefonctionnalite["remplacerFichier"] = 11)] =
			"remplacerFichier";
		EGenrefonctionnalite[(EGenrefonctionnalite["modifier"] = 12)] = "modifier";
		EGenrefonctionnalite[(EGenrefonctionnalite["cloturer"] = 13)] = "cloturer";
		EGenrefonctionnalite[(EGenrefonctionnalite["voirLesReponses"] = 14)] =
			"voirLesReponses";
	})(
		(EGenrefonctionnalite =
			UtilitaireCasier.EGenrefonctionnalite ||
			(UtilitaireCasier.EGenrefonctionnalite = {})),
	);
	UtilitaireCasier.getLibelleEspace = (aGenreRessource) => {
		switch (aGenreRessource) {
			case Enumere_Ressource_1.EGenreRessource.Eleve:
				return ObjetTraduction_1.GTraductions.getValeur("Eleve");
			case Enumere_Ressource_1.EGenreRessource.Responsable:
				return ObjetTraduction_1.GTraductions.getValeur("Parent");
			default:
				return "";
		}
	};
	UtilitaireCasier.formatCriteres = (aCriteres) => {
		const lCriteres = new Map();
		aCriteres === null || aCriteres === void 0
			? void 0
			: aCriteres.forEach((aCritere) => {
					lCriteres.set(
						aCritere.genreDestinataire,
						aCritere.listeCriteresDisponibles,
					);
				});
		return lCriteres;
	};
	UtilitaireCasier.isObjetElementCasier = (aElement) => {
		return (
			aElement &&
			"typeConsultation" in aElement &&
			aElement.getGenre() === Enumere_Ressource_1.EGenreRessource.DocumentCasier
		);
	};
	UtilitaireCasier.isObjetElementDestinataire = (aElement) => {
		return (
			UtilitaireCasier.isObjetElementCasier(aElement) &&
			aElement.typeConsultation ===
				TypeCasier_1.TypeConsultationDocumentCasier.CoDC_Destinataire
		);
	};
	UtilitaireCasier.isObjetElementDepositaire = (aElement) => {
		return (
			UtilitaireCasier.isObjetElementCasier(aElement) &&
			aElement.typeConsultation ===
				TypeCasier_1.TypeConsultationDocumentCasier.CoDC_Depositaire
		);
	};
	UtilitaireCasier.isObjetElementDepositaireResponsable = (aElement) => {
		return (
			UtilitaireCasier.isObjetElementCasier(aElement) &&
			aElement.typeConsultation ===
				TypeCasier_1.TypeConsultationDocumentCasier.CoDC_DepResponsable
		);
	};
	let GenreDepotCollecte;
	(function (GenreDepotCollecte) {
		GenreDepotCollecte[(GenreDepotCollecte["DepotAvecDate"] = 0)] =
			"DepotAvecDate";
		GenreDepotCollecte[(GenreDepotCollecte["DepotSansDate"] = 1)] =
			"DepotSansDate";
		GenreDepotCollecte[(GenreDepotCollecte["SansDepot"] = 2)] = "SansDepot";
	})(
		(GenreDepotCollecte =
			UtilitaireCasier.GenreDepotCollecte ||
			(UtilitaireCasier.GenreDepotCollecte = {})),
	);
	UtilitaireCasier.isObjetElementCollecteParDocument = (aElement) => {
		return (
			!!TypeCasier_1.TypeGenreCumulDocEleve[aElement.getGenre()] &&
			"listeChampsEditables" in aElement &&
			Array.isArray(aElement.listeChampsEditables)
		);
	};
	UtilitaireCasier.isObjetElementDocumentEleveCollecteParDocument = (
		aElement,
	) => {
		return "documentsEleve" in aElement && "strIndividu" in aElement;
	};
	UtilitaireCasier.estCollectePublie = (aCollecte) => {
		switch (UtilitaireCasier.deduireGenreDepot(aCollecte)) {
			case UtilitaireCasier.GenreDepotCollecte.DepotAvecDate: {
				const lDateCollecte = aCollecte.dateEcheance;
				const lDateNom = new Date();
				const lEstDateVisible =
					ObjetDate_1.GDate.estJourEgal(lDateCollecte, lDateNom) ||
					ObjetDate_1.GDate.estDateJourAvant(lDateNom, lDateCollecte);
				return lEstDateVisible;
			}
			case UtilitaireCasier.GenreDepotCollecte.DepotSansDate: {
				return true;
			}
			case UtilitaireCasier.GenreDepotCollecte.SansDepot: {
				return false;
			}
		}
	};
	UtilitaireCasier.deduireGenreDepot = (aCollecte) => {
		let lResult = UtilitaireCasier.getGenreDepotParDefault();
		if (!aCollecte) {
			return lResult;
		}
		if (aCollecte.sansDateLimite) {
			lResult = GenreDepotCollecte.DepotSansDate;
		} else if (aCollecte.sansDepotEspace) {
			lResult = GenreDepotCollecte.SansDepot;
		} else if (aCollecte.dateEcheance) {
			lResult = GenreDepotCollecte.DepotAvecDate;
		}
		return lResult;
	};
	UtilitaireCasier.getGenreDepotParDefault = () => {
		return GenreDepotCollecte.DepotSansDate;
	};
	UtilitaireCasier.getDestinataireParDefaut = (
		aListeGenresIndivAssocieAuCriteres,
		aChoix = ChoixDestinatairesParCriteres_1.TypeChoixTelechargementDoc
			.CTD_Tous,
		aListeDest = new ObjetListeElements_1.ObjetListeElements(),
	) => {
		return {
			listeDestinataires: aListeDest,
			typeChoixTelechargement: aChoix,
			listeCriteres: [],
			listeGenresIndivAssocieAuCriteres: aListeGenresIndivAssocieAuCriteres,
		};
	};
	UtilitaireCasier.getDestinataireCasierResponsableParDefaut = (
		aListeGenresIndivAssocieAuCriteres,
		aChoix = ChoixDestinatairesParCriteres_1.TypeChoixTelechargementDoc
			.CTD_Nominatif,
		aListeDest = new ObjetListeElements_1.ObjetListeElements(),
	) => {
		return Object.assign(
			Object.assign(
				{},
				UtilitaireCasier.getDestinataireParDefaut(
					aListeGenresIndivAssocieAuCriteres,
					aChoix,
					aListeDest,
				),
			),
			{
				genreIndivAssocieAuCriteresSelectionne:
					aListeGenresIndivAssocieAuCriteres.length > 0
						? aListeGenresIndivAssocieAuCriteres[0]
						: ChoixDestinatairesParCriteres_1.TypeGenreDestinataire.GD_Eleve,
			},
		);
	};
	UtilitaireCasier.formatCriteresPourVerifierChampDestinataire = (
		aCriteres,
	) => {
		return aCriteres === null || aCriteres === void 0
			? void 0
			: aCriteres.map((aCritere) => [
					aCritere.genre,
					{ liste: aCritere.listeElements, value: aCritere.value },
				]);
	};
	UtilitaireCasier.verifierChampDestinataire = (aDestinataires) => {
		return ObjetFenetre_ChoixDestinatairesParCriteres_1.ObjetFenetre_ChoixDestinatairesParCriteres.verifierChampDestinataire(
			{
				choix:
					aDestinataires === null || aDestinataires === void 0
						? void 0
						: aDestinataires.typeChoixTelechargement,
				listeDestinataires: aDestinataires.listeDestinataires,
				listeCriteres:
					UtilitaireCasier.formatCriteresPourVerifierChampDestinataire(
						aDestinataires.listeCriteres,
					),
			},
		);
	};
	UtilitaireCasier.getLibelleSelecteurRessource = (
		aDestinataires,
		aGenreRessouce,
		aParams = { avecCompteurCriteresVide: false },
	) => {
		var _a;
		const lEstResponsable =
			aGenreRessouce === Enumere_Ressource_1.EGenreRessource.Responsable;
		switch (
			aDestinataires === null || aDestinataires === void 0
				? void 0
				: aDestinataires.typeChoixTelechargement
		) {
			case ChoixDestinatairesParCriteres_1.TypeChoixTelechargementDoc
				.CTD_Nominatif: {
				const lVerif =
					UtilitaireCasier.verifierChampDestinataire(aDestinataires);
				if (lVerif.valide) {
					return _getLibelleCompteur(
						(_a =
							aDestinataires === null || aDestinataires === void 0
								? void 0
								: aDestinataires.listeDestinataires) === null || _a === void 0
							? void 0
							: _a.count(),
						aGenreRessouce,
					);
				}
				break;
			}
			case ChoixDestinatairesParCriteres_1.TypeChoixTelechargementDoc
				.CTD_Critere: {
				const lVerif =
					UtilitaireCasier.verifierChampDestinataire(aDestinataires);
				if (lVerif.valide) {
					return lEstResponsable
						? ObjetTraduction_1.GTraductions.getValeur("Casier.respSelec")
						: ObjetTraduction_1.GTraductions.getValeur("Casier.elevesSelec");
				}
				return aParams.avecCompteurCriteresVide
					? _getLibelleCompteur(0, aGenreRessouce)
					: "";
			}
			case ChoixDestinatairesParCriteres_1.TypeChoixTelechargementDoc.CTD_Tous:
				return lEstResponsable
					? ObjetTraduction_1.GTraductions.getValeur("Casier.tousResp")
					: ObjetTraduction_1.GTraductions.getValeur("Casier.tousEleves");
		}
	};
})(UtilitaireCasier || (exports.UtilitaireCasier = UtilitaireCasier = {}));
function _getLibelleCompteur(aCount, aGenreRessouce) {
	const lEstResponsable =
		aGenreRessouce === Enumere_Ressource_1.EGenreRessource.Responsable;
	const lDestEstUnique = aCount === 1;
	if (lEstResponsable) {
		return lDestEstUnique
			? ObjetTraduction_1.GTraductions.getValeur("Casier.1Resp")
			: ObjetTraduction_1.GTraductions.getValeur("Casier.xResp", [aCount]);
	} else {
		return lDestEstUnique
			? ObjetTraduction_1.GTraductions.getValeur("Casier.1Eleve")
			: ObjetTraduction_1.GTraductions.getValeur("Casier.xEleves", [aCount]);
	}
}
