const { GDate } = require("ObjetDate.js");
const { GChaine } = require("ObjetChaine.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { ObjetTri } = require("ObjetTri.js");
const { EGenreTriElement } = require("Enumere_TriElement.js");
const { TypeGenreObservationVS } = require("TypeGenreObservationVS.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetFenetre_Date } = require("ObjetFenetre_Date.js");
class DonneesListe_DefautCarnet extends ObjetDonneesListe {
	constructor(aDonnees, aParametres) {
		super(aDonnees);
		this.parametres = aParametres;
	}
	avecEdition(aParams) {
		return (
			this.parametres.avecEdition &&
			aParams.article.demandeur &&
			aParams.article.demandeur.getNumero() ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false &&
			(aParams.idColonne === DonneesListe_DefautCarnet.colonnes.commentaire ||
				aParams.idColonne === DonneesListe_DefautCarnet.colonnes.publie ||
				aParams.idColonne === DonneesListe_DefautCarnet.colonnes.date)
		);
	}
	avecSuppression(aParams) {
		return (
			aParams.article.demandeur &&
			aParams.article.demandeur.getNumero() ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false
		);
	}
	avecEvenementCreation() {
		return false;
	}
	avecEvenementSelection() {
		return false;
	}
	avecEvenementSuppression() {
		return true;
	}
	avecEvenementApresEdition() {
		return true;
	}
	avecEvenementEdition(aParams) {
		return (
			this.parametres.avecEdition &&
			aParams.article.demandeur &&
			aParams.article.demandeur.getNumero() ===
				GEtatUtilisateur.getMembre().getNumero() &&
			aParams.article.visuWeb === false &&
			aParams.idColonne === DonneesListe_DefautCarnet.colonnes.date
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_DefautCarnet.colonnes.date:
				return GDate.formatDate(
					aParams.article.date,
					GTraductions.getValeur("Dates.LeDate", ["%JJ/%MM/%AAAA"]),
				);
			case DonneesListe_DefautCarnet.colonnes.saisiePar:
				return aParams.article.demandeur
					? aParams.article.demandeur.Libelle
					: "";
			case DonneesListe_DefautCarnet.colonnes.commentaire:
				return aParams.article.commentaire
					? GChaine.replaceRCToHTML(aParams.article.commentaire)
					: "";
			case DonneesListe_DefautCarnet.colonnes.publie:
				return aParams.article.estPubliee;
			case DonneesListe_DefautCarnet.colonnes.vue:
				return aParams.article.visuWeb !== false
					? GDate.formatDate(aParams.article.visuWeb, "%JJ/%MM/%AAAA")
					: "";
			default:
				return "";
		}
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_DefautCarnet.colonnes.commentaire:
				aParams.article.commentaire = V;
				break;
			case DonneesListe_DefautCarnet.colonnes.publie: {
				aParams.article.estPubliee = V;
				break;
			}
			default:
		}
	}
	getVisible(D) {
		return D.Genre === TypeGenreObservationVS.OVS_DefautCarnet;
	}
	getTypeValeur(aParams) {
		if (aParams.article) {
			switch (aParams.idColonne) {
				case DonneesListe_DefautCarnet.colonnes.publie:
					return ObjetDonneesListe.ETypeCellule.Coche;
				case DonneesListe_DefautCarnet.colonnes.commentaire:
					return ObjetDonneesListe.ETypeCellule.Html;
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
				case DonneesListe_DefautCarnet.colonnes.date:
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
		if (lId !== DonneesListe_DefautCarnet.colonnes.date) {
			lTris.push(ObjetTri.init("date", EGenreTriElement.Decroissant));
		}
		if (lId !== DonneesListe_DefautCarnet.colonnes.saisiePar) {
			lTris.push(
				ObjetTri.init((D) => {
					return D.demandeur ? D.demandeur.Libelle : "";
				}, EGenreTriElement.Croissant),
			);
		}
		return lTris;
	}
	avecMenuContextuel() {
		return true;
	}
	remplirMenuContextuel(aParametres) {
		if (aParametres.ligne === -1) {
			aParametres.menuContextuel.add(
				GTraductions.getValeur("CarnetCorrespondance.CreerAujourdhui"),
				true,
				() => {
					if (this.parametres.callbackMenuContextuel) {
						this.parametres.callbackMenuContextuel(true);
					}
				},
			);
			aParametres.menuContextuel.add(
				GTraductions.getValeur("CarnetCorrespondance.CreerALaDate"),
				true,
				() => {
					if (this.parametres.callbackMenuContextuel) {
						_ouvrirFenetreDate.call(this, new Date());
					}
				},
			);
		}
		aParametres.menuContextuel.setDonnees(aParametres.id);
	}
}
function _ouvrirFenetreDate(aDate) {
	ObjetFenetre.creerInstanceFenetre(ObjetFenetre_Date, {
		pere: this,
		evenement: function (aNumeroBouton, aDate) {
			if (aNumeroBouton === 1) {
				this.parametres.callbackMenuContextuel(false, aDate);
			}
		},
		initialiser: function (aInstance) {
			aInstance.setParametres(
				GDate.PremierLundi,
				GDate.premiereDate,
				GDate.aujourdhui,
			);
		},
	}).setDonnees(aDate);
}
DonneesListe_DefautCarnet.colonnes = {
	date: "date",
	saisiePar: "saisiePar",
	commentaire: "commentaire",
	publie: "publie",
	vue: "vue",
};
module.exports = { DonneesListe_DefautCarnet };
