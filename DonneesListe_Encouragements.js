const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
class DonneesListe_Encouragements extends ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
	}
	avecEdition(aParams) {
		return (
			aParams.article.demandeur.Numero ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false &&
			[
				DonneesListe_Encouragements.colonnes.date,
				DonneesListe_Encouragements.colonnes.commentaire,
				DonneesListe_Encouragements.colonnes.publie,
			].includes(aParams.idColonne)
		);
	}
	avecSuppression(aParams) {
		return (
			aParams.article.demandeur.Numero ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false
		);
	}
	avecEvenementCreation() {
		return true;
	}
	avecEvenementSelection() {
		return true;
	}
	avecEvenementSuppression() {
		return true;
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.article.demandeur.Numero ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false
		);
	}
	avecEvenementApresEdition() {
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Encouragements.colonnes.date:
				if ((aParams.article.date, aParams.article.date.getHours() === 0)) {
					return GDate.formatDate(
						aParams.article.date,
						GTraductions.getValeur("Dates.LeDate", ["%JJ/%MM/%AAAA"]),
					);
				} else {
					return GDate.formatDate(
						aParams.article.date,
						GTraductions.getValeur("Dates.LeDateDebutAHeureDebut", [
							"%JJ/%MM/%AAAA",
							"%hh%sh%mm",
						]),
					);
				}
			case DonneesListe_Encouragements.colonnes.saisiePar:
				return aParams.article.demandeur.Libelle;
			case DonneesListe_Encouragements.colonnes.commentaire:
				return aParams.article.commentaire
					? GChaine.replaceRCToHTML(aParams.article.commentaire)
					: "";
			case DonneesListe_Encouragements.colonnes.vue:
				return aParams.article.visuWeb !== false
					? GDate.formatDate(aParams.article.visuWeb, "%JJ/%MM/%AAAA")
					: "";
			case DonneesListe_Encouragements.colonnes.publie:
				return aParams.article.estPubliee;
			default:
				return "";
		}
	}
	getVisible(D) {
		return D.Genre === TypeGenreObservationVS.OVS_Encouragement;
	}
	getTypeValeur(aParams) {
		if (aParams.article) {
			switch (aParams.idColonne) {
				case DonneesListe_Encouragements.colonnes.commentaire:
					return ObjetDonneesListe.ETypeCellule.Html;
				case DonneesListe_Encouragements.colonnes.publie:
					return ObjetDonneesListe.ETypeCellule.Coche;
				default:
					return ObjetDonneesListe.ETypeCellule.Texte;
			}
		}
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		let lId;
		if (aColonneDeTri !== null && aColonneDeTri !== undefined) {
			lId = this.getId(aColonneDeTri);
			switch (lId) {
				case DonneesListe_Encouragements.colonnes.date:
					lTris.push(ObjetTri.init("date", aGenreTri));
					break;
				default:
					lTris.push(
						ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
			}
		}
		if (lId !== DonneesListe_Encouragements.colonnes.date) {
			lTris.push(ObjetTri.init("date", EGenreTriElement.Decroissant));
		}
		if (lId !== DonneesListe_Encouragements.colonnes.saisiePar) {
			lTris.push(
				ObjetTri.init((D) => {
					return D.demandeur ? D.demandeur.Libelle : "";
				}, EGenreTriElement.Croissant),
			);
		}
		return lTris;
	}
}
DonneesListe_Encouragements.colonnes = {
	date: "vs_encouragements_date",
	saisiePar: "vs_encouragements_saisiePar",
	commentaire: "vs_encouragements_commentaire",
	vue: "vs_encouragements_vue",
	publie: "vs_encouragemnets_publie",
};
function _getColonnes() {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_Encouragements.colonnes.date,
		taille: 125,
		titre: { libelle: GTraductions.getValeur("Date") },
	});
	lColonnes.push({
		id: DonneesListe_Encouragements.colonnes.saisiePar,
		taille: ObjetListe.initColonne(50, 200, 250),
		titre: {
			libelle: GTraductions.getValeur("CarnetCorrespondance.Redacteur"),
		},
	});
	lColonnes.push({
		id: DonneesListe_Encouragements.colonnes.commentaire,
		taille: ObjetListe.initColonne(80, 280, 840),
		titre: {
			libelle: GTraductions.getValeur("CarnetCorrespondance.Encouragement"),
		},
	});
	lColonnes.push({
		id: DonneesListe_Encouragements.colonnes.publie,
		taille: 20,
		titre: {
			title: GTraductions.getValeur("CarnetCorrespondance.Publie"),
			classeCssImage: "Image_Publie",
		},
	});
	lColonnes.push({
		id: DonneesListe_Encouragements.colonnes.vue,
		taille: 60,
		titre: { libelle: GTraductions.getValeur("CarnetCorrespondance.Vue") },
	});
	return lColonnes;
}
DonneesListe_Encouragements.options = {
	colonnes: _getColonnes(),
	colonnesCachees: [],
	hauteurAdapteContenu: true,
	listeCreations: 0,
	avecLigneCreation: true,
	titreCreation: GTraductions.getValeur(
		"CarnetCorrespondance.NouvelEncouragement",
	),
	piedDeListe: null,
};
module.exports = { DonneesListe_Encouragements };
