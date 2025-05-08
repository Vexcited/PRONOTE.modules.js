const { GChaine } = require("ObjetChaine.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetTri } = require("ObjetTri.js");
class DonneesListe_DocumentsEleve extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecEdition: false,
			avecSuppression: false,
			avecDeploiement: true,
		});
	}
	avecMenuContextuel() {
		return false;
	}
	avecDeploiementSurColonne(aParams) {
		return [DonneesListe_DocumentsEleve.colonnes.document].includes(
			aParams.idColonne,
		);
	}
	avecImageSurColonneDeploiement(aParams) {
		return aParams.idColonne === DonneesListe_DocumentsEleve.colonnes.document;
	}
	getTri() {
		return [
			ObjetTri.initRecursif("pere", [
				ObjetTri.init("Genre"),
				ObjetTri.init((D) => {
					return D.Libelle;
				}),
			]),
		];
	}
	getColonneDeFusion(aParams) {
		if (!aParams.article.estUnDeploiement) {
			return;
		}
		if (
			[
				DonneesListe_DocumentsEleve.colonnes.date,
				DonneesListe_DocumentsEleve.colonnes.nature,
				DonneesListe_DocumentsEleve.colonnes.proprietaire,
			].includes(aParams.idColonne)
		) {
			return DonneesListe_DocumentsEleve.colonnes.document;
		}
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DocumentsEleve.colonnes.document:
				return ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe.ETypeCellule.Texte;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DocumentsEleve.colonnes.document:
				if (aParams.article.estPere) {
					return (
						'<span class="Gras">' +
						aParams.article.getLibelle() +
						(aParams.article.nbrFils > 0
							? " (" + aParams.article.nbrFils + ")"
							: "") +
						"</span>"
					);
				}
				return GChaine.composerUrlLienExterne({
					documentJoint: aParams.article.document,
				});
			case DonneesListe_DocumentsEleve.colonnes.date:
				if (!aParams.article.estPere) {
					return GDate.formatDate(aParams.article.dateCreation, "%JJ/%MM/%AA");
				}
				return "";
			case DonneesListe_DocumentsEleve.colonnes.nature:
				if (!aParams.article.estPere) {
					return aParams.article.getLibelle();
				}
				return "";
			case DonneesListe_DocumentsEleve.colonnes.proprietaire:
				if (!aParams.article.estPere) {
					return aParams.article.strproprietaire;
				}
				return "";
		}
	}
}
DonneesListe_DocumentsEleve.colonnes = {
	document: "documentsEleveDocument",
	date: "documentsEleveDate",
	nature: "documentsEleveNature",
	proprietaire: "documentsEleveProrietaire",
};
module.exports = { DonneesListe_DocumentsEleve };
