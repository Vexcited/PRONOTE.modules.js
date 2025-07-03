exports.ObjetFenetre_ConfSaisieAbsenceCours = void 0;
const Enumere_Etat_1 = require("Enumere_Etat");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const Enumere_Ressource_1 = require("Enumere_Ressource");
const TypeGenreObservationVS_1 = require("TypeGenreObservationVS");
class ObjetFenetre_ConfSaisieAbsenceCours extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 350,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"AbsenceVS.SelectionColonnes",
			),
			listeBoutons: [
				ObjetTraduction_1.GTraductions.getValeur("principal.fermer"),
			],
			avecTailleSelonContenu: true,
		});
	}
	surValidation(aNumeroBouton) {
		this.fermer();
		this.callback.appel(aNumeroBouton);
	}
	construireInstances() {
		this.identListeColonnesSupp = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementSurListeColonnesSupp.bind(this),
			this._initialiserListeColonnesSupp,
		);
	}
	composeContenu() {
		return IE.jsx.str("div", {
			id: this.getNomInstance(this.identListeColonnesSupp),
		});
	}
	setDonnees(aListeColonne) {
		this.afficher();
		const lListeColonnes = aListeColonne
			? aListeColonne.getListeElements((aElement) => {
					return (
						aElement.Genre ===
							Enumere_Ressource_1.EGenreRessource.Observation &&
						aElement.genreObservation ===
							TypeGenreObservationVS_1.TypeGenreObservationVS.OVS_Autres
					);
				})
			: null;
		this.getInstance(this.identListeColonnesSupp).setDonnees(
			new DonneesListe_ConfSaisieAbsenceCours(lListeColonnes),
		);
	}
	_initialiserListeColonnesSupp(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ConfSaisieAbsenceCours.colonnes.coche,
			taille: 25,
		});
		lColonnes.push({
			id: DonneesListe_ConfSaisieAbsenceCours.colonnes.libelle,
			taille: "100%",
		});
		aInstance.setOptionsListe({
			colonnes: lColonnes,
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 500,
		});
	}
	_evenementSurListeColonnesSupp(aParametres) {
		this.setBoutonActif(
			1,
			aParametres.genreEvenement ===
				Enumere_EvenementListe_1.EGenreEvenementListe.Selection,
		);
	}
}
exports.ObjetFenetre_ConfSaisieAbsenceCours =
	ObjetFenetre_ConfSaisieAbsenceCours;
class DonneesListe_ConfSaisieAbsenceCours extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({ avecSelection: false, avecSuppression: false });
	}
	avecEdition(aParams) {
		return (
			aParams.idColonne === DonneesListe_ConfSaisieAbsenceCours.colonnes.coche
		);
	}
	getCouleurCellule() {
		return ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
	}
	getColonneTransfertEdition() {
		return DonneesListe_ConfSaisieAbsenceCours.colonnes.coche;
	}
	surEdition(aParams, V) {
		switch (aParams.idColonne) {
			case DonneesListe_ConfSaisieAbsenceCours.colonnes.coche:
				aParams.article.Actif = V;
				aParams.article.setEtat(Enumere_Etat_1.EGenreEtat.Modification);
				break;
		}
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ConfSaisieAbsenceCours.colonnes.coche:
				return !!aParams.article.Actif;
			case DonneesListe_ConfSaisieAbsenceCours.colonnes.libelle:
				return aParams.article.getLibelle();
		}
		return "";
	}
	getTypeValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_ConfSaisieAbsenceCours.colonnes.coche:
				return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Coche;
		}
		return ObjetDonneesListe_1.ObjetDonneesListe.ETypeCellule.Texte;
	}
}
(function (DonneesListe_ConfSaisieAbsenceCours) {
	let colonnes;
	(function (colonnes) {
		colonnes["coche"] = "DL_ConfSaisieAbsenceCours_coche";
		colonnes["libelle"] = "DL_ConfSaisieAbsenceCours__libelle";
	})(
		(colonnes =
			DonneesListe_ConfSaisieAbsenceCours.colonnes ||
			(DonneesListe_ConfSaisieAbsenceCours.colonnes = {})),
	);
})(
	DonneesListe_ConfSaisieAbsenceCours ||
		(DonneesListe_ConfSaisieAbsenceCours = {}),
);
