const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GChaine } = require("ObjetChaine.js");
const { EGenreRessource } = require("Enumere_Ressource.js");
const { ObjetTri } = require("ObjetTri.js");
const { GDate } = require("ObjetDate.js");
class DonneesListe_ListeDocumentsFournis extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecEtatSaisie: false,
			avecTri: true,
			avecDeploiement: true,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeDocumentsFournis.colonnes.nom:
			case DonneesListe_ListeDocumentsFournis.colonnes.prenom:
			case DonneesListe_ListeDocumentsFournis.colonnes.dateNaissance:
				return ObjetDonneesListe.ETypeCellule.Texte;
		}
		return ObjetDonneesListe.ETypeCellule.Html;
	}
	getValeurPourTri(aColonne, D) {
		const lParams = this.paramsListe.getParams(aColonne, -1, { surTri: true });
		switch (lParams.idColonne) {
			case DonneesListe_ListeDocumentsFournis.colonnes.nom:
				return D.nom;
			case DonneesListe_ListeDocumentsFournis.colonnes.prenom:
				return D.prenom;
			case DonneesListe_ListeDocumentsFournis.colonnes.dateNaissance:
				return D.dateNaissance;
			default: {
				const lDocument = D.documentsEleve.get(
					lParams.declarationColonne.rangColonneDynamique,
				);
				return lDocument ? lDocument.getLibelle() : "";
			}
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		if (aColonneDeTri !== null && aColonneDeTri !== undefined) {
			lTris.push(
				ObjetTri.init(
					this.getValeurPourTri.bind(this, aColonneDeTri),
					aGenreTri,
				),
			);
		}
		return lTris;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ListeDocumentsFournis.colonnes.nom:
				return aParams.article.nom;
			case DonneesListe_ListeDocumentsFournis.colonnes.prenom:
				return aParams.article.prenom;
			case DonneesListe_ListeDocumentsFournis.colonnes.dateNaissance:
				return GDate.formatDate(aParams.article.dateNaissance, "%JJ/%MM/%AAAA");
			default: {
				const lDocument = aParams.article.documentsEleve.get(
					aParams.declarationColonne.rangColonneDynamique,
				);
				if (lDocument) {
					const lURL = GChaine.composerUrlLienExterne({
						documentJoint: lDocument,
						libelleEcran: lDocument.getLibelle(),
						genreRessource: EGenreRessource.DocJointEleve,
					});
					return lURL;
				}
				return "";
			}
		}
	}
}
DonneesListe_ListeDocumentsFournis.colonnes = {
	nom: "DocFourni_Nom",
	prenom: "DocFourni_Prenom",
	dateNaissance: "DocFourni_DateNaissance",
};
module.exports = { DonneesListe_ListeDocumentsFournis };
