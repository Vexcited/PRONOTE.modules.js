exports.DonneesListe_SelectionQCM = void 0;
const ObjetDonneesListeFlatDesign_1 = require("ObjetDonneesListeFlatDesign");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_SelectionQCM extends ObjetDonneesListeFlatDesign_1.ObjetDonneesListeFlatDesign {
	constructor(aDonnees, aEvenement, aParam) {
		super(aDonnees);
		this.callbackEvenementMenuContextuel = aEvenement;
		this.formatBibliotheque = !!aParam.formatBiblio;
		this.multiSelection = !!aParam.multiSelection;
		this._genreQCM = aParam.genreQCM;
		this.setOptions({
			avecMultiSelection: this.multiSelection,
			flatDesignMinimal: aParam.estFDMinimal,
			avecEvnt_Selection: true,
			avecDeploiement: true,
		});
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init((D) => {
					return D.existeNumero();
				}),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.Libelle;
				}),
			]),
		];
	}
	getTitreZonePrincipale(aParams) {
		let lLibelle = aParams.article.getLibelle();
		if (aParams.article.getGenre() === this._genreQCM) {
			if (this.formatBibliotheque) {
				if (aParams.article.proprietaire) {
					lLibelle += " - " + aParams.article.proprietaire.getLibelle();
				} else if (aParams.article.listeProprietaires) {
					aParams.article.listeProprietaires.parcourir((aProprietaire) => {
						lLibelle += " - " + aProprietaire.getLibelle();
					});
				}
			}
		}
		return lLibelle;
	}
	getZoneMessage(aParams) {
		if (aParams.article.getGenre() === this._genreQCM) {
			if (this.formatBibliotheque) {
				return (
					aParams.article.nbQuestionsTotal +
					" " +
					ObjetTraduction_1.GTraductions.getValeur(
						"FenetreParamExecutionQCM.Questions",
					)
				);
			} else {
				return ObjetTraduction_1.GTraductions.getValeur(
					"SaisieQCM.InfoQCMSelection",
					[aParams.article.nbQuestionsTotal, aParams.article.nombreDePoints],
				);
			}
		}
		return "";
	}
	avecMenuContextuel(aParams) {
		if (
			!this.callbackEvenementMenuContextuel ||
			(aParams.article && aParams.article.estUnDeploiement)
		) {
			return false;
		} else {
			return aParams.ligne >= 0;
		}
	}
	avecBoutonActionLigne(aParams) {
		return this.avecMenuContextuel(aParams);
	}
	initialisationObjetContextuel(aParametres) {
		if (!aParametres.menuContextuel) {
			return;
		}
		aParametres.menuContextuel.addCommande(
			DonneesListe_SelectionQCM.GenreCommande.CopierQCM,
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.CopierQCM"),
			!aParametres.nonEditable,
		);
		aParametres.menuContextuel.addSeparateur();
		aParametres.menuContextuel.addCommande(
			DonneesListe_SelectionQCM.GenreCommande.VisuEleve,
			ObjetTraduction_1.GTraductions.getValeur("QCM_Divers.VisuEleve"),
			!aParametres.nonEditable,
		);
		aParametres.menuContextuel.setDonnees();
	}
	evenementMenuContextuel(aParametres) {
		this.callbackEvenementMenuContextuel(
			aParametres.numeroMenu,
			aParametres.article,
		);
		return true;
	}
}
exports.DonneesListe_SelectionQCM = DonneesListe_SelectionQCM;
(function (DonneesListe_SelectionQCM) {
	let GenreCommande;
	(function (GenreCommande) {
		GenreCommande[(GenreCommande["VisuEleve"] = 0)] = "VisuEleve";
		GenreCommande[(GenreCommande["CopierQCM"] = 1)] = "CopierQCM";
	})(
		(GenreCommande =
			DonneesListe_SelectionQCM.GenreCommande ||
			(DonneesListe_SelectionQCM.GenreCommande = {})),
	);
})(
	DonneesListe_SelectionQCM ||
		(exports.DonneesListe_SelectionQCM = DonneesListe_SelectionQCM = {}),
);
