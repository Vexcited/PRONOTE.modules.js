exports.DonneesListe_AssSaisie_Appreciation = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_AssSaisie_Appreciation extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aTailleMax, aAvecEtatSaisie) {
		super(aDonnees);
		this.tailleMax = aTailleMax || 0;
		this.creerIndexUnique("Libelle");
		this.setOptions({
			avecEvnt_Selection: true,
			avecEvnt_Creation: true,
			avecEvnt_ApresEdition: true,
			avecEvnt_SelectionDblClick: true,
			avecEvnt_Suppression: true,
			avecEtatSaisie:
				aAvecEtatSaisie !== null && aAvecEtatSaisie !== undefined
					? aAvecEtatSaisie
					: true,
		});
	}
	getCouleurCellule() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
	avecMenuContextuel() {
		return false;
	}
	getClass(aParams) {
		const lClasses = [];
		if (!aParams.article.Supprimable) {
			lClasses.push("Gras");
		}
		return lClasses.join(" ");
	}
	getTailleTexteMax() {
		return this.tailleMax;
	}
	getMessageTailleMaximaleSaisie() {
		return ObjetTraduction_1.GTraductions.getValeur("MessageTailleMaxAppr");
	}
	getTypeValeur() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.ZoneTexte;
	}
	surCreation(D, V) {
		D.Libelle = V[0];
		D.Editable = true;
		D.Supprimable = true;
	}
	suppressionImpossible(D) {
		return !D.Supprimable;
	}
	getMessageSuppressionImpossible() {
		return ObjetTraduction_1.GTraductions.getValeur(
			"Appreciations.MsgSuppressionApprecInterdit",
		);
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AssSaisie_Appreciation.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	avecEdition(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_AssSaisie_Appreciation.colonnes.libelle:
				return aParams.article ? !!aParams.article.getActif() : false;
		}
		return false;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_AssSaisie_Appreciation.colonnes.libelle:
				return aParams.article.setLibelle(V);
		}
	}
}
exports.DonneesListe_AssSaisie_Appreciation =
	DonneesListe_AssSaisie_Appreciation;
(function (DonneesListe_AssSaisie_Appreciation) {
	let colonnes;
	(function (colonnes) {
		colonnes["libelle"] = "DL_AssistSaisieApprec_libelle";
	})(
		(colonnes =
			DonneesListe_AssSaisie_Appreciation.colonnes ||
			(DonneesListe_AssSaisie_Appreciation.colonnes = {})),
	);
})(
	DonneesListe_AssSaisie_Appreciation ||
		(exports.DonneesListe_AssSaisie_Appreciation =
			DonneesListe_AssSaisie_Appreciation =
				{}),
);
