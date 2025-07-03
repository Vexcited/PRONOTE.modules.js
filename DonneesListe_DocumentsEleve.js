exports.DonneesListe_DocumentsEleve = void 0;
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTri_1 = require("ObjetTri");
class DonneesListe_DocumentsEleve extends ObjetDonneesListe_1.ObjetDonneesListe {
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
			ObjetTri_1.ObjetTri.initRecursif("pere", [
				ObjetTri_1.ObjetTri.init("Genre"),
				ObjetTri_1.ObjetTri.init((D) => {
					return D.getLibelle();
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
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
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
				return ObjetChaine_1.GChaine.composerUrlLienExterne({
					documentJoint: aParams.article.document,
				});
			case DonneesListe_DocumentsEleve.colonnes.date:
				if (!aParams.article.estPere) {
					return ObjetDate_1.GDate.formatDate(
						aParams.article.dateCreation,
						"%JJ/%MM/%AA",
					);
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
exports.DonneesListe_DocumentsEleve = DonneesListe_DocumentsEleve;
DonneesListe_DocumentsEleve.colonnes = {
	document: "documentsEleveDocument",
	date: "documentsEleveDate",
	nature: "documentsEleveNature",
	proprietaire: "documentsEleveProrietaire",
};
