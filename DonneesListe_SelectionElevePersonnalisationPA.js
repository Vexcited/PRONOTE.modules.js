exports.DonneesListe_SelectionElevePersonnalisationPA = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
class DonneesListe_SelectionElevePersonnalisationPA extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aOptions) {
		super(aDonnees);
		this.setOptions(
			$.extend(
				{
					avecSelection: false,
					avecSuppression: false,
					avecEtatSaisie: false,
					avecEvnt_ApresEdition: true,
					avecEvnt_Selection: true,
				},
				aOptions,
			),
		);
	}
	avecEdition(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche
		);
	}
	getTypeValeur(aParams) {
		if (
			aParams.idColonne ===
			DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche:
				if (aParams.article.estUnDeploiement) {
					return this.getEtatCocheSelonFils(aParams.article, aParams);
				}
				return aParams.article.cmsActif !== undefined
					? aParams.article.cmsActif
					: false;
			case DonneesListe_SelectionElevePersonnalisationPA.colonnes.nom:
				return aParams.article.getLibelle();
			case DonneesListe_SelectionElevePersonnalisationPA.colonnes.projet:
				return aParams.article.projetsAccompagnement || "";
		}
		return "";
	}
	surEdition(aParams, V) {
		if (
			aParams.idColonne ===
			DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche
		) {
			if (aParams.article.estUnDeploiement) {
				this.Donnees.parcourir((aFils) => {
					if (aFils.pere === aParams.article) {
						aFils.cmsActif = V;
					}
				});
			} else {
				aParams.article.cmsActif = V;
			}
		}
	}
	getColonneTransfertEdition() {
		return DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche;
	}
	getColonneDeFusion(aParams) {
		if (
			aParams.article.estUnDeploiement &&
			aParams.idColonne !==
				DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche
		) {
			return DonneesListe_SelectionElevePersonnalisationPA.colonnes.nom;
		}
	}
	avecImageSurColonneDeploiement(aParams) {
		return (
			aParams.idColonne ===
			DonneesListe_SelectionElevePersonnalisationPA.colonnes.nom
		);
	}
	getCouleurCellule(aParams) {
		if (
			aParams.article.estUnDeploiement &&
			aParams.idColonne !==
				DonneesListe_SelectionElevePersonnalisationPA.colonnes.coche
		) {
			return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Deploiement;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
	getVisible(aArticle) {
		return aArticle.visible;
	}
}
exports.DonneesListe_SelectionElevePersonnalisationPA =
	DonneesListe_SelectionElevePersonnalisationPA;
DonneesListe_SelectionElevePersonnalisationPA.colonnes = {
	coche: "DL_SelectionElevePA_coche",
	nom: "DL_SelectionElevePA_nom",
	projet: "DL_SelectionElevePA_projet",
};
