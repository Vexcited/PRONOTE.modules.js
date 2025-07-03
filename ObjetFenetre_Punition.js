exports.ObjetFenetre_Punition = void 0;
const AccessApp_1 = require("AccessApp");
const Enumere_EvenementListe_1 = require("Enumere_EvenementListe");
const ObjetDate_1 = require("ObjetDate");
const ObjetDonneesListe_1 = require("ObjetDonneesListe");
const ObjetFenetre_1 = require("ObjetFenetre");
const ObjetListe_1 = require("ObjetListe");
const ObjetTraduction_1 = require("ObjetTraduction");
const UtilitaireDuree_1 = require("UtilitaireDuree");
class ObjetFenetre_Punition extends ObjetFenetre_1.ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.seulementSansDossier = false;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe_1.ObjetListe,
			this._evenementListePunitions.bind(this),
			this._initialiserListePunitions,
		);
	}
	_initialiserListePunitions(aInstance) {
		const lColonnes = [];
		lColonnes.push({
			id: DonneesListe_ListePunitions.colonnes.date,
			titre: ObjetTraduction_1.GTraductions.getValeur("fenetrePunition.date"),
			taille: 60,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.colonnes.naturePunition,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.punition",
			),
			taille: "100%",
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.colonnes.motif,
			titre: ObjetTraduction_1.GTraductions.getValeur("fenetrePunition.motif"),
			taille: 120,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.colonnes.demandeur,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.demandeur",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.colonnes.dateProgrammation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.programmeeLe",
			),
			taille: 100,
		});
		lColonnes.push({
			id: DonneesListe_ListePunitions.colonnes.dateRealisation,
			titre: ObjetTraduction_1.GTraductions.getValeur(
				"fenetrePunition.realiseeLe",
			),
			taille: 80,
		});
		aInstance.setOptionsListe({ colonnes: lColonnes, nonEditable: true });
	}
	_evenementListePunitions(aParametres) {
		this.setBoutonActif(
			1,
			aParametres.genreEvenement ===
				Enumere_EvenementListe_1.EGenreEvenementListe.Selection,
		);
	}
	jsxModeleCheckboxSeulementSansDossier() {
		return {
			getValue: () => {
				return !!this.seulementSansDossier;
			},
			setValue: (aValue) => {
				this.seulementSansDossier = aValue;
				this.getInstance(this.identListe).setDonnees(
					new DonneesListe_ListePunitions(
						this.listePunitions,
						this.seulementSansDossier,
					),
				);
			},
		};
	}
	setDonnees(aListePunitions) {
		this.afficher();
		this.setBoutonActif(1, false);
		this.listePunitions = aListePunitions;
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ListePunitions(
				aListePunitions,
				this.seulementSansDossier,
			),
		);
	}
	composeContenu() {
		const H = [];
		H.push(
			IE.jsx.str(
				"div",
				{ class: "flex-contain cols full-height" },
				IE.jsx.str(
					"div",
					{ class: "fix-bloc" },
					IE.jsx.str(
						"ie-checkbox",
						{
							"ie-model": this.jsxModeleCheckboxSeulementSansDossier.bind(this),
						},
						ObjetTraduction_1.GTraductions.getValeur(
							"fenetrePunition.nonAffectees",
						),
					),
				),
				IE.jsx.str("div", {
					class: "fluid-bloc",
					id: this.getNomInstance(this.identListe),
				}),
			),
		);
		return H.join("");
	}
	surValidation(aNumeroBouton) {
		const lPunition = this.listePunitions
			? this.listePunitions.get(
					this.getInstance(this.identListe).getSelection(),
				)
			: null;
		this.callback.appel(aNumeroBouton, lPunition);
		this.fermer();
	}
}
exports.ObjetFenetre_Punition = ObjetFenetre_Punition;
class DonneesListe_ListePunitions extends ObjetDonneesListe_1.ObjetDonneesListe {
	constructor(aDonnees, aSeulementSansDossier) {
		super(aDonnees);
		const lApplicationSco = (0, AccessApp_1.getApp)();
		this.parametresSco = lApplicationSco.getObjetParametres();
		this.seulementSansDossier = aSeulementSansDossier;
		this.setOptions({ avecContenuTronque: true, avecEvnt_Selection: true });
	}
	getVisible(aArticle) {
		return !this.seulementSansDossier || !aArticle.presentDansDossier;
	}
	getValeur(aParams) {
		if (!aParams.article || !aParams.article.getNumero()) {
			return "";
		}
		const lValeur = [];
		switch (aParams.idColonne) {
			case DonneesListe_ListePunitions.colonnes.date:
				return !!aParams.article.dateDemande
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateDemande,
							"%JJ/%MM/%AAAA",
						)
					: "";
			case DonneesListe_ListePunitions.colonnes.naturePunition:
				if (!!aParams.article.naturePunition) {
					lValeur.push(aParams.article.naturePunition.getLibelle());
				}
				if (!!aParams.article.duree) {
					lValeur.push(
						ObjetDate_1.GDate.formatDureeEnMillisecondes(
							UtilitaireDuree_1.TUtilitaireDuree.minEnMs(aParams.article.duree),
						),
					);
				}
				return lValeur.join(" - ");
			case DonneesListe_ListePunitions.colonnes.motif:
				return !!aParams.article.listeMotifs
					? aParams.article.listeMotifs.getTableauLibelles().join(", ")
					: "";
			case DonneesListe_ListePunitions.colonnes.demandeur:
				return aParams.article.demandeur &&
					aParams.article.demandeur.getNumero()
					? aParams.article.demandeur.getLibelle()
					: "";
			case DonneesListe_ListePunitions.colonnes.dateProgrammation:
				if (!!aParams.article.dateProgrammation) {
					lValeur.push(
						ObjetDate_1.GDate.formatDate(
							aParams.article.dateProgrammation,
							"%JJ/%MM/%AAAA",
						),
					);
					if (!!aParams.article.placeExecution) {
						lValeur.push(
							" ",
							ObjetTraduction_1.GTraductions.getValeur("A"),
							" ",
							this.parametresSco.getLibelleHeure(
								aParams.article.placeExecution,
							),
						);
					}
				}
				return lValeur.join("");
			case DonneesListe_ListePunitions.colonnes.dateRealisation:
				return aParams.article.dateRealisation
					? ObjetDate_1.GDate.formatDate(
							aParams.article.dateRealisation,
							"%JJ/%MM/%AAAA",
						)
					: "";
		}
		return "";
	}
}
DonneesListe_ListePunitions.colonnes = {
	date: "DL_ListePunitions_date",
	naturePunition: "DL_ListePunitions_nature",
	motif: "DL_ListePunitions_motif",
	demandeur: "DL_ListePunitions_demandeur",
	dateProgrammation: "DL_ListePunitions_dateProg",
	dateRealisation: "DL_ListePunitions_dateReal",
};
