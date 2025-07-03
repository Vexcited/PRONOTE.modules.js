exports.DonneesListe_DefautCarnet = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetChaine_1 = require("ObjetChaine");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const ObjetTri_1 = require("ObjetTri");
const Enumere_TriElement_1 = require("Enumere_TriElement");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetFenetre_Date_1 = require("ObjetFenetre_Date");
class DonneesListe_DefautCarnet extends ObjetDonneesListe_1.ObjetDonneesListe {
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
	avecEvenementSelection(aParams) {
		return false;
	}
	avecEvenementSuppression(aParams) {
		return true;
	}
	avecEvenementApresEdition(aParams) {
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
				return ObjetDate_1.GDate.formatDate(
					aParams.article.date,
					ObjetTraduction_1.GTraductions.getValeur("Dates.LeDate", [
						"%JJ/%MM/%AAAA",
					]),
				);
			case DonneesListe_DefautCarnet.colonnes.saisiePar:
				return aParams.article.demandeur
					? aParams.article.demandeur.Libelle
					: "";
			case DonneesListe_DefautCarnet.colonnes.commentaire:
				return aParams.article.commentaire
					? ObjetChaine_1.GChaine.replaceRCToHTML(aParams.article.commentaire)
					: "";
			case DonneesListe_DefautCarnet.colonnes.publie:
				return aParams.article.estPubliee;
			case DonneesListe_DefautCarnet.colonnes.vue:
				return aParams.article.visuWeb !== false
					? ObjetDate_1.GDate.formatDate(
							aParams.article.visuWeb,
							"%JJ/%MM/%AAAA",
						)
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
	getVisible(aDonnee) {
		return (
			aDonnee.Genre ===
			TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_DefautCarnet
		);
	}
	getTypeValeur(aParams) {
		if (aParams.article) {
			switch (aParams.idColonne) {
				case DonneesListe_DefautCarnet.colonnes.publie:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
				case DonneesListe_DefautCarnet.colonnes.commentaire:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Html;
				default:
					return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
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
		if (lId !== DonneesListe_DefautCarnet.colonnes.date) {
			lTris.push(
				ObjetTri_1.ObjetTri.init(
					"date",
					Enumere_TriElement_1.EGenreTriElement.Decroissant,
				),
			);
		}
		if (lId !== DonneesListe_DefautCarnet.colonnes.saisiePar) {
			lTris.push(
				ObjetTri_1.ObjetTri.init((D) => {
					return D.demandeur ? D.demandeur.Libelle : "";
				}, Enumere_TriElement_1.EGenreTriElement.Croissant),
			);
		}
		return lTris;
	}
	avecMenuContextuel(aParams) {
		return true;
	}
	remplirMenuContextuel(aParametres) {
		if (aParametres.ligne === -1) {
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.CreerAujourdhui",
				),
				true,
				() => {
					if (this.parametres.callbackMenuContextuel) {
						this.parametres.callbackMenuContextuel(true);
					}
				},
			);
			aParametres.menuContextuel.add(
				ObjetTraduction_1.GTraductions.getValeur(
					"CarnetCorrespondance.CreerALaDate",
				),
				true,
				() => {
					if (this.parametres.callbackMenuContextuel) {
						this._ouvrirFenetreDate(new Date());
					}
				},
			);
		}
		aParametres.menuContextuel.setDonnees(aParametres.id);
	}
	_ouvrirFenetreDate(aDate) {
		ObjetFenetre_1.ObjetFenetre.creerInstanceFenetre(
			ObjetFenetre_Date_1.ObjetFenetre_Date,
			{
				pere: this,
				evenement: function (aNumeroBouton, aDate) {
					if (aNumeroBouton === 1) {
						this.parametres.callbackMenuContextuel(false, aDate);
					}
				},
				initialiser: function (aInstance) {
					aInstance.setParametres(
						ObjetDate_1.GDate.PremierLundi,
						ObjetDate_1.GDate.premiereDate,
						ObjetDate_1.GDate.aujourdhui,
					);
				},
			},
		).setDonnees(aDate);
	}
}
exports.DonneesListe_DefautCarnet = DonneesListe_DefautCarnet;
(function (DonneesListe_DefautCarnet) {
	let colonnes;
	(function (colonnes) {
		colonnes["date"] = "date";
		colonnes["saisiePar"] = "saisiePar";
		colonnes["commentaire"] = "commentaire";
		colonnes["publie"] = "publie";
		colonnes["vue"] = "vue";
	})(
		(colonnes =
			DonneesListe_DefautCarnet.colonnes ||
			(DonneesListe_DefautCarnet.colonnes = {})),
	);
})(
	DonneesListe_DefautCarnet ||
		(exports.DonneesListe_DefautCarnet = DonneesListe_DefautCarnet = {}),
);
