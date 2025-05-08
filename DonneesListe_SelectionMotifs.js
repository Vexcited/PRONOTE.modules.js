const { EGenreEtat } = require("Enumere_Etat.js");
const {
	DonneesListe_CelluleMultiSelection,
} = require("ObjetCelluleMultiSelection.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
class DonneesListe_SelectionMotifs extends DonneesListe_CelluleMultiSelection {
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
			ObjetTri.init((D) => {
				return !D.ssMotif;
			}),
			ObjetTri.init("Libelle"),
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
					aParams.article.getEtat() !== EGenreEtat.Aucun
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
			GTraductions.getValeur("liste.suppressionImpossible")
		);
	}
	getMessageSuppressionConfirmation(D) {
		const lMessage = GTraductions.getValeur("motifs.msgSuppression", [
			D.getLibelle(),
		]);
		return lMessage
			? lMessage +
					"<br/><br/>" +
					GTraductions.getValeur("motifs.msgSuppressionConfimation")
			: GTraductions.getValeur("liste.suppressionSelection");
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
				return ObjetDonneesListe.ETypeCellule.Coche;
			case DonneesListe_SelectionMotifs.colonnes.dossier:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
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
					? '<i class="icon_folder_close i-medium text-util-rouge-foncee" aria-label="' +
							GTraductions.getValeur("liste.DossierObligatoire") +
							'" title="' +
							GTraductions.getValeur("liste.DossierObligatoire") +
							'"></i>'
					: "";
			case DonneesListe_SelectionMotifs.colonnes.incident:
				return !!aParams.article.sousCategorieDossier &&
					aParams.article.sousCategorieDossier.getPosition() !== 1
					? aParams.article.sousCategorieDossier.getLibelle()
					: "";
		}
		return "";
	}
	getCouleurCellule() {}
	surEdition(aParams, V) {
		super.surEdition(aParams, V);
		if (
			aParams.colonne === DonneesListe_SelectionMotifs.colonnes.motif &&
			this.param.avecEdition &&
			aParams.article.Libelle !== V
		) {
			aParams.article.Libelle = V;
			aParams.article.setEtat(EGenreEtat.Modification);
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
DonneesListe_SelectionMotifs.colonnes = {
	coche: 0,
	motif: 1,
	dossier: 2,
	incident: 3,
};
module.exports = { DonneesListe_SelectionMotifs };
