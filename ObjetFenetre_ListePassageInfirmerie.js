exports.ObjetFenetre_ListePassageInfirmerie = void 0;
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class ObjetFenetre_ListePassageInfirmerie extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.setOptionsFenetre({
			largeur: 600,
			hauteur: 300,
			listeBoutons: [ObjetTraduction_1.GTraductions.getValeur("Fermer")],
		});
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			null,
			this._initialiserListe,
		);
	}
	setDonnees(aListeAbsences) {
		this.afficher();
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_PassageInfirmerie(aListeAbsences),
		);
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				IE.jsx.fragment,
				null,
				IE.jsx.str(
					"div",
					{ id: this.getNomInstance(this.identListe), style: "height:100%" },
					"\u00A0",
				),
			),
		);
		return H.join("");
	}
	_initialiserListe(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_PassageInfirmerie.colonnes.date,
			titre: ObjetTraduction_1.GTraductions.getValeur("Date"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_PassageInfirmerie.colonnes.heureDepart,
			titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.HeureDepart"),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_PassageInfirmerie.colonnes.heureRetour,
			titre: ObjetTraduction_1.GTraductions.getValeur("AbsenceVS.HeureRetour"),
			taille: "100%",
		});
		aInstance.setOptionsListe({ colonnes: lColonnes });
	}
}
exports.ObjetFenetre_ListePassageInfirmerie =
	ObjetFenetre_ListePassageInfirmerie;
class DonneesListe_PassageInfirmerie extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees) {
		super(aDonnees);
		this.setOptions({
			avecTri: false,
			avecSelection: false,
			avecEdition: false,
			avecSuppression: false,
		});
	}
	getValeur(aParams) {
		switch (aParams.idColonne) {
			case DonneesListe_PassageInfirmerie.colonnes.date:
				return !!aParams.article.dateDepart
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateDepart,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_PassageInfirmerie.colonnes.heureDepart:
				return !!aParams.article.dateDepart
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateDepart,
							"%xh%sh%mm",
						)
					: "";
			case DonneesListe_PassageInfirmerie.colonnes.heureRetour:
				return !!aParams.article.dateRetour
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateRetour,
							"%xh%sh%mm",
						)
					: "";
		}
		return "";
	}
}
DonneesListe_PassageInfirmerie.colonnes = {
	date: "DL_PassageInfirmerie_date",
	heureDepart: "DL_PassageInfirmerie_hDepart",
	heureRetour: "DL_PassageInfirmerie_hRetour",
};
