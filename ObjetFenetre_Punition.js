const { EGenreEvenementListe } = require("Enumere_EvenementListe.js");
const { GDate } = require("ObjetDate.js");
const { ObjetDonneesListe } = require("ObjetDonneesListe.js");
const { ObjetFenetre } = require("ObjetFenetre.js");
const { ObjetListe } = require("ObjetListe.js");
const { GTraductions } = require("ObjetTraduction.js");
const { TUtilitaireDuree } = require("UtilitaireDuree.js");
class ObjetFenetre_Punition extends ObjetFenetre {
	constructor(...aParams) {
		super(...aParams);
		this.seulementSansDossier = false;
	}
	construireInstances() {
		this.identListe = this.add(
			ObjetListe,
			_evenementListePunitions.bind(this),
			_initialiserListePunitions,
		);
	}
	getControleur(aInstance) {
		return $.extend(true, super.getControleur(aInstance), {
			cbPunitionsSansDossier: {
				getValue() {
					return !!aInstance.seulementSansDossier;
				},
				setValue(aDonnees) {
					aInstance.seulementSansDossier = !!aDonnees;
					aInstance
						.getInstance(aInstance.identListe)
						.setDonnees(
							new DonneesListe_ListePunitions(
								aInstance.listePunitions,
								aInstance.seulementSansDossier,
							),
						);
				},
			},
		});
	}
	setDonnees(aListePunitions) {
		this.afficher();
		this.setBoutonActif(1, false);
		this.getInstance(this.identListe).setDonnees(
			new DonneesListe_ListePunitions(
				(this.listePunitions = aListePunitions),
				this.seulementSansDossier,
			),
		);
	}
	composeContenu() {
		const lHtml = [];
		lHtml.push(
			'<div class="flex-contain cols full-height">',
			'<div class="fix-bloc"><ie-checkbox ie-model="cbPunitionsSansDossier">',
			GTraductions.getValeur("fenetrePunition.nonAffectees"),
			"</ie-checkbox></div>",
			'<div class="fluid-bloc" id="',
			this.getNomInstance(this.identListe),
			'"></div>',
			"</div>",
		);
		return lHtml.join("");
	}
	surValidation(aNumeroBouton) {
		this.callback.appel(
			aNumeroBouton,
			this.listePunitions
				? this.listePunitions.get(
						this.getInstance(this.identListe).getSelection(),
					)
				: null,
		);
		this.fermer();
	}
}
function _initialiserListePunitions(aInstance) {
	const lColonnes = [];
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.date,
		titre: GTraductions.getValeur("fenetrePunition.date"),
		taille: 60,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.naturePunition,
		titre: GTraductions.getValeur("fenetrePunition.punition"),
		taille: "100%",
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.motif,
		titre: GTraductions.getValeur("fenetrePunition.motif"),
		taille: 120,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.demandeur,
		titre: GTraductions.getValeur("fenetrePunition.demandeur"),
		taille: 100,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.dateProgrammation,
		titre: GTraductions.getValeur("fenetrePunition.programmeeLe"),
		taille: 100,
	});
	lColonnes.push({
		id: DonneesListe_ListePunitions.colonnes.dateRealisation,
		titre: GTraductions.getValeur("fenetrePunition.realiseeLe"),
		taille: 80,
	});
	aInstance.setOptionsListe({ colonnes: lColonnes, nonEditable: true });
}
function _evenementListePunitions(aParametres) {
	this.setBoutonActif(
		1,
		aParametres.genreEvenement === EGenreEvenementListe.Selection,
	);
}
class DonneesListe_ListePunitions extends ObjetDonneesListe {
	constructor(aDonnees, aSeulementSansDossier) {
		super(aDonnees);
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
					? GDate.formatDate(aParams.article.dateDemande, "%JJ/%MM/%AAAA")
					: "";
			case DonneesListe_ListePunitions.colonnes.naturePunition:
				if (!!aParams.article.naturePunition) {
					lValeur.push(aParams.article.naturePunition.getLibelle());
				}
				if (!!aParams.article.duree) {
					lValeur.push(
						GDate.formatDureeEnMillisecondes(
							TUtilitaireDuree.minEnMs(aParams.article.duree),
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
						GDate.formatDate(
							aParams.article.dateProgrammation,
							"%JJ/%MM/%AAAA",
						),
					);
					if (!!aParams.article.placeExecution) {
						lValeur.push(
							" ",
							GTraductions.getValeur("A"),
							" ",
							GParametres.getLibelleHeure(aParams.article.placeExecution),
						);
					}
				}
				return lValeur.join("");
			case DonneesListe_ListePunitions.colonnes.dateRealisation:
				return aParams.article.dateRealisation
					? GDate.formatDate(aParams.article.dateRealisation, "%JJ/%MM/%AAAA")
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
module.exports = { ObjetFenetre_Punition };
