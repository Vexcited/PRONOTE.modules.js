exports.DonneesListe_Observations = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
class DonneesListe_Observations extends ObjetDonneesListe_1.ObjetDonneesListe {
	avecEdition(aParams) {
		return (
			aParams.article.demandeur.Numero ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false &&
			[
				DonneesListe_Observations.colonnes.date,
				DonneesListe_Observations.colonnes.commentaire,
				DonneesListe_Observations.colonnes.publie,
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
	avecEvenementSelection(aParams) {
		return true;
	}
	avecEvenementSuppression(aParams) {
		return true;
	}
	avecEvenementEdition(aParams) {
		return (
			aParams.article.demandeur.Numero ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false
		);
	}
	avecEvenementApresEdition(aParams) {
		return true;
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Observations.colonnes.date:
				if ((aParams.article.date, aParams.article.date.getHours() === 0)) {
					return ObjetDate_1.GDate.formatDate(
						aParams.article.date,
						ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
							"%JJ/%MM/%AAAA",
						]),
					);
				} else {
					return ObjetDate_1.GDate.formatDate(
						aParams.article.date,
						ObjetTraduction_1.GTraductions.getValeur(
							"Dates.LeDateDebutAHeureDebut",
							["%JJ/%MM/%AAAA", "%hh%sh%mm"],
						),
					);
				}
			case DonneesListe_Observations.colonnes.saisiePar:
				return aParams.article.demandeur.Libelle;
			case DonneesListe_Observations.colonnes.commentaire:
				return aParams.article.commentaire
					? ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.commentaire)
					: "";
			case DonneesListe_Observations.colonnes.vue:
				return aParams.article.visuWeb !== false
					? ObjetDate_1.GDate.formatDate(
							aParams.article.visuWeb,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_Observations.colonnes.publie:
				return aParams.article.estPubliee;
			default:
				return "";
		}
	}
	getVisible(aDonnee) {
		return (
			aDonnee.Genre ===
			TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_ObservationParent
		);
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_Observations.colonnes.commentaire:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
			case DonneesListe_Observations.colonnes.publie:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
	getTri(aColonneDeTri, aGenreTri) {
		const lTris = [];
		let lId;
		if (aColonneDeTri !== null && aColonneDeTri !== undefined) {
			lId = this.getId(aColonneDeTri);
			switch (lId) {
				case DonneesListe_Observations.colonnes.date:
					lTris.push(ObjetTri_1.ObjetTri.init("date", aGenreTri));
					break;
				default:
					lTris.push(
						ObjetTri_1.ObjetTri.init(
							this.getValeurPourTri.bind(this, aColonneDeTri),
							aGenreTri,
						),
					);
					break;
			}
		}
		if (lId !== DonneesListe_Observations.colonnes.date) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			);
		}
		if (lId !== DonneesListe_Observations.colonnes.saisiePar) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.demandeur ? D.demandeur.Libelle : "";
				}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			);
		}
		return lTris;
	}
}
exports.DonneesListe_Observations = DonneesListe_Observations;
(function (DonneesListe_Observations) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "vs_Observations_date";
		colonnes["saisiePar"] = "vs_Observations_saisiePar";
		colonnes["commentaire"] = "vs_Observations_commentaire";
		colonnes["vue"] = "vs_Observations_vue";
		colonnes["publie"] = "vs_Observations_publie";
	})(
		(colonnes =
			DonneesListe_Observations.colonnes ||
			(DonneesListe_Observations.colonnes = {})),
	);
})(
	DonneesListe_Observations ||
		(exports.DonneesListe_Observations = DonneesListe_Observations = {}),
);
