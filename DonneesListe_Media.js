const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { EGenreMediaUtil } = require("Enumere_Media.js");
class DonneesListe_Media extends ObjetDonneesListe {
	constructor(aDonnees, aTypeMediasReception, aListeSuivis) {
		super(aDonnees);
		this.setEstReponse(aTypeMediasReception);
		for (let i = 0, lNb = aListeSuivis.count(); i < lNb; i++) {
			const lSuivi = aListeSuivis.get(i);
			if (lSuivi.existe()) {
				for (let j = 0, lNbj = aDonnees.count(); j < lNbj; j++) {
					const lMedia = aDonnees.get(j);
					if (!lMedia._estUtilise) {
						if (
							lSuivi.media &&
							lSuivi.media.getNumero() === lMedia.getNumero()
						) {
							lMedia._estUtilise = true;
							break;
						}
					}
				}
			}
		}
		this.creerIndexUnique(["Libelle", "envoi"]);
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_Suppression: true,
		});
	}
	setEstReponse(aEstReponse) {
		this.estReponse = aEstReponse;
	}
	getTailleTexteMax(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Media.colonnes.libelle:
				return 25;
		}
		return 0;
	}
	avecEdition(aParams) {
		return aParams.article.getGenre() === 0;
	}
	avecSuppression(aParams) {
		return aParams.article.getGenre() === 0;
	}
	suppressionImpossible(D) {
		return !D.supprimable || D._estUtilise;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Media.colonnes.code: {
				let lCode;
				const lClasseIcone = EGenreMediaUtil.getNomImage(
					aParams.article.getGenre(),
					this.estReponse,
				);
				if (!!lClasseIcone) {
					lCode =
						'<div class="' +
						lClasseIcone +
						'" style="margin-right:auto; margin-left:auto;"></div>';
				} else {
					lCode = aParams.article.code || "";
				}
				return lCode;
			}
			case DonneesListe_Media.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTypeValeur(aParams) {
		if (aParams.idColonne === DonneesListe_Media.colonnes.code) {
			if (aParams.article && aParams.article.getGenre() > 0) {
				return ObjetDonneesListe.ETypeCellule.Html;
			}
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	surCreation(D, V) {
		D.code = V[0];
		D.Libelle = V[1];
		D.Genre = 0;
		D.supprimable = true;
		D.envoi = !this.estReponse;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_Media.colonnes.code:
				aParams.article.code = V;
				break;
			case DonneesListe_Media.colonnes.libelle:
				aParams.article.Libelle = V;
				break;
		}
	}
	getVisible(D) {
		if (D.envoi === this.estReponse) {
			return false;
		}
		if (!this.estReponse && D.lieAuPublipostage) {
			return false;
		}
		return true;
	}
}
DonneesListe_Media.colonnes = {
	code: "DL_Media_code",
	libelle: "DL_Media_libelle",
};
module.exports = { DonneesListe_Media };
