exports.DonneesListe_DevoirPeriode = void 0;
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetTraduction_1 = require("ObjetTraduction");
class DonneesListe_DevoirPeriode extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aParams) {
		super(aDonnees);
		this.genreColonne = { Classe: -1, Periode: -2 };
		this.param = $.extend(
			{ instance: null, nbrColonnesPeriodes: null, regrouperPeriodes: false },
			aParams,
		);
		this.setOptions({
			avecEtatSaisie: false,
			avecSuppression: false,
			avecSelection: false,
			avecEvnt_Selection: true,
			avecEdition: false,
		});
		this.param.instance.setOptionsListe({
			colonnes: this._getContexteColonnes(this.param.nbrColonnesPeriodes),
			hauteurAdapteContenu: true,
			hauteurMaxAdapteContenu: 121,
		});
	}
	getValeur(aParams) {
		if (this.param.regrouperPeriodes) {
			return aParams.declarationColonne.genreColonne ===
				this.genreColonne.Periode
				? aParams.article.listePeriodes
						.getTableauLibelles(null, false, true)
						.join(", ")
				: aParams.article.getLibelle();
		} else {
			return aParams.declarationColonne.genreColonne ===
				this.genreColonne.Periode
				? aParams.article.listePeriodes
						.get(aParams.declarationColonne.rangColonne)
						.getLibelle()
				: aParams.article.getLibelle();
		}
	}
	getClass() {
		return "AvecMain";
	}
	getCouleurCellule(aParams) {
		let lCouleurCellule =
			ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Fixe;
		if (aParams.declarationColonne.genreColonne === this.genreColonne.Periode) {
			lCouleurCellule =
				ObjetDonneesListe_1.ObjetDonneesListe.ECouleurCellule.Blanc;
		}
		return lCouleurCellule;
	}
	_getContexteColonnes(aNbrColonnesPeriodes) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_DevoirPeriode.colonnes.classe,
			genreColonne: this.genreColonne.Classe,
			titre: ObjetTraduction_1.GTraductions.getValeur("FenetreDevoir.ElevesDe"),
			taille: "50%",
		});
		for (let i = 0; i < aNbrColonnesPeriodes; i++) {
			lColonnes.push({
				id: DonneesListe_DevoirPeriode.colonnes.periode + "_" + i,
				genreColonne: this.genreColonne.Periode,
				rangColonne: i,
				titre: this.param.regrouperPeriodes
					? ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.PeriodeNotation",
						)
					: ObjetTraduction_1.GTraductions.getValeur(
							"FenetreDevoir.PeriodeNotation",
						)[i],
				taille: aNbrColonnesPeriodes > 1 ? "25%" : "50%",
			});
		}
		return lColonnes;
	}
}
exports.DonneesListe_DevoirPeriode = DonneesListe_DevoirPeriode;
(function (DonneesListe_DevoirPeriode) {
	let colonnes;
	(function (colonnes) {
		colonnes["classe"] = "DevoirPeriode_classe";
		colonnes["periode"] = "DevoirPeriode_periode";
	})(
		(colonnes =
			DonneesListe_DevoirPeriode.colonnes ||
			(DonneesListe_DevoirPeriode.colonnes = {})),
	);
})(
	DonneesListe_DevoirPeriode ||
		(exports.DonneesListe_DevoirPeriode = DonneesListe_DevoirPeriode = {}),
);
