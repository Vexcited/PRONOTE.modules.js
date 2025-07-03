exports.DonneesListe_SelectionMotifs = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const ObjetCelluleMultiSelection_1 = require("ObjetCelluleMultiSelection");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_SelectionMotifs extends ObjetCelluleMultiSelection_1.DonneesListe_CelluleMultiSelection {
	constructor(aDonnees, aParam) {
		super(aDonnees);
		this.param = {
			avecCreation: false,
			avecEdition: false,
			avecSuppression: false,
			avecAucunExclusif: true,
		};
		$.extend(this.param, aParam);
	}
	getTri() {
		return [
			ObjetTri_1.ObjetTri.init((D) => {
				return !D.ssMotif;
			}),
			ObjetTri_1.ObjetTri.init("Libelle"),
		];
	}
	avecEdition(aParams) {
		switch (aParams.colonne) {
			case DonneesListe_SelectionMotifs.colonnes.coche:
				return true;
			case DonneesListe_SelectionMotifs.colonnes.motif:
				return (
					this.param.avecEdition &&
					!aParams.article.nonModifiable &&
					!aParams.article.ssMotif
				);
			case DonneesListe_SelectionMotifs.colonnes.incident:
				return (
					this.param.avecEdition &&
					!aParams.article.nonModifiable &&
					!aParams.article.ssMotif
				);
		}
		return false;
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.colonne === DonneesListe_SelectionMotifs.colonnes.incident &&
			this.param.avecEdition &&
			!aParams.article.nonModifiable &&
			!aParams.article.ssMotif
		);
	}
	getEtatSurEdition() {
		return null;
	}
	getColonneTransfertEdition() {
		return null;
	}
	avecSuppression(aParams) {
		return (
			this.param.avecSuppression &&
			!aParams.article.nonModifiable &&
			!aParams.article.ssMotif
		);
	}
	avecEvenementCreation() {
		return this.param ? this.param.avecCreation : false;
	}
	avecEvenementApresCreation() {
		return this.param ? this.param.avecCreation : false;
	}
	avecEvenementApresEdition(aParams) {
		switch (aParams.colonne) {
			case DonneesListe_SelectionMotifs.colonnes.motif:
			case DonneesListe_SelectionMotifs.colonnes.incident:
				return (
					this.param.avecEdition &&
					!aParams.article.nonModifiable &&
					!aParams.article.ssMotif &&
					aParams.article.getEtat() !== Enumere_Etat_1.EGenreEtat.Aucun
				);
		}
		return false;
	}
	avecEvenementApresSuppression() {
		return this.param ? this.param.avecSuppression : false;
	}
	suppressionImpossible(aElement) {
		return (
			!this.param.avecSuppression || !aElement.supprimable || aElement.cmsActif
		);
	}
	getMessageSuppressionImpossible(D) {
		return (
			D.msgSurSuppression ||
			ObjetTraduction_1.GTraductions.getValeur("liste.suppressionImpossible")
		);
	}
	getMessageSuppressionConfirmation(D) {
		const lMessage = ObjetTraduction_1.GTraductions.getValeur(
			"motifs.msgSuppression",
			[D.getLibelle()],
		);
		return lMessage
			? lMessage +
					"<br/><br/>" +
					ObjetTraduction_1.GTraductions.getValeur(
						"motifs.msgSuppressionConfimation",
					)
			: ObjetTraduction_1.GTraductions.getValeur("liste.suppressionSelection");
	}
	surCreation(D, V) {
		D.Libelle = V[DonneesListe_SelectionMotifs.colonnes.motif];
		D.sousCategorieDossier = V[DonneesListe_SelectionMotifs.colonnes.incident];
		D.dossierObligatoire = false;
		D.cmsActif = true;
	}
	getTypeValeur(aParams) {
		switch (aParams.colonne) {
			case DonneesListe_SelectionMotifs.colonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_SelectionMotifs.colonnes.dossier:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.colonne) {
			case DonneesListe_SelectionMotifs.colonnes.coche:
				return aParams.article.cmsActif !== undefined
					? aParams.article.cmsActif
					: false;
			case DonneesListe_SelectionMotifs.colonnes.motif:
				return aParams.article.getLibelle();
			case DonneesListe_SelectionMotifs.colonnes.dossier:
				return aParams.article.dossierObligatoire
					? IE.jsx.str("i", {
							class: "icon_folder_close i-medium color-red-foncee",
							role: "img",
							"aria-label": ObjetTraduction_1.GTraductions.getValeur(
								"liste.DossierObligatoire",
							),
							title: ObjetTraduction_1.GTraductions.getValeur(
								"liste.DossierObligatoire",
							),
						})
					: "";
			case DonneesListe_SelectionMotifs.colonnes.incident:
				return !!aParams.article.sousCategorieDossier &&
					aParams.article.sousCategorieDossier.getPosition() !== 1
					? aParams.article.sousCategorieDossier.getLibelle()
					: "";
		}
		return "";
	}
	getCouleurCellule() {
		return undefined;
	}
	surEdition(aParams, V) {
		super.surEdition(aParams, V);
		if (
			aParams.colonne === DonneesListe_SelectionMotifs.colonnes.motif &&
			this.param.avecEdition &&
			aParams.article.Libelle !== V
		) {
			aParams.article.Libelle = V;
			aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
		}
		if (this.param.avecAucunExclusif) {
			if (aParams.article.ssMotif) {
				this.Donnees.parcourir((D) => {
					if (!D.ssMotif) {
						D.cmsActif = false;
					}
				});
			} else {
				this.Donnees.parcourir((D) => {
					if (D.ssMotif) {
						D.cmsActif = false;
						return false;
					}
				});
			}
		}
	}
	getTableauLignesModifieesCocheTitre() {
		const T = [];
		const lThis = this;
		this.Donnees.parcourir((D, aIndex) => {
			if (!lThis.param.avecAucunExclusif || !D.ssMotif) {
				T.push(aIndex);
			}
		});
		return T;
	}
}
exports.DonneesListe_SelectionMotifs = DonneesListe_SelectionMotifs;
(function (DonneesListe_SelectionMotifs) {
	let colonnes;
	(function (colonnes) {
		colonnes[(colonnes["coche"] = 0)] = "coche";
		colonnes[(colonnes["motif"] = 1)] = "motif";
		colonnes[(colonnes["dossier"] = 2)] = "dossier";
		colonnes[(colonnes["incident"] = 3)] = "incident";
	})(
		(colonnes =
			DonneesListe_SelectionMotifs.colonnes ||
			(DonneesListe_SelectionMotifs.colonnes = {})),
	);
})(
	DonneesListe_SelectionMotifs ||
		(exports.DonneesListe_SelectionMotifs = DonneesListe_SelectionMotifs = {}),
);
